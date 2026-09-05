# Tracking: gelöst — und was in GTM noch offen ist

Stand 05.09.2026, gemessen am ausgelieferten Zustand von
`frankonia-sicherheit-2.vercel.app`. Die Zahlen stehen in
`docs/launch-pruefprotokoll.md`, Abschnitt N47.

## Was das Problem war

**Cookiebot hat den GTM-Container komplett blockiert.** Die automatische
Blockade (`data-blockingmode="auto"`) hat den Loader abgefangen, also lief der
Container erst nach der Zustimmung an — und dann in einer Reihenfolge, in der
keine Tags mehr feuerten.

Die Lösung ist `data-cookieconsent="ignore"` am Loader: der Container lädt
normal, und gesperrt wird allein über Consent Mode. Das entspricht der
Empfehlung von Google und von Cookiebot selbst.

⚠️ **Korrektur einer früheren Aussage von mir.** Ich hatte drei Befunde aus der
ausgelesenen Container-Konfiguration als Ursache benannt — fehlendes
`stape_consent_update`, `send_page_view: false`, ein Trigger auf der
Live-Domain. Die erste und zweite waren **nicht** die Ursache: ich hatte einen
Container ausgelesen, der zu spät geladen hatte. Mit normal ladendem Container
feuern die Tags.

## Was jetzt gemessen funktioniert

Nach Klick auf „Alle zulassen", alles mit echten Netzwerkanfragen belegt:

| | |
|---|---|
| GA4 `page_view` | `d.frankonia-sicherheit.de/g/collect`, `en=page_view`, `gcs=G111` |
| Facebook-Pixel | `connect.facebook.net/en_US/fbevents.js` + `signals/config/…` |
| Google Ads | `googleads.g.doubleclick.net/pagead/viewthroughconversion/…` |
| Google-Nutzerlisten | `google.com` und `google.de` `/pagead/1p-user-list/…` |

## ⚠️ Was sich vor der Einwilligung geändert hat — bitte bewusst entscheiden

Vorher gingen vor der Zustimmung **null** Anfragen an Messhosts. Jetzt sind es
vier, darunter **ein `/g/collect` mit `en=page_view` und `gcs=G100`**.

Das ist das vorgesehene Verhalten von Consent Mode: ein **cookieloser** Ping,
`ads_data_redaction` aktiv, keine Kennung gesetzt — die Grundlage für Googles
Modellierung. Übertragen wird dabei die aufgerufene Seiten-URL.

Rechtlich ist das in Deutschland nicht unumstritten. Zwei Wege:

- **So lassen** — Standard-Setup, volle Modellierung. Das ist der freigegebene
  Stand.
- **Zurücknehmen** — `data-cookieconsent="ignore"` entfernen. Dann geht vor der
  Zustimmung wieder nichts raus, aber die Tags feuern auch danach nicht mehr,
  solange die Ursache im Container nicht behoben ist.

Eine dritte Möglichkeit gibt es in GTM: den Google-Tag so einstellen, dass er
**vor** der Einwilligung gar nichts sendet (`Consent Mode` → keine Pings bei
`denied`). Dann lädt der Container früh, sendet aber erst nach der Zustimmung.
Das ist vermutlich die Fassung, die du willst — sie behält beides.

## Was in GTM noch zu tun ist

1. **Conversion-ID setzen.** Die Ads-Aufrufe gehen aktuell an
   `…/viewthroughconversion/PUT_YOUR_VALUE_HERE/`. (Machst du selbst.)
2. **Den `/danke/`-Trigger entnageln.** Eine Trigger-Bedingung lautet wörtlich
   `https://frankonia-sicherheit.de/danke/`, also die Live-Domain — auf der
   Testdomain kann diese Conversion nicht feuern. Besser: „Page Path **gleich**
   `/danke/`", der Pfad ist auf beiden Domains identisch.
3. **Optional**, falls du Punkt 3 oben willst: im Google-Tag die Pings bei
   verweigerter Einwilligung abschalten.

## Wie geprüft wird

1. Vorschaumodus auf `https://frankonia-sicherheit-2.vercel.app/`.
2. **Den Cookie-Banner im Vorschaufenster annehmen** — sonst feuert
   bestimmungsgemäß nichts, und die Tag-Assistant-Meldung „Eine Plattform zur
   Einwilligungsverwaltung blockiert möglicherweise Tags" beschreibt genau
   diesen Zustand.
3. Erwartet: `page_view` mit `gcs=G111`, `fbevents.js`, und die Ads-Aufrufe.
