/* Bessert einzelne Bilder nach: verkleinern und/oder eine WebP-Fassung daneben
 * stellen. Aufgabe 27g, 31.08.2026.
 *
 * ⚠️ DIE LISTE IST KURZ UND SOLL ES BLEIBEN. Gemessen wurden 89 ausgelieferte
 * Bilder auf zehn Seiten, gewichtet nach Byte je ANGEZEIGTEM Pixel. Genau ein
 * echter Ausreisser (30 Byte/Pixel), Zweitplatzierter 20, Rest unter 11 — der
 * Bestand ist also gut. Das ist kein Werkzeug fuer einen Rundumschlag.
 *
 * ⚠️⚠️ DER UEBERGROESSEN-FAKTOR ALLEIN IST DER FALSCHE MASSSTAB. Die DEKRA-Siegel
 * liegen bei 13,6-facher Uebergroesse und sind trotzdem harmlos: flache Grafiken
 * mit 18 KB. Ein Logo mit 4-facher Uebergroesse und 5 KB ist kein Befund. Es
 * zaehlt das Gewicht, nicht das Verhaeltnis.
 *
 * ⚠️⚠️ EIN NAHELIEGENDER WEG WAR FALSCH, und das war messbar: das Logo des
 * Wirtschaftsclubs liegt in assets/images/client-logos/ bereits bei 8 KB. Es
 * einfach zu verwenden macht es UNSICHTBAR — jene Fassung ist weisse Grafik
 * (mittlere Helligkeit 255, 76 % transparent) fuer den dunklen Seitengrund, die
 * Partnersektion der Startseite steht aber auf rgb(255,255,255). Zwei Dateien mit
 * fast gleichem Namen, zwei verschiedene Aufgaben — geprueft durch Auslesen der
 * Pixel, nicht am Dateinamen abgeleitet.
 *
 * ⚠️ CHROME IST DER RASTERISIERER. Auf dieser Maschine gibt es kein Python, kein
 * Pillow, kein ImageMagick und kein ffmpeg — nur Node und Chrome.
 *
 * Einmal in der Entwicklung laufen lassen, nicht in npm run build:
 *   node docs/design-sources/bilder-nachbessern.mjs
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";

const WURZEL = process.cwd();
/* Je Auftrag: Datei, Zielbreite (0 = Masse behalten), WebP-Guete.
   ⚠️ Die drei social-* sind 480x850 und damit richtig dimensioniert — ihnen fehlt
   nur die WebP-Fassung, deshalb breite: 0. Nur das Logo wird wirklich kleiner. */
const AUFTRAEGE = [
  { datei: "assets/images/partner/partner-wirtschaftsclub-bamberg.png", breite: 300, webpGuete: 0.9 },
  { datei: "assets/images/social-werkschutz.jpg", breite: 0, webpGuete: 0.82 },
  { datei: "assets/images/social-interview.jpg", breite: 0, webpGuete: 0.82 },
  { datei: "assets/images/social-veranstaltungsschutz.jpg", breite: 0, webpGuete: 0.82 },
];

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 9713;

function warte(ms) { return new Promise(r => setTimeout(r, ms)); }

function hol(pfad) {
  return new Promise((ok, fehl) => {
    http.get({ host: "127.0.0.1", port: PORT, path: pfad }, res => {
      let d = ""; res.on("data", c => d += c); res.on("end", () => ok(JSON.parse(d)));
    }).on("error", fehl);
  });
}

async function main() {
  for (const auf of AUFTRAEGE) {
    if (!fs.existsSync(auf.datei)) throw new Error("Quelle fehlt: " + auf.datei);
  }

  /* Kleiner Dateiserver, damit die Leinwand nicht an file:// scheitert. */
  const srv = http.createServer((req, res) => {
    const p = path.join(WURZEL, decodeURIComponent(req.url.split("?")[0]));
    if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
    /* ⚠️ ECHTER MIME-TYP, sonst schlaegt im.decode() mit EncodingError fehl —
       das hat einen Lauf gekostet. */
    const e2 = p.substring(p.lastIndexOf(".") + 1).toLowerCase();
    const typen = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", json: "application/json" };
    res.writeHead(200, { "Content-Type": typen[e2] || "text/plain" });
    res.end(fs.readFileSync(p));
  });
  await new Promise(r => srv.listen(8791, "127.0.0.1", r));

  const kind = spawn(CHROME, [
    "--headless=new", "--disable-gpu", "--no-first-run",
    "--remote-debugging-port=" + PORT,
    "--user-data-dir=" + path.join(WURZEL, ".chrome-bilder"),
    "about:blank",
  ], { stdio: "ignore" });

  await warte(3500);
  const ziele = await hol("/json/list");
  const seite = ziele.find(z => z.type === "page");
  if (!seite) throw new Error("Keine Seite gefunden");

  const ws = new globalThis.WebSocket(seite.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener("open", r));
  let id = 0;
  const offen = new Map();
  ws.addEventListener("message", e => {
    const m = JSON.parse(e.data);
    if (m.id && offen.has(m.id)) { offen.get(m.id)(m); offen.delete(m.id); }
  });
  function ruf(methode, params) {
    const i = ++id;
    return new Promise(r => { offen.set(i, r); ws.send(JSON.stringify({ id: i, method: methode, params })); });
  }

  /* Auf eine Seite mit gleichem Ursprung navigieren, sonst blockt die Leinwand
     das Auslesen fremder Bilddaten. */
  await ruf("Page.navigate", { url: "http://127.0.0.1:8791/package.json" });
  await warte(800);

  for (const auf of AUFTRAEGE) {
    const vorher = fs.statSync(auf.datei).size;
    const skript = "(async () => {" +
      "const im = new Image(); im.src = " + JSON.stringify("/" + auf.datei) + ";" +
      "await im.decode();" +
      "const zb = " + auf.breite + " || im.naturalWidth;" +
      "const zh = Math.round(im.naturalHeight * zb / im.naturalWidth);" +
      "const c = document.createElement(String.fromCharCode(99,97,110,118,97,115));" +
      "c.width = zb; c.height = zh;" +
      "const x = c.getContext(String.fromCharCode(50,100));" +
      "x.imageSmoothingQuality = String.fromCharCode(104,105,103,104);" +
      "x.drawImage(im, 0, 0, zb, zh);" +
      "return JSON.stringify({ breite: zb, hoehe: zh, natur: im.naturalWidth + String.fromCharCode(120) + im.naturalHeight," +
      "  bild: c.toDataURL(im.src.endsWith(String.fromCharCode(46,112,110,103)) ? String.fromCharCode(105,109,97,103,101,47,112,110,103) : String.fromCharCode(105,109,97,103,101,47,106,112,101,103), 0.9).split(String.fromCharCode(44))[1]," +
      "  webp: c.toDataURL(String.fromCharCode(105,109,97,103,101,47,119,101,98,112), " + auf.webpGuete + ").split(String.fromCharCode(44))[1] });" +
      "})()";
    const antwort = await ruf("Runtime.evaluate", { expression: skript, awaitPromise: true, returnByValue: true });
    if (antwort.result && antwort.result.exceptionDetails) {
      throw new Error(auf.datei + ": " + JSON.stringify(antwort.result.exceptionDetails.exception));
    }
    const d = JSON.parse(antwort.result.result.value);

    /* ⚠️ Das Original nur ueberschreiben, wenn wirklich verkleinert wird — eine
       reine Neukodierung desselben Masses macht ein JPEG nur schlechter. */
    if (auf.breite && auf.breite < parseInt(d.natur, 10)) {
      fs.writeFileSync(auf.datei, Buffer.from(d.bild, "base64"));
    }
    const webpPfad = auf.datei.substring(0, auf.datei.lastIndexOf(".")) + ".webp";
    fs.writeFileSync(webpPfad, Buffer.from(d.webp, "base64"));

    const nach = fs.statSync(auf.datei).size;
    const w = fs.statSync(webpPfad).size;
    console.log("  " + auf.datei);
    console.log("    " + d.natur + ", " + Math.round(vorher / 1024) + " KB  ->  " +
      d.breite + "x" + d.hoehe + ", " + Math.round(nach / 1024) + " KB Original / " +
      Math.round(w / 1024) + " KB WebP  (Browser laedt " + Math.round(w / 1024) + " KB, " +
      Math.round((1 - w / vorher) * 100) + " % weniger)");
  }

  ws.close();
  kind.kill();
  srv.close();
  console.log("  ⚠️ Markup pruefen: <picture> mit der WebP-Quelle, width/height passend.");
}
try { await main(); } catch (e) { console.error("Fehlgeschlagen: " + e.message); process.exitCode = 1; }
