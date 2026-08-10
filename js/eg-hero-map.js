/*
  /einsatzgebiete/ hero map — the outline of Franconia drawing itself, then the
  ten coverage cities highlighting, then their location pins popping.

  Client brief 2026-08-10: "solo el contorno de lo que es Frankonia y que vayan
  popping up los iconitos de location en las ciudades importantes… se forme el
  mapa de Frankonia y después se destaquen las distintas ciudades (se fill con
  un celeste y se hace un borde celeste) y the location icons pop up".

  The SVG it animates is GENERATED — docs/design-sources/franken-map.py, from
  the same real OSM boundaries the Leaflet map further down the page draws. It
  is inline in pages/einsatzgebiete.html; regenerate and paste, never hand-edit
  its path data.

  Sequence, one timeline, three beats that overlap rather than queue:
    1. the three Regierungsbezirke draw, as stroke-dashoffset, staggered;
    2. each region's own fill fades in behind its finished line;
    3. per city: halo scales up, the real polygon fills, the pin drops in with
       a small overshoot, the four labels fade — all staggered west-to-east so
       it reads as sweeping across the region rather than blinking on.

  ⚠️ WHY NOT js/svg-draw.js, the site's existing drawing primitive: that one
  dashes EVERY stroked path in its target and reveals them as one staggered
  group. Here only the three region outlines may be dashed — the city shapes
  and the pins are filled artwork that a dash would do nothing to, and the
  cities need their own beat AFTER the outline rather than inside its stagger.
  Same technique, different choreography, so it is its own file (the same call
  js/steps-sequence.js and js/case-cards.js already make).

  JS-ONLY-EVER-ENHANCES, the contract every motion primitive here follows:
    - the CSS resting state IS the finished map. Nothing in
      page-einsatzgebiete.css hides any of this, so no JS, a script error, a
      crawler, or prefers-reduced-motion all render the complete map;
    - this file is the ONLY thing that ever applies the start state, and only
      immediately before animating it;
    - `.eg-hero__map--live` is added here too, so any CSS that should only
      apply while animating can hang off it.

  Requires GSAP core, self-hosted and loaded before this file. No ScrollTrigger:
  the hero is above the fold at first paint, so this plays once on load — the
  same call js/hero-reveal.js makes, and the reason /referenzen/'s hero once had
  a scrubbed reveal bug worth not repeating.
*/

(function initEgHeroMap() {
  if (typeof gsap === "undefined") return;

  const svg = document.querySelector("[data-eg-hero-map]");
  if (!svg) return;

  // Checked before anything is touched, so the reduced-motion path never even
  // applies a start state — it simply leaves the finished map alone.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const regions = gsap.utils.toArray(svg.querySelectorAll(".eg-map-svg__region"));
  const cities = gsap.utils.toArray(svg.querySelectorAll(".eg-map-svg__city"));
  if (!regions.length || !cities.length) return;

  // West-to-east, so the highlight sweeps across the map instead of firing in
  // the DOM's own (tour) order, which jumps around geographically.
  cities.sort((a, b) => {
    const ax = a.querySelector(".eg-map-svg__halo").getAttribute("cx");
    const bx = b.querySelector(".eg-map-svg__halo").getAttribute("cx");
    return parseFloat(ax) - parseFloat(bx);
  });

  const halos = cities.map((c) => c.querySelector(".eg-map-svg__halo"));
  const shapes = cities.map((c) => c.querySelector(".eg-map-svg__shape"));
  const pins = cities.map((c) => c.querySelector(".eg-map-svg__pin"));
  const labels = cities.map((c) => c.querySelector(".eg-map-svg__label")).filter(Boolean);

  svg.classList.add("eg-map-svg--live");

  // ---- Start state, applied here and nowhere else ----
  // Per-path length via a FUNCTION value, never one shared constant: the three
  // regions differ in perimeter, and a single dash length would leave the short
  // ones finished early and the long one still drawing at the end. Same rule
  // js/svg-draw.js and js/service-contrast.js both follow.
  // ⚠️ THE SIGNATURE IS (index, element) — index FIRST. Writing this as
  // `(el) => el.getTotalLength()` binds the index to `el`, throws on the first
  // call and kills this whole script. It fails SAFE (the CSS resting state is
  // the finished map, so the page looks right) which is exactly why it is easy
  // to miss: the only symptom is that nothing ever animates.
  const len = (i, el) => el.getTotalLength();
  gsap.set(regions, {
    strokeDasharray: len,
    strokeDashoffset: len,
    fillOpacity: 0,
  });
  gsap.set(halos, { scale: 0, transformOrigin: "center", opacity: 0 });
  gsap.set(shapes, { opacity: 0 });
  // The pin's own transform-origin is its TIP (bottom centre), so scaling from
  // 0 reads as dropping onto the city rather than inflating around it.
  gsap.set(pins, { scale: 0, transformOrigin: "50% 100%", opacity: 0 });
  gsap.set(labels, { opacity: 0, x: -6 });

  const tl = gsap.timeline({
    // A beat of air after paint. The hero's own copy cascade (hero-reveal.js)
    // runs first; the map arriving underneath it reads as a second movement
    // rather than as a competing one.
    delay: 0.35,
    defaults: { ease: "power2.out" },
  });

  tl.to(regions, {
    strokeDashoffset: 0,
    duration: 1.5,
    ease: "power1.inOut",
    stagger: { amount: 0.45 },
  })
    // `<` starts this with the PREVIOUS tween rather than after it, and the
    // offset means the fill arrives while the line is still travelling — the
    // shape reads as filling in behind its own edge.
    .to(regions, { fillOpacity: 1, duration: 0.9, stagger: { amount: 0.45 } }, "<0.55")

    // The cities begin before the outline finishes, for the same reason: three
    // fully-queued beats read as three separate animations.
    .to(halos, { scale: 1, opacity: 1, duration: 0.7, stagger: { amount: 0.55 } }, "-=0.5")
    .to(shapes, { opacity: 1, duration: 0.5, stagger: { amount: 0.55 } }, "<0.1")
    .to(
      pins,
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        // The one place an overshoot belongs on this site: a pin dropping onto
        // a map is the gesture, and back.out is what makes it read as landing.
        ease: "back.out(2)",
        stagger: { amount: 0.6 },
      },
      "<0.15"
    )
    .to(labels, { opacity: 1, x: 0, duration: 0.5, stagger: 0.08 }, "-=0.35")

    // ⚠️ CLEAR THE INLINE PROPS AT THE END, do not leave them at their final
    // values. Two reasons, both measured on this project before: a spent
    // `stroke-dasharray` keeps overriding the stylesheet, so a later change to
    // the dash rhythm would silently do nothing; and inline transforms on 30+
    // elements are what the 2026-08-08 Layerize investigation found the site
    // paying for. The final values are identical to the CSS resting state, so
    // clearing them is invisible.
    .add(() => {
      gsap.set(regions, { clearProps: "strokeDasharray,strokeDashoffset,fillOpacity" });
      gsap.set([...halos, ...shapes, ...pins, ...labels], {
        clearProps: "transform,opacity,scale,x",
      });
      svg.classList.remove("eg-map-svg--live");
    });
})();
