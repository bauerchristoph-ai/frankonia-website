# Launch-Prüfprotokoll

Eine Liste zum Durchgehen, nicht ein zweites Changelog. Jede Zeile sagt: **was
geändert wurde, wo man es sieht, und woran man erkennt, dass es stimmt.**

Angelegt am 2026-08-23 auf Wunsch von Christoph, für den Durchgang vor dem
Umstellen der Domain auf Vercel.

**Regel:** dieses Dokument wird im selben Commit wie der Block aktualisiert, den
es beschreibt — dieselbe Regel, die schon für
[build-checklist.md](build-checklist.md) gilt.

Vorschau zum Prüfen: `npm run dev` (baut und serviert `dist/`).

**Wenn du wenig Zeit hast:** ganz unten steht der [Abschlussbericht](#abschlussbericht)
mit den fünf Listen — Redirect-Tabelle, portierte Artikel, nicht verifizierbare
Zahlen, Umgebungsvariablen, offene Punkte. Die Abschnitte 1 bis 12 sind die
Einzelheiten dazu.

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

> ⚠️ **Stand 26.08.: es sind elf Seiten, und neun davon sind Personenkarten.**
> Dieser Abschnitt beschreibt den Bau vom 23.08.; sechs weitere Karten sind am
> 26.08. dazugekommen und die drei hier gebauten haben ihren Einleitungssatz und
> ihre Leistungslinks nachgetragen bekommen. **Siehe Abschnitt 15** — dort steht
> auch der behobene Verlust.

Commit `60e5fc1` · 7 neue Seiten in `pages/`, `css/page-person.css`,
`docs/design-sources/person-pages.js`, 3 Porträts, 5 vCards, `vercel.json`

Alle sieben liegen unter der **identischen URL wie auf der alten Seite**, weil sie
auf gedruckten Karten und QR-Codes stehen.

| ☐ | Was | Wo prüfen | Woran erkennbar |
|---|---|---|---|
| ☐ | Drei Personenkarten (heute neun, siehe Abschnitt 15) | `/alexander-jaeger-sicherheitsdienst/`, `/alexander-jaeger-werkschutz/`, `/bryan-van-wey-werkschutz/` | Rundes Porträt, Name, Funktion, darunter Telefon, Mobil und E-Mail als antippbare Zeilen. ⚠️ Es waren fünf: die beiden Marco-Bayer-Seiten sind am 25.08. gelöscht worden (siehe Abschnitt 14) und leiten auf Alexander Jäger weiter. |
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

✅ **Tippfehler in deinen vCards — am 25.08. nach deiner Bestätigung behoben**
(Abschnitt 13). Beide Jäger-Dateien enthielten `TITLE:Vetriebsleiter` (ein „r"
fehlte) und hätten das so in die Adressbücher aller Empfänger getragen. Bei den sechs
vCards vom 26.08. nachgemessen: dort stimmt die Berufsbezeichnung jeweils mit der
Funktion auf der Seite überein.

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

> ✅ **Stand 26.08.: die vier Titelbilder sind eingesetzt.** Alle **sieben**
> Ratgeber-Artikel haben jetzt ein Bild, es gibt keinen leeren Rahmen mehr.
> Siehe Abschnitt 17.

Commit `432a3d2` · 4 neue Seiten in `pages/ratgeber/`, 4 Karten im Hub,
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

## 10 — Block G: Redirects

Commit `e4ed850` · `vercel.json`, `docs/design-sources/redirects-build.js`,
`docs/design-sources/redirect-test.js`

**Das Wichtigste in einem Satz: von den 31 Adressen der alten Seite werden 18
umgeleitet, 13 existieren auf der neuen Seite unter genau demselben Pfad, und keine
einzige wird nach dem Umzug ein 404.**

Die 13 unveränderten sind die Startseite, `/baustellenbewachung/`,
`/veranstaltungsschutz/`, `/jobs/`, `/angebot/`, `/referenzen/`, `/linktree/` und die
sechs Personenseiten — also genau das, was Block E absichtlich unter der alten URL
wieder aufgebaut hat. **Deine Liste war vollständig**; dazuzählen musste ich nur Block E.

### Die Weiterleitungen

| ☐ | Alte URL | Neue URL |
|---|---|---|
| ☐ | `/frankonia-werkschutz/` | `/werkschutz/` |
| ☐ | `/frankonia-objektschutz/` | `/objektschutz/` |
| ☐ | `/frankonia-sicherheitstechnik/` | `/sicherheitstechnik/` |
| ☐ | `/frankonia-veranstaltungsschutz/` | `/veranstaltungsschutz/` |
| ☐ | `/frankonia-revier-schliessdienst/` | `/revier-schliessdienst/` |
| ☐ | `/frankonia-kaufhausdetektei/` | `/kaufhausdetektei/` |
| ☐ | `/frankonia-empfangsdienst/` | `/empfangsdienst/` |
| ☐ | `/sicherheitsanalyse/` | `/sicherheitskonzept/` |
| ☐ | `/kundenstory-kunde-1/` | `/referenzen/` |
| ☐ | `/kundenstory-kunde-2/` | `/referenzen/` |
| ☐ | `/bewerbung-im-sicherheitsdienst-…/` | `/ratgeber/bewerbung-sicherheitsdienst/` |
| ☐ | `/tariflohn-2026-im-sicherheitsdienst/` | `/ratgeber/tariflohn-sicherheitsdienst/` |
| ☐ | `/voraussetzungen-im-sicherheitsdienst/` | `/ratgeber/voraussetzungen-sicherheitsdienst/` |
| ☐ | `/qualifikationen-im-sicherheitsdienst/` | `/ratgeber/qualifikationen-sicherheitsdienst/` |
| ☐ | `/jobchancen-als-sicherheitskraft/` | `/ratgeber/paragraph-34a-erklaert/` |
| ☐ | `/einsatzmoeglichkeiten-…-erlauben/` | `/ratgeber/paragraph-34a-erklaert/` |
| ☐ | `/so-schwierig-sind-…-§34a/` | `/ratgeber/paragraph-34a-erklaert/` |
| ☐ | `/wie-viel-kostet-die-fortbildung-…/` | `/ratgeber/qualifikationen-sicherheitsdienst/` |
| ☐ | `/hallo-welt/`, `/feed/`, `/…/feed/` | `/` |
| ☐ | `/author/…` | `/ueber-uns/` |
| ☐ | `/category/…`, `/tag/…` | `/ratgeber/` |

⚠️ **`tariflohn-2026` geht auf die portierte Fassung, nicht auf die Kostenseite** wie
in der Fallback-Liste vorgesehen: die Kostenseite ist die Kundenseite, der alte
Artikel war ein Bewerberthema.

### Was bewusst NICHT umgeleitet wird

`/wp-admin/` und `/wp-login.php` — so hast du es vorgegeben, 404 ist hier richtig.
**Ich habe gegengeprüft, dass keine der 58 Regeln sie versehentlich fängt**, denn ein
zu weit gefasster Platzhalter hätte das lautlos getan.

`/wp-content/*` habe ich ebenfalls nicht umgeleitet, und das ist eine Entscheidung:
du hattest „410 oder `/`" offengelassen. Die URL eines Bildes auf eine HTML-Seite zu
leiten ist ein sogenannter Soft-404 — Google bewertet das schlechter als einen
saubern 404 und Besucher gewinnt man damit auch nicht zurück. Ein echtes 410 lässt
sich über die Redirect-Liste gar nicht senden. **Ein 404 ist hier die richtige
Antwort, und die liefert das Hosting ohne jede Regel.** Alle Bilder der neuen Seite
liegen unter `/assets/`, dort ist also nichts zu retten.

### Warum es 58 Regeln für 27 Adressen sind

Jede alte Adresse braucht **zwei** Regeln, eine mit und eine ohne Schrägstrich am
Ende. Ohne die zweite leitet Vercel `/foo` zuerst auf `/foo/` um und erst danach
greift unsere Regel: das wären zwei Weiterleitungen hintereinander, und genau solche
Ketten wolltest du ausgeschlossen haben. Damit die beiden Varianten nicht irgendwann
auseinanderlaufen, erzeugt sie ein kleiner Generator aus einer Tabelle.

⚠️ **Die URL mit dem Paragrafenzeichen steht in drei Schreibweisen** in der Liste:
klein kodiert (so führt sie die alte Sitemap), groß kodiert (andere Programme
kodieren so) und mit dem echten `§`. Es ist nicht garantiert, welche Form Vercel
beim Abgleich sieht — mit allen drei ist jeder Weg abgedeckt.

### Prüfung

| ☐ | Was | Ergebnis |
|---|---|---|
| ☐ | Jede alte URL trifft genau eine Regel, mit und ohne Schrägstrich | 27 von 27 ok |
| ☐ | Keine Kette: kein Ziel ist selbst wieder Quelle | 0 Ketten |
| ☐ | Jedes Ziel existiert wirklich im Build | 0 Ziele fehlen |
| ☐ | Was bleiben soll, wird nicht gefangen | 16 geprüft, 0 fälschlich gefangen |
| ☐ | Vollständigkeit gegen die Sitemap der alten Seite | 31 Adressen, 0 verwaist |

⚠️⚠️ **Ein Punkt, den du wissen solltest: die Redirects lassen sich vor dem Deploy
nicht live testen.** `npm run dev` liefert nur die gebauten Seiten aus und liest
`vercel.json` überhaupt nicht — Weiterleitungen sind Hosting-Konfiguration, kein
Seiteninhalt. Alles oben ist deshalb statisch geprüft: gegen die Regelliste und gegen
den Build. **Nach dem Deploy bitte einmal**

```
node docs/design-sources/redirect-test.js https://frankonia-website.vercel.app
```

Dann prüft dasselbe Skript live, dass jede alte Adresse mit **genau einem** 301
direkt am Ziel landet und dass `/wp-admin/` einen 404 liefert.

### Noch bei Vercel einzustellen, nicht im Code

| ☐ | Was | Wo |
|---|---|---|
| ☐ | `www.frankonia-sicherheit.de` → `frankonia-sicherheit.de` | Vercel, Domain-Einstellungen |
| ☐ | HTTP → HTTPS | macht Vercel automatisch, nur kontrollieren |

Im Code würde die www-Umleitung erst greifen, nachdem die Anfrage schon bei der
Anwendung angekommen ist — als Domain-Redirect passiert sie eine Stufe früher.
`trailingSlash: true` war schon gesetzt.

🟡 **Zwei Punkte für dich, nicht umgesetzt:** alte WordPress-Links in der Form
`/?p=123` sind nicht abgedeckt (technisch möglich, aber es gibt keine Liste der
IDs — falls sie in der Search Console auftauchen, sind es ein paar Regeln mehr). Und
`/kundenstory-kunde-1/` geht wie vorgegeben auf `/referenzen/`, obwohl die Geschichte
thematisch zur Case Study Sicherheitstechnik passt; ich habe den Hub gewählt, weil
die alte Geschichte anonym ist und die Case Study von einem namentlich genannten
Kunden erzählt. Änderbar in einer Zeile.

---

## 11 — Block J: /datenschutz/ ist befüllt

> ⚠️ **Stand 26.08.: der Text ist überarbeitet, und dabei kam ein Fehler heraus,
> der die Seite ohne Fußbereich ausgeliefert hat. Siehe Abschnitt 16.** Die drei
> Textfehler, die dieser Abschnitt als „bewusst nicht korrigiert" beschreibt, sind
> auf deine Anweisung behoben; dazu sind vier weitere gefunden und vier fehlende
> Abschnitte ergänzt worden.

Commit `88ce96c` · `pages/datenschutz.html`, `css/page-legal.css`, `sitemap.xml`

| ☐ | Was | Wo prüfen | Woran erkennbar |
|---|---|---|---|
| ☐ | Text ist da | `/datenschutz/` | Sechs numerierte Abschnitte, Verantwortlicher mit Datenschutzbeauftragtem, Rechte-Kapitel 5.1 bis 5.8 |
| ☐ | Wortgleich | Stichprobe gegen die alte Seite | Kein Satz umformuliert — der Text ist maschinell aus der Live-Seite übernommen, nicht abgeschrieben |
| ☐ | Indexierbar | Seitenquelle | `index,follow,max-image-preview:large`, kein `noindex` mehr |
| ☐ | In der Sitemap | `/sitemap.xml` | `/datenschutz/` ist gelistet, mit derselben Priorität wie das Impressum |
| ☐ | Aus dem Footer erreichbar | beliebige Seite, Fußzeile | Link führt auf die befüllte Seite, nicht mehr auf einen Platzhalter |
| ☐ | Aus dem Formular erreichbar | Einwilligungs-Checkbox in einem Formular | Der Link in „Ich habe die Datenschutzerklärung gelesen" öffnet den echten Text |

**Der Text ist wortgleich deiner.** Er ist per Skript aus der ausgelieferten
Live-Seite gelesen worden, nicht abgetippt: bei einem Rechtstext ist ein Tippfehler
eine inhaltliche Änderung. Geändert habe ich nur zwei strukturelle Dinge, keinen
Satz — die Überschriftenebenen (h4/h5 auf h3/h4, weil die Seite schon h1 und h2 hat
und eine übersprungene Ebene gegen die Projektregeln geht) und die Verlinkung der
E-Mail-Adressen und der Telefonnummer.

⚠️⚠️ **Zwei Abschnitte habe ich NICHT übernommen: „Hinweise zur Datenverarbeitung im
Zusammenhang mit Google Analytics" und „reCAPTCHA".** Diese Website setzt beides
nicht ein — es gibt kein Analytics, keinen Tag Manager, kein reCAPTCHA, und die
Sicherheitsrichtlinie des Hostings erlaubt überhaupt keine Fremdskripte. Sie zu
veröffentlichen würde eine Datenverarbeitung erklären, die nicht stattfindet. Das ist
keine Formulierungsfrage: es wäre eine falsche Aussage in einem rechtlich
verbindlichen Dokument. Sie kommen zurück, sobald die Dienste wirklich laufen — dann
zusammen mit dem Consent-Banner und der Cookiebot-Deklaration.

✅ **Ein echter Gewinn gegenüber der Platzhalterseite: der Datenschutzbeauftragte
steht jetzt drin** (Herr Michael Lang, mit E-Mail-Adresse). Art. 13 Abs. 1 Buchst. b)
DSGVO verlangt diese Angabe, sobald ein Beauftragter benannt ist — die Shell nannte
ihn überhaupt nicht. Dazu der Verantwortliche mit Namen und Durchwahl.

⚠️⚠️ **Drei Fehler in deinem Text, absichtlich NICHT korrigiert** — du hattest
ausdrücklich gesagt, ich soll bestehende Texte nicht eigenmächtig ändern, sondern
melden:

| ☐ | Wo | Was |
|---|---|---|
| ☐ | Abschnitt 5.1 | Verweist auf „die Verschwiegenheitspflicht gem. **§ 83 StBerG**" — das Steuerberatungsgesetz. Ein Textbaustein aus einer Steuerberater-Vorlage; für einen Sicherheitsdienstleister ist die Norm ohne Bedeutung. |
| ☐ | Abschnitt 2 | Der zweite Unterpunkt heißt nochmals **„2.1 Aufruf der Webseite"**, obwohl darunter das Kontaktformular beschrieben wird. Müsste „2.2 Kontaktformular" heißen. |
| ☐ | Abschnitt 6 | Als Stand ist der **18.05.2018** angegeben. |

⚠️ **Was der Text nicht abdeckt und der endgültige braucht.** Drei Dinge auf der
neuen Seite kommen in der alten Erklärung nicht vor, und der Scanner wird alle drei
finden:

| ☐ | Was | Wo |
|---|---|---|
| ☐ | Kartenkacheln von CARTO — ein Aufruf an einen Dritten, der die IP der Besucher überträgt | Startseite und `/kontakt/` |
| ☐ | Bewerbungsunterlagen samt Lebenslauf-Upload | `/jobs/` |
| ☐ | Terminbuchung über HubSpot | verlinkt von `/sicherheitscheck-walde/` |

✅ **Zwei Darstellungsfehler, die beim Einbau auffielen und behoben sind** — beide
entstanden dadurch, dass diese Seite vorher weder Unterüberschriften noch Listen
hatte:
die Hierarchie war **umgekehrt** (die Unterüberschrift rendert 25 Pixel fett, ihre
eigene Überschrift darüber nur 20 Pixel normal), und die Aufzählungen hatten **weder
Punkt noch Einzug**, weil die Seite sitewide `list-style: none` erbt. In einem
Rechtstext, der aufzählt welche Daten gespeichert werden, ist das ein Verlust an
Verständlichkeit. Gegengeprüft, dass das Impressum sich dadurch nicht verändert hat.

⚠️ **Für den Scanner gilt weiter der alte Hinweis: die Sicherheitsrichtlinie wird ihn
blockieren.** `script-src 'self'` erlaubt keine Fremdskripte, ein als externes
`<script>` ausgeliefertes Werkzeug wird also stillschweigend geblockt und die Seite
bleibt leer. Sein Host muss in `vercel.json` eingetragen werden.

---

## 12 — Block K: Stellenanzeigen vorbereitet, sichtbar ist nichts

Commit `9243115` · `content/vacancies.json`, `build.js`, `pages/jobs.html`,
`css/page-jobs.css`

**Das Ergebnis ist absichtlich unsichtbar: `/jobs/` sieht heute exakt so aus wie
vorher.** Es gibt keine echte Vakanz, und JobPosting-Daten ohne reale Stelle sind ein
Verstoß gegen Googles Richtlinien — eine veraltete oder erfundene Anzeige wird nicht
bloß ignoriert, sie kostet die Domain ihre Glaubwürdigkeit für alle künftigen
Anzeigen. Der Renderer gibt bei leerer Liste deshalb **nichts** aus: keine Sektion,
keine Überschrift, kein strukturierter Datenblock.

| ☐ | Was | Wo prüfen | Woran erkennbar |
|---|---|---|---|
| ☐ | Nichts hat sich verändert | `/jobs/` | Die Seite ist unverändert; zwischen der Überschrift „Vom Quereinsteiger bis zur Meisterin" und der Leiter steht nichts Neues |
| ☐ | Kein Stellen-Schema | Seitenquelle `/jobs/` | Genau ein Block strukturierter Daten, kein `JobPosting` darin |

**Die erste echte Stelle ist ein Eintrag in `content/vacancies.json`, und sonst
nichts.** Dann erscheinen gleichzeitig die
sichtbare Liste auf `/jobs/` und der JobPosting-Block für Google. Welche Felder ein
Eintrag braucht, steht ausführlich in der Datei selbst — Bezeichnung, Ort,
Beschäftigungsart, Veröffentlichungsdatum und Gültigkeit bis.

⚠️ **Ein Feld lohnt besondere Aufmerksamkeit: „gültig bis".** Es ist technisch
optional, aber ohne es bleibt die Anzeige aus Googles Sicht unbegrenzt offen. Eine
Stelle, die längst besetzt ist und trotzdem in den Suchergebnissen steht, schadet
mehr als sie bringt.

**Geprüft, nicht angenommen.** Ich habe zwei Testanzeigen eingetragen, gebaut und
angesehen: zwei Einträge in der Liste, zwei Stellen im strukturierten Datenblock,
beide Blöcke technisch gültig, die Angabe „gültig bis" nur dort wo sie gesetzt war,
deutsche Bezeichnungen für die Beschäftigungsart (Vollzeit, Teilzeit), eigene
Sprungmarken je Stelle und die Verknüpfung mit dem bestehenden Unternehmenseintrag.
Danach wieder auf leer gestellt — die gebaute Seite ist wieder identisch mit der
vorherigen.

⚠️ **Eine Einbau-Entscheidung, die du kennen solltest:** die Stellenliste erscheint
INNERHALB der bestehenden Sektion „Wen wir suchen", nicht als eigene Sektion. Jeder
Farbwechsel dieser Website kostet eine Pixel-Übergangsbande, und die nachfolgende
Sektion reserviert deren Höhe. Eine Sektion, die durch eine reine Dateneingabe
plötzlich erscheint, würde diese Abfolge verschieben — ein Layoutfehler, ausgelöst
durch das Eintragen einer Stelle, und niemand schaut dabei zu. Innerhalb der Sektion
ist der leere Zustand wirklich wirkungslos. Inhaltlich passt es auch: erst was jetzt
offen ist, dann wen wir generell suchen.

---

## Noch offen

Alle Blöcke dieses Durchgangs sind durch. Was bleibt, und von wem es abhängt:

**Du oder dein Team:**

| ☐ | Was | Wo im Protokoll |
|---|---|---|
| ☐ | Hero-Foto der Startseite | offen seit Block A |
| ☐ | Zwei Fragen zum Datenschutztext: Auftragsverarbeitungsvertrag mit dem Hoster, Aufbewahrungsdauer für Bewerbungen | Abschnitt 16 |
| ☐ | Eine Frage zu Block D: soll der Anker `/#dienstleistungen` aus dem Linktree ein Ziel auf der neuen Startseite bekommen? | Abschnitt 6 |

**Nach dem Deploy, technisch:**

| ☐ | Was | Wie |
|---|---|---|
| ☐ | Redirects live prüfen | `node docs/design-sources/redirect-test.js https://…` |
| ☐ | www auf die nackte Domain umleiten | Vercel, Domain-Einstellungen (nicht im Code) |
| ☐ | HTTP auf HTTPS kontrollieren | macht Vercel automatisch |

**Bleibt bewusst außerhalb dieses Durchgangs:** H und I (brauchen Zugangsdaten),
der finale Datenschutztext nach dem Cookiebot-Scan — dessen Host muss dann in die
Sicherheitsrichtlinie in `vercel.json` eingetragen werden, sonst wird das Werkzeug
stillschweigend geblockt — und echte Stellenanzeigen, für die die Struktur jetzt
bereitliegt.

---

## 13 — Kundenrunde vom 25.08.: Google-Link, drei Logos, vCard

Commit `fcfabc1` · 42 Seiten, `css/components.css`, `pages/referenzen.html`,
`css/page-referenzen.css`, 3 Logos, `docs/design-sources/client-logos.js`,
2 vCards

| ☐ | Was | Wo prüfen | Woran erkennbar |
|---|---|---|---|
| ☐ | Bewertungs-Badge ist verlinkt | beliebiger Hero mit dem Google-Badge | Klick öffnet dein Google-Profil in einem neuen Tab; das Badge sieht unverändert aus und wird beim Überfahren nur leicht heller |
| ☐ | Norma, Schöner Leben, nacht arena als Logo | `/referenzen/`, Kundenband | Alle 35 Firmen tragen jetzt ein Logo, keine mehr nur ihren Namen |
| ☐ | Bandgeschwindigkeit gleich | `/referenzen/` | Die drei Reihen laufen gleich schnell; keine ist erkennbar flotter |
| ☐ | vCard | „Kontakt speichern" auf einer Jäger-Seite | Berufsbezeichnung steht als „Vertriebsleiter" im Adressbuch |

**Das Badge ist auf allen 42 Seiten ein Link**, nicht nur auf der Startseite — es
war überall dasselbe Bauteil. Kein Unterstrich und keine Farbänderung: die Ziffern
und Sterne sind die Marke Google, ein Unterstrich darunter liest sich als Fehler.
Der Zustand kommt über die Deckkraft, und der Fokusrahmen für Tastaturbedienung
bleibt. Screenreader hören zusätzlich „Google-Profil, öffnet in einem neuen Tab".

⚠️ **Die drei Logos mussten aufbereitet werden, und zwar jedes anders.** Im Band
sind alle Logos weiße Silhouetten auf Transparenz — anders geht es nicht, weil die
Sektion dunkel ist und die helle Variante mit einer Farbumkehr arbeitet, die nur bei
einfarbigen Zeichen funktioniert. Norma ist ein weißer Schriftzug in einem roten
Kasten, dort ist also das Weiße die Tinte; Schöner Leben und nacht arena sind dunkel
auf weiß, dort ist es umgekehrt. Beide Wege stecken in
`docs/design-sources/client-logos.js`, damit das nächste Logo nicht wieder von Hand
gedeutet werden muss.

⚠️ **Und die Bandgeschwindigkeit musste nachgerechnet werden.** Ein Logo ist breiter
als ein getippter Name, also wurde die Strecke pro Umlauf länger — bei gleicher
Dauer heißt das: schneller. Gemessen liefen die drei Reihen danach mit 10,1 / 11,5 /
11,9 Pixeln pro Sekunde. Die Baustellenreihe hat sich nicht geändert, also war ihre
Geschwindigkeit der Maßstab; die beiden anderen sind darauf zurückgerechnet. Jetzt
laufen alle drei mit 11,5, auf dem Telefon wie am Rechner, und jede Reihe ist immer
noch länger als der Bildschirm — sonst würde der Umlauf sichtbar springen.

⚠️ **Der Google-Link ist der Kurzlink, den du geschickt hast.** Er löst auf dein
Unternehmensprofil auf; die dauerhafte Kennung dahinter steht als Ausweichlösung im
Kommentar im Quelltext, falls Google solche Kurzlinks irgendwann austauscht.

---

## 14 — Marco Bayer entfernt, und zehn alte Seiten, die keine Sitemap kannte

Commit `eec5293` · 2 Seiten und 4 Dateien gelöscht, `vercel.json`,
`docs/design-sources/person-pages.js`, `docs/design-sources/redirect-test.js`

### Marco Bayer

| ☐ | Was | Woran erkennbar |
|---|---|---|
| ☐ | Beide Seiten weg | `/marco-bayer-sicherheitsdienst-2/` und `/marco-bayer-werkschutz-2/` leiten auf die entsprechende Jäger-Seite weiter |
| ☐ | Kontaktdatei weg | Seine vCards und sein Porträt sind aus dem Projekt entfernt |
| ☐ | Kommt nicht zurück | Der Generator kennt ihn nicht mehr, sonst hätte ihn der nächste Lauf neu erzeugt |

Die Weiterleitung ist variantentreu — Sicherheitsdienst auf Sicherheitsdienst,
Werkschutz auf Werkschutz. Du hattest Alexander Jäger **oder** Steffen Walde
angeboten; ich habe Jäger genommen, weil er als Vertriebsleiter der nächstliegende
Ansprechpartner ist. Auf Walde umzustellen sind zwei Zeilen, sag einfach Bescheid.

Die URLs bleiben umgeleitet und werden nicht einfach zu 404: gedruckte Karten und
QR-Codes kann man nicht zurückrufen.

### ⚠️⚠️ Der wichtigere Fund: zehn Seiten, die in keiner Sitemap stehen

Die alte Seite hat **34 veröffentlichte Seiten, ihre Sitemap listet 23.** Die
Differenz ist über die WordPress-Schnittstelle sichtbar, nicht über die Sitemap —
eine Sitemap ist eine Empfehlung an Suchmaschinen und kein Verzeichnis. Für eine
Migration ist sie die falsche Quelle, und ich habe sie in Block G genau so benutzt.
**Zehn dieser Adressen wären beim Umzug still zu 404 geworden.**

✅ **Am 26.08. hast du sie Zeile für Zeile entschieden, alle zehn sind umgesetzt —
siehe Abschnitt 15.** Sechs sind echte Seiten unter ihrer alten URL geblieben, zwei
gehen auf Alexander Jäger, zwei liefern absichtlich 404. Der Redirect-Test meldet
keine verwaiste Adresse mehr.

Der Vorschlag von damals steht unten unverändert, damit nachvollziehbar bleibt,
worüber entschieden wurde.

| ☐ | Alte URL | Was es ist | Stand |
|---|---|---|---|
| ☐ | `/steffen-walde-sicherheitsdienst/` | Personenkarte | 11/2023 |
| ☐ | `/steffen-walde-werkschutz/` | Personenkarte | 11/2023 |
| ☐ | `/thomas-windisch-sicherheitsdienst/` | Personenkarte | 11/2024 |
| ☐ | `/thomas-windisch-werkschutz/` | Personenkarte | 11/2024 |
| ☐ | `/christoph-bauer-sicherheitsdienst-2/` | Personenkarte | 04/2025 |
| ☐ | `/daniel-wettengel-sicherheitsdienst/` | Personenkarte | 11/2023 |
| ☐ | `/bryan-van-wey-security/` | ältere zweite Variante zu `/bryan-van-wey-werkschutz/` | 11/2023 |
| ☐ | `/morelo-werkschutz-team-2/` | kundenspezifische Teamseite | 05/2025 |
| ☐ | `/testformular/` | Testseite | 01/2024 |
| ☐ | `/homepage-2/` | die alte Startseite als Seite (WordPress-Eigenheit) | 08/2025 |

Mein Vorschlag, du entscheidest:

- **`/testformular/` und `/homepage-2/`**: nicht weiterleiten. Eine Testseite hat
  keine Nachfolgerin, und `/homepage-2/` ist die technische Innenansicht der alten
  Startseite — beide sind bei einem 404 richtig aufgehoben.
- **`/morelo-werkschutz-team-2/`**: auf `/referenzen/`, dort steht die
  MORELO-Geschichte.
- **Personenkarten von Leuten, die noch da sind**: nachbauen wie die drei
  bestehenden, oder auf die nächste passende Person umleiten. Bei Steffen Walde
  würde ich nachbauen — er ist Geschäftsführer und `/sicherheitscheck-walde/` gibt
  es schon.
- **Personenkarten von Leuten, die weg sind**: wie bei Marco Bayer weiterleiten.

Sag mir einfach pro Zeile „bleibt", „weiterleiten auf …" oder „404", dann setze ich
das um.

⚠️ **Deine Antwort wich in zwei Punkten von diesem Vorschlag ab, und das ist so
umgesetzt:** die MORELO-Pforte ist **nicht** auf /referenzen/ umgeleitet, sondern
als eigene Karte geblieben (sie hat eine eigene Telefonnummer, die auf gedruckten
Zetteln an einer Pforte steht), und Van Weys Security-Karte ist ebenfalls geblieben
statt auf seine Werkschutz-Karte zu zeigen.

### Norbert Wedebert

Eine solche Seite existiert nicht. Weder die Seitenliste der alten Website noch ihre
eigene Suche kennen sie, und die naheliegenden Adressen antworten mit 404. Falls es
sie einmal gab, ist sie schon gelöscht — es ist also nichts zu tun.

---

## 15 — Die sechs behaltenen Visitenkartenseiten, zwei Weiterleitungen, zwei bewusste 404

Commit `7475d91` · 6 neue Seiten in `pages/`, 3 Porträts, 6 vCards,
`docs/design-sources/person-pages.js`, `redirects-build.js`, `redirect-test.js`,
`vercel.json` · **kein CSS geändert**

Damit sind die zehn Seiten aus Abschnitt 14, die in keiner Sitemap standen,
vollständig abgearbeitet — deine Entscheidung Zeile für Zeile umgesetzt.

| ☐ | Deine Entscheidung | Ergebnis |
|---|---|---|
| ☐ | Walde behalten | `/steffen-walde-sicherheitsdienst/` und `/steffen-walde-werkschutz/` sind echte Seiten unter ihrer alten URL |
| ☐ | Bauer behalten | `/christoph-bauer-sicherheitsdienst-2/` |
| ☐ | Wettengel behalten | `/daniel-wettengel-sicherheitsdienst/` |
| ☐ | Van Wey behalten | `/bryan-van-wey-security/` — die zweite Karte neben der bestehenden Werkschutz-Karte |
| ☐ | Morelo Werkschutz Team behalten | `/morelo-werkschutz-team-2/` |
| ☐ | Windisch auf Jäger weiterleiten | beide Varianten, variantentreu: Sicherheitsdienst auf Sicherheitsdienst, Werkschutz auf Werkschutz |
| ☐ | Testformular auf 404 | keine Regel, und der Redirect-Test führt sie jetzt als **gewollten** 404, nicht mehr als Fehler |
| ☐ | Homepage 2 auf 404 | dito |

**Es sind jetzt neun Personenkarten statt drei.** Prüfen kannst du sie alle gleich:
Porträt, Name, Funktion, antippbare Zeilen für Telefon, Mobil und E-Mail, „Kontakt
speichern", „Mehr erfahren", darunter vier Leistungslinks.

| ☐ | Was | Woran erkennbar |
|---|---|---|
| ☐ | Daten stimmen | Nummern, Funktionen und Zusatzzeilen wie auf der Live-Seite, nichts umformuliert |
| ☐ | Kontakt speichern | Mit dem Handy antippen: es öffnet die Kontakt-Ansicht, kein Datei-Download |
| ☐ | Leistungslinks | Führen auf die **neuen** Leistungsseiten, ohne Umleitungs-Zwischenschritt |
| ☐ | Nicht im Index | Seitenquelle: `noindex,follow`, und keine der neun steht in `/sitemap.xml` |

**Deine Dateien, unverändert.** Die drei neuen Porträts und die sechs vCards sind
direkt deine Uploads — die vCards mit Adresse, Fax, Arbeits-URL und eingebettetem
Foto. Selbst erzeugte hätten Felder verloren. Nachgemessen: die Berufsbezeichnung in
jeder vCard stimmt mit der Funktion auf ihrer Seite überein, also kein zweiter Fall
wie der Jäger-Tippfehler.

### ⚠️ Drei Dinge, die dir gehören und die ich nicht eigenmächtig geändert habe

**1. Van Wey steht auf einer dritten Firmierung.** Seine Security-Karte nennt
`b.vanwey@frankonia-security.de`, und die vCard dazu sagt als Firma **„FRANKONIA
Security GmbH & Co. KG"**. Neben `-sicherheit.de` und `-werkschutz.de` ist das eine
dritte Marke, sie kommt **im ganzen restlichen Projekt nicht ein einziges Mal vor**,
und im Impressum steht sie auch nicht. So steht es auf deiner Live-Karte, deshalb
steht es so auf der neuen — aber wenn das eine Altlast ist, sind es zwei Zeilen.

**2. Ein Link war auf der alten Seite kaputt, auf allen neun Karten.** Sie verlinken
`/frankonia-baustellenbewachung`, und diese Adresse antwortet live mit **404** —
ihre sieben Geschwister antworten mit 301. Auf der neuen Seite zeigt der Link auf
`/baustellenbewachung/`, der Fehler ist damit weg und nicht mitgenommen.

**3. Van Weys Foto: ich habe das neuere genommen.** Deine Security-Karte zeigt ein
Foto von Dezember 2023, die Werkschutz-Karte eines von Dezember 2025. Es ist
dieselbe Person, und zwei Aufnahmen aus zwei Jahren auf zwei Seiten derselben
Website sehen nach Fehler aus, nicht nach Werktreue — also tragen beide Karten das
Foto von 2025. Nachgemessen, damit das keine Behauptung bleibt: mittlere Abweichung
**65,9 von 255**, also unstrittig zwei verschiedene Aufnahmen.

### ✅ Nebenbefund, den ich gleich mit behoben habe

**Die drei bereits gebauten Karten hatten ihren Einleitungssatz und ihre
Leistungslinks verloren.** Jede der neun Live-Karten hat eine Zeile über dem
Kontaktblock („Wenn Sie sich, Ihr Unternehmen … effektiv schützen möchten!") und
darunter vier Leistungslinks. Beim ersten Übertrag am 23.08. sind die verloren
gegangen: Jäger Sicherheitsdienst fehlten beide, Jäger Werkschutz hatte einen von
vier Links, Van Wey Werkschutz fehlten die Links. Steht jetzt überall — sonst hätte
diese Runde sechs vollständige neben drei unvollständigen Karten hinterlassen.

### Warum die Morelo-Karte anders aussieht

Sie ist **keine Person, sondern ein Posten** — die Pforte, die FRANKONIA beim Kunden
MORELO besetzt. Daher drei Abweichungen, und alle drei stehen so auf deiner
Live-Karte: **kein Porträt** (die Live-Karte hat keines), **keine Festnetznummer**
(nur die Mobilnummer der Pforte) und kein Zusatz zur Berufsbezeichnung. Ohne Foto
rutscht der Name nach oben, es bleibt keine Lücke — angesehen, nicht nur gerechnet.

### Gemessen

- **Die neun Karten und die zwei Verweisseiten:** je genau eine `<h1>`, keine
  übersprungene Überschriftenebene, `noindex,follow` auf allen elf, keine in der
  Sitemap, kein Animations-JavaScript, jede verlinkte Datei vorhanden, **kein toter
  interner Link**, Titel höchstens 57 und Beschreibungen höchstens 124 Zeichen.
- **Die Redirect-Prüfung:** 31 Quell-URLs, 18 Adressen, die nicht umgeleitet werden
  dürfen (keine fälschlich gefangen), und die Vollständigkeitsprobe gegen die alte
  Seite steht jetzt auf **41 Adressen — 22 umgeleitet, 17 unverändert vorhanden,
  2 gewollt 404, 0 verwaist**. Vorher waren es 2 verwaiste.
- **Der Test kennt „gewollt 404" jetzt als eigene Kategorie**, mit Gegenprüfung: wenn
  eine dieser zwei Adressen doch wieder erreichbar wird, meldet er das. Bewusst eine
  eigene Liste — hätte ich die Absicht aus der bestehenden Ausnahmeliste geraten,
  würde der nächste echte Fall durchrutschen.
- **Ansicht geprüft** bei 1440 und 390 Pixel Breite, Walde-Karte und Morelo-Karte.

---

## 16 — Datenschutzerklärung überarbeitet, und ein Fehler, der die Seite ohne Fußbereich ausgeliefert hat

Commit `7971319` · `pages/datenschutz.html`, `docs/datenschutz-drittanbieter.md`
· **kein CSS, keine andere Seite**

Auf deine Anweisung („Datenschutz — optimiere es einfach selbst so dass es am
sinnvollsten ist und am besten passt"). Für **diese eine Seite** ist damit die
Projektregel „bestehende Webtexte nicht inhaltlich ändern" aufgehoben, und nur hier:
bei einer Datenschutzerklärung ist eine falsche Aussage keine Geschmacksfrage,
sondern eine falsche Pflichtinformation nach Art. 13 DSGVO.

### ⚠️⚠️ Der wichtigste Fund war kein Textfehler

**Die Seite endete mitten im Inhalt.** Es fehlten das schließende `</main>`, zwei
`</div>`, `</section>`, der **Footer**, der WhatsApp-Button und `</body></html>` —
seit dem Bau am 23.08. Browser schließen offene Tags selbst, deshalb **sah** die
Seite normal aus. Sie hatte aber **keinen Fußbereich**: keinen Impressum-Link, keine
Navigation heraus, keine Kontaktangaben. Auf genau der Seite, die aus der
Einwilligungs-Checkbox jedes Formulars und aus dem Footer jeder anderen Seite
verlinkt ist.

| ☐ | Was | Woran erkennbar |
|---|---|---|
| ☐ | Fußbereich ist da | Unten auf `/datenschutz/` steht der normale Footer mit Impressum, Kontakt und Social-Links |
| ☐ | WhatsApp-Schaltfläche ist da | Grüner Kreis unten rechts, wie auf jeder anderen Seite |
| ☐ | Querverweis | Am Textende: „Zum Impressum" — das Gegenstück zum „Zur Datenschutzerklärung" im Impressum |

**Gefunden hat es die Messung, nicht das Anschauen.** Meine Prüfsonde wollte
`<main>…</main>` ausschneiden und bekam einen leeren String zurück. **Alle 69 Seiten
nachgeprüft: es war die einzige.** Die Prüfung ist jetzt Teil des Werkzeugkastens.

### Behoben, weil nachweislich falsch

| ☐ | Was war falsch | Jetzt |
|---|---|---|
| ☐ | Abschnitt 5.1 berief sich auf **§ 83 StBerG** (Steuerberatungsgesetz) und schränkte damit dein Auskunftsrecht unter einer Norm ein, die für einen Sicherheitsdienstleister nicht gilt | Satz gekürzt. Der zweite Grund darin (überwiegendes Interesse eines Dritten) ist einschlägig und bleibt |
| ☐ | Zweite Unterüberschrift hieß „2.1 Aufruf der Webseite", darunter stand das Kontaktformular | „2.2 Kontaktformular" |
| ☐ | Stand **18.05.2018** | 26.08.2026 |
| ☐ | Domain als „www.frankonia-sicherheit.de" | ohne www — die Seite läuft auf der nackten Domain |
| ☐ | ⚠️ **Abschnitt 4 beschrieb Cookies, die es nicht gibt** | sagt jetzt, was zutrifft |

**Zum Cookie-Abschnitt, weil das der auffälligste Eingriff ist:** der alte Text
beschrieb Session-Cookies, temporäre Cookies und Cookies „zu statistischen Zwecken".
Nachgemessen im gesamten eigenen JavaScript: **kein einziges `document.cookie`, kein
`localStorage`, kein `sessionStorage`, kein Analysewerkzeug eingebunden.** Die
Erklärung erklärte also eine Verarbeitung, die nicht stattfindet — und beschrieb
dabei ausgerechnet Analyse-Cookies, die einwilligungspflichtig wären. Das ist kein
harmloser Überschuss: es behauptet eine Verarbeitung, für die dir ein
Einwilligungsbanner fehlt.

### Ergänzt, weil es stattfindet und nicht genannt war

| ☐ | Neuer Abschnitt | Warum er nötig war |
|---|---|---|
| ☐ | **2.3 Bewerbungen über das Karriereformular** | `/jobs/` nimmt Name, E-Mail, Telefon, Qualifikation, Nachricht **und einen Lebenslauf-Upload** an. Dazu stand nichts in der Erklärung |
| ☐ | **3.1 Hosting** | Art. 13 Abs. 1 Buchst. e) verlangt die Empfänger; der Logfile-Abschnitt sprach nur von „dem Server dieser Webseite" |
| ☐ | **3.2 Kartendarstellung** | Die Kartenkacheln kommen von CARTO und übertragen die IP der Besucher an einen Dritten. Betroffen: Startseite, `/einsatzgebiete/`, `/kontakt/` |
| ☐ | **3.3 Verlinkte Dienste Dritter** | WhatsApp, Instagram, LinkedIn, Facebook, Google-Bewertungsprofil, Google-Route, HubSpot-Termin. Alle sind **reine Links**: vor dem Klick verlässt kein Datum die Seite. Das steht so drin, weil das der entscheidende Unterschied zu einem eingebetteten Inhalt ist |

Die Feldlisten und die betroffenen Seiten sind **im Projekt nachgemessen**, nicht aus
einer Vorlage übernommen — deshalb steht bei der Karte auch, dass sie erst beim
Scrollen lädt: wer die Stelle nicht erreicht, baut keine Verbindung auf.

### ⚠️ Zwei Punkte, die nur du oder dein Anwalt beantworten kann

| ☐ | Frage | Wie es aktuell im Text steht |
|---|---|---|
| ☐ | **Besteht ein Auftragsverarbeitungsvertrag mit dem Hoster** (Vercel) nach Art. 28 DSGVO? | Der Text sagt, dass so ein Vertrag **erforderlich ist** — das ist Gesetz und unstrittig. Er behauptet **nicht**, dass er geschlossen wurde. Sobald du das bestätigst, wird daraus ein Aussagesatz |
| ☐ | **Wie lange bewahrst du Bewerbungsunterlagen auf?** | Der Text sagt „nach Abschluss des Verfahrens, sobald keine Aufbewahrungspflichten entgegenstehen". Übliche Praxis sind sechs Monate; das ist aber eine Festlegung deines Unternehmens, keine, die ich treffen kann |

Beide sind im Markup an der Stelle markiert. **Eine erfundene Vertragsaussage wäre
schlimmer als eine Lücke** — deshalb steht sie nicht drin.

### Was bewusst nicht drin steht

Google Analytics und reCAPTCHA. Sie laden heute nicht, und eine Erklärung beschreibt
den Ist-Zustand. Der Wortlaut von der alten Seite liegt vollständig in
`docs/datenschutz-drittanbieter.md`, zusammen mit der einzuhaltenden Reihenfolge
(Consent-Werkzeug zuerst, dann die Dienste, dann der Text) und den CSP-Hosts, die
sonst still blockiert würden. **Wenn das kommt, wird Abschnitt 4 ERSETZT, nicht
ergänzt** — er sagt heute „keine Cookies", und daneben einen Cookie-Abschnitt zu
stellen wäre ein Widerspruch in einem Dokument. Das steht als Hinweis an beiden
Stellen.

### Gemessen

- **Überschriftenfolge in `<main>`: h1 → h2 → h3 → h4, kein übersprungener Grad**,
  22 Überschriften, `5.1` bis `5.8` unverändert.
- **Nachgeprüft, dass die Fehler weg sind**: „§ 83 StBerG" 0x, „18.05.2018" 0x,
  „www.frankonia-sicherheit.de" 0x, und keine doppelte „2.1".
- **Größenverhältnis der Überschriften stimmt**: h3 20px/500 über h4 16px/600 —
  vorher rutschte h4 auf 25px/700 und war damit größer als seine eigene Überschrift
  darüber (behoben in Block J, hier erneut nachgemessen).
- **Alle 69 gebauten Seiten auf Tag-Bilanz geprüft**: `main`, `body`, `html`,
  `footer`, `header`, `section` je gleich viele öffnende wie schließende — 0 Seiten
  auffällig.
- **Kein Platzhalter offen**, kein Seitenumbruch nach rechts, Listen mit Punkten,
  Ansicht bei 1440 und 390 Pixel geprüft.

---

## 17 — Formular-Integration: die Formulare senden jetzt wirklich

Commits `e9a7ec1` (Consent, Tag Manager, CSP, `/danke/`), `19e4cbc` (Endpoint und
Tests), `c9fc7ba` (gemeinsames Formular auf 44 Seiten), `82d424a`
(Ratgeber-Titelbilder und Doku)

**Damit ist der wichtigste offene Punkt dieses Protokolls erledigt.** Bis heute
stand hier: „alle 40 Formulare senden derzeit nirgendwohin (`action="#"`) —
fehlt, blockiert Leads". Es waren 45, und sie senden jetzt an einen echten
Endpoint, der die Anfrage nach HubSpot und Brevo schreibt, dir eine
Benachrichtigung schickt und dem Absender eine Eingangsbestätigung.

### Was du selbst durchklicken solltest

| ☐ | Was | Woran erkennbar |
|---|---|---|
| ☐ | Einwilligungsbanner | Beim ersten Aufruf erscheint der Cookiebot-Hinweis, **bevor** irgendetwas anderes lädt |
| ☐ | Spamschutz ist trotzdem da | Im Formular steht der Cloudflare-Kasten — **auch wenn du den Banner ignorierst**. Das ist der Punkt, der sonst still fehlschlägt |
| ☐ | Formularfelder | Vorname und Nachname getrennt in einer Zeile, E-Mail, Telefon (**freiwillig**), Unternehmen, Leistung, Nachricht |
| ☐ | Leistung ist vorbelegt | Auf `/objektschutz/` steht dort „Objektschutz", auf der Startseite bleibt die Auswahl offen |
| ☐ | Zwei Haken, nicht einer | Datenschutz (Pflicht) und Marketing (freiwillig, **nicht** vorausgewählt) |
| ☐ | Absenden | Es geht auf `/danke/`, nicht auf eine JSON-Seite |
| ☐ | Danke-Seite | Bestätigung, „innerhalb eines Werktages", Telefonnummer für den dringenden Fall, zwei Weiterklicks |
| ☐ | Zwei Mails kommen an | eine Eingangsbestätigung beim Absender, eine Benachrichtigung an `info@frankonia-sicherheit.de` — mit dem Absender als **Antwortadresse**, „Antworten" führt also direkt zum Interessenten |
| ☐ | HubSpot | Kontakt angelegt oder aktualisiert, das Unternehmen verknüpft, und die Nachricht als **Notiz** (nicht in einem Textfeld) |
| ☐ | Brevo | Kontakt mit VORNAME, NACHNAME, COMPANY, SERVICE, SOURCE „Website" und `HUBSPOT_CONTACT_ID` |
| ☐ | Bewerbung | `/jobs/` zeigt jetzt dein HubSpot-Formular, nicht mehr ein selbst gebautes |
| ☐ | Ratgeber-Titelbilder | Alle **sieben** Artikel haben oben ein Bild, kein leerer Rahmen mehr |

**Nimm für den Test eine klar erkennbare Adresse**, nicht die eines echten
Kontakts — jeder Testlauf legt einen Kontakt in HubSpot und in Brevo an.

### ⚠️⚠️ Drei Änderungen an bestehenden Formularen, die du kennen musst

**1. Telefon ist überall freiwillig geworden.** Es war auf allen 45 Formularen
Pflichtfeld. Auf einer B2B-Anfrage ist eine Telefonnummer eine Hürde, und die
E-Mail genügt für die Rückmeldung. Wenn du sie zurück als Pflicht willst, ist das
eine Zeile — aber dann in allen 44 gleichzeitig, was der eigentliche Gewinn des
gemeinsamen Formulars ist.

**2. `/angebot/` hat seine Sonderregel verloren.** Diese Seite stellte den Namen
freiwillig, weil geringere Hürden der Sinn einer Ads-Landingpage sind. Der
Auftrag verlangt für alle 44 Seiten denselben Feldsatz. Unter dem Strich hat die
Seite dadurch trotzdem **eine Hürde weniger**: zwei Namensfelder statt einem
freiwilligen, aber Telefon fällt als Pflicht weg.

**3. Ein Feld „Name" gibt es nicht mehr.** Vorname und Nachname sind getrennt,
weil HubSpot und Brevo beide getrennte Felder führen. Ein einzelnes Feld müsste
serverseitig geraten geteilt werden, und bei „Anna Maria von der Heide" ist jede
Regel falsch.

### Was passiert, wenn etwas ausfällt

Die Regel im Code heißt „eine Anfrage darf nie verloren gehen", und so ist sie
umgesetzt:

| Fall | Was der Besucher sieht | Was passiert |
|---|---|---|
| HubSpot ist aus | Erfolg | Brevo läuft, die Benachrichtigung kommt, in ihr steht **„HubSpot: NICHT gespeichert — bitte manuell anlegen"** |
| Brevo ist aus | Erfolg | Der HubSpot-Kontakt samt Notiz steht. ⚠️ Es kommt dann **keine** Bestätigungsmail und **keine** Benachrichtigung — siehe der offene Punkt unten |
| Beide aus | Fehlermeldung mit deiner Telefonnummer und einer Vorgangsnummer | Im Log steht `ALARM forms` — danach kann man in den Vercel-Logs suchen |
| Cloudflare ist aus | Erfolg | Der Spamschutz lässt durch, wenn er selbst nicht erreichbar ist. Kein Prüfergebnis ist kein Bot-Hinweis, und Honeypot und Zeitmessung greifen weiter |
| Kein JavaScript | Erfolg, Weiterleitung auf `/danke/` | Funktioniert vollständig. Nur die Kampagnenzuordnung und die Feldmeldungen fehlen |
| Doppelklick | Erfolg, einmal | Die zweite Übermittlung bekommt die gespeicherte Antwort, es entsteht kein zweiter Kontakt |

### ⚠️ Was noch fehlt oder von dir kommen muss

| ☐ | Was | Warum |
|---|---|---|
| ☐ | **Die Zugangsdaten in Vercel eintragen** | `.env.local` gibt es hier nicht. Ohne die Schlüssel lehnt der Spamschutz **jede** Anfrage ab (Absicht: eine fehlende Konfiguration darf keinen offenen Endpoint erzeugen) |
| ☐ | **Consent-Mode-Integration in Cookiebot aktivieren** | Ohne sie bleibt alles dauerhaft auf „verweigert" und keine Messung läuft je — **ohne Fehlermeldung** |
| ☐ | **`d.frankonia-sicherheit.de` prüfen** | Antwortet der Tagging-Server nicht, lädt der Tag Manager sitewide gar nicht, ebenfalls ohne sichtbaren Fehler |
| ☐ | **Auftragsverarbeitungsverträge** | Mit HubSpot, Brevo und Cloudflare. Beide Formulare übermitteln personenbezogene Daten an diese Anbieter |
| ☐ | **Datenschutzerklärung: HubSpot-Formular ergänzen** | Das eingebettete Formular auf `/jobs/` ist eine Übermittlung an einen Dritten und gehört in den Text. Ich habe ihn **nicht** eigenmächtig ergänzt — Abschnitt 3.2 (Kartendarstellung) ist die Vorlage |
| ☐ | **Subscription-Type-IDs aus HubSpot** | `node scripts/setup-hubspot.mjs` gibt sie aus, sobald ein Schlüssel gesetzt ist. Solange sie fehlen, setzt der Endpoint in HubSpot **keine** Marketing-Einwilligung; die Einwilligung landet in Brevo als `OPT_IN` |
| ☐ | **Zweiter Zustellweg für die interne Meldung** | Fällt Brevo aus, gibt es aktuell keinen. Ein zweiter Anbieter oder ein Slack-/Teams-Webhook wäre die Lösung — das ist eine Entscheidung, nicht eine Umsetzung |
| ☐ | **Belastbare Doppelklick-Sperre** | Sie liegt im Arbeitsspeicher der Funktionsinstanz. Ein echter Doppelklick wird zuverlässig gefangen; ein verteilter Angriff nicht (dagegen hilft Turnstile). Belastbar wäre nur ein gemeinsamer Speicher — die erste Laufzeit-Abhängigkeit dieses Projekts, also deine Entscheidung |

### Vor dem Deploy: das Setup-Skript einmal laufen lassen

```
HUBSPOT_SERVICE_KEY=… node scripts/setup-hubspot.mjs --dry    # zeigt nur an
HUBSPOT_SERVICE_KEY=… node scripts/setup-hubspot.mjs          # legt an
```

Es legt die zehn Felder in einer eigenen Gruppe „Website-Integration" an, damit
sie im CRM nicht zwischen den HubSpot-Feldern verschwinden. Vorhandene Felder
werden **übersprungen, nicht überschrieben** — ein Überschreiben kann Optionen
und Beschriftungen zerstören.

### ⚠️⚠️ Die eine Abschwächung, die du kennen sollst

**Die Sicherheitsrichtlinie der Seite ist lockerer geworden.** Vorher stand dort
`script-src 'self'`: kein fremdes JavaScript, sehr streng. Mit Cookiebot, Consent
Mode und dem Tag Manager ist das nicht zu halten — der Tag Manager fügt den Code
jedes Tags zur Laufzeit ein, und eine Positivliste aus Prüfsummen würde in der
Sekunde brechen, in der du im GTM ein Tag anlegst. Still, ohne Fehlermeldung.

Was bleibt: die **Host-Beschränkung**. Es kann kein fremder Server nachgeladen
werden, nur die 26 namentlich erlaubten. Jeder von ihnen trägt seinen Grund in
`docs/design-sources/csp-build.js` — die Datei ist der Ort, an dem die Liste
gepflegt wird, weil JSON keine Kommentare kann.

⚠️ **Wenn GA4 und Google Ads dazukommen, muss diese Liste erweitert werden.** Die
nötigen Hosts stehen dort schon auskommentiert. Ein Tag, dessen Host fehlt,
feuert nicht und meldet das nur in der Browser-Konsole.

### Gemessen

- **47 Tests, alle grün** (`npm test`, ohne Testframework — `node:test` ist in
  Node eingebaut, dieses Projekt hat weiter null Abhängigkeiten). Abgedeckt:
  Validierung jedes Pflichtfelds, fehlendes und abgelehntes Turnstile-Token,
  gefüllter Honeypot, Mindestzeit, Doppelklick, Rate-Limit, HubSpot-Ausfall,
  Brevo-Ausfall, beide aus, Netzfehler, Consent-Logik, kein Deal, kein
  Zurückstufen eines Kunden auf „Lead", keine personenbezogenen Daten in den
  Logs, und der ganze Weg ohne JavaScript.
- **44 Seiten mit Formular, statisch geprüft: 0 Probleme.** Gleicher Feldsatz
  überall, Telefon nirgends Pflicht, Marketing-Haken nirgends vorausgewählt,
  Spamschutz und Honeypot überall, keine alten Feldnamen mehr.
- **70 Seiten mit Consent-Kopf, 0 Probleme:** Reihenfolge Cookiebot → Consent
  Mode → Tag Manager auf allen, und Cookiebot ist überall das **erste**
  ausführbare Script.
- **389 Kontaktlinks** haben ihr `data-cta` (Telefon 228, Mail 92, WhatsApp 70);
  gegengeprüft: **0 Kontaktlinks ohne**, 0 mit doppeltem Attribut.
- **Ansicht geprüft** bei 390, 768 und 1440 Pixel auf sieben Seiten. Namensfelder
  in einer Zeile ab 640px, darunter gestapelt; der Spamschutz reserviert seine
  Höhe, damit beim Nachladen nichts springt.
- **Sieben Ratgeber-Artikel mit Titelbild**, jede Datei vorhanden, jeder alt-Text
  beschreibt das Bild und nicht das Thema.

### ⚠️ Zwei Widersprüche in der Vorgabe, die ich anders gelöst habe

Beide stehen ausführlich im Code, hier die Kurzfassung:

**1. „Turnstile als allererster Schritt" steht jetzt an fünfter Stelle.** Ein
Turnstile-Token ist genau **einmal** gültig. Stünde die Prüfung vor der
Doppelklick-Abwehr, bekäme der zweite Klick eine Fehlermeldung, obwohl die
Anfrage längst angekommen ist. Die vier Schritte davor sind Nachschauen im
Arbeitsspeicher und kosten nichts; vor jedem Aufruf, der Geld oder Kontingent
kostet, steht Turnstile weiterhin. **Gefunden hat das der Test**, nicht das
Nachdenken: er zählte einen Fremdaufruf zu viel, und der eine war Cloudflare.

**2. Eine ID kann nicht beides sein.** Die Vorgabe wollte `submission_id`
serverseitig erzeugen **und** als Doppelklick-Schlüssel verwenden — zwei Klicks
erzeugen aber zwei serverseitige IDs, und eine Prüfung darauf fängt nie etwas.
Jetzt sind es zwei Werte: die `submission_id` vom Server für CRM und Logs, und
ein Schlüssel vom Browser, der genau einmal je aufgebautem Formular entsteht.

### ⚠️ Ein Fehler, den ich gefunden und NICHT angefasst habe

**Die Startseite scrollt bei genau 768 Pixel Breite 47 Pixel nach rechts.**
Ursache ist die seitlich wischbare Kartenreihe im Abschnitt „Unser System", die
in dem Band zwischen 768 und 1023 Pixeln keine eigene Anpassung hat.

Ich habe A/B gemessen, um sicher zu sein, dass es nicht von dieser Arbeit kommt:
zwei Builds parallel, einmal der Stand vor dem ersten Commit und einmal jetzt —
**47 Pixel in beiden**, und kein einziges überstehendes Element liegt im
Formular. Es ist also vorbestehend und gehört in einen eigenen Durchgang.

---

# Abschlussbericht

Die fünf Listen, die du am Ende sehen wolltest. Sie fassen zusammen, was in den
Abschnitten 1 bis 12 im Einzelnen steht.

## 1 — Redirect-Tabelle

⚠️ **Die Statuscodes sind die konfigurierten, nicht live gemessene.** Vor dem Deploy
geht das nicht: `npm run dev` liefert nur die gebauten Seiten aus und liest
`vercel.json` überhaupt nicht — Weiterleitungen sind Hosting-Konfiguration. Statisch
geprüft ist dafür alles, was statisch prüfbar ist: dass jede Quelle genau eine Regel
trifft, dass jedes Ziel im Build existiert, und dass **kein Ziel selbst wieder Quelle
ist** (das ist die Kettenprüfung). Nach dem Deploy einmal
`node docs/design-sources/redirect-test.js https://…` — dann stehen dort echte Codes.

| ☐ | Alte URL | Code | Ziel | Hops |
|---|---|---|---|---|
| ☐ | `/frankonia-werkschutz/` | 301 | `/werkschutz/` | 1 |
| ☐ | `/frankonia-objektschutz/` | 301 | `/objektschutz/` | 1 |
| ☐ | `/frankonia-sicherheitstechnik/` | 301 | `/sicherheitstechnik/` | 1 |
| ☐ | `/frankonia-veranstaltungsschutz/` | 301 | `/veranstaltungsschutz/` | 1 |
| ☐ | `/frankonia-revier-schliessdienst/` | 301 | `/revier-schliessdienst/` | 1 |
| ☐ | `/frankonia-kaufhausdetektei/` | 301 | `/kaufhausdetektei/` | 1 |
| ☐ | `/frankonia-empfangsdienst/` | 301 | `/empfangsdienst/` | 1 |
| ☐ | `/sicherheitsanalyse/` | 301 | `/sicherheitskonzept/` | 1 |
| ☐ | `/kundenstory-kunde-1/` | 301 | `/referenzen/` | 1 |
| ☐ | `/kundenstory-kunde-2/` | 301 | `/referenzen/` | 1 |
| ☐ | `/bewerbung-im-sicherheitsdienst-die-3-haeufigsten-fehler/` | 301 | `/ratgeber/bewerbung-sicherheitsdienst/` | 1 |
| ☐ | `/tariflohn-2026-im-sicherheitsdienst/` | 301 | `/ratgeber/tariflohn-sicherheitsdienst/` | 1 |
| ☐ | `/voraussetzungen-im-sicherheitsdienst/` | 301 | `/ratgeber/voraussetzungen-sicherheitsdienst/` | 1 |
| ☐ | `/qualifikationen-im-sicherheitsdienst/` | 301 | `/ratgeber/qualifikationen-sicherheitsdienst/` | 1 |
| ☐ | `/jobchancen-als-sicherheitskraft/` | 301 | `/ratgeber/paragraph-34a-erklaert/` | 1 |
| ☐ | `/einsatzmoeglichkeiten-…-wirklich-erlauben/` | 301 | `/ratgeber/paragraph-34a-erklaert/` | 1 |
| ☐ | `/so-schwierig-sind-…-§34a/` (3 Schreibweisen) | 301 | `/ratgeber/paragraph-34a-erklaert/` | 1 |
| ☐ | `/wie-viel-kostet-die-fortbildung-zur-sicherheitskraft/` | 301 | `/ratgeber/qualifikationen-sicherheitsdienst/` | 1 |
| ☐ | `/hallo-welt/` | 301 | `/` | 1 |
| ☐ | `/feed/`, `/comments/feed/`, `/…/feed/` | 301 | `/` | 1 |
| ☐ | `/author/…` | 301 | `/ueber-uns/` | 1 |
| ☐ | `/category/…`, `/tag/…` | 301 | `/ratgeber/` | 1 |
| ☐ | `/marco-bayer-sicherheitsdienst-2/` | 301 | `/alexander-jaeger-sicherheitsdienst/` | 1 |
| ☐ | `/marco-bayer-werkschutz-2/` | 301 | `/alexander-jaeger-werkschutz/` | 1 |
| ☐ | `/thomas-windisch-sicherheitsdienst/` | 301 | `/alexander-jaeger-sicherheitsdienst/` | 1 |
| ☐ | `/thomas-windisch-werkschutz/` | 301 | `/alexander-jaeger-werkschutz/` | 1 |
| ☐ | `/wp-admin/`, `/wp-login.php` | **404** | — | 0 |
| ☐ | `/wp-content/…` | **404** | — | 0 |
| ☐ | `/testformular/` | **404** | — | 0 |
| ☐ | `/homepage-2/` | **404** | — | 0 |

Die letzten vier Zeilen sind **gewollte 404 auf deine Anweisung**, keine Lücke. Der
Redirect-Test führt sie als eigene Kategorie und meldet es, wenn eine davon doch
wieder erreichbar wird.

Jede Adresse existiert zusätzlich in der Variante ohne Schrägstrich am Ende, damit
auch dort genau eine Weiterleitung anfällt und nicht zwei. **17 weitere Adressen der
alten Seite brauchen gar keine Regel**, weil sie auf der neuen Seite unter demselben
Pfad liegen: die Startseite, Baustellenbewachung, Veranstaltungsschutz, Jobs,
Angebot, Referenzen, Linktree, der Sicherheitscheck und die neun Personenseiten.

**Stand der Vollständigkeitsprüfung: 41 Adressen der alten Seite — 22 umgeleitet,
17 unverändert vorhanden, 2 gewollt 404, 0 verwaist.** Diese Liste ist die eigentliche
Frage der Migration; „0 verwaist" heißt, dass keine alte Adresse nach dem Umzug ins
Leere läuft.

## 2 — Portierte Blogartikel, und warum vier nicht portiert wurden

| ☐ | Alte URL | Neue URL |
|---|---|---|
| ☐ | `/bewerbung-im-sicherheitsdienst-die-3-haeufigsten-fehler/` | `/ratgeber/bewerbung-sicherheitsdienst/` |
| ☐ | `/tariflohn-2026-im-sicherheitsdienst/` | `/ratgeber/tariflohn-sicherheitsdienst/` |
| ☐ | `/voraussetzungen-im-sicherheitsdienst/` | `/ratgeber/voraussetzungen-sicherheitsdienst/` |
| ☐ | `/qualifikationen-im-sicherheitsdienst/` | `/ratgeber/qualifikationen-sicherheitsdienst/` |

**Nicht portiert, mit Begründung:**

| Alter Artikel | Warum nicht | Landet auf |
|---|---|---|
| `jobchancen-als-sicherheitskraft` | Staffelt die drei Qualifikationen nach Jobchancen — genau das Kapitel „Welche Jobs kann ich mit welcher Qualifikation machen?" im bestehenden 34a-Artikel | `/ratgeber/paragraph-34a-erklaert/` |
| `einsatzmoeglichkeiten-…-wirklich-erlauben` | Derselbe Kern: was jede Stufe erlaubt. Steht dort schon | `/ratgeber/paragraph-34a-erklaert/` |
| `so-schwierig-sind-…-§34a` | Prüfungsablauf der Sachkunde steht im 34a-Artikel; der GSSK-Teil ist in den portierten Qualifikationen-Artikel eingearbeitet | `/ratgeber/paragraph-34a-erklaert/` |
| `wie-viel-kostet-die-fortbildung-…` | Kosten sind im portierten Qualifikationen-Artikel ein eigenes Kapitel, inklusive der GSSK-Kursspanne aus diesem Text | `/ratgeber/qualifikationen-sicherheitsdienst/` |

Der Grund in einem Satz: fünf der acht behandeln denselben Themenkreis aus fünf
Blickwinkeln, drei davon stehen wörtlich schon im bestehenden 34a-Artikel. Alle fünf
zu portieren hätte sechs Seiten um dasselbe Suchwort konkurrieren lassen — sie hätten
sich gegenseitig geschwächt. Inhaltlich ist nichts verloren.

## 3 — Zahlen aus den migrierten Artikeln, die ich nicht verifizieren konnte

| ☐ | Zahl | Woher | Wie sie jetzt dasteht |
|---|---|---|---|
| ☐ | GSSK-Prüfungsgebühr (alter Text: rund 450 €) | Blogartikel | Nicht als Zahl übernommen — „Prüfungsgebühr je Kammer". Die IHK Schwerin veröffentlicht 405 €, jede Kammer legt sie selbst fest |
| ☐ | GSSK-Vorbereitungskurse 1.600–4.000 € | Blogartikel | Als Richtwert gekennzeichnet, mit dem Hinweis, mehrere Bildungsträger anzufragen |
| ☐ | GSSK-Kursumfang 200–240 Unterrichtseinheiten über 5–7 Monate | Blogartikel | Als Anbieterangabe gekennzeichnet, ausdrücklich nicht als Vorschrift |
| ☐ | „150 bis 180 Minuten" je schriftlichem GSSK-Prüfungsteil | Blogartikel | **Ersetzt durch die Vorschrift**: mindestens zwei Stunden je Aufgabe, höchstens fünf Stunden insgesamt |
| ☐ | Fachbücher ca. 20 €, Lern-Apps 5–20 € | Blogartikel | Nicht übernommen — Marktpreise, die monatlich schwanken |
| ☐ | Kostenübernahme durch die Agentur für Arbeit | Blogartikel | Als Einzelfallentscheidung formuliert, nicht als Zusage |

**Zwei Zahlen habe ich mit Quelle korrigiert statt übernommen:** die GSSK-Zulassung
verlangt von den fünf Jahren Berufspraxis mindestens drei in der Sicherheitswirtschaft
(alter Text: „ein erheblicher Teil"), und die mündliche Sachkundeprüfung dauert rund
15 Minuten, nicht 20 — so steht es auch im bestehenden 34a-Artikel, die beiden Seiten
hätten sich sonst widersprochen.

⚠️ **Und der auffälligste Fund: `tariflohn-2026` nennt keine einzige Lohnzahl**, trotz
Titel und Beschreibung „So viel verdienst du 2026". Ich habe keine erfunden. Das Jahr
ist aus Slug und Titel raus, und Titel und Beschreibung sagen jetzt, was der Artikel
wirklich liefert. Die einzigen Zahlen darin sind die tariflichen Zuschläge, und die
kommen aus derselben zentralen Datei wie auf der Kostenseite.

## 4 — Umgebungsvariablen

**Gesetzt: keine. Gebraucht: derzeit keine.** Das ist kein Versäumnis, sondern die
Architektur: die Seite ist statisches HTML ohne Abhängigkeiten und ohne Backend. Im
ganzen Projekt gibt es kein `process.env`, keine `.env`-Datei und keinen Dienst, der
einen Schlüssel bräuchte. Die Kartenkacheln von CARTO und die HubSpot-Terminlinks
funktionieren beide ohne Konto und ohne Token.

Was Variablen brauchen wird, sobald die jeweilige Entscheidung fällt:

| ☐ | Wofür | Variable | Status |
|---|---|---|---|
| ✅ | Formularempfang | HubSpot, Brevo, Turnstile | **erledigt am 26.08.**, siehe Abschnitt 17. Die Werte müssen noch in Vercel eingetragen werden |
| ✅ | Spamschutz | Cloudflare Turnstile statt reCAPTCHA | **erledigt.** Turnstile setzt für die Prüfung keine Cookies und ist deshalb einwilligungsfrei — ein Spamschutz, der erst nach Cookie-Zustimmung lädt, schützt die Hälfte der Besucher nicht |
| ✅ | Cookiebot | Domain-Gruppen-ID | **eingebaut.** ⚠️ Die Consent-Mode-Integration muss im Cookiebot-Konto noch **aktiviert** werden, sonst bleibt alles dauerhaft auf „verweigert" |
| ✅ | Tag Manager | Container GTM-NWLGMFJN über `d.frankonia-sicherheit.de` | **Loader eingebaut.** Die Tags konfiguriert Christoph nach dem Launch; die CSP muss dann erweitert werden |
| ☐ | Google-Bewertung live statt gepflegt | Places-API-Schlüssel | fehlt, bewusst — braucht Abrechnung und Consent |

✅ **Der wichtigste Punkt dieser Liste ist erledigt.** Bis zum 26.08. stand hier:
„Solange die Formulare nirgendwohin senden, erreicht keine Anfrage euch — und das
Formular ist das Hauptziel jeder Seite." Sie senden jetzt (Abschnitt 17).
⚠️ **Was jetzt an derselben Stelle blockiert: die Zugangsdaten in Vercel.** Ohne
sie lehnt der Spamschutz jede Anfrage ab — bewusst so, weil eine fehlende
Konfiguration keinen offenen Endpoint erzeugen darf. Das ist eine Eintragung in
den Projekteinstellungen, kein Code.

## 5 — Offene Punkte

Sie stehen vollständig im Abschnitt „Noch offen" direkt darüber. In einem Satz: das
Hero-Foto der Startseite und vier Titelbilder für die neuen Ratgeber-Artikel, der
Formularempfang, und nach dem Deploy die Live-Prüfung der Redirects samt der
www-Umleitung in den Vercel-Einstellungen.

Erledigt seit der ersten Fassung dieses Berichts: der Tippfehler in den zwei vCards
(Abschnitt 13), die Google-Profil-URL fürs Badge (Abschnitt 13), die zehn Seiten ohne
Sitemap-Eintrag (Abschnitte 14 und 15) und die Überarbeitung der
Datenschutzerklärung samt des Fehlers, der diese Seite ohne Fußbereich ausgeliefert
hat (Abschnitt 16). Beim Datenschutz sind noch zwei Fragen offen, die nur du oder
dein Anwalt beantworten kann — sie stehen dort in einer eigenen Tabelle.
