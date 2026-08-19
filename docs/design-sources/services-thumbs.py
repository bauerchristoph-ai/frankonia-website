#!/usr/bin/env python3
"""
Regenerate the homepage Services-list thumbnails (assets/images/services-thumb/).

WHY THIS EXISTS
---------------
Those thumbnails only appear in the MOBILE services list (<1024px; desktop uses
the hover preview panel and never fetches them). They are 128x96 LANDSCAPE files
cropped from PORTRAIT sources (assets/images/<service>.webp, 820x~1220), so the
crop is baked into the file — `object-position` in CSS cannot move it, because
the rendered box (62x47) has the same 4:3 ratio as the file and `cover` therefore
crops nothing. Changing the framing means re-exporting. Hence this script.

THE 2026-08-19 CHANGE (client)
------------------------------
"las fotos de los servicios son verticales naturalmente, entonces quiero que las
alinees centradas en cuanto a arriba o abajo en mobile, porque veo que están
alineadas arriba y no se ve lo principal de la imagen … objektschutz está bien,
kaufhausdetektei está bien también, baustellenbewachung también, pero el resto
tienen que estar un poco más abajo".

He was right, and it was measurable: every one of the ten was cropped at
top = 60px of ~1220, i.e. **9.8% down** — effectively from the very top of the
portrait. Recovered by sliding a 820x615 window down each source, downscaling to
128x96 and taking the lowest MSE against the shipped file (best match 57-60px for
all ten, so this was one systematic choice, not per-photo art direction).

⚠️ THE CROPS BELOW CENTRE THE *SUBJECT*, NOT THE WINDOW, and that is a deliberate
reading of "centradas". A literal 0.50 was rendered and compared for all seven and
it CUTS HEADS in three of them (werkschutz and interventionsdienst lose the faces
entirely; revier-schliessdienst clips the man). 0.25-0.35 is what actually puts the
person and the FRANKONIA branding in frame, which is what "lo principal de la
imagen" means here. Every value was chosen off a rendered contact sheet at 2x the
real display size, never off the number.

⚠️ THE THREE THE CLIENT APPROVED ARE NOT IN THIS TABLE AND MUST NOT BE RE-EXPORTED:
objektschutz, kaufhausdetektei and baustellenbewachung keep their original 60px
crop. Re-running this script leaves them untouched.

Usage:  python3 docs/design-sources/services-thumbs.py
"""
from PIL import Image
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "assets/images"
OUT = ROOT / "assets/images/services-thumb"
TW, TH = 128, 96          # the shipped thumbnail size (rendered at 62x47 CSS px)
QUALITY = 82              # matches the ~2-3KB of the originals

# service -> vertical crop position as a fraction of the available travel
# (0 = top of the portrait, 1 = bottom). See the note above for how each was picked.
CROPS = {
    "werkschutz":            0.25,  # 0.35+ pushes the face against the top edge
    "brandwache":            0.35,  # group + "FRANKONIA EINSATZLEITUNG" both read
    "revier-schliessdienst": 0.35,  # man AND the branded vehicle in one frame
    "empfangsdienst":        0.35,  # the pointing gesture at the window
    "veranstaltungsschutz":  0.35,  # back of the guard, wordmark fully legible
    "sicherheitstechnik":    0.35,  # the camera centred; at 0.10 it was a corner detail
    "interventionsdienst":   0.25,  # keeps both guards' heads; 0.35 cuts them
}

for name, frac in CROPS.items():
    src = Image.open(SRC / f"{name}.webp").convert("RGB")
    w, h = src.size
    ch = int(round(w * TH / TW))            # full-width 4:3 window
    top = int(round((h - ch) * frac))
    thumb = src.crop((0, top, w, top + ch)).resize((TW, TH), Image.LANCZOS)
    dest = OUT / f"{name}.webp"
    thumb.save(dest, "WEBP", quality=QUALITY, method=6)
    print(f"{name:24s} frac={frac:.2f} top={top:4d}px  ->  {dest.stat().st_size/1024:.1f}KB")
