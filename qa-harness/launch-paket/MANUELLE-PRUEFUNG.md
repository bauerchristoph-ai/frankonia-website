# Manuelle Prüfsession vor dem Launch

**Stand 01.09.2026 · Testdomain: `https://frankonia-sicherheit-2.vercel.app`**
**Zeitbedarf: rund 40 Minuten.** 12 Punkte, davon 5 Pflicht.

---

## Der Grundsatz dieser Liste

Sie enthält **nur, was eine Maschine nicht prüfen kann.** Alles Messbare ist
gemessen und grün:

> 58/58 Seiten HTTP 200 · 65/65 Weiterleitungen am richtigen Ziel · 60/60
> kanonische Adressen · 12 Bau-Tore · 67/67 Tests · Kontraste über zehn Seiten ·
> 28/28 Kartenkacheln · keine kaputten internen Links

**Das muss also nicht nachgeklickt werden.** Und die 26 Stadt- und Kombiseiten
sind aus einem Skript entstanden: ist eine richtig, sind alle richtig. Deshalb je
Seitentyp EIN Vertreter statt aller 70 Seiten.

Was übrig bleibt, sind vier Sorten Fragen: **kommt eine Anfrage wirklich an**,
**verhält sich die Einwilligung richtig**, **sieht es auf einem echten Gerät gut
aus**, und **stimmt der Text**.

---

## Pflicht — ohne diese fünf würde ich nicht live gehen

### 1 · Die Hauptanfrage, von Anfang bis Ende  ⏱ 8 min

Startseite → Formular „Kostenlose Sicherheitsanalyse" ausfüllen und **abschicken**.

Als Name/Firma etwas klar Erkennbares nehmen, z. B. `TEST 01.09. bitte loeschen`,
und eine eigene Adresse.

Prüfen, in dieser Reihenfolge:

- [ ] Landet man auf `/danke/`?
- [ ] Kommt die **Benachrichtigungs-E-Mail** an — und steht der Firmenname darin?
- [ ] Kommt die **Bestätigung an den Absender** an?
- [ ] Ist in **HubSpot** ein Kontakt entstanden, mit dem eingegebenen Firmennamen?
- [ ] Steht bei diesem Kontakt als Rechtsgrundlage **„Vertragsanbahnung"** bzw.
      `PERFORMANCE_OF_CONTRACT` — und **nicht** „Berechtigtes Interesse"?

> ⚠️ Der letzte Punkt ist der wichtigste der ganzen Liste. Genau das war am
> 31.08. falsch: ohne Marketing-Häkchen wurde gar keine Grundlage übertragen und
> HubSpot füllte „Berechtigtes Interesse – Sonstige" ein. Behoben und mit Tests
> abgedeckt, aber einmal mit echten Augen gesehen ist es wert.

**Danach denselben Vorgang mit gesetztem Marketing-Häkchen:** dann muss ein
zweites Abonnement „Marketing Information" mit **Einwilligung** dranstehen.

**Testdatensätze hinterher löschen.**

---

### 2 · Die Bewerbung  ⏱ 5 min

`/jobs/` → Bewerbungsformular abschicken (das ist ein **anderes** Formular,
eingebettet von HubSpot).

- [ ] Geht es überhaupt raus?
- [ ] Landet man auf **`/danke-bewerbung/`**?

> ⚠️ **Der zweite Punkt wird wahrscheinlich fehlschlagen, und das ist bekannt.**
> Die Weiterleitung ist nicht im Code zu setzen — das eingebettete Formular liest
> sie aus dem HubSpot-Portal. Die Seite existiert und ist erreichbar. Wenn du
> stattdessen auf `/danke/` oder einer HubSpot-Seite landest, ist genau das die
> letzte offene Einstellung.

---

### 3 · Der Einwilligungsdialog  ⏱ 5 min

Im **privaten Fenster** öffnen, damit der Dialog erscheint.

- [ ] Erscheint er auf **Deutsch**? (Er war live englisch, `data-culture="DE"` ist
      gesetzt.)
- [ ] **Ablehnen** wählen → Seite normal nutzbar, Formular absendbar?
- [ ] Nach dem Ablehnen: in den Entwicklertools unter *Netzwerk* prüfen, dass
      **kein** Google-Analytics- oder Tag-Manager-Aufruf rausgeht.
- [ ] **Annehmen** wählen → jetzt gehen sie raus?

---

### 4 · Eine Stadtseite und eine Kombiseite  ⏱ 5 min

Je eine, z. B. `/sicherheitsdienst-wuerzburg/` und `/brandwache-nuernberg/`.

- [ ] Stimmt der Ortsname überall — Titel, H1, Text, Karte?
- [ ] Die **Preistabelle**: vier Zeilen, jede mit eigener Einordnung („Mittelfeld
      — …", „Oberes Drittel — …")? Das ist neu von gestern.
- [ ] Wird der Umriss der Stadt gezeichnet, wenn man hinscrollt?
- [ ] Bei `/brandwache-nuernberg/`: ist **Anrufen** der blaue Hauptknopf und das
      Formular der zweite? (Absicht — nur bei Brandwache.)

> Diese beiden vertreten **26 der 70 Seiten.** Sie sind aus einem Skript
> entstanden; was hier stimmt, stimmt überall.

---

### 5 · Ein echtes Telefon  ⏱ 8 min

Startseite und **eine** Serviceseite, z. B. `/werkschutz/`, auf deinem Handy.

- [ ] Menü öffnen → passen alle Punkte **plus** der CTA auf einen Bildschirm?
- [ ] Untermenüs (Leistungen, Einsatzgebiete) auf- und zuklappen — lesbar?
- [ ] Einmal ganz durchscrollen: bleibt irgendwo Text **hinter dem Logo** stehen?
      (Neu: der Header wird nach dem Hero deckend.)
- [ ] Auf die Telefonnummer tippen → wählt das Telefon?
- [ ] WhatsApp-Knopf → öffnet er den richtigen Chat?
- [ ] Formular: springt die Ansicht beim Antippen eines Feldes **nicht** zoomend?

---

## Sollte — sichtbar, aber nicht existenzkritisch

### 6 · Das neue Favicon  ⏱ 1 min
- [ ] Tab: runder weißer Kreis mit dem blauen Zeichen?
- [ ] Lesezeichen setzen → auch dort rund?
- [ ] Optional iPhone „Zum Home-Bildschirm": dort ist es ein **gerundetes
      Quadrat**, kein Kreis — das ist Absicht, iOS maskiert selbst und füllt
      Transparenz mit Schwarz.

### 7 · Die zwei Karten  ⏱ 3 min
- [ ] Startseite, Abschnitt Einsatzgebiete: lädt die Karte, **ohne** diagonales
      „API KEY REQUIRED"?
- [ ] Eine Stadt anklicken → zoomt sie auf den Umriss?
- [ ] „Alle" → sieht man alle 15 Orte?
- [ ] `/kontakt/`: lädt die zweite Karte?

### 8 · Eine Serviceseite in Ruhe  ⏱ 4 min
`/werkschutz/`, am Rechner, einmal langsam durchscrollen.
- [ ] Bleibt irgendwo Text unsichtbar oder verschwommen stehen?
- [ ] Wird der Leistungsumfang Punkt für Punkt aufgedeckt?
- [ ] Zeichnen sich die Illustrationen?

### 9 · Die Rechtsseiten  ⏱ 3 min
- [ ] `/impressum/` und `/datenschutz/`: **Strg+F** nach „Bamberg" — findet es?
      (Diese Seiten laden absichtlich keine Animationsbibliotheken, damit Text
      wirklich auffindbar ist.)
- [ ] Im Datenschutz die Abschnitte **3.3 bis 3.7** überfliegen — die sind neu und
      **noch nicht anwaltlich geprüft.**
- [ ] Rechtsklick → *Seitenquelltext anzeigen* → keine internen Notizen sichtbar?

### 10 · Ein Ratgeber-Artikel  ⏱ 2 min
`/ratgeber/kosten-sicherheitsdienst/`
- [ ] Stimmen alle Preise (**24,50–32 €/Std.**) und rechnen die Beispiele auf?
- [ ] Überschrift höchstens **drei Zeilen** am großen Bildschirm? (Neu.)

---

## Nur du kannst das prüfen

### 11 · Der Text  ⏱ nach Bedarf
Kein Webtext wurde inhaltlich geändert — mit **zwei** Ausnahmen, und beide bitte
gegenlesen:

- [ ] **Sonntagszuschlag** im Kostenratgeber: 26 % von 768 € sind **199,68**, nicht
      215. Steht jetzt als 153–200 €.
- [ ] **Einordnungsspalte** der Stadtseiten: wortgleich aus dem Kostenratgeber
      übernommen, beim Werkschutz gekürzt (dort stand „technik-geschulte Kräfte"
      sonst zweimal in einer Zeile).

Und drei Stellen, die aus meinen Entscheidungen stammen:
- [ ] „Videoüberwachung" statt „Videotürme" (3 Dateien) — passt das Wort?
- [ ] „Torbuch" ist raus, Aufzählungen wurden dabei geglättet.
- [ ] Die drei Schrittbeschriftungen im Konzept-Diagramm.

### 12 · Aufräumen  ⏱ 2 min
- [ ] HubSpot-Testdaten von gestern löschen: Kontakt **244207392966**, Firma
      **445068333287** („FRANKONIA Testeintrag").
- [ ] ⚠️ **Und die Verknüpfung dieses Testkontakts mit dem ECHTEN Datensatz
      „FRANKONIA Sicherheitsdienst"** — die ist beim Testlauf entstanden und ist
      der Grund, warum die Kontaktkarte den falschen Firmennamen zeigte.
- [ ] Die Testdaten aus Punkt 1 und 2 dieser Liste ebenfalls.

---

## Nach dem Domainumzug — drei Minuten, unverzichtbar

```
curl -sI https://frankonia-sicherheit.de/ | grep -i x-robots
```
- [ ] **Keine Ausgabe** erwartet. Kommt hier `noindex`, ist die Website für Google
      unsichtbar. Der Header ist an `*.vercel.app` gebunden und sollte von selbst
      wegfallen — aber es ist der Fehler, der alles kostet, und er dauert fünf
      Sekunden.

```
npm run pruefe:live -- https://frankonia-sicherheit.de
```
- [ ] Erwartet: `keine Probleme.` Das Skript kennt den Unterschied — auf einer
      Testadresse verlangt es `noindex`, auf der Zieldomain verbietet es ihn.

- [ ] In der Google Search Console die neue Sitemap einreichen:
      `https://frankonia-sicherheit.de/sitemap.xml`

---

## Was ich NICHT auf die Liste gesetzt habe, und warum

Damit klar ist, dass es nicht vergessen wurde:

| Nicht drauf | Weil |
|---|---|
| Die anderen 11 Serviceseiten | Aus einem Skript, identischer Aufbau. Eine reicht. |
| Die anderen 9 Stadt- und 15 Kombiseiten | Dasselbe. |
| Alle 58 Seiten aufrufen | Maschinell geprüft, 58/58 HTTP 200. |
| Die 65 Weiterleitungen | Maschinell geprüft, 65/65 am richtigen Ziel. |
| Kontraste nachmessen | Über zehn Seiten bei zwei Breiten gemessen; zwei begründete Ausnahmen sind dokumentiert. |
| Interne Links klicken | Maschinell geprüft, keine kaputten in `<main>`. |
| Sitemap gegen Seitenbestand | Bau-Tor, prüft beide Richtungen bei jedem Bau. |
