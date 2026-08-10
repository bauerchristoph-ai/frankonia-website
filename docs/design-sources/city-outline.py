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
"""
import json
import math
import sys

TARGET_W = 1000          # viewBox width; the height follows the real aspect
TOLERANCE_START = 0.0002 # degrees; auto-tightened until the point budget is met
MAX_POINTS = 220         # ~2.5KB of path data — the whole point of simplifying


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

    tol = TOLERANCE_START
    while True:
        simple = simplify(pts, tol)
        if len(simple) <= MAX_POINTS:
            break
        tol *= 1.35

    xs = [x for x, _ in simple]
    ys = [y for _, y in simple]
    w, h = max(xs) - min(xs), max(ys) - min(ys)
    scale = TARGET_W / w
    vb_h = round(h * scale)

    coords = [
        (round((x - min(xs)) * scale, 1), round((y - min(ys)) * scale, 1))
        for x, y in simple
    ]
    d = "M" + " L".join(f"{x} {y}" for x, y in coords) + " Z"

    print(f"# {slug}: {props.get('osm_display_name', '')}")
    print(f"# {len(ring)} points -> {len(simple)} (tolerance {tol:.5f} deg)")
    print(f'viewBox="0 0 {TARGET_W} {vb_h}"')
    print(f'centroid (viewBox units): '
          f'{round(sum(x for x, _ in coords) / len(coords), 1)} '
          f'{round(sum(y for _, y in coords) / len(coords), 1)}')
    print(f'd="{d}"')
    print(f"# path data: {len(d)} bytes")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "nuremberg")
