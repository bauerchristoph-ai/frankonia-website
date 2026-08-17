#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
THE NINE REMAINING SERVICE PAGES — which draft section becomes which block.

The WORDS are in service_drafts.py, extracted mechanically from the .docx files
and never re-typed. THIS file holds the only thing that needed a judgement call:
what shape each of those sections takes on the page, and on which surface.

WHY THAT IS NOT ONE ANSWER FOR ALL NINE
---------------------------------------
docs/page-conventions.md §8.1 says the twelve service drafts "usan la misma
9-Punkte-Struktur, así que las secciones se mapean 1:1". That was true of the
2026-07-27 drafts. It is NOT true of the v2 copy this project has used since
2026-08-05: six of these nine say so in their own header line — "Struktur bewusst
variiert", "Struktur-Variante 'Notfall-Leistung'", "Variation statt Risiko-Karten",
"Struktur-Variante 'Wirtschaftlichkeit'". They run 8 to 11 sections and half of
them have a section no other page has (Türsteher, Anzug oder Montur, Alarmkette,
Modell-Vergleich, Wann ist eine Brandwache Pflicht?).

Two consequences that this file exists to handle:

  1. THE SEAM LIST IS NOT COPYABLE. A pixel seam's tiles are the colour of the
     section ABOVE it, and two adjacent same-colour sections take no seam at all
     (§9.2). With every page ordering its sections differently, the seams have to
     be DERIVED from each page's own surface sequence — which service-pages.py
     does, from the `surface` values below.

  2. SURFACE IS A CONSTRAINT, NOT A PREFERENCE. Several chassis blocks only work
     on one side, for reasons in the CSS rather than in taste:
         konzept  DARK  — .service-konzept__text hardcodes white-at-0.88
         contact  DARK  — the 6 %-white certs panel, and Alexander Jäger's
                          portrait has its backdrop normalised to #010101 so its
                          edge IS the page (a light version means re-running
                          docs/design-sources/portrait-key-backdrop.py, not CSS)
         price    LIGHT — the Preis-Box is a black glossy panel INSIDE it
         faq      LIGHT — .faq__list--cards is calibrated "on white"
         related  LIGHT — its hover fills black with white text
         form     DARK  — .conversion paints --color-bg itself
     `points`, `scope`, `prose`, `compare` and `certs` are fully token-driven and
     go either way, which is what makes an alternating rhythm possible at all.

⚠️ ONE-SHOT DEV TOOL, like city-pages.py. It writes pages/<slug>.html once; after
that they are ordinary hand-editable pages and re-running would overwrite them.

⚠️ IF YOU EDIT AN FAQ ON A GENERATED PAGE, edit the FAQPage JSON-LD too. They are
emitted from one source here and are byte-identical with markup stripped; nothing
downstream keeps them that way.
"""

# --------------------------------------------------------------------------
# Anchor text for a destination the drafts only ever give as a bare URL.
# The drafts write "→ /sicherheitstechnik/" with no label, so the label is
# written for the build — the same convention the city pages already use. Kept in
# ONE table so the same destination never gets two different names across nine
# pages, which is exactly how internal linking starts looking accidental.
# --------------------------------------------------------------------------
LINK_LABELS = {
    "/werkschutz/": "Zum Werkschutz",
    "/objektschutz/": "Zum Objektschutz",
    "/sicherheitstechnik/": "Zur Sicherheitstechnik",
    "/brandwache/": "Zur Brandwache",
    "/veranstaltungsschutz/": "Zum Veranstaltungsschutz",
    "/baustellenbewachung/": "Zur Baustellenbewachung",
    "/revier-schliessdienst/": "Zum Revier- & Schließdienst",
    "/interventionsdienst/": "Zum Interventionsdienst",
    "/empfangsdienst/": "Zum Empfangsdienst",
    "/kaufhausdetektei/": "Zur Kaufhausdetektei",
    "/sicherheitskonzept/": "So entsteht Ihr Sicherheitskonzept",
    "/sicherheitsdienst-nuernberg/": "Sicherheitsdienst Nürnberg",
    "/ratgeber/brandwache-wann-vorgeschrieben/":
        "Wann eine Brandwache vorgeschrieben ist",
}

# The ten cities every Service node declares as areaServed. Same list, same order
# as /werkschutz/'s — one service is not offered in a different set of cities
# than another, and a per-page list would drift.
AREA_SERVED = ["Bamberg", "Nürnberg", "Würzburg", "Erlangen", "Fürth",
               "Schweinfurt", "Bayreuth", "Coburg", "Ansbach", "Hof"]


# --------------------------------------------------------------------------
# THE NINE PAGES
# --------------------------------------------------------------------------
# Per section: `type` picks the renderer, `src` is the draft section number it
# draws its copy from, `surface` is dark/light. Everything else is an option that
# renderer understands. `n` is only the comment number in the emitted HTML.
#
# `photoH` is each service photo's REAL pixel height. It is not decoration and it
# is not shared: five of the nine are 1217–1225 tall rather than 1227, and a
# single shared aspect-ratio would leave a strip of the frame's own background
# showing under the photo — the defect §8.2 documents for the homepage's own
# services preview, reported by the client as "a grey bar".
#
# ⚠️ EVERY `photoAlt` DESCRIBES THE FILE, NOT THE DRAFT'S REQUESTED SHOT, and the
# two differ on four of the nine. The hero photos are the client's own per-service
# set (assets/images/<slug>.jpg, supplied 2026-07-14, already feeding the
# homepage's services preview), and several were shot for a different moment than
# the Webtext later asked for:
#     objektschutz        draft: Kontrollgang am Gebäude   file: control room
#     sicherheitstechnik  draft: Leitstand/Kamera-Montage  file: a wall camera
#     brandwache          draft: Brandwache mit Feuerlöscher  file: a team briefing
#     kaufhausdetektei    draft: Verkaufsfläche, diskret   file: suited officer at an entrance
# The alt was first written from the DRAFT and it was wrong — caught by looking at
# a contact sheet of all nine, which is the third time on this project that a
# supplied asset has not matched what its name or its brief implied (Bayernwerk.png
# was Stadt Coburg; FemalePointing.png was a different card). Map by the picture.
# Two of the four are worth a line to Chris: a fire watch and a shop floor would
# both photograph the service better than what is there now.
D, L = "dark", "light"

SERVICES = [
    # ======================================================================
    {
        "slug": "objektschutz",
        "name": "Objektschutz",
        "prefix": "ob",
        "photoH": 1227,
        "serviceType": "Objektschutz",
        "schemaDesc": (
            "Objektschutz für Gebäude, Gelände und Einrichtungen in Franken: "
            "dokumentierte Bestreifung, Zugangskontrolle, Alarmverfolgung und "
            "Technik-Bedienung durch IHK-qualifizierte Kräfte nach § 34a GewO."
        ),
        "messageLabel": "Objekt und gewünschte Bewachungszeiten",
        "priceNote": "netto, je nach Qualifikation, Einsatzzeit und Umfang",
        "priceTicks": ["Kostenfreie Begehung vorab",
                       "Transparente Kalkulation ohne versteckte Posten"],
        # ⚠️ The draft asks for a "Sicherheitskraft bei Kontrollgang am Gebäude"
        # and the file this project assigns to Objektschutz is a CONTROL ROOM.
        # The alt describes the file. See the note above SERVICES.
        "photoAlt": ("FRANKONIA Sicherheitskräfte in der Einsatzleitstelle an "
                     "Monitoren mit den Kamerabildern eines bewachten Objekts"),
        "sections": [
            {"n": 1,  "type": "hero",    "src": 1,  "surface": D},
            # prose: 1 — the Risiko intro opens on a quotation
            # („Bei uns wurde noch nie etwas gestohlen": …), which parses exactly
            # like a "Label: text" card row. Hence the declared split.
            {"n": 2,  "type": "points",  "src": 2,  "surface": L, "cols": 4,
             "prose": 1},
            # Centred (client 2026-08-17): the Pain-Aufhänger H2 and its
            # "Vertrauen entsteht nicht durch Versprechen …" lead-in read as the
            # section's statement, so they sit on the axis; the three cards below
            # keep their own left edge.
            {"n": 3,  "type": "points",  "src": 3,  "surface": D, "cols": 3,
             "prose": 1, "centred": True},
            {"n": 4,  "type": "scope",   "src": 4,  "surface": L,
             "highlight": True},
            {"n": 5,  "type": "points",  "src": 5,  "surface": D, "cols": 4,
             "numbered": True},
            # ⚠️ `titleless` FIXES A REAL LAYOUT DEFECT, it is not a style choice.
            # Three of these four process lines have no label; the fourth reads
            # "Schriftliches Konzept: Personal, Zeiten, Technik-Empfehlung", so it
            # was the only one rendered with a bold title plus a second line. In a
            # two-column grid that made row 1 twice as tall as row 2 and opened a
            # visible hole between them (client 2026-08-17: "hay mucho espacio en
            # blanco entre los items"). All four render the same way now, colon
            # included, exactly as the draft writes them.
            {"n": 6,  "type": "scope",   "src": 6,  "surface": L, "prose": 1,
             "titleless": True, "centred": True,
             "link": "/sicherheitskonzept/"},
            {"n": 7,  "type": "steps",   "src": 7,  "surface": D},
            {"n": 8,  "type": "price",   "src": 8,  "surface": L, "prose": 1},
            {"n": 9,  "type": "contact", "src": 9,  "surface": D},
            {"n": 10, "type": "faq",     "src": 10, "surface": L},
            {"n": 11, "type": "form",    "src": 11, "surface": D},
            {"n": 12, "type": "related", "src": 11, "surface": L,
             "groups": [
                 ("Verwandte Leistungen", [
                     ("/werkschutz/", "Werkschutz"),
                     ("/revier-schliessdienst/", "Revier- & Schließdienst"),
                     ("/sicherheitstechnik/", "Sicherheitstechnik")]),
                 ("Objektschutz in Ihrer Stadt", [
                     ("/objektschutz-nuernberg/", "Objektschutz Nürnberg"),
                     ("/sicherheitsdienst-nuernberg/", "Sicherheitsdienst Nürnberg"),
                     ("/sicherheitsdienst-wuerzburg/", "Sicherheitsdienst Würzburg"),
                     ("/sicherheitsdienst-bamberg/", "Sicherheitsdienst Bamberg")])]},
        ],
    },
    # ======================================================================
    {
        "slug": "sicherheitstechnik",
        "name": "Sicherheitstechnik",
        "prefix": "st",
        "photoH": 1227,
        "serviceType": "Sicherheitstechnik",
        "schemaDesc": (
            "Sicherheitstechnik aus Franken: Videoüberwachung, "
            "Einbruchmeldeanlagen, Brandmeldetechnik, Zutrittskontrolle und "
            "mechanische Sicherheitstechnik — herstellerunabhängig geplant, "
            "installiert und gewartet, kombiniert mit Sicherheitspersonal."
        ),
        "messageLabel": "Objekt und Anliegen",
        # ⚠️ NO PRICE RANGE, and that is the draft's own decision: "Kosten
        # projektbasiert statt Stundensatz". So this page's Preis-Box shows the
        # process, not a number, and its Service node emits NO `offers` — a
        # schema price this page deliberately does not state would be a claim.
        "priceRange": "Projektbasiert",
        "priceNote": "nach Objektgröße, Schutzziel und Systemumfang",
        "priceTicks": ["Kostenfreie Begehung + Konzept mit Kostenrahmen",
                       "Angebot innerhalb eines Werktages"],
        "noOffers": True,
        "photoAlt": ("Überwachungskamera an der Außenfassade eines "
                     "Gewerbeobjekts"),
        "sections": [
            {"n": 1, "type": "hero",    "src": 1, "surface": D},
            {"n": 2, "type": "points",  "src": 2, "surface": L, "cols": 3,
             "prose": 1},
            {"n": 3, "type": "points",  "src": 3, "surface": D, "cols": 5},
            {"n": 4, "type": "points",  "src": 4, "surface": L, "cols": 3,
             "prose": 1},
            {"n": 5, "type": "steps",   "src": 5, "surface": D},
            {"n": 6, "type": "price",   "src": 6, "surface": L, "prose": 1},
            {"n": 7, "type": "contact", "src": 7, "surface": D},
            {"n": 8, "type": "faq",     "src": 8, "surface": L},
            {"n": 9, "type": "form",    "src": 9, "surface": D},
            {"n": 10, "type": "related", "src": 9, "surface": L,
             "groups": [
                 ("Verwandte Leistungen", [
                     ("/objektschutz/", "Objektschutz"),
                     ("/werkschutz/", "Werkschutz"),
                     ("/interventionsdienst/", "Interventionsdienst")]),
                 ("In Ihrer Region", [
                     ("/sicherheitsdienst-nuernberg/", "Sicherheitsdienst Nürnberg"),
                     ("/sicherheitsdienst-bamberg/", "Sicherheitsdienst Bamberg"),
                     ("/sicherheitsdienst-wuerzburg/", "Sicherheitsdienst Würzburg")])]},
        ],
    },
    # ======================================================================
    {
        "slug": "brandwache",
        "name": "Brandwache",
        "prefix": "bw",
        "photoH": 1217,
        "serviceType": "Brandwache",
        "schemaDesc": (
            "Brandwache und Brandsicherheitswache in Franken: Ersatzmaßnahme bei "
            "BMA-Ausfall, Absicherung von Heißarbeiten und behördlich "
            "aufgelegte Brandsicherheitswachen, kurzfristig gestellt und "
            "lückenlos dokumentiert."
        ),
        "messageLabel": "Zeitraum, Objekt und Auflage",
        "priceNote": "netto, je nach Qualifikation, Einsatzzeit und Vorlauf",
        "priceTicks": ["Kurzfristig verfügbar nach Absprache",
                       "Dokumentation für Behörde & Versicherung inklusive"],
        # ⚠️ THE ONE APPROVED CTA INVERSION ON THE WHOLE SITE (client rule G2,
        # 2026-08-14: the phone leads on Brandwache and Brandwache only). It is
        # the draft's own instruction — "CTA primär: Jetzt anrufen" — and it is
        # right for the single service someone reaches mid-incident. The Preis-Box
        # CTA is inverted with it, for the same reason.
        # Do NOT normalise this to match the other eight.
        "ctaPhoneFirst": True,
        "priceCta": "Jetzt anrufen: {{phone.display}}",
        "priceCtaHref": "{{phone.href}}",
        "photoAlt": ("FRANKONIA Einsatzleitung im Briefing mit Sicherheitskräften "
                     "vor einem Industriegebäude"),
        "sections": [
            {"n": 1, "type": "hero",    "src": 1, "surface": D},
            # prose: 1 — the GEO answer sentence, which has to stay a paragraph
            # directly under the question H2, not become a fifth card.
            {"n": 2, "type": "points",  "src": 2, "surface": L, "cols": 4,
             "prose": 1, "answer": True,
             "link": "/ratgeber/brandwache-wann-vorgeschrieben/"},
            {"n": 3, "type": "scope",   "src": 3, "surface": D, "hinweis": True},
            {"n": 4, "type": "points",  "src": 4, "surface": L, "cols": 3,
             "prose": 1},
            {"n": 5, "type": "points",  "src": 5, "surface": D, "cols": 4},
            {"n": 6, "type": "price",   "src": 6, "surface": L, "prose": 1},
            {"n": 7, "type": "steps",   "src": 7, "surface": D},
            {"n": 8, "type": "contact", "src": 8, "surface": D},
            {"n": 9, "type": "faq",     "src": 9, "surface": L},
            {"n": 10, "type": "form",   "src": 10, "surface": D},
            {"n": 11, "type": "related", "src": 10, "surface": L,
             "groups": [
                 ("Verwandte Leistungen", [
                     ("/objektschutz/", "Objektschutz"),
                     ("/veranstaltungsschutz/", "Veranstaltungsschutz"),
                     ("/baustellenbewachung/", "Baustellenbewachung")]),
                 ("Brandwache in Ihrer Stadt", [
                     ("/brandwache-nuernberg/", "Brandwache Nürnberg"),
                     ("/brandwache-wuerzburg/", "Brandwache Würzburg"),
                     ("/brandwache-erlangen/", "Brandwache Erlangen"),
                     ("/brandwache-fuerth/", "Brandwache Fürth")])]},
        ],
    },
    # ======================================================================
    {
        "slug": "kaufhausdetektei",
        "name": "Kaufhausdetektei",
        "prefix": "kd",
        "photoH": 1217,
        "serviceType": "Kaufhausdetektei",
        "schemaDesc": (
            "Ladendetektive und Kaufhausdetektei für den Einzelhandel in "
            "Franken: zivile Beobachtung auf der Fläche, rechtssichere Ansprache "
            "nach § 127 StPO und gerichtsfeste Dokumentation."
        ),
        "messageLabel": "Markt und Situation",
        "priceNote": "netto, je nach Einsatzmodell",
        "priceTicks": ["Einsatzplan auf Basis Ihrer Inventurdaten",
                       "Angebot in 1 Werktag"],
        "photoAlt": ("FRANKONIA Sicherheitskraft im Anzug am Eingang eines "
                     "Kaufhauses"),
        "sections": [
            {"n": 1, "type": "hero",    "src": 1, "surface": D},
            # The draft's "Zahlen-Kacheln" are three bare statements, not
            # "Label: text" rows, so they render as points WITHOUT a title —
            # the accent rule then does the work the title would.
            {"n": 2, "type": "points",  "src": 2, "surface": L, "cols": 3,
             "prose": 1, "titleless": True},
            {"n": 3, "type": "scope",   "src": 3, "surface": D},
            {"n": 4, "type": "steps",   "src": 4, "surface": D},
            {"n": 5, "type": "points",  "src": 5, "surface": L, "cols": 3,
             "prose": 1},
            {"n": 6, "type": "price",   "src": 6, "surface": L, "prose": 1},
            {"n": 7, "type": "certs",   "src": 7, "surface": D},
            {"n": 8, "type": "faq",     "src": 8, "surface": L},
            {"n": 9, "type": "form",    "src": 9, "surface": D},
            {"n": 10, "type": "related", "src": 9, "surface": L,
             "groups": [
                 ("Verwandte Leistungen", [
                     ("/objektschutz/", "Objektschutz"),
                     ("/empfangsdienst/", "Empfangsdienst"),
                     ("/sicherheitstechnik/", "Sicherheitstechnik")]),
                 ("In Ihrer Stadt", [
                     ("/sicherheitsdienst-nuernberg/", "Sicherheitsdienst Nürnberg"),
                     ("/sicherheitsdienst-wuerzburg/", "Sicherheitsdienst Würzburg"),
                     ("/sicherheitsdienst-bamberg/", "Sicherheitsdienst Bamberg")])]},
        ],
    },
    # ======================================================================
    {
        "slug": "veranstaltungsschutz",
        "name": "Veranstaltungsschutz",
        "prefix": "vs",
        "photoH": 1223,
        "serviceType": "Veranstaltungsschutz",
        "schemaDesc": (
            "Veranstaltungsschutz in Franken: Einlasskontrolle, Ordnerdienst "
            "nach Versammlungsstättenverordnung, Deeskalation, Türsteher für "
            "Gastronomie und Clubs sowie Unterstützung beim Sicherheitskonzept."
        ),
        "messageLabel": "Veranstaltung, Datum und erwartete Besucherzahl",
        "priceNote": "netto, je Kraft",
        "priceTicks": ["Personalempfehlung nach Planungsgespräch",
                       "Angebot in 1 Werktag"],
        "photoAlt": ("FRANKONIA Sicherheitskraft vor dem Publikum einer "
                     "Abendveranstaltung"),
        "sections": [
            {"n": 1, "type": "hero",    "src": 1, "surface": D},
            {"n": 2, "type": "points",  "src": 2, "surface": L, "cols": 3,
             "prose": 1},
            {"n": 3, "type": "scope",   "src": 3, "surface": D},
            # The Türsteher section: one paragraph, three tick lines, then the
            # draft's Hinweis-Box, which quotes the client's own Top-Solution
            # statement verbatim ("Gäste sollen bei unprofessionellem Auftreten
            # Feedback direkt dem Sicherheitsdienst geben, nicht Ihnen").
            {"n": 4, "type": "prose",   "src": 4, "surface": L,
             "points": 3, "titleless": True, "hinweisBox": True},
            # prose: 2 — the GEO answer (§ 43 MVStättVO, the 590/mo cluster) plus
            # the "die meisten Sicherheitsprobleme entstehen in der Planung" line,
            # then four planning steps on the rail.
            {"n": 5, "type": "steps",   "src": 5, "surface": D, "prose": 2},
            {"n": 6, "type": "points",  "src": 6, "surface": L, "cols": 5},
            {"n": 7, "type": "price",   "src": 7, "surface": L, "prose": 1},
            {"n": 8, "type": "certs",   "src": 8, "surface": D},
            {"n": 9, "type": "faq",     "src": 9, "surface": L},
            {"n": 10, "type": "form",   "src": 10, "surface": D},
            {"n": 11, "type": "related", "src": 10, "surface": L,
             "groups": [
                 ("Verwandte Leistungen", [
                     ("/brandwache/", "Brandwache"),
                     ("/empfangsdienst/", "Empfangsdienst"),
                     ("/objektschutz/", "Objektschutz")]),
                 ("In Ihrer Stadt", [
                     ("/sicherheitsdienst-nuernberg/", "Sicherheitsdienst Nürnberg"),
                     ("/sicherheitsdienst-bamberg/", "Sicherheitsdienst Bamberg"),
                     ("/sicherheitsdienst-wuerzburg/", "Sicherheitsdienst Würzburg")])]},
        ],
    },
    # ======================================================================
    {
        "slug": "baustellenbewachung",
        "name": "Baustellenbewachung",
        "prefix": "bb2",
        "photoH": 1222,
        "serviceType": "Baustellenbewachung",
        "schemaDesc": (
            "Baustellenbewachung in Franken gegen Diebstahl, Vandalismus und "
            "unbefugten Zutritt: Nacht- und Wochenendbewachung, Kontrollgänge zu "
            "variierenden Zeiten, Zufahrtskontrolle und ergänzende Technik."
        ),
        "messageLabel": "Baustelle, Bauphase und Zeitraum",
        "priceNote": "netto; Revierkontrollen je Fahrt",
        "priceTicks": ["Konzept nach Bauphasen", "Angebot in 1 Werktag"],
        "photoAlt": ("FRANKONIA Sicherheitskraft mit Schutzhelm und Funkgerät "
                     "auf einer Baustelle"),
        "sections": [
            {"n": 1, "type": "hero",    "src": 1, "surface": D},
            {"n": 2, "type": "points",  "src": 2, "surface": L, "cols": 3,
             "prose": 1},
            {"n": 3, "type": "scope",   "src": 3, "surface": D},
            # The draft's mandatory Abgrenzung against "baustellenüberwachung"
            # (720/mo, an intent warning in its own header): one paragraph, no
            # list, answering in the first two sentences.
            {"n": 4, "type": "prose",   "src": 4, "surface": L, "answer": True},
            {"n": 5, "type": "points",  "src": 5, "surface": L, "cols": 3,
             "prose": 1},
            {"n": 6, "type": "steps",   "src": 6, "surface": D},
            {"n": 7, "type": "price",   "src": 7, "surface": L, "prose": 1},
            {"n": 8, "type": "contact", "src": 8, "surface": D},
            {"n": 9, "type": "faq",     "src": 9, "surface": L},
            {"n": 10, "type": "form",   "src": 10, "surface": D},
            {"n": 11, "type": "related", "src": 10, "surface": L,
             "groups": [
                 ("Verwandte Leistungen", [
                     ("/brandwache/", "Brandwache"),
                     ("/revier-schliessdienst/", "Revier- & Schließdienst"),
                     ("/sicherheitstechnik/", "Sicherheitstechnik")]),
                 ("In Ihrer Stadt", [
                     ("/sicherheitsdienst-nuernberg/", "Sicherheitsdienst Nürnberg"),
                     ("/sicherheitsdienst-wuerzburg/", "Sicherheitsdienst Würzburg"),
                     ("/sicherheitsdienst-bamberg/", "Sicherheitsdienst Bamberg")])]},
        ],
    },
    # ======================================================================
    {
        "slug": "revier-schliessdienst",
        "name": "Revier- & Schließdienst",
        "prefix": "rs",
        "photoH": 1225,
        "serviceType": "Revier- und Schließdienst",
        "schemaDesc": (
            "Revier- und Schließdienst in Stadt und Landkreis Bamberg: "
            "Kontrollfahrten und Verschlussrunden zu variierenden Zeiten, mit "
            "Checkpoint-Nachweis im Wächterkontrollsystem."
        ),
        "messageLabel": "Objekt und Adresse",
        # ⚠️ Priced PER CONTROL RUN, not per hour — the draft is explicit
        # ("wird je Kontrollfahrt bzw. Runde kalkuliert, nicht je Stunde"), so
        # the box carries no hourly range and the Service node emits no `offers`.
        "priceRange": "Je Kontrollfahrt",
        "priceNote": "netto, nach Frequenz, Umfang und Lage im Revier",
        "priceTicks": ["Objektschutz-Vergleichsrechnung inklusive",
                       "Angebot in 1 Werktag"],
        "noOffers": True,
        # ⚠️ The ONE service with a restricted area: Raum Bamberg only (the draft
        # calls it out twice and /einsatzgebiete/'s FAQ says so too). Its Service
        # node therefore declares Bamberg alone — publishing the ten-city list
        # here would promise coverage the page's own FAQ denies.
        "areaServed": ["Bamberg"],
        "photoAlt": ("FRANKONIA Streifenfahrzeug bei einer Kontrollfahrt vor "
                     "einem Gewerbeobjekt"),
        "sections": [
            {"n": 1, "type": "hero",    "src": 1, "surface": D},
            {"n": 2, "type": "points",  "src": 2, "surface": L, "cols": 3,
             "prose": 1},
            {"n": 3, "type": "scope",   "src": 3, "surface": D},
            # The draft's own two-column Vergleichstabelle: 2 column headings
            # followed by four (criterion, value A, value B) triples.
            {"n": 4, "type": "compare", "src": 4, "surface": L},
            {"n": 5, "type": "prose",   "src": 5, "surface": D},
            {"n": 6, "type": "price",   "src": 6, "surface": L, "prose": 1},
            {"n": 7, "type": "certs",   "src": 7, "surface": D},
            {"n": 8, "type": "faq",     "src": 8, "surface": L},
            {"n": 9, "type": "form",    "src": 9, "surface": D},
            {"n": 10, "type": "related", "src": 9, "surface": L,
             "groups": [
                 ("Verwandte Leistungen", [
                     ("/objektschutz/", "Objektschutz"),
                     ("/interventionsdienst/", "Interventionsdienst"),
                     ("/sicherheitstechnik/", "Sicherheitstechnik")]),
                 ("In Ihrer Stadt", [
                     ("/sicherheitsdienst-bamberg/", "Sicherheitsdienst Bamberg"),
                     ("/sicherheitsdienst-nuernberg/", "Sicherheitsdienst Nürnberg"),
                     ("/sicherheitsdienst-erlangen/", "Sicherheitsdienst Erlangen")])]},
        ],
    },
    # ======================================================================
    {
        "slug": "empfangsdienst",
        "name": "Empfangsdienst",
        "prefix": "ed",
        "photoH": 1227,
        "serviceType": "Empfangsdienst",
        "schemaDesc": (
            "Empfangs- und Pfortendienst in Franken: Besuchermanagement, "
            "Ausweiskontrolle, Telefon- und Postdienste durch feste Stammkräfte, "
            "die nach § 34a GewO qualifiziert und deeskalations-geschult sind."
        ),
        "messageLabel": "Standort und Aufgabenprofil",
        "priceNote": "netto, je nach Profil und Zeiten",
        "priceTicks": ["Personalauswahl mit Ihrer Mitsprache",
                       "Angebot in 1 Werktag"],
        "photoAlt": ("FRANKONIA Mitarbeiter am Pfortenfenster weist einen Besucher "
                     "ein"),
        "sections": [
            {"n": 1, "type": "hero",    "src": 1, "surface": D},
            # Two paragraphs plus the draft's Solution-Box, which quotes the
            # client's Top-Solution statement verbatim.
            {"n": 2, "type": "prose",   "src": 2, "surface": L,
             "highlight": True},
            {"n": 3, "type": "scope",   "src": 3, "surface": D},
            {"n": 4, "type": "prose",   "src": 4, "surface": L, "points": 3,
             "titleless": True},
            {"n": 5, "type": "points",  "src": 5, "surface": D, "cols": 4},
            {"n": 6, "type": "price",   "src": 6, "surface": L, "prose": 1},
            {"n": 7, "type": "certs",   "src": 7, "surface": D},
            {"n": 8, "type": "faq",     "src": 8, "surface": L},
            {"n": 9, "type": "form",    "src": 9, "surface": D},
            {"n": 10, "type": "related", "src": 9, "surface": L,
             "groups": [
                 ("Verwandte Leistungen", [
                     ("/werkschutz/", "Werkschutz"),
                     ("/objektschutz/", "Objektschutz"),
                     ("/kaufhausdetektei/", "Kaufhausdetektei")]),
                 ("In Ihrer Stadt", [
                     ("/sicherheitsdienst-nuernberg/", "Sicherheitsdienst Nürnberg"),
                     ("/sicherheitsdienst-bamberg/", "Sicherheitsdienst Bamberg"),
                     ("/sicherheitsdienst-erlangen/", "Sicherheitsdienst Erlangen")])]},
        ],
    },
    # ======================================================================
    {
        "slug": "interventionsdienst",
        "name": "Interventionsdienst",
        "prefix": "id",
        "photoH": 1227,
        "serviceType": "Interventionsdienst",
        "schemaDesc": (
            "Interventionsdienst mit Alarmverfolgung im Umkreis von Bamberg: "
            "qualifizierte Interventionskräfte fahren Ihr Objekt bei Alarm an, "
            "kontrollieren nach Interventionsplan und dokumentieren jeden Einsatz."
        ),
        "messageLabel": "Objekt und Alarmanlagen-Typ",
        # ⚠️ Two components, no hourly rate — the draft prices a monthly standby
        # fee plus a per-callout fee, so again no number in the box and no
        # `offers` in the schema.
        "priceRange": "Bereitschaft + Einsatz",
        "priceNote": "monatliche Bereitschaftspauschale zzgl. Einsatzpauschale, netto",
        "priceTicks": ["Interventionsplan inklusive", "Angebot in 1 Werktag"],
        "noOffers": True,
        "photoAlt": ("Zwei FRANKONIA Interventionskräfte am Einsatzfahrzeug vor "
                     "einem Objekt"),
        "sections": [
            {"n": 1, "type": "hero",    "src": 1, "surface": D},
            # One paragraph, then the draft's before/after pair
            # ("Ohne Intervention: …" / "Mit FRANKONIA Intervention: …").
            {"n": 2, "type": "prose",   "src": 2, "surface": L, "points": 2},
            # The Alarmkette — five steps, this page's Kernsektion.
            {"n": 3, "type": "steps",   "src": 3, "surface": D},
            {"n": 4, "type": "scope",   "src": 4, "surface": L},
            {"n": 5, "type": "price",   "src": 5, "surface": L, "prose": 1},
            {"n": 6, "type": "certs",   "src": 6, "surface": D},
            {"n": 7, "type": "faq",     "src": 7, "surface": L},
            {"n": 8, "type": "form",    "src": 8, "surface": D},
            {"n": 9, "type": "related", "src": 8, "surface": L,
             "groups": [
                 ("Verwandte Leistungen", [
                     ("/sicherheitstechnik/", "Sicherheitstechnik"),
                     ("/revier-schliessdienst/", "Revier- & Schließdienst"),
                     ("/objektschutz/", "Objektschutz")]),
                 ("In Ihrer Region", [
                     ("/sicherheitsdienst-bamberg/", "Sicherheitsdienst Bamberg"),
                     ("/sicherheitsdienst-nuernberg/", "Sicherheitsdienst Nürnberg"),
                     ("/sicherheitsdienst-erlangen/", "Sicherheitsdienst Erlangen")])]},
        ],
    },
]
