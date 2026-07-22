/*
  Trust proof diagram — scroll-driven reveal for the #trust-metrics section
  (client redesign 2026-07-22). One scrubbed GSAP/ScrollTrigger timeline
  draws the vertical line, pops the node, draws the three branches, then
  reveals each metric's number and label. Rides the existing Lenis + GSAP
  ticker integration set up by js/smooth-scroll.js — no second Lenis, no
  second rAF loop, one ScrollTrigger, not pinned.

  JS-only-ever-enhances, same contract as every other motion primitive here:
  the hidden "from" state (undrawn strokes, opacity:0 metrics) is applied
  ONLY from inside this script, and only when motion is enabled. A no-JS
  visitor, a crawler, or prefers-reduced-motion all see the finished diagram
  and the real metric text immediately — nothing in CSS hides any of it.

  Desktop draws the full branch diagram; on mobile the branching SVG is
  display:none (a simplified vertical sequence, styled in page-home.css), so
  the stroke draw is skipped there and only the metrics animate. Requires
  GSAP core + ScrollTrigger (self-hosted, loaded before this file).
*/

(function initTrustDiagram() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  const diagram = document.querySelector("[data-trust-diagram]");
  if (!diagram) return;

  // Reduced motion / no timeline: everything stays fully visible (default).
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(ScrollTrigger);

  const linesEl = diagram.querySelector(".trust-diagram__lines");
  const line = diagram.querySelector(".trust-diagram__line");
  const branches = diagram.querySelectorAll(".trust-diagram__branch");
  const node = diagram.querySelector(".trust-diagram__node");
  const numbers = diagram.querySelectorAll(".trust-diagram__metrics .stat__value");
  const labels = diagram.querySelectorAll(".trust-diagram__metrics .stat__label");

  // Only draw the SVG strokes when the branch diagram is actually shown
  // (desktop). On mobile .trust-diagram__lines is display:none, where
  // getTotalLength() is unreliable — so we skip strokes there and animate
  // only the metrics.
  const drawLines =
    linesEl &&
    getComputedStyle(linesEl).display !== "none" &&
    line;

  const strokePaths = drawLines ? [line, ...branches] : [];

  // "From" state — JS only, so no-JS/reduced-motion never see it.
  strokePaths.forEach((p) => {
    const len = p.getTotalLength();
    gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
  });
  if (drawLines && node) {
    gsap.set(node, { scale: 0, opacity: 0, transformOrigin: "center center" });
  }
  gsap.set(numbers, { opacity: 0, y: 18, filter: "blur(4px)" });
  gsap.set(labels, { opacity: 0, y: 18, filter: "blur(4px)" });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: diagram,
      start: "top 78%",
      end: "bottom 62%",
      scrub: 0.8,
    },
  });

  // Sequence: 1) vertical line draws, 2) node pops, 3) branches draw,
  // 4) numbers reveal, 5) labels reveal (just after their numbers).
  if (drawLines) {
    tl.to(line, { strokeDashoffset: 0, ease: "none", duration: 1.2 });
    if (node) {
      tl.to(node, { scale: 1, opacity: 1, ease: "power2.out", duration: 0.4 }, ">-0.1");
    }
    tl.to(branches, { strokeDashoffset: 0, ease: "none", duration: 1, stagger: 0.15 }, ">");
  }

  tl.to(
    numbers,
    { opacity: 1, y: 0, filter: "blur(0px)", ease: "power2.out", duration: 0.6, stagger: 0.12 },
    drawLines ? ">-0.1" : 0
  );
  tl.to(
    labels,
    { opacity: 1, y: 0, filter: "blur(0px)", ease: "power2.out", duration: 0.5, stagger: 0.12 },
    "<+0.15"
  );
})();
