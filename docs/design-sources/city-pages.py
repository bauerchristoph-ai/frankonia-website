#!/usr/bin/env python3
"""
Emit the nine remaining city pages from their Webtext copy — ONCE, in development.

WHY A GENERATOR AND NOT NINE HAND-WRITTEN FILES
-----------------------------------------------
`docs/page-conventions.md` §10.5 says a new city page is "copy Nürnberg and
change the copy". That is true, and it is also where the two failure modes of
this page type live, both of which are invisible in a screenshot:

  1. FAQ ↔ JSON-LD parity. Every answer exists twice — once visible, once inside
     the FAQPage graph — and they must stay byte-identical, markup stripped.
     Nine pages x 5-6 questions is 50 pairs to keep in step by hand.
  2. Seam colour. A pixel seam's tiles are the colour of the section ABOVE, and
     two adjacent same-colour sections take NO seam at all (§9.2). Every draft
     orders its sections differently, so the seam list cannot be copied from
     Nürnberg — it has to be derived from each page's own surface sequence.

Both are mechanical, so they are done mechanically here: the FAQ text is written
once per question and rendered into both places, and the seams are computed from
the declared surfaces rather than typed.

⚠️ THIS IS A ONE-SHOT DEV TOOL, exactly like city-outline.py and franken-map.py.
It generates `pages/sicherheitsdienst-<slug>.html` and then those files are
normal, hand-editable pages. It is NOT part of `npm run build` and must never be
re-run over pages that have since been edited by hand — it would overwrite them.
It is kept because it documents where every line of these nine pages came from,
and because the tenth city (if one is ever added) is a data entry, not a file.

Usage:  python3 docs/design-sources/city-pages.py            # write all nine
        python3 docs/design-sources/city-pages.py --check    # print, write none
        python3 docs/design-sources/city-pages.py wuerzburg  # just one

The `d` attribute of each hero outline comes from city-outline.py, which is run
separately and whose output is cached in OUTLINES below — see load_outline().
"""
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))          # docs/design-sources
ROOT = os.path.dirname(os.path.dirname(HERE))              # the repo root
PAGES = os.path.join(ROOT, "pages")
OUTLINE_SCRIPT = os.path.join(ROOT, "docs", "design-sources", "city-outline.py")

# --------------------------------------------------------------------------
# SURFACES
# --------------------------------------------------------------------------
# Which block types can sit on which surface. This is not a preference list —
# every "only" below is a real constraint in css/page-city.css or the chassis:
#
#   why       LIGHT only  — .city-why__item is a WHITE elevated panel.
#   services  DARK  only  — .city-services__card is white-at-4.5%, i.e. a tint
#                           that only exists against a dark surface.
#   fields    LIGHT only  — .city-fields__num uses the deep blue mix that §5
#                           prescribes for light surfaces (4,88:1); on black it
#                           measures 4,32:1 and would fail small-text contrast.
#   price     LIGHT only  — the Preis-Box is a dark panel INSIDE the section.
#   certs     LIGHT only  — .trust-certs__memberships hardcodes the same deep mix.
#   faq       LIGHT only  — .faq__list--cards answers are rgb(59 73 86 / .75).
#   form      DARK  only  — .conversion paints --color-bg itself.
#   callout   DARK if it renders its modules (white-at-4.5% again), EITHER if it
#                           is prose-only, which is how the Sicherheitsberatung /
#                           Sicherheitskonzept variants are rendered.
#   proof     EITHER       — fully token-driven.
#   trust     EITHER       — .testimonial--dark is the dark variant.
#   nearby    EITHER       — token-driven; light everywhere, per Nürnberg.
DARK, LIGHT = "dark", "light"


def is_light(surface):
    return surface == LIGHT


# --------------------------------------------------------------------------
# SMALL HELPERS
# --------------------------------------------------------------------------
def esc(s):
    """Escape for an HTML text node / attribute value."""
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def esc_attr(s):
    return esc(s).replace('"', "&quot;")


def json_str(s):
    """Escape for a JSON string literal."""
    return s.replace("\\", "\\\\").replace('"', '\\"')


TAG_RE = re.compile(r"<[^>]+>")


def strip_tags(s):
    return TAG_RE.sub("", s)


def icon(name, cls="icon"):
    return f'<svg class="{cls}" aria-hidden="true"><use href="#{name}"></use></svg>'


ARROW = icon("icon-arrow-diagonal", "icon service-link__arrow")


def load_outline(slug):
    """Run city-outline.py and pull the <path> line out of its output.

    Deliberately shells out rather than caching a copy of the path here: the
    boundary data and the tolerance both live in that script, so this stays a
    single source of truth. It is a few hundred ms per city, once.
    """
    out = subprocess.run(
        [sys.executable, OUTLINE_SCRIPT, slug],
        capture_output=True, text=True, check=True,
    ).stdout
    view = re.search(r'viewBox="([^"]+)"', out)
    path = re.search(r'(<path class="city-map__area".*?</path>|<path class="city-map__area"[^>]*>)', out)
    if not (view and path):
        raise SystemExit(f"city-outline.py gave no path for {slug}")
    return view.group(1), path.group(1)


# --------------------------------------------------------------------------
# SECTION RENDERERS
# Each returns (surface, html). `c` is the city dict.
# --------------------------------------------------------------------------
def r_hero(c, s):
    view, path = load_outline(c["geo"])
    ticks = "\n".join(
        f"""            <li class="service-hero__point">
              {icon('icon-check', 'icon service-hero__point-icon')}
              {esc(t)}
            </li>"""
        for t in s["ticks"]
    )
    stars = "\n".join(f'                  {icon("icon-star")}' for _ in range(5))
    return DARK, f"""    <!-- ============ 1. HERO ============ -->
    <!-- The draft's own Hero-Aufbau, nothing added or dropped: badge → H1 →
         subline → {len(s['ticks'])} ticks → double CTA → Google widget + DEKRA seals.
         .hero__lead / .hero__actions / .hero__reassurance / .hero__trust are
         load-bearing class names, not decoration — js/hero-reveal.js animates
         exactly those four blocks in that order, so this page needs no JS of its
         own (docs/page-conventions.md §4.1).
         {s['badgeNote']} -->
    <section class="service-hero city-hero" data-hero-reveal>
      <div class="container service-hero__grid city-hero__grid">
        <div class="service-hero__content city-hero__content">
          <p class="city-hero__badge">
            {icon('icon-pin', 'icon city-hero__badge-icon')}
            {esc(s['badge'])}
          </p>

          <h1>{esc(s['h1'])}</h1>

          <p class="hero__lead service-hero__lead">
            {esc(s['subline'])}
          </p>

          <div class="hero__actions service-hero__actions">
            <a class="btn btn--primary" href="#anfrage">Unverbindliches Angebot einholen<svg class="btn__arrow icon" aria-hidden="true"><use href="#icon-arrow-diagonal"></use></svg></a>
            <a class="btn btn--secondary service-hero__phone" href="{{{{phone.href}}}}">
              {icon('icon-phone', 'btn__icon icon')}
              {{{{phone.display}}}}
            </a>
          </div>

          <!-- The draft's lines VERBATIM, so a stacked list rather than the
               homepage hero's row of chips: these are full sentences and need
               ~1000px in a row at this type size against the ~640px this column
               has. Same measurement /jobs/ made before the client chose the list.
               .city-hero__points turns the shared row into a column and supplies
               the align-items: flex-start the shared centred rule would
               otherwise apply horizontally (docs/page-conventions.md §10.4). -->
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

        <!-- {esc(c['name'])}'S REAL ADMINISTRATIVE OUTLINE, as an inline path.
             Generated once in development by docs/design-sources/city-outline.py
             from assets/data/coverage-boundaries/{c['geo']}.geojson (fetched from
             OSM/Nominatim in July). Never hand-edit the coordinates; re-run the
             script instead.
             Why an outline and not a photo or a map — docs/page-conventions.md
             §10.3, in short: no city photography exists and the draft asks for
             none; an AREA is the honest visual for an Einsatzgebiet where a
             single pin would read as a branch office (§10.1); and as a path it
             costs zero requests and no third-party tiles.
             ⚠️ pathLength="1" IS LOAD-BEARING. The outline draws itself with a
             pure-CSS dash, and that attribute renormalises the perimeter to 1 so
             `stroke-dasharray: 1` is one exact lap at any size for any city. A
             path pasted in without it draws nothing at all.
             ⚠️ The guides are PERCENTAGES because every city's viewBox height
             differs (683 for Coburg, 1494 for Kulmbach); this one is {view.split()[3]}. -->
        <div class="city-hero__map" aria-hidden="true">
          <svg class="city-map" viewBox="{view}" fill="none" focusable="false">
            <line class="city-map__guide" x1="50%" y1="0" x2="50%" y2="100%"></line>
            <line class="city-map__guide" x1="0" y1="50%" x2="100%" y2="50%"></line>
            {path}
          </svg>
        </div>
      </div>
    </section>"""


def r_why(c, s):
    items = "\n".join(
        f"""          <li class="city-why__item">
            {icon(card['icon'], 'icon city-why__icon')}
            <h3 class="city-why__title">{esc(card['title'])}</h3>
            <p>{esc(card['text'])}</p>
          </li>"""
        for card in s["cards"]
    )
    lede = f"\n          <p>{esc(s['lede'])}</p>" if s.get("lede") else ""
    # THREE CARDS instead of Nürnberg's four. The grid is `repeat(4, …)` at
    # ≥1100px, so three cards would leave the fourth column empty — the same
    # visible hole .city-fields__item--wide exists to close. Five of the nine
    # drafts give three, which is why the modifier exists at all.
    three = " city-why__grid--3" if len(s["cards"]) == 3 else ""
    return LIGHT, f"""    <!-- ============ {s['n']}. {s['comment']} ============ -->
    <!-- The draft's {len(s['cards'])} cards. WHITE ELEVATED PANELS, every value copied from
         .service-cases__card on /werkschutz/ rather than re-derived, so the two
         are one design in two files (docs/page-conventions.md §10.4). That
         REVERSES §8.2's "ruled, not carded" for this block — a client decision
         with precedent, not drift. Do not restore the hairlines.
         ⚠️ The hover uses `translate`, never `transform`: these carry
         data-item-reveal and GSAP writes `transform` INLINE, which beats any
         stylesheet rule. `translate` is a separate property and composes. -->
    <section class="section section--light city-why" data-nav-theme="light">
      <div class="container">
        <div class="section__intro">
          <h2>{esc(s['h2'])}</h2>{lede}
        </div>

        <ul class="city-why__grid{three}" data-item-reveal=".city-why__item">
{items}
        </ul>
      </div>
    </section>"""


def r_services(c, s):
    out = []
    if s.get("cards"):
        cards = "\n".join(
            f"""          <li>
            <a class="city-services__card" href="{i['href']}">
              <span class="city-services__card-name">{esc(i['name'])}</span>
              <span class="city-services__card-text">{esc(i['text'])}</span>
              {icon('icon-arrow-diagonal', 'icon city-services__card-arrow')}
            </a>
          </li>"""
            for i in s["cards"]
        )
        out.append(f"""        <!-- GROUP 1 — the four whose destination is a {esc(c['name'])} page of its
             own. They carry the local keyword volume and a click keeps the
             visitor on a city-specific path. Whole card is the link. -->
        <ul class="city-services__featured" data-item-reveal=".city-services__card">
{cards}
        </ul>
""")
    rows = "\n".join(
        f"""            <li>
              <a class="city-services__row" href="{i['href']}">
                <span class="city-services__name">{esc(i['name'])}</span>
                <span class="city-services__text">{esc(i['text'])}</span>
                {icon('icon-arrow-diagonal', 'icon city-services__arrow')}
              </a>
            </li>"""
        for i in s["rows"]
    )
    label = ""
    if s.get("cards"):
        label = ('          <p class="city-services__more-label">Ebenfalls '
                 "verfügbar</p>\n\n")
        wrap_open = '        <div class="city-services__more">\n'
        wrap_close = "        </div>\n"
        indent_note = """        <!-- GROUP 2 — the four whose page is the GENERIC service page, which
             will not contain the city's name. As equal peers their "… in {city}"
             label was promising a local page that does not exist, which is the
             same implied-local claim §10.1 exists to prevent. Rows, not chips,
             so every description survives — the client's own condition.
             ⚠️ This grouping is about which destinations are CITY-specific, not
             about which pages exist yet. Do not promote a row to a card when its
             generic target goes live. -->
""".replace("{city}", esc(c["name"]))
    else:
        wrap_open = wrap_close = ""
        indent_note = f"""        <!-- ALL {len(s['rows'])} AS ROWS, no card group — and that is the documented rule
             applied, not a shortcut. Cards exist for services whose destination
             is a CITY-specific page; {esc(c['name'])} has no combo pages in this
             phase (the draft says so itself), so every one of these points at the
             generic service page. Presenting four of them as featured cards would
             promise a local page that does not exist — the implied-local claim
             §10.1 exists to prevent. Rows keep every description crawlable. -->
"""
    out.append(indent_note + wrap_open + label + f"""          <ul class="city-services__list" data-item-reveal="li">
{rows}
          </ul>
""" + wrap_close)
    body = "\n".join(out)
    return DARK, f"""    <!-- ============ {s['n']}. {s['comment']} ============ -->
    <!-- The draft's services, its copy, its order and its link targets.
         Linking confirmed-but-unbuilt URLs is this project's convention
         (docs/page-conventions.md §8.3); the page's own primary conversion never
         does it — every CTA points at #anfrage, the live form below. -->
    <section class="section city-services">
      <div class="container">
        <div class="section__intro">
          <h2>{esc(s['h2'])}</h2>
          <p>{esc(s['lede'])}</p>
        </div>

{body}      </div>
    </section>"""


def r_fields(c, s):
    n = len(s["items"])
    items = []
    for idx, it in enumerate(s["items"], start=1):
        # A 2-up grid leaves an odd last item alone in a half-empty row — a real
        # measured hole on Nürnberg (752→1337px at 1440). --wide spans it.
        wide = " city-fields__item--wide" if (n % 2 == 1 and idx == n) else ""
        link = ""
        if it.get("link"):
            link = f"""
            <a class="service-link city-fields__link" href="{it['link'][1]}">
              {esc(it['link'][0])}
              {ARROW}
            </a>"""
        items.append(f"""          <li class="city-fields__item{wide}">
            <span class="city-fields__num" aria-hidden="true">{idx:02d}</span>
            <h3 class="city-fields__title">{esc(it['title'])}</h3>
            <p>{esc(it['text'])}</p>{link}
          </li>""")
    eyebrow = ""
    if s.get("eyebrow"):
        eyebrow = f'\n          <p class="section-eyebrow">{esc(s["eyebrow"])}</p>'
    lede = f"\n          <p>{esc(s['lede'])}</p>" if s.get("lede") else ""
    return LIGHT, f"""    <!-- ============ {s['n']}. {s['comment']} ============ -->
    <!-- The section that makes this a CITY page rather than a service page with a
         place name pasted in: real local references, every word the draft's.
         Numbered because long blocks need an ordinal to be scannable; the
         numerals are aria-hidden decoration on top of a real <ol>.
         ⚠️ Where an item closes with a service link, that pairing is inferred
         from the copy (the draft only annotates URLs in the Leistungen section)
         and has been checked against WHERE the service is actually available —
         the lesson Nürnberg paid for when it linked Revier- & Schließdienst, a
         Raum-Bamberg-only service, from a Nürnberg page. -->
    <section class="section section--light city-fields" data-nav-theme="light">
      <div class="container">
        <div class="section__intro">{eyebrow}
          <h2>{esc(s['h2'])}</h2>{lede}
        </div>

        <ol class="city-fields__list" data-item-reveal="li">
{chr(10).join(items)}
        </ol>
      </div>
    </section>"""


def r_callout(c, s):
    """Brandwache / Sicherheitsberatung / Sicherheitskonzept.

    With modules it is DARK-only (they are white-at-4.5% tints). Prose-only, it
    is token-driven and works on either surface, which is what the
    Sicherheitsberatung and Sicherheitskonzept variants use.
    """
    points = ""
    surface = s.get("surface", DARK)
    if s.get("points"):
        surface = DARK
        lis = "\n".join(
            f"""          <li>
            <span class="city-callout__icon" aria-hidden="true">
              {icon(p['icon'])}
            </span>
            {esc(p['text'])}
          </li>"""
            for p in s["points"]
        )
        points = f"""
        <!-- Three stacked modules: circular blue-tinted icon container, the
             draft's own line beside it. Copy verbatim. They sit 16px apart so
             the three read as ONE set of promises rather than three blocks.
             aria-hidden icons — each repeats the sentence beside it. -->
        <ul class="city-callout__points" data-item-reveal="li">
{lis}
        </ul>
"""
    actions = ""
    if s.get("phone") or s.get("link"):
        bits = []
        if s.get("phone"):
            bits.append(f"""          <a class="btn btn--primary city-callout__call" href="{{{{phone.href}}}}">
            {icon('icon-phone', 'btn__icon icon')}
            Jetzt anrufen: {{{{phone.display}}}}
          </a>""")
        if s.get("link"):
            bits.append(f"""          <a class="service-link city-callout__link" href="{s['link'][1]}">
            {esc(s['link'][0])}
            {ARROW}
          </a>""")
        actions = f"""
        <div class="city-callout__actions" data-reveal>
{chr(10).join(bits)}
        </div>
"""
    light = " section--light" if is_light(surface) else ""
    navtheme = ' data-nav-theme="light"' if is_light(surface) else ""
    eyebrow = ""
    if s.get("eyebrow"):
        eyebrow = f"""
          <!-- ⚠️ NOT from the draft — UI furniture, the same category as the
               section eyebrows /werkschutz/ and /jobs/ carry, and reversible
               copy rather than a claim. .section-eyebrow already ships the 6px
               blue square; it is display:flex, so the parent's text-align does
               NOT move it and page-city.css gives it its own justify-content. -->
          <p class="section-eyebrow city-callout__eyebrow">{esc(s['eyebrow'])}</p>
"""
    ledes = "\n".join(
        f'          <p class="city-callout__lede">{p}</p>' for p in s["ledes"]
    )
    phone_note = ""
    if s.get("phone"):
        phone_note = """    <!-- ⚠️ THE PHONE IS THE STRATEGIC HALF OF THIS SECTION, not decoration.
         This is the one section on the page about an EMERGENCY — a BMA-Ausfall
         is a today problem — and the approved copy ends on a 24/7 promise with
         no way to act on it. The page's primary action is the form, which is a
         one-working-day process and the wrong action for someone whose fire
         alarm is down right now. Not invented: the page's own Brandwache FAQ
         answer already publishes this number for exactly this case, and
         /brandwache-nuernberg/ makes "Jetzt anrufen" its hero's primary action.
         Same wording so the two read as one path. -->
"""
    return surface, f"""    <!-- ============ {s['n']}. {s['comment']} ============ -->
{s.get('note', '')}{phone_note}    <section class="section{light} city-callout"{navtheme}>
      <div class="container city-callout__layout">
        <div class="section__intro city-callout__intro">{eyebrow}
          <h2>{esc(s['h2'])}</h2>
{ledes}
        </div>
{points}{actions}      </div>
    </section>"""


def r_price(c, s):
    # A rate row is either a plain service name or (name, qualifier) — the
    # qualifier is the draft's own parenthetical, e.g. Bayreuth's and
    # Schweinfurt's "Werkschutz mit technik-geschulten Kräften". It renders in
    # .city-rates__note, the same way Nürnberg's does.
    # ⚠️ WHICH SERVICES APPEAR IS PER-DRAFT AND NOT ALWAYS FOUR. Each Webtext's
    # "Typische Preisspannen" line names its own set — two for Schweinfurt and
    # Forchheim, three for Fürth, Bayreuth, Coburg and Ansbach, four for
    # Würzburg, Bamberg and Erlangen. Padding them all out to four put services
    # in a rate table the client never priced there; caught by diffing the built
    # pages against the drafts.
    rows = []
    for r in s["rates"]:
        name, note = (r, None) if isinstance(r, str) else r
        label = esc(name) if not note else (
            f'{esc(name)} <span class="city-rates__note">{esc(note)}</span>')
        rows.append(f'          <li><span class="city-rates__service">{label}</span>'
                    f'<span class="city-rates__range">{{{{price.range}}}} '
                    f'{{{{price.unit}}}}</span></li>')
    rates = "\n".join(rows)
    return LIGHT, f"""    <!-- ============ {s['n']}. KOSTEN IN {c['name'].upper()} ============ -->
    <!-- Entirely the chassis: .service-price* was built generically on
         /werkschutz/ because docs/build-checklist.md counts this block on 27
         pages, and the Preis-Box is a partial. The only city-specific rule is
         .city-rates for the per-service rows a service page does not have.
         ⚠️ .city-rates deliberately does NOT reuse .service-price__factors —
         that block draws a blue `+` per row, and a `+` in front of
         "Objektschutz · 26-32 €/Std." reads as a list of extras rather than a
         rate table. It does repeat that block's `grid-column: 1`, or it falls
         into the second column under the price box.
         GEO shape: question H2, the number in the first sentence. -->
    <section class="section section--light service-price" data-nav-theme="light">
      <div class="container service-price__layout">
        <div class="section__intro service-price__intro">
          <h2>{esc(s['h2'])}</h2>
          <p class="service-price__answer" data-reveal data-reveal-delay>{s['answer']}</p>
        </div>

        <!-- The shared Preis-Box. `range` comes from content/values.json, so the
             annual rate change stays ONE edit for all 27 pages that publish it
             (client rule G10). -->
        <!-- include: price-box range="{{{{price.range}}}}" note="{esc_attr(s['boxNote'])}" -->

        <!-- The draft's own "Typische Preisspannen" line, split into its services
             so it can be read rather than parsed. -->
        <ul class="city-rates" data-item-reveal="li">
{rates}
        </ul>

        <p class="service-price__hint">
          {icon('icon-alert', 'icon service-price__hint-icon')}
          <span>{s['hint']}</span>
        </p>
      </div>
    </section>"""


TESTIMONIALS = {
    "crispens": (
        "testimonial-robert-crispens.jpg", "Robert Crispens",
        "Geschäftsführer, MORELO Reisemobile",
        "„Ich bin froh, mit FRANKONIA einen zuverlässigen Partner aus der Region "
        "gefunden zu haben: In puncto Sicherheit werden alle Leistungen persönlich "
        "auf unsere individuellen Bedürfnisse zugeschnitten. Es ist sehr beruhigend "
        "zu wissen, dass wir stets auf Qualität sowie professionelles Auftreten der "
        "Sicherheitskräfte vertrauen können.“",
    ),
    "keller": (
        "testimonial-peter-keller.jpg", "Peter Keller",
        "Geschäftsführer, CleanTech Innovation Park",
        "„Im Cleantech Innovation Park entsteht ein lebendiger Treffpunkt für den "
        "Austausch von Wirtschaft und Forschung. Da sich unsere Infrastruktur mit "
        "der Zeit enorm weiterentwickeln wird, werden sich auch die Anforderungen "
        "an die Sicherheit des Geländes sowie der Gebäude verändern und "
        "spezifischer gestalten. Mit FRANKONIA haben wir einen zuverlässigen "
        "Partner an unserer Seite.“",
    ),
    "schleier": (
        "testimonial-hermann-schleier.jpg", "Hermann Schleier",
        "Geschäftsleitung, Sozialstiftung Bamberg",
        "„Die FRANKONIA Sicherheitsdienst GmbH & Co. KG hat uns in der Corona-Zeit "
        "bei den Zutrittskontrollen unserer Einrichtungen sehr zuverlässig "
        "unterstützt. Die Zusammenarbeit war jederzeit professionell, flexibel und "
        "unkompliziert — auch bei kurzfristigen Änderungen.“",
    ),
}


def r_trust(c, s):
    quotes = "\n".join(
        f"""          <blockquote class="testimonial testimonial--dark">
            <header class="testimonial__header">
              <div class="testimonial__person">
                <img class="testimonial__avatar" src="/assets/images/{TESTIMONIALS[k][0]}" width="240" height="240" alt="{esc_attr(TESTIMONIALS[k][1])}" loading="lazy">
                <div>
                  <p class="testimonial__name">{esc(TESTIMONIALS[k][1])}</p>
                  <p class="testimonial__role">{esc(TESTIMONIALS[k][2])}</p>
                </div>
              </div>
              <img class="testimonial__google" src="/assets/icons/google-icon.png" alt="Google" width="128" height="128" loading="lazy">
            </header>
            <p class="testimonial__quote">{esc(TESTIMONIALS[k][3])}</p>
            <span class="testimonial__stars" role="img" aria-label="5 von 5 Sternen">★★★★★</span>
          </blockquote>"""
        for k in s["quotes"]
    )
    return DARK, f"""    <!-- ============ {s['n']}. {s['comment']} ============ -->
    <!-- ⚠️ .testimonial--dark is REQUIRED here and its absence was a real bug on
         Nürnberg before the modifier existed: css/testimonials.css holds "on
         white" colours, so on a dark section the customer's NAME rendered black
         on a black card — invisible, on the one part of a testimonial that has
         to be verifiable. -->
    <section class="section city-trust">
      <div class="container">
        <div class="section__intro">
          <h2>{esc(s['h2'])}</h2>
          <p>{s['lede']}</p>
        </div>

        <div class="city-trust__quotes" data-item-reveal=".testimonial" data-item-reveal-strong>
{quotes}
        </div>
      </div>
    </section>"""


def r_certs(c, s):
    intro = ""
    if s.get("h2"):
        intro = f"""        <div class="section__intro">
          <h2>{esc(s['h2'])}</h2>
          <p>{s['lede']}</p>
        </div>

"""
    return LIGHT, f"""    <!-- ============ {s['n']}. {s['comment']} ============ -->
    <!-- .trust-certs* lives in page-service.css (promoted there on 2026-08-09
         when this composition got its third consumer) and needs no colour rules
         of its own: .section--light already re-declares every token it uses, and
         the chassis already gives .service-link its 4,88:1 blue there. -->
    <section class="section section--light city-certs" data-nav-theme="light">
      <div class="container">
{intro}        <div class="trust-certs" data-reveal>
          <div class="trust-certs__seals">
            <img class="trust-certs__seal" src="/assets/icons/dekra-din-77200.png" alt="DEKRA-Zertifizierungssiegel: Sicherheitsdienstleistungen nach DIN 77200" width="399" height="600" loading="lazy">
            <img class="trust-certs__seal" src="/assets/icons/dekra-iso-9001.png" alt="DEKRA-Zertifizierungssiegel: Qualitätsmanagement nach ISO 9001:2015" width="399" height="600" loading="lazy">
          </div>

          <ul class="trust-certs__list">
            <li>
              <strong>DIN 77200-1</strong>
              für stationäre Sicherheitsdienste
            </li>
            <li>
              <strong>DIN EN ISO 9001</strong>
              seit 2016, geprüft durch die DEKRA
            </li>
            <li>
              <strong>§ 34a GewO</strong>
              ausschließlich IHK-qualifizierte Kräfte
            </li>
          </ul>

          <p class="trust-certs__memberships">{s['closing']}</p>
        </div>
      </div>
    </section>"""


def r_proof(c, s):
    surface = s.get("surface", DARK)
    items = "\n".join(
        f"""          <li class="city-proof__item">
            {icon(i['icon'], 'icon city-proof__icon')}
            <p class="city-proof__label">{esc(i['text'])}</p>
          </li>"""
        for i in s["items"]
    )
    light = " section--light" if is_light(surface) else ""
    navtheme = ' data-nav-theme="light"' if is_light(surface) else ""
    return surface, f"""    <!-- ============ {s['n']}. ERREICHBARKEIT & DIGITALE NACHWEISE ============ -->
    <!-- The /leistungen/ chapter-strip treatment, values taken from
         page-leistungen.css rather than re-derived. No arrow and no hover: those
         three are LINKS to chapters, these are statements with nowhere to go, and
         an arrow would promise navigation that does not exist. No 01–03 numerals
         either — these are PARALLEL facts, not steps.
         ⚠️ The closing line is the draft's Abbinder verbatim, and it is written
         to be UWG-safe: it promises fixed personnel in the object and a reachable
         Einsatzleitung and makes NO claim about response times or travel
         distances (Prüfkatalog F10, §10.1). Do not add one. -->
    <section class="section{light} city-proof"{navtheme}>
      <div class="container">
        <div class="section__intro">
          <h2>{esc(s['h2'])}</h2>
        </div>

        <ul class="city-proof__grid" data-item-reveal="li">
{items}
        </ul>

        <p class="city-proof__outro">{s['outro']}</p>
      </div>
    </section>"""


def r_faq(c, s):
    items = "\n".join(
        f"""          <details class="faq-item">
            <summary><h3>{esc(q['q'])}</h3></summary>
            <p class="faq-item__answer">{q['a']}</p>
          </details>"""
        for q in s["questions"]
    )
    return LIGHT, f"""    <!-- ============ {s['n']}. FAQ ============ -->
    <!-- {len(s['questions'])} place-specific questions, the draft's own, verbatim. The visible copy
         and the FAQPage JSON-LD at the top of this file must stay byte-identical
         with markup stripped — the one thing on this page type that is easy to
         break with a small edit and impossible to see. They are generated from
         one source by docs/design-sources/city-pages.py, so an edit here has to
         be made in BOTH places by hand.
         ⚠️ The first question answers "do you have an office here?" honestly.
         That is the UWG requirement of §10.1, not filler — do not soften it into
         a local-address claim. -->
    <section class="section section--light city-faq service-faq" data-nav-theme="light">
      <div class="container">
        <div class="section__intro">
          <h2>{esc(s['h2'])}</h2>
        </div>

        <div class="faq__list faq__list--cards" data-item-reveal=".faq-item" data-item-reveal-strong>
{items}
        </div>
      </div>
    </section>"""


def r_form(c, s):
    return DARK, f"""    <!-- ============ {s['n']}. ABSCHLUSS-CTA (PRIMARY CONVERSION) ============ -->
    <!-- The shared lead-form partial with this page's own field prefix — unique
         per page, or two forms in one document would break every <label for>.
         The draft's separate Formulartitel ("{esc(s['formTitle'])}") is not
         rendered as a second heading: the section H2 already says it, the same
         call /werkschutz/ and Nürnberg made.
         The form still submits nowhere sitewide (action="#", native validation
         only) — docs/build-checklist.md Paso 4. -->
    <section id="anfrage" class="conversion">
      <div class="conversion__panel conversion__panel--form">
        <div class="section__intro conversion__intro">
          <h2>{esc(s['h2'])}</h2>
          <p class="conversion__intro-lede">{esc(s['lede'])}</p>
        </div>

        <div class="conversion__form-wrap">
          <!-- include: lead-form prefix="{c['prefix']}" messageLabel="{esc_attr(s['messageLabel'])}" -->

          <p class="conversion__form-alt">Lieber direkt sprechen? <a href="{{{{phone.href}}}}">{{{{phone.display}}}}</a></p>
        </div>
      </div>
    </section>"""


def r_nearby(c, s):
    tiles = []
    for t in s["tiles"]:
        if t.get("href"):
            tiles.append(f"""          <li>
            <a class="city-nearby__tile" href="{t['href']}">
              {icon('icon-pin', 'icon city-nearby__pin')}
              <span class="city-nearby__name">{esc(t['name'])}</span>
              {icon('icon-arrow-diagonal', 'icon city-nearby__arrow')}
            </a>
          </li>""")
        else:
            tiles.append(f"""          <li>
            <span class="city-nearby__tile city-nearby__tile--mention">
              {icon('icon-pin', 'icon city-nearby__pin')}
              <span class="city-nearby__name">{esc(t['name'])}</span>
            </span>
          </li>""")
    return LIGHT, f"""    <!-- ============ {s['n']}. UMGEBUNG ============ -->
    <!-- ⚠️ BELOW THE FORM, which departs from the draft's own order and follows
         Nürnberg's (client-approved, 2026-08-10). The drafts title this section
         "Umgebung + Abschluss-CTA", i.e. as ONE closing block — but functionally
         they pull opposite ways: a set of EXITS directly above the page's primary
         conversion. The service template resolves the same tension the other way
         ("… FAQ → CTA → verwandte Seiten"), so there is internal precedent.
         No copy changed. See docs/page-conventions.md §10.2.
         Small H2 per the draft — the fourth declared exception to §2.
         A neighbour with no page of its own is a MENTION with no link and no
         arrow, so "this goes somewhere" is never signalled by colour alone. -->
    <section class="section section--light city-nearby" data-nav-theme="light">
      <div class="container">
        <div class="section__intro city-nearby__intro">
          <h2 class="city-nearby__title">{esc(s['h2'])}</h2>
          <p>{esc(s['lede'])}</p>
        </div>

        <ul class="city-nearby__list" data-item-reveal="li">
{chr(10).join(tiles)}
        </ul>
      </div>
    </section>"""


RENDERERS = {
    "hero": r_hero, "why": r_why, "services": r_services, "fields": r_fields,
    "callout": r_callout, "price": r_price, "trust": r_trust, "certs": r_certs,
    "proof": r_proof, "faq": r_faq, "form": r_form, "nearby": r_nearby,
}


# --------------------------------------------------------------------------
# PAGE ASSEMBLY
# --------------------------------------------------------------------------
SEAM_DARK = ('    <div class="pixel-seam" data-pixel-seam aria-hidden="true"></div>')
SEAM_LIGHT = ('    <div class="pixel-seam pixel-seam--white" data-pixel-seam '
              'aria-hidden="true"></div>')


def build_page(c):
    # 1. Render every section, collecting its resolved surface.
    rendered = []
    for s in c["sections"]:
        surface, html = RENDERERS[s["type"]](c, s)
        rendered.append((s, surface, html))

    # 2. Seams. A seam's tiles are the colour of the section ABOVE, so a
    #    dark→light boundary gets the default (black) tiles and a light→dark one
    #    gets --white. Two adjacent sections of the SAME surface get NO seam:
    #    tiles the colour of the section above would be invisible against the
    #    section below (docs/page-conventions.md §9.2). This is derived rather
    #    than typed precisely because every draft orders its sections
    #    differently — Nürnberg's seam list is not transferable.
    body = []
    seams = 0
    for idx, (s, surface, html) in enumerate(rendered):
        body.append(html)
        if idx + 1 < len(rendered):
            nxt = rendered[idx + 1][1]
            if nxt != surface:
                body.append(SEAM_LIGHT if is_light(surface) else SEAM_DARK)
                seams += 1
            else:
                body.append(
                    f"    <!-- No seam: {s['type']} and "
                    f"{rendered[idx + 1][0]['type']} are both {surface} "
                    "surfaces, and tiles the colour of the section above would "
                    "be invisible against the one below (§9.2). -->"
                )
    # The last section is followed by the footer, which is dark. G7 (2026-08-14)
    # removed the seam before the footer sitewide: the last section is almost
    # always dark too, so that edge separated nothing.

    faqs = next((s for s in c["sections"] if s["type"] == "faq"), None)
    faq_ld = ""
    if faqs:
        entries = ",\n".join(
            f"""        {{
          "@type": "Question",
          "name": "{json_str(q['q'])}",
          "acceptedAnswer": {{
            "@type": "Answer",
            "text": "{json_str(strip_tags(q['a']))}"
          }}
        }}"""
            for q in faqs["questions"]
        )
        faq_ld = f""",
    {{
      "@type": "FAQPage",
      "@id": "https://frankonia-sicherheit.de/{c['url']}/#faq",
      "mainEntity": [
{entries}
      ]
    }}"""

    canonical = f"https://frankonia-sicherheit.de/{c['url']}/"
    title = esc_attr(c["title"])
    desc = esc_attr(c["description"])

    return f"""<!DOCTYPE html>
<html lang="de">
<!-- CITY PAGE — {c['name']}. Built from
     NewVersionCopiesFrankonia/"{c['docx']}"
     (Stand 04.08.2026), verbatim, in German.

     ⚠️ UWG / "kein Scheinstandort" is the rule that governs this whole page
     type (docs/page-conventions.md §10.1). FRANKONIA has ONE address, in
     Bamberg, and a city page may not imply a branch. It lands in three places
     here: the hero badge says "Einsatzgebiet", never "Standort"; the
     LocalBusiness JSON-LD carries the real Bamberg NAP with
     areaServed: {c['name']} and NOT a {c['name']} address; and the FAQ answers
     "do you have an office here?" honestly. Do not "improve" any of the three
     into a local-address claim.
{c.get('pageNote', '')}
     REUSE MODEL: every class is `.city-*`, never `.{c['geo']}-*`, and
     css/page-service.css is loaded as the CHASSIS (§9.1) — inset, `main h2`,
     breadcrumb chevron, `.section--light`, `.service-hero*`, `.service-link`,
     the whole `.pixel-seam*` block and the entire Kosten section come from
     there. css/page-city.css was NOT touched to build this page.

     GENERATED ONCE by docs/design-sources/city-pages.py, then hand-editable.
     ⚠️ If you edit the FAQ below, edit the FAQPage graph above it too — they
     must stay byte-identical with markup stripped. -->
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

  <!-- NO hero image preload: this page has no hero photograph. There is not one
       city photo in the project and the draft does not ask for one — the hero's
       visual is an inline SVG of {c['name']}'s real administrative boundary, so
       it costs no request at all and the page has NO image LCP element. -->

  <script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@graph": [
    {{
      "@type": "Organization",
      "@id": "https://frankonia-sicherheit.de/#organization",
      "name": "FRANKONIA Sicherheitsdienst GmbH & Co. KG",
      "url": "https://frankonia-sicherheit.de/",
      "logo": {{
        "@type": "ImageObject",
        "url": "https://frankonia-sicherheit.de/assets/icons/logo-wide-right-icon.png",
        "width": 800,
        "height": 83
      }}
    }},
    {{
      "@type": "LocalBusiness",
      "@id": "https://frankonia-sicherheit.de/#localbusiness",
      "name": "FRANKONIA Sicherheitsdienst GmbH & Co. KG",
      "logo": "https://frankonia-sicherheit.de/assets/icons/logo-wide-right-icon.png",
      "url": "https://frankonia-sicherheit.de/",
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
        "name": "{c['name']}",
        "containedInPlace": {{ "@type": "AdministrativeArea", "name": "Bayern" }}
      }},
      "aggregateRating": {{
        "@type": "AggregateRating",
        "ratingValue": "4.7",
        "reviewCount": "{{{{rating.count}}}}",
        "bestRating": "5",
        "worstRating": "1"
      }},
      "parentOrganization": {{
        "@id": "https://frankonia-sicherheit.de/#organization"
      }}
    }}{faq_ld},
    {{
      "@type": "BreadcrumbList",
      "itemListElement": [
        {{
          "@type": "ListItem",
          "position": 1,
          "name": "Startseite",
          "item": "https://frankonia-sicherheit.de/"
        }},
        {{
          "@type": "ListItem",
          "position": 2,
          "name": "Einsatzgebiete",
          "item": "https://frankonia-sicherheit.de/einsatzgebiete/"
        }},
        {{
          "@type": "ListItem",
          "position": 3,
          "name": "Sicherheitsdienst {c['name']}",
          "item": "{canonical}"
        }}
      ]
    }}
  ]
}}
  </script>

  <!-- include: head-common -->

  <!-- Shared, in cascade order (docs/page-conventions.md §9.1):
       lead-form → testimonials → page-service.css (the CHASSIS) → this page. -->
  <link rel="stylesheet" href="/css/lead-form.css">
  <link rel="stylesheet" href="/css/testimonials.css">
  <link rel="stylesheet" href="/css/page-service.css">
  <link rel="stylesheet" href="/css/page-city.css">

  <!-- The documented generic effect stack, nothing page-specific
       (docs/page-conventions.md §4.1). -->
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
</head>
<body class="page-city">
  <!-- include: icon-sprite -->
  <!-- include: header-de -->

  <main id="main">

    <!-- ============ BREADCRUMBS ============ -->
    <!-- Chevron separators, not slashes — docs/page-conventions.md §3. Matches
         the BreadcrumbList JSON-LD above. The breadcrumb sits ABOVE the hero
         (unlike /werkschutz/, whose hero is a full-bleed photograph reaching the
         top of the page) because this hero has no photo. -->
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
        <li><span class="breadcrumbs__current" aria-current="page">{esc(c['name'])}</span></li>
      </ol>
    </nav>

{chr(10) + chr(10).join(body)}

  </main>

  <!-- include: footer-de -->
  <!-- include: whatsapp-button -->
</body>
</html>
""", seams


def main():
    from city_pages_data import CITIES  # noqa: E402
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    check = "--check" in sys.argv
    for c in CITIES:
        if args and c["geo"] not in args:
            continue
        html, seams = build_page(c)
        path = os.path.join(PAGES, f"{c['url']}.html")
        if not check:
            with open(path, "w") as fh:
                fh.write(html)
        print(f"{c['url']:<32} {len(html):>7,} bytes  {seams} seams  "
              f"{len(c['sections'])} sections")


if __name__ == "__main__":
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    main()
