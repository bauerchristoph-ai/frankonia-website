/*
 * Tests für den Formular-Endpoint. 2026-08-26.
 *
 *     npm test
 *
 * ⚠️ KEIN TESTFRAMEWORK. `node:test` und `node:assert` sind in Node
 * eingebaut; dieses Projekt hat null Abhängigkeiten und behält das (CLAUDE.md,
 * "Non-negotiable tech constraints"). Ausgeführt wird direkt gegen die
 * Module unter api/, ohne Server: der Handler ist eine gewöhnliche Funktion
 * (req, res), und die lässt sich mit zwei Attrappen aufrufen.
 *
 * ⚠️ `globalThis.fetch` WIRD ERSETZT. Die Module rufen `fetch` zur Laufzeit aus
 * dem globalen Objekt, nicht über einen Import — deshalb genügt das Umbiegen
 * hier und es braucht keine Injektion durch die halbe Codebasis. Jeder Test
 * setzt es selbst, `beforeEach` stellt das Original wieder her.
 *
 * ⚠️ ECHTE TURNSTILE-SCHLÜSSEL KOMMEN HIER NICHT VOR. Cloudflare stellt feste
 * Testschlüssel bereit: 1x0000000000000000000000000000000AA besteht immer,
 * 2x0000000000000000000000000000000AB schlägt immer fehl. In diesen Tests ist
 * ohnehin `fetch` ersetzt, die Antwort von Cloudflare also gestellt.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const WURZEL = path.join(__dirname, "..");
const handler = require(path.join(WURZEL, "api/forms/submit.js"));
const { validate } = require(path.join(WURZEL, "api/_lib/validate.js"));
const hubspot = require(path.join(WURZEL, "api/_lib/hubspot.js"));
const brevo = require(path.join(WURZEL, "api/_lib/brevo.js"));
const guard = require(path.join(WURZEL, "api/_lib/guard.js"));

/* ------------------------------------------------------------- Hilfsmittel */

const echtesFetch = globalThis.fetch;
const echteLog = { log: console.log, warn: console.warn, error: console.error };

function stumm() {
  // Die Module protokollieren absichtlich viel. In der Testausgabe wäre das
  // Rauschen, das echte Fehler verdeckt.
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}
function laut() {
  console.log = echteLog.log;
  console.warn = echteLog.warn;
  console.error = echteLog.error;
}

function res() {
  const r = {
    _status: null,
    _json: null,
    _html: null,
    _beendet: false,
    _header: {},
    setHeader(k, v) { this._header[k] = v; return this; },
    status(s) { this._status = s; return this; },
    json(o) { this._json = o; return this; },
    // Für den Weg ohne JavaScript: der Handler antwortet dort mit HTML oder
    // mit einer Weiterleitung statt mit JSON.
    send(h) { this._html = h; return this; },
    end() { this._beendet = true; return this; },
  };
  return r;
}

/**
 * Anfrage wie sie js/lead-form.js sendet: mit `Accept: application/json`.
 * ⚠️ Der Kopf entscheidet über das Antwortformat. Ohne ihn nimmt der Handler
 * den Weg ohne JavaScript (Weiterleitung statt JSON) — das hat beim Einbau
 * dieses Weges acht Tests auf einmal umgeworfen, weil die Attrappe hier den
 * Kopf nicht setzte. Wer einen Test schreibt, der JSON erwartet, braucht
 * diesen Helfer; für den anderen Weg gibt es reqOhneJs().
 */
function req(body, kopf = {}) {
  return {
    method: "POST",
    headers: {
      "x-forwarded-for": "203.0.113.7",
      accept: "application/json",
      ...kopf,
    },
    socket: { remoteAddress: "203.0.113.7" },
    body,
  };
}

/** Anfrage wie ein Browser ohne JavaScript sie sendet. */
function reqOhneJs(body) {
  return {
    method: "POST",
    headers: {
      "x-forwarded-for": "203.0.113.9",
      accept: "text/html,application/xhtml+xml",
      "content-type": "application/x-www-form-urlencoded",
    },
    socket: { remoteAddress: "203.0.113.9" },
    body,
  };
}

const GUELTIG = {
  form_type: "customer_inquiry",
  first_name: "Erika",
  last_name: "Mustermann",
  email: "erika.mustermann@example.org",
  phone: "+49 951 123456",
  company: "Muster GmbH",
  message: "Wir brauchen einen Objektschutz für unser Werk in Bamberg.",
  privacy_accepted: true,
  page_url: "https://frankonia-sicherheit.de/objektschutz/",
  "cf-turnstile-response": "testtoken",
};

/**
 * Baut eine fetch-Attrappe. `regeln` ist eine Liste [teilstring, antwort].
 * Die erste passende Regel gewinnt; ohne Treffer 200 mit leerem Objekt.
 */
function fetchAttrappe(regeln, protokoll) {
  return async (url, optionen) => {
    const u = String(url);
    if (protokoll) protokoll.push({ url: u, optionen });
    for (const [teil, antwort] of regeln) {
      if (u.includes(teil)) {
        if (antwort === "netzfehler") throw new TypeError("fetch failed");
        return {
          ok: antwort.status >= 200 && antwort.status < 300,
          status: antwort.status,
          text: async () => JSON.stringify(antwort.body ?? {}),
        };
      }
    }
    return { ok: true, status: 200, text: async () => "{}" };
  };
}

/** Standardregeln: alles antwortet freundlich. */
function alleOk(protokoll) {
  return fetchAttrappe(
    [
      ["challenges.cloudflare.com", { status: 200, body: { success: true } }],
      ["contacts/search", { status: 200, body: { results: [] } }],
      ["companies/search", { status: 200, body: { results: [] } }],
      ["objects/contacts", { status: 201, body: { id: "hs-123" } }],
      ["objects/companies", { status: 201, body: { id: "co-9" } }],
      ["objects/notes", { status: 201, body: { id: "note-1" } }],
      ["associations", { status: 204, body: {} }],
      ["api.brevo.com/v3/contacts", { status: 201, body: {} }],
      ["api.brevo.com/v3/smtp/email", { status: 201, body: { messageId: "m-1" } }],
      ["api.brevo.com/v3/events", { status: 204, body: {} }],
    ],
    protokoll
  );
}

const UMGEBUNG = {
  TURNSTILE_SECRET_KEY: "0xTESTSECRET",
  HUBSPOT_SERVICE_KEY: "pat-eu1-test",
  HUBSPOT_PORTAL_ID: "27143941",
  BREVO_API_KEY: "xkeysib-test",
  BREVO_SENDER_EMAIL: "c.bauer@frankonia-sicherheit.de",
  BREVO_SENDER_NAME: "FRANKONIA Sicherheitsdienst",
  BREVO_CONFIRMATION_TEMPLATE_ID: "5",
  INTERNAL_NOTIFICATION_EMAIL: "info@frankonia-sicherheit.de",
};

test.beforeEach(() => {
  globalThis.fetch = echtesFetch;
  Object.assign(process.env, UMGEBUNG);
  // ⚠️ Die beiden Marketing-IDs werden ABGERAEUMT, nicht gesetzt. Sie sind in
  // der Grundeinstellung absichtlich nicht konfiguriert — so prueft die
  // Mehrheit der Tests den Zustand, in dem der Kunde die IDs noch nicht
  // eingetragen hat, und die drei Marketing-Tests setzen sie selbst. Ohne das
  // Abraeumen wuerde ein Test den naechsten beeinflussen.
  delete process.env.HUBSPOT_SUBSCRIPTION_ID_ONE_TO_ONE;
  delete process.env.HUBSPOT_SUBSCRIPTION_ID_MARKETING;
  delete process.env.BREVO_MARKETING_LIST_ID;
  // ⚠️ Auch abraeumen: sonst traegt die Bestaetigungsmail in jedem Test ein BCC,
  // und der Test, der die Abwesenheit prueft, haengt am Vorgaenger.
  delete process.env.HUBSPOT_BCC_ADDRESS;
  guard._reset();
  stumm();
});
test.afterEach(() => {
  globalThis.fetch = echtesFetch;
  laut();
});

/* ======================================================== 1 — Validierung */

test("Validierung: gültige Eingabe wird angenommen und normalisiert", () => {
  const r = validate(GUELTIG);
  assert.equal(r.ok, true);
  assert.equal(r.daten.first_name, "Erika");
  assert.equal(r.daten.privacy_accepted, true);
  // Ohne Haken ausdrücklich false, nicht undefined.
  assert.equal(r.daten.marketing_opt_in, false);
});

test("Validierung: jedes Pflichtfeld wird einzeln gemeldet", () => {
  for (const feld of ["first_name", "last_name", "email", "phone", "company", "message"]) {
    const eingabe = { ...GUELTIG };
    delete eingabe[feld];
    const r = validate(eingabe);
    assert.equal(r.ok, false, feld + " haette fehlen muessen");
    assert.ok(r.fehler.includes(feld), "Fehlerliste nennt " + feld + " nicht: " + r.fehler);
  }
});

test("Validierung: Antwort enthält nur Feldnamen, keine Feldwerte", () => {
  const r = validate({ ...GUELTIG, email: "kaputt", first_name: "" });
  assert.equal(r.ok, false);
  const alsText = JSON.stringify(r.fehler);
  assert.ok(!alsText.includes("kaputt"), "Fehlerliste gibt einen Feldwert zurueck");
});

test("Validierung: Telefon ist Pflicht (Kundenentscheidung 26.08.)", () => {
  // ⚠️ Dieser Test ist der Grund, warum die Entscheidung nicht still
  // zurueckkippen kann: das `required` im Markup allein wuerde von einem
  // direkten Aufruf des Endpoints umgangen. Wenn Telefon je wieder freiwillig
  // werden soll, muss dieser Test bewusst geaendert werden.
  const ohne = { ...GUELTIG };
  delete ohne.phone;
  const r = validate(ohne);
  assert.equal(r.ok, false);
  assert.ok(r.fehler.includes("phone"));
  // Leerstring und Leerzeichen zaehlen nicht als Angabe.
  assert.equal(validate({ ...GUELTIG, phone: "" }).ok, false);
  assert.equal(validate({ ...GUELTIG, phone: "   " }).ok, false);
});

test("Validierung: fehlende Datenschutz-Einwilligung wird abgelehnt", () => {
  const r = validate({ ...GUELTIG, privacy_accepted: false });
  assert.equal(r.ok, false);
  assert.ok(r.fehler.includes("privacy_accepted"));
});

test('Validierung: "false" als Text gilt nicht als Einwilligung', () => {
  // Boolean("false") ist true — genau der Fehler, der hier nicht passieren darf.
  const r = validate({ ...GUELTIG, privacy_accepted: "false" });
  assert.equal(r.ok, false);
  assert.ok(r.fehler.includes("privacy_accepted"));
});

test("Validierung: unbekannter form_type wird abgelehnt", () => {
  const r = validate({ ...GUELTIG, form_type: "erfunden" });
  assert.equal(r.ok, false);
  assert.deepEqual(r.fehler, ["form_type"]);
});

test("Validierung: nicht deklarierte Felder werden verworfen", () => {
  const r = validate({ ...GUELTIG, lifecyclestage: "customer", hs_lead_status: "OPEN" });
  assert.equal(r.ok, true);
  assert.equal(r.daten.lifecyclestage, undefined);
  assert.equal(r.daten.hs_lead_status, undefined);
});

test("Validierung: zu lange Pflichtangabe wird abgelehnt, zu lange UTM gekürzt", () => {
  const lang = "x".repeat(6000);
  assert.equal(validate({ ...GUELTIG, message: lang }).ok, false);
  const r = validate({ ...GUELTIG, utm_campaign: lang });
  assert.equal(r.ok, true);
  assert.equal(r.daten.utm_campaign.length, 200);
});

test("Validierung: offensichtlich kaputte Adressen fallen durch", () => {
  for (const e of ["kaputt", "a@b", "a b@c.de", "@example.org", "a@@example.org", "a@example."]) {
    assert.equal(validate({ ...GUELTIG, email: e }).ok, false, e + " wurde akzeptiert");
  }
  for (const e of ["a@b.de", "vor.nach+tag@sub.example.co.uk"]) {
    assert.equal(validate({ ...GUELTIG, email: e }).ok, true, e + " wurde abgelehnt");
  }
});

/* ========================================================== 2 — Turnstile */

test("Turnstile: fehlendes Token gibt 400", async () => {
  globalThis.fetch = alleOk();
  const eingabe = { ...GUELTIG };
  delete eingabe["cf-turnstile-response"];
  const r = res();
  await handler(req(eingabe), r);
  assert.equal(r._status, 400);
  assert.equal(r._json.fehler, "spamschutz");
});

test("Turnstile: abgelehntes Token gibt 400", async () => {
  globalThis.fetch = fetchAttrappe([
    ["challenges.cloudflare.com", { status: 200, body: { success: false, "error-codes": ["invalid-input-response"] } }],
  ]);
  const r = res();
  await handler(req(GUELTIG), r);
  assert.equal(r._status, 400);
  assert.equal(r._json.grund, "invalid-input-response");
});

test("Turnstile: fehlender Secret sperrt, statt durchzulassen", async () => {
  delete process.env.TURNSTILE_SECRET_KEY;
  globalThis.fetch = alleOk();
  const r = res();
  await handler(req(GUELTIG), r);
  assert.equal(r._status, 400);
  assert.equal(r._json.grund, "konfiguration");
});

test("Turnstile: Ausfall von Cloudflare blockiert das Formular NICHT", async () => {
  // Kein Prüfergebnis ist kein Bot-Hinweis. Honeypot und Mindestzeit greifen
  // weiter; eine echte Anfrage darf nicht verloren gehen.
  globalThis.fetch = fetchAttrappe([
    ["challenges.cloudflare.com", { status: 503, body: {} }],
    ["contacts/search", { status: 200, body: { results: [] } }],
    ["objects/contacts", { status: 201, body: { id: "hs-1" } }],
  ]);
  const r = res();
  await handler(req(GUELTIG), r);
  assert.equal(r._status, 200);
  assert.equal(r._json.ok, true);
});

test("Turnstile wird VOR allem anderen geprüft", async () => {
  const protokoll = [];
  globalThis.fetch = fetchAttrappe(
    [["challenges.cloudflare.com", { status: 200, body: { success: false, "error-codes": ["bad"] } }]],
    protokoll
  );
  await handler(req(GUELTIG), res());
  // Genau ein Aufruf, und der ging an Cloudflare: kein HubSpot, kein Brevo.
  assert.equal(protokoll.length, 1);
  assert.ok(protokoll[0].url.includes("challenges.cloudflare.com"));
});

/* =========================================================== 3 — Honeypot */

test("Honeypot: gefüllt gibt 200 und verwirft still", async () => {
  const protokoll = [];
  globalThis.fetch = alleOk(protokoll);
  const r = res();
  await handler(req({ ...GUELTIG, website: "http://spam.example" }), r);
  // 200, damit der Bot nicht erfährt, dass er erkannt wurde.
  assert.equal(r._status, 200);
  assert.equal(r._json.ok, true);
  // Und NICHTS ist nach draussen gegangen — auch nicht zu Cloudflare. Seit die
  // kostenlosen Pruefungen vor Turnstile stehen, kostet ein Bot im Honeypot
  // nicht einmal Turnstile-Kontingent.
  assert.equal(protokoll.length, 0, "Honeypot-Treffer hat Fremd-APIs aufgerufen: " + JSON.stringify(protokoll.map((f) => f.url)));
});

/* ======================================================== 4 — Mindestzeit */

test("Mindestzeit: zu schnelles Absenden wird still verworfen", async () => {
  const protokoll = [];
  globalThis.fetch = alleOk(protokoll);
  const r = res();
  await handler(req({ ...GUELTIG, rendered_at: Date.now() - 200 }), r);
  assert.equal(r._status, 200);
  assert.equal(protokoll.length, 0, "zu schnelles Absenden hat Fremd-APIs aufgerufen");
});

test("Mindestzeit: fehlender oder unplausibler Zeitstempel blockiert nicht", async () => {
  globalThis.fetch = alleOk();
  for (const wert of [undefined, "", "keine-zahl", 0, -5, Date.now() + 999999]) {
    const r = res();
    await handler(req({ ...GUELTIG, rendered_at: wert }), r);
    assert.equal(r._status, 200, "rendered_at=" + wert + " wurde abgelehnt");
    assert.equal(r._json.ok, true);
    guard._reset();
  }
});

test("Mindestzeit: nach genügend Wartezeit geht es durch", async () => {
  globalThis.fetch = alleOk();
  const r = res();
  await handler(req({ ...GUELTIG, rendered_at: Date.now() - 9000 }), r);
  assert.equal(r._status, 200);
  assert.ok(r._json.submission_id);
});

/* ========================================================= 5 — Idempotenz */

test("Idempotenz: derselbe Schlüssel liefert dieselbe Antwort und ruft nichts erneut", async () => {
  const protokoll = [];
  globalThis.fetch = alleOk(protokoll);
  const eingabe = { ...GUELTIG, idempotency_key: "abc-123" };

  const r1 = res();
  await handler(req(eingabe), r1);
  const anzahl1 = protokoll.length;

  const r2 = res();
  await handler(req(eingabe), r2);

  assert.equal(r1._status, 200);
  assert.equal(r2._status, 200);
  assert.equal(r2._json.submission_id, r1._json.submission_id, "zweiter Klick hat neu verarbeitet");
  assert.equal(protokoll.length, anzahl1, "zweiter Klick hat Fremd-APIs erneut aufgerufen");
});

test("Doppelklick: zwei GLEICHZEITIGE Anfragen erzeugen nur einen Kontakt", async () => {
  // ⚠️ DAS IST DER FALL, DEN DER TEST DARÜBER NICHT ABDECKT. Dort ist die
  // erste Anfrage längst fertig, wenn die zweite kommt. Ein echter
  // Doppelklick trifft den Server aber im Abstand von Millisekunden — die
  // erste läuft dann noch, es gibt noch keine gespeicherte Antwort, und
  // vorher arbeiteten beide vollständig durch: zwei Kontakte, zwei Notizen,
  // zwei Bestätigungsmails.
  const protokoll = [];
  let ersterKontaktLoesen;
  const ersterKontaktHaengt = new Promise((r) => {
    ersterKontaktLoesen = r;
  });
  let kontaktAufrufe = 0;

  globalThis.fetch = async (url, optionen) => {
    const u = String(url);
    protokoll.push({ url: u, optionen });
    const j = (status, body) => ({ ok: status < 400, status, text: async () => JSON.stringify(body) });
    if (u.includes("challenges.cloudflare.com")) return j(200, { success: true });
    if (u.includes("contacts/search") || u.includes("companies/search")) return j(200, { results: [] });
    if (u.endsWith("/crm/v3/objects/contacts")) {
      kontaktAufrufe++;
      // Der erste Schreibvorgang bleibt hängen, bis der Test ihn freigibt.
      // So ist garantiert, dass die zweite Anfrage WÄHREND der ersten
      // ankommt — ohne diese Klammer wäre der Test ein Zufallsspiel.
      if (kontaktAufrufe === 1) await ersterKontaktHaengt;
      return j(201, { id: "hs-123" });
    }
    if (u.includes("objects/companies")) return j(201, { id: "co-9" });
    if (u.includes("objects/notes")) return j(201, { id: "note-1" });
    return j(204, {});
  };

  const eingabe = { ...GUELTIG, idempotency_key: "gleichzeitig-1" };
  const r1 = res();
  const r2 = res();
  const lauf1 = handler(req(eingabe), r1);
  // Ein Tick, damit die erste Anfrage bis zum hängenden Aufruf kommt.
  await new Promise((r) => setImmediate(r));
  const lauf2 = handler(req(eingabe), r2);
  await new Promise((r) => setImmediate(r));
  ersterKontaktLoesen();
  await Promise.all([lauf1, lauf2]);

  assert.equal(r1._status, 200);
  assert.equal(r2._status, 200);
  assert.equal(kontaktAufrufe, 1, "der Doppelklick hat einen zweiten Kontakt erzeugt");
  assert.equal(
    r2._json.submission_id,
    r1._json.submission_id,
    "die zweite Anfrage hat eine eigene Vorgangsnummer bekommen"
  );
  assert.equal(
    protokoll.filter((p) => p.url.includes("smtp/email")).length,
    2,
    "es wurden mehr oder weniger Mails als die zwei erwarteten verschickt"
  );
});

test("Doppelklick: eine Ablehnung wird NICHT aufbewahrt", async () => {
  // ⚠️ Der Schlüssel entsteht einmal je AUFGEBAUTEM FORMULAR, nicht je Klick.
  // Würde eine Ablehnung zwischengespeichert, könnte derselbe Besucher nach
  // einem vergessenen Pflichtfeld nie mehr absenden.
  globalThis.fetch = alleOk();
  const key = "wiederholung-nach-fehler";

  const r1 = res();
  await handler(req({ ...GUELTIG, idempotency_key: key, email: "keine-email" }), r1);
  assert.equal(r1._status, 400);
  assert.equal(r1._json.fehler, "validierung");

  // Gleicher Schlüssel, korrigierte Angaben.
  const r2 = res();
  await handler(req({ ...GUELTIG, idempotency_key: key }), r2);
  assert.equal(r2._status, 200, "die Ablehnung wurde konserviert und blockiert den Besucher");
  assert.equal(r2._json.ok, true);
});

test("Doppelklick: der Wartende sieht dieselbe Ablehnung wie der Erste", async () => {
  // Zwei gleichzeitige Anfragen mit fehlerhaften Daten: beide sollen den
  // Validierungsfehler zeigen, nicht eine davon hängen oder still 200 geben.
  let turnstileLoesen;
  const haengt = new Promise((r) => {
    turnstileLoesen = r;
  });
  let ts = 0;
  globalThis.fetch = async (url) => {
    const u = String(url);
    if (u.includes("challenges.cloudflare.com")) {
      ts++;
      if (ts === 1) await haengt;
      return { ok: true, status: 200, text: async () => JSON.stringify({ success: true }) };
    }
    return { ok: true, status: 200, text: async () => "{}" };
  };

  const eingabe = { ...GUELTIG, idempotency_key: "gleichzeitig-fehler", email: "" };
  const r1 = res();
  const r2 = res();
  const l1 = handler(req(eingabe), r1);
  await new Promise((r) => setImmediate(r));
  const l2 = handler(req(eingabe), r2);
  await new Promise((r) => setImmediate(r));
  turnstileLoesen();
  await Promise.all([l1, l2]);

  assert.equal(r1._status, 400);
  assert.equal(r2._status, 400, "der Wartende bekam eine andere Antwort als der Erste");
  assert.equal(r2._json.fehler, "validierung");
  assert.deepEqual(r2._json.felder, r1._json.felder);
  assert.equal(ts, 1, "Turnstile wurde zweimal befragt, obwohl ein Token einmalig ist");
});

test("Doppelklick: ohne JavaScript wird die gespiegelte Antwort zur Weiterleitung", async () => {
  // ⚠️ Gespeichert wird nur die JSON-Nutzlast. Die FORM der Antwort richtet
  // sich nach der wiederholenden Anfrage — sonst bekäme ein Browser ohne
  // JavaScript rohes JSON angezeigt.
  globalThis.fetch = alleOk();
  const eingabe = { ...GUELTIG, idempotency_key: "ohne-js-wiederholung" };

  const r1 = res();
  await handler(req(eingabe), r1);
  assert.equal(r1._status, 200);

  const r2 = res();
  await handler(reqOhneJs(eingabe), r2);
  assert.equal(r2._status, 303, "die Wiederholung ohne JavaScript endete nicht auf /danke/");
  assert.equal(r2._header.Location, "/danke/");
  assert.equal(r2._json, null);
});

test("Idempotenz: ohne Schlüssel wird nicht zusammengefasst", async () => {
  globalThis.fetch = alleOk();
  const r1 = res(); await handler(req(GUELTIG), r1);
  const r2 = res(); await handler(req(GUELTIG), r2);
  assert.notEqual(r1._json.submission_id, r2._json.submission_id);
});

test("submission_id ist serverseitig und nicht vom Client bestimmbar", async () => {
  globalThis.fetch = alleOk();
  const r = res();
  await handler(req({ ...GUELTIG, submission_id: "vom-client-gesetzt" }), r);
  assert.equal(r._status, 200);
  assert.notEqual(r._json.submission_id, "vom-client-gesetzt");
  assert.match(r._json.submission_id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
});

/* ======================================================== 6 — Rate-Limit */

test("Rate-Limit: die sechste Anfrage derselben IP bekommt 429", async () => {
  globalThis.fetch = alleOk();
  for (let i = 0; i < guard.MAX_PRO_FENSTER; i++) {
    const r = res();
    await handler(req(GUELTIG), r);
    assert.equal(r._status, 200, "Anfrage " + (i + 1) + " wurde schon abgelehnt");
  }
  const r = res();
  await handler(req(GUELTIG), r);
  assert.equal(r._status, 429);
  // Der Hinweis nennt einen Ausweg statt nur zu sperren.
  assert.match(r._json.hinweis, /rufen Sie uns an/i);
});

/* ==================================================== 7 — HubSpot-Ausfall */

test("HubSpot-Ausfall: Anfrage gilt als erfolgreich, weil die interne Mail durch ist", async () => {
  globalThis.fetch = fetchAttrappe([
    ["challenges.cloudflare.com", { status: 200, body: { success: true } }],
    ["api.hubapi.com", { status: 503, body: { message: "service unavailable" } }],
    ["api.brevo.com/v3/contacts", { status: 201, body: {} }],
    ["api.brevo.com/v3/smtp/email", { status: 201, body: { messageId: "m-1" } }],
    ["api.brevo.com/v3/events", { status: 204, body: {} }],
  ]);
  const r = res();
  await handler(req(GUELTIG), r);
  assert.equal(r._status, 200);
  assert.equal(r._json.ok, true);
});

test("HubSpot-Ausfall: Brevo bekommt trotzdem alle vier Aufrufe", async () => {
  const protokoll = [];
  globalThis.fetch = fetchAttrappe(
    [
      ["challenges.cloudflare.com", { status: 200, body: { success: true } }],
      ["api.hubapi.com", { status: 500, body: {} }],
      ["api.brevo.com", { status: 201, body: {} }],
    ],
    protokoll
  );
  await handler(req(GUELTIG), res());
  const brevoAufrufe = protokoll.filter((p) => p.url.includes("api.brevo.com")).map((p) => p.url);
  // Kontakt, Bestätigungsmail, Event, interne Mail
  assert.equal(brevoAufrufe.length, 4, "Brevo-Aufrufe: " + JSON.stringify(brevoAufrufe));
});

/* ====================================================== 8 — Brevo-Ausfall */

test("Brevo-Ausfall: Anfrage gilt als erfolgreich, weil der HubSpot-Kontakt steht", async () => {
  globalThis.fetch = fetchAttrappe([
    ["challenges.cloudflare.com", { status: 200, body: { success: true } }],
    ["contacts/search", { status: 200, body: { results: [] } }],
    ["objects/contacts", { status: 201, body: { id: "hs-77" } }],
    ["objects/companies", { status: 201, body: { id: "co-1" } }],
    ["companies/search", { status: 200, body: { results: [] } }],
    ["objects/notes", { status: 201, body: { id: "n-1" } }],
    ["associations", { status: 204, body: {} }],
    ["api.brevo.com", { status: 500, body: {} }],
  ]);
  const r = res();
  await handler(req(GUELTIG), r);
  assert.equal(r._status, 200);
  assert.equal(r._json.ok, true);
});

test("Beide aus: 502 mit Telefonnummer, nicht stilles Verschlucken", async () => {
  globalThis.fetch = fetchAttrappe([
    ["challenges.cloudflare.com", { status: 200, body: { success: true } }],
    ["api.hubapi.com", { status: 500, body: {} }],
    ["api.brevo.com", { status: 500, body: {} }],
  ]);
  const r = res();
  await handler(req(GUELTIG), r);
  assert.equal(r._status, 502);
  assert.equal(r._json.ok, false);
  assert.match(r._json.hinweis, /964352/);
  // Die ID muss mitkommen, sonst ist der Fall nicht nachverfolgbar.
  assert.ok(r._json.submission_id);
});

test("Netzfehler statt Statuscode wird genauso behandelt", async () => {
  globalThis.fetch = fetchAttrappe([
    ["challenges.cloudflare.com", { status: 200, body: { success: true } }],
    ["api.hubapi.com", "netzfehler"],
    ["api.brevo.com", "netzfehler"],
  ]);
  const r = res();
  await handler(req(GUELTIG), r);
  assert.equal(r._status, 502);
});

/* ================================================== 9 — Consent-Logik */

test("Consent: ohne marketing_opt_in wird in Brevo OPT_IN false gesetzt", () => {
  const a = brevo.kontaktAttribute({ ...validate(GUELTIG).daten }, "sub-1", "hs-1", "2026-08-26T10:00:00.000Z");
  assert.equal(a.OPT_IN, false);
});

test("Consent: mit marketing_opt_in wird OPT_IN true", () => {
  const d = validate({ ...GUELTIG, marketing_opt_in: "on" }).daten;
  assert.equal(d.marketing_opt_in, true);
  assert.equal(brevo.kontaktAttribute(d, "sub-1", null, "2026-08-26T10:00:00.000Z").OPT_IN, true);
});

test("Consent: die deutschen Attributnamen werden benutzt, nicht die englischen", () => {
  const a = brevo.kontaktAttribute(validate(GUELTIG).daten, "sub-1", null, "2026-08-26T10:00:00.000Z");
  assert.equal(a.VORNAME, "Erika");
  assert.equal(a.NACHNAME, "Mustermann");
  assert.equal(a.FIRSTNAME, undefined, "FIRSTNAME wuerde eine Dublette anlegen");
  assert.equal(a.LASTNAME, undefined, "LASTNAME wuerde eine Dublette anlegen");
  assert.equal(a.MARKETING_OPT_IN, undefined, "MARKETING_OPT_IN ist das falsche Feld, es heisst OPT_IN");
  assert.equal(a.SOURCE, "Website");
});

test("Consent: kein HubSpot-Subscription-Type und keine Listenzuordnung", async () => {
  const protokoll = [];
  globalThis.fetch = alleOk(protokoll);
  await handler(req({ ...GUELTIG, marketing_opt_in: "on" }), res());

  // In HubSpot darf keine Einwilligungs-API angesprochen werden.
  const prefs = protokoll.filter((p) => p.url.includes("communication-preferences"));
  assert.equal(prefs.length, 0, "es wurde eine HubSpot-Einwilligung gesetzt");

  // In Brevo darf kein listIds mitgehen.
  const kontakt = protokoll.find((p) => p.url.endsWith("api.brevo.com/v3/contacts"));
  assert.ok(kontakt, "kein Brevo-Kontaktaufruf gefunden");
  const body = JSON.parse(kontakt.optionen.body);
  assert.equal(body.listIds, undefined, "Anfrage wurde einer Marketing-Liste zugeordnet");
  assert.equal(body.updateEnabled, true);
});

test("Kein Deal in HubSpot", async () => {
  const protokoll = [];
  globalThis.fetch = alleOk(protokoll);
  await handler(req(GUELTIG), res());
  const deals = protokoll.filter((p) => p.url.includes("/deals"));
  assert.equal(deals.length, 0, "es wurde ein Deal angelegt");
});

/* ============================================ 10 — Lifecycle nicht zurück */

test("Lifecycle: ein bestehender Kunde wird nicht zurückgestuft", () => {
  // ⚠️ Die Reihenfolge ist die DIESES PORTALS, mit eigenen numerischen IDs.
  // Ziel der Website-Anfragen ist 5522034896 ("Angebot erstellt").
  const ziel = "5522034896";

  // Spaeter im Trichter: nicht zurueckstufen.
  assert.equal(hubspot.darfPhaseSetzen("customer", ziel), false, "Kunde");
  assert.equal(hubspot.darfPhaseSetzen("evangelist", ziel), false, "Fuersprecher");
  assert.equal(hubspot.darfPhaseSetzen("4003004610", ziel), false, "Upsell");
  // Gleiche Phase: kein Schreibvorgang.
  assert.equal(hubspot.darfPhaseSetzen(ziel, ziel), false);

  // Frueher im Trichter: darf hoch — DAS ist der haeufige Fall, im Portal
  // stehen 2.767 Kontakte in Kaltakquise.
  assert.equal(hubspot.darfPhaseSetzen("subscriber", ziel), true, "Kontakt");
  assert.equal(hubspot.darfPhaseSetzen("4000505062", ziel), true, "Kaltakquise");
  assert.equal(hubspot.darfPhaseSetzen("5520647375", ziel), true, "Ansprechpartner");
  assert.equal(hubspot.darfPhaseSetzen("lead", ziel), true, "Termin vereinbart");

  // Neu oder leer: darf gesetzt werden.
  assert.equal(hubspot.darfPhaseSetzen("", ziel), true);
  assert.equal(hubspot.darfPhaseSetzen(null, ziel), true);

  // ⚠️ ÜBERSCHRIEBEN, und das ist eine Kundenentscheidung vom 26.08.2026:
  // "Sonstiges" und "Kein Interesse" stehen in der Rangfolge VOR dem Ziel, also
  // hebt eine neue Anfrage sie an. Wer nach so einer Einordnung selbst ein
  // Angebot anfragt, hat sein Desinteresse gerade widerlegt.
  // Vorher standen beide hinter dem Ziel und blieben unberührt.
  assert.equal(hubspot.darfPhaseSetzen("other", ziel), true, "Sonstiges");
  assert.equal(hubspot.darfPhaseSetzen("5574730996", ziel), true, "Kein Interesse");

  // Unbekannte Phase auf einer der beiden Seiten: nicht anfassen.
  assert.equal(hubspot.darfPhaseSetzen("irgendwas", ziel), false);
  assert.equal(hubspot.darfPhaseSetzen("subscriber", "99999999"), false);
  // Ohne Zielphase wird nie gesetzt.
  assert.equal(hubspot.darfPhaseSetzen(null, null), false);
  assert.equal(hubspot.darfPhaseSetzen("subscriber", null), false);
});

test("Lifecycle: die Reihenfolge enthaelt genau die Phasen des Portals", () => {
  // ⚠️ Kein Selbstzweck: steht eine Phase NICHT in der Liste, wird sie als
  // unbekannt behandelt und der Kontakt gar nicht umsortiert — still. Diese
  // Zusicherung ist die Bremse dafuer. Ein Umsortieren im Portal faellt
  // zusaetzlich bei "setup-hubspot.mjs --verify" auf.
  assert.deepEqual(hubspot.LIFECYCLE_REIHENFOLGE, [
    // ⚠️ Die REIHENFOLGE ist hier mitgeprueft, nicht nur die Menge: sie
    // entscheidet, wer ueberschrieben wird. Die ersten zwei stehen bewusst
    // vor dem Ziel (Kundenentscheidung), die letzten drei bewusst dahinter.
    "other",
    "5574730996",
    "subscriber",
    "4000505062",
    "5520647375",
    "lead",
    "5522034896",
    "customer",
    "evangelist",
    "4003004610",
  ]);
});

test("Lifecycle: ohne HUBSPOT_LIFECYCLE_STAGE wird die Phase NICHT geschrieben", () => {
  // ⚠️ Gefunden beim Live-Test am 26.08.2026: der Code schrieb fest "lead",
  // und in diesem Portal heisst "lead" nicht "Lead", sondern "Termin
  // vereinbart" — mehrere Stufen zu weit fuer einen Formulareingang. Welche
  // Stufe richtig ist, weiss nur der Kunde, deshalb ist Nichtschreiben der
  // einzige Wert, der in keinem Portal falsch sein kann.
  delete process.env.HUBSPOT_LIFECYCLE_STAGE;
  const d = validate(GUELTIG).daten;
  const ohne = hubspot.kontaktProperties(d, "s1", "2026-08-26T10:00:00.000Z", null).standard;
  assert.equal(ohne.lifecyclestage, undefined, "es wurde eine Phase geraten");
  // hs_lead_status haengt NICHT davon ab: es ist ein eigenes Feld.
  assert.equal(ohne.hs_lead_status, "NEW");

  process.env.HUBSPOT_LIFECYCLE_STAGE = "4000505062";
  const mit = hubspot.kontaktProperties(d, "s1", "2026-08-26T10:00:00.000Z", null).standard;
  assert.equal(mit.lifecyclestage, "4000505062");
  delete process.env.HUBSPOT_LIFECYCLE_STAGE;
});

test("Lifecycle: hs_lead_status nur bei neuen Kontakten", () => {
  // Die Zielphase muss hier gesetzt sein, sonst wird lifecyclestage gar nicht
  // geschrieben und die Aussage dieses Tests waere leer.
  process.env.HUBSPOT_LIFECYCLE_STAGE = "lead";
  const d = validate(GUELTIG).daten;
  const neu = hubspot.kontaktProperties(d, "s1", "2026-08-26T10:00:00.000Z", null).standard;
  assert.equal(neu.hs_lead_status, "NEW");
  assert.equal(neu.lifecyclestage, "lead");

  const bestehend = hubspot.kontaktProperties(d, "s1", "2026-08-26T10:00:00.000Z", {
    id: "1",
    properties: { lifecyclestage: "customer", hs_lead_status: "OPEN" },
  }).standard;
  assert.equal(bestehend.hs_lead_status, undefined, "hs_lead_status wurde auf NEW zurueckgesetzt");
  assert.equal(bestehend.lifecyclestage, undefined, "lifecyclestage wurde zurueckgestuft");
  delete process.env.HUBSPOT_LIFECYCLE_STAGE;
});

/* ================================= 15 — HubSpot-Eigenschaftsfelder */

test("HubSpot: die Zuordnung benutzt interne Namen, keine Beschriftungen", () => {
  const d = validate(GUELTIG).daten;
  const { standard, eigen } = hubspot.kontaktProperties(d, "s1", "2026-08-26T10:00:00.000Z", null);
  // Standardfelder von HubSpot: klein, ohne Unterstrich zwischen den Woertern.
  assert.equal(standard.firstname, "Erika");
  assert.equal(standard.lastname, "Mustermann");
  assert.equal(standard.email, "erika.mustermann@example.org");
  assert.equal(standard.phone, "+49 951 123456");
  assert.equal(standard.company, "Muster GmbH");
  // ⚠️ Die haeufigsten Falschschreibungen duerfen NICHT auftauchen — sie
  // fuehren zu 400 "Property does not exist" und damit zum Verlust des Leads.
  for (const falsch of ["first_name", "firstName", "Vorname", "last_name", "lastName", "Nachname", "telefon", "Telefon"]) {
    assert.equal(standard[falsch], undefined, "falscher HubSpot-Name im Aufruf: " + falsch);
  }
  /* ⚠️ Eigene Felder: alle mit website_ praefixiert — MIT EINER ERKLAERTEN
     AUSNAHME. `bewerber_oder_kunde_` ist eine Eigenschaft, die im Portal des
     Kunden schon existiert; wir schreiben sie, legen sie aber nie an. Sie ist
     hier namentlich freigestellt und nicht per Muster, damit ein VERSEHEN
     weiterhin auffaellt: ein zweites portalfremdes Feld laesst diesen Test
     scheitern, solange es nicht ebenso erklaert wird. */
  const PORTAL_EIGEN = [hubspot.ROLLE_PROPERTY];
  for (const k of Object.keys(eigen)) {
    assert.ok(
      k.startsWith("website_") || PORTAL_EIGEN.includes(k),
      "eigenes Feld ohne website_-Praefix und ohne Erklaerung: " + k
    );
  }
  /* Die Rolle liegt bei den EIGENEN und nicht bei den Standardfeldern: wird die
     Option im Portal umbenannt, faellt der erste Versuch mit 400 aus und der
     zweite schreibt die Standardfelder ohne sie. Der Lead bleibt damit da. */
  assert.equal(eigen[hubspot.ROLLE_PROPERTY], "(Potenzieller) Kunde");
  assert.equal(standard[hubspot.ROLLE_PROPERTY], undefined);
});

test("HubSpot: Standard und Eigen sind getrennt, damit der zweite Versuch moeglich ist", () => {
  const d = validate(GUELTIG).daten;
  const { standard, eigen } = hubspot.kontaktProperties(d, "s1", "2026-08-26T10:00:00.000Z", null);
  // Kein eigenes Feld in den Standardfeldern und umgekehrt: sonst wuerde der
  // zweite Versuch dieselbe unbekannte Eigenschaft erneut senden.
  for (const k of Object.keys(standard)) assert.ok(!k.startsWith("website_"), k);
  // Und die zehn eigenen, die das Setup-Skript anlegt, deckt die Tabelle ab.
  const anzulegen = Object.keys(hubspot.eigeneEigenschaften());
  assert.equal(anzulegen.length, 10);
  /* ⚠️ DIESE ZUSICHERUNG IST DIE BREMSE GEGEN "wird geschrieben, aber nie
     angelegt" — der Fall, in dem HubSpot den GESAMTEN Aufruf mit 400 ablehnt.
     `bewerber_oder_kunde_` ist die eine erklaerte Ausnahme: sie existiert im
     Portal des Kunden, wird von scripts/setup-hubspot.mjs nur GEPRUEFT und
     absichtlich nicht erzeugt. Namentlich freigestellt, nicht per Muster. */
  const PORTAL_EIGEN = [hubspot.ROLLE_PROPERTY];
  for (const k of Object.keys(eigen)) {
    assert.ok(
      anzulegen.includes(k) || PORTAL_EIGEN.includes(k),
      "wird geschrieben, aber nie angelegt: " + k
    );
  }
});

test("HubSpot: die Rolle wird nur fuer die eingetragenen Formulartypen gesetzt", () => {
  /* ⚠️ Der Wert ist der INTERNE Wert der Option, nicht ihre Beschriftung — im
     Portal heisst die andere Option "Bewerber / Mitarbeiter", intern aber
     "Bewerber Sicherheitsdienst". Ein "potenzieller Kunde" ohne Klammern waere
     ein 400 fuer den gesamten Aufruf. */
  assert.equal(hubspot.ROLLE_JE_FORMULARTYP.customer_inquiry, "(Potenzieller) Kunde");

  /* Ein Typ, der nicht in der Tabelle steht, bekommt KEINE Rolle. Das ist der
     sichere Ausfall: lieber kein Wert als der falsche. Heute erreicht nur
     `customer_inquiry` diesen Endpoint — das Bewerberformular auf /jobs/ ist
     ein eingebettetes HubSpot-Formular und laeuft gar nicht durch diesen Code. */
  const d = validate(GUELTIG).daten;
  const fremd = { ...d, form_type: "irgendwas" };
  const { eigen } = hubspot.kontaktProperties(fremd, "s1", "2026-08-26T10:00:00.000Z", null);
  assert.equal(eigen[hubspot.ROLLE_PROPERTY], undefined);
});

test("HubSpot: bei 400 wird ein zweiter Versuch NUR mit Standardfeldern gemacht", async () => {
  const protokoll = [];
  let ersterVersuch = true;
  globalThis.fetch = async (url, optionen) => {
    const u = String(url);
    protokoll.push({ url: u, optionen });
    if (u.includes("challenges.cloudflare.com"))
      return { ok: true, status: 200, text: async () => JSON.stringify({ success: true }) };
    if (u.includes("contacts/search"))
      return { ok: true, status: 200, text: async () => JSON.stringify({ results: [] }) };
    if (u.endsWith("/crm/v3/objects/contacts")) {
      // Der ERSTE Schreibversuch scheitert wie bei einer fehlenden Eigenschaft.
      if (ersterVersuch) {
        ersterVersuch = false;
        return {
          ok: false,
          status: 400,
          text: async () => JSON.stringify({ message: 'Property "website_service" does not exist' }),
        };
      }
      return { ok: true, status: 201, text: async () => JSON.stringify({ id: "hs-9" }) };
    }
    return { ok: true, status: 200, text: async () => "{}" };
  };

  const r = res();
  await handler(req(GUELTIG), r);
  // Der Lead ist NICHT verloren.
  assert.equal(r._status, 200);
  assert.equal(r._json.ok, true);

  const schreibversuche = protokoll.filter((p) => p.url.endsWith("/crm/v3/objects/contacts"));
  assert.equal(schreibversuche.length, 2, "es gab keinen zweiten Versuch");
  const zweiter = JSON.parse(schreibversuche[1].optionen.body).properties;
  // Im zweiten Versuch darf kein einziges eigenes Feld mehr stehen.
  for (const k of Object.keys(zweiter)) assert.ok(!k.startsWith("website_"), "zweiter Versuch sendet " + k);
  assert.equal(zweiter.firstname, "Erika", "der zweite Versuch hat die Standardfelder verloren");
});

/* ============================ 16 — Marketing-Einwilligung */

test("Marketing: ohne Haken NUR One to One, mit Vertragsanbahnung als Grundlage", async () => {
  /* ⚠️⚠️ GEAENDERT AM 31.08.2026 (QA-Aufgabe 13.2/13.3). Vorher forderte dieser
     Test NULL Abonnement-Aufrufe ohne Haken. Das war der Zustand, der den Fehler
     erzeugt hat: ohne jeden Aufruf uebertraegt niemand eine Rechtsgrundlage, und
     HubSpot fuellt seinen Portal-Standard ein — am Testkontakt stand
     "Berechtigtes Interesse - Sonstige". Bei jemandem, der aktiv ein Angebot
     anfordert, ist das die falsche Grundlage.
     Jetzt gilt: "One to One" IMMER (Vertragsanbahnung), "Marketing Information"
     nur mit Haken. Der Test prueft deshalb nicht mehr die ANZAHL, sondern WELCHER
     Typ mit WELCHER Grundlage — sonst wuerde eine Verwechslung der beiden
     unbemerkt durchgehen. */
  process.env.HUBSPOT_SUBSCRIPTION_ID_ONE_TO_ONE = "42";
  process.env.HUBSPOT_SUBSCRIPTION_ID_MARKETING = "43";
  process.env.BREVO_MARKETING_LIST_ID = "7";
  const protokoll = [];
  globalThis.fetch = alleOk(protokoll);
  await handler(req(GUELTIG), res());

  const subs = protokoll.filter((p) => p.url.includes("communication-preferences/v3/subscribe"));
  assert.equal(subs.length, 1, "ohne Haken darf es genau EIN Abonnement geben");
  const b = JSON.parse(subs[0].optionen.body);
  assert.equal(b.subscriptionId, "42", "ohne Haken wurde der Marketing-Typ gesetzt");
  assert.equal(
    b.legalBasis,
    "PERFORMANCE_OF_CONTRACT",
    "ohne Einwilligung darf die Grundlage nicht CONSENT lauten — das waere eine falsche Behauptung"
  );
  assert.match(b.legalBasisExplanation, /Vertragsanbahnung/);
  const kontakt = protokoll.find((p) => p.url.endsWith("api.brevo.com/v3/contacts"));
  const body = JSON.parse(kontakt.optionen.body);
  assert.equal(body.listIds, undefined, "Listenzuordnung ohne Haken");
  assert.equal(body.attributes.OPT_IN, false);
  const hsBody = JSON.parse(
    protokoll.find((p) => p.url.endsWith("/crm/v3/objects/contacts")).optionen.body
  ).properties;
  assert.equal(hsBody.hs_marketable_status, undefined, "Marketingkontakt ohne Haken");
});

test("Marketing: mit Haken wird die Einwilligung mit Rechtsgrundlage gespeichert", async () => {
  process.env.HUBSPOT_SUBSCRIPTION_ID_ONE_TO_ONE = "42";
  process.env.HUBSPOT_SUBSCRIPTION_ID_MARKETING = "43";
  process.env.BREVO_MARKETING_LIST_ID = "7";
  const protokoll = [];
  globalThis.fetch = alleOk(protokoll);
  await handler(req({ ...GUELTIG, marketing_opt_in: "on" }), res());

  // ⚠️ BEIDE Subscription-Typen, Kundenentscheidung vom 26.08.2026. Ein Test,
  // der nur einen prueft, wuerde einen stillen Ausfall des zweiten nicht sehen.
  const subs = protokoll.filter((p) => p.url.includes("communication-preferences/v3/subscribe"));
  assert.equal(subs.length, 2, "es wurden nicht beide Subscription-Typen gesetzt");
  const koerper = subs.map((p) => JSON.parse(p.optionen.body));
  assert.deepEqual(koerper.map((k) => k.subscriptionId).sort(), ["42", "43"]);
  /* ⚠️⚠️ JE TYP SEINE EIGENE GRUNDLAGE, geaendert am 31.08.2026. Vorher forderte
     dieser Test CONSENT_WITH_NOTICE fuer BEIDE Aufrufe. Das war falsch, sobald
     "One to One" auch ohne Haken laeuft: dort hat niemand zugestimmt, und
     CONSENT_WITH_NOTICE waere eine falsche Behauptung in genau dem Feld, das den
     Nachweis fuehren soll. Der Test prueft die Zuordnung jetzt einzeln — eine
     Vertauschung der beiden Grundlagen faellt damit auf. */
  const einsZuEins = koerper.find((k) => k.subscriptionId === "42");
  const werbung = koerper.find((k) => k.subscriptionId === "43");
  assert.ok(einsZuEins && werbung, "beide Typen muessen vorkommen");
  assert.equal(einsZuEins.legalBasis, "PERFORMANCE_OF_CONTRACT");
  assert.equal(werbung.legalBasis, "CONSENT_WITH_NOTICE");
  assert.match(werbung.legalBasisExplanation, /Checkbox/);
  assert.match(werbung.legalBasisExplanation, /Marketing Information/);
  assert.match(einsZuEins.legalBasisExplanation, /Vertragsanbahnung/);
  for (const b of koerper) {
    assert.equal(b.emailAddress, "erika.mustermann@example.org");
    assert.ok(b.legalBasisExplanation && b.legalBasisExplanation.length > 20, "Grundlage ohne Erklaerung ist kein Nachweis");
  }

  const hsBody = JSON.parse(
    protokoll.find((p) => p.url.endsWith("/crm/v3/objects/contacts")).optionen.body
  ).properties;
  assert.equal(hsBody.hs_marketable_status, "true");

  const kontakt = protokoll.find((p) => p.url.endsWith("api.brevo.com/v3/contacts"));
  const bb = JSON.parse(kontakt.optionen.body);
  assert.deepEqual(bb.listIds, [7]);
  assert.equal(bb.attributes.OPT_IN, true);
});

test("Marketing: schon eingetragene Einwilligung gilt als Erfolg, nicht als Fehler", async () => {
  // ⚠️ HubSpot antwortet mit 400, wenn der Kontakt bei diesem Typ bereits
  // eingetragen ist. Der gewuenschte Zustand ist damit erreicht — als Fehler
  // behandelt wuerde jeder wiederkehrende Interessent eine Warnung erzeugen
  // und im Log saehe es aus, als fehle die Einwilligung. Gefunden beim
  // Live-Test am 26.08.2026.
  process.env.HUBSPOT_SUBSCRIPTION_ID_ONE_TO_ONE = "42";
  const protokoll = [];
  globalThis.fetch = async (url, optionen) => {
    const u = String(url);
    protokoll.push({ url: u, optionen });
    const j = (status, body) => ({ ok: status < 400, status, text: async () => JSON.stringify(body) });
    if (u.includes("challenges.cloudflare.com")) return j(200, { success: true });
    if (u.includes("contacts/search") || u.includes("companies/search")) return j(200, { results: [] });
    if (u.includes("communication-preferences/v3/subscribe"))
      return j(400, { status: "error", message: "a@b.de is already subscribed to subscription 42" });
    if (u.includes("communication-preferences/v3/status/email/"))
      return j(200, {
        recipient: "a@b.de",
        subscriptionStatuses: [{ id: "42", name: "One to One", status: "SUBSCRIBED" }],
      });
    if (u.endsWith("/crm/v3/objects/contacts")) return j(201, { id: "hs-1" });
    return j(204, {});
  };

  const r = res();
  await handler(req({ ...GUELTIG, marketing_opt_in: "on" }), r);
  assert.equal(r._status, 200);

  // Der Status-Endpoint MUSS gefragt worden sein: die englische Meldung ist
  // nur der Anlass, der Beweis ist der bestaetigte Status.
  assert.equal(
    protokoll.filter((p) => p.url.includes("status/email/")).length,
    1,
    "der Status wurde nicht gegengepruefft"
  );
});

test("Marketing: passt die Meldung nicht, bleibt es bei der Warnung", async () => {
  // Gegenprobe: ein 400 aus einem ANDEREN Grund darf NICHT als Erfolg gelten,
  // und es darf auch kein Status abgefragt werden.
  process.env.HUBSPOT_SUBSCRIPTION_ID_ONE_TO_ONE = "42";
  const protokoll = [];
  globalThis.fetch = async (url, optionen) => {
    const u = String(url);
    protokoll.push({ url: u, optionen });
    const j = (status, body) => ({ ok: status < 400, status, text: async () => JSON.stringify(body) });
    if (u.includes("challenges.cloudflare.com")) return j(200, { success: true });
    if (u.includes("contacts/search") || u.includes("companies/search")) return j(200, { results: [] });
    if (u.includes("communication-preferences/v3/subscribe"))
      return j(400, { status: "error", message: "Invalid subscription id" });
    if (u.endsWith("/crm/v3/objects/contacts")) return j(201, { id: "hs-1" });
    return j(204, {});
  };

  const r = res();
  await handler(req({ ...GUELTIG, marketing_opt_in: "on" }), r);
  // Die Anfrage selbst gilt trotzdem — eine fehlende Einwilligung darf keinen
  // Lead kosten.
  assert.equal(r._status, 200);
  assert.equal(
    protokoll.filter((p) => p.url.includes("status/email/")).length,
    0,
    "bei einem fremden 400 wurde unnoetig der Status abgefragt"
  );
});

test("Marketing: ist nur eine Subscription-ID gesetzt, wird die andere nicht geraten", async () => {
  process.env.HUBSPOT_SUBSCRIPTION_ID_ONE_TO_ONE = "42";
  // HUBSPOT_SUBSCRIPTION_ID_MARKETING bleibt absichtlich leer.
  const protokoll = [];
  globalThis.fetch = alleOk(protokoll);
  const r = res();
  await handler(req({ ...GUELTIG, marketing_opt_in: "on" }), r);

  assert.equal(r._status, 200);
  const subs = protokoll.filter((p) => p.url.includes("communication-preferences/v3/subscribe"));
  assert.equal(subs.length, 1, "die fehlende ID wurde erfunden oder die vorhandene uebersprungen");
  assert.equal(JSON.parse(subs[0].optionen.body).subscriptionId, "42");
});

test("Marketing: ohne konfigurierte IDs wird nichts geraten", async () => {
  delete process.env.HUBSPOT_SUBSCRIPTION_ID_ONE_TO_ONE;
  delete process.env.HUBSPOT_SUBSCRIPTION_ID_MARKETING;
  delete process.env.BREVO_MARKETING_LIST_ID;
  const protokoll = [];
  globalThis.fetch = alleOk(protokoll);
  const r = res();
  await handler(req({ ...GUELTIG, marketing_opt_in: "on" }), r);

  // Die Anfrage geht trotzdem durch — eine fehlende Konfiguration darf keinen
  // Lead kosten.
  assert.equal(r._status, 200);
  assert.equal(
    protokoll.filter((p) => p.url.includes("communication-preferences")).length,
    0,
    "es wurde eine erfundene Subscription-ID benutzt"
  );
  const bb = JSON.parse(protokoll.find((p) => p.url.endsWith("api.brevo.com/v3/contacts")).optionen.body);
  assert.equal(bb.listIds, undefined, "es wurde eine erfundene Listen-ID benutzt");
  // Die Einwilligung selbst ist trotzdem vermerkt, damit sie nicht verloren ist.
  assert.equal(bb.attributes.OPT_IN, true);
});

/* ============================================== 11 — Logs ohne Klartext */

test("Logging: E-Mail und Telefon werden maskiert", () => {
  const { redactString, redact } = require(path.join(WURZEL, "api/_lib/log.js"));
  const s = redactString("Kontakt erika.mustermann@example.org, Tel. +49 951 964352-0 ruft an");
  assert.ok(!s.includes("erika.mustermann@example.org"));
  assert.ok(!s.includes("964352"));
  const o = redact({ email: "a@b.de", message: "geheim", utm_source: "google" });
  assert.equal(o.email, "<entfernt>");
  assert.equal(o.message, "<entfernt>");
  // Nicht personenbezogene Felder bleiben lesbar, sonst ist das Log wertlos.
  assert.equal(o.utm_source, "google");
});

test("Logging: der Endpoint schreibt keine Feldwerte in die Logs", async () => {
  laut();
  const zeilen = [];
  console.log = (...a) => zeilen.push(a.join(" "));
  console.warn = (...a) => zeilen.push(a.join(" "));
  console.error = (...a) => zeilen.push(a.join(" "));
  try {
    globalThis.fetch = fetchAttrappe([
      ["challenges.cloudflare.com", { status: 200, body: { success: true } }],
      // Fehlerantwort, die die gesendeten Werte zurückspiegelt — genau der
      // Weg, auf dem Klartext sonst ins Log gelangt.
      ["api.hubapi.com", { status: 400, body: { message: "invalid email erika.mustermann@example.org" } }],
      ["api.brevo.com", { status: 201, body: {} }],
    ]);
    await handler(req(GUELTIG), res());
  } finally {
    stumm();
  }
  const alles = zeilen.join("\n");
  assert.ok(!alles.includes("erika.mustermann@example.org"), "E-Mail steht im Log:\n" + alles);
  assert.ok(!alles.includes("Muster GmbH"), "Firmenname steht im Log");
  assert.ok(!alles.includes("Werk in Bamberg"), "Nachrichtentext steht im Log");
});

/* ================================================ 12 — Methode und Format */

test("GET wird mit 405 abgelehnt und beschreibt das Feldmodell nicht", async () => {
  const r = res();
  await handler({ method: "GET", headers: {}, socket: {} }, r);
  assert.equal(r._status, 405);
  assert.equal(r._header.Allow, "POST");
  assert.equal(JSON.stringify(r._json).includes("first_name"), false);
});

test("Body als String wird gelesen, nicht als leer behandelt", async () => {
  globalThis.fetch = alleOk();
  const r = res();
  await handler(req(JSON.stringify(GUELTIG)), r);
  assert.equal(r._status, 200, "String-Body wurde nicht geparst");
});

test("Antwort enthält keine personenbezogenen Daten", async () => {
  globalThis.fetch = alleOk();
  const r = res();
  await handler(req(GUELTIG), r);
  const alsText = JSON.stringify(r._json);
  for (const wert of ["Erika", "Mustermann", "example.org", "Muster GmbH"]) {
    assert.ok(!alsText.includes(wert), wert + " steht in der Antwort");
  }
});

/* ============================================== 13 — Fehlende Konfiguration */

test("Fehlt der Brevo-Schlüssel, läuft HubSpot trotzdem und die Anfrage gilt", async () => {
  delete process.env.BREVO_API_KEY;
  const protokoll = [];
  globalThis.fetch = alleOk(protokoll);
  const r = res();
  await handler(req(GUELTIG), r);
  assert.equal(r._status, 200);
  assert.equal(protokoll.filter((p) => p.url.includes("api.brevo.com")).length, 0);
  assert.ok(protokoll.some((p) => p.url.includes("api.hubapi.com")));
});

test("Fehlt der HubSpot-Schlüssel, läuft Brevo trotzdem und die Anfrage gilt", async () => {
  delete process.env.HUBSPOT_SERVICE_KEY;
  const protokoll = [];
  globalThis.fetch = alleOk(protokoll);
  const r = res();
  await handler(req(GUELTIG), r);
  assert.equal(r._status, 200);
  assert.equal(protokoll.filter((p) => p.url.includes("api.hubapi.com")).length, 0);
  assert.ok(protokoll.some((p) => p.url.includes("api.brevo.com")));
});

/* ============================================ 14 — Weg ohne JavaScript */

test("Ohne JavaScript: Erfolg endet in einer 303-Weiterleitung auf /danke/", async () => {
  globalThis.fetch = alleOk();
  const r = res();
  await handler(reqOhneJs(GUELTIG), r);
  // ⚠️ 303, nicht 302: nach einem POST muss die Methode auf GET wechseln,
  // sonst postet der Browser auf /danke/ und bekommt 405.
  assert.equal(r._status, 303);
  assert.equal(r._header.Location, "/danke/");
  assert.equal(r._beendet, true);
  assert.equal(r._json, null, "es wurde JSON an einen Browser geschickt");
});

test("Ohne JavaScript: ein Formular-Body als Text wird gelesen", async () => {
  globalThis.fetch = alleOk();
  const alsFormular = new URLSearchParams({
    ...GUELTIG,
    privacy_accepted: "on",
  }).toString();
  const r = res();
  await handler(reqOhneJs(alsFormular), r);
  assert.equal(r._status, 303, "urlencoded-Body wurde nicht verstanden");
});

test("Ohne JavaScript: fehlende Pflichtfelder geben eine lesbare Seite, kein JSON", async () => {
  globalThis.fetch = alleOk();
  const eingabe = { ...GUELTIG };
  delete eingabe.company;
  const r = res();
  await handler(reqOhneJs(eingabe), r);
  assert.equal(r._status, 400);
  assert.match(r._header["Content-Type"], /text\/html/);
  assert.match(r._html, /<!DOCTYPE html>/);
  // Die Seite muss den Ausweg nennen.
  assert.match(r._html, /964352/);
  assert.match(r._html, /noindex/);
  // Und keine Feldnamen verraten.
  assert.ok(!r._html.includes("company"), "die Fehlerseite nennt Feldnamen");
});

test("Ohne JavaScript: eine fehlgeschlagene Zustellung nennt die Vorgangsnummer", async () => {
  globalThis.fetch = fetchAttrappe([
    ["challenges.cloudflare.com", { status: 200, body: { success: true } }],
    ["api.hubapi.com", { status: 500, body: {} }],
    ["api.brevo.com", { status: 500, body: {} }],
  ]);
  const r = res();
  await handler(reqOhneJs(GUELTIG), r);
  assert.equal(r._status, 502);
  assert.match(r._html, /Vorgangsnummer/);
  assert.match(r._html, /964352/);
});

test("Ohne JavaScript: ein fehlendes Turnstile-Token blockiert die Anfrage NICHT", async () => {
  // Ohne Skript gibt es kein Token. Eine echte Anfrage darf nicht an einem
  // fehlenden Skript scheitern — der Server behandelt "kein Token" bei
  // erreichbarem Cloudflare aber als Ablehnung, also muss dieser Fall die
  // lesbare Seite bekommen und nicht rohes JSON.
  globalThis.fetch = alleOk();
  const eingabe = { ...GUELTIG };
  delete eingabe["cf-turnstile-response"];
  const r = res();
  await handler(reqOhneJs(eingabe), r);
  assert.equal(r._status, 400);
  assert.match(r._header["Content-Type"], /text\/html/);
  assert.match(r._html, /Spamschutz/);
});

test("BCC: die Bestaetigungsmail wird in HubSpot protokolliert, die interne Meldung NICHT", async () => {
  /* ⚠️ DER KERN DIESES TESTS IST DAS "NICHT". HubSpot protokolliert eine per BCC
     erhaltene Mail beim EMPFAENGER — die interne Meldung geht an FRANKONIA
     selbst, sie wuerde also an einem Kontakt "info@frankonia-sicherheit.de"
     haengen oder einen anlegen. Ein BCC an der falschen der beiden Mails ist
     kein sichtbarer Fehler, sondern zusaetzliches Rauschen im CRM, das erst
     Wochen spaeter auffaellt. */
  process.env.HUBSPOT_BCC_ADDRESS = "27143941@bcc.hubspot.com";
  const protokoll = [];
  globalThis.fetch = alleOk(protokoll);
  const r = res();
  await handler(req(GUELTIG), r);
  assert.equal(r._status, 200);

  const mails = protokoll.filter((p) => p.url.includes("smtp/email"));
  assert.equal(mails.length, 2, "es wurden nicht genau die zwei erwarteten Mails verschickt");

  const nutzlasten = mails.map((m) => JSON.parse(m.optionen.body));
  const bestaetigung = nutzlasten.find((n) => n.templateId);
  const intern = nutzlasten.find((n) => !n.templateId);
  assert.ok(bestaetigung, "die Bestaetigungsmail (mit Template) fehlt");
  assert.ok(intern, "die interne Meldung (ohne Template) fehlt");

  assert.deepEqual(bestaetigung.bcc, [{ email: "27143941@bcc.hubspot.com" }]);
  assert.equal(intern.bcc, undefined, "die interne Meldung traegt ein BCC an HubSpot");
});

test("BCC: ohne die Variable wird KEIN leeres Feld gesendet", async () => {
  /* ⚠️ Ein leeres bcc-Feld lehnt Brevo mit 400 ab, und das wuerde die
     Bestaetigungsmail kosten — also den einen Beleg, den der Interessent
     bekommt. Deshalb muss das Feld ganz fehlen und nicht leer sein. */
  delete process.env.HUBSPOT_BCC_ADDRESS;
  const protokoll = [];
  globalThis.fetch = alleOk(protokoll);
  const r = res();
  await handler(req(GUELTIG), r);
  assert.equal(r._status, 200);

  const mails = protokoll.filter((p) => p.url.includes("smtp/email"));
  for (const m of mails) {
    const n = JSON.parse(m.optionen.body);
    assert.ok(!("bcc" in n), "es wurde ein bcc-Feld ohne Adresse gesendet");
  }
});

test("BCC: ein unbrauchbarer Wert wird verworfen und nicht mitgesendet", () => {
  /* ⚠️ Der realistische Konfigurationsfehler ist keine kaputte Adressgrammatik,
     sondern eine hineinkopierte URL oder ein stehengebliebener Platzhalter.
     Beides muss zu KEINEM BCC fuehren statt zu einer 400 von Brevo. */
  const brevo = require("../api/_lib/brevo.js");
  process.env.HUBSPOT_BCC_ADDRESS = "https://app-eu1.hubspot.com/settings";
  assert.equal(brevo.bccAdresse("s1"), null);
  process.env.HUBSPOT_BCC_ADDRESS = "   ";
  assert.equal(brevo.bccAdresse("s1"), null);
  process.env.HUBSPOT_BCC_ADDRESS = "BCC-ADRESSE-HIER-EINTRAGEN";
  assert.equal(brevo.bccAdresse("s1"), null);
  /* Und der gute Fall, mit Leerzeichen drumherum wie beim Kopieren. */
  process.env.HUBSPOT_BCC_ADDRESS = "  27143941@bcc.hubspot.com  ";
  assert.equal(brevo.bccAdresse("s1"), "27143941@bcc.hubspot.com");
  delete process.env.HUBSPOT_BCC_ADDRESS;
});
