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

/* ⚠️ Backslash als Zeichencode, nicht als Literal: Heredocs auf dieser Maschine
   fressen eine Escape-Ebene, und dieses Skript wird ueber Patches geschrieben.
   Regexe werden deshalb mit new RegExp(...) und B zusammengesetzt. */
const B = String.fromCharCode(92);

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


/* ══════════════════════════════════════════ Aufgabe 15 · rohe Farbwerte
   Außerhalb von tokens.css darf kein roher Hex-Wert stehen — mit genau einer
   Ausnahme, und die ist inhaltlich begründet:

   ⚠️⚠️ #000 IN EINEM mask-image IST KEINE FARBE, SONDERN EIN ALPHAKANAL.
   Bei einer CSS-Maske heißt deckendes Schwarz "behalten" und transparent
   "ausblenden"; der Wert hat mit der Palette nichts zu tun. Ein Marken-Token
   dort wäre schlicht falsch — er würde behaupten, das sei eine
   Designentscheidung. Gemessen am 31.08.2026: alle 18 verbliebenen #000 stehen
   in mask-image bzw. -webkit-mask-image.

   ⚠️ UND DIE ZAHL IM AUFTRAG WAR DREIMAL ZU HOCH. Er nennt 167 rohe Werte;
   gemessen OHNE Kommentare waren es 52 in 16 verschiedenen Werten. Die höhere
   Zahl zählt Hex-Werte mit, die INNERHALB von Kommentaren stehen — dort
   dokumentieren sie gemessene Kontrastwerte. Der Unterschied ist nicht
   kosmetisch: eine Regel, die Kommentare mitzählt, verbietet am Ende, in einer
   Begründung einen Messwert zu nennen. Dieses Tor blendet Kommentare aus. */
function torRoheFarben() {
  const befunde = [];
  const cssDir = path.join(WURZEL, "css");
  const HEX = new RegExp("#[0-9a-fA-F]{3,8}\\b", "g");
  for (const f of fs.readdirSync(cssDir)) {
    if (!f.endsWith(".css") || f === "tokens.css") continue;
    const roh = fs.readFileSync(path.join(cssDir, f), "utf8");
    /* Kommentare durch Leerzeichen ersetzen, Zeilenumbrüche erhalten, damit die
       Zeilennummern stimmen. */
    const ohne = roh.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
    const zeilen = ohne.split("\n");
    for (let i = 0; i < zeilen.length; i++) {
      const z = zeilen[i];
      const treffer = z.match(HEX);
      if (!treffer) continue;
      /* Die eine erlaubte Ausnahme: Masken. */
      if (z.indexOf("mask-image") >= 0) continue;
      befunde.push("css/" + f + ":" + (i + 1) + " roher Farbwert " + treffer.join(" ") + " — Token in tokens.css anlegen");
    }
  }
  return befunde;
}


/* ═══════════════════════════════════════════════ Aufgabe 26 · Sitemap
   Der Bau schlaegt fehl, wenn Seitenzahl und Eintragszahl auseinanderfallen.
   ⚠️ "Auseinanderfallen" heisst nicht "gleich": indexierbare Seiten muessen
   drin sein, noindex-Seiten duerfen NICHT drin sein. Beide Richtungen werden
   geprueft, denn beide Vorfaelle sind dokumentiert vorgekommen — einmal 53
   Eintraege bei 54 Seiten, einmal zehn Seiten ohne Eintrag. */
function torSitemap() {
  const befunde = [];
  const p = path.join(DIST, "sitemap.xml");
  if (!fs.existsSync(p)) return ["sitemap.xml fehlt in dist/"];
  const xml = fs.readFileSync(p, "utf8");
  /* ⚠️ Ohne Regex extrahiert: ein Muster mit Schrägstrichen in einer
     Zeichenkette ist auf diesem Rechner mehrfach an der Backslash-Behandlung des
     Shell-Heredocs zerbrochen. Zeichenkettensuche ist hier ohnehin klarer. */
  const drin = new Set();
  const AUF = "<loc>https://frankonia-sicherheit.de";
  let i = xml.indexOf(AUF);
  while (i >= 0) {
    const ende = xml.indexOf("<", i + AUF.length);
    drin.add(xml.slice(i + AUF.length, ende));
    i = xml.indexOf(AUF, ende);
  }
  for (const s2 of alleSeiten()) {
    const noindex = /name="robots"[^>]*noindex/i.test(s2.html);
    if (noindex && drin.has(s2.url)) befunde.push(s2.url + " ist noindex, steht aber im Sitemap");
    if (!noindex && !drin.has(s2.url)) befunde.push(s2.url + " ist indexierbar, fehlt aber im Sitemap");
  }
  const seitenUrls = new Set(alleSeiten().map((x) => x.url));
  for (const u of drin) if (!seitenUrls.has(u)) befunde.push(u + " steht im Sitemap, existiert aber nicht");
  return befunde;
}


/* ═══════════════════════════════════ Aufgaben 21 + 22 · Obergrenzen
   Zwei Zählungen, die nicht wachsen dürfen. Beide sind bewusst Obergrenzen und
   keine Sollwerte: der Bestand ist gemessen und dokumentiert (tokens.css für die
   Breakpoints, motion.css für die reduced-motion-Blöcke), und was zählt ist,
   dass niemand still einen weiteren hinzufügt.

   ⚠️ WARUM OBERGRENZE UND NICHT KONSOLIDIERUNG: 285 Media Queries in 30 Dateien
   auf fünf Werte zu verschieben heisst, das responsive Verhalten aller 70 Seiten
   neu zu prüfen, kurz vor dem Launch — und die meisten Werte sind GEMESSEN
   entstanden, nicht gewählt. Die Begründung je Wert steht in tokens.css.

   ⚠️ KOMMENTARE WERDEN AUSGEBLENDET, sonst zählt die Dokumentation sich selbst
   mit. Genau dieser Fehler hat im Auftrag aus 10 reduced-motion-Blöcken 44
   gemacht und aus 52 Farbwerten 167. */
const BREAKPOINT_MAX = 16;
const REDUCED_MOTION_MAX = 10;

function torObergrenzen() {
  const befunde = [];
  const cssDir = path.join(WURZEL, "css");
  const BP = new RegExp("\\((?:min|max)-width:\\s*([0-9.]+)px\\)", "g");
  const RM = new RegExp("@media[^{]*prefers-reduced-motion[^{]*", "g");
  const bp = new Set();
  let rm = 0;
  for (const f of fs.readdirSync(cssDir)) {
    if (!f.endsWith(".css")) continue;
    const roh = fs.readFileSync(path.join(cssDir, f), "utf8");
    const s2 = roh.replace(/\/\*[\s\S]*?\*\//g, " ");
    for (const m of s2.matchAll(BP)) bp.add(Math.ceil(parseFloat(m[1])));
    for (const m of s2.matchAll(RM)) if (m[0].indexOf("no-preference") < 0) rm++;
  }
  if (bp.size > BREAKPOINT_MAX) {
    befunde.push(
      bp.size + " verschiedene Breakpoints, dokumentiert sind " + BREAKPOINT_MAX +
        " — neuen Wert in tokens.css begründen: " + [...bp].sort((a, b) => a - b).join(", ")
    );
  }
  if (rm > REDUCED_MOTION_MAX) {
    befunde.push(
      rm + " reduced-motion-Blöcke, dokumentiert sind " + REDUCED_MOTION_MAX +
        " — der globale Block in motion.css sollte reichen; wenn nicht, dort begründen"
    );
  }
  return befunde;
}

/* ═════════════════════════════════════════ Aufgabe 20 · Sticky-Header
   Reine Statik: die Regel fuer .site-header--solid muss existieren, ihre Flaeche
   muss mindestens 0.9 Deckkraft haben, und js/main.js muss die Klasse setzen.
   ⚠️ WARUM NICHT GEOMETRISCH GEPRUEFT wie im Auftrag vorgeschlagen: ein
   Textknoten schneidet das Header-Rechteck beim Scrollen IMMER — das ist der
   Sinn eines Sticky-Headers. Die Frage ist nicht OB, sondern ob die Flaeche
   darueber deckt. Das ist an der Regel pruefbar und braucht keinen Browser;
   gemessen wurde es einmal mit einem (drei Seiten, fuenf Scrollpositionen).
   ⚠️ Und es prueft das AUSGELIEFERTE CSS-Bundle, nicht die Quelldatei: genau
   dort war die Leaflet-Regel einmal nur auf einer Seite aktiv.  */
function torHeaderDeckend() {
  const befunde = [];
  const bundle = path.join(DIST, "css", "app.css");
  if (!fs.existsSync(bundle)) return ["css/app.css fehlt in dist/"];
  const css = fs.readFileSync(bundle, "utf8");
  const i = css.indexOf(".site-header--solid::before");
  if (i < 0) return ["die Regel .site-header--solid::before fehlt im ausgelieferten CSS"];
  const block = css.slice(i, css.indexOf("}", i));
  /* Ohne Regex-Literal: Backslashes zerbrechen auf diesem Rechner beim Erzeugen. */
  const zu = block.indexOf("/", block.indexOf("rgb("));
  const klammer = block.indexOf(")", zu);
  const alpha = zu > 0 && klammer > zu ? [null, block.slice(zu + 1, klammer).trim()] : null;
  if (!alpha) befunde.push(".site-header--solid::before hat keine Flaeche mit Deckkraft");
  else if (parseFloat(alpha[1]) < 0.9) {
    befunde.push(".site-header--solid::before deckt nur " + alpha[1] + " — unter 0.9 bleibt Text erkennbar");
  }
  const js = path.join(DIST, "js", "main.js");
  if (fs.existsSync(js)) {
    const src = fs.readFileSync(js, "utf8");
    if (src.indexOf("site-header--solid") < 0) befunde.push("js/main.js setzt site-header--solid nicht");
  }
  return befunde;
}

/* ═══════════════════════════════════════════ Aufgabe 27g · schwere Rasterbilder
   Gemessen am 31.08.2026 ueber 89 ausgelieferte Bilder auf zehn Seiten, gewichtet
   nach Byte je angezeigtem Pixel. Genau EIN echter Ausreisser:
   partner-wirtschaftsclub-bamberg.png mit 87 KB fuer eine Anzeige von 67x44 px,
   also 30 Byte je Pixel — der Zweitplatzierte lag bei 20, der Rest bei 11 und
   darunter.

   ⚠️ DER UEBERGROESSEN-FAKTOR ALLEIN IST DER FALSCHE MASSSTAB, und das war die
   eigentliche Erkenntnis: die DEKRA-Siegel liegen bei 13,6-facher Uebergroesse
   und sind trotzdem harmlos, weil es flache Grafiken mit 18 KB sind. Ein Logo mit
   4-facher Uebergroesse und 5 KB ist kein Befund. Was zaehlt, ist das Gewicht.

   ⚠️ DIESES TOR KANN DIE ANZEIGEGROESSE NICHT MESSEN — dafuer braeuchte es einen
   Browser, und ein Bau-Tor hat keinen. Es prueft deshalb, was statisch bekannt
   ist: ein schweres Rasterbild ohne leichteres Geschwister. Genau das war der
   Zustand des Ausreissers. Bilder mit <picture> und WebP-Quelle sind ausgenommen,
   weil dort der Browser waehlen kann.

   ⚠️ SVG IST AUSGENOMMEN. Eine Vektorgrafik hat keine Auflösung, die zu gross
   sein koennte — die drei uebrigen Partner-Logos sind SVG und genau deshalb
   richtig. */
const RASTER_KB_MAX = 40;

function torSchwereBilder() {
  const befunde = [];
  const liste = alleSeiten();
  const gemeldet = new Set();

  for (const { url, html } of liste) {
    const ohneKommentare = html.replace(new RegExp("<!--[\s\S]*?-->", "g"), " ");
    /* Jedes <img> einzeln ansehen, samt seiner Umgebung: liegt es in einem
       <picture> mit srcset, waehlt der Browser und das Tor schweigt. */
    let i = 0;
    for (;;) {
      const a = ohneKommentare.indexOf("<img", i);
      if (a < 0) break;
      const e = ohneKommentare.indexOf(">", a);
      if (e < 0) break;
      const tag = ohneKommentare.slice(a, e);
      i = e + 1;

      const mSrc = tag.match(/src="([^"]+)"/);
      if (!mSrc) continue;
      const src = mSrc[1];
      const kl = src.toLowerCase();
      if (!(kl.endsWith(".png") || kl.endsWith(".jpg") ||
            kl.endsWith(".jpeg") || kl.endsWith(".webp"))) continue;
      if (tag.indexOf("srcset") >= 0) continue;

      /* Steht direkt davor ein <source srcset>? Dann ist es ein <picture>. */
      const davor = ohneKommentare.slice(Math.max(0, a - 400), a);
      if (davor.lastIndexOf("<picture") > davor.lastIndexOf("</picture>") &&
          davor.indexOf("srcset") >= 0) continue;

      const datei = path.join(DIST, src.slice(1));
      if (!fs.existsSync(datei)) continue;
      const kb = Math.round(fs.statSync(datei).size / 1024);
      if (kb <= RASTER_KB_MAX) continue;

      const schluessel = src;
      if (gemeldet.has(schluessel)) continue;
      gemeldet.add(schluessel);
      befunde.push(
        src.split("/").pop() + " ist " + kb + " KB und wird ohne srcset und ohne " +
          "<picture> ausgeliefert (zuerst gesehen in " + url + ") — entweder eine " +
          "kleinere Fassung erzeugen oder eine WebP-Quelle daneben stellen"
      );
    }
  }
  return befunde;
}

/* ══════════════════════════════════════════════════ Aufgabe 18 · Radien
   Gemessen am 31.08.2026: KEIN Bild dieses Projekts hat einen eingebackenen
   Radius (alle Eckpixel deckend, geprueft durch Auslesen der Bilddaten), und
   KEIN img-Selektor setzt border-radius — ausser dem runden Testimonial-Avatar,
   wo 50 % die Bedeutung ist und kein Token es besser sagt. Die Prämisse der
   Aufgabe hielt also nicht; der Radius sitzt bereits am Behaelter.

   Was wirklich offen war: 1.5rem stand NEUNMAL als Literal in sechs Dateien, und
   999px zweimal, obwohl --radius-pill existierte. Beides ist jetzt ein Token.

   Dieses Tor haelt den Zustand:
     a) border-radius gehoert nicht auf einen img-Selektor, sondern an den
        Behaelter — sonst schneidet das Bild sich selbst und der Rahmen bleibt
        eckig.
     b) kein Literal, fuer das es ein Token gibt.
   ⚠️ 50 % ist erlaubt: ein Kreis ist keine Skalenstufe. */
const RADIUS_TOKENS = { "4px": "--radius-sm", "8px": "--radius-md", "16px": "--radius-lg",
  "1rem": "--radius-lg", "1.5rem": "--radius-xl", "24px": "--radius-xl",
  "999px": "--radius-pill", "9999px": "--radius-pill" };

function torRadien() {
  const befunde = [];
  const cssDir = path.join(WURZEL, "css");
  for (const f of fs.readdirSync(cssDir)) {
    if (!f.endsWith(".css") || f === "tokens.css") continue;
    const roh = fs.readFileSync(path.join(cssDir, f), "utf8");
    /* Kommentare ausblenden, Zeilennummern erhalten. */
    const ohne = roh.replace(new RegExp(B + "/" + B + "*[" + B + "s" + B + "S]*?" + B + "*" + B + "/", "g"),
      (m) => m.replace(new RegExp("[^" + B + "n]", "g"), " "));
    const zeilen = ohne.split(new RegExp(B + "r?" + B + "n"));

    let selektor = "";
    zeilen.forEach((l, i) => {
      if (l.indexOf("{") >= 0) selektor = l.slice(0, l.indexOf("{")).trim();
      if (l.indexOf("border-radius") < 0) return;
      const wert = (l.split(":")[1] || "").replace(";", "").trim();

      /* a) Radius auf einem img-Selektor. */
      const s2 = selektor.toLowerCase();
      const istBild = /(^|[s,>])img([s.:,{]|$)/.test(s2) || s2.indexOf(" img") >= 0;
      if (istBild && wert !== "50%" && wert !== "0" && wert !== "0px") {
        befunde.push(f + ":" + (i + 1) + " setzt border-radius auf einen img-Selektor (" +
          selektor.slice(0, 44) + ") — der Radius gehoert an den Behaelter, sonst " +
          "bleibt sein Rahmen eckig");
      }

      /* b) Literal, fuer das ein Token existiert. */
      if (wert.indexOf("var(--radius") >= 0) return;
      const tok = RADIUS_TOKENS[wert];
      if (tok) {
        befunde.push(f + ":" + (i + 1) + " schreibt " + wert + ", dafuer gibt es " +
          tok + " — Literal ersetzen");
      }
    });
  }
  return befunde;
}

/* ═════════════════════════════════════════════════ Aufgabe 19 · CTA-Varianten
   Gemessen am 31.08.2026 auf der Startseite: VIER Signaturen, nicht sieben. Und
   sie loesen sich in zwei Rollen auf —
     btn--primary            5x   der eine blaue Knopf
     btn--secondary          2x   Umriss, gleiche Groesse
     btn--primary btn--lg    2x   derselbe Knopf, groesseres Polster
     coverage__pill--all     1x   der Alle-Schalter der Karte
   --lg ist ein GROESSEN-Modifikator derselben Rolle, keine eigene Variante:
   Farbe, Radius, Schrift und Rolle sind identisch, nur das Polster ist groesser.

   ⚠️ .coverage__pill--all IST KEIN CTA und wird bewusst nicht angeglichen. Es ist
   ein Filter-Schalter auf der Karte; ihn wie den Angebots-Knopf aussehen zu
   lassen wuerde eine Handlungsaufforderung behaupten, die er nicht ist. Seine
   Farbe steht ausserdem ausdruecklich unter Christophs Entscheidung vom
   31.08.2026 und bleibt.

   ⚠️ FARBE UND TYPOGRAFIE DES PRIMAERKNOPFS DUERFEN SICH NICHT AENDERN — auch
   das ist eine Entscheidung, nicht ein Versaeumnis. Deshalb konsolidiert dieses
   Tor nichts, es DECKELT: die Anzahl der Knopf-Klassen darf nicht wachsen. Genau
   das war die Sorge der Aufgabe. */
const BTN_KLASSEN_MAX = 6;

function torCtaVarianten() {
  const befunde = [];
  const cssDir = path.join(WURZEL, "css");
  const klassen = new Set();
  for (const f of fs.readdirSync(cssDir)) {
    if (!f.endsWith(".css")) continue;
    const roh = fs.readFileSync(path.join(cssDir, f), "utf8");
    const ohne = roh.replace(new RegExp(B + "/" + B + "*[" + B + "s" + B + "S]*?" + B + "*" + B + "/", "g"), " ");
    /* Jede .btn--<name> Klasse, die irgendwo definiert wird. */
    let i = 0;
    for (;;) {
      const a = ohne.indexOf(".btn--", i);
      if (a < 0) break;
      i = a + 6;
      let e = i;
      while (e < ohne.length && /[a-z0-9-]/i.test(ohne[e])) e++;
      klassen.add("btn--" + ohne.slice(i, e));
    }
  }
  if (klassen.size > BTN_KLASSEN_MAX) {
    befunde.push(klassen.size + " .btn--Varianten, dokumentiert sind " + BTN_KLASSEN_MAX +
      " — eine neue Variante in tokens.css begruenden oder eine bestehende nutzen: " +
      [...klassen].sort().join(", "));
  }
  return befunde;
}

/* Jedes inline-SVG, dessen CSS BEIDE Achsen auf auto laesst, braucht width- UND
 * height-Attribute — sonst fehlt es in Safari samt seinem Platz.
 *
 * ⚠️⚠️ WARUM DIESES TOR EXISTIERT. Der Ortsumriss der 26 Stadt- und Kombiseiten
 * war auf dem iPhone unsichtbar, und der Kunde hat es am 02.09.2026 ZWEIMAL
 * gemeldet, waehrend jede meiner Messungen ihn als vorhanden auswies. Der Grund:
 * .city-map hat `width: auto; height: auto` und nur max-width/max-height. Chrome
 * leitet die Groesse dann aus dem viewBox ab, Safari NICHT — dort faellt die Box
 * auf null zusammen. In Chrome ist das nicht nachstellbar, also kann es nur ein
 * Tor am Markup verhindern.
 *
 * Geprueft wird genau die riskante Kombination, nicht jedes SVG: von den 58
 * inline-SVG ohne width/height hat nur .city-map beide Achsen auf auto — alle
 * anderen pinnen eine (width: 100%, 2.75rem, var(--kz-frame) …), und mit EINER
 * definiten Achse loest das Verhaeltnis in jeder Engine auf.
 */
function torSvgMasse() {
  const befunde = [];
  /* Klassen, deren CSS beide Achsen auf auto laesst. Wer hier eine ergaenzt,
     muss auch die Attribute im Markup setzen. */
  const BEIDE_AUTO = ["city-map"];
  for (const f of seiten()) {
    const html = fs.readFileSync(f.datei, "utf8");
    for (const m of html.matchAll(/<svg\b[^>]*>/g)) {
      const tag = m[0];
      const kl = (tag.match(/class="([^"]*)"/) || [, ""])[1].split(" ")[0];
      if (!BEIDE_AUTO.includes(kl)) continue;
      const hatW = /\swidth="[0-9]/.test(tag);
      const hatH = /\sheight="[0-9]/.test(tag);
      if (!hatW || !hatH) {
        befunde.push(f.url + ": <svg class=\"" + kl + "\"> ohne " +
          (!hatW && !hatH ? "width und height" : !hatW ? "width" : "height") +
          " — in Safari faellt die Box auf null zusammen");
      }
    }
  }
  return befunde;
}

/* Jede eigene Adresse in den ausgelieferten Seiten muss eine Inhaltssignatur
 * tragen.
 *
 * ⚠️⚠️ WARUM DIESES TOR EXISTIERT — es ist der teuerste Fehler des
 * Abnahmedurchgangs, siehe Lehre 1 in CLAUDE.md. /css/ und /js/ laufen mit
 * max-age=3600, /assets/ mit 86400. Ohne Version im Dateinamen erreichte eine
 * Korrektur den Kunden bis zu einer Stunde (Bilder: bis zu einem Tag) nicht —
 * er lud neu und sah dieselben Fehler, die hier gemessen behoben waren.
 *
 * Fällt build.js' Signaturschritt je aus (oder wird eine Adresse per Hand ohne
 * ?v= eingetragen), kommt der Fehler in genau derselben Gestalt zurück und ist
 * genauso schwer zu erkennen. Deshalb ein Tor und keine Notiz.
 *
 * ⚠️ /assets/js/vendor/ und /assets/data/ sind ausgenommen: feste
 * Bibliotheksversionen, deren Adressen in Zeichenketten stehen und zur Laufzeit
 * nachgeladen werden, und ein fetch-Ziel.
 */
function torSignaturen() {
  const befunde = [];
  /* ⚠️ KEIN Dateiendungs-Anker am Ende: eine signierte Adresse endet auf
     "?v=abcd1234", nicht auf ".css". Die erste Fassung dieses Musters verlangte
     genau das und hat deshalb NICHTS gefunden — das Tor war grün, ohne zu
     prüfen. Aufgefallen allein durch die Gegenprobe: eine Signatur von Hand
     kaputt machen und sehen, ob das Tor fällt. Jede neue Prüfung braucht diese
     Probe, sonst ist sie eine Behauptung. */
  const MUSTER = /(?:href|src)="((?:\/(?:css|js)|\/assets\/(?:images|icons|fonts))\/[^"]+)"/g;
  const AUSNAHME = /^\/assets\/js\/vendor\//;
  for (const f of seiten()) {
    const html = fs.readFileSync(f.datei, "utf8");
    const ohne = new Set();
    for (const m of html.matchAll(MUSTER)) {
      const url = m[1];
      if (AUSNAHME.test(url)) continue;
      if (url.indexOf("?v=") < 0) ohne.add(url);
    }
    if (ohne.size) {
      befunde.push(f.url + ": " + ohne.size + " Adresse(n) ohne ?v= — " +
        [...ohne].slice(0, 3).join(", ") + (ohne.size > 3 ? " …" : ""));
    }
  }
  /* Und in srcset, wo die Adresse von einem Deskriptor gefolgt wird. */
  const SRCSET = /srcset="([^"]+)"/g;
  for (const f of seiten()) {
    const html = fs.readFileSync(f.datei, "utf8");
    let fehlt = 0;
    for (const m of html.matchAll(SRCSET)) {
      for (const teil of m[1].split(",")) {
        const url = teil.trim().split(/\s+/)[0];
        if (!url || url.indexOf("/assets/") !== 0) continue;
        if (AUSNAHME.test(url)) continue;
        if (url.indexOf("?v=") < 0) fehlt++;
      }
    }
    if (fehlt) befunde.push(f.url + ": " + fehlt + " srcset-Adresse(n) ohne ?v=");
  }
  return befunde;
}

const TORE = [
  ["Radien am Behaelter und aus Token (Aufgabe 18)", torRadien],
  ["CTA-Varianten unter der Obergrenze (Aufgabe 19)", torCtaVarianten],
  ["Sticky-Header deckt nach dem Hero (Aufgabe 20)", torHeaderDeckend],
  ["Schwere Rasterbilder ohne leichtere Fassung (Aufgabe 27g)", torSchwereBilder],
  ["Breakpoints und reduced-motion unter der Obergrenze (21+22)", torObergrenzen],
  ["Sitemap deckt sich mit dem Seitenbestand (Aufgabe 26)", torSitemap],
  ["Keine rohen Farbwerte ausserhalb tokens.css (Aufgabe 15)", torRoheFarben],
  ["Kommentare unter 200 Zeichen (Aufgabe 5)", torKommentare],
  ["Icon-Paket vollständig (Aufgabe 2)", torIcons],
  ["Fremd-Hosts in /datenschutz/ genannt (Aufgabe 3)", torFremdHosts],
  ["Kombiseiten aus beiden Richtungen verlinkt (Aufgabe 11)", torKombiVerweise],
  ["Erfolgsseiten je Formulartyp (Aufgabe 12)", torErfolgsseiten],
  ["SVG mit beiden Achsen auto tragen width und height", torSvgMasse],
  ["Signaturen an allen eigenen Adressen", torSignaturen],
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
