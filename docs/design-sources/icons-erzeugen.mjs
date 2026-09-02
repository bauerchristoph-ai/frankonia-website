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

/* ⚠️⚠️ DIE VOLLSTAENDIGE MARKE, MIT SCHWUNG — umgestellt am 01.09.2026.
   Kunde: "jetzt ist halt leider beim Logo ein Teil vom Logo abgeschnitten".
   Er hat recht, und der Grund war eine Entscheidung, die im QUADRAT richtig war
   und im KREIS nicht mehr: ohne Schwung ist die Marke 0,520:1, hoch und schmal,
   und fuellt ein Quadrat gut aus — im Kreis wird daraus eine kleine Lampe mit
   viel Weiss, und was fehlt, liest sich als abgeschnittenes Logo. Es WAR ein
   Fragment der Marke.
   ICONS_OHNE_SCHWUNG=1 erzeugt die alte Fassung. */
/* ⚠️⚠️ ZWEI FASSUNGEN, NACH GROESSE GETRENNT — umgestellt am 01.09.2026, nachdem
   der Kunde die volle Marke im Kreis zum dritten Mal abgelehnt hat
   ("favicon passt immernoch nicht").

   ER HAT RECHT, UND DIE URSACHE IST GERECHNET, NICHT GERATEN: die volle Marke
   ist 1,692:1 — sie ist BREIT. In einem Kreis vom Durchmesser d darf ihre
   Breite hoechstens 0,861 d sein, dann ist ihre HOEHE 0,509 d. Die Laterne, das
   einzige wiedererkennbare Element, nimmt nur die linken ~26 % der Breite ein,
   ist also gut 0,22 d breit — bei einem 32er Tab sind das SIEBEN PIXEL, und der
   Schwung daneben verjuengt sich auf eine Haarlinie. Gerendert und angesehen:
   ein blaues Kringel, kein Zeichen.

   Deshalb: 16 und 32 tragen die LATERNE (0,520:1, hoch — sie fuellt den Kreis
   auf 0,79 d Hoehe, also mehr als das Dreifache), ab 48 die VOLLE Marke. Das
   ist bei Favicons die Regel und nicht die Ausnahme: ein Tab-Icon ist ein
   Signet, kein Logo.
   ⚠️ Das ist AUCH die Antwort auf die vorige Meldung ("ein Teil vom Logo
   abgeschnitten"): dort war die Laterne die EINZIGE Fassung, in allen Groessen.
   Jetzt sieht man die vollstaendige Marke ueberall, wo genug Pixel dafuer da
   sind — im Lesezeichen, in der Verlaufsliste, auf dem Startbildschirm.

   ICONS_OHNE_SCHWUNG=1 nimmt fuer ALLE Groessen die Laterne (die Fassung vom
   31.08.), ICONS_NUR_VOLL=1 fuer alle die volle Marke (die vom 01.09. frueh). */
const NUR_LATERNE = process.env.ICONS_OHNE_SCHWUNG === "1";
const NUR_VOLL = process.env.ICONS_NUR_VOLL === "1";
let fassung = null; /* { voll: {marke, bbox}, laterne: {marke, bbox} }, in main() gesetzt */

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

/* Ein Icon: quadratisches SVG, Marke zentriert, mit Rand.
   Mit kreis: true steht die Marke in einem weissen Kreis statt auf einer
   weissen Flaeche — Wunsch des Kunden vom 01.09.2026 fuer den Browsertab.

   ⚠️⚠️ DER KREIS WIRD IM SVG GEZEICHNET, NICHT ALS CSS-HINTERGRUND. Ein
   border-radius auf dem <body> gibt keine transparenten Ecken: Chrome
   fotografiert die Seite, und was ausserhalb des gerundeten Hintergrunds liegt,
   ist der Seitenhintergrund — also je nach Einstellung Weiss oder Schwarz, aber
   nicht durchsichtig. Ein <circle> im SVG mit
   setDefaultBackgroundColorOverride auf durchsichtig ergibt echte Ecken.

   ⚠️⚠️ EIN KREIS BRAUCHT MEHR RAND ALS EIN QUADRAT, und das ist Geometrie, kein
   Geschmack: die Bildmarke ist 0,520:1, also hoch und schmal. Damit ihr Rahmen
   ganz in einen Kreis mit Durchmesser d passt, darf die Hoehe hoechstens
   d / sqrt(1 + 0,52²) = 0,887 d sein — sonst stehen die Ecken des Rahmens aus
   dem Kreis heraus. Mit Luft zum Rand liegt der brauchbare Bereich bei 0,70 bis
   0,78; siehe die Werte in AUFTRAEGE. */
function iconSeite({ px, marke, bbox, rand, hintergrund, kreis }) {
  const seiteMitRand = Math.max(bbox.width, bbox.height) / (1 - 2 * rand);
  const x = bbox.x + bbox.width / 2 - seiteMitRand / 2;
  const y = bbox.y + bbox.height / 2 - seiteMitRand / 2;
  /* Der Kreis fuellt das Quadrat des viewBox genau aus. */
  const scheibe = kreis
    ? `<circle cx="${x + seiteMitRand / 2}" cy="${y + seiteMitRand / 2}" r="${seiteMitRand / 2}" fill="${hintergrund || "#ffffff"}"/>`
    : "";
  const bg = hintergrund && !kreis ? `background:${hintergrund};` : "";
  return `<!doctype html><meta charset="utf-8">
<body style="margin:0;width:${px}px;height:${px}px;${bg}display:flex;align-items:center;justify-content:center">
<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}"
     viewBox="${x} ${y} ${seiteMitRand} ${seiteMitRand}">${scheibe}${marke}</svg>
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
    /* ⚠️ String.fromCharCode(10) statt einer Escape-Folge: die Patch-Datei, die
       diesen Block gesetzt hat, lief durch ein Heredoc, und das frisst auf diesem
       Rechner eine Backslash-Ebene (in CLAUDE.md dokumentiert). */
    const TRENNER = String.fromCharCode(10);
    /* Der Rahmen einer Formmenge — im Browser gemessen, nie gerechnet. */
    const rahmen = (bb) => {
      const x0 = Math.min(...bb.map((b) => b.x));
      const y0 = Math.min(...bb.map((b) => b.y));
      const x1 = Math.max(...bb.map((b) => b.x + b.width));
      const y1 = Math.max(...bb.map((b) => b.y + b.height));
      return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
    };
    const ohneSchwung = alleFormen.filter((_, k) => k !== SCHWUNG);
    fassung = {
      voll: { marke: alleFormen.join(TRENNER), bbox: rahmen(alleBboxen) },
      laterne: {
        marke: ohneSchwung.join(TRENNER),
        bbox: rahmen(alleBboxen.filter((_, k) => k !== SCHWUNG)),
      },
    };
    for (const [name, f] of Object.entries(fassung)) {
      console.log(
        "Fassung " + name.padEnd(8) + " " + f.bbox.width.toFixed(1) + " x " +
          f.bbox.height.toFixed(1) + "  (Verhaeltnis " +
          (f.bbox.width / f.bbox.height).toFixed(3) + ")"
      );
    }

    /* 2. Die Icons.
       Rand und Hintergrund folgen der Vorgabe des QA-Auftrags:
       favicon auf Weiss, Android transparent, maskable mehr Rand und deckend,
       iOS deckend (iOS mag keine Transparenz und legt sonst Schwarz darunter). */
    const AUFTRAEGE = [
      /* Runder weisser Kreis mit der Marke darin — Wunsch des Kunden vom
         01.09.2026, nachdem die eckige weisse Flaeche im Browsertab als Kaestchen
         gelesen wurde.

         ⚠️⚠️ rand 0.08 IST GERECHNET, NICHT GESCHAETZT, und die Rechnung aendert
         sich mit dem Schwung. Die vollstaendige Marke ist 1,692:1 — also BREIT,
         nicht hoch. Damit ihr Rahmen ganz in einen Kreis mit Durchmesser d
         passt, gilt Breite <= d / sqrt(1 + 1/1,692²) … ausgerechnet:
         Diagonale = h * sqrt(1 + 1,692²) = h * 1,965 <= d, also h <= 0,509 d und
         Breite <= 0,861 d. Da rand die groessere Kante steuert, ist
         rand >= (1 - 0,861) / 2 = 0,0695 die Grenze. 0.08 liegt mit einem Hauch
         Reserve darunter (Breite 0,84 d) und ist damit der GROESSTE nachweislich
         passende Wert.
         ⚠️ 0.06 waere 0,88 d und damit ueber der Grenze — gerendert sah es noch
         gut aus, weil die Ecken des Rahmens bei dieser Kurve leer sind. Auf
         "sieht noch gut aus" wollte ich das nicht stellen.
         ⚠️ Fuer die ALTE Fassung ohne Schwung (0,520:1) galt eine andere Grenze,
         88,7 %, und dort war 0.10 der verglichene Wert. Wer ICONS_OHNE_SCHWUNG=1
         benutzt, sollte rand wieder auf 0.10 stellen.

         ⚠️ Bei 16 px ist das Icon ein weisser Punkt mit einem blauen Zeichen,
         egal welcher Rand — der Preis eines Kreises im Tab. Auf HiDPI-Schirmen
         nimmt der Browser fuer den Tab ohnehin die 32er, und dort traegt die
         Marke. Der 16er ist der Altfall. */
      /* ⚠️⚠️ DIE .ico TRAEGT DIE LATERNE, DIE APP-ICONS DIE VOLLE MARKE. Der lange
         Kommentar am Kopf dieser Datei erklaert, warum — kurz: die volle Marke
         ist 1,692:1, im Kreis also flach, und die Laterne darin waere bei 32 px
         sieben Pixel breit. Die Laterne allein ist 0,520:1 und fuellt den Kreis
         auf 0,79 d Hoehe.

         ⚠️ DIE GRENZE LIEGT BEI DER DATEIART, NICHT BEI EINER PIXELZAHL: 16, 32
         und 48 sind die drei Bilder IN der favicon.ico, also das Zeichen in der
         Browserleiste — die muessen untereinander dasselbe zeigen, sonst wechselt
         das Icon beim Wechsel der Bildschirmdichte sein Motiv. 192 und 512 sind
         App-Icons und werden gross gezeigt, dort tragt die volle Marke.
         Nachgesehen und nicht nur gerechnet: bei 48 ist die Laterne der vollen
         Marke neun Pixel breit, der Schwung nimmt zwei Drittel der Flaeche und die
         Laterne haengt klein am Rand.

         ⚠️ UND DER RAND UNTERSCHEIDET SICH DESHALB AUCH: er ist gerechnet, nicht
         gewaehlt. Damit der Rahmen ganz in den Kreis passt, muss seine Diagonale
         kleiner sein als der Durchmesser — bei 1,692:1 sind das hoechstens
         0,861 d Breite (Grenze rand 0,070), bei 0,520:1 hoechstens 0,887 d Hoehe
         (Grenze rand 0,057). rand steuert immer die GROESSERE Kante. 0.08 bzw.
         0.10 liegen mit Reserve darunter. Wer die Zahlen anfasst, rechnet neu. */
      /* ═══ TAB-ICONS: GENAU WIE DIE ORIGINALSEITE — 02.09.2026 ═════════════
         Kunde, nach mehreren Runden: "favicon passt uebrigens immernoch nicht
         weil der schwung / die fahne immernoch abgeschnitten ist — anbei wie es
         aktuell in der originalen webseite ist, bitte genau so umsetzen."

         Also nicht geraten, sondern das Original AUSGEMESSEN. Heruntergeladen
         von frankonia-sicherheit.de/wp-content/uploads/fbrfg/ und Pixel gezaehlt:
           favicon-96x96.png   83,5 % transparent, 0 % Weiss
           Tinte 88 x 54 in 96 — also die VOLLSTAENDIGE Marke (Verhaeltnis 1,63)
           Raender 3 links, 5 rechts, 21 oben und unten
         apple-touch-icon.png ergibt dieselbe Anordnung (165 x 101 in 180).

         ⚠⚠ DAS KEHRT ZWEI FRUEHERE ENTSCHEIDUNGEN UM, und beide waren meine
         Auslegung seiner Worte, nicht seine Vorgabe: der weisse KREIS ("runder
         weisser kreis mit logo drin") und die Beschraenkung auf die LATERNE, mit
         der ich das Abschneiden umgehen wollte. Genau dieses Weglassen des
         Schwungs ist der Fehler, den er dreimal gemeldet hat. Das Original
         zeigt die ganze Marke ohne Kreis — dem folgt das hier.

         ⚠ rand 0.04 ist gerechnet: die Tinte des Originals nimmt 88 von 96 px
         der GROESSEREN Kante ein, also (1 - 88/96) / 2 = 0,042. rand steuert
         immer die groessere Kante, hier die Breite.
         ⚠ Kein Hintergrund und kein Kreis — transparent wie das Original. Fuer
         die APP-Icons weiter unten gilt das ausdruecklich NICHT: ein
         transparentes Symbol wird auf einem iOS-Startbildschirm zur schwarzen
         Kachel. Das Original macht diesen Fehler, wir uebernehmen ihn nicht. */
      { name: "icon-16.png", px: 16, form: "voll", rand: 0.04 },
      { name: "icon-32.png", px: 32, form: "voll", rand: 0.04 },
      { name: "icon-48.png", px: 48, form: "voll", rand: 0.04 },
      { name: "icon-96.png", px: 96, form: "voll", rand: 0.04 },
      { name: "icon-192.png", px: 192, form: "voll", rand: 0.08, hintergrund: "#ffffff", kreis: true },
      { name: "icon-512.png", px: 512, form: "voll", rand: 0.08, hintergrund: "#ffffff", kreis: true },

      /* ⚠️⚠️ DIESE ZWEI BLEIBEN QUADRATISCH, und das ist kein Vergessen:
         das Betriebssystem maskiert sie SELBST.

         apple-touch-icon: iOS legt eine eigene abgerundete Maske darueber und
         fuellt Transparenz mit SCHWARZ. Ein Kreis mit durchsichtigen Ecken gaebe
         also schwarze Zwickel um eine weisse Scheibe. Als weisses Quadrat wird
         daraus auf dem Home-Bildschirm von selbst ein weisses, gerundetes Feld
         mit der Marke — genau das gewuenschte Bild, nur von iOS gerundet.

         maskable: Android beschneidet die aeusseren 20 % nach eigener Form
         (Kreis, Squircle, Tropfen). Eine Scheibe darin wuerde ein zweites Mal
         eingerueckt und schwaebte klein in der Mitte. Deshalb randlos weiss mit
         dem Motiv in der safe zone. */
      { name: "icon-512-maskable.png", px: 512, form: "voll", rand: 0.22, hintergrund: "#ffffff" },
      { name: "apple-touch-icon.png", px: 180, form: "voll", rand: 0.14, hintergrund: "#ffffff" },
    ];

    for (const a of AUFTRAEGE) {
      await s.send("Emulation.setDeviceMetricsOverride", {
        width: a.px,
        height: a.px,
        deviceScaleFactor: 1,
        mobile: false,
      });
      /* ⚠️ DER SEITENHINTERGRUND MUSS FUER KREIS-ICONS DURCHSICHTIG SEIN, obwohl
         sie eine Hintergrundfarbe tragen — die Farbe steckt im <circle>, nicht in
         der Seite. Waere hier Weiss, wuerden die Ecken weiss ausgefuellt und das
         Icon waere wieder ein Quadrat mit einem unsichtbaren Kreis darin. Genau
         dieser Fall ist der Grund, warum die Bedingung a.kreis mitpruefen muss
         und nicht nur a.hintergrund. */
      const deckend = a.hintergrund && !a.kreis;
      await s.send("Emulation.setDefaultBackgroundColorOverride", {
        color: deckend ? { r: 255, g: 255, b: 255, a: 1 } : { r: 0, g: 0, b: 0, a: 0 },
      });
      /* NUR_LATERNE / NUR_VOLL sind die zwei Rueckwege auf eine einzige Fassung;
         ohne sie entscheidet der Auftrag. */
      const wahl = NUR_LATERNE ? "laterne" : NUR_VOLL ? "voll" : a.form;
      const f = fassung[wahl];
      if (!f) throw new Error(a.name + ": unbekannte Fassung " + wahl);
      await s.send("Page.navigate", {
        url: seite(iconSeite({ ...a, marke: f.marke, bbox: f.bbox })),
      });
      await new Promise((r) => setTimeout(r, 500));
      const shot = await s.send("Page.captureScreenshot", { format: "png" });
      const daten = Buffer.from(shot.data, "base64");
      fs.writeFileSync(path.join(ZIEL, a.name), daten);
      const w = daten.readUInt32BE(16);
      const h = daten.readUInt32BE(20);
      console.log(
        "  " + a.name.padEnd(26) + w + "x" + h + "  " + String(daten.length).padStart(6) + " Bytes  " +
          (a.kreis ? "weisser Kreis" : a.hintergrund ? "deckend" : "transparent") +
          "  " + wahl
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
