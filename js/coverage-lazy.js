/*
  Lazy loader for the Coverage Areas map (perf, 2026-07-27). Leaflet is ~41K
  gzip of JS (+ its CSS + the map tiles) and the map sits far down the homepage,
  so loading it on every visit was pure upfront weight. This tiny script instead
  waits until the map container nears the viewport, then injects — in order —
  the Leaflet CSS, the Leaflet core, and finally js/coverage-map.js (which
  self-inits off the global `L`). Replaces the three eager <link>/<script> tags
  that used to live in the homepage <head>.

  Homepage-only, its own <script defer> tag. JS-only-ever-enhances, unchanged
  from before: the 10 city pills are real <a> links that work with no JS, so if
  this never runs the section is still fully usable — the map is the bonus. On
  browsers without IntersectionObserver it just loads immediately (rare
  fallback), same end result.
*/
(function () {
  "use strict";

  var target = document.getElementById("coverage-map");
  if (!target) return;

  var started = false;

  function inject(tag, props, onload) {
    var el = document.createElement(tag);
    Object.keys(props).forEach(function (k) { el[k] = props[k]; });
    if (onload) el.onload = onload;
    document.head.appendChild(el);
    return el;
  }

  function load() {
    if (started) return;
    started = true;
    // Map styling.
    inject("link", { rel: "stylesheet", href: "/css/vendor/leaflet.css" });
    // Leaflet core, THEN the map script (which depends on the global L).
    inject("script", { src: "/assets/js/vendor/leaflet.js" }, function () {
      inject("script", { src: "/js/coverage-map.js" });
    });
  }

  if (!("IntersectionObserver" in window)) {
    load();
    return;
  }

  // Start loading a bit before the map scrolls into view so it's ready in time.
  var io = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      io.disconnect();
      load();
    }
  }, { rootMargin: "600px 0px" });

  io.observe(target);
})();
