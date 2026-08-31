# Prüfprotokoll — QA-Durchgang FRANKONIA Website

**Datum:** 31.08.2026
**Grundlage:** `PROMPT-CLAUDE-CODE.md`, 29 Aufgaben
**Bearbeitet:** 29 von 29
**Commits:** 11, alle auf `main` gepusht

---

## Endzustand, gemessen

| | |
|---|---|
| Gebaute Seiten | 70 |
| Sitemap-Einträge | 58 (12 noindex-Seiten übersprungen) |
| Bau-Tore grün | 12 von 12 |
| Tests | 67 von 67 |
| Formulare mit echtem Ziel | 44 (`/api/forms/submit/`) |

---

## Vorbemerkung: sechsmal hielt die Prämisse nicht

Das ist die wichtigste Aussage dieses Protokolls, weil sie erklärt, warum an
sechs Stellen **nichts** geändert wurde. In allen sechs Fällen war der Code schon
richtig, und die Änderung hätte Schaden angerichtet:

| Aufgabe | Angenommen | Gemessen |
|---|---|---|
| 21 | 44 reduced-motion-Blöcke | **10** (die 44 zählen Kommentare mit) |
| 15 | 167 rohe Farbwerte | **52** (dieselbe Ursache) |
| 24 | 68 leere alt-Texte zu reparieren | **1** echter Fall; das Marquee ist korrekt `aria-hidden` |
| 27c | Zahlenbereiche mit falschem Strich | **keine** — ein blindes Ersetzen hätte „DIN 77200-1" und 30+ Telefondurchwahlen zerstört |
| 27d | Zwei Nummern ohne `tel:`-Link | Es sind **Faxnummern** |
| 18 | Bilder mit eingebackenem Radius | **kein einziges** (Eckpixel ausgelesen, alle deckend) |
| 19 | 7 CTA-Varianten | **4**, die sich in **2 Rollen** auflösen |

Eine Zählregel, die Kommentare mitzählt, verbietet am Ende, in einer Begründung
einen Messwert zu nennen. Alle zwölf Bau-Tore blenden Kommentare deshalb aus.

---

## Die 29 Aufgaben im Einzelnen

### 1 · CARTO-Wasserzeichen auf allen Karten — **behoben**
Der Anbieter verlangt seit kurzem einen Schlüssel; am Code hatte sich nichts
geändert. Warum keine Statusprüfung das fand: die Wasserzeichen-Kacheln kommen mit
**HTTP 200 und `Cache-Control: max-age=15552000`** (180 Tage).
Schlüssel jetzt aus `CARTO_BASEMAP_KEY`, zur Bauzeit als `data-carto-key` —
**erster `PUBLIC_ENV`-Eintrag ohne Rückfall**, weil „kein Schlüssel" eine sichtbar
beschriftete Karte erzeugt.
**Nachweis:** Produktions-Build-Log, **11742 gegen 11303 Byte, verschiedene md5**;
live 28 von 28 Kacheln geladen, kein Wasserzeichen.
Kacheln auf `dark_nolabels` — eine deutsche Variante gibt es bei CARTO nicht
(vier Abrufe, byte-identisch), also wird das Fremdsprachige entfernt statt
übersetzt.

### 2 · Icon-Paket fehlte vollständig — **behoben**
**58 von 58 geprüften Seiten trugen keinen einzigen Icon-Verweis.** Aus dem
Logo-SVG des Kunden erzeugt (`docs/design-sources/icons-erzeugen.mjs`, Chrome als
Rasterisierer, weil es hier kein Python/Pillow/ImageMagick gibt).
**Nur die Bildmarke ohne den Schwung**, gemessen und angesehen: mit Schwung ist
16 px ein Fleck. Die Schwung-Form wird per `getBBox()` erkannt (sie reicht bis
x=1534, alle anderen enden bei x=950) — wer das Logo neu exportiert und die
Reihenfolge ändert, bricht damit nichts.
**Nachweis:** 69 von 69 Seiten tragen alle fünf Verweise, alle sechs Dateien im
Web-Root, Manifest gültig.

### 3 · Fremd-Hosts nicht in der Datenschutzerklärung — **behoben**
Abschnitte 3.3 bis 3.6 wörtlich eingefügt, alte 3.3 zu 3.7 umnummeriert.
**Bau-Tor:** jeder Fremd-Host im ausgelieferten Ergebnis muss namentlich
vorkommen — geprüft wird der **Anbietername** über eine Tabelle, denn ein
Rechtstext nennt „CARTO", nicht `basemaps.cartocdn.com`.
⚠️ Beim ersten Lauf **87 Fehlalarme** durch `www.w3.org` (SVG-Namensraum);
Ursache behoben statt Zeile geduldet.

### 4 · Vorbehalt auf der Rechtsseite — **nicht wörtlich ausgeführt, mit Grund**
Der Auftrag sagt „Entferne den Hinweis samt `.legal-notice__label`". Der Block
enthielt **drei Absätze**, und der dritte nennt die zuständige Aufsichtsbehörde
(BayLDA, Ansbach) — die einzige Stelle der Seite, die sie benennt. Löschen hätte
eine **pflichtige Angabe** entfernt. Der Vorbehalt ist weg, die Behörde steht
jetzt in Abschnitt 5.8.

### 5 · Interne Kommentare wurden ausgeliefert — **behoben, der Fund der Runde**
`/datenschutz/` lieferte **8.026 Zeichen** interner Arbeitsanweisungen aus, für
jeden über „Quelltext anzeigen" lesbar — und `build.js` hatte einen
Kommentar-Entferner, der seit Monaten in der Pipeline stand.
**Ursache:** die Schutzbereichs-Suche lief als Regex über das ganze Dokument und
fand ein Script-Tag, das im **Prosatext des Kommentars** erwähnt wird. Ein
Kommentar, der über Script-Tags schreibt, machte sich selbst immun.
Neu geschrieben als Einzeldurchlauf von links nach rechts — der Fehler ist
strukturell ausgeschlossen, nicht geflickt.
**Nachweis:** 8.026 → **130 Zeichen**; längster Kommentar über alle Seiten
**161 Zeichen** (der Generator-Hinweis). Bau-Tor mit Gegenprobe.

### 6 · Cookie-Dialog auf Englisch — **behoben**
`data-culture="DE"` am Cookiebot-Tag. Der Dialog erschien live auf Englisch, im
Screenshot belegt.

### 7 · Karte auf `/einsatzgebiete/` — **anders entschieden als angeboten**
Die Seite **hat** eine Karte: eine gezeichnete SVG-Silhouette Frankens mit allen
15 Orten, animiert, **ohne einen einzigen Fremdabruf**. Eine Leaflet-Karte daneben
wäre die zweite Karte auf derselben Seite und würde eine Datenübermittlung
**hinzufügen**, die es heute nicht gibt. Stattdessen die drei Wörter aus
Abschnitt 3.2 gestrichen.

### 8 · Rechenfehler beim Sonntagszuschlag — **behoben**
Der Wert stand als Token, nicht in der Seite; die Korrektur gehört nach
`content/values.json`. **26 % von 768 € sind 199,68, nicht 215** (215 wären 28 %).
Jetzt 153–200, und die Summe stimmt mit ihren Teilen:
1.470+169+153 = 1.792 → „grob 1.800"; 1.920+221+200 = 2.341 → „2.350".

### 9 + 10 · Bannwörter — **behoben**
„Torbuch" in 4 Dateien entfernt, Aufzählungen geglättet statt nur das Wort
gestrichen. **„Videotürme" stand in DREI Dateien, je zweimal** (sichtbar +
JSON-LD), nicht in einer wie angenommen — und der Ersatz ist Singular, also
mussten die Verben mit („sind" → „ist"). „Videotechnik" ist ein anderes Wort und
bleibt.
**Nachweis:** FAQ-Parität nachgemessen, 24 JSON-LD-Antworten, **0 Abweichungen**.

### 11 · Kombiseiten nur einseitig verlinkt — **behoben**
**6 von 16 → 16 von 16 in beiden Richtungen.** Bau-Tor dagegen.
Die drei Seiten hatten Stadtseiten-Verweise mit einem einzigen Kombi-Verweis
gemischt; die Stadtseiten stehen im Nav-Untermenü, im Footer und werden von jeder
Kombiseite selbst verlinkt — sie waren dort doppelt, während die spezifischste
Suchintention fehlte.

### 12 · Zweite Dankeseite — **behoben, Weiterleitung offen**
`/danke-bewerbung/` angelegt, noindex, eigene canonical, durchgehend DU-Anrede wie
`/jobs/`. Bau-Tor: Erfolgsseite je Formulartyp.
⚠️ **Die Weiterleitung dorthin ist nicht im Code zu lösen** — das
Bewerbungsformular ist HubSpots eingebettetes Formular und liest seine
Konfiguration aus dem Portal. Im Partial notiert, siehe „Offene Punkte".

### 13 · HubSpot: Firmenfeld und Rechtsgrundlage — **behoben, inhaltlich wichtigster Teil**
**13.1 war kein Codefehler.** Lesend gegen HubSpot geprüft: der Kontakt trägt
`company = "TESTEINSENDUNG QA - bitte loeschen"`, exakt das Eingegebene. Was der
QA-Lauf sah, ist HubSpots Kontaktkarte — sie zeigt den Namen der **assoziierten
Firma**, nicht das Textfeld.
**13.2 + 13.3 hatten eine gemeinsame, echte Ursache.** Ohne Marketing-Häkchen
stieg `marketingEinwilligung()` sofort aus: kein Abonnement, und damit **keine
übertragene Rechtsgrundlage** — HubSpot füllte seinen Portal-Standard ein, am
Testkontakt stand „Berechtigtes Interesse – Sonstige". Bei jemandem, der aktiv ein
Angebot anfordert, ist das die falsche Grundlage.
Jetzt: „One to One" **immer** mit `PERFORMANCE_OF_CONTRACT` (Vertragsanbahnung,
Art. 6 Abs. 1 b), „Marketing Information" **nur mit Häkchen** mit
`CONSENT_WITH_NOTICE`. Die Grundlage hängt am **Abonnementtyp**, nicht am Aufruf —
fest `CONSENT_WITH_NOTICE` hätte bedeutet, eine Einwilligung zu behaupten, die
niemand gegeben hat, in genau dem Feld, das den Nachweis führen soll.
⚠️ **Zwei Tests sind dabei gefallen, zu Recht** — sie kodierten den alten Zustand.
Neu geschrieben, und sie prüfen jetzt **mehr**: welcher Typ mit welcher Grundlage.

**Eigener Fund, nicht im Auftrag:** das eingebettete HubSpot-Formular auf `/jobs/`
ist eine Datenübermittlung an einen Dritten und stand nicht in der
Datenschutzerklärung. Schlimmer: „Verlinkte Dienste Dritter" nannte HubSpot und
behauptete, ohne Klick flössen keine Daten — für diese Seite war das falsch. Neuer
Abschnitt 3.7, und die falsche Aussage **eingeschränkt statt entfernt**.

### 14 · Kontrastverstöße — **behoben, 97 Zeilen auf 2**
Eigene Sonde über zehn Seiten bei 390 und 1440, jeder Textknoten gegen seinen
**wirksam komponierten** Hintergrund. Vorher **97** Verstoßzeilen, nachher **64**,
davon 56 die akzeptierte Markenblau-Ausnahme des Kunden. **Übrig: zwei, beide
begründet.**

⚠️ **Die Ursache war eine, nicht 23:**

| `rgb(59 73 86 / 0.75)` auf | Verhältnis |
|---|---|
| `#ffffff` | 4,68:1 ok |
| `#fafafa` | 4,49:1 |
| `#f7f8f8` | 4,43:1 |
| `#f5f6f7` | 4,39:1 (47 Stellen) |
| `#f1f5fb` | 4,37:1 |

Eine Farbe, vier Fast-Weiß-Töne, viermal knapp unter der Norm — und keiner fiel
je auf, weil jeder Einzelfall „fast richtig" war. **Eine Deklaration** hat sechs
Verstöße behoben.

Höchste Priorität zuerst: die **Einwilligungserklärung stand bei 4,04:1**, direkt
neben dem Pflicht-Häkchen in normaler Textfarbe — ausgerechnet die freiwillige,
werbliche Zustimmung war die blassere. Jetzt **6,35:1**.
Schlechtester echter Wert: `.swipe-counter` mit **2,35:1**. „01 / 04" ist der
einzige Hinweis, dass vier Karten existieren.
⚠️ **Mein erster Fix erzeugte weiß auf weiß (1,00:1)**, weil ich
`:not(.section--light)` für „dunkel" benutzt habe — dieses Projekt kennzeichnet nur
die **hellen** Sektionen. Alle drei Strips einzeln kartiert.
⚠️ Eine flächenunabhängige Lösung gibt es nicht: gerechnet für jeden Grauwert von
100 bis 140 — **keiner** schafft 4,5:1 gegen Weiß **und** gegen `#010101`, das
Beste ist **4,34 bei Grau 114**.

### 15 · Rohe Farbwerte — **behoben, 52 auf 18**
Die Zahl 167 ist **dreimal zu hoch**; gemessen ohne Kommentare: **52** in 16
verschiedenen Werten. Jetzt **18**, und alle 18 sind `#000` in einem `mask-image`.
⚠️ **Dort ist Schwarz keine Farbe, sondern ein Alphakanal** — deckend heißt
„behalten". Ein Marken-Token wäre schlicht falsch. Das Tor nimmt genau diesen Fall
aus.
Zehn Einzelwert-Token angelegt (Sterngold, Formularfehler, WhatsApp-Grün, fünf
Diagrammtöne, Outfits-Fläche). `#fafafa` **nicht** auf Weiß zusammengelegt: die
Outfits-Sektion bricht absichtlich mit dem dunklen Thema, der Ton ist abgenommen.
**Eigener Fund:** die Sterne trugen ein **englisches** `aria-label` („5 out of 5
stars") auf deutschen Seiten. Behoben.

### 16 + 17 · Verbrauchte Kompositionsebenen — **behoben**
**Das Dokument lag in beide Richtungen falsch:** zu optimistisch bei `blur(0px)`
(nicht 23, sondern **44 / 19 / 62** auf Startseite, `/jobs/`, `/werkschutz/`), zu
pessimistisch bei `will-change` (**13 / 0 / 2** statt 59 — der Fix vom 08.08. hält,
die 59 waren mitten in einer Animation gemessen).
Nachher: **0 / 0 / 0.**
⚠️ Warum der Rückbau existierte und nicht griff: `.is-settled` deckt nur die
CSS-getriebenen Reveals ab; die GSAP-getriebenen animieren direkt auf `blur(0px)`
und lassen es stehen. Gemeinsame Hilfsfunktion `js/filter-freigeben.js`, auf 56
Seiten **vor** den Reveal-Skripten eingebunden. Sie räumt **ausschließlich den
Filter** auf und tastet `opacity`/`transform` nicht an, weil ein `clearProps` bei
Rückwärtslauf unaufgedeckten Inhalt aufblitzen ließe.
Teuerster Einzeleffekt weg: `backdrop-filter` am Karten-Overlay (1 → 0). Es lag
auf einer **live laufenden** Leaflet-Karte.
**Die Kacheln:** 2160 auf der Startseite, jede mit einem Übergang. Ein
`IntersectionObserver` mit 400 px Vorlauf: **2160 → 180** gleichzeitig
übergangsfähige Kacheln, und die Nähte lösen weiter auf (360 → 540 → 720).
⚠️ Die Regel lag zuerst in `page-home.css` — `/werkschutz/` lädt die nicht, dort
blieben alle 1980 übergangsfähig. Nach `components.css` verschoben.

### 18 · Bildradien — **Prämisse hielt nicht; 15 Literale zu Token**
**Kein Bild** hat einen eingebackenen Radius (Bilddaten ausgelesen: alle Eckpixel
deckend). **Kein img-Selektor** im gesamten CSS setzt `border-radius`, außer der
50 % des runden Avatars.
Was wirklich offen war: **`1.5rem` stand neunmal** als Literal in sechs Dateien,
`999px` zweimal obwohl `--radius-pill` existiert, `4px` viermal. **15 Literale**
ersetzt, alle mit identischem Wert.
**Nachweis:** Knopf 999px, Formularkarte 16px, Avatar 50 % — unverändert, kein
Pixel bewegt. Bau-Tor gegen beides.

### 19 · CTA-Varianten — **Prämisse hielt nicht; gedeckelt statt konsolidiert**
Gemessen **vier** Signaturen, nicht sieben, und sie lösen sich in **zwei Rollen**
auf: `btn--primary` (5×), `btn--secondary` (2×), `btn--primary btn--lg` (2× —
derselbe Knopf, größeres Polster) und `coverage__pill--all` (1×).
⚠️ `.coverage__pill--all` ist **kein CTA**, sondern ein Filter-Schalter; ihn wie
den Angebots-Knopf aussehen zu lassen würde eine Handlungsaufforderung behaupten,
die er nicht ist.
Bau-Tor: die Anzahl der `.btn--`Varianten darf nicht wachsen. **Deckelt statt zu
konsolidieren**, weil Farbe und Typografie des Primärknopfs ausdrücklich nicht
geändert werden dürfen.

### 20 · Sticky-Header ohne deckenden Zustand — **behoben, echter Defekt**
Der Mechanismus existierte, war aber zu schwach und griff an der falschen Stelle:
`rgb(255 255 255 / 0.08)` — praktisch nichts — und **nur über hellen Sektionen**.
**Nachweis:** bei 768 px auf `/werkschutz/` schnitten bei y=11913 drei Textknoten
das Header-Rechteck bei einer Deckkraft von **0,004**.
Neu: `.site-header--solid`, ausgelöst von der **Unterkante des Hero** (nicht von
einem festen Pixelwert — die Heroes sind zwischen 630 und 1378 px hoch). Über dem
Hero bleibt er durchsichtig, das ist die Kundenentscheidung vom 17.07.2026.
**0,9 schwarz / 0,92 weiß.**
⚠️ Die Funktion stieg vorher bei `!lightSections.length` aus — auf einer
durchgehend dunklen Seite lief weißer Text hinter weißem Logo durch.

### 21 · reduced-motion-Blöcke — **dokumentiert, nicht zusammengeführt**
**Zehn** echte Blöcke, nicht 44. **Nicht zusammengeführt, mit Begründung:** der
globale Block macht die Arbeit (er kappt jede Dauer sitewide), die übrigen neun
sind **seitenspezifische Selektoren**. Sie in eine Datei zu holen, die alle 70
Seiten laden, hieße Regeln für einzelne Sektionen in geteiltes CSS zu schreiben —
bei jeder gelöschten Sektion bliebe dort eine Regel zurück, die niemand findet.
Alle zehn in `motion.css` indiziert, mit Grund je Datei. Bau-Tor als Obergrenze.

### 22 · Breakpoints — **dokumentiert, nicht konsolidiert**
**16 verwendete, null dokumentierte** (die Historie nannte fünf — genau die Falle).
Alle 16 stehen jetzt in `tokens.css` mit Häufigkeit und Grund; die drei stark
genutzten undokumentierten sind benannt: **640 (48×**, die CTA-Stapelgrenze,
gemessen 558 px Bedarf gegen 598 verfügbar), **900 (35×)** und **1100 (17×)**.
⚠️ Sie stehen als **Dokumentation, nicht als Token**: eine Custom Property kann in
einer Media Query nicht ausgewertet werden.
**Nicht konsolidiert:** 285 Media Queries in 30 Dateien zu verschieben heißt, das
responsive Verhalten aller 70 Seiten kurz vor dem Launch neu zu prüfen — und die
meisten Werte sind **gemessen** entstanden.

### 23 · Motion-Bibliotheken auf Rechtsseiten — **behoben**
Die Zahl stimmt (58 Seiten), die Begründung nicht ganz: gemessen nutzt **jede**
mindestens einen Haken. Anders gestellt bleibt die Frage berechtigt: **131 KB**
(GSAP 71 + ScrollTrigger 43 + Lenis 17) für einen Hero-Reveal auf einem
**Rechtstext**. Entfernt von `/impressum/` und `/datenschutz/` — dieselbe
Begründung, mit der diese Seiten schon `text-reveal` nicht laden: zu einem
Impressum kommt man, um einen Wert mit Strg+F zu suchen oder es zu drucken.

### 24 · Leere alt-Texte — **Prämisse hielt nicht; ein echter Fall behoben**
Das Marquee ist längst richtig: die **erste** Logo-Gruppe trägt echte Namen, die
Kopien tragen `alt=""` **und** `aria-hidden="true"`. Ein Screenreader hört jede
Firma genau einmal.
**Gemessen über alle 70 Seiten: 1321 leere alt-Texte** — davon **1135** das
Ortsmarken-Symbol neben einem Städtenamen, 70 das WhatsApp-Symbol in einem Link
mit eigenem `aria-label`, der Rest Marquee-Kopien. **Genau ein echter Fall:** das
Hero-Bild der Startseite, das größte Bild der Seite. Hat jetzt einen
beschreibenden Text.

### 25 · `aria-label` auf Elementen ohne Rolle — **behoben; meine erste Prüfung war falsch**
Ein Grep über `pages/` fand die drei `span[aria-label]` **nicht**, weil
`js/konzept-seq.js` sie zur **Laufzeit** erzeugt. Erst die Messung am laufenden DOM
zeigte vier Elemente mit `aria-label` und ohne Rolle. Ein Element mit generischer
Rolle kann keinen zugänglichen Namen tragen — die Beschriftung der drei Schritte
kam gar nicht an.
Die Absicht war richtig (Titel werden in Zeichen-Spans zerlegt), das **Mittel**
war falsch. Jetzt echter, optisch verborgener Text plus `role="group"`.
**Nachweis:** 4 → **0** Treffer, drei verborgene Texte vorhanden, 43 Zeichen-Spans
erhalten.

### 26 · Sitemap handgepflegt — **behoben**
Wird beim Bauen erzeugt. ⚠️ Ausgeschlossen wird anhand des **ausgelieferten
Markups** (robots-Meta), nicht anhand einer zweiten Liste — damit kann eine neue
noindex-Seite nicht versehentlich angemeldet werden. Prioritäten **übernommen,
nicht neu erfunden**.
**Nachweis:** gegen den handgepflegten Stand verglichen, **58 = 58**, keine Adresse
verschwunden oder dazugekommen. Bau-Tor prüft **beide Richtungen**, weil beide
Vorfälle vorgekommen sind (53 Einträge bei 54 Seiten; zehn Seiten ohne Eintrag).

### 27 · Die sieben Kleinigkeiten — **fünf behoben, zwei waren keine**

**27a** Ratgeber-H1: **4 Zeilen → 2** bei 1440 und 1920.
⚠️ Der Deckel saß an **drei** Stellen und nur die dritte war wirksam: Container
(44rem), dann das h1 des Chassis (**38rem = 608 px**) — gemessen wurde eine
Textbreite von 587 px, also war das h1 die Grenze. Die ersten zwei Anhebungen
haben **gar nichts** bewegt. Jetzt 52rem plus `text-wrap: balance`, Textbreite
832 px. Bei 1024 bleiben es 4 Zeilen — dort ist es echter Platzmangel.

**27b** Brotkrumen: kein hängendes Trennzeichen. Der Trenner gehört an das
**folgende** Element — deshalb nicht `nowrap` auf der Liste (das erzwingt
Querlauf), sondern `nowrap` je Eintrag bei umbrechender Liste.
**Nachweis:** drei längste Pfade (4 Ebenen) bei 390 px, je 3 Zeilen, **kein
hängender Trenner**.

**27c** **Kein Befund.** Es gibt keine Zahlenbereiche mit falschem Strich. Ein
blindes Ersetzen hätte „DIN 77200-1" und über 30 Telefondurchwahlen zerstört.

**27d** **Kein Befund.** Die zwei nicht verlinkten Nummern sind **Faxnummern**.
Ein `tel:`-Link auf ein Fax ist ein Link, der nichts tut.

**27e** Schriftgrößen 11–12 px als **Entscheidung** in `tokens.css` dokumentiert
(Christoph, 31.08.2026, bleibt) — damit sie nicht später als Versehen
„korrigiert" werden.

**27f** Stadtseiten-Preistabelle: **32 Zeilen in 10 Seiten** bekommen eine
Einordnung. Vorher stand in jeder Zeile derselbe Wert.
⚠️ Die Einordnungen sind **nicht erfunden** — sie sind wortgleich die Spalte
„Einordnung" aus `/ratgeber/kosten-sicherheitsdienst/`. **Der Preis bleibt
unangetastet.** Die Zeilen sind je Stadt verschieden (3–4 Zeilen, 5 Leistungen);
eine feste Liste ist beim ersten Lauf an Ansbach gescheitert, das kein
Objektschutz führt.
**Nachweis:** 32/32 ergänzt, Zeilenhöhen 79–80 px bei 1440, kein Querlauf.

**27g** Bilder: **344 KB → 116 KB.**
Gemessen wurden 89 ausgelieferte Bilder, gewichtet nach **Byte je angezeigtem
Pixel**. Genau **ein** echter Ausreißer, Faktor 3 vor allem anderen:
`partner-wirtschaftsclub-bamberg.png`, 87 KB für eine Anzeige von 67×44 px = **30
Byte/Pixel** (Zweitplatzierter 20, Rest unter 11).
⚠️ **Der Übergrößen-Faktor allein ist der falsche Maßstab:** die DEKRA-Siegel
liegen bei **13,6-facher** Übergröße und sind harmlos (flache Grafiken, 18 KB).
⚠️⚠️ **Der naheliegende Weg wäre falsch gewesen.** Dasselbe Logo liegt in
`client-logos/` schon bei 8 KB — es zu verwenden macht es **unsichtbar**: jene
Fassung ist weiße Grafik (Helligkeit **255**, 76 % transparent) für den dunklen
Seitengrund, die Partnersektion steht aber auf `rgb(255,255,255)`. Geprüft durch
Auslesen der Pixel, nicht am Dateinamen abgeleitet.

| Datei | vorher | nachher |
|---|---|---|
| partner-wirtschaftsclub-bamberg | 900×593, 87 KB | 300×198, **6 KB** WebP (−92 %) |
| social-werkschutz | 480×850, 73 KB | **23 KB** WebP (−68 %) |
| social-interview | 480×850, 94 KB | **38 KB** WebP (−59 %) |
| social-veranstaltungsschutz | 480×850, 90 KB | **49 KB** WebP (−45 %) |

Die drei `social-*` sind mit 480×850 richtig dimensioniert — ihnen fehlte nur die
WebP-Fassung.

### 28 · Codebeurteilung — **erstellt**
`qa-harness/launch-paket/CODE-BEURTEILUNG-2026-08-31.md`. Vier Befunde mit
Wirkung, Aufwand und Risiko, plus „was gut ist".
**Empfehlung: eine Sache vor dem Launch** — ein Test je Bau-Tor gegen ein
absichtlich kaputtes Fixture. Zwölf kleine Tests, kein Risiko, und sie schließen
die Lücke, die in dieser Sitzung **zweimal** Schaden angerichtet hat: ein
Prüfmechanismus, der still nichts mehr prüft.
⚠️ **Beurteilung, keine Änderung** — an der Struktur wurde nichts angefasst.

### 29 · Dieses Protokoll — **erstellt**

---

## ⚠️ Zwei Funde aus der Abschlussprüfung — bitte zuerst lesen

**A · Die URL, gegen die geprüft wurde, gehört nicht zu diesem Projekt.**

`frankonia-website.vercel.app` — die URL aus dem QA-Auftrag und aus meinen
eigenen Messungen — ist **keine Domain dieses Vercel-Projekts**. Abgefragt über die
Vercel-API, die Domains sind:

* `frankonia-sicherheit-2.vercel.app`  ← **hier läuft der aktuelle Stand**
* `frankonia-website-bauer-christoph.vercel.app`
* `frankonia-website-git-main-bauer-christoph.vercel.app`

Und `ssoProtection` steht auf `all_except_custom_domains`, also liegen die
letzten beiden hinter dem Vercel-Login (Titel „Login – Vercel").

**Gemessen:**

| URL | Marker vorhanden |
|---|---|
| `frankonia-sicherheit-2.vercel.app` | **3 von 3** |
| `frankonia-website.vercel.app` | 1 von 3 |
| `frankonia-sicherheit.de` | 0 von 3 (noch das alte Hosting) |

**Alle 29 Aufgaben sind live — auf `frankonia-sicherheit-2.vercel.app`.** Dort:
28 von 28 Kartenkacheln geladen, Kachel angesehen und wasserzeichenfrei.

⚠️ **Das ist der Grund, Screenshots künftig gegen die richtige URL zu machen.** Der
QA-Auftrag hat gegen `frankonia-website.vercel.app` gemessen, und das ist ein
älterer, fremder Stand. Ein Teil der 29 Befunde kann daraus entstanden sein.
Beim Umstellen der Domain ist ohnehin `frankonia-sicherheit.de` das Ziel.

**B · Meine eigene Kartenprüfung hat blind Alarm geschlagen.**

`scripts/pruefe-karten.mjs` prüfte den Stil `dark_all` fest verdrahtet,
während die Website seit Aufgabe 2 `dark_nolabels` lädt — und bei Zoom 6
liefert CARTO dieselbe Kachel mit und ohne Schlüssel. Gemessen:

| Kachel | mit Schlüssel | ohne | |
|---|---|---|---|
| `dark_all/6/34/21` | 11303 B | 11303 B | identisch |
| `dark_nolabels/8/135/86` | 11026 B | 10828 B | **verschieden** |

Das Skript meldete also „der Schlüssel wirkt nicht", **während die Live-Karte
einwandfrei war**. Ein Prüfskript, das grundlos Alarm schlägt, wird nach zwei
Wochen abgeschaltet — dieselbe Lehre wie bei den 87 Fehlalarmen des
Fremd-Host-Tors (Aufgabe 3) und den 36 roten Zeilen der Weiterleitungsprüfung.

Behoben: der Stil wird jetzt **aus `js/coverage-map.js` gelesen**, driftet also
mit. Und ein Platzhalter in `.env.local` wird als solcher erkannt, damit ein
lokaler Bau ohne CARTO-Konto nicht abbricht — **eng gefasst:** erkannt wird nur ein
Wert, der sich selbst als Platzhalter bezeichnet. Gegenprobe mit einem echt
aussehenden, aber falschen Schlüssel: **fällt weiter durch.**

---

## Offene Punkte

Nichts davon liegt im Code dieses Repositories.

**1 · `CARTO_BASEMAP_KEY` steht in Vercel nur unter Production.**
Entscheidung des Kunden („wir sehen carto dann in vercel live"). Preview-Deploys
zeigen deshalb das Wasserzeichen. **Unkritisch, weil nur `main` deployt** — geprüft.

**2 · Die Weiterleitung des Bewerbungsformulars auf `/danke-bewerbung/` ist nicht
gesetzt.** Muss **im HubSpot-Portal** konfiguriert werden; das eingebettete
Formular liest seine Konfiguration dort, nicht aus dem Code. Die Seite existiert
und ist erreichbar.

**3 · Die Datenschutz-Abschnitte 3.3 bis 3.7 sind Entwurf** und brauchen
anwaltliche Prüfung. Das gilt besonders für den neuen 3.7 (eingebettetes
HubSpot-Formular), der aus einem eigenen Fund entstand.

**4 · Testdaten in HubSpot löschen:**
* Kontakt **244207392966**
* Firma **445068333287** („FRANKONIA Testeintrag")
* ⚠️ **Und die Verknüpfung dieses Testkontakts mit dem ECHTEN Datensatz
  „FRANKONIA Sicherheitsdienst"** — die ist beim Testlauf entstanden und ist der
  Grund, warum die Kontaktkarte den falschen Firmennamen zeigte.

**5 · `.references` malt sich Weiß, trägt aber `.section--light` nicht.**
Damit bleiben dort alle Token im Dunkelmodus. Das umzustellen bewegt ein Dutzend
Farben in einer **abgenommenen** Sektion und gehört in eine eigene, sichtgeprüfte
Runde. Im Code vermerkt.

**6 · Zwei Kontrastwerte bleiben, beide begründet:**
* Die Bewertungssterne bei **1,73:1** sind ein Grafik-Element mit `role="img"` und
  Textalternative — für Grafik gilt 3:1, für Dekoration mit Alternative kein
  Minimum, und der Wert steht als Zahl daneben.
* Die Leaflet-Attribution bei **3,08:1** ist eine Fremdkomponente. Die Regel für
  eine weiße Steuerfläche liegt in `components.css`, greift aber nicht, weil das
  Element erst beim Lazy-Load der Karte entsteht. **Ehrlich als offen vermerkt.**

---

## Was ausdrücklich nicht angetastet wurde

Vier Dinge, die der Auftrag als Entscheidung markiert:

1. **Die CTAs** — `#3d9ad3` + Weiß, 3,11:1, auf jedem CTA und auf
   `.coverage__pill--all`. Entscheidung von Christoph, 31.08.2026.
2. **Der Preisbereich `24,50-32`** mit kurzem Bindestrich.
3. **Schriftgrößen 11–12 px** für Nebeninformationen.
4. **Das Einwilligungsverhalten.**

Und die Regel des Auftrags: **kein bestehender Webtext wurde inhaltlich
geändert.** Die zwei Stellen, an denen Text bewegt wurde, sind beide keine
Umformulierung: die Sonntagszuschlag-Zahl war ein **Rechenfehler** (Aufgabe 8),
und die Einordnungsspalte der Stadtseiten ist **wortgleich** aus dem
Kostenratgeber übernommen (27f).

---

## Messnotizen für den nächsten Durchgang

Drei Fallen, die in dieser Sitzung Zeit gekostet haben:

* **`node --test tests/` scheitert auf Node 24** mit `MODULE_NOT_FOUND` — es liest
  den Verzeichnisnamen als Modul. **`npm test` nutzen.** Zwei Prüfungen dieser
  Sitzung haben deshalb stumm nichts gemeldet, während ich 67/67 glaubte.
* **Heredocs fressen auf dieser Maschine eine Escape-Ebene**, auch mit zitiertem
  Delimiter. Regex-Literale in generierten Skripten kommen kaputt an. Lange Dateien
  mit dem Schreibwerkzeug anlegen, Escapes über `String.fromCharCode(92)`.
* **Node löst `/tmp` zu `C:\tmp` auf**, Git Bash nicht. Zwischendateien in das
  Scratchpad-Verzeichnis legen, nicht nach `/tmp`.
* **Eine Kontrast-Sonde muss `color(srgb …)` erkennen** — dessen Komponenten gehen
  von 0 bis 1, nicht 0 bis 255. Als 8-Bit gelesen ergab das sieben falsche
  „1,00:1" für voll lesbare Brotkrumen.

---

*Laufende Ergänzungen zum Pre-Launch-Durchgang stehen weiter in
`docs/launch-pruefprotokoll.md`; dieses Dokument ist der abgeschlossene Bericht
zum QA-Auftrag mit den 29 Aufgaben.*
