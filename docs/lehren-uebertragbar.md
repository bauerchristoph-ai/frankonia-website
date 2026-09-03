# Übertragbare Lehren für Web-Projekte

Diese Datei ist **absichtlich projektunabhängig** geschrieben: keine
FRANKONIA-Klassennamen, keine Chronik. Sie ist zum Kopieren in ein anderes
Repository oder in eine `CLAUDE.md` gedacht.

Jede Lehre hat dieselbe Form: **Symptom → Ursache → Regel → wie man es prüft.**
Alle stammen aus einem Abnahmedurchgang, in dem jede einzelne mindestens eine
ganze Korrekturrunde gekostet hat — und zwar immer auf dieselbe Weise: eine
Messung war grün, der Kunde sah denselben Fehler weiter, und die Ursache lag
nicht dort, wo gemessen wurde.

---

## 0. Die Regel über allen anderen

**Nie „behoben" melden, ohne es am gemeldeten Symptom im ausgelieferten Zustand
geprüft zu haben.**

Nicht die Regel prüfen, die den Fehler beheben soll — das **Symptom**. Nicht
lokal, sondern dort, wo der Kunde schaut. Und wenn sich etwas in der eigenen
Umgebung nicht nachstellen lässt: **das sagen**, ein Prüftor setzen oder den Code
sich selbst korrigieren lassen — nicht „gelöst" behaupten.

Jede der folgenden Lehren ist ein Spezialfall davon.

---

## 1. Der ausgelieferte Zustand ist nicht der gebaute Zustand

**Symptom** Der Kunde lädt neu und sieht denselben Fehler, den man gerade
gemessen behoben hat — über Stunden, bei Bildern über einen Tag.

**Ursache** Statische Dateien mit `Cache-Control: max-age=…` und **ohne Version
im Dateinamen**. Die HTML wird revalidiert, CSS/JS/Bilder nicht — der Browser
fragt gar nicht nach. Wer mit frischem Browserprofil messt, messt mit leerem
Cache und prüft damit *eine Stunde in der Zukunft*.

**Regel** Jede eigene Adresse bekommt beim Bauen eine **Inhaltssignatur**
(`app.css?v=ba0a6e20`, 8 Hex-Zeichen aus einem Hash des fertigen Inhalts).
Ändert sich der Inhalt, ändert sich die Adresse — der Browser *muss* neu holen.
Ändert sich nichts, bleibt die Datei im Cache: der Nutzen bleibt, der Versatz
verschwindet.

Drei Details, die man beim Nachbauen braucht:
- **Als letzter Bauschritt**, nach jeder Minifizierung — sonst signiert man
  Inhalt, der sich danach noch ändert.
- **Zwei Durchgänge**, wenn eine JS-Datei eine andere zur Laufzeit nachlädt: erst
  die Verweise *in* den Dateien stempeln, dann signieren.
- **Bilder in `srcset` mitnehmen**, Deskriptor und Komma erhalten.

**Prüfen** Ein Bautor, das jede eigene Adresse in der ausgelieferten HTML auf
`?v=` prüft. Und die Gegenprobe aus Lehre 11.

---

## 2. Bei gleicher Spezifität entscheidet die Dateireihenfolge

**Symptom** Eine Regel greift in einem Breitenband und im anderen nicht. Auf dem
Telefon ist alles richtig, auf dem Tablet nicht.

**Ursache** Zwei Klassen (`0,2,0`) und zwei Attributselektoren (`0,2,0`) sind
**gleich spezifisch**. Bei Gleichstand gewinnt die **später geladene** Datei. Wenn
die Konkurrenzregel im Telefonband nur einen Selektor hat (`0,1,0`), gewinnt man
dort — und verliert im Tablettband gegen dieselbe Datei.

**Regel** Vor jeder Regel, die eine andere schlagen soll: **die Spezifität BEIDER
zählen** und die Ladereihenfolge ansehen. Wenn Gleichstand möglich ist, einen
Selektor mehr nehmen (z. B. das Attribut mitschreiben, an dem die Gegenregel
hängt) — nicht auf die Reihenfolge vertrauen.

⚠️ Kommentare an solchen Regeln altern schlecht. Einer behauptete „zwei Klassen
schlagen das unabhängig von der Dateireihenfolge" — das galt nur gegen die eine
Variante der Gegenregel.

**Prüfen** Den berechneten Wert an mehreren Breiten auslesen, nicht die Datei
lesen.

---

## 3. `overflow-y: auto` macht auch die andere Achse scrollbar

**Symptom** Ein Overlay lässt sich auf dem Telefon seitlich aus dem Bild ziehen.

**Ursache** Spezifikation, nicht Browserlaune: ist **eine** Achse nicht
`visible`, wird die andere von `visible` auf **`auto`** gehoben. Ein einziges
Pixel Überbreite genügt dann, und iOS lässt die Achse gummiband-artig weit
herausziehen.

**Regel** Wer eine Achse scrollbar macht, **schließt die andere ausdrücklich**
(`overflow-x: hidden`). Und die Ursache des einen Pixels gleich mit suchen: oft
ist es ein optischer Zug per negativem Margin, der größer ist als das Polster
daneben. Solche Züge auf das Polster begrenzen:
`margin-inline-end: max(<zug>, calc(-1 * var(--polster)))`.

**Prüfen** `scrollWidth` gegen `clientWidth` des Elements, nicht nur der Seite.

---

## 4. Smooth-Scroll-Bibliotheken verwerfen im gestoppten Zustand jede Geste

**Symptom** Ein Menü ist programmatisch scrollbar (`scrollTop` funktioniert),
mit dem Finger aber nicht. Das ist die Signatur einer **abgefangenen Geste**.

**Ursache** Beim Öffnen des Overlays wird die Seite mit `lenis.stop()` (oder
Äquivalent) angehalten. Solche Bibliotheken rufen im gestoppten Zustand
`preventDefault()` auf jede Geste, die am Fenster ankommt — und ein
`preventDefault` auf `touchmove` bricht das native Scrollen der **ganzen Geste**
ab, auch das eines inneren Elements mit `overflow-y: auto`.

**Regel** Jede scrollbare Fläche, die während des Stopps bedienbar bleiben muss,
braucht den Ausstieg der Bibliothek — bei Lenis `data-lenis-prevent`. Die
Prüfung läuft über den gesamten Ereignispfad und steigt **vor** dem
`preventDefault` aus, die Seite bleibt also gestoppt.

**Prüfen** Eine echte Touchgeste schicken und `event.defaultPrevented` in einem
später registrierten Listener lesen. A/B mit und ohne Attribut.

---

## 5. Chrome leitet SVG-Maße aus dem `viewBox` ab, Safari nicht

**Symptom** Eine Grafik fehlt auf dem iPhone — samt ihrem Platz. In Chrome nicht
nachstellbar.

**Ursache** Ein inline-`<svg>` mit **beiden** Achsen auf `auto` (nur
`max-width`/`max-height` gesetzt) und ohne `width`/`height`-Attribute im Markup
hat keine intrinsische Größe. Chrome leitet sie aus dem `viewBox` ab, WebKit
lässt die Box auf null zusammenfallen.

**Regel** Ein inline-SVG trägt `width` und `height` als **Attribute** (aus dem
eigenen `viewBox`), sobald das CSS beide Achsen auf `auto` lässt. Mit **einer**
definiten Achse löst das Verhältnis in jeder Engine auf — nur beide `auto` ist
der Fall, der bricht.

**Prüfen** Nur durch ein **Bautor am Markup** — in Chrome ist der Fehler
unsichtbar. Das Tor prüft genau die riskante Kombination, nicht jedes SVG.

---

## 6. `min-height` gewinnt gegen `max-height`

**Symptom** Ein Inhalt wird unten abgeschnitten, obwohl eine `max-height`
existiert, die das verhindern sollte.

**Ursache** Eine `min-height`, die größer ist als die `max-height`, **schaltet
diese aus** (so ist es spezifiziert). Eine später hinzugefügte `min-height` kann
also eine bestehende Bremse unwirksam machen, ohne dass irgendetwas fehlschlägt.

**Regel** Eine Höhe, die einer **Bühne** gehört, gehört nicht dem Element: der
Container nimmt den Rest (`flex: 1 1 auto`), das Kind füllt ihn (`height: 100%`,
`min-height: 0`). Dann kann per Konstruktion nichts abgeschnitten werden — auf
jeder Bildschirmhöhe, ohne nachzupflegende Zahlenwerte. `min-height: 0` ist dabei
nicht Zierde: die Mindesthöhe eines Flex-Elements richtet sich sonst nach seinem
Inhalt.

**Prüfen** An mindestens fünf Bildschirmhöhen messen, inklusive Querlage.

---

## 7. Der Entwicklungsserver kann die falsche Seite ausliefern

**Symptom** Eine Sonde meldet, ein Element existiere nicht — oder zwei
verschiedene Seiten liefern identische Messwerte.

**Ursache** Viele Entwicklungsserver liefern für jeden unbekannten Pfad die
**Startseite** aus (SPA-Fallback). `location.pathname` ist dann **richtig**,
während der Inhalt falsch ist.

**Regel** Eine Sonde muss prüfen, **dass sie die Seite gemessen hat, die sie
angefordert hat** — über `document.title` oder die `h1`, nicht über den Pfad. Und
ein Messserver liefert im Zweifel besser **404 als Startseite**.

**Prüfen** Bei jedem Messlauf den Titel mitloggen. Wenn zwei Seiten dieselben
Zahlen liefern, ist das ein Alarm, kein Zufall.

---

## 8. Fremde Skripte hängen hinter der Einwilligung

**Symptom** Ein Drittanbieter-Widget lädt in der Messumgebung nie
(`window.<name>` undefiniert, kein iframe), obwohl es live sichtbar ist.

**Ursache** Die Sonde hat den Einwilligungsdialog **entfernt** statt ihn
**anzunehmen**. Ohne Zustimmung lädt das Skript nicht — und jede Aussage über
seine Größe oder sein Verhalten ist eine Rechnung ohne Kontrolle.

**Regel** Zum Messen den Zustimmungsknopf **klicken**, nicht den Dialog löschen.
Und danach **neu laden**: Tags feuern in der Regel erst beim nächsten
Seitenaufruf, nicht im Moment des Akzeptierens.

**Prüfen** `typeof window.<name>` protokollieren, bevor man über das Widget
urteilt.

---

## 9. Was sich nicht nachstellen lässt, braucht Selbstkorrektur statt Annahme

**Symptom** Ein fremdes Widget ragt aus seinem Container, und man kann es in der
eigenen Umgebung nicht rendern.

**Regel** Nicht die nächste Annahme über die Mindestbreite treffen, sondern den
**Browser nach dem Rendern selbst prüfen lassen**: Breite des eingesetzten
Elements gegen den Container messen und in dieser Reihenfolge reagieren —
1. **passt** → nichts tun,
2. **knapp zu breit** (Faktor ≥ 0,85) → maßstäblich einpassen und die breite
   Fassung behalten,
3. **deutlich zu breit** → auf die kleine Variante wechseln,
4. **immer noch zu breit** → einpassen.

⚠️ Die **Reihenfolge** ist der Kern. Wer bei jedem Überhang sofort auf die kleine
Variante wechselt, bekommt sie überall — denn ein Widget mit Mindestbreite steht
in fast jeder schmalen Karte ein paar Pixel über.

⚠️ `overflow: hidden` ist hier **falsch**: ein abgeschnittenes Bedienelement ist
schlimmer als ein überbreites.

⚠️ Schwellen aus der Skalierung rechnen, nicht raten. Beispiel: Mindestbreite
300 px, Container 262 → Faktor 0,87 (unsichtbar); Container 222 → 0,74
(merklich). 240/300 = 0,80 ist damit die begründete Grenze.

**Prüfen** Mit einem **untergeschobenen** Widget, das absichtlich zu breit
rendert — dann ist die Kette prüfbar, ohne das echte zu brauchen.

---

## 10. Ein Effekt kann als fehlender Inhalt gelesen werden

**Symptom** Der Kunde meldet „X fehlt", und man findet X an der Stelle, an der
man gerade gearbeitet hat, vollständig vor.

**Ursache** Ein anderer Mechanismus greift in einem anderen Breitenband. Ein
3D-Ring etwa drehte zwei von drei Karten perspektivisch weg: gemessen war die
vordere 272 px breit und die hinteren je 117 — für den Betrachter „nicht da".
Auf dem Telefon war die Reihe vollständig, deshalb war der Befund zweimal nicht
zu finden.

**Regel** Eine Meldung „X fehlt" **an allen Breiten prüfen, an denen ein anderer
Mechanismus greift** — nicht nur dort, wo man selbst zuletzt gearbeitet hat. Und
die tatsächlich **gerenderte** Größe messen, nicht die Existenz im DOM.

---

## 11. Eine Prüfung ohne Gegenprobe ist eine Behauptung

**Symptom** Ein neues Prüftor ist grün. Es hat aber nie etwas geprüft.

**Ursache konkret** Das Muster verlangte, dass eine Adresse auf `.css` endet —
eine signierte Adresse endet auf `?v=…`. Es fand also nichts, und „nichts
gefunden" sieht genauso aus wie „alles in Ordnung".

**Regel** **Jede neue Prüfung braucht die Gegenprobe:** das Geprüfte von Hand
kaputt machen und sehen, ob die Prüfung fällt. Fällt sie nicht, prüft sie nicht.

Das gilt auch für Messsonden: eine Sonde, die bei einem Fehler in ihrem eigenen
Code `undefined` zurückgibt, meldet leicht „Element existiert nicht".

---

## 12. Umgebungsfallen, die immer wiederkommen

- **Heredocs fressen eine Backslash-Ebene.** Ein Regex in einer Sonde geht damit
  **still** kaputt (`\s+` wird zu `s+` und trennt am Buchstaben s). Patch-Dateien
  mit einem Datei-Werkzeug schreiben oder Backslashes vermeiden
  (`split()/join()` statt `replace(/…/g)`, `String.fromCharCode(10)` statt `\n`).
- **Git Bash wandelt Argumente wie `/pfad/` in Windows-Pfade um.**
  `MSYS_NO_PATHCONV=1` davor.
- **In `execSync`/`spawn` über cmd.exe ist `^` das ESCAPE-Zeichen.** Aus
  `git show abc123^:datei` wird `git show abc123:datei` — also genau der
  Commit, den man nicht wollte. Der Befehl **gelingt** und liefert die falsche
  Version. `~1` statt `^` benutzen, und nach jeder Wiederherstellung
  gegenprüfen, dass wirklich drin ist, was drin sein soll.
- **Ein Apostroph im Suchtext sprengt einfach-gequotete Shell-Strings.** Ein
  Patch, der nach einem Kommentar mit einem Apostroph darin sucht, bricht
  mitten im Argument ab, und die Shell führt die Bruchstücke als Befehle aus.
  Solche Patches als Datei schreiben, nicht inline. (Diese Zeile ist selbst
  daran gescheitert, als sie inline geschrieben werden sollte.)

- **`grep -P` fehlt** in manchen Umgebungen („supports only unibyte and UTF-8
  locales") — dann in Node prüfen.
- **`Page.captureScreenshot` mit `clip` erwartet SEITEN-Koordinaten**, nicht
  Viewport-Koordinaten; `captureBeyondViewport` zusätzlich kann das Bild schwarz
  machen.
- **Headless-Chrome erzwingt ein Layout-Viewport von ~500 px.** Für echte
  Telefonbreiten `Emulation.setDeviceMetricsOverride` benutzen oder in einem
  `<iframe>` fester Breite rendern.
- **`getBoundingClientRect()` liefert die TRANSFORMIERTE Box.** Während eine
  Animation läuft, messt man deren Zwischenzustand — für Layoutmaße
  `prefers-reduced-motion` erzwingen oder `offsetWidth/offsetHeight` lesen.
- **Ein Prozentwert eines Grid-Items löst gegen die eigene Grid-Area auf**, nicht
  gegen das ganze Raster.
- **Ein Auto-Margin oder `justify-self: center` macht ein Grid-Item
  content-sized** — ein `<svg>` oder `<picture>` darin kollabiert dann. Es
  braucht zusätzlich `width: 100%`.
- **Ohne `<meta name="viewport">` nimmt Chrome bei `mobile: true` die
  Standardbreite 980 px** — auch wenn `setDeviceMetricsOverride` 390 verlangt.
  Jede „390-px-Messung" ist dann in Wahrheit eine 980-px-Messung, und zwar eine
  mit grünen Zahlen: kein seitliches Scrollen, keine Überbreite, alles ok. Das
  Handy ist trotzdem ungeprüft. Der Verräter ist die Seitenhöhe — sie war fast
  identisch mit der Desktop-Messung, obwohl eine Handyfassung viel höher sein
  muss (hier 14 582 gegen echte 25 485 px). **Eine Sonde muss `innerWidth`
  gegen die angeforderte Breite prüfen, bevor man ihr etwas glaubt.** Betrifft
  jedes Dokument, dessen Viewport-Meta erst eine Hülle beisteuert — bei
  Artefakten setzt es die Veröffentlichung, also lokal in derselben Hülle
  messen.
- **„Läuft aus dem Container" muss gegen den EIGENEN Container gemessen
  werden.** Eine Sonde, die alles gegen die erste Karte vergleicht, meldet jede
  Tabelle in einem eigenen Scroll-Kasten als Fehler — 277 Elemente „überbreit",
  alle korrekt. Die belastbare Prüfung ist zweistufig: scrollt der
  Seitenkörper seitlich (das ist der Fehler), und hat jedes breite Element
  einen Vorfahren mit `overflow-x: auto` (dann ist es Absicht).
