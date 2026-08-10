/*
  Rule draw — a horizontal hairline that traces itself across its row as that
  row scrolls into view.

  Client 2026-08-10, /einsatzgebiete/ section 3: "que se vayan trazando las
  líneas horizontales celestes mientras escroleo".

  Generic and opt-in, so the next section that wants it needs no new script:

      <ul data-rule-draw=".eg-why__item"> … </ul>

  The attribute value is a CSS selector for the rows, resolved WITHIN the
  container; an empty value falls back to the container's direct children. This
  file only ever writes ONE custom property per row, `--rule`, from 0 to 1. What
  that property DRAWS is entirely the stylesheet's business — page-einsatzgebiete
  .css consumes it as `scaleX()` on a `::before`. That split is deliberate: a
  pseudo-element cannot be a GSAP target, and keeping the geometry in CSS means a
  different section can spend the same 0→1 on a different axis or a different
  property (js/jobs-steps.js already does exactly this with `--step-line`).

  ONE ScrollTrigger PER ROW, not one for the group. The rows are full-width and
  tall, so a single group-spanning range would have the last rule finishing well
  after it had left the screen — the measured failure mode that
  data-item-reveal-each exists to fix on the risk cards (CLAUDE.md 2026-08-07).
  Per row, every rule draws across the same part of its own approach.

  Scrubbed, not played: the client asked for it to happen "mientras escroleo",
  which is a statement about scroll position, not about time. Scrolling back up
  un-draws it, like every other scrubbed reveal on this site.

  JS-ONLY-EVER-ENHANCES, same contract as every motion primitive here: the CSS
  default for `--rule` is 1, i.e. a fully drawn rule. This file is the only thing
  that ever sets it to 0, and only immediately before animating it back. No JS, a
  script error, a crawler, or prefers-reduced-motion all leave the rules drawn.

  Requires GSAP core + ScrollTrigger, loaded before this file. Rides the page's
  single Lenis + GSAP ticker (js/smooth-scroll.js).
*/

(function initRuleDraw() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const groups = document.querySelectorAll("[data-rule-draw]");
  if (!groups.length) return;

  gsap.registerPlugin(ScrollTrigger);

  groups.forEach((group) => {
    const selector = group.getAttribute("data-rule-draw").trim();
    const rows = selector
      ? group.querySelectorAll(selector)
      : group.querySelectorAll(":scope > *");
    if (!rows.length) return;

    rows.forEach((row) => {
      gsap.fromTo(
        row,
        { "--rule": 0 },
        {
          "--rule": 1,
          ease: "none",
          scrollTrigger: {
            trigger: row,
            // Starts as the row enters from the bottom and completes while it
            // is still comfortably on screen — a rule that finishes at the top
            // of the viewport is one nobody sees finish.
            start: "top 92%",
            end: "top 55%",
            scrub: 0.6,
            // Drop the inline property once the rule is fully drawn: its final
            // value is identical to the CSS default, so this is invisible, and
            // it keeps a spent inline style from overriding the stylesheet the
            // day someone changes the resting state. Only on `onLeave` — the
            // END of the range, where the value is already 1. Doing it on
            // `onLeaveBack` would strip a start state of 0 and leave the rule
            // permanently undrawn above the section.
            onLeave: () => gsap.set(row, { clearProps: "--rule" }),
          },
        }
      );
    });
  });
})();
