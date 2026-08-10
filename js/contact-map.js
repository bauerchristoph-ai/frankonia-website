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

  Full-colour basemap ("Voyager"), not the homepage's "Dark Matter" and not the
  greyscale "Positron" this shipped with: a location map's job is to let someone
  orient themselves, which needs the real street/park/water colouring. It is
  still a light style, so it sits correctly on this white page.

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

    // On a phone this map is a STATIC locator, by design (mobile pass
    // 2026-08-04). Leaflet's `dragging` defaults to true, and on a touch device
    // that means a one-finger drag inside a full-width, 300px-tall box pans the
    // map instead of scrolling the page — a scroll trap sitting in the middle of
    // the reading flow, and the exact class of thing this project's own
    // performance rules forbid ("no scroll hijacking", CLAUDE.md).
    //
    // Everything gesture-driven is therefore off below L.Browser.mobile, not
    // just dragging: leaving pinch-zoom or the +/- buttons on would let someone
    // zoom into a map they then cannot pan, which is worse than a fixed view.
    // Nothing is lost — a phone visitor who wants to move around a map wants
    // turn-by-turn, and the "Route in Google Maps öffnen" row hands them off to
    // the native app, which is a better answer than a 300px viewport.
    //
    // Desktop is unchanged: drag-panning and the +/- control still work there,
    // and scrollWheelZoom stays off for the same reason it is off on the
    // homepage map — a wheel over an embed should scroll the page.
    var touch = L.Browser.mobile;

    var map = L.map(el, {
      scrollWheelZoom: false,
      dragging: !touch,
      touchZoom: !touch,
      doubleClickZoom: !touch,
      zoomControl: !touch,
      // No arrow-key panning where there is no panning, and it also keeps the
      // container out of the tab order: a tab stop that does nothing is a dead
      // end for a keyboard user.
      keyboard: !touch,
    }).setView([lat, lng], ZOOM);

    // CARTO "Dark Matter" — the SAME basemap the homepage's Einsatzgebiete map
    // uses (js/coverage-map.js, identical URL), client request 2026-08-08:
    // "hacéme el mapa negro como está en la homepage". The two maps on the site
    // now share one basemap, which is one less thing to keep in sync by eye.
    //
    // This page's style has walked light -> colour -> dark: "Positron"
    // (greyscale, read as a wireframe), then "Voyager" (full colour). Same
    // provider throughout, so the approval, the attribution and the @2x support
    // never changed — only the style path.
    // {r} resolves to "@2x" only on high-DPI screens, empty otherwise.
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
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
        // The label sits BESIDE the dot on desktop and ABOVE it on a phone.
        // Not a style preference: the chip is ~200px of nowrap text, the marker
        // is centred, and the map is only 374px wide at 390px — so "right"
        // ran the label straight off the map's right edge and it rendered
        // clipped mid-word (caught in a screenshot, mobile pass 2026-08-04).
        // Centred above the dot, the same chip fits with room on both sides.
        direction: touch ? "top" : "right",
        offset: touch ? [0, -8] : [12, 0],
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
