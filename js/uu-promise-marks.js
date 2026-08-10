/*
  Promise-title marks — /ueber-uns/ only.

  Client 2026-08-10: "subrayá lo importante con el subrayado que se repite en la
  web, de subrayar el fondo de lo más importante". Same mechanism as the
  /leistungen/ service cards (js/lh-card-marks.js) and /werkschutz/'s
  "So läuft es bei FRANKONIA" column (.service-contrast__mark) — a background
  painted behind the words and grown from 0 to full width, not a border. This is
  a second, page-scoped copy of that recipe rather than a shared module yet — see
  lh-card-marks.js's own header for the reasoning the two share; promote to one
  file if a third page ever wants the identical trigger-by-card behaviour.

  Mechanism:
    - The fill lives in CSS as `background-size: calc(var(--mark, 1) * 100%) 100%`
      and this script only animates the number.
    - ⚠️ .uu-promises__mark is FILLED BY DEFAULT and only starts at zero once this
      script adds .uu-promises--live. That ordering is the whole no-JS contract: a
      visitor without JS, a crawler, or anyone with prefers-reduced-motion sees six
      finished, highlighted titles — never six unmarked ones. Same bug class
      .service-contrast__mark's first build shipped and fixed (measured mark=0%
      under forced reduced motion, i.e. the highlight silently vanished).
    - ONE ScrollTrigger for the whole LIST, staggered across the six marks — not
      one per item. See the note at the tween for the measured reason; on a
      two-row grid that fits on one screen, per-item ranges leave the second row
      frozen mid-wipe at the positions a reader parks at.

  Requires GSAP + ScrollTrigger (loaded before this file) and rides the shared
  GSAP-ticker/Lenis integration from js/smooth-scroll.js.
*/
(function initUuPromiseMarks() {
  "use strict";

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var section = document.querySelector(".uu-promises");
  if (!section) return;

  var list = section.querySelector(".uu-promises__list");
  var marks = gsap.utils.toArray(section.querySelectorAll(".uu-promises__mark"));
  if (!list || !marks.length) return;

  gsap.registerPlugin(ScrollTrigger);

  // Only now does the CSS switch the fill from "already done" to "driven by
  // --mark". Nothing above this line can leave a title unmarked.
  section.classList.add("uu-promises--live");

  // ⚠️ ONE TRIGGER ON THE LIST, STAGGERED 01 → 06 — deliberately NOT one trigger
  // per item, which is what /leistungen/ does and what this shipped with first.
  // Per-item triggers are right for a long vertical list, where each card is
  // approached and passed on its own. THIS grid is six items in two rows that fit
  // on one screen together, and there the per-item version had a real defect,
  // measured rather than guessed: with the wipe ending at the item's own
  // "top 55%", row 2 is still ~330px lower than row 1, so at the two positions a
  // reader actually parks at — section top at the viewport top, and section
  // centred — row 2's three marks sat frozen at 56% and 43%, i.e. highlights cut
  // mid-word, which reads as a rendering fault rather than an effect.
  //
  // Driving the whole list from its own box fixes it structurally: the range ends
  // when the LIST's top passes 45% of the viewport, which happens well before the
  // section settles into frame, so every mark is complete whenever the section is
  // sitting still. The stagger is what keeps the 01 → 06 sequence.
  gsap.set(marks, { "--mark": 0 });
  gsap.to(marks, {
    "--mark": 1,
    // Linear: the wipe IS the scroll position, so an ease would make the
    // highlight lag or overshoot the pointer's own progress down the page.
    ease: "none",
    stagger: { each: 0.12 },
    scrollTrigger: {
      trigger: list,
      start: "top 85%",
      end: "top 45%",
      scrub: 0.4,
    },
  });
})();
