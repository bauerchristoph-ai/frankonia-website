/*
  sticky-story.js — Trust "sticky story" (Codrops StickySections index9).

  Integrated 2026-07-23 from the sibling prototype ../frankonia-sticky-story.
  Behaviour = the prototype; wiring = Frankonia's architecture:

    - Self-initialising deferred IIFE (same pattern as system-story.js
      / pain-hook-journey.js). NO extra DOMContentLoaded — the
      <script defer> already guarantees the DOM is parsed. Runs once.
    - Reuses the site's single GSAP + ScrollTrigger and the single Lenis from
      js/smooth-scroll.js (native window scroll, no transformed wrapper, so real
      CSS position:sticky works). It creates ONLY per-scene parallax
      ScrollTriggers — no Lenis, no second RAF loop, no extra
      lenis.on("scroll", ...) / gsap.ticker binding, no ScrollTrigger pin.
    - gsap.matchMedia("(min-width:1024px) and (prefers-reduced-motion:
      no-preference)") — the exact query the CSS enhanced block uses, so layout
      and JS never diverge. matchMedia auto-kills the ScrollTriggers and reverts
      inline transforms when the query stops matching (resize < 1024px or
      reduced-motion), so crossing the breakpoint leaves no stale transforms and
      rebuilds cleanly on return — no duplicates.

  The half-panels rise + cover purely via CSS sticky + z-index (works with no
  JS). GSAP adds only the entrance parallax on each scene's inner content; no
  exit slide (with three scenes that would expose the black track as a gap).
  JS-only-ever-enhances: every scene is fully readable in normal flow without
  this script.
*/

(function () {
  "use strict";

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  var root = document.querySelector("[data-sticky-story]");
  if (!root) return;

  var scenes = gsap.utils.toArray("[data-sticky-story-scene]", root);
  if (scenes.length < 2) return;

  gsap.registerPlugin(ScrollTrigger);

  var mm = gsap.matchMedia();

  mm.add(
    "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    function () {
      scenes.forEach(function (el) {
        var inner = el.querySelector("[data-sticky-story-inner]");
        if (!inner) return;

        // Entrance parallax: the content drifts up as the panel rises into and
        // through its sticky window. scrub keeps reverse scroll exact.
        gsap.fromTo(
          inner,
          { yPercent: 16, scale: 0.95 },
          {
            ease: "none",
            yPercent: -16,
            scale: 1,
            scrollTrigger: {
              trigger: el,
              start: "top bottom", // panel top enters from viewport bottom
              end: "bottom top", // panel bottom leaves past viewport top
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      // matchMedia auto-reverts every tween/ScrollTrigger created here when the
      // query stops matching; also clear any inline transform it left behind.
      return function cleanup() {
        scenes.forEach(function (el) {
          var inner = el.querySelector("[data-sticky-story-inner]");
          if (inner) gsap.set(inner, { clearProps: "transform" });
        });
      };
    }
  );
})();
