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
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
require("./env-local.js").envLokalLaden(WURZEL);

/* ⚠️⚠️ DER STIL WIRD AUS js/coverage-map.js GELESEN, NICHT HARTKODIERT — und das
   ist die Korrektur eines Fehlalarms, der diese Prüfung wertlos gemacht hat.
   Hier stand "dark_all" fest, während die Website seit Aufgabe 2 "dark_nolabels"
   lädt. Gemessen am 31.08.2026:

     dark_all/6/34/21      mit Schlüssel 11303 B  ohne 11303 B   IDENTISCH
     dark_nolabels/8/135/86 mit Schlüssel 11026 B  ohne 10828 B   verschieden

   Also: der Schlüssel wirkt, aber nicht bei dem Stil und der Zoomstufe, die hier
   geprüft wurden. Das Skript meldete deshalb "der Schlüssel wirkt nicht", obwohl
   die Live-Karte einwandfrei war — nachgewiesen mit 28 von 28 geladenen Kacheln
   und einer angesehenen, wasserzeichenfreien Kachel.

   Ein Prüfskript, das grundlos Alarm schlägt, wird nach zwei Wochen abgeschaltet.
   Deshalb liest es den Stil jetzt aus derselben Quelle, aus der der Browser ihn
   nimmt — driftet der Stil, driftet die Prüfung mit.

   ⚠️ ZOOM 8, nicht 6: bei Zoom 6 liefert CARTO dieselbe Kachel mit und ohne
   Schlüssel. Ob das eine Freigrenze oder ein Cache ist, ist von aussen nicht zu
   sehen — prüfbar ist nur, was die Website tatsächlich anfordert, und das ist
   Zoom 8 über Franken. */
function stilAusQuelle() {
  const q = fs.readFileSync(path.join(WURZEL, "js", "coverage-map.js"), "utf8");
  /* Ohne Regex, weil escape-behaftete Muster in diesem Projekt schon mehrfach
     kaputt in Dateien gelandet sind. indexOf kann nicht falsch entkommen. */
  const marke = "basemaps.cartocdn.com/";
  const a = q.indexOf(marke);
  const b = a < 0 ? -1 : q.indexOf("/", a + marke.length);
  if (a < 0 || b < 0) {
    throw new Error(
      "Kachel-Stil in js/coverage-map.js nicht gefunden — die URL dort hat sich " +
        "geaendert. Diese Pruefung muss dem folgen, sonst prueft sie etwas anderes " +
        "als die Website laedt."
    );
  }
  return q.slice(a + marke.length, b);
}

const KACHEL =
  "https://a.basemaps.cartocdn.com/" + stilAusQuelle() + "/8/135/86.png";

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

  /* ⚠️ EIN PLATZHALTER IST KEIN DEFEKTER SCHLUESSEL, und die Unterscheidung ist
     nötig: in .env.local steht bei einer Entwicklungsumgebung ohne CARTO-Konto
     ein Platzhaltertext, und der lässt jeden lokalen "npm run build"
     fehlschlagen. Genau das war am 31.08.2026 der Fall.

     ⚠️ Und es ist bewusst KEINE Abschaltung der Prüfung: erkannt wird nur ein
     Wert, der sich selbst als Platzhalter bezeichnet. Ein echter, aber
     abgelaufener Schlüssel fällt weiter durch. Auf Vercel steht der echte Wert,
     dort greift die Prüfung unverändert. */
  const platzhalter = ["PLATZHALTER", "BITTE_ERSETZEN", "BITTE-ERSETZEN", "DEIN_", "YOUR_", "XXX"];
  const alsGross = key.toUpperCase();
  if (platzhalter.some((p) => alsGross.includes(p))) {
    console.log(
      "pruefe-karten: CARTO_BASEMAP_KEY ist ein Platzhalter (" + key.length + " Zeichen)"
    );
    console.log("  Die Karte zeigt hier ein Wasserzeichen. Das ist erwartet und kein Fehler:");
    console.log("  auf Vercel steht der echte Wert, und dort prueft dieses Skript im Bau mit.");
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
