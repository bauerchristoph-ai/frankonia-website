/*
  Service "Vorteile" contrast modules — scroll-driven.

  Client 2026-08-04, second pass on this section: "me gusta la flecha pero hacé
  una flecha que se dibuje con el scroll", "los items de la lista vayan
  apareciendo con el efecto que ya tengo en la web", and "aplicá el mismo efecto
  de subrayado de 'Kennen Sie diese Herausforderungen?' en la columna derecha".

  All three are the same idea and this file drives them from ONE progress value
  per module, the way js/pain-hook-journey.js does on the homepage:

    1. the module arrives   — opacity/translate, released once it is in view;
    2. the arrow draws      — stroke-dashoffset from full to 0, scrubbed;
    3. the marker fills     — --mark 0→1 on the phrase in the FRANKONIA column,
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
      hardcoded number, so the arrow draws completely at any width.
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

  modules.forEach((mod) => {
    const arrow = mod.querySelector("[data-contrast-arrow] path");
    const marks = gsap.utils.toArray(mod.querySelectorAll(".service-contrast__mark"));

    // The arrow's start state: fully retracted. Measured, not assumed — the SVG
    // scales with its column, and getTotalLength() is in viewBox units, which is
    // exactly what stroke-dasharray wants.
    let len = 0;
    if (arrow) {
      len = arrow.getTotalLength();
      gsap.set(arrow, { strokeDasharray: len, strokeDashoffset: len });
    }
    gsap.set(marks, { "--mark": 0 });

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
  });
})();
