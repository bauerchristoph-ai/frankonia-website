# Prompt für Cowork — Google Tag Manager, Stand 05.09.2026

Zum Kopieren. Alles darunter ist der Prompt.

---

Du arbeitest im Google Tag Manager für FRANKONIA Sicherheit. Die Website ist
fertig und gemessen; alles Folgende ist **nur** im Container zu erledigen, an
der Website darf nichts geändert werden.

## Was schon geprüft und in Ordnung ist — bitte nicht „reparieren"

Gemessen am 05.09.2026 auf `https://frankonia-sicherheit-2.vercel.app/`, mit
echten Netzwerkanfragen belegt, **nach** Klick auf „Alle zulassen":

| | Zustand |
|---|---|
| GTM-Container | lädt normal, wird **nicht** mehr von Cookiebot blockiert |
| GA4 `page_view` | geht raus, `en=page_view`, `gcs=G111` |
| Google Ads | `googleads.g.doubleclick.net/pagead/viewthroughconversion/…` |
| Google-Nutzerlisten | `google.com` und `google.de` `/pagead/1p-user-list/…` |
| Meta `fbevents.js` | geladen, `signals/config/25932606063047409` geladen |

Die frühere Meldung im Tag Assistant, eine Plattform zur Einwilligungs-
verwaltung blockiere möglicherweise Tags, kam daher, dass der Cookie-Banner im
Vorschaufenster nicht angenommen wurde. **Beim Prüfen immer erst zustimmen.**

## Aufgabe 1 — der Meta-Pixel feuert kein Ereignis (der eigentliche Blocker)

Der Pixel Helper zeigt nichts an. Das stimmt, und die Ursache ist eingegrenzt:

| Prüfung | Ergebnis |
|---|---|
| `window.fbq` | vorhanden, Version 2.9.393 |
| `fbq.getState().pixels` | `["25932606063047409"]` — **`init` ist gelaufen** |
| **Anfragen an `facebook.com/tr`** | **0** ← genau das sucht der Pixel Helper |
| `fbq.queue` | 0 — es wartet also auch nichts |

Der Pixel wird also initialisiert, aber es wird **kein Ereignis getrackt**. Es
fehlt der `PageView`.

Bitte im Container prüfen, ob es neben dem Init-Tag ein Tag gibt, das
`fbq("track", "PageView")` auslöst. Die vier Tags mit dem Ereignisnamen
`standard` sind die Kandidaten. Entweder hat keines davon einen Trigger, der
bei jedem Seitenaufruf greift, oder das Init-Tag unterdrückt den automatischen
PageView.

**Gegenprobe nach der Änderung:** nach erteilter Zustimmung muss eine Anfrage
an `https://www.facebook.com/tr/?id=25932606063047409&ev=PageView` rausgehen.
Erst dann zeigt der Pixel Helper etwas an.

## Aufgabe 2 — den `/danke/`-Trigger entnageln

Eine Trigger-Bedingung lautet wörtlich `https://frankonia-sicherheit.de/danke/`,
also die Live-Domain. Auf der Testdomain kann diese Conversion damit nicht
feuern, und nach dem Domainumzug ist sie erneut zu pflegen.

Bitte umstellen auf **Page Path — gleich — `/danke/`**. Der Pfad ist auf beiden
Domains identisch.

## Aufgabe 3 — Entscheidung: cookieloser Ping vor der Einwilligung

⚠️ Das ist eine Entscheidung, keine reine Umsetzung. Bitte Rückfrage an
Christoph, bevor etwas geändert wird.

Seit der Container normal lädt, gehen **vor** der Zustimmung vier Anfragen an
Messhosts raus, darunter ein `/g/collect` mit `en=page_view` und `gcs=G100`.
Das ist das vorgesehene Verhalten von Consent Mode: ein cookieloser Ping,
`ads_data_redaction` aktiv, keine Kennung gesetzt — die Grundlage für Googles
Modellierung. Übertragen wird dabei die aufgerufene Seiten-URL. In Deutschland
ist das nicht unumstritten.

Zwei Möglichkeiten, beide sauber:

1. **So lassen.** Standard-Setup, volle Modellierung.
2. **Im Google-Tag die Pings bei verweigerter Einwilligung abschalten.** Dann
   lädt der Container weiterhin früh, sendet aber erst nach der Zustimmung.

⚠️ Was **nicht** funktioniert: `data-cookieconsent="ignore"` am Loader wieder
entfernen. Dann geht vorher nichts raus, aber die Tags feuern auch danach nicht
mehr — das war genau der Ausgangszustand.

## Nicht deine Aufgabe

Die Ads-Conversion-ID (aktuell `PUT_YOUR_VALUE_HERE`) setzt Christoph selbst.

## Wie geprüft wird

1. Vorschaumodus auf `https://frankonia-sicherheit-2.vercel.app/`.
2. **Den Cookie-Banner im Vorschaufenster annehmen.**
3. Erwartet: `page_view` mit `gcs=G111`, `fbevents.js`, die Ads-Aufrufe — und
   nach Aufgabe 1 zusätzlich `facebook.com/tr` mit `ev=PageView`.
