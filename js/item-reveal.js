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

    // "strong" preset — opt-in via data-item-reveal-strong on the container
    // (client request 2026-07-23: the Services list rows should reveal
    // "mientras escrolleamos, de una forma muy smooth" — more pronounced and
    // more sequential than the default). Bigger slide + blur + a slight scale,
    // a larger per-item stagger, and a LONGER scrubbed range (down to the
    // group's bottom) so the rows come in one-by-one across the scroll-through
    // rather than all at once. Everything else (e.g. the outfit-name list)
    // keeps the original subtle values. Same JS-only-ever-enhances contract:
    // the start state is applied only here at runtime; no CSS hides anything.
    const strong = group.hasAttribute("data-item-reveal-strong");

    // PER-ITEM MODE — opt-in via data-item-reveal-each (client 2026-08-07, on
    // /werkschutz/'s risk cards: "quiero que aparezcan un poco antes las cards…
    // si no escroleo y terminan apareciendo muy tarde").
    //
    // The default below is ONE timeline whose range spans the whole GROUP, which
    // is right for a single row or a short list but breaks down on a tall
    // multi-row grid: the range is as tall as the grid, so the second row only
    // reveals near the end of it. Measured on the risk grid (4 cards, ~1150px):
    // card 3 finished with its own top 122px ABOVE the viewport. Per item, each
    // card is triggered by ITSELF, so it always arrives at the same point in its
    // own approach no matter which row it is in.
    //
    // Same preset values, same scrub, no stagger (a per-item trigger IS the
    // stagger), and the same JS-only-ever-enhances contract.
    const each = group.hasAttribute("data-item-reveal-each");
    // Per-group start/end overrides. `end` has been here since 2026-07-28 (the
    // outfit-name list finished too late); `start` is the symmetric lever, added
    // 2026-08-07 for the same reason in the other direction.
    const startAttr = group.getAttribute("data-item-reveal-start");
    const endAttr = group.getAttribute("data-item-reveal-end");

    const from = {
      opacity: 0,
      y: strong ? 48 : 24,
      scale: strong ? 0.97 : 1,
      filter: strong ? "blur(10px)" : "blur(6px)",
    };
    const to = {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      ease: strong ? "power3.out" : "power2.out",
    };

    // ⚠️ DROP THE FILTER ONCE THE ITEM IS FULLY REVEALED. `filter: blur(0px)` is not
    // free: any filter other than `none` keeps the element on its own compositing
    // layer, blurring nothing, for the rest of the visit. Measured on the German
    // homepage (2026-08-08, client: it "se tranca un poco" going past the map): 116
    // elements sat on a leftover filter, and the page's 3s trace was spending 2678ms
    // in Layerize. The sibling half of that bug was js/title-reveal.js's permanent
    // will-change — see the long note there for the numbers.
    //
    // Only on `onLeave`, and that is the safe edge on purpose: it fires at the END of
    // the range, where the item is already at opacity 1 / blur 0 / no offset — i.e.
    // exactly the CSS resting state, so removing the inline styles changes nothing on
    // screen. Doing the same at `onLeaveBack` would strip a start state that is
    // `opacity: 0` and make unrevealed content flash into view.
    //
    // Re-entering from below is fine: the scrub re-renders the tween, which writes
    // the properties again from scratch.
    const drop = (targets) => ({
      onLeave: () => gsap.set(targets, { clearProps: "filter,willChange" }),
    });

    if (each) {
      items.forEach((item) => {
        gsap.fromTo(item, from, {
          ...to,
          scrollTrigger: {
            trigger: item,
            start: startAttr || (strong ? "top 85%" : "top 88%"),
            end: endAttr || (strong ? "top 55%" : "top 60%"),
            scrub: strong ? 0.6 : 0.5,
            ...drop(item),
          },
        });
      });
      return;
    }

    gsap.fromTo(items, from, {
      ...to,
      stagger: strong ? 0.16 : 0.1,
      scrollTrigger: {
        trigger: group,
        start: startAttr || (strong ? "top 85%" : "top 88%"),
        end: endAttr || (strong ? "bottom 60%" : "top 60%"),
        scrub: strong ? 0.6 : 0.5,
        ...drop(items),
      },
    });
  });
})();
