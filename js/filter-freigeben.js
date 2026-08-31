/* Gibt eine verbrauchte Kompositionsebene frei.
 *
 * ⚠️⚠️ WARUM ES DAS GIBT: `filter: blur(0px)` zeichnet nichts weich, hält das
 * Element aber für immer auf einer eigenen Kompositionsebene — es wird bei jedem
 * Frame neu gerastert. Gemessen am 08.08.2026: 116 Elemente auf einem
 * verbrauchten Filter, und eine 3-Sekunden-Aufzeichnung verbrachte 2678 ms in
 * Layerize. Am 31.08.2026 nachgemessen: 44 auf der Startseite, 62 auf
 * /werkschutz/ — der Rückbau existierte nur für die CSS-Reveals (.is-settled in
 * main.js), nicht für die GSAP-getriebenen.
 *
 * `none` sieht identisch aus wie `blur(0px)`. Der Wechsel ist unsichtbar.
 *
 * ⚠️ NUR AM ENDE EINER ANIMATION AUFRUFEN. Wer den Filter zu früh entfernt,
 * schneidet den Weichzeichner ab, statt ihn auslaufen zu lassen.
 *
 * ⚠️ UND NIE BEI onLeaveBack / einem Rückwärtslauf: dort ist der Startzustand
 * `opacity: 0`, und ein clearProps würde unaufgedeckten Inhalt aufblitzen
 * lassen. Diese Funktion räumt deshalb ausschließlich den Filter auf und tastet
 * opacity und transform nicht an.
 */
(function () {
  "use strict";
  window.frankoniaFilterFreigeben = function (ziele) {
    if (!ziele) return;
    var liste = ziele.length !== undefined && typeof ziele !== "string" ? ziele : [ziele];
    for (var i = 0; i < liste.length; i++) {
      var el = liste[i];
      if (!el || !el.style) continue;
      /* Nur wenn nichts mehr weichzuzeichnen ist — sonst würde ein laufender
         Weichzeichner abgeschnitten. */
      var f = el.style.filter || "";
      if (f === "" || /blur\(0(px)?\)/.test(f)) el.style.filter = "none";
    }
  };
})();
