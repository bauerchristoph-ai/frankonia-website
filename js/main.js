/*
  Global entry point. Load with <script src="/js/main.js" defer></script>
  (already wired via partials/head-common.html). Keep this file to
  generic, site-wide behavior only — page-specific interaction gets its
  own module and its own <script defer> tag, added only when a page
  genuinely needs it.
*/

initScrollReveal();
initNavToggle();
initServicePreview();
initFaqToggle();
initActiveNavLink();
initStatCountUp();
initDragScroll();
initHeaderScrollTheme();

/**
 * Collapses the primary nav behind the header's hamburger button on
 * small viewports. The nav is visible in raw HTML by default (no [hidden]
 * attribute in markup) — this function is the only thing that ever hides
 * it, same JS-applies-hiding principle as initScrollReveal, so a no-JS
 * mobile visitor still gets a full, usable (if longer) nav list rather
 * than a dead button. At the desktop breakpoint, site-chrome.css forces
 * the nav visible regardless of [hidden], so this only matters on mobile.
 */
function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");
  if (!toggle || !nav) return;

  nav.hidden = true;

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    nav.hidden = isOpen;
  });
}

/**
 * Fades/slides content into place as it enters the viewport. Mark
 * candidate elements with `data-reveal` in HTML — not the .u-reveal
 * class. This function is the only thing that ever adds .u-reveal, and
 * only right before it starts observing an element, so:
 *   - no-JS users, crawlers that don't execute JS, and pages where a
 *     script error stops main.js before this runs all see full content,
 *     never a permanently-hidden opacity:0 element;
 *   - prefers-reduced-motion and missing IntersectionObserver support
 *     both simply skip the hiding step entirely, same outcome.
 * A 3s per-element fallback also force-reveals anything the observer
 * never fires for, so a layout/observer edge case can't hide content
 * indefinitely either.
 */
function initScrollReveal() {
  const targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );

  targets.forEach((el) => {
    el.classList.add("u-reveal");
    observer.observe(el);
    setTimeout(() => el.classList.add("is-visible"), 3000);
  });
}

/**
 * Homepage Services Overview: swaps the shared preview panel's image/
 * name/text/link to match whichever service link in the numbered list is
 * being hovered or focused. Purely an enhancement — every service's name,
 * URL, and description already exists as real content in the <a> itself
 * (see pages/index.html), so if this never runs (no JS, script error,
 * data-preview-* attributes missing) all 10 services stay fully visible
 * and usable, just without the live preview updating. The preview panel
 * is also hidden outright on mobile via CSS, so this is a no-op there.
 */
function initServicePreview() {
  const items = document.querySelectorAll(".services__item[data-preview-name]");
  const preview = document.querySelector(".services__preview");
  if (!items.length || !preview) return;

  const source = preview.querySelector("[data-preview-source]");
  const img = preview.querySelector("[data-preview-img]");
  const nameEl = preview.querySelector("[data-preview-name-el]");
  const textEl = preview.querySelector("[data-preview-text-el]");
  const link = preview.querySelector("[data-preview-link]");
  if (!source || !img || !nameEl || !textEl || !link) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function show(item) {
    items.forEach((el) => el.classList.toggle("is-active", el === item));

    const webp = item.dataset.previewWebp;
    const jpg = item.dataset.previewJpg;
    if (img.src.endsWith(jpg) && source.srcset === webp) return;

    const swap = () => {
      source.srcset = webp;
      img.src = jpg;
      img.alt = "";
      nameEl.textContent = item.dataset.previewName;
      textEl.textContent = item.dataset.previewText;
      link.textContent = document.documentElement.lang === "de" ? "Mehr erfahren →" : "Learn more →";
      link.href = item.getAttribute("href");
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

  items.forEach((item) => {
    item.addEventListener("mouseenter", () => show(item));
    item.addEventListener("focus", () => show(item));
  });

  show(items[0]);
}

/**
 * Collapses the homepage FAQ down to its first 5 questions behind a
 * "Read more" button. All 10 questions are real <details> elements in
 * the base HTML — this only ever adds [hidden] to the extra 5, the same
 * JS-applies-hiding principle as initNavToggle(), so a no-JS visitor or
 * a crawler (FAQPage schema depends on every question being present)
 * still sees the full list. The button itself is always in the markup,
 * same as the nav's hamburger toggle — harmless if JS never runs, since
 * there'd be nothing left to reveal anyway.
 */
function initFaqToggle() {
  const extra = document.querySelectorAll(".faq-item[data-faq-extra]");
  const toggle = document.querySelector(".faq__toggle");
  if (!extra.length || !toggle) return;

  extra.forEach((item) => {
    item.hidden = true;
  });

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    extra.forEach((item) => {
      item.hidden = isOpen;
    });
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.textContent = isOpen ? "Read more" : "Show less";
  });
}

/**
 * Marks the nav link matching the current page with aria-current="page"
 * (styled as a filled pill, site-chrome.css — client reference,
 * 2026-07-17). Pure enhancement, not content-gating: the nav is fully
 * correct, crawlable, navigable HTML with no active state at all if this
 * never runs — aria-current is purely a visual/assistive-tech affordance
 * on top of that, same "JS only ever enhances" principle as the services
 * preview and scroll reveal.
 *
 * Has to be JS — this header partial is shared byte-for-byte across every
 * page (see CLAUDE.md's build architecture), so nothing in the static
 * HTML itself knows which page it's currently rendered on.
 *
 * Scoped to .site-nav__list only (not .site-nav__actions) so the header
 * CTA's /#sicherheitsanalyse link is never candidate-matched. Skips bare
 * href="#" links (Innovation/Jobs placeholders, header.html) on purpose —
 * an HTMLAnchorElement's .pathname for href="#" resolves to the current
 * document's own path, which would otherwise false-match on every page.
 * When a submenu link matches (a specific service page), the parent
 * "Services" top-level link is marked active too.
 */
function initActiveNavLink() {
  const list = document.querySelector(".site-nav__list");
  if (!list) return;

  const currentPath = window.location.pathname.replace(/\/?$/, "/");

  list.querySelectorAll("a[href]").forEach((link) => {
    if (link.getAttribute("href") === "#") return;

    const linkPath = link.pathname.replace(/\/?$/, "/");
    if (linkPath !== currentPath) return;

    link.setAttribute("aria-current", "page");

    const submenuParent = link.closest(".site-nav__item--has-submenu");
    if (submenuParent) {
      const topLink = submenuParent.querySelector(":scope > .site-nav__link");
      if (topLink) topLink.setAttribute("aria-current", "page");
    }
  });
}

/**
 * Counts every .stat__value up from 0 to its real figure once scrolled
 * into view (client request, 2026-07-17 — adapted from a reference built
 * with GSAP/Framer Motion on another project; this site doesn't use
 * animation libraries, so it's a plain IntersectionObserver +
 * requestAnimationFrame instead). Originally scoped to just the 3
 * "Security you can trust." numbers; widened 2026-07-20 to every
 * .stat__value sitewide (now also covers the "Real Results From Our
 * Customers" figures) since the component and the parsing logic were
 * already fully generic — no reason to keep re-scoping this per section.
 * Deliberately cheap regardless of how many elements match: one
 * IntersectionObserver firing once each (observer unobserves itself
 * immediately after triggering), a single text-content update per
 * animation frame — negligible CPU/layout cost, nothing here can
 * meaningfully affect page performance.
 *
 * Guarded like every other enhancement on this site: skips outright if
 * IntersectionObserver isn't supported or the visitor has
 * prefers-reduced-motion set, in which case the real figure from the
 * markup is just left exactly as it already is — this is a pure
 * enhancement, never the only way the number is available.
 */
function initStatCountUp() {
  // Skips [data-no-countup] — an opt-out for any metric whose reveal is
  // driven by its own scroll animation and shouldn't also count up here.
  // Scoped exclusion only; every other .stat__value still counts up.
  const values = document.querySelectorAll(".stat__value:not([data-no-countup])");
  if (!values.length || !("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCountUp(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  values.forEach((el) => observer.observe(el));
}

/**
 * Parses "25+" / "300+" / "1,000,000+" / "€25,000" / "30%" (an optional
 * non-digit prefix, digits with optional thousands commas, then an
 * optional non-digit suffix) and animates from 0 to the parsed number
 * over ~1.2s with an ease-out curve, formatting each frame back through
 * the same prefix/comma-grouping/suffix. Widened 2026-07-20 to accept a
 * prefix too (previously suffix-only, e.g. "300+") once the References
 * section's "€25,000" figure needed the same treatment. Leaves the
 * element untouched if the text doesn't match that shape, rather than
 * guessing.
 */
function animateCountUp(el) {
  const match = el.textContent.trim().match(/^(\D*)([\d,]+)(\D*)$/);
  if (!match) return;

  const prefix = match[1];
  const target = parseInt(match[2].replace(/,/g, ""), 10);
  const suffix = match[3];
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = prefix + Math.round(target * eased).toLocaleString("en-US") + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

/**
 * Adds mouse-drag-to-scroll to any [data-drag-scroll] element (currently
 * just .references__testimonials, client request 2026-07-17 — generic
 * enough to reuse elsewhere later, same reasoning as data-reveal being a
 * plain attribute hook rather than a homepage-specific class).
 *
 * Pure enhancement: every element this targets already has
 * overflow-x: auto (CSS) and tabindex="0" (HTML) in its own markup, so
 * touch swipe, trackpad scroll, and keyboard arrow-key scrolling all
 * work with zero JS. This only adds the one thing a plain scroll
 * container can't do on its own — click-and-drag with a mouse.
 */
function initDragScroll() {
  const els = document.querySelectorAll("[data-drag-scroll]");
  if (!els.length) return;

  els.forEach((el) => {
    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;

    el.addEventListener("mousedown", (event) => {
      isDown = true;
      el.classList.add("is-dragging");
      startX = event.pageX;
      startScrollLeft = el.scrollLeft;
    });

    window.addEventListener("mouseup", () => {
      isDown = false;
      el.classList.remove("is-dragging");
    });

    window.addEventListener("mousemove", (event) => {
      if (!isDown) return;
      // Dragging is a deliberate action once the mouse is down — prevents
      // native text/image selection while moving the pointer across the
      // strip, same as any other drag-to-scroll implementation.
      event.preventDefault();
      el.scrollLeft = startScrollLeft - (event.pageX - startX);
    });
  });
}

/**
 * Switches the fixed header between its default look (transparent
 * background, white text — set in CSS, needs no JS) and a frosted-glass/
 * dark-text look (.site-header--dark, site-chrome.css) depending on
 * what's actually behind it at the current scroll position. Ported
 * behavior from another project (client request, 2026-07-17,
 * "Sacramentum Advisors") — this site has no React/Next.js (see
 * "Non-negotiable tech constraints," CLAUDE.md), so this is the same
 * logic rebuilt in vanilla JS: nav typography/link structure are
 * untouched, only this state toggle is new.
 *
 * isDark = forceDark || scrollDark, matching the source spec exactly:
 * - forceDark: a page can opt out of scroll detection entirely and pin
 *   the header permanently dark via `<body data-nav-force-dark>` — for
 *   a page whose content behind the header is always light. No current
 *   page needs this (homepage's hero and every other page's content is
 *   dark where it meets the header), so nothing sets it yet; the hook
 *   exists for whenever a future page does.
 * - scrollDark: computed from [data-nav-theme="light"] elements (see
 *   that attribute's own comment in pages/index.html) — true whenever
 *   one of those sections' box currently overlaps the header's own
 *   vertical midpoint, using getBoundingClientRect(), exactly as
 *   specified.
 *
 * Deliberately a raw `scroll` listener + requestAnimationFrame
 * throttle, not this site's usual IntersectionObserver pattern
 * (initScrollReveal/initStatCountUp): those only ever need to know
 * once whether an element has entered the viewport, then unobserve
 * themselves. This needs the continuous, repeatedly-reevaluated answer
 * to "is a light section's box crossing this exact horizontal line
 * right now" as the user scrolls back and forth across section
 * boundaries in either direction — a different question, not a better-
 * or-worse version of the same one, so reaching for a different tool
 * here is deliberate, not an inconsistency with the rest of this file.
 *
 * Pure enhancement either way: .site-header has a real default
 * background/text-color from CSS alone, so a visitor never sees an
 * unstyled or broken header if this script fails to run — they just
 * always get the transparent/white-text look, never the dark one.
 */
function initHeaderScrollTheme() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  if (document.body.hasAttribute("data-nav-force-dark")) {
    header.classList.add("site-header--dark");
    return;
  }

  const lightSections = document.querySelectorAll('[data-nav-theme="light"]');
  if (!lightSections.length) return;

  let ticking = false;

  function isLightBehindHeader() {
    const probeY = header.getBoundingClientRect().height / 2;
    for (const section of lightSections) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= probeY && rect.bottom >= probeY) return true;
    }
    return false;
  }

  function applyTheme() {
    header.classList.toggle("site-header--dark", isLightBehindHeader());
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(applyTheme);
    },
    { passive: true }
  );

  applyTheme();
}
