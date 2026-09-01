/* Findet Stellen, an denen ein Umbruch etwas trennt, das zusammengehoert:
 * eine Zahl und ihre Einheit ("100 %", "26 €", "45 Min"), ein Paragraphzeichen
 * und seine Nummer ("§ 34a"), eine Uhrzeit und ihr "Uhr".
 *
 * Gemeldet am 01.09.2026 vom Kunden mit einem Screenshot, auf dem "zu 100" in
 * einer Zeile stand und "% in Ihrem Interesse" in der naechsten. Sein Auftrag:
 * "das muss da auch ueberall geprueft und angepasst werden, generell solche
 * Sachen." Also nicht die eine Stelle flicken, sondern die Klasse.
 *
 *   node scripts/pruefe-umbruch.mjs            prueft dist/ (Bau-Tor)
 *   node scripts/pruefe-umbruch.mjs --quelle   prueft pages/ + partials/
 *   node scripts/pruefe-umbruch.mjs --richten  setzt geschuetzte Leerzeichen
 *
 * ⚠️⚠️ GESCHUETZT WIRD MIT DEM ECHTEN ZEICHEN U+00A0, NICHT MIT &nbsp;. Der
 * Grund ist die FAQ-Paritaet: jede Antwort steht zweimal in der Seite, sichtbar
 * und im FAQPage-JSON-LD, und beide muessen byte-identisch bleiben. Ein &nbsp;
 * waere im JSON eine Zeichenfolge aus sechs Zeichen und im HTML eines — die
 * Paritaet waere zerrissen. Das echte Zeichen ist in beiden Welten dasselbe.
 * Gegengeprueft mit scripts/pruefe-faq-paritaet.mjs: 258 Paare vorher und
 * nachher identisch.
 *
 * ⚠️ Angefasst wird nur TEXT: Tag-Inneres (also Attribute) bleibt unberuehrt,
 * und von den <script>-Bloecken nur die mit type="application/ld+json" — dort
 * STEHT sichtbarer Text, in allen anderen steht Programm.
 */
import fs from "node:fs";
import path from "node:path";

const RICHTEN = process.argv.includes("--richten");
const QUELLE = process.argv.includes("--quelle") || RICHTEN;
const NBSP = String.fromCharCode(160);

/* Einheiten, die nie allein in eine neue Zeile rutschen duerfen. Absichtlich
   eine Liste und kein Sammelmuster: "1000 Mitarbeiter" darf umbrechen, "100 %"
   nicht — der Unterschied ist, ob das Zeichen ohne seine Zahl sinnlos ist. */
const EINHEITEN = ["%", "€", "km", "m²", "qm", "Std", "Uhr", "Min", "Sek", "kg"];

const MUSTER_ZAHL = new RegExp(
  "(\\d) (" + EINHEITEN.map((e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")(?![A-Za-zÄÖÜäöüß])",
  "g"
);
const MUSTER_PARA = /(§{1,2}) (?=\d)/g;

/* ⚠️ Ein Token-Ende zählt wie eine Ziffer: im Quelltext steht
   "{{price.range}} €/Std.", die Zahl entsteht erst beim Bauen. Ohne diese Zeile
   bleiben 80 Stellen im Ergebnis trennbar, obwohl die Quelle sauber aussieht —
   genau der Fall, der ein Tor gegen dist/ statt gegen pages/ nötig macht. */
const MUSTER_TOKEN = new RegExp(
  "(\\}\\}) (" + EINHEITEN.map((e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")(?![A-Za-zÄÖÜäöüß])",
  "g"
);

/* ⚠️ Und der Fall, in dem BEIDE Seiten Tokens sind: "{{price.range}}
   {{price.unit}}" — die Einheit steht in content/values.json als "€/Std.", also
   greift keines der Muster oben. Absichtlich nur für Token, deren Name auf eine
   Einheit hindeutet; zwei beliebige benachbarte Tokens zusammenzukleben wäre
   falsch. */
const MUSTER_TOKENPAAR = /(\}\}) (\{\{[a-zA-Z.]*(?:unit|Unit|einheit|Einheit)[a-zA-Z.]*\}\})/g;

/* Bereiche, die NICHT angefasst werden: alles zwischen < und >, plus der Inhalt
   jedes <script>/<style>, ausser JSON-LD. */
function geschuetzteBereiche(html) {
  const bereiche = [];
  let i = 0;
  while (i < html.length) {
    const auf = html.indexOf("<", i);
    if (auf < 0) break;
    const zu = html.indexOf(">", auf);
    if (zu < 0) break;
    const tag = html.slice(auf, zu + 1);
    bereiche.push([auf, zu + 1]);                 /* das Tag selbst */
    const name = (tag.match(/^<\/?([a-zA-Z]+)/) || [])[1];
    if (name && /^(script|style)$/i.test(name) && tag[1] !== "/") {
      const jsonLd = /type\s*=\s*"application\/ld\+json"/i.test(tag);
      const ende = html.toLowerCase().indexOf("</" + name.toLowerCase(), zu);
      const bis = ende < 0 ? html.length : ende;
      if (!jsonLd) bereiche.push([zu + 1, bis]);  /* Programm: nicht anfassen */
      i = bis;
      continue;
    }
    i = zu + 1;
  }
  return bereiche;
}

function verarbeite(datei, html) {
  const geschuetzt = geschuetzteBereiche(html);
  const funde = [];
  let neu = "";
  let pos = 0;

  /* Die freien Stuecke sind die Luecken zwischen den geschuetzten Bereichen. */
  const frei = [];
  let cursor = 0;
  for (const [a, b] of geschuetzt) {
    if (a > cursor) frei.push([cursor, a]);
    cursor = Math.max(cursor, b);
  }
  if (cursor < html.length) frei.push([cursor, html.length]);

  for (const [a, b] of frei) {
    neu += html.slice(pos, a);
    let text = html.slice(a, b);
    for (const [muster, ersatz] of [
      [MUSTER_ZAHL, "$1" + NBSP + "$2"],
      [MUSTER_TOKEN, "$1" + NBSP + "$2"],
      [MUSTER_TOKENPAAR, "$1" + NBSP + "$2"],
      [MUSTER_PARA, "$1" + NBSP],
    ]) {
      muster.lastIndex = 0;
      let m;
      while ((m = muster.exec(text))) {
        funde.push({
          stelle: m[0].trim(),
          um: text.slice(Math.max(0, m.index - 24), m.index + m[0].length + 14).replace(/[ \t\r\n]+/g, " "),
        });
      }
      text = text.replace(muster, ersatz);
    }
    neu += text;
    pos = b;
  }
  neu += html.slice(pos);
  return { funde, neu };
}

function dateien(wurzel, endung) {
  const raus = [];
  (function lauf(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) lauf(p);
      else if (e.name.endsWith(endung)) raus.push(p);
    }
  })(wurzel);
  return raus;
}

const quellen = QUELLE
  ? [...dateien("pages", ".html"), ...dateien("partials", ".html")]
  : dateien("dist", ".html");

/* ⚠️ content/values.json gehört dazu, und zwar getrennt: dort steht
   "20–6 Uhr" als EIN Tokenwert, also findet keine Prüfung im Markup ihn. Nur
   Zeichenketten werden angefasst, nie ein Schlüssel — sonst zeigt ein Token
   plötzlich auf einen Namen, den niemand mehr schreibt. */
if (RICHTEN) {
  const F = "content/values.json";
  const roh = fs.readFileSync(F, "utf8");
  MUSTER_ZAHL.lastIndex = 0;
  const neu = roh.replace(/: (".*?")(,?)$/gm, (ganz, wert, komma) => {
    MUSTER_ZAHL.lastIndex = 0;
    const g = wert.replace(MUSTER_ZAHL, "$1" + NBSP + "$2");
    if (g !== wert) console.log("  values.json: " + wert + " -> " + g);
    return ": " + g + komma;
  });
  if (neu !== roh) {
    JSON.parse(neu); /* muss weiter gültiges JSON sein */
    fs.writeFileSync(F, neu);
  }
}

let gesamt = 0, gerichtet = 0;
const proDatei = new Map();
for (const f of quellen) {
  const html = fs.readFileSync(f, "utf8");
  const { funde, neu } = verarbeite(f, html);
  if (!funde.length) continue;
  gesamt += funde.length;
  proDatei.set(f, funde);
  if (RICHTEN && neu !== html) { fs.writeFileSync(f, neu); gerichtet++; }
}

if (RICHTEN) {
  console.log("pruefe-umbruch --richten: " + gesamt + " Stellen in " + gerichtet + " Dateien geschuetzt");
  const summe = new Map();
  for (const funde of proDatei.values())
    funde.forEach((x) => summe.set(x.stelle, (summe.get(x.stelle) || 0) + 1));
  [...summe].sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log("  " + String(v).padStart(4) + "x  " + k));
  process.exit(0);
}

console.log("pruefe-umbruch: " + quellen.length + " Dateien geprueft");
if (!gesamt) {
  console.log("  ok   Zahl und Einheit, Paragraph und Nummer haengen zusammen");
  process.exit(0);
}
console.error("  " + gesamt + " trennbare Stellen:");
for (const [f, funde] of proDatei) {
  console.error("    " + f);
  funde.slice(0, 5).forEach((x) => console.error("      '" + x.stelle + "'  …" + x.um + "…"));
  if (funde.length > 5) console.error("      … und " + (funde.length - 5) + " weitere");
}
process.exit(1);
