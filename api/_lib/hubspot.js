/*
 * HubSpot: Kontakt, Unternehmen, Assoziation, Notiz. 2026-08-26.
 *
 * Portal 27143941, Datenhosting EU.
 * ⚠️ API-BASIS IST api.hubapi.com, NICHT eine EU-App-Domain. Das Datenhosting
 * in der EU ist eine Eigenschaft des Portals, keine andere API-Adresse; wer
 * hier eine EU-Domain einsetzt, bekommt 404.
 *
 * ⚠️ AUSDRÜCKLICH NICHT: kein Deal. Es gibt genau eine Pipeline
 * ("Sales-Pipeline", ID default, 7 Phasen); die bleibt dem Vertrieb
 * vorbehalten und wird nicht mit unqualifizierten Formularanfragen gefüllt.
 * Entscheidung des Kunden vom 24.08.2026.
 *
 * ⚠️ AUSDRÜCKLICH NICHT: keine Marketing-Einwilligung. Eine Angebotsanfrage
 * ist keine Newsletter-Anmeldung. Das Feld `marketing_opt_in` wird nach Brevo
 * geschrieben (Attribut OPT_IN) und hier nur als Custom Property vermerkt,
 * damit der Vertrieb es sieht — es wird KEIN HubSpot-Subscription-Type
 * gesetzt. Dafür bräuchte es die IDs aus
 * GET /communication-preferences/v3/definitions; die liest
 * scripts/setup-hubspot.mjs aus und gibt sie aus, statt einen anzulegen.
 */

const { anfrage } = require("./http");
const { log } = require("./log");

const BASIS = "https://api.hubapi.com";

/*
 * ⚠️ DIE LIFECYCLE-REIHENFOLGE IST LOAD-BEARING. `lifecyclestage` darf nur
 * gesetzt werden, wenn der Kontakt neu ist oder aktuell in einer FRÜHEREN
 * Phase steht. Einen bestehenden Kunden, der ein zweites Objekt anfragt, auf
 * "Lead" zurückzustufen, wäre eine stille Datenverschlechterung im CRM: er
 * fällt aus Kundenlisten heraus und taucht in Lead-Reports auf. Das merkt
 * niemand am Tag der Anfrage, sondern Wochen später im Reporting.
 */
const LIFECYCLE_REIHENFOLGE = [
  "subscriber",
  "lead",
  "marketingqualifiedlead",
  "salesqualifiedlead",
  "opportunity",
  "customer",
  "evangelist",
  "other",
];

function darfAufLeadSetzen(aktuell) {
  if (!aktuell) return true;
  const i = LIFECYCLE_REIHENFOLGE.indexOf(String(aktuell).toLowerCase());
  const lead = LIFECYCLE_REIHENFOLGE.indexOf("lead");
  // Unbekannte Phase: nicht anfassen. Lieber nichts tun als falsch setzen.
  if (i < 0) return false;
  return i < lead;
}

function kopf() {
  return {
    Authorization: "Bearer " + process.env.HUBSPOT_SERVICE_KEY,
    "Content-Type": "application/json",
  };
}

function konfiguriert() {
  return Boolean(process.env.HUBSPOT_SERVICE_KEY);
}

/* ------------------------------------------------------------------ Kontakt */

async function kontaktSuchen(email, submissionId) {
  const res = await anfrage("hubspot.kontakt.suchen", submissionId, BASIS + "/crm/v3/objects/contacts/search", {
    method: "POST",
    headers: kopf(),
    body: JSON.stringify({
      filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: email }] }],
      properties: ["email", "lifecyclestage", "hs_lead_status"],
      limit: 1,
    }),
  });
  if (!res.ok) return { ok: false, kontakt: null };
  const treffer = res.body && res.body.results && res.body.results[0];
  return { ok: true, kontakt: treffer || null };
}

/**
 * Baut die Eigenschaften für den Kontakt.
 * `vorhanden` ist der gefundene Kontakt oder null.
 */
function kontaktProperties(d, submissionId, zeitstempel, vorhanden) {
  const p = {
    firstname: d.first_name,
    lastname: d.last_name,
    email: d.email,
    website_form_type: d.form_type,
    website_submission_id: submissionId,
    website_page_url: d.page_url || "",
    // ⚠️ HubSpot erwartet bei einem datetime-Feld Millisekunden seit Epoch
    // ODER einen ISO-8601-Zeitstempel. ISO ist lesbarer und wird akzeptiert.
    website_last_submission: zeitstempel,
  };
  if (d.phone) p.phone = d.phone;
  if (d.company) p.company = d.company;
  if (d.service) p.website_service = d.service;

  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    if (d[k]) p["website_" + k] = d[k];
  }

  // Nur bei neuen Kontakten oder aus einer früheren Phase heraus.
  const aktuell = vorhanden && vorhanden.properties && vorhanden.properties.lifecyclestage;
  if (!vorhanden || darfAufLeadSetzen(aktuell)) p.lifecyclestage = "lead";
  // hs_lead_status nur bei neuen Kontakten: ein Kontakt, den der Vertrieb
  // schon auf "In Bearbeitung" gesetzt hat, darf nicht auf "Neu" zurückfallen.
  if (!vorhanden) p.hs_lead_status = "NEW";

  return p;
}

async function kontaktUpsert(d, submissionId, zeitstempel) {
  const gefunden = await kontaktSuchen(d.email, submissionId);
  const vorhanden = gefunden.kontakt;
  const properties = kontaktProperties(d, submissionId, zeitstempel, vorhanden);

  const res = vorhanden
    ? await anfrage("hubspot.kontakt.aktualisieren", submissionId, BASIS + "/crm/v3/objects/contacts/" + vorhanden.id, {
        method: "PATCH",
        headers: kopf(),
        body: JSON.stringify({ properties }),
      })
    : await anfrage("hubspot.kontakt.anlegen", submissionId, BASIS + "/crm/v3/objects/contacts", {
        method: "POST",
        headers: kopf(),
        body: JSON.stringify({ properties }),
      });

  if (!res.ok) return { ok: false, id: vorhanden ? vorhanden.id : null, neu: !vorhanden };
  return { ok: true, id: (res.body && res.body.id) || (vorhanden && vorhanden.id), neu: !vorhanden };
}

/* -------------------------------------------------------------- Unternehmen */

async function unternehmenUpsert(name, submissionId) {
  const suche = await anfrage("hubspot.firma.suchen", submissionId, BASIS + "/crm/v3/objects/companies/search", {
    method: "POST",
    headers: kopf(),
    body: JSON.stringify({
      filterGroups: [{ filters: [{ propertyName: "name", operator: "EQ", value: name }] }],
      properties: ["name"],
      limit: 1,
    }),
  });
  if (suche.ok) {
    const treffer = suche.body && suche.body.results && suche.body.results[0];
    if (treffer) return { ok: true, id: treffer.id, neu: false };
  }
  const anlegen = await anfrage("hubspot.firma.anlegen", submissionId, BASIS + "/crm/v3/objects/companies", {
    method: "POST",
    headers: kopf(),
    body: JSON.stringify({ properties: { name } }),
  });
  if (!anlegen.ok) return { ok: false, id: null, neu: false };
  return { ok: true, id: anlegen.body && anlegen.body.id, neu: true };
}

async function assoziieren(kontaktId, firmaId, submissionId) {
  const url =
    BASIS +
    "/crm/v3/objects/contacts/" +
    encodeURIComponent(kontaktId) +
    "/associations/companies/" +
    encodeURIComponent(firmaId) +
    "/contact_to_company";
  const res = await anfrage("hubspot.assoziation", submissionId, url, { method: "PUT", headers: kopf() });
  return { ok: res.ok };
}

/* --------------------------------------------------------------------- Notiz */

/**
 * ⚠️ DIE NACHRICHT WIRD EINE NOTIZ, NICHT EIN TEXTFELD AM KONTAKT. Ein
 * Textfeld überschreibt sich bei der zweiten Anfrage derselben Person; eine
 * Notiz hat einen Zeitstempel und bleibt neben der ersten stehen. Beim
 * Vertrieb ist die Anfragehistorie genau das, was zählt.
 */
async function notizAnlegen(d, kontaktId, submissionId, zeitstempel) {
  const zeilen = [
    "Formularanfrage über die Website",
    "",
    d.message,
    "",
    "— — —",
    "Seite: " + (d.page_url || "unbekannt"),
  ];
  if (d.service) zeilen.splice(4, 0, "Angefragte Leistung: " + d.service);
  if (d.referrer) zeilen.push("Verweisende Seite: " + d.referrer);
  const utm = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
    .filter((k) => d[k])
    .map((k) => k.replace("utm_", "") + "=" + d[k]);
  if (utm.length) zeilen.push("Kampagne: " + utm.join(" · "));
  zeilen.push("Submission-ID: " + submissionId);
  if (d.marketing_opt_in) zeilen.push("Einwilligung für Marketing-Kommunikation: ja");

  // hs_note_body ist HTML. Zeilenumbrüche müssen als <br> kommen, sonst
  // steht die Notiz als ein Block im CRM.
  const html = zeilen
    .map((z) => String(z).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"))
    .join("<br>");

  const res = await anfrage("hubspot.notiz", submissionId, BASIS + "/crm/v3/objects/notes", {
    method: "POST",
    headers: kopf(),
    body: JSON.stringify({
      properties: { hs_note_body: html, hs_timestamp: zeitstempel },
      associations: [
        {
          to: { id: kontaktId },
          // 202 = note_to_contact. Die IDs der Standard-Assoziationstypen
          // sind fest; 202 ist der dokumentierte Wert für Notiz -> Kontakt.
          types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 202 }],
        },
      ],
    }),
  });
  return { ok: res.ok };
}

/* ------------------------------------------------------------------- Ablauf */

/**
 * Der ganze HubSpot-Teil. Wirft nie; gibt zurück, was gelungen ist.
 *
 * ⚠️ TEILERFOLGE SIND ERLAUBT UND GEWOLLT. Scheitert das Unternehmen, ist der
 * Kontakt trotzdem angelegt und die Anfrage nicht verloren. Der Aufrufer
 * bewertet nur `kontaktId` — alles andere ist Zusatznutzen für den Vertrieb.
 */
async function verarbeiten(d, submissionId, zeitstempel) {
  if (!konfiguriert()) {
    log.alarm(submissionId, "hubspot: HUBSPOT_SERVICE_KEY fehlt — uebersprungen");
    return { ok: false, kontaktId: null, schritte: { konfiguration: false } };
  }

  const schritte = {};
  const kontakt = await kontaktUpsert(d, submissionId, zeitstempel);
  schritte.kontakt = kontakt.ok;
  if (!kontakt.ok || !kontakt.id) {
    log.alarm(submissionId, "hubspot: Kontakt konnte nicht gespeichert werden");
    return { ok: false, kontaktId: null, schritte };
  }
  log.info(submissionId, "hubspot: Kontakt " + (kontakt.neu ? "angelegt" : "aktualisiert"));

  if (d.company) {
    const firma = await unternehmenUpsert(d.company, submissionId);
    schritte.firma = firma.ok;
    if (firma.ok && firma.id) {
      const assoz = await assoziieren(kontakt.id, firma.id, submissionId);
      schritte.assoziation = assoz.ok;
    }
  }

  const notiz = await notizAnlegen(d, kontakt.id, submissionId, zeitstempel);
  schritte.notiz = notiz.ok;
  if (!notiz.ok) {
    // Nicht als ALARM: der Kontakt trägt Name, Firma und die UTM-Felder, die
    // Anfrage ist also nicht verloren — nur der Nachrichtentext fehlt im CRM.
    log.warn(submissionId, "hubspot: Notiz nicht angelegt, Nachrichtentext fehlt im CRM");
  }

  return { ok: true, kontaktId: kontakt.id, neu: kontakt.neu, schritte };
}

module.exports = {
  verarbeiten,
  kontaktUpsert,
  unternehmenUpsert,
  assoziieren,
  notizAnlegen,
  kontaktProperties,
  darfAufLeadSetzen,
  konfiguriert,
  LIFECYCLE_REIHENFOLGE,
  BASIS,
};
