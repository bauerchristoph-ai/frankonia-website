/*
  Global entry point. Load with <script src="/js/main.js" defer></script>
  (already wired via partials/head-common.html). Keep this file to
  generic, site-wide behavior only — page-specific interaction gets its
  own module and its own <script defer> tag, added only when a page
  genuinely needs it.
*/

initScrollReveal();
initNavToggle();
initMobileSubmenu();
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

  /* The hidden label used to say "Menü öffnen" in both states, so a screen
     reader announced "open menu" on the control that closes it. Read once from
     the markup so the wording stays in the partial with the rest of the copy. */
  const toggleLabel = toggle.querySelector(".visually-hidden");
  const labelOpen = toggleLabel ? toggleLabel.textContent : "";
  const closeBtn = nav.querySelector("[data-nav-close]");
  const labelClose = closeBtn
    ? closeBtn.querySelector(".visually-hidden").textContent
    : labelOpen;

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", String(open));
    nav.hidden = !open;
    if (toggleLabel) toggleLabel.textContent = open ? labelClose : labelOpen;
    setNavScrollLock(open);
  }

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    setOpen(open);
    /* Opening moves focus INTO the panel, onto its own close control — a
       keyboard or screen-reader user would otherwise still be standing on the
       hamburger with a full-screen panel they have not entered. Closing hands
       focus back to the hamburger, which is where it came from. */
    if (open && closeBtn) closeBtn.focus();
  });

  /* The panel's own X (client 2026-08-14). Same path as the toggle, so there is
     one open/closed routine and the two controls cannot disagree. */
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      setOpen(false);
      toggle.focus();
    });
  }

  /* Escape closes it — the standard exit from anything that covers the page, and
     the last resort if a control is ever hard to see again. */
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (toggle.getAttribute("aria-expanded") !== "true") return;
    setOpen(false);
    toggle.focus();
  });

  // Leaving mobile with the panel still open would strand the lock: the CSS
  // rule that hides overflow lives in the same max-width query as the panel, so
  // it stops applying — but lenis.stop() does not, and nothing would ever call
  // start() again, leaving a page that cannot scroll and no visible menu to
  // close. Same breakpoint as the panel and as initMobileSubmenu().
  const mobile = window.matchMedia("(max-width: 1399.98px)");
  const onChange = (e) => {
    if (e.matches) return;
    // Through setOpen, so the toggle's label is reset with everything else —
    // crossing to desktop with the panel open used to leave it reading "close".
    setOpen(false);
  };
  if (mobile.addEventListener) mobile.addEventListener("change", onChange);
  else if (mobile.addListener) mobile.addListener(onChange);
}

/* The mobile menu became a full-screen panel (site-chrome.css, 2026-08-10), so
   the page behind it must not scroll while it is open — otherwise flicking the
   panel scrolls the page underneath and the visitor closes the menu onto a
   different part of the page than they left.
   Two mechanisms because this site has two scrollers: Lenis owns the scroll
   position when it is running, and `overflow: hidden` is the fallback for the
   cases where it is not (prefers-reduced-motion, no JS-driven smooth scroll, a
   script error before smooth-scroll.js ran). Both are no-ops when unneeded, and
   the panel itself is `overflow-y: auto` so its OWN content still scrolls. */
function setNavScrollLock(locked) {
  document.documentElement.classList.toggle("nav-open", locked);
  const lenis = window.__lenis;
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
}

/**
 * Turns the mobile nav's "Leistungen" submenu into a real disclosure.
 *
 * Below the desktop breakpoint the submenu renders as a permanently-expanded
 * nested list. That was a deliberate call (no extra tap-to-open step on touch),
 * but on a phone it costs more than it saves: the ten service links push
 * Referenzen / Unser System / Jobs / Kontakt — and the header's
 * Sicherheitsanalyse CTA, the site's primary conversion action — off the bottom
 * of the open menu, so the top-level nav no longer fits on one screen.
 *
 * Same JS-only-ever-enhances contract as initNavToggle above: the markup ships
 * expanded, and this function is the ONLY thing that ever collapses it. No JS,
 * a script error, or a viewport at/above the desktop breakpoint all leave every
 * service link visible and reachable. The caret in the markup is decorative
 * (aria-hidden) and lives inside the parent <a>, which must stay a real link to
 * /leistungen/ — so the disclosure gets its own sibling <button> rather than
 * hijacking that link's click.
 */
function initMobileSubmenu() {
  // ⚠️ querySelectorALL, and that is a fix, not a style choice. This used to be
  // a singular querySelector, written when "Leistungen" was the only nav item
  // with a submenu. The moment a second one existed (Einsatzgebiete, the ten
  // city pages, 2026-08-10) that would have left the new submenu with NO
  // toggle — i.e. permanently expanded on mobile, pushing the rest of the nav
  // and the header CTA off the bottom of the open drawer, which is the exact
  // bug this whole function was written to fix.
  const items = document.querySelectorAll(".site-nav__item--has-submenu");
  if (!items.length) return;

  // Matches site-chrome.css's own desktop-nav breakpoint — above it the submenu
  // is a hover/focus panel and this button has no business existing.
  const mobile = window.matchMedia("(max-width: 1399.98px)");

  items.forEach((item, i) => {
    const submenu = item.querySelector(".site-nav__submenu");
    const link = item.querySelector(".site-nav__link");
    if (!submenu || !link) return;

    // ⚠️ The fallback id is INDEXED. It used to be a bare "site-nav-submenu",
    // which with two submenus would have given both panels the same id — so
    // both toggles' aria-controls would point at whichever one the browser
    // resolved first, and the second button would announce that it controls a
    // region it does not.
    const id = submenu.id || "site-nav-submenu-" + (i + 1);
    submenu.id = id;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "site-nav__submenu-toggle";
    btn.setAttribute("aria-controls", id);
    btn.setAttribute("aria-expanded", "false");
    // The label names what it discloses; the visible caret is decorative. Taken
    // from the parent link's own text, so it stays correct per item and per
    // language without this function knowing any labels.
    btn.setAttribute("aria-label", link.textContent.trim() + " – Untermenü");

    function setOpen(open) {
      btn.setAttribute("aria-expanded", String(open));
      item.classList.toggle("is-submenu-open", open);
    }

    btn.addEventListener("click", () => {
      const opening = btn.getAttribute("aria-expanded") !== "true";
      // Accordion: opening one closes the others. With two submenus of ten
      // links each, letting both stand open puts 20 links plus five top-level
      // items in the drawer — past one screen again, which is the whole point
      // of collapsing them. Closing a sibling only ever touches state this
      // function owns.
      if (opening) {
        items.forEach((other) => {
          if (other === item) return;
          other.classList.remove("is-submenu-open");
          const otherBtn = other.querySelector(".site-nav__submenu-toggle");
          if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
        });
      }
      setOpen(opening);
    });

    function apply() {
      if (mobile.matches) {
        if (!btn.isConnected) link.after(btn);
        item.classList.add("has-js-submenu");
        setOpen(false);
      } else {
        if (btn.isConnected) btn.remove();
        item.classList.remove("has-js-submenu", "is-submenu-open");
      }
    }

    apply();
    mobile.addEventListener("change", apply);
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

  // ⚠️ RETIRE THE BLUR ONCE IT HAS FINISHED, don't leave it at blur(0).
  // `.u-reveal` blurs 6px → 0 (motion.css), and a `filter` of anything other than
  // `none` keeps the element on its own compositing layer forever — blurring
  // nothing, but still re-rasterised. Measured on the German homepage (2026-08-08,
  // client: it "se tranca un poco" scrolling past the map): 116 elements sat on a
  // spent filter and a 3s trace spent 2678ms in Layerize. The single worst one was
  // .coverage__map-wrap — an 835k-pixel box wrapping the LIVE Leaflet map, held on
  // its own layer by a blur of zero.
  // `.is-settled` (motion.css) sets `filter: none`, which looks identical to
  // blur(0) — so this is invisible, and it only ever runs AFTER the transition has
  // played. The timeout is the fallback for when transitionend never fires (an
  // element revealed while off-screen, a interrupted transition); it is generous on
  // purpose, since being late costs nothing and being early would cut the blur off
  // mid-animation.
  const settle = (el) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.classList.add("is-settled");
    };
    el.addEventListener(
      "transitionend",
      (e) => {
        if (e.propertyName === "filter") finish();
      },
      { once: false }
    );
    setTimeout(finish, 2000);
  };

  const reveal = (el) => {
    el.classList.add("is-visible");
    settle(el);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reveal(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );

  targets.forEach((el) => {
    el.classList.add("u-reveal");
    observer.observe(el);
    setTimeout(() => reveal(el), 3000);
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
  // The panel is the PHOTO only (client 2026-08-01) — the name/description/
  // "Mehr erfahren" block under it was removed from the markup, so nothing here
  // may reference it. This guard used to also require nameEl/textEl/link, which
  // means leaving it in place would have made the whole preview silently return
  // early and stop swapping images at all. The "Mehr erfahren" affordance now
  // lives on each row instead, revealed on hover next to the arrow — it is
  // static markup, so no JS drives it.
  if (!source || !img) return;

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
 * Clamps a long FAQ to its first 5 questions ON A PHONE, behind a real
 * disclosure button (client 2026-08-03 — eleven open-ended rows made the
 * homepage's last section as long as the rest of the page).
 *
 * Rewritten 2026-08-03. It used to key off `data-faq-extra` attributes plus a
 * `.faq__toggle` button authored in the markup, and it hid the extra questions
 * at EVERY viewport. Neither the attribute nor the button existed on any page
 * (grep), so the whole thing had been a no-op; the clamp is now derived from the
 * item count and applied only below the mobile breakpoint, and the button is
 * injected here — same pattern as initMobileSubmenu().
 *
 * Same JS-applies-hiding principle as initNavToggle(): every question is a real
 * <details> in the base HTML and this function is the only thing that ever hides
 * one. No JS, a script error, reduced motion, a crawler, or any viewport ≥768px
 * all get the complete list — which matters more here than elsewhere, because
 * the page's FAQPage schema declares all of them and must not describe content a
 * visitor cannot reach.
 *
 * A page whose FAQ is already short (/werkschutz/, 5 questions) returns early:
 * no clamp, no button.
 */
function initFaqToggle() {
  const VISIBLE = 5; // keep in step with the :nth-child(n + 6) rule in components.css
  const list = document.querySelector(".faq__list");
  if (!list) return;

  const items = list.querySelectorAll(".faq-item");
  if (items.length <= VISIBLE) return;

  // Same breakpoint as the rest of this project's mobile work.
  const mobile = window.matchMedia("(max-width: 767.98px)");

  // Both homepages load this file; take the wording from the document.
  const de = (document.documentElement.lang || "de").toLowerCase().startsWith("de");
  const labels = de
    ? { more: `Alle ${items.length} Fragen anzeigen`, less: "Weniger Fragen anzeigen" }
    : { more: `Show all ${items.length} questions`, less: "Show fewer questions" };

  const id = list.id || "faq-list";
  list.id = id;

  const row = document.createElement("div");
  row.className = "faq__toggle-row";
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "faq__toggle";
  btn.setAttribute("aria-controls", id);
  row.appendChild(btn);

  function setOpen(open) {
    list.classList.toggle("is-clamped", !open);
    btn.setAttribute("aria-expanded", String(open));
    /* The button shows a bare "+" (client 2026-08-04), drawn by CSS and rotated
       to an "×" while open — the same glyph and the same rotation the question
       rows themselves use. So the label has to carry the meaning: an icon-only
       control with no accessible name is just an unnamed button to a screen
       reader, and "+" is not a name. */
    btn.setAttribute("aria-label", open ? labels.less : labels.more);
    /* The list's height just changed, and js/item-reveal.js measures a scrubbed
       timeline against it — without this the newly shown questions can sit at
       the start of that tween (invisible) until the next scroll. Guarded because
       main.js is sitewide and does not depend on GSAP. */
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
  }

  btn.addEventListener("click", () => {
    setOpen(btn.getAttribute("aria-expanded") !== "true");
  });

  function apply() {
    if (mobile.matches) {
      if (!row.isConnected) list.after(row);
      setOpen(false);
    } else {
      if (row.isConnected) row.remove();
      list.classList.remove("is-clamped");
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    }
  }

  apply();
  mobile.addEventListener("change", apply);
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
    const href = link.getAttribute("href");
    // Skip in-page anchor links (e.g. Contact -> "/en/#sicherheitsanalyse").
    // An anchor to a section of a page is not a distinct page, so it must
    // never get the current-page pill — otherwise Contact lights up on the
    // homepage it points into. Keeps DE/EN nav consistent (German "Kontakt"
    // points to the real /kontakt/ page and is unaffected).
    if (!href || href.includes("#")) return;

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
  const match = el.textContent.trim().match(/^(\D*)([\d.,]+)(\D*)$/);
  if (!match) return;

  const prefix = match[1];
  // Preserve the source's thousands separator so this shared function formats
  // correctly on BOTH homepages: comma → "25,000" (en), period → "25.000" (de),
  // none → plain digits. (main.js is loaded by the DE and EN pages alike.)
  const sepMatch = match[2].match(/[.,]/);
  const sep = sepMatch ? sepMatch[0] : "";
  const target = parseInt(match[2].replace(/[.,]/g, ""), 10);
  const suffix = match[3];
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    let formatted = Math.round(target * eased).toLocaleString("en-US");
    if (sep === ".") formatted = formatted.replace(/,/g, ".");
    else if (sep === "") formatted = formatted.replace(/,/g, "");
    el.textContent = prefix + formatted + suffix;
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

  /* ══ Deckender Zustand nach dem Hero (Aufgabe 20, 31.08.2026) ══════════════
     ⚠️ VOR dem Rücksprung unten: dieser Teil muss auch auf Seiten laufen, die
     KEINE hellen Sektionen haben. Vorher stieg die Funktion bei
     !lightSections.length aus — auf einer durchgehend dunklen Seite lief also
     weisser Fliesstext hinter weissem Logo durch, und niemand hat es gemeldet,
     weil "der Header ist absichtlich transparent" wie eine Erklärung klingt.

     Der Auslöser ist die UNTERKANTE DES HERO, nicht ein fester Pixelwert: die
     Heroes dieses Projekts sind zwischen 630 und 1378 px hoch. Gibt es keinen
     Hero (Rechtsseiten, Danke-Seiten), wird die Höhe des Headers selbst genommen
     — dort soll die Fläche sofort da sein, weil direkt Text folgt. */
  const hero = document.querySelector(
    ".hero, .service-hero, .jobs-hero, .ref-hero, .rg-hero, .ag-hero, .city-hero, .uu-hero, .eg-hero, .cs-hero"
  );

  /* ⚠️ ERWEITERT 04.09.2026 (Kunde, mit Screenshot von /ueber-uns/: "irgendwas
     ueberlagert da das Hero-Bild teilweise und schneidet so die Koepfe ab").
     Die Unterkante des Hero als EINZIGER Ausloeser liess eine Luecke: solange
     man IM Hero scrollt, blieb der Header durchsichtig und alles lief darunter
     durch. Gemessen auf /ueber-uns/ bei y=260: das Foto lag 76 px (1280x800)
     bzw. 55 px (1440x900) unter dem Header, Logo ueber der H1 und Burger ueber
     den Koepfen.
     Bei y=0 bleibt er durchsichtig — das ist die Entscheidung vom 17.07.2026,
     dass Hero und Header eine Flaeche sind. Die Schwelle liegt nur knapp
     darueber, damit das Gummiband auf iOS kein Flackern erzeugt. */
  const SCROLL_SCHWELLE = 8;

  function solidPruefen() {
    const kopfHoehe = header.getBoundingClientRect().height;
    const grenze = hero ? hero.getBoundingClientRect().bottom : kopfHoehe;
    const gescrollt = (window.scrollY || document.documentElement.scrollTop || 0) > SCROLL_SCHWELLE;
    header.classList.toggle("site-header--solid", gescrollt || grenze <= kopfHoehe);
  }

  solidPruefen();
  window.addEventListener("scroll", solidPruefen, { passive: true });
  window.addEventListener("resize", solidPruefen, { passive: true });

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
