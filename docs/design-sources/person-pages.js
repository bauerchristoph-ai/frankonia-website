/* ==========================================================================
   Block E — the eleven person / pointer pages
   ==========================================================================
   Run once, in development, from the repo root:
       node docs/design-sources/person-pages.js
   NOT part of `npm run build` (same convention as the other generators in this
   folder). Afterwards these are ordinary pages in pages/ and may be hand-edited;
   do not re-run it over an edited page.

   WHY A GENERATOR FOR ELEVEN PAGES
   Nine of them are the same card with different data, and three things on them are
   easy to get silently wrong by copy-paste: the `noindex` (all eleven must have it),
   the vCard filename (each page has its own), and the fact that they must NOT be
   added to sitemap.xml. A table plus one template cannot drift.

   ⚠️ 2026-08-26 — SIX PAGES ADDED after the client went through the full page list
   of the old site. The WordPress REST API turned up ten published pages that the
   sitemap does not list, and the client kept six of them; of the other four, two
   are redirected (Thomas Windisch, both variants) and two are deliberately left to
   404 (/testformular/, /homepage-2/). Their data was read off the live pages on
   2026-08-26, same rule as the first three.

   ⚠️ 2026-08-26 — AND THE FIRST THREE GAINED THEIR LEDE AND THEIR FOUR SERVICE
   LINKS. The note below claimed every visible string was reproduced verbatim, and
   for those three that was not fully true: every one of these nine live pages
   carries a one-line lede and a block of four service links, and the first port
   dropped them (Jäger Sicherheitsdienst lost both, Jäger Werkschutz kept one of
   the four links, Van Wey Werkschutz lost the links). Restored from the live pages,
   so all nine are now one decision instead of three that lost content and six that
   did not.

   WHERE THE CONTENT COMES FROM
   Every visible string was read off the live page at
   https://frankonia-sicherheit.de<path> on 2026-08-23 and is reproduced verbatim,
   including the phone numbers, the credential lines and Bryan Van Wey's tagline.
   Only the LINK TARGETS are rewritten, because the old service URLs carried a
   `frankonia-` prefix that the new site drops (/frankonia-werkschutz ->
   /werkschutz/ and so on). They are written out to the new URLs directly rather
   than left to the Block G redirects: an internal link should not spend a hop.

   ⚠️ noindex, follow ON ALL ELEVEN, and they are deliberately absent from
   sitemap.xml. They are thin and person-specific; indexed they would compete with
   the real service pages for the same terms. They stay reachable — that is the
   whole point of a QR code.

   ⚠️ THE FOUR SERVICE LINKS ARE REWRITTEN TO THE NEW URLs, and one of them was
   broken on the old site: every one of these nine pages links to
   /frankonia-baustellenbewachung, which answers 404 live (verified 2026-08-26 —
   its seven siblings answer 301). Pointing at /baustellenbewachung/ fixes a dead
   link rather than porting it.

   ⚠️ NO MOTION JAVASCRIPT on these pages: no GSAP, no ScrollTrigger, no Lenis, no
   hero-reveal. Every other page loads that stack, and here it would be ~50KB of
   vendor JS in front of a phone number for someone standing in a car park with a
   printed card. The chrome's own js/main.js still loads via head-common, which is
   all the header and footer need.
   ========================================================================== */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
/* ⚠️ DIE „-2" IN ZWEI SLUGS IST AM 27.08.2026 ENTFALLEN (Kundenwunsch: „überall wo
   bei der url -2 bei den personen dahinter ist, die -2 in der url wegmachen und die
   alten 2er urls auf die neuen ohne zwei umleiten"). Sie kam aus WordPress, das an
   einen belegten Slug eine Zahl hängt — auf der Website war sie ohne Bedeutung.
   Aus /christoph-bauer-sicherheitsdienst-2/ wurde /christoph-bauer-sicherheitsdienst/
   und aus /morelo-werkschutz-team-2/ wurde /morelo-werkschutz-team/; die alten
   Adressen leiten dauerhaft (301) auf die neuen, weil sie auf gedruckten Karten und
   QR-Codes stehen. Die vCard-Dateinamen sind mitgewandert, damit Dateiname und Slug
   weiter übereinstimmen. */
const OUT = path.join(ROOT, "pages");
const ORIGIN = "https://frankonia-sicherheit.de";

/* -------------------------------------------------------------------------
   Shared fragments
   ------------------------------------------------------------------------- */

const ICON_PHONE =
  '<svg class="icon person__icon--filled" aria-hidden="true"><use href="#icon-phone"></use></svg>';
const ICON_MAIL =
  '<svg class="icon person__icon--stroked" aria-hidden="true"><use href="#icon-mail"></use></svg>';
const ICON_ARROW =
  '<svg class="icon" aria-hidden="true"><use href="#icon-arrow-diagonal"></use></svg>';

function telHref(display) {
  return "tel:" + display.replace(/[^\d+]/g, "");
}

function head({ slug, title, description, extraClass }) {
  const url = `${ORIGIN}/${slug}/`;
  return `<!DOCTYPE html>
<html lang="de">
<!-- /${slug}/ — GENERATED by docs/design-sources/person-pages.js (Block E,
     2026-08-23). Content taken verbatim from the live WordPress page of the same
     URL; only link targets were rewritten to the new service URLs.

     ⚠️ noindex, follow — and NOT in sitemap.xml. This page is thin and
     person-specific: indexed, it would compete with the real service pages. It
     stays reachable because it is printed on business cards and QR codes, which
     is the entire reason it is rebuilt at the same URL instead of redirected.

     ⚠️ No motion JavaScript here on purpose — see the header of
     css/page-person.css. -->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="de" href="${url}">
  <link rel="alternate" hreflang="x-default" href="${url}">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${url}">
  <meta property="og:locale" content="de_DE">
  <meta property="og:site_name" content="FRANKONIA Sicherheitsdienst">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">

  <meta name="robots" content="noindex,follow">

  <!-- include: head-common -->
  <link rel="stylesheet" href="/css/page-person.css">
</head>
<body>
  <!-- include: gtm-noscript -->
  <!-- include: icon-sprite -->
  <!-- include: header-de -->

  <main id="main">
`;
}

function crumbs(current) {
  return `    <nav class="breadcrumbs container" aria-label="Breadcrumb">
      <ol class="breadcrumbs__list">
        <li><a class="breadcrumbs__link" href="/">Startseite</a></li>
        <li class="breadcrumbs__sep" aria-hidden="true">
          <svg class="breadcrumbs__sep-icon" aria-hidden="true"><use href="#icon-chevron"></use></svg>
        </li>
        <li><span class="breadcrumbs__current" aria-current="page">${current}</span></li>
      </ol>
    </nav>
`;
}

const FOOT = `
  </main>

  <!-- include: footer-de -->
  <!-- include: whatsapp-button -->
</body>
</html>
`;

/* -------------------------------------------------------------------------
   The nine person cards
   -------------------------------------------------------------------------
   Two ledes and two link sets, because every one of these pages is either the
   Sicherheitsdienst side of the business or the Werkschutz side, and the live
   pages use exactly one pair of each. Written once so a tenth card cannot
   introduce a third almost-identical wording.

   ⚠️ The Revier-/Schließdienst label keeps the live card's slash spelling
   ("Revier-/Schließdienst"), which is not the nav's ("Revier- und
   Schließdienst"). Same destination; the label is the printed card's own wording.
   ------------------------------------------------------------------------- */

const LEDE_SD =
  "Wenn Sie sich, Ihr Unternehmen, Ihr Event oder Ihr Objekt vor Diebstahl und Beschädigung effektiv schützen möchten!";
const LEDE_WS =
  "Wenn Sie sich, Ihr Kapital, Know-How und Ihre Mitarbeitenden wirklich professionell schützen möchten!";

const LINKS_SD = [
  ["Objektschutz", "/objektschutz/"],
  ["Veranstaltungsschutz", "/veranstaltungsschutz/"],
  ["Baustellenbewachung", "/baustellenbewachung/"],
  ["Kaufhausdetektei", "/kaufhausdetektei/"],
];
const LINKS_WS = [
  ["Werkschutz", "/werkschutz/"],
  ["Empfangsdienst", "/empfangsdienst/"],
  ["Revier-/Schließdienst", "/revier-schliessdienst/"],
  ["Sicherheitstechnik", "/sicherheitstechnik/"],
];

const PEOPLE = [
  {
    slug: "alexander-jaeger-sicherheitsdienst",
    title: "Alexander Jäger Sicherheitsdienst | FRANKONIA Sicherheit",
    description:
      "Alexander Jäger, Vertriebsleiter bei FRANKONIA Sicherheitsdienst in Bamberg — Kontaktdaten direkt speichern.",
    name: "Alexander Jäger",
    role: "Vertriebsleiter",
    portrait: "person-alexander-jaeger",
    tel: "+49 951 964352-70",
    mobile: "+49 176 17975703",
    mail: "a.jaeger@frankonia-sicherheit.de",
    vcard: "alexander-jaeger-sicherheitsdienst.vcf",
    lede: LEDE_SD,
    links: LINKS_SD,
    more: true,
  },
  {
    slug: "alexander-jaeger-werkschutz",
    title: "Alexander Jäger Werkschutz | FRANKONIA Sicherheit",
    description:
      "Alexander Jäger, Vertriebsleiter bei FRANKONIA Werkschutz in Bamberg — Kontaktdaten direkt speichern.",
    name: "Alexander Jäger",
    role: "Vertriebsleiter",
    portrait: "person-alexander-jaeger",
    tel: "+49 951 964352-70",
    mobile: "+49 176 17975703",
    mail: "a.jaeger@frankonia-werkschutz.de",
    vcard: "alexander-jaeger-werkschutz.vcf",
    lede: LEDE_WS,
    links: LINKS_WS,
    more: true,
  },
  {
    slug: "bryan-van-wey-werkschutz",
    title: "Bryan Van Wey Werkschutz | FRANKONIA Sicherheit",
    description:
      "Bryan Van Wey, Einsatzleiter bei FRANKONIA Werkschutz in Bamberg — Kontaktdaten direkt speichern.",
    name: "Bryan Van Wey",
    role: "Einsatzleiter",
    portrait: "person-bryan-van-wey",
    tel: "+49 951 964352-60",
    mobile: "+49 151 20704942",
    mail: "b.vanwey@frankonia-werkschutz.de",
    vcard: "bryan-van-wey-werkschutz.vcf",
    lede: LEDE_WS,
    links: LINKS_WS,
    more: true,
  },

  /* ---- 2026-08-26: die sechs vom Kunden bestätigten Seiten ---- */

  {
    slug: "steffen-walde-sicherheitsdienst",
    title: "Steffen Walde Sicherheitsdienst | FRANKONIA Sicherheit",
    description:
      "Steffen Walde, Geschäftsführender Gesellschafter bei FRANKONIA Sicherheitsdienst in Bamberg — Kontaktdaten direkt speichern.",
    name: "Steffen Walde",
    role: "Geschäftsführender Gesellschafter",
    cred: "Betriebswirt (B.Sc.)",
    portrait: "person-steffen-walde",
    tel: "+49 951 964352-10",
    mobile: "+49 172 7866338",
    mail: "s.walde@frankonia-sicherheit.de",
    vcard: "steffen-walde-sicherheitsdienst.vcf",
    lede: LEDE_SD,
    links: LINKS_SD,
    more: true,
  },
  {
    slug: "steffen-walde-werkschutz",
    title: "Steffen Walde Werkschutz | FRANKONIA Sicherheit",
    description:
      "Steffen Walde, Geschäftsführender Gesellschafter bei FRANKONIA Werkschutz in Bamberg — Kontaktdaten direkt speichern.",
    name: "Steffen Walde",
    role: "Geschäftsführender Gesellschafter",
    cred: "Betriebswirt (B.Sc.)",
    portrait: "person-steffen-walde",
    tel: "+49 951 964352-10",
    mobile: "+49 172 7866338",
    mail: "s.walde@frankonia-werkschutz.de",
    vcard: "steffen-walde-werkschutz.vcf",
    lede: LEDE_WS,
    links: LINKS_WS,
    more: true,
  },
  {
    slug: "christoph-bauer-sicherheitsdienst",
    title: "Christoph Bauer Sicherheitsdienst | FRANKONIA Sicherheit",
    description:
      "Christoph Bauer, Marketing- und Projektmanager bei FRANKONIA Sicherheitsdienst in Bamberg — Kontaktdaten direkt speichern.",
    name: "Christoph Bauer",
    role: "Marketing- und Projektmanager",
    cred: "Wirtschaftsinformatiker (B.Sc.)",
    portrait: "person-christoph-bauer",
    tel: "+49 951 964352-30",
    mobile: "+49 151 70131270",
    mail: "c.bauer@frankonia-sicherheit.de",
    vcard: "christoph-bauer-sicherheitsdienst.vcf",
    lede: LEDE_SD,
    links: LINKS_SD,
    more: true,
  },
  {
    slug: "daniel-wettengel-sicherheitsdienst",
    title: "Daniel Wettengel Sicherheitsdienst | FRANKONIA Sicherheit",
    description:
      "Daniel Wettengel, Einsatzleiter bei FRANKONIA Sicherheitsdienst in Bamberg — Kontaktdaten direkt speichern.",
    name: "Daniel Wettengel",
    role: "Einsatzleiter",
    portrait: "person-daniel-wettengel",
    tel: "+49 951 964352-50",
    mobile: "+49 151 17888175",
    mail: "d.wettengel@frankonia-sicherheit.de",
    vcard: "daniel-wettengel-sicherheitsdienst.vcf",
    lede: LEDE_SD,
    links: LINKS_SD,
    more: true,
  },
  /* ⚠️⚠️ HIER STAND EINE ZWEITE VAN-WEY-KARTE, /bryan-van-wey-security/, und sie
     ist am 27.08.2026 auf Kundenwunsch ENTFALLEN: "van wey security als seite
     löschen bzw auf werkschutz umleiten". Die alte Adresse leitet dauerhaft auf
     /bryan-van-wey-werkschutz/ (vercel.json), damit gedruckte QR-Codes weiter
     ankommen.

     ⚠️ SIE WAR NICHT NUR EINE KOPIE DER WERKSCHUTZ-KARTE, und das ist der Teil,
     den man wissen muss: ihre Mailadresse lag auf frankonia-security.de, einer
     DRITTEN Marke neben -sicherheit.de und -werkschutz.de, und ihre vCard nannte
     als Firma "FRANKONIA Security GmbH & Co. KG" — die einzige Stelle im ganzen
     Projekt mit dieser Firmierung, im Impressum kommt sie nicht vor. Mit der
     Seite sind also diese Adresse und diese Firmierung von der Website
     verschwunden; wer den alten QR-Code scannt, bekommt jetzt
     b.vanwey@frankonia-werkschutz.de. Das ist die Folge der Entscheidung, nicht
     ein Versehen — die Datei assets/documents/bryan-van-wey-security.vcf ist
     ebenfalls gelöscht, sonst wäre sie weiter öffentlich abrufbar.

     Der vollständige Eintrag steht im Git-Verlauf, falls die Karte zurückkommt. */
  {
    /* ⚠️ KEINE PERSON, SONDERN EIN POSTEN: die Pforte, die FRANKONIA beim Kunden
       MORELO besetzt. Daher drei Abweichungen von den acht anderen Karten, und
       alle drei stehen so auf der Livekarte:
       · KEIN PORTRÄT — die Livekarte hat keines. Ihr einziges Bild ist ein
         Firmenbild in der JSON-LD, also kein sichtbares Foto. Das Template lässt
         das Bild dann weg; .person__inner ist eine Flex-Spalte, der Name
         rutscht nach oben und es bleibt keine Lücke.
       · KEINE FESTNETZNUMMER — nur die Mobilnummer der Pforte.
       · KEIN ZUSATZ zur Berufsbezeichnung. */
    slug: "morelo-werkschutz-team",
    title: "Morelo Werkschutz Team | FRANKONIA Sicherheit",
    description:
      "Morelo Werkschutz Team, Pforte bei FRANKONIA Werkschutz in Bamberg — Kontaktdaten direkt speichern.",
    name: "Morelo Werkschutz Team",
    role: "Pforte",
    mobile: "+49 1517 5010444",
    mail: "werkschutz.frankonia@morelo.eu",
    vcard: "morelo-werkschutz-team.vcf",
    lede: LEDE_WS,
    links: LINKS_WS,
    more: true,
  },
];

function personPage(p) {
  // Festnetz ist optional: die MORELO-Pforte hat nur eine Mobilnummer.
  const rows = [
    p.tel
      ? `          <li><a href="${telHref(p.tel)}">${ICON_PHONE}<span>${p.tel}</span></a></li>`
      : null,
    `          <li><a href="${telHref(p.mobile)}">${ICON_PHONE}<span>${p.mobile}</span></a></li>`,
    `          <li><a class="person__mail" href="mailto:${p.mail}">${ICON_MAIL}<span>${p.mail}</span></a></li>`,
  ].filter(Boolean).join("\n");

  const links = p.links
    ? `
        <ul class="person__links">
${p.links
  .map(
    ([label, href]) =>
      `          <li><a href="${href}"><span>${label}</span>${ICON_ARROW}</a></li>`
  )
  .join("\n")}
        </ul>
`
    : "";

  const more = p.more
    ? `          <a class="btn btn--secondary" href="/referenzen/">Mehr erfahren</a>\n`
    : "";

  return (
    head({ slug: p.slug, title: p.title, description: p.description }) +
    crumbs(p.name) +
    `
    <section class="section person">
      <div class="container person__inner">
${
  // Porträt ist optional — siehe die Notiz an der MORELO-Karte.
  p.portrait
    ? `
        <picture class="person__portrait">
          <source type="image/webp" srcset="/assets/images/${p.portrait}-350.webp">
          <img src="/assets/images/${p.portrait}-350.png" width="350" height="350" alt="Porträt von ${p.name}" loading="eager" fetchpriority="high" decoding="async">
        </picture>
`
    : ""
}
        <h1 class="person__name">${p.name}</h1>
        <p class="person__role">${p.role}</p>
${p.cred ? `        <p class="person__cred">${p.cred}</p>\n` : ""}${
      p.lede ? `        <p class="person__lede">${p.lede}</p>\n` : ""
    }
        <ul class="person__contact">
${rows}
        </ul>

        <div class="person__actions">
          <a class="btn btn--primary" href="/assets/documents/${p.vcard}">Kontakt speichern</a>
${more}        </div>
${links}
      </div>
    </section>


    <!-- include: person-trust -->` +
    FOOT
  );
}

/* -------------------------------------------------------------------------
   /sicherheitscheck-walde/ — a booking page, not a person card
   ------------------------------------------------------------------------- */

const CHECK_OPTIONS = [
  [
    "Termin im FRANKONIA Büro",
    "Wir sehen uns bei uns in der Neuerbstraße 19 in Bamberg.",
    "https://meetings-eu1.hubspot.com/steffen-walde-frankonia/sicherheitscheck-buero",
  ],
  [
    "Termin Online",
    "Per Videokonferenz, ohne Anfahrt für Sie.",
    "https://meetings-eu1.hubspot.com/steffen-walde-frankonia/sicherheitscheck-frankonia",
  ],
  [
    "Termin bei Ihnen vor Ort",
    "Wir kommen zu Ihnen und sehen uns das Objekt direkt an.",
    "https://meetings-eu1.hubspot.com/steffen-walde-frankonia/sicherheitscheck-kunde",
  ],
];

function checkPage() {
  return (
    head({
      slug: "sicherheitscheck-walde",
      title: "Sicherheitscheck Walde | FRANKONIA Sicherheit",
      description:
        "Werkschutzcheck mit Steffen Walde: Termin im FRANKONIA Büro, online oder bei Ihnen vor Ort buchen.",
    }) +
    crumbs("Sicherheitscheck") +
    `
    <!-- ⚠️ The three targets are HubSpot scheduling pages. They are LINKS, never an
         embed: vercel.json ships \`default-src 'self'\`, so an embedded HubSpot
         widget would be blocked and this page would look empty. The one-line
         descriptions under each heading are written for this build — the live page
         repeats the same sentence three times, which says nothing about which
         option is which. -->
    <section class="section person person--wide">
      <div class="container person__inner">

        <h1 class="person__name">Jetzt auswählen, wo Ihr Werkschutzcheck stattfinden soll</h1>

        <ul class="check-options">
${CHECK_OPTIONS.map(
  ([h, p, href]) => `          <li class="check-option">
            <h2>${h}</h2>
            <p>${p}</p>
            <a class="btn btn--primary" href="${href}" target="_blank" rel="noopener">Jetzt Termin buchen<span class="visually-hidden"> (öffnet in einem neuen Tab)</span></a>
          </li>`
).join("\n")}
        </ul>

        <p class="person__note">Lieber telefonisch? <a href="tel:+499519643520">+49 951 964352-0</a></p>

      </div>
    </section>
` +
    FOOT
  );
}

/* -------------------------------------------------------------------------
   /linktree/ — a plain list of destinations
   ------------------------------------------------------------------------- */

const LINKTREE = [
  ["Leistungen", [
    ["Alle Leistungen im Überblick", "/leistungen/"],
    ["Werkschutz", "/werkschutz/"],
    ["Objektschutz", "/objektschutz/"],
    ["Baustellenbewachung", "/baustellenbewachung/"],
    ["Veranstaltungsschutz", "/veranstaltungsschutz/"],
    ["Kaufhausdetektei", "/kaufhausdetektei/"],
    ["Revier- und Schließdienst", "/revier-schliessdienst/"],
    ["Empfangsdienst", "/empfangsdienst/"],
    ["Sicherheitstechnik", "/sicherheitstechnik/"],
  ]],
  ["Unternehmen", [
    ["Referenzen", "/referenzen/"],
    ["Über uns", "/ueber-uns/"],
    ["Jobs", "/jobs/"],
    ["Kontakt", "/kontakt/"],
  ]],
];

function linktreePage() {
  return (
    head({
      slug: "linktree",
      title: "linktree | FRANKONIA Sicherheit",
      description:
        "Alle wichtigen Seiten von FRANKONIA Sicherheit auf einen Blick: Leistungen, Referenzen, Jobs und Kontakt.",
    }) +
    crumbs("Linktree") +
    `
    <!-- ⚠️ TWO LINKS FROM THE LIVE PAGE ARE DELIBERATELY NOT HERE:
         · the Büromanagement job posting on jobs.frankonia-sicherheit.de — the
           client confirmed on 2026-08-22 that this vacancy is out of date, and
           /jobs/ below covers careers;
         · the "Dienstleistungen" anchor (/#dienstleistungen), which pointed at a
           section id that does not exist on the new homepage. "Alle Leistungen im
           Überblick" is the same destination in a form that resolves.
         The social profiles and the legal pages are not repeated either: the site
         footer on this very page already carries both. -->
    <section class="section person">
      <div class="container person__inner">

        <h1 class="person__name">FRANKONIA Sicherheit</h1>
        <p class="person__role">Alle wichtigen Seiten auf einen Blick</p>

${LINKTREE.map(
  ([label, items]) => `        <p class="linktree__label">${label}</p>
        <ul class="linktree">
${items
  .map(([t, href]) => `          <li><a href="${href}">${t}</a></li>`)
  .join("\n")}
        </ul>`
).join("\n\n")}

        <div class="person__actions">
          <a class="btn btn--primary" href="/angebot/">Unverbindliches Angebot einholen</a>
          <a class="btn btn--secondary" href="tel:+499519643520">+49 951 964352-0</a>
        </div>

      </div>
    </section>
` +
    FOOT
  );
}

/* -------------------------------------------------------------------------
   Write
   ------------------------------------------------------------------------- */

const files = [];
for (const p of PEOPLE) files.push([p.slug, personPage(p)]);
files.push(["sicherheitscheck-walde", checkPage()]);
files.push(["linktree", linktreePage()]);

for (const [slug, html] of files) {
  const target = path.join(OUT, slug + ".html");
  fs.writeFileSync(target, html, "utf8");
  const vcardMatch = html.match(/documents\/([\w.-]+\.vcf)/);
  console.log(
    slug.padEnd(36) +
      (html.includes('content="noindex,follow"') ? "noindex ✓" : "noindex ✗") +
      "  " +
      (vcardMatch ? vcardMatch[1] : "—")
  );
}
console.log("\n" + files.length + " Seiten geschrieben nach pages/");
