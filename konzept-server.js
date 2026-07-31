/*
  konzept-server.js — local dev helper so the Konzept editors can write straight
  into the site (a browser file:// page can't touch your project; this tiny
  zero-dependency server bridges that).

  Run:   node konzept-server.js
  Then open the editors via the server (NOT file://), e.g.:
         http://localhost:8787/konzept-grid.html   (route / Layer 1)

  Each editor's "Guardar en la web" button POSTs its coordinates here; the server
  rewrites the marked block in pages/index.html and runs `node build.js`, so the
  real site updates. Refresh your `npm run dev` tab to see it.

  Only content BETWEEN the <!-- KZ:*:START --> / <!-- KZ:*:END --> markers is
  ever rewritten — nothing else in the page is touched.
*/
const http = require("http");
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");

const ROOT = __dirname;
const PAGE = path.join(ROOT, "pages", "index.html");
const PORT = 8787;

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "application/javascript",
  ".mjs": "application/javascript", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".woff2": "font/woff2", ".ico": "image/x-icon",
};

function poly(points) {
  if (!points.length) return "";
  return "M" + points.map((p, i) => (i ? "L" : "") + Math.round(p[0]) + " " + Math.round(p[1])).join(" ");
}

// Regenerate the route block (mask + route path) from the waypoints.
function routeBlock(data) {
  const d = poly(data.points || []);
  return (
    '<!-- KZ:route:START (auto-written by konzept-server.js — do not hand-edit inside) -->\n' +
    '                    <defs>\n' +
    '                      <mask id="kz-reveal-1" maskUnits="userSpaceOnUse">\n' +
    '                        <path class="kz-reveal" stroke-width="34" d="' + d + '"></path>\n' +
    '                      </mask>\n' +
    '                    </defs>\n' +
    '                    <path class="kz-route" data-kz-draw mask="url(#kz-reveal-1)" d="' + d + '"></path>\n' +
    '                    <!-- KZ:route:END -->'
  );
}

// Cone path from apex -> far (half-width 0.34 * length), same as the editor.
function cone(ax, ay, fx, fy) {
  const dx = fx - ax, dy = fy - ay, L = Math.hypot(dx, dy) || 1;
  const px = -dy / L, py = dx / L, hw = L * 0.34;
  const R = Math.round;
  return "M" + R(ax) + " " + R(ay) + " L" + R(fx + px * hw) + " " + R(fy + py * hw) +
         " L" + R(fx - px * hw) + " " + R(fy - py * hw) + " Z";
}

function warnMarker(x, y) {
  const P = "                    ";
  return (
    P + '<g class="kz-warn" data-kz-warn transform="translate(' + Math.round(x) + ' ' + Math.round(y) + ')">\n' +
    P + '  <ellipse class="kz-warn__glow" rx="72" ry="38"></ellipse>\n' +
    P + '  <ellipse class="kz-warn__ring" rx="34" ry="17"></ellipse>\n' +
    P + '  <ellipse class="kz-warn__ring" rx="34" ry="17"></ellipse>\n' +
    P + '  <ellipse class="kz-warn__ring" rx="34" ry="17"></ellipse>\n' +
    P + '  <circle class="kz-warn__dot" r="10"></circle>\n' +
    P + '  <line class="kz-warn__stem" x1="0" y1="0" x2="0" y2="-60"></line>\n' +
    P + '  <g class="kz-warn__icon" transform="translate(0 -82)">\n' +
    P + '    <path class="kz-warn__tri" d="M0 -22 L22 17 L-22 17 Z"></path>\n' +
    P + '    <rect class="kz-warn__bang" x="-2.4" y="-8" width="4.8" height="14"></rect>\n' +
    P + '    <rect class="kz-warn__bang" x="-2.4" y="10" width="4.8" height="4.8"></rect>\n' +
    P + '  </g>\n' +
    P + '</g>'
  );
}

// Regenerate the risk block: glow + per-light gradients + light cones + warnings.
function riskBlock(data) {
  const warnings = data.warnings || [];
  const lights = data.lights || [];
  const P = "                    ";
  let grads = "";
  let cones = "";
  lights.forEach((l, i) => {
    grads +=
      P + '  <linearGradient id="kz-light-' + i + '" gradientUnits="userSpaceOnUse" x1="' + Math.round(l[0]) + '" y1="' + Math.round(l[1]) + '" x2="' + Math.round(l[2]) + '" y2="' + Math.round(l[3]) + '">\n' +
      P + '    <stop offset="0%" stop-color="#ff5b52" stop-opacity="0.7"></stop>\n' +
      P + '    <stop offset="55%" stop-color="#ff5b52" stop-opacity="0.22"></stop>\n' +
      P + '    <stop offset="100%" stop-color="#ff5b52" stop-opacity="0"></stop>\n' +
      P + '  </linearGradient>\n';
    cones += P + '<path class="kz-light" d="' + cone(l[0], l[1], l[2], l[3]) + '" fill="url(#kz-light-' + i + ')"></path>\n';
  });
  const warns = warnings.map((w) => warnMarker(w[0], w[1])).join("\n");
  return (
    '<!-- KZ:risk:START (auto-written by konzept-server.js — do not hand-edit inside) -->\n' +
    P + '<defs>\n' +
    P + '  <radialGradient id="kz-glow" cx="50%" cy="50%" r="50%">\n' +
    P + '    <stop offset="0%" stop-color="#ff5b52" stop-opacity="0.3"></stop>\n' +
    P + '    <stop offset="100%" stop-color="#ff5b52" stop-opacity="0"></stop>\n' +
    P + '  </radialGradient>\n' +
    grads +
    P + '</defs>\n' +
    cones +
    warns + '\n' +
    P + '<!-- KZ:risk:END -->'
  );
}

/* ---------------------------------------------------------------------------
   Layer 3 ("Sicherheitskonzept" / hardware), added 2026-07-30.

   Split across TWO marker blocks on purpose, not one: the editor owns the
   hardware AND the guards, but on the live page the guards sit AFTER the
   patrol route so they paint on top of it. Wrapping everything in one block
   would have meant moving the guards group above the route and quietly
   changing that z-order. Two blocks keeps the DOM order exactly as designed.

   What the editor does NOT own — and therefore must never be inside these
   markers: the guardhouse, the patrol route, the system links and the 6
   tooltips. Those stay hand-authored in pages/index.html.
--------------------------------------------------------------------------- */

// The client's camera artwork (2026-07-30) is a fixed isometric drawing, so it
// cannot be rotated toward its aim point without breaking the perspective.
// Aim is expressed by variant + mirror instead: "de frente" faces the viewer
// (aim below the mount), "de atras" faces away (aim above it); each is drawn
// aiming one way, so it flips horizontally for the other. Keep this identical
// to camTransform() in konzept-final.html or the editor lies about the result.
function camMarkup(ax, ay, fx, fy) {
  const front = fy - ay >= 0;
  const mirror = front ? fx > ax : fx < ax;
  const name = front ? "front" : "back";
  const h = front ? 37 : 40;
  const t = "translate(" + ax + " " + ay + ")" + (mirror ? " scale(-1 1)" : "");
  return (
    '<g class="sc-cam sc-cam--' + name + '" transform="' + t + '">' +
    '<use href="#konzept-cam-' + name + '" width="46" height="' + h + '" x="-23" y="' + -Math.round(h / 2) + '"></use></g>'
  );
}

function finalBlock(data) {
  const cams = data.cams || [];
  const alarms = data.alarms || [];
  const firealarms = data.firealarms || [];
  const sensors = data.sensors || [];
  const gates = data.gates || [];
  const P = "                    ";
  const R = Math.round;

  let grads = "";
  let cones = "";
  let camEls = "";
  cams.forEach((c, i) => {
    const [ax, ay, fx, fy] = c.map(R);
    grads +=
      P + '  <linearGradient id="sc-cone-' + i + '" gradientUnits="userSpaceOnUse" x1="' + ax + '" y1="' + ay + '" x2="' + fx + '" y2="' + fy + '"><stop offset="0%" stop-color="#3D9AD3" stop-opacity="0.34"></stop><stop offset="100%" stop-color="#3D9AD3" stop-opacity="0"></stop></linearGradient>\n';
    cones += P + '  <path class="sc-cone" d="' + cone(ax, ay, fx, fy) + '" fill="url(#sc-cone-' + i + ')"></path>\n';
    camEls +=
      P + '  ' + camMarkup(ax, ay, fx, fy) + '\n';
  });

  // Right-hand sensors have their WAVES mirrored so the signal points INWARD.
  // 540 is the viewBox centre. Unlike the old hand-drawn post, the client's post
  // artwork is never flipped — only the hand-drawn waves beside it are.
  const sensorEls = sensors
    .map((s) => {
      const x = R(s[0]), y = R(s[1]);
      // the post never mirrors (it is real artwork) — only the waves subgroup does
      const w = x > 540 ? ' transform="scale(-1 1)"' : '';
      return P + '  <g class="sc-sensor" transform="translate(' + x + ' ' + y + ')"><use class="sc-sensor__icon" href="#konzept-sensor" width="16.3" height="56" x="-8.15" y="-56"></use><g' + w + '><path class="sc-sensor__wave" d="M12 -46 a13 13 0 0 1 0 20"></path><path class="sc-sensor__wave" d="M19 -50 a20 20 0 0 1 0 28"></path></g></g>';
    })
    .join("\n");

  const alarmEls = alarms
    .map((a) =>
      P + '  <g class="sc-alarm" transform="translate(' + R(a[0]) + ' ' + R(a[1]) + ')"><circle class="sc-alarm__ring" r="28"></circle><circle class="sc-alarm__ring" r="38"></circle><use class="sc-alarm__icon" href="#konzept-alarm" width="36" height="36" x="-18" y="-22"></use></g>'
    )
    .join("\n");

  const fireEls = firealarms
    .map((f) =>
      P + '  <g class="sc-firealarm" transform="translate(' + R(f[0]) + ' ' + R(f[1]) + ')"><use href="#konzept-firealarm" width="46" height="25" x="-23" y="-12.5"></use></g>'
    )
    .join("\n");

  const gateEls = gates
    .map(
      (g) =>
        P + '  <g class="sc-gate" transform="translate(' + R(g[0]) + ' ' + R(g[1]) + ')">\n' +
        P + '    <rect class="sc-gate__post" x="-7" y="-4" width="14" height="32" rx="3"></rect>\n' +
        P + '    <g transform="rotate(-26)">\n' +
        P + '      <rect class="sc-gate__arm" x="0" y="-6" width="92" height="12" rx="3"></rect>\n' +
        P + '      <line class="sc-gate__stripe" x1="16" y1="-6" x2="4" y2="6"></line>\n' +
        P + '      <line class="sc-gate__stripe" x1="38" y1="-6" x2="26" y2="6"></line>\n' +
        P + '      <line class="sc-gate__stripe" x1="60" y1="-6" x2="48" y2="6"></line>\n' +
        P + '      <line class="sc-gate__stripe" x1="82" y1="-6" x2="70" y2="6"></line>\n' +
        P + '    </g>\n' +
        P + '    <g transform="translate(40 8)"><rect class="sc-gate__reader" x="-6" y="-2" width="12" height="28" rx="3"></rect><rect class="sc-gate__reader-screen" x="-4" y="2" width="8" height="7" rx="1.5"></rect></g>\n' +
        P + '  </g>'
    )
    .join("\n");

  return (
    '<!-- KZ:final:START (auto-written by konzept-server.js — do not hand-edit inside) -->\n' +
    P + '<defs>\n' + grads + P + '</defs>\n' +
    P + '<g class="security-concept__coverage">\n' + cones + P + '</g>\n' +
    P + '<!-- CAMERAS — client artwork (#konzept-cam-front / #konzept-cam-back). Fixed\n' +
    P + '     isometric drawings: aim is variant + horizontal mirror, never rotate(). -->\n' +
    P + '<g class="security-concept__cameras">\n' + camEls + P + '</g>\n' +
    P + '<!-- SENSORS — client post artwork (#konzept-sensor) + hand-drawn inward waves.\n' +
    P + '     The post source is filled #00091F, i.e. the section background, so the white\n' +
    P + '     stroke in .sc-sensor__icon is the only reason it is visible at all. -->\n' +
    P + '<g class="security-concept__sensors">\n' + sensorEls + '\n' + P + '</g>\n' +
    P + '<g class="security-concept__alarm">\n' + alarmEls + '\n' + P + '</g>\n' +
    P + '<g class="security-concept__firealarm">\n' + fireEls + '\n' + P + '</g>\n' +
    P + '<!-- ACCESS CONTROL — normally EMPTY: Baseconcept.svg draws a barrier at the\n' +
    P + '     entrance itself, so an overlay gate here reads as two. -->\n' +
    P + '<g class="security-concept__access">\n' + gateEls + '\n' + P + '</g>\n' +
    P + '<!-- KZ:final:END -->'
  );
}

/* This block sits AFTER the (static) patrol route in the page, which is exactly
   why the checkpoints live here rather than in finalBlock: they have to paint on
   top of the route line, and the guards on top of them. */
function finalGuardsBlock(data) {
  const P = "                    ";
  const guards = data.guards || [];
  const cpEls = (data.cps || [])
    .map(
      (c) =>
        P + '  <g class="sc-cp" transform="translate(' + Math.round(c[0]) + ' ' + Math.round(c[1]) + ')"><use href="#konzept-patrol-cp" width="16" height="42" x="-8" y="-42"></use></g>'
    )
    .join("\n");
  const els = guards
    .map(
      (g) =>
        P + '  <g class="sc-guard" transform="translate(' + Math.round(g[0]) + ' ' + Math.round(g[1]) + ')"><use href="#konzept-person" width="26" height="56" x="-13" y="-56"></use></g>'
    )
    .join("\n");
  return (
    '<!-- KZ:finalguards:START (auto-written by konzept-server.js — do not hand-edit inside) -->\n' +
    P + '<!-- PATROL CHECKPOINTS — client artwork (#konzept-patrol-cp). Sits after the\n' +
    P + '     static route so it paints on top of the line. -->\n' +
    P + '<g class="security-concept__cps">\n' + cpEls + '\n' + P + '</g>\n' +
    P + '<g class="security-concept__guards">\n' + els + '\n' + P + '</g>\n' +
    P + '<!-- KZ:finalguards:END -->'
  );
}

/* A layer maps to one OR MORE marker blocks (Layer 3 needs two — see the
   comment above finalBlock). Every block of a layer is rewritten in a single
   save, so a partial write can't leave the page half-updated. */
const REGEN = {
  route: [{ re: /<!-- KZ:route:START[\s\S]*?KZ:route:END -->/, build: routeBlock }],
  risk: [{ re: /<!-- KZ:risk:START[\s\S]*?KZ:risk:END -->/, build: riskBlock }],
  final: [
    { re: /<!-- KZ:final:START[\s\S]*?KZ:final:END -->/, build: finalBlock },
    { re: /<!-- KZ:finalguards:START[\s\S]*?KZ:finalguards:END -->/, build: finalGuardsBlock },
  ],
};

function runBuild(cb) {
  execFile("node", ["build.js"], { cwd: ROOT }, (err, stdout, stderr) => {
    cb(err ? (stderr || err.message) : (stdout.trim().split("\n").pop() || "built"));
  });
}

/* ---------------------------------------------------------------------------
   Reading the CURRENT state back out of the page.

   Each editor shipped with a hardcoded INIT array of coordinates. That is a real
   data-loss trap, and it has already fired once: you edit, you save (the page now
   holds your positions), you reload the editor — which resets to its stale INIT —
   and the next "Guardar" silently overwrites your work with the old layout.

   So the editor asks the server for the live coordinates on load and only falls
   back to its INIT if that fails (server down, or the markers are missing). The
   regexes below are the exact inverse of what finalBlock()/finalGuardsBlock()
   emit; if you change the emitted markup, change these with it.
--------------------------------------------------------------------------- */
function points(block, cls) {
  const out = [];
  const re = new RegExp('class="' + cls + '"[^>]*transform="translate\\(([-\\d.]+) ([-\\d.]+)\\)', "g");
  let m;
  while ((m = re.exec(block))) out.push([+m[1], +m[2]]);
  return out;
}

function readFinal(res) {
  let html;
  try { html = fs.readFileSync(PAGE, "utf8"); } catch (e) { return json(res, 500, { ok: false, error: "cannot read page" }); }
  const a = html.match(/<!-- KZ:final:START[\s\S]*?KZ:final:END -->/);
  const b = html.match(/<!-- KZ:finalguards:START[\s\S]*?KZ:finalguards:END -->/);
  if (!a || !b) return json(res, 500, { ok: false, error: "markers not found" });
  const A = a[0], B = b[0];
  // A camera is stored as apex + aim; the aim only survives in its cone gradient.
  const cams = [];
  const re = /id="sc-cone-\d+"[^>]*x1="([-\d.]+)" y1="([-\d.]+)" x2="([-\d.]+)" y2="([-\d.]+)"/g;
  let m;
  while ((m = re.exec(A))) cams.push([+m[1], +m[2], +m[3], +m[4]]);
  json(res, 200, {
    ok: true,
    cams,
    alarms: points(A, "sc-alarm"),
    firealarms: points(A, "sc-firealarm"),
    sensors: points(A, "sc-sensor"),
    gates: points(A, "sc-gate"),
    cps: points(B, "sc-cp"),
    guards: points(B, "sc-guard"),
  });
}

function save(layer, data, res) {
  const gens = REGEN[layer];
  if (!gens) return json(res, 400, { ok: false, error: "unknown layer: " + layer });
  let html;
  try { html = fs.readFileSync(PAGE, "utf8"); } catch (e) { return json(res, 500, { ok: false, error: "cannot read page" }); }
  // Check EVERY marker pair before writing anything — a layer with two blocks
  // must not end up with one rewritten and the other silently skipped.
  for (const gen of gens) {
    if (!gen.re.test(html)) {
      return json(res, 500, { ok: false, error: "markers not found in page for layer " + layer });
    }
  }
  for (const gen of gens) html = html.replace(gen.re, gen.build(data));
  fs.writeFileSync(PAGE, html, "utf8");
  runBuild((msg) => json(res, 200, { ok: true, build: msg }));
}

function json(res, code, obj) {
  res.writeHead(code, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
  res.end(JSON.stringify(obj));
}

http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/state/final") return readFinal(res);
  if (req.method === "POST" && req.url.startsWith("/save/")) {
    const layer = req.url.slice("/save/".length);
    let body = "";
    req.on("data", (c) => { body += c; if (body.length > 5e6) req.destroy(); });
    req.on("end", () => {
      try { save(layer, JSON.parse(body || "{}"), res); }
      catch (e) { json(res, 400, { ok: false, error: String(e) }); }
    });
    return;
  }
  // static
  let rel = decodeURIComponent(req.url.split("?")[0]);
  if (rel === "/") rel = "/konzept-grid.html";
  const file = path.join(ROOT, path.normalize(rel));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end("forbidden"); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end("not found"); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream" });
    res.end(buf);
  });
}).listen(PORT, () => {
  console.log("konzept-server on http://localhost:" + PORT);
  console.log("  route editor:  http://localhost:" + PORT + "/konzept-grid.html");
});
