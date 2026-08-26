/*
 * Rate-Limiting pro IP, Idempotenz und Mindestzeit. 2026-08-26.
 *
 * ⚠️⚠️ EHRLICHE GRENZE DIESER DATEI, VORWEG: der Zustand liegt IM
 * ARBEITSSPEICHER DER FUNKTIONSINSTANZ. Serverlose Funktionen teilen keinen
 * Speicher, und eine kalte Instanz startet leer. Das heißt:
 *   · Ein Doppelklick wird zuverlässig gefangen, weil beide Klicks binnen
 *     Millisekunden kommen und praktisch immer dieselbe warme Instanz
 *     treffen.
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
const idempotenz = new Map(); // key -> { zeit, antwort }

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

/** Liefert eine gespeicherte Antwort zu diesem Schlüssel, oder null. */
function idempotenzTreffer(key) {
  if (!key) return null;
  aufraeumen(idempotenz, IDEMPOTENZ_MS);
  const e = idempotenz.get(key);
  return e ? e.antwort : null;
}

function idempotenzSpeichern(key, antwort) {
  if (!key) return;
  idempotenz.set(key, { zeit: Date.now(), antwort });
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
  idempotenz.clear();
}

module.exports = {
  clientIp,
  rateLimited,
  idempotenzTreffer,
  idempotenzSpeichern,
  zuSchnell,
  _reset,
  FENSTER_MS,
  MAX_PRO_FENSTER,
  MINDESTZEIT_MS,
};
