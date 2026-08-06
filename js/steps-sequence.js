/*
  steps-sequence.js — an ordered step timeline, scrubbed to the scroll.

  The choreography is the one the client approved on /jobs/ ("In drei Schritten zu
  deinem neuen Job") and asked for again on /werkschutz/'s Sicherheitskonzept
  section (2026-08-05: "animá los puntos […] igual que como animás los puntos de la
  sección de Karriere, así conectados al scroll y todo lo mismo"):

      (1) ──────> (2) ──────> (3)     the marker lands, its own copy rises in
       ▲            ▲            ▲    under it, then the connector draws onward
      copy        copy        copy

  One beat per step — marker and its copy arrive together, so the visitor reads
  step 1 while step 2 is still drawing, instead of watching three empty markers.

  SCRUBBED, not played once. Two things make a sequence survive being scrubbed and
  both are load-bearing:
    - the RANGE is half a viewport (start "top 88%" → end "top 38%"), so the rail
      has real scroll distance to draw across instead of finishing in the first
      few pixels;
    - `scrub: 0.7` is a smoothing lag, not a delay: on a fast flick the timeline
      eases toward the scroll position over 0.7s rather than snapping, so the
      markers still land one after another instead of all at once.
  The order needs no defending: progress through the timeline IS the order, so
  1 → line → 2 → line → 3 holds at any scroll speed, and scrolling back up
  un-draws it.

  PSEUDO-ELEMENTS ARE ANIMATED THROUGH CUSTOM PROPERTIES, because GSAP cannot
  target a ::before. Two hooks, both set on the STEP and both defaulting to 1 in
  CSS so the finished state is the no-JS state:
    --step-line   the connector to the NEXT step. CSS consumes it as scaleX() on a
                  wide screen and scaleY() on a phone — one value, two axes, no
                  branching here.
    --step-node   the step's own marker, when the marker is a pseudo-element.

  MARKUP CONTRACT
    <ol data-steps-sequence data-no-text-reveal>          the list
      <li> …the step; direct element children are its content…
    Optional: data-steps-item="<selector>"    which children are steps
                                              (default: the list's own children)
              data-steps-marker="<selector>"  a REAL element to land as the marker
                                              (e.g. /jobs/'s numbered circle). Omit
                                              it and the marker is assumed to be a
                                              pseudo-element driven by --step-node.
    Everything that is not the marker is that step's copy, staggered in.

  ⚠️ The list must carry `data-no-text-reveal` and must NOT carry
  `data-item-reveal`: text-reveal.js only skips a subtree automatically when it
  sits inside [data-reveal]/[data-item-reveal], and two timelines on one element is
  what makes a reveal look broken.

  JS-ONLY-EVER-ENHANCES, same contract as every other motion primitive here:
  nothing in CSS hides any of this. The start states (opacity 0, the collapsed
  line, the un-landed node) are written by GSAP at runtime and only inside the
  branch that is about to animate them back. No JS, a script error,
  prefers-reduced-motion or a crawler that does not run JS all get the finished
  section: every marker, every connector, all copy.

  Requires GSAP + ScrollTrigger (loaded before this file) and rides the shared
  ticker/Lenis integration from js/smooth-scroll.js.

  NOTE: js/jobs-steps.js is this same choreography, written for /jobs/ first. That
  page can switch to this file by swapping its one <script> tag — the hook
  attribute is deliberately identical — and jobs-steps.js retired. Not done in the
  same pass only to avoid touching that page while it was still being built.
*/

(function initStepsSequence() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var lists = document.querySelectorAll("[data-steps-sequence]");
  if (!lists.length) return;

  gsap.registerPlugin(ScrollTrigger);

  Array.prototype.forEach.call(lists, function (list) {
    var itemSel = list.getAttribute("data-steps-item");
    var steps = itemSel
      ? Array.prototype.slice.call(list.querySelectorAll(itemSel))
      : Array.prototype.filter.call(list.children, function (el) {
          return el.nodeType === 1;
        });
    // One step is not a sequence — nothing to order, nothing to connect.
    if (steps.length < 2) return;

    var markerSel = list.getAttribute("data-steps-marker");

    var timeline = gsap.timeline({
      scrollTrigger: {
        trigger: list,
        // Starts as the row comes into view and finishes with it just above the
        // middle of the screen: half a viewport for the whole sequence. Shorter
        // and the rail draws itself in one flick; longer and the last step is
        // still empty when the section is centred.
        start: "top 88%",
        end: "top 38%",
        scrub: 0.7,
      },
    });

    steps.forEach(function (step, i) {
      var marker = markerSel ? step.querySelector(markerSel) : null;
      // Everything in the step that is not the marker. Element children only, so
      // a text node or a comment never ends up as a tween target.
      var copy = Array.prototype.filter.call(step.children, function (el) {
        return el.nodeType === 1 && el !== marker;
      });
      var isLast = i === steps.length - 1;

      // --- the marker lands -------------------------------------------------
      // A touch of overshoot so it LANDS rather than fades in. 1.4, not a
      // cartoon 4.
      if (marker) {
        timeline.fromTo(
          marker,
          { opacity: 0, scale: 0.55 },
          { opacity: 1, scale: 1, duration: 0.42, ease: "back.out(1.4)" }
        );
      } else {
        // The marker is a pseudo-element: drive it through the step instead. The
        // CSS uses the same value for opacity and scale, so one tween does both.
        timeline.fromTo(
          step,
          { "--step-node": 0 },
          { "--step-node": 1, duration: 0.42, ease: "back.out(1.4)" }
        );
      }

      // --- its own copy rises in under it -----------------------------------
      // Overlaps the marker's landing: the marker and the text under it should
      // read as one arrival, not two things queued back to back.
      if (copy.length) {
        timeline.fromTo(
          copy,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.08 },
          "-=0.3"
        );
      }

      // --- then the line onward ---------------------------------------------
      // To the NEXT marker, so the last step draws nothing — the same rule the
      // CSS follows with :not(:last-child). Starts while this step's copy is
      // still settling, so the rail never visibly stops and waits.
      if (!isLast) {
        timeline.fromTo(
          step,
          { "--step-line": 0 },
          { "--step-line": 1, duration: 0.5, ease: "power2.inOut" },
          "-=0.22"
        );
      }
    });
  });
})();
