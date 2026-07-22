# Fonts

**Currently unused, 2026-07-17 —** the client switched the site's
typography to a system Helvetica/Arial stack (see `--font-family-base` in
`css/tokens.css`), so nothing loads or references this file anymore; no
`@font-face` declares it (removed from `css/base.css`) and it isn't
preloaded (removed from `partials/head-common.html`). Kept in place as a
spare rather than deleted, same pattern as other reverted-decision assets
in this repo (see `CLAUDE.md`) — if the client ever reverts to a
self-hosted webfont, re-add the `@font-face` block described below rather
than re-sourcing the file from scratch.

`open-sans-variable.woff2` — Open Sans, Google's official variable font,
"latin" subset only. Added 2026-07-15.

## Why one file, not two

`css/base.css` used to expect two separate static files
(`open-sans-regular-400.woff2` / `open-sans-extrabold-800.woff2`) — that
was the original plan, but neither file was ever actually added, so the
site had been silently rendering in the browser's system-font fallback
this whole time.

When fetching real Open Sans to fix that, Google served this subset as a
variable font (confirmed via `fontTools`: it has a real `wght` axis,
300–800) rather than fixed static instances. A single `@font-face` with
`font-weight: 300 800;` covers both weights this site actually uses
(400 body / 800 headings, see `--font-weight-regular`/`--font-weight-bold`
in `css/tokens.css`) from one file — fewer bytes, one HTTP request instead
of two. `format("woff2-variations")` in the `@font-face` `src` is what
tells the browser to treat it as a variable font rather than a single
fixed-weight file.

## About that unused 300 (Light)

The file technically supports weight 300 (Light) — the `wght` axis goes
down to 300 — but nothing in this codebase requests it, and no token in
`tokens.css` maps to it. **The client's CI guidelines specify exactly Open
Sans Regular (400) for body copy and Open Sans Extra Bold (800) for
headings — "no italic, no other weights."** Don't start using `font-weight:
300` anywhere based on "the file can already do it" — that's a design
decision for the client to confirm first, same as any other CI change.

## German character coverage

This is Google's "latin" subset (`unicode-range: U+0000-00FF, ...`), which
already covers German diacritics (ä, ö, ü, ß — all within U+00E4–U+00DF).
If this file is ever replaced from a different source, re-verify that
coverage explicitly before shipping — missing glyphs fall back to the
system font silently, per-character, which is easy to miss in a quick
visual check.

## License

Open Sans is licensed under the Apache License 2.0 — free to self-host
and use commercially, no attribution file required in the deployed site.

## If this ever needs to go back to two static files

Some older browsers don't support variable fonts (all current evergreen
browsers — this project's actual deploy target — do). If that ever
becomes a real constraint, re-derive two static instances (400 and 800)
from this same variable file with `fonttools varLib.instancer`, name them
`open-sans-regular-400.woff2` / `open-sans-extrabold-800.woff2`, and
restore the two-`@font-face` block this replaced (see git history). Simpler
than re-downloading from scratch.
