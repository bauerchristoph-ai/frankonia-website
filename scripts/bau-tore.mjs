/* Bau-Tore über das AUSGELIEFERTE Ergebnis (dist/).
 *
 * Läuft nach build.js als Teil von `npm run build`. Jedes Tor ist eine Funktion
 * mit Namen; sie sammeln Befunde, und ein einziger Befund bricht den Bau ab.
 *
 * ⚠️⚠️ WARUM ALLE TORE IN EINER DATEI STEHEN: Die QA-Runde vom 31.08.2026
 * verlangt an einem Dutzend Stellen ein Bau-Tor. Über den Bau verstreut wären
 * das ein Dutzend Orte, an denen jemand eine Prüfung entfernt, ohne dass es
 * auffällt, und ein Dutzend verschiedene Fehlermeldungen. Hier ist es eine
 * Liste, die man lesen kann.
 *
 * ⚠️ WARUM GEGEN dist/ UND NICHT GEGEN pages/: die Tore prüfen, was ein Besucher
 * bekommt. Eine Regel, die den Quelltext prüft, sagt nichts darüber, was der Bau
 * daraus gemacht hat — genau dort saß der Fehler, den Aufgabe 5 gefunden hat
 * (ein Kommentar, der die Kommentar-Entfernung aushebelte). Der Quelltext war in
 * Ordnung, die Auslieferung nicht.
 *
 * ⚠️ `process.exitCode` statt `process.exit()`: gemessen auf diesem Rechner —
 * `process.exit()` mit offenen Handles bringt Node auf Windows mit einer
 * libuv-Assertion zum Absturz, und ein abgestürzter Prozess liefert keinen
 * verlässlichen Exitcode. Ein Tor, dessen Meldung im Log steht und dessen
 * Exitcode 0 ist, lässt genau das durch, was es verhindern soll.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(WURZEL, "dist");

/* ------------------------------------------------------------- Werkzeug */

function seiten() {
  const raus = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === "index.html") {
        const rel = path.relative(DIST, path.dirname(p)).split(path.sep).join("/");
        raus.push({ datei: p, url: "/" + (rel ? rel + "/" : "") });
      }
    }
  })(DIST);
  return raus;
}

let alle = null;
function alleSeiten() {
  if (!alle) alle = seiten().map((s) => ({ ...s, html: fs.readFileSync(s.datei, "utf8") }));
  return alle;
}

/* ---------------------------------------------------------------- Tore */

/* Aufgabe 5. Ein ausgeliefertes Dokument darf keinen Kommentar über 200 Zeichen
   tragen. Der Generator-Hinweis liegt bei 130 bis 161 Zeichen, ist also die
   einzige erlaubte Ausnahme und braucht keine Sonderbehandlung.
   ⚠️ Das Tor prüft NICHT, ob stripHtmlComments korrekt aussieht, sondern ob im
   Ergebnis noch ein langer Kommentar steht. Der Unterschied ist der ganze Punkt:
   die alte Fassung SAH korrekt aus. */
function torKommentare() {
  const befunde = [];
  for (const s of alleSeiten()) {
    for (const m of s.html.matchAll(/<!--([\s\S]*?)-->/g)) {
      if (m[1].length > 200) {
        befunde.push(
          s.url + ": Kommentar mit " + m[1].length + " Zeichen — " + JSON.stringify(m[1].trim().slice(0, 60))
        );
      }
    }
  }
  return befunde;
}

/* ------------------------------------------------------------- Ausführen */


/* Aufgabe 2. Jede ausgelieferte Seite muss alle fünf Icon-Verweise tragen, und
   die sechs Dateien müssen im Web-Root liegen.
   ⚠️ Beide Hälften sind nötig: die Verweise ohne Dateien wären 404 in jedem Tab,
   die Dateien ohne Verweise wären toter Ballast — und genau letzteres war der
   Zustand bis zum 31.08.2026, nur ohne Dateien: 58 von 58 geprüften Seiten
   trugen keinen einzigen Verweis. */
const ICON_VERWEISE = [
  ['rel="icon" href="/favicon.ico"', "favicon.ico"],
  ['rel="icon" href="/icon-192.png"', "icon-192.png"],
  ['rel="apple-touch-icon" href="/apple-touch-icon.png"', "apple-touch-icon.png"],
  ['rel="manifest" href="/site.webmanifest"', "site.webmanifest"],
  ['name="theme-color"', null],
];
const ICON_DATEIEN = [
  "favicon.ico",
  "icon-192.png",
  "icon-512.png",
  "icon-512-maskable.png",
  "apple-touch-icon.png",
  "site.webmanifest",
];

function torIcons() {
  const befunde = [];
  for (const d of ICON_DATEIEN) {
    const p = path.join(DIST, d);
    if (!fs.existsSync(p)) befunde.push("Datei fehlt im Web-Root: /" + d);
    else if (fs.statSync(p).size === 0) befunde.push("Datei ist leer: /" + d);
  }
  for (const s of alleSeiten()) {
    const fehlend = ICON_VERWEISE.filter(([muster]) => !s.html.includes(muster)).map(([m]) => m);
    if (fehlend.length) befunde.push(s.url + ": " + fehlend.length + " von 5 Verweisen fehlen");
  }
  return befunde;
}

const TORE = [
  ["Kommentare unter 200 Zeichen (Aufgabe 5)", torKommentare],
  ["Icon-Paket vollständig (Aufgabe 2)", torIcons],
];

if (!fs.existsSync(DIST)) {
  console.error("bau-tore: dist/ fehlt — zuerst bauen.");
  process.exitCode = 1;
} else {
  let fehler = 0;
  console.log("bau-tore: " + alleSeiten().length + " ausgelieferte Seiten");
  for (const [name, tor] of TORE) {
    const befunde = tor();
    if (befunde.length === 0) {
      console.log("  ok   " + name);
    } else {
      fehler += befunde.length;
      console.error("  FEHLER " + name);
      for (const b of befunde.slice(0, 12)) console.error("    " + b);
      if (befunde.length > 12) console.error("    ... und " + (befunde.length - 12) + " weitere");
    }
  }
  if (fehler) {
    console.error("");
    console.error("bau-tore: " + fehler + " Befund(e) — Bau abgebrochen.");
    process.exitCode = 1;
  }
}
