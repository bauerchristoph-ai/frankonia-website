/*
  Pixel-transition "seam" — a scroll-driven "pixel dissolve" effect that
  lives in the SEAM between two sections (client request, 2026-07-21).

  8th revision (latest): client saw a real screenshot of this working —
  first real visual confirmation across 8 revisions — and asked for the
  wipe direction to flip ("es la otra vuelta, los pixeles desaparecen al
  reves"). See the reveal loop below for the inverted row-to-progress
  mapping; everything else in this file is unchanged from the 7th
  revision described below.

  6th revision — rebuilt after actually reading the full reference repo
  (github.com/J0SUKE/gsap-threejs-codrops: media.ts, fragment.glsl,
  vertex.glsl, canvas.ts, main.ts), not just the fragment shader in
  isolation, per client feedback: "no estas captando el efecto... podes
  analizar bien la carpeta y aplicar lo necesario." What that shader
  actually does, translated:

  - Cells are true squares because the shader corrects for aspect ratio
    BEFORE dividing into a grid (squaresGrid() in fragment.glsl) — the
    grid itself is one scalar `gridSize` applied equally to both axes.
    Translated here as: measure the band's real rendered pixel size,
    derive column/row counts from ONE shared target tile size, and set
    BOTH axes to that identical explicit pixel value — never two
    independently-rounded fractions (which was the previous, still-not-
    square bug).
  - The reveal is NOT independently random per cell across the whole
    0-1 scroll range (what this file did before this revision — every
    cell had its own uncorrelated threshold, so at any given scroll
    position, revealed cells were scattered evenly across the ENTIRE
    band with no sense of direction). The shader instead has ONE
    continuous "sweep" position that moves through the grid as
    `uProgress` increases; each cell compares its own row position to
    that sweep position, and only cells CLOSE to the sweep (within a
    narrow band, `height = 0.2` of the shader's own normalized space)
    ever show any noise at all — cells far above the sweep are already
    cleanly revealed, cells far below are cleanly still covered, and the
    jaggedness only ever lives in that one moving, localized band. This
    is what actually produces the "static/noise" look in the client's
    reference screenshot, not scattered randomness everywhere.
  - Translated: each row has an "ideal" reveal progress (a clean
    top-to-bottom linear wipe, one row revealing after another as
    progress goes 0->1), and each tile's real threshold is that ideal
    value plus a SMALL random jitter bounded to roughly one row's worth
    of progress-space — so only tiles near the current sweep row can
    ever be out of step with their neighbors; tiles far from the sweep
    always behave cleanly.

  7th revision, same day — client: "los pixeles son negros... tendria
  que estar arriba de la seccion blanca." Every tile is ONE fixed color
  (black), so the effect is only ever visible against a LIGHT
  background — the previous version split tile color per-half to match
  whichever section was behind it (including matching Uniforms' own
  white), which made that half invisible too, defeating the whole
  point. The band (page-home.css) no longer straddles the boundary
  symmetrically either — it now sits entirely inside the section below
  the seam (Uniforms), so black tiles read clearly against its light
  background for the band's full height, instead of only across half
  of it. Tile color itself moved to a plain CSS rule
  (.pixel-seam__tile { background-color: var(--color-bg) }) since
  there's no longer a per-tile split to compute — this file no longer
  reads data-color-above/data-color-below at all.

  Homepage-only, its own <script defer> tag (same pattern as
  outfits.js/hero-reveal.js/title-reveal.js/pain-hook-journey.js/
  system-story.js) — not folded into main.js. Requires GSAP core +
  ScrollTrigger, both self-hosted and loaded earlier in this page's
  <head>; the one defensive gsap.registerPlugin(ScrollTrigger) call
  below is harmless to run more than once.

  See page-home.css's own header comment on .pixel-seam for the fuller
  mechanism/history, and CLAUDE.md for the complete revision log.

  JS-only-ever-enhances: every [data-pixel-seam] element is empty by
  default in the real HTML (real height: 0 in CSS, no content) — this
  script only ever appends a tile band into it at runtime. If this
  script never runs, or prefers-reduced-motion is set (checked below,
  before anything is built), every seam stays empty and effectively
  invisible, so the two sections on either side simply meet with
  nothing between them, same as if this feature didn't exist.
*/

(function initPixelSeams() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const seams = document.querySelectorAll("[data-pixel-seam]");
  if (!seams.length) return;

  gsap.registerPlugin(ScrollTrigger);

  // One shared pixel size for BOTH columns and rows (not two
  // independently-rounded grid fractions) — this is what actually
  // guarantees square cells, matching the shader's own aspect-corrected
  // single `gridSize` scalar. 40px (was 24px, client 2026-07-23: "bigger
  // squares") — the taller band below keeps enough rows for the dissolve
  // edge to stay noisy despite the chunkier tiles.
  const TILE_SIZE = 40;

  seams.forEach((seam) => {
    const band = document.createElement("div");
    band.className = "pixel-seam__band";
    seam.appendChild(band);

    const rect = band.getBoundingClientRect();
    // ceil, not round (fixed 2026-07-30): the tiles are a FIXED pixel size, so
    // rounding down leaves a bare strip at the right edge of the band. Ceil
    // always over-covers instead; .pixel-seam__band's own overflow:hidden
    // clips the leftover sliver. Rounding used to over-cover roughly half the
    // time too — at a 1512px viewport it produced 38 x 40px = 1520px, i.e. 8px
    // of real horizontal scroll on the WHOLE page (measured in Chrome), which
    // shifted every section left and read as "the layout lost its margin".
    const cols = Math.max(4, Math.ceil(rect.width / TILE_SIZE));
    const rows = Math.max(3, Math.ceil(rect.height / TILE_SIZE));
    band.style.setProperty("--pixel-cols", cols);
    band.style.setProperty("--pixel-rows", rows);
    band.style.setProperty("--pixel-tile-size", TILE_SIZE + "px");

    // Jitter widened to ~2 rows of progress-space (client 2026-07-23:
    // "more irregular" — the previous ~1-row bound made an almost even
    // comb edge). Now a tile can be out of step with its row by up to a
    // full row on each side, so the black->transparent boundary spans
    // several rows at once and reads as a rough, scattered, staticky
    // dissolve rather than a single tidy line. Still anchored to the
    // per-row ideal (below), so it stays a directional sweep, not fully
    // uncorrelated noise across the whole band.
    const rowStep = rows > 1 ? 1 / (rows - 1) : 1;
    const jitter = rowStep * 2.0;

    const tiles = [];

    for (let row = 0; row < rows; row++) {
      // Bottom-to-top wipe (flipped 2026-07-21, 8th revision — client,
      // on seeing a real screenshot of this working: "is the other way
      // around, the pixels disappear the other way around"). Row 0 is
      // the top of the band, right at the boundary; the last row is the
      // bottom, deepest into Uniforms. Inverted so the LAST row reveals
      // first (near the start of the scroll range) and row 0 reveals
      // last — the opposite of the previous top-to-bottom mapping.
      const idealProgress = rows > 1 ? 1 - row / (rows - 1) : 0;

      for (let col = 0; col < cols; col++) {
        const tile = document.createElement("div");
        tile.className = "pixel-seam__tile";
        band.appendChild(tile);

        // Small per-tile jitter around this row's ideal progress (both
        // vertical and a smaller horizontal component, matching the
        // shader's 2D per-cell random(grid) — noise varies by column
        // too, not just row) — bounded by `jitter`, so a tile can only
        // ever be out of step with its row by roughly one row's worth
        // of scroll, never scattered arbitrarily across the whole range.
        const rowJitter = (Math.random() - 0.5) * jitter;
        const colJitter = (Math.random() - 0.5) * jitter * 0.7;
        const revealAt = Math.min(1, Math.max(0, idealProgress + rowJitter + colJitter));

        tiles.push({ el: tile, revealAt, revealed: false });
      }
    }

    ScrollTrigger.create({
      trigger: seam,
      // A modest range straddling the point where the seam crosses the
      // middle of the viewport — this is the "moment of transition",
      // not a whole section's scroll-through.
      start: "top 80%",
      end: "top 20%",
      scrub: 0.3,
      onUpdate(self) {
        const progress = self.progress;
        tiles.forEach((tile) => {
          const shouldReveal = progress >= tile.revealAt;
          if (shouldReveal !== tile.revealed) {
            tile.revealed = shouldReveal;
            tile.el.classList.toggle("is-revealed", shouldReveal);
          }
        });
      },
    });
  });
})();
