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
      // Each card's description eases in AFTER its own card settles, so the copy
      // "appears" like the other reveals across the site (client 2026-07-27).
      // Handled inside THIS timeline — NOT the generic IntersectionObserver
      // text-reveal (which excludes [data-system-story] for exactly this
      // reason) — because the cards are pinned/transformed here, where a
      // geometric observer fires at the wrong moment. JS-only-enhances: the
      // hidden start state is set only here.
      // Was the 3-bullet list's <li>s until 2026-08-03; the client's draft copy
      // is one paragraph per card, so it's a single element now — the stagger
      // below is harmless on a one-item array and keeps the timing identical.
      var cardPoints = cards.map(function (c) {
        return Array.prototype.slice.call(
          c.querySelectorAll(".system-story__desc")
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
          // Keep the anchor offset (below) correct after a resize — start/end
          // move with the track, which is sized in svh.
          onRefresh: setAnchorOffset,
        },
      });

      /* --- Anchor landing offset (client 2026-08-03: clicking "Unser System"
         in the nav "me lleva acá dentro de la home, wtf") -------------------
         The nav item points at #our-system, and this section's scroll trigger
         starts at "top top" — so landing on the element's top IS timeline
         progress 0, which is the deliberately empty stage before card 1 rises.
         Correct behaviour for someone scrolling INTO the section, and a broken-
         looking blank screen for someone who jumped straight to it.
         So the element advertises how far past its own top a jump should land:
         js/smooth-scroll.js reads data-scroll-offset on any hash target and
         passes it to lenis.scrollTo.
         Landing point: where the BACK ROW (cards 1-3) has finished entering —
         a complete, balanced three-card composition, with 4-6 still ahead. Both
         candidates were rendered in a real browser before choosing: landing on
         card 1 alone (settleP[0]) leaves two thirds of the stage empty, which is
         a milder version of the same complaint. Scrolling up from here still
         replays the entrance, since the timeline is scrubbed.
         Only ever set inside this matchMedia branch (desktop + motion), and
         removed on exit: on mobile, under reduced motion, and with no JS the
         layout is the plain list/carousel, where the element's own top is
         already the right place to land. */
      function setAnchorOffset() {
        var st = tl.scrollTrigger;
        if (!st || !settleP.length) return;
        // Last card of the back row (index 2), or the last card there is.
        var landing = settleP[Math.min(2, settleP.length - 1)];
        story.setAttribute(
          "data-scroll-offset",
          String(Math.round(landing * (st.end - st.start)))
        );
      }

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

      // settleP now exists, so the anchor offset can be computed. (The trigger's
      // own onRefresh above also calls this, but it fires during the refresh
      // that happens before settleP is filled on first build.)
      setAnchorOffset();

      // matchMedia cleanup: it auto-reverts the gsap.set/tweens and kills this
      // ScrollTrigger; we only drop the layout class and clear leftover
      // transforms so the base vertical list returns.
      return function () {
        story.classList.remove("system-story--enhanced");
        // The base layout has no pinned timeline, so its own top IS the right
        // landing spot — leaving a stale offset behind would overshoot it.
        story.removeAttribute("data-scroll-offset");
        cards.forEach(function (c) { c.classList.remove("is-behind"); });
        gsap.set(cards, { clearProps: "transform,opacity,filter" });
        cardPoints.forEach(function (items) {
          if (items.length) gsap.set(items, { clearProps: "transform,opacity" });
        });
      };
    }
  );

  /* ==========================================================================
     MOBILE: hold the section and spend vertical scroll on the cards
     (client 2026-08-04, via Chris) — "que sea con scroll normal, que te haga
     scrollear por las 6 horizontalmente... como que se trancaría ahí para que se
     scrollee horizontal y después seguir vertical", tied to how hard the gesture
     was: "si la persona hace un heavy scroll entonces las cards pasarán rápido".

     HOW, and why this shape: the section gets a tall track and a `position:
     sticky` stage — the SAME mechanism as this component's desktop sequence and
     as konzept-seq — and the vertical scroll progress across that track is
     written straight into the strip's own scrollLeft.

     Nothing here intercepts the gesture. There is no preventDefault, no wheel or
     touchmove handler, no scroll-jacking library. That matters for three reasons:
       - INTENSITY COMES FREE. The browser's own momentum/fling physics produce
         the scroll progress, so a hard flick advances the cards fast and a slow
         drag inches them. Re-implementing that from touch deltas would be a
         worse copy of what the platform already does.
       - IT CANNOT TRAP ANYONE. The pin is a bounded stretch of REAL page scroll
         (track height = one viewport + the strip's own scroll width, i.e. 1:1),
         so it always ends, scrolling back up works, and a script error mid-way
         leaves an ordinary tall section rather than a locked screen. A
         preventDefault-based hold has no such floor.
       - It stays inside this project's "no scroll hijacking" rule in the sense
         that matters: the page never stops responding to the gesture.

     Direct sideways swiping is switched OFF while pinned (overflow-x: hidden in
     the CSS) — otherwise the two inputs fight over scrollLeft on every frame, and
     the client's ask is specifically that the vertical gesture does this. The
     "01 / 06" counter and the progress line keep working untouched: they listen
     for the strip's scroll events, and setting scrollLeft fires them.

     Gated to no-reduced-motion. Under reduced motion, no JS, or a GSAP failure
     the section stays the plain native swipe carousel from css/swipe-carousel.css
     — holding the page hostage is exactly what a reduced-motion visitor is
     asking not to have.
     ========================================================================== */
  mm.add(
    "(max-width: 767.98px) and (prefers-reduced-motion: no-preference)",
    function () {
      var stack = story.querySelector("[data-system-stack]");
      var track = story.querySelector(".system-story__track");
      if (!stack || !track) return;

      story.classList.add("system-story--pinned");

      var maxScroll = 0;

      /* 1:1 — the cards travel exactly as far as the finger does, which is what
         makes the hand-off in and out of the section feel like ordinary scroll
         rather than a gear change. Measured AFTER the class is on, so the strip
         is already in its pinned geometry. */
      function measure() {
        track.style.height = "";
        maxScroll = stack.scrollWidth - stack.clientWidth;
        track.style.height = window.innerHeight + maxScroll + "px";
      }

      measure();

      var st = ScrollTrigger.create({
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          if (maxScroll > 0) stack.scrollLeft = self.progress * maxScroll;
        },
      });

      /* Rotation / a resized viewport changes both the track height and the
         strip's scroll width. Debounced because measure() writes a height, which
         ScrollTrigger.refresh() then reads. */
      var resizeTimer = null;
      function onResize() {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          measure();
          ScrollTrigger.refresh();
        }, 150);
      }
      window.addEventListener("resize", onResize);

      ScrollTrigger.refresh();

      return function () {
        window.removeEventListener("resize", onResize);
        if (resizeTimer) clearTimeout(resizeTimer);
        if (st) st.kill();
        story.classList.remove("system-story--pinned");
        track.style.height = "";
        stack.scrollLeft = 0;
      };
    }
  );
})();
