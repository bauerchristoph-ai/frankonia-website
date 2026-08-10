/*
  case-cards.js — the four Anwendungsfälle cards arrive as they scroll into view, and each
  card's illustration draws its own line work once it has landed.

  Client brief 2026-08-08 (the section redesign): "as each card enters the viewport,
  opacity 0 → 1, translateY 30–40px → 0, scale 0.98 → 1, duration around 0.6–0.8s, smooth
  easing, stagger the cards slightly, do not use aggressive movement."

  REPLACES js/case-timeline.js, which drove a central spine and staggered the cases along
  it. The spine is gone with the redesign, so the scrubbed timeline that existed to draw it
  went too. That file is in git.

  NOT SCRUBBED. The brief specifies a duration, which is a statement about time, not about
  scroll distance — so each card plays once, on entry, and never re-runs. That also means a
  visitor who scrolls back up does not watch the section rebuild itself.

  MARKUP CONTRACT
    <ol data-case-cards data-no-text-reveal>
      <li>…a case: its illustration and its text…
  The list must carry `data-no-text-reveal` and must NOT carry `data-item-reveal`: two
  timelines on one element is what makes a reveal look broken.

  ⚠️ THE CARDS CARRY A RESTING TRANSFORM. The even column sits 28px lower (CSS), and hover
  moves them too — so this animates `y` and `scale` via GSAP while CSS owns `translateY`
  on the same elements, and the two would overwrite each other. Resolved by animating the
  card's own CSS custom properties instead of its transform: GSAP writes --card-y and
  --card-s, the stylesheet composes them with the resting offset. Nothing here ever touches
  the `transform` property.

  Each card's ILLUSTRATION draws itself after the card has landed — the same technique
  js/svg-draw.js and js/steps-sequence.js use, and the same rules: one tween per scene with
  function-based values so every path is dashed by its OWN getTotalLength(), a TOTAL-spread
  stagger (`amount`) so a 99-path scene does not take five times longer than a 66-path one,
  and the inline dash cleared on completion so a finished drawing carries no style of ours.
  Paths that already own a `stroke-dasharray` are skipped — see js/svg-draw.js for why a
  dash-draw and a designed dash pattern cannot share a path. (None of these four has one;
  the guard is there so a future scene that does will not break.)

  JS-ONLY-EVER-ENHANCES: `.service-cases__grid--live` is added only from here and is the
  only thing that hides a card. No JS, a script error, a crawler or prefers-reduced-motion
  all get the finished section — four cards, four complete drawings.

  Requires GSAP + ScrollTrigger, loaded before this file.
*/

(function initCaseCards() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var lists = document.querySelectorAll("[data-case-cards]");
  if (!lists.length) return;

  gsap.registerPlugin(ScrollTrigger);

  Array.prototype.forEach.call(lists, function (list) {
    var cards = Array.prototype.filter.call(list.children, function (el) {
      return el.nodeType === 1;
    });
    if (!cards.length) return;

    // From here on the CSS may hide the cards, because this script will resolve them.
    list.classList.add("service-cases__grid--live");

    cards.forEach(function (card, i) {
      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          once: true,
        },
        // The stagger: a card set 0.08s behind the one before it. Small on purpose —
        // with two per row, a longer offset reads as the right-hand card lagging rather
        // than as rhythm.
        delay: i * 0.08,
      });

      tl.fromTo(
        card,
        { opacity: 0, "--card-y": "34px", "--card-s": 0.98 },
        {
          opacity: 1,
          "--card-y": "0px",
          "--card-s": 1,
          duration: 0.7,
          // The project's own premium curve (--easing-premium): expo-out, no overshoot.
          ease: "expo.out",
        }
      );

      // --- and its illustration draws itself ------------------------------------
      var scene = card.querySelector("[data-case-draw]");
      if (!scene) return;
      var strokes = [];
      Array.prototype.forEach.call(
        scene.querySelectorAll("path, rect, circle, ellipse, line, polyline, polygon"),
        function (el) {
          var st = el.getAttribute("stroke");
          if (!st || st === "none") return;
          if (typeof el.getTotalLength !== "function" || el.getTotalLength() <= 0) return;
          var own = el.getAttribute("stroke-dasharray");
          if (own && own !== "none" && own !== "0") return;
          strokes.push(el);
        }
      );
      if (!strokes.length) return;

      tl.fromTo(
        strokes,
        {
          strokeDasharray: function (i2, el) {
            return el.getTotalLength();
          },
          strokeDashoffset: function (i2, el) {
            return el.getTotalLength();
          },
        },
        {
          strokeDashoffset: 0,
          duration: 0.9,
          ease: "power1.inOut",
          stagger: { amount: 0.5 },
          onComplete: function () {
            strokes.forEach(function (el) {
              el.style.strokeDasharray = "";
              el.style.strokeDashoffset = "";
            });
          },
        },
        // Overlaps the tail of the card's own arrival rather than queueing after it: the
        // card is visually settled well before its 0.7s is up (expo.out reaches its end
        // value early), so waiting for the number would leave a beat of blank frame.
        0.35
      );
    });
  });
})();
