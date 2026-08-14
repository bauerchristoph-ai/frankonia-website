/*
  sticky-story.js — Trust band (metrics + client logos).

  REWRITTEN 2026-07-29 alongside the CSS: the old 3-scene sticky choreography
  (coverage-map parallax, pin pop-ins, half-panel entrance parallax, value-card
  reveals) was removed with that structure. What remains is a plain full-width
  section, so this script now only does two light enhancements:

    - Count-up on the metric numbers as they scroll into view (decimal-aware
      4.7, locale thousands grouping).
    - A one-time staggered fade/rise on the metrics as the row enters.

  Same self-initialising deferred IIFE pattern as the other motion files. Reuses
  the site's single GSAP + ScrollTrigger. JS-only-ever-enhances: every metric and
  logo is fully readable with no JS / reduced-motion / mobile — nothing here
  gates visibility.
*/

(function () {
  "use strict";

  var root = document.querySelector("[data-sticky-story]");
  if (!root) return;

  initCounters(root);
  initMetricsReveal(root);

  // ---- Metric count-up ------------------------------------------------------
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
    // Slower + smoother count-up (client 2026-07-29: "un poquito más lento").
    var duration = 2000;
    var start = performance.now();
    // de-DE → "1.000.000", en-US → "1,000,000" — shared by both homepages.
    var locale = document.documentElement.lang === "de" ? "de-DE" : "en-US";
    function tick(now) {
      var p = Math.min((now - start) / duration, 1);
      // easeOutQuart — gentler, longer glide into the final value than the
      // previous cubic ease.
      var eased = 1 - Math.pow(1 - p, 4);
      var v = target * eased;
      // toLocaleString on BOTH branches, not just the integer one. toFixed always
      // emits a PERIOD, so on this de-DE page the Google rating counted up to "4.7"
      // and overwrote the "4,7" the markup ships — the visible half of the client's
      // G5 report (2026-08-14). Pinning min/max fraction digits to `decimals` rounds
      // the integer case exactly as Math.round did, so 300+ / 1.000.000+ / 10+ are
      // byte-identical to before; the rating is the only counter with decimals.
      var text = v.toLocaleString(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
      node.textContent = text + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ---- Metrics entrance (staggered fade/rise, plays once) -------------------
  function initMetricsReveal(el) {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var items = el.querySelectorAll(".sticky-story__metric");
    if (!items.length) return;

    gsap.registerPlugin(ScrollTrigger);
    gsap.from(items, {
      opacity: 0,
      y: 32,
      filter: "blur(8px)",
      ease: "power3.out",
      duration: 0.7,
      stagger: 0.12,
      scrollTrigger: {
        trigger: el.querySelector(".sticky-story__metrics") || el,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  }
})();
