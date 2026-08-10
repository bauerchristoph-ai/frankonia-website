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
              data-steps-draw="<selector>"    an INLINE <svg> per step whose line
                                              work draws itself instead of fading
                                              in (client 2026-08-06 on
                                              /werkschutz/'s Konzept icons). Opt-in:
                                              without it nothing about a step
                                              changes, so /jobs/ is untouched.
              (no attribute)                  `.is-arrived` lands on the step itself
                                              when its marker finishes arriving and
                                              comes off when it un-arrives — the hook
                                              for a one-shot CSS animation on arrival
                                              (/ueber-uns/'s ring). Always set; a page
                                              that does not style it is unaffected.
              data-steps-mark="<selector>"    one element per step whose highlight
                                              wipes across as the step arrives
                                              (client 2026-08-10 on
                                              /brandwache-nuernberg/'s step titles).
                                              Also opt-in. The element consumes
                                              `--mark` in CSS; see the tween below
                                              for why its fallback must be 1.
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
    var drawSel = list.getAttribute("data-steps-draw");
    // data-steps-mark="<selector>" — one element per step whose highlight wipes
    // across as that step arrives. Opt-in, like data-steps-draw: without it
    // nothing about a step changes, so /werkschutz/ is untouched.
    var markSel = list.getAttribute("data-steps-mark");

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

      // The line art that draws itself, if this list opted in. It is deliberately
      // EXCLUDED from the copy stagger below: the drawing IS its arrival, and
      // fading a shape in while its own stroke is still being drawn hides the
      // effect behind an opacity ramp.
      var art = drawSel ? step.querySelector(drawSel) : null;
      // Only real geometry with a real stroke. Skips a <mask>'s filled shapes (the
      // Figma inside-stroke idiom, present in one of these icons) — a dash offset
      // on a fill does nothing, and skipping is what keeps it from vanishing.
      var strokes = art
        ? Array.prototype.filter.call(
            art.querySelectorAll("path, rect, circle, ellipse, line, polyline, polygon"),
            function (el) {
              return (
                typeof el.getTotalLength === "function" &&
                el.getAttribute("stroke") &&
                el.getAttribute("stroke") !== "none" &&
                el.getTotalLength() > 0
              );
            }
          )
        : [];
      if (!strokes.length) art = null;

      // Everything in the step that is neither the marker nor the drawn art.
      // Element children only, so a text node or a comment never ends up as a
      // tween target.
      var copy = Array.prototype.filter.call(step.children, function (el) {
        return el.nodeType === 1 && el !== marker && el !== art;
      });
      var isLast = i === steps.length - 1;

      // --- the marker lands -------------------------------------------------
      // A touch of overshoot so it LANDS rather than fades in. 1.4, not a
      // cartoon 4.
      //
      // `.is-arrived` on the STEP is added the moment that landing finishes and
      // removed when it un-lands, so a page can hang a ONE-SHOT css animation off
      // an arrival — the expanding ring around /ueber-uns/'s dots, the same
      // treatment .pain-hook__node::after gives the homepage's checkpoints. It has
      // to be a class rather than a tween because a scrubbed timeline has no
      // "moment" a CSS animation could be tied to, and removing it on the way back
      // up is what lets the ring replay the next time the visitor scrolls down.
      // Nothing in the shipped CSS of any other consumer names this class, so
      // /jobs/, /werkschutz/ and /brandwache-nuernberg/ are untouched — and since
      // only JS ever adds it, no-JS and prefers-reduced-motion simply never see the
      // ring, which is correct: it is decoration, not content.
      var landed = {
        onComplete: function () {
          step.classList.add("is-arrived");
        },
        onReverseComplete: function () {
          step.classList.remove("is-arrived");
        },
      };

      if (marker) {
        timeline.fromTo(
          marker,
          { opacity: 0, scale: 0.55 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.42,
            ease: "back.out(1.4)",
            onComplete: landed.onComplete,
            onReverseComplete: landed.onReverseComplete,
          }
        );
      } else {
        // The marker is a pseudo-element: drive it through the step instead. The
        // CSS uses the same value for opacity and scale, so one tween does both.
        timeline.fromTo(
          step,
          { "--step-node": 0 },
          {
            "--step-node": 1,
            duration: 0.42,
            ease: "back.out(1.4)",
            onComplete: landed.onComplete,
            onReverseComplete: landed.onReverseComplete,
          }
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

      // --- the icon draws itself --------------------------------------------
      // ONE tween over all of the step's strokes, with function-based values so
      // each path is dashed by its OWN measured length — never a shared constant,
      // the same rule js/service-contrast.js follows for its arrow. The stagger is
      // what makes it read as a pen rather than eleven strokes appearing at once.
      //
      // Position "<" = the start of the tween added just before this one, i.e. the
      // step's copy. So the icon draws WHILE its caption rises, as one arrival.
      // It also runs longer than the copy does, so the drawing is still going when
      // the text has settled.
      if (art) {
        timeline.fromTo(
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
            duration: 0.62,
            ease: "power1.inOut",
            stagger: 0.035,
          },
          copy.length ? "<" : "-=0.3"
        );
      }

      // --- the step's title highlights ---------------------------------------
      // The marker wipe the site already uses on /werkschutz/'s Vorteile and the
      // homepage's pain hook, driven from THIS timeline instead of its own so the
      // fill sweeps as part of the step's one arrival rather than as a second
      // effect that happens to land nearby.
      // Position: just after the copy starts, so the words are there to be
      // highlighted rather than appearing already filled.
      // ⚠️ NOTHING IN CSS HIDES THE FILL. The consuming rule reads
      // `calc(var(--mark, 1) * 100%)`, i.e. FILLED when the property was never
      // written — which is what a no-JS visitor, a crawler and
      // prefers-reduced-motion get, since this whole function returns before here
      // in the last case. The 0 start state is written by GSAP at runtime and only
      // for a step that is about to wipe. Same call .service-contrast__mark makes,
      // and the same bug it fixed: a `var(--mark, 0)` default measured 0 % under
      // forced reduced motion, i.e. the highlights simply vanished.
      var mark = markSel ? step.querySelector(markSel) : null;
      if (mark) {
        timeline.fromTo(
          mark,
          { "--mark": 0 },
          { "--mark": 1, duration: 0.55, ease: "power2.out" },
          copy.length ? "<+0.18" : "-=0.2"
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
