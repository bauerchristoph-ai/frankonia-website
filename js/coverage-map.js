/*
  Coverage Areas — interactive Leaflet map (client brief, 2026-07-21).
  Leaflet.js + OpenStreetMap raster tiles, no account/API key/token/
  billing of any kind. Real administrative boundaries (not circles) for
  all 10 FRANKONIA coverage cities, drawn as a GeoJSON polygon/multipolygon
  layer that swaps in as each city is selected via its pill button or
  its map marker.

  Homepage-only, its own <script defer> tag (same pattern as
  outfits.js/hero-reveal.js/etc.) — not folded into main.js. Depends on
  the global `L` from assets/js/vendor/leaflet.js, loaded just before
  this file in pages/index.html's <head>.

  Boundary files (assets/data/coverage-boundaries/*.geojson) were fetched
  ONCE from Nominatim/OpenStreetMap during this build session — see
  CLAUDE.md for exactly how — and are committed as static project assets.
  This script only ever fetches them from this project's own /assets/
  path at runtime; it never calls Nominatim or any external geocoding
  service itself, and never will on a user's click.

  JS-only-ever-enhances: every real city pill is a real <a href> to its
  city page already, unrelated to this script (see the HTML comment on
  .coverage__map-wrap, pages/index.html) — this file only adds a click
  handler on top (preventDefault + drive the map instead of navigating).
  If this script fails to load, every pill still works exactly as a
  plain link, same as before this map existed. The one "All" button
  (added 2026-07-21, see below) has no page of its own, so there's
  nothing for it to fall back to beyond simply not working — same as
  any other JS-only control on this site.

  "All" default view (added 2026-07-21, client request: show every
  city's boundary at once, zoomed out, by default, with a button to
  return to that view later). This is a real behavior change from the
  map's original default (only Bamberg's boundary loaded on first
  paint) — now ALL 10 boundary GeoJSON files fetch on initial load
  (still via the same loadBoundary()/boundaryCache path, so re-selecting
  "All" later never re-fetches). That's a real, deliberate performance
  trade-off: sizes range ~30-102KB per file (documented in CLAUDE.md),
  so the initial load is now a few hundred KB heavier than before. This
  is what the client explicitly asked for ("por defayl se muestren
  todas"), not an oversight.
*/

(function initCoverageMap() {
  if (typeof L === "undefined") return;

  const mapEl = document.getElementById("coverage-map");
  if (!mapEl) return;

  const overlayCityEl = document.querySelector("[data-coverage-overlay-city]");
  const buttons = Array.from(document.querySelectorAll("[data-coverage-city]"));
  if (!buttons.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // "all" is a pseudo-city id, not a key in coverageLocations below — it
  // has no single center/boundaryUrl of its own, it just means "draw
  // every real city's boundary at once." Kept as a distinct constant
  // (rather than a literal string scattered through this file) so every
  // place that needs to special-case it is easy to find.
  const ALL_ID = "all";
  // Rough center of the 10-city coverage area (Bamberg/Nuremberg/
  // Würzburg/Hof midpoint) — only used for the map's very first paint,
  // before the "All" view's real fitBounds() (computed from the actual
  // boundary polygons once they load) takes over and corrects it.
  const REGION_CENTER = [49.85, 10.9];
  const REGION_ZOOM = 8;
  // Deliberately lower than the per-city maxZoom (13, see drawBoundary/
  // drawAllBoundaries below) — fitting all 10 cities at once needs a
  // much wider view than fitting just one. Raised 8 -> 11 and paired
  // with tighter padding (see drawAllBoundaries) 2026-07-21, client:
  // "amplialo un poquito porque estan muy lejos" — the original
  // combination read as too zoomed-out. All 10 boundaries still stay
  // fully in view either way; this cap and the padding value only
  // control how much empty margin surrounds them, never whether one
  // gets clipped — fitBounds/flyToBounds always computes the exact zoom
  // needed to contain every polygon first.
  const ALL_MAX_ZOOM = 11;

  // Leaflet coordinates: [latitude, longitude]. GeoJSON files (fetched
  // separately, see boundaryUrl) keep the GeoJSON spec's own
  // [longitude, latitude] order internally — nothing here reverses that.
  const coverageLocations = {
    bamberg: {
      name: "Bamberg",
      center: [49.8917, 10.886],
      boundaryUrl: "/assets/data/coverage-boundaries/bamberg.geojson",
    },
    nuremberg: {
      name: "Nuremberg",
      center: [49.4521, 11.0767],
      boundaryUrl: "/assets/data/coverage-boundaries/nuremberg.geojson",
    },
    wuerzburg: {
      name: "Würzburg",
      center: [49.7913, 9.9534],
      boundaryUrl: "/assets/data/coverage-boundaries/wuerzburg.geojson",
    },
    erlangen: {
      name: "Erlangen",
      center: [49.5897, 11.0119],
      boundaryUrl: "/assets/data/coverage-boundaries/erlangen.geojson",
    },
    fuerth: {
      name: "Fürth",
      center: [49.4771, 10.9887],
      boundaryUrl: "/assets/data/coverage-boundaries/fuerth.geojson",
    },
    schweinfurt: {
      name: "Schweinfurt",
      center: [50.0442, 10.234],
      boundaryUrl: "/assets/data/coverage-boundaries/schweinfurt.geojson",
    },
    bayreuth: {
      name: "Bayreuth",
      center: [49.9456, 11.5789],
      boundaryUrl: "/assets/data/coverage-boundaries/bayreuth.geojson",
    },
    coburg: {
      name: "Coburg",
      center: [50.2612, 10.9649],
      boundaryUrl: "/assets/data/coverage-boundaries/coburg.geojson",
    },
    ansbach: {
      name: "Ansbach",
      center: [49.3004, 10.5719],
      boundaryUrl: "/assets/data/coverage-boundaries/ansbach.geojson",
    },
    hof: {
      name: "Hof",
      center: [50.3135, 11.9128],
      boundaryUrl: "/assets/data/coverage-boundaries/hof.geojson",
    },
  };

  const map = L.map(mapEl, {
    // Scroll-wheel zoom is off on purpose — an embedded map that hijacks
    // page scroll on hover is a common source of visitor frustration;
    // click-drag panning and the zoom control still work normally.
    scrollWheelZoom: false,
  }).setView(REGION_CENTER, REGION_ZOOM);

  // Dark-themed tiles (CARTO "Dark Matter" — 2026-07-21, client request:
  // a map color that matches this site's dark theme, was the default
  // colorful OSM style). Free, keyless, no account/billing, same as raw
  // OSM tiles — CARTO's basemaps are rendered FROM OpenStreetMap data,
  // which is why the attribution below credits both. {r} requests
  // retina/@2x tiles automatically on high-DPI screens; CARTO's own
  // basemap CDN supports that suffix (plain OSM tiles above didn't).
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 18,
    subdomains: "abcd",
    // {r} only ever resolves to "@2x" (sharper tiles) when this is true
    // AND the screen is actually high-DPI; it's a plain empty string
    // otherwise, so this is safe on every display either way.
    detectRetina: true,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>',
  }).addTo(map);

  // Small custom circular marker (divIcon — plain HTML/CSS, not
  // Leaflet's default pin image) for every city, all shown from the
  // start; only one is ever "active" at a time via the .is-active class
  // page-home.css scales up.
  const markers = {};
  Object.keys(coverageLocations).forEach((id) => {
    const marker = L.marker(coverageLocations[id].center, {
      icon: L.divIcon({
        className: "coverage-marker",
        html: '<span class="coverage-marker__dot"></span>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      }),
      keyboard: false,
      title: coverageLocations[id].name,
    }).addTo(map);
    marker.on("click", () => selectCity(id));
    markers[id] = marker;
  });

  const boundaryCache = new Map();
  let currentBoundaryLayer = null;
  // Simple request-tracking counter (brief: "Use request tracking or an
  // AbortController where appropriate") — if the user clicks several
  // cities in quick succession, only the response matching the LATEST
  // click is ever allowed to touch the map; every earlier, now-stale
  // response is silently ignored when it resolves.
  let activeRequestId = 0;

  function setActiveButton(id) {
    buttons.forEach((btn) => {
      const isActive = btn.dataset.coverageCity === id;
      btn.classList.toggle("is-active", isActive);
      // The 10 real city pills are <a> elements — aria-current="true" is
      // the correct ARIA pattern for "the current item in a set of
      // choices" on a link. The one "All" button is a real <button>
      // with no page of its own, so it uses aria-pressed instead —
      // aria-current doesn't apply to buttons, and aria-pressed is
      // exactly what a toggle button should expose. See the matching
      // CSS comment on .coverage__pill.is-active, page-home.css.
      if (btn.tagName === "BUTTON") {
        btn.setAttribute("aria-pressed", isActive ? "true" : "false");
      } else {
        btn.setAttribute("aria-current", isActive ? "true" : "false");
      }
    });
  }

  // id === null clears every marker's active state (used by the "All"
  // view, where no single city is more current than the others).
  function setActiveMarker(id) {
    Object.keys(markers).forEach((key) => {
      const el = markers[key].getElement();
      if (el) el.classList.toggle("is-active", key === id);
    });
  }

  function loadBoundary(id) {
    if (boundaryCache.has(id)) {
      return Promise.resolve(boundaryCache.get(id));
    }
    return fetch(coverageLocations[id].boundaryUrl)
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then((geojson) => {
        boundaryCache.set(id, geojson);
        return geojson;
      });
  }

  // Fetches every real city's boundary in parallel (each still goes
  // through loadBoundary()/boundaryCache above, so re-selecting "All"
  // after visiting individual cities — or a second time at all — never
  // re-fetches anything already cached).
  function loadAllBoundaries() {
    return Promise.all(
      Object.keys(coverageLocations).map((id) =>
        loadBoundary(id).then((geojson) => ({ id, geojson }))
      )
    );
  }

  function clearBoundaryLayer() {
    if (currentBoundaryLayer) {
      map.removeLayer(currentBoundaryLayer);
      currentBoundaryLayer = null;
    }
  }

  function drawBoundary(geojson) {
    clearBoundaryLayer();

    currentBoundaryLayer = L.geoJSON(geojson, {
      style: {
        color: "#3D9AD3",
        weight: 2,
        opacity: 1,
        fillColor: "#3D9AD3",
        fillOpacity: 0.12,
      },
    }).addTo(map);

    const bounds = currentBoundaryLayer.getBounds();
    if (!bounds.isValid()) return;

    if (reducedMotion) {
      map.fitBounds(bounds, { padding: [24, 24], animate: false, maxZoom: 13 });
    } else {
      map.flyToBounds(bounds, { padding: [40, 40], duration: 1.4, maxZoom: 13 });
    }
  }

  // Same drawing approach as drawBoundary(), but one L.geoJSON layer per
  // city grouped into a single L.featureGroup — map.removeLayer() works
  // identically on a featureGroup as on a single layer (both implement
  // Leaflet's Layer interface), so clearBoundaryLayer() above needs no
  // branching to handle either case.
  function drawAllBoundaries(entries) {
    clearBoundaryLayer();

    const layers = entries.map((entry) =>
      L.geoJSON(entry.geojson, {
        style: {
          color: "#3D9AD3",
          weight: 2,
          opacity: 1,
          fillColor: "#3D9AD3",
          fillOpacity: 0.12,
        },
      })
    );

    currentBoundaryLayer = L.featureGroup(layers).addTo(map);

    const bounds = currentBoundaryLayer.getBounds();
    if (!bounds.isValid()) return;

    // Tighter padding than a single city's fit (was 24/40 — see
    // ALL_MAX_ZOOM's own comment above for why this changed) — less
    // margin around the 10 boundaries pulls them in closer without
    // risking clipping any of them; the padding value only pads the
    // computed bounds, it can't hide part of a polygon.
    if (reducedMotion) {
      map.fitBounds(bounds, { padding: [12, 12], animate: false, maxZoom: ALL_MAX_ZOOM });
    } else {
      map.flyToBounds(bounds, { padding: [16, 16], duration: 1.4, maxZoom: ALL_MAX_ZOOM });
    }
  }

  function selectAll() {
    const requestId = ++activeRequestId;

    setActiveButton(ALL_ID);
    setActiveMarker(null);
    if (overlayCityEl) overlayCityEl.textContent = document.documentElement.lang === "de" ? "Alle Städte" : "All Cities";
    mapEl.classList.add("is-loading");

    loadAllBoundaries()
      .then((entries) => {
        if (requestId !== activeRequestId) return; // a newer click already won
        mapEl.classList.remove("is-loading");
        drawAllBoundaries(entries);
      })
      .catch((err) => {
        if (requestId !== activeRequestId) return;
        mapEl.classList.remove("is-loading");
        // No user-facing fallback copy anymore (the overlay's sub-line
        // was removed 2026-07-21, see .coverage__overlay's own comment,
        // page-home.css) — the map still recovers visually via the
        // fallback view below, the real error is console-only, same
        // "never shown to a visitor" principle as before, just with one
        // less place to show it even if it wanted to.
        // eslint-disable-next-line no-console
        console.warn("[coverage-map] one or more boundaries unavailable for \"all\":", err);
        clearBoundaryLayer();
        if (reducedMotion) {
          map.setView(REGION_CENTER, REGION_ZOOM, { animate: false });
        } else {
          map.flyTo(REGION_CENTER, REGION_ZOOM, { duration: 1.2 });
        }
      });
  }

  function selectCity(id) {
    if (id === ALL_ID) {
      selectAll();
      return;
    }

    const loc = coverageLocations[id];
    if (!loc) return;

    const requestId = ++activeRequestId;

    setActiveButton(id);
    setActiveMarker(id);
    if (overlayCityEl) overlayCityEl.textContent = loc.name;
    mapEl.classList.add("is-loading");

    loadBoundary(id)
      .then((geojson) => {
        if (requestId !== activeRequestId) return; // a newer click already won
        mapEl.classList.remove("is-loading");
        drawBoundary(geojson);
      })
      .catch((err) => {
        if (requestId !== activeRequestId) return;
        mapEl.classList.remove("is-loading");
        // eslint-disable-next-line no-console
        console.warn("[coverage-map] boundary unavailable for \"" + id + "\":", err);

        clearBoundaryLayer();
        if (reducedMotion) {
          map.setView(loc.center, 12, { animate: false });
        } else {
          map.flyTo(loc.center, 12, { duration: 1.2 });
        }
      });
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      const id = btn.dataset.coverageCity;
      selectCity(id);
      // Mobile: keeps the just-selected pill visible if the wrapped
      // button grid ever scrolls (brief: "automatically scroll the
      // selected city button into view").
      btn.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        inline: "nearest",
        block: "nearest",
      });
    });
  });

  // "All" is the new default view (2026-07-21, client request) — was
  // selectCity("bamberg") before this change.
  selectCity(ALL_ID);
})();
