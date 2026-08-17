#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
THE NINE REMAINING SERVICE DRAFTS, VERBATIM — data only, no markup, no logic.

Extracted ONCE, mechanically, from NewVersionCopiesFrankonia/"2026-08-04 Webtext
NN <Service>.docx" (Stand 04.08.2026) and checked in here. Nothing in this file
was re-typed by hand, which is the entire point: these pages are the client's
copy and a transcription slip is invisible in a screenshot.

⚠️ THE .docx FILES ARE NOT IN GIT (CLAUDE.md). This file is therefore the only
version-controlled copy of these nine drafts' text. Do not "tidy" the German.

Shape, per service:
  meta      the draft's own Seiten-Meta lines, unparsed, for reference
  sections  {draft section number: {...}}

Within a section, the lines the DRAFT ITSELF labels are lifted out by name —
h1, h2, badge, subline, abbinder, hinweis, hinweis_box, highlight, link, cta,
cta_box, preis_box, form_title, related — and everything else stays in `body`,
IN SOURCE ORDER.

⚠️ `body` IS DELIBERATELY NOT PRE-SPLIT INTO "intro paragraphs" AND "list items",
and that is a correction. The first version of this file split every
"Label: text" line into an item automatically and got it wrong on six of the nine
services, because German prose is full of colons: "Der Empfang prägt den ersten
Eindruck von Ihrem Unternehmen: Wer hier unfreundlich behandelt wird …" parses
exactly like a list row, and so does the Risiko intro that opens on a quotation.
No length, word-count or capitalisation heuristic separates the two reliably —
each one this build tried passed on some drafts and silently swallowed an intro
paragraph into a card on others. So the split is DECLARED per section in
service_pages_data.py (`prose: N`), where it is one visible number the generator
asserts against, instead of a guess spread across nine pages.

The "Aufbau:" lines are dropped: they describe the intended layout to a designer
("H2 + 4 nummerierte Karten, Referenz-Abbinder"), they are not copy. Same
category as the "(Widget)" production note already removed from a city page.

WHICH of these lands in WHICH block is not decided here — that is
service_pages_data.py. This file is just the words.
"""

DRAFTS ={'objektschutz': {'meta': {'URL': 'URL: /objektschutz/',
                           'Title': 'Title (55 Zeichen): Objektschutz Franken | Objektbewachung '
                                    '24/7 – FRANKONIA',
                           'Meta-Description': 'Meta-Description (155 Zeichen): Objektschutz vom '
                                               'DEKRA-zertifizierten Sicherheitsdienst aus '
                                               'Bamberg: Bestreifung, Zugangskontrolle, '
                                               'Alarmverfolgung. Kostenfreies Sicherheitskonzept '
                                               'vorab.',
                           'Primär-Keyword': 'Primär-Keyword: objektschutz (1.600) · '
                                             'Unterstützend: objektbewachung (70), objektschutz '
                                             'kosten, gebäudebewachung, wachschutz (480)',
                           'Schema': 'Schema: Service (Provider → LocalBusiness, areaServed '
                                     'Franken/Bayern) + FAQPage + BreadcrumbList',
                           'Interne Links': 'Interne Links: /werkschutz/ · '
                                            '/revier-schliessdienst/ · /sicherheitstechnik/ · '
                                            '/sicherheitskonzept/ · /objektschutz-nuernberg/ '
                                            '(Kombiseite) · /sicherheitsdienst-nuernberg/, '
                                            '/sicherheitsdienst-wuerzburg/, '
                                            '/sicherheitsdienst-bamberg/ · Autoritätslinks: § '
                                            '34a GewO (gesetze-im-internet.de), BDSW (bdsw.de)'},
                  'sections': {1: {'name': 'Hero',
                                   'badge': 'DIN 77200-1 zertifiziert für stationäre '
                                            'Sicherheitsdienste',
                                   'h1': 'Objektschutz für Bamberg, Franken und Bayern',
                                   'subline': 'Ihr Objekt, sicher bewacht: dokumentierte '
                                              'Bestreifung, Zugangskontrolle und '
                                              'Alarmverfolgung, mit festem Ansprechpartner rund '
                                              'um die Uhr.',
                                   'body': ['Bestreifung, Zugangskontrolle und Alarmverfolgung '
                                            'aus dokumentierter Hand',
                                            'Feste Stammkräfte, die Ihr Objekt kennen, kein '
                                            'ständiger Wechsel',
                                            'Unverbindliches Angebot innerhalb eines Werktages']},
                               2: {'name': 'Risiko',
                                   'h2': 'Was ein unbewachtes Objekt wirklich kostet',
                                   'abbinder': 'Die gute Nachricht: Professioneller Objektschutz '
                                               'ist Prävention. Sichtbare, qualifizierte '
                                               'Sicherheitskräfte verhindern die meisten '
                                               'Vorfälle, bevor sie entstehen, und Sie haben im '
                                               'Ernstfall dokumentierte Nachweise statt offener '
                                               'Fragen.',
                                   'body': ['„Bei uns wurde noch nie etwas gestohlen": Diesen '
                                            'Satz hören wir oft, bis zum ersten Vorfall. Ohne '
                                            'professionellen Schutz zeigen sich die Probleme '
                                            'erst mit der Zeit, und im Ernstfall fehlen die '
                                            'Nachweise für die Versicherung.',
                                            'Einbruch: Unbewachte Objekte sind ein leichtes '
                                            'Ziel. Ein einziger Einbruch kostet oft mehr als ein '
                                            'ganzes Jahr professioneller Bewachung.',
                                            'Diebstahl: Diebstahl passiert selten spektakulär, '
                                            'aber regelmäßig. Sichtbare Präsenz und '
                                            'Zugangskontrolle stoppen Gelegenheitstäter wie '
                                            'organisierte Banden.',
                                            'Vandalismus: Graffiti, zerstörte Anlagen, '
                                            'beschädigte Fassaden: Das kostet Reparaturen und '
                                            'beschädigt das Bild Ihres Unternehmens.',
                                            'Brandgefahr: Ein unbemerkter Schwelbrand kann ein '
                                            'ganzes Objekt vernichten. Regelmäßige Kontrollgänge '
                                            'erkennen Gefahrenquellen früh.']},
                               3: {'name': 'Vorteile (Pain-Aufhänger)',
                                   'h2': 'Volle Kontrolle über Ihre Sicherheit, ohne selbst '
                                         'kontrollieren zu müssen',
                                   'body': ['Vertrauen entsteht nicht durch Versprechen, sondern '
                                            'durch Nachweise. Deshalb ist der FRANKONIA '
                                            'Objektschutz so aufgebaut, dass Sie jederzeit sehen '
                                            'können, was auf Ihrem Objekt passiert:',
                                            'Aufgaben zuverlässig erledigt: Jede Kraft wird nach '
                                            'Checkliste in Ihr Objekt eingearbeitet, alle '
                                            'Objektdaten liegen cloud-basiert vor. Das '
                                            'Wächterkontrollsystem belegt jede gelaufene Runde.',
                                            'Volle Transparenz: Digitales Wachbuch in Echtzeit, '
                                            'Vorfallberichte mit Foto, regelmäßiger Report für '
                                            'Ihre Geschäftsführung. Sie sehen jederzeit, was auf '
                                            'Ihrem Objekt passiert.',
                                            'Feste Stammkräfte: Überdurchschnittliche Bezahlung '
                                            'bedeutet weniger Fluktuation. Sie bekommen ein '
                                            'eingespieltes Team, das Zugänge, Abläufe und '
                                            'Besonderheiten Ihres Objekts kennt.']},
                               4: {'name': 'Leistungsumfang',
                                   'h2': 'Das ist im FRANKONIA Objektschutz enthalten',
                                   'subline': 'Ihr Objektschutz wird individuell auf Ihre '
                                              'Anforderungen zugeschnitten.',
                                   'highlight': 'Bestmöglicher Schutz: Personal plus Technik — '
                                                'Die preiswerteste Sicherheit entsteht aus der '
                                                'Kombination von geschultem Personal und '
                                                'moderner Technik. Wo Videoüberwachung oder '
                                                'Alarmanlagen sinnvoll sind, planen wir sie '
                                                'direkt in Ihr Sicherheitskonzept ein: ein '
                                                'Ansprechpartner, ein aktuelles Konzept, klare '
                                                'Zuständigkeiten. → /sicherheitstechnik/',
                                   'body': ['Bestreifung & Kontrollgänge: Regelmäßige und '
                                            'unregelmäßige Rundgänge über Ihr Gelände und durch '
                                            'Ihre Gebäude, damit Sicherheitsrisiken früh erkannt '
                                            'werden.',
                                            'Zugangskontrolle: Nur befugte Personen betreten Ihr '
                                            'Objekt — Kontrolle von Mitarbeiterausweisen, '
                                            'Besucher- und Lieferverkehr am Eingang.',
                                            'Alarmverfolgung & Technik-Bedienung: '
                                            'Technik-geschulte Kräfte bedienen Ihre '
                                            'Sicherheitsanlagen sachgemäß und reagieren auf '
                                            'jeden Alarm sofort und nach klarem Meldeplan.',
                                            'Lückenlose Dokumentation: Jeder Kontrollgang und '
                                            'jeder Vorfall wird präzise dokumentiert, als '
                                            'Nachweis für Sie, Ihre Geschäftsleitung und Ihre '
                                            'Versicherung.',
                                            'Professionelle Repräsentation: Ihre '
                                            'Sicherheitskräfte treten freundlich und kompetent '
                                            'auf, ganz nach Ihrem Wunsch im Hemd oder in '
                                            'Sicherheitsmontur.',
                                            'Fester Ansprechpartner, 24/7: Einsatz- und '
                                            'Bereichsleiter sind rund um die Uhr direkt für Sie '
                                            'erreichbar, keine Warteschleifen, keine '
                                            'Weiterleitungen.']},
                               5: {'name': 'Anwendungsfälle',
                                   'h2': 'Für diese Objekte wird FRANKONIA gebucht',
                                   'abbinder': 'Über 300 Unternehmen und Einrichtungen vertrauen '
                                               'FRANKONIA, darunter die Sozialstiftung Bamberg, '
                                               'MORELO Reisemobile und der CleanTech Innovation '
                                               'Park.',
                                   'body': ['01 Industrieanlagen & Firmengelände: Weitläufige '
                                            'Areale mit Maschinen, Material und Know-how '
                                            'brauchen konsequente Bestreifung und '
                                            'Zugangskontrolle, für Produktionsstandorte mit '
                                            'laufendem Betrieb übernimmt der spezialisierte '
                                            'Werkschutz. → /werkschutz/',
                                            '02 Bürogebäude & Verwaltungen: Schutz für '
                                            'Mitarbeitende, IT und sensible Unterlagen, dazu ein '
                                            'professioneller Auftritt gegenüber Gästen und '
                                            'Geschäftspartnern am Eingang.',
                                            '03 Logistik & Lagerhallen: Hohe Warenwerte, viel '
                                            'Verkehr, wechselnde Fahrer, hier zählen lückenlose '
                                            'Kontrolle des Lieferverkehrs und dokumentierte '
                                            'Rundgänge.',
                                            '04 Öffentliche Einrichtungen: Kliniken, Behörden, '
                                            'Schulen und Stiftungen: FRANKONIA schützt unter '
                                            'anderem Einrichtungen der Stadt Bamberg, der '
                                            'Sozialstiftung Bamberg und der Universität '
                                            'Bamberg.']},
                               6: {'name': 'Individuelles Sicherheitskonzept (neue '
                                           'Pflicht-Sektion)',
                                   'h2': 'Vor dem ersten Einsatz: Ihr kostenfreies '
                                         'Sicherheitskonzept',
                                   'link': 'So entsteht Ihr Sicherheitskonzept → '
                                           '/sicherheitskonzept/',
                                   'body': ['Bevor bei FRANKONIA eine Sicherheitskraft '
                                            'eingeplant wird, sehen sich unsere '
                                            'Sicherheitsexperten Ihr Objekt an: Zugänge, '
                                            'Schwachstellen, vorhandene Technik, Abläufe. Daraus '
                                            'entsteht ein schriftliches Sicherheitskonzept mit '
                                            'Personalbedarf, Einsatzzeiten und, wo sinnvoll, '
                                            'ergänzender Technik. Das Konzept ist kostenfrei und '
                                            'unverbindlich, und Kunden haben damit bis zu 30 % '
                                            'Kosten gespart.',
                                            'Begehung und Risiko-Bewertung vor Ort, kostenfrei',
                                            'Schriftliches Konzept: Personal, Zeiten, '
                                            'Technik-Empfehlung',
                                            'Kostenfrei und unverbindlich, mit klarer '
                                            'Empfehlung, was sich wirtschaftlich lohnt',
                                            'Laufende Aktualisierung, wenn sich Ihr Objekt '
                                            'verändert, ebenfalls kostenfrei']},
                               7: {'name': 'Konkrete Schritte',
                                   'h2': 'In 4 Schritten zum zuverlässigen Objektschutz',
                                   'cta': 'Jetzt unverbindliches Angebot einholen',
                                   'body': ['1 Kostenfreie Begehung: Unsere Experten sehen sich '
                                            'Ihr Objekt an, decken potenzielle '
                                            'Sicherheitsrisiken auf und geben Ihnen '
                                            'professionelle Empfehlungen. Sie zahlen dafür '
                                            'keinen Cent.',
                                            '2 Individuelles Sicherheitskonzept: Auf Basis der '
                                            'Begehung entwickeln wir ein Konzept, das genau zu '
                                            'Ihrem Objekt passt: Personal, Einsatzzeiten und, wo '
                                            'sinnvoll, ergänzende Sicherheitstechnik.',
                                            '3 Angebot in 1 Werktag: Sie erhalten Ihr '
                                            'unverbindliches Angebot innerhalb eines Werktages, '
                                            'mit transparenten Kosten und klar definiertem '
                                            'Leistungsumfang.',
                                            '4 Schneller, reibungsloser Start: Ihr festes, '
                                            'eingearbeitetes Team übernimmt zum vereinbarten '
                                            'Termin, auf Wunsch sehr kurzfristig. Sie gehen kein '
                                            'Risiko ein und konzentrieren sich wieder voll auf '
                                            'Ihr Kerngeschäft.']},
                               8: {'name': 'Kosten',
                                   'h2': 'Was kostet Objektschutz?',
                                   'hinweis': 'Der scheinbar günstigste Anbieter wird teuer, '
                                              'wenn Schichten unbesetzt bleiben oder im '
                                              'Schadensfall die Dokumentation fehlt. Vergleichen '
                                              'Sie deshalb Leistung, nicht nur den Stundensatz.',
                                   'preis_box': 'IHRE PREISSPANNE 26–32 €/Std. (je nach '
                                                'Qualifikation, Einsatzzeit und Umfang) · '
                                                'Unverbindliches Angebot innerhalb eines '
                                                'Werktages · Kostenfreie Begehung vorab · '
                                                'Transparente Kalkulation ohne versteckte Posten '
                                                '· CTA: Unverbindliches Angebot einholen',
                                   'body': ['Objektschutz kostet in der Regel zwischen 26 und 32 '
                                            'Euro pro Stunde. Wo Ihr Objekt in dieser Spanne '
                                            'liegt, hängt von wenigen, klar benennbaren Faktoren '
                                            'ab:',
                                            'Qualifikation der Sicherheitskräfte (Basisschutz '
                                            'oder speziell geschultes Personal)',
                                            'Einsatzzeiten: Nacht-, Wochenend- und '
                                            'Feiertagszuschläge nach Tarif',
                                            'Umfang und Dauer: dauerhafte Bewachung, '
                                            'Randzeiten-Schutz oder Kombination mit Revierdienst '
                                            '(Raum Bamberg)',
                                            'Größe und Beschaffenheit des Objekts (Gelände, '
                                            'Gebäude, Zugänge)',
                                            'Kombination mit Sicherheitstechnik, die '
                                            'Personalstunden einsparen kann']},
                               9: {'name': 'Trust / Ansprechpartner',
                                   'h2': 'Verantwortung auf Geschäftsführungsebene',
                                   'body': ['Alexander Jäger, Vertriebsleiter und '
                                            'Sicherheitsbeauftragter, begleitet Sie von der '
                                            'ersten Anfrage bis zum Angebot (+49 951 964352-70 · '
                                            'a.jaeger@frankonia-sicherheit.de). Ihre Begehung '
                                            'und Ihr Konzept erstellen erfahrene '
                                            'Sicherheitsexperten aus der echten Einsatzpraxis; '
                                            'im laufenden Einsatz ist Ihr Einsatzleiter rund um '
                                            'die Uhr erreichbar. Dahinter: zertifizierte '
                                            'Qualität (DIN 77200-1, ISO 9001, DEKRA-geprüft) und '
                                            'übertariflich bezahlte Teams.']},
                               10: {'name': 'FAQ',
                                    'h2': 'Objektschutz: die wichtigsten Antworten',
                                    'body': ['Was kostet Objektschutz pro Stunde? Objektschutz '
                                             'kostet in der Regel zwischen 26 und 32 Euro pro '
                                             'Stunde, je nach Qualifikation der '
                                             'Sicherheitskräfte, Einsatzzeit (Nacht-, Wochenend- '
                                             'und Feiertagszuschläge) und Umfang des Auftrags. '
                                             'Sie erhalten von FRANKONIA ein transparentes, '
                                             'unverbindliches Angebot innerhalb eines Werktages, '
                                             'inklusive kostenfreier Begehung.',
                                             'Was ist der Unterschied zwischen Objektschutz und '
                                             'Werkschutz? Objektschutz sichert Gebäude, Gelände '
                                             'und Einrichtungen aller Art, etwa Bürogebäude, '
                                             'Logistikhallen oder öffentliche Einrichtungen. '
                                             'Werkschutz ist die spezialisierte Form für '
                                             'Industrieanlagen und Betriebsstätten mit laufender '
                                             'Produktion, mit zusätzlichem Fokus auf '
                                             'Pfortendienste und Anlagen-Bedienung. FRANKONIA '
                                             'bietet beides, welche Form zu Ihnen passt, klärt '
                                             'die kostenfreie Begehung.',
                                             'Wie schnell kann FRANKONIA mit dem Objektschutz '
                                             'starten? Nach der kostenfreien Begehung erhalten '
                                             'Sie Ihr Angebot innerhalb eines Werktages. '
                                             'Kurzfristige Einsätze sind nach Absprache möglich, '
                                             'da wir mit eigener Einsatzleitung und festem '
                                             'Mitarbeiterstamm planen. Rufen Sie bei dringendem '
                                             'Bedarf direkt an: +49 951 964352-0.',
                                             'Sind die Sicherheitskräfte im Objektschutz '
                                             'qualifiziert? Ja. Alle FRANKONIA Sicherheitskräfte '
                                             'sind mindestens IHK-qualifiziert nach § 34a GewO '
                                             'und technik-geschult, damit sie Ihre Alarm- und '
                                             'Sicherheitsanlagen sachgemäß bedienen können. Das '
                                             'Unternehmen ist nach DIN 77200-1 für stationäre '
                                             'Sicherheitsdienstleistungen und nach ISO 9001 '
                                             'zertifiziert, geprüft durch die DEKRA.',
                                             'In welchen Regionen bietet FRANKONIA Objektschutz '
                                             'an? FRANKONIA ist von Bamberg aus im Umkreis von '
                                             'rund 100 Kilometern im Einsatz: in ganz '
                                             'Oberfranken sowie im Großraum Nürnberg, in '
                                             'Würzburg, Erlangen, Fürth, Bayreuth, Schweinfurt '
                                             'und Coburg. Kurzfristige Einsätze organisiert die '
                                             'rund um die Uhr erreichbare Einsatzleitung.']},
                               11: {'name': 'Abschluss-CTA + verwandte Seiten',
                                    'h2': 'Jetzt Objektschutz anfragen — Angebot innerhalb eines '
                                          'Werktages',
                                    'related': 'Werkschutz → /werkschutz/ · Revier- & '
                                               'Schließdienst → /revier-schliessdienst/ · '
                                               'Sicherheitstechnik → /sicherheitstechnik/',
                                    'body': ['Beschreiben Sie kurz Ihr Objekt, den Rest '
                                             'übernehmen wir: kostenfreie Begehung, '
                                             'individuelles Sicherheitskonzept und Ihr '
                                             'unverbindliches Angebot innerhalb eines Werktages.',
                                             'Objektschutz in Ihrer Stadt: Objektschutz Nürnberg '
                                             '→ /objektschutz-nuernberg/ · Sicherheitsdienst '
                                             'Nürnberg → /sicherheitsdienst-nuernberg/ · '
                                             'Würzburg → /sicherheitsdienst-wuerzburg/ · Bamberg '
                                             '→ /sicherheitsdienst-bamberg/']}}},
 'sicherheitstechnik': {'meta': {'URL': 'URL: /sicherheitstechnik/',
                                 'Title': 'Title (54 Zeichen): Sicherheitstechnik Franken | '
                                          'Alarm & Video – FRANKONIA',
                                 'Meta-Description': 'Meta-Description (155 Zeichen): '
                                                     'Sicherheitstechnik aus Bamberg: '
                                                     'Videoüberwachung, Alarmanlagen, '
                                                     'Zutrittskontrolle — Projektierung bis '
                                                     'Wartung. Kombiniert mit Personal, wo es '
                                                     'sinnvoll ist.',
                                 'Primär-Keyword': 'Primär-Keyword: sicherheitstechnik (3.600) · '
                                                   'Unterstützend: videoüberwachung firma (90), '
                                                   'alarmanlage, zutrittskontrolle, mechanische '
                                                   'sicherheitstechnik',
                                 'Schema': 'Schema: Service + FAQPage + BreadcrumbList',
                                 'Interne Links': 'Interne Links: /objektschutz/ · /werkschutz/ '
                                                  '· /interventionsdienst/ · '
                                                  '/sicherheitskonzept/ · '
                                                  '/sicherheitsdienst-nuernberg/, '
                                                  '/sicherheitsdienst-bamberg/ · '
                                                  'Autoritätslinks: DSGVO-Hinweise '
                                                  'Videoüberwachung (BfDI/Landesdatenschutz), '
                                                  'VdS'},
                        'sections': {1: {'name': 'Hero',
                                         'badge': 'Beratung, Projektierung und Wartung aus '
                                                  'Franken',
                                         'h1': 'Sicherheitstechnik: Alarm, Video & Zutritt aus '
                                               'einer Hand',
                                         'subline': 'Technik, die Personalstunden spart: Video, '
                                                    'Alarm und Zutritt, geplant, installiert, '
                                                    'gewartet.',
                                         'body': ['Herstellerunabhängige Beratung auf Basis '
                                                  'Ihres Objekts',
                                                  'Ein Ansprechpartner für Technik und Personal, '
                                                  'keine Zuständigkeitslücken',
                                                  'Wartung und Alarmverfolgung auf Wunsch '
                                                  'inklusive']},
                                     2: {'name': 'Problem-Sektion (statt klassischem '
                                                 'Risiko-Block)',
                                         'h2': 'Warum Sicherheitstechnik allein oft nicht '
                                               'schützt',
                                         'abbinder': 'Der FRANKONIA Ansatz: Technik ist Teil '
                                                     'eines Sicherheitskonzepts, geplant nach '
                                                     'Risiko, betrieben mit klarer '
                                                     'Reaktionskette, gewartet nach Plan.',
                                         'body': ['Eine Kamera, die niemand auswertet, ist eine '
                                                  'Dokumentationsmaschine für Einbrüche, kein '
                                                  'Schutz davor. Die häufigsten Probleme, die '
                                                  'uns bei Begehungen begegnen:',
                                                  'Insellösungen: Alarmanlage vom einen '
                                                  'Anbieter, Kameras vom anderen, Schließanlage '
                                                  'vom dritten, nichts spricht miteinander, '
                                                  'niemand fühlt sich zuständig.',
                                                  'Alarme ohne Reaktion: Ein Alarm um 3 Uhr '
                                                  'nachts bringt nichts, wenn niemand hinfährt. '
                                                  'Ohne Alarmverfolgung oder Interventionsdienst '
                                                  'bleibt Technik ein Signal ohne Konsequenz.',
                                                  'Technik ohne Wartung: Verstaubte Melder, '
                                                  'verstellte Kameras, abgelaufene Akkus, im '
                                                  'Ernstfall versagt genau das Bauteil, das seit '
                                                  'Jahren niemand geprüft hat.']},
                                     3: {'name': 'Leistungsbereiche',
                                         'h2': 'Diese Sicherheitstechnik planen und betreiben '
                                               'wir für Sie',
                                         'body': ['Videoüberwachung: Kamerasysteme für Gelände, '
                                                  'Gebäude und Zufahrten, datenschutzkonform '
                                                  'geplant (DSGVO), mit klarer Regelung, wer '
                                                  'wann auf Aufnahmen zugreift. Auf Wunsch mit '
                                                  'Aufschaltung und Alarmverfolgung.',
                                                  'Einbruchmeldeanlagen: Alarmanlagen für '
                                                  'Gewerbeobjekte, von der Risikoanalyse über '
                                                  'die Projektierung bis zur Wartung, inklusive '
                                                  'definierter Meldekette: Wer wird alarmiert, '
                                                  'wer fährt hin, wer entscheidet.',
                                                  'Brandmeldetechnik: Brandmeldeanlagen und '
                                                  'Rauchmelder in Kombination mit '
                                                  'organisatorischem Brandschutz, und '
                                                  'Brandwachen als Übergangslösung, wenn Ihre '
                                                  'BMA ausfällt. → /brandwache/',
                                                  'Zutrittskontrolle: Elektronische '
                                                  'Schließsysteme, Transponder und Vereinzelung, '
                                                  'damit „Wer darf wo rein?" eine dokumentierte '
                                                  'Antwort hat.',
                                                  'Mechanische Sicherheitstechnik & Absperrung: '
                                                  'Poller, Schranken, Zaun- und Torsysteme, die '
                                                  'physische Grundlage, ohne die elektronische '
                                                  'Sicherheit ins Leere läuft.']},
                                     4: {'name': 'Personal + Technik (Kern-Differenzierung)',
                                         'h2': 'Der eigentliche Hebel: Technik und Personal im '
                                               'selben Konzept',
                                         'abbinder': 'Bestandskunden haben durch solche '
                                                     'Konzept-Optimierungen bis zu 20 % Kosten '
                                                     'gespart, bei gleichbleibender Sicherheit.',
                                         'body': ['Sicherheitstechnik wird bei FRANKONIA nie '
                                                  'isoliert verkauft. Unsere Experten rechnen '
                                                  'für Ihr Objekt durch, welche Kombination aus '
                                                  'Personal und Technik die geforderte '
                                                  'Sicherheit zum niedrigsten Gesamtpreis '
                                                  'liefert. Drei typische Beispiele:',
                                                  'Statt 2 Nachtposten: 1 Nachtposten + '
                                                  'Videoüberwachung der Nebenzufahrten, gleiche '
                                                  'Abdeckung, deutlich niedrigere Monatskosten.',
                                                  'Statt Dauerbewachung: Einbruchmeldeanlage + '
                                                  'Interventionsdienst mit Alarmverfolgung — '
                                                  'Schutz rund um die Uhr, bezahlt wird die '
                                                  'Reaktion statt der Anwesenheit. → '
                                                  '/interventionsdienst/',
                                                  'Statt Schlüsselchaos: Elektronische '
                                                  'Zutrittskontrolle + Verschlusskonzept (im '
                                                  'Raum Bamberg mit Revierdienst), dokumentierte '
                                                  'Sicherheit ohne festen Posten. → '
                                                  '/revier-schliessdienst/']},
                                     5: {'name': 'Konkrete Schritte',
                                         'h2': 'In 4 Schritten zur passenden Sicherheitstechnik',
                                         'cta': 'Unverbindliches Angebot einholen',
                                         'body': ['1 Kostenfreie Begehung: Wir analysieren '
                                                  'Objekt, Risiken und vorhandene Technik, '
                                                  'herstellerunabhängig.',
                                                  '2 Konzept & Auslegung: Sie erhalten ein '
                                                  'Sicherheitskonzept mit konkreter '
                                                  'Technik-Empfehlung, Personal-Kombination und '
                                                  'Kostenrahmen.',
                                                  '3 Installation durch Fachpartner: Montage und '
                                                  'Inbetriebnahme koordinieren wir mit geprüften '
                                                  'Fachbetrieben — Sie haben weiterhin einen '
                                                  'Ansprechpartner: uns.',
                                                  '4 Betrieb, Wartung, Reaktion: Wartungsplan, '
                                                  'Funktionstests und auf Wunsch Alarmverfolgung '
                                                  'durch FRANKONIA Kräfte.']},
                                     6: {'name': 'Kosten',
                                         'h2': 'Was kostet Sicherheitstechnik?',
                                         'hinweis': 'Rechnen Sie Technik immer gegen '
                                                    'Personalkosten: Eine Investition, die einen '
                                                    'Nachtposten ersetzt oder reduziert, '
                                                    'amortisiert sich oft im ersten Jahr. Genau '
                                                    'diese Rechnung machen wir in Ihrem Konzept '
                                                    'transparent auf.',
                                         'cta_box': 'Kostenfreie Begehung + Konzept mit '
                                                    'Kostenrahmen · Angebot innerhalb eines '
                                                    'Werktages · CTA: Unverbindliches Angebot '
                                                    'einholen',
                                         'body': ['Sicherheitstechnik wird projektbasiert '
                                                  'kalkuliert, nach Objektgröße, Schutzziel und '
                                                  'Systemumfang; seriöse Zahlen gibt es erst '
                                                  'nach einer Begehung. Zur Orientierung: Eine '
                                                  'Grundabsicherung für ein kleines '
                                                  'Gewerbeobjekt beginnt im niedrigen '
                                                  'vierstelligen Bereich, komplexe Anlagen für '
                                                  'Industriestandorte werden individuell '
                                                  'projektiert.',
                                                  'Objektgröße und Anzahl der Zugänge/Zufahrten',
                                                  'Schutzziel: Abschreckung, Detektion oder '
                                                  'dokumentierte Beweissicherung',
                                                  'Systemumfang: Einzelgewerk oder integriertes '
                                                  'System (Video + Alarm + Zutritt)',
                                                  'Betrieb: Eigenüberwachung, Aufschaltung oder '
                                                  'Alarmverfolgung durch FRANKONIA',
                                                  'Wartungsumfang und Reaktionszeiten']},
                                     7: {'name': 'Trust / Ansprechpartner',
                                         'h2': 'Technik-Empfehlungen aus der echten Praxis, '
                                               'nicht aus dem Katalog',
                                         'body': ['FRANKONIA verdient am funktionierenden '
                                                  'Gesamtkonzept, nicht an der einzelnen Kamera. '
                                                  'Deshalb beraten wir herstellerunabhängig und '
                                                  'empfehlen nur Technik, die im Konzept einen '
                                                  'messbaren Beitrag leistet. Ihr '
                                                  'Ansprechpartner für Ihre Anfrage: Alexander '
                                                  'Jäger, Vertriebsleiter und '
                                                  'Sicherheitsbeauftragter — DIN 77200-1, ISO '
                                                  '9001, DEKRA-geprüft.']},
                                     8: {'name': 'FAQ',
                                         'h2': 'Sicherheitstechnik: die wichtigsten Antworten',
                                         'body': ['Was kostet eine Videoüberwachung für ein '
                                                  'Gewerbeobjekt? Das hängt von Kameraanzahl, '
                                                  'Speicherlösung und Auswertung ab, eine solide '
                                                  'Grundausstattung für ein kleines '
                                                  'Gewerbeobjekt beginnt im niedrigen '
                                                  'vierstelligen Bereich. Belastbare Zahlen '
                                                  'erhalten Sie nach einer kostenfreien '
                                                  'Begehung, inklusive Konzept mit Kostenrahmen '
                                                  'innerhalb eines Werktages.',
                                                  'Ist Videoüberwachung auf dem Firmengelände '
                                                  'überhaupt erlaubt? Ja, unter Auflagen: '
                                                  'berechtigtes Interesse, Kennzeichnung, '
                                                  'definierte Speicherfristen und klare '
                                                  'Zugriffsregelungen nach DSGVO. FRANKONIA '
                                                  'plant Kamerasysteme von Anfang an '
                                                  'datenschutzkonform, inklusive der nötigen '
                                                  'Dokumentation für Ihren '
                                                  'Datenschutzbeauftragten.',
                                                  'Wer reagiert, wenn die Alarmanlage auslöst? '
                                                  'Das legt Ihre Meldekette fest: Aufschaltung '
                                                  'auf eine Notruf- und Serviceleitstelle, '
                                                  'Alarmverfolgung durch FRANKONIA '
                                                  'Interventionskräfte oder Benachrichtigung '
                                                  'Ihrer eigenen Ansprechpartner. Wir empfehlen '
                                                  'die Variante, bei der ein Alarm immer eine '
                                                  'dokumentierte Reaktion auslöst.',
                                                  'Kann Technik unser Sicherheitspersonal '
                                                  'ersetzen? Teilweise, und genau das rechnen '
                                                  'wir durch. Videoüberwachung und Alarmtechnik '
                                                  'können Posten reduzieren oder '
                                                  'Revierdienst-Modelle ermöglichen; vollständig '
                                                  'ersetzen lässt sich qualifiziertes Personal '
                                                  'je nach Schutzziel aber nicht. Das '
                                                  'wirtschaftlichste Verhältnis ermittelt die '
                                                  'kostenfreie Begehung.',
                                                  'Übernimmt FRANKONIA auch Wartung bestehender '
                                                  'Anlagen? Ja, nach technischer Prüfung '
                                                  'übernehmen wir bestehende Systeme in einen '
                                                  'Wartungs- und Betriebsplan, auch wenn sie '
                                                  'ursprünglich von einem anderen Anbieter '
                                                  'installiert wurden.']},
                                     9: {'name': 'Abschluss-CTA + verwandte Seiten',
                                         'h2': 'Jetzt Sicherheitstechnik anfragen',
                                         'related': 'Objektschutz → /objektschutz/ · Werkschutz '
                                                    '→ /werkschutz/ · Interventionsdienst → '
                                                    '/interventionsdienst/',
                                         'body': ['Beschreiben Sie kurz Ihr Objekt und Ihr '
                                                  'Anliegen, unsere Experten melden sich '
                                                  'innerhalb eines Werktages mit Terminvorschlag '
                                                  'für die kostenfreie Begehung. Formulartitel: '
                                                  'Ihre Technik-Anfrage',
                                                  'In Ihrer Region: Sicherheitsdienst Nürnberg → '
                                                  '/sicherheitsdienst-nuernberg/ · Bamberg → '
                                                  '/sicherheitsdienst-bamberg/ · Würzburg → '
                                                  '/sicherheitsdienst-wuerzburg/']}}},
 'brandwache': {'meta': {'URL': 'URL: /brandwache/',
                         'Title': 'Title (59 Zeichen): Brandwache Franken | '
                                  'Brandsicherheitswache 24/7 – FRANKONIA',
                         'Meta-Description': 'Meta-Description (150 Zeichen): Brandwache & '
                                             'Brandsicherheitswache in Franken: kurzfristig '
                                             'gestellt bei BMA-Ausfall, Heißarbeiten & Events. '
                                             'IHK-qualifizierte Kräfte, 24/7 erreichbar.',
                         'Primär-Keyword': 'Primär-Keyword: brandwache (880, CPC 11,40 €) · '
                                           'Unterstützend: brandsicherheitswache (390), '
                                           'brandwache kosten (20), brandposten, brandwache '
                                           'feuerwehr',
                         'Schema': 'Schema: Service + FAQPage + BreadcrumbList',
                         'Interne Links': 'Interne Links: /objektschutz/ · '
                                          '/veranstaltungsschutz/ · /baustellenbewachung/ · '
                                          '/brandwache-nuernberg/ (Kombiseite) · '
                                          '/ratgeber/brandwache-wann-vorgeschrieben/ · '
                                          'Stadtseiten · Autoritätslinks: '
                                          'Muster-Versammlungsstättenverordnung, '
                                          'DGUV/Heißarbeiten-Regeln'},
                'sections': {1: {'name': 'Hero (Notfall-Variante)',
                                 'badge': 'Kurzfristig verfügbar — 24/7 erreichbar, auch am '
                                          'Wochenende',
                                 'h1': 'Brandwache & Brandsicherheitswache in Franken',
                                 'subline': 'BMA-Ausfall, Heißarbeiten, Behörden-Auflage? '
                                            'FRANKONIA stellt qualifizierte Brandwachen, '
                                            'schnell, dokumentiert, zuverlässig besetzt.',
                                 'body': ['Kurzfristig verfügbar nach Absprache, auch nachts und '
                                          'am Wochenende',
                                          'Geschulte Kräfte: Brandschutzhelfer-Qualifikation, § '
                                          '34a GewO',
                                          'Lückenlose Dokumentation für Behörde und '
                                          'Versicherung']},
                             2: {'name': 'Wann ist eine Brandwache Pflicht? (GEO-Kernsektion)',
                                 'h2': 'Wann ist eine Brandwache vorgeschrieben?',
                                 'link': 'Ausführlich im Ratgeber: Wann ist eine Brandwache '
                                         'vorgeschrieben? → '
                                         '/ratgeber/brandwache-wann-vorgeschrieben/',
                                 'body': ['Eine Brandwache ist typischerweise Pflicht, wenn eine '
                                          'Brandmeldeanlage ausfällt, wenn feuergefährliche '
                                          'Arbeiten durchgeführt werden oder wenn Behörden sie '
                                          'für Veranstaltungen auflegen. Die Anforderung ergibt '
                                          'sich je nach Fall aus Baurecht, '
                                          'Versammlungsstättenverordnung, den Auflagen der '
                                          'Feuerwehr oder den Bedingungen Ihres Versicherers.',
                                          'Ausfall der Brandmeldeanlage (BMA): Bei Störung, '
                                          'Wartung oder Umbau der BMA verlangen Bauordnungsamt, '
                                          'Feuerwehr oder Versicherer eine Ersatzmaßnahme, meist '
                                          'eine Brandwache, bis die Anlage wieder betriebsbereit '
                                          'ist.',
                                          'Heißarbeiten: Schweißen, Trennen, Löten, Dacharbeiten '
                                          'mit offener Flamme: Nach den Regeln der Versicherer '
                                          'und DGUV ist während und nach den Arbeiten eine '
                                          'Brandwache zu stellen (Nachkontrolle wegen '
                                          'Schwelbränden).',
                                          'Veranstaltungen: Für Versammlungsstätten, Bühnen und '
                                          'pyrotechnische Effekte kann die Behörde eine '
                                          'Brandsicherheitswache auflegen, teils durch die '
                                          'Feuerwehr, teils durch qualifizierte private Kräfte. '
                                          '→ /veranstaltungsschutz/',
                                          'Erhöhte Brandlast im Betrieb: Nach Bränden, bei '
                                          'Umbauten oder in Sonderlagen (z. B. abgeschaltete '
                                          'Sprinkler), als Auflage oder freiwillige Absicherung '
                                          'gegenüber dem Versicherer.']},
                             3: {'name': 'Leistungsumfang',
                                 'h2': 'Das leistet die FRANKONIA Brandwache',
                                 'hinweis_box': 'Ausrüstung nach Lage: Feuerlöscher, '
                                                'Warnkleidung, Kommunikationsmittel und, wo '
                                                'gefordert, zusätzliche Qualifikationen '
                                                '(Brandschutzhelfer nach DGUV, Ersthelfer), '
                                                'abgestimmt auf Ihre Auflage.',
                                 'body': ['Kontrollgänge nach Einsatzplan: Festgelegte '
                                          'Intervalle und Routen, angepasst an Brandlast und '
                                          'Objektlage, dokumentiert je Runde.',
                                          'Überwachung von Heißarbeiten: Absicherung während der '
                                          'Arbeiten plus vorgeschriebene Nachkontrolle, wenn '
                                          'Schwelbrände am wahrscheinlichsten sind.',
                                          'Erstmaßnahmen im Brandfall: Alarmierung nach '
                                          'Meldekette, Entstehungsbrand-Bekämpfung mit '
                                          'geeigneten Löschmitteln, Einweisung der Feuerwehr, '
                                          'Räumungsunterstützung.',
                                          'Ersatzmaßnahme bei BMA-Ausfall: Besetzung nach '
                                          'behördlicher Auflage, inklusive Abstimmung mit '
                                          'Feuerwehr und Bauordnungsamt.',
                                          'Lückenlose Dokumentation: Wachbuch mit '
                                          'Rundenprotokoll, Vorkommnissen und Übergaben, als '
                                          'Nachweis für Behörde und Versicherung.']},
                             4: {'name': 'Warum FRANKONIA (Pain-Aufhänger, kompakt)',
                                 'h2': 'Bei einer Pflicht-Brandwache zählt nur eines: jede '
                                       'Schicht zuverlässig besetzt',
                                 'body': ['Eine unbesetzte Brandwach-Schicht ist nicht nur ein '
                                          'Sicherheitsrisiko, sondern ein Verstoß gegen Ihre '
                                          'Auflage, mit Konsequenzen bis zum Nutzungsverbot. '
                                          'Deshalb:',
                                          'Zuverlässig besetzt: Fester Mitarbeiterstamm, eigene '
                                          'Einsatzleitung, dokumentierte Übergaben, jede Schicht '
                                          'nachweisbar besetzt.',
                                          'Qualifiziert nach Auflage: Kräfte mit § 34a GewO und '
                                          'Brandschutzhelfer-Qualifikation; auf Wunsch stimmen '
                                          'wir die Qualifikation direkt mit Ihrer Behörde ab.',
                                          'Erreichbar, wenn es brennt, auch organisatorisch: Ihr '
                                          'Ansprechpartner ist 24/7 direkt erreichbar, '
                                          'Verstärkung und Verlängerung sind ein Anruf.']},
                             5: {'name': 'Typische Einsätze',
                                 'h2': 'Typische Brandwache-Einsätze in Franken',
                                 'body': ['Industriebetrieb, BMA-Störung: Freitagnachmittag '
                                          'fällt die Brandmeldeanlage aus, die Versicherung '
                                          'fordert eine Wache übers Wochenende. FRANKONIA '
                                          'besetzt ab dem Abend, bis der Errichter die Anlage '
                                          'instand gesetzt hat.',
                                          'Baustelle, Dacharbeiten: Schweißarbeiten an der '
                                          'Dachabdichtung — Brandwache während der Arbeiten plus '
                                          'zweistündige Nachkontrolle laut Auflage des '
                                          'Versicherers. → /baustellenbewachung/',
                                          'Veranstaltung mit Auflage: Stadtfest, Bühne, '
                                          'Pyrotechnik — Brandsicherheitswache nach behördlicher '
                                          'Vorgabe, koordiniert mit Feuerwehr und Veranstalter.',
                                          'Kliniken & Einrichtungen: Umbau im laufenden Betrieb, '
                                          'Sprinkler bereichsweise außer Betrieb — Brandwache '
                                          'als Ersatzmaßnahme, abgestimmt auf den '
                                          'Räumungsplan.']},
                             6: {'name': 'Kosten',
                                 'h2': 'Was kostet eine Brandwache?',
                                 'hinweis': 'Rechnen Sie die Brandwache gegen das Risiko: Ein '
                                            'Nutzungsverbot, ein Deckungsproblem mit dem '
                                            'Versicherer oder ein Schwelbrand nach Heißarbeiten '
                                            'kostet ein Vielfaches der Wache.',
                                 'preis_box': 'IHRE PREISSPANNE 26–32 €/Std. (netto, je nach '
                                              'Qualifikation, Einsatzzeit und Vorlauf) · '
                                              'Kurzfristig verfügbar nach Absprache · '
                                              'Dokumentation für Behörde & Versicherung '
                                              'inklusive · CTA: Jetzt anrufen: +49 951 964352-0',
                                 'body': ['Eine Brandwache kostet in der Regel zwischen 26 und '
                                          '32 Euro pro Stunde, abhängig von Qualifikation, '
                                          'Einsatzzeit und Vorlaufzeit. Nacht-, Wochenend- und '
                                          'Feiertagseinsätze liegen durch tarifliche Zuschläge '
                                          'am oberen Ende.',
                                          'Geforderte Qualifikation (Brandschutzhelfer, ggf. '
                                          'zusätzliche Auflagen der Behörde)',
                                          'Einsatzzeit: Nacht-, Wochenend- und '
                                          'Feiertagszuschläge nach Tarif',
                                          'Vorlaufzeit: geplante Wache oder Notfall-Einsatz',
                                          'Dauer und Schichtmodell (eine Nacht, ein Wochenende, '
                                          'mehrere Wochen)',
                                          'Objektlage und Objektgröße']},
                             7: {'name': 'Konkrete Schritte (Notfall-Variante)',
                                 'h2': 'So schnell steht Ihre Brandwache',
                                 'body': ['1 Anrufen oder anfragen: Schildern Sie Lage, Auflage '
                                          'und Zeitraum, telefonisch geht es am schnellsten: +49 '
                                          '951 964352-0.',
                                          '2 Abstimmung & Angebot: Wir klären Qualifikation und '
                                          'Einsatzplan (bei Bedarf direkt mit Ihrer Behörde oder '
                                          'Ihrem Versicherer), Ihr Angebot erhalten Sie '
                                          'kurzfristig, bei geplanten Wachen innerhalb eines '
                                          'Werktages.',
                                          '3 Wache steht: Ihre Brandwache beginnt zum '
                                          'vereinbarten Zeitpunkt, mit Wachbuch, Meldekette und '
                                          'direkt erreichbarem Einsatzleiter.']},
                             8: {'name': 'Trust',
                                 'h2': 'Zertifizierte Sicherheit auch im Ausnahmezustand',
                                 'body': ['FRANKONIA ist nach DIN 77200-1 und ISO 9001 '
                                          'zertifiziert (DEKRA-geprüft) und stellt seit über '
                                          'zehn Jahren Wachen für Betriebe, Baustellen, '
                                          'Veranstaltungen und öffentliche Einrichtungen in ganz '
                                          'Franken, unter anderem für die Sozialstiftung Bamberg '
                                          'und bei der Bamberger Sandkerwa. Ihr Ansprechpartner '
                                          'für Ihre Anfrage: Alexander Jäger, Vertriebsleiter '
                                          'und Sicherheitsbeauftragter; im Einsatz ist die '
                                          'Einsatzleitung rund um die Uhr erreichbar.']},
                             9: {'name': 'FAQ',
                                 'h2': 'Brandwache: die häufigsten Fragen',
                                 'body': ['Was kostet eine Brandwache pro Stunde? In der Regel '
                                          'zwischen 26 und 32 Euro pro Stunde, je nach '
                                          'Qualifikation, Einsatzzeit (Zuschläge für Nacht, '
                                          'Wochenende, Feiertag) und Vorlaufzeit. Für geplante '
                                          'Wachen erhalten Sie ein Angebot innerhalb eines '
                                          'Werktages, bei Notfällen nennen wir Ihnen die '
                                          'Konditionen direkt am Telefon.',
                                          'Wie schnell kann FRANKONIA eine Brandwache stellen? '
                                          'Nach Absprache auch sehr kurzfristig, etwa bei '
                                          'BMA-Ausfall am Wochenende. Rufen Sie direkt an (+49 '
                                          '951 964352-0): Die Einsatzleitung ist rund um die Uhr '
                                          'erreichbar und plant die Besetzung aus dem festen '
                                          'Mitarbeiterstamm.',
                                          'Welche Qualifikation hat eine Brandwache von '
                                          'FRANKONIA? Mindestens IHK-Qualifikation nach § 34a '
                                          'GewO plus Brandschutzhelfer-Ausbildung nach '
                                          'DGUV-Grundsätzen. Fordert Ihre Behörde oder Ihr '
                                          'Versicherer zusätzliche Qualifikationen, stimmen wir '
                                          'die Besetzung vor Einsatzbeginn ab.',
                                          'Ersetzt die Brandwache meine Brandmeldeanlage? Nein, '
                                          'sie ist die anerkannte Ersatzmaßnahme, solange die '
                                          'Anlage gestört, gewartet oder umgebaut wird. Die '
                                          'Details (Rundenintervalle, besetzte Bereiche) legen '
                                          'Behörde oder Versicherer fest; wir setzen die Auflage '
                                          'um und dokumentieren jede Runde.',
                                          'Stellt FRANKONIA Brandwachen auch außerhalb Bambergs? '
                                          'Ja, im Umkreis von rund 100 Kilometern: in Nürnberg '
                                          '(→ /brandwache-nuernberg/), Würzburg (→ '
                                          '/brandwache-wuerzburg/), Erlangen (→ '
                                          '/brandwache-erlangen/), Fürth (→ /brandwache-fuerth/) '
                                          'sowie Bayreuth, Schweinfurt und Coburg.',
                                          'Wer schreibt vor, dass ich eine Brandwache brauche? '
                                          'Je nach Fall: das Bauordnungsamt oder die Feuerwehr '
                                          '(BMA-Ausfall, Veranstaltungen nach '
                                          'Versammlungsstättenverordnung), Ihr Versicherer '
                                          '(Heißarbeiten, Sonderlagen) oder die '
                                          'Baustellenordnung des Auftraggebers. Wir helfen bei '
                                          'der Einordnung, und stimmen den Einsatzplan direkt '
                                          'mit der fordernden Stelle ab.']},
                             10: {'name': 'Abschluss-CTA',
                                  'h2': 'Brandwache benötigt? Rufen Sie an, wir planen sofort',
                                  'related': 'Objektschutz → /objektschutz/ · '
                                             'Veranstaltungsschutz → /veranstaltungsschutz/ · '
                                             'Baustellenbewachung → /baustellenbewachung/',
                                  'body': ['Bei akutem Bedarf: +49 951 964352-0, rund um die '
                                           'Uhr. Für geplante Wachen: Formular ausfüllen, '
                                           'Angebot innerhalb eines Werktages. Formulartitel: '
                                           'Ihre Brandwache-Anfrage (Zeitraum, Objekt, Auflage)',
                                           'Brandwache in Ihrer Stadt: Nürnberg → '
                                           '/brandwache-nuernberg/ · Würzburg → '
                                           '/brandwache-wuerzburg/ · Erlangen → '
                                           '/brandwache-erlangen/ · Fürth → '
                                           '/brandwache-fuerth/']}}},
 'kaufhausdetektei': {'meta': {'URL': 'URL: /kaufhausdetektei/',
                               'Title': 'Title (52 Zeichen): Ladendetektiv & Kaufhausdetektei '
                                        'Franken – FRANKONIA',
                               'Meta-Description': 'Meta-Description (153 Zeichen): '
                                                   'Ladendetektive gegen Ladendiebstahl: zivil, '
                                                   'geschult, gerichtsfest dokumentiert. Für '
                                                   'Einzelhandel in Franken, flexibel zu '
                                                   'wichtigen, variierenden Zeiten.',
                               'Primär-Keyword': 'Primär-Keyword: ladendetektiv (1.000) · '
                                                 'Unterstützend: kaufhausdetektiv (390), '
                                                 'kaufhausdetektei (390), warenhausdetektiv, '
                                                 'ladendetektei',
                               'Schema': 'Schema: Service + FAQPage + BreadcrumbList',
                               'Interne Links': 'Interne Links: /objektschutz/ · '
                                                '/empfangsdienst/ · /sicherheitstechnik/ '
                                                '(Videoüberwachung) · '
                                                '/sicherheitsdienst-nuernberg/, '
                                                '/sicherheitsdienst-wuerzburg/, '
                                                '/sicherheitsdienst-bamberg/ · Autoritätslinks: '
                                                '§ 127 StPO (Jedermann-Festnahme), EHI-Studie '
                                                'Inventurdifferenzen'},
                      'sections': {1: {'name': 'Hero',
                                       'badge': 'Geschulte Detektive nach § 34a GewO, zivil im '
                                                'Einsatz',
                                       'h1': 'Ladendetektiv & Kaufhausdetektei für den '
                                             'Einzelhandel',
                                       'subline': 'Weniger Ladendiebstahl durch geschulte, '
                                                  'zivile Detektive, gerichtsfest dokumentiert, '
                                                  'flexibel zu Ihren kritischen Zeiten.',
                                       'body': ['Zivile Detektive, die im Kundenstrom nicht '
                                                'auffallen',
                                                'Gerichtsfeste Dokumentation jeder Ansprache und '
                                                'Festnahme',
                                                'Flexible Einsatzzeiten: Stoßzeiten, '
                                                'Aktionstage, Weihnachtsgeschäft']},
                                   2: {'name': 'Zahlen-Einstieg (Variation statt Risiko-Karten)',
                                       'h2': 'Ladendiebstahl ist kein Kavaliersdelikt, er ist '
                                             'eine Bilanzposition',
                                       'abbinder': 'Ein sichtbarer Effekt professioneller '
                                                   'Ladendetektive: Die Inventurdifferenz sinkt '
                                                   'messbar, nicht nur durch Festnahmen, sondern '
                                                   'durch Abschreckung, die sich in der Szene '
                                                   'herumspricht.',
                                       'body': ['Inventurdifferenzen kosten den Einzelhandel '
                                                'jährlich Milliarden, der größte Teil durch '
                                                'Diebstahl. Die Jahresverluste eines Markts '
                                                'übersteigen schnell die Kosten regelmäßiger '
                                                'Detektiv-Einsätze.',
                                                '~4 Mrd. € jährlicher Schaden durch '
                                                'Ladendiebstahl im deutschen Einzelhandel (EHI) '
                                                '— [FREIGABE: aktuelle EHI-Zahl vor Livegang '
                                                'prüfen]',
                                                'Ein Bruchteil der Diebstähle wird ohne '
                                                'geschultes Personal überhaupt bemerkt',
                                                'Organisierte Banden verursachen einen '
                                                'wachsenden Anteil, und meiden Märkte mit '
                                                'aktiver Detektei']},
                                   3: {'name': 'Leistungsumfang',
                                       'h2': 'Das leistet die FRANKONIA Kaufhausdetektei',
                                       'body': ['Zivile Beobachtung auf der Fläche: Detektive '
                                                'bewegen sich als Kunden getarnt durch Ihren '
                                                'Markt, mit geschultem Blick für Täterverhalten '
                                                'statt Verdächtigungen nach Bauchgefühl.',
                                                'Ansprache & Festnahme: Rechtssicheres Vorgehen '
                                                'nach § 127 StPO (vorläufige Festnahme), '
                                                'deeskalierend und diskret, ohne Ihre Kunden zu '
                                                'stören.',
                                                'Gerichtsfeste Dokumentation: Jeder Vorfall wird '
                                                'beweissicher protokolliert, für Anzeige, '
                                                'Hausverbot und zivilrechtliche Forderungen '
                                                '(Fangprämie).',
                                                'Zusammenarbeit mit der Polizei: Übergabe, '
                                                'Anzeigenaufnahme und Erfahrungsaustausch mit '
                                                'den örtlichen Dienststellen gehören zum '
                                                'Standard.',
                                                'Uniformierte Doorman-Präsenz: Wo Abschreckung '
                                                'wichtiger ist als Überführung, sichtbare Kräfte '
                                                'am Eingang, kombinierbar mit zivilen '
                                                'Detektiven.',
                                                'Beratung zur Warensicherung: Hinweise zu '
                                                'Hotspots, Warenplatzierung und Technik '
                                                '(Kameras, Artikelsicherung) aus der '
                                                'Einsatzpraxis. → /sicherheitstechnik/']},
                                   4: {'name': 'So läuft ein Einsatz (Variation: '
                                               'Ablauf-Erzählung)',
                                       'h2': 'So arbeitet ein Ladendetektiv von FRANKONIA',
                                       'body': ['1 Analyse Ihres Markts: Welche Warengruppen '
                                                'schwinden? Wann sind die kritischen Zeiten? Wir '
                                                'werten Ihre Inventurdaten aus und legen '
                                                'Einsatzzeiten fest, variierend, damit kein '
                                                'Muster erkennbar ist.',
                                                '2 Ziviler Einsatz: Der Detektiv arbeitet '
                                                'unauffällig im Kundenstrom, beobachtet gezielt '
                                                'und dokumentiert Täterverhalten, vom Betreten '
                                                'bis zum Passieren der Kasse.',
                                                '3 Ansprache nach der Kasse: Rechtssicher, '
                                                'ruhig, abseits der Kunden. Personalien, '
                                                'Beweissicherung, Entscheidung über Anzeige und '
                                                'Hausverbot, nach Ihren Vorgaben.',
                                                '4 Übergabe & Auswertung: Polizei-Übergabe bei '
                                                'Bedarf, gerichtsfestes Protokoll für Sie, '
                                                'regelmäßige Auswertung: Vorfälle, Schwerpunkte, '
                                                'Empfehlungen.']},
                                   5: {'name': 'Warum FRANKONIA (Pain-Aufhänger)',
                                       'h2': 'Ladendiebe stoppen, ohne dass Sie ins Risiko gehen',
                                       'body': ['Eine falsche Verdächtigung oder eine '
                                                'unprofessionelle Ansprache landet nicht beim '
                                                'Sicherheitsdienst, sondern bei Ihnen: als '
                                                'Beschwerde, Google-Bewertung oder '
                                                'Schadensersatzforderung. Deshalb setzt '
                                                'FRANKONIA auf:',
                                                'Erfahrene, geschulte Detektive: Rechtssichere '
                                                'Ansprache, Deeskalation und Beweissicherung '
                                                'werden regelmäßig trainiert — Aufgaben werden '
                                                'zuverlässig und nachweisbar erledigt.',
                                                'Klare Einsatzregeln: Ansprache nur bei '
                                                'lückenloser Beobachtung. Das schützt Ihre '
                                                'Kunden, und Sie vor berechtigten Beschwerden.',
                                                'Direkter Feedback-Kanal: Rückmeldungen aus '
                                                'Ihrem Team oder von Kunden landen direkt bei '
                                                'unserem Einsatzleiter und werden nachverfolgt, '
                                                'bis sie geklärt sind.']},
                                   6: {'name': 'Kosten',
                                       'h2': 'Was kostet ein Ladendetektiv?',
                                       'hinweis': 'Rechnen Sie gegen Ihre Inventurdifferenz: '
                                                  'Schon eine moderate Senkung finanziert den '
                                                  'Detektiv-Einsatz, dazu kommen Fangprämien und '
                                                  'der Abschreckungseffekt.',
                                       'preis_box': 'IHRE PREISSPANNE 26–32 €/Std. (netto, je '
                                                    'nach Einsatzmodell) · Einsatzplan auf Basis '
                                                    'Ihrer Inventurdaten · Angebot in 1 Werktag '
                                                    '· CTA: Unverbindliches Angebot einholen',
                                       'body': ['Ein Ladendetektiv kostet in der Regel zwischen '
                                                '26 und 32 Euro pro Stunde, entscheidend ist '
                                                'aber die Einsatzstrategie: Gezielte Einsätze zu '
                                                'kritischen Zeiten bringen mehr als teure '
                                                'Dauerpräsenz. Die Lage in der Spanne bestimmen:',
                                                'Erfahrung und Spezialisierung des Detektivs',
                                                'Einsatzzeiten (Abend, Samstag, verkaufsoffene '
                                                'Aktionen)',
                                                'Einsatzmodell: regelmäßig variierend, saisonal '
                                                '(Weihnachtsgeschäft) oder anlassbezogen',
                                                'Kombination mit Doorman-Präsenz oder '
                                                'Warensicherungs-Beratung']},
                                   7: {'name': 'Trust',
                                       'h2': 'Diskretion braucht Vertrauen, und Nachweise',
                                       'body': ['FRANKONIA ist nach DIN 77200-1 und ISO 9001 '
                                                'zertifiziert (DEKRA-geprüft); alle Detektive '
                                                'sind nach § 34a GewO qualifiziert und arbeiten '
                                                'nach dokumentierten Einsatzregeln. '
                                                'Einzelhändler in Bamberg, Nürnberg und der '
                                                'Region vertrauen auf diese Kombination aus '
                                                'Erfahrung und Prozess — Referenzen nennen wir '
                                                'aus Diskretionsgründen im persönlichen '
                                                'Gespräch.']},
                                   8: {'name': 'FAQ',
                                       'h2': 'Kaufhausdetektei: die häufigsten Fragen',
                                       'body': ['Was kostet ein Kaufhausdetektiv pro Stunde? In '
                                                'der Regel zwischen 26 und 32 Euro pro Stunde, '
                                                'je nach Erfahrung, Einsatzzeit und Modell. '
                                                'Wirtschaftlicher als Dauerpräsenz sind meist '
                                                'gezielte, variierende Einsätze zu kritischen '
                                                'Zeiten, das Konzept dafür erstellen wir auf '
                                                'Basis Ihrer Inventurdaten, das Angebot erhalten '
                                                'Sie innerhalb eines Werktages.',
                                                'Darf ein Ladendetektiv jemanden festhalten? Ja, '
                                                'unter den Voraussetzungen des § 127 StPO: Wer '
                                                'auf frischer Tat betroffen ist, darf bis zum '
                                                'Eintreffen der Polizei vorläufig festgehalten '
                                                'werden. FRANKONIA Detektive sprechen nur bei '
                                                'lückenloser Beobachtung an und dokumentieren '
                                                'jeden Schritt gerichtsfest.',
                                                'Fällt der Detektiv in meinem Geschäft auf? Nein '
                                                '— Ladendetektive arbeiten zivil und verhalten '
                                                'sich wie normale Kunden. Einsatzzeiten '
                                                'variieren, damit auch Stammtäter kein Muster '
                                                'erkennen. Auf Wunsch kombinieren wir die zivile '
                                                'Detektei mit sichtbarer Doorman-Präsenz am '
                                                'Eingang.',
                                                'Lohnt sich ein Detektiv auch für kleinere '
                                                'Geschäfte? Ja, mit dem passenden Modell: Statt '
                                                'täglicher Präsenz reichen oft wenige, gezielt '
                                                'gesetzte Einsatztage pro Monat, etwa zu '
                                                'Stoßzeiten oder in der Weihnachtssaison. '
                                                'Maßstab ist Ihre Inventurdifferenz, nicht die '
                                                'Ladengröße.',
                                                'In welchen Städten ist die FRANKONIA '
                                                'Kaufhausdetektei im Einsatz? Im Umkreis von '
                                                'rund 100 Kilometern um Bamberg, unter anderem '
                                                'in Nürnberg, Würzburg, Erlangen, Fürth, '
                                                'Bayreuth, Schweinfurt und Coburg. → '
                                                '/sicherheitsdienst-nuernberg/']},
                                   9: {'name': 'Abschluss-CTA + verwandte Seiten',
                                       'h2': 'Jetzt Detektiv-Einsatz anfragen, diskret und '
                                             'unverbindlich',
                                       'related': 'Objektschutz → /objektschutz/ · '
                                                  'Empfangsdienst → /empfangsdienst/ · '
                                                  'Sicherheitstechnik → /sicherheitstechnik/',
                                       'body': ['Beschreiben Sie kurz Ihren Markt und Ihre '
                                                'Situation, unsere Experten melden sich '
                                                'innerhalb eines Werktages. Auf Wunsch ruft Sie '
                                                'der Einsatzleiter außerhalb Ihrer '
                                                'Ladenöffnungszeiten an. Formulartitel: Ihre '
                                                'Detektei-Anfrage',
                                                'In Ihrer Stadt: Sicherheitsdienst Nürnberg → '
                                                '/sicherheitsdienst-nuernberg/ · Würzburg → '
                                                '/sicherheitsdienst-wuerzburg/ · Bamberg → '
                                                '/sicherheitsdienst-bamberg/']}}},
 'veranstaltungsschutz': {'meta': {'URL': 'URL: /veranstaltungsschutz/',
                                   'Title': 'Title (60 Zeichen): Veranstaltungsschutz Franken | '
                                            'Event & Türsteher – FRANKONIA',
                                   'Meta-Description': 'Meta-Description (148 Zeichen): '
                                                       'Veranstaltungsschutz für Events, Messen '
                                                       '& Feste: Einlass, Ordnerdienst, '
                                                       'Deeskalation & Türsteher. Unterstützung '
                                                       'schon bei den behördlichen Auflagen.',
                                   'Primär-Keyword': 'Primär-Keyword: veranstaltungsschutz (390) '
                                                     '· Unterstützend: veranstaltungssicherheit '
                                                     '(210), türsteher (2.400, eigener '
                                                     'H2-Abschnitt), sicherheitskonzept für '
                                                     'veranstaltungen (Cluster ~590, KD 11–16, '
                                                     'SE Ranking 24.07., eigener H2-Abschnitt), '
                                                     'eventsecurity (40), ordnerdienst (30)',
                                   'Schema': 'Schema: Service + FAQPage + BreadcrumbList',
                                   'Interne Links': 'Interne Links: /brandwache/ · '
                                                    '/empfangsdienst/ · /objektschutz/ · '
                                                    '/sicherheitsdienst-nuernberg/, '
                                                    '/sicherheitsdienst-bamberg/, '
                                                    '/sicherheitsdienst-wuerzburg/ · '
                                                    'Autoritätslinks: '
                                                    'Versammlungsstättenverordnung (Bayern), § '
                                                    '34a GewO'},
                          'sections': {1: {'name': 'Hero',
                                           'badge': 'Ordner, Einlass & Deeskalation — '
                                                    'IHK-qualifiziert nach § 34a GewO',
                                           'h1': 'Veranstaltungsschutz: Sicherheit für Ihr Event '
                                                 'in Franken',
                                           'subline': 'Sicherheit, Ordnung und reibungsloser '
                                                      'Ablauf für Ihr Event, von den '
                                                      'behördlichen Auflagen bis zum Einlass.',
                                           'body': ['Unterstützung bei Sicherheitskonzept und '
                                                    'behördlichen Auflagen',
                                                    'Geschulte Kräfte für Einlass, Ordnerdienst '
                                                    'und Deeskalation',
                                                    'Ein Ansprechpartner vom Planungsgespräch '
                                                    'bis zum Abbau']},
                                       2: {'name': 'Risiko',
                                           'h2': 'Als Veranstalter haften Sie, auch für das, was '
                                                 'Ihr Sicherheitsdienst versäumt',
                                           'body': ['Bei einer Veranstaltung entscheiden Minuten '
                                                    'und Menschenkenntnis. Was ohne '
                                                    'professionellen Veranstaltungsschutz auf '
                                                    'dem Spiel steht:',
                                                    'Eskalationen im Publikum: Ein übersehener '
                                                    'Konflikt, eine unprofessionelle Ansprache, '
                                                    'und aus einer Rangelei wird ein Vorfall mit '
                                                    'Verletzten, Anzeigen und Presse.',
                                                    'Behördliche Auflagen: Fehlt das geforderte '
                                                    'Sicherheitspersonal oder das '
                                                    'Sicherheitskonzept, drohen '
                                                    'Auflagen-Verstöße bis zur Absage der '
                                                    'Veranstaltung.',
                                                    'Ihr Ruf: Gäste erinnern sich an aggressive '
                                                    'Türsteher und chaotischen Einlass, nicht an '
                                                    'das Programm. Der Sicherheitsdienst ist '
                                                    'Teil Ihres Gastgeber-Auftritts.']},
                                       3: {'name': 'Leistungsumfang',
                                           'h2': 'Das übernimmt FRANKONIA bei Ihrer '
                                                 'Veranstaltung',
                                           'body': ['Einlasskontrolle: Ticket- und '
                                                    'Ausweiskontrolle, Taschenkontrollen nach '
                                                    'Auflage, Gästeliste, freundlich im Ton, '
                                                    'konsequent in der Sache.',
                                                    'Ordnerdienst: Wegeführung, Absperrungen, '
                                                    'Bühnengraben, Parkplatz — Ordner nach '
                                                    'Versammlungsstättenverordnung, eingewiesen '
                                                    'auf Ihre Örtlichkeit.',
                                                    'Deeskalation & Intervention: Geschulte '
                                                    'Kräfte erkennen Konflikte früh und lösen '
                                                    'sie, bevor sie eskalieren, koordiniert über '
                                                    'Funk, dokumentiert im Einsatzprotokoll.',
                                                    'Evakuierung & Notfallorganisation: '
                                                    'Eingespielte Abläufe nach Ihrem '
                                                    'Räumungskonzept, Zusammenarbeit mit '
                                                    'Polizei, Feuerwehr und Sanitätsdienst.',
                                                    'Brandsicherheitswache: Wo die Behörde sie '
                                                    'fordert, aus einer Hand mit dem übrigen '
                                                    'Veranstaltungsschutz. → /brandwache/',
                                                    'Garderobe & Backstage: Zutrittsschutz für '
                                                    'sensible Bereiche, Künstler- und '
                                                    'VIP-Betreuung nach Absprache.']},
                                       4: {'name': 'Türsteher & Einlass für Gastronomie und '
                                                   'Clubs (Sekundär-Keyword-Sektion)',
                                           'h2': 'Türsteher gesucht? Professioneller Einlass für '
                                                 'Gastronomie, Clubs und Bars',
                                           'hinweis_box': 'Unser Anspruch: Gäste sollen bei '
                                                          'unprofessionellem Auftreten Feedback '
                                                          'direkt dem Sicherheitsdienst geben, '
                                                          'nicht Ihnen. Dafür gibt es bei '
                                                          'FRANKONIA einen direkten '
                                                          'Feedback-Kanal — Beschwerden landen '
                                                          'bei uns und werden nachverfolgt.',
                                           'body': ['Ein guter Türsteher ist Gastgeber und '
                                                    'Sicherheitskraft zugleich: Er entscheidet '
                                                    'freundlich, aber verbindlich, wer '
                                                    'hineinkommt, und bleibt ruhig, wenn andere '
                                                    'es nicht mehr sind. Dafür stellt FRANKONIA '
                                                    'geprüfte Kräfte nach § 34a GewO, einzeln '
                                                    'oder als festes Team für Ihre '
                                                    'wiederkehrenden Abende.',
                                                    'Feste Türsteher-Teams statt wechselnder '
                                                    'Aushilfen — Ihr Personal kennt Ihre Gäste '
                                                    'und Ihre Hausregeln',
                                                    'Deeskalations-geschult und '
                                                    'dokumentationssicher (wichtig bei Anzeigen '
                                                    'und Hausverboten)',
                                                    'Auch kurzfristig für einzelne '
                                                    'Veranstaltungen oder als Verstärkung']},
                                       5: {'name': 'Sicherheitskonzept für Veranstaltungen '
                                                   '(Keyword-Sektion, 590er-Cluster)',
                                           'h2': 'Sicherheitskonzept für Veranstaltungen: ab '
                                                 'wann Pflicht, und wer es erstellt',
                                           'cta': 'Unverbindliches Angebot einholen',
                                           'body': ['Ein Sicherheitskonzept ist für '
                                                    'Veranstaltungen in Versammlungsstätten ab '
                                                    '5.000 Besucherplätzen vorgeschrieben (§ 43 '
                                                    'MVStättVO) — Behörden können es aber auch '
                                                    'darunter fordern, etwa bei erhöhtem Risiko '
                                                    'oder Open-Air-Lagen. Erstellt wird es vom '
                                                    'Veranstalter, in der Praxis gemeinsam mit '
                                                    'einem erfahrenen Sicherheitsdienstleister: '
                                                    'FRANKONIA liefert Risikobewertung, '
                                                    'Personalbemessung, Räumungs- und '
                                                    'Ordnerkonzept, abgestimmt mit Ordnungsamt, '
                                                    'Polizei und Feuerwehr.',
                                                    'Die meisten Sicherheitsprobleme einer '
                                                    'Veranstaltung entstehen in der Planung, '
                                                    'nicht am Abend selbst. Deshalb steigt '
                                                    'FRANKONIA früh ein:',
                                                    '1 Planungsgespräch: Veranstaltungsart, '
                                                    'Besucherzahl, Örtlichkeit, Risikobewertung, '
                                                    'daraus entsteht die Personalempfehlung.',
                                                    '2 Sicherheitskonzept & Behörden: Wir '
                                                    'unterstützen bei Sicherheitskonzept, '
                                                    'Auflagen und der Abstimmung mit '
                                                    'Ordnungsamt, Polizei und Feuerwehr.',
                                                    '3 Briefing & Aufbau: Einweisung aller '
                                                    'Kräfte auf Lageplan, Funkkonzept und '
                                                    'Eskalationsstufen, vor dem ersten Gast.',
                                                    '4 Durchführung & Nachbereitung: '
                                                    'Einsatzleitung vor Ort, dokumentierte '
                                                    'Vorfälle, gemeinsames Debriefing mit '
                                                    'Empfehlungen für das nächste Mal.']},
                                       6: {'name': 'Anwendungsfälle',
                                           'h2': 'Diese Veranstaltungen schützt FRANKONIA',
                                           'body': ['Stadtfeste & Open-Airs: Große '
                                                    'Besucherströme, Jugendschutz, Glasverbot — '
                                                    'Ordnerdienst und Einlass im Zusammenspiel '
                                                    'mit den Behörden.',
                                                    'Firmenevents & Galas: Repräsentativer '
                                                    'Einlass (auf Wunsch im Anzug), Gästeliste, '
                                                    'diskreter Schutz für Gäste und Ausstattung.',
                                                    'Messen & Kongresse: Standbewachung über '
                                                    'Nacht, Zutrittskontrolle, '
                                                    'Personalverstärkung zu Stoßzeiten. → '
                                                    '/sicherheitsdienst-nuernberg/',
                                                    'Konzerte & Kulturveranstaltungen: '
                                                    'Bühnengraben, Backstage, '
                                                    'Evakuierungskonzept, koordiniert mit '
                                                    'Veranstalter und Location.',
                                                    'Sportveranstaltungen: Ordnerdienst, '
                                                    'Fantrennung, Einlasskontrollen nach '
                                                    'Verbandsvorgaben.']},
                                       7: {'name': 'Kosten',
                                           'h2': 'Was kostet Veranstaltungsschutz?',
                                           'preis_box': 'IHRE PREISSPANNE 26–32 €/Std. je Kraft '
                                                        '(netto) · Personalempfehlung nach '
                                                        'Planungsgespräch · Angebot in 1 Werktag '
                                                        '· CTA: Unverbindliches Angebot einholen',
                                           'body': ['Veranstaltungsschutz kostet in der Regel '
                                                    'zwischen 25 und 38 Euro pro Stunde und '
                                                    'Kraft, abhängig von Qualifikation, Uhrzeit '
                                                    'und Einsatzdauer. Die Personalstärke ergibt '
                                                    'sich aus Besucherzahl, Veranstaltungsart '
                                                    'und behördlichen Auflagen; als Faustwert '
                                                    'wird oft 1 Sicherheitskraft je 100 Besucher '
                                                    'angesetzt, verbindlich ist aber immer die '
                                                    'Auflage im Einzelfall.',
                                                    'Qualifikation (Ordner, § 34a-Kraft, '
                                                    'Einsatzleiter)',
                                                    'Uhrzeit: Nacht- und Wochenendzuschläge nach '
                                                    'Tarif',
                                                    'Dauer und Personalstärke laut '
                                                    'Sicherheitskonzept',
                                                    'Zusatzleistungen: Brandsicherheitswache, '
                                                    'Planungsunterstützung, Technik']},
                                       8: {'name': 'Trust',
                                           'h2': 'Erfahrung, auf die sich Veranstalter in ganz '
                                                 'Franken verlassen',
                                           'body': ['FRANKONIA sichert seit über zehn Jahren '
                                                    'Veranstaltungen in der Region, vom '
                                                    'Firmenevent bis zum Stadtfest, unter '
                                                    'anderem für Kommunen und öffentliche '
                                                    'Einrichtungen. Zertifiziert nach DIN '
                                                    '77200-1 und ISO 9001 (DEKRA-geprüft), mit '
                                                    'ausschließlich IHK-qualifizierten Kräften '
                                                    'nach § 34a GewO.']},
                                       9: {'name': 'FAQ',
                                           'h2': 'Veranstaltungsschutz: die häufigsten Fragen',
                                           'body': ['Wie viele Sicherheitskräfte brauche ich für '
                                                    'meine Veranstaltung? Als Orientierung wird '
                                                    'häufig 1 Sicherheitskraft je 100 Besucher '
                                                    'angesetzt, verbindlich sind aber die '
                                                    'behördlichen Auflagen und die '
                                                    'Risikobewertung Ihrer konkreten '
                                                    'Veranstaltung. FRANKONIA erstellt Ihnen '
                                                    'nach einem kurzen Planungsgespräch eine '
                                                    'belastbare Personalempfehlung, das Angebot '
                                                    'folgt innerhalb eines Werktages.',
                                                    'Was kostet Veranstaltungsschutz pro Stunde? '
                                                    'In der Regel 26 bis 32 Euro pro Stunde und '
                                                    'Kraft, je nach Qualifikation und Uhrzeit. '
                                                    'Einsatzleiter und besonders qualifizierte '
                                                    'Kräfte liegen am oberen Ende; Nacht- und '
                                                    'Wochenendzuschläge kommen nach Tarif dazu.',
                                                    'Stellt FRANKONIA auch Türsteher für Clubs '
                                                    'und Gastronomie? Ja, geprüfte Kräfte nach § '
                                                    '34a GewO, deeskalations-geschult, einzeln '
                                                    'oder als festes Team für wiederkehrende '
                                                    'Abende. Feste Teams haben den Vorteil, dass '
                                                    'Ihr Personal Gäste, Hausregeln und '
                                                    'kritische Situationen Ihres Betriebs kennt.',
                                                    'Hilft FRANKONIA bei den behördlichen '
                                                    'Auflagen? Ja. Wir unterstützen bei '
                                                    'Sicherheitskonzept, Personalbemessung und '
                                                    'der Abstimmung mit Ordnungsamt, Polizei und '
                                                    'Feuerwehr, inklusive Brandsicherheitswache, '
                                                    'wenn die Behörde sie fordert.',
                                                    'Wie kurzfristig kann ich '
                                                    'Veranstaltungsschutz buchen? Nach Absprache '
                                                    'auch kurzfristig, etwa als Verstärkung '
                                                    'wenige Tage vor dem Event. Für die '
                                                    'Unterstützung bei Auflagen und '
                                                    'Sicherheitskonzept gilt: je früher, desto '
                                                    'besser, ideal sind mehrere Wochen '
                                                    'Vorlauf.']},
                                       10: {'name': 'Abschluss-CTA + verwandte Seiten',
                                            'h2': 'Jetzt Veranstaltungsschutz anfragen, mit '
                                                  'Planungsgespräch',
                                            'related': 'Brandwache → /brandwache/ · '
                                                       'Empfangsdienst → /empfangsdienst/ · '
                                                       'Objektschutz → /objektschutz/',
                                            'body': ['Beschreiben Sie kurz Veranstaltung, Datum '
                                                     'und erwartete Besucherzahl, unsere '
                                                     'Experten melden sich innerhalb eines '
                                                     'Werktages mit Personalempfehlung und '
                                                     'Angebot. Formulartitel: Ihre Event-Anfrage',
                                                     'In Ihrer Stadt: Sicherheitsdienst Nürnberg '
                                                     '→ /sicherheitsdienst-nuernberg/ · Bamberg '
                                                     '→ /sicherheitsdienst-bamberg/ · Würzburg → '
                                                     '/sicherheitsdienst-wuerzburg/']}}},
 'baustellenbewachung': {'meta': {'URL': 'URL: /baustellenbewachung/',
                                  'Title': 'Title (57 Zeichen): Baustellenbewachung Franken | '
                                           'Diebstahlschutz – FRANKONIA',
                                  'Meta-Description': 'Meta-Description (159 Zeichen): '
                                                      'Baustellenbewachung gegen Diebstahl & '
                                                      'Vandalismus: flexible Konzepte, die mit '
                                                      'dem Baufortschritt mitwachsen. '
                                                      'Dokumentiert & zertifiziert, Angebot in 1 '
                                                      'Werktag.',
                                  'Primär-Keyword': 'Primär-Keyword: baustellenbewachung (390, '
                                                    'CPC 6,75 €) · Unterstützend: '
                                                    'baustellenschutz, baustellenbewachung '
                                                    'kosten (10), baustellensicherung · '
                                                    'Intent-Warnung: baustellenüberwachung (720) '
                                                    'NICHT als Primär, nur abgegrenzter Absatz',
                                  'Schema': 'Schema: Service + FAQPage + BreadcrumbList',
                                  'Interne Links': 'Interne Links: /objektschutz/ · /brandwache/ '
                                                   '· /revier-schliessdienst/ · '
                                                   '/sicherheitstechnik/ (Videoturm) · '
                                                   '/sicherheitsdienst-nuernberg/, '
                                                   '/sicherheitsdienst-wuerzburg/ · '
                                                   'Autoritätslinks: Polizeiliche '
                                                   'Kriminalprävention (Baustellendiebstahl), § '
                                                   '34a GewO'},
                         'sections': {1: {'name': 'Hero',
                                          'badge': 'Flexible Bewachungskonzepte, angepasst an '
                                                   'Ihren Baufortschritt',
                                          'h1': 'Baustellenbewachung: Schützen Sie Ihre '
                                                'Baustelle vor Diebstahl und Vandalismus',
                                          'subline': 'Maschinen, Kraftstoff, Material: FRANKONIA '
                                                     'schützt Ihre Baustelle mit festen Teams '
                                                     'und Konzepten, die mit dem Bau mitwachsen.',
                                          'body': ['Schutz vor Diebstahl, Vandalismus und '
                                                   'Materialverlust, dokumentiert',
                                                   'Festes Sicherheitsteam statt wechselnder '
                                                   'Gesichter',
                                                   'Konzept passt sich Bauphasen an: vom Rohbau '
                                                   'bis zur Übergabe']},
                                      2: {'name': 'Risiko',
                                          'h2': 'Was ein Wochenende ohne Bewachung kosten kann',
                                          'abbinder': 'Sichtbare Bewachung zu unvorhersehbaren '
                                                      'Zeiten ist die wirksamste Prävention — '
                                                      'Täter beobachten Baustellen, bevor sie '
                                                      'zuschlagen.',
                                          'body': ['Baustellendiebstahl verursacht in '
                                                   'Deutschland jährlich Schäden in '
                                                   'Millionenhöhe, und trifft fast immer nachts, '
                                                   'am Wochenende oder in Ferienzeiten. Der '
                                                   'eigentliche Schaden ist oft nicht das '
                                                   'gestohlene Gerät, sondern der Bauverzug.',
                                                   'Maschinen- & Kraftstoffdiebstahl: Bagger, '
                                                   'Radlader, Werkzeug, Diesel, organisierte '
                                                   'Täter wissen, was sich lohnt, und schlagen '
                                                   'gezielt zu. Ein einziger Maschinendiebstahl '
                                                   'übersteigt schnell die Bewachungskosten '
                                                   'eines ganzen Bauabschnitts.',
                                                   'Bauverzögerung & Vertragsstrafen: Fehlt am '
                                                   'Montag das Gerät, steht die Kolonne. '
                                                   'Verzugsschäden und Vertragsstrafen kosten '
                                                   'oft mehr als der reine Materialwert.',
                                                   'Vandalismus & ungebetene Gäste: Beschädigte '
                                                   'Verschalungen, besprühte Fassaden, Unbefugte '
                                                   'auf dem Gelände, mit Haftungsrisiken, wenn '
                                                   'jemandem etwas zustößt.']},
                                      3: {'name': 'Leistungsumfang',
                                          'h2': 'So bewacht FRANKONIA Ihre Baustelle',
                                          'body': ['Nacht- & Wochenendbewachung: Feste Posten '
                                                   'oder Kontrollgänge in den kritischen Zeiten, '
                                                   'je nach Lage und Materialwert.',
                                                   'Kontrollgänge zu variierenden Zeiten: '
                                                   'Unvorhersehbare Kontrollen als '
                                                   'wirtschaftliche Alternative zur '
                                                   'Dauerbewachung, im Raum Bamberg auch als '
                                                   'Revierdienst-Kontrollfahrten. → '
                                                   '/revier-schliessdienst/',
                                                   'Zufahrts- & Zutrittskontrolle: Wer fährt was '
                                                   'auf und vom Gelände? Kontrolle von '
                                                   'Lieferverkehr und Subunternehmern, '
                                                   'dokumentiert.',
                                                   'Technik-Kombination: Moderne '
                                                   'Videoüberwachung und Alarmtechnik, wo sie '
                                                   'Personalstunden sparen, geplant als Teil des '
                                                   'Bewachungskonzepts. → /sicherheitstechnik/',
                                                   'Brandwache bei Heißarbeiten: Schweiß- und '
                                                   'Dacharbeiten mit vorgeschriebener '
                                                   'Brandwache, aus einer Hand mit der '
                                                   'Bewachung. → /brandwache/',
                                                   'Lückenlose Dokumentation: Jede Kontrolle, '
                                                   'jeder Vorfall im digitalen Wachbuch, als '
                                                   'Nachweis für Bauherren, Partnerfirmen und '
                                                   'Versicherung.']},
                                      4: {'name': 'Baustellenbewachung vs.\xa0technische '
                                                  'Baustellenüberwachung (Pflicht-Abgrenzung)',
                                          'h2': 'Baustellenbewachung oder Baustellenüberwachung, '
                                                'wovon ist hier die Rede?',
                                          'body': ['Baustellenbewachung schützt Ihre Baustelle '
                                                   'vor Diebstahl, Vandalismus und unbefugtem '
                                                   'Zutritt, durch Sicherheitspersonal und '
                                                   'ergänzende Technik. Die technische '
                                                   'Baustellenüberwachung (Bauüberwachung durch '
                                                   'Bauleiter, Baukameras zur Dokumentation des '
                                                   'Baufortschritts) ist etwas anderes und keine '
                                                   'Sicherheitsdienstleistung. FRANKONIA '
                                                   'übernimmt die Bewachung, inklusive '
                                                   'Videotechnik, wenn sie dem Schutz dient, '
                                                   'nicht der Baudokumentation.']},
                                      5: {'name': 'Warum FRANKONIA (Pain-Aufhänger)',
                                          'h2': 'Baustellenbewachung, auf die Sie sich verlassen '
                                                'können',
                                          'body': ['Ob die Nachtkontrolle wirklich gelaufen ist, '
                                                   'sehen Sie ohne Nachweise erst nach dem '
                                                   'Einbruch. Deshalb arbeitet FRANKONIA mit '
                                                   'Kontrollpunkten und digitalem Wachbuch:',
                                                   'Nachweisbar gelaufen: Wächterkontrollsystem '
                                                   'mit Checkpoints auf dem Gelände, jede Runde '
                                                   'wird technisch belegt, nicht nur behauptet.',
                                                   'Festes Team, eingewiesen auf Ihre Baustelle: '
                                                   'Zufahrten, Gefahrstellen, Ansprechpartner '
                                                   'der Gewerke — Ihr Team kennt die Baustelle '
                                                   'und erkennt, was nicht dorthin gehört.',
                                                   'Ein Ansprechpartner für die gesamte Bauzeit: '
                                                   'Bauphasen ändern sich, Ihr Einsatzleiter '
                                                   'bleibt, erreichbar rund um die Uhr, auch '
                                                   'wenn kurzfristig mehr Schutz nötig ist.']},
                                      6: {'name': 'Konkrete Schritte',
                                          'h2': 'In 4 Schritten zur bewachten Baustelle',
                                          'cta': 'Unverbindliches Angebot einholen',
                                          'body': ['1 Baustellen-Begehung: Lage, Zufahrten, '
                                                   'Materialwerte, Bauzeitenplan, kostenfrei, '
                                                   'auf Wunsch kurzfristig.',
                                                   '2 Bewachungskonzept: Posten, Revierdienst, '
                                                   'Technik oder Kombination, kalkuliert auf '
                                                   'Bauphasen statt pauschal.',
                                                   '3 Angebot in 1 Werktag: Transparent nach '
                                                   'Bauabschnitten, anpassbar bei Bauverzug oder '
                                                   'Planänderung.',
                                                   '4 Start der Bewachung: Auch kurzfristig nach '
                                                   'Absprache, etwa nach einem ersten Vorfall '
                                                   'auf dem Gelände.']},
                                      7: {'name': 'Kosten',
                                          'h2': 'Was kostet Baustellenbewachung?',
                                          'hinweis': 'Vergleichen Sie die Bewachungskosten mit '
                                                     'Ihrem Risiko: Maschinenwert, '
                                                     'Wiederbeschaffungszeit, Vertragsstrafen '
                                                     'bei Verzug. Meist entscheidet ein einziger '
                                                     'verhinderter Diebstahl die Rechnung.',
                                          'preis_box': 'IHRE PREISSPANNE 26–32 €/Std. (netto; '
                                                       'Revierkontrollen je Fahrt) · Konzept '
                                                       'nach Bauphasen · Angebot in 1 Werktag · '
                                                       'CTA: Unverbindliches Angebot einholen',
                                          'body': ['Baustellenbewachung kostet in der Regel '
                                                   'zwischen 25 und 35 Euro pro Stunde für '
                                                   'Bewachungspersonal; im Raum Bamberg sind '
                                                   'Revierkontrollen je Kontrollfahrt die '
                                                   'wirtschaftliche Einstiegslösung. Die '
                                                   'Faktoren:',
                                                   'Bewachungsform: fester Posten, '
                                                   'Kontrollfahrten oder Kombination mit Technik',
                                                   'Einsatzzeiten: Nächte, Wochenenden, '
                                                   'Feiertage (tarifliche Zuschläge)',
                                                   'Lage und Größe des Geländes, Anzahl der '
                                                   'Zufahrten',
                                                   'Bauphase: Rohbau mit Großgerät braucht '
                                                   'anderen Schutz als der Innenausbau',
                                                   'Dauer: Bewachung über Monate wird günstiger '
                                                   'je Stunde als der Kurzeinsatz']},
                                      8: {'name': 'Trust',
                                          'h2': 'Bewachung, auf die sich Bauherren und '
                                                'Generalunternehmer verlassen',
                                          'body': ['FRANKONIA bewacht Baustellen in ganz '
                                                   'Franken, vom Wohnbauprojekt bis zur '
                                                   'Industrie-Erweiterung, zertifiziert nach DIN '
                                                   '77200-1 und ISO 9001 (DEKRA-geprüft). Ihr '
                                                   'Ansprechpartner für Ihre Anfrage: Alexander '
                                                   'Jäger, Vertriebsleiter und '
                                                   'Sicherheitsbeauftragter; im Einsatz ist die '
                                                   'Einsatzleitung rund um die Uhr erreichbar. '
                                                   'Dokumentation und Nachweise sind '
                                                   'versicherungs- und gerichtstauglich.']},
                                      9: {'name': 'FAQ',
                                          'h2': 'Baustellenbewachung: die häufigsten Fragen',
                                          'body': ['Was kostet Baustellenbewachung pro Stunde? '
                                                   'In der Regel 26 bis 32 Euro pro Stunde für '
                                                   'Bewachungspersonal, mit tariflichen '
                                                   'Zuschlägen für Nacht, Wochenende und '
                                                   'Feiertage. Revierkontrollen zu variierenden '
                                                   'Zeiten werden je Kontrollfahrt kalkuliert '
                                                   'und sind oft die wirtschaftlichste Lösung — '
                                                   'Ihr Angebot erhalten Sie innerhalb eines '
                                                   'Werktages.',
                                                   'Reichen Kontrollen oder brauche ich einen '
                                                   'festen Posten? Das hängt von Materialwert, '
                                                   'Lage und Bauphase ab: Bei Großgerät und '
                                                   'abgelegener Lage lohnt der feste '
                                                   'Nachtposten, bei überschaubaren Werten '
                                                   'reichen oft variierende Kontrollen plus '
                                                   'Alarmtechnik (im Raum Bamberg als '
                                                   'Revierdienst-Kontrollfahrten). Die '
                                                   'kostenfreie Begehung liefert eine klare '
                                                   'Empfehlung, inklusive Kostenvergleich.',
                                                   'Wie schnell kann die Bewachung starten? Nach '
                                                   'Absprache auch sehr kurzfristig, etwa nach '
                                                   'einem Einbruch am Wochenende. Rufen Sie '
                                                   'direkt an: +49 951 964352-0, die '
                                                   'Einsatzleitung ist rund um die Uhr '
                                                   'erreichbar.',
                                                   'Passt sich die Bewachung dem Baufortschritt '
                                                   'an? Ja, das Konzept wird je Bauphase '
                                                   'angepasst: mehr Präsenz bei Großgerät und '
                                                   'offenem Rohbau, weniger im Innenausbau, '
                                                   'Sonderschutz vor der Übergabe. Sie zahlen '
                                                   'für den Schutz, den die aktuelle Phase '
                                                   'braucht.',
                                                   'Übernimmt FRANKONIA auch die Brandwache bei '
                                                   'Heißarbeiten? Ja, Brandwachen für Schweiß-, '
                                                   'Löt- und Dacharbeiten stellen wir aus einer '
                                                   'Hand mit der Baustellenbewachung, inklusive '
                                                   'der vorgeschriebenen Nachkontrolle und '
                                                   'Dokumentation für den Versicherer. → '
                                                   '/brandwache/']},
                                      10: {'name': 'Abschluss-CTA + verwandte Seiten',
                                           'h2': 'Jetzt Baustellenbewachung anfragen — Begehung '
                                                 'kostenfrei',
                                           'related': 'Brandwache → /brandwache/ · Revier- & '
                                                      'Schließdienst → /revier-schliessdienst/ · '
                                                      'Sicherheitstechnik → /sicherheitstechnik/',
                                           'body': ['Beschreiben Sie kurz Baustelle, Bauphase '
                                                    'und Zeitraum, unsere Experten melden sich '
                                                    'innerhalb eines Werktages, bei akuten '
                                                    'Fällen sofort. Formulartitel: Ihre '
                                                    'Baustellen-Anfrage',
                                                    'In Ihrer Stadt: Sicherheitsdienst Nürnberg '
                                                    '→ /sicherheitsdienst-nuernberg/ · Würzburg '
                                                    '→ /sicherheitsdienst-wuerzburg/ · Bamberg → '
                                                    '/sicherheitsdienst-bamberg/']}}},
 'revier-schliessdienst': {'meta': {'URL': 'URL: /revier-schliessdienst/',
                                    'Title': 'Title (57 Zeichen): Revier- & Schließdienst '
                                             'Bamberg | Basisschutz – FRANKONIA',
                                    'Meta-Description': 'Meta-Description (145 Zeichen): Revier- '
                                                        '& Schließdienst im Raum Bamberg: '
                                                        'Kontrollfahrten und Verschlussrunden zu '
                                                        'variierenden Zeiten, wirtschaftlicher '
                                                        'Basisschutz, dokumentiert.',
                                    'Primär-Keyword': 'Primär-Keyword: revierdienst (320) · '
                                                      'Unterstützend: schließdienst (320), '
                                                      'streifendienst (320), revier und '
                                                      'schließdienst, nachtkontrolle',
                                    'Schema': 'Schema: Service + FAQPage + BreadcrumbList',
                                    'Interne Links': 'Interne Links: /objektschutz/ · '
                                                     '/interventionsdienst/ · '
                                                     '/sicherheitstechnik/ · '
                                                     '/baustellenbewachung/ · '
                                                     '/sicherheitsdienst-bamberg/ (einzige '
                                                     'Stadtseite — Leistung nur im Raum Bamberg, '
                                                     'F9) · Autoritätslinks: § 34a GewO, BDSW'},
                           'sections': {1: {'name': 'Hero',
                                            'badge': 'Exklusiv im Raum Bamberg, dokumentiert je '
                                                     'Kontrolle',
                                            'h1': 'Revier- & Schließdienst: Kontrollierte '
                                                  'Sicherheit zum Bruchteil eines festen Postens',
                                            'subline': 'Nicht jedes Objekt braucht '
                                                       'Dauerbewachung, aber jedes braucht '
                                                       'Kontrolle: Kontrollfahrten und '
                                                       'Verschlussrunden in Stadt und Landkreis '
                                                       'Bamberg.',
                                            'body': ['Kontrollfahrten und Verschlussrunden zu '
                                                     'unvorhersehbaren Zeiten',
                                                     'Jede Kontrolle dokumentiert, mit '
                                                     'Checkpoint-Nachweis',
                                                     'Wirtschaftlich: bezahlt wird die '
                                                     'Kontrolle, nicht die Anwesenheit']},
                                        2: {'name': 'Das Prinzip (Variation: Erklär-Sektion '
                                                    'statt Risiko-Block)',
                                            'h2': 'Warum unvorhersehbare Kontrollen Täter '
                                                  'wirksamer abschrecken als Routine',
                                            'body': ['Einbrecher beobachten, bevor sie handeln, '
                                                     'und Routinen sind ihr bester Freund. Der '
                                                     'FRANKONIA Revierdienst arbeitet deshalb '
                                                     'mit variierenden Zeiten und Routen: Ihr '
                                                     'Objekt wird mehrfach pro Nacht oder Woche '
                                                     'kontrolliert, aber nie nach erkennbarem '
                                                     'Muster.',
                                                     'Revierdienst: Kontrollfahrten zu Ihrem '
                                                     'Objekt — Außenhaut, Zugänge, '
                                                     'Auffälligkeiten, auf Wunsch Innenkontrolle '
                                                     'mit definierten Punkten.',
                                                     'Schließdienst: Abendliche Verschlussrunden '
                                                     '(Türen, Tore, Fenster, '
                                                     'Alarmscharfschaltung) und morgendliches '
                                                     'Aufschließen, nie wieder die Frage „Ist '
                                                     'abgeschlossen?".',
                                                     'Streifendienst: Fußstreifen auf größeren '
                                                     'Arealen, Parkplätzen oder in '
                                                     'Gewerbegebieten, sichtbare Präsenz, wo '
                                                     'Fahrzeugkontrollen nicht genügen.']},
                                        3: {'name': 'Leistungsumfang',
                                            'h2': 'Das ist im FRANKONIA Revier- & Schließdienst '
                                                  'enthalten',
                                            'body': ['Kontrollfahrten nach Vereinbarung: '
                                                     'Häufigkeit, Zeiten und Prüfpunkte werden '
                                                     'je Objekt festgelegt, von der täglichen '
                                                     'Nachtkontrolle bis zur Wochenendrunde.',
                                                     'Verschluss- & Öffnungsrunden: '
                                                     'Dokumentiertes Verschließen am Abend, '
                                                     'kontrolliertes Öffnen am Morgen, inklusive '
                                                     'Alarmanlagen-Bedienung.',
                                                     'Checkpoint-Nachweis: Kontrollpunkte am '
                                                     'Objekt belegen jede gelaufene Runde im '
                                                     'Wächterkontrollsystem — Sie sehen, was '
                                                     'wann geprüft wurde.',
                                                     'Erstmaßnahmen bei Feststellungen: Offene '
                                                     'Tür, Wasserschaden, Einbruchspuren, '
                                                     'definierte Meldekette, Sicherung vor Ort, '
                                                     'Dokumentation mit Foto.',
                                                     'Alarmverfolgung kombinierbar: Revierdienst '
                                                     'plus Interventionsdienst: Wer ohnehin in '
                                                     'Ihrem Revier unterwegs ist, ist bei Alarm '
                                                     'schneller da. → /interventionsdienst/',
                                                     'Urlaubs- & Sonderkontrollen: Verstärkte '
                                                     'Kontrollen in Betriebsferien, an '
                                                     'Feiertagen oder nach Vorfällen, '
                                                     'kurzfristig zubuchbar.']},
                                        4: {'name': 'Für wen sich welches Modell rechnet '
                                                    '(Kernsektion Wirtschaftlichkeit)',
                                            'h2': 'Revierdienst oder fester Posten, was rechnet '
                                                  'sich für Ihr Objekt?',
                                            'abbinder': 'Am wirtschaftlichsten ist oft die '
                                                        'Kombination: Alarmtechnik erkennt, der '
                                                        'Revierdienst kontrolliert planmäßig, '
                                                        'die Interventionskraft reagiert im '
                                                        'Alarmfall. Welche Lösung zu Ihrem '
                                                        'Objekt passt, klärt die kostenfreie '
                                                        'Begehung. → /objektschutz/',
                                            'body': ['Revier- & Schließdienst',
                                                     'Fester Posten (Objektschutz)',
                                                     'Prinzip',
                                                     'Kontrollen zu variierenden Zeiten',
                                                     'Durchgehende Anwesenheit',
                                                     'Kostenlogik',
                                                     'je Kontrollfahrt / Runde',
                                                     'je Stunde (26–32 €)',
                                                     'Passt zu',
                                                     'Büros, Praxen, Gewerbe, Baustellen mit '
                                                     'Technik',
                                                     'Hohe Werte, laufender Betrieb, Auflagen',
                                                     'Reaktionszeit',
                                                     'bei Alarm über Interventionsdienst',
                                                     'sofort vor Ort']},
                                        5: {'name': 'Warum FRANKONIA (Pain-Aufhänger, kompakt)',
                                            'h2': 'Revierdienst, den Sie jederzeit '
                                                  'nachvollziehen können',
                                            'body': ['Der häufigste Betrugsfall der Branche: '
                                                     'bezahlte Runden, die nie gefahren wurden. '
                                                     'Bei FRANKONIA ist jede Kontrolle technisch '
                                                     'belegt — Checkpoints am Objekt, '
                                                     'Zeitstempel, Foto-Dokumentation bei '
                                                     'Feststellungen. Aufgaben werden '
                                                     'zuverlässig erledigt, und Sie können es '
                                                     'jederzeit nachprüfen: im Report, den Sie '
                                                     'regelmäßig erhalten.']},
                                        6: {'name': 'Kosten',
                                            'h2': 'Was kostet ein Revier- und Schließdienst?',
                                            'preis_box': 'Kalkulation je Kontrollfahrt (netto) · '
                                                         'Objektschutz-Vergleichsrechnung '
                                                         'inklusive · Angebot in 1 Werktag · '
                                                         'CTA: Unverbindliches Angebot einholen',
                                            'body': ['Revier- und Schließdienst wird je '
                                                     'Kontrollfahrt bzw. Runde kalkuliert, nicht '
                                                     'je Stunde. Dadurch liegt der Monatspreis '
                                                     'für einen soliden Basisschutz meist '
                                                     'deutlich unter dem eines festen Postens; '
                                                     'als Einordnung: Schon wenige Euro-Beträge '
                                                     'je Kontrolle summieren sich je nach '
                                                     'Frequenz auf einen niedrigen bis mittleren '
                                                     'dreistelligen Monatsbetrag.',
                                                     'Anzahl und Frequenz der Kontrollen '
                                                     '(täglich, werktags, Wochenende)',
                                                     'Umfang je Kontrolle: Außenrunde, '
                                                     'Innenrunde, Verschlussrunde mit '
                                                     'Alarmbedienung',
                                                     'Lage im Revier (Anfahrtslogik, je dichter '
                                                     'das Revier, desto günstiger)',
                                                     'Zusatzleistungen: '
                                                     'Interventionsbereitschaft, '
                                                     'Sonderkontrollen, Berichte']},
                                        7: {'name': 'Trust',
                                            'h2': 'Basisschutz mit denselben Standards wie unser '
                                                  'Werkschutz',
                                            'body': ['Auch die günstigste FRANKONIA Leistung '
                                                     'läuft im zertifizierten System: DIN '
                                                     '77200-1, ISO 9001 (DEKRA-geprüft), '
                                                     'IHK-qualifizierte Kräfte nach § 34a GewO, '
                                                     'dokumentierte Prozesse. Über 300 '
                                                     'Unternehmen und Einrichtungen in Franken '
                                                     'vertrauen darauf, vom Einzelbüro bis zum '
                                                     'Industriestandort.']},
                                        8: {'name': 'FAQ',
                                            'h2': 'Revier- & Schließdienst: die häufigsten '
                                                  'Fragen',
                                            'body': ['Was kostet eine Nachtkontrolle für mein '
                                                     'Objekt? Revierkontrollen werden je '
                                                     'Kontrollfahrt kalkuliert, der Preis hängt '
                                                     'von Umfang, Frequenz und Lage im Revier '
                                                     'ab. Für die meisten Gewerbeobjekte liegt '
                                                     'ein solider Kontroll-Rhythmus bei einem '
                                                     'niedrigen bis mittleren dreistelligen '
                                                     'Monatsbetrag; Ihr konkretes Angebot '
                                                     'erhalten Sie innerhalb eines Werktages.',
                                                     'Woher weiß ich, dass die Runden wirklich '
                                                     'gefahren werden? Durch das '
                                                     'Wächterkontrollsystem: Checkpoints an '
                                                     'Ihrem Objekt werden bei jeder Runde '
                                                     'gescannt, mit Zeitstempel dokumentiert und '
                                                     'im Report ausgewiesen. Feststellungen '
                                                     '(offene Tür, Schaden, Verdacht) werden mit '
                                                     'Foto und Meldekette dokumentiert.',
                                                     'Was passiert, wenn der Revierfahrer etwas '
                                                     'feststellt? Er sichert die Situation, '
                                                     'informiert nach der vereinbarten '
                                                     'Meldekette (Sie, Polizei, Notdienste) und '
                                                     'dokumentiert den Vorfall mit Fotos. Auf '
                                                     'Wunsch bleibt die Kraft bis zur Klärung '
                                                     'vor Ort oder eine Verstärkung übernimmt.',
                                                     'Übernimmt FRANKONIA auch nur den '
                                                     'Schließdienst? Ja, abendliche '
                                                     'Verschlussrunden und morgendliches Öffnen '
                                                     'sind auch einzeln buchbar, inklusive '
                                                     'Alarmscharfschaltung. Viele Kunden starten '
                                                     'mit dem Schließdienst und erweitern später '
                                                     'um Nachtkontrollen.',
                                                     'Ist mein Objekt im FRANKONIA Revier? Der '
                                                     'Revier- und Schließdienst läuft '
                                                     'ausschließlich in Stadt und Landkreis '
                                                     'Bamberg, inklusive Hallstadt, Hirschaid, '
                                                     'Memmelsdorf und Umgebung. Ob Ihr Objekt im '
                                                     'Revier liegt, klärt ein kurzes Telefonat: '
                                                     '+49 951 964352-0. Außerhalb Bambergs '
                                                     'übernehmen Objektschutz und '
                                                     'Interventionsdienst vergleichbare '
                                                     'Aufgaben.']},
                                        9: {'name': 'Abschluss-CTA + verwandte Seiten',
                                            'h2': 'Jetzt Revier- & Schließdienst anfragen — '
                                                  'Basisschutz ab sofort',
                                            'related': 'Objektschutz → /objektschutz/ · '
                                                       'Interventionsdienst → '
                                                       '/interventionsdienst/ · '
                                                       'Sicherheitstechnik → '
                                                       '/sicherheitstechnik/',
                                            'body': ['Nennen Sie uns kurz Objekt und Adresse — '
                                                     'Sie erhalten Ihr Angebot mit '
                                                     'Kontroll-Empfehlung innerhalb eines '
                                                     'Werktages. Formulartitel: Ihre '
                                                     'Revierdienst-Anfrage',
                                                     'In Ihrer Stadt: Sicherheitsdienst Bamberg '
                                                     '→ /sicherheitsdienst-bamberg/ · Nürnberg → '
                                                     '/sicherheitsdienst-nuernberg/ · Erlangen → '
                                                     '/sicherheitsdienst-erlangen/']}}},
 'empfangsdienst': {'meta': {'URL': 'URL: /empfangsdienst/',
                             'Title': 'Title (60 Zeichen): Empfangsdienst Franken | '
                                      'Pfortendienst & Empfang – FRANKONIA',
                             'Meta-Description': 'Meta-Description (153 Zeichen): Empfangsdienst '
                                                 'mit Sicherheitskompetenz: Besuchermanagement, '
                                                 'Pfortendienst, Postannahme, im Anzug oder '
                                                 'Sicherheitsmontur. Fester Stamm statt '
                                                 'Fluktuation.',
                             'Primär-Keyword': 'Primär-Keyword: empfangsdienst (210) · '
                                               'Unterstützend: pfortendienst (320), '
                                               'empfangsservice, rezeptionsdienst',
                             'Schema': 'Schema: Service + FAQPage + BreadcrumbList',
                             'Interne Links': 'Interne Links: /werkschutz/ · /objektschutz/ · '
                                              '/kaufhausdetektei/ (Doorman) · Stadtseiten · '
                                              'Autoritätslinks: § 34a GewO'},
                    'sections': {1: {'name': 'Hero',
                                     'badge': 'Repräsentativ im Auftreten, konsequent in der '
                                              'Sache',
                                     'h1': 'Empfangsdienst: Der erste Eindruck Ihres '
                                           'Unternehmens, mit Sicherheitskompetenz',
                                     'subline': 'Empfangen Sie Besucher professionell, durch '
                                                'Kräfte, die freundlich auftreten und wissen, '
                                                'wer ins Gebäude darf.',
                                     'body': ['Besuchermanagement, Ausweiskontrolle und '
                                              'Telefonzentrale in einer Position',
                                              'Feste Stammkräfte mit Mitsprache bei der '
                                              'Personalauswahl',
                                              'Sicherheitskompetenz inklusive: § '
                                              '34a-qualifiziert, deeskalations-geschult']},
                                 2: {'name': 'Der erste Eindruck (Pain-Aufhänger als Einstieg, '
                                             'Variation)',
                                     'h2': 'Ein Empfang, der Gäste willkommen heißt und Ihr '
                                           'Unternehmen schützt',
                                     'highlight': 'Unser Versprechen: Gäste sollen bei '
                                                  'unprofessionellem Auftreten Feedback direkt '
                                                  'dem Sicherheitsdienst geben, nicht Ihnen. Der '
                                                  'direkte Feedback-Kanal gehört bei FRANKONIA '
                                                  'zum Empfangsdienst dazu, jede Rückmeldung '
                                                  'wird nachverfolgt.',
                                     'body': ['Der Empfang prägt den ersten Eindruck von Ihrem '
                                              'Unternehmen: Wer hier unfreundlich behandelt '
                                              'wird, erzählt es weiter — Bewerber, Kunden, '
                                              'Lieferanten. Und die Beschwerden landen nicht '
                                              'beim Sicherheitsdienst, sondern bei Ihnen.',
                                              'FRANKONIA besetzt Empfangspositionen deshalb '
                                              'anders: Sie reden bei der Personalauswahl mit, '
                                              'bestimmen Outfit und Umgangston, und bekommen '
                                              'feste Stammkräfte, die Ihre Besucher irgendwann '
                                              'mit Namen begrüßen.']},
                                 3: {'name': 'Leistungsumfang',
                                     'h2': 'Das übernimmt der FRANKONIA Empfangsdienst',
                                     'body': ['Besuchermanagement: Anmeldung, Besucherausweise, '
                                              'Begleitregelungen — Ihre Gäste fühlen sich '
                                              'erwartet statt kontrolliert.',
                                              'Pfortendienst: Zufahrts- und Zutrittskontrolle am '
                                              'Werkstor, Koordination von Lieferverkehr und '
                                              'Fremdfirmen, die klassische Pforte mit System. → '
                                              '/werkschutz/',
                                              'Telefon- & Postdienste: Zentrale, Paketannahme, '
                                              'Kurierabwicklung, zuverlässig auch dann, wenn der '
                                              'Empfang viel gleichzeitig können muss.',
                                              'Zutrittskontrolle & Ausweiswesen: Wer darf wohin? '
                                              'Ihr Empfang setzt die Regeln freundlich durch, '
                                              'und dokumentiert Ausnahmen.',
                                              'Sicherheits-Erstreaktion: Im Ernstfall '
                                              '(Bedrohung, Notfall, Alarm) reagiert Ihr Empfang '
                                              'geschult: Meldekette, Erstmaßnahmen, Einweisung '
                                              'der Einsatzkräfte.',
                                              'Vertretungssicherheit: Urlaub und Krankheit deckt '
                                              'der FRANKONIA Stamm ab, eingearbeitet nach '
                                              'Checkliste, kein „Springer ohne Ahnung".']},
                                 4: {'name': 'Anzug oder Montur? (Variation: Auftritt-Sektion)',
                                     'h2': 'Ihr Empfang, Ihr Auftritt: vom Business-Anzug bis '
                                           'zur Sicherheitsmontur',
                                     'body': ['Wie Ihr Empfang wirkt, entscheiden Sie: '
                                              'repräsentativ im Anzug für die '
                                              'Unternehmenszentrale, erkennbar als Sicherheit am '
                                              'Industriestandort, oder die Mischung aus beidem. '
                                              'FRANKONIA stellt Kräfte, die zu Ihrem Haus '
                                              'passen: gepflegtes Auftreten, sichere '
                                              'Umgangsformen, gutes Deutsch, auf Wunsch Englisch '
                                              'für internationale Gäste.',
                                              'Personalauswahl mit Ihrer Mitsprache — Sie lernen '
                                              'Ihre Empfangskräfte vor dem Start kennen',
                                              'Outfit nach Ihrem Standard: Anzug, '
                                              'Unternehmens-Look oder Sicherheitsmontur',
                                              'Regelmäßige Schulungen: Umgangsformen, '
                                              'Deeskalation, Notfallverhalten']},
                                 5: {'name': 'Anwendungsfälle',
                                     'h2': 'Wo der FRANKONIA Empfangsdienst im Einsatz ist',
                                     'body': ['Unternehmenszentralen & Bürostandorte: '
                                              'Repräsentativer Empfang mit Besuchermanagement '
                                              'und dezenter Sicherheitsfunktion.',
                                              'Industrie & Produktion: Pfortendienst mit '
                                              'Lieferverkehr, Fremdfirmen-Koordination und '
                                              'Ausweiswesen, die Schnittstelle zum Werkschutz.',
                                              'Kliniken & öffentliche Einrichtungen: Empfang mit '
                                              'Zutrittssteuerung und geschultem Umgang mit '
                                              'schwierigen Situationen.',
                                              'Immobilien & Bürokomplexe: Ein Empfang für '
                                              'mehrere Mieter — Kostenteilung inklusive '
                                              'professionellem Auftritt für alle.']},
                                 6: {'name': 'Kosten',
                                     'h2': 'Was kostet ein Empfangsdienst?',
                                     'hinweis': 'Rechnen Sie den Empfangsdienst gegen die '
                                                'interne Alternative: Eine eigene Empfangsstelle '
                                                'kostet mit Vertretung, Ausfällen und '
                                                'Führungsaufwand meist mehr, und ist im '
                                                'Ernstfall nicht sicherheitsgeschult.',
                                     'preis_box': 'IHRE PREISSPANNE 26–32 €/Std. (netto, je nach '
                                                  'Profil und Zeiten) · Personalauswahl mit '
                                                  'Ihrer Mitsprache · Angebot in 1 Werktag · '
                                                  'CTA: Unverbindliches Angebot einholen',
                                     'body': ['Empfangs- und Pfortendienst kostet in der Regel '
                                              'zwischen 25 und 38 Euro pro Stunde, abhängig von '
                                              'Anforderungsprofil und Besetzungszeiten. Die '
                                              'Faktoren:',
                                              'Anforderungsprofil: reiner Empfang, Pforte mit '
                                              'Sicherheitsaufgaben oder repräsentativer '
                                              'Konzern-Empfang',
                                              'Sprachanforderungen und Zusatzqualifikationen',
                                              'Besetzungszeiten: Bürozeiten, Schichtbetrieb oder '
                                              '24/7-Pforte',
                                              'Zusatzaufgaben: Telefonzentrale, Post, '
                                              'Ausweiswesen']},
                                 7: {'name': 'Trust',
                                     'h2': 'Ihr Empfang in verantwortungsvollen Händen',
                                     'body': ['Ihre Empfangskräfte sehen, wer kommt und geht, '
                                              'hören Interna und vertreten Ihr Haus nach außen. '
                                              'Deshalb: feste Stammkräfte, dokumentierte '
                                              'Einarbeitung, Verschwiegenheitsverpflichtung, im '
                                              'zertifizierten FRANKONIA System (DIN 77200-1, ISO '
                                              '9001, DEKRA-geprüft). Unter anderem vertrauen die '
                                              'Sozialstiftung Bamberg und Unternehmen der Region '
                                              'auf FRANKONIA am Empfang.']},
                                 8: {'name': 'FAQ',
                                     'h2': 'Empfangsdienst: die häufigsten Fragen',
                                     'body': ['Was kostet ein Empfangsdienst pro Stunde? In der '
                                              'Regel 26 bis 32 Euro pro Stunde, abhängig von '
                                              'Anforderungsprofil, Sprachen und '
                                              'Besetzungszeiten. Eine 24/7-Pforte wird '
                                              'individuell kalkuliert — Ihr Angebot erhalten Sie '
                                              'innerhalb eines Werktages.',
                                              'Was ist der Unterschied zwischen Empfangsdienst '
                                              'und Pfortendienst? Der Empfangsdienst ist auf '
                                              'Besucher und Repräsentation ausgerichtet '
                                              '(Zentrale, Bürostandort), der Pfortendienst auf '
                                              'Zufahrt, Lieferverkehr und Werksicherheit '
                                              '(Industriestandort). FRANKONIA besetzt beide '
                                              'Profile, auch kombiniert, etwa Empfang tagsüber '
                                              'und Pforten-Funktion in Randzeiten.',
                                              'Können wir bei der Personalauswahl '
                                              'mitentscheiden? Ja, das ist bei FRANKONIA '
                                              'Standard: Sie definieren das Anforderungsprofil, '
                                              'lernen die vorgesehenen Stammkräfte kennen und '
                                              'geben Ihr Okay vor dem Start. Outfit und '
                                              'Umgangston legen Sie fest.',
                                              'Was passiert bei Urlaub oder Krankheit unserer '
                                              'Empfangskraft? Die Vertretung kommt aus dem '
                                              'eingearbeiteten FRANKONIA Stamm, nach derselben '
                                              'Checkliste eingewiesen wie Ihre Stammkraft. Die '
                                              'Besetzung ist vertraglich zugesichert, nicht '
                                              '„nach Verfügbarkeit".',
                                              'Sind Empfangskräfte auch Sicherheitskräfte? Ja, '
                                              'alle FRANKONIA Empfangskräfte sind mindestens '
                                              'IHK-qualifiziert nach § 34a GewO und '
                                              'deeskalations-geschult. Im Normalbetrieb merkt '
                                              'man davon nur die souveränen Umgangsformen, im '
                                              'Ernstfall den Unterschied.']},
                                 9: {'name': 'Abschluss-CTA + verwandte Seiten',
                                     'h2': 'Jetzt Empfangsdienst anfragen — Profil definieren, '
                                           'Angebot erhalten',
                                     'related': 'Werkschutz → /werkschutz/ · Objektschutz → '
                                                '/objektschutz/ · Kaufhausdetektei → '
                                                '/kaufhausdetektei/',
                                     'body': ['Beschreiben Sie kurz Standort und Aufgabenprofil, '
                                              'unsere Experten melden sich innerhalb eines '
                                              'Werktages. Formulartitel: Ihre '
                                              'Empfangsdienst-Anfrage',
                                              'In Ihrer Stadt: Sicherheitsdienst Nürnberg → '
                                              '/sicherheitsdienst-nuernberg/ · Bamberg → '
                                              '/sicherheitsdienst-bamberg/ · Erlangen → '
                                              '/sicherheitsdienst-erlangen/']}}},
 'interventionsdienst': {'meta': {'URL': 'URL: /interventionsdienst/',
                                  'Title': 'Title (57 Zeichen): Interventionsdienst Franken | '
                                           'Alarmverfolgung – FRANKONIA',
                                  'Meta-Description': 'Meta-Description (144 Zeichen): '
                                                      'Interventionsdienst mit Alarmverfolgung: '
                                                      'qualifizierte Interventionskräfte '
                                                      'reagieren auf Ihre Alarmanlage, '
                                                      'dokumentiert, im Umkreis von Bamberg.',
                                  'Primär-Keyword': 'Primär-Keyword: interventionsdienst (110) · '
                                                    'Unterstützend: interventionskraft (210), '
                                                    'alarmverfolgung, alarmintervention, '
                                                    'nma-aufschaltung',
                                  'Schema': 'Schema: Service + FAQPage + BreadcrumbList',
                                  'Interne Links': 'Interne Links: /sicherheitstechnik/ · '
                                                   '/revier-schliessdienst/ · /objektschutz/ · '
                                                   'Stadtseiten · Autoritätslinks: DIN VDE 0833 '
                                                   '/ VdS 2172 (Interventionsattest, im Text als '
                                                   'Norm-Verweis), § 34a GewO'},
                         'sections': {1: {'name': 'Hero',
                                          'badge': 'Alarm ist bei uns keine Nachricht, sondern '
                                                   'ein Einsatz',
                                          'h1': 'Interventionsdienst: Wenn Ihre Alarmanlage '
                                                'auslöst, fährt jemand hin',
                                          'subline': 'Ihre Alarmanlage meldet, unsere '
                                                     'Interventionskraft fährt hin: Kontrolle, '
                                                     'Erstmaßnahmen, Dokumentation.',
                                          'body': ['Qualifizierte Interventionskräfte nach § 34a '
                                                   'GewO',
                                                   'Definierte Reaktionszeiten im Einsatzgebiet '
                                                   'rund um Bamberg',
                                                   'Jeder Einsatz dokumentiert, für Sie, Polizei '
                                                   'und Versicherung']},
                                      2: {'name': 'Das Problem (kompakt)',
                                          'h2': 'Bei einem Alarm um 3 Uhr zählt nur, wer '
                                                'wirklich hinfährt',
                                          'body': ['Ein Einbruchalarm nachts läuft ins Leere, '
                                                   'wenn niemand definiert ist, der hinfährt: '
                                                   'Der Geschäftsführer schläft, der Hausmeister '
                                                   'ist im Urlaub, die Polizei fährt bei '
                                                   'unbestätigten Alarmen oft nicht mehr an. '
                                                   'Genau diese Lücke schließt der '
                                                   'Interventionsdienst, mit einer Kraft, die '
                                                   'vertraglich reagieren muss und es '
                                                   'dokumentiert tut.',
                                                   'Ohne Intervention: Alarm → SMS an den Chef → '
                                                   'Fehlalarm-Unsicherheit → keiner fährt → im '
                                                   'Ernstfall stundenlang unbemerkter Schaden.',
                                                   'Mit FRANKONIA Intervention: Alarm → '
                                                   'Interventionskraft fährt an → prüft, '
                                                   'sichert, meldet → dokumentierter Abschluss. '
                                                   'Jedes Mal.']},
                                      3: {'name': 'So läuft eine Intervention (Kernsektion)',
                                          'h2': 'Von der Alarmauslösung bis zum dokumentierten '
                                                'Abschluss',
                                          'body': ['1 Alarmeingang: Ihre Alarmanlage meldet an '
                                                   'die Notruf- und Serviceleitstelle (NSL) oder '
                                                   'direkt in die FRANKONIA Meldekette, die '
                                                   'Aufschaltung richten wir mit Ihrem Errichter '
                                                   'ein.',
                                                   '2 Anfahrt: Die Interventionskraft fährt Ihr '
                                                   'Objekt an, im vereinbarten Reaktionsfenster, '
                                                   'mit Objektunterlagen und Schlüsselgewalt '
                                                   'nach Ihrer Freigabe.',
                                                   '3 Außen- und Innenkontrolle: Kontrolle nach '
                                                   'Interventionsplan: Außenhaut, Zugänge, bei '
                                                   'Befund Innenkontrolle, besonnen und nach '
                                                   'klaren Regeln.',
                                                   '4 Erstmaßnahmen: Bei Einbruch: Polizei, '
                                                   'Spurenschutz, provisorische Sicherung, '
                                                   'Benachrichtigung nach Meldekette. Bei '
                                                   'Fehlalarm: Ursache dokumentieren, Anlage '
                                                   'rückstellen.',
                                                   '5 Dokumentation: Sie erhalten den '
                                                   'Einsatzbericht mit Zeiten, Feststellungen '
                                                   'und Fotos, verwertbar für Polizei und '
                                                   'Versicherung.']},
                                      4: {'name': 'Leistungsumfang',
                                          'h2': 'Das ist im FRANKONIA Interventionsdienst '
                                                'enthalten',
                                          'body': ['Alarmverfolgung rund um die Uhr: '
                                                   '24/7-Interventionsbereitschaft für '
                                                   'Einbruch-, Überfall- und technische Alarme.',
                                                   'Schlüsselverwahrung: Gesicherte Verwahrung '
                                                   'Ihrer Objektschlüssel mit dokumentierter '
                                                   'Ausgabe — Voraussetzung für die '
                                                   'Innenkontrolle.',
                                                   'Interventionsplan je Objekt: Anfahrt, '
                                                   'Kontrollpunkte, Meldekette und '
                                                   'Verhaltensregeln werden vor Aufschaltung '
                                                   'schriftlich festgelegt.',
                                                   'Fehlalarm-Management: Ursachen-Dokumentation '
                                                   'und Rückmeldung an Ihren Errichter, damit '
                                                   'Fehlalarme seltener statt teurer werden.',
                                                   'Kombination mit Revierdienst (Raum Bamberg): '
                                                   'Wer ohnehin im Revier fährt, ist im '
                                                   'Alarmfall schneller da, die '
                                                   'wirtschaftlichste Variante im Bamberger '
                                                   'Kernrevier. → /revier-schliessdienst/',
                                                   'Norm-Konformität: Intervention nach den '
                                                   'einschlägigen Vorgaben (u. a. '
                                                   'VdS-Richtlinien für Interventionsdienste), '
                                                   'wo Ihr Versicherer sie fordert.']},
                                      5: {'name': 'Kosten',
                                          'h2': 'Was kostet ein Interventionsdienst?',
                                          'preis_box': 'Bereitschaftspauschale + '
                                                       'Einsatzpauschale (netto) · '
                                                       'Interventionsplan inklusive · Angebot in '
                                                       '1 Werktag · CTA: Unverbindliches Angebot '
                                                       'einholen',
                                          'body': ['Der Interventionsdienst besteht aus zwei '
                                                   'Komponenten: einer monatlichen '
                                                   'Bereitschaftspauschale (abhängig von '
                                                   'Objektlage und Reaktionszeit) und einer '
                                                   'Einsatzpauschale je tatsächlicher '
                                                   'Intervention. Für die meisten Gewerbeobjekte '
                                                   'liegt die Bereitschaft bei einem '
                                                   'überschaubaren zweistelligen bis niedrigen '
                                                   'dreistelligen Monatsbetrag, deutlich unter '
                                                   'jeder personellen Alternative.',
                                                   'Objektlage und vereinbartes Reaktionsfenster',
                                                   'Umfang: nur Außenkontrolle oder '
                                                   'Innenkontrolle mit Schlüsselgewalt',
                                                   'Alarmaufkommen (Fehlalarm-Quote Ihrer '
                                                   'Anlage)',
                                                   'Kombination mit Revierdienst oder '
                                                   'NSL-Aufschaltung']},
                                      6: {'name': 'Trust',
                                          'h2': 'Verlässlichkeit, die Ihr Versicherer anerkennt',
                                          'body': ['FRANKONIA arbeitet nach dokumentierten '
                                                   'Interventionsplänen im zertifizierten System '
                                                   '(DIN 77200-1, ISO 9001, DEKRA-geprüft), mit '
                                                   'qualifizierten Kräften nach § 34a GewO und '
                                                   'einer Einsatzleitung, die rund um die Uhr '
                                                   'erreichbar ist. Einsatzberichte sind '
                                                   'polizei- und versicherungstauglich.']},
                                      7: {'name': 'FAQ',
                                          'h2': 'Interventionsdienst: die häufigsten Fragen',
                                          'body': ['Was kostet Alarmverfolgung im Monat? Die '
                                                   'Bereitschaftspauschale liegt für die meisten '
                                                   'Gewerbeobjekte im überschaubaren '
                                                   'zweistelligen bis niedrigen dreistelligen '
                                                   'Monatsbereich, dazu kommt eine '
                                                   'Einsatzpauschale je tatsächlicher Anfahrt. '
                                                   'Ihr konkretes Angebot erhalten Sie innerhalb '
                                                   'eines Werktages.',
                                                   'Wie schnell ist die Interventionskraft vor '
                                                   'Ort? Das Reaktionsfenster wird je Objekt '
                                                   'vereinbart und hängt von der Lage im '
                                                   'Einsatzgebiet ab, im Kernrevier rund um '
                                                   'Bamberg entsprechend kurz. Verbindliche '
                                                   'Zeiten stehen im Interventionsplan, den Sie '
                                                   'vor Vertragsbeginn erhalten.',
                                                   'Braucht der Interventionsdienst meine '
                                                   'Schlüssel? Für die Innenkontrolle ja, die '
                                                   'Schlüssel werden versiegelt und dokumentiert '
                                                   'verwahrt, die Ausgabe wird protokolliert. '
                                                   'Ohne Schlüsselgewalt bleibt es bei der '
                                                   'Außenkontrolle mit Meldung an Sie.',
                                                   'Arbeitet FRANKONIA mit meiner bestehenden '
                                                   'Alarmanlage? Ja. Die Aufschaltung richten '
                                                   'wir gemeinsam mit Ihrem Errichter oder Ihrer '
                                                   'Leitstelle ein, unabhängig vom Hersteller. '
                                                   'Falls Ihre Anlage häufig Fehlalarme '
                                                   'produziert, dokumentieren wir die Ursachen '
                                                   'für die Optimierung. → /sicherheitstechnik/',
                                                   'Fährt die Polizei nicht sowieso bei Alarm? '
                                                   'Bei unbestätigten Alarmen privater Anlagen '
                                                   'in der Regel nicht, zu viele Fehlalarme. '
                                                   'Deshalb fordern viele Versicherer eine '
                                                   'qualifizierte Intervention: Erst die '
                                                   'bestätigte Feststellung vor Ort löst den '
                                                   'Polizeieinsatz aus.']},
                                      8: {'name': 'Abschluss-CTA + verwandte Seiten',
                                          'h2': 'Jetzt Interventionsdienst anfragen — Alarmkette '
                                                'schließen',
                                          'related': 'Sicherheitstechnik → /sicherheitstechnik/ '
                                                     '· Revier- & Schließdienst → '
                                                     '/revier-schliessdienst/ · Objektschutz → '
                                                     '/objektschutz/',
                                          'body': ['Nennen Sie uns Objekt und Alarmanlagen-Typ, '
                                                   'wir erstellen Interventionsplan und Angebot '
                                                   'innerhalb eines Werktages. Formulartitel: '
                                                   'Ihre Interventions-Anfrage',
                                                   'In Ihrer Region: Sicherheitsdienst Bamberg → '
                                                   '/sicherheitsdienst-bamberg/ · Nürnberg → '
                                                   '/sicherheitsdienst-nuernberg/ · Erlangen → '
                                                   '/sicherheitsdienst-erlangen/']}}}}
