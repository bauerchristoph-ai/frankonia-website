/*
  Service-card title marks — /leistungen/ only.

  Client 2026-08-10: "quiero que cuando vayamos escroleando se vayan subrayando
  los títulos de los servicios, no subrayando línea sino el fondo como hemos
  hecho en otras secciones". So this is the SAME mark /werkschutz/ uses in its
  "So läuft es bei FRANKONIA" column (.service-contrast__mark) — a background
  painted behind the words and grown from 0 to full width, not a border.

  Mechanism, and the reason it is worth reading before changing:

    - The fill lives in CSS as `background-size: calc(var(--mark, 0) * 100%) 100%`
      and this script only animates the number. One property, one timeline.
    - ⚠️ .lh-card__mark is FILLED BY DEFAULT (background-size: 100% 100%) and only
      starts at zero once this script adds .lh-services--live. That ordering is
      the whole no-JS contract: a visitor without JS, a crawler, or anyone with
      prefers-reduced-motion sees eleven finished, highlighted titles — never
      eleven unmarked ones. The same trap is documented on .service-contrast__mark,
      whose first build had the wipe in the default state and measured mark=0%
      under forced reduced motion, i.e. the highlight silently disappeared.
    - ONE ScrollTrigger per card, triggered by the CARD, not by the mark. The mark
      is ~200px into the card, so triggering off it would start the wipe long
      after the card has arrived.

  Requires GSAP + ScrollTrigger (loaded before this file) and rides the shared
  GSAP-ticker/Lenis integration from js/smooth-scroll.js.
*/
(function initLhCardMarks() {
  "use strict";

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var section = document.querySelector(".lh-services");
  if (!section) return;

  var marks = gsap.utils.toArray(section.querySelectorAll(".lh-card__mark"));
  if (!marks.length) return;

  gsap.registerPlugin(ScrollTrigger);

  // Only now does the CSS switch the fill from "already done" to "driven by
  // --mark". Nothing above this line can leave a title unmarked.
  section.classList.add("lh-services--live");

  marks.forEach(function (mark) {
    var card = mark.closest(".lh-card") || mark;

    gsap.set(mark, { "--mark": 0 });
    gsap.to(mark, {
      "--mark": 1,
      // Linear: the wipe IS the scroll position, so an ease would make the
      // highlight lag or overshoot the pointer's own progress down the page.
      ease: "none",
      scrollTrigger: {
        trigger: card,
        // Starts as the card comes up and completes with the card comfortably in
        // frame — a range that ended lower would finish the wipe off-screen, the
        // failure the risk-card reveals on /werkschutz/ already paid for once.
        start: "top 88%",
        end: "top 52%",
        scrub: 0.4,
      },
    });
  });
})();
