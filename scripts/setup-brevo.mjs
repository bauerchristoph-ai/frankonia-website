/*
 * Brevo prüfen: Attribute, Listen, Absender und die Transaktionsvorlage.
 * 2026-08-26.
 *
 *     BREVO_API_KEY=xkeysib-… node scripts/setup-brevo.mjs
 *
 * ⚠️ DIESES SKRIPT SCHREIBT NICHTS. Es liest und vergleicht. Der Grund ist ein
 * anderer als bei HubSpot: dort müssen zehn eigene Eigenschaften angelegt
 * werden, hier existieren alle Attribute bereits (angelegt am 24.08.2026). Was
 * fehlt, ist die Gewissheit, dass der Code genau ihre Namen benutzt — und die
 * Falle dabei ist gemein: **Brevo verwirft ein unbekanntes Attribut still.**
 * Der Kontakt wird angelegt, der Aufruf antwortet mit 201, und der Vorname
 * fehlt einfach. Kein Fehler, keine Meldung. Genau deshalb gibt es diese
 * Prüfung.
 *
 * ⚠️ DIE ZU PRÜFENDE LISTE KOMMT AUS api/_lib/brevo.js, über einen echten
 * Aufruf von kontaktAttribute() mit Beispieldaten. Nicht aus einer zweiten,
 * hier gepflegten Liste: die wäre genau die Stelle, an der Code und Konto
 * auseinanderlaufen.
 */

import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const HIER = path.dirname(fileURLToPath(import.meta.url));
const brevo = require(path.join(HIER, "..", "api", "_lib", "brevo.js"));

const BASIS = "https://api.brevo.com/v3";
const KEY = process.env.BREVO_API_KEY;

if (!KEY) {
  console.error("BREVO_API_KEY fehlt. Aufruf:");
  console.error("  BREVO_API_KEY=xkeysib-… node scripts/setup-brevo.mjs");
  process.exit(1);
}

const kopf = { "api-key": KEY, "Content-Type": "application/json", Accept: "application/json" };

async function api(pfad) {
  const res = await fetch(BASIS + pfad, { headers: kopf });
  const text = await res.text();
  let body = text;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    /* nichts */
  }
  return { ok: res.ok, status: res.status, body };
}

let fehler = 0;

/* ================================================== 1 — Attribute */

console.log("Brevo — Pruefung, es wird nichts geschrieben\n");
console.log("1 — Kontaktattribute");

// Beispieldaten, damit kontaktAttribute() jedes optionale Feld auch setzt.
const BEISPIEL = {
  first_name: "Beispiel",
  last_name: "Person",
  email: "beispiel@example.org",
  phone: "+49 951 964352-0",
  company: "Beispiel GmbH",
  service: "Objektschutz",
  form_type: "customer_inquiry",
  marketing_opt_in: true,
};
const benutzt = brevo.kontaktAttribute(BEISPIEL, "beispiel-id", "hs-1", "2026-08-26T10:00:00.000Z");

const attr = await api("/contacts/attributes");
if (!attr.ok) {
  console.log("  Attribute konnten nicht gelesen werden: " + attr.status);
  fehler++;
} else {
  const da = new Map((attr.body.attributes || []).map((a) => [a.name, a]));
  for (const [name, wert] of Object.entries(benutzt)) {
    const a = da.get(name);
    if (!a) {
      console.log("  ✗  " + name.padEnd(22) + "EXISTIERT NICHT — Brevo verwirft diesen Wert STILL");
      fehler++;
      continue;
    }
    // ⚠️ Typ mitprüfen. OPT_IN als Text angelegt nimmt "true" an, lässt sich
    // aber nicht als Bedingung in einer Automation benutzen — und das ist der
    // einzige Zweck des Feldes.
    const erwartet = typeof wert === "boolean" ? "boolean" : name === "LAST_FORM_SUBMISSION" ? "date" : "text";
    const passt = String(a.type || "").toLowerCase().includes(erwartet);
    console.log(
      "  " + (passt ? "✓" : "•") + "  " + name.padEnd(22) +
      (a.type || "?") + (passt ? "" : "   erwartet " + erwartet + " — bitte im Konto pruefen")
    );
  }
  // Umgekehrt: Attribute, die es gibt und die der Code NICHT benutzt. Kein
  // Fehler, aber gut zu wissen.
  const ungenutzt = [...da.keys()].filter((n) => !(n in benutzt) && n.toUpperCase() === n);
  if (ungenutzt.length) console.log("\n  (vom Code nicht benutzt: " + ungenutzt.join(", ") + ")");
}

/* ================================================== 2 — Absender */

console.log("\n2 — Absender");
const send = await api("/senders");
if (!send.ok) {
  console.log("  konnten nicht gelesen werden: " + send.status);
  fehler++;
} else {
  const soll = process.env.BREVO_SENDER_EMAIL;
  for (const s of send.body.senders || []) {
    const treffer = soll && s.email === soll;
    console.log(
      "  " + (treffer ? "✓" : " ") + "  id=" + String(s.id).padEnd(4) +
      (s.name || "").padEnd(34) + s.email +
      (s.active === false ? "  [inaktiv]" : "")
    );
  }
  if (soll && !(send.body.senders || []).some((s) => s.email === soll)) {
    console.log("  ✗  BREVO_SENDER_EMAIL (" + soll + ") ist KEIN eingetragener Absender");
    fehler++;
  }
  if (!soll) console.log("  •  BREVO_SENDER_EMAIL nicht gesetzt — der Vergleich entfaellt");
}

/* ================================ 3 — Transaktionsvorlage */

console.log("\n3 — Transaktionsvorlage fuer die Eingangsbestaetigung");
const tid = process.env.BREVO_CONFIRMATION_TEMPLATE_ID;
if (!tid) {
  console.log("  •  BREVO_CONFIRMATION_TEMPLATE_ID nicht gesetzt — ohne sie geht KEINE Bestaetigung raus");
  fehler++;
} else {
  const t = await api("/smtp/templates/" + encodeURIComponent(tid));
  if (!t.ok) {
    console.log("  ✗  Vorlage " + tid + " nicht abrufbar (" + t.status + ")");
    fehler++;
  } else {
    const v = t.body || {};
    console.log("  " + (v.isActive ? "✓" : "✗") + "  id=" + tid + "  \"" + (v.name || "?") + "\"");
    console.log("     Betreff:  " + (v.subject || "(keiner)"));
    console.log("     Absender: " + ((v.sender && v.sender.email) || "?"));
    console.log("     Antwort:  " + (v.replyTo || "(nicht gesetzt)"));
    if (!v.isActive) {
      console.log("     ✗ INAKTIV — eine inaktive Vorlage wird nicht versendet");
      fehler++;
    }
    // ⚠️ Die Platzhalter prüfen, nicht nur die Existenz. Eine Vorlage, die
    // {{ params.VORNAME }} nicht enthält, verschickt eine anonyme Mail —
    // technisch erfolgreich, inhaltlich falsch.
    const html = String(v.htmlContent || "");
    for (const p of ["VORNAME", "SERVICE"]) {
      const drin = html.includes("params." + p);
      console.log("     " + (drin ? "✓" : "•") + " Platzhalter params." + p + (drin ? "" : " nicht gefunden"));
    }
  }
}

/* ================================================== 4 — Listen */

console.log("\n4 — Listen (fuer die Marketing-Einwilligung)");
const listen = await api("/contacts/lists?limit=50");
if (!listen.ok) {
  console.log("  konnten nicht gelesen werden: " + listen.status);
  fehler++;
} else {
  const soll = process.env.BREVO_MARKETING_LIST_ID;
  const alle = listen.body.lists || [];
  if (!alle.length) console.log("  keine Listen im Konto");
  for (const l of alle) {
    const treffer = soll && String(l.id) === String(soll);
    console.log(
      "  " + (treffer ? "✓" : " ") + "  id=" + String(l.id).padEnd(5) +
      (l.name || "").padEnd(38) + (l.totalSubscribers ?? "?") + " Kontakte"
    );
  }
  console.log("");
  if (!soll) {
    console.log("  ⚠️ BREVO_MARKETING_LIST_ID ist nicht gesetzt. Der Endpoint vermerkt die");
    console.log("     Einwilligung dann als OPT_IN=true, legt den Kontakt aber in KEINE");
    console.log("     Liste — es kann also keine Kampagne an ihn gehen. Eine ID von oben");
    console.log("     auswaehlen und eintragen:");
    console.log("         BREVO_MARKETING_LIST_ID=<id>");
    fehler++;
  } else if (!alle.some((l) => String(l.id) === String(soll))) {
    console.log("  ✗  BREVO_MARKETING_LIST_ID=" + soll + " gibt es nicht");
    fehler++;
  }
}

console.log(
  "\n" + (fehler === 0
    ? "Alles verknuepft. Transaktions- und Marketingweg sind beide vollstaendig konfiguriert."
    : fehler + " Punkt(e) offen — siehe oben.")
);
process.exit(fehler === 0 ? 0 : 2);
