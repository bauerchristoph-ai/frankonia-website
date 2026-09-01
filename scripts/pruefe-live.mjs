/* Startdurchgang gegen ein laufendes Deployment.
 *
 * Angelegt am 01.09.2026, unmittelbar vor dem Domainumzug. Prüft in einem Lauf
 * die vier Dinge, die ein Umzug kaputt macht und die man danach teuer sucht:
 * jede Adresse der Sitemap, jede Weiterleitung aus vercel.json, den
 * Formular-Endpunkt und die kanonische Adresse jeder Seite.
 *
 * ⚠️⚠️ DIE ZU PRÜFENDE DOMAIN IST EIN ARGUMENT UND HAT KEINEN STANDARDWERT, und
 * das ist der Grund, warum dieses Skript überhaupt existiert. Am 31.08.2026 lief
 * eine ganze Messreihe gegen frankonia-website.vercel.app — eine Adresse, die
 * NICHT zu diesem Vercel-Projekt gehört und einen älteren, fremden Stand
 * ausliefert. Die Projekt-Domains stehen in der Vercel-API unter
 * `domains`; die richtige Testadresse ist frankonia-sicherheit-2.vercel.app
 * (bestätigt von Christoph am 01.09.2026).
 *
 * ⚠️ EINE LOGIN-WAND ANTWORTET MIT HTTP 200. Zwei der drei Projekt-Domains
 * liegen hinter Vercels SSO-Schutz (ssoProtection: all_except_custom_domains)
 * und liefern die Seite "Login – Vercel" mit Status 200 — in einer Statusprüfung
 * sieht das wie eine funktionierende Seite aus. Deshalb prüft dieses Skript den
 * <title> mit und bricht ab, wenn es eine Login-Wand erkennt, statt 58 grüne
 * Zeilen über einer Anmeldeseite zu melden.
 *
 *   node scripts/pruefe-live.mjs https://frankonia-sicherheit-2.vercel.app
 *   node scripts/pruefe-live.mjs https://frankonia-sicherheit.de     (nach dem Umzug)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const basis = (process.argv[2] || "").replace(/\/+$/, "");
if (!basis.startsWith("http")) {
  console.error(
    "Aufruf: node scripts/pruefe-live.mjs <basis-url>\n" +
      "  Kein Standardwert mit Absicht — siehe Kopf dieser Datei."
  );
  process.exit(2);
}

/* Die Zieldomain der Sitemap. Nach dem Umzug prüft man dieselbe Domain, die auch
   in den kanonischen Adressen steht; vorher eine Testadresse, und dann müssen
   die Pfade auf sie umgeschrieben werden. */
const sitemap = fs.readFileSync(path.join(WURZEL, "dist", "sitemap.xml"), "utf8");
const pfade = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
  const u = new URL(m[1]);
  return u.pathname;
});

const vc = JSON.parse(fs.readFileSync(path.join(WURZEL, "vercel.json"), "utf8"));
const weiter = (vc.redirects || []).filter((r) => r.source.indexOf(":") < 0 && r.source.indexOf("(") < 0);

async function hol(pfad, folgen) {
  const r = await fetch(basis + pfad, {
    redirect: folgen ? "follow" : "manual",
    headers: { "user-agent": "Mozilla/5.0 (FRANKONIA Startdurchgang)" },
  });
  return r;
}

function istLoginWand(html) {
  return html.indexOf("Login – Vercel") >= 0 || html.indexOf("Authentication Required") >= 0;
}

async function main() {
  console.log("pruefe-live: " + basis);

  /* ── Erst EINE Seite ganz lesen, um die Login-Wand auszuschliessen. */
  const probe = await hol("/", true);
  const probeHtml = await probe.text();
  if (istLoginWand(probeHtml)) {
    console.error(
      "\n  ABBRUCH: diese Adresse liefert Vercels Login-Wand, mit HTTP " + probe.status + ".\n" +
        "  Jede weitere Messung waere wertlos. Eine Projekt-Domain ohne SSO-Schutz\n" +
        "  nehmen — siehe Kopf dieser Datei."
    );
    return 1;
  }
  console.log("  Login-Wand: nein (Titel: " +
    ((probeHtml.match(/<title>([^<]*)/) || [])[1] || "?").slice(0, 46) + ")");

  let fehler = 0;

  /* ── 1 · Jede Adresse der Sitemap */
  const schlecht = [];
  for (const p of pfade) {
    const r = await hol(p, false);
    if (r.status !== 200) schlecht.push(p + " -> HTTP " + r.status);
  }
  console.log("  Sitemap-Adressen: " + (pfade.length - schlecht.length) + "/" + pfade.length + " mit HTTP 200");
  schlecht.forEach((z) => console.log("    FEHLER " + z));
  fehler += schlecht.length;

  /* ── 2 · Weiterleitungen.
     ⚠️ 301 ODER 308: Vercel antwortet auf permanent: true mit 308, nicht 301.
     Eine Pruefung, die exakt 301 verlangt, meldet 34 Fehler, die keine sind —
     genau das ist am 24.08.2026 passiert.

     ⚠️⚠️ UND SIE MUSS DER KETTE FOLGEN, NICHT DEN ERSTEN SPRUNG VERGLEICHEN.
     trailingSlash: true haengt den Schraegstrich VOR der Weiterleitungsregel an,
     also geht ein Aufruf ohne Schraegstrich in ZWEI Spruengen zum Ziel. Die
     erste Fassung dieses Skripts verglich den ersten Sprung und meldete 27
     Fehler, die alle keine waren — am 01.09.2026, eine Stunde vor dem
     Domainumzug. Gemessen: alle 65 landen am richtigen Ziel, null falsch.

     ⚠️ Und die Sprungzahl wird an der REALEN Adressform gemessen. WordPress
     liefert Adressen MIT Schraegstrich aus, also steht genau diese Form in
     Googles Index und in fremden Links — und in der loest jede der 65
     Weiterleitungen in EINEM Sprung auf. Zwei Spruenge gibt es nur, wenn jemand
     die Adresse ohne Schraegstrich eintippt. Die unrealistische Form zu messen
     erzeugt eine Warnung ueber ein Problem, das niemand hat. */
  const wSchlecht = [];
  let mehrfach = 0;
  for (const w of weiter) {
    /* Die kanonische Form: mit Schraegstrich, so wie WordPress sie ausgeliefert hat. */
    const start = w.source.endsWith("/") ? w.source : w.source + "/";
    let u = basis + start;
    let spruenge = 0;
    let code = 0;
    for (let n = 0; n < 5; n++) {
      const r = await fetch(u, { redirect: "manual", headers: { "user-agent": "Mozilla/5.0" } });
      code = r.status;
      if (r.status < 300 || r.status >= 400) break;
      spruenge++;
      u = new URL(r.headers.get("location"), basis).href;
    }
    const ziel = new URL(u).pathname;
    if (ziel !== w.destination) {
      wSchlecht.push(start + " landet auf " + ziel + ", erwartet " + w.destination);
    } else if (spruenge > 1) {
      mehrfach++;
    }
    if (code >= 400) wSchlecht.push(start + " endet mit HTTP " + code);
  }
  console.log("  Weiterleitungen: " + (weiter.length - wSchlecht.length) + "/" + weiter.length +
    " landen am richtigen Ziel" + (mehrfach ? ", davon " + mehrfach + " ueber zwei Spruenge" : ", alle in einem Sprung"));
  wSchlecht.forEach((z) => console.log("    FEHLER " + z));
  fehler += wSchlecht.length;

  /* ── 3 · Formular-Endpunkt.
     ⚠️ Es wird NICHTS abgeschickt. Ein GET auf einen POST-Endpunkt muss 405
     liefern; das beweist, dass die Funktion laeuft, ohne einen Datensatz
     anzulegen. Eine echte Testeinsendung gehoert nicht in einen Durchgang, der
     bei jedem Deploy laufen kann. */
  const ep = await hol("/api/forms/submit/", false);
  const epOk = ep.status === 405 || ep.status === 400;
  console.log("  Formular-Endpunkt: HTTP " + ep.status + (epOk ? " (Funktion antwortet)" : " — ERWARTET 405 oder 400"));
  if (!epOk) fehler++;

  /* ── 4 · Kanonische Adresse: sie muss auf die ZIELDOMAIN zeigen, nicht auf die
     gerade gepruefte. Auf einer Testadresse ist das genau richtig so. */
  const kanon = (probeHtml.match(/rel="canonical" href="([^"]+)"/) || [])[1] || "";
  const kHost = kanon ? new URL(kanon).host : "(keine)";
  console.log("  Kanonische Adresse der Startseite: " + kHost);
  if (!kanon) fehler++;

  /* ── 5 · noindex-Header: auf einer *.vercel.app MUSS er da sein, auf der
     Zieldomain darf er NICHT da sein. */
  const rob = probe.headers.get("x-robots-tag") || "";
  const istTest = new URL(basis).host.endsWith(".vercel.app");
  const robOk = istTest ? rob.indexOf("noindex") >= 0 : rob.indexOf("noindex") < 0;
  console.log("  X-Robots-Tag: " + (rob || "(keiner)") +
    (robOk ? "" : istTest ? " — FEHLER: eine Testadresse muss noindex tragen"
                          : " — FEHLER: die Zieldomain darf KEIN noindex tragen"));
  if (!robOk) fehler++;

  console.log(fehler ? "\npruefe-live: " + fehler + " Problem(e)." : "\npruefe-live: keine Probleme.");
  return fehler ? 1 : 0;
}

process.exitCode = await main();
