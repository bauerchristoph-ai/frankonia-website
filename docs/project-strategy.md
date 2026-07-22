# FRANKONIA Website — Project Strategy

**Status:** Active · **Recorded:** 2026-07-22 (client direction, Christoph
Bauer) · **Owner of CRM/SEO/GEO/tracking/marketing strategy:** Christoph

This document is the detailed strategic source of truth for the FRANKONIA
Sicherheitsdienst website. [CLAUDE.md](../CLAUDE.md) holds the concise,
day-to-day operating rules and points here. The client-provided
[frankonia-developer-guidelines.md](frankonia-developer-guidelines.md)
(dated 2026-07-08) remains valuable background, but where it conflicts with
this document, **this document reflects the current, discussed-and-approved
direction** (specifically: its §9 restriction on GSAP/animation is now
superseded — see "Motion & WebGL rules" below).

---

## The three goals — equally important

The website exists to serve three goals of equal weight. Earlier
documentation framed a single ranked priority list (Conversion > SEO > GEO
> …). That framing is replaced: these three are co-equal, and the
decision-order below is how we resolve tensions between them case by case.

### 1. Qualified B2B lead generation

Convert decision-makers into qualified leads. The **primary page action**
is the free security analysis / "Request analysis" form. The frontend must
provide the technical and UX foundation for:

- strong, visible CTAs
- clear service communication
- trust and credibility signals
- low-friction contact paths
- CRM integration (Christoph manages the CRM itself)
- UTM and campaign attribution (hidden fields, gclid/fbclid capture)
- future Google Ads campaigns
- measurable form conversions (GTM event on submit)

Christoph owns CRM, SEO strategy, GEO, tracking and online-marketing
execution. Our job is to make sure the frontend is technically and
UX-ready for all of it — not to build the tracking stack now (see
"Deferred" at the end).

### 2. Strong SEO & GEO visibility

Rank for regional security-service searches across Bamberg, Franconia and
Bavaria — e.g. *Sicherheitsdienst Bamberg*, *Sicherheitsdienst Nürnberg*,
*Werkschutz Bamberg*, *Brandwache Nürnberg*.

Supported through: static semantic HTML · crawlable visible content · one
clear H1 per page · correct heading hierarchy · strong internal linking ·
service pages · city landing pages · service×city pages where strategically
useful · unique titles & meta descriptions · canonical URLs · structured
data · FAQ content · sitemap & robots.txt · descriptive German alt text ·
consistent FRANKONIA entity naming · direct answers for AI search engines ·
clear location-coverage signals · city links in the footer.

**Hard rule — animation must never hide SEO content from the DOM.** All
important headings, descriptions, services, FAQs and internal links must
exist as real HTML. The visual experience may *enhance* content; it must
never *replace* it. AI crawlers generally don't execute JS, so anything
that matters for ranking or answer-extraction must be present and visible
without JavaScript.

### 3. Premium, memorable brand experience

The site should feel premium, polished and visually distinctive — closer in
ambition to high-end editorial or Apple-style product sites than to a
generic local-business template.

**Allowed** (this is now an approved direction, implemented responsibly):
GSAP · ScrollTrigger · Lenis · SVG path animation · pinned storytelling
sections · premium transitions · subtle 3D · WebGL where it creates real
value · interactive visual systems · custom microinteractions.

**Must not become:** a generic template · a standard corporate grid · a
SaaS website · a cyberpunk interface · visually overloaded · animation-heavy
without purpose.

**Target adjective set:** premium, restrained, editorial, modern,
trustworthy, technically controlled.

---

## Decision-making priority

When evaluating any recommendation, work through these in order:

1. Does it improve or preserve **conversion**?
2. Does it support **SEO and GEO**?
3. Does it improve **trust and comprehension**?
4. Does it strengthen the **premium brand experience**?
5. Can it be implemented **accessibly**?
6. Can it be implemented without **unacceptable performance cost**?
7. Is it **maintainable** across a future 30–100 page site?

Two guardrails:
- **Do not** recommend something only because it looks visually impressive.
- **Do not** reject something only because it uses JavaScript or animation.

Evaluate the actual trade-off.

---

## Layered implementation model

Build in layers. Each lower layer must be complete and correct on its own
before the next is added, and the site must degrade gracefully back down to
Layer 1 if anything above fails.

- **Layer 1 — Semantic content.** Headings, body copy, internal links,
  CTAs, forms, FAQs, schema, service info, city info. This layer alone must
  be fully understandable and usable (no-JS, crawler-safe).
- **Layer 2 — Visual styling.** Layout, typography, spacing, imagery,
  responsive behavior, hierarchy.
- **Layer 3 — Motion.** GSAP, ScrollTrigger, Lenis, SVG drawing, section
  transitions, microinteractions.
- **Layer 4 — Heavy / optional experiences.** WebGL, interactive maps, 3D
  assets, video, advanced visual effects. Lazy-loaded or conditionally
  loaded; never before critical content.

Progressive enhancement is mandatory: navigation and conversion must never
depend on animation or on any Layer 3/4 code.

---

## Motion & WebGL rules

GSAP, Lenis and WebGL are approved, subject to all of the following. (This
supersedes the client guidelines §9 line *"No AOS, no GSAP for standard
scroll animations unless we discuss it"* — it has been discussed and
approved — and CLAUDE.md's earlier "Lenis not approved / WebGL out of
scope" stance.)

- Do **not** initialize the same library more than once.
- Avoid unnecessary animations; every effect must justify its cost.
- Prefer `transform` and `opacity`; avoid layout thrashing.
- Respect `prefers-reduced-motion` and provide static fallbacks.
- Reduce complexity on mobile (or drop the heavy effect entirely).
- Do not load heavy experiences before the critical content.
- Lazy-load optional modules.
- Do not place important text or links inside a canvas.
- Do not make navigation or conversion depend on animation.
- Avoid constant background animation unless it adds clear value.
- Do not use WebGL across the entire site — only where it creates a
  specific, meaningful premium moment.

Self-hosting is still required for every such library (no CDN), matching the
existing GSAP/ScrollTrigger/Leaflet/font pattern.

**Not reopened:** React, Vue, Astro, Next.js, WordPress, purchased themes,
or any large app framework stay out. The approvals above are scoped to
self-hosted, lazy-loaded visual/motion libraries at specific moments — not
a change to the app architecture.

---

## Performance

Performance remains important — CRM, SEO and marketing do not replace
frontend performance. But "performance" does **not** mean "remove all
animation." The principle is: *use advanced interaction strategically and
optimize it carefully.*

Targets (Lighthouse, mobile, every shipped page):

- **Core Web Vitals:** strong (LCP, CLS, INP within good thresholds)
- **Performance:** ≥ 90 where realistically achievable
- **SEO:** 100
- **Accessibility:** ≥ 90
- **Best Practices:** ≥ 90

Every heavy effect must earn its performance cost. Where an effect is
expensive, it should be measured, optimized, lazy-loaded, and reduced or
removed on mobile.

---

## Technical implementation principles

- Static HTML + CSS + vanilla JavaScript, deployed on Vercel.
- No React / Vue / Next.js / large framework.
- Progressive enhancement — the page must remain understandable and usable
  if JavaScript fails.
- The only build step is the zero-dependency `build.js` (partials → `dist/`);
  browser output stays complete, crawlable static HTML.
- Self-host all libraries and fonts; `<script defer>` for everything except
  genuinely critical inline logic; no render-blocking scripts.

---

## Confirmed decisions (2026-07-22, client)

Locked decisions — do not reopen without a real technical/accessibility
reason or an explicit client request.

### Lenis (smooth scroll) — KEEP

Lenis smooth scrolling is an intentional part of the premium FRANKONIA
experience. **Keep it.** Do not recommend removing it merely because native
scrolling is lighter. It must stay carefully implemented:

- initialize once only — no duplicate `requestAnimationFrame` loops
- integrate correctly with GSAP + ScrollTrigger (single rAF driver)
- respect `prefers-reduced-motion`
- simplify or disable advanced smooth behavior on weak/constrained devices
  if necessary
- do not use smooth scrolling to justify excessive animation
- avoid scroll trapping; preserve normal keyboard and accessibility behavior
- monitor its real impact during the final Lighthouse/performance audit

The goal is not "zero motion" — it's a premium smooth-scroll experience with
responsible performance.

### Typography — LOCKED

Approved web typography is the current **Helvetica / Arial / system
sans-serif** stack (`--font-family-base` in `tokens.css`). Do **not** replace
it with Open Sans. Do not reopen this decision unless there is a real
technical or accessibility problem. This is an approved design-system
decision.

### Vendor JavaScript — approved, audit later (do not strip now)

Vendor JS (GSAP, ScrollTrigger, Lenis, Leaflet, any other external frontend
library) is approved. **Do not treat total vendor bundle size as
automatically unacceptable, and do not remove approved libraries during the
visual design phase.** Later — during the performance audit — evaluate:
which libraries load during initial render; whether any are duplicated;
whether they're minified; whether they can be deferred or lazy-loaded;
whether they're required on mobile; and whether optional modules can load
only near their relevant section.

### Coverage map — approved future performance strategy (not yet built)

The Coverage Areas map must **not** load Leaflet + all GeoJSON during the
initial page render. Approved strategy (implement only when explicitly
requested):

- keep the semantic city list visible in HTML
- detect when the map section approaches the viewport (IntersectionObserver)
  and initialize the map then
- load Leaflet only when needed, if the architecture supports clean dynamic
  loading
- load only the initially selected boundary first
- load every other boundary GeoJSON only when its city is selected
- cache loaded boundary data in memory
- **do not load the "All locations" dataset upfront**
- preserve the OpenStreetMap (and CARTO) attribution
- provide a static fallback if map loading fails

### Hero asset — do not optimize the current file

The current hero image will be replaced during the upcoming homepage
redesign. **Do not spend time optimizing the current ~496 KB asset.** Once
the final hero visual is approved, optimize the final one with: correct
intrinsic dimensions, responsive `srcset`, WebP and/or AVIF, explicit
`width`/`height`, appropriate `preload`/`fetchpriority`, a separate mobile
source if useful, and minimal visible quality loss.

### Trust content — confirmed values only, placement TBD

Certifications, memberships, verified metrics and reviews are reviewed
during the section-by-section process. **Do not invent trust claims or
metrics.** Use only confirmed values and approved logos. Candidate elements:
DIN 77200-1 · DIN EN ISO 9001 · DEKRA · Google review rating + count ·
approved membership logos · confirmed employee/customer/service-hour/
experience figures. Final placement is not yet decided.

### JSON-LD — deferred, verified values only

Structured data is required, but final JSON-LD is deferred until the
homepage structure and approved content are stable. **Do not add JSON-LD
yet unless explicitly requested, and never invent structured-data values.**
Plan to eventually include only valid, verified data: Organization /
LocalBusiness / SecurityService; FAQPage; AggregateRating *only if* review
data is verified and eligible; areaServed; contact details; address; social/
brand identity data.

### Section-by-section review criteria

The homepage is reviewed one section at a time. For each section, decide:
(1) does it deserve to exist; (2) does it communicate something new;
(3) is it in the correct order; (4) does it duplicate another section;
(5) does the user understand the narrative; (6) does the CTA appear at the
right moment; (7) does it support conversion, SEO/GEO, trust and the premium
brand; (8) is its animation cost justified; (9) does it have a strong mobile
fallback. **Do not make broad redesign changes before each section is
reviewed, and wait for approval before changing code.**

---

## Current phase

The project is currently focused **only on the homepage**.

- Review the current homepage.
- Improve each section one by one.
- Refine the visual system.
- Improve narrative and conversion flow.
- Identify obvious SEO, accessibility and performance risks.
- Preserve scalability for future pages.

**Do not** propose a full redesign of future pages, generate all service /
city pages, or build out the full site architecture now. The section-by-
section homepage refinement is the immediate objective.

See [homepage-review.md](homepage-review.md) for the current audit.

---

## Deferred until after the homepage design is finalized

These matter, but must not distract from the current design review:

- final meta tags (per-page titles/descriptions/OG)
- complete structured data (JSON-LD: SecurityService, FAQPage, etc.)
- cookie consent (Consent Mode v2, GDPR)
- CRM integration
- analytics / GTM / GA4 / Ads conversion tracking / reCAPTCHA
- sitemap completion
- redirect plan (301s from old WordPress URLs)
- full Lighthouse audit
- German translation pass (`lang="de"`, whole-site, one pass — see CLAUDE.md
  "Content language")
