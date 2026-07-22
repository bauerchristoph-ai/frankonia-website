/*
  Homepage hero headline reveal — the first approved GSAP moment (client
  direction via Chris, 2026-07-20; see CLAUDE.md "Non-negotiable tech
  constraints"). Splits the hero <h1> into words, each masked inside an
  overflow-hidden span, and animates them up into place once on page
  load — not scroll-triggered, since the hero is always in view at first
  paint, unlike every other .u-reveal section further down the page.

  Homepage-only, not folded into main.js — same reasoning as
  js/outfits.js: page-specific interaction gets its own module and its
  own <script defer> tag, loaded directly in pages/index.html's <head>,
  right after the self-hosted GSAP core it depends on
  (assets/js/vendor/gsap.min.js — no CDN, same self-hosting pattern as
  fonts). GSAP's built-in "power4.out" ease is used here rather than
  --easing-premium's exact cubic-bezier (tokens.css) — matching it
  precisely would need the CustomEase plugin for one hero moment, and
  power4.out already reads as the same "decelerate smoothly, no
  overshoot" character.

  JS-only-ever-enhances, same contract as every other motion primitive on
  this site (see motion.css / initScrollReveal in main.js): the <h1>'s
  real text is only ever rewritten into word/span markup from inside this
  script, so a no-JS visitor, a crawler that doesn't execute JS, or a
  script error anywhere before this runs all see the plain, complete,
  unsplit heading text — never a blank or partially-built h1. The
  original text also survives as the h1's aria-label once split, with
  each visual word marked aria-hidden, so assistive tech reads the same
  sentence either way.
*/

(function initHeroReveal() {
  const h1 = document.querySelector(".hero__content h1");
  if (!h1 || typeof gsap === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const text = h1.textContent;
  const words = text.split(" ");

  h1.textContent = "";
  h1.setAttribute("aria-label", text);

  words.forEach((word, i) => {
    const mask = document.createElement("span");
    mask.style.display = "inline-block";
    mask.style.overflow = "hidden";
    mask.style.verticalAlign = "bottom";

    const inner = document.createElement("span");
    inner.style.display = "inline-block";
    inner.textContent = word;

    mask.appendChild(inner);
    mask.setAttribute("aria-hidden", "true");
    h1.appendChild(mask);

    if (i < words.length - 1) h1.appendChild(document.createTextNode(" "));
  });

  const innerSpans = h1.querySelectorAll(":scope > span > span");

  gsap.set(innerSpans, { yPercent: 110, opacity: 0 });
  gsap.to(innerSpans, {
    yPercent: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power4.out",
    stagger: 0.05,
    delay: 0.15,
  });
})();
