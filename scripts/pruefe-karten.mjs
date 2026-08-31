/* Bau-Tor: wirkt der CARTO-Schlüssel wirklich?
 *
 * ⚠️⚠️ WARUM NICHT „das Wasserzeichen in den Bytes suchen", wie es der
 * QA-Auftrag vorschlug: das Wasserzeichen ist in die PIXEL gerendert, es steht
 * nicht als Zeichenkette in der Datei. Man käme nur mit einem eigenen
 * PNG-Dekoder daran — für ein Bau-Tor viel Angriffsfläche.
 *
 * Diese Prüfung ist STÄRKER und braucht keinen Dekoder: dieselbe Kachel wird
 * zweimal geholt, einmal mit und einmal ohne Schlüssel. Sind die Bytes gleich,
 * hat der Schlüssel keine Wirkung — falsch, abgelaufen, oder CARTO ignoriert
 * ihn. Genau das ist der Zustand, der still Wasserzeichen ausliefert. Ein
 * Wasserzeichen zu ERKENNEN wäre eine Annahme über sein Aussehen; „der
 * Schlüssel verändert die Antwort" ist eine Tatsache über seine Wirkung.
 *
 * ⚠️ Ein NETZWERKFEHLER bricht den Bau NICHT ab. Ein Deployment darf nicht
 * daran scheitern, dass ein Dritter gerade nicht erreichbar ist — sonst wäre
 * das Tor selbst die häufigste Ausfallursache. Es warnt und lässt durch. Nur
 * eine erfolgreiche Antwort, die sich nicht vom schlüssellosen Fall
 * unterscheidet, ist ein Fehler.
 *
 * ⚠️⚠️ `process.exitCode` UND NICHT `process.exit()`, und das ist auf diesem
 * Rechner gemessen: `process.exit()` mit noch offenen fetch-Verbindungen bringt
 * Node auf Windows zum Absturz mit
 *   Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), src/win/async.c:76
 * — und ein abgestürzter Prozess liefert keinen verlässlichen Exitcode. Ein
 * Bau-Tor, dessen Fehlermeldung im Log steht, dessen Exitcode aber 0 ist, lässt
 * genau das durch, was es verhindern soll. `exitCode` setzen und Node selbst
 * herunterfahren lassen vermeidet das.
 */
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
require("./env-local.js").envLokalLaden(WURZEL);

/* Ein Ausschnitt über Franken, also genau die Gegend, die beide Karten zeigen. */
const KACHEL = "https://a.basemaps.cartocdn.com/dark_all/6/34/21.png";

async function hol(url) {
  const r = await fetch(url, { redirect: "follow" });
  const b = Buffer.from(await r.arrayBuffer());
  return { status: r.status, bytes: b.length, md5: crypto.createHash("md5").update(b).digest("hex") };
}

async function main() {
  const key = (process.env.CARTO_BASEMAP_KEY || "").trim();

  /* Ohne Schlüssel ist build.js schon abgebrochen — dieser Fall tritt nur beim
     Direktaufruf auf. Dann ist Schweigen richtig: die Aussage „Schlüssel fehlt"
     gehört an EINE Stelle, und das ist der Bau. */
  if (!key) {
    console.log("pruefe-karten: CARTO_BASEMAP_KEY nicht gesetzt — build.js meldet das, hier nichts zu tun.");
    return 0;
  }

  let mit, ohne;
  try {
    [mit, ohne] = await Promise.all([hol(KACHEL + "?key=" + encodeURIComponent(key)), hol(KACHEL)]);
  } catch (err) {
    console.warn("pruefe-karten: CARTO nicht erreichbar (" + err.message + ") — übersprungen, Bau läuft weiter.");
    return 0;
  }

  const zeile = (n, r) =>
    "  " + n.padEnd(16) + "HTTP " + r.status + "  " + String(r.bytes).padStart(6) + " Bytes  md5 " + r.md5.slice(0, 16);
  console.log("pruefe-karten: " + KACHEL);
  console.log(zeile("mit Schlüssel", mit));
  console.log(zeile("ohne", ohne));

  const probleme = [];
  if (mit.status !== 200) probleme.push("die Kachel MIT Schlüssel antwortet mit HTTP " + mit.status);
  if (mit.md5 === ohne.md5) {
    probleme.push(
      "die Kachel ist mit und ohne Schlüssel byte-identisch — der Schlüssel wirkt nicht. " +
        "Ohne Wirkung liefert CARTO Wasserzeichen-Kacheln, und zwar mit HTTP 200."
    );
  }

  if (probleme.length) {
    console.error("");
    for (const p of probleme) console.error("  FEHLER: " + p);
    console.error("");
    console.error("  Prüfen: steht CARTO_BASEMAP_KEY in Vercel für Production UND Preview,");
    console.error("  und ist der Wert derselbe wie im CARTO-Konto?");
    console.error("");
    return 1;
  }
  console.log("pruefe-karten: der Schlüssel wirkt (Antwort unterscheidet sich vom schlüssellosen Fall).");
  return 0;
}

process.exitCode = await main();
