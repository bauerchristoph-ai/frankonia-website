/*
  Service "Leistungsumfang" flow — 50/50 editorial scrollytelling.

  Client brief 2026-08-04: "a premium 50/50 scroll-driven storytelling
  experience", desktop and large tablet only, mobile untouched. The left half is
  the heading plus the six duties, revealed one per scroll step and ACCUMULATING
  (every revealed duty stays readable); the right half is one large sticky image
  panel that crossfades to the active duty's photo.

  This REPLACES the 2026-08-03 clip-path mask wipe. That one replaced each photo
  while the text scrolled past and away — the behaviour the brief rules out
  ("do not make the text pass by and disappear"). Git has it.

  What this file does, and deliberately all it does:
    - adds `.service-flow--stepped`, which is what switches the CSS states on;
    - keeps one active index in sync with scroll progress;
    - crossfades the photo stack to match.
  The layout, all three visual states and the fallback are page-service.css's.
  There is no pin, no scroll hijacking and no snapping: one ScrollTrigger reads
  native scroll progress over the flow's own height, so scrolling up reverses
  the state simply because progress goes down again.

  Requires GSAP core + ScrollTrigger, self-hosted and loaded before this file.
  It rides the page's single Lenis + GSAP ticker (js/smooth-scroll.js) — never
  create a second Lenis instance.

  JS-ONLY-EVER-ENHANCES, same contract as every other motion primitive here:
    - `.service-flow--stepped` is added ONLY from inside this script, and the
      rules that hide a not-yet-reached duty are all scoped under it. So no JS, a
      script error, or a crawler leaves every duty visible and readable;
    - page-service.css's BASE layout (six text + photo pairs in normal flow) is
      the fallback, and the sticky 50/50 layout is itself gated behind
      `prefers-reduced-motion: no-preference`;
    - gsap.matchMedia() ties this to the exact same query the CSS uses, and
      reverts it cleanly on resize.
*/

(function initServiceFlow() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  const flow = document.querySelector("[data-service-flow]");
  if (!flow) return;

  const steps = gsap.utils.toArray(flow.querySelectorAll("[data-flow-step]"));
  const frames = gsap.utils.toArray(flow.querySelectorAll(".service-flow__frame"));
  const listViewport = flow.querySelector("[data-flow-viewport]");
  const listTrack = flow.querySelector("[data-flow-track]");
  if (steps.length < 2 || frames.length < steps.length) return;
  if (!listViewport || !listTrack) return;

  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  // Must match the media query in page-service.css that switches on the sticky
  // 50/50 layout — the reveal is meaningless, and the photo stack unreadable,
  // without it. 1152px is measured; the reasoning is in that file's comment.
  mm.add("(min-width: 1152px) and (prefers-reduced-motion: no-preference)", () => {
    const count = steps.length;
    let active = -1;

    // Start state. Frame 01 is the one already on top of the stack in CSS, so
    // setting it to opacity 1 and the rest to 0 changes nothing visible — it
    // just moves the stack from "z-index decides" to "opacity decides", which is
    // what makes a crossfade possible. Done here, not in CSS, so a visitor
    // without JS keeps the z-index version and never an empty panel.
    gsap.set(frames, { opacity: 0 });
    gsap.set(frames[0], { opacity: 1 });

    // Only now does the hiding of not-yet-reached duties exist.
    flow.classList.add("service-flow--stepped");

    // How much of the accumulated list does not fit, for the duty at `index`.
    // On a tall viewport this is always 0 and nothing ever moves — the whole
    // list ends up visible, which is the composition this is designed for. On a
    // short laptop the six duties genuinely cannot coexist on one screen at a
    // readable size (measured: the block needs ~1180-1340px depending on width),
    // so the list slides up by exactly the overflow, keeping the ACTIVE duty
    // fully in view. Read fresh each time rather than cached: the column's
    // height is in svh and its padding in vh, so both change with the viewport.
    const overflowFor = (index) => {
      const available = listViewport.clientHeight;
      if (!available) return 0;
      const step = steps[index];
      // Bottom of the active duty measured inside the track, which is the only
      // frame of reference that is unaffected by the shift already applied.
      const bottom = step.offsetTop - listTrack.offsetTop + step.offsetHeight;
      return Math.max(0, Math.round(bottom - available));
    };

    const setActive = (index) => {
      if (index === active) return;
      const previous = active;
      active = index;

      steps.forEach((step, i) => {
        step.classList.toggle("is-active", i === index);
        // Past = revealed and still readable. Everything after the active index
        // keeps neither class, which is the hidden "future" state.
        step.classList.toggle("is-past", i < index);
      });

      const shift = overflowFor(index);
      listTrack.style.transform = shift ? `translateY(${-shift}px)` : "";
      // The soft top edge is only wanted while something is actually cut off.
      listViewport.classList.toggle("is-shifted", shift > 0);

      // Crossfade. `overwrite: "auto"` is what keeps a fast scroll from leaving
      // two photos half-visible: a new tween on the same property kills the one
      // in flight instead of queueing behind it.
      frames.forEach((frame, i) => {
        gsap.to(frame, {
          opacity: i === index ? 1 : 0,
          duration: 0.55,
          ease: "power2.out",
          overwrite: "auto",
        });
      });

      // A very small settle on the incoming photo — the brief's "optionally add
      // a very small scale". Only on a real change of step, never on the initial
      // state, so arriving at the section does not start with a zoom.
      if (previous !== -1) {
        const img = frames[index].querySelector("img");
        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.04 },
            { scale: 1, duration: 1.1, ease: "power2.out", overwrite: "auto" }
          );
        }
      }
    };

    // Duty 01 is active before the trigger ever fires, so scrolling into the
    // section never shows an empty list or an empty panel, and scrolling back
    // out above it leaves the same first state.
    setActive(0);

    // The shift depends on the column's measured height, so it has to be
    // recomputed whenever the viewport changes. ScrollTrigger already fires
    // refreshInit on resize, so there is no separate listener to debounce.
    const resync = () => {
      if (active < 0) return;
      const shift = overflowFor(active);
      listTrack.style.transform = shift ? `translateY(${-shift}px)` : "";
      listViewport.classList.toggle("is-shifted", shift > 0);
    };
    ScrollTrigger.addEventListener("refreshInit", resync);

    const st = ScrollTrigger.create({
      trigger: flow,
      // The flow's own height is the track (6 x --flow-step-scroll in the CSS),
      // and both columns are sticky for exactly it, so progress 0->1 maps
      // 1:1 onto "the panel is pinned" — no lead-in or lag to compensate for.
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        // Equal zones, floor'd: each duty owns one sixth of the track. clamp
        // catches progress === 1 exactly, which would otherwise index past the
        // last step.
        const index = Math.min(count - 1, Math.floor(self.progress * count));
        setActive(index);
      },
    });

    // matchMedia cleanup: drop the class the CSS states depend on, clear the
    // inline opacities so the reverted layout is not left with five invisible
    // photos, and reset the step classes.
    return () => {
      st.kill();
      ScrollTrigger.removeEventListener("refreshInit", resync);
      flow.classList.remove("service-flow--stepped");
      listViewport.classList.remove("is-shifted");
      listTrack.style.removeProperty("transform");
      steps.forEach((step) => step.classList.remove("is-active", "is-past"));
      gsap.set(frames, { clearProps: "opacity" });
      frames.forEach((frame) => {
        const img = frame.querySelector("img");
        if (img) gsap.set(img, { clearProps: "scale" });
      });
      active = -1;
    };
  });
})();
