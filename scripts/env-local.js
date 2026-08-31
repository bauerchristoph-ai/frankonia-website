/* .env.local einlesen — EINE Kopie für build.js und den Dev-Server.
 *
 * Das Projekt hat null Abhängigkeiten, also kein dotenv. Der Parser deckt, was
 * in einer .env-Datei üblich ist: KEY=WERT je Zeile, # als Kommentar, optionale
 * Anführungszeichen. Kein Mehrzeiler, keine Variablen-Expansion.
 *
 * ⚠️ Eine bereits gesetzte Umgebungsvariable GEWINNT — dieselbe Rangfolge wie
 * dotenv. Sonst könnte man einen Wert für einen Lauf nicht überschreiben.
 *
 * ⚠️⚠️ WARUM DAS SEIT DEM 31.08.2026 AUCH build.js BENUTZT, und das ist keine
 * Aufräumarbeit: vorher las NUR der Dev-Server diese Datei. Ein `npm run build`
 * lief also mit leerer Umgebung und griff still auf die dokumentierten
 * Produktionswerte zurück — was harmlos war, solange jeder öffentliche Wert
 * einen Rückfall hatte. Mit CARTO_BASEMAP_KEY gibt es den ersten Wert OHNE
 * Rückfall (eine Karte ohne Schlüssel liefert Wasserzeichen-Kacheln, siehe
 * build.js). Ohne diese Zeile hier wäre jeder lokale Bau daran gescheitert,
 * obwohl der Schlüssel in .env.local steht.
 */
const fs = require("fs");
const path = require("path");

function envLokalLaden(wurzel) {
  const datei = path.join(wurzel, ".env.local");
  if (!fs.existsSync(datei)) return 0;
  let anzahl = 0;
  for (const rohzeile of fs.readFileSync(datei, "utf8").split(/\r?\n/)) {
    const zeile = rohzeile.trim();
    if (!zeile || zeile.startsWith("#")) continue;
    const i = zeile.indexOf("=");
    if (i < 1) continue;
    const name = zeile.slice(0, i).trim().replace(/^export\s+/, "");
    let wert = zeile.slice(i + 1).trim();
    if ((wert.startsWith('"') && wert.endsWith('"')) || (wert.startsWith("'") && wert.endsWith("'"))) {
      wert = wert.slice(1, -1);
    }
    if (!wert) continue;
    if (process.env[name] === undefined) process.env[name] = wert;
    anzahl++;
  }
  return anzahl;
}

module.exports = { envLokalLaden };
