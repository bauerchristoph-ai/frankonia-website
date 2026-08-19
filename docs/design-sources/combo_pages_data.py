# -*- coding: utf-8 -*-
"""
The fifteen remaining combo pages, as STRUCTURE. Read by combo-pages.py.

There is no German copy in this file. Every word comes from combo_drafts.py,
which was extracted from the .docx mechanically. What is declared here is only:
which draft section becomes which BLOCK, on which SURFACE, with which icon.

WHY THAT SPLIT EXISTS — and it is the lesson the nine service pages paid for:
the drafts do NOT share one structure. Every one of these fifteen says so in its
own header ("Struktur variiert ggü. Brandwache-Kombi", "Struktur-Variation:
Prozess früh", "Q&A-lastig"), and they run 6 to 9 sections in four different
shapes. So "copy /brandwache-nuernberg/ and change the copy" — which is what
docs/page-conventions.md §11 said — is half true. The BLOCKS are all built; the
ORDER, the surfaces and therefore the seam list are per page.

  prose: N     how many of a section's body lines are intro PARAGRAPHS. The rest
               are items. Declared, never guessed — see combo_drafts.py.
  dotsplit     the draft wrote every item of this section on ONE line joined by
               " · " (the Objektschutz "Bausteine"). Split on that, nothing else.
  surface      "dark" / "light". Four blocks have no choice (see combo-pages.py's
               SURFACES note); the rest are declared to make the page alternate.

SURFACE PARITY IS ARITHMETIC, NOT TASTE. The hero is dark and the Kosten section
is dark (it is the type's inverted white-card variant, client 2026-08-10), so a
page alternates perfectly only when the number of sections BETWEEN them is odd.
Eleven of the fifteen have an odd count and alternate all the way down. The other
four take exactly one or two no-seam adjacencies, and each is placed where the
two sections genuinely read as one chapter — preferably at prose → Kosten, where
the section's big white card supplies its own surface change and a seam buys the
least. §9.2 covers this: two same-colour sections take NO seam, because tiles the
colour of the section above would be invisible against the one below.

ICONS: every glyph is already in partials/icon-sprite.html — NO new symbol was
drawn for these fifteen pages. Within one page no glyph is ever used twice, so a
repeated icon never reads as an error.
"""

DARK, LIGHT = "dark", "light"

# --------------------------------------------------------------------------
# 35 — OBJEKTSCHUTZ NÜRNBERG
# --------------------------------------------------------------------------
OBJEKTSCHUTZ_NUERNBERG = {
    "url": "objektschutz-nuernberg",
    "service": "Objektschutz",
    "servicePage": "/objektschutz/",
    "city": "Nürnberg",
    "geo": "nuremberg",
    "cityPage": "/sicherheitsdienst-nuernberg/",
    "prefix": "osn",
    "title": "Objektschutz Nürnberg | Ihr Objekt 24/7 bewacht – FRANKONIA",
    "description": "Objektschutz in Nürnberg: Bestreifung, Zugangskontrolle & Alarmverfolgung für Gewerbe, Logistik & Büro. DEKRA-zertifiziert, Angebot in einem Werktag.",
    "messageLabel": "Objekt, Zeiten und Anforderungen kurz beschreiben",
    "priceNote": "netto, Richtwerte für Objektschutz im Großraum Nürnberg",
    "pageNote": """
     ⚠️ ONE NO-SEAM ADJACENCY, and it is deliberate: the 4-step Ablauf and the
     Kosten section are both dark, so the boundary between them takes no seam
     (§9.2). They read as one chapter — the process and what it costs — and the
     Kosten section's white card supplies the surface change a seam would have.""",
    "sections": [
        {"n": 1, "type": "hero",   "src": 1, "surface": DARK},
        {"n": 2, "type": "fields", "src": 2, "surface": LIGHT,
         "icons": ["icon-factory", "icon-building", "icon-bag",
                   "icon-document-check"]},
        {"n": 3, "type": "points", "src": 3, "surface": DARK, "cols": 4,
         "dotsplit": True, "hinweis": True},
        {"n": 4, "type": "prose",  "src": 4, "surface": LIGHT, "answer": True},
        {"n": 5, "type": "steps",  "src": 5, "surface": DARK,
         "icons": ["icon-transparency", "icon-plan", "icon-euro", "icon-guard"]},
        {"n": 6, "type": "price",  "src": 6, "surface": DARK},
        {"n": 7, "type": "faq",    "src": 7, "surface": LIGHT},
        {"n": 8, "type": "form",   "src": 8, "surface": DARK},
        {"n": 9, "type": "related", "src": 8, "surface": LIGHT},
    ],
}

# --------------------------------------------------------------------------
# 36 — WERKSCHUTZ NÜRNBERG
# --------------------------------------------------------------------------
WERKSCHUTZ_NUERNBERG = {
    "url": "werkschutz-nuernberg",
    "service": "Werkschutz",
    "servicePage": "/werkschutz/",
    "city": "Nürnberg",
    "geo": "nuremberg",
    "cityPage": "/sicherheitsdienst-nuernberg/",
    "prefix": "wsn",
    "title": "Werkschutz Nürnberg | Industrie-Schutz 24/7 – FRANKONIA",
    "description": "Werkschutz für Nürnberger Industrie: Pforte, Rundgänge & Anlagen-Bedienung durch technik-geschulte Kräfte. DEKRA-zertifiziert, Angebot in einem Werktag.",
    "messageLabel": "Standort, Schichtzeiten und Anforderungen kurz beschreiben",
    "priceNote": "netto, Richtwerte für Werkschutz im Großraum Nürnberg",
    "sections": [
        {"n": 1, "type": "hero",   "src": 1, "surface": DARK},
        {"n": 2, "type": "fields", "src": 2, "surface": LIGHT, "prose": 1,
         "icons": ["icon-key", "icon-factory", "icon-shield-check"]},
        {"n": 3, "type": "prose",  "src": 3, "surface": DARK},
        {"n": 4, "type": "scope",  "src": 4, "surface": LIGHT},
        {"n": 5, "type": "price",  "src": 5, "surface": DARK},
        {"n": 6, "type": "faq",    "src": 6, "surface": LIGHT},
        {"n": 7, "type": "form",   "src": 7, "surface": DARK},
        {"n": 8, "type": "related", "src": 7, "surface": LIGHT},
    ],
}

# --------------------------------------------------------------------------
# 37 — BAUSTELLENBEWACHUNG NÜRNBERG
# --------------------------------------------------------------------------
BAUSTELLEN_NUERNBERG = {
    "url": "baustellenbewachung-nuernberg",
    "service": "Baustellenbewachung",
    "servicePage": "/baustellenbewachung/",
    "city": "Nürnberg",
    "geo": "nuremberg",
    "cityPage": "/sicherheitsdienst-nuernberg/",
    "prefix": "bbn",
    "title": "Baustellenbewachung Nürnberg | Schutz 24/7 – FRANKONIA",
    "description": "Baustellenbewachung in Nürnberg: Schutz vor Diebstahl & Vandalismus, feste Teams, Konzepte je Bauphase, dokumentiert. Angebot in einem Werktag.",
    "messageLabel": "Baustelle, Bauphase und Zeitraum kurz beschreiben",
    "priceNote": "netto, Richtwerte für Baustellenbewachung im Großraum Nürnberg",
    "sections": [
        {"n": 1, "type": "hero",   "src": 1, "surface": DARK},
        {"n": 2, "type": "fields", "src": 2, "surface": LIGHT, "prose": 1,
         "icons": ["icon-building", "icon-crane", "icon-route"]},
        {"n": 3, "type": "prose",  "src": 3, "surface": DARK},
        {"n": 4, "type": "points", "src": 4, "surface": LIGHT, "prose": 1,
         "cols": 3},
        {"n": 5, "type": "price",  "src": 5, "surface": DARK},
        {"n": 6, "type": "faq",    "src": 6, "surface": LIGHT},
        {"n": 7, "type": "form",   "src": 7, "surface": DARK},
        {"n": 8, "type": "related", "src": 7, "surface": LIGHT},
    ],
}

# --------------------------------------------------------------------------
# 38 — BRANDWACHE WÜRZBURG
# Same shape as the built /brandwache-nuernberg/, with the Ablauf as PROSE:
# this draft writes it as one paragraph rather than three numbered steps.
# --------------------------------------------------------------------------
BRANDWACHE_WUERZBURG = {
    "url": "brandwache-wuerzburg",
    "service": "Brandwache",
    "servicePage": "/brandwache/",
    "city": "Würzburg",
    "geo": "wuerzburg",
    "cityPage": "/sicherheitsdienst-wuerzburg/",
    "prefix": "bww",
    "notfall": True,
    "title": "Brandwache Würzburg | Brandsicherheitswache 24/7 – FRANKONIA",
    "description": "Brandwache in Würzburg: BMA-Ausfall, Heißarbeiten, Feste, qualifizierte Brandsicherheitswachen, dokumentiert für Behörde & Versicherer. 24/7 anrufen.",
    "messageLabel": "Lage, Auflage und Zeitraum Ihrer Brandwache in Würzburg",
    "priceNote": "netto, Richtwerte für Brandwachen in Würzburg und Mainfranken",
    "sections": [
        {"n": 1, "type": "hero",   "src": 1, "surface": DARK},
        {"n": 2, "type": "fields", "src": 2, "surface": LIGHT,
         "icons": ["icon-building", "icon-crane", "icon-alert", "icon-crowd"]},
        {"n": 3, "type": "prose",  "src": 3, "surface": DARK},
        {"n": 4, "type": "why",    "src": 4, "surface": LIGHT,
         "icons": ["icon-guard", "icon-shield-check", "icon-document-check"]},
        {"n": 5, "type": "price",  "src": 5, "surface": DARK},
        {"n": 6, "type": "faq",    "src": 6, "surface": LIGHT},
        {"n": 7, "type": "form",   "src": 7, "surface": DARK},
        {"n": 8, "type": "related", "src": 7, "surface": LIGHT},
    ],
}

# --------------------------------------------------------------------------
# 39 — OBJEKTSCHUTZ WÜRZBURG
# "Struktur-Variation: Prozess früh" — the draft puts the PROCESS first and
# argues the object types second, the reverse of Nürnberg.
# --------------------------------------------------------------------------
OBJEKTSCHUTZ_WUERZBURG = {
    "url": "objektschutz-wuerzburg",
    "service": "Objektschutz",
    "servicePage": "/objektschutz/",
    "city": "Würzburg",
    "geo": "wuerzburg",
    "cityPage": "/sicherheitsdienst-wuerzburg/",
    "prefix": "osw",
    "title": "Objektschutz Würzburg | Ihr Objekt 24/7 bewacht – FRANKONIA",
    "description": "Objektschutz in Würzburg: Bestreifung, Zugangskontrolle & Alarmverfolgung für Einrichtungen, Logistik & Büro. DEKRA-zertifiziert, Angebot in 1 Werktag.",
    "messageLabel": "Objekt, Zeiten und Anforderungen kurz beschreiben",
    "priceNote": "netto, Richtwerte für Objektschutz in Würzburg und Mainfranken",
    "pageNote": """
     ⚠️ THE ONLY ONE OF THE FIFTEEN WITH TWO NO-SEAM ADJACENCIES, and it is
     forced rather than chosen. The draft's variation puts the 3-step process at
     section 2, and `steps` can only be dark (.service-konzept* hardcodes white
     text) while `fields` can only be light (.city-fields__num uses the deep blue
     mix that only clears contrast on white). With the hero dark and Kosten dark,
     no assignment of the four middle sections avoids both: hero → steps share
     black, and Nachweisbar → Kosten share it again. Both are placed where the
     two sections read as one argument, and the Kosten card is white, so the
     lower boundary still changes surface.""",
    "sections": [
        {"n": 1, "type": "hero",   "src": 1, "surface": DARK},
        {"n": 2, "type": "steps",  "src": 2, "surface": DARK, "prose": 1,
         "icons": ["icon-transparency", "icon-plan", "icon-guard"]},
        {"n": 3, "type": "fields", "src": 3, "surface": LIGHT,
         "icons": ["icon-building", "icon-factory", "icon-key", "icon-bag"]},
        {"n": 4, "type": "prose",  "src": 4, "surface": DARK},
        {"n": 5, "type": "price",  "src": 5, "surface": DARK},
        {"n": 6, "type": "faq",    "src": 6, "surface": LIGHT},
        {"n": 7, "type": "form",   "src": 7, "surface": DARK},
        {"n": 8, "type": "related", "src": 7, "surface": LIGHT},
    ],
}

# --------------------------------------------------------------------------
# 40 — WERKSCHUTZ WÜRZBURG
# Two prose sections in a row in the draft (Haftung, Besetzungsmodelle). They
# take OPPOSITE surfaces, which is what keeps them from reading as one flat run.
# --------------------------------------------------------------------------
WERKSCHUTZ_WUERZBURG = {
    "url": "werkschutz-wuerzburg",
    "service": "Werkschutz",
    "servicePage": "/werkschutz/",
    "city": "Würzburg",
    "geo": "wuerzburg",
    "cityPage": "/sicherheitsdienst-wuerzburg/",
    "prefix": "wsw",
    "title": "Werkschutz Würzburg | Industrie-Schutz 24/7 – FRANKONIA",
    "description": "Werkschutz für Würzburger Industrie: Pforte, Rundgänge & Anlagen-Bedienung durch technik-geschulte Kräfte. DEKRA-zertifiziert, Angebot in 1 Werktag.",
    "messageLabel": "Standort, Schichtzeiten und Anforderungen kurz beschreiben",
    "priceNote": "netto, Richtwerte für Werkschutz in Würzburg und Mainfranken",
    "sections": [
        {"n": 1, "type": "hero",   "src": 1, "surface": DARK},
        {"n": 2, "type": "fields", "src": 2, "surface": LIGHT, "prose": 1,
         "icons": ["icon-key", "icon-factory", "icon-shield-check"]},
        {"n": 3, "type": "prose",  "src": 3, "surface": DARK},
        {"n": 4, "type": "prose",  "src": 4, "surface": LIGHT},
        {"n": 5, "type": "price",  "src": 5, "surface": DARK},
        {"n": 6, "type": "faq",    "src": 6, "surface": LIGHT},
        {"n": 7, "type": "form",   "src": 7, "surface": DARK},
        {"n": 8, "type": "related", "src": 7, "surface": LIGHT},
    ],
}

# --------------------------------------------------------------------------
# 41 — BAUSTELLENBEWACHUNG WÜRZBURG
# --------------------------------------------------------------------------
BAUSTELLEN_WUERZBURG = {
    "url": "baustellenbewachung-wuerzburg",
    "service": "Baustellenbewachung",
    "servicePage": "/baustellenbewachung/",
    "city": "Würzburg",
    "geo": "wuerzburg",
    "cityPage": "/sicherheitsdienst-wuerzburg/",
    "prefix": "bbw",
    "title": "Baustellenbewachung Würzburg | Schutz 24/7 – FRANKONIA",
    "description": "Baustellenbewachung in Würzburg: Schutz vor Diebstahl & Vandalismus für Neubau & Sanierung, feste Teams, dokumentiert. Angebot in einem Werktag.",
    "messageLabel": "Baustelle, Bauphase und Zeitraum kurz beschreiben",
    "priceNote": "netto, Richtwerte für Baustellenbewachung in Würzburg",
    "sections": [
        {"n": 1, "type": "hero",   "src": 1, "surface": DARK},
        {"n": 2, "type": "fields", "src": 2, "surface": LIGHT, "prose": 1,
         "icons": ["icon-building", "icon-crane", "icon-factory"]},
        {"n": 3, "type": "prose",  "src": 3, "surface": DARK},
        {"n": 4, "type": "prose",  "src": 4, "surface": LIGHT},
        {"n": 5, "type": "price",  "src": 5, "surface": DARK},
        {"n": 6, "type": "faq",    "src": 6, "surface": LIGHT},
        {"n": 7, "type": "form",   "src": 7, "surface": DARK},
        {"n": 8, "type": "related", "src": 7, "surface": LIGHT},
    ],
}

# --------------------------------------------------------------------------
# 42 — BRANDWACHE ERLANGEN
# --------------------------------------------------------------------------
BRANDWACHE_ERLANGEN = {
    "url": "brandwache-erlangen",
    "service": "Brandwache",
    "servicePage": "/brandwache/",
    "city": "Erlangen",
    "geo": "erlangen",
    "cityPage": "/sicherheitsdienst-erlangen/",
    "prefix": "bwe",
    "notfall": True,
    "title": "Brandwache Erlangen | Brandsicherheitswache 24/7 – FRANKONIA",
    "description": "Brandwache in Erlangen: BMA-Ausfall, Heißarbeiten, Labor-Umgebungen, qualifizierte Brandsicherheitswachen, dokumentiert. Jetzt 24/7 anrufen.",
    "messageLabel": "Lage, Auflage und Zeitraum Ihrer Brandwache in Erlangen",
    "priceNote": "netto, Richtwerte für Brandwachen in Erlangen",
    "sections": [
        {"n": 1, "type": "hero",   "src": 1, "surface": DARK},
        {"n": 2, "type": "fields", "src": 2, "surface": LIGHT,
         "icons": ["icon-shield-check", "icon-building", "icon-flame",
                   "icon-alert"]},
        {"n": 3, "type": "prose",  "src": 3, "surface": DARK},
        {"n": 4, "type": "why",    "src": 4, "surface": LIGHT,
         "icons": ["icon-contact", "icon-guard", "icon-document-check"]},
        {"n": 5, "type": "price",  "src": 5, "surface": DARK},
        {"n": 6, "type": "faq",    "src": 6, "surface": LIGHT},
        {"n": 7, "type": "form",   "src": 7, "surface": DARK},
        {"n": 8, "type": "related", "src": 7, "surface": LIGHT},
    ],
}

# --------------------------------------------------------------------------
# 43 — OBJEKTSCHUTZ ERLANGEN
# --------------------------------------------------------------------------
OBJEKTSCHUTZ_ERLANGEN = {
    "url": "objektschutz-erlangen",
    "service": "Objektschutz",
    "servicePage": "/objektschutz/",
    "city": "Erlangen",
    "geo": "erlangen",
    "cityPage": "/sicherheitsdienst-erlangen/",
    "prefix": "ose",
    "title": "Objektschutz Erlangen | Ihr Objekt 24/7 bewacht – FRANKONIA",
    "description": "Objektschutz in Erlangen: Bestreifung, Zugangskontrolle & Alarmverfolgung für Büro, Forschung & Gewerbe. DEKRA-zertifiziert, Angebot in einem Werktag.",
    "messageLabel": "Objekt, Zeiten und Anforderungen kurz beschreiben",
    "priceNote": "netto, Richtwerte für Objektschutz in Erlangen",
    "sections": [
        {"n": 1, "type": "hero",   "src": 1, "surface": DARK},
        {"n": 2, "type": "fields", "src": 2, "surface": LIGHT, "prose": 1,
         "icons": ["icon-building", "icon-factory", "icon-crowd"]},
        {"n": 3, "type": "points", "src": 3, "surface": DARK, "cols": 4,
         "dotsplit": True, "hinweis": True},
        {"n": 4, "type": "prose",  "src": 4, "surface": LIGHT},
        {"n": 5, "type": "price",  "src": 5, "surface": DARK},
        {"n": 6, "type": "faq",    "src": 6, "surface": LIGHT},
        {"n": 7, "type": "form",   "src": 7, "surface": DARK},
        {"n": 8, "type": "related", "src": 7, "surface": LIGHT},
    ],
}

# --------------------------------------------------------------------------
# 44 — WERKSCHUTZ ERLANGEN
# --------------------------------------------------------------------------
WERKSCHUTZ_ERLANGEN = {
    "url": "werkschutz-erlangen",
    "service": "Werkschutz",
    "servicePage": "/werkschutz/",
    "city": "Erlangen",
    "geo": "erlangen",
    "cityPage": "/sicherheitsdienst-erlangen/",
    "prefix": "wse",
    "title": "Werkschutz Erlangen | Industrie-Schutz 24/7 – FRANKONIA",
    "description": "Werkschutz in Erlangen: Pforte, Rundgänge & Anlagen-Bedienung für Entwicklung und Produktion, technik-geschulte Kräfte. Angebot in einem Werktag.",
    "messageLabel": "Standort, Schichtzeiten und Anforderungen kurz beschreiben",
    "priceNote": "netto, Richtwerte für Werkschutz in Erlangen",
    "sections": [
        {"n": 1, "type": "hero",   "src": 1, "surface": DARK},
        {"n": 2, "type": "fields", "src": 2, "surface": LIGHT, "prose": 1,
         "icons": ["icon-key", "icon-shield-check", "icon-factory"]},
        {"n": 3, "type": "prose",  "src": 3, "surface": DARK},
        {"n": 4, "type": "prose",  "src": 4, "surface": LIGHT},
        {"n": 5, "type": "price",  "src": 5, "surface": DARK},
        {"n": 6, "type": "faq",    "src": 6, "surface": LIGHT},
        {"n": 7, "type": "form",   "src": 7, "surface": DARK},
        {"n": 8, "type": "related", "src": 7, "surface": LIGHT},
    ],
}

# --------------------------------------------------------------------------
# 45 — BAUSTELLENBEWACHUNG ERLANGEN
# --------------------------------------------------------------------------
BAUSTELLEN_ERLANGEN = {
    "url": "baustellenbewachung-erlangen",
    "service": "Baustellenbewachung",
    "servicePage": "/baustellenbewachung/",
    "city": "Erlangen",
    "geo": "erlangen",
    "cityPage": "/sicherheitsdienst-erlangen/",
    "prefix": "bbe",
    "title": "Baustellenbewachung Erlangen | Schutz 24/7 – FRANKONIA",
    "description": "Baustellenbewachung in Erlangen: Schutz für Campus-, Wohn- & Gewerbeprojekte vor Diebstahl & Vandalismus, dokumentiert. Angebot in einem Werktag.",
    "messageLabel": "Baustelle, Bauphase und Zeitraum kurz beschreiben",
    "priceNote": "netto, Richtwerte für Baustellenbewachung in Erlangen",
    "sections": [
        {"n": 1, "type": "hero",   "src": 1, "surface": DARK},
        {"n": 2, "type": "fields", "src": 2, "surface": LIGHT, "prose": 1,
         "icons": ["icon-crane", "icon-building", "icon-shield-check"]},
        {"n": 3, "type": "prose",  "src": 3, "surface": DARK},
        {"n": 4, "type": "prose",  "src": 4, "surface": LIGHT},
        {"n": 5, "type": "price",  "src": 5, "surface": DARK},
        {"n": 6, "type": "faq",    "src": 6, "surface": LIGHT},
        {"n": 7, "type": "form",   "src": 7, "surface": DARK},
        {"n": 8, "type": "related", "src": 7, "surface": LIGHT},
    ],
}

# --------------------------------------------------------------------------
# 46 — BRANDWACHE FÜRTH
# --------------------------------------------------------------------------
BRANDWACHE_FUERTH = {
    "url": "brandwache-fuerth",
    "service": "Brandwache",
    "servicePage": "/brandwache/",
    "city": "Fürth",
    "geo": "fuerth",
    "cityPage": "/sicherheitsdienst-fuerth/",
    "prefix": "bwf",
    "notfall": True,
    "title": "Brandwache Fürth | Brandsicherheitswache 24/7 – FRANKONIA",
    "description": "Brandwache in Fürth: BMA-Ausfall, Heißarbeiten & Veranstaltungen, qualifizierte Brandsicherheitswachen, lückenlos dokumentiert. Jetzt 24/7 anrufen.",
    "messageLabel": "Lage, Auflage und Zeitraum Ihrer Brandwache in Fürth",
    "priceNote": "netto, Richtwerte für Brandwachen in Fürth",
    "sections": [
        {"n": 1, "type": "hero",   "src": 1, "surface": DARK},
        {"n": 2, "type": "fields", "src": 2, "surface": LIGHT,
         "icons": ["icon-crane", "icon-alert", "icon-crowd", "icon-factory"]},
        {"n": 3, "type": "prose",  "src": 3, "surface": DARK},
        {"n": 4, "type": "why",    "src": 4, "surface": LIGHT,
         "icons": ["icon-guard", "icon-building", "icon-document-check"]},
        {"n": 5, "type": "price",  "src": 5, "surface": DARK},
        {"n": 6, "type": "faq",    "src": 6, "surface": LIGHT},
        {"n": 7, "type": "form",   "src": 7, "surface": DARK},
        {"n": 8, "type": "related", "src": 7, "surface": LIGHT},
    ],
}

# --------------------------------------------------------------------------
# 47 — OBJEKTSCHUTZ FÜRTH
# --------------------------------------------------------------------------
OBJEKTSCHUTZ_FUERTH = {
    "url": "objektschutz-fuerth",
    "service": "Objektschutz",
    "servicePage": "/objektschutz/",
    "city": "Fürth",
    "geo": "fuerth",
    "cityPage": "/sicherheitsdienst-fuerth/",
    "prefix": "osf",
    "title": "Objektschutz Fürth | Ihr Objekt 24/7 bewacht – FRANKONIA",
    "description": "Objektschutz in Fürth: Bestreifung, Zugangskontrolle & Alarmverfolgung für Handel, Gewerbe & Büro. DEKRA-zertifiziert, Angebot in einem Werktag.",
    "messageLabel": "Objekt, Zeiten und Anforderungen kurz beschreiben",
    "priceNote": "netto, Richtwerte für Objektschutz in Fürth",
    "sections": [
        {"n": 1, "type": "hero",   "src": 1, "surface": DARK},
        {"n": 2, "type": "fields", "src": 2, "surface": LIGHT,
         "icons": ["icon-bag", "icon-factory", "icon-building", "icon-key"]},
        {"n": 3, "type": "prose",  "src": 3, "surface": DARK, "answer": True},
        # ⚠️ THE ONE PUNCTUATION EDIT IN THESE FIFTEEN PAGES, and it is forced by
        # the draft embedding its link notation MID-SENTENCE: "… samt Preisrahmen
        # — → /sicherheitskonzept/, und binnen eines Werktages …". The arrow is an
        # instruction to the builder, not copy, so it has to come out — and every
        # way of removing it leaves either "— ," or drops the dash. Dropping the
        # dash reads correctly in German and the destination is not lost: it
        # becomes the section's real .service-link. Declared here as a literal
        # find/replace the generator ASSERTS against, so it can never silently
        # match nothing. Flagged for Chris in CLAUDE.md.
        {"n": 4, "type": "prose",  "src": 4, "surface": LIGHT,
         "subs": [("samt Preisrahmen — → /sicherheitskonzept/, und",
                   "samt Preisrahmen, und")],
         "link": "/sicherheitskonzept/"},
        {"n": 5, "type": "price",  "src": 5, "surface": DARK},
        {"n": 6, "type": "faq",    "src": 6, "surface": LIGHT},
        {"n": 7, "type": "form",   "src": 7, "surface": DARK},
        {"n": 8, "type": "related", "src": 7, "surface": LIGHT},
    ],
}

# --------------------------------------------------------------------------
# 48 — WERKSCHUTZ FÜRTH
# The shortest of the fifteen: the draft has only TWO sections between the hero
# and Kosten, so exactly one no-seam adjacency is unavoidable. It is placed at
# prose → Kosten, where the white card supplies the change.
# --------------------------------------------------------------------------
WERKSCHUTZ_FUERTH = {
    "url": "werkschutz-fuerth",
    "service": "Werkschutz",
    "servicePage": "/werkschutz/",
    "city": "Fürth",
    "geo": "fuerth",
    "cityPage": "/sicherheitsdienst-fuerth/",
    "prefix": "wsf",
    "title": "Werkschutz Fürth | Industrie-Schutz 24/7 – FRANKONIA",
    "description": "Werkschutz in Fürth: Pforte, Rundgänge & Anlagen-Bedienung für Produktion und Traditionsbetriebe, technik-geschult. Angebot in einem Werktag.",
    "messageLabel": "Standort, Schichtzeiten und Anforderungen kurz beschreiben",
    "priceNote": "netto, Richtwerte für Werkschutz in Fürth",
    "sections": [
        {"n": 1, "type": "hero",   "src": 1, "surface": DARK},
        {"n": 2, "type": "fields", "src": 2, "surface": LIGHT, "prose": 1,
         "icons": ["icon-key", "icon-clock", "icon-document-check"]},
        {"n": 3, "type": "prose",  "src": 3, "surface": DARK, "answer": True},
        {"n": 4, "type": "price",  "src": 4, "surface": DARK},
        {"n": 5, "type": "faq",    "src": 5, "surface": LIGHT},
        {"n": 6, "type": "form",   "src": 6, "surface": DARK},
        {"n": 7, "type": "related", "src": 6, "surface": LIGHT},
    ],
}

# --------------------------------------------------------------------------
# 49 — BAUSTELLENBEWACHUNG FÜRTH
# --------------------------------------------------------------------------
BAUSTELLEN_FUERTH = {
    "url": "baustellenbewachung-fuerth",
    "service": "Baustellenbewachung",
    "servicePage": "/baustellenbewachung/",
    "city": "Fürth",
    "geo": "fuerth",
    "cityPage": "/sicherheitsdienst-fuerth/",
    "prefix": "bbf",
    "title": "Baustellenbewachung Fürth | Schutz 24/7 – FRANKONIA",
    "description": "Baustellenbewachung in Fürth: Schutz vor Diebstahl & Vandalismus für Nachverdichtung, Sanierung & Gewerbe, dokumentiert. Angebot in einem Werktag.",
    "messageLabel": "Baustelle, Bauphase und Zeitraum kurz beschreiben",
    "priceNote": "netto, Richtwerte für Baustellenbewachung in Fürth",
    "sections": [
        {"n": 1, "type": "hero",   "src": 1, "surface": DARK},
        {"n": 2, "type": "fields", "src": 2, "surface": LIGHT, "prose": 1,
         "icons": ["icon-building", "icon-crane", "icon-factory"]},
        {"n": 3, "type": "prose",  "src": 3, "surface": DARK},
        {"n": 4, "type": "prose",  "src": 4, "surface": LIGHT},
        {"n": 5, "type": "price",  "src": 5, "surface": DARK},
        {"n": 6, "type": "faq",    "src": 6, "surface": LIGHT},
        {"n": 7, "type": "form",   "src": 7, "surface": DARK},
        {"n": 8, "type": "related", "src": 7, "surface": LIGHT},
    ],
}


COMBOS = [
    OBJEKTSCHUTZ_NUERNBERG, WERKSCHUTZ_NUERNBERG, BAUSTELLEN_NUERNBERG,
    BRANDWACHE_WUERZBURG, OBJEKTSCHUTZ_WUERZBURG, WERKSCHUTZ_WUERZBURG,
    BAUSTELLEN_WUERZBURG,
    BRANDWACHE_ERLANGEN, OBJEKTSCHUTZ_ERLANGEN, WERKSCHUTZ_ERLANGEN,
    BAUSTELLEN_ERLANGEN,
    BRANDWACHE_FUERTH, OBJEKTSCHUTZ_FUERTH, WERKSCHUTZ_FUERTH,
    BAUSTELLEN_FUERTH,
]
