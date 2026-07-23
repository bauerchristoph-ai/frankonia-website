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

  // Scene 1 metric count-up — numbers rise to their target as they scroll into
  // view (client 2026-07-23: "like before"). Decimal-aware (4.7) via
  // data-count-to/data-suffix/data-decimals, en-US thousands grouping. Runs at
  // ALL widths, independent of the desktop parallax below. Reduced-motion / no
  // IntersectionObserver / no-JS all just keep the real final number that is
  // already in the markup — pure enhancement.
  initCounters(root);

  function initCounters(el) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    var nums = el.querySelectorAll("[data-count-to]");
    if (!nums.length) return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          countUp(entry.target);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );
    nums.forEach(function (n) { io.observe(n); });
  }

  function countUp(node) {
    var target = parseFloat(node.getAttribute("data-count-to"));
    if (isNaN(target)) return;
    var decimals = parseInt(node.getAttribute("data-decimals") || "0", 10);
    var suffix = node.getAttribute("data-suffix") || "";
    var duration = 1200;
    var start = performance.now();
    function tick(now) {
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var v = target * eased;
      var text = decimals > 0
        ? v.toFixed(decimals)
        : Math.round(v).toLocaleString("en-US");
      node.textContent = text + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var mm = gsap.matchMedia();

  mm.add(
    "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    function () {
      scenes.forEach(function (el) {
        // The metrics panel stays STILL (client 2026-07-23: its content should
        // not drift while scrolling) — skip the parallax for scene 1.
        if (el.classList.contains("sticky-story__scene--metrics")) return;

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
