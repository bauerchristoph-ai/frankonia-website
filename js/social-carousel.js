/*
  Social reel — 3D ring carousel (client 2026-08-03).

  The client sent two references: a Swiper "coverflow" demo (liked for the drag
  feel and the look) and a pure-CSS rotating ring (liked for being a REAL 3D
  circle), with the note that the ring should sit still and be turned by
  dragging rather than spinning on a timer. This is that combination — a genuine
  ring, no auto-rotation, driven entirely by pointer drag.

  Swiper itself is not used: it is an external runtime dependency and
  package.json is deliberately empty (CLAUDE.md, "Non-negotiable tech
  constraints"). Nothing here needs it — the whole carousel is ~40 lines of
  transform maths plus pointer events. GSAP is loaded on this page but is not
  used either; a CSS transition handles the settle, which is cheaper.

  Geometry, per card:

      translateZ(-R) rotateY(angle) translateZ(R)

  The trailing translateZ(R) places the card on a circle of radius R facing
  outward; the leading translateZ(-R) pulls the whole ring back so the FRONT
  card lands at z = 0. Without that lead-in the front card sits R closer to the
  camera and perspective scales it up ~27% at these values, which both overflows
  the section and makes the card size depend on the radius. This way the front
  card is always exactly its CSS size and only the receding ones scale down.

  `angle` is the card's shortest CYCLIC distance from the current position, so
  with three cards the offsets are always -1 / 0 / +1: one centred, one either
  side, and dragging one slot moves centre -> left, right -> centre, left ->
  right. That wrap is what makes a three-card ring work at all — a literal
  360/3 = 120 degree ring would turn both side cards past their own edge and
  leave only the middle one legible.

  R and the angle step are read from CSS custom properties (--social-radius /
  --social-step) rather than hardcoded, so the composition can be tuned per
  breakpoint in page-home.css without touching this file.

  JS-only-ever-enhances, same contract as every other motion primitive here: the
  markup is the plain flex row of three real, crawlable items, and NOTHING in
  page-home.css positions them in 3D on its own. This script is the only thing
  that ever adds .is-carousel. No JS, a script error, prefers-reduced-motion, or
  a viewport below the breakpoint all leave the ordinary row (or, on a phone,
  the existing snap-scroll strip) fully visible and usable.
*/

(function initSocialCarousel() {
  var grid = document.querySelector("[data-social-carousel]");
  if (!grid) return;

  var items = Array.prototype.slice.call(grid.querySelectorAll(".social__item"));
  if (items.length < 2) return;

  // Reduced motion keeps the static row — a drag-to-spin ring is exactly the
  // kind of thing that setting is asking us not to build.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // ⚠️ 04.09.2026: KEINE BREITENGRENZE MEHR. Der Ring laeuft auf jeder Breite
  // (Kunde: "wenn moeglich auch Ring auf dem Telefon … so dass ich ihn genauso
  // wischen kann"). Vorher stand hier eine 1024er Abfrage, weil die
  // Desktop-Geometrie bei 768 fast uebereinander projizierte — das war ein
  // Problem der VIER MASSE, nicht der Breite. Die stehen jetzt je Stufe in
  // css/page-home.css.
  // Der Ausstieg bleibt an zwei Stellen: reduced motion (oben) und fehlende
  // Zeigerunterstuetzung — dann bleibt der gestapelte Fallback stehen.
  // ⚠️ Zeigergesten deckt auch Beruehrung ab; damit die Seite dabei senkrecht
  // scrollbar bleibt, traegt der Ring touch-action: pan-y im CSS. Ohne das
  // frisst die Geste entweder das Drehen oder das Scrollen.
  var mq = { matches: true, addEventListener: function () {}, addListener: function () {} };

  var N = items.length;
  var progress = 0; // float slot index currently at the front
  var raf = 0;
  var active = false;

  var dragging = false;
  var pointerId = null;
  var startX = 0;
  var startProgress = 0;
  var movedPx = 0;

  function num(name, fallback) {
    var v = parseFloat(getComputedStyle(grid).getPropertyValue(name));
    return isNaN(v) ? fallback : v;
  }

  // Shortest cyclic distance, in slots, mapped into [-N/2, N/2).
  function wrap(d) {
    d = ((d % N) + N) % N;
    if (d > N / 2) d -= N;
    return d;
  }

  function render() {
    if (raf) { cancelAnimationFrame(raf); }
    raf = 0;
    var radius = num("--social-radius", 300);
    var step = num("--social-step", 52);
    for (var i = 0; i < N; i++) {
      var d = wrap(i - progress);
      var depth = Math.abs(d);
      items[i].style.transform =
        "translateZ(" + -radius + "px) rotateY(" + d * step + "deg) translateZ(" + radius + "px)";
      items[i].style.opacity = String(Math.max(0.3, 1 - depth * 0.4));
      // Depth order is handled by the parent's preserve-3d, but opacity below 1
      // gives a child its own stacking context and some engines then fall back
      // to paint order; this keeps the front card on top either way.
      items[i].style.zIndex = String(100 - Math.round(depth * 10));
    }
  }

  function schedule() {
    if (!raf) raf = requestAnimationFrame(render);
  }

  // Discrete steps paint immediately rather than waiting for the next frame:
  // there is nothing to coalesce (one key press = one slot), and deferring it
  // only adds latency. rAF batching is kept for pointermove, which really can
  // fire several times per frame.
  function go(delta) {
    progress = Math.round(progress) + delta;
    render();
  }

  function onDown(e) {
    if (!active || e.button > 0) return;
    dragging = true;
    movedPx = 0;
    pointerId = e.pointerId;
    startX = e.clientX;
    startProgress = progress;
    grid.classList.add("is-dragging");
    try { grid.setPointerCapture(pointerId); } catch (err) { /* not fatal */ }
  }

  function onMove(e) {
    if (!dragging || e.pointerId !== pointerId) return;
    var dx = e.clientX - startX;
    movedPx = Math.abs(dx);
    // Positive drag (rightwards) brings the LEFT card toward the centre.
    progress = startProgress - dx / num("--social-drag", 260);
    schedule();
  }

  function onUp(e) {
    if (!dragging || (e && e.pointerId !== pointerId)) return;
    dragging = false;
    grid.classList.remove("is-dragging");
    try { grid.releasePointerCapture(pointerId); } catch (err) { /* not fatal */ }
    pointerId = null;
    progress = Math.round(progress); // settle onto the nearest slot
    render();
  }

  function onKey(e) {
    if (!active) return;
    if (e.key === "ArrowLeft") { go(-1); e.preventDefault(); }
    else if (e.key === "ArrowRight") { go(1); e.preventDefault(); }
  }

  // A drag that ends on a link must not also count as a click on it.
  function onClickCapture(e) {
    if (movedPx > 8) {
      e.preventDefault();
      e.stopPropagation();
      movedPx = 0;
    }
  }

  function enable() {
    if (active) return;
    active = true;
    grid.classList.add("is-carousel");
    grid.setAttribute("tabindex", "0");
    grid.setAttribute("role", "group");
    grid.setAttribute(
      "aria-label",
      document.documentElement.lang === "de"
        ? "Social-Media-Beiträge — mit den Pfeiltasten oder per Ziehen drehen"
        : "Social media posts — turn with the arrow keys or by dragging"
    );
    // Native image dragging would hijack the pointer gesture.
    grid.querySelectorAll("img").forEach(function (img) {
      img.setAttribute("draggable", "false");
    });
    schedule();
  }

  function disable() {
    if (!active) return;
    active = false;
    dragging = false;
    grid.classList.remove("is-carousel", "is-dragging");
    grid.removeAttribute("tabindex");
    grid.removeAttribute("role");
    grid.removeAttribute("aria-label");
    items.forEach(function (el) {
      el.style.transform = "";
      el.style.opacity = "";
      el.style.zIndex = "";
    });
  }

  function sync() {
    if (mq.matches) enable();
    else disable();
  }

  grid.addEventListener("pointerdown", onDown);
  grid.addEventListener("pointermove", onMove);
  grid.addEventListener("pointerup", onUp);
  grid.addEventListener("pointercancel", onUp);
  grid.addEventListener("keydown", onKey);
  grid.addEventListener("click", onClickCapture, true);
  window.addEventListener("resize", schedule);
  if (mq.addEventListener) mq.addEventListener("change", sync);
  else if (mq.addListener) mq.addListener(sync);

  sync();
})();
