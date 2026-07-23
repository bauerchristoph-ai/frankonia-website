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

      // Explicit initial states BEFORE building the timeline.
      // KEY: s1 (metrics) rests at yPercent 0 — it is NOT parked below. It
      // rides into view with the sticky stage during the pre-pin scroll (native
      // scroll, no GSAP enter tween), so the stage is never shown as an empty
      // black half and there is no fighting between GSAP and the scroll. Only
      // s1's EXIT is animated. s2/s3 start parked fully below (yPercent 100).
      // Static z-index so each later panel stacks ABOVE the earlier ones — an
      // incoming surface can't reveal an unrelated panel underneath, and a
      // just-exited one can't show through its replacement. The stage's
      // overflow:hidden clips any surface at yPercent -100 completely off the
      // top (not visible, not interactable), so pure transforms suffice — no
      // autoAlpha needed, which also keeps reverse-scroll flicker-free.
      gsap.set(s1, { yPercent: 0, zIndex: 1 });
      gsap.set(s2, { yPercent: 100, zIndex: 2 });
      gsap.set(s3, { yPercent: 100, zIndex: 3 });

      // ONE scrubbed ScrollTrigger (existing Lenis/ticker untouched).
      // start:"top bottom" so the timeline covers the whole time the story is
      // in view — including the ride-in, where s1 is simply held (metrics
      // visible from the first pixel of the stage → no empty black viewport).
      // end:"bottom bottom" releases exactly as benefitsExit completes, handing
      // straight off to Pain Hook.
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: story,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 0.8,
        },
      });

      // Sequential timeline (labels below). Right -> Left -> Right.
      // metrics: rides in + HOLDS [0 -> 2.8] (spans the pre-pin ride-in, ~2.26u
      //   to the pin, plus a pinned beat) then EXITS up.
      // logos / benefits: parked below -> ENTER (yPercent 100->0) -> HOLD ->
      //   EXIT (0->-100). Holds NEVER overlap; each incoming enter starts 0.3u
      //   before the outgoing exit ends (movement overlap only), so the
      //   previous panel is ~70% off the top before the next is readable —
      //   never two panels parked on screen at once. Total = 10.2 units.
      tl.addLabel("metricsHold", 0)                              // 0 -> 2.8 (ride-in + hold)
        .addLabel("metricsExit", 2.8)
        .to(s1, { yPercent: -100, duration: 1 }, "metricsExit")  // 2.8 -> 3.8

        .addLabel("logosEnter", 3.5)
        .to(s2, { yPercent: 0, duration: 1 }, "logosEnter")      // 3.5 -> 4.5
        .addLabel("logosHold", 4.5)                              // 4.5 -> 6.0 hold
        .addLabel("logosExit", 6.0)
        .to(s2, { yPercent: -100, duration: 1 }, "logosExit")    // 6.0 -> 7.0

        .addLabel("benefitsEnter", 6.7)
        .to(s3, { yPercent: 0, duration: 1 }, "benefitsEnter")   // 6.7 -> 7.7
        .addLabel("benefitsHold", 7.7)                           // 7.7 -> 9.2 hold
        .addLabel("benefitsExit", 9.2)
        .to(s3, { yPercent: -100, duration: 1 }, "benefitsExit");// 9.2 -> 10.2

      // Panel 1 metric count-up — driven by THIS timeline (scrub-synced,
      // reversible, deterministic; no setInterval, no IntersectionObserver,
      // and these metrics stay excluded from the global stat count-up via
      // data-no-countup). One proxy p:0->1; each number is target*p, formatted
      // in onUpdate with en-US thousands commas / fixed decimals / static
      // suffix. Runs across metricsEnter + into the hold (0.4 -> 2.4).
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
        // From timeline position 0 so numbers read 0 from the first painted
        // frame of the ride-in (no final->0 reset flash) and finish counting up
        // by ~the pin. duration 2 of the 2.8-unit metricsHold.
        tl.fromTo(proxy, { p: 0 }, { p: 1, duration: 2, onUpdate: render }, 0);
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
