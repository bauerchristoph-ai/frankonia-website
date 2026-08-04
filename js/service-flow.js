/*
  Service "Leistungsumfang" flow — pinned image mask reveal.

  Client 2026-08-03, reference: a GSAP "pinned image mask reveal on scroll" pen.
  The left column lists the six duties, one per screen; the right column is a
  stack of six photos that stays put while the text scrolls, and each photo
  clips away from the bottom (clip-path: inset) to expose the one beneath it,
  scrubbed 1:1 with scroll. Each photo also drifts its object-position while it
  is on screen, so the visible image is never completely static.

  Adapted to this project rather than copied:
    - the media column is held by CSS `position: sticky`, NOT ScrollTrigger's
      `pin` — the same approach as js/system-story.js and js/konzept-seq.js;
    - it rides the page's single Lenis + GSAP ticker (js/smooth-scroll.js). The
      reference creates its own Lenis instance; a second one must never exist;
    - no animated page background (this page alternates section colours itself,
      via the pixel seams).

  Requires GSAP core + ScrollTrigger, self-hosted and loaded before this file.

  JS-ONLY-EVER-ENHANCES, same contract as every other motion primitive here:
    - the clip-path start state is applied ONLY from inside this script;
    - page-service.css's BASE layout is the fallback (six text + photo pairs in
      normal flow, all visible), the stacked/sticky desktop layout is itself
      gated behind `prefers-reduced-motion: no-preference` — so no JS, a script
      error, reduced motion, or a crawler all get the readable stacked version,
      never a single photo with five hidden behind it;
    - gsap.matchMedia() ties the animation to the exact same 1024px +
      no-preference query the CSS uses, and reverts it cleanly on resize.
*/

(function initServiceFlow() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  const flow = document.querySelector("[data-service-flow]");
  if (!flow) return;

  const frames = gsap.utils.toArray(flow.querySelectorAll(".service-flow__frame"));
  const imgs = frames.map((frame) => frame.querySelector("img")).filter(Boolean);
  if (imgs.length < 2) return;

  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  // Must match the media query in page-service.css that switches on the
  // stacked/sticky layout — the animation is meaningless without it.
  mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
    // The heading is pinned at the top of the section and the photo column
    // sticks directly below it, so the photo's top offset has to equal the
    // heading's real height. page-service.css ships a safe constant
    // (--flow-title-h: 8rem); this replaces it with the measured value, since
    // the heading's height changes with the viewport (its font-size is a clamp,
    // and it wraps to two lines on narrower desktops).
    const intro = flow.querySelector(".service-flow__intro");
    const syncTitleHeight = () => {
      if (!intro) return;
      flow.style.setProperty("--flow-title-h", `${Math.ceil(intro.offsetHeight)}px`);
    };
    syncTitleHeight();
    // ScrollTrigger fires this on resize and on its own refreshes, so there is
    // no separate resize listener to debounce.
    ScrollTrigger.addEventListener("refreshInit", syncTitleHeight);

    // Start state: every photo fully drawn (the stack's own z-index decides
    // what is actually seen), slightly low crop so there is room to drift up.
    gsap.set(imgs, { clipPath: "inset(0px)", objectPosition: "50% 55%" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: flow,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
      },
    });

    // One segment per transition: photo i wipes away while photo i+1 drifts.
    // Segments are appended, so the six steps map onto the six screens of
    // scroll the CSS reserves (78svh each).
    imgs.forEach((img, i) => {
      const next = imgs[i + 1];
      if (!next) return;

      const segment = gsap.timeline();
      segment.to(
        img,
        {
          // Bottom inset to 100% = wiped from the bottom edge upward.
          clipPath: "inset(0px 0px 100%)",
          objectPosition: "50% 62%",
          duration: 1,
          ease: "none",
        },
        0
      );
      segment.to(
        next,
        { objectPosition: "50% 45%", duration: 1, ease: "none" },
        0
      );

      tl.add(segment);
    });

    // matchMedia cleanup: kill the timeline and its trigger, and drop the
    // inline styles so the reverted layout is not left half-clipped.
    return () => {
      ScrollTrigger.removeEventListener("refreshInit", syncTitleHeight);
      flow.style.removeProperty("--flow-title-h");
      tl.scrollTrigger && tl.scrollTrigger.kill();
      tl.kill();
      gsap.set(imgs, { clearProps: "clipPath,objectPosition" });
    };
  });
})();
