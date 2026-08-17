"""Make a studio portrait's backdrop match the site's own background exactly.

Run once in development, like franken-map.py / city-outline.py — the output is
committed, this script is not part of any build.

    python3 docs/design-sources/portrait-key-backdrop.py

Why it exists: the client's portraits do not arrive on a consistent backdrop, and
a portrait sits on a black section, so any mismatch shows as a faint rectangle.
There are two cases and they need OPPOSITE treatments.

--------------------------------------------------------------------------------
CASE A — the backdrop is already DARK (the live path: BOTH portraits)
--------------------------------------------------------------------------------
Normalise the backdrop to --color-bg literally and ship it OPAQUE. Measured:
Alex.png's reachable backdrop is 0-6 and Walde.png's is 0-4, i.e. at most 5 and 3
levels of 255 away from #010101, and forcing those pixels to exactly 1 moves
nothing else by more than 4 levels. After this the photo's edge IS the section colour, so there
is no seam to see, by construction rather than by luck.

⚠️ DO NOT REACH FOR ALPHA HERE. It was tried and it is the wrong tool: dark hair
shares luminance with a black backdrop, so any key eats the hair. Composited over
black that is invisible (black hair over black reads correctly either way), which
is exactly what makes it a trap — the alpha map is broken and you cannot see it
on the page. Composite the result over MAGENTA to check: the hair came out full of
holes. So alpha buys no robustness, it just moves the failure somewhere worse.
The measured leak thresholds, if this ever comes up again: flood-filling black at
lum <= 4 leaks under 1 % into the body, at lum <= 6 it jumps to 5.3 %, because the
jacket's own median is 13.3 and its darkest folds reach 0.

--------------------------------------------------------------------------------
CASE B — the backdrop is LIGHT (kept for the next photo that arrives on grey)
--------------------------------------------------------------------------------
Not used by any current asset, but the knowledge was expensive. Key the backdrop
and composite onto --color-bg. Three things were derived by MEASURING and must be
re-measured for a different photo:

1. `neutral <= 6` — a grey backdrop is perfectly neutral (R=G=B) while a shirt is
   usually not, so neutrality separates them even where luminance overlaps.
2. Connectivity from the frame edge — a shirt enclosed by a jacket is unreachable
   from outside and therefore cannot be keyed whatever its luminance. This is the
   safety net; the threshold is only the second filter.
3. Hair gaps: the backdrop shows between strands but is NOT connected to the edge,
   so it survives the first pass as bright blobs. Fold it in by DISTANCE — measured
   at <=13px from the open backdrop, against >=215px for the nearest real highlight
   (shirt buttons, a jacket specular, teeth). An order of magnitude, so one test.

And the mistake it cost: alpha as a plain luminance ramp put a bright halo around
every hair strand. A fringe pixel at 230 over a 245 backdrop with ~90 hair behind
it is ~10 % opaque; the ramp called it ~69 % and left 60 % of the backdrop behind
as a visible outline. The fix is the real matting equation, a = (B - C) / (B - F),
with B and F estimated per-pixel by weighted blur (= smooth extrapolation from
each side). ⚠️ It is INVISIBLE at page size and obvious at 1:1 — always look at a
1:1 crop of the hair, never a thumbnail.
"""

import numpy as np
from PIL import Image
from scipy import ndimage

# Both portraits arrive from the client as 1122x1402 (exact 4:5) on a black backdrop.
# Keep the working originals on the Desktop, NOT in assets/ — build.js copies assets/
# verbatim, so an original dropped there is published at its own URL.
PORTRAITS = [
    ('/Users/maquesymonds/Desktop/Alex.png',  'assets/images/wk-contact-alexander-jaeger'),
    ('/Users/maquesymonds/Desktop/Walde.png', 'assets/images/uu-lead-steffen-walde'),
]
TARGET = np.array([1, 1, 1])   # --color-bg #010101
SEED_T = 2.0                   # backdrops measured 0-6; <=4 is the safe ceiling (see CASE A)
SIZES = (480, 960)             # largest frame is 480px, so 960 covers DPR 2


def normalise(src, out_stem):
    rgb = np.asarray(Image.open(src).convert('RGB')).astype(int)
    lum = rgb.astype(float).mean(2)

    # Only the black REACHABLE FROM THE FRAME EDGE. A dark suit hits the same values,
    # so connectivity is what keeps the silhouette intact — not the threshold.
    lab, _ = ndimage.label(lum <= SEED_T)
    keep = set(lab[0]) | set(lab[-1]) | set(lab[:, 0]) | set(lab[:, -1]); keep.discard(0)
    outside = np.isin(lab, list(keep))

    out = np.where(outside[..., None], TARGET, rgb).astype(np.uint8)
    print(f'\n{src.split("/")[-1]} -> {out_stem.split("/")[-1]}')
    print('  backdrop %.2f%% of the image | was min %d max %d | largest change %d levels of 255'
          % (100 * outside.mean(), rgb[outside].min(), rgb[outside].max(), abs(rgb[outside] - 1).max()))
    print('  subject untouched:', np.array_equal(out[~outside], rgb[~outside].astype(np.uint8)))

    full = Image.fromarray(out)
    for w in SIZES:
        im = full.resize((w, round(w * full.height / full.width)), Image.LANCZOS)
        im.save(f'{out_stem}-{w}.webp', 'WEBP', quality=90, method=6)
        if w == max(SIZES):
            im.save(f'{out_stem}-{w}.jpg', 'JPEG', quality=88, optimize=True, progressive=True)

    # Verify the flat backdrop SURVIVES the encode — a couple of levels of ringing here
    # would be the banding this whole script exists to remove.
    for f in [f'{out_stem}-{SIZES[0]}.webp', f'{out_stem}-{SIZES[1]}.webp', f'{out_stem}-{SIZES[1]}.jpg']:
        a = np.asarray(Image.open(f).convert('RGB')).astype(int)
        h, w = a.shape[:2]
        empty = np.concatenate([a[:, :int(w * .06)].reshape(-1, 3), a[:, int(w * .94):].reshape(-1, 3)])
        print(f'  {f.split("/")[-1]:38} {w}x{h}  backdrop min {empty.min()} max {empty.max()} std {empty.std():.2f}')


for src, stem in PORTRAITS:
    normalise(src, stem)
