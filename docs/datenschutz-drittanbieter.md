# Datenschutz: die zwei Drittanbieter-Abschnitte, aufbewahrt

Angelegt am 2026-08-24, weil der Kunde bestätigt hat: **Google Analytics und
reCAPTCHA sollen voraussichtlich noch eingesetzt werden.**

Beim Übernehmen der Übergangsfassung (Block J) sind die beiden letzten Abschnitte
der alten Datenschutzerklärung nicht mitgekommen, weil die Seite die Dienste heute
nicht einsetzt und eine Erklärung nicht beschreiben darf, was nicht passiert. Sie
stehen hier wörtlich, damit sie nicht verloren gehen, wenn die alte Domain umgestellt
wird — dort sind sie danach nicht mehr abrufbar.

## Wann sie zurückkommen

Nicht „wenn wir es vorhaben", sondern **wenn die Dienste tatsächlich laden**. Eine
Datenschutzerklärung beschreibt den Ist-Zustand: sie zu früh zu veröffentlichen ist
derselbe Fehler wie sie zu spät zu veröffentlichen, nur in die andere Richtung.

Die Reihenfolge, die dabei einzuhalten ist:

1. **Consent-Werkzeug zuerst.** Beide Dienste dürfen ohne Einwilligung nicht laden
   (§ 25 TDDDG für das Setzen der Cookies, DSGVO für die Verarbeitung dahinter).
   Ohne Banner davor wäre ihr Einsatz rechtswidrig — und dann hilft auch der beste
   Erklärungstext nicht.
2. **Dann die Dienste einbauen**, gesteuert über das Consent-Werkzeug
   (Consent Mode v2 für Analytics/Ads).
3. **Dann der Text.** Wenn Cookiebot läuft, erzeugt es die Abschnitte in der Regel
   selbst und hält sie aktuell — dann ist der Text unten nur die Rückfallebene.

## Was die CSP braucht

⚠️ Das ist der Punkt, der ohne Vorwarnung eine halbe Stunde kostet: `vercel.json`
liefert `script-src 'self'` ohne jeden Drittanbieter. Ein per `<script>` geladener
Dienst wird **stillschweigend geblockt** — kein Fehler auf der Seite, das Werkzeug
tut einfach nichts.

| Dienst | Nötige Ergänzungen |
|---|---|
| Consent-Werkzeug (Cookiebot) | `script-src` + `connect-src` + `img-src` des Anbieter-Hosts |
| Google Tag Manager / GA4 | `script-src https://www.googletagmanager.com`, `connect-src https://*.google-analytics.com https://*.analytics.google.com`, `img-src` für die Zählpixel |
| reCAPTCHA v3 | `script-src https://www.google.com https://www.gstatic.com`, `frame-src https://www.google.com`, `connect-src https://www.google.com` |

## ⚠️ Der Analytics-Text unten ist inhaltlich veraltet

Er beschreibt Universal Analytics, nicht GA4. **Nicht unverändert einsetzen** — drei
Stellen sind heute schlicht falsch:

| Im Text | Tatsächlich |
|---|---|
| „ausschließlich mit der Erweiterung `_anonymizeIp()`" | Diese Einstellung gibt es in GA4 nicht. IP-Kürzung passiert dort automatisch und ist nicht konfigurierbar |
| „nach 50 Monaten automatisch gelöscht" | GA4 bietet standardmäßig 2 oder 14 Monate Aufbewahrung |
| „Garantie auf Basis der Standardvertragsklauseln" | Seit Juli 2023 stützt sich der Transfer in die USA primär auf das EU-US Data Privacy Framework |

Deshalb ist die Empfehlung: **den Text von Cookiebot erzeugen lassen** und die
Fassung unten nur als Vergleich benutzen. Sie ist Archiv, keine Vorlage.

## Der Wortlaut der alten Seite

Abgerufen am 23.08.2026 von `https://frankonia-sicherheit.de/datenschutz/`,
unverändert. Überschriftenebene ist schon auf `h3` gesetzt, wie die Abschnitte im
befüllten `/datenschutz/` sie brauchen; einsetzen würde man sie am Ende von
`#datenschutz-inhalt`, vor dem Hinweiskasten.

```html
<h3>Hinweise zur Datenverarbeitung im Zusammenhang mit Google Analytics</h3>
<p>Diese Website benutzt Google Analytics, einen Webanalysedienst der Google Ireland Limited. Wenn der Verantwortliche für die Datenverarbeitung auf dieser Website außerhalb des Europäischen Wirtschaftsraumes oder der Schweiz sitzt, dann erfolgt die Google Analytics Datenverarbeitung durch Google LLC. Google LLC und Google Ireland Limited werden nachfolgend “Google” genannt.</p>
<p>Google Analytics verwendet sog. “Cookies”, Textdateien, die auf dem Computer des Seitenbesuchers gespeichert werden und die eine Analyse der Benutzung der Website durch den Seitenbesucher ermöglichen. Die durch das Cookie erzeugten Informationen über die Benutzung dieser Website durch den Seitenbesucher (einschließlich der gekürzten IP-Adresse) werden in der Regel an einen Server von Google übertragen und dort gespeichert.</p>
<p>Google Analytics wird ausschließlich mit der Erweiterung “_anonymizeIp()” auf dieser Website verwendet. Diese Erweiterung stellt eine Anonymisierung der IP-Adresse durch Kürzung sicher und schließt eine direkte Personenbeziehbarkeit aus. Durch die Erweiterung wird die IP-Adresse von Google innerhalb von Mitgliedstaaten der Europäischen Union oder in anderen Vertragsstaaten des Abkommens über den Europäischen Wirtschaftsraum zuvor gekürzt. Nur in Ausnahmefällen wird die volle IP-Adresse an einen Server von Google in den USA übertragen und dort gekürzt. Die im Rahmen von Google Analytics von dem entsprechenden Browser übermittelte IP-Adresse wird nicht mit anderen Daten von Google zusammengeführt.</p>
<p>Im Auftrag des Seitenbetreibers wird Google die anfallenden Informationen benutzen, um die Nutzung der Website auszuwerten, um Reports über die Websiteaktivitäten zusammenzustellen und um weitere mit der Websitenutzung und der Internetnutzung verbundene Dienstleistungen dem Seitenbetreiber gegenüber zu erbringen (Art. 6 Abs. 1 lit. f DSGVO). Das berechtigte Interesse an der Datenverarbeitung liegt in der Optimierung dieser Website, der Analyse der Benutzung der Website und der Anpassung der Inhalte. Die Interessen der Nutzer werden durch die Pseudonymisierung hinreichend gewahrt.</p>
<p>Google LLC. bietet eine Garantie auf Basis der Standardvertragsklauseln ein angemessenes Datenschutzniveau einzuhalten. Die gesendeten und mit Cookies, Nutzerkennungen (z. B. User-ID) oder Werbe-IDs verknüpften Daten werden nach 50 Monaten automatisch gelöscht. Die Löschung von Daten, deren Aufbewahrungsdauer erreicht ist, erfolgt automatisch einmal im Monat.</p>
<p>Die Erfassung durch Google Analytics kann verhindert werden, indem der Seitenbesucher die Cookie-Einstellungen für diese Website anpasst. Der Erfassung und Speicherung der IP-Adresse und der durch Cookies erzeugten Daten kann außerdem jederzeit mit Wirkung für die Zukunft widersprochen werden. Das entsprechende Browser- Plugin kann unter dem folgenden Link heruntergeladen und installiert werden: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">https://tools.google.com/dlpage/gaoptout</a>.</p>
<p>Der Seitenbesucher kann die Erfassung durch Google Analytics auf dieser Webseite verhindern, indem er auf folgenden Link klickt. Es wird ein Opt-Out-Cookie gesetzt, der die zukünftige Erfassung der Daten beim Besuch dieser Website verhindert.</p>
<p>Weitere Informationen zur Datennutzung durch Google, Einstellungs- und Widerspruchsmöglichkeiten, finden sich in der Datenschutzerklärung von Google (<a href="https://policies.google.com/privacy" target="_blank" rel="noopener">https://policies.google.com/privacy</a>) sowie in den Einstellungen für die Darstellung von Werbeeinblendungen durch Google (<a href="https://adssettings.google.com/authenticated" target="_blank" rel="noopener">https://adssettings.google.com/authenticated</a>).</p>
<h3>reCAPTCHA</h3>
<p>Zum Schutz Ihrer Anfragen per Internetformular verwenden wir den Dienst reCAPTCHA des Unternehmens Google LLC (Google). Die Abfrage dient der Unterscheidung, ob die Eingabe durch einen Menschen oder missbräuchlich durch automatisierte, maschinelle Verarbeitung erfolgt. Die Abfrage schließt den Versand der IP-Adresse und ggf. weiterer von Google für den Dienst reCAPTCHA benötigter Daten an Google ein. Zu diesem Zweck wird Ihre Eingabe an Google übermittelt und dort weiter verwendet. Ihre IP-Adresse wird von Google jedoch innerhalb von Mitgliedstaaten der Europäischen Union oder in anderen Vertragsstaaten des Abkommens über den Europäischen Wirtschaftsraum zuvor gekürzt. Nur in Ausnahmefällen wird die volle IP-Adresse an einen Server von Google in den USA übertragen und dort gekürzt. Im Auftrag des Betreibers dieser Website wird Google diese Informationen benutzen, um Ihre Nutzung dieses Dienstes auszuwerten. Die im Rahmen von reCaptcha von Ihrem Browser übermittelte IP-Adresse wird nicht mit anderen Daten von Google zusammengeführt. Für diese Daten gelten die abweichenden Datenschutzbestimmungen des Unternehmens Google. Weitere Informationen zu den Datenschutzrichtlinien von Google finden Sie unter: <a href="https://policies.google.com/privacy?hl=de" target="_blank" rel="noopener">https://policies.google.com/privacy?hl=de</a>.</p>
```
