/*
 * Baut den Content-Security-Policy-Header in vercel.json. 2026-08-26.
 *
 *     node docs/design-sources/csp-build.js
 *
 * Läuft in der Entwicklung, nicht im Build — genauso wie
 * docs/design-sources/redirects-build.js, das im selben vercel.json den
 * `redirects`-Block schreibt. Die beiden fassen sich nicht an.
 *
 * WARUM EIN GENERATOR FÜR EINEN HEADER
 * `vercel.json` ist JSON und kann keine Kommentare enthalten. Eine CSP ohne
 * Begründung ist aber genau die Art Konfiguration, die beim nächsten
 * Drittanbieter entweder zu weit geöffnet oder zu eng gelassen wird — und ein zu
 * eng gelassener Eintrag fällt NICHT auf, weil ein blockiertes Script keinen
 * sichtbaren Fehler produziert. Die Tabelle unten ist deshalb die Quelle, und
 * jeder Host trägt seinen Grund neben sich.
 *
 * ⚠️⚠️ DIE EINE ECHTE ABSCHWÄCHUNG: 'unsafe-inline' in script-src.
 * Vorher stand hier `script-src 'self'` — eine sehr strenge Richtlinie, die
 * diese Seite sich leisten konnte, weil sie kein Drittanbieter-JavaScript hatte.
 * Mit Cookiebot, Consent Mode und dem Tag Manager ist das nicht zu halten:
 *   · Consent Mode und der GTM-Loader sind INLINE-Scripts;
 *   · der Tag Manager fügt den Code jedes konfigurierten Tags zur Laufzeit als
 *     inline-Script ein.
 * Eine Hash-Liste (die strenge Alternative) würde die zwei eigenen Inline-Blöcke
 * abdecken und in der Sekunde brechen, in der im GTM ein Tag angelegt wird —
 * still, ohne Fehlermeldung, und niemand würde die CSP als Ursache vermuten.
 * Nonces wären die saubere Lösung, brauchen aber einen Server, der den <head>
 * pro Anfrage rendert; diese Seite ist statisch.
 * Deshalb: 'unsafe-inline', bewusst und hier dokumentiert. Was dadurch verloren
 * geht, ist der Schutz gegen eingeschleustes Inline-JavaScript; was bleibt, ist
 * die HOST-Beschränkung — ein Angreifer kann keinen fremden Server nachladen.
 *
 * ⚠️ WENN GA4 UND GOOGLE ADS DAZUKOMMEN, muss diese Datei erneut laufen. Die
 * dafür nötigen Hosts stehen unten als `SPAETER` — auskommentiert, nicht
 * gelöscht, damit sie nicht neu recherchiert werden müssen. Ein Tag, dessen Host
 * fehlt, feuert nicht und meldet das nur in der Browser-Konsole.
 */
const fs = require("fs");
const path = require("path");

/* -------------------------------------------------------------------------
   Die Hosts, je Direktive, mit Grund
   ------------------------------------------------------------------------- */

const CSP = {
  "default-src": [["'self'", "Grundregel: alles, was unten nicht eigens erlaubt ist"]],

  "base-uri": [["'self'", "verhindert, dass eingeschleustes <base> alle relativen URLs umbiegt"]],

  "object-src": [["'none'", "kein <object>/<embed> auf dieser Seite, und keins gewollt"]],

  "script-src": [
    ["'self'", "eigenes JavaScript aus /js/ und /assets/js/vendor/"],
    ["'unsafe-inline'", "Consent Mode und GTM-Loader sind inline; GTM fügt Tag-Code zur Laufzeit inline ein — siehe die Notiz im Kopf dieser Datei"],
    ["https://consent.cookiebot.com", "uc.js, das Consent-Banner selbst"],
    ["https://consentcdn.cookiebot.com", "Nachladepfad des Banners (Sprachdateien, Dialog)"],
    ["https://d.frankonia-sicherheit.de", "eigener Tagging-Server (stape), lädt den GTM-Container"],
    ["https://challenges.cloudflare.com", "Turnstile-Spamschutz im Formular"],
    ["https://js-eu1.hsforms.net", "HubSpot-Formular-Loader für das Bewerberformular (EU-Rechenzentrum)"],
    ["https://js.hsforms.net", "HubSpot lädt von hier Folge-Skripte des Embeds nach"],
    ["https://js-eu1.hs-scripts.com", "HubSpot-Folgeskripte des Formular-Embeds"],
  ],

  "style-src": [
    ["'self'", "eigenes CSS aus /css/"],
    ["'unsafe-inline'", "war schon vorher gesetzt: dieses Projekt animiert über inline gesetzte Custom Properties (GSAP schreibt style-Attribute)"],
    ["https://consentcdn.cookiebot.com", "Banner-Styles"],
    ["https://js-eu1.hsforms.net", "HubSpot bringt eigenes Styling mit"],
  ],

  "img-src": [
    ["'self'", "eigene Bilder"],
    ["data:", "inline-SVG und die eingebetteten Icons"],
    ["https://*.basemaps.cartocdn.com", "Kartenkacheln auf /, /einsatzgebiete/ und /kontakt/ (war schon gesetzt)"],
    ["https://imgsct.cookiebot.com", "Zählpixel des Consent-Banners"],
    ["https://d.frankonia-sicherheit.de", "Tagging-Server, falls ein Tag ein Pixel setzt"],
    ["https://*.hsforms.com", "Bilder im HubSpot-Formular"],
    ["https://track.hubspot.com", "HubSpot-Formular-Tracking"],
  ],

  "font-src": [
    ["'self'", "die Typografie ist ein System-Stack, hier liegt nur noch die Reserve-Datei"],
    ["data:", "HubSpot bindet Schriften teils als data: URI ein"],
    ["https://js-eu1.hsforms.net", "Schriften des HubSpot-Formulars"],
  ],

  "connect-src": [
    ["'self'", "der eigene Endpoint /api/forms/submit"],
    ["https://consent.cookiebot.com", "Consent-Status abrufen und melden"],
    ["https://consentcdn.cookiebot.com", "dito"],
    ["https://d.frankonia-sicherheit.de", "Tagging-Server"],
    ["https://challenges.cloudflare.com", "Turnstile prüft im Hintergrund"],
    ["https://*.hsforms.com", "Absenden des HubSpot-Formulars"],
    ["https://api-eu1.hubspot.com", "HubSpot-Formular meldet Feldwerte zurück"],
  ],

  "frame-src": [
    ["'self'", "explizit, weil frame-src vorher fehlte und damit auf default-src zurückfiel"],
    ["https://challenges.cloudflare.com", "Turnstile rendert in einem iframe — OHNE diesen Eintrag lädt der Spamschutz nicht"],
    ["https://consentcdn.cookiebot.com", "Consent-Dialog"],
    ["https://d.frankonia-sicherheit.de", "das <noscript>-iframe des Tag Managers"],
    ["https://*.hsforms.com", "das HubSpot-Formular selbst"],
    ["https://*.hsforms.net", "dito"],
  ],

  "frame-ancestors": [["'self'", "diese Seite darf nicht fremd eingebettet werden"]],

  "form-action": [
    ["'self'", "das eigene Formular postet auf den eigenen Endpoint. Das HubSpot-Formular liegt in einem iframe und hat seine eigene Herkunft, form-action gilt dort nicht für uns"],
  ],
};

/* Für den Tag, an dem GA4 und Google Ads konfiguriert werden. Nicht gelöscht,
   weil das Nachrecherchieren länger dauert als das Kommentarzeichen. Beim
   Aktivieren in die jeweilige Direktive oben einsortieren, nicht hier unten
   anhängen.
     script-src   https://www.googletagmanager.com
                  https://*.google-analytics.com
                  https://www.googleadservices.com
                  https://googleads.g.doubleclick.net
     img-src      https://*.google-analytics.com
                  https://*.googletagmanager.com
                  https://www.google.de https://www.google.com
                  https://googleads.g.doubleclick.net
     connect-src  https://*.google-analytics.com
                  https://*.analytics.google.com
                  https://*.googletagmanager.com
     frame-src    https://td.doubleclick.net
   Läuft alles über d.frankonia-sicherheit.de (First-Party-Tagging), können
   einzelne davon entfallen — dann aber im Netzwerk-Tab prüfen, nicht raten. */

/* -------------------------------------------------------------------------
   Zusammenbauen und in vercel.json schreiben
   ------------------------------------------------------------------------- */

const wert = Object.entries(CSP)
  .map(([direktive, eintraege]) => direktive + " " + eintraege.map(([h]) => h).join(" "))
  .join("; ");

const VJ = path.join(__dirname, "..", "..", "vercel.json");
const vj = JSON.parse(fs.readFileSync(VJ, "utf8"));

// Den einen Header-Block finden, der die CSP führt — nicht den ersten, der
// zufällig auf "/(.*)" passt: der erste ist die noindex-Regel für
// *.vercel.app.
const block = (vj.headers || []).find((b) =>
  (b.headers || []).some((h) => h.key === "Content-Security-Policy")
);
if (!block) throw new Error("Kein Header-Block mit Content-Security-Policy in vercel.json gefunden");

const eintrag = block.headers.find((h) => h.key === "Content-Security-Policy");
const vorher = eintrag.value;
eintrag.value = wert;

fs.writeFileSync(VJ, JSON.stringify(vj, null, 2) + "\n", "utf8");

console.log("vercel.json: CSP aktualisiert\n");
console.log("  Direktiven: " + Object.keys(CSP).length);
console.log("  Hosts:      " + Object.values(CSP).flat().filter(([h]) => h.startsWith("https://")).length);
console.log("  Zeichen:    " + vorher.length + " -> " + wert.length);
console.log("\n--- neue Richtlinie ---");
for (const [d, e] of Object.entries(CSP)) {
  console.log("  " + d);
  for (const [h, grund] of e) console.log("      " + h.padEnd(42) + grund);
}
