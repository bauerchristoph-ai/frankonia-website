# Auftrag an Claude Cowork: Google Tag Manager in Ordnung bringen

Stand 05.09.2026. Alles darin ist **gemessen**, nicht vermutet — die Messwerte
stehen in `docs/launch-pruefprotokoll.md`, Abschnitt N47.

Diesen Text als Prompt in Claude Cowork geben, dort mit Zugriff auf den
Google-Tag-Manager-Container.

---

## Prompt (ab hier kopieren)

Du arbeitest am Google-Tag-Manager-Setup von FRANKONIA Sicherheit. Ziel: nach
erteilter Einwilligung sollen Seitenaufrufe und Conversions wieder gemessen
werden — client-side wie server-side. Aktuell feuert **kein einziger Tag**,
obwohl der Container fehlerfrei lädt.

### Was bereits belegt in Ordnung ist — bitte nicht daran arbeiten

Auf der Website ist alles geprüft und funktioniert:

- Die Content-Security-Policy erlaubt den Tagging-Server in `script-src`,
  `connect-src`, `frame-src` und `img-src`. Beim Laden entstehen **null**
  CSP-Verstöße.
- Consent Mode v2 ist korrekt verdrahtet: vor jedem Tag steht
  `gtag("consent","default", …)` mit allen sechs Signalen auf `denied`; nach
  Klick auf „Alle zulassen" folgt `gtag("consent","update", …)` mit allen sechs
  auf `granted`, und `ads_data_redaction` geht auf `false`.
- Der Container lädt vom eigenen Tagging-Server mit **HTTP 200** (462 KB) und
  läuft vollständig durch: `gtm.js` → `gtm.dom` → `gtm.load`.
- `window.google_tag_manager` enthält danach `GTM-NWLGMFJN` und `G-DCSDL25ZS6`.
- Der GA4-Loader `d.frankonia-sicherheit.de/gtag/js?id=G-DCSDL25ZS6` antwortet
  mit **HTTP 200** und 578 KB echtem JavaScript.
- `d.frankonia-sicherheit.de/g/collect` antwortet mit **200**, `/healthy`
  ebenfalls. Der Tagging-Server nimmt Treffer also an.
- Vor der Einwilligung geht **keine einzige** Anfrage an einen Messhost raus.
  Das ist so gewollt und muss so bleiben.

### Der Befund

Nach erteilter Einwilligung geht **kein Messtreffer** raus. Aus der
ausgelesenen Container-Konfiguration (24 Tags, 11 Trigger-Zuordnungen,
Tag-Typen `__googtag`, `__gaawe`, `__cl`, `__hl`, `__tg`, dazu zwei Vorlagen
aus der Galerie) stammen drei konkrete Ursachen:

**1. Die Consent-Brücke fehlt — das ist der Hauptblocker.**
Die Trigger-Bedingungen des Containers warten unter anderem auf das
benutzerdefinierte Ereignis **`stape_consent_update`**. Dieses Ereignis kommt im
dataLayer **nie vor**. Gemessen steht dort nach der Zustimmung nur:

```
["consent","default",{…alle sechs denied}]
["set","ads_data_redaction",true]
["consent","update",{…alle sechs granted}]
["set","ads_data_redaction",false]
{event:"cookie_consent_update"}
{event:"cookie_consent_preferences"}
{event:"cookie_consent_statistics"}
{event:"cookie_consent_marketing"}
{event:"gtm.js"} {event:"gtm.dom"} {event:"gtm.load"}
```

Also Cookiebots eigene Ereignisse — aber kein `stape_consent_update`.
**Aufgabe:** herausfinden, welcher Tag dieses Ereignis schreiben soll (vermutlich
die Stape-Consent-Vorlage), und ihn zum Laufen bringen. Falls das nicht
gewünscht ist: die betroffenen Trigger stattdessen auf Cookiebots
`cookie_consent_update` umstellen. **Nur eines von beidem**, nicht beides.

**2. Der Google-Tag sendet absichtlich keinen Seitenaufruf.**
In seiner Konfiguration steht:

```
"function":"__googtag", "vtp_configSettingsTable":[
  ["map","parameter","server_container_url","parameterValue", …],
  ["map","parameter","send_page_view","parameterValue","false"]]
```

**Aufgabe:** entweder `send_page_view` auf `true` setzen, oder sicherstellen,
dass das vorhandene GA4-Event-Tag mit dem Namen `page_view` auf einem Trigger
liegt, der bei jedem Seitenaufruf feuert. **Nicht beides** — sonst wird jeder
Seitenaufruf doppelt gezählt.

**3. Ein Trigger ist auf die Live-Domain festgenagelt.**
Eine Bedingung lautet wörtlich `https://frankonia-sicherheit.de/danke/`.
Getestet wird aber auf `https://frankonia-sicherheit-2.vercel.app/`. Dort kann
dieser Conversion-Trigger grundsätzlich nicht feuern.
**Aufgabe:** die Bedingung so fassen, dass sie auf beiden Domains greift — zum
Beispiel „Page Path **gleich** `/danke/`" statt der vollen URL. Der Pfad ist auf
beiden Domains identisch.

### Vorhandene GA4-Event-Tags

`page_view`, `contact`, `generate_lead`, `schedule` und viermal `standard`
(letzteres sind die Pixel-Events aus einer Galerie-Vorlage). Alle hängen an
derselben Consent-Brücke aus Punkt 1 — deshalb feuert auch der Pixel nicht.

### Wie geprüft wird, ob es funktioniert

1. Vorschaumodus auf `https://frankonia-sicherheit-2.vercel.app/` öffnen.
2. **Den Cookie-Banner im Vorschaufenster annehmen.** Ohne das darf und wird
   nichts feuern; die Tag-Assistant-Meldung „Eine Plattform zur
   Einwilligungsverwaltung blockiert möglicherweise Tags" beschreibt genau
   diesen erwarteten Zustand und ist kein Defekt.
3. Erwartet nach der Zustimmung: `stape_consent_update` (oder das ersetzende
   Ereignis) im dataLayer, der Google-Tag feuert, und eine Anfrage an
   `d.frankonia-sicherheit.de/g/collect` mit `en=page_view` geht raus.
4. Gegenprobe: **vor** der Zustimmung darf weiterhin **keine** Anfrage an einen
   Messhost gehen. Das ist die wichtigere der beiden Prüfungen.

### Randbedingungen

- Container `GTM-NWLGMFJN`, GA4 `G-DCSDL25ZS6`, Google-Tag `GT-WBLSBKFT`,
  Tagging-Server `d.frankonia-sicherheit.de` (stape).
- Die Google-Ads-Conversion-ID steht noch als Platzhalter und wird vom Kunden
  später selbst gesetzt — nicht raten.
- Nichts an der Website ändern. Alles Nötige liegt im Container.

## Prompt-Ende
