/*
  svg-draw.js — an inline SVG's line work draws itself as it scrolls into view.

  Client 2026-08-06, for risk card 03's supplied illustration on /werkschutz/
  ("me podés aplicar el mismo efecto al diagrama de Diebstahl im und um den
  Betrieb, solo a ese de los 4, que vaya formando las líneas"). Scoped by the
  attribute, so it is one card and nothing else.

  MARKUP CONTRACT
    <svg data-svg-draw aria-hidden="true"> … </svg>
  Optional:
    data-svg-draw-start / data-svg-draw-end   ScrollTrigger start/end strings.

  Only elements that carry a real `stroke` are ever touched, and each is dashed by
  its OWN getTotalLength() — never a shared constant, the same rule
  js/service-contrast.js and js/steps-sequence.js follow. Filled shapes are left
  alone on purpose: a dash offset on a fill does nothing, and in this drawing the
  fills are hidden-line occlusion (they hide edges behind crates and the truck
  body), so they must keep painting from the first frame or the drawing shows
  through itself.

  The stagger is a TOTAL spread (`amount`), not a per-element delay: this drawing
  has 51 strokes against a small icon's 10, and a fixed per-element delay would
  make the same effect last five times longer here. One value, any path count.

  JS-ONLY-EVER-ENHANCES, same contract as every other motion primitive here:
  nothing in CSS dashes anything. The dash is written by GSAP at runtime and only
  inside the branch that is about to animate it away, and it is cleared on
  completion so a finished drawing carries no inline style of ours. No JS, a script
  error, prefers-reduced-motion or a crawler that does not run JS all get the
  complete artwork.

  Requires GSAP + ScrollTrigger, loaded before this file.

  NOTE: js/steps-sequence.js does the same thing for a step's icon, but from inside
  its own step timeline, which is why it cannot just call this. If a third case
  turns up, extract the measure-and-dash helper rather than writing it a third time.
*/

(function initSvgDraw() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var svgs = document.querySelectorAll("[data-svg-draw]");
  if (!svgs.length) return;

  gsap.registerPlugin(ScrollTrigger);

  Array.prototype.forEach.call(svgs, function (svg) {
    var strokes = Array.prototype.filter.call(
      svg.querySelectorAll("path, rect, circle, ellipse, line, polyline, polygon"),
      function (el) {
        var s = el.getAttribute("stroke");
        return (
          s && s !== "none" && typeof el.getTotalLength === "function" && el.getTotalLength() > 0
        );
      }
    );
    if (!strokes.length) return;

    gsap.fromTo(
      strokes,
      {
        strokeDasharray: function (i, el) {
          return el.getTotalLength();
        },
        strokeDashoffset: function (i, el) {
          return el.getTotalLength();
        },
      },
      {
        strokeDashoffset: 0,
        duration: 0.5,
        ease: "power1.inOut",
        stagger: { amount: 0.9 },
        scrollTrigger: {
          trigger: svg,
          // Deliberately LATER than the card's own reveal. The grid uses
          // data-item-reveal-strong, which scrubs a 10px blur and a scale until the
          // card's bottom reaches 60% of the viewport — drawing underneath that
          // would spend the effect behind a blur.
          start: svg.getAttribute("data-svg-draw-start") || "top 62%",
          end: svg.getAttribute("data-svg-draw-end") || "bottom 45%",
          scrub: 0.6,
        },
        onComplete: function () {
          strokes.forEach(function (el) {
            el.style.strokeDasharray = "";
            el.style.strokeDashoffset = "";
          });
        },
      }
    );
  });
})();
