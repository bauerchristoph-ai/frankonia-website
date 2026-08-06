/*
  jobs-steps.js — the "In drei Schritten zu deinem neuen Job" sequence
  (/jobs/, .jobs-steps).

  Client 2026-08-05: "quiero que sea más smooth la aparición: aparece el 1,
  después la rayita se va formando hacia el dos (que aparece ahí) y después
  rayita nuevamente y el 3 […] después abajo van apareciendo".

  So the section plays as one ordered timeline instead of a card cascade — one
  beat per step, number and its own copy together (client, third pass):

      (1) ──────> (2) ──────> (3)     marker lands, its title + text rise in
       ▲            ▲            ▲    under it, then the connector draws on
      text        text        text

  SCRUBBED TO THE SCROLL (client 2026-08-05, second pass: "está perfecto pero
  tiene que aparecer con el scroll, onda relacionado al scroll").
  The choreography above is unchanged — what changed is what drives it. It first
  shipped as a timeline that PLAYED itself once on entry, on the reasoning that a
  sequence with its own internal order should not hand that order to how fast the
  visitor happens to scroll. The client wants it tied to the scroll, so it is:
  `scrub`, no `once`, and it runs backwards when you scroll back up, like every
  other reveal on this page (item-reveal, text-reveal).

  Two things make the sequence survive being scrubbed, and both are load-bearing:
    - the RANGE is half a viewport (start "top 88%" → end "top 38%"), so the rail
      has real scroll distance to draw across instead of completing in the first
      few pixels;
    - `scrub: 0.7` is a smoothing lag, not a delay: on a fast flick the timeline
      eases toward the scroll position over 0.7s rather than snapping to it, so
      the numbers still land one after the other instead of all at once — which
      was the whole worry about scrubbing this section.
  The order itself needs no defending: progress through the timeline IS the order,
  so 1 → line → 2 → line → 3 → copy holds at any scroll speed.

  THE CONNECTOR IS A PSEUDO-ELEMENT, so it is animated through a CUSTOM
  PROPERTY: `--step-line` on the step, which .jobs-steps__item::before consumes
  as `scaleX()` on desktop and `scaleY()` on a phone (page-jobs.css). One value,
  two axes — the same timeline draws a horizontal rail at >=768px and a vertical
  one below it, with no branching here. It defaults to 1 in the CSS, so a fully
  drawn line is the no-JS state.

  JS-ONLY-EVER-ENHANCES, same contract as every other motion primitive here:
  nothing in CSS hides any of this. The start state (opacity 0, the collapsed
  line) is written by GSAP at runtime, and only inside the branch that is about
  to animate it back. No JS, a script error, prefers-reduced-motion or a crawler
  that does not run JS all get the finished section: three numbers, two lines,
  all copy.

  Requires GSAP + ScrollTrigger (loaded before this file) and rides the shared
  ticker/Lenis integration from js/smooth-scroll.js. The list carries
  data-no-text-reveal and NO data-item-reveal, so this is the only thing
  animating these elements — two timelines on one element is what makes a reveal
  look broken.
*/

(function initJobsSteps() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var list = document.querySelector("[data-steps-sequence]");
  if (!list) return;

  var steps = Array.prototype.slice.call(
    list.querySelectorAll(".jobs-steps__item")
  );
  if (steps.length < 2) return;

  gsap.registerPlugin(ScrollTrigger);

  var timeline = gsap.timeline({
    scrollTrigger: {
      trigger: list,
      // Starts as the row comes into view and finishes with it just above the
      // middle of the screen: half a viewport of scroll for the whole sequence.
      // Shorter than this and the rail draws itself in the first flick; longer
      // and step 3 is still empty when the section is centred.
      start: "top 88%",
      end: "top 38%",
      // Smoothing lag, not a delay — see the note at the top of this file. Also
      // what makes scrolling back up un-draw the rail smoothly rather than
      // snapping it.
      scrub: 0.7,
    },
  });

  // ---- One beat per step: number, its own copy, then the line onward -------
  // Client 2026-08-05 (third pass): "quiero que los textos aparezcan con su
  // número correspondiente en vez de aparecer al final… aparece el 1 y debajo ya
  // el texto también, cuando aparece el 2 aparece el texto y así."
  // The copy used to be one staggered block queued after the whole rail. Each
  // step now owns its own copy, so a step is complete before the rail moves on —
  // which also means the visitor reads step 1 while step 2 is still drawing,
  // instead of watching three empty markers first.
  steps.forEach(function (step, i) {
    var number = step.querySelector(".jobs-steps__number");
    var copy = step.querySelectorAll("h3, p");
    var isLast = i === steps.length - 1;

    if (number) {
      timeline.fromTo(
        number,
        { opacity: 0, scale: 0.55 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.42,
          // A touch of overshoot so the marker LANDS rather than fades in. The
          // only bounce on this page, and it is 1.4 — not a cartoon 4.
          ease: "back.out(1.4)",
        }
      );
    }

    if (copy.length) {
      timeline.fromTo(
        copy,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.08,
        },
        // Overlaps the marker's landing: the number and the text under it should
        // read as one arrival, not as two things queued back to back.
        "-=0.3"
      );
    }

    // The line to the NEXT number, so the last step draws nothing — the same
    // rule the CSS follows with :not(:last-child). It starts while this step's
    // copy is still settling, so the rail never visibly stops and waits.
    if (!isLast) {
      timeline.fromTo(
        step,
        { "--step-line": 0 },
        { "--step-line": 1, duration: 0.5, ease: "power2.inOut" },
        "-=0.22"
      );
    }
  });
})();
