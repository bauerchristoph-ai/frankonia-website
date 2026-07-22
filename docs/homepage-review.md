# Homepage Strategic Audit

**Date:** 2026-07-22 · **Scope:** `pages/index.html` + `css/page-home.css` +
homepage JS. **No code was changed for this review.** This is a strategic
audit against the goals in [project-strategy.md](project-strategy.md), not a
line-by-line QA pass or a full-site checklist.

**Standing caveat:** none of the homepage has been visually verified in a
browser (no browser/screenshot tool in these sessions). Several risks below
can only be confirmed with `npm run dev` + a real device/Lighthouse run.

**Current section order:** Hero → Trust Metrics → Pain Hook → Our System →
Services Overview → Uniforms/Outfit Viewer → Social Media → References →
Free Security Analysis (conversion) → Coverage Areas → FAQ.

---

## A. What is already working

- **Semantic, crawler-safe foundation.** One `<h1>`, clean `h2`-per-section
  / `h3`-subsection hierarchy with no skipped levels. All 10 services, all
  10 FAQ questions, and all city links exist as real HTML `<a>`/`<details>`
  — the interactive layers (services preview, FAQ collapse, outfit viewer,
  coverage map) are all genuine progressive enhancements over content
  that's fully present without JS. This is exactly the SEO/GEO discipline
  the strategy requires.
- **GEO-friendly FAQ.** Questions are phrased as real user questions
  ("How much does a security service cost per hour?") rather than keyword
  fragments — ready for AI-answer extraction once content is finalized and
  `FAQPage` schema is added.
- **Disciplined motion architecture.** The "JS only ever *adds* the hiding
  class, immediately before observing" contract (`initScrollReveal`,
  `data-reveal`, the pixel-seam, pain-hook journey, system panels) means a
  no-JS visitor or crawler sees full content, and a script error can't
  strand content at `opacity:0`. `prefers-reduced-motion` is handled in one
  place. This is a strong base for the premium-brand goal without risking
  the SEO goal.
- **Conversion elements present and low-friction.** The free-analysis form
  has correct field types, `autocomplete`, `required`, and a privacy
  checkbox; CTAs repeat at hero, pain hook, and the dedicated conversion
  section.
- **Reusable component/token system.** Centralized design tokens, BEM
  naming, shared `components.css`, and a build system that keeps
  header/footer DRY — good for scaling to 30–100 pages.
- **Responsive/perf-aware image handling.** `<picture>` WebP+fallback,
  lazy-loading below the fold, hero preloaded — the mechanics are right
  (the hero *weight* is a separate issue, see B).

---

## B. Main risks (highest-priority only)

1. **Homepage JS payload is heavy and front-loaded.** 11 scripts load on
   the homepage, including GSAP (72 KB) + ScrollTrigger (44 KB) + Leaflet
   (148 KB) ≈ **264 KB of vendor JS**, plus ~512 KB of coverage-boundary
   GeoJSON that **all 10 files load upfront** because the map defaults to
   the "All" view. Leaflet + the map data are a Layer-4 experience sitting
   below the fold, but they're requested eagerly. This is the single
   biggest performance/CWV risk on the page and directly conflicts with
   "don't load heavy experiences before critical content / lazy-load
   optional modules." **Note:** the approved libraries themselves (GSAP,
   ScrollTrigger, Lenis, Leaflet) are **kept** — the fix is *loading
   strategy* (defer/lazy-load, esp. the map), not removing libraries. Total
   vendor size is audited later, not treated as automatically unacceptable
   (see [project-strategy.md](project-strategy.md) → "Vendor JavaScript").
2. **Hero image weight.** `hero-bg.webp` ≈ 496 KB / `.jpg` ≈ 575 KB,
   preloaded + `fetchpriority="high"` — it's the LCP element and is ~5× the
   100 KB image target. Real LCP cost — but **the hero will be replaced in
   the redesign**, so the current file is intentionally left un-optimized;
   the final asset gets full treatment (see recommendations / strategy).
3. **Section count / scroll length vs. business goal.** Eleven sections,
   several of them experimental (pixel-seam transition, pinned pain-hook
   "patrol journey," sticky "Our System," outfit viewer, dark interactive
   map). Individually defensible; together they risk a long, effect-dense
   scroll that pushes the primary conversion form far down and dilutes the
   B2B-decision-maker narrative. Worth deciding which sections truly earn
   their place *for a lead-gen homepage* vs. which are showcase-driven.
4. **Trust content gap.** The dedicated "Certified Quality" section was
   removed; WCB / Deutscher Mittelstands-Bund memberships and the only
   full-size review card are gone, and the trust-metrics figures
   ("25+ Years", "300+ Customers", "1,000,000+ Hours") are invented
   placeholders. Trust is decision-order priority #3 and a core lead-gen
   lever — this is a real gap, not cosmetic. (Google 4.7★/97 is the one
   confirmed figure.)
5. **No structured data yet.** No JSON-LD on the page. Expected for the
   current phase (deferred), but it's the biggest single SEO/GEO item
   outstanding and should be tracked, not forgotten.
6. **Header theme logic is a known edge case on the split conversion
   section.** `initHeaderScrollTheme()` treats each section as one
   boolean, but the conversion section is half-black/half-white — the
   header may switch slightly early/late there. Minor, already flagged.
7. **Content is English placeholder + `lang="en"`.** Correct for now, but a
   launch blocker: the whole-page German pass + `lang`/`og:locale` flip must
   happen before production, and layouts must be re-checked against longer
   German compound nouns.

---

## C. Immediate homepage recommendations (high-priority, now)

- **Lazy-load the coverage map (Leaflet + GeoJSON) — approved *future*
  strategy, not during the visual phase.** The full approved approach
  (IntersectionObserver init, load Leaflet only when needed, load only the
  selected boundary first, no "All" dataset upfront, in-memory cache, static
  fallback) is recorded in [project-strategy.md](project-strategy.md) →
  "Coverage map". Do **not** implement it yet unless explicitly requested;
  it remains the biggest single CWV win available for later.
- **Hero image: do not optimize the current file.** It will be replaced in
  the upcoming redesign; optimize only the final approved asset (responsive
  `srcset`, WebP/AVIF, explicit dimensions, appropriate preload) —
  see [project-strategy.md](project-strategy.md) → "Hero asset".
- **Audit the section list against the lead-gen narrative.** Decide, per
  section, whether it advances a decision-maker toward the free-analysis
  form. Tighten or reorder so the conversion path stays clear and the form
  isn't buried; keep the experimental sections only where they add trust or
  clarity, not just polish.
- **Restore a real trust moment.** Re-introduce certifications (DIN 77200 /
  ISO 9001 / DEKRA), the Google rating, and ideally the membership logos in
  one coherent trust section, and get the client to confirm or replace the
  invented metrics before they ship.
- **Keep every new interaction inside the existing enhancement contract.**
  Any Lenis/GSAP/WebGL work added during refinement must respect
  `prefers-reduced-motion`, initialize once, prefer transform/opacity, and
  never gate content — verify the pixel-seam and pinned sections still leave
  content visible with JS disabled.
- **Verify responsive fallbacks** for the pinned/sticky/map sections on real
  mobile once a browser is available — these are the most likely places for
  a poor small-screen experience.

---

## D. Deferred until after the homepage design is finalized

Tracked, but intentionally **not** part of this design review:

- final per-page meta tags (title/description/OG images — `og-home.jpg` is a
  placeholder path)
- complete JSON-LD (SecurityService + FAQPage + others)
- cookie consent (Consent Mode v2)
- CRM integration + UTM/gclid capture wiring
- analytics / GTM / GA4 / Google Ads conversion tracking / reCAPTCHA
- sitemap completion
- 301 redirect plan from old WordPress URLs
- full Lighthouse audit across pages
- German translation pass + `lang="de"` / `og:locale="de_DE"` flip
