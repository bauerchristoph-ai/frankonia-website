/*
  Homepage hero entrance — the first approved GSAP moment (client direction via
  Chris, 2026-07-20; premium first-impression cascade extended 2026-07-27). On
  page load (not scroll-triggered — the hero is always in view at first paint),
  a single GSAP timeline plays a smooth, staggered "premium" entrance:

    1. the <h1>, split into words each masked in an overflow-hidden span, rises
       up into place (word cascade);
    2. then, gently overlapping the tail of the headline, the rest of the hero
       content fades + rises in, one block after another: lead → actions
       (CTA + phone) → reassurance row → trust band.

  Homepage-only, its own <script defer> tag in pages/index.html's <head> right
  after the self-hosted GSAP core (assets/js/vendor/gsap.min.js — no CDN, same
  self-hosting pattern as fonts). GSAP's "power4.out"/"power3.out" eases read as
  the same "decelerate smoothly, no overshoot" character as --easing-premium
  (tokens.css) without needing the CustomEase plugin for one hero moment.

  The background image is deliberately NOT animated here: the hero sizes to the
  full (un-cropped) image and it's the LCP element (preloaded + eager), so a
  transform/opacity on it would risk layout overflow and/or delay LCP. Its
  treatment is a separate, still-open decision (client 2026-07-27).

  JS-only-ever-enhances, same contract as every other motion primitive on this
  site (motion.css / initScrollReveal in main.js): the <h1>'s real text is only
  ever rewritten into word/span markup from inside this script, and the hidden
  start states (below) are ONLY ever set here — so a no-JS visitor, a crawler
  that doesn't execute JS, a script error before this runs, or prefers-reduced-
  motion all see the plain, complete, fully-visible hero. The original headline
  survives as the h1's aria-label with each visual word aria-hidden.
*/

(function initHeroReveal() {
  const hero = document.querySelector(".hero");
  if (!hero || typeof gsap === "undefined") return;
  const h1 = hero.querySelector(".hero__content h1");
  if (!h1) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // --- Split the headline into word masks (unchanged mechanism) ---
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

  // --- The rest of the hero content, in visual (top-to-bottom) order ---
  const items = [
    hero.querySelector(".hero__lead"),
    hero.querySelector(".hero__actions"),
    hero.querySelector(".hero__reassurance"),
    hero.querySelector(".hero__trust"),
  ].filter(Boolean);

  // Hidden start states — set here only (JS-only-enhances).
  gsap.set(innerSpans, { yPercent: 110, opacity: 0 });
  gsap.set(items, { y: 26, opacity: 0 });

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  // Headline words rise up.
  tl.to(
    innerSpans,
    { yPercent: 0, opacity: 1, duration: 0.8, ease: "power4.out", stagger: 0.05 },
    0.15
  );

  // Then the rest cascades in, gently overlapping the tail of the headline.
  tl.to(
    items,
    { y: 0, opacity: 1, duration: 0.7, stagger: 0.12 },
    0.55
  );
})();
