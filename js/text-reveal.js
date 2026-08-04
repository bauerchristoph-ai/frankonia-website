/*
  text-reveal.js — a general, gentle scroll-entrance for the remaining body
  TEXT across the page (paragraphs, sub-headings, list items, blockquotes) that
  isn't already animated by a more specific system (client 2026-07-29: "los
  textos tienen que tener ese efecto aplicado").

  Same smooth feel as js/item-reveal.js's subtle preset — opacity 0->1, y 20->0,
  blur(6px)->0, power2.out — but per element (batched), so a single paragraph
  that isn't part of a list/grid still eases in. Uses ScrollTrigger.batch (one
  observer for all of them, not one trigger each) and reuses the site's single
  GSAP + ScrollTrigger + Lenis loop — no new GSAP/Lenis/RAF/DOMContentLoaded.

  CONFLICT-FREE BY CONSTRUCTION: every element already owned by another motion
  system is skipped via .closest(BLOCK) — hero (hero-reveal), section <h2>s
  (title-reveal), data-reveal groups, data-item-reveal lists, and the bespoke
  scroll sections (sticky-story metrics, pain-hook journey, system-story,
  konzept-seq), plus the logo marquee and site chrome. <h1>/<h2> are never
  targeted (owned by hero-reveal / title-reveal). Add [data-no-text-reveal] to
  any element/wrapper to opt a subtree out.

  JS-ONLY-EVER-ENHANCES, same contract as every other reveal here:
    - the opacity:0 start state is applied ONLY by this script, at runtime, and
      ONLY to elements currently below the fold — anything already on screen at
      load is never touched, so nothing above the fold can flash or hide;
    - no JS / reduced-motion / missing ScrollTrigger => every text stays fully
      visible and in place (crawlers included);
    - a 4s per-batch fallback force-reveals anything the observer never fired
      for, so a layout/observer edge case can't leave text hidden.
*/

(function () {
  "use strict";

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(ScrollTrigger);

  // Text elements worth easing in — block-level copy only. h1/h2 are owned by
  // hero-reveal / title-reveal, so they're deliberately excluded.
  var SELECTOR = "main p, main h3, main h4, main li, main blockquote, main figcaption";

  // Anything inside one of these already animates (or must never be hidden).
  var BLOCK = [
    "[data-reveal]",
    "[data-item-reveal]",
    "[data-no-text-reveal]",
    "[data-sticky-story]",
    "[data-system-story]",
    "[data-konzept-seq]",
    ".pain-hook",
    ".hero",
    "[data-hero-reveal]",
    ".story-logos",
    ".site-header",
    ".site-footer",
  ].join(",");

  var candidates = Array.prototype.slice.call(document.querySelectorAll(SELECTOR));
  var els = candidates.filter(function (el) {
    // Skip if owned by another system / opted out.
    if (el.closest(BLOCK)) return false;
    // Skip empty / whitespace-only nodes.
    if (!el.textContent || !el.textContent.trim()) return false;
    // Only animate what's currently below the fold — never hide on-screen text.
    return el.getBoundingClientRect().top > window.innerHeight * 0.85;
  });
  if (!els.length) return;

  gsap.set(els, { opacity: 0, y: 20, filter: "blur(6px)" });

  function reveal(batch) {
    gsap.to(batch, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.7,
      ease: "power2.out",
      stagger: 0.08,
      overwrite: "auto",
    });
  }

  ScrollTrigger.batch(els, {
    start: "top 90%",
    once: true,
    onEnter: reveal,
  });

  // Safety net: force-reveal anything still hidden after 4s (observer never
  // fired, e.g. an element inside a transformed ancestor).
  window.setTimeout(function () {
    var stuck = els.filter(function (el) { return gsap.getProperty(el, "opacity") < 1; });
    if (stuck.length) gsap.set(stuck, { opacity: 1, y: 0, filter: "blur(0px)" });
  }, 4000);
})();
