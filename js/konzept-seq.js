/*
  konzept-seq.js — "Ihr individuelles Sicherheitskonzept" exploded-view sequence.

  Three isometric layers (Site Walkthrough → Risk Assessment → Final Security
  Concept), each reusing the exact same #konzept-base, animated into a vertical
  scroll-driven exploded view.

  Infrastructure reuse (NOTHING new imported/created): the site's single GSAP +
  ScrollTrigger, riding the single Lenis + GSAP-ticker loop from
  js/smooth-scroll.js (no new Lenis / RAF / DOMContentLoaded). CSS position:sticky
  drives the pin (NO ScrollTrigger.pin), like system-story. gsap.matchMedia gates
  it to desktop + no-reduced-motion — same query as the CSS .konzept-seq--enhanced.

  Motion split:
    - CSS (konzept-seq.css): the dotted-blue route marches, and the checkpoint
      "ping" rings + risk markers breathe — continuous, neutralised by motion.css
      under reduced-motion.
    - This script (scroll choreography): moves the three layers (protagonist
      centre / peek above+below / exploded stack), toggles the active label, and
      for Layer 1 DRAWS the route in progressively (a mask stroke whose dashoffset
      is scrubbed) with the checkpoints appearing in sequence as it draws — no
      traveling dot (client 2026-07-29).

  JS-only-ever-enhances: no JS / mobile / reduced-motion shows the three layers
  stacked, route fully drawn, all points visible.
*/
(function () {
  "use strict";

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  var root = document.querySelector("[data-konzept-seq]");
  if (!root) return;

  gsap.registerPlugin(ScrollTrigger);

  var layers = gsap.utils.toArray(".konzept-seq__layer", root);
  if (layers.length < 3) return;
  var L1 = root.querySelector('[data-kz-layer="1"]');
  var L2 = root.querySelector('[data-kz-layer="2"]');
  var L3 = root.querySelector('[data-kz-layer="3"]');

  // Smaller vertical travel so the cubes sit CLOSER together (client 2026-07-29
   // — "un poco más pegados, como la foto"; was ±84).
  var UP = -60, DOWN = 60;
  var S_IN = 0.82, O_IN = 0.28;

  function setActiveLabel(idx) {
    layers.forEach(function (l) {
      l.classList.toggle("is-active", String(idx) === l.getAttribute("data-kz-layer"));
    });
  }

  var mm = gsap.matchMedia();

  /* Split each stage title into per-character spans so the label can resolve in
     character by character, matching the section headings (client 2026-07-30:
     "el efecto de aparición de los otros títulos de la web").

     Done here, not in js/title-reveal.js, because that script drives itself from
     a ScrollTrigger on the heading — and these three labels never move (they sit
     at one absolute position inside the pinned stage), so a single scroll
     position would fire all three at once. The cascade is driven by .is-active
     instead, via CSS transition-delay (see .kz-char in css/konzept-seq.css).

     JS-only-ever-enhances: this runs ONLY inside the enhanced branch, so mobile,
     no-JS, crawlers and reduced motion all keep the plain, fully visible title.
     The original text becomes the element's aria-label and the generated spans
     are aria-hidden, so screen readers still read a word, not loose letters. */
  function splitTitle(el) {
    if (!el || el.querySelector(".kz-char")) return;
    var text = el.textContent;
    if (!text.trim()) return;
    el.setAttribute("aria-label", text.trim());
    var frag = document.createDocumentFragment();
    var i = 0;
    text.split(/(\s+)/).forEach(function (part) {
      if (part === "") return;
      if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
      // Word wrapper keeps the title from ever breaking mid-word.
      var word = document.createElement("span");
      word.style.display = "inline-block";
      word.setAttribute("aria-hidden", "true");
      for (var c = 0; c < part.length; c++) {
        var ch = document.createElement("span");
        ch.className = "kz-char";
        ch.style.setProperty("--i", i++);
        ch.textContent = part[c];
        word.appendChild(ch);
      }
      frag.appendChild(word);
    });
    el.textContent = "";
    el.appendChild(frag);
  }

  mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", function () {
    root.classList.add("konzept-seq--enhanced");
    root.querySelectorAll(".konzept-seq__ttl").forEach(splitTitle);
    ScrollTrigger.refresh();

    // Layer positions: L1 centred/active, L2 + L3 waiting below. Cubes are
    // ALWAYS THE SAME SIZE now (client 2026-07-29 — no scale-in/out, no exploded
    // shrink); the smooth entrance is opacity + slide (yPercent) + blur only.
    gsap.set(L1, { yPercent: 0, opacity: 1, filter: "blur(0px)" });
    gsap.set(L2, { yPercent: DOWN, opacity: O_IN, filter: "blur(7px)" });
    gsap.set(L3, { yPercent: DOWN * 1.4, opacity: 0.14, filter: "blur(9px)" });

    // ---- Layer 1 walkthrough (client 2026-07-29): as the section approaches,
    // the dotted route DRAWS progressively; checkpoints activate in sequence
    // (only the current one glows strongly, previous soft, upcoming subtle);
    // direction arrows + the three tooltips reveal when the route reaches them;
    // and one figure walks along the route. All driven by ONE scrubbed
    // ScrollTrigger over the approach. Scoped to Layer 1. ----
    var SVGNS = "http://www.w3.org/2000/svg";
    var routePath = L1.querySelector(".kz-route");
    var reveal = L1.querySelector(".kz-reveal");
    var overlay = L1.querySelector(".kz-ov--walk");
    var cps = Array.prototype.slice.call(L1.querySelectorAll(".kz-cp"));
    var tips = Array.prototype.slice.call(L1.querySelectorAll(".kz-tip"));
    var walker = L1.querySelector("[data-kz-walker]");
    var routeLen = routePath ? routePath.getTotalLength() : 0;
    var revLen = reveal ? reveal.getTotalLength() : 0;

    // Fraction (0..1) along the route nearest to a point.
    function fracAt(x, y) {
      if (!routePath || !routeLen) return 0;
      var best = 0, bestD = Infinity;
      for (var l = 0; l <= routeLen; l += 8) {
        var pt = routePath.getPointAtLength(l);
        var dx = pt.x - x, dy = pt.y - y, d = dx * dx + dy * dy;
        if (d < bestD) { bestD = d; best = l; }
      }
      return best / routeLen;
    }
    function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    cps.forEach(function (c) {
      var dot = c.querySelector(".kz-cp__dot");
      c._frac = dot ? fracAt(+dot.getAttribute("cx"), +dot.getAttribute("cy")) : 0;
    });
    // Tooltips reveal in a fixed top→bottom sequence (data-kz-seq): each one's
    // connector LINE draws first, then its text fades in.
    tips.forEach(function (t) {
      t._seq = +t.dataset.kzSeq || 0;
      t._link = t.querySelector(".kz-tip__link");
      t._box = t.querySelector(".kz-tip__box");
      t._dot = t.querySelector(".kz-tip__dot");
      t._linkLen = t._link ? t._link.getTotalLength() : 0;
      if (t._link) {
        t._link.setAttribute("stroke-dasharray", t._linkLen);
        t._link.setAttribute("stroke-dashoffset", t._linkLen);
      }
    });

    // Direction arrows created along the route (enhanced-only; removed on revert).
    var arrows = routePath ? [0.16, 0.44, 0.72].map(function (f) {
      var p1 = routePath.getPointAtLength(routeLen * f);
      var p2 = routePath.getPointAtLength(Math.min(routeLen, routeLen * f + 6));
      var ang = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
      var a = document.createElementNS(SVGNS, "path");
      a.setAttribute("class", "kz-arrow");
      a.setAttribute("d", "M-7 -6 L1 0 L-7 6");
      a.setAttribute("transform", "translate(" + p1.x + " " + p1.y + ") rotate(" + ang + ")");
      a._frac = f;
      overlay.appendChild(a);
      return a;
    }) : [];

    function placeWalker(p) {
      if (!walker || !routeLen) return;
      var pt = routePath.getPointAtLength(routeLen * Math.max(0, Math.min(1, p)));
      walker.setAttribute("transform", "translate(" + pt.x + " " + pt.y + ")");
    }

    // Hidden start states (enhanced only). Route hidden via the mask's dashoffset.
    if (reveal) {
      reveal.setAttribute("stroke-dasharray", revLen);
      reveal.setAttribute("stroke-dashoffset", revLen);
    }
    /* opacity ONLY on the box — a GSAP `y` would set a CSS transform that
       overrides the box's SVG transform="translate(x y)" and snap it to 0,0. */
    gsap.set(tips.map(function (t) { return t._box; }).filter(Boolean), { opacity: 0 });
    gsap.set(tips.map(function (t) { return t._dot; }).filter(Boolean), { opacity: 0 });
    gsap.set(arrows, { opacity: 0 });
    placeWalker(0);

    ScrollTrigger.create({
      trigger: root, start: "top 92%", end: "top 22%", scrub: 0.6, invalidateOnRefresh: true,
      onUpdate: function (self) {
        var p = self.progress;
        if (reveal) reveal.setAttribute("stroke-dashoffset", revLen * (1 - p));
        // Active = the reached checkpoint with the largest fraction.
        var activeIdx = -1, activeFrac = -1;
        cps.forEach(function (c, i) { if (c._frac <= p && c._frac > activeFrac) { activeFrac = c._frac; activeIdx = i; } });
        cps.forEach(function (c, i) {
          c.classList.remove("is-active", "is-past", "is-upcoming");
          c.classList.add(c._frac > p ? "is-upcoming" : (i === activeIdx ? "is-active" : "is-past"));
        });
        arrows.forEach(function (a) { gsap.set(a, { opacity: p >= a._frac ? 1 : 0 }); });
        tips.forEach(function (t) {
          var s = 0.16 + t._seq * 0.26;      // staggered start, top→bottom
          var lineEnd = s + 0.13;            // line finishes drawing
          var textEnd = lineEnd + 0.08;      // then the text fades in
          var lp = clamp01((p - s) / (lineEnd - s));
          var tp = clamp01((p - lineEnd) / (textEnd - lineEnd));
          if (t._link) t._link.setAttribute("stroke-dashoffset", t._linkLen * (1 - lp));
          if (t._dot) gsap.set(t._dot, { opacity: lp > 0 ? 1 : 0 });
          if (t._box) gsap.set(t._box, { opacity: tp });
        });
        // Walker moves in LOCKSTEP with the route drawing (client 2026-07-29 —
        // "the line and the person have to go at the same time"): same progress
        // as the reveal above, so the figure sits at the tip of the line being
        // drawn. Linear + scrubbed → reversible, no jumps.
        placeWalker(p);
      },
    });

    var tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          var p = self.progress;
          setActiveLabel(p < 0.34 ? 1 : p < 0.64 ? 2 : 3);
        },
      },
    });

    // Shorter, same-size flow (client 2026-07-29): one cube at a time, no scale,
    // no exploded end — just slide + fade + blur, tighter spacing so the next
    // cube is reached with less scroll.
    // Phase 1 — brief hold on L1.
    tl.to({}, { duration: 0.7 }, 0);
    // Phase 2 — L1 rises + dims, L2 to centre.
    tl.to(L1, { yPercent: UP, opacity: O_IN, filter: "blur(7px)", duration: 1.0 }, 0.7);
    tl.to(L2, { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 1.0 }, 0.7);
    // Phase 3 — L2 rises + dims, L3 to centre.
    tl.to(L2, { yPercent: UP, opacity: O_IN, filter: "blur(7px)", duration: 1.0 }, 1.7);
    tl.to(L3, { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 1.0 }, 1.7);
    // Phase 4 — final hold on L3, then the section releases.
    tl.to({}, { duration: 0.8 }, 2.7);

    return function cleanup() {
      root.classList.remove("konzept-seq--enhanced");
      setActiveLabel(0);
      [L1, L2, L3].forEach(function (l) { gsap.set(l, { clearProps: "transform,opacity,filter" }); });
      // Layer 1: undo the walkthrough enhancement so the static default returns.
      if (reveal) { reveal.removeAttribute("stroke-dasharray"); reveal.removeAttribute("stroke-dashoffset"); }
      cps.forEach(function (c) { c.classList.remove("is-active", "is-past", "is-upcoming"); });
      tips.forEach(function (t) {
        if (t._link) { t._link.removeAttribute("stroke-dasharray"); t._link.removeAttribute("stroke-dashoffset"); }
        if (t._box) gsap.set(t._box, { clearProps: "opacity" });
        if (t._dot) gsap.set(t._dot, { clearProps: "opacity" });
      });
      if (walker) walker.setAttribute("transform", "translate(560 590)");
      arrows.forEach(function (a) { if (a.parentNode) a.parentNode.removeChild(a); });
    };
  });
})();
