#!/usr/bin/env python3
"""
Turn a city's real administrative boundary into ONE inline-SVG path for its
city page's hero visual (.city-hero__map in css/page-city.css).

Why this exists, and why the output is a path and not a map:
  - assets/data/coverage-boundaries/*.geojson already holds the ten cities'
    real OSM boundaries, fetched once in development (2026-07-21, see CLAUDE.md
    for the Nominatim process and the two wrong-match traps it found). This
    reuses that data instead of a second source of truth.
  - A city page needs a "where" visual and NO city photography exists. A real
    outline is honest (it is that city's own shape), unique per page, and — as
    a path — costs zero requests and no third-party tiles, unlike the Leaflet
    maps on / and /kontakt/. It also suits the Einsatzgebiet framing the copy
    requires: an AREA, never a fake branch address.
  - Run once per city, in development. Never at runtime.

Usage:  python3 docs/design-sources/city-outline.py nuremberg
        (the slug is the geojson filename, e.g. nuremberg, wuerzburg, fuerth)

Prints the viewBox and the `d` attribute to paste into the page markup.

⚠️ HOW MUCH DETAIL, AND WHY IT IS NOT A POINT BUDGET ANY MORE (2026-08-14).
This used to simplify down to MAX_POINTS = 220 "so the path stays ~2.5KB", and
the client saw the result for what it was: "es muy rectas las líneas de border…
no tan rectas sino un poco más detalladas". A point budget is the wrong control
because it says nothing about what the drawing actually looks like — it happened
to leave Nürnberg's outline with straight runs several hundred metres long, which
at hero size read as a polygon rather than as a city.

The control is now TOLERANCE_UNITS: the largest error, in viewBox units, that a
simplified vertex may have. That converts straight into screen pixels, which is
the only thing a viewer can see:

    px on screen = TOLERANCE_UNITS x (rendered width / TARGET_W)

.city-map is capped at 30rem TALL (css/page-city.css), so Nürnberg's 1000x1432
box renders ~335px wide, i.e. 0.335 px per unit. At 1.0 unit the worst vertex is
therefore off by 0.34 CSS px — under half a device pixel even on a retina
screen, so the outline is visually indistinguishable from the raw 3.566-point
boundary while still being 833 points / ~11KB instead of 45KB.

DO NOT lower this to "save bytes" without re-deriving that number: the straight
lines come back long before the file gets meaningfully smaller (220 points was
2.6KB against 833 points' 10.7KB — 8KB of markup, which gzips to a fraction,
bought back the entire look).
"""
import json
import math
import sys

TARGET_W = 1000          # viewBox width; the height follows the real aspect
# The simplification error ceiling, in viewBox units. See the module docstring:
# this is a SUB-PIXEL budget at the size the hero actually renders, not a point
# count. Raising it straightens the outline; lowering it only adds bytes.
TOLERANCE_UNITS = 1.0
# A hard stop, not a target — it only ever trips if a future boundary is far
# more detailed than the ten fetched in July, and it prints a warning when it
# does rather than silently straightening the shape.
MAX_POINTS = 1600


def load_rings(slug):
    with open(f"assets/data/coverage-boundaries/{slug}.geojson") as fh:
        geo = json.load(fh)
    g = geo["geometry"]
    if g["type"] == "Polygon":
        return g["coordinates"], geo.get("properties", {})
    rings = []
    for poly in g["coordinates"]:
        rings += poly
    return rings, geo.get("properties", {})


def project(ring, lat0):
    """Equirectangular with a cos(lat) correction — at city scale this is
    indistinguishable from Web Mercator and keeps the shape undistorted."""
    k = math.cos(math.radians(lat0))
    return [(lon * k, -lat) for lon, lat in ring]


def perp_dist(p, a, b):
    (px, py), (ax, ay), (bx, by) = p, a, b
    dx, dy = bx - ax, by - ay
    if dx == 0 and dy == 0:
        return math.hypot(px - ax, py - ay)
    t = max(0, min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
    return math.hypot(px - (ax + t * dx), py - (ay + t * dy))


def simplify(points, tol):
    """Douglas-Peucker. Iterative, because a 3.5k-point ring blows the
    recursion limit."""
    if len(points) < 3:
        return points
    keep = [False] * len(points)
    keep[0] = keep[-1] = True
    stack = [(0, len(points) - 1)]
    while stack:
        i, j = stack.pop()
        worst, idx = -1.0, None
        for k in range(i + 1, j):
            d = perp_dist(points[k], points[i], points[j])
            if d > worst:
                worst, idx = d, k
        if idx is not None and worst > tol:
            keep[idx] = True
            stack.append((i, idx))
            stack.append((idx, j))
    return [p for p, k in zip(points, keep) if k]


def main(slug):
    rings, props = load_rings(slug)
    # Only the main body: the small outliers (43 / 14 / 11 points on Nürnberg)
    # are exclaves that read as specks at hero size.
    ring = max(rings, key=len)
    lat0 = sum(lat for _, lat in ring) / len(ring)
    pts = project(ring, lat0)

    # ⚠️ THE SCALE IS DERIVED FROM THE RAW RING, BEFORE SIMPLIFYING, AND IT HAS
    # TO BE. The tolerance is expressed in viewBox units, so it can only be
    # converted to degrees once the degrees-per-unit factor is known — and that
    # factor comes from the shape's own width. Deriving it from the SIMPLIFIED
    # ring instead would be circular (the simplification would be setting its
    # own budget) and it drifts: dropping vertices can pull the bounding box in,
    # which changes the scale, which changes what the tolerance meant.
    raw_xs = [x for x, _ in pts]
    scale = TARGET_W / (max(raw_xs) - min(raw_xs))

    tol = TOLERANCE_UNITS / scale
    simple = simplify(pts, tol)
    if len(simple) > MAX_POINTS:
        # Not silently straightened — a boundary this detailed is a fact worth
        # seeing, and the fix is a decision (accept the bytes, or raise the
        # tolerance knowing the outline gets straighter), not a default.
        print(
            f"# ⚠️ {len(simple)} points, over MAX_POINTS ({MAX_POINTS}). "
            f"Kept anyway — raise TOLERANCE_UNITS only after re-deriving the "
            f"sub-pixel budget in this file's docstring.",
            file=sys.stderr,
        )

    xs = [x for x, _ in simple]
    ys = [y for _, y in simple]
    w, h = max(xs) - min(xs), max(ys) - min(ys)
    vb_h = round(h * scale)

    coords = [
        (round((x - min(xs)) * scale, 1), round((y - min(ys)) * scale, 1))
        for x, y in simple
    ]
    d = "M" + " L".join(f"{x} {y}" for x, y in coords) + " Z"

    print(f"# {slug}: {props.get('osm_display_name', '')}")
    print(f"# {len(ring)} points -> {len(simple)} "
          f"(tolerance {TOLERANCE_UNITS} viewBox units = {tol:.6f} deg)")
    print(f'viewBox="0 0 {TARGET_W} {vb_h}"')
    print(f'centroid (viewBox units): '
          f'{round(sum(x for x, _ in coords) / len(coords), 1)} '
          f'{round(sum(y for _, y in coords) / len(coords), 1)}')
    # ⚠️ pathLength="1" IS PART OF THE OUTPUT, not decoration. The outline draws
    # itself with a pure-CSS dash (css/page-city.css), and pathLength renormalises
    # the perimeter to 1 so `stroke-dasharray: 1` is exactly one lap FOR ANY CITY
    # AT ANY SIZE. Without it the stylesheet needs this shape's measured length as
    # a magic number — which is what it had (7381, Nürnberg's), and that number is
    # wrong for every other city and wrong for this one the moment the tolerance
    # above changes. Same trick .service-contrast__frame already uses.
    print(f'<path class="city-map__area" pathLength="1" d="{d}"></path>')
    print(f"# path data: {len(d)} bytes")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "nuremberg")
