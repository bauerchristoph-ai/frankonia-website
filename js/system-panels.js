/*
  "Our System" — 6-outcome scroll section (client brief, 2026-07-20:
  premium scroll-driven format between Pain Hook and Services). Desktop/
  tablet (≥1024px): a sticky left intro stays in place while six panels
  in the right column are scrolled past; whichever panel crosses the
  viewport's vertical center becomes visually emphasized (full opacity,
  slight scale-up) while the rest dim slightly (never disappear). Below
  1024px: no sticky column, no active/dimmed emphasis at all — panels
  just fade in once, in normal vertical order, matching the brief's
  simpler mobile fallback.

  Homepage-only, its own <script defer> tag (same pattern as
  outfits.js/hero-reveal.js/title-reveal.js/pain-hook-journey.js) — not
  folded into main.js. Uses the GSAP core + ScrollTrigger already loaded
  earlier in this page's <head>; doesn't load or register either a
  second time beyond the one defensive gsap.registerPlugin(ScrollTrigger)
  call below (harmless to call more than once).

  No Lenis anywhere in this project — CLAUDE.md's tech-constraints record
  it as explicitly NOT approved (scroll-hijacking risk), same flag as
  js/pain-hook-journey.js. Native scroll + ScrollTrigger's own per-panel
  triggers drive this instead.

  JS-only-ever-enhances: every panel is fully visible by default in the
  raw HTML/CSS (see the comment on .system__panel, page-home.css) — this
  script is the only thing that ever hides them (via gsap.set(), an
  inline style), and only right before actually wiring up whichever
  scroll behavior applies. A no-JS visitor, a crawler that doesn't
  execute JS, or a script error anywhere before this runs all see the
  section fully visible and readable, never permanently blanked out.
*/

(function initSystemPanels() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  const section = document.querySelector(".system");
  if (!section) return;

  gsap.registerPlugin(ScrollTrigger);

  const panels = Array.from(section.querySelectorAll("[data-system-panel]"));
  if (!panels.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // No ScrollTrigger at all — every panel is already fully visible by
    // default (see the CSS comment above), which is exactly the "simple
    // static stack" the brief asks for here. Nothing else to do.
    return;
  }

  ScrollTrigger.matchMedia({
    "(min-width: 1024px)": function () {
      section.classList.add("system--armed");

      const triggers = panels.map((panel) =>
        ScrollTrigger.create({
          trigger: panel,
          start: "top center",
          end: "bottom center",
          toggleClass: { targets: panel, className: "is-active" },
        })
      );

      return function cleanup() {
        triggers.forEach((st) => st.kill());
        section.classList.remove("system--armed");
        panels.forEach((panel) => panel.classList.remove("is-active"));
      };
    },

    "(max-width: 1023.98px)": function () {
      gsap.set(panels, { opacity: 0, y: 20 });

      const triggers = panels.map((panel) =>
        ScrollTrigger.create({
          trigger: panel,
          start: "top 85%",
          once: true,
          onEnter: () =>
            gsap.to(panel, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }),
        })
      );

      return function cleanup() {
        triggers.forEach((st) => st.kill());
        gsap.set(panels, { clearProps: "opacity,transform" });
      };
    },
  });
})();
