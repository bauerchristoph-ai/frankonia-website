/*
  Sticky trust-story region (Hero → 3 half-panels → Pain Hook).

  Codrops StickySections (index9) stacking, our own structure. Three
  FULL-VIEWPORT black scenes (.story__panel) slide up one at a time
  (yPercent 100 → 0), each covering the previous — so consecutive scenes
  never show together even though the design surfaces inside them are on
  opposite halves (metrics right, logos left, benefits right). The half-width
  .story__panel-surface is static inside its scene; only the SCENE is
  animated. CSS `position: sticky` holds the stage in view (NO ScrollTrigger
  pin); one scrubbed ScrollTrigger drives one timeline. Scenes are resolved
  from [data-story-surface] roles, not DOM order.

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

  // Select surfaces by EXPLICIT role attributes, never by DOM/array position —
  // the play order (metrics -> logos -> benefits) must not depend on markup
  // order. Each selector must match exactly one surface.
  const metrics = story.querySelector('[data-story-surface="metrics"]');
  const logos = story.querySelector('[data-story-surface="logos"]');
  const benefits = story.querySelector('[data-story-surface="benefits"]');
  if (!metrics || !logos || !benefits) return bail();

  // The animated element is the FULL-VIEWPORT scene (.story__panel), not the
  // half-width surface. Each scene's black background covers the previous
  // scene as it rises, so consecutive opposite-side panels never show together.
  const metricsScene = metrics.closest(".story__panel");
  const logosScene = logos.closest(".story__panel");
  const benefitsScene = benefits.closest(".story__panel");
  if (!metricsScene || !logosScene || !benefitsScene) return bail();

  // Dev verification (harmless one-time log): confirm each role resolves to a
  // single unique surface.
  console.log("[story] surfaces:", {
    metrics: story.querySelectorAll('[data-story-surface="metrics"]').length + "×",
    logos: story.querySelectorAll('[data-story-surface="logos"]').length + "×",
    benefits: story.querySelectorAll('[data-story-surface="benefits"]').length + "×",
  });

  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  mm.add(
    "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    () => {
      // Codrops index9 stacking: each FULL-VIEWPORT scene (.story__panel, black
      // background) slides VERTICALLY (yPercent 100 -> 0), covering the scene
      // beneath it. The sticky .story__stage is never transformed; the
      // half-width surface inside each scene is static. No opacity crossfade.
      // Explicit initial states BEFORE building the timeline. All THREE scenes
      // start parked fully below (yPercent 100) — including metrics, so nothing
      // shows while the story wrapper is still rising; metrics enters only once
      // the stage pins. Static z-index (later stacks higher) so each incoming
      // scene covers the one before it. No autoAlpha: the full-screen black
      // background does the covering, and metrics/logos must stay present (at
      // yPercent 0) UNDERNEATH so scrolling back up reveals them cleanly.
      gsap.set(metricsScene, { yPercent: 100, zIndex: 1 });
      gsap.set(logosScene, { yPercent: 100, zIndex: 2 });
      gsap.set(benefitsScene, { yPercent: 100, zIndex: 3 });

      // ONE scrubbed ScrollTrigger (existing Lenis/ticker untouched). NO pin.
      // start:"top top" — timeline begins the instant the sticky stage is fixed
      // at the top (i.e. as the intro finishes scrolling away), so metrics
      // enters immediately. end:"bottom bottom" releases as the last scene
      // exits → Pain Hook follows.
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: story,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
      });

      // COMPACT STACKED timeline (total 5.5 units). Each scene ENTERS (yPercent
      // 100 -> 0) over the previous one and HOLDS. Metrics and logos are NOT
      // animated upward — they stay at yPercent 0 underneath, covered by the
      // next full-screen scene (and revealed again on reverse scroll). Only the
      // final scene (benefits) exits upward, handing off to Pain Hook.
      tl.addLabel("metricsEnter", 0)
        .to(metricsScene, { yPercent: 0, duration: 1 }, "metricsEnter")   // 0   -> 1
        .addLabel("metricsHold", 1)                                       // 1   -> 1.5 hold

        .addLabel("logosEnter", 1.5)
        .to(logosScene, { yPercent: 0, duration: 1 }, "logosEnter")       // 1.5 -> 2.5 (covers metrics)
        .addLabel("logosHold", 2.5)                                       // 2.5 -> 3   hold

        .addLabel("benefitsEnter", 3)
        .to(benefitsScene, { yPercent: 0, duration: 1 }, "benefitsEnter") // 3   -> 4   (covers logos)
        .addLabel("benefitsHold", 4)                                      // 4   -> 4.5 hold

        .addLabel("benefitsExit", 4.5)
        .to(benefitsScene, { yPercent: -100, duration: 1 }, "benefitsExit");// 4.5 -> 5.5 exit

      // Panel 1 metric count-up — driven by THIS timeline (scrub-synced,
      // reversible, deterministic; no setInterval, no IntersectionObserver,
      // and these metrics stay excluded from the global stat count-up via
      // data-no-countup). One proxy p:0->1; each number is target*p, formatted
      // in onUpdate with en-US thousands commas / fixed decimals / static
      // suffix. Runs across metricsEnter + into the hold (0.4 -> 2.4).
      const nums = Array.from(metrics.querySelectorAll(".stat__num[data-count-to]"));
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
        // Runs across the metrics enter into its hold (0 -> 1.2): numbers count
        // up as the metrics scene rises in. From position 0 so they read 0 on
        // the first frame (no final->0 reset flash).
        tl.fromTo(proxy, { p: 0 }, { p: 1, duration: 1.2, onUpdate: render }, 0);
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
