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

  const surfaces = Array.from(panels).map((p) => p.querySelector(".story__panel-surface"));
  if (surfaces.some((el) => !el)) return bail();

  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  mm.add(
    "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    () => {
      // Codrops index9 motion: each COMPLETE half-screen surface slides
      // VERTICALLY with scroll (yPercent 100 -> 0 -> -100). The sticky
      // .story__stage is never transformed; only these surfaces move, so the
      // background and content travel together as one sheet. No opacity
      // crossfade — pure vertical translation. CSS already parks the surfaces
      // at translateY(100%) from first paint (gated on .js-story + the media
      // query), so there's no flash; these sets just hand them to GSAP.
      const [s1, s2, s3] = surfaces;
      gsap.set(surfaces, { yPercent: 100 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: story,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
        },
      });

      // Right -> Left -> Right. Each surface: enter (rise from below) -> hold
      // -> exit (up). The outgoing exit overlaps the next enter by ~0.2 units
      // so the sequence stays continuous — no black gap, and (being on
      // opposite halves) never two panels readable in the same place.
      tl.to(s1, { yPercent: 0, duration: 1.3 }, 0.0);     // P1 enter  0.0–1.3
      tl.to(s1, { yPercent: -100, duration: 1.3 }, 2.6);  // P1 exit   2.6–3.9
      tl.to(s2, { yPercent: 0, duration: 1.3 }, 2.8);     // P2 enter  2.8–4.1
      tl.to(s2, { yPercent: -100, duration: 1.3 }, 5.4);  // P2 exit   5.4–6.7
      tl.to(s3, { yPercent: 0, duration: 1.3 }, 5.6);     // P3 enter  5.6–6.9
      tl.to(s3, { yPercent: -100, duration: 1.3 }, 8.2);  // P3 exit   8.2–9.5

      // Panel 1 metric count-up — driven by THIS timeline (scrub-synced,
      // reversible, deterministic; no setInterval, no IntersectionObserver,
      // and these metrics stay excluded from the global stat count-up via
      // data-no-countup). One proxy p:0->1; each number is target*p, formatted
      // in onUpdate with en-US thousands commas / fixed decimals / static
      // suffix. Positioned to start ~0.4 (≈30% into P1's 0.0–1.3 entrance) and
      // finish at 1.6, just after P1 rests.
      const nums = Array.from(s1.querySelectorAll(".stat__num[data-count-to]"));
      const meta = nums.map((el) => ({
        el: el,
        original: el.textContent,
        target: parseFloat(el.dataset.countTo),
        decimals: parseInt(el.dataset.decimals || "0", 10),
        suffix: el.dataset.suffix || "",
      }));
      const proxy = { p: 0 };
      const render = function () {
        meta.forEach(function (m) {
          const v = m.target * proxy.p;
          const text = m.decimals > 0
            ? v.toFixed(m.decimals)
            : Math.round(v).toLocaleString("en-US");
          m.el.textContent = text + m.suffix;
        });
      };
      if (meta.length) {
        tl.fromTo(proxy, { p: 0 }, { p: 1, duration: 1.2, onUpdate: render }, 0.4);
      }

      // Layout is CSS-driven from first paint, but the hero image is
      // height:auto and can settle late — one refresh keeps trigger
      // start/end accurate.
      ScrollTrigger.refresh();

      // Cleanup on breakpoint change / reduced-motion: matchMedia auto-reverts
      // the gsap.set/tweens (surfaces return to their CSS state) and kills this
      // context's ScrollTrigger. Restore the metric numbers' original text
      // (onUpdate wrote textContent, which GSAP doesn't revert) so a revert to
      // mobile shows the correct static final values.
      return function () {
        meta.forEach(function (m) { m.el.textContent = m.original; });
      };
    }
  );
})();
