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
    - ONE ScrollTrigger per card, triggered by the ITEM, not by the mark — the
      mark sits inside the title, itself well into the card, so triggering off it
      would start the wipe after the card has already settled.

  Requires GSAP + ScrollTrigger (loaded before this file) and rides the shared
  GSAP-ticker/Lenis integration from js/smooth-scroll.js.
*/
(function initUuPromiseMarks() {
  "use strict";

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var section = document.querySelector(".uu-promises");
  if (!section) return;

  var marks = gsap.utils.toArray(section.querySelectorAll(".uu-promises__mark"));
  if (!marks.length) return;

  gsap.registerPlugin(ScrollTrigger);

  // Only now does the CSS switch the fill from "already done" to "driven by
  // --mark". Nothing above this line can leave a title unmarked.
  section.classList.add("uu-promises--live");

  marks.forEach(function (mark) {
    var item = mark.closest(".uu-promises__item") || mark;

    gsap.set(mark, { "--mark": 0 });
    gsap.to(mark, {
      "--mark": 1,
      // Linear: the wipe IS the scroll position, so an ease would make the
      // highlight lag or overshoot the pointer's own progress down the page.
      ease: "none",
      scrollTrigger: {
        trigger: item,
        start: "top 88%",
        end: "top 55%",
        scrub: 0.4,
      },
    });
  });
})();
