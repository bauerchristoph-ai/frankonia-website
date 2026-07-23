/*
  system-story.js — "Our System" stacked-card interaction.

  Integrated 2026-07-23 from the sibling prototype ../frankonia-system-cards
  (Codrops StickySections index8 stacking). Behaviour is the prototype's;
  the wiring is adapted to Frankonia's architecture:

    - Self-initialising deferred IIFE (same pattern as sticky-sections.js /
      pain-hook-journey.js) — NOT a global that needs a separate call, and NO
      new DOMContentLoaded (the <script defer> guarantees the DOM is ready).
    - Reuses the site's SINGLE GSAP + ScrollTrigger and the SINGLE Lenis
      instance from js/smooth-scroll.js. It does not load GSAP/ScrollTrigger,
      create a Lenis, or start a second rAF loop — it only creates one
      ScrollTrigger, which the existing lenis.on("scroll", ScrollTrigger.update)
      wiring drives transparently.
    - Enhancement is gated by gsap.matchMedia("(min-width:1024px) and
      (prefers-reduced-motion:no-preference)"), exactly like sticky-sections.js.
      matchMedia auto-reverts the enhanced class, every gsap.set/tween and the
      ScrollTrigger when the query stops matching — so resizing below 1024px or
      turning on reduced motion cleanly restores the base vertical list with NO
      stale transforms.
    - NO ScrollTrigger pin — the stage is pinned purely by CSS position:sticky
      (see system-story.css). The sticky stage is never transformed; only the
      cards (and the intro title) move.

  JS-only-ever-enhances: the six cards render as a readable vertical list from
  raw HTML/CSS. This module only adds the sticky/stacked layer on top; no-JS,
  mobile, or reduced-motion visitors keep the full static list.
*/

(function () {
  "use strict";

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  var story = document.querySelector("[data-system-story]");
  if (!story) return;

  var cards = Array.prototype.slice.call(
    story.querySelectorAll("[data-system-card]")
  );
  if (cards.length < 2) return;

  gsap.registerPlugin(ScrollTrigger);

  var introTitle = story.querySelector(".system-story__intro-title");

  // Read a numeric CSS custom property (px or unitless) with a fallback.
  function cssNumber(styles, name, fallback) {
    var raw = styles.getPropertyValue(name).trim();
    if (!raw) return fallback;
    var n = parseFloat(raw);
    return isNaN(n) ? fallback : n;
  }

  var mm = gsap.matchMedia();

  mm.add(
    "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    function () {
      // Motion values sourced from system-story.css tokens (read live).
      var docStyles = getComputedStyle(document.documentElement);
      var OFFSET = cssNumber(docStyles, "--sys-stack-offset", 26); // px per level
      var SCALE_PREV = cssNumber(docStyles, "--sys-scale-prev", 0.96);
      var SCALE_OLDER = cssNumber(docStyles, "--sys-scale-older", 0.92);
      var PREV_OPACITY = cssNumber(docStyles, "--sys-prev-opacity", 0.72);
      var BLUR_PREV = cssNumber(docStyles, "--sys-blur-prev", 1.5); // px
      var BLUR_OLDER = cssNumber(docStyles, "--sys-blur-older", 4); // px
      var TITLE_SCALE_START = cssNumber(docStyles, "--sys-title-scale-start", 1);

      var OP_PREV = PREV_OPACITY; // 1 step back — stays clearly visible
      var OP_OLDER = 0.34; // 2 steps back — faint but present
      var OP_HIDDEN = 0; // 3+ steps back — removed from the stack
      var BELOW_Y = 120; // yPercent for cards waiting below the viewport
      var HOLD_UNITS = 0.44; // final readable hold (mirrors the CSS track maths)

      // Switch on the enhanced (sticky/stacked) layout.
      story.classList.add("system-story--enhanced");

      // Explicit initial states: card 0 active/centred, the rest wait below.
      cards.forEach(function (card, i) {
        gsap.set(card, {
          yPercent: i === 0 ? 0 : BELOW_Y,
          y: 0,
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          transformOrigin: "50% 0%",
        });
      });
      if (introTitle) {
        gsap.set(introTitle, {
          scale: TITLE_SCALE_START,
          transformOrigin: "0% 50%",
        });
      }

      // One scoped, scrubbed timeline. start/end map to the sticky stage's
      // pin/release exactly (CSS sticky provides the pin — no ScrollTrigger pin).
      var tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: story,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      if (introTitle) {
        tl.to(introTitle, { scale: 1, duration: 1 }, 0);
      }

      // Each transition t moves focus from card t to card t+1 (one time-unit),
      // restacking the previous cards by depth behind the new active card.
      for (var t = 0; t < cards.length - 1; t++) {
        var pos = t;
        var incoming = cards[t + 1]; // rises into focus
        var active = cards[t]; // recedes to depth 1
        var prev = cards[t - 1] || null; // recedes to depth 2
        var older = cards[t - 2] || null; // recedes to depth 3 (hidden)

        tl.to(incoming, { yPercent: 0, duration: 1 }, pos);

        tl.to(
          active,
          {
            y: -OFFSET,
            scale: SCALE_PREV,
            opacity: OP_PREV,
            filter: "blur(" + BLUR_PREV + "px)",
            duration: 1,
          },
          pos
        );

        if (prev) {
          tl.to(
            prev,
            {
              y: -OFFSET * 2,
              scale: SCALE_OLDER,
              opacity: OP_OLDER,
              filter: "blur(" + BLUR_OLDER + "px)",
              duration: 1,
            },
            pos
          );
        }

        if (older) {
          tl.to(
            older,
            {
              y: -OFFSET * 3,
              scale: SCALE_OLDER - 0.03,
              opacity: OP_HIDDEN,
              filter: "blur(" + (BLUR_OLDER + 2) + "px)",
              duration: 1,
            },
            pos
          );
        }
      }

      // Final readable hold on the last card before the stage releases.
      tl.to({}, { duration: HOLD_UNITS });

      // Recompute start/end once this layout is in place (layout is CSS-driven
      // and fonts are system fonts, so nothing loads late — but a refresh keeps
      // positions accurate alongside the page's other ScrollTriggers + Lenis).
      ScrollTrigger.refresh();

      // matchMedia cleanup: it auto-reverts the gsap.set/tweens and kills this
      // ScrollTrigger; we only need to drop the enhancement class so the base
      // list returns when the query stops matching.
      return function () {
        story.classList.remove("system-story--enhanced");
      };
    }
  );
})();
