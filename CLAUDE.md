# FRANKONIA Sicherheitsdienst — Website

Operational rules for Claude Code on this project. The source of truth for
everything not covered here is
[docs/frankonia-developer-guidelines.md](docs/frankonia-developer-guidelines.md)
(client-provided, dated 2026-07-08) — when in doubt, that document wins and
this file should be updated to match it.

## What this project is

A static, hand-coded B2B website for a German security services company
(FRANKONIA Sicherheitsdienst GmbH & Co. KG, Bamberg). It replaces a WordPress
+ Elementor site. It is not a portfolio piece — it exists to generate
qualified B2B security-services leads for decision-makers within roughly a
100 km radius of Bamberg (Franken / Bayern), via Google organic, Google Ads,
and increasingly AI search (ChatGPT, Perplexity, Claude, Gemini).

**Primary conversion goal, above all other page goals:** get the visitor to
submit the "Kostenlose Sicherheitsanalyse anfordern" form.

**Strategic direction updated 2026-07-22 (client, Christoph) — the full,
detailed version now lives in [docs/project-strategy.md](docs/project-strategy.md);
read it before any significant design/dev decision. Summary of the shift:**
the project now has **three equally important goals**, not one ranked
list — (1) qualified B2B lead generation, (2) strong SEO/GEO visibility,
(3) a premium, memorable brand experience. Conversion is still the single
primary *page action* (the free-analysis form), and content must always
be real, crawlable HTML — but "premium, editorial, Apple-style" motion and
selective advanced tech are now an approved direction, not a deviation.

Evaluate every recommendation against this decision order (also in
project-strategy.md — do not recommend something only because it looks
impressive, and do not reject something only because it uses JS/animation;
weigh the real trade-off):

1. Does it improve or preserve conversion?
2. Does it support SEO and GEO?
3. Does it improve trust and comprehension?
4. Does it strengthen the premium brand experience?
5. Can it be implemented accessibly?
6. Can it be implemented without unacceptable performance cost?
7. Is it maintainable across a future 30–100 page site?

Implementation is layered — content (semantic HTML: headings, copy, links,
CTAs, forms, FAQs, schema) first; then visual styling; then motion (GSAP,
ScrollTrigger, Lenis, SVG draw, transitions); then heavy/optional
experiences (WebGL, maps, 3D, video) that must be lazy/conditionally
loaded. The page must remain fully understandable and usable if JavaScript
fails or a crawler doesn't execute it. Motion and heavy effects must never
remove essential SEO content from the DOM.

The site should read as reliable, precise, and competent — and *also* feel
premium, restrained, editorial, modern and technically controlled. Not a
generic corporate template, and not a visually-overloaded, animation-for-
its-own-sake showcase either. Performance still matters (targets unchanged,
see Performance below) — the rule is "use advanced interaction
strategically and optimize it carefully," not "remove all animation."

## Current phase

> **Los valores del sistema visual — paleta, escala tipográfica, espaciado,
> radios, sombras, movimiento y la tabla de contraste medida — están en
> [docs/design-system.md](docs/design-system.md).** `css/tokens.css` sigue
> siendo la fuente de verdad; ese doc es el mapa legible y el *cuándo usar
> cada uno*. Una decisión nueva de color/tipografía se anota ahí en el mismo
> commit.
>
> **Antes de escribir markup de una página nueva:
> [docs/page-conventions.md](docs/page-conventions.md).** Es el "cómo se
> construye una página" — márgenes (`--content-inset` en los dos lados), escala
> de títulos, CTAs, breadcrumbs, el stack de efectos, el formulario compartido,
> el pixel seam obligatorio antes del footer, los mínimos de teléfono, y la
> plantilla de servicio completa (§8). **Leerlo primero, no después:** armando
> `/werkschutz/` se salteó la mitad y hubo que volver atrás. Cada decisión nueva
> que aplique a más de una página se agrega ahí en el mismo commit.
>
> **Tracker operativo: [docs/build-checklist.md](docs/build-checklist.md).**
> Es la única lista de qué está hecho y qué falta, en las 49 páginas. Marcá lo
> que termines **en el mismo commit** que el cambio. El *por qué* de cada
> decisión de alcance vive en [docs/roadmap.md](docs/roadmap.md).
>
> El copy de las 49 páginas ESTÁ, en `content-de/` (49 `.docx`, con Title,
> Meta-Description y H1 ya escritos). El contenido no es el bloqueo.
>
> ⚠️ **2026-08-05 — LA FUENTE DE COPY CAMBIÓ: ahora es
> `NewVersionCopiesFrankonia/` (52 `.docx`, Stand 04.08.2026), NO `content-de/`.**
> Instrucción del cliente (Christoph): "tomar estas como las reales… la vieja
> versión de copy la dejamos de usar y luego las eliminamos". **Todo texto nuevo
> sale de esa carpeta, y es la única que queda en el repo.**
> **`content-de/` YA NO EXISTE acá** — se movió el 2026-08-05 a
> `~/Desktop/FRANKONIA-assets-archive/copies-OLD-24-07-2026-DO-NOT-USE/` para que
> no haya dos fuentes de copy en el proyecto. Los 49 `.docx` están en el
> historial de git igual (estaban trackeados), así que un `git show` los
> recupera; el diff viejo↔nuevo por página ya está hecho y resumido más abajo.
> Toda entrada de este archivo que cite `content-de/2026-07-27 …` describe de qué
> se construyó una página, no qué debería decir hoy.
>
> ⚠️ **`NewVersionCopiesFrankonia/` NO está en git** (0 de 52 archivos). Es la
> única copia de la fuente de verdad actual y no tiene historial — conviene
> commitearla antes de empezar a migrar.

**2026-08-05 — primera tanda de migración al copy v2 APLICADA** (cliente: "te doy
el ok a todo lo que esté en el nuevo copy… respetá todo lo que dice el copy").
Todo verificado con medición, no a ojo. Lo que se hizo:

- **Precio 26–32 €/Std. netto + Zuschläge, en las 6 apariciones.** `/werkschutz/`
  (respuesta de Kosten, Preis-Box, FAQ visible **y su JSON-LD**) y el homepage
  (FAQ visible + JSON-LD). ⚠️ **La regla que hay que respetar siempre acá: el
  texto de cada FAQ existe DOS veces** — visible y dentro del `FAQPage` — y las
  dos tienen que quedar byte-idénticas, si no el precio que ve Google difiere del
  que ve el visitante. Se editaron con `replace_all` justamente por eso.
  La Preis-Box mantiene el **guion corto** (`26-32`), no el en dash del doc: eso
  es una decisión explícita del cliente del 2026-08-03 sobre el glifo y sigue
  vigente; lo único que cambió es el número.
- **Bayernhafen fuera de todo el sitio** (Freigabe que no llegó): en
  `/werkschutz/` el Anwendungsfall 04 pasó a "Logistik- & Umschlagstandorte" con
  el texto nuevo del doc, y el Abbinder + su logo pasaron a **Sozialstiftung
  Bamberg**; en `/referenzen/` salieron los 2 `<img>` del marquee. Su nombre
  tampoco quedó en comentarios del markup, a propósito.
  ⚠️ **Sacar un logo del marquee puede romper el loop** (ya pasó el 2026-08-04).
  Re-medido: las 3 filas siguen cubriendo la fila con `-50%` (slack 606–1482px),
  grupos pares, ~9,6–10,5 px/s. No hizo falta subir contadores.
- **`/referenzen/` Ergebnis-Kacheln anonimizadas.** `.ref-results__client` se
  borró de markup y CSS (el doc: "bewusst anonymisiert und NICHT den
  Testimonial-Kunden zugeordnet"), y cada kachel es ahora un link entero a su
  case study. Los 3 testimonios de abajo siguen con nombre — es deliberado e
  independiente.
- **Einsatzgebiete: Forchheim entra, Hof sale del link.** `/sicherheitsdienst-hof/`
  no está en el set de 49 páginas, así que era **un 404 linkeado en producción, en
  el footer de TODAS las páginas** (no sólo en los chips del homepage — esa fue la
  parte que casi se me pasa). Hof + Kronach, Kulmbach, Lichtenfels y Schwandorf
  son ahora menciones sin link en `.coverage__mentions`. El boundary de Forchheim
  se bajó una sola vez de Nominatim siguiendo el proceso documentado — el polígono
  de la **ciudad**, explícitamente NO "Landkreis Forchheim", que Nominatim también
  devuelve y es otra área administrativa.
- **Nürnberg** en el chip del homepage y en `js/coverage-map.js` (donde el `name`
  es visible: tooltip del marker + panel del mapa). La KEY sigue siendo
  `nuremberg` porque es también el `data-coverage-city` y el nombre del geojson.
- **WhatsApp real**: `wa.me/491727866338` (Steffen), y el `aria-label` pasó a
  alemán — decía "Contact via WhatsApp" en páginas alemanas.
- **Label "Sicherheitsanalyse" → "Ihr Sicherheitskonzept in drei Schritten".** El
  **ancla `#sicherheitsanalyse` NO se tocó**, y es lo correcto: la referencian el
  CTA de los tres header partials y todas las páginas, más cualquier URL de Ads
  viva. Chris confirmó que el id puede quedarse.
- **BUG DE CONTRASTE, encontrado midiendo y NO era lo que el cliente reportó.**
  Change Request 2.6 decía que el checkbox renderiza "Ich habe die gelesen und
  stimme zu." — falta la palabra. El markup estaba **bien en las 5 páginas**; lo
  que pasaba es que el link se lavaba: `--color-accent-strong` resuelve a
  blue-light y sobre la **tarjeta blanca** del form medía **3,11:1** a 14,8px
  (falla 4,5:1), y el teléfono 3,71:1. Ahora los dos usan la mezcla profunda
  documentada en §5 → **4,9:1 medido en las 5 páginas**. Regla general: cualquier
  azul de marca sobre la tarjeta blanca del form necesita esa mezcla, no el token.
- **Verificado ya correcto, sin tocar nada** (el copy v2 se escribió mirando el
  build, así que varias cosas "nuevas" ya estaban): los Kacheln de Leistungen ya
  eran sólo título + "Mehr erfahren" (las descripciones viven en
  `data-preview-text`, que alimenta el panel de hover del desktop — eso es parte
  del live design que el doc espeja, no se borró); el Abbinder del pain-hook nunca
  se había construido; la Trust-Leiste ya tenía **4** counters (el 4,7 con
  estrella) y exactamente los 8 logos que pide el doc; el orden de servicios ya
  era el R3.21a; y las estrellas de Google del Change Request 1.1 ya existen
  (`#icon-star`, hero + trust bar) — Chris estaba viendo un preview viejo.
- **Sección "Unser System"**: sólo 2 diferencias reales — los bullets 1 y 2 de la
  card 3, y a la card 6 le **faltaba su tercer bullet**.
- Medido después de todo: sin scroll horizontal, **CLS 0** en las 5 páginas, LCP
  908–1888ms en Slow 4G + 4× CPU, y el H2 más largo de la Trust-Leiste no choca
  con nada (2 líneas a 1440/1280/1024, 3 en mobile; el `clipped:true` que reportó
  la primera sonda era **falso positivo mío** — los spans de máscara de
  `title-reveal` son `overflow:hidden` a propósito: con JS desactivado
  `scrollHeight == clientHeight`).

**2026-08-05 (misma sesión) — LAS 3 CASE STUDIES ESTÁN CONSTRUIDAS**, así que los
3 links a 404 que la tanda anterior había dejado en `/referenzen/` quedaron
cerrados. `pages/referenzen/case-study-{sicherheitstechnik,sicherheitskonzept,
schichtsystem}.html` → `/referenzen/case-study-*/`, de los Webtexte 50–52,
verbatim. **Páginas 6, 7 y 8 terminadas, y el primer tipo de página nueva desde
`/jobs/`.**

- **Un solo stylesheet para las tres**, `css/page-case-study.css` (~330 líneas),
  todo con clases genéricas `.cs-*`: los tres documentos del cliente tienen la
  MISMA forma (Hero + Ergebnis-Kachel → secciones de artículo → pitch de
  Sicherheitskonzept + CTA), así que la cuarta case study es copy, no CSS.
  `page-service.css` va de chasis (§9.1) y no se re-copió ni el inset, ni el
  `main h2`, ni el chevrón, ni `.section--light`, ni el bloque `.pixel-seam`.
- **Orden de color: hero ■ → artículo □ → pitch ■ → footer, 3 seams.** Los 4–5
  H2 del artículo viven en UNA sola sección blanca a propósito: son capítulos de
  una historia y un seam entre dos blancos disuelve blanco sobre blanco (§9.2,
  la misma decisión que ya toman `/referenzen/` y `/jobs/`).
- **`build.js` maneja páginas anidadas sin tocarle nada**:
  `pages/referenzen/case-study-x.html` → `dist/referenzen/case-study-x/index.html`,
  y **conviven con `pages/referenzen.html` → `dist/referenzen/index.html`** —
  verificado, ninguna pisa a la otra.
- ⚠️ **El CTA NO apunta a donde dice el documento, y es deliberado.** Los tres
  documentos mandan el botón a `/sicherheitskonzept/` (Webtext 08), que todavía no
  existe: publicar el botón de conversión PRIMARIO como 404 contradice el "Do not
  ship a linked 404" de Chris. Apunta a `/#sicherheitsanalyse` (el formulario
  vivo) con la etiqueta del documento intacta. Cuando se construya
  `/sicherheitskonzept/` es una línea por página. Los links secundarios
  ("Weiterführend") sí apuntan a las URLs planeadas reales.
- **Las fotos son FRAMES RESERVADOS con la descripción del propio documento**
  ("[Bild folgt: Begehungssituation am Werkstor]"), 16:9, mismo patrón que el
  retrato reservado de Jäger: reservan el espacio real (sin CLS cuando lleguen) y
  no se inventó ninguna imagen. Chris dice que las entrega.
- **Tercera excepción declarada a §2**: los H2 del artículo bajan a un clamp que
  topa en 34px en vez de 60px. La razón es estructural, no estética — un artículo
  tiene cinco o seis H2 a una pantalla de distancia y al tamaño de sección cada
  uno se lee como una página nueva. El H1 sigue en la escala de hero obligatoria.
  ⚠️ **Ya van tres excepciones a §2** (Vorteile 48px, Leistungsumfang 40px, esta);
  la próxima debería replantear §2 en vez de sumar una cuarta.
- `datePublished` en el schema `Article` es la fecha "Stand" del documento
  (04.08.2026), no una fecha de publicación real de un CMS. **No se emite
  `image`** en el Article: las fotos no existen todavía y apuntar a un archivo
  cualquiera sería peor que omitir una propiedad opcional.
- **Medido a 320 / 390 / 768 / 1440**: sin scroll horizontal, **cero fallos de
  contraste** en las tres, un solo `<h1>`, sin saltos de nivel de heading, 3 seams
  cada una, medida del artículo 44rem exactos (704px a 1440). Alturas 4.4–6.9k px.
  Los únicos targets bajo 44px son los compartidos ya documentados (skip-link
  42px y el link del breadcrumb 16px) — **ninguno de los bloques `.cs-*` nuevos
  falla**, verificado elemento por elemento.
- Sumadas a `sitemap.xml` (priority 0.5, changefreq yearly: son piezas
  editoriales con fecha, no páginas que se reescriben).

**2026-08-05 (tanda siguiente) — AUDITORÍA COMPLETA CONTRA LOS `.docx` + LA
SEKTION 12 CONSTRUIDA. Lo de arriba queda cerrado.**

La auditoría se hizo con un extractor propio (`zipfile` + XML para los `.docx`,
texto visible + JSON-LD para el build, sin dependencias), no leyendo este
archivo. **Regla que confirmó su utilidad: no confiar en CLAUDE.md para saber
qué está construido** — dos afirmaciones de la tanda anterior resultaron
imprecisas (ver Kontakt y Referenzen abajo).

- **Sektion 12 construida** (`.philosophy`, entre Einsatzgebiete y FAQ), copy
  verbatim 7/7 del Webtext 01. ⚠️ **El H2 es "Ihr Sicherheitsdienst für Franken:
  Qualität, Innovation, Verantwortung"** — "Sicherheit, wie wir sie verstehen" es
  el NOMBRE de la sección en el briefing, no un título a renderizar. Un script
  que ancle en la cadena `"Sektion 12"` agarra la línea `Stand:` del encabezado
  del doc y termina extrayendo el H2 de la Sektion 2; hay que anclar en
  `^Sektion 12\s*[—-]`.
  Sección **oscura y SIN pixel-seam nuevo**: va pegada a `.coverage`, que también
  está sobre el fondo de página, y tiles negros sobre negro no se ven (§9.2). El
  seam que ya existía sigue emparejado con el `.faq` blanco, cuyo `padding-top`
  reserva la banda — ese par no se tocó.
  3 columnas desde **1200px, no 1024**: medido, a 1024 una pista da ~300px y cada
  párrafo pasa de 20 líneas. Sin links inline: de los términos que menciona
  (Objektschutz, Baustellenbewachung, Brandwache, Kaufhausdetektei, § 34a) solo
  existe `/werkschutz/`, y linkear uno mientras el resto da 404 es peor que
  ninguno. **Es una ganancia real de enlazado interno para cuando salgan las
  páginas de servicio.**

- **`/kontakt/` completado: 15/18 fragmentos del Webtext 25.** La tanda anterior
  decía "Kontakt idéntico" — eso se refería al diff doc-viejo↔doc-nuevo, **no** a
  que la página coincidiera con el doc; página↔doc nunca se había auditado. Lo
  que faltaba de verdad y ahora está: la **Highlight-Box entera** (nunca se
  construyó: el doc pide "3 Kacheln + Highlight-Box" y solo estaban las Kacheln),
  el **H2 de la §3** ("Schreiben Sie uns, wir melden uns innerhalb eines
  Werktages") y su **párrafo de intro**. El "Formulartitel" bajó a `<h3>`, que
  además es el anidado correcto (h1 → h2 → h3). Se borró un hint inventado que
  duplicaba la intro del doc y cuyo `id` era cableado muerto (ningún
  `aria-describedby` lo referenciaba).
  ⚠️ **Los 3 fragmentos que siguen faltando NO son un olvido, son decisiones del
  cliente, reconfirmadas el 2026-08-05 ("ninguno, quedó bien así"):** el "Rund um
  die Uhr erreichbar, an 365 Tagen im Jahr" del teléfono (repite el badge del
  hero), el "bei Angebotsanfragen inklusive kostenfreier Erstberatung" del e-mail
  (repite la subline), y el badge DEKRA (2026-08-04, la columna competía con el
  formulario). **No reponerlos "para completar el doc".**

- **`bayernhafen.png` borrado del working tree.** No lo referenciaba ningún
  markup, pero `build.js` copia `assets/` entero, así que seguía publicándose y
  era accesible por URL con la Freigabe nunca otorgada. Queda en el historial de
  git. El comentario de `page-service.css` que lo nombraba como ejemplo de
  wordmark ancho ahora dice DB Netze.

- **`alt` corregido en `/referenzen/`:** decía "SG Solar- & Elektrotechnik", el
  doc llama al cliente **"Dach & Solar SG"**.

- ⚠️ **CONFLICTO ABIERTO, necesita a Chris: Brose Bamberg y Bodo Freimuth
  Tiefbau.** El doc del 04.08 los sigue listando en las Kundenlisten, pero se
  quitaron el 2026-08-04 por instrucción del cliente. No se repusieron: puede ser
  que el doc quedó desactualizado o que la remoción fue un error. **Heltec
  Volley** es distinto y no hay que "arreglarlo": el doc lo escribe así, el arte
  del logo dice "HEITEC VOLLEYS" y la empresa real es HEITEC — el `alt` sigue la
  realidad, no el doc.

- **Lo que la auditoría confirmó bien** (medido, no asumido): FAQ visible ↔
  JSON-LD **11/11 idénticos en el homepage y 5/5 en `/werkschutz/`**; los 8
  `<title>` y meta-descriptions coinciden exacto con su doc; precio 26–32 en sus
  6 apariciones; Einsatzgebiete con Forchheim linkeado, Hof sin link y las 4
  menciones; WhatsApp correcto en las 9 páginas; Bayernhafen ausente del
  contenido. Dos falsas alarmas que conviene no repetir: `/sicherheitsdienst-hof/`
  y "Nuremberg" aparecen en las páginas alemanas **dentro de comentarios HTML**,
  no en contenido — buscar siempre con contexto antes de reportar.

⚠️ **PENDIENTE de la tanda anterior, ya cerrado:** la Sektion 12 y las 3 case
studies están construidas, así que `/referenzen/` ya no tiene links a 404.
>
> Son **49 documentos revisados + 3 nuevos** (`Webtext 50/51/52 Case Study …`).
> Lo importante del cambio: el doc del homepage ahora dice **"DESIGN FIRST:
> Struktur 1:1 nach Live-Entwurf (frankonia-website.vercel.app), Texte final"** —
> o sea, Chris reescribió el copy para que siga al sitio ya construido, no al
> revés. La estructura de las páginas hechas se confirma; lo que cambia es texto
> puntual. Magnitud medida por página (líneas cambiadas sobre el total):
> Homepage **MAYOR** · Referenzen **moderado (48 %)** · Werkschutz **menor (9 %)**
> · Jobs **menor (4 %, sólo el `<title>`)** · Kontakt **idéntico**.
> Los cambios de hecho (no de estilo) que ya están verificados contra el build:
> **el precio pasa a 26–32 €/Std. netto + Zuschläge** (hoy el sitio publica
> 25–40 en el homepage y 28–40 en `/werkschutz/`, en 6 lugares), **Bayernhafen
> sale de todo el sitio** (Freigabe; hoy aparece 7 veces entre `/referenzen/` y
> `/werkschutz/`), **Forchheim entra como ciudad enlazada** y Hof pasa a mención
> sin link, las **Ergebnis-Kacheln se anonimizan** y enlazan a 3 case studies
> nuevas, y el **WhatsApp real es `wa.me/491727866338`** (Steffen) — hoy
> `partials/whatsapp-button.html` tiene el número falso de placeholder.

**2026-08-03 — `/jobs/` built (`pages/jobs.html` → `/jobs/`), from the client's own
draft. Fifth finished page, and the only recruiting page on the site — which is why
it is also the only page that says "du".** Copy is
`content-de/2026-07-27 Webtext 29 Jobs.docx` (Stand 24.07.2026, "Entwurf für Review
(Dirk)"), verbatim, in German, including its own title (60 chars) and meta
description (151). It closes a real 404: `/jobs/` has been linked from every page's
footer since July, and the nav's "Karriere" item was an `href="#"` placeholder in
both `partials/header-de.html` and `partials/header.html` — both now point at the
real URL and carry `.site-nav__link`, so `initActiveNavLink()` can mark them.

- **Du-Ansprache, deliberately, and only here.** The draft is explicit
  ("Du-Ansprache bleibt — Recruiting-Kontext"). Every other page on the site says
  "Sie". Don't "fix" this one for consistency; it is the client's instruction for
  the recruiting context.
- **Structure is the draft's own six sections, plus a seventh for its internal
  links**: Hero ■ → Warum FRANKONIA als Arbeitgeber (4 cards) □ → Wen wir suchen
  (5 Qualifikations-Stufen) ■ → So läuft deine Bewerbung (3 Schritte) □ → FAQ □ →
  Bewerbungsformular ■ → Weiterlesen □ → footer. Six pixel seams, one per colour
  change. **Bewerbung and FAQ are one white area with NO seam between them** — same
  call as `/referenzen/`'s results + quotes pair: they are one chapter (how applying
  works, then the questions you have while deciding), and a seam between two white
  sections would dissolve white on white. That also means the parity works out with
  the form panel, which is always dark.
- **Reuses the chassis, adds almost nothing.** `css/page-jobs.css` is ~430 lines and
  only holds this page's four blocks; everything structural comes from
  `css/page-service.css` (the `--content-inset` rule on both sides, the oversized
  `main h2`, the breadcrumb chevron, `.section--light`'s token re-declaration,
  `.service-hero*`, `.service-link`, `.service-related*`, the whole `.pixel-seam`
  block) and the form from `css/lead-form.css`. Motion stack is the documented one
  (`docs/page-conventions.md` §4.1) with the hero opting into `hero-reveal.js` via
  `data-hero-reveal` + the `.hero__lead`/`.hero__reassurance`/`.hero__actions`/
  `.hero__trust` class names, so there is no per-page JS at all.
- **The hero has no phone CTA and no badge, both on instruction, not by omission.**
  The phone is the draft's own call ("kein Telefon-CTA: Bewerbungen laufen über die
  Seite") — the number is still in the header, the footer and the WhatsApp button.
  The badge ("Übertarifliche Bezahlung, festes Team statt Springer-Dasein") was
  dropped to follow the client's same-day removal of the equivalent chip from
  `/werkschutz/`'s hero, whose stated reason applies verbatim here: it was a third
  element on one screen making the same claim, and it pushed the H1 down. Both
  halves of that copy survive on the page (subline + first tick, and the fourth
  Arbeitgeber card). Its CSS was not left behind as a dead rule.
  The trust band is the two real DEKRA seals and no Google rating: the third hero
  tick claims a "zertifizierter Arbeitgeber" and the seals are that claim's
  evidence, while the customer rating belongs on the B2B pages.
- **The hero is a FULL-BLEED BACKGROUND PHOTO, rebuilt the same day** (client: "el
  background va a ser la foto esa", `HeroKarriere.png` from ~/Downloads — two
  FRANKONIA guards on a Bamberg street beside the branded car). It started as the
  service template's two-column copy | portrait layout with the homepage's
  team-briefing shot; that column is gone and the copy column is now the whole
  hero. `system-reliable-teams.*` stays in the project, the homepage still uses it.
  - Exported to `assets/images/jobs-hero-{768,1280,1376}.webp` + a 1376 JPEG
    fallback (82/171/193KB WebP, 221KB JPEG at q90/88). That is the same
    documented-exception territory as the homepage hero (~222KB) — it is the LCP
    element here, preloaded + eager + fetchpriority, with `imagesrcset`/
    `imagesizes` repeating the `<picture>`'s own srcset/sizes so the preload and
    the `<img>` pick the same candidate. **The source is only 1376×768**, so above
    ~1400px it upscales; ask the client for the original if that shows.
  - **Everything measured for this hero in the service template still applies and
    is not overridden**: the H1's 52px clamp, the lede's 32rem measure, the 18px
    ticks, the 2.75rem seals, `min-height: calc(100svh - 8rem)`. Only the layout
    changed — `.jobs-hero__grid` is one column at every width and the content is
    capped at 38rem so the copy does not stretch across the photo.
  - **The photo deliberately does NOT bleed up behind the header**, unlike the
    homepage's: on an interior page the breadcrumb sits between them
    (docs/page-conventions.md §8.2), and pushing the image under a transparent
    header would put the nav over a bright street scene. The header keeps the
    page's own black.
  - **Two washes, both on a pseudo-element and never on the `<img>`**: a left-side
    fade on desktop (clearing to fully transparent at 62 %, so the guards and the
    car stay untouched) plus a short bottom fade that blends the hero into the
    black page below; on a phone the copy sits over the whole photo, so the wash
    runs vertically instead, as a multi-stop ramp rather than a flat tint —
    LIGHTEST at the top under the 34px H1 and heaviest under the 15px ticks. The
    first attempt had that backwards (0.82 at the top easing to 0.72 mid-hero),
    which both flattened the image and helped the wrong text. `object-position:
    65% center` keeps the two guards in frame when `cover` crops hard on a phone.
  - `background-color: var(--color-bg)` on the section: if the photo fails or
    before it arrives, the hero is still black with white text, so the copy never
    depends on the image.
  - **Two dead selectors deleted in the same pass**, found while touching this
    block: the phone rules `.jobs-hero__actions .btn` and `.jobs-hero__trust`
    named classes that never existed in the markup (it carries the
    `.service-hero__*` names), so they described behaviour they never produced —
    page-service.css's own mobile rules were doing that work all along.
- **"Wen wir suchen" is a ladder, not five cards.** The draft calls them "5
  Zielgruppen-Karten", but they are five rungs of one §34a path (Quereinsteiger →
  Unterrichtung → Sachkunde → GSSK → Fachkraft/Meister) and a visitor is looking
  for the single rung they are standing on: five symmetric cards make that a
  search, a numbered `<ol>` on hairlines makes it a scan. Left column = where you
  are, right = what it opens up, which is also the phone reading order once it
  stacks. The visible 01–05 are `aria-hidden` (the `<ol>` already numbers itself).
  The section's one link is the draft's own §34a Zubringer, on the Quereinsteiger
  rung.
- **The application form is the shared lead form with a different field list**, per
  the draft: no Firma (it is a person, not a company), a required Telefon, a
  `Qualifikation` `<select>` whose five options are the five rungs above, an
  optional CV upload (so the `<form>` carries `enctype="multipart/form-data"`), and
  **no "Lieber direkt sprechen?" phone line under the submit** — same instruction as
  the hero. Two field types the site had never styled: `components.css` styles
  `.form-field__select` for dark surfaces and `lead-form.css` only re-styles
  input/textarea, so both got the same underline treatment scoped under
  `.jobs-form`, plus `color-scheme: light` on the form (tokens.css sets `dark` on
  `:root`, which would have made the dropdown list and the file button dark inside a
  white card). The native select caret is kept on purpose — replacing it means a
  hardcoded chevron data-URI that cannot follow `currentColor`. All of that is now
  written into `docs/page-conventions.md` §6, since the next form with a select
  should not rediscover it.
- **2026-08-05 — the hero now matches the HOMEPAGE hero's format, same copy**
  (client: "el formato como la hero del homepage… los DEKRA badges como en la hero
  de la home, lo mismo con los tamaños, los tics, que sean así en fila").
  Measuring both heroes side by side first was what made this quick: the H1 (52px),
  lede (20px / 0.82 white / 32rem), tick icons (18px blue) and DEKRA seals (44px,
  16px gap) were **already identical** — the differences were structural, not
  dimensional.
  - **Order fixed to the homepage's**: H1 → lede → **CTA** → **ticks** → trust band.
    The ticks used to sit between the lede and the button, which is also why
    js/hero-reveal.js (it animates `.hero__lead` → `.hero__actions` →
    `.hero__reassurance` → `.hero__trust`, in that order) was revealing them out of
    DOM order. Fixed for free by the reorder.
  - **The trust band is the homepage's, not seals-only**: the Google rating pill
    (`.review-card--sm`, 4,7 / 97 — the one client-confirmed number on the site)
    with the two DEKRA seals beside it. It shipped seals-only on the reasoning that
    a customer rating belongs on the B2B pages; the client asked for the homepage's
    band, and this hero's third tick claims "zertifizierter Arbeitgeber", so the
    rating is not a stretch here either.
  - **The ticks are a stacked LIST, one per line** — and the two-step story is worth
    keeping, because it is a measurement that decided a design question. They first
    went to one row, the homepage's format, which needed the copy column at 67rem:
    the homepage's three ticks are short chips using 625px of its 704px column, while
    this page's three are the draft's full sentences and need **1066px measured at
    the same type size**, so "in a row" and "same sizes" could not both hold inside
    the homepage's own column. Shown that, the client chose the list ("mejor los tics
    ponelos en una lista en vez de una línea"), so the column came back to the
    homepage's 44rem and the row became a column.
    It is a **page-scoped override**: `.service-hero__points` in page-service.css is
    a wrapping row now (the same homepage-format pass was applied to the service
    template), and /werkschutz/'s ticks are short enough that a row reads well there.
    `align-items: flex-start` matters — the shared rule centres its items for the row
    layout, which in a column would centre them horizontally.
    The H1 keeps its own 38rem measure so the two-line break in the client's
    reference screenshot survives; the lede stays at 32rem.
  - **The readability wash follows the copy's width**, and moved twice with it: 62% →
    80% for the 1072px one-row layout (whose third tick was landing on unwashed photo
    right where the white car starts, the brightest thing in the frame) → **66%** now
    that the list is 704px wide and the content ends at ~56% of a 1440px viewport.
    The photo keeps its right two-thirds untouched, which is the point of a
    side-fade rather than a flat tint.
  - Measured after: no horizontal overflow at 320 / 360 / 390 / 430 / 768 / 1024 /
    1280 / 1440 / 1600.
- **2026-08-05 — the three steps now PLAY as one sequence, and the markers are
  brand blue** (client: "aparece el 1, después la rayita se va formando hacia el
  dos (que aparece ahí) y después rayita nuevamente y el 3 […] después abajo van
  apareciendo" + "los números son fondo azul (como el CTA y con el efecto) y el
  número blanco"). New `js/jobs-steps.js`, its own `<script defer>` like
  service-flow.js — page-specific, not a shared primitive.
  - **SCRUBBED to the scroll** (client, same day, second pass: "está perfecto pero
    tiene que aparecer con el scroll, onda relacionado al scroll"). It first shipped
    as a timeline that played itself once on entry, on the reasoning that a sequence
    with its own internal order should not hand that order to how fast the visitor
    happens to scroll. **That reasoning is superseded — the client's call stands, and
    the choreography survived it unchanged.** `start: "top 88%"`, `end: "top 38%"`,
    `scrub: 0.7`, no `once`, so it also un-draws when you scroll back up, like every
    other reveal on this page.
    Two values are load-bearing, and neither is decoration: the **range is half a
    viewport** (450px measured at 1440×900, 422px at 390×844) so the rail has real
    distance to draw across instead of completing in the first flick; and
    **`scrub: 0.7` is a smoothing lag, not a delay** — on a fast flick the timeline
    eases toward the scroll position over 0,7s rather than snapping to it, which is
    what keeps the numbers landing one after another. That was the whole worry about
    scrubbing this section, and it is what answers it.
  - **One beat per step: the marker and ITS OWN copy together** (client, third
    pass: "quiero que los textos aparezcan con su número correspondiente en vez de
    aparecer al final… aparece el 1 y debajo ya el texto también"). The copy was one
    staggered block queued after the whole rail; now each step owns its own, so a
    step is finished before the rail moves on — and the visitor reads step 1 while
    step 2 is still drawing instead of watching three empty markers first. The copy
    starts 0,3s before its marker has settled and the connector starts 0,22s before
    the copy has, so the whole thing is one continuous movement rather than nine
    queued beats. 2,66s of timeline over the same 450px of scroll.
    Measured by seeking the timeline and reading computed opacity per element:
    12 % → 1 + its text arriving · 22 % → step 1 complete, no line yet · 33 % → line
    1 drawn · 45 % → 2 + its text arriving · 55 % → step 2 complete · 68 % → line 2
    at 90 % · 80 % → 3 + its text arriving · 100 % → all of it. (Driving it by scroll
    needs Lenis, not `window.scrollTo` — see "Measuring" below.)
  - **The connector is blue** (client, same pass), `--color-blue-light`: the same
    blue as the markers it joins and as every blue button on the site — deliberately
    NOT the on-white blue-dark that docs/page-conventions.md §5 prescribes for blue
    *content* on a light section. Matching the markers is the entire point of it
    being blue, and this line is decoration reinforcing an order the `<ol>` and the
    numerals already carry, so nothing depends on reading it. Both the rule and this
    exception are annotated at the rule in page-jobs.css.
  - **The connector is a pseudo-element, so it is animated through a CUSTOM
    PROPERTY**: GSAP writes `--step-line` on the step, and
    `.jobs-steps__item::before` consumes it as `scaleX()` on desktop and
    `scaleY()` on a phone. One value, two axes, one timeline, no branching in the
    script — the same sequence draws the horizontal rail at ≥768px and the vertical
    one below it. It defaults to `1` in the CSS, so **a fully drawn line is the
    no-JS state** — verified with the scripts stripped, and under reduced motion
    (script bails, every number at opacity 1, no inline `--step-line`, connector at
    scale 1).
  - The list dropped `data-item-reveal` and gained `data-no-text-reveal`. Both
    matter: the cascade is what this replaces, and text-reveal only skips a subtree
    automatically when it sits inside `[data-reveal]`/`[data-item-reveal]` — without
    the opt-out it would have animated the same h3/p a second time. Two timelines on
    one element is what makes a reveal look broken.
  - **Markers**: solid `--color-blue-light` (#3D9AD3, the resting fill of every blue
    button on the site) with a white numeral at weight 500, plus the CTA's own shine
    sweep — reusing `@keyframes btn-shine` from components.css rather than a second
    copy of the geometry, so motion.css's reduced-motion override already covers it.
    Contrast is the documented, client-approved brand-button caveat (3,1:1), and it
    is weaker here than on a button: the glyph is `aria-hidden` decoration repeating
    the `<ol>`'s own numbering, so no information depends on reading it.
  - ⚠️ **Bug caught by reading computed styles, not by looking at the page:** the
    marker used to follow its section's background so it could cover the connector
    hairline, which needed a `.section--light .jobs-steps__number { background:
    white }` override. When it became solid blue that override was still in the file
    and silently won — white pill, white numeral, an invisible marker. Deleted. The
    rule for the next panel is in page-jobs.css: a surface that follows its section
    needs a per-section override, one with its own brand colour must not have one,
    and when you change which it is, go delete the other.
- **2026-08-05 — no section eyebrows on this page, and the Bewerbung section is
  centred** (client: "en karriere centrame esta sección y saca todos los
  eyebrows").
  - **All five eyebrows removed from the markup**, not hidden: ARBEITGEBER,
    EINSTIEG, BEWERBUNG, FAQ, WEITERLESEN. Every section now opens on its H2. They
    were UI furniture written for the build, never client copy, so nothing the
    draft supplies left the page. The `.jobs-faq .section-eyebrow` centring rule
    went with them rather than being kept for a comeback — git has it.
    **This makes /jobs/ the one page without eyebrows**: the homepage,
    `/werkschutz/`, `/referenzen/` and `/kontakt/` all still have them, and
    docs/page-conventions.md still lists them as part of a section's anatomy.
    Worth one question to the client whether this should go sitewide before the
    next page is built; not applied elsewhere unilaterally.
  - **"In drei Schritten zu deinem neuen Job" is centred** from 768px up: heading
    centred (same treatment as this page's FAQ, so the two centred sections read as
    one decision), the three numbers on one centred line joined by a hairline, and
    each step's copy centred under its own number at a 22rem measure — centred text
    wants a narrower column than the same copy ranged left.
    The connector is still drawn per step with `:not(:last-child)`, so it only ever
    exists BETWEEN two numbers. That fixes something the left-aligned version had
    wrong on its own terms: a rule used to run rightwards off the third step with
    nothing after it. Both ends come from the item's own box
    (`left: calc(50% + 1.75rem)`, `right: calc(-1 * (var(--space-7) + 50% -
    1.75rem))`), so it lands correctly at any column width without knowing the
    row's.
    **On a phone it stays left-aligned** — heading centred, rail vertical, copy
    ranged left: three or four lines of centred German in a 350px column is harder
    to read than the same copy left-aligned, and the vertical rail from the mobile
    pass already reads as a sequence.
  - Page height at 390px went 9.146 → 8.910px with the eyebrows gone.
- **2026-08-04 — strategic mobile pass over the whole page** (client: "pasame la
  sección de KARRIERE estratégicamente adaptada a mobile"). Same brief as the
  homepage's own pass: experience parity, not visual parity, and redesign a
  section's layout where that is what it takes. Measured first, at a real 390px
  viewport: **11.287px, 13,4 screens** — and 1.560px of that was section padding
  with nothing in it. Result: **9.146px, 10,8 screens (−19 %)**, without cutting a
  single word of copy. Every change is inside a `max-width` query, so the desktop
  composition is untouched — re-probed at 768 / 1024 / 1440 to confirm (strip
  gone, grid back, desktop seam padding restored).
  - **The four Arbeitgeber cards are the shared SWIPE STRIP below 768px, not a
    stack** (2462px → **981px**, the single biggest win). `data-swipe-carousel` +
    `css/swipe-carousel.css` / `js/swipe-carousel.js` — the module the other
    session extracted 2026-08-04 from the homepage's six System cards, which now
    also drives its Social reel and the References testimonials. One card at 86vw
    with the next peeking, native scroll-snap, injected "01 / 04" counter and
    progress line. The card keeps its whole anatomy (photo → icon → title → copy);
    only the frame goes 4:3 → 3:2 so the card plus counter plus line fit one
    screen. All four cards stay real DOM, so nothing left the crawler's reach, and
    the strip's horizontal scroll is **contained** — the document never scrolls
    sideways (verified: `strip.scrollWidth` 1431 vs `clientWidth` 390 while
    `documentElement.scrollWidth === innerWidth`).
    ⚠️ **Measured trap worth remembering:** `height: 100%` — the rule that makes
    these cards equal in the desktop grid — is exactly what breaks them in the
    flex strip (448/426/426/426). A percentage cross-size against an auto-height
    flex container resolves before `align-items: stretch` can apply. In the strip
    it is `height: auto` + a two-level `align-items: stretch`. Two-level because
    swipe-carousel.css loads last, by design.
  - **The page's own rhythm on a phone**, scoped to a new `<body class="page-jobs">`
    (same pattern as `/kontakt/`) because the rules being overridden live in the
    shared page-service.css: seam band 120 → 80px, `.section` padding 96 → 64px,
    and the post-seam reservation 216 → 144px. **The band height and the
    reservation must stay equal** — js/pixel-transition.js fills the band it is
    given, so a smaller reservation would put tiles over real content. 80px still
    gives the dissolve ~3 rows of tiles, the same as the homepage's mobile band.
  - **The three application steps became a vertical rail** (1004 → 833px). On
    desktop the numbers sit on a horizontal rule and that rule is what makes three
    blocks read as one sequence; stacked on a phone they had become three
    separately-bordered blocks 48px apart. Now the number moves out to the left and
    each step draws the segment down to the next — `:not(:last-child)` only, so the
    line ends AT the third number and needs no knowledge of how tall the last
    step's copy is.
  - Ladder rungs and the two link groups tightened (padding/gaps only, no copy).
  - **Two real touch-target misses fixed**, both found by measuring rather than
    looking: the §34a link in the ladder wraps to two lines, and as an inline-FLEX
    box that parked its arrow against the right edge, vertically centred between
    the lines — `display: inline` puts the arrow back after the last word and the
    hairline then draws under both fragments. And the one single-line FAQ
    `<summary>` ("Wo werde ich eingesetzt?") measured 33px against the 44px
    minimum, so the summary row now carries `min-height: 44px` (the other four are
    two-line and already clear it).
  - What deliberately did NOT get compressed: the **lead form** (1460px). It is the
    page's primary action and keeps the generous end of every trade-off, exactly as
    the homepage's mobile pass decided for its own form.
  - Still 320px-clean (9819px there, no overflow). Remaining under-44 items are the
    three shared, already-documented ones: the breadcrumb link, the honeypot input
    and the deliberate 22px consent checkbox.
- **"Warum FRANKONIA als Arbeitgeber" was rebuilt as photo cards, same day**
  (client: the row of text columns "feels too flat and corporate" for a recruiting
  page). Each of the four benefits is now a vertical editorial card — photo (4:3) →
  small blue line icon → title → **the same body copy, not one word rewritten or
  shortened**. Four across from 1200px, two from 640px, one below that, all four
  always the same height (grid `stretch` + `height: 100%`, no fixed heights
  anywhere) and the same structure.
  - Restrained per the brief, and that is what keeps it off the generic-SaaS-card
    path: one hairline border, `--radius-md`, **no shadow, no fill** (the card is
    the section's own white), no gradient or overlay on the photos and no text over
    them. The only other line is the same hairline under each photo. Padding is
    `--space-5` (24px), inside the brief's 24–28px and a real token.
  - **Photos are the client's own 2022 studio shoot**, named per card in the brief
    (`Frankonia_Sicherheitsdienst_02_05_22_063/156/040/137-a_prev.jpg` from
    ~/Downloads), cropped 3:2 → 4:3 and exported as
    `assets/images/jobs-why-{bezahlung,dienstplan,erreichbar,objekte}` at 640/960w
    WebP plus a 960 JPEG fallback (9–30KB WebP, 32–58KB JPEG). The crop is CENTRED
    and was checked photo by photo: every face, the clipboard, the radio and the
    raised hand survive it. They are studio shots on white, which is why the frame
    carries `--color-bg-subtle` — it reserves the space (no CLS) and the image
    still reads as a photo panel against the white card.
  - **Two breakpoints are measured, not conventional, and the comments in
    page-jobs.css carry the numbers.** (1) The four-up row starts at **1200px, not
    this project's usual 1024px**: the card's height comes from its copy, so
    narrower columns mean a taller text block and a thinner photo — four columns at
    1024px gave a 145px photo in a 508px card, a 28 % strip against the brief's
    ~45–50 %. 1024–1199px stays two-up (62–68 %). (2) The single-column band is
    capped at `30rem` and centred, because at a 639px viewport one column was 597px
    wide and the photo 73 % of the card. Final shares: 47–68 % on phones, 47–51 %
    at 640–768, 62–68 % at 1024–1199, 37 % → 50 % from 1200 → 1600, with **47 % at
    1440**, the width this project measures at.
  - **Known, documented trade-off:** in the 1200–1300 band the share sits a few
    points under the target. Reaching 45 % there needs a square-to-portrait photo,
    and the brief also asks for one shared 4:3 ratio; ratio consistency won. The
    lever, if that ever flips, is `aspect-ratio` inside that media query — not a
    different column count.
  - Phones use 3:2 instead of 4:3 (the brief's "keep the image ratio controlled on
    mobile"): a full-width 4:3 frame is 262px tall at 390px and ran the section to
    nearly two screens. `object-fit: cover` just keeps a little less height of the
    same centred crop, so no subject is lost and all four cards still share one
    ratio.
- **The FAQ uses the HOMEPAGE's treatment, not the shared one** (client, same day:
  "que tenga el mismo diseño que la sección de FAQs en la homepage"). That look —
  centred heading, two columns from 768px, filled pill cards with no border, and
  the "+" glyph moved to the LEFT of each question — lives in `.faq` in
  page-home.css, which no other page loads, so it is mirrored verbatim under
  `.jobs-faq` in page-jobs.css: same radius, padding, 5%-grey fill, 64rem measure
  and on-white answer alpha. **One decision in two page-scoped files now — keep
  them in sync, same situation as the `main h2` clamp.** If a third page asks for
  it, promote it to a `.faq--cards` modifier in components.css instead of copying
  it a third time; that rule is written into docs/page-conventions.md §3, which now
  documents both FAQ looks and when to use which.
  Two deliberate differences from the homepage: this section keeps its eyebrow
  (centred via the `justify-content` gotcha — every section on this page has one,
  the homepage's FAQ has none), and it does NOT get the homepage's closing
  `.faq__cta` button, because the application form is the very next section and
  that would be the same action twice, 200px apart.
- **Shared bug found and fixed while building this page** (`css/page-service.css`,
  so it also fixes `/werkschutz/` and `/referenzen/`): `.service-link__arrow` and
  `.service-related__arrow` computed to `fill: black; stroke: none`, because
  `#icon-arrow-diagonal`'s fill/stroke live on the sprite's `<g id="icon-defs">`
  wrapper and that does not survive `<use>`. Every one of those arrows was a filled
  sliver — invisible on a dark section, a small black smudge on a light one. Both
  rules now set `fill: none; stroke: currentColor`, the same belt-and-suspenders
  `.btn__arrow` and `.services__item-arrow` already had for exactly this reason.
- **One new sprite symbol**, `#icon-euro` (a euro coin) for the "Bezahlung, die
  ankommt" card, on the same 24px grid and 1.5 stroke as the rest — in the sprite,
  not inlined. The other three cards reuse `#icon-calendar`, `#icon-clock` and
  `#icon-building`.
- **Measured, not eyeballed** (Chrome headless + a fixed-width iframe under forced
  `prefers-reduced-motion`, see "Measuring mobile"): no horizontal scroll at **320 /
  360 / 390 / 430 / 768 / 1024 / 1440px** — 320 included, better than the homepage's
  own known limit. Page height 10010px at 390, 7850px at 1440. Touch targets ≥44px
  except three pre-existing shared cases, all identical on the other pages: the
  breadcrumb link (16px), the FAQ `<summary>` (34–40px) and the deliberate 22px
  consent checkbox. The FAQ answer's inline link needed `padding-block: 0.65rem` on
  an `inline-block` to clear 44 (0.5rem measured 42). Also measured and fixed: the
  hero preload originally named one fixed WebP, which made the browser fetch 751w
  and then load 640w for the real `<img>` at DPR 1 — it now repeats the
  `<picture>`'s own `srcset`/`sizes` via `imagesrcset`/`imagesizes`.
- **Known gaps, all client-side:**
  - **No `JobPosting` schema**, which the draft asks for "je offener Stelle,
    gepflegt!". There is no vacancy list — no titles, no `datePosted`, no
    `validThrough`, no per-role location — and Google requires those; inventing them
    would be worse than emitting nothing (stale/incorrect job markup gets the domain
    demoted). The graph is `Organization` + `LocalBusiness` + `FAQPage` +
    `BreadcrumbList`, and the FAQ mirrors the visible five 1:1. When real vacancies
    exist, each is one more node.
  - **The form submits nowhere** (`action="#"`, native validation only), same as
    every page — and here that includes the **CV upload**: the field validates and
    goes nowhere until there is a backend. Checklist Paso 4.
  - Four real internal links to pages not built yet
    (`/ratgeber/paragraph-34a-erklaert/`, `/ratgeber/`, `/ueber-uns/`,
    `/leistungen/`). `/referenzen/` is the one link in the closing section not named
    in the draft — added because it is live and it is the evidence behind
    "zukunftssicherer Job bei einem zertifizierten Arbeitgeber".
  - Written for this build, not supplied: the section eyebrows, the two Weiterlesen
    column titles and link labels, and the CV field's "PDF oder Word" hint (the
    draft names the fields, not their labels).
- **Not visually verified in a real browser** — standing caveat. Everything above is
  headless measurement plus screenshots (which do confirm the hero, the light
  sections' token flip, the ladder, the step rule, and the form's select + file
  chip). The one thing a headless shot can't confirm is the header's light/dark
  switch over this page's **four** white sections, since it needs real scroll
  events: worth the `npm run dev` look.
- **Built while another session was editing the same repo** — `css/page-service.css`
  (the hero badge removal), `css/lead-form.css` and `docs/page-conventions.md` all
  changed mid-build. That is why this entry documents the badge decision explicitly
  rather than as a silent match; if two entries in this file ever disagree about the
  service hero, the code wins and this file gets corrected.

> **PARTIALLY REVERSED 2026-08-04 (client): the six CARDS are back to their
> pre-2026-08-03 copy — short one-line titles + a 3-item bullet list each, not
> the draft's long titles + two-sentence paragraph.** Client asked for both, in
> two messages ("en qué momento me cambiaste los bullets… dejalos como estaban
> antes", then "los títulos también… eran todos de una sola línea"). Restored
> verbatim from git, not rewritten. **This means the homepage no longer carries
> `Webtext 01 Homepage.docx` Sektion 4's per-card copy** — the H2, the eyebrow
> and everything else in the entry below are unchanged and still the draft's.
> Three CSS values came back with them, each having been changed *only* to fit
> the long copy: `.system-story__title`'s cap (1.5rem → **1.7rem**), the card's
> bottom readability gradient (back to `0 → 42%, 0.35 → 62%, 0.78 → 100%`), and
> the `.system-story--enhanced .system-story__title` clamp, which was **deleted**
> — it existed purely to keep a 54-character title at two lines. Measured after,
> at 1440 in the real pinned state (CDP, real frames): all six titles are ONE
> line at 27.2px, and at 390 the carousel is one line at 18.4px with no
> **The stack geometry came back too, in a follow-up the same day** (client saw
> the airier result: "las cards de arriba (4,5,6) estaban más pegadas a las
> otras, quedó mucho espacio"). `--sys-stack-peek` 7.75rem → **5.75rem**, so the
> visible peek strip is **76px** again instead of 108px, and
> `--sys-stack-card-h` gained the same 2rem (`100svh - 23.75rem` →
> `100svh - 21.75rem`) to hold the invariant. `--sys-stack-top` did NOT move —
> 1.75rem of it belongs to the eyebrow, which is still on the page, which is why
> the sum is 22rem and not the pre-August 22.25rem.
> **The relationship, now written into the CSS itself** so it stops being
> rediscovered: the back row sits at `top + 1rem` and the front row at
> `top + peek`, so the visible strip is `peek - 1rem` and ONLY the peek controls
> it; `card-h` is always `100svh - (sum - 0.25rem)`. Verified after the change at
> 1024 / 1280 / 1440 / 1728: peek exactly 76px and the front row bottoming at
> `100svh + 4px` at every one (at 1728 the 34rem cap takes over, as designed).
> **One measured tight spot, checked visually and accepted:** below 1440 the
> short titles still wrap to two lines (the base clamp maxes at 1.7rem while the
> 28%-wide card keeps growing), and at 1152 the longest one's line-BOX overlaps
> the front card by 2px. A crop at that width confirms no glyph is cut — it is
> empty leading. Clearance is 1–30px at 1024 / 1280. This is the same geometry
> the section shipped with before 2026-08-03, not a new risk.
>
> `.system-story__desc` is unused again (as it was before 2026-08-03). Its rule
> and its `.is-behind` selector are kept, same reason the list rule was kept
> through the paragraph pass — this section has now swapped formats twice.

**2026-08-03 — homepage "Unser System" (`#our-system`, `.system-story`) now
carries the client draft's own Sektion 4 copy, verbatim.** The stacked-card
component itself is untouched in mechanism (desktop peek-stack + mobile swipe
carousel, `js/system-story.js` / `js/system-carousel.js`); what changed is the
content it holds and the geometry that content needs.

- **Copy** is `content-de/2026-07-27 Webtext 01 Homepage.docx` Sektion 4 ("Die 6
  Value-Pillars", Stand 24.07.2026): the H2 **"Weniger Aufwand, mehr Sicherheit,
  durch ein klar definiertes System"** plus, per card, the draft's full title and
  its two sentences. It replaces the shorter July titles + 3-bullet lists (git
  has them) — same six points, same order, same photos, stated in full. The 6
  draft items map 1:1 onto the 6 existing photos, no reordering.
  `.system-story__points` → `.system-story__desc` in the markup; the CSS rule for
  the list is deliberately kept (a card may carry one again), and `.is-behind`
  now hides both.
- **The section carries an eyebrow, "Unser System" — and it is the only one on
  the homepage.** Not decoration: it is the destination label for the nav item of
  the same name. Replacing the old H2 ("So funktioniert unser System.") with the
  draft's took away the one thing on that screen that matched what the visitor
  clicked, and the client reported exactly that — "me voy a la sección de la home
  que dice Weniger Aufwand, mehr Sicherheit…". The draft's own kicker for this
  section ("WARUM FRANKONIA") is still NOT used, for the same reason: it would
  not match the nav label either.
  `.system-story__eyebrow` already existed in the stylesheet but had never been
  rendered, and its colour was wrong for the section it lives on —
  `--sys-color-accent` is `--color-blue-light`, ~2.6:1 on white. It uses the
  on-light `--sys-color-accent-ink` now, the same substitution the mobile counter
  in this file already documents.
  Still no CTA here: the draft doesn't ask for one in this section, and the
  Sicherheitskonzept section directly above already ends on the primary CTA.
- **Three geometry changes, each forced by a measurement, not taste** (Chrome
  headless, the section rendered in its pinned state; see "Measuring mobile"):
  - `--sys-stack-top` 16.5rem → **16.25rem** and `--sys-stack-peek` 5.75rem →
    **7.75rem**. Two things move here and they are not independent: the SPLIT
    between them sets how much of the behind card peeks out (76px → **108px**,
    which is what a two-line title needs), and their SUM sets where the front row
    starts, which `--sys-stack-card-h` subtracts from `100svh` so the front row
    always bottoms out at `100svh + 4px`. The sum went 22.25rem → **24rem** when
    the eyebrow was added, and `--sys-stack-card-h` went `100svh - 22rem` →
    `100svh - 23.75rem` in the same edit. **Change one, change the other** — a
    sum raised without the card height following clips the cards' bottom-anchored
    copy off the fold.
  - `.system-story__title` capped **1.7rem → 1.5rem**, and the enhanced layout
    gets its own `clamp(1.15rem, 0.31rem + 1.32vw, 1.5rem)`. The base clamp hit
    its cap at ~1000px and then stayed flat while the 28%-wide card kept growing,
    so at 1024/1280 the longest title ("1. Begeisterte Besucher durch
    professionelles Auftreten", 54 chars vs the old 28) ran to three lines and its
    last line sat *under* the front card. Verified at 1024 / 1152 / 1280 / 1440 /
    1728: worst title bottom 68–89px, all inside the 100px peek.
  - The card's bottom readability gradient starts higher and ends darker
    (`0 → 32%, 0.45 → 58%, 0.85 → 100%`). A five-line paragraph reaches further up
    the photo than a 3-item bullet list did, and its first lines were landing at
    ~0.3 opacity over the bright half of an image.
- **H2 wrap**: `max-width: 30ch` + `text-wrap: balance` (both the base and the
  enhanced copy of the rule). 20ch was fitted to the old 28-character heading; the
  draft's 67-character one fell to four lines and ran into the card stack. It now
  breaks at its own second comma. The intro's top padding went 7rem → 6rem →
  **5.5rem** as the band gained first a second title line and then the eyebrow.
  **5.5rem = 88px is the floor, not a round number**: the sticky header measures
  80px and the stage is pinned at `top: 0`, so anything less puts the eyebrow
  under it. Measured, not assumed.
- **Measured, not eyeballed**: no horizontal scroll at 360 / 390 / 430 / 768 /
  1024 / 1152 / 1280 / 1440 / 1728. The mobile carousel and the 768–1023 vertical
  layout were both checked with real copy — title two lines, description four,
  nothing clipped. The front cards' description bottom is `100svh − 28px` by
  construction, so it cannot fall below the fold on a short viewport.
- **`pages/en/index.html` was left alone** — it still holds the July English copy
  for this section. The German homepage is the live one; per this file's own
  content-language rule the English variant is not kept in lockstep string by
  string.
- **The "Unser System" nav item is GONE (client, end of the same day) — but the
  work it forced is still in the code and still worth knowing.** It was the only
  item in that nav that wasn't a page; it is removed from `header-de.html` and
  `header-en.html`. The section keeps its `id="our-system"`, so `/#our-system`
  remains a valid deep link (campaign, external link) and everything below still
  applies to it. If the item ever comes back, treat it as a fresh request — it
  needs either a real page or this anchor behaviour, not a one-line restore.
  The three bugs it surfaced, in order, all client-reported the same day:
  - `href="#"` — goes nowhere by definition. Became `/#our-system` (absolute path
    + fragment; a bare `#id` in a shared partial only resolves on the page that
    owns the id). `initActiveNavLink()` already skips any href with a `#`, so it
    correctly never marked itself current.
  - Clicking it then landed at the section's own top, which is `start: "top top"`
    on a scrubbed timeline = progress 0 = the deliberately empty stage. Client:
    "me lleva acá dentro de la home, wtf". Fixed with a **new generic hook** that
    is still in place and available to any anchor:
    `js/smooth-scroll.js`'s `scrollToHash()` now reads `data-scroll-offset` (px)
    off the hash target and passes it to `lenis.scrollTo`. `js/system-story.js`
    sets that attribute to the scroll position where the BACK ROW has finished
    entering, computed from the live timeline (`settleP[2] × (st.end − st.start)`),
    recomputed on every ScrollTrigger refresh, and **removed on matchMedia exit** —
    so mobile, reduced motion and no-JS all keep landing on the element's own
    top, which is right for the plain list/carousel. Any other anchor without the
    attribute behaves exactly as before.
  - **Verified in a real browser this time**, not by reasoning: a CDP-driven
    headless Chrome (real frames, not `--virtual-time-budget`, which cannot
    settle Lenis) clicked the actual nav link and read back scrollY 0 → 7796,
    section top at −1715, card opacities `[1,1,1,0.44,0,0]`. The deep-link path
    (arriving at `/#our-system` from another page) lands identically — that path
    is the one that still matters now that the nav item is gone. Both candidate
    landing points were rendered and compared before picking this one.
    **One measuring lesson worth keeping**: the first click test used the URL
    `/index.html`, where `location.pathname` doesn't match the link's `/`, so
    smooth-scroll's click handler bailed and the browser did a full navigation —
    the test passed while never exercising the click-intercept path at all. Test
    same-page anchor behaviour from the URL the visitor actually has.
- **Not verified in a real browser**, same standing caveat: the GSAP entrance now
  eases in one paragraph per card instead of a bullet stagger (`js/system-story.js`
  queries `.system-story__desc`), and that timing is worth one `npm run dev` look.

**2026-08-03 — `/referenzen/` built (`pages/referenzen.html` → `/referenzen/`),
from the client's own draft. Fourth finished page, and the first that is neither a
service page nor `/kontakt/`.** Copy is
`content-de/2026-07-27 Webtext 27 Referenzen.docx` (Stand 24.07.2026, "Entwurf für
Review (Dirk)"), verbatim, in German — including the draft's own title (52 chars)
and meta description (147). It closes a 404 that was already live: both
`partials/header-de.html` and `partials/footer-de.html` have linked `/referenzen/`
on every page for weeks.

- **Structure is the draft's own six sections**, in its order: Hero → Ergebnis-
  Kacheln → Kundenstimmen → Kundenlisten nach Bereich → Case Studies → Trust-
  Abbinder + CTA. Section colours alternate with a pixel dissolve at each change
  (hero ▪ Ergebnisse ▫ Kundenstimmen ▫ Kundenlisten ▪ Case Studies ▫ Formular ▪ →
  footer), 5 seams counting the footer's.
- **The big architectural result: `css/page-service.css` is the page CHASSIS, not
  "the Werkschutz stylesheet."** This page links it and only adds ~300 lines of its
  own (`css/page-referenzen.css`). What came from the chassis: the `--content-inset`
  rule on both sides, the oversized regular-weight `main h2`, the breadcrumb
  chevron, `.section--light` (which re-declares the tokens for a white section, so
  every new block that consumes tokens got its light variant for free),
  `.service-hero*`, `.service-link`, and the whole `.pixel-seam*` block with the
  padding each following section reserves. Written up as §9.1 of
  docs/page-conventions.md — the city and combo pages should do the same.
- **`.testimonial*` extracted to `css/testimonials.css`** (shared), the same move
  `lead-form.css` got earlier the same day and the one
  docs/build-checklist.md asks for ("Resultados + testimonios… hay que sacarlo de
  page-home.css"). The homepage links it *before* page-home.css; `.references*`
  (the section, its white background, the result stats, the 3-up grid) stayed
  behind, because that is the homepage's composition, not the card. One real
  consequence of the move: `.testimonial__role` had a token value in the component
  and an "on white" override further down page-home.css — there is one value now
  (the override always won). Verified afterwards that every `.testimonial*` class
  in the built homepage still resolves to a rule, and re-measured the homepage: no
  horizontal scroll at 320/360/390/430/768/1024/1440.
- **Content decisions, both deliberate:**
  - **The three case studies were NOT written.** The draft's section 5 carries
    `[ERGÄNZEN: Die drei Ergebnis-Kacheln … als Case Studies ausformulieren, siehe
    Prüfkatalog F13]`. Writing Ausgangslage → Konzept → Ergebnis narratives for
    three named real companies would be inventing facts about MORELO, the
    Sozialstiftung and CleanTech. The section ships with the two Kundenstories the
    draft does supply, verbatim, each linking to its (not yet built) story
    subpage; the gap is flagged in the HTML and in the checklist.
  - **Logos: only the eleven that are already online.** The draft names 36 clients
    across three Bereiche and flags the Freigaben as open (F11 im Prüfkatalog).
    The eleven with files in `assets/images/client-logos/` are the ones already
    published in the homepage's own logo band, so this page adds no logo that
    isn't already live; the other 25 appear as names. Every one of the 36 is real
    HTML text — a logo image is not readable by a crawler or an answer engine.
- **Schema follows the draft's explicit instruction**: `Organization` +
  `LocalBusiness` + `BreadcrumbList`, with `aggregateRating` 4,7 / 97 (the one
  client-confirmed figure, and it is displayed on the page). **No `Review` objects
  for the three testimonials** — the draft says "Testimonials NICHT als
  Review-Schema faken, nur echtes Widget".
- **This page is also where the WCB / Deutscher Mittelstands-Bund membership
  reappears** — CLAUDE.md has flagged its absence since the "Certified Quality"
  section was removed 2026-07-17. It is the draft's own closing copy, next to the
  two DEKRA seals, above the form. Closed for this page only; the homepage still
  doesn't have it.
- **Two real bugs, both caught in a screenshot, not by reasoning:**
  - **Margin collapse through a zero padding.** Ergebnisse and Kundenstimmen are
    two adjacent white sections with no seam between them (white tiles over white
    is nothing), so the second got `padding-top: 0` to make them read as one area.
    With no padding and no border, its first child's top margin (the
    `.section-eyebrow`'s 16px) collapsed *out* of the section and rendered as a
    16px band of the page's black background between the two whites — measured at
    y=1395–1410 at 1440px. A small `padding-top` (`--space-4`) contains the
    collapse; the visible gap is identical, just white. Now §9.2 of the
    conventions doc.
  - **A logo row sized by height alone is unbalanced.** DB Netze, BRK and Liapor
    dominated and bayernhafen / Stadt Bamberg / STWB / MORELO / CleanTech were
    unreadable. Fixed the way the homepage's own band already does it
    (sticky-story.css): cap the wide wordmarks by `max-width` (which recomputes
    the height on a replaced element, so nothing distorts) and give the compact
    marks more height. The phone block has to restate both groups — `[src*="…"]`
    outranks a bare class.
- **Third bug, caught by the client in a screenshot the same day ("tiene que estar
  todo centrado") — a specificity collision between the shared form and the
  chassis, and it was ALSO wrong on `/werkschutz/`.** The form's intro block
  carries both `.conversion__intro` and `.section__intro`, and page-service.css
  styles the latter generically (`.section__intro { max-width: none }` +
  `.section__intro > p { max-width: 42rem }`). A page's own stylesheet loads AFTER
  lead-form.css, and `.section__intro > p` is (0,1,1) against the lede's single
  class — so the cap and the auto margins both lost: the lede sat in a 672px box
  hugging the LEFT edge of an intro as wide as its own heading. 360px off centre
  here (long H2), 14px on /werkschutz/ (short H2), which is why it had gone
  unnoticed. Fixed once, in `css/lead-form.css`, with (0,2,0) selectors
  (`.conversion .conversion__intro`, `.conversion .conversion__intro-lede`) and
  the homepage's own values — so every future page using the chassis + the shared
  form gets it right with no per-page rule. Verified centred on all three pages
  that have the form; the homepage's own rendering is unchanged. Written up as the
  specificity caveat in docs/page-conventions.md §6.
- **Measured, not eyeballed** (Chrome headless + a fixed-width iframe): no
  horizontal scroll at **320 / 360 / 390 / 430 / 768 / 1024 / 1440px**, re-checked
  on /werkschutz/ and the homepage after the lead-form fix. Page height 9558px at
  390, 6787px at 1440. One capture with motion enabled confirms the hero
  cascade completes and the first seam's black tiles sit in the reserved band.
- **Same-day rework of section 4 (client): the roster is now ONE AUTO-SCROLLING ROW
  PER BEREICH, logos instead of name pills** ("tiene que aparecer los logos de las
  empresas y quiero una linea para cada uno y que vayan pasando como en la
  homepage"). The hairline name pills AND the separate static logo row above them
  are both gone — with a row per group, that static row showed the same marks
  twice. Mechanism is the homepage's own marquee (`.ref-marquee*`, copied into
  page-referenzen.css because page-home.css is not loaded here; keep the two in
  sync): row clips + edge-masks, track animates `translateX(-50%)`, N identical
  groups each carrying its own trailing gap. Pure CSS, pauses on hover.
  - **9 new logos exported** from the client's new `assets/logos/` folder into
    `assets/images/client-logos/` (cropped to the alpha bounding box, resized to
    160px tall, same treatment as the existing ones — all 14 files were already
    white artwork on transparent, so nothing needed recolouring). **Two of the
    client's files are misnamed, and were mapped by looking at the artwork, not the
    filename:** `Bayernwerk.png` actually contains the **Stadt Coburg** mark, and
    `Coburg.png` is **Landkreis Coburg**. So there is still no Bayernwerk logo. The
    other five files (ADAC, Cleantech, Liapor, Sozial, Stadt) are re-supplies of
    logos already exported and already live on the homepage — deliberately NOT
    re-exported, so nothing the homepage renders changed.
  - **Four more logos, later the same day** (client): `aldi.png` → ALDI SÜD (row 1),
    `Hallstadt.png` → Hallstadt and `Heltec.png` → HEITEC VOLLEYS (row 3), and
    `Bayerishe.png`, which is **Bayerische Landessiedlung** — a Baustellenbewachung
    client, NOT the Bayerische Bereitschaftspolizei in row 1, which still has no
    logo. Third file in this folder whose name does not match its artwork, so keep
    mapping these by looking at them. One content note: the draft spells that
    client "Heltec Volley" and the logo reads "HEITEC VOLLEYS" (the real company is
    HEITEC) — the logo replaces the text, so the draft's spelling no longer appears
    on the page; the `alt` says HEITEC Volleys. **24 of 36 now have a logo.**
  - **Three more, later still** (client): the REAL `bayernwerk.png` this time
    (Baustellenbewachung), `Wirtschaftsclub.png` → Wirtschaftsclub Bamberg, and
    `University Of Bamberg.png` → the Otto-Friedrich-Universität crest. Note the new
    bayernwerk file REPLACED the old mislabeled one on disk (macOS is
    case-insensitive: `bayernwerk.png` over `Bayernwerk.png`), so `assets/logos/` no
    longer holds the Stadt Coburg source — already exported, nothing lost, but worth
    knowing that folder is not an archive. **27 of 36 now have a logo.** Two of these
    needed a THIRD size tier (`clamp(3.25rem … 4.25rem)`): the Universität crest is a
    detailed round seal and the Wirtschaftsclub mark is small type under a
    line-drawn skyline — both were an unreadable smudge at the compact tier, caught
    in a screenshot. That tier sets the row height, so it is deliberately only those
    two.
  - **2026-08-04, client edits to the roster:** the two centred titles above lost
    their eyebrows (see below), **Brose Bamberg and Bodo Freimuth Tiefbau were both
    removed** from the client lists (they are in the draft's roster — removed on
    instruction, worth confirming it was a Freigabe decision), and four more logos
    landed: `Postler.png`, `SG.png` → the roster's "Dach & Solar SG", `Landkreis.png`
    → **Landkreis Bamberg** (not Coburg), and `Bayerishe Bereitschaftspolizei.png`.
    **34 companies now, 31 with a logo**; only Norma, Schöner Leben and nacht arena
    are still text.
    - The Bereitschaftspolizei star is the one file in this set that is **not a white
      silhouette** — ~10% of it is a black panther. It still reads on the black
      section because the panther sits INSIDE the white shield (verified by
      compositing it on #010101 before using it), and it went into the big size tier
      with the Universität crest since both are fine-detail crests.
    - **Removing two companies broke two loops**, which is the rule from the build
      above biting: Baustellenbewachung fell 38px short of filling the row and
      Veranstaltungsschutz 15px. Fixed by raising the group counts (Baustelle 4 → 6,
      Veranstaltung 2 → 4) — **and the count must be EVEN**, because half of an odd
      number of groups is a half-group, so `-50%` would not land on a group boundary
      and the row would jump. That rule is now in the CSS and in
      docs/page-conventions.md §9.3. All three durations were re-derived from the new
      measured track lengths; back to ~10px/s on all three rows.
    - **Two titles centred, eyebrows removed** (client): Ergebnisse and
      Kundenstimmen. Those eyebrows were UI furniture this build added, never copy
      from the draft. The 16px `padding-top` that section had was trapping the
      eyebrow's collapsing margin (see the seam note above); with the eyebrow gone
      the first child is the h2 at margin 0, so nothing escapes — the padding stays
      as the deliberate gap and its comment now says so, since `padding-top: 0` would
      reopen the bug the day a child with a top margin returns.
  - **27 of the 36 companies have a logo; the other 9 ride the same row as
    their name set in type**, one step quieter than a real mark (0.62 white — at
    0.72 a plain name read brighter than the logos beside it, which inverts the
    hierarchy). No client is dropped from the list, and it is also what keeps the
    5-company Baustellenbewachung row long enough to loop.
  - **Two bugs found by measuring, both worth knowing:**
    - **`minmax(0, 1fr)` + `min-width: 0` on the grid are load-bearing.** A grid
      item's automatic minimum size is content-based and the track is 4.6–6.6k px
      of max-content, so with an implicit `auto` column each row grew to its own
      track's width and took the page with it: **5.290px of horizontal page scroll
      at 1440px**, and every loop broken (row wider than half the track). The row's
      own `overflow: hidden` does not help — the grid item has to be clamped too.
    - **How many groups is arithmetic, not taste.** `-50%` shifts by HALF the
      track, so the loop only stays seamless while that half still fills the row.
      Two groups for the 21- and 10-company rows; the 5-company row needs FOUR.
      Verified at 320/390/430/768/1024/1440: every row loops, ~8–10px/s on all
      three (three different durations — a duration is not a speed, and half a
      track is 3.3k px on the long row against 1.8k on the short ones).
  - Reduced motion drops the marquee to static wrapped rows with **all 36
    companies visible** — confirmed in a screenshot, including the `flex-shrink: 1`
    the group needs there or it keeps its max-content width and gets clipped (the
    bug the homepage's own band shipped with for a while).
  - Re-measured after the rework: no horizontal scroll at 320/390/430/768/1024/
    1440. Page height 6604px at 1440, 8652px at 390 — ~900px shorter than the pill
    version, since three rows replace three wrapped blocks.
- **One knock-on from a parallel change the same day:** `.service-hero__badge` /
  `__badge-icon` were deleted from page-service.css when the client dropped the
  certification chip from the service hero. This page's draft explicitly opens with
  a Badge ("Über 300 Unternehmen und Einrichtungen vertrauen FRANKONIA"), so it
  keeps it — but as `.ref-hero__badge` in its own stylesheet, with the deleted
  rule's values, so it no longer depends on a chip the service template does not
  want.
- **Not verified in a real browser**, same standing caveat as every build this
  phase: the header's light/dark switch over the three white sections depends on
  real scroll events (`initHeaderScrollTheme`) and needs the `npm run dev` check.

**2026-08-03 — `/werkschutz/` rebuilt for real: client copy, German, and the
homepage's design language. This is Bloque 1 of
[docs/build-checklist.md](docs/build-checklist.md) minus the two items only the
client can close (real-phone check, template approval).** Client instruction
was explicit: start designing this page, and *"aplicá los estilos de la web, o
sea los CTAs, los titles, los efectos, todo"* — so the deliberate restraint the
July version was built with is gone, on purpose. What changed:

- **Copy** is `content-de/2026-07-27 Webtext 03 Werkschutz.docx` (client draft,
  Stand 24.07.2026), verbatim, in German — page flipped to `lang="de"` /
  `og:locale="de_DE"`, `header-de`/`footer-de` includes, real title (52 chars)
  and meta description (156) from the draft. The English placeholder page and
  its invented FAQ answers are gone.
  **One block of copy on the page was written for this build, not supplied:**
  the three "So läuft es oft" lines in section 3. The draft asks for that
  section as a Gegenüberstellung but only gives the FRANKONIA side. Flagged
  inline in the HTML too — review them with the copy.
- **Structure follows the draft's own 9-Punkte-Struktur** (Hero → Risiko →
  Vorteile → Leistungsumfang → Abgrenzung → Anwendungsfälle →
  Sicherheitskonzept → Kosten → Trust/Ansprechpartner → FAQ → CTA → verwandte
  Seiten). Every one of the 12 service drafts in `content-de/` uses that same
  structure, which is why the CSS blocks are named generically.
  The old sections (`.service-intro`/`__problems`/`__pillars`/`__process`/
  `__trust`/`__areas`/`__reference`/`__cta`) were **deleted**, markup and CSS —
  not left alongside. Git has them.
- **Three blocks the checklist counts across many pages were built here first**,
  generically: `.service-price*` (Kosten + Preis-Box, 27 pages),
  `.service-konzept*` (compact Sicherheitskonzept, 11 — the homepage keeps the
  big 3-cube exploded-view version), `.service-compare*` (the A-or-B service
  comparison, 4 — two panels + a decision strip, NOT a table; see the 2026-08-03
  redesign note below).
  The table is a real `<table>` (genuine tabular data) that re-reads as stacked
  blocks on a phone via a per-cell `data-label`, so it never needs horizontal
  scroll.
- **The lead form is now shared, not homepage-only**: `css/lead-form.css`,
  extracted from `page-home.css` (~475 lines out, the documented-dead
  black-left-panel rules dropped in the move). Both pages link it *before*
  their own stylesheet; the homepage keeps only `.pixel-seam + .conversion`
  (that dissolve band is a homepage effect). Verified after the move that every
  `.conversion*` class in the built homepage still resolves to a rule.
  It is the checklist's "formulario de cierre → las 49 páginas".
- **Design language now matches the homepage**: the oversized regular-weight
  `main h2` (same clamp — keep the two page-scoped copies in sync),
  `.btn--primary` + diagonal arrow CTAs, the outline phone pill,
  `.section-eyebrow` on every section, and the same motion stack — GSAP +
  ScrollTrigger + Lenis with `hero-reveal` / `title-reveal` / `item-reveal` /
  `text-reveal`. **This supersedes the old "service pages deliberately do NOT
  reuse the oversized `main h2`" rule** in the Service-page template section
  below and in `page-service.css`'s header.
  `js/hero-reveal.js` and `js/text-reveal.js` each got a one-line
  generalization (`[data-hero-reveal]`) so the service hero reuses them with no
  per-page branch; the homepage selectors are untouched and still first.
  Not loaded here: the homepage's bespoke section scripts (pain-hook journey,
  system-story, konzept-seq, sticky-story, outfits, pixel-transition, coverage
  map, social carousel) — none of their markup exists on this page.
- **Assets**: MORELO and bayernhafen Bamberg (the two clients the draft names)
  exported as white silhouettes into `assets/images/client-logos/`, same
  treatment as the homepage's own client marks. Everything else reuses existing
  files.
- **Measured, not eyeballed** (Chrome headless + a fixed-width iframe, see
  "Measuring mobile" below): no horizontal scroll at **320 / 360 / 390 / 430 /
  768 / 1024 / 1440px** — 320 included, which is better than the homepage's own
  known 320px limit. Page height 16501px at 390, 11523 at 1440. The homepage was
  re-measured after the CSS extraction: no overflow at 390 or 1440 either.
  Two real bugs were caught this way and fixed, both worth knowing:
  - `.service-related__link`'s hover-bleed used a fixed `-1rem` inline margin
    against a container padding that is only 12px at 390px → 4px of real page
    scroll. Both sides are tied to `--container-padding` now.
  - `overflow-wrap: break-word` (base.css) does **not** shrink an element's
    min-content width, so one unbreakable compound
    ("Fremdfirmen-Koordination") set a whole grid track's minimum and overflowed
    by 25px at 360px. `overflow-wrap: anywhere` + `min-width: 0` on the grid
    children is the fix — same trap the homepage's services list hit.
  - Sitewide `hyphens: auto` (base.css, correct for prose) fired on nearly every
    line of this page's column-set copy ("einfa-cher", "lau-fender",
    "Fremd-firmen"). Disabled per block, deliberately NOT on the FAQ answers,
    which are real running prose in a wide measure.
- **Known gaps, not fixed unilaterally** — all client-side:
  - the draft's hero asks for a **Pfortendienst/Werkstor** photo; the only
    Werkschutz photo that exists is the portrait guard shot (820×1227, no
    higher-res original anywhere), used in a two-column hero instead of a
    full-bleed one for exactly that reason;
  - no portrait of **Alexander Jäger** exists — his block is built to take one
    (already its own column) and ships without a stock stand-in;
  - the page carries **8+ real internal links to pages not built yet**
    (`/leistungen/`, `/objektschutz/`, `/empfangsdienst/`,
    `/sicherheitstechnik/`, `/sicherheitskonzept/`,
    `/ratgeber/werkschutz-vs-objektschutz/`, `/werkschutz-nuernberg/`, the city
    pages). Confirmed URLs from guidelines §2.2, just not live yet;
  - the form still submits nowhere (`action="#"`, native validation only), same
    as the homepage — checklist Paso 4;
  - the price range **28–40 €/Std.** and the **"30 % Personalkosten
    eingespart"** figure are the client's own draft copy, published as written;
    both are now on a public page, so worth one explicit confirmation.
- **Second pass, same day — the page had skipped half of
  [docs/page-conventions.md](docs/page-conventions.md)**, which existed since
  2026-07-31 and was not read before building. Client caught the most visible
  one ("agregale el margen izquierdo y derecho que tiene la homepage") and asked
  for the decisions to be written down so they don't have to be re-made on the
  next service page. All four misses fixed, and §8 of that doc is now the
  service-page template spec:
  - **`--content-inset` on both sides** (§1) — one rule for the whole page
    (`main > .breadcrumbs, main > section > .container`), as
    `calc(var(--container-padding) + var(--content-inset))` because the inset
    lands on the same element as `.container`'s own padding and would otherwise
    replace it. Drops to `--space-2` on a phone. The form section stays out (it
    is a centred card, same as the homepage).
  - **Breadcrumbs with chevrons** (§3), not the `/` that components.css still
    ships — markup + the one `.breadcrumbs__sep-icon` rule, repeated per page
    until that moves to the shared file.
  - **Pixel seam before the footer** (§4.4) — mandatory on every page since
    2026-07-31. Default black tiles (the section above it is on the plain page
    background) and the footer reserves the band height.
  - **Form honeypot** (§6) — the rule moved into `css/lead-form.css` as
    `.conversion__hp` so every page using the shared form inherits it; the
    homepage form still needs the div itself, tracked in the checklist.
  - The hero **H1 now uses the documented page-title clamp** instead of a
    smaller one invented for this template — §2 exists precisely so every page's
    title is the same size.
- **Third pass, same day — sections alternate black/white with a pixel dissolve
  at every boundary** (client: "alterná como en la homepage los colores... hero
  negro, el de abajo blanco, el de abajo negro, y así, con transición de
  píxeles"). Order: hero ■ Risiko □ Vorteile ■ Leistungsumfang □ Abgrenzung ■
  Anwendungsfälle □ Konzept ■ Kosten □ Ansprechpartner ■ FAQ □ Formular ■
  Verwandte □ → footer. 12 seams counting the footer's.
  - The light side is one `.section--light` scope that **re-declares the tokens**
    (`--color-text-muted`, `--color-border`, `--color-accent` → blue-dark,
    `--color-focus-ring` → blue-dark, …) rather than restating colours per
    block. Custom properties inherit, so every existing `.service-*` rule — and
    any future one that consumes tokens instead of hardcoding a hex — gets the
    light variant for free. Values are the documented "on white" set
    (docs/page-conventions.md §5), not new ones.
  - Four things tokens can't reach, all annotated in page-service.css: the
    inline link's hairline and its hover (which went to white), the highlight
    box border, the **client logos** (white silhouettes → `filter: invert(1)` on
    a light section, same as the homepage's own pale logo band), and the
    link-row hover, which inverts the other way.
  - **Real bug caught in a screenshot, not by reasoning:** the dark price box
    inside a now-light section was *inheriting* that section's dark grey text,
    so its two tick labels were dark-on-dark and invisible. A dark panel has to
    declare its own `color` — the box does now, same as the lead form's white
    card does. Written into §8.2 of the conventions doc as a rule, not just
    fixed here.
  - Each light section carries `data-nav-theme="light"` so the sticky header
    switches to its dark-text state behind it (`initHeaderScrollTheme`,
    js/main.js) — the one part of this pass a headless screenshot can't confirm,
    since it depends on real scroll events.
  - Cost, measured: page height 11584 → 13784px at 1440 (11 extra seam
    reservations at 200px). No horizontal scroll at 360 / 390 / 1440.
- **Fourth pass, same day — the Leistungsumfang section is now a pinned image
  mask reveal** (client, with a GSAP pen as reference: "para esta sección voy a
  querer este efecto"). Left column = the six duties, one per screen; right
  column = a stack of six photos held by CSS `position: sticky` while each one
  clips away from the bottom (`clip-path: inset`) to expose the next, scrubbed to
  scroll, plus a slow object-position drift. New `js/service-flow.js` +
  `.service-flow*` in page-service.css.
  - Four deliberate departures from the reference pen, all annotated in the code:
    sticky instead of ScrollTrigger's `pin` (this project's pattern); it reuses
    the page's single Lenis + GSAP ticker instead of the `new Lenis(...)` the pen
    creates (two instances fight over the scroll); no animated page background
    (this page's colour is the section alternation); and no per-step CTA — the
    section keeps its one link, in the highlight box.
  - **Three layouts, and the fallback is the base one**: the stacked/sticky
    desktop layout is itself gated behind
    `and (prefers-reduced-motion: no-preference)`, and `gsap.matchMedia()` uses
    the identical condition. Without that, a reduced-motion desktop visitor would
    see one photo with five hidden behind it. Verified in both states: mobile and
    reduced-motion desktop both render six text+photo pairs in normal flow.
  - The two group headings became a per-step phase label ("Im laufenden Betrieb"
    / "Nachts, am Wochenende, an Feiertagen"), so each duty is its own `<h3>`.
    Same words, same order.
  - **Placeholder photos** (client: "las imágenes poné cualquiera y después yo
    las cambio") — four reused from the homepage's system story and this page's
    hero, two newly exported from previously-unused client photography
    (`flow-alarmbedienung` from Cameras.png, `flow-kontrollgang` from lab.jpg).
    Swapping them is a `<picture>` edit; the frame is a fixed ratio.
  - Cost: 13784 → 17704px at 1440 (six screens of scroll for one section). It is
    now the page's centrepiece section, which is the point.
  - **Corrected same day, from a screenshot the client sent**: the sticky photo
    column was centred at `top: 50%`, which put it straight over the section's
    own H2 while that heading was still on screen. The client's fix was also the
    better composition: **pin the heading too** ("quedamos ahí pausados con el
    título fixed y mientras escroleamos solo cambia el texto y la imagen"). So
    the `.section__intro` moved INSIDE `.service-flow` (its sticky containing
    block is now the flow, so it releases at the flow's end rather than staying
    pinned over the highlight box), the grid gained explicit
    `"intro intro" / "steps media"` areas, and the photo column sticks BELOW the
    heading instead of at the viewport centre. Three details that are structural,
    not cosmetic: the pinned heading needs an opaque background
    (`--flow-intro-bg`, following the section's own colour) because the step text
    scrolls up behind it; `--flow-title-h` starts as a safe CSS constant and
    js/service-flow.js replaces it with the heading's measured height on load and
    on every ScrollTrigger refresh (the heading wraps to two lines on narrower
    desktops, so a constant alone would leave the photo overlapping or a gap);
    and each step's text is aligned to the PHOTO's centre, not the viewport's,
    via `padding = 2 × top-offset + photo-height − viewport` — the pinned heading
    means those two centres are no longer the same.
- **Fifth pass, same day — the hero now matches the homepage hero element for
  element** (client: "la hero de werkschutz tiene que ser igual a la hero de la
  homepage en tamaño, la posición de los badges DEKRA, los tics azules... mismos
  tamaños y demás"). Measured against the homepage at 1440px and corrected: H1
  60px → **52px** (the homepage hero's own clamp — this is NOT the page-title
  scale in docs/page-conventions.md §2, which is why that table now carries a
  separate hero row), lede colour white 0.65 → **0.82** with the homepage's 32rem
  measure and 1.5 line-height, blue ticks 15.75px → **18px** with
  `stroke-width: 2.25` (a fixed 1.125rem, not an em that tracks the smaller hero
  type), DEKRA seals 52px → **44px**, the trust row's desktop hairline removed
  (the homepage only has one on a phone, where the seals also drop to 2rem), and
  the action/reassurance/trust spacing set to the homepage's values.
  - **"The same size" is not "the same pixel height."** The homepage hero is
    912px and fills the viewport because its header is transparent over the photo
    and there is no breadcrumb; here the solid header (80px) + breadcrumb (~48px)
    take 8rem first, so copying 912px would have pushed the trust band below the
    fold — the opposite of what the homepage does. The hero now fills the rest of
    the first screen instead (`min-height: calc(100svh - 8rem)`, content centred),
    with the photo sized by HEIGHT (`min(42rem, calc(100svh - 14rem))`) rather
    than width, since the photo was what made the hero 878px tall.
  - **Two real bugs caught by measuring, both worth remembering:** sizing the
    photo with `width: auto` + `height` let the width come from the aspect-ratio
    and ignore its grid column — 43px of real horizontal scroll at 1024px; and
    `<picture>` is an inline element, so the `<img>`'s `height: 100%` resolved
    against the picture's shrink-to-fit box instead of the frame, leaving the
    photo 497px tall in a 676px frame with a dark strip beneath it. Both are now
    fixed for the hero AND the flow frames, which share that markup shape.
  - Known, accepted: at exactly 1024px the H1 wraps to four lines in the narrower
    column and the trust band sits just below the fold. No overflow, and one flick
    of scroll reaches it; not worth a bespoke breakpoint.
- **Sixth pass, same day — "Werkschutz oder Objektschutz" rebuilt as a decision
  tool** (client brief: the criteria table was "factually correct, but flat,
  overly horizontal and too editorial… the UX does not guide them clearly toward
  a decision"). Every approved fact and both links survive; nothing else on the
  page was touched.
  - The `<table>` is gone, **replaced rather than restyled, deliberately**: a
    table's row/column semantics are exactly what made it read as data, and the
    brief needs Werkschutz to carry more weight than Objektschutz on its own
    page — which a symmetric table cannot express. The six criteria are still
    real term/value pairs (a `<dl>` per panel, each pair wrapped so it can be a
    row) but grouped BY SERVICE, which is how someone choosing actually reads
    them.
  - Two panels with identical structure (context label → title → one-line
    explanation → three ruled criteria → action). Werkschutz gets the subtle
    priority: blue top rule, blue-tinted hairline, a 3%-white fill. Objektschutz
    stays neutral. No glow, no shadow, no scale.
  - **Colour is never the only signal** (brief + WCAG 1.4.1): the context labels
    ("Für laufende Betriebe" / "Für Gebäude und Gelände"), the titles, the
    explanations and one line icon each carry the distinction. Two new sprite
    symbols for that — `#icon-factory`, `#icon-building`, added to
    partials/icon-sprite.html on the same 24px grid and 1.5 stroke as the rest,
    not inlined at the call site.
  - **New `.service-decision` strip** below the panels turns the section's ending
    from a comparison into an action: the "not sure which one?" question plus the
    free-assessment CTA, with the Ratgeber link as the quietest thing in it. The
    two detached links that used to sit under the table are gone —
    "Zum Objektschutz" now lives inside its own panel.
  - The direct two-sentence answer is promoted above the longer approved
    paragraph, which stays visible and crawlable but demoted (`--font-size-sm`,
    muted) — GEO intact, hierarchy fixed.
  - Two measured fixes on the way: the strip's two actions side by side left the
    question column ~400px and broke the heading onto two lines with empty space
    beside the button, so they stack now; and the strip's grid child could not
    shrink below its longest word → 16px of horizontal page scroll at 360px, hence
    `min-width: 0` on the strip's and the panels' grid children.
  - **Trimmed immediately after, same day** (client: "es mucho texto el título más
    el subtítulo más el texto"). The section was saying the same thing three
    times: the draft's long paragraph restated the panels' own criteria almost
    word for word, and each panel's explanation line restated its context label
    plus its "Typisches Objekt" row. Both were REMOVED — markup and CSS, not left
    as dead rules. What survives: one intro line under the H2, and per panel
    label → title → three criteria → action. Where two pieces of copy overlapped,
    the client's ORIGINAL approved comparison content (the draft's criteria) was
    kept and the copy written for the redesign was dropped. Only "Logistikhalle"
    left the page entirely; every other term in that paragraph still appears in
    the panels. Section height 1686 → 1463px at 1440.
- **Seventh pass, same day — the four Risiko cards now carry isometric line-art
  illustrations** (client sent a reference card and asked whether they had to
  supply the artwork: no — these are drawn here). Each card is now a numbered
  header, the scene between two rules, and the caption; two-up on desktop instead
  of four-up, because at 4 columns a card is ~290px and an isometric scene is
  unreadable at that size.
  - **Inline SVG, not image assets.** No extra requests, nothing to optimise, and
    the line work follows the section's own colours: `.rz-line` is
    `currentColor`, `.rz-accent` the brand blue, `.rz-guide` the dashed
    construction guides. That is why the same four scenes work unchanged on this
    page's white Risiko section AND would work on a dark one — which matters,
    since the section colours alternate.
  - **The geometry is generated, not hand-written.** A small script projects real
    3D coordinates (one isometric projection; cuboids/planes/discs in world units)
    and fits each viewBox to what was actually drawn. Hand-writing isometric path
    data is exactly where this kind of drawing goes wrong, and the first pass
    proved it — the scenes came out small and off-centre in their frames until the
    fitted viewBox went in.
  - Scenes: 01 a plant with both conveyors and a break between them (pause +
    alert), 02 documents leaving an open door on a dashed trajectory, 03 a pallet
    of crates going out through the gate to a van, 04 a shift record with three
    ticked rows, one empty blue checkbox and an unsigned stamp ring. Scene 04 was
    redrawn once: three stacked cuboids read as one solid white slab, so the two
    lower records are suggested by their top faces only.
  - All four share ONE art box — their fitted viewBoxes have different ratios
    (1.33–1.60), so left to size themselves the cards got different art heights
    and the captions stopped aligning across a row. **16:10 since 2026-08-03**
    (client: "un poco menos de height"), down from 4:3, with the art padding
    trimmed --space-5 → --space-4. Nothing is cropped: `preserveAspectRatio: meet`
    scales each scene to fit, so a shorter box just draws them a little smaller.
    Measured at 1440: card 669 → **586px**, section 2202 → 2036px.
  - The four sprite icons that used to head these cards are gone: the
    illustration is the visual now, and keeping both was two icons for one idea.
  - Cost: page 17577 → 18696px at 1440. ~8.7KB of inline SVG total.
- **Hero chip removed (client, same day).** The draft's "Badge: DEKRA-zertifiziert
  nach DIN 77200-1 und ISO 9001" pill above the H1 is gone — markup and CSS, not
  left as a dead rule. Nothing factual left the page: the two real DEKRA seals are
  still in this hero's own trust row, and the certifications are stated in full in
  the Ansprechpartner section and the FAQ, so the chip was the third place on one
  screen making the same claim while pushing the H1 down. The hero now opens
  directly on its H1, like the homepage's.
- **Eighth pass, same day — the four Anwendungsfälle cards are now filled blue
  with the CTA's gloss** (client: "que tengan el mismo estilo que el CTA, que sean
  azules y brillosas, con el reflejo que tiene el CTA").
  - **The fill is the CTA's own #3D9AD3, flat** — client decision, reaffirmed
    after the trade-off was put to them ("tiene que ser el mismo azul del CTA").
    First build used a deeper `color-mix` gradient to clear 4.5:1; that is now
    reverted to the brand blue.
    **Accepted contrast caveat, recorded not fixed:** white on #3D9AD3 is
    3.11:1 — it clears the 3:1 minimum for UI components and large text but not
    the 4.5:1 for normal body copy, and each card carries a paragraph. Same class
    of exception the primary button already ships with (tokens.css), and the same
    handling: documented, not overridden unilaterally. Everything mitigable
    without changing the colour was done — every text on the card is SOLID white
    (alpha tiers would push the paragraph below 3:1) and hierarchy comes from size
    and weight instead. All four measured ratios, and the cheap way out if it is
    ever revisited, are in docs/design-system.md §7.
  - The gloss **reuses `@keyframes btn-shine`** (components.css) rather than
    declaring a second identical animation, with a staggered `animation-delay` per
    card. Two deliberate differences from the button: the band is 0.28 instead of
    0.42, and it sits BEHIND the content (`z-index: 1` on the children) — on
    paragraphs, a brighter band on top reads as glare over the words.
  - **Bug caught in a screenshot:** the titles rendered near-black on the blue,
    because this is a `.section--light` and `.section--light h3` (0,2,0) beat
    `.service-cases__item h3` (0,1,1). Fixed by matching specificity, not with
    `!important`.
  - **Scoped to this one section, client's decision** — not extended to the
    comparison panels or the risk cards (the isometric scenes use `currentColor`
    and dashed guides, which stop reading as technical drawing on blue).
  - Follow-on: the "4 industry photos" ask was **removed** from
    docs/build-checklist.md — these cards no longer take a photo, so it would
    have been the client paying for four photos nobody uses.
- **Ninth pass, same day — the hero is a full-bleed background photo** (client
  supplied HeroWerkschutz.png: "usá en todo el background la imagen"). The
  two-column hero (copy | portrait photo) existed for exactly one reason, now
  gone: the only Werkschutz photo in the project was portrait 820×1227, which a
  background treatment would have cropped to a letterbox band. The new file is a
  3:2 night shot of a patrol at an industrial site — an actual background image.
  - `.service-hero__media` (the side frame) was removed, markup and CSS. What
    replaces it: `.service-hero__bg` (absolute, inset 0, behind a z-index:1
    content layer), the same structure as the homepage's `.hero__bg`, plus a
    single-column `.service-hero__grid` and a 44rem cap on the content — without
    the side column nothing else stopped the H1 and trust row from running the
    full 1600px container.
  - Exported 768 / 1280 / 1536w WebP + a 1536 JPEG fallback (source maxes at
    1536, so it upscales slightly past that), 37–129KB WebP. The `<link
    rel="preload">` now carries `imagesrcset`/`imagesizes` so the preload picks
    the same variant the `<picture>` will.
  - **Two washes, not one.** Desktop is a left-to-right gradient (0.88 → 0.10) so
    the copy sits on darkness while the vehicle and the lit hall stay visible.
    On a phone that does nothing useful: the copy spans the full width and lands
    on the two brightest things in the frame — the guard's shirt and the white
    vehicle — so the ≤767.98px block replaces it with a vertical wash. Measured
    the backdrop behind the lede after the change: average luminance 37/255.
    Exactly the call the homepage hero makes at the same breakpoint.
  - Crop: `object-position: 55% 42%` on desktop (his head sits high in the frame),
    `62% 45%` on a phone, where a 3:2 photo in a tall hero keeps only a narrow
    vertical slice and the default centre would hold the empty road.
  - One soft spot, not over-corrected: at 390px a couple of words in the lede
    still cross the shirt highlight. Darkening further would start hiding the
    photo the client asked to show.
  - A service page whose photo is still portrait should keep the old two-column
    hero — it is in git, not deleted from history.
  - **2026-08-04, client: "la imagen está muy oscura, tiene alguna capa por
    arriba?" — yes, two, and one of them was cancelling out the photo.** Measured
    before touching anything (Chrome headless screenshot + per-region relative
    luminance): the right third of the rendered hero was **0.032**, which is
    exactly the raw photo's own average — the wash was removing everything the
    photo was there to show. Two causes, and both were real:
    - **The source is nearly black on its own**: `hero-werkschutz-1536.jpg` has a
      median relative luminance of **0.010** and its brightest 2 % only reaches
      0.19. No overlay tuning alone can fix that, which is why the `<img>` now
      carries `filter: brightness(1.34) contrast(0.96) saturate(1.06)`. Modest on
      purpose — past ~1.4 the sky starts showing sensor noise. **This is the first
      place on the site where a photo is lifted with a filter**; it is a property
      of this one night shot, not a new default for hero images.
    - **The vertical layer was darkening the FULL width**, not just the bottom
      edge it exists for (0.45 at the top, 0.35 at the bottom, stacked on top of
      the horizontal ramp). Its stops are now 0 through the middle of the frame
      (0.22 → 0 by 16 %, 0 until 74 %, 0.4 at the bottom), and the horizontal ramp
      clears fully instead of bottoming out at 0.10 (0.86 / 0.64 / 0.16 / 0).
      **The rule, written into the CSS: whatever that gradient does, it must not
      darken the right half.** Two stacked washes do not read as the sum of their
      numbers — 0.10 over 0.45 is 0.505, which is why this looked flat.
    - Phone block lightened with it, 0.82/0.74/0.86 → **0.70/0.60/0.78**, since
      the filter now does part of that work.
    - Measured after, at 1440: right third **0.032 → 0.106** (3.3× brighter), mid
      frame 0.026 → 0.079, and the copy zone barely moved — 0.113 → 0.119, i.e.
      **6.23:1** for white text against the 4.5:1 minimum. At 390 the backdrop
      behind the H1 / lede / ticks measures 6.57 / 8.54 / 5.88:1. Confirmed in
      screenshots at both widths: the vehicle, the gatehouse, the fence and the
      asphalt all read now.
- **2026-08-05 — risk card 03's illustration is the CLIENT'S OWN FILE, used AS-IS**
  (`assets/images/risk-03-diebstahl.svg`, client: "dejé una ilustración… quiero nomás
  probarlo"). A pallet losing a crate to a delivery truck, in the same isometric language
  as the other three. It replaces the scene generated here for that card; that one is in
  git. Renamed from the supplied `3.Diebstahl im und um den Betrieb.svg` and moved out of
  `assets/icons/` — it is an illustration, not an icon, and the project's file convention
  is lowercase and dash-separated with no spaces to encode in a URL.
  - **It is an `<img>`, and the first attempt at inlining it was WRONG.** That version
    rewrote its colours onto this page's `.rz-line`/`.rz-accent`/`.rz-guide` classes to
    get `currentColor` and the accent token. The client caught three separate breakages,
    all of them real:
    - **`.rz-line` declares `fill: none`, and a CSS declaration beats a presentation
      attribute — so it killed the `fill="white"` on 11 paths whose entire job is to
      OCCLUDE the lines behind them.** Crates and truck body went transparent and back
      edges showed through. This is the trap worth remembering: a supplied line drawing
      usually does its own hidden-line removal with white fills, and any `fill` rule
      aimed at its strokes will destroy that.
    - `.rz-accent`'s `stroke-width` turned the dashed blue crates into a chain of fat
      blobs.
    - `.rz-guide`'s own `stroke-dasharray` replaced the designer's dash rhythm.
    Those three classes set `stroke-width` in USER UNITS and implicitly assume a viewBox
    near the generated scenes' 264; this file is 989 (3.746x), which is why the weights
    also came out wrong before I "fixed" them with a per-scene multiplier that should
    never have been needed. **Do not re-apply them to a supplied drawing.**
  - As a file, none of that can happen: no CSS of ours reaches inside an `<img>`. The
    costs, both accepted: one 21KB request (cached, `loading="lazy"`, below the fold), and
    its blue stays the file's own `#3D9AD3` rather than the token — a graphic at 3.11:1 on
    white, which clears the 3:1 minimum for non-text. **If the four scenes should share
    one blue, change the other three; do not reprocess this one.**
  - `alt=""` (decorative — the `<h3>` and the paragraph carry the meaning, same as the
    other three scenes' `aria-hidden`) plus the file's own `width`/`height`, so the frame
    reserves its space and there is no CLS. `object-fit: contain` because the file is
    1.56 against the frame's 16:10 — a few pixels letterbox instead of cropping.
  - **The four cards are RAISED now, not framed** (client 2026-08-05: "me gustaría que
    estas cards tengan drop shadows y sin border"). The outer hairline is gone and
    `--shadow-lg` replaces it. Two things that are not obvious:
    the card had to gain `background-color: var(--color-white)` in the same edit — it was
    transparent, letting the white section through, and a shadow with no fill draws the
    edge of nothing; and **the two internal rules stay** (under the header, above the
    caption), because they are the drawing-sheet feel, not the frame that was asked to go.
    The `01`–`04` number box keeps its own hairline for the same reason.
    Measured after: layout height 586px on all four and gaps 32/32 at 1440 — identical to
    the framed version, so nothing else in the section moved. Nothing clips the shadow (no
    ancestor with a non-visible `overflow`), and on a phone the next card paints over the
    previous card's tail, so the single column gets no muddy band between cards.
    ⚠️ **Measuring lesson, mine again:** the first probe read 585/584/576/568 and a 63px
    row gap, which looked like the border removal had broken the row equalisation. It had
    not — that probe forgot to force `prefers-reduced-motion`, so it caught the
    `data-item-reveal` transform mid-flight and `getBoundingClientRect()` reports the
    transformed box. With motion off, and reading `offsetHeight` as well, all four are
    586px. A rect is not a layout measurement while GSAP is running.
  - **Scenes inset, cards shorter** (client 2026-08-05, same day: "igual de width pero
    un poco menos height, y que la imagen de dentro sea un poco más chica, con un toque
    más de padding en los bordes"). `.service-risk__art` gained
    `padding-inline: var(--space-6)`, and **that one declaration does both halves of the
    request**: `.rz-art` is `width: 100%` with a fixed `aspect-ratio`, so narrowing the
    box shortens the scene proportionally. Measured at 1440: drawing 537x336 →
    **473x296** (−12 %), card **586 → 546px**, width and the 32px gaps unchanged, all
    four identical. The ratio was deliberately NOT touched — it is what keeps the four
    scenes at one optical size, and card 03 is now a supplied `<img>` that follows the
    same box (measured identical to the three inline SVGs).
    On the ≤1151.98px touch band the figure carries its own `aspect-ratio`, so the extra
    inline padding letterboxes the scene inside a box of unchanged height instead of
    shortening the card — deliberate, those cards are already ~390–430px.
    Swept 390 / 768 / 1024 / 1440: no horizontal scroll.
  - **One edit to the supplied file itself** (client 2026-08-05: "lo único mal es la
    línea punteada"). The six blue "ghost crate" paths carried
    `stroke-dasharray="6.67 6.67"` with the default butt linecap, and each of those paths
    is a **closed outline that traces the cube's internal edges by doubling back on
    itself** (~2-unit jogs). A dash that short landed on every jog, so at card size the
    crates rendered as a chain of notched beads. Now `18 12` with round caps — which also
    matches the grey ground guides' own `16 16` rhythm, so the drawing's two dash systems
    read as related. **Geometry, colours and positions untouched**, and the reason is
    recorded in a comment inside the SVG itself.
    Two dead ends worth not repeating, both tested and rendered: removing the dasharray
    gives a continuous wobbly outline (the jogs become visible as a sketchy line), and
    filling those paths blue gives a solid blob — the path is the cube's whole silhouette,
    not the outline of its dashes. The properly clean fix would redraw the two cubes as
    separate straight dashed segments; that is artwork surgery and was not done unasked.
  - Verified after the switch: all four cards 586px tall, art boxes 368px, the image
    actually loaded (`naturalWidth` 989), three inline SVGs left (cards 01/02/04), no
    horizontal scroll.
- **2026-08-05 — the price card floats** (client: "¿hay posibilidad de hacer que la
  carta se mueva un poco, onda flote un poco, pero igual sea clickeable?"). A 10px rise
  over 7s, `transform`-only so it is compositor work and cannot cause layout or CLS.
  Desktop only (≥900px): on a phone the card is full width, where a float reads as the
  page wobbling rather than as an object lifting off it.
  - **The clickability worry is unfounded and worth knowing why:** a transform carries
    the element's HIT AREA with it, so a moving card is exactly as clickable as a still
    one. Only `pointer-events: none` or something painted on top would break the CTA.
    Verified with `elementFromPoint` at the button's centre mid-float: it returns the
    button itself, `pointer-events: auto`, `href="#anfrage"` intact.
  - **But a drifting button IS a worse target**, so the float PAUSES on `:hover` and on
    `:focus-within` — the card is still while you aim at the CTA, and a keyboard user
    tabbing to it gets the same stillness. Verified: five identical position readings
    under the pointer and `animation-play-state: paused`.
  - **`animation-delay: 1s` is load-bearing, not polish.** The card carries
    `data-reveal`, and `.u-reveal` animates `transform` too — an animation beats a
    transition, so without the delay the float would hijack the reveal and the card
    would fade in without its slide. 1s clears `--duration-slow` (400ms) plus the
    reveal's own delay.
  - **The keyframes end at `translateY(0)`, and that is what makes reduced motion
    safe.** motion.css collapses this to `0.01ms` with `iteration-count: 1`, so it lands
    on the 100 % frame. With 0 % and 100 % both at zero that frame IS the resting
    position; a two-keyframe `alternate` version would freeze the card 10px off its
    layout position instead. Verified under forced `prefers-reduced-motion`:
    `transform: none` at every sample. **Do not "simplify" those keyframes.**
- **2026-08-05, and once more** (client: "poné la card más a la izquierda un poco" +
  "el texto de Hinweis que esté en la sección izquierda al final").
  - Card `justify-self: end` → **`center`**: the column is ~515px and the card 432px, so
    `end` put all ~83px of slack on its left; centring splits it and moves the card
    **41px in** at 1440. It is a no-op on narrower desktops, where the column is the
    constraint and there is no slack — nothing to re-tune per breakpoint.
  - The Hinweis is back in the **left column, under the factors** — its third position
    in one day (under the factors → under the card → full width → left column again).
    Aligned to the factor list at every width; no max-width needed, the 56 % column is
    narrower than its 62rem cap.
  - **The grid rows took three arrangements before both gaps were clean, and each fix
    caused the next hole**, which is why the CSS now spells the sequence out:
    `all-auto` split the tall card's excess across its spanned rows and opened ~90px
    between the intro and the first factor row; `auto 1fr auto` fixed that and then
    opened **131px** between the factors and the note; `auto auto 1fr` **with the card
    spanning all three rows** keeps rows 1–2 content-sized — so both gaps are just the
    row-gap (24 and 60px, measured) — and drops the card's leftover height into row 3
    below the note, where it reads as section padding. The note needs
    `align-self: start` or it centres in that tall row.
- **2026-08-05, same day, revised twice more** (client: "hacéme la card más grande, un
  poco más de width para que entre el botón bien y un poco más de height, la idea es
  que siga siendo vertical" + "ponémelo abajo, a lo largo de toda la sección, no sólo
  abajo de la card").
  - **The card is 432x504 at 1440, ratio 0.86** — up from 368x424. The width is the
    number the CTA needs: `.btn`'s label plus arrow and padding is ~325px of
    min-content, and at 368px the card's inner width was 296px so the button wrapped to
    two lines. 432 − 72 of padding = 360px of inner width, one line. **All of the added
    height is spacing between real content** (block padding 40→52px, the price's top
    margin, the tick list's rule, the CTA's margin), not empty space at the ends —
    widening alone had made it square (432x428, ratio 1.01, measured).
  - **The Hinweis is a full-width row at the foot of the section**, spanning both
    columns, and the `.service-price__aside` wrapper is **gone** — its only
    justification was "the card and the note are one unit", which stopped being true.
    Grid rows went `auto 1fr` → `auto 1fr auto`. DOM order is now
    intro → card → factors → note, which is also the phone order.
  - ⚠️ **`margin-inline-start: auto` on a grid item makes it CONTENT-sized**, which
    cancels the default `justify-self: stretch` — so the card's `max-width` was never
    reached: measured **397px against a 432px cap inside a 515px column**. It takes
    `width: 100%` + `max-width` + `justify-self: end`. Worth remembering: the auto
    margin looks like the obvious way to push a grid item to its column's outer edge
    and it silently shrinks it instead.
  - **A measuring lesson too:** my first line-count probe divided the CTA's height by
    its line-height using a mis-parsed `paddingBlock`, and reported "2 lines" at every
    width — including 1440, where it had already been one. Parse `paddingTop`/
    `paddingBottom` separately; `paddingBlock` does not read back as a single number.
  - Section 940 → **983px** at 1440 (the taller card), and the card→note gap is 60px.
- **2026-08-05 — Kosten rebalanced: compact factor list, narrow vertical card, the
  Hinweis moved under the card** (client: "the left list is too tall and spread out,
  the right price card is too wide and horizontal, the note below the list feels
  detached from the price"). No copy, figure or link changed.
  - **The Hinweis and the card are ONE element now** (`.service-price__aside`), and the
    wrapper is not decoration. With four separate grid items the two columns could not
    grow independently: the factors' row started below whichever of intro/card was
    taller, so the list detached from its own intro. Wrapping card + note also gives
    one width to cap and one edge to align. The DOM order becomes
    intro → card → note → factors, which is **exactly** the mobile order the brief
    asks for, with no `order` and no grid areas (docs/page-conventions.md §7).
  - **`grid-template-rows: auto 1fr` — the same trap /kontakt/ already documents.**
    The aside spans both rows, so its extra height was being split between them: row 1
    grew past the intro and opened a **~90px** dead gap before the first factor row
    (caught in a screenshot). Sending the slack to row 2 puts it at **24px**. Any
    two-column block with one tall spanning item needs this.
  - Measured before → after at 1440: columns 55/45 → **56/44**; card 530x370
    (ratio 1.43, horizontal) → **368x424 (ratio 0.87, vertical)**; radius
    `--radius-md` (8px) → **24px**; card→note gap **28px**; factor rows 24px of
    padding → **12px** while the text went 15 → **17px** (the compaction came out of
    the padding, not the type); list 335 → **242px**; CTA content-sized → **83 % of
    the card**; section **940px**.
  - ⚠️ **24px is the only radius on the site outside the token scale.** The brief asked
    for 22–28px on this one card and no token sits there. If a second card ever wants
    it, promote it to a token rather than repeating the literal.
  - **Two rules reversed on purpose, both from 2026-08-03**, so the code does not read
    as contradictory: the CTA was "sized to its own label, not stretched edge to edge"
    and is now nearly full width (it needs `width` + centring + `white-space: normal`
    together, because `.btn` is inline-flex and nowrap and the label's min-content is
    ~325px against a narrower card); and the factor rows had just been given "a step
    more air" (`--space-4` → `--space-5`) and are now at `--space-3`. The phone-only
    copy of the CTA rule was deleted rather than left as a no-op duplicate.
  - Verified at 1440 / 1280 / 1024 / 900 / 768 / 430 / 390 / 375 / 320: no horizontal
    scroll, no min-height anywhere in the list (row heights are 48px at one line and
    71px at two, i.e. content-driven), and the phone stack is
    intro → card → note → factors at every width below 900.
- **2026-08-05 — the active Leistungsumfang duty is a FILLED BLUE BLOCK, not a blue
  left rule** (client: "en vez de la raya vertical me gustaría que todo el fill del
  item sea de un color, azul puede ser con el texto blanco"). The 2px `::before` rule
  is deleted, not left as a dead selector.
  - **The fill is `--color-blue-light` = `#3D9AD3`, the CTA's own blue — client's
    explicit call after the trade-off was put to them** ("usá el azul del CTA para el
    fill del item"). ⚠️ **ACCEPTED CONTRAST CAVEAT:** the section is
    `.section--light`, and white on `#3D9AD3` measures **3.11:1** — enough for the
    3:1 that applies to a UI component and to large text, under the 4.5:1 for normal
    text, and this item carries a 14px description. Same class of exception the
    primary button already ships with, and the same handling: documented, not
    overridden. The first build used `blue-dark 85 % + black` (`#4673AB`, **4.88:1**)
    and that is the value to go back to if it is ever revisited.
    Everything mitigable without changing the colour is done: both texts are SOLID
    white (an alpha tier would push the description under even 3:1) and the hierarchy
    comes from size and weight.
    ⚠️ It must be written as `--color-blue-light`, **not** `--color-accent`:
    `.section--light` re-declares that token to blue-dark, so `--color-accent` there
    yields `#5287C9`, not the CTA's blue.
  - **Corrected a real doc/code contradiction while doing this**, because it is the
    one that would send the next person to the wrong hex: CLAUDE.md's own colour
    table said `--color-blue-dark` was the "primary button fill". The code has used
    blue-LIGHT since 2026-07-28 (`.btn--primary`, components.css, whose own comment
    says the darker blue is now the hover/pressed state). "Use the CTA blue" is an
    instruction the client actually gives, and the two blues differ in contrast
    (3.11:1 vs 3.71:1 for white), so the table now names both correctly.
  - **The padding is on every step, not just the active one** — that is what keeps the
    fill from shifting the list when it appears. Verified: step heights are identical
    (98/99/99/99/99/99) at four scroll positions, and **all six still fit on one
    screen** at 1440x900, so the fill cost the fit nothing.
  - The active item's `border-top-color` goes transparent so the hairline above it
    does not cut across the fill. The active state is still not carried by hue alone:
    it is the only item at full opacity (the others sit at 0.72 and 0.18).
- **2026-08-05 — the Leistungsumfang photo is a large VERTICAL CARD, not a
  full-bleed rectangle** (client, with a drawing over a screenshot: "no quiero que
  la imagen sea un rectángulo recto que ocupe así todo, quiero que sea como una card
  vertical grande"). It was `inset: 0` with `border-radius: 0`, bleeding to the
  viewport edge; it is now a portrait card with real margin on all four sides and the
  page's own `--radius-lg`. Measured at 1440: **619x766, ratio 0.81**, 65px of air to
  the viewport edge. Nothing else about the section changed — the column is still
  50 % of the viewport, so the text column's alignment and the whole 50/50 geometry
  are untouched, and the crossfade still shows exactly one photo at opacity 1 at
  every step with the card fixed at 619x766 (verified through the scroll).
  - ⚠️ **The insets are four explicit values on the frame, and padding on the sticky
    media does NOT work here — I tried that first.** `inset: 0` on an absolutely
    positioned child is supposed to resolve against the containing block's PADDING
    box, so one padding declaration on the media should have inset all six frames.
    Measured: the padding computed correctly (`27px 64.8px 27px 36px`) and the frames
    still came out at the media's full 720x820 with **zero** inset. Explicit insets
    on the frame are unambiguous, and since all six share the one rule there is still
    nothing to keep in sync.
  - The right inset is the largest of the four — that is what turns a near-square
    column (720x820) into a portrait card and what pulls it off the viewport edge.
    A portrait card also crops the photos better: five of the six sources are
    portrait.
  - The media lost its `overflow: hidden` and its `--color-bg-subtle` background: with
    the card inset, a background there would paint a band around it, and the clipping
    belongs to the rounded frame. The frame carries that background itself (base
    rule), which is still what reserves the photo's space.
  - **A measuring lesson worth keeping:** `gsap.matchMedia` evaluates at load, so a
    CDP `setDeviceMetricsOverride` applied around navigation races it — two runs of
    the same probe reported `position: sticky` and `position: static` for the same
    width. Dispatch a `resize` and assert `.service-flow--stepped` is present before
    measuring anything in this section.
- **2026-08-05, FOURTH pass on Vorteile — arrow, width, identifiers** (client: the
  arrow too small, the FRANKONIA side still needing width, the `01 ERREICHBARKEIT`
  identifiers too weak, and the rows still too tall). Desktop only; copy untouched
  and re-verified against the draft by rendered `textContent`.
  - **Grid 36/7/57 → 33/8/59**, measured 386/94/690px at 1440. Third revision of
    these proportions and the reason each time was the same: the solution side
    carries the argument, so it gets the width.
  - **The arrow is now 95px at 1440** (83 at 1280, 66 at 1024), up from a flat 52px,
    with `stroke-width` 1.5 → 2 and **a bigger head**: the path's arrowhead went from
    8×14 to 12×16 of its 120-unit viewBox. At 1.5 and 52px it read as decoration
    rather than direction. `js/service-contrast.js` needs no change — it takes the
    dash length from `getTotalLength()`, which is exactly why editing the path is
    safe.
  - **Row identifiers are section labels now**: number 15 → **20px** medium weight in
    blue, topic label 13 → **16px** with the tracking pulled back 0.1em → 0.06em,
    since at that size the wider spacing was hurting the word rather than helping it.
  - **Rows 243/309/243 → 226/263/226 and the comparison 835 → 756px** at 1440
    (1072px three passes ago, so **−29 %** with type that is larger everywhere).
    Row padding 40 → 34px; the divider band is 68px, symmetric. Panel padding trimmed
    to 14px block / 8px right, the title's margin-bottom to 6px, and the paragraph's
    measure widened 52 → 56ch and the title's 30 → 34ch — otherwise the extra column
    width just becomes empty right margin.
  - **Two real bugs, both from the same class of mistake — two grids sharing one
    column template:**
    - **The column headings were 12px off their columns at every desktop width.**
      `.service-contrast__head` and `.service-contrast__module` are separate grids
      with the same `grid-template-columns`, but the head had `gap: --space-6` against
      the module's `column-gap: --space-5`, so the tracks resolved to different
      positions. They share the gap now. ⚠️ If either grid's gap changes, both must.
    - The FRANKONIA heading also has to land on the beginning of the solution TEXT,
      not on the outer edge of its background. That is now one variable,
      `--contrast-panel-lead`, consumed by the panel's `padding-left` and by the head
      cell's `calc(2px + …)` — verified with a Range on the actual text nodes:
      **Δ = 0px on both columns at 1440 / 1280 / 1024 / 900.** Measuring
      `getBoundingClientRect().left` of the two elements does NOT test this (the
      padding lives inside one box and outside the other) — my first probe reported
      −12px and −22px and neither number meant what it looked like.
    - Third time the touch block's 13px micro-type floor pinned something this brief
      had just enlarged: `.service-contrast__topic-label` is out of it now too. That
      block runs to 1151.98px and the desktop split starts at 900, so **anything in
      this section that grows past ~15px has to be checked against that list.**
  - Verified at 1440 / 1280 / 1024 / 900 / 768 / 430 / 390 / 375 / 320: no horizontal
    scroll, no clipped text, the right column measurably wider at every desktop width,
    the arrow vertically centred against the panel, and the stacked phone layout
    unchanged at 1623px at 390.
- **2026-08-05, THIRD pass on Vorteile — density and weight** (client: "demasiado
  desparramado, tipografía muy chica y visualmente desbalanceado" — the left column
  too wide, the FRANKONIA column too narrow, both texts too small, rows much too
  tall, too much empty space between the topic and the content, and the column
  headings too weak). Desktop layout only; copy untouched, re-verified by comparing
  the three rendered solution paragraphs to the draft: identical.
  - **The section's worst number was 97px of dead space between the topic label and
    the content, and it was NOT the 24px row-gap it looked like.** The topic row
    spanned all three columns, so the left column held two lines against a much
    taller solution panel: with `align-items: center` the problem sat ~75px down its
    own row (97px below the topic); switching to `start` just moved the void, leaving
    ~130px of black under the problem instead. Both measured.
    **The fix was structural — the topic moved INSIDE the left column** (which is
    also the brief's own "align the topic with the left column"). Topic + heading +
    problem are now one block that centres against the panel: the topic sits 20px
    from its own text and the leftover space splits evenly above and below instead of
    pooling in one hole. The desktop grid collapsed from two rows with named areas to
    **three columns, one row**.
  - **Grid 40/8/52 → 36/7/57**, measured 427/81/676px at 1440. The solution side is
    wider than the problem side at every desktop width — deliberately not 50/50.
  - **Everything got bigger, and the section still got shorter.** Column headings
    16px/400 → **19px/500** at 0.78 white (they were metadata, now they are
    subheadings); problem 16 → **18px** at 0.86; solution title 26 → **30px**;
    solution paragraph 16 → **18px** at 0.9. Row heights 292/324/292 →
    **243/309/243**, and the whole comparison **1072 → 835px at 1440**, i.e. 22 %
    shorter with larger type throughout. That is the trade the brief asked for: the
    space came out of the voids, not out of the text.
  - Also: panel padding 24px flat → 16px block / 20px after the blue rule (hands the
    content ~28px of horizontal space back), title→paragraph 12 → 8px, the arrow
    shortened from filling its column (94px) to **52px centred**, the divider band
    96 → 80px symmetric (the modules carry their own `padding-block` and the set's
    gap is 0, so the hairline sits in the middle of the band it separates), and the
    intro's bottom margin 32 → 24px.
  - **Two regressions caught in the sweep, both from the same cause:** the touch
    block runs to 1151.98px while the desktop split starts at 900px, so they overlap
    — and its 13px micro-type floor was shrinking `.service-contrast__label` and
    `.service-contrast__head-cell`, the very headings this pass exists to enlarge.
    Measured **13px at 1024 and 900**. Both are out of that list now; only the topic
    label is still micro-type. ⚠️ Any element that grows past ~15px has to be checked
    against that floor.
  - One more screenshot fix: the arrow had been pinned to the first text line with a
    `padding-top`, which left it floating above BOTH texts once the left column
    became a centred block. It inherits the row's centring now.
  - Verified at every width the brief lists — 1440 / 1280 / 1024 / 900 / 768 / 430 /
    390 / 375, plus 320: no horizontal scroll, the right column measurably wider at
    all desktop widths, the arrow vertically centred against the panel, and the
    stacked phone layout compact (row padding 40 → 32px and the cue band 3.5 →
    2.75rem, which took the section from 1707 to **1623px at 390**).
- **2026-08-04 — Sicherheitskonzept rebuilt as a centred process + proof section**
  (client brief: the copy was right but it "feels too much like a text block with
  bullets aligned to the left"). Was a left-aligned paragraph, three ticked list
  items and one link; now heading → method → three connected steps with their own
  line illustrations → the 30 % proof → two centred actions. Still the COMPACT
  variant the draft asks for, and every class stays generic (`.service-konzept*`)
  because docs/build-checklist.md counts **11 pages** needing this block.
  - **Copy is the draft's, and the split reassembles to it exactly.** The approved
    paragraph's LAST sentence (the 30 % customer result) was **moved** into the
    proof block, not copied — verified by joining the two rendered strings back
    together and comparing to draft line 74: byte-identical. Duplicating a factual
    claim about a real client would have been worse than either option.
  - **"30 %" is a large inline figure inside the approved sentence**, not a display
    number with the sentence repeated underneath. So the claim appears exactly once
    and reads exactly as written, with no invented company name and no chart.
    ⚠️ I briefly changed the space to `&nbsp;` for typography and reverted it — the
    copy stays byte-identical and `white-space: nowrap` on the span does that job
    instead.
  - **Three inline SVG scenes reusing this page's own `.rz-line` / `.rz-accent`**
    (the isometric risk cards established them): one stroke weight, `currentColor`
    line work, one brand-blue accent each, no image requests. 01 is a site plan with
    a gate gap, a dashed inspection route and the blue marker it ends on; 02 is two
    layered sheets with the blue brace that joins two rows (staffing + technology in
    one document); 03 is the same sheet with the blue check. 02 and 03 deliberately
    share the sheet so the trio reads as one family.
  - **Same fitted-viewBox lesson, paid for a second time.** Drawn inside
    `0 0 48 48` the scenes occupied ~60 % of their box and rendered small — exactly
    what the isometric scenes cost once already. They now share a fitted
    `viewBox="4 7 40 40"` and all three live inside x 6→42, y 9→40, so they scale up
    ~20 % and keep one optical size. Note the stroke is 1.5 USER units, so cropping
    the viewBox thickens the line proportionally — which is why the crop stops at 40
    instead of hugging the art.
  - **Two more things a screenshot caught:**
    - The 38px figure with `line-height: 1` made the browser grow only ITS line
      inside a 20px/1.65 paragraph, showing as a visibly uneven gap above the
      number. `line-height: 0.72` keeps it under the line box, so the paragraph
      holds one rhythm and the number still overhangs optically.
    - The intro at 52ch ran to **5** lines against the brief's 2–4. 60ch gives 4;
      going lower would need a measure past 70ch, which stops being comfortable
      centred. On a phone it is 6 lines — a 290-character paragraph cannot be 4 at
      350px, and that target was a desktop spec.
  - **The connector is CSS, not SVG**: a hairline from the first column's centre to
    the last's (1/6 → 5/6 with three equal columns) with a blue node per step whose
    `--color-bg` ring occludes the line, so it reads as segments between steps. On a
    phone it becomes a short vertical hairline in the gap BETWEEN steps only, so it
    never crosses the centred text. The sequence is also a real `<ol>` with visible
    `01`–`03` marked `aria-hidden`, so it is never communicated by blue alone.
  - **A primary CTA was added** (`Unverbindliches Angebot einholen` → `#anfrage`,
    the page's existing target) alongside the draft's own
    `So entsteht Ihr Sicherheitskonzept` link. Worth knowing: **the draft's section 7
    asks only for the link** — the button is the client brief's requested hierarchy,
    and its label and destination are both already on this page.
  - Measured: no horizontal scroll at 320 / 360 / 390 / 430 / 600 / 700 / 768 / 1024
    / 1440 / 1920 — **including a 2px overflow this section introduced at 320 and
    that is now fixed**: the CTA carries the same label as the price card's, so it
    hit the same `white-space: nowrap` min-content trap (~325px against a 280px
    inner width). Same documented fix. The three step centres are symmetric about
    the container centre at every width, the 700px boundary flips cleanly, and the
    section is 1274px at 1440 / 1741px at 390.
- **2026-08-04, SECOND pass on Vorteile — the section is now scroll-driven, and
  readable** (client: "no me gustó el UX/UI… quiero que haya diferencia entre
  estas dos columnas, los títulos más grandes, una flecha que se dibuje con el
  scroll, los items apareciendo con el efecto que ya tengo en la web, los textos
  están grises y chicos… y aplicá el mismo efecto de subrayado de 'Kennen Sie
  diese Herausforderungen?' en la columna derecha"). New `js/service-contrast.js`.
  **Copy unchanged again** — the only markup added is three `<span>` wrappers
  around phrases that were already there, verified by comparing the rendered
  `textContent` of all three solution paragraphs against the draft: identical.
  - **Readability was the real complaint and it is measured.** Problem text 14px
    at 0.75 white → `--font-size-base` at **0.82 (13.4:1)**; solution paragraph
    14px at `--color-text-muted` → base at **0.88 (15.8:1)**; the section lede also
    went to 0.82. Minimal is not the same as faint.
  - **The two columns are different materials now**, not two text blocks: the
    problem side is bare on the page, the FRANKONIA side sits on a 3.5 %-white
    panel with the blue rule. The side titles went from 11px uppercase labels to
    **17px subheads** with uppercase dropped (at that size it reads as shouting),
    the FRANKONIA one in `--color-accent` — 6.8:1 on this black, which is only safe
    on the dark side of the page. Solution `h3` 18px → **26px at 1440**.
  - **One scroll progress per module drives three things**, the way the homepage's
    pain-hook does: the module arrives, the arrow draws (`stroke-dashoffset`, dash
    length from the path's real `getTotalLength()`, never hardcoded), and the blue
    marker wipes across the phrase. All paint/composite-only, so none of it can
    trigger layout.
  - **The marker is the homepage's `.pain-hook__mark` with one deliberate
    difference.** Same `--mark` custom property, same `box-decoration-break: clone`
    so it survives a line break. But the homepage marks a large `<h3>`, where
    blue-light only has to clear 3:1; here the marked phrase is inside a 17px
    paragraph, i.e. normal text at 4.5:1, and white on `#3D9AD3` is **3.11:1 —
    fails**. So the fill is the documented deeper mix
    (`blue-dark 85 % + black` = `#4673AB`), sampled from a screenshot at
    **4.88:1**. Do not "restore" it to the CTA blue.
  - **Three bugs found by measuring, two of which reasoning would have missed:**
    - **The un-arrived state was 0.28 opacity** — a permanent dim, which is the
      exact readability complaint this pass exists to fix, only scroll-triggered,
      and scrolling past the section left all three near-invisible. The arrival is
      now a **one-way** 0 → 1 reveal: a module fades in once and stays at full
      contrast. Progression is the arrow's and the marker's job; the text's job is
      to be readable.
    - **A rotated element keeps its UNROTATED box in layout.** The arrow had
      `width: 100%` plus `rotate(90deg)` for mobile, which painted a ~350px
      vertical line straight through the module and over the text. On mobile it is
      sized absolutely (3.5rem) and the cue row reserves that height; desktop gets
      `width: 100%` and no rotation.
    - **Under `prefers-reduced-motion` the marks were empty.** `--mark` defaulted
      to 0 and the script that fills it never runs, so the three highlighted
      phrases lost their highlight — while the file comment claimed the opposite.
      Inverted: the mark is `background-size: 100%` by DEFAULT and only wipes under
      `.service-contrast--live`, the same call `.pain-hook--journey.is-static`
      makes on the homepage. Verified in both motion states.
  - Verified: rendered text identical to draft lines 32–34; no horizontal scroll at
    320 / 390 / 600 / 768 / 899 / 900 / 1024 / 1440 / 1920; the 899→900 boundary
    flips cleanly; columns measure 40/8/52; reduced motion renders every module at
    opacity 1 with the arrows drawn and the marks filled and never adds `--live`.
- **2026-08-04 — mobile/touch pass over the whole of `/werkschutz/`** (client:
  "pasame toda la sección de Werkschutz a mobile de la forma más coherente…
  tené en cuenta lo que estamos usando en el mobile homepage, y que los textos
  sean los mismos"). Same brief as the homepage's own 2026-07-30 pass: aim for
  EXPERIENCE parity, not visual parity, and redesign a section's layout where
  that is what it takes. **Not one word of copy changed.**
  - **The biggest finding was not a phone problem — it was the 768–1151px band,
    which had no adaptation at all.** The page's phone block stops at 767.98px and
    the Leistungsumfang's desktop split only starts at 1152px, so a touch tablet
    got the base one-column layout: **21.620px of page at 768x1024 — longer than
    the phone's** — plus 21–23 elements under 13px and 13–17 tap targets under
    44px. Everything that is about being touched and read on a held device now
    lives in a `max-width: 1151.98px` block; only genuinely phone-shaped things
    (the reduced editorial inset, full-width buttons, the hero crop) stay at
    767.98px. **Check that band on any new page — it is easy to miss because both
    neighbours look fine.**
  - **Leistungsumfang rebuilt as rows with a side thumbnail** — the worst block on
    the page at 3.384px / 4,0 phone screens, of which 1.398px was six full-width
    3:2 photos. And it had a real UX defect, not only a length one: the base layout
    interleaves step, photo, step, photo…, so **duty 01's photo rendered below its
    own text and directly above duty 02's title**, with nothing saying which it
    belonged to. Both are fixed by the same move — a two-column grid where each
    photo and its duty share one row, the photo as a `clamp(6.5rem, 13vw, 11rem)`
    4:3 thumbnail. That is also the pattern this site already uses for a
    list-with-a-photo-each on a phone (the homepage's services rows, 128x96).
    3.384px → **1.485px**.
  - **The reserved Jäger portrait was owning half a phone screen** — 350x438 of
    empty labelled box. Capped at 9rem on a phone; it still reserves proportional
    space, so there is no CLS when the photo lands. Its label was also hyphenating
    ("[Portrait Alex-ander Jäger folgt]") and is now in the `hyphens: none` list.
  - **A stale entry in the `hyphens: none` list was silently hyphenating German
    compounds.** It still named `.service-scope__list li`, which stopped existing
    when this section became the flow on 2026-08-03 — measured "Koor-dination von
    Fremdfirmen" at 390px. Now `.service-flow__step > p` and its `h3`. Worth
    checking that list whenever a block is renamed; it fails silently.
  - The four Risiko cards keep their isometric scenes at full card width (client:
    "me encantaron") — only the frame is trimmed, 16:10 → 16:9 with one step less
    padding.
  - **The shared lead form is gated at 767.98px in `lead-form.css`**, so in the
    tablet band it fell back to 43px inputs, 12px labels and 17–18px inline links.
    Mirrored into this file's touch block rather than widening the shared query, so
    the blast radius is the three chassis pages (/werkschutz/, /referenzen/,
    /jobs/) and the homepage's tablet rendering is untouched. Values are
    lead-form.css's own. One value DID change in the shared file: the inline
    privacy/phone links went `padding-block: 0.6rem` → **0.75rem**, because 0.6
    measured 40px against the 44 minimum.
  - **Measured before → after**, and desktop is untouched (19.552px at 1440 both
    ways, 3-column flow):

    | width | page before | page after | type <13px | targets <44px |
    |---|---|---|---|---|
    | 390 | 21.836 (25,9 scr) | **19.555 (23,2)** | 5 → **0** | 14 → 3 |
    | 768 | 21.620 (21,1 scr) | **17.848 (17,4)** | 21 → **0** | 13 → 2 |
    | 900 | 18.426 (15,4 scr) | **15.409 (12,8)** | 23 → **0** | 15 → 4 |
    | 1024 | 18.385 (23,0 scr) | **15.477 (19,3)** | 23 → **0** | 17 → 2 |

    No horizontal scroll at 320 / 360 / 390 / 430 / 600 / 768 / 900 / 1024 / 1152 /
    1440. Every remaining sub-44px target is one of two known cases: the
    breadcrumb link (16–17px, a shared pre-existing gap on every page — it needs
    fixing in components.css, not here) and the FAQ `<summary>`, whose "43px" is
    **44 × 0.97**, the `item-reveal` start-state scale caught mid-scrub rather
    than a real size. Worth knowing before chasing it again.
  - **Not done, deliberately:** the 320px page is 33 screens because the copy is
    what it is — this page has 12 sections of real content and shortening it means
    cutting approved text. The remaining length is content, not layout.
- **2026-08-04 — every section eyebrow removed from `/werkschutz/`** (client, all
  ten of them: Risiko, Vorteile, Leistungsumfang, Abgrenzung, Anwendungsfälle,
  Sicherheitskonzept, Kosten, Ansprechpartner, FAQ, Weiterlesen). Each section now
  opens on its H2.
  - **No approved copy was lost.** These were UI furniture this build added to
    match the homepage's language — not one of them came from
    `Webtext 03 Werkschutz.docx`. Same category as the two the client removed from
    `/referenzen/` the day before.
  - **The shared component STAYS in page-service.css.** `/referenzen/` and
    `/jobs/` load that stylesheet as their chassis and both still use eyebrows
    (Kunden, Case Studies / Arbeitgeber, Einstieg, Bewerbung, FAQ, Weiterlesen), so
    `.section-eyebrow`'s `.section--light` variant is still live. What WAS deleted
    is the two werkschutz-only rules that gave the eyebrow its own
    `justify-content: center` in the centred sections (`.service-faq`,
    `.service-compare`) — both are now dead selectors. ⚠️ **If an eyebrow ever
    returns to a centred section on this template, that rule has to return with
    it**: `.section-eyebrow` is `display: flex`, and a parent's `text-align` does
    not move flex children. Left a note at both sites rather than silently
    dropping the knowledge.
  - Verified: 0 eyebrows at 390 / 1024 / 1440 / 1920; **no margin-collapse leak**
    at any section (the /referenzen/ bug where a removed first child let the next
    one's top margin escape a zero-padding section did NOT reappear — probed every
    `main > section` with ≤2px padding-top and no top border); the Abgrenzung and
    FAQ sections are still centred; no horizontal scroll; page 19552px at
    1440x900.
- **2026-08-04 — the Vorteile Gegenüberstellung rebuilt as three contrast
  modules** (client brief: the concept and copy were right but "the UX still feels
  too much like a dark comparison table… the left side looks almost disabled…
  the blurred inactive content feels unfinished"). Same three contrasts, same
  words, desktop and mobile both rebuilt. `.service-contrast__*` in
  page-service.css; no new JS.
  - **The blur had a specific cause, and it was a design bug, not a taste
    problem.** The container carried `data-item-reveal-strong`, and
    js/item-reveal.js's strong preset animates `filter: blur(10px)` on a
    **scrubbed** ScrollTrigger ending at `bottom 60%` — so any row that had not
    reached that point sat permanently half-blurred. Each module now uses the plain
    `data-reveal` primitive **with its blur suppressed** (`.service-contrast__module.u-reveal
    { filter: none }`), because `.u-reveal` also blurs its start state and this is
    the one section where the client named blur as the problem. Measured after:
    `filter: none` on all three modules in every state.
  - **"Looks disabled" was measurable and it was an accessibility failure.** The
    problem side was `rgb(255 255 255 / 0.45)` = **4.40:1** on this section's
    black, i.e. under the 4.5:1 minimum for body text. Now 0.75 = **11.35:1**, and
    it stays the quieter half through size and the solid-white title opposite it.
  - **Each module now says what it contrasts**: a blue `01`–`03` plus a topic
    label, which is what makes the section scannable in a few seconds instead of
    readable in thirty. ⚠️ **Those three words are NEW on this page** —
    "Erreichbarkeit", "Stammpersonal", "Nachweisbarkeit" come from the client's
    brief, not from `Webtext 03 Werkschutz.docx`. Category labels, not claims, but
    flagged in docs/build-checklist.md for Chris.
  - **The labels are in every module in the DOM and hidden VISUALLY ONLY on
    desktop**, with the clip technique from `.visually-hidden`, never
    `display: none`. That is the whole point: the desktop composition wants them
    once as column headings, but `display: none` would drop them from the
    accessibility tree and leave modules 02 and 03 with nothing but visual column
    position to distinguish problem from solution. The visible desktop header row
    is `aria-hidden` for the mirror reason, so nothing is announced twice.
  - Grid is the brief's 40 / 7 / 53 — measured 468/82/620px at 1440 and 280/49/372
    at 900. Mobile is the base layout and the DOM order is the brief's stack:
    topic → "so läuft es oft" → problem → cue → "so läuft es bei FRANKONIA" →
    title → text.
  - **Three fixes that only a screenshot caught:**
    - `#icon-chevron`'s path (`M15 5l-7 7 7 7`) points **LEFT**, not down. The
      first build assumed down and rotated `-90deg` for desktop, which rendered it
      pointing down. It is `-90deg` for mobile (down) and **180deg** for desktop
      (right). It also needs an explicit `stroke-width` — the sprite's own
      attributes live on `<g id="icon-defs">` and do not survive `<use>`, the same
      trap that made every `.service-link__arrow` a filled sliver.
    - `align-items: start` left ~100px of dead black under the two-line problem
      against a four-line solution — exactly the "large empty black areas" the
      brief asks to avoid. `center` balances it and puts the problem on the cue's
      optical line.
    - A `max-width: 34ch` on the problem set it to ~250px inside a 468px column,
      leaving a dead gap before the cue. Removed — the 40 % column is the measure.
      **Same mistake as the Leistungsumfang descriptions one section over**: a `ch`
      cap on top of a column that is already narrow is a double constraint.
  - **The active state is hover/focus only, deliberately not scroll-driven.** The
    brief allows either, but all three modules are usually on screen together, so
    dimming two while the reader is looking at them would be worse than no active
    state. It brightens the blue rule, lifts 2px, raises the problem's contrast and
    fades in a 5 %-blue band that bleeds past the text column — that bleed is
    gated at 900px up, because below it the container's own inset is smaller than
    the bleed and it would mean real horizontal scroll.
  - **Second declared exception on this page to docs/page-conventions.md §2** (one
    size per section title): this H2 tops out at 48px instead of 60, per the
    brief's "reduce the visual size of the heading moderately". Two lines at
    768–1920 (46px at 1440), three on a phone. **If a third section asks for a
    smaller heading, §2 needs revisiting rather than a third exception.**
  - Verified: copy from draft lines 30–34 intact word for word; no horizontal
    scroll at 320 / 390 / 768 / 899 / 900 / 1024 / 1440 / 1920; the 899→900
    boundary flips cleanly; reduced motion renders all three modules at opacity 1
    with no filter; and the old `.service-contrast__table/__row/__cell` rules were
    deleted, including the stale `.service-contrast__cell p` entry in the template's
    `hyphens: none` list, which now names the new selectors (German compounds in a
    40 % column would otherwise start hyphenating again).
- **2026-08-04 — the Leistungsumfang section is now 50/50 editorial
  scrollytelling** (client brief: "a premium 50/50 scroll-driven storytelling
  experience", explicitly DESKTOP AND LARGE TABLET ONLY, mobile left as it was).
  Left half: the heading plus the six duties, revealed one per scroll step and
  **accumulating** — a duty that has been passed stays readable. Right half: one
  sticky image panel, full-bleed to the right edge of the viewport, crossfading
  to the active duty's photo. New `.service-flow--stepped` block in
  page-service.css, `js/service-flow.js` rewritten.
  - **Supersedes the 2026-08-03 clip-path mask wipe.** That one replaced each
    photo while the text scrolled past and away, which is exactly what the brief
    rules out ("do not make the text pass by and disappear"). Deleted, not left
    alongside; git has it. `--flow-title-h`, `--flow-media-drop`,
    `--flow-media-top` and `--flow-intro-bg` are gone with it, including the
    `.section--light` declaration that fed the last one.
  - **Not one word of copy moved**, re-verified by machine after the rebuild: the
    H2, both category labels, the six titles and the six descriptions are the
    draft's, verbatim. The only additions are the desktop-only `01`–`06` markers,
    which are `aria-hidden` (the `<h3>` names each duty) and `display: none` on
    mobile so the current mobile rendering is byte-identical.
  - **The section had to leave `.container`** for the panel to be exactly half the
    viewport and reach its right edge. It is a direct child of the `<section>` now
    and re-creates the container's geometry as its own padding
    (`--flow-page-lead`). Verified at the pixel: the text's left edge equals every
    other section's content edge at 320 / 360 / 390 / 430 / 768 / 1024 / 1151.
    ⚠️ A percentage inside a custom property resolves against the element that
    USES it, so that variable may only ever be consumed by `.service-flow` itself.
    On desktop it is a **grid track**, not padding — as padding, the photo
    column's `50%` becomes "half of what is left".
  - **Three real bugs found by measuring, all worth keeping:**
    - **`max-width: 42ch` on the descriptions was the one that made this look
      impossible.** 42ch at 14px is ~300px, so every 110-character description ran
      to FOUR lines and the list needed ~880px. Removed (the step's own 34rem
      already governs): all six are two lines at every width from 1152px up, and
      the list dropped to 666–785px.
    - **A sticky column only stays stuck while its bottom is inside its
      container**, so the usable pinned distance is `height − band`, not `height`.
      Without that term the six duties shared 3068px at 1440x900 — 511px each,
      i.e. **57vh, under the brief's own 60vh floor** — and the panel slid away
      while duty 06 was still active. `min-height: calc(6 * step + band)` fixes
      it: measured 635px per duty, **71vh**.
    - **No-JS gap I introduced and then closed.** The list lives in a clipped
      viewport-height column, so with the split gated only on the media query, a
      visitor without JS got duty 06 cut off. The WHOLE split is now scoped under
      `.service-flow--stepped`, a class only the script adds — so no JS, a script
      error, `prefers-reduced-motion`, or anything under 1152px falls back to the
      base layout (six text + photo pairs in normal flow). Verified with script
      execution disabled over CDP: six duties and six photos at `opacity: 1`,
      interleaved, nothing clipped.
  - **1152px, not this project's usual 1024 — measured.** The list is sticky, so
    the heading and all six duties have to share one viewport; at 1024px the text
    column is ~400px, the descriptions go to three lines, and the block needs
    ~830px against the ~690px a 768px-tall tablet has.
  - **The per-duty category label is GONE, and that is what made the composition
    work** (client, same day: "hay mucho texto, quiero solo el título y abajo el
    texto"). Each duty is now title + description, nothing else. Removed with it:
    the draft's two group headings as a per-step label ("Im laufenden Betrieb" /
    "Nachts, am Wochenende, an Feiertagen") and the `01`–`06` markers this build
    had added. Markup and CSS both, no dead rules left.
    - **This is approved draft copy leaving the section, on instruction** — worth
      confirming with the client. No FACT is lost from the page: the
      night/weekend/holiday coverage is stated in the FAQ ("Vom reinen Nacht- und
      Wochenenddienst über Randzeiten-Besetzung bis zum durchgehenden Posten"), in
      the Kosten factors, and in the Anwendungsfälle. Checked before removing.
    - **Removed from mobile too**, deliberately: the label lived in the base
      markup, and showing different copy on a phone than on a desktop is worse
      than either choice. If it was meant as a desktop-only edit, say so — it is a
      six-line restore.
    - It bought **138px** back, which is why the fit numbers below are so much
      better than the first build's. It also cost the item its "head": at 18px
      over a 14px description each duty read as one grey block (caught in a
      screenshot), so the title went to **21px at 1440** — ~24px of the 138 spent
      on the hierarchy the label used to carry.
  - **All six duties now fit on one screen from 1440x900 up** — measured at zero
    shift at 1440x900, 1512x900, 1728x1000, 1920x1080. The real-scroll test
    reports `shift=none` at every scroll position there, i.e. the list never has
    to move. Below that the script still slides it by exactly the overflow so the
    ACTIVE duty is always whole, with a masked top edge: 5/6 at 1440x800 (49px)
    and 1280x800 (31px), 4/6 at 1152x700 (99px).
    **So the brief's "at the final step the complete list is visible" is now true
    on any normal desktop**, and degrades gracefully on a short laptop instead of
    clipping. Before the label came out it was 5/6 at 1440x900 with an 88px shift.
  - **One declared exception to docs/page-conventions.md §2** (one size for every
    section title): this H2 tops out at 40px instead of 60. It is the only heading
    on the site that shares a viewport with its whole section's content — at 60px
    the heading alone ran to three lines and the block needed 1260px against 820.
    Mobile keeps the shared clamp.
  - Future duties sit at **0.18 opacity, not 0**: the brief allows "hidden or
    minimally visible", and at 0 the section's first screen was a heading, one
    duty and 400px of white (caught in a screenshot). Past duties are 0.72 — a
    floor, not a look, since the description is already muted at 0.75 alpha and
    the two multiply. The active state carries a blue left rule (a SHAPE, so it
    never depends on hue alone), the blue category label and full contrast.
  - **Verified with real frames over CDP, not virtual time** (which cannot settle
    Lenis — see "Measuring mobile"): active index advances 0→1→3→4→5 with scroll,
    exactly one photo at opacity 1 at every position, past items at 0.72, the
    panel holding at `top: 80px` through progress 1.0, and scrolling back up
    returning to duty 01 with the shift cleared. No horizontal scroll at 320 / 360
    / 390 / 430 / 768 / 1024 / 1151 / 1152 / 1440 / 1920.
  - Cost: the section is ~500px taller than the mask-reveal version; page height
    19631px at 1440x900. Panel size is 720x820 at 1440, so **new photos for this
    section should be ≥1600px wide** — the current files are 751–1200px and
    upscale on a Retina screen (noted in the checklist).
- **Tenth pass, same day — the Kosten section rebuilt as a balanced two-column
  block** (client: "too much empty space, the pricing card feels detached from the
  content, and the left column is too wide"). No copy or figure changed.
  - It was a full-width intro with the factors and the card in a row underneath,
    so the card started far below the heading. Now ONE grid for the whole section
    with named areas: `"intro card" / "factors card" / "hint card"`, 55/45 columns,
    the card `align-self: start` so its top is level with the intro's. Measured at
    1440: columns 643/526px, gap 64px, card top === intro top, intro→factors 40px,
    card padding 36px — all inside the brief's ranges.
  - **The DOM order is the design, not a side effect.** The card sits between the
    intro and the factors in the markup, which is exactly the order the brief
    wants on a phone (price and CTA before the factor list) — done in the DOM
    rather than with `order`, so tab order still matches the screen
    (docs/page-conventions.md §7 warns about precisely that). It reads correctly
    on desktop too: heading → intro → price → what moves it.
  - Factors: ruled rows with a blue `+` as a `::before` (one repeated glyph does
    not need five sprite nodes), `--space-5` vertical padding, and solid
    `--color-gray` instead of the muted token — **9.24:1 on white against the
    4.56:1** the 0.75-alpha muted grey was giving. That was the brief's
    accessibility point and it is now measured.
  - Card: `--radius-md` (not `lg`), no shadow, price at a 40–60px clamp with
    "€/Std." baseline-aligned beside it via `align-items: baseline`, and the CTA
    content-sized rather than stretched.
  - **Two measured bugs on the way, both in the CTA:** `.btn` is
    `white-space: nowrap`, so at 360px the label's min-content (~325px) exceeded
    the card's 272px inner width → 9px of horizontal page scroll; and the fix I
    reached for first (`align-self: stretch`) is a no-op in a block container, so
    the button kept its content width and broke out past the card's right padding
    while the left side still had it. It takes `width: 100%` +
    `white-space: normal` on the phone breakpoint.
- **Price card: glossy black, centred, short dash** (client 2026-08-03, three
  asks in one message).
  - **Black, with the button's gloss.** Was `--color-bg-elevated` (grey #3B4956),
    now `--color-logo-black` plus a faint diagonal lightening of the fill, a 1px
    inset highlight on the top edge, and **the button's own sweep** — reusing
    `@keyframes btn-shine` from components.css rather than declaring a second
    identical animation, the same way `.service-cases__item` does. Softer band
    (0.22 vs the button's 0.42) and behind the content via `z-index`, so it
    polishes the surface instead of washing over the price.
    Side benefit worth recording: white text goes from **9.2:1 on the grey to
    20.9:1 on the black**, and the old "no blue inside an elevated grey card"
    constraint disappears with it, since every brand blue clears contrast against
    black (tokens.css).
  - **Vertically centred** (`align-self: center`), which REVERSES the
    "align the top of the card with the start of the main content area" from the
    same day's rebuild. Verified symmetric: 177px of column above the card, 177px
    below.
  - **En dash → hyphen** in the price: `28–40` → `28-40`. German typography wants
    a Bis-Strich for a range and the client's draft used one, so this is their
    explicit call on the glyph — flagged rather than silently "corrected" back.
    It is the only character on the page that changed.
- **FAQ: the homepage's card design, now a SHARED modifier** (client 2026-08-03:
  "hacé las FAQs igual a las FAQs de la homepage, mismo diseño"). Two columns of
  filled pills with the "+" on the left, instead of the bordered single column the
  shared component ships.
  - This was the **third** page to ask for that look, and page-jobs.css had left
    the instruction for exactly this moment: it had mirrored the homepage's block
    into its own file with a note saying "if a third page asks for this, that is
    the moment to promote it to a modifier in components.css instead of copying it
    again". So: new `.faq__list--cards` in components.css, and **both copies
    deleted** — page-home.css's original and page-jobs.css's mirror. One design
    decision, one place, three pages opting in with a class.
  - Verified no regression by comparing computed styles across all three pages:
    identical columns (504+504px), max-width, fill, radius, padding, border,
    justify-content, answer colour, and `order: -1` on the glyph.
  - **One real collision found by that comparison.** page-service.css has
    `.section--light .faq-item summary::after { color: --color-logo-black }`,
    written for the bordered default where the accent blue fails contrast on
    white. Same specificity as the new card rule but loaded later, so it silently
    won: the "+" came out #010101 on /jobs/ and /werkschutz/ against #3B4956 on
    the homepage — the exact opposite of "same design everywhere". Scoped it with
    `:not(.faq__list--cards)`; all three now measure rgb(59, 73, 86).
  - Also worth recording: my first probe read `getComputedStyle(el, "::after")`
    through a helper that dropped the second argument, so it reported the
    summary's colour and hid this. The numbers only mean something if the probe
    asks the right question.
  - **Not changed:** the section header. The homepage's FAQ heading is centred
    with no eyebrow; /werkschutz/ keeps its left-aligned heading and its "FAQ"
    eyebrow, like every other section on that page. The ask was about the
    accordion; say so if the whole header should follow too.
- **"Verwandte Leistungen und Einsatzgebiete" refined** (client: the structure was
  right but it read as a plain sitemap list). Same copy, same links, same two
  groups — hierarchy, scale and interaction changed.
  - Group titles: 12px regular → **20px bold** uppercase with a 2px blue rule
    above each, so the two groups read as two blocks.
    ⚠️ The title blue is DEEPER than `--color-accent`: in a light section that
    token is blue-dark = 3.71:1 on white, which clears 3:1 for a graphic and for
    large text but not the 4.5:1 for text at this size — 18–20px bold sits right
    on the 18.66px large-text boundary, so relying on it would be relying on a
    borderline number. The `color-mix` is 4.88:1 and reads as the same blue. The
    2px rule keeps `--color-accent` (a graphic only needs 3:1).
  - Rows: `--space-5` vertical padding (81px tall, from ~57), label 16 → 20px,
    thin dividers kept, whole row is the anchor (7 links = 7 tab stops, verified).
  - Arrows: 0.9em → **1.5rem**, blue, centred, and the hover is a 3px
    `translate(3px, -3px)` instead of the old 45° rotation — the icon points
    up-right, so it now travels the way it points (brief: "move it slightly to the
    upper-right", 200–300ms; `--duration-base` is 250ms).
  - Hover/focus: a light blue wash (`--color-accent-subtle`) + the text darkening
    to black, replacing the full white/black inversion these rows had — the brief
    asked for flat and lightweight, not a card.
  - **Two cascade collisions found by measuring, not by looking:** the alternation
    pass's `.section--light .service-related__link:hover` (0,2,0) beat the new
    wash (0,1,1) and loaded later, so the inversion would have silently survived
    the redesign; and `.section--light h3` (0,2,0) beat
    `.service-related__title` (0,1,0), painting the group titles black —
    measured rgb(1,1,1) where blue was intended. Both fixed by matching
    specificity; no `!important`.
  - Heading capped at **44rem, not 34**: at 34rem it broke into three lines at the
    60px ceiling, which costs more vertical space than the full-width version it
    was meant to tame. Its SIZE stays on the shared `main h2` clamp — §2 of the
    conventions is that every section title is one size, and a closing navigation
    block is not the place to open an exception.
  - **Two "optional" items in the brief were deliberately skipped**, with reasons:
    no vertical divider between the columns (the rows' hover wash bleeds
    `--container-padding` past each column edge, so the right column's wash would
    cross a centred divider every time it lit up), and no off-white section tint
    (the section immediately above this one is the black form section, so there is
    nothing to differentiate from).
  - Tested at all eight widths the brief names — 320 / 375 / 390 / 430 / 768 /
    1024 / 1280 / 1440: no horizontal scroll, titles and first rows aligned across
    both columns, row heights consistent (81/82px).
- **Hero proof points now match the homepage's**: three SHORT chips in one row
  instead of three stacked sentences (client 2026-08-03: "los tics tienen que ser
  iguales que la hero... más cortitos y en una sola línea"). Same layout, gaps,
  type and 18px blue ticks as `.hero__reassurance` — verified side by side:
  3 items, 1 row, 18px icons, rgb(61,154,211) on both pages.
  - **Copy was shortened, and only by truncation.** Each chip is a literal
    substring of the draft's own hero line — "Pfortendienst und Rundgänge",
    "Technik-geschulte Kräfte", "24/7 direkt erreichbar" — so no concept and no
    wording was invented. The detail that dropped out of the hero is still spelled
    out in full in the Leistungsumfang and Ansprechpartner sections, so the page
    loses nothing; this is the first time copy on this page was cut, and it was
    the explicit ask.
  - **Moved below the CTAs**, also matching the homepage. That is not only visual:
    js/hero-reveal.js animates `.hero__lead → .hero__actions → .hero__reassurance
    → .hero__trust` in that fixed order, and with the points above the actions the
    cascade played out of sync with the reading order. The DOM now matches the
    script.
  - On a phone the row wraps to three lines, which is the homepage's own behaviour
    at that width — the chips stay chips.
- **FAQ question tracking fixed sitewide** (client: the werkschutz FAQ "tiene muy
  poco letter spacing... quiero que todas las secciones de FAQs tengan la misma").
  - Measured all three FAQ pages first: they were **already identical** on every
    value — gap 16px, question 16px, padding 16/24, item height 72px — because the
    shared `.faq__list--cards` promotion earlier the same day made them so. So the
    difference was not between pages.
  - What was real: base.css tightens EVERY heading by a flat `-1px`, requested for
    display headings. At 48–60px that is about -2%; the FAQ question is **16px**,
    where the same -1px is **-6%** and the letters visibly collide. That is what
    "muy poco letter spacing" describes — the letters too close, not too far.
  - Fixed in `.faq-item summary h3` (components.css), i.e. for **every FAQ on the
    site** at once, which is the second half of the ask: `letter-spacing: normal`
    plus `--line-height-base` instead of the 1.25 heading value, since that element
    is already styled as body text (16px, regular weight). Verified: all three
    pages now report `normal` / 25.6px, and item height is unchanged at 72px, so
    no layout moved.
  - Written into docs/design-system.md §2 as the general rule: a heading that is
    styled as body copy takes body metrics — the -1px is for display sizes only.
- **Ansprechpartner rebuilt: person first, certificates supporting** (client
  brief). It was two parallel text columns of equal weight, which made the section
  read as admin rather than as "here is your contact". Now two zones — a contact
  block with a photo column, then a certification strip under a hairline.
  - **The portrait is a RESERVED FRAME, by the client's own decision.** No photo of
    Alexander Jäger exists in the project (checked the repo and the Desktop). The
    only near-fit is `system-accountable-contact.jpg` — the homepage's "one
    accountable contact" photo of an unidentified man in a suit — and at that size
    beside his name and role, every visitor would read it as him. I asked instead
    of choosing: the client picked the reserved 4:5 frame with a bracketed
    "[Portrait Alexander Jäger folgt]" label. It holds the real space (no CLS, no
    layout shift when the photo lands) and swapping it in is replacing one `<p>`
    with a `<picture>`.
  - **DOM order IS the mobile order the brief specifies** (eyebrow → heading →
    photo → name → role → text → phone → email → certs); the desktop two-column
    arrangement comes from grid areas on top of it, so tab order always matches
    the screen. Same rule as the price block — never `order` for this.
  - Contact details are now two real actions: the phone as an outline pill (the
    hero's own secondary-action treatment, so they read as the same kind of thing)
    and the mail as a quieter underlined action — the priority split the brief
    asks for. Both keep `tel:`/`mailto:` and get hover + focus states.
  - Certification strip: heading, badges at **8.5rem** (from 4.5rem — height only,
    width auto, so the official DEKRA proportions are untouched), and the three
    claims as short ruled lines with the standard name leading
    (`DIN 77200-1` / `DIN EN ISO 9001` / `§ 34a GewO`). Every fact unchanged, just
    split so the standard can carry the emphasis.
  - **One copy change**, and it is the client's own supplied wording: the paragraph
    drops "Ihr Werkschutz-Konzept erstellen erfahrene Sicherheitsexperten". Not
    lost from the page — the Sicherheitskonzept section states it in full.
  - New sprite symbol `#icon-mail`. The mail action was borrowing `#icon-contact`,
    a person silhouette, which is the wrong glyph for an email address. Note the
    two action icons need SEPARATE fill/stroke rules: icon-phone is a filled
    symbol and icon-mail is a stroked one, and neither's presentation attributes
    survive `<use>` — one shared rule renders the envelope as a black blob.
  - Measured at 1440: columns 494/668px, photo frame 416x520 (4:5), badge 136px,
    phone pill 58px tall. No horizontal scroll at 320 / 375 / 390 / 430 / 768 /
    900 / 1024 / 1440.
- **First real visual confirmation of the motion on this page**: one screenshot
  taken WITHOUT forced reduced-motion shows the pixel band mid-dissolve at the
  white→black boundary (jagged tile edge, exactly the homepage look), plus the
  char title reveal and the text blur-in mid-flight. Everything else in this
  build report is still Chrome-headless measurement under forced
  `prefers-reduced-motion` — **the header's light/dark switch over the new white
  sections has not been seen** and is worth the `npm run dev` check.

**2026-07-30 — full mobile pass over the homepage (client brief: "make the
entire homepage feel like it was originally designed for mobile, not simply
shrunk from desktop"; explicit instruction to aim for *experience* parity,
not visual parity, and to redesign a section's layout where that's what it
takes). Every change is scoped inside a `max-width` media query, so the
desktop composition is untouched — verified after the fact (see "Verified"
below).**

Measured before and after on a REAL 390x844 viewport, not by eye — see
"Measuring mobile" below for the harness, which is worth reusing.

- **Konzept cubes — critical defect fixed.** The three diagrams' SVG
  annotations are positioned OUTSIDE the cube's own `0 0 1079 1110` viewBox
  (boxes at x=-250 / x=1050) so the desktop split composition can use the
  space beside the diagram. That only works while the SVG may overflow,
  which is an enhanced-mode (≥1024px) affordance. Below it the SVG clips at
  its box and every label was cut to two or three letters
  ("Abdeckungslü…", "ch"). They are `aria-hidden` decoration, so mobile now
  hides `.kz-tip` entirely and shows a new `.konzept-seq__terms` list — the
  same words as real HTML, which is also **crawlable, unlike the SVG text
  ever was**. Phone: names only, as a wrapped row of hairline-separated
  chips. Tablet (640–1023px): name + description in a two-up grid. Desktop
  hides the HTML list (the SVG does that job there). `--kz-frame` also went
  88vw → 90vw now that no side room is needed.
- **Hero.** The desktop model sizes the hero to the image's natural height
  so the full width of the photo shows uncropped; at 390px that photo is
  only ~234px tall, so it became a band across the top quarter with flat
  black beneath — the least premium possible first screen. Mobile now has
  the image `position:absolute` + `object-fit:cover` over the whole hero
  (`object-position: 68% 42%` holds the operator/monitors), with a vertical
  readability wash instead of the desktop left-side one. Both CTAs go
  full-width and stacked; the reassurance row became a 2-column grid (2 + 1,
  last item spanning) because the wrapping flex row broke 1 + 2 with a
  ragged gap. 813 → 681px, and it now fits one screen with the photo
  present.
- **our-system.** Six cards at the desktop `70svh` ran the section to
  ~4000px — nearly five phone screens — and showed one card at a time, so
  the stack never read as a stack. `52svh` + `aspect-ratio: auto` (with an
  explicit height it only fought the width) → **4003 → 3092px**. A
  `22rem` floor under `max-height: 700px` keeps SE-class phones from
  crowding.
- **sticky-story.** Five metrics in one vertical column ran ~475px and read
  as a plain list. Now a 2-up ruled grid (2 + 2 + 1, last spanning), same
  ruled-not-carded language the ≥1024px row uses. Values step down a size
  because they are `white-space: nowrap` and "1.000.000+" overflowed a
  half-width column. **1225 → 900px.**
- **Services.** Two problems: German compounds were auto-hyphenating
  ("Baustellenbewa-chung", "Sicherheitstech-nik") because base.css sets
  `hyphens: auto` on `li` — correct for prose, wrong for a label — and
  mobile got no imagery at all, since the hover preview panel is
  desktop-only, despite this project having a real unique photo per
  service. Rows are now compact cards: **new 128x96 WebP thumbnails**
  (`assets/images/services-thumb/`, 2–3KB each, **26KB for all ten**),
  number, name, and a persistent arrow (no hover on touch, so the
  affordance must be visible). `display:none` from 1024px + `loading="lazy"`
  means desktop never fetches them — confirmed. **1703 → 1228px.**
  Note `overflow-wrap: anywhere` + `min-width: 0` on the name: with
  hyphenation off, an unbreakable 20-character compound set the row's
  min-content width and caused real horizontal page scroll at 360px.
- **Uniforms — the hover→tap case.** The picker was ABOVE the image, so
  tapping "Polo" changed a photo ~350px further down, off-screen: a control
  with no visible result. `display: contents` on `.outfits__intro` lifts
  the heading, lede and picker into the layout grid so all four can be
  ordered independently (the picker is nested, so grid order on the layout
  alone could not reach it) → heading, lede, image, picker. The
  hover-revealed use-case line now shows for the SELECTED outfit and wraps
  under the name. Toggle 29px → 44px, picker rows → 48px.
- **Social reel.** Three 9:16 cards side by side gave each ~85px of width;
  the previous fix shrank them further (6rem below 400px) because only "fit
  three across" and "wrap 2 + 1" had been considered. Now a snap-scrolling
  strip at 62% viewport per card — one in frame, the next peeking. This is a
  **contained** scroller (`.social__grid` clips itself); the document never
  scrolls sideways, verified.
- **References.** `hyphens: auto` fired on nearly every line
  ("profes-sionellen", "Zutrittskon-trollen", "in punc-to"). Disabled on
  mobile for this section: the result descriptions are *centred*, where
  hyphenation buys nothing, and the real overflow guard is already
  `overflow-wrap: break-word` sitewide.
- **Lead form (primary conversion — got the generous end of every
  trade-off).** 12px labels → 13px; inputs 43px → 48px with `font-size: 1rem`
  **exactly** (anything smaller makes iOS Safari zoom the viewport on focus
  and leave the user zoomed and scrolled sideways); consent checkbox 18px →
  22px with a padded row; submit full-width.
- **Mobile nav IA.** The submenu renders as a permanently-expanded nested
  list below the desktop breakpoint — a deliberate old call (no tap-to-open
  on touch), but it pushed Referenzen / Unser System / Karriere / Kontakt
  **and the header's Sicherheitsanalyse CTA** off the bottom of the open
  drawer. New `initMobileSubmenu()` (js/main.js) injects a real
  `<button aria-expanded aria-controls>` beside the Leistungen link and
  collapses the list, so all five top-level items plus the CTA fit one
  screen. **This supersedes the "permanently-expanded, no extra tap-to-open
  step on touch" note in the Services-submenu paragraph above.** Same
  JS-only-ever-enhances contract as `initNavToggle`: the markup ships
  expanded and this function is the only thing that ever collapses it, so no
  JS / a script error / ≥1400px all leave every service link visible. The
  parent stays a real link to `/leistungen/`; the button is a sibling.
- **Touch targets + micro-type**, collected in one block at the end of
  page-home.css and site-chrome.css (they must win over the component rules
  they adjust): footer links 16–18px → 44px, footer/coverage pills 41px →
  44px, header logo 18px → 44px, `.konzept__link` 28px → 44px. The two
  INLINE links inside sentences (privacy policy in the consent row, the
  tap-to-call number under submit) get vertical padding on an
  `inline-block` instead — the hit area grows, the sentence doesn't move.

**Verified, with numbers:**
- No horizontal scroll at **360 / 390 / 430 / 768 / 1024 / 1440px**
  (`documentElement.scrollWidth === innerWidth` at every one).
- Total page height **19437 → 18297px** — and that is net of everything
  ADDED in this pass (term lists, thumbnails, bigger social cards, taller
  form fields).
- Desktop unchanged, probed at 1440px: thumbnails `display:none`, submenu
  toggle absent, preview panel `display:block`, caret visible, hero image
  back to `position:static` (the natural-height model), hero 912px.
- **Known limit: 320px still overflows by ~37px** in the hero. Not chased —
  this project's own smallest breakpoint is 400px, and every current phone
  (iPhone SE 2/3 included) is ≥360px, which is clean. Fixing it means
  restructuring the hero trust row for a viewport essentially nobody uses.
- **`.coverage__overlay-label` is deliberately 12px**, not the 13px floor
  used elsewhere: it's an uppercase micro-label directly above the city
  name, and 13px made the two compete.
- **Not verified in a real browser** — no browser tool in these sessions;
  everything above is Chrome-headless measurement + screenshots. Standing
  caveat, same as every build this phase.

**Measuring mobile — read this before trying to screenshot a phone layout.**
Two traps cost real time here and will again:
1. **Chrome enforces a ~500px minimum layout viewport.** `--window-size=390`
   gives a 390px-wide SCREENSHOT of a 500px-wide LAYOUT, so content looks
   clipped when it isn't. The hero H1 "cut off at the right edge" was
   entirely this. Run the page in a fixed-width `<iframe>` inside a ≥500px
   window and crop to the iframe.
2. **Scrolling a live page under `--virtual-time-budget` does not settle.**
   Lenis owns the scroll position (`window.__lenis`), ScrollTrigger needs
   real scroll events, and CSS transitions freeze mid-flight under virtual
   time — screenshots came back black with content at `opacity: 0.6`. Don't
   fight it: extract one section into its own page (strip every `<script>`)
   and force `prefers-reduced-motion`, which by this project's own contract
   means no Lenis and no JS hiding, i.e. the honest static layout. Keep the
   iframe at a real phone height (844px) and capture in slices — making it
   as tall as its content feeds back into anything sized in `svh`
   (`--sys-card-height: 70svh` inflated our-system to 4238px vs its true
   4003px).

**2026-07-22 — section-by-section homepage review begins; first round =
hero + nav (implemented, pending visual review).** This is the start of
the section-by-section process recorded in
[docs/project-strategy.md](docs/project-strategy.md) (the strategic
context/decision framework updated the same day lives there and in the
"Strategic direction" note above — read it first). First-round changes,
all in `pages/index.html` (hero) + `partials/header.html` +
`css/tokens.css`/`page-home.css`/`site-chrome.css`, no JS added:
- **Hero reordered** to message → action → reassurance → trust: H1 → lead
  → `.hero__actions` (CTA + phone) → `.hero__reassurance` → `.hero__trust`.
  The DEKRA badges + Google rating (`.hero__trust`) moved from just under
  the lead to the **bottom** of the hero as a distinct trust band, set
  apart by a subtle `border-top` hairline (not a card). **No eyebrow** —
  the hero begins directly with the H1.
- **Temporary client copy** (draft, easy to edit): H1 "Reliable Werkschutz
  for complex industrial operations."; lead about certified personnel /
  digital reporting / one contact; primary CTA "Request Free Security
  Analysis →" (arrow kept). Phone CTA unchanged.
- **Reassurance is now a 3-item `<ul>`** (`.hero__reassurance` /
  `.hero__reassurance-item`), each real HTML text led by a small
  `icon-check` (decorative/aria-hidden — meaning in the text, not colour):
  "Free" · "No obligation" · "Reply within 1 business day". One row when
  space allows, wraps on narrow screens. "Free consultation" intentionally
  dropped (CTA already says "Free"). Was a single middot `<p>` before.
- **New reusable `--content-inset` token** (tokens.css,
  `clamp(3rem, 5.5vw, 6rem)`) = the editorial left inset for primary
  homepage content columns. Applied to `.hero__content` via
  `padding-inline-start` (ADDITIONAL to container padding; box-sizing keeps
  it inside the 44rem cap — no overflow). Mobile override drops it to
  `--space-2` (≈20–24px edge-to-text). **Logo/nav alignment deliberately
  unchanged** — only the hero content column shifts inward. Meant to be
  reused across future homepage sections.
- **Services submenu redesigned to a light editorial panel** (desktop only,
  inside the `@media (min-width: 1400px)` block, site-chrome.css): warm
  white surface (was `--color-bg-elevated`/dark), dark body text
  (`--color-logo-black`), FRANKONIA-blue hover text
  (`--color-blue-dark`) + pale-blue hover wash (`--color-accent-subtle`),
  soft `--shadow-lg`, `--radius-md`, minimal padding, controlled spacing
  (no hard separators between links). Focus ring overridden to blue-dark
  on this panel because the global ring is white (invisible on white).
  **"View all services →" renamed "All Services →"** (header.html), same
  `/leistungen/` URL, slightly emphasised (bold, hairline-separated row).
  All 10 real service links, hover/`:focus-within` reveal, and keyboard
  (Tab/Enter/Escape) behaviour preserved — pure restyle. The mobile
  nested-list treatment (still dark) is untouched. **This supersedes the
  earlier "always-dark floating panel" description elsewhere in this file.**
- **Contrast caveat (flagged, accepted):** blue-dark hover TEXT on white
  ≈3.4:1 — below AA 4.5:1 for small text. Accepted because it's a
  transient hover state, the resting state (black on white) is fully
  accessible, and the client explicitly asked for a blue hover; the
  pale-blue hover background provides the affordance regardless. The blue
  focus-ring on white clears the 3:1 non-text minimum.
- **Lenis NOT present in the codebase** — item #7 of the brief ("make Lenis
  scrolling heavier / adjust the existing config") could not be done: there
  is no Lenis instance to tune (grep confirms only comments in
  pain-hook-journey.js/system-panels.js saying so). Docs approve Lenis
  ("Keep Lenis"), but it was never actually integrated. Adding it fresh is
  a separate, larger task (GSAP/ScrollTrigger sync, the pinned sections,
  reduced-motion, no scroll-trapping) — left for an explicit go-ahead, not
  silently added under "adjust config."
- **Not visually verified** — no browser tool in these sessions; standing
  caveat, same as every build this phase. Check via `npm run dev`.

**Homepage v1 built and extended (`pages/index.html`) + service-page
template + first service page (`pages/werkschutz.html` →
`/werkschutz/`) built 2026-07-15, both pending visual review.** Content
is structural/placeholder (see "Content language" below for exactly which
parts are real vs. placeholder) — neither page has been visually verified
in a browser (no browser/screenshot tool available in these sessions) and
needs a human look via `npm run dev` before either is considered done.

**Do not build the remaining 9 service pages until `/werkschutz/` is
explicitly reviewed and approved as the template** — see "Service-page
template" below for exactly what to reuse and what must change per
service when that approval comes. Do not build city pages, blog, or any
other page type yet either. No JSON-LD, GTM, analytics, cookies, or
reCAPTCHA yet — none of that has been requested for this phase. The build
proceeds in client-reviewed phases (homepage → service template →
service pages → city template → city pages → references → jobs → blog →
details/consent/CRM). See §8 of the guidelines doc for the full sequence.
Don't jump ahead of the current step, and don't scaffold future pages
"for later."

**2026-07-21 Pixel-transition: whole-section scroll entrance effect —
still pending visual review.** Client shared a reference repo,
github.com/J0SUKE/gsap-threejs-codrops (a Codrops/Three.js demo:
"Pixel Image Effect with GSAP and Three.js" — a gallery where each
IMAGE reveals via a WebGL shader as it scrolls into view, then expands
on click). Client's actual request, after discussion: apply that same
"pixel dissolve" look to whole SECTION entrances instead of a single
image — the transition when scrolling from one section to the next,
on several (not all) section boundaries.

- **Technique — explicitly NOT Three.js.** This project excludes
  Three.js/WebGL entirely (see "Non-negotiable tech constraints" —
  "no 3D is happening"). Asked the client directly: recreate the look
  in CSS/GSAP (no WebGL, stays inside existing constraints) or evaluate
  lifting the Three.js exclusion for an exact shader replica. **Client
  chose the CSS/GSAP recreation.** Mechanism (`js/pixel-transition.js`,
  new file, its own `<script defer>` tag, same pattern as
  outfits.js/hero-reveal.js/title-reveal.js/pain-hook-journey.js/
  system-panels.js): a grid of solid tiles (`.pixel-transition`,
  page-home.css) is built entirely at runtime and covers a target
  section; each tile is assigned a random reveal-threshold biased by
  its row (`row/(ROWS-1) * 0.7 + Math.random() * 0.3` — a rough
  top-to-bottom wipe with jitter, not a straight line and not pure
  confetti-random, the same "directional wipe + per-cell noise" idea
  as the shader's `grid.y`/`random(grid)` combination). A single
  `ScrollTrigger` per section, `scrub: 0.3`, `start: "top bottom",
  end: "top 35%"` (a short range right at the boundary, not the
  section's whole scroll-through — deliberately capped so a very tall
  section like `#our-system` (~200vh) doesn't drag the effect out for
  the entire scroll, just its entrance), drives a shared `progress`
  value; each tile toggles a plain CSS `opacity` transition
  (`.is-revealed`) once `progress` crosses its own threshold — reversible
  both ways, since `scrub` naturally re-covers a tile if the visitor
  scrolls back up past its threshold.
- **Scope — 4 of the page's section transitions, client's own pick, not
  every section**: `#trust-metrics` (after Hero), `#our-system` (after
  Pain Hook), `#uniforms` (after Services), `.coverage` (after
  Conversion). Each carries a plain `data-pixel-transition` attribute —
  see the full per-section rationale on Trust Metrics' own `<section>`
  comment in `pages/index.html`, and the shorter pointers on the other
  3. Not applied to Hero, Pain Hook, Services, Uniforms→Social,
  References, Conversion, or FAQ's own entrances — the client explicitly
  scoped this to "varias, no todas."
- **Tile color, one documented exception**: tiles default to
  `var(--color-bg)` (black, matching the page's own dark background —
  the effect reads as content resolving "out of the dark," which fits
  this site's whole black-theme identity well). `#uniforms` (`.outfits`)
  is the one of the 4 target sections with a light `#FAFAFA` background
  (a pre-existing documented exception, see Typography/Corporate
  Identity above) — its own tiles override to `#FAFAFA` via
  `.outfits .pixel-transition__tile { --pixel-tile-color: #FAFAFA; }`
  so they blend into that one section instead of clashing black-on-white.
  `#trust-metrics`/`#our-system`/`.coverage` all use the plain page
  background already (no explicit `background-color` of their own, or
  — for `#our-system`'s `.section--subtle` — `--color-bg-subtle`, a
  3%-white-tinted near-black that's close enough to blend without
  needing its own override).
- **JS-only-ever-enhances, same contract as every other motion primitive
  on this site**: every tile is created by `js/pixel-transition.js` at
  runtime and only ever covers already-fully-visible real content —
  nothing in `page-home.css` sets any of the 4 target sections'
  real markup to `opacity: 0` by default. If this script never runs, or
  `prefers-reduced-motion` is set (checked first, before anything is
  built — same guard pattern as pain-hook-journey.js/system-panels.js),
  no `.pixel-transition` overlay is ever created, and all 4 sections are
  simply, fully visible from first paint — same "never hide content a
  no-JS visitor or crawler needs to see" principle this file has flagged
  and fixed real violations of before (see Pain Hook's own history
  above).
- **Not pinned, no scroll hijacking** — this only scrubs an overlay's
  opacity against native scroll position via `ScrollTrigger`'s own
  `scrub`; it never pins the section or intercepts the scroll itself,
  consistent with this project's "no scroll hijacking" performance rule
  (same reason Lenis was rejected, see "Non-negotiable tech constraints").
  The overlay itself is `pointer-events: none` throughout, so it never
  blocks a click on real content underneath even while a tile is still
  visually covering it.
- **Scoped down to 1 of the 4 sections, same day, real bug found and
  fixed.** Client tested via a real browser and reported "no estoy
  viendo nada" (nothing visible at all). Root cause: `--pixel-tile-color`
  was set to match each target section's OWN background exactly (the
  idea being the tiles would "blend in" when not covering anything) —
  backwards reasoning: a tile the same color as what's behind/around it
  has **zero contrast**, so the covering state and the revealed state
  looked identical the whole time on every one of the 4 sections (all
  either plain black or, for `#uniforms`, the one color it was
  deliberately matched to). Fixed properly, not papered over:
  - `.pixel-transition__tile` now always renders solid black
    (`var(--color-bg)`), full stop — no more per-section
    `--pixel-tile-color` override, and the `.outfits`-specific
    `#FAFAFA`-matching rule was deleted entirely, not just adjusted.
  - Added a small `gap: 3px` between grid cells (`.pixel-transition`) —
    without it, edge-to-edge same-color tiles have no visible seam
    between them at all, so even a *contrasting* tile color would still
    have looked like one solid covering rectangle, not "pixels." The
    real section content shows through these gaps the whole time —
    intentional, reads as a fine scan-line pattern, not a flaw.
  - `data-pixel-transition` removed from `#trust-metrics`, `#our-system`,
    and `.coverage` — client asked to isolate testing to just one
    transition first. **`#uniforms` (Services → Uniforms) is the only
    section currently carrying this effect** — chosen specifically
    because it's the one light-background (`#FAFAFA`) section right
    after a dark one, so solid black tiles read as clear contrast there;
    the other 3 are dark-background sections where solid black tiles
    would still have poor/no contrast even after this fix.
  - **Before re-enabling the other 3**: they need an actual contrast
    strategy, not just restoring the attribute — e.g. a lighter/accent
    tile color for dark sections, or a border/wireframe-only look that
    doesn't depend on a solid fill color at all. Revisit once
    `#uniforms` is confirmed working well via a real scroll test.
- **Third revision, same day — mechanism changed entirely, not just
  tuned.** Client feedback on the above: "no but thats not the idea...
  the idea is that it is when scrolling from a section to another
  section" — the whole-section-entrance model above wasn't actually
  what was wanted, independent of the color bug. Shown two concrete
  options (with ASCII previews) to pin down the exact mechanism before
  touching code again:
  1. "The incoming section arrives pixelated" (the model above, already
     built).
  2. "The pixels live in the seam between both sections" — a band of
     tiles sits at the actual boundary line, covering part of both the
     outgoing and incoming section, and clears as you scroll past it.

  **Client picked option 2.** Rebuilt around this instead:
  - **`.pixel-transition`/`.pixel-transition__tile`/`[data-pixel-
    transition]` (the whole-section model, including the `#uniforms`
    attribute and color fix from the entry above) were removed
    entirely** — not kept alongside the new mechanism. `page-home.css`
    now has `.pixel-seam`/`.pixel-seam__band`/`.pixel-seam__tile`
    instead.
  - **New structure**: a real, empty `<div class="pixel-seam"
    data-pixel-seam aria-hidden="true">` sibling placed directly between
    two `<section>`s in `pages/index.html` (currently only one: between
    Services and `#uniforms`) — not a child of, or attribute on, either
    section. It has real `height: 0` (adds no layout space); its
    `.pixel-seam__band` child (built by `js/pixel-transition.js`) is
    `position: absolute` with `top: -120px; height: 240px` (`-70px`/
    `140px` on mobile), so it straddles the boundary — half overlapping
    the end of the section above, half the start of the section below.
  - **Grid**: 10 columns × 3 rows (was 8×5 for the old whole-section
    model — this band is wide and short, not tall) with a left-to-right
    wipe bias (`col/(COLS-1) * 0.7 + random() * 0.3`, was row-based/
    top-to-bottom before, since a short wide band reads better with a
    horizontal wipe than a vertical one) plus the same per-tile jitter
    and 3px gap as before.
  - **ScrollTrigger**: one `ScrollTrigger.create()` per `[data-pixel-
    seam]` element found (`js/pixel-transition.js` now discovers seams,
    not sections), `trigger: seam, start: "top 80%", end: "top 20%",
    scrub: 0.3` — a modest range centered on the moment the seam crosses
    the middle of the viewport, not tied to either section's own
    scroll-through height (which is what made the old model's range
    awkward on a very tall section like `#our-system` — moot now, since
    `#our-system` isn't part of this feature at all anymore, see below).
  - **Tile color unchanged from the fix above**: solid black
    (`var(--color-bg)`) — still correct here since Uniforms (light) is
    one of the two sections this seam touches.
  - **Scope unchanged**: still only the one Services → Uniforms
    boundary — the client asked to confirm the mechanism works here
    before it's extended to any other section boundary. Extending it
    means adding another `.pixel-seam` div at that DOM position; the JS
    already discovers every `[data-pixel-seam]` element generically, no
    per-instance JS changes needed.
  - **JS-only-ever-enhances**: unchanged principle, new mechanics — the
    seam div is empty by default in real HTML; the script only ever
    appends the band + tiles into it at runtime. No script, or
    `prefers-reduced-motion`, means the div stays empty and invisible,
    and the two sections simply meet with nothing between them.
- **Fourth revision, same day — 3 real bugs found from an actual
  screenshot** (the first real visual evidence this feature got —
  everything before this was code-reasoning only). Screenshot showed
  visible white gridlines cutting across the tiles, overlapping the
  Services list text. Client's diagnosis, in their own words: tiles need
  to be "the same color as the background," they need to be real
  squares "not rectangles," and there need to be "irregularities" like a
  reference screenshot of the original shader demo's own noisy dissolve
  edge. All three were real, fixable bugs, not just tuning:
  1. **Gap removed.** `.pixel-seam__band`'s `gap: 3px` (added in the 3rd
     revision to make tiles "read as a grid") was itself the direct
     cause of the gridlines — a CSS grid `gap` is an empty gutter
     painted with whatever's actually behind it, and since the band
     straddles a dark section (Services) and a light one (Uniforms),
     that gutter showed two different colors depending on which half of
     the band it was in — a literal mismatch, visible as bright lines
     cutting across solid-colored tiles. Removed entirely; tiles now
     sit flush.
  2. **Tiles now colored per-tile by position, not one fixed color.**
     `data-color-above`/`data-color-below` attributes on the
     `.pixel-seam` div (`#010101` / `#FAFAFA` for this one boundary) —
     `js/pixel-transition.js` colors each tile by whether it's in the
     upper half of the band (matches the section above the seam) or the
     lower half (matches the section below). This is what "same color
     as the background" means in practice: a tile reads as a seamless
     continuation of whichever real section is actually behind it,
     instead of one hardcoded color clashing against whichever side
     doesn't match it. Kept as data attributes (not hardcoded per-seam
     logic in JS) so a future seam between a different pair of sections
     can specify its own two colors without touching the script.
  3. **Squares, not rectangles.** The fixed `10×3` grid stretched into
     very wide, short rectangles at real desktop widths (a ~2000px-wide
     band ÷ 10 columns = ~200px-wide cells over an 80px-tall row).
     `js/pixel-transition.js` now measures the band's actual rendered
     width/height (`band.getBoundingClientRect()`, right after
     appending it, before setting real column/row counts) and derives
     column/row counts from a fixed target tile size (`TARGET_TILE_SIZE
     = 48`px) — `Math.round(width / 48)` columns, `Math.round(height /
     48)` rows — so cells are always true squares regardless of
     viewport width. The old `--pixel-cols`/`--pixel-rows` CSS custom
     properties are unchanged as the mechanism, just now set from a
     real measurement instead of a hardcoded literal.
  4. **More irregular reveal threshold.** The per-tile threshold formula
     changed from `bias * 0.7 + random() * 0.3` (mostly a clean
     left-to-right wipe) to `bias * 0.3 + random() * 0.7` (mostly
     random, small residual bias just so the overall motion still reads
     as moving through the seam left-to-right rather than pure
     confetti) — closer to the jagged, static-like dissolve edge in the
     client's reference screenshot.
- **Fifth revision, same day — "still not the same black."** Client
  feedback after the 4th revision's fixes. Root cause: `data-color-
  above="#010101"` on the seam div (pages/index.html) was a hardcoded
  hex literal — provably identical to `--color-bg`'s own value at the
  time it was written, but a literal duplicate all the same, which
  already breaks this project's own rule of never hardcoding a brand
  hex outside `tokens.css` (see Coding & naming conventions) and, more
  importantly, has no structural guarantee of staying identical if the
  token ever changes. Fixed by removing that attribute entirely —
  `js/pixel-transition.js` now falls back to reading the REAL, live
  `--color-bg` custom property via `getComputedStyle(document.
  documentElement).getPropertyValue("--color-bg")` whenever a seam
  doesn't specify its own `data-color-above`, so the tile color is
  structurally the same value the page's own background actually uses,
  not a separately-maintained copy of it. `data-color-below="#FAFAFA"`
  was left untouched — that one **is** a legitimate, already-documented
  hardcoded exception (matches `.outfits`'s own `background-color: 
  #FAFAFA` rule directly, which itself isn't a token — see Corporate
  Identity's Typography section), not a value with a token it could
  duplicate.
- **Extra section padding, same day — client: "eating some part of the
  page."** The seam band's negative offset (±120px desktop, ±70px
  mobile) overlaps real content in both adjacent sections while opaque,
  and neither section had any spare room at that edge before this.
  Added real, permanent `padding-bottom` to `.services` and
  `padding-top` to `.outfits` (both `calc(var(--space-9) + 120px)`,
  `+70px` under the same `max-width: 767.98px` breakpoint as the band's
  own mobile override) — this is actual layout space present at every
  scroll position regardless of whether JS/GSAP ever runs, not a
  JS-applied adjustment, so the covered zone always lands in genuinely
  empty space rather than eating real content either way.
- **Sixth revision, same day — client: "no estas captando el efecto...
  analiza bien la carpeta y aplica lo necesario."** Direct instruction
  to stop iterating on assumptions and properly read the full reference
  repo before touching code again. Read every remaining file not yet
  read in the earlier build report (`media.ts`, `fragment.glsl` in
  full, `vertex.glsl`, `canvas.ts`, `main.ts`) — two real, deeper
  mismatches found between what the shader actually does and what this
  CSS/GSAP recreation was doing, beyond the surface bugs fixed in the
  4th/5th revisions:
  1. **Squares still weren't guaranteed.** The 4th revision computed
     `cols`/`rows` from the band's measured width/height, but divided
     each axis independently (`Math.round(width/48)` vs.
     `Math.round(height/48)`) and let CSS Grid's `1fr` divide the
     remaining space — two independent roundings that can differ by a
     pixel or two per axis, which is exactly what "still not squared"
     was catching. Fixed by using ONE explicit shared pixel size
     (`--pixel-tile-size`, `js/pixel-transition.js`) on BOTH
     `grid-template-columns` and `grid-template-rows` — matching the
     shader's own `squaresGrid()` function, which corrects for aspect
     ratio first, then applies a single scalar `gridSize` to both
     dimensions. `TILE_SIZE` also dropped 48px → 24px, both for a
     closer match to the shader's own grid density and to give the
     sweep-noise effect (next point) enough rows to read as noise
     rather than 2-3 chunky on/off steps.
  2. **The reveal had no actual sweep — it was uncorrelated noise across
     the WHOLE scroll range.** The 3rd/4th revisions gave each tile an
     independent random threshold spanning the full 0-1 progress range,
     which means at any given scroll position, revealed tiles were
     scattered evenly across the entire band with no sense of direction
     — not what the shader does. Rereading `fragment.glsl` closely: it
     has ONE continuous sweep position (`progress`, derived from
     `uProgress`) that moves through the grid; each cell's random
     threshold (`step(1 - height*random(grid), dist)`) only ever matters
     within a narrow band (`height = 0.2`, in the shader's own
     normalized units) around that moving sweep — cells far from the
     sweep are always cleanly revealed (above it) or cleanly covered
     (below it), and the jaggedness only ever lives in that one
     localized, moving zone. This is what actually produces the
     "static"/noisy-edge look in the client's reference screenshot, not
     randomness spread across the whole image at once. Rebuilt
     accordingly: each row now gets a clean "ideal" reveal progress (a
     straightforward top-to-bottom wipe, `row / (rows-1)`), and each
     tile's real threshold is that ideal value plus a small jitter
     bounded to roughly one row's worth of progress-space (`rowStep *
     0.9`, split into a vertical and a smaller horizontal component,
     echoing the shader's 2D `random(grid)`) — so a tile can only ever
     be out of step with its own row by about one row, never scattered
     arbitrarily across the whole band regardless of where the sweep
     actually is.
- **Seventh revision, same day — client: "its not fucking working."**
  Terse, frustrated, no specifics — asked a direct clarifying question
  (what does "not working" mean: nothing visible, a console error,
  something visible but wrong, or the whole page broken) rather than
  guessing an 8th time blind. Client's answer clarified the actual
  issue: the effect WAS visible, but only over Services (the dark
  section above the seam) — because every tile is a single fixed color,
  and the 6th revision's per-half color-matching made the Uniforms half
  match Uniforms' own white background too, so THAT half was just as
  invisible as the Services half, defeating the entire point. Client's
  own words: "los pixeles son negros... tendria que estar arriba de la
  seccion blanca" (the pixels are black, so it should be positioned
  over the white section).
  - **Split coloring removed entirely.** Every tile is now one fixed
    color — `var(--color-bg)` (black) — set directly in a plain CSS
    rule (`.pixel-seam__tile`, page-home.css), not computed per-tile in
    JS. `js/pixel-transition.js` no longer reads `data-color-above`/
    `data-color-below` at all; both attributes are gone from the seam
    div in `pages/index.html`.
  - **Band repositioned to sit ENTIRELY inside Uniforms**, not
    straddling the boundary. `.pixel-seam__band`'s `top` changed from
    `-120px` (straddling half into Services, half into Uniforms) to
    `0` (starts exactly at the boundary, extends only downward into
    Uniforms) — height unchanged (240px desktop / 140px mobile). Since
    every tile is black, this is the only positioning that makes sense:
    black tiles are only ever visible against Uniforms' light
    background, so the previous straddle wasted half the band's height
    sitting invisibly over Services.
  - **Padding adjusted to match.** `.services`' extra `padding-bottom`
    (added for the straddling version) was removed entirely — the band
    no longer touches Services at all. `.outfits`' extra `padding-top`
    increased from `+120px`/`+70px` (half the band, back when only half
    sat inside this section) to the band's FULL `+240px`/`+140px`,
    since the whole band now lives inside this section.
- **Not yet visually verified** — no browser tool in these sessions,
  same standing caveat as every other build this phase, and still true
  after seven revisions: every single one has been driven by a bug
  report or a direct question, never a confirmed-working look. The
  `top 80%` → `top 20%` scroll range, the `TILE_SIZE`/jitter values, and
  the exact `240px`/`140px` band height are all still analytically
  picked.
- **Eighth revision — first real visual confirmation this feature has
  ever gotten.** Client sent an actual screenshot showing the jagged,
  static-like dissolve edge working (the 6th/7th revisions' fix), with
  one correction: the wipe direction should be flipped ("es la otra
  vuelta, los pixeles desaparecen al reves"). Fixed in
  `js/pixel-transition.js`'s reveal loop: `idealProgress` changed from
  `row / (rows - 1)` (row 0, at the boundary, revealed first; the last
  row, deepest into Uniforms, revealed last) to `1 - row / (rows - 1)`
  (inverted — the deepest row now reveals first, the row at the
  boundary reveals last). Nothing else about the mechanism changed.
- **Not yet re-verified after this flip** — no browser tool in these
  sessions. This is the first revision built on top of an actual
  confirmed-partially-working state rather than a bug report describing
  brokenness, which is real progress, but the direction flip itself
  hasn't been seen yet — worth a quick confirmation via `npm run dev`
  that it now reveals the way the client expects.
- **Ninth revision — client: "too much height."** Band height (and
  `.outfits`' matching `padding-top`) cut in half: 240px → 120px desktop,
  140px → 70px mobile (`.pixel-seam__band`/`.outfits`, both
  page-home.css — the two must stay in sync, see each rule's own
  comment). Nothing else about the mechanism changed; `TILE_SIZE`'s own
  24px is unchanged, so this also means fewer rows now (~5 desktop, ~3
  mobile, down from ~10/~6) — still enough for the jitter-based
  sweep-noise to read as noise, just a shorter band overall.

**2026-07-21 References testimonials redesigned — centered, compact,
masonry — still pending visual review.** Detailed client brief (no
actual screenshots came through with the request despite it referencing
two — flagged to the client at the time; proceeded from the brief's own
very thorough text spec, which fully specifies composition, spacing,
and method). Brief: the section reads too wide/stretched/spaced-out;
wants centered, compact, editorial, masonry-puzzle feeling instead of a
standard card grid. Scoped to `.references` only, per the brief's own
"do not redesign unrelated sections."

- **Files changed**: `css/page-home.css` only — no HTML or JS changes,
  content (3 real testimonials, avatars, Google icon, stats) completely
  untouched, per the brief's own "preserve existing review content."
- **Layout method**: CSS multi-column (`columns: 2` + `break-inside:
  avoid` on `.testimonial`) — already what this section used since the
  2026-07-20 masonry restyle, and explicitly the brief's own "preferred"
  approach, so the underlying mechanism didn't change, only spacing/
  sizing. No fixed heights were introduced anywhere, per the brief's
  explicit "do not fake the masonry layout."
- **New container width**: `.references .container { max-width: 75rem;
  }` (1200px) — a new rule scoped to just this section, overriding the
  sitewide `.container`'s own 1440px (`layout.css`) rather than changing
  that shared token. Lands in the brief's own recommended
  "~1180-1280px" range.
- **Header re-centered**: `.references__intro` was a left-heading/
  right-lede 2-column grid (matching `#trust-metrics`' own split, added
  2026-07-17) — reverted to a single centered flex column (eyebrow,
  heading, lede stacked, `gap: var(--space-3)`, 12px), same composition
  `.social__intro`/`.faq__intro` already use elsewhere on this page.
  `.section-eyebrow`'s shared `display: flex` needed an explicit
  `justify-content: center` addition — same gotcha already documented on
  `.trust-metrics__intro`'s own eyebrow.
- **Spacing tightened throughout** (brief's own recommended ranges hit
  in every case):
  - Header-to-grid gap: was two stacked margins (intro's inherited 64px
    `margin-bottom` + results' 64px `margin-top` = 128px combined) — now
    a single 48px gap, controlled from one place (results' `margin-top`
    only; intro's own margin-bottom zeroed out).
  - Results-to-testimonials gap: 96px → 48px.
  - Column gap: 32px → 24px (brief: "~20-28px").
  - Card-to-card vertical gap: 32px → 24px (brief: "~20-28px").
  - Card padding: 32px → 24px (brief: "moderate... not excessive").
  - Card border-radius: 16px → 8px (brief: "moderate rounded corners") —
    same less-soft direction this project has taken elsewhere (e.g.
    `.pillar-card`'s own radius reduction) for similar briefs.
  - Header-to-avatar-row and quote-to-stars gaps also tightened (24px →
    16px each).
- **Grid/masonry structure with only 3 real cards**: the brief describes
  an asymmetric left/right composition (e.g. "left: medium + taller;
  right: tall + medium + optional shorter") that implies more cards than
  this section actually has. With exactly 3 real testimonials and no
  invented ones added to fill both columns evenly (this section has its
  own documented history of avoiding fabricated content — see Corporate
  Identity above), CSS columns' natural balancing already distributes
  them 2-in-one-column/1-in-the-other rather than a strict 2×2 matrix —
  which is the "puzzle, not a rigid grid" feeling the brief asks for,
  achieved without any artificial height or manual reordering.
- **Responsive**: 1 column below 640px, 2 columns at/above (unchanged
  breakpoint) — matches the brief's "preserve two columns if there's
  enough width" for tablet. Mobile (<640px) gets one additional step
  down in padding (24px → 16px) and radius (8px → 4px), per the brief's
  own "reduce border radius and internal padding slightly" on mobile.
- **Content reordered**: none. **Assumptions made**: proceeded without
  the two referenced screenshots (never arrived) — every specific number
  above was chosen to land inside the brief's own stated ranges, not
  measured against an actual reference image.
- **Not yet visually verified** — no browser tool in these sessions,
  same standing caveat as every other build this phase.

**2026-07-21 Outfit viewer name-picker restyled again — still pending
visual review.** Client feedback on `.outfits__name-btn` (the Polo/
Pullover/Vest/etc. list): names a bit too big, disliked the blue-text +
bold + underline active/hover state, and wanted the same
`icon-arrow-diagonal` sprite arrow the Services Overview list uses.
- **Font size** stepped down one notch, `--font-size-xl` →
  `--font-size-lg`.
- **Hover/active state replaced entirely.** The old
  `color: var(--color-blue-dark); font-weight: 600; border-bottom-color:
  var(--color-blue-dark)` treatment is gone — client: "no me gusta el
  hover azul y bold... prefiero fondo negro y tipografia blanca, la
  flecha y el texto." Now a solid black fill (`background-color:
  var(--color-logo-black)`) with white text, same "invert the whole
  row" idea as `.services__item`'s hover (Services Overview, this
  file), just inverted the other direction since this section sits on a
  light background instead of a dark one. `padding-inline: var(--space-4)`
  + a matching negative `margin-inline` let the fill bleed slightly past
  the text's own edges without shifting where the text lines up
  relative to the heading/lede above it (same compensating-margin
  pattern used elsewhere on this site, e.g. `.hero`).
- **New arrow**: each button now has a real
  `<svg class="outfits__name-arrow icon"><use href="#icon-arrow-diagonal">`
  (same shared sprite symbol as `.services__item-arrow`), pushed to the
  row's far end via `margin-left: auto`. Same up-right-at-rest,
  rotates-to-straight-right-on-hover mechanism as Services' arrow, but
  colored the other way around: black at rest (visible against this
  section's light background), white on hover/active — Services' arrow
  is white at rest specifically because that section sits on the dark
  page background; each is colored for whatever it actually rests on,
  not a literal copy of the other's color values.
- **Not yet visually verified** — no browser tool in these sessions,
  same standing caveat as every other build this phase.

**2026-07-21 Coverage Areas: interactive Leaflet map — still pending
visual review.** Client brief: replace the plain city-pill list with a
real interactive map (Leaflet.js + OpenStreetMap, no account/API key/
token/billing — see "Non-negotiable tech constraints" above for that
approval) where selecting a city draws its **actual administrative
boundary** as a polygon, not a generic circle, and the map animates to
fit it.

- **Files**: `pages/index.html` (Coverage Areas section — map container
  + overlay added, the 10 pill links gained `data-coverage-city` hooks
  but keep their real `href`s unchanged; Leaflet CSS/JS + new
  `<script>` added to `<head>`), `css/page-home.css` (`.coverage__map*`/
  `.coverage-marker*`/active-pill state), new `js/coverage-map.js`
  (homepage-only), new `assets/js/vendor/leaflet.js` +
  `css/vendor/leaflet.css` (self-hosted, v1.9.4, downloaded once from
  unpkg — same pattern as GSAP/fonts), new
  `assets/data/coverage-boundaries/*.geojson` (10 files).
- **The 10 locations** (final, approved list — no Kronach, no
  Lichtenfels, nothing beyond these): Bamberg, Nuremberg, Würzburg,
  Erlangen, Fürth, Schweinfurt, Bayreuth, Coburg, Ansbach, Hof. Same
  cities/URLs this section (and the footer) already used.
- **Boundary data — how it was actually obtained.** The brief's own
  instruction was explicit: fetch real boundaries once "during
  development," save them locally, and never call a geocoding API at
  runtime. Fetched all 10 directly from Nominatim (OpenStreetMap's
  geocoding service — free, no key) via a one-time Python script in this
  session, respecting Nominatim's rate-limit policy (1 request/second,
  a real identifying `User-Agent` header sent with every request — see
  the script's own UA string for the exact wording). **This needed real
  verification, not a blind first result**: several cities' first-match
  result was wrong or missing a polygon —
  - Würzburg/Erlangen/Ansbach's structured `city=` query returned a
    result with no `geojson` polygon at all; switched to Nominatim's
    free-text `q=` query instead, which returned a proper Polygon/
    MultiPolygon for all three.
  - **Fürth's structured query initially matched the wrong place
    entirely** — a same-named village ("Furth (VGem), Landkreis
    Landshut") in Lower Bavaria, nowhere near the real Fürth next to
    Nuremberg this project means everywhere else. Caught by checking
    the returned `display_name`/coordinates against the already-known
    correct coordinates before saving anything; a corrected free-text
    query ("Fürth, Bayern, Deutschland") returned the right one
    (lat/lon matching this file's own `coverageLocations.fuerth.center`).
  - Ansbach and Fürth's result lists both also contained the
    surrounding **rural district** ("Landkreis Ansbach" /
    "Landkreis Fürth") as a separate candidate — a real but wrong
    answer for "the city itself" (kreisfreie Stadt vs. Landkreis are
    different administrative areas in Bavaria) — explicitly filtered
    out by display name before picking a result.
  Each saved `.geojson` file is a plain GeoJSON `Feature` (not the raw
  Nominatim response) with `properties.osm_display_name` kept for
  future auditing. Sizes range ~30-102KB (Nuremberg, the most complex
  boundary, is the largest). Coordinates: GeoJSON files keep the
  GeoJSON-spec `[longitude, latitude]` order untouched;
  `js/coverage-map.js`'s own `coverageLocations` object uses Leaflet's
  `[latitude, longitude]` order for marker/view centers — the two were
  never reconciled/reversed into each other, per the brief's explicit
  warning not to.
- **Loading + caching — changed 2026-07-21, see the "All" default-view
  addendum below.** Originally only Bamberg's boundary loaded on initial
  page load; now all 10 load upfront (client request to default to an
  "All" view). Every city's `.geojson` still goes through the same
  `fetch()`-once/`boundaryCache` `Map` path — selecting the same city
  (or "All") again never re-fetches. A monotonic `activeRequestId`
  counter (the brief's own suggested "request tracking" approach, not an
  `AbortController`) makes sure that if a visitor clicks through several
  cities faster than their fetches resolve, only the response matching
  the *last* click is ever allowed to touch the map — every earlier,
  now-stale response is silently dropped when it arrives.
- **View transition**: `map.flyToBounds(boundaryLayer.getBounds(), {
  padding: [40, 40], duration: 1.4, maxZoom: 13 })` — the brief's own
  suggested call, verbatim. `prefers-reduced-motion` swaps this for
  `map.fitBounds(bounds, { animate: false, maxZoom: 13 })` instead (the
  brief's own explicit reduced-motion instruction) — no zoom value is
  ever hardcoded per city; it's always derived from that city's real
  boundary size via `getBounds()`.
- **Fallback**: if a boundary fetch ever fails (bad path, offline, etc.),
  the map doesn't break — it falls back to that city's plain center
  coordinate via `flyTo`/`setView`, the marker and pill still activate
  normally, and the overlay's secondary line changes to "Boundary
  temporarily unavailable." The real error is only ever
  `console.warn`'d, never shown to a visitor.
- **Responsive**: map height is 420px (mobile) → 500px (768px+) → 600px
  (1024px+), inside the brief's suggested ranges at each step. City pills
  stay the existing wrapped two-row grid at every width (not a
  horizontal-scroll strip — the brief offered either, this project
  already had the wrapped-grid pattern working and it doesn't overflow).
- **Real links, not JS-only buttons**: every one of the 10 city pills is
  still a genuine `<a href="/sicherheitsdienst-<city>/">` — unchanged
  from before this map existed. `js/coverage-map.js` only adds a `click`
  handler on top (`preventDefault()` + drive the map instead of
  navigating). If that script ever fails to load, every pill still works
  exactly as a plain link to its (not yet built) city page, same as it
  already did. `aria-current="true"` marks the active one — the correct
  ARIA pattern for "the current item in a set of choices" on a real
  link. The one "All" button (added 2026-07-21, see below) is the single
  exception — it's a real `<button>`, not an `<a>`, since it has no page
  of its own to navigate to, and uses `aria-pressed` instead, which
  *is* spec'd for buttons specifically.
- **Attribution**: OpenStreetMap's attribution control is untouched, in
  its default bottom-right corner; the new overlay panel is deliberately
  top-left specifically so the two can never overlap.
- **Tile style switched to dark, same day** (client follow-up right
  after the build report: "is there a way to make the map other
  color?") — from plain OpenStreetMap raster tiles (colorful) to
  CARTO's free "Dark Matter" basemap
  (`{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`), which
  matches the site's dark theme far better. Still no account/API
  key/billing — verified with `curl -sI` (HTTP 200 for both the plain
  and `@2x` retina tile URLs) — CARTO's basemap tiles are free and
  keyless for this kind of use, same as raw OSM tiles; the map is still
  rendered from OpenStreetMap data underneath, so the attribution
  string now credits both OpenStreetMap **and** CARTO (required by
  CARTO's own attribution terms). `detectRetina: true` added at the
  same time for sharper tiles on high-DPI screens — `{r}` only ever
  resolves to `@2x` or an empty string depending on the display, never
  a literal unsubstituted token, so this is safe unconditionally.
  Polygon/marker colors (FRANKONIA blue, `#3D9AD3`) already read well
  against a dark basemap and didn't need changing.
- **Overlay copy simplified, same day**: "Selected coverage area" →
  "Coverage area" (client request) — only the small uppercase label;
  the city name and the "Administrative area"/fallback-message line
  below it were unchanged at the time — **that sub-line was removed
  entirely in a later same-day follow-up, see below.**
- **"All" default view, added 2026-07-21 (client request: "por defayl
  se muestren todas... deberia haber un boton con all y ahi se ve el
  mapa de mas lejos con todas las ciudades coloreadas").** A new pseudo-
  city id (`ALL_ID = "all"` in `js/coverage-map.js`) that draws every
  real city's boundary at once, as a single `L.featureGroup` of 10
  `L.geoJSON` layers (same blue styling as a single city — brief asked
  for "colored," not per-city distinct colors), fit into view via the
  same `flyToBounds`/`fitBounds` pattern as a single city but with a
  lower `maxZoom` (11, vs. 13 per-city — fitting 10 cities at once needs
  a much wider view) and tighter padding (16px animated / 12px reduced-
  motion, vs. 40px/24px per-city). Both were tuned once, same day,
  after the client saw the first result and asked to "amplialo un
  poquito porque estan muy lejos" (zoom in a bit, they read as too far
  apart) — `maxZoom` went 10→11 and padding was cut roughly in half
  from the initial pass. Neither value can ever clip a city out of
  view: `fitBounds`/`flyToBounds` always computes the exact zoom needed
  to contain every polygon in the `featureGroup` first, then this
  padding/cap only controls how much margin surrounds that — so "zoom
  in more" here specifically means "less empty margin," not "risk
  cutting off a city." This is now the page's default state on load,
  replacing the old Bamberg-only default — see the "Loading + caching"
  note above for the resulting perf trade-off (all 10 boundaries now
  fetch upfront instead of just one).
  - **UI**: a new `<button type="button" data-coverage-city="all">All
    </button>` (`.coverage__pill--all`, page-home.css), prepended as its
    own first `<li>` — deliberately NOT folded into the existing
    footer-matching 6+5 two-row city split, so that split (real
    navigation links only) stays untouched. Styled with an always-blue
    border + bold text so it reads as a distinct view toggle, not one
    more city.
  - **ARIA**: this is the one pill on the whole map that's a real
    `<button>`, not an `<a>` — it has no page of its own to link to (the
    old "All Coverage Areas" link to `/einsatzgebiete/` was removed
    entirely, separately, earlier the same day). `setActiveButton()` in
    `js/coverage-map.js` now branches on `tagName`: `aria-pressed` for
    this one button, `aria-current` for the 10 real `<a>` links, same
    distinction CLAUDE.md already documents elsewhere for this project.
  - **Markers**: all 10 city markers stay visible (as they always have);
    `setActiveMarker(null)` clears every marker's `.is-active` state
    while "All" is selected, since no single city is more current than
    the rest.
  - **Overlay copy**: while "All" is active, the panel reads "All
    Cities" (city-name line only — see the panel-simplification
    addendum right below, which removed the sub-line this originally
    also set).
  - **Initial map view**: before the "All" boundaries finish loading,
    the map's very first paint uses a hardcoded rough region center/zoom
    (`REGION_CENTER`/`REGION_ZOOM` in `js/coverage-map.js`, not derived
    from anything) — `drawAllBoundaries()`'s real `fitBounds()` corrects
    this within moments once the actual polygons load, same brief loading
    state (`.is-loading`, dimmed tiles) as any single-city fetch.
  - **Fallback**: if any boundary fetch fails, the map falls back to the
    same `REGION_CENTER`/`REGION_ZOOM` via `flyTo`/`setView`, same as a
    single-city failure — see the panel-simplification addendum below
    for why this no longer also shows an "unavailable" message; the
    error is still `console.warn`'d either way.
- **Overlay panel repositioned + simplified, same day (client:
  "pone este cuadrado de texto a la derecha porque el mas menos lo
  tapa y saca el texto de abajo").** Two changes to `.coverage__overlay`
  (page-home.css) and its markup (pages/index.html):
  - **Moved top-left → top-right.** Leaflet's default zoom control
    (`+`/`−`) also lives top-left, and was sitting on top of this panel —
    moving the panel to the opposite corner is the fix, not repositioning
    the zoom control. Still doesn't collide with Leaflet's attribution
    control (bottom-right) — top-right and bottom-right never overlap.
  - **Sub-line removed entirely** — the panel is now just the small
    "COVERAGE AREA" label + the city name (or "All Cities"), full stop.
    The `<p class="coverage__overlay-sub">` element, its CSS rule, and
    every JS reference to it (`overlaySubEl`, `DEFAULT_SUB_TEXT`,
    `FALLBACK_MESSAGE`) were all removed from `js/coverage-map.js` —
    this also means a failed boundary fetch no longer shows "Boundary
    temporarily unavailable" anywhere on the page; the map still
    recovers visually (falls back to that city's/region's plain center
    view, per the Fallback notes above and elsewhere in this section),
    the error just isn't surfaced in copy anymore, only via
    `console.warn`. If a future brief wants error-copy back, it needs a
    new element to write it into — nothing currently listens for it.
- **Not yet visually verified** — no browser tool in these sessions,
  same standing caveat as every other build this phase. This is the
  single most worth checking of anything built so far: confirm the tile
  layer actually loads its map images, boundary polygons render in
  reasonable positions, and the fitBounds animation looks right for at
  least a few cities of very different sizes (Nuremberg vs. Ansbach)
  before calling this done.

**2026-07-20 first motion pass (client direction via Chris, following the
GSAP/Lenis tech-constraint revision above) — still pending visual
review.** Two changes, both aimed at the newly-approved "Apple-like"
feel:
- **Section headings now fade/slide in on scroll, not just the content
  below them.** Every `.section__intro`-style heading wrapper on the
  homepage (`trust-metrics__intro`, `pain-hook__intro`, services'
  `section__intro`, `social__intro`, `references__intro`,
  `coverage__intro`, `faq__intro`) and on `/werkschutz/` (all 8
  `.section__intro` blocks + `.service-cta__content`) picked up
  `data-reveal` — before this pass only the content grids/lists inside
  those sections had it, so headings just appeared instantly with the
  page. No new CSS/JS needed; this reuses the existing `.u-reveal`
  system exactly as designed (see "Accessibility & motion foundation"),
  just applied more completely. `.outfits__intro` and `.conversion__info`
  were already covered as part of a larger `data-reveal` block and didn't
  need touching.
- **`.u-reveal`'s easing changed** from `--easing-standard`
  (`cubic-bezier(0.4, 0, 0.2, 1)`, a symmetric material-style curve) to
  a new `--easing-premium` (`cubic-bezier(0.16, 1, 0.3, 1)`, tokens.css)
  — an expo-out curve with no overshoot, ported from the Sacramentum
  Advisors reference project (a different Filamento project inspected
  specifically for its motion/smoothness techniques). `--easing-standard`
  is untouched and still backs ordinary hover/toggle transitions
  (e.g. the header's light/dark scroll swap) — the new token is
  scoped to content-arriving-into-view moments only.
- **`initStatCountUp()` widened from 3 elements to every `.stat__value`
  sitewide** (`js/main.js`) — previously scoped to just the
  `.trust-metrics__list` numbers; now also animates the "Real Results
  From Our Customers" figures (`€25,000` / `30%` / `20%`). The parsing
  regex was widened at the same time to accept an optional prefix (`€`)
  as well as a suffix (`+`, `%`) — previously suffix-only.
- **First real GSAP moments landed, two files**: `js/hero-reveal.js`
  splits the hero `<h1>` into words, each masked in an overflow-hidden
  span, animated up into place once on page load (not scroll-triggered
  — the hero is always in view at first paint). `js/title-reveal.js`
  (added same day, right after — the first pass only covered the hero,
  and every other section heading still just appeared instantly with a
  barely-visible 16px CSS fade; client feedback: "I'm not seeing all the
  titles appear like that") extends the identical word-mask treatment to
  every other `<h2>` on the homepage, this time via ScrollTrigger so each
  one plays as it scrolls into view (`start: "top 88%"`,
  `toggleActions: "play none none none"` — plays once, doesn't reverse).
  Both are the "small set of deliberate motion moments" the tech-
  constraints revision above approved GSAP for; the underlying
  `.u-reveal` CSS system is untouched and still separately fades in the
  content grids/lists and the heading wrappers' lede text.
  GSAP core + ScrollTrigger are vendored self-hosted at
  `assets/js/vendor/gsap.min.js` / `ScrollTrigger.min.js` (v3.15.0,
  downloaded once from unpkg, no CDN reference at runtime — same
  self-hosting pattern as fonts), each loaded via its own
  `<script defer>` in `pages/index.html`'s `<head>`, same pattern as
  `js/outfits.js`. Both new scripts guard for `typeof gsap`/
  `typeof ScrollTrigger === "undefined"` and `prefers-reduced-motion`,
  and only ever rewrite a heading's real text into word/span markup from
  inside the script itself — a no-JS visitor or a crawler that doesn't
  execute JS sees the plain, complete, unsplit heading, same JS-only-
  ever-enhances contract as every other motion primitive on this site.
  Homepage-only so far — `/werkschutz/`'s `<h2>`s still only have the
  plain CSS `data-reveal` fade from earlier in this same pass; add these
  two scripts there too once there's a specific reason to.

**2026-07-20 Trust Metrics section redesigned as one centered B2B trust
experience — still pending visual review.** Client brief (reference: a
"Trusted by industry leaders"-style page, used only for composition/
spacing direction, not copied literally). New order: centered eyebrow +
one consolidated heading/lede → existing 3 metrics → real client-logo
subsection → existing 6 value pillars, now with their own heading.
Refined twice more the same day — see the two follow-up notes below this
one for the single-heading consolidation and the real logos landing.

- **DEKRA badges moved back to the hero**, next to the Google rating —
  reverses the 2026-07-17 decision that had moved them out to this
  section. Fresh classes (`.hero__trust`/`.hero__badges`/`.hero__badge`),
  explicitly not a restore of the old deleted `.hero__cert-seal`/
  `.hero__badges` (same "treat a comeback as a fresh request" precedent
  this file already uses for the header-transparency flips). This
  section no longer shows certification badges or the Google rating at
  all — it's metrics/logos/pillars only, per the brief.
- **Intro centered**: `.trust-metrics__intro` was a 2-column grid
  (heading left, copy right, added 2026-07-17) — now a single centered
  column, `max-width: 44rem` (brief's 620-720px target). The eyebrow
  needed an explicit `justify-content: center` — `.section-eyebrow`'s
  shared default is `display: flex` for its icon+text pairing, which a
  parent's `text-align: center` doesn't affect.
- **Client-logo subsection — RESOLVED same day, real logos now in
  place.** Initially built as placeholders (no client logo files existed
  anywhere in this project at first check). Client then supplied the
  real files into `assets/images/Logos/` (3 service-line subfolders —
  "1. Bereich Werk- und Objektschutz", "2. Baustellenbewachung",
  "3. Veranstaltungsschutz" — spaces in every folder/file name, each a
  1017×1017 square PNG padded with a lot of surrounding white/opaque
  background, not transparent). 8 were requested by name: DB Netze,
  Aldi (Süd), Stadt Bamberg, Norma, ADAC, Bayernwerk, BRK, Liapor.
  Visually inspected each one before use (all already sit on opaque
  white — none needed a dark/inverted swap). Cropped every one to its
  actual content bounding box (Python/Pillow — no ImageMagick available
  in this environment; trimmed against a white background via
  `ImageChops.difference`, +12px margin) and saved into `assets/icons/`
  as `client-<name>.png` — clean lowercase-dash names per this project's
  file convention, and out of the raw working folder (which stays as-is,
  not deployed — `dist/` only ever contains what `pages/*.html`
  reference). Real `<img>` tags now, with real dimensions from the crop
  and descriptive `alt` text per company. Dropped the `--featured`
  bigger-tile variant from the earlier placeholder pass — none of the 8
  was singled out as more important than the rest, so all render at the
  same size in one even, centered, wrapped row. White tiles
  (`--color-white`), no shadow, `--radius-sm`, a subtle hover lift —
  unchanged from the placeholder pass, just now holding real content.
- **Consolidated to one heading, same day, second correction** ("vamos
  a dejar solo un título"): the separate "Trusted by companies across
  the region" subsection heading + lede that used to sit right above the
  logo grid are gone. Both lines of copy ("Trusted by leading companies
  and institutions." / "Long-term security partnerships across
  industry, infrastructure, retail and the public sector.") moved up
  into `.trust-metrics__intro` as two stacked `.trust-metrics__text`
  paragraphs, under the section's one remaining heading. That heading
  itself changed too — "Security you can trust." → "Trusted Across<br>
  The Region", a literal client-specified 2-line break (`<br>`, not a
  responsive wrap), reference: a Cantor8-style "Trusted by industry
  leaders" page shown directly to confirm the exact composition.
- **Value pillars**: added the "What Clients Can Expect" heading above
  them (new, centered, white, sits on the darkened photo). Added a real
  dark overlay over the background photo for the first time —
  `.trust-metrics__cards-bg::before`, a flat `rgb(1 1 1 / 0.55)` wash;
  there was no overlay at all before this, the photo sat fully exposed
  behind the cards. `.pillar-card`'s border-radius reduced from
  `--radius-lg` (16px) to `--radius-md` (8px) per the brief's "reduce
  excessive rounding if currently too soft." Copy/icons/6-card content
  completely untouched, per explicit brief instruction.
- **Mobile**: added a horizontal divider between stacked metrics
  (`border-top`, there was no divider of any kind on mobile before —
  only the desktop view had the vertical hairlines). Logo tile sizing
  switched to `clamp()` instead of a fixed rem width specifically
  because two ~11rem tiles plus their gap would have overflowed a
  ~375px phone otherwise.
- **Not yet visually verified** — no browser tool in these sessions,
  same standing caveat as every other build this phase. The dark photo
  overlay's exact strength and the logo-placeholder composition in
  particular are worth a specific look via `npm run dev`.

**2026-07-20 "Free Security Analysis" redesigned as a full editorial
split-screen — still pending visual review.** Client brief: redesign
this section (reference: a Glassmoon-style split contact page) into a
black-left/white-right, full-viewport-height composition — confirmed
*before* building that this stays the existing homepage section
(`#sicherheitsanalyse` in `pages/index.html`, same place in the scroll)
styled to feel like an immersive landing moment, not a new page/URL.

- **Structure**: `.conversion` dropped `.section`/`.container` entirely
  (deliberate — this section needs to be full-bleed, no max-width, no
  padding-block rhythm) and is now two `.conversion__panel` children in
  a CSS grid, each `min-height: 100vh` from 768px up. Left = black,
  quiet eyebrow/headline/lede (headline down from a full sitewide h2 to
  its own small `clamp(1.75rem, 1.4rem + 1.5vw, 3.25rem)` scale — brief:
  "not oversized"), abstract SVG visual, then "20 minutes · Free · No
  obligation" microcopy pinned to the bottom via `justify-content:
  space-between`. Right = white (`--color-white`, the same token every
  other light section on this page already uses — see below), the form.
- **Content removed from the left column**: the old "What's included"
  3-item checklist is gone entirely, per explicit brief instruction
  ("Do not include... a long bullet list on the left"). That content
  isn't preserved anywhere else on the page — flagging in case it's
  needed again later.
- **Abstract visual** (`.conversion__visual`, inline SVG, no raster
  image, no GSAP): disconnected grey line fragments + an open corner
  bracket on the left ("unclear current setup"), one continuous path
  running left→right whose stroke fades from grey to `--color-accent`
  via an SVG `<linearGradient>` (this is what carries the brief's
  "fragmented → ordered" transition, not a second element), a couple of
  small circle "nodes" (only the risk-marker and endpoint ones are
  blue — brief: "one or two highlighted points"), and a cleaner
  rectangle-corner fragment on the right. Entrance animation is plain
  CSS `@keyframes` (a `stroke-dashoffset` draw + a small opacity/stagger
  fade, both `animation-fill-mode: forwards`, neither looping) —
  deliberately not GSAP, per the brief's explicit ask to avoid that
  dependency for this one graphic. `prefers-reduced-motion` needs no
  extra rule: `motion.css`'s existing blanket
  `animation-duration: 0.01ms` override already neutralizes both
  animations the same way it does everything else on this site.
- **Form redesign**: the old bordered `.conversion__form-card` box is
  gone — fields now sit directly on the white panel with a thin
  bottom-border only (no fill, no rounded box), small uppercase labels
  above each field, blue underline on focus. All scoped under
  `.conversion__form .form-field*` so the *shared* `.form-field`/
  `.form-checkbox` components (components.css) are untouched for any
  future reuse elsewhere on the site. Same field set, names, types,
  `autocomplete`, `required` attributes, and `action="#"/method="post"`
  placeholder as before — there was no submission JS to preserve beyond
  native HTML5 validation, and none of that changed.
- **Submit button**: new `.conversion__submit` modifier on the shared
  `.btn.btn--primary` — overrides the shared pill `border-radius` down
  to `--radius-sm`, and cancels CSS Grid's default `justify-self:
  stretch` (which, combined with `grid-column: 1/-1`, is what made the
  old button stretch full-width) so it sizes to its own content instead,
  per the brief's "width based on content, not full width." Reuses the
  same `icon-arrow-diagonal` sprite symbol the Services list's hover
  arrow already uses (static here, no rotation).
- **Color**: brief asked for "warm white / very light neutral gray" for
  the right panel. This project's five-brand-color system (Corporate
  Identity, CLAUDE.md) has no such hue, and this build did not introduce
  one — `--color-white` (the same token References/Outfits/FAQ already
  use for their own "light mode") is what's used instead.
- **Known edge case, flagged not fixed**: `data-nav-theme="light"` is on
  this section so the header gets its frosted dark-text look while
  scrolling past it — but `initHeaderScrollTheme()` (`js/main.js`)
  treats a whole section as one boolean (light or not), and this section
  is genuinely *half* black / half white, which that shared, sitewide
  function was never built to represent. It may switch the header's
  theme slightly earlier/later than ideal relative to which half is
  actually behind it. Fixing that would mean changing shared global JS
  used by every page — out of scope for "only redesign this page," left
  as a flagged limitation instead. Worth a specific look via `npm run
  dev`.
- **Not yet visually verified** — no browser tool in these sessions,
  same standing caveat as every other build this phase. The abstract SVG
  visual in particular is the one piece here that's hardest to judge
  correctly without actually seeing it rendered.

**2026-07-20 New section: "Our System" (`#our-system`), between Pain
Hook and Services — still pending visual review.** Client brief: a
premium scroll-driven 6-outcome section, sticky two-column layout (fixed
intro left, six panels scrolling past on the right, one "active" at a
time). Copy is 100% client-approved and used verbatim — nothing
invented. Numbered "2.5" in the section-comment sequence (same
convention as 1.5/4.5/6.5), not a renumber of everything after it.

- **Files**: `pages/index.html` (new section only), `css/page-home.css`
  (`.system*`, new block right after Pain Hook's), new
  `js/system-panels.js` (homepage-only, own `<script defer>` tag, same
  pattern as the other GSAP moment files), one-line addition of
  `id="uniforms"` to the existing Outfits `<section>` (had no id before
  — purely additive, that section's own content/behavior is untouched)
  so panel 01's "Explore uniforms" link has a real target.
- **Interaction, desktop/tablet (≥1024px)**: `.system__intro` is a
  plain native CSS `position: sticky` (zero JS) that stays put while
  `.system__panels` (six panels, each `min-height: 30vh` — six of these
  plus gaps is what produces the brief's ~180-240vh scroll distance, no
  section-level pin needed at all) scrolls past. Each panel gets its own
  `ScrollTrigger` with `toggleClass`, adding `.is-active` (full opacity,
  slight scale-up) whenever that panel crosses the viewport's vertical
  center, removing it once it scrolls past — previous panels dim
  (`opacity: 0.45`) rather than disappearing, matching the brief. No
  scrub, no manual GSAP tweens for this part — `toggleClass` + a plain
  CSS transition is the whole mechanism, deliberately simpler than Pain
  Hook's path-scrub since nothing here needs frame-by-frame progress.
- **Mobile/tablet-narrow (<1024px)**: no sticky column (grid collapses
  to one column, intro renders first in normal flow, panels stack
  below), no active/dimmed emphasis — each panel just fades in once
  (`ScrollTrigger` with `once: true`) as it's scrolled to, matching the
  brief's simpler mobile fallback. The "Explore uniforms" link stays
  exactly where it is in panel 01, no special-casing needed.
- **Reduced motion**: checked before any `ScrollTrigger` is created — if
  set, the function returns immediately and does nothing at all. This
  works because every panel is already fully visible by default (see
  `.system__panel`'s own comment, page-home.css) — the "simple static
  stack" the brief asks for under `prefers-reduced-motion` **is** the
  default, unanimated state, same JS-only-ever-enhances contract as
  every other motion primitive on this site. This also means a no-JS
  visitor or a crawler sees the section fully readable regardless.
- **Placeholders**: all six panels use one shared `.system__panel-media`
  box (`aspect-ratio: 4/3`, bordered, reserves its own space — no CLS
  when a real `<img>` replaces it later). Panels 01-05 hold a
  `[Placeholder — …]`-style label describing what photo belongs there
  (same bracketed-placeholder convention as `/werkschutz/`'s
  `.service-reference`). **Panel 06 is the one exception** — its
  "visual" per the brief is literally the 4-step text flow (Issue → Root
  cause → Corrective action → Resolved), which doesn't need a future
  photo at all, so it's rendered as real content in the same-shaped box,
  not a placeholder label. Rendered as a *vertical* stack with a small
  down-arrow between steps rather than the brief's inline horizontal
  arrows — at this box's real rendered width (42% of the right column),
  four full phrases don't fit legibly in one row without shrinking past
  this section's type scale; flagged as a judgment call, easy to revisit.
- **No Lenis**: same flag as the Pain Hook build above — this brief also
  assumed an existing Lenis integration (modeled on the same other
  Filamento project). This project has none; built against native
  scroll + ScrollTrigger only.
- **Echo of a removed section, not a revival**: the old "Six Value
  Pillars" section (also six items, heading also started "Less
  Effort...") was removed outright 2026-07-13 (see Corporate Identity
  above). This new section's content is genuinely different
  (client-approved specific outcomes, not generic pillars) — flagged
  here only because the phrasing echo is close enough to be worth
  knowing about.
- **Not yet visually verified** — no browser tool in these sessions,
  same standing caveat as everything else in this phase. The `min-height:
  30vh` per panel is a soft floor tuned to hit the brief's target scroll
  distance analytically, not from an actual measurement — check the
  real scroll feel via `npm run dev` before calling this done, and
  adjust that value if six panels end up running noticeably longer or
  shorter than ~180-240vh in practice.

**2026-07-20 Pain Hook redesign — "patrol journey," still pending visual
review.** Client brief: redesign only the "Facing these challenges?"
section (`#pain-hook`) into a premium scroll-driven interactive
experience — an abstract security-patrol route moving through 4
checkpoints — without touching any other section, the 4 problems' copy,
the CTA copy, or the global design system. Same copy, same CTA, all new
markup/CSS/JS.

- **Files touched**: `pages/index.html` (section markup only),
  `css/page-home.css` (`.pain-hook__grid`/`.pain-item*` removed
  entirely, replaced with `.pain-hook__journey`/`.pain-hook__item`/
  `.pain-hook__route`/`.pain-hook__progress` etc. — see that file's own
  header comment on the block), new `js/pain-hook-journey.js`
  (homepage-only, own `<script defer>` tag, same pattern as
  outfits.js/hero-reveal.js/title-reveal.js), one-line change to
  `js/title-reveal.js` (skips `[data-no-title-reveal]`, now set on this
  section's own `<h2>` so its calm entrance doesn't fight the flashier
  word-cascade that script gives every other heading).
- **Interaction, desktop/tablet (≥1024px)**: `.pain-hook__journey` is
  GSAP ScrollTrigger-pinned for `window.innerHeight * 1.4` (~140vh,
  brief's "120-160vh") while a two-layer SVG path (`viewBox="0 0 100
  100"`, `preserveAspectRatio="none"` — every coordinate is directly a
  % of the wrapper) draws via `stroke-dashoffset`, scrubbed 1:1 with
  scroll. A single `WAYPOINTS` array in the JS is the sole source of
  truth for the route's shape — it flags which waypoints are
  checkpoints, and each checkpoint's scroll-progress *threshold* is
  computed as that waypoint's cumulative path-length fraction, which is
  what guarantees a node always activates exactly as the drawn line
  reaches it (not an approximation/manually-tuned pair of numbers). The
  same waypoints set each `<circle>` node's `cx`/`cy` at runtime, so the
  4 staggered problem blocks (positioned via matching % `top` values in
  CSS) always line up with their node. Previous nodes dim
  (`.is-passed`, reduced-opacity blue) rather than disappearing once a
  later one activates, per the brief. CTA gets a subtle lift+shadow
  (`.is-active`) near the end of the scrub, not a visibility gate — it's
  always in normal document flow below the pin, never hidden.
- **Mobile/tablet-narrow fallback (<1024px)**: no pin, no SVG path at
  all — `.pain-hook__route` is `display:none`, replaced by a plain
  `.pain-hook__progress` track + blue fill whose `height` is tied
  directly to a non-pinned scrub (`start: "top 80%", end: "bottom
  70%"`) through the section's natural height. Same 4 problem blocks,
  now stacked in normal flow, same reveal logic (opacity/y), just no
  node/path visuals.
- **Reduced motion**: `js/pain-hook-journey.js` checks
  `prefers-reduced-motion` before creating *any* ScrollTrigger — if set,
  it just adds `.is-static` to the section and returns; `page-home.css`
  shows the completed route/progress-fill/nodes declaratively. The 4
  problem blocks need no special-casing at all for this, because —
  **important architectural point, read before touching this section
  again** — they are NOT hidden by default CSS. `.pain-hook__item`/
  `.pain-hook__icon` are fully visible in the raw HTML/CSS, exactly like
  every other JS-enhanced reveal on this site (`.u-reveal`,
  `initScrollReveal()` in main.js). `js/pain-hook-journey.js` is the
  *only* thing that ever hides them, via `gsap.set()` (an inline style),
  and only inside the branch that's actually going to animate them back
  in. A no-JS visitor, a crawler that doesn't execute JS, or a script
  error anywhere before this file runs all see the section fully
  visible and readable. (An earlier draft of this section got this
  backwards — CSS defaulted the items to `opacity: 0` — which would have
  permanently hidden real content if the GSAP scripts ever failed to
  load; caught and fixed before shipping, flagged here so a future edit
  doesn't reintroduce it.)
- **Performance**: only `stroke-dashoffset` (paint, not layout),
  `opacity`, and `transform` (`translateY`, `scale`) are ever animated —
  nothing here can trigger a layout recalculation. One documented
  CSS/GSAP interaction to know about: `.pain-hook__item`'s desktop
  position is set via `top` (a %, matching its checkpoint), deliberately
  *not* via `transform: translateY(-50%)` centering, because
  `js/pain-hook-journey.js`'s reveal tween also animates that same
  element's `transform` (the 20px slide-in) — GSAP resolves whatever
  transform is currently on the element to a plain pixel matrix and
  replaces it wholesale on every tween, so a CSS-authored percentage
  transform used for centering would get silently erased the first time
  the reveal completes. Keeping `top` and `transform` each doing exactly
  one job avoids that.
- **No Lenis**: the brief assumed an existing Lenis integration to
  reuse (modeled on a different Filamento project, "Sacramentum
  Advisors," that does use it). This project has no Lenis anywhere —
  see "Non-negotiable tech constraints" above, Lenis was explicitly
  evaluated and rejected 2026-07-20 (scroll-hijacking risk). This
  section was built against native scroll + ScrollTrigger's own `scrub`
  instead; flagging here rather than silently adding Lenis to match the
  brief's assumption.
- **Not yet visually verified** — no browser tool in these sessions,
  same standing caveat as everything else in this phase. The waypoint
  geometry/checkpoint alignment in particular needs an actual `npm run
  dev` look before this is considered done.

**2026-07-17 homepage revision pass (via Chris) — summary, still pending
visual review like everything else in this phase.** A large batch of
client-driven tweaks landed on `pages/index.html` in one session; the
full reasoning for each lives in inline CSS/HTML comments at the point of
change (`css/page-home.css`, `css/site-chrome.css`, `css/components.css`,
`partials/header.html`), this is just an index so nothing gets missed on
review:
- **Nav** (`partials/header.html`): "About Us" removed; "Innovation" and
  "Jobs" added with deliberate `href="#"` placeholders (routes not
  confirmed yet — do not wire these up without checking first); "Coverage
  Areas" also later removed. Nav links are now centered in the header row
  independent of the logo/CTA button (`.site-nav__list`, absolutely
  positioned). The link matching the current page is marked via
  `aria-current="page"`, set at runtime by `initActiveNavLink()`
  (`js/main.js`) since the header partial has no per-page knowledge of
  its own. **It used to draw a filled gray pill; since 2026-08-03 it is a
  blue underline with no fill** (client: "este fill horrible... solo
  underlined con el azul del CTA") — the same underline the nav already uses
  on hover, so the current page reads as permanently hovered. On the frosted
  light header the underline switches to `--color-blue-dark`, since #3D9AD3
  on white is ≈2.6:1, under the 3:1 minimum for a UI boundary. See
  `a.site-nav__link[aria-current="page"]` in site-chrome.css; the
  page-scoped copy that /kontakt/ carried since 2026-07-31 was deleted in
  the same change. Header CTA button is chunkier (`.btn--lg`) with a trailing
  arrow ("Request Analysis →"); this and every other `.btn` also got
  slightly narrower side padding sitewide (`components.css`).
- **Hero**: phone number (`tel:+499519643520`) is back, styled as an
  outline pill (white 1px stroke, solid white icon) next to the CTA —
  see "Current state" under Shared header/footer architecture above for
  the full history of this reversal. `.hero` is `min-height: 100vh` now,
  so the background photo always fills the whole first screen.
- **Two new sections**: a "Security you can trust." trust-metrics band
  right after the hero (`#trust-metrics` — heading left/copy right/three
  metrics below: 25+ Years of Experience, 300+ Satisfied Customers,
  1,000,000+ Service Hours, in that left-to-right order) and a "Coverage
  Areas" section directly above FAQ (`.coverage` — reuses the footer's
  exact 10 city links + `/einsatzgebiete/`, for in-body SEO value).
  Neither existed before this pass.
- **Removed entirely**: the old "Certified Quality" trust section (DEKRA
  seals, 4 metrics, full-size review card, WCB/Deutscher Mittelstands-Bund
  mention) — see the "Trust elements" note under Corporate Identity below
  for why this is flagged as a real gap against the guidelines, not just
  a routine cleanup.
- **Value Pillars cards** (`.pillar-card`): bigger corner icon (4.25rem),
  the underline divider under each title removed (markup + CSS, not
  hidden), title font-size bumped and weight reduced to `600`, body text
  weight set to `350` (both literal numbers — no token sits at those
  steps, and both are only approximately reliable under the system
  Helvetica/Arial stack, see Typography below), body text no longer
  truncated to 3 lines. **Then moved entirely**, later the same day: the
  "Six Value Pillars" section ("Less Effort. More Security.") that used
  to hold these 6 cards was removed outright, and the cards now live
  inside `#trust-metrics` instead — see `.trust-metrics__cards` in
  `page-home.css`. Same markup/classes, just a fluid 3/2/1-column grid
  now instead of the old fixed-300px flex-wrap row (that sizing existed
  for a "heading left, cards right" layout `#trust-metrics` doesn't
  use). Homepage section numbering in `pages/index.html`'s own
  `<!-- === N. NAME === -->` comments was renumbered afterward to close
  the gap. **Card internal layout simplified again, same day, second
  correction**: back to a plain top-to-bottom flex flow (icon → title →
  description, matching DOM order — no more `position: absolute` icon
  or bottom-aligned text block). `min-height: 280px` + `padding: 2rem` +
  `border-radius: 16px` (`--radius-lg`, was a hardcoded 1.5rem) +
  `.pillar-card__text { flex: 1 }`, combined with the grid's default
  `align-items: stretch`, is what now keeps every card in a row equal
  height regardless of title/description length.
- **`#trust-metrics` also got, same day, then corrected**: a
  client-supplied photo (`assets/images/Monitores.png` →
  `trust-monitoring-room.webp/.jpg`, 1200×1200) — first added as a small
  contained `<picture>` below the cards, then corrected the same day to
  a full-bleed CSS `background-image` behind the whole card grid instead
  (`.trust-metrics__cards-bg`, `page-home.css`), using the same
  negative-margin/compensating-padding technique as `.hero` biting into
  the header. Also added: a count-up animation on the three stat numbers
  (`initStatCountUp()`, `js/main.js` — plain `IntersectionObserver` +
  `requestAnimationFrame`, no library; this project doesn't use
  GSAP/Framer Motion/React, see "Non-negotiable tech constraints" above
  — deliberately chosen over installing one when a reference
  implementation for this exact effect was supplied built with those).
- **Pain Hook** ("Facing these challenges?"): all four card
  titles/descriptions rewritten; icons unchanged. Its own CTA button
  matched to the same chunkier + arrow treatment as the hero/header
  buttons.
- Typography switched sitewide from self-hosted Open Sans to a system
  Helvetica/Arial stack — see Corporate Identity → Typography below,
  this is the single biggest change in the pass and affects every page,
  not just the homepage.

**Current homepage section order (`pages/index.html`), post-pass:** Hero
→ 1.5 Trust Metrics (heading/text, DEKRA badges, 3 stats, 6 pillar cards
on a full-bleed photo background, — see below) → 2 Pain Hook → 3 Services
Overview → 4 Uniforms/Outfit Viewer → 4.5 Social Media → 5 References →
6 Conversion → 6.5 Coverage Areas → 7 FAQ. There is no section 3 in the
old numbering anymore ("Six Value Pillars") — section comments were
renumbered to stay sequential rather than leaving a gap.

**4.5 Social Media** (`.social`, added 2026-07-17) — a "story reel" of 3
vertical placeholder cards (middle one wider/taller, "featured"), format
adapted from a client-supplied reference screenshot of a different
company's testimonial section. Client explicitly asked for these to stay
plain placeholder rectangles (`.social__placeholder`, solid
`--color-bg` + a CSS-drawn play glyph, no image asset) standing in for
real social videos not yet available — captions under each
(On-Site Patrol / Night Shift Briefing / Team Training) are deliberately
generic content-type labels, not invented names/dates, specifically to
avoid repeating the References-testimonials mistake flagged elsewhere in
this file. The CTA button below ("Follow Us on Social Media") is
`href="#"` — client said the real destination isn't decided yet
("después vemos a dónde va"); update both the label and href once a real
social profile is confirmed. Originally placed directly after References
(position wasn't specified by the client, chosen and asked back to
confirm, client deferred the call) — moved same day, client request, to
directly *before* References instead, renumbered "4.5" (was "5.5") to
match its new spot between Uniforms and References.

**Second revision pass, later the same day (2026-07-17) — hero
refinement + a coverage-area icon swap.** The brief was explicit: refine
the existing hero only, don't redesign it, don't touch the hero image/
layout/spacing/typography *system*, don't change any other section
(the Trust Metrics/Coverage Areas edits below are the two narrow,
explicitly-requested exceptions to that).
- **H1 shortened and de-emphasized**: "Certified security for businesses
  across Franconia and Bavaria" (was "Security services for Bamberg,
  Franconia and Bavaria"), and its own clamp shrunk from 2.5rem–4rem to
  2rem–3.25rem (`.hero__content h1`, `page-home.css`) — no longer reuses
  a size close to the sitewide "main h2" scale, deliberately smaller now
  so it doesn't compete with the photo.
- **DEKRA badges moved out of the hero entirely**, to `#trust-metrics`
  (`.trust-metrics__badges`) — "directly below the hero," per the brief.
- **Google rating is now the hero's only trust element** — repositioned
  from a top-of-column badge row (removed, see above) to below
  `.hero__lead` / above `.hero__actions` (`.hero__rating`, thin spacing
  wrapper only).
- **Phone CTA visually demoted**: dropped `.btn--lg` from its class list,
  smaller `font-size` (`--font-size-sm`), less padding, and both its
  border and text opacity lowered (white at 0.35/0.85 alpha instead of
  solid) — explicitly so it reads as clearly secondary next to the blue
  primary CTA, which is untouched.
- **Reassurance list collapsed to one line**: "Free consultation · No
  obligation · Reply within 1 business day" — was 3 separate `<li>`s,
  each with the client-supplied `tic-check.png`. Now a single `<p>` with
  one `icon-check` sprite icon (blue, `currentColor` — the PNG it
  replaced had a fixed baked-in color and couldn't be tinted) and
  middot-separated text, muted rather than white.
- **Left-side hero gradient strengthened**: `.hero__bg::after`'s
  `to right` gradient went from a flat two-stop (0.55 → 0) to a
  three-stop falloff (0.78 → 0.5 → 0) — darker at the far-left edge,
  same 48% fade-out point, right side of the photo (guard/vehicle) still
  completely unfiltered.
- **Nav label**: "Innovation" → "Our System" (`partials/header.html`) —
  text only, still an `href="#"` placeholder, no other nav item touched.
  **Superseded twice on 2026-08-03**: the item was first wired to
  `/#our-system` (the homepage section — there was never a page behind it), then
  **removed from the nav entirely** at the client's request, in both headers
  actually in use (`header-de.html` / `header-en.html`). The nav is now
  Leistungen · Referenzen · Karriere · Kontakt, every one of them a real page.
  Only the unused legacy `partials/header.html` still carries the bare `#`.
- **Coverage Areas pin icon replaced**: the shared sprite's `icon-pin`
  (client reported it as "feo"/ugly in this specific spot) swapped for a
  client-supplied `assets/icons/icon-location.svg` (fixed white fill,
  used as an `<img>` like the Pillars/service-page icons, not a sprite
  `<use>`). Scoped to `.coverage__pill` only — the footer's separate
  city-pill list still uses the shared `icon-pin` sprite symbol and
  wasn't part of this request.

## Non-negotiable tech constraints

- Static HTML + CSS + vanilla JavaScript only. VS Code, Claude Code, GitHub,
  Vercel.
- No React, Vue, Astro, Next.js, WordPress, purchased themes, or any large
  frontend framework.
- No unnecessary JavaScript dependencies. **Revised 2026-07-20 (client
  decision via Chris)**: the client wants a more "Apple-like" feel in
  key moments — cleaner, more premium micro-interactions — and confirmed
  trading a small amount of the performance budget for that. GSAP (core
  + ScrollTrigger, MIT/free since Webflow's 2025 acquisition) is now
  approved, but scoped: a handful of deliberate motion moments (hero,
  section transitions, maybe the outfit viewer), not a wholesale
  replacement for the existing `.u-reveal`/`initScrollReveal()` system —
  reach for CSS transitions first, GSAP only where CSS genuinely can't
  do the job (e.g. a coordinated ScrollTrigger sequence). AOS is still
  not approved (ScrollTrigger covers what it would have done). GSAP must
  be self-hosted (same pattern as fonts — no CDN), loaded via
  `<script defer>`, and every animation it drives must still respect
  `prefers-reduced-motion` (`motion.css`) and never gate content
  visibility for no-JS/crawler contexts, same as the current scroll-reveal
  system.
- **SUPERSEDED 2026-07-22 (client, Christoph) — Lenis and WebGL are now
  approved, selectively.** The two paragraphs' worth of "Lenis is
  explicitly NOT approved" / "Three.js/WebGL remain out of scope, no 3D
  is happening" that used to sit here (2026-07-20) reflected the earlier,
  narrower direction and are no longer the rule. The historical reasoning
  is preserved in git and in [docs/project-strategy.md](docs/project-strategy.md);
  the current stance:
  - **Lenis (smooth scroll) is allowed** where it supports the premium
    feel, provided it respects `prefers-reduced-motion`, does not block
    the main thread, and never makes content visibility, navigation, or
    conversion depend on it (a no-JS/crawler visitor must get normal
    native scrolling and full content). It initializes once — never
    multiple instances.
  - **WebGL is allowed only to create a specific, meaningful premium
    moment** — never site-wide, never as constant background animation,
    never with important text or links inside the canvas, and always
    lazy/conditionally loaded after critical content, with a static
    fallback and reduced complexity (or none) on mobile. "Use WebGL only
    where it earns its cost" — a decorative full-page 3D scene does not
    qualify. This does **not** reopen React/Vue/Next.js or heavy app
    frameworks — those stay out (see the rule above); it's scoped to
    self-hosted, lazy-loaded visual/motion libraries used at specific
    moments.
  - The full motion/WebGL rules (init once, prefer transform/opacity,
    no layout thrashing, static fallbacks, mobile reduction, lazy-load
    optional modules, don't load heavy experiences before critical
    content) are in [docs/project-strategy.md](docs/project-strategy.md)
    — follow them. This also supersedes the client guidelines doc §9
    line "No AOS, no GSAP for standard scroll animations unless we
    discuss it": it has now been discussed and approved.
- **Added 2026-07-21 (explicit client brief) — Leaflet.js is approved,
  scoped to the homepage Coverage Areas map only.** This is a real
  external JS library, not a CSS-adjacent animation helper like GSAP
  above — a genuinely new category of exception, called out separately
  on purpose. Requirements the brief was explicit about, all satisfied:
  no account, no API key, no token, no billing, no Mapbox, no Google
  Maps — OpenStreetMap's raster tile server and Nominatim (the latter
  used exactly once, offline, during this build, never at runtime — see
  the Coverage Areas entry in "Current phase" below for exactly how) are
  both free, keyless services. Self-hosted, same as GSAP/fonts:
  `assets/js/vendor/leaflet.js`
  + `css/vendor/leaflet.css`, no CDN. Do not reach for Leaflet (or any
  map library) anywhere else on the site without the same kind of
  explicit go-ahead — this approval is scoped to "an interactive map of
  FRANKONIA's coverage cities," not "maps/geo in general."
- The **only** build step is `build.js` (see "Shared header/footer
  architecture" below) — a zero-dependency Node script that assembles
  page templates against shared partials. It never bundles, transpiles, or
  adds anything to the JavaScript actually shipped to the browser; it only
  concatenates trusted local HTML strings and copies files verbatim. The
  final browser output must always remain complete, crawlable static HTML.
  This system is approved and intentionally minimal — do not expand it
  into a custom framework, add templating logic beyond the single-level
  `<!-- include: name -->` marker, or add any npm dependency
  (`package.json` has zero runtime or dev dependencies on purpose) unless
  there's a clearly justified project requirement, and that's discussed
  first rather than added proactively.

## Shared header/footer architecture

Duplicating `<header>`/`<footer>` by hand across 30–100 files was
identified as a real maintainability risk (a nav change, phone number
update, or footer city-list edit would otherwise mean editing every page).
The fix, chosen specifically to avoid a framework: a small local static
build (`build.js`, Node core modules only, no dependencies) that assembles
page templates against shared partials at build time — **not** at runtime.
There is no `fetch()` or client-side include anywhere; every file the
browser (or a crawler) receives is complete, final, static HTML.

```
pages/<slug>.html            source page templates, one file per URL
partials/header.html         shared <header> (+ skip-link)
partials/footer.html         shared <footer>
partials/head-common.html    shared stylesheet links, font preload, script tag
build.js                     compiles pages/ + partials/ -> dist/
dist/                        generated output — the only thing Vercel serves
```

**Source → output mapping** (in `pages/`, mirrors the final URL exactly):

- `pages/index.html` → `dist/index.html` (homepage)
- `pages/werkschutz.html` → `dist/werkschutz/index.html`
- `pages/ratgeber/kosten-sicherheitsdienst.html` →
  `dist/ratgeber/kosten-sicherheitsdienst/index.html`
- `pages/ratgeber/index.html` → `dist/ratgeber/index.html` (hub page)

**Include syntax** — an HTML comment marker, resolved once at build time,
one level deep (partials do not include other partials):

```html
<!-- include: header -->
```

**Required page template skeleton** (per-page meta/JSON-LD goes directly in
the page file, never in a partial — it must be unique per page):

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>…</title>
  <meta name="description" content="…">
  <link rel="canonical" href="…">
  <!-- Open Graph / Twitter / robots meta, JSON-LD — all page-specific -->
  <!-- include: head-common -->
</head>
<body>
  <!-- include: icon-sprite -->
  <!-- include: header -->
  <main id="main">
    …
  </main>
  <!-- include: footer -->
  <!-- include: whatsapp-button -->
</body>
</html>
```

`partials/header.html` includes the `.skip-link` targeting `#main`, so
every page's unique content must be wrapped in `<main id="main">`.
`icon-sprite` must come before anything that uses `<use href="#icon-*">`,
so keep it first in `<body>`. `whatsapp-button` is `position: fixed`, so
its position in the DOM doesn't affect layout — it's placed last so it
doesn't interrupt keyboard tab order through the page's real content.

**Workflow:**

```
npm run build   # node build.js — compiles pages/+partials/ into dist/
npm run dev     # build, then serve dist/ locally via npx serve (no install)
```

`dist/` is gitignored and fully regenerated on every build — never hand-edit
anything inside it (every compiled file also gets an auto-inserted
`GENERATED FILE — do not edit` comment as a safety net). Vercel is
configured (`vercel.json`: `buildCommand` / `outputDirectory: "dist"`) to
run the same build automatically on every deploy, so `dist/` never needs to
be committed.

**Why `dist/` and not generating straight into the repo root:** the first
draft of this architecture generated compiled pages back into the repo root
and relied on the source `pages/`/`partials/` files sitting harmlessly
alongside them. That's wrong — with no framework detected, Vercel's default
behavior is to serve every file in the deployed tree by its literal path.
Left that way, `CLAUDE.md`, `docs/frankonia-developer-guidelines.md`
(internal, client-provided strategy doc), and raw `pages/*.html` source
templates (with unresolved include comments) would all have been served
and crawlable at their real paths. Scoping Vercel's `outputDirectory` to
`dist/` — which contains **only** compiled pages + `css/`/`js/`/`assets/`/
`robots.txt` — makes that impossible by construction, not by remembering to
maintain an ignore list.

**Current state:** `partials/header.html` and `partials/footer.html` are
populated (nav, logo, footer columns/city list — see homepage summary for
what's real vs. placeholder content). Two more global partials exist:
`icon-sprite.html` (shared SVG `<symbol>` defs, see Icons above) and
`whatsapp-button.html` (floating contact button, fixed bottom-right, every
page — see below). **The phone number is back in the hero** (client
reference, 2026-07-17, via Chris) — reverses the 2026-07-12 decision that
had removed it from both the header and the hero in favor of WhatsApp as
the site's only persistent secondary-contact CTA. Current state: a plain
`icon-phone` + number link (`.hero__phone`, page-home.css), same real
number/href as the footer (`tel:+499519643520`), sitting next to the
`.hero__actions` primary CTA button — not a second `.btn`, just an inline
icon+text link. `icon-phone` is no longer unused in the sprite. Header
still has no phone CTA — this change was scoped to the hero only; check
before adding one to the header too if that's ever requested.

The desktop (non-hamburger) nav breakpoint is `1400px` (see
`site-chrome.css`'s own comment on that media query for the full
history — it moved 1024→1200→1320→1400 as nav-gap/button-weight changes
each ate more row width; this note here had drifted out of sync with the
code, fixed 2026-07-15 — always check the CSS comment, not this
paragraph, if they ever disagree again). Below that, logo + all 6 nav
items + the CTA button don't fit in one row (was wrapping onto two
lines). The header's CTA button also uses shortened text,
**"Sicherheitsanalyse anfordern"**, not the full "Kostenlose
Sicherheitsanalyse anfordern" — the full text is preserved everywhere
else the CTA appears (hero, pain-hook, conversion section). Don't
silently "fix" the header text back to the long version; the shortening
was deliberate, to fit the row.

**Services nav item has a submenu** (added 2026-07-15, client reference:
dachdeckermeister-hornus.de's mega-menu) — a plain, flat list of all 10
real service links (no invented sub-categories; the client guidelines
never defined groupings within the service list, and this deliberately
doesn't invent structure that isn't confirmed) plus a "View all
services" link to `/leistungen/` (doesn't exist yet). Pure CSS, no JS:
desktop reveals the panel via `:hover` **or** `:focus-within` on the
`<li>`, so keyboard users get it too without any script — this is why
`.site-nav__submenu` is hidden with `opacity`/`visibility` (not
`display`), since `display:none` content can't receive focus at all,
which would make Tab skip straight past the panel's links. Below the
1400px breakpoint there's no dropdown — the same 10 links render as a
permanently-expanded nested list under "Services", no extra tap-to-open
step on touch. See `.site-nav__item--has-submenu` in `site-chrome.css`.

**`.site-header` background is `transparent` again (client request
2026-07-17, via Chris)** — reverses the 2026-07-13 decision described
below, which itself had reversed an earlier transparent-header attempt.
Per this file's own note at the time ("if this ever comes back, treat it
as a fresh request, not a revert"), this was rebuilt from scratch, not
restored from history — the old `--hero-header-overlap` approach really
was gone from the codebase. Current implementation: `.hero`
(page-home.css) has `margin-top: calc(-1 * var(--hero-header-overlap))`
(a fresh `--hero-header-overlap: 6rem` custom property, deliberately a
generous constant rather than a measured header height — see the CSS
comment on `.hero`) pulling the section up so its full-bleed photo
reaches the literal top of the page and shows through the now-transparent
header, with matching extra `padding-top` so the actual hero content
(h1/lead/CTA) lands in the same visual spot as before. The hero's top
gradient (`.hero__bg::after`) was strengthened at the same time — it now
carries nav legibility, not just a soft photo/header seam — see that
rule's comment. **Not yet visually verified** (no browser tool in these
sessions) — check nav legibility over the actual hero photo via `npm run
dev` before calling this done, and re-check if the hero photo is ever
swapped for one with a busy top edge.

History for context (2026-07-13 episode, now itself superseded): a
transparent header merged with the hero's full-bleed background was tried
and then explicitly rejected same-day — client wanted the nav on its own
solid black bar instead. That reversal is what the paragraph above now
reverses again. Both flips are on the record specifically so a third
flip doesn't get treated as a bug.

**WhatsApp button** (`partials/whatsapp-button.html`, styled in
`site-chrome.css` under `.whatsapp-button`): a plain `<a>` to a `wa.me`
link, no JavaScript, no third-party widget/script. **The href is a
placeholder** (`https://wa.me/491234567890`, an obviously-fake number) —
update it in that one file once the client confirms a real WhatsApp
Business number; the comment in the partial has the exact format required.
The icon is a client-supplied PNG (`assets/icons/whatsapp-icon.png`,
downscaled from a 2028px/498KB source to 128px/~12KB — resize any
replacement similarly, it's displayed at ~56px) — it's WhatsApp's own
circular badge with the brand green baked in, so **this is a documented,
deliberate exception to "five brand colors only"**: recognizability for a
known third-party service (matching how PayPal/WhatsApp buttons elsewhere
keep their own brand color) outweighs strict CI adherence for this one
element. Don't extend green to any other UI element on this basis. If a
cookie-consent banner is added later, check it doesn't collide with this
button's bottom-right position.

## URL structure

- Flat, keyword-first, lowercase, dash-separated. No query strings on
  canonical URLs.
- Trailing slash on every URL, enforced via `vercel.json`
  (`trailingSlash: true`). Author pages as `pages/<slug>.html` (see build
  architecture above) — the build already outputs `<slug>/index.html`, so
  clean trailing-slash URLs happen automatically.
- German umlauts spelled out in URLs only: `wuerzburg`, `nuernberg`,
  `fuerth`. (Umlauts stay correct in visible copy and `<title>`/meta text —
  this rule is for the URL slug only.)
- No file extensions in canonical URLs.
- Reference the full planned URL map in guidelines §2.2 before naming any
  new page file, so paths match what's already been decided (e.g.
  `sicherheitsdienst-nuernberg.html`, `brandwache-nuernberg.html`,
  `ratgeber/kosten-sicherheitsdienst.html`).

## Per-page SEO — mandatory on every page, no exceptions

- Exactly one `<h1>` per page, containing the primary keyword + a benefit.
  Never skip heading levels (no h2 → h4). Headings are never chosen for
  their visual size — style them with CSS, pick the tag by document
  structure.
- Unique `<title>` (50–60 chars) and `<meta name="description">` (140–160
  chars) per page. Never copy meta tags between pages.
- Canonical link, Open Graph tags, Twitter card, `<meta name="robots"
  content="index,follow,max-image-preview:large">`, `<html lang="de">`. Full
  template in guidelines §2.3. This block is page-specific and goes
  directly in each `pages/*.html` file — it is deliberately not a partial.
  `lang="de"` is the final-state requirement — while a page is still in
  the English placeholder-content phase, `lang` and `og:locale` should
  match that (`en`/`en_US`), see "Content language" below.
- Inline `application/ld+json` structured data appropriate to the page type
  (Organization/LocalBusiness on homepage, Service on service pages,
  LocalBusiness with `areaServed` on city pages, FAQPage wherever there's an
  FAQ block, BreadcrumbList on every non-homepage). Exact shapes in
  guidelines §2.5.
- Images: `<picture>` with WebP + fallback, explicit `width`/`height`
  (no CLS), descriptive German `alt` text, `loading="lazy"` below the fold,
  `loading="eager" fetchpriority="high"` + `<link rel="preload">` for the
  hero image. Target < 100 KB per image.
- `/sitemap.xml` is manually maintained — update it whenever a page ships.
  Don't generate it speculatively for pages that don't exist yet.

## GEO / AI-search readability

LLM answer engines read top-down and extract early, concrete text — write
for that:

- Where a page answers a user question, phrase the heading as that question,
  verbatim (`Was kostet ein Sicherheitsdienst pro Stunde?`, not a keyword
  fragment like `Preise`).
- Answer in the first 1–2 sentences under the heading. Don't bury the answer
  in paragraph three.
- Prefer concrete numbers and named standards over adjectives: "DIN 77200
  und ISO 9001 zertifiziert", "22 bis 42 Euro pro Stunde", not "zertifiziert"
  / "günstig".
- Short paragraphs, 3–4 sentences max, on content/answer pages.
- Write "FRANKONIA" and the company address identically everywhere —
  consistent entity naming is a GEO signal.
- FAQ sections get `FAQPage` schema.
- This is also why the scroll-reveal motion system (below) is built so
  content is never dependent on JavaScript to become visible or
  extractable — AI crawlers generally don't execute JS.

## Performance

- CSS-first. Reach for a CSS transition/animation before JavaScript, always
  — GSAP (see "Non-negotiable tech constraints" above, approved
  2026-07-20 for a small set of "Apple-like" motion moments) doesn't
  change this default, it's the exception for the few spots CSS can't
  cover.
- JavaScript only where the interaction genuinely requires it (nav toggle,
  sticky header logic, scroll reveal, form validation/UX, the approved
  GSAP moments). No scroll hijacking (this is why Lenis specifically is
  not approved, see above), no WebGL, no heavy parallax, nothing that
  blocks the main thread.
- Fonts are self-hosted (see `css/base.css` `@font-face` and
  `assets/fonts/README.md`) — never load from the Google Fonts CDN.
  `font-display: swap` is already set. **Added 2026-07-15**:
  `assets/fonts/open-sans-variable.woff2`, a single variable-font file
  (real `wght` axis, 300–800, confirmed via `fontTools`) covering both
  weights the site uses via one `@font-face` with `font-weight: 300 800`
  — not the two static files originally planned, see the README for why.
  Before this, the two planned static files had never actually been
  added, so the entire site had been silently rendering in the browser's
  system-font fallback since the homepage was first built — worth
  knowing if a heading/weight ever looks subtly different from a past
  screenshot; that's the real Open Sans now, not a fallback font.
- No render-blocking script. `<script defer>` for everything except
  inlined critical logic.
- Consent/analytics/tag-manager scripts (not yet implemented) must load
  strictly after consent, per guidelines §5 — do not wire up GTM/GA4/Ads
  tracking without a consent gate in front of it.
- Targets on every shipped page (Lighthouse, mobile): Performance ≥ 90, SEO
  100, Accessibility ≥ 90, Best Practices ≥ 90.

## Corporate identity

Five brand colors only — do not introduce new hues (two narrow, documented
exceptions below for third-party brand recognition). All are defined as CSS
custom properties in `css/tokens.css`; use the semantic aliases in
components, not the raw brand variables:

| Token | Hex | Use |
|---|---|---|
| `--color-white` | `#FFFFFF` | text on dark surfaces, a few deliberate light "spotlight" cards |
| `--color-gray` | `#3B4956` | `--color-bg-elevated` — cards, footer, trust section |
| `--color-blue-light` | `#3D9AD3` | accent — large UI text, icons, borders, focus ring on black, **and the `.btn--primary` fill, i.e. "the CTA blue"** |
| `--color-blue-dark` | `#5287C9` | link colour, gradient endpoint, the `.btn--primary` **hover/pressed** state, and every blue that has to sit on white |

> **Corrected 2026-08-05.** This table said blue-DARK was the "primary button
> fill" until now; the code has used blue-light since 2026-07-28 (see
> `.btn--primary` in components.css and its own comment: "the resting fill became
> the lighter brand blue (#3D9AD3), and the darker blue is now reserved as the
> hover/pressed state"). It matters because "use the CTA blue" is a real
> instruction the client gives, and the wrong row sends you to the wrong hex —
> and the two have very different contrast (3.11:1 vs 3.71:1 for white on them).
| `--color-logo-black` | `#010101` | `--color-bg` — the page background |

**Site-wide dark theme (client decision, 2026-07-12) — read this before
touching any color.** The page background is `--color-logo-black`, not
white. This was a deliberate pivot from the original light-theme
foundation (the client supplied a white FRANKONIA logo, which only works
on a dark surface, and asked for the whole site to go dark, not just the
header). Every contrast ratio in this file was recalculated against black;
don't reuse an "on white" number from memory.

Semantic aliases, current meaning:
- `--color-bg` = black (page default).
- `--color-bg-elevated` = `--color-gray` — anything that needs to lift off
  the page: cards (`.pain-card`, `.conversion__form-card`),
  the footer, the trust section (`.section--inverse`, repurposed from the
  old light-theme's "the one dark section" to "the one lighter-dark
  section"). Same token/color as the old light theme used for its single
  dark section — just a different role now that black, not white, is
  the default.
- `--color-bg-inverse` = white — used only where something needs to
  visually invert *against black specifically* (currently just the
  skip-link). Don't reach for this for "a card that should stand out";
  that's `--color-bg-elevated`.
- `--color-text` = white, `--color-text-muted` = white at 0.65 alpha
  (≈7.4:1 on black, ≈5:1 on `--color-bg-elevated` — passes both).

**Contrast caveat — the one thing most likely to bite a future edit:**
both brand blues clear 4.5:1 (text) / 3:1 (non-text) against **black**
(`--color-bg`) — blue-light ≈6.8:1, blue-dark ≈5.7:1, so links, icons, and
borders can use blue directly there. Neither blue clears even 3:1 against
**`--color-bg-elevated`/gray** (blue-light ≈3.0:1, blue-dark ≈2.5:1). Every
place in `components.css`/`page-home.css` where a blue decoration sits on
an elevated card has already been switched to white, with a comment
pointing back to this note (`.pain-card .icon`, `.stat__value`, the form's
`:focus-visible` outline/border). `--color-focus-ring` is white globally
for the same reason — it has to work on every surface without knowing
which one it'll land on. **Before adding a new blue text/icon/border
anywhere, check what it's sitting on.**

Links: the base `<a>` (`base.css`) uses `--color-link` = `--color-accent`
(blue) + underline — on black this passes contrast on its own merits, and
the underline stays anyway so links are never identified by color alone
(WCAG 1.4.1). This is a foundation default, not a universal rule — nav,
footer, and card links each have their own contextual treatment (see
`site-chrome.css`, `page-home.css`), all still bound by the caveat above.

**Two documented exceptions to "five brand colors only,"** both for
third-party recognizability, both scoped to one component — don't extend
either elsewhere:
- WhatsApp's green, baked into the client-supplied
  `assets/icons/whatsapp-icon.png` (the floating contact button).
- Google's multi-color logo (`assets/icons/google-icon.png`) and a gold
  star color (`#F5B400`) in `.review-card` (components.css) — a light
  "spotlight" card matching a client-supplied reference image, showing the
  Google rating. It's intentionally a light surface against the dark page
  (same idea as `.conversion__form-card` staying elevated rather than
  pure black) — its internal text colors are hardcoded "on white" values,
  not the page's dark-mode tokens, because it's white regardless of the
  page theme.

Typography: system font stack — "Helvetica Neue" (macOS/iOS) falling back
to Arial elsewhere (client request, 2026-07-17; see `--font-family-base`
in `css/tokens.css` for the full reasoning) — Regular (400) for body,
Extra Bold (800) for headings, same weight tokens as before, just no
longer backed by a self-hosted file. Real Helvetica can't legally be
self-hosted without a paid Monotype license, and no such files exist in
this project, so there's deliberately no `@font-face` anymore — this is
the standard web-safe workaround, not a placeholder pending a "real"
font. The previous self-hosted Open Sans setup (`assets/fonts/
open-sans-variable.woff2`) is unreferenced now but kept as a spare, not
deleted — see that file's README if this ever needs to revert. One
known side effect: `--font-weight-light` (300, used by "main h2") and
the hand-tuned `white-space: nowrap` heading clamps on
`.references__intro h2`/`.faq__intro h2` (page-home.css) were both
calibrated against Open Sans's specific metrics and haven't been
re-verified against Helvetica/Arial — see those rules' own comments.
The logo typeface (Futura PT Demi) is for the
logo mark only, never for web body/heading text. The actual logo in the
header is `assets/icons/logo-wide-right-icon.png` (client-supplied, white
artwork — this is *why* the header is dark; a light-header variant would
need a dark/color logo file instead, which doesn't exist yet).
`logo-wide-left-icon.png` also exists in `assets/icons/` (client sent both
options) but isn't used anywhere — left as a spare in case the choice
changes.

Visual identity elements to keep available for use once page design starts:
the blue horizontal bar (`.brand-bar`, `page-home.css` — used sparingly:
hero eyebrow, conversion section), and the elongated hexagon accent shape
(`.hex`, `page-home.css`). `.hex` is currently unused in markup again — the
Value Pillars section briefly used it for a central "system map" core node
(2026-07-13), then reverted the same day to a plain card-grid layout
(`.pillar-card`, no hex) per a client-supplied reference. Kept defined and
available for the next place it's actually needed rather than deleted.
Don't invent alternative accent motifs.

Trust elements that must appear wherever the design calls for a trust
section (homepage §5 at minimum): DIN 77200-1, DIN EN ISO 9001, DEKRA
certification marks; Google rating 4.7★ / 97 reviews; Wirtschaftsclub
Bamberg (WCB) and Deutscher Mittelstands-Bund member logos.

**As of 2026-07-17, the homepage does not actually meet the "at minimum"
bar above** — the dedicated "Certified Quality" trust section that used
to carry all of these was removed entirely (client request: "sacame la
seccion de Certified Quality"). What's left on the homepage: the hero
still has its own compact DEKRA badges + a small Google-rating chip
(`.review-card--sm`), and a separate "Security you can trust."
trust-metrics band (`#trust-metrics` in `pages/index.html`) has three
numbers. But the WCB/Deutscher Mittelstands-Bund membership mention and
the only full-size `.review-card` are gone from the page with nothing
re-added in their place — flagged inline in `pages/index.html` (see the
comment near `.hero__bg`), not fixed unilaterally here. Revisit this
against the guidelines' §5 requirement before production.

**The trust-metrics band's own figures are invented placeholders, not
client-confirmed** — same caveat this file has carried since the old
section existed, just relocated: "25+ Years of Experience" and "300+
Satisfied Customers" are the same unconfirmed numbers as before;
"1,000,000+ Service Hours" is new and equally unconfirmed. All three (in
`pages/index.html`, `#trust-metrics` → `.trust-metrics__list`) need real
figures from the client before production. The Google rating (4.7★ / 97
reviews, still shown in the hero) remains the one client-confirmed
number in this area — don't confuse it with the three invented metrics.

**RESOLVED 2026-07-20 — the References testimonials flag below is no
longer current.** Client supplied 3 real, named customer testimonials
(Robert Crispens/MORELO Motorhomes, Hermann Schleier/Bamberg Social
Foundation, Peter Keller/CleanTech Innovation Park — real companies,
specific quotes) to replace the 9 fabricated ones described below
entirely. `.references__testimonials` (`pages/index.html`) now holds
only these 3, real content, not placeholders — the "needs either real
customer sourcing or a rework to obvious placeholders" resolution the
note below calls for has happened, via the first option. Format also
changed from the horizontal drag-scroll strip to a 2-column CSS masonry
(client-supplied reference image), each card now showing 5 stars + a
Google icon top-right (`assets/icons/google-icon.png`, already in this
project for the hero's compact review card) instead of no rating at
all. **Avatars updated again, same day, once the client supplied real
photos**: `assets/images/testimonial-{robert-crispens,hermann-schleier,
peter-keller}.jpg` (center-cropped to square + downscaled to 240×240
from the client's originals — `ClientImg.jpg`/`HermannImg.jpeg`/
`PeterImg.jpg`, still in `assets/images/` uncropped, not deleted).
`.testimonial__avatar` is a real `<img>` now (`object-fit: cover`), not
the flat-color `<span>` described below — that reasoning ("no real
photos exist") no longer applies now that real ones were supplied.
**Worth flagging**: the Hermann Schleier and Peter Keller images are
both institutional building photos (the Bamberg Social Foundation site
and the CleanTech Innovation Park site respectively), not personal
headshots — only Robert Crispens' is an actual face. Used as-supplied,
not swapped for anything else; revisit if real headshots for the other
two ever become available. The history below is kept for context, not
because the issue is still open.

**Flagged 2026-07-15, escalated 2026-07-17 — the homepage References
section (`pages/index.html`, `.references__testimonials`) has the same
problem in a worse form, and it just got 3× bigger by explicit client
choice.** Originally 3 testimonials (M. Hoffmann/S. Krüger/T. Wagner,
specific quotes/job titles/industries) that read as real customer
testimonials but were never sourced from the client guidelines and
weren't documented anywhere as placeholder — unlike the trust metrics
above, this was never flagged at all until building `/werkschutz/`
surfaced the same risk category and this got checked against the same
standard. The result block on `/werkschutz/` was deliberately built with
obviously-bracketed placeholders (`.service-reference`, "[Placeholder —
...]") specifically to avoid repeating this.

2026-07-17: asked the client directly, before expanding this section,
whether to (a) switch to that same obviously-bracketed placeholder
pattern (would have also fixed the original 3), or (b) keep the
realistic style and add 6 more invented names/quotes/roles to reach 9
total, per a client-supplied reference design. **Client explicitly chose
(b)** — realistic style kept, now 9 fabricated testimonials
(M. Hoffmann/S. Krüger/T. Wagner/J. Bauer/L. Fischer/A. Neumann/
R. Weber/C. Becker/D. Schulz) instead of 3. This is a deliberate,
informed decision, not an oversight — but it's the single biggest
concentration of unconfirmed "looks real" content on the site, and
whoever finalizes copy before launch needs to treat all 9 as needing
either real customer sourcing or a rework to obvious placeholders, not
polish. Avatars are plain flat-color circles, not photos — a fake photo
of a specific named "customer" was considered and explicitly rejected
(client choice) as a materially worse version of this same problem;
this project has no real customer photos to use instead.

## Folder architecture

```
/
├── CLAUDE.md                  not deployed — source/reference only
├── package.json                zero dependencies; npm run build / dev
├── build.js                    compiles pages/+partials/ -> dist/
├── vercel.json                  buildCommand + outputDirectory: dist
├── robots.txt                   copied into dist/ as-is
├── sitemap.xml                   copied into dist/ as-is (added 2026-07-15,
│                                   alongside /werkschutz/ — robots.txt had
│                                   referenced this URL since the homepage
│                                   phase, but the file itself didn't exist
│                                   yet; manually maintained per guidelines
│                                   §2.6, update whenever a page ships)
├── docs/
│   └── frankonia-developer-guidelines.md   client source of truth, not deployed
├── pages/
│   ├── index.html                 homepage source
│   ├── referenzen.html             /referenzen/ — built 2026-08-03 from the
│   │                                 client's draft 27; first page to reuse
│   │                                 page-service.css as a chassis rather than as
│   │                                 a service template
│   └── werkschutz.html             first service page, built 2026-07-15 as
│                                     the reusable service-page template —
│                                     see "Service-page template" below
│                                     before creating a second service page
├── partials/
│   ├── head-common.html          stylesheet links, font preload, script tag
│   ├── icon-sprite.html          shared <symbol> defs, see Icons below
│   ├── header.html                populated: logo, nav, mobile toggle (no phone — see below)
│   ├── footer.html                populated: services/cities/contact/legal columns
│   └── whatsapp-button.html       floating contact button, every page, see below
├── css/
│   ├── tokens.css               custom properties: color, type, spacing, motion
│   ├── reset.css                minimal modern reset
│   ├── base.css                 element defaults, @font-face, typography, focus
│   ├── layout.css               .container, .skip-link, .visually-hidden
│   ├── components.css           shared foundation, loaded on every page via
│   │                              head-common: .btn*/.form-field*/.badge/.stat/
│   │                              .review-card/.icon, plus (promoted 2026-07-15,
│   │                              see components.css's own header comment)
│   │                              .section rhythm, .brand-bar/.hex,
│   │                              .breadcrumbs, and the .faq__list/.faq-item
│   │                              accordion — all now used by 2+ pages
│   ├── site-chrome.css           header/nav/mobile-toggle/footer/whatsapp-button — shared
│   ├── motion.css               prefers-reduced-motion override, .u-reveal
│   ├── lead-form.css             the closing lead form (.conversion*) — SHARED,
│   │                              extracted from page-home.css 2026-08-03 when
│   │                              /werkschutz/ became the second page to need it
│   │                              verbatim (the checklist has it on all 49
│   │                              pages). Not in head-common: linked per page,
│   │                              BEFORE that page's own stylesheet, so a
│   │                              page-scoped rule can still override it. The
│   │                              homepage kept only `.pixel-seam +
│   │                              .conversion` (a homepage-only effect)
│   ├── testimonials.css          the .testimonial card — SHARED, extracted from
│   │                              page-home.css 2026-08-03 when /referenzen/
│   │                              needed the identical component. Same rule as
│   │                              lead-form.css: linked per page, BEFORE that
│   │                              page's own stylesheet. The homepage kept every
│   │                              `.references*` rule (the section, its white
│   │                              background, the result stats, the 3-up grid) —
│   │                              that is composition, not the card
│   ├── page-referenzen.css       /referenzen/-only blocks (~300 lines): the
│   │                              photo-less hero override, the result tiles, the
│   │                              quotes grid, the client logo row + roster, the
│   │                              case-study cards and the closing certs row.
│   │                              Small because that page loads page-service.css
│   │                              as its CHASSIS — see docs/page-conventions.md
│   │                              §9.1
│   ├── page-home.css             homepage-only sections, NOT in head-common —
│   │                              linked directly in pages/index.html's own
│   │                              <head>. Owns the "main h2" oversized-heading
│   │                              clamp and .faq__intro's forced one-line
│   │                              heading. page-service.css now carries its own
│   │                              copy of the SAME h2 clamp (client 2026-08-03,
│   │                              service pages match the homepage) — keep the
│   │                              two in sync; they are one decision in two
│   │                              page-scoped files
│   └── page-service.css          service-page template styles + THE SHARED PAGE
│                                   CHASSIS (--content-inset, `main h2`, breadcrumb
│                                   chevron, .section--light, .service-hero*,
│                                   .service-link, the whole .pixel-seam block) —
│                                   /referenzen/ links it for exactly those, see
│                                   docs/page-conventions.md §9.1. Originally only
│                                   pages/werkschutz.html uses it, but every
│                                   class is named generically — see
│                                   "Service-page template" below) — linked
│                                   directly in pages/werkschutz.html's own
│                                   <head>, same pattern as page-home.css
├── js/
│   ├── main.js                    global entry point (scroll reveal, nav toggle,
│   │                                 services preview — see below)
│   └── outfits.js                 homepage-only, Uniforms/outfit viewer section —
│                                     deliberately its own <script defer> tag (linked
│                                     directly in pages/index.html), not folded into
│                                     main.js — see "Accessibility & motion foundation"
│                                     below for the full pattern + image-sourcing notes.
├── assets/
│   ├── fonts/                     open-sans-variable.woff2 (added 2026-07-15,
│   │                                one variable-font file, wght 300–800 —
│   │                                see the README in this folder for why
│   │                                it's one file, not the two originally
│   │                                planned)
│   ├── images/                    hero-bg.webp/.jpg (hero full-bleed background) —
│   │                                currently sourced from HeroReal.png (client-supplied
│   │                                via Chris, 5th hero photo tried 2026-07-17 — then the
│   │                                file itself was replaced in place same day, still
│   │                                called HeroReal.png, so this is actually the 6th
│   │                                distinct photo; re-exported from the new content).
│   │                                Real FRANKONIA-branded photo. Current source is
│   │                                2242×1344, resized to 1600px wide (1600×959) — note
│   │                                this ratio differs from the first HeroReal.png export
│   │                                (2591×1344 → 1600×830), so object-position: center
│   │                                bottom (page-home.css .hero__bg img) crops differently
│   │                                again; re-check if the framing looks off.
│   │                                WebP/JPEG quality bumped to 95 (client request,
│   │                                2026-07-17: explicitly did not want the usual 85
│   │                                compromise this time, wanted it as high-quality as
│   │                                possible) — noticeably heavier than every previous
│   │                                hero-bg export: ~496KB WebP / ~575KB JPEG, well past
│   │                                the already-documented-exception territory of the
│   │                                85-quality passes before it (~250-300KB). This is a
│   │                                real LCP/CWV cost, not an oversight — this file is
│   │                                preloaded + eager + fetchpriority="high" (see the
│   │                                <link rel="preload"> in pages/index.html's <head>),
│   │                                so it's squarely on the critical path. Flag this if a
│   │                                Lighthouse/CWV check ever comes up short; the fix is
│   │                                dropping quality back down, not something structural.
│   │                                Source PNG had an (unused, fully-opaque) alpha
│   │                                channel — flattened to RGB before encoding so neither
│   │                                output carries pointless alpha data.
│   │                                HERO.png, SecurityServices.png, HeroImage.png and
│   │                                HeroImage1.png are the four PREVIOUS hero-bg sources
│   │                                (client-supplied, tried 2026-07-15) — all five raw
│   │                                PNGs (including HeroReal.png) are kept in this folder,
│   │                                not deleted, in case the client prefers a different
│   │                                one after comparing live. Only one is "active" (i.e.
│   │                                actually re-exported to hero-bg.webp/.jpg) at a
│   │                                time — check git history or just re-export from
│   │                                whichever *.png the client picks if this needs to
│   │                                change again.
│   │                                computer.webp/.jpg, walking.webp/.jpg and
│   │                                lab.webp/.jpg are all spare, no longer referenced
│   │                                anywhere (computer.* was the Trust section's
│   │                                full-bleed background photo, removed 2026-07-15
│   │                                when that section was rebuilt to a plain solid
│   │                                black .section, same centered layout as
│   │                                .pain-hook — see page-home.css's .trust comment;
│   │                                walking.*/lab.* have been spare since
│   │                                2026-07-14).
│   │
│   │                                werkschutz/objektschutz/baustellenbewachung/
│   │                                brandwache/revier-schliessdienst/empfangsdienst/
│   │                                veranstaltungsschutz/kaufhausdetektei/
│   │                                sicherheitstechnik/interventionsdienst
│   │                                (.webp/.jpg each) — real, unique per-service
│   │                                photography (client-supplied 2026-07-14), replacing
│   │                                the earlier placeholder approach of cycling
│   │                                hero-bg/computer/walking/lab across all 10 Services
│   │                                Overview preview thumbnails (services__item
│   │                                [data-preview-*] in pages/index.html — one dedicated
│   │                                photo per service now). Source photos were portrait
│   │                                (~1081×1617); resized to 820px wide, WebP quality 72
│   │                                / JPEG quality 72 by default. Two of the ten
│   │                                (baustellenbewachung, revier-schliessdienst) needed
│   │                                lower quality (WebP 62 / JPEG 65) to approach the
│   │                                <100KB target and still landed over it (~120–135KB
│   │                                WebP) — busier/more detailed source photos than the
│   │                                other eight; same "detail vs. target size" trade-off
│   │                                already documented for hero-bg/computer above, not a
│   │                                mistake. object-fit: cover in
│   │                                .services__preview-media (page-home.css) crops these
│   │                                portrait sources down to the section's 4:3 preview
│   │                                box — resize any replacement to the same ~820px
│   │                                width and expect the same crop behavior.
│   │
│   │                                Manu1–7.png / ManuSide1–8.png — client-supplied
│   │                                RAW uniform photography (person cutouts, real alpha
│   │                                transparency), source for outfits/ below. Left in
│   │                                place uncompressed as the working originals; the
│   │                                compressed web copies live in outfits/, not here.
│   │                                See "Accessibility & motion foundation" for the full
│   │                                investigation (front/angled pairing, the ManuSide3
│   │                                duplicate — ManuSide5 was also briefly, wrongly
│   │                                believed missing; see below, it exists and is now used).
│   │
│   │   outfits/                    polo/pullover/weste/softshell/winterjacke/hemd/anzug
│   │                                -front.webp/.png AND -angled.webp/.png, now for all
│   │                                seven (softshell-angled added 2026-07-17 — see below)
│   │                                — compressed web copies of the Manu*/ManuSide* files above, resized
│   │                                to a shared 800×1200 canvas. WebP quality raised to 95
│   │                                (2026-07-15, client report: "me mataste la calidad" at
│   │                                the original 82) + PNG fallback (not JPEG — these need
│   │                                real transparency; the PNGs were always lossless/
│   │                                full-quality, only the WebP re-encode lost detail).
│   │                                Re-exported straight from the existing PNGs, not
│   │                                re-resized from the raw Manu*/ManuSide* originals — no
│   │                                quality lost in that step since PNG is lossless. Now
│   │                                ~60–96KB per image (was ~35–60KB at quality 82) — still
│   │                                comfortably fine, just no longer the smallest possible
│   │                                file at the cost of visible compression artifacts. Used
│   │                                by the homepage Uniforms/outfit-viewer section.
│   └── icons/                     logo-wide-right-icon.png (used), logo-wide-left-icon.png
│                                   (spare, unused), google-icon.png, whatsapp-icon.png,
│                                   dekra-din-77200.png, dekra-iso-9001.png — all
│                                   client-supplied, downscaled on import (see git history/
│                                   summaries for original sizes — resize any replacement
│                                   similarly). The two DEKRA seals are official certification
│                                   images used as-is (real DEKRA graphics, DIN 77200 and
│                                   ISO 9001 respectively) — never crop, recolor, or distort
│                                   them; only proportional resizing is OK, same as was done
│                                   on import (1686×2535 → 399×600, then palette-quantized,
│                                   105KB→18KB each, no visible quality loss since they're
│                                   flat-color graphics, not photos). They replace the old
│                                   text badges in the trust section (`.trust__cert-seal` in
│                                   page-home.css) — the hero's compact DIN/ISO/DEKRA badges
│                                   were deliberately left as text chips, not replaced, since
│                                   full portrait seals didn't fit that compact inline row;
│                                   revisit if the client wants those swapped too.
│
│                                   icon-vest/camera/clock/eye/lock/check-shield/tie-person.svg
│                                   — 7 client-exported Figma icons (two-tone fixed fill,
│                                   #F7F7F7 + #010101, NOT currentColor — that's why these are
│                                   <img> tags, not sprite <symbol>s like the rest of the site's
│                                   icons). All 7 files are untouched originals (light backing +
│                                   black detail) — a 2026-07-15 attempt to invert lock/
│                                   check-shield's own fill colors for the Pillars white-card
│                                   redesign was reverted the same day: those two files are ALSO
│                                   used un-inverted by .pain-item__icon in the "Facing these
│                                   challenges?" section, so editing the shared SVGs broke that
│                                   section (icons went black-on-black, invisible) the moment
│                                   Pillars needed the opposite coloring. Fixed properly with
│                                   `filter: invert(1)` scoped to `.pillar-card__icon img` only
│                                   (page-home.css) — Pillars gets the inverted look, every
│                                   other usage of these files keeps the original. If a future
│                                   change needs a *third* different coloring of the same icon
│                                   somewhere else, use another scoped filter/CSS trick, not a
│                                   direct edit to the shared SVG — these files are shared
│                                   assets, not owned by any one section. 6 of the 7 are wired into the Value Pillars section
│                                   (page-home.css `.pillar-card__icon img`): lock→Reliability,
│                                   tie-person→Single Point of Contact,
│                                   eye→Transparency, clock→Fast Response Times,
│                                   check-shield→Certified Quality, vest→Flexible Scheduling.
│                                   That last pairing is a weak semantic fit (flagged inline in
│                                   pages/index.html too) — neither remaining icon (vest, camera)
│                                   matched "flexible scheduling" well, vest was the less-bad
│                                   option. icon-camera is imported but unused — a plausible fit
│                                   for a future
│                                   Sicherheitstechnik (CCTV) service page.
└── dist/                          gitignored, generated by `npm run build`
```

Every page template links the CSS/JS files via the single
`<!-- include: head-common -->` marker — never add `<link>`/`<script>` tags
by hand per page for the shared foundation files. `head-common.html`
already lists them in the cascade order that matters:

```
tokens → reset → base → layout → components → site-chrome → motion
```

`site-chrome.css` is in this shared list (not page-scoped) because
`partials/header.html`/`footer.html` are included on every page. A page's
own section content (hero, pillars, FAQ, etc.) is different — that CSS is
page-scoped: link it directly in that page's own `<head>`, after the
`head-common` include (see `pages/index.html` → `css/page-home.css` for
the pattern). Don't add page-specific section styles to `head-common.html`.

**Icons**: `partials/icon-sprite.html` holds a hidden sprite of SVG
`<symbol>` defs, included once via `<!-- include: icon-sprite -->` right
after `<body>` opens (before header, so it's in the DOM before any use).
Reference an icon anywhere with `<svg class="icon"><use
href="#icon-name"></use></svg>` — zero extra requests, themeable via
`currentColor` on the parent. Add new icons to the sprite; don't inline
one-off `<svg><path>` markup at the call site or bring in an icon font/library.

When a page needs a new section/component beyond what `components.css`
already provides, first check whether it's genuinely reusable across future
pages. If yes, add it to the shared foundation. If it's one-off, keep it in
a page-scoped stylesheet instead of growing the shared files unboundedly.

## Service-page template

`pages/werkschutz.html` (→ `/werkschutz/`) is the reusable template for all 12
service pages. **Rebuilt 2026-08-03** against the client's real German copy and
the homepage's design language — see the 2026-08-03 entry under "Current phase"
for the full report, which this section now describes rather than the
2026-07-15 English placeholder version. **Do not build the other 11 until this
one is explicitly reviewed and approved.**

**What's shared (lives in `components.css`, loaded on every page — a
second service page needs zero new CSS for these):**
`.section`/`.section--subtle`/`.section--inverse`/`.section__intro`,
`.section-eyebrow`, `.brand-bar`/`.hex`, `.breadcrumbs*`, `.review-card*`
(incl. `.review-card__stars-fill--94`, the one real confirmed rating),
`.faq__list`/`.faq-item*`/`.faq__toggle-row`, `.btn*`, `.badge`, `.stat*`.
Plus `css/lead-form.css` — the closing lead form, shared with the homepage
since 2026-08-03; link it in the page `<head>` *before* `page-service.css`.

**What's service-page-specific (lives in `css/page-service.css`, one file
shared by all future service pages — a second service page still needs
zero new CSS, just reuses these classes with different copy):**
`.service-hero*`, `.service-risk*`, `.service-contrast*`, `.service-scope*`,
`.service-highlight*`, `.service-compare*`, `.service-cases*`,
`.service-konzept*`, `.service-price*`, `.service-contact*`,
`.service-related*`, `.service-link*`. Every class is named `.service-*`, never
`.werkschutz-*`. Three of them exist in generic form specifically because
[docs/build-checklist.md](docs/build-checklist.md) counts them beyond service
pages: `.service-price*` (27 pages), `.service-konzept*` (11),
`.service-compare*` (4, incl. `.service-panel*` / `.service-decision*`).

**What's page-specific (only in `pages/werkschutz.html` itself, and
must change for every new service page):** all visible copy, the H1/meta/
canonical/OG tags, the JSON-LD (`Service` name/description/`offers` price
range + the `FAQPage` entries, which must mirror the visible FAQ 1:1), the hero
image (`assets/images/<service>.webp/.jpg` — already exists for all 10, see
"Folder architecture"), breadcrumb current-page text, the form field ids
(`wk-*` here — keep them unique per page), and the internal-link lists.

**To build the second service page:** copy `pages/werkschutz.html` to
`pages/<slug>.html` (slug per guidelines §2.2's confirmed URL map —
`objektschutz`, `baustellenbewachung`, etc.), then work through that service's
own `content-de/*.docx` draft section by section. They all share this same
9-Punkte-Struktur, so the sections map 1:1; what changes is copy, meta, the
photo, the price range, and the links. Do not touch `css/page-service.css`,
`css/lead-form.css` or `components.css` unless a genuine cross-service layout
problem shows up — if the *content* doesn't fit (e.g. a service needs 8 scope
items instead of 6), that's still just more list items, not a CSS change.

**The homepage's design language IS reused now** — oversized regular-weight
`main h2`, blue arrow CTAs, section eyebrows, and the char/item/text scroll
reveals (client instruction 2026-08-03). This reverses the original brief's
"restrained headings, don't repeat the homepage" direction; the older note that
used to sit here said the opposite. Still NOT reused: the homepage's bespoke
section machines (`.pillar-card`/`.services__index`/`.pain-hook`/konzept cubes/
sticky story) — a service page tells its story in the draft's own sections, and
the compact `.service-konzept` block exists precisely so it doesn't have to
pull in the 3-cube sequence.

**Known bug fixed while building this page, relevant to every future
page:** `partials/header.html`'s CTA used a bare `#sicherheitsanalyse`
fragment, which only resolves on the homepage itself (the one page with
that id). Fixed to `/#sicherheitsanalyse` (absolute path + fragment) so
the shared header's CTA works correctly from any page. If you ever see a
bare `#id` href in a shared partial, treat it the same way — it's a bug
waiting for the second page, not a style choice.

## Coding & naming conventions

- **CSS**: BEM-style class naming — `.block`, `.block__element`,
  `.block--modifier` (see `.btn`, `.btn--primary`, `.form-field__label` for
  the pattern already in use). Utility classes are prefixed `.u-`
  (`.u-reveal`). No inline `style=` attributes, no `!important`, except a
  genuine, documented one-off — there should be none in the foundation.
  Always consume tokens (`var(--color-accent)`), never hardcode a brand hex
  outside `tokens.css`.
- **Files**: lowercase, dash-separated (`open-sans-regular-400.woff2`,
  `pages/sicherheitsdienst-nuernberg.html`).
- **JavaScript**: small, named functions over anonymous inline scripts.
  `const`/`let`, no global leakage beyond the one entry file per concern.
  Feature-detect / guard rather than assume an element or API exists (see
  `initScrollReveal`'s `IntersectionObserver` check for the pattern).
- **HTML**: semantic elements first (`<nav>`, `<main>`, `<header>`,
  `<footer>`, `<section>`, `<article>`) — a div is the fallback, not the
  default. Structure must stay logically understandable with CSS off.

## Accessibility & motion foundation

- Every page starts with a `.skip-link` to `#main` as the first focusable
  element (delivered by `partials/header.html`, defined in `layout.css`).
- `:focus-visible` gets a visible ring (`--color-focus-ring`); plain
  `:focus` from mouse clicks does not — see `base.css`.
- All interactive elements must be reachable and operable by keyboard.
- `prefers-reduced-motion: reduce` is handled in exactly one place —
  `motion.css` (collapses all transition/animation durations, disables
  smooth scroll). Don't add a second reduced-motion block elsewhere; it was
  previously duplicated in `base.css` and has been consolidated.
- The base `<a>` is underlined by default so an unstyled link is never
  identifiable by color alone — see Corporate Identity → contrast finding
  above for how this applies (as a baseline, not a universal rule) once
  nav/inline/action/card/footer link styles are defined per context.
- **Scroll reveal** (`.u-reveal` in `motion.css`, `initScrollReveal()` in
  `js/main.js`) is the one motion primitive defined so far. Mark an element
  with `data-reveal` in HTML — never apply the `.u-reveal` class directly
  in markup. JS is the only thing that ever adds `.u-reveal`, and only
  right before it starts observing an element, which is what guarantees:
  - content is fully visible by default for no-JS users and for crawlers
    that don't execute JavaScript (most AI-search bots) — this is a GEO
    requirement, not just an accessibility one;
  - a script error anywhere before `initScrollReveal()` runs can't leave
    content stuck invisible, because the hiding class was never applied;
  - `prefers-reduced-motion` and missing `IntersectionObserver` support
    both skip the hiding step entirely, same outcome;
  - a 3-second per-element fallback force-reveals anything the observer
    never fires for, so a layout/observer edge case can't hide content
    indefinitely either.
  - the effect only ever animates `opacity`/`transform`, both
    compositor-only properties — it cannot cause layout shift (CLS).
  Extend this rather than introducing a second reveal mechanism.
- **Services preview** (`.services__index` in `pages/index.html`,
  `initServicePreview()` in `js/main.js`) is the homepage Services Overview
  section: a numbered list of all 10 services as real `<a>` links (each
  carrying `data-preview-*` attributes), plus one shared preview panel on
  desktop that swaps its image/name/text/link to match whichever link is
  hovered *or* focused. Same principle as scroll reveal — JS only ever
  enhances, never gates:
  - all 10 services are real, crawlable `<a href>` elements with their
    full name and one-sentence description in the base HTML, with no JS
    required to see or reach any of them — the preview panel is a bonus
    view of the same content, not the only place it exists;
  - `mouseenter` and `focus` both call the same `show()` function, so
    keyboard-only navigation updates the preview identically to a mouse;
  - `.is-active` is a JS-added class mirroring whichever item is currently
    previewed (kept in sync even after blur) — purely visual, layered on
    top of `:hover`/`:focus-visible`, which already make the interacted
    item's active state clear with zero JS;
  - the preview `<picture>`/`<img>` swap only ever changes `src`/`srcset`/
    text content of elements already in the DOM — no new elements are
    inserted, so there's no layout shift, and the crossfade transition is
    skipped outright under `prefers-reduced-motion`;
  - the preview panel is hidden entirely below 1024px (`display: none`) —
    mobile gets the plain numbered list only, no accordion/carousel;
  - images use `loading="lazy"` and there's only ever one `<img>` in the
    preview DOM (its `src` is swapped, not duplicated per service), so the
    section never loads more than one service photo at a time regardless
    of how many of the 10 links get hovered.
- **Outfit viewer** (`.outfits__viewer` in `pages/index.html`,
  `initOutfitViewer()` in `js/outfits.js` — added 2026-07-15,
  significantly refined 2026-07-17) is the homepage Uniforms section
  between Services and Pain Hook: prev/next arrows cycle through 7
  outfits, a Front/Angled toggle switches view without resetting the
  selected outfit, and (below the image, `.outfits__info`) the active
  outfit's name + a one-line use-case label update together — e.g.
  "Winter Jacket" / "For outdoor patrols and cold-weather assignments,"
  one `context` string per entry in the `OUTFITS` array, `js/outfits.js`.
  **Correction to this file, 2026-07-17: an earlier version of this
  paragraph claimed a "live label above the image" already existed with
  `aria-live="polite"` — that described a feature that had never actually
  been built (verified by reading the real markup/JS before today's
  work), not a stale-but-once-true note. The name+context block built
  today is the first real implementation of anything like it, positioned
  below the image per this pass's brief, with `aria-live="polite"` on
  its wrapper for real this time.**

  2026-07-17 client brief also changed: the section's heading/lede
  shortened, the 4-item context list removed outright (not replaced with
  more text), a new small text eyebrow added ("FRANKONIA UNIFORMS," own
  class, deliberately not a reuse of `.brand-bar` — see that element's
  own comment), the character image sized up ~17.6% (`.outfits__stage`/
  `.outfits__image-frame` max-width 34rem → 40rem) with a new soft
  `radial-gradient` grounding shadow under it (`.outfits__image-frame::after`,
  not an image asset), the arrows enlarged/thinned, the Front/Angled
  toggle moved from the left column to right next to the image and
  shrunk/lightened, the outfit name-picker restyled from filled blue
  pills to a vertical list of lightweight underline text tabs
  (`.outfits__names`/`.outfits__name-btn`), and the section's background
  changed from pure white to a hardcoded `#FAFAFA` (documented exception,
  same pattern as `.review-card`'s "on white" colors — not a token, this
  section already deliberately breaks from the sitewide dark theme). The
  name-picker still offers the same jump-to-outfit shortcut on hover,
  focus, *or* click — not click-only — with the active item now shown via
  color + a bottom-border indicator (`aria-pressed`) instead of a black
  pill fill. Not in `main.js` — it's its own `<script defer>` tag linked
  directly in `pages/index.html`, same reasoning as `page-home.css` being
  linked there instead of folded into `head-common.html` (page-specific,
  not sitewide). Same JS-only-ever-enhances principle as scroll
  reveal/services preview, unchanged by any of today's styling work:
  - the base `<picture>` in the HTML is real, correct, default content
    (Polo, front view) — if JS never runs, the arrows/view buttons stay
    inert but the section heading, copy, and this one image are fully
    understandable on their own, per the brief's no-JS requirement;
  - there's only ever one `<picture>`/`<img>` pair in the DOM — `src`/
    `srcset`/`alt` get swapped on navigation, so only the currently
    shown image is ever requested, never all 14 (7 outfits × front/angled,
    now that Softshell has an angled photo too — see the correction
    below; this used to say 13);
  - `aspect-ratio: 800/1200` on `.outfits__image-frame` matches the real
    source images exactly (all resized to that canvas), so swapping
    outfits never causes layout shift;
  - `render()` disables the Angled button generically whenever an
    outfit's `angled` entry is `null` — as of 2026-07-17 no outfit
    actually hits that case (see the correction below), but the guard
    stays in case a future outfit is added without a second photo;
  - `aria-pressed` on the view buttons and name-picker buttons, and
    `ArrowLeft`/`ArrowRight` keydown handling (delegated on
    `.outfits__viewer`, alongside the existing Tab+Enter button
    semantics) cover the accessibility/keyboard requirements.
    (`.outfits__info`/`aria-live="polite"` — an active-outfit name +
    context label shown below the character — existed only briefly,
    2026-07-17: added, then removed the same day per client correction,
    "Front/Angled only thing below the character." The identical copy
    now lives as static per-button hover-reveal text instead,
    `.outfits__name-detail`, see the Value Pillars/nav section above for
    that pass's full rundown.);
  - the crossfade is skipped outright under `prefers-reduced-motion`,
    same pattern as the services preview swap.

  **Image sourcing — read before adding/replacing any outfit photo.**
  The client's source files (`assets/images/Manu1–7.png` /
  `ManuSide1–8.png`) were inspected file-by-file before building this (do
  not assume filename patterns without checking — this project has been
  burned by that before, more than once — see the correction below).
  Findings:
  - all 7 `Manu*.png` are front-facing photos of 7 different uniforms —
    labeled Polo/Pullover/Vest/Softshell Jacket/Winter Jacket/Shirt/Suit
    by visual inspection of the garment, in that file-number order;
  - the `ManuSide*.png` files are **not** a different camera angle —
    they're a second front-facing pose of the *same* outfit, now
    confirmed for all 7 (see correction below). This is why the UI
    button says "Angled", not "Side" (client-confirmed 2026-07-15) —
    "Side" would have claimed an angle that doesn't exist in the
    photography;
  - `ManuSide3.png` is a byte-identical duplicate of `ManuSide2.png`
    (confirmed via MD5, not just matching file size) and isn't used
    anywhere — this is the one genuine "extra" file in the set, not
    evidence of a missing outfit.

  **Correction, 2026-07-17: the original file-by-file inspection above
  missed `ManuSide5.png`.** It had initially been read as evidence that
  Softshell's alternate pose simply didn't exist ("the side numbering
  skips from 4 to 6") — that was an inspection error, not a fact about
  the photography; the file was there the whole time. The client caught
  it directly ("its called manuside5 in the folde"). Before wiring it in,
  it was re-verified the same way as everything else in this
  investigation: MD5'd against every other `ManuSide*.png` (confirmed
  distinct — the only real duplicate in the set is still 2/3) and
  visually compared side-by-side against `Manu4.png` (same jacket, same
  red zip pulls, same person, different pose) before touching anything.
  Processed identically to every other angled photo — resized to the
  same shared 800×1200 canvas, WebP q95 + PNG fallback — and wired into
  `js/outfits.js`'s `OUTFITS` array. All 7 outfits now have a working
  Angled view; the "disabled Angled button" case this file used to
  describe for Softshell no longer applies to any outfit.

  - all Manu*/ManuSide* source files are genuine RGBA with real alpha
    (checked 0–255 range per channel, not just file mode) — these are
    person cutouts meant to sit on the section's own background, so the
    web copies preserve transparency: WebP (primary, alpha-capable) +
    PNG fallback (not JPEG, which has no alpha channel) in
    `assets/images/outfits/`, resized to a shared 800×1200 canvas.
  - copy for this section was translated to English rather than using
    the German heading/body text suggested when the section was
    requested — see "Content language" below; that policy overrides
    per-request suggested copy, not just initial builds.

## Content language

**Current rule (superseding an earlier approach — client correction,
2026-07-13): every page is 100% English during the placeholder-content
phase. No German mixed in anywhere, including headings, CTAs, and nav —
even where the client's guidelines doc already gives exact German text.**
The first pass at the homepage used real German for H1/H2s, the CTA
label, nav items, etc. (reasoning: it was "final, client-confirmed
text"), while everything else stayed English placeholder. The client found
that mix confusing to review, not helpful — so don't do it again. Translate
the *entire* page to German in one single, deliberate pass at the end,
once real content for that page is ready — not incrementally, not
per-string. Until that pass happens, a page must read as fully one
language or the other, never both.

**What stays untranslated even now — these aren't visible copy:**
- URL slugs / `href`s (`/werkschutz/`, `/sicherheitsdienst-bamberg/`,
  etc.) — the real, client-confirmed URL structure (guidelines §2.2),
  unrelated to which language the visible page text is in.
- Proper nouns: city/street names (Würzburg, Fürth, Neuerbstraße),
  person names in testimonials, the company's actual legal name
  (FRANKONIA Sicherheitsdienst GmbH & Co. KG), member-org names
  (Wirtschaftsclub Bamberg, Deutscher Mittelstands-Bund).
- Legal/technical codes: DIN 77200, ISO 9001, §34a GewO — these are the
  real standard identifiers in any language, not phrases to translate.

**`<html lang>` and `og:locale` track the page's actual current content
language, not a fixed value.** Right now that's `lang="en"` /
`og:locale="en_US"` — flip both to `de`/`de_DE` as part of the German
translation pass, not before. This isn't just a formality: `hyphens: auto`
in `base.css` uses the `lang` attribute to pick a hyphenation dictionary,
so a mismatched `lang` value produces visibly wrong hyphenation.

Never size a layout, button, or nav item to fit short English copy —
German compound nouns and longer phrasing must fit without breaking the
design once the translation pass happens. `overflow-wrap: break-word` is
set globally on headings and body text in `base.css` as an overflow
safety net; `hyphens: auto` is scoped to body copy only (`p`, `li`,
`blockquote`), deliberately excluding headings — auto-hyphenating a large
bold `h1`/`h2` mid-word looks like a typo, not a feature. Don't widen
`hyphens: auto` back onto headings for a component without a specific
reason, and don't remove `overflow-wrap: break-word` without checking
German copy length first.

## Consent & tracking (not yet built)

No cookie/tracking script may run before user consent — not even the
consent banner itself may set a cookie pre-acceptance. When this phase
starts (guidelines §5, §9): Consent Mode v2, GTM-orchestrated GA4 + Google
Ads conversion tracking, reCAPTCHA v3 at a low blocking threshold (~0.3) on
lead forms, UTM/gclid capture on form submission. Don't pre-build any part
of this before the client confirms the consent tool.
