/*
  Pauses looping CSS animations inside a <section> while that section is off
  screen (perf, 2026-08-19). Measured cause: Chrome throttles animations in
  BACKGROUND TABS but not for content scrolled out of view in the active tab,
  so every infinite @keyframes on the page keeps ticking at 60fps whether or
  not anyone can see it. On the homepage that was 24 of 26 infinite animations
  running unseen at scroll 0 (the whole kz-* set — marching patrol routes,
  breathing markers, 9 ripple rings, 4 alarm-light sweeps — starts 750px below
  the fold), and it measured ~20% of one core with the page standing still,
  against a 1.2% baseline on a page with a single animation. That is battery and
  thermal budget on a phone, and it competes for the same main thread GSAP /
  ScrollTrigger use for the scroll choreography.

  NOTHING VISIBLE CHANGES, and the two reasons why are worth keeping:

  1. A paused animation KEEPS ITS PHASE. Verified by reading currentTime across
     a pause/resume on the real Konzept diagram: frozen at 3414ms through 2.5s
     of wall clock, then resumed at 3808 — it continues, it does not restart.
     The 35ms stagger between the 9 ripple rings is preserved too (3406/3371
     before, 3808/3773 after), so the staggered radar reads exactly as tuned.

  2. rootMargin resumes a section BEFORE it is visible, which is what closes the
     one case that WOULD otherwise differ: a marquee. Its position encodes
     progress, so a marquee resuming exactly as its first pixel appears would be
     seen starting from a standstill. 400px of margin means it has been moving
     for hundreds of ms by the time any of it is on screen. Do not drop this to
     0 — that is the whole reason it is here.

  Scope: `main > section`. Measured across /, /referenzen/, /objektschutz/ and
  /jobs/ — every animated element on those pages lives inside one, with exactly
  one deliberate exception: the header CTA's btn-shine, which sits in the sticky
  <header> and is therefore always visible. Leaving it running is correct.

  JS-only-ever-enhances, same contract as every other motion module here: this
  script only ever ADDS a pause. No JS, a script error, or a browser without
  IntersectionObserver all leave every animation running exactly as today — the
  failure mode is "the old behaviour", never a frozen or missing animation.
  Deliberately not gated on prefers-reduced-motion: motion.css already collapses
  animations there, so pausing is a harmless no-op, and running unconditionally
  means a future animation that escapes that override still gets paused.
*/
(function () {
  "use strict";

  if (!("IntersectionObserver" in window)) return;

  function init() {
    var sections = document.querySelectorAll("main > section");
    if (!sections.length) return;

    var io = new IntersectionObserver(
      function (entries) {
        for (var i = 0; i < entries.length; i++) {
          // Off screen -> paused. IntersectionObserver fires once per target on
          // setup, so sections already below the fold are paused immediately.
          entries[i].target.classList.toggle(
            "is-anim-paused",
            !entries[i].isIntersecting
          );
        }
      },
      { rootMargin: "400px 0px" }
    );

    for (var i = 0; i < sections.length; i++) io.observe(sections[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
