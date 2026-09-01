/* Jede FAQ-Antwort steht ZWEIMAL in der Seite: sichtbar im <details> und noch
 * einmal im FAQPage-JSON-LD für Google. Weichen die beiden voneinander ab,
 * bekommt die Suchmaschine einen anderen Text als der Besucher — und genau das
 * ist die Sorte Fehler, die niemandem auffällt.
 *
 * Diese Parität war bisher NUR VON HAND nachgezählt (im Prüfprotokoll mehrfach
 * dokumentiert: 59/59, 96/96, 46/46). Ein Tor daraus zu machen war überfällig,
 * und es wurde dringend, als am 01.09.2026 geschützte Leerzeichen in die Texte
 * gesetzt wurden: eine Änderung, die den sichtbaren Text anfasst, muss den
 * JSON-LD-Text mitnehmen, sonst reisst sie die Parität auf.
 *
 *   node scripts/pruefe-faq-paritaet.mjs [wurzel]
 */
import fs from "node:fs";
import path from "node:path";

const WURZEL = process.argv[2] || "dist";

function dateien(wurzel) {
  const raus = [];
  (function lauf(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) lauf(p);
      else if (e.name === "index.html") raus.push(p);
    }
  })(wurzel);
  return raus;
}

/* Sichtbarer Text: Tags weg, Entities auf ihr Zeichen, Leerraum vereinheitlicht.
   ⚠️ &nbsp; wird zu U+00A0 und NICHT zu einem normalen Leerzeichen — sonst
   würde das Tor genau den Unterschied verschlucken, den es finden soll. */
const ENTITIES = {
  "&nbsp;": " ", "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"',
  "&#39;": "'", "&shy;": "­", "&euro;": "€", "&sect;": "§",
};
function alsText(html) {
  let s = html.replace(/<[^>]*>/g, "");
  for (const [e, z] of Object.entries(ENTITIES)) s = s.split(e).join(z);
  s = s.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
  /* Zeilenumbrüche und Einrückung des Markups sind kein Textunterschied. */
  return s.replace(/[ \t\r\n]+/g, " ").trim();
}

let seiten = 0, paare = 0;
const fehler = [];

for (const f of dateien(WURZEL)) {
  const html = fs.readFileSync(f, "utf8");
  const url = "/" + path.relative(WURZEL, path.dirname(f)).split(path.sep).join("/").replace(/^$/, "") + "/";

  /* 1. Die Antworten aus dem JSON-LD holen. */
  const bloecke = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const ausSchema = [];
  for (const b of bloecke) {
    let daten;
    try { daten = JSON.parse(b[1]); } catch { fehler.push(url + "  JSON-LD ist kein gültiges JSON"); continue; }
    const knoten = [];
    (function sammle(x) {
      if (Array.isArray(x)) return x.forEach(sammle);
      if (!x || typeof x !== "object") return;
      if (x["@type"] === "Question" && x.acceptedAnswer) knoten.push(x);
      Object.values(x).forEach(sammle);
    })(daten);
    for (const k of knoten) {
      const t = (k.acceptedAnswer && k.acceptedAnswer.text) || "";
      ausSchema.push({ frage: alsText(String(k.name || "")), antwort: alsText(String(t)) });
    }
  }
  if (!ausSchema.length) continue;
  seiten++;

  /* 2. Die sichtbaren Antworten holen. */
  const sichtbar = [];
  for (const m of html.matchAll(/<details[^>]*class="[^"]*faq-item[^"]*"[\s\S]*?<\/details>/g)) {
    const block = m[0];
    const frage = alsText((block.match(/<summary[\s\S]*?<\/summary>/) || [""])[0]);
    const antwort = alsText(block.replace(/<summary[\s\S]*?<\/summary>/, ""));
    sichtbar.push({ frage, antwort });
  }

  if (sichtbar.length !== ausSchema.length) {
    fehler.push(url + "  " + sichtbar.length + " sichtbare Antworten, " + ausSchema.length + " im Schema");
    continue;
  }

  for (let i = 0; i < ausSchema.length; i++) {
    paare++;
    const s = sichtbar[i], j = ausSchema[i];
    if (s.antwort !== j.antwort) {
      /* Erste abweichende Stelle nennen, damit man nicht sucht. */
      let k = 0;
      while (k < s.antwort.length && k < j.antwort.length && s.antwort[k] === j.antwort[k]) k++;
      fehler.push(
        url + "  Antwort " + (i + 1) + " weicht ab ab Zeichen " + k +
        "\n        sichtbar: …" + JSON.stringify(s.antwort.slice(Math.max(0, k - 24), k + 26)) +
        "\n        Schema:   …" + JSON.stringify(j.antwort.slice(Math.max(0, k - 24), k + 26))
      );
    }
  }
}

console.log("pruefe-faq-paritaet: " + paare + " Antwortpaare auf " + seiten + " Seiten");
if (fehler.length) {
  console.error("  " + fehler.length + " Abweichungen:");
  fehler.forEach((f) => console.error("    " + f));
  process.exit(1);
}
console.log("  ok   sichtbarer Text und JSON-LD sind byte-identisch");
