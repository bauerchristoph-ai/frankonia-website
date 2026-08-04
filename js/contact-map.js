/*
  Kontakt — "So finden Sie uns" location map (client 2026-08-03).

  Same stack and same approval as the homepage's Einsatzgebiete map: Leaflet.js
  self-hosted (assets/js/vendor/leaflet.js + css/vendor/leaflet.css, no CDN) on
  CARTO's free, keyless basemap tiles. No account, no API key, no token, no
  billing — and deliberately NOT a Google Maps iframe, which would embed a
  third-party frame that sets cookies before any consent exists on this site
  (no consent tooling yet, see docs/build-checklist.md). The two-click Google
  link in the contact list beside this map is unchanged and still the way a
  visitor actually gets routed.

  Light basemap ("Positron"), not the homepage's "Dark Matter": this page is
  white end to end.

  Lazy, same reasoning as js/coverage-lazy.js — Leaflet is ~41K gzip and this
  map sits below the fold, so nothing is fetched until it nears the viewport.
  This file is small enough to stay one script instead of a loader + a map file.

  JS-only-ever-enhances: #contact-map ships with the real address and the Maps
  link inside it as visible HTML (see pages/kontakt.html). This script only
  replaces that fallback once Leaflet has actually loaded, so no JS, a failed
  request, or a crawler all leave a readable address block in its place.

  Coordinates come from the element's own data-lat/data-lng, which are the same
  numbers as the page's LocalBusiness JSON-LD `geo` block — geocoded once from
  Nominatim during this build (Neuerbstraße 19, 96052 Bamberg), never at
  runtime, same rule as the coverage boundaries.
*/
(function () {
  "use strict";

  var el = document.getElementById("contact-map");
  if (!el) return;

  var lat = parseFloat(el.getAttribute("data-lat"));
  var lng = parseFloat(el.getAttribute("data-lng"));
  var label = el.getAttribute("data-label") || "";
  // A missing/broken coordinate must leave the address fallback alone, not
  // render a map of the Atlantic.
  if (isNaN(lat) || isNaN(lng)) return;

  var ZOOM = 16; // street level — the building is identifiable, the district still readable
  var started = false;

  function inject(tag, props, onload) {
    var node = document.createElement(tag);
    Object.keys(props).forEach(function (k) {
      node[k] = props[k];
    });
    if (onload) node.onload = onload;
    document.head.appendChild(node);
    return node;
  }

  function initMap() {
    if (typeof L === "undefined") return; // Leaflet failed to load: keep the fallback

    // Only now is the no-JS address block removed — Leaflet is here and will
    // definitely put a map in its place.
    el.innerHTML = "";

    var map = L.map(el, {
      // Off on purpose, same as the homepage map: an embedded map that
      // swallows page scroll on hover is a common source of frustration.
      // Drag-panning and the +/- control still work.
      scrollWheelZoom: false,
    }).setView([lat, lng], ZOOM);

    // CARTO "Positron" (light). Free and keyless, same as the dark variant the
    // homepage uses; the tiles are rendered from OpenStreetMap data, so the
    // attribution credits both — required by CARTO's own terms.
    // {r} resolves to "@2x" only on high-DPI screens, empty otherwise.
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd",
      detectRetina: true,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>',
    }).addTo(map);

    // Plain HTML/CSS dot (divIcon), not Leaflet's default pin image — same
    // approach as .coverage-marker on the homepage. keyboard: false because
    // there is nothing to activate: the permanent tooltip already says who is
    // here, so a tab stop on it would be a dead end.
    L.marker([lat, lng], {
      keyboard: false,
      icon: L.divIcon({
        className: "contact-marker",
        html: '<span class="contact-marker__dot"></span>',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      }),
    })
      .addTo(map)
      .bindTooltip(label, {
        permanent: true,
        direction: "right",
        offset: [12, 0],
        className: "contact-marker__label",
      });
  }

  function load() {
    if (started) return;
    started = true;
    inject("link", { rel: "stylesheet", href: "/css/vendor/leaflet.css" });
    // Leaflet core first — initMap depends on the global `L` it defines.
    inject("script", { src: "/assets/js/vendor/leaflet.js" }, initMap);
  }

  if (!("IntersectionObserver" in window)) {
    load();
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      if (entries[0].isIntersecting) {
        io.disconnect();
        load();
      }
    },
    // Start early enough that the tiles are usually there by the time the
    // section is actually on screen.
    { rootMargin: "600px 0px" }
  );

  io.observe(el);
})();
