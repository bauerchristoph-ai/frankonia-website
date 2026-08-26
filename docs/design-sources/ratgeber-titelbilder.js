/*
 * Exportiert die Titelbilder der Ratgeber-Artikel. 2026-08-26.
 *
 *     node docs/design-sources/ratgeber-titelbilder.js "<Quellordner>"
 *
 * Läuft in der Entwicklung, nicht im Build.
 *
 * WARUM EIN SKRIPT FÜR VIER BILDER: die drei bereits vorhandenen
 * Titelbilder (art-34a, art-kosten, art-brandwache) wurden am 21.08. von Hand
 * exportiert, und die sieben Artikel sollen einheitlich aussehen. Die
 * Zielgrößen, das Format und die Qualitätsstufe stehen deshalb hier als Tabelle
 * und nicht in einer Kommandozeile, die niemand wiederfindet.
 *
 * ⚠️ DIE ZWEI BREITEN SIND GEMESSEN, NICHT GERATEN. Der Rahmen im Artikel ist
 * auf 44rem gedeckelt, also maximal 704 CSS-Pixel breit — 1408 deckt damit
 * genau DPR 2 ab, 768 die Telefonbreite. Eine dritte Stufe wäre Ballast: der
 * Rahmen wird nie breiter als 704.
 *
 * ⚠️ ALLE VIER QUELLEN SIND SCHON 1600x900, also exakt 16:9 wie der Rahmen.
 * Es wird deshalb NICHTS zugeschnitten, nur skaliert — geprüft, bevor
 * exportiert wurde. Käme eine Quelle in einem anderen Verhältnis, müsste hier
 * eine Zuschnitt-Entscheidung getroffen werden, und die gehört nicht in ein
 * Skript, das "nur skalieren" heißt: das Skript bricht dann ab.
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SRC = process.argv[2];
if (!SRC) {
  console.error('Aufruf: node docs/design-sources/ratgeber-titelbilder.js "<Quellordner>"');
  process.exit(1);
}
const OUT = path.join(__dirname, "..", "..", "assets", "images");

// Breiten und Qualitätsstufen der drei bestehenden Bilder, damit die sieben
// Artikel dieselbe Anmutung und dieselbe Gewichtsklasse haben.
const BREITEN = [768, 1408];
const WEBP_Q = 78;
const JPEG_Q = 82;
const SOLL_VERHAELTNIS = 16 / 9;

/*
 * ⚠️ art-tariflohn BEKOMMT EINE EIGENE QUALITAETSSTUFE, und das ist gemessen,
 * nicht Geschmack. Bei der gemeinsamen Stufe 78/82 kam es auf 117KB WebP und
 * 157KB JPEG — gegen 35 bis 82KB bei den drei bestehenden Bildern und gegen die
 * Projektvorgabe von unter 100KB. Es ist zugleich das detailreichste Motiv des
 * Satzes (mittlerer Kantenkontrast 8,54 gegen 4,84 bis 8,04 bei den anderen),
 * ein Dienstplan mit Taschenrechner also viel feine Struktur. Genau dort fällt
 * eine niedrigere Stufe am wenigsten auf, und genau dort kostet sie am meisten
 * Bytes: 68/72 bringt es auf 97KB WebP und 117KB JPEG.
 * ⚠️ DAS BILD IST DAS LCP-ELEMENT seines Artikels (loading="eager",
 * fetchpriority="high"), also nicht irgendein Bild weiter unten — deshalb
 * lohnt der Sonderfall überhaupt.
 * Dieses Projekt hat für dieselbe Abwägung schon einen Präzedenzfall: zwei der
 * zehn Leistungsfotos liegen bei WebP 62 statt 72, aus demselben Grund.
 */
const SONDERSTUFE = { "art-tariflohn": { webp: 68, jpeg: 72 } };

const BILDER = ["art-bewerbung", "art-tariflohn", "art-voraussetzungen", "art-qualifikationen"];

(async () => {
  for (const name of BILDER) {
    const quelle = path.join(SRC, name + ".jpg");
    if (!fs.existsSync(quelle)) {
      console.log("FEHLT: " + name + ".jpg");
      continue;
    }
    const m = await sharp(quelle).metadata();
    const v = m.width / m.height;
    if (Math.abs(v - SOLL_VERHAELTNIS) > 0.01) {
      throw new Error(
        name + " ist " + m.width + "x" + m.height + " (" + v.toFixed(3) + "), erwartet 16:9. " +
        "Dieses Skript skaliert nur — ein Zuschnitt ist eine gestalterische Entscheidung " +
        "und muss von Hand getroffen werden."
      );
    }

    const sonder = SONDERSTUFE[name];
    const qWebp = sonder ? sonder.webp : WEBP_Q;
    const qJpeg = sonder ? sonder.jpeg : JPEG_Q;
    const zeile = [name.padEnd(22) + m.width + "x" + m.height + (sonder ? " [q" + qWebp + "]" : "")];
    for (const b of BREITEN) {
      const h = Math.round(b / SOLL_VERHAELTNIS);
      const webp = await sharp(quelle).resize(b, h).webp({ quality: qWebp }).toBuffer();
      fs.writeFileSync(path.join(OUT, name + "-" + b + ".webp"), webp);
      zeile.push(b + "w WebP " + Math.round(webp.length / 1024) + "KB");
    }
    // JPEG-Rückfall nur in der großen Stufe — genau wie bei den drei
    // bestehenden Bildern. Ein 768er JPEG würde nie ausgeliefert: jeder
    // Browser, der kein WebP kann, ist alt genug, dass er auch das <source>
    // mit den Breiten nicht auswertet und schlicht das src nimmt.
    const jpg = await sharp(quelle).resize(1408, 792).jpeg({ quality: qJpeg, mozjpeg: true }).toBuffer();
    fs.writeFileSync(path.join(OUT, name + "-1408.jpg"), jpg);
    zeile.push("1408w JPEG " + Math.round(jpg.length / 1024) + "KB");
    console.log("  " + zeile.join("  ·  "));
  }
})();
