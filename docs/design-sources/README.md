# Design sources — kept for the record, deliberately NOT under `assets/`

`build.js` copies `assets/` into `dist/` wholesale, so anything in there ships to
the browser whether a page references it or not.

`konzept-cam-front-source.svg` / `konzept-cam-back-source.svg` (client-supplied,
2026-07-30) are the originals for the Layer-3 cameras. Each is an SVG wrapping one
embedded base64 PNG — 756 KB for the pair, with no vector geometry to gain from.
They were extracted, cropped to the region the SVG's `<pattern>` matrix actually
exposed, downscaled and palette-quantised into
`assets/images/konzept-cam-front.png` / `konzept-cam-back.png` (15 KB for the
pair), which is what `#konzept-cam-front` / `#konzept-cam-back` reference.

The back camera's blue top face is a real vector `<path>` layered over the bitmap
in the source — it is copied into the symbol by hand in
`partials/konzept-base.html`. Without it the camera renders with no blue.

Re-crop from these files if a camera ever needs re-exporting; don't move them
back into `assets/`.
