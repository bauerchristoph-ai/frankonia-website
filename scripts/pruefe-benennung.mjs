/* Prueft, dass URL, <title>, <h1>, canonical und Brotkrumen einer Seite
 * dieselbe Leistung und denselben Ort nennen — und dass keine FREMDE Stadt
 * dort auftaucht, wo sie nicht hingehoert.
 *
 * Laeuft im Bau ueber dist/. Der Kunde hat das am 01.09.2026 als Handpunkt auf
 * der Prueferliste gesehen und zu Recht gefragt, warum das nicht die Maschine
 * macht — genau dafuer ist es geeignet: es ist eine Aussage ueber Zeichen, die
 * sich vergleichen lassen, nicht ueber Aussehen.
 */
import fs from "node:fs";
import path from "node:path";

const WURZEL = process.argv[2] || "dist";

/* Umlaute: die URL schreibt sie aus, der sichtbare Text nicht. Das ist die
   dokumentierte Regel des Projekts (CLAUDE.md, URL-Struktur), also muss die
   Prueflogik sie kennen statt sie zu bemaengeln. */
const ORTE = {
  wuerzburg: "Würzburg", nuernberg: "Nürnberg", fuerth: "Fürth",
  bamberg: "Bamberg", bayreuth: "Bayreuth", coburg: "Coburg",
  erlangen: "Erlangen", forchheim: "Forchheim", schweinfurt: "Schweinfurt",
  ansbach: "Ansbach",
};
const LEISTUNGEN = {
  werkschutz: "Werkschutz", objektschutz: "Objektschutz",
  brandwache: ["Brandwache", "Brandsicherheitswache"],
  baustellenbewachung: "Baustellenbewachung",
  sicherheitstechnik: "Sicherheitstechnik",
  kaufhausdetektei: ["Kaufhausdetektei", "Kaufhausdetektiv"],
  veranstaltungsschutz: "Veranstaltungsschutz",
  empfangsdienst: "Empfangsdienst",
  interventionsdienst: "Interventionsdienst",
  "revier-schliessdienst": ["Revier", "Schließdienst"],
  sicherheitsdienst: "Sicherheitsdienst",
};

function seiten(dir, pfad = "") {
  const raus = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) raus.push(...seiten(path.join(dir, e.name), pfad + e.name + "/"));
    else if (e.name === "index.html") raus.push({ url: "/" + pfad, datei: path.join(dir, e.name) });
  }
  return raus;
}

/* ⚠️ Weiche Trennstriche müssen VOR dem Vergleich raus, sonst findet die Prüfung
   "Baustellenbewachung" nicht mehr in "Baustellen&shy;bewachung" — genau dieser
   Fehlalarm ist am 01.09.2026 aufgetreten, als die Trennstellen gesetzt wurden.
   Beide Schreibweisen entfernen: die Entity und das Zeichen U+00AD selbst. */
const ohneTags = (s) =>
  s
    .replace(/<[^>]*>/g, " ")
    .split("&shy;").join("")
    .split(String.fromCharCode(173)).join("")
    .replace(/&nbsp;/g, " ")
    .split(String.fromCharCode(160)).join(" ")
    .replace(/\s+/g, " ")
    .trim();
const erstes = (html, re) => { const m = html.match(re); return m ? m[1] : null; };

/* Welche Kennzeichen erwartet diese URL? */
function erwartet(url) {
  const slug = url.replace(/^\/|\/$/g, "").split("/").pop() || "index";
  const ort = Object.keys(ORTE).find((o) => slug.endsWith("-" + o));
  let rest = ort ? slug.slice(0, -(ort.length + 1)) : slug;
  const leistung = Object.keys(LEISTUNGEN).find((l) => rest === l);
  return { slug, ort, leistung };
}

const alle = seiten(WURZEL).sort((a, b) => a.url.localeCompare(b.url));
const fehler = [];
let geprueft = 0;

for (const s of alle) {
  const html = fs.readFileSync(s.datei, "utf8");
  const { slug, ort, leistung } = erwartet(s.url);
  if (!ort && !leistung) continue;           /* Seiten ohne Ort/Leistung im Slug */
  geprueft++;

  const titel = ohneTags(erstes(html, /<title>([\s\S]*?)<\/title>/) || "");
  const h1 = ohneTags(erstes(html, /<h1[^>]*>([\s\S]*?)<\/h1>/) || "");
  const canonical = erstes(html, /<link rel="canonical" href="([^"]+)"/) || "";
  const krumen = ohneTags(erstes(html, /<nav[^>]*class="[^"]*breadcrumbs[^"]*"[\s\S]*?<\/nav>/) || "");
  const rumpf = ohneTags((html.match(/<main[\s\S]*?<\/main>/) || [""])[0]);

  const meldung = (was) => fehler.push(s.url.padEnd(38) + was);

  /* 1. Der Ort der URL muss in Titel und H1 stehen. */
  if (ort) {
    const name = ORTE[ort];
    if (!titel.includes(name)) meldung("Ort '" + name + "' fehlt im <title>: " + titel.slice(0, 60));
    if (!h1.includes(name)) meldung("Ort '" + name + "' fehlt im <h1>: " + h1.slice(0, 60));
    /* 2. Und keine FREMDE Stadt darf im Titel oder H1 stehen. */
    for (const [k, fremd] of Object.entries(ORTE)) {
      if (k === ort) continue;
      if (titel.includes(fremd)) meldung("fremde Stadt '" + fremd + "' im <title>");
      if (h1.includes(fremd)) meldung("fremde Stadt '" + fremd + "' im <h1>");
    }
  }

  /* 3. Die Leistung der URL muss in Titel und H1 stehen. */
  if (leistung) {
    const woerter = [].concat(LEISTUNGEN[leistung]);
    if (!woerter.some((w) => titel.includes(w))) meldung("Leistung '" + woerter[0] + "' fehlt im <title>");
    if (!woerter.some((w) => h1.includes(w))) meldung("Leistung '" + woerter[0] + "' fehlt im <h1>: " + h1.slice(0, 60));
  }

  /* 4. Canonical muss auf genau diese Adresse zeigen. */
  if (canonical && !canonical.endsWith(s.url)) meldung("canonical zeigt woanders hin: " + canonical);

  /* 5. Die Brotkrume darf keine fremde Stadt nennen. */
  if (ort && krumen) {
    for (const [k, fremd] of Object.entries(ORTE)) {
      if (k !== ort && krumen.includes(fremd)) meldung("fremde Stadt '" + fremd + "' in der Brotkrume");
    }
  }

  /* 6. Der Ort muss auch im Text vorkommen, nicht nur in der Ueberschrift. */
  if (ort && (rumpf.split(ORTE[ort]).length - 1) < 3)
    meldung("Ort '" + ORTE[ort] + "' steht nur " + (rumpf.split(ORTE[ort]).length - 1) + "x im Text");
}

console.log("pruefe-benennung: " + geprueft + " Seiten mit Ort oder Leistung im Slug geprueft");
if (fehler.length) {
  console.error("  " + fehler.length + " Abweichungen:");
  fehler.forEach((f) => console.error("    " + f));
  process.exit(1);
}
console.log("  ok   Adresse, Titel, H1, canonical und Brotkrume nennen dasselbe");
