/*
 * Bereitet Kundenlogos für das Referenzen-Band auf. 2026-08-25.
 *
 *   node docs/design-sources/client-logos.js "<Quellordner>"
 *
 * Läuft in der Entwicklung, nicht im Build. Der Quellordner ist der
 * Marketing-Ordner des Kunden; die Ausgabe geht nach
 * assets/images/client-logos/.
 *
 * WARUM ES DIESES SKRIPT GIBT: das Band steht auf der dunklen Sektion, und alle
 * bereits vorhandenen Logos sind **weiße Silhouetten auf Transparenz** —
 * nachgemessen: reines Weiß mit Alphakanal, 160 Pixel hoch. Ein farbiges Logo
 * mittendrin fällt aus der Reihe, und die Lichtvariante der Sektion arbeitet mit
 * `filter: invert(1)`, was nur bei einfarbigen Silhouetten funktioniert. Neue
 * Logos müssen also dieselbe Behandlung bekommen, und die von Hand zu wiederholen
 * ist genau die Stelle, an der drei Logos später drei verschiedene Graustufen
 * haben.
 *
 * ⚠️ DIE TINTENMESSUNG IST PRO LOGO VERSCHIEDEN, und das ist der eigentliche
 * Inhalt dieser Datei:
 *   "dunkel"  — Tinte ist dunkel auf weißem Grund. Alpha = 255 - min(R,G,B).
 *               Nicht 255 - Helligkeit: ein oranger Schriftzug hat eine mittlere
 *               Helligkeit und wäre danach halb durchsichtig, also sichtbar
 *               blasser als der Rest desselben Logos. `min(R,G,B)` misst
 *               Farbdeckung statt Helligkeit und behandelt farbige Tinte auf Weiß
 *               richtig.
 *   "hell"    — Tinte ist WEISS auf farbigem Grund (Norma: weißer Schriftzug in
 *               einem roten Kasten). Alpha = min(R,G,B), also die Weißheit. Der
 *               Kasten verschwindet, der Schriftzug bleibt. Eine Silhouette des
 *               ganzen Kastens mit ausgestanzten Buchstaben wäre das Gegenteil
 *               dessen, was die Marke zeigt.
 *
 * Danach: auf die Tinte zuschneiden, auf 160 Pixel Höhe bringen, RGB auf reines
 * Weiß zwingen, als PNG und WebP schreiben. Die Breite ergibt sich — sie steht im
 * Markup als `width`, damit das Band nicht springt, und wird hier ausgegeben.
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SRC = process.argv[2];
if (!SRC) {
  console.error('Aufruf: node docs/design-sources/client-logos.js "<Quellordner>"');
  process.exit(1);
}
const OUT = path.join(__dirname, "..", "..", "assets", "images", "client-logos");
const HOEHE = 160;
const SCHWELLE = 24; // ab hier gilt ein Pixel als Tinte (Zuschnitt)

const JOBS = [
  { datei: "Norma_Logo.svg.png", ziel: "norma", tinte: "hell" },
  { datei: "Nicht in Broschüre/Logo_Schöner Leben.jpg", ziel: "schoener-leben", tinte: "dunkel" },
  { datei: "Nicht in Broschüre/Logo NachtArena.JPG", ziel: "nacht-arena", tinte: "dunkel" },
];

(async () => {
  for (const job of JOBS) {
    const quelle = path.join(SRC, job.datei);
    if (!fs.existsSync(quelle)) { console.log("FEHLT: " + job.datei); continue; }

    // ⚠️ FLACHLEGEN NUR BEIM DUNKLEN FALL. Bei "dunkel" ist die Quelle ein JPEG
    // ohne Alphakanal und Weiß ist der echte Grund, also ist Flachlegen richtig.
    // Bei "hell" wäre es der Fehler, der diese Aufbereitung zweimal ruiniert hat:
    // Norma ist ein PNG MIT Transparenz, und flachgelegt wird der transparente
    // Rand zu Weiß — also zu "Tinte", weil bei diesem Fall gerade Weiß die Tinte
    // ist. Gemessen: der Zuschnitt umfasste danach das ganze Bild statt des
    // Schriftzugs. Deshalb bleibt der Alphakanal hier erhalten und geht als
    // Faktor in die Messung ein.
    const basis = sharp(quelle);
    const { data, info } = await (job.tinte === "hell"
      ? basis.ensureAlpha()
      : basis.flatten({ background: { r: 255, g: 255, b: 255 } }).ensureAlpha()
    ).raw().toBuffer({ resolveWithObject: true });
    const { width: w, height: h, channels: ch } = info;

    // ⚠️ Der Schwellwert für "hell" ist gemessen, nicht geraten. Das Histogramm von
    // min(R,G,B) über das Norma-Logo ist deutlich zweigipfelig: der rote Kasten
    // liegt bei 0–19, die gelb-orangen Streifen bei 50–59, der weiße Schriftzug bei
    // 250+. Ohne Untergrenze bekämen die Streifen Alpha 85, also ein Drittel
    // deckendes Weiß — ein sichtbarer Schleier um den Schriftzug. 200 trennt beide
    // Gipfel mit großem Abstand und lässt den Kantenglättung der Buchstaben
    // (200–250) als Teildeckung übrig, was genau richtig ist.
    const BODEN = job.tinte === "hell" ? 200 : 0;
    const alpha = Buffer.alloc(w * h);
    for (let p = 0; p < w * h; p++) {
      const i = p * ch;
      const min = Math.min(data[i], data[i + 1], data[i + 2]);
      const roh = job.tinte === "hell"
        ? Math.max(0, Math.round((min - BODEN) * 255 / (255 - BODEN)))
        : 255 - min;
      // Ein Pixel, der in der Quelle transparent ist, kann keine Tinte sein.
      alpha[p] = Math.round(roh * (data[i + 3] / 255));
    }

    // ⚠️ ALPHA NORMALISIEREN, und das ist keine Kosmetik. Bei "dunkel" ist die
    // Deckkraft direkt die Dunkelheit der Quelle — ein mittelgraues Wortzeichen
    // (Schöner Leben: min(R,G,B) um 80) käme damit auf etwa 175 statt 255 und
    // stünde im Band sichtbar blasser neben den anderen. Gemessen und im
    // Kontaktblatt gesehen. Die Streckung auf den eigenen Höchstwert bringt das
    // Zeichen auf volle Kraft und lässt die INNERE Abstufung intakt: ein
    // absichtlich helleres Element (das "bischberg" unter nacht|arena) bleibt
    // relativ heller, was die Hierarchie der Marke ist.
    // Nur beim dunklen Fall: bei "hell" wurde die Untergrenze schon gesetzt.
    // ⚠️ Bezugspunkt ist das 90. PERZENTIL der Tintenpixel, nicht ihr Höchstwert.
    // Gegen den Höchstwert zu strecken war der erste Versuch und hat kaum etwas
    // gebracht: bei Schöner Leben liegt die Masse des Wortzeichens bei 169, ein
    // paar JPEG-Artefakte aber bei 186, also wurde nur mit Faktor 1,37 gestreckt
    // und die Marke blieb bei 232 statt 255 — nachgemessen 55 volldeckende Pixel
    // in einem 646x160 großen Logo. Das 90. Perzentil trifft den FLÄCHENTON der
    // Marke, und genau der soll deckend sein; die dunkleren Ausreißer laufen in
    // die Begrenzung. Bei einem fast schwarzen Logo liegt das Perzentil schon bei
    // 255, dann passiert hier nichts.
    if (job.tinte === "dunkel") {
      const hist = new Array(256).fill(0);
      let tinte = 0;
      for (let p = 0; p < alpha.length; p++) if (alpha[p] > SCHWELLE) { hist[alpha[p]]++; tinte++; }
      if (tinte > 0) {
        let acc = 0, p90 = 255;
        for (let a = SCHWELLE + 1; a < 256; a++) { acc += hist[a]; if (acc >= tinte * 0.9) { p90 = a; break; } }
        if (p90 > 0 && p90 < 255) {
          const f = 255 / p90;
          for (let p = 0; p < alpha.length; p++) alpha[p] = Math.min(255, Math.round(alpha[p] * f));
        }
      }
    }

    // Zuschnitt auf die Tinte
    let x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (alpha[y * w + x] >= SCHWELLE) {
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
    }
    if (x1 < 0) { console.log("KEINE TINTE gefunden: " + job.datei); continue; }
    const cw = x1 - x0 + 1, chh = y1 - y0 + 1;

    // Reines Weiß mit dem gemessenen Alpha, auf den Zuschnitt beschränkt
    const rgba = Buffer.alloc(cw * chh * 4);
    for (let y = 0; y < chh; y++) for (let x = 0; x < cw; x++) {
      const s = (y + y0) * w + (x + x0), d = (y * cw + x) * 4;
      rgba[d] = rgba[d + 1] = rgba[d + 2] = 255;
      rgba[d + 3] = alpha[s];
    }

    const skaliert = sharp(rgba, { raw: { width: cw, height: chh, channels: 4 } })
      .resize({ height: HOEHE, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } });
    const png = await skaliert.clone().png({ compressionLevel: 9, palette: true }).toBuffer();
    const webp = await skaliert.clone().webp({ quality: 92, alphaQuality: 100 }).toBuffer();
    fs.writeFileSync(path.join(OUT, job.ziel + ".png"), png);
    fs.writeFileSync(path.join(OUT, job.ziel + ".webp"), webp);

    const meta = await sharp(png).metadata();
    console.log(job.ziel.padEnd(18) + "Quelle " + w + "x" + h +
      " -> Zuschnitt " + cw + "x" + chh +
      " -> " + meta.width + "x" + meta.height +
      "   PNG " + Math.round(png.length / 1024) + "KB / WebP " + Math.round(webp.length / 1024) + "KB" +
      "   width=\"" + meta.width + "\" height=\"" + meta.height + "\"");
  }
})();
