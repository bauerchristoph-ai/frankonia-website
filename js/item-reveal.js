/*
  Item reveal — staggered, scroll-scrubbed entrance for repeated homepage
  content blocks (lists / card grids). The list-level companion to the
  per-character title reveal (js/title-reveal.js): same smooth,
  scroll-driven, Lenis-synced feel, but each item animates as ONE unit
  (icon + title + text move together) — never split into letters.

  Per item: opacity 0->1, y 24px->0, filter blur(6px)->0, ease power2.out,
  with a small per-item stagger. ONE ScrollTrigger per group (the fromTo's
  own trigger, scrubbed between "top 88%" and "top 60%") — never one
  trigger per item, so a 10-item list is a single timeline, not 10
  triggers. Added 2026-07-22 (client request).

  Opt-in per group via a data attribute on the CONTAINER:
    <ul data-item-reveal=".pillar-card"> ... </ul>
  The attribute value is a CSS selector for the items, resolved WITHIN the
  container. An empty value falls back to the container's direct children.
  Using an explicit selector everywhere keeps non-item children (e.g. the
  Services preview panel) out of the animation.

  Requires GSAP core + ScrollTrigger (self-hosted, loaded before this file)
  and rides the same GSAP-ticker/Lenis integration set up by
  js/smooth-scroll.js.

  JS-only-ever-enhances, same contract as every other motion primitive
  here: the opacity:0 / blur / y-offset start state is applied ONLY by GSAP
  at runtime. A no-JS visitor, a crawler, or prefers-reduced-motion all see
  the items fully visible and in place — nothing in CSS hides them. Groups
  that already have their own bespoke scroll animation (Pain Hook's patrol
  journey, "Our System"'s active/dim panels) are deliberately NOT given
  this, to avoid duplicate/conflicting ScrollTriggers on the same elements.
*/

(function initItemReveal() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll("[data-item-reveal]").forEach((group) => {
    const selector = group.getAttribute("data-item-reveal").trim();
    const items = selector
      ? group.querySelectorAll(selector)
      : group.querySelectorAll(":scope > *");
    if (!items.length) return;

    gsap.fromTo(
      items,
      { opacity: 0, y: 24, filter: "blur(6px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: group,
          start: "top 88%",
          end: "top 60%",
          scrub: 0.5,
        },
      }
    );
  });
})();
