/*
  Homepage-only module for the Uniforms / Outfit Viewer section
  (pages/index.html, "outfits__*" classes in page-home.css). Not in
  main.js — that file is meant for generic, sitewide behavior only, see
  its own header comment. Loaded via its own <script defer> tag directly
  in pages/index.html, same pattern as page-home.css being linked there
  instead of folded into head-common.

  Data note: the client's source photography has no genuine side/
  three-quarter angle — every photo is front-facing. The "angled" view
  below refers to a second front-facing pose, not a different camera
  angle. See the HTML comment above the section in pages/index.html for
  the full investigation.

  Correction, 2026-07-17: this comment used to say only 6 of the 7
  outfits had a second photo, with Softshell's "Angled" button disabled
  as a result. That was wrong — assets/images/ManuSide5.png is Softshell's
  second pose; it had just been missed (client caught it: "its called
  manuside5 in the folder"). Verified via MD5 (distinct from every other
  ManuSide*.png, including the confirmed ManuSide2/3 duplicate) and by
  visual comparison against Manu4.png before wiring it in — same standing
  rule as the rest of this investigation, don't assume a filename pattern
  without checking. All 7 outfits now have a genuine angled photo; no
  disabled-button case remains, though render() below still guards for
  one generically (outfit.angled could be null again for some future
  outfit added without a second photo).
*/

const OUTFITS = [
  {
    label: "Polo",
    // One-line use-case labels, added 2026-07-17. Originally shown below
    // the image via .outfits__info (render() below set its textContent
    // from this field) — that element was removed the same day per a
    // later client correction ("Front/Angled only thing below the
    // character"). The identical copy now also lives as static text
    // directly in pages/index.html (.outfits__name-detail, one span per
    // button, revealed on hover) — that duplication is intentional, not
    // a leftover: this field is unused by render() now (nameEl/contextEl
    // below just no-op, since their target elements no longer exist),
    // kept only so the copy doesn't have to be re-written from scratch
    // if a JS-driven version of this ever comes back.
    context: "For everyday reception and front-of-house duty",
    front: {
      webp: "/assets/images/outfits/polo-front.webp",
      png: "/assets/images/outfits/polo-front.png",
      alt: "FRANKONIA security staff member wearing a black polo uniform, front view.",
    },
    angled: {
      webp: "/assets/images/outfits/polo-angled.webp",
      png: "/assets/images/outfits/polo-angled.png",
      alt: "FRANKONIA security staff member wearing a black polo uniform, alternate view.",
    },
  },
  {
    label: "Pullover",
    context: "For general on-site assignments in mild weather",
    front: {
      webp: "/assets/images/outfits/pullover-front.webp",
      png: "/assets/images/outfits/pullover-front.png",
      alt: "FRANKONIA security staff member wearing a black quarter-zip pullover, front view.",
    },
    angled: {
      webp: "/assets/images/outfits/pullover-angled.webp",
      png: "/assets/images/outfits/pullover-angled.png",
      alt: "FRANKONIA security staff member wearing a black quarter-zip pullover, alternate view.",
    },
  },
  {
    label: "Vest",
    context: "For high-visibility outdoor and patrol duty",
    front: {
      webp: "/assets/images/outfits/weste-front.webp",
      png: "/assets/images/outfits/weste-front.png",
      alt: "FRANKONIA security staff member wearing a high-visibility safety vest, front view.",
    },
    angled: {
      webp: "/assets/images/outfits/weste-angled.webp",
      png: "/assets/images/outfits/weste-angled.png",
      alt: "FRANKONIA security staff member wearing a high-visibility safety vest, alternate view.",
    },
  },
  {
    label: "Softshell Jacket",
    context: "For active outdoor assignments in changing weather",
    front: {
      webp: "/assets/images/outfits/softshell-front.webp",
      png: "/assets/images/outfits/softshell-front.png",
      alt: "FRANKONIA security staff member wearing a black softshell jacket, front view.",
    },
    // Found 2026-07-17 — the "no angled photo for Softshell" finding
    // documented in the module comment above (and in CLAUDE.md) was
    // wrong: assets/images/ManuSide5.png exists (client pointed it out
    // directly) and is a genuine second pose of the same jacket, not a
    // duplicate — verified by MD5 against every other ManuSide*.png
    // (all distinct except ManuSide3, still a confirmed dupe of
    // ManuSide2) and by visually comparing it side-by-side with Manu4.png
    // (same red zip pulls, same collar, same person) before touching
    // anything, same as this project's standing rule for these source
    // files. Resized to the same shared 800×1200 canvas as every other
    // outfit photo, WebP q95 + PNG fallback (alpha preserved — source is
    // genuine RGBA, confirmed via getextrema, not just file mode).
    angled: {
      webp: "/assets/images/outfits/softshell-angled.webp",
      png: "/assets/images/outfits/softshell-angled.png",
      alt: "FRANKONIA security staff member wearing a black softshell jacket, alternate view.",
    },
  },
  {
    label: "Winter Jacket",
    context: "For outdoor patrols and cold-weather assignments",
    front: {
      webp: "/assets/images/outfits/winterjacke-front.webp",
      png: "/assets/images/outfits/winterjacke-front.png",
      alt: "FRANKONIA security staff member wearing a black winter jacket with hood, front view.",
    },
    angled: {
      webp: "/assets/images/outfits/winterjacke-angled.webp",
      png: "/assets/images/outfits/winterjacke-angled.png",
      alt: "FRANKONIA security staff member wearing a black winter jacket with hood, alternate view.",
    },
  },
  {
    label: "Shirt",
    context: "For client-facing reception and desk assignments",
    front: {
      webp: "/assets/images/outfits/hemd-front.webp",
      png: "/assets/images/outfits/hemd-front.png",
      alt: "FRANKONIA security staff member wearing a light gray dress shirt, front view.",
    },
    angled: {
      webp: "/assets/images/outfits/hemd-angled.webp",
      png: "/assets/images/outfits/hemd-angled.png",
      alt: "FRANKONIA security staff member wearing a light gray dress shirt, alternate view.",
    },
  },
  {
    label: "Suit",
    context: "For formal, client-facing assignments",
    front: {
      webp: "/assets/images/outfits/anzug-front.webp",
      png: "/assets/images/outfits/anzug-front.png",
      alt: "FRANKONIA security staff member wearing a black suit, front view.",
    },
    angled: {
      webp: "/assets/images/outfits/anzug-angled.webp",
      png: "/assets/images/outfits/anzug-angled.png",
      alt: "FRANKONIA security staff member wearing a black suit, alternate view.",
    },
  },
];

/**
 * Wires up the outfit viewer: prev/next arrows cycle through OUTFITS,
 * the Front/Angled buttons switch view without changing the selected
 * outfit, and ArrowLeft/ArrowRight work anywhere focus is inside the
 * viewer. Everything here only ever updates the one <picture> already
 * in the HTML (see the markup comment in pages/index.html) — no new
 * elements, no extra images requested beyond whichever one is currently
 * shown, so there's no eager-loading of the other 12 images and no
 * layout shift from swapping between them.
 */
function initOutfitViewer() {
  const viewer = document.querySelector(".outfits__viewer");
  if (!viewer) return;

  const prevBtn = viewer.querySelector("[data-outfit-prev]");
  const nextBtn = viewer.querySelector("[data-outfit-next]");
  // Scoped to the whole section, not `viewer` — the name-picker buttons
  // live in .outfits__intro, a sibling of .outfits__viewer, not a
  // descendant of it (the Front/Angled toggle used to as well, until it
  // moved inside .outfits__viewer itself 2026-07-17 — scoping to
  // `section` still finds it either way, so that move needed no JS
  // change here).
  const section = viewer.closest(".outfits");
  const viewBtns = section ? section.querySelectorAll("[data-outfit-view]") : [];
  const nameBtns = section
    ? section.querySelectorAll("[data-outfit-index]")
    : [];
  const source = viewer.querySelector("[data-outfit-source]");
  const img = viewer.querySelector("[data-outfit-img]");
  // Active outfit name + context label, added 2026-07-17 — optional:
  // both are queried inside `viewer`, but render() below guards each
  // one individually, so their absence doesn't disable the rest of the
  // viewer (same "enhance, don't gate" principle as everything else
  // here).
  const nameEl = viewer.querySelector("[data-outfit-name]");
  const contextEl = viewer.querySelector("[data-outfit-context]");
  if (!prevBtn || !nextBtn || !viewBtns.length || !source || !img) {
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let index = 0;
  let view = "front";

  function render() {
    const outfit = OUTFITS[index];
    const hasAngled = Boolean(outfit.angled);
    if (view === "angled" && !hasAngled) view = "front";

    const asset = outfit[view];

    viewBtns.forEach((btn) => {
      const isAngled = btn.dataset.outfitView === "angled";
      const active = btn.dataset.outfitView === view;
      btn.setAttribute("aria-pressed", String(active));
      btn.disabled = isAngled && !hasAngled;
    });

    nameBtns.forEach((btn) => {
      const active = Number(btn.dataset.outfitIndex) === index;
      btn.setAttribute("aria-pressed", String(active));
    });

    if (nameEl) nameEl.textContent = outfit.label;
    if (contextEl) contextEl.textContent = outfit.context;

    if (img.src.endsWith(asset.png) && source.srcset === asset.webp) return;

    const swap = () => {
      source.srcset = asset.webp;
      img.src = asset.png;
      img.alt = asset.alt;
    };

    if (prefersReducedMotion) {
      swap();
      return;
    }

    img.classList.add("is-swapping");
    setTimeout(() => {
      swap();
      img.classList.remove("is-swapping");
    }, 120);
  }

  prevBtn.addEventListener("click", () => {
    index = (index - 1 + OUTFITS.length) % OUTFITS.length;
    render();
  });

  nextBtn.addEventListener("click", () => {
    index = (index + 1) % OUTFITS.length;
    render();
  });

  viewBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      view = btn.dataset.outfitView;
      render();
    });
  });

  // Direct outfit picker — leaves the current view (front/angled) alone,
  // same as prev/next already do. Hover and focus jump straight to that
  // outfit too, not just click (client request 2026-07-15, same
  // hover-previews-live pattern already used by the Services list's
  // initServicePreview()) — there's no separate "preview vs. selected"
  // state to track: whichever outfit was last hovered, focused, or
  // clicked just becomes the shown one and stays that way (mirrors
  // .is-active's "stays in sync even after blur" behavior in the
  // Services section).
  nameBtns.forEach((btn) => {
    const select = () => {
      index = Number(btn.dataset.outfitIndex);
      render();
    };
    btn.addEventListener("click", select);
    btn.addEventListener("mouseenter", select);
    btn.addEventListener("focus", select);
  });

  viewer.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      prevBtn.click();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      nextBtn.click();
    }
  });

  render();
}

// Called after OUTFITS/initOutfitViewer are both fully declared above —
// calling this any earlier in the file throws (OUTFITS is a `const`,
// not hoisted with a value, so render() would run before it's assigned)
// and silently breaks every click handler for the rest of the page.
initOutfitViewer();
