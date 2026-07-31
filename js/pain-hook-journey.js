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
  const activeGrad = section.querySelector("#pain-hook-active-grad");
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
  // Tweak 2026-07-24 (client brief: match the BLUE reference — crisp 90° turns
  // with a SMALL rounded corner, an orthogonal "staircase", not the big
  // sweeping U-turns the previous large radius produced). Same waypoints / same
  // route / same checkpoints as before — only the corner radius shrank (14 -> 3)
  // so the straight runs dominate and each turn reads as a right angle with a
  // little fillet. The four checkpoints keep their scattered top-right /
  // mid-left / lower-right / bottom-left rhythm that the text blocks
  // (page-home.css .pain-hook__item--1..4) follow.
  // Irregular double-step staircase (client 2026-07-24): between each
  // checkpoint the route takes a DOUBLE step (down / across / down / across)
  // with varied segment lengths — more 90° turns and an uneven rhythm. Every
  // consecutive pair shares an x or a y (pure axis-aligned moves) so each
  // corner is a crisp 90° with the small CORNER_R fillet. Enters off-canvas
  // left and, after the last checkpoint, turns right and exits off-canvas right.
  const CORNER_R = 3; // small corner radius — crisp 90° turn, little curve
  const POINTS = [
    { x: -10, y: 12 },                                // enters off-canvas (top-left)
    { x: 54,  y: 12, checkpoint: 0, r: CORNER_R },    // CP1 — top, near the top-right block
    { x: 54,  y: 22, r: CORNER_R },                   // step down
    { x: 33,  y: 22, r: CORNER_R },                   // step left
    { x: 33,  y: 36, r: CORNER_R },                   // step down
    // CP2 — mid-left block. Route vertex stays at (14,36); the DOT is drawn at
    // nodeX/nodeY instead (client 2026-07-24) so it sits on the line up-right
    // of the text, off it — the vertex itself lands on the text.
    { x: 14,  y: 36, checkpoint: 1, r: CORNER_R, nodeX: 33, nodeY: 27 },
    { x: 14,  y: 50, r: CORNER_R },                   // step down
    { x: 40,  y: 50, r: CORNER_R },                   // step right
    { x: 40,  y: 60, r: CORNER_R },                   // step down
    { x: 60,  y: 60, checkpoint: 2, r: CORNER_R },    // CP3 — lower-right block
    { x: 60,  y: 70, r: CORNER_R },                   // step down
    { x: 43,  y: 70, r: CORNER_R },                   // step left
    { x: 43,  y: 84, r: CORNER_R },                   // step down
    // CP4 — bottom-left block. Same as CP2: route vertex stays at (22,84); the
    // DOT is drawn at nodeX/nodeY, on the line right of the text (client
    // 2026-07-24).
    { x: 22,  y: 84, checkpoint: 3, r: CORNER_R, nodeX: 43, nodeY: 83 },
    { x: 22,  y: 98, r: CORNER_R },                   // short step down, then...
    { x: 112, y: 98 },                                // 90° right, exits off-canvas (RIGHT)
  ];

  // Corner radii in viewBox units, derived from the journey box's REAL pixel
  // size (client 2026-07-24: the old fixed viewBox radius rendered as a
  // stretched/oval curve because preserveAspectRatio="none" scales x and y
  // differently, and on this tall box the y radius became huge). We pick a
  // fixed PIXEL corner size, then convert it to the (different) x- and y-unit
  // radii that give that same pixel reach on both axes → a small, neat,
  // symmetric quarter-turn.
  const TARGET_CORNER_PX = 20;
  function cornerRadii() {
    const rect = journey.getBoundingClientRect();
    const w = rect.width || 1;
    const h = rect.height || 1;
    if (w < 1 || h < 1) return { rx: 2, ry: 2 };
    return { rx: (TARGET_CORNER_PX / w) * 100, ry: (TARGET_CORNER_PX / h) * 100 };
  }

  // Straight `L` runs joined by small rounded 90° corners. Each corner is cut
  // back by rx along a horizontal neighbour / ry along a vertical one (matching
  // pixel reach on both axes → neat symmetric corner) and closed with a `Q`
  // through the sharp corner point. Building from a slice reproduces identical
  // geometry, which keeps the sub-path length measurement below exact.
  function buildPath(points, rx, ry) {
    if (points.length < 2) return "";
    const fmt = (n) => Math.round(n * 100) / 100;
    const along = (from, to) => {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      if (Math.abs(dx) >= Math.abs(dy)) {
        const rr = Math.min(rx, Math.abs(dx) / 2 || rx);
        return { x: from.x + Math.sign(dx) * rr, y: from.y };
      }
      const rr = Math.min(ry, Math.abs(dy) / 2 || ry);
      return { x: from.x, y: from.y + Math.sign(dy) * rr };
    };
    let d = "M " + fmt(points[0].x) + " " + fmt(points[0].y);
    for (let i = 1; i < points.length - 1; i++) {
      const cur = points[i];
      const p1 = along(cur, points[i - 1]);
      const p2 = along(cur, points[i + 1]);
      d += " L " + fmt(p1.x) + " " + fmt(p1.y);
      d += cur.chamfer
        ? " L " + fmt(p2.x) + " " + fmt(p2.y)
        : " Q " + fmt(cur.x) + " " + fmt(cur.y) + " " + fmt(p2.x) + " " + fmt(p2.y);
    }
    const last = points[points.length - 1];
    d += " L " + fmt(last.x) + " " + fmt(last.y);
    return d;
  }

  const checkpointPoints = POINTS.filter((p) => typeof p.checkpoint === "number").sort(
    (a, b) => a.checkpoint - b.checkpoint
  );

  // Nodes sit on their checkpoint coordinate (% of the journey box, matching
  // the viewBox 1:1) — set here, not in CSS, so nodes + route share one source.
  function positionNodes() {
    const rect = journey.getBoundingClientRect();
    const w = rect.width || 1;
    const h = rect.height || 1;
    // Nudge each dot a little OFF the line, outward from its corner, so there's
    // clear space between the dot and the rounded corner (client 2026-07-24).
    const GAP_PX = 13;
    nodes.forEach((node, i) => {
      const cp = checkpointPoints[i];
      if (!cp) return;
      // Explicit dot position override (client 2026-07-24) — used where the
      // route vertex lands on a text block; the dot is placed on the line to
      // the side of the text instead. No bisector offset when overridden.
      if (typeof cp.nodeX === "number" && typeof cp.nodeY === "number") {
        node.style.left = cp.nodeX + "%";
        node.style.top = cp.nodeY + "%";
        return;
      }
      let ox = 0;
      let oy = 0;
      const idx = POINTS.indexOf(cp);
      const prev = POINTS[idx - 1];
      const next = POINTS[idx + 1];
      if (prev && next) {
        // Directions from the corner toward each neighbour, converted to PIXELS
        // first (the viewBox is non-uniformly scaled), then the outward bisector
        // = opposite the side the rounded corner bulges toward.
        const p = { x: ((prev.x - cp.x) * w) / 100, y: ((prev.y - cp.y) * h) / 100 };
        const n = { x: ((next.x - cp.x) * w) / 100, y: ((next.y - cp.y) * h) / 100 };
        const pl = Math.hypot(p.x, p.y) || 1;
        const nl = Math.hypot(n.x, n.y) || 1;
        let bx = -(p.x / pl + n.x / nl);
        let by = -(p.y / pl + n.y / nl);
        const bl = Math.hypot(bx, by) || 1;
        ox = (((bx / bl) * GAP_PX) / w) * 100;
        oy = (((by / bl) * GAP_PX) / h) * 100;
      }
      node.style.left = cp.x + ox + "%";
      node.style.top = cp.y + oy + "%";
    });
  }

  // (Re)build the route `d` at the current box aspect and paint both layers;
  // returns the radii used so callers can measure sub-paths with the same.
  function rebuildGeometry() {
    const { rx, ry } = cornerRadii();
    const d = buildPath(POINTS, rx, ry);
    basePath.setAttribute("d", d);
    activePath.setAttribute("d", d);
    return { rx, ry };
  }

  rebuildGeometry();
  positionNodes();

  // Each checkpoint's scroll-progress threshold = its fraction of the
  // total path length, measured from the REAL curved path via a
  // throwaway sub-path (getTotalLength handles curves exactly, unlike a
  // Manhattan sum). Measured lazily inside the desktop branch, where the
  // SVG is display:block (getTotalLength is unreliable on display:none).
  function checkpointThresholds(fullLength, rx, ry) {
    const temp = document.createElementNS("http://www.w3.org/2000/svg", "path");
    svg.appendChild(temp);
    const thresholds = [];
    POINTS.forEach((p, i) => {
      if (typeof p.checkpoint === "number") {
        temp.setAttribute("d", buildPath(POINTS.slice(0, i + 1), rx, ry));
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
  // Text blocks reveal at (checkpoint threshold × this) — earlier than the
  // line reaches them (client 2026-07-24). Proportional, so the first block
  // barely moves and the later ones come in noticeably sooner.
  const REVEAL_LEAD = 0.62;

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
  function makeUpdater(getThresholds, getPathLength) {
    const revealed = [];
    let ctaActive = false;

    return function update(progress) {
      const thresholds = getThresholds();
      const pathLength = getPathLength();
      if (typeof pathLength === "number") {
        activePath.style.strokeDashoffset = String(pathLength * (1 - progress));
        // Keep the gradient running from the route start to the CURRENT leading
        // point, so the white head always sits on the advancing tip (grey tail
        // fades into the base behind it). userSpaceOnUse endpoints in viewBox
        // units; getPointAtLength returns the same space.
        if (activeGrad) {
          const headLen = pathLength * progress;
          if (headLen > 0.5) {
            const start = activePath.getPointAtLength(0);
            const head = activePath.getPointAtLength(headLen);
            activeGrad.setAttribute("x1", start.x);
            activeGrad.setAttribute("y1", start.y);
            activeGrad.setAttribute("x2", head.x);
            activeGrad.setAttribute("y2", head.y);
          }
        }
      } else if (progressFill) {
        progressFill.style.height = Math.round(progress * 100) + "%";
      }

      thresholds.forEach((t, i) => {
        // Text appears EARLIER than the line reaches its checkpoint (client
        // 2026-07-24: blocks were showing too late, the later ones worst).
        // A proportional lead (× REVEAL_LEAD) barely shifts the first block
        // and pulls the later ones in much sooner. The node still activates on
        // the real threshold, when the drawn line actually reaches it.
        const revealAt = t * REVEAL_LEAD;
        const textReached = progress >= revealAt;
        if (textReached !== revealed[i]) {
          revealed[i] = textReached;
          revealItem(i, textReached);
        }
        // Scroll-scrubbed phrase highlight: the blue bar fills 0->1 as the
        // route travels from where the block reveals (revealAt) to its
        // checkpoint (t). Read by .pain-hook__mark's background-size (CSS).
        if (items[i]) {
          const span = Math.max(t - revealAt, 0.001);
          const markP = Math.min(Math.max((progress - revealAt) / span, 0), 1);
          items[i].style.setProperty("--mark", markP.toFixed(3));
        }
        if (nodes[i]) {
          // The node (dot) activates at the SAME moment as its text (client
          // 2026-07-24) — both use the lead-adjusted threshold, so the dot and
          // the block appear together for every checkpoint, not just the first.
          nodes[i].classList.toggle("is-active", textReached);
          const laterActive = thresholds.some(
            (t2, j) => j > i && progress >= t2 * REVEAL_LEAD
          );
          nodes[i].classList.toggle("is-passed", textReached && laterActive);
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

      // Rebuilt/measured here (and on resize) so the corners are sized to the
      // CURRENT box aspect — neat and symmetric at any width.
      let length = 0;
      let thresholds = [];
      function measure() {
        const { rx, ry } = rebuildGeometry();
        positionNodes();
        length = activePath.getTotalLength();
        activePath.style.strokeDasharray = String(length);
        activePath.style.strokeDashoffset = String(length);
        thresholds = checkpointThresholds(length, rx, ry);
      }
      measure();

      const update = makeUpdater(() => thresholds, () => length);

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

      // Re-derive the corner radii at the new aspect on resize, then re-apply
      // the current progress so the drawn portion stays correct.
      let resizeTimer;
      function onResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          measure();
          update(st.progress);
          ScrollTrigger.refresh();
        }, 150);
      }
      window.addEventListener("resize", onResize);

      return function cleanup() {
        window.removeEventListener("resize", onResize);
        clearTimeout(resizeTimer);
        st.kill();
        disarmItems();
        activePath.style.strokeDashoffset = String(length);
        nodes.forEach((n) => n.classList.remove("is-active", "is-passed"));
        cta.classList.remove("is-active");
      };
    },

    "(max-width: 1023.98px)": function () {
      armItems();

      const update = makeUpdater(() => mobileThresholds, () => undefined);

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
