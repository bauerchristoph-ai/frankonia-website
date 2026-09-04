# Launch-Prüfprotokoll

Eine Liste zum Durchgehen, nicht ein zweites Changelog. Jede Zeile sagt: **was
geändert wurde, wo man es sieht, und woran man erkennt, dass es stimmt.**

Angelegt am 2026-08-23 auf Wunsch von Christoph, für den Durchgang vor dem
Umstellen der Domain auf Vercel.

> **31.08.2026 — der QA-Auftrag mit den 29 Aufgaben ist abgeschlossen.** Der
> Bericht dazu steht nicht hier, sondern in
> [qa-harness/launch-paket/PRUEFPROTOKOLL-2026-08-31.md](../qa-harness/launch-paket/PRUEFPROTOKOLL-2026-08-31.md)
> — das ist der Pfad, den der Auftrag ausdrücklich verlangt. Daneben liegt die
> Codebeurteilung (Aufgabe 28).
>
> Dort steht auch die Liste der **offenen Punkte**, und keiner davon liegt im
> Code: der CARTO-Schlüssel nur unter Production, die HubSpot-Weiterleitung auf
> /danke-bewerbung/, die anwaltliche Prüfung der Datenschutz-Abschnitte 3.3–3.7
> und die Bereinigung der HubSpot-Testdaten.
>
> ⚠️ Eine Zahl aus früheren Notizen ist überholt: **die Formulare senden.**
> Gemessen 44 Formulare mit action="/api/forms/submit/", Endpunkt vorhanden.

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
| ☐ | Bauer behalten | `/christoph-bauer-sicherheitsdienst-2/` — ⚠️ heißt seit 27.08. `/christoph-bauer-sicherheitsdienst/`, Abschnitt 24 |
| ☐ | Wettengel behalten | `/daniel-wettengel-sicherheitsdienst/` |
| ☐ | Van Wey behalten | `/bryan-van-wey-security/` — die zweite Karte neben der bestehenden Werkschutz-Karte. ⚠️ **Am 27.08. zurückgenommen:** die Karte ist entfallen und leitet auf die Werkschutz-Karte, Abschnitt 24 |
| ☐ | Morelo Werkschutz Team behalten | `/morelo-werkschutz-team-2/` — ⚠️ heißt seit 27.08. `/morelo-werkschutz-team/`, Abschnitt 24 |
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
| ☐ | Formularfelder | Vorname und Nachname getrennt in einer Zeile, E-Mail, Telefon (**Pflicht**, seit 26.08. — siehe Abschnitt 18), Unternehmen, Leistung, Nachricht |
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

⚠️ **NACHTRAG 26.08., und dieser Absatz war zu früh beruhigt:** in dem eigenen
Durchgang (Abschnitt 18) waren es **zwei** Fehler übereinander. Der eine war
tatsächlich vorbestehend — das Hero-Bild bei 320 Pixeln. Der andere lag **doch im
Formular**, nur bei einer Breite, die ich nicht gemessen hatte: bei 320 Pixeln war
die Feldspalte breiter als das Formular, auf allen 40 Seiten. Beides steht in
Abschnitt 18; der Formularfehler ist behoben. Die Lehre für den nächsten A/B: „kein
überstehendes Element im Formular" gilt nur für die Breiten, die man wirklich
gemessen hat.

## 18 — Deine sieben Punkte vom 26.08.: Telefon, HubSpot-Felder, Einwilligung, Doppelklick

**Vier Antworten vorweg, weil sie Aufgaben von deiner Liste streichen.**

**„d.frankonia-sicherheit.de läuft doch."** Stimmt, und ich hätte das selbst prüfen
können, statt es dir aufzuschreiben. Nachgemessen: der Server antwortet mit **HTTP
200** und liefert **322 KB** JavaScript für Container `GTM-NWLGMFJN` aus. Der Punkt
ist damit erledigt und nicht mehr offen.

**„Wieso Consent Mode deaktivieren?"** Das habe ich unklar formuliert — gemeint war
das Gegenteil: er muss **aktiv** sein.

⚠️ **NACHTRAG, nachdem der Kunde die Cookiebot-Anleitung geschickt hat: es gibt für
diese Installation kein Häkchen, und mein Satz „das ist ein Häkchen im
Cookiebot-Konto" war falsch.** Cookiebot nennt drei Wege, und welcher gilt, hängt
davon ab, wie die CMP eingebaut ist:

| Weg | Gilt hier? |
|---|---|
| WordPress-Plugin, Schalter in den Plugin-Einstellungen | nein — diese Website ist kein WordPress |
| Cookiebot-Vorlage **im Tag Manager**, Consent Mode in den Tag-Einstellungen | nein — Cookiebot lädt direkt im HTML, nicht als GTM-Tag |
| **Direktes Skript: Standardzustand setzen, bevor GTM lädt** | **ja, und das ist genau, was eingebaut ist** |

Der dritte Weg ist damit **erledigt, nicht offen.** Er steht in
`partials/head-common.html` als Block 2 von drei, und die Reihenfolge
Cookiebot → Standardzustand → Tag Manager ist der ganze Punkt daran.

**Gemessen am gebauten Stand, lokal:** der `consent default` mit allen Kategorien
auf `denied` liegt im `dataLayer`, dazu `ads_data_redaction` und
`url_passthrough`; Cookiebot lädt seine Konfiguration für die Domain-Gruppe
`2335e423-…`; und Cookiebot pusht seine eigene Consent-Mode-Kennung
(`developer_id.dMWZhNz`) — genau das tut eine aktive Integration.

⚠️ **Was lokal NICHT prüfbar ist und deshalb dein 30-Sekunden-Test nach dem Deploy
bleibt:** das `consent update` nach dem Zustimmen. Das Banner erscheint nur auf
einer Domain, die in der Cookiebot-Domain-Gruppe steht — auf `127.0.0.1` rendert es
nicht, also kann dort auch niemand zustimmen. Auf der Live-Seite:

1. Seite öffnen, DevTools → Konsole.
2. `dataLayer.filter(e => e[0] === "consent")` — es muss **ein** Eintrag da sein,
   `"default"`, alles `denied`.
3. Im Banner zustimmen, denselben Befehl noch einmal.
4. Jetzt müssen **zwei** Einträge da sein, der zweite `"update"` mit
   `analytics_storage: "granted"`.

Kommt der zweite Eintrag nicht, ist es doch eine Sache der Kontoeinstellung — dann
ist das der Moment, in dem man dort nachsieht. Vorher nicht.

⚠️ **Und eine Falle für später, wenn du die Tags im GTM konfigurierst:** die
Cookiebot-Vorlage NICHT zusätzlich als Tag in den Container legen. Cookiebot lädt
schon im HTML; als GTM-Tag würde es ein zweites Mal laden, und dann konkurrieren zwei
Instanzen um dieselbe Zustimmung.

**„AV-Verträge? Die sind doch logisch, wenn ich Kunde dort bin."** Fast. Kunde sein
und einen Auftragsverarbeitungsvertrag haben ist rechtlich nicht dasselbe — aber bei
HubSpot, Brevo und Cloudflare ist der AV-Vertrag **Teil der Nutzungsbedingungen, die
du bei der Anmeldung akzeptiert hast** (HubSpot: „Data Processing Agreement" im
Rahmen der Terms; Brevo und Cloudflare genauso). Es ist also nichts zu verhandeln
und nichts zu unterschreiben. Was übrig bleibt, ist reine Ablage: **einmal
herunterladen und zu den Unterlagen legen**, damit du bei einer Anfrage der
Aufsichtsbehörde nicht suchen musst. Ich habe es in der Liste deshalb von „fehlt" auf
„herunterladen" geändert.

**„Kannst du nicht auf .env.local zugreifen?"** Ich kann Dateien auf diesem Rechner
lesen — es gibt die Datei nur nicht. Im Projektverzeichnis liegt ausschließlich die
`.env.example`, die ich angelegt habe. So gibst du mir die Werte:

1. `.env.example` kopieren zu **`.env.local`** (gleiches Verzeichnis) und die Werte
   dort eintragen. Die Datei ist über `.gitignore` ausgeschlossen, wird also nie
   mitcommittet und landet nicht auf GitHub.
2. Dieselben Werte in **Vercel → Settings → Environment Variables**. Ohne das läuft
   die Live-Seite nicht, denn Vercel liest keine lokale Datei.

⚠️ **Nicht in einen Chat kopieren, auch nicht hierher.** Ein Chatverlauf ist kein
Geheimnisspeicher. Der Turnstile-**Site**-Key ist öffentlich und steht ohnehin im
HTML; alles andere, besonders der HubSpot-Token und der Brevo-Schlüssel, gehört
ausschließlich in die beiden Orte oben.

⚠️⚠️ **KORREKTUR MEINER EIGENEN ANWEISUNG, nachgeprüft am Code: Schritt 1 ist
optional, Schritt 2 ist der, der zählt.** Ich hatte `.env.local` als ersten Schritt
genannt, als läge daran etwas. **Es liest sie niemand.** Nachgesehen: `build.js`
liest `process.env`, und das Projekt hat null Abhängigkeiten — es gibt also kein
`dotenv`, das eine Datei einlesen würde. `.env.local` ist ausschließlich für die
Vercel-CLI (`vercel dev`) gedacht, also für lokale Tests. **Die Live-Seite läuft
allein über die Environment Variables in den Vercel-Projekteinstellungen.**

⚠️ **Und zum Ablageort: nicht in einen synchronisierten Firmenordner.** Ein
HubSpot-Token und ein Brevo-Schlüssel in
`…\FRANKONIA Verwaltungs GmbH - Dokumente\Vertrieb\Marketingunterlagen\…` liegen
damit in der Cloud und sind für jeden lesbar, der Zugriff auf diesen Ordner hat —
das sind bei einem Vertriebs-/Marketingordner erfahrungsgemäß deutlich mehr Leute
als bei einem Zugangsdatum sinnvoll. Der richtige Aufbewahrungsort ist ein
Passwortmanager, und die verbindliche Kopie sind ohnehin die Vercel-Einstellungen
(dort verschlüsselt gespeichert).

⚠️ **Und keine `.txt`-Datei.** `.env.local.txt` wird von nichts gelesen — weder von
der Vercel-CLI noch von diesem Projekt. Wenn die Werte irgendwo aufgeschrieben
werden sollen, dann in einen Passwortmanager, nicht in eine Textdatei.

### Telefon ist jetzt Pflichtfeld

Auf allen Seiten mit dem gemeinsamen Formular. Das Feld heißt sichtbar „Telefon \*",
und der Server weist eine Anfrage ohne Nummer ab.

⚠️ **Das dreht meine Empfehlung um, und ich sage dazu, was es kostet**, damit du es
nicht später suchen musst: jedes zusätzliche Pflichtfeld senkt die Zahl der
abgeschickten Formulare. Wer gerade keine Nummer herausgeben will, bricht ab statt
eine E-Mail-Anfrage zu schicken. Deine Entscheidung steht, sie ist umgesetzt, und der
Weg zurück ist eine Zeile in zwei Dateien (`partials/lead-form.html` und
`api/_lib/validate.js` — beide tragen einen Kommentar mit dieser Notiz). Wenn die
Anfragen nach dem Launch spürbar zurückgehen, ist das der erste Schalter, an dem man
dreht.

Zwei Dinge dazu, die nicht offensichtlich sind:

- **Die Pflicht steht an zwei Stellen und muss an beiden stehen.** Das `required` im
  Markup ist Komfort — der Browser meldet es sofort. Die Prüfung auf dem Server ist
  die verbindliche: ein Skript, das direkt an den Endpoint sendet, sieht das Markup
  nie. Beide Stellen verweisen im Kommentar aufeinander.
- **Das Bewerbungsformular auf `/jobs/` ist nicht betroffen** — das ist ein
  HubSpot-Formular, das seine Felder aus HubSpot bezieht. Dort ist Telefon
  ohnehin schon Pflicht.

### Die HubSpot-Eigenschaftsfelder: nachweislich verknüpft, nicht nur wahrscheinlich

Deine Sorge war berechtigt, und sie hat einen konkreten Grund: **HubSpot lehnt bei
einer einzigen unbekannten Eigenschaft den GANZEN Aufruf mit 400 ab.** Ein Tippfehler
in einem von fünfzehn Feldnamen kostet also nicht ein Feld, sondern den kompletten
Kontakt. Und die Falle dabei ist, dass in HubSpot **der interne Name zählt, nicht die
Beschriftung**: das Feld heißt intern `firstname`, angezeigt wird „Vorname".
`first_name`, `firstName` oder „Vorname" führen alle drei zu 400.

Drei Dinge sichern das jetzt ab:

1. **Die Zuordnung steht als Tabelle an einer Stelle** (`api/_lib/hubspot.js`), nicht
   verstreut im Code. Fünf HubSpot-Standardfelder (`firstname`, `lastname`, `email`,
   `phone`, `company`) und zehn eigene, alle mit dem Präfix `website_`.
2. **`node scripts/setup-hubspot.mjs --verify` liest diese Tabelle und vergleicht sie
   mit deinem Portal.** Nicht mit einer zweiten, im Skript gepflegten Liste — die
   wäre genau die Stelle, an der Code und CRM auseinanderlaufen. Geprüft wird
   Existenz **und Typ** jeder Eigenschaft; ohne `--verify` legt dasselbe Skript die
   fehlenden an. Es schreibt nie an bestehenden Feldern.
3. **Ein Test prüft, dass die falschen Schreibweisen nicht im Aufruf landen** —
   namentlich `first_name`, `firstName`, „Vorname", „Telefon" und die übrigen
   Verwechslungskandidaten.

⚠️ **Und für den Fall, dass trotzdem etwas fehlt, verliert der Lead nicht mehr:**
antwortet HubSpot mit 400, sendet der Endpoint **automatisch ein zweites Mal, nur mit
den fünf Standardfeldern**. Der Kontakt entsteht dann ohne die Zusatzangaben, und das
Log nennt den Befehl zum Nachprüfen. Vorher wäre die Anfrage in diesem Fall
vollständig verloren gewesen. Ein Test erzwingt genau diesen Ablauf.

### Marketing-Einwilligung: One-to-One in HubSpot, Liste in Brevo

Beides ist eingebaut und wird **nur bei gesetztem Haken** ausgeführt.

- **HubSpot:** die Einwilligung wird über die Kommunikationseinstellungen auf den
  Subscription-Typ „One to One" geschrieben, mit Rechtsgrundlage
  `CONSENT_WITH_NOTICE` und einem Vermerk, welche Checkbox auf welcher Seite wann
  gesetzt wurde. Das ist der Unterschied zwischen einem Häkchen und einem
  **Nachweis**. Zusätzlich wird der Kontakt als Marketingkontakt markiert.
- **Brevo:** der Kontakt wandert in die Marketingliste, denn in Brevo trägt die
  Liste die Einwilligung — wer in keiner Liste ist, kann keine Kampagne bekommen.
- **Ohne Haken passiert nichts von beidem.** Der Kontakt entsteht trotzdem, mit
  `OPT_IN = false`, und bekommt weiter seine Eingangsbestätigung: die ist
  transaktional und braucht keine Einwilligung, weil sie die Antwort auf seine eigene
  Handlung ist.

⚠️ **Zwei neue Variablen, und ohne sie wird nichts geraten:**
`HUBSPOT_SUBSCRIPTION_ID_ONE_TO_ONE` und `BREVO_MARKETING_LIST_ID`. Fehlen sie,
protokolliert der Endpoint das und lässt die Anfrage durch — die Einwilligung ist
dann vermerkt, aber nicht im CRM nachweisbar beziehungsweise der Kontakt in keinem
Verteiler. **Eine erfundene ID wäre schlimmer:** sie würde jemanden in einen fremden
Verteiler legen. Die richtigen IDs liest du aus:

    HUBSPOT_SERVICE_KEY=… node scripts/setup-hubspot.mjs --verify
    BREVO_API_KEY=…      node scripts/setup-brevo.mjs

Das zweite Skript ist neu und **schreibt nichts**. Es prüft, was beim Formularversand
still schiefgehen kann: **Brevo verwirft ein unbekanntes Attribut ohne Fehlermeldung.**
Der Kontakt wird angelegt, die Antwort ist „erfolgreich", und der Vorname fehlt
einfach. Das Skript vergleicht deshalb die Attributnamen, die der Code tatsächlich
sendet, mit denen in deinem Konto, prüft Absender und Marketinglisten und sagt zur
Transaktionsvorlage, ob sie aktiv ist und ob die Platzhalter darin vorkommen — eine
Vorlage ohne `params.VORNAME` verschickt eine anonyme Mail, technisch erfolgreich und
inhaltlich falsch.

### Doppelklick-Sperre: was ich damit gemeint habe, und der Fehler dahinter

Deine Frage war berechtigt, denn ich hatte es nur benannt, nicht erklärt. Es gab schon
zwei Verteidigungslinien: der Absendeknopf sperrt sich beim ersten Klick, und der
Server merkt sich die Antwort zu einem Schlüssel, den jedes Formular einmal beim
Aufbau bekommt. **Die zweite hatte eine Lücke, und zwar genau im Doppelklick-Fall:**
sie fragte „gibt es schon eine Antwort?" — bei zwei Klicks im Abstand von
Millisekunden fanden beide **noch keine**, arbeiteten beide vollständig durch und
erzeugten **zwei Kontakte, zwei Notizen und zwei Bestätigungsmails**. Die Sperre
griff also erst, wenn die erste Anfrage bereits fertig war, und damit gerade dann
nicht, wenn ein Doppelklick passiert.

Jetzt wird der Schlüssel **sofort reserviert**. Wer als Zweiter kommt, wartet auf das
Ergebnis des Ersten und bekommt dieselbe Antwort — auch dieselbe Ablehnung, falls ein
Pflichtfeld fehlte. Ein Schlüssel wird genau einmal ausgeführt.

⚠️ **Nur Erfolge werden aufbewahrt, Ablehnungen nicht**, und das ist der Teil, der
leicht falsch gemacht wird. Der Schlüssel gehört zum **Formular**, nicht zum Klick.
Würde eine Ablehnung zwischengespeichert, könnte derselbe Besucher dasselbe Formular
nie mehr abschicken: das vergessene Pflichtfeld, das abgelaufene Spamschutz-Token,
die zu schnell abgesendete Anfrage wären alle endgültig.

**Zwei der vier neuen Tests würden ohne diese Änderung durchfallen** — ich habe es
gegengeprüft, indem ich die Sperre kurz wieder herausgenommen habe. Ein Test, der auch
ohne die Änderung bestünde, prüft nichts.

⚠️ **Ehrliche Grenze, unverändert:** der Server merkt sich das im Arbeitsspeicher der
Funktionsinstanz. Ein Doppelklick trifft praktisch immer dieselbe Instanz, deshalb
wirkt die Sperre dort. Verteilt sich das auf zwei Instanzen, entstehen zwei Kontakte —
HubSpot und Brevo führen sie über die E-Mail-Adresse zusammen, doppelt wären nur die
Notiz und die Bestätigungsmail. Eine belastbare Zusicherung bräuchte einen
gemeinsamen Speicher (Vercel KV oder Redis) und damit die erste
Laufzeit-Abhängigkeit dieses Projekts. Das ist deine Entscheidung, nicht meine
Nebenbei-Änderung.

### Der Überlauf auf der Startseite — es waren zwei Fehler, einer davon meiner

Du hast mir freigestellt, ihn zu beheben. Beim Nachmessen war es nicht der Fehler, den
ich im letzten Bericht beschrieben hatte.

**Erstens, und das war meiner:** in dem Formular, das ich in dieser Sitzung gebaut
habe, war die Feldspalte bei 320 Pixeln Bildschirmbreite **300 Pixel breit in einem
223 Pixel breiten Formular** — auf **jeder** der 40 Seiten mit Formular. Ursache ist
eine Falle, die in diesem Projekt schon mehrfach dokumentiert ist: ein Eingabefeld
bringt eine eigene Wunschbreite mit, und eine Grid-Spalte darf sie nicht unterbieten,
solange man es ihr nicht ausdrücklich erlaubt. Ich hatte diese Erlaubnis nur den zwei
halbbreiten Feldern gegeben, nicht den übrigen — **ein einziges Feld zieht die ganze
Spalte auf**. Behoben, und die Eigenschaft steht jetzt einmal für alle Kinder statt
klassenweise.

**Zweitens, und das war nicht meiner:** die Kundenstimmen-Karten haben die Startseite
im Bereich **768 bis 833 Pixel** um bis zu 62 Pixel überlaufen — genau die Breite
eines iPads im Hochformat. Dieselbe Falle, an drei Karten in einer Reihe: gemessene
Kette Karte 249 = Innenabstand 48 + Kopfzeile 201, und die Kopfzeile 201 = Avatar 44 +
längstes Wort im Namensblock 109 + Google-Zeichen 20 samt Abständen. Drei mal 249 plus
Abstände brauchen 795 Pixel, der Container gibt bei 768 aber nur 722 her. **Ab 834
passt es von allein** — deshalb war der Fehler auf ein 66 Pixel breites Band
beschränkt und in den üblichen Messbreiten unsichtbar.

⚠️ **Mein erster Anlauf war eine Regression, und die Messung hat sie gefangen:** ich
habe der Kopfzeile erlaubt umzubrechen, und das Google-Zeichen rutschte daraufhin auf
**allen** Breiten in eine zweite Zeile, auch bei 1440 Pixeln, wo reichlich Platz ist.
Der Grund ist, dass der Namensblock von Natur aus so breit ist wie Name und Rolle
ungebrochen. Mit einer Flex-Basis von 0 wächst er stattdessen in den freien Raum, und
umgebrochen wird nur noch, wenn der Platz wirklich fehlt.

**Nachgemessen, A/B mit zwei Builds:** bei **900, 1024, 1440 und 1920 Pixeln sind alle
Werte identisch** — Kartenbreite, Kartenhöhe, Abschnittshöhe, Seitenhöhe. Bei 834
wird die Karte 4 Pixel schmaler, bei 768 verschwindet der Überlauf vollständig. Das
Band, das du und ich schon abgenommen haben, ist also unberührt.

⚠️ **Was bei 320 Pixeln übrig bleibt, ist vorbestehend und habe ich nicht angefasst:**
das Hero-Bild der Startseite läuft dort um 36 Pixel über, bei 360 Pixeln um 9. Ich
habe es per A/B gegen den Stand vor dieser Arbeit geprüft — **in beiden Builds
dieselben Zahlen**. Es ist die Grenze, die in `CLAUDE.md` seit Juli als bewusst nicht
verfolgt dokumentiert ist (kleinste Zielbreite dieses Projekts: 400 Pixel; jedes
aktuelle Telefon ist mindestens 360 breit). Das Hero anzufassen wäre eine
Designänderung an dem Element, das du am häufigsten überarbeitet hast — das gehört in
einen eigenen Durchgang mit dir, nicht in eine Fehlerbehebung nebenbei. Bei **390
Pixeln und darüber ist die Startseite auf allen gemessenen Breiten überlauffrei.**

### Nachgemessen

- **58 Tests grün** (vorher 48). Neu: sechs für die HubSpot-Feldzuordnung und die
  Marketing-Einwilligung, vier für die Doppelklick-Sperre.
- **Überlauf** auf Startseite, `/referenzen/`, `/jobs/` und `/danke/` bei 390, 768,
  834, 1024 und 1440 Pixeln: **null**.
- **Kundenstimmen-Karten** auf allen fünf Seiten, die sie benutzen, bei 768 bis 1440:
  Google-Zeichen neben der Person, keine Zeile umgebrochen, keine Karte über ihrem
  Container.
- Alle berührten Dateien syntaktisch geprüft, `npm run build` läuft durch: **70
  Seiten**.

### Was davon noch bei dir liegt

| ☐ | Was | Wo |
|---|---|---|
| ☐ | **Werte eintragen — das ist der Pflichtschritt** | Vercel → Settings → Environment Variables |
| — | `.env.local` im Projektverzeichnis | **optional**, nur für lokale Tests mit `vercel dev`. **Nichts in diesem Projekt liest die Datei** (null Abhängigkeiten, also kein dotenv) — siehe die Korrektur unten |
| ☐ | Consent Mode **aktivieren** | Cookiebot-Konto |
| ✅ | ~~Beide Skripte laufen lassen und die IDs eintragen~~ | **erledigt am 26.08.**, siehe Abschnitt 19 |
| ✅ | ~~Brevo-Transaktionsvorlage prüfen~~ | **geprüft am 26.08.**: Vorlage 5, aktiv, beide Platzhalter vorhanden |
| — | ~~AV-Verträge herunterladen und ablegen~~ | **vom Kunden gestrichen** (26.08.: „kann ich ja immer runterladen, brauch ich jetzt nicht“). Sie sind Teil der akzeptierten Bedingungen, es ist nichts zu unterschreiben — nur bei einer Behördenanfrage aus dem Konto zu ziehen |

## 19 — Der erste echte Durchlauf: was funktioniert, und die vier Fehler, die er gefunden hat

Am 26.08.2026 lief das Formular erstmals gegen die **echten** APIs von HubSpot und
Brevo, nicht gegen Attrappen. Drei Läufe, ein Testkontakt.

⚠️ **Turnstile lief dabei mit Cloudflares offiziellem TESTSCHLÜSSEL**
(`1x0000000000000000000000000000000AA`, besteht immer), weil der echte Secret nur im
Cloudflare-Dashboard liegt. Das ist das einzige Glied der Kette, das noch nicht echt
geprüft ist. Der Testschlüssel steht **nicht** in `.env.local` — dort wäre er ein
abgeschalteter Spamschutz.

### Was nachweislich funktioniert

| Schritt | Beweis |
|---|---|
| HubSpot-Kontakt | id 244207392966, alle 15 Felder gesetzt |
| Die zehn eigenen Felder | `website_form_type`, `website_service`, `website_page_url`, vier UTM-Felder, `website_submission_id`, `website_last_submission` — alle gefüllt |
| Firma | „FRANKONIA Testeintrag", id 445068333287, angelegt und verknüpft |
| Notiz am Kontakt | mit Nachricht, Leistung, Seite und Kampagne |
| Brevo-Kontakt | id 2, alle 11 Attribute, `OPT_IN=true`, Liste `[7]` |
| **Eingangsbestätigung** | **zugestellt** an den Absender, sogar geöffnet |
| **Interne Benachrichtigung** | **zugestellt** an `info@frankonia-sicherheit.de` |
| Lauf ohne Marketing-Haken | `opt_in: false`, keine Einwilligung, keine Liste, keine Warnung |

**Die Kette ist damit von Ende zu Ende belegt**, nicht mehr nur durch Tests mit
gestellter `fetch`.

### Vier Fehler, die nur ein echter Lauf zeigen konnte

**1. `lifecyclestage: "lead"` hätte jede Anfrage falsch einsortiert.** Der Code
schrieb den internen Namen `lead` — und in HubSpot sind interner Name und **Label**
zwei verschiedene Dinge, wobei das Label pro Portal frei umbenennbar ist. In diesem
Portal:

| intern | Label in deinem Portal |
|---|---|
| `subscriber` | Kontakt |
| `4000505062` | Kaltakquise |
| `lead` | **Termin vereinbart** ← das hätte der Code geschrieben |
| `customer` | Kunde |

Ein Formulareingang wäre also als „Termin vereinbart" im CRM gelandet, mehrere Stufen
zu weit. Das fällt nicht am Tag der Anfrage auf, sondern Wochen später im Reporting.
**Jetzt kommt die Stufe aus `HUBSPOT_LIFECYCLE_STAGE`, und ohne diese Variable wird
die Phase gar nicht geschrieben** — HubSpot nimmt dann seine eigene Voreinstellung.
Das ist der einzige Wert, der in keinem Portal falsch sein kann.
⚠️ **Welche Stufe fachlich richtig ist, kann nur du entscheiden**, und deine Liste
enthält keine offensichtliche „Eingang über Website"-Stufe. `setup-hubspot.mjs
--verify` gibt die Auswahl jetzt aus. Bis du eine einträgst, bleibt die Phase leer —
funktional harmlos, aber die Anfragen sind dann im Reporting nicht als solche
erkennbar.

**2. „already subscribed" wurde als Fehler behandelt.** HubSpot antwortet mit
**400**, wenn der Kontakt bei einem Subscription-Typ schon eingetragen ist — der
gewünschte Zustand ist damit aber erreicht. Vorher hätte jeder wiederkehrende
Interessent, der den Haken setzt, eine Warnung erzeugt, und im Log hätte es
ausgesehen, als sei die Einwilligung nicht vermerkt. Jetzt gilt der Fall als Erfolg,
**aber nur nach Gegenprüfung**: die englische Meldung ist der Anlass, der Beweis ist
der Status-Endpoint. Ändert HubSpot den Text, bleibt es bei der Warnung — der
Fehlerfall ist die sichere Seite.

**3. Die eigene Log-Maskierung machte die Diagnose unmöglich.** `message` steht auf
der Tilgungsliste, weil es das Nachrichtenfeld des Formulars ist — es ist aber auch
der Standardschlüssel, unter dem HubSpot und Brevo ihren Fehlersatz zurückgeben. Im
Log stand:

    hubspot.einwilligung: 400 endgueltig {"message":"<entfernt>"}

Der eigentliche Grund war „is already subscribed", also gar kein Fehler. Für
**Fremdantworten** wird `message` jetzt maskiert statt getilgt; für unsere eigenen
Daten bleibt es beim Tilgen, denn bei der Nachricht eines Interessenten ist der
Inhalt selbst das personenbezogene Datum.

**4. Das Telefonmuster zerschnitt Kennungen.** Eine HubSpot-correlationId
`01a03e48-4ab9-…` wurde zu `4ab<tel>b36` — unbrauchbar, und genau die braucht man,
um mit dem Support über einen Fehler zu reden. Das Muster hat jetzt Wortgrenzen: eine
Telefonnummer steht nie direkt an einem Buchstaben, eine Kennung schon.

### Was in dieser Runde eingerichtet wurde

- **Die zehn eigenen HubSpot-Eigenschaften angelegt**, in der Gruppe
  `website_integration`. `--verify` bestätigt danach: Existenz und Typ stimmen bei
  allen, dazu die fünf Standardfelder, `company.name` und die beiden Notizfelder.
- **Brevo-Liste „Website – Marketing-Einwilligung" angelegt** (id 7) und in den
  Ordner `marketing_automation` verschoben — angelegt wurde sie zunächst in
  „Conversations-Kontakte", dem Chat-Ordner, wo eine Marketingliste nicht hingehört.
- **Vorlage 5 geprüft statt angenommen:** „Website – Eingangsbestätigung
  Kundenanfrage", aktiv, Absender `c.bauer@frankonia-sicherheit.de`, Antwort-an
  `info@frankonia-sicherheit.de`, und sie enthält beide Platzhalter, die der Code
  sendet (`params.VORNAME`, `params.SERVICE`).
- **Beide Subscription-Typen** statt einem, nach deiner Entscheidung („einfach beides
  setzen"): One to One (187291992, Typ Sales) **und** Marketing Information
  (176003184, Typ Marketing). Der Haken im Formular verspricht Marketing-Inhalte,
  deckt aber auch die 1:1-Kommunikation ab.
- **Fünf Werte in `.env.local` ergänzt**, alle selbst ausgelesen: die zwei
  Subscription-IDs, die Vorlagen-ID, die Listen-ID und die interne
  Benachrichtigungsadresse.
- **62 Tests grün** (waren 59). Neu: beide Subscription-Typen, der 400-Fall in beiden
  Richtungen, und die konfigurierbare Lifecycle-Phase.

### Was noch fehlt — und es ist genau eine Sache

| ☐ | Was | Woher |
|---|---|---|
| ✅ | ~~`TURNSTILE_SECRET_KEY`~~ | **war schon in `.env.local`, nur auskommentiert.** Aktiviert und gegen Cloudflare geprüft — siehe Abschnitt 20 |
| ☐ | Alle Werte auch in **Vercel** eintragen | Settings → Environment Variables |
| ✅ | ~~`HUBSPOT_LIFECYCLE_STAGE` wählen~~ | **gewählt: 5522034896 „Angebot erstellt“** — siehe Abschnitt 20 |

⚠️ **Ohne den Turnstile-Secret lehnt der Endpoint jede Anfrage ab** — bewusst so,
damit eine fehlende Konfiguration keinen offenen Endpoint erzeugt. Das ist der
einzige verbleibende Blocker.

⚠️ **Zwei Dinge zum Aufräumen in deinen Konten**, wenn du magst: der Testkontakt
(HubSpot id 244207392966, Brevo id 2) mit drei Notizen und die Testfirma (id
445068333287). Ich habe sie stehen gelassen — Produktivdaten löscht man nicht
nebenbei, und sie sind durch „Test Formularpruefung" eindeutig erkennbar. In Brevo
steht der Kontakt in der Marketingliste 7; für einen sauberen Start dort entfernen.

⚠️ **Zwei Beobachtungen zur Kenntnis, kein Handlungsbedarf:**
- **Brevo läuft auf dem kostenlosen Tarif: 300 Mails pro Tag.** Jede Anfrage
  verbraucht zwei (Bestätigung + interne Meldung), also reicht es für rund 150
  Anfragen täglich. Für den erwarteten Betrieb reichlich, aber der Wert ist gut zu
  kennen.
- **Der Testkontakt war bei beiden Subscription-Typen schon eingetragen**, mit der
  Rechtsgrundlage `LEGITIMATE_INTEREST_PQL` („Vertriebsinteresse") aus einem früheren
  Prozess. Eine frische Einwilligung wäre die stärkere Grundlage, aber der
  subscribe-Endpoint kann sie bei einem bereits eingetragenen Kontakt nicht ändern.
  Einen fremden Eintrag über die v4-API stillschweigend zu überschreiben habe ich
  nicht eingebaut — das wäre eine Entscheidung über deine CRM-Historie, nicht über
  Code.

## 20 — Lifecycle-Phase „Angebot erstellt", der Turnstile-Schlüssel, und was bei einer Eintragung genau passiert

### Der Turnstile-Schlüssel war schon in `.env.local` — auskommentiert

Er stand **zweimal** drin, beide Zeilen mit `#` davor, beide mit demselben Wert
(eine im Block „Später, noch nicht nötig"). Eine Zeile ist jetzt aktiv, die Dublette
als solche markiert.

✅ **Und er ist echt, nicht nur vorhanden:** gegen Cloudflare geprüft mit einem
Dummy-Token. Die Antwort war `invalid-input-response` und **nicht**
`invalid-input-secret` — genau diese Unterscheidung ist der Test: Cloudflare hat den
Schlüssel akzeptiert und nur das erfundene Token abgelehnt. Ein zweiter Lauf über den
echten Endpoint bestätigt es: **HTTP 400, `spamschutz`, und weder HubSpot noch Brevo
wurden angefasst.** Der Spamschutz ist damit scharf.

### Lifecycle-Phase: gesetzt, und dafür musste mehr geändert werden als eine Variable

`HUBSPOT_LIFECYCLE_STAGE=5522034896` („Angebot erstellt").

⚠️⚠️ **DIE VARIABLE ALLEIN HÄTTE FAST NICHTS BEWIRKT, und der Grund ist wichtig.**
Die Prüfung, ob eine Phase gesetzt werden darf, braucht eine **Reihenfolge** — sonst
könnte eine Anfrage einen bestehenden Kunden auf „Angebot erstellt" zurückstufen. Im
Code stand HubSpots Standardliste (`subscriber`, `lead`, `customer`, …). Dein Portal
benutzt aber **eigene Phasen mit numerischen IDs**, und für eine numerische ID findet
diese Liste keinen Platz: unbekannte Phase → nicht anfassen → **die Phase wäre nur
bei NEUEN Kontakten gesetzt worden.** Bei **2.767 Kontakten in „Kaltakquise"** wäre
das der Normalfall gewesen: Anfrage kommt an, Phase bleibt, wo sie war.

Deshalb trägt `api/_lib/hubspot.js` jetzt die **Reihenfolge deines Portals**, am
26.08.2026 aus der API gelesen:

| # | intern | Label |
|---|---|---|
| 1 | `subscriber` | Kontakt |
| 2 | `4000505062` | Kaltakquise |
| 3 | `5520647375` | Ansprechpartner / Entscheider herausgefunden |
| 4 | `lead` | Termin vereinbart |
| 5 | **`5522034896`** | **Angebot erstellt** ← Ziel |
| 6 | `customer` | Kunde |
| 7 | `evangelist` | Fürsprecher |
| 8 | `4003004610` | Upsell |
| 9 | `other` | Sonstiges |
| 10 | `5574730996` | Kein Interesse |

**Was das konkret heißt:**
- Neuer Kontakt → „Angebot erstellt".
- Kontakt in Kontakt / Kaltakquise / Ansprechpartner / Termin vereinbart → **wird
  hochgesetzt** auf „Angebot erstellt".
- Kunde / Fürsprecher / Upsell → **bleibt**, wird nie zurückgestuft.
- ⚠️ **„Sonstiges" und „Kein Interesse" werden seit dem 26.08. ÜBERSCHRIEBEN**, also
  ebenfalls auf „Angebot erstellt" gesetzt. Das ist die Kundenentscheidung zu der
  Frage, die hier vorher offenstand („auf jeden Fall überschreiben in dem Moment, wo
  jemand ein Angebot angefragt hat"), und sie ist schlüssig: wer nach so einer
  Einordnung selbst ein Angebot anfragt, hat sein Desinteresse gerade widerlegt.
  Die Folge für das Prüfskript steht in Abschnitt 22.3 — die Liste ist damit kein
  Spiegel der Portalreihenfolge mehr, sondern eine eigene Rangfolge.

✅ **Nachgewiesen, nicht behauptet:** der Testkontakt stand vor dem Lauf auf
`4000505062` (Kaltakquise) und nach dem Lauf auf `5522034896` (Angebot erstellt).

⚠️ **EINE STILLE FALLE, gegen die es jetzt eine Bremse gibt:** wird im Portal
umsortiert oder eine Phase ergänzt, ist die Konstante veraltet — und der Effekt wäre
unsichtbar, weil eine unbekannte Phase einfach nicht angefasst wird.
`node scripts/setup-hubspot.mjs --verify` vergleicht Code und Portal und endet mit
Fehlercode, wenn sie auseinanderlaufen. Ein Test hält die Liste zusätzlich fest.

### Die CTA-Frage: gemessen über alle 70 Seiten

**Der wichtigste Befund zuerst: es gibt nur EINEN Formulartyp.** Alle 44 Formulare
senden `form_type=customer_inquiry`. Es gibt also keine zweite Sorte
Website-Anfrage, die eine andere Phase bräuchte.

**CTAs, die zum Formular führen** — vier verschiedene Beschriftungen, ein Ziel:

| Beschriftung | Anzahl |
|---|---|
| „Unverbindliches Angebot einholen" | 88× |
| „Jetzt unverbindliches Angebot einholen" (der Absende-Knopf selbst) | 44× |
| „Kostenfreie Einschätzung erhalten" | 2× (`/werkschutz/`, `/revier-schliessdienst/`) |
| „Werkschutz anfragen" | 1× (`/werkschutz/`) |
| „Angebot anfordern" | 1× (`/ratgeber/kosten-sicherheitsdienst/`) |

**CTAs, die etwas anderes tun** — und hier ist die Antwort auf deine Frage:

| Was | Anzahl | Landet wo? |
|---|---|---|
| Telefonnummer | 62× (51 sekundär, 11 primär) | Anruf, kein Datensatz |
| „Jetzt Termin buchen" | **3×** auf `/sicherheitscheck-walde/` | ⚠️ **HubSpot Meetings** — eigener Weg |
| „Offene Stellen ansehen" / „Jetzt unverbindlich bewerben" | 7× | `/jobs/`, HubSpot-Formular |
| „Kontakt speichern" | 9× | vCard-Download auf den Personenseiten |
| „Kostenfreies Sicherheitskonzept anfordern" | 3× | Seite `/sicherheitskonzept/`, dort dann das Formular |
| „Brandwache anfragen" | 1× | Seite `/brandwache/`, dort dann das Formular |
| „Mehr erfahren" / „Schreiben Sie uns" / Instagram | 11× | andere Seiten |

⚠️⚠️ **DER EINE, DEN DU KENNEN MUSST: `/sicherheitscheck-walde/` hat drei
HubSpot-Meetings-Links.** Wer dort einen Termin bucht, geht **nicht** durch unser
Formular und damit nicht durch diesen Endpoint — HubSpot legt den Kontakt selbst an,
mit seiner eigenen Lifecycle-Logik. Diese Buchungen bekommen also **nicht** „Angebot
erstellt" und keines der `website_*`-Felder. Das ist kein Fehler, aber es ist die
einzige Stelle außer `/jobs/`, an der ein Kontakt ohne unser Zutun ins CRM kommt.

### Was bei einer Eintragung genau passiert — die vollständige Kette

Deine fünf Schritte sind richtig, es sind aber **vierzehn**. Der Reihenfolge nach:

**Im Browser, bevor überhaupt gesendet wird**
1. Beim Aufbau der Seite setzt `js/lead-form.js` drei versteckte Felder: Zeitstempel
   des Aufbaus, Seiten-URL und Referrer, dazu einen **Idempotenz-Schlüssel** (einmal
   je Formular, nicht je Klick) und die UTM-Parameter aus dem `sessionStorage`.
2. Beim Klick: Pflichtfelder prüfen, **Knopf sperren**, „Wird gesendet …".

**Auf dem Server, in dieser Reihenfolge — jeder Schritt kann abbrechen**
3. **Idempotenz.** Der Schlüssel wird sofort reserviert. Ein zweiter, gleichzeitiger
   Klick wartet auf das Ergebnis des ersten und bekommt dieselbe Antwort.
4. **Honeypot.** Ist das unsichtbare Feld gefüllt, endet es hier — mit **HTTP 200**,
   damit ein Bot nicht lernt, dass er erkannt wurde.
5. **Mindestzeit.** Unter 3 Sekunden zwischen Aufbau und Absenden: still verworfen.
6. **Rate-Limit.** Mehr als 5 Anfragen pro IP in 10 Minuten: 429.
7. **Turnstile.** Cloudflare prüft das Token. Erst ab hier kostet etwas Geld oder
   erzeugt Daten — deshalb steht der Spamschutz davor.
8. **Validierung.** Pflichtfelder, E-Mail-Form, Datenschutz-Haken.

**HubSpot** (Schritte 9–12, in dieser Reihenfolge)
9. **Kontakt suchen** über die E-Mail.
10. **Kontakt anlegen oder aktualisieren**: 5 Standardfelder, 10 eigene
    `website_*`-Felder, Lifecycle-Phase nach den Regeln oben, `hs_lead_status = NEW`
    nur bei neuen Kontakten. ⚠️ Antwortet HubSpot mit 400, folgt automatisch ein
    **zweiter Versuch nur mit den Standardfeldern** — der Lead geht nicht verloren.
11. **Firma** anlegen/finden und mit dem Kontakt verknüpfen (nur wenn ein
    Unternehmen angegeben wurde).
12. **Marketing-Einwilligung**, nur mit Haken: beide Subscription-Typen mit
    Rechtsgrundlage. Dann **Notiz** am Kontakt mit Nachricht, Leistung, Seite und
    Kampagne.

**Brevo** (Schritte 13–16)
13. **Kontakt** anlegen/aktualisieren, 11 Attribute inklusive der HubSpot-ID — damit
    sind beide Systeme verknüpft. Nur mit Haken kommt er in die Marketingliste.
14. **Eingangsbestätigung** an den Absender (Vorlage 5).
15. ⚠️ **Ein Ereignis `website_form_submitted`** — das hatte in deiner Liste gefehlt.
    Es ist der Auslöser, an den du in Brevo eine Automation hängen kannst.
16. **Interne Benachrichtigung** an `info@frankonia-sicherheit.de`, mit dem Absender
    als **Antwortadresse**: „Antworten" führt direkt zum Interessenten.

**Antwort an den Browser**
17. Mit JavaScript: JSON, dann `frankonia:form_success` für den Tag Manager, dann
    Weiterleitung auf `/danke/`. Ohne JavaScript: **303 auf `/danke/`**.

⚠️ **Was als Erfolg gilt, ist bewusst großzügig:** die Anfrage ist angekommen, sobald
**entweder** der HubSpot-Kontakt **oder** die interne Mail geklappt hat. Nur wenn
beides scheitert, sieht der Besucher einen Fehler mit Vorgangsnummer und der
Telefonnummer — und im Log steht dann `ALARM forms`, wonach man in den Vercel-Logs
gezielt suchen kann.

⚠️ **Was NICHT passiert:** kein Deal, kein Ticket, keine Aufgabe, keine Zuweisung an
einen Besitzer. Wenn eine Anfrage automatisch einem Vertriebler zufallen oder einen
Deal erzeugen soll, ist das eine Automation in HubSpot — das Datenmaterial dafür
(`website_form_type`, `website_service`, die UTM-Felder) liegt am Kontakt.

## 21 — Lokal prüfen, inklusive Formular

⚠️ **`npm run dev` reicht dafür NICHT.** Es liefert nur Dateien aus, und der
Endpoint unter `/api/forms/submit/` ist eine Vercel-Serverless-Funktion — ein
Absenden endet lokal in einem **404**. Vercel bringt für so etwas `vercel dev`
mit, das aber die Vercel-CLI verlangt (hier nicht installiert).

Deshalb gibt es jetzt:

    npm run dev:api

Ein Befehl. Er baut, startet einen Server auf **http://127.0.0.1:3000/** und
führt dabei den **echten** Endpoint aus — dieselbe Datei, die Vercel ausführt,
mit denselben `(req, res)`. Zero Abhängigkeiten, nur Node-Bordmittel.

⚠️ **Turnstile läuft lokal mit Cloudflares Testschlüsseln, und das muss so.** Ein
Site-Key ist an seine Domain gebunden; auf `127.0.0.1` würde das Widget nicht
validieren und jede Absendung mit 400 enden. Der Site-Key steht im HTML, muss also
VOR dem Bauen gesetzt sein — **deshalb baut das Skript selbst**, statt das von Hand
zu verlangen. Wer es vergessen hätte, würde den Fehler im Endpoint suchen.
Mit `DEV_TURNSTILE_ECHT=1` nimmt es die echten Schlüssel.

⚠️⚠️ **HubSpot, Brevo und die Mails sind produktiv — es gibt keine Testumgebung.**
Wer lokal absendet, legt einen echten Kontakt an und verschickt zwei echte Mails.
Der Server sagt das beim Start. Also eine erkennbare Testadresse benutzen.

### Nachgewiesen über diesen Server

| Prüfung | Ergebnis |
|---|---|
| 8 Seiten stichprobenhaft | alle 200 |
| `GET` auf den Endpoint | 405, ohne das Feldmodell zu beschreiben |
| Honeypot gefüllt | still 200 (ein Bot lernt nichts) |
| POST ohne Token | 400 `spamschutz` — der Spamschutz steht VOR der Validierung |
| **Formular im Browser ausgefüllt und abgesendet** | **Weiterleitung auf `/danke/`**, Titel „Anfrage erhalten“ |
| Vorbelegte Leistung | auf `/werkschutz/` kam `service: "Werkschutz"` am Server an |

Damit ist die letzte ungetestete Strecke belegt: Widget → JavaScript → Endpoint →
HubSpot/Brevo → Weiterleitung. Vorher war alles davon nur einzeln geprüft.

### Vor dem Deploy

| ☐ | Was | Warum |
|---|---|---|
| ☐ | **Alle 12 Werte in Vercel eintragen** | Ohne sie lehnt der Endpoint live JEDE Anfrage ab. `.env.local` ist nur lokal |
| ☐ | Consent Mode im Cookiebot-Konto prüfen | siehe Abschnitt 18, der Vier-Schritte-Test |
| ☐ | Nach dem Deploy: eine echte Anfrage über die Live-Domain | erst dort läuft Turnstile mit dem echten Schlüssel |
| ☐ | Testkontakte aufräumen | HubSpot 244207392966, Brevo id 2, Firma 445068333287 |

⚠️ **Die Reihenfolge ist nicht beliebig: erst die Variablen, dann der Deploy.**
Sonst steht die Seite live, während jedes Formular mit „Spamschutz“ abweist — und
das ist genau der Zustand, in dem echte Anfragen verloren gehen.

---

## 22 — Ratgeber ans Menüende, Vertrauensband auf den Personenseiten, und eine Korrektur zum Karten-Strip

Drei Ansagen vom 26.08. plus eine Richtigstellung, die mir selbst gehört.

### 22.1 Ratgeber steht im Drawer jetzt unter Kontakt

Kunde: *„im Mobile- und Tabletmenu möchte ich den ganz unten unter Kontakt haben,
nicht als Zweites"*. Eine Zeilenverschiebung in `partials/header-de.html`.

Die Reihenfolge im Drawer ist jetzt Startseite · Leistungen · Einsatzgebiete ·
Referenzen · Über uns · Karriere · Kontakt · **Ratgeber**. Der Punkt trägt weiter
`site-nav__item--drawer-only`, ist also ab 1400px ausgeblendet — am Desktop führt
der Fußbereich hin, weil die Navigationszeile bei sechs Punkten umbricht (der
Umbruchpunkt ist schon von 1024 auf 1400 gewandert, siehe Abschnitt 3 dieses
Berichts).

Die Begründung steht im Markup, nicht nur hier: der Ratgeber ist ein
Inhaltsbereich, kein Teil der Hauptnavigation. An zweiter Stelle hätte er mehr
Gewicht getragen als „Leistungen".

### 22.2 Vertrauensband unter allen neun Personenseiten

Kunde: *„kannst Du unten drunter noch ein paar Trustelemente und -Elemente machen.
So was wie das sagen unsere Kunden, Google Bewertung."*

Neues `partials/person-trust.html`, eingebunden auf den Karten:

⚠️ **Am 27.08.2026 sind es ACHT statt neun, und zwei Adressen haben sich geändert —
siehe Abschnitt 24.** Die Spalte „damals" steht daneben, weil dieser Abschnitt den
Stand vom 26.08. beschreibt und die Weiterleitungen genau von dort kommen.

| Seite | Pfad heute | am 26.08. |
|---|---|---|
| Steffen Walde — Sicherheitsdienst | `/steffen-walde-sicherheitsdienst/` | unverändert |
| Steffen Walde — Werkschutz | `/steffen-walde-werkschutz/` | unverändert |
| Alexander Jäger — Sicherheitsdienst | `/alexander-jaeger-sicherheitsdienst/` | unverändert |
| Alexander Jäger — Werkschutz | `/alexander-jaeger-werkschutz/` | unverändert |
| Christoph Bauer | `/christoph-bauer-sicherheitsdienst/` | `…-sicherheitsdienst-2/` |
| Daniel Wettengel | `/daniel-wettengel-sicherheitsdienst/` | unverändert |
| Bryan Van Wey — Werkschutz | `/bryan-van-wey-werkschutz/` | unverändert |
| Morelo Werkschutz Team | `/morelo-werkschutz-team/` | `…-team-2/` |
| ~~Bryan Van Wey — Security~~ | **entfallen** | `/bryan-van-wey-security/` |

Inhalt: die freigegebene Aussage „Über 300 Unternehmen und Einrichtungen vertrauen
FRANKONIA" (verbatim aus dem Hero von `/referenzen/`), die Google-Bewertung als
`.review-card review-card--sm` mit Link aufs echte Profil, die zwei DEKRA-Siegel,
und ein Weg zu den Zitaten.

⚠️ **Ein Partial und keine neun Kopien** — dieselbe Aussage auf neun Seiten wären
neun Gelegenheiten, dass eine veraltet. Die Zahlen kommen aus
`content/values.json` (`{{rating.value}}` / `{{rating.count}}`), nicht aus dem
Markup: eine neue Google-Note ist eine Zeile in einer Datei.

⚠️⚠️ **KEIN vollständiges Kundenzitat, und das ist eine bewusste Auslassung.** Die
drei Zitate der Website sind **332 bis 376 Zeichen** lang, und CLAUDE.md verbietet
das Kürzen: einer namentlich genannten Person Worte zu beschneiden heißt, ihr
andere in den Mund zu legen. Drei davon wären über 1.000 Zeichen auf einer Seite,
die nach dem Scannen eines QR-Codes vom Handy aus geöffnet wird — und *eines*
auszuwählen hieße, einen Kunden zum Gesicht jeder Visitenkarte zu machen. Das ist
eine Kundenentscheidung, keine, die hier nebenbei fällt. Der Grund steht im
Kopfkommentar des Partials, damit niemand es später „vervollständigt".

⚠️ **Kein Pixel-Übergang davor:** Karte und Band liegen beide auf dem Schwarz der
Seite, und zwei gleiche Flächen bekommen keinen Übergang (page-conventions §9.2) —
er würde Schwarz auf Schwarz auflösen, also nichts.

⚠️ **`/linktree/` und `/sicherheitscheck-walde/` bleiben außen vor.** Beide tragen
dasselbe Kartenlayout, sind aber keine Personenseiten: das eine ist eine
Linksammlung, das andere eine Buchungsseite mit drei HubSpot-Terminlinks.

**Gemessen an 320 / 390 / 419 / 420 / 768 / 1440:** kein Überlauf, nichts außerhalb
des Viewports, DEKRA-Verhältnis **0,665 = 399/600 exakt** (also unverzerrt — bei
diesen Grafiken ist nur proportionales Skalieren erlaubt), Siegel 38px unter 420
und 44px darüber, Link **44px** hoch, alle Elemente **0px** von der Mittelachse,
Band unter 420px in einer Spalte statt gequetscht, Claim-Icon
`fill: none; stroke: rgb(61,154,211)` — die `<use>`-Falle also nicht getreten.

✅ **Die Google-Pille misst 24×247 und das ist KEIN Fehler.** Ich hatte 48px im
Kopf; nachgemessen ist es derselbe Wert wie in ihrer bestehenden Verwendung auf
`/ueber-uns/`. Zwei Größen für dasselbe Bauteil wären der Fehler gewesen.

⚠️⚠️ **DER EINE ECHTE FEHLER WAR NUR IM BILD ZU SEHEN, NICHT IN DEN ZAHLEN:** das
Gebäude-Zeichen vor der Aussage stand **117px** neben dem Text. Ursache:
`.person-trust__claim` war ein Flexbox, und der umbrechende Textknoten wird darin
zu einem Block, dessen Zeilen zentriert sind — das Icon klebte am Rand dieses
Blocks, nicht an den Buchstaben. Alle Messwerte waren dabei in Ordnung. Jetzt
`display: inline-block; vertical-align: -0.18em`, also Teil der Textzeile.
**Lektion, und sie ist alt in diesem Projekt: eine Messung sagt, ob etwas dort
ist, wo es sein soll — nicht, ob die Komposition stimmt. Für Zweites braucht es
den Blick.**

### 22.3 Lifecycle: „Sonstiges" und „Kein Interesse" werden jetzt überschrieben

Kunde: *„hier Sonstiges und kein Interesse auf jeden Fall überschreiben in dem
Moment, wo jemand ein Angebot angefragt hat"*. Damit ist die offene Frage aus
Abschnitt 20 beantwortet.

Beide Einträge stehen in `LIFECYCLE_REIHENFOLGE` nun **ganz vorne**, also
unterhalb von allem anderen — eine neue Anfrage hebt sie auf „Angebot erstellt".
Die Begründung ist schlüssig: wer nach so einer Einordnung selbst ein Angebot
anfragt, hat sein Desinteresse gerade widerlegt.

⚠️ **Die andere Richtung gilt unverändert:** „Kunde", „Fürsprecher" und „Upsell"
stehen hinter dem Ziel. Ein Formular kann niemanden zurückstufen.

⚠️⚠️ **FOLGE, DIE MAN KENNEN MUSS: die Liste ist damit KEIN SPIEGEL DER
PORTALREIHENFOLGE MEHR, sondern eine eigene Rangfolge.** `setup-hubspot.mjs
--verify` verglich bisher Element für Element und hätte ab jetzt bei **jedem Lauf**
Alarm geschlagen, obwohl nichts kaputt ist — also genau die Art Warnung, die man
nach dreimal ignoriert. Der Vergleich prüft jetzt die **Menge**: eine Phase, die es
im Portal gibt und im Code nicht, gilt als unbekannt, der Kontakt wird gar nicht
umsortiert, und **niemand merkt es** — das ist der Fall, der auffallen muss.

Der Test hält beides fest: `darfPhaseSetzen("other", ziel) === true` und die
vollständige Rangfolge als `deepEqual` — die Reihenfolge ist dort mitgeprüft, weil
sie entscheidet, wer überschrieben wird. **63/63 Tests grün.**

### 22.4 Korrektur: der Karten-Strip bei Tablet-Breite läuft, meine Messung war falsch

Ich hatte gemeldet, das Band brauche bei 914px eine Maus, weil die Bildlaufleiste
versteckt ist. **Das war ein Fehler meiner Messung, nicht der Seite.**

⚠️⚠️ **Die Sonde erzwang `prefers-reduced-motion`, und genau diese Einstellung
schaltet den Scroll-Antrieb ab.** Mit normaler Bewegung gemessen (`CDP_MOTION=1`):
bei **768, 914 und 1023px** läuft das Band beim Nach-unten-Scrollen von selbst
seitwärts, die Bühne bleibt `sticky` stehen, die Bahn ist **4432 / 5082 / 5567px**
lang. Genau das Verhalten wie im Desktop.

Was sich unterscheidet, ist das **Aussehen**: Desktop stapelt die Karten
übereinander (die nächste schaut hervor), das Tablet-Band legt sie flach
nebeneinander.

Geprüft, ob der gestapelte Look ab 900px laufen kann: **er läuft** (`enhanced`
greift, Karten 248–282px breit, Überschriften auf zwei Zeilen). Zwei Dinge müssten
mit, und deshalb ist es eine Frage und keine Änderung: die Sektion fällt auf
**1096px** Höhe zusammen, es bleibt also keine Scrollstrecke, und die Wischleiste
bliebe zusätzlich sichtbar (ein vierter Schalter in `js/swipe-carousel.js`).

⚠️ **Lektion für jede weitere Messung an dieser Sektion: eine Sonde mit erzwungener
reduzierter Bewegung kann über scroll-getriebene Effekte nichts aussagen.** Sie
misst dann den Ruhezustand und meldet ihn als Defekt.

---

## 23 — „Bewerber oder Kunde?", kein Firmenobjekt, ein Hinweis im Nachrichtenfeld, und Karriere heißt wieder Jobs

Vier Punkte aus der Sicht des Testkontakts am 26.08., alle live nachgewiesen.

### 23.1 Die Rolle wird jetzt gesetzt — „(Potenzieller) Kunde"

Kunde: *„Du hast das Eigenschaftsfeld Bewerber oder Kunde ausgewählt. Da ist grad
Bewerber Schrägstrich Mitarbeiter ausgewählt. Das muss bei allen Feldern außer den
Karriere- oder Jobformularen potenzieller Kunde sein."*

⚠️ **ZUR EINORDNUNG, WEIL DIE MELDUNG EINE URSACHE UNTERSTELLT, DIE NICHT STIMMT:
das Formular hat diese Eigenschaft vorher NIE geschrieben.** Sie stand in keiner der
beiden Zuordnungstabellen. Der Wert „Bewerber / Mitarbeiter" kam also nicht aus der
Website. Nachgewiesen am Kontakt selbst: sein `createdate` ist der **31.03.2025**,
er trug eine Aufgabe von Dezember 2025 und E-Mails vom 10.08.2026 — das Formular hat
einen vorhandenen Kontakt aktualisiert, nicht angelegt. Was fehlte, war nicht die
Korrektur eines falschen Werts, sondern das Setzen überhaupt.

⚠️⚠️ **DIE INTERNEN WERTE SIND NICHT DIE BESCHRIFTUNGEN, und hier besonders nicht.**
Am 26.08. aus dem Portal gelesen, nicht geraten:

| interner Wert | Beschriftung im Portal |
|---|---|
| `(Potenzieller) Kunde` | „(Potenzieller) Kunde" |
| `Bewerber Sicherheitsdienst` | „Bewerber / Mitarbeiter" |

Ein „potenzieller Kunde" — klein geschrieben, ohne Klammern — wäre von HubSpot mit
**400 für den gesamten Aufruf** abgelehnt worden, also samt Name und E-Mail.

⚠️ **DIE TRENNUNG „ALLES AUSSER KARRIERE" IST HEUTE STRUKTURELL, NICHT NUR
KONFIGURIERT:** das Bewerberformular auf `/jobs/` ist ein **eingebettetes
HubSpot-Formular** und läuft gar nicht durch diesen Endpoint (siehe
`partials/hubspot-jobs-form.html`). Gemessen: **44 Formulare** auf der Website, alle
mit `form_type=customer_inquiry`, und `/jobs/` hat überhaupt kein eigenes `<form>`.
Die Zuordnung steht trotzdem **je Formulartyp** in einer Tabelle — kommt später ein
Typ `application` dazu, ist „Bewerber Sicherheitsdienst" eine Zeile.

⚠️ **Die Eigenschaft wird bei den EIGENEN Feldern geschrieben, nicht bei den
Standards**, und das ist der Ausfallmodus: wird die Option im Portal umbenannt,
scheitert der erste Versuch mit 400 und der zweite schreibt nur die Standardfelder.
Dann fehlt die Rolle — **aber der Lead ist da.** Bei den Standardfeldern wäre eine
Umbenennung im Portal ein Totalausfall des Formulars.

⚠️ **Angelegt wird sie nie.** Das ist eine Eigenschaft, die du selbst gebaut hast.
`scripts/setup-hubspot.mjs` legt nur die Felder der Gruppe `website_integration` an;
diese hier **prüft** es, und zwar eine Stufe tiefer als alle anderen: nicht nur, ob
sie existiert, sondern ob der Wert, den wir schreiben, eine echte Option ist.

⚠️ **Der Wert wird überschrieben, auch wenn schon einer steht.** Bei einem
Einzel-Auswahlfeld geht es nicht anders — irgendeine Seite verliert, und das Formular
ist der jüngste Beleg dafür, was diese Person will. **Der Grenzfall:** wer sich erst
bewirbt und später ein Angebot anfragt, wird zum Kunden umgeschrieben. Am Testkontakt
war `bewerber_status` leer, es ging also nichts verloren; bei einem echten Bewerber
mit gepflegtem Status stünde der danach ohne passende Rolle daneben. Sag Bescheid,
wenn es „nur setzen, wenn leer" sein soll — dann bleibt aber genau der Fall stehen,
den du gemeldet hast.

### 23.2 Kein Unternehmensobjekt mehr

Kunde: *„Außerdem hast Du auch automatisch eine Testfirma angelegt. Firma anlegen
würde ich vielleicht gar nicht mal machen."*

Abgeschaltet, standardmäßig. Der Grund ist CRM-Hygiene: „Firma" ist ein freies
Textfeld, und aus „Frankonia", „FRANKONIA GmbH" und „frankonia sicherheit" würden
drei Objekte, die später jemand von Hand zusammenführt.

✅ **Es geht dabei keine Angabe verloren, und das ist die Voraussetzung dafür, dass
man es abschalten darf:** der eingegebene Firmenname steht als Standardeigenschaft
`company` **am Kontakt** und zusätzlich im Text der Notiz. Nachgemessen am
Testkontakt: `company = FRANKONIA Testeintrag`.

⚠️ **Wiedereinschalten ist eine Umgebungsvariable, kein Codeeingriff:**
`HUBSPOT_FIRMA_ANLEGEN=1`. Der Weg samt Assoziation bleibt vollständig erhalten.

### 23.3 Hinweis im Nachrichtenfeld, auf allen 44 Formularen

Kunde: *„wir sollten im nachrichtenfeld klarmachen dass angegeben werden soll wann,
wo, wie viele sicherheitskräfte und welche aufgabengebiete"*.

Neue Zeile unter der Beschriftung: **„Für ein Angebot ohne Rückfragen: wann, wo, wie
viele Sicherheitskräfte und welche Aufgaben."**

⚠️ **Sie steht im gemeinsamen Baustein und NICHT im `messageLabel`.** Das Label ist je
Seite anders — gemessen **22 Varianten**, etwa „Baustelle, Bauphase und Zeitraum kurz
beschreiben" — und freigegebenes Copy. Der Hinweis soll auf allen 44 Formularen
identisch sein; als Include-Parameter wären es 44 Gelegenheiten, dass einer abweicht.

⚠️ **Als eigene Zeile und nicht als `placeholder`:** ein Platzhalter verschwindet beim
ersten Tastendruck. Genau dann braucht man eine Liste mit vier Punkten noch.

⚠️ **`aria-describedby` ist nicht Zierde:** ohne die Verbindung liest ein Screenreader
beim Sprung ins Feld nur die Beschriftung vor.

⚠️⚠️ **EIN KONTRASTWERT, DEN ICH HINGESCHRIEBEN STATT GERECHNET HABE — und er war
falsch.** Die erste Fassung stand auf `rgb(59 73 86 / 0.72)` mit dem Kommentar „misst
5,4:1". Nachgerechnet sind es **4,25:1**, also **unter** dem Minimum von 4,5:1 für
Text dieser Größe (13px sind normaler Text; die Ausnahme für großen Text beginnt erst
bei 18,66px fett oder 24px). Jetzt 0,8 = **5,25:1**, gemessen auf der echten Fläche
in vier Seiten. **Lektion: ein Kontrastwert, den man nicht rechnet, ist geraten.**

⚠️ Damit ist der Hinweis einen Hauch dunkler als die Beschriftung darüber (0,75 =
4,60:1). Absicht: unter 0,75 gibt es auf Weiß keinen Platz mehr, ohne durchzufallen.
Die Rangfolge trägt hier die Typografie — Großbuchstaben mit Sperrung gegen
Gemischtschrift.

**Gemessen an 320 / 390 / 768 / 1440:** Hinweis vorhanden, `aria-describedby` löst auf
ein existierendes Ziel auf, 13px, kein waagerechter Überlauf, die Textarea behält ihre
Mindesthöhe (88px im Telefonblock, 72px darüber), 1 Zeile ab 768, 2 bei 390, 3 bei
320. Bild geprüft.

### 23.4 Die Leistungsauswahl bleibt — meine Empfehlung, und warum

Kunde: *„Ich weiß nicht, ob das so nutzerfreundlich ist, dass er da mit irgendwelchen
Fachbegriffen um sich schmeißen muss. […] Oder was sagst du?"*

**Behalten.** Drei gemessene Gründe:

1. **Sie ist schon freiwillig.** Der erste Eintrag heißt „Bitte auswählen (optional)",
   und der Server verlangt das Feld nicht. Niemand muss einen Begriff kennen.
2. **Es ist Wiedererkennen, kein Erinnern.** Die 12 Einträge sind die Namen deiner
   eigenen Leistungen, also die Titel der Seiten, auf denen das Formular steht — auf
   `/objektschutz/` ist „Objektschutz" vorbelegt. Dazu ein Ausweg: „Etwas anderes".
3. **Der Wert arbeitet an drei Stellen:** `website_service` in HubSpot (Segmentierung),
   `SERVICE` in Brevo, und **die Betreffzeile der internen Meldung** („… — Objektschutz"),
   also das, was vor dem Öffnen sagt, worum es geht.

⚠️ Ein Wegfall wäre technisch harmlos — die Bestätigungsmail zeigt die Leistung nur,
wenn `SERVICE` gefüllt ist, ein leeres Feld ist also ein bereits behandelter Fall.
Es kostet nur Struktur.

**Wenn dir „Fachbegriffe" trotzdem zu hart ist, ist die kleinste Änderung eine
Beschriftung, nicht das Feld:** „Etwas anderes" → „Weiß ich noch nicht". Das ist Copy,
deshalb frage ich statt es zu tun.

### 23.5 Karriere heißt wieder Jobs

Kunde: *„kannst du die seite die aktuell karriere heißt wieder wie in der aktuellen
homepage auf jobs umbenennen und auch die url zu jobs abändern?"*

✅ **Die URL war schon `/jobs/`** — samt Sitemap-Eintrag, samt Seitentitel („Security
Jobs Bamberg & Umland"), samt H1 („Dein Job bei FRANKONIA"). Es war ausschließlich die
Beschriftung. Geändert an fünf Stellen: Navigation, Fußbereich, Linktree-Eintrag,
sichtbare Brotkrume und der `BreadcrumbList` im JSON-LD — die beiden letzten gehören
zusammen, sonst zeigt Google einen anderen Pfad als die Seite. Dazu die zwei
Meta-Beschreibungen von `/linktree/`, die die Ziele aufzählen.
**Gemessen über die 70 gebauten Seiten: „Karriere" kommt als Beschriftung nicht mehr
vor.**

⚠️ **Zwei Stellen bleiben bewusst stehen: „Karriereformular" und „Karriereseite" in der
Datenschutzerklärung.** Das ist Rechtstext, der nicht eigenmächtig geändert wird — und
beides ist beschreibend, nicht der Name der Seite. Für die nächste Fassung deiner
Datenschutzerklärung vormerken.

### 23.6 Brevo-Mails in HubSpot protokollieren — von dir erledigt

Kunde: *„die emails von brevo die an die sich eintragende person verschickt wurden
wurden nicht in hubspot protokolliert. das wurde geändert."* Auf deiner Seite gelöst,
im Code war dafür nichts zu tun — die Bestätigungsmail geht über Brevo, und ob HubSpot
sie mitschreibt, entscheidet die BCC-Protokolladresse im Brevo-Konto. Beim nächsten
Testeintrag lässt sich das an der Aktivitätenliste des Kontakts sehen.

### 23.7 Der Nachweis, live

Ein klar erkennbarer Testeintrag über den lokalen Server gegen die **echten** Systeme,
Vorgangsnummer `a8f9e7e4-da3a-4805-8413-3295d822e956`:

| geprüft | Ergebnis |
|---|---|
| `bewerber_oder_kunde_` | **„(Potenzieller) Kunde"** — vorher „Bewerber Sicherheitsdienst" |
| `lifecyclestage` | `5522034896` = Angebot erstellt |
| `company` am Kontakt | „FRANKONIA Testeintrag" — die Angabe ist da |
| Unternehmen in den letzten 20 Minuten angelegt | **0** |
| Protokoll des Endpoints | „abgeschlossen", nicht „teilerfolg" — also **alle** Schritte inklusive beider Mails und Brevo |
| `bewerber_status` | leer, es ging kein Bewerberstand verloren |

Und `node scripts/setup-hubspot.mjs --verify` (nur lesen) meldet alle 15 Felder, die
Rolle mit ihrer Option, alle 10 Lifecycle-Phasen und **0 Probleme**.

**64/64 Tests grün.** Zwei bestehende Zusicherungen mussten dafür erweitert werden, und
das ist der interessante Teil: sie verlangten, dass **jedes** geschriebene Zusatzfeld
mit `website_` beginnt und von `setup-hubspot.mjs` angelegt wird. Die Rolle ist der
erste Fall, der beides nicht tut. Sie ist deshalb **namentlich** freigestellt und nicht
per Muster — ein zweites portalfremdes Feld lässt die Tests weiter scheitern, solange
es nicht ebenso erklärt wird. Dazu ein neuer Test: ein unbekannter Formulartyp bekommt
**keine** Rolle (lieber kein Wert als der falsche).

⚠️ **Aufzuräumen (Produktivdaten, die lösche ich nicht selbst):** Kontakt
`244207392966` heißt jetzt „Test Rollenpruefung" und trägt mehrere Testnotizen; Firma
`445068333287` („FRANKONIA Testeintrag", angelegt 26.08.) ist noch mit ihm verknüpft;
Brevo-Kontakt id 2 steht in Liste 7.

---

## 24 — Van Wey Security entfällt, die „-2" verschwindet aus zwei Adressen

Drei Wünsche aus dem Blick auf die Liste der Personenseiten, plus eine Aufräumarbeit
am Generator, die dabei unvermeidlich war.

### 24.1 Was jetzt gilt

| alte Adresse | neu |
|---|---|
| `/bryan-van-wey-security/` | **entfällt**, leitet dauerhaft auf `/bryan-van-wey-werkschutz/` |
| `/christoph-bauer-sicherheitsdienst-2/` | `/christoph-bauer-sicherheitsdienst/` |
| `/morelo-werkschutz-team-2/` | `/morelo-werkschutz-team/` |

Dazu **neun Weiterleitungen**, alle dauerhaft (301): je zwei pro Adresse — mit und
ohne Schluss-Schrägstrich — und je eine für den vCard-Pfad.

⚠️ **Warum je zwei:** `trailingSlash: true` ergänzt den Schrägstrich erst, **nachdem**
die Weiterleitungen geprüft wurden. Ein einzelner Eintrag ohne Schrägstrich greift bei
einer gedruckten Adresse mit Schrägstrich nicht. Das ist die bestehende Machart der
Datei, hier fortgeführt.

⚠️ **Warum auch die vCard-Pfade:** der Knopf „Kontakt speichern" gibt genau diese
Adresse heraus. Sie kann in einer Chronik oder in einer weitergeschickten Nachricht
stehen, und ein 404 auf eine Kontaktdatei sieht aus wie ein kaputter Kontakt.

⚠️ **Die „-2" kam aus WordPress**, das an einen belegten Slug eine Zahl hängt — auf
der Website hatte sie keine Bedeutung. Sie stand aber auf gedruckten Karten, deshalb
Weiterleitung und nicht Abschaltung.

### 24.2 Die Van-Wey-Security-Karte war KEINE Kopie — was mit ihr verschwindet

⚠️⚠️ **Das ist der Punkt dieser Runde, den man wissen muss.** Die beiden Van-Wey-Karten
unterschieden sich in mehr als der Überschrift:

| | Security-Karte (entfällt) | Werkschutz-Karte (bleibt) |
|---|---|---|
| E-Mail | `b.vanwey@frankonia-security.de` | `b.vanwey@frankonia-werkschutz.de` |
| Firma in der vCard | **FRANKONIA Security GmbH & Co. KG** | FRANKONIA Werkschutz GmbH & Co. KG |
| URL in der vCard | `frankonia-security.de` | `frankonia-werkschutz.de` |
| Lede | Event/Objekt | Kapital, Know-How, Mitarbeitende |

`frankonia-security.de` war eine **dritte Marke** neben `-sicherheit.de` und
`-werkschutz.de`, und diese Karte war **die einzige Stelle im ganzen Projekt**, an der
sie und die Firmierung „FRANKONIA Security GmbH & Co. KG" auftauchten — im Impressum
kommen sie nicht vor. Das stand schon seit dem 26.08. als Notiz im Generator.

**Folge, ausdrücklich:** wer den alten QR-Code scannt, bekommt jetzt die Werkschutz-Karte
mit `b.vanwey@frankonia-werkschutz.de`. Wenn Bryan gedruckte Karten mit der
Security-Adresse im Umlauf hat, verweist die Website nicht mehr darauf.

⚠️ **Die Datei `assets/documents/bryan-van-wey-security.vcf` ist mitgelöscht.** `build.js`
kopiert `assets/` vollständig, eine verwaiste vCard wäre also weiter öffentlich
abrufbar — mit der Firmierung, die von der Website verschwinden sollte. Der alte Pfad
leitet auf die Werkschutz-vCard.

### 24.3 Der Generator war veralteter als die Seiten — und ein Lauf hätte still Schaden angerichtet

⚠️⚠️ **Die Personenseiten werden von `docs/design-sources/person-pages.js` erzeugt, und
der Generator war an drei Stellen nicht mehr auf dem Stand der Seiten:**

1. `<!-- include: gtm-noscript -->` fehlte (später auf allen Seiten ergänzt),
2. `<!-- include: person-trust -->` fehlte (das Vertrauensband von gestern),
3. im Linktree stand noch „Karriere" statt „Jobs" (von heute Vormittag).

**Ein Lauf des Generators hätte damit das Vertrauensband und das GTM-noscript aus elf
Seiten wieder entfernt — ohne Fehlermeldung.** Genau deshalb wurde er erst
synchronisiert, dann geändert.

✅ **Nachgewiesen, nicht behauptet:** der Generator lief in ein Testverzeichnis, und die
Ausgabe wurde gegen `pages/` gediffed. **Alle acht bestehenden Personenseiten plus
`/linktree/` und `/sicherheitscheck-walde/` sind byteidentisch**; die zwei neuen Slugs
sind der einzige Unterschied. Vorher waren es drei Abweichungen je Seite.

⚠️ **Eine Leerzeile hat dabei Arbeit gemacht, und das ist kein Detail:** der erste
Versuch erzeugte eine zusätzliche Leerzeile vor `</main>`, weil `FOOT` mit einem
Zeilenumbruch beginnt und die Include-Zeile mit einem endete. Byteidentität ist der
einzige Maßstab, an dem man einen Generator gegen seine Ausgabe prüfen kann — mit
„sieht gleich aus" wäre die Abweichung durchgegangen und der nächste Diff wertlos
geworden.

⚠️ **Der entfernte Karteneintrag steht als Notiz im Generator**, nicht bloß im
Git-Verlauf: was mit der Karte verschwindet (dritte Marke, Firmierung, vCard) ist
nicht offensichtlich, und der nächste Bearbeiter soll es nicht aus einem Diff
rekonstruieren müssen.

### 24.4 Geprüft

- **`node docs/design-sources/redirect-test.js`: 0 Probleme.** Die drei neuen Adressen
  sind in die Sollwert-Tabelle aufgenommen, treffen genau eine Regel, ihr Ziel existiert
  im Build, und **kein Ziel ist selbst wieder Quelle** (Kettenprüfung). Von den 41
  Adressen der alten Seite ist **keine verwaist**.
  ⚠️ Die Notiz an der Inventarliste stimmte danach nicht mehr — sie sagte „SECHS bleiben
  als echte Seite" — und ist auf DREI/FÜNF/ZWEI korrigiert. Eine Zahl in einem
  Kommentar, die niemand nachzieht, ist beim nächsten Mal die Quelle des Irrtums.
- **69 Seiten** im Build statt 70, die drei alten Verzeichnisse sind weg, die zwei neuen
  da, **0 Verweise** auf die alten Pfade in den 69 Seiten, und die zwei umbenannten
  vCards liegen unter ihrem neuen Namen.
- **Das Vertrauensband steht auf 8 Personenseiten** — vorher neun, eine ist entfallen.
- **64/64 Tests.** Bild einer der umbenannten Seiten geprüft.
- ⚠️ **Die Weiterleitungen selbst sind statisch geprüft, nicht live:** `npm run dev`
  liest `vercel.json` nicht, Weiterleitungen sind Hosting-Konfiguration. Lokal geben die
  drei alten Adressen deshalb 404 — **das ist erwartet und kein Defekt**. Nach dem Deploy
  einmal `node docs/design-sources/redirect-test.js https://frankonia-sicherheit.de`,
  dann stehen dort echte Statuscodes.

⚠️ **Nicht angefasst: die Sitemap.** Personenseiten stehen dort nicht und sollen es
nicht — sie sind `noindex,follow`, weil sie dünn und personenbezogen sind und indexiert
mit den echten Leistungsseiten konkurrieren würden. Erreichbar bleiben sie über QR-Code
und gedruckte Karte, was der ganze Grund ihrer Existenz ist.

---

## 25 — Die Bestätigungsmail landet in der Aktivitätenliste des Kontakts

Kunde, 27.08.2026: *„aktuell wird die Formulareintragung nur als Notiz protokolliert.
Das passt auch, allerdings werden ja an den Nutzer eine Bestätigungsmail über Brevo
versendet. Das wäre schon irgendwo cool, wenn diese Bestätigungsmail auch protokolliert
wird. […] Überleg's dir gerne selbst, wie Du es machen möchtest."*

### 25.1 Der Weg: BCC an HubSpot, gesetzt beim Senden

Die Bestätigungsmail trägt jetzt ein **BCC an die Protokolladresse des Portals**. HubSpot
erkennt die Mail und hängt sie an den Kontakt — sichtbar in der Aktivitätenliste unter
„E-Mails", neben der Notiz.

⚠️⚠️ **WARUM ES BISHER NICHT FUNKTIONIERT HAT, obwohl du im Brevo-Konto etwas geändert
hattest:** eine Transaktionsmail über die Brevo-API bringt **ihre Empfängerliste im
Aufruf selbst mit**. Eine Kontoeinstellung greift dort nicht — sie wirkt auf Kampagnen,
nicht auf einen `POST /smtp/email`. Das BCC muss also an der Stelle stehen, an der der
Aufruf gebaut wird, und das ist dieser Code. Deshalb war die Änderung im Konto
wirkungslos, ohne Fehlermeldung.

### 25.2 Warum BCC und nicht die HubSpot-API

Der andere denkbare Weg wäre, die Mail über HubSpots Engagements-API als E-Mail-Aktivität
anzulegen. **Dagegen sprechen zwei Dinge, und das erste ist das ausschlaggebende:**

- **Es würde einen NACHBAU protokollieren, nicht die Mail.** Brevo rendert das Template
  auf seiner Seite. Um denselben Text zu erzeugen, müsste dieser Code das Template holen
  und die Platzhalter selbst ersetzen — **zwei Renderer für einen Text**, die
  auseinanderlaufen, sobald jemand das Template in Brevo ändert. In der Aktivitätenliste
  stünde dann etwas, das der Interessent nie gesehen hat, und niemand würde es merken.
  Über BCC landet die **echte** Mail dort, mit dem Layout des Empfängers.
- Es wäre ein Modul mit eigenen API-Rechten, eigenen Fehlerfällen und eigener
  Wiederholungslogik. Das BCC ist ein Feld im Aufruf, der ohnehin stattfindet.

### 25.3 Zwei Entscheidungen, die man kennen muss

⚠️⚠️ **NUR AUF DER BESTÄTIGUNGSMAIL, NICHT AUF DER INTERNEN MELDUNG — und das ist die
wichtigere der beiden.** HubSpot protokolliert eine per BCC erhaltene Mail **beim
EMPFÄNGER**. Die interne Meldung geht an FRANKONIA selbst; sie würde also an einem
Kontakt „info@frankonia-sicherheit.de" hängen oder einen anlegen. Der Kontakt des
Interessenten hätte dann pro Anfrage **zwei E-Mail-Einträge, von denen einer ihn nie
erreicht hat**. Das ist kein sichtbarer Fehler, sondern Rauschen, das erst Wochen später
auffällt. Deshalb steht das BCC bewusst nicht in einer gemeinsamen Hilfsfunktion, sondern
an genau einer Mail — mit dieser Begründung im Code, damit es niemand „aufräumt".

⚠️ **Die Adresse wird NICHT geraten.** Sie ist portalspezifisch und steht in den
HubSpot-Einstellungen. Bei vielen Portalen ist es `<PortalId>@bcc.hubspot.com`, und die
Portal-ID steht sogar schon in einer Variablen — trotzdem wird nicht abgeleitet: bei
einer falschen Adresse geht jede Bestätigungsmail zusätzlich ins Nirgendwo, das
**Bounces** produziert, und Bounces kosten Absender-Reputation. Dieselbe Regel wie bei
den Subscription-IDs.

**Neue Variable: `HUBSPOT_BCC_ADDRESS`.** In HubSpot in der Einstellungssuche nach „BCC"
suchen, Adresse kopieren, in `.env.local` **und** in Vercel eintragen.
Ohne die Variable passiert genau das, was vorher passiert ist — nur mit einer Zeile im
Protokoll: *„HUBSPOT_BCC_ADDRESS nicht gesetzt — Mail wird in HubSpot nicht
protokolliert."*

### 25.4 Geprüft

- **67/67 Tests**, drei davon neu:
  · das BCC steht auf der Bestätigungsmail **und die interne Meldung trägt keines** —
    das „nicht" ist der Kern des Tests;
  · ohne die Variable wird **kein leeres `bcc`-Feld** gesendet. ⚠️ Das ist nicht
    Kosmetik: ein leeres `bcc` lehnt Brevo mit 400 ab, und das würde die
    Bestätigungsmail kosten — also den einen Beleg, den der Interessent bekommt;
  · ein unbrauchbarer Wert wird verworfen. Geprüft mit den drei realistischen
    Konfigurationsfehlern: eine hineinkopierte URL, ein stehengebliebener Platzhalter,
    ein Feld aus Leerzeichen. Und mit Leerzeichen drumherum, wie beim Kopieren.
- **`node scripts/setup-hubspot.mjs --verify` sagt jetzt, ob die Adresse gesetzt ist**,
  und maskiert sie in der Ausgabe (`27***@bcc.hubspot.com`). Beide Zweige laufend
  geprüft. ⚠️ Mehr kann das Skript nicht: **ob HubSpot die Mail wirklich protokolliert,
  ist über die API nicht prüfbar** — das hängt am Portal, nicht an diesem Code.
- ✅ **LIVE NACHGEWIESEN am 27.08.2026, 19:59.** Der Kunde hat die Adresse geliefert
  (`27143941@bcc.eu1.hubspot.com`), sie steht in `.env.local`, und ein Testeintrag
  (`45e34960-…`) hat gezeigt: **drei Sekunden nach dem Absenden hängt am Kontakt eine
  E-Mail-Aktivität** — „Vielen Dank für Ihre Anfrage bei FRANKONIA Sicherheitsdienst",
  Richtung `EMAIL`, Zeitstempel `19:59:26` gegen `19:59:23` für den Eingang. HubSpots
  BCC-Zuordnung ist asynchron, hier war sie sofort da.
- ✅ **UND DIE GEGENPROBE, die wichtiger ist als der Nachweis selbst:** in den 30 Minuten
  um den Test herum gibt es im **ganzen Portal genau EINE** neue E-Mail-Aktivität — die
  Bestätigungsmail. Die interne Meldung hat **nichts** erzeugt, und für
  `info@frankonia-sicherheit.de` **existiert nicht einmal ein Kontakt**. Die Entscheidung
  aus 25.3 hält also nicht nur in der Theorie.
- ⚠️⚠️ **DIE ADRESSE HÄTTE MAN NICHT ERRATEN KÖNNEN, und das ist der beste Beleg für die
  Regel:** der Host ist **`bcc.eu1.hubspot.com`**, nicht `bcc.hubspot.com`. Die
  naheliegende Ableitung `<PortalId>@bcc.hubspot.com` hätte **jede** Bestätigungsmail an
  einen falschen Host geschickt — Rückläufer bei jeder Anfrage, und niemand hätte es an
  der Website gemerkt. Bei einem Portal mit EU-Datenhosting gehört die Region in den
  Hostnamen.

### 25.5 Was dabei am Rand aufgefallen ist, an den vCards

Beim Nachsehen wegen einer anderen Frage: die acht vCards liegen vollständig im Projekt
(`assets/documents/`), sechs davon mit eingebettetem Porträt — es muss nichts aus
WordPress nachgereicht werden. Drei Punkte stammen aus den Originalen und sind **nicht**
geändert:

| | Fund |
|---|---|
| ⚠️ | **Alexander Jäger hat auf einer seiner zwei Karten kein Foto.** Die Sicherheitsdienst-vCard trägt das Porträt, die Werkschutz-vCard nicht — obwohl **beide Seiten dasselbe Porträtbild zeigen** und bei Steffen Walde beide Karten das byteidentische Foto tragen. Wer Jägers Werkschutz-Kontakt speichert, bekommt ihn ohne Bild. |
| ⚠️ | **Alle acht haben ein Leerzeichen vor dem Namen** (`FN:` → ` Alexander Jäger`). Im Adressbuch heißt der Kontakt dann mit führendem Leerzeichen, was in manchen Apps auch die Sortierung verschiebt. |
| • | Das Base64-Foto steht in einer Zeile von bis zu 7.800 Zeichen; der Standard will es gefaltet. Apple, Google und Outlook lesen es trotzdem — nur zur Kenntnis. |

Die ersten zwei sind kleine, rückholbare Änderungen; sie warten auf ein Ja, weil es
Kontaktdaten sind.

---

## 26 — Die vier offenen Entscheidungen sind beantwortet, und der Push ist raus

### 26.1 Deine Antworten, und was sie geändert haben: nichts

Kunde, 28.08.2026: *„Leistungsauswahl drin lassen aber optional, ja Rolle darf
überschreiben, flach passt, drei Titelbilder für Ratgeber haben wir ja."*

**Alle vier bestätigen den gebauten Zustand — es war keine Zeile zu ändern.** Das ist
kein Zufall, sondern das Ergebnis davon, dass jede dieser Stellen als Frage
dokumentiert war statt als stille Annahme:

| Entscheidung | Zustand |
|---|---|
| Leistungsauswahl bleibt, optional | ✅ war schon optional — erster Eintrag „Bitte auswählen (optional)", der Server verlangt das Feld nicht |
| Rolle darf einen Bewerber überschreiben | ✅ genau so gebaut (Abschnitt 23.1), der Grenzfall ist dort notiert |
| Karten-Strip bleibt flach im Tablet | ✅ nichts zu tun; der gestapelte Look wäre die Änderung gewesen |
| Ratgeber-Titelbilder | ✅ **liegen alle sieben schon** — geprüft: 7 Artikel, 21 Bilddateien (768/1408 WebP + JPEG), kein reservierter Rahmen mehr übrig |

⚠️ Der letzte Punkt stand fälschlich noch auf meiner Aufgabenliste. Die Bilder kamen mit
der Ratgeber-Runde am 26.08.; die Liste war seitdem veraltet.

### 26.2 Push ist raus — und der Deploy braucht noch dich

**47 Commits nach `origin/main` gepusht** (`1b312dc..575d500`). Vorflug davor: 69 Seiten,
0 unaufgelöste Platzhalter, **67/67 Tests**, Weiterleitungsprüfung **0 Probleme**, und
der Produktionsbuild ohne `.env` trägt den **echten** Turnstile-Sitekey
(`0x4AAAAAAE…`) — der Testschlüssel steckt nur im lokalen Build des Dev-Servers.

⚠️⚠️ **DANN ZWEI FUNDE, DIE DEN „FINAL TESTEN"-SCHRITT VORERST BLOCKIEREN. Beide sind
Konto-Sachen, kein Code:**

**1. `frankonia-sicherheit.de` wird nicht von Vercel bedient.** Der Antwortkopf sagt
`Server: nginx`, die Vercel-Domain sagt `Server: Vercel`. Und `/testformular/` liefert
dort **200**, obwohl es nach unserer Konfiguration ein gewollter 404 ist. Die
Live-Domain zeigt also weiterhin auf das alte Hosting — **„live gehen" heißt: die Domain
auf Vercel zeigen lassen.** Das ist der eigentliche Umschalter und er liegt bei dir
(DNS bzw. Domain im Vercel-Projekt).

**2. `frankonia-website.vercel.app` hat sich nach dem Push drei Minuten lang nicht
bewegt** — und der Stand dort ist **älter als der 24.08.**: keine Personenseiten
(`/linktree/`, `/steffen-walde-werkschutz/` → 404), kein Turnstile, kein Cookiebot, kein
Formular-Endpoint, keine Ratgeber-Titelbilder. Nur `/impressum/` existiert.
**Das heißt: dieses Projekt baut nicht aus diesem Repository** — oder nicht aus
`main`, oder der Build schlägt fehl, oder die Adresse zeigt auf eine alte Bereitstellung.

⚠️ **Von hier aus nicht prüfbar:** es gibt kein Vercel-CLI auf diesem Rechner und keinen
Zugang zum Dashboard. Was dort nachzusehen ist, in dieser Reihenfolge:
1. **Deployments** — gibt es einen Build für `575d500`? Läuft er, ist er fehlgeschlagen,
   oder fehlt er ganz?
2. **Settings → Git** — hängt das Projekt an `maquesymonds/frankonia-website`, Branch
   `main`, und ist „Automatic deployments" an?
3. **Settings → Environment Variables** — die **13** Namen aus `.env.example`. Ohne
   `TURNSTILE_SECRET_KEY` lehnt der Endpoint live **jede** Anfrage ab; ohne
   `HUBSPOT_BCC_ADDRESS` fehlt die Mail in der Aktivitätenliste.

Die Konfiguration selbst ist in Ordnung: `buildCommand: node build.js`,
`outputDirectory: dist`, `engines.node >= 18`, `api/` für die Funktion, 75
Weiterleitungen, 6 Kopfzeilen-Regeln. Ein Build daraus muss laufen — er läuft lokal in
0,15 s.

### 26.3 Ein Nebenfund vom alten Hosting, der die „-2" endlich erklärt

Beim Prüfen der Live-Adressen: **`/christoph-bauer-sicherheitsdienst/` liefert auf dem
alten Hosting `301` auf die Startseite** — der Pfad ohne „-2" war dort also schon belegt.
**Genau deshalb hat WordPress die Zahl angehängt.** Nach dem Umschalten spielt das keine
Rolle: unsere Konfiguration hat für diesen Pfad keine Regel, es wird die echte Seite
ausgeliefert. Aber es beantwortet die Frage, warum die Adresse überhaupt so hieß.

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
| ☐ | `/bryan-van-wey-security/` | 301 | `/bryan-van-wey-werkschutz/` | 1 |
| ☐ | `/christoph-bauer-sicherheitsdienst-2/` | 301 | `/christoph-bauer-sicherheitsdienst/` | 1 |
| ☐ | `/morelo-werkschutz-team-2/` | 301 | `/morelo-werkschutz-team/` | 1 |
| ☐ | die drei zugehörigen `/assets/documents/….vcf` | 301 | neuer vCard-Pfad | 1 |
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
| ☐ | Bestätigungsmail in HubSpot protokollieren | `HUBSPOT_BCC_ADDRESS` | **eingebaut am 27.08.** (Abschnitt 25). Die Adresse steht in den HubSpot-Einstellungen (dort nach „BCC" suchen) und wird bewusst nicht abgeleitet. Ohne sie steht in der Aktivitätenliste nur die Notiz |
| ✅ | Marketing-Einwilligung | `HUBSPOT_SUBSCRIPTION_ID_ONE_TO_ONE`, `BREVO_MARKETING_LIST_ID` | **eingebaut am 26.08.** (Abschnitt 18). Die beiden IDs liest du mit den zwei Setup-Skripten aus; ohne sie wird nichts geraten |
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

⚠️ **Nachtrag 26.08.:** dazu kommt Abschnitt 18 — Telefon als Pflichtfeld, die
nachweisbare Verknüpfung der HubSpot-Eigenschaftsfelder, die Marketing-Einwilligung
in HubSpot und Brevo, die Doppelklick-Sperre und zwei behobene Überläufe. Was davon
noch bei dir liegt, steht dort in einer eigenen Tabelle; die Kurzfassung ist:
Zugangsdaten in `.env.local` und in Vercel eintragen, Consent Mode im
Cookiebot-Konto aktivieren, die beiden Setup-Skripte einmal laufen lassen.

⚠️ **Nachtrag 26.08., zweite Runde:** Abschnitt 22 — Ratgeber ans Menüende, das
Vertrauensband auf den neun Personenseiten, und „Sonstiges" / „Kein Interesse"
werden jetzt überschrieben. **Damit ist von den beiden Fragen, die ich offen
gelassen hatte, nur noch eine offen:** ob der Karten-Strip bei Tablet-Breite den
gestapelten Desktop-Look bekommen soll (22.4 — er läuft dort mechanisch, meine
erste Gegenbehauptung war ein Messfehler).

⚠️ **Nachtrag 26.08., dritte Runde:** Abschnitt 23 — die Rolle „(Potenzieller)
Kunde", kein Firmenobjekt mehr, der Hinweis im Nachrichtenfeld und Karriere heißt
wieder Jobs. **Zwei Entscheidungen liegen daraus bei dir:** ob die Leistungsauswahl
bleibt (23.4 — meine Empfehlung: ja, sie ist schon freiwillig) und ob die Rolle einen
Bewerber mit gepflegtem Status überschreiben darf (23.1).

Erledigt seit der ersten Fassung dieses Berichts: der Tippfehler in den zwei vCards
(Abschnitt 13), die Google-Profil-URL fürs Badge (Abschnitt 13), die zehn Seiten ohne
Sitemap-Eintrag (Abschnitte 14 und 15) und die Überarbeitung der
Datenschutzerklärung samt des Fehlers, der diese Seite ohne Fußbereich ausgeliefert
hat (Abschnitt 16). Beim Datenschutz sind noch zwei Fragen offen, die nur du oder
dein Anwalt beantworten kann — sie stehen dort in einer eigenen Tabelle.

---

# Nachtrag 01.09.2026 — die Runde nach der QA-Übergabe

Alles hier steht **hinter** dem Abschlussbericht darüber. Es sind die Punkte, die
nach dem 29-Aufgaben-Durchgang aus eigenen Meldungen entstanden sind, jeder mit
einer Zeile, was gemessen wurde. Die abhakbare Fassung liegt als eigene Seite
bereit — dort nach Seiten geordnet, mit den Adressen zum Anklicken.

## N1 — Das Scrollen zum Formular ruckelte, und die Ursache war nicht das Formular

**Behoben.** Längster Frame **535 → 99 ms**, gemessen an derselben Stelle mit
demselben Aufnahmeverfahren. Der Boden ohne jede Kachel liegt bei 89 ms — der Rest
ist also nicht mehr diese Sektion.

⚠️⚠️ **Zwei eigene Vermutungen waren falsch und wurden durch Messung verworfen:**
die Filter der Übergänge waren es nicht (ohne sie war es *schlechter*), und die
Übergänge der Kacheln auch nicht. Es war **Layerize** — der Compositor baut seinen
Ebenenbaum neu, und die Kosten wachsen mit der Zahl der Ebenenkandidaten. Es gab
Kacheln für **alle** Nähte, ab dem ersten Bild, auf jeder Seite.

Was geändert wurde: `js/pixel-transition.js` baut die Kacheln einer Naht erst,
wenn sie sich dem Blickfeld nähert (`IntersectionObserver`, 300 px Vorlauf), und
räumt sie beim Verlassen wieder ab. `css/components.css` bekam eine Zeile —
`contain: paint` auf dem Nahtband — und die war der größte einzelne Gewinn.
⚠️ `contain: strict` ist **schlechter**, nicht besser: die Größeneinschränkung
schickt das Band durch einen anderen Layoutweg.

## N2 — Die schwarzen Ecken an den Fotos der Serviceseiten

**Behoben, und die Ursache war ein Radius.** Ein abgerundeter Beschnitt zeigt in
den Ecken, was *hinter* dem Foto liegt — bei einem hellen Foto auf schwarzem Grund
sind das vier schwarze Zwickel. Gemessen über alle Serviceseiten: **kein Foto trägt
mehr einen Radius**, ein Bau-Tor hält das fest.

Der letzte übersehene Fall war `.service-flow__frame` — die sechs Fotos im
Leistungsumfang auf `/werkschutz/`.

## N3 — Die Kanten der Hero-Fotos laufen aus, statt zu schneiden

**Umgesetzt, auf neun Seiten.** Zwei Verläufe (senkrecht und waagerecht) auf einem
Pseudo-Element, die **Mitte von 16 % bis 84 % vollständig frei** — das Motiv dieser
Fotos ist jeweils eine Person in der Bildmitte, eine Vignette über das ganze Bild
würde sie mitverdunkeln.

⚠️ **`/objektschutz/` war nicht der Ausreißer**, entgegen meiner ersten Annahme:
gemessen haben **neun von zehn** Hero-Fotos helle Ränder. Nur `werkschutz` ist eine
Nachtaufnahme und verschmilzt von sich aus. Die Regel gilt deshalb für alle zehn —
sonst wäre objektschutz nachher der einzige mit weicher Kante.

## N4 — Das Portrait von Alexander Jäger endet in einem Verlauf

**Umgesetzt, auf sechs Seiten.** Die untere Bildkante geht in den Hintergrund über
statt abgeschnitten zu enden. Als **eine geteilte Regel** mit drei Selektoren, nicht
als Kopie — die doppelte Fassung in `css/page-ueber-uns.css` wurde dabei gelöscht.

## N5 — Die HubSpot-Notiz trägt die ganze Anfrage

**Umgesetzt.** Vorher stand nur die Nachricht darin; jetzt Name, Unternehmen,
E-Mail, Telefon und die gewählte Leistung. Leere Felder erzeugen **keine** leeren
Zeilen. Zwei neue Tests halten das fest (69 gesamt).

## N6 — Die Rechtsgrundlage am Kontakt war leer

**Umgesetzt**, und der Fund dahinter ist der Grund, warum es zweimal falsch war:
**HubSpot hat zwei verschiedene Felder mit zwei verschiedenen Wortschätzen.** Das
Abonnement nimmt Schlüssel einer Aufzählung (`PERFORMANCE_OF_CONTRACT`), die
Kontakteigenschaft `hs_legal_basis` nimmt Klartext (`Performance of a contract`)
und ist eine Mehrfachauswahl (mit Semikolon getrennt). Gesetzt wird jetzt beides,
mit dem Zusatz „Freely given consent from contact" bei gesetztem Marketing-Haken.

⚠️ **Eine vorhandene Grundlage wird nie überschrieben** — das ist Absicht.

⚠️⚠️ **OFFEN UND DEINE ENTSCHEIDUNG:** am Testkontakt zeigen die *Abonnements*
weiter `LEGITIMATE_INTEREST_PQL`. HubSpots Abonnement-Endpunkt antwortet bei einem
bereits eingetragenen Kontakt mit 400 und ändert die Grundlage nicht mehr. Eine
fremde Rechtsgrundlage zu überschreiben ist eine rechtliche Entscheidung, keine
technische — deshalb habe ich es nicht getan.

## N7 — Der Datenschutz-Haken wird bei Fehlern mitmarkiert

**Behoben, in allen 44 Formularen.** ⚠️⚠️ **Der Fehler lag nicht im JavaScript:**
das setzte `aria-invalid` auf dem Haken korrekt, nachgemessen. Es fehlte allein die
Darstellung — die Fehlerregel setzte einen `border-bottom`, und **eine native
Checkbox rendert Rahmenangaben in Chrome gar nicht**. Die Meldung sprach also von
markierten Feldern, und genau das eine Feld war unmarkiert.

Jetzt ein `outline` samt Abstand: liegt außerhalb des Kastens, wird von der nativen
Darstellung nicht geschluckt und verschiebt die Checkbox nicht im Layout. Nicht nur
Farbe (WCAG 1.4.1) — der hinzugefügte Ring ist eine Form, die vorher nicht da war.
**Durch drei echte Absendevorgänge geprüft**, nicht durch Lesen der Regeln.

## N8 — Der E-Mail-Hinweis auf `/danke-bewerbung/`

**Umgesetzt**, in zweiter Fassung: erst drei gestapelte zentrierte Absätze
(zu Recht abgelehnt), jetzt ein Block mit Briefumschlag, linksbündig, in derselben
Spaltengeometrie wie die Schritte darunter.

⚠️ **Für dich im HubSpot-Portal:** dort steht „falls du die E-Mail nicht sofort
*finden*" — richtig ist „findest". Auf unserer Seite ist es korrigiert; sonst sagen
die zwei Stellen dasselbe unterschiedlich.

## N9 — Das Favicon, dritte und letzte Fassung

**Umgestellt: die `favicon.ico` trägt die Laterne, die App-Icons die volle Marke.**

⚠️⚠️ **Die Ursache ist gerechnet, nicht geraten.** Die vollständige Bildmarke ist
**1,692:1 — sie ist breit.** In einem Kreis vom Durchmesser d darf ihre Breite
höchstens 0,861 d sein, dann ist ihre Höhe 0,509 d. Die Laterne, das einzige
wiedererkennbare Element, nimmt nur die linken 26 % der Breite ein — bei einem
32-px-Tab sind das **sieben Pixel**, und der Schwung daneben verjüngt sich auf eine
Haarlinie. Gerendert und angesehen: ein blaues Kringel, kein Zeichen.

Die Laterne allein ist 0,520:1 und füllt den Kreis auf **0,79 d Höhe** — mehr als
das Dreifache.

⚠️ **Die Grenze liegt bei der Dateiart, nicht bei einer Pixelzahl:** 16, 32 und 48
sind die drei Bilder *in* der `favicon.ico`, also das Zeichen in der Browserleiste.
Die müssen untereinander dasselbe zeigen, sonst wechselt das Icon beim Wechsel der
Bildschirmdichte sein Motiv. 192 und 512 sind App-Icons und werden groß gezeigt —
dort trägt die volle Marke, samt Schwung.

⚠️ Damit ist auch die vorige Meldung beantwortet („ein Teil vom Logo
abgeschnitten"): dort war die Laterne die **einzige** Fassung, in allen Größen.
Jetzt sieht man die vollständige Marke überall, wo genug Pixel dafür da sind — im
Lesezeichen, in der Verlaufsliste, auf dem Startbildschirm.

⚠️⚠️ **BEIM PRÜFEN: Chrome hält Favicons hartnäckig im Zwischenspeicher.** Ein
gewöhnliches Neuladen zeigt oft das alte Zeichen. Tab schließen und neu öffnen, oder
`/favicon.ico` einmal direkt aufrufen.

Zwei Rückwege stehen im Generator, falls das Bild doch anders sein soll:
`ICONS_OHNE_SCHWUNG=1` nimmt für **alle** Größen die Laterne, `ICONS_NUR_VOLL=1` für
alle die volle Marke.

## N10 — Startfreigabe-Liste nach Seiten geordnet

Die Prüfliste ist neu geordnet: statt zwölf thematischer Blöcke jetzt **dreizehn
Seitenkarten**, jede mit ihrer echten Adresse als Link im Kopf und den Prüfpunkten
darunter. Fünf davon sind Pflicht; das Schild oben zählt nur diese. Die gesetzten
Häkchen bleiben beim Umbau erhalten.

## N11 — Die CSP lässt die Marketing-Tags durch, die GTM nachlädt

**Umgesetzt** (Kunde, 01.09.: „die Tags sind auf jeden Fall gewollt", nach einem
Netzwerk-Mitschnitt mit acht `blocked:csp`-Zeilen nach dem Cookie-Akzeptieren).

⚠️⚠️ **WARUM „GTM IST EINGEBAUT" NICHT GENÜGT, und das ist die ganze Erklärung:**
eine CSP fragt nicht, *wer* ein Skript laden will, sondern *woher* es kommt. Der Tag
Manager läuft korrekt — er steht als `d.frankonia-sicherheit.de` in `script-src`.
Aber GTM ist ein **Lader**: er holt zur Laufzeit weitere Skripte von *anderen* Hosts
in die Seite, und die standen nicht in der Liste. Das ist kein Fehler, sondern der
Sinn der Regel: wäre „GTM ist erlaubt" gleichbedeutend mit „alles, was GTM nachlädt,
ist erlaubt", könnte man mit einem Tag Manager jede CSP aushebeln. **Jeder
Vendor-Host muss einzeln eingetragen werden.**

⚠️ **„Ist ja nur die Testdomain" trifft hier NICHT zu, und das war die eigentliche
Korrektur.** Von den sechs Header-Blöcken in `vercel.json` hat genau **einer** eine
Domain-Bedingung — der `X-Robots-Tag` mit `has: host = *.vercel.app`. Die CSP steht
im Block **ohne** Bedingung (`source: /(.*)`) und gilt auf der Zieldomain identisch.

**Die vier Vendoren sind nicht geraten, sondern aus dem Container gelesen:** der
Web-Container `GTM-NWLGMFJN` ist öffentlich abrufbar (461 KB), und die Hosts stehen
darin:

| Blockiert war | Host | Ist |
|---|---|---|
| `fbevents.js` | `connect.facebook.net` | Meta-Pixel |
| `clientParamBuilder.bundle.js` | `unpkg.com` | Meta-CAPI-Parameter-Builder |
| `v1.js` | `stapecdn.com/udc/` | Stape User-Data-Collector |
| `PUT_YOUR_VALUE_HERE/?random=…` | `googleads.g.doubleclick.net` | Google Ads Remarketing |

**19 Hosts ergänzt**, auf vier Direktiven verteilt und **einzeln statt als
Platzhalter** — die Liste ist die einzige Bremse, die bleibt, wenn ein Tag Manager
beliebige Hosts nachladen kann. Die CSP wächst von 1017 auf 1534 Zeichen; die
Patch-Datei prüft gegen, dass **keine Direktive und kein alter Host verloren** geht.

⚠️ **Der Pixel ist ein 1x1-GIF und der Conversion-Ping ein Bild** — deshalb reicht
`script-src` nicht: `www.facebook.com` und die Google-Hosts müssen auch in `img-src`
und `connect-src`, und `td.doubleclick.net` in `frame-src` für den Cookie-Abgleich.
`www.google.de` ist dabei, weil der Conversion-Ping auf die **Länderdomain** geht.

⚠️⚠️ **UND EIN ECHTER KONFIGURATIONSFEHLER, DER NICHT AM CODE LIEGT:** die drei
Zeilen `PUT_YOUR_VALUE_HERE/?random=…&fst=…` sind ein **Google-Ads-Remarketing-Tag
ohne eingetragene Conversion-ID**. Das Muster
`/pagead/viewthroughconversion/<ID>/?random=&fst=` gehört Google Ads, und wo die ID
stehen müsste, steht der Platzhaltertext. Im Container kommt `viewthroughconversion`
**einmal** vor, eine `AW-`-ID **null Mal**. **Das würde auch ohne CSP nicht
funktionieren** — es feuert dreimal pro Seitenaufruf gegen eine Adresse, die es nicht
gibt. Zu setzen im GTM-Konto, nicht hier.

⚠️ **Zwei Dinge für den Datenschutz, gemessen:** Facebook ist in
`/datenschutz/` genannt (4 Stellen), **Stape und unpkg sind es nicht** (0 Stellen).
Solange die Skripte blockiert waren, war das folgenlos; ab jetzt laufen sie.
⚠️ Und die unpkg-URL trägt **keine Versionsnummer**
(`meta-capi-param-builder-clientjs/dist/…`), liefert also immer die neueste Fassung —
das ist eine Fremdquelle im Skriptpfad der Website. Eine Pinnung wäre besser, sie
steht aber in der Tag-Konfiguration von Stape, nicht bei uns.

⚠️ **Das Bau-Tor für Fremd-Hosts kann das nicht auffangen:** es prüft die Hosts im
**ausgelieferten Markup**, und diese vier stehen dort nicht — GTM fügt sie erst zur
Laufzeit ein.

### N11.1 Nachgemessen auf der Testdomain — **blockiert: 0**

Mit echtem Chrome, frischem Profil, Cookiebot auf „Alle zulassen" geklickt
(`consent: {statistics: true, marketing: true, method: "explicit"}`), dann neu
geladen und gescrollt. Alle vier Vendoren antworten mit **200**:

| Aufruf | Status |
|---|---|
| `connect.facebook.net/en_US/fbevents.js` | 200 |
| `connect.facebook.net/signals/config/25932606063047409` | 200 — die Pixel-ID ist echt |
| `stapecdn.com/udc/v1.js` | 200 |
| `unpkg.com/meta-capi-param-builder-clientjs@1.3.1/…` | 200 |
| `www.google.de/pagead/1p-conversion/PUT_YOUR_VALUE_HERE/` | 200 |
| `www.google.de/pagead/1p-user-list/PUT_YOUR_VALUE_HERE/` | 200, zweimal |

⚠️⚠️ **DER CONVERSION-PING GEHT AUF `www.google.de`, NICHT auf
`googleads.g.doubleclick.net`** — also war der Eintrag der Länderdomain in
`img-src` nicht Vorsicht, sondern die Bedingung dafür, dass es überhaupt
durchkommt. Ohne ihn wäre Google Ads weiter blockiert gewesen.

⚠️⚠️ **UND DIE GOOGLE-AUFRUFE ANTWORTEN MIT 200 TROTZ PLATZHALTER-ID.** Google
nimmt den Aufruf an und verwirft ihn still. Das heißt: **in der Konsole ist jetzt
alles grün, und es kommen trotzdem keine Daten an.** Der fehlende Wert ist damit
schwerer zu bemerken als vorher, nicht leichter — vorher stand wenigstens
`blocked:csp` daneben.

⚠️ **Die Tags feuern erst beim NÄCHSTEN Seitenaufruf, nicht im Moment des
Akzeptierens.** Ein erster Messlauf ohne Reload zeigte 0 Vendor-Aufrufe und 0
Blockaden — was wie „funktioniert nicht" aussieht und nur „noch nicht gefeuert"
heißt. Beim Prüfen von Hand also: akzeptieren, **dann neu laden**, dann in den
Netzwerk-Tab.

⚠️ Zur unpkg-URL: die Anfrage geht ohne Version raus und wird auf **@1.3.1**
umgeleitet. Es gibt also eine feste Fassung — aber der Redirect zeigt immer auf die
neueste, die Pinnung fehlt weiter in der Tag-Konfiguration.

---

## N12 — Der Grund, warum mehrere Korrekturen bei dir nicht ankamen: eine Stunde Cache

**Gemeldet** 02.09.2026 sinngemäß mehrfach: „das hatte ich jetzt mehrfach korrigieren
lassen", „entweder hast du es nicht gepusht oder es hat nicht aktualisiert oder es
fehlt alles".

**Es war gepusht. Der Browser hat nur nicht gefragt.** `vercel.json` gibt mit:

| | Cache |
|---|---|
| HTML | `max-age=0, must-revalidate` → bei jedem Aufruf neu |
| `/css/*`, `/js/*` | `max-age=3600` → **eine Stunde** |
| `/assets/*` | `max-age=86400` → **ein ganzer Tag** |

Die Dateinamen hatten keine Version. Ein Neuladen holte also die neue Seite, aber das
alte Aussehen und das alte Verhalten — und bei Bildern bis zu 24 Stunden lang. Genau
deshalb hast du Menühöhe, Kartenhöhe, FAQ-Sprung und die schwarzen Bildecken
weiterhin gesehen, obwohl sie behoben waren.

⚠️⚠️ **Und deshalb waren meine Messungen grün:** ich messe mit frischem Browserprofil,
also mit leerem Cache. Ich habe eine Stunde in der Zukunft geprüft.

**Behoben:** `build.js` hängt als letzten Bauschritt eine achtstellige
Inhaltssignatur an jede eigene Adresse — `/css/app.css?v=ba0a6e20`. Ändert sich der
Inhalt, ändert sich die Adresse, also **muss** der Browser neu holen; ändert sich
nichts, bleibt die Datei im Cache. Der Nutzen bleibt, der Versatz verschwindet.

**Gemessen:** 60 CSS/JS-Dateien und 299 Bilder/Icons/Schriften signiert, 968 Adressen
in 70 Seiten, auch in `srcset` (Deskriptor und Komma bleiben erhalten) und in `url()`
im CSS. Keine unsignierte eigene Adresse mehr, keine Doppelsignatur.

**Für dich heißt das:** ab jetzt siehst du eine Korrektur, sobald der Vercel-Bau durch
ist. Kein Hard-Reload mehr nötig.

---

## N13 — Handymenü: nicht scrollbar, und die Ursache lag nicht im Menü

**Gemeldet** 01. und 02.09.2026: „das mobile Menü ist nicht scrollbar … auch wenn ich
Leistungen aufklappe, werde ich Kontakt nie klicken können".

**Du hattest recht, und meine Messung war trotzdem grün — das ist der lehrreiche
Teil.** Programmatisch scrollte die Schublade einwandfrei: Inhalt 1474 px in einem
844-px-Kasten, 630 px Scrollweg, Kontakt und CTA danach im Bild. Mit dem Finger ging
nichts. Das ist die Signatur einer **abgefangenen Geste**.

**Ursache:** beim Öffnen wird `lenis.stop()` gerufen, damit die Seite hinter dem Menü
stillsteht. Im eingebundenen Lenis steht aber:

```js
if (this.isStopped || this.isLocked) { preventDefault(); return }
```

Das trifft **jede** Wischgeste, die am Fenster ankommt — und ein `preventDefault` auf
`touchmove` bricht das native Scrollen der ganzen Geste ab, auch das des inneren
Elements mit `overflow-y: auto`.

**Behoben** mit `data-lenis-prevent` am Navigationselement. Lenis prüft das Attribut
auf dem gesamten Ereignispfad und steigt aus, **bevor** es `preventDefault` ruft: die
Seite bleibt gestoppt, das Menü scrollt nativ.

**Gemessen** mit echter Touchgeste, A/B: ohne Attribut `defaultPrevented = true`, mit
Attribut `false`, Lenis in beiden Fällen gestoppt.

---

## N14 — Systemkarten auf dem Handy: mein Fehler vom Vortag, zurückgenommen

**Gemeldet** 02.09.2026 mit zwei Screenshots: „die Sektion ist echt aktuell noch
katastrophal … die Headline muss zu sehen sein und nicht vom Header verdeckt werden …
macht doch lieber das Bild kleiner."

**Vier Befunde, drei davon behoben und einer bewusst anders gelöst:**

1. **Mein `min-height` vom 01.09. hat eine bestehende Bremse ausgeschaltet.** Der
   Block hatte `max-height: 52svh`, damit Überschrift, Zähler, Karte und
   Fortschrittslinie zusammen in **eine** Bildschirmhöhe passen — die Bühne ist
   `100svh` mit `overflow: hidden`. Bei gleichem Rang gewinnt in CSS `min-height`
   gegen `max-height`. Gemessen: Karte **488 px statt 439**, alles darunter
   abgeschnitten. Zurückgenommen.

2. **Die Höhe gehört jetzt der Bühne, nicht der Karte.** Der Streifen nimmt den Rest,
   die Karte füllt ihn aus. Damit kann per Konstruktion nichts abgeschnitten werden —
   auf jeder Bildschirmhöhe, ohne nachzupflegenden Zahlenwert.

3. **Kopfzeile freigehalten.** Vorher stand die Eyebrow „UNSER SYSTEM" hinter dem
   Header und die erste Zeile der Überschrift hatte **10 px** Luft (Oberkante 86,
   Header-Unterkante 76). Eine Zeile mehr Umbruch und sie verschwindet — genau dein
   Screenshot.

4. **Unter 560 px Bildschirmhöhe wird nicht mehr geklebt.** In der Querlage
   (844 × 390) bleiben für die Karte **103 px**, der Text braucht **167** — das passt
   physisch nicht. Dort bleibt der native Wisch-Streifen, dein eigener
   Rückfallvorschlag.

**Gegen das Ruckeln:** der Scrub schrieb `scrollLeft` bei **jedem** Update, auch bei
einem hundertstel Pixel. Jedes Schreiben löst am Streifen ein `scroll`-Ereignis aus,
an dem der Zähler hängt, der `scrollWidth` neu liest — ein erzwungenes Neuberechnen
des Layouts pro Bild, ohne sichtbare Bewegung. Jetzt auf ganze Pixel gerundet und
übersprungen, wenn der Wert gleich bleibt; die beiden Layout-Werte werden gemerkt.

**Gemessen** an zehn Bildschirmgrößen (320 × 568 bis 1024 × 768): Überschrift nie
verdeckt, Karte immer in der Bühne, letzter Aufzählungspunkt immer sichtbar, kein
horizontaler Seitenscroll. Durchgescrollt bei 390 × 844: **alle sechs Karten**
erreichen die Mitte, Zähler 01 → 06.

---

## N15 — Hero-Foto auf dem Handy: Text teilweise nicht lesbar, auf genau einer Seite

**Gemeldet** 02.09.2026 zum Prüfpunkt „Foto als Hintergrund des Hero, Text darauf gut
lesbar": „teilweise ist der Text nicht optimal lesbar. aber nur teilweise — da müsste
man den Verlauf vereinzelt dunkler machen an bestimmten Stellen."

**Gemessen** auf allen zwölf Foto-Heroes bei 390 px: hellster Bildpunkt im Rechteck
jedes Textelements, Text ausgeblendet, ein Frame gewartet, WhatsApp-Knopf und
Cookie-Dialog mit entfernt. Ergebnis — **nur `/werkschutz/`, und nur teilweise:**

| Element | schlechtester Punkt | Anteil zu heller Fläche |
|---|---|---|
| H1 | 1,10:1 | **6,8 %** |
| Lede | 1,88:1 | **2,7 %** |
| Badge | 1,11:1 | 1,0 % |
| Tics, Brotkrume | 15–19:1 | 0 % |

Die **elf anderen** Foto-Heroes: 0 % zu helle Fläche.

**Ursache — eine Spezifitätsfalle, kein zu schwacher Wert.** Der Telefon-Verlauf gilt
für `.service-hero__bg::after` (0,1,0). `/werkschutz/` ist ein Bleed-Hero, und
`.service-hero--bleed .service-hero__bg::after` (0,2,0) gewinnt unabhängig von Media
Query und Dateireihenfolge — hatte aber **keine Telefon-Fassung**. Auf dem Handy galt
also der Desktop-Verlauf von **links nach rechts**, der bei 100 % Breite auf `0`
ausläuft. Am Telefon spannt der Text über die ganze Breite: jedes **Zeilenende** lag
auf ungewaschenem Foto, genau dort, wo die beleuchteten Fenster des Nachtfotos liegen,
die der Aufheller `brightness(1.34)` auf fast Weiß zieht.

**Behoben** mit einer senkrechten Telefon-Waschung für den Bleed-Hero, in denselben
Werten wie die Regel darüber — eine Entscheidung in zwei Heroes statt zwei ähnlichen.

**Gemessen nachher:** Badge 1,11 → **7,00:1**, H1 1,10 → **6,53:1**, Lede 1,88 →
**7,32:1**, alle Flächenanteile 0 %. `/leistungen/` (der zweite Bleed-Hero) messt
**unverändert** 7,27–12,41:1 — die Waschung kostet dort nichts. Über alle zwölf
Foto-Heroes: **0 von 82 Messungen unter der Schwelle.**

---

## N16 — Zwei Meldungen ohne Defekt, und ein Messfehler von mir

**Ortsumriss auf den Einsatzgebietsseiten.** Du hast zweimal gemeldet, er fehle auf
dem Handy. Meine erste Antwort war falsch begründet — ich hatte eine **Kombiseite**
geprüft, nicht eine Stadtseite. Nachgemessen **live und mit Prüfung der Seitenidentität**
auf `/sicherheitsdienst-wuerzburg/`, `-nuernberg/`, `-bamberg/` und
`/brandwache-wuerzburg/`: der Umriss **ist** da, `display: flex`, **350 × 160 px** bei
390 px Breite, ein Pfad, bei y = 195.

⚠️ **Aber er ist optisch schwach, und das ist messbar:** die Tinte einer hochformatigen
Stadt wie Würzburg füllt nur **109 × 160 px** (die Höhenbremse bindet), der Strich
rendert **0,98 px** gegen **3,5 px** auf dem Desktop, die Füllung liegt bei 24 %.
Größer geht kaum: gemessen bleiben bei 390 px nur **35 px** Luft, bevor der CTA unter
die Falz rutscht. Offen als Gestaltungsfrage, nicht als Fehler.

**Drittes Social-Bild.** Vorhanden und geladen: `social-veranstaltungsschutz.webp`,
480 × 850, Karte 335 × 527, der Streifen ist nativ bis zum Ende scrollbar
(`overflow-x: auto`, `scroll-snap: x mandatory`, 694 px Scrollweg). Dein Screenshot
war mitten in der Wischbewegung.

⚠️⚠️ **Zwei meiner Messreihen waren ungültig, und die Ursache ist eine Falle für
später:** `scripts/dev-server.js` liefert für **jeden** unbekannten Pfad die
**Startseite** aus — gemessen 175 KB und der Titel der Startseite statt 65 KB für
`/sicherheitsdienst-wuerzburg/`. Dadurch kamen „der Umriss fehlt" und „identische
Kontrastwerte auf zwei Seiten" zustande. **`location.pathname` reicht als Prüfung
nicht**: der ist richtig, während der Inhalt falsch ist. Eine Sonde muss **Titel oder
H1** vergleichen. Beides ist jetzt eingebaut.

---

## N17 — Offen: die Ecken der Dienstleistungsbilder

**Gemessen an den Dateien selbst** (Eckpixel gegen einen Referenzpunkt 26 px diagonal
innen): **neun von zehn** Bildern in `assets/images/` tragen eine **eingebackene
Rundung mit schwarzen Ecken** — 51 bis 62 px in einer 820 px breiten Datei, auf dem
Schirm rund **30 px**. Weil der Seitengrund ebenfalls schwarz ist, liest sich das als
„das Bild hat runde Ecken".

`objektschutz` ist die **einzige Datei ohne** eingebackene Rundung. Der CSS-Radius ist
**0 px** — die Ecken sollen also eckig sein.

**Das ist der Grund, warum du das mehrfach korrigieren lassen musstest:** die
Korrektur an `objektschutz` war da, aber `/assets/` wird einen ganzen Tag gecacht
(siehe N12). Das ist jetzt behoben.

⚠️ **Was fehlt, ist eine Entscheidung, nicht eine Messung:** entweder alle zehn
**eckig** (dann müssen die neun Dateien neu ausgegeben werden, und die schwarze Ecke
lässt sich nicht wiederherstellen — es wäre ein Beschnitt) oder alle zehn **rund**
(dann genügt ein CSS-Radius, der die eingebackene Rundung sauber überdeckt, und
`objektschutz` zieht mit). Zwei Zeilen Arbeit gegen zehn neue Bilddateien.

---

## N18 — Favicon: nicht mehr geraten, sondern das Original ausgemessen

**Gemeldet** dreimal, zuletzt 02.09.2026 mit dem Favicon der Originalseite als
Vorgabe: „der schwung / die fahne ist immernoch abgeschnitten — anbei wie es
aktuell in der originalen webseite ist, bitte genau so umsetzen."

**Statt weiter zu interpretieren, das Original heruntergeladen und gezählt**
(`frankonia-sicherheit.de/wp-content/uploads/fbrfg/`):

| | Original 96 px | jetzt bei uns |
|---|---|---|
| transparent | 83,5 % | 88 % |
| Weiß | **0 %** | **0 %** |
| Tinte | 88 × 54 | 87 × 52 |
| Anteil der Breite | 91,7 % | 90,6 % |
| Ränder l/r/o/u | 3/5/21/21 | 4/5/22/22 |

⚠️⚠️ **Das kehrt zwei Entscheidungen um, und beide waren meine Auslegung deiner
Worte, nicht deine Vorgabe:** der weiße **Kreis** („runder weißer kreis mit logo
drin") und die Beschränkung auf die **Laterne**, mit der ich das Abschneiden
umgehen wollte. Genau dieses Weglassen des Schwungs war der Fehler, den du
dreimal gemeldet hast.

⚠️ **Die App-Icons behalten ausdrücklich einen deckenden Grund.** Ein
transparentes Symbol wird auf einem iOS-Startbildschirm zur schwarzen Kachel.
Das Original macht diesen Fehler; wir übernehmen ihn nicht.

---

## N19 — Turnstile: warum ich es fälschlich als behoben gemeldet habe

**Gemeldet** dreimal, zuletzt sehr deutlich: „cloudflare geht auch noch zur
seite raus … zu behaupten, dass du es gelöst hast und dann ist es nicht gelöst
geht nicht!!!! sowas musst du immer prüfen."

**Berechtigt, und der Grund ist eine Grenze meiner Prüfumgebung:
Turnstile lädt im Headless-Chrome nicht.** Live gemessen auf vier Seiten und
drei Breiten: der Container ist da (262–364 px), aber **`iframe: 0`**. Ich
konnte die tatsächliche Breite des Widgets also **nie** messen — jede Regel
dazu war eine Rechnung ohne Kontrolle.

**Deshalb jetzt keine weitere Vorab-Regel, sondern eine Nachkontrolle im
Browser:** nach dem Rendern wird die Breite des von Cloudflare eingesetzten
iframe gegen den Container gemessen; ragt es hinaus und ist es nicht schon
`compact`, wird das Widget entfernt und als `compact` neu gerendert.

**Verifiziert mit einem untergeschobenen, absichtlich zu breiten Widget:**

| Breite | Ablauf | Ergebnis |
|---|---|---|
| 430 px | `render flexible` → `remove` → `render compact` | 130 in 332, kein Überhang |
| 1440 px | `render flexible` | 480 in 517, **Wache greift nicht ein** |

⚠️ Kein Neurendern, wenn schon ein Token da ist — das würde dich aus dem
Formular werfen. Die Prüfkette ist endlich (rund 3 s).

⚠️ **`overflow: hidden` wäre die falsche Lösung**: das Widget ist ein
Bedienelement, und ein abgeschnittenes Bedienelement ist schlimmer als ein
überbreites.

---

## N20 — `/#einsatzgebiete` führte auf den Seitenanfang

Der Anker existierte nicht. Geprüft: die Startseite hat `pain-hook`,
`our-system`, `uniforms` und `sicherheitsanalyse` — **kein
`einsatzgebiete`**. Der Link aus der Prüfliste landete deshalb oben auf der
Startseite. Die interaktive Kartensektion trägt jetzt
`id="einsatzgebiete"`.

---

## N21 — Interventionsdienst trägt den Zusatz „(Raum Bamberg)"

Auf `/leistungen/` in der Karte und im `ItemList`-Eintrag, genau wie der
Revierdienst.

**Geprüft, dass die Aussage nichts widerspricht** (statt sie zu bestätigen):
auf den Stadtseiten außer Bamberg erscheinen **beide** Dienste ausschließlich
im **Nav**, im **Footer** und in der **Auswahlliste des Formulars** — nirgends
als dort angebotene Leistung.

⚠️ **Ein Randfall bleibt und ist eine Entscheidung, keine Messung:** die
Auswahlliste des Formulars bietet auf jeder Stadtseite auch
„Interventionsdienst" und „Revier- & Schließdienst" an. Wer in Würzburg das
Formular ausfüllt, kann sie also anfragen. Das Formular ist geteilt; eine
seitenabhängige Liste wäre eine eigene Änderung.

---

## N22 — Zwei Meldungen, die nicht reproduzieren, mit dem Beweis

**Überbreite auf `/einsatzgebiete/` bei 728 px.** Live gemessen bei 700, 728,
768 und 834 px: **kein Seitenscroll**, `scrollWidth` exakt gleich der
Fensterbreite. Bei genau 728 × 1191 gerendert liest der Lede vollständig
(„…in ganz Franken, **mit** / festen Teams vor Ort bei jedem laufenden
Auftrag."), die Karte liegt vollständig innen. Die einzigen hinausragenden
Elemente sind das Honeypot-Feld bei `left: -9999` und die Seam-Kacheln, beide
von ihrem Band geclippt und beide bereits dokumentiert.
→ Das „‖" rechts im DevTools-Bild ist der **Ziehgriff des DevTools-Panels**;
das Panel war schmaler als die emulierte Breite. Am Code wurde nichts geändert.

**Die Gesamtkarte ist nur auf der Startseite.** Das ist richtig gemessen — und
**der Fehler steckt in meiner Prüfliste**, die sie unter beiden Links
aufführte. Der Bestand:

| Seite | Karte |
|---|---|
| `/` | interaktive Leaflet-Karte + 16 Ortsschaltflächen |
| `/einsatzgebiete/` | **gezeichnete Franken-Karte mit allen 15 Orten**, animiert, ohne Klick |
| die 26 Stadt-/Kombiseiten | der Umriss der jeweiligen Stadt |
| `/kontakt/` | Leaflet-Karte des Sitzes |

Die Prüfliste ist korrigiert. **Offen als Wunsch, nicht als Fehler:** ob die
interaktive Karte zusätzlich auf `/einsatzgebiete/` soll — dort liegt bereits
eine vollständige Karte, zwei Karten derselben Sache auf einer Seite wären
eine bewusste Entscheidung.

---

## N23 — Offen: `/jobs/` hat kein Turnstile

Beim Messen der Widgets aufgefallen und **nicht eigenmächtig geändert**:
`dist/jobs/index.html` enthält **0** Turnstile-Vorkommen, während alle 44
anderen Formularseiten eines haben. Das Bewerbungsformular läuft also ohne
Bot-Schutz.

Ob das so gewollt ist (eine Bewerbung ist kein Lead) oder ein Versäumnis, ist
eine Entscheidung — technisch wäre es dasselbe Feld wie überall.

---

## N24 — Systemkarten: der Tablet-Scrollfluss war sprunghaft, und die Ursache war Spezifität

**Gemeldet** 02.09.2026: „da ist die horizontale Scrollanimation noch nicht ganz
klar … ich hab's in den DevTools auf Tablet-Höhe nachgeschaut, da gibt's keinen
sauberen Scrollflow."

**Gemessen**, Zuwachs des Streifens je Schritt Seitenscroll:

| Breite | Verlauf von `scrollLeft` | Stillstände |
|---|---|---|
| 390 | `0 11 119 226 334 441 …` | **0** |
| 834 | `0 0 0 **742** 742 742 742 **1485** …` | **13** |

Der Streifen rastete also von Karte zu Karte statt dem Scroll zu folgen.

⚠️⚠️ **Die Ursache ist Spezifität bei Gleichstand.** Die Tablet-Regel in
`swipe-carousel.css` ist `[data-swipe-carousel][data-swipe-tablet]` — **(0,2,0)**,
genau so viel wie `.system-story--pinned .system-story__stack` — und
`system-story.css` lädt **vorher**. Bei Gleichstand gewinnt die spätere, also
blieb `scroll-snap-type: x mandatory` stehen. Unter 768 px ist die Wisch-Regel
nur `[data-swipe-carousel]` (0,1,0), **deshalb war das Handy die ganze Zeit
flüssig und nur das Tablet nicht.**

⚠️ Der Kommentar an dieser Regel behauptete, zwei Klassen würden
`[data-swipe-carousel]` „unabhängig von der Dateireihenfolge" schlagen. Das galt
nur gegen die Telefon-Regel — der Kommentar ist korrigiert.

**Nachher gemessen:** 834 px `0 105 306 507 708 909 …`, Verhältnis 1:1, **null
Stillstände**; 768 px genauso; 390 px unverändert.

---

## N25 — Beide Eingaben aktiv: senkrecht scrollen **und** waagerecht wischen

**Gewünscht** 02.09.2026: „ich würde mir auch wünschen, dass es ebenso horizontal
scrollt, wenn man horizontal swipt — dass beides aktiv ist."

Vorher war waagerechtes Wischen bewusst aus (`overflow-x: hidden`), und das
Argument war richtig: Finger und Scrub schreiben sonst beide `scrollLeft` und
zittern gegeneinander.

**Gelöst nicht durch „beide gleichzeitig", sondern durch Abwechseln:**
1. Berührt der Finger den Streifen, hört der Scrub auf zu schreiben.
2. Der Finger bewegt ihn nativ, mit der Physik des Browsers.
3. Beim Loslassen wird die **Seitenposition** auf den erreichten Stand
   nachgezogen — ohne das würde die nächste senkrechte Bewegung den Streifen
   zurückreißen.

**Gemessen:** Finger unten → Streifen +700 px, Scrub schreibt **nicht** zurück;
Loslassen → Seite von 7975 auf **8675** nachgezogen, Streifen behält 2533.

---

## N26 — Die drei Social-Videos: es war kein fehlendes Bild, es war der 3D-Ring

**Gemeldet** mehrfach: „das social video / bild ist nach wie vor nicht da … das
muss von der user experience wie unten bei ‚das sagen unsere kunden' sein: erst
Video 1, dann Video 2, dann Video 3, immer auf Swipe."

**Gemessen bei 1440:** vordere Karte **272 px**, die beiden hinteren je
**117 px** — weil `js/social-carousel.js` sie ab 1024 px auf einem Ring
perspektivisch zurückdreht. Von Video 2 und 3 war nur ein Streifen zu sehen.
Auf dem Telefon war die Reihe die ganze Zeit vollständig (3 × 335 px, alle Bilder
geladen, „03 / 03") — deshalb konnte ich es zweimal nicht finden.

**Der Ring ist raus.** Ohne `data-social-carousel` initialisiert das Skript nie,
`.is-carousel` wird nie gesetzt, und damit greift der `@media`-Block dazu auch
nicht: ab 1024 px stehen die drei Karten als Reihe nebeneinander (gemessen
**200 / 232 / 200**), darunter bleibt der Wisch-Streifen. Genau das Verhalten der
Kundenstimmen. Skript und CSS bleiben im Projekt — der Ring ist einen
Attributnamen weit entfernt.

---

## N27 — Turnstile: dritte Stufe, damit es nicht mehr an einer Annahme hängt

**Gemeldet** ein viertes Mal: „cloudflare geht auch noch zur seite raus … scheint
so, als lässt sich's nicht ändern."

**Zwei Dinge sind jetzt gemessen, die es vorher nicht waren:**
- **Warum das Widget in meiner Umgebung nie geladen hat:** das Skript hängt hinter
  der Cookie-Zustimmung, und alle meine Sonden haben den Dialog **entfernt statt
  ihn anzunehmen**. Mit Klick auf „Alle zulassen" ist `window.turnstile` da.
- **Unsere Wahl ist bei 320/360/390 `compact`** — 130 px, und der schmalste
  gemessene Container ist 222 px. Compact kann dort nicht überlaufen.

Das iframe rendert hier trotzdem nicht, ich kann die echte Breite also weiter
nicht ausmessen. **Deshalb eine Stufe, die unabhängig von jeder Annahme greift:**
ragt selbst `compact` hinaus, wird es maßstäblich verkleinert, bis es passt, und
die Höhe mitkorrigiert.

**Verifiziert mit einem untergeschobenen Widget**, das absichtlich zu breit
rendert:

| Fall | Ablauf | Ergebnis |
|---|---|---|
| 430 px, 480 px breit | `flexible` → `remove` → `compact` | 130 in 332 |
| 390 px, compact 400 px breit | Skalierung | **0,73×**, 292 in 292, Überlauf **0** |
| 1440 px, 480 px breit | `flexible` | 480 in 517, Wache greift **nicht** ein |

⚠️ `overflow: hidden` wäre die falsche Lösung: ein abgeschnittenes Bedienelement
ist schlimmer als ein überbreites.

---

## N28 — Die klickbare Karte steht jetzt auch auf `/einsatzgebiete/`

⚠️⚠️ **Der naheliegende Weg war falsch, und das ist gemessen:** `page-home.css`
einfach mitzuladen verändert den **Hero** der Seite — Badge und Lede gingen bei
1440 von 459 auf 538 px, bei 390 von 342 auf 350.

Also die **44 `.coverage*`-Blöcke** in eine gemeinsame `css/coverage-map.css`
herausgelöst, in unveränderter Reihenfolge und mit ihren `@media`-Blöcken;
eingebunden **vor** der jeweiligen Seiten-CSS — dasselbe Muster wie
`lead-form.css` und `testimonials.css`.

**Die Extraktion ist beweisbar folgenlos:** die Startseite A/B verglichen,
**611 / 672 / 788 Elemente** bei 390 / 768 / 1440 px, 21 berechnete Eigenschaften
je Element — **null Abweichungen**.

Auf `/einsatzgebiete/` hat die Einfügung genau **eine** Auswirkung, und die ist
richtig: `eg-cities` verliert seine Seam-Reservierung (`padding-top` 296 → 96),
weil jetzt die Kartensektion hinter dem Seam steht und die Kachelbahn reserviert
(gemessen 216 px bei 390, 296 bei 1440, H2 exakt an der Kante, weiter 4 Seams).
Alle übrigen Sektionen unverändert.

⚠️ **Zwei Karten auf einer Seite ist Absicht:** die Silhouette im Hero ist
gezeichnet, animiert und `aria-hidden` — ein Plakat. Die Kachelkarte darunter ist
das Werkzeug.

⚠️ Überschrift und Lede sind **wörtlich** die der Startseite, nicht neu
geschrieben.

---

## N29 — Turnstile: die Schwelle war der Fehler, nicht das Widget

**Gemeldet** 02.09.2026 mit Foto des engen Felds: „jetzt ist es immer so eng.
Das darf nur, wenn der Screen kleiner als 360 Pixel ist."

**Berechtigt.** Meine Schwelle lag bei **310 px Containerbreite** — gemessen ist
der Innenraum der Formularkarte aber:

| Bildschirm | 320 | 360 | 390 | 430 | 1440 |
|---|---|---|---|---|---|
| Container | 222 | 262 | 292 | 332 | 517 |

Bei 310 fiel die Entscheidung also bei **360 und 390** auf `compact` — auf jedem
gängigen Telefon. Genau das war zu sehen.

**Zwei Änderungen, beide gerechnet, nicht geraten:**
1. **Schwelle 240 statt 310.** „flexible" hat 300 px Minimum und wird von der
   Nachkontrolle eingepasst: 292 → Faktor 0,97, 262 → 0,87, 222 → 0,74. Bis etwa
   0,85 ist das nicht zu sehen. 240/300 = 0,80 ist die Grenze, und 240 Container
   entspricht rund **340 px Bildschirm** — genau die Grenze, die der Kunde
   genannt hat.
2. **Erst einpassen, dann verkleinern.** Vorher wurde bei jedem Überhang sofort
   auf `compact` gewechselt; weil „flexible" immer ein paar Pixel übersteht, hieß
   das: immer eng. Jetzt wird bis Faktor 0,85 nur eingepasst und die breite
   Fassung behalten.

**Gemessen mit untergeschobenem Widget** (flexible = 300 px, compact = 150 px, wie
Cloudflare dokumentiert):

| Bildschirm | Container | Kette | Skalierung | Überhang |
|---|---|---|---|---|
| 320 | 222 | `compact` | — | **0** |
| 340 | 242 | `flexible` → `remove` → `compact` | — | **0** |
| **360** | 262 | `flexible` | 0,87 | **0** |
| **390** | 292 | `flexible` | 0,97 | **0** |
| 430 | 332 | `flexible` | — | **0** |
| 1440 | 517 | `flexible` | — | **0** |

⚠️ Bei 768 px ist der Container nur **258 px** (schmaler als bei 430) — das ist
die Kartenbreite in dieser Bandbreite von `/angebot/`, nicht ein Fehler der
Kette; dort wird auf 0,86 eingepasst. Wenn dieser Wert je störend auffällt, ist
die Karte die Stelle, nicht Turnstile.

---

## N30 — Die Karte steht jetzt UNTER der Städteliste

Kundenwunsch: „die klickbare Karte bitte unter ‚Sicherheitsdienst in Ihrer Stadt
in Franken' da drunter machen, nicht oben drüber." Reihenfolge jetzt: Hero →
Seam → **Städteliste** → **Karte** → Seam → Warum.

✅ **Dabei ein Folgefehler gefunden und behoben, der ohne Messung geblieben
wäre:** `.coverage` trug die Reservierung der Kachelbahn **fest eingebaut**
(`padding-top: calc(var(--space-9) + 200px)`, „keep in sync"). Auf der Startseite
richtig, weil dort ein Seam davorsteht — an der neuen Stelle hinter einer hellen
Sektion waren es **296 px Leerraum** zwischen Liste und Karte. Die Reservierung
folgt jetzt dem Seam (`.pixel-seam + .coverage`), nicht der Sektion.
Gemessen: Karte 96 px, `eg-cities` behält 216/296, weiter 4 Seams, kein
Seitenscroll, ein `<h1>`. Startseite unverändert 216/296.

---

## N31 — Die Lehren stehen jetzt im Repository, nicht nur im Protokoll

Auf Wunsch („die ganzen Learnings ins Repository pushen und dort das System
optimieren, dass die Learnings eingebettet sind"):

- **[CLAUDE.md](../CLAUDE.md) hat einen neuen Abschnitt ganz oben**, vor der
  Chronologie: *„Lehren aus dem Abnahmedurchgang — zuerst lesen"*. Zehn Punkte,
  jeder mit der Zahl, die ihn belegt: der Cache-Versatz, Spezifität bei
  Gleichstand, `overflow-y` hebt `overflow-x`, Lenis im gestoppten Zustand,
  Safaris SVG-Maße, `min-height` gegen `max-height`, der Entwicklungsserver mit
  seiner Startseite, fremde Skripte hinter der Zustimmung, Selbstkorrektur statt
  Annahme, und ein Effekt, der als fehlender Inhalt gelesen wird.
- **Zwei neue Bautore**, damit zwei dieser Lehren nicht mehr von Aufmerksamkeit
  abhängen: *SVG mit beiden Achsen auto tragen width und height* und
  *Signaturen an allen eigenen Adressen*.

⚠️⚠️ **Und eine Lehre über Prüfungen selbst, teuer und frisch:** die erste
Fassung des Signaturen-Tors hat **nichts geprüft**. Ihr Muster verlangte, dass
die Adresse auf `.css` endet — eine signierte endet auf `?v=…`. Das Tor war grün,
ohne je etwas zu finden. Aufgefallen allein durch die **Gegenprobe**: eine
Signatur von Hand kaputt machen und sehen, ob der Bau fällt. Er fiel nicht.
Nach der Korrektur: `FEHLER … /css/app.css?X=… — Bau abgebrochen`, und ohne
Manipulation wieder grün.
**Jede neue Prüfung braucht diese Gegenprobe, sonst ist sie eine Behauptung.**

---

# Durchgang 03.09.2026 — die letzten Änderungen vor dem Livegang

Elf Meldungen, in der Reihenfolge, in der sie kamen. Zwei davon haben sich als
falsche Voraussetzung erwiesen und eine habe ich auf das falsche Element
angewandt — beides steht unten so drin.

## N32 — Social-Bereich: Ring auf dem Desktop zurück, Streifen auf Telefon und Tablett behalten

**Gemeldet** „auf Desktop hast du jetzt die Funktion verkackt … kannst Du die
Funktionalität wie auf dem Desktop wie vorher beibehalten, dass es dieses sich
drehende Wheel ist, und die aktuelle Darstellung auf mobil auch behalten?"

**Berechtigt, und der Fehler war meiner.** Am 02.09. war gemeldet, das dritte
Social-Video fehle. Ursache war der 3D-Ring, der die Karten 2 und 3
perspektivisch wegdreht — gemessen bei 1440: vordere Karte 272 px, die beiden
hinteren je 117 px. Ich habe daraufhin `data-social-carousel` **entfernt** und
damit nicht das Telefon reparaert, sondern den Desktop mitgenommen: der Ring
hängt an einer `matchMedia(min-width: 1024px)` **im Skript** und war auf dem
Telefon nie aktiv. Das Problem lag allein im Streifen unterhalb 1024.

⇒ **Ein Attribut, das nach Breite schaltet, darf man nicht global ziehen, um
ein Problem in EINEM Band zu lösen.** Nur das Attribut zurück, kein Umbau —
die drei Bänder waren schon getrennt.

| Breite | Modus | Karten | Seitenscroll |
|---|---|---|---|
| 390 | Wisch-Streifen | 3 × 335×527, alle erreichbar | 0 |
| 834 | Wisch-Streifen | 3 × 389×728, alle erreichbar | 0 |
| 1440 | 3D-Ring | vorn 272×520, hinten 2 × 117×508 | 0 |
| 1920 | 3D-Ring | gleiche Werte | 0 |

Zug 300 px nach rechts dreht in beiden Desktop-Breiten weiter: Karte 3 kommt mit
272×520 nach vorn. Rückfallebenen geprüft, nicht angenommen: mit
`prefers-reduced-motion` bei 1440 kein Ring, flache Reihe 200/232/200; im
ausgelieferten Markup 0× `is-carousel`, drei Bilder, alle Bildunterschriften.

---

## N33 — Case-Study-Pitch: die Überschrift hatte GAR KEINEN Abstand zum Absatz

**Gemeldet** zu allen drei Case Studies: Zeilenabstand minimal zu groß, „und der
Abstand zum Text darunter passt vor allem überhaupt nicht" — nachgemeldet, dass
es Telefon und Tablett genauso betrifft.

**Gemessen war es kein zu kleiner Abstand, sondern keiner:** `h2
margin-bottom: 0`, `p margin-top: 0`, sichtbare Lücke **0 px** bei 390 / 834 /
1440 / 1920.

**Ursache** Überall sonst liefert das Chassis diesen Abstand über
`.section__intro > p { margin-top: var(--space-4) }`. Der Pitch-Absatz liegt
aber nicht in einem `.section__intro`, sondern als nackter `<p>` in
`.cs-pitch__inner` — es gab nichts, was greifen konnte. **Ein Abstand, der aus
einer Wrapper-Klasse kommt, fehlt lautlos, sobald das Markup den Wrapper nicht
benutzt.**

Zeilenhöhe 1.25 → **1.12** (bei 60 px waren das 75 px pro Zeile, was über vier
Zeilen auseinanderfällt), Abstand **32 px**. Werte durch Ansehen gewählt, nicht
gerechnet — 1.15/24 px und 1.08/32 px lagen daneben. Ein Wert trägt beide Enden
des Clamps: 67 px bei 60 px Schrift, 36 px bei 32 px auf dem Telefon, darum ohne
Media Query.

Gemessen danach: Lücke 32 px und Faktor 1.12 in allen **12 Kombinationen**
(3 Seiten × 4 Breiten). Zusätzlich 18 Seiten nach `h2` mit direkt anschließendem
Absatz abgesucht — **keine weitere Stelle**.

⚠️ **Offen, deine Entscheidung:** du hast überlegt, am Ende dieser Seiten ein
Formular zu setzen statt auf die Leistungsseite zu verweisen, und selbst gesagt
„man kann's aber auch so lassen". Nicht geändert.

---

## N34 — Google-Bewertung: 4,7 bei 100+ Bewertungen

**Bestätigt** „mittlerweile haben wir über hundert Google Bewertungen und 4,7
Sterne — überall aktualisieren."

⚠️ **`rating.count` steckte in ZWEI Rollen, und „100+" verträgt nur eine
davon:** sichtbarer Text (43 Dateien) und JSON-LD `reviewCount`, wo schema.org
eine reine Zahl verlangt — ein „100+" macht die Auszeichnung ungültig. Darum
vier Werte für zwei Rollen:

| Rolle | Werte |
|---|---|
| Anzeige | `value` 4,7 · `count` **100+** |
| Schema | `valueSchema` 4.7 · `countSchema` **100** |
| Zähler-Animation | `countTo` 4.7 |

Dabei **28× hartes `"ratingValue": "4.7"`** und **3× hartes `"reviewCount": "97"`**
aus dem Markup in Tokens überführt: die nächste Aktualisierung ist eine Zeile in
`content/values.json` statt 31 Stellen.

Gemessen am gebauten Ergebnis: 70 Seiten, **52 sichtbare „100+"**, kein Rest-97,
keine unaufgelösten Tokens, 28 Seiten mit `aggregateRating` und **alle
JSON-LD-Blöcke parsen**, `reviewCount` überall genau `100`. Und geprüft, dass der
längere Text die schmale Pille nicht sprengt: 7 Seiten × 320/390/834/1440, kein
Überstand, kein Umbruch, bei 320 px 254 px breit.

⚠️ Ein **laufender** Abruf der Bewertungen aus Google (dein Wunsch für
mittelfristig) ist etwas anderes: dafür braucht es die Places API mit Schlüssel,
Abrechnung und einem Einwilligungs-Gate. Nicht gebaut.

---

## N35 — Rechenbeispiele: jede Zahl war richtig, die Addition ging trotzdem nicht auf

**Gemeldet** „Es darf kein Rechenfehler in den Beispielen drin sein" und „die
Rechenbeispiele müssen in sich passend sein".

Nachgerechnet mit 24,50–32 €, 23 % Nacht, 26 % Sonntag. Jede Zahl war **einzeln**
richtig gerundet (höchstens 25 € neben dem exakten Wert) — und weil jede für
sich gerundet war, ging die Addition nicht auf:

| Beispiel | angegebene Zahlen addiert | angegebene Summe | Differenz |
|---|---|---|---|
| Nachtposten | 4.250 + 1.000 = 5.250 | 5.200 | **50 €** |
| Wochenende | 1.450 + 170 + 153 = 1.773 | 1.800 | **27 €** |
| Brandwache | 1.750 + 170 = 1.920 | 1.950 | **30 €** |

Der Text lautet „Basis ≈ X, plus ≈ Y. Ergebnis: grob Z" und lädt damit
ausdrücklich zum Nachrechnen ein.

**Jetzt alles auf 10 € gerundet, und die Summe ist die EXAKTE Summe der
gerundeten Teile.** Jede angegebene Addition geht auf, keine Zahl ist mehr als
5 € vom exakten Wert entfernt:

```
4.240 +   970 = 5.210        5.540 + 1.270 = 6.810
1.470 + 170 + 150 = 1.790    1.920 + 220 + 200 = 2.340
1.760 +   170 = 1.930        2.300 +   220 = 2.520
```

⚠️ **Zweideutigkeit in der Rechnung mitbehoben:** „Basis 173 × 24,50-32 €" — ein
Bindestrich neben einem Dezimalkomma liest sich in einer Multiplikation wie
„minus". `values.json` schreibt für Fließtext ohnehin min/bis/max vor, und du
sprichst es selbst als „24,50 bis 32". Steht jetzt als **„173 × 24,50 bis
32 €"**. Nur die zwei Multiplikationen; die sieben Vorkommen in der Preistabelle
behalten die Kurzform, die du festgelegt hast.

**Neues Bautor (Nr. 19)** rechnet Basis, Zuschläge und Summe aus Satz, Stunden
und Prozenten nach und bricht den Bau ab, wenn eine Zahl mehr als 10 € neben dem
exakten Wert liegt, nicht auf 10 gerundet ist oder die Summe nicht die Summe der
angegebenen Teile ist. **Mit Gegenprobe belegt:** Summe um 10 € verstellt → Bau
bricht ab; eine Zahl weggezogen → bricht ab; 153 statt 150 → bricht ab;
Original → grün.

---

## N36 — Preisangaben durchgängig 24,50–32 €

**Entschieden** „Das muss zwingend konsistent sein, also Kosten immer zwischen
24,50 und 32 Euro."

Es waren **fünf** Stellen, nicht die drei aus meiner Meldung:

| Seite | stand da | widersprach |
|---|---|---|
| `/baustellenbewachung/` | zwischen 25 und 35 Euro | der Preis-Box derselben Seite |
| `/empfangsdienst/` | zwischen 25 und 38 Euro | dito |
| `/veranstaltungsschutz/` | zwischen 25 und 38 Euro | dito |

Alle drei standen so in den Entwürfen und waren am 16.08. als Widerspruch
gemeldet, nicht eigenmächtig geändert. Jetzt aus einer Quelle.

Dazu zwei FAQ-Antworten mit eigenen Summen:

| Seite | vorher | jetzt |
|---|---|---|
| `/baustellenbewachung-wuerzburg/` | 1.500–2.100 € | **1.790–2.340 €** |
| `/objektschutz-erlangen/` | 4.000–6.000 € | **5.210–6.810 €** |

⚠️ Das ist keine freie Angleichung: es sind **wortgleich dieselben Szenarien**,
die der Kostenratgeber rechnet — „Fr 18 Uhr – Mo 6 Uhr" mit 60 Stunden und „ein
Posten, Mo–Fr, rund 173 Stunden im Monat". Sie zeigen jetzt die Werte dieser
Rechnung und folgen künftigen Preisrunden mit. Jede Antwort steht zweimal
(sichtbar und im JSON-LD), beide Stellen bekamen denselben Token —
**258 Antwortpaare auf 49 Seiten byte-identisch**.

---

## N37 — Die Haarlinie der Links sitzt am Text, nicht an der Klickfläche

**Gemeldet** zum Link „Zur Brandwache": „sieht irgendwie nicht so geil aus."

**Ein Folgefehler von mir.** Der Anker hat für die Touch-Fläche `min-height:
44px` bekommen, und ein `border-bottom` sitzt am **Boden** dieser Box. Der Text
ist ~24 px hoch und mittig, also schwebte die blaue Linie rund **10 px unter**
dem Wort und lief zusätzlich unter dem Pfeil durch — eine abgelöste Linie, kein
Unterstrich.

Jetzt trägt der Anker die Klickfläche und **das Label die Linie**, in 81 Links
auf 36 Seiten.

⚠️ Der erste Durchgang hat **26 Links nicht erfasst**, weil das Muster
`class="service-link"` exakt verlangte und diese mehrklassig sind
(`service-link city-callout__link`). Aufgefallen nur durch die Messung, nicht
beim Lesen.

Gemessen auf 7 Seiten in dunklem, hellem und inline-Kontext: Anker 0 px, Label
1 px, Pfeil 22 px frei; mit **echtem Zeiger** Text und Linie auf weiß plus
45-Grad-Drehung des Pfeils.

---

## N38 — Mobiles Menü: gleichmäßige Zeilen und Trenner

**Gemeldet** „im mobile Menü sind die Striche und die Abstände nicht ganz sauber
sortiert oder?"

**Berechtigt und messbar:** die erste Zeile war **44 px** hoch, alle anderen
**61 px**. Ursache waren zwei Abstandssysteme übereinander — ein `gap` der Liste
**plus** `border-top` und `padding-top` auf `li + li`. Die erste Zeile bekam
beides nicht und stand 17 px flacher.

Jetzt trägt der Abstand die Zeile selbst und der Trenner sitzt ohne eigenen
Abstand dazwischen. `gap: 0` ist Teil des Trenners, kein Aufräumen: mit gap
schwebt die Haarlinie in der Mitte von 24 px Nichts.

Gemessen bei 390 × 844 / 667 / 568: Zeilen **63 / 64 / 64 / 64 …**, Schritte
konstant, Trenner nur zwischen den Zeilen.

⚠️⚠️ **Und ich bin in die Falle gelaufen, vor der der Kommentar an genau dieser
Stelle warnt:** `gap` und `padding-block` zuerst in den **ersten**
`max-width:1399.98`-Block geschrieben, wo beide verlieren — eine Media Query
bringt keine Spezifität, und `.site-nav__list` ist weiter unten als Basisregel
erneut deklariert. Gemessen nach dem ersten Versuch: gap blieb 24 px, Polster
blieb 4 px, also hatte beides **keine Wirkung**.

---

## N39 — Linktree: nur noch sechs Ziele. Und: auf das falsche Element angewandt

⚠️⚠️ **Mein Fehler, offen benannt.** „Bei meinem Linktree würde ich die Anpassung
so vornehmen, dass nicht jede einzelne Leistung aufgeführt ist" habe ich auf das
**mobile Menü** bezogen, weil die vorige Meldung eine Aufnahme des Drawers war.
Gemeint war die Seite `/linktree/` — die es gibt und die genau die acht
Einzelleistungen listete. **Dass die Beschreibung auf den Drawer passte, macht
sie nicht zur Anweisung für den Drawer.**

**Zurückgenommen** (war nicht bestellt): das Ausblenden der Untermenüs im
Drawer, `initMobileSubmenu()` wiederhergestellt, der zweite CTA im Drawer.
Leistungen und Einsatzgebiete klappen dort wieder auf, alle 22 Ziele sind wieder
direkt erreichbar. **Geblieben** ist N38, der eigentliche gemeldete Punkt.

**Umgesetzt auf `/linktree/`:**

| vorher | jetzt |
|---|---|
| Alle Leistungen + **8 Einzelleistungen** | Alle Leistungen im Überblick |
| Referenzen · Über uns · Jobs · Kontakt | Referenzen · Über uns · Jobs · Kontakt |
| Startseite fehlte | **Startseite ganz oben** |
| zwei Gruppen-Labels | eine Liste |
| 16 Links in `<main>` | **9** (davon einer der Breadcrumb) |

Die Gruppen-Labels sind mitgegangen: mit einem Eintrag unter „Leistungen" trug
eine Überschrift nichts. Die dadurch tote Regel `.linktree__label` ist gelöscht.

⚠️ **Kein interner Link verloren:** die acht Leistungsseiten stehen im Footer
**jeder** Seite, auch dieser — am gebauten Footer geprüft, nicht angenommen.
⚠️ Einsatzgebiete und Ratgeber stehen nicht in der Liste; genannt waren
Referenzen, Über uns, Jobs, Kontakt. Zwei `<li>`, wenn sie dazu sollen.
⚠️ „Startseite" steht jetzt zweimal auf der Seite: im Breadcrumb und als erstes
Ziel. Der Breadcrumb ist Bestand; auf einer Seite, die aus einer Social-Bio
geöffnet wird, wäre er entbehrlich. Nicht eigenmächtig entfernt.

---

## N40 — Stadtumriss beschriftet. Und zwei Voraussetzungen, die nicht zutreffen

**Gewünscht** „nicht nur den Landkreis-Umriss zeichnen, sondern in einem leicht
kräftigeren Blau auch den Stadtumriss, inklusive einer kleinen Beschriftung
Stadt Würzburg, Stadt Nürnberg …"

⚠️⚠️ **Drei Teile, zwei davon treffen nicht zu — gemessen, nicht vermutet:**

**a) Gezeichnet wird schon heute die STADT, nicht der Landkreis.** Belegt an den
Quelldaten: `forchheim.geojson` trägt „Forchheim, Landkreis Forchheim, Bayern,
91301", ist also die Stadt **im** Kreis.

**b) „Landkreis-Umriss mit der Stadt darin" ist für neun der zehn Städte
geometrisch nicht möglich.** Bei Nominatim abgefragt (einmalig, 1 Anfrage/s,
echter User-Agent):

| Städte | admin_level | Bedeutung |
|---|---|---|
| Bamberg, Nürnberg, Würzburg, Erlangen, Fürth, Bayreuth, Schweinfurt, Coburg, Ansbach | **6** | **kreisfrei** |
| Forchheim | 8 | Kreisstadt im Landkreis Forchheim |

Der gleichnamige „Landkreis Würzburg" ist ein **Ring daneben**, der die Stadt
ausdrücklich ausschließt. Nur bei Forchheim liegt die Stadt tatsächlich im Kreis.
⚠️ Und die Namen wären nicht die erwarteten: zu Nürnberg gehört „Nürnberger
Land", zu Erlangen „Erlangen-Höchstadt".

**c) Das „leicht kräftigere Blau wie auf der interaktiven Map" ist schon da:**
beide nutzen `#3D9AD3`, im Hero sogar stärker gefüllt (0,16 gegen 0,12).

**Umgesetzt ist der Teil, der eindeutig und richtig ist: die Beschriftung**, auf
allen 26 Stadt- und Kombiseiten.

⚠️ Als HTML unter dem Umriss, **nicht als `<text>` im SVG**, und das ist eine
Messung: der Umriss wird je Breite zwischen **109 px** (Würzburg, Telefon) und
**445 px** gerendert, der viewBox ist immer 1000 Einheiten breit. Eine
Schriftgröße in viewBox-Einheiten skaliert also mit — auf dem Telefon unlesbar,
auf dem Desktop riesig.
⚠️ Erster Versuch mit `var(--font-size-xs)` war 16 px: **dieser Token existiert
nicht**, der Wert fiel auf die geerbten 16 px zurück. Jetzt 12 px.

Gemessen auf 6 Seiten × 390 / 834 / 1440: Label überall vorhanden, 12 px,
`#3D9AD3`, 12 px Abstand, **0 px vom Mittelpunkt**, kein Überstand. Und der
Umriss ist durch das neue Spalten-Layout **nicht geschrumpft** — 576 px hoch bei
1440 und 160 bei 390, genau die dokumentierten Werte.

Beide Generatoren erzeugen das Label mit, damit ein erneuter Lauf es nicht
wieder entfernt.

**Deine Entscheidung:** wenn ein zweiter Umriss dazu soll, wären die
sinnvollen Varianten (1) der umgebende Landkreis als Ring, wo es einen
gleichnamigen gibt, oder (2) die Stadt im Umriss von **Franken**, den es im
Projekt schon gibt. Beides ist machbar; „Stadt im gleichnamigen Landkreis" ist
es nicht.

---

## N41 — Einwilligung live getestet, drei Phasen

**Gefragt** „Beim Datenschutz kannst Du das irgendwie live testen, selbst
nachprüfen?" — ja. Jede Phase in einem **frischen Browserprofil** (das
Äquivalent zum privaten Fenster), und nach dem Klick **neu geladen**, weil die
Tags erst beim nächsten Seitenaufruf feuern.

| Phase | Cookiebot-Einwilligung | Cookies | angesprochene Fremd-Hosts |
|---|---|---|---|
| **1. vorher**, Dialog offen | alles `false` | **keine** | nur Cookiebot + Turnstile |
| **2. nach Ablehnen** + Neuladen | alles `false` | nur `CookieConsent` | nur Cookiebot + Turnstile |
| **3. nach Alle zulassen** + Neuladen | alles `true` | `CookieConsent`, `_ga`, `_ga_DCSDL25ZS6`, `_fbp` | Google Ads, Meta Pixel, Stape, unpkg, Tag Manager |

**Zu deinen drei offenen Punkten:**

- **„Annehmen → jetzt gehen sie raus?"** — **ja.** `fbevents.js`, Stapes
  `v1.js`, unpkgs `clientParamBuilder.bundle.js` und die
  Conversion-Aufrufe an Google gehen raus, `_ga` und `_fbp` werden gesetzt.
- **„Laden `fbevents.js`, `v1.js` und `clientParamBuilder.bundle.js` mit 200?"**
  — **ja, alle drei.** Und im gesamten Mitschnitt **keine einzige Antwort
  ≥ 400**.
- **„Steht irgendwo noch `blocked:csp`?"** — **eine Zeile, und sie war echt:**
  `www.googleadservices.com/pagead/conversion/...` wurde von `connect-src`
  blockiert. Der Host stand in `script-src`, aber nicht in `connect-src`: das
  Skript durfte laden und seinen Aufruf per fetch nicht abschicken. **Behoben.**
  Zwei weitere Kanäle derselben Conversion gingen mit 200 durch, die Messung war
  also nicht blind — ein blockierter Kanal bleibt aber ein blockierter Kanal.

⚠️⚠️ **Lücke im Bautor geschlossen, die dieser Test aufgedeckt hat.** Das Tor
„Fremd-Hosts in /datenschutz/ genannt" durchsucht Markup und `dist/js`. **Sieben
Anbieter stehen in keiner dieser Dateien**, weil der server-seitige Tag Manager
sie erst nach der Zustimmung nachlädt — das Tor war grün, ohne sie je gesehen zu
haben. Sie stehen jetzt als gemessene Liste im Tor. Mit Gegenprobe belegt:
„unpkg" aus der Erklärung entfernt → Bau bricht ab; Original → grün.

✅ **Zum Punkt „Stape und unpkg in der Datenschutzerklärung ergänzen": beide
stehen dort schon**, mit Host und Zweck beschrieben. Am gebauten Text
nachgewiesen. Der Protokollpunkt war veraltet.

---

## N42 — Weiterleitungen: waren schon eingerichtet, jetzt belegt

**Gefragt** „Wir müssen alle aktuellen Seiten, die nicht 1:1 wiedergefunden
werden, umleiten. Bekommst Du das hin oder muss ich das einrichten?"

**Weder noch — es steht schon**, 84 Regeln in `vercel.json`. Statt das zu
behaupten, habe ich den **vollständigen alten Bestand** aus `page-sitemap.xml`
und `post-sitemap.xml` der laufenden Website geholt (23 Seiten + 8 Beiträge) und
jede Adresse gegen das Deployment getestet:

**38 von 38 alten Adressen enden mit 200**, kein Umweg länger als ein Sprung,
kein 404.

Darunter: die sieben `frankonia-*`-Leistungsseiten, `/sicherheitsanalyse/`, die
zwei Kundenstorys, alle acht Blogbeiträge auf ihre Ratgeber-Artikel, die
Personenseiten-Umbenennungen samt `.vcf`-Dateien, und die WordPress-Reste
`/feed/`, `/comments/feed/`, `/author/*`, `/category/*`, `/tag/*`,
`/hallo-welt/`, `/:pfad/feed/`.

⚠️ Vercel liefert bei `permanent: true` einen **308**, nicht 301. Für Google
gleichwertig (dokumentiert als permanente Weiterleitung), nur zur Kenntnis.
⚠️ Eine Zuordnung würde ich dir zur Prüfung vorlegen:
`/jobchancen-als-sicherheitskraft/` geht auf `/ratgeber/paragraph-34a-erklaert/`.
Der alte Titel lautet „Was sind deine Jobchancen als Sicherheitskraft?" — `/jobs/`
wäre womöglich näher.

---

## N43 — Meta-Beschriftungen aller 70 Seiten, in Pixeln gemessen

**Gewünscht** eine Tabelle, wie jede Seite in Google auftaucht, mit einheitlicher
Konvention je Seitentyp und nach Googles Pixelgrenzen.

**Gemessen in Pixeln, nicht in Zeichen** — genau so schneidet Google ab, und bei
deutschen Komposita führt eine Zeichenvorgabe systematisch daneben. Arial 20 px
für den Title, Arial 14 px für die Description, die Größen des Desktop-Snippets.

**Das Wichtigste ist grün: 0 doppelte Titles und 0 doppelte Descriptions** in 70
Seiten. Doppelte wären das echte Problem; Überlänge ist nur ein
Darstellungsverlust.

**Konvention je Typ, gemessen:**

| Typ | Muster | einheitlich? |
|---|---|---|
| Kombiseite (16) | `«Leistung» «Stadt» \| «Nutzen» 24/7 – FRANKONIA` | **ja**, 4 Gruppen à 4 |
| Stadtseite (10) | `Sicherheitsdienst «Stadt» \| «Zusatz» – FRANKONIA` | Rahmen ja, Zusatz variiert |
| Leistungsseite (11) | `«Leistung» Franken \| «Nutzen» – FRANKONIA` | 8 von 11 |
| Person/QR (10) | `Name Rolle \| FRANKONIA Sicherheit` | ja, bis auf einen |
| Ratgeber-Artikel (7) | Frage oder Thema, **ohne Marke** | ja, aber der einzige Typ ohne Marke |

**Befunde, alle klein und alle deine Entscheidung** (Titles und Descriptions sind
freigegebener Webtext, darum gemeldet und nicht geändert):

1. **3 Titles über 600 px:** `/brandwache-erlangen/` 603, `/brandwache-nuernberg/`
   607, `/brandwache-wuerzburg/` 610. Drei bis zehn Pixel — ein Wort kürzer
   genügt.
2. **34 von 70 Descriptions über 960 px.** Sie halten die Konvention von
   140–160 Zeichen ein; auf dem Desktop fallen die letzten Wörter weg.
3. **`/linktree/` beginnt klein:** „linktree | FRANKONIA Sicherheit" — der
   einzige Titel im Bestand mit Kleinbuchstabe am Anfang.
4. **Wortfolge:** `/sicherheitsdienst-fuerth/` sagt „Wachdienst 24/7",
   `/sicherheitsdienst-wuerzburg/` „24/7 Wachdienst" — gleiche Wörter, zwei
   Reihenfolgen.
5. **Die 7 Ratgeber-Artikel tragen keine Marke im Title.** Untereinander
   einheitlich und für Frage-Suchen gut, aber der einzige Typ ohne.

Die vollständige Tabelle mit Google-Vorschau und Pixelbalken je Seite liegt als
eigene Seite bei.

---

## N44 — Kennzahlen der Startseite bestätigt

**Bestätigt** „die auf der Homepage stehen, sind die richtigen, also zehn Jahre,
dreihundert plus Kunden, eine Million plus Stunden."

Damit ist der offene Punkt aus dem Protokoll geschlossen; der Vermerk
„unbestätigt" in `content/values.json` ist ersetzt. Der alte Punkt nannte noch
„25+ Jahre" — die Seite zeigt **10+**, und das ist der richtige Wert.

## N45 — Titles und Descriptions auf die Pixelgrenze gebracht (03.09.2026)

**Auftrag:** „alles descritpions und titles müssen passen in die maximale
pixelzahl … muss alles seo technisch sinn machen".

**Warum Pixel und nicht Zeichen:** Google schneidet das Snippet nach BREITE ab,
nicht nach Zeichenzahl. „Sicherheitsdienst" ist bei gleicher Zeichenzahl
deutlich breiter als „Illinois". Gemessen wurde daher mit Arial 20 px für den
Title (Grenze ~600 px) und Arial 14 px für die Description (Grenze ~960 px) —
die Maße des Desktop-Snippets.

**Ausgangslage, gemessen an den 70 gebauten Seiten:** 3 Titles und 34
Descriptions lagen über der Grenze, wurden also von Google mit „…" gekürzt.
Die restlichen 33 Seiten lagen im Limit und **wurden nicht angefasst** — es
wurde nichts auf Verdacht umformuliert.

**Kürzungsregeln, in dieser Reihenfolge angewandt:**

1. Doppelung raus. „Brandwache Nürnberg | Brandsicherheitswache" sagt zweimal
   dasselbe und bringt kein zweites Keyword.
2. Füllwörter raus — **nie das Keyword und nie den Ort**.
3. Einheitliche Kurzform: „Angebot in 1 Werktag" statt „Angebot innerhalb
   eines Werktages". Gleiche Aussage, ~45 px kürzer, und die Website benutzte
   bisher beide Formen gemischt.
4. Der Beleg bleibt (DEKRA, DIN, eine Zahl) — er ist das Stärkste am Snippet.

⚠️ **Zwei eigene Fehler, die erst eine Prüfung gefunden hat, nicht das Auge.**
Nach dem Schreiben lief eine Probe, die aus dem Slug ableitet, welches Keyword
und welcher Beleg im Text stehen MUSS:

- `/ratgeber/qualifikationen-sicherheitsdienst/` — meine Kürzung hatte
  **„im Sicherheitsdienst" gestrichen, also genau das Keyword aus der Adresse**.
  Die Endfassung führt es jetzt sogar nach vorn.
- `/objektschutz-erlangen/` — meine Kürzung hatte **„DEKRA-zertifiziert"
  gestrichen**. Wieder eingesetzt; dafür fällt dort „Angebot in 1 Werktag",
  was zugleich die konsistente Form der anderen Stadtseiten ist (die enden
  alle auf „DEKRA-zertifiziert.").

**Gegengeprüft am ausgelieferten Zustand (`dist/`), nicht an der Quelle:**

| Prüfung | Ergebnis |
|---|---|
| Titles über 600 px | **0** von 70 |
| Descriptions über 960 px | **0** von 70 |
| Descriptions unter 600 px (verschenkter Platz) | 0 |
| Keyword aus dem Slug beim Kürzen verloren | **keines** (26 Seiten geprüft) |
| Beleg (DEKRA/DIN/Zahl) verloren | **keiner** |
| Doppelte Titles / Descriptions | keine / keine |
| Seiten unbeabsichtigt verändert | keine (33 unangetastet, Soll-Ist-Vergleich) |
| Geplant vs. ausgeliefert | 37 von 37 identisch |
| Bau-Tore | 19 von 19 grün |

⚠️ **Title und Description stehen je ZWEIMAL in einer Seite** — einmal als
`<title>`/`<meta name="description">` und einmal als `og:title`/
`og:description`. Beide wurden ersetzt (6 bzw. 63 Vorkommen), sonst hätte die
Seite Google und Facebook Verschiedenes erzählt.

⚠️ **Fünf Seiten haben absichtlich einen EIGENEN Social-Text**, der nicht mit
der Description übereinstimmt: Startseite, `/danke/`, `/datenschutz/`,
`/impressum/`, `/kontakt/`. Dort wurde nur die Description angepasst, der
OG-Text blieb unverändert — geprüft und bewusst so gelassen.

⚠️ **`/impressum/` wurde nicht gekürzt, sondern PRÄZISER.** Der alte Text las
sich wie ein Unternehmen („FRANKONIA Sicherheitsdienst und FRANKONIA Werkschutz
GmbH & Co. KG"), es sind aber zwei eigene KGs. Beide sind jetzt vollständig
genannt. Platz kam aus dem gestrichenen „Angaben nach § 5 DDG" — das steht auf
der Seite selbst und im OG-Text.

### Alle 37 Änderungen zum Nachprüfen

Je Eintrag: **alt** ist die bisherige Formulierung, **neu** die ausgelieferte.
Die Zahl dahinter ist die gemessene Snippet-Breite in Pixeln.

#### Kernseite (4)

**`/jobs/`** — Description, 967 px → **881 px** (Grenze 960)

- alt: Sicherheitsdienst-Jobs bei FRANKONIA: übertarifliche Bezahlung, Dienstplan nach deinen Präferenzen, sicherer Arbeitgeber. Jetzt unverbindlich bewerben.
- neu: **Sicherheitsdienst-Jobs bei FRANKONIA: übertarifliche Bezahlung, Dienstplan nach deinen Präferenzen, sicherer Arbeitgeber. Jetzt bewerben.**

**`/kontakt/`** — Description, 983 px → **887 px** (Grenze 960)

- alt: FRANKONIA Sicherheitsdienst Bamberg: 24/7 erreichbar unter +49 951 964352-0. Unverbindliches Angebot in einem Werktag, kostenfreie Beratung inklusive.
- neu: **FRANKONIA Sicherheitsdienst Bamberg: 24/7 erreichbar unter +49 951 964352-0. Unverbindliches Angebot in 1 Werktag, Beratung kostenfrei.**

**`/referenzen/`** — Description, 1014 px → **953 px** (Grenze 960)

- alt: FRANKONIA Referenzen: über 300 Unternehmen und Einrichtungen vertrauen uns, von ADAC bis Stadtwerke Bamberg. Echte Ergebnisse, echte Kundenstimmen.
- neu: **FRANKONIA Referenzen: über 300 Unternehmen und Einrichtungen vertrauen uns, von ADAC bis Stadtwerke Bamberg. Echte Ergebnisse und Stimmen.**

**`/sicherheitskonzept/`** — Description, 993 px → **926 px** (Grenze 960)

- alt: Sicherheitskonzept für Ihr Unternehmen: Begehung, Risikoanalyse, Maßnahmenplan aus Personal & Technik. Vom zertifizierten Sicherheitsdienst aus Bamberg.
- neu: **Sicherheitskonzept für Ihr Unternehmen: Begehung, Risikoanalyse, Maßnahmenplan aus Personal & Technik. Vom zertifizierten Dienst aus Bamberg.**

#### Leistungsseite (6)

**`//`** — Description, 1027 px → **885 px** (Grenze 960)

- alt: DEKRA-zertifizierter Sicherheitsdienst aus Bamberg: Objektschutz, Werkschutz, Brandwache & mehr. Fester Ansprechpartner, 24/7 erreichbar. Angebot in 1 Werktag.
- neu: **DEKRA-zertifizierter Sicherheitsdienst aus Bamberg: Objektschutz, Werkschutz, Brandwache & mehr. Fester Ansprechpartner, 24/7 erreichbar.**

**`/baustellenbewachung/`** — Description, 1011 px → **887 px** (Grenze 960)

- alt: Baustellenbewachung gegen Diebstahl & Vandalismus: flexible Konzepte, die mit dem Baufortschritt mitwachsen. Dokumentiert & zertifiziert, Angebot in 1 Werktag.
- neu: **Baustellenbewachung gegen Diebstahl & Vandalismus: Konzepte, die mit dem Baufortschritt mitwachsen. Dokumentiert, Angebot in 1 Werktag.**

**`/empfangsdienst/`** — Description, 1014 px → **830 px** (Grenze 960)

- alt: Empfangsdienst mit Sicherheitskompetenz: Besuchermanagement, Pfortendienst, Postannahme, im Anzug oder Sicherheitsmontur. Fester Stamm statt Fluktuation.
- neu: **Empfangsdienst mit Sicherheitskompetenz: Besuchermanagement, Pfortendienst, Postannahme. Im Anzug oder Montur, festes Team.**

**`/objektschutz/`** — Description, 995 px → **939 px** (Grenze 960)

- alt: Objektschutz vom DEKRA-zertifizierten Sicherheitsdienst aus Bamberg: Bestreifung, Zugangskontrolle, Alarmverfolgung. Kostenfreies Sicherheitskonzept vorab.
- neu: **Objektschutz vom DEKRA-zertifizierten Sicherheitsdienst aus Bamberg: Bestreifung, Zugangskontrolle, Alarmverfolgung. Sicherheitskonzept kostenfrei.**

**`/sicherheitstechnik/`** — Description, 981 px → **940 px** (Grenze 960)

- alt: Sicherheitstechnik aus Bamberg: Videoüberwachung, Alarmanlagen, Zutrittskontrolle — Projektierung bis Wartung. Kombiniert mit Personal, wo es sinnvoll ist.
- neu: **Sicherheitstechnik aus Bamberg: Videoüberwachung, Alarmanlagen, Zutrittskontrolle — von der Projektierung bis zur Wartung, kombiniert mit Personal.**

**`/werkschutz/`** — Description, 996 px → **853 px** (Grenze 960)

- alt: Werkschutz für Industrie & Produktion: Pfortendienst, Rundgänge, Anlagen-Bedienung durch technik-geschulte Kräfte. DEKRA-zertifiziert, Angebot in 1 Werktag.
- neu: **Werkschutz für Industrie & Produktion: Pfortendienst, Rundgänge, Anlagen-Bedienung durch technik-geschulte Kräfte. DEKRA-zertifiziert.**

#### Kombiseite (7)

**`/brandwache-erlangen/`** — Title, 603 px → **524 px** (Grenze 600)

- alt: Brandwache Erlangen | Brandsicherheitswache 24/7 – FRANKONIA
- neu: **Brandwache Erlangen | Sofort einsatzbereit – FRANKONIA**

**`/brandwache-nuernberg/`** — Title, 607 px → **528 px** (Grenze 600)

- alt: Brandwache Nürnberg | Brandsicherheitswache 24/7 – FRANKONIA
- neu: **Brandwache Nürnberg | Sofort einsatzbereit – FRANKONIA**

**`/brandwache-wuerzburg/`** — Title, 610 px → **531 px** (Grenze 600)

- alt: Brandwache Würzburg | Brandsicherheitswache 24/7 – FRANKONIA
- neu: **Brandwache Würzburg | Sofort einsatzbereit – FRANKONIA**

**`/baustellenbewachung-erlangen/`** — Description, 963 px → **844 px** (Grenze 960)

- alt: Baustellenbewachung in Erlangen: Schutz für Campus-, Wohn- & Gewerbeprojekte vor Diebstahl & Vandalismus, dokumentiert. Angebot in einem Werktag.
- neu: **Baustellenbewachung in Erlangen: Schutz für Campus-, Wohn- & Gewerbeprojekte vor Diebstahl & Vandalismus. Angebot in 1 Werktag.**

**`/baustellenbewachung-fuerth/`** — Description, 961 px → **842 px** (Grenze 960)

- alt: Baustellenbewachung in Fürth: Schutz vor Diebstahl & Vandalismus für Nachverdichtung, Sanierung & Gewerbe, dokumentiert. Angebot in einem Werktag.
- neu: **Baustellenbewachung in Fürth: Schutz vor Diebstahl & Vandalismus für Nachverdichtung, Sanierung & Gewerbe. Angebot in 1 Werktag.**

**`/objektschutz-erlangen/`** — Description, 967 px → **794 px** (Grenze 960)

- alt: Objektschutz in Erlangen: Bestreifung, Zugangskontrolle & Alarmverfolgung für Büro, Forschung & Gewerbe. DEKRA-zertifiziert, Angebot in einem Werktag.
- neu: **Objektschutz in Erlangen: Bestreifung, Zugangskontrolle & Alarmverfolgung für Büro, Forschung & Gewerbe. DEKRA-zertifiziert.**

**`/werkschutz-nuernberg/`** — Description, 981 px → **808 px** (Grenze 960)

- alt: Werkschutz für Nürnberger Industrie: Pforte, Rundgänge & Anlagen-Bedienung durch technik-geschulte Kräfte. DEKRA-zertifiziert, Angebot in einem Werktag.
- neu: **Werkschutz für Nürnberger Industrie: Pforte, Rundgänge & Anlagen-Bedienung durch technik-geschulte Kräfte. DEKRA-zertifiziert.**

#### Stadtseite (8)

**`/sicherheitsdienst-ansbach/`** — Description, 991 px → **849 px** (Grenze 960)

- alt: Sicherheitsdienst für Ansbach: Objektschutz, Wachdienst, Brandwache & Baustellenbewachung in Westmittelfranken. DEKRA-zertifiziert, Angebot in 1 Werktag.
- neu: **Sicherheitsdienst für Ansbach: Objektschutz, Wachdienst, Brandwache & Baustellenbewachung in Westmittelfranken. DEKRA-zertifiziert.**

**`/sicherheitsdienst-bamberg/`** — Description, 993 px → **890 px** (Grenze 960)

- alt: FRANKONIA ist Ihr Sicherheitsdienst aus Bamberg: Objektschutz, Wachdienst, Brandwache & Events, seit über 10 Jahren für Stadt, Wirtschaft & Einrichtungen.
- neu: **FRANKONIA ist Ihr Sicherheitsdienst aus Bamberg: Objektschutz, Wachdienst, Brandwache & Events, seit über 10 Jahren in Stadt und Region.**

**`/sicherheitsdienst-bayreuth/`** — Description, 985 px → **813 px** (Grenze 960)

- alt: Sicherheitsdienst für Bayreuth: Objektschutz, Wachdienst, Brandwache & Veranstaltungsschutz in Oberfranken. DEKRA-zertifiziert, Angebot in einem Werktag.
- neu: **Sicherheitsdienst für Bayreuth: Objektschutz, Wachdienst, Brandwache & Veranstaltungsschutz in Oberfranken. DEKRA-zertifiziert.**

**`/sicherheitsdienst-erlangen/`** — Description, 986 px → **844 px** (Grenze 960)

- alt: Sicherheitsdienst für Erlangen: Objektschutz, Werkschutz & Brandwache für Technologie-, Klinik- und Bürostandorte. DEKRA-zertifiziert, Angebot in 1 Werktag.
- neu: **Sicherheitsdienst für Erlangen: Objektschutz, Werkschutz & Brandwache für Technologie-, Klinik- und Bürostandorte. DEKRA-zertifiziert.**

**`/sicherheitsdienst-fuerth/`** — Description, 1001 px → **880 px** (Grenze 960)

- alt: Sicherheitsdienst für Fürth: Objektschutz, Wachdienst, Brandwache & Baustellenbewachung — IHK-qualifizierte Kräfte, DEKRA-zertifiziert, Angebot in 1 Werktag.
- neu: **Sicherheitsdienst für Fürth: Objektschutz, Wachdienst, Brandwache & Baustellenbewachung durch IHK-qualifizierte Kräfte. DEKRA-zertifiziert.**

**`/sicherheitsdienst-nuernberg/`** — Description, 966 px → **889 px** (Grenze 960)

- alt: Sicherheitsdienst für Nürnberg: Objektschutz, Werkschutz, Brandwache & Baustellenbewachung durch IHK-qualifizierte Kräfte. DEKRA-zertifiziert seit 2016.
- neu: **Sicherheitsdienst für Nürnberg: Objektschutz, Werkschutz, Brandwache & Baustellenbewachung durch IHK-qualifizierte Kräfte. DEKRA-geprüft.**

**`/sicherheitsdienst-schweinfurt/`** — Description, 988 px → **815 px** (Grenze 960)

- alt: Sicherheitsdienst für Schweinfurt: Werkschutz für Industrie, Objektschutz, Brandwache & Baustellenbewachung. DEKRA-zertifiziert, Angebot in einem Werktag.
- neu: **Sicherheitsdienst für Schweinfurt: Werkschutz für Industrie, Objektschutz, Brandwache & Baustellenbewachung. DEKRA-zertifiziert.**

**`/sicherheitsdienst-wuerzburg/`** — Description, 1014 px → **927 px** (Grenze 960)

- alt: Sicherheitsdienst für Würzburg: Objektschutz, Baustellenbewachung, Brandwache & Veranstaltungsschutz. DEKRA-zertifiziert, Angebot innerhalb eines Werktages.
- neu: **Sicherheitsdienst für Würzburg: Objektschutz, Baustellenbewachung, Brandwache & Veranstaltungsschutz. DEKRA-zertifiziert, Angebot in 1 Werktag.**

#### Hub (2)

**`/einsatzgebiete/`** — Description, 1026 px → **952 px** (Grenze 960)

- alt: FRANKONIA Einsatzgebiete: Sicherheitsdienst für Bamberg, Nürnberg, Würzburg, Erlangen & ganz Franken. Ein Team, ein Standard — DEKRA-zertifiziert seit 2016.
- neu: **FRANKONIA Einsatzgebiete: Sicherheitsdienst für Bamberg, Nürnberg, Würzburg, Erlangen & ganz Franken. Ein Team, ein Standard, DEKRA-zertifiziert.**

**`/leistungen/`** — Description, 1040 px → **936 px** (Grenze 960)

- alt: Alle Sicherheitsdienstleistungen von FRANKONIA aus Bamberg: Objektschutz, Werkschutz, Brandwache, Baustellenbewachung & mehr. DIN 77200-1, DEKRA-geprüft.
- neu: **Alle Sicherheitsdienstleistungen von FRANKONIA aus Bamberg: Objektschutz, Werkschutz, Brandwache, Baustellenbewachung & mehr. DIN 77200-1.**

#### Ratgeber-Artikel (5)

**`/ratgeber/bewerbung-sicherheitsdienst/`** — Description, 1006 px → **830 px** (Grenze 960)

- alt: Bewerbung im Sicherheitsdienst: Diese drei Fehler kosten die meisten Bewerber die Stelle — Erstkontakt, Lebenslauf und Verbindlichkeit, erklärt vom Arbeitgeber.
- neu: **Bewerbung im Sicherheitsdienst: Diese drei Fehler kosten die meisten Bewerber die Stelle — Erstkontakt, Lebenslauf, Verbindlichkeit.**

**`/ratgeber/brandwache-wann-vorgeschrieben/`** — Description, 966 px → **882 px** (Grenze 960)

- alt: Wann ist eine Brandwache vorgeschrieben? BMA-Ausfall, Heißarbeiten, Veranstaltungen: alle Pflicht-Fälle, wer sie stellen darf und was sie kostet, kompakt.
- neu: **Wann ist eine Brandwache vorgeschrieben? BMA-Ausfall, Heißarbeiten, Veranstaltungen: alle Pflicht-Fälle, wer sie stellen darf, was sie kostet.**

**`/ratgeber/paragraph-34a-erklaert/`** — Description, 966 px → **912 px** (Grenze 960)

- alt: Der 34a-Schein einfach erklärt: Unterschied Unterrichtung vs. Sachkundeprüfung, Kosten, Dauer und welche Jobs damit möglich sind, vom Sicherheitsprofi.
- neu: **Der 34a-Schein einfach erklärt: Unterrichtung oder Sachkundeprüfung, Kosten, Dauer und welche Jobs damit möglich sind — vom Sicherheitsprofi.**

**`/ratgeber/qualifikationen-sicherheitsdienst/`** — Description, 1007 px → **899 px** (Grenze 960)

- alt: Unterrichtung, Sachkunde, GSSK: Dauer, Kosten und Prüfungsformat der drei Qualifikationen im Sicherheitsdienst im direkten Vergleich — mit Richtwerten je IHK.
- neu: **Qualifikationen im Sicherheitsdienst: Unterrichtung, Sachkunde und GSSK im Vergleich — Dauer, Kosten, Prüfungsformat und Richtwerte je IHK.**

**`/ratgeber/voraussetzungen-sicherheitsdienst/`** — Description, 1040 px → **935 px** (Grenze 960)

- alt: Voraussetzungen im Sicherheitsdienst: für Unterrichtung und Sachkunde keine, für die GSSK strenge — dazu Führungszeugnis und Bewacherregister vor dem Einsatz.
- neu: **Voraussetzungen im Sicherheitsdienst: für Unterrichtung und Sachkunde keine, für die GSSK strenge — dazu Führungszeugnis und Bewacherregister.**

#### Case Study (2)

**`/referenzen/case-study-schichtsystem/`** — Description, 979 px → **927 px** (Grenze 960)

- alt: Wie FRANKONIA das Schichtsystem eines Bestandskunden optimierte: 20 % Kostenersparnis bei gleichbleibender Sicherheit. Die anonymisierte Case Study.
- neu: **Wie FRANKONIA das Schichtsystem eines Bestandskunden optimierte: 20 % Kostenersparnis bei gleicher Sicherheit. Die anonymisierte Case Study.**

**`/referenzen/case-study-sicherheitskonzept/`** — Description, 1001 px → **874 px** (Grenze 960)

- alt: Wie ein Großkunde mit einem neuen Sicherheitskonzept 30 % Personalkosten sparte — bei gleicher Sicherheit. Die anonymisierte Case Study von FRANKONIA.
- neu: **Wie ein Großkunde mit einem neuen Sicherheitskonzept 30 % Personalkosten sparte, bei gleicher Sicherheit. Die anonymisierte Case Study.**

#### Rechtliches (2)

**`/datenschutz/`** — Description, 1019 px → **879 px** (Grenze 960)

- alt: Datenschutzerklärung der FRANKONIA Sicherheitsdienst GmbH & Co. KG, Bamberg: Verantwortlicher, Kontakt für datenschutzrechtliche Anfragen und Ihre Rechte.
- neu: **Datenschutzerklärung der FRANKONIA Sicherheitsdienst GmbH & Co. KG, Bamberg: Verantwortlicher, Kontakt für Anfragen und Ihre Rechte.**

**`/impressum/`** — Description, 1138 px → **898 px** (Grenze 960)

- alt: Impressum von FRANKONIA Sicherheitsdienst GmbH & Co. KG und FRANKONIA Werkschutz GmbH & Co. KG, Neuerbstraße 19 in 96052 Bamberg: Anbieterangaben nach § 5 DDG.
- neu: **Impressum: FRANKONIA Sicherheitsdienst GmbH & Co. KG und FRANKONIA Werkschutz GmbH & Co. KG, Neuerbstraße 19, 96052 Bamberg.**

#### Danke (1)

**`/danke/`** — Description, 1014 px → **935 px** (Grenze 960)

- alt: Ihre Anfrage ist bei FRANKONIA angekommen. Wir melden uns innerhalb eines Werktages — bei dringenden Fällen erreichen Sie uns rund um die Uhr telefonisch.
- neu: **Ihre Anfrage ist bei FRANKONIA angekommen. Wir melden uns innerhalb eines Werktages — in dringenden Fällen erreichen Sie uns rund um die Uhr.**

## N46 — Stadtkarte: Landkreislinie kräftiger, Name im Bild (04.09.2026)

**Auftrag (Kunde):** „der Landkreislinie ist jetzt zu unsichtbar, die muss etwas
kräftiger sein" und „die Markierung unten drunter würde ich weglassen … diese
Legende find ich scheiße. Ich würde nur bei der Stadt immer die Stadt … als
Stadt Würzburg hinmachen."

**Die Landkreislinie war messbar unter der Wahrnehmungsschwelle.** Der Eindruck
war nicht Geschmack: `#3D9AD3` bei Deckung 0,32 auf `#010101` gemischt misst
**1,56:1**. Eine Grafik braucht 3:1, um überhaupt als Form gelesen zu werden.
Die ganze Kurve, gerechnet aus dem Wert, den der Browser anwendet:

| Deckung | 0,32 | 0,55 | 0,60 | 0,65 | 0,70 | 1,00 |
|---|---|---|---|---|---|---|
| Kontrast | 1,56 | 2,61 | 2,93 | 3,27 | **3,66** | 6,72 |

Neu: **0,7 Deckung, 2,6 Linienbreite**. Der Rangunterschied zur Stadt bleibt, er
trägt jetzt die STÄRKE statt der Sichtbarkeit — offene Linie gegen gefüllte
Fläche mit 0,95 Kontur.

⚠️ **Mein erster Versuch war 0,6 und lag mit 2,93:1 NOCH darunter.** Ich hatte
im Kommentar 4,3:1 behauptet — geschätzt statt gerechnet. Gefunden hat es die
Messung, nicht das Auge.

**Legende gelöscht**, Markup und CSS (`.city-map__legende`, `__muster`,
`__label`). Stattdessen steht der Stadtname **im Bild an der Stadt**, auf allen
26 Seiten.

⚠️⚠️ **ECHTER TEXT ÜBER DER ZEICHNUNG, NICHT `<text>` IM SVG — und das ist eine
Messung, keine Bequemlichkeit.** Der Zeichenbereich ist immer 1000 Einheiten
breit, gerendert wird er je Stadt, Breite und Seitentyp zwischen **123 px und
445 px**:

| | 390 px | 768 px | 1024 px | 1440 px |
|---|---|---|---|---|
| Bamberg (viewBox 715 hoch) | 224 | 365 | 314 | 445 |
| Würzburg (viewBox 1298 hoch) | 123 | 201 | 314 | 444 |
| Kombiseite bei 1024 | — | — | 242 | — |

Eine Schriftgröße im SVG skaliert mit diesem Faktor und bräuchte rund **zwanzig
verschiedene Werte** — auf dem Telefon stand sie bei 7 px. Über der Zeichnung
behält der Text **12 px bei jeder Breite**, bleibt auswählbar und sitzt trotzdem
im Bild. Genau diese Falle ist für die Karten-Labels auf `/einsatzgebiete/` schon
dokumentiert, wo es drei Größenstufen in viewBox-Einheiten braucht.

**Der neue Umschlag `.city-map__rahmen` ist ein Rasterbehälter**, damit er sich
in der zentrierten Flex-Spalte um das SVG schmiegt. Nur so sind Prozentwerte
darin Prozente DER ZEICHNUNG — als Block wäre er so breit wie die ganze Spalte
und die Beschriftung landete daneben.

**Der Anker sitzt UNTER der Stadtform**, bei den drei Städten ohne Landkreis
(Nürnberg, Erlangen, Fürth) am unteren Rand geklemmt — dort IST die Stadt der
ganze Zeichenbereich.
⚠️ **Diese Klemme ist anteilig (5 % der Zeichenhöhe), die Texthöhe aber konstant
(~19 px).** Bei Nürnberg auf 390 px sind 5 % nur 8 px, und der Name ragte
**1,6 px** heraus. Zweite Klemme in Pixeln in der CSS (`min(var(--y), calc(100%
- 0.7rem))`).

**`KREIS_NAME` aus dem Generator gelöscht** — die Tabelle speiste nur die
Legende und war damit toter Code. Das Wissen (welche sieben Kreise umschließen,
und warum Nürnberg „Nürnberger Land" heißt) bleibt als Kommentar.

**Gegengeprüft:**

| Prüfung | Ergebnis |
|---|---|
| Kartengrößen gegen den Stand vor dem Umbau | **16 von 16 identisch** (5 Seiten × 4 Breiten) |
| Umschlag deckungsgleich mit dem SVG | ja, auf 1 px |
| Alle 26 Seiten × 3 Breiten | Name vorhanden, 12 px, im Zeichenkasten |
| Seitliches Scrollen | 0 auf allen |
| Generator zweimal gelaufen | Dateien byte-identisch |
| Bau-Tore | 19 von 19 grün |

---

## N47 — Warum der Tag Manager nichts meldet: die Website ist es nicht (04.09.2026)

**Auftrag (Kunde):** „der Google Tag Manager wird immer noch nicht ausgelöst",
mit der Tag-Assistant-Meldung „Eine Plattform zur Einwilligungsverwaltung
blockiert möglicherweise Tags".

**Die Website-Seite ist Punkt für Punkt belegt in Ordnung.** Gemessen am
ausgelieferten Zustand der Testdomain, mit echtem Klick auf „Alle zulassen" —
nicht mit entferntem Dialog, was jede frühere Sonde hier falsch gemacht hat:

| Prüfung | Ergebnis |
|---|---|
| CSP erlaubt den Tagging-Server | ja, in `script-src`, `connect-src`, `frame-src`, `img-src` |
| CSP-Verstöße beim Laden | keine |
| Consent Mode `default` vor allen Tags | alle sechs auf `denied` ✓ |
| Consent Mode `update` nach Zustimmung | alle sechs auf `granted` ✓ |
| `ads_data_redaction` nach Zustimmung | `false` ✓ |
| Container-Loader `7ll8fjctyrvc.js` | **HTTP 200**, 462 KB |
| Container durchgelaufen | `gtm.js` → `gtm.dom` → `gtm.load` ✓ |
| `google_tag_manager` | `GTM-NWLGMFJN`, `G-DCSDL25ZS6` ✓ |
| GA4-Loader `gtag/js` | **HTTP 200**, 578 KB echtes JavaScript |
| `/g/collect` am Tagging-Server | **HTTP 200** (nimmt Treffer an) |
| `/healthy` am Tagging-Server | **HTTP 200** |
| Anfragen an Messhosts VOR der Einwilligung | **0** — richtig so |
| Messtreffer NACH der Einwilligung | **0** ⚠️ |

**Die letzte Zeile ist der Befund, und die Ursache liegt im GTM-Container.** Aus
dem ausgelesenen Container (24 Tags, 11 Trigger-Zuordnungen):

1. ⚠️ **Der Google-Tag hat `send_page_view` auf `"false"`** —
   `"vtp_configSettingsTable":[…["map","parameter","send_page_view","parameterValue","false"]]`.
   Er sendet also absichtlich keinen Seitenaufruf.
2. ⚠️ **Ein `page_view`-Event-Tag existiert** (neben `contact`, `generate_lead`,
   `schedule` und 4× `standard`), **hat aber nicht gefeuert.** Die
   Trigger-Bedingungen des Containers warten unter anderem auf das eigene
   Ereignis **`stape_consent_update`** — und das kommt im gemessenen dataLayer
   **nie vor**. Dort steht nur Cookiebots eigenes `cookie_consent_update`,
   `cookie_consent_preferences`, `cookie_consent_statistics`,
   `cookie_consent_marketing`.
3. ⚠️ **Ein Trigger ist auf `https://frankonia-sicherheit.de/danke/` festgelegt**
   — die **Live**-Domain. Auf der Testdomain kann dieser Conversion-Trigger
   grundsätzlich nicht feuern, unabhängig von allem anderen.

**Die Tag-Assistant-Meldung ist erwartetes Verhalten, kein Defekt.** Vor der
Einwilligung darf und soll nichts feuern; Tag Assistant klickt den Banner nicht
an und sieht deshalb nichts. Die Meldung sagt selbst „möglicherweise".
**Zum Testen: den Banner IM Tag-Assistant-Fenster annehmen**, dann verbindet
sich `GTM-NWLGMFJN`.

**Was zu tun ist, liegt in GTM und im Stape-Container, nicht im Code** — deshalb
hier nichts geändert:
- Im Google-Tag `send_page_view` auf `true` setzen (oder die Zeile entfernen).
- Prüfen, warum die Stape-Consent-Vorlage kein `stape_consent_update` in den
  dataLayer schreibt — das ist das Ereignis, auf das die Trigger warten.
- Den `/danke/`-Trigger für Tests auf die Testdomain erweitern, sonst ist die
  Conversion erst nach dem Livegang messbar.

⚠️ **Eine Änderung im Code wäre denkbar und wurde NICHT gemacht:** dem
GTM-Loader `data-cookieconsent="ignore"` mitgeben, damit der Container schon vor
der Einwilligung lädt und allein Consent Mode die Tags sperrt (so empfehlen es
Google und Cookiebot). Das würde Tag Assistant den Container sofort zeigen und
die Modellierung über Consent-denied-Pings ermöglichen — **es ändert aber, was
vor der Einwilligung lädt, und das ist eine rechtliche Entscheidung, keine
technische.** Und es würde das eigentliche Problem nicht lösen: die Tags feuern
auch mit erteilter Einwilligung nicht.

⚠️ **Messfallen dieser Runde, beide meine eigenen:**
- Ein zu grobes Muster (`googleads|doubleclick|/conversion`) meldete **2
  „Messtreffer" vor der Einwilligung**, die keine waren. Mit einer Hostliste
  statt Stichwörtern: 0. **Ein Treffer-Zähler braucht eine Hostliste, keine
  Wortsuche.**
- `performance.getEntriesByType("resource")` sieht **keine
  `sendBeacon`-Anfragen** — GA4 benutzt sie. Ohne
  `Network.requestWillBeSent` kann man „es geht nichts raus" nicht belegen.
  Der Messaufsatz hat dafür jetzt eine Ereignis-Anmeldung.
- Und die dokumentierte Git-Bash-Falle noch einmal: ein Argument wie
  `/sicherheitsdienst-bamberg/` wurde zu
  `C:/Program Files/Git/sicherheitsdienst-bamberg/`. Die Sonde lud
  `about:blank` und meldete „Element fehlt". `MSYS_NO_PATHCONV=1`.
