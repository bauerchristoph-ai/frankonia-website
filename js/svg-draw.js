/*
  svg-draw.js — an inline SVG's line work draws itself as it scrolls into view.

  Client 2026-08-06, for risk card 03's supplied illustration on /werkschutz/
  ("me podés aplicar el mismo efecto al diagrama de Diebstahl im und um den
  Betrieb, solo a ese de los 4, que vaya formando las líneas"). Scoped by the
  attribute, so it is one card and nothing else.

  MARKUP CONTRACT
    <svg data-svg-draw aria-hidden="true"> … </svg>
  Inline geometry OR a sprite reference both work:
    <svg data-svg-draw><use href="#icon-flame"></svg>
  — the symbol's paths are cloned in at runtime (see inlineUses below), so the
  sprite stays the one place that geometry lives.
  Optional:
    data-svg-draw-start / data-svg-draw-end   ScrollTrigger start/end strings.
    data-svg-draw-trigger="<selector>"        drive the draw off an ANCESTOR
                                              (closest match) instead of the svg
                                              itself. Use it when the drawing sits
                                              well inside a card and should start
                                              when the CARD arrives, not when the
                                              drawing's own top does — those are
                                              two different scroll positions and
                                              the gap is the height of everything
                                              above it in the card.

  Only elements that carry a real `stroke` are ever touched, and each is dashed by
  its OWN getTotalLength() — never a shared constant, the same rule
  js/service-contrast.js and js/steps-sequence.js follow. Filled shapes are left
  alone on purpose: a dash offset on a fill does nothing, and in this drawing the
  fills are hidden-line occlusion (they hide edges behind crates and the truck
  body), so they must keep painting from the first frame or the drawing shows
  through itself.

  The stagger is a TOTAL spread (`amount`), not a per-element delay: this drawing
  has 51 strokes against a small icon's 10, and a fixed per-element delay would
  make the same effect last five times longer here. One value, any path count.

  JS-ONLY-EVER-ENHANCES, same contract as every other motion primitive here:
  nothing in CSS dashes anything. The dash is written by GSAP at runtime and only
  inside the branch that is about to animate it away, and it is cleared on
  completion so a finished drawing carries no inline style of ours. No JS, a script
  error, prefers-reduced-motion or a crawler that does not run JS all get the
  complete artwork.

  Requires GSAP + ScrollTrigger, loaded before this file.

  NOTE: js/steps-sequence.js does the same thing for a step's icon, but from inside
  its own step timeline, which is why it cannot just call this. If a third case
  turns up, extract the measure-and-dash helper rather than writing it a third time.
*/

(function initSvgDraw() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var svgs = document.querySelectorAll("[data-svg-draw]");
  if (!svgs.length) return;

  gsap.registerPlugin(ScrollTrigger);

  // ⚠️ A <use> CANNOT BE DRAWN, and that is why this exists.
  // An icon written as `<svg><use href="#icon-flame"></svg>` renders the symbol
  // from the shared sprite through a shadow tree, and nothing in the document can
  // reach into it — querySelectorAll finds no paths, so there is nothing to
  // measure or dash. Added 2026-08-10, when /brandwache-nuernberg/ asked for its
  // four Einsatzlagen icons to draw with the scroll and they are sprite symbols,
  // not a supplied illustration like the one this file was written for.
  //
  // The fix keeps the sprite as the SINGLE SOURCE OF TRUTH instead of pasting the
  // geometry into the page a second time: the symbol's children are cloned in and
  // the <use> is dropped, at runtime, only inside this function — which already
  // returned before now under reduced motion, without JS or without GSAP. In every
  // one of those cases the markup keeps its <use> and the icon renders exactly as
  // it always did.
  //
  // The viewBox has to come across too. A <use> gets its coordinate system from the
  // symbol; a bare <svg> does not have one, so the cloned 24-unit geometry would
  // render at 24px in the corner of a 40px box.
  function inlineUses(svg) {
    Array.prototype.forEach.call(svg.querySelectorAll("use"), function (use) {
      var href =
        use.getAttribute("href") ||
        use.getAttributeNS("http://www.w3.org/1999/xlink", "href");
      if (!href || href.charAt(0) !== "#") return;
      var symbol = document.getElementById(href.slice(1));
      if (!symbol) return;
      if (!svg.getAttribute("viewBox") && symbol.getAttribute("viewBox")) {
        svg.setAttribute("viewBox", symbol.getAttribute("viewBox"));
      }
      var frag = document.createDocumentFragment();
      Array.prototype.forEach.call(symbol.children, function (child) {
        frag.appendChild(child.cloneNode(true));
      });
      use.parentNode.replaceChild(frag, use);
    });
  }

  Array.prototype.forEach.call(svgs, function (svg) {
    inlineUses(svg);

    var stroked = Array.prototype.filter.call(
      svg.querySelectorAll("path, rect, circle, ellipse, line, polyline, polygon"),
      function (el) {
        // The attribute first, then the COMPUTED value. A supplied illustration
        // carries `stroke="…"` on every path, but a sprite symbol carries none: the
        // whole sprite's paint lives on its `<g id="icon-defs">` wrapper and the
        // call site restates `stroke: currentColor` in CSS (the trap this project
        // documents five times over). Reading the attribute alone therefore found
        // zero strokes in a cloned symbol and drew nothing.
        // Filled shapes stay excluded either way: SVG's own default is
        // `stroke: none`, so a fill with no stroke computes to "none" — which is
        // what keeps card 03's hidden-line occlusion painting from frame one.
        var s = el.getAttribute("stroke");
        if (!s) s = window.getComputedStyle(el).stroke;
        return (
          s && s !== "none" && typeof el.getTotalLength === "function" && el.getTotalLength() > 0
        );
      }
    );
    if (!stroked.length) return;

    // ⚠️ A DASH-DRAW AND A DESIGNED DASH PATTERN CANNOT SHARE A PATH. Drawing works
    // by writing stroke-dasharray/-dashoffset; a path that already uses
    // stroke-dasharray for its own look (the blue ghost crates, the grey ground
    // guides) has that pattern OVERWRITTEN for the whole scrub, so it renders as a
    // solid growing line and only snaps back to dashes on completion. That is the
    // "las líneas punteadas no funcionan" the client reported 2026-08-07, and it was
    // introduced by this very effect.
    //
    // So they are split: paths without a pattern are drawn, paths WITH one are faded
    // in over the same window instead. Their dasharray is never touched, so the
    // designer's rhythm survives at every scroll position, including mid-scrub and
    // scrolling back up. Measured on card 03: 9 of its 51 strokes are in this group.
    var draw = [];
    var dashed = [];
    stroked.forEach(function (el) {
      var own = el.getAttribute("stroke-dasharray");
      if (own && own !== "none" && own !== "0") dashed.push(el);
      else draw.push(el);
    });

    var trigSel = svg.getAttribute("data-svg-draw-trigger");
    var trigger = (trigSel && svg.closest(trigSel)) || svg;

    // ⚠️ REVERSED 2026-08-07 (client: "ni bien aparezca la card empiece esta
    // animación"). It used to start deliberately LATE — "top 62%" on the svg itself —
    // so the drawing would not happen behind the card's own reveal blur. Measured,
    // that cost far more than it bought: the drawings were still finishing with the
    // card's top 122px ABOVE the viewport. The blur is brief and scrubbed; a drawing
    // that finishes off-screen is not a drawing anyone sees.
    var range = {
      trigger: trigger,
      start: svg.getAttribute("data-svg-draw-start") || "top 88%",
      end: svg.getAttribute("data-svg-draw-end") || "top 34%",
      scrub: 0.6,
    };
    var timing = { duration: 0.5, ease: "power1.inOut", stagger: { amount: 0.9 } };

    if (draw.length) {
      gsap.fromTo(
        draw,
        {
          strokeDasharray: function (i, el) {
            return el.getTotalLength();
          },
          strokeDashoffset: function (i, el) {
            return el.getTotalLength();
          },
        },
        Object.assign({}, timing, {
          strokeDashoffset: 0,
          scrollTrigger: range,
          // Clears the inline dash once drawn, so a finished drawing carries no
          // inline style of ours.
          onComplete: function () {
            draw.forEach(function (el) {
              el.style.strokeDasharray = "";
              el.style.strokeDashoffset = "";
            });
          },
        })
      );
    }

    // The designed-dash paths arrive with the same rhythm, by OPACITY. Same range,
    // same stagger, so they read as part of the one drawing rather than a layer that
    // was already sitting there — and their dasharray is never touched.
    if (dashed.length) {
      gsap.fromTo(
        dashed,
        { opacity: 0 },
        Object.assign({}, timing, {
          opacity: 1,
          scrollTrigger: Object.assign({}, range),
        })
      );
    }
  });
})();
