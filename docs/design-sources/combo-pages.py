#!/usr/bin/env python3
"""
Emit the fifteen remaining COMBO pages (service × city) — ONCE, in development.

WHY A GENERATOR AND NOT FIFTEEN HAND-WRITTEN FILES
--------------------------------------------------
docs/page-conventions.md §11 says a new combo page is "copy
/brandwache-nuernberg/ and change the copy". That is half true — every BLOCK the
fifteen need is already built — and it is also where the three failure modes of
this page type live, all three invisible in a screenshot:

  1. FAQ ↔ JSON-LD parity. Every answer exists twice, once visible and once
     inside the FAQPage graph, and they must stay byte-identical with markup
     stripped. Fifteen pages x 6 questions is 90 pairs to keep in step by hand.
  2. Seam colour. A pixel seam's tiles are the colour of the section ABOVE, and
     two adjacent same-colour sections take NO seam at all (§9.2). Every one of
     these drafts orders its sections differently — they say so themselves
     ("Struktur variiert", "Struktur-Variation: Prozess früh") — so the seam list
     is NOT transferable from /brandwache-nuernberg/. It is derived here.
  3. Price literals. Client rule G10: no price may be re-typed into a page. Every
     draft writes "26 bis 32 Euro" in prose, so the numbers are swapped for the
     {{price.*}} tokens the rest of the site uses, by one table, once.

⚠️ THIS IS A ONE-SHOT DEV TOOL, exactly like city-pages.py and service-pages.py.
It writes pages/<slug>.html and those files are then normal, hand-editable pages.
It is NOT part of `npm run build` and must never be re-run over a page that has
since been edited by hand — it would overwrite it. It is kept because it
documents where every line of these fifteen pages came from, and because a
sixteenth combo is a data entry rather than a file.

⚠️ /brandwache-nuernberg/ IS NOT IN HERE. It was hand-built on 2026-08-09 as the
type's first page and the client has revised it several times since. Running this
script cannot touch it.

Usage:  python3 docs/design-sources/combo-pages.py               # write all 15
        python3 docs/design-sources/combo-pages.py --check       # print only
        python3 docs/design-sources/combo-pages.py brandwache-fuerth

The `d` attribute of each hero outline comes from city-outline.py, which is run
per city and shelled out to, so the boundary data has exactly one home.
"""
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
PAGES = os.path.join(ROOT, "pages")
OUTLINE_SCRIPT = os.path.join(HERE, "city-outline.py")

sys.path.insert(0, HERE)
from combo_drafts import DRAFTS                                  # noqa: E402
from combo_pages_data import COMBOS, DARK, LIGHT                 # noqa: E402

BASE = "https://frankonia-sicherheit.de"

# --------------------------------------------------------------------------
# SURFACES — which block can sit on which, and why it is not a preference
# --------------------------------------------------------------------------
# hero    DARK  only  — the page's own black; the outline is a white/blue stroke.
# fields  LIGHT only  — .city-fields__num and the block's type colours use the
#                       deep blue mix §5 prescribes for light surfaces (4,88:1);
#                       on black it measures 4,32:1 and fails small text.
# why     LIGHT only  — .city-why__item is a WHITE elevated panel.
# steps   DARK  only  — .service-konzept* hardcodes white text.
# price   DARK        — for THIS page type only. The chassis' Preis-Box is a
#                       glossy black panel, which forces its section light
#                       everywhere else on the site; the combo type inverts it
#                       (dark section, white card — client 2026-08-10) and that
#                       is what lets these pages alternate all the way down.
#                       See css/page-combo.css's .combo-price note.
# faq     LIGHT only  — .faq__list--cards answers are rgb(59 73 86 / .8).
# form    DARK  only  — .conversion paints --color-bg itself.
# prose / points / scope   EITHER — fully token-driven.
ONLY = {"hero": DARK, "fields": LIGHT, "why": LIGHT, "steps": DARK,
        "faq": LIGHT, "form": DARK, "related": LIGHT, "price": DARK}


# --------------------------------------------------------------------------
# SMALL HELPERS
# --------------------------------------------------------------------------
def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def esc_attr(s):
    return esc(s).replace('"', "&quot;")


def json_str(s):
    return s.replace("\\", "\\\\").replace('"', '\\"')


def strip_tags(s):
    return re.sub(r"<[^>]+>", "", s)


def icon(name, cls="icon"):
    return f'<svg class="{cls}" aria-hidden="true"><use href="#{name}"></use></svg>'


ARROW = icon("icon-arrow-diagonal", "icon service-link__arrow")

# ⚠️ NO PRICE EVER APPEARS AS A LITERAL (client rule G10). The build FAILS on an
# unknown placeholder, so a typo in this table can never ship as literal text.
# The three ranges below are the ONLY ones in the fifteen drafts that match a
# token in content/values.json — every string was enumerated from the drafts
# first rather than guessed at.
# ⚠️ Two of them normalise "bis" to the token's en dash ("1.550 bis 1.900" →
# "1.550–1.900"): the same figure, and the alternative is leaving a hard-coded
# price behind for the annual update to miss.
PRICE_SUBS = [
    (re.compile(r"\bzwischen 26 und 32 Euro\b"),
     "zwischen {{price.min}} und {{price.max}} Euro"),
    (re.compile(r"\b26 bis 32 Euro\b"), "{{price.min}} bis {{price.max}} Euro"),
    # ⚠️ THE ONE PRICE THE DRAFT CONTRADICTS ITSELF ON. Webtext 45's Kosten
    # paragraph says "zwischen 25 und 35 Euro" while the same page's Preis-Box
    # renders {{price.range}} = 26-32, and every other combo says 26–32. A page
    # that states two different hourly rates is worse than either reading, so it
    # publishes the token — the same call the three service pages with this
    # defect already made. FLAGGED FOR CHRIS in CLAUDE.md.
    (re.compile(r"\bzwischen 25 und 35 Euro\b"),
     "zwischen {{price.min}} und {{price.max}} Euro"),
    (re.compile(r"\b5\.500[–-]6\.800 Euro\b"),
     "{{price.example.nightPostMonthly}} Euro"),
    (re.compile(r"\b5\.500 bis 6\.800 Euro\b"),
     "{{price.example.nightPostMonthly}} Euro"),
    (re.compile(r"\b1\.550[–-]1\.900 Euro\b"),
     "{{price.example.weekendTotal}} Euro"),
    (re.compile(r"\b1\.550 bis 1\.900 Euro\b"),
     "{{price.example.weekendTotal}} Euro"),
]

# ⚠️ NOT SUBSTITUTED, ON PURPOSE — two drafts give their own figure for a worked
# example that content/values.json also carries, and the two disagree:
#   Webtext 41 §6  "1.500 und 2.100 Euro"  vs example.weekendTotal 1.550–1.900
#   Webtext 43 §6  "4.000 und 6.000 Euro"  vs example.nightPostMonthly 5.500–6.800
# Tokenising them would silently change the client's number; neither contradicts
# anything else ON ITS OWN PAGE (the Preis-Box only states the hourly rate), so
# both are published verbatim and flagged for Chris. If he confirms they are
# loose wording, they become two more rows above.

# Every phone number becomes a tel: link (client rule G4). In a FAQ answer this
# changes the MARKUP and not the TEXT, so the JSON-LD copy — which is the same
# string with tags stripped — stays byte-identical after the build resolves both.
PHONE_RE = re.compile(r"\+49 951 964352-0")
PHONE_LINK = '<a href="{{phone.href}}">{{phone.display}}</a>'

# The drafts' own authoring notation for an internal link: " → /url/", either at
# the end of a line or between two sentences. It is an instruction to the
# builder, not copy.
TRAILING_LINK = re.compile(r"\s*→\s*(/[a-z0-9/-]+/)\s*$")
MID_LINK = re.compile(r"\s*→\s*(/[a-z0-9/-]+/)\s*")

# ⚠️ ANCHOR TEXT, NOT A URL. Where a draft ends a line with a bare "→ /url/" it is
# naming a destination, not writing the link's words — so each one gets the
# destination page's own name, which is the convention the city and service pages
# already use. Every URL that appears in the fifteen drafts is listed; an unknown
# one is a hard error rather than a URL silently becoming its own anchor text.
LINK_LABELS = {
    "/objektschutz/": "Alles zum Objektschutz",
    "/werkschutz/": "Alles zum Werkschutz",
    "/brandwache/": "Alles zur Brandwache",
    "/baustellenbewachung/": "Alles zur Baustellenbewachung",
    "/sicherheitstechnik/": "Sicherheitstechnik ansehen",
    "/sicherheitskonzept/": "So entsteht Ihr Sicherheitskonzept",
    "/kaufhausdetektei/": "Zur Kaufhausdetektei",
    "/ratgeber/brandwache-wann-vorgeschrieben/":
        "Wann eine Brandwache vorgeschrieben ist",
    # The sibling combo and city pages, named the way the drafts' own
    # Weiterführend lines name them.
    "/brandwache-nuernberg/": "Brandwache Nürnberg",
    "/brandwache-wuerzburg/": "Brandwache Würzburg",
    "/brandwache-erlangen/": "Brandwache Erlangen",
    "/brandwache-fuerth/": "Brandwache Fürth",
    "/objektschutz-nuernberg/": "Objektschutz Nürnberg",
    "/objektschutz-wuerzburg/": "Objektschutz Würzburg",
    "/objektschutz-fuerth/": "Objektschutz Fürth",
    "/sicherheitsdienst-nuernberg/": "Sicherheitsdienst Nürnberg",
    "/sicherheitsdienst-wuerzburg/": "Sicherheitsdienst Würzburg",
    "/sicherheitsdienst-erlangen/": "Sicherheitsdienst Erlangen",
    "/sicherheitsdienst-fuerth/": "Sicherheitsdienst Fürth",
}


def link_label(url):
    if url in LINK_LABELS:
        return LINK_LABELS[url]
    raise SystemExit(f"combo-pages: no label for {url} — add one to LINK_LABELS "
                     "rather than letting a URL become its own anchor text.")


def service_link(url, label=None):
    return (f'<a class="service-link" href="{url}">{esc(label or link_label(url))}'
            f"{ARROW}</a>")


def tokens(text):
    for pat, repl in PRICE_SUBS:
        text = pat.sub(repl, text)
    return text


def split_trailing_link(text):
    m = TRAILING_LINK.search(text)
    if not m:
        return text, None
    return text[:m.start()].rstrip(), m.group(1)


def pull_links(text):
    """Strip every ' → /url/' from a paragraph and return (text, [urls]).

    Used for prose, where two drafts put the notation BETWEEN sentences. The
    destination is not lost — it becomes the section's own .service-link."""
    urls = MID_LINK.findall(text)
    if urls:
        text = MID_LINK.sub(" ", text).strip()
        text = re.sub(r"\s+([,.;])", r"\1", text)
        text = re.sub(r"\s{2,}", " ", text)
    return text, urls


def split_item(line):
    """'Label: text' -> (num, 'Label', 'text'); a bare line -> (None, None, line).

    Only ever called on lines the mapping has ALREADY declared to be items —
    declaring the split is the whole point (see combo_drafts.py's header)."""
    m = re.match(r"^(?:(\d+)\s+)?([^:]{2,64}?):\s+(.+)$", line)
    if not m:
        return None, None, line
    return m.group(1), m.group(2).strip(), m.group(3).strip()


def body_split(c, s, all_prose=False):
    """The section's body, with `subs` applied and split into (prose, items).

    `prose: N` is DECLARED, never inferred — combo_drafts.py's header records what
    happened on the service pages when a heuristic tried. `all_prose` is for the
    prose block, whose whole body is paragraphs by definition."""
    lines = list(DRAFTS[c["url"]]["sections"][s["src"]]["body"])
    for find, repl in s.get("subs", []):
        hit = [i for i, l in enumerate(lines) if find in l]
        if len(hit) != 1:
            raise SystemExit(f"{c['url']} §{s['src']}: sub {find!r} matched "
                             f"{len(hit)} lines, expected exactly 1.")
        lines[hit[0]] = lines[hit[0]].replace(find, repl)
    if s.get("dotsplit"):
        if len(lines) != 1:
            raise SystemExit(f"{c['url']} §{s['src']}: dotsplit expects ONE "
                             f"line, got {len(lines)}.")
        lines = [p.strip() for p in lines[0].split(" · ")]
    n = len(lines) if all_prose else s.get("prose", 0)
    return lines[:n], lines[n:]


def sect(c, s):
    return DRAFTS[c["url"]]["sections"][s["src"]]


def sec_open(s, cls, extra=""):
    """The <section>, with .section--light and the nav-theme hook applied
    together — they always travel as a pair (js/main.js's initHeaderScrollTheme
    reads the attribute to flip the sticky header to its dark-text state)."""
    if s["surface"] == LIGHT:
        return (f'<section class="section section--light {cls}"'
                f' data-nav-theme="light"{extra}>')
    return f'<section class="section {cls}"{extra}>'


def intro(h2, lede_html=""):
    out = ['        <div class="section__intro">', f"          <h2>{esc(h2)}</h2>"]
    if lede_html:
        out.append(lede_html)
    out.append("        </div>")
    return "\n".join(out)


def paras(lines, cls=None):
    """Prose paragraphs in the draft's order. The first gets data-reveal +
    data-reveal-delay so it arrives just after its H2, like every intro on the
    template. Returns (html, [urls pulled out of the notation])."""
    out, urls = [], []
    for i, line in enumerate(lines):
        text, found = pull_links(tokens(line))
        urls += found
        text = PHONE_RE.sub(PHONE_LINK, esc(text))
        c = f' class="{cls}"' if cls else ""
        attr = " data-reveal data-reveal-delay" if i == 0 else ""
        out.append(f"          <p{c}{attr}>{text}</p>")
    return "\n".join(out), urls


def load_outline(slug):
    """Shell out to city-outline.py rather than caching a copy of the path here:
    the boundary data and the simplification tolerance both live in that script,
    so it stays a single source of truth."""
    # cwd=ROOT because city-outline.py opens its geojson by a repo-relative path.
    out = subprocess.run([sys.executable, OUTLINE_SCRIPT, slug], cwd=ROOT,
                         capture_output=True, text=True, check=True).stdout
    view = re.search(r'viewBox="([^"]+)"', out)
    path = re.search(r'<path class="city-map__area".*?(?:</path>|>)', out, re.S)
    if not (view and path):
        raise SystemExit(f"city-outline.py gave no path for {slug}")
    return view.group(1), path.group(0)


# --------------------------------------------------------------------------
# SECTION RENDERERS   ->  (surface, html)
# --------------------------------------------------------------------------
def r_hero(c, s):
    d = sect(c, s)
    view, path = load_outline(c["geo"])
    ticks = "\n".join(
        f"""            <li class="service-hero__point">
              {icon('icon-check', 'icon service-hero__point-icon')}
              {esc(t)}
            </li>""" for t in d["body"])
    stars = "\n".join("                  " + icon("icon-star") for _ in range(5))

    form_cta = ('<a class="btn btn--primary" href="#anfrage">Unverbindliches '
                'Angebot einholen<svg class="btn__arrow icon" aria-hidden="true">'
                '<use href="#icon-arrow-diagonal"></use></svg></a>')
    phone_pill = ('<a class="btn btn--secondary service-hero__phone" '
                  'href="{{phone.href}}">\n              '
                  + icon("icon-phone", "btn__icon icon")
                  + "\n              {{phone.display}}\n            </a>")
    phone_primary = ('<a class="btn btn--primary combo-hero__call" '
                     'href="{{phone.href}}">'
                     + icon("icon-phone", "btn__icon icon")
                     + "{{phone.display}}</a>")

    if c.get("notfall"):
        actions = f"            {phone_primary}\n            {form_cta}"
        cta_note = """
         ⚠️ THE PHONE IS THE PRIMARY CTA HERE, which inverts every other page on
         the site. It is the draft's explicit instruction ("CTA primär: Jetzt
         anrufen …") and client rule G2's ONE approved exception, scoped to
         Brandwache: this is the service people arrive at mid-incident, where a
         form promising an offer within one working day is the wrong first action.
         Do not "correct" it for consistency — the Objektschutz, Werkschutz and
         Baustellenbewachung combos DO lead with the form, and that difference is
         in their drafts too.
         The label is the NUMBER ALONE, without the draft's "Jetzt anrufen:"
         prefix (client 2026-08-10) — which is also what puts the pair on one row."""
    else:
        actions = f"            {form_cta}\n            {phone_pill}"
        cta_note = """
         Primary = the free-offer form, secondary = the phone pill: rule G2's
         default order. Only the Brandwache combos inverts it, on their drafts'
         own instruction."""

    return DARK, f"""    <!-- ============ {s['n']}. {esc(d['name']).upper()} ============ -->
    <!-- The draft's own Hero-Aufbau: badge → H1 → subline → double CTA →
         {len(d['body'])} ticks → trust band. .hero__lead / .hero__actions /
         .hero__reassurance / .hero__trust are LOAD-BEARING class names, not
         decoration — js/hero-reveal.js animates exactly those four blocks in that
         order, so this page needs no JS of its own (§4.1).
{cta_note}

         The badge says "Einsatzgebiet", never "Standort" — the UWG disclosure of
         §10.1, and the draft's own words.

         The trust band (Google rating + the two DEKRA seals) is not in the
         draft's Hero-Aufbau and is added here deliberately: this hero's ticks
         claim qualified, certified personnel and the seals are that claim's
         evidence. Same band the city page and /werkschutz/ carry, unchanged. -->
    <section class="service-hero city-hero combo-hero" data-hero-reveal>
      <div class="container service-hero__grid city-hero__grid">
        <div class="service-hero__content city-hero__content">
          <p class="city-hero__badge">
            {icon('icon-pin', 'icon city-hero__badge-icon')}
            {esc(d['badge'])}
          </p>

          <h1>{esc(d['h1'])}</h1>

          <p class="hero__lead service-hero__lead">
            {esc(d['subline'])}
          </p>

          <div class="hero__actions service-hero__actions">
{actions}
          </div>

          <!-- The draft's lines VERBATIM, so a stacked list rather than the
               homepage hero's row of chips: these are full sentences and need
               ~1000px in a row at this type size against the ~640px this column
               has. .city-hero__points turns the shared row into a column and
               supplies the align-items: flex-start the shared centred rule would
               otherwise apply horizontally (§10.4). -->
          <ul class="hero__reassurance service-hero__points city-hero__points">
{ticks}
          </ul>

          <div class="hero__trust service-hero__trust">
            <div class="review-card review-card--sm">
              <img class="review-card__logo" src="/assets/icons/google-icon.png" alt="Google" width="128" height="128" loading="lazy">
              <span class="review-card__stars">
                <span class="review-card__stars-track" aria-hidden="true">
{stars}
                </span>
                <span class="review-card__stars-fill review-card__stars-fill--94" aria-hidden="true">
{stars}
                </span>
              </span>
              <span class="review-card__score">
                <span class="review-card__value">{{{{rating.value}}}}</span>
                <span class="review-card__count">{{{{rating.count}}}} Bewertungen</span>
              </span>
            </div>

            <div class="service-hero__badges">
              <img class="service-hero__seal" src="/assets/icons/dekra-din-77200.png" alt="DEKRA-Zertifizierungssiegel: Sicherheitsdienstleistungen nach DIN 77200" width="399" height="600" loading="lazy">
              <img class="service-hero__seal" src="/assets/icons/dekra-iso-9001.png" alt="DEKRA-Zertifizierungssiegel: Qualitätsmanagement nach ISO 9001:2015" width="399" height="600" loading="lazy">
            </div>
          </div>
        </div>

        <!-- {esc(c['city'])}'S REAL ADMINISTRATIVE OUTLINE, as an inline path.
             Generated once in development by docs/design-sources/city-outline.py
             from assets/data/coverage-boundaries/{c['geo']}.geojson (OSM/Nominatim,
             July). Never hand-edit the coordinates; re-run the script.
             Why an outline and not a photo or a live map — §10.3: no city
             photography exists and the draft asks for none; an AREA is the honest
             visual for an Einsatzgebiet where a single pin would read as a branch
             office (§10.1); and as a path it costs zero requests and no
             third-party tiles.
             ⚠️ pathLength="1" IS LOAD-BEARING: the outline draws itself with a
             pure-CSS dash, and that attribute renormalises the perimeter to 1 so
             `stroke-dasharray: 1` is one exact lap at any size for any city. A
             path pasted in without it draws nothing at all.
             ⚠️ The guides are PERCENTAGES because every city's viewBox height
             differs; this one is {view.split()[3]}.
             ⚠⚠ width UND height SIND PFLICHT, nicht Zierde. Das CSS laesst
             beide Achsen auf auto (nur max-width/max-height); Chrome leitet die
             Groesse dann aus dem viewBox ab, Safari auf dem iPhone NICHT — dort
             fiel die Box auf null zusammen und der Umriss fehlte samt seinem
             Platz. Gemeldet am 02.09.2026, zweimal, und in Chrome nicht
             nachstellbar. Mit den Attributen hat das SVG eine intrinsische
             Groesse und ein Verhaeltnis, also loesen beide auto-Achsen in jeder
             Engine auf; max-* wirkt unveraendert weiter.
             -->
        <!-- ⚠️⚠️ DER HERO-UMRISS UND SEINE BESCHRIFTUNG KOMMEN SEIT DEM
             03.09.2026 NICHT MEHR VON HIER, sondern von
             docs/design-sources/stadt-im-kreis.mjs. Dieser Generator schreibt
             beides nur noch als PLATZHALTER; wer ihn laufen laesst, muss danach
                 node docs/design-sources/stadt-im-kreis.mjs --schreibe
             aufrufen, sonst steht hier ein Umriss ohne Landkreis.
             Grund: der Hero zeigt jetzt den Landkreis als umschliessende Form
             und die Stadt darin markiert (Kundenwunsch, mit einem
             Google-Maps-Bild von Landkreis Bamberg). Dafuer muessen BEIDE
             Formen mit demselben Faktor und demselben Ursprung projiziert
             werden — das kann nur eine Stelle, die beide Dateien kennt.
             ⚠️ Und: auf dieser Maschine laeuft kein Python, dieser Generator
             ist also ohnehin nicht ausfuehrbar. Die Logik steht deshalb in
             Node. -->
        <div class="city-hero__map" aria-hidden="true">
        <svg class="city-map" viewBox="{view}" width="{view.split()[2]}" height="{view.split()[3]}" fill="none" focusable="false">
            <line class="city-map__guide" x1="50%" y1="0" x2="50%" y2="100%"></line>
            <line class="city-map__guide" x1="0" y1="50%" x2="100%" y2="50%"></line>
            {path}
          </svg>
          <p class="city-map__label">Stadt {esc(c['name'])}</p>
        </div>
      </div>
    </section>"""


def r_fields(c, s):
    d = sect(c, s)
    prose, rows = body_split(c, s)
    icons = s["icons"]
    if len(icons) != len(rows):
        raise SystemExit(f"{c['url']} §{s['src']}: {len(rows)} items but "
                         f"{len(icons)} icons.")
    items = []
    for i, line in enumerate(rows):
        text, url = split_trailing_link(line)
        _, label, rest = split_item(text)
        if label is None:
            raise SystemExit(f"{c['url']} §{s['src']}: item has no 'Label: text' "
                             f"shape — {line[:60]!r}. Raise `prose`.")
        # ⚠️ THE LAST ITEM SPANS THE ROW when the count is odd. The grid is
        # two-column from 900px, so a third or fifth item would otherwise sit
        # alone under an empty column — the visible hole .city-fields__item--wide
        # exists to close.
        wide = " city-fields__item--wide" if len(rows) % 2 and i == len(rows) - 1 \
            else ""
        parts = [f'          <li class="city-fields__item{wide}">',
                 '            <svg class="icon combo-icon combo-fields__icon" '
                 'aria-hidden="true" data-svg-draw data-svg-draw-start="top 84%" '
                 f'data-svg-draw-end="top 44%"><use href="#{icons[i]}"></use></svg>',
                 f'            <h3 class="city-fields__title">{esc(label)}</h3>',
                 f"            <p>{esc(tokens(rest))}</p>"]
        if url:
            parts.append(f"            {service_link(url)}")
        parts.append("          </li>")
        items.append("\n".join(parts))

    lede, urls = paras(prose) if prose else ("", [])
    tail = ""
    for u in urls:
        tail += ('\n\n        <p class="city-fields__outro" data-reveal>'
                 f"{service_link(u)}</p>")

    return LIGHT, f"""    <!-- ============ {s['n']}. {esc(d['name']).upper()} ============ -->
    <!-- THE EIGENCONTENT SECTION — what stops this being {c['servicePage']} with a
         place name pasted in. {len(rows)} real local situations, every word the draft's.
         Rendered with the city page's own blocks (.city-fields*): the draft
         writes each one as "Titel: Satz", so the colon is the split and nothing
         is rewritten.
         ⚠️ A <ul>, not an <ol>: with the 01–0{len(rows)} numerals gone (client
         2026-08-10) these are a parallel SET, not a sequence, and an <ol> would
         keep telling assistive tech about an order the page no longer shows.
         ONE LINE ICON PER ITEM, at the block tier (44px), and it is the item's
         only marker. THE LINES DRAW THEMSELVES WITH THE SCROLL via the existing
         js/svg-draw.js — the same primitive /werkschutz/ uses, not a second
         implementation. Every glyph is already in the sprite; no new symbol was
         drawn for these pages, which is also why they read as one family. -->
    {sec_open(s, 'city-fields combo-fields')}
      <div class="container">
{intro(d['h2'], lede)}

        <ul class="city-fields__list" data-item-reveal="li">
{chr(10).join(items)}
        </ul>{tail}
      </div>
    </section>"""


def r_why(c, s):
    d = sect(c, s)
    _, rows = body_split(c, s)
    icons = s["icons"]
    if len(icons) != len(rows):
        raise SystemExit(f"{c['url']} §{s['src']}: {len(rows)} cards but "
                         f"{len(icons)} icons.")
    cards = []
    for i, line in enumerate(rows):
        _, label, rest = split_item(line)
        cards.append(f"""          <li class="city-why__item">
            {icon(icons[i], 'icon city-why__icon')}
            <h3 class="city-why__title">{esc(label)}</h3>
            <p>{esc(tokens(rest))}</p>
          </li>""")
    return LIGHT, f"""    <!-- ============ {s['n']}. {esc(d['name']).upper()} ============ -->
    <!-- The draft's {len(rows)} cards, verbatim. WHITE ELEVATED PANELS — .city-why*, the
         treatment the client approved for the city pages on 2026-08-09, with
         every value copied from .service-cases__card rather than re-derived so
         the two are one design in two files (§10.4).
         ⚠️ .city-why__grid--3: that block's ≥1100px rule is repeat(4, …) because
         a city page has four Warum blocks and every combo draft has THREE — left
         alone, the third card would sit in a row of four with a quarter of it
         empty.
         ⚠️ The hover uses `translate`, never `transform`: these carry
         data-item-reveal and GSAP writes `transform` INLINE, which beats any
         stylesheet rule. `translate` is a separate property and composes. -->
    {sec_open(s, 'city-why combo-why')}
      <div class="container">
{intro(d['h2'])}

        <ul class="city-why__grid city-why__grid--3" data-item-reveal="li">
{chr(10).join(cards)}
        </ul>
      </div>
    </section>"""


def r_steps(c, s):
    d = sect(c, s)
    prose, rows = body_split(c, s)
    icons = s["icons"]
    if len(icons) != len(rows):
        raise SystemExit(f"{c['url']} §{s['src']}: {len(rows)} steps but "
                         f"{len(icons)} icons.")
    steps = []
    for i, line in enumerate(rows):
        text, url = split_trailing_link(line)
        num, label, rest = split_item(text)
        if label is None:
            raise SystemExit(f"{c['url']} §{s['src']}: step has no 'Label: text' "
                             f"shape — {line[:60]!r}.")
        extra = f"\n            {service_link(url)}" if url else ""
        steps.append(f"""          <li class="service-konzept__step">
            <span class="service-konzept__num" aria-hidden="true">{num or i + 1:0>2}</span>
            {icon(icons[i], 'icon combo-icon combo-steps__icon')}
            <h3 class="combo-steps__title"><span class="combo-steps__mark">{esc(label)}</span></h3>
            <p class="service-konzept__text">{esc(tokens(rest))}</p>{extra}
          </li>""")

    lede, urls = paras(prose, cls="service-konzept__lede") if prose else ("", [])
    tail = ""
    for u in urls:
        tail += ('\n\n        <p class="service-konzept__proof" data-reveal>'
                 f"{service_link(u)}</p>")
    # The chassis' rail is wired for three columns; --4 / --5 exist for the other
    # counts (added with the nine service pages).
    mod = "" if len(rows) == 3 else f" service-konzept__steps--{len(rows)}"

    return DARK, f"""    <!-- ============ {s['n']}. {esc(d['name']).upper()} ============ -->
    <!-- The chassis' compact Sicherheitskonzept block (.service-konzept*), which
         docs/build-checklist.md counts on 11 pages and which was built generically
         for exactly this. data-steps-sequence hands it to js/steps-sequence.js:
         the node lands, its own copy rises under it, the connector draws on to the
         next.
         NO data-steps-draw — that hook is for /werkschutz/'s inline Figma artwork,
         and this draft's steps have no illustration. Without it the script's
         documented default applies and the steps simply land.
         ⚠️ data-no-text-reveal and the ABSENCE of data-item-reveal are both
         required: text-reveal.js only skips a subtree automatically when it sits
         inside [data-reveal]/[data-item-reveal], and two timelines on one element
         is what makes a reveal look broken.
         ⚠️ The <span> around each title is not decoration: .combo-steps__title is
         a FLEX ITEM of the step, and a flex item is blockified — `display: inline`
         on the h3 would compute to block and the highlight would span the whole
         column instead of hugging the words. Its fill sweeps from THIS timeline
         via data-steps-mark, so it is part of the step's one arrival. -->
    {sec_open(s, 'service-konzept combo-steps')}
      <div class="container service-konzept__inner">
{intro(d['h2'], lede).replace('class="section__intro"', 'class="section__intro service-konzept__intro"')}

        <ol class="service-konzept__steps{mod}" data-steps-sequence data-steps-mark=".combo-steps__mark" data-no-text-reveal>
{chr(10).join(steps)}
        </ol>{tail}
      </div>
    </section>"""


def r_points(c, s):
    d = sect(c, s)
    prose, rows = body_split(c, s)
    items = []
    for line in rows:
        text, url = split_trailing_link(line)
        _, label, rest = split_item(text)
        parts = ['          <li class="service-points__item">']
        if label:
            parts.append('            <h3 class="service-points__title">'
                         f"{esc(label)}</h3>")
        parts.append('            <p class="service-points__text">'
                     f"{esc(tokens(rest))}</p>")
        if url:
            parts.append(f"            {service_link(url)}")
        parts.append("          </li>")
        items.append("\n".join(parts))

    lede, urls = paras(prose) if prose else ("", [])
    extra = ""
    if s.get("hinweis") and d.get("hinweis_box"):
        # The draft's own Hinweis-Box, verbatim, as the section's one highlight
        # panel. Its trailing " → /url/" is the notation, so it becomes a real
        # link inside the panel.
        box, url = split_trailing_link(d["hinweis_box"])
        link = f"\n          {service_link(url)}" if url else ""
        extra = f"""

        <aside class="service-highlight" data-reveal>
          <p>{esc(tokens(box))}</p>{link}
        </aside>"""
    for u in urls:
        extra += ('\n\n        <p class="service-points__outro" data-reveal>'
                  f"{service_link(u)}</p>")

    cols = s.get("cols", len(rows))
    return s["surface"], f"""    <!-- ============ {s['n']}. {esc(d['name']).upper()} ============ -->
    <!-- The draft's {len(rows)} blocks, verbatim.
         RULED, NOT CARDED — §8.2. This page already has one carded block
         (.city-fields, or .city-why) and one elevated surface (the Preis-Box); a
         second grid of cards would compete with them. It also avoids
         re-publishing the 3,11:1 caveat .service-cases' blue cards carry, which
         would have landed here {len(rows)} more times for a section the draft never
         asked to be cards. -->
    {sec_open(s, 'service-points combo-points')}
      <div class="container">
{intro(d['h2'], lede)}

        <ul class="service-points__list service-points__list--{cols}" data-item-reveal="li">
{chr(10).join(items)}
        </ul>{extra}
      </div>
    </section>"""


def r_scope(c, s):
    d = sect(c, s)
    prose, rows = body_split(c, s)
    items = []
    for line in rows:
        text, url = split_trailing_link(line)
        _, label, rest = split_item(text)
        parts = ['          <li class="service-scope__item">',
                 "            " + icon("icon-check", "icon service-scope__tick"),
                 '            <div class="service-scope__body">']
        if label:
            parts.append('              <h3 class="service-scope__title">'
                         f"{esc(label)}</h3>")
        parts.append('              <p class="service-scope__text">'
                     f"{esc(tokens(rest))}</p>")
        if url:
            parts.append(f"              {service_link(url)}")
        parts += ["            </div>", "          </li>"]
        items.append("\n".join(parts))
    lede, _ = paras(prose) if prose else ("", [])

    return s["surface"], f"""    <!-- ============ {s['n']}. {esc(d['name']).upper()} ============ -->
    <!-- The draft's {len(rows)} groups, verbatim, as a tick list. Each group keeps its own
         label as the item title and its members as the draft wrote them, joined
         by the middle dots the draft itself uses — so nothing is re-punctuated
         into bullets that the client did not write.
         ⚠️ NOT `.service-flow` (the pinned 50/50 scrollytelling /werkschutz/ uses
         for its Leistungsumfang). That block needs SIX photographs and only
         Werkschutz has them; this page has none. -->
    {sec_open(s, 'service-scope combo-scope')}
      <div class="container">
{intro(d['h2'], lede)}

        <ul class="service-scope__list" data-item-reveal="li">
{chr(10).join(items)}
        </ul>
      </div>
    </section>"""


def r_prose(c, s):
    d = sect(c, s)
    prose, _ = body_split(c, s, all_prose=True)
    text, urls = paras(prose)
    if s.get("link"):
        urls.append(s["link"])
    tail = ""
    for u in dict.fromkeys(urls):
        tail += ('\n\n        <p class="service-points__outro" data-reveal>'
                 f"{service_link(u)}</p>")
    answer = ("\n         GEO: the H2 is the visitor's own question and the answer "
              "is the FIRST\n         sentence under it — the pattern CLAUDE.md "
              "requires, which the draft already\n         writes. Do not "
              "\"fix\" it into a short keyword title."
              if s.get("answer") else "")
    # ⚠️ THE PARAGRAPHS GO IN A SECOND `.section__intro`, NOT A DIV OF THEIR OWN.
    # That is the chassis' existing contract for this block — it is how the nine
    # service pages render `.service-prose` — and it is load-bearing, because THREE
    # rules that already exist in page-service.css key off it:
    #   .service-prose .section__intro      -> text-align: center
    #   .section__intro > p                 -> max-width: 42rem  AND  hyphens: none
    #   .service-prose .section__intro > p  -> margin-inline: auto
    # The first version of this renderer invented a `.service-prose__body` wrapper,
    # which escaped all three: the paragraphs ran the full container (96–152
    # characters per line), stayed left-aligned under a centred H2, and kept
    # base.css's `hyphens: auto`, so German compounds broke mid-word inside centred
    # text. Client reported it on 2026-08-17. Matching the chassis fixes all three
    # with no new CSS.
    return s["surface"], f"""    <!-- ============ {s['n']}. {esc(d['name']).upper()} ============ -->
    <!-- The draft's own copy, verbatim — an explanation rather than a list, so it
         renders as prose and not as invented bullets.{answer}
         ⚠️ The paragraphs sit in a SECOND `.section__intro`, which is the chassis'
         own contract for `.service-prose` (the nine service pages do the same). It
         is what gives them the centred alignment, the 42rem reading measure and
         `hyphens: none` — all three from rules that already exist. A wrapper of its
         own escapes all three. -->
    {sec_open(s, 'service-prose combo-prose')}
      <div class="container">
{intro(d['h2'])}

        <div class="section__intro">
{text}
        </div>{tail}
      </div>
    </section>"""


def r_price(c, s):
    d = sect(c, s)
    prose, _ = body_split(c, s, all_prose=True)
    answer, _ = paras(prose, cls="service-price__answer")
    return DARK, f"""    <!-- ============ {s['n']}. KOSTEN ============ -->
    <!-- ⚠️ DARK SECTION WITH A WHITE CARD, i.e. the inverse of every other Kosten
         block on the site. It is the combo type's own treatment (client
         2026-08-10, on /brandwache-nuernberg/) and it is what makes this page
         alternate all the way down: the chassis' Preis-Box is glossy BLACK, which
         forces its section light, which used to strand Warum + Kosten + FAQ as
         one three-section light run with no colour change in it (§11.2). Putting
         the black card back means putting that run back and deleting the two
         seams around this section. See .combo-price in css/page-combo.css.
         The white card is not a new surface either: the lead form two sections
         below is already a white card on this page's black, and every value comes
         from that card, so the two read as one system.

         The shared Preis-Box partial's `range` comes from content/values.json, so
         the annual rate change stays ONE edit across the ~27 pages that publish it
         (client rule G10).
         ⚠️ NO .service-price__factors list, and that follows the copy: this draft
         states its factors inside its own sentence rather than as a list, and
         splitting an approved sentence into bullets would be rewriting it. The
         Kosten grid places its items by column explicitly, so an absent factor
         list simply leaves its row empty.
         GEO shape, straight from the draft: question H2, the number in the first
         sentence. -->
    <section class="section service-price combo-price">
      <div class="container service-price__layout">
        <div class="section__intro service-price__intro">
          <h2>{esc(d['h2'])}</h2>
{answer}
        </div>

        <!-- include: price-box range="{{{{price.range}}}}" note="{esc_attr(c['priceNote'])}" -->
      </div>
    </section>"""


def faq_pairs(c, s):
    """Split each FAQ line at its first question mark — the drafts write one line
    per pair, so the question is everything up to and including the '?'."""
    out = []
    for line in DRAFTS[c["url"]]["sections"][s["src"]]["body"]:
        q, sep, a = line.partition("? ")
        if not sep:
            raise SystemExit(f"{c['url']}: FAQ line has no question mark — "
                             f"{line[:60]!r}")
        answer, url = split_trailing_link(a.strip())
        answer = PHONE_RE.sub(PHONE_LINK, esc(tokens(answer)))
        out.append((q + "?", answer, url))
    return out


def r_faq(c, s):
    d = sect(c, s)
    pairs = faq_pairs(c, s)
    items = "\n".join(
        f"""          <details class="faq-item">
            <summary><h3>{esc(q)}</h3></summary>
            <p class="faq-item__answer">{a}</p>
          </details>""" for q, a, _ in pairs)
    dropped = [u for _, _, u in pairs if u]
    note = ""
    if dropped:
        note = ("\n         The draft ends "
                + ("an answer" if len(dropped) == 1 else "some answers")
                + ' with a bare "→ ' + ", ".join(dict.fromkeys(dropped))
                + '", which is\n         authoring notation rather than copy. '
                "The destination is not lost — every one\n         of them is "
                "either in Weiterführend at the foot of this page or already a\n"
                "         link earlier in it.")
    return LIGHT, f"""    <!-- ============ {s['n']}. FAQ ============ -->
    <!-- The draft's {len(pairs)} combo-specific questions, verbatim, mirroring the FAQPage
         JSON-LD at the top of this file 1:1.{note}
         ⚠️ The visible copy and the schema copy must stay BYTE-IDENTICAL with
         markup stripped. They are generated from one source by
         docs/design-sources/combo-pages.py, so an edit here has to be made in
         BOTH places by hand. It is the one thing on this page type that is easy
         to break with a small edit and impossible to see.
         The phone numbers are real tel: links (client rule G4) — that changes the
         MARKUP and not the TEXT, so the schema copy stays identical. -->
    {sec_open(s, 'city-faq service-faq combo-faq')}
      <div class="container">
{intro(d['h2'])}

        <div class="faq__list faq__list--cards" data-item-reveal=".faq-item" data-item-reveal-strong>
{items}
        </div>
      </div>
    </section>"""


def r_form(c, s):
    d = sect(c, s)
    lede_src = d["body"][0]
    text, _ = pull_links(lede_src)
    ft = d.get("form_title", "")
    # On a Notfall page the draft's closing lede OPENS on the number, so it takes
    # the padded, non-wrapping treatment rather than the usual inline link.
    if c.get("notfall"):
        lede = PHONE_RE.sub(
            '<a class="combo-conversion__phone" href="{{phone.href}}">'
            "{{phone.display}}</a>", esc(text))
        alt = ""
        phone_note = """
         The phone comes FIRST, in the section lede, rather than in the usual
         "Lieber direkt sprechen?" line under the form — same inversion as the
         hero, same reason, and it is the draft's own order. It sits on the DARK
         section rather than inside the white card, so it is NOT the
         .conversion__form-alt link and needs none of that link's deep on-white
         mix: the base blue-light is 6,8:1 on this black. What it does need is a
         real hit area, hence .combo-conversion__phone."""
    else:
        lede = PHONE_RE.sub(PHONE_LINK, esc(text))
        alt = ('\n\n          <p class="conversion__form-alt">Lieber direkt '
               'sprechen? <a href="{{phone.href}}">{{phone.display}}</a></p>')
        phone_note = ""
    title_note = (f'\n         The draft\'s separate Formulartitel ("{esc(ft)}") '
                  "is not rendered as a\n         second heading: the section H2 "
                  "and the lede already say it, the same call\n         every "
                  "other page on the site made." if ft else "")
    return DARK, f"""    <!-- ============ {s['n']}. ABSCHLUSS-CTA (PRIMARY CONVERSION) ============ -->
    <!-- The shared lead-form partial with this page's own field prefix
         (`{c['prefix']}-`) — unique per page, or two forms in one document would
         break every <label for>.{title_note}{phone_note}
         The form still submits nowhere sitewide (action="#", native validation
         only) — docs/build-checklist.md Paso 4. -->
    <section id="anfrage" class="conversion">
      <div class="conversion__panel conversion__panel--form">
        <div class="section__intro conversion__intro">
          <h2>{esc(d['h2'])}</h2>
          <p class="conversion__intro-lede">{lede}</p>
        </div>

        <div class="conversion__form-wrap">
          <!-- include: lead-form prefix="{c['prefix']}" messageLabel="{esc_attr(c['messageLabel'])}" -->{alt}
        </div>
      </div>
    </section>"""


def r_related(c, s):
    """The draft's own Weiterführend line: 'Label → /url/ · Label → /url/'."""
    raw = sect(c, s).get("related")
    if not raw:
        raise SystemExit(f"{c['url']} §{s['src']}: no Weiterführend line.")
    rows = []
    for part in raw.split(" · "):
        label, sep, url = part.rpartition("→")
        if not sep:
            raise SystemExit(f"{c['url']}: Weiterführend part has no arrow — "
                             f"{part!r}")
        rows.append(f'              <li><a class="service-related__link" '
                    f'href="{url.strip()}"><span class="service-related__label">'
                    f"{esc(label.strip())}</span>"
                    f'<svg class="icon service-related__arrow" aria-hidden="true">'
                    f'<use href="#icon-arrow-diagonal"></use></svg></a></li>')
    return LIGHT, f"""    <!-- ============ {s['n']}. WEITERFÜHREND ============ -->
    <!-- The draft's own closing links, in its order and with its own labels: the
         service page first, the city page second. The chassis' .service-related*
         block, i.e. the same closing navigation /werkschutz/ ends on — ONE column
         here rather than two, because two links do not make two groups (see
         .combo-related in css/page-combo.css).
         ⚠️ {c['servicePage']} is a confirmed URL from guidelines §2.2 that is not
         built yet; linking confirmed-but-unbuilt URLs is this project's own
         convention (§8.3) and the page's conversion never depends on one.
         {c['cityPage']} is live and links back here. -->
    {sec_open(s, 'service-related combo-related')}
      <div class="container">
        <div class="section__intro">
          <h2>Weiterführend</h2>
        </div>

        <div class="service-related__cols">
          <div class="service-related__col">
            <ul class="service-related__list" data-item-reveal="li">
{chr(10).join(rows)}
            </ul>
          </div>
        </div>
      </div>
    </section>"""


RENDERERS = {"hero": r_hero, "fields": r_fields, "why": r_why, "steps": r_steps,
             "points": r_points, "scope": r_scope, "prose": r_prose,
             "price": r_price, "faq": r_faq, "form": r_form,
             "related": r_related}


# --------------------------------------------------------------------------
# PAGE ASSEMBLY
# --------------------------------------------------------------------------
SEAM_DARK = '    <div class="pixel-seam" data-pixel-seam aria-hidden="true"></div>'
SEAM_LIGHT = ('    <div class="pixel-seam pixel-seam--white" data-pixel-seam '
              'aria-hidden="true"></div>')


def build_page(c):
    for s in c["sections"]:
        must = ONLY.get(s["type"])
        if must and s["surface"] != must:
            raise SystemExit(f"{c['url']} §{s['n']}: {s['type']} must be {must}.")

    rendered = []
    for s in c["sections"]:
        surface, html = RENDERERS[s["type"]](c, s)
        rendered.append((s, surface, html))

    # SEAMS, DERIVED NOT TYPED. A seam's tiles are the colour of the section
    # ABOVE, so a dark→light boundary gets the default (black) tiles and a
    # light→dark one gets --white. Two adjacent sections of the SAME surface get
    # NO seam: tiles the colour of the section above would be invisible against
    # the one below (§9.2). This is computed precisely because every draft orders
    # its sections differently — /brandwache-nuernberg/'s seam list is not
    # transferable.
    body, seams = [], 0
    for idx, (s, surface, html) in enumerate(rendered):
        body.append(html)
        if idx + 1 < len(rendered):
            nxt = rendered[idx + 1][1]
            if nxt != surface:
                body.append(SEAM_LIGHT if surface == LIGHT else SEAM_DARK)
                seams += 1
            else:
                body.append(
                    f"    <!-- No seam: {s['type']} and "
                    f"{rendered[idx + 1][0]['type']} are both {surface} surfaces, "
                    "and tiles the colour of the section above would be invisible "
                    "against the one below (§9.2). -->")
    # The last section is followed by the footer, which is dark. Client rule G7
    # (2026-08-14) removed the seam before the footer sitewide.

    faq_s = next((s for s in c["sections"] if s["type"] == "faq"), None)
    entries = ",\n".join(
        f"""        {{
          "@type": "Question",
          "name": "{json_str(q)}",
          "acceptedAnswer": {{
            "@type": "Answer",
            "text": "{json_str(strip_tags(a))}"
          }}
        }}""" for q, a, _ in faq_pairs(c, faq_s))
    faq_ld = f""",
    {{
      "@type": "FAQPage",
      "@id": "{BASE}/{c['url']}/#faq",
      "mainEntity": [
{entries}
      ]
    }}"""

    canonical = f"{BASE}/{c['url']}/"
    title, desc = esc_attr(c["title"]), esc_attr(c["description"])
    surfaces = " ".join("▪" if sf == DARK else "▫" for _, sf, _ in rendered)

    return f"""<!DOCTYPE html>
<html lang="de">
<!-- COMBO PAGE — {c['service']} × {c['city']}. Built from
     NewVersionCopiesFrankonia/"{DRAFTS[c['url']]['docx']}"
     (Stand 25.07.2026), verbatim, in German.

     WHAT A COMBO PAGE IS: service × city, sixteen of them (4 services × 4
     cities). This is one of the fifteen that followed /brandwache-nuernberg/,
     the type's first page.

     ⚠️ UWG / "kein Scheinstandort" is the rule that governs this whole page type
     (docs/page-conventions.md §10.1). FRANKONIA has ONE address, in Bamberg, and
     a combo page may not imply a branch. It lands in three places here: the hero
     badge says "Einsatzgebiet", never "Standort"; the LocalBusiness JSON-LD
     carries the real Bamberg NAP with areaServed: {c['city']} and NO local
     address; and nothing on this page promises a response time or a travel
     distance (Prüfkatalog F10) — the draft's own wording is careful about that
     ("nach Absprache auch kurzfristig", never "in X Minuten"). Do not "improve"
     any of it into a speed or proximity claim.
{c.get('pageNote', '')}
     STRUCTURE IS THIS DRAFT'S OWN, not /brandwache-nuernberg/'s. All fifteen
     drafts say so in their own headers ("Struktur variiert", "Struktur-Variation:
     Prozess früh"), and they run 6–9 sections in four different shapes — which is
     also why the seam list below is DERIVED from the surface sequence rather than
     copied. Colour rhythm on this page: {surfaces}

     REUSE MODEL: every new class is `.combo-*`, never `.{c['url'].split('-')[0]}-*`,
     and the stylesheet stack is chassis → city layer → combo layer:
     css/page-service.css (inset, `main h2`, breadcrumb chevron, .section--light,
     .service-hero*, .service-konzept*, the whole Kosten block, .service-related*,
     .pixel-seam*) → css/page-city.css (the Einsatzgebiet badge, the two-column
     hero, the outline, the hero ticks, .city-fields*, .city-why*, and the phone
     rhythm under body.page-city) → css/page-combo.css. NONE of the three was
     touched to build this page.

     GENERATED ONCE by docs/design-sources/combo-pages.py, then hand-editable.
     ⚠️ If you edit the FAQ below, edit the FAQPage graph above it too — they must
     stay byte-identical with markup stripped. -->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Title ({len(c['title'])} chars) and description ({len(c['description'])}) are the draft's own —
       docs/page-conventions.md §12. -->
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <link rel="canonical" href="{canonical}">
  <link rel="alternate" hreflang="de" href="{canonical}">
  <link rel="alternate" hreflang="x-default" href="{canonical}">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:locale" content="de_DE">
  <meta property="og:site_name" content="FRANKONIA Sicherheitsdienst">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">

  <!-- Robots -->
  <meta name="robots" content="index,follow,max-image-preview:large">

  <!-- NO hero image preload: like the city page, this page has no photograph at
       all, so it has NO LCP image — nothing to preload, decode or compress. The
       hero's visual is an inline outline of {c['city']}'s administrative
       boundary, which costs zero requests. -->

  <script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@graph": [
    {{
      "@type": "Organization",
      "@id": "{BASE}/#organization",
      "name": "FRANKONIA Sicherheitsdienst GmbH & Co. KG",
      "url": "{BASE}/",
      "logo": {{
        "@type": "ImageObject",
        "url": "{BASE}/assets/icons/logo-wide-right-icon.png",
        "width": 800,
        "height": 83
      }}
    }},
    {{
      "@type": "LocalBusiness",
      "@id": "{BASE}/#localbusiness",
      "name": "FRANKONIA Sicherheitsdienst GmbH & Co. KG",
      "logo": "{BASE}/assets/icons/logo-wide-right-icon.png",
      "url": "{BASE}/",
      "telephone": "{{{{phone.display}}}}",
      "email": "{{{{email}}}}",
      "priceRange": "€€",
      "address": {{
        "@type": "PostalAddress",
        "streetAddress": "{{{{address.street}}}}",
        "postalCode": "{{{{address.postal}}}}",
        "addressLocality": "{{{{address.city}}}}",
        "addressRegion": "Bayern",
        "addressCountry": "DE"
      }},
      "geo": {{
        "@type": "GeoCoordinates",
        "latitude": 49.9019037,
        "longitude": 10.9067377
      }},
      "areaServed": {{
        "@type": "City",
        "name": "{c['city']}",
        "containedInPlace": {{ "@type": "AdministrativeArea", "name": "Bayern" }}
      }},
      "aggregateRating": {{
        "@type": "AggregateRating",
        "ratingValue": "4.7",
        "reviewCount": "{{{{rating.count}}}}",
        "bestRating": "5",
        "worstRating": "1"
      }},
      "parentOrganization": {{ "@id": "{BASE}/#organization" }}
    }},
    {{
      "@type": "Service",
      "@id": "{canonical}#service",
      "name": "{esc_attr(c['service'])} {esc_attr(c['city'])}",
      "serviceType": "{esc_attr(c['service'])}",
      "description": "{desc}",
      "provider": {{ "@id": "{BASE}/#localbusiness" }},
      "areaServed": {{
        "@type": "City",
        "name": "{c['city']}",
        "containedInPlace": {{ "@type": "AdministrativeArea", "name": "Bayern" }}
      }},
      "offers": {{
        "@type": "Offer",
        "priceCurrency": "EUR",
        "priceSpecification": {{
          "@type": "UnitPriceSpecification",
          "minPrice": "{{{{price.min}}}}",
          "maxPrice": "{{{{price.max}}}}",
          "priceCurrency": "EUR",
          "unitCode": "HUR"
        }}
      }}
    }}{faq_ld},
    {{
      "@type": "BreadcrumbList",
      "itemListElement": [
        {{
          "@type": "ListItem",
          "position": 1,
          "name": "Startseite",
          "item": "{BASE}/"
        }},
        {{
          "@type": "ListItem",
          "position": 2,
          "name": "Einsatzgebiete",
          "item": "{BASE}/einsatzgebiete/"
        }},
        {{
          "@type": "ListItem",
          "position": 3,
          "name": "Sicherheitsdienst {c['city']}",
          "item": "{BASE}{c['cityPage']}"
        }},
        {{
          "@type": "ListItem",
          "position": 4,
          "name": "{esc_attr(c['service'])}",
          "item": "{canonical}"
        }}
      ]
    }}
  ]
}}
  </script>

  <!-- include: head-common -->

  <!-- Shared, in cascade order (docs/page-conventions.md §9.1 and §11):
       lead-form → page-service.css (the CHASSIS) → page-city.css (the geo layer)
       → page-combo.css. -->
  <link rel="stylesheet" href="/css/lead-form.css">
  <link rel="stylesheet" href="/css/page-service.css">
  <link rel="stylesheet" href="/css/page-city.css">
  <link rel="stylesheet" href="/css/page-combo.css">

  <!-- The documented generic effect stack plus the two hooks this page type uses:
       js/steps-sequence.js (the Ablauf rail and its title highlight) and
       js/svg-draw.js (the Einsatzlagen icons drawing themselves).
       Nothing page-specific — docs/page-conventions.md §4.1. -->
  <script src="/assets/js/vendor/gsap.min.js" defer></script>
  <script src="/assets/js/vendor/ScrollTrigger.min.js" defer></script>
  <link rel="stylesheet" href="/css/vendor/lenis.css">
  <script src="/assets/js/vendor/lenis.min.js" defer></script>
  <script src="/js/smooth-scroll.js" defer></script>
  <script src="/js/hero-reveal.js" defer></script>
  <script src="/js/title-reveal.js" defer></script>
  <script src="/js/item-reveal.js" defer></script>
  <script src="/js/text-reveal.js" defer></script>
  <script src="/js/steps-sequence.js" defer></script>
  <script src="/js/svg-draw.js" defer></script>
  <script src="/js/pixel-transition.js" defer></script>
</head>
<!-- ⚠️ `page-city` IS NOT A LABEL. page-city.css's phone block — the 80px seam
     band with its matching reservations, the reduced section padding and the
     full-width hero CTAs — is scoped to `.page-city`, and this page type wants
     every one of those. `page-combo` carries the few overrides in
     css/page-combo.css. -->
<body class="page-city page-combo">
  <!-- include: icon-sprite -->
  <!-- include: header-de -->

  <main id="main">

    <!-- ============ BREADCRUMBS ============ -->
    <!-- Chevron separators, not slashes — §3. Four levels, matching the
         BreadcrumbList above: a combo page hangs off its CITY page, which is what
         makes the geo hierarchy legible to a crawler. The breadcrumb sits ABOVE
         the hero (unlike /werkschutz/, whose hero is a full-bleed photograph)
         because this hero has no photo. -->
    <nav class="breadcrumbs container" aria-label="Breadcrumb">
      <ol class="breadcrumbs__list">
        <li><a class="breadcrumbs__link" href="/">Startseite</a></li>
        <li class="breadcrumbs__sep" aria-hidden="true">
          <svg class="breadcrumbs__sep-icon" aria-hidden="true"><use href="#icon-chevron"></use></svg>
        </li>
        <li><a class="breadcrumbs__link" href="/einsatzgebiete/">Einsatzgebiete</a></li>
        <li class="breadcrumbs__sep" aria-hidden="true">
          <svg class="breadcrumbs__sep-icon" aria-hidden="true"><use href="#icon-chevron"></use></svg>
        </li>
        <li><a class="breadcrumbs__link" href="{c['cityPage']}">{esc(c['city'])}</a></li>
        <li class="breadcrumbs__sep" aria-hidden="true">
          <svg class="breadcrumbs__sep-icon" aria-hidden="true"><use href="#icon-chevron"></use></svg>
        </li>
        <li><span class="breadcrumbs__current" aria-current="page">{esc(c['service'])}</span></li>
      </ol>
    </nav>

{chr(10) + chr(10).join(body)}

  </main>

  <!-- include: footer-de -->
  <!-- include: whatsapp-button -->
</body>
</html>
""", seams, surfaces


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    check = "--check" in sys.argv
    for c in COMBOS:
        if args and c["url"] not in args:
            continue
        html, seams, surfaces = build_page(c)
        if not check:
            with open(os.path.join(PAGES, f"{c['url']}.html"), "w") as fh:
                fh.write(html)
        print(f"{c['url']:<32} {len(html):>7,} b  {seams} seams  "
              f"{len(c['sections'])} sec  {surfaces}")


if __name__ == "__main__":
    main()
