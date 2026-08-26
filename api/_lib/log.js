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
  // Klammern, Schrägstrich oder Bindestrich dazwischen
  [/\+?[\d][\d\s()/-]{6,}\d/g, "<tel>"],
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

function redact(wert, tiefe = 0) {
  if (tiefe > 4) return "<zu tief>";
  if (wert == null) return wert;
  if (typeof wert === "string") {
    const s = redactString(wert);
    return s.length > 300 ? s.slice(0, 300) + "…" : s;
  }
  if (typeof wert !== "object") return wert;
  if (Array.isArray(wert)) return wert.slice(0, 20).map((w) => redact(w, tiefe + 1));
  const out = {};
  for (const [k, v] of Object.entries(wert)) {
    out[k] = FREITEXT.has(k.toLowerCase()) ? "<entfernt>" : redact(v, tiefe + 1);
  }
  return out;
}

function zeile(stufe, submissionId, schritt, extra) {
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
      s = typeof extra === "string" ? redactString(extra) : JSON.stringify(redact(extra));
    } catch {
      s = "<nicht serialisierbar>";
    }
    teile.push(s);
  }
  return teile.join(" ");
}

const log = {
  info: (id, schritt, extra) => console.log(zeile("INFO", id, schritt, extra)),
  warn: (id, schritt, extra) => console.warn(zeile("WARN", id, schritt, extra)),
  /**
   * ⚠️ `alarm` statt `error` für die Fälle, in denen eine Anfrage verloren
   * gehen KÖNNTE. Das Wort ist absichtlich eigen und greppbar: in den
   * Vercel-Logs nach "ALARM forms" zu suchen ist die Antwort auf die Frage
   * "ist uns eine Anfrage durchgerutscht?". Ein generisches "ERROR" geht
   * zwischen Framework-Rauschen unter.
   */
  alarm: (id, schritt, extra) => console.error(zeile("ALARM", id, schritt, extra)),
};

module.exports = { log, redact, redactString };
