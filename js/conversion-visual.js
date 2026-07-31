/*
  Conversion "diagnostic-flow" visual (client brief 2026-07-26). Animates the
  inline SVG in the free-analysis section's left (black) panel — current setup
  → risk review → next steps, i.e. confusion → analysis → clarity — ONCE as the
  section scrolls into view.

  Reuses the page's EXISTING motion infrastructure and adds nothing global:
    - GSAP core + ScrollTrigger are already loaded (self-hosted) before this
      file; we only read the `gsap` / `ScrollTrigger` globals — no second load.
    - No Lenis instance, no extra RAF loop, no extra DOMContentLoaded: this is a
      plain deferred IIFE, same pattern as title-reveal.js / sticky-story.js. It
      rides the single GSAP ticker <-> Lenis binding that js/smooth-scroll.js
      already set up.
    - No ScrollTrigger pin. One non-scrubbed timeline, plays once on enter
      (toggleActions "play none none none"); stays completed on reverse scroll.

  JS-only-ever-enhances: the SVG is a complete, static diagram in the raw markup.
  This script applies the hidden START state (dashed lines, scaled-out nodes,
  faded labels) and then reveals it. Gated via gsap.matchMedia() to
  "(min-width: 768px) and (prefers-reduced-motion: no-preference)", so a no-JS
  visitor, a crawler, prefers-reduced-motion, and mobile all just see the
  finished diagram (the brief's "simplified static mobile version"); matchMedia
  auto-reverts the start state if the viewport crosses below 768px.

  Only compositor-friendly properties are animated (strokeDashoffset for the
  line draw-in, transform scale + opacity for nodes/labels) — no layout thrash.
*/

(function initConversionVisual() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  var svg = document.querySelector("[data-conversion-diagram]");
  if (!svg) return;

  gsap.registerPlugin(ScrollTrigger);

  var visual = svg.closest(".conversion__visual") || svg.parentNode;
  var frags = svg.querySelectorAll("[data-diag-frag]");
  var inLines = svg.querySelectorAll("[data-diag-in]");
  var outLines = svg.querySelectorAll("[data-diag-out]");
  var greyNodes = svg.querySelectorAll("[data-diag-node]");
  var diagNode = svg.querySelector("[data-diag-diag]");
  var endNodes = svg.querySelectorAll("[data-diag-end]");
  var caption = visual.querySelector(".conversion__visual-caption");
  var labelsWrap = visual.querySelector(".conversion__visual-labels");
  var labels = visual.querySelectorAll(".conversion__visual-labels span");

  function toArray(nodeList) {
    return Array.prototype.slice.call(nodeList);
  }
  var allLines = toArray(frags).concat(toArray(inLines), toArray(outLines));
  var allNodes = toArray(greyNodes);
  if (diagNode) allNodes.push(diagNode);
  allNodes = allNodes.concat(toArray(endNodes));
  var allText = toArray(labels);
  if (caption) allText.push(caption);

  var mm = gsap.matchMedia();

  mm.add(
    "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    function () {
      // Hidden start state — set only here, so the static markup is untouched
      // for no-JS / reduced-motion / mobile.
      allLines.forEach(function (line) {
        var len = line.getTotalLength();
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap.set(allNodes, { transformOrigin: "50% 50%", scale: 0, opacity: 0 });
      gsap.set(allText, { opacity: 0, y: 6 });
      // Hide the label underlines until the labels step (CSS wipes them in).
      if (labelsWrap) labelsWrap.classList.add("is-pending");

      // One timeline, ~1.8s, smooth easing, no bounce/overshoot.
      var tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: visual,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });

      // Caption fades in early, quietly.
      if (caption) tl.to(caption, { opacity: 1, y: 0, duration: 0.5 }, 0.1);

      // 1. base grey lines draw in, left -> right (fragments, then inputs).
      tl.to(frags, { strokeDashoffset: 0, duration: 0.5, stagger: 0.08 }, 0.1);
      tl.to(inLines, { strokeDashoffset: 0, duration: 0.7, stagger: 0.1 }, 0.2);

      // 2. small current-setup nodes appear with subtle scale/opacity.
      tl.to(greyNodes, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.06 }, 0.6);

      // 3. central diagnostic node activates in FRANKONIA blue.
      if (diagNode) tl.to(diagNode, { scale: 1, opacity: 1, duration: 0.45 }, 0.95);

      // 4. the three output lines resolve cleanly.
      tl.to(outLines, { strokeDashoffset: 0, duration: 0.6, stagger: 0.1 }, 1.1);

      // 5. the three blue outcome endpoints appear.
      if (endNodes.length) tl.to(endNodes, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.08 }, 1.5);

      // 6. labels fade in subtly, and their underlines wipe in (CSS transition
      //    triggered by removing .is-pending).
      if (labels.length) tl.to(labels, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, 1.45);
      if (labelsWrap) tl.call(function () { labelsWrap.classList.remove("is-pending"); }, null, 1.55);

      // Cleanup when the query stops matching: drop every inline style this
      // context set so the plain static diagram returns.
      return function () {
        gsap.set(allLines.concat(allNodes, allText), { clearProps: "all" });
        if (labelsWrap) labelsWrap.classList.remove("is-pending");
      };
    }
  );
})();
