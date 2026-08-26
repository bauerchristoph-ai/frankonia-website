/*
 * HTTP-Aufrufe an Fremd-APIs: harter Timeout, Retry mit exponentiellem
 * Backoff, und ein Ergebnis, das nie wirft. 2026-08-26.
 *
 * ⚠️ WARUM NIE WIRFT: Der Endpoint darf eine Anfrage nicht verlieren, weil
 * HubSpot 502 antwortet. Ein geworfener Fehler würde durch den Handler nach
 * oben laufen und dort einen 500 erzeugen — also genau das, was die Regel
 * verbietet. Deshalb gibt jede Funktion hier ein Ergebnisobjekt zurück, und
 * der Aufrufer entscheidet, ob der Teilschritt entbehrlich ist.
 *
 * ⚠️ KEINE ABHÄNGIGKEIT: `fetch`, `AbortController` und `crypto` sind in Node
 * ab 18 eingebaut. Dieses Projekt hat null Laufzeit-Abhängigkeiten, und das
 * bleibt so.
 */

const { log } = require("./log");

const TIMEOUT_MS = 10000;
const VERSUCHE = 3;

/**
 * Warum nur bei 5xx, 408, 429 und Netzfehlern erneut versucht wird:
 * ein 400 oder 401 wird beim zweiten Mal genauso scheitern. Ein Retry darauf
 * kostet nur Zeit — und Zeit ist hier das Budget, das dem Besucher fehlt,
 * bevor er eine Antwort sieht.
 */
function wiederholbar(status) {
  return status === 0 || status === 408 || status === 429 || (status >= 500 && status <= 599);
}

function schlafen(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Ein Aufruf mit Timeout. Gibt { ok, status, body, error } zurück und wirft
 * nie.
 */
async function einmal(url, optionen) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...optionen, signal: ctrl.signal });
    const text = await res.text();
    let body = text;
    // Fremd-APIs antworten fast immer JSON, aber nicht immer — ein
    // Gateway-Fehler kommt als HTML. Deshalb versuchen, nicht voraussetzen.
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = text.slice(0, 500);
      }
    }
    return { ok: res.ok, status: res.status, body, error: null };
  } catch (err) {
    // AbortError bei Timeout, TypeError bei Netzfehler.
    const abgebrochen = err && err.name === "AbortError";
    return {
      ok: false,
      status: 0,
      body: null,
      error: abgebrochen ? "timeout nach " + TIMEOUT_MS + "ms" : String(err && err.message || err),
    };
  } finally {
    clearTimeout(t);
  }
}

/**
 * Ein Aufruf mit bis zu drei Versuchen. `name` und `submissionId` gehen nur
 * ins Log, nicht an die Fremd-API.
 */
async function anfrage(name, submissionId, url, optionen) {
  let letzte = null;
  for (let versuch = 1; versuch <= VERSUCHE; versuch++) {
    letzte = await einmal(url, optionen);
    if (letzte.ok) {
      if (versuch > 1) log.info(submissionId, name + ": erfolgreich im Versuch " + versuch);
      return letzte;
    }
    if (!wiederholbar(letzte.status)) {
      // Endgültig. Der Body kann Feldwerte zurückspiegeln, deshalb maskiert.
      log.warn(submissionId, name + ": " + letzte.status + " endgueltig", letzte.body || letzte.error);
      return letzte;
    }
    if (versuch < VERSUCHE) {
      // 400ms, 800ms — exponentiell, plus Jitter, damit parallele Anfragen
      // nach einem Ausfall nicht im Gleichschritt erneut anklopfen.
      const wartezeit = 400 * Math.pow(2, versuch - 1) + Math.floor(Math.random() * 150);
      log.warn(submissionId, name + ": " + (letzte.status || "netzfehler") + ", erneut in " + wartezeit + "ms");
      await schlafen(wartezeit);
    }
  }
  log.warn(submissionId, name + ": nach " + VERSUCHE + " Versuchen aufgegeben", letzte.body || letzte.error);
  return letzte;
}

module.exports = { anfrage, einmal, wiederholbar, TIMEOUT_MS, VERSUCHE };
