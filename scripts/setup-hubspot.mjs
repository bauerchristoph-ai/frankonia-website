/*
 * HubSpot einrichten und die Eigenschaftszuordnung prüfen. 2026-08-26.
 *
 *     HUBSPOT_SERVICE_KEY=pat-eu1-… node scripts/setup-hubspot.mjs --verify
 *     HUBSPOT_SERVICE_KEY=pat-eu1-… node scripts/setup-hubspot.mjs --dry
 *     HUBSPOT_SERVICE_KEY=pat-eu1-… node scripts/setup-hubspot.mjs
 *
 *   --verify   schreibt NICHTS. Prüft jede Eigenschaft, die der Endpoint
 *              benutzt, gegen die echte API und zeigt die Zuordnung als
 *              Tabelle. Das ist der Lauf für die Frage "sind die Formulare mit
 *              den richtigen Eigenschaftsfeldern verknüpft?".
 *   --dry      zeigt, was angelegt WÜRDE.
 *   (ohne)     legt die fehlenden Eigenschaften an.
 *
 * ⚠️⚠️ DIE ZU PRÜFENDE LISTE WIRD AUS api/_lib/hubspot.js GELESEN, nicht hier
 * gepflegt. Zwei Listen wären genau die Stelle, an der Code und CRM
 * auseinanderlaufen: das Skript würde grünes Licht geben für Felder, die der
 * Endpoint längst anders nennt. So gibt es nur eine Wahrheit, und dieses Skript
 * ist ihr Prüfer.
 *
 * ⚠️ EINMALIG UND VON HAND. Ausdrücklich NICHT Teil von api/forms/submit.js:
 * Definitionen bei jeder Übermittlung zu prüfen wären zwei zusätzliche Aufrufe
 * pro Anfrage für eine Antwort, die sich praktisch nie ändert — und im
 * Fehlerfall würde eine kaputte Definition eine echte Anfrage blockieren.
 *
 * ⚠️ IDEMPOTENT. Vorhandene Eigenschaften werden gelesen und übersprungen, nie
 * überschrieben: ein PATCH auf eine Eigenschaft, die im CRM schon benutzt wird,
 * kann Optionen und Beschriftungen zerstören. Wer eine Definition wirklich
 * ändern will, tut das in HubSpot.
 */

import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const HIER = path.dirname(fileURLToPath(import.meta.url));
const hubspot = require(path.join(HIER, "..", "api", "_lib", "hubspot.js"));

const BASIS = "https://api.hubapi.com";
const KEY = process.env.HUBSPOT_SERVICE_KEY;
const VERIFY = process.argv.includes("--verify");
const DRY = process.argv.includes("--dry");

if (!KEY) {
  console.error("HUBSPOT_SERVICE_KEY fehlt. Aufruf:");
  console.error("  HUBSPOT_SERVICE_KEY=pat-eu1-… node scripts/setup-hubspot.mjs --verify");
  process.exit(1);
}

const kopf = { Authorization: "Bearer " + KEY, "Content-Type": "application/json" };

/*
 * Die eigene Gruppe ist keine Kosmetik: ohne sie landen zehn Felder zwischen
 * den HubSpot-Standardfeldern und sind im CRM praktisch nicht wiederzufinden.
 */
const GRUPPE = { name: "website_integration", label: "Website-Integration" };

// Beschriftungen für die eigenen Felder. Die NAMEN kommen aus hubspot.js; hier
// steht nur, wie sie im CRM heißen sollen.
const LABELS = {
  website_form_type: "Formulartyp",
  website_service: "Angefragte Leistung",
  website_submission_id: "Submission-ID",
  website_page_url: "Formularseite",
  website_last_submission: "Letzte Formularanfrage",
  website_utm_source: "UTM Source",
  website_utm_medium: "UTM Medium",
  website_utm_campaign: "UTM Campaign",
  website_utm_content: "UTM Content",
  website_utm_term: "UTM Term",
};

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

/** Alle Kontakteigenschaften des Portals, als Map name -> Definition. */
async function alleEigenschaften() {
  const res = await api("/crm/v3/properties/contacts");
  if (!res.ok) {
    console.error("  Eigenschaften konnten nicht gelesen werden: " + res.status);
    return null;
  }
  const m = new Map();
  for (const p of res.body.results || []) m.set(p.name, p);
  return m;
}

/* ================================================================ verify */

/**
 * Prüft jede Eigenschaft, die der Endpoint schreibt.
 * ⚠️ Der Typ wird MITGEPRÜFT, nicht nur die Existenz: eine Eigenschaft
 * `website_last_submission` als Text angelegt nimmt einen ISO-Zeitstempel an,
 * aber HubSpot kann danach nicht nach Datum filtern oder sortieren — und das
 * fällt erst auf, wenn jemand eine Liste "Anfragen der letzten 30 Tage" bauen
 * will.
 */
async function verify() {
  const vorhanden = await alleEigenschaften();
  if (!vorhanden) return 1;

  let fehler = 0;
  const zeile = (status, feld, name, extra) =>
    console.log("  " + status + "  " + String(feld).padEnd(16) + "-> " + String(name).padEnd(26) + (extra || ""));

  console.log("\n  STANDARDEIGENSCHAFTEN (existieren in jedem Portal)");
  for (const [feld, name] of Object.entries(hubspot.STANDARD_MAP)) {
    const p = vorhanden.get(name);
    if (!p) { zeile("✗", feld, name, "FEHLT — das Portal ist nicht in Ordnung"); fehler++; }
    else zeile("✓", feld, name, p.label ? '"' + p.label + '"' : "");
  }

  console.log("\n  BEDINGT GESETZTE STANDARDEIGENSCHAFTEN");
  for (const [name, wann] of Object.entries(hubspot.STANDARD_BEDINGT)) {
    const p = vorhanden.get(name);
    if (!p) {
      // hs_marketable_status gibt es nur mit aktivierter
      // Marketing-Contacts-Funktion. Das ist kein Fehler dieses Projekts.
      const hinweis =
        name === "hs_marketable_status"
          ? "fehlt — Marketing-Contacts im Portal nicht aktiv (kein Fehler, wird uebersprungen)"
          : "FEHLT";
      zeile(name === "hs_marketable_status" ? "•" : "✗", "(bedingt)", name, hinweis);
      if (name !== "hs_marketable_status") fehler++;
    } else zeile("✓", "(bedingt)", name, wann);
  }

  console.log("\n  EIGENE EIGENSCHAFTEN (muessen angelegt sein)");
  const eigen = hubspot.eigeneEigenschaften();
  const rueck = Object.fromEntries(Object.entries(hubspot.EIGEN_MAP).map(([f, n]) => [n, f]));
  for (const [name, sollTyp] of Object.entries(eigen)) {
    const feld = rueck[name] || "(Server)";
    const p = vorhanden.get(name);
    if (!p) {
      zeile("✗", feld, name, "FEHLT — ohne --verify anlegen");
      fehler++;
      continue;
    }
    if (p.type !== sollTyp) {
      zeile("✗", feld, name, 'Typ "' + p.type + '", erwartet "' + sollTyp + '"');
      fehler++;
      continue;
    }
    const gruppe = p.groupName === GRUPPE.name ? "" : ' [Gruppe "' + p.groupName + '" statt ' + GRUPPE.name + "]";
    zeile("✓", feld, name, p.type + gruppe);
  }

  console.log("\n  WEITERE OBJEKTE");
  const firma = await api("/crm/v3/properties/companies");
  const hatName = firma.ok && (firma.body.results || []).some((p) => p.name === "name");
  console.log("  " + (hatName ? "✓" : "✗") + "  company.name" + (hatName ? "" : "  FEHLT"));
  if (!hatName) fehler++;
  const notiz = await api("/crm/v3/properties/notes");
  for (const n of ["hs_note_body", "hs_timestamp"]) {
    const da = notiz.ok && (notiz.body.results || []).some((p) => p.name === n);
    console.log("  " + (da ? "✓" : "✗") + "  note." + n + (da ? "" : "  FEHLT"));
    if (!da) fehler++;
  }

  console.log(
    "\n  " + (fehler === 0
      ? "Alles verknuepft. Die Formulare schreiben in genau diese Felder."
      : fehler + " Problem(e) — ohne --verify laufen lassen, um die eigenen Felder anzulegen.")
  );
  return fehler;
}

/* ------------------------------------------------------------------ Gruppe */

async function gruppeSicherstellen() {
  const vorhanden = await api("/crm/v3/properties/contacts/groups");
  if (!vorhanden.ok) {
    console.error("  Gruppen konnten nicht gelesen werden: " + vorhanden.status);
    return false;
  }
  const treffer = (vorhanden.body.results || []).find((g) => g.name === GRUPPE.name);
  if (treffer) {
    console.log("  Gruppe " + GRUPPE.name + ": vorhanden");
    return true;
  }
  if (DRY) {
    console.log("  Gruppe " + GRUPPE.name + ": WUERDE angelegt");
    return true;
  }
  const neu = await api("/crm/v3/properties/contacts/groups", {
    method: "POST",
    body: JSON.stringify(GRUPPE),
  });
  console.log("  Gruppe " + GRUPPE.name + ": " + (neu.ok ? "angelegt" : "FEHLER " + neu.status));
  return neu.ok;
}

/* -------------------------------------------------------------- Anlegen */

async function propertiesAnlegen() {
  const vorhanden = await alleEigenschaften();
  if (!vorhanden) return;

  let angelegt = 0, uebersprungen = 0, fehler = 0;
  for (const [name, typ] of Object.entries(hubspot.eigeneEigenschaften())) {
    if (vorhanden.has(name)) {
      console.log("  " + name.padEnd(30) + "vorhanden, uebersprungen");
      uebersprungen++;
      continue;
    }
    const p = {
      name,
      label: LABELS[name] || name,
      description: LABELS[name] || name,
      type: typ,
      // ⚠️ fieldType ist NICHT type. `type` ist der Datentyp, `fieldType` das
      // Eingabefeld im CRM. Ein datetime mit fieldType "text" laesst sich nicht
      // als Datum filtern.
      fieldType: typ === "datetime" ? "date" : "text",
      groupName: GRUPPE.name,
    };
    if (DRY) {
      console.log("  " + name.padEnd(30) + "WUERDE angelegt (" + typ + ")");
      angelegt++;
      continue;
    }
    const res = await api("/crm/v3/properties/contacts", { method: "POST", body: JSON.stringify(p) });
    if (res.ok) {
      console.log("  " + name.padEnd(30) + "angelegt (" + typ + ")");
      angelegt++;
    } else {
      console.log("  " + name.padEnd(30) + "FEHLER " + res.status + " " + JSON.stringify(res.body).slice(0, 200));
      fehler++;
    }
  }
  console.log("\n  angelegt: " + angelegt + ", uebersprungen: " + uebersprungen + ", Fehler: " + fehler);
}

/* ------------------------------------------------- Subscription Types */

/**
 * ⚠️ NUR LESEN, NIE ANLEGEN. Ein Subscription Type ist eine
 * Einwilligungskategorie: legt man versehentlich eine zweite an, gehen
 * bestehende Einwilligungen nicht mit über, und es gibt keinen sauberen Weg
 * zurück. Dieses Skript gibt die vorhandenen aus und schlägt die Zeile für
 * .env.local vor — die Auswahl trifft der Kunde.
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

  // "One to One" ist der Typ, den der Kunde am 26.08.2026 benannt hat. Die
  // Suche ist absichtlich unscharf (Leerzeichen, Bindestriche, Gross/Klein),
  // weil der Name je Portal leicht abweichen kann.
  const norm = (x) => String(x || "").toLowerCase().replace(/[^a-z]/g, "");
  const treffer = liste.filter((s) => norm(s.name || s.internalName).includes("onetoone"));
  console.log("");
  if (treffer.length === 1) {
    console.log('  Fuer "One to One" in .env.local und in Vercel eintragen:');
    console.log("      HUBSPOT_SUBSCRIPTION_ID_ONE_TO_ONE=" + treffer[0].id);
  } else if (treffer.length > 1) {
    console.log('  ⚠️ MEHRERE Typen enthalten "One to One" — bitte selbst auswaehlen:');
    for (const t of treffer) console.log("      id=" + t.id + "  " + (t.name || t.internalName));
  } else {
    console.log('  ⚠️ KEIN Typ mit "One to One" gefunden. Bitte oben auswaehlen und');
    console.log("     HUBSPOT_SUBSCRIPTION_ID_ONE_TO_ONE selbst setzen.");
  }
  console.log("");
  console.log("  ⚠️ Ohne diese Variable vermerkt der Endpoint die Einwilligung NICHT in");
  console.log("     HubSpot — er raet keine ID. In Brevo wird sie trotzdem gesetzt (OPT_IN).");
}

/* ------------------------------------------------------------------- Ablauf */

console.log("HubSpot" + (VERIFY ? " — Pruefung, es wird nichts geschrieben" : DRY ? " — Trockenlauf" : " — Einrichtung"));
console.log("Portal: " + (process.env.HUBSPOT_PORTAL_ID || "(HUBSPOT_PORTAL_ID nicht gesetzt)"));

if (VERIFY) {
  const fehler = await verify();
  console.log("\nSubscription Types (nur lesen)");
  await subscriptionTypes();
  process.exit(fehler === 0 ? 0 : 2);
}

console.log("\n1 — Eigenschaftsgruppe");
const gruppeOk = await gruppeSicherstellen();

if (gruppeOk) {
  console.log("\n2 — Eigene Eigenschaften");
  await propertiesAnlegen();
} else {
  console.log("\n2 — uebersprungen, weil die Gruppe fehlt");
}

console.log("\n3 — Vorhandene Subscription Types (nur lesen)");
await subscriptionTypes();

console.log("\nFertig. Zum Gegenpruefen: node scripts/setup-hubspot.mjs --verify");
