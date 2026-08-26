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
    _header: {},
    setHeader(k, v) { this._header[k] = v; return this; },
    status(s) { this._status = s; return this; },
    json(o) { this._json = o; return this; },
  };
  return r;
}

function req(body, kopf = {}) {
  return {
    method: "POST",
    headers: { "x-forwarded-for": "203.0.113.7", ...kopf },
    socket: { remoteAddress: "203.0.113.7" },
    body,
  };
}

const GUELTIG = {
  form_type: "customer_inquiry",
  first_name: "Erika",
  last_name: "Mustermann",
  email: "erika.mustermann@example.org",
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
  for (const feld of ["first_name", "last_name", "email", "company", "message"]) {
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

test("Lifecycle: ein bestehender Kunde wird nicht auf Lead zurückgestuft", () => {
  assert.equal(hubspot.darfAufLeadSetzen("customer"), false);
  assert.equal(hubspot.darfAufLeadSetzen("opportunity"), false);
  assert.equal(hubspot.darfAufLeadSetzen("salesqualifiedlead"), false);
  assert.equal(hubspot.darfAufLeadSetzen("lead"), false);
  // Früher als Lead: darf hoch.
  assert.equal(hubspot.darfAufLeadSetzen("subscriber"), true);
  // Neu oder leer: darf gesetzt werden.
  assert.equal(hubspot.darfAufLeadSetzen(""), true);
  assert.equal(hubspot.darfAufLeadSetzen(null), true);
  // Unbekannt: nicht anfassen.
  assert.equal(hubspot.darfAufLeadSetzen("irgendwas"), false);
});

test("Lifecycle: hs_lead_status nur bei neuen Kontakten", () => {
  const d = validate(GUELTIG).daten;
  const neu = hubspot.kontaktProperties(d, "s1", "2026-08-26T10:00:00.000Z", null);
  assert.equal(neu.hs_lead_status, "NEW");
  assert.equal(neu.lifecyclestage, "lead");

  const bestehend = hubspot.kontaktProperties(d, "s1", "2026-08-26T10:00:00.000Z", {
    id: "1",
    properties: { lifecyclestage: "customer", hs_lead_status: "OPEN" },
  });
  assert.equal(bestehend.hs_lead_status, undefined, "hs_lead_status wurde auf NEW zurueckgesetzt");
  assert.equal(bestehend.lifecyclestage, undefined, "lifecyclestage wurde zurueckgestuft");
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
