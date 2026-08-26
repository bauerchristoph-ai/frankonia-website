/*
 * Rate-Limiting pro IP, Idempotenz und Mindestzeit. 2026-08-26.
 *
 * ⚠️⚠️ EHRLICHE GRENZE DIESER DATEI, VORWEG: der Zustand liegt IM
 * ARBEITSSPEICHER DER FUNKTIONSINSTANZ. Serverlose Funktionen teilen keinen
 * Speicher, und eine kalte Instanz startet leer. Das heißt:
 *   · Ein Doppelklick wird gefangen, weil beide Klicks binnen Millisekunden
 *     kommen und damit praktisch immer dieselbe warme Instanz treffen. Auf
 *     zwei Instanzen verteilt greift die Sperre NICHT — dann entstehen zwei
 *     Kontakte. HubSpot führt sie über die E-Mail zusammen, Brevo ebenso;
 *     doppelt wären nur die Notiz und die Bestätigungsmail.
 *   · Ein verteilter Angriff von vielen IPs wird NICHT gefangen; dagegen
 *     hilft Turnstile, nicht diese Datei.
 *   · Ein hartnäckiger Angreifer von einer IP kann das Limit umgehen, indem
 *     er lange genug wartet, bis Vercel eine neue Instanz startet.
 *
 * Der Auftrag verlangt ausdrücklich ein "einfaches Rate-Limiting pro IP", und
 * das ist es. Wer eine belastbare Zusicherung braucht, braucht einen
 * gemeinsamen Speicher (Vercel KV oder Upstash Redis) — das wäre die erste
 * Laufzeit-Abhängigkeit dieses Projekts und damit eine Entscheidung des
 * Kunden, nicht eine, die hier nebenbei getroffen wird. Im Bericht vermerkt.
 */

const { log } = require("./log");

// Rate-Limit: so viele Anfragen pro IP im Fenster.
const FENSTER_MS = 10 * 60 * 1000; // 10 Minuten
const MAX_PRO_FENSTER = 5;

// Idempotenz: so lange wird das Ergebnis zu einem Schlüssel behalten.
const IDEMPOTENZ_MS = 10 * 60 * 1000;

// ⚠️ Notbremse für eine Reservierung, die nie abgeschlossen wird — etwa weil
// der Handler eine unerwartete Ausnahme wirft. Ohne sie bliebe der Schlüssel
// bis IDEMPOTENZ_MS blockiert, und der Besucher könnte dasselbe Formular zehn
// Minuten lang nicht erneut abschicken. Der Wert liegt über jeder möglichen
// Laufzeit der Funktion (Vercel bricht vorher ab), greift also im Normalfall
// nie.
const RESERVIERUNG_MS = 30000;

// So lange wartet eine zweite, gleichzeitige Anfrage auf das Ergebnis der
// ersten. Danach gibt sie auf — siehe warten().
const WARTEN_MAX_MS = 25000;

// Mindestzeit zwischen Formularaufruf und Absenden.
// ⚠️ 3 Sekunden ist der Richtwert aus dem Auftrag, und er ist ein Kompromiss:
// ein Mensch, der ein Formular mit Vorname, Nachname, E-Mail, Unternehmen und
// einer Nachricht füllt, braucht deutlich länger. Wer schneller ist, hat
// entweder Autofill benutzt (dann sind 3 Sekunden trotzdem realistisch) oder
// ist ein Skript. Höher zu gehen würde echte Nutzer treffen.
const MINDESTZEIT_MS = 3000;

// ⚠️ Obergrenzen, damit die Maps nicht unbegrenzt wachsen. Eine serverlose
// Instanz kann Stunden leben; ohne diese Grenze wäre das ein Speicherleck mit
// Ansage. Beim Überlauf wird der älteste Eintrag verworfen.
const MAX_EINTRAEGE = 5000;

const ipZaehler = new Map(); // ip -> Zeitstempel[]
const idempotenz = new Map(); // key -> { zeit, ergebnis, warteschlange, loesen, wachhund }

function aufraeumen(map, maxAlter) {
  const jetzt = Date.now();
  for (const [k, v] of map) {
    const zeit = Array.isArray(v) ? v[v.length - 1] : v.zeit;
    if (jetzt - zeit > maxAlter) map.delete(k);
  }
  while (map.size > MAX_EINTRAEGE) map.delete(map.keys().next().value);
}

/**
 * Ermittelt die Client-IP.
 * ⚠️ Hinter Vercel ist `req.socket.remoteAddress` die IP des Proxys, nicht
 * die des Besuchers. Maßgeblich ist `x-forwarded-for`, dessen ERSTER Eintrag
 * der Client ist. Der Wert ist grundsätzlich fälschbar — für ein
 * Komfort-Rate-Limit ist das hinnehmbar, für eine Sicherheitsentscheidung
 * wäre es es nicht. Deshalb hängt hier nichts Sicherheitsrelevantes daran;
 * das leistet Turnstile.
 */
function clientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff) return xff.split(",")[0].trim();
  if (Array.isArray(xff) && xff.length) return String(xff[0]).split(",")[0].trim();
  return (req.socket && req.socket.remoteAddress) || "";
}

/** true, wenn die IP ihr Kontingent ausgeschöpft hat. */
function rateLimited(ip, submissionId) {
  if (!ip) return false;
  aufraeumen(ipZaehler, FENSTER_MS);
  const jetzt = Date.now();
  const liste = (ipZaehler.get(ip) || []).filter((t) => jetzt - t < FENSTER_MS);
  if (liste.length >= MAX_PRO_FENSTER) {
    // ⚠️ Die IP wird NICHT protokolliert — sie ist ein personenbezogenes
    // Datum. Geloggt wird nur, dass das Limit gegriffen hat.
    log.warn(submissionId, "ratelimit: Kontingent erschoepft (" + liste.length + "/" + MAX_PRO_FENSTER + ")");
    ipZaehler.set(ip, liste);
    return true;
  }
  liste.push(jetzt);
  ipZaehler.set(ip, liste);
  return false;
}

/* ============================================ Idempotenz / Doppelklick
 *
 * ⚠️⚠️ DER SCHLÜSSEL WIRD SOFORT RESERVIERT, NICHT ERST BEIM SPEICHERN DER
 * ANTWORT — und das ist der eigentliche Punkt dieses Abschnitts. Vorher stand
 * hier ein reines "gibt es schon eine Antwort?": zwei Klicks im Abstand von
 * Millisekunden fanden beide nichts, arbeiteten beide vollständig durch und
 * erzeugten zwei Kontakte, zwei Notizen und zwei Bestätigungsmails. Die Sperre
 * griff erst, wenn die erste Anfrage bereits FERTIG war — also genau dann
 * nicht, wenn ein Doppelklick passiert.
 *
 * Jetzt gilt: ein Schlüssel wird genau einmal ausgeführt. Wer als Zweiter
 * kommt, wartet auf das Ergebnis des Ersten und bekommt dieselbe Antwort.
 *
 * ⚠️ NUR ERFOLGE WERDEN AUFBEWAHRT, Ablehnungen nicht — und das ist kein
 * Detail. Der Schlüssel entsteht EINMAL JE AUFGEBAUTEM FORMULAR
 * (js/lead-form.js), nicht je Klick. Würde eine Ablehnung zwischengespeichert,
 * könnte derselbe Besucher dasselbe Formular nie mehr abschicken: die zu früh
 * abgesendete Anfrage, das vergessene Pflichtfeld, das abgelaufene
 * Turnstile-Token wären alle endgültig. Eine Ablehnung gibt die Reservierung
 * deshalb wieder frei. Der gleichzeitig wartende Doppelklick sieht sie
 * trotzdem — er hängt am selben Versprechen — nur wird sie nicht konserviert.
 */

function warten(eintrag) {
  return Promise.race([
    eintrag.warteschlange,
    new Promise((r) => {
      const t = setTimeout(() => r(null), WARTEN_MAX_MS);
      if (t.unref) t.unref();
    }),
  ]);
}

/**
 * Beansprucht den Schlüssel. Liefert eines von drei Ergebnissen:
 *   { art: "fertig", ergebnis }   — es gibt schon eine gespeicherte Antwort
 *   { art: "laeuft", warten }     — eine andere Anfrage arbeitet gerade daran
 *   { art: "frei", abschliessen } — reserviert, der Aufrufer ist zuständig
 *
 * ⚠️ OHNE SCHLÜSSEL gibt es "frei" mit einem abschliessen(), das nichts tut.
 * Ein Besucher ohne JavaScript liefert keinen Schlüssel, und der darf deswegen
 * nicht abgewiesen werden.
 */
function idempotenzBeanspruchen(key) {
  if (!key) return { art: "frei", abschliessen: () => {} };
  aufraeumen(idempotenz, IDEMPOTENZ_MS);

  const da = idempotenz.get(key);
  if (da && da.ergebnis) return { art: "fertig", ergebnis: da.ergebnis };
  // Das abschliessen() ist ein Nichtstun und trotzdem wichtig: gibt die erste
  // Anfrage kein Ergebnis zurueck, arbeitet der Wartende selbst weiter und
  // ruft es auf seinen Ausgangspfaden auf. Ohne diesen Platzhalter wuerde er
  // dabei ueber eine fehlende Funktion stolpern.
  if (da && da.warteschlange)
    return { art: "laeuft", warten: () => warten(da), abschliessen: () => {} };

  let loesen;
  const eintrag = {
    zeit: Date.now(),
    ergebnis: null,
    warteschlange: new Promise((r) => {
      loesen = r;
    }),
  };
  eintrag.loesen = loesen;
  // Der Wachhund gibt eine hängengebliebene Reservierung von selbst frei.
  // unref(), damit ein offener Timer weder den Prozess noch einen Testlauf am
  // Leben hält.
  eintrag.wachhund = setTimeout(() => {
    const e = idempotenz.get(key);
    if (e && !e.ergebnis) {
      if (e.loesen) e.loesen(null);
      idempotenz.delete(key);
    }
  }, RESERVIERUNG_MS);
  if (eintrag.wachhund.unref) eintrag.wachhund.unref();
  idempotenz.set(key, eintrag);

  return {
    art: "frei",
    abschliessen: (ergebnis, aufbewahren) => idempotenzAbschliessen(key, ergebnis, aufbewahren),
  };
}

/**
 * Schließt die Reservierung ab. Das Ergebnis ist { status, nutzlast } — der
 * Status muss mit, weil ein wartender Doppelklick auch eine Ablehnung
 * originalgetreu spiegeln soll und die Nutzlast allein den Code nicht kennt.
 */
function idempotenzAbschliessen(key, ergebnis, aufbewahren) {
  if (!key) return;
  const e = idempotenz.get(key);
  if (!e) return; // Der Wachhund war schneller.
  clearTimeout(e.wachhund);
  if (e.loesen) e.loesen(ergebnis || null);
  if (aufbewahren && ergebnis) idempotenz.set(key, { zeit: Date.now(), ergebnis });
  else idempotenz.delete(key);
}

/**
 * Prüft die Mindestzeit. `renderedAt` ist der Zeitstempel, den der Client beim
 * Aufbau des Formulars gesetzt hat.
 *
 * ⚠️ FEHLT DER WERT ODER IST ER UNPLAUSIBEL, wird NICHT abgelehnt. Der Wert
 * kommt vom Client und ist damit nicht vertrauenswürdig; er ist ein Indiz,
 * keine Prüfung. Ein Besucher mit blockiertem JavaScript-Timer oder einer
 * falsch gestellten Systemuhr darf nicht ausgeschlossen werden — das wäre ein
 * verlorener Lead für ein Indiz.
 */
function zuSchnell(renderedAt) {
  const t = Number(renderedAt);
  if (!Number.isFinite(t) || t <= 0) return false;
  const verstrichen = Date.now() - t;
  // Negativ oder absurd groß: Uhr des Clients stimmt nicht, kein Urteil.
  if (verstrichen < 0 || verstrichen > 24 * 60 * 60 * 1000) return false;
  return verstrichen < MINDESTZEIT_MS;
}

/** Nur für Tests: leert den Zustand zwischen den Fällen. */
function _reset() {
  ipZaehler.clear();
  for (const e of idempotenz.values()) {
    if (e.wachhund) clearTimeout(e.wachhund);
    if (e.loesen) e.loesen(null); // sonst wartet ein Test ewig
  }
  idempotenz.clear();
}

module.exports = {
  clientIp,
  rateLimited,
  idempotenzBeanspruchen,
  zuSchnell,
  _reset,
  FENSTER_MS,
  MAX_PRO_FENSTER,
  MINDESTZEIT_MS,
};
