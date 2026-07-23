/*
  Sticky trust-story region (Hero → 3 half-panels → Pain Hook).

  Codrops StickySections (index9) is interaction inspiration only — the
  structure and code here are our own. Three half-panel SURFACES slide
  vertically one at a time (right → left → right: metrics, logos, benefits);
  the inactive half stays dark negative space. CSS `position: sticky` holds
  the stage in view (NO ScrollTrigger pin); a single scrubbed ScrollTrigger
  drives one timeline that translates the surfaces (never the sticky element
  itself). Surfaces are chosen by [data-story-surface] role, not DOM order.

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
      // Codrops index9 motion: each COMPLETE half-screen surface slides
      // VERTICALLY with scroll (yPercent 100 -> 0 -> -100). The sticky
      // .story__stage is never transformed; only these surfaces move, so the
      // background and content travel together as one sheet. No opacity
      // crossfade — pure vertical translation. CSS already parks the surfaces
      // at translateY(100%) from first paint (gated on .js-story + the media
      // query), so there's no flash; these sets just hand them to GSAP.
      // Explicit initial states BEFORE building the timeline.
      // metrics rests visible in place (yPercent 0, autoAlpha 1) — it rides into
      // view with the sticky stage during the pre-pin scroll, so there's no
      // empty black half; only its EXIT is animated. logos + benefits start
      // parked below (yPercent 100) AND hidden (autoAlpha 0) so a parked panel
      // can never bleed through before its turn. Static z-index (later = higher)
      // so an incoming surface stacks above the outgoing one. autoAlpha is
      // toggled by the timeline at each enter/exit boundary; because it's part
      // of the one scrubbed timeline it reverses automatically on scroll-up.
      gsap.set(metrics, { yPercent: 0, autoAlpha: 1, zIndex: 1 });
      gsap.set(logos, { yPercent: 100, autoAlpha: 0, zIndex: 2 });
      gsap.set(benefits, { yPercent: 100, autoAlpha: 0, zIndex: 3 });

      // ONE scrubbed ScrollTrigger (existing Lenis/ticker untouched).
      // start:"top top" — the timeline begins only once the sticky stage is
      // actually fixed at the top (metrics is already visible during the ride-in
      // via its CSS/gsap default, so there is no black gap before it). NO pin.
      // end:"bottom bottom" releases exactly as benefitsExit completes → Pain
      // Hook follows immediately.
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: story,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      // COMPACT timeline (labels below), total 5.7 units. Right -> Left -> Right.
      // Each incoming panel begins entering ~0.2u (≈25% of the 0.8u transition)
      // before the outgoing one finishes exiting — a small MOVEMENT overlap, so
      // there's never an empty black viewport, yet no panel stays parked and
      // readable while the next is active. autoAlpha flips visible exactly when
      // a panel starts entering and hidden right after it has fully exited.
      tl.addLabel("metricsHold", 0)                                 // 0.0 -> 0.7 hold
        .addLabel("metricsExit", 0.7)
        .to(metrics, { yPercent: -100, duration: 0.8 }, "metricsExit")   // 0.7 -> 1.5
        .set(metrics, { autoAlpha: 0 }, 1.5)

        .addLabel("logosEnter", 1.3)                                // overlaps metrics exit ~0.2u
        .set(logos, { autoAlpha: 1 }, "logosEnter")
        .to(logos, { yPercent: 0, duration: 0.8 }, "logosEnter")    // 1.3 -> 2.1
        .addLabel("logosHold", 2.1)                                 // 2.1 -> 2.8 hold
        .addLabel("logosExit", 2.8)
        .to(logos, { yPercent: -100, duration: 0.8 }, "logosExit")  // 2.8 -> 3.6
        .set(logos, { autoAlpha: 0 }, 3.6)

        .addLabel("benefitsEnter", 3.4)                             // overlaps logos exit ~0.2u
        .set(benefits, { autoAlpha: 1 }, "benefitsEnter")
        .to(benefits, { yPercent: 0, duration: 0.8 }, "benefitsEnter")   // 3.4 -> 4.2
        .addLabel("benefitsHold", 4.2)                              // 4.2 -> 4.9 hold
        .addLabel("benefitsExit", 4.9)
        .to(benefits, { yPercent: -100, duration: 0.8 }, "benefitsExit");// 4.9 -> 5.7

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
        // From timeline position 0 so numbers read 0 on the first frame (no
        // final->0 reset flash) and finish counting up within the metrics hold.
        tl.fromTo(proxy, { p: 0 }, { p: 1, duration: 0.6, onUpdate: render }, 0);
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
