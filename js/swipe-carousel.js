/*
  swipe-carousel.js — controls for the mobile "one card, a peek of the next"
  swipe strips (css/swipe-carousel.css).

  Generalised 2026-08-04 from js/system-carousel.js, which did this for the six
  "Unser System" cards only. The client asked for the Social reel and the
  References testimonials to behave identically ("que sean iguales que la de las
  6 cards"), so the module now drives EVERY element marked
  `data-swipe-carousel` — its direct children are the cards.

  THE STRIP ITSELF IS PURE CSS: overflow-x + scroll-snap. It swipes, scrolls and
  works with this file absent, broken or never loaded. What this adds, below the
  same breakpoint only:
    - the "01 / 03" counter above the strip,
    - the progress line below it,
    - keyboard: the strip becomes a focusable region and ←/→ step card by card.

  Both readouts track the gesture, not just the settled position: the line
  follows the finger continuously and the number flips as each card takes over
  (client 2026-08-03). There are deliberately NO prev/next buttons — the peeking
  next card is the affordance.

  No GSAP, no Lenis, no library — a horizontal scroll container is a native
  control and driving it with a framework would only get in its way. Lenis is
  vertical-only (gestureOrientation: "vertical" in js/smooth-scroll.js), so it
  never sees these gestures.

  Desktop is untouched: everything is gated on the same matchMedia query and torn
  down completely when it stops matching, so a resize past 768px leaves the
  markup exactly as it was authored.

  Per-strip markup hooks:
    data-swipe-carousel   required — marks the scroller
    data-swipe-label      accessible name for the scrollable region; the wording
                          lives in the markup so each language's page carries its
                          own
    data-swipe-items      optional selector, for cards that are not the
                          scroller's direct children
*/
(function () {
  "use strict";

  /* Two ranges, chosen PER STRIP — a strip carrying `data-swipe-tablet` stays a
     strip through the tablet band, everything else stops at the phone
     breakpoint. It has to be per strip and not one global query because the
     three sections on this page disagree about the tablet band on purpose: see
     the opt-in block in css/swipe-carousel.css. Both values mirror that file's
     media queries — keep the two in step, or the counter and the progress line
     will appear at a width where the strip is not a strip, or vice versa. */
  var MQ = "(max-width: 767.98px)";
  var MQ_TABLET = "(max-width: 1023.98px)";

  var strips = Array.prototype.slice.call(
    document.querySelectorAll("[data-swipe-carousel]")
  );
  if (!strips.length) return;

  var reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");

  function pad2(n) { return (n < 10 ? "0" : "") + n; }

  function nearest(list, x) {
    var best = 0, bestD = Infinity;
    for (var i = 0; i < list.length; i++) {
      var d = Math.abs(list[i] - x);
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  function Strip(scroller) {
    var sel = scroller.getAttribute("data-swipe-items");
    this.scroller = scroller;
    this.mq = window.matchMedia(
      scroller.hasAttribute("data-swipe-tablet") ? MQ_TABLET : MQ
    );
    this.cards = Array.prototype.slice.call(
      sel ? scroller.querySelectorAll(sel) : scroller.children
    );
    this.ui = null;
    this.index = 0;
  }

  /* Distance from the strip's scroll origin to each card, measured off a shared
     offsetParent so no padding/gap maths is needed anywhere else. Recomputed on
     resize because every value in the CSS is in vw. */
  Strip.prototype.offsets = function () {
    var base = this.cards[0].offsetLeft;
    return this.cards.map(function (c) { return c.offsetLeft - base; });
  };

  /* The number is discrete (it belongs to whichever card is nearest), the line is
     continuous (it belongs to the gesture). One frame updates both, off the real
     scrollLeft, so mid-drag they are always consistent with each other. */
  Strip.prototype.paint = function () {
    var one = 1 / this.cards.length;
    var max = this.ui.max;
    var p = max > 0 ? Math.min(1, Math.max(0, this.scroller.scrollLeft / max)) : 0;
    this.ui.fill.style.width = (one + p * (1 - one)) * 100 + "%";

    var i = nearest(this.ui.offsets, this.scroller.scrollLeft);
    if (i !== this.index) {
      this.index = i;
      this.ui.current.textContent = pad2(i + 1);
    }
  };

  Strip.prototype.go = function (i) {
    i = Math.max(0, Math.min(this.cards.length - 1, i));
    this.scroller.scrollTo({
      left: this.ui.offsets[i],
      behavior: reduceMQ.matches ? "auto" : "smooth",
    });
  };

  Strip.prototype.build = function () {
    if (this.ui) return;
    var self = this;
    var scroller = this.scroller;
    var parent = scroller.parentNode;
    if (!parent) return;

    var bar = document.createElement("div");
    bar.className = "swipe-bar";

    var counter = document.createElement("p");
    counter.className = "swipe-counter";
    var current = document.createElement("span");
    current.className = "swipe-counter__current";
    current.textContent = "01";
    counter.appendChild(current);
    counter.appendChild(document.createTextNode(" / " + pad2(this.cards.length)));
    /* Static text plus a value that changes on every frame of a drag: announcing
       it would be noise, and the cards are read in order regardless. */
    counter.setAttribute("aria-hidden", "true");
    bar.appendChild(counter);

    var progress = document.createElement("div");
    progress.className = "swipe-progress";
    progress.setAttribute("aria-hidden", "true");
    var fill = document.createElement("span");
    fill.className = "swipe-progress__fill";
    progress.appendChild(fill);

    parent.insertBefore(bar, scroller);
    if (scroller.nextSibling) parent.insertBefore(progress, scroller.nextSibling);
    else parent.appendChild(progress);

    /* A scrollable region has to be reachable by keyboard. Added here rather than
       in the markup so desktop — where none of these strips scroll — never gains
       a tab stop that does nothing.

       The PREVIOUS values are kept so teardown restores rather than deletes:
       .social__grid is also driven by js/social-carousel.js above 768px, which
       sets its own tabindex for the 3D ring. Blindly removing the attribute on a
       resize past the breakpoint would strip the ring's keyboard access, and
       which of the two matchMedia listeners fires first is not something either
       module should depend on. */
    var prev = {
      tabindex: scroller.getAttribute("tabindex"),
      role: scroller.getAttribute("role"),
      label: scroller.getAttribute("aria-label"),
    };
    var label = scroller.getAttribute("data-swipe-label");
    scroller.setAttribute("tabindex", "0");
    scroller.setAttribute("role", "group");
    if (label) scroller.setAttribute("aria-label", label);

    /* One rAF-coalesced repaint per frame of the drag: `scroll` fires far more
       often than that on a touch drag, and writing style.width per event would
       thrash layout for no visible gain. */
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; self.paint(); });
    }
    function onResize() {
      self.ui.offsets = self.offsets();
      self.ui.max = self.scroller.scrollWidth - self.scroller.clientWidth;
      self.paint();
    }
    function onKey(e) {
      if (e.key === "ArrowRight") { e.preventDefault(); self.go(self.index + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); self.go(self.index - 1); }
    }

    scroller.addEventListener("scroll", onScroll, { passive: true });
    scroller.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);

    this.ui = {
      bar: bar, progress: progress, current: current, fill: fill,
      prev: prev,
      offsets: this.offsets(),
      /* ⚠ Mitgemessen wie die offsets, aus demselben Grund: paint() lief pro
         Bild und las scrollWidth und clientWidth neu — zwei Layout-Werte,
         während system-story.js im selben Bild scrollLeft schreibt. Ein
         Schreiben, dann ein Lesen, das ist ein erzwungenes Neuberechnen pro
         Bild. Beide ändern sich nur mit der Fensterbreite, also einmal messen
         und bei resize erneut. 02.09.2026, gegen das gemeldete Ruckeln. */
      max: this.scroller.scrollWidth - this.scroller.clientWidth,
      teardown: function () {
        scroller.removeEventListener("scroll", onScroll);
        scroller.removeEventListener("keydown", onKey);
        window.removeEventListener("resize", onResize);
      },
    };

    this.index = -1;   // force the first paint to write the number
    this.paint();
  };

  Strip.prototype.destroy = function () {
    if (!this.ui) return;
    this.ui.teardown();
    if (this.ui.bar.parentNode) this.ui.bar.parentNode.removeChild(this.ui.bar);
    if (this.ui.progress.parentNode) this.ui.progress.parentNode.removeChild(this.ui.progress);
    var prev = this.ui.prev, sc = this.scroller;
    ["tabindex", "role", "aria-label"].forEach(function (attr) {
      var was = prev[attr === "aria-label" ? "label" : attr];
      if (was == null) sc.removeAttribute(attr);
      else sc.setAttribute(attr, was);
    });
    /* Leaving a horizontal offset behind would shift the desktop composition. */
    this.scroller.scrollLeft = 0;
    this.ui = null;
    this.index = 0;
  };

  var instances = strips
    .map(function (el) { return new Strip(el); })
    .filter(function (s) { return s.cards.length > 1; });
  if (!instances.length) return;

  function apply() {
    instances.forEach(function (s) {
      if (s.mq.matches) s.build();
      else s.destroy();
    });
  }

  apply();

  /* Listen on every DISTINCT query in use, not on one shared handle: with two
     ranges live, crossing either boundary has to re-evaluate all of them. The
     handler already asks each strip about its own query, so a duplicate call is
     harmless — build() and destroy() both no-op when there is nothing to do. */
  instances
    .map(function (s) { return s.mq; })
    /* By media STRING, not object identity — matchMedia hands back a fresh
       object per call, so two strips on the same range are two objects. */
    .filter(function (m, i, all) {
      for (var j = 0; j < i; j++) if (all[j].media === m.media) return false;
      return true;
    })
    .forEach(function (m) {
      if (m.addEventListener) m.addEventListener("change", apply);
      else if (m.addListener) m.addListener(apply);
    });
})();
