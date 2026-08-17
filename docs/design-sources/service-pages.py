#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Emit the nine remaining service pages from their Webtext copy — ONCE, in
development.

WHY A GENERATOR AND NOT NINE HAND-WRITTEN FILES
-----------------------------------------------
Same two reasons as city-pages.py, and they are the two failure modes of this
page type that are invisible in a screenshot:

  1. FAQ ↔ JSON-LD PARITY. Every answer exists twice — once visible, once inside
     the FAQPage graph — and the two must stay byte-identical with markup
     stripped. Nine pages × 5–6 questions is 46 pairs to keep in step by hand.

  2. SEAM COLOUR. A pixel seam's tiles are the colour of the section ABOVE it,
     and two adjacent same-colour sections take NO seam at all (§9.2). These nine
     drafts each order their sections differently — six of them say "Struktur
     bewusst variiert" in their own header — so /werkschutz/'s seam list is not
     transferable and the seams have to be derived per page.

Both are mechanical, so they are done mechanically: each FAQ is written once and
rendered into both places, and the seams are computed from the declared surfaces
rather than typed.

A third reason showed up while building: the copy itself. Nine drafts is roughly
19.000 words of German, and a transcription slip in a client's approved copy is
exactly the kind of defect no amount of measuring catches. So no word on these
pages was ever typed — service_drafts.py is machine-extracted from the .docx
files and this script only ever wraps it in markup.

⚠️ ONE-SHOT DEV TOOL, exactly like city-pages.py, city-outline.py and
franken-map.py. It writes pages/<slug>.html and those are then normal,
hand-editable pages. It is NOT part of `npm run build` and must never be re-run
over a page that has since been edited by hand — it would overwrite it. It is
kept because it documents where every line of these nine pages came from.

Usage:  python3 docs/design-sources/service-pages.py             # write all nine
        python3 docs/design-sources/service-pages.py --check     # print, write none
        python3 docs/design-sources/service-pages.py brandwache  # just one
"""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
PAGES = os.path.join(ROOT, "pages")

sys.path.insert(0, HERE)
from service_drafts import DRAFTS                      # noqa: E402
from service_pages_data import SERVICES, LINK_LABELS, AREA_SERVED  # noqa: E402

DARK, LIGHT = "dark", "light"
BASE = "https://frankonia-sicherheit.de"


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

# ⚠️ THE PRICE NEVER APPEARS AS A LITERAL (client rule G10, 2026-08-14: "all
# price values are adjusted once per year — the update must be a 5-minute content
# edit"). Every draft writes "zwischen 26 und 32 Euro" in prose, so the numbers
# are swapped back out for the tokens the rest of the site uses. The build FAILS
# on an unknown placeholder, so a typo here can never ship as literal text.
PRICE_SUBS = [
    (re.compile(r"\bzwischen 26 und 32 Euro\b"),
     "zwischen {{price.min}} und {{price.max}} Euro"),
    (re.compile(r"\b26 bis 32 Euro\b"), "{{price.min}} bis {{price.max}} Euro"),
    (re.compile(r"26–32 €"), "{{price.range}} €"),
    (re.compile(r"\(26–32 €\)"), "({{price.range}} €)"),
]

# The drafts' own authoring notation for an internal link: a trailing " → /url/"
# or an inline "(→ /url/)". It is an instruction to the builder, not copy — the
# same category as the "(Widget)" note already dropped from a city page. The
# trailing form becomes a real .service-link under the item; the inline form
# links the word it follows, which is always a place name.
TRAILING_LINK = re.compile(r"\s*→\s*(/[a-z0-9/-]+/)\s*$")
INLINE_LINK = re.compile(r"(\S+)\s*\(→\s*(/[a-z0-9/-]+/)\)")


def price_tokens(text):
    for pat, repl in PRICE_SUBS:
        text = pat.sub(repl, text)
    return text


def split_trailing_link(text):
    """-> (text without the arrow notation, url or None)."""
    m = TRAILING_LINK.search(text)
    if not m:
        return text, None
    return text[:m.start()].rstrip(), m.group(1)


def inline_links(text):
    """'… in Nürnberg (→ /brandwache-nuernberg/), …' -> a real anchor on the
    word. Applied to FAQ answers, where a trailing .service-link has nowhere to
    go and a raw URL in the prose would be worse than either."""
    return INLINE_LINK.sub(
        lambda m: f'<a href="{m.group(2)}">{m.group(1)}</a>', text)


def link_label(url):
    if url not in LINK_LABELS:
        raise SystemExit(f"no LINK_LABELS entry for {url} — add one so the same "
                         "destination is never named two different ways")
    return LINK_LABELS[url]


def service_link(url, label=None):
    return (f'<a class="service-link" href="{url}">{esc(label or link_label(url))}'
            f'{ARROW}</a>')


def split_item(line):
    """'Label: text' -> ('Label', 'text'); a bare line -> (None, line).

    Only ever called on lines the mapping has ALREADY declared to be items, so
    this does not have to guess — which is the whole point of declaring the split
    (see service_drafts.py's header for what happened when it did guess)."""
    m = re.match(r"^(?:(\d+)\s+)?([^:]{2,64}?):\s+(.+)$", line)
    if not m:
        return None, None, line
    return m.group(1), m.group(2).strip(), m.group(3).strip()


def body(svc_slug, src, section=None):
    return DRAFTS[svc_slug]["sections"][src].get("body", [])


def draft(svc_slug, src):
    return DRAFTS[svc_slug]["sections"][src]


def sec_open(s, cls, extra=""):
    """The section element, with .section--light and the nav-theme hook applied
    together — they always travel as a pair (js/main.js's initHeaderScrollTheme
    reads the attribute to flip the sticky header to its dark-text state).

    `centred: True` adds `.service-section--centred`, which centres the H2 and the
    intro paragraph and pulls the block in off the container edges. Per-section
    rather than per-block: the client is reviewing these nine pages one at a time
    and asks for it where it reads better, so it has to be declarable next to the
    section it applies to."""
    if s.get("centred"):
        cls += " service-section--centred"
    if s["surface"] == LIGHT:
        return (f'<section class="section section--light {cls}"'
                f' data-nav-theme="light"{extra}>')
    return f'<section class="section {cls}"{extra}>'


def intro(h2, lede_html="", cls=""):
    c = f' {cls}' if cls else ""
    out = [f'        <div class="section__intro{c}">',
           f"          <h2>{esc(h2)}</h2>"]
    if lede_html:
        out.append(lede_html)
    out.append("        </div>")
    return "\n".join(out)


def paras(lines, cls=None, delay_first=True):
    """Prose paragraphs, in the draft's order. The first gets data-reveal +
    data-reveal-delay so it arrives just after its H2, the way every intro
    paragraph on the template does."""
    out = []
    for i, l in enumerate(lines):
        c = f' class="{cls}"' if cls else ""
        attr = " data-reveal data-reveal-delay" if (i == 0 and delay_first) else ""
        out.append(f"          <p{c}{attr}>{esc(price_tokens(l))}</p>")
    return "\n".join(out)


# --------------------------------------------------------------------------
# SECTION RENDERERS   ->  (surface, html)
# --------------------------------------------------------------------------
def r_hero(svc, s):
    d = draft(svc["slug"], s["src"])
    ticks = "\n".join(
        f"""            <li class="service-hero__point">
              {icon('icon-check', 'icon service-hero__point-icon')}
              {esc(t)}
            </li>""" for t in d["body"])
    stars = "\n".join('                  ' + icon("icon-star") for _ in range(5))

    form_cta = ('<a class="btn btn--primary" href="#anfrage">Unverbindliches '
                'Angebot einholen'
                '<svg class="btn__arrow icon" aria-hidden="true">'
                '<use href="#icon-arrow-diagonal"></use></svg></a>')
    phone_cta = ('<a class="btn btn--secondary service-hero__phone" '
                 'href="{{phone.href}}">\n              '
                 + icon("icon-phone", "btn__icon icon")
                 + "\n              {{phone.display}}\n            </a>")
    if svc.get("ctaPhoneFirst"):
        # ⚠️ Brandwache only, and it is the draft's own instruction ("CTA primär:
        # Jetzt anrufen"), ratified as the single approved exception to client
        # rule G2. Someone reaching this page is usually mid-incident. The phone
        # becomes the PRIMARY button and the form the outline pill — do not
        # normalise this to match the other eight service pages.
        first = ('<a class="btn btn--primary" href="{{phone.href}}">'
                 + icon("icon-phone", "btn__icon icon")
                 + "Jetzt anrufen: {{phone.display}}</a>")
        second = ('<a class="btn btn--secondary" href="#anfrage">Unverbindliches '
                  'Angebot einholen'
                  '<svg class="btn__arrow icon" aria-hidden="true">'
                  '<use href="#icon-arrow-diagonal"></use></svg></a>')
        actions = f"            {first}\n            {second}"
        cta_note = ("The PHONE leads here, which inverts every other page on the "
                    "site.\n               That is the draft's own \"CTA primär: "
                    "Jetzt anrufen\" and the one\n               approved "
                    "exception to client rule G2 — right for the single service\n"
                    "               someone reaches in the middle of an incident.")
    else:
        actions = f"            {form_cta}\n            {phone_cta}"
        cta_note = ("Primary = the free-offer form, secondary = the phone: client "
                    "rule G2's\n               default order, and the label G3 "
                    "requires for a CTA pointing at a form.")

    return DARK, f"""    <!-- ============ 1. HERO ============ -->
    <!-- The draft's own Hero-Aufbau, nothing added or dropped: badge → H1 →
         subline → {len(d['body'])} ticks → double CTA → Google widget + DEKRA seals.
         {cta_note}

         TWO COLUMNS, not the full-bleed treatment /werkschutz/ uses, and the
         reason is the asset: the only photograph this service has is the
         portrait 820x{svc['photoH']} file that already feeds the homepage's services
         preview. A background hero would crop a portrait photo to a letterbox
         band, which is precisely why docs/page-conventions.md §8.2 prescribes the
         split hero for a vertical photo. The breadcrumb therefore sits ABOVE the
         hero (a bleed hero is the only case that pulls it inside).

         .hero__lead / .hero__actions / .hero__reassurance / .hero__trust are
         load-bearing class names, not decoration — js/hero-reveal.js animates
         exactly those four blocks in that order, so this page needs no JS of its
         own (docs/page-conventions.md §4.1). -->
    <section class="service-hero service-hero--split" data-hero-reveal>
      <div class="container service-hero__grid">
        <div class="service-hero__content">
          <!-- Hero badge, verbatim from the Webtext (client rule G9: the badge is
               whatever the document says it is). -->
          <p class="hero-badge">
            {icon('icon-shield-check')}
            {esc(d['badge'])}
          </p>

          <h1>{esc(d['h1'])}</h1>

          <p class="hero__lead service-hero__lead">
            {esc(d['subline'])}
          </p>

          <div class="hero__actions service-hero__actions">
{actions}
          </div>

          <!-- The draft's three hero lines, VERBATIM. They are full sentences, so
               this is the stacked list /jobs/ and the city pages use rather than
               the homepage's row of short chips — a row of three sentences needs
               roughly 1000px at this type size against the ~640px this column
               has. /werkschutz/ truncated its three into chips on an explicit
               client instruction; no such instruction covers these nine, so the
               sentences stay whole. -->
          <ul class="hero__reassurance service-hero__points">
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

        <!-- LCP element: preloaded in <head>, eager, high priority, and the
             aspect-ratio is this file's REAL height rather than a shared 4:5.
             Five of the nine service photos are 1217–1225px tall, not 1227, and a
             shared ratio leaves a strip of the frame's own background showing
             under the photo — the exact defect §8.2 records for the homepage's
             services preview ("some service images show a grey bar"). -->
        <figure class="service-hero__media" style="aspect-ratio: 820 / {svc['photoH']}">
          <picture>
            <source type="image/webp" srcset="/assets/images/{svc['slug']}.webp">
            <img src="/assets/images/{svc['slug']}.jpg" width="820" height="{svc['photoH']}" alt="{esc_attr(svc['photoAlt'])}" loading="eager" fetchpriority="high">
          </picture>
        </figure>
      </div>
    </section>"""


def r_points(svc, s):
    d = draft(svc["slug"], s["src"])
    lines = d["body"]
    n_prose = s.get("prose", 0)
    prose, rows = lines[:n_prose], lines[n_prose:]
    numbered = s.get("numbered")
    tag = "ol" if numbered else "ul"

    items = []
    for i, line in enumerate(rows):
        text, url = split_trailing_link(line)
        if s.get("titleless"):
            num, label, rest = None, None, text
        else:
            num, label, rest = split_item(text)
            if label is None:
                raise SystemExit(
                    f"{svc['slug']} §{s['src']}: declared an item but the line has "
                    f"no 'Label: text' shape — {line[:60]!r}. Either raise `prose` "
                    "or set titleless: True.")
        parts = ["          <li class=\"service-points__item\">"]
        if numbered:
            parts.append('            <span class="service-points__num" '
                         f'aria-hidden="true">{num or "%02d" % (i + 1)}</span>')
        if label:
            parts.append('            <h3 class="service-points__title">'
                         f"{esc(label)}</h3>")
        parts.append('            <p class="service-points__text">'
                     f"{esc(price_tokens(rest))}</p>")
        if url:
            parts.append(f"            {service_link(url)}")
        parts.append("          </li>")
        items.append("\n".join(parts))

    cols = s.get("cols", len(rows))
    lede = paras(prose) if prose else ""
    outro = ""
    if d.get("abbinder"):
        outro = ('\n\n        <p class="service-points__outro" data-reveal>'
                 f'{esc(price_tokens(d["abbinder"]))}</p>')
    tail = ""
    if s.get("link"):
        tail = ("\n\n        <p class=\"service-points__outro\" data-reveal>"
                f"{service_link(s['link'])}</p>")

    answer_note = ""
    if s.get("answer"):
        answer_note = """
         GEO: the H2 is the visitor's own question and the answer is the FIRST
         sentence under it, which is the pattern CLAUDE.md requires and the draft
         already writes. Do not "fix" it into a short keyword title."""

    return s["surface"], f"""    <!-- ============ {s['n']}. {esc(d['name'])} ============ -->
    <!-- The draft's {len(rows)} blocks, verbatim.{answer_note}

         RULED, NOT CARDED — docs/page-conventions.md §8.2: on a service page the
         Preis-Box is the only elevated surface. It also avoids re-publishing the
         3,11:1 caveat `.service-cases`' blue cards carry, which would have landed
         on this page {len(rows)} more times for a section the draft never asked to be
         cards. -->
    {sec_open(s, 'service-points')}
      <div class="container">
{intro(d['h2'], lede)}

        <{tag} class="service-points__list service-points__list--{cols}" data-item-reveal="li">
{chr(10).join(items)}
        </{tag}>{outro}{tail}
      </div>
    </section>"""


def r_scope(svc, s):
    d = draft(svc["slug"], s["src"])
    lines = d["body"]
    n_prose = s.get("prose", 0)
    prose, rows = lines[:n_prose], lines[n_prose:]

    items = []
    for line in rows:
        text, url = split_trailing_link(line)
        # ⚠️ `titleless` is not cosmetic. `split_item` gives a bold title to any
        # line that happens to contain a colon, and a draft's tick list is not
        # guaranteed to be uniform: /objektschutz/ §6 has four process lines of
        # which exactly ONE reads "Schriftliches Konzept: Personal, Zeiten,
        # Technik-Empfehlung". Rendered mixed, that one item became two lines tall
        # while its three siblings stayed one, so the two-column grid sized both
        # rows to the tall one and opened a ragged hole between them — which is
        # what the client saw. Declaring the section titleless renders all four
        # the same way, colon and all, exactly as the draft wrote them.
        num, label, rest = (None, None, text) if s.get("titleless") \
            else split_item(text)
        parts = ['          <li class="service-scope__item">',
                 "            " + icon("icon-check", "icon service-scope__tick"),
                 '            <div class="service-scope__body">']
        if label:
            parts.append('              <h3 class="service-scope__title">'
                         f"{esc(label)}</h3>")
        parts.append('              <p class="service-scope__text">'
                     f"{esc(price_tokens(rest))}</p>")
        if url:
            parts.append(f"              {service_link(url)}")
        parts += ["            </div>", "          </li>"]
        items.append("\n".join(parts))

    lede_lines = list(prose)
    if d.get("subline"):
        lede_lines.insert(0, d["subline"])
    lede = paras(lede_lines) if lede_lines else ""

    extra = ""
    if s.get("hinweis") and d.get("hinweis_box"):
        # The draft's Hinweis-Box, verbatim, as the section's one highlight panel.
        extra = f"""

        <aside class="service-highlight" data-reveal>
          <p>{esc(price_tokens(d['hinweis_box']))}</p>
        </aside>"""
    if s.get("highlight") and d.get("highlight"):
        title, _, rest = d["highlight"].partition(" — ")
        rest, url = split_trailing_link(rest or title)
        link = f"\n          {service_link(url)}" if url else ""
        extra = f"""

        <aside class="service-highlight" data-reveal>
          <h3 class="service-highlight__title">{esc(title)}</h3>
          <p>{esc(price_tokens(rest))}</p>{link}
        </aside>"""
    if s.get("link"):
        extra += ('\n\n        <p class="service-points__outro" data-reveal>'
                  f"{service_link(s['link'])}</p>")

    return s["surface"], f"""    <!-- ============ {s['n']}. {esc(d['name'])} ============ -->
    <!-- The draft's Häkchenliste, verbatim, as a two-column tick list.
         ⚠️ NOT `.service-flow` (the pinned 50/50 scrollytelling /werkschutz/ uses
         for the same section). That block needs SIX photographs per service and
         only Werkschutz has them; this page has one. The drafts describe this
         section as "H2 + Häkchenliste", which is what this is. -->
    {sec_open(s, 'service-scope')}
      <div class="container">
{intro(d['h2'], lede)}

        <ul class="service-scope__list" data-item-reveal="li">
{chr(10).join(items)}
        </ul>{extra}
      </div>
    </section>"""


def r_steps(svc, s):
    d = draft(svc["slug"], s["src"])
    lines = d["body"]
    n_prose = s.get("prose", 0)
    prose, rows = lines[:n_prose], lines[n_prose:]

    items = []
    for i, line in enumerate(rows):
        text, url = split_trailing_link(line)
        num, label, rest = split_item(text)
        parts = ['          <li class="service-konzept__step">',
                 '            <span class="service-konzept__num" aria-hidden="true">'
                 f'{num or (i + 1):0>2}</span>']
        if label:
            parts.append('            <h3 class="service-points__title">'
                         f"{esc(label)}</h3>")
        parts.append('            <p class="service-konzept__text">'
                     f"{esc(price_tokens(rest))}</p>")
        parts.append("          </li>")
        items.append("\n".join(parts))

    n = len(rows)
    mod = "" if n == 3 else f" service-konzept__steps--{n}"
    lede = paras(prose) if prose else ""
    actions = ""
    if d.get("cta"):
        actions = """

        <div class="service-konzept__actions" data-reveal>
          <a class="btn btn--primary" href="#anfrage">Unverbindliches Angebot einholen<svg class="btn__arrow icon" aria-hidden="true"><use href="#icon-arrow-diagonal"></use></svg></a>
        </div>"""

    return DARK, f"""    <!-- ============ {s['n']}. {esc(d['name'])} ============ -->
    <!-- The draft's {n} steps, verbatim, on the shared rail: one numeral and one
         node per step, the hairline between them drawn by js/steps-sequence.js as
         each step arrives.

         ⚠️ DARK SURFACE, and that is a constraint rather than a rhythm choice:
         `.service-konzept__text` hardcodes white-at-0.88 and the block's three
         Figma scenes carry a fixed white stroke, both stated in page-service.css.
         ⚠️ NO per-step artwork here — this draft supplies none, and inventing {n}
         scenes per page is not assembly. The numeral, the node and the rail carry
         the sequence, exactly as the mobile layout always has. -->
    <section class="section service-konzept">
      <div class="container service-konzept__inner">
{intro(d['h2'], lede, 'service-konzept__intro')}

        <ol class="service-konzept__steps{mod}" data-steps-sequence data-no-text-reveal>
{chr(10).join(items)}
        </ol>{actions}
      </div>
    </section>"""


def r_prose(svc, s):
    """H2 + paragraphs, optionally followed by a short points list and/or the
    draft's own highlight box. The shape several drafts use for a section that is
    an explanation rather than a list (the Abgrenzung, "Der erste Eindruck",
    "Anzug oder Montur?", "Das Problem")."""
    d = draft(svc["slug"], s["src"])
    lines = d["body"]
    n_points = s.get("points", 0)
    prose = lines[:len(lines) - n_points] if n_points else lines
    rows = lines[len(lines) - n_points:] if n_points else []

    items = ""
    if rows:
        li = []
        for line in rows:
            text, url = split_trailing_link(line)
            if s.get("titleless"):
                label, rest = None, text
            else:
                _, label, rest = split_item(text)
            parts = ['          <li class="service-points__item">']
            if label:
                parts.append('            <h3 class="service-points__title">'
                             f"{esc(label)}</h3>")
            parts.append('            <p class="service-points__text">'
                         f"{esc(price_tokens(rest))}</p>")
            if url:
                parts.append(f"            {service_link(url)}")
            parts.append("          </li>")
            li.append("\n".join(parts))
        items = (f"\n\n        <ul class=\"service-points__list "
                 f"service-points__list--{n_points}\" data-item-reveal=\"li\">\n"
                 + chr(10).join(li) + "\n        </ul>")

    # The draft's own boxed statement, under whichever label that draft used for
    # it — "Solution-Box (wörtlich)" on /empfangsdienst/, "Hinweis-Box
    # (Top-Solution wörtlich)" on /veranstaltungsschutz/. Both quote the client's
    # approved Top-Solution sentence, so both are rendered as the section's one
    # highlight panel rather than as another paragraph.
    highlight = ""
    boxed = (d.get("highlight") if s.get("highlight") else
             d.get("hinweis_box") if s.get("hinweisBox") else None)
    if boxed:
        title, _, rest = boxed.partition(": ")
        highlight = f"""

        <aside class="service-highlight" data-reveal>
          <h3 class="service-highlight__title">{esc(title)}</h3>
          <p>{esc(price_tokens(rest))}</p>
        </aside>"""

    answer_note = ("\n         GEO: H2 as the question, answer in the first two "
                   "sentences." if s.get("answer") else "")

    return s["surface"], f"""    <!-- ============ {s['n']}. {esc(d['name'])} ============ -->
    <!-- The draft's own copy, verbatim.{answer_note} -->
    {sec_open(s, 'service-prose')}
      <div class="container">
{intro(d['h2'])}

        <div class="section__intro">
{paras(prose)}
        </div>{items}{highlight}
      </div>
    </section>"""


def r_compare(svc, s):
    """The draft's two-column Vergleichstabelle as the two decision panels
    §8.2 prescribes — a <dl> per option, grouped BY OPTION, which is how someone
    choosing actually reads it, and which lets the page's own service carry more
    weight than a symmetric table ever could."""
    d = draft(svc["slug"], s["src"])
    b = d["body"]
    col_a, col_b = b[0], b[1]
    rows = [(b[i], b[i + 1], b[i + 2]) for i in range(2, len(b), 3)]

    def panel(title, idx, primary, ic, label):
        facts = "\n".join(
            f"""              <div class="service-panel__fact">
                <dt>{esc(crit)}</dt>
                <dd>{esc(price_tokens(vals[idx]))}</dd>
              </div>""" for crit, *vals in
            [(c, a, bb) for c, a, bb in rows])
        cls = "service-panel--primary" if primary else "service-panel--secondary"
        cta = ('<a class="btn btn--primary service-panel__cta" href="#anfrage">'
               'Unverbindliches Angebot einholen'
               '<svg class="btn__arrow icon" aria-hidden="true">'
               '<use href="#icon-arrow-diagonal"></use></svg></a>') if primary else \
              ('<a class="service-panel__cta service-panel__cta--quiet" '
               'href="/objektschutz/">Zum Objektschutz'
               + icon("icon-arrow-diagonal", "icon service-panel__cta-arrow")
               + "</a>")
        return f"""          <article class="service-panel {cls}">
            <p class="service-panel__label">
              {icon(ic, 'icon service-panel__icon')}
              {esc(label)}
            </p>
            <h3 class="service-panel__title">{esc(title)}</h3>

            <dl class="service-panel__facts">
{facts}
            </dl>

            {cta}
          </article>"""

    return s["surface"], f"""    <!-- ============ {s['n']}. {esc(d['name'])} ============ -->
    <!-- The draft's Vergleichstabelle, rendered as the two decision panels
         docs/page-conventions.md §8.2 prescribes rather than as a <table>: a
         table's row/column semantics are exactly what made this read as a
         spreadsheet, and a symmetric table cannot express that THIS page's
         service should carry more weight. Same four criteria, same values, same
         words — grouped by option instead of by criterion, which is how somebody
         choosing actually reads them.
         The distinction is never carried by colour alone (WCAG 1.4.1): the
         context label, the title and the icon each state it. -->
    {sec_open(s, 'service-compare')}
      <div class="container">
{intro(d['h2'])}

        <div class="service-compare__panels" data-item-reveal=".service-panel">
{panel(col_a, 0, True, 'icon-route', 'Kontrolle statt Anwesenheit')}

{panel(col_b, 1, False, 'icon-building', 'Durchgehende Präsenz')}
        </div>

        <aside class="service-decision" data-reveal>
          <div class="service-decision__text">
            <p>{esc(price_tokens(split_trailing_link(d['abbinder'])[0]))}</p>
          </div>
          <div class="service-decision__actions">
            <a class="btn btn--primary" href="#anfrage">Kostenfreie Einschätzung erhalten<svg class="btn__arrow icon" aria-hidden="true"><use href="#icon-arrow-diagonal"></use></svg></a>
          </div>
        </aside>
      </div>
    </section>"""


def r_price(svc, s):
    d = draft(svc["slug"], s["src"])
    lines = d["body"]
    n_prose = s.get("prose", 1)
    answer, factors = lines[:n_prose], lines[n_prose:]

    fl = "\n".join(f"          <li>{esc(price_tokens(f))}</li>" for f in factors)
    hint = ""
    if d.get("hinweis"):
        hint = f"""

        <p class="service-price__hint">
          {icon('icon-alert', 'icon service-price__hint-icon')}
          <span><strong>Hinweis:</strong> {esc(price_tokens(d['hinweis']))}</span>
        </p>"""

    rng = svc.get("priceRange", "{{price.range}}")
    params = [f'range="{esc_attr(rng)}"', f'note="{esc_attr(svc["priceNote"])}"',
              f'priceBoxTick1="{esc_attr(svc["priceTicks"][0])}"',
              f'priceBoxTick2="{esc_attr(svc["priceTicks"][1])}"']
    if svc.get("noOffers"):
        # Not priced by the hour: words instead of a figure, no "€/Std." unit,
        # and a label that does not promise a Spanne this page never states.
        params += ['priceBoxMod="service-price__box--text"',
                   'priceBoxUnit=""',
                   f'priceBoxLabel="{esc_attr(svc.get("priceLabel", "Ihre Kostenlogik"))}"']
    if svc.get("priceCta"):
        params += [f'priceBoxCta="{esc_attr(svc["priceCta"])}"',
                   f'priceBoxCtaHref="{esc_attr(svc["priceCtaHref"])}"']
    inc = "include: price-box " + " ".join(params)

    answer_html = "\n".join(
        f'          <p class="service-price__answer" data-reveal data-reveal-delay>'
        f"{esc(price_tokens(a))}</p>" for a in answer)

    note = ""
    if svc.get("noOffers"):
        note = """
         ⚠️ NO HOURLY RANGE IN THE BOX AND NO `offers` IN THE SCHEMA — the draft
         prices this service differently on purpose and says so, so a number here
         would be a claim the client did not make. -->
    <!--"""

    return s["surface"], f"""    <!-- ============ {s['n']}. KOSTEN ============ -->
    <!-- The block docs/build-checklist.md counts on 27 pages, reused verbatim.
         GEO pattern: question H2, the answer in the first sentence, then what
         moves it.{note}
         ⚠️ EVERY PRICE IS A TOKEN, never a literal (client rule G10): the draft
         writes "zwischen 26 und 32 Euro" and it is emitted as {{{{price.min}}}} /
         {{{{price.max}}}}, so the annual rate change stays one edit in
         content/values.json instead of 27 pages x 2 (visible + JSON-LD).
         DOM order is the design: intro → price → factors → Hinweis, which is the
         phone order, done in markup rather than with `order` so the tab order
         matches the screen (§7). -->
    {sec_open(s, 'service-price')}
      <div class="container service-price__layout">
        <div class="section__intro service-price__intro">
          <h2>{esc(d['h2'])}</h2>
{answer_html}
        </div>

        <!-- {inc} -->

        <ul class="service-price__factors" data-item-reveal>
{fl}
        </ul>{hint}
      </div>
    </section>"""


def r_contact(svc, s):
    d = draft(svc["slug"], s["src"])
    return DARK, f"""    <!-- ============ {s['n']}. TRUST / ANSPRECHPARTNER ============ -->
    <!-- ✅ SETTLED BY THE CLIENT (2026-08-13, Q2: "Keep it — always. The Alexander
         Jäger contact section stays on every page where the documents specify
         it"). This draft's Trust section names him, so the page carries the full
         contact block; the drafts that do not name him get the certification
         strip instead, which is the same decision applied honestly rather than
         a photo added everywhere.

         ⚠️ DARK SURFACE, twice over: the certs panel is a 6 %-white tint, and the
         portrait's backdrop is normalised to #010101 exactly so its edge IS the
         page colour. A light-section version means re-running
         docs/design-sources/portrait-key-backdrop.py with a different target
         colour, NOT a CSS override.

         ⚠️ The phone and e-mail actions are FRANKONIA's real published details
         (they are already on /werkschutz/ and in content/values.json), but THIS
         draft's Trust paragraph does not repeat them — only Objektschutz's does.
         They are included because a contact block whose purpose is contact
         without a way to make contact is worse than either option. Worth one
         confirmation with Chris. -->
    <section class="section service-contact">
      <div class="container service-contact__layout">
        <div class="section__intro service-contact__intro">
          <h2>{esc(d['h2'])}</h2>
        </div>

        <figure class="service-contact__portrait" data-reveal>
          <picture>
            <source type="image/webp" srcset="/assets/images/wk-contact-alexander-jaeger-480.webp 480w, /assets/images/wk-contact-alexander-jaeger-960.webp 960w" sizes="(min-width: 900px) 30rem, min(48vw, 14rem)">
            <img src="/assets/images/wk-contact-alexander-jaeger-960.jpg" srcset="/assets/images/wk-contact-alexander-jaeger-960.jpg 960w" sizes="(min-width: 900px) 30rem, min(48vw, 14rem)" width="960" height="1200" alt="Alexander Jäger, Vertriebsleiter und Sicherheitsbeauftragter bei FRANKONIA" loading="lazy">
          </picture>
        </figure>

        <div class="service-contact__person">
          <p class="service-contact__name">Alexander Jäger</p>
          <p class="service-contact__role">Vertriebsleiter und Sicherheitsbeauftragter</p>
          <p class="service-contact__body">{esc(price_tokens(inline_links(d['body'][0])))}</p>

          <div class="service-contact__actions">
            <a class="service-contact__action service-contact__action--phone" href="{{{{phoneJaeger.href}}}}">
              {icon('icon-phone')}
              {{{{phoneJaeger.display}}}}
            </a>
            <a class="service-contact__action service-contact__action--mail" href="mailto:{{{{emailJaeger}}}}">
              {icon('icon-mail')}
              {{{{emailJaeger}}}}
            </a>
          </div>
        </div>

        <div class="service-contact__certs" data-reveal>
          <h3 class="service-contact__certs-title">Dahinter steht ein zertifiziertes System</h3>

          <div class="service-contact__seals">
            <img class="service-contact__seal" src="/assets/icons/dekra-din-77200.png" alt="DEKRA-Zertifizierungssiegel: Sicherheitsdienstleistungen nach DIN 77200" width="399" height="600" loading="lazy">
            <img class="service-contact__seal" src="/assets/icons/dekra-iso-9001.png" alt="DEKRA-Zertifizierungssiegel: Qualitätsmanagement nach ISO 9001:2015" width="399" height="600" loading="lazy">
          </div>

          <ul class="service-contact__certs-list">
            <li><strong>DIN 77200-1</strong><span>für stationäre Sicherheitsdienste</span></li>
            <li><strong>DIN EN ISO 9001</strong><span>seit 2016, geprüft durch die DEKRA</span></li>
            <li><strong>§ 34a GewO</strong><span>ausschließlich IHK-qualifizierte Kräfte</span></li>
          </ul>
        </div>
      </div>
    </section>"""


def r_certs(svc, s):
    d = draft(svc["slug"], s["src"])
    return s["surface"], f"""    <!-- ============ {s['n']}. TRUST ============ -->
    <!-- The draft's Trust paragraph, verbatim, over the SHARED certification
         strip (`.trust-certs*`, the chassis block /referenzen/, /ueber-uns/ and
         /sicherheitskonzept/ all use). It is fully token-driven, so it works on
         either surface.
         ⚠️ NOT the `.service-contact` block with Alexander Jäger's portrait: this
         draft's Trust section does not name him, and adding a named contact the
         document did not ask for would be inventing a person into the page. The
         four drafts that DO name him get that block instead — client Q2,
         2026-08-13, applied as written. -->
    {sec_open(s, 'service-trust')}
      <div class="container">
{intro(d['h2'])}

        <div class="section__intro">
{paras([inline_links(d['body'][0])])}
        </div>

        <div class="trust-certs" data-reveal>
          <div class="trust-certs__seals">
            <img class="trust-certs__seal" src="/assets/icons/dekra-din-77200.png" alt="DEKRA-Zertifizierungssiegel: Sicherheitsdienstleistungen nach DIN 77200" width="399" height="600" loading="lazy">
            <img class="trust-certs__seal" src="/assets/icons/dekra-iso-9001.png" alt="DEKRA-Zertifizierungssiegel: Qualitätsmanagement nach ISO 9001:2015" width="399" height="600" loading="lazy">
          </div>
          <ul class="trust-certs__list">
            <li>
              <strong>DIN 77200-1</strong>
              für stationäre Sicherheitsdienstleistungen
            </li>
            <li>
              <strong>DIN EN ISO 9001</strong>
              zertifiziert, DEKRA-geprüft
            </li>
            <li>
              <strong>§ 34a GewO</strong>
              ausschließlich IHK-qualifizierte Kräfte
            </li>
          </ul>
        </div>
      </div>
    </section>"""


def faq_pairs(svc, s):
    """Split each FAQ line at its first question mark. The drafts write one line
    per pair, so the question is everything up to and including the '?'."""
    out = []
    for line in draft(svc["slug"], s["src"])["body"]:
        q, sep, a = line.partition("? ")
        if not sep:
            raise SystemExit(f"{svc['slug']}: FAQ line has no question mark — "
                             f"{line[:60]!r}")
        answer, url = split_trailing_link(a.strip())
        out.append((q + "?", price_tokens(inline_links(answer)), url))
    return out


def r_faq(svc, s):
    d = draft(svc["slug"], s["src"])
    pairs = faq_pairs(svc, s)
    items = "\n".join(
        f"""          <details class="faq-item">
            <summary><h3>{esc(q)}</h3></summary>
            <p class="faq-item__answer">{a}</p>
          </details>""" for q, a, _ in pairs)
    dropped = [u for _, _, u in pairs if u]
    note = ""
    if dropped:
        note = ("\n         The draft ends " + ("an answer" if len(dropped) == 1
                else "some answers") + " with a bare \"→ " + ", ".join(dropped) +
                "\", which is\n         authoring notation rather than copy. The "
                "destination is not lost — it is in\n         Verwandte Leistungen "
                "at the foot of this page.")
    return LIGHT, f"""    <!-- ============ {s['n']}. FAQ ============ -->
    <!-- The draft's {len(pairs)} questions and answers, verbatim, mirroring the FAQPage
         JSON-LD at the top of this file 1:1.{note}
         ⚠️ The visible copy and the schema copy must stay BYTE-IDENTICAL with
         markup stripped. They are generated from one source by
         docs/design-sources/service-pages.py, so an edit here has to be made in
         BOTH places by hand. It is the one thing on this page type that is easy
         to break with a small edit and impossible to see. -->
    <section class="section section--light service-faq" data-nav-theme="light">
      <div class="container">
        <div class="section__intro">
          <h2>{esc(d['h2'])}</h2>
        </div>

        <div class="faq__list faq__list--cards" data-item-reveal=".faq-item" data-item-reveal-strong>
{items}
        </div>
      </div>
    </section>"""


def r_form(svc, s):
    d = draft(svc["slug"], s["src"])
    lede = d["body"][0]
    ft = d.get("form_title", "")
    title_note = (f'\n         The draft\'s separate Formulartitel ("{esc(ft)}") is '
                  "not rendered as a\n         second heading: the section H2 "
                  "already says it, the same call /werkschutz/\n         and the "
                  "city pages made." if ft else "")
    inc = f'include: lead-form prefix="{svc["prefix"]}" messageLabel="{esc_attr(svc["messageLabel"])}"'
    return DARK, f"""    <!-- ============ {s['n']}. ABSCHLUSS-CTA (PRIMARY CONVERSION) ============ -->
    <!-- The shared lead-form partial with this page's own field prefix — unique
         per page, or two forms in one document would break every <label for>.{title_note}
         The form still submits nowhere sitewide (action="#", native validation
         only) — docs/build-checklist.md Paso 4. -->
    <section id="anfrage" class="conversion">
      <div class="conversion__panel conversion__panel--form">
        <div class="section__intro conversion__intro">
          <h2>{esc(d['h2'])}</h2>
          <p class="conversion__intro-lede">{esc(price_tokens(split_trailing_link(lede)[0]))}</p>
        </div>

        <div class="conversion__form-wrap">
          <!-- {inc} -->

          <p class="conversion__form-alt">Lieber direkt sprechen? <a href="{{{{phone.href}}}}">{{{{phone.display}}}}</a></p>
        </div>
      </div>
    </section>"""


def r_related(svc, s):
    cols = []
    for title, links in s["groups"]:
        li = "\n".join(
            f'              <li><a class="service-related__link" href="{u}">'
            f'{esc(l)}<svg class="icon service-related__arrow" aria-hidden="true">'
            f'<use href="#icon-arrow-diagonal"></use></svg></a></li>'
            for u, l in links)
        cols.append(f"""          <div class="service-related__col">
            <h3 class="service-related__title">{esc(title)}</h3>
            <ul class="service-related__list" data-item-reveal="li">
{li}
            </ul>
          </div>""")
    return LIGHT, f"""    <!-- ============ {s['n']}. VERWANDTE SEITEN ============ -->
    <!-- The draft's own internal-link list. Several destinations are not built
         yet; the URLs are the confirmed ones from guidelines §2.2, so these are
         real links to pages still to come, not placeholders — the same
         convention /werkschutz/ and the city pages already follow.
         ⚠️ `.service-related__cols` / `__col`, NOT `__grid`: that second variant
         appears on /sicherheitskonzept/ and has no CSS rule anywhere, so it falls
         back to block layout. Do not copy it. -->
    <section class="section section--light service-related" data-nav-theme="light">
      <div class="container">
        <div class="section__intro">
          <h2>Verwandte Leistungen und Einsatzgebiete</h2>
        </div>

        <div class="service-related__cols">
{chr(10) + chr(10).join(cols)}
        </div>
      </div>
    </section>"""


RENDERERS = {"hero": r_hero, "points": r_points, "scope": r_scope,
             "steps": r_steps, "prose": r_prose, "compare": r_compare,
             "price": r_price, "contact": r_contact, "certs": r_certs,
             "faq": r_faq, "form": r_form, "related": r_related}


# --------------------------------------------------------------------------
# PAGE ASSEMBLY
# --------------------------------------------------------------------------
SEAM_DARK = '    <div class="pixel-seam" data-pixel-seam aria-hidden="true"></div>'
SEAM_LIGHT = ('    <div class="pixel-seam pixel-seam--white" data-pixel-seam '
              'aria-hidden="true"></div>')


def build_page(svc):
    rendered = []
    for s in svc["sections"]:
        surface, html = RENDERERS[s["type"]](svc, s)
        rendered.append((s, surface, html))

    # Seams. Tiles are the colour of the section ABOVE, so a dark→light boundary
    # gets the default (black) tiles and a light→dark one gets --white. Two
    # adjacent sections of the SAME surface get NO seam: tiles the colour of the
    # section above would be invisible against the one below (§9.2). Derived
    # rather than typed precisely because every draft orders its sections
    # differently — /werkschutz/'s seam list is not transferable.
    body_html, seams = [], 0
    for idx, (s, surface, html) in enumerate(rendered):
        body_html.append(html)
        if idx + 1 < len(rendered):
            nxt = rendered[idx + 1][1]
            if nxt != surface:
                body_html.append(SEAM_LIGHT if surface == LIGHT else SEAM_DARK)
                seams += 1
            else:
                body_html.append(
                    f"    <!-- No seam: {s['type']} and "
                    f"{rendered[idx + 1][0]['type']} are both {surface} surfaces, "
                    "and tiles the colour of the section above would be invisible "
                    "against the one below (§9.2). -->")
    # No seam before the footer: client rule G7, 2026-08-14 — the last section is
    # almost always dark and so is the footer, so that edge separated nothing.

    faq_s = next((s for s in svc["sections"] if s["type"] == "faq"), None)
    faq_ld = ""
    if faq_s:
        entries = ",\n".join(
            f"""        {{
          "@type": "Question",
          "name": "{json_str(q)}",
          "acceptedAnswer": {{
            "@type": "Answer",
            "text": "{json_str(strip_tags(a))}"
          }}
        }}""" for q, a, _ in faq_pairs(svc, faq_s))
        faq_ld = f""",
    {{
      "@type": "FAQPage",
      "@id": "{BASE}/{svc['slug']}/#faq",
      "mainEntity": [
{entries}
      ]
    }}"""

    offers = ""
    if not svc.get("noOffers"):
        offers = """,
      "offers": {
        "@type": "Offer",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "priceCurrency": "EUR",
          "minPrice": 26,
          "maxPrice": 32,
          "unitCode": "HUR"
        }
      }"""

    areas = ",\n".join(
        f'        {{ "@type": "City", "name": "{c}" }}'
        for c in svc.get("areaServed", AREA_SERVED))

    canonical = f"{BASE}/{svc['slug']}/"
    title = esc_attr(svc["title"])
    desc = esc_attr(svc["description"])
    surfaces = " ".join("▪" if sf == DARK else "▫" for _, sf, _ in rendered)

    return f"""<!DOCTYPE html>
<html lang="de">
<!-- SERVICE PAGE — {svc['name']}. Built from
     NewVersionCopiesFrankonia/"{svc['docx']}"
     (Stand 04.08.2026), verbatim, in German.

     ⚠️ THIS IS NOT A COPY OF /werkschutz/ SECTION FOR SECTION, and that is the
     draft's own doing rather than drift: the v2 copy varies the structure per
     service on purpose ("Struktur bewusst variiert" is written into six of the
     nine remaining drafts). This one runs {len(svc['sections'])} sections. The BLOCKS are all the
     shared `.service-*` chassis, and css/page-service.css is the only page
     stylesheet loaded besides the shared form.

     Colour rhythm, derived from the section surfaces rather than copied:
       {surfaces}
     {len([1 for i in range(len(rendered) - 1) if rendered[i][1] != rendered[i + 1][1]])} pixel seams. Tiles are always the colour of the section ABOVE
     (docs/page-conventions.md §9.2).

     GENERATED ONCE by docs/design-sources/service-pages.py, then hand-editable.
     ⚠️ If you edit the FAQ below, edit the FAQPage graph above it too — they must
     stay byte-identical with markup stripped. -->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Title ({len(svc['title'])} chars) and description ({len(svc['description'])}) are the draft's own —
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

  <!-- The hero photo is the LCP element, same pattern as every other service
       hero. One source, no srcset: the file is 820px wide and there is no larger
       original, so a candidate list would only ever offer the same image. -->
  <link rel="preload" as="image" href="/assets/images/{svc['slug']}.webp" type="image/webp">

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
      "parentOrganization": {{
        "@id": "{BASE}/#organization"
      }}
    }},
    {{
      "@type": "Service",
      "@id": "{canonical}#service",
      "name": "{json_str(svc['name'])}",
      "serviceType": "{json_str(svc['serviceType'])}",
      "description": "{json_str(svc['schemaDesc'])}",
      "provider": {{
        "@id": "{BASE}/#localbusiness"
      }},
      "areaServed": [
{areas}
      ]{offers},
      "url": "{canonical}"
    }},
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
          "name": "Leistungen",
          "item": "{BASE}/leistungen/"
        }},
        {{
          "@type": "ListItem",
          "position": 3,
          "name": "{json_str(svc['name'])}",
          "item": "{canonical}"
        }}
      ]
    }}{faq_ld}
  ]
}}
  </script>

  <!-- include: head-common -->
  <!-- Shared lead-form section, then the service chassis
       (docs/page-conventions.md §9.1). -->
  <link rel="stylesheet" href="/css/lead-form.css">
  <link rel="stylesheet" href="/css/page-service.css">

  <!-- The documented generic effect stack (docs/page-conventions.md §4.1).
       Deliberately NOT loaded: service-flow.js, service-contrast.js, svg-draw.js
       and case-cards.js — /werkschutz/ needs them for blocks whose markup does
       not exist on this page. steps-sequence.js IS loaded: the Schritte section
       uses the shared rail. -->
  <script src="/assets/js/vendor/gsap.min.js" defer></script>
  <script src="/assets/js/vendor/ScrollTrigger.min.js" defer></script>
  <link rel="stylesheet" href="/css/vendor/lenis.css">
  <script src="/assets/js/vendor/lenis.min.js" defer></script>
  <script src="/js/smooth-scroll.js" defer></script>
  <script src="/js/hero-reveal.js" defer></script>
  <script src="/js/title-reveal.js" defer></script>
  <script src="/js/item-reveal.js" defer></script>
  <script src="/js/text-reveal.js" defer></script>
  <script src="/js/pixel-transition.js" defer></script>
  <script src="/js/steps-sequence.js" defer></script>
</head>
<body>
  <!-- include: icon-sprite -->
  <!-- include: header-de -->

  <main id="main">

    <!-- ============ BREADCRUMBS ============ -->
    <!-- Chevron separators, not slashes — docs/page-conventions.md §3. Matches
         the BreadcrumbList JSON-LD above. It sits ABOVE the hero because this
         hero is a two-column split, not a full-bleed photograph: only the bleed
         variant pulls the breadcrumb inside the section. -->
    <nav class="breadcrumbs container" aria-label="Breadcrumb">
      <ol class="breadcrumbs__list">
        <li><a class="breadcrumbs__link" href="/">Startseite</a></li>
        <li class="breadcrumbs__sep" aria-hidden="true">
          <svg class="breadcrumbs__sep-icon" aria-hidden="true"><use href="#icon-chevron"></use></svg>
        </li>
        <li><a class="breadcrumbs__link" href="/leistungen/">Leistungen</a></li>
        <li class="breadcrumbs__sep" aria-hidden="true">
          <svg class="breadcrumbs__sep-icon" aria-hidden="true"><use href="#icon-chevron"></use></svg>
        </li>
        <li><span class="breadcrumbs__current" aria-current="page">{esc(svc['name'])}</span></li>
      </ol>
    </nav>

{chr(10) + chr(10).join(body_html)}

  </main>

  <!-- include: footer-de -->
  <!-- include: whatsapp-button -->
</body>
</html>
""", seams


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    check = "--check" in sys.argv
    for svc in SERVICES:
        if args and svc["slug"] not in args:
            continue
        meta = DRAFTS[svc["slug"]]["meta"]
        svc["title"] = re.sub(r"^Title \(\d+ Zeichen\): ", "", meta["Title"])
        svc["description"] = re.sub(r"^Meta-Description \(\d+ Zeichen\): ", "",
                                    meta["Meta-Description"])
        svc["docx"] = ("2026-08-04 Webtext " +
                       {"objektschutz": "02 Objektschutz",
                        "sicherheitstechnik": "04 Sicherheitstechnik",
                        "brandwache": "05 Brandwache",
                        "kaufhausdetektei": "06 Kaufhausdetektei",
                        "veranstaltungsschutz": "07 Veranstaltungsschutz",
                        "baustellenbewachung": "09 Baustellenbewachung",
                        "revier-schliessdienst": "10 Revier-Schliessdienst",
                        "empfangsdienst": "11 Empfangsdienst",
                        "interventionsdienst": "12 Interventionsdienst"}[svc["slug"]]
                       + ".docx")
        html, seams = build_page(svc)
        path = os.path.join(PAGES, f"{svc['slug']}.html")
        if not check:
            with open(path, "w") as fh:
                fh.write(html)
        print(f"{svc['slug']:<24} {len(html):>7,} bytes  {seams:>2} seams  "
              f"{len(svc['sections'])} sections  title {len(svc['title'])}  "
              f"desc {len(svc['description'])}")


if __name__ == "__main__":
    main()
