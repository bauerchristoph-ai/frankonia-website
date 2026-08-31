/*
 * Lokaler Entwicklungsserver: liefert dist/ AUS und führt dabei den echten
 * Formular-Endpoint aus. 2026-08-26.
 *
 *     npm run dev:api
 *
 * ⚠️ WARUM DAS EXISTIERT: `npm run dev` liefert nur Dateien aus. Der Endpoint
 * unter /api/forms/submit/ ist eine Vercel-Serverless-Funktion, und die führt ein
 * Dateiserver nicht aus — ein Absenden endet lokal in einem 404. Vercel bringt
 * dafür `vercel dev` mit, das aber die Vercel-CLI verlangt. Dieses Skript macht
 * dasselbe mit Node-Bordmitteln: es lädt api/forms/submit.js und ruft den
 * Handler mit denselben (req, res) auf, die Vercel übergibt.
 *
 * ⚠️⚠️ ES SCHREIBT IN DIE ECHTEN SYSTEME. HubSpot, Brevo und die Mails sind
 * produktiv — es gibt keine Testumgebung. Wer hier absendet, legt einen echten
 * Kontakt an und verschickt zwei echte Mails. Deshalb: eine erkennbare
 * Testadresse benutzen.
 *
 * ⚠️ TURNSTILE LÄUFT LOKAL MIT CLOUDFLARES TESTSCHLÜSSELN, und das ist kein
 * Schlendrian: ein Site-Key ist an seine Domain gebunden, auf 127.0.0.1 würde das
 * Widget also gar nicht validieren und jede Absendung mit 400 enden. Die
 * Testschlüssel sind von Cloudflare genau dafür veröffentlicht.
 *
 * ⚠️ DESHALB BAUT DIESES SKRIPT SELBST, statt sich auf `npm run build` zu
 * verlassen: der Site-Key steht im HTML, muss also VOR dem Bauen gesetzt sein.
 * Das von Hand zu verlangen wäre eine Fußangel — wer es vergisst, sieht ein
 * Widget, das nicht validiert, und sucht den Fehler im Endpoint.
 * Mit DEV_TURNSTILE_ECHT=1 nimmt es stattdessen die echten Schlüssel.
 *
 * ⚠️ Dieses Skript wird NIE ausgeliefert: build.js kopiert nur assets/, css/, js/
 * und die gebauten Seiten nach dist/. scripts/ bleibt außen vor.
 */

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const WURZEL = path.join(__dirname, "..");
const DIST = path.join(WURZEL, "dist");
const PORT = Number(process.env.PORT || 3000);

/* ------------------------------------------------------- .env.local laden */
/* ⚠️ Der Parser lebt seit dem 31.08.2026 in scripts/env-local.js, weil build.js
   ihn ebenfalls braucht — CARTO_BASEMAP_KEY ist der erste öffentliche Wert ohne
   Rückfall, und ohne diese Datei wäre jeder lokale Bau daran gescheitert. Zwei
   Kopien desselben Parsers wären zwei Orte, an denen die Rangfolge
   (gesetzte Umgebungsvariable gewinnt) auseinanderlaufen kann. */
const { envLokalLaden } = require("./env-local.js");
const envLaden = () => envLokalLaden(WURZEL);

const TURNSTILE_TEST_SECRET = "1x0000000000000000000000000000000AA";
const TURNSTILE_TEST_SITEKEY = "1x00000000000000000000AA";

const geladen = envLaden();

/* Lokal immer der Testschlüssel, außer man setzt ausdrücklich etwas anderes. */
let turnstileHinweis = "";
if (process.env.DEV_TURNSTILE_ECHT === "1") {
  turnstileHinweis = "echter Secret aus .env.local (Widget muss die Domain kennen)";
} else {
  process.env.TURNSTILE_SECRET_KEY = TURNSTILE_TEST_SECRET;
  turnstileHinweis = "Cloudflare-Testschluessel (besteht immer)";
}

/* ------------------------------------------------------------------ Bauen */
/* build.js liest TURNSTILE_SITE_KEY aus der Umgebung (siehe PUBLIC_ENV dort),
   also hier setzen und dann bauen. require() fuehrt das Skript aus; es ruft
   kein process.exit, laeuft synchron durch und ist damit als Baustein
   benutzbar. */
if (process.env.DEV_TURNSTILE_ECHT !== "1" && !process.env.TURNSTILE_SITE_KEY) {
  process.env.TURNSTILE_SITE_KEY = TURNSTILE_TEST_SITEKEY;
}
require(path.join(WURZEL, "build.js"));

/* ------------------------------------------------------- Endpoint einbinden */
const handler = require(path.join(WURZEL, "api/forms/submit.js"));

const TYP = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".vcf": "text/vcard; charset=utf-8",
};

/* Vercels res-Objekt hat status()/json()/send() — ein nackter Node-Response
   nicht. Die vier Methoden nachrüsten, damit der Handler unverändert läuft. */
function resAufruesten(res) {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (o) => {
    if (!res.getHeader("Content-Type")) res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(o));
    return res;
  };
  res.send = (s) => {
    res.end(s);
    return res;
  };
  return res;
}

function koerperLesen(req) {
  return new Promise((fertig) => {
    const teile = [];
    req.on("data", (c) => teile.push(c));
    req.on("end", () => {
      const text = Buffer.concat(teile).toString("utf8");
      const typ = String(req.headers["content-type"] || "");
      if (typ.includes("application/json")) {
        try {
          return fertig(JSON.parse(text || "{}"));
        } catch {
          return fertig({});
        }
      }
      if (typ.includes("application/x-www-form-urlencoded")) {
        return fertig(Object.fromEntries(new URLSearchParams(text)));
      }
      // Vercel übergibt bei unbekanntem Typ den Rohtext; submit.js kann das.
      fertig(text);
    });
  });
}

const server = http.createServer(async (req, res) => {
  const pfad = decodeURIComponent(String(req.url).split("?")[0]);

  /* ---- Der Endpoint. Beide Schreibweisen, wie in Produktion: vercel.json
     setzt trailingSlash, deshalb postet der Client auf die Variante mit
     Schrägstrich, und die ohne wird umgeschrieben. */
  if (pfad === "/api/forms/submit/" || pfad === "/api/forms/submit") {
    req.body = await koerperLesen(req);
    try {
      await handler(req, resAufruesten(res));
    } catch (e) {
      console.error("DEV: Handler hat eine Ausnahme geworfen:", e);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end(JSON.stringify({ ok: false, fehler: "ausnahme", meldung: String(e && e.message) }));
      }
    }
    return;
  }

  /* ---- Statische Dateien aus dist/ */
  let datei = path.join(DIST, pfad);
  try {
    if (fs.statSync(datei).isDirectory()) datei = path.join(datei, "index.html");
  } catch {
    /* keine Datei, keine Verzeichnis — unten kommt die 404 */
  }
  // Kein Ausbruch aus dist/ (..%2F und Verwandte).
  if (!path.resolve(datei).startsWith(path.resolve(DIST))) {
    res.statusCode = 403;
    return res.end("403");
  }
  fs.readFile(datei, (fehler, inhalt) => {
    if (fehler) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.end(
        '<!doctype html><meta charset="utf-8"><title>404</title>' +
          "<p>404 — " + pfad + " gibt es in dist/ nicht.<p><a href=\"/\">Zur Startseite</a>"
      );
    }
    res.setHeader("Content-Type", TYP[path.extname(datei)] || "application/octet-stream");
    res.setHeader("Cache-Control", "no-store");
    res.end(inhalt);
  });
});

server.listen(PORT, () => {
  const siteKeyImBuild = (() => {
    try {
      const html = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
      const m = html.match(/data-sitekey="([^"]*)"/);
      return m ? m[1] : null;
    } catch {
      return null;
    }
  })();

  console.log("");
  console.log("  FRANKONIA — lokaler Server MIT Formular-Endpoint");
  console.log("  http://127.0.0.1:" + PORT + "/");
  console.log("");
  console.log("  .env.local:  " + (geladen ? geladen + " Schluessel geladen" : "NICHT GEFUNDEN"));
  console.log("  Turnstile:   " + turnstileHinweis);
  console.log("");
  if (siteKeyImBuild !== TURNSTILE_TEST_SITEKEY && process.env.DEV_TURNSTILE_ECHT !== "1") {
    console.log("  ⚠️  DAS ABSENDEN WIRD FEHLSCHLAGEN.");
    console.log("      Im Build steckt der Produktions-Site-Key, der an die echte Domain");
    console.log("      gebunden ist — auf 127.0.0.1 validiert das Widget nicht. Einmal so");
    console.log("      bauen, dann laeuft es:");
    console.log("");
    console.log("          TURNSTILE_SITE_KEY=" + TURNSTILE_TEST_SITEKEY + " npm run build");
    console.log("");
  }
  console.log("  ⚠️  HubSpot, Brevo und die Mails sind PRODUKTIV. Wer hier absendet,");
  console.log("      legt einen echten Kontakt an. Erkennbare Testadresse benutzen.");
  console.log("");
});
