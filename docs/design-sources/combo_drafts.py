#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
THE FIFTEEN REMAINING COMBO DRAFTS, VERBATIM — data only, no markup, no logic.

Extracted ONCE, mechanically, from NewVersionCopiesFrankonia/"2026-08-04 Webtext
NN Kombi <Leistung> <Stadt>.docx" (Stand 25.07.2026) and checked in here.
Nothing in this file was re-typed by hand, which is the entire point: these pages
are the client's copy and a transcription slip is invisible in a screenshot.

⚠️ THE .docx FILES ARE NOT IN GIT (CLAUDE.md). This file is therefore the only
version-controlled copy of these fifteen drafts' text. Do not "tidy" the German.

/brandwache-nuernberg/ (Webtext 34) is NOT here: it was hand-built on 2026-08-09
as the type's first page and has been edited by the client several times since.

Shape, per page slug:
  docx      the source filename, so any line can be traced back
  meta      the draft's own Seiten-Meta lines, unparsed, for reference
  sections  {draft section number: {...}}

Within a section, the lines the DRAFT ITSELF labels are lifted out by name —
badge, h1, h2, subline, cta, hinweis_box, related, form_title — and everything
else stays in `body`, IN SOURCE ORDER.

⚠️ `body` IS DELIBERATELY NOT PRE-SPLIT INTO "intro paragraphs" AND "list items".
That is the correction service_drafts.py already paid for: German prose is full
of colons, so "Ob die Nachtkontrolle wirklich lief, sehen Sie bei FRANKONIA nicht
erst nach dem Einbruch: Checkpoints belegen jede Runde …" parses exactly like a
"Label: text" list row. No length, word-count or capitalisation heuristic
separates the two reliably. So the split is DECLARED per section in
combo_pages_data.py (`prose: N`), where it is one visible number the generator
asserts against, instead of a guess spread across fifteen pages.

The "Stand:" and "Aufbau:" lines are dropped: they describe the intended layout
to a designer, they are not copy.

WHICH of these lands in WHICH block is not decided here — that is
combo_pages_data.py. This file is just the words.
"""

DRAFTS = {'objektschutz-nuernberg': {'docx': '2026-08-04 Webtext 35 Kombi Objektschutz Nuernberg.docx',
                            'meta': {'URL': 'URL: /objektschutz-nuernberg/',
                                     'Title': 'Title (59 Zeichen): Objektschutz Nürnberg | Ihr '
                                              'Objekt 24/7 bewacht – FRANKONIA',
                                     'Meta-Description': 'Meta-Description (149 Zeichen): '
                                                         'Objektschutz in Nürnberg: '
                                                         'Bestreifung, Zugangskontrolle & '
                                                         'Alarmverfolgung für Gewerbe, '
                                                         'Logistik & Büro. DEKRA-zertifiziert, '
                                                         'Angebot in einem Werktag.',
                                     'Schema': 'Schema: Service (areaServed Nürnberg) + '
                                               'FAQPage + BreadcrumbList',
                                     'Interne Links': 'Interne Links: /objektschutz/ '
                                                      '(Leistung) · '
                                                      '/sicherheitsdienst-nuernberg/ (Stadt) · '
                                                      '/sicherheitstechnik/ · /angebot/'},
                            'sections': {1: {'name': 'Hero',
                                             'body': ['IHK-qualifizierte Kräfte nach § 34a '
                                                      'GewO, DEKRA-zertifiziertes System',
                                                      'Digitales Wachbuch: Sie sehen, was auf '
                                                      'Ihrem Objekt passiert',
                                                      'Unverbindliches Angebot innerhalb eines '
                                                      'Werktages'],
                                             'badge': 'Einsatzgebiet Nürnberg, feste Teams '
                                                      'direkt im Objekt',
                                             'h1': 'Objektschutz Nürnberg',
                                             'subline': 'Bestreifung, Zugangskontrolle und '
                                                        'Alarmverfolgung für Ihr Nürnberger '
                                                        'Objekt, dokumentiert, zertifiziert, '
                                                        'mit festem Ansprechpartner.',
                                             'cta': 'Unverbindliches Angebot einholen · CTA '
                                                    'sekundär: +49 951 964352-0'},
                                         2: {'name': 'Objekt-Typen in Nürnberg (Eigencontent)',
                                             'body': ['Logistikhallen und Lager: Hohe '
                                                      'Warenwerte und durchgehender '
                                                      'Lieferverkehr rund um Hafen und '
                                                      'Gewerbegürtel — Zufahrtskontrolle und '
                                                      'dokumentierte Rundgänge sind hier '
                                                      'Versicherungs-Grundlage.',
                                                      'Büro- und Verwaltungsgebäude: Schutz '
                                                      'für Mitarbeitende, IT und Unterlagen, '
                                                      'plus professioneller Auftritt am '
                                                      'Empfang. Nachts sichern '
                                                      'Verschlusskonzepte und Alarmverfolgung.',
                                                      'Handels- und Publikumsobjekte: Märkte, '
                                                      'Filialen und Einrichtungen mit '
                                                      'Kundenverkehr, sichtbare Präsenz, die '
                                                      'Kunden beruhigt und Täter abschreckt.',
                                                      'Öffentliche Einrichtungen: '
                                                      'Dokumentierte, vergabetaugliche '
                                                      'Prozesse — FRANKONIA schützt '
                                                      'Einrichtungen der öffentlichen Hand in '
                                                      'ganz Franken.'],
                                             'h2': 'Diese Nürnberger Objekte schützt '
                                                   'FRANKONIA'},
                                         3: {'name': 'Was drinsteckt (kompakt, anders '
                                                     'gruppiert als Hauptseite)',
                                             'body': ['Präsenz: Feste Posten oder '
                                                      'Kontrollgänge, nach Konzept statt nach '
                                                      'Schema. · Kontrolle: Zugangs- und '
                                                      'Ausweisprüfung, Besucher- und '
                                                      'Lieferverkehr. · Reaktion: '
                                                      'Alarmverfolgung und Erstmaßnahmen mit '
                                                      'definierter Meldekette. · Nachweis: '
                                                      'Digitales Wachbuch, Checkpoint-System, '
                                                      'regelmäßiger Report.'],
                                             'h2': 'Objektschutz in Nürnberg: die Bausteine',
                                             'hinweis_box': 'Wo Technik Personalstunden spart, '
                                                            'planen wir sie ins Konzept ein — '
                                                            'Videoüberwachung und Alarmtechnik '
                                                            'aus einer Hand. → '
                                                            '/sicherheitstechnik/'},
                                         4: {'name': 'Das Risiko in Zahlen (kompakt)',
                                             'body': ['Ein einziger Einbruch kostet mit '
                                                      'Betriebsunterbrechung und '
                                                      'Versicherungsärger oft mehr als ein '
                                                      'ganzes Jahr professioneller Bewachung. '
                                                      'Dazu kommt das leise Risiko: Diebstahl '
                                                      'über unkontrollierten Lieferverkehr, '
                                                      'Vandalismus an Fassaden, unbemerkte '
                                                      'Schwelbrände außerhalb der '
                                                      'Geschäftszeiten. Objektschutz ist '
                                                      'Prävention, und im Ernstfall Ihr '
                                                      'dokumentierter Nachweis gegenüber der '
                                                      'Versicherung.'],
                                             'h2': 'Was ein unbewachtes Objekt in Nürnberg '
                                                   'kostet'},
                                         5: {'name': 'In 4 Schritten zum bewachten Objekt',
                                             'body': ['1 Kostenfreie Begehung: Zugänge, '
                                                      'Risiken, vorhandene Technik, bewertet '
                                                      'von Sicherheitsexperten.',
                                                      '2 Sicherheitskonzept: Besetzung, '
                                                      'Zeiten, Technik-Empfehlung, schriftlich '
                                                      'und kostenfrei. → /sicherheitskonzept/',
                                                      '3 Angebot in 1 Werktag: Transparent '
                                                      'kalkuliert, ohne versteckte Posten.',
                                                      '4 Start mit festem Team: Nach '
                                                      'Checkliste eingearbeitet, dokumentiert '
                                                      'vom ersten Rundgang an.'],
                                             'h2': 'So starten Sie den Objektschutz in '
                                                   'Nürnberg'},
                                         6: {'name': 'Kosten',
                                             'body': ['Objektschutz kostet in Nürnberg in der '
                                                      'Regel 26 bis 32 Euro pro Stunde netto, '
                                                      'je nach Qualifikation, Einsatzzeit und '
                                                      'Umfang. Vor dem Angebot steht die '
                                                      'kostenfreie Begehung Ihres Objekts; das '
                                                      'Angebot selbst kommt innerhalb eines '
                                                      'Werktages.'],
                                             'h2': 'Was kostet Objektschutz in Nürnberg?'},
                                         7: {'name': 'FAQ (6 Fragen)',
                                             'body': ['Wie startet der Objektschutz für mein '
                                                      'Nürnberger Objekt? Mit einer '
                                                      'kostenfreien Begehung: Unsere Experten '
                                                      'bewerten Zugänge, Risiken und '
                                                      'vorhandene Technik, danach erhalten Sie '
                                                      'Konzept und unverbindliches Angebot '
                                                      'innerhalb eines Werktages.',
                                                      'Sind die Kräfte fest meinem Objekt '
                                                      'zugeordnet? Ja, feste Stammkräfte, nach '
                                                      'Checkliste in Ihr Objekt eingearbeitet, '
                                                      'mit Mitsprache bei der Personalauswahl. '
                                                      'Kein ständiger Wechsel.',
                                                      'Was kostet Objektschutz in Nürnberg pro '
                                                      'Monat? Je nach Besetzung: Ein einzelner '
                                                      'Nachtposten an Werktagen liegt '
                                                      'inklusive Nachtzuschlag grob bei '
                                                      '5.500–6.800 Euro netto monatlich. '
                                                      'Wirtschaftlicher wird es oft durch '
                                                      'Technik-Kombination. Die Begehung '
                                                      'rechnet beide Varianten für Sie durch.',
                                                      'Kann ich Objektschutz mit '
                                                      'Sicherheitstechnik kombinieren? Ja, das '
                                                      'ist meist die wirtschaftlichste Lösung: '
                                                      'Videoüberwachung und Alarmtechnik '
                                                      'ersetzen Personalstunden, wo Präsenz '
                                                      'nicht nötig ist. Die Kombination wird '
                                                      'im kostenfreien Sicherheitskonzept '
                                                      'durchgerechnet.',
                                                      'Woher weiß ich, dass die Rundgänge '
                                                      'wirklich laufen? Durch das '
                                                      'Wächterkontrollsystem: Checkpoints an '
                                                      'Ihrem Objekt werden je Runde gescannt '
                                                      'und mit Zeitstempel im Report '
                                                      'ausgewiesen — Sie prüfen es jederzeit '
                                                      'nach.',
                                                      'Bietet FRANKONIA in Nürnberg weitere '
                                                      'Leistungen an? Ja — Werkschutz, '
                                                      'Brandwache, Baustellenbewachung und '
                                                      'mehr: → /sicherheitsdienst-nuernberg/'],
                                             'h2': 'Objektschutz Nürnberg: die häufigsten '
                                                   'Fragen'},
                                         8: {'name': 'Abschluss-CTA',
                                             'body': ['Kurz das Objekt beschreiben, '
                                                      'kostenfreie Begehung, Angebot in einem '
                                                      'Werktag.'],
                                             'h2': 'Jetzt Objektschutz für Nürnberg anfragen',
                                             'form_title': 'Ihre Objektschutz-Anfrage Nürnberg',
                                             'related': 'Alles zum Objektschutz → '
                                                        '/objektschutz/ · Sicherheitsdienst '
                                                        'Nürnberg → '
                                                        '/sicherheitsdienst-nuernberg/'}}},
 'werkschutz-nuernberg': {'docx': '2026-08-04 Webtext 36 Kombi Werkschutz Nuernberg.docx',
                          'meta': {'URL': 'URL: /werkschutz-nuernberg/',
                                   'Title': 'Title (55 Zeichen): Werkschutz Nürnberg | '
                                            'Industrie-Schutz 24/7 – FRANKONIA',
                                   'Meta-Description': 'Meta-Description (152 Zeichen): '
                                                       'Werkschutz für Nürnberger Industrie: '
                                                       'Pforte, Rundgänge & Anlagen-Bedienung '
                                                       'durch technik-geschulte Kräfte. '
                                                       'DEKRA-zertifiziert, Angebot in einem '
                                                       'Werktag.',
                                   'Schema': 'Schema: Service (areaServed Nürnberg) + FAQPage '
                                             '+ BreadcrumbList',
                                   'Interne Links': 'Interne Links: /werkschutz/ (Leistung) · '
                                                    '/sicherheitsdienst-nuernberg/ (Stadt) · '
                                                    '/empfangsdienst/ · /angebot/'},
                          'sections': {1: {'name': 'Hero',
                                           'body': ['Pforte und Torkontrolle, die den Betrieb '
                                                    'nicht aufhält',
                                                    'Anlagen-Bedienung: BMA, EMA und Zutritt '
                                                    'sachgemäß geführt',
                                                    'Fester Ansprechpartner, 24/7 direkt '
                                                    'erreichbar'],
                                           'badge': 'Einsatzgebiet Großraum Nürnberg — '
                                                    'Werkschutz im Schichtbetrieb',
                                           'h1': 'Werkschutz Nürnberg',
                                           'subline': 'Pfortendienst, Rundgänge und '
                                                      'Anlagen-Bedienung für Industrie und '
                                                      'Produktion im Großraum Nürnberg, durch '
                                                      'technik-geschulte, IHK-qualifizierte '
                                                      'Kräfte.',
                                           'cta': 'Unverbindliches Angebot einholen · CTA '
                                                  'sekundär: +49 951 964352-0'},
                                       2: {'name': 'Warum Werkschutz im Großraum Nürnberg '
                                                   '(Eigencontent)',
                                           'body': ['Der Großraum Nürnberg gehört zu den '
                                                    'größten Industrie- und Logistikräumen '
                                                    'Süddeutschlands: Produktion im '
                                                    'Mehrschichtbetrieb, Zulieferer, '
                                                    'Speditionen, und Werkstore, durch die '
                                                    'täglich Hunderte Menschen und Fahrzeuge '
                                                    'gehen. Dort entscheidet sich '
                                                    'Werksicherheit: am Tor, an der Pforte, '
                                                    'beim Rundgang.',
                                                    'Am Werkstor: Kontrollierter Mitarbeiter-, '
                                                    'Besucher- und Lieferverkehr, '
                                                    'dokumentiert, ohne Staus zu produzieren.',
                                                    'In der Produktion: Rundgänge mit Blick '
                                                    'für Brandlasten, offene Zugänge und '
                                                    'technische Auffälligkeiten.',
                                                    'In sensiblen Bereichen: Zutrittssteuerung '
                                                    'für Entwicklung und Prototypen, saubere '
                                                    'Fremdfirmen-Prozesse.'],
                                           'h2': 'Industrie in Nürnberg heißt: Werte, Wissen '
                                                 'und durchgehender Verkehr'},
                                       3: {'name': 'Besetzungsmodelle',
                                           'body': ['Nicht jeder Standort braucht den '
                                                    'durchgehenden Posten: FRANKONIA besetzt '
                                                    'nach Konzept — Nacht- und '
                                                    'Wochenenddienste, Randzeiten oder '
                                                    'komplette Pforten-Funktion. Das '
                                                    'kostenfreie Sicherheitskonzept zeigt, '
                                                    'welches Modell für Ihren Nürnberger '
                                                    'Standort wirtschaftlich ist. Bei einem '
                                                    'Großkunden sparte ein neues '
                                                    'Einsatzkonzept 30 % Personalkosten, bei '
                                                    'gleicher Sicherheit.'],
                                           'h2': 'Vom Nachtdienst bis zur 24/7-Pforte in '
                                                 'Nürnberg'},
                                       4: {'name': 'Leistungsumfang kompakt',
                                           'body': ['Im laufenden Betrieb: Pforten- und '
                                                    'Empfangsdienst · Ausweis- und '
                                                    'Zutrittskontrolle · Fremdfirmen- und '
                                                    'Lieferverkehr-Koordination · '
                                                    'Kontrollgänge durch Produktion und Lager',
                                                    'In Randzeiten: Verschluss- und '
                                                    'Kontrollrunden · Bedienung von '
                                                    'Brandmelde-, Alarm- und Zutrittsanlagen · '
                                                    'Notfall-Erstmaßnahmen nach Ihrem '
                                                    'Meldeplan',
                                                    'Inklusive: Digitales Wachbuch und Torbuch '
                                                    '· regelmäßiger Report für Ihre '
                                                    'Geschäftsführung · fester, 24/7 '
                                                    'erreichbarer Ansprechpartner'],
                                           'h2': 'Das übernimmt der FRANKONIA Werkschutz an '
                                                 'Ihrem Nürnberger Standort'},
                                       5: {'name': 'Kosten',
                                           'body': ['Werkschutz kostet im Großraum Nürnberg in '
                                                    'der Regel 26 bis 32 Euro pro Stunde '
                                                    'netto, technik-geschulte Kräfte und '
                                                    'Zusatzqualifikationen am oberen Ende, '
                                                    'tarifliche Zuschläge für Nacht und '
                                                    'Wochenende kommen hinzu. Ein 24/7-Posten '
                                                    'wird individuell kalkuliert; das Angebot '
                                                    'erhalten Sie innerhalb eines Werktages '
                                                    'nach der Begehung.'],
                                           'h2': 'Was kostet Werkschutz in Nürnberg?'},
                                       6: {'name': 'FAQ (6 Fragen)',
                                           'body': ['Können die Kräfte unsere Anlagen '
                                                    'bedienen? Ja, alle Werkschutzkräfte sind '
                                                    'technik-geschult und werden nach '
                                                    'Checkliste in Ihre Brandmelde-, Alarm- '
                                                    'und Zutrittsanlagen eingearbeitet. Die '
                                                    'Einarbeitung wird dokumentiert.',
                                                    'Muss ich gleich eine 24/7-Pforte '
                                                    'beauftragen? Nein, auch reine Nacht-, '
                                                    'Wochenend- oder Randzeiten-Modelle sind '
                                                    'möglich. Welche Besetzung sich für Ihren '
                                                    'Standort rechnet, ergibt die kostenfreie '
                                                    'Begehung.',
                                                    'Wie schnell kann der Werkschutz in '
                                                    'Nürnberg starten? Oft blitzschnell: In '
                                                    'dringenden Fällen haben wir Standorte '
                                                    'schon am selben Tag besetzt. Rufen Sie '
                                                    'an, die Einsatzleitung plant direkt mit '
                                                    'Ihnen: +49 951 964352-0.',
                                                    'Wie läuft die Fremdfirmen-Koordination am '
                                                    'Werkstor? Nach Ihren Vorgaben: Anmeldung, '
                                                    'Unterweisungs-Check, Ausweisvergabe und '
                                                    'dokumentierte Ein-/Ausfahrten, damit Sie '
                                                    'jederzeit wissen, wer auf dem Gelände '
                                                    'ist.',
                                                    'Was ist der Unterschied zwischen '
                                                    'Werkschutz und Objektschutz? Werkschutz '
                                                    'ist die spezialisierte Form für '
                                                    'Produktionsstandorte: mit Pforte und '
                                                    'Anlagen-Bedienung. Für Büro-, Logistik- '
                                                    'und Gewerbeobjekte ohne laufende '
                                                    'Produktion: → /objektschutz-nuernberg/',
                                                    'Was bietet FRANKONIA in Nürnberg noch an? '
                                                    'Objektschutz, Brandwache, '
                                                    'Baustellenbewachung und mehr: → '
                                                    '/sicherheitsdienst-nuernberg/'],
                                           'h2': 'Werkschutz Nürnberg: die häufigsten Fragen'},
                                       7: {'name': 'Abschluss-CTA',
                                           'body': ['Standort und Schichtzeiten kurz '
                                                    'beschreiben — Begehung kostenfrei, '
                                                    'Angebot in einem Werktag.'],
                                           'h2': 'Jetzt Werkschutz für Nürnberg anfragen',
                                           'form_title': 'Ihre Werkschutz-Anfrage Nürnberg',
                                           'related': 'Alles zum Werkschutz → /werkschutz/ · '
                                                      'Sicherheitsdienst Nürnberg → '
                                                      '/sicherheitsdienst-nuernberg/'}}},
 'baustellenbewachung-nuernberg': {'docx': '2026-08-04 Webtext 37 Kombi Baustellenbewachung '
                                           'Nuernberg.docx',
                                   'meta': {'URL': 'URL: /baustellenbewachung-nuernberg/',
                                            'Title': 'Title (54 Zeichen): Baustellenbewachung '
                                                     'Nürnberg | Schutz 24/7 – FRANKONIA',
                                            'Meta-Description': 'Meta-Description (143 '
                                                                'Zeichen): Baustellenbewachung '
                                                                'in Nürnberg: Schutz vor '
                                                                'Diebstahl & Vandalismus, '
                                                                'feste Teams, Konzepte je '
                                                                'Bauphase, dokumentiert. '
                                                                'Angebot in einem Werktag.',
                                            'Schema': 'Schema: Service (areaServed Nürnberg) + '
                                                      'FAQPage + BreadcrumbList',
                                            'Interne Links': 'Interne Links: '
                                                             '/baustellenbewachung/ (Leistung) '
                                                             '· /sicherheitsdienst-nuernberg/ '
                                                             '(Stadt) · /brandwache-nuernberg/ '
                                                             '· /angebot/'},
                                   'sections': {1: {'name': 'Hero',
                                                    'body': ['Nacht- und Wochenendbewachung '
                                                             'oder Kontrollen zu variierenden '
                                                             'Zeiten',
                                                             'Zufahrtskontrolle für '
                                                             'Lieferverkehr und Subunternehmer',
                                                             'Dokumentation für Bauherren, '
                                                             'Partnerfirmen und Versicherung'],
                                                    'badge': 'Einsatzgebiet Nürnberg — '
                                                             'Bewachung, die dem Bau folgt',
                                                    'h1': 'Baustellenbewachung Nürnberg',
                                                    'subline': 'Maschinen, Kraftstoff und '
                                                               'Material auf Nürnberger '
                                                               'Baustellen sind nachts '
                                                               'unbewacht Hunderttausende wert '
                                                               '— FRANKONIA schützt mit '
                                                               'Konzepten je Bauphase.',
                                                    'cta': 'Unverbindliches Angebot einholen · '
                                                           'CTA sekundär: +49 951 964352-0'},
                                                2: {'name': 'Die Nürnberger Baustellen-Lage '
                                                            '(Eigencontent)',
                                                    'body': ['Der Großraum Nürnberg baut — '
                                                             'Wohnquartiere, Gewerbeprojekte, '
                                                             'Infrastruktur. Für Täter heißt '
                                                             'das: viele Ziele, kurze Wege, '
                                                             'gute Absatzmärkte für '
                                                             'gestohlenes Gerät. Der '
                                                             'eigentliche Schaden ist selten '
                                                             'nur der Materialwert: Steht am '
                                                             'Montag die Kolonne ohne Bagger, '
                                                             'kosten Verzug und '
                                                             'Vertragsstrafen schnell mehr als '
                                                             'ein ganzer Bewachungsmonat.',
                                                             'Wohn- und Quartiersbau: '
                                                             'Innerstädtische Baustellen mit '
                                                             'offenen Zugängen — Präsenz zu '
                                                             'unvorhersehbaren Zeiten schreckt '
                                                             'ab.',
                                                             'Gewerbe- und Logistikprojekte: '
                                                             'Großgerät und hochwertige '
                                                             'Gebäudetechnik, feste '
                                                             'Nachtposten in kritischen '
                                                             'Phasen.',
                                                             'Infrastruktur: Weitläufige '
                                                             'Abschnitte, viele Zufahrten — '
                                                             'Kombination aus Kontrollen und '
                                                             'mobiler Technik.'],
                                                    'h2': 'Warum Baustellen in Nürnberg '
                                                          'bewacht werden müssen'},
                                                3: {'name': 'Konzept je Bauphase',
                                                    'body': ['Rohbau mit Großgerät braucht '
                                                             'anderen Schutz als der '
                                                             'Innenausbau: FRANKONIA '
                                                             'kalkuliert je Bauphase — Posten, '
                                                             'Kontrollen, mobile Videotechnik '
                                                             'oder die Kombination. Bei '
                                                             'Heißarbeiten stellen wir die '
                                                             'vorgeschriebene Brandwache '
                                                             'gleich mit. → '
                                                             '/brandwache-nuernberg/'],
                                                    'h2': 'Bewachung, die mit Ihrem Nürnberger '
                                                          'Projekt mitwächst'},
                                                4: {'name': 'Nachweisbar bewacht',
                                                    'body': ['Ob die Nachtkontrolle wirklich '
                                                             'lief, sehen Sie bei FRANKONIA '
                                                             'nicht erst nach dem Einbruch: '
                                                             'Checkpoints auf dem Gelände '
                                                             'belegen jede Runde technisch, '
                                                             'Feststellungen werden mit Foto '
                                                             'und Meldekette dokumentiert. Für '
                                                             'Bauherren, Partnerfirmen und '
                                                             'Versicherung heißt das: '
                                                             'Nachweise statt Behauptungen.',
                                                             'Wächterkontrollsystem: '
                                                             'Zeitstempel je Checkpoint, '
                                                             'Report je Woche',
                                                             'Zufahrtsprotokoll: Wer fährt was '
                                                             'auf und vom Gelände, '
                                                             'dokumentiert',
                                                             'Vorfall-Dokumentation: Foto, '
                                                             'Uhrzeit, Maßnahme, Meldekette'],
                                                    'h2': 'Kontrolle, die Sie nachvollziehbar '
                                                          'dokumentiert bekommen'},
                                                5: {'name': 'Kosten',
                                                    'body': ['In Nürnberg kostet '
                                                             'Baustellenbewachung in der Regel '
                                                             '26 bis 32 Euro pro Stunde netto '
                                                             '— Nacht-, Wochenend- und '
                                                             'Feiertagszuschläge nach Tarif. '
                                                             'Kalkuliert wird je Bauphase, '
                                                             'angepasst bei Bauverzug. Ihr '
                                                             'Angebot erhalten Sie innerhalb '
                                                             'eines Werktages nach der '
                                                             'kostenfreien '
                                                             'Baustellen-Begehung.'],
                                                    'h2': 'Was kostet Baustellenbewachung in '
                                                          'Nürnberg?'},
                                                6: {'name': 'FAQ (6 Fragen)',
                                                    'body': ['Wie schnell kann die Bewachung '
                                                             'starten? Nach Absprache auch '
                                                             'kurzfristig, etwa nach einem '
                                                             'Einbruch am Wochenende. Die '
                                                             'Einsatzleitung ist rund um die '
                                                             'Uhr erreichbar: +49 951 '
                                                             '964352-0.',
                                                             'Reicht ein Wochenend-Schutz für '
                                                             'meine Nürnberger Baustelle? Oft '
                                                             'ja: Die meisten Vorfälle '
                                                             'passieren nachts und am '
                                                             'Wochenende. Ob Wochenendposten, '
                                                             'tägliche Nachtkontrollen oder '
                                                             'Dauerbewachung sinnvoll ist, '
                                                             'zeigt die kostenfreie Begehung, '
                                                             'mit Kostenvergleich.',
                                                             'Passt sich das Konzept dem '
                                                             'Baufortschritt an? Ja, je '
                                                             'Bauphase wird neu kalkuliert: '
                                                             'mehr Präsenz bei Großgerät und '
                                                             'offenem Rohbau, weniger im '
                                                             'Innenausbau. Sie zahlen für den '
                                                             'Schutz, den die Phase braucht.',
                                                             'Was kostet die Bewachung über '
                                                             'ein ganzes Bauprojekt? Das hängt '
                                                             'von Phasen und Besetzung ab, als '
                                                             'Einordnung: Ein Wochenend-Schutz '
                                                             '(Fr–Mo) liegt grob bei '
                                                             '1.550–1.900 Euro netto. '
                                                             'Kalkuliert wird je Bauabschnitt, '
                                                             'angepasst bei Verzug.',
                                                             'Übernimmt FRANKONIA auch mobile '
                                                             'Videotechnik? Ja, wo Videotürme '
                                                             'oder Alarmtechnik '
                                                             'Personalstunden sparen, planen '
                                                             'wir sie ins Bewachungskonzept '
                                                             'ein. → /sicherheitstechnik/',
                                                             'Stellt FRANKONIA auch die '
                                                             'Brandwache bei Heißarbeiten? Ja, '
                                                             'aus einer Hand mit der '
                                                             'Bewachung, inklusive '
                                                             'Nachkontrolle und Dokumentation: '
                                                             '→ /brandwache-nuernberg/'],
                                                    'h2': 'Baustellenbewachung Nürnberg: die '
                                                          'häufigsten Fragen'},
                                                7: {'name': 'Abschluss-CTA',
                                                    'body': ['Baustelle, Bauphase und Zeitraum '
                                                             'kurz beschreiben — Begehung '
                                                             'kostenfrei, Angebot in einem '
                                                             'Werktag.'],
                                                    'h2': 'Jetzt Baustellenbewachung für '
                                                          'Nürnberg anfragen',
                                                    'form_title': 'Ihre Baustellen-Anfrage '
                                                                  'Nürnberg',
                                                    'related': 'Alles zur Baustellenbewachung '
                                                               '→ /baustellenbewachung/ · '
                                                               'Sicherheitsdienst Nürnberg → '
                                                               '/sicherheitsdienst-nuernberg/'}}},
 'brandwache-wuerzburg': {'docx': '2026-08-04 Webtext 38 Kombi Brandwache Wuerzburg.docx',
                          'meta': {'URL': 'URL: /brandwache-wuerzburg/',
                                   'Title': 'Title (60 Zeichen): Brandwache Würzburg | '
                                            'Brandsicherheitswache 24/7 – FRANKONIA',
                                   'Meta-Description': 'Meta-Description (149 Zeichen): '
                                                       'Brandwache in Würzburg: BMA-Ausfall, '
                                                       'Heißarbeiten, Feste, qualifizierte '
                                                       'Brandsicherheitswachen, dokumentiert '
                                                       'für Behörde & Versicherer. 24/7 '
                                                       'anrufen.',
                                   'Schema': 'Schema: Service (areaServed Würzburg) + FAQPage '
                                             '+ BreadcrumbList',
                                   'Interne Links': 'Interne Links: /brandwache/ · '
                                                    '/sicherheitsdienst-wuerzburg/ · '
                                                    '/baustellenbewachung-wuerzburg/ · '
                                                    '/angebot/'},
                          'sections': {1: {'name': 'Hero (Notfall-Variante)',
                                           'body': ['Kräfte mit § 34a GewO und '
                                                    'Brandschutzhelfer-Qualifikation',
                                                    'Abstimmung mit Behörde und Versicherer '
                                                    'inklusive',
                                                    'Jede Runde dokumentiert, als belastbarer '
                                                    'Nachweis'],
                                           'badge': 'Einsatzgebiet Würzburg & Mainfranken — '
                                                    '24/7 erreichbar',
                                           'h1': 'Brandwache Würzburg',
                                           'subline': 'BMA-Störung, Heißarbeiten oder Auflage '
                                                      'fürs Fest? FRANKONIA stellt '
                                                      'qualifizierte Brandsicherheitswachen in '
                                                      'Würzburg, nach Absprache auch '
                                                      'kurzfristig.',
                                           'cta': 'Jetzt anrufen: +49 951 964352-0 · CTA '
                                                  'sekundär: Unverbindliches Angebot einholen'},
                                       2: {'name': 'Typische Würzburger Einsatzlagen '
                                                   '(Eigencontent)',
                                           'body': ['Kliniken und Einrichtungen: Umbauten im '
                                                    'laufenden Betrieb, Sprinkler '
                                                    'bereichsweise abgeschaltet — Brandwachen '
                                                    'als Ersatzmaßnahme, abgestimmt auf '
                                                    'Räumungspläne sensibler Häuser.',
                                                    'Altbau und Sanierung: Würzburgs Bestand '
                                                    'wird laufend saniert — Dach- und '
                                                    'Schweißarbeiten an historischen Gebäuden '
                                                    'verlangen Wache plus Nachkontrolle nach '
                                                    'Schweißerlaubnisschein.',
                                                    'BMA-Ausfall im Gewerbe: Störung oder '
                                                    'Wartung der Brandmeldeanlage, die Behörde '
                                                    'verlangt sofortigen Ersatz. Wir besetzen, '
                                                    'bis die Anlage wieder läuft.',
                                                    'Feste und Veranstaltungen: Vom Weinfest '
                                                    'bis zum Kongress — Brandsicherheitswachen '
                                                    'nach behördlicher Auflage, koordiniert '
                                                    'mit Veranstalter und Feuerwehr.'],
                                           'h2': 'Wann in Würzburg eine Brandwache gefordert '
                                                 'wird'},
                                       3: {'name': 'Ablauf kompakt',
                                           'body': ['Ein Telefonat genügt: Sie schildern Lage '
                                                    'und Auflage, wir klären Qualifikation und '
                                                    'Rundenplan, bei Bedarf direkt mit Ihrer '
                                                    'Behörde oder Ihrem Versicherer. Danach '
                                                    'steht die Wache zum vereinbarten '
                                                    'Zeitpunkt, mit Wachbuch und erreichbarem '
                                                    'Einsatzleiter.'],
                                           'h2': 'Vom Anruf zur besetzten Wache in Würzburg'},
                                       4: {'name': 'Warum FRANKONIA',
                                           'body': ['Nachweisbar besetzt: Fester '
                                                    'Mitarbeiterstamm und dokumentierte '
                                                    'Übergaben, eine unbesetzte Schicht wäre '
                                                    'ein Auflagen-Verstoß mit Folgen bis zum '
                                                    'Nutzungsverbot.',
                                                    'Klinik-Erfahrung: FRANKONIA arbeitet seit '
                                                    'Jahren im Klinik- und Einrichtungsumfeld, '
                                                    'mit dem nötigen Fingerspitzengefühl für '
                                                    'sensible Bereiche.',
                                                    'Behördenfeste Dokumentation: Wachbuch mit '
                                                    'Rundenprotokoll und Vorkommnissen, '
                                                    'verwertbar für Bauordnungsamt, Feuerwehr '
                                                    'und Versicherer.'],
                                           'h2': 'Pflicht-Wachen brauchen Verlässlichkeit, '
                                                 'keine Versprechen'},
                                       5: {'name': 'Kosten',
                                           'body': ['Für Würzburger Einsätze kalkulieren wir '
                                                    'offen: Der Stundensatz liegt zwischen 26 '
                                                    'und 32 Euro netto, bestimmt durch '
                                                    'Qualifikation, Uhrzeit und Vorlauf der '
                                                    'Wache. Notfall-Konditionen erfahren Sie '
                                                    'sofort am Telefon, geplante Wachen '
                                                    'bepreisen wir binnen eines Werktages.'],
                                           'h2': 'Was kostet eine Brandwache in Würzburg?'},
                                       6: {'name': 'FAQ (6 Fragen)',
                                           'body': ['Wie kurzfristig gibt es eine Brandwache '
                                                    'in Würzburg? Oft noch am selben Tag, '
                                                    'gerade der BMA-Ausfall duldet keinen '
                                                    'Aufschub. Rufen Sie durch, die '
                                                    'Einsatzleitung plant sofort: +49 951 '
                                                    '964352-0.',
                                                    'Wer schreibt die Brandwache vor? Je nach '
                                                    'Fall Bauordnungsamt oder Feuerwehr '
                                                    '(BMA-Ausfall, Veranstaltungen), Ihr '
                                                    'Versicherer (Heißarbeiten) oder die '
                                                    'Baustellenordnung. Details: → '
                                                    '/ratgeber/brandwache-wann-vorgeschrieben/',
                                                    'Welche Qualifikation bringen die '
                                                    'Würzburger Wachen mit? Alle Kräfte '
                                                    'kombinieren die § 34a-Qualifikation mit '
                                                    'der Brandschutzhelfer-Ausbildung nach '
                                                    'DGUV. Verlangt Ihre Auflage mehr, '
                                                    'besetzen wir entsprechend, abgestimmt vor '
                                                    'dem ersten Einsatz.',
                                                    'Übernimmt FRANKONIA Brandwachen in '
                                                    'Kliniken und Einrichtungen? Ja, inklusive '
                                                    'Abstimmung auf Räumungspläne und sensible '
                                                    'Bereiche. Referenz-Erfahrung aus dem '
                                                    'Klinikumfeld (u. a. Sozialstiftung '
                                                    'Bamberg) bringen wir mit.',
                                                    'Wie lange dauert die Nachkontrolle nach '
                                                    'Heißarbeiten? Üblich sind mindestens zwei '
                                                    'Stunden nach Ende der Arbeiten, '
                                                    'verbindlich ist Ihr '
                                                    'Schweißerlaubnisschein. Die Nachkontrolle '
                                                    'wird mitdokumentiert.',
                                                    'Was bietet FRANKONIA in Würzburg noch an? '
                                                    'Objektschutz, Werkschutz, '
                                                    'Baustellenbewachung und mehr: → '
                                                    '/sicherheitsdienst-wuerzburg/'],
                                           'h2': 'Brandwache Würzburg: die häufigsten Fragen'},
                                       7: {'name': 'Abschluss-CTA',
                                           'body': ['+49 951 964352-0, rund um die Uhr. Für '
                                                    'geplante Wachen: Formular, Angebot in '
                                                    'einem Werktag.'],
                                           'h2': 'Brandwache für Würzburg benötigt? Ein Anruf '
                                                 'genügt',
                                           'form_title': 'Ihre Brandwache-Anfrage Würzburg',
                                           'related': 'Alles zur Brandwache → /brandwache/ · '
                                                      'Sicherheitsdienst Würzburg → '
                                                      '/sicherheitsdienst-wuerzburg/'}}},
 'objektschutz-wuerzburg': {'docx': '2026-08-04 Webtext 39 Kombi Objektschutz Wuerzburg.docx',
                            'meta': {'URL': 'URL: /objektschutz-wuerzburg/',
                                     'Title': 'Title (59 Zeichen): Objektschutz Würzburg | Ihr '
                                              'Objekt 24/7 bewacht – FRANKONIA',
                                     'Meta-Description': 'Meta-Description (151 Zeichen): '
                                                         'Objektschutz in Würzburg: '
                                                         'Bestreifung, Zugangskontrolle & '
                                                         'Alarmverfolgung für Einrichtungen, '
                                                         'Logistik & Büro. DEKRA-zertifiziert, '
                                                         'Angebot in 1 Werktag.',
                                     'Schema': 'Schema: Service (areaServed Würzburg) + '
                                               'FAQPage + BreadcrumbList',
                                     'Interne Links': 'Interne Links: /objektschutz/ · '
                                                      '/sicherheitsdienst-wuerzburg/ · '
                                                      '/sicherheitskonzept/ · /angebot/'},
                            'sections': {1: {'name': 'Hero',
                                             'body': ['IHK-qualifizierte Kräfte nach § 34a '
                                                      'GewO, DEKRA-zertifiziertes System',
                                                      'Digitales Wachbuch mit '
                                                      'Checkpoint-Nachweis je Runde',
                                                      'Unverbindliches Angebot innerhalb eines '
                                                      'Werktages'],
                                             'badge': 'Einsatzgebiet Würzburg, feste Teams '
                                                      'direkt im Objekt',
                                             'h1': 'Objektschutz Würzburg',
                                             'subline': 'Bestreifung, Zugangskontrolle und '
                                                        'Alarmverfolgung für Ihr Würzburger '
                                                        'Objekt, dokumentiert, zertifiziert, '
                                                        'mit festem Ansprechpartner.',
                                             'cta': 'Unverbindliches Angebot einholen · CTA '
                                                    'sekundär: +49 951 964352-0'},
                                         2: {'name': 'Erst das Konzept (Struktur-Variation: '
                                                     'Prozess früh)',
                                             'body': ['Kein Würzburger Objekt gleicht dem '
                                                      'anderen: Eine Klinik braucht anderen '
                                                      'Schutz als eine Logistikhalle am Hafen '
                                                      'oder ein Büro in der Innenstadt. '
                                                      'Deshalb starten wir mit der '
                                                      'kostenfreien Begehung, daraus entsteht '
                                                      'Ihr Sicherheitskonzept mit Besetzung, '
                                                      'Zeiten und Preisrahmen. → '
                                                      '/sicherheitskonzept/',
                                                      '1 Begehung: Zugänge, Risiken, '
                                                      'vorhandene Technik, kostenfrei '
                                                      'bewertet.',
                                                      '2 Konzept + Angebot: Schriftlich, '
                                                      'transparent, innerhalb eines Werktages.',
                                                      '3 Start mit festem Team: Nach '
                                                      'Checkliste eingearbeitet, dokumentiert '
                                                      'ab Tag eins.'],
                                             'h2': 'Objektschutz in Würzburg beginnt mit einer '
                                                   'Begehung, nicht mit einem Stundensatz'},
                                         3: {'name': 'Diese Würzburger Objekte schützt '
                                                     'FRANKONIA (Eigencontent)',
                                             'body': ['Einrichtungen und Verwaltungen: '
                                                      'Publikumsverkehr, sensible Bereiche, '
                                                      'Nachtbetrieb — Zutrittssteuerung mit '
                                                      'Fingerspitzengefühl, Erfahrung aus dem '
                                                      'Klinikumfeld inklusive.',
                                                      'Logistik und Gewerbe am Main: Hohe '
                                                      'Warenwerte und Lieferverkehr — '
                                                      'Zufahrtskontrolle und dokumentierte '
                                                      'Rundgänge als Versicherungs-Grundlage.',
                                                      'Büro- und Geschäftshäuser: Schutz für '
                                                      'Mitarbeitende, IT und Unterlagen, '
                                                      'nachts Verschlusskonzepte und '
                                                      'Alarmverfolgung.',
                                                      'Handel in der Innenstadt: Sichtbare '
                                                      'Präsenz zwischen Dom und Marktplatz, '
                                                      'abschreckend für Täter, beruhigend für '
                                                      'Kunden.'],
                                             'h2': 'Vom Klinik-Umfeld bis zur Logistikhalle in '
                                                   'Würzburg'},
                                         4: {'name': 'Nachweisbar statt behauptet',
                                             'body': ['Digitales Wachbuch in Echtzeit, '
                                                      'Wächterkontrollsystem mit Checkpoints, '
                                                      'regelmäßiger Report für Ihre '
                                                      'Geschäftsführung: Sie sehen jederzeit, '
                                                      'was auf Ihrem Objekt passiert, ohne '
                                                      'nachzufragen. Im Ernstfall ist diese '
                                                      'Dokumentation Ihr Nachweis gegenüber '
                                                      'der Versicherung.'],
                                             'h2': 'Kontrolle, die Sie in Würzburg '
                                                   'nachvollziehbar dokumentiert bekommen'},
                                         5: {'name': 'Kosten',
                                             'body': ['Objektschutz kostet in Würzburg in der '
                                                      'Regel 26 bis 32 Euro pro Stunde netto, '
                                                      'je nach Qualifikation, Einsatzzeit und '
                                                      'Umfang. Oft senkt die Kombination mit '
                                                      'Technik die Gesamtkosten: '
                                                      'Bestandskunden sparten so bis zu 20 % '
                                                      'bei gleicher Sicherheit. Ihr Angebot '
                                                      'kommt innerhalb eines Werktages.'],
                                             'h2': 'Was kostet Objektschutz in Würzburg?'},
                                         6: {'name': 'FAQ (6 Fragen)',
                                             'body': ['Wie startet der Objektschutz für mein '
                                                      'Würzburger Objekt? Mit der kostenfreien '
                                                      'Begehung, danach erhalten Sie '
                                                      'Sicherheitskonzept und unverbindliches '
                                                      'Angebot innerhalb eines Werktages.',
                                                      'Sind die Kräfte fest meinem Objekt '
                                                      'zugeordnet? Ja, feste Stammkräfte mit '
                                                      'dokumentierter Einarbeitung und '
                                                      'Mitsprache bei der Personalauswahl. '
                                                      'Kein ständiger Wechsel.',
                                                      'Hat FRANKONIA Erfahrung mit Kliniken '
                                                      'und Einrichtungen? Ja, unter anderem '
                                                      'aus der langjährigen Arbeit für die '
                                                      'Sozialstiftung Bamberg mit Kliniken '
                                                      'sowie Impf- und Testzentren. Diese '
                                                      'Prozesse übertragen wir auf Würzburger '
                                                      'Einrichtungen.',
                                                      'Was kostet Objektschutz in Würzburg pro '
                                                      'Monat? Je nach Besetzung: Ein einzelner '
                                                      'Nachtposten an Werktagen liegt '
                                                      'inklusive Nachtzuschlag grob bei '
                                                      '5.500–6.800 Euro netto monatlich. Die '
                                                      'Begehung zeigt, ob Technik-Kombination '
                                                      'die Kosten senkt.',
                                                      'Woher weiß ich, dass die Rundgänge '
                                                      'wirklich laufen? Durch das '
                                                      'Wächterkontrollsystem: Checkpoints '
                                                      'werden je Runde gescannt und mit '
                                                      'Zeitstempel im Report ausgewiesen.',
                                                      'Bietet FRANKONIA in Würzburg weitere '
                                                      'Leistungen an? Ja — Werkschutz, '
                                                      'Brandwache, Baustellenbewachung und '
                                                      'mehr: → /sicherheitsdienst-wuerzburg/'],
                                             'h2': 'Objektschutz Würzburg: die häufigsten '
                                                   'Fragen'},
                                         7: {'name': 'Abschluss-CTA',
                                             'body': ['Kurz das Objekt beschreiben, '
                                                      'kostenfreie Begehung, Angebot in einem '
                                                      'Werktag.'],
                                             'h2': 'Jetzt Objektschutz für Würzburg anfragen',
                                             'form_title': 'Ihre Objektschutz-Anfrage Würzburg',
                                             'related': 'Alles zum Objektschutz → '
                                                        '/objektschutz/ · Sicherheitsdienst '
                                                        'Würzburg → '
                                                        '/sicherheitsdienst-wuerzburg/'}}},
 'werkschutz-wuerzburg': {'docx': '2026-08-04 Webtext 40 Kombi Werkschutz Wuerzburg.docx',
                          'meta': {'URL': 'URL: /werkschutz-wuerzburg/',
                                   'Title': 'Title (55 Zeichen): Werkschutz Würzburg | '
                                            'Industrie-Schutz 24/7 – FRANKONIA',
                                   'Meta-Description': 'Meta-Description (148 Zeichen): '
                                                       'Werkschutz für Würzburger Industrie: '
                                                       'Pforte, Rundgänge & Anlagen-Bedienung '
                                                       'durch technik-geschulte Kräfte. '
                                                       'DEKRA-zertifiziert, Angebot in 1 '
                                                       'Werktag.',
                                   'Schema': 'Schema: Service (areaServed Würzburg) + FAQPage '
                                             '+ BreadcrumbList',
                                   'Interne Links': 'Interne Links: /werkschutz/ · '
                                                    '/sicherheitsdienst-wuerzburg/ · '
                                                    '/objektschutz-wuerzburg/ · /angebot/'},
                          'sections': {1: {'name': 'Hero',
                                           'body': ['Pforte und Torkontrolle im '
                                                    'Schichtrhythmus Ihres Betriebs',
                                                    'Anlagen-Bedienung: BMA, EMA und Zutritt '
                                                    'sachgemäß geführt',
                                                    'Fester Ansprechpartner, 24/7 direkt '
                                                    'erreichbar'],
                                           'badge': 'Einsatzgebiet Würzburg & Mainfranken — '
                                                    'Werkschutz im Schichtbetrieb',
                                           'h1': 'Werkschutz Würzburg',
                                           'subline': 'Pfortendienst, Rundgänge und '
                                                      'Anlagen-Bedienung für Industrie und '
                                                      'Produktion in Würzburg, durch '
                                                      'technik-geschulte, IHK-qualifizierte '
                                                      'Kräfte.',
                                           'cta': 'Unverbindliches Angebot einholen · CTA '
                                                  'sekundär: +49 951 964352-0'},
                                       2: {'name': 'Der Würzburger Industrie-Kontext '
                                                   '(Eigencontent)',
                                           'body': ['Würzburg und sein Umland stehen für '
                                                    'Maschinen- und Anlagenbau mit langer '
                                                    'Geschichte — Betriebe, deren wertvollstes '
                                                    'Gut nicht in der Halle steht, sondern in '
                                                    'Konstruktionsdaten, Fertigungswissen und '
                                                    'eingespielten Abläufen steckt. Werkschutz '
                                                    'heißt hier: Tore kontrollieren, '
                                                    'Fremdfirmen führen, Wissen schützen.',
                                                    'Am Tor: Mitarbeiter-, Besucher- und '
                                                    'Lieferverkehr kontrolliert, ohne die '
                                                    'Produktion aufzuhalten.',
                                                    'Im Betrieb: Rundgänge mit Blick für '
                                                    'Brandlasten, Anlagen und offene Zugänge.',
                                                    'Beim Wissen: Zutrittssteuerung für '
                                                    'Entwicklung und Prototypen, dokumentierte '
                                                    'Fremdfirmen-Prozesse.'],
                                           'h2': 'Traditionsindustrie in Würzburg heißt: '
                                                 'Know-how, das geschützt werden muss'},
                                       3: {'name': 'Haftung & Nachweis (Struktur-Variation)',
                                           'body': ['Unbesetzte Brandmeldezentrale, fehlende '
                                                    'Kontrollnachweise, unklare Zutritte: '
                                                    'Solche Lücken kosten im Ernstfall den '
                                                    'Versicherungsschutz. FRANKONIA '
                                                    'dokumentiert lückenlos — Wachbuch, '
                                                    'Torbuch, Checkpoint-Nachweise und ein '
                                                    'regelmäßiger Report, den Sie Ihrer '
                                                    'Geschäftsführung vorlegen können.'],
                                           'h2': 'Im Schadensfall fragt die Versicherung '
                                                 'zuerst nach der Dokumentation'},
                                       4: {'name': 'Besetzungsmodelle',
                                           'body': ['Manche Würzburger Betriebe brauchen die '
                                                    'durchgehend besetzte Pforte, andere nur '
                                                    'die kontrollierte Nacht: FRANKONIA legt '
                                                    'das Modell nach Ihrer Schichtstruktur '
                                                    'fest. Grundlage ist die Begehung Ihres '
                                                    'Standorts. Dass sich das rechnet, zeigt '
                                                    'ein Großkunde: 30 % weniger '
                                                    'Personalkosten bei gleicher Sicherheit.'],
                                           'h2': 'Besetzung nach Bedarf statt Posten nach '
                                                 'Schema'},
                                       5: {'name': 'Kosten',
                                           'body': ['Für Würzburger Werkschutz-Einsätze liegt '
                                                    'der Satz zwischen 26 und 32 Euro netto je '
                                                    'Stunde, je höher Qualifikation und '
                                                    'Anlagen-Verantwortung, desto weiter oben. '
                                                    'Durchgehende Posten kalkulieren wir '
                                                    'standortindividuell; das schriftliche '
                                                    'Angebot folgt einen Werktag nach der '
                                                    'Begehung.'],
                                           'h2': 'Was kostet Werkschutz in Würzburg?'},
                                       6: {'name': 'FAQ (6 Fragen)',
                                           'body': ['Können die Kräfte unsere Anlagen '
                                                    'bedienen? Ja, alle Werkschutzkräfte sind '
                                                    'technik-geschult und werden nach '
                                                    'Checkliste in Ihre Brandmelde-, Alarm- '
                                                    'und Zutrittsanlagen eingearbeitet. Die '
                                                    'Einarbeitung wird dokumentiert.',
                                                    'Übernimmt FRANKONIA auch nur Nacht- und '
                                                    'Wochenendschichten? Ja, vom '
                                                    'Randzeiten-Schutz bis zur durchgehenden '
                                                    'Pforte ist jedes Modell möglich. Das '
                                                    'wirtschaftlichste ergibt die kostenfreie '
                                                    'Begehung.',
                                                    'Wie läuft die Fremdfirmen-Koordination? '
                                                    'Nach Ihren Vorgaben: Anmeldung, '
                                                    'Unterweisungs-Check, Ausweisvergabe und '
                                                    'dokumentierte Ein-/Ausfahrten — Sie '
                                                    'wissen jederzeit, wer auf dem Gelände '
                                                    'ist.',
                                                    'Was ist der Unterschied zwischen '
                                                    'Werkschutz und Objektschutz? Werkschutz '
                                                    'ist die spezialisierte Form für '
                                                    'Produktionsstandorte, mit Pforte und '
                                                    'Anlagen-Bedienung. Für Büro- und '
                                                    'Logistikobjekte: → '
                                                    '/objektschutz-wuerzburg/',
                                                    'Wann kann der Werkschutz bei uns in '
                                                    'Würzburg anfangen? Sobald Begehung und '
                                                    'Angebot durch sind, besetzen wir je nach '
                                                    'Modell zügig, und verstärken laufende '
                                                    'Aufträge nach Absprache auch kurzfristig: '
                                                    '+49 951 964352-0.',
                                                    'Was bietet FRANKONIA in Würzburg noch an? '
                                                    'Objektschutz, Brandwache, '
                                                    'Baustellenbewachung und mehr: → '
                                                    '/sicherheitsdienst-wuerzburg/'],
                                           'h2': 'Werkschutz Würzburg: die häufigsten Fragen'},
                                       7: {'name': 'Abschluss-CTA',
                                           'body': ['Standort und Schichtzeiten kurz '
                                                    'beschreiben — Begehung kostenfrei, '
                                                    'Angebot in einem Werktag.'],
                                           'h2': 'Jetzt Werkschutz für Würzburg anfragen',
                                           'form_title': 'Ihre Werkschutz-Anfrage Würzburg',
                                           'related': 'Alles zum Werkschutz → /werkschutz/ · '
                                                      'Sicherheitsdienst Würzburg → '
                                                      '/sicherheitsdienst-wuerzburg/'}}},
 'baustellenbewachung-wuerzburg': {'docx': '2026-08-04 Webtext 41 Kombi Baustellenbewachung '
                                           'Wuerzburg.docx',
                                   'meta': {'URL': 'URL: /baustellenbewachung-wuerzburg/',
                                            'Title': 'Title (54 Zeichen): Baustellenbewachung '
                                                     'Würzburg | Schutz 24/7 – FRANKONIA',
                                            'Meta-Description': 'Meta-Description (144 '
                                                                'Zeichen): Baustellenbewachung '
                                                                'in Würzburg: Schutz vor '
                                                                'Diebstahl & Vandalismus für '
                                                                'Neubau & Sanierung, feste '
                                                                'Teams, dokumentiert. Angebot '
                                                                'in einem Werktag.',
                                            'Schema': 'Schema: Service (areaServed Würzburg) + '
                                                      'FAQPage + BreadcrumbList',
                                            'Interne Links': 'Interne Links: '
                                                             '/baustellenbewachung/ · '
                                                             '/sicherheitsdienst-wuerzburg/ · '
                                                             '/brandwache-wuerzburg/ · '
                                                             '/angebot/'},
                                   'sections': {1: {'name': 'Hero',
                                                    'body': ['Nacht- und Wochenendbewachung '
                                                             'oder Kontrollen zu variierenden '
                                                             'Zeiten',
                                                             'Zufahrtskontrolle für '
                                                             'Lieferverkehr und Subunternehmer',
                                                             'Dokumentation für Bauherren, '
                                                             'Partnerfirmen und Versicherung'],
                                                    'badge': 'Einsatzgebiet Würzburg — '
                                                             'Bewachung, die dem Bau folgt',
                                                    'h1': 'Baustellenbewachung Würzburg',
                                                    'subline': 'Ob Neubau im Umland oder '
                                                               'Sanierung in der Innenstadt: '
                                                               'FRANKONIA schützt Würzburger '
                                                               'Baustellen vor Diebstahl und '
                                                               'Vandalismus, mit Konzepten je '
                                                               'Bauphase.',
                                                    'cta': 'Unverbindliches Angebot einholen · '
                                                           'CTA sekundär: +49 951 964352-0'},
                                                2: {'name': 'Die Würzburger Baustellen-Lage '
                                                            '(Eigencontent)',
                                                    'body': ['Würzburg baut anders als das '
                                                             'flache Umland: viel Sanierung im '
                                                             'Bestand, enge '
                                                             'Innenstadt-Baustellen mit schwer '
                                                             'kontrollierbaren Zugängen, und '
                                                             'draußen Wohn- und '
                                                             'Gewerbeprojekte mit Großgerät. '
                                                             'Beides zieht Täter an; beides '
                                                             'braucht ein eigenes '
                                                             'Bewachungskonzept.',
                                                             'Innenstadt und Bestand: Gerüste, '
                                                             'offene Fassaden, Materiallager '
                                                             'im öffentlichen Raum — Kontrolle '
                                                             'zu unvorhersehbaren Zeiten wirkt '
                                                             'hier am stärksten.',
                                                             'Neubau im Umland: Bagger, '
                                                             'Kraftstoff und Gebäudetechnik '
                                                             'über Wochen auf dem Gelände, '
                                                             'feste Nachtposten in den '
                                                             'kritischen Phasen.',
                                                             'Gewerbeprojekte am Main: '
                                                             'Hochwertige Technik kurz vor '
                                                             'Übergabe — Sonderschutz, wenn '
                                                             'der Wert auf der Baustelle am '
                                                             'höchsten ist.'],
                                                    'h2': 'Warum Baustellen in Würzburg '
                                                          'besonderen Schutz brauchen'},
                                                3: {'name': 'Konzept je Bauphase',
                                                    'body': ['Rohbau, Ausbau, Übergabe: Jede '
                                                             'Phase wird eigen kalkuliert — '
                                                             'Posten, Kontrollen, mobile '
                                                             'Videotechnik oder die '
                                                             'Kombination. Bei Heißarbeiten '
                                                             '(Dachabdichtung, Schweißen) '
                                                             'stellen wir die vorgeschriebene '
                                                             'Brandwache aus einer Hand. → '
                                                             '/brandwache-wuerzburg/'],
                                                    'h2': 'Bewachung, die mit Ihrem Würzburger '
                                                          'Projekt mitwächst'},
                                                4: {'name': 'Nachweisbar bewacht',
                                                    'body': ['Checkpoints auf dem Gelände '
                                                             'belegen jede Runde technisch, '
                                                             'Feststellungen werden mit Foto '
                                                             'und Meldekette dokumentiert, '
                                                             'Zufahrten protokolliert. Für '
                                                             'Bauherren, Partnerfirmen und '
                                                             'Versicherung zählt genau das im '
                                                             'Ernstfall.'],
                                                    'h2': 'Nachweise statt Behauptungen, auch '
                                                          'auf Ihrer Baustelle'},
                                                5: {'name': 'Kosten',
                                                    'body': ['Würzburger Baustellen bewachen '
                                                             'wir für 26 bis 32 Euro netto je '
                                                             'Stunde, tarifliche Zuschläge für '
                                                             'Nacht- und Wochenendeinsätze '
                                                             'kommen hinzu. Die Kalkulation '
                                                             'folgt Ihren Bauabschnitten und '
                                                             'wird bei Verzug angepasst, das '
                                                             'Angebot liegt einen Werktag nach '
                                                             'der Begehung vor.'],
                                                    'h2': 'Was kostet Baustellenbewachung in '
                                                          'Würzburg?'},
                                                6: {'name': 'FAQ (6 Fragen)',
                                                    'body': ['Wie schnell startet die '
                                                             'Bewachung meiner Würzburger '
                                                             'Baustelle? Bei akuten Vorfällen, '
                                                             'etwa nach einem '
                                                             'Wochenend-Einbruch, organisieren '
                                                             'wir die erste Besetzung nach '
                                                             'Absprache umgehend: +49 951 '
                                                             '964352-0.',
                                                             'Reicht ein Wochenend-Schutz für '
                                                             'meine Würzburger Baustelle? Oft '
                                                             'ja, die meisten Vorfälle '
                                                             'passieren nachts und am '
                                                             'Wochenende. Die kostenfreie '
                                                             'Begehung liefert die Empfehlung '
                                                             'samt Kostenvergleich der '
                                                             'Varianten.',
                                                             'Funktioniert Bewachung auch bei '
                                                             'engen Innenstadt-Baustellen? Ja, '
                                                             'gerade dort: Fußkontrollen, '
                                                             'Gerüst- und Zugangs-Checks zu '
                                                             'variierenden Zeiten sind für '
                                                             'Bestands- und Sanierungsprojekte '
                                                             'oft wirksamer als starre Posten.',
                                                             'Womit muss ich über die '
                                                             'Projektlaufzeit rechnen? Das '
                                                             'bestimmen Phasen und Besetzung, '
                                                             'ein reiner Wochenend-Schutz von '
                                                             'Freitagabend bis Montagfrüh '
                                                             'bewegt sich grob zwischen 1.500 '
                                                             'und 2.100 Euro netto.',
                                                             'Geht auch eine Kombination mit '
                                                             'Videoüberwachung? Ja, mobile '
                                                             'Videotürme und Alarmtechnik '
                                                             'reduzieren Personalstunden, wo '
                                                             'Dauerpräsenz unnötig ist. Beides '
                                                             'planen wir im selben Konzept. → '
                                                             '/sicherheitstechnik/',
                                                             'Stellt FRANKONIA auch die '
                                                             'Brandwache bei Heißarbeiten? Ja, '
                                                             'aus einer Hand mit der '
                                                             'Bewachung, inklusive '
                                                             'Nachkontrolle: → '
                                                             '/brandwache-wuerzburg/'],
                                                    'h2': 'Baustellenbewachung Würzburg: die '
                                                          'häufigsten Fragen'},
                                                7: {'name': 'Abschluss-CTA',
                                                    'body': ['Baustelle, Bauphase und Zeitraum '
                                                             'kurz beschreiben — Begehung '
                                                             'kostenfrei, Angebot in einem '
                                                             'Werktag.'],
                                                    'h2': 'Jetzt Baustellenbewachung für '
                                                          'Würzburg anfragen',
                                                    'form_title': 'Ihre Baustellen-Anfrage '
                                                                  'Würzburg',
                                                    'related': 'Alles zur Baustellenbewachung '
                                                               '→ /baustellenbewachung/ · '
                                                               'Sicherheitsdienst Würzburg → '
                                                               '/sicherheitsdienst-wuerzburg/'}}},
 'brandwache-erlangen': {'docx': '2026-08-04 Webtext 42 Kombi Brandwache Erlangen.docx',
                         'meta': {'URL': 'URL: /brandwache-erlangen/',
                                  'Title': 'Title (60 Zeichen): Brandwache Erlangen | '
                                           'Brandsicherheitswache 24/7 – FRANKONIA',
                                  'Meta-Description': 'Meta-Description (140 Zeichen): '
                                                      'Brandwache in Erlangen: BMA-Ausfall, '
                                                      'Heißarbeiten, Labor-Umgebungen, '
                                                      'qualifizierte Brandsicherheitswachen, '
                                                      'dokumentiert. Jetzt 24/7 anrufen.',
                                  'Schema': 'Schema: Service (areaServed Erlangen) + FAQPage + '
                                            'BreadcrumbList',
                                  'Interne Links': 'Interne Links: /brandwache/ · '
                                                   '/sicherheitsdienst-erlangen/ · '
                                                   '/baustellenbewachung-erlangen/ · '
                                                   '/angebot/'},
                         'sections': {1: {'name': 'Hero (Notfall-Variante)',
                                          'body': ['Kräfte mit § 34a GewO und '
                                                   'Brandschutzhelfer-Qualifikation',
                                                   'Erfahrung mit sensiblen Umgebungen: '
                                                   'Forschung, Medizin, Verwaltung',
                                                   'Jede Runde dokumentiert, für Behörde und '
                                                   'Versicherer'],
                                          'badge': 'Einsatzgebiet Erlangen — 24/7 erreichbare '
                                                   'Einsatzleitung',
                                          'h1': 'Brandwache Erlangen',
                                          'subline': 'BMA-Störung im Labor, Heißarbeiten am '
                                                     'Campus-Neubau oder Behörden-Auflage? '
                                                     'FRANKONIA stellt qualifizierte '
                                                     'Brandsicherheitswachen in Erlangen, nach '
                                                     'Absprache auch kurzfristig.',
                                          'cta': 'Jetzt anrufen: +49 951 964352-0 · CTA '
                                                 'sekundär: Unverbindliches Angebot einholen'},
                                      2: {'name': 'Typische Erlanger Einsatzlagen '
                                                  '(Eigencontent)',
                                          'body': ['Labore und Forschungsflächen: '
                                                   'Abgeschaltete Melderlinien bei Umbau oder '
                                                   'Wartung — Ersatzmaßnahme mit besonderem '
                                                   'Blick für sensible Bereiche und '
                                                   'Gefahrstoffe.',
                                                   'Klinik-Umfeld: Bereichsweise Abschaltungen '
                                                   'im laufenden Betrieb — Wachen, abgestimmt '
                                                   'auf Räumungspläne und Stationsabläufe.',
                                                   'Campus- und Büro-Neubauten: Heißarbeiten '
                                                   'an Dach und Fassade — Wache während der '
                                                   'Arbeiten plus vorgeschriebene '
                                                   'Nachkontrolle.',
                                                   'BMA-Ausfall im Gewerbe: Störung der '
                                                   'Brandmeldeanlage, wir besetzen, bis der '
                                                   'Errichter die Anlage instand gesetzt hat.'],
                                          'h2': 'Wann in Erlangen eine Brandwache gefordert '
                                                'wird'},
                                      3: {'name': 'Ablauf kompakt',
                                          'body': ['Schildern Sie uns telefonisch, was '
                                                   'gefordert ist, den Rest übernimmt die '
                                                   'Einsatzleitung: Rundenplan und '
                                                   'Qualifikation werden mit der fordernden '
                                                   'Stelle abgestimmt, Ihre Bereichsregeln vor '
                                                   'Dienstbeginn eingewiesen. Ab dann läuft '
                                                   'jede Runde dokumentiert.'],
                                          'h2': 'Ihr Weg zur Brandwache in Erlangen'},
                                      4: {'name': 'Warum FRANKONIA',
                                          'body': ['Diskret und eingewiesen: Kräfte, die sich '
                                                   'in Forschungs- und Klinikumgebungen '
                                                   'richtig bewegen, mit '
                                                   'Verschwiegenheitsverpflichtung.',
                                                   'Nachweisbar besetzt: Fester '
                                                   'Mitarbeiterstamm, dokumentierte Übergaben, '
                                                   'keine Lücken in der Pflicht-Wache.',
                                                   'Behördenfest dokumentiert: Wachbuch mit '
                                                   'Rundenprotokoll, verwertbar für '
                                                   'Bauordnungsamt, Feuerwehr und '
                                                   'Versicherer.'],
                                          'h2': 'Sensible Umgebungen brauchen mehr als '
                                                'Anwesenheit'},
                                      5: {'name': 'Kosten',
                                          'body': ['Auch in Erlangen rechnen wir offen ab: '
                                                   'zwischen 26 und 32 Euro netto je Stunde, '
                                                   'abhängig von geforderter Qualifikation, '
                                                   'Tageszeit und Planungsvorlauf. '
                                                   'Sonderanforderungen aus Labor- oder '
                                                   'Klinikumgebungen fließen transparent in '
                                                   'das Angebot ein, das Sie binnen eines '
                                                   'Werktages erhalten.'],
                                          'h2': 'Was kostet eine Brandwache in Erlangen?'},
                                      6: {'name': 'FAQ (6 Fragen)',
                                          'body': ['Wie kurzfristig gibt es eine Brandwache in '
                                                   'Erlangen? Die Einsatzleitung plant rund um '
                                                   'die Uhr, bei akuten Ausfällen organisieren '
                                                   'wir die Besetzung nach Absprache auch '
                                                   'außerhalb der Geschäftszeiten: +49 951 '
                                                   '964352-0.',
                                                   'Darf die Wache in Labor- und Reinraumnähe '
                                                   'eingesetzt werden? Ja, nach Einweisung in '
                                                   'Ihre Bereichs- und Verhaltensregeln. '
                                                   'Sonderanforderungen klären wir vor '
                                                   'Einsatzbeginn mit Ihrem Verantwortlichen.',
                                                   'Wer schreibt die Brandwache vor? Je nach '
                                                   'Fall Bauordnungsamt/Feuerwehr, Ihr '
                                                   'Versicherer oder die Baustellenordnung. '
                                                   'Details: → '
                                                   '/ratgeber/brandwache-wann-vorgeschrieben/',
                                                   'Welche Qualifikation haben die Kräfte in '
                                                   'Erlangen? § 34a GewO und '
                                                   'DGUV-Brandschutzhelfer sind Standard; für '
                                                   'Labor- und Klinikbereiche kommen '
                                                   'Einweisungen in Ihre Schutz- und '
                                                   'Verhaltensregeln hinzu.',
                                                   'Gehört die Nachkontrolle nach Heißarbeiten '
                                                   'dazu? Ja, sie ist fester Bestandteil des '
                                                   'Einsatzes und richtet sich nach Ihrem '
                                                   'Schweißerlaubnisschein (üblich: mindestens '
                                                   'zwei Stunden). Protokolliert wird sie im '
                                                   'selben Wachbuch.',
                                                   'Was bietet FRANKONIA in Erlangen noch an? '
                                                   'Objektschutz, Werkschutz, '
                                                   'Baustellenbewachung und mehr: → '
                                                   '/sicherheitsdienst-erlangen/'],
                                          'h2': 'Brandwache Erlangen: die häufigsten Fragen'},
                                      7: {'name': 'Abschluss-CTA',
                                          'body': ['+49 951 964352-0, rund um die Uhr. Für '
                                                   'geplante Wachen: Formular, Angebot in '
                                                   'einem Werktag.'],
                                          'h2': 'Brandwache für Erlangen benötigt? Ein Anruf '
                                                'genügt',
                                          'form_title': 'Ihre Brandwache-Anfrage Erlangen',
                                          'related': 'Alles zur Brandwache → /brandwache/ · '
                                                     'Sicherheitsdienst Erlangen → '
                                                     '/sicherheitsdienst-erlangen/'}}},
 'objektschutz-erlangen': {'docx': '2026-08-04 Webtext 43 Kombi Objektschutz Erlangen.docx',
                           'meta': {'URL': 'URL: /objektschutz-erlangen/',
                                    'Title': 'Title (59 Zeichen): Objektschutz Erlangen | Ihr '
                                             'Objekt 24/7 bewacht – FRANKONIA',
                                    'Meta-Description': 'Meta-Description (150 Zeichen): '
                                                        'Objektschutz in Erlangen: '
                                                        'Bestreifung, Zugangskontrolle & '
                                                        'Alarmverfolgung für Büro, Forschung & '
                                                        'Gewerbe. DEKRA-zertifiziert, Angebot '
                                                        'in einem Werktag.',
                                    'Schema': 'Schema: Service (areaServed Erlangen) + FAQPage '
                                              '+ BreadcrumbList',
                                    'Interne Links': 'Interne Links: /objektschutz/ · '
                                                     '/sicherheitsdienst-erlangen/ · '
                                                     '/werkschutz-erlangen/ · /angebot/'},
                           'sections': {1: {'name': 'Hero',
                                            'body': ['IHK-qualifizierte Kräfte nach § 34a '
                                                     'GewO, DEKRA-zertifiziertes System',
                                                     'Diskretion für sensible Bereiche, '
                                                     'inklusive Verschwiegenheitsverpflichtung',
                                                     'Unverbindliches Angebot innerhalb eines '
                                                     'Werktages'],
                                            'badge': 'Einsatzgebiet Erlangen, feste Teams '
                                                     'direkt im Objekt',
                                            'h1': 'Objektschutz Erlangen',
                                            'subline': 'Bestreifung, Zugangskontrolle und '
                                                       'Alarmverfolgung für Ihr Erlanger '
                                                       'Objekt, dokumentiert, zertifiziert, '
                                                       'mit festem Ansprechpartner.',
                                            'cta': 'Unverbindliches Angebot einholen · CTA '
                                                   'sekundär: +49 951 964352-0'},
                                        2: {'name': 'Objektschutz in einer Wissens-Stadt '
                                                    '(Eigencontent)',
                                            'body': ['Erlangens Objekte sind selten nur '
                                                     'Immobilien: In Büros, Instituten und '
                                                     'Technologieparks stecken Daten, '
                                                     'Prototypen und Forschungsergebnisse. '
                                                     'Objektschutz heißt hier: kontrollierter '
                                                     'Zutritt, saubere Besucherprozesse und '
                                                     'Kräfte, die Diskretion als Teil des Jobs '
                                                     'verstehen.',
                                                     'Büro- und Campusflächen: '
                                                     'Zutrittssteuerung, Empfangs-Nähe, '
                                                     'Verschlusskonzepte für Abend und '
                                                     'Wochenende.',
                                                     'Technologie- und Gewerbeparks: Nachts '
                                                     'verwaiste Areale, dokumentierte '
                                                     'Kontrollen zu variierenden Zeiten plus '
                                                     'Alarmtechnik.',
                                                     'Einrichtungen mit Publikumsverkehr: '
                                                     'Sichtbare, deeskalationssichere Präsenz, '
                                                     'beruhigend für Besucher, abschreckend '
                                                     'für Täter.'],
                                            'h2': 'In Erlangen schützt Objektschutz mehr als '
                                                  'Gebäude'},
                                        3: {'name': 'Bausteine kompakt',
                                            'body': ['Präsenz: Feste Posten oder Kontrollgänge '
                                                     'nach Konzept. · Kontrolle: Zugangs- und '
                                                     'Ausweisprüfung, Besucherprozesse. · '
                                                     'Reaktion: Alarmverfolgung mit '
                                                     'definierter Meldekette. · Nachweis: '
                                                     'Digitales Wachbuch, Checkpoints, '
                                                     'regelmäßiger Report.'],
                                            'h2': 'Objektschutz in Erlangen: die Bausteine',
                                            'hinweis_box': 'Wo Technik Personalstunden spart, '
                                                           'planen wir sie ins Konzept ein. → '
                                                           '/sicherheitstechnik/'},
                                        4: {'name': 'In 4 Schritten zum bewachten Objekt',
                                            'body': ['Am Anfang steht der Blick vor Ort: '
                                                     'Unsere Experten begehen Ihr Objekt '
                                                     'kostenfrei und übersetzen Risiken in ein '
                                                     'schriftliches Konzept — Besetzung, '
                                                     'Zeiten, Technik. → /sicherheitskonzept/ '
                                                     'Das transparente Angebot folgt binnen '
                                                     'eines Werktages; danach übernimmt Ihr '
                                                     'fest zugeordnetes, nach Checkliste '
                                                     'eingearbeitetes Team.'],
                                            'h2': 'Der Weg zum bewachten Erlanger Objekt'},
                                        5: {'name': 'Kosten',
                                            'body': ['Objektschutz kostet in Erlangen in der '
                                                     'Regel 26 bis 32 Euro pro Stunde netto, '
                                                     'je nach Qualifikation, Einsatzzeit und '
                                                     'Umfang. Für sensible Bereiche mit '
                                                     'besonderen Anforderungen kalkulieren wir '
                                                     'nach der Begehung; das Angebot kommt '
                                                     'innerhalb eines Werktages.'],
                                            'h2': 'Was kostet Objektschutz in Erlangen?'},
                                        6: {'name': 'FAQ (6 Fragen)',
                                            'body': ['Wie startet der Objektschutz für mein '
                                                     'Erlanger Objekt? Mit der kostenfreien '
                                                     'Begehung, danach erhalten Sie '
                                                     'Sicherheitskonzept und unverbindliches '
                                                     'Angebot innerhalb eines Werktages.',
                                                     'Können sensible Bereiche wie Labore '
                                                     'einbezogen werden? Ja — '
                                                     'Zutrittssteuerung, Besucherprozesse und '
                                                     'Kräfte mit '
                                                     'Verschwiegenheitsverpflichtung gehören '
                                                     'zum Konzept. Besondere Verhaltensregeln '
                                                     'werden vor Start eingewiesen.',
                                                     'Sind die Kräfte fest meinem Objekt '
                                                     'zugeordnet? Ja, feste Stammkräfte mit '
                                                     'dokumentierter Einarbeitung und '
                                                     'Mitsprache bei der Personalauswahl.',
                                                     'Mit welchen Monatskosten muss ich in '
                                                     'Erlangen rechnen? Das Besetzungsmodell '
                                                     'entscheidet: Der werktägliche '
                                                     'Nachtposten bewegt sich grob zwischen '
                                                     '4.000 und 6.000 Euro netto im Monat, mit '
                                                     'Technik-Anteil oft deutlich darunter.',
                                                     'Kann ich die Rundgänge nachvollziehen? '
                                                     'Jederzeit, jede Runde hinterlässt '
                                                     'Checkpoint-Stempel mit Uhrzeit, '
                                                     'gesammelt im Report, den Sie regelmäßig '
                                                     'erhalten.',
                                                     'Bietet FRANKONIA in Erlangen weitere '
                                                     'Leistungen an? Ja — Werkschutz, '
                                                     'Brandwache, Baustellenbewachung und '
                                                     'mehr: → /sicherheitsdienst-erlangen/'],
                                            'h2': 'Objektschutz Erlangen: die häufigsten '
                                                  'Fragen'},
                                        7: {'name': 'Abschluss-CTA',
                                            'body': ['Kurz das Objekt beschreiben, kostenfreie '
                                                     'Begehung, Angebot in einem Werktag.'],
                                            'h2': 'Jetzt Objektschutz für Erlangen anfragen',
                                            'form_title': 'Ihre Objektschutz-Anfrage Erlangen',
                                            'related': 'Alles zum Objektschutz → '
                                                       '/objektschutz/ · Sicherheitsdienst '
                                                       'Erlangen → '
                                                       '/sicherheitsdienst-erlangen/'}}},
 'werkschutz-erlangen': {'docx': '2026-08-04 Webtext 44 Kombi Werkschutz Erlangen.docx',
                         'meta': {'URL': 'URL: /werkschutz-erlangen/',
                                  'Title': 'Title (55 Zeichen): Werkschutz Erlangen | '
                                           'Industrie-Schutz 24/7 – FRANKONIA',
                                  'Meta-Description': 'Meta-Description (145 Zeichen): '
                                                      'Werkschutz in Erlangen: Pforte, '
                                                      'Rundgänge & Anlagen-Bedienung für '
                                                      'Entwicklung und Produktion, '
                                                      'technik-geschulte Kräfte. Angebot in '
                                                      'einem Werktag.',
                                  'Schema': 'Schema: Service (areaServed Erlangen) + FAQPage + '
                                            'BreadcrumbList',
                                  'Interne Links': 'Interne Links: /werkschutz/ · '
                                                   '/sicherheitsdienst-erlangen/ · '
                                                   '/objektschutz-erlangen/ · /angebot/'},
                         'sections': {1: {'name': 'Hero',
                                          'body': ['Zutrittssteuerung für Entwicklung, '
                                                   'Prototypen und sensible Bereiche',
                                                   'Fremdfirmen- und Besucherprozesse, sauber '
                                                   'dokumentiert',
                                                   'Fester Ansprechpartner, 24/7 direkt '
                                                   'erreichbar'],
                                          'badge': 'Einsatzgebiet Erlangen — Werkschutz für '
                                                   'Entwicklung und Produktion',
                                          'h1': 'Werkschutz Erlangen',
                                          'subline': 'In Erlangen schützt Werkschutz vor allem '
                                                     'eines: Wissen. Pforte, Zutrittssteuerung '
                                                     'und Rundgänge für Entwicklungs- und '
                                                     'Produktionsstandorte, durch '
                                                     'technik-geschulte, IHK-qualifizierte '
                                                     'Kräfte.',
                                          'cta': 'Unverbindliches Angebot einholen · CTA '
                                                 'sekundär: +49 951 964352-0'},
                                      2: {'name': 'Der Erlanger Kontext (Eigencontent)',
                                          'body': ['Erlangens Industrie ist forschungsnah: '
                                                   'Medizintechnik, Energie, Automatisierung — '
                                                   'Standorte, an denen Prototypen neben der '
                                                   'Fertigung stehen und täglich Externe ein- '
                                                   'und ausgehen. Das größte Risiko läuft hier '
                                                   'nicht durchs Tor hinaus, sondern unbemerkt '
                                                   'durch offene Prozesse.',
                                                   'Am Empfang und Tor: Besucher- und '
                                                   'Fremdfirmen-Management mit Ausweis- und '
                                                   'Unterweisungs-Check.',
                                                   'In sensiblen Bereichen: Zutrittssteuerung '
                                                   'nach Ihrem Berechtigungskonzept, '
                                                   'dokumentiert, nicht diskutiert.',
                                                   'In Produktion und Lager: Rundgänge mit '
                                                   'Blick für Anlagen, Brandlasten und offene '
                                                   'Zugänge.'],
                                          'h2': 'Wo Entwicklung und Produktion zusammenkommen, '
                                                'ist Werkschutz Wissensschutz'},
                                      3: {'name': 'Haftung & Nachweis',
                                          'body': ['Zertifizierungs-Audits, '
                                                   'Kundenanforderungen, Versicherungsfragen: '
                                                   'Erlanger Standorte müssen '
                                                   'Sicherheitsprozesse nachweisen können. '
                                                   'FRANKONIA liefert die Grundlage — '
                                                   'Wachbuch, Torbuch, Checkpoint-Nachweise '
                                                   'und regelmäßige Reports, vergabetauglich '
                                                   'und prüffest.'],
                                          'h2': 'Dokumentation, die im Audit und im '
                                                'Schadensfall trägt'},
                                      4: {'name': 'Besetzungsmodelle',
                                          'body': ['Ob repräsentativer Empfang mit '
                                                   'Sicherheitsfunktion, Randzeiten-Schutz '
                                                   'oder durchgehende Pforte: Das kostenfreie '
                                                   'Sicherheitskonzept zeigt das '
                                                   'wirtschaftlichste Modell für Ihren '
                                                   'Standort. Bei einem Großkunden sparte ein '
                                                   'neues Einsatzkonzept 30 % Personalkosten, '
                                                   'bei gleicher Sicherheit.'],
                                          'h2': 'Vom Empfangs-nahen Tagdienst bis zur '
                                                '24/7-Pforte in Erlangen'},
                                      5: {'name': 'Kosten',
                                          'body': ['Werkschutz kostet in Erlangen in der Regel '
                                                   '26 bis 32 Euro pro Stunde netto, '
                                                   'technik-geschulte Kräfte und '
                                                   'Zusatzqualifikationen am oberen Ende, '
                                                   'tarifliche Zuschläge kommen hinzu. Ein '
                                                   '24/7-Posten wird individuell kalkuliert; '
                                                   'das Angebot folgt innerhalb eines '
                                                   'Werktages nach der Begehung.'],
                                          'h2': 'Was kostet Werkschutz in Erlangen?'},
                                      6: {'name': 'FAQ (6 Fragen)',
                                          'body': ['Wie schützt FRANKONIA unser Know-how '
                                                   'konkret? Durch konsequente '
                                                   'Zutrittssteuerung, dokumentierte Besucher- '
                                                   'und Fremdfirmenprozesse und Kräfte mit '
                                                   'Verschwiegenheitsverpflichtung, '
                                                   'eingewiesen auf Ihr Berechtigungskonzept.',
                                                   'Können die Kräfte unsere Anlagen bedienen? '
                                                   'Ja, technik-geschult und nach Checkliste '
                                                   'in Ihre Brandmelde-, Alarm- und '
                                                   'Zutrittsanlagen eingearbeitet. Die '
                                                   'Einarbeitung wird dokumentiert.',
                                                   'Übernimmt FRANKONIA auch nur Nacht- und '
                                                   'Wochenendschichten? Ja, vom '
                                                   'Randzeiten-Schutz bis zur durchgehenden '
                                                   'Pforte ist jedes Modell möglich.',
                                                   'Passt der Werkschutz zu '
                                                   'Audit-Anforderungen? Ja — Wachbuch, '
                                                   'Torbuch und Reports sind prüffest '
                                                   'dokumentiert; FRANKONIA selbst ist '
                                                   'DIN-77200-1- und ISO-9001-zertifiziert '
                                                   '(DEKRA).',
                                                   'Wie schnell kann der Werkschutz in '
                                                   'Erlangen starten? Nach Begehung und '
                                                   'Angebot je nach Besetzungsmodell zeitnah — '
                                                   'Verstärkung nach Absprache: +49 951 '
                                                   '964352-0.',
                                                   'Was bietet FRANKONIA in Erlangen noch an? '
                                                   'Objektschutz, Brandwache, '
                                                   'Baustellenbewachung und mehr: → '
                                                   '/sicherheitsdienst-erlangen/'],
                                          'h2': 'Werkschutz Erlangen: die häufigsten Fragen'},
                                      7: {'name': 'Abschluss-CTA',
                                          'body': ['Standort und Anforderungen kurz '
                                                   'beschreiben — Begehung kostenfrei, Angebot '
                                                   'in einem Werktag.'],
                                          'h2': 'Jetzt Werkschutz für Erlangen anfragen',
                                          'form_title': 'Ihre Werkschutz-Anfrage Erlangen',
                                          'related': 'Alles zum Werkschutz → /werkschutz/ · '
                                                     'Sicherheitsdienst Erlangen → '
                                                     '/sicherheitsdienst-erlangen/'}}},
 'baustellenbewachung-erlangen': {'docx': '2026-08-04 Webtext 45 Kombi Baustellenbewachung '
                                          'Erlangen.docx',
                                  'meta': {'URL': 'URL: /baustellenbewachung-erlangen/',
                                           'Title': 'Title (54 Zeichen): Baustellenbewachung '
                                                    'Erlangen | Schutz 24/7 – FRANKONIA',
                                           'Meta-Description': 'Meta-Description (145 '
                                                               'Zeichen): Baustellenbewachung '
                                                               'in Erlangen: Schutz für '
                                                               'Campus-, Wohn- & '
                                                               'Gewerbeprojekte vor Diebstahl '
                                                               '& Vandalismus, dokumentiert. '
                                                               'Angebot in einem Werktag.',
                                           'Schema': 'Schema: Service (areaServed Erlangen) + '
                                                     'FAQPage + BreadcrumbList',
                                           'Interne Links': 'Interne Links: '
                                                            '/baustellenbewachung/ · '
                                                            '/sicherheitsdienst-erlangen/ · '
                                                            '/brandwache-erlangen/ · '
                                                            '/angebot/'},
                                  'sections': {1: {'name': 'Hero',
                                                   'body': ['Nacht- und Wochenendbewachung '
                                                            'oder Kontrollen zu variierenden '
                                                            'Zeiten',
                                                            'Zufahrtskontrolle für '
                                                            'Lieferverkehr und Subunternehmer',
                                                            'Dokumentation für Bauherren, '
                                                            'Partnerfirmen und Versicherung'],
                                                   'badge': 'Einsatzgebiet Erlangen — '
                                                            'Bewachung, die dem Bau folgt',
                                                   'h1': 'Baustellenbewachung Erlangen',
                                                   'subline': 'Erlangen entwickelt sich im '
                                                              'Großformat, und Großprojekte '
                                                              'ziehen Täter an. FRANKONIA '
                                                              'schützt Baustellen in Erlangen '
                                                              'mit Konzepten je Bauphase.',
                                                   'cta': 'Unverbindliches Angebot einholen · '
                                                          'CTA sekundär: +49 951 964352-0'},
                                               2: {'name': 'Die Erlanger Baustellen-Lage '
                                                           '(Eigencontent)',
                                                   'body': ['Zwischen Campus-Entwicklung im '
                                                            'Süden, Klinik-Bauten und '
                                                            'wachsenden Wohnquartieren gehört '
                                                            'Erlangen zu den aktivsten '
                                                            'Bauräumen der Region. Auf den '
                                                            'Flächen stehen Großgerät, '
                                                            'Gebäudetechnik und Material über '
                                                            'Monate, nachts oft ohne jede '
                                                            'Kontrolle.',
                                                            'Campus- und Großprojekte: '
                                                            'Weitläufige Flächen, viele '
                                                            'Gewerke, lange Laufzeiten, feste '
                                                            'Posten in kritischen Phasen, '
                                                            'kombiniert mit Technik.',
                                                            'Wohnquartiere: Innerstädtische '
                                                            'Baustellen mit offenen Zugängen — '
                                                            'Kontrollen zu unvorhersehbaren '
                                                            'Zeiten schrecken ab.',
                                                            'Klinik- und Institutsbauten: '
                                                            'Bauen neben laufendem Betrieb — '
                                                            'Bewachung, die Baustelle und '
                                                            'Bestand zusammendenkt.'],
                                                   'h2': 'Warum Baustellen in Erlangen bewacht '
                                                         'werden müssen'},
                                               3: {'name': 'Konzept je Bauphase',
                                                   'body': ['Großprojekte laufen in Wellen, '
                                                            'und der Schutzbedarf mit ihnen: '
                                                            'Rohbauphasen mit Großgerät '
                                                            'verlangen Präsenz, der Ausbau '
                                                            'eher Kontrolle und '
                                                            'Zutrittsdisziplin, die Tage vor '
                                                            'Übergabe Sonderschutz für '
                                                            'verbaute Technik. FRANKONIA plant '
                                                            'je Welle neu. Heißarbeiten '
                                                            'sichern wir mit der '
                                                            'vorgeschriebenen Brandwache ab. → '
                                                            '/brandwache-erlangen/'],
                                                   'h2': 'Vom ersten Bauzaun bis zur '
                                                         'Schlüsselübergabe in Erlangen'},
                                               4: {'name': 'Nachweisbar bewacht',
                                                   'body': ['Je mehr Gewerke, desto wichtiger '
                                                            'die saubere Beweislage: Das '
                                                            'Wächterkontrollsystem stempelt '
                                                            'jede Runde, Zufahrten und '
                                                            'Feststellungen landen mit Foto im '
                                                            'Protokoll. Bei Diskussionen '
                                                            'zwischen Bauherr, Partnerfirmen '
                                                            'und Versicherern zählt diese '
                                                            'Dokumentation.'],
                                                   'h2': 'Jede Runde belegt, wichtig bei '
                                                         'vielen Beteiligten'},
                                               5: {'name': 'Kosten',
                                                   'body': ['Der Stundensatz für Erlanger '
                                                            'Baustellen liegt zwischen 25 und '
                                                            '35 Euro netto plus tarifliche '
                                                            'Zuschläge. Wir bepreisen nach '
                                                            'Bauphasen statt pauschal, '
                                                            'verschiebt sich der Zeitplan, '
                                                            'zieht die Kalkulation mit. '
                                                            'Angebot: ein Werktag nach '
                                                            'Begehung.'],
                                                   'h2': 'Was kostet Baustellenbewachung in '
                                                         'Erlangen?'},
                                               6: {'name': 'FAQ (6 Fragen)',
                                                   'body': ['Wie schnell ist meine Erlanger '
                                                            'Baustelle geschützt? Die erste '
                                                            'Besetzung organisieren wir nach '
                                                            'Absprache auch sehr zeitnah, '
                                                            'melden Sie akute Fälle direkt der '
                                                            'Einsatzleitung: +49 951 964352-0.',
                                                            'Reicht ein Wochenend-Schutz für '
                                                            'meine Erlanger Baustelle? Oft ja, '
                                                            'die meisten Vorfälle passieren '
                                                            'nachts und am Wochenende. Die '
                                                            'kostenfreie Begehung liefert die '
                                                            'Empfehlung samt Kostenvergleich.',
                                                            'Eignet sich die Bewachung für '
                                                            'Großprojekte mit vielen Gewerken? '
                                                            'Ja — Zufahrtsprotokolle, '
                                                            'Subunternehmer-Kontrolle und '
                                                            'abgestimmte Meldeketten sind für '
                                                            'solche Projekte gemacht.',
                                                            'Wie kalkuliere ich die Bewachung '
                                                            'fürs Gesamtprojekt? Je '
                                                            'Bauabschnitt, als Anhaltspunkt: '
                                                            'Das Wochenend-Paket von Freitag '
                                                            'bis Montag liegt grob im Bereich '
                                                            '1.550 bis 1.900 Euro netto.',
                                                            'Lässt sich die Bewachung mit '
                                                            'Technik kombinieren? Ja, auf '
                                                            'weitläufigen Campus-Flächen sind '
                                                            'Videotürme plus Kontrollen oft '
                                                            'die wirtschaftlichste Lösung. '
                                                            'Geplant wird beides in einem '
                                                            'Konzept. → /sicherheitstechnik/',
                                                            'Stellt FRANKONIA auch die '
                                                            'Brandwache bei Heißarbeiten? Ja, '
                                                            'aus einer Hand mit der Bewachung, '
                                                            'inklusive Nachkontrolle: → '
                                                            '/brandwache-erlangen/'],
                                                   'h2': 'Baustellenbewachung Erlangen: die '
                                                         'häufigsten Fragen'},
                                               7: {'name': 'Abschluss-CTA',
                                                   'body': ['Baustelle, Bauphase und Zeitraum '
                                                            'kurz beschreiben — Begehung '
                                                            'kostenfrei, Angebot in einem '
                                                            'Werktag.'],
                                                   'h2': 'Jetzt Baustellenbewachung für '
                                                         'Erlangen anfragen',
                                                   'form_title': 'Ihre Baustellen-Anfrage '
                                                                 'Erlangen',
                                                   'related': 'Alles zur Baustellenbewachung → '
                                                              '/baustellenbewachung/ · '
                                                              'Sicherheitsdienst Erlangen → '
                                                              '/sicherheitsdienst-erlangen/'}}},
 'brandwache-fuerth': {'docx': '2026-08-04 Webtext 46 Kombi Brandwache Fuerth.docx',
                       'meta': {'URL': 'URL: /brandwache-fuerth/',
                                'Title': 'Title (57 Zeichen): Brandwache Fürth | '
                                         'Brandsicherheitswache 24/7 – FRANKONIA',
                                'Meta-Description': 'Meta-Description (147 Zeichen): '
                                                    'Brandwache in Fürth: BMA-Ausfall, '
                                                    'Heißarbeiten & Veranstaltungen, '
                                                    'qualifizierte Brandsicherheitswachen, '
                                                    'lückenlos dokumentiert. Jetzt 24/7 '
                                                    'anrufen.',
                                'Schema': 'Schema: Service (areaServed Fürth) + FAQPage + '
                                          'BreadcrumbList',
                                'Interne Links': 'Interne Links: /brandwache/ · '
                                                 '/sicherheitsdienst-fuerth/ · '
                                                 '/baustellenbewachung-fuerth/ · /angebot/'},
                       'sections': {1: {'name': 'Hero (Notfall-Variante)',
                                        'body': ['Kräfte mit § 34a GewO und '
                                                 'Brandschutzhelfer-Qualifikation',
                                                 'Abstimmung mit Behörde und Versicherer '
                                                 'inklusive',
                                                 'Jede Runde dokumentiert, als belastbarer '
                                                 'Nachweis'],
                                        'badge': 'Einsatzgebiet Fürth — 24/7 erreichbare '
                                                 'Einsatzleitung',
                                        'h1': 'Brandwache Fürth',
                                        'subline': 'BMA-Störung, Heißarbeiten oder '
                                                   'Veranstaltungs-Auflage in Fürth? FRANKONIA '
                                                   'stellt qualifizierte '
                                                   'Brandsicherheitswachen, nach Absprache '
                                                   'auch kurzfristig.',
                                        'cta': 'Jetzt anrufen: +49 951 964352-0 · CTA '
                                               'sekundär: Unverbindliches Angebot einholen'},
                                    2: {'name': 'Typische Fürther Einsatzlagen (Eigencontent)',
                                        'body': ['Sanierung im Bestand: Fürths denkmalgeprägte '
                                                 'Innenstadt wird laufend saniert — Dach- und '
                                                 'Schweißarbeiten am Altbau verlangen Wache '
                                                 'plus Nachkontrolle nach '
                                                 'Schweißerlaubnisschein.',
                                                 'BMA-Ausfall in Handel und Gewerbe: Störung '
                                                 'oder Wartung der Brandmeldeanlage, die '
                                                 'Behörde verlangt sofortigen Ersatz. Wir '
                                                 'besetzen, bis die Anlage wieder läuft.',
                                                 'Veranstaltungen und Kirchweih-Zeit: Wenn die '
                                                 'Innenstadt voll ist, legen Behörden '
                                                 'Brandsicherheitswachen auf, wir stellen und '
                                                 'stimmen direkt mit den Stellen ab.',
                                                 'Produktion und Lager: Sprinkler '
                                                 'bereichsweise außer Betrieb, erhöhte '
                                                 'Brandlast — Wachen als Auflage des '
                                                 'Versicherers.'],
                                        'h2': 'Wann in Fürth eine Brandwache gefordert wird'},
                                    3: {'name': 'Ablauf kompakt',
                                        'body': ['Mit Ihrem Anruf beginnt die Planung: Wir '
                                                 'prüfen die Auflage, legen Rundenintervalle '
                                                 'und Qualifikation fest und starten zum '
                                                 'vereinbarten Zeitpunkt, bei Altbau-Projekten '
                                                 'inklusive Blick auf Gerüst- und '
                                                 'Zugangssituation. Verlängerungen regelt ein '
                                                 'Anruf beim Einsatzleiter.'],
                                        'h2': 'Von der Auflage zur laufenden Wache in Fürth'},
                                    4: {'name': 'Warum FRANKONIA',
                                        'body': ['Nachweisbar besetzt: Fester '
                                                 'Mitarbeiterstamm, dokumentierte Übergaben, '
                                                 'eine unbesetzte Schicht wäre ein '
                                                 'Auflagen-Verstoß mit Folgen bis zum '
                                                 'Nutzungsverbot.',
                                                 'Bestands-Erfahrung: Altbau, Gerüst, enge '
                                                 'Zugänge, unsere Kräfte kennen die '
                                                 'Besonderheiten historischer Gebäude.',
                                                 'Behördenfest dokumentiert: Wachbuch mit '
                                                 'Rundenprotokoll, verwertbar für '
                                                 'Bauordnungsamt, Feuerwehr und Versicherer.'],
                                        'h2': 'Bei Pflicht-Wachen zählt jede Schicht'},
                                    5: {'name': 'Kosten',
                                        'body': ['Fürther Wachen kalkulieren wir wie überall '
                                                 'offen: 26 bis 32 Euro netto je Stunde, der '
                                                 'konkrete Satz hängt an Qualifikation, '
                                                 'Uhrzeit und Vorlauf. Notfälle bepreisen wir '
                                                 'direkt am Telefon, geplante Einsätze '
                                                 'schriftlich binnen eines Werktages.'],
                                        'h2': 'Was kostet eine Brandwache in Fürth?'},
                                    6: {'name': 'FAQ (6 Fragen)',
                                        'body': ['Wie kurzfristig gibt es eine Brandwache in '
                                                 'Fürth? Die Einsatzleitung nimmt Ihren Fall '
                                                 'rund um die Uhr an und organisiert die '
                                                 'Besetzung nach Absprache: +49 951 964352-0.',
                                                 'Wer schreibt die Brandwache vor? Je nach '
                                                 'Fall Bauordnungsamt oder Feuerwehr, Ihr '
                                                 'Versicherer oder die Baustellenordnung. '
                                                 'Details: → '
                                                 '/ratgeber/brandwache-wann-vorgeschrieben/',
                                                 'Welche Qualifikation haben die Fürther '
                                                 'Wachen? Die Kombination aus § '
                                                 '34a-Qualifikation und DGUV-Brandschutzhelfer '
                                                 'ist bei uns Mindeststandard, geht Ihre '
                                                 'Auflage darüber hinaus, besetzen wir '
                                                 'entsprechend.',
                                                 'Übernimmt FRANKONIA Wachen bei '
                                                 'Altbau-Sanierungen? Ja, inklusive der '
                                                 'vorgeschriebenen Nachkontrolle nach '
                                                 'Heißarbeiten, die bei alten '
                                                 'Holzkonstruktionen besonders zählt.',
                                                 'Was passiert, wenn meine BMA länger ausfällt '
                                                 'als geplant? Die Wache läuft weiter — '
                                                 'Verlängerungen sind ein Anruf bei Ihrem '
                                                 'Einsatzleiter. Sie zahlen nur geleistete '
                                                 'Stunden.',
                                                 'Was bietet FRANKONIA in Fürth noch an? '
                                                 'Objektschutz, Werkschutz, '
                                                 'Baustellenbewachung und mehr: → '
                                                 '/sicherheitsdienst-fuerth/'],
                                        'h2': 'Brandwache Fürth: die häufigsten Fragen'},
                                    7: {'name': 'Abschluss-CTA',
                                        'body': ['+49 951 964352-0, rund um die Uhr. Für '
                                                 'geplante Wachen: Formular, Angebot in einem '
                                                 'Werktag.'],
                                        'h2': 'Brandwache für Fürth benötigt? Ein Anruf genügt',
                                        'form_title': 'Ihre Brandwache-Anfrage Fürth',
                                        'related': 'Alles zur Brandwache → /brandwache/ · '
                                                   'Sicherheitsdienst Fürth → '
                                                   '/sicherheitsdienst-fuerth/'}}},
 'objektschutz-fuerth': {'docx': '2026-08-04 Webtext 47 Kombi Objektschutz Fuerth.docx',
                         'meta': {'URL': 'URL: /objektschutz-fuerth/',
                                  'Title': 'Title (56 Zeichen): Objektschutz Fürth | Ihr '
                                           'Objekt 24/7 bewacht – FRANKONIA',
                                  'Meta-Description': 'Meta-Description (144 Zeichen): '
                                                      'Objektschutz in Fürth: Bestreifung, '
                                                      'Zugangskontrolle & Alarmverfolgung für '
                                                      'Handel, Gewerbe & Büro. '
                                                      'DEKRA-zertifiziert, Angebot in einem '
                                                      'Werktag.',
                                  'Schema': 'Schema: Service (areaServed Fürth) + FAQPage + '
                                            'BreadcrumbList',
                                  'Interne Links': 'Interne Links: /objektschutz/ · '
                                                   '/sicherheitsdienst-fuerth/ · '
                                                   '/kaufhausdetektei/ · /angebot/'},
                         'sections': {1: {'name': 'Hero',
                                          'body': ['IHK-qualifizierte Kräfte nach § 34a GewO, '
                                                   'DEKRA-zertifiziertes System',
                                                   'Digitales Wachbuch mit Checkpoint-Nachweis '
                                                   'je Runde',
                                                   'Unverbindliches Angebot innerhalb eines '
                                                   'Werktages'],
                                          'badge': 'Einsatzgebiet Fürth, feste Teams direkt im '
                                                   'Objekt',
                                          'h1': 'Objektschutz Fürth',
                                          'subline': 'Bestreifung, Zugangskontrolle und '
                                                     'Alarmverfolgung für Ihr Fürther Objekt, '
                                                     'dokumentiert, zertifiziert, mit festem '
                                                     'Ansprechpartner.',
                                          'cta': 'Unverbindliches Angebot einholen · CTA '
                                                 'sekundär: +49 951 964352-0'},
                                      2: {'name': 'Diese Fürther Objekte schützt FRANKONIA '
                                                  '(Eigencontent)',
                                          'body': ['Handel und Filialen: Zwischen Fürther '
                                                   'Freiheit und Stadtteilzentren, sichtbare '
                                                   'Präsenz gegen Diebstahl und Vandalismus, '
                                                   'kombinierbar mit zivilen Detektiven. → '
                                                   '/kaufhausdetektei/',
                                                   'Gewerbe auf der Hardhöhe und im '
                                                   'Stadtgebiet: Nachts verwaiste Areale mit '
                                                   'Produktions- und Lagerwerten, '
                                                   'dokumentierte Kontrollen und '
                                                   'Verschlusskonzepte.',
                                                   'Büro- und Verwaltungsgebäude: Schutz für '
                                                   'Mitarbeitende, IT und Unterlagen, plus '
                                                   'Alarmverfolgung außerhalb der '
                                                   'Geschäftszeiten.',
                                                   'Wohn- und Mischobjekte: Hausverwaltungen '
                                                   'und Eigentümer sichern Tiefgaragen, '
                                                   'Zugänge und Gemeinschaftsflächen, '
                                                   'präventiv statt reaktiv.'],
                                          'h2': 'Vom Handelsobjekt bis zum Gewerbepark in '
                                                'Fürth'},
                                      3: {'name': 'Das Risiko in Zahlen (kompakt)',
                                          'body': ['Ein einziger Einbruch kostet mit '
                                                   'Betriebsunterbrechung und '
                                                   'Versicherungsärger oft mehr als ein Jahr '
                                                   'professioneller Bewachung. Und der leise '
                                                   'Verlust läuft weiter: Diebstahl über '
                                                   'unkontrollierte Zugänge, Vandalismus, '
                                                   'unbemerkte Schäden am Wochenende. '
                                                   'Objektschutz ist Prävention, und Ihr '
                                                   'dokumentierter Nachweis im Ernstfall.'],
                                          'h2': 'Was ein unbewachtes Objekt in Fürth kostet'},
                                      4: {'name': 'In 4 Schritten zum bewachten Objekt',
                                          'body': ['Sie melden sich, wir kommen vorbei: Die '
                                                   'kostenfreie Begehung klärt Zugänge, '
                                                   'Risiken und vorhandene Technik. Daraus '
                                                   'entsteht Ihr schriftliches '
                                                   'Sicherheitskonzept samt Preisrahmen — → '
                                                   '/sicherheitskonzept/, und binnen eines '
                                                   'Werktages das Angebot. Den Rest erledigt '
                                                   'Ihr festes, eingearbeitetes Team.'],
                                          'h2': 'Von der Anfrage zum bewachten Fürther Objekt'},
                                      5: {'name': 'Kosten',
                                          'body': ['Objektschutz kostet in Fürth in der Regel '
                                                   '26 bis 32 Euro pro Stunde netto, je nach '
                                                   'Qualifikation, Einsatzzeit und Umfang. Oft '
                                                   'senkt die Kombination mit Alarm- und '
                                                   'Videotechnik die Gesamtkosten deutlich. '
                                                   'Ihr Angebot kommt innerhalb eines '
                                                   'Werktages nach der kostenfreien Begehung.'],
                                          'h2': 'Was kostet Objektschutz in Fürth?'},
                                      6: {'name': 'FAQ (6 Fragen)',
                                          'body': ['Wie startet der Objektschutz für mein '
                                                   'Fürther Objekt? Mit der kostenfreien '
                                                   'Begehung, danach erhalten Sie '
                                                   'Sicherheitskonzept und unverbindliches '
                                                   'Angebot innerhalb eines Werktages.',
                                                   'Sind die Kräfte fest meinem Objekt '
                                                   'zugeordnet? Ja, feste Stammkräfte mit '
                                                   'dokumentierter Einarbeitung und Mitsprache '
                                                   'bei der Personalauswahl. Kein ständiger '
                                                   'Wechsel.',
                                                   'Lohnt sich Objektschutz auch für kleinere '
                                                   'Fürther Betriebe? Ja, über passende '
                                                   'Modelle: Verschlusskonzepte, '
                                                   'Alarmverfolgung und Kontrollen statt '
                                                   'Dauerposten. Die Begehung zeigt, was '
                                                   'wirtschaftlich ist.',
                                                   'Welche Monatskosten kommen in Fürth auf '
                                                   'mich zu? Abhängig vom Modell, der '
                                                   'klassische Nachtposten an Werktagen liegt '
                                                   'inklusive Nachtzuschlag grob bei 5.500 bis '
                                                   '6.800 Euro netto; Verschlusskonzepte und '
                                                   'Technik drücken die Summe deutlich.',
                                                   'Wie kann ich die Kontrollen '
                                                   'nachvollziehen? Über unser '
                                                   'Wächterkontrollsystem: Jeder Rundgang '
                                                   'scannt Checkpoints an Ihrem Objekt, die '
                                                   'Zeitstempel stehen im Report, den Sie '
                                                   'regelmäßig bekommen.',
                                                   'Bietet FRANKONIA in Fürth weitere '
                                                   'Leistungen an? Ja — Werkschutz, '
                                                   'Brandwache, Baustellenbewachung und mehr: '
                                                   '→ /sicherheitsdienst-fuerth/'],
                                          'h2': 'Objektschutz Fürth: die häufigsten Fragen'},
                                      7: {'name': 'Abschluss-CTA',
                                          'body': ['Kurz das Objekt beschreiben, kostenfreie '
                                                   'Begehung, Angebot in einem Werktag.'],
                                          'h2': 'Jetzt Objektschutz für Fürth anfragen',
                                          'form_title': 'Ihre Objektschutz-Anfrage Fürth',
                                          'related': 'Alles zum Objektschutz → /objektschutz/ '
                                                     '· Sicherheitsdienst Fürth → '
                                                     '/sicherheitsdienst-fuerth/'}}},
 'werkschutz-fuerth': {'docx': '2026-08-04 Webtext 48 Kombi Werkschutz Fuerth.docx',
                       'meta': {'URL': 'URL: /werkschutz-fuerth/',
                                'Title': 'Title (52 Zeichen): Werkschutz Fürth | '
                                         'Industrie-Schutz 24/7 – FRANKONIA',
                                'Meta-Description': 'Meta-Description (141 Zeichen): '
                                                    'Werkschutz in Fürth: Pforte, Rundgänge & '
                                                    'Anlagen-Bedienung für Produktion und '
                                                    'Traditionsbetriebe, technik-geschult. '
                                                    'Angebot in einem Werktag.',
                                'Schema': 'Schema: Service (areaServed Fürth) + FAQPage + '
                                          'BreadcrumbList',
                                'Interne Links': 'Interne Links: /werkschutz/ · '
                                                 '/sicherheitsdienst-fuerth/ · '
                                                 '/objektschutz-fuerth/ · /angebot/'},
                       'sections': {1: {'name': 'Hero',
                                        'body': ['Pforte und Torkontrolle, die den Betrieb '
                                                 'nicht aufhält',
                                                 'Verschluss- und Kontrollrunden in Randzeiten',
                                                 'Fester Ansprechpartner, 24/7 direkt '
                                                 'erreichbar'],
                                        'badge': 'Einsatzgebiet Fürth — Werkschutz für den '
                                                 'Mittelstand',
                                        'h1': 'Werkschutz Fürth',
                                        'subline': 'Pfortendienst, Rundgänge und '
                                                   'Anlagen-Bedienung für Fürther Produktions- '
                                                   'und Traditionsbetriebe, durch '
                                                   'technik-geschulte, IHK-qualifizierte '
                                                   'Kräfte.',
                                        'cta': 'Unverbindliches Angebot einholen · CTA '
                                               'sekundär: +49 951 964352-0'},
                                    2: {'name': 'Der Fürther Kontext (Eigencontent)',
                                        'body': ['Viele Fürther Betriebe stehen genau '
                                                 'dazwischen: Werte und Auflagen wie ein '
                                                 'Großbetrieb, aber keine eigene '
                                                 'Sicherheitsabteilung. FRANKONIA stellt die '
                                                 'komplette Werkschutz-Funktion, vom Konzept '
                                                 'über die Pforte bis zur Nachtrunde. Sie '
                                                 'kaufen kein Personal, sondern ein '
                                                 'funktionierendes System.',
                                                 'Tagsüber: Pforten- und Empfangsfunktion, '
                                                 'Fremdfirmen- und Lieferverkehr-Koordination.',
                                                 'In Randzeiten: Verschlussrunden, '
                                                 'Anlagen-Checks, Alarm-Reaktion nach '
                                                 'Meldeplan.',
                                                 'Immer: Digitales Wachbuch, Torbuch und '
                                                 'regelmäßiger Report für Ihre '
                                                 'Geschäftsführung.'],
                                        'h2': 'Mittelstand in Fürth: zu groß für Wegsehen, zu '
                                              'klein für eigenen Werkschutz'},
                                    3: {'name': 'Wirtschaftlichkeit (Struktur-Variation)',
                                        'body': ['Statt Standard-Posten kalkuliert FRANKONIA '
                                                 'nach Bedarf: Welche Zeiten sind kritisch? '
                                                 'Was kann Technik übernehmen? Wo genügt die '
                                                 'Randzeiten-Besetzung? Bei einem Großkunden '
                                                 'sparte ein neues Einsatzkonzept 30 % '
                                                 'Personalkosten, bei gleicher Sicherheit. '
                                                 'Genau diese Rechnung machen wir für Ihren '
                                                 'Standort auf, kostenfrei bei der Begehung.'],
                                        'h2': 'Werkschutz in Fürth muss sich rechnen, so '
                                              'kalkulieren wir'},
                                    4: {'name': 'Kosten',
                                        'body': ['Werkschutz kostet in Fürth in der Regel 26 '
                                                 'bis 32 Euro pro Stunde netto, '
                                                 'technik-geschulte Kräfte am oberen Ende, '
                                                 'tarifliche Zuschläge für Nacht und '
                                                 'Wochenende kommen hinzu. Randzeiten-Modelle '
                                                 'senken die Monatskosten deutlich; Ihr '
                                                 'Angebot folgt innerhalb eines Werktages nach '
                                                 'der Begehung.'],
                                        'h2': 'Was kostet Werkschutz in Fürth?'},
                                    5: {'name': 'FAQ (6 Fragen)',
                                        'body': ['Lohnt sich Werkschutz auch für '
                                                 'mittelständische Betriebe? Ja, über '
                                                 'bedarfsgerechte Modelle: Pforte nur zu '
                                                 'Stoßzeiten, Verschlussrunden statt '
                                                 'Nachtposten, Technik-Kombination. Das '
                                                 'kostenfreie Sicherheitskonzept zeigt die '
                                                 'wirtschaftlichste Variante.',
                                                 'Können die Kräfte unsere Anlagen bedienen? '
                                                 'Ja, technik-geschult und nach Checkliste in '
                                                 'Ihre Brandmelde-, Alarm- und Zutrittsanlagen '
                                                 'eingearbeitet. Dokumentiert.',
                                                 'Übernimmt FRANKONIA auch nur Nacht- und '
                                                 'Wochenendschichten? Ja, vom '
                                                 'Randzeiten-Schutz bis zur durchgehenden '
                                                 'Pforte ist jedes Modell möglich.',
                                                 'Wie läuft die Fremdfirmen-Koordination? '
                                                 'Anmeldung, Unterweisungs-Check, '
                                                 'Ausweisvergabe und dokumentierte '
                                                 'Ein-/Ausfahrten, nach Ihren Vorgaben.',
                                                 'Was ist der Unterschied zwischen Werkschutz '
                                                 'und Objektschutz? Werkschutz ist die '
                                                 'spezialisierte Form für Produktionsstandorte '
                                                 'mit Pforte und Anlagen-Bedienung. Für Büro-, '
                                                 'Handels- und Gewerbeobjekte: → '
                                                 '/objektschutz-fuerth/',
                                                 'Was bietet FRANKONIA in Fürth noch an? '
                                                 'Objektschutz, Brandwache, '
                                                 'Baustellenbewachung und mehr: → '
                                                 '/sicherheitsdienst-fuerth/'],
                                        'h2': 'Werkschutz Fürth: die häufigsten Fragen'},
                                    6: {'name': 'Abschluss-CTA',
                                        'body': ['Standort und Schichtzeiten kurz beschreiben '
                                                 '— Begehung kostenfrei, Angebot in einem '
                                                 'Werktag.'],
                                        'h2': 'Jetzt Werkschutz für Fürth anfragen',
                                        'form_title': 'Ihre Werkschutz-Anfrage Fürth',
                                        'related': 'Alles zum Werkschutz → /werkschutz/ · '
                                                   'Sicherheitsdienst Fürth → '
                                                   '/sicherheitsdienst-fuerth/'}}},
 'baustellenbewachung-fuerth': {'docx': '2026-08-04 Webtext 49 Kombi Baustellenbewachung '
                                        'Fuerth.docx',
                                'meta': {'URL': 'URL: /baustellenbewachung-fuerth/',
                                         'Title': 'Title (51 Zeichen): Baustellenbewachung '
                                                  'Fürth | Schutz 24/7 – FRANKONIA',
                                         'Meta-Description': 'Meta-Description (146 Zeichen): '
                                                             'Baustellenbewachung in Fürth: '
                                                             'Schutz vor Diebstahl & '
                                                             'Vandalismus für Nachverdichtung, '
                                                             'Sanierung & Gewerbe, '
                                                             'dokumentiert. Angebot in einem '
                                                             'Werktag.',
                                         'Schema': 'Schema: Service (areaServed Fürth) + '
                                                   'FAQPage + BreadcrumbList',
                                         'Interne Links': 'Interne Links: '
                                                          '/baustellenbewachung/ · '
                                                          '/sicherheitsdienst-fuerth/ · '
                                                          '/brandwache-fuerth/ · /angebot/'},
                                'sections': {1: {'name': 'Hero',
                                                 'body': ['Nacht- und Wochenendbewachung oder '
                                                          'Kontrollen zu variierenden Zeiten',
                                                          'Zufahrtskontrolle für Lieferverkehr '
                                                          'und Subunternehmer',
                                                          'Dokumentation für Bauherren, '
                                                          'Partnerfirmen und Versicherung'],
                                                 'badge': 'Einsatzgebiet Fürth — Bewachung, '
                                                          'die dem Bau folgt',
                                                 'h1': 'Baustellenbewachung Fürth',
                                                 'subline': 'Fürth baut dicht: '
                                                            'Nachverdichtung, Sanierung, '
                                                            'Gewerbe. FRANKONIA schützt '
                                                            'Fürther Baustellen vor Diebstahl '
                                                            'und Vandalismus, mit Konzepten je '
                                                            'Bauphase.',
                                                 'cta': 'Unverbindliches Angebot einholen · '
                                                        'CTA sekundär: +49 951 964352-0'},
                                             2: {'name': 'Die Fürther Baustellen-Lage '
                                                         '(Eigencontent)',
                                                 'body': ['Fürth wächst nach innen: Baulücken '
                                                          'werden geschlossen, Bestand '
                                                          'saniert, Gewerbeflächen entwickelt. '
                                                          'Innerstädtische Baustellen sind '
                                                          'schwer abzuriegeln — Gerüste, '
                                                          'offene Zufahrten, Material im '
                                                          'öffentlichen Raum. Diese Mischung '
                                                          'zieht Gelegenheitstäter wie '
                                                          'organisierte Diebe an.',
                                                          'Nachverdichtung und Wohnbau: Enge '
                                                          'Baufelder mit vielen Zugängen — '
                                                          'Kontrollen zu unvorhersehbaren '
                                                          'Zeiten wirken hier am stärksten.',
                                                          'Sanierung im Denkmalbestand: '
                                                          'Gerüste als Einstiegshilfe, '
                                                          'wertvolle Baustoffe — Kontrolle von '
                                                          'Gerüst und Zugängen gehört zum '
                                                          'Konzept.',
                                                          'Gewerbeprojekte: Großgerät und '
                                                          'Gebäudetechnik über Wochen vor Ort, '
                                                          'feste Nachtposten in kritischen '
                                                          'Phasen.'],
                                                 'h2': 'Warum Baustellen in Fürth bewacht '
                                                       'werden müssen'},
                                             3: {'name': 'Konzept je Bauphase',
                                                 'body': ['Was heute die Baugrube ist, ist '
                                                          'morgen der Innenausbau mit '
                                                          'verbauter Haustechnik: FRANKONIA '
                                                          'passt Besetzung und '
                                                          'Kontrollrhythmus je Abschnitt an, '
                                                          'statt ein starres Paket '
                                                          'durchzuziehen. Stehen Schweiß- oder '
                                                          'Dacharbeiten an, kommt die '
                                                          'vorgeschriebene Brandwache dazu. → '
                                                          '/brandwache-fuerth/'],
                                                 'h2': 'Schutzkonzept nach Baufortschritt'},
                                             4: {'name': 'Nachweisbar bewacht',
                                                 'body': ['Ob die Runde lief, steht nicht im '
                                                          'Ermessen, sondern im Protokoll: '
                                                          'Checkpoint-Stempel je Kontrollgang, '
                                                          'Fotodokumentation bei '
                                                          'Feststellungen, lückenlose '
                                                          'Zufahrtslisten, verwertbar '
                                                          'gegenüber Bauherr, Partnern und '
                                                          'Versicherung.'],
                                                 'h2': 'Kontrolle, die Sie nachlesen können'},
                                             5: {'name': 'Kosten',
                                                 'body': ['Für Fürther Baustellen rechnen wir '
                                                          '26 bis 32 Euro netto je Stunde, '
                                                          'zuzüglich tariflicher Zuschläge. '
                                                          'Bepreist wird abschnittsweise '
                                                          'entlang Ihres Bauzeitenplans, '
                                                          'inklusive Anpassung bei Verzug. Das '
                                                          'Angebot kommt einen Werktag nach '
                                                          'der Begehung.'],
                                                 'h2': 'Was kostet Baustellenbewachung in '
                                                       'Fürth?'},
                                             6: {'name': 'FAQ (6 Fragen)',
                                                 'body': ['Wie schnell steht der Schutz auf '
                                                          'meiner Fürther Baustelle? Nach '
                                                          'einem Vorfall zählt jede Nacht, die '
                                                          'Einsatzleitung organisiert die '
                                                          'Erstbesetzung nach Absprache '
                                                          'umgehend: +49 951 964352-0.',
                                                          'Reicht ein Wochenend-Schutz für '
                                                          'meine Fürther Baustelle? Oft ja, '
                                                          'die meisten Vorfälle passieren '
                                                          'nachts und am Wochenende. Die '
                                                          'kostenfreie Begehung liefert die '
                                                          'Empfehlung samt Kostenvergleich.',
                                                          'Wie schützt FRANKONIA enge '
                                                          'Innenstadt-Baustellen? Mit '
                                                          'Fußkontrollen, Gerüst- und '
                                                          'Zugangs-Checks zu variierenden '
                                                          'Zeiten, wirksamer als starre '
                                                          'Posten, wenn das Baufeld klein und '
                                                          'die Zugänge viele sind.',
                                                          'Was kostet der Schutz übers '
                                                          'Gesamtprojekt? Das ergibt sich aus '
                                                          'Phasen und Besetzung, zur '
                                                          'Orientierung: Der klassische '
                                                          'Wochenend-Schutz (Freitagabend bis '
                                                          'Montagfrüh) liegt grob bei '
                                                          '1.550–1.900 Euro netto.',
                                                          'Kann Technik einen Teil der '
                                                          'Bewachung übernehmen? Ja, gerade '
                                                          'bei kleinen Baufeldern ersetzen '
                                                          'Alarmtechnik und Kameras teure '
                                                          'Dauerpräsenz. Wir planen beides '
                                                          'zusammen. → /sicherheitstechnik/',
                                                          'Stellt FRANKONIA auch die '
                                                          'Brandwache bei Heißarbeiten? Ja, '
                                                          'aus einer Hand mit der Bewachung, '
                                                          'inklusive Nachkontrolle: → '
                                                          '/brandwache-fuerth/'],
                                                 'h2': 'Baustellenbewachung Fürth: die '
                                                       'häufigsten Fragen'},
                                             7: {'name': 'Abschluss-CTA',
                                                 'body': ['Baustelle, Bauphase und Zeitraum '
                                                          'kurz beschreiben — Begehung '
                                                          'kostenfrei, Angebot in einem '
                                                          'Werktag.'],
                                                 'h2': 'Jetzt Baustellenbewachung für Fürth '
                                                       'anfragen',
                                                 'form_title': 'Ihre Baustellen-Anfrage Fürth',
                                                 'related': 'Alles zur Baustellenbewachung → '
                                                            '/baustellenbewachung/ · '
                                                            'Sicherheitsdienst Fürth → '
                                                            '/sicherheitsdienst-fuerth/'}}}}
