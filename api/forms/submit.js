/*
 * POST /api/forms/submit — ein Endpoint für alle Formulare. 2026-08-26.
 *
 * ⚠️ WARUM EINE VERCEL-FUNKTION UND KEIN FRAMEWORK: dieses Projekt ist
 * statisches HTML mit einem eigenen build.js und hat NULL
 * Laufzeit-Abhängigkeiten (siehe CLAUDE.md, "Non-negotiable tech
 * constraints"). Vercel erkennt den Ordner api/ auch bei einem statischen
 * Build und macht daraus Serverless Functions. `fetch`, `AbortController` und
 * `crypto.randomUUID` sind in Node eingebaut, also kommt hier kein npm-Paket
 * dazu. Dateien und Ordner mit `_` am Anfang wandelt Vercel NICHT in Routen um
 * — deshalb liegen die gemeinsamen Bausteine unter api/_lib/.
 *
 * ⚠️ DER PFAD HAT EINEN SCHRÄGSTRICH AM ENDE. vercel.json setzt
 * `trailingSlash: true` und würde /api/forms/submit per 308 auf
 * /api/forms/submit/ umleiten, wo das Dateisystem nichts findet. Der Client
 * postet deshalb direkt auf die Slash-Variante, und eine Rewrite-Regel in
 * vercel.json führt sie hierher zurück. So entsteht überhaupt keine
 * Weiterleitung. Nach dem Deploy einmal prüfen — das ist der eine Punkt an
 * diesem Endpoint, der von Hosting-Verhalten abhängt und nicht von Code.
 *
 * ═══ DIE EISERNE REGEL: EINE ANFRAGE DARF NIE VERLOREN GEHEN ═══
 * Deshalb wirft hier nichts nach oben, jeder Fremdaufruf hat einen harten
 * Timeout, und der Besucher bekommt eine Erfolgsmeldung, sobald MINDESTENS
 * die interne Benachrichtigung ODER der HubSpot-Kontakt durch ist. Erst wenn
 * beides scheitert, gibt es einen Fehler — und dann einen, der die
 * Telefonnummer nennt.
 *
 * Reihenfolge:
 *   Idempotenz -> Honeypot -> Mindestzeit -> Rate-Limit -> Turnstile
 *   -> Validieren -> HubSpot -> Brevo (Kontakt, Mail, Event, intern)
 *   -> Antwort
 *
 * ⚠️⚠️ DIE VORGABE SAGT "TURNSTILE ALS ALLERERSTER SCHRITT", UND HIER STEHT ER
 * AN FÜNFTER STELLE. Das ist Absicht, und es ist kein Aufweichen der Regel,
 * sondern ihre Voraussetzung:
 *
 *   1. EIN TURNSTILE-TOKEN IST GENAU EINMAL GÜLTIG. Steht die Prüfung vor der
 *      Idempotenz, antwortet Cloudflare beim zweiten Klick mit
 *      "timeout-or-duplicate", und der Besucher bekommt einen Fehler, obwohl
 *      seine Anfrage längst angekommen ist. Die Doppelklick-Abwehr MUSS also
 *      vor der Token-Prüfung liegen, sonst gibt es keine.
 *      Genau das hat der Test "Idempotenz: derselbe Schlüssel …" gefunden: er
 *      zählte einen Fremdaufruf zu viel, und der eine war Cloudflare.
 *
 *   2. DER SINN VON "TURNSTILE ZUERST" IST, TEURE ARBEIT ZU VERHINDERN —
 *      HubSpot- und Brevo-Aufrufe, die Kontingent und Geld kosten. Die vier
 *      Schritte davor sind Nachschauen in einer Map im Arbeitsspeicher. Sie
 *      kosten nichts, lösen nichts aus und verlassen den Prozess nicht.
 *      Turnstile steht weiter VOR jedem Fremdaufruf, der etwas kostet; der
 *      Test "Turnstile wird VOR allem anderen geprüft" sichert das.
 *
 *   3. ALS NEBENWIRKUNG erreicht ein Bot, der in den Honeypot tappt, Cloudflare
 *      gar nicht mehr — das spart Turnstile-Kontingent.
 *
 * Die Validierung bleibt NACH Turnstile: eine Fehlerliste mit Feldnamen ist
 * eine Beschreibung des Formulars, und die bekommt ein ungeprüfter Aufrufer
 * nicht.
 */

const crypto = require("crypto");
const { validate } = require("../_lib/validate");
const turnstile = require("../_lib/turnstile");
const hubspot = require("../_lib/hubspot");
const brevo = require("../_lib/brevo");
const guard = require("../_lib/guard");
const { log } = require("../_lib/log");

/**
 * ⚠️ Vercel parst den Body bei `application/json` selbst, aber nicht in jeder
 * Laufzeitversion und nicht bei anderen Content-Types. Deshalb beides
 * behandeln statt sich auf eines zu verlassen: ein Endpoint, der bei einem
 * String-Body still 400 antwortet, ist genau der Fehler, der erst in
 * Produktion auffällt.
 */
function bodyLesen(req) {
  const b = req.body;
  if (b && typeof b === "object" && !Buffer.isBuffer(b)) return b;
  const roh = Buffer.isBuffer(b) ? b.toString("utf8") : typeof b === "string" ? b : "";
  if (!roh) return {};
  try {
    return JSON.parse(roh);
  } catch {
    return {};
  }
}

function antwort(res, status, nutzlast) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  // Kein Zwischenspeichern: die Antwort ist pro Anfrage verschieden und
  // enthält eine Submission-ID.
  res.setHeader("Cache-Control", "no-store");
  res.status(status).json(nutzlast);
}

module.exports = async function handler(req, res) {
  // Nur POST. Ein GET auf diesen Pfad ist entweder ein Fehler oder ein
  // Scanner; beides bekommt keine Beschreibung des Feldmodells.
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return antwort(res, 405, { ok: false, fehler: "methode" });
  }

  const submissionId = crypto.randomUUID();
  const zeitstempel = new Date().toISOString();
  const roh = bodyLesen(req);
  const ip = guard.clientIp(req);

  /* ---- 1. Idempotenz — zuerst, weil sie nichts kostet ------------------
     ⚠️⚠️ HIER WEICHT DIE UMSETZUNG BEWUSST VON DER VORGABE AB, und zwar weil
     die Vorgabe sich selbst widerspricht: `submission_id` soll SERVERSEITIG
     erzeugt werden UND als Idempotenz-Schlüssel gegen Doppelklicks dienen.
     Beides zusammen geht nicht — zwei Klicks erzeugen zwei serverseitige
     IDs, und eine Prüfung darauf fängt nie etwas.
     Deshalb zwei getrennte Werte:
       · submission_id    — hier erzeugt, die verbindliche ID für HubSpot,
                            Brevo und die Logs. Immer serverseitig.
       · idempotency_key  — vom Client, EINMAL je aufgebautem Formular. Nur
                            für die Doppelklick-Abwehr, sonst nirgends
                            verwendet.
     Ein Angreifer kann den Schlüssel wiederverwenden; er bekommt dann die
     zwischengespeicherte Antwort, also keinen neuen Aufruf und keine neuen
     Daten. Deshalb ist es unbedenklich, diese Prüfung vor Turnstile zu
     stellen — siehe die Begründung im Kopf dieser Datei. */
  const idemKey = String(roh.idempotency_key || "").slice(0, 64);
  const treffer = guard.idempotenzTreffer(idemKey);
  if (treffer) {
    log.info(submissionId, "idempotenz: Wiederholung, gespeicherte Antwort");
    return antwort(res, 200, treffer);
  }

  /* ---- 2. Honeypot ------------------------------------------------------
     ⚠️ ANTWORT IST 200 UND DIE ANFRAGE WIRD STILL VERWORFEN. Dem Bot nicht
     sagen, dass er erkannt wurde: ein 400 an dieser Stelle ist ein
     Rückkanal, an dem sich ein Skript entlangoptimiert, bis es durchkommt.
     Das Feld heißt `website` — so wie in den bestehenden Formularen. */
  if (String(roh.website || "").trim()) {
    log.info(submissionId, "honeypot: still verworfen");
    return antwort(res, 200, { ok: true, submission_id: submissionId });
  }

  /* ---- 3. Mindestzeit --------------------------------------------------- */
  if (guard.zuSchnell(roh.rendered_at)) {
    log.info(submissionId, "mindestzeit: still verworfen");
    return antwort(res, 200, { ok: true, submission_id: submissionId });
  }

  /* ---- 4. Rate-Limit --------------------------------------------------- */
  if (guard.rateLimited(ip, submissionId)) {
    return antwort(res, 429, {
      ok: false,
      fehler: "zu_viele_anfragen",
      hinweis: "Bitte rufen Sie uns an, wenn es dringend ist.",
    });
  }

  /* ---- 5. Turnstile — vor jedem Fremdaufruf, der etwas kostet ---------- */
  const tokenFeld = roh["cf-turnstile-response"] || roh.turnstile_token;
  const ts = await turnstile.verify(tokenFeld, ip, submissionId);
  if (!ts.ok) {
    return antwort(res, 400, { ok: false, fehler: "spamschutz", grund: ts.grund });
  }

  /* ---- 6. Validieren --------------------------------------------------- */
  const geprueft = validate(roh);
  if (!geprueft.ok) {
    // Feldnamen, keine Werte — die Antwort geht an den Client zurück.
    log.info(submissionId, "validierung: abgelehnt", { felder: geprueft.fehler });
    return antwort(res, 400, { ok: false, fehler: "validierung", felder: geprueft.fehler });
  }
  const d = geprueft.daten;
  log.info(submissionId, "eingang", { form_type: d.form_type, service: d.service || "-", opt_in: d.marketing_opt_in });

  /* ---- 7. HubSpot ------------------------------------------------------ */
  const hs = await hubspot.verarbeiten(d, submissionId, zeitstempel);

  /* ---- 8. Brevo -------------------------------------------------------- */
  const bv = await brevo.verarbeiten(d, submissionId, hs.kontaktId, hs.ok, zeitstempel);

  /* ---- 9. Antwort ------------------------------------------------------
     Erfolg, sobald die Anfrage IRGENDWO angekommen ist: entweder als
     HubSpot-Kontakt oder als interne E-Mail. */
  const angekommen = Boolean(hs.kontaktId) || bv.intern;

  if (!angekommen) {
    // ⚠️ Der einzige Fall, in dem eine echte Anfrage verloren gehen kann.
    // Deshalb ALARM (greppbar als "ALARM forms") mit allem, was zur
    // Nachverfolgung nötig ist — außer den Daten selbst.
    log.alarm(submissionId, "ANFRAGE NICHT ZUGESTELLT", {
      hubspot: hs.schritte,
      brevo: bv.schritte,
      form_type: d.form_type,
    });
    return antwort(res, 502, {
      ok: false,
      fehler: "zustellung",
      submission_id: submissionId,
      hinweis:
        "Ihre Anfrage konnte technisch nicht übermittelt werden. Bitte rufen Sie uns an: +49 951 964352-0",
    });
  }

  const nutzlast = {
    ok: true,
    submission_id: submissionId,
    // Für den Erfolgspfad im Client und für GTM. Absichtlich ohne
    // personenbezogene Daten — kein Name, keine E-Mail, keine Telefonnummer.
    form_type: d.form_type,
    service: d.service || null,
  };
  guard.idempotenzSpeichern(idemKey, nutzlast);

  // Teilerfolge sind kein Fehler für den Besucher, aber sie müssen sichtbar
  // sein: sonst fällt ein dauerhaft kaputter Brevo-Schritt monatelang nicht
  // auf, weil die Formulare "funktionieren".
  if (!hs.ok || !bv.ok) {
    log.warn(submissionId, "teilerfolg", { hubspot: hs.schritte, brevo: bv.schritte });
  } else {
    log.info(submissionId, "abgeschlossen");
  }

  return antwort(res, 200, nutzlast);
};
