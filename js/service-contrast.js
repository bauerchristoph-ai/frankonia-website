/*
  Service "Vorteile" contrast modules — scroll-driven.

  Client 2026-08-04, second pass on this section: "me gusta la flecha pero hacé
  una flecha que se dibuje con el scroll", "los items de la lista vayan
  apareciendo con el efecto que ya tengo en la web", and "aplicá el mismo efecto
  de subrayado de 'Kennen Sie diese Herausforderungen?' en la columna derecha".

  All three are the same idea and this file drives them from ONE progress value
  per module, the way js/pain-hook-journey.js does on the homepage:

    0. the two column titles arrive — a mask slide-up, before anything else in the
                                      section moves (client 2026-08-07: "quiero que
                                      aparezcan de forma smooth y que su aparición sea
                                      importante… y después aparecerá la lista debajo");
    1. the module arrives   — opacity/translate, released once it is in view;
    2. the arrow draws      — stroke-dashoffset from full to 0, scrubbed;
    3. the panel's frame draws — the same dash trace, around the FRANKONIA box
                              (client 2026-08-07: "que el borde celeste se vaya
                              creando cuando escroleo, como hemos hecho con las
                              flechas"). See buildFrame() for why the rect is
                              measured in CSS pixels rather than given a viewBox;
    4. the marker fills     — --mark 0→1 on the phrase in the FRANKONIA column,
                              the same custom property .pain-hook__mark uses.

  Only paint- and composite-only properties are ever animated (stroke-dashoffset,
  background-size, opacity, transform), so none of this can trigger layout.

  Requires GSAP core + ScrollTrigger, self-hosted and loaded before this file. It
  rides the page's single Lenis + GSAP ticker (js/smooth-scroll.js) — never create
  a second Lenis instance.

  JS-ONLY-EVER-ENHANCES, same contract as every other motion primitive here:
    - `.service-contrast--live` is added ONLY from inside this script, and every
      rule that hides a module or holds the arrow undrawn is scoped under it. So
      no JS, a script error, a crawler, or prefers-reduced-motion all get the
      FINISHED state — items visible, arrow drawn, marks filled — never a section
      of dimmed text and invisible arrows. That is why .service-contrast__mark is
      background-size: 100% by DEFAULT and only wipes under `--live`: the first
      build had it the other way round and reduced motion showed no highlight at
      all (measured);
    - the dash length comes from the path's real getTotalLength(), never a
      hardcoded number, so the arrow draws completely at any width. Same for the
      frame, whose perimeter changes every time the panel reflows;
    - the frame SVG does not exist in the markup at all — this script creates it.
      Without the script the panel keeps the plain CSS `border` that is already
      there, i.e. the finished frame.
*/

(function initServiceContrast() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  const set = document.querySelector(".service-contrast__set");
  if (!set) return;

  const modules = gsap.utils.toArray(set.querySelectorAll("[data-contrast-module]"));
  if (!modules.length) return;

  // Reduced motion: the CSS default IS the finished state, so there is nothing
  // to do. Checked before the class is added, same guard as every other script
  // on this site.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(ScrollTrigger);

  // From here on the CSS may hide things, because this script will resolve them.
  set.classList.add("service-contrast--live");

  // ---- 0. the two column titles -----------------------------------------------
  // A mask slide-up, the same language js/title-reveal.js uses for this site's
  // headings: the text starts fully below its own clipped box and rises into it.
  // That is what makes the arrival read as deliberate rather than as a fade.
  //
  // ⚠️ Desktop only, and checked by MEASUREMENT, not by a media query in here: the
  // head row is `display: none` below 900px, and a ScrollTrigger on a zero-height
  // hidden element resolves its start against nothing. offsetParent === null is the
  // cheap, honest test for "is this actually laid out".
  const head = set.querySelector(".service-contrast__head");
  if (head && head.offsetParent !== null) {
    const cells = gsap.utils.toArray(head.querySelectorAll(".service-contrast__head-cell"));
    const inners = cells.map((cell) => {
      const inner = document.createElement("span");
      inner.className = "service-contrast__head-inner";
      while (cell.firstChild) inner.appendChild(cell.firstChild);
      cell.appendChild(inner);
      return inner;
    });
    // The clip is added only now, with the slide about to run — see the CSS note.
    head.classList.add("service-contrast__head--masked");

    gsap.fromTo(
      inners,
      { yPercent: 115 },
      {
        yPercent: 0,
        duration: 0.9,
        // The project's own premium curve (--easing-premium): expo-out, no
        // overshoot. Long enough to read as one movement, not a snap.
        ease: "expo.out",
        stagger: 0.14,
        scrollTrigger: {
          trigger: head,
          // EARLIER than a module's own `top 88%`, so the titles land first and the
          // list follows underneath — which is the order the client asked for. It is
          // also naturally true (the head sits above the modules); this only makes it
          // reliable rather than incidental.
          start: "top 92%",
          once: true,
        },
        // The clip exists only for the slide, so it is dropped once the text has
        // landed. Leaving a permanent `overflow: hidden` on a heading is how a future
        // edit — a longer word, a two-line wrap at some width — gets silently shaved.
        onComplete: () => head.classList.remove("service-contrast__head--masked"),
      }
    );
  }

  // ---- the FRANKONIA panel's drawn frame ---------------------------------------
  // A <rect> traced by stroke-dashoffset, the same mechanism as the arrow. Two
  // things are worth knowing before touching this:
  //
  //   · NO viewBox, deliberately. The panel's size is whatever its copy and its
  //     column make it, and it changes on every reflow. Without a viewBox one SVG
  //     user unit is one CSS pixel, so the rect can be set straight from the
  //     panel's measured box and the corner radius and stroke weight stay
  //     honest at every width. A fixed viewBox stretched to fit would oval the
  //     corners and thin the stroke on the long edges.
  //   · The rect is inset by HALF the stroke, because a stroke straddles its path.
  //     x = y = ring/2 with width = boxWidth − ring puts the painted band exactly on
  //     the ring the CSS border occupies, so the drawn frame and the static one are
  //     the same pixels. Nothing about the weight is hardcoded here — the ring is
  //     read back off the rendered border and the stroke comes from
  //     --contrast-frame-w (page-service.css), which has already moved twice
  //     (2px → 1px → 0.5px).
  const SVG_NS = "http://www.w3.org/2000/svg";

  function buildFrame(panel) {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "service-contrast__frame");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    const rect = document.createElementNS(SVG_NS, "rect");
    svg.appendChild(rect);
    panel.insertBefore(svg, panel.firstChild);
    return rect;
  }

  // Sets BOTH the frame's own box and the rect inside it, from one measurement of
  // the panel. Returns the perimeter, or 0 if the panel is not laid out yet (a
  // zero-length dash would divide the draw by nothing).
  //
  // ⚠️ `ring` is the panel's RENDERED border width, read back rather than taken from
  // --contrast-frame-w, and the two are deliberately different numbers: Chrome snaps
  // border-width to whole CSS pixels while an SVG stroke can be sub-pixel, so the
  // ring the border occupies (1px) is not the weight of the line drawn on it
  // (0.5px). Positioning off the requested value instead of the rendered one puts
  // the frame a fraction of a pixel inside the panel — measured, and it reads as a
  // soft edge rather than as a bug.
  function sizeFrame(panel, rect) {
    const cs = getComputedStyle(panel);
    const ring = parseFloat(cs.borderTopWidth) || 0;
    const radius = parseFloat(cs.borderTopLeftRadius) || 0;
    // getBoundingClientRect, NOT offsetWidth/offsetHeight — those round to whole
    // integers, and on this grid the panel is 699.53 x 154.83, so the rounded pair
    // would put the frame up to half a pixel off its own box. At a 0.5px stroke
    // that is the difference between a hairline and a smear.
    const box = panel.getBoundingClientRect();
    const bw = box.width;
    const bh = box.height;
    if (bw <= 0 || bh <= 0) return 0;

    // The SVG's containing block is the panel's padding box, so pulling back by the
    // ring lands its origin on the border box's own top-left, and the border-box
    // size then covers the panel exactly.
    const svg = rect.ownerSVGElement;
    svg.style.top = `${-ring}px`;
    svg.style.left = `${-ring}px`;
    svg.style.width = `${bw}px`;
    svg.style.height = `${bh}px`;

    // Centred on the ring, so the drawn line sits on the same pixels the static
    // border does whatever either of the two weights is.
    rect.setAttribute("x", ring / 2);
    rect.setAttribute("y", ring / 2);
    rect.setAttribute("width", bw - ring);
    rect.setAttribute("height", bh - ring);
    rect.setAttribute("rx", Math.max(0, radius - ring / 2));
    return rect.getTotalLength();
  }

  // The frame's slot in each module's timeline (total duration 1). It starts just
  // after the arrow so the two read as one gesture — the line reaches the panel and
  // the panel closes around it — and lands with the marker.
  const FRAME_AT = 0.12;
  const FRAME_DUR = 0.88;

  modules.forEach((mod) => {
    const arrow = mod.querySelector("[data-contrast-arrow] path");
    const marks = gsap.utils.toArray(mod.querySelectorAll(".service-contrast__mark"));
    const panel = mod.querySelector(".service-contrast__side--new");

    // The arrow's start state: fully retracted. Measured, not assumed — the SVG
    // scales with its column, and getTotalLength() is in viewBox units, which is
    // exactly what stroke-dasharray wants.
    let len = 0;
    if (arrow) {
      len = arrow.getTotalLength();
      gsap.set(arrow, { strokeDasharray: len, strokeDashoffset: len });
    }
    gsap.set(marks, { "--mark": 0 });

    // ⚠️ The frame is driven through a PROXY object, not by tweening its
    // strokeDashoffset directly the way the arrow is. GSAP records a tween's start
    // and end values once, and this one's start value is the perimeter — which
    // changes whenever the panel reflows. A baked-in length would animate toward a
    // stale number after a resize. Tweening 0→1 and deriving the offset in
    // onUpdate means the length is read live, so a resize only has to update the
    // dasharray (see the refresh handler below).
    let frameRect = null;
    let frameLen = 0;
    const frameState = { p: 0 };
    const renderFrame = () => {
      if (!frameRect || !frameLen) return;
      frameRect.setAttribute("stroke-dasharray", frameLen);
      frameRect.setAttribute("stroke-dashoffset", frameLen * (1 - frameState.p));
    };
    if (panel) {
      frameRect = buildFrame(panel);
      frameLen = sizeFrame(panel, frameRect);
      renderFrame();
    }

    // One scrubbed timeline per module. The range is the module's own pass
    // through the middle of the viewport: it starts when the module's top
    // reaches 80% of the way down the screen and finishes when its own middle
    // is at the middle — so the arrow and the marker complete WHILE the module
    // is comfortably readable, not after it has left.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: mod,
        start: "top 80%",
        end: "center 55%",
        scrub: 0.5,
      },
    });

    if (arrow) {
      tl.to(arrow, { strokeDashoffset: 0, duration: 1, ease: "none" }, 0);
    }
    if (frameRect) {
      tl.to(
        frameState,
        { p: 1, duration: FRAME_DUR, ease: "none", onUpdate: renderFrame },
        FRAME_AT
      );
    }
    if (marks.length) {
      // Starts a little after the arrow so the eye follows line → phrase, which
      // is the reading order the module is built around.
      tl.to(marks, { "--mark": 1, duration: 0.72, ease: "none" }, 0.28);
    }

    // The arrival is a discrete, ONE-WAY toggle: the module fades in once and
    // then stays at full contrast. It is deliberately not reversible — the first
    // build let modules dim again when they left the viewport, which measured as
    // three near-invisible blocks the moment you scrolled past the section, i.e.
    // the exact readability complaint this pass exists to fix. Progression is the
    // arrow's and the marker's job; the text's job is to be readable.
    ScrollTrigger.create({
      trigger: mod,
      start: "top 88%",
      once: true,
      onEnter: () => mod.classList.add("is-in"),
    });

    // The SVG's rendered size changes at the 900px breakpoint (it rotates from
    // vertical to horizontal), and a resize can change the path length. Re-read
    // it on ScrollTrigger's own refresh rather than adding a resize listener.
    if (arrow) {
      const resync = () => {
        const next = arrow.getTotalLength();
        if (Math.abs(next - len) < 0.5) return;
        len = next;
        gsap.set(arrow, { strokeDasharray: len });
        // Re-derive the offset from where the timeline currently is, so the
        // arrow does not jump on resize.
        const p = tl.scrollTrigger ? tl.scrollTrigger.progress : 1;
        gsap.set(arrow, { strokeDashoffset: len * (1 - Math.min(1, p / 1)) });
      };
      ScrollTrigger.addEventListener("refresh", resync);
    }

    // The panel reflows far more often than the arrow does — the column changes at
    // 900px, the copy rewraps at every width, and a font swap alone changes its
    // height. Re-measure on the same refresh and repaint at the position the
    // timeline is actually at, so the frame neither jumps nor goes stale.
    if (frameRect) {
      ScrollTrigger.addEventListener("refresh", () => {
        const next = sizeFrame(panel, frameRect);
        if (!next) return;
        frameLen = next;
        frameState.p = gsap.utils.clamp(0, 1, (tl.time() - FRAME_AT) / FRAME_DUR);
        renderFrame();
      });
    }
  });
})();
