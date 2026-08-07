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

  for (const pageFile of pageFiles) {
    const sourceLabel = path.relative(ROOT, pageFile);
    let content = fs.readFileSync(pageFile, "utf8");
    content = resolveIncludes(content, sourceLabel, values);
    // Then the page's own placeholders (the ones outside any include).
    content = resolveVars(content, [values], sourceLabel);

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

  return pageFiles.length;
}

function buildPassthrough() {
  for (const { from, to } of PASSTHROUGH) {
    const src = path.join(ROOT, from);
    if (!fs.existsSync(src)) continue;
    copyRecursive(src, path.join(DIST_DIR, to));
  }
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
  buildCss();
  console.log(`build: done — ${count} page(s) compiled, assets copied to dist/.`);
}

build();
