/*
  "Our System" card stack ("Less effort. More control.") — desktop + motion only.

  Mechanism: the whole panel (.system-story__stage) is ONE CSS `position: sticky`
  element pinned by a tall .system-story__track (NO ScrollTrigger pin, which is
  safe with Lenis). This scrubbed timeline raises cards 2..N into a staggered
  peek-stack (the SAME entrance for every card), holds the full stack, and then
  the track ends and the sticky stage releases as a SINGLE unit — so there is no
  per-card "peel" at the end (the earlier per-card position:sticky version
  released the last cards in reverse order, lifting the stack before card 6
  settled; that's what this replaces).

  Card layout (staggered tops, absolute) lives in the .system-story--enhanced
  block in css/system-story.css. Reuses the page's single GSAP + ScrollTrigger
  and the single Lenis (via js/smooth-scroll.js's ticker binding) — no extra
  lib, RAF or DOMContentLoaded. matchMedia gates it to desktop + no-reduced-
  motion and auto-reverts on exit, so mobile / reduced-motion / no-JS get the
  plain static vertical list.
*/

(function () {
  "use strict";

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  var story = document.querySelector("[data-system-story]");
  if (!story) return;

  var cards = Array.prototype.slice.call(
    story.querySelectorAll("[data-system-card]")
  );
  if (cards.length < 2) return;

  gsap.registerPlugin(ScrollTrigger);

  var mm = gsap.matchMedia();

  mm.add(
    "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    function () {
      // Switch on the pinned sticky-stage layout (absolute, staggered cards).
      story.classList.add("system-story--enhanced");

      // Cards enter ONE BY ONE, strictly in order 1 → 2 → 3 → 4 → 5 → 6 (client
      // 2026-07-27). NOTHING is pre-placed — EVERY card (including card 1) starts
      // hidden just below the stage, so arriving at the section shows an empty
      // stage and then card 1 itself animates in on scroll, followed by 2..6.
      // Each rises to its own CSS position: 1→left, 2→centre, 3→right (bottom
      // row), then 4→over 1, 5→over 2, 6→over 3 (front row). One card per tween —
      // the columns never mix.
      // Each card's bullet list is revealed in a small stagger AFTER its own
      // card settles, so the list "appears" like the other reveal lists across
      // the site (client 2026-07-27). Handled inside THIS timeline — NOT the
      // generic IntersectionObserver item-reveal — because the cards are
      // pinned/transformed here, where a geometric observer fires at the wrong
      // moment. JS-only-enhances: the hidden start state is set only here.
      var cardPoints = cards.map(function (c) {
        return Array.prototype.slice.call(
          c.querySelectorAll(".system-story__points li")
        );
      });

      gsap.set(cards, { yPercent: 160, opacity: 0, filter: "blur(10px)" });
      cardPoints.forEach(function (items) {
        if (items.length) gsap.set(items, { y: 10, opacity: 0 });
      });

      /* Holds are scroll with NOTHING moving on screen. Measured 2026-07-30:
         with 0.3 + 1.0 they were ~620px of frozen screen out of ~3500px, which
         is most of why this section read as "un scroll normal" — you scroll and
         the page just sits there. Halved; enough to breathe, not enough to
         feel stuck. */
      var INTRO_HOLD = 0.15; // brief empty stage before card 1 rises in
      var FINAL_HOLD = 0.5;  // full stack settled & fixed before release
      /* Consecutive cards overlap, so something is always in motion instead of
         six discrete one-at-a-time beats with dead air between them. */
      var CARD_OVERLAP = 0.25;

      // settleP[i] = scroll progress at which card i has finished entering.
      // Used by onUpdate to mark a back-row card (0,1,2) as ".is-behind" once its
      // front card (i+3) has settled on top — so only the active card shows its
      // bullets, and behind cards read clearly behind (client 2026-07-29).
      var settle = [];
      var settleP = [];

      var tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: story,
          start: "top top",
          end: "bottom bottom",
          /* 0.5 tracked the wheel almost 1:1, which is what makes a scrubbed
             timeline feel mechanical. 1.1 gives the motion real inertia — it
             glides on and settles after you stop — and matches the page's own
             Lenis duration (1.2, js/smooth-scroll.js) so the section feels like
             the rest of the site rather than a separate mechanism. */
          scrub: 1.1,
          onUpdate: function (self) {
            var p = self.progress;
            for (var b = 0; b < 3 && b + 3 < cards.length; b++) {
              cards[b].classList.toggle("is-behind", settleP[b + 3] != null && p >= settleP[b + 3]);
            }
          },
        },
      });

      // Brief empty hold, then raise cards 1..6 in sequence — each individually,
      // same tween, so they arrive strictly in order and each settles into its
      // column/layer.
      tl.to({}, { duration: INTRO_HOLD });

      for (var i = 0; i < cards.length; i++) {
        tl.to(
          cards[i],
          {
            yPercent: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            /* power3.out under a SCRUB is deceptive: the ease maps scroll to
               progress, so the card covered ~75% of its travel in the first
               ~30% of its scroll segment and then crept. Six of those in a row
               = lurch, stall, lurch, stall. power1.out keeps a decelerating
               arrival but spreads the movement across the scroll it is given. */
            ease: "power1.out",
          },
          i === 0 ? ">" : "-=" + CARD_OVERLAP
        );
        settle[i] = tl.duration(); // progress marker: card i has arrived
        // The card's bullet list cascades in as the card is settling.
        if (cardPoints[i].length) {
          tl.to(
            cardPoints[i],
            { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.12 },
            "<0.35"
          );
        }
      }

      // Final hold — nothing moves; the full stack stays fixed. When the track
      // ends after this, the sticky stage un-sticks and the whole section
      // scrolls away together (unit release, no peel).
      tl.to({}, { duration: FINAL_HOLD });

      // Now that the full timeline length is known, convert the settle markers to
      // 0..1 scroll progress for the onUpdate above.
      var totalDur = tl.duration();
      settleP = settle.map(function (t) { return t / totalDur; });

      // Track/stage geometry is CSS-driven; refresh keeps positions accurate
      // alongside the page's other ScrollTriggers + Lenis.
      ScrollTrigger.refresh();

      // matchMedia cleanup: it auto-reverts the gsap.set/tweens and kills this
      // ScrollTrigger; we only drop the layout class and clear leftover
      // transforms so the base vertical list returns.
      return function () {
        story.classList.remove("system-story--enhanced");
        cards.forEach(function (c) { c.classList.remove("is-behind"); });
        gsap.set(cards, { clearProps: "transform,opacity,filter" });
        cardPoints.forEach(function (items) {
          if (items.length) gsap.set(items, { clearProps: "transform,opacity" });
        });
      };
    }
  );
})();
