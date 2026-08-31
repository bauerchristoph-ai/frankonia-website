# Codebeurteilung — FRANKONIA Website

**Stand 31.08.2026 · Aufgabe 28 des QA-Durchgangs**

> ⚠️ **Das ist eine Beurteilung, keine Änderung.** Der Auftrag sagt ausdrücklich:
> nichts umbauen ohne Rückfrage bei Christoph. An der Struktur dieses Projekts
> wurde für dieses Dokument nichts angefasst. Jeder Befund nennt Wirkung, Aufwand
> und Risiko, damit die Entscheidung bei Christoph liegt und nicht bei mir.

---

## Umfang, gemessen

| | |
|---|---|
| Seiten | 70 (58 indexierbar) |
| Partials | 14 |
| CSS | 30 Dateien, 31.317 Zeilen |
| JavaScript (Browser) | 34 Dateien, 7.503 Zeilen |
| API-Funktionen | 8 |
| Tests | 1 Datei, 67 Fälle |
| Bau-Tore | 12 |
| Laufzeit-Abhängigkeiten | **0** |

---

## Was gut ist

Das gehört zuerst gesagt, weil es die Grundlage dafür ist, dass die Befunde unten
überhaupt klein sind.

**1. Die Bau-Tore prüfen die Auslieferung, nicht die Quelle.** Alle zwölf laufen
über `dist/` — also über das Markup, das ein Besucher und ein Crawler bekommen,
einschließlich alles, was Includes und Token beigetragen haben. Das ist die
richtige Ebene, und es ist selten. Ein Tor, das `pages/` prüft, hätte in dieser
Sitzung mehrfach das Falsche gemessen: die Preisangaben sind in der Quelle Token
und erst im Bau Zahlen.

**2. Die Kommentare tragen das Warum, samt der Fallen.** Nicht „was", sondern
„warum so und nicht anders", und ausdrücklich auch „das hat einen Durchgang
gekostet". Drei Beispiele, die in dieser Sitzung Zeit gespart haben: der Hinweis,
dass `margin-inline: auto` einen Grid-Item content-sized macht; dass ein
`filter: blur(0px)` eine Compositing-Ebene am Leben hält; dass
`.coverage__pill--all` bewusst kein `<a>` ist. Das ist der Grund, warum ein
fremder Bearbeiter hier schnell wird.

**3. Der Vertrag „JS verbessert nur" wird wirklich eingehalten.** Gemessen ohne
JavaScript und mit `prefers-reduced-motion`: 0 versteckte Elemente, 0 Kacheln,
volle Textmenge in `<main>`. Das ist keine Behauptung im Kommentar, das ist
nachgemessen — und für die GEO-Ziele dieses Projekts der wichtigste einzelne
Punkt.

**4. Null Abhängigkeiten.** `package.json` hat weder Laufzeit- noch
Entwicklungsabhängigkeiten. Für eine B2B-Seite, die Jahre stehen soll, ist das ein
echter Gewinn: keine Lieferketten-Angriffsfläche, kein `npm audit`, kein Bitrot
durch ein Major-Release, das niemand nachzieht.

**5. `content/values.json` zentralisiert die Werte, die jährlich wandern.**
Preise, Rating, Zuschläge. Eine Preisrunde ist eine Datei, nicht 36 Seiten —
nachgewiesen durch einen Probelauf, der 26-32 auf 29-35 gezogen hat.

---

## Befund 1 — Wiederholtes Sektions-Markup über 49 bis 58 Seiten

**Wirkung: hoch. Aufwand: mittel bis hoch. Risiko: mittel.**

Das Partial-System existiert (14 Partials, mit Parametern — `head-common` nimmt
`ogimage`, `price-box` nimmt Tick-Texte und CTA). Aber die *Sektionsstrukturen*
sind kopiert, nicht eingebunden. Gemessen:

| Struktur | in … Seiten |
|---|---|
| `pixel-seam` | 58 |
| `service-hero` | 56 |
| `faq__list` | 49 |
| `conversion` (das Formular) | 49 |
| `service-price` | 36 |
| `service-related` | 28 |
| `city-rates` | 10 |

Konkret heißt das: eine Änderung an der Form des FAQ-Blocks ist eine Änderung in
49 Dateien. Diese Sitzung hat das dreimal bezahlt — die Einwilligungs-Prüfung über
40 Formulare, die Einbindung von `filter-freigeben.js` in 56 Seiten, die
Einordnungsspalte in 10 Stadtseiten. Jedes Mal lief es über ein Skript, und jedes
Mal war das Skript nötig, weil man 49 Dateien nicht von Hand ändert.

**Warum es trotzdem verteidigbar ist:** Die 70 Seiten sind nicht 70 gleiche
Seiten. Es gibt zwölf Seitentypen, und die Reihenfolge der Sektionen ist je
Entwurf verschieden — bei den Kombiseiten ausdrücklich („Struktur variiert ggü.
Brandwache-Kombi"), zwischen 6 und 9 Sektionen in vier Formfamilien. Ein Partial
je Sektion ist deshalb richtig; ein Partial je *Seitentyp* wäre es nicht.

**Empfehlung:** Anfangen mit den zwei, die reine Verdopplung sind und keine
Variantenlogik brauchen — der `conversion`-Formularblock (49×, identische
Struktur, nur die Feld-IDs unterscheiden sich, und die kann ein Parameter tragen)
und die `faq__list`-Hülle (49×, die Fragen selbst bleiben in der Seite). Das sind
zwei Partials und nimmt der Wiederholung die Spitze, ohne an einer einzigen
Sektionsreihenfolge zu rühren.

**Was dagegen spricht, es JETZT zu tun:** Die Seiten sind kundengeprüft. 49 Seiten
auf ein Partial umzustellen heißt, 49 Seiten neu visuell zu prüfen, kurz vor dem
Launch. **Das ist eine Aufgabe für nach dem Launch.**

---

## Befund 2 — Die Testsuite deckt eine von vier Schichten

**Wirkung: mittel bis hoch. Aufwand: niedrig. Risiko: niedrig.**

67 Tests, alle in einer Datei, alle auf `api/_lib/*`: Validierung, Brevo, HubSpot.
Das ist die richtige Schicht zum Testen — dort liegt die Logik, die still falsch
sein kann, und die Tests sind gut: einer prüft, dass die Fehlerantwort nur
Feldnamen und keine Feldwerte enthält, zwei prüfen, welcher Abo-Typ welche
Rechtsgrundlage trägt.

Ungetestet:

* **`build.js`** — erzeugt alle 70 Seiten. Includes, Token-Ersetzung,
  Sitemap-Erzeugung, `PUBLIC_ENV`. Ein Fehler hier ist ein Fehler auf 70 Seiten.
* **Die 12 Bau-Tore selbst.** Sie prüfen den Bau; nichts prüft sie. Ein Tor, das
  wegen eines kaputten Selektors immer „ok" sagt, ist schlimmer als keins — und
  genau das ist in dieser Sitzung zweimal passiert: das Fremd-Host-Tor mit einem
  gefressenen Backslash, und `node --test tests/`, das stumm nichts gemeldet hat,
  während ich glaubte, 67 Tests liefen grün.
* **34 Browser-JS-Dateien, 7.503 Zeilen.**

**Was das Fehlen abmildert:** Die Bau-Tore *sind* faktisch die Integrationstests
für `build.js` — sie prüfen das Ergebnis. Und der No-JS-Vertrag bedeutet, dass ein
Fehler in einer JS-Datei die Seite nicht kaputt macht, sondern nur ihre
Verbesserung ausfallen lässt. Das ist eine bewusste Architektur, keine Lücke aus
Versehen.

**Empfehlung — der günstigste Gewinn im ganzen Projekt:** Ein Test je Bau-Tor, der
es gegen ein *absichtlich kaputtes* Fixture laufen lässt und erwartet, dass es
meldet. Zwölf kleine Tests, keine Mocks nötig, und sie fangen genau den Fehler,
der zweimal aufgetreten ist: einen Prüfmechanismus, der nichts mehr findet.
Danach `build.js` gegen ein Fixture-Verzeichnis — reine Funktionen, kein
I/O-Mocking nötig.

---

## Befund 3 — `page-service.css` ist das Designsystem mit einem Seitennamen

**Wirkung: mittel. Aufwand: niedrig. Risiko: niedrig bis mittel.**

6.338 Zeilen, und **56 Seiten laden es**. Es enthält `--content-inset`, die
`main h2`-Skala, den Brotkrumen-Chevron, `.section--light`, den ganzen
`.pixel-seam`-Block, `.service-hero*` und `.service-link` — also das Chassis, auf
dem Referenzen, Jobs, Ratgeber, Case Studies, Stadt- und Kombiseiten stehen. Der
Dateiname sagt „Seite: Service".

Das ist kein technisches Problem, es ist ein Auffindbarkeitsproblem mit einer
konkreten Folge: wer glaubt, er ändere eine Serviceseite, ändert 56. Die
Projekthistorie dokumentiert das inzwischen (`docs/page-conventions.md` §9.1 nennt
es „das Chassis"), aber der Dateiname widerspricht der Dokumentation.

**Empfehlung:** Den Chassis-Teil nach `css/chassis.css` herausziehen und in
`head-common` laden, so wie `components.css`. Was übrig bleibt, heißt dann zu
Recht `page-service.css`. Reine Verschiebung, keine Wertänderung — und mit einem
A/B-Bau über alle 70 Seiten nachweisbar folgenlos.

---

## Befund 4 — 23 `<script defer>` auf der Startseite

**Wirkung: niedrig bis mittel. Aufwand: mittel. Risiko: mittel.**

34 JS-Dateien, jede mit eigenem Tag: 23 auf der Startseite, 17 auf
`/werkschutz/`, 1 auf `/impressum/`. Jede Datei prüft selbst
`prefers-reduced-motion` und die Verfügbarkeit von GSAP und steigt sonst aus.

**Was dafür spricht, es zu lassen:** Über HTTP/2 sind 23 kleine Anfragen nicht
das, was diese Seite langsam macht. Vor allem aber trägt die Ladereihenfolge
Bedeutung: `filter-freigeben.js` muss vor den Reveal-Skripten stehen, das
Icon-Sprite vor allem, was `<use>` benutzt. Ein Bundler würde diese Annahmen
einsammeln, und sie sind nirgends maschinell geprüft.

**Empfehlung:** Nicht bündeln, solange die Messwerte gut sind. Wenn doch, dann
zusammen mit einem Tor, das die Reihenfolge festschreibt — sonst tauscht man 22
Anfragen gegen einen Fehler, der nur bei langsamer Verbindung auftritt.

---

## Zusammenfassung: was ich empfehlen würde

**Eine Sache vor dem Launch:** Befund 2, und davon nur die Tore-Tests. Zwölf
kleine Tests, ein Nachmittag, kein Risiko — und sie schließen die Lücke, die in
dieser Sitzung zweimal echten Schaden angerichtet hat.

**Alles andere nach dem Launch.** Befund 1 und 3 sind beide „richtig, aber jetzt
teuer": sie berühren 49 bzw. 56 kundengeprüfte Seiten. Befund 4 würde ich erst
anfassen, wenn eine Messung ihn zum Problem macht.

**Und der ehrlichste Satz zum Schluss:** Dieses Projekt hat für seine Größe
ungewöhnlich wenige strukturelle Schulden. Der QA-Auftrag nannte 29 Punkte; bei
sechs davon war die Prämisse nach der Messung nicht mehr haltbar, weil der Code
schon richtig war. Das ist die eigentliche Aussage dieser Beurteilung.
