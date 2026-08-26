/*
 * Legt die Custom Properties für die Website-Integration in HubSpot an.
 * 2026-08-26.
 *
 *     HUBSPOT_SERVICE_KEY=pat-eu1-… node scripts/setup-hubspot.mjs
 *     HUBSPOT_SERVICE_KEY=pat-eu1-… node scripts/setup-hubspot.mjs --dry
 *
 * ⚠️ EINMALIG UND VON HAND. Ausdrücklich NICHT Teil von api/forms/submit.js:
 * Property-Definitionen bei jeder Formularübermittlung zu prüfen wären zwei
 * zusätzliche API-Aufrufe pro Anfrage, für eine Prüfung, deren Antwort sich
 * praktisch nie ändert — und im Fehlerfall würde eine kaputte Definition eine
 * echte Anfrage blockieren.
 *
 * ⚠️ IDEMPOTENT. Vorhandene Properties werden gelesen und übersprungen, nicht
 * überschrieben: ein PATCH auf eine Property, die im CRM schon benutzt wird,
 * kann Optionen und Beschriftungen zerstören. Wer eine Definition wirklich
 * ändern will, tut das in HubSpot und nicht hier.
 *
 * ⚠️ ESM (.mjs), weil das Projekt CommonJS ist und dieses Skript
 * `--experimental`-frei Top-Level-await benutzen soll. Kein Widerspruch zur
 * Projektkonvention: es läuft nie im Build und nie im Browser.
 */

const BASIS = "https://api.hubapi.com";
const KEY = process.env.HUBSPOT_SERVICE_KEY;
const DRY = process.argv.includes("--dry");

if (!KEY) {
  console.error("HUBSPOT_SERVICE_KEY fehlt. Aufruf:");
  console.error("  HUBSPOT_SERVICE_KEY=pat-eu1-… node scripts/setup-hubspot.mjs");
  process.exit(1);
}

const kopf = {
  Authorization: "Bearer " + KEY,
  "Content-Type": "application/json",
};

/*
 * Die eigene Gruppe ist keine Kosmetik: ohne sie landen zehn Felder zwischen
 * den HubSpot-Standardfeldern und sind im CRM praktisch nicht wiederzufinden.
 */
const GRUPPE = { name: "website_integration", label: "Website-Integration" };

const PROPERTIES = [
  ["website_form_type", "Formulartyp", "Welches Formular ausgefüllt wurde"],
  ["website_service", "Angefragte Leistung", "Die auf der Seite angefragte Leistung"],
  ["website_submission_id", "Submission-ID", "Eindeutige ID der Übermittlung, auch in den Serverlogs"],
  ["website_page_url", "Formularseite", "Seite, auf der das Formular abgesendet wurde"],
  ["website_utm_source", "UTM Source", null],
  ["website_utm_medium", "UTM Medium", null],
  ["website_utm_campaign", "UTM Campaign", null],
  ["website_utm_content", "UTM Content", null],
  ["website_utm_term", "UTM Term", null],
];

// Eigener Eintrag, weil der Typ abweicht.
const DATETIME_PROPERTY = [
  "website_last_submission",
  "Letzte Formularanfrage",
  "Zeitpunkt der letzten Übermittlung über die Website",
];

async function api(pfad, optionen = {}) {
  const res = await fetch(BASIS + pfad, { headers: kopf, ...optionen });
  const text = await res.text();
  let body = text;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    /* HTML-Fehlerseite eines Gateways */
  }
  return { ok: res.ok, status: res.status, body };
}

/* ------------------------------------------------------------------ Gruppe */

async function gruppeSicherstellen() {
  const vorhanden = await api("/crm/v3/properties/contacts/groups");
  if (!vorhanden.ok) {
    console.error("Gruppen konnten nicht gelesen werden: " + vorhanden.status);
    return false;
  }
  const treffer = (vorhanden.body.results || []).find((g) => g.name === GRUPPE.name);
  if (treffer) {
    console.log("  Gruppe " + GRUPPE.name + ": vorhanden");
    return true;
  }
  if (DRY) {
    console.log("  Gruppe " + GRUPPE.name + ": WÜRDE angelegt");
    return true;
  }
  const neu = await api("/crm/v3/properties/contacts/groups", {
    method: "POST",
    body: JSON.stringify(GRUPPE),
  });
  console.log("  Gruppe " + GRUPPE.name + ": " + (neu.ok ? "angelegt" : "FEHLER " + neu.status));
  return neu.ok;
}

/* -------------------------------------------------------------- Properties */

async function propertiesAnlegen() {
  const vorhanden = await api("/crm/v3/properties/contacts");
  if (!vorhanden.ok) {
    console.error("Properties konnten nicht gelesen werden: " + vorhanden.status);
    return;
  }
  const namen = new Set((vorhanden.body.results || []).map((p) => p.name));

  const alle = [
    ...PROPERTIES.map(([name, label, beschreibung]) => ({
      name,
      label,
      description: beschreibung || label,
      type: "string",
      fieldType: "text",
      groupName: GRUPPE.name,
    })),
    {
      name: DATETIME_PROPERTY[0],
      label: DATETIME_PROPERTY[1],
      description: DATETIME_PROPERTY[2],
      type: "datetime",
      fieldType: "date",
      groupName: GRUPPE.name,
    },
  ];

  let angelegt = 0, uebersprungen = 0, fehler = 0;
  for (const p of alle) {
    if (namen.has(p.name)) {
      console.log("  " + p.name.padEnd(30) + "vorhanden, übersprungen");
      uebersprungen++;
      continue;
    }
    if (DRY) {
      console.log("  " + p.name.padEnd(30) + "WÜRDE angelegt (" + p.type + ")");
      angelegt++;
      continue;
    }
    const res = await api("/crm/v3/properties/contacts", { method: "POST", body: JSON.stringify(p) });
    if (res.ok) {
      console.log("  " + p.name.padEnd(30) + "angelegt (" + p.type + ")");
      angelegt++;
    } else {
      console.log("  " + p.name.padEnd(30) + "FEHLER " + res.status + " " + JSON.stringify(res.body).slice(0, 200));
      fehler++;
    }
  }
  console.log("\n  angelegt: " + angelegt + ", übersprungen: " + uebersprungen + ", Fehler: " + fehler);
}

/* ------------------------------------------------- Subscription Types lesen */

/**
 * ⚠️ NUR LESEN, NIE ANLEGEN. Ein neuer Subscription Type ist eine
 * Einwilligungskategorie: legt man versehentlich eine zweite an, gehen
 * bestehende Einwilligungen nicht mit über, und es gibt keinen sauberen Weg
 * zurück. Deshalb gibt dieses Skript die vorhandenen IDs nur aus — die
 * Entscheidung, welche verwendet wird, trifft der Kunde.
 *
 * Die IDs waren beim Bau der Integration nicht verfügbar (kein API-Schlüssel
 * vorhanden), deshalb setzt api/forms/submit.js in HubSpot KEINE
 * Marketing-Einwilligung. Die Einwilligung landet in Brevo (Attribut OPT_IN).
 */
async function subscriptionTypes() {
  const res = await api("/communication-preferences/v3/definitions");
  if (!res.ok) {
    console.log("  konnten nicht gelesen werden: " + res.status + " (Scope communication_preferences.read?)");
    return;
  }
  const liste = res.body.subscriptionDefinitions || res.body.results || [];
  if (!liste.length) {
    console.log("  keine definiert");
    return;
  }
  for (const s of liste) {
    console.log(
      "  id=" + String(s.id).padEnd(8) +
      (s.name || s.internalName || "?").padEnd(34) +
      (s.purpose || s.communicationMethod || "") +
      (s.isActive === false ? "  [inaktiv]" : "")
    );
  }
  console.log("\n  ⚠️ Diese IDs gehören in den Bericht. api/forms/submit.js setzt");
  console.log("     bewusst keine HubSpot-Marketing-Einwilligung, solange nicht");
  console.log("     entschieden ist, welcher Typ gemeint ist.");
}

/* ------------------------------------------------------------------- Ablauf */

console.log("HubSpot-Setup" + (DRY ? " (Trockenlauf, es wird nichts geschrieben)" : ""));
console.log("Portal: " + (process.env.HUBSPOT_PORTAL_ID || "(HUBSPOT_PORTAL_ID nicht gesetzt)"));

console.log("\n1 — Eigenschaftsgruppe");
const gruppeOk = await gruppeSicherstellen();

if (gruppeOk) {
  console.log("\n2 — Custom Properties");
  await propertiesAnlegen();
} else {
  console.log("\n2 — übersprungen, weil die Gruppe fehlt");
}

console.log("\n3 — vorhandene Subscription Types (nur lesen)");
await subscriptionTypes();

console.log("\nFertig.");
