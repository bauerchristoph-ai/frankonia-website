/*
  Sticky trust-story region (Hero → 3 half-panels → Pain Hook).

  Codrops StickySections (index9) is interaction inspiration only — the
  structure and code here are our own. Three half-panels crossfade/slide one
  at a time (right → left → right); the inactive half stays dark negative
  space. CSS `position: sticky` holds the stage in view (NO ScrollTrigger
  pin); a single scrubbed ScrollTrigger drives one timeline that animates the
  panels' inner wrappers (never the sticky element itself).

  Scroll engine: reuses the ONE existing Lenis + GSAP-ticker integration from
  js/smooth-scroll.js. This module only creates a ScrollTrigger — it never
  makes a second Lenis, a second requestAnimationFrame loop, or a second
  `ScrollTrigger.update` binding.

  Progressive enhancement: the base layout (page-home.css) is normal document
  flow — three readable stacked sections. This module only switches to the
  sticky layout + hidden panel states, and only inside a gsap.matchMedia()
  branch for `(min-width: 1024px) and (prefers-reduced-motion: no-preference)`.
  Below 1024px, under reduced motion, or with no JS, the region stays in
  normal flow with everything visible. matchMedia auto-reverts the class,
  inline styles and the ScrollTrigger on breakpoint change — one clean
  create/teardown path, no manual kill bookkeeping.

  Requires GSAP core + ScrollTrigger (self-hosted, loaded before this file).
*/

(function initStickySections() {
  // PE safety: the CSS hides panels 2 & 3 (and applies the sticky layout)
  // gated on the html.js-story class that the inline <head> script adds
  // optimistically. If this module can't actually run the reveal — GSAP
  // missing, or the story markup isn't what we expect — we must DROP that
  // class so the region falls back to normal document flow with every panel
  // visible. Otherwise panels 2 & 3 would stay hidden with nothing to
  // reveal them.
  const bail = function () {
    document.documentElement.classList.remove("js-story");
  };

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return bail();

  const story = document.querySelector("[data-story]");
  if (!story) return bail();

  const panels = story.querySelectorAll("[data-story-panel]");
  if (panels.length < 3) return bail();

  const inners = Array.from(panels).map((p) => p.querySelector(".story__panel-inner"));
  if (inners.some((el) => !el)) return bail();

  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  mm.add(
    "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    () => {
      // The sticky/absolute LAYOUT is applied by CSS (gated on the same
      // media query + the html.js-story class set in <head>), so it's live
      // from first paint — nothing to toggle here, no load flash. This
      // module only owns the scroll-driven ANIMATION.
      const [p1, p2, p3] = inners;

      // Motion: primarily translateY with a very small scale, opacity as
      // support — so a panel reads as being replaced through scroll rather
      // than simply fading. Panel 1 is the opening focus; 2 and 3 wait just
      // below and slightly scaled down. (CSS already hid 2 & 3 from first
      // paint; these sets add the y/scale offset.) Applied in JS only, and
      // auto-reverted by matchMedia on breakpoint/reduced-motion change.
      gsap.set(p1, { opacity: 1, y: 0, scale: 1 });
      gsap.set([p2, p3], { opacity: 0, y: 72, scale: 0.98 });

      // ONE scrubbed timeline over the tall .story wrapper. Progress 0 when
      // the stage becomes stuck (story top hits viewport top); progress 1
      // when the story bottom reaches the viewport bottom (stage unsticks
      // and Pain Hook, next in flow, takes over full width).
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: story,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
        },
      });

      // Right → Left → Right. Each panel: entrance → readable HOLD → exit.
      // The outgoing panel slides UP and slightly recedes (scale 0.98) as the
      // incoming one rises into place on the opposite half — a spatial
      // replacement, not a slideshow fade. Timeline units are arbitrary;
      // scrub maps the whole ~6.5-unit timeline across the ~2.4-screen stuck
      // range. Holds are the gaps between an entrance finishing and the next
      // exit starting. Exact positions/durations reported in the changelog.

      // — Panel 1 holds t0.0–1.4, then exits as Panel 2 enters —
      tl.to(p1, { opacity: 0, y: -72, scale: 0.98, duration: 1.1 }, 1.4);
      tl.to(p2, { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: "power2.out" }, 1.6);

      // — Panel 2 holds ~t2.7–3.5, then exits as Panel 3 enters —
      tl.to(p2, { opacity: 0, y: -72, scale: 0.98, duration: 1.1 }, 3.5);
      tl.to(p3, { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: "power2.out" }, 3.7);

      // — Panel 3 holds ~t4.8–5.6, then exits into Pain Hook at the very end —
      tl.to(p3, { opacity: 0, y: -72, scale: 0.98, duration: 1.0 }, 5.6);

      // The layout is CSS-driven from first paint, but the hero image is
      // height:auto and can settle late — one refresh keeps every trigger's
      // start/end accurate against final layout.
      ScrollTrigger.refresh();

      // Cleanup on breakpoint change / reduced-motion: matchMedia auto-
      // reverts the gsap.set/tween inline styles and kills this context's
      // ScrollTrigger. Nothing else to undo (no class was added), so no
      // stale inline transforms remain.
      return () => {};
    }
  );
})();
