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

// Copied into dist/ verbatim, no processing.
const PASSTHROUGH = [
  { from: "css", to: "css" },
  { from: "js", to: "js" },
  { from: "assets", to: "assets" },
  { from: "robots.txt", to: "robots.txt" },
  { from: "sitemap.xml", to: "sitemap.xml" },
];

const INCLUDE_RE = /<!--\s*include:\s*([\w-]+)\s*-->/g;

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

function resolveIncludes(content, sourceLabel) {
  return content.replace(INCLUDE_RE, (_match, name) => {
    const partialPath = path.join(PARTIALS_DIR, `${name}.html`);
    if (!fs.existsSync(partialPath)) {
      throw new Error(
        `${sourceLabel}: unknown include "${name}" — expected partials/${name}.html`
      );
    }
    return fs.readFileSync(partialPath, "utf8").trim();
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

  for (const pageFile of pageFiles) {
    const sourceLabel = path.relative(ROOT, pageFile);
    let content = fs.readFileSync(pageFile, "utf8");
    content = resolveIncludes(content, sourceLabel);

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

function build() {
  // maxRetries/retryDelay: macOS can throw a transient ENOTEMPTY/EBUSY here if
  // something touches dist/ mid-delete (a .DS_Store / Spotlight write, or a
  // still-running `serve` from a previous `npm run dev`). Retrying clears it.
  fs.rmSync(DIST_DIR, { recursive: true, force: true, maxRetries: 5, retryDelay: 120 });
  fs.mkdirSync(DIST_DIR, { recursive: true });
  const count = buildPages();
  buildPassthrough();
  console.log(`build: done — ${count} page(s) compiled, assets copied to dist/.`);
}

build();
