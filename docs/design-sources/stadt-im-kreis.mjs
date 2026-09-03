/* Erzeugt den Hero-Umriss der Stadtseiten NEU: Landkreis als umschliessende
 * Form, Stadt darin markiert — genau das Bild, das Google Maps fuer
 * "Landkreis Bamberg" zeigt (Kundenwunsch 03.09.2026).
 *
 * ⚠️ EINMALIG, IN DER ENTWICKLUNG. Nicht Teil von `npm run build`.
 *   node docs/design-sources/stadt-im-kreis.mjs            alle
 *   node docs/design-sources/stadt-im-kreis.mjs bamberg    eine
 *   node docs/design-sources/stadt-im-kreis.mjs --schreibe faengt an, in die
 *                                                          Seiten zu schreiben
 *
 * ⚠️ WARUM NODE UND NICHT PYTHON: das Original city-outline.py laeuft auf
 * dieser Maschine nicht — es ist kein Python installiert. Projektion,
 * Vereinfachung und die viewBox-Konvention sind aus jener Datei uebernommen,
 * damit die Umrisse deckungsgleich mit den bisherigen fallen:
 *   - aequirektangulaer mit cos(lat)-Korrektur (auf Stadtgroesse nicht von
 *     Web Mercator zu unterscheiden, und die Form bleibt unverzerrt)
 *   - Douglas-Peucker mit einer Toleranz in viewBox-EINHEITEN, nicht in Grad:
 *     px am Bildschirm = TOLERANZ x (gerenderte Breite / 1000)
 *   - Breite immer 1000 Einheiten, Hoehe daraus abgeleitet
 *
 * ⚠️ DIE VIEWBOX RICHTET SICH JETZT NACH DEM LANDKREIS, nicht mehr nach der
 * Stadt. Beide Formen werden mit DEMSELBEN Faktor und DEMSELBEN Ursprung
 * projiziert — sonst laege die Stadt nicht dort, wo sie hingehoert. Das ist der
 * ganze Trick dieser Datei.
 *
 * ⚠️ NUR 7 DER 10 STAEDTE BEKOMMEN ZWEI FORMEN, und das ist gemessen:
 * Erlangen-Hoechstadt, Landkreis Fuerth und Nuernberger Land liegen NEBEN
 * ihrer Stadt, nicht darum. Geprueft wurde, ob der Stadtmittelpunkt im
 * AEUSSEREN Ring des Kreises liegt — ein gewoehnlicher
 * Punkt-in-Polygon-Test zaehlt Loecher als "draussen" und haette jede
 * kreisfreie Stadt verworfen, obwohl die Stadt im Loch genau das gewuenschte
 * Bild ist. Fehlt die Kreisdatei, bleibt die Seite bei der Stadt allein.
 */
import fs from "node:fs";
import path from "node:path";

const WURZEL = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..", "..");
const GRENZEN = path.join(WURZEL, "assets/data/coverage-boundaries");
const SEITEN = path.join(WURZEL, "pages");

const BREITE = 1000;
const TOLERANZ = 1.0; /* viewBox-Einheiten */

const STAEDTE = {
  ansbach: "Ansbach", bamberg: "Bamberg", bayreuth: "Bayreuth", coburg: "Coburg",
  erlangen: "Erlangen", forchheim: "Forchheim", fuerth: "Fürth",
  nuremberg: "Nürnberg", schweinfurt: "Schweinfurt", wuerzburg: "Würzburg",
};
/* Slug in der Datei -> Slug in den Seitennamen */
const SEITEN_SLUG = { nuremberg: "nuernberg" };

/* Kreisnamen wie Nominatim sie liefert — NICHT aus dem Stadtnamen gebaut: zu
 * Nuernberg gehoert "Nuernberger Land", zu Erlangen "Erlangen-Hoechstadt".
 * Hier stehen nur die sieben, die die Stadt wirklich umschliessen. */
const KREIS_NAME = {
  ansbach: "Landkreis Ansbach", bamberg: "Landkreis Bamberg",
  bayreuth: "Landkreis Bayreuth", coburg: "Landkreis Coburg",
  forchheim: "Landkreis Forchheim", schweinfurt: "Landkreis Schweinfurt",
  wuerzburg: "Landkreis Würzburg",
};

function ringe(geo) {
  if (geo.type === "Polygon") return geo.coordinates;
  return geo.coordinates.flat();
}
function lade(datei) {
  const j = JSON.parse(fs.readFileSync(datei, "utf8"));
  return j.geometry || j;
}
function projiziere(ring, lat0) {
  const k = Math.cos((lat0 * Math.PI) / 180);
  return ring.map(([lon, lat]) => [lon * k, -lat]);
}
function abstand(p, a, b) {
  const [px, py] = p, [ax, ay] = a, [bx, by] = b;
  const dx = bx - ax, dy = by - ay;
  if (dx === 0 && dy === 0) return Math.hypot(px - ax, py - ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}
/* Douglas-Peucker, iterativ — ein Ring mit 12.000 Punkten sprengt die
 * Rekursionstiefe. */
function vereinfache(pts, tol) {
  if (pts.length < 3) return pts;
  const behalten = new Array(pts.length).fill(false);
  behalten[0] = behalten[pts.length - 1] = true;
  const stapel = [[0, pts.length - 1]];
  while (stapel.length) {
    const [i, j] = stapel.pop();
    let max = 0, idx = -1;
    for (let k = i + 1; k < j; k++) {
      const d = abstand(pts[k], pts[i], pts[j]);
      if (d > max) { max = d; idx = k; }
    }
    if (idx > -1 && max > tol) { behalten[idx] = true; stapel.push([i, idx], [idx, j]); }
  }
  return pts.filter((_, i) => behalten[i]);
}
const pfad = (pts) =>
  "M" + pts.map(([x, y], i) => (i ? "L" : "") + x.toFixed(1) + " " + y.toFixed(1)).join(" ") + " Z";

function baue(slug) {
  const stadtDatei = path.join(GRENZEN, slug + ".geojson");
  const kreisDatei = path.join(GRENZEN, slug + "-landkreis.geojson");
  if (!fs.existsSync(stadtDatei)) return { slug, fehler: "Stadtdatei fehlt" };
  const stadt = lade(stadtDatei);
  const kreis = fs.existsSync(kreisDatei) ? lade(kreisDatei) : null;

  /* Rahmen und Faktor kommen vom Kreis, wenn es einen gibt — sonst von der Stadt. */
  const rahmenGeo = kreis || stadt;
  const alleRahmen = ringe(rahmenGeo).flat();
  const lat0 = alleRahmen.reduce((a, p) => a + p[1], 0) / alleRahmen.length;
  const proj = (r) => projiziere(r, lat0);

  const rahmenProj = ringe(rahmenGeo).map(proj);
  const xs = rahmenProj.flat().map((p) => p[0]);
  const ys = rahmenProj.flat().map((p) => p[1]);
  const x0 = Math.min(...xs), y0 = Math.min(...ys);
  const breiteGrad = Math.max(...xs) - x0;
  const hoeheGrad = Math.max(...ys) - y0;
  const faktor = BREITE / breiteGrad;
  const tol = TOLERANZ / faktor;
  const vbH = Math.round(hoeheGrad * faktor);

  const zuEinheiten = (r) =>
    r.map(([x, y]) => [Number(((x - x0) * faktor).toFixed(1)), Number(((y - y0) * faktor).toFixed(1))]);

  const machPfade = (geo) =>
    ringe(geo)
      .map(proj)
      .map((r) => vereinfache(zuEinheiten(r), TOLERANZ))
      .filter((r) => r.length >= 4)
      .map(pfad);

  const kreisPfade = kreis ? machPfade(kreis) : [];
  const stadtPfade = machPfade(stadt);

  /* Mittelpunkt der Stadt in viewBox-Einheiten — Ankerpunkt fuer die
   * Beschriftung, falls sie je in das SVG wandern soll. */
  const sp = ringe(stadt).map(proj).flat().map(([x, y]) => [(x - x0) * faktor, (y - y0) * faktor]);
  const mx = sp.reduce((a, p) => a + p[0], 0) / sp.length;
  const my = sp.reduce((a, p) => a + p[1], 0) / sp.length;

  return {
    slug, name: STAEDTE[slug],
    viewBox: "0 0 " + BREITE + " " + vbH, vbH,
    kreisPfade, stadtPfade,
    stadtMitte: [Math.round(mx), Math.round(my)],
    tolGrad: tol,
    punkte: kreisPfade.reduce((a, p) => a + (p.match(/L/g) || []).length, 0) +
            stadtPfade.reduce((a, p) => a + (p.match(/L/g) || []).length, 0),
  };
}

/* ── Markup fuer eine Seite ───────────────────────────────────────────────── */
export function svgMarkup(b) {
  const zeilen = [];
  zeilen.push(`          <svg class="city-map${b.kreisPfade.length ? " city-map--mit-kreis" : ""}" viewBox="${b.viewBox}" width="${BREITE}" height="${b.vbH}" fill="none" focusable="false">`);
  zeilen.push(`            <line class="city-map__guide" x1="50%" y1="0" x2="50%" y2="100%"></line>`);
  zeilen.push(`            <line class="city-map__guide" x1="0" y1="50%" x2="100%" y2="50%"></line>`);
  for (const p of b.kreisPfade) {
    zeilen.push(`            <path class="city-map__kreis" pathLength="1" d="${p}"></path>`);
  }
  for (const p of b.stadtPfade) {
    zeilen.push(`            <path class="city-map__area" pathLength="1" d="${p}"></path>`);
  }
  zeilen.push(`          </svg>`);

  /* Beschriftung: bei ZWEI Formen eine Legende mit Linienmuster, sonst ein
   * einfaches Label. Zwei Namen ohne Muster sagen nicht, WELCHE Form welche
   * ist — und genau das war der Kern des Wunsches ("dann erkennt man: das ist
   * der Landkreis und da ist die Stadt"). Die Muster tragen im CSS dieselben
   * Deckungswerte wie die Pfade im SVG. */
  const kreisName = KREIS_NAME[b.slug];
  if (b.kreisPfade.length && kreisName) {
    zeilen.push(`          <dl class="city-map__legende">`);
    for (const [klasse, name] of [["kreis", kreisName], ["stadt", "Stadt " + b.name]]) {
      zeilen.push(`            <div class="city-map__legende-zeile">`);
      zeilen.push(`              <dt class="city-map__muster city-map__muster--${klasse}" aria-hidden="true"></dt>`);
      zeilen.push(`              <dd>${name}</dd>`);
      zeilen.push(`            </div>`);
    }
    zeilen.push(`          </dl>`);
  } else {
    zeilen.push(`          <p class="city-map__label">Stadt ${b.name}</p>`);
  }
  return zeilen.join("\n");
}

/* ── Lauf ─────────────────────────────────────────────────────────────────── */
const args = process.argv.slice(2);
const schreibe = args.includes("--schreibe");
const nurEiner = args.find((a) => !a.startsWith("--"));
const liste = nurEiner ? [nurEiner] : Object.keys(STAEDTE);

const gebaut = new Map();
for (const slug of liste) {
  const b = baue(slug);
  if (b.fehler) { console.log(slug.padEnd(13) + "⚠️ " + b.fehler); continue; }
  gebaut.set(slug, b);
  console.log(slug.padEnd(13) + "viewBox " + b.viewBox.padEnd(14) +
    (b.kreisPfade.length ? b.kreisPfade.length + " Kreisring(e)" : "KEIN Kreis").padEnd(16) +
    b.stadtPfade.length + " Stadtring(e)   " + String(b.punkte).padStart(5) + " Punkte   " +
    "Stadtmitte " + b.stadtMitte.join(",") +
    "   Toleranz " + b.tolGrad.toExponential(2) + " Grad");
}

if (!schreibe) {
  console.log("");
  console.log("Nichts geschrieben. Mit --schreibe in die Seiten uebernehmen.");
  process.exit(0);
}

/* Alle Seiten finden, die den Hero-Umriss tragen, und ihr <svg> ersetzen. */
const dateien = fs.readdirSync(SEITEN).filter((f) => f.endsWith(".html"))
  .map((f) => path.join(SEITEN, f))
  .filter((f) => fs.readFileSync(f, "utf8").includes("city-hero__map"));

let n = 0, uebersprungen = [];
for (const f of dateien) {
  const basis = path.basename(f, ".html");
  const stadtTeil = basis.split("-").pop();
  const slug = Object.keys(STAEDTE).find((s) => (SEITEN_SLUG[s] || s) === stadtTeil);
  if (!slug) { uebersprungen.push(basis + " (kein Stadt-Slug)"); continue; }
  const b = gebaut.get(slug);
  if (!b) { uebersprungen.push(basis + " (nicht gebaut)"); continue; }

  let t = fs.readFileSync(f, "utf8");
  const anfang = t.indexOf('          <svg class="city-map');
  if (anfang < 0) { uebersprungen.push(basis + " (kein <svg class=city-map>)"); continue; }
  let ende = t.indexOf("</svg>", anfang);
  if (ende < 0) { uebersprungen.push(basis + " (kein </svg>)"); continue; }
  ende += 6;

  /* Bestehende Beschriftung MIT ersetzen, damit sie zur Form passt: aus einem
   * Label wird eine Legende, sobald ein Kreis dazukommt, und umgekehrt.
   *
   * ⚠️ Ohne regulaeren Ausdruck, absichtlich. Der erste Versuch stand als
   * Einzeiler in der Shell, und die hat die Backslashes gefressen — aus
   * `[\s\S]*?` wurde `[sS]*?`. Das ist still kaputt: es passt auf etwas
   * anderes, statt zu scheitern. Indizes koennen das nicht. */
  const suche = ["</p>", "</dl>"];
  const rest = t.slice(ende, ende + 600);
  for (const auf of ['<p class="city-map__label">', '<dl class="city-map__legende">']) {
    const iAuf = rest.indexOf(auf);
    /* Nur direkt hinter dem SVG, nicht irgendwo spaeter auf der Seite. */
    if (iAuf < 0 || iAuf > 12) continue;
    for (const zu of suche) {
      const iZu = rest.indexOf(zu, iAuf);
      if (iZu > -1) { ende += iZu + zu.length; break; }
    }
    break;
  }

  const NL = String.fromCharCode(10);
  t = t.slice(0, anfang) + svgMarkup(b) + NL + t.slice(ende).replace(/^\s*\n/, "");
  fs.writeFileSync(f, t);
  n++;
}
console.log("");
console.log(n + " Seiten geschrieben." + (uebersprungen.length ? "  Uebersprungen: " + uebersprungen.join(", ") : ""));
