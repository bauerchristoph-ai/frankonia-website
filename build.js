#!/usr/bin/env node
/*
  Zero-dependency static build.

  1. Compiles pages/**\/*.html against partials/*.html (simple
     <!-- include: name --> markers) into dist/, mapping e.g.
     pages/werkschutz.html      -> dist/werkschutz/index.html
     pages/ratgeber/kosten.html -> dist/ratgeber/kosten/index.html
     pages/index.html           -> dist/index.html
  2. Copies css/, js/, assets/, robots.txt, and sitemap.xml into dist/
     unchanged.

  dist/ is the only thing Vercel serves (see outputDirectory in
  vercel.json) and is gitignored — it is regenerated on every build, both
  locally and by Vercel. Everything else (this script, pages/, partials/,
  docs/, CLAUDE.md, package.json) is source only and is never deployed.

  This is the one deliberate exception to "no build step": it only ever
  concatenates trusted local HTML strings and copies files as-is. It adds
  no client-side JS to the shipped pages — every file in dist/ is complete,
  final, crawlable static HTML before it ever reaches a browser.

  Usage: node build.js   (or: npm run build)
*/

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PAGES_DIR = path.join(ROOT, "pages");
const PARTIALS_DIR = path.join(ROOT, "partials");
const DIST_DIR = path.join(ROOT, "dist");

// Copied into dist/ verbatim, no processing. (css/ is handled by buildCss()
// below — minified + bundled — so it's not a plain passthrough.)
const PASSTHROUGH = [
  { from: "js", to: "js" },
  { from: "assets", to: "assets" },
  { from: "robots.txt", to: "robots.txt" },
  { from: "sitemap.xml", to: "sitemap.xml" },
];

// The 7 site-wide stylesheets (head-common.html cascade order) are concatenated
// into a single /css/app.css bundle to cut render-blocking requests. Keep this
// list + order in sync with partials/head-common.html.
const SHARED_CSS_ORDER = [
  "tokens", "reset", "base", "layout", "components", "site-chrome", "motion",
];

// An include marker, with optional parameters:
//     <!-- include: header -->
//     <!-- include: lead-form prefix="wk" heading="Ihre Anfrage" -->
// The parameterless form is byte-for-byte the old behaviour, so every existing
// page is unaffected.
const INCLUDE_RE = /<!--\s*include:\s*([\w-]+)((?:\s+[\w.-]+="[^"]*")*)\s*-->/g;
const PARAM_RE = /([\w.-]+)="([^"]*)"/g;

// {{ key }} / {{ key.sub }} — filled from an include's own parameters first,
// then from content/values.json.
const VAR_RE = /\{\{\s*([\w.]+)\s*\}\}/g;

// A coverage-list marker:
//     <!-- coverage: chips row="1" -->
//     <!-- coverage: mentions -->
//     <!-- coverage: footer row="2" -->
// Renders the entries of content/coverage.json as real <li> markup at BUILD
// time — see COVERAGE_FILE below for why this exists and why it is not a
// templating language.
const COVERAGE_RE = /<!--\s*coverage:\s*([\w-]+)((?:\s+[\w.-]+="[^"]*")*)\s*-->/g;

// ---------------------------------------------------------------------------
// Shared values (content/values.json)
// ---------------------------------------------------------------------------
// One place for the facts that repeat across the site — price, phone, address,
// rating. Before this existed the phone number was written 21 times across 8
// files and the address 11 times, and a price change meant 54 hand edits (27
// pages x visible + JSON-LD). Those are exactly the edits that go wrong
// silently: miss one JSON-LD copy and Google is served a different price than
// the visitor sees.
//
// This is deliberately NOT a templating language. It substitutes values into
// otherwise-static HTML and nothing else — no logic, no loops, no conditionals.
// Adding it was discussed and approved (client 2026-08-06) as the alternative
// to copy-pasting sections across 44 remaining pages; see CLAUDE.md's
// "Non-negotiable tech constraints", which requires exactly that discussion
// before build.js grows.
const VALUES_FILE = path.join(ROOT, "content", "values.json");

function loadValues() {
  if (!fs.existsSync(VALUES_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(VALUES_FILE, "utf8"));
  } catch (err) {
    throw new Error(`content/values.json is not valid JSON — ${err.message}`);
  }
}

// ---------------------------------------------------------------------------
// Public environment values (2026-08-26)
// ---------------------------------------------------------------------------
// THREE values, and only three: they are PUBLIC by design — they end up in the
// delivered HTML of every page and are meant to. They are variables anyway so a
// test environment can substitute its own (Cloudflare's always-pass test key,
// a separate Cookiebot domain group) without editing markup.
//
// ⚠️ NOTHING SECRET MAY EVER BE ADDED HERE. Everything this build writes lands
// in dist/ and is served to anyone. The API token, the Brevo key and the
// Turnstile SECRET are read by api/forms/submit.js at request time, on the
// server, and are never seen by this file. "env.example" states which category
// each variable belongs to; that split is the whole safety mechanism, so a new
// entry here needs the same test: would I paste this value into a public
// pastebin? If not, it does not belong here.
//
// A missing variable falls back to the documented production value and says so
// in the build log. Deliberately not an error: the values are public and the
// fallback is correct for production, so a build without an .env file must still
// produce a working site — otherwise every checkout would need secrets it does
// not need.
const PUBLIC_ENV = [
  [
    "turnstileSiteKey",
    "TURNSTILE_SITE_KEY",
    "0x4AAAAAAEbw3lHJ1rhwrG7i",
    "Cloudflare Turnstile Site Key",
  ],
  [
    "cookiebotCbid",
    "COOKIEBOT_CBID",
    "2335e423-3956-4d6d-823a-9d471a462ca7",
    "Cookiebot Domain-Gruppen-ID",
  ],
  [
    // The endpoint the shared form posts to. Not from the environment — it is a
    // property of this repository, not of the deployment — but it belongs in the
    // same namespace because the form template reads it the same way.
    // ⚠️ WITH the trailing slash, on purpose: vercel.json sets
    // trailingSlash: true, so posting to the slashless path would take a 308
    // hop first. See the rewrite rule in vercel.json.
    "formEndpoint",
    null,
    "/api/forms/submit/",
    "Formular-Endpoint",
  ],
];

function loadPublicEnv() {
  const out = {};
  for (const [key, envName, fallback, label] of PUBLIC_ENV) {
    const raw = envName ? process.env[envName] : undefined;
    const value = raw && raw.trim() ? raw.trim() : fallback;
    if (envName && !(raw && raw.trim())) {
      console.log(
        `build: ${envName} nicht gesetzt — ${label} nutzt den dokumentierten Produktionswert`
      );
    }
    out[key] = value;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Coverage locations (content/coverage.json)
// ---------------------------------------------------------------------------
// ONE list of Einsatzgebiete, rendered into every surface that shows them
// (client 2026-08-14, Einsatzgebiete 1: "single data source"). Before this the
// same cities were typed out in five places and had already drifted — Hof was a
// linked 404 in the footer for weeks while the homepage had already demoted it.
//
// Like the values mechanism above, this is NOT a template language: it is one
// data file with a fixed set of renderers, each emitting the exact markup that
// used to be hand-written. No expressions, no conditionals in markup, no loops
// a page can author. The output is still complete static HTML — which is the
// whole reason this happens at build time and not in the browser: these pills
// are crawlable internal links and must not depend on JavaScript.
const COVERAGE_FILE = path.join(ROOT, "content", "coverage.json");
// Where the same list is published for the runtime Leaflet map to fetch.
// Generated, never hand-edited — js/coverage-map.js reads THIS, so the map and
// the pills can never disagree.
const COVERAGE_RUNTIME_OUT = path.join(DIST_DIR, "assets", "data", "coverage-locations.json");

function loadCoverage() {
  if (!fs.existsSync(COVERAGE_FILE)) return [];
  let data;
  try {
    data = JSON.parse(fs.readFileSync(COVERAGE_FILE, "utf8"));
  } catch (err) {
    throw new Error(`content/coverage.json is not valid JSON — ${err.message}`);
  }
  const list = Array.isArray(data.locations) ? data.locations : [];
  for (const loc of list) {
    if (!loc.id || !loc.name || !Array.isArray(loc.center)) {
      throw new Error(
        `content/coverage.json: every location needs id, name and center — got ${JSON.stringify(loc)}`
      );
    }
  }
  return list;
}

const PIN_ICON =
  '<img class="%CLS%-icon" src="/assets/icons/icon-location.svg" alt="" ' +
  'width="16" height="16" loading="lazy">';

// Each renderer returns the <li> markup for one location, so a page's own list
// element, classes and wrapper stay in the page where they can be read.
const COVERAGE_RENDERERS = {
  // Homepage map chips: a real link per city page…
  chips(loc) {
    const icon = PIN_ICON.replace("%CLS%", "coverage__pill");
    return (
      `<li><a class="coverage__pill" data-coverage-city="${loc.id}" ` +
      `href="${loc.href}">${icon}${loc.name}</a></li>`
    );
  },
  // …and a real BUTTON for a location with no page of its own. Never an <a>:
  // "render without links" (client) plus "do not ship a linked 404" (2.2). It
  // still drives the map, exactly like the "Alle" toggle.
  mentions(loc) {
    const icon = PIN_ICON.replace("%CLS%", "coverage__pill");
    return (
      `<li><button type="button" class="coverage__pill" data-coverage-city="${loc.id}" ` +
      `aria-pressed="false">${icon}${loc.name}</button></li>`
    );
  },
  // The footer's own city list: no map hooks (the footer is on every page, most
  // of which have no map). Unlike the other two lists this one shows EVERY
  // location, with or without a page of its own (client 2026-08-21).
  //
  // ⚠️ A location without a page renders as a <span>, never an <a>, and that is
  // the whole point of this renderer: it has to LOOK exactly like its neighbours —
  // same classes, same icon, same type, same spacing, no dimmed colour and no
  // separate heading, so the five do not read as second class — while not
  // BEHAVING like a link. A <span> gets no pointer cursor and no tab stop for
  // free; the hover/focus rules are scoped to a.footer-pill in site-chrome.css so
  // they cannot follow either. An element that looks and feels like a link and
  // does nothing is the one failure to avoid here.
  //
  // The day one of them gets a city page, giving it an href in coverage.json is
  // the entire change: it becomes an <a> and nothing else moves.
  footer(loc) {
    const icon = PIN_ICON.replace("%CLS%", "footer-pill");
    const inner = `${icon}${loc.name}`;
    return loc.href
      ? `<li><a class="footer-pill" href="${loc.href}">${inner}</a></li>`
      : `<li><span class="footer-pill">${inner}</span></li>`;
  },
};

function resolveCoverage(content, sourceLabel, locations) {
  return content.replace(COVERAGE_RE, (_match, name, rawParams) => {
    const render = COVERAGE_RENDERERS[name];
    if (!render) {
      throw new Error(
        `${sourceLabel}: unknown coverage list "${name}" — expected one of ` +
          Object.keys(COVERAGE_RENDERERS).join(", ")
      );
    }
    const params = {};
    let m;
    while ((m = PARAM_RE.exec(rawParams)) !== null) params[m[1]] = m[2];

    // "mentions" is by definition the ones without a page. "chips" are real
    // links, so only entries that have one. "footer" shows everything and marks
    // the difference in the markup instead (see its renderer above).
    let list = locations.filter((loc) =>
      name === "mentions" ? !loc.href : name === "footer" ? true : Boolean(loc.href)
    );
    if (params.row) list = list.filter((loc) => String(loc.row) === params.row);
    if (!list.length) {
      throw new Error(
        `${sourceLabel}: coverage list "${name}"${params.row ? ` row ${params.row}` : ""} matched no locations`
      );
    }
    // One item per line, indented to sit inside the <ul> it was written in.
    return list.map((loc) => render(loc)).join("\n            ");
  });
}

// ---------------------------------------------------------------------------
// Vacancies (content/vacancies.json)
// ---------------------------------------------------------------------------
// A vacancy marker:
//     <!-- vacancies: list -->
//     <!-- vacancies: schema -->
//
// ⚠️ THE POINT OF THIS RENDERER IS THAT IT USUALLY PRINTS NOTHING. There is no
// real opening right now, and JobPosting data without a real vacancy breaks
// Google's rich-results rules: stale or invented postings are not merely
// ignored, they cost the domain its standing for every future posting. So an
// empty array renders NOTHING — no section, no heading, no schema — and /jobs/
// looks exactly as it did before this existed. The first real opening is one
// entry in content/vacancies.json and nothing else.
//
// ⚠️ THAT IS ALSO WHY `list` SITS INSIDE AN EXISTING SECTION rather than being
// its own. Every colour change on this site pays for a pixel-seam band, and the
// following section reserves that band's height with an adjacent-sibling rule.
// A renderer that emitted a whole new <section> would shift that alternation the
// day the first vacancy landed — a layout regression triggered by a data edit,
// with nobody looking. Inside a section, an empty array is a true no-op and a
// filled one adds a block.
const VACANCIES_FILE = path.join(ROOT, "content", "vacancies.json");
const VACANCY_RE = /<!--\s*vacancies:\s*([\w-]+)\s*-->/g;
const EMPLOYMENT_TYPES = [
  "FULL_TIME", "PART_TIME", "CONTRACTOR", "TEMPORARY",
  "INTERN", "VOLUNTEER", "PER_DIEM", "OTHER",
];

function loadVacancies() {
  if (!fs.existsSync(VACANCIES_FILE)) return [];
  let data;
  try {
    data = JSON.parse(fs.readFileSync(VACANCIES_FILE, "utf8"));
  } catch (err) {
    throw new Error(`content/vacancies.json is not valid JSON — ${err.message}`);
  }
  const list = Array.isArray(data) ? data : data.vacancies;
  if (!Array.isArray(list)) {
    throw new Error('content/vacancies.json: expected a "vacancies" array');
  }
  // Validated loudly, because the whole risk of this feature is a half-filled
  // posting reaching Google. A missing validThrough is allowed (it is optional
  // in the schema) but a missing date format is not.
  for (const v of list) {
    for (const key of ["id", "title", "location", "employmentType", "datePosted"]) {
      if (!v[key]) {
        throw new Error(
          `content/vacancies.json: every vacancy needs ${key} — got ${JSON.stringify(v)}`
        );
      }
    }
    if (!EMPLOYMENT_TYPES.includes(v.employmentType)) {
      throw new Error(
        `content/vacancies.json: employmentType "${v.employmentType}" is not one of ` +
          EMPLOYMENT_TYPES.join(", ")
      );
    }
    for (const key of ["datePosted", "validThrough"]) {
      if (v[key] && !/^\d{4}-\d{2}-\d{2}$/.test(v[key])) {
        throw new Error(
          `content/vacancies.json: ${key} must be YYYY-MM-DD — got "${v[key]}"`
        );
      }
    }
  }
  return list;
}

const EMPLOYMENT_LABELS = {
  FULL_TIME: "Vollzeit",
  PART_TIME: "Teilzeit",
  CONTRACTOR: "Freie Mitarbeit",
  TEMPORARY: "Befristet",
  INTERN: "Praktikum",
  VOLUNTEER: "Ehrenamt",
  PER_DIEM: "Auf Abruf",
  OTHER: "Sonstiges",
};

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const VACANCY_RENDERERS = {
  // The visible list. Classes are the page's own (css/page-jobs.css owns
  // .jobs-openings*), so the markup can be read where it is used.
  list(list) {
    const items = list
      .map((v) => {
        const meta = [escapeHtml(v.location), EMPLOYMENT_LABELS[v.employmentType]]
          .filter(Boolean)
          .join(" · ");
        const summary = v.summary
          ? `\n              <p class="jobs-openings__summary">${escapeHtml(v.summary)}</p>`
          : "";
        return (
          `            <li class="jobs-openings__item" id="stelle-${escapeHtml(v.id)}">\n` +
          // h4, nicht h3: die Liste hängt unter der h3 "Aktuell offene Stellen".
          // Auf gleicher Ebene wäre die Überschrift der Liste ein Geschwister
          // ihrer eigenen Einträge — für einen Screenreader wäre die Gruppierung
          // damit unsichtbar.
          `              <h4 class="jobs-openings__title">${escapeHtml(v.title)}</h4>\n` +
          `              <p class="jobs-openings__meta">${meta}</p>${summary}\n` +
          `              <a class="service-link" href="#bewerbung">Auf diese Stelle bewerben` +
          `<svg class="service-link__arrow icon" aria-hidden="true"><use href="#icon-arrow-diagonal"></use></svg></a>\n` +
          `            </li>`
        );
      })
      .join("\n");
    return (
      `        <div class="jobs-openings">\n` +
      `          <h3 class="jobs-openings__label">Aktuell offene Stellen</h3>\n` +
      `          <ul class="jobs-openings__list">\n${items}\n          </ul>\n` +
      `        </div>`
    );
  },
  // A separate JSON-LD block rather than an extra node inside the page's own
  // @graph: appending to that graph would mean parsing and re-serialising the
  // page's hand-written JSON on every build, and a second script tag is equally
  // valid to every consumer.
  schema(list) {
    const nodes = list.map((v) => ({
      "@type": "JobPosting",
      title: v.title,
      description: v.summary || v.title,
      datePosted: v.datePosted,
      ...(v.validThrough ? { validThrough: v.validThrough } : {}),
      employmentType: v.employmentType,
      hiringOrganization: { "@id": "https://frankonia-sicherheit.de/#organization" },
      jobLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: v.location,
          addressCountry: "DE",
        },
      },
      directApply: true,
      url: `https://frankonia-sicherheit.de/jobs/#stelle-${v.id}`,
    }));
    return (
      '  <script type="application/ld+json">\n' +
      JSON.stringify({ "@context": "https://schema.org", "@graph": nodes }, null, 2) +
      "\n  </script>"
    );
  },
};

function resolveVacancies(content, sourceLabel, list) {
  return content.replace(VACANCY_RE, (_match, name) => {
    const render = VACANCY_RENDERERS[name];
    if (!render) {
      throw new Error(
        `${sourceLabel}: unknown vacancy block "${name}" — expected one of ` +
          Object.keys(VACANCY_RENDERERS).join(", ")
      );
    }
    // The silent case, and the only one that happens today.
    if (!list.length) return "";
    return render(list);
  });
}

// "phone.display" -> values.phone.display
function lookup(scope, dottedKey) {
  return dottedKey.split(".").reduce(
    (acc, part) => (acc && typeof acc === "object" ? acc[part] : undefined),
    scope
  );
}

function resolveVars(content, scopes, sourceLabel) {
  return content.replace(VAR_RE, (match, key) => {
    for (const scope of scopes) {
      const value = lookup(scope, key);
      if (value !== undefined && value !== null && typeof value !== "object") {
        return String(value);
      }
    }
    // Loud on purpose. A placeholder that silently survives into the output
    // ships a literal "{{price.werkschutz}}" to a visitor, which is worse than
    // a failed build — and it is the one failure mode this whole mechanism
    // could plausibly introduce.
    throw new Error(
      `${sourceLabel}: unresolved placeholder ${match} — no such key in the ` +
        `include's parameters or in content/values.json`
    );
  });
}

// ---------------------------------------------------------------------------
// GTM-Ansatzpunkte an Kontaktlinks (2026-08-26)
// ---------------------------------------------------------------------------
// Setzt `data-cta` an jeden Telefon-, WhatsApp- und Mail-Link. Der Tag Manager
// braucht stabile Angriffspunkte für seine Klick-Trigger; ohne sie müsste jeder
// Trigger auf einen CSS-Selektor zeigen, und dann bricht das Tracking beim
// nächsten Umbenennen einer Klasse — still, weil ein Trigger, der nicht
// auslöst, keinen Fehler erzeugt.
//
// ⚠️ IM BUILD UND NICHT ZUR LAUFZEIT. Ein Attribut, das erst JavaScript
// anhängt, ist im ausgelieferten HTML nicht da: es fehlt für jeden Klick, der
// vor dem eigenen Skript passiert, und es ist beim Prüfen im Quelltext nicht
// sichtbar. Diese Attribute gehören in die Datei, die der Browser bekommt.
//
// ⚠️ ES SIND DREI KATEGORIEN UND KEIN FREIBRIEF. Die Ersetzung greift nur an
// <a>-Tags mit tel:, mailto: oder wa.me, und nur wenn dort noch kein
// `data-cta` steht — ein von Hand gesetzter Wert gewinnt immer. Alles andere
// bleibt unberührt: dieser Build formt kein Markup um, er ergänzt ein Attribut.
//
// ⚠️ DIE PRIMÄREN CTA-BUTTONS BEKOMMEN IHR `data-cta="primary"` NICHT HIER.
// "Primär" ist eine Aussage über die Rolle eines Knopfes auf seiner Seite, und
// die kann eine Textersetzung nicht treffen — .btn--primary steht auch am
// Formular-Absender (der `form-submit` heißt) und in Bausteinen, die keine
// Seiten-CTA sind. Wo es gebraucht wird, steht es im Markup.
const CTA_MUSTER = [
  [/(<a\b(?![^>]*\bdata-cta=)[^>]*\bhref="tel:)/g, "phone"],
  [/(<a\b(?![^>]*\bdata-cta=)[^>]*\bhref="mailto:)/g, "email"],
  [/(<a\b(?![^>]*\bdata-cta=)[^>]*\bhref="https:\/\/wa\.me\/)/g, "whatsapp"],
];

function markCtaLinks(html) {
  let out = html;
  let anzahl = 0;
  for (const [re, wert] of CTA_MUSTER) {
    out = out.replace(re, (treffer) => {
      anzahl++;
      // Das Attribut kommt direkt hinter das <a, vor alle bestehenden — so
      // bleibt der Rest des Tags unverändert und die Reihenfolge ist stabil.
      return treffer.replace(/^<a\b/, '<a data-cta="' + wert + '"');
    });
  }
  return { html: out, anzahl };
}

function walkHtml(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results = results.concat(walkHtml(full));
    else if (entry.isFile() && entry.name.endsWith(".html")) results.push(full);
  }
  return results;
}

function copyRecursive(src, dest) {
  // Skip dev-only notes (e.g. assets/fonts/README.md) and OS noise —
  // passthrough dirs ship to the public site as-is.
  if (src.endsWith(".md") || path.basename(src) === ".DS_Store") return;

  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function resolveIncludes(content, sourceLabel, values) {
  return content.replace(INCLUDE_RE, (_match, name, rawParams) => {
    const partialPath = path.join(PARTIALS_DIR, `${name}.html`);
    if (!fs.existsSync(partialPath)) {
      throw new Error(
        `${sourceLabel}: unknown include "${name}" — expected partials/${name}.html`
      );
    }
    const params = {};
    if (rawParams) {
      for (const m of rawParams.matchAll(PARAM_RE)) params[m[1]] = m[2];
    }
    const partial = fs.readFileSync(partialPath, "utf8").trim();
    // The partial's own parameters win over the global values, so two pages can
    // include the same partial with different ids/headings. Still one level
    // deep: partials do not include partials (CLAUDE.md).
    return resolveVars(partial, [params, values], `partials/${name}.html (from ${sourceLabel})`);
  });
}

// pages/werkschutz.html -> dist/werkschutz/index.html
// pages/ratgeber/index.html -> dist/ratgeber/index.html (hub page)
// pages/index.html -> dist/index.html (homepage)
function outputPathFor(pageFile) {
  const relPath = path.relative(PAGES_DIR, pageFile);
  const parsed = path.parse(relPath);
  const isIndex = parsed.name === "index";
  const outDir = isIndex ? parsed.dir : path.join(parsed.dir, parsed.name);
  return path.join(DIST_DIR, outDir, "index.html");
}

function buildPages() {
  const pageFiles = walkHtml(PAGES_DIR);
  if (!pageFiles.length) {
    console.log("build: no files in pages/ yet — skipping HTML compilation.");
    return 0;
  }

  const values = loadValues();
  values.env = loadPublicEnv();
  let ctaGesamt = 0;
  const coverage = loadCoverage();
  const vacancies = loadVacancies();

  for (const pageFile of pageFiles) {
    const sourceLabel = path.relative(ROOT, pageFile);
    let content = fs.readFileSync(pageFile, "utf8");
    content = resolveIncludes(content, sourceLabel, values);
    // AFTER the includes, so a marker inside a partial (the footer's city list)
    // is rendered too — the partial arrives as ordinary content by this point.
    content = resolveCoverage(content, sourceLabel, coverage);
    // Same position and the same reason: after the includes, before the
    // placeholders, so a vacancy's own text could carry {{…}} if it ever needs to.
    content = resolveVacancies(content, sourceLabel, vacancies);
    // Then the page's own placeholders (the ones outside any include).
    content = resolveVars(content, [values], sourceLabel);

    // ⚠️ NACH dem Auflösen der Includes und VOR dem Entfernen der Kommentare.
    // Nach den Includes, weil die meisten Kontaktlinks aus dem Footer und dem
    // Header kommen — vorher stünde in der Seite nur der Marker. Vor dem
    // Kommentar-Entfernen, weil die Ersetzung ein <a> in einem Kommentar sonst
    // nicht mehr sehen kann; sie soll es auch nicht anfassen, aber ein Attribut
    // in einem Kommentar wäre nur unnötiges Rauschen.
    const cta = markCtaLinks(content);
    content = cta.html;
    ctaGesamt += cta.anzahl;

    content = stripHtmlComments(content);

    const notice =
      `<!-- GENERATED FILE — do not edit. Source: ${sourceLabel}. ` +
      `Edit that file (and/or partials/*.html), then run \`node build.js\`. -->\n`;
    content = /^<!DOCTYPE html>/i.test(content)
      ? content.replace(/^(<!DOCTYPE html>\s*\n)/i, `$1${notice}`)
      : notice + content;

    const outFile = outputPathFor(pageFile);
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, content, "utf8");
    console.log(`build: ${sourceLabel} -> ${path.relative(ROOT, outFile)}`);
  }

  console.log("build: " + ctaGesamt + " Kontaktlinks mit data-cta versehen (Telefon, Mail, WhatsApp)");
  return pageFiles.length;
}

// ---------------------------------------------------------------------------
// Comment stripping (HTML + JS)
// ---------------------------------------------------------------------------
// This codebase documents its decisions in comments, heavily and on purpose —
// and every one of those bytes was being SHIPPED. Measured on the built site
// before this existed: 39 % of all HTML was comments (56 % of the homepage's
// gzipped weight), and 62 % of our own JavaScript. Together, 438 KB of gzip
// across the site for text no browser reads.
//
// The comments stay in pages/, partials/ and js/. They just stop travelling.

// Strip <!-- … --> from HTML, but NEVER inside <script>/<style>/<pre>/<textarea>:
// inside those the sequence is ordinary content, and a blind regex would eat a
// document's worth of real markup the day a script contains one.
// Conditional comments (<!--[if …]>) are preserved — they are instructions to a
// browser, not documentation.
function stripHtmlComments(html) {
  const PROTECTED = /<(script|style|pre|textarea)\b[^>]*>[\s\S]*?<\/\1>/gi;
  const parts = [];
  let last = 0;
  let m;
  while ((m = PROTECTED.exec(html)) !== null) {
    parts.push({ text: html.slice(last, m.index), strip: true });
    parts.push({ text: m[0], strip: false });
    last = m.index + m[0].length;
  }
  parts.push({ text: html.slice(last), strip: true });

  return parts
    .map((p) => {
      if (!p.strip) return p.text;
      return (
        p.text
          .replace(/<!--(?!\[if)[\s\S]*?-->/g, "")
          // A comment usually occupied its own lines; collapse what it left
          // behind so the output does not become a field of blank lines.
          .replace(/\n[ \t]*\n+/g, "\n")
      );
    })
    .join("");
}

// LINE-ORIENTED on purpose, and that is the whole safety argument. A general JS
// comment stripper has to tokenise, because `//` appears inside every URL
// ("https://…") and `/*` can appear inside a string or a regex literal. This one
// only ever removes a line that is ENTIRELY a comment, so no line carrying code
// is touched at all.
// The one thing that could still break it is a multi-line template literal whose
// content happens to have a line starting with `//` or `/*`. Checked before this
// shipped: js/ has no multi-line template literals (the only unbalanced
// backticks are inside prose comments), and every file is re-parsed with
// `new Function` below, so a mistake fails the build instead of the page.
function minifyJs(src) {
  const out = [];
  let inBlock = false;
  for (const rawLine of src.split("\n")) {
    const line = rawLine.trim();
    if (inBlock) {
      if (line.includes("*/")) {
        inBlock = false;
        // Code after the closing */ on the same line is rare but legal — keep it.
        const tail = line.slice(line.indexOf("*/") + 2).trim();
        if (tail) out.push(tail);
      }
      continue;
    }
    if (line.startsWith("//")) continue;
    if (line.startsWith("/*")) {
      if (!line.includes("*/")) {
        inBlock = true;
        continue;
      }
      const tail = line.slice(line.indexOf("*/") + 2).trim();
      if (!tail) continue;
      out.push(tail);
      continue;
    }
    if (line.length) out.push(line);
  }
  return out.join("\n");
}

function buildPassthrough() {
  for (const { from, to } of PASSTHROUGH) {
    const src = path.join(ROOT, from);
    if (!fs.existsSync(src)) continue;
    copyRecursive(src, path.join(DIST_DIR, to));
  }
  buildJs();
}

// Minifies our own js/ in place in dist/. assets/js/vendor/ is deliberately NOT
// touched — those files are already minified and are not ours to rewrite.
function buildJs() {
  const dir = path.join(DIST_DIR, "js");
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    if (!entry.endsWith(".js")) continue;
    const file = path.join(dir, entry);
    const minified = minifyJs(fs.readFileSync(file, "utf8"));
    // Parse it before writing. `new Function` compiles without executing, so a
    // stripper mistake becomes a failed build rather than a broken page — the one
    // failure mode this whole optimisation could plausibly introduce.
    try {
      new Function(minified);
    } catch (err) {
      throw new Error(
        `js/${entry}: minified output does not parse — ${err.message}. ` +
          `The line-oriented stripper hit something it cannot handle; leave this ` +
          `file out of buildJs() rather than loosening the stripper.`
      );
    }
    fs.writeFileSync(file, minified, "utf8");
  }
}

// Publishes the coverage list for the runtime map. Only the fields the browser
// needs — the map cares about the id, the name it shows in its overlay and the
// centre it flies to; `map` (label side / pin size) is for the generated hero
// SVG and `row`/`href` are for the pills, so neither ships.
// Runs AFTER buildPassthrough(), which copies assets/ verbatim: writing it
// second is what keeps a stale hand-made copy from winning.
function buildCoverageData() {
  const locations = loadCoverage();
  if (!locations.length) return;
  const payload = locations.map((loc) => ({
    id: loc.id,
    name: loc.name,
    center: loc.center,
    boundaryUrl: `/assets/data/coverage-boundaries/${loc.boundary || loc.id}.geojson`,
  }));
  fs.mkdirSync(path.dirname(COVERAGE_RUNTIME_OUT), { recursive: true });
  fs.writeFileSync(COVERAGE_RUNTIME_OUT, JSON.stringify(payload), "utf8");
  console.log(
    `build: content/coverage.json -> ${path.relative(ROOT, COVERAGE_RUNTIME_OUT)} (${payload.length} locations)`
  );
}

// Conservative, safe CSS minification: strip /* comments */, then trim each
// line and drop blank lines. It never touches whitespace *within* a line, so
// strings (content:"…", font-family, url()) are untouched. This codebase is
// heavily commented, so this alone is a large size cut with no risk of
// breaking values. (Not maximal minification — deliberately, for safety.)
function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");
}

// Minify every css/**/*.css into dist/, and concatenate the SHARED_CSS_ORDER
// files (in cascade order) into a single dist/css/app.css bundle that
// head-common.html links instead of the 7 individual files.
function buildCss() {
  const srcRoot = path.join(ROOT, "css");
  const outRoot = path.join(DIST_DIR, "css");
  if (!fs.existsSync(srcRoot)) return;
  fs.mkdirSync(outRoot, { recursive: true });
  const shared = {};

  (function walk(dir, rel) {
    for (const entry of fs.readdirSync(dir)) {
      if (entry === ".DS_Store") continue;
      const full = path.join(dir, entry);
      const relPath = rel ? path.join(rel, entry) : entry;
      if (fs.statSync(full).isDirectory()) {
        walk(full, relPath);
        continue;
      }
      if (!entry.endsWith(".css")) continue;
      const minified = minifyCss(fs.readFileSync(full, "utf8"));
      const name = entry.replace(/\.css$/, "");
      // Top-level shared file -> goes into the bundle, not copied individually.
      if (!rel && SHARED_CSS_ORDER.includes(name)) {
        shared[name] = minified;
        continue;
      }
      const dest = path.join(outRoot, relPath);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, minified, "utf8");
    }
  })(srcRoot, "");

  const bundle = SHARED_CSS_ORDER.map((n) => shared[n] || "").join("\n");
  fs.writeFileSync(path.join(outRoot, "app.css"), bundle, "utf8");
}

function build() {
  // maxRetries/retryDelay: macOS can throw a transient ENOTEMPTY/EBUSY here if
  // something touches dist/ mid-delete (a .DS_Store / Spotlight write, or a
  // still-running `serve` from a previous `npm run dev`). Retrying clears it.
  fs.rmSync(DIST_DIR, { recursive: true, force: true, maxRetries: 5, retryDelay: 120 });
  fs.mkdirSync(DIST_DIR, { recursive: true });
  const count = buildPages();
  buildPassthrough();
  buildCoverageData();
  buildCss();
  console.log(`build: done — ${count} page(s) compiled, assets copied to dist/.`);
}

build();
