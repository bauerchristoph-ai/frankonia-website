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
 * ⚠️ MARKETING-EINWILLIGUNG: NUR MIT HAKEN, und dann richtig.
 * Aktualisiert 26.08.2026 (Kundenentscheidung: "marketingkontakt mit
 * einwilligung von one to one communication in hubspot aktivieren"). Vorher
 * stand hier ausdrücklich "keine Marketing-Einwilligung", weil die
 * Subscription-Type-IDs fehlten.
 * Jetzt passiert bei erteilter Einwilligung ZWEIERLEI:
 *   · `hs_marketable_status` wird gesetzt, damit der Kontakt als
 *     Marketingkontakt zählt;
 *   · die Einwilligung wird über die Communication-Preferences-API für den
 *     Typ "One to One" festgehalten, MIT Rechtsgrundlage und Begründung.
 * Ohne Haken passiert nichts davon — kein Aufruf, kein Feld. Eine
 * Angebotsanfrage ist keine Newsletter-Anmeldung, und die getrennte,
 * nicht vorausgewählte Checkbox im Formular ist genau dafür da.
 * ⚠️ Die Subscription-ID ist portalspezifisch und kommt aus
 * HUBSPOT_SUBSCRIPTION_ID_ONE_TO_ONE. `node scripts/setup-hubspot.mjs` liest
 * die vorhandenen Typen aus und gibt die fertige Zeile aus. Ohne die Variable
 * wird der Schritt übersprungen und protokolliert — nie geraten.
 */

const { anfrage } = require("./http");
const { log } = require("./log");

const BASIS = "https://api.hubapi.com";

/* ==========================================================================
   DIE ZUORDNUNG WEBSITE-FELD -> HUBSPOT-EIGENSCHAFT
   ==========================================================================
   ⚠️⚠️ DAS IST DIE EINZIGE STELLE, AN DER DIESE ZUORDNUNG STEHT. Sie wird von
   zwei Seiten gelesen:
     · von kontaktProperties() unten, beim Schreiben jeder Anfrage;
     · von scripts/setup-hubspot.mjs, das mit --verify jede hier genannte
       Eigenschaft gegen die echte API prüft.
   Damit können Code und CRM nicht auseinanderlaufen, ohne dass ein Lauf des
   Skripts es meldet. Eine von Hand gepflegte zweite Liste wäre genau die
   Stelle, an der es passiert.

   ⚠️ INTERNE NAMEN, NICHT BESCHRIFTUNGEN. HubSpot spricht über den internen
   Namen (`firstname`), nicht über das Label ("Vorname"). Ein Label ist
   übersetzbar und änderbar, der interne Name nicht — wer hier ein Label
   einträgt, bekommt 400 "Property does not exist".

   ⚠️ STANDARD GEGEN EIGEN, und der Unterschied ist der Ausfallmodus:
     STANDARD existiert in jedem Portal. Fehlt eines davon, ist das Portal
       kaputt und nicht diese Datei.
     EIGEN muss von scripts/setup-hubspot.mjs angelegt worden sein. Fehlt eines,
       lehnt HubSpot den GESAMTEN Aufruf mit 400 ab — auch Name und E-Mail.
       Deshalb hat kontaktUpsert() einen zweiten Versuch NUR mit den
       Standardfeldern: ein vergessener Skriptlauf kostet dann die Zusatzfelder,
       aber nicht den Lead.
   ========================================================================== */

// Standardeigenschaften. Website-Feld -> interner HubSpot-Name.
const STANDARD_MAP = {
  first_name: "firstname",
  last_name: "lastname",
  email: "email",
  phone: "phone",
  company: "company",
};

// Eigene Eigenschaften, alle in der Gruppe website_integration.
// Website-Feld -> interner Name. `null` heißt: der Wert kommt nicht aus einem
// Formularfeld, sondern wird serverseitig gesetzt.
const EIGEN_MAP = {
  form_type: "website_form_type",
  service: "website_service",
  page_url: "website_page_url",
  utm_source: "website_utm_source",
  utm_medium: "website_utm_medium",
  utm_campaign: "website_utm_campaign",
  utm_content: "website_utm_content",
  utm_term: "website_utm_term",
};

// Serverseitig gesetzte eigene Eigenschaften, mit ihrem Typ — der Typ steht
// hier, weil setup-hubspot.mjs ihn zum Anlegen und zum Prüfen braucht.
const EIGEN_SERVER = {
  website_submission_id: "string",
  website_last_submission: "datetime",
};

// Standardeigenschaften, die dieser Code nur unter Bedingungen setzt.
const STANDARD_BEDINGT = {
  lifecyclestage:
    "nur wenn HUBSPOT_LIFECYCLE_STAGE gesetzt ist UND der Kontakt neu ist oder in einer früheren Phase steht",
  hs_lead_status: "nur bei neuen Kontakten",
  hs_marketable_status: "nur bei erteilter Marketing-Einwilligung",
};

/** Alle eigenen Eigenschaften mit Typ — für das Setup-Skript. */
function eigeneEigenschaften() {
  const out = {};
  for (const name of Object.values(EIGEN_MAP)) out[name] = "string";
  return { ...out, ...EIGEN_SERVER };
}

/*
 * ⚠️ DIE LIFECYCLE-REIHENFOLGE IST LOAD-BEARING. `lifecyclestage` darf nur
 * gesetzt werden, wenn der Kontakt neu ist oder aktuell in einer FRÜHEREN
 * Phase steht. Einen bestehenden Kunden, der ein zweites Objekt anfragt, auf
 * "Lead" zurückzustufen, wäre eine stille Datenverschlechterung im CRM: er
 * fällt aus Kundenlisten heraus und taucht in Lead-Reports auf. Das merkt
 * niemand am Tag der Anfrage, sondern Wochen später im Reporting.
 *
 * ⚠️⚠️ WELCHE PHASE GESETZT WIRD, IST KONFIGURATION UND KEINE ANNAHME — und
 * das hat der Live-Test am 26.08.2026 erzwungen. Vorher stand hier fest "lead".
 * In HubSpot ist das der interne Name; das LABEL dahinter kann pro Portal frei
 * umbenannt sein, und in diesem Portal ist es genau so:
 *     subscriber  -> "Kontakt"
 *     4000505062  -> "Kaltakquise"
 *     lead        -> "Termin vereinbart"      <-- das schrieb der Code
 *     customer    -> "Kunde"
 * Ein Formulareingang wäre damit als "Termin vereinbart" im CRM gelandet, also
 * mehrere Stufen zu weit. Das fällt nicht am Tag der Anfrage auf, sondern im
 * Reporting — dieselbe Klasse von stiller Datenverschlechterung, gegen die der
 * Absatz darüber schützt, nur aus der anderen Richtung.
 *
 * Deshalb: HUBSPOT_LIFECYCLE_STAGE. **Ist die Variable nicht gesetzt, wird die
 * Phase überhaupt nicht geschrieben** und HubSpot nimmt seine eigene
 * Voreinstellung. Das ist der einzige Wert, der in keinem Portal falsch sein
 * kann. Welche Stufe fachlich richtig ist, weiß nur der Kunde — die Auswahl
 * seines Portals gibt "node scripts/setup-hubspot.mjs --verify" aus.
 */
/* ⚠️⚠️ DAS IST DIE REIHENFOLGE DIESES PORTALS, NICHT HUBSPOTS STANDARD — und
   das ist notwendig, nicht bequem. Vorher stand hier die Standardliste
   (subscriber, lead, marketingqualifiedlead, …). Dieses Portal hat aber EIGENE
   Phasen mit numerischen IDs, und für eine numerische ID findet eine
   Standardliste keinen Platz — die Reihenfolge war damit unbestimmbar und die
   Phase wurde nur bei NEUEN Kontakten gesetzt. Bei 2.767 Kontakten in
   "Kaltakquise" hätte das bedeutet: die meisten Anfragen wären gar nicht
   umsortiert worden, obwohl genau das der Zweck ist.

   Reihenfolge und interne Namen sind am 26.08.2026 aus dem Portal gelesen
   (crm/v3/properties/contacts/lifecyclestage), nicht geraten. Die Labels
   stehen daneben, weil ein interner Name allein nichts sagt:

   ⚠️ WIRD IM PORTAL UMSORTIERT ODER EINE PHASE ERGÄNZT, IST DIESE LISTE VERALTET.
   "node scripts/setup-hubspot.mjs --verify" vergleicht sie mit dem Portal und
   meldet die Abweichung. */
const LIFECYCLE_REIHENFOLGE = [
  "subscriber", //   Kontakt
  "4000505062", //   Kaltakquise
  "5520647375", //   Ansprechpartner / Entscheider herausgefunden
  "lead", //         Termin vereinbart
  "5522034896", //   Angebot erstellt   <-- Ziel der Website-Anfragen
  "customer", //     Kunde
  "evangelist", //   Fürsprecher
  "4003004610", //   Upsell
  "other", //        Sonstiges
  "5574730996", //   Kein Interesse
];

/* ⚠️ ZWEI FÄLLE BLEIBEN BEWUSST UNBERÜHRT, weil sie eine menschliche
   Einschätzung sind und keine Stufe im Trichter: "Sonstiges" und "Kein
   Interesse" stehen in dieser Liste HINTER dem Ziel, also wird ein so
   eingeordneter Kontakt bei einer neuen Anfrage NICHT verschoben. Das ist die
   sichere Seite — wer jemanden als "Kein Interesse" markiert hat, soll das
   nicht durch ein Formular überschrieben bekommen. Soll eine neue Anfrage
   solche Kontakte reaktivieren, müssen die beiden Einträge vor das Ziel
   wandern; das ist dann eine Entscheidung über den Vertriebsprozess, nicht
   über Code. */

/** Die konfigurierte Zielphase, oder null wenn keine gesetzt ist. */
function zielphase() {
  const v = process.env.HUBSPOT_LIFECYCLE_STAGE;
  return v && String(v).trim() ? String(v).trim() : null;
}

/**
 * Darf die Zielphase gesetzt werden?
 * ⚠️ Bei einer PORTALEIGENEN Zielphase (numerische ID) lässt sich keine
 * Reihenfolge bestimmen — die Liste unten kennt nur HubSpots Standardnamen.
 * Dann wird nur bei NEUEN Kontakten gesetzt. Das ist die sichere Seite: ein
 * bestehender Kontakt behält seine Phase, statt vielleicht zurückgestuft zu
 * werden.
 */
function darfPhaseSetzen(aktuell, ziel) {
  if (!ziel) return false;
  if (!aktuell) return true;
  const i = LIFECYCLE_REIHENFOLGE.indexOf(String(aktuell).toLowerCase());
  const z = LIFECYCLE_REIHENFOLGE.indexOf(String(ziel).toLowerCase());
  // Unbekannte Phase auf einer der beiden Seiten: nicht anfassen.
  if (i < 0 || z < 0) return false;
  return i < z;
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
 * Baut die Eigenschaften für den Kontakt — getrennt nach Standard und Eigen,
 * damit kontaktUpsert() im Fehlerfall die Eigenen weglassen kann.
 * Gibt { standard, eigen } zurück.
 */
function kontaktProperties(d, submissionId, zeitstempel, vorhanden) {
  const standard = {};
  for (const [feld, name] of Object.entries(STANDARD_MAP)) {
    if (d[feld]) standard[name] = d[feld];
  }

  // ⚠️ Nur bei neuen Kontakten oder aus einer FRÜHEREN Phase heraus — siehe
  // LIFECYCLE_REIHENFOLGE oben.
  const aktuell = vorhanden && vorhanden.properties && vorhanden.properties.lifecyclestage;
  const ziel = zielphase();
  if (ziel && (!vorhanden || darfPhaseSetzen(aktuell, ziel))) standard.lifecyclestage = ziel;
  // Nur bei neuen Kontakten: ein Kontakt, den der Vertrieb schon auf "In
  // Bearbeitung" gesetzt hat, darf nicht auf "Neu" zurückfallen.
  if (!vorhanden) standard.hs_lead_status = "NEW";

  // ⚠️ MARKETINGKONTAKT NUR MIT EINWILLIGUNG (Kundenentscheidung 26.08.2026:
  // "marketingkontakt mit einwilligung von one to one communication").
  // `hs_marketable_status` gibt es nur in Portalen mit aktivierter
  // Marketing-Contacts-Funktion; ist sie aus, lehnt HubSpot die Eigenschaft ab.
  // Sie steht deshalb bei den STANDARD-Feldern, aber der Ausfall ist über den
  // zweiten Versuch in kontaktUpsert() abgesichert — und die eigentliche
  // Einwilligung wird ohnehin über die Communication-Preferences-API
  // festgehalten (marketingEinwilligung() weiter unten), die der belastbare
  // Nachweis ist.
  if (d.marketing_opt_in) standard.hs_marketable_status = "true";

  const eigen = {
    website_submission_id: submissionId,
    // ⚠️ HubSpot nimmt bei einem datetime-Feld Millisekunden seit Epoch ODER
    // einen ISO-8601-Zeitstempel. ISO ist lesbar und wird akzeptiert.
    website_last_submission: zeitstempel,
  };
  for (const [feld, name] of Object.entries(EIGEN_MAP)) {
    if (d[feld]) eigen[name] = d[feld];
  }
  // page_url ist Pflicht in der Validierung, wird hier aber leer zugelassen:
  // eine fehlende Herkunft darf keinen Schreibvorgang verhindern.
  if (!eigen.website_page_url) eigen.website_page_url = d.page_url || "";

  return { standard, eigen };
}

function schreiben(name, submissionId, vorhanden, properties) {
  return vorhanden
    ? anfrage(name, submissionId, BASIS + "/crm/v3/objects/contacts/" + vorhanden.id, {
        method: "PATCH",
        headers: kopf(),
        body: JSON.stringify({ properties }),
      })
    : anfrage(name, submissionId, BASIS + "/crm/v3/objects/contacts", {
        method: "POST",
        headers: kopf(),
        body: JSON.stringify({ properties }),
      });
}

/**
 * ⚠️⚠️ ZWEI VERSUCHE, UND DER ZWEITE IST DER WICHTIGE. HubSpot lehnt einen
 * Aufruf KOMPLETT mit 400 ab, wenn darin EINE unbekannte Eigenschaft steht —
 * auch Name, E-Mail und Telefon gehen dann nicht durch. Zwei reale Fälle
 * führen dazu:
 *   · scripts/setup-hubspot.mjs wurde nie ausgeführt, also fehlen die zehn
 *     eigenen Felder;
 *   · `hs_marketable_status` existiert nicht, weil im Portal keine
 *     Marketing-Contacts-Funktion aktiv ist.
 * Ohne den zweiten Versuch würde eine vergessene Einrichtung JEDEN Lead
 * kosten, und zwar still — die interne Mail käme mit "HubSpot: NICHT
 * gespeichert", und niemand würde den Zusammenhang zur Feldliste sehen.
 * Mit ihm kostet sie die Zusatzfelder. Das Log sagt beim zweiten Versuch
 * ausdrücklich, was zu tun ist.
 */
async function kontaktUpsert(d, submissionId, zeitstempel) {
  const gefunden = await kontaktSuchen(d.email, submissionId);
  const vorhanden = gefunden.kontakt;
  const { standard, eigen } = kontaktProperties(d, submissionId, zeitstempel, vorhanden);

  const name = vorhanden ? "hubspot.kontakt.aktualisieren" : "hubspot.kontakt.anlegen";
  let res = await schreiben(name, submissionId, vorhanden, { ...standard, ...eigen });

  if (!res.ok && res.status === 400) {
    log.alarm(
      submissionId,
      "hubspot: 400 beim Schreiben — vermutlich fehlt eine Eigenschaft. " +
        "Zweiter Versuch nur mit Standardfeldern. Pruefen mit: " +
        "node scripts/setup-hubspot.mjs --verify"
    );
    res = await schreiben(name + ".nurStandard", submissionId, vorhanden, standard);
    if (res.ok) {
      log.alarm(
        submissionId,
        "hubspot: Kontakt OHNE die eigenen Felder gespeichert (Leistung, Seite, UTM, Submission-ID fehlen im CRM)"
      );
    }
  }

  if (!res.ok) return { ok: false, id: vorhanden ? vorhanden.id : null, neu: !vorhanden };
  return { ok: true, id: (res.body && res.body.id) || (vorhanden && vorhanden.id), neu: !vorhanden };
}

/* --------------------------------------------- Marketing-Einwilligung */

/**
 * Hält die Einwilligung für einen Subscription Type fest.
 * Kundenentscheidung 26.08.2026: "One to One Communication".
 *
 * ⚠️ WARUM ÜBER DIESE API UND NICHT ÜBER EIN FELD: die
 * Communication-Preferences-API ist der Ort, an dem HubSpot eine Einwilligung
 * MIT Rechtsgrundlage und Begründung speichert. Ein selbst gesetztes Häkchen in
 * einem eigenen Feld wäre eine Notiz, kein Nachweis — und im Streitfall ist
 * genau der Nachweis das, was zählt.
 *
 * ⚠️ DIE SUBSCRIPTION-ID IST PORTALSPEZIFISCH und kann hier nicht fest stehen.
 * Sie kommt aus HUBSPOT_SUBSCRIPTION_ID_ONE_TO_ONE;
 * `node scripts/setup-hubspot.mjs` liest die vorhandenen Typen aus und gibt die
 * fertige Zeile für .env.local aus. Fehlt die Variable, wird der Schritt
 * ÜBERSPRUNGEN und protokolliert — nicht geraten. Eine falsche ID würde die
 * Einwilligung dem falschen Kanal zuschreiben, und das ist schlimmer als keine.
 *
 * ⚠️ NUR BEI ERTEILTER EINWILLIGUNG. Ohne Haken wird hier NICHTS aufgerufen:
 * ein "subscribe" ohne Einwilligung wäre genau der Fehler, den die getrennte
 * Checkbox im Formular verhindern soll.
 */
/* ⚠️⚠️ ZWEI SUBSCRIPTION-TYPEN, NICHT EINER, und das ist eine Entscheidung des
   Kunden vom 26.08.2026 („einfach beides setzen"). Der Hintergrund gehört
   dazu, weil er erklärt, warum überhaupt zwei in Frage kommen:
     · ONE TO ONE ist im Portal als Typ **Sales** angelegt — 1:1-Mails. Eine
       Angebotsanfrage IST 1:1-Kommunikation, deshalb hat der Kunde diesen Typ
       zuerst genannt.
     · MARKETING INFORMATION ist Typ **Marketing** — Kampagnen. Und das ist,
       was der Haken im Formular wörtlich verspricht („Informationen zu
       Sicherheitsthemen und Leistungen"). Für einen Newsletter wäre One to
       One die falsche Grundlage.
   Beide zu setzen deckt beide Fälle ab; die Einwilligung stammt aus derselben,
   nicht vorausgewählten Checkbox, und die Begründung nennt sie.

   ⚠️ GESETZT WIRD NUR MIT HAKEN — auch One to One. Eine denkbare Variante wäre,
   One to One bei JEDER Anfrage zu setzen (mit legalBasis
   PERFORMANCE_OF_CONTRACT statt Einwilligung), weil eine Angebotsanfrage die
   1:1-Antwort ohnehin rechtfertigt. Das ist NICHT eingebaut: es wäre ein
   Eintrag über jemanden, der nichts angekreuzt hat, und der Kunde hat
   ausdrücklich die einfache Variante gewählt. Wer es später will, ändert die
   Abbruchbedingung unten und die legalBasis für diesen einen Typ.

   ⚠️ Fehlt eine der beiden Variablen, wird die andere trotzdem gesetzt und die
   fehlende protokolliert. Es wird nie eine ID geraten. */
const SUBSCRIPTION_VARIABLEN = [
  ["HUBSPOT_SUBSCRIPTION_ID_ONE_TO_ONE", "One to One"],
  ["HUBSPOT_SUBSCRIPTION_ID_MARKETING", "Marketing Information"],
];

async function marketingEinwilligung(d, submissionId) {
  if (!d.marketing_opt_in) return { ok: true, uebersprungen: "keine Einwilligung" };

  const ziele = [];
  for (const [variable, bezeichnung] of SUBSCRIPTION_VARIABLEN) {
    const id = process.env[variable];
    if (id && String(id).trim()) ziele.push({ id: String(id).trim(), bezeichnung });
    else
      log.warn(
        submissionId,
        "hubspot: " + variable + " fehlt — Einwilligung fuer \"" + bezeichnung +
          "\" NICHT vermerkt. IDs auslesen mit: node scripts/setup-hubspot.mjs --verify"
      );
  }
  if (!ziele.length) return { ok: false, uebersprungen: "keine ID konfiguriert" };

  // ⚠️ Nacheinander, nicht parallel: HubSpot antwortet auf denselben Kontakt
  // mit zwei gleichzeitigen Änderungen an den Kommunikationseinstellungen
  // gelegentlich mit einem Konflikt. Zwei Aufrufe sind billig.
  const ergebnisse = [];
  for (const ziel of ziele) {
    ergebnisse.push(await einwilligungSetzen(d, submissionId, ziel));
  }
  return { ok: ergebnisse.every((r) => r.ok), typen: ergebnisse };
}

async function einwilligungSetzen(d, submissionId, ziel) {
  const res = await anfrage("hubspot.einwilligung", submissionId, BASIS + "/communication-preferences/v3/subscribe", {
    method: "POST",
    headers: kopf(),
    body: JSON.stringify({
      emailAddress: d.email,
      subscriptionId: ziel.id,
      // CONSENT_WITH_NOTICE: der Betroffene hat aktiv zugestimmt und wurde
      // dabei über den Zweck informiert — das trifft auf eine eigene,
      // unmarkierte Checkbox mit erklärendem Text und Link auf die
      // Datenschutzerklärung zu.
      legalBasis: "CONSENT_WITH_NOTICE",
      legalBasisExplanation:
        "Einwilligung über das Anfrageformular auf frankonia-sicherheit.de, " +
        "separate Checkbox, nicht vorausgewählt (" + ziel.bezeichnung + "). " +
        "Submission-ID: " + submissionId,
    }),
  });
  if (res.ok) return { ok: true, bezeichnung: ziel.bezeichnung };

  /* ⚠️⚠️ "ALREADY SUBSCRIBED" IST KEIN FEHLER, und das hat der Live-Test am
     26.08.2026 gezeigt: HubSpot antwortet mit **400**, wenn der Kontakt bei
     diesem Typ schon eingetragen ist. Der gewünschte Zustand ist damit aber
     erreicht. Als Fehler behandelt hieße das: jeder wiederkehrende
     Interessent, der den Haken setzt, erzeugt eine Warnung — und im Log sähe
     es aus, als wäre die Einwilligung nicht vermerkt, obwohl sie es ist.

     ⚠️ Die englische Meldung ist nur der ANLASS, nicht der Beweis. Ein Text
     eines Fremdanbieters kann sich ändern, deshalb wird danach der
     Status-Endpoint gefragt: nur wenn der SUBSCRIBED bestätigt, gilt es als
     Erfolg. Passt die Meldung nicht mehr, bleibt es bei der Warnung — der
     Fehlerfall ist also die alte, sichere Seite.

     ⚠️ NICHT eingebaut: eine bestehende Rechtsgrundlage überschreiben. Beim
     Test stand dort LEGITIMATE_INTEREST_PQL ("Vertriebsinteresse") aus einem
     früheren Prozess des Kunden. Eine frische Einwilligung wäre die stärkere
     Grundlage, aber der subscribe-Endpoint kann sie bei einem bereits
     eingetragenen Kontakt nicht ändern, und einen fremden Eintrag über die
     v4-API stillschweigend zu überschreiben ist keine Entscheidung, die hier
     nebenbei getroffen wird. Im Bericht vermerkt. */
  const meldung = String((res.body && res.body.message) || "");
  if (res.status === 400 && /already subscribed/i.test(meldung)) {
    if (await schonEingetragen(d.email, ziel.id, submissionId)) {
      log.info(
        submissionId,
        'hubspot: Einwilligung fuer "' + ziel.bezeichnung + '" war bereits eingetragen'
      );
      return { ok: true, bezeichnung: ziel.bezeichnung, bereits: true };
    }
  }
  log.warn(submissionId, "hubspot: Einwilligung fuer \"" + ziel.bezeichnung + "\" nicht gespeichert");
  return { ok: false, bezeichnung: ziel.bezeichnung };
}

/**
 * Fragt den Status-Endpoint, ob dieser Kontakt bei diesem Typ eingetragen ist.
 * ⚠️ Die E-Mail steht in der URL. api/_lib/http.js protokolliert URLs nicht,
 * nur den Schrittnamen und den Status — sonst stünde hier eine Adresse im Log.
 */
async function schonEingetragen(email, id, submissionId) {
  const res = await anfrage(
    "hubspot.einwilligung.status",
    submissionId,
    BASIS + "/communication-preferences/v3/status/email/" + encodeURIComponent(email),
    { headers: kopf() }
  );
  if (!res.ok) return false;
  const liste = (res.body && res.body.subscriptionStatuses) || [];
  return liste.some((e) => String(e.id) === String(id) && e.status === "SUBSCRIBED");
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

  // Einwilligung VOR der Notiz, weil sie die rechtlich relevante Aussage ist
  // und die Notiz nur Komfort für den Vertrieb.
  const einwilligung = await marketingEinwilligung(d, submissionId);
  schritte.einwilligung = d.marketing_opt_in ? einwilligung.ok : "nicht erteilt";

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
  marketingEinwilligung,
  eigeneEigenschaften,
  STANDARD_MAP,
  EIGEN_MAP,
  EIGEN_SERVER,
  STANDARD_BEDINGT,
  kontaktUpsert,
  unternehmenUpsert,
  assoziieren,
  notizAnlegen,
  kontaktProperties,
  konfiguriert,
  LIFECYCLE_REIHENFOLGE,
  darfPhaseSetzen,
  zielphase,
  BASIS,
};
