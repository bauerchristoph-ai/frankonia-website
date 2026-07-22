# FRANKONIA Sicherheitsdienst — Website

Operational rules for Claude Code on this project. The source of truth for
everything not covered here is
[docs/frankonia-developer-guidelines.md](docs/frankonia-developer-guidelines.md)
(client-provided, dated 2026-07-08) — when in doubt, that document wins and
this file should be updated to match it.

## What this project is

A static, hand-coded B2B website for a German security services company
(FRANKONIA Sicherheitsdienst GmbH & Co. KG, Bamberg). It replaces a WordPress
+ Elementor site. It is not a portfolio piece — it exists to generate
qualified B2B security-services leads for decision-makers within roughly a
100 km radius of Bamberg (Franken / Bayern), via Google organic, Google Ads,
and increasingly AI search (ChatGPT, Perplexity, Claude, Gemini).

**Primary conversion goal, above all other page goals:** get the visitor to
submit the "Kostenlose Sicherheitsanalyse anfordern" form.

**Strategic direction updated 2026-07-22 (client, Christoph) — the full,
detailed version now lives in [docs/project-strategy.md](docs/project-strategy.md);
read it before any significant design/dev decision. Summary of the shift:**
the project now has **three equally important goals**, not one ranked
list — (1) qualified B2B lead generation, (2) strong SEO/GEO visibility,
(3) a premium, memorable brand experience. Conversion is still the single
primary *page action* (the free-analysis form), and content must always
be real, crawlable HTML — but "premium, editorial, Apple-style" motion and
selective advanced tech are now an approved direction, not a deviation.

Evaluate every recommendation against this decision order (also in
project-strategy.md — do not recommend something only because it looks
impressive, and do not reject something only because it uses JS/animation;
weigh the real trade-off):

1. Does it improve or preserve conversion?
2. Does it support SEO and GEO?
3. Does it improve trust and comprehension?
4. Does it strengthen the premium brand experience?
5. Can it be implemented accessibly?
6. Can it be implemented without unacceptable performance cost?
7. Is it maintainable across a future 30–100 page site?

Implementation is layered — content (semantic HTML: headings, copy, links,
CTAs, forms, FAQs, schema) first; then visual styling; then motion (GSAP,
ScrollTrigger, Lenis, SVG draw, transitions); then heavy/optional
experiences (WebGL, maps, 3D, video) that must be lazy/conditionally
loaded. The page must remain fully understandable and usable if JavaScript
fails or a crawler doesn't execute it. Motion and heavy effects must never
remove essential SEO content from the DOM.

The site should read as reliable, precise, and competent — and *also* feel
premium, restrained, editorial, modern and technically controlled. Not a
generic corporate template, and not a visually-overloaded, animation-for-
its-own-sake showcase either. Performance still matters (targets unchanged,
see Performance below) — the rule is "use advanced interaction
strategically and optimize it carefully," not "remove all animation."

## Current phase

**2026-07-22 — section-by-section homepage review begins; first round =
hero + nav (implemented, pending visual review).** This is the start of
the section-by-section process recorded in
[docs/project-strategy.md](docs/project-strategy.md) (the strategic
context/decision framework updated the same day lives there and in the
"Strategic direction" note above — read it first). First-round changes,
all in `pages/index.html` (hero) + `partials/header.html` +
`css/tokens.css`/`page-home.css`/`site-chrome.css`, no JS added:
- **Hero reordered** to message → action → reassurance → trust: H1 → lead
  → `.hero__actions` (CTA + phone) → `.hero__reassurance` → `.hero__trust`.
  The DEKRA badges + Google rating (`.hero__trust`) moved from just under
  the lead to the **bottom** of the hero as a distinct trust band, set
  apart by a subtle `border-top` hairline (not a card). **No eyebrow** —
  the hero begins directly with the H1.
- **Temporary client copy** (draft, easy to edit): H1 "Reliable Werkschutz
  for complex industrial operations."; lead about certified personnel /
  digital reporting / one contact; primary CTA "Request Free Security
  Analysis →" (arrow kept). Phone CTA unchanged.
- **Reassurance is now a 3-item `<ul>`** (`.hero__reassurance` /
  `.hero__reassurance-item`), each real HTML text led by a small
  `icon-check` (decorative/aria-hidden — meaning in the text, not colour):
  "Free" · "No obligation" · "Reply within 1 business day". One row when
  space allows, wraps on narrow screens. "Free consultation" intentionally
  dropped (CTA already says "Free"). Was a single middot `<p>` before.
- **New reusable `--content-inset` token** (tokens.css,
  `clamp(3rem, 5.5vw, 6rem)`) = the editorial left inset for primary
  homepage content columns. Applied to `.hero__content` via
  `padding-inline-start` (ADDITIONAL to container padding; box-sizing keeps
  it inside the 44rem cap — no overflow). Mobile override drops it to
  `--space-2` (≈20–24px edge-to-text). **Logo/nav alignment deliberately
  unchanged** — only the hero content column shifts inward. Meant to be
  reused across future homepage sections.
- **Services submenu redesigned to a light editorial panel** (desktop only,
  inside the `@media (min-width: 1400px)` block, site-chrome.css): warm
  white surface (was `--color-bg-elevated`/dark), dark body text
  (`--color-logo-black`), FRANKONIA-blue hover text
  (`--color-blue-dark`) + pale-blue hover wash (`--color-accent-subtle`),
  soft `--shadow-lg`, `--radius-md`, minimal padding, controlled spacing
  (no hard separators between links). Focus ring overridden to blue-dark
  on this panel because the global ring is white (invisible on white).
  **"View all services →" renamed "All Services →"** (header.html), same
  `/leistungen/` URL, slightly emphasised (bold, hairline-separated row).
  All 10 real service links, hover/`:focus-within` reveal, and keyboard
  (Tab/Enter/Escape) behaviour preserved — pure restyle. The mobile
  nested-list treatment (still dark) is untouched. **This supersedes the
  earlier "always-dark floating panel" description elsewhere in this file.**
- **Contrast caveat (flagged, accepted):** blue-dark hover TEXT on white
  ≈3.4:1 — below AA 4.5:1 for small text. Accepted because it's a
  transient hover state, the resting state (black on white) is fully
  accessible, and the client explicitly asked for a blue hover; the
  pale-blue hover background provides the affordance regardless. The blue
  focus-ring on white clears the 3:1 non-text minimum.
- **Lenis NOT present in the codebase** — item #7 of the brief ("make Lenis
  scrolling heavier / adjust the existing config") could not be done: there
  is no Lenis instance to tune (grep confirms only comments in
  pain-hook-journey.js/system-panels.js saying so). Docs approve Lenis
  ("Keep Lenis"), but it was never actually integrated. Adding it fresh is
  a separate, larger task (GSAP/ScrollTrigger sync, the pinned sections,
  reduced-motion, no scroll-trapping) — left for an explicit go-ahead, not
  silently added under "adjust config."
- **Not visually verified** — no browser tool in these sessions; standing
  caveat, same as every build this phase. Check via `npm run dev`.

**Homepage v1 built and extended (`pages/index.html`) + service-page
template + first service page (`pages/werkschutz.html` →
`/werkschutz/`) built 2026-07-15, both pending visual review.** Content
is structural/placeholder (see "Content language" below for exactly which
parts are real vs. placeholder) — neither page has been visually verified
in a browser (no browser/screenshot tool available in these sessions) and
needs a human look via `npm run dev` before either is considered done.

**Do not build the remaining 9 service pages until `/werkschutz/` is
explicitly reviewed and approved as the template** — see "Service-page
template" below for exactly what to reuse and what must change per
service when that approval comes. Do not build city pages, blog, or any
other page type yet either. No JSON-LD, GTM, analytics, cookies, or
reCAPTCHA yet — none of that has been requested for this phase. The build
proceeds in client-reviewed phases (homepage → service template →
service pages → city template → city pages → references → jobs → blog →
details/consent/CRM). See §8 of the guidelines doc for the full sequence.
Don't jump ahead of the current step, and don't scaffold future pages
"for later."

**2026-07-21 Pixel-transition: whole-section scroll entrance effect —
still pending visual review.** Client shared a reference repo,
github.com/J0SUKE/gsap-threejs-codrops (a Codrops/Three.js demo:
"Pixel Image Effect with GSAP and Three.js" — a gallery where each
IMAGE reveals via a WebGL shader as it scrolls into view, then expands
on click). Client's actual request, after discussion: apply that same
"pixel dissolve" look to whole SECTION entrances instead of a single
image — the transition when scrolling from one section to the next,
on several (not all) section boundaries.

- **Technique — explicitly NOT Three.js.** This project excludes
  Three.js/WebGL entirely (see "Non-negotiable tech constraints" —
  "no 3D is happening"). Asked the client directly: recreate the look
  in CSS/GSAP (no WebGL, stays inside existing constraints) or evaluate
  lifting the Three.js exclusion for an exact shader replica. **Client
  chose the CSS/GSAP recreation.** Mechanism (`js/pixel-transition.js`,
  new file, its own `<script defer>` tag, same pattern as
  outfits.js/hero-reveal.js/title-reveal.js/pain-hook-journey.js/
  system-panels.js): a grid of solid tiles (`.pixel-transition`,
  page-home.css) is built entirely at runtime and covers a target
  section; each tile is assigned a random reveal-threshold biased by
  its row (`row/(ROWS-1) * 0.7 + Math.random() * 0.3` — a rough
  top-to-bottom wipe with jitter, not a straight line and not pure
  confetti-random, the same "directional wipe + per-cell noise" idea
  as the shader's `grid.y`/`random(grid)` combination). A single
  `ScrollTrigger` per section, `scrub: 0.3`, `start: "top bottom",
  end: "top 35%"` (a short range right at the boundary, not the
  section's whole scroll-through — deliberately capped so a very tall
  section like `#our-system` (~200vh) doesn't drag the effect out for
  the entire scroll, just its entrance), drives a shared `progress`
  value; each tile toggles a plain CSS `opacity` transition
  (`.is-revealed`) once `progress` crosses its own threshold — reversible
  both ways, since `scrub` naturally re-covers a tile if the visitor
  scrolls back up past its threshold.
- **Scope — 4 of the page's section transitions, client's own pick, not
  every section**: `#trust-metrics` (after Hero), `#our-system` (after
  Pain Hook), `#uniforms` (after Services), `.coverage` (after
  Conversion). Each carries a plain `data-pixel-transition` attribute —
  see the full per-section rationale on Trust Metrics' own `<section>`
  comment in `pages/index.html`, and the shorter pointers on the other
  3. Not applied to Hero, Pain Hook, Services, Uniforms→Social,
  References, Conversion, or FAQ's own entrances — the client explicitly
  scoped this to "varias, no todas."
- **Tile color, one documented exception**: tiles default to
  `var(--color-bg)` (black, matching the page's own dark background —
  the effect reads as content resolving "out of the dark," which fits
  this site's whole black-theme identity well). `#uniforms` (`.outfits`)
  is the one of the 4 target sections with a light `#FAFAFA` background
  (a pre-existing documented exception, see Typography/Corporate
  Identity above) — its own tiles override to `#FAFAFA` via
  `.outfits .pixel-transition__tile { --pixel-tile-color: #FAFAFA; }`
  so they blend into that one section instead of clashing black-on-white.
  `#trust-metrics`/`#our-system`/`.coverage` all use the plain page
  background already (no explicit `background-color` of their own, or
  — for `#our-system`'s `.section--subtle` — `--color-bg-subtle`, a
  3%-white-tinted near-black that's close enough to blend without
  needing its own override).
- **JS-only-ever-enhances, same contract as every other motion primitive
  on this site**: every tile is created by `js/pixel-transition.js` at
  runtime and only ever covers already-fully-visible real content —
  nothing in `page-home.css` sets any of the 4 target sections'
  real markup to `opacity: 0` by default. If this script never runs, or
  `prefers-reduced-motion` is set (checked first, before anything is
  built — same guard pattern as pain-hook-journey.js/system-panels.js),
  no `.pixel-transition` overlay is ever created, and all 4 sections are
  simply, fully visible from first paint — same "never hide content a
  no-JS visitor or crawler needs to see" principle this file has flagged
  and fixed real violations of before (see Pain Hook's own history
  above).
- **Not pinned, no scroll hijacking** — this only scrubs an overlay's
  opacity against native scroll position via `ScrollTrigger`'s own
  `scrub`; it never pins the section or intercepts the scroll itself,
  consistent with this project's "no scroll hijacking" performance rule
  (same reason Lenis was rejected, see "Non-negotiable tech constraints").
  The overlay itself is `pointer-events: none` throughout, so it never
  blocks a click on real content underneath even while a tile is still
  visually covering it.
- **Scoped down to 1 of the 4 sections, same day, real bug found and
  fixed.** Client tested via a real browser and reported "no estoy
  viendo nada" (nothing visible at all). Root cause: `--pixel-tile-color`
  was set to match each target section's OWN background exactly (the
  idea being the tiles would "blend in" when not covering anything) —
  backwards reasoning: a tile the same color as what's behind/around it
  has **zero contrast**, so the covering state and the revealed state
  looked identical the whole time on every one of the 4 sections (all
  either plain black or, for `#uniforms`, the one color it was
  deliberately matched to). Fixed properly, not papered over:
  - `.pixel-transition__tile` now always renders solid black
    (`var(--color-bg)`), full stop — no more per-section
    `--pixel-tile-color` override, and the `.outfits`-specific
    `#FAFAFA`-matching rule was deleted entirely, not just adjusted.
  - Added a small `gap: 3px` between grid cells (`.pixel-transition`) —
    without it, edge-to-edge same-color tiles have no visible seam
    between them at all, so even a *contrasting* tile color would still
    have looked like one solid covering rectangle, not "pixels." The
    real section content shows through these gaps the whole time —
    intentional, reads as a fine scan-line pattern, not a flaw.
  - `data-pixel-transition` removed from `#trust-metrics`, `#our-system`,
    and `.coverage` — client asked to isolate testing to just one
    transition first. **`#uniforms` (Services → Uniforms) is the only
    section currently carrying this effect** — chosen specifically
    because it's the one light-background (`#FAFAFA`) section right
    after a dark one, so solid black tiles read as clear contrast there;
    the other 3 are dark-background sections where solid black tiles
    would still have poor/no contrast even after this fix.
  - **Before re-enabling the other 3**: they need an actual contrast
    strategy, not just restoring the attribute — e.g. a lighter/accent
    tile color for dark sections, or a border/wireframe-only look that
    doesn't depend on a solid fill color at all. Revisit once
    `#uniforms` is confirmed working well via a real scroll test.
- **Third revision, same day — mechanism changed entirely, not just
  tuned.** Client feedback on the above: "no but thats not the idea...
  the idea is that it is when scrolling from a section to another
  section" — the whole-section-entrance model above wasn't actually
  what was wanted, independent of the color bug. Shown two concrete
  options (with ASCII previews) to pin down the exact mechanism before
  touching code again:
  1. "The incoming section arrives pixelated" (the model above, already
     built).
  2. "The pixels live in the seam between both sections" — a band of
     tiles sits at the actual boundary line, covering part of both the
     outgoing and incoming section, and clears as you scroll past it.

  **Client picked option 2.** Rebuilt around this instead:
  - **`.pixel-transition`/`.pixel-transition__tile`/`[data-pixel-
    transition]` (the whole-section model, including the `#uniforms`
    attribute and color fix from the entry above) were removed
    entirely** — not kept alongside the new mechanism. `page-home.css`
    now has `.pixel-seam`/`.pixel-seam__band`/`.pixel-seam__tile`
    instead.
  - **New structure**: a real, empty `<div class="pixel-seam"
    data-pixel-seam aria-hidden="true">` sibling placed directly between
    two `<section>`s in `pages/index.html` (currently only one: between
    Services and `#uniforms`) — not a child of, or attribute on, either
    section. It has real `height: 0` (adds no layout space); its
    `.pixel-seam__band` child (built by `js/pixel-transition.js`) is
    `position: absolute` with `top: -120px; height: 240px` (`-70px`/
    `140px` on mobile), so it straddles the boundary — half overlapping
    the end of the section above, half the start of the section below.
  - **Grid**: 10 columns × 3 rows (was 8×5 for the old whole-section
    model — this band is wide and short, not tall) with a left-to-right
    wipe bias (`col/(COLS-1) * 0.7 + random() * 0.3`, was row-based/
    top-to-bottom before, since a short wide band reads better with a
    horizontal wipe than a vertical one) plus the same per-tile jitter
    and 3px gap as before.
  - **ScrollTrigger**: one `ScrollTrigger.create()` per `[data-pixel-
    seam]` element found (`js/pixel-transition.js` now discovers seams,
    not sections), `trigger: seam, start: "top 80%", end: "top 20%",
    scrub: 0.3` — a modest range centered on the moment the seam crosses
    the middle of the viewport, not tied to either section's own
    scroll-through height (which is what made the old model's range
    awkward on a very tall section like `#our-system` — moot now, since
    `#our-system` isn't part of this feature at all anymore, see below).
  - **Tile color unchanged from the fix above**: solid black
    (`var(--color-bg)`) — still correct here since Uniforms (light) is
    one of the two sections this seam touches.
  - **Scope unchanged**: still only the one Services → Uniforms
    boundary — the client asked to confirm the mechanism works here
    before it's extended to any other section boundary. Extending it
    means adding another `.pixel-seam` div at that DOM position; the JS
    already discovers every `[data-pixel-seam]` element generically, no
    per-instance JS changes needed.
  - **JS-only-ever-enhances**: unchanged principle, new mechanics — the
    seam div is empty by default in real HTML; the script only ever
    appends the band + tiles into it at runtime. No script, or
    `prefers-reduced-motion`, means the div stays empty and invisible,
    and the two sections simply meet with nothing between them.
- **Fourth revision, same day — 3 real bugs found from an actual
  screenshot** (the first real visual evidence this feature got —
  everything before this was code-reasoning only). Screenshot showed
  visible white gridlines cutting across the tiles, overlapping the
  Services list text. Client's diagnosis, in their own words: tiles need
  to be "the same color as the background," they need to be real
  squares "not rectangles," and there need to be "irregularities" like a
  reference screenshot of the original shader demo's own noisy dissolve
  edge. All three were real, fixable bugs, not just tuning:
  1. **Gap removed.** `.pixel-seam__band`'s `gap: 3px` (added in the 3rd
     revision to make tiles "read as a grid") was itself the direct
     cause of the gridlines — a CSS grid `gap` is an empty gutter
     painted with whatever's actually behind it, and since the band
     straddles a dark section (Services) and a light one (Uniforms),
     that gutter showed two different colors depending on which half of
     the band it was in — a literal mismatch, visible as bright lines
     cutting across solid-colored tiles. Removed entirely; tiles now
     sit flush.
  2. **Tiles now colored per-tile by position, not one fixed color.**
     `data-color-above`/`data-color-below` attributes on the
     `.pixel-seam` div (`#010101` / `#FAFAFA` for this one boundary) —
     `js/pixel-transition.js` colors each tile by whether it's in the
     upper half of the band (matches the section above the seam) or the
     lower half (matches the section below). This is what "same color
     as the background" means in practice: a tile reads as a seamless
     continuation of whichever real section is actually behind it,
     instead of one hardcoded color clashing against whichever side
     doesn't match it. Kept as data attributes (not hardcoded per-seam
     logic in JS) so a future seam between a different pair of sections
     can specify its own two colors without touching the script.
  3. **Squares, not rectangles.** The fixed `10×3` grid stretched into
     very wide, short rectangles at real desktop widths (a ~2000px-wide
     band ÷ 10 columns = ~200px-wide cells over an 80px-tall row).
     `js/pixel-transition.js` now measures the band's actual rendered
     width/height (`band.getBoundingClientRect()`, right after
     appending it, before setting real column/row counts) and derives
     column/row counts from a fixed target tile size (`TARGET_TILE_SIZE
     = 48`px) — `Math.round(width / 48)` columns, `Math.round(height /
     48)` rows — so cells are always true squares regardless of
     viewport width. The old `--pixel-cols`/`--pixel-rows` CSS custom
     properties are unchanged as the mechanism, just now set from a
     real measurement instead of a hardcoded literal.
  4. **More irregular reveal threshold.** The per-tile threshold formula
     changed from `bias * 0.7 + random() * 0.3` (mostly a clean
     left-to-right wipe) to `bias * 0.3 + random() * 0.7` (mostly
     random, small residual bias just so the overall motion still reads
     as moving through the seam left-to-right rather than pure
     confetti) — closer to the jagged, static-like dissolve edge in the
     client's reference screenshot.
- **Fifth revision, same day — "still not the same black."** Client
  feedback after the 4th revision's fixes. Root cause: `data-color-
  above="#010101"` on the seam div (pages/index.html) was a hardcoded
  hex literal — provably identical to `--color-bg`'s own value at the
  time it was written, but a literal duplicate all the same, which
  already breaks this project's own rule of never hardcoding a brand
  hex outside `tokens.css` (see Coding & naming conventions) and, more
  importantly, has no structural guarantee of staying identical if the
  token ever changes. Fixed by removing that attribute entirely —
  `js/pixel-transition.js` now falls back to reading the REAL, live
  `--color-bg` custom property via `getComputedStyle(document.
  documentElement).getPropertyValue("--color-bg")` whenever a seam
  doesn't specify its own `data-color-above`, so the tile color is
  structurally the same value the page's own background actually uses,
  not a separately-maintained copy of it. `data-color-below="#FAFAFA"`
  was left untouched — that one **is** a legitimate, already-documented
  hardcoded exception (matches `.outfits`'s own `background-color: 
  #FAFAFA` rule directly, which itself isn't a token — see Corporate
  Identity's Typography section), not a value with a token it could
  duplicate.
- **Extra section padding, same day — client: "eating some part of the
  page."** The seam band's negative offset (±120px desktop, ±70px
  mobile) overlaps real content in both adjacent sections while opaque,
  and neither section had any spare room at that edge before this.
  Added real, permanent `padding-bottom` to `.services` and
  `padding-top` to `.outfits` (both `calc(var(--space-9) + 120px)`,
  `+70px` under the same `max-width: 767.98px` breakpoint as the band's
  own mobile override) — this is actual layout space present at every
  scroll position regardless of whether JS/GSAP ever runs, not a
  JS-applied adjustment, so the covered zone always lands in genuinely
  empty space rather than eating real content either way.
- **Sixth revision, same day — client: "no estas captando el efecto...
  analiza bien la carpeta y aplica lo necesario."** Direct instruction
  to stop iterating on assumptions and properly read the full reference
  repo before touching code again. Read every remaining file not yet
  read in the earlier build report (`media.ts`, `fragment.glsl` in
  full, `vertex.glsl`, `canvas.ts`, `main.ts`) — two real, deeper
  mismatches found between what the shader actually does and what this
  CSS/GSAP recreation was doing, beyond the surface bugs fixed in the
  4th/5th revisions:
  1. **Squares still weren't guaranteed.** The 4th revision computed
     `cols`/`rows` from the band's measured width/height, but divided
     each axis independently (`Math.round(width/48)` vs.
     `Math.round(height/48)`) and let CSS Grid's `1fr` divide the
     remaining space — two independent roundings that can differ by a
     pixel or two per axis, which is exactly what "still not squared"
     was catching. Fixed by using ONE explicit shared pixel size
     (`--pixel-tile-size`, `js/pixel-transition.js`) on BOTH
     `grid-template-columns` and `grid-template-rows` — matching the
     shader's own `squaresGrid()` function, which corrects for aspect
     ratio first, then applies a single scalar `gridSize` to both
     dimensions. `TILE_SIZE` also dropped 48px → 24px, both for a
     closer match to the shader's own grid density and to give the
     sweep-noise effect (next point) enough rows to read as noise
     rather than 2-3 chunky on/off steps.
  2. **The reveal had no actual sweep — it was uncorrelated noise across
     the WHOLE scroll range.** The 3rd/4th revisions gave each tile an
     independent random threshold spanning the full 0-1 progress range,
     which means at any given scroll position, revealed tiles were
     scattered evenly across the entire band with no sense of direction
     — not what the shader does. Rereading `fragment.glsl` closely: it
     has ONE continuous sweep position (`progress`, derived from
     `uProgress`) that moves through the grid; each cell's random
     threshold (`step(1 - height*random(grid), dist)`) only ever matters
     within a narrow band (`height = 0.2`, in the shader's own
     normalized units) around that moving sweep — cells far from the
     sweep are always cleanly revealed (above it) or cleanly covered
     (below it), and the jaggedness only ever lives in that one
     localized, moving zone. This is what actually produces the
     "static"/noisy-edge look in the client's reference screenshot, not
     randomness spread across the whole image at once. Rebuilt
     accordingly: each row now gets a clean "ideal" reveal progress (a
     straightforward top-to-bottom wipe, `row / (rows-1)`), and each
     tile's real threshold is that ideal value plus a small jitter
     bounded to roughly one row's worth of progress-space (`rowStep *
     0.9`, split into a vertical and a smaller horizontal component,
     echoing the shader's 2D `random(grid)`) — so a tile can only ever
     be out of step with its own row by about one row, never scattered
     arbitrarily across the whole band regardless of where the sweep
     actually is.
- **Seventh revision, same day — client: "its not fucking working."**
  Terse, frustrated, no specifics — asked a direct clarifying question
  (what does "not working" mean: nothing visible, a console error,
  something visible but wrong, or the whole page broken) rather than
  guessing an 8th time blind. Client's answer clarified the actual
  issue: the effect WAS visible, but only over Services (the dark
  section above the seam) — because every tile is a single fixed color,
  and the 6th revision's per-half color-matching made the Uniforms half
  match Uniforms' own white background too, so THAT half was just as
  invisible as the Services half, defeating the entire point. Client's
  own words: "los pixeles son negros... tendria que estar arriba de la
  seccion blanca" (the pixels are black, so it should be positioned
  over the white section).
  - **Split coloring removed entirely.** Every tile is now one fixed
    color — `var(--color-bg)` (black) — set directly in a plain CSS
    rule (`.pixel-seam__tile`, page-home.css), not computed per-tile in
    JS. `js/pixel-transition.js` no longer reads `data-color-above`/
    `data-color-below` at all; both attributes are gone from the seam
    div in `pages/index.html`.
  - **Band repositioned to sit ENTIRELY inside Uniforms**, not
    straddling the boundary. `.pixel-seam__band`'s `top` changed from
    `-120px` (straddling half into Services, half into Uniforms) to
    `0` (starts exactly at the boundary, extends only downward into
    Uniforms) — height unchanged (240px desktop / 140px mobile). Since
    every tile is black, this is the only positioning that makes sense:
    black tiles are only ever visible against Uniforms' light
    background, so the previous straddle wasted half the band's height
    sitting invisibly over Services.
  - **Padding adjusted to match.** `.services`' extra `padding-bottom`
    (added for the straddling version) was removed entirely — the band
    no longer touches Services at all. `.outfits`' extra `padding-top`
    increased from `+120px`/`+70px` (half the band, back when only half
    sat inside this section) to the band's FULL `+240px`/`+140px`,
    since the whole band now lives inside this section.
- **Not yet visually verified** — no browser tool in these sessions,
  same standing caveat as every other build this phase, and still true
  after seven revisions: every single one has been driven by a bug
  report or a direct question, never a confirmed-working look. The
  `top 80%` → `top 20%` scroll range, the `TILE_SIZE`/jitter values, and
  the exact `240px`/`140px` band height are all still analytically
  picked.
- **Eighth revision — first real visual confirmation this feature has
  ever gotten.** Client sent an actual screenshot showing the jagged,
  static-like dissolve edge working (the 6th/7th revisions' fix), with
  one correction: the wipe direction should be flipped ("es la otra
  vuelta, los pixeles desaparecen al reves"). Fixed in
  `js/pixel-transition.js`'s reveal loop: `idealProgress` changed from
  `row / (rows - 1)` (row 0, at the boundary, revealed first; the last
  row, deepest into Uniforms, revealed last) to `1 - row / (rows - 1)`
  (inverted — the deepest row now reveals first, the row at the
  boundary reveals last). Nothing else about the mechanism changed.
- **Not yet re-verified after this flip** — no browser tool in these
  sessions. This is the first revision built on top of an actual
  confirmed-partially-working state rather than a bug report describing
  brokenness, which is real progress, but the direction flip itself
  hasn't been seen yet — worth a quick confirmation via `npm run dev`
  that it now reveals the way the client expects.
- **Ninth revision — client: "too much height."** Band height (and
  `.outfits`' matching `padding-top`) cut in half: 240px → 120px desktop,
  140px → 70px mobile (`.pixel-seam__band`/`.outfits`, both
  page-home.css — the two must stay in sync, see each rule's own
  comment). Nothing else about the mechanism changed; `TILE_SIZE`'s own
  24px is unchanged, so this also means fewer rows now (~5 desktop, ~3
  mobile, down from ~10/~6) — still enough for the jitter-based
  sweep-noise to read as noise, just a shorter band overall.

**2026-07-21 References testimonials redesigned — centered, compact,
masonry — still pending visual review.** Detailed client brief (no
actual screenshots came through with the request despite it referencing
two — flagged to the client at the time; proceeded from the brief's own
very thorough text spec, which fully specifies composition, spacing,
and method). Brief: the section reads too wide/stretched/spaced-out;
wants centered, compact, editorial, masonry-puzzle feeling instead of a
standard card grid. Scoped to `.references` only, per the brief's own
"do not redesign unrelated sections."

- **Files changed**: `css/page-home.css` only — no HTML or JS changes,
  content (3 real testimonials, avatars, Google icon, stats) completely
  untouched, per the brief's own "preserve existing review content."
- **Layout method**: CSS multi-column (`columns: 2` + `break-inside:
  avoid` on `.testimonial`) — already what this section used since the
  2026-07-20 masonry restyle, and explicitly the brief's own "preferred"
  approach, so the underlying mechanism didn't change, only spacing/
  sizing. No fixed heights were introduced anywhere, per the brief's
  explicit "do not fake the masonry layout."
- **New container width**: `.references .container { max-width: 75rem;
  }` (1200px) — a new rule scoped to just this section, overriding the
  sitewide `.container`'s own 1440px (`layout.css`) rather than changing
  that shared token. Lands in the brief's own recommended
  "~1180-1280px" range.
- **Header re-centered**: `.references__intro` was a left-heading/
  right-lede 2-column grid (matching `#trust-metrics`' own split, added
  2026-07-17) — reverted to a single centered flex column (eyebrow,
  heading, lede stacked, `gap: var(--space-3)`, 12px), same composition
  `.social__intro`/`.faq__intro` already use elsewhere on this page.
  `.section-eyebrow`'s shared `display: flex` needed an explicit
  `justify-content: center` addition — same gotcha already documented on
  `.trust-metrics__intro`'s own eyebrow.
- **Spacing tightened throughout** (brief's own recommended ranges hit
  in every case):
  - Header-to-grid gap: was two stacked margins (intro's inherited 64px
    `margin-bottom` + results' 64px `margin-top` = 128px combined) — now
    a single 48px gap, controlled from one place (results' `margin-top`
    only; intro's own margin-bottom zeroed out).
  - Results-to-testimonials gap: 96px → 48px.
  - Column gap: 32px → 24px (brief: "~20-28px").
  - Card-to-card vertical gap: 32px → 24px (brief: "~20-28px").
  - Card padding: 32px → 24px (brief: "moderate... not excessive").
  - Card border-radius: 16px → 8px (brief: "moderate rounded corners") —
    same less-soft direction this project has taken elsewhere (e.g.
    `.pillar-card`'s own radius reduction) for similar briefs.
  - Header-to-avatar-row and quote-to-stars gaps also tightened (24px →
    16px each).
- **Grid/masonry structure with only 3 real cards**: the brief describes
  an asymmetric left/right composition (e.g. "left: medium + taller;
  right: tall + medium + optional shorter") that implies more cards than
  this section actually has. With exactly 3 real testimonials and no
  invented ones added to fill both columns evenly (this section has its
  own documented history of avoiding fabricated content — see Corporate
  Identity above), CSS columns' natural balancing already distributes
  them 2-in-one-column/1-in-the-other rather than a strict 2×2 matrix —
  which is the "puzzle, not a rigid grid" feeling the brief asks for,
  achieved without any artificial height or manual reordering.
- **Responsive**: 1 column below 640px, 2 columns at/above (unchanged
  breakpoint) — matches the brief's "preserve two columns if there's
  enough width" for tablet. Mobile (<640px) gets one additional step
  down in padding (24px → 16px) and radius (8px → 4px), per the brief's
  own "reduce border radius and internal padding slightly" on mobile.
- **Content reordered**: none. **Assumptions made**: proceeded without
  the two referenced screenshots (never arrived) — every specific number
  above was chosen to land inside the brief's own stated ranges, not
  measured against an actual reference image.
- **Not yet visually verified** — no browser tool in these sessions,
  same standing caveat as every other build this phase.

**2026-07-21 Outfit viewer name-picker restyled again — still pending
visual review.** Client feedback on `.outfits__name-btn` (the Polo/
Pullover/Vest/etc. list): names a bit too big, disliked the blue-text +
bold + underline active/hover state, and wanted the same
`icon-arrow-diagonal` sprite arrow the Services Overview list uses.
- **Font size** stepped down one notch, `--font-size-xl` →
  `--font-size-lg`.
- **Hover/active state replaced entirely.** The old
  `color: var(--color-blue-dark); font-weight: 600; border-bottom-color:
  var(--color-blue-dark)` treatment is gone — client: "no me gusta el
  hover azul y bold... prefiero fondo negro y tipografia blanca, la
  flecha y el texto." Now a solid black fill (`background-color:
  var(--color-logo-black)`) with white text, same "invert the whole
  row" idea as `.services__item`'s hover (Services Overview, this
  file), just inverted the other direction since this section sits on a
  light background instead of a dark one. `padding-inline: var(--space-4)`
  + a matching negative `margin-inline` let the fill bleed slightly past
  the text's own edges without shifting where the text lines up
  relative to the heading/lede above it (same compensating-margin
  pattern used elsewhere on this site, e.g. `.hero`).
- **New arrow**: each button now has a real
  `<svg class="outfits__name-arrow icon"><use href="#icon-arrow-diagonal">`
  (same shared sprite symbol as `.services__item-arrow`), pushed to the
  row's far end via `margin-left: auto`. Same up-right-at-rest,
  rotates-to-straight-right-on-hover mechanism as Services' arrow, but
  colored the other way around: black at rest (visible against this
  section's light background), white on hover/active — Services' arrow
  is white at rest specifically because that section sits on the dark
  page background; each is colored for whatever it actually rests on,
  not a literal copy of the other's color values.
- **Not yet visually verified** — no browser tool in these sessions,
  same standing caveat as every other build this phase.

**2026-07-21 Coverage Areas: interactive Leaflet map — still pending
visual review.** Client brief: replace the plain city-pill list with a
real interactive map (Leaflet.js + OpenStreetMap, no account/API key/
token/billing — see "Non-negotiable tech constraints" above for that
approval) where selecting a city draws its **actual administrative
boundary** as a polygon, not a generic circle, and the map animates to
fit it.

- **Files**: `pages/index.html` (Coverage Areas section — map container
  + overlay added, the 10 pill links gained `data-coverage-city` hooks
  but keep their real `href`s unchanged; Leaflet CSS/JS + new
  `<script>` added to `<head>`), `css/page-home.css` (`.coverage__map*`/
  `.coverage-marker*`/active-pill state), new `js/coverage-map.js`
  (homepage-only), new `assets/js/vendor/leaflet.js` +
  `css/vendor/leaflet.css` (self-hosted, v1.9.4, downloaded once from
  unpkg — same pattern as GSAP/fonts), new
  `assets/data/coverage-boundaries/*.geojson` (10 files).
- **The 10 locations** (final, approved list — no Kronach, no
  Lichtenfels, nothing beyond these): Bamberg, Nuremberg, Würzburg,
  Erlangen, Fürth, Schweinfurt, Bayreuth, Coburg, Ansbach, Hof. Same
  cities/URLs this section (and the footer) already used.
- **Boundary data — how it was actually obtained.** The brief's own
  instruction was explicit: fetch real boundaries once "during
  development," save them locally, and never call a geocoding API at
  runtime. Fetched all 10 directly from Nominatim (OpenStreetMap's
  geocoding service — free, no key) via a one-time Python script in this
  session, respecting Nominatim's rate-limit policy (1 request/second,
  a real identifying `User-Agent` header sent with every request — see
  the script's own UA string for the exact wording). **This needed real
  verification, not a blind first result**: several cities' first-match
  result was wrong or missing a polygon —
  - Würzburg/Erlangen/Ansbach's structured `city=` query returned a
    result with no `geojson` polygon at all; switched to Nominatim's
    free-text `q=` query instead, which returned a proper Polygon/
    MultiPolygon for all three.
  - **Fürth's structured query initially matched the wrong place
    entirely** — a same-named village ("Furth (VGem), Landkreis
    Landshut") in Lower Bavaria, nowhere near the real Fürth next to
    Nuremberg this project means everywhere else. Caught by checking
    the returned `display_name`/coordinates against the already-known
    correct coordinates before saving anything; a corrected free-text
    query ("Fürth, Bayern, Deutschland") returned the right one
    (lat/lon matching this file's own `coverageLocations.fuerth.center`).
  - Ansbach and Fürth's result lists both also contained the
    surrounding **rural district** ("Landkreis Ansbach" /
    "Landkreis Fürth") as a separate candidate — a real but wrong
    answer for "the city itself" (kreisfreie Stadt vs. Landkreis are
    different administrative areas in Bavaria) — explicitly filtered
    out by display name before picking a result.
  Each saved `.geojson` file is a plain GeoJSON `Feature` (not the raw
  Nominatim response) with `properties.osm_display_name` kept for
  future auditing. Sizes range ~30-102KB (Nuremberg, the most complex
  boundary, is the largest). Coordinates: GeoJSON files keep the
  GeoJSON-spec `[longitude, latitude]` order untouched;
  `js/coverage-map.js`'s own `coverageLocations` object uses Leaflet's
  `[latitude, longitude]` order for marker/view centers — the two were
  never reconciled/reversed into each other, per the brief's explicit
  warning not to.
- **Loading + caching — changed 2026-07-21, see the "All" default-view
  addendum below.** Originally only Bamberg's boundary loaded on initial
  page load; now all 10 load upfront (client request to default to an
  "All" view). Every city's `.geojson` still goes through the same
  `fetch()`-once/`boundaryCache` `Map` path — selecting the same city
  (or "All") again never re-fetches. A monotonic `activeRequestId`
  counter (the brief's own suggested "request tracking" approach, not an
  `AbortController`) makes sure that if a visitor clicks through several
  cities faster than their fetches resolve, only the response matching
  the *last* click is ever allowed to touch the map — every earlier,
  now-stale response is silently dropped when it arrives.
- **View transition**: `map.flyToBounds(boundaryLayer.getBounds(), {
  padding: [40, 40], duration: 1.4, maxZoom: 13 })` — the brief's own
  suggested call, verbatim. `prefers-reduced-motion` swaps this for
  `map.fitBounds(bounds, { animate: false, maxZoom: 13 })` instead (the
  brief's own explicit reduced-motion instruction) — no zoom value is
  ever hardcoded per city; it's always derived from that city's real
  boundary size via `getBounds()`.
- **Fallback**: if a boundary fetch ever fails (bad path, offline, etc.),
  the map doesn't break — it falls back to that city's plain center
  coordinate via `flyTo`/`setView`, the marker and pill still activate
  normally, and the overlay's secondary line changes to "Boundary
  temporarily unavailable." The real error is only ever
  `console.warn`'d, never shown to a visitor.
- **Responsive**: map height is 420px (mobile) → 500px (768px+) → 600px
  (1024px+), inside the brief's suggested ranges at each step. City pills
  stay the existing wrapped two-row grid at every width (not a
  horizontal-scroll strip — the brief offered either, this project
  already had the wrapped-grid pattern working and it doesn't overflow).
- **Real links, not JS-only buttons**: every one of the 10 city pills is
  still a genuine `<a href="/sicherheitsdienst-<city>/">` — unchanged
  from before this map existed. `js/coverage-map.js` only adds a `click`
  handler on top (`preventDefault()` + drive the map instead of
  navigating). If that script ever fails to load, every pill still works
  exactly as a plain link to its (not yet built) city page, same as it
  already did. `aria-current="true"` marks the active one — the correct
  ARIA pattern for "the current item in a set of choices" on a real
  link. The one "All" button (added 2026-07-21, see below) is the single
  exception — it's a real `<button>`, not an `<a>`, since it has no page
  of its own to navigate to, and uses `aria-pressed` instead, which
  *is* spec'd for buttons specifically.
- **Attribution**: OpenStreetMap's attribution control is untouched, in
  its default bottom-right corner; the new overlay panel is deliberately
  top-left specifically so the two can never overlap.
- **Tile style switched to dark, same day** (client follow-up right
  after the build report: "is there a way to make the map other
  color?") — from plain OpenStreetMap raster tiles (colorful) to
  CARTO's free "Dark Matter" basemap
  (`{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`), which
  matches the site's dark theme far better. Still no account/API
  key/billing — verified with `curl -sI` (HTTP 200 for both the plain
  and `@2x` retina tile URLs) — CARTO's basemap tiles are free and
  keyless for this kind of use, same as raw OSM tiles; the map is still
  rendered from OpenStreetMap data underneath, so the attribution
  string now credits both OpenStreetMap **and** CARTO (required by
  CARTO's own attribution terms). `detectRetina: true` added at the
  same time for sharper tiles on high-DPI screens — `{r}` only ever
  resolves to `@2x` or an empty string depending on the display, never
  a literal unsubstituted token, so this is safe unconditionally.
  Polygon/marker colors (FRANKONIA blue, `#3D9AD3`) already read well
  against a dark basemap and didn't need changing.
- **Overlay copy simplified, same day**: "Selected coverage area" →
  "Coverage area" (client request) — only the small uppercase label;
  the city name and the "Administrative area"/fallback-message line
  below it were unchanged at the time — **that sub-line was removed
  entirely in a later same-day follow-up, see below.**
- **"All" default view, added 2026-07-21 (client request: "por defayl
  se muestren todas... deberia haber un boton con all y ahi se ve el
  mapa de mas lejos con todas las ciudades coloreadas").** A new pseudo-
  city id (`ALL_ID = "all"` in `js/coverage-map.js`) that draws every
  real city's boundary at once, as a single `L.featureGroup` of 10
  `L.geoJSON` layers (same blue styling as a single city — brief asked
  for "colored," not per-city distinct colors), fit into view via the
  same `flyToBounds`/`fitBounds` pattern as a single city but with a
  lower `maxZoom` (11, vs. 13 per-city — fitting 10 cities at once needs
  a much wider view) and tighter padding (16px animated / 12px reduced-
  motion, vs. 40px/24px per-city). Both were tuned once, same day,
  after the client saw the first result and asked to "amplialo un
  poquito porque estan muy lejos" (zoom in a bit, they read as too far
  apart) — `maxZoom` went 10→11 and padding was cut roughly in half
  from the initial pass. Neither value can ever clip a city out of
  view: `fitBounds`/`flyToBounds` always computes the exact zoom needed
  to contain every polygon in the `featureGroup` first, then this
  padding/cap only controls how much margin surrounds that — so "zoom
  in more" here specifically means "less empty margin," not "risk
  cutting off a city." This is now the page's default state on load,
  replacing the old Bamberg-only default — see the "Loading + caching"
  note above for the resulting perf trade-off (all 10 boundaries now
  fetch upfront instead of just one).
  - **UI**: a new `<button type="button" data-coverage-city="all">All
    </button>` (`.coverage__pill--all`, page-home.css), prepended as its
    own first `<li>` — deliberately NOT folded into the existing
    footer-matching 6+5 two-row city split, so that split (real
    navigation links only) stays untouched. Styled with an always-blue
    border + bold text so it reads as a distinct view toggle, not one
    more city.
  - **ARIA**: this is the one pill on the whole map that's a real
    `<button>`, not an `<a>` — it has no page of its own to link to (the
    old "All Coverage Areas" link to `/einsatzgebiete/` was removed
    entirely, separately, earlier the same day). `setActiveButton()` in
    `js/coverage-map.js` now branches on `tagName`: `aria-pressed` for
    this one button, `aria-current` for the 10 real `<a>` links, same
    distinction CLAUDE.md already documents elsewhere for this project.
  - **Markers**: all 10 city markers stay visible (as they always have);
    `setActiveMarker(null)` clears every marker's `.is-active` state
    while "All" is selected, since no single city is more current than
    the rest.
  - **Overlay copy**: while "All" is active, the panel reads "All
    Cities" (city-name line only — see the panel-simplification
    addendum right below, which removed the sub-line this originally
    also set).
  - **Initial map view**: before the "All" boundaries finish loading,
    the map's very first paint uses a hardcoded rough region center/zoom
    (`REGION_CENTER`/`REGION_ZOOM` in `js/coverage-map.js`, not derived
    from anything) — `drawAllBoundaries()`'s real `fitBounds()` corrects
    this within moments once the actual polygons load, same brief loading
    state (`.is-loading`, dimmed tiles) as any single-city fetch.
  - **Fallback**: if any boundary fetch fails, the map falls back to the
    same `REGION_CENTER`/`REGION_ZOOM` via `flyTo`/`setView`, same as a
    single-city failure — see the panel-simplification addendum below
    for why this no longer also shows an "unavailable" message; the
    error is still `console.warn`'d either way.
- **Overlay panel repositioned + simplified, same day (client:
  "pone este cuadrado de texto a la derecha porque el mas menos lo
  tapa y saca el texto de abajo").** Two changes to `.coverage__overlay`
  (page-home.css) and its markup (pages/index.html):
  - **Moved top-left → top-right.** Leaflet's default zoom control
    (`+`/`−`) also lives top-left, and was sitting on top of this panel —
    moving the panel to the opposite corner is the fix, not repositioning
    the zoom control. Still doesn't collide with Leaflet's attribution
    control (bottom-right) — top-right and bottom-right never overlap.
  - **Sub-line removed entirely** — the panel is now just the small
    "COVERAGE AREA" label + the city name (or "All Cities"), full stop.
    The `<p class="coverage__overlay-sub">` element, its CSS rule, and
    every JS reference to it (`overlaySubEl`, `DEFAULT_SUB_TEXT`,
    `FALLBACK_MESSAGE`) were all removed from `js/coverage-map.js` —
    this also means a failed boundary fetch no longer shows "Boundary
    temporarily unavailable" anywhere on the page; the map still
    recovers visually (falls back to that city's/region's plain center
    view, per the Fallback notes above and elsewhere in this section),
    the error just isn't surfaced in copy anymore, only via
    `console.warn`. If a future brief wants error-copy back, it needs a
    new element to write it into — nothing currently listens for it.
- **Not yet visually verified** — no browser tool in these sessions,
  same standing caveat as every other build this phase. This is the
  single most worth checking of anything built so far: confirm the tile
  layer actually loads its map images, boundary polygons render in
  reasonable positions, and the fitBounds animation looks right for at
  least a few cities of very different sizes (Nuremberg vs. Ansbach)
  before calling this done.

**2026-07-20 first motion pass (client direction via Chris, following the
GSAP/Lenis tech-constraint revision above) — still pending visual
review.** Two changes, both aimed at the newly-approved "Apple-like"
feel:
- **Section headings now fade/slide in on scroll, not just the content
  below them.** Every `.section__intro`-style heading wrapper on the
  homepage (`trust-metrics__intro`, `pain-hook__intro`, services'
  `section__intro`, `social__intro`, `references__intro`,
  `coverage__intro`, `faq__intro`) and on `/werkschutz/` (all 8
  `.section__intro` blocks + `.service-cta__content`) picked up
  `data-reveal` — before this pass only the content grids/lists inside
  those sections had it, so headings just appeared instantly with the
  page. No new CSS/JS needed; this reuses the existing `.u-reveal`
  system exactly as designed (see "Accessibility & motion foundation"),
  just applied more completely. `.outfits__intro` and `.conversion__info`
  were already covered as part of a larger `data-reveal` block and didn't
  need touching.
- **`.u-reveal`'s easing changed** from `--easing-standard`
  (`cubic-bezier(0.4, 0, 0.2, 1)`, a symmetric material-style curve) to
  a new `--easing-premium` (`cubic-bezier(0.16, 1, 0.3, 1)`, tokens.css)
  — an expo-out curve with no overshoot, ported from the Sacramentum
  Advisors reference project (a different Filamento project inspected
  specifically for its motion/smoothness techniques). `--easing-standard`
  is untouched and still backs ordinary hover/toggle transitions
  (e.g. the header's light/dark scroll swap) — the new token is
  scoped to content-arriving-into-view moments only.
- **`initStatCountUp()` widened from 3 elements to every `.stat__value`
  sitewide** (`js/main.js`) — previously scoped to just the
  `.trust-metrics__list` numbers; now also animates the "Real Results
  From Our Customers" figures (`€25,000` / `30%` / `20%`). The parsing
  regex was widened at the same time to accept an optional prefix (`€`)
  as well as a suffix (`+`, `%`) — previously suffix-only.
- **First real GSAP moments landed, two files**: `js/hero-reveal.js`
  splits the hero `<h1>` into words, each masked in an overflow-hidden
  span, animated up into place once on page load (not scroll-triggered
  — the hero is always in view at first paint). `js/title-reveal.js`
  (added same day, right after — the first pass only covered the hero,
  and every other section heading still just appeared instantly with a
  barely-visible 16px CSS fade; client feedback: "I'm not seeing all the
  titles appear like that") extends the identical word-mask treatment to
  every other `<h2>` on the homepage, this time via ScrollTrigger so each
  one plays as it scrolls into view (`start: "top 88%"`,
  `toggleActions: "play none none none"` — plays once, doesn't reverse).
  Both are the "small set of deliberate motion moments" the tech-
  constraints revision above approved GSAP for; the underlying
  `.u-reveal` CSS system is untouched and still separately fades in the
  content grids/lists and the heading wrappers' lede text.
  GSAP core + ScrollTrigger are vendored self-hosted at
  `assets/js/vendor/gsap.min.js` / `ScrollTrigger.min.js` (v3.15.0,
  downloaded once from unpkg, no CDN reference at runtime — same
  self-hosting pattern as fonts), each loaded via its own
  `<script defer>` in `pages/index.html`'s `<head>`, same pattern as
  `js/outfits.js`. Both new scripts guard for `typeof gsap`/
  `typeof ScrollTrigger === "undefined"` and `prefers-reduced-motion`,
  and only ever rewrite a heading's real text into word/span markup from
  inside the script itself — a no-JS visitor or a crawler that doesn't
  execute JS sees the plain, complete, unsplit heading, same JS-only-
  ever-enhances contract as every other motion primitive on this site.
  Homepage-only so far — `/werkschutz/`'s `<h2>`s still only have the
  plain CSS `data-reveal` fade from earlier in this same pass; add these
  two scripts there too once there's a specific reason to.

**2026-07-20 Trust Metrics section redesigned as one centered B2B trust
experience — still pending visual review.** Client brief (reference: a
"Trusted by industry leaders"-style page, used only for composition/
spacing direction, not copied literally). New order: centered eyebrow +
one consolidated heading/lede → existing 3 metrics → real client-logo
subsection → existing 6 value pillars, now with their own heading.
Refined twice more the same day — see the two follow-up notes below this
one for the single-heading consolidation and the real logos landing.

- **DEKRA badges moved back to the hero**, next to the Google rating —
  reverses the 2026-07-17 decision that had moved them out to this
  section. Fresh classes (`.hero__trust`/`.hero__badges`/`.hero__badge`),
  explicitly not a restore of the old deleted `.hero__cert-seal`/
  `.hero__badges` (same "treat a comeback as a fresh request" precedent
  this file already uses for the header-transparency flips). This
  section no longer shows certification badges or the Google rating at
  all — it's metrics/logos/pillars only, per the brief.
- **Intro centered**: `.trust-metrics__intro` was a 2-column grid
  (heading left, copy right, added 2026-07-17) — now a single centered
  column, `max-width: 44rem` (brief's 620-720px target). The eyebrow
  needed an explicit `justify-content: center` — `.section-eyebrow`'s
  shared default is `display: flex` for its icon+text pairing, which a
  parent's `text-align: center` doesn't affect.
- **Client-logo subsection — RESOLVED same day, real logos now in
  place.** Initially built as placeholders (no client logo files existed
  anywhere in this project at first check). Client then supplied the
  real files into `assets/images/Logos/` (3 service-line subfolders —
  "1. Bereich Werk- und Objektschutz", "2. Baustellenbewachung",
  "3. Veranstaltungsschutz" — spaces in every folder/file name, each a
  1017×1017 square PNG padded with a lot of surrounding white/opaque
  background, not transparent). 8 were requested by name: DB Netze,
  Aldi (Süd), Stadt Bamberg, Norma, ADAC, Bayernwerk, BRK, Liapor.
  Visually inspected each one before use (all already sit on opaque
  white — none needed a dark/inverted swap). Cropped every one to its
  actual content bounding box (Python/Pillow — no ImageMagick available
  in this environment; trimmed against a white background via
  `ImageChops.difference`, +12px margin) and saved into `assets/icons/`
  as `client-<name>.png` — clean lowercase-dash names per this project's
  file convention, and out of the raw working folder (which stays as-is,
  not deployed — `dist/` only ever contains what `pages/*.html`
  reference). Real `<img>` tags now, with real dimensions from the crop
  and descriptive `alt` text per company. Dropped the `--featured`
  bigger-tile variant from the earlier placeholder pass — none of the 8
  was singled out as more important than the rest, so all render at the
  same size in one even, centered, wrapped row. White tiles
  (`--color-white`), no shadow, `--radius-sm`, a subtle hover lift —
  unchanged from the placeholder pass, just now holding real content.
- **Consolidated to one heading, same day, second correction** ("vamos
  a dejar solo un título"): the separate "Trusted by companies across
  the region" subsection heading + lede that used to sit right above the
  logo grid are gone. Both lines of copy ("Trusted by leading companies
  and institutions." / "Long-term security partnerships across
  industry, infrastructure, retail and the public sector.") moved up
  into `.trust-metrics__intro` as two stacked `.trust-metrics__text`
  paragraphs, under the section's one remaining heading. That heading
  itself changed too — "Security you can trust." → "Trusted Across<br>
  The Region", a literal client-specified 2-line break (`<br>`, not a
  responsive wrap), reference: a Cantor8-style "Trusted by industry
  leaders" page shown directly to confirm the exact composition.
- **Value pillars**: added the "What Clients Can Expect" heading above
  them (new, centered, white, sits on the darkened photo). Added a real
  dark overlay over the background photo for the first time —
  `.trust-metrics__cards-bg::before`, a flat `rgb(1 1 1 / 0.55)` wash;
  there was no overlay at all before this, the photo sat fully exposed
  behind the cards. `.pillar-card`'s border-radius reduced from
  `--radius-lg` (16px) to `--radius-md` (8px) per the brief's "reduce
  excessive rounding if currently too soft." Copy/icons/6-card content
  completely untouched, per explicit brief instruction.
- **Mobile**: added a horizontal divider between stacked metrics
  (`border-top`, there was no divider of any kind on mobile before —
  only the desktop view had the vertical hairlines). Logo tile sizing
  switched to `clamp()` instead of a fixed rem width specifically
  because two ~11rem tiles plus their gap would have overflowed a
  ~375px phone otherwise.
- **Not yet visually verified** — no browser tool in these sessions,
  same standing caveat as every other build this phase. The dark photo
  overlay's exact strength and the logo-placeholder composition in
  particular are worth a specific look via `npm run dev`.

**2026-07-20 "Free Security Analysis" redesigned as a full editorial
split-screen — still pending visual review.** Client brief: redesign
this section (reference: a Glassmoon-style split contact page) into a
black-left/white-right, full-viewport-height composition — confirmed
*before* building that this stays the existing homepage section
(`#sicherheitsanalyse` in `pages/index.html`, same place in the scroll)
styled to feel like an immersive landing moment, not a new page/URL.

- **Structure**: `.conversion` dropped `.section`/`.container` entirely
  (deliberate — this section needs to be full-bleed, no max-width, no
  padding-block rhythm) and is now two `.conversion__panel` children in
  a CSS grid, each `min-height: 100vh` from 768px up. Left = black,
  quiet eyebrow/headline/lede (headline down from a full sitewide h2 to
  its own small `clamp(1.75rem, 1.4rem + 1.5vw, 3.25rem)` scale — brief:
  "not oversized"), abstract SVG visual, then "20 minutes · Free · No
  obligation" microcopy pinned to the bottom via `justify-content:
  space-between`. Right = white (`--color-white`, the same token every
  other light section on this page already uses — see below), the form.
- **Content removed from the left column**: the old "What's included"
  3-item checklist is gone entirely, per explicit brief instruction
  ("Do not include... a long bullet list on the left"). That content
  isn't preserved anywhere else on the page — flagging in case it's
  needed again later.
- **Abstract visual** (`.conversion__visual`, inline SVG, no raster
  image, no GSAP): disconnected grey line fragments + an open corner
  bracket on the left ("unclear current setup"), one continuous path
  running left→right whose stroke fades from grey to `--color-accent`
  via an SVG `<linearGradient>` (this is what carries the brief's
  "fragmented → ordered" transition, not a second element), a couple of
  small circle "nodes" (only the risk-marker and endpoint ones are
  blue — brief: "one or two highlighted points"), and a cleaner
  rectangle-corner fragment on the right. Entrance animation is plain
  CSS `@keyframes` (a `stroke-dashoffset` draw + a small opacity/stagger
  fade, both `animation-fill-mode: forwards`, neither looping) —
  deliberately not GSAP, per the brief's explicit ask to avoid that
  dependency for this one graphic. `prefers-reduced-motion` needs no
  extra rule: `motion.css`'s existing blanket
  `animation-duration: 0.01ms` override already neutralizes both
  animations the same way it does everything else on this site.
- **Form redesign**: the old bordered `.conversion__form-card` box is
  gone — fields now sit directly on the white panel with a thin
  bottom-border only (no fill, no rounded box), small uppercase labels
  above each field, blue underline on focus. All scoped under
  `.conversion__form .form-field*` so the *shared* `.form-field`/
  `.form-checkbox` components (components.css) are untouched for any
  future reuse elsewhere on the site. Same field set, names, types,
  `autocomplete`, `required` attributes, and `action="#"/method="post"`
  placeholder as before — there was no submission JS to preserve beyond
  native HTML5 validation, and none of that changed.
- **Submit button**: new `.conversion__submit` modifier on the shared
  `.btn.btn--primary` — overrides the shared pill `border-radius` down
  to `--radius-sm`, and cancels CSS Grid's default `justify-self:
  stretch` (which, combined with `grid-column: 1/-1`, is what made the
  old button stretch full-width) so it sizes to its own content instead,
  per the brief's "width based on content, not full width." Reuses the
  same `icon-arrow-diagonal` sprite symbol the Services list's hover
  arrow already uses (static here, no rotation).
- **Color**: brief asked for "warm white / very light neutral gray" for
  the right panel. This project's five-brand-color system (Corporate
  Identity, CLAUDE.md) has no such hue, and this build did not introduce
  one — `--color-white` (the same token References/Outfits/FAQ already
  use for their own "light mode") is what's used instead.
- **Known edge case, flagged not fixed**: `data-nav-theme="light"` is on
  this section so the header gets its frosted dark-text look while
  scrolling past it — but `initHeaderScrollTheme()` (`js/main.js`)
  treats a whole section as one boolean (light or not), and this section
  is genuinely *half* black / half white, which that shared, sitewide
  function was never built to represent. It may switch the header's
  theme slightly earlier/later than ideal relative to which half is
  actually behind it. Fixing that would mean changing shared global JS
  used by every page — out of scope for "only redesign this page," left
  as a flagged limitation instead. Worth a specific look via `npm run
  dev`.
- **Not yet visually verified** — no browser tool in these sessions,
  same standing caveat as every other build this phase. The abstract SVG
  visual in particular is the one piece here that's hardest to judge
  correctly without actually seeing it rendered.

**2026-07-20 New section: "Our System" (`#our-system`), between Pain
Hook and Services — still pending visual review.** Client brief: a
premium scroll-driven 6-outcome section, sticky two-column layout (fixed
intro left, six panels scrolling past on the right, one "active" at a
time). Copy is 100% client-approved and used verbatim — nothing
invented. Numbered "2.5" in the section-comment sequence (same
convention as 1.5/4.5/6.5), not a renumber of everything after it.

- **Files**: `pages/index.html` (new section only), `css/page-home.css`
  (`.system*`, new block right after Pain Hook's), new
  `js/system-panels.js` (homepage-only, own `<script defer>` tag, same
  pattern as the other GSAP moment files), one-line addition of
  `id="uniforms"` to the existing Outfits `<section>` (had no id before
  — purely additive, that section's own content/behavior is untouched)
  so panel 01's "Explore uniforms" link has a real target.
- **Interaction, desktop/tablet (≥1024px)**: `.system__intro` is a
  plain native CSS `position: sticky` (zero JS) that stays put while
  `.system__panels` (six panels, each `min-height: 30vh` — six of these
  plus gaps is what produces the brief's ~180-240vh scroll distance, no
  section-level pin needed at all) scrolls past. Each panel gets its own
  `ScrollTrigger` with `toggleClass`, adding `.is-active` (full opacity,
  slight scale-up) whenever that panel crosses the viewport's vertical
  center, removing it once it scrolls past — previous panels dim
  (`opacity: 0.45`) rather than disappearing, matching the brief. No
  scrub, no manual GSAP tweens for this part — `toggleClass` + a plain
  CSS transition is the whole mechanism, deliberately simpler than Pain
  Hook's path-scrub since nothing here needs frame-by-frame progress.
- **Mobile/tablet-narrow (<1024px)**: no sticky column (grid collapses
  to one column, intro renders first in normal flow, panels stack
  below), no active/dimmed emphasis — each panel just fades in once
  (`ScrollTrigger` with `once: true`) as it's scrolled to, matching the
  brief's simpler mobile fallback. The "Explore uniforms" link stays
  exactly where it is in panel 01, no special-casing needed.
- **Reduced motion**: checked before any `ScrollTrigger` is created — if
  set, the function returns immediately and does nothing at all. This
  works because every panel is already fully visible by default (see
  `.system__panel`'s own comment, page-home.css) — the "simple static
  stack" the brief asks for under `prefers-reduced-motion` **is** the
  default, unanimated state, same JS-only-ever-enhances contract as
  every other motion primitive on this site. This also means a no-JS
  visitor or a crawler sees the section fully readable regardless.
- **Placeholders**: all six panels use one shared `.system__panel-media`
  box (`aspect-ratio: 4/3`, bordered, reserves its own space — no CLS
  when a real `<img>` replaces it later). Panels 01-05 hold a
  `[Placeholder — …]`-style label describing what photo belongs there
  (same bracketed-placeholder convention as `/werkschutz/`'s
  `.service-reference`). **Panel 06 is the one exception** — its
  "visual" per the brief is literally the 4-step text flow (Issue → Root
  cause → Corrective action → Resolved), which doesn't need a future
  photo at all, so it's rendered as real content in the same-shaped box,
  not a placeholder label. Rendered as a *vertical* stack with a small
  down-arrow between steps rather than the brief's inline horizontal
  arrows — at this box's real rendered width (42% of the right column),
  four full phrases don't fit legibly in one row without shrinking past
  this section's type scale; flagged as a judgment call, easy to revisit.
- **No Lenis**: same flag as the Pain Hook build above — this brief also
  assumed an existing Lenis integration (modeled on the same other
  Filamento project). This project has none; built against native
  scroll + ScrollTrigger only.
- **Echo of a removed section, not a revival**: the old "Six Value
  Pillars" section (also six items, heading also started "Less
  Effort...") was removed outright 2026-07-13 (see Corporate Identity
  above). This new section's content is genuinely different
  (client-approved specific outcomes, not generic pillars) — flagged
  here only because the phrasing echo is close enough to be worth
  knowing about.
- **Not yet visually verified** — no browser tool in these sessions,
  same standing caveat as everything else in this phase. The `min-height:
  30vh` per panel is a soft floor tuned to hit the brief's target scroll
  distance analytically, not from an actual measurement — check the
  real scroll feel via `npm run dev` before calling this done, and
  adjust that value if six panels end up running noticeably longer or
  shorter than ~180-240vh in practice.

**2026-07-20 Pain Hook redesign — "patrol journey," still pending visual
review.** Client brief: redesign only the "Facing these challenges?"
section (`#pain-hook`) into a premium scroll-driven interactive
experience — an abstract security-patrol route moving through 4
checkpoints — without touching any other section, the 4 problems' copy,
the CTA copy, or the global design system. Same copy, same CTA, all new
markup/CSS/JS.

- **Files touched**: `pages/index.html` (section markup only),
  `css/page-home.css` (`.pain-hook__grid`/`.pain-item*` removed
  entirely, replaced with `.pain-hook__journey`/`.pain-hook__item`/
  `.pain-hook__route`/`.pain-hook__progress` etc. — see that file's own
  header comment on the block), new `js/pain-hook-journey.js`
  (homepage-only, own `<script defer>` tag, same pattern as
  outfits.js/hero-reveal.js/title-reveal.js), one-line change to
  `js/title-reveal.js` (skips `[data-no-title-reveal]`, now set on this
  section's own `<h2>` so its calm entrance doesn't fight the flashier
  word-cascade that script gives every other heading).
- **Interaction, desktop/tablet (≥1024px)**: `.pain-hook__journey` is
  GSAP ScrollTrigger-pinned for `window.innerHeight * 1.4` (~140vh,
  brief's "120-160vh") while a two-layer SVG path (`viewBox="0 0 100
  100"`, `preserveAspectRatio="none"` — every coordinate is directly a
  % of the wrapper) draws via `stroke-dashoffset`, scrubbed 1:1 with
  scroll. A single `WAYPOINTS` array in the JS is the sole source of
  truth for the route's shape — it flags which waypoints are
  checkpoints, and each checkpoint's scroll-progress *threshold* is
  computed as that waypoint's cumulative path-length fraction, which is
  what guarantees a node always activates exactly as the drawn line
  reaches it (not an approximation/manually-tuned pair of numbers). The
  same waypoints set each `<circle>` node's `cx`/`cy` at runtime, so the
  4 staggered problem blocks (positioned via matching % `top` values in
  CSS) always line up with their node. Previous nodes dim
  (`.is-passed`, reduced-opacity blue) rather than disappearing once a
  later one activates, per the brief. CTA gets a subtle lift+shadow
  (`.is-active`) near the end of the scrub, not a visibility gate — it's
  always in normal document flow below the pin, never hidden.
- **Mobile/tablet-narrow fallback (<1024px)**: no pin, no SVG path at
  all — `.pain-hook__route` is `display:none`, replaced by a plain
  `.pain-hook__progress` track + blue fill whose `height` is tied
  directly to a non-pinned scrub (`start: "top 80%", end: "bottom
  70%"`) through the section's natural height. Same 4 problem blocks,
  now stacked in normal flow, same reveal logic (opacity/y), just no
  node/path visuals.
- **Reduced motion**: `js/pain-hook-journey.js` checks
  `prefers-reduced-motion` before creating *any* ScrollTrigger — if set,
  it just adds `.is-static` to the section and returns; `page-home.css`
  shows the completed route/progress-fill/nodes declaratively. The 4
  problem blocks need no special-casing at all for this, because —
  **important architectural point, read before touching this section
  again** — they are NOT hidden by default CSS. `.pain-hook__item`/
  `.pain-hook__icon` are fully visible in the raw HTML/CSS, exactly like
  every other JS-enhanced reveal on this site (`.u-reveal`,
  `initScrollReveal()` in main.js). `js/pain-hook-journey.js` is the
  *only* thing that ever hides them, via `gsap.set()` (an inline style),
  and only inside the branch that's actually going to animate them back
  in. A no-JS visitor, a crawler that doesn't execute JS, or a script
  error anywhere before this file runs all see the section fully
  visible and readable. (An earlier draft of this section got this
  backwards — CSS defaulted the items to `opacity: 0` — which would have
  permanently hidden real content if the GSAP scripts ever failed to
  load; caught and fixed before shipping, flagged here so a future edit
  doesn't reintroduce it.)
- **Performance**: only `stroke-dashoffset` (paint, not layout),
  `opacity`, and `transform` (`translateY`, `scale`) are ever animated —
  nothing here can trigger a layout recalculation. One documented
  CSS/GSAP interaction to know about: `.pain-hook__item`'s desktop
  position is set via `top` (a %, matching its checkpoint), deliberately
  *not* via `transform: translateY(-50%)` centering, because
  `js/pain-hook-journey.js`'s reveal tween also animates that same
  element's `transform` (the 20px slide-in) — GSAP resolves whatever
  transform is currently on the element to a plain pixel matrix and
  replaces it wholesale on every tween, so a CSS-authored percentage
  transform used for centering would get silently erased the first time
  the reveal completes. Keeping `top` and `transform` each doing exactly
  one job avoids that.
- **No Lenis**: the brief assumed an existing Lenis integration to
  reuse (modeled on a different Filamento project, "Sacramentum
  Advisors," that does use it). This project has no Lenis anywhere —
  see "Non-negotiable tech constraints" above, Lenis was explicitly
  evaluated and rejected 2026-07-20 (scroll-hijacking risk). This
  section was built against native scroll + ScrollTrigger's own `scrub`
  instead; flagging here rather than silently adding Lenis to match the
  brief's assumption.
- **Not yet visually verified** — no browser tool in these sessions,
  same standing caveat as everything else in this phase. The waypoint
  geometry/checkpoint alignment in particular needs an actual `npm run
  dev` look before this is considered done.

**2026-07-17 homepage revision pass (via Chris) — summary, still pending
visual review like everything else in this phase.** A large batch of
client-driven tweaks landed on `pages/index.html` in one session; the
full reasoning for each lives in inline CSS/HTML comments at the point of
change (`css/page-home.css`, `css/site-chrome.css`, `css/components.css`,
`partials/header.html`), this is just an index so nothing gets missed on
review:
- **Nav** (`partials/header.html`): "About Us" removed; "Innovation" and
  "Jobs" added with deliberate `href="#"` placeholders (routes not
  confirmed yet — do not wire these up without checking first); "Coverage
  Areas" also later removed. Nav links are now centered in the header row
  independent of the logo/CTA button (`.site-nav__list`, absolutely
  positioned). The link matching the current page gets a filled pill via
  `aria-current="page"`, set at runtime by `initActiveNavLink()`
  (`js/main.js`) since the header partial has no per-page knowledge of
  its own. Header CTA button is chunkier (`.btn--lg`) with a trailing
  arrow ("Request Analysis →"); this and every other `.btn` also got
  slightly narrower side padding sitewide (`components.css`).
- **Hero**: phone number (`tel:+499519643520`) is back, styled as an
  outline pill (white 1px stroke, solid white icon) next to the CTA —
  see "Current state" under Shared header/footer architecture above for
  the full history of this reversal. `.hero` is `min-height: 100vh` now,
  so the background photo always fills the whole first screen.
- **Two new sections**: a "Security you can trust." trust-metrics band
  right after the hero (`#trust-metrics` — heading left/copy right/three
  metrics below: 25+ Years of Experience, 300+ Satisfied Customers,
  1,000,000+ Service Hours, in that left-to-right order) and a "Coverage
  Areas" section directly above FAQ (`.coverage` — reuses the footer's
  exact 10 city links + `/einsatzgebiete/`, for in-body SEO value).
  Neither existed before this pass.
- **Removed entirely**: the old "Certified Quality" trust section (DEKRA
  seals, 4 metrics, full-size review card, WCB/Deutscher Mittelstands-Bund
  mention) — see the "Trust elements" note under Corporate Identity below
  for why this is flagged as a real gap against the guidelines, not just
  a routine cleanup.
- **Value Pillars cards** (`.pillar-card`): bigger corner icon (4.25rem),
  the underline divider under each title removed (markup + CSS, not
  hidden), title font-size bumped and weight reduced to `600`, body text
  weight set to `350` (both literal numbers — no token sits at those
  steps, and both are only approximately reliable under the system
  Helvetica/Arial stack, see Typography below), body text no longer
  truncated to 3 lines. **Then moved entirely**, later the same day: the
  "Six Value Pillars" section ("Less Effort. More Security.") that used
  to hold these 6 cards was removed outright, and the cards now live
  inside `#trust-metrics` instead — see `.trust-metrics__cards` in
  `page-home.css`. Same markup/classes, just a fluid 3/2/1-column grid
  now instead of the old fixed-300px flex-wrap row (that sizing existed
  for a "heading left, cards right" layout `#trust-metrics` doesn't
  use). Homepage section numbering in `pages/index.html`'s own
  `<!-- === N. NAME === -->` comments was renumbered afterward to close
  the gap. **Card internal layout simplified again, same day, second
  correction**: back to a plain top-to-bottom flex flow (icon → title →
  description, matching DOM order — no more `position: absolute` icon
  or bottom-aligned text block). `min-height: 280px` + `padding: 2rem` +
  `border-radius: 16px` (`--radius-lg`, was a hardcoded 1.5rem) +
  `.pillar-card__text { flex: 1 }`, combined with the grid's default
  `align-items: stretch`, is what now keeps every card in a row equal
  height regardless of title/description length.
- **`#trust-metrics` also got, same day, then corrected**: a
  client-supplied photo (`assets/images/Monitores.png` →
  `trust-monitoring-room.webp/.jpg`, 1200×1200) — first added as a small
  contained `<picture>` below the cards, then corrected the same day to
  a full-bleed CSS `background-image` behind the whole card grid instead
  (`.trust-metrics__cards-bg`, `page-home.css`), using the same
  negative-margin/compensating-padding technique as `.hero` biting into
  the header. Also added: a count-up animation on the three stat numbers
  (`initStatCountUp()`, `js/main.js` — plain `IntersectionObserver` +
  `requestAnimationFrame`, no library; this project doesn't use
  GSAP/Framer Motion/React, see "Non-negotiable tech constraints" above
  — deliberately chosen over installing one when a reference
  implementation for this exact effect was supplied built with those).
- **Pain Hook** ("Facing these challenges?"): all four card
  titles/descriptions rewritten; icons unchanged. Its own CTA button
  matched to the same chunkier + arrow treatment as the hero/header
  buttons.
- Typography switched sitewide from self-hosted Open Sans to a system
  Helvetica/Arial stack — see Corporate Identity → Typography below,
  this is the single biggest change in the pass and affects every page,
  not just the homepage.

**Current homepage section order (`pages/index.html`), post-pass:** Hero
→ 1.5 Trust Metrics (heading/text, DEKRA badges, 3 stats, 6 pillar cards
on a full-bleed photo background, — see below) → 2 Pain Hook → 3 Services
Overview → 4 Uniforms/Outfit Viewer → 4.5 Social Media → 5 References →
6 Conversion → 6.5 Coverage Areas → 7 FAQ. There is no section 3 in the
old numbering anymore ("Six Value Pillars") — section comments were
renumbered to stay sequential rather than leaving a gap.

**4.5 Social Media** (`.social`, added 2026-07-17) — a "story reel" of 3
vertical placeholder cards (middle one wider/taller, "featured"), format
adapted from a client-supplied reference screenshot of a different
company's testimonial section. Client explicitly asked for these to stay
plain placeholder rectangles (`.social__placeholder`, solid
`--color-bg` + a CSS-drawn play glyph, no image asset) standing in for
real social videos not yet available — captions under each
(On-Site Patrol / Night Shift Briefing / Team Training) are deliberately
generic content-type labels, not invented names/dates, specifically to
avoid repeating the References-testimonials mistake flagged elsewhere in
this file. The CTA button below ("Follow Us on Social Media") is
`href="#"` — client said the real destination isn't decided yet
("después vemos a dónde va"); update both the label and href once a real
social profile is confirmed. Originally placed directly after References
(position wasn't specified by the client, chosen and asked back to
confirm, client deferred the call) — moved same day, client request, to
directly *before* References instead, renumbered "4.5" (was "5.5") to
match its new spot between Uniforms and References.

**Second revision pass, later the same day (2026-07-17) — hero
refinement + a coverage-area icon swap.** The brief was explicit: refine
the existing hero only, don't redesign it, don't touch the hero image/
layout/spacing/typography *system*, don't change any other section
(the Trust Metrics/Coverage Areas edits below are the two narrow,
explicitly-requested exceptions to that).
- **H1 shortened and de-emphasized**: "Certified security for businesses
  across Franconia and Bavaria" (was "Security services for Bamberg,
  Franconia and Bavaria"), and its own clamp shrunk from 2.5rem–4rem to
  2rem–3.25rem (`.hero__content h1`, `page-home.css`) — no longer reuses
  a size close to the sitewide "main h2" scale, deliberately smaller now
  so it doesn't compete with the photo.
- **DEKRA badges moved out of the hero entirely**, to `#trust-metrics`
  (`.trust-metrics__badges`) — "directly below the hero," per the brief.
- **Google rating is now the hero's only trust element** — repositioned
  from a top-of-column badge row (removed, see above) to below
  `.hero__lead` / above `.hero__actions` (`.hero__rating`, thin spacing
  wrapper only).
- **Phone CTA visually demoted**: dropped `.btn--lg` from its class list,
  smaller `font-size` (`--font-size-sm`), less padding, and both its
  border and text opacity lowered (white at 0.35/0.85 alpha instead of
  solid) — explicitly so it reads as clearly secondary next to the blue
  primary CTA, which is untouched.
- **Reassurance list collapsed to one line**: "Free consultation · No
  obligation · Reply within 1 business day" — was 3 separate `<li>`s,
  each with the client-supplied `tic-check.png`. Now a single `<p>` with
  one `icon-check` sprite icon (blue, `currentColor` — the PNG it
  replaced had a fixed baked-in color and couldn't be tinted) and
  middot-separated text, muted rather than white.
- **Left-side hero gradient strengthened**: `.hero__bg::after`'s
  `to right` gradient went from a flat two-stop (0.55 → 0) to a
  three-stop falloff (0.78 → 0.5 → 0) — darker at the far-left edge,
  same 48% fade-out point, right side of the photo (guard/vehicle) still
  completely unfiltered.
- **Nav label**: "Innovation" → "Our System" (`partials/header.html`) —
  text only, still an `href="#"` placeholder, no other nav item touched.
- **Coverage Areas pin icon replaced**: the shared sprite's `icon-pin`
  (client reported it as "feo"/ugly in this specific spot) swapped for a
  client-supplied `assets/icons/icon-location.svg` (fixed white fill,
  used as an `<img>` like the Pillars/service-page icons, not a sprite
  `<use>`). Scoped to `.coverage__pill` only — the footer's separate
  city-pill list still uses the shared `icon-pin` sprite symbol and
  wasn't part of this request.

## Non-negotiable tech constraints

- Static HTML + CSS + vanilla JavaScript only. VS Code, Claude Code, GitHub,
  Vercel.
- No React, Vue, Astro, Next.js, WordPress, purchased themes, or any large
  frontend framework.
- No unnecessary JavaScript dependencies. **Revised 2026-07-20 (client
  decision via Chris)**: the client wants a more "Apple-like" feel in
  key moments — cleaner, more premium micro-interactions — and confirmed
  trading a small amount of the performance budget for that. GSAP (core
  + ScrollTrigger, MIT/free since Webflow's 2025 acquisition) is now
  approved, but scoped: a handful of deliberate motion moments (hero,
  section transitions, maybe the outfit viewer), not a wholesale
  replacement for the existing `.u-reveal`/`initScrollReveal()` system —
  reach for CSS transitions first, GSAP only where CSS genuinely can't
  do the job (e.g. a coordinated ScrollTrigger sequence). AOS is still
  not approved (ScrollTrigger covers what it would have done). GSAP must
  be self-hosted (same pattern as fonts — no CDN), loaded via
  `<script defer>`, and every animation it drives must still respect
  `prefers-reduced-motion` (`motion.css`) and never gate content
  visibility for no-JS/crawler contexts, same as the current scroll-reveal
  system.
- **SUPERSEDED 2026-07-22 (client, Christoph) — Lenis and WebGL are now
  approved, selectively.** The two paragraphs' worth of "Lenis is
  explicitly NOT approved" / "Three.js/WebGL remain out of scope, no 3D
  is happening" that used to sit here (2026-07-20) reflected the earlier,
  narrower direction and are no longer the rule. The historical reasoning
  is preserved in git and in [docs/project-strategy.md](docs/project-strategy.md);
  the current stance:
  - **Lenis (smooth scroll) is allowed** where it supports the premium
    feel, provided it respects `prefers-reduced-motion`, does not block
    the main thread, and never makes content visibility, navigation, or
    conversion depend on it (a no-JS/crawler visitor must get normal
    native scrolling and full content). It initializes once — never
    multiple instances.
  - **WebGL is allowed only to create a specific, meaningful premium
    moment** — never site-wide, never as constant background animation,
    never with important text or links inside the canvas, and always
    lazy/conditionally loaded after critical content, with a static
    fallback and reduced complexity (or none) on mobile. "Use WebGL only
    where it earns its cost" — a decorative full-page 3D scene does not
    qualify. This does **not** reopen React/Vue/Next.js or heavy app
    frameworks — those stay out (see the rule above); it's scoped to
    self-hosted, lazy-loaded visual/motion libraries used at specific
    moments.
  - The full motion/WebGL rules (init once, prefer transform/opacity,
    no layout thrashing, static fallbacks, mobile reduction, lazy-load
    optional modules, don't load heavy experiences before critical
    content) are in [docs/project-strategy.md](docs/project-strategy.md)
    — follow them. This also supersedes the client guidelines doc §9
    line "No AOS, no GSAP for standard scroll animations unless we
    discuss it": it has now been discussed and approved.
- **Added 2026-07-21 (explicit client brief) — Leaflet.js is approved,
  scoped to the homepage Coverage Areas map only.** This is a real
  external JS library, not a CSS-adjacent animation helper like GSAP
  above — a genuinely new category of exception, called out separately
  on purpose. Requirements the brief was explicit about, all satisfied:
  no account, no API key, no token, no billing, no Mapbox, no Google
  Maps — OpenStreetMap's raster tile server and Nominatim (the latter
  used exactly once, offline, during this build, never at runtime — see
  the Coverage Areas entry in "Current phase" below for exactly how) are
  both free, keyless services. Self-hosted, same as GSAP/fonts:
  `assets/js/vendor/leaflet.js`
  + `css/vendor/leaflet.css`, no CDN. Do not reach for Leaflet (or any
  map library) anywhere else on the site without the same kind of
  explicit go-ahead — this approval is scoped to "an interactive map of
  FRANKONIA's coverage cities," not "maps/geo in general."
- The **only** build step is `build.js` (see "Shared header/footer
  architecture" below) — a zero-dependency Node script that assembles
  page templates against shared partials. It never bundles, transpiles, or
  adds anything to the JavaScript actually shipped to the browser; it only
  concatenates trusted local HTML strings and copies files verbatim. The
  final browser output must always remain complete, crawlable static HTML.
  This system is approved and intentionally minimal — do not expand it
  into a custom framework, add templating logic beyond the single-level
  `<!-- include: name -->` marker, or add any npm dependency
  (`package.json` has zero runtime or dev dependencies on purpose) unless
  there's a clearly justified project requirement, and that's discussed
  first rather than added proactively.

## Shared header/footer architecture

Duplicating `<header>`/`<footer>` by hand across 30–100 files was
identified as a real maintainability risk (a nav change, phone number
update, or footer city-list edit would otherwise mean editing every page).
The fix, chosen specifically to avoid a framework: a small local static
build (`build.js`, Node core modules only, no dependencies) that assembles
page templates against shared partials at build time — **not** at runtime.
There is no `fetch()` or client-side include anywhere; every file the
browser (or a crawler) receives is complete, final, static HTML.

```
pages/<slug>.html            source page templates, one file per URL
partials/header.html         shared <header> (+ skip-link)
partials/footer.html         shared <footer>
partials/head-common.html    shared stylesheet links, font preload, script tag
build.js                     compiles pages/ + partials/ -> dist/
dist/                        generated output — the only thing Vercel serves
```

**Source → output mapping** (in `pages/`, mirrors the final URL exactly):

- `pages/index.html` → `dist/index.html` (homepage)
- `pages/werkschutz.html` → `dist/werkschutz/index.html`
- `pages/ratgeber/kosten-sicherheitsdienst.html` →
  `dist/ratgeber/kosten-sicherheitsdienst/index.html`
- `pages/ratgeber/index.html` → `dist/ratgeber/index.html` (hub page)

**Include syntax** — an HTML comment marker, resolved once at build time,
one level deep (partials do not include other partials):

```html
<!-- include: header -->
```

**Required page template skeleton** (per-page meta/JSON-LD goes directly in
the page file, never in a partial — it must be unique per page):

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>…</title>
  <meta name="description" content="…">
  <link rel="canonical" href="…">
  <!-- Open Graph / Twitter / robots meta, JSON-LD — all page-specific -->
  <!-- include: head-common -->
</head>
<body>
  <!-- include: icon-sprite -->
  <!-- include: header -->
  <main id="main">
    …
  </main>
  <!-- include: footer -->
  <!-- include: whatsapp-button -->
</body>
</html>
```

`partials/header.html` includes the `.skip-link` targeting `#main`, so
every page's unique content must be wrapped in `<main id="main">`.
`icon-sprite` must come before anything that uses `<use href="#icon-*">`,
so keep it first in `<body>`. `whatsapp-button` is `position: fixed`, so
its position in the DOM doesn't affect layout — it's placed last so it
doesn't interrupt keyboard tab order through the page's real content.

**Workflow:**

```
npm run build   # node build.js — compiles pages/+partials/ into dist/
npm run dev     # build, then serve dist/ locally via npx serve (no install)
```

`dist/` is gitignored and fully regenerated on every build — never hand-edit
anything inside it (every compiled file also gets an auto-inserted
`GENERATED FILE — do not edit` comment as a safety net). Vercel is
configured (`vercel.json`: `buildCommand` / `outputDirectory: "dist"`) to
run the same build automatically on every deploy, so `dist/` never needs to
be committed.

**Why `dist/` and not generating straight into the repo root:** the first
draft of this architecture generated compiled pages back into the repo root
and relied on the source `pages/`/`partials/` files sitting harmlessly
alongside them. That's wrong — with no framework detected, Vercel's default
behavior is to serve every file in the deployed tree by its literal path.
Left that way, `CLAUDE.md`, `docs/frankonia-developer-guidelines.md`
(internal, client-provided strategy doc), and raw `pages/*.html` source
templates (with unresolved include comments) would all have been served
and crawlable at their real paths. Scoping Vercel's `outputDirectory` to
`dist/` — which contains **only** compiled pages + `css/`/`js/`/`assets/`/
`robots.txt` — makes that impossible by construction, not by remembering to
maintain an ignore list.

**Current state:** `partials/header.html` and `partials/footer.html` are
populated (nav, logo, footer columns/city list — see homepage summary for
what's real vs. placeholder content). Two more global partials exist:
`icon-sprite.html` (shared SVG `<symbol>` defs, see Icons above) and
`whatsapp-button.html` (floating contact button, fixed bottom-right, every
page — see below). **The phone number is back in the hero** (client
reference, 2026-07-17, via Chris) — reverses the 2026-07-12 decision that
had removed it from both the header and the hero in favor of WhatsApp as
the site's only persistent secondary-contact CTA. Current state: a plain
`icon-phone` + number link (`.hero__phone`, page-home.css), same real
number/href as the footer (`tel:+499519643520`), sitting next to the
`.hero__actions` primary CTA button — not a second `.btn`, just an inline
icon+text link. `icon-phone` is no longer unused in the sprite. Header
still has no phone CTA — this change was scoped to the hero only; check
before adding one to the header too if that's ever requested.

The desktop (non-hamburger) nav breakpoint is `1400px` (see
`site-chrome.css`'s own comment on that media query for the full
history — it moved 1024→1200→1320→1400 as nav-gap/button-weight changes
each ate more row width; this note here had drifted out of sync with the
code, fixed 2026-07-15 — always check the CSS comment, not this
paragraph, if they ever disagree again). Below that, logo + all 6 nav
items + the CTA button don't fit in one row (was wrapping onto two
lines). The header's CTA button also uses shortened text,
**"Sicherheitsanalyse anfordern"**, not the full "Kostenlose
Sicherheitsanalyse anfordern" — the full text is preserved everywhere
else the CTA appears (hero, pain-hook, conversion section). Don't
silently "fix" the header text back to the long version; the shortening
was deliberate, to fit the row.

**Services nav item has a submenu** (added 2026-07-15, client reference:
dachdeckermeister-hornus.de's mega-menu) — a plain, flat list of all 10
real service links (no invented sub-categories; the client guidelines
never defined groupings within the service list, and this deliberately
doesn't invent structure that isn't confirmed) plus a "View all
services" link to `/leistungen/` (doesn't exist yet). Pure CSS, no JS:
desktop reveals the panel via `:hover` **or** `:focus-within` on the
`<li>`, so keyboard users get it too without any script — this is why
`.site-nav__submenu` is hidden with `opacity`/`visibility` (not
`display`), since `display:none` content can't receive focus at all,
which would make Tab skip straight past the panel's links. Below the
1400px breakpoint there's no dropdown — the same 10 links render as a
permanently-expanded nested list under "Services", no extra tap-to-open
step on touch. See `.site-nav__item--has-submenu` in `site-chrome.css`.

**`.site-header` background is `transparent` again (client request
2026-07-17, via Chris)** — reverses the 2026-07-13 decision described
below, which itself had reversed an earlier transparent-header attempt.
Per this file's own note at the time ("if this ever comes back, treat it
as a fresh request, not a revert"), this was rebuilt from scratch, not
restored from history — the old `--hero-header-overlap` approach really
was gone from the codebase. Current implementation: `.hero`
(page-home.css) has `margin-top: calc(-1 * var(--hero-header-overlap))`
(a fresh `--hero-header-overlap: 6rem` custom property, deliberately a
generous constant rather than a measured header height — see the CSS
comment on `.hero`) pulling the section up so its full-bleed photo
reaches the literal top of the page and shows through the now-transparent
header, with matching extra `padding-top` so the actual hero content
(h1/lead/CTA) lands in the same visual spot as before. The hero's top
gradient (`.hero__bg::after`) was strengthened at the same time — it now
carries nav legibility, not just a soft photo/header seam — see that
rule's comment. **Not yet visually verified** (no browser tool in these
sessions) — check nav legibility over the actual hero photo via `npm run
dev` before calling this done, and re-check if the hero photo is ever
swapped for one with a busy top edge.

History for context (2026-07-13 episode, now itself superseded): a
transparent header merged with the hero's full-bleed background was tried
and then explicitly rejected same-day — client wanted the nav on its own
solid black bar instead. That reversal is what the paragraph above now
reverses again. Both flips are on the record specifically so a third
flip doesn't get treated as a bug.

**WhatsApp button** (`partials/whatsapp-button.html`, styled in
`site-chrome.css` under `.whatsapp-button`): a plain `<a>` to a `wa.me`
link, no JavaScript, no third-party widget/script. **The href is a
placeholder** (`https://wa.me/491234567890`, an obviously-fake number) —
update it in that one file once the client confirms a real WhatsApp
Business number; the comment in the partial has the exact format required.
The icon is a client-supplied PNG (`assets/icons/whatsapp-icon.png`,
downscaled from a 2028px/498KB source to 128px/~12KB — resize any
replacement similarly, it's displayed at ~56px) — it's WhatsApp's own
circular badge with the brand green baked in, so **this is a documented,
deliberate exception to "five brand colors only"**: recognizability for a
known third-party service (matching how PayPal/WhatsApp buttons elsewhere
keep their own brand color) outweighs strict CI adherence for this one
element. Don't extend green to any other UI element on this basis. If a
cookie-consent banner is added later, check it doesn't collide with this
button's bottom-right position.

## URL structure

- Flat, keyword-first, lowercase, dash-separated. No query strings on
  canonical URLs.
- Trailing slash on every URL, enforced via `vercel.json`
  (`trailingSlash: true`). Author pages as `pages/<slug>.html` (see build
  architecture above) — the build already outputs `<slug>/index.html`, so
  clean trailing-slash URLs happen automatically.
- German umlauts spelled out in URLs only: `wuerzburg`, `nuernberg`,
  `fuerth`. (Umlauts stay correct in visible copy and `<title>`/meta text —
  this rule is for the URL slug only.)
- No file extensions in canonical URLs.
- Reference the full planned URL map in guidelines §2.2 before naming any
  new page file, so paths match what's already been decided (e.g.
  `sicherheitsdienst-nuernberg.html`, `brandwache-nuernberg.html`,
  `ratgeber/kosten-sicherheitsdienst.html`).

## Per-page SEO — mandatory on every page, no exceptions

- Exactly one `<h1>` per page, containing the primary keyword + a benefit.
  Never skip heading levels (no h2 → h4). Headings are never chosen for
  their visual size — style them with CSS, pick the tag by document
  structure.
- Unique `<title>` (50–60 chars) and `<meta name="description">` (140–160
  chars) per page. Never copy meta tags between pages.
- Canonical link, Open Graph tags, Twitter card, `<meta name="robots"
  content="index,follow,max-image-preview:large">`, `<html lang="de">`. Full
  template in guidelines §2.3. This block is page-specific and goes
  directly in each `pages/*.html` file — it is deliberately not a partial.
  `lang="de"` is the final-state requirement — while a page is still in
  the English placeholder-content phase, `lang` and `og:locale` should
  match that (`en`/`en_US`), see "Content language" below.
- Inline `application/ld+json` structured data appropriate to the page type
  (Organization/LocalBusiness on homepage, Service on service pages,
  LocalBusiness with `areaServed` on city pages, FAQPage wherever there's an
  FAQ block, BreadcrumbList on every non-homepage). Exact shapes in
  guidelines §2.5.
- Images: `<picture>` with WebP + fallback, explicit `width`/`height`
  (no CLS), descriptive German `alt` text, `loading="lazy"` below the fold,
  `loading="eager" fetchpriority="high"` + `<link rel="preload">` for the
  hero image. Target < 100 KB per image.
- `/sitemap.xml` is manually maintained — update it whenever a page ships.
  Don't generate it speculatively for pages that don't exist yet.

## GEO / AI-search readability

LLM answer engines read top-down and extract early, concrete text — write
for that:

- Where a page answers a user question, phrase the heading as that question,
  verbatim (`Was kostet ein Sicherheitsdienst pro Stunde?`, not a keyword
  fragment like `Preise`).
- Answer in the first 1–2 sentences under the heading. Don't bury the answer
  in paragraph three.
- Prefer concrete numbers and named standards over adjectives: "DIN 77200
  und ISO 9001 zertifiziert", "22 bis 42 Euro pro Stunde", not "zertifiziert"
  / "günstig".
- Short paragraphs, 3–4 sentences max, on content/answer pages.
- Write "FRANKONIA" and the company address identically everywhere —
  consistent entity naming is a GEO signal.
- FAQ sections get `FAQPage` schema.
- This is also why the scroll-reveal motion system (below) is built so
  content is never dependent on JavaScript to become visible or
  extractable — AI crawlers generally don't execute JS.

## Performance

- CSS-first. Reach for a CSS transition/animation before JavaScript, always
  — GSAP (see "Non-negotiable tech constraints" above, approved
  2026-07-20 for a small set of "Apple-like" motion moments) doesn't
  change this default, it's the exception for the few spots CSS can't
  cover.
- JavaScript only where the interaction genuinely requires it (nav toggle,
  sticky header logic, scroll reveal, form validation/UX, the approved
  GSAP moments). No scroll hijacking (this is why Lenis specifically is
  not approved, see above), no WebGL, no heavy parallax, nothing that
  blocks the main thread.
- Fonts are self-hosted (see `css/base.css` `@font-face` and
  `assets/fonts/README.md`) — never load from the Google Fonts CDN.
  `font-display: swap` is already set. **Added 2026-07-15**:
  `assets/fonts/open-sans-variable.woff2`, a single variable-font file
  (real `wght` axis, 300–800, confirmed via `fontTools`) covering both
  weights the site uses via one `@font-face` with `font-weight: 300 800`
  — not the two static files originally planned, see the README for why.
  Before this, the two planned static files had never actually been
  added, so the entire site had been silently rendering in the browser's
  system-font fallback since the homepage was first built — worth
  knowing if a heading/weight ever looks subtly different from a past
  screenshot; that's the real Open Sans now, not a fallback font.
- No render-blocking script. `<script defer>` for everything except
  inlined critical logic.
- Consent/analytics/tag-manager scripts (not yet implemented) must load
  strictly after consent, per guidelines §5 — do not wire up GTM/GA4/Ads
  tracking without a consent gate in front of it.
- Targets on every shipped page (Lighthouse, mobile): Performance ≥ 90, SEO
  100, Accessibility ≥ 90, Best Practices ≥ 90.

## Corporate identity

Five brand colors only — do not introduce new hues (two narrow, documented
exceptions below for third-party brand recognition). All are defined as CSS
custom properties in `css/tokens.css`; use the semantic aliases in
components, not the raw brand variables:

| Token | Hex | Use |
|---|---|---|
| `--color-white` | `#FFFFFF` | text on dark surfaces, a few deliberate light "spotlight" cards |
| `--color-gray` | `#3B4956` | `--color-bg-elevated` — cards, footer, trust section |
| `--color-blue-light` | `#3D9AD3` | accent — large UI text, icons, borders, focus ring on black |
| `--color-blue-dark` | `#5287C9` | primary button fill, link color, gradient endpoint |
| `--color-logo-black` | `#010101` | `--color-bg` — the page background |

**Site-wide dark theme (client decision, 2026-07-12) — read this before
touching any color.** The page background is `--color-logo-black`, not
white. This was a deliberate pivot from the original light-theme
foundation (the client supplied a white FRANKONIA logo, which only works
on a dark surface, and asked for the whole site to go dark, not just the
header). Every contrast ratio in this file was recalculated against black;
don't reuse an "on white" number from memory.

Semantic aliases, current meaning:
- `--color-bg` = black (page default).
- `--color-bg-elevated` = `--color-gray` — anything that needs to lift off
  the page: cards (`.pain-card`, `.conversion__form-card`),
  the footer, the trust section (`.section--inverse`, repurposed from the
  old light-theme's "the one dark section" to "the one lighter-dark
  section"). Same token/color as the old light theme used for its single
  dark section — just a different role now that black, not white, is
  the default.
- `--color-bg-inverse` = white — used only where something needs to
  visually invert *against black specifically* (currently just the
  skip-link). Don't reach for this for "a card that should stand out";
  that's `--color-bg-elevated`.
- `--color-text` = white, `--color-text-muted` = white at 0.65 alpha
  (≈7.4:1 on black, ≈5:1 on `--color-bg-elevated` — passes both).

**Contrast caveat — the one thing most likely to bite a future edit:**
both brand blues clear 4.5:1 (text) / 3:1 (non-text) against **black**
(`--color-bg`) — blue-light ≈6.8:1, blue-dark ≈5.7:1, so links, icons, and
borders can use blue directly there. Neither blue clears even 3:1 against
**`--color-bg-elevated`/gray** (blue-light ≈3.0:1, blue-dark ≈2.5:1). Every
place in `components.css`/`page-home.css` where a blue decoration sits on
an elevated card has already been switched to white, with a comment
pointing back to this note (`.pain-card .icon`, `.stat__value`, the form's
`:focus-visible` outline/border). `--color-focus-ring` is white globally
for the same reason — it has to work on every surface without knowing
which one it'll land on. **Before adding a new blue text/icon/border
anywhere, check what it's sitting on.**

Links: the base `<a>` (`base.css`) uses `--color-link` = `--color-accent`
(blue) + underline — on black this passes contrast on its own merits, and
the underline stays anyway so links are never identified by color alone
(WCAG 1.4.1). This is a foundation default, not a universal rule — nav,
footer, and card links each have their own contextual treatment (see
`site-chrome.css`, `page-home.css`), all still bound by the caveat above.

**Two documented exceptions to "five brand colors only,"** both for
third-party recognizability, both scoped to one component — don't extend
either elsewhere:
- WhatsApp's green, baked into the client-supplied
  `assets/icons/whatsapp-icon.png` (the floating contact button).
- Google's multi-color logo (`assets/icons/google-icon.png`) and a gold
  star color (`#F5B400`) in `.review-card` (components.css) — a light
  "spotlight" card matching a client-supplied reference image, showing the
  Google rating. It's intentionally a light surface against the dark page
  (same idea as `.conversion__form-card` staying elevated rather than
  pure black) — its internal text colors are hardcoded "on white" values,
  not the page's dark-mode tokens, because it's white regardless of the
  page theme.

Typography: system font stack — "Helvetica Neue" (macOS/iOS) falling back
to Arial elsewhere (client request, 2026-07-17; see `--font-family-base`
in `css/tokens.css` for the full reasoning) — Regular (400) for body,
Extra Bold (800) for headings, same weight tokens as before, just no
longer backed by a self-hosted file. Real Helvetica can't legally be
self-hosted without a paid Monotype license, and no such files exist in
this project, so there's deliberately no `@font-face` anymore — this is
the standard web-safe workaround, not a placeholder pending a "real"
font. The previous self-hosted Open Sans setup (`assets/fonts/
open-sans-variable.woff2`) is unreferenced now but kept as a spare, not
deleted — see that file's README if this ever needs to revert. One
known side effect: `--font-weight-light` (300, used by "main h2") and
the hand-tuned `white-space: nowrap` heading clamps on
`.references__intro h2`/`.faq__intro h2` (page-home.css) were both
calibrated against Open Sans's specific metrics and haven't been
re-verified against Helvetica/Arial — see those rules' own comments.
The logo typeface (Futura PT Demi) is for the
logo mark only, never for web body/heading text. The actual logo in the
header is `assets/icons/logo-wide-right-icon.png` (client-supplied, white
artwork — this is *why* the header is dark; a light-header variant would
need a dark/color logo file instead, which doesn't exist yet).
`logo-wide-left-icon.png` also exists in `assets/icons/` (client sent both
options) but isn't used anywhere — left as a spare in case the choice
changes.

Visual identity elements to keep available for use once page design starts:
the blue horizontal bar (`.brand-bar`, `page-home.css` — used sparingly:
hero eyebrow, conversion section), and the elongated hexagon accent shape
(`.hex`, `page-home.css`). `.hex` is currently unused in markup again — the
Value Pillars section briefly used it for a central "system map" core node
(2026-07-13), then reverted the same day to a plain card-grid layout
(`.pillar-card`, no hex) per a client-supplied reference. Kept defined and
available for the next place it's actually needed rather than deleted.
Don't invent alternative accent motifs.

Trust elements that must appear wherever the design calls for a trust
section (homepage §5 at minimum): DIN 77200-1, DIN EN ISO 9001, DEKRA
certification marks; Google rating 4.7★ / 97 reviews; Wirtschaftsclub
Bamberg (WCB) and Deutscher Mittelstands-Bund member logos.

**As of 2026-07-17, the homepage does not actually meet the "at minimum"
bar above** — the dedicated "Certified Quality" trust section that used
to carry all of these was removed entirely (client request: "sacame la
seccion de Certified Quality"). What's left on the homepage: the hero
still has its own compact DEKRA badges + a small Google-rating chip
(`.review-card--sm`), and a separate "Security you can trust."
trust-metrics band (`#trust-metrics` in `pages/index.html`) has three
numbers. But the WCB/Deutscher Mittelstands-Bund membership mention and
the only full-size `.review-card` are gone from the page with nothing
re-added in their place — flagged inline in `pages/index.html` (see the
comment near `.hero__bg`), not fixed unilaterally here. Revisit this
against the guidelines' §5 requirement before production.

**The trust-metrics band's own figures are invented placeholders, not
client-confirmed** — same caveat this file has carried since the old
section existed, just relocated: "25+ Years of Experience" and "300+
Satisfied Customers" are the same unconfirmed numbers as before;
"1,000,000+ Service Hours" is new and equally unconfirmed. All three (in
`pages/index.html`, `#trust-metrics` → `.trust-metrics__list`) need real
figures from the client before production. The Google rating (4.7★ / 97
reviews, still shown in the hero) remains the one client-confirmed
number in this area — don't confuse it with the three invented metrics.

**RESOLVED 2026-07-20 — the References testimonials flag below is no
longer current.** Client supplied 3 real, named customer testimonials
(Robert Crispens/MORELO Motorhomes, Hermann Schleier/Bamberg Social
Foundation, Peter Keller/CleanTech Innovation Park — real companies,
specific quotes) to replace the 9 fabricated ones described below
entirely. `.references__testimonials` (`pages/index.html`) now holds
only these 3, real content, not placeholders — the "needs either real
customer sourcing or a rework to obvious placeholders" resolution the
note below calls for has happened, via the first option. Format also
changed from the horizontal drag-scroll strip to a 2-column CSS masonry
(client-supplied reference image), each card now showing 5 stars + a
Google icon top-right (`assets/icons/google-icon.png`, already in this
project for the hero's compact review card) instead of no rating at
all. **Avatars updated again, same day, once the client supplied real
photos**: `assets/images/testimonial-{robert-crispens,hermann-schleier,
peter-keller}.jpg` (center-cropped to square + downscaled to 240×240
from the client's originals — `ClientImg.jpg`/`HermannImg.jpeg`/
`PeterImg.jpg`, still in `assets/images/` uncropped, not deleted).
`.testimonial__avatar` is a real `<img>` now (`object-fit: cover`), not
the flat-color `<span>` described below — that reasoning ("no real
photos exist") no longer applies now that real ones were supplied.
**Worth flagging**: the Hermann Schleier and Peter Keller images are
both institutional building photos (the Bamberg Social Foundation site
and the CleanTech Innovation Park site respectively), not personal
headshots — only Robert Crispens' is an actual face. Used as-supplied,
not swapped for anything else; revisit if real headshots for the other
two ever become available. The history below is kept for context, not
because the issue is still open.

**Flagged 2026-07-15, escalated 2026-07-17 — the homepage References
section (`pages/index.html`, `.references__testimonials`) has the same
problem in a worse form, and it just got 3× bigger by explicit client
choice.** Originally 3 testimonials (M. Hoffmann/S. Krüger/T. Wagner,
specific quotes/job titles/industries) that read as real customer
testimonials but were never sourced from the client guidelines and
weren't documented anywhere as placeholder — unlike the trust metrics
above, this was never flagged at all until building `/werkschutz/`
surfaced the same risk category and this got checked against the same
standard. The result block on `/werkschutz/` was deliberately built with
obviously-bracketed placeholders (`.service-reference`, "[Placeholder —
...]") specifically to avoid repeating this.

2026-07-17: asked the client directly, before expanding this section,
whether to (a) switch to that same obviously-bracketed placeholder
pattern (would have also fixed the original 3), or (b) keep the
realistic style and add 6 more invented names/quotes/roles to reach 9
total, per a client-supplied reference design. **Client explicitly chose
(b)** — realistic style kept, now 9 fabricated testimonials
(M. Hoffmann/S. Krüger/T. Wagner/J. Bauer/L. Fischer/A. Neumann/
R. Weber/C. Becker/D. Schulz) instead of 3. This is a deliberate,
informed decision, not an oversight — but it's the single biggest
concentration of unconfirmed "looks real" content on the site, and
whoever finalizes copy before launch needs to treat all 9 as needing
either real customer sourcing or a rework to obvious placeholders, not
polish. Avatars are plain flat-color circles, not photos — a fake photo
of a specific named "customer" was considered and explicitly rejected
(client choice) as a materially worse version of this same problem;
this project has no real customer photos to use instead.

## Folder architecture

```
/
├── CLAUDE.md                  not deployed — source/reference only
├── package.json                zero dependencies; npm run build / dev
├── build.js                    compiles pages/+partials/ -> dist/
├── vercel.json                  buildCommand + outputDirectory: dist
├── robots.txt                   copied into dist/ as-is
├── sitemap.xml                   copied into dist/ as-is (added 2026-07-15,
│                                   alongside /werkschutz/ — robots.txt had
│                                   referenced this URL since the homepage
│                                   phase, but the file itself didn't exist
│                                   yet; manually maintained per guidelines
│                                   §2.6, update whenever a page ships)
├── docs/
│   └── frankonia-developer-guidelines.md   client source of truth, not deployed
├── pages/
│   ├── index.html                 homepage source
│   └── werkschutz.html             first service page, built 2026-07-15 as
│                                     the reusable service-page template —
│                                     see "Service-page template" below
│                                     before creating a second service page
├── partials/
│   ├── head-common.html          stylesheet links, font preload, script tag
│   ├── icon-sprite.html          shared <symbol> defs, see Icons below
│   ├── header.html                populated: logo, nav, mobile toggle (no phone — see below)
│   ├── footer.html                populated: services/cities/contact/legal columns
│   └── whatsapp-button.html       floating contact button, every page, see below
├── css/
│   ├── tokens.css               custom properties: color, type, spacing, motion
│   ├── reset.css                minimal modern reset
│   ├── base.css                 element defaults, @font-face, typography, focus
│   ├── layout.css               .container, .skip-link, .visually-hidden
│   ├── components.css           shared foundation, loaded on every page via
│   │                              head-common: .btn*/.form-field*/.badge/.stat/
│   │                              .review-card/.icon, plus (promoted 2026-07-15,
│   │                              see components.css's own header comment)
│   │                              .section rhythm, .brand-bar/.hex,
│   │                              .breadcrumbs, and the .faq__list/.faq-item
│   │                              accordion — all now used by 2+ pages
│   ├── site-chrome.css           header/nav/mobile-toggle/footer/whatsapp-button — shared
│   ├── motion.css               prefers-reduced-motion override, .u-reveal
│   ├── page-home.css             homepage-only sections, NOT in head-common —
│   │                              linked directly in pages/index.html's own
│   │                              <head>. Still owns the homepage-only "main h2"
│   │                              oversized-heading treatment and .faq__intro's
│   │                              forced one-line heading — deliberately not
│   │                              promoted, see page-service.css's header
│   │                              comment for why the service template doesn't
│   │                              reuse either
│   └── page-service.css          service-page template styles (currently only
│                                   pages/werkschutz.html uses it, but every
│                                   class is named generically — see
│                                   "Service-page template" below) — linked
│                                   directly in pages/werkschutz.html's own
│                                   <head>, same pattern as page-home.css
├── js/
│   ├── main.js                    global entry point (scroll reveal, nav toggle,
│   │                                 services preview — see below)
│   └── outfits.js                 homepage-only, Uniforms/outfit viewer section —
│                                     deliberately its own <script defer> tag (linked
│                                     directly in pages/index.html), not folded into
│                                     main.js — see "Accessibility & motion foundation"
│                                     below for the full pattern + image-sourcing notes.
├── assets/
│   ├── fonts/                     open-sans-variable.woff2 (added 2026-07-15,
│   │                                one variable-font file, wght 300–800 —
│   │                                see the README in this folder for why
│   │                                it's one file, not the two originally
│   │                                planned)
│   ├── images/                    hero-bg.webp/.jpg (hero full-bleed background) —
│   │                                currently sourced from HeroReal.png (client-supplied
│   │                                via Chris, 5th hero photo tried 2026-07-17 — then the
│   │                                file itself was replaced in place same day, still
│   │                                called HeroReal.png, so this is actually the 6th
│   │                                distinct photo; re-exported from the new content).
│   │                                Real FRANKONIA-branded photo. Current source is
│   │                                2242×1344, resized to 1600px wide (1600×959) — note
│   │                                this ratio differs from the first HeroReal.png export
│   │                                (2591×1344 → 1600×830), so object-position: center
│   │                                bottom (page-home.css .hero__bg img) crops differently
│   │                                again; re-check if the framing looks off.
│   │                                WebP/JPEG quality bumped to 95 (client request,
│   │                                2026-07-17: explicitly did not want the usual 85
│   │                                compromise this time, wanted it as high-quality as
│   │                                possible) — noticeably heavier than every previous
│   │                                hero-bg export: ~496KB WebP / ~575KB JPEG, well past
│   │                                the already-documented-exception territory of the
│   │                                85-quality passes before it (~250-300KB). This is a
│   │                                real LCP/CWV cost, not an oversight — this file is
│   │                                preloaded + eager + fetchpriority="high" (see the
│   │                                <link rel="preload"> in pages/index.html's <head>),
│   │                                so it's squarely on the critical path. Flag this if a
│   │                                Lighthouse/CWV check ever comes up short; the fix is
│   │                                dropping quality back down, not something structural.
│   │                                Source PNG had an (unused, fully-opaque) alpha
│   │                                channel — flattened to RGB before encoding so neither
│   │                                output carries pointless alpha data.
│   │                                HERO.png, SecurityServices.png, HeroImage.png and
│   │                                HeroImage1.png are the four PREVIOUS hero-bg sources
│   │                                (client-supplied, tried 2026-07-15) — all five raw
│   │                                PNGs (including HeroReal.png) are kept in this folder,
│   │                                not deleted, in case the client prefers a different
│   │                                one after comparing live. Only one is "active" (i.e.
│   │                                actually re-exported to hero-bg.webp/.jpg) at a
│   │                                time — check git history or just re-export from
│   │                                whichever *.png the client picks if this needs to
│   │                                change again.
│   │                                computer.webp/.jpg, walking.webp/.jpg and
│   │                                lab.webp/.jpg are all spare, no longer referenced
│   │                                anywhere (computer.* was the Trust section's
│   │                                full-bleed background photo, removed 2026-07-15
│   │                                when that section was rebuilt to a plain solid
│   │                                black .section, same centered layout as
│   │                                .pain-hook — see page-home.css's .trust comment;
│   │                                walking.*/lab.* have been spare since
│   │                                2026-07-14).
│   │
│   │                                werkschutz/objektschutz/baustellenbewachung/
│   │                                brandwache/revier-schliessdienst/empfangsdienst/
│   │                                veranstaltungsschutz/kaufhausdetektei/
│   │                                sicherheitstechnik/interventionsdienst
│   │                                (.webp/.jpg each) — real, unique per-service
│   │                                photography (client-supplied 2026-07-14), replacing
│   │                                the earlier placeholder approach of cycling
│   │                                hero-bg/computer/walking/lab across all 10 Services
│   │                                Overview preview thumbnails (services__item
│   │                                [data-preview-*] in pages/index.html — one dedicated
│   │                                photo per service now). Source photos were portrait
│   │                                (~1081×1617); resized to 820px wide, WebP quality 72
│   │                                / JPEG quality 72 by default. Two of the ten
│   │                                (baustellenbewachung, revier-schliessdienst) needed
│   │                                lower quality (WebP 62 / JPEG 65) to approach the
│   │                                <100KB target and still landed over it (~120–135KB
│   │                                WebP) — busier/more detailed source photos than the
│   │                                other eight; same "detail vs. target size" trade-off
│   │                                already documented for hero-bg/computer above, not a
│   │                                mistake. object-fit: cover in
│   │                                .services__preview-media (page-home.css) crops these
│   │                                portrait sources down to the section's 4:3 preview
│   │                                box — resize any replacement to the same ~820px
│   │                                width and expect the same crop behavior.
│   │
│   │                                Manu1–7.png / ManuSide1–8.png — client-supplied
│   │                                RAW uniform photography (person cutouts, real alpha
│   │                                transparency), source for outfits/ below. Left in
│   │                                place uncompressed as the working originals; the
│   │                                compressed web copies live in outfits/, not here.
│   │                                See "Accessibility & motion foundation" for the full
│   │                                investigation (front/angled pairing, the ManuSide3
│   │                                duplicate — ManuSide5 was also briefly, wrongly
│   │                                believed missing; see below, it exists and is now used).
│   │
│   │   outfits/                    polo/pullover/weste/softshell/winterjacke/hemd/anzug
│   │                                -front.webp/.png AND -angled.webp/.png, now for all
│   │                                seven (softshell-angled added 2026-07-17 — see below)
│   │                                — compressed web copies of the Manu*/ManuSide* files above, resized
│   │                                to a shared 800×1200 canvas. WebP quality raised to 95
│   │                                (2026-07-15, client report: "me mataste la calidad" at
│   │                                the original 82) + PNG fallback (not JPEG — these need
│   │                                real transparency; the PNGs were always lossless/
│   │                                full-quality, only the WebP re-encode lost detail).
│   │                                Re-exported straight from the existing PNGs, not
│   │                                re-resized from the raw Manu*/ManuSide* originals — no
│   │                                quality lost in that step since PNG is lossless. Now
│   │                                ~60–96KB per image (was ~35–60KB at quality 82) — still
│   │                                comfortably fine, just no longer the smallest possible
│   │                                file at the cost of visible compression artifacts. Used
│   │                                by the homepage Uniforms/outfit-viewer section.
│   └── icons/                     logo-wide-right-icon.png (used), logo-wide-left-icon.png
│                                   (spare, unused), google-icon.png, whatsapp-icon.png,
│                                   dekra-din-77200.png, dekra-iso-9001.png — all
│                                   client-supplied, downscaled on import (see git history/
│                                   summaries for original sizes — resize any replacement
│                                   similarly). The two DEKRA seals are official certification
│                                   images used as-is (real DEKRA graphics, DIN 77200 and
│                                   ISO 9001 respectively) — never crop, recolor, or distort
│                                   them; only proportional resizing is OK, same as was done
│                                   on import (1686×2535 → 399×600, then palette-quantized,
│                                   105KB→18KB each, no visible quality loss since they're
│                                   flat-color graphics, not photos). They replace the old
│                                   text badges in the trust section (`.trust__cert-seal` in
│                                   page-home.css) — the hero's compact DIN/ISO/DEKRA badges
│                                   were deliberately left as text chips, not replaced, since
│                                   full portrait seals didn't fit that compact inline row;
│                                   revisit if the client wants those swapped too.
│
│                                   icon-vest/camera/clock/eye/lock/check-shield/tie-person.svg
│                                   — 7 client-exported Figma icons (two-tone fixed fill,
│                                   #F7F7F7 + #010101, NOT currentColor — that's why these are
│                                   <img> tags, not sprite <symbol>s like the rest of the site's
│                                   icons). All 7 files are untouched originals (light backing +
│                                   black detail) — a 2026-07-15 attempt to invert lock/
│                                   check-shield's own fill colors for the Pillars white-card
│                                   redesign was reverted the same day: those two files are ALSO
│                                   used un-inverted by .pain-item__icon in the "Facing these
│                                   challenges?" section, so editing the shared SVGs broke that
│                                   section (icons went black-on-black, invisible) the moment
│                                   Pillars needed the opposite coloring. Fixed properly with
│                                   `filter: invert(1)` scoped to `.pillar-card__icon img` only
│                                   (page-home.css) — Pillars gets the inverted look, every
│                                   other usage of these files keeps the original. If a future
│                                   change needs a *third* different coloring of the same icon
│                                   somewhere else, use another scoped filter/CSS trick, not a
│                                   direct edit to the shared SVG — these files are shared
│                                   assets, not owned by any one section. 6 of the 7 are wired into the Value Pillars section
│                                   (page-home.css `.pillar-card__icon img`): lock→Reliability,
│                                   tie-person→Single Point of Contact,
│                                   eye→Transparency, clock→Fast Response Times,
│                                   check-shield→Certified Quality, vest→Flexible Scheduling.
│                                   That last pairing is a weak semantic fit (flagged inline in
│                                   pages/index.html too) — neither remaining icon (vest, camera)
│                                   matched "flexible scheduling" well, vest was the less-bad
│                                   option. icon-camera is imported but unused — a plausible fit
│                                   for a future
│                                   Sicherheitstechnik (CCTV) service page.
└── dist/                          gitignored, generated by `npm run build`
```

Every page template links the CSS/JS files via the single
`<!-- include: head-common -->` marker — never add `<link>`/`<script>` tags
by hand per page for the shared foundation files. `head-common.html`
already lists them in the cascade order that matters:

```
tokens → reset → base → layout → components → site-chrome → motion
```

`site-chrome.css` is in this shared list (not page-scoped) because
`partials/header.html`/`footer.html` are included on every page. A page's
own section content (hero, pillars, FAQ, etc.) is different — that CSS is
page-scoped: link it directly in that page's own `<head>`, after the
`head-common` include (see `pages/index.html` → `css/page-home.css` for
the pattern). Don't add page-specific section styles to `head-common.html`.

**Icons**: `partials/icon-sprite.html` holds a hidden sprite of SVG
`<symbol>` defs, included once via `<!-- include: icon-sprite -->` right
after `<body>` opens (before header, so it's in the DOM before any use).
Reference an icon anywhere with `<svg class="icon"><use
href="#icon-name"></use></svg>` — zero extra requests, themeable via
`currentColor` on the parent. Add new icons to the sprite; don't inline
one-off `<svg><path>` markup at the call site or bring in an icon font/library.

When a page needs a new section/component beyond what `components.css`
already provides, first check whether it's genuinely reusable across future
pages. If yes, add it to the shared foundation. If it's one-off, keep it in
a page-scoped stylesheet instead of growing the shared files unboundedly.

## Service-page template

`pages/werkschutz.html` (→ `/werkschutz/`) is the reusable template for
all 10 service pages, built 2026-07-15 per guidelines §8 Step 2. **Do not
build the other 9 until this one is explicitly reviewed and approved** —
see "Current phase".

**What's shared (lives in `components.css`, loaded on every page — a
second service page needs zero new CSS for these):**
`.section`/`.section--subtle`/`.section--inverse`/`.section__intro`,
`.brand-bar`/`.hex`, `.breadcrumbs*`, `.review-card*`
(incl. `.review-card__stars-fill--94`, the one real confirmed rating),
`.faq__list`/`.faq-item*`/`.faq__toggle-row`, `.btn*`, `.badge`, `.stat*`.

**What's service-page-specific (lives in `css/page-service.css`, one file
shared by all future service pages — a second service page still needs
zero new CSS, just reuses these classes with different copy):**
`.service-hero*`, `.service-intro*`, `.service-problems*`,
`.service-scope*`, `.service-pillars*`, `.service-process*`,
`.service-trust*`, `.service-areas*`, `.service-reference*`,
`.service-cta*`. Every class is named `.service-*`, never
`.werkschutz-*` — confirmed while building the first page that nothing
in this file needed service-specific naming.

**What's page-specific (only in `pages/werkschutz.html` itself, and
must change for every new service page):** all visible copy, the H1/meta/
canonical/OG tags, the hero image (`assets/images/<service>.webp/.jpg` —
already exists for all 10, see "Folder architecture"), breadcrumb current-
page text, the 6 problem/scope/pillar/process items' content (concepts
are reusable, wording is not), city-link text (`<service> in <city>`),
and the reference block (must stay placeholder until a real one exists
per service — don't invent one to fill the template faster).

**To build the second service page:** copy `pages/werkschutz.html` to
`pages/<slug>.html` (slug per guidelines §2.2's confirmed URL map —
`objektschutz`, `baustellenbewachung`, etc.), then update: `<title>`/
meta description/canonical/og:* (service name + keyword), the breadcrumb
current-page text, H1, every section's copy, and the hero `<img>` src/
srcset/alt to that service's own `assets/images/<slug>.webp/.jpg` (already
converted, see "Folder architecture"). Do not touch `css/page-service.css`
or `components.css` unless a genuine cross-service layout problem shows
up — if the *content* doesn't fit (e.g. a service needs 8 scope items
instead of 6), that's still just more `.service-scope__item` blocks in
the grid, not a CSS change.

**Deliberately not reused from the homepage:** the `main h2` oversized-
heading treatment and the homepage's `.pillar-card`/`.services__index`/
`.pain-hook` layouts — the client's build brief for this page explicitly
asked for restrained heading sizes and section compositions that don't
just repeat the homepage's card grids. See `page-service.css`'s header
comment for the reasoning; don't "fix" service-page H2s to match the
homepage's scale without a specific new request to do so.

**Known bug fixed while building this page, relevant to every future
page:** `partials/header.html`'s CTA used a bare `#sicherheitsanalyse`
fragment, which only resolves on the homepage itself (the one page with
that id). Fixed to `/#sicherheitsanalyse` (absolute path + fragment) so
the shared header's CTA works correctly from any page. If you ever see a
bare `#id` href in a shared partial, treat it the same way — it's a bug
waiting for the second page, not a style choice.

## Coding & naming conventions

- **CSS**: BEM-style class naming — `.block`, `.block__element`,
  `.block--modifier` (see `.btn`, `.btn--primary`, `.form-field__label` for
  the pattern already in use). Utility classes are prefixed `.u-`
  (`.u-reveal`). No inline `style=` attributes, no `!important`, except a
  genuine, documented one-off — there should be none in the foundation.
  Always consume tokens (`var(--color-accent)`), never hardcode a brand hex
  outside `tokens.css`.
- **Files**: lowercase, dash-separated (`open-sans-regular-400.woff2`,
  `pages/sicherheitsdienst-nuernberg.html`).
- **JavaScript**: small, named functions over anonymous inline scripts.
  `const`/`let`, no global leakage beyond the one entry file per concern.
  Feature-detect / guard rather than assume an element or API exists (see
  `initScrollReveal`'s `IntersectionObserver` check for the pattern).
- **HTML**: semantic elements first (`<nav>`, `<main>`, `<header>`,
  `<footer>`, `<section>`, `<article>`) — a div is the fallback, not the
  default. Structure must stay logically understandable with CSS off.

## Accessibility & motion foundation

- Every page starts with a `.skip-link` to `#main` as the first focusable
  element (delivered by `partials/header.html`, defined in `layout.css`).
- `:focus-visible` gets a visible ring (`--color-focus-ring`); plain
  `:focus` from mouse clicks does not — see `base.css`.
- All interactive elements must be reachable and operable by keyboard.
- `prefers-reduced-motion: reduce` is handled in exactly one place —
  `motion.css` (collapses all transition/animation durations, disables
  smooth scroll). Don't add a second reduced-motion block elsewhere; it was
  previously duplicated in `base.css` and has been consolidated.
- The base `<a>` is underlined by default so an unstyled link is never
  identifiable by color alone — see Corporate Identity → contrast finding
  above for how this applies (as a baseline, not a universal rule) once
  nav/inline/action/card/footer link styles are defined per context.
- **Scroll reveal** (`.u-reveal` in `motion.css`, `initScrollReveal()` in
  `js/main.js`) is the one motion primitive defined so far. Mark an element
  with `data-reveal` in HTML — never apply the `.u-reveal` class directly
  in markup. JS is the only thing that ever adds `.u-reveal`, and only
  right before it starts observing an element, which is what guarantees:
  - content is fully visible by default for no-JS users and for crawlers
    that don't execute JavaScript (most AI-search bots) — this is a GEO
    requirement, not just an accessibility one;
  - a script error anywhere before `initScrollReveal()` runs can't leave
    content stuck invisible, because the hiding class was never applied;
  - `prefers-reduced-motion` and missing `IntersectionObserver` support
    both skip the hiding step entirely, same outcome;
  - a 3-second per-element fallback force-reveals anything the observer
    never fires for, so a layout/observer edge case can't hide content
    indefinitely either.
  - the effect only ever animates `opacity`/`transform`, both
    compositor-only properties — it cannot cause layout shift (CLS).
  Extend this rather than introducing a second reveal mechanism.
- **Services preview** (`.services__index` in `pages/index.html`,
  `initServicePreview()` in `js/main.js`) is the homepage Services Overview
  section: a numbered list of all 10 services as real `<a>` links (each
  carrying `data-preview-*` attributes), plus one shared preview panel on
  desktop that swaps its image/name/text/link to match whichever link is
  hovered *or* focused. Same principle as scroll reveal — JS only ever
  enhances, never gates:
  - all 10 services are real, crawlable `<a href>` elements with their
    full name and one-sentence description in the base HTML, with no JS
    required to see or reach any of them — the preview panel is a bonus
    view of the same content, not the only place it exists;
  - `mouseenter` and `focus` both call the same `show()` function, so
    keyboard-only navigation updates the preview identically to a mouse;
  - `.is-active` is a JS-added class mirroring whichever item is currently
    previewed (kept in sync even after blur) — purely visual, layered on
    top of `:hover`/`:focus-visible`, which already make the interacted
    item's active state clear with zero JS;
  - the preview `<picture>`/`<img>` swap only ever changes `src`/`srcset`/
    text content of elements already in the DOM — no new elements are
    inserted, so there's no layout shift, and the crossfade transition is
    skipped outright under `prefers-reduced-motion`;
  - the preview panel is hidden entirely below 1024px (`display: none`) —
    mobile gets the plain numbered list only, no accordion/carousel;
  - images use `loading="lazy"` and there's only ever one `<img>` in the
    preview DOM (its `src` is swapped, not duplicated per service), so the
    section never loads more than one service photo at a time regardless
    of how many of the 10 links get hovered.
- **Outfit viewer** (`.outfits__viewer` in `pages/index.html`,
  `initOutfitViewer()` in `js/outfits.js` — added 2026-07-15,
  significantly refined 2026-07-17) is the homepage Uniforms section
  between Services and Pain Hook: prev/next arrows cycle through 7
  outfits, a Front/Angled toggle switches view without resetting the
  selected outfit, and (below the image, `.outfits__info`) the active
  outfit's name + a one-line use-case label update together — e.g.
  "Winter Jacket" / "For outdoor patrols and cold-weather assignments,"
  one `context` string per entry in the `OUTFITS` array, `js/outfits.js`.
  **Correction to this file, 2026-07-17: an earlier version of this
  paragraph claimed a "live label above the image" already existed with
  `aria-live="polite"` — that described a feature that had never actually
  been built (verified by reading the real markup/JS before today's
  work), not a stale-but-once-true note. The name+context block built
  today is the first real implementation of anything like it, positioned
  below the image per this pass's brief, with `aria-live="polite"` on
  its wrapper for real this time.**

  2026-07-17 client brief also changed: the section's heading/lede
  shortened, the 4-item context list removed outright (not replaced with
  more text), a new small text eyebrow added ("FRANKONIA UNIFORMS," own
  class, deliberately not a reuse of `.brand-bar` — see that element's
  own comment), the character image sized up ~17.6% (`.outfits__stage`/
  `.outfits__image-frame` max-width 34rem → 40rem) with a new soft
  `radial-gradient` grounding shadow under it (`.outfits__image-frame::after`,
  not an image asset), the arrows enlarged/thinned, the Front/Angled
  toggle moved from the left column to right next to the image and
  shrunk/lightened, the outfit name-picker restyled from filled blue
  pills to a vertical list of lightweight underline text tabs
  (`.outfits__names`/`.outfits__name-btn`), and the section's background
  changed from pure white to a hardcoded `#FAFAFA` (documented exception,
  same pattern as `.review-card`'s "on white" colors — not a token, this
  section already deliberately breaks from the sitewide dark theme). The
  name-picker still offers the same jump-to-outfit shortcut on hover,
  focus, *or* click — not click-only — with the active item now shown via
  color + a bottom-border indicator (`aria-pressed`) instead of a black
  pill fill. Not in `main.js` — it's its own `<script defer>` tag linked
  directly in `pages/index.html`, same reasoning as `page-home.css` being
  linked there instead of folded into `head-common.html` (page-specific,
  not sitewide). Same JS-only-ever-enhances principle as scroll
  reveal/services preview, unchanged by any of today's styling work:
  - the base `<picture>` in the HTML is real, correct, default content
    (Polo, front view) — if JS never runs, the arrows/view buttons stay
    inert but the section heading, copy, and this one image are fully
    understandable on their own, per the brief's no-JS requirement;
  - there's only ever one `<picture>`/`<img>` pair in the DOM — `src`/
    `srcset`/`alt` get swapped on navigation, so only the currently
    shown image is ever requested, never all 14 (7 outfits × front/angled,
    now that Softshell has an angled photo too — see the correction
    below; this used to say 13);
  - `aspect-ratio: 800/1200` on `.outfits__image-frame` matches the real
    source images exactly (all resized to that canvas), so swapping
    outfits never causes layout shift;
  - `render()` disables the Angled button generically whenever an
    outfit's `angled` entry is `null` — as of 2026-07-17 no outfit
    actually hits that case (see the correction below), but the guard
    stays in case a future outfit is added without a second photo;
  - `aria-pressed` on the view buttons and name-picker buttons, and
    `ArrowLeft`/`ArrowRight` keydown handling (delegated on
    `.outfits__viewer`, alongside the existing Tab+Enter button
    semantics) cover the accessibility/keyboard requirements.
    (`.outfits__info`/`aria-live="polite"` — an active-outfit name +
    context label shown below the character — existed only briefly,
    2026-07-17: added, then removed the same day per client correction,
    "Front/Angled only thing below the character." The identical copy
    now lives as static per-button hover-reveal text instead,
    `.outfits__name-detail`, see the Value Pillars/nav section above for
    that pass's full rundown.);
  - the crossfade is skipped outright under `prefers-reduced-motion`,
    same pattern as the services preview swap.

  **Image sourcing — read before adding/replacing any outfit photo.**
  The client's source files (`assets/images/Manu1–7.png` /
  `ManuSide1–8.png`) were inspected file-by-file before building this (do
  not assume filename patterns without checking — this project has been
  burned by that before, more than once — see the correction below).
  Findings:
  - all 7 `Manu*.png` are front-facing photos of 7 different uniforms —
    labeled Polo/Pullover/Vest/Softshell Jacket/Winter Jacket/Shirt/Suit
    by visual inspection of the garment, in that file-number order;
  - the `ManuSide*.png` files are **not** a different camera angle —
    they're a second front-facing pose of the *same* outfit, now
    confirmed for all 7 (see correction below). This is why the UI
    button says "Angled", not "Side" (client-confirmed 2026-07-15) —
    "Side" would have claimed an angle that doesn't exist in the
    photography;
  - `ManuSide3.png` is a byte-identical duplicate of `ManuSide2.png`
    (confirmed via MD5, not just matching file size) and isn't used
    anywhere — this is the one genuine "extra" file in the set, not
    evidence of a missing outfit.

  **Correction, 2026-07-17: the original file-by-file inspection above
  missed `ManuSide5.png`.** It had initially been read as evidence that
  Softshell's alternate pose simply didn't exist ("the side numbering
  skips from 4 to 6") — that was an inspection error, not a fact about
  the photography; the file was there the whole time. The client caught
  it directly ("its called manuside5 in the folde"). Before wiring it in,
  it was re-verified the same way as everything else in this
  investigation: MD5'd against every other `ManuSide*.png` (confirmed
  distinct — the only real duplicate in the set is still 2/3) and
  visually compared side-by-side against `Manu4.png` (same jacket, same
  red zip pulls, same person, different pose) before touching anything.
  Processed identically to every other angled photo — resized to the
  same shared 800×1200 canvas, WebP q95 + PNG fallback — and wired into
  `js/outfits.js`'s `OUTFITS` array. All 7 outfits now have a working
  Angled view; the "disabled Angled button" case this file used to
  describe for Softshell no longer applies to any outfit.

  - all Manu*/ManuSide* source files are genuine RGBA with real alpha
    (checked 0–255 range per channel, not just file mode) — these are
    person cutouts meant to sit on the section's own background, so the
    web copies preserve transparency: WebP (primary, alpha-capable) +
    PNG fallback (not JPEG, which has no alpha channel) in
    `assets/images/outfits/`, resized to a shared 800×1200 canvas.
  - copy for this section was translated to English rather than using
    the German heading/body text suggested when the section was
    requested — see "Content language" below; that policy overrides
    per-request suggested copy, not just initial builds.

## Content language

**Current rule (superseding an earlier approach — client correction,
2026-07-13): every page is 100% English during the placeholder-content
phase. No German mixed in anywhere, including headings, CTAs, and nav —
even where the client's guidelines doc already gives exact German text.**
The first pass at the homepage used real German for H1/H2s, the CTA
label, nav items, etc. (reasoning: it was "final, client-confirmed
text"), while everything else stayed English placeholder. The client found
that mix confusing to review, not helpful — so don't do it again. Translate
the *entire* page to German in one single, deliberate pass at the end,
once real content for that page is ready — not incrementally, not
per-string. Until that pass happens, a page must read as fully one
language or the other, never both.

**What stays untranslated even now — these aren't visible copy:**
- URL slugs / `href`s (`/werkschutz/`, `/sicherheitsdienst-bamberg/`,
  etc.) — the real, client-confirmed URL structure (guidelines §2.2),
  unrelated to which language the visible page text is in.
- Proper nouns: city/street names (Würzburg, Fürth, Neuerbstraße),
  person names in testimonials, the company's actual legal name
  (FRANKONIA Sicherheitsdienst GmbH & Co. KG), member-org names
  (Wirtschaftsclub Bamberg, Deutscher Mittelstands-Bund).
- Legal/technical codes: DIN 77200, ISO 9001, §34a GewO — these are the
  real standard identifiers in any language, not phrases to translate.

**`<html lang>` and `og:locale` track the page's actual current content
language, not a fixed value.** Right now that's `lang="en"` /
`og:locale="en_US"` — flip both to `de`/`de_DE` as part of the German
translation pass, not before. This isn't just a formality: `hyphens: auto`
in `base.css` uses the `lang` attribute to pick a hyphenation dictionary,
so a mismatched `lang` value produces visibly wrong hyphenation.

Never size a layout, button, or nav item to fit short English copy —
German compound nouns and longer phrasing must fit without breaking the
design once the translation pass happens. `overflow-wrap: break-word` is
set globally on headings and body text in `base.css` as an overflow
safety net; `hyphens: auto` is scoped to body copy only (`p`, `li`,
`blockquote`), deliberately excluding headings — auto-hyphenating a large
bold `h1`/`h2` mid-word looks like a typo, not a feature. Don't widen
`hyphens: auto` back onto headings for a component without a specific
reason, and don't remove `overflow-wrap: break-word` without checking
German copy length first.

## Consent & tracking (not yet built)

No cookie/tracking script may run before user consent — not even the
consent banner itself may set a cookie pre-acceptance. When this phase
starts (guidelines §5, §9): Consent Mode v2, GTM-orchestrated GA4 + Google
Ads conversion tracking, reCAPTCHA v3 at a low blocking threshold (~0.3) on
lead forms, UTM/gclid capture on form submission. Don't pre-build any part
of this before the client confirms the consent tool.
