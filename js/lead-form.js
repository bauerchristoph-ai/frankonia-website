/*
  Kundenformular: Absenden, Spamschutz, Kampagnenparameter, GTM-Ansatzpunkte.
  2026-08-26.

  Geladen auf jeder Seite mit einem Formular (<script src="/js/lead-form.js"
  defer>). Findet seine Formulare über [data-lead-form] und tut nichts, wenn
  keins da ist.

  ⚠️ DAS FORMULAR FUNKTIONIERT OHNE DIESES SKRIPT. Es hat ein echtes `action`
  und `method="post"`; ohne JavaScript sendet der Browser normal, der Server
  antwortet mit einer Weiterleitung auf /danke/. Was ohne JavaScript fehlt: das
  Turnstile-Token (der Server lässt eine Anfrage ohne Prüfergebnis durch), die
  Kampagnenparameter, die Mindestzeit und die Fehlermeldungen an den Feldern.
  Dieses Skript verbessert also, es ermöglicht nicht — dieselbe Regel wie bei
  jedem anderen Skript in diesem Projekt.

  ⚠️ ES FEUERT KEINE GA4-EREIGNISSE. Das Tracking konfiguriert Christoph nach
  dem Launch im Tag Manager. Hier entstehen nur die Ansatzpunkte: stabile
  data-Attribute, ein Erfolgszustand und ein DOM-Event.
*/

(function () {
  "use strict";

  var TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";
  var UTM_FELDER = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  var SPEICHER_SCHLUESSEL = "frankonia:utm";
  var DANKE = "/danke/";

  var formulare = Array.prototype.slice.call(document.querySelectorAll("[data-lead-form]"));
  if (!formulare.length) return;

  /* ==================================================== Kampagnenparameter */

  /**
   * ⚠️ WARUM sessionStorage UND NICHT NUR DIE URL: die Parameter stehen nur an
   * der Seite, auf der jemand aus einer Anzeige kommt. Klickt er von dort noch
   * einmal weiter — und genau das tut fast jeder, bevor er ein Formular
   * ausfüllt — sind sie weg, und die Anfrage kommt ohne Kampagne an. Dann ist
   * in Google Ads nicht mehr erkennbar, welche Anzeige den Lead gebracht hat.
   *
   * ⚠️ NUR BEIM ERSTEN MAL SCHREIBEN. Wer über eine Anzeige kommt und später
   * über die organische Suche wiederkehrt, soll die Kampagne des ERSTEN
   * Kontakts behalten; ein Überschreiben mit leeren Werten würde sie löschen.
   * Deshalb wird nur geschrieben, wenn die aktuelle URL überhaupt Parameter
   * trägt.
   */
  function utmLesen() {
    var gespeichert = {};
    try {
      var roh = sessionStorage.getItem(SPEICHER_SCHLUESSEL);
      if (roh) gespeichert = JSON.parse(roh) || {};
    } catch (e) {
      // Privates Fenster oder gesperrter Speicher: kein Grund, hier
      // aufzuhören. Die Kampagne fehlt dann, das Formular funktioniert.
      gespeichert = {};
    }

    var params;
    try {
      params = new URLSearchParams(window.location.search);
    } catch (e) {
      return gespeichert;
    }

    var neu = {};
    var hatNeue = false;
    for (var i = 0; i < UTM_FELDER.length; i++) {
      var wert = params.get(UTM_FELDER[i]);
      if (wert) {
        neu[UTM_FELDER[i]] = wert.slice(0, 200);
        hatNeue = true;
      }
    }
    // gclid ist kein UTM-Parameter, aber er ist der verlässlichste Hinweis auf
    // eine Google-Ads-Herkunft. Er wird als utm_source getragen, wenn sonst
    // nichts da ist — sonst geht ein bezahlter Klick als "direkt" durch.
    if (!hatNeue && params.get("gclid")) {
      neu.utm_source = "google";
      neu.utm_medium = "cpc";
      hatNeue = true;
    }

    if (!hatNeue) return gespeichert;
    try {
      sessionStorage.setItem(SPEICHER_SCHLUESSEL, JSON.stringify(neu));
    } catch (e) {
      /* nicht schlimm, siehe oben */
    }
    return neu;
  }

  var utm = utmLesen();

  /* ============================================================== Turnstile */

  var turnstileGeladen = false;
  var turnstileKaputt = false;

  /**
   * Lädt das Turnstile-Skript einmal und rendert je Formular ein Widget.
   *
   * ⚠️ `data-cookieconsent="ignore"` IST DER GANZE PUNKT DIESER FUNKTION.
   * Cookiebot läuft mit `data-blockingmode="auto"` und blockiert alles, was es
   * für einen Drittanbieter hält — Turnstile eingeschlossen. Dann lädt der
   * Spamschutz erst nach der Einwilligung, also genau bei den Besuchern nicht,
   * die den Banner ignorieren. Das Attribut ist Cookiebots dokumentierter
   * Ausweg. Es ist zulässig, weil Turnstile für die Prüfung keine Cookies
   * setzt und damit einwilligungsfrei ist.
   * ⚠️ Nach jeder Änderung hier im Browser gegenprüfen, dass das Widget VOR
   * jeder Einwilligung lädt. Das ist der eine Punkt an dieser Datei, der still
   * fehlschlägt.
   */
  function turnstileLaden(fertig) {
    if (turnstileGeladen) return fertig();
    turnstileGeladen = true;

    var s = document.createElement("script");
    s.src = TURNSTILE_SRC + "?render=explicit";
    s.async = true;
    s.defer = true;
    s.setAttribute("data-cookieconsent", "ignore");
    s.onload = fertig;
    s.onerror = function () {
      // ⚠️ EIN AUSFALL DARF DAS FORMULAR NICHT BLOCKIEREN. Dann greifen
      // Honeypot und Mindestzeit, und der Server behandelt eine Anfrage ohne
      // Token als "keine Prüfung möglich" statt als Bot.
      turnstileKaputt = true;
      if (window.console) console.warn("Turnstile konnte nicht geladen werden — Formular bleibt nutzbar.");
      fertig();
    };
    document.head.appendChild(s);
  }

  /* Verfuegbare Breite im Formular messen. Fallback auf das Fenster, wenn der
     Container noch keine Breite hat (etwa weil er ausgeblendet ist). */
  function turnstileGroesse(behaelter) {
    var breite = 0;
    try {
      breite = behaelter.getBoundingClientRect().width;
      if (!breite && behaelter.parentElement) {
        breite = behaelter.parentElement.getBoundingClientRect().width;
      }
    } catch (e) {
      breite = 0;
    }
    if (!breite) breite = window.innerWidth || 0;
    return breite < 300 ? "compact" : "flexible";
  }

  function turnstileRendern(form) {
    var behaelter = form.querySelector("[data-turnstile]");
    if (!behaelter || turnstileKaputt) return;
    if (!window.turnstile || typeof window.turnstile.render !== "function") {
      turnstileKaputt = true;
      return;
    }
    try {
      var id = window.turnstile.render(behaelter, {
        sitekey: behaelter.getAttribute("data-sitekey") || form.getAttribute("data-turnstile-sitekey"),
        // "auto" folgt der Sprache des Browsers; die Seite ist deutsch, aber
        // ein Besucher mit englischem Browser soll die Meldung verstehen.
        language: "auto",
        // ⚠️ "light", NICHT "dark". Das Formular steht in einer WEISSEN Karte
        // (.conversion__form-wrap) auf einer dunklen Seite — das Widget folgt
        // der Karte, nicht der Seite. Mit "dark" sass ein schwarzer Kasten
        // mitten im weissen Formular; in der Ansicht sofort zu sehen, im Code
        // nicht.
        theme: "light",
        // ⚠️⚠️ "flexible" FUELLT die Breite des Containers, hat aber ein
        // MINIMUM VON 300px. Ist der Container schmaler, ragt das Widget
        // heraus — gemeldet am 26.08.2026 mit einem Screenshot bei 310px
        // Fensterbreite, wo in der weissen Karte nur ~207px Platz sind. Das
        // laesst sich mit CSS nicht heilen: es ist ein iframe von Cloudflare,
        // und ein overflow:hidden wuerde einen Teil des Bedienelements
        // abschneiden.
        // Deshalb unterhalb von 300px die kompakte Variante (150x140), die
        // Cloudflare genau dafuer anbietet. Gemessen, nicht geschaetzt: die
        // Breite kommt aus dem Container selbst, nicht aus window.innerWidth,
        // weil zwischen Fenster und Widget die Karte samt Innenabstand liegt.
        // ⚠️ Die Groesse wird EINMAL beim Rendern entschieden. Wer das Fenster
        // waehrend des Ausfuellens verkleinert, behaelt die grosse Variante;
        // ein Re-Render wuerde das Token verwerfen und den Besucher aus dem
        // Formular werfen. Das ist der bessere Kompromiss.
        size: turnstileGroesse(behaelter),
      });
      behaelter.setAttribute("data-widget-id", id);
    } catch (e) {
      turnstileKaputt = true;
      if (window.console) console.warn("Turnstile konnte nicht gerendert werden:", e && e.message);
    }
  }

  function turnstileZuruecksetzen(form) {
    var behaelter = form.querySelector("[data-turnstile]");
    if (!behaelter || !window.turnstile || turnstileKaputt) return;
    var id = behaelter.getAttribute("data-widget-id");
    try {
      // ⚠️ NACH EINEM FEHLVERSUCH ZURÜCKSETZEN. Ein Token ist genau einmal
      // gültig: ohne Reset schlägt der zweite Versuch mit
      // "timeout-or-duplicate" fehl, und der Besucher steckt fest.
      if (id) window.turnstile.reset(id);
      else window.turnstile.reset(behaelter);
    } catch (e) {
      /* dann eben ohne — der Server lässt eine Anfrage ohne Token durch */
    }
  }

  /* ============================================================ Vorbereiten */

  function felderFuellen(form) {
    var setzen = function (selektor, wert) {
      var el = form.querySelector(selektor);
      if (el) el.value = wert;
    };
    setzen("[data-rendered-at]", String(Date.now()));
    setzen("[data-page-url]", window.location.href.split("#")[0]);
    setzen("[data-referrer]", document.referrer || "");

    // Ein Schlüssel je aufgebautem Formular, nicht je Klick. Genau das macht
    // ihn zur Doppelklick-Abwehr.
    var key;
    try {
      key = window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : null;
    } catch (e) {
      key = null;
    }
    if (!key) key = "k-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
    setzen("[data-idempotency-key]", key);

    for (var i = 0; i < UTM_FELDER.length; i++) {
      var feld = UTM_FELDER[i];
      var el = form.querySelector('[data-utm="' + feld + '"]');
      if (el && utm[feld]) el.value = utm[feld];
    }

    // Vorbelegte Leistung. Der Wert kommt aus dem Include-Parameter der Seite;
    // steht er nicht in der Liste, bleibt die Auswahl offen statt einen
    // erfundenen Eintrag zu erzeugen.
    var select = form.querySelector("select[data-preselect]");
    if (select) {
      var vorgabe = select.getAttribute("data-preselect");
      if (vorgabe) {
        for (var j = 0; j < select.options.length; j++) {
          if (select.options[j].value === vorgabe) {
            select.selectedIndex = j;
            break;
          }
        }
      }
    }
  }

  /* ============================================================ Validierung */

  function fehlerAnzeigen(form, feldNamen, meldung) {
    var status = form.querySelector("[data-form-status]");
    if (status) {
      status.textContent = meldung;
      status.setAttribute("data-state", "fehler");
    }
    // Alle Markierungen zurücksetzen, dann die betroffenen setzen.
    var alle = form.querySelectorAll("[aria-invalid]");
    for (var i = 0; i < alle.length; i++) alle[i].removeAttribute("aria-invalid");
    if (!feldNamen) return;
    var erstes = null;
    for (var j = 0; j < feldNamen.length; j++) {
      var name = String(feldNamen[j]).split(":")[0];
      var el = form.querySelector('[name="' + name + '"]');
      if (el) {
        el.setAttribute("aria-invalid", "true");
        if (!erstes) erstes = el;
      }
    }
    // Den Fokus auf das erste fehlerhafte Feld: sonst muss der Besucher bei
    // einem langen Formular selbst suchen, was gemeint ist.
    if (erstes && typeof erstes.focus === "function") erstes.focus();
  }

  function statusLeeren(form) {
    var status = form.querySelector("[data-form-status]");
    if (status) {
      status.textContent = "";
      status.removeAttribute("data-state");
    }
  }

  /**
   * Prüft mit der Browser-API und gibt die Namen der ungültigen Felder zurück.
   * ⚠️ Das Formular trägt `novalidate`, damit die Meldungen hier entstehen und
   * nicht als Sprechblase am oberen Seitenrand — bei einem Formular mit acht
   * Feldern zeigt der Browser sonst auf ein Feld, das gar nicht im Bild ist.
   */
  function ungueltigeFelder(form) {
    var namen = [];
    var felder = form.querySelectorAll("input[name], select[name], textarea[name]");
    for (var i = 0; i < felder.length; i++) {
      var f = felder[i];
      if (f.type === "hidden" || f.name === "website") continue;
      if (typeof f.checkValidity === "function" && !f.checkValidity()) namen.push(f.name);
    }
    return namen;
  }

  /* ================================================================ Absenden */

  function daten(form) {
    var out = {};
    var fd = new FormData(form);
    fd.forEach(function (wert, name) {
      // Checkbox-Werte: vorhanden heißt angehakt.
      out[name] = typeof wert === "string" ? wert : String(wert);
    });
    // Nicht angehakte Checkboxen erscheinen nicht in FormData. Ausdrücklich
    // auf false setzen, statt sie weglassen — der Server soll eine Aussage
    // bekommen und keine Lücke.
    if (!("privacy_accepted" in out)) out.privacy_accepted = "false";
    if (!("marketing_opt_in" in out)) out.marketing_opt_in = "false";
    return out;
  }

  function erfolg(form, antwort) {
    form.setAttribute("data-form-state", "success");

    /* ⚠️ DAS EVENT FEUERT VOR DER WEITERLEITUNG, und das ist Absicht: es ist
       der zweite, vom URL-Trigger unabhängige Messpfad. Fällt einer aus,
       zählt der andere noch.
       ⚠️ KEINE PERSONENBEZOGENEN DATEN IM detail. Kein Name, keine E-Mail,
       keine Telefonnummer — ein GTM-Event landet je nach Konfiguration bei
       Google, und dort haben sie nichts zu suchen. */
    try {
      document.dispatchEvent(
        new CustomEvent("frankonia:form_success", {
          detail: {
            submission_id: antwort && antwort.submission_id,
            form_type: (antwort && antwort.form_type) || "customer_inquiry",
            service: (antwort && antwort.service) || null,
          },
        })
      );
    } catch (e) {
      /* CustomEvent fehlt nur in sehr alten Browsern */
    }

    // Kurz warten, damit ein synchron gebundener GTM-Trigger noch feuern kann,
    // bevor die Seite wechselt. 120 ms ist lange genug für einen Listener und
    // kurz genug, dass niemand ein Hängen wahrnimmt.
    window.setTimeout(function () {
      window.location.assign(DANKE);
    }, 120);
  }

  function absenden(form, event) {
    event.preventDefault();
    statusLeeren(form);

    var ungueltig = ungueltigeFelder(form);
    if (ungueltig.length) {
      fehlerAnzeigen(form, ungueltig, "Bitte prüfen Sie die markierten Felder.");
      return;
    }

    var knopf = form.querySelector('button[type="submit"]');
    if (knopf) {
      if (knopf.disabled) return; // Doppelklick, erste Verteidigungslinie
      knopf.disabled = true;
      knopf.setAttribute("data-busy", "true");
    }
    var status = form.querySelector("[data-form-status]");
    if (status) status.textContent = "Wird gesendet …";

    var ziel = form.getAttribute("action");

    fetch(ziel, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // ⚠️ Sagt dem Server, dass eine JSON-Antwort erwartet wird. Ohne
        // JavaScript fehlt dieser Kopf, und der Server antwortet dann mit
        // einer Weiterleitung statt mit JSON — so funktionieren beide Wege
        // mit demselben Endpoint.
        Accept: "application/json",
      },
      body: JSON.stringify(daten(form)),
    })
      .then(function (res) {
        return res.json().then(
          function (json) {
            return { status: res.status, json: json };
          },
          function () {
            return { status: res.status, json: null };
          }
        );
      })
      .then(function (r) {
        if (r.status === 200 && r.json && r.json.ok) return erfolg(form, r.json);

        // Ab hier: Fehler. Knopf freigeben, Turnstile zurücksetzen.
        if (knopf) {
          knopf.disabled = false;
          knopf.removeAttribute("data-busy");
        }
        turnstileZuruecksetzen(form);

        var j = r.json || {};
        if (r.status === 400 && j.fehler === "validierung") {
          fehlerAnzeigen(form, j.felder, "Bitte prüfen Sie die markierten Felder.");
        } else if (r.status === 400 && j.fehler === "spamschutz") {
          fehlerAnzeigen(
            form,
            null,
            "Der Spamschutz konnte die Anfrage nicht bestätigen. Bitte senden Sie sie noch einmal ab."
          );
        } else if (r.status === 429) {
          fehlerAnzeigen(form, null, j.hinweis || "Zu viele Anfragen. Bitte rufen Sie uns an.");
        } else {
          fehlerAnzeigen(
            form,
            null,
            (j && j.hinweis) ||
              "Die Anfrage konnte nicht übermittelt werden. Bitte rufen Sie uns an: +49 951 964352-0"
          );
        }
      })
      .catch(function () {
        // Netzfehler: der Server hat nie geantwortet.
        if (knopf) {
          knopf.disabled = false;
          knopf.removeAttribute("data-busy");
        }
        turnstileZuruecksetzen(form);
        fehlerAnzeigen(
          form,
          null,
          "Keine Verbindung zum Server. Bitte prüfen Sie Ihre Internetverbindung oder rufen Sie uns an: +49 951 964352-0"
        );
      });
  }

  /* ================================================================= Aufbau */

  for (var i = 0; i < formulare.length; i++) {
    (function (form) {
      felderFuellen(form);
      form.addEventListener("submit", function (e) {
        absenden(form, e);
      });
    })(formulare[i]);
  }

  turnstileLaden(function () {
    for (var k = 0; k < formulare.length; k++) turnstileRendern(formulare[k]);
  });
})();
