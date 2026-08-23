# Launch-Prüfprotokoll

Eine Liste zum Durchgehen, nicht ein zweites Changelog. Jede Zeile sagt: **was
geändert wurde, wo man es sieht, und woran man erkennt, dass es stimmt.**

Angelegt am 2026-08-23 auf Wunsch von Christoph, für den Durchgang vor dem
Umstellen der Domain auf Vercel.

**Regel:** dieses Dokument wird im selben Commit wie der Block aktualisiert, den
es beschreibt — dieselbe Regel, die schon für
[build-checklist.md](build-checklist.md) gilt.

Vorschau zum Prüfen: `npm run dev` (baut und serviert `dist/`).

Legende: ☐ noch prüfen · ⚠️ braucht eine Entscheidung von dir · ✅ erledigt und
von dir bestätigt

---

## 1 — Impressum rechtssicher machen

Commit `3bf7868` · `pages/impressum.html`

| ☐ | Was | Wo prüfen | Woran erkennbar |
|---|---|---|---|
| ☐ | EU-Streitschlichtungslink entfernt | `/impressum/` | Kein Absatz zur Online-Streitbeilegung mehr, in **beiden** Gesellschaftsblöcken. Kein `ec.europa.eu` mehr auf der Seite. |
| ☐ | Satz zur E-Mail-Adresse mit entfernt | `/impressum/` | „Unsere E-Mail-Adresse finden sie oben im Impressum." kommt nicht mehr vor (stand nur wegen Art. 14 ODR-VO dort) |
| ☐ | Registergericht + Registernummer ergänzt | `/impressum/` | Pro Gesellschaft: Amtsgericht Bamberg, **HRA 12064** (Sicherheitsdienst) bzw. **HRA 13044** (Werkschutz), Komplementärin HRB 8535 |
| ☐ | Steuernummer **nicht** veröffentlicht | `/impressum/` | Keine Steuernummer auf der Seite — § 5 DDG verlangt die USt-IdNr., nicht die Steuernummer |
| ☐ | § 36 VSBG ergänzt | `/impressum/` | „Wir sind zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle nicht bereit." — in beiden Blöcken |
| ☐ | TMG → DDG an 9 Stellen | `/impressum/` + Seitenquelle | Sichtbar: Lede und Haftungsausschluss (§ 7 Abs. 1, §§ 8–10). Unsichtbar: Meta-Description und og:description. Kein „TMG" mehr auf der Seite. |

**Hintergrund, falls dein Anwalt fragt:** die ODR-Plattform wurde am 20.07.2025
abgeschaltet und Art. 14 ODR-VO ist aufgehoben; das TMG wurde am 14.05.2024 vom
DDG ersetzt, das die Paragrafennummern übernommen hat.

⚠️ **Offen:** der Name der Komplementär-GmbH (HRB 8535) fehlt weiter — auf deine
Entscheidung („lass erst mal Lücke"). Dein Dokumentenpfad heißt „FRANKONIA
Verwaltungs GmbH", das ist sehr wahrscheinlich sie, aber für ein Impressum reicht
„wahrscheinlich" nicht.

---

## 2 — Social-Share-Bilder auf allen 54 Seiten

Commit `3bf7868` · `partials/head-common.html`, `content/values.json`, 15 Seiten,
`docs/design-sources/og-images.ps1`

**Das Problem vorher:** alle 54 Seiten forderten eine Karte mit großem Bild
(`twitter:card="summary_large_image"`), nur eine deklarierte überhaupt ein Bild —
und diese Datei existierte nie. Jeder geteilte Link erschien ohne Bild.

| ☐ | Was | Wo prüfen | Woran erkennbar |
|---|---|---|---|
| ☐ | Jede Seite hat ein Share-Bild | beliebige Seite teilen (WhatsApp/LinkedIn/Slack) oder Seitenquelle | `og:image` vorhanden und die Datei lädt |
| ☐ | Eigenes Hero-Bild pro Seite | `/werkschutz/`, `/objektschutz/`, `/jobs/` teilen | Jede zeigt ihr eigenes Foto, nicht das der Startseite |
| ☐ | Fallback für Seiten ohne Foto | eine Stadtseite teilen, z. B. `/sicherheitsdienst-bamberg/` | Zeigt das Startseiten-Hero |
| ☐ | Bildbeschreibung pro Seite | Seitenquelle, `og:image:alt` | Beschreibt das jeweilige Foto, nicht allgemein die Firma |

**Warum eigene Zuschnitte statt der Hero-Dateien:** neun Hero-Fotos sind
hochformatig und werden von jeder Plattform mittig zu einer Querformat-Karte
beschnitten — genau der Beschnitt, der dort Köpfe abschneidet. Außerdem ist WebP
bei `og:image` unzuverlässig (vor allem LinkedIn). Daher 1200×630-JPEGs.

**Wichtig für später:** ein neues Bild heißt ein neues Share-Bild. Generator ist
`docs/design-sources/og-images.ps1`.

---

## 3 — Block A: die zwölf Fotos

Commits `f691671`, `1e3a485`

| ☐ | Was | Wo prüfen | Woran erkennbar |
|---|---|---|---|
| ☐ | Objektschutz-Foto ersetzt | `/objektschutz/` | Kontrollgang an der Gebäudeaußenseite in der Dämmerung — **nicht** mehr die Leitstelle |
| ☐ | Homepage-Kachel dazu | Startseite, Liste der Leistungen | Das Miniaturbild bei Objektschutz zeigt dasselbe neue Motiv |
| ☐ | Drei Ratgeber-Titelbilder | `/ratgeber/paragraph-34a-erklaert/`, `/ratgeber/kosten-sicherheitsdienst/`, `/ratgeber/brandwache-wann-vorgeschrieben/` | Jeder Artikel hat oben ein Bild statt eines gestrichelten Platzhalters |
| ☐ | Vier Case-Study-Bilder | die drei Seiten unter `/referenzen/case-study-…/` | Sicherheitstechnik hat **zwei** Bilder (Werkstor, Schranke), die anderen je eins |
| ☐ | Kein Platzhalter mehr | überall | Nirgends mehr „[Bild folgt: …]" |
| ☐ | Bildsektion auf Kontakt | `/kontakt/`, zwischen Kontaktdaten und „So finden Sie uns" | Überschrift „Unser Büro in Bamberg", darunter Außenbild + Türschild in einer Reihe, dann Empfang + Arbeitsplatz |
| ☐ | Türschild lesbar | `/kontakt/` | Beide Schilder ganz zu sehen: Sicherheitsdienst **und** Werkschutz |

**Zwei Dinge, die nicht sichtbar sind, aber mitgeändert wurden:** die beiden
alt-Texte auf `/objektschutz/` beschrieben noch die Leitstelle, und die
Reservierung der Pixel-Übergangsbande auf `/kontakt/` musste auf die neue Sektion
umgehängt werden — sonst hätten die Tiles über den neuen Fotos gelegen.

⚠️ **Offen: das Hero-Foto der Startseite** fehlt noch. Wenn es kommt, sind es
**vier** Stellen: Foto in drei Größen, alt-Text, Share-Bild neu erzeugen (es ist
der Fallback von 33 Seiten) und dessen Beschreibung in `content/values.json`.

---

## 4 — Block B: Mitgliedschaften und Partner

Commit `cfa75ec` · `pages/index.html`, `css/page-home.css`,
`assets/images/partner/`, `assets/images/client-logos/`

| ☐ | Was | Wo prüfen | Woran erkennbar |
|---|---|---|---|
| ☐ | Neue Sektion | Startseite, nach der FAQ | Kleine Überschrift „Mitgliedschaften und Partner", darunter drei Logos zentriert |
| ☐ | Ruhig, nicht laut | Startseite | Kleine Überschrift, kein Rahmen, kein Kasten — sie soll nicht mit dem CTA konkurrieren |
| ☐ | Logos gleich gewichtet | Startseite | Kein Logo dominiert; DMB ist breiter, aber nicht viermal so groß |
| ☐ | Links öffnen extern | die drei Logos anklicken | Neuer Tab: mittelstandsbund.de, wirtschaftsclub-bamberg.de, bauerchristoph.de |
| ☐ | Umbruch auf dem Telefon | Startseite auf dem Handy | Bei ~390px eine Reihe, bei sehr schmalen Geräten zwei |
| ☐ | Neues Wirtschaftsclub-Logo im Marquee | `/referenzen/`, Logoreihe | Weißes W mit Schriftzug, passt zu den anderen weißen Logos — nicht die blaue Kachel |

⚠️ **Zur Kenntnis:** die DMB-Adresse aus deinem Briefing
(`mittelstands-bund.de`, mit Bindestrich) hat **kein gültiges Zertifikat** und ist
nicht der DMB. Verwendet wird `www.mittelstandsbund.de`, die deine Seiten
`/referenzen/` und `/ueber-uns/` schon verlinken. `dmb.de` ist eine andere
Organisation (Mieterbund).

Die Text-Erwähnungen der Mitgliedschaften auf `/referenzen/`, `/ueber-uns/` und
der Nürnberg-Seite sind unangetastet — die Sektion ergänzt sie.

---

## 5 — Block C: Meilensteine auf /ueber-uns/

Commit `0ada177` · `pages/ueber-uns.html`, `css/page-ueber-uns.css`

| ☐ | Was | Wo prüfen | Woran erkennbar |
|---|---|---|---|
| ☐ | Fünf neue Meilensteine | `/ueber-uns/`, Zeitleiste | 2016 Bischberg · 2021 Umzug Bamberg · 2022 50 Mitarbeiterinnen und Mitarbeiter · 2023 Gründung Werkschutz · 2024 100 Mitarbeiterinnen und Mitarbeiter |
| ☐ | Nichts dazuerfunden | `/ueber-uns/` | Genau fünf Einträge, keine Zusatzjahre, kein Beschreibungstext über die Zeile hinaus |
| ☐ | FRANKONIA Security kommt nicht vor | ganze Seite | Nicht erwähnt (geprüft: 0 Treffer) |
| ☐ | Abstände folgen den Jahren | `/ueber-uns/` am Desktop | Von 2016 nach 2021 ein deutlich langer Weg, danach 2022–2024 in kurzen Schritten. Letzter Punkt sitzt auf der rechten Inhaltskante. |
| ☐ | Telefon | `/ueber-uns/` am Handy | Senkrechte Leiste, fünf Punkte untereinander, Beschriftungen ein- bis zweizeilig |

**Was an der Technik dranhing:** die Zeitleiste verteilt die Abstände proportional
zu den Jahresabständen. Die waren vorher 2, 2, 3, 1 und sind jetzt **5, 1, 1, 1**,
also war die alte Aufteilung nicht nur ungenau, sondern **verkehrt**: gemessen bei
1440px bekam der Fünf-Jahres-Sprung 54 Pixel pro Jahr, die Ein-Jahres-Sprünge 269,
404 und 247 — der längste Zeitraum war der kürzeste Schritt. Neu gemessen bei
1440: 639 / 152 / 152 / 256 Pixel, bei 1920 sogar exakt proportional
(158 px pro Jahr für die ersten drei Sprünge). Kein Überlauf und keine
überlappenden Beschriftungen bei 1100 / 1130 / 1280 / 1440 / 1920.

⚠️ **Bleibt bewusst so:** der letzte Sprung (2023 → 2024) ist breiter als die
anderen beiden Ein-Jahres-Sprünge. Er ist der einzige, der **zwei** Beschriftungen
tragen muss, weil der letzte Punkt auf der Inhaltskante sitzt. Die Alternative
wäre, alle drei Ein-Jahres-Sprünge so breit zu machen — dann bliebe für den
Fünf-Jahres-Sprung so wenig übrig, dass man ihm die fünf Jahre nicht mehr ansieht.

✅ **GEKLÄRT am 2026-08-23 — nichts zu ändern.** Kurz aufgefallen war:
Der Einleitungssatz derselben Sektion sagt:

> „**2016 in Bamberg gegründet**, heute in ganz Franken im Einsatz …"

Der neue Meilenstein sagt „**Gründung in Bischberg**". Beides steht rund hundert
Pixel voneinander entfernt auf derselben Seite und kann nicht gleichzeitig
stimmen. Der alte Meilenstein sagte „Gründung in Bamberg" und passte damit zum
Einleitungssatz.

**Christophs Antwort: Bischberg gehört zu Bamberg, also passt beides.** Bischberg
liegt im Landkreis Bamberg, der Einleitungssatz meint die Region. Beide Formulierungen
bleiben unverändert stehen — es war kein Fehler, sondern zwei Genauigkeitsgrade
derselben Aussage.

---

## 6 — Block D: Navigation, Google-Badge, Footer

Commit `acad12c` · `partials/header-de.html`, `css/site-chrome.css`,
`css/components.css`, `css/page-home.css`, `css/page-referenzen.css`, `build.js`,
`content/coverage.json`

### D1 — Startseite im Menü

| ☐ | Was | Wo prüfen | Woran erkennbar |
|---|---|---|---|
| ☐ | „Startseite" als erstes Menüelement | jede Seite, Kopfzeile | Steht links vor „Leistungen", führt auf `/` |
| ☐ | Aktiv-Zustand | Startseite aufrufen | „Startseite" ist blau unterstrichen wie jede andere aktive Seite; auf Unterseiten **nicht** |
| ☐ | Mobiles Menü | Handy, Menü öffnen | „Startseite" ist der erste Eintrag im Ausklapp-Menü |
| ☐ | Kopfzeile bleibt einzeilig | Desktop bei ~1400px Fensterbreite | Alle sieben Einträge in einer Zeile, „Über uns" nicht umgebrochen |

⚠️ **Das siebte Element hat einen echten Defekt ausgelöst, der behoben ist.** Bei
1418px brach „Über uns" auf zwei Zeilen. Ursache war nicht zu wenig Platz in der
Kopfzeile, sondern dass die Menüliste mit `position: absolute; left: 50%` zentriert
ist — dadurch war ihre Breite auf die **halbe** Kopfzeile begrenzt (709px), während
sieben Einträge 731px brauchen. Behoben mit `width: max-content`. Gemessen bei
Viewport 1400 / 1418 / 1490 / 1578 / 1898: überall eine Zeile, beim engsten
Desktop noch 95px Luft zum Logo und 99px zum CTA.
**Ein achtes Menüelement muss diesen Abstand neu messen.**

### D2 — Google-Bewertungs-Badge minimiert

| ☐ | Was | Wo prüfen | Woran erkennbar |
|---|---|---|---|
| ☐ | Keine Karte mehr | jede Seite mit Badge, z. B. `/werkschutz/` | Kein weißer Hintergrund, kein Rahmen, kein Schatten — nur G-Logo, Sterne, „4,7", „97 Bewertungen" |
| ☐ | Zweitrangig neben dem CTA | `/werkschutz/` Hero | Das Badge zieht keine Aufmerksamkeit mehr wie ein Button; der blaue CTA darüber führt klar |
| ☐ | Kleiner als vorher | Hero | Logo und Sterne eine Stufe kleiner |
| ☐ | Auf heller Fläche lesbar | `/referenzen/`, Abschnitt „Das sagen unsere Kunden" | Text **dunkel** (nicht weiß), Sterne gold |

⚠️ **Die Schriftfarbe ist Token-basiert, nicht wörtlich weiß** — und das war nötig:
41 der 42 Badges sitzen auf dunklem Grund, aber eines (`/referenzen/`) in einer
hellen Sektion. Wörtlich weiße Schrift wäre dort unsichtbar gewesen. Über Token
stimmt beides ohne zweite Regel.

**Kein Link vorhanden, und das war vorher auch so.** Das Briefing sagt „die
Verlinkung auf das Google-Profil bleibt" — das Badge war jedoch **nie** verlinkt,
auf keiner Seite (geprüft). Die einzigen Google-Adressen im Projekt sind
Routen-Links zu Maps auf `/kontakt/`. Wenn das Badge verlinkt werden soll, brauche
ich die Adresse des Google-Profils; erfinden kann ich sie nicht.

Zwei seitenspezifische Sonderregeln sind entfallen, weil sie nur die Pille
betrafen: die getönte Fläche auf `/referenzen/` (sie wäre sonst die einzige Pille
der Website geworden) und die Telefon-Anpassung auf der Startseite, die Breite für
das Padding zurückkaufen sollte.

### D3 — Einsatzgebiete im Footer

| ☐ | Was | Wo prüfen | Woran erkennbar |
|---|---|---|---|
| ☐ | Fünf Orte ergänzt | Footer jeder Seite | Nach Forchheim: Hof, Kronach, Kulmbach, Lichtenfels, Schwandorf |
| ☐ | Reihenfolge | Footer | Zehn verlinkte Städte, dann die fünf, dann „Alle Einsatzgebiete" als Letztes |
| ☐ | Nicht zweite Klasse | Footer | Gleiches Icon, gleiche Schrift, gleiche Abstände, gleiche Farbe wie die verlinkten |
| ☐ | Verhalten sich **nicht** wie Links | Footer | Kein Zeigefinger-Cursor, keine Hover-Änderung, beim Durchtabben werden sie übersprungen |

Technisch als `<span>` statt `<a>`. Hover und Fokus sind auf `a.footer-pill`
eingeschränkt — ein `<span>` reagiert nämlich sehr wohl auf `:hover`, eine
ungeschützte Regel hätte ihnen also einen Link-Zustand gegeben. Fokus und Tab-Stopp
brauchen keine Absicherung, weil ein `<span>` nicht fokussierbar ist.

Sobald einer dieser Orte eine eigene Stadtseite bekommt, genügt ein Eintrag in
`content/coverage.json` — er wird automatisch wieder ein `<a>`, sonst ändert sich
nichts.

---

## 7 — Block E: sieben Personen- und Verweisseiten

Commit `60e5fc1` · 7 neue Seiten in `pages/`, `css/page-person.css`,
`docs/design-sources/person-pages.js`, 3 Porträts, 5 vCards, `vercel.json`

Alle sieben liegen unter der **identischen URL wie auf der alten Seite**, weil sie
auf gedruckten Karten und QR-Codes stehen.

| ☐ | Was | Wo prüfen | Woran erkennbar |
|---|---|---|---|
| ☐ | Fünf Personenkarten | `/alexander-jaeger-sicherheitsdienst/`, `/alexander-jaeger-werkschutz/`, `/marco-bayer-sicherheitsdienst-2/`, `/marco-bayer-werkschutz-2/`, `/bryan-van-wey-werkschutz/` | Rundes Porträt, Name, Funktion, darunter Telefon, Mobil und E-Mail als antippbare Zeilen |
| ☐ | Daten stimmen | jede Karte | Nummern, Funktionen und Zusatzzeilen wie auf der Live-Seite; nichts umformuliert |
| ☐ | Kontakt speichern | „Kontakt speichern" antippen, am besten mit dem Handy | Es öffnet sich die Kontakt-Speichern-Ansicht, nicht ein Datei-Download |
| ☐ | Leistungslinks | Marco-Bayer-Seiten und `/alexander-jaeger-werkschutz/` | Führen auf die **neuen** Leistungsseiten, ohne Umleitungs-Zwischenschritt |
| ☐ | Terminbuchung | `/sicherheitscheck-walde/` | Drei Optionen (Büro, Online, vor Ort), jede öffnet die HubSpot-Buchung in neuem Tab |
| ☐ | Linktree | `/linktree/` | Liste aller wichtigen Seiten, gruppiert nach Leistungen und Unternehmen |
| ☐ | Nicht im Index | Seitenquelle jeder der sieben | `noindex,follow`, und keine der sieben steht in `/sitemap.xml` |

**Die Porträts kommen von der Live-Seite, nicht aus den Studio-Ordnern.** Genau
diese Gesichter stehen heute auf den gedruckten Karten, und alle drei sind derselbe
runde Ausschnitt aus demselben Shooting — damit sehen die drei Karten wie ein Satz
aus. Aus den Studio-Ordnern hätte ich aus durchnummerierten Vorschauen raten müssen.

**Die vCards sind unverändert deine Dateien**, mit Adresse, Fax, Arbeits-URL und
(in vier von fünf) eingebettetem Foto. Selbst erzeugte hätten Felder verloren.

**Absichtlich ohne Animations-JavaScript.** Jede andere Seite lädt GSAP, ScrollTrigger
und Lenis; hier wären das rund 50 KB Fremd-JavaScript vor einer Telefonnummer, für
jemanden, der mit einer Karte in der Hand auf dem Parkplatz steht.

⚠️ **Tippfehler in deinen vCards, nicht von mir korrigiert:** beide Jäger-Dateien
enthalten `TITLE:Vetriebsleiter` (ein „r" fehlt). Das landet so in den Adressbüchern
aller Empfänger. Auf der Seite selbst steht korrekt „Vertriebsleiter" — es betrifft
nur die Datei. Sag Bescheid, dann ändere ich beide Zeilen.

⚠️⚠️ **Korrektur an meiner eigenen Notiz von vorhin — hier stand ein Fehler von mir.**
Ich hatte notiert, die Marco-Bayer-Seite verlinke `/frankonia-baustellenbewachung`
und diese URL fehle in deiner Redirect-Liste. Am Quelltext der Live-Seite geprüft:
der Link heißt **`/baustellenbewachung/`, ohne Präfix**, und
`/frankonia-baustellenbewachung/` liefert auf der alten Seite **404** — die URL hat
es also nie gegeben. `/baustellenbewachung/` ist zugleich genau der Slug, den die
neue Seite schon hat, also **funktioniert die alte Adresse von selbst weiter** und
ein Redirect wäre eine Regel, die nie greifen kann. Baustellenbewachung und
Veranstaltungsschutz sind die beiden einzigen alten Leistungsseiten ohne Präfix;
das bestätigt auch die Live-Sitemap. **Deine Liste ist an dieser Stelle vollständig.**

⚠️ **Nicht verlinkt, mit Absicht:** die Büromanagement-Stellenanzeige auf der
jobs-Subdomain (du hast sie am 22.08. als veraltet bestätigt) und der Anker
`/#dienstleistungen`, der auf eine Sektions-ID zeigte, die es auf der neuen
Startseite nicht gibt. `/jobs/` und „Alle Leistungen im Überblick" decken beides ab.

---

## 8 — Behobener Fehler, der seit dem 21.08. auf allen Seiten live war

⚠️⚠️ **Ganz oben auf jeder Seite stand ausgelaufener Kommentartext.** Bei der
Social-Share-Arbeit (Abschnitt 2) habe ich in einen HTML-Kommentar in
`partials/head-common.html` einen Include-Marker **mit seinen Delimitern**
geschrieben. Das darin enthaltene `-->` beendet den Kommentar zu früh — der Rest der
Notiz wurde als sichtbarer Text ausgegeben, auf **allen 61 Seiten**.

**Warum es so lange durchging:** ich habe nach jeder Änderung die Meta-Tags
programmatisch geprüft und Ausschnitte gerendert, aber nie den Seitenanfang
angesehen. Meine Ausschnitte begannen jeweils unterhalb der Kopfzeile.

Behoben: der Marker wird im Kommentar nur noch benannt, nicht geschrieben.
**Geprüft: 0 von 61 Seiten haben noch Fremdtext im Kopfbereich.** Zusätzlich gibt es
jetzt eine Prüfung, die genau diesen Fehler findet (verschachteltes `<!--` in den
Quellen und Fremdtext im `<head>` der gebauten Seiten).

| ☐ | Was | Wo prüfen | Woran erkennbar |
|---|---|---|---|
| ☐ | Kein Kommentartext mehr sichtbar | beliebige Seite, ganz oben | Direkt unter der Kopfzeile beginnt der Inhalt; kein englischer Fließtext über dem Logo |

Ein zweiter, kleinerer Fund derselben Runde: der Breadcrumb-Chevron war auf den
neuen Seiten unsichtbar, weil seine Regel in `page-service.css` lag, die diese
Seiten nicht laden. Die Regel existierte bereits **zweimal wortgleich** und ist nun
einmal in `components.css` — beide Kopien sind gelöscht, und Breadcrumbs sind auf
allen Seitentypen gegengeprüft.

⚠️ **Nur notiert, nicht geändert:** `/kontakt/` schreibt im Breadcrumb „Home", alle
anderen Seiten „Startseite".

---

## 9 — Block F: vier von acht Blogartikeln portiert

Commit `PLATZHALTER` · 4 neue Seiten in `pages/ratgeber/`, 4 Karten im Hub,
4 Einträge in `sitemap.xml`, eine neue CSS-Regel

Die Aufteilung hast du am 23.08. freigegeben: **vier portieren, vier nur umleiten.**

| ☐ | Alte URL | Neue URL |
|---|---|---|
| ☐ | `/bewerbung-im-sicherheitsdienst-die-3-haeufigsten-fehler/` | `/ratgeber/bewerbung-sicherheitsdienst/` |
| ☐ | `/tariflohn-2026-im-sicherheitsdienst/` | `/ratgeber/tariflohn-sicherheitsdienst/` |
| ☐ | `/voraussetzungen-im-sicherheitsdienst/` | `/ratgeber/voraussetzungen-sicherheitsdienst/` |
| ☐ | `/qualifikationen-im-sicherheitsdienst/` | `/ratgeber/qualifikationen-sicherheitsdienst/` |

| ☐ | Was | Wo prüfen | Woran erkennbar |
|---|---|---|---|
| ☐ | Vier Artikel da | `/ratgeber/` | Sieben Karten statt drei; die vier neuen tragen das Datum 23. August 2026 |
| ☐ | Aufbau wie gehabt | jeder neue Artikel | H1, Byline mit „geprüft von Steffen Walde", Zwei-Satz-Antwort, Kapitel, FAQ, CTA — wie bei den drei bestehenden |
| ☐ | Ansprache | jeder neue Artikel | durchgehend „du", wie im 34a-Artikel und auf `/jobs/` |
| ☐ | Vergleichstabelle | `/ratgeber/qualifikationen-sicherheitsdienst/` | Vier Spalten (Kriterium, Unterrichtung, Sachkunde, GSSK); auf dem Handy wird sie zu beschrifteten Blöcken, ohne Querscrollen |
| ☐ | Interne Verlinkung | alle vier | Jeder Artikel verweist auf die passenden anderen Ratgeber, auf Leistungsseiten und auf `/jobs/` |
| ☐ | Im Index | Seitenquelle | `index,follow`, alle vier stehen in `/sitemap.xml` |

**Warum nur vier von acht.** Fünf der acht alten Artikel behandeln dasselbe Thema —
Unterrichtung, Sachkunde, GSSK — aus fünf Blickwinkeln, und drei dieser Blickwinkel
stehen **wörtlich schon im bestehenden 34a-Artikel**: die 400–500 €, die 40 Stunden,
„keine Prüfung", Türsteher und Ladendetektiv, der Prüfungsablauf. Hätte ich alle fünf
portiert, würden sechs Seiten um ein Keyword konkurrieren und sich gegenseitig
schwächen. Verloren geht dabei nichts: das GSSK-Prüfungsformat und die Kursspanne aus
den nicht portierten Texten sind in den Qualifikationen-Artikel eingearbeitet.

Die vier nicht portierten bekommen in Block G einen 301: `jobchancen`,
`einsatzmoeglichkeiten` und `so-schwierig` auf den 34a-Artikel, `fortbildung` auf den
neuen Qualifikationen-Artikel.

⚠️⚠️ **Zwei Sachfehler im alten Text, mit Quelle korrigiert.**
1. Bei den GSSK-Voraussetzungen stand „mindestens fünf Jahre Berufserfahrung, davon
   ein erheblicher Teil im Sicherheitsgewerbe". Die Vorschrift verlangt von diesen
   fünf Jahren **mindestens drei Jahre in der Sicherheitswirtschaft**. „Ein erheblicher
   Teil" liest man im Zweifel zu großzügig — bei einer Zulassungsfrage kostet das
   jemanden die Prüfungsanmeldung.
2. Die mündliche Sachkundeprüfung dauert nicht „etwa 20 Minuten", sondern **rund 15** —
   so steht es auch schon im bestehenden 34a-Artikel. Die beiden Seiten hätten sich
   also widersprochen. Der schriftliche Teil dauert **120 Minuten**.

Bestätigt und übernommen: GSSK-Mindestalter 24 Jahre, zwei Jahre Berufspraxis nach
abgeschlossener Ausbildung, Erste-Hilfe-Kurs nicht älter als 24 Monate, drei
Handlungsbereiche, mündlich 30–40 Minuten.

⚠️ **Nicht verifizierbar, deshalb in der Seite ausdrücklich als Richtwert
gekennzeichnet:** die GSSK-Prüfungsgebühr (der alte Text sagt ~450 €, die IHK Schwerin
veröffentlicht 405 € — das legt jede Kammer selbst fest), Vorbereitungskurse
1.600–4.000 €, 200–240 Unterrichtseinheiten über 5–7 Monate, und die „150–180 Minuten"
je schriftlichem Prüfungsteil. Bei letzterem steht jetzt die Vorschrift in der Seite
(mindestens zwei Stunden je Aufgabe, höchstens fünf Stunden insgesamt) statt der
Anbieterpraxis.

⚠️ Die Spannen für Unterrichtung (400–500 €) und Sachkunde (160–200 €) sind
**absichtlich die des bestehenden 34a-Artikels** und nicht die Einzelwerte des alten
Blogtexts (450 € / 160 €): zwei Ratgeber mit verschiedenen Preisen für dieselbe
Prüfung sind schlimmer als eine unscharfe Spanne.

⚠️⚠️ **`tariflohn-2026` enthält keine einzige Lohnzahl** — trotz Titel und trotz der
Beschreibung „So viel verdienst du 2026". Der Text erklärt ausschließlich die
Systematik. Ich habe **keine Zahlen erfunden**: das Jahr ist aus Slug und Titel raus,
und Titel und Beschreibung sagen jetzt, was der Artikel wirklich liefert. Die einzigen
Zahlen darin sind die tariflichen Zuschläge, und die kommen aus derselben zentralen
Datei wie auf der Kostenseite — Kunden- und Bewerberseite können sich also nicht
widersprechen.

⚠️ **Vier Fotos fehlen.** Die vier Artikel haben oben einen reservierten Rahmen mit
Beschriftung, kein Platzhalterbild — genau wie die drei bestehenden Artikel, als sie am
17.08. rausgingen. Gebraucht wird je 16:9, mindestens 1600x900:

| ☐ | Artikel | Motiv |
|---|---|---|
| ☐ | Bewerbung | Bewerbungsgespräch, Unterlagen auf dem Tisch |
| ☐ | Tariflohn | Dienstplan und Stundenabrechnung am Arbeitsplatz |
| ☐ | Voraussetzungen | Anmeldeunterlagen und Ausweis auf einem Tisch |
| ☐ | Qualifikationen | Lernsituation, Unterlagen und Laptop im Kurs |

Wenn du die Rahmen bis dahin lieber ganz weg hättest: das sind zwei Zeilen pro Seite
und kein CSS. Sag einfach Bescheid.

**Gemessen, nicht geschätzt:** die vier Artikel und der Hub bei 320 / 390 / 640 / 768 /
900 / 1024 / 1440 / 1920 Pixel Breite — **kein Querscrollen, nichts außerhalb des
Bildschirms, genau eine H1 pro Seite, keine übersprungene Überschriftenebene**, und
Hero und Artikelspalte auf derselben linken Linie. Kontrast auf dem echten Rendering
gemessen: der schlechteste Wert ist **4,60:1** bei 4,5:1 Minimum, Prosalinks 4,90:1.
FAQ-Text sichtbar und im strukturierten Datenblock **byte-identisch, 4 von 4, in allen
sieben Artikeln**. Mit abgeschalteten Animationen ist kein Element versteckt.

🟡 **Kleinigkeiten, die ich bewusst nicht angefasst habe:** der Hub hat jetzt sieben
Karten, also 3 + 3 + 1 — die letzte Karte steht allein in ihrer Reihe. Das gleiche
gilt für den Abstand zwischen H1 und Byline, der schon bei den drei bestehenden
Artikeln etwas eng ist. Beides sind Kosmetikpunkte; sag Bescheid, wenn dich eines
davon störst.

---

## Noch offen (Blöcke G, J, K)

Wird hier fortgeschrieben, sobald die Blöcke durch sind.

- G — Redirects in `vercel.json`
- J — `/datenschutz/` Übergangsfassung
- K — Datenstruktur für Stellenanzeigen (ohne Schema, es gibt keine Vakanz)

**Nicht in diesem Durchgang, bleibt offen:** H und I (brauchen Zugangsdaten),
das Hero-Foto der Startseite, der finale Datenschutztext nach dem
Cookiebot-Scan, echte Stellenanzeigen.
