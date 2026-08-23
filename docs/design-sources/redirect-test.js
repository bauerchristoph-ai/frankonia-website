/*
 * Prüft die Redirect-Regeln aus vercel.json — Block G, 2026-08-23.
 *
 *   node docs/design-sources/redirect-test.js
 *   node docs/design-sources/redirect-test.js https://frankonia-website.vercel.app
 *
 * OHNE Argument läuft der statische Teil: er liest vercel.json und dist/ und
 * beantwortet die Fragen, die man vor einem Deploy beantworten kann —
 * insbesondere die Frage nach Redirect-KETTEN, die laut Auftrag das häufigste
 * Problem einer solchen Migration sind. Eine Kette entsteht, wenn das Ziel einer
 * Regel selbst wieder Quelle einer Regel ist, oder wenn ein Ziel nicht existiert
 * und erst die Trailing-Slash-Normalisierung oder die 404-Seite greift. Beides
 * ist hier statisch entscheidbar, weil die Zielseiten im Build liegen.
 *
 * MIT Basis-URL prüft er zusätzlich live: genau EIN 301 pro Quell-URL, direkt
 * auf das erwartete Ziel. Das geht erst nach dem Deploy, weil `npm run dev`
 * nur dist/ ausliefert und vercel.json dabei gar nicht gelesen wird — der
 * lokale Dev-Server kennt keine Redirects. Das ist keine Nachlässigkeit,
 * sondern die Architektur: Redirects sind Hosting-Konfiguration.
 *
 * ⚠️ Der Matcher unten ist eine MINIMALE Nachbildung von Vercels
 * path-to-regexp: er versteht genau das, was diese Datei benutzt (Literale und
 * `:name*`). Er beweist deshalb, dass die Regeln die alten URLs treffen und
 * dass sie die BESTEHENDEN URLs nicht treffen — er beweist nicht, dass Vercel
 * exakt dieselbe Regex baut. Dafür ist der Live-Teil da.
 */
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const ROOT = path.join(__dirname, "..", "..");
const vj = JSON.parse(fs.readFileSync(path.join(ROOT, "vercel.json"), "utf8"));
const RULES = vj.redirects || [];

/* ---- die Erwartungsliste: alte URL -> Ziel ------------------------------
   Bewusst hier ausgeschrieben und NICHT aus vercel.json abgeleitet. Ein Test,
   der seine Erwartung aus dem Prüfling zieht, prüft nichts. Diese Liste ist die
   Liste des Kunden aus dem Auftrag, plus die vier Blogziele aus Block F. */
const ERWARTET = {
  // G1
  "/frankonia-werkschutz/": "/werkschutz/",
  "/frankonia-objektschutz/": "/objektschutz/",
  "/frankonia-sicherheitstechnik/": "/sicherheitstechnik/",
  "/frankonia-veranstaltungsschutz/": "/veranstaltungsschutz/",
  "/frankonia-revier-schliessdienst/": "/revier-schliessdienst/",
  "/frankonia-kaufhausdetektei/": "/kaufhausdetektei/",
  "/frankonia-empfangsdienst/": "/empfangsdienst/",
  // G2
  "/sicherheitsanalyse/": "/sicherheitskonzept/",
  "/kundenstory-kunde-1/": "/referenzen/",
  "/kundenstory-kunde-2/": "/referenzen/",
  // G3
  "/bewerbung-im-sicherheitsdienst-die-3-haeufigsten-fehler/": "/ratgeber/bewerbung-sicherheitsdienst/",
  "/tariflohn-2026-im-sicherheitsdienst/": "/ratgeber/tariflohn-sicherheitsdienst/",
  "/voraussetzungen-im-sicherheitsdienst/": "/ratgeber/voraussetzungen-sicherheitsdienst/",
  "/qualifikationen-im-sicherheitsdienst/": "/ratgeber/qualifikationen-sicherheitsdienst/",
  "/jobchancen-als-sicherheitskraft/": "/ratgeber/paragraph-34a-erklaert/",
  "/einsatzmoeglichkeiten-im-sicherheitsdienst-was-unterrichtung-sachkunde-und-gssk-wirklich-erlauben/": "/ratgeber/paragraph-34a-erklaert/",
  "/wie-viel-kostet-die-fortbildung-zur-sicherheitskraft/": "/ratgeber/qualifikationen-sicherheitsdienst/",
  "/so-schwierig-sind-unterrichtung-sachkunde-und-gssk-%c2%a734a/": "/ratgeber/paragraph-34a-erklaert/",
  "/so-schwierig-sind-unterrichtung-sachkunde-und-gssk-%C2%A734a/": "/ratgeber/paragraph-34a-erklaert/",
  "/so-schwierig-sind-unterrichtung-sachkunde-und-gssk-§34a/": "/ratgeber/paragraph-34a-erklaert/",
  // G4
  "/hallo-welt/": "/",
  "/feed/": "/",
  "/comments/feed/": "/",
  "/werkschutz/feed/": "/",
  "/category/allgemein/": "/ratgeber/",
  "/tag/security/": "/ratgeber/",
  "/author/admin/": "/ueber-uns/",
};

/* URLs, die NICHT umgeleitet werden dürfen. Die ersten beiden auf Anweisung des
   Kunden (404 ist hier richtig). Der Rest sind Adressen, die es auf der alten
   UND der neuen Seite unter demselben Pfad gibt — würde eine Regel sie fangen,
   wäre das im besten Fall eine unnötige Weiterleitung und im schlechtesten eine
   Schleife: /veranstaltungsschutz/ ist gleichzeitig ZIEL einer G1-Regel. */
const NICHT_UMLEITEN = [
  "/wp-admin/", "/wp-login.php",
  "/", "/baustellenbewachung/", "/veranstaltungsschutz/", "/jobs/",
  "/angebot/", "/referenzen/", "/ratgeber/", "/werkschutz/", "/objektschutz/",
  "/sicherheitskonzept/", "/ueber-uns/", "/kontakt/",
  "/ratgeber/paragraph-34a-erklaert/", "/ratgeber/bewerbung-sicherheitsdienst/",
];

/* ---- Vollständigkeit: JEDE alte URL muss irgendwo landen ----------------
   Das ist die komplette Adressliste der alten Seite, abgelesen aus ihrer eigenen
   Sitemap (page-sitemap.xml + post-sitemap.xml, geholt am 23.08.2026). Sie steht
   hier als Konstante und wird nicht live geholt: nach dem DNS-Umzug gibt es die
   alte Sitemap nicht mehr, und ein Test, der dann stillschweigend leer läuft,
   ist schlimmer als keiner.
   Die Prüfung ist die eigentliche Frage der Migration: wird jede dieser Adressen
   entweder umgeleitet ODER existiert sie auf der neuen Seite unter demselben
   Pfad? Alles andere ist nach dem Umzug ein 404 mit Verlauf. */
const ALTE_SEITE = [
  "/",
  "/frankonia-werkschutz/", "/frankonia-objektschutz/", "/frankonia-sicherheitstechnik/",
  "/frankonia-veranstaltungsschutz/", "/frankonia-revier-schliessdienst/",
  "/frankonia-kaufhausdetektei/", "/frankonia-empfangsdienst/",
  "/baustellenbewachung/", "/veranstaltungsschutz/",
  "/jobs/", "/angebot/", "/referenzen/", "/sicherheitsanalyse/",
  "/kundenstory-kunde-1/", "/kundenstory-kunde-2/",
  "/linktree/", "/sicherheitscheck-walde/",
  "/alexander-jaeger-sicherheitsdienst/", "/alexander-jaeger-werkschutz/",
  "/marco-bayer-sicherheitsdienst-2/", "/marco-bayer-werkschutz-2/",
  "/bryan-van-wey-werkschutz/",
  "/bewerbung-im-sicherheitsdienst-die-3-haeufigsten-fehler/",
  "/jobchancen-als-sicherheitskraft/", "/tariflohn-2026-im-sicherheitsdienst/",
  "/einsatzmoeglichkeiten-im-sicherheitsdienst-was-unterrichtung-sachkunde-und-gssk-wirklich-erlauben/",
  "/voraussetzungen-im-sicherheitsdienst/",
  "/so-schwierig-sind-unterrichtung-sachkunde-und-gssk-%c2%a734a/",
  "/qualifikationen-im-sicherheitsdienst/",
  "/wie-viel-kostet-die-fortbildung-zur-sicherheitskraft/",
];

/* ---- minimaler path-to-regexp ------------------------------------------- */
function compile(source) {
  let re = "^";
  let i = 0;
  while (i < source.length) {
    const c = source[i];
    if (c === ":") {
      let j = i + 1;
      while (j < source.length && /[A-Za-z0-9_]/.test(source[j])) j++;
      const star = source[j] === "*";
      if (star) j++;
      // `/:path*` darf auch auf null Segmente passen, deshalb wird der
      // vorangehende Schrägstrich optional — so verhält sich path-to-regexp.
      if (star && re.endsWith("\\/")) re = re.slice(0, -2) + "(?:\\/(.*))?";
      else re += star ? "(.*)" : "([^\\/]+)";
      i = j;
    } else {
      re += c.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&");
      i++;
    }
  }
  return new RegExp(re + "$");
}
const COMPILED = RULES.map(r => ({ ...r, re: compile(r.source) }));

function match(url) {
  for (const r of COMPILED) if (r.re.test(url)) return r;
  return null;
}

/* ---- statische Prüfungen ----------------------------------------------- */
const fehler = [];
function ok(bedingung, text) { if (!bedingung) fehler.push(text); return bedingung; }

console.log("Regeln in vercel.json: " + RULES.length);
console.log("trailingSlash: " + vj.trailingSlash + "\n");

ok(vj.trailingSlash === true, "trailingSlash muss true sein, sonst produziert jede Regel einen zusaetzlichen Hop");
ok(RULES.every(r => r.permanent === true), "jede Regel muss permanent: true (301) sein");

// doppelte Quellen: die zweite koennte nie greifen und waere stiller Ballast
const gesehen = new Set();
for (const r of RULES) {
  if (gesehen.has(r.source)) fehler.push("doppelte Quelle: " + r.source);
  gesehen.add(r.source);
}

// Ziele muessen im Build existieren, sonst zeigt der Redirect auf eine 404
const zielFehlt = new Set();
for (const r of RULES) {
  const d = r.destination;
  if (d.includes(":")) continue;
  const p = d.endsWith("/") ? path.join(ROOT, "dist", d, "index.html") : path.join(ROOT, "dist", d);
  if (!fs.existsSync(p)) zielFehlt.add(d);
}
ok(zielFehlt.size === 0, "Ziel existiert nicht im Build: " + [...zielFehlt].join(", "));

// KETTEN: kein Ziel darf selbst wieder von einer Regel gefangen werden
const ketten = [];
for (const r of RULES) {
  if (r.destination.includes(":")) continue;
  const m = match(r.destination);
  if (m) ketten.push(r.source + " -> " + r.destination + " -> " + m.destination + " (Regel " + m.source + ")");
}
ok(ketten.length === 0, "Redirect-Kette:\n      " + ketten.join("\n      "));

// jede erwartete Quell-URL trifft genau eine Regel, mit und ohne Slash
console.log("Gruppe  alte URL                                                              -> Ziel                                     Status");
console.log("-".repeat(150));
let zeilen = 0;
for (const [url, ziel] of Object.entries(ERWARTET)) {
  const m = match(url);
  const ohne = url.length > 1 && url.endsWith("/") ? url.slice(0, -1) : null;
  const mOhne = ohne ? match(ohne) : m;
  let status = "ok";
  if (!m) status = "KEINE REGEL";
  else if (m.destination !== ziel) status = "FALSCHES ZIEL: " + m.destination;
  else if (!mOhne) status = "ohne Slash nicht abgedeckt (waere ein zweiter Hop)";
  else if (mOhne.destination !== ziel) status = "ohne Slash falsches Ziel: " + mOhne.destination;
  if (status !== "ok") fehler.push(url + ": " + status);
  const gruppe = url.startsWith("/frankonia-") ? "G1"
    : /sicherheitsanalyse|kundenstory/.test(url) ? "G2"
      : /hallo-welt|feed|category|tag|author/.test(url) ? "G4" : "G3";
  console.log(gruppe + "      " + decodeURIComponent(url).slice(0, 68).padEnd(70) + "-> " + ziel.padEnd(42) + status);
  zeilen++;
}
console.log("-".repeat(150));
console.log(zeilen + " Quell-URLs geprueft\n");

// und die, die niemals umgeleitet werden duerfen
const falschGefangen = [];
for (const u of NICHT_UMLEITEN) {
  const m = match(u);
  if (m) falschGefangen.push(u + " wird von " + m.source + " gefangen -> " + m.destination);
}
ok(falschGefangen.length === 0, "darf NICHT umgeleitet werden:\n      " + falschGefangen.join("\n      "));
console.log("nicht umzuleitende URLs geprueft: " + NICHT_UMLEITEN.length + " (davon faelschlich gefangen: " + falschGefangen.length + ")");

// Vollständigkeit gegen die Sitemap der alten Seite
const verwaist = [];
let umgeleitet = 0, bleibt = 0;
for (const u of ALTE_SEITE) {
  if (match(u)) { umgeleitet++; continue; }
  const p = path.join(ROOT, "dist", decodeURIComponent(u), "index.html");
  if (fs.existsSync(p)) bleibt++;
  else verwaist.push(u);
}
ok(verwaist.length === 0, "alte URL wird nach dem Umzug ein 404:\n      " + verwaist.join("\n      "));
console.log("alte Seite: " + ALTE_SEITE.length + " Adressen — " + umgeleitet +
  " umgeleitet, " + bleibt + " unveraendert vorhanden, " + verwaist.length + " verwaist");

/* ---- Live-Teil, optional ------------------------------------------------ */
const base = process.argv[2];
function kopf(url) {
  return new Promise(res => {
    const mod = url.startsWith("https") ? https : http;
    const rq = mod.request(url, { method: "HEAD" }, r => res({ code: r.statusCode, loc: r.headers.location }));
    rq.on("error", e => res({ code: 0, loc: String(e.message) }));
    rq.end();
  });
}
(async () => {
  if (base) {
    console.log("\nLive-Prüfung gegen " + base);
    console.log("-".repeat(150));
    for (const [url, ziel] of Object.entries(ERWARTET)) {
      const hops = [];
      let cur = base.replace(/\/$/, "") + url;
      for (let i = 0; i < 5; i++) {
        const r = await kopf(cur);
        hops.push(r.code);
        if (r.code >= 300 && r.code < 400 && r.loc) { cur = r.loc.startsWith("http") ? r.loc : base.replace(/\/$/, "") + r.loc; }
        else break;
      }
      const endPfad = cur.replace(base.replace(/\/$/, ""), "");
      const einHop = hops.length === 2 && hops[0] === 301 && hops[1] === 200;
      const status = einHop && endPfad === ziel ? "ok" : "PROBLEM hops=" + hops.join(",") + " endet auf " + endPfad;
      if (status !== "ok") fehler.push("live " + url + ": " + status);
      console.log(decodeURIComponent(url).slice(0, 68).padEnd(70) + "-> " + ziel.padEnd(42) + status);
    }
    for (const u of ["/wp-admin/", "/wp-login.php"]) {
      const r = await kopf(base.replace(/\/$/, "") + u);
      const status = r.code === 404 ? "ok (404, wie gewuenscht)" : "PROBLEM: " + r.code + " " + (r.loc || "");
      if (r.code !== 404) fehler.push("live " + u + ": " + status);
      console.log(u.padEnd(70) + "-> 404".padEnd(45) + status);
    }
  } else {
    console.log("\n(Kein Live-Test — Basis-URL als Argument uebergeben, um nach dem Deploy zu pruefen.)");
  }

  console.log("\nProbleme: " + fehler.length);
  fehler.forEach(f => console.log("  ! " + f));
  process.exit(fehler.length ? 1 : 0);
})();
