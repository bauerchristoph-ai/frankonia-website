/*
 * Schreibt die Redirect-Liste in vercel.json — Block G, 2026-08-23.
 *
 *   node docs/design-sources/redirects-build.js
 *
 * Es gibt diesen Generator, weil jede alte URL ZWEI Regeln braucht: eine mit und
 * eine ohne Schrägstrich am Ende. Mit trailingSlash: true leitet Vercel /foo erst
 * auf /foo/ um und erst danach greift die eigene Regel — das wäre ein zweiter Hop,
 * und Redirect-Ketten sind laut Auftrag genau das, was hier nicht passieren darf.
 * Beide Varianten von Hand zu pflegen heißt, dass sie irgendwann auseinanderlaufen.
 * Dieselbe Begründung steht hinter den vier /en-Regeln, die seit dem 14.08. so
 * dastehen.
 *
 * Die Tabelle unten ist die Quelle der Wahrheit für vercel.json. Der Test
 * (redirect-test.js) trägt seine Erwartungsliste ABSICHTLICH separat — ein Test,
 * der seine Erwartung aus dem Prüfling zieht, prüft nichts.
 *
 * ⚠️ Läuft in der Entwicklung, NICHT in npm run build. vercel.json ist danach
 * eine normale, handeditierbare Datei; wer hier neu generiert, überschreibt
 * Handänderungen an der redirects-Liste.
 *
 * ⚠️ Was NICHT hier hineingehört: die Umleitung von www auf die nackte Domain.
 * Die gehört laut Auftrag in die Vercel-Domainkonfiguration, nicht in den Code —
 * im Code würde sie erst greifen, nachdem die Anfrage die Funktion erreicht hat.
 * HTTP auf HTTPS macht Vercel von selbst.
 */
const fs = require("fs");

// [source without trailing slash, destination, group]
const EXACT = [
  // G1 — Leistungsseiten: der alte frankonia-Präfix fällt weg.
  ["/frankonia-werkschutz", "/werkschutz/", "G1"],
  ["/frankonia-objektschutz", "/objektschutz/", "G1"],
  ["/frankonia-sicherheitstechnik", "/sicherheitstechnik/", "G1"],
  ["/frankonia-veranstaltungsschutz", "/veranstaltungsschutz/", "G1"],
  ["/frankonia-revier-schliessdienst", "/revier-schliessdienst/", "G1"],
  ["/frankonia-kaufhausdetektei", "/kaufhausdetektei/", "G1"],
  ["/frankonia-empfangsdienst", "/empfangsdienst/", "G1"],

  // G2 — sonstige Seiten.
  ["/sicherheitsanalyse", "/sicherheitskonzept/", "G2"],
  ["/kundenstory-kunde-1", "/referenzen/", "G2"],
  ["/kundenstory-kunde-2", "/referenzen/", "G2"],

  // G3 — die acht Blogartikel. Vier zeigen auf ihre portierte Fassung, vier auf
  // den bestehenden Artikel, der ihr Thema abdeckt (Entscheidung aus Block F,
  // vom Kunden am 23.08. freigegeben).
  ["/bewerbung-im-sicherheitsdienst-die-3-haeufigsten-fehler", "/ratgeber/bewerbung-sicherheitsdienst/", "G3"],
  ["/tariflohn-2026-im-sicherheitsdienst", "/ratgeber/tariflohn-sicherheitsdienst/", "G3"],
  ["/voraussetzungen-im-sicherheitsdienst", "/ratgeber/voraussetzungen-sicherheitsdienst/", "G3"],
  ["/qualifikationen-im-sicherheitsdienst", "/ratgeber/qualifikationen-sicherheitsdienst/", "G3"],
  ["/jobchancen-als-sicherheitskraft", "/ratgeber/paragraph-34a-erklaert/", "G3"],
  ["/einsatzmoeglichkeiten-im-sicherheitsdienst-was-unterrichtung-sachkunde-und-gssk-wirklich-erlauben", "/ratgeber/paragraph-34a-erklaert/", "G3"],
  ["/wie-viel-kostet-die-fortbildung-zur-sicherheitskraft", "/ratgeber/qualifikationen-sicherheitsdienst/", "G3"],
  // Dieselbe alte URL in beiden Schreibweisen: die Live-Sitemap führt sie
  // prozentkodiert, verlinkt und geteilt wird sie mit dem echten §.
  ["/so-schwierig-sind-unterrichtung-sachkunde-und-gssk-%c2%a734a", "/ratgeber/paragraph-34a-erklaert/", "G3"],
  // Grossbuchstaben-Kodierung: die Live-Sitemap schreibt %c2%a7 klein, andere
  // Clients kodieren %C2%A7. Eine Regel mit dem Literal trifft nur ihre eigene
  // Schreibweise, deshalb beide.
  ["/so-schwierig-sind-unterrichtung-sachkunde-und-gssk-%C2%A734a", "/ratgeber/paragraph-34a-erklaert/", "G3"],
  ["/so-schwierig-sind-unterrichtung-sachkunde-und-gssk-§34a", "/ratgeber/paragraph-34a-erklaert/", "G3"],

  // G4 — WordPress-Altlasten.
  ["/hallo-welt", "/", "G4"],
  ["/feed", "/", "G4"],
  ["/comments/feed", "/", "G4"],
];

// Wildcards, nach allen exakten Regeln — die erste passende Regel gewinnt.
const WILD = [
  ["/author/:path*", "/ueber-uns/", "G4"],
  ["/category/:path*", "/ratgeber/", "G4"],
  ["/tag/:path*", "/ratgeber/", "G4"],
  // Fängt /irgendwas/feed/ ab, das WordPress für jede Seite und jede Kategorie
  // ausgeliefert hat.
  ["/:path*/feed", "/", "G4"],
];

const redirects = [];
// Die vier /en-Regeln bleiben vorne und unverändert (2026-08-14, englische Seite
// abgeschaltet).
for (const s of ["/en", "/en/", "/en/:path*", "/en/:path*/"])
  redirects.push({ source: s, destination: "/", permanent: true });

for (const [src, dest] of EXACT) {
  redirects.push({ source: src, destination: dest, permanent: true });
  redirects.push({ source: src + "/", destination: dest, permanent: true });
}
for (const [src, dest] of WILD) {
  redirects.push({ source: src, destination: dest, permanent: true });
  redirects.push({ source: src + "/", destination: dest, permanent: true });
}

const path = require("path");
const VJ = path.join(__dirname, "..", "..", "vercel.json");
const vj = JSON.parse(fs.readFileSync(VJ, "utf8"));
vj.redirects = redirects;
fs.writeFileSync("vercel.json", JSON.stringify(vj, null, 2) + "\n", "utf8");
console.log("vercel.json: " + redirects.length + " Redirect-Regeln (" +
  (EXACT.length + WILD.length) + " Quell-URLs x 2 Varianten + 4x /en)");
