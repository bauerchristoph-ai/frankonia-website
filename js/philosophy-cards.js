/*
  Homepage "Sicherheit, wie wir sie verstehen" (Sektion 12) — the three cards
  draw their own frame and highlight their key phrase as you scroll.

  Client 2026-08-08: "hacé el diseño de estas tres cards hermoso, que aparezcan
  smoothly cuando escroleamos y que pase lo mismo que pasa en la sección de
  werkschutz […] donde la caja se va formando por el scroll y se va subrayando
  las cosas importantes".

  Per card, one scrubbed progress value drives two things:
    1. the frame draws — an SVG <rect> traced by stroke-dashoffset, replacing the
       CSS border that holds its place;
    2. the marker fills — --mark 0→1 on the card's load-bearing phrase, the same
       custom property .pain-hook__mark and .service-contrast__mark use.

  The card's ARRIVAL is not here: the grid already carries data-item-reveal, the
  shared primitive (js/item-reveal.js). That preset animates opacity, translateY
  and blur — deliberately no scale, which matters, because sizeFrame() below reads
  getBoundingClientRect() and a scale would make it report the mid-animation box
  instead of the layout box. If the reveal preset on this grid ever changes to one
  that scales, this measurement has to change with it.

  Only paint- and composite-only properties are ever animated (stroke-dashoffset,
  background-size), so none of this can trigger layout.

  Requires GSAP core + ScrollTrigger, self-hosted and loaded before this file. It
  rides the page's single Lenis + GSAP ticker (js/smooth-scroll.js) — never create
  a second Lenis instance.

  ⚠️ SECOND CONSUMER of this frame-drawing mechanism; js/service-contrast.js is the
  first, on /werkschutz/. It is duplicated rather than shared on purpose: this
  project's own rule is that the THIRD consumer promotes a pattern to a shared
  primitive, and generalizing service-contrast.js would mean editing a script that
  drives a live page for no gain today. If a third page wants a drawn frame, make
  it `data-draw-frame` in one shared file and retire both copies — do not paste it
  a third time. Until then, a fix to the measuring logic here belongs in that file
  too.

  JS-ONLY-EVER-ENHANCES, same contract as every other motion primitive here:
    - `.philosophy--live` is added ONLY from inside this script, and every rule
      that un-draws a frame or empties a mark is scoped under it. No JS, a script
      error, a crawler or prefers-reduced-motion all get the FINISHED state —
      solid frames, filled highlights — never blank boxes;
    - the frame SVG does not exist in the markup at all. Without this script the
      card keeps the plain CSS border that is already there, i.e. the finished
      frame;
    - the dash length comes from the rect's real getTotalLength(), never a
      hardcoded number, so it draws completely at any card size.
*/

(function initPhilosophyCards() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  const grid = document.querySelector("[data-philosophy-cards]");
  if (!grid) return;

  const cards = gsap.utils.toArray(grid.querySelectorAll(".philosophy__item"));
  if (!cards.length) return;

  // Reduced motion: the CSS default IS the finished state, so there is nothing to
  // do. Checked BEFORE the class is added — the same guard order every script on
  // this site uses, and the reason a reduced-motion visitor never sees a blank
  // card waiting for a scroll that will not animate it.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(ScrollTrigger);

  // From here on the CSS may hide things, because this script will resolve them.
  grid.classList.add("philosophy--live");

  const SVG_NS = "http://www.w3.org/2000/svg";

  function buildFrame(card) {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "philosophy__frame");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    const rect = document.createElementNS(SVG_NS, "rect");
    svg.appendChild(rect);
    card.insertBefore(svg, card.firstChild);
    return rect;
  }

  // Sets BOTH the frame's own box and the rect inside it, from one measurement of
  // the card. Returns the perimeter, or 0 if the card is not laid out yet (a
  // zero-length dash would divide the draw by nothing).
  //
  // ⚠️ `ring` is the card's RENDERED border width, read back rather than taken
  // from --phil-frame-w, and the two are deliberately different numbers: Chrome
  // snaps border-width to whole CSS pixels while an SVG stroke can be sub-pixel,
  // so the ring the border occupies (1px) is not the weight of the line drawn on
  // it (0.5px). Positioning off the requested value instead of the rendered one
  // puts the frame a fraction of a pixel inside the card.
  //
  // ⚠️ getBoundingClientRect, NOT offsetWidth/offsetHeight — those round to whole
  // integers and these cards are fractional (a 1fr track of a gapped grid rarely
  // lands on an integer). At a 0.5px stroke, half a pixel is the difference
  // between a hairline and a smear.
  function sizeFrame(card, rect) {
    const cs = getComputedStyle(card);
    const ring = parseFloat(cs.borderTopWidth) || 0;
    const radius = parseFloat(cs.borderTopLeftRadius) || 0;
    const box = card.getBoundingClientRect();
    const bw = box.width;
    const bh = box.height;
    if (bw <= 0 || bh <= 0) return 0;

    // An absolutely positioned child's containing block is the PADDING box, so
    // pulling back by the ring lands the SVG's origin on the border box's own
    // top-left; the border-box size then covers the card exactly. With no viewBox
    // one SVG user unit is one CSS pixel, so the rect goes straight in from the
    // same measurement with no projection step — which is also what keeps the
    // corner radius round and the stroke even on the long edges at any width.
    const svg = rect.ownerSVGElement;
    svg.style.top = `${-ring}px`;
    svg.style.left = `${-ring}px`;
    svg.style.width = `${bw}px`;
    svg.style.height = `${bh}px`;

    // Inset by HALF the ring, because a stroke straddles its own path: this puts
    // the painted band exactly on the ring the CSS border occupies, whatever
    // either of the two weights is.
    rect.setAttribute("x", ring / 2);
    rect.setAttribute("y", ring / 2);
    rect.setAttribute("width", bw - ring);
    rect.setAttribute("height", bh - ring);
    rect.setAttribute("rx", Math.max(0, radius - ring / 2));
    return rect.getTotalLength();
  }

  // The frame's slot in each card's timeline (total duration 1). It owns most of
  // the range; the mark starts partway through so the eye follows box → phrase.
  const FRAME_AT = 0;
  const FRAME_DUR = 0.82;

  cards.forEach((card) => {
    // ---- the drawn frame ------------------------------------------------------
    // Built FIRST, before the title tween below, because that tween has to be able
    // to re-measure it when it finishes — see the note there.
    //
    // ⚠️ The frame is driven through a PROXY object, not by tweening its
    // strokeDashoffset directly. GSAP records a tween's start and end values once,
    // and this one's start value is the perimeter — which changes whenever the
    // card reflows (the copy rewraps at every width, and the 768/1200 breakpoints
    // change the column count outright). A baked-in length would animate toward a
    // stale number after a resize. Tweening 0→1 and deriving the offset in
    // onUpdate means the length is read live.
    const frameRect = buildFrame(card);
    let frameLen = sizeFrame(card, frameRect);
    const frameState = { p: 0 };
    const renderFrame = () => {
      if (!frameLen) return;
      frameRect.setAttribute("stroke-dasharray", frameLen);
      frameRect.setAttribute("stroke-dashoffset", frameLen * (1 - frameState.p));
    };
    renderFrame();

    // Re-measure and repaint at wherever the timeline currently is, so the frame
    // neither jumps nor goes stale. Declared here so the title tween can call it.
    let resync = () => {};

    // ---- the title's arrival --------------------------------------------------
    // A mask slide-up, the same language js/title-reveal.js uses for this site's
    // headings and js/service-contrast.js uses for /werkschutz/'s column titles:
    // the text starts fully below its own clipped box and rises into it. That is
    // what makes it read as a deliberate arrival rather than as one more fade.
    //
    // Its own trigger, slightly EARLIER than the frame's, so the title lands and
    // the box then closes around it — title → box → highlight, which is the
    // reading order the card is built around. `once`, not scrubbed: a heading
    // that slides back down when you scroll up reads as broken.
    const title = card.querySelector(".philosophy__item-title");
    if (title && !title.querySelector(".philosophy__item-title-inner")) {
      const inner = document.createElement("span");
      inner.className = "philosophy__item-title-inner";
      while (title.firstChild) inner.appendChild(title.firstChild);
      title.appendChild(inner);

      // ⚠️ The clip goes on HERE, not in the tween's onStart. A fromTo with a
      // scrollTrigger still renders its FROM state immediately (immediateRender
      // defaults to true), so between first paint and the trigger firing the
      // title is already pushed 115% down its own box. Clipping only onStart
      // leaves that whole window with the heading displaced and NOT clipped —
      // i.e. sitting on top of the paragraph below it. It is removed onComplete,
      // which is the half that does belong to the tween.
      title.classList.add("philosophy__item-title--masked");

      gsap.fromTo(
        inner,
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.9,
          // The project's own premium curve (--easing-premium): expo-out, no
          // overshoot. Long enough to read as one movement, not a snap.
          ease: "expo.out",
          scrollTrigger: { trigger: card, start: "top 90%", once: true },
          onComplete: () => {
            title.classList.remove("philosophy__item-title--masked");
            // ⚠️ AND RE-MEASURE THE FRAME. Dropping the mask makes the card
            // SHORTER — the --masked rule carries `padding-bottom: 0.12em`, which
            // is 3px at this title size. sizeFrame() ran while the mask was still
            // on, so without this the drawn frame stays 3px taller than the card
            // it is tracing, with its bottom edge floating below the card's own.
            // Measured: card 422.25 → 419.25px, SVG stuck at 422.25.
            resync();
          },
        }
      );
    }

    const marks = gsap.utils.toArray(card.querySelectorAll(".philosophy__mark"));
    gsap.set(marks, { "--mark": 0 });

    // One scrubbed timeline per card, over the card's own pass through the middle
    // of the viewport: it starts as the card's top reaches 85% down the screen and
    // finishes with the card's middle just above centre — so the frame closes and
    // the phrase lights while the card is comfortably readable, not after it has
    // gone by. Per-card rather than one for the grid: at 1200px+ the three sit
    // side by side and share a range, but below 768px they are stacked a screen
    // apart and a shared range would light the third one before it arrived.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        end: "center 45%",
        scrub: 0.5,
      },
    });

    tl.to(
      frameState,
      { p: 1, duration: FRAME_DUR, ease: "none", onUpdate: renderFrame },
      FRAME_AT
    );

    if (marks.length) {
      tl.to(marks, { "--mark": 1, duration: 0.6, ease: "none" }, 0.34);
    }

    resync = () => {
      const next = sizeFrame(card, frameRect);
      if (!next) return;
      frameLen = next;
      frameState.p = gsap.utils.clamp(0, 1, (tl.time() - FRAME_AT) / FRAME_DUR);
      renderFrame();
    };

    // The card's box changes for more reasons than a scroll refresh knows about:
    // the column count flips at 768 and 1200, the copy rewraps at every width, a
    // font swap changes its height, and — the one that actually bit — the title's
    // own mask adds and then removes 3px of padding mid-animation. A
    // ResizeObserver watches the thing we actually care about (this card's box)
    // rather than a proxy for it, so every one of those is covered by construction
    // instead of by remembering to add another listener.
    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(resync).observe(card);
    } else {
      // Older engines: ScrollTrigger's own refresh fires on resize, which covers
      // the layout cases though not the mask one — hence the explicit resync()
      // in the title tween's onComplete above, which runs either way.
      ScrollTrigger.addEventListener("refresh", resync);
    }
  });
})();
