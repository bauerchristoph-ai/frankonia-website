FRANKONIA Sicherheitsdienst — Website Rebuild · Developer Guidelines
Christoph Bauer
2026-07-08
Table of Contents
FRANKONIA Sicherheitsdienst — Website Rebuild · Developer Guidelines	2
1 · Project Overview & Your Role	2
2 · SEO Fundamentals You Must Bake In From Day One	2
3 · GEO / AI-SEO (Optimization for LLM Search)	8
4 · Performance Requirements (Core Web Vitals)	9
5 · Cookies, Consent & Tracking	13
6 · CI (Corporate Identity — FRANKONIA)	14
7 · Homepage Structure (First Page to Build)	15
8 · Development Process — Step by Step	16
9 · What Not To Do	17
10 · Handoff Deliverables	18
11 · Questions to Confirm Before You Start	18
Appendix A — Reference Sites to Study	18
FRANKONIA Sicherheitsdienst — Website Rebuild · Developer Guidelines
Date: 2026-07-08 Client: FRANKONIA Sicherheitsdienst GmbH & Co. KG Project domain: frankonia-sicherheit.de (currently WordPress + Elementor — to be replaced) Tech stack (fixed): Static HTML/CSS/JS, built in VS Code with Claude Code, deployed on Vercel Deployment strategy: Local staging build → cut-over → 301 redirect all old WordPress URLs to new structure

1 · Project Overview & Your Role
You are building a static, hand-coded website for a German security services company. The site must rank on Google for regional keywords across Bavaria (specifically the 100 km radius around Bamberg), be crawlable for AI search engines (ChatGPT, Perplexity, Claude), and convert B2B decision-makers into qualified leads.
Content and CI (colors, imagery, copy) will be provided by us — you focus on structure, performance, technical SEO, and clean code.
The site will be built and reviewed in phases: 1. Design of the homepage → we provide content 2. Design of the service pages → we provide content 3. Design of the references/portfolio page → we provide content 4. Continuing page by page until the site is ~30 pages large 5. Then details: forms, CMS behind references, publishing process, cookies, etc.
Before you begin designing, please read this entire document and check the reference sections on SEO, GEO/AI-SEO, and performance below.

2 · SEO Fundamentals You Must Bake In From Day One
The site’s primary business goal is qualified B2B lead generation via Google Search (organic + paid Google Ads). Every page you build must contribute to this goal.
2.1 Static HTML Advantages
Because we chose static HTML (no React, no WordPress), you have full control over: - Every <title>, <meta description>, <h1>, and body copy per page - Inline application/ld+json schema per page - Zero JavaScript render-blocking (except for consent + form logic) - Fast Core Web Vitals out of the box
Use this advantage. Do not import large frameworks. Vanilla JS is fine.
2.2 URL Structure (flat, keyword-first)
Rules: - Lowercase, dash-separated, no query strings for canonical URLs - Trailing slash consistently used (/werkschutz/ — pick one style and stick to it) - German umlauts written out: wuerzburg, nuernberg, fuerth (not würzburg) - No file extensions in URLs (/werkschutz/, not /werkschutz.html) — configure Vercel rewrites or place index.html inside directories
Structure:
/                              → Homepage /leistungen/                   → Services overview (hub) /werkschutz/                   → Individual service page /objektschutz/ /baustellenbewachung/ /brandwache/ /revier-schliessdienst/ /empfangsdienst/ /veranstaltungsschutz/ /kaufhausdetektei/ /sicherheitstechnik/ /interventionsdienst/  /einsatzgebiete/               → Coverage areas overview + map /sicherheitsdienst-bamberg/    → City landing pages (flat, no hierarchy) /sicherheitsdienst-nuernberg/ /sicherheitsdienst-wuerzburg/ /sicherheitsdienst-erlangen/  /brandwache-nuernberg/         → Service × City combo pages (only for high-CPC combos) /brandwache-wuerzburg/ /baustellenbewachung-nuernberg/  /referenzen/                   → References/case studies /jobs/                         → Careers  /ratgeber/                     → Knowledge/blog hub /ratgeber/kosten-sicherheitsdienst/ /ratgeber/paragraph-34a-erklaert/  /ueber-uns/ /kontakt/ /angebot/                      → Free security analysis landing page (main conversion goal)  /impressum/ /datenschutz/
2.3 Per-Page Meta Tags (Mandatory Every Page)
Every page needs its own unique meta title, description, canonical, and social sharing tags. Never copy them across pages.
Template every page must have inside <head>:
<title>Werkschutz Nürnberg · Zertifiziert & 24/7 | FRANKONIA</title> <meta name="description" content="Werkschutz in Nürnberg von FRANKONIA: DIN 77200 zertifiziert, feste Ansprechpartner, 24/7-Präsenz. Kostenlose Sicherheitsanalyse anfordern."> <link rel="canonical" href="https://frankonia-sicherheit.de/sicherheitsdienst-nuernberg/">  <!-- Open Graph --> <meta property="og:type" content="website"> <meta property="og:title" content="Werkschutz Nürnberg — FRANKONIA Sicherheitsdienst"> <meta property="og:description" content="…"> <meta property="og:url" content="https://frankonia-sicherheit.de/sicherheitsdienst-nuernberg/"> <meta property="og:image" content="https://frankonia-sicherheit.de/assets/og-werkschutz-nuernberg.jpg"> <meta property="og:locale" content="de_DE"> <meta property="og:site_name" content="FRANKONIA Sicherheitsdienst">  <!-- Twitter --> <meta name="twitter:card" content="summary_large_image">  <!-- Robots --> <meta name="robots" content="index,follow,max-image-preview:large">  <!-- Language --> <html lang="de">
Character limits: - <title>: 50–60 characters (Google truncates ~60) - <meta description>: 140–160 characters - H1: one per page, ~30–70 characters, must contain the primary keyword
2.4 Heading Hierarchy Discipline
Exactly one <h1> per page, at the top of main content
H1 contains the primary keyword AND a benefit (Werkschutz Nürnberg — zertifiziert, zuverlässig, mit einem Ansprechpartner)
H2s are section titles. Use them semantically, not for styling.
H3s are subsections. Do not skip levels (no H2 → H4).
On city pages, H2s must contain the city name (Objektschutz in Nürnberg, Baustellenbewachung im Raum Nürnberg)
On service pages, H2s reflect the 6 value pillars (Reliability, Transparency, Single Point of Contact, etc.)
2.5 Structured Data (JSON-LD, inline in every relevant page)
Include as <script type="application/ld+json"> inside <head> or before </body>.
Homepage — Organization + LocalBusiness + AggregateRating + FAQPage:
{   "@context": "https://schema.org",   "@type": "SecurityService",   "name": "FRANKONIA Sicherheitsdienst GmbH & Co. KG",   "image": "https://frankonia-sicherheit.de/assets/logo.svg",   "url": "https://frankonia-sicherheit.de/",   "telephone": "+49 951 964352-0",   "email": "info@frankonia-sicherheit.de",   "address": {     "@type": "PostalAddress",     "streetAddress": "Neuerbstraße 19",     "postalCode": "96052",     "addressLocality": "Bamberg",     "addressCountry": "DE"   },   "geo": {     "@type": "GeoCoordinates",     "latitude": 49.8988,     "longitude": 10.9028   },   "areaServed": [     { "@type": "City", "name": "Bamberg" },     { "@type": "City", "name": "Nürnberg" },     { "@type": "City", "name": "Würzburg" },     { "@type": "AdministrativeArea", "name": "Franken" },     { "@type": "State", "name": "Bayern" }   ],   "aggregateRating": {     "@type": "AggregateRating",     "ratingValue": "4.7",     "reviewCount": "97"   } }
Service pages — Service + Provider:
{   "@context": "https://schema.org",   "@type": "Service",   "serviceType": "Werkschutz",   "provider": {     "@type": "LocalBusiness",     "name": "FRANKONIA Sicherheitsdienst",     "areaServed": "…"   },   "areaServed": "…",   "hasOfferCatalog": { … } }
City pages — LocalBusiness with areaServed = the city: Same as homepage, but areaServed = the target city name.
FAQ sections — FAQPage:
{   "@context": "https://schema.org",   "@type": "FAQPage",   "mainEntity": [     {       "@type": "Question",       "name": "Was kostet ein Sicherheitsdienst pro Stunde?",       "acceptedAnswer": {         "@type": "Answer",         "text": "Ein qualifizierter Sicherheitsdienst kostet in Bayern zwischen 22 und 42 Euro pro Stunde …"       }     }   ] }
Breadcrumbs — BreadcrumbList: On every non-homepage.
2.6 Sitemap & Robots
/sitemap.xml — manually maintained (with ~100 pages this is fine). Update whenever a page is added.
/robots.txt — allow all except staging:
User-agent: * Allow: / Disallow: /staging/ Disallow: /preview/ Sitemap: https://frankonia-sicherheit.de/sitemap.xml
Submit sitemap to Google Search Console on day one of production.
Register domain in Bing Webmaster Tools as well (for Perplexity indexing).
2.7 Internal Linking
Homepage → all 8-10 service pages + top-3 city pages + free security analysis page
Every service page ↔ related city pages (Werkschutz links to Werkschutz in Nürnberg, Werkschutz in Würzburg combo pages if they exist)
Every city page links to all relevant service pages
Every ratgeber article links to 1 related service page + 1 related city page (min.)
Footer contains a full city list (this is a strong local SEO signal, as seen on dachdeckermeister-hornus.de)
2.8 Image Requirements
Every image has a descriptive alt attribute in German (no keyword stuffing, but include the primary term naturally)
Use WebP format with JPG/PNG fallback via <picture> element
Explicit width and height attributes on <img> (prevents CLS)
Lazy-load below-the-fold images: loading="lazy"
Above-the-fold hero images: loading="eager", fetchpriority="high", use <link rel="preload"> in <head> if critical
Compress everything — target < 100 KB per image (use squoosh.app or similar)
Example:
<picture>   <source srcset="werkschutz-nuernberg.webp" type="image/webp">   <img     src="werkschutz-nuernberg.jpg"     alt="FRANKONIA Sicherheitsmitarbeiter beim Werkschutz eines Industriegeländes in Nürnberg"     width="1200"     height="800"     loading="lazy"> </picture>

3 · GEO / AI-SEO (Optimization for LLM Search)
Large language models (ChatGPT, Perplexity, Claude, Gemini) are becoming a major traffic source. They read differently than Google’s crawler and cite pages that give clean, direct answers.
GEO Rules for Every Content Page
Ask the user’s question directly in H2 or H3 — exactly as they would type it. Use „Was kostet ein Sicherheitsdienst pro Stunde?" — not „Preise" or „Kostenübersicht".
Answer in the first 2 sentences under the heading. LLMs read top-down and extract early text as the answer. Do not bury the answer in the third paragraph.
Use concrete numbers and names. Not „günstig" but „22 bis 42 Euro pro Stunde je nach Qualifikation". Not „zertifiziert" but „DIN 77200 und ISO 9001 zertifiziert".
Short paragraphs (3-4 sentences max). LLMs prefer clean extraction blocks.
Author + date visible on articles (E-E-A-T signals — Experience, Expertise, Authoritativeness, Trust).
FAQ sections on major pages with FAQPage schema — LLMs love structured Q&A.
Consistent entity naming. FRANKONIA always written the same way (all caps), address always identical. Consistency helps LLMs identify the entity.
GEO-Friendly FAQ Formulation
Bad (SEO-first, unnatural): > Sicherheitsdienst Nürnberg Preise Übersicht — Was Sie beachten sollten
Good (GEO-first, natural): > Was kostet ein Sicherheitsdienst in Nürnberg pro Stunde?
Then immediately: Ein qualifizierter Sicherheitsdienst in Nürnberg kostet zwischen 25 und 42 Euro pro Stunde, abhängig von Qualifikation, Einsatzzeit und Anforderungen. Für Standard-Objektschutz mit IHK-geprüftem Personal liegt der Preis bei rund 28-30 Euro pro Stunde.

4 · Performance Requirements (Core Web Vitals)
The site must hit these thresholds on both desktop and mobile:

How To Get There
No render-blocking JavaScript. All scripts either defer or async.
Critical CSS inlined in <head>; the rest loaded async.
Self-hosted fonts — do NOT load from Google Fonts CDN. Download the font files (Open Sans 400, Open Sans 800), place them in /assets/fonts/, use font-display: swap.
Optimize hero images as described above (WebP, preload, explicit dimensions).
No third-party heavy scripts in the initial render. Google Tag Manager + Consent + Analytics load after user consent.
Use Vercel’s edge caching — this is free with Vercel and drastically improves TTFB.

5 · Cookies, Consent & Tracking
Cookie Consent
Two options being evaluated: - Cloudflare Zaraz — server-side tag management, native GDPR consent, very fast - Cookiebot or Usercentrics — standard third-party consent managers
Recommendation from us: Cloudflare Zaraz if the project uses Cloudflare in any way. Otherwise a solid open-source or lightweight consent manager (Klaro, Orestbida) is preferred over heavy commercial tools.
Whatever you use, it must: - Load before any tracking script - Support Google Consent Mode v2 (required for accurate Google Ads conversion tracking) - Show a modal on first visit, remember choice, allow re-opening via footer link - Be fully in German with clear language (“Notwendig” / “Statistik” / “Marketing” categories minimum)
Google Analytics & Tag Manager
Google Tag Manager (GTM) as central tag orchestrator
Google Analytics 4 (GA4) via GTM
Google Ads Conversion Tracking via GTM (form submissions + call tracking)
Consent Mode v2 wired to consent manager (all pixels default to denied until consent given)
Form Submissions
Every conversion form (contact form, security analysis request) fires a GTM event on submit
Preferably use hidden form fields to capture UTM parameters (utm_source, utm_medium, utm_campaign, utm_content, utm_term, gclid, fbclid) from URL query strings — pass these into the CRM/email
reCAPTCHA
Please investigate Google reCAPTCHA v3 for spam protection on forms. It’s invisible, doesn’t require user interaction, and provides a score. Add to all forms with a low blocking threshold (e.g., 0.3) — better to accept a few spam messages than to block real leads.

6 · CI (Corporate Identity — FRANKONIA)
Colors: - Primary background: White #FFFFFF, Gray #3B4956 - Secondary/accent: Light blue #3D9AD3 (Pantone 638C) - Gradient endpoint: Dark blue #5287C9 - Logo black: #010101
Typography: - Headings: Open Sans Bold (weight 800) - Body text: Open Sans Regular (weight 400) - Logo font (not for web): Futura PT Demi
Shapes: - Blue horizontal bar as design element (see CI PDF) - Elongated hexagon as accent shape (see CI PDF)
Full CI PDF is in the project folder — reference for logo variants, spacing rules, and correct color usage in gradients.
Trust Elements to Always Show
Certification logos: DIN 77200-1 · DIN EN ISO 9001 · DEKRA
Google Reviews rating: 4.7 stars / 97 reviews (with star icons)
Member logos: Wirtschaftsclub Bamberg (WCB), Deutscher Mittelstands-Bund

7 · Homepage Structure (First Page to Build)
We provide the copy. You design the structure. Please follow this section order:
Section 1 — Hero - One H1 with the primary keyword (Sicherheitsdienst für Bamberg, Franken und Bayern — zertifiziert, zuverlässig, mit einem Ansprechpartner) - Sub-headline with 3 key USPs (short, punchy) - Trust row: certification logos + 4.7-star Google rating - Primary CTA: Kostenlose Sicherheitsanalyse anfordern → (main conversion goal) - Secondary CTA: clickable phone number +49 951 964352-0 - Hero visual: team photo or Werkschutz image
Section 2 — Pain Hook (validated problem statements) - H2: Kennen Sie diese Herausforderungen? - 4 pain boxes (short, direct, from validated data) - CTA to the security analysis page
Section 3 — 6 Value Pillars - H2: Weniger Aufwand, mehr Sicherheit — durch unser System - 6-box grid (icon + heading + short text each)
Section 4 — Services Overview - H2: Unsere Dienstleistungen - 8-10 service tiles (icon, title, one-sentence description, Mehr erfahren →)
Section 5 — Trust (Certifications & Numbers) - H2: Zertifizierte Qualität - Certificate visuals + numbers bar (X employees · 300+ satisfied customers · Y hours · 4.7★)
Section 6 — References (Customer Results) - H2: Echte Ergebnisse unserer Kunden - 3 result tiles with numbers (25.000 € jährliche Einsparungen etc.) - 3 customer testimonials with photo, name, position, quote
Section 7 — Free Foot-in-the-Door Offer (Primary Conversion) - H2: Kostenlose Sicherheitsanalyse — in 20 Minuten Klarheit - Bullet list of what’s included - Contact form (Name, Company, Email, Phone, Message) + privacy checkbox - Bonus text: Antwort in 1 Werktag. Kostenlos, unverbindlich.
Section 8 — FAQ (SEO + GEO signal) - H2: Häufige Fragen - 8-10 questions with expandable answers - FAQPage schema attached
Section 9 — Footer - 3 columns: Services / Coverage Areas (all cities listed!) / Contact + Legal - Full city list in the footer is a strong local SEO signal (this is the Hornuss pattern — visit dachdeckermeister-hornus.de to see it)

8 · Development Process — Step by Step
We will work in the following phases. After each step, you send us the preview, we review and give feedback before the next step.
Step 1 — Homepage Design
We provide: structured content (headlines, body copy, images, CTAs)
You build: static HTML/CSS/JS homepage matching the section structure above
Deliverable: live URL on Vercel preview deployment
Step 2 — Service Page Template
We choose one lead service (probably Werkschutz) and provide the full content
You design: a reusable template that works for all 8-10 services
Deliverable: /werkschutz/ live + template documentation so we can produce the other 9 pages faster
Step 3 — Service Pages (batch)
We provide content for the remaining 9 services
You produce: all 9 pages using the template from Step 2
Step 4 — City Landing Page Template
We provide content for one city (probably Nürnberg)
You design: a reusable template that scales for all 10-13 city pages
Deliverable: /sicherheitsdienst-nuernberg/ live + template documented
Step 5 — City Pages (batch)
We provide content for 3-13 more cities
You produce: all city pages using the template
Step 6 — References Page
We provide references content + case study structure
You build: page + a lightweight CMS (Sanity, Directus, or a Google-Sheet-driven JSON approach — we’ll decide) so we can add references without touching code
Step 7 — Jobs / Careers Page
Content + application form
Step 8 — Blog / Ratgeber Hub + First 6 Cornerstone Articles
Template for the blog list + individual article template
We provide the first 6 articles’ content
Step 9 — Details Phase
Cookie consent finalization
Form → CRM integration
Publication workflow (how do we, non-devs, publish new content)
reCAPTCHA
Google Search Console + Bing Webmaster verification
Sitemap final generation

9 · What Not To Do
No React / Vue / Astro / Next.js. Static HTML only. Keeps the site fast, easy to edit, and Vercel-friendly with zero build config.
No WordPress migration. We’re building fresh.
No purchased themes or templates. Custom design based on our CI.
No unnecessary JavaScript animations that hurt performance. Subtle CSS transitions are fine. No AOS, no GSAP for standard scroll animations unless we discuss it.
No inline styles or !important unless absolutely necessary. Clean CSS variables + BEM-ish class naming.
No third-party heavy widgets (chatbots, live-chat) in the initial build. If needed, add them after launch and lazy-load them.
No cookies before consent. Not even the “notice bar” itself may set tracking cookies until user has clicked “accept”.

10 · Handoff Deliverables
After each page/phase, please provide: 1. The Vercel preview URL 2. The source code (via GitHub repo — we’ll set this up together) 3. A short changelog note 4. A Lighthouse report (mobile) showing Performance / SEO / Accessibility / Best Practices scores
Target scores: Performance ≥ 90, SEO 100, Accessibility ≥ 90, Best Practices ≥ 90.

11 · Questions to Confirm Before You Start
Please respond to us with your take on the following before beginning Step 1:
Are you comfortable working with static HTML + Claude Code + Vercel, or do you have concerns about scaling to 30-100 pages this way?
Do you have a preference for the CMS behind the References page (Sanity / Directus / headless / Google Sheets / plain markdown)?
What cookie consent manager have you used before that you’re comfortable integrating?
Do you use GitHub? We’ll create a shared repo for source code review.
Estimated timeline for Step 1 (Homepage)?

Appendix A — Reference Sites to Study
Structural reference (do this well): https://www.dachdeckermeister-hornus.de/ - Note the flat URL structure /dachdecker-{city}/ for city pages - Note the full city list in the footer - Note the clean 4-step process section - Note the FAQ with schema
Current FRANKONIA site (understand what we’re replacing): https://frankonia-sicherheit.de/ - 8 existing service pages with forms + phone CTA — these are the content baseline - WordPress + Elementor — the performance and structure problems we’re fixing
Business context: Read /projekte/frankonia/CLAUDE.md and /projekte/frankonia/wissen/seo-strategie.md for the full strategic context.

Prepared by Christoph Bauer, FRANKONIA Marketing. For questions or clarification, contact us directly.