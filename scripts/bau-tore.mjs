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


/* ══════════════════════════════════════════════════ Aufgabe 3 · Fremd-Hosts
   Jeder Host, der aus dem ausgelieferten Ergebnis heraus angefragt wird, muss im
   SICHTBAREN Text von /datenschutz/ namentlich vorkommen.

   ⚠️⚠️ DAS TOR PRUEFT DEN ANBIETERNAMEN, NICHT DEN HOSTNAMEN — und deshalb
   braucht es diese Tabelle. Ein Rechtstext nennt "CARTO" und "Google", nicht
   "basemaps.cartocdn.com". Ein Tor, das nach Hostnamen sucht, waere entweder
   immer gruen (weil Hostnamen nie im Text stehen) oder wuerde verlangen, dass
   technische Adressen in den Rechtstext wandern.

   ⚠️ EIN UNBEKANNTER HOST BRICHT DEN BAU. Das ist der eigentliche Zweck: wer
   einen neuen Dienst einbaut, muss hier eine Zeile ergaenzen — und damit
   entscheiden, welcher Anbietername in der Erklaerung stehen muss. Genau dieser
   Schritt fehlte beim eingebetteten HubSpot-Formular, das monatelang eine
   Datenuebermittlung war, die in der Erklaerung nicht vorkam. */
const FREMD_HOSTS = [
  ["basemaps.cartocdn.com", "CARTO"],
  ["cartocdn.com", "CARTO"],
  ["openstreetmap.org", "OpenStreetMap"],
  ["carto.com", "CARTO"],
  ["consent.cookiebot.com", "Cookiebot"],
  ["cookiebot.com", "Cookiebot"],
  ["js-eu1.hsforms.net", "HubSpot"],
  ["hsforms.net", "HubSpot"],
  ["meetings-eu1.hubspot.com", "HubSpot"],
  ["hubspot.com", "HubSpot"],
  ["d.frankonia-sicherheit.de", "Tag Manager"],
  /* Reine Verweise ohne Datenabfluss beim Laden. Sie stehen hier, damit das Tor
     sie nicht als unbekannt meldet — ihre Nennung verlangt Abschnitt 3.8. */
  ["wa.me", "WhatsApp"],
  ["whatsapp.com", "WhatsApp"],
  ["instagram.com", "Instagram"],
  ["linkedin.com", "LinkedIn"],
  ["facebook.com", "Facebook"],
  ["google.com", "Google"],
  ["google.de", "Google"],
  ["g.page", "Google"],
  ["challenges.cloudflare.com", "Cloudflare"],
  ["bdsw.de", null], /* Fachverband, blosser Quellenverweis */
  ["gesetze-im-internet.de", null],
  ["dekra.de", null],
  ["wirtschaftsclub-bamberg.de", null],
  ["mittelstandsbund.de", null],
  ["handelsregister.de", null],
  ["schema.org", null], /* nur Bezeichner im JSON-LD, kein Abruf */
  /* ⚠️ www.w3.org ist NIE ein Abruf: es ist der SVG-Namensraum. Der Filter
     oben entfernt die xmlns-Attribute aus dem Markup (82 von 87 Treffern),
     die restlichen fuenf stehen als Konstante in JS-Dateien
     (createElementNS, getAttributeNS). Ein Bezeichner, den niemand anfragt. */
  ["w3.org", null],
  ["share.google", "Google"], /* der Bewertungs-Kurzlink, 50 Seiten */
  ["bewacherregister.de", null], /* Behoerdenregister, blosser Quellenverweis */
  ["bauerchristoph.de", null], /* Agenturnennung im Partnerbereich, blosser Link */
];

function sichtbarerText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ");
}

function torFremdHosts() {
  const befunde = [];
  const ds = alleSeiten().find((s) => s.url === "/datenschutz/");
  if (!ds) return ["/datenschutz/ nicht gefunden — ohne sie ist die Pruefung sinnlos"];
  const text = sichtbarerText(ds.html);

  /* Hosts aus HTML UND aus den ausgelieferten JS-Dateien: die Kachel-URL und
     der Formular-Endpoint stehen im Skript, nicht im Markup. */
  const quellen = alleSeiten().map((s) => s.html);
  const jsDir = path.join(DIST, "js");
  if (fs.existsSync(jsDir)) {
    for (const f of fs.readdirSync(jsDir)) {
      if (f.endsWith(".js")) quellen.push(fs.readFileSync(path.join(jsDir, f), "utf8"));
    }
  }

  const gefunden = new Map();
  for (const roh of quellen) {
    /* ⚠️⚠️ XML-NAMENSRAEUME SIND KEINE ABRUFE. www.w3.org tauchte beim ersten
       Lauf 87x auf, ausschliesslich aus xmlns/xmlns:xlink an Inline-SVG. Das ist
       ein Bezeichner, den niemand anfragt. Ein Tor mit 87 Fehlalarmen wird nach
       zwei Wochen abgeschaltet — deshalb wird die Ursache entfernt und nicht die
       Zeile in die Ausnahmetabelle geschrieben. */
    const q = roh.replace(/\sxmlns(:[a-z]+)?="[^"]*"/gi, " ");
    for (const m of q.matchAll(/https?:\/\/([a-z0-9.-]+\.[a-z]{2,})/gi)) {
      const host = m[1].toLowerCase();
      if (host.endsWith("frankonia-sicherheit.de") && host !== "d.frankonia-sicherheit.de") continue;
      if (host.includes("{s}")) continue;
      gefunden.set(host, (gefunden.get(host) || 0) + 1);
    }
  }

  for (const host of [...gefunden.keys()].sort()) {
    const eintrag = FREMD_HOSTS.find(([h]) => host === h || host.endsWith("." + h));
    if (!eintrag) {
      befunde.push(
        "unbekannter Fremd-Host: " + host + " (" + gefunden.get(host) + "x) — " +
          "in FREMD_HOSTS eintragen UND pruefen, ob /datenschutz/ den Anbieter nennt"
      );
      continue;
    }
    const name = eintrag[1];
    if (name && !text.includes(name)) {
      befunde.push(host + ' wird geladen, aber "' + name + '" kommt im sichtbaren Text von /datenschutz/ nicht vor');
    }
  }
  return befunde;
}

/* ═══════════════════════════════════════════ Aufgabe 11 · Kombiseiten-Verweise
   Existiert eine Kombiseite (Leistung x Stadt), muss sie aus BEIDEN Richtungen
   verlinkt sein — von der Leistungsseite und von der Stadtseite.
   Gemessen vorher: 6 von 16. Die Kombiseiten tragen die spezifischste
   kommerzielle Suchintention der ganzen Website. */
function torKombiVerweise() {
  const befunde = [];
  const seiten = new Map(alleSeiten().map((s) => [s.url, s.html]));
  for (const [url] of seiten) {
    const m = url.match(/^\/([a-z]+)-([a-z]+)\/$/);
    if (!m) continue;
    const [, leistung, stadt] = m;
    /* Nur echte Kombis: beide Elternseiten muessen existieren. */
    const leistungsSeite = "/" + leistung + "/";
    const stadtSeite = "/sicherheitsdienst-" + stadt + "/";
    if (!seiten.has(leistungsSeite) || !seiten.has(stadtSeite)) continue;
    if (!seiten.get(leistungsSeite).includes('href="' + url + '"')) {
      befunde.push(leistungsSeite + " verlinkt " + url + " nicht");
    }
    if (!seiten.get(stadtSeite).includes('href="' + url + '"')) {
      befunde.push(stadtSeite + " verlinkt " + url + " nicht");
    }
  }
  return befunde;
}

/* ══════════════════════════════════════════ Aufgabe 12 · Erfolgsseiten
   Jedes Formular braucht ein Erfolgsziel, das zu seinem Typ passt — und die
   Erfolgsseiten duerfen weder indexierbar noch im Sitemap sein.
   Grund: sobald Google Ads eine Kundenkampagne auf "erreichte /danke/"
   optimiert, zaehlt jede Bewerbung als Conversion, und der Algorithmus lernt,
   Bewerber zu finden. */
function torErfolgsseiten() {
  const befunde = [];
  const sitemap = fs.existsSync(path.join(DIST, "sitemap.xml"))
    ? fs.readFileSync(path.join(DIST, "sitemap.xml"), "utf8")
    : "";
  for (const url of ["/danke/", "/danke-bewerbung/"]) {
    const seite = alleSeiten().find((s) => s.url === url);
    if (!seite) {
      befunde.push("Erfolgsseite fehlt: " + url);
      continue;
    }
    if (!/name="robots"[^>]*noindex/.test(seite.html)) befunde.push(url + " ist nicht noindex");
    if (sitemap.includes(url + "<")) befunde.push(url + " steht im Sitemap");
  }
  /* Die zwei duerfen sich nicht gegenseitig verlinken — sonst laufen die
     Conversion-Ziele wieder zusammen. */
  for (const [a, b] of [["/danke/", "/danke-bewerbung/"], ["/danke-bewerbung/", "/danke/"]]) {
    const seite = alleSeiten().find((s) => s.url === a);
    if (seite && seite.html.includes('href="' + b + '"')) befunde.push(a + " verlinkt " + b);
  }
  return befunde;
}

const TORE = [
  ["Kommentare unter 200 Zeichen (Aufgabe 5)", torKommentare],
  ["Icon-Paket vollständig (Aufgabe 2)", torIcons],
  ["Fremd-Hosts in /datenschutz/ genannt (Aufgabe 3)", torFremdHosts],
  ["Kombiseiten aus beiden Richtungen verlinkt (Aufgabe 11)", torKombiVerweise],
  ["Erfolgsseiten je Formulartyp (Aufgabe 12)", torErfolgsseiten],
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
