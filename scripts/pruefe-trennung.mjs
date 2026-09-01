/* Setzt weiche Trennstriche (&shy;) an den WORTFUGEN deutscher Komposita in
 * Überschriften — und prüft im Bau, dass keine zu lange Überschrift ohne
 * Trennmöglichkeit übrig bleibt.
 *
 * Gemeldet am 01.09.2026 vom Kunden mit Screenshots von
 * /sicherheitsdienst-wuerzburg/ und /sicherheitsdienst-nuernberg/: "Unsere
 * Sicherheitsdie / nstleistungen … der Umbruch muss nach deutscher Grammatik
 * sein, mit Bindestrich … das gibt's öfters, das muss überall korrigiert
 * werden."
 *
 *   node scripts/pruefe-trennung.mjs            prüft dist/ (Bau-Tor)
 *   node scripts/pruefe-trennung.mjs --richten  setzt &shy; in pages/+partials/
 *
 * ⚠️⚠️ WARUM NICHT `hyphens: auto`: im Kontrolltest (Chrome, lang="de", 280 px
 * Spalte, 32 px Schrift) hat `auto` das Wort GAR NICHT getrennt und stattdessen
 * 390 px breit überlaufen lassen — dieser Browser hat kein deutsches
 * Trennwörterbuch. Mit `hyphens: manual` und &shy; kamen genau die drei Zeilen
 * heraus, die der Kunde verlangt hat. Also: die Trennstellen stehen im Text,
 * nicht in der Hoffnung auf ein Wörterbuch.
 *
 * ⚠️ EIN VERZEICHNIS VON WORTFUGEN, KEINE SILBENTRENNUNG. Deutsche Komposita
 * werden aus wenigen Bausteinen gebaut; die stehen unten. Getrennt wird NUR an
 * einer Fuge aus dieser Liste. Alles andere bleibt unangetastet — eine geratene
 * Silbentrennung wäre schlimmer als der Fehler, den sie behebt.
 */
import fs from "node:fs";
import path from "node:path";

const RICHTEN = process.argv.includes("--richten");
const SHY = "&shy;";
const SHY_ZEICHEN = String.fromCharCode(173);

/* Bausteine, an deren VORDERKANTE getrennt werden darf. Reihenfolge zählt: das
   längste Teil zuerst, damit "dienstleistungen" nicht als "dienst" + Rest
   zerfällt, wo "leistungen" die bessere zweite Fuge ist. */
const FUGEN = [
  "dienstleistung", "sicherheitswache", "kontrollsystem", "meldeanlage",
  "meldetechnik", "überwachung", "bewachung", "beratung", "berechtigt",
  "leistung", "kontrolle", "steuerung", "konzept", "technik", "schutz",
  "dienst", "kräfte", "kraft", "personal", "prüfung", "erklärung",
  "verwaltung", "verwahrung", "übergabe", "unterbrechung", "management",
  "organisation", "protokoll", "gespräch", "gebäude", "gewerbe", "kosten",
  "analyse", "formular", "register", "möglichkeit", "veranstaltung",
  "unternehmen", "betrieb", "anlage", "fläche", "standort", "runde",
  "diebstahl", "projekt", "region", "wechsel", "kriterium", "rechnung",
  "verkehr", "objekt", "zentrale", "schicht", "montur", "detektei",
  "detektiv", "plan", "ebene",
  /* Nachgetragen am 01.09.2026, nachdem der erste Lauf zehn Wörter ohne bekannte
     Fuge gemeldet hat — das Tor hat also getan, was es soll. */
  "unternehmer", "messung", "tragbarkeit", "kompetenz", "sicherheit",
  "beilegung", "ausschluss", "vollen", "stätten", "industrie", "übertragbarkeit",
];

function mitFugen(wort) {
  /* Kleinschreibung nur zum Suchen; eingesetzt wird in den Originaltext. */
  const klein = wort.toLowerCase();
  const stellen = [];
  for (const f of FUGEN) {
    let von = 0;
    for (;;) {
      const i = klein.indexOf(f, von);
      if (i < 0) break;
      von = i + 1;
      /* Nicht am Wortanfang und nicht so, dass ein Stummel von unter 3 Zeichen
         übrig bleibt — "Sicher-heit" wäre eine Trennung, die niemand will. */
      if (i >= 3 && wort.length - i >= 3) stellen.push(i);
    }
  }
  const einmalig = [...new Set(stellen)].sort((a, b) => a - b);
  /* Fugen, die zu dicht beieinander liegen, geben unlesbare Fetzen. */
  const gefiltert = [];
  for (const i of einmalig) if (!gefiltert.length || i - gefiltert[gefiltert.length - 1] >= 4) gefiltert.push(i);
  if (!gefiltert.length) return null;
  let raus = "", letzte = 0;
  for (const i of gefiltert) { raus += wort.slice(letzte, i) + SHY; letzte = i; }
  return raus + wort.slice(letzte);
}

/* Ab dieser Länge braucht ein Wort in einer Überschrift eine Trennmöglichkeit.
   Gemessen: bei 32 px Schrift in einer 280 px breiten Spalte (320er Telefon)
   passen rund 14 Zeichen; 18 ist der Wert, ab dem es auch in einer 350 px
   breiten Spalte nicht mehr aufgeht. */
const GRENZE = 18;

function dateien(wurzel, nurIndex) {
  const raus = [];
  (function lauf(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) lauf(p);
      else if (nurIndex ? e.name === "index.html" : e.name.endsWith(".html")) raus.push(p);
    }
  })(wurzel);
  return raus;
}

const quellen = RICHTEN
  ? [...dateien("pages", false), ...dateien("partials", false)]
  : dateien("dist", true);

let stellen = 0, dateienGeaendert = 0;
const offen = [];
const gesetzt = new Map();

for (const f of quellen) {
  const html = fs.readFileSync(f, "utf8");
  let neu = html;

  neu = neu.replace(/<(h1|h2|h3|h4)([^>]*)>([\s\S]*?)<\/\1>/g, (ganz, tag, attr, inhalt) => {
    /* Nur Text zwischen den Tags anfassen, keine Attribute. */
    const teile = inhalt.split(/(<[^>]*>)/);
    let geaendert = false;
    const neuTeile = teile.map((t) => {
      if (t.startsWith("<")) return t;
      return t.replace(/[A-Za-zÄÖÜäöüß]{4,}/g, (wort) => {
        const roh = wort.replace(new RegExp(SHY_ZEICHEN, "g"), "");
        if (roh.length < GRENZE) return wort;
        if (wort.indexOf(SHY_ZEICHEN) > -1) return wort;  /* schon getrennt */
        const mit = mitFugen(roh);
        if (!mit) { offen.push({ f, wort: roh }); return wort; }
        geaendert = true;
        stellen++;
        gesetzt.set(roh, mit);
        return mit;
      });
    });
    return geaendert ? "<" + tag + attr + ">" + neuTeile.join("") + "</" + tag + ">" : ganz;
  });

  if (RICHTEN && neu !== html) { fs.writeFileSync(f, neu); dateienGeaendert++; }
}

if (RICHTEN) {
  console.log("pruefe-trennung --richten: " + stellen + " Stellen in " + dateienGeaendert + " Dateien");
  [...gesetzt].sort().forEach(([roh, mit]) => console.log("  " + roh.padEnd(30) + mit.split(SHY).join("|")));
  if (offen.length) {
    const namen = [...new Set(offen.map((o) => o.wort))];
    console.log("  ⚠️ ohne bekannte Wortfuge, unangetastet: " + namen.join(", "));
  }
  process.exit(0);
}

console.log("pruefe-trennung: " + quellen.length + " Seiten geprueft");
const fehlen = [...new Set(offen.map((o) => o.wort))];
if (fehlen.length) {
  console.error("  " + fehlen.length + " Wörter ab " + GRENZE + " Zeichen in Überschriften ohne Trennmöglichkeit:");
  fehlen.forEach((w) => console.error("    " + w));
  console.error("  Entweder eine Wortfuge in FUGEN ergänzen oder &shy; von Hand setzen.");
  process.exit(1);
}
console.log("  ok   jede lange Überschrift kann an einer Wortfuge trennen");
