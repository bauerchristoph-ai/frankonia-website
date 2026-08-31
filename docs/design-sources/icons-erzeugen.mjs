/* Erzeugt das Icon-Paket (favicon, Android, iOS, maskable) aus der Bildmarke des
 * FRANKONIA-Logos. EINMAL in der Entwicklung laufen lassen, nie im Bau:
 *
 *   node docs/design-sources/icons-erzeugen.mjs
 *
 * ⚠️⚠️ WARUM CHROME UND NICHT EIN BILDWERKZEUG: auf diesem Rechner gibt es kein
 * Python, kein Pillow, kein ImageMagick und kein ffmpeg (in CLAUDE.md
 * dokumentiert). Was es gibt, ist ein headless Chrome — und der ist ein
 * vollwertiger SVG-Rasterizer. Die Icons entstehen also, indem eine winzige
 * HTML-Seite mit der Bildmarke in exakter Zielgröße gerendert und abfotografiert
 * wird. Kein Upscaling, jede Größe direkt aus dem Vektor.
 *
 * ⚠️ DIE QUELLE IST DIE BILDMARKE ALLEIN, nicht das Logo mit Schriftzug. Der
 * Schriftzug ist 9,6:1 breit; in einem 16x16-Tab wäre er ein grauer Strich.
 * Die Marke wird aus source-images/logos/Frankonia_Logo_High_white-font_RGB.svg
 * gelesen (die <g> mit den sechs Formen) und ihr Rahmen mit getBBox() im Browser
 * EXAKT bestimmt — analytisch ginge das nicht, die Formen enthalten Bézierkurven.
 *
 * ⚠️ FARBE: #43a5db, das Blau der Logodatei. Das ist NICHT --color-blue-light
 * (#3D9AD3) der Website — das offizielle Logoblau weicht leicht ab. Für ein
 * Markenzeichen gilt die Marke, nicht der Token.
 */
import fs from "node:fs";
import path from "node:path";
import net from "node:net";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const QUELLE = path.join(WURZEL, "source-images", "Logos", "Frankonia_Logo_High_white-font_RGB.svg");
const ZIEL = process.env.ICONS_ZIEL || path.join(WURZEL, "assets", "icons", "app");

const LOGOBLAU = "#43a5db";
const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
].find((p) => fs.existsSync(p));
if (!CHROME) throw new Error("Chrome nicht gefunden");

/* ------------------------------------------------- Bildmarke herauslösen */

const svg = fs.readFileSync(QUELLE, "utf8");
const g = svg.match(/<g>([\s\S]*?)<\/g>/);
if (!g) throw new Error("die <g> mit der Bildmarke wurde nicht gefunden");
const alleFormen = g[1]
  .replace(/class="cls-2"/g, 'fill="' + LOGOBLAU + '" fill-rule="evenodd"')
  .match(/<(?:path|polygon)\b[^>]*\/>/g);
if (!alleFormen || alleFormen.length !== 6) {
  throw new Error("erwartet 6 Formen, gefunden " + (alleFormen ? alleFormen.length : 0));
}

const MIT_SCHWUNG = process.env.ICONS_MIT_SCHWUNG === "1";
let marke = null; /* wird in main() nach der Messung gesetzt */

/* ----------------------------------------------------------- CDP-Minimum */

function freierPort() {
  return new Promise((res) => {
    const s = net.createServer();
    s.listen(0, "127.0.0.1", () => {
      const p = s.address().port;
      s.close(() => res(p));
    });
  });
}

/* ⚠️ /json/list und NICHT /json/version: letzteres gibt das BROWSER-Ziel, und
   dort gibt es die Page-Domaene nicht ("'Page.enable' wasn't found"). Gebraucht
   wird ein SEITEN-Ziel. */
async function verbinde(port) {
  for (let i = 0; i < 80; i++) {
    try {
      const r = await fetch("http://127.0.0.1:" + port + "/json/list");
      const liste = await r.json();
      const ziel = liste.find((z) => z.type === "page" && z.webSocketDebuggerUrl);
      if (ziel) return ziel.webSocketDebuggerUrl;
    } catch {
      /* Chrome noch nicht da */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error("Chrome antwortet nicht mit einem Seiten-Ziel");
}

class Sitzung {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.warten = new Map();
    ws.addEventListener("message", (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && this.warten.has(m.id)) {
        const { res, rej } = this.warten.get(m.id);
        this.warten.delete(m.id);
        m.error ? rej(new Error(m.error.message)) : res(m.result);
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((res, rej) => {
      this.warten.set(id, { res, rej });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
}

/* --------------------------------------------------------------- Rendern */

function seite(inhalt) {
  return "data:text/html;charset=utf-8," + encodeURIComponent(inhalt);
}

/* Eine Seite, die JEDE FORM EINZELN vermessbar macht — getBBox pro Form.
   ⚠️ Analytisch geht das nicht: die Formen enthalten Bézierkurven, deren
   Ausdehnung nicht aus den Stützpunkten folgt. Und die Reihenfolge in der Datei
   ist keine verlässliche Kennung, wer das Logo neu exportiert kann sie ändern.
   Gemessen wird deshalb, welche Form nach rechts weit über alle anderen
   hinausragt — das ist der Schwung. */
const messSeite = `<!doctype html><meta charset="utf-8">
<body style="margin:0">
<svg id="m" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1727.85 809.61" width="800">${alleFormen
  .map((f, i) => f.replace("<", '<g id="f' + i + '"><').replace(/\/>$/, "/></g>"))
  .join("\n")}</svg>
</body>`;

/* Ein Icon: quadratisches SVG, Marke zentriert, mit Rand. */
function iconSeite({ px, bbox, rand, hintergrund }) {
  const seiteMitRand = Math.max(bbox.width, bbox.height) / (1 - 2 * rand);
  const x = bbox.x + bbox.width / 2 - seiteMitRand / 2;
  const y = bbox.y + bbox.height / 2 - seiteMitRand / 2;
  const bg = hintergrund ? `background:${hintergrund};` : "";
  return `<!doctype html><meta charset="utf-8">
<body style="margin:0;width:${px}px;height:${px}px;${bg}display:flex;align-items:center;justify-content:center">
<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}"
     viewBox="${x} ${y} ${seiteMitRand} ${seiteMitRand}">${marke}</svg>
</body>`;
}

async function main() {
  fs.mkdirSync(ZIEL, { recursive: true });
  const port = await freierPort();
  const profil = path.join(process.env.TEMP || ".", "chrome-icons-" + port);
  const proc = spawn(
    CHROME,
    [
      "--headless=new",
      "--remote-debugging-port=" + port,
      "--user-data-dir=" + profil,
      "--no-first-run",
      "--disable-gpu",
      "--hide-scrollbars",
      "about:blank",
    ],
    { stdio: "ignore" }
  );

  try {
    const wsUrl = await verbinde(port);
    const ws = new WebSocket(wsUrl);
    await new Promise((r) => ws.addEventListener("open", r));
    const s = new Sitzung(ws);
    await s.send("Page.enable");
    await s.send("Runtime.enable");

    /* 1. Rahmen der Marke exakt messen */
    await s.send("Page.navigate", { url: seite(messSeite) });
    await new Promise((r) => setTimeout(r, 900));
    const mess = await s.send("Runtime.evaluate", {
      expression: `(() => {
        const raus = [];
        document.querySelectorAll("#m > g").forEach((g) => {
          const b = g.getBBox();
          raus.push({ x: b.x, y: b.y, width: b.width, height: b.height });
        });
        return JSON.stringify(raus);
      })()`,
      returnByValue: true,
    });
    const alleBboxen = JSON.parse(mess.result.value);
    const rechts = alleBboxen.map((b) => b.x + b.width);
    const groesste = Math.max(...rechts);
    const zweit = rechts.slice().sort((a, b) => b - a)[1];
    const SCHWUNG = rechts.indexOf(groesste);
    /* Nur wenn die Form deutlich heraussteht, ist sie der Schwung. */
    if (groesste - zweit < 200) throw new Error("keine Form ragt klar heraus — Logo geaendert?");
    console.log(
      "Schwung erkannt: Form " + SCHWUNG + " reicht bis x=" + groesste.toFixed(0) +
        ", alle anderen bis x=" + zweit.toFixed(0)
    );
    const formen = MIT_SCHWUNG ? alleFormen : alleFormen.filter((_, k) => k !== SCHWUNG);
    marke = formen.join("\n");

    /* Rahmen der VERWENDETEN Formen */
    const genutzt = MIT_SCHWUNG ? alleBboxen : alleBboxen.filter((_, k) => k !== SCHWUNG);
    const x0 = Math.min(...genutzt.map((b) => b.x));
    const y0 = Math.min(...genutzt.map((b) => b.y));
    const x1 = Math.max(...genutzt.map((b) => b.x + b.width));
    const y1 = Math.max(...genutzt.map((b) => b.y + b.height));
    const bbox = { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
    console.log(
      "Bildmarke im Vektor: x " + bbox.x.toFixed(1) + "  y " + bbox.y.toFixed(1) +
        "  " + bbox.width.toFixed(1) + " x " + bbox.height.toFixed(1) +
        "  (Verhaeltnis " + (bbox.width / bbox.height).toFixed(3) + ")"
    );

    /* 2. Die Icons.
       Rand und Hintergrund folgen der Vorgabe des QA-Auftrags:
       favicon auf Weiss, Android transparent, maskable mehr Rand und deckend,
       iOS deckend (iOS mag keine Transparenz und legt sonst Schwarz darunter). */
    const AUFTRAEGE = [
      { name: "icon-16.png", px: 16, rand: 0.04, hintergrund: "#ffffff" },
      { name: "icon-32.png", px: 32, rand: 0.04, hintergrund: "#ffffff" },
      { name: "icon-48.png", px: 48, rand: 0.04, hintergrund: "#ffffff" },
      { name: "icon-192.png", px: 192, rand: 0.08, hintergrund: null },
      { name: "icon-512.png", px: 512, rand: 0.08, hintergrund: null },
      /* Maskable: die aeussere 20% koennen beschnitten werden, das Motiv muss
         also in der inneren "safe zone" liegen -> deutlich mehr Rand. */
      { name: "icon-512-maskable.png", px: 512, rand: 0.22, hintergrund: "#ffffff" },
      { name: "apple-touch-icon.png", px: 180, rand: 0.1, hintergrund: "#ffffff" },
    ];

    for (const a of AUFTRAEGE) {
      await s.send("Emulation.setDeviceMetricsOverride", {
        width: a.px,
        height: a.px,
        deviceScaleFactor: 1,
        mobile: false,
      });
      /* Ohne Hintergrund: der Standard-Hintergrund von Chrome muss transparent
         werden, sonst kommt Weiss mit. */
      await s.send("Emulation.setDefaultBackgroundColorOverride", {
        color: a.hintergrund ? { r: 255, g: 255, b: 255, a: 1 } : { r: 0, g: 0, b: 0, a: 0 },
      });
      await s.send("Page.navigate", { url: seite(iconSeite({ ...a, bbox })) });
      await new Promise((r) => setTimeout(r, 500));
      const shot = await s.send("Page.captureScreenshot", { format: "png" });
      const daten = Buffer.from(shot.data, "base64");
      fs.writeFileSync(path.join(ZIEL, a.name), daten);
      const w = daten.readUInt32BE(16);
      const h = daten.readUInt32BE(20);
      console.log(
        "  " + a.name.padEnd(26) + w + "x" + h + "  " + String(daten.length).padStart(6) + " Bytes  " +
          (a.hintergrund ? "deckend" : "transparent")
      );
      if (w !== a.px || h !== a.px) throw new Error(a.name + ": " + w + "x" + h + " statt " + a.px);
    }

    ws.close();
  } finally {
    proc.kill();
  }

  /* 3. favicon.ico aus den drei kleinen PNG bauen.
     ⚠️ Eine .ico ist ein Container: 6-Byte-Kopf, dann je Bild ein
     16-Byte-Eintrag, dann die Bilddaten. PNG-in-ICO ist seit Vista erlaubt und
     von jedem heute relevanten Browser unterstuetzt — deshalb braucht es keinen
     BMP-Kodierer. */
  const teile = [16, 32, 48].map((px) => ({
    px,
    daten: fs.readFileSync(path.join(ZIEL, "icon-" + px + ".png")),
  }));
  const kopf = Buffer.alloc(6);
  kopf.writeUInt16LE(0, 0);
  kopf.writeUInt16LE(1, 2);
  kopf.writeUInt16LE(teile.length, 4);
  let offset = 6 + 16 * teile.length;
  const eintraege = [];
  for (const t of teile) {
    const e = Buffer.alloc(16);
    e.writeUInt8(t.px === 256 ? 0 : t.px, 0);
    e.writeUInt8(t.px === 256 ? 0 : t.px, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(t.daten.length, 8);
    e.writeUInt32LE(offset, 12);
    eintraege.push(e);
    offset += t.daten.length;
  }
  const ico = Buffer.concat([kopf, ...eintraege, ...teile.map((t) => t.daten)]);
  fs.writeFileSync(path.join(ZIEL, "favicon.ico"), ico);
  console.log("  favicon.ico".padEnd(28) + "16+32+48       " + String(ico.length).padStart(6) + " Bytes");

  /* 4. Manifest */
  const manifest = {
    name: "FRANKONIA Sicherheitsdienst",
    short_name: "FRANKONIA",
    description: "Zertifizierter Sicherheitsdienst für Franken und Bayern.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    lang: "de",
    dir: "ltr",
    background_color: "#010101",
    theme_color: "#010101",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
  fs.writeFileSync(path.join(ZIEL, "site.webmanifest"), JSON.stringify(manifest, null, 2) + "\n");
  console.log("  site.webmanifest".padEnd(28) + "3 Icon-Eintraege");
  console.log("\nZiel: assets/icons/app/ — build.js kopiert die Dateien ins Web-Root.");
}

await main();
