"""Isometric line scenes for the three /leistungen/ service families.

⚠️ NOT IN USE SINCE 2026-08-10. The client supplied their own artwork for the same
three families (assets/icons/family-*.png) and the page renders those instead. This
is kept because it documents the method — project real 3D coordinates, fit the
viewBox to what was actually drawn — and because it regenerates the scenes if they
are ever wanted back. Nothing imports it; running it prints SVG.

Same approach as the risk-card scenes (CLAUDE.md 2026-08-03). 2:1 dimetric
projection, the flattest isometric variant — it reads as a technical drawing rather
than a game asset at 100px wide.
"""
A, B, C = 1.0, 0.5, 1.0          # x-run, y-rise, z-height per unit


def p(u, v, w=0.0):
    return ((u - v) * A, (u + v) * B - w * C)


def fmt(pt):
    return f"{pt[0]:.2f} {pt[1]:.2f}"


def poly(pts, close=True):
    d = "M" + " L".join(fmt(q) for q in pts)
    return d + " Z" if close else d


def plane(u0, v0, u1, v1, w=0.0):
    return poly([p(u0, v0, w), p(u1, v0, w), p(u1, v1, w), p(u0, v1, w)])


def box(u0, v0, u1, v1, h, base=0.0):
    """The three visible faces of a cuboid, as closed paths.

    Closed and FILLED (see .lh-iso__face in page-leistungen.css): the accent
    route is drawn before the solid, so the solid has to occlude the part of it
    that passes behind — hidden-line removal, the same job the white fills do in
    the client's own supplied drawings (CLAUDE.md 2026-08-05).
    """
    t = [p(u0, v0, base + h), p(u1, v0, base + h), p(u1, v1, base + h), p(u0, v1, base + h)]
    return [
        poly(t),                                                          # top
        poly([t[3], p(u0, v1, base), p(u1, v1, base), t[2]]),             # front-left
        poly([t[2], p(u1, v1, base), p(u1, v0, base), t[1]]),             # front-right
    ]


scenes = {}

# ---- 01 Laufender Betrieb: a permanent building with a closed patrol round.
#
# ⚠️ NO dashed site plane any more (2026-08-10, client: "mejora el icono").
# These scenes render ~58px tall in the orientation selectors, and at that size a
# dashed diamond is moiré, not information — it also boxed the subject in, so the
# building itself only got about half the frame. The blue round already says
# "this is a bounded site", so the plane was saying it twice, worse.
s = {"line": [], "accent": [], "guide": [], "face": [], "detail": []}
s["accent"].append(poly([p(0.6, 0.9), p(9.4, 0.9), p(9.4, 7.1), p(0.6, 7.1)]))  # closed round
# A main volume plus a lower annexe: two masses read as premises, one cuboid reads
# as a crate. The annexe is drawn first so the taller block occludes its back edge.
s["face"] += box(5.6, 2.0, 8.6, 4.6, 1.5)
s["face"] += box(2.0, 2.4, 5.9, 6.0, 3.0)
# The entrance, on the front-right face of the main volume, and two floor lines on
# the front-left one. Both are what turn the box into a building at 58px.
s["detail"].append(poly([p(3.9, 6.0, 0.0), p(3.9, 6.0, 1.15), p(4.9, 6.0, 1.15), p(4.9, 6.0, 0.0)], close=False))
for w in (1.15, 2.1):
    s["detail"].append(poly([p(2.0, 2.4, w), p(2.0, 6.0, w)], close=False))
scenes["betrieb"] = s

# ---- 02 Temporäre Einsätze: a run of mobile site fencing and an OPEN route.
#
# Redrawn 2026-08-10 (client: "mejorame estos iconos"). The previous version was
# two rails on posts, which at 58px read as a pair of small tables. Mobile fencing
# with X-bracing is the one piece of equipment everybody recognises as "temporary,
# and it leaves again" — and the X is what survives at icon size, where a plain
# rail does not. Three panels in a run, not an enclosure: scene 01 is the closed
# one, and the contrast between them is the whole point of the pair.
s = {"line": [], "accent": [], "guide": [], "face": [], "detail": []}
FENCE_V, FENCE_H = 3.0, 2.2
for (u0, u1) in ((1.0, 3.6), (3.9, 6.5), (6.8, 9.4)):
    s["line"].append(poly([p(u0, FENCE_V), p(u0, FENCE_V, FENCE_H)], close=False))
    s["line"].append(poly([p(u1, FENCE_V), p(u1, FENCE_V, FENCE_H)], close=False))
    s["line"].append(poly([p(u0, FENCE_V, FENCE_H), p(u1, FENCE_V, FENCE_H)], close=False))
    s["line"].append(poly([p(u0, FENCE_V, 0.25), p(u1, FENCE_V, 0.25)], close=False))
    # the bracing
    s["line"].append(poly([p(u0, FENCE_V, 0.25), p(u1, FENCE_V, FENCE_H)], close=False))
    s["line"].append(poly([p(u0, FENCE_V, FENCE_H), p(u1, FENCE_V, 0.25)], close=False))
# The route runs in FRONT of the fence and is open at both ends, with end caps —
# a defined start and a defined end, i.e. a job with a date on it.
s["accent"].append(poly([p(0.6, 7.4), p(0.6, 5.0), p(9.8, 5.0), p(9.8, 7.4)], close=False))
for (u, v) in ((0.6, 7.4), (9.8, 7.4)):
    s["accent"].append(poly([p(u - 0.6, v - 0.6), p(u + 0.6, v + 0.6)], close=False))
scenes["temporaer"] = s

# ---- 03 Technik & Konzept: the plan, the object drawn on it, and the device
#      whose sight line lands on that object.
#
# Redrawn 2026-08-10 with the same brief as 02. Before, the camera was a small cube
# on a hairline mast and the plan was empty, so the scene was mostly cone. Now the
# plan carries the OBJECT the concept is written for, and the cone lands on it —
# which is the actual idea of this family: technology planned against a site, not
# technology on its own.
s = {"line": [], "accent": [], "guide": [], "face": [], "detail": []}
s["line"].append(plane(0.4, 0.4, 9.6, 7.6))                  # the plan sheet
# ⚠️ No centre-line grid. At 58px the dashes plus the object plus the cone turned
# the sheet into texture.
# ⚠️ The object is a low VOLUME, not a flat footprint. The footprint version shared
# two corners with the sight cone, so the two shapes merged into one and the scene
# read as a lamp over an empty plate. A solid also occludes the cone behind it,
# which is what puts the camera in front of the object rather than in it.
# Mast and a real camera body: a box with a lens stub aimed down at that object.
# Two units tall and drawn as a solid, so it reads as a device rather than a dot.
s["line"].append(poly([p(1.7, 1.7), p(1.7, 1.7, 3.6)], close=False))
s["face"] += box(4.6, 3.4, 8.2, 6.4, 1.4)                    # the object, occluding the cone
s["face"] += box(1.0, 1.0, 2.6, 2.6, 0.9, base=3.6)          # the camera body
# No separate lens stub: the cone leaves the same corner and already states the
# direction, so the stub was a second mark saying one thing.
# The cone lands wider than the object on both sides, so the two never share an
# edge and the coverage reads as covering something.
s["accent"].append(poly([p(2.6, 2.6, 3.6), p(9.2, 2.6), p(3.8, 7.2), p(1.7, 1.7, 3.6)]))
scenes["technik"] = s


def render(s, pad=1.6):
    import re
    nums = [float(n) for d in sum(s.values(), []) for n in re.findall(r"-?\d+\.?\d*", d)]
    xs, ys = nums[0::2], nums[1::2]
    x0, x1, y0, y1 = min(xs) - pad, max(xs) + pad, min(ys) - pad, max(ys) + pad
    vb = f"{x0:.2f} {y0:.2f} {x1 - x0:.2f} {y1 - y0:.2f}"
    parts = []
    # ⚠️ ORDER IS THE HIDDEN-LINE ALGORITHM, not a stylistic choice: guides and the
    # accent route go down first so a solid can occlude them, then the faces (which
    # are FILLED), and only then "detail" — anything drawn ON a face, like a door or
    # a floor line. Putting details in "line" hides them under the fills, which is
    # exactly what happened to scene 01's entrance on the first pass.
    for cls, key in (("lh-iso__guide", "guide"), ("lh-iso__accent", "accent"),
                     ("lh-iso__line", "line"), ("lh-iso__face", "face"),
                     ("lh-iso__line", "detail")):
        for d in s[key]:
            parts.append(f'<path class="{cls}" d="{d}"/>')
    return vb, parts


for name, s in scenes.items():
    vb, parts = render(s)
    print(f'--- {name}  viewBox="{vb}"  ({len(parts)} paths)')
    for pt in parts:
        print("  " + pt)
