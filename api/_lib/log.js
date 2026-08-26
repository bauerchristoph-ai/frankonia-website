/*
 * Protokollierung ohne personenbezogene Daten. 2026-08-26.
 *
 * ⚠️ DER GANZE ZWECK DIESER DATEI: In Serverlogs dürfen keine
 * personenbezogenen Daten im Klartext stehen. Das ist keine Formalität —
 * Vercel-Logs sind für jeden im Team einsehbar, werden aufbewahrt und sind
 * kein Ort für die E-Mail-Adresse eines Interessenten. Gleichzeitig muss ein
 * Fehler nachvollziehbar bleiben.
 *
 * Der Kompromiss: geloggt wird die `submission_id` (ein Zufallswert ohne
 * Personenbezug) plus der Schritt, der fehlgeschlagen ist. Wer die Anfrage
 * dahinter braucht, findet sie über dieselbe ID in HubSpot — dort gehören die
 * Daten hin, dort sind sie geschützt.
 *
 * ⚠️ NIE `console.log(body)` oder `console.error(err)` mit einem Fehler eines
 * API-Aufrufs: Antworten von HubSpot und Brevo enthalten die gesendeten
 * Feldwerte zurück. Deshalb geht jede Fremd-Antwort durch `redact()`.
 */

// Was maskiert wird. Absichtlich eine Positivliste von MUSTERN und keine
// Feldnamenliste: eine Feldnamenliste schützt nur, was man vorher kennt.
const MUSTER = [
  // E-Mail
  [/[\w.+-]+@[\w-]+\.[\w.-]+/g, "<email>"],
  // Telefonnummern: mindestens 7 Ziffern, optional mit +, Leerzeichen,
  // Klammern, Schrägstrich oder Bindestrich dazwischen.
  // ⚠️ DIE BEIDEN GRENZEN SIND KEINE KOSMETIK. Ohne sie schneidet das Muster
  // mitten in Kennungen, die Ziffern und Bindestriche enthalten: eine
  // HubSpot-correlationId 01a03e48-4ab9-7431-… wurde zu 4ab<tel>b36, also
  // unbrauchbar — und genau die braucht man, um mit dem Support über einen
  // Fehler zu reden. Beobachtet beim Live-Test am 26.08.2026. Eine
  // Telefonnummer steht nie direkt an einem Buchstaben, eine Kennung schon.
  [/(?<![A-Za-z0-9])\+?[\d][\d\s()/-]{6,}\d(?![A-Za-z0-9])/g, "<tel>"],
];

function redactString(s) {
  let out = String(s);
  for (const [re, ersatz] of MUSTER) out = out.replace(re, ersatz);
  return out;
}

/**
 * Maskiert alles, was nach Kontaktdatum aussieht, und kürzt lange Texte.
 * Objekte werden rekursiv behandelt; Schlüssel, die typischerweise Freitext
 * tragen, werden komplett ersetzt statt maskiert — bei einer Nachricht ist
 * der Inhalt selbst das personenbezogene Datum, nicht nur die Adresse darin.
 */
const FREITEXT = new Set(["message", "nachricht", "first_name", "last_name", "firstname", "lastname", "name", "company", "email", "phone"]);

/* ⚠️⚠️ FÜR ANTWORTEN VON FREMD-APIs GILT EIN ZWEITER SATZ, und das Fehlen
   dieses Satzes ist beim Live-Test am 26.08.2026 teuer geworden: `message`
   steht in FREITEXT, weil es das Nachrichtenfeld des Formulars ist — es ist
   ABER auch der Standardschlüssel, unter dem HubSpot und Brevo ihren
   Fehlersatz zurückgeben. Getilgt sah der Log so aus:
     hubspot.einwilligung: 400 endgueltig {"message":"<entfernt>"}
   Der wirkliche Grund war "is already subscribed", also gar kein Fehler
   unseres Codes. Diagnose damit unmöglich.

   Deshalb wird `message` in einer FREMDANTWORT maskiert statt getilgt; die
   Muster für E-Mail und Telefon greifen weiter.
   ⚠️ Bewusst eng gezogen: der Satz gilt nur für api/_lib/http.js, also für
   Antwortkörper von HubSpot, Brevo und Cloudflare. Bei allen drei ist
   `message` der Fehlersatz und nie ein zurückgespiegelter Feldwert. Für
   unsere eigenen Daten bleibt es beim Tilgen — bei der Nachricht eines
   Interessenten ist der Inhalt selbst das personenbezogene Datum, nicht nur
   die Adresse darin. */
const FREITEXT_FREMD = new Set([...FREITEXT].filter((k) => k !== "message" && k !== "nachricht"));

function redact(wert, tiefe = 0, freitext = FREITEXT) {
  if (tiefe > 4) return "<zu tief>";
  if (wert == null) return wert;
  if (typeof wert === "string") {
    const s = redactString(wert);
    return s.length > 300 ? s.slice(0, 300) + "…" : s;
  }
  if (typeof wert !== "object") return wert;
  if (Array.isArray(wert)) return wert.slice(0, 20).map((w) => redact(w, tiefe + 1, freitext));
  const out = {};
  for (const [k, v] of Object.entries(wert)) {
    out[k] = freitext.has(k.toLowerCase()) ? "<entfernt>" : redact(v, tiefe + 1, freitext);
  }
  return out;
}

function zeile(stufe, submissionId, schritt, extra, fremd) {
  const teile = [
    new Date().toISOString(),
    stufe,
    "forms",
    submissionId ? "id=" + submissionId : "id=-",
    schritt,
  ];
  if (extra !== undefined) {
    let s;
    try {
      s =
        typeof extra === "string"
          ? redactString(extra)
          : JSON.stringify(redact(extra, 0, fremd ? FREITEXT_FREMD : FREITEXT));
    } catch {
      s = "<nicht serialisierbar>";
    }
    teile.push(s);
  }
  return teile.join(" ");
}

/* ⚠️ Der vierte Parameter `fremd` sagt: dieses Extra ist der Antwortkörper
   einer Fremd-API, nicht unsere eigenen Formulardaten. Nur dann bleibt
   `message` lesbar (maskiert). Gesetzt wird er ausschließlich in
   api/_lib/http.js — Begründung oben bei FREITEXT_FREMD. */
const log = {
  info: (id, schritt, extra, fremd) => console.log(zeile("INFO", id, schritt, extra, fremd)),
  warn: (id, schritt, extra, fremd) => console.warn(zeile("WARN", id, schritt, extra, fremd)),
  /**
   * ⚠️ `alarm` statt `error` für die Fälle, in denen eine Anfrage verloren
   * gehen KÖNNTE. Das Wort ist absichtlich eigen und greppbar: in den
   * Vercel-Logs nach "ALARM forms" zu suchen ist die Antwort auf die Frage
   * "ist uns eine Anfrage durchgerutscht?". Ein generisches "ERROR" geht
   * zwischen Framework-Rauschen unter.
   */
  alarm: (id, schritt, extra, fremd) => console.error(zeile("ALARM", id, schritt, extra, fremd)),
};

module.exports = { log, redact, redactString };
