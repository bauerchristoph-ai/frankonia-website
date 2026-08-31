# Entscheidungsprotokoll /datenschutz/

Verschoben aus `pages/datenschutz.html` am 31.08.2026 (QA-Aufgabe 5).

**Warum:** der Text stand als HTML-Kommentar in der Seite und wurde
mitausgeliefert — 8.026 Zeichen interner Arbeitsanweisungen, mit „Quelltext
anzeigen" für jeden lesbar. Alle neun anderen geprüften Seiten lieferten nur
den 130 bis 144 Zeichen langen Generator-Hinweis aus.

Dass er überhaupt durchkam, hatte eine eigene Ursache: der Kommentar erwähnt
ein Script-Tag im Prosatext, und die damalige Schutzbereichs-Suche in
`build.js` las das als echtes Tag. Damit galt der Bereich als schützenswert
und der Kommentar blieb stehen. Ein Kommentar, der über Script-Tags schreibt,
machte sich selbst immun gegen den Kommentar-Entferner. Das ist repariert
(`stripHtmlComments`, Einzeldurchlauf), und ein Bau-Tor prüft es seither.

---

## ⚠️ KORREKTUR ZUM STAND 31.08.2026

Der Text unten sagt an einer Stelle:

> Diese Seite setzt beides NICHT ein — es gibt kein Analytics, kein Tag
> Manager, kein reCAPTCHA

**Das ist seit dem Einbau der Einwilligungsverwaltung nicht mehr richtig.**
Stand heute gilt:

- **Google Tag Manager: ja**, Container `GTM-NWLGMFJN`, ausgeliefert über die
  eigene Subdomain `d.frankonia-sicherheit.de`, und **erst nach Zustimmung**.
- **Google Analytics 4, Google Ads, Meta-Pixel: ja**, über den Tag Manager,
  ebenfalls erst nach Zustimmung.
- **reCAPTCHA: nein.** Der Spamschutz ist Cloudflare Turnstile.
- Die Abschnitte 3.3 bis 3.6 der Erklärung benennen das seit dem 31.08.2026
  namentlich (QA-Aufgabe 3).

Am Consent-Verhalten selbst ändert die Korrektur nichts: ohne Zustimmung
wurden am Netzwerkmitschnitt null Fremdanfragen und null Cookies gemessen.

---

## Ursprünglicher Kommentartext, wörtlich

```
/datenschutz/ — ÜBERGANGSFASSUNG, Block J, 2026-08-23. Der Rechtstext ist
der der alten Live-Seite (https://frankonia-sicherheit.de/datenschutz/,
abgerufen am 23.08.2026), Wort für Wort — Auftrag: "Übernimm den aktuellen
Datenschutztext als Übergangsfassung, damit die Seite ab Tag eins rechtlich
befüllt ist". Kein Satz ist umformuliert; er ist maschinell aus der
Live-Seite extrahiert, nicht abgeschrieben, weil bei einem Rechtstext ein
Tippfehler eine inhaltliche Änderung ist.

ZWEI STRUKTURELLE ANPASSUNGEN, beide ohne Textänderung:
- Überschriftenebenen h4/h5 -> h3/h4, weil diese Seite schon h1 und h2 hat
und eine übersprungene Ebene gegen die Projektregeln geht (dieselbe
Abweichung, die /impressum/ gegenüber der Live-Seite macht).
- E-Mail-Adressen und die Telefonnummer sind verlinkt.

⚠️⚠️ WAS BEWUSST NICHT ÜBERNOMMEN WURDE: die beiden letzten Abschnitte der
alten Erklärung, "Hinweise zur Datenverarbeitung im Zusammenhang mit Google
Analytics" und "reCAPTCHA". Diese Seite setzt beides NICHT ein — es gibt kein
Analytics, kein Tag Manager, kein reCAPTCHA, und die CSP in vercel.json
erlaubt `script-src 'self'` ohne jeden Drittanbieter. Beide Abschnitte hier
zu veröffentlichen würde eine Verarbeitung erklären, die nicht stattfindet;
das ist keine Formulierungsfrage, sondern eine falsche Aussage in einem
rechtlich verbindlichen Dokument. Sie kommen zurück, sobald die Dienste
wirklich laufen — dann zusammen mit dem Consent-Banner und der
Cookiebot-Deklaration.
⚠️ DER KUNDE HAT AM 24.08.2026 BESTÄTIGT, dass beide Dienste voraussichtlich
noch kommen. Der Wortlaut der alten Seite ist deshalb aufbewahrt in
docs/datenschutz-drittanbieter.md — mit der Reihenfolge (Consent-Werkzeug
zuerst, dann die Dienste, dann der Text), den nötigen CSP-Ergänzungen, und
dem Hinweis, dass der alte Analytics-Abschnitt Universal Analytics
beschreibt und für GA4 an drei Stellen falsch ist. Nicht ungeprüft
zurückkopieren.

⚠️ NOINDEX IST ENTFERNT (Auftrag: "Danach noindex entfernen und die URL in
die Sitemap aufnehmen"). Die Seite steht jetzt in sitemap.xml. Der Grund ist
derselbe, der die Seite überhaupt erzwungen hat: sie ist aus dem Footer jeder
Seite UND aus der Einwilligungs-Checkbox des Formulars verlinkt.

⚠️⚠️ 2026-08-26 — DER TEXT IST AUF AUSDRÜCKLICHE ANWEISUNG DES KUNDEN
ÜBERARBEITET ("Datenschutz — optimiere es einfach selbst so dass es am
sinnvollsten ist und am besten passt"). Damit ist für DIESE EINE SEITE die
Projektregel "bestehende Webtexte nicht inhaltlich ändern" aufgehoben, und
zwar nur hier: bei einer Datenschutzerklärung ist eine falsche Aussage kein
Redaktionsgeschmack, sondern eine falsche Pflichtinformation nach Art. 13
DSGVO. Was geändert wurde, in zwei Gruppen:

BEHOBEN, weil nachweislich falsch:
1. Abschnitt 5.1 nannte "die Verschwiegenheitspflicht gem. § 83 StBerG" —
das Steuerberatungsgesetz, ein Baustein aus einer Steuerberater-Vorlage.
Er SCHRÄNKTE das Auskunftsrecht der Besucher unter Berufung auf eine Norm
ein, die für einen Sicherheitsdienstleister nicht gilt. Der Satz ist
gekürzt, nicht gestrichen: der zweite Grund darin (überwiegendes
berechtigtes Interesse eines Dritten) ist einschlägig und bleibt.
2. Die zweite Unterüberschrift in Abschnitt 2 hieß "2.1 Aufruf der Webseite",
obwohl darunter das Kontaktformular steht -> "2.2 Kontaktformular".
3. Abschnitt 6 nannte als Stand den 18.05.2018 -> 26.08.2026.
4. Abschnitt 2.1 nannte die Domain als "www.frankonia-sicherheit.de". Die
Seite läuft auf der nackten Domain, www wird darauf umgeleitet.
5. ⚠️⚠️ ABSCHNITT 4 BESCHRIEB COOKIES, DIE ES NICHT GIBT — Session-Cookies,
temporäre Cookies und Cookies "zu statistischen Zwecken". Gemessen: im
gesamten eigenen JavaScript kein einziges "document.cookie", kein
localStorage, kein sessionStorage, und es ist kein Analysewerkzeug
eingebunden. Der Abschnitt erklärte also eine Verarbeitung, die gar nicht
stattfindet — und beschrieb dabei ausgerechnet Analyse-Cookies, die
einwilligungspflichtig wären. Er sagt jetzt, was zutrifft.

ERGÄNZT, weil die Verarbeitung stattfindet und nicht genannt war:
6. 2.3 Bewerbungen über das Karriereformular, inklusive Lebenslauf-Upload
(/jobs/ nimmt name, email, phone, qualification, message und cv als
.pdf/.doc/.docx).
7. 3.1 Hosting — Art. 13 Abs. 1 Buchst. e) verlangt die Empfänger, und der
Logfile-Abschnitt sprach nur von "dem Server dieser Webseite".
8. 3.2 Kartendarstellung — die Kacheln kommen von CARTO (aus
OpenStreetMap-Daten) und übertragen die IP der Besucher an einen Dritten.
Betroffen sind /, /einsatzgebiete/ und /kontakt/.
9. 3.3 Verlinkte Dienste — WhatsApp, die Social-Profile, die
HubSpot-Terminbuchung, die Google-Route und das Google-Bewertungsprofil.
Alle sind reine LINKS: vor dem Klick verlässt kein Datum die Seite.

⚠️ ZWEI PUNKTE, DIE NUR DER KUNDE ODER SEIN ANWALT BEANTWORTEN KANN und die
deshalb als Frage im Text stehen, nicht als Behauptung: ob mit dem Hoster ein
Auftragsverarbeitungsvertrag nach Art. 28 DSGVO besteht, und wie lange
Bewerbungsunterlagen aufbewahrt werden. Beides ist im Markup an der Stelle
markiert. Eine erfundene Vertragsaussage wäre schlimmer als eine Lücke.

Der Verantwortlichen-Block oben stand schon vorher hier und ist um die
Angaben aus Abschnitt 1 der alten Erklärung ergänzt — insbesondere um den
Datenschutzbeauftragten, den die Shell überhaupt nicht nannte, obwohl
Art. 13 Abs. 1 Buchst. b) DSGVO ihn verlangt, sobald einer benannt ist.

Die ursprüngliche Shell-Begründung (Kunde, Feedback
2026-08-13, Q1: "Datenschutz: we will integrate an automatic privacy-policy
scanner that keeps the text up to date — details follow later. Plan the
/datenschutz/ page as a shell for now").

⚠️ WHY THIS PAGE EXISTS AT ALL RATHER THAN WAITING FOR THE SCANNER: /datenschutz/
was already linked from the footer of all 19 pages AND from the consent
checkbox of the shared lead form ("Ich habe die Datenschutzerklärung gelesen
und stimme zu"). A consent checkbox whose privacy link 404s is not a cosmetic
gap — it is the one broken link on this site with a legal consequence, since
the visitor is being asked to confirm they read a document that cannot be
opened. The shell closes that.

⚠️ NOTHING IN <main> IS INVENTED LEGAL TEXT, and that is still true after the
interim version landed: every sentence of it is the client's own, from the old
live page. What this build wrote itself is exactly one paragraph, the marked
note at the end about the revised version and the supervisory authority — and
it makes no statement about legal bases, retention or transfers.

⚠️⚠️ TWO THINGS THE NEXT PERSON HAS TO DO WHEN THE SCANNER ARRIVES:

1. THE CSP WILL BLOCK IT. vercel.json ships `script-src 'self'` with no
third-party hosts, so a scanner delivered as an external <script> (which is
how eRecht24, Usercentrics and the rest all work) is silently blocked and
the page just stays empty. Its host has to be added to `script-src`, and
to `connect-src` if it fetches its text at runtime. Expect to debug this if
nobody reads this comment.

2. REMOVE THE `noindex`. It is set below ON PURPOSE while the text is a
placeholder — a thin, incomplete privacy page is not something to put in
an index — but the finished policy should be indexable like the Impressum.

The scanner's output goes inside #datenschutz-inhalt, replacing the interim
notice. Everything above and below that div is page chrome and stays. 
```
