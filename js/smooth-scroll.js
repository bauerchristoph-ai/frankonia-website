/*
  Smooth scroll (Lenis) — homepage.

  Ported from the Sacramentum Advisors reference project (a Next.js app that
  uses the same Lenis + GSAP/ScrollTrigger setup) into this project's static
  vanilla-JS form. Approved direction — see docs/project-strategy.md
  ("Lenis (smooth scroll) — KEEP") and CLAUDE.md's tech-constraints note.

  Contract, same "JS only ever enhances" principle as every other motion
  primitive on this site:
    - prefers-reduced-motion  -> Lenis is never created; native scrolling,
      untouched. (Checked first, before anything else.)
    - Lenis global missing (script failed to load) -> bail; native scroll.
    - Touch devices           -> smoothWheel off (phones keep native scroll,
      matching the reference); Lenis still handles programmatic scroll but
      never hijacks touch momentum.
    - ONE Lenis instance, ONE animation loop. When GSAP + ScrollTrigger are
      present (they are on the homepage), Lenis is driven from GSAP's single
      ticker and pushes ScrollTrigger.update on every scroll — this is what
      keeps the pain-hook / system-story (CSS-sticky) triggers accurate under
      smooth scroll, with no second rAF loop. If GSAP isn't on the page,
      it falls back to Lenis's own rAF so it still works standalone.

  Load order (see pages/index.html <head>): gsap -> ScrollTrigger ->
  lenis.min.js -> this file. All defer, so document order guarantees it.
*/
(function () {
  "use strict";

  // 1. Reduced motion wins outright — no smooth scroll, native only.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // 2. Lenis must have loaded (assets/js/vendor/lenis.min.js, before this).
  if (typeof Lenis === "undefined") return;

  var isTouch = window.matchMedia("(pointer: coarse)").matches;

  // expo-out — the exact curve the reference uses, and the same shape as
  // this site's --easing-premium / .u-reveal (tokens.css).
  function expoOut(t) {
    return Math.min(1, 1.001 - Math.pow(2, -10 * t));
  }

  var lenis = new Lenis({
    duration: isTouch ? 1.0 : 1.2,
    easing: expoOut,
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: !isTouch,
    wheelMultiplier: isTouch ? 1.0 : 0.88,
    touchMultiplier: 1.0,
    infinite: false,
  });

  // Exposed for any future use (e.g. anchor-link scrollTo handoff), same
  // idea as the reference's lenisRef singleton. Not required by anything yet.
  window.__lenis = lenis;

  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    // Single-loop integration: ScrollTrigger recomputes on Lenis scroll,
    // and Lenis is advanced by GSAP's ticker (which passes seconds — Lenis
    // wants ms). lagSmoothing(0) stops GSAP from skipping frames after a
    // stall, which would otherwise desync the two.
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    // Standalone fallback for any page without GSAP.
    var raf = function (time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  // --- Anchor-link handoff (bug fix 2026-07-25) ---
  // While Lenis owns the scroll position, the browser's native hash scrolling
  // doesn't work — so in-page "#..." links (and ad deep links like
  // /#sicherheitsanalyse) never reached the form. Drive Lenis instead.
  function scrollToHash(hash, immediate) {
    if (!hash || hash === "#") return false;
    var target;
    try {
      target = document.querySelector(hash);
    } catch (e) {
      return false; // malformed selector
    }
    if (!target) return false;
    /* A target may advertise how far PAST its own top a jump should land, via
       data-scroll-offset (px). Added 2026-08-03 for #our-system: that section's
       scroll trigger starts at its own top, so landing there is timeline
       progress 0 — an intentionally empty stage, which reads as a broken page to
       someone who arrived by clicking the nav rather than by scrolling in.
       Declarative on purpose: the section that has a pinned timeline is the only
       thing that knows where "already showing something" is, and it sets the
       attribute only while that timeline actually exists (js/system-story.js).
       Anything without the attribute behaves exactly as before. */
    var offset = parseFloat(target.getAttribute("data-scroll-offset"));
    lenis.scrollTo(target, {
      offset: isNaN(offset) ? 0 : offset,
      immediate: !!immediate,
    });
    return true;
  }

  document.addEventListener("click", function (e) {
    var t = e.target;
    var link = t && t.closest ? t.closest('a[href]') : null;
    if (!link) return;
    var url;
    try {
      url = new URL(link.href, window.location.href);
    } catch (err) {
      return;
    }
    // Only same-page hash links — real navigations (other pages) are untouched.
    if (url.origin !== window.location.origin) return;
    if (url.pathname !== window.location.pathname) return;
    if (!url.hash || url.hash === "#") return;
    if (scrollToHash(url.hash, false)) {
      e.preventDefault();
      history.pushState(null, "", url.hash);
    }
  });

  // Deep link that lands with a #hash (e.g. an ad -> /#sicherheitsanalyse):
  // the native jump (if any) happens before Lenis is ready and gets reset, so
  // re-apply it once things are settled.
  if (window.location.hash) {
    window.addEventListener("load", function () {
      setTimeout(function () {
        scrollToHash(window.location.hash, true);
      }, 80);
    });
  }
})();
