/*
  Section heading char-reveal — ported from the Sacramentum Advisors
  reference (its useCharReveal hook) into this project's static vanilla-JS
  form. As each <h2> scrolls through the viewport, its characters resolve
  in with a subtle 3D tilt, SCRUBBED to scroll position (not a one-shot
  play) — so the reveal reads as liquid under Lenis smooth scroll, matching
  how Sacramentum's titles appear. Replaces the earlier one-shot word-mask
  version (git has it).

  Mechanism, per char: opacity 0->1, rotateX 18deg->0, z -30->0, y 10->0,
  stagger 0.018, ease power2.out, tied to a ScrollTrigger with
  start "top 88%", end "top 42%", scrub 0.6 — the exact values from the
  reference.

  Splitting is done IN PLACE by walking the heading's DOM: each text node
  becomes word spans (inline-block, so headings never break mid-word) whose
  characters are each their own inline-block span. Existing child elements
  are recursed into, not flattened — so a heading built from multiple
  elements (e.g. Trust Metrics' two block-level .trust-metrics__heading-line
  spans) keeps its structure/2-line layout AND still gets the per-char
  reveal. (This is why the old textContent-based splitter needed Trust
  Metrics to opt out; this one doesn't.)

  Homepage-only for now (same reasoning as outfits.js/hero-reveal.js —
  loaded directly in pages/index.html, not head-common). Requires GSAP core
  + ScrollTrigger, self-hosted, loaded before this file.

  JS-only-ever-enhances, same contract as every other motion primitive on
  this site: the split markup and the opacity:0 start state are ONLY ever
  applied from inside this script. A no-JS visitor, a crawler that doesn't
  execute JS, or prefers-reduced-motion all see the plain, complete,
  fully-visible heading — never blank or half-built. The original text is
  preserved as the h2's aria-label and the generated word spans are
  aria-hidden, so assistive tech reads the heading normally, not a stream
  of single letters.

  Scope (client request 2026-07-22, "apply it to all the titles"): every
  section-level heading — all <h2> in <main>, PLUS the one prominent
  section sub-heading that happens to be an <h3>, "What Clients Can Expect"
  (.trust-metrics__cards-heading). Pain Hook's "Facing these challenges?"
  is now included too — its section is NOT pinned (the journey uses plain
  scrub, see js/pain-hook-journey.js), so the earlier pin-safety opt-out no
  longer applies. Repeating grid/list item titles (pillar cards, the 4 pain
  items, system panels, the 10 FAQ questions, the form title) are
  deliberately NOT included — char-scrubbing dozens of small titles would
  read as busy, not premium; ask before extending there.

  [data-no-title-reveal] remains as a per-heading escape hatch, but nothing
  currently sets it.
*/

(function initTitleReveal() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(ScrollTrigger);

  // Wrap every character in the node's subtree in an inline-block span,
  // in place, recursing into existing elements so their structure/layout
  // survives. Words get their own inline-block wrapper so a heading never
  // breaks in the middle of a word. Returns the flat list of char spans.
  function splitIntoChars(root) {
    const chars = [];

    function walk(node) {
      // Snapshot: we replace text nodes as we go.
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent;
          if (!text) return;

          const frag = document.createDocumentFragment();
          // Keep whitespace tokens so word boundaries (and wrapping) survive.
          text.split(/(\s+)/).forEach((part) => {
            if (part === "") return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(" "));
              return;
            }
            const wordSpan = document.createElement("span");
            wordSpan.style.display = "inline-block";
            wordSpan.setAttribute("aria-hidden", "true");
            for (const ch of part) {
              const charSpan = document.createElement("span");
              charSpan.style.display = "inline-block";
              charSpan.textContent = ch;
              wordSpan.appendChild(charSpan);
              chars.push(charSpan);
            }
            frag.appendChild(wordSpan);
          });

          node.replaceChild(frag, child);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          walk(child);
        }
      });
    }

    walk(root);
    return chars;
  }

  const SELECTOR =
    "main h2:not([data-no-title-reveal])," +
    "main .trust-metrics__cards-heading:not([data-no-title-reveal])";

  document.querySelectorAll(SELECTOR).forEach((heading) => {
    // Accessible name captured BEFORE splitting. innerText (not textContent)
    // respects block boundaries — e.g. it yields "Trusted across\nthe region"
    // for the two-span heading, which normalizes to the correct spaced label
    // rather than "Trusted acrossthe region".
    const label = (heading.innerText || heading.textContent || "").replace(/\s+/g, " ").trim();

    const chars = splitIntoChars(heading);
    if (!chars.length) return;

    if (label) heading.setAttribute("aria-label", label);

    gsap.set(heading, { perspective: 800 });
    gsap.set(chars, {
      transformStyle: "preserve-3d",
      backfaceVisibility: "hidden",
      willChange: "transform, opacity",
    });
    gsap.fromTo(
      chars,
      { opacity: 0, rotateX: 18, z: -30, y: 10 },
      {
        opacity: 1,
        rotateX: 0,
        z: 0,
        y: 0,
        stagger: 0.018,
        ease: "power2.out",
        scrollTrigger: {
          trigger: heading,
          start: "top 88%",
          end: "top 42%",
          scrub: 0.6,
        },
      }
    );
  });
})();
