/*
  coverage-select.js — the Einsatzgebiete city picker as a dropdown ON MOBILE.

  Client 2026-08-04: eleven pills wrapped to four rows under the map and took
  more vertical space than the map itself. Below 768px they collapse behind one
  button that shows the current selection ("Alle" by default); tapping it opens
  the full list, and picking an entry closes it again.

  WHY NOT A <select>: the ten cities are real <a href="/sicherheitsdienst-…/">
  links — internal navigation this site depends on (CLAUDE.md: "Real links, not
  JS-only buttons"), and they have to keep working with no JavaScript. A native
  select would turn them into <option>s, i.e. destroy ten crawlable internal
  links and make the whole control JS-only. So this is a disclosure over the
  EXISTING markup: same links, same button, same data-coverage-city hooks, just
  hidden behind a trigger and restyled as a list.

  JS-only-ever-enhances, same contract as initMobileSubmenu()/initFaqToggle():
  the two <ul>s ship visible, this file is the only thing that ever collapses
  them, and it injects the trigger itself. No JS, a script error, or any viewport
  ≥768px leaves all eleven visible as the pill rows they already are.

  NO dependency on Leaflet or js/coverage-map.js. That module drives the map from
  the same clicks and may bail out early (it needs Leaflet); if it does, these
  entries stay what the HTML says they are — links to the city pages — and this
  dropdown still opens, closes and navigates.

  The trigger's label follows whatever is actually selected rather than only what
  was clicked here: coverage-map.js marks the active entry with .is-active (plus
  aria-current / aria-pressed), so a MutationObserver on that is the one source
  of truth, and the label stays right no matter who changed the selection.
*/
(function () {
  "use strict";

  var MQ = "(max-width: 767.98px)";

  var rows = document.querySelector("[data-coverage-rows]");
  if (!rows) return;

  var items = Array.prototype.slice.call(rows.querySelectorAll("[data-coverage-city]"));
  if (items.length < 2) return;

  var mq = window.matchMedia(MQ);

  // Wording lives in the markup so each language's page carries its own.
  var labelText = rows.getAttribute("data-coverage-label") || "";

  var id = rows.id || "coverage-city-list";
  rows.id = id;

  var btn = null;
  var value = null;
  var observer = null;

  function activeItem() {
    for (var i = 0; i < items.length; i++) {
      var el = items[i];
      if (el.classList.contains("is-active") ||
          el.getAttribute("aria-current") === "true" ||
          el.getAttribute("aria-pressed") === "true") return el;
    }
    return items[0];
  }

  function syncLabel() {
    if (!btn) return;
    var el = activeItem();
    var text = (el.textContent || "").trim();
    if (text === value) return;
    value = text;
    btn.querySelector(".coverage__select-value").textContent = text;
    /* The visible text is just a city name, so the button's accessible name has
       to say what that name IS — otherwise it announces as e.g. "Bamberg", with
       no hint that it opens a list of coverage areas. */
    if (labelText) btn.setAttribute("aria-label", labelText + ": " + text);
  }

  function setOpen(open) {
    btn.setAttribute("aria-expanded", String(open));
    rows.classList.toggle("is-collapsed", !open);
  }

  function isOpen() {
    return btn.getAttribute("aria-expanded") === "true";
  }

  function onTrigger() { setOpen(!isOpen()); }

  /* Selecting closes the panel. Deliberately NOT preventDefault: on a working
     page coverage-map.js has already claimed the click and stopped the
     navigation itself; if it never ran, the link must still navigate. */
  function onPick(e) {
    if (!e.target.closest("[data-coverage-city]")) return;
    setOpen(false);
    // .is-active lands in the same task; the observer catches it either way.
    setTimeout(syncLabel, 0);
  }

  function onDocClick(e) {
    if (!isOpen()) return;
    if (rows.contains(e.target) || btn.contains(e.target)) return;
    setOpen(false);
  }

  function onKey(e) {
    if (e.key === "Escape" && isOpen()) {
      setOpen(false);
      btn.focus();
    }
  }

  function build() {
    if (btn) return;

    btn = document.createElement("button");
    btn.type = "button";
    btn.className = "coverage__select";
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", id);
    btn.innerHTML =
      '<span class="coverage__select-value"></span>' +
      '<svg class="coverage__select-caret icon" aria-hidden="true" focusable="false">' +
      '<use href="#icon-chevron"></use></svg>';

    rows.parentNode.insertBefore(btn, rows);
    rows.classList.add("is-collapsed");
    value = null;
    syncLabel();

    btn.addEventListener("click", onTrigger);
    rows.addEventListener("click", onPick);
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);

    if (typeof MutationObserver !== "undefined") {
      observer = new MutationObserver(syncLabel);
      observer.observe(rows, {
        subtree: true,
        attributes: true,
        attributeFilter: ["class", "aria-current", "aria-pressed"],
      });
    }
  }

  function destroy() {
    if (!btn) return;
    btn.removeEventListener("click", onTrigger);
    rows.removeEventListener("click", onPick);
    document.removeEventListener("click", onDocClick);
    document.removeEventListener("keydown", onKey);
    if (observer) { observer.disconnect(); observer = null; }
    if (btn.parentNode) btn.parentNode.removeChild(btn);
    btn = null;
    value = null;
    rows.classList.remove("is-collapsed");
  }

  function apply() { if (mq.matches) build(); else destroy(); }

  apply();
  if (mq.addEventListener) mq.addEventListener("change", apply);
  else if (mq.addListener) mq.addListener(apply);
})();
