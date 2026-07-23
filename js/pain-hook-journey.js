/*
  Pain Hook "challenge journey" — see pages/index.html's own comment on
  the .pain-hook--journey section for the brief this implements. One
  continuous serpentine route runs through the whole section; four
  challenge blocks sit irregularly in its bays; a single glowing blue
  progress line draws over a muted always-visible base route as the user
  scrolls, activating each checkpoint exactly as the drawn line reaches
  it.

  Redesign 2026-07-21 (detailed client brief). Key features:
    - TWO path layers (muted base always visible + glowing active drawn
      on top), sharing the exact same `d`.
    - ONE continuous route of fine straight runs joined by generous
      rounded 90° corners (rounded-rectangle style), that ENTERS from
      off-canvas and EXITS off-canvas, zig-zagging right→left down the
      section — matching a client-supplied reference (thin hairline
      traces bleeding in from the frame edge). NOT a wavy S-curve, and
      no 45° chamfers (an earlier same-day revision tried chamfers; the
      reference has only rounded 90° turns). The builder still supports
      a `chamfer` flag, just unused now.
    - Node positions are set HERE from the checkpoint coordinates (single
      source of truth) rather than hand-kept CSS percentages.
    - Checkpoint thresholds are measured from the real (curved) path via
      a throwaway sub-path element, so they stay exact even though the
      route is no longer a pure Manhattan polyline.
    - Longer, calmer pacing (~220vh, brief's "220vh to 300vh" range).

  Homepage-only, its own <script defer> tag (same pattern as
  outfits.js/hero-reveal.js/title-reveal.js). Reuses the GSAP core +
  ScrollTrigger already loaded for hero-reveal.js/title-reveal.js; the
  one gsap.registerPlugin(ScrollTrigger) call is harmless to repeat. No
  Lenis anywhere in this project (CLAUDE.md records it as explicitly not
  approved) — native scroll + ScrollTrigger's own `scrub` drives this.

  JS-only-ever-enhances: the four challenge blocks and their icons are
  fully visible by default in the raw HTML/CSS — this script is the only
  thing that ever hides them (via gsap.set(), inline, and only right
  before wiring up the scroll journey), so a no-JS visitor, a
  non-executing crawler, or a script error before this runs all see the
  section fully visible and readable.
*/

(function initPainHookJourney() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  const section = document.querySelector(".pain-hook--journey");
  if (!section) return;

  gsap.registerPlugin(ScrollTrigger);

  const journey = section.querySelector("[data-pain-hook-journey]");
  const svg = section.querySelector(".pain-hook__route");
  const basePath = section.querySelector(".pain-hook__route-path--base");
  const activePath = section.querySelector(".pain-hook__route-path--active");
  const nodes = Array.from(section.querySelectorAll("[data-pain-hook-node]"));
  const items = Array.from(section.querySelectorAll("[data-pain-hook-item]"));
  const icons = items
    .map((item) => item.querySelector("[data-pain-hook-icon]"))
    .filter(Boolean);
  const progressFill = section.querySelector("[data-pain-hook-progress-fill]");
  const cta = section.querySelector("[data-pain-hook-cta]");

  if (!journey || !svg || !basePath || !activePath || !items.length || !cta) return;

  /*
    The route's ONLY shape definition — a single ordered list of points
    in the SVG's 0-100 viewBox (preserveAspectRatio="none", so each
    coordinate is a percentage of the .pain-hook__journey box). Interior
    points tagged `checkpoint` are the four challenge markers, in
    narrative order 0-3. Everything downstream (the path `d`, the node
    positions, and each checkpoint's scroll threshold) is derived from
    this one list, so the drawn line, the nodes, and the reveals can
    never fall out of sync.

    The blocks themselves are placed in CSS (.pain-hook__item--1..4);
    these checkpoint coordinates are chosen to sit just OUTSIDE each
    block's box so the route threads the bays without crossing text.
  */
  // Redesign 2026-07-23 (client brief: match the BLUE reference — a delicate
  // hairline thread with LARGE, smooth rounded corners and a spacious,
  // editorial staircase, not a tight technical circuit). Big radii (14) and
  // wide sweeps leave generous negative space; the four checkpoints sit in a
  // scattered top-right / mid-left / lower-right / bottom-left rhythm that the
  // text blocks (page-home.css .pain-hook__item--1..4) follow.
  const POINTS = [
    { x: -10, y: 12 },                        // enters off-canvas (top-left)
    { x: 54,  y: 12, checkpoint: 0, r: 14 },  // CP1 — top, near the top-right block
    { x: 54,  y: 36, r: 14 },                 // big rounded turn — sweep left
    { x: 14,  y: 36, checkpoint: 1, r: 14 },  // CP2 — mid-left block
    { x: 14,  y: 60, r: 14 },                 // big rounded turn — sweep right
    { x: 60,  y: 60, checkpoint: 2, r: 14 },  // CP3 — lower-right block
    { x: 60,  y: 84, r: 14 },                 // big rounded turn — sweep left
    { x: 22,  y: 84, checkpoint: 3, r: 14 },  // CP4 — bottom-left block
    { x: 22,  y: 112 },                       // exits off-canvas (bottom)
  ];

  // Circuit-trace builder (redesign 2026-07-21, client brief: rectilinear
  // circuit-board route, NOT a wavy S-curve). Straight `L` runs between
  // points; each interior corner is cut back by its own radius `r` and
  // closed with either a `Q` (a restrained rounded 90° turn) or, when the
  // point is flagged `chamfer`, a straight `L` across the cut (a clean
  // 45° diagonal transition — the "some 45-degree diagonals" the brief
  // asks for). No long cubic Béziers. Because every corner depends only
  // on its own point plus its immediate neighbours, building from a slice
  // reproduces the identical earlier geometry — which is what keeps the
  // sub-path length measurement below exact.
  function buildPath(points) {
    if (points.length < 2) return "";
    const fmt = (n) => Math.round(n * 100) / 100;
    const along = (from, to, r) => {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const len = Math.hypot(dx, dy) || 1;
      const rr = Math.min(r, len / 2);
      return { x: from.x + (dx / len) * rr, y: from.y + (dy / len) * rr };
    };
    let d = "M " + fmt(points[0].x) + " " + fmt(points[0].y);
    for (let i = 1; i < points.length - 1; i++) {
      const prev = points[i - 1];
      const cur = points[i];
      const next = points[i + 1];
      const r = typeof cur.r === "number" ? cur.r : 3;
      const p1 = along(cur, prev, r);
      const p2 = along(cur, next, r);
      d += " L " + fmt(p1.x) + " " + fmt(p1.y);
      d += cur.chamfer
        ? " L " + fmt(p2.x) + " " + fmt(p2.y)
        : " Q " + fmt(cur.x) + " " + fmt(cur.y) + " " + fmt(p2.x) + " " + fmt(p2.y);
    }
    const last = points[points.length - 1];
    d += " L " + fmt(last.x) + " " + fmt(last.y);
    return d;
  }

  const fullD = buildPath(POINTS);
  basePath.setAttribute("d", fullD);
  activePath.setAttribute("d", fullD);

  // Position each node on its checkpoint's coordinate (% of the journey
  // box, matching the viewBox 1:1). Done here, not in CSS, so nodes and
  // route share the single POINTS source of truth. Safe to run even on
  // mobile / reduced-motion (nodes are display:none there, but their
  // left/top are harmless to set).
  const checkpointPoints = POINTS.filter((p) => typeof p.checkpoint === "number").sort(
    (a, b) => a.checkpoint - b.checkpoint
  );
  nodes.forEach((node, i) => {
    const cp = checkpointPoints[i];
    if (cp) {
      node.style.left = cp.x + "%";
      node.style.top = cp.y + "%";
    }
  });

  // Each checkpoint's scroll-progress threshold = its fraction of the
  // total path length, measured from the REAL curved path via a
  // throwaway sub-path (getTotalLength handles curves exactly, unlike a
  // Manhattan sum). Measured lazily inside the desktop branch, where the
  // SVG is display:block (getTotalLength is unreliable on display:none).
  function checkpointThresholds(fullLength) {
    const temp = document.createElementNS("http://www.w3.org/2000/svg", "path");
    svg.appendChild(temp);
    const thresholds = [];
    POINTS.forEach((p, i) => {
      if (typeof p.checkpoint === "number") {
        temp.setAttribute("d", buildPath(POINTS.slice(0, i + 1)));
        thresholds[p.checkpoint] = temp.getTotalLength() / fullLength;
      }
    });
    svg.removeChild(temp);
    return thresholds;
  }

  // Mobile has no path geometry — a simple even split across the
  // section's scroll range drives the same reveal sequence.
  const mobileThresholds = [0.15, 0.4, 0.65, 0.88];
  const ctaThreshold = 0.95;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // No ScrollTrigger, no draw animation: .pain-hook--journey.is-static
    // (page-home.css) shows the active path fully drawn and every node
    // active; the base path and the four blocks are already visible by
    // default. Reading order and all content are fully preserved.
    section.classList.add("is-static");
    return;
  }

  function armItems() {
    gsap.set(items, { opacity: 0, y: 24 });
    if (icons.length) gsap.set(icons, { opacity: 0, scale: 0.9 });
  }

  function disarmItems() {
    gsap.set(items, { clearProps: "opacity,transform" });
    if (icons.length) gsap.set(icons, { clearProps: "opacity,transform" });
  }

  function revealItem(index, show) {
    gsap.to(items[index], {
      opacity: show ? 1 : 0,
      y: show ? 0 : 24,
      duration: show ? 0.5 : 0.3,
      ease: "power2.out",
      overwrite: true,
    });
    if (icons[index]) {
      gsap.to(icons[index], {
        opacity: show ? 1 : 0,
        scale: show ? 1 : 0.9,
        duration: show ? 0.5 : 0.3,
        ease: "power2.out",
        overwrite: true,
      });
    }
  }

  // pathLength present = desktop, drives the active path's
  // stroke-dashoffset (the glowing draw). Absent = mobile, drives the
  // plain progress-fill bar height. Both share the checkpoint/CTA reveal
  // logic, so the line progress and content activation stay causally
  // linked in either mode.
  function makeUpdater(thresholds, pathLength) {
    const revealed = thresholds.map(() => false);
    let ctaActive = false;

    return function update(progress) {
      if (typeof pathLength === "number") {
        activePath.style.strokeDashoffset = String(pathLength * (1 - progress));
      } else if (progressFill) {
        progressFill.style.height = Math.round(progress * 100) + "%";
      }

      thresholds.forEach((t, i) => {
        const reached = progress >= t;
        if (reached !== revealed[i]) {
          revealed[i] = reached;
          revealItem(i, reached);
        }
        if (nodes[i]) {
          nodes[i].classList.toggle("is-active", reached);
          const laterActive = thresholds.some((t2, j) => j > i && progress >= t2);
          nodes[i].classList.toggle("is-passed", reached && laterActive);
        }
      });

      const ctaNow = progress >= ctaThreshold;
      if (ctaNow !== ctaActive) {
        ctaActive = ctaNow;
        cta.classList.toggle("is-active", ctaNow);
      }
    };
  }

  ScrollTrigger.matchMedia({
    "(min-width: 1024px)": function () {
      armItems();

      const length = activePath.getTotalLength();
      activePath.style.strokeDasharray = String(length);
      activePath.style.strokeDashoffset = String(length);

      const update = makeUpdater(checkpointThresholds(length), length);

      // NOT pinned (client 2026-07-21: wants a "flowy" scroll — the
      // section should never freeze in place and play through while the
      // page is held; it should just draw naturally as it scrolls by).
      // Progress is scrubbed to the section's own natural travel through
      // the viewport, from just after its top enters to just before its
      // bottom leaves — so the route draws and the checkpoints reveal in
      // step with normal scrolling, no stop. This is the "use natural
      // page scroll, choose the simpler implementation" path the brief
      // explicitly preferred.
      const st = ScrollTrigger.create({
        trigger: journey,
        start: "top 85%",
        end: "bottom 15%",
        scrub: 1,
        onUpdate: (self) => update(self.progress),
      });

      return function cleanup() {
        st.kill();
        disarmItems();
        activePath.style.strokeDashoffset = String(length);
        nodes.forEach((n) => n.classList.remove("is-active", "is-passed"));
        cta.classList.remove("is-active");
      };
    },

    "(max-width: 1023.98px)": function () {
      armItems();

      const update = makeUpdater(mobileThresholds, undefined);

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        end: "bottom 70%",
        scrub: 1,
        onUpdate: (self) => update(self.progress),
      });

      return function cleanup() {
        st.kill();
        disarmItems();
        cta.classList.remove("is-active");
        if (progressFill) progressFill.style.height = "0%";
      };
    },
  });
})();
