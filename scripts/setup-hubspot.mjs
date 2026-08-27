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

  /* ⚠️ EIGENSCHAFT DES PORTALS, DIE WIR SCHREIBEN ABER NIE ANLEGEN. Sie gehört
     dem Kunden, samt Optionen und samt Bedeutung für seinen Vertrieb — dieses
     Skript prüft sie nur. Und die Prüfung geht eine Stufe tiefer als bei allen
     anderen: es reicht nicht, dass die Eigenschaft existiert, der WERT muss
     eine echte Option sein. Ein umbenanntes „(Potenzieller) Kunde" lehnt
     HubSpot mit 400 ab, und zwar den gesamten Aufruf — der zweite Versuch in
     kontaktUpsert() rettet dann den Lead, aber ohne die Zusatzfelder.
     Das ist genau die Art Ausfall, die niemand bemerkt. */
  console.log("\n  ROLLE JE FORMULARTYP (Eigenschaft des Portals, wird nur geprueft)");
  const rolleProp = vorhanden.get(hubspot.ROLLE_PROPERTY);
  if (!rolleProp) {
    zeile("✗", "(Rolle)", hubspot.ROLLE_PROPERTY, "FEHLT im Portal — der Wert wird dann verworfen");
    fehler++;
  } else {
    const optionen = (rolleProp.options || []).map((o) => String(o.value));
    zeile("✓", "(Rolle)", hubspot.ROLLE_PROPERTY, '"' + rolleProp.label + '", ' + optionen.length + " Optionen");
    for (const [typ, wert] of Object.entries(hubspot.ROLLE_JE_FORMULARTYP)) {
      const passt = optionen.includes(wert);
      const beschriftung = passt
        ? '"' + (rolleProp.options.find((o) => String(o.value) === wert).label || "") + '"'
        : "KEINE OPTION — HubSpot lehnt den Aufruf mit 400 ab. Vorhanden: " + optionen.join(" | ");
      zeile(passt ? "✓" : "✗", typ, wert, beschriftung);
      if (!passt) fehler++;
    }
  }

  console.log("\n  WEITERE OBJEKTE");
  /* ⚠️ Das Firmenobjekt wird standardmäßig NICHT angelegt (Kundenentscheidung
     26.08.2026; HUBSPOT_FIRMA_ANLEGEN=1 schaltet es ein). Die Prüfung bleibt
     stehen, aber ein fehlendes company.name ist dann kein Fehler dieses
     Projekts — nur ein Hinweis für den Tag, an dem der Schalter umgelegt wird. */
  const firmaAn = process.env.HUBSPOT_FIRMA_ANLEGEN === "1";
  const firma = await api("/crm/v3/properties/companies");
  const hatName = firma.ok && (firma.body.results || []).some((p) => p.name === "name");
  console.log(
    "  " +
      (hatName ? "✓" : firmaAn ? "✗" : "•") +
      "  company.name" +
      (hatName
        ? firmaAn ? "  (Firmenobjekt AN)" : "  (Firmenobjekt aus, wird derzeit nicht benutzt)"
        : "  FEHLT")
  );
  if (!hatName && firmaAn) fehler++;
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

/* ================================ Lifecycle-Stufen (nur lesen)
 *
 * ⚠️ WARUM DAS HIER STEHT: der interne Name einer Stufe und ihr LABEL sind in
 * HubSpot zwei verschiedene Dinge, und das Label ist pro Portal frei
 * umbenennbar. In diesem Portal heisst der Standardname "lead" nicht "Lead",
 * sondern "Termin vereinbart" — der Endpoint hätte das beim Live-Test am
 * 26.08.2026 so geschrieben, also mehrere Stufen zu weit für einen
 * Formulareingang. Deshalb wird die Stufe nicht mehr geraten, sondern kommt aus
 * HUBSPOT_LIFECYCLE_STAGE — und diese Liste ist die Auswahl dazu. */
let abweichung = false;

/* ------------------------------------------- BCC-Protokollierung (nur lesen) */

/* ⚠️ NICHT ÜBER DIE API PRÜFBAR, und deshalb steht hier nur, ob die Variable
   gesetzt ist. Die BCC-Adresse ist portalspezifisch und wird bewusst NICHT
   geraten — auch nicht als "<PortalId>@bcc.hubspot.com", obwohl das bei vielen
   Portalen stimmt: bei einer falschen Adresse geht die Mail an ein
   Nirgendwo, das Bounces produziert, und Bounces kosten Absender-Reputation.
   Dieselbe Regel wie bei den Subscription-IDs. */
function bccPruefen() {
  const wert = (process.env.HUBSPOT_BCC_ADDRESS || "").trim();
  console.log("\nBCC-Protokollierung der Bestaetigungsmail");
  if (!wert) {
    console.log("  •  HUBSPOT_BCC_ADDRESS ist NICHT gesetzt.");
    console.log("     Dann steht in der Aktivitaetenliste des Kontakts nur die Notiz,");
    console.log("     nicht die Mail, die der Interessent bekommen hat.");
    console.log("     Die Adresse steht in den HubSpot-Einstellungen (dort nach \"BCC\"");
    console.log("     suchen) und gehoert in .env.local UND in Vercel.");
    return;
  }
  const plausibel = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(wert);
  const sichtbar = wert.replace(/^(.{2}).*(@.*)$/, "$1***$2");
  if (!plausibel) {
    console.log("  ✗  HUBSPOT_BCC_ADDRESS ist gesetzt, sieht aber nicht wie eine Adresse aus:");
    console.log("     " + sichtbar + " — der Endpoint verwirft den Wert und setzt kein BCC.");
    abweichung = true;
    return;
  }
  console.log("  ✓  HUBSPOT_BCC_ADDRESS = " + sichtbar);
  console.log("     Die Bestaetigungsmail geht zusaetzlich an diese Adresse. Ob HubSpot sie");
  console.log("     wirklich protokolliert, zeigt erst der naechste echte Eintrag — das");
  console.log("     haengt am Portal und nicht an diesem Code.");
}

async function lifecycleStufen() {
  console.log("\nLifecycle-Stufen dieses Portals (nur lesen)");
  const res = await api("/crm/v3/properties/contacts/lifecyclestage");
  if (!res.ok) {
    console.log("  konnten nicht gelesen werden: " + res.status);
    return;
  }
  const gesetzt = process.env.HUBSPOT_LIFECYCLE_STAGE;
  const imPortal = [];
  for (const o of (res.body && res.body.options) || []) {
    imPortal.push(String(o.value));
    const treffer = gesetzt && String(o.value) === String(gesetzt);
    console.log("  " + (treffer ? "\u2713" : " ") + "  " + String(o.value).padEnd(14) + o.label);
  }

  /* ⚠️ ABWEICHUNGSPRÜFUNG, und die ist der eigentliche Grund für diesen Block.
     Verglichen wird die MENGE der Phasen, NICHT ihre Reihenfolge — und das ist
     eine Änderung vom 26.08.2026, die man kennen muss: die Liste im Code war
     ursprünglich ein Spiegel der Portalreihenfolge, ist jetzt aber eine eigene
     Rangfolge. "Sonstiges" und "Kein Interesse" stehen dort bewusst ganz vorne,
     damit eine neue Anfrage sie überschreiben darf (Kundenentscheidung). Ein
     Reihenfolgevergleich würde ab jetzt bei jedem Lauf Alarm schlagen, obwohl
     nichts kaputt ist.
     Was trotzdem auffallen MUSS: eine Phase, die es im Portal gibt und im Code
     nicht. Deren Wirkung wäre still — sie gilt als unbekannt, der Kontakt wird
     gar nicht umsortiert, und niemand merkt es. */
  const imCode = hubspot.LIFECYCLE_REIHENFOLGE.map(String);
  const fehltImCode = imPortal.filter((v) => !imCode.includes(v));
  const fehltImPortal = imCode.filter((v) => !imPortal.includes(v));
  if (!fehltImCode.length && !fehltImPortal.length) {
    console.log("\n  \u2713 api/_lib/hubspot.js kennt alle " + imCode.length + " Phasen des Portals.");
    console.log("     (Die Reihenfolge im Code ist eine eigene Rangfolge, kein Spiegel.)");
  } else {
    console.log("\n  \u2717 ABWEICHUNG zu LIFECYCLE_REIHENFOLGE in api/_lib/hubspot.js:");
    if (fehltImCode.length) console.log("      im Portal, im Code NICHT: " + fehltImCode.join(", "));
    if (fehltImPortal.length) console.log("      im Code, im Portal NICHT: " + fehltImPortal.join(", "));
    console.log("      \u26a0\ufe0f Kontakte in einer nicht gelisteten Phase werden NICHT");
    console.log("         umsortiert \u2014 ohne Fehlermeldung. Liste nachfuehren, und dabei");
    console.log("         entscheiden, ob die neue Phase vor oder hinter das Ziel gehoert.");
    abweichung = true;
  }
  if (gesetzt) {
    console.log("\n  HUBSPOT_LIFECYCLE_STAGE=" + gesetzt + " ist gesetzt.");
    return;
  }
  console.log("");
  console.log("  \u26a0\ufe0f HUBSPOT_LIFECYCLE_STAGE ist NICHT gesetzt. Dann schreibt der Endpoint");
  console.log("     die Phase gar nicht und HubSpot nimmt seine eigene Voreinstellung.");
  console.log("     Das ist bewusst der Rueckfall: welche Stufe fuer eine Website-Anfrage");
  console.log("     fachlich richtig ist, weiss nur der Kunde. Einen der internen Namen");
  console.log("     oben eintragen, wenn eine bestimmte gewuenscht ist.");
}

/* ------------------------------------------------------------------- Ablauf */

console.log("HubSpot" + (VERIFY ? " — Pruefung, es wird nichts geschrieben" : DRY ? " — Trockenlauf" : " — Einrichtung"));
console.log("Portal: " + (process.env.HUBSPOT_PORTAL_ID || "(HUBSPOT_PORTAL_ID nicht gesetzt)"));

if (VERIFY) {
  const fehler = await verify();
  await lifecycleStufen();
  console.log("\nSubscription Types (nur lesen)");
  await subscriptionTypes();
  bccPruefen();
  process.exit(fehler === 0 && !abweichung ? 0 : 2);
}

console.log("\n1 — Eigenschaftsgruppe");
const gruppeOk = await gruppeSicherstellen();

if (gruppeOk) {
  console.log("\n2 — Eigene Eigenschaften");
  await propertiesAnlegen();
} else {
  console.log("\n2 — uebersprungen, weil die Gruppe fehlt");
}

await lifecycleStufen();

console.log("\n3 — Vorhandene Subscription Types (nur lesen)");
await subscriptionTypes();

bccPruefen();

console.log("\nFertig. Zum Gegenpruefen: node scripts/setup-hubspot.mjs --verify");
