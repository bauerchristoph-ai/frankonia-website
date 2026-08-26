/*
 * Feldmodell und serverseitige Validierung. 2026-08-26.
 *
 * ⚠️ SERVERSEITIG, nicht ergänzend: die HTML-Attribute `required` und
 * `type="email"` sind Komfort für den Besucher und keine Prüfung. Wer den
 * Endpoint direkt anspricht, umgeht sie vollständig.
 *
 * ⚠️ `form_type` ist bewusst offen. Später kommen `application`, `callback`,
 * `newsletter` und `download` dazu; jeder neue Typ ist ein Eintrag in
 * FORM_TYPES plus eine Verzweigung in der Verarbeitung, kein Umbau. Deshalb
 * steht das Pflichtfeld-Modell hier als Tabelle je Typ und nicht als eine
 * Kette von if-Abfragen.
 */

// Erlaubte Formulartypen. Ein unbekannter Typ ist ein 400 — sonst könnte
// jemand mit einem erfundenen Typ die Pflichtfeldprüfung umgehen.
const FORM_TYPES = {
  customer_inquiry: {
    pflicht: ["first_name", "last_name", "email", "company", "message"],
  },
};

// Optionale Felder, die übernommen werden. Alles, was hier nicht steht, wird
// verworfen — eine Positivliste, damit ein Angreifer keine unerwarteten
// Felder in HubSpot oder Brevo schreiben kann.
const OPTIONAL = [
  "phone",
  "service",
  "marketing_opt_in",
  "page_url",
  "referrer",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

// Längenbegrenzungen. Nicht kosmetisch: ohne sie kann jemand ein Megabyte in
// ein Textfeld legen, und das landet dann in HubSpot, in Brevo und in einer
// E-Mail.
const MAX = {
  first_name: 80,
  last_name: 80,
  email: 254, // RFC 5321
  phone: 40,
  company: 150,
  message: 5000,
  service: 80,
  page_url: 500,
  referrer: 500,
  utm_source: 150,
  utm_medium: 150,
  utm_campaign: 200,
  utm_content: 200,
  utm_term: 200,
};

/*
 * ⚠️ E-MAIL-PRÜFUNG BEWUSST PRAGMATISCH. Eine RFC-5322-vollständige Regex ist
 * mehrere hundert Zeichen lang, schwer zu prüfen und lehnt in der Praxis mehr
 * echte Adressen ab als sie falsche fängt. Verlangt wird deshalb: genau ein @,
 * davor und danach etwas, im Domainteil ein Punkt mit mindestens zwei Zeichen
 * Endung, keine Leerzeichen. Ob die Adresse existiert, klärt erst die
 * Bestätigungsmail — und das ist die einzige verlässliche Prüfung, die es gibt.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[A-Za-z]{2,}$/;

function text(wert) {
  if (wert == null) return "";
  if (typeof wert === "string") return wert.trim();
  if (typeof wert === "number" || typeof wert === "boolean") return String(wert);
  return "";
}

/**
 * ⚠️ Wahrheitswert aus einem Formular ist NICHT `Boolean(wert)`. Ein
 * Checkbox-Feld kommt als "on", als "true", als true oder gar nicht — und
 * `Boolean("false")` ist true, was bei einer Einwilligung genau der falsche
 * Fehler wäre.
 */
function wahr(wert) {
  if (wert === true) return true;
  const s = text(wert).toLowerCase();
  return s === "true" || s === "on" || s === "1" || s === "ja" || s === "yes";
}

/**
 * Prüft und normalisiert die Eingabe.
 * Gibt { ok: true, daten } oder { ok: false, fehler: [...] } zurück.
 * `fehler` enthält Feldnamen, nie Feldwerte — die Antwort geht an den Client.
 */
function validate(roh) {
  const fehler = [];
  const eingabe = roh && typeof roh === "object" ? roh : {};

  const formType = text(eingabe.form_type) || "customer_inquiry";
  const modell = FORM_TYPES[formType];
  if (!modell) {
    return { ok: false, fehler: ["form_type"] };
  }

  const daten = { form_type: formType };

  for (const feld of modell.pflicht) {
    const wert = text(eingabe[feld]);
    if (!wert) fehler.push(feld);
    else if (MAX[feld] && wert.length > MAX[feld]) fehler.push(feld + ":zu_lang");
    else daten[feld] = wert;
  }

  if (daten.email && !EMAIL_RE.test(daten.email)) {
    // Nicht doppelt melden, wenn das Feld schon als fehlend markiert ist.
    if (!fehler.includes("email")) fehler.push("email");
    delete daten.email;
  }

  for (const feld of OPTIONAL) {
    if (feld === "marketing_opt_in") continue;
    const wert = text(eingabe[feld]);
    if (!wert) continue;
    if (MAX[feld] && wert.length > MAX[feld]) {
      // Zu lange OPTIONALE Angaben werden gekürzt, nicht abgelehnt: eine
      // überlange UTM-Kampagne darf keine echte Anfrage verhindern.
      daten[feld] = wert.slice(0, MAX[feld]);
    } else {
      daten[feld] = wert;
    }
  }

  // Default false, ausdrücklich. Ohne Haken kein Marketing.
  daten.marketing_opt_in = wahr(eingabe.marketing_opt_in);

  // ⚠️ Die Datenschutz-Einwilligung ist der einzige Wahrheitswert, dessen
  // Fehlen die ganze Anfrage ablehnt. Sie ist die Rechtsgrundlage der
  // Verarbeitung; ohne sie darf hier nichts passieren.
  daten.privacy_accepted = wahr(eingabe.privacy_accepted);
  if (!daten.privacy_accepted) fehler.push("privacy_accepted");

  if (!daten.page_url) fehler.push("page_url");

  return fehler.length ? { ok: false, fehler } : { ok: true, daten };
}

module.exports = { validate, FORM_TYPES, OPTIONAL, MAX, EMAIL_RE, wahr, text };
