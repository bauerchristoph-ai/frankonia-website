/*
 * Cloudflare Turnstile, serverseitige Prüfung. 2026-08-26.
 *
 * ⚠️ ERSTER SCHRITT IM HANDLER, vor allem anderen. Nicht aus Ordnungsliebe:
 * jeder Schritt davor wäre Arbeit, die ein Bot auslösen kann — inklusive der
 * API-Aufrufe an HubSpot und Brevo, die Geld und Kontingent kosten.
 *
 * ⚠️ EIN TOKEN IST GENAU EINMAL GÜLTIG. Nicht zwischenspeichern, nicht
 * wiederverwenden. Cloudflare lehnt einen zweiten Aufruf mit
 * `timeout-or-duplicate` ab — was bei einem Doppelklick genau so aussieht wie
 * ein Angriff. Deshalb liegt die Doppelklick-Abwehr im Client (Knopf sperren)
 * und in der Idempotenz-Schicht, NICHT hier.
 *
 * ⚠️ WARUM TURNSTILE UND NICHT reCAPTCHA: Turnstile setzt für die Prüfung
 * keine Cookies und ist deshalb einwilligungsfrei einsetzbar. Ein Spamschutz,
 * der erst nach Cookie-Zustimmung lädt, schützt die Hälfte der Besucher nicht
 * — nämlich alle, die den Banner ignorieren.
 */

const { anfrage } = require("./http");
const { log } = require("./log");

const URL_SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Prüft ein Token.
 * Gibt { ok, grund } zurück. `ok: false` heißt: die Anfrage wird mit 400
 * abgelehnt.
 *
 * ⚠️ FEHLT DER SECRET, wird NICHT durchgelassen. Das ist die unbequeme, aber
 * richtige Richtung: eine fehlende Konfiguration darf keinen offenen Endpoint
 * erzeugen. Der Fall ist im Log als ALARM markiert, weil er bedeutet, dass
 * die Umgebungsvariable in Vercel fehlt — und dann kommt gar keine Anfrage
 * mehr durch, was sofort auffallen muss.
 */
async function verify(token, ip, submissionId) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    log.alarm(submissionId, "turnstile: TURNSTILE_SECRET_KEY fehlt — jede Anfrage wird abgelehnt");
    return { ok: false, grund: "konfiguration" };
  }
  if (!token || typeof token !== "string") {
    return { ok: false, grund: "kein_token" };
  }

  const body = new URLSearchParams({ secret, response: token });
  // Die IP ist optional und wird von Cloudflare nur zur Bewertung genutzt.
  // Sie wird hier nicht protokolliert.
  if (ip) body.set("remoteip", ip);

  const res = await anfrage("turnstile", submissionId, URL_SITEVERIFY, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  // ⚠️ ERREICHBARKEITSFEHLER GEGEN PRÜFUNGSFEHLER UNTERSCHEIDEN, und das ist
  // die eigentliche Entscheidung in dieser Datei. Ist Cloudflare nicht
  // erreichbar (status 0 oder 5xx nach drei Versuchen), dann liegt kein
  // Hinweis auf einen Bot vor — es liegt gar kein Ergebnis vor. Die Anfrage
  // deswegen abzulehnen würde bei einem Cloudflare-Ausfall JEDE echte
  // Anfrage verwerfen, und "eine Anfrage darf nie verloren gehen" wiegt
  // schwerer als "kein Spam". Honeypot und Mindestzeit greifen weiter, und
  // der Fall ist im Log sichtbar.
  if (!res.ok && (res.status === 0 || res.status >= 500)) {
    log.warn(submissionId, "turnstile: nicht erreichbar (" + (res.status || res.error) + "), lasse durch");
    return { ok: true, grund: "anbieter_nicht_erreichbar" };
  }

  const erfolg = res.body && res.body.success === true;
  if (!erfolg) {
    const codes = (res.body && res.body["error-codes"]) || [];
    // Die Fehlercodes enthalten keine personenbezogenen Daten.
    log.warn(submissionId, "turnstile: abgelehnt", { codes });
    return { ok: false, grund: codes.join(",") || "abgelehnt" };
  }
  return { ok: true, grund: "ok" };
}

module.exports = { verify, URL_SITEVERIFY };
