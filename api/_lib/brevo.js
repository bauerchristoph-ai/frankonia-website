/*
 * ⚠️ SEIT 27.08.2026 trägt die Bestätigungsmail ein BCC an HubSpot, damit sie in
 * der Aktivitätenliste des Kontakts auftaucht. Details bei bccAdresse().
 *
 * Brevo: Kontakt, Bestätigungsmail, Event, interne Benachrichtigung.
 * 2026-08-26.
 *
 * ⚠️⚠️ DIE ATTRIBUTNAMEN SIND DEUTSCH, UND DAS IST DIE FALLE DIESER DATEI.
 * Der Brevo-Account ist deutschsprachig: Vor- und Nachname heißen VORNAME und
 * NACHNAME, nicht FIRSTNAME / LASTNAME. Wer die englischen Namen benutzt, legt
 * keine Fehlermeldung, sondern DUBLETTEN an — Brevo akzeptiert unbekannte
 * Attribute nicht, aber der Kontakt wird trotzdem geschrieben, nur ohne Namen.
 * Ebenso: die Marketing-Einwilligung heißt OPT_IN und existiert bereits;
 * MARKETING_OPT_IN wäre ein zweites Feld für dieselbe Aussage.
 *
 * ⚠️ ZWEI ARTEN VON MAIL, UND SIE HABEN VERSCHIEDENE VORAUSSETZUNGEN:
 *   TRANSAKTIONAL — die Eingangsbestätigung an den Absender und die interne
 *     Meldung. Beide über /smtp/email. Sie brauchen KEINE Einwilligung: sie
 *     sind die Antwort auf eine Handlung des Empfängers.
 *   MARKETING — setzt den Haken voraus. In Brevo trägt die LISTE die
 *     Einwilligung: wer in keiner Liste ist, bekommt keine Kampagne. Deshalb
 *     wird bei erteiltem Haken BREVO_MARKETING_LIST_ID gesetzt, und nur dann.
 *
 * ⚠️ DIE BESTÄTIGUNGSMAIL GEHT DIREKT ÜBER DEN TRANSAKTIONS-ENDPOINT, nicht
 * über eine Brevo-Automation. Sie ist geschäftskritisch: über
 * /v3/smtp/email steht in der Antwort, ob sie angenommen wurde, und das
 * funktioniert unabhängig vom Tarif. Eine Automation kann still ausfallen —
 * und "still" ist bei einer Eingangsbestätigung der schlechteste Fehler.
 * Das Event unten ist die Grundlage für spätere Nurture-Strecken und hängt
 * ausdrücklich NICHT an der Bestätigungsmail.
 */

const { anfrage } = require("./http");
const { log } = require("./log");

const BASIS = "https://api.brevo.com/v3";

function kopf() {
  return {
    "api-key": process.env.BREVO_API_KEY,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

function konfiguriert() {
  return Boolean(process.env.BREVO_API_KEY);
}

function absender() {
  return {
    email: process.env.BREVO_SENDER_EMAIL || "",
    name: process.env.BREVO_SENDER_NAME || "FRANKONIA Sicherheitsdienst",
  };
}

/* ------------------------------------------------------------------ Kontakt */

/**
 * Die Zuordnung Website-Feld -> Brevo-Attribut. Als Tabelle, damit sie
 * überprüfbar bleibt und nicht in einer Objektliteral-Wand verschwindet.
 * ⚠️ Nur diese Attribute existieren im Account. Keine weiteren anlegen —
 * fehlt eines, ist das eine Rückfrage, keine Erweiterung.
 */
function kontaktAttribute(d, submissionId, hubspotId, zeitstempel) {
  const a = {
    VORNAME: d.first_name,
    NACHNAME: d.last_name,
    SOURCE: "Website",
    FORM_TYPE: d.form_type,
    // Brevo erwartet bei einem Datumsattribut YYYY-MM-DD.
    LAST_FORM_SUBMISSION: zeitstempel.slice(0, 10),
    SUBMISSION_ID: submissionId,
    // ⚠️ Ohne Haken FALSE, nicht "nicht gesetzt". Ein fehlendes Attribut
    // liest sich später als "unbekannt", und "unbekannt" wird irgendwann als
    // "wahrscheinlich ja" behandelt. Eine ausdrückliche Null ist die
    // belastbare Aussage.
    OPT_IN: Boolean(d.marketing_opt_in),
  };
  if (d.phone) a.PHONE = d.phone;
  if (d.company) a.COMPANY = d.company;
  if (d.service) a.SERVICE = d.service;
  if (hubspotId) a.HUBSPOT_CONTACT_ID = String(hubspotId);
  return a;
}

async function kontaktUpsert(d, submissionId, hubspotId, zeitstempel) {
  const nutzlast = {
    email: d.email,
    attributes: kontaktAttribute(d, submissionId, hubspotId, zeitstempel),
    updateEnabled: true,
  };

  /* ⚠️⚠️ LISTEN-ZUORDNUNG NUR MIT HAKEN, und das ist eine Änderung vom
     26.08.2026 (Kundenentscheidung: "brevo transaction mails hinterlegen sowie
     grundlegende marketing mails"). Vorher stand hier ausdrücklich "KEINE
     Listen-Zuordnung", weil eine Angebotsanfrage keine Newsletter-Anmeldung
     ist. Das gilt weiter — für den Fall OHNE Haken.

     Der Unterschied zwischen den beiden Wegen ist wichtig und nicht kosmetisch:
       · TRANSAKTIONSMAIL (Eingangsbestätigung, interne Meldung) geht über
         /smtp/email und braucht KEINE Einwilligung — sie ist die Antwort auf
         eine Handlung des Empfängers.
       · MARKETINGMAIL setzt die Einwilligung voraus, und die trägt in Brevo die
         Liste: wer in keiner Liste ist, kann keine Kampagne bekommen.

     ⚠️ OHNE BREVO_MARKETING_LIST_ID wird NICHT geraten. Der Kontakt wird dann
     mit OPT_IN=true angelegt, aber ohne Liste, und das Log sagt es. Eine
     falsche Listen-ID würde jemanden in einen fremden Verteiler legen — das
     ist schlimmer als eine fehlende Zuordnung, die man nachholen kann.
     "node scripts/setup-brevo.mjs" gibt die vorhandenen Listen mit ihren IDs
     aus. */
  if (d.marketing_opt_in) {
    const listId = Number(process.env.BREVO_MARKETING_LIST_ID);
    if (Number.isFinite(listId) && listId > 0) {
      nutzlast.listIds = [listId];
    } else {
      log.warn(
        submissionId,
        "brevo: BREVO_MARKETING_LIST_ID fehlt — Einwilligung ist vermerkt (OPT_IN), " +
          "aber der Kontakt ist in KEINER Marketingliste. IDs auslesen mit: " +
          "node scripts/setup-brevo.mjs"
      );
    }
  }

  const res = await anfrage("brevo.kontakt", submissionId, BASIS + "/contacts", {
    method: "POST",
    headers: kopf(),
    body: JSON.stringify(nutzlast),
  });
  // 201 (neu) und 204 (aktualisiert) sind beides Erfolg.
  return { ok: res.ok, status: res.status };
}

/* ------------------------------------- BCC-Protokollierung in HubSpot */

/**
 * Die BCC-Adresse, mit der HubSpot eine Mail in die Aktivitätenliste des
 * Kontakts schreibt — oder null, wenn keine konfiguriert ist.
 *
 * ⚠️ WARUM ÜBERHAUPT: die Bestätigungsmail geht über Brevo, und HubSpot weiß
 * davon nichts. In der Aktivitätenliste stand deshalb nur die Notiz („Anfrage
 * eingegangen"), nicht die Mail, die der Interessent tatsächlich bekommen hat.
 * Kundenwunsch 27.08.2026: „das wäre schon irgendwo cool, wenn diese
 * Bestätigungsmail auch protokolliert wird".
 *
 * ⚠️ WARUM BCC UND NICHT DIE HUBSPOT-API: der Weg über die Engagements-API
 * würde einen NACHBAU der Mail protokollieren, nicht die Mail. Brevo rendert
 * das Template auf seiner Seite; um denselben Text zu erzeugen, müsste dieser
 * Code das Template holen und die Platzhalter selbst ersetzen — zwei Renderer
 * für einen Text, die auseinanderlaufen, sobald jemand das Template ändert.
 * Über BCC landet die ECHTE Mail in der Aktivitätenliste, mit dem Layout, das
 * der Empfänger gesehen hat. Und es ist eine Zeile statt eines Moduls.
 *
 * ⚠️ WARUM NICHT ABLEITBAR: die Adresse ist portalspezifisch (etwas wie
 * „…@bcc.hubspot.com") und steht in den HubSpot-Einstellungen. Sie wird hier
 * NICHT geraten — dieselbe Regel wie bei den Subscription-IDs. Ohne die
 * Variable wird der Schritt übersprungen und protokolliert.
 */
function bccAdresse(submissionId) {
  const rohwert = process.env.HUBSPOT_BCC_ADDRESS;
  const wert = rohwert ? String(rohwert).trim() : "";
  if (!wert) return null;
  /* Absichtlich nur eine Plausibilitätsprüfung und keine Adress-Grammatik: die
     Alternative wäre, eine gültige Adresse wegen einer strengen Regex zu
     verwerfen. Was hier auffallen MUSS, ist ein Konfigurationsfehler wie eine
     hineinkopierte URL oder ein leerer Platzhalter. */
  if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(wert)) {
    log.warn(submissionId, "brevo: HUBSPOT_BCC_ADDRESS sieht nicht wie eine Adresse aus — kein BCC gesetzt");
    return null;
  }
  return wert;
}

/* --------------------------------------------------- Bestätigung an den Kunden */

async function bestaetigungsmail(d, submissionId) {
  const templateId = Number(process.env.BREVO_CONFIRMATION_TEMPLATE_ID);
  if (!Number.isFinite(templateId) || templateId <= 0) {
    log.alarm(submissionId, "brevo: BREVO_CONFIRMATION_TEMPLATE_ID fehlt oder ist keine Zahl");
    return { ok: false };
  }
  /* ⚠️ NUR AUF DIESER MAIL, NICHT AUF DER INTERNEN BENACHRICHTIGUNG — und das
     ist der Grund, warum das BCC hier steht und nicht in kopf() oder in einer
     gemeinsamen Hilfsfunktion: **HubSpot protokolliert eine per BCC erhaltene
     Mail beim EMPFÄNGER.** Die interne Meldung geht an FRANKONIA selbst, sie
     würde also an einem Kontakt „info@frankonia-sicherheit.de" hängen — oder
     einen anlegen. Das wäre Rauschen im CRM und keine Korrespondenz mit dem
     Interessenten.
     ⚠️ Zweiter Grund, dieselbe Stelle: bei jeder Anfrage würde die interne
     Meldung zusätzlich als E-Mail-Aktivität auftauchen, und die Liste des
     Kontakts hätte pro Anfrage zwei Einträge, von denen einer den Kunden nie
     erreicht hat. */
  const bcc = bccAdresse(submissionId);
  if (!bcc) log.info(submissionId, "brevo: HUBSPOT_BCC_ADDRESS nicht gesetzt — Mail wird in HubSpot nicht protokolliert");

  const res = await anfrage("brevo.bestaetigung", submissionId, BASIS + "/smtp/email", {
    method: "POST",
    headers: kopf(),
    body: JSON.stringify({
      templateId,
      to: [{ email: d.email, name: (d.first_name + " " + d.last_name).trim() }],
      /* Nur setzen, wenn es eine Adresse gibt: ein leeres bcc-Feld lehnt Brevo
         mit 400 ab, und das würde die Bestätigungsmail kosten. */
      ...(bcc ? { bcc: [{ email: bcc }] } : {}),
      // Das Template nutzt {{ params.VORNAME }} und blendet die Zeile zur
      // Leistung nur ein, wenn SERVICE gefüllt ist. Deshalb wird SERVICE
      // immer mitgegeben — als leerer String, wenn nichts angefragt wurde,
      // sonst wäre die Bedingung im Template nicht auswertbar.
      params: {
        VORNAME: d.first_name,
        NACHNAME: d.last_name,
        COMPANY: d.company || "",
        SERVICE: d.service || "",
        SUBMISSION_ID: submissionId,
      },
    }),
  });
  if (!res.ok) log.alarm(submissionId, "brevo: Bestaetigungsmail NICHT angenommen");
  return { ok: res.ok, messageId: res.body && res.body.messageId };
}

/* --------------------------------------------------------------------- Event */

async function event(d, submissionId) {
  const res = await anfrage("brevo.event", submissionId, BASIS + "/events", {
    method: "POST",
    headers: kopf(),
    body: JSON.stringify({
      event_name: "website_form_submitted",
      identifiers: { email_id: d.email },
      contact_properties: {
        FORM_TYPE: d.form_type,
        SERVICE: d.service || "",
        SOURCE: "Website",
      },
      event_properties: {
        submission_id: submissionId,
        form_type: d.form_type,
        service: d.service || "",
        page_url: d.page_url || "",
        utm_source: d.utm_source || "",
        utm_medium: d.utm_medium || "",
        utm_campaign: d.utm_campaign || "",
      },
    }),
  });
  return { ok: res.ok };
}

/* ---------------------------------------------- Interne Benachrichtigung */

/**
 * ⚠️ DIESER SCHRITT ENTSCHEIDET ÜBER ERFOLG ODER FEHLER DER GANZEN ANFRAGE.
 * Der Besucher bekommt eine Erfolgsmeldung, sobald MINDESTENS diese
 * Benachrichtigung ODER der HubSpot-Kontakt durch ist. Deshalb steht hier
 * kein Template, sondern reiner Text: ein Template kann im Brevo-Konto
 * gelöscht oder deaktiviert werden, ohne dass es hier auffällt, und dann
 * wäre der letzte Rettungsweg genau der, der ausfällt.
 *
 * ⚠️ HIER STEHEN PERSONENBEZOGENE DATEN IM KLARTEXT, und das ist richtig: die
 * Mail geht an FRANKONIA und ist der Zweck der Verarbeitung. Was NICHT
 * passiert, ist dasselbe im Serverlog — dafür sorgt api/_lib/log.js.
 */
async function interneBenachrichtigung(d, submissionId, hubspotId, hubspotOk) {
  const an = process.env.INTERNAL_NOTIFICATION_EMAIL;
  if (!an) {
    log.alarm(submissionId, "brevo: INTERNAL_NOTIFICATION_EMAIL fehlt — keine interne Meldung moeglich");
    return { ok: false };
  }

  const zeilen = [
    "Neue Anfrage über die Website",
    "",
    "Name:        " + d.first_name + " " + d.last_name,
    "Unternehmen: " + (d.company || "—"),
    "E-Mail:      " + d.email,
    "Telefon:     " + (d.phone || "—"),
    "Leistung:    " + (d.service || "—"),
    "",
    "Nachricht:",
    d.message,
    "",
    "— — —",
    "Seite:          " + (d.page_url || "—"),
    "Verweis:        " + (d.referrer || "—"),
    "Kampagne:       " +
      (["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
        .filter((k) => d[k])
        .map((k) => k.replace("utm_", "") + "=" + d[k])
        .join(" · ") || "—"),
    "Marketing:      " + (d.marketing_opt_in ? "Einwilligung erteilt" : "keine Einwilligung"),
    "Submission-ID:  " + submissionId,
    "HubSpot:        " + (hubspotOk && hubspotId ? "Kontakt " + hubspotId : "NICHT gespeichert — bitte manuell anlegen"),
  ];

  const res = await anfrage("brevo.intern", submissionId, BASIS + "/smtp/email", {
    method: "POST",
    headers: kopf(),
    body: JSON.stringify({
      sender: absender(),
      to: [{ email: an }],
      // ⚠️ Antwortadresse ist der Interessent: so führt "Antworten" im
      // Postfach direkt zu ihm und nicht zurück an das eigene Konto.
      replyTo: { email: d.email, name: (d.first_name + " " + d.last_name).trim() },
      subject:
        "Website-Anfrage: " +
        (d.company || d.first_name + " " + d.last_name) +
        (d.service ? " — " + d.service : ""),
      textContent: zeilen.join("\n"),
    }),
  });
  if (!res.ok) log.alarm(submissionId, "brevo: interne Benachrichtigung NICHT angenommen");
  return { ok: res.ok };
}

/* ------------------------------------------------------------------- Ablauf */

/**
 * Der ganze Brevo-Teil. Wirft nie.
 * Die vier Schritte laufen NACHEINANDER und unabhängig: fällt die
 * Bestätigungsmail aus, wird das Event trotzdem gesendet und die interne
 * Benachrichtigung trotzdem verschickt.
 */
async function verarbeiten(d, submissionId, hubspotId, hubspotOk, zeitstempel) {
  if (!konfiguriert()) {
    log.alarm(submissionId, "brevo: BREVO_API_KEY fehlt — uebersprungen, auch die interne Meldung");
    return { ok: false, intern: false, schritte: { konfiguration: false } };
  }
  const schritte = {};
  schritte.kontakt = (await kontaktUpsert(d, submissionId, hubspotId, zeitstempel)).ok;
  schritte.bestaetigung = (await bestaetigungsmail(d, submissionId)).ok;
  schritte.event = (await event(d, submissionId)).ok;
  const intern = await interneBenachrichtigung(d, submissionId, hubspotId, hubspotOk);
  schritte.intern = intern.ok;
  return { ok: schritte.kontakt || schritte.bestaetigung || intern.ok, intern: intern.ok, schritte };
}

module.exports = {
  bccAdresse,
  verarbeiten,
  kontaktUpsert,
  kontaktAttribute,
  bestaetigungsmail,
  event,
  interneBenachrichtigung,
  konfiguriert,
  BASIS,
};
