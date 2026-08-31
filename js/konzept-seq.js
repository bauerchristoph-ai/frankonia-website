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
    /* ⚠️⚠️ NICHT aria-label — GEÄNDERT 31.08.2026 (Aufgabe 25).
       Diese Funktion zerlegt einen Titel in einzelne Zeichen-Spans, damit sie
       animiert werden können. Der Originaltext wurde dabei als aria-label an das
       Element gehängt, damit Hilfstechnik den ganzen Titel hört statt einzelner
       Buchstaben — die Absicht war richtig, das Mittel nicht: das Element ist ein
       <span> ohne Rolle, und ein Element mit generischer Rolle kann keinen
       zugänglichen Namen tragen. Screenreader ignorieren das Attribut, die
       Beschriftung kam also gar nicht an.

       Stattdessen: der Originaltext bleibt als ECHTER Text im Dokument, nur
       optisch verborgen, und die Zeichen-Spans werden für Hilfstechnik
       ausgeblendet. Das funktioniert unabhängig von jeder ARIA-Rolle. */
    var vorlese = document.createElement("span");
    vorlese.className = "visually-hidden";
    vorlese.textContent = text.trim();
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
    el.appendChild(vorlese);
    /* ⚠️ KEINE zusaetzliche aria-hidden-Huelle noetig: jede Wort-Huelle oben traegt
       schon aria-hidden="true". Eine weitere waere ein Inline-Element mehr im
       Umbruch, ohne Gewinn. */
    el.appendChild(frag);
  }

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  /* Tooltip reveal, shared by all three diagrams (2026-07-31).
     Layer 1 always scrubbed its tips off scroll; layers 2 and 3 used to flip a
     class and run CSS transition-delays, so their labels played on a timer once
     the layer arrived instead of following the scroll. Same mechanism for all
     three now: connector line draws first, then the text fades in, both mapped
     onto scroll progress so they reverse cleanly.

     TIP_LINE / TIP_TEXT are each tip's own slice of the range; STAGGER is the gap
     between consecutive tips.

     BASE is the one lever for "they show up too late" (client 2026-08-03, "los
     tooltips tienen que aparecer un poco antes, en desktop"): it is where the
     first tip starts inside its layer's scroll range, and every later tip is
     base + seq * stagger, so lowering it moves the whole set earlier without
     changing the spacing between them. All three layers dropped ~0.10 in that
     pass — see the call sites (layer 1 below, layers 2/3 in tipRanges).
     The ScrollTrigger start/end values were deliberately NOT touched: layer 1's
     range also drives the route drawing and the walking figure, which are
     already timed against each other. */
  var TIP_LINE = 0.13, TIP_TEXT = 0.08;

  function prepTips(layer) {
    var tips = Array.prototype.slice.call(layer.querySelectorAll(".kz-tip"));
    tips.forEach(function (t, i) {
      // Layer 3 carries no data-kz-seq, so fall back to DOM order.
      t._seq = t.dataset.kzSeq != null && t.dataset.kzSeq !== "" ? +t.dataset.kzSeq : i;
      t._link = t.querySelector(".kz-tip__link");
      t._box = t.querySelector(".kz-tip__box");
      t._dot = t.querySelector(".kz-tip__dot");
      t._linkLen = t._link ? t._link.getTotalLength() : 0;
      if (t._link) {
        t._link.setAttribute("stroke-dasharray", t._linkLen);
        t._link.setAttribute("stroke-dashoffset", t._linkLen);
      }
      /* ⚠️ THE BOX AND THE DOT HAVE TO BE HIDDEN HERE TOO, not only by
         paintTips (client 2026-08-10: "los veo ya los tooltips y después
         desaparecen y aparecen de nuevo cuando paso… queda un corte raro").
         Until this line, prepTips retracted the LINE but left the box and the
         dot at their CSS default, which is opacity 1. A scrubbed ScrollTrigger
         only calls onUpdate once you are INSIDE its range, so every tooltip in
         the section sat fully visible while you scrolled up to it, blinked out
         the moment the trigger went live at progress ~0, and only then faded
         back in. Preparing them at 0 makes the first paint continuous.
         This stays inside the JS-only-enhances contract: prepTips is only ever
         called from the enhanced matchMedia branch, and both cleanup paths
         clearProps these back — so no JS, reduced motion and <1024px all keep
         the CSS default of fully visible tooltips. */
      if (t._box) gsap.set(t._box, { opacity: 0 });
      if (t._dot) gsap.set(t._dot, { opacity: 0 });
    });
    /* opacity ONLY on the box — a GSAP `y` would set a CSS transform that
       overrides the box's SVG transform="translate(x y)" and snap it to 0,0. */
    return tips;
  }

  function paintTips(tips, p, base, stagger) {
    tips.forEach(function (t) {
      var s0 = base + t._seq * stagger;
      var lineEnd = s0 + TIP_LINE, textEnd = lineEnd + TIP_TEXT;
      var lp = clamp01((p - s0) / TIP_LINE);
      var tp = clamp01((p - lineEnd) / TIP_TEXT);
      if (t._link) t._link.setAttribute("stroke-dashoffset", t._linkLen * (1 - lp));
      if (t._dot) gsap.set(t._dot, { opacity: lp > 0 ? 1 : 0 });
      if (t._box) gsap.set(t._box, { opacity: tp });
    });
  }

  function resetTips(tips) {
    tips.forEach(function (t) {
      if (t._link) { t._link.removeAttribute("stroke-dasharray"); t._link.removeAttribute("stroke-dashoffset"); }
      if (t._box) gsap.set(t._box, { clearProps: "opacity" });
      if (t._dot) gsap.set(t._dot, { clearProps: "opacity" });
    });
  }

  mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", function () {
    root.classList.add("konzept-seq--enhanced");
    root.querySelectorAll(".konzept-seq__ttl").forEach(splitTitle);
    ScrollTrigger.refresh();

    /* No stacked/blurred start states anymore (client 2026-07-30). The three
       stages are normal rows in the flow; each one's text reveals on arrival via
       CSS (.is-active → .konzept-seq__label), with no blur and no transform on
       the layer itself. */

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
    var tips = prepTips(L1);
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
    cps.forEach(function (c) {
      var dot = c.querySelector(".kz-cp__dot");
      c._frac = dot ? fracAt(+dot.getAttribute("cx"), +dot.getAttribute("cy")) : 0;
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
    gsap.set(arrows, { opacity: 0 });
    placeWalker(0);

    /* Anchored to LAYER 1, not to `root` (fixed 2026-07-30).
       `root` is the whole three-stage section, so its top crossed 92%->22% while
       the intro block was still on screen: measured at 1440x813 the range ran
       3353->3922px while layer 1 does not begin until 4229px. The walker finished
       its entire path 307px BEFORE the diagram was visible — which is why a small
       scroll appeared to move it so far.

       Range is now tied to the diagram itself and is ~1.6x longer (569 -> 931px),
       so the same path needs significantly more scrolling. No multiplier, no
       duration, no second tween: progress maps 1:1 onto the path, and
       placeWalker() writes the point directly, so it is linear by construction
       (no ease) and reverses exactly on scroll-up.

       scrub: true (was 0.6) — the icon must stop the instant scrolling stops.
       Lenis already interpolates the scroll position, so this stays smooth
       without adding lag. */
    /* Named so it can serve BOTH onUpdate and onRefresh: onUpdate alone only runs
       once you are inside the range, which would leave a visitor who lands past
       this layer looking at the hidden state prepTips just set. */
    function paintWalkthrough(self) {
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
        // base 0.16 -> 0.05 (client 2026-08-03, tooltips earlier). The tips no
        // longer wait for the route to be well underway: the first one starts
        // drawing its connector at 5% of the walkthrough. Stagger unchanged, so
        // the last tip still lands around 60% of the range, well before the end.
        paintTips(tips, p, 0.05, 0.18);
        // Walker moves in LOCKSTEP with the route drawing (client 2026-07-29 —
        // "the line and the person have to go at the same time"): same progress
        // as the reveal above, so the figure sits at the tip of the line being
        // drawn. Linear + scrubbed → reversible, no jumps.
        placeWalker(p);
    }

    ScrollTrigger.create({
      trigger: L1, start: "top 70%", end: "bottom 20%", scrub: true, invalidateOnRefresh: true,
      onUpdate: paintWalkthrough,
      onRefresh: paintWalkthrough,
    });

    /* Each stage flags itself .is-active once it has scrolled into view — that one
       class is what drives the text reveal, the character cascade, layer 2's
       tooltips and layer 3's hardware groups (all in css/konzept-seq.css).

       Replaces the pinned 3-stage timeline (removed 2026-07-30, client): the page
       is no longer held while stages advance, so there is nothing to scrub. One
       trigger per stage, fired once, `once: true` — the visitor scrolls normally
       and controls where they are.

       `setActiveLabel` is gone with it: it drove a single "current" stage, and now
       all three can legitimately be active at the same time (they are just rows
       on a page, and more than one is on screen at once). */
    layers.forEach(function (layer) {
      ScrollTrigger.create({
        trigger: layer,
        start: "top 78%",
        once: true,
        onEnter: function () { layer.classList.add("is-active"); },
      });
    });

    /* Layers 2 and 3: same scrubbed tooltip reveal as layer 1 (client 2026-07-31
       — "que vayan apareciendo mientras escroleo"). They used to flip .is-active
       and let CSS transition-delays play them on a timer, so the labels ran on
       their own clock once the layer arrived instead of following the scroll.

       Own trigger per layer, over the stretch where the diagram is actually on
       screen. Base/stagger are set per layer so the whole set finishes around
       60 % of the range: layer 2 has 3 tips like layer 1, layer 3 has SEVEN and
       needs a much tighter gap to fit them all in.

       Bases lowered 2026-08-03 with layer 1's (0.16 -> 0.05, 0.10 -> 0.03): the
       client's note was about the tooltips in general, and leaving these two on
       the old timing would have made the three diagrams behave differently.

       ** STAGGER IS A FUNCTION OF THE TIP COUNT — retune it whenever a tip is
       added or removed. ** The last tip completes at
       base + (n-1) * stagger + TIP_LINE + TIP_TEXT, so adding a tip pushes the
       whole tail later even though nothing about the timing changed. That is
       exactly what happened on 2026-08-04: layer 3 went from 5 tips to 7 (the
       new Brandmelder + Alarmanlage labels) and its 0.10 stagger, which had been
       sized for 5, moved the last tip's completion from p=0.64 to p=0.84 —
       measured at 1440px as 1031px into a 1227px range, 246px of extra scrolling
       versus before. The client felt precisely that ("tengo que pasarme un poco
       de escroleo para ver los últimos dos"). Stagger 0.10 -> 0.06 puts it back
       at p=0.60 / 736px, i.e. slightly earlier than the 5-tip version ever was,
       which is the "un poco más rápido" they asked for on top of the fix.
       It also lines all three diagrams up: 0.60 / 0.62 / 0.62.
       Kept as `stagger` rather than a computed "finish by p=0.6" because the gap
       between tips is the thing being designed — the cascade still has to read
       as a cascade. At 0.06 against a 0.21-long per-tip animation, 2-3 tips are
       in flight at once; much below that they stop arriving one after another. */
    var tipRanges = [
      { layer: L2, base: 0.05, stagger: 0.18 },
      { layer: L3, base: 0.03, stagger: 0.06 },
    ];
    var extraTips = [];
    tipRanges.forEach(function (cfg) {
      if (!cfg.layer) return;
      var t = prepTips(cfg.layer);
      if (!t.length) return;
      extraTips.push(t);
      ScrollTrigger.create({
        trigger: cfg.layer,
        start: "top 72%",
        end: "bottom 35%",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: function (self) { paintTips(t, self.progress, cfg.base, cfg.stagger); },
        /* onUpdate alone only ever runs once you move INSIDE the range, so a
           visitor who lands past this layer (a /#konzept deep link, or a
           refresh once the images settle the offsets) would keep the hidden
           state prepTips just set. Painting on refresh makes the state a
           function of the scroll position rather than of how you got there. */
        onRefresh: function (self) { paintTips(t, self.progress, cfg.base, cfg.stagger); },
      });
    });

    return function cleanup() {
      root.classList.remove("konzept-seq--enhanced");
      layers.forEach(function (l) { l.classList.remove("is-active"); });
      extraTips.forEach(resetTips);
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

  /* ==========================================================================
     MOBILE / TABLET TOOLTIPS — REMOVED 2026-08-19 (client: "saca los tooltips en
     el mobile, no es necesario que escroleemos y vaya apareciendo el punto en
     distintos lugares del diagrama y se asocie a la palabra que esté abajo, deja
     nomás los diagramas con todas las ilustraciones y abajo que diga los nombres
     de lo que incluye").

     What used to live here: buildMobileTips() rebuilt each in-SVG .kz-tip as an
     HTML chip (dot + leader line) over the cube below 1024px, plus a ScrollTrigger
     that lit ONE chip at a time off the diagram's scroll progress and mirrored it
     as .is-active on the matching .konzept-seq__terms row. Its CSS (.kz-mtips /
     .kz-mtip*) and the .is-synced dimming went in the same pass.

     ⚠️ THE LIST IS NOW THE WHOLE MOBILE TREATMENT, and that is the point: the
     terms live once, as plain crawlable text under the diagram, at full contrast.
     The dimming only ever existed to mark which chip was lit — with no chips there
     is nothing to mark, so .is-synced is never added and every name reads equally.
     Removing the build is what removes the dimming; they were one mechanism.

     ⚠️ Do not "restore" this by un-hiding the in-SVG .kz-tip boxes on mobile: they
     are laid out outside the 0 0 1079 1110 viewBox (x=-250 / x=1050) for the
     desktop split, so below 1024px they were clipped to two or three letters —
     which is why they are display:none there in the first place.
     ========================================================================== */

})();
