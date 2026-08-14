#!/usr/bin/env python3
"""
Build the /einsatzgebiete/ hero map: ONE inline SVG holding the real outline of
Franconia plus the ten coverage cities, ready to animate.

Why this exists, and why the output is a vector and not an image
----------------------------------------------------------------
The hero first shipped (2026-08-10) as a PNG screenshot of the Leaflet map. The
client asked for the map to DRAW ITSELF, for the cities to highlight and for
location pins to pop — none of which a raster can do, because a raster has no
parts. It also asked for "la mejor calidad", and a screenshot is the one format
that cannot deliver that: it is fixed-resolution, it upscales on a Retina
screen, and it cost 334KB. This emits ~20KB of vector that is sharp at any size
and whose every piece is an addressable element.

Data, and why nothing new was fetched:
  - assets/data/coverage-boundaries/franken.geojson is not one shape. It is the
    THREE real Regierungsbezirke — Ober-, Mittel- and Unterfranken — which is
    both the outline of Franconia AND the internal division the page's own FAQ
    and the scroll journey already group the cities by.
  - The ten city files are the same real OSM boundaries the Leaflet map draws.
  Both were fetched once from Nominatim in development (2026-07-21, see
  CLAUDE.md for the process and the two wrong-match traps it caught). This
  script never touches the network.

THE ONE THING THAT MATTERS MOST: every shape is projected through the SAME
projection and the SAME bounding box (that of the three regions). That is what
puts each city in its true position inside the outline. Projecting a city on
its own — which is what docs/design-sources/city-outline.py does, correctly,
for a single-city page — would centre each one in its own box and pile all ten
on top of each other.

Usage:  python3 docs/design-sources/franken-map.py > /tmp/franken-map.svg
        (then paste the <svg> body into pages/einsatzgebiete.html)

Run once, in development. Never at runtime.
"""
import json
import math
import sys

BASE = "assets/data/coverage-boundaries"
TARGET_W = 1000.0

# Point budgets. The region outline is the hero's centrepiece and carries the
# silhouette a visitor recognises, so it keeps what it has (the file is already
# simplified to ~3.2km segments — measured — which at this render size is ~6px
# per segment and reads smooth). A city, at the scale of all Franconia, renders
# 8–40px across: past ~55 points nothing it adds is visible, and the raw files
# carry 1143–3955 each. That difference is the whole 256KB → ~20KB.
# ⚠️ THE REGION OUTLINE COMES FROM A DIFFERENT FILE THAN THE CITIES, and that
# is deliberate. assets/data/coverage-boundaries/franken.geojson is a RUNTIME
# asset: the homepage's Leaflet map draws it as a background wash at zoom 8-9
# and it is deliberately crushed to 8KB — CLAUDE.md says in so many words not to
# re-export it at full detail. At hero size that same file reads as straight
# cuts (client 2026-08-10: "están muy rectos los cortes"), because its segments
# are ~3.2km, i.e. 5-6px here.
# So the hero uses its own higher-fidelity copy, re-fetched once from Nominatim
# (the same one-off process, 1 req/s and a real User-Agent) and kept in
# docs/design-sources/ — a BUILD-TIME source, not shipped, since the output of
# this script is inlined into the page anyway. The runtime file is untouched, so
# the homepage map is unaffected.
REGION_SOURCE = "docs/design-sources/franken-detail.geojson"

# No further simplification of the region: the detail file is already cut to
# ~0.69km segments, which at the map's rendered width (~540px for ~350km, so
# 1px ≈ 0.6km) is about 1.2px per segment — the limit of what the screen can
# show. Simplifying again here is what made the first version look faceted.
REGION_MAX_POINTS = 100000
CITY_MAX_POINTS = 55

# The card icons (see the end of main()). Rendered ~44px, so they can carry a
# little more shape than the 8-40px dots on the map — enough for a silhouette
# to be recognisable — while still staying under ~700 bytes each.
CARD_ICON_MAX_POINTS = 90
ICON_BOX = 100
ICON_PAD = 6

# ALL TEN CARRY A LABEL since 2026-08-10 (client: "acá poneme todos los
# nombres"). Six of them were pin-only before, because Nürnberg, Fürth, Erlangen
# and Forchheim sit within ~20km and four labels there collided into noise.
#
# What makes ten work is the `side` column: the four in that cluster ALTERNATE,
# so consecutive labels run away from each other instead of stacking. Their
# measured positions in the 1000x800 viewBox are
#     forchheim (633, 396) · erlangen (607, 460) · fuerth (603, 503) ·
#     nuremberg (637, 529)
# i.e. vertical gaps of 64 / 43 / 25 units against a ~28-unit label height — so
# the two that are only 25 apart (Fürth, Nürnberg) MUST be on opposite sides.
# ⚠️ Verify with the real rendered bounding boxes after any change here, not by
# eye: the check is in the build report and it is a two-minute measurement.
#
# `major` is only the pin SIZE — the four regional centres read a step stronger.
# It used to double as "has a label", which is why it looked like a hierarchy
# decision; it is not one any more.
# ⚠️ THE LIST ITSELF IS NOT HERE ANY MORE. It is content/coverage.json — the
# single data source the client asked for on 2026-08-14 ("build it so the
# map/pill list updates automatically when we add new coverage locations"), and
# the same file build.js renders the pill lists from and js/coverage-map.js
# fetches for the Leaflet map. A location added there appears in this map the
# next time this script is run.
#
# ⚠️ AND THAT RUN IS MANUAL, on purpose. This emits inline vector art that is
# pasted into pages/einsatzgebiete.html; it is generated once in development and
# never at runtime (CLAUDE.md). So: add the entry, drop its boundary geojson in
# assets/data/coverage-boundaries/, then re-run this and paste. Everything else
# — pills, footer, both Leaflet maps — follows from the build alone.
#
# The per-city knobs live in that file's `map` object:
#   side  — which way the label runs from the pin. It exists ONLY to keep
#           neighbours from colliding.
#           ⚠️ Erlangen RIGHT and Fürth LEFT, not both left. They are 43 viewBox
#           units apart vertically, which is ~15px once the map is a phone's
#           350px wide, against an 18px label — so on the same side they
#           overlapped (measured; shrinking the type does NOT fix it, because
#           the separation is fixed in viewBox units while the label box shrinks
#           with the font, so they stay in contact). Opposite sides makes them
#           diverge horizontally instead. The same rule is what places the
#           northern cluster added 2026-08-14 (Coburg / Kronach / Lichtenfels).
#   major — pin SIZE only, for the four regional centres. It used to double as
#           "has a label", which is why it looked like a hierarchy decision; it
#           is not one any more (all of them are labelled).
COVERAGE_FILE = "content/coverage.json"


def load_cities():
    with open(COVERAGE_FILE) as fh:
        data = json.load(fh)
    out = []
    for loc in data["locations"]:
        m = loc.get("map") or {}
        out.append((loc["id"], loc["name"], m.get("side", "start"), bool(m.get("major"))))
    return out


CITIES = load_cities()


def load_polygons(path_or_slug):
    """-> list of polygons; each polygon is a list of rings; each ring a list of
    [lon, lat]. Handles both file shapes in play: a bare Feature (the cities)
    and a FeatureCollection (the three regions)."""
    path = path_or_slug if path_or_slug.endswith(".geojson") else f"{BASE}/{path_or_slug}.geojson"
    with open(path) as fh:
        data = json.load(fh)
    feats = data["features"] if data.get("type") == "FeatureCollection" else [data]
    polys = []
    for feat in feats:
        geom = feat["geometry"]
        if geom["type"] == "Polygon":
            polys.append(geom["coordinates"])
        else:
            polys.extend(geom["coordinates"])
    return polys


def perp_dist(p, a, b):
    (px, py), (ax, ay), (bx, by) = p, a, b
    dx, dy = bx - ax, by - ay
    if dx == 0 and dy == 0:
        return math.hypot(px - ax, py - ay)
    t = max(0, min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
    return math.hypot(px - (ax + t * dx), py - (ay + t * dy))


def simplify(points, tol):
    """Douglas-Peucker, same implementation as city-outline.py."""
    if len(points) < 3:
        return points
    dmax, index = 0.0, 0
    for i in range(1, len(points) - 1):
        d = perp_dist(points[i], points[0], points[-1])
        if d > dmax:
            dmax, index = d, i
    if dmax > tol:
        return simplify(points[: index + 1], tol)[:-1] + simplify(points[index:], tol)
    return [points[0], points[-1]]


def fit(polys, budget):
    """Tighten the tolerance until the whole shape fits its point budget. A
    fixed tolerance cannot work across shapes that differ 25x in size."""
    tol = 0.0
    total = sum(len(r) for p in polys for r in p)
    if total <= budget:
        return polys
    tol = 0.0002
    for _ in range(40):
        out = [[simplify(r, tol) for r in poly] for poly in polys]
        if sum(len(r) for p in out for r in p) <= budget:
            return out
        tol *= 1.4
    return out


def main():
    regions = load_polygons(REGION_SOURCE)
    cities = {slug: load_polygons(slug) for slug, _, _, _ in CITIES}

    # ---- ONE shared projection + ONE shared box, for everything ----
    region_pts = [p for poly in regions for ring in poly for p in ring]
    lats = [p[1] for p in region_pts]
    lat0 = (min(lats) + max(lats)) / 2
    k = math.cos(math.radians(lat0))

    def project(p):
        # Equirectangular with a cos(lat) correction. At this span it is
        # indistinguishable from Web Mercator and keeps the shape undistorted.
        return (p[0] * k, -p[1])

    proj = [project(p) for p in region_pts]
    minx, maxx = min(x for x, _ in proj), max(x for x, _ in proj)
    miny, maxy = min(y for _, y in proj), max(y for _, y in proj)
    scale = TARGET_W / (maxx - minx)
    height = (maxy - miny) * scale

    def to_svg(p):
        x, y = project(p)
        return ((x - minx) * scale, (y - miny) * scale)

    def d_attr(polys):
        out = []
        for poly in polys:
            for ring in poly:
                pts = [to_svg(p) for p in ring]
                out.append("M" + " ".join(f"{x:.1f},{y:.1f}" for x, y in pts) + "Z")
        return " ".join(out)

    def centroid(polys):
        # Area-weighted centroid of the largest ring — a plain average of every
        # point drags toward whichever side has more vertices, which for a
        # ragged municipal border is a visibly wrong pin position.
        biggest = max((r for poly in polys for r in poly), key=len)
        pts = [to_svg(p) for p in biggest]
        a = cx = cy = 0.0
        for i in range(len(pts) - 1):
            x0, y0 = pts[i]
            x1, y1 = pts[i + 1]
            cross = x0 * y1 - x1 * y0
            a += cross
            cx += (x0 + x1) * cross
            cy += (y0 + y1) * cross
        if abs(a) < 1e-9:
            return (sum(x for x, _ in pts) / len(pts), sum(y for _, y in pts) / len(pts))
        a *= 0.5
        return (cx / (6 * a), cy / (6 * a))

    regions_fit = fit(regions, REGION_MAX_POINTS)

    out = []
    w(out := out, f'<svg class="eg-map-svg" viewBox="0 0 {TARGET_W:.0f} {height:.0f}" '
                  f'fill="none" aria-hidden="true" data-eg-hero-map>')

    # The pin is the CLIENT'S OWN assets/icons/icon-location.svg, as a <symbol>
    # so ten instances cost one definition. Note it is a FILLED glyph, unlike
    # most of this site's stroked sprite icons — `fill="currentColor"` replaces
    # the file's hardcoded white so the pin can follow the CSS.
    out.append(
        '  <symbol id="eg-pin" viewBox="0 0 350 350">'
        '<path d="M174.5 23C111.336 23 60.125 74.2114 60.125 137.375C60.125 162.247 '
        '68.279 185.069 81.8324 203.76C82.0755 204.208 82.1136 204.709 82.39 205.137L158.64 '
        '319.512C162.176 324.817 168.133 328 174.5 328C180.867 328 186.824 324.817 190.36 '
        '319.512L266.61 205.137C266.891 204.709 266.925 204.208 267.168 203.76C280.721 '
        '185.069 288.875 162.247 288.875 137.375C288.875 74.2114 237.664 23 174.5 23ZM174.5 '
        '175.5C153.445 175.5 136.375 158.43 136.375 137.375C136.375 116.32 153.445 99.25 '
        '174.5 99.25C195.555 99.25 212.625 116.32 212.625 137.375C212.625 158.43 195.555 '
        '175.5 174.5 175.5Z" fill="currentColor"/></symbol>'
    )

    # 1. The outline. One <path> per Regierungsbezirk, so the draw can stagger
    #    across the three and the internal borders exist (they are real, and the
    #    client's reference still shows them).
    out.append('  <g class="eg-map-svg__regions">')
    for poly, name in zip(regions_fit, ("oberfranken", "mittelfranken", "unterfranken")):
        out.append(f'    <path class="eg-map-svg__region" data-region="{name}" d="{d_attr([poly])}"/>')
    out.append("  </g>")

    # 2. The cities: real polygon, then pin, then label.
    #    NO HALO any more (client 2026-08-10: "no pongas el círculo ese
    #    transparente que está en todos los locations, el icono sí"). It was
    #    added when the region carried a fill and a city's own blue disappeared
    #    against it; with the region reduced to a bare outline the city polygons
    #    are the only filled shapes on the map and read on their own.
    out.append('  <g class="eg-map-svg__cities">')
    for slug, label, anchor, major in CITIES:
        polys = fit(cities[slug], CITY_MAX_POINTS)
        cx, cy = centroid(cities[slug])
        out.append(f'    <g class="eg-map-svg__city" data-city="{slug}">')
        out.append(f'      <path class="eg-map-svg__shape" d="{d_attr(polys)}"/>')
        # ⚠️ A <use>'s x/y place the BOX's top-left corner, not the artwork's
        # anchor — so the pin has to be offset by where its own tip sits inside
        # its 350x350 viewBox: (174.5, 328) = (0.499, 0.937) of the box. Without
        # this every pin floats up and left of the city it marks, by roughly its
        # own size, which at this scale is the whole city.
        size = 34 if major else 26
        out.append(f'      <use class="eg-map-svg__pin" href="#eg-pin" '
                   f'x="{cx - size * 0.499:.1f}" y="{cy - size * 0.937:.1f}" '
                   f'width="{size}" height="{size}"/>')
        if label:
            dx = 20 if anchor == "start" else -20
            out.append(f'      <text class="eg-map-svg__label" x="{cx + dx:.1f}" y="{cy + 5:.1f}" '
                       f'text-anchor="{anchor}">{label}</text>')
        out.append("    </g>")
    out.append("  </g>")
    out.append("</svg>")
    print("\n".join(out))

    # ---- The card icons -------------------------------------------------
    # A second, independent output: one tiny SVG per city, each showing THAT
    # city's own outline, for the cards further down the page (client
    # 2026-08-10: "un iconito del contorno de la ciudad de la que estamos
    # hablando").
    #
    # ⚠️ These do NOT share the map's projection, and that is the point. The map
    # above needs one common box so each city lands in its true position inside
    # Franconia; a card icon needs the opposite — its own fitted viewBox, so a
    # 40px-wide Ansbach and a 40px-wide Nürnberg both fill their box. Same
    # decision docs/design-sources/city-outline.py already makes for the city
    # pages' hero outlines.
    print("\n\n<!-- ==== CARD ICONS: one per city, own fitted viewBox ==== -->")
    for slug, _, _, _ in CITIES:
        polys = fit(cities[slug], CARD_ICON_MAX_POINTS)
        pts = [p for poly in polys for ring in poly for p in ring]
        lat_c = (min(p[1] for p in pts) + max(p[1] for p in pts)) / 2
        kc = math.cos(math.radians(lat_c))
        pr = [(p[0] * kc, -p[1]) for p in pts]
        x0, x1 = min(x for x, _ in pr), max(x for x, _ in pr)
        y0, y1 = min(y for _, y in pr), max(y for _, y in pr)
        # Fit the LONGER side to the box and centre the other, so every icon is
        # optically the same size regardless of the city's own aspect.
        span = max(x1 - x0, y1 - y0)
        s = (ICON_BOX - ICON_PAD * 2) / span
        ox = (ICON_BOX - (x1 - x0) * s) / 2
        oy = (ICON_BOX - (y1 - y0) * s) / 2

        def conv(p):
            return ((p[0] * kc - x0) * s + ox, (-p[1] - y0) * s + oy)

        d = []
        for poly in polys:
            for ring in poly:
                rp = [conv(p) for p in ring]
                d.append("M" + " ".join(f"{x:.1f},{y:.1f}" for x, y in rp) + "Z")
        print(f'<!-- {slug} -->')
        print(f'<svg class="eg-city__shape" viewBox="0 0 {ICON_BOX} {ICON_BOX}" '
              f'aria-hidden="true"><path d="{" ".join(d)}"/></svg>')


def w(lst, s):
    lst.append(s)


if __name__ == "__main__":
    main()
