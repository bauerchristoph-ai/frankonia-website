# -*- coding: utf-8 -*-
"""
The nine remaining city pages, as data. Read by city-pages.py.

EVERY GERMAN STRING BELOW IS VERBATIM from that city's Webtext in
NewVersionCopiesFrankonia/ (Stand 04.08.2026). The only text NOT from a draft is
marked `# UI` at the line, and there are exactly four kinds of it:

  · "Ebenfalls verfügbar"  — the group-2 label in the Leistungen section, the
    same three words Nürnberg uses, in the same place, for the same reason.
  · the Umgebung H2 + lede where a draft only lists "Nachbarorte: X · Y". The
    H2 pattern is Bamberg's own ("Sicherheitsdienst rund um <Stadt>") and the
    lede is Nürnberg's approved one with the place names swapped.
  · the Brandwache eyebrow, which repeats its own H2's words as a label — the
    same reversible UI furniture Nürnberg carries.
  · the Preis-Box `note`, which is a caption on a shared component.

NUMBERS ARE TOKENS, NEVER TYPED. Client rule G10: every price on the site comes
from content/values.json, so "26 bis 32 Euro" is written {{price.min}} bis
{{price.max}} Euro and "26–32 €/Std." is rendered from {{price.range}}
{{price.unit}}. The drafts' en dash becomes the hyphen the client fixed for the
price box on 2026-08-03. Phone numbers are {{phone.display}} and every one of
them is a tel: link (rule G4).

LINKS ONLY WHERE THE DRAFT PUTS ONE. Nürnberg's Einsatzfelder each close with a
service link that was INFERRED from the copy, and that inference later had to be
corrected (it linked a Raum-Bamberg-only service from a Nürnberg page). So here a
field item gets a link if and only if its draft line carries a "→ /url/", which
needs no confirmation from anyone.
"""

# --------------------------------------------------------------------------
# 14 — WÜRZBURG
# Struktur bewusst variiert: Einstieg über den Wirtschaftsraum, DANN die
# Warum-Argumentation. So the Einsatzfelder come before the cards, which is the
# reverse of Nürnberg — and the reason the seam list is computed rather than
# copied.
# --------------------------------------------------------------------------
WUERZBURG = {
    "url": "sicherheitsdienst-wuerzburg",
    "geo": "wuerzburg",
    "name": "Würzburg",
    "prefix": "wz",
    "docx": "2026-08-04 Webtext 14 Stadt Wuerzburg.docx",
    "title": "Sicherheitsdienst Würzburg | 24/7 Wachdienst – FRANKONIA",
    "description": "Sicherheitsdienst für Würzburg: Objektschutz, Baustellenbewachung, Brandwache & Veranstaltungsschutz. DEKRA-zertifiziert, Angebot innerhalb eines Werktages.",
    "pageNote": """
     ⚠️ SECTION ORDER IS THE DRAFT'S, NOT NÜRNBERG'S. Webtext 14 says
     "Struktur bewusst variiert ggü. Nürnberg: Einstieg über den Wirtschaftsraum,
     dann Warum-Argumentation" — so the five Einsatzfelder come FIRST and the
     Warum cards second. Both are light sections, so they share a surface and
     take no seam between them (§9.2). That is deliberate, not a missing seam.
""",
    "sections": [
        {
            "type": "hero", "n": 1,
            "badge": "Einsatzgebiet Würzburg & Mainfranken, fester Ansprechpartner 24/7",
            "badgeNote": 'The badge says "Einsatzgebiet", which is the UWG disclosure of §10.1 and\n         the draft\'s own copy — it carries information nothing else on the first\n         screen carries.',
            "h1": "Sicherheitsdienst Würzburg",
            "subline": "Objektschutz, Baustellenbewachung, Brandwache und Veranstaltungsschutz für Würzburg und Mainfranken — DEKRA-zertifiziert.",
            "ticks": [
                "Feste Teams für laufende Aufträge, direkt in Ihrem Objekt",
                "Digital dokumentiert: Wachbuch, Checkpoints, Reports",
                "Unverbindliches Angebot innerhalb eines Werktages",
            ],
        },
        {
            "type": "fields", "n": 2, "comment": "DER WIRTSCHAFTSRAUM (LOKALE EINSATZFELDER)",
            "eyebrow": "Vor Ort im Einsatz",  # UI
            "h2": "Wo Sicherheitsdienste in Würzburg gebraucht werden",
            "lede": "Universitätsstadt, Klinikstandort, Industrie- und Logistikdrehscheibe, Besucher-Magnet: Würzburg hat viele Gesichter, und jedes eigene Sicherheitsanforderungen.",
            "items": [
                {"title": "Kliniken, Universität und Einrichtungen in Würzburg",
                 "text": "Das Universitätsklinikum und die Hochschul-Standorte gehören zu den größten Arbeitgebern Mainfrankens: Publikumsverkehr rund um die Uhr, sensible Bereiche, Nachtbetrieb. Hier zählen geschulte, deeskalationssichere Kräfte mit sauberer Dokumentation — Erfahrung, die FRANKONIA aus dem Klinikumfeld der Sozialstiftung Bamberg mitbringt."},
                {"title": "Industrie und Gewerbe im Würzburger Osten",
                 "text": "In den Gewerbegebieten im Osten der Stadt und entlang des Mains produzieren und lagern Traditionsunternehmen wie der Druckmaschinenbau, mit Werten, die nach Feierabend geschützt werden wollen: Werkschutz, Verschlussrunden und dokumentierte Kontrollgänge.",
                 "link": ("Werkschutz in Würzburg", "/werkschutz-wuerzburg/")},
                {"title": "Logistik am Autobahnkreuz A3/A7",
                 "text": "Die Lage am Kreuz der Nord-Süd- und Ost-West-Achsen macht den Raum Würzburg zum Logistikpunkt — Speditionen und Lager mit durchgehendem Verkehr brauchen Zufahrtskontrolle und Kontrollgänge zu variierenden Zeiten."},
                {"title": "Innenstadt-Handel zwischen Dom und Marktplatz",
                 "text": "In den Einkaufslagen um Domstraße und Schönbornstraße ist Ladendiebstahl Alltag, zivile Kaufhausdetektive senken die Inventurdifferenz messbar, gerade zur Weihnachtszeit und in der Festsaison.",
                 "link": ("Kaufhausdetektei in Würzburg", "/kaufhausdetektei/")},
                {"title": "Veranstaltungen und Feste in Würzburg",
                 "text": "Vom Kiliani-Volksfest über Weinfeste bis zu Kongressen: Veranstaltungsschutz in Würzburg heißt Einlass, Ordnerdienst und behördliche Auflagen, geplant mit Vorlauf, besetzt mit geschulten Kräften."},
            ],
        },
        {
            "type": "why", "n": 3, "comment": "WARUM FRANKONIA IN WÜRZBURG",
            "h2": "Warum Würzburger Auftraggeber mit FRANKONIA arbeiten",
            "lede": "Würzburg ist festes Einsatzgebiet von FRANKONIA, mit laufenden Aufträgen in Stadt und Region. Was Sie davon haben:",
            "cards": [
                {"icon": "icon-building", "title": "Mittelstand mit Verbindlichkeit",
                 "text": "Sie sprechen direkt mit dem Inhaber-geführten Unternehmen, nicht mit der Vertriebsabteilung eines Konzerns. Entscheidungen fallen schnell, und gelten."},
                {"icon": "icon-contact", "title": "Feste Kräfte im Objekt, Leitung erreichbar",
                 "text": "Bei laufenden Aufträgen arbeiten Ihre Sicherheitskräfte fest vor Ort in Würzburg; Einsatz- und Bereichsleitung erreichen Sie 24/7 direkt."},
                {"icon": "icon-shield-check", "title": "Zertifiziert und geprüft",
                 "text": "DIN 77200-1, ISO 9001, DEKRA, dieselben Standards, mit denen wir über 300 Kunden in Franken betreuen, gelten auch für jeden Würzburger Auftrag."},
            ],
        },
        {
            "type": "services", "n": 4, "comment": "LEISTUNGEN IN WÜRZBURG",
            "h2": "Unsere Sicherheitsdienstleistungen in Würzburg",
            "lede": "Vom Werkschutz für Industrie und Produktion bis zur kurzfristigen Brandwache: Alle FRANKONIA Leistungen stehen Ihnen auch in Würzburg und Mainfranken zur Verfügung.",
            "cards": [
                {"name": "Werkschutz in Würzburg", "href": "/werkschutz-wuerzburg/",
                 "text": "Pfortendienst und Rundgänge für Industrie und Produktion."},
                {"name": "Objektschutz in Würzburg", "href": "/objektschutz-wuerzburg/",
                 "text": "Bestreifung, Zugangskontrolle, Alarmverfolgung für Gewerbe, Verwaltung und Einrichtungen."},
                {"name": "Baustellenbewachung in Würzburg", "href": "/baustellenbewachung-wuerzburg/",
                 "text": "Schutz für Baustellen in Stadt und Landkreis, flexibel je Bauphase."},
                {"name": "Brandwache in Würzburg", "href": "/brandwache-wuerzburg/",
                 "text": "Kurzfristige Brandsicherheitswachen bei BMA-Ausfall und Heißarbeiten."},
            ],
            "rows": [
                {"name": "Empfangsdienst in Würzburg", "href": "/empfangsdienst/",
                 "text": "Professioneller Empfang mit Sicherheitskompetenz."},
                {"name": "Veranstaltungsschutz in Würzburg", "href": "/veranstaltungsschutz/",
                 "text": "Einlass, Ordnerdienst, Deeskalation, inklusive Unterstützung bei behördlichen Auflagen."},
                {"name": "Kaufhausdetektei in Würzburg", "href": "/kaufhausdetektei/",
                 "text": "Zivile Ladendetektive für Handel und Filialen."},
                {"name": "Sicherheitstechnik in Würzburg", "href": "/sicherheitstechnik/",
                 "text": "Videoüberwachung, Alarm- und Zutrittstechnik, geplant als Teil des Gesamtkonzepts."},
            ],
        },
        {
            "type": "callout", "n": 5, "comment": "BRANDWACHE WÜRZBURG (PFLICHTABSCHNITT)",
            "note": """    <!-- A whole section for one keyword, because the draft makes it a
         Pflichtabschnitt: it is the one urgent, same-day service in the range.
         GEO shape straight from the draft — H2 with city + keyword, the answer in
         the first sentences, then the link to the combo page. -->
""",
            "eyebrow": "Brandwache Würzburg",  # UI
            "h2": "Brandwache in Würzburg, auch kurzfristig am Wochenende",
            "ledes": ["Wenn in einem Würzburger Betrieb die Brandmeldeanlage ausfällt oder der Versicherer für Heißarbeiten eine Brandsicherheitswache fordert, zählt Geschwindigkeit: Die FRANKONIA Einsatzleitung ist rund um die Uhr erreichbar und besetzt Brandwachen nach Absprache auch kurzfristig, mit Kräften, die nach § 34a GewO qualifiziert und als Brandschutzhelfer geschult sind. Jede Runde wird dokumentiert, als Nachweis für Behörde und Versicherung."],
            "phone": True,
            "link": ("Alles zur Brandwache in Würzburg", "/brandwache-wuerzburg/"),
        },
        {
            "type": "price", "n": 6,
            "h2": "Was kostet ein Sicherheitsdienst in Würzburg?",
            "answer": "Für Einsätze in Würzburg liegen seriöse Stundensätze zwischen {{price.min}} und {{price.max}} Euro, abhängig von Qualifikation, Einsatzzeit und Umfang. Nacht-, Wochenend- und Feiertagseinsätze liegen durch tarifliche Zuschläge am oberen Ende.",
            "boxNote": "netto, Richtwerte für Einsätze in Würzburg und Mainfranken",  # UI
            "rates": ["Objektschutz", "Werkschutz", "Baustellenbewachung", "Veranstaltungsschutz"],
            "hint": "Richtwerte netto. Ihr konkretes Angebot: unverbindlich innerhalb eines Werktages.",
        },
        {
            "type": "proof", "n": 7,
            "h2": "So bleibt Ihr Sicherheitsdienst in Würzburg jederzeit greifbar",
            "items": [
                {"icon": "icon-clock", "text": "24/7 direkt erreichbare Einsatzleitung"},
                {"icon": "icon-route", "text": "Digitales Wachbuch mit Checkpoint-Nachweis"},
                {"icon": "icon-transparency", "text": "Regelmäßiger Report für Ihre Geschäftsführung"},
            ],
            "outro": 'Bei laufenden Aufträgen arbeitet Ihr festes Team vor Ort in Würzburg, koordiniert und dokumentiert über Systeme, die Sie jederzeit einsehen können. Auch in Mainfranken sind wir breiter im Einsatz, etwa in <a href="/sicherheitsdienst-schweinfurt/">Schweinfurt</a>.',
        },
        {
            "type": "certs", "n": 8, "comment": "TRUST",
            "h2": "Sicherheitsfirma für Würzburg mit geprüften Standards",
            "lede": "FRANKONIA ist nach DIN 77200-1 für stationäre Sicherheitsdienstleistungen und nach ISO 9001 zertifiziert, geprüft durch die DEKRA. Referenzen aus ganz Franken (u. a. MORELO Reisemobile, Sozialstiftung Bamberg, CleanTech Innovation Park) und unsere Google-Bewertungen zeigen, wie das im Alltag ankommt.",
            "closing": 'Referenzen aus ganz Franken, nachprüfbar: <a class="service-link" href="/referenzen/">Kundenliste und Ergebnisse ansehen<svg class="icon service-link__arrow" aria-hidden="true"><use href="#icon-arrow-diagonal"></use></svg></a>',  # UI
        },
        {
            "type": "faq", "n": 9,
            "h2": "Sicherheitsdienst Würzburg: die häufigsten Fragen",
            "questions": [
                {"q": "Hat FRANKONIA ein Büro in Würzburg?",
                 "a": "Würzburg ist eines unserer festen Einsatzgebiete mit laufenden Aufträgen: Ihre Kräfte arbeiten fest vor Ort in Ihrem Objekt, die Einsatzleitung erreichen Sie rund um die Uhr direkt."},
                {"q": "Was kostet ein Sicherheitsdienst in Würzburg pro Stunde?",
                 "a": "In der Regel {{price.min}} bis {{price.max}} Euro netto, je nach Qualifikation, Einsatzzeit und Auftragsumfang; Baustellenbewachung liegt bei {{price.range}} Euro. Ihr Angebot erhalten Sie innerhalb eines Werktages."},
                {"q": "Übernimmt FRANKONIA Veranstaltungsschutz in Würzburg?",
                 "a": "Ja, von Firmenevents über Kongresse bis zu Festen: Einlasskontrolle, Ordnerdienst, Deeskalation und Unterstützung bei behördlichen Auflagen. Je früher wir in die Planung einsteigen, desto reibungsloser läuft die Abstimmung mit den Würzburger Behörden."},
                {"q": "Wie schnell bekomme ich in Würzburg eine Brandwache?",
                 "a": 'Nach Absprache auch kurzfristig, die Einsatzleitung ist rund um die Uhr erreichbar: <a href="{{phone.href}}">{{phone.display}}</a>. Für geplante Brandwachen (Heißarbeiten, Wartungsfenster der BMA) erhalten Sie das Angebot innerhalb eines Werktages.'},
                {"q": "Betreut FRANKONIA auch Objekte im Landkreis Würzburg?",
                 "a": "Ja, das Einsatzgebiet umfasst Stadt und Landkreis Würzburg sowie das Maindreieck komplett."},
                {"q": "Welche Qualifikation haben die Sicherheitskräfte in Würzburg?",
                 "a": "Alle Kräfte sind mindestens IHK-qualifiziert nach § 34a GewO, viele zusätzlich als Brandschutzhelfer oder für Sicherheitstechnik geschult. Das Unternehmen ist DIN-77200-1- und ISO-9001-zertifiziert, DEKRA-geprüft."},
            ],
        },
        {
            "type": "form", "n": 10,
            "h2": "Jetzt Sicherheitsdienst für Würzburg anfragen",
            "lede": "Beschreiben Sie kurz Ihr Objekt, Ihre Baustelle oder Ihr Event in Würzburg — Sie erhalten Ihr unverbindliches Angebot innerhalb eines Werktages, inklusive kostenfreier Beratung.",
            "formTitle": "Ihre Anfrage für Würzburg",
            "messageLabel": "Ihr Objekt, Ihre Baustelle oder Ihr Event in Würzburg",
        },
    ],
}

# --------------------------------------------------------------------------
# 15 — BAMBERG. THE EXCEPTION.
# The only city where FRANKONIA has a real address, so the whole Einsatzgebiets
# framing of §10.1 does NOT apply: the badge names the actual Sitz, the first FAQ
# gives the street, and section 2 is a Zuhause-Story instead of Warum cards.
# --------------------------------------------------------------------------
BAMBERG = {
    "url": "sicherheitsdienst-bamberg",
    "geo": "bamberg",
    "name": "Bamberg",
    "prefix": "bb",
    "docx": "2026-08-04 Webtext 15 Stadt Bamberg.docx",
    "title": "Sicherheitsdienst Bamberg | Ihr Team vor Ort – FRANKONIA",
    "description": "FRANKONIA ist Ihr Sicherheitsdienst aus Bamberg: Objektschutz, Wachdienst, Brandwache & Events, seit über 10 Jahren für Stadt, Wirtschaft & Einrichtungen.",
    "pageNote": """
     ⚠️⚠️ BAMBERG IS THE ONE EXCEPTION TO EVERYTHING ABOVE, and the paragraph
     above is therefore WRONG for this page — read this instead. This is the only
     city where FRANKONIA actually sits (Neuerbstraße 19, 96052 Bamberg), so the
     Einsatzgebiets framing is not needed and the draft says so in as many words:
     "einziger Standort mit echter Adresse, hier KEIN Einsatzgebiets-Framing
     nötig". Concretely, three things invert:
       · the hero badge names the real Sitz ("Unser Zuhause: Sitz in Bamberg,
         Neuerbstraße 19") instead of saying "Einsatzgebiet";
       · the first FAQ answers "Wo sitzt FRANKONIA in Bamberg?" with the street
         address, which on any other city page would be the forbidden claim;
       · section 2 is a Zuhause-Story, not the four Warum cards.
     The LocalBusiness JSON-LD is unchanged from the other nine — it always
     carried the real Bamberg NAP with geo. Here it simply is not a distinction
     any more, because areaServed and address are the same city. The draft calls
     for the "stärkste Local-Signale aller Seiten, deckungsgleich mit GBP".

     ⚠️ Ten services, not eight: Revier- & Schließdienst and Interventionsdienst
     are RAUM-BAMBERG-ONLY services (/einsatzgebiete/'s own FAQ states it), so
     this is the one city page that may list them. Do not copy this list to
     another city.
""",
    "sections": [
        {
            "type": "hero", "n": 1,
            "badge": "Unser Zuhause: Sitz in Bamberg, Neuerbstraße 19",
            "badgeNote": '⚠️ The badge names a REAL ADDRESS, which is correct here and would be a\n         UWG violation on any other city page — see the note at the top of this\n         file. It is the draft\'s own copy.',
            "h1": "Sicherheitsdienst Bamberg",
            "subline": "FRANKONIA ist Ihr Sicherheitsdienst aus Bamberg, seit über zehn Jahren für Unternehmen, Einrichtungen und Veranstaltungen der Stadt.",
            "ticks": [
                "Ihr Sicherheitsdienst mit echtem Sitz in Bamberg, keine Filiale, sondern Zuhause",
                "Über 300 Kunden in der Region, darunter Stadt, Industriefirmen und Universität",
                "Unverbindliches Angebot innerhalb eines Werktages",
            ],
        },
        {
            "type": "fields", "n": 2, "comment": "ZUHAUSE-SEKTION (STRUKTUR-VARIANTE)",
            "eyebrow": "Heimmarkt",  # UI
            "h2": "In Bamberg kennt man uns, und wir kennen Bamberg",
            "lede": "Unsere Teams schützen Einrichtungen der Stadt, der Sozialstiftung und der Universität Bamberg, und stehen bei Festen wie der Sandkerwa in der Welterbe-Innenstadt am Einlass. Wenn der Inhaber am selben Ort wohnt wie seine Kunden, ist Verantwortung keine Floskel.",
            "items": [
                {"title": "Öffentliche Hand & Einrichtungen in Bamberg",
                 "text": "Kliniken, Verwaltungen, Bildungseinrichtungen — Zutrittskontrolle und Objektschutz mit geschultem, deeskalationssicherem Personal."},
                {"title": "Wirtschaft & Industrie in Bamberg",
                 "text": "Vom Hafengebiet über den Laubanger bis zu den Produktionsstandorten der Region — Werkschutz, Verschlussrunden und Revierdienst für die Bamberger Wirtschaft."},
                {"title": "Welterbe, Handel & Gastronomie in Bamberg",
                 "text": "Einzelhandel zwischen Grüner Markt und Fußgängerzone, Gastronomie mit Einlass-Bedarf (auch Türsteher), Schutz bei Festen wie der Sandkerwa — Sicherheit, die zum Stadtbild passt."},
                {"title": "Neue Quartiere in Bamberg",
                 "text": "Auf Konversions- und Entwicklungsflächen wie dem Lagarde-Campus entstehen Büros, Wohnungen und Baustellen, mit Bewachungsbedarf vom ersten Bauzaun an."},
            ],
        },
        {
            "type": "services", "n": 3, "comment": "LEISTUNGEN IN BAMBERG",
            "h2": "Unsere Sicherheitsdienstleistungen in Bamberg",
            "lede": "Vom Werkschutz für Produktionsstandorte bis zum Interventionsdienst mit Anfahrt in Minuten: In Bamberg steht Ihnen das komplette FRANKONIA Leistungsspektrum zur Verfügung.",
            "rows": [
                {"name": "Werkschutz in Bamberg", "href": "/werkschutz/",
                 "text": "Pforte, Rundgänge und Anlagen-Bedienung für Produktionsstandorte."},
                {"name": "Objektschutz in Bamberg", "href": "/objektschutz/",
                 "text": "Bestreifung, Zugangskontrolle und Alarmverfolgung, für Gewerbe, Verwaltung und Einrichtungen."},
                {"name": "Baustellenbewachung in Bamberg", "href": "/baustellenbewachung/",
                 "text": "Schutz vor Diebstahl und Vandalismus für Wohn- und Gewerbeprojekte in Stadt und Landkreis."},
                {"name": "Brandwache in Bamberg", "href": "/brandwache/",
                 "text": "Kurzfristige Brandsicherheitswachen bei BMA-Ausfall und Heißarbeiten, aus der Nachbarschaft, in Minuten statt Stunden."},
                {"name": "Revier- & Schließdienst in Bamberg", "href": "/revier-schliessdienst/",
                 "text": "Nachtkontrollen und Verschlussrunden im dichtesten FRANKONIA Revier, wirtschaftlicher geht Basisschutz nicht."},
                {"name": "Empfangsdienst in Bamberg", "href": "/empfangsdienst/",
                 "text": "Professioneller Empfang mit Sicherheitskompetenz für Büro- und Verwaltungsstandorte."},
                {"name": "Veranstaltungsschutz in Bamberg", "href": "/veranstaltungsschutz/",
                 "text": "Einlass, Ordnerdienst und Deeskalation für Feste, Kultur und Firmenevents, inklusive Türsteher für Gastronomie und Clubs."},
                {"name": "Kaufhausdetektei in Bamberg", "href": "/kaufhausdetektei/",
                 "text": "Zivile Ladendetektive für den Innenstadt-Handel."},
                {"name": "Sicherheitstechnik in Bamberg", "href": "/sicherheitstechnik/",
                 "text": "Video-, Alarm- und Zutrittstechnik, geplant, installiert und gewartet aus einer Hand."},
                {"name": "Interventionsdienst in Bamberg", "href": "/interventionsdienst/",
                 "text": "Alarmverfolgung mit Anfahrt in Minuten, das Kernrevier macht es möglich."},
            ],
        },
        {
            "type": "callout", "n": 4, "comment": "SICHERHEITSBERATUNG BAMBERG",
            "surface": "light",
            "note": """    <!-- Prose-only callout, so no modules and therefore no dark-only tint —
         which is what lets this section take the LIGHT surface and keep the
         page alternating. -->
""",
            "h2": "Sicherheitsberatung in Bamberg: erst das Konzept, dann der Vertrag",
            "ledes": ["Für Bamberger Unternehmen beginnt jede Zusammenarbeit mit einer kostenfreien Begehung vor Ort, meist noch in derselben Woche, der Weg ist kurz. Unsere Sicherheitsexperten bewerten Risiken, prüfen vorhandene Technik und erstellen Ihr Sicherheitskonzept mit klarem Preisrahmen. Kostenfrei, unverbindlich, aus der Praxis von über 300 Kundenobjekten in der Region."],
            "link": ("So entsteht Ihr Sicherheitskonzept", "/sicherheitskonzept/"),
        },
        {
            "type": "callout", "n": 5, "comment": "BRANDWACHE BAMBERG",
            "eyebrow": "Brandwache Bamberg",  # UI
            "h2": "Brandwache in Bamberg, die schnellste Anfahrt im ganzen Einsatzgebiet",
            "ledes": ["BMA-Störung im Bamberger Betrieb, Heißarbeiten auf der Baustelle, Auflage fürs Stadtfest: Nirgendwo stellen wir eine Brandsicherheitswache schneller als im Heimmarkt."],
            "points": [
                {"icon": "icon-clock", "text": "Einsatzleitung 24/7 erreichbar"},
                {"icon": "icon-badge", "text": "qualifizierte Kräfte (§ 34a GewO + Brandschutzhelfer)"},
                {"icon": "icon-document-check", "text": "lückenlose Dokumentation für Behörde und Versicherung"},
            ],
            "phone": True,
            "link": ("Alles zur Brandwache", "/brandwache/"),
        },
        {
            "type": "price", "n": 6,
            "h2": "Was kostet ein Sicherheitsdienst in Bamberg?",
            "answer": "In Bamberg und dem Umland liegen die Stundensätze in der Regel zwischen {{price.min}} und {{price.max}} Euro netto, je nach Qualifikation, Einsatzzeit und Umfang. Revierkontrollen werden je Kontrollfahrt kalkuliert und sind im dichten Bamberger Revier besonders wirtschaftlich. Anfahrtskosten spielen im Heimmarkt praktisch keine Rolle.",
            "boxNote": "netto, Richtwerte für Einsätze in Stadt und Landkreis Bamberg",  # UI
            "rates": ["Objektschutz", "Werkschutz", "Baustellenbewachung", "Veranstaltungsschutz"],
            "hint": "Richtwerte netto, Angebot in 1 Werktag.",
        },
        {
            "type": "trust", "n": 7, "comment": "TRUST (HEIMMARKT-AUSBAU)",
            "h2": "Referenzen aus Bamberg, die Sie überprüfen können",
            "lede": "Fragen Sie in Bamberg nach FRANKONIA: Die Sozialstiftung Bamberg vertraut uns seit den Zutrittskontrollen der Corona-Zeit, die Sandkerwa setzt beim Veranstaltungsschutz auf uns, dazu Einrichtungen von Stadt und Universität Bamberg sowie Mittelständler wie der CleanTech Innovation Park.",
            "quotes": ["schleier"],
        },
        {
            "type": "certs", "n": 8, "comment": "ZERTIFIZIERUNGEN & MITGLIEDSCHAFTEN",
            "closing": 'Zertifiziert nach DIN 77200-1 und ISO 9001 (DEKRA), Mitglied im <a href="https://wirtschaftsclub-bamberg.de/" target="_blank" rel="noopener">Wirtschaftsclub Bamberg<span class="visually-hidden"> (öffnet in einem neuen Tab)</span></a> und im <a href="https://www.mittelstandsbund.de/" target="_blank" rel="noopener">Deutschen Mittelstands-Bund<span class="visually-hidden"> (öffnet in einem neuen Tab)</span></a>.',
        },
        {
            "type": "faq", "n": 9,
            "h2": "Sicherheitsdienst Bamberg: die häufigsten Fragen",
            "questions": [
                {"q": "Wo sitzt FRANKONIA in Bamberg?",
                 "a": 'Unser Sitz ist die {{address.full}}, von hier koordiniert die Einsatzleitung alle Aufträge in Stadt, Landkreis und der Region. Termine vor Ort sind nach Vereinbarung jederzeit möglich, telefonisch sind wir rund um die Uhr erreichbar: <a href="{{phone.href}}">{{phone.display}}</a>.'},
                {"q": "Was kostet ein Sicherheitsdienst in Bamberg?",
                 "a": "In der Regel {{price.min}} bis {{price.max}} Euro pro Stunde netto, je nach Leistung, Qualifikation und Einsatzzeit; Revierkontrollen werden je Fahrt kalkuliert. Als Bamberger Unternehmen kalkulieren wir im Heimmarkt ohne Anfahrtszuschläge — Ihr Angebot erhalten Sie innerhalb eines Werktages."},
                {"q": "Stellt FRANKONIA auch Türsteher in Bamberg?",
                 "a": "Ja, geprüfte Einlasskräfte nach § 34a GewO für Gastronomie, Clubs und Veranstaltungen, einzeln oder als festes Team. Gerade in der Bamberger Innenstadt zählt ein Einlass, der freundlich bleibt und trotzdem konsequent ist."},
                {"q": "Sichert FRANKONIA auch Feste wie die Sandkerwa ab?",
                 "a": "FRANKONIA übernimmt Veranstaltungsschutz für Feste, Kultur- und Firmenveranstaltungen in Bamberg, von der Personalbemessung über behördliche Auflagen bis zum Ordnerdienst. Sprechen Sie uns früh in der Planung an, dann läuft die Behörden-Abstimmung entspannt."},
                {"q": "Wie schnell ist eine Brandwache in Bamberg vor Ort?",
                 "a": "Schneller als überall sonst in unserem Einsatzgebiet, die Wege im Stadtgebiet sind kurz, die Einsatzleitung sitzt vor Ort und ist 24/7 erreichbar. Auch Wochenend-Einsätze sind nach Absprache kurzfristig möglich."},
                {"q": "Betreut FRANKONIA auch Objekte im Landkreis Bamberg?",
                 "a": 'Ja — Stadt und Landkreis Bamberg sind unser Kernrevier, inklusive Hallstadt, Hirschaid, Memmelsdorf und Umgebung. Auch Nachbarräume wie <a href="/sicherheitsdienst-forchheim/">Forchheim</a> gehören zum festen Einsatzgebiet.'},
            ],
        },
        {
            "type": "form", "n": 10,
            "h2": "Jetzt Sicherheitsdienst in Bamberg anfragen",
            "lede": "Beschreiben Sie kurz Ihr Anliegen; auf Wunsch kommt unser Sicherheitsexperte noch diese Woche zur kostenfreien Begehung. Angebot innerhalb eines Werktages.",
            "formTitle": "Ihre Anfrage für Bamberg",
            "messageLabel": "Ihr Anliegen in Bamberg",
        },
        {
            "type": "nearby", "n": 11,
            "h2": "Sicherheitsdienst rund um Bamberg",
            "lede": "Von Bamberg aus betreuen wir die gesamte Region:",
            "tiles": [
                {"name": "Forchheim", "href": "/sicherheitsdienst-forchheim/"},
                {"name": "Erlangen", "href": "/sicherheitsdienst-erlangen/"},
                {"name": "Nürnberg", "href": "/sicherheitsdienst-nuernberg/"},
                {"name": "Würzburg", "href": "/sicherheitsdienst-wuerzburg/"},
                {"name": "Coburg", "href": "/sicherheitsdienst-coburg/"},
                {"name": "Bayreuth", "href": "/sicherheitsdienst-bayreuth/"},
            ],
        },
    ],
}

# --------------------------------------------------------------------------
# 16 — ERLANGEN. Struktur-Variante "Technologie-Standort".
# --------------------------------------------------------------------------
ERLANGEN = {
    "url": "sicherheitsdienst-erlangen",
    "geo": "erlangen",
    "name": "Erlangen",
    "prefix": "er",
    "docx": "2026-08-04 Webtext 16 Stadt Erlangen.docx",
    "title": "Sicherheitsdienst Erlangen | Objektschutz – FRANKONIA",
    "description": "Sicherheitsdienst für Erlangen: Objektschutz, Werkschutz & Brandwache für Technologie-, Klinik- und Bürostandorte. DEKRA-zertifiziert, Angebot in 1 Werktag.",
    "pageNote": """
     ⚠️ SECTION ORDER IS THE DRAFT'S: "Struktur-Variante Technologie-Standort",
     which opens on the sensitive-premises argument rather than on Warum cards —
     so this page has NO Warum section at all, and its section 2 is the
     Einsatzfelder block. It also carries a Veranstaltungen section the other
     cities do not.
""",
    "sections": [
        {
            "type": "hero", "n": 1,
            "badge": "Einsatzgebiet Erlangen — Kompetenz für sensible Objekte",
            "badgeNote": 'The badge says "Einsatzgebiet", which is the UWG disclosure of §10.1 and\n         the draft\'s own copy.',
            "h1": "Sicherheitsdienst Erlangen",
            "subline": "Objektschutz für Forschung und Büro, Werkschutz für Produktion, Brandwache und Events, für Erlangen.",
            "ticks": [
                "Erfahrung mit sensiblen Objekten: Forschung, Medizin, Verwaltung",
                "Feste Teams im Objekt, Einsatzleitung 24/7 erreichbar",
                "Unverbindliches Angebot innerhalb eines Werktages",
            ],
        },
        {
            "type": "fields", "n": 2, "comment": "DER STANDORT (LOKALE EINSATZFELDER)",
            "eyebrow": "Vor Ort im Einsatz",  # UI
            "h2": "Sicherheit für Erlangen heißt: Wissen schützen",
            "lede": "Erlangen ist Medizin- und Technologiestandort: Weltkonzern-Zentralen, ein neuer Forschungscampus im Süden, das Universitätsklinikum mitten in der Stadt und die Friedrich-Alexander-Universität mit Einrichtungen im ganzen Stadtgebiet. Hier geht es beim Thema Sicherheit selten nur um Sachwerte, sondern um Know-how, sensible Bereiche und Menschen im 24-Stunden-Betrieb.",
            "items": [
                {"title": "Forschung & Entwicklung in Erlangen",
                 "text": "Labore, Prototypen, Konstruktionsdaten: Der Schutz dieses Wissens braucht konsequente Zutrittskontrolle, saubere Besucherprozesse und dokumentierte Rundgänge.",
                 "link": ("Werkschutz in Erlangen", "/werkschutz-erlangen/")},
                {"title": "Kliniken & Gesundheitswesen in Erlangen",
                 "text": "Publikumsverkehr rund um die Uhr, Notaufnahme-Situationen, sensible Stationen: Hier zählen deeskalationsgeschulte Kräfte mit Fingerspitzengefühl — Erfahrung, die FRANKONIA aus dem Klinikumfeld mitbringt."},
                {"title": "Büro- & Campusstandorte in Erlangen",
                 "text": "Auf wachsenden Arealen wie dem neuen Siemens Campus im Erlanger Süden entstehen Büros, Parkhäuser und Baustellen nebeneinander, mit Bedarf von der Baustellenbewachung bis zum Empfangsdienst.",
                 "link": ("Baustellenbewachung in Erlangen", "/baustellenbewachung-erlangen/")},
                {"title": "Gewerbegebiete wie Tennenlohe in Erlangen",
                 "text": "Gewerbe- und Technologieparks sind nachts verwaist — Objektschutz zu Randzeiten kombiniert mit Alarmtechnik sichert hier wirtschaftlich.",
                 "link": ("Objektschutz in Erlangen", "/objektschutz-erlangen/")},
            ],
        },
        {
            "type": "services", "n": 3, "comment": "LEISTUNGEN IN ERLANGEN",
            "h2": "Unsere Sicherheitsdienstleistungen in Erlangen",
            "lede": "Vom Schutz sensibler Forschungsbereiche bis zur kurzfristigen Brandwache: Alle FRANKONIA Leistungen stehen Ihnen auch in Erlangen zur Verfügung.",
            "cards": [
                {"name": "Werkschutz in Erlangen", "href": "/werkschutz-erlangen/",
                 "text": "Pforte, Fremdfirmen-Koordination und Schutz sensibler Bereiche für Produktions- und Entwicklungsstandorte."},
                {"name": "Objektschutz in Erlangen", "href": "/objektschutz-erlangen/",
                 "text": "Bestreifung, Zugangskontrolle, Alarmverfolgung für Büro, Forschung und Verwaltung."},
                {"name": "Baustellenbewachung in Erlangen", "href": "/baustellenbewachung-erlangen/",
                 "text": "Schutz für Campus-, Wohn- und Infrastrukturprojekte."},
                {"name": "Brandwache in Erlangen", "href": "/brandwache-erlangen/",
                 "text": "Kurzfristige Brandsicherheitswachen bei BMA-Ausfall und Heißarbeiten."},
            ],
            "rows": [
                {"name": "Empfangsdienst in Erlangen", "href": "/empfangsdienst/",
                 "text": "Repräsentativer Empfang mit Sicherheitskompetenz für Unternehmens- und Institutsgebäude."},
                {"name": "Veranstaltungsschutz in Erlangen", "href": "/veranstaltungsschutz/",
                 "text": "Einlass und Ordnerdienst für Events, von der Firmenfeier bis zum Volksfest; auch Türsteher für Gastronomie."},
                {"name": "Kaufhausdetektei in Erlangen", "href": "/kaufhausdetektei/",
                 "text": "Zivile Ladendetektive für Handel und Filialen."},
                {"name": "Sicherheitstechnik in Erlangen", "href": "/sicherheitstechnik/",
                 "text": "Videoüberwachung, Alarm- und Zutrittstechnik, geplant als Teil des Gesamtkonzepts."},
            ],
        },
        {
            "type": "callout", "n": 4, "comment": "VERANSTALTUNGEN IN ERLANGEN",
            "surface": "light",
            "note": """    <!-- A local section the other city pages do not have — the draft gives
         Erlangen its own Veranstaltungs-Abschnitt because of the Bergkirchweih.
         Prose-only, so it takes the light surface and keeps the page
         alternating. -->
""",
            "h2": "Veranstaltungsschutz in Erlangen: von der Bergkirchweih bis zum Firmenevent",
            "ledes": ["Wenn Erlangen feiert, feiert die ganze Region mit, die Bergkirchweih zieht jedes Jahr Hunderttausende an. Für Veranstalter heißt das: behördliche Auflagen, Einlass-Management und Kräfte, die in Menschenmengen ruhig bleiben. FRANKONIA unterstützt bei Sicherheitskonzept und Behörden-Abstimmung und stellt geschulte Ordner- und Einlasskräfte, für Großveranstaltungen genauso wie für Firmenevents und Kulturformate."],
            "link": ("Zum Veranstaltungsschutz", "/veranstaltungsschutz/"),
        },
        {
            "type": "callout", "n": 5, "comment": "BRANDWACHE ERLANGEN",
            "eyebrow": "Brandwache Erlangen",  # UI
            "h2": "Brandwache in Erlangen — Reaktion, wenn die BMA streikt",
            "ledes": ["Gerade in Labor- und Klinikumgebungen ist eine ausgefallene Brandmeldeanlage keine Bagatelle: Behörden und Versicherer fordern eine Ersatzmaßnahme, meist sofort. FRANKONIA stellt qualifizierte Brandwachen im Raum Erlangen nach Absprache auch kurzfristig, mit dokumentierten Runden und Abstimmung mit der fordernden Stelle."],
            "phone": True,
            "link": ("Alles zur Brandwache in Erlangen", "/brandwache-erlangen/"),
        },
        {
            "type": "price", "n": 6,
            "h2": "Was kostet ein Sicherheitsdienst in Erlangen?",
            "answer": "Im Raum Erlangen liegen die Stundensätze in der Regel zwischen {{price.min}} und {{price.max}} Euro netto, technik- oder laborgeschulte Kräfte am oberen Ende.",
            "boxNote": "netto, Richtwerte für Einsätze im Raum Erlangen",  # UI
            "rates": ["Objektschutz", "Werkschutz", "Baustellenbewachung", "Veranstaltungsschutz"],
            "hint": "Richtwerte netto, Angebot in 1 Werktag.",
        },
        {
            "type": "proof", "n": 7,
            "h2": "So bleibt Ihr Sicherheitsdienst in Erlangen jederzeit greifbar",
            "items": [
                {"icon": "icon-clock", "text": "24/7 direkt erreichbare Einsatzleitung"},
                {"icon": "icon-route", "text": "Digitales Wachbuch mit Checkpoint-Nachweis"},
                {"icon": "icon-document-check", "text": "Dokumentierte Prozesse für sensible Bereiche"},
            ],
            "outro": 'Erlangen liegt mitten in unserem Einsatzgebiet zwischen Bamberg und <a href="/sicherheitsdienst-nuernberg/">Nürnberg</a>, bei laufenden Aufträgen arbeitet Ihr festes Team vor Ort, koordiniert über die direkt erreichbare Einsatzleitung.',
        },
        {
            "type": "certs", "n": 8, "comment": "TRUST",
            "h2": "Eine Sicherheitsfirma für Erlangen mit nachprüfbaren Standards",
            "lede": "DIN 77200-1 und ISO 9001, geprüft durch die DEKRA; ausschließlich IHK-qualifizierte Kräfte nach § 34a GewO. Referenzen aus Wissenschaft, öffentlicher Hand und Industrie in ganz Franken, unter anderem Universität Bamberg, Sozialstiftung Bamberg und CleanTech Innovation Park.",
            "closing": 'Referenzen aus ganz Franken, nachprüfbar: <a class="service-link" href="/referenzen/">Kundenliste und Ergebnisse ansehen<svg class="icon service-link__arrow" aria-hidden="true"><use href="#icon-arrow-diagonal"></use></svg></a>',  # UI
        },
        {
            "type": "faq", "n": 9,
            "h2": "Sicherheitsdienst Erlangen: die häufigsten Fragen",
            "questions": [
                {"q": "Hat FRANKONIA einen Standort in Erlangen?",
                 "a": "Erlangen ist eines unserer festen Einsatzgebiete mit laufenden Aufträgen: Ihre Sicherheitskräfte arbeiten fest vor Ort in Ihrem Objekt, die Einsatzleitung erreichen Sie rund um die Uhr direkt."},
                {"q": "Was kostet ein Sicherheitsdienst in Erlangen?",
                 "a": "In der Regel {{price.min}} bis {{price.max}} Euro pro Stunde netto, abhängig von Qualifikation und Einsatzzeit. Für Forschungs- und Klinikumgebungen mit besonderen Anforderungen kalkulieren wir nach der kostenfreien Begehung, das Angebot kommt innerhalb eines Werktages."},
                {"q": "Kann FRANKONIA sensible Bereiche wie Labore schützen?",
                 "a": "Ja. Der Schutz sensibler Bereiche gehört zum Werkschutz-Kern: Zutrittskontrolle, Besucher- und Fremdfirmenprozesse, dokumentierte Rundgänge und geschulte Kräfte, die Vertraulichkeit ernst nehmen, inklusive Verschwiegenheitsverpflichtung."},
                {"q": "Übernimmt FRANKONIA Einlass und Türsteher-Dienste in Erlangen?",
                 "a": "Ja, geprüfte Einlasskräfte nach § 34a GewO für Gastronomie, Clubs und Veranstaltungen. Für Großveranstaltungen wie Volksfeste unterstützen wir zusätzlich bei Auflagen und Personalbemessung."},
                {"q": "Wie kurzfristig gibt es eine Brandwache in Erlangen?",
                 "a": 'Nach Absprache auch sehr kurzfristig, die Einsatzleitung ist 24/7 erreichbar: <a href="{{phone.href}}">{{phone.display}}</a>. Geplante Wachen (Heißarbeiten, BMA-Wartung) bieten wir innerhalb eines Werktages an.'},
            ],
        },
        {
            "type": "form", "n": 10,
            "h2": "Jetzt Sicherheitsdienst für Erlangen anfragen",
            "lede": "Beschreiben Sie kurz Ihr Objekt oder Vorhaben in Erlangen — Sie erhalten Ihr unverbindliches Angebot innerhalb eines Werktages.",
            "formTitle": "Ihre Anfrage für Erlangen",
            "messageLabel": "Ihr Objekt oder Vorhaben in Erlangen",
        },
        {
            "type": "nearby", "n": 11,
            "h2": "Sicherheitsdienst rund um Erlangen",  # UI
            "lede": "Unser Einsatzgebiet endet nicht an der Erlanger Stadtgrenze: Auch in Nürnberg, Fürth und Forchheim übernehmen wir Objektschutz, Baustellenbewachung und mehr.",  # UI
            "tiles": [
                {"name": "Nürnberg", "href": "/sicherheitsdienst-nuernberg/"},
                {"name": "Fürth", "href": "/sicherheitsdienst-fuerth/"},
                {"name": "Forchheim", "href": "/sicherheitsdienst-forchheim/"},
            ],
        },
    ],
}

# --------------------------------------------------------------------------
# 17 — FÜRTH. Struktur-Variante "Zwilling mit eigenem Profil".
# --------------------------------------------------------------------------
FUERTH = {
    "url": "sicherheitsdienst-fuerth",
    "geo": "fuerth",
    "name": "Fürth",
    "prefix": "ft",
    "docx": "2026-08-04 Webtext 17 Stadt Fuerth.docx",
    "title": "Sicherheitsdienst Fürth | Wachdienst 24/7 – FRANKONIA",
    "description": "Sicherheitsdienst für Fürth: Objektschutz, Wachdienst, Brandwache & Baustellenbewachung — IHK-qualifizierte Kräfte, DEKRA-zertifiziert, Angebot in 1 Werktag.",
    "pageNote": """
     ⚠️ NO BRANDWACHE SECTION and no Trust/Zertifizierungen section: Webtext 17 is
     the deliberately compact variant ("kompakteres Layout, 8 Sektionen") and asks
     for neither. The DEKRA seals still appear, in the hero trust band. Do not add
     the missing sections to "match" Nürnberg — the draft is the spec.
""",
    "sections": [
        {
            "type": "hero", "n": 1,
            "badge": "Einsatzgebiet Fürth, fester Ansprechpartner rund um die Uhr",
            "badgeNote": 'The badge says "Einsatzgebiet", which is the UWG disclosure of §10.1 and\n         the draft\'s own copy.',
            "h1": "Sicherheitsdienst Fürth",
            "subline": "Objektschutz, Werkschutz, Brandwache und Baustellenbewachung für Fürth, mit festem Ansprechpartner rund um die Uhr.",
            "ticks": [
                "Feste Teams für laufende Aufträge in Fürth",
                "Digital dokumentiert: Wachbuch, Checkpoints, Reports",
                "Unverbindliches Angebot innerhalb eines Werktages",
            ],
        },
        {
            "type": "why", "n": 2, "comment": "WARUM FRANKONIA IN FÜRTH",
            "h2": "Fürth ist nicht Nürnberg — Ihr Sicherheitsdienst sollte das wissen",
            "lede": "Traditionsunternehmen, dichte Innenstadt-Handelslagen, Gewerbeflächen wie die Hardhöhe, und mit der Michaelis-Kirchweih eines der größten Straßenfeste Bayerns: Fürth hat ein eigenes Sicherheitsprofil. FRANKONIA bedient es als fränkischer Mittelständler mit Fürth als festem Einsatzgebiet, professionell und verbindlich.",
            "cards": [
                {"icon": "icon-transparency", "title": "Modern und digital nachweisbar",
                 "text": "Wachbuch, Checkpoint-Kontrollen und Reports zeigen Ihnen jederzeit, was auf Ihrem Fürther Objekt passiert."},
                {"icon": "icon-contact", "title": "Inhabergeführt statt anonym",
                 "text": "Entscheidungen fallen in Bamberg beim Inhaber, nicht in einer Konzernzentrale. Ihr Einsatzleiter ist 24/7 direkt erreichbar."},
                {"icon": "icon-shield-check", "title": "Zertifiziert",
                 "text": "DIN 77200-1, ISO 9001, DEKRA-geprüft, dieselben Standards wie bei über 300 Kunden in Franken."},
            ],
        },
        {
            "type": "services", "n": 3, "comment": "LEISTUNGEN IN FÜRTH",
            "h2": "Unsere Sicherheitsdienstleistungen in Fürth",
            "lede": "Vom dauerhaften Objektschutz über den Werkschutz bis zur kurzfristigen Brandwache: Alle FRANKONIA Leistungen stehen Ihnen auch in Fürth zur Verfügung.",
            "cards": [
                {"name": "Werkschutz in Fürth", "href": "/werkschutz-fuerth/",
                 "text": "Pforte und Rundgänge für Produktions- und Traditionsstandorte."},
                {"name": "Objektschutz in Fürth", "href": "/objektschutz-fuerth/",
                 "text": "Bestreifung und Zugangskontrolle für Gewerbe, Verwaltung und Wohnanlagen."},
                {"name": "Baustellenbewachung in Fürth", "href": "/baustellenbewachung-fuerth/",
                 "text": "Schutz für Innenstadt-Nachverdichtung und Gewerbeprojekte."},
                {"name": "Brandwache in Fürth", "href": "/brandwache-fuerth/",
                 "text": "Kurzfristige Brandsicherheitswachen bei BMA-Ausfall und Heißarbeiten."},
            ],
            "rows": [
                {"name": "Empfangsdienst in Fürth", "href": "/empfangsdienst/",
                 "text": "Professioneller Empfang mit Sicherheitskompetenz."},
                {"name": "Veranstaltungsschutz in Fürth", "href": "/veranstaltungsschutz/",
                 "text": "Einlass, Ordnerdienst und Deeskalation, vom Firmenevent bis zum Straßenfest."},
                {"name": "Kaufhausdetektei in Fürth", "href": "/kaufhausdetektei/",
                 "text": "Zivile Ladendetektive für Innenstadt-Handel und Filialen."},
                {"name": "Sicherheitstechnik in Fürth", "href": "/sicherheitstechnik/",
                 "text": "Videoüberwachung, Alarm- und Zutrittstechnik, geplant als Teil des Gesamtkonzepts."},
            ],
        },
        {
            "type": "fields", "n": 4, "comment": "LOKALE EINSATZFELDER IN FÜRTH",
            "eyebrow": "Vor Ort im Einsatz",  # UI
            "h2": "Wo Sicherheitsdienste in Fürth gebraucht werden",
            "items": [
                {"title": "Gewerbegebiet Hardhöhe und Stadtgrenze zu Nürnberg",
                 "text": "Produktion, Logistik und Großhandel dicht an dicht, nach Feierabend verwaiste Areale, klassisches Ziel für Diebstahl. Kontrollgänge und sichtbare Präsenz schrecken ab."},
                {"title": "Innenstadt-Handel an der Fürther Freiheit",
                 "text": "Einkaufslagen zwischen Fürther Freiheit und Neuer Mitte kämpfen wie überall mit Ladendiebstahl, zivile Detektive und Doorman-Präsenz senken die Verluste messbar.",
                 "link": ("Kaufhausdetektei in Fürth", "/kaufhausdetektei/")},
                {"title": "Michaelis-Kirchweih und Veranstaltungen in Fürth",
                 "text": "Elf Tage Ausnahmezustand in der Innenstadt, für Anlieger, Gastronomie und Veranstalter heißt das: Einlass, Objektschutz und geschulte Kräfte, die deeskalieren können."},
                {"title": "Kliniken und Einrichtungen in Fürth",
                 "text": "Klinikum und öffentliche Einrichtungen brauchen Zutrittssteuerung mit Fingerspitzengefühl — Erfahrung aus dem Klinikumfeld bringt FRANKONIA mit."},
            ],
        },
        {
            "type": "price", "n": 5,
            "h2": "Was kostet ein Sicherheitsdienst in Fürth?",
            "answer": "In Fürth gelten dieselben seriösen Spannen wie im gesamten Großraum: {{price.min}} bis {{price.max}} Euro pro Stunde netto, je nach Qualifikation, Einsatzzeit und Umfang.",
            "boxNote": "netto, Richtwerte für Einsätze in Stadt und Landkreis Fürth",  # UI
            "rates": ["Baustellenbewachung", "Werkschutz", "Veranstaltungsschutz"],
            "hint": "Richtwerte netto. Ihr konkretes Angebot erhalten Sie unverbindlich innerhalb eines Werktages.",
        },
        {
            "type": "proof", "n": 6,
            "h2": "So bleibt Ihr Sicherheitsdienst in Fürth jederzeit greifbar",
            "items": [
                {"icon": "icon-clock", "text": "24/7 direkt erreichbare Einsatzleitung"},
                {"icon": "icon-route", "text": "Digitales Wachbuch mit Checkpoint-Nachweis"},
                {"icon": "icon-transparency", "text": "Regelmäßiger Report für Ihre Geschäftsführung"},
            ],
            "outro": "Bei laufenden Aufträgen sind Ihre Kräfte fest im Fürther Objekt eingeteilt, koordiniert über die Einsatzleitung, dokumentiert in Systemen, die Sie jederzeit einsehen können.",
        },
        {
            "type": "faq", "n": 7,
            "h2": "Sicherheitsdienst Fürth: die häufigsten Fragen",
            "questions": [
                {"q": "Hat FRANKONIA ein Büro in Fürth?",
                 "a": "Fürth ist eines unserer festen Einsatzgebiete mit laufenden Aufträgen: Ihre Kräfte arbeiten fest vor Ort in Ihrem Objekt, die Einsatzleitung erreichen Sie rund um die Uhr direkt."},
                {"q": "Was kostet ein Sicherheitsdienst in Fürth?",
                 "a": "In der Regel {{price.min}} bis {{price.max}} Euro pro Stunde netto, je nach Leistung und Einsatzzeit. Ihr unverbindliches Angebot erhalten Sie innerhalb eines Werktages."},
                {"q": "Übernimmt FRANKONIA Objektschutz während der Michaelis-Kirchweih?",
                 "a": "Ja, gerade während der Kirchweih steigt der Bedarf: Objektschutz für Anlieger und Betriebe, Einlass für Gastronomie, Verstärkung für Veranstaltungsflächen. Früh anfragen lohnt sich, die Kirchweih-Wochen sind erfahrungsgemäß schnell verplant."},
                {"q": "Wie schnell ist eine Brandwache in Fürth verfügbar?",
                 "a": 'Nach Absprache auch kurzfristig, die Einsatzleitung ist rund um die Uhr erreichbar: <a href="{{phone.href}}">{{phone.display}}</a>. Details zur <a href="/brandwache-fuerth/">Brandwache in Fürth</a>.'},
                {"q": "Betreut FRANKONIA auch den Landkreis Fürth?",
                 "a": "Ja, Stadt und Landkreis Fürth gehören komplett zum Einsatzgebiet, inklusive Zirndorf, Oberasbach und Stein."},
            ],
        },
        {
            "type": "form", "n": 8,
            "h2": "Jetzt Sicherheitsdienst für Fürth anfragen",
            "lede": "Beschreiben Sie kurz Ihr Objekt oder Event in Fürth — Angebot innerhalb eines Werktages.",
            "formTitle": "Ihre Anfrage für Fürth",
            "messageLabel": "Ihr Objekt oder Event in Fürth",
        },
        {
            "type": "nearby", "n": 9,
            "h2": "Sicherheitsdienst rund um Fürth",  # UI
            "lede": "Unser Einsatzgebiet endet nicht an der Fürther Stadtgrenze: Auch in Nürnberg und Erlangen übernehmen wir Objektschutz, Baustellenbewachung und mehr.",  # UI
            "tiles": [
                {"name": "Nürnberg", "href": "/sicherheitsdienst-nuernberg/"},
                {"name": "Erlangen", "href": "/sicherheitsdienst-erlangen/"},
            ],
        },
    ],
}

# --------------------------------------------------------------------------
# 18 — BAYREUTH. Struktur-Variante "Oberfranken-Zentrum".
# --------------------------------------------------------------------------
BAYREUTH = {
    "url": "sicherheitsdienst-bayreuth",
    "geo": "bayreuth",
    "name": "Bayreuth",
    "prefix": "by",
    "docx": "2026-08-04 Webtext 18 Stadt Bayreuth.docx",
    "title": "Sicherheitsdienst Bayreuth | Objektschutz – FRANKONIA",
    "description": "Sicherheitsdienst für Bayreuth: Objektschutz, Wachdienst, Brandwache & Veranstaltungsschutz in Oberfranken. DEKRA-zertifiziert, Angebot in einem Werktag.",
    "pageNote": """
     ⚠️ NO COMBO PAGES for Bayreuth in this phase — the draft says so itself — so
     every one of the eight services points at its GENERIC page and the Leistungen
     section has no featured-card group at all. See the note at that section.
""",
    "sections": [
        {
            "type": "hero", "n": 1,
            "badge": "Einsatzgebiet Bayreuth & Oberfranken, aus der Region, für die Region",
            "badgeNote": 'The badge says "Einsatzgebiet", which is the UWG disclosure of §10.1 and\n         the draft\'s own copy.',
            "h1": "Sicherheitsdienst Bayreuth",
            "subline": "Objektschutz, Brandwache und Veranstaltungsschutz für Bayreuth, aus Oberfranken für Oberfranken.",
            "ticks": [
                "Erfahrung mit Behörden, Kultur und Mittelstand",
                "Digital dokumentiert: Wachbuch, Checkpoints, Reports",
                "Unverbindliches Angebot innerhalb eines Werktages",
            ],
        },
        {
            "type": "why", "n": 2, "comment": "WARUM FRANKONIA IN BAYREUTH",
            "h2": "Ein oberfränkischer Sicherheitsdienst für Bayreuth, keine Konzern-Filiale",
            "lede": "Bayreuth ist Regierungssitz Oberfrankens, Universitätsstadt und Kulturstandort von Weltrang. Statt einer anonymen Niederlassung bekommen Sie den oberfränkischen Mittelständler, dessen Inhaber persönlich für Qualität geradesteht, und der ehrlich sagt: Unser Sitz ist Bamberg, Bayreuth ist festes Einsatzgebiet.",
            "cards": [
                {"icon": "icon-transparency", "title": "Modern und digital nachweisbar",
                 "text": "Wachbuch, Checkpoint-Kontrollen und Reports zeigen Ihnen jederzeit, was auf Ihrem Bayreuther Objekt passiert."},
                {"icon": "icon-building", "title": "Erfahrung mit öffentlicher Hand",
                 "text": "FRANKONIA schützt Einrichtungen von Kommunen, Stiftungen und Hochschulen in ganz Franken — Referenzprozesse, die auch Bayreuther Verwaltungen und Institute überzeugen."},
                {"icon": "icon-shield-check", "title": "Zertifiziert und geprüft",
                 "text": "DIN 77200-1, ISO 9001, DEKRA, plus ausschließlich IHK-qualifizierte Kräfte nach § 34a GewO."},
            ],
        },
        {
            "type": "services", "n": 3, "comment": "LEISTUNGEN IN BAYREUTH",
            "h2": "Unsere Sicherheitsdienstleistungen in Bayreuth",
            "lede": "Vom Werkschutz für Produktionsstandorte bis zum Veranstaltungsschutz für Kultur und Kongresse: Alle FRANKONIA Leistungen stehen Ihnen auch in Bayreuth zur Verfügung.",
            "rows": [
                {"name": "Werkschutz in Bayreuth", "href": "/werkschutz/",
                 "text": "Pforte und Rundgänge für Produktionsstandorte, vom Brauereibetrieb bis zum Medizinprodukte-Hersteller."},
                {"name": "Objektschutz in Bayreuth", "href": "/objektschutz/",
                 "text": "Bestreifung, Zugangskontrolle und Alarmverfolgung für Verwaltung, Gewerbe und Einrichtungen."},
                {"name": "Baustellenbewachung in Bayreuth", "href": "/baustellenbewachung/",
                 "text": "Schutz vor Diebstahl und Vandalismus auf Bau- und Sanierungsprojekten."},
                {"name": "Brandwache in Bayreuth", "href": "/brandwache/",
                 "text": "Kurzfristige Brandsicherheitswachen bei BMA-Ausfall, Heißarbeiten und Veranstaltungs-Auflagen."},
                {"name": "Empfangsdienst in Bayreuth", "href": "/empfangsdienst/",
                 "text": "Repräsentativer Empfang mit Sicherheitskompetenz für Verwaltung und Institute."},
                {"name": "Veranstaltungsschutz in Bayreuth", "href": "/veranstaltungsschutz/",
                 "text": "Einlass, Ordnerdienst und Deeskalation für Kultur, Kongresse und Feste."},
                {"name": "Kaufhausdetektei in Bayreuth", "href": "/kaufhausdetektei/",
                 "text": "Zivile Ladendetektive für Handel und Filialen."},
                {"name": "Sicherheitstechnik in Bayreuth", "href": "/sicherheitstechnik/",
                 "text": "Videoüberwachung, Alarm- und Zutrittstechnik, geplant als Teil des Gesamtkonzepts."},
            ],
        },
        {
            "type": "fields", "n": 4, "comment": "LOKALE EINSATZFELDER IN BAYREUTH",
            "eyebrow": "Vor Ort im Einsatz",  # UI
            "h2": "Wo Sicherheitsdienste in Bayreuth gebraucht werden",
            "items": [
                {"title": "Kultur und Veranstaltungen in Bayreuth",
                 "text": "Wenn im Sommer die Festspielsaison läuft, ist die Stadt voll — Hotels, Gastronomie, Empfänge und Kulturorte brauchen Einlass, Objektschutz und diskrete Präsenz auf Weltniveau-Publikum eingestellt. Auch außerhalb der Saison: Kongresse, Stadtfeste, Universitätsveranstaltungen."},
                {"title": "Behörden und Verwaltung in Bayreuth",
                 "text": "Als Regierungssitz Oberfrankens konzentriert Bayreuth Ämter und Institutionen — Zutrittssteuerung, Empfangsdienste und Objektschutz mit dokumentierten Prozessen sind hier Standard-Anforderung.",
                 "link": ("Zum Empfangsdienst", "/empfangsdienst/")},
                {"title": "Universität und Institute in Bayreuth",
                 "text": "Campus-Areale mit Laboren und Bibliotheken, abends weitläufig und ruhig — Objektschutz mit Kontrollgängen und Verschlussrunden sichert wirtschaftlich."},
                {"title": "Mittelstand und Gewerbegebiete in und um Bayreuth",
                 "text": "Produktions- und Logistikflächen der Region: Werkschutz, Verschlussrunden und Zufahrtskontrolle für Betriebe, die nach Feierabend nicht unbewacht sein dürfen."},
            ],
        },
        {
            "type": "callout", "n": 5, "comment": "BRANDWACHE BAYREUTH",
            "eyebrow": "Brandwache Bayreuth",  # UI
            "h2": "Brandwache in Bayreuth, einsatzbereit, wenn die Auflage kommt",
            "ledes": ["Ob BMA-Störung im Betrieb, Heißarbeiten bei Sanierungen oder eine Brandsicherheitswache als Veranstaltungs-Auflage: FRANKONIA stellt qualifizierte Brandwachen im Raum Bayreuth nach Absprache auch kurzfristig, mit Brandschutzhelfer-Qualifikation, dokumentierten Runden und Abstimmung mit Behörde oder Versicherer."],
            "phone": True,
            "link": ("Alles zur Brandwache", "/brandwache/"),
        },
        {
            "type": "price", "n": 6,
            "h2": "Was kostet ein Sicherheitsdienst in Bayreuth?",
            "answer": "Im Raum Bayreuth liegen seriöse Stundensätze zwischen {{price.min}} und {{price.max}} Euro netto. Nacht-, Wochenend- und Feiertagszuschläge nach Tarif.",
            "boxNote": "netto, Richtwerte für Einsätze im Raum Bayreuth",  # UI
            "rates": [("Werkschutz", "(technik-geschulte Kräfte)"), "Baustellenbewachung", "Veranstaltungsschutz"],
            "hint": "Richtwerte netto, Zuschläge nach Tarif. Ihr konkretes Angebot erhalten Sie unverbindlich innerhalb eines Werktages.",
        },
        {
            "type": "faq", "n": 7,
            "h2": "Sicherheitsdienst Bayreuth: die häufigsten Fragen",
            "questions": [
                {"q": "Hat FRANKONIA einen Standort in Bayreuth?",
                 "a": "Bayreuth ist eines unserer festen Einsatzgebiete mit laufenden Aufträgen: Ihre Kräfte arbeiten fest vor Ort im Objekt, die Einsatzleitung erreichen Sie rund um die Uhr direkt."},
                {"q": "Was kostet ein Sicherheitsdienst in Bayreuth?",
                 "a": "In der Regel {{price.min}} bis {{price.max}} Euro pro Stunde netto, abhängig von Leistung, Qualifikation und Einsatzzeit. Ihr unverbindliches Angebot erhalten Sie innerhalb eines Werktages, auf Wunsch nach kostenfreier Begehung."},
                {"q": "Übernimmt FRANKONIA Aufträge während der Festspielsaison?",
                 "a": "Ja, gerade dann: Einlass und Ordnerdienste für Veranstaltungen und Empfänge, Objektschutz für Hotels und Gastronomie, Verstärkung für Kulturorte. Die Festspielwochen sind früh verplant, je eher Sie anfragen, desto sicherer die Besetzung."},
                {"q": "Arbeitet FRANKONIA auch für Behörden in Bayreuth?",
                 "a": "FRANKONIA schützt Einrichtungen der öffentlichen Hand in ganz Franken, mit dokumentierten Prozessen, zertifiziertem System (DIN 77200-1, ISO 9001) und vergabetauglichen Nachweisen. Referenzen nennen wir gern im Gespräch."},
                {"q": "Wie schnell gibt es eine Brandwache in Bayreuth?",
                 "a": 'Nach Absprache auch kurzfristig, die Einsatzleitung ist 24/7 erreichbar: <a href="{{phone.href}}">{{phone.display}}</a>. Geplante Wachen bieten wir innerhalb eines Werktages an.'},
            ],
        },
        {
            "type": "form", "n": 8,
            "h2": "Jetzt Sicherheitsdienst für Bayreuth anfragen",
            "lede": "Beschreiben Sie kurz Ihr Objekt oder Ihre Veranstaltung in Bayreuth — Angebot innerhalb eines Werktages.",
            "formTitle": "Ihre Anfrage für Bayreuth",
            "messageLabel": "Ihr Objekt oder Ihre Veranstaltung in Bayreuth",
        },
        {
            "type": "nearby", "n": 9,
            "h2": "Sicherheitsdienst rund um Bayreuth",  # UI
            "lede": "Unser Einsatzgebiet endet nicht an der Bayreuther Stadtgrenze: Auch in Bamberg und Coburg übernehmen wir Objektschutz, Baustellenbewachung und mehr.",  # UI
            "tiles": [
                {"name": "Bamberg", "href": "/sicherheitsdienst-bamberg/"},
                {"name": "Coburg", "href": "/sicherheitsdienst-coburg/"},
            ],
        },
    ],
}

# --------------------------------------------------------------------------
# 19 — SCHWEINFURT. Struktur-Variante "Industriestadt", Werkschutz-first.
# --------------------------------------------------------------------------
SCHWEINFURT = {
    "url": "sicherheitsdienst-schweinfurt",
    "geo": "schweinfurt",
    "name": "Schweinfurt",
    "prefix": "sw",
    "docx": "2026-08-04 Webtext 19 Stadt Schweinfurt.docx",
    "title": "Sicherheitsdienst Schweinfurt | Werkschutz – FRANKONIA",
    "description": "Sicherheitsdienst für Schweinfurt: Werkschutz für Industrie, Objektschutz, Brandwache & Baustellenbewachung. DEKRA-zertifiziert, Angebot in einem Werktag.",
    "pageNote": """
     ⚠️ WERKSCHUTZ-FIRST, on the draft's own instruction ("Struktur-Variante
     Industriestadt"): section 2 is not the usual Warum block but a Werkschutz
     argument with three capability cards, and Werkschutz leads the service list.
     No combo pages for Schweinfurt in this phase, so every service points at its
     generic page.
""",
    "sections": [
        {
            "type": "hero", "n": 1,
            "badge": "Einsatzgebiet Schweinfurt — Industrie-Erfahrung aus Franken",
            "badgeNote": 'The badge says "Einsatzgebiet", which is the UWG disclosure of §10.1 and\n         the draft\'s own copy.',
            "h1": "Sicherheitsdienst Schweinfurt",
            "subline": "Werkschutz für die Industriestadt: technik-geschulte, IHK-qualifizierte Kräfte für Schweinfurts Produktionsstandorte.",
            "ticks": [
                "Werkschutz-Kompetenz für Mehrschicht- und Industriebetriebe",
                "Digital dokumentiert: Wachbuch, Checkpoints, Reports",
                "Unverbindliches Angebot innerhalb eines Werktages",
            ],
        },
        {
            "type": "why", "n": 2, "comment": "INDUSTRIE-EINSTIEG (WERKSCHUTZ-FIRST)",
            "h2": "Werkschutz für Schweinfurt: Sicherheit für eine der dichtesten Industrieregionen Bayerns",
            "lede": "Kaum eine Stadt in Bayern hat auf so wenig Fläche so viel Industrie wie Schweinfurt: Wälzlager- und Antriebstechnik von Weltrang, Zulieferer, Hafen und Logistik, dazu Zehntausende Pendler im Schichtrhythmus. Für die Sicherheit heißt das: Werkstore mit durchgehendem Verkehr, Fremdfirmen auf dem Gelände, Know-how in jeder Halle. Genau dieses Umfeld ist FRANKONIA Kerngeschäft.",
            "cards": [
                {"icon": "icon-key", "title": "Pforten- & Torkontrolle im Schichtbetrieb",
                 "text": "Besucher-, Fremdfirmen- und Lieferverkehr-Management, das die Produktion nicht aufhält, dokumentiert und freundlich."},
                {"icon": "icon-route", "title": "Rundgänge & Anlagenkontrolle",
                 "text": "Technik-geschulte Kräfte, die Brandmelde- und Alarmanlagen sachgemäß bedienen, auch nachts, auch am Wochenende."},
                {"icon": "icon-shield-check", "title": "Schutz sensibler Bereiche",
                 "text": "Konsequente Zutrittssteuerung für Entwicklungs- und Prototypenbereiche der Zulieferindustrie."},
            ],
        },
        {
            "type": "services", "n": 3, "comment": "LEISTUNGEN IN SCHWEINFURT",
            "h2": "Unsere Sicherheitsdienstleistungen in Schweinfurt",
            "lede": "Vom Werkschutz als Kernthema der Industriestadt bis zum Veranstaltungsschutz: Alle FRANKONIA Leistungen stehen Ihnen auch in Schweinfurt zur Verfügung.",
            "rows": [
                {"name": "Werkschutz in Schweinfurt", "href": "/werkschutz/",
                 "text": "Das Kernthema der Industriestadt — Pforte, Rundgänge, Anlagen-Bedienung."},
                {"name": "Objektschutz in Schweinfurt", "href": "/objektschutz/",
                 "text": "Bestreifung und Zugangskontrolle für Verwaltung, Handel und Einrichtungen."},
                {"name": "Baustellenbewachung in Schweinfurt", "href": "/baustellenbewachung/",
                 "text": "Schutz für Gewerbe- und Konversionsprojekte."},
                {"name": "Brandwache in Schweinfurt", "href": "/brandwache/",
                 "text": "Brandsicherheitswachen bei BMA-Ausfall und Heißarbeiten, in der Industrie Alltag, bei uns Routine."},
                {"name": "Empfangsdienst in Schweinfurt", "href": "/empfangsdienst/",
                 "text": "Pforte und Empfang mit Sicherheitskompetenz für Industrie und Verwaltung."},
                {"name": "Veranstaltungsschutz in Schweinfurt", "href": "/veranstaltungsschutz/",
                 "text": "Einlass und Ordnerdienst für Feste, Kultur und Firmenevents."},
                {"name": "Kaufhausdetektei in Schweinfurt", "href": "/kaufhausdetektei/",
                 "text": "Zivile Ladendetektive für Handel und Filialen."},
                {"name": "Sicherheitstechnik in Schweinfurt", "href": "/sicherheitstechnik/",
                 "text": "Videoüberwachung, Alarm- und Zutrittstechnik, geplant als Teil des Gesamtkonzepts."},
            ],
        },
        {
            "type": "fields", "n": 4, "comment": "LOKALE EINSATZFELDER IN SCHWEINFURT",
            "eyebrow": "Vor Ort im Einsatz",  # UI
            "h2": "Wo Sicherheitsdienste in Schweinfurt gebraucht werden",
            "items": [
                {"title": "Industrieareale und Hafen in Schweinfurt",
                 "text": "Rund um die großen Werksstandorte und den Hafen konzentrieren sich Warenwerte, Gefahrstoffe und durchgehender Verkehr, dokumentierte Kontrolle ist hier Versicherungs-Grundlage, nicht Kür."},
                {"title": "Konversionsflächen in Schweinfurt",
                 "text": "Auf den ehemaligen US-Arealen entstehen neue Quartiere, Hochschul- und Gewerbeflächen, mit Baustellen, Leerständen und Übergangsnutzungen, die bewacht werden wollen.",
                 "link": ("Zur Baustellenbewachung", "/baustellenbewachung/")},
                {"title": "Innenstadt und Handel in Schweinfurt",
                 "text": "Einkaufslagen und Stadtgalerie: Ladendiebstahl kostet Marge, zivile Detektive und Doorman-Präsenz wirken messbar.",
                 "link": ("Zur Kaufhausdetektei", "/kaufhausdetektei/")},
                {"title": "Volksfeste und Veranstaltungen in Schweinfurt",
                 "text": "Vom Volksfest bis zum Stadtevent — Einlass, Ordnerdienst und Auflagen-Unterstützung aus einer Hand."},
            ],
        },
        {
            "type": "price", "n": 5,
            "h2": "Was kostet ein Sicherheitsdienst in Schweinfurt?",
            "answer": "Im Raum Schweinfurt liegen die Stundensätze in der Regel zwischen {{price.min}} und {{price.max}} Euro netto. Zuschläge für Nacht, Wochenende und Feiertage nach Tarif.",
            "boxNote": "netto, Richtwerte für Einsätze in Stadt und Landkreis Schweinfurt",  # UI
            "rates": [("Werkschutz", "(technik-geschulte Kräfte)"), "Baustellenbewachung"],
            "hint": "Richtwerte netto, Zuschläge nach Tarif. Ihr konkretes Angebot erhalten Sie unverbindlich innerhalb eines Werktages.",
        },
        {
            "type": "proof", "n": 6,
            "h2": "So bleibt Ihr Sicherheitsdienst in Schweinfurt jederzeit greifbar",
            "items": [
                {"icon": "icon-clock", "text": "24/7 direkt erreichbare Einsatzleitung"},
                {"icon": "icon-route", "text": "Digitales Wachbuch mit Checkpoint-Nachweis"},
                {"icon": "icon-transparency", "text": "Regelmäßiger Report für Ihre Geschäftsführung"},
            ],
            "outro": 'Schweinfurt liegt zwischen unseren Einsatzräumen Bamberg und <a href="/sicherheitsdienst-wuerzburg/">Würzburg</a>, bei laufenden Aufträgen arbeitet Ihr festes Team vor Ort im Werk oder Objekt.',
        },
        {
            "type": "faq", "n": 7,
            "h2": "Sicherheitsdienst Schweinfurt: die häufigsten Fragen",
            "questions": [
                {"q": "Hat FRANKONIA einen Standort in Schweinfurt?",
                 "a": "Schweinfurt ist eines unserer festen Einsatzgebiete mit laufenden Aufträgen: Ihre Kräfte arbeiten fest vor Ort im Werk oder Objekt, die Einsatzleitung erreichen Sie rund um die Uhr direkt."},
                {"q": "Was kostet Werkschutz in Schweinfurt?",
                 "a": "Werkschutz mit technik-geschulten Kräften kostet in der Regel {{price.min}} bis {{price.max}} Euro pro Stunde netto, abhängig von Qualifikation, Besetzungszeiten und Aufgabenumfang. Ein 24/7-Posten wird individuell kalkuliert; das Angebot erhalten Sie innerhalb eines Werktages nach der kostenfreien Begehung."},
                {"q": "Können die FRANKONIA Kräfte unsere Werksanlagen bedienen?",
                 "a": "Ja, alle Werkschutzkräfte sind technik-geschult und werden nach Checkliste in Ihre Brandmelde-, Alarm- und Zutrittsanlagen eingearbeitet. Die Einarbeitung wird dokumentiert."},
                {"q": "Stellt FRANKONIA Brandwachen für Industriebetriebe in Schweinfurt?",
                 "a": 'Ja, Brandsicherheitswachen bei BMA-Ausfall, Heißarbeiten und Sonderlagen, nach Absprache auch kurzfristig am Wochenende. Die Einsatzleitung ist rund um die Uhr erreichbar: <a href="{{phone.href}}">{{phone.display}}</a>.'},
                {"q": "Betreut FRANKONIA auch Betriebe im Landkreis Schweinfurt?",
                 "a": "Ja, Stadt und Landkreis Schweinfurt gehören komplett zum Einsatzgebiet."},
            ],
        },
        {
            "type": "form", "n": 8,
            "h2": "Jetzt Sicherheitsdienst für Schweinfurt anfragen",
            "lede": "Beschreiben Sie kurz Werk, Objekt oder Baustelle in Schweinfurt — Angebot innerhalb eines Werktages, kostenfreie Begehung inklusive.",
            "formTitle": "Ihre Anfrage für Schweinfurt",
            "messageLabel": "Ihr Werk, Objekt oder Ihre Baustelle in Schweinfurt",
        },
        {
            "type": "nearby", "n": 9,
            "h2": "Sicherheitsdienst rund um Schweinfurt",  # UI
            "lede": "Unser Einsatzgebiet endet nicht an der Schweinfurter Stadtgrenze: Auch in Würzburg und Bamberg übernehmen wir Werkschutz, Objektschutz und mehr.",  # UI
            "tiles": [
                {"name": "Würzburg", "href": "/sicherheitsdienst-wuerzburg/"},
                {"name": "Bamberg", "href": "/sicherheitsdienst-bamberg/"},
            ],
        },
    ],
}

# --------------------------------------------------------------------------
# 20 — COBURG. Struktur-Variante "Konzern- & Verwaltungsstadt".
# --------------------------------------------------------------------------
COBURG = {
    "url": "sicherheitsdienst-coburg",
    "geo": "coburg",
    "name": "Coburg",
    "prefix": "cb",
    "docx": "2026-08-04 Webtext 20 Stadt Coburg.docx",
    "title": "Sicherheitsdienst Coburg | Objektschutz – FRANKONIA",
    "description": "Sicherheitsdienst für Coburg: Objektschutz & Empfang für Zentralen, Werkschutz, Brandwache & Events. DEKRA-zertifiziert, Angebot in einem Werktag.",
    "pageNote": """
     ⚠️ SECTION 5 IS A SICHERHEITSKONZEPT SECTION, NOT A BRANDWACHE ONE — the
     draft calls it a "Sektions-Variante statt Brandwache" and Brandwache is one
     sentence inside it. That is why this page's fifth section carries the
     30%-savings claim and a /sicherheitskonzept/ link instead of a phone CTA.
     No combo pages for Coburg in this phase.
""",
    "sections": [
        {
            "type": "hero", "n": 1,
            "badge": "Einsatzgebiet Coburg — Sicherheit mit Repräsentationsanspruch",
            "badgeNote": 'The badge says "Einsatzgebiet", which is the UWG disclosure of §10.1 and\n         the draft\'s own copy.',
            "h1": "Sicherheitsdienst Coburg",
            "subline": "Objektschutz und Empfang für Zentralen, Werkschutz für Produktion — Sicherheit auf Coburger Niveau.",
            "ticks": [
                "Repräsentativer Empfang und Objektschutz für Zentralen und Verwaltungen",
                "Digital dokumentiert: Wachbuch, Checkpoints, Reports",
                "Unverbindliches Angebot innerhalb eines Werktages",
            ],
        },
        {
            "type": "why", "n": 2, "comment": "WARUM FRANKONIA IN COBURG",
            "h2": "Coburg beherbergt Zentralen von Weltrang, und verdient Sicherheit auf demselben Niveau",
            "lede": "Für seine Größe hat Coburg eine erstaunliche Wirtschaftsdichte: die Zentrale eines der größten deutschen Versicherer, weltweit tätige Familienunternehmen im Automobil- und Maschinenbau, dazu Behörden und eine lebendige Innenstadt unterhalb der Veste. Solche Standorte brauchen Sicherheit, die repräsentiert statt nur bewacht — Empfang, Zutrittssteuerung und Objektschutz mit gepflegtem Auftreten.",
            "cards": [
                {"icon": "icon-contact", "title": "Zentralen-Erfahrung",
                 "text": "Empfangs- und Objektschutzkonzepte für Verwaltungs- und Konzernstandorte, im Anzug statt in Kampfmontur, konsequent in der Sache."},
                {"icon": "icon-transparency", "title": "Modern und digital nachweisbar",
                 "text": "Wachbuch, Checkpoint-Kontrollen und Reports zeigen Ihnen jederzeit, was an Ihrem Coburger Standort passiert."},
                {"icon": "icon-building", "title": "Mittelstand versteht Mittelstand",
                 "text": "FRANKONIA ist selbst inhabergeführt — Entscheidungen fallen schnell, Verantwortung hat einen Namen."},
            ],
        },
        {
            "type": "services", "n": 3, "comment": "LEISTUNGEN IN COBURG",
            "h2": "Unsere Sicherheitsdienstleistungen in Coburg",
            "lede": "Vom repräsentativen Empfangsdienst für Zentralen bis zur kurzfristigen Brandwache: Alle FRANKONIA Leistungen stehen Ihnen auch in Coburg zur Verfügung.",
            "rows": [
                {"name": "Werkschutz in Coburg", "href": "/werkschutz/",
                 "text": "Pforte und Rundgänge für Produktionsstandorte des Coburger Landes."},
                {"name": "Objektschutz in Coburg", "href": "/objektschutz/",
                 "text": "Bestreifung, Zugangskontrolle und Alarmverfolgung für Zentralen, Verwaltung und Gewerbe."},
                {"name": "Baustellenbewachung in Coburg", "href": "/baustellenbewachung/",
                 "text": "Schutz für Bau- und Sanierungsprojekte in Stadt und Landkreis."},
                {"name": "Brandwache in Coburg", "href": "/brandwache/",
                 "text": "Kurzfristige Brandsicherheitswachen bei BMA-Ausfall und Heißarbeiten."},
                {"name": "Empfangsdienst in Coburg", "href": "/empfangsdienst/",
                 "text": "Repräsentativer Empfang mit Sicherheitskompetenz, der erste Eindruck Ihrer Zentrale."},
                {"name": "Veranstaltungsschutz in Coburg", "href": "/veranstaltungsschutz/",
                 "text": "Einlass und Ordnerdienst, vom Firmenevent bis zum Festival."},
                {"name": "Kaufhausdetektei in Coburg", "href": "/kaufhausdetektei/",
                 "text": "Zivile Ladendetektive für Handel und Filialen."},
                {"name": "Sicherheitstechnik in Coburg", "href": "/sicherheitstechnik/",
                 "text": "Videoüberwachung, Alarm- und Zutrittstechnik, geplant als Teil des Gesamtkonzepts."},
            ],
        },
        {
            "type": "fields", "n": 4, "comment": "LOKALE EINSATZFELDER IN COBURG",
            "eyebrow": "Vor Ort im Einsatz",  # UI
            "h2": "Wo Sicherheitsdienste in Coburg gebraucht werden",
            "items": [
                {"title": "Verwaltungs- und Konzernstandorte in Coburg",
                 "text": "Große Bürostandorte mit Publikumsverkehr, Besucher-Management und sensiblen Bereichen — Empfangsdienst und Zutrittssteuerung sind hier die Kern-Disziplin."},
                {"title": "Produktion im Coburger Land",
                 "text": "Automobilzulieferer, Maschinen- und Anlagenbau in Stadt und Umland — Werkschutz, Verschlussrunden und Fremdfirmen-Koordination im Schichtbetrieb."},
                {"title": "Veranstaltungen in Coburg",
                 "text": "Wenn das Sambafestival die Innenstadt füllt oder auf der Veste und in der Innenstadt Kulturformate laufen, zählen Einlass, Ordnerdienst und Deeskalation, abgestimmt mit den Behörden."},
                {"title": "Innenstadt-Handel in Coburg",
                 "text": "Zwischen Marktplatz und Spitalgasse gilt wie überall: Ladendiebstahl kostet Marge, zivile Detektive wirken.",
                 "link": ("Zur Kaufhausdetektei", "/kaufhausdetektei/")},
            ],
        },
        {
            "type": "callout", "n": 5, "comment": "KOSTENFREIES SICHERHEITSKONZEPT",
            "note": """    <!-- ⚠️ The draft replaces the Brandwache section with this one on THIS page
         ("Sektions-Variante statt Brandwache"), and Brandwache survives as its
         second sentence. So there is no phone CTA here: this section is about a
         planned survey, not an emergency, and the phone belongs to the emergency.
         The 30% figure is the client's own approved claim, published verbatim. -->
""",
            "eyebrow": "Sicherheitskonzept Coburg",  # UI
            "h2": "Ihr kostenfreies Sicherheitskonzept für Coburg",
            "ledes": [
                "Vor dem ersten Einsatz analysieren unsere Sicherheitsexperten Ihr Coburger Objekt: Zugänge, Risiken, vorhandene Technik. Sie erhalten ein schriftliches Sicherheitskonzept, kostenfrei und unverbindlich — Kunden haben damit schon bis zu 30 % Kosten gespart.",
                'Brandwachen bei BMA-Ausfall oder Heißarbeiten stellen wir in Coburg selbstverständlich ebenfalls, nach Absprache auch kurzfristig. <a href="/brandwache/">Alles zur Brandwache</a>.',
            ],
            "link": ("So entsteht Ihr Sicherheitskonzept", "/sicherheitskonzept/"),
        },
        {
            "type": "price", "n": 6,
            "h2": "Was kostet ein Sicherheitsdienst in Coburg?",
            "answer": "Im Raum Coburg liegen die Stundensätze in der Regel zwischen {{price.min}} und {{price.max}} Euro netto. Zuschläge nach Tarif.",
            "boxNote": "netto, Richtwerte für Einsätze in Stadt und Landkreis Coburg",  # UI
            "rates": ["Empfangsdienst", "Werkschutz", "Baustellenbewachung"],
            "hint": "Richtwerte netto, Zuschläge nach Tarif. Ihr konkretes Angebot erhalten Sie unverbindlich innerhalb eines Werktages.",
        },
        {
            "type": "faq", "n": 7,
            "h2": "Sicherheitsdienst Coburg: die häufigsten Fragen",
            "questions": [
                {"q": "Hat FRANKONIA ein Büro in Coburg?",
                 "a": "Coburg ist eines unserer festen Einsatzgebiete mit laufenden Aufträgen: Ihre Kräfte arbeiten fest vor Ort, die Einsatzleitung erreichen Sie rund um die Uhr direkt."},
                {"q": "Was kostet ein Sicherheitsdienst in Coburg?",
                 "a": "In der Regel {{price.min}} bis {{price.max}} Euro pro Stunde netto, je nach Leistung und Einsatzzeit. Ihr unverbindliches Angebot erhalten Sie innerhalb eines Werktages, auf Wunsch nach kostenfreier Begehung Ihres Standorts."},
                {"q": "Übernimmt FRANKONIA den Empfang in Unternehmenszentralen?",
                 "a": 'Ja — Empfangsdienst mit Sicherheitskompetenz ist eine FRANKONIA Kernleistung: Besucher-Management, Telefonzentrale, Zutrittssteuerung, im Business-Outfit Ihres Hauses. Sie reden bei der Personalauswahl mit. <a href="/empfangsdienst/">Zum Empfangsdienst</a>.'},
                {"q": "Sichert FRANKONIA Veranstaltungen wie das Sambafestival ab?",
                 "a": "FRANKONIA übernimmt Veranstaltungsschutz in Coburg, von der Personalbemessung über behördliche Auflagen bis zu Einlass und Ordnerdienst. Für Großformate gilt: früh anfragen, dann ist die Besetzung gesichert."},
                {"q": "Betreut FRANKONIA auch Betriebe im Landkreis Coburg?",
                 "a": 'Ja — Stadt und Landkreis Coburg bis zur thüringischen Landesgrenze gehören zum Einsatzgebiet. Ob wir Ihren Standort zuverlässig bedienen können, klären wir kurz am Telefon: <a href="{{phone.href}}">{{phone.display}}</a>.'},
            ],
        },
        {
            "type": "form", "n": 8,
            "h2": "Jetzt Sicherheitsdienst für Coburg anfragen",
            "lede": "Beschreiben Sie kurz Ihren Standort oder Ihre Veranstaltung in Coburg — Angebot innerhalb eines Werktages.",
            "formTitle": "Ihre Anfrage für Coburg",
            "messageLabel": "Ihr Standort oder Ihre Veranstaltung in Coburg",
        },
        {
            "type": "nearby", "n": 9,
            "h2": "Sicherheitsdienst rund um Coburg",  # UI
            "lede": "Unser Einsatzgebiet endet nicht an der Coburger Stadtgrenze: Auch in Bamberg und Bayreuth übernehmen wir Objektschutz, Empfangsdienst und mehr.",  # UI
            "tiles": [
                {"name": "Bamberg", "href": "/sicherheitsdienst-bamberg/"},
                {"name": "Bayreuth", "href": "/sicherheitsdienst-bayreuth/"},
            ],
        },
    ],
}

# --------------------------------------------------------------------------
# 21 — FORCHHEIM. Struktur-Variante kompakt (7 Sektionen).
# --------------------------------------------------------------------------
FORCHHEIM = {
    "url": "sicherheitsdienst-forchheim",
    "geo": "forchheim",
    "name": "Forchheim",
    "prefix": "fo",
    "docx": "2026-08-04 Webtext 21 Stadt Forchheim.docx",
    "title": "Sicherheitsdienst Forchheim | Wachdienst – FRANKONIA",
    "description": "Sicherheitsdienst für Forchheim: Objektschutz, Werkschutz, Brandwache & Events. DEKRA-zertifiziert, digital nachweisbar, Angebot in einem Werktag.",
    "pageNote": """
     ⚠️ THE SHORTEST OF THE TEN — the draft is an explicitly compact 7-section
     variant, so there is no Brandwache section, no Erreichbarkeit strip and no
     Trust section. That leaves Einsatzfelder, Kosten and FAQ adjacent, all three
     of them light-only blocks, so the page carries a three-section light run with
     no seams inside it (§9.2). That is a consequence of the copy, not an
     oversight: the alternatives were to invent a section or to reorder the
     client's structure for rhythm alone, and neither is worth it.
""",
    "sections": [
        {
            "type": "hero", "n": 1,
            "badge": "Einsatzgebiet Forchheim, fester Ansprechpartner rund um die Uhr",
            "badgeNote": 'The badge says "Einsatzgebiet", which is the UWG disclosure of §10.1 and\n         the draft\'s own copy.',
            "h1": "Sicherheitsdienst Forchheim",
            "subline": "Objektschutz, Werkschutz, Brandwache und Events für Forchheim, durch IHK-qualifizierte Kräfte, DEKRA-zertifiziert.",
            "ticks": [
                "Digital nachweisbar: Wachbuch, Checkpoints und Reports",
                "Feste Teams für laufende Aufträge in Forchheim",
                "Unverbindliches Angebot innerhalb eines Werktages",
            ],
        },
        {
            "type": "why", "n": 2, "comment": "WARUM FRANKONIA IN FORCHHEIM",
            "h2": "Warum FRANKONIA in Forchheim",
            "lede": "Forchheim gehört zu den Räumen, in denen FRANKONIA täglich im Einsatz ist, mit laufenden Objekten und einem Team, das die Königstadt und ihre Gewerbestandorte kennt: vom Medizintechnik-Werk im Süden bis zu den Gewerbeflächen im Umland.",
            "cards": [
                {"icon": "icon-pin", "title": "Im Einsatz vor Ort",
                 "text": "Laufende Aufträge im Raum Forchheim, kurzfristige Einsätze nach Absprache inklusive."},
                {"icon": "icon-transparency", "title": "Professionell und digital",
                 "text": "Zertifizierte Prozesse, digitales Wachbuch, Reports und feste Teams."},
                {"icon": "icon-shield-check", "title": "Zertifiziert",
                 "text": "DIN 77200-1, ISO 9001, DEKRA-geprüft, Kräfte nach § 34a GewO."},
            ],
        },
        {
            "type": "services", "n": 3, "comment": "LEISTUNGEN IN FORCHHEIM",
            "h2": "Unsere Sicherheitsdienstleistungen in Forchheim",
            "lede": "Vom Werkschutz für Produktionsstandorte bis zur kurzfristigen Brandwache: Alle FRANKONIA Leistungen stehen Ihnen auch in Forchheim zur Verfügung.",
            "rows": [
                {"name": "Werkschutz in Forchheim", "href": "/werkschutz/",
                 "text": "Pforte und Rundgänge für Produktionsstandorte, von Medizintechnik bis Lebensmittel."},
                {"name": "Objektschutz in Forchheim", "href": "/objektschutz/",
                 "text": "Bestreifung und Zugangskontrolle für Gewerbe, Praxen und Einrichtungen."},
                {"name": "Baustellenbewachung in Forchheim", "href": "/baustellenbewachung/",
                 "text": "Schutz für Wohnbau- und Gewerbeprojekte in Stadt und Landkreis."},
                {"name": "Brandwache in Forchheim", "href": "/brandwache/",
                 "text": "Kurzfristige Brandsicherheitswachen bei BMA-Ausfall und Heißarbeiten."},
                {"name": "Empfangsdienst in Forchheim", "href": "/empfangsdienst/",
                 "text": "Professioneller Empfang mit Sicherheitskompetenz für Betriebe."},
                {"name": "Veranstaltungsschutz in Forchheim", "href": "/veranstaltungsschutz/",
                 "text": "Einlass und Ordnerdienst, vom Firmenevent bis zum Volksfest."},
                {"name": "Kaufhausdetektei in Forchheim", "href": "/kaufhausdetektei/",
                 "text": "Zivile Ladendetektive für den Handel in Altstadt und Umland."},
                {"name": "Sicherheitstechnik in Forchheim", "href": "/sicherheitstechnik/",
                 "text": "Videoüberwachung, Alarm- und Zutrittstechnik, geplant als Teil des Gesamtkonzepts."},
            ],
        },
        {
            "type": "fields", "n": 4, "comment": "LOKALE EINSATZFELDER IN FORCHHEIM",
            "eyebrow": "Vor Ort im Einsatz",  # UI
            "h2": "Wo Sicherheitsdienste in Forchheim gebraucht werden",
            "items": [
                {"title": "Industrie und Gewerbe im Forchheimer Süden",
                 "text": "Rund um die großen Werksstandorte und Gewerbegebiete gilt: hohe Werte, Pendlerverkehr, nachts ruhige Areale — Werkschutz und dokumentierte Kontrollen greifen hier ineinander."},
                {"title": "Feste und Veranstaltungen in Forchheim",
                 "text": "Wenn gefeiert wird, braucht es erfahrene Einlass- und Ordnerkräfte, dazu Objektschutz für Betriebe und Anlieger."},
                {"title": "Altstadt und Handel in Forchheim",
                 "text": "Fachwerk-Altstadt mit Einzelhandel und Gastronomie — Ladendetektei und Einlass-Dienste nach Bedarf.",
                 "link": ("Zur Kaufhausdetektei", "/kaufhausdetektei/")},
                {"title": "Wohn- und Gewerbebau in Stadt und Landkreis",
                 "text": "Forchheim baut und verdichtet. Baustellenbewachung mit flexiblen Konzepten schützt Gerät und Termine."},
            ],
        },
        {
            "type": "price", "n": 5,
            "h2": "Was kostet ein Sicherheitsdienst in Forchheim?",
            "answer": "In Forchheim gelten die FRANKONIA Standardspannen: {{price.min}} bis {{price.max}} Euro pro Stunde netto je nach Leistung und Einsatzzeit.",
            "boxNote": "netto, Richtwerte für Einsätze in Stadt und Landkreis Forchheim",  # UI
            "rates": ["Baustellenbewachung", "Werkschutz"],
            "hint": "Richtwerte netto. Ihr konkretes Angebot erhalten Sie unverbindlich innerhalb eines Werktages.",
        },
        {
            "type": "faq", "n": 6,
            "h2": "Sicherheitsdienst Forchheim: die häufigsten Fragen",
            "questions": [
                {"q": "Wie schnell kann FRANKONIA in Forchheim starten?",
                 "a": "Sehr kurzfristig: Die Einsatzleitung ist rund um die Uhr erreichbar und organisiert Einsätze nach Absprache auch von heute auf morgen. Laufende Aufträge im Raum Forchheim betreuen feste Teams."},
                {"q": "Was kostet ein Sicherheitsdienst in Forchheim?",
                 "a": "In der Regel {{price.min}} bis {{price.max}} Euro pro Stunde netto, je nach Leistung und Einsatzzeit. Ihr unverbindliches Angebot erhalten Sie innerhalb eines Werktages."},
                {"q": "Übernimmt FRANKONIA Feste und Veranstaltungen in Forchheim?",
                 "a": "Ja — Einlass, Ordnerdienst, Objektschutz für Anlieger und Betriebe sowie Brandsicherheitswachen nach Auflage. Je früher Sie anfragen, desto sicherer ist die Wunschbesetzung."},
                {"q": "Betreut FRANKONIA auch den Landkreis Forchheim?",
                 "a": 'Ja — Stadt und Landkreis Forchheim inklusive der Gewerbestandorte im Umland und im Wiesenttal gehören zum festen Einsatzgebiet. Kurzes Telefonat genügt: <a href="{{phone.href}}">{{phone.display}}</a>.'},
                {"q": "Lohnt sich ein Sicherheitsdienst auch für kleinere Betriebe in Forchheim?",
                 "a": 'Ja. Kontrollrunden statt Dauerposten oder die Kombination mit Technik machen auch kleinere Schutzkonzepte wirtschaftlich. Der beste Start ist das <a href="/sicherheitskonzept/">kostenfreie Sicherheitskonzept</a>: hochprofessionell, kostet nichts, und Kunden haben damit schon bis zu 30 % gespart.'},
            ],
        },
        {
            "type": "form", "n": 7,
            "h2": "Jetzt Sicherheitsdienst für Forchheim anfragen",
            "lede": "Beschreiben Sie kurz Ihr Objekt oder Vorhaben in Forchheim — Angebot innerhalb eines Werktages, Begehung meist noch in derselben Woche.",
            "formTitle": "Ihre Anfrage für Forchheim",
            "messageLabel": "Ihr Objekt oder Vorhaben in Forchheim",
        },
        {
            "type": "nearby", "n": 8,
            "h2": "Sicherheitsdienst rund um Forchheim",  # UI
            "lede": "Unser Einsatzgebiet endet nicht an der Forchheimer Stadtgrenze: Auch in Bamberg und Erlangen übernehmen wir Objektschutz, Baustellenbewachung und mehr.",  # UI
            "tiles": [
                {"name": "Bamberg", "href": "/sicherheitsdienst-bamberg/"},
                {"name": "Erlangen", "href": "/sicherheitsdienst-erlangen/"},
            ],
        },
    ],
}

# --------------------------------------------------------------------------
# 22 — ANSBACH. Struktur-Variante kompakt; Behörden- + Logistik-Fokus.
# --------------------------------------------------------------------------
ANSBACH = {
    "url": "sicherheitsdienst-ansbach",
    "geo": "ansbach",
    "name": "Ansbach",
    "prefix": "an",
    "docx": "2026-08-04 Webtext 22 Stadt Ansbach.docx",
    "title": "Sicherheitsdienst Ansbach | Wachdienst – FRANKONIA",
    "description": "Sicherheitsdienst für Ansbach: Objektschutz, Wachdienst, Brandwache & Baustellenbewachung in Westmittelfranken. DEKRA-zertifiziert, Angebot in 1 Werktag.",
    "pageNote": """
     ⚠️ THE WARUM SECTION IS PROSE, NOT CARDS. Webtext 22's section 2 is two
     paragraphs with no card list at all, so it renders as a prose callout rather
     than as the four-card grid — inventing three card titles to fill the usual
     shape would be writing copy. It also takes the LIGHT surface, which is
     available precisely because a prose callout has no dark-only tint.
     ⚠️ The draft is candid in two of its FAQ answers ("eine ehrliche
     Einschätzung, ob wir die richtige Wahl sind", "prüfen wir die Machbarkeit
     ehrlich am Telefon") because Ansbach is the outer edge of the Einsatzgebiet.
     That honesty is the point — do not smooth it into a coverage promise.
""",
    "sections": [
        {
            "type": "hero", "n": 1,
            "badge": "Einsatzgebiet Ansbach, für laufende Aufträge und geplante Einsätze",
            "badgeNote": 'The badge says "Einsatzgebiet", which is the UWG disclosure of §10.1 and\n         the draft\'s own copy.',
            "h1": "Sicherheitsdienst Ansbach",
            "subline": "Ihr Sicherheitsdienst für Ansbach und Westmittelfranken: Objektschutz, Wachdienst, Brandwache und Baustellenbewachung durch IHK-qualifizierte Kräfte — DEKRA-zertifiziert nach DIN 77200-1 und ISO 9001.",
            "ticks": [
                "Feste Teams vor Ort bei laufenden Aufträgen in Ansbach",
                "Erfahrung mit Behörden, Verwaltung und Industrie",
                "Unverbindliches Angebot innerhalb eines Werktages",
            ],
        },
        {
            "type": "callout", "n": 2, "comment": "WARUM FRANKONIA IN ANSBACH",
            "surface": "light",
            "note": """    <!-- Prose, not cards: the draft gives two paragraphs and no card list, and
         inventing three card titles to fill the usual grid would be writing copy.
         Prose-only means no dark-only tint, so this can take the light surface
         and keep the page alternating. -->
""",
            "h2": "Warum FRANKONIA in Ansbach",
            "ledes": [
                "Ansbach gehört zu unseren festen Einsatzgebieten: Ihre Sicherheitskräfte arbeiten fest vor Ort im Objekt, koordiniert über die 24/7 erreichbare Einsatzleitung und dokumentiert in digitalen Systemen, die Sie jederzeit einsehen können.",
                "Dauerhafte Bewachung, Werkschutz, Empfang und geplante Einsätze übernehmen wir in Ansbach uneingeschränkt, mit festen Teams und zertifizierten Prozessen: DIN 77200-1, ISO 9001, DEKRA-geprüft.",
            ],
        },
        {
            "type": "services", "n": 3, "comment": "LEISTUNGEN IN ANSBACH",
            "h2": "Unsere Sicherheitsdienstleistungen in Ansbach",
            "lede": "Vom Objektschutz für Verwaltung und Gewerbe bis zur geplanten Brandwache: Alle FRANKONIA Leistungen stehen Ihnen auch in Ansbach und Westmittelfranken zur Verfügung.",
            "rows": [
                {"name": "Werkschutz in Ansbach", "href": "/werkschutz/",
                 "text": "Pforte und Rundgänge für Industrie- und Zuliefererstandorte."},
                {"name": "Objektschutz in Ansbach", "href": "/objektschutz/",
                 "text": "Bestreifung, Zugangskontrolle und Alarmverfolgung für Verwaltung, Gewerbe und Einrichtungen."},
                {"name": "Baustellenbewachung in Ansbach", "href": "/baustellenbewachung/",
                 "text": "Schutz für Bauprojekte in Stadt und Landkreis, konzipiert je Bauphase."},
                {"name": "Brandwache in Ansbach", "href": "/brandwache/",
                 "text": "Geplante Brandsicherheitswachen bei Heißarbeiten, BMA-Wartung und Veranstaltungen."},
                {"name": "Empfangsdienst in Ansbach", "href": "/empfangsdienst/",
                 "text": "Professioneller Empfang mit Sicherheitskompetenz für Behörden und Verwaltungen."},
                {"name": "Veranstaltungsschutz in Ansbach", "href": "/veranstaltungsschutz/",
                 "text": "Einlass, Ordnerdienst und Auflagen-Unterstützung für Feste und Events."},
                {"name": "Kaufhausdetektei in Ansbach", "href": "/kaufhausdetektei/",
                 "text": "Zivile Ladendetektive für Handel und Filialen."},
                {"name": "Sicherheitstechnik in Ansbach", "href": "/sicherheitstechnik/",
                 "text": "Videoüberwachung, Alarm- und Zutrittstechnik, geplant als Teil des Gesamtkonzepts."},
            ],
        },
        {
            "type": "fields", "n": 4, "comment": "LOKALE EINSATZFELDER IN ANSBACH",
            "eyebrow": "Vor Ort im Einsatz",  # UI
            "h2": "Wo Sicherheitsdienste in Ansbach gebraucht werden",
            "items": [
                {"title": "Behörden und Verwaltung in Ansbach",
                 "text": "Als Regierungssitz Mittelfrankens konzentriert Ansbach Ämter, Gerichte und Institutionen — Zutrittssteuerung, Empfangsdienste und Objektschutz mit dokumentierten, vergabetauglichen Prozessen.",
                 "link": ("Zum Empfangsdienst", "/empfangsdienst/")},
                {"title": "Industrie und Zulieferer in Ansbach",
                 "text": "Kunststoff-, Automobil- und Elektronikfertigung prägen den Standort — Werkschutz mit technik-geschulten Kräften und Fremdfirmen-Koordination."},
                {"title": "Logistik am A6-Korridor bei Ansbach",
                 "text": "Die A6 als Ost-West-Achse zieht Speditionen und Lager an — Zufahrtskontrolle, Verschlussrunden und Baustellenbewachung entlang des Korridors."},
                {"title": "Veranstaltungen in Ansbach",
                 "text": "Von den Rokoko-Festspielen bis zu Stadt- und Firmenevents — Einlass und Ordnerdienst mit Behörden-Abstimmung."},
            ],
        },
        {
            "type": "price", "n": 5,
            "h2": "Was kostet ein Sicherheitsdienst in Ansbach?",
            "answer": "Auch in Ansbach gilt die FRANKONIA Preislogik: {{price.min}} bis {{price.max}} Euro pro Stunde netto je nach Leistung, Qualifikation und Einsatzzeit.",
            "boxNote": "netto, Richtwerte für Einsätze in Ansbach und Westmittelfranken",  # UI
            "rates": ["Werkschutz", "Baustellenbewachung", "Veranstaltungsschutz"],
            "hint": "Richtwerte netto. Ihr konkretes Angebot erhalten Sie unverbindlich innerhalb eines Werktages.",
        },
        {
            "type": "faq", "n": 6,
            "h2": "Sicherheitsdienst Ansbach: die häufigsten Fragen",
            "questions": [
                {"q": "Übernimmt FRANKONIA laufende Aufträge in Ansbach?",
                 "a": "Ja, uneingeschränkt — Ihre Sicherheitskräfte arbeiten fest vor Ort im Objekt, koordiniert über die 24/7 erreichbare Einsatzleitung. Für einmalige Kurzeinsätze erhalten Sie vorab eine ehrliche Einschätzung, ob wir die richtige Wahl sind."},
                {"q": "Was kostet ein Sicherheitsdienst in Ansbach?",
                 "a": "In der Regel {{price.min}} bis {{price.max}} Euro pro Stunde netto, je nach Leistung und Einsatzzeit. Ihr unverbindliches Angebot erhalten Sie innerhalb eines Werktages."},
                {"q": "Arbeitet FRANKONIA für Behörden in Ansbach?",
                 "a": "FRANKONIA schützt Einrichtungen der öffentlichen Hand in ganz Franken, mit zertifiziertem System (DIN 77200-1, ISO 9001, DEKRA) und vergabetauglichen Nachweisen. Referenzen aus dem Behördenumfeld nennen wir im persönlichen Gespräch."},
                {"q": "Übernimmt FRANKONIA Baustellenbewachung entlang der A6?",
                 "a": "Ja — Logistik- und Infrastrukturprojekte am A6-Korridor gehören zu den typischen Anfragen aus dem Raum Ansbach. Konzepte werden je Bauphase kalkuliert, das Angebot kommt innerhalb eines Werktages."},
                {"q": "Wie läuft eine Brandwache in Ansbach?",
                 "a": 'Geplante Brandsicherheitswachen (Heißarbeiten, BMA-Wartung, Veranstaltungen) stellen wir zuverlässig mit Vorlauf; die Dokumentation für Behörde und Versicherer ist inklusive. Bei akuten Fällen prüfen wir die Machbarkeit ehrlich am Telefon: <a href="{{phone.href}}">{{phone.display}}</a>.'},
            ],
        },
        {
            "type": "form", "n": 7,
            "h2": "Jetzt Sicherheitsdienst für Ansbach anfragen",
            "lede": "Beschreiben Sie kurz Ihr Objekt oder Vorhaben in Ansbach — Sie erhalten eine ehrliche Einschätzung und Ihr unverbindliches Angebot innerhalb eines Werktages.",
            "formTitle": "Ihre Anfrage für Ansbach",
            "messageLabel": "Ihr Objekt oder Vorhaben in Ansbach",
        },
        {
            "type": "nearby", "n": 8,
            "h2": "Sicherheitsdienst rund um Ansbach",  # UI
            "lede": "Unser Einsatzgebiet endet nicht an der Ansbacher Stadtgrenze: Auch in Nürnberg und Fürth übernehmen wir Objektschutz, Baustellenbewachung und mehr.",  # UI
            "tiles": [
                {"name": "Nürnberg", "href": "/sicherheitsdienst-nuernberg/"},
                {"name": "Fürth", "href": "/sicherheitsdienst-fuerth/"},
            ],
        },
    ],
}

CITIES = [WUERZBURG, BAMBERG, ERLANGEN, FUERTH, BAYREUTH, SCHWEINFURT,
          COBURG, FORCHHEIM, ANSBACH]
