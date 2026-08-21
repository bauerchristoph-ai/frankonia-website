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

**2026-08-21 — TRES DEFECTOS LEGALES / DE SHARING: EL IMPRESSUM CITABA DOS NORMAS
DEROGADAS Y LAS 54 PÁGINAS PEDÍAN UNA TARJETA SOCIAL SIN IMAGEN** (cliente, auditoría
de 3 puntos). Toca `pages/impressum.html`, `partials/head-common.html`,
`content/values.json`, 15 páginas y un generador nuevo. **Cero cambios de CSS.**

- ✅ **1. EL LINK DE ODR SE BORRÓ DE LAS DOS ENTIDADES, no se pasó a `https://`.** La
  plataforma ODR de la UE **cerró el 20.07.2025** y el Art. 14 ODR-VO —la norma que
  obligaba al aviso— está derogado, así que apuntar a ella es engañoso, no sólo viejo.
  Y encima iba en `http://` pelado, en la única página que la ley obliga a tener
  permanentemente accesible.
  ⚠️ **Se fue con él el "Unsere E-Mail-Adresse finden sie oben im Impressum."**: esa
  frase existía SÓLO porque el Art. 14 pedía el e-mail al lado del link. Sola no afirma
  nada. ✅ Con eso queda cerrado de paso el typo del "sie" en minúscula que este archivo
  venía marcando como pendiente desde el 2026-08-13 — la frase ya no existe.
  ⚠️ **NO se reemplazó por una declaración del § 36 VSBG**, y es deliberado: esa norma
  obliga a declarar **SI** la empresa participa en arbitraje de consumo, y eso sólo lo
  puede contestar el cliente. Queda anotado en el markup, no inventado.

- ✅ **2. REGISTERGERICHT + REGISTERNUMMER AGREGADOS a las dos entidades.** Son
  obligatorios por **§ 5 Abs. 1 Nr. 4 DDG** y la página publicaba sólo los dos
  USt-IdNr. Salen del membrete de las facturas del propio cliente: **HRA 12064**
  (Sicherheitsdienst) y **HRA 13044** (Werkschutz), **HRB 8535 en las dos** → o sea
  **una sola GmbH complementaria sirve a las dos KG**, no es un copy-paste.
  - ⚠️ **LA STEUERNUMMER NO SE PUBLICA, y está en el mismo membrete.** El § 5 DDG pide
    la USt-IdNr., nunca la Steuernummer; publicarla es riesgo propio sin obligación.
  - ⚠️⚠️ **"Amtsgericht Bamberg" ES UNA INFERENCIA — la única de toda la pasada.** Los
    membretes imprimen los números y **nunca nombran el juzgado**. Bamberg lleva su
    propio Handelsregister y la sede está en Bamberg, así que es sólido, pero **hay que
    confirmarlo en handelsregister.de**; por eso está marcado como pregunta en el markup
    y no como dato cerrado. Dejar el campo vacío era una infracción segura; esto es una
    probabilidad alta de acierto.
  - ⚠️ **La GmbH complementaria va identificada SÓLO por su número** (HRB 8535): ningún
    documento del proyecto la nombra, y un nombre inventado en un Impressum es peor que
    un dato incompleto.
  - ✅ **El punto 2 de la auditoría decía que faltaba el Vertretungsberechtigter y ESO
    ERA FALSO** — "Vertreten durch: Steffen Walde" ya estaba en los dos bloques desde el
    2026-08-13. Verificado midiendo el build: 2 bloques. No se tocó.

- ✅ **HALLAZGO PROPIO, mismo riesgo y no estaba en la auditoría: LA PÁGINA CITABA EL
  TMG, DEROGADO EL 14.05.2024.** Sus deberes de información pasaron al **DDG**, que
  conservó la numeración. Corregido en las **9 apariciones**: el lede visible, el
  disclaimer (`§ 7 Abs.1` y `§§ 8 bis 10`), la meta description y la og:description.
  ⚠️ **Es la ÚNICA vez que se pisa la regla "verbatim" del encabezado de ese archivo**, y
  la razón es la misma que el ODR: una cita a una norma que ya no existe no es una
  preferencia de redacción. **Verificado sobre el build: 0 apariciones de "TMG" y 0 de
  "ec.europa.eu" en las 54 páginas.**

- ✅ **3. IMAGEN SOCIAL EN LAS 54 PÁGINAS, DERIVADA DEL HERO DE CADA UNA** (regla del
  cliente: "immer das Titelbild der Seite nehmen, als Fallback das der Homepage"). El
  defecto era real y medible: **las 54 declaraban
  `twitter:card="summary_large_image"` y sólo UNA declaraba `og:image`** — apuntando a
  `/assets/images/og-home.jpg`, **un archivo que nunca se creó**. O sea 54 páginas
  pedían una tarjeta con imagen grande y no entregaban ninguna.
  - **La mecánica NO necesitó tocar `build.js`.** Es el sistema de parámetros de include
    que ya existía: `head-common.html` emite el bloque con `{{ogimage}}`,
    `content/values.json` trae el **default = hero del homepage**, y las 15 páginas con
    foto propia pasan `<!-- include: head-common ogimage="…" -->`. Las otras 39 no pasan
    nada y heredan el fallback. Mismo patrón y misma razón que `nameRequired` /
    `priceBoxTick1` — clave de nivel superior, porque **un parámetro de include es plano
    y no puede pisar una clave anidada**.
  - ⚠️⚠️ **NO se apuntó `og:image` a los archivos del hero, y por dos razones medidas:**
    **nueve de los quince heroes son VERTICALES** (820x~1222), y una og:image vertical la
    recortan todas las plataformas al centro para armar una tarjeta apaisada — que es
    exactamente el recorte que este archivo documenta como cortacabezas para esas nueve;
    y **WebP en og:image no es confiable** (LinkedIn sobre todo), que es lo que el propio
    comentario placeholder de `index.html` ya decía. Son **JPEG 1200x630**, 44–140KB.
  - **Generador reproducible: `docs/design-sources/og-images.ps1`** (PowerShell +
    System.Drawing — en esta máquina **no hay Python, ni Pillow, ni ImageMagick, ni
    ffmpeg**, sólo Node y PowerShell; los `.py` de esa carpeta son de la época macOS).
    Corre una vez, en desarrollo, **fuera de `npm run build`**.
  - ⚠️ **EL RECORTE VERTICAL NO SE INVENTÓ: sale del `object-position` de cada hero**, o
    sea del encuadre que el cliente ya aprobó en pantalla (herofinal 42 %,
    hero-werkschutz 42 %, leistungen 50 %, jobs/ueber-uns/referenzen 50 % por default,
    las 9 de servicio 32 %). El horizontal es irrelevante: **las 15 fuentes son más
    angostas de proporción que 1.905:1, así que siempre se conserva el ancho completo y
    sólo se recorta el alto.**
  - ⚠️⚠️ **DOS DE LAS NUEVE NECESITARON SU PROPIO VALOR, Y LO CAZÓ MIRAR, NO EL NÚMERO:**
    a 32 % el recorte **clipeaba la corona del casco** en `baustellenbewachung` y **las
    dos cabezas** en `interventionsdienst`. La causa es que **el 32 % está calibrado para
    el hero EN PÁGINA, que es una caja mucho más ALTA que 1.905:1** — en teléfono ronda
    0.45:1, así que `cover` recorta esas fotos 0.668:1 por el ANCHO y el porcentaje
    vertical casi no actúa. Una ventana de 1200x630 es un corte mucho más duro (430px de
    1222). Los dos pasaron a **15 %**. Revisado en un contact sheet de los 15, antes y
    después.
    ⚠️ **`veranstaltungsschutz` se dejó en 32 % a propósito**: su sujeto está de espaldas
    y el lettering "FRANKONIA SICHERHEITSDIENST" cae en y≈750, así que **ninguna ventana
    de 430px sostiene la cabeza Y el lettering**. Cabeza + multitud es la tarjeta fuerte.
  - **Sin `og:image:alt`**, y es una decisión: es opcional, y un texto compartido
    describiría la foto equivocada en 53 de 54 páginas.
  - **El origen absoluto se escribe UNA vez** en head-common (una og:image relativa no la
    resuelven los scrapers de forma confiable), contra las 54 veces que ese mismo origen
    ya está cableado en los `canonical`.
  - **Medido sobre el build, las 54 páginas: exactamente 1 `og:image` y 1
    `twitter:image` por página, iguales entre sí, con width/height, URL válida, los 15
    archivos presentes en `dist/`, y 0 tokens sin resolver.** Reparto: **40 con el hero
    del homepage** (39 sin foto + el homepage) y 14 con la propia.
  - ⚠️ **`index.html` pasa su imagen EXPLÍCITAMENTE** aunque coincida con el default: si
    algún día el fallback pasa a ser una tarjeta de marca genérica, el homepage no tiene
    que perder su hero en silencio.

- ⚠️ **Trampas de entorno de esta máquina (Windows), que van a volver:** el `/tmp` de Git
  Bash **no es el `/tmp` que resuelve Node** (que lo lee como `C:\tmp`) — hay que usar
  rutas Windows completas; un heredoc de bash **se come un nivel de backslash**, así que
  un `.replace(/\\/g,"/")` escrito así llega roto (usar `split(path.sep).join("/")`); y
  `python` / `ffmpeg` / `magick` **no existen** acá.

**2026-08-19 — EL H2 DE `.service-prose` / `.service-trust` SE CAPA A 30ch: CORRE EL
ANCHO ENTERO DEL CONTAINER DESDE 1512px** (cliente, sobre `/baustellenbewachung/`: "the
width of the title is too long in this section"). Una regla en `css/page-service.css`,
otra BORRADA de `css/page-combo.css`; **cero markup, cero copy**.

- ⚠️⚠️ **EL DEFECTO ARRANCA EXACTAMENTE A 1512px Y A 1440 NO SE VE, así que medir sólo
  a 1440 lo habría declarado inexistente.** Medido en la sección reportada: el chasis
  deja `.section__intro` en `max-width: none`, así que el título de 72 caracteres iba
  **1293px sobre 2 líneas a 1512 / 1800 / 2000 / 2400**, encima de un párrafo de 656px
  (el `max-width: 42rem` del chasis). Por debajo, `text-wrap: balance` alcanzaba a
  partirlo en 3 líneas de 631–703px y tapaba el problema — **1280 y 1440 se veían
  bien**. La captura del cliente es de ~2000px de viewport.
- **Después: 707px sobre 3 líneas**, o sea el título queda apenas más ancho que su
  propio párrafo en vez de tres veces más. Costo medido y esperable: la sección pasa de
  **824 a 899px** a ≥1512 (una línea más).
- ⚠️ **ES UNA PROMOCIÓN, NO UNA REGLA NUEVA.** `.combo-prose .section__intro h2` llevaba
  estos tres valores desde el 2026-08-17, por el MISMO reporte del cliente en
  `/objektschutz-nuernberg/` — pero las 12 páginas de servicio no llevan `.combo-prose`,
  así que el defecto seguía vivo en 11 secciones. **Las 21 secciones combo llevan LAS DOS
  clases**, así que la copia se BORRÓ en vez de dejar la misma decisión escrita dos
  veces. **Verificado midiendo las 21 antes y después: 63 filas byte-idénticas.** El
  razonamiento largo (por qué 30ch, por qué en `ch`) queda en `page-combo.css`, en el
  lugar donde estaba la regla.
- **30ch en `ch` y no en px**, porque el H2 es un clamp tipográfico y la medida tiene que
  seguir a su propio tamaño de letra — y estos 11 títulos van de **33 a 74 caracteres**,
  o sea el cap no se puede ajustar a uno de ellos.
  ⚠️ **NINGÚN CAP DA "DOS LÍNEAS" PARA LOS 11**: cualquier medida que parta el más corto
  en dos deja el más largo en tres. Lo que 30ch garantiza es que ninguno corre una línea
  gigante.
  ⚠️ **Un título más corto que el cap conserva su ancho natural**: a 60px, 30ch = 1001px,
  así que el más ancho que queda es el de `/empfangsdienst/` con **941px**. Si hay que
  acercar TODOS a la medida del copy, la palanca es el cap (24–26ch), no la tipografía.
- ⚠️ **`.service-trust` entra a propósito**: es la MISMA composición centrada (la centra
  la misma regla desde el 08-17) y sus 5 títulos tenían el mismo problema — el de
  `/kaufhausdetektei/` iba **1166px en UNA línea**. Separarlas convertiría una decisión
  en dos.
- ⚠️ **`margin-inline: auto` no es opcional** (novena vez): la sección está centrada, así
  que `max-width` solo centra el TEXTO dentro de una caja de ancho completo que sigue
  pegada a la izquierda.
- **Medido en las 6 páginas con estas secciones (11 secciones) a 320 / 390 / 768 / 1024 /
  1512 / 1920 = 66 casos: 20 se angostaron, CERO se ensancharon**, offset 0,0px del eje
  en todos, sin scroll horizontal. **Por debajo de 1024 no se movió nada** — ahí la
  columna ya es más angosta que el cap, o sea el arreglo es sólo de escritorio. Captura
  a 1512 revisada.

**2026-08-19 — LA SECCIÓN ANSPRECHPARTNER VA CENTRADA EN EL LAYOUT APILADO, EN LAS 5
PÁGINAS QUE LA PUBLICAN** (cliente, con captura de teléfono de `/werkschutz/`: "this
section has to be centered"). Un bloque en `css/page-service.css`; **cero markup, cero
copy**.

- **Scopeado debajo de 900px, que es el layout de la captura.** De 900 arriba la foto
  tiene su propia columna izquierda y el copy la derecha: centrar una columna de texto al
  lado de un retrato pegado a la izquierda se lee como epígrafe, no como composición
  centrada. **Verificado que escritorio no se movió NI UN PÍXEL** (medido a 900 / 1024 /
  1440 / 1920 contra un build A/B: mismos offsets, misma foto de 480x600, mismo alto de
  sección).
- ✅ **Y arregla una inconsistencia que el bloque ya tenía:** `.service-contact__certs`
  se centra desde el 2026-08-07 (para igualar `/referenzen/`), así que apilado la sección
  era **una franja de certificados centrada debajo de un título, una foto y dos acciones
  rangeados a la izquierda**.
- ⚠️⚠️ **BUG PROPIO, ENCONTRADO MIDIENDO Y NO MIRANDO: `justify-self: center` SOLO
  COLAPSÓ EL RETRATO A 0x0.** Ese valor (igual que un margen automático) vuelve
  **content-sized** al grid item, así que el ancho del `<figure>` pasó a indefinido — y
  su `<picture>` es inline con un `<img>` a `width: 100%`, que entonces no tiene contra
  qué resolver. **La sonda lo cantó como `w:0 h:0`; una captura a ese ancho habría
  mostrado la foto ausente y parecido un problema de la imagen.** El arreglo es
  `width: 100%` + `justify-self` juntos, que es exactamente lo que este archivo ya
  documenta para el `<picture>` del hero y para la price card. **Medido después: 153,6 /
  187,2 / 206,4 / 224px — los MISMOS anchos que antes del cambio.**
- ⚠️ **SON CUATRO DECLARACIONES Y CADA UNA HACE UNA PARTE DISTINTA** — la trampa que este
  archivo documenta nueve veces: `text-align` centra el TEXTO; `justify-self` + `width`
  centran la FOTO; `margin-inline: auto` centra el PÁRRAFO, que está capado a 34rem y en
  la banda 768–899 ese cap es más angosto que la columna (o sea sin él quedaba pegado a
  la izquierda debajo de un título ya centrado); y `.service-contact__actions` es una
  fila **flex**, a la que el `text-align` del padre no mueve.
- ⚠️ **VA EN LAS 5 PÁGINAS, no en una** — werkschutz · objektschutz · brandwache ·
  sicherheitstechnik · baustellenbewachung publican el bloque idénticamente. Deliberado:
  una composición para un bloque es mejor que cinco variantes casi iguales. Una página
  que deba quedar rangeada a la izquierda necesita una clase de opt-out, no una edición
  de estas reglas.
- **Medido en las 5 a 320 / 390 / 430 / 600 / 768 / 899 / 900 / 1024 / 1440 / 1920** (50
  corridas): **título, nombre, rol, párrafo, foto, acciones y sellos a 0,0px del eje del
  container en los seis anchos apilados**, sin scroll horizontal, nada fuera del
  viewport, y **el alto de la sección idéntico al build anterior** (1726 / 1663 / 1663 /
  1568 / 1503 / 1523px), o sea el centrado no costó ni un píxel de alto. Con motion
  prendido el retrato y la franja de certificados asientan en opacidad 1 y
  `transform: none`; capturas revisadas a 390.

**2026-08-19 — HOMEPAGE MOBILE, 5 REPORTES DEL CLIENTE: 3 ARREGLADOS Y 2 QUE NO
REPRODUCEN EN EL CÓDIGO ACTUAL (ni local ni desplegado).** Sus capturas son de
`frankonia-website.vercel.app`, o sea el deploy, y eso importa: todo se midió también
ahí, a **393px reales vía CDP**, no sólo en local.

- ✅ **1. LOS DIAGRAMAS DEL KONZEPT ESTABAN CORTADOS, Y EL CULPABLE ERA EL `viewBox`,
  NO EL CONTAINER** ("están cortados a la derecha, tienen que estar centrados y un poco
  más pequeños"). Medido: la caja del SVG cae en x 20..373 con 20px de aire a cada lado
  —o sea holgada— pero `getBBox()` dice que **el DIBUJO va de x=-37 a x=1121 contra un
  `viewBox="0 0 1079 1110"`**. Un root SVG recorta en su viewport por defecto, así que
  se comía **42 unidades a la derecha (~14px) y 37 a la izquierda (~12px)** en todos los
  anchos de teléfono. **Por eso en escritorio nunca se vio**: ahí
  `.konzept-seq--enhanced .konzept-seq__svg` ya trae `overflow: visible` para las
  anotaciones.
  - **El arreglo es `overflow: visible` debajo de 1024px**, y es seguro SÓLO ahí porque
    `.kz-tip` es `display: none` en ese rango — lo único fuera del viewBox en un
    teléfono es la geometría del cubo.
    ⚠️ **NO ensanchar el atributo `viewBox`**: es compartido con escritorio, donde las
    anotaciones están posicionadas contra esas mismas coordenadas.
  - ⚠️ **EL FRAME TIENE QUE ENCOGERSE PARA PAGARLO, y el número es derivado:** con
    overflow visible el dibujo renderiza **1158/1079 = 7,3 % MÁS ANCHO** que su caja, así
    que los 90vw viejos habrían pedido 96,6vw y se iban de pantalla. **78vw** deja el
    dibujo en 83,7vw = 329px dentro de 393. Si alguien cambia ese valor, el ancho visible
    se mueve **1,0732×**, no 1×.
  - **Medido a 320 / 393 / 430 / 640 / 768 / 1023:** `hScroll` 0 en los seis, dibujo
    entero, centrado a **1px** del eje, y aire a la derecha de **25 / 31 / 34 / 51 / 160 /
    287px**. Captura del tercer diagrama revisada.
  - ⚠️ **TRAMPA DE MEDICIÓN: `getBBox()` CUENTA HIJOS CON `display: none` en Chrome.** El
    layer 3 reportaba el dibujo arrancando en **x=-957**, o sea 229px saliendo por la
    izquierda, y parecía una regresión que yo acababa de introducir. Son los `.kz-tip`
    ocultos (y un `<use>` que los instancia) contaminando el bbox. **Se descartó con una
    captura, no con más números** — no pinta nada ahí.

- ✅ **2. FUERA LOS TOOLTIPS DEL MOBILE** ("no es necesario que escroleemos y vaya
  apareciendo el punto en distintos lugares del diagrama… deja nomás los diagramas y
  abajo que diga los nombres"). Se **BORRÓ** `buildMobileTips()` + su `mm.add` de
  `js/konzept-seq.js` (146 líneas) y todo el bloque `.kz-mtips` / `.kz-mtip*` de
  `css/konzept-seq.css`, no se ocultó.
  - ⚠️ **EL DIMMING SE FUE SOLO, y eso es lo elegante de borrar la construcción en vez de
    esconderla:** `.konzept-seq__terms.is-synced` bajaba los nombres al 45 % para marcar
    cuál chip estaba encendido, y **`is-synced` lo agregaba ese mismo script**. Sin script
    no hay clase, así que los 13 términos quedan a contraste pleno sin tocar una regla más.
    Verificado: `mtips: 0` y `color: rgba(255,255,255,0.9)` en los tres layers.
  - ⚠️ **No "restaurar" esto des-ocultando los `.kz-tip` del SVG**: están fuera del
    viewBox para el split de escritorio, así que abajo de 1024 se recortaban a dos o tres
    letras — que es la razón por la que están `display: none` ahí.

- ✅ **4. LOS THUMBNAILS DE LA LISTA DE SERVICIOS ESTABAN CROPEADOS DESDE ARRIBA, Y ERA
  MEDIBLE** ("están alineadas arriba y no se ve lo principal de la imagen… objektschutz,
  kaufhausdetektei y baustellenbewachung están bien, el resto un poco más abajo").
  - ⚠️ **`object-position` NO PODÍA ARREGLARLO, y por eso hubo que re-exportar:** los
    archivos de `assets/images/services-thumb/` **ya son 128x96 recortados** y se muestran
    en una caja de 62x47 — **el mismo ratio 4:3**, así que `cover` no recorta nada. El
    recorte está horneado en el archivo.
  - **El recorte viejo se recuperó por fuerza bruta, no se adivinó:** deslizando una
    ventana 820x615 por cada fuente vertical, bajando a 128x96 y tomando el MSE mínimo
    contra el archivo publicado → **top = 57–60px de ~1220 en los DIEZ, o sea 9,8 %**. Una
    decisión sistemática, no arte por foto.
  - ⚠️ **UN 0.50 LITERAL CORTA CABEZAS, y se comprobó renderizando:** en werkschutz e
    interventionsdienst se pierden las caras y en revier-schliessdienst se clipea al
    hombre. Así que se centra **EL SUJETO, no la ventana** — 0.25 donde hay caras cerca del
    borde, 0.35 donde manda el grupo o la marca. Los siete valores salieron de una hoja de
    contactos al doble del tamaño real, nunca del número.
  - **`docs/design-sources/services-thumbs.py`** (nuevo) deja la tabla de recortes
    reproducible, y **excluye a propósito los tres que el cliente aprobó** — re-correrlo no
    los toca. Verificado con `git status`: cambiaron exactamente 7 archivos. 44KB el
    directorio entero, y **cero markup** (son `<img>` sueltos, sin `<picture>`).

- ⚠️⚠️ **3 y 5 NO REPRODUCEN, Y LA EVIDENCIA APUNTA A CSS CACHEADO EN SU TELÉFONO.** No se
  tocó nada por eso: cambiar código que mide bien es cómo se rompe lo que funciona.
  - **5, "los videos en mobile se siguen viendo mal":** el strip social mide **3 cards de
    338px, 1 video cada una, snapped**, en los dos extremos del scroll y a dos alturas de
    viewport, **en el deploy**. Su captura muestra tres imágenes de **~85px** — que es
    exactamente el ancho del bug que la pasada mobile del **2026-07-30** arregló ("three
    9:16 cards side by side gave each ~85px").
  - **3, "las cards de los servicios están cortadas":** probado forzando la altura de la
    card a **422 / 380 / 340 / 300 / 260 / 220 / 180px** — la lista de bullets **nunca**
    desborda, siempre queda a **−24px** del borde. Es estructural: `.system-story__body` es
    `position: absolute` + `space-between`, así que entra a cualquier altura. El
    `max-height: 68svh` sí achica la card (medido 422→343 al bajar el viewport) pero el
    contenido pide ~160px, así que el clamp no puede recortarlo. **En el código actual ese
    recorte no es alcanzable** — y sí lo era en el layout pre-30/07, donde el contenido iba
    en flujo dentro de una card de alto fijo.
  - **Los dos reportes apuntan al mismo build viejo**, así que lo primero es un
    **hard-reload** en su iPhone. Si persiste con caché limpia, hay que pedirle **qué card
    exactamente** y una captura nueva: sería otro defecto, no éste.

- ⚠️⚠️ **TRAMPA DE ENTORNO QUE INVALIDÓ LOS 54 LINKS QUE LE PASÉ HOY: EL PUERTO 8123 NO
  ERA MÍO.** Mi server murió a mitad de sesión y **otra sesión tomó el puerto**, sirviendo
  `/private/tmp/.../de84d294-…/scratchpad/build/dist`, o sea un **snapshot congelado de
  otro árbol**. Se detecta pidiendo un archivo que sólo existe en el `dist/` propio: daba
  **404 con el archivo presente en disco**. Se confirma con
  `lsof -nP -iTCP:8123 -sTCP:LISTEN` + `ps -ww -o command= -p <pid>`, que imprime la raíz
  servida. **Verificar la identidad del server con un md5 contra el `dist/` propio antes de
  medir o de pasar links**, y levantarlo con `nohup … & disown` en un puerto propio (8792).
- ⚠️ **Nota de medición: `--window-size=393` NO da un viewport de 393px** — Chrome impone
  el mínimo de ~500 (medido `innerWidth=500`). Para un ancho de teléfono real hace falta
  `Emulation.setDeviceMetricsOverride` por CDP; hay un driver mínimo de ~30 líneas usando
  el `WebSocket` nativo de Node 22 (cero dependencias) en el scratchpad de esta sesión.

**2026-08-19 — EL "MARCO" DE TODA SECCIÓN `.service-points` / `.service-scope` VA
CENTRADO, EN LAS 14 PÁGINAS QUE LAS LLEVAN — Y LA LISTA NO SE TOCA** (cliente, con
siete capturas de cuatro páginas de servicio: "todas estas screenshots son secciones
de las páginas de servicios que tienen que estar centradas, no toda la sección pero el
título (y si tiene un texto abajo también centralo) y si hay un box abajo o un
comentario abajo de los items también centrados … **no toques la lista de
contenidos**"). Todo en `css/page-service.css`; **una sola edición de markup** (sacar
una clase que quedó muerta) y cero copy.

- **Qué se centra: título, lede, el comentario de cierre (`__outro`) y la caja
  (`.service-highlight`). Qué NO: los items.** La lista conserva su borde izquierdo, que
  es la razón que este proyecto da en todos lados: centrar los items le saca el borde
  común contra el que el ojo compara una lista. **Medido: el ancho y la posición de
  todas las listas quedaron IDÉNTICOS antes y después.**
- ⚠️⚠️ **PASÓ DE OPT-IN A INCONDICIONAL, y ESA es la decisión de esta pasada.** Desde
  el 08-17 esto era `.service-section--centred`, sección por sección; el cliente ahora
  lo pidió para todas, así que la clase habría sido un segundo mecanismo para decir lo
  mismo. **La regla vieja NO se duplicó: se le sacaron las partes de marco y quedó
  sólo con el cap de la lista**, o sea hoy significa "además angostá el bloque de la
  lista". Las 5 secciones que la llevan en markup rinden **exactamente igual que
  antes** (medido: 992px y 1152px de lista, sin cambio).
- ⚠️⚠️ **`.service-flow__intro` ESTÁ EXCLUIDO Y TIENE QUE SEGUIR EXCLUIDO.** Es el
  heading **pinneado** del scrollytelling de `/werkschutz/`, que vive dentro de un
  `.service-scope` y se sienta arriba de un split 50/50 — centrarlo movería el único
  heading del sitio cuya posición es funcional. Es el único `.section__intro` dentro de
  un `.service-scope` que no es un header de sección normal. Verificado después: sigue
  a **−38px** del eje, o sea intacto.
- **El `__outro` pasó de "caja centrada" a "texto centrado", y hacían falta las dos
  cosas**: ya tenía cap de 62rem, así que el `margin-inline: auto` es lo que mueve la
  caja y el `text-align` lo que centra la frase adentro. Antes tenía sólo el margen y
  **sólo dentro de `--centred`**, así que un outro de dos líneas se leía alineado a la
  izquierda debajo de un título centrado. Lleva `hyphens: none` por la razón de siempre:
  una línea centrada ya tiene dos bordes irregulares.
- **La caja se centra ahora INCONDICIONALMENTE** (`.service-highlight`), lo que
  **reemplaza dos reglas scopeadas**: la de `.service-prose`/`.service-trust` del 08-17
  y **el `.service-highlight--centred` que yo mismo había hecho dos horas antes** para
  `/werkschutz/` solo. Las 7 páginas que llevan esa caja la quieren centrada, así que
  un scope o una clase eran una segunda forma de decir lo mismo. **La clase se borró
  del markup**, no quedó como selector muerto. Su texto sigue a la izquierda (regla
  documentada del componente).
- ⚠️ **NO se tocaron `.service-price` ni `.service-contact`, y no es un olvido:** su
  intro vive en **una columna de un grid de dos**, así que centrarlo rompe esa maqueta —
  este archivo ya lo documenta para Kosten desde el 08-09. Miden −296 a −431px del eje
  y así se quedan. **Ninguna de las siete capturas del cliente es una de esas dos.**
- ⚠️ **Tampoco `.service-risk` ni `.service-contrast` de `/werkschutz/`** (−91 y −264):
  son bloques propios de esa página, no de este tipo de sección, y ninguna captura los
  incluye. **Queda como la única inconsistencia visible del sitio en este eje** — si el
  cliente la marca, son dos selectores más.
- **Medido en las 12 páginas de servicio + 2 combo, a 320 / 390 / 768 / 1024 / 1440 /
  1920** (84 corridas): **cero fallos de centrado** (título, lede, outro y caja dentro
  de 2px del eje en TODAS las secciones `.service-points`/`.service-scope`), **cero
  scroll horizontal**, y los únicos elementos fuera del viewport son los 3 compartidos
  de siempre (honeypot + su label + input). Capturas revisadas de dos de los casos del
  cliente.
- ⚠️ **UNA EXCEPCIÓN, pedida por el cliente diez minutos después: en
  `/interventionsdienst/` LOS ITEMS SÍ VAN CENTRADOS** ("this is weird, center the
  items"). Es la **única página con una lista `--2`**, y ahí la grilla de 2 columnas a
  ancho de container le da **593px a cada item para tres líneas de copy**, o sea el par
  se lee como dos bloques abandonados con 100+px de hueco debajo de un título y un lede
  centrados. **No es una reversión de "no toques la lista"**: es el cliente pidiéndolo
  en la única lista donde la grilla deja un agujero.
  - **46rem, elegido comparando renders** contra 52rem y contra "bloque centrado con
    texto a la izquierda": a 46rem los dos items salen de **tres líneas** y se leen como
    un antes/después deliberado. Medido: lista **736px centrada, items de 344px, título
    y texto a 0px del eje de su item**, sin scroll horizontal a 320 → 1920.
  - ⚠️ **La regla azul necesita su propio `margin-inline: auto`**: es un pseudo-elemento
    de 3rem fijos, así que el `text-align` del item no la mueve, y una regla pegada a la
    izquierda sobre texto centrado se lee como un error.
  - ⚠️ **Sólo ≥640px**, donde arranca la grilla de 2 columnas: en teléfono es una
    columna de ~350px y tres líneas de alemán centrado ahí se leen peor que rangeadas —
    la misma decisión que ya toma `/jobs/` con sus pasos centrados. Verificado:
    `align: start` a 320 y 390, `center` de 640 arriba.
- ⚠️⚠️ **TRAMPA DE MEDICIÓN NUEVA Y LA PEOR DE HOY: HABÍA DOS CHROME HEADLESS EN EL
  PUERTO 9333 — el mío y el de OTRA SESIÓN — y mi sonda se conectó al de ella.**
  Reportó secciones `city-hero` / `city-fields` / `city-nearby` en `/werkschutz/` y
  `/revier-schliessdienst/`, o sea el layout de una página de CIUDAD, porque estaba
  midiendo `http://127.0.0.1:8177/sicherheitsdienst-bamberg/` (su server, su página).
  **Se detecta con `curl http://127.0.0.1:<puerto>/json/list | grep url`.** Dos reglas
  que quedan: **elegir un puerto de debugging poco común** (usé 9612) y **que la sonda
  verifique `location.href` contra la URL que pidió** antes de creerse un número. Y
  **`kill <pid>` del propio Chrome, nunca `pkill -f remote-debugging-port`** — eso mata
  el navegador de la otra sesión.
- ⚠️ **Y la de siempre, ahora con la solución buena: mi server de medición se murió
  TRES veces** entre llamadas (`nohup ... & disown` no alcanza en este harness). La
  forma que sí sobrevive es lanzarlo como **background task del harness**
  (`run_in_background`). El síntoma vuelve a ser una sonda que devuelve "no existe el
  elemento" o `WRONGPAGE`; se confirma con `curl -w "%{http_code}"` → **000**.
- ⚠️ **Otra sesión está editando `css/page-service.css` y `CLAUDE.md` al mismo tiempo**
  (mtime 11:21 y 11:25 mientras yo trabajaba; la regla `--centred .service-points__list--4
  { max-width: 72rem }` la agregó ella sobre mi pasada de cards). Sus cambios se
  respetaron; los míos son inserciones con `assert` de una sola aparición.

**2026-08-19 — LA PRIMERA SECCIÓN DE 7 PÁGINAS DE SERVICIO PASA A CARDS CON ICONO:
la card de las páginas de ciudad, traída al chasis** (cliente, con tres páginas de
ejemplo al lado: "quiero que esta primera sección de los distintos servicios sean
cards, como son en las ciudades … y que tengan iconito si se puede"). Un bloque nuevo
en `css/page-service.css` + una clase y un `<svg>` por item en 7 páginas. **Ni una
palabra de copy cambió.**

- **Qué páginas, y por qué exactamente esas 7.** Auditadas las **20 secciones**
  `.service-points` de 10 páginas: en 7 la PRIMERA sección después del hero es el
  pitch de riesgo/why, y en las 7 es además la `.service-section--centred` —
  objektschutz · brandwache · kaufhausdetektei · revier-schliessdienst ·
  sicherheitstechnik · veranstaltungsschutz · baustellenbewachung. Las tres capturas
  del cliente son tres de ésas. ⚠️ **`/empfangsdienst/` e `/interventionsdienst/`
  abren con `.service-prose`** (no tienen este bloque arriba) y **`/werkschutz/` abre
  con `.service-risk`** (ya son cards, con las escenas isométricas), así que no hubo
  nada que convertir ahí.
- ⚠️⚠️ **ES UN MODIFICADOR OPT-IN, NO UN CAMBIO A `.service-points`, y eso es
  deliberado:** ese bloque renderiza 20 secciones. Las **13 restantes siguen
  rayadas**, que es jerarquía y no inconsistencia — el pitch de apertura va carded y
  las secciones de apoyo no. Extenderlo a otra sección es agregar la clase más sus
  iconos.
- ⚠️ **REVIERTE el "RULED, NOT CARDED" de §8.2 para estas 7 secciones.** Esa nota
  sigue siendo correcta sobre POR QUÉ eran rayadas —y sobre esquivar el caveat de
  **3,11:1** de `.service-cases`— y **esta card también lo esquiva**, porque es la
  card de CIUDAD (texto oscuro sobre blanco), no la azul glossy. Medido: título
  **20,87:1**, texto **4,60:1**, icono **3,71:1** (es gráfico, piso 3:1).
- ⚠️⚠️ **TERCERA COPIA DE ESTA CARD EN EL PROYECTO** (`.service-cases__card`,
  `.city-why__item`, ésta), o sea que por la regla propia del proyecto la promoción a
  clase compartida **ya está vencida**. NO se hizo acá: implicaría restilar
  `/werkschutz/` y las 10 páginas de ciudad, todas revisadas por el cliente, en plena
  ronda de review. **Todos los valores están COPIADOS de `.city-why__item`, no
  re-derivados**, así que cuando se haga es un rename.
- ✅ **La grilla NO necesitó nada nuevo:** `.service-points__list` ya tenía el sistema
  `--3/--4/--5/--6`, así que `--cards` sólo compone. Medido: **4-up en las dos páginas
  de 4 items y 3-up en las cinco de 3**, con filas de alto idéntico en todos los
  anchos.
- ⚠️ **SIN estado hover, por dos razones independientes** (las dos anotadas en el
  CSS): estas cards no tienen link ni nada que clickear, así que un lift afirmaría
  una interactividad que no existe; y la lista lleva `data-item-reveal="li"`, o sea
  **GSAP anima ESE elemento y escribe `translate/rotate/scale: none` inline**, que le
  gana a cualquier regla de hoja. Es exactamente la razón por la que el hover de la
  card de ciudad está muerto en producción — acá el problema se evita en vez de
  re-pagarse.
- ⚠️ **La regla azul de 3rem pasa a `content: none`, no se borra**: el icono la
  reemplaza (dos cosas compitiendo por abrir la card), y las otras 13 secciones
  rayadas la siguen necesitando.
- **Los 23 iconos salen del sprite que ya existía — CERO símbolos nuevos** — y se
  eligieron **renderizándolos a 28 y 40px en una hoja de contactos**, no juzgando el
  path: `icon-transparency` es un ojo (para "wird überhaupt bemerkt"), `icon-route` es
  una ruta con nodos, `icon-guard` una persona dentro del escudo, `icon-bag` una bolsa
  de compras. **Ninguno se repite DENTRO de una sección.**
  - ⚠️ **`icon-clock` en vez de `icon-calendar` para "Bauverzögerung"**: el calendario
    del sprite lleva un check, o sea dice "en fecha" — lo contrario de un retraso.
  - ⚠️ **`icon-route` se repite en `/revier-schliessdienst/`** (ya está en su
    `.service-compare`), y se dejó a propósito: significa **lo mismo** en los dos
    lugares (rondas con puntos definidos), o sea no es un glifo haciendo dos trabajos.
  - ⚠️ **`icon-alert` está también en el "Hinweis" de la sección de Kosten** en 5 de
    las 7 páginas. Aceptado: son 5 secciones de distancia y ahí es un glifo inline de
    advertencia, no el ancla de una card.
- ⚠️ **`hyphens: none` scopeado a `--cards`:** el copy pasa a vivir en columnas de 3 y
  4, donde los compuestos alemanes rompen en casi todas las líneas. **Chequeado que no
  desborda**: la palabra más larga es "Kraftstoffdiebstahl" (19 caracteres) contra
  ~232px de ancho interno a 320px. Las otras 13 secciones conservan el
  `hyphens: auto` de base.css.
- **Medido en las 7 páginas a 320 / 390 / 640 / 768 / 1024 / 1100 / 1440 / 1920:**
  card blanca con radio 24px, borde 1px `rgba(1,1,1,0.07)`, sombra de dos capas,
  `::before` en `none`, **los 23 iconos a 28px con `fill: none` + `stroke:
  currentColor`** (o sea el bug de la mancha negra del `<use>` no aparece), **filas de
  alto idéntico y CERO scroll horizontal en todos los anchos, 320 incluido**. El
  markup servido —lo que ve un crawler— trae los 23 iconos.
- ⚠️ **Trampa de medición nueva y cara: DOS `node cards.js` corriendo contra el MISMO
  Chrome se pisan.** Uno quedó en background y el otro navegaba la misma pestaña: la
  sonda reportó "PROBE FAILED" y `cols=3` a 390px (o sea el viewport de otro). Se
  detecta comparando `r.w` contra el ancho pedido — **una sonda tiene que verificar
  que el viewport que midió es el que pidió**. Y `setViewport` va antes de CADA
  `goto`, no una vez por banda.

**2026-08-19 — `/einsatzgebiete/`: EL MAPA DEL HERO ESTABA PEGADO AL BORDE, NO
CENTRADO, EN TODA LA BANDA APILADA** (cliente, en una tablet de 741px: "in tablet,
make the image of this map centred, is aligned to the right"). Tres declaraciones en
`css/page-einsatzgebiete.css`; **cero markup**.

- ⚠️⚠️ **DÉCIMA VEZ DE LA MISMA TRAMPA: `max-width` CAPA UNA CAJA, NO LA CENTRA.** La
  regla de tablet era `@media (max-width: 1023.98px) { .eg-hero__map { max-width:
  34rem } }` **sin auto-márgenes**, y un grid item cuyo `max-width` le impide
  estirarse cae en la posición de arranque de su `justify-self`, o sea contra el borde
  de contenido, con **toda** la holgura junta de un lado.
  **Medido antes: 8px fuera del eje a 600, 49 a 768, 111 a 900 y 163 a 1023** — cuanto
  más ancha la tablet, peor, porque el cap es fijo y la columna sigue creciendo.
- ⚠️⚠️ **Y EL ARREGLO OBVIO ROMPIÓ EL MAPA, que es la SEGUNDA trampa en las mismas
  tres líneas y la cazó la medición, no la vista:** con sólo `margin-inline: auto` el
  item se vuelve **content-sized** (un auto margin cancela el `justify-self: stretch`)
  y un `<svg>` no tiene ancho intrínseco en px, así que colapsó al default de elemento
  reemplazado — **544px → 300px en todos los anchos abajo de 1024**, perfectamente
  centrado y 45 % más chico. Es la misma falla que `page-service.css` documenta para
  la price card. Van **`width: 100%` + `max-width` + `margin-inline: auto`**, las tres.
- ✅ **CENTRAR LA CAJA CENTRA EL DIBUJO, y está medido y no asumido:** `getBBox()`
  reporta la tinta de x 0 a 1000 dentro de un viewBox 0..1000, o sea son el mismo
  rectángulo. **Si una corrida futura de `franken-map.py` cambia el padding del
  viewBox, esa identidad se rompe** — re-medir en vez de confiar en esta línea.
- **El cap de 34rem NO se tocó**: existe para que el mapa no sea lo más grande de una
  pantalla de tablet, y el pedido era centrarlo, no agrandarlo.
- **Medido a 390 / 600 / 741 / 768 / 900 / 1023 / 1024 / 1440:** desvío del eje **0px
  en los seis anchos apilados**, ancho del mapa **544px conservado** (350 a 390, donde
  manda la columna y no el cap), **1024 y 1440 sin un solo cambio** (435,5 y 631,6px,
  idénticos al baseline), y sin scroll horizontal en ninguno. Captura revisada a 741.
  ⚠️ **Inerte en teléfono** (0px de corrección a 390, 8 a 600): ahí la columna es más
  angosta que el cap y no hay holgura que repartir. **Sólo se centra el MAPA** — el
  copy sigue rangeado a la izquierda.
- ⚠️ **VISTO EN LA CAPTURA DEL CLIENTE Y NO TOCADO, es sitewide y pre-existente: el
  breadcrumb se lee ENCIMA del logo apenas se scrollea.** `.site-header` es `sticky`
  con `background-color: rgba(0,0,0,0)` y **sin `backdrop-filter`**, así que el
  contenido pasa por debajo y se ve a través. Verificado a 40px de scroll en
  `/einsatzgebiete/`, `/jobs/` y `/werkschutz/`: **40 / 40 / 8px de solapamiento**. El
  header transparente es una decisión explícita del cliente (2026-07-17), así que
  darle fondo al scrollear es una decisión suya, no un arreglo unilateral.

**2026-08-19 — `/jobs/`: EN EL HERO APILADO LA FOTO VA ARRIBA DEL TEXTO** (cliente:
"en ambos tablet y mobile, quiero que la imagen vaya antes que los textos"). Una
declaración en `css/page-jobs.css`; **cero markup, cero copy**.

- **Cubre TODA la banda apilada, 1024–1279 (tablet) y todo lo de abajo (teléfono)** —
  o sea cada ancho donde este hero es una sola columna. **De 1280 para arriba no
  cambia nada**: ahí la grilla es de dos columnas y la foto ya está al lado del copy
  (verificado: `order: 0`, columnas y ancho de foto idénticos — 661px a 1440).
- ⚠️⚠️ **ES ORDEN VISUAL, NO DE DOM, y eso es deliberado.** El copy sigue primero en
  el markup: el H1 tiene que abrir la página para un crawler y para un lector de
  pantalla, y `js/hero-reveal.js` sigue cascadeando los bloques de copy en su propio
  orden de DOM. **page-conventions §7 prohíbe `order` justamente porque desincroniza
  el tab order de la pantalla — acá esa objeción no aplica, y la razón es concreta:
  dentro de `.jobs-hero__media` no hay NADA focuseable** (un `<picture>`, sin link y
  sin botón), así que ningún tab stop se mueve. **Meter un link o un botón en esa
  columna reintroduce el problema del que esta regla hoy está exenta.**
- ⚠️ **NO se agregó un fade arriba que espeje el `::after` de abajo, y está medido, no
  salteado:** las tres primeras filas del export pican en luminancia **2 (WebP) / 4
  (JPEG)** contra el 1 de la página, o sea **el borde superior de la foto YA ES el
  negro de la página**. El de abajo necesita rampa porque ahí `cover` corta a las
  cuatro personas a media pierna (hasta 21).
- ✅ **COSTO DE LAYOUT CERO, medido en A/B y no supuesto:** reordenar filas en una
  grilla de una columna con gap uniforme no puede cambiar el total, y los números
  coinciden — hero **1164px** y página 9381 a 390, hero **1378** y página 8855 a 1024,
  **idénticos con la regla puesta y sacada**.
- ⚠️ **LO QUE SÍ CUESTA, y es real: arriba de ~900px el H1 cae en el fold o debajo.**
  La foto ocupa el ancho completo de la columna en esta banda (641px a 768 → **1090px a
  1279**), así que llena la primera pantalla. Medido, top del copy: **753 de 1024 a 768
  (bien), 848 de 1000 a 900, 914 a 1024, 1083 a 1279**. En teléfono el H1 sigue bien
  arriba del fold (496 de 844 a 390). Es inherente a poner una foto 13/10 primero en
  una columna de 1000px; **la palanca, si algún día molesta, es un `max-height` en
  `.jobs-hero__media` en esa banda, NO revertir el orden.**
- **Medido a 320 / 390 / 430 / 768 / 900 / 1024 / 1152 / 1279 / 1280 / 1440:** foto
  antes del copy en **los ocho anchos apilados** y después en los dos de dos columnas,
  gap de 64px constante, ratio **1,30 exacto** en los diez (o sea `cover` no recorta),
  H1 en 2 líneas de 768 arriba, y **sin scroll horizontal en ninguno**. Capturas
  revisadas a 390 y 1024.
  ⚠️ Los 30 elementos "fuera del viewport" que reporta la sonda debajo de 768 son el
  falso positivo ya documentado en este archivo: las cards del scroller horizontal
  `jobs-why__grid`, no este cambio.

**2026-08-19 — REGLA GLOBAL: UNA FILA DE CTA SE APILA A TODO EL ANCHO SÓLO POR
DEBAJO DE 640px, Y ESO CAMBIA LAS 54 PÁGINAS** (cliente, con una captura de
`/referenzen/` en tablet: "encargate de que en tablet no pase esto con los CTAs, que
quedan todos largos en la screen, la idea es que queden con un width normal, no que
se alarguen así, y esto en toda la web"). Ocho reglas en cinco hojas, **cero markup,
cero copy**. La plantilla está en
[docs/page-conventions.md §3](docs/page-conventions.md) y el razonamiento canónico
en `.service-hero__actions` de `css/page-service.css`.

- ⚠️⚠️ **EL DEFECTO ERA REAL Y MEDIBLE, Y LA CAUSA ES UN BREAKPOINT DEMASIADO
  ANCHO.** El apilado full-width llegaba a **767.98px**, así que en el tope de esa
  banda la píldora del teléfono —**209px de contenido**— renderizaba **720px de
  ancho**. Una píldora de cinco palabras conteniendo un número de teléfono no se lee
  como botón, se lee como layout roto. **La captura del cliente se reprodujo exacta a
  767px** (H1 en una línea, lede en dos, los dos CTA a todo el ancho) — o sea el
  "tablet" que estaba mirando cae dentro del bloque de teléfono. ⚠️ Ojo con esto: un
  iPad en portrait son 768 CSS px, pero **una ventana de escritorio de 768 con
  scrollbar deja ~752**, o sea del lado equivocado del corte.
- **640 NO es un número redondo: es donde se termina el motivo de la regla.** El
  apilado existe porque a 390px el par no puede compartir fila (558px de contenido
  contra ~350 disponibles). Medido, el par pide **325 + 209 + 24 = 558px** y a 640
  hay **598px** — entra en todas las páginas que lo publican. De ahí el corte.
- ⚠️ **TRES COMPONENTES YA CORTABAN EN 639.98** (`.faq__cta`, `.rg-cta__actions` /
  `.rg-close__actions`, `.sk-actions` / `.sk-cta-box`), o sea el sitio tenía **dos
  umbrales para una sola decisión**. Esto alinea todo en el más angosto en vez de
  inventar un tercero. Por eso `/ratgeber/`, los artículos y `/sicherheitskonzept/`
  midieron **0 diferencias**: ya estaban del lado correcto.
- **La banda 640–767 no necesitó UNA regla propia**, y eso es lo que hace el cambio
  chico: **todas las filas de acción del sitio son `flex-wrap: wrap` de base**, así
  que un par que no entre cae a dos líneas de botones al ancho de su contenido en vez
  de desbordar. Pasa en **un solo lugar del sitio** — el par de las case studies
  (383 + 209 + 16 = 608 contra 598 a 640), verificado en captura y sin scroll
  horizontal.
- **Se implementó con `@media` ANIDADAS dentro de cada bloque de teléfono**, no
  moviendo reglas a otro lugar del archivo: cada declaración se queda al lado del
  comentario que la explica y el orden de fuente no se toca. Es el patrón que
  `page-service.css` ya usaba para el `min-width: 768px` de `.service-contrast__module`.
- ⚠️ **LA EXCEPCIÓN QUE NO SE ARREGLA MOVIENDO UN BREAKPOINT: `.service-price__cta`
  no depende del viewport, llena su CARD** — y la card pasa a columna completa por
  debajo de 900px. Medido: **648px de ancho a 767 en las 36 páginas** que publican la
  caja, o sea exactamente la píldora que el cliente marcó en el hero, una sección más
  abajo. Lleva `max-width: 22.5rem` desde 640px, que **es el ancho que ese mismo
  botón ya tiene en escritorio** (la card topa en 432 y su interior mide 360): el cap
  es **inerte** a 900 / 1024 / 1280 / 1440 (243 / 290 / 360 / 360, sin cambio) y el
  "nearly full width inside the card" del cliente (2026-08-05) sigue valiendo donde
  fue escrito.
  ⚠️ **NO lleva `margin-inline: auto`, y eso es una medición, no un olvido:** `.btn`
  es `inline-flex`, o sea inline-level, donde las auto-márgenes inline **no hacen
  nada** — se escribió y se borró en vez de dejar una declaración que no puede
  disparar. Tampoco hace falta: medido a 767, el botón capado arranca en **59px,
  exactamente el borde del texto de la lista de tics**, o sea ya está alineado con el
  contenido de la card.
- ⚠️ **EL SUBMIT DEL FORMULARIO COMPARTIDO QUEDA FUERA, a propósito.** Es un control
  dentro de una card blanca, no una fila de CTA, y su ancho completo es una decisión
  propia de `lead-form.css` documentada en la pasada móvil. Sigue full-width en
  teléfono y tablet; si el cliente lo quiere capado también, es una regla más.
- ✅ **VERIFICADO POR A/B CON DOS BUILDS EN PARALELO (8311 nuevo / 8312 con el árbol
  exacto de antes del cambio), NO por razonamiento — 486 comparaciones fuera de la
  banda con CERO diferencias:**
  **216 a 320 / 390 / 600 / 639 → 0 difieren** (el render de teléfono que el cliente
  ya revisó no se movió un píxel) y **270 a 900 / 1024 / 1280 / 1440 / 1920 → 0
  difieren**. Dentro de la banda el diff es exactamente el pedido: hero
  **720+720 → 325+209**, price CTA **648 → 360**, y la página se acorta ~60px porque
  el par deja de ocupar dos renglones.
- **Barrido de las 54 páginas a 640 / 700 / 767 / 834 (216 corridas):** sin scroll
  horizontal en ninguna, **cero botones por encima del 72 % del viewport**, y nada
  pintado fuera de pantalla salvo los dos scrollers horizontales CONTENIDOS que este
  archivo ya documenta como falso positivo (el strip `system-story` del homepage y
  `jobs-why__grid` de `/jobs/`). Capturas revisadas a 767 (`/referenzen/`,
  `/werkschutz/`, la caja de precios) y a 640 (el par que envuelve).
- ⚠️⚠️ **TRAMPA DE VERIFICACIÓN QUE CASI PUBLICA UN FALSO POSITIVO Y VA A VOLVER: un
  baseline sacado de `git show HEAD:` NO es "antes de mi cambio".** El working tree
  tiene 40 archivos modificados sin commitear, así que ese A/B reportó **18 páginas
  con diferencias** —botones de 288 → 280 y páginas 300px más altas— que eran trabajo
  de días anteriores, no de esta pasada. El baseline correcto se reconstruye
  aplicando la transformación INVERSA sobre el working tree actual.
  ⚠️ Y al reconstruirlo, **una regla que se AGREGÓ no se revierte "desanidándola"**:
  desenvolver el `@media (min-width: 640px)` del price CTA dejó su `max-width`
  aplicando a TODOS los anchos, así que el baseline mostró 360px donde el original
  tenía 512 y el diff salió invertido. Una regla nueva se BORRA del baseline, no se
  desanida.
- ⚠️ **Nota de medición: `getBoundingClientRect().width` no sirve para leer el ancho
  NATURAL de un botón apilado.** Poner `width: auto` inline no le gana a
  `align-items: stretch` del contenedor en columna (el stretch fija el tamaño
  cruzado), así que la sonda devolvió 599px de "ancho natural" para botones de 325.
  Hace falta `align-self: flex-start` también, o medir en el estado de fila.

**2026-08-19 — `/jobs/`: EL TÍTULO Y EL CTA DE LA SECCIÓN "Wen wir suchen" VAN
CENTRADOS** (cliente: "center the title and the cta"). Tres reglas en
`css/page-jobs.css`, cero markup, cero copy.

- **Los cinco peldaños de la escalera se quedan rangeados a la izquierda**: es la
  composición estándar de este sitio —**header centrado, contenido a la
  izquierda**— que ya usan `.service-section--centred`, el Warum y el FAQ de
  `/leistungen/` y el Vertrauen del hub de ciudades. Centrar cinco filas de dos
  columnas les saca el borde izquierdo contra el que el ojo compara una lista.
  Medido: las 5 filas conservan su propio borde (39–48px según el ancho).
- ⚠️⚠️ **REVIERTE LA NOTA QUE VIVÍA EN `.jobs-levels__actions`, y quedó escrita
  entera en el CSS para que nadie la "restaure" como bug:** ese comentario
  argumentaba que el botón TENÍA que ir a la izquierda porque el título y las filas
  van a la izquierda, y un botón centrado debajo de una lista izquierda se lee como
  perteneciente a otra cosa. La decisión posterior del cliente gana — y además
  **desarma esa objeción**, porque ahora el título también está centrado, así que el
  botón se alinea con lo único que tiene arriba.
- ⚠️ **El H2 necesitó cap Y auto-márgenes, no sólo `text-align`** (van diez veces en
  este proyecto): el chasis deja `.section__intro` en `max-width: none`, así que este
  título de **65 caracteres** corría **una sola línea de ~1200px a 1440** y se leía
  como un banner. `max-width: 30ch` + `margin-inline: auto` + `text-wrap: balance` lo
  parte en **dos líneas parejas de 600 para arriba**. En `ch` y no en px porque el H2
  es un clamp, o sea el cap tiene que seguir a su propio tamaño de tipografía.
- **El botón se centra con `text-align` en su wrapper** — `.btn` es `inline-flex`, así
  que no hizo falta flexbox. ⚠️ **Inerte por debajo de 768px**, donde el bloque de
  teléfono le da `width: 100%`.
- **Medido a 320 / 390 / 600 / 768 / 1024 / 1280 / 1440 / 1920:** título y botón a
  **0px del eje del container en los 8 anchos**, H2 en 2 líneas de 600 arriba (3 a 390
  y 4 a 320, inherente a 65 caracteres en una columna de 280–350), las 5 filas con su
  borde izquierdo intacto, y sin scroll horizontal.
  ⚠️ **Los 30 elementos "fuera del viewport" que reporta la sonda por debajo de 768 no
  son de este cambio ni son un defecto**: son las cards del strip `jobs-why__grid`,
  que es un scroller horizontal CONTENIDO (verificado elemento por elemento). Es
  exactamente el falso positivo que este archivo ya documenta para los seams.

**2026-08-19 — REDISEÑO DE BREADCRUMBS, EN LAS 53 PÁGINAS QUE LO LLEVAN: CERO
SUBRAYADOS, LA PÁGINA ACTUAL EN REGULAR, Y LA OPACIDAD BAJANDO HACIA ATRÁS**
(cliente: "saca los underlines, no va a haber underlines en ningún momento … el
último, o sea en la que estamos, no esté bold, sea regular y más gris, después
Leistungen con un poco menos opacidad y Startseite con menos opacidad aún").
Todo en `css/components.css`; **cero markup**. La plantilla está en
[docs/page-conventions.md §3](docs/page-conventions.md).

- ⚠️⚠️ **LA ESCALA SE ANCLA AL FINAL DEL TRAIL, NO AL PRINCIPIO, y eso es
  exactamente lo que el cliente se tomó el trabajo de explicar** ("si vamos a
  Leistungen vamos a tener Leistungen con la opacidad que tiene Interventionsdienst
  ahora y Startseite va a tener la opacidad que tiene Leistungen ahora"). O sea el
  peso de un crumb sale de su **distancia a la página actual**, no de su
  profundidad. Por eso los selectores cuentan con `:nth-last-child` y **el valor más
  bajo es la BASE**: cualquier trail, a cualquier profundidad, termina igual.
  Medido en las 8 páginas de muestra: 2 niveles → **75/60**, 3 → **75/60/50**,
  4 → **75/60/50/50**.
- ⚠️ **Los `<li>` alternan item / separador / item**, así que los crumbs caen en
  posiciones IMPARES: el padre es `:nth-last-child(3)`, **no** `(2)`.
- **Los valores están medidos contra el piso de contraste, no elegidos a ojo:** son
  labels de **15px**, o sea texto normal con piso de 4,5:1 —
  85 % = **14,79:1**, 60 % = **7,33:1**, 50 % = **5,29:1** sobre `#010101`.
  ⚠️ **La página actual arrancó en 75 % y el cliente la subió a 85 % el mismo día**
  ("dale un poco más de opacidad al último, onda la página en la que estamos"). Sigue
  por debajo de la tinta plena a propósito: eso es lo que la mantiene "regular y más
  gris" en vez de volver al blanco bold de antes. Efecto secundario deseable: el salto
  al padre pasa de 192→153 a **217→153**, o sea la escala se lee más clara.
  ⚠️ **La base no puede bajar de ~46 %, que es donde se rompe el 4,5:1.** Por eso
  las 16 combo (4 niveles) comparten la base en sus dos primeros crumbs en vez de
  estrenar un cuarto escalón.
- **El chevrón baja a 40 % (3,67:1) y queda por debajo del label más apagado**, que
  es lo correcto: **un chevrón no puede pesar más que una palabra**. Antes estaba en
  `--color-text-muted` (0,65), o sea más fuerte que dos de los tres tiers nuevos. Es
  `aria-hidden`, así que no le aplica ningún mínimo.
- **`color-mix` sobre `--color-text`, NO un blanco literal con alfa:** ese token se
  invierte a tinta oscura dentro de `.section--light`, así que la escala sobrevive el
  día que un breadcrumb caiga sobre un hero claro. **Hoy ninguno lo hace —
  verificado en las 54 páginas, no asumido.**
- **El hover resuelve a la tinta PLENA en vez de devolver un subrayado**
  ("en ningún momento"), y `:focus-visible` conserva el anillo global de base.css,
  que es el cue no-cromático de verdad. **Verificado con puntero real**
  (`Input.dispatchMouseEvent`, porque `:hover` no responde a un `dispatchEvent` de
  página): `rgb(255,255,255)` y `text-decoration-line: none`.
- ⚠️⚠️ **`/kontakt/` SE HABRÍA QUEDADO EN EL DISEÑO VIEJO EN SILENCIO.** Tenía el
  tratamiento entero re-declarado a **(0,2,0)** en `page-contact.css` —sus propios
  inks `--kc-*`, la página actual en bold y **un subrayado de vuelta en hover**— y la
  especificidad más alta gana siempre. Esas reglas se **BORRARON**, que es además lo
  que pedía el comentario de ese mismo bloque desde julio ("THIS IS MEANT TO BE
  SITE-WIDE… el lugar correcto es components.css"). `--kc-ink` es `--color-white`, o
  sea la misma tinta a la que resuelve la regla compartida, así que **nada más de esa
  página se movió**. Sobrevive sólo su `gap` de `--space-3`.
  **Lección: antes de cambiar un componente compartido, grepear los overrides
  page-scoped — un cambio en components.css no llega a una página que lo re-declara.**
- **Medido en 18 páginas** (los 12 tipos: servicio, hub, ciudad, combo de 4 niveles,
  case study, Ratgeber, legales, `/jobs/`, `/kontakt/`, `/angebot/`,
  `/sicherheitskonzept/`, homepage) y **re-medido después de subir el último a 85 %**:
  **45 crumbs, 0 con subrayado y 0 fuera del peso 400** —la página actual incluida—, la escala en el orden correcto en las 17 que
  llevan trail, los separadores todos en 0,4, y la homepage sin breadcrumb como
  corresponde.
- **Contraste verificado contra el BACKDROP REAL de cada glifo, no sobre el token:**
  se ocultó el trail, se capturó y se muestreó **el rect de cada crumb** en los dos
  heroes con foto (`/werkschutz/` y `/leistungen/`) a 1440 y 390 — **todos pasan**,
  y el peor caso es **4,76:1** (el "Startseite" al 50 % contra el píxel p95 más claro
  de la foto de werkschutz). Es la razón por la que la base no puede bajar más.
- ⚠️⚠️ **TRAMPA DE ENTORNO QUE YA ME COMIÓ DOS VECES HOY Y QUE ESTE ARCHIVO DEBERÍA
  HABERME AHORRADO: un server de medición se murió a mitad de la sesión y la sonda
  devolvió "no existe el elemento", que se lee como bug de la página.** El tell es
  `location.href === "chrome-error://chromewebdata/"`. Se confirma con
  `curl -o /dev/null -w "%{http_code}"` → **000**. **Levantar el server con `nohup`
  + `disown`** (sin eso no sobrevive entre llamadas) y chequear el 200 antes de creer
  una medición vacía.
- ⚠️ **Nota de medición: `Input.dispatchMouseEvent` necesita DOS `mouseMoved`** — el
  primero desde otra coordenada. Con uno solo `matches(':hover')` devuelve `false` y
  parece que el hover no aplica.

**2026-08-19 — `/werkschutz/`: LA CAJA "Werkschutz + Technik aus einem Konzept" VA
CENTRADA** (cliente: "esto en werkschutz hacelo centrado"). Una declaración de CSS y
una clase en el markup.

- **Se centra LA CAJA, el texto de adentro sigue a la izquierda**, y eso no es una
  interpretación libre: es la regla que este componente ya tiene escrita del
  **2026-08-17** (`.service-prose` / `.service-trust` ya lo centran así) con su razón
  — el contenido es un párrafo de 3–4 líneas en una caja de 46rem, y la convención
  del proyecto para prosa centrada es medida más angosta + `hyphens: none`
  (`/referenzen/`), que en un callout no aplica. **Si el cliente quiere también el
  texto centrado, son dos declaraciones más; no se hizo de arriba.**
- ⚠️ **LA CAUSA: `.service-highlight` está capado a 46rem y NO tiene auto-márgenes
  propios**, así que en cualquier sección donde no se los dé alguien, la caja queda
  pegada al borde izquierdo. Es la misma trampa que este archivo documenta nueve
  veces: **`max-width` no centra nada — `margin-inline: auto` centra la CAJA,
  `text-align` centra el TEXTO.**
- ⚠️ **Va por CLASE OPT-IN (`.service-highlight--centred`), no por scope de
  sección**, y la razón es de alcance: la misma caja vive en `.service-scope` también
  en **`/brandwache/` y `/objektschutz/`**, y en `.service-points` en **2 páginas
  combo** — un selector por sección habría movido páginas que el cliente todavía no
  revisó (está corrigiendo los servicios de a uno). **Sumar cualquiera de esas es
  agregar la clase.**
- **Medido a 320 / 390 / 600 / 768 / 1024 / 1152 / 1440 / 1920:** caja a **0px del eje
  del container** en los 8 anchos, con aire **idéntico a los dos lados** (249/249 a
  1440, 312/312 a 1920, 122/122 a 1152, 67/67 a 1024), texto en `start` y sin scroll
  horizontal. **Debajo de 1024 el cap de 46rem es inerte** (la caja llena la columna),
  o sea ahí no cambió nada.
- ✅ **Verificado que NO se movió ninguna otra página**: las 7 que publican esta caja
  medidas a 1440 — `/brandwache/`, `/objektschutz/` y las 2 combo siguen pegadas a la
  izquierda (`margin 0px`), y `/empfangsdienst/` y `/veranstaltungsschutz/` siguen
  centradas por la regla del 08-17. Sólo `/werkschutz/` cambió.

**2026-08-19, MISMO DÍA — DOS CORRECCIONES: EL SUBMENÚ DEL NAV MÓVIL SE PODÍA LEER
MAL, Y EL MAPA DE CIUDAD/COMBO CRECE OTRA VEZ** (cliente: "cuando abrimos el piquito de
los servicios o las ciudades en el nav de mobile hacé los nombres más grandes y más
blancos porque no se leen" + "el mapa en las secciones de ciudades y las de
ciudad+servicio hacelos más grandes").

- **EL SUBMENÚ ERA UN PROBLEMA DE CONTRASTE MEDIBLE, no una impresión.** Medido con el
  drawer abierto: los links de ciudad/servicio salían a **14,06px en
  `rgba(255,255,255,0.65)`**, justo debajo de sus propios ítems de primer nivel a
  **21px en blanco pleno** — un tercio más chicos y un tercio más apagados, en el único
  lugar del sitio donde hay que leer una lista de diez destinos con el teléfono en la
  mano. Ahora **18px**, y **gris** (pedido inmediatamente después: "prefiero que el color
  de la lista de los servicios en el menú sea gris, no blanco"). Los dos pedidos tiran
  para lados opuestos, así que el reparto es: **el TAMAÑO carga la legibilidad y el COLOR
  la jerarquía** — blanco al **0,8**, ni el 0,65 de antes (que es lo que las volvía
  ilegibles a 14px) ni blanco pleno (que las aplanaba contra su propio ítem padre).
  **Medido sobre el negro del drawer: 13,02:1**, contra 8,6:1 del 0,65 y 20,9:1 del
  blanco sólido. Verificado en los dos submenús.
- **Y las sublistas llevan DIVIDERS** (pedido a continuación: "hacé dividers también en
  estas sublistas"): hairline entre filas con `li + li`, así **no hay línea arriba de la
  primera ni abajo de la última** — el borde izquierdo del submenú ya marca dónde empieza
  el grupo. La fila "Alle Leistungen →" toma el mismo divisor, si no diez filas rayadas
  terminaban en un link flotando.
  ⚠️ **`gap: 0` ES PARTE DEL DIVIDER, no una limpieza aparte**: con gap, la hairline
  flota en el medio de 12px de nada y se lee como una línea suelta; con las filas
  pegadas, **el padding de la fila es el ÚNICO mecanismo de espaciado**, que es lo que
  después permitió airearla sin tocar el divisor (cliente: "make the list a bit more
  spaced, it's too tight"): `padding-block` 0,35 → **0,8rem**, o sea la fila de **44 a
  56px** y la lista de diez de 440 a 573. **Medido, no estimado — 0,6rem daba 50px y se
  leía casi igual.**
  ⚠️ **El panel de ESCRITORIO no se los lleva**, y hay un reset explícito para eso: es
  una grilla de DOS columnas sobre superficie clara, donde `li + li` rayaría nueve de
  diez celdas **incluida la primera de la segunda columna**. Hoy sería invisible
  (`--color-border` es blanco al 0,12 sobre panel blanco), que es justo por qué se
  escaparía sin que nadie lo note.
- **EL CTA DEL DRAWER VA ABAJO Y CENTRADO** (pedido a continuación: "y el cta ponelo
  abajo al centro"). El panel pasa a `display: flex; flex-direction: column` y las
  acciones a `margin-top: auto`.
  ⚠️⚠️ **PRIMERO LO ESCRIBÍ EN EL BLOQUE MÓVIL EQUIVOCADO Y NO HIZO NADA — medido,
  `margin-top: 24px` y el botón a 138px del fondo.** Este archivo tiene DOS bloques
  `max-width: 1399.98px`, y entre ellos está la regla base de `.site-nav__actions`, que
  es **desktop-first, sin media query, con su propio `margin-top: var(--space-5)`**.
  Misma especificidad (0,1,0) y **más abajo en el archivo**, así que gana por orden —
  una media query no suma peso. **Cualquier override móvil de una propiedad que esa
  regla base también fija tiene que escribirse en el SEGUNDO bloque.**
  ⚠️⚠️ **Y COMO REGLA PLANA ROMPIÓ EL MENÚ: LA CRUZ DEJÓ DE CERRARLO.** El cliente lo
  encontró en minutos ("estoy clickeando la cruz y pasa esto"). `initNavToggle()` cierra
  el panel poniendo el ATRIBUTO `hidden`, que lo oculta por la hoja del navegador
  (`[hidden] { display: none }`) — y **cualquier `display` de autor le gana a una regla
  de UA**, así que el panel se quedaba en pantalla con la X sin efecto visible. Va
  `.site-nav:not([hidden])`, que además de subir la especificidad **deja de matchear en
  el instante en que el JS oculta el panel**.
  ⚠️ **El bloque de escritorio ya documentaba la trampa ESPEJO** para `.site-nav[hidden]`
  (ahí el nav tiene que verse A PESAR del atributo). Mismo atributo, misma lección, en
  las dos direcciones.
  **Verificado el ciclo completo**: al cargar `display: none`; abierto `flex` y tapando
  la pantalla; **tras la cruz `display: none`**; y otra vez con un submenú abierto.
  **Medido después**: a 390x844 el CTA queda **centrado (0px de desvío) y a 48px del
  fondo**, que es el propio `padding-bottom` del panel. ⚠️ En pantallas donde el
  contenido ya no entra (390x667, 320x568, o con un submenú abierto) **`auto` colapsa a 0
  y el botón sigue a la lista** — que es lo correcto en un drawer que scrollea.
  **Escritorio verificado intacto**: `margin-top: 0`, fila horizontal, sin dividers.
- ✅ **De paso quedaron en 44px de alto exactos** (18px de línea + 0,35rem de padding
  arriba y abajo), o sea pasan el mínimo táctil que antes no alcanzaban (~20px).
- ⚠️ **Las declaraciones del bloque MÓVIL no son las del panel de escritorio.** El
  bloque de ≥1400px re-declara tamaño y color para el panel flotante, que es una
  superficie **CLARA** donde el texto blanco sería invisible. Tocar uno no toca el otro,
  y tienen que seguir así.
- **Verificado el invariante del drawer**: con los submenús colapsados sigue entrando en
  una pantalla a 390x844 (844 de 844), que es la razón por la que existe el acordeón. Con
  uno abierto el drawer scrollea — **ya scrolleaba antes** (`overflow-y: auto`), sólo que
  ahora la lista mide 440px en vez de 200.
- **EL MAPA: segunda subida del día, y las dos mitades del rango se movieron por razones
  distintas.**
  · **Escritorio `min(30rem, 100svh − 22rem)` → `min(36rem, 100svh − 20rem)`.** El
    segundo término es el que ata de verdad en un portátil de 900px de alto, así que
    subir sólo el cap no habría hecho nada. Medido a 1440x900: **480 → 576px**.
  · **Móvil/tablet `clamp(9.5rem, 28vw, 18rem)` → `clamp(10rem, 34vw, 22rem)`**:
    390 **152 → 160**, 600 168 → 204, 768 215 → **261**, 834 234 → **284**.
- ⚠️⚠️ **EL TELÉFONO ESTÁ EN SU TECHO Y POR ESO CASI NO SE MOVIÓ (152 → 160), y la
  restricción es la PÁGINA COMBO, no la de ciudad.** El mapa va ARRIBA del copy en una
  columna, así que cada píxel empuja el CTA. Slack medido a 390 antes de esta pasada:
  43px en una ciudad y **26px en una combo** (su par de CTA con teléfono primero es más
  alto). El candidato que llevaba la tablet a 284 subiendo el piso a 11rem dejaba el CTA
  de la combo a **2px** del fold. Con 10rem queda en 826 de 844.
  **No volver a subir el piso sin medir el CTA a 390 en una COMBO — las de ciudad no son
  el caso ajustado.**
- ⚠️ **UNA CIUDAD ANCHA NO CRECE CON ESTO, y es inherente**: la forma se dimensiona por
  ALTO con `max-width: 100%`, así que en un contorno más ancho que alto **manda la
  COLUMNA**. Coburg mide 214px a 1024 y 304 a 1440 **antes y después**. La palanca para
  ésas es el split de columnas del hero, que le sacaría ancho al copy — otra decisión.

**2026-08-19, MISMO DÍA, TERCERA PASADA — EL SEAM DE PÍXELES SALE DE LA FOTO, NO DE
UNA BARRA NEGRA** (cliente: "the pixel transition is now in black and it has to be like
it is in /leistungen/, that there is no black part, only the image").

- **Es el mismo defecto para el que se inventó `.pixel-seam--photo` el 2026-08-07**,
  llegando acá por la misma razón: un seam normal pinta tiles del color de la sección
  de ARRIBA y los despinta, y sobre una fotografía eso es **una barra negra plana**
  entre la foto y la sección siguiente. Medido antes: banda en y=1127 (el borde de
  abajo del hero) con tiles `rgb(1,1,1)`.
- ⚠️⚠️ **NO SE PUEDEN USAR LAS CLASES `--photo`, y por eso está reconstruido en CSS.**
  Ese modificador es `position: absolute; inset: auto 0 0`, que sólo funciona porque
  `/leistungen/` tiene el seam ADENTRO del hero; el nuestro es hermano en flujo
  después de él, y **en escritorio tiene que seguir siéndolo**. Una clase en el markup
  aplica a todos los anchos: a ≥1024 el seam se volvería absoluto contra `main` y
  **aterrizaría al final de la página**. Así que el comportamiento se rehace con
  selectores de hermano, scopeado al breakpoint, y **el markup no se toca**.
- **Son tres mitades y hacen falta las tres:** la banda sube **su propio alto** para
  quedar sobre la última franja de foto en vez de colgar en negro debajo del hero; los
  tiles pasan al color de DESTINO y se **invierten** (nacen invisibles y aparecen,
  `.is-revealed { opacity: 1 }`, el mismo flip que hace `--photo`); y la sección
  siguiente **deja de reservar** los 120/200px para una banda que ya no está delante
  de ella, mientras el hero crece ese mismo alto para que el copy nunca quede debajo
  de un tile.
- **`--color-white` y no un destino por token**: las nueve abren sobre una
  `.section--light` — **verificado en las nueve, `rgb(255,255,255)`** — y #FAFAFA se
  leería como una banda grisácea entrando a una sección blanca, que es la misma razón
  por la que `.pixel-seam--photo-light` usa ese valor exacto. Si alguna vez una página
  de servicio abre sobre sección oscura, eso es un modificador, no una edición.
- ⚠️ **El alto de la banda queda expresado DOS veces** (200px y 120px abajo de 768),
  porque vive en `.pixel-seam__band`, que es un HERMANO — su variable no se puede
  heredar desde el hero. Es el mismo "escrito dos veces, mantener en sincro" que el
  bleed hero ya carga para `--service-hero-band-h`.
- **Medido en las 9 páginas a 390 y 834**: banda **sobre la foto** en las 18
  combinaciones, **todos los tiles blancos**, el copy **libre** de la banda, 0 tiles
  visibles en reposo y sin scroll horizontal. Y por scroll real con Lenis: **0 → 16 →
  26 → 30 tiles** apareciendo al bajar, o sea el dissolve corre de verdad.
- **Escritorio intacto**: a 1440 el seam sigue debajo del hero, con tiles negros y la
  sección reservando sus 296px.

**2026-08-19, MISMO DÍA, SEGUNDA PASADA — LA FOTO LLEGA HASTA ARRIBA DE LA PÁGINA Y EL
CONTENIDO BAJA** (cliente, viendo la primera versión: "la imagen tiene que ir hasta
arriba, no puede haber una franja negra que la corte … y poné un poco más abajo el
contenido, no tan arriba, como en /leistungen/").

- ⚠️ **LA FRANJA ERA MEDIBLE, no una impresión: 131px** — 76 del header (que es
  TRANSPARENTE) más 55 de la fila del breadcrumb, o sea fondo de página arriba de la
  foto. La primera versión hacía la foto fondo **de la sección**, y la sección empieza
  después del breadcrumb.
- **Ahora la geometría es la de `/leistungen/`, medida contra ella**: hero en
  **y = −36/−38** contra su −20, y el texto del breadcrumb en **y = 108**, exactamente
  el 108 de esa página. El H1 pasó de ~230 a **352** a 390 (el cliente pidió "más
  abajo"), contra los 377 de `/leistungen/`.
- ⚠️⚠️ **NO se usó `.service-hero--bleed`, y no por capricho: optar por ese modificador
  obliga a mover el breadcrumb ADENTRO de la sección**, que es markup en 9 páginas **y
  lo movería también en ESCRITORIO**, donde estas páginas conservan el split de dos
  columnas. En vez de eso la sección se sube por encima del breadcrumb
  (`margin-top` negativo, devuelto como padding) y **el breadcrumb se levanta por
  encima de la foto**, que es donde `/leistungen/` lo muestra igual.
- ⚠️ **EL PULL ES `breadcrumb + 6rem` Y LAS DOS MITADES ESTÁN MEDIDAS.** La fila del
  breadcrumb mide 54–56px y **se queda en UNA línea a 320 / 360 / 390 / 600 / 834 /
  1023** (verificado), más los 32px que este bloque le agrega para despegarla del nav:
  5.5rem. El 6rem es la misma constante generosa que ya usa el bleed hero para el
  header — más que los 76px que mide, a propósito, para que siga funcionando si el
  header crece.
  ⚠️ **Es UN número en DOS lugares**: si cambia el padding del breadcrumb hay que
  cambiar `--svc-crumbs-h`. Con 3.5rem quedaba **una franja negra de 16px arriba**,
  medida — así se detecta.
- ⚠️ **DOS REGLAS SOBRE EL BREADCRUMB, PARTIDAS POR QUÉ PASA SI EL SELECTOR FALLA.**
  El `z-index` va **sin scopear**: sin él la foto (que es un absoluto) le pinta encima
  y el breadcrumb **desaparece**, así que eso no puede depender de un selector que un
  navegador podría no conocer — y es no-op en el resto del sitio (nada se superpone a
  un breadcrumb en ninguna otra página; verificado en /kontakt/, /referenzen/, /jobs/,
  /ueber-uns/ y una ciudad: siguen en y=92 con su padding de 16px). El **padding** sí
  lleva `:has()`, porque es lo realmente específico de estas páginas y su modo de falla
  es inofensivo: sin él la foto arranca 32px más arriba, no se rompe nada.
- ✅ **CONTRASTE RE-MEDIDO CON PÍXELES, y ahora incluye el nav y el breadcrumb, que
  quedaron sobre la fotografía**: logo **7,3–19,6**, breadcrumb **6,4–18,3**, badge
  **5,2–7,2**, H1 **5,3–6,6**, lede **6,2–8,4**, tics **8,9–16,4**. Las 9 páginas × 390
  y 834, todo arriba de 4,5:1.
  ⚠️ **Seis lecturas de "1,00" en los tics eran EL BOTÓN DE WHATSAPP**, que es `fixed`
  abajo a la derecha y cae dentro del rect del tic a 390 — su glifo blanco es el "peor
  píxel". Re-medido ocultándolo: 8,9–16,4. **Una sonda de contraste tiene que ocultar
  también lo que flota.**
- **Barrido a 320 / 360 / 390 / 600 / 768 / 834 / 1023**: la foto arranca en y ≤ 0 en
  los siete, **cero franja negra**, sin scroll horizontal. **A 1024 y 1440 nada cambió**
  (la `<figure>` vuelve a `position: static` en su columna) y **`/ueber-uns/` sigue
  intacta** en los tres anchos.
- ⚠️⚠️ **LO QUE COSTÓ LA RONDA ANTERIOR NO FUE EL CÓDIGO: EL CLIENTE MIRABA OTRO
  ÁRBOL.** El preview de `:8123` lo sirve otra sesión desde su propio scratch
  (`…/de84d294-…/scratchpad/build/dist`), o sea un snapshot congelado — tenía todos los
  cambios del día MENOS el último. **Se detecta en un comando**, y no leyendo el CSS:
  `curl http://127.0.0.1:<puerto>/css/page-service.css | grep <la regla>` → 0 en 8123 y
  3 en 3000. Un `diff -rq` de los dos `dist/` mostró que **difería exactamente un
  archivo**. El puerto que siempre refleja este repo es **:3000**
  (`serve-dev.js /Users/maquesymonds/Desktop/FRANKONIA/dist`).

**2026-08-19 — EN LAS 9 PÁGINAS DE SERVICIO, ABAJO DE 1024px LA FOTO DEL HERO PASA A
SER EL FONDO EN VEZ DE UNA CAJA DEBAJO DEL TEXTO** (cliente: "in tablet and mobile, in
the services individual pages, put the image in the background, like you're doing in
/leistungen/"). Todo en `css/page-service.css`, **cero cambios de markup**.

- ⚠️ **ESTO NO ES `.service-hero--bleed`, aunque sea el tratamiento que el cliente
  señala.** Optar por ese modificador son DOS cosas juntas — la clase **y** mover el
  breadcrumb adentro de la sección (su propia nota lo dice, y la primera versión de
  aquel cambio metió cinco heroes encima de su breadcrumb). Estas páginas conservan
  `main > .breadcrumbs` arriba del hero en todos los anchos, así que **la foto arranca
  debajo del breadcrumb y no en el borde de la página**. Todo lo demás es la misma
  idea. El bleed de verdad es un cambio de markup en 10 páginas y movería el
  breadcrumb **también en escritorio**, que no es lo que se pidió.
- ⚠️⚠️ **DOS REGLAS QUE SON UN SOLO MECANISMO, y esto costó una ronda: un absoluto
  resuelve contra su ancestro POSICIONADO, y la `<figure>` vive dentro de
  `.service-hero__grid`, al que el chasis le pone `position: relative`.** Así que
  `inset: 0` cubría **el grid, no la sección** — medido **390x584 en y=163 dentro de un
  hero de 390x868**, o sea una foto que no llegaba al padding de la sección por ningún
  lado. Pasar el grid a `static` le devuelve el trabajo a `.service-hero` (que ya es
  relative y ya es `overflow: hidden`), y recién ahí el copy necesita posicionarse él
  mismo, o un absoluto le pinta encima.
- ⚠️ **`width/height: 100%` explícitos, y NO por redundancia: la `<figure>` lleva un
  `aspect-ratio` INLINE por página** (el ratio real de cada archivo, que en escritorio
  reserva el espacio), y un estilo inline le gana a cualquier hoja. Con `height: auto`
  el ratio gana y dimensiona la caja desde el ancho — ésos eran los 584px. **Dos ejes
  definidos vuelven el ratio inaplicable por spec**, así que el override no necesita
  `!important`, que este proyecto no usa.
- **El wash es VERTICAL, no la rampa lateral del bleed hero**: aquélla funciona porque
  su copy vive en la mitad izquierda, y acá el copy ocupa todo el ancho a estos
  tamaños — un gradiente horizontal dejaría el final de cada línea sobre foto pelada.
  Es la misma decisión que ya toman el homepage y `/werkschutz/` en este breakpoint.
- ✅ **CONTRASTE MEDIDO CON PÍXELES REALES, ocultando el copy y muestreando el PEOR
  píxel (el más claro) detrás de cada elemento** — no razonando sobre el CSS. Las 9
  páginas × 390 y 834: **badge 6,8–18,8 · H1 5,6–7,7 · lede 5,3–6,4 · tics 7,3–12,1**,
  todos por encima del 4,5:1. ⚠️ Las 4 lecturas de "1,00" en la trust band **no son un
  fallo**: ahí el único texto vive dentro de la píldora de Google, que es una card
  BLANCA con su propio texto oscuro — la sonda mide su blanco y asume texto blanco.
- ✅ **GANANCIA GRANDE Y MEDIDA: el hero se acorta ~35–46 %**, porque la foto dejó de
  ser una fila propia:

  | | 390 | 834 |
  |---|---|---|
  | objektschutz | 1329 → **868** | 1279 → **688** |
  | brandwache | 1326 → **868** | 1274 → **688** |
  | revier-schliessdienst | 1396 → **936** | 1331 → **741** |

- **Verificado que NO se tocó nada más**: en escritorio (1024 y 1440) la `<figure>`
  sigue `position: static` con su radio de 16px y su columna (363x543 / 526x644), o sea
  el split de dos columnas está intacto; y **`/ueber-uns/`, que comparte el modificador
  y NO es una página de servicio, queda igual** en 390 y 834 — por eso las reglas llevan
  `:not(.uu-hero)`.
- **Medido en las 9 a 390 / 768 / 834 / 1023**: la foto cubre el hero **exactamente**
  (mismo x/y/ancho/alto que la sección) en las 36 combinaciones, sin scroll horizontal
  y con **cero elementos fuera del viewport**.
- ⚠️ **`object-position: 50% 32%` es una decisión de encuadre que conviene mirar en
  pantalla**: las nueve fotos son verticales (820x~1227) dentro de una caja apaisada, así
  que `cover` recorta arriba y abajo, y el 32 % existe porque el sujeto de las nueve está
  en la mitad superior — a 50 % se cortan cabezas en proporciones de tablet. Si alguna
  foto queda mal encuadrada, es un `object-position` por página, no un cambio de sistema.
- ⚠️ **Trampa de medición, mía: las capturas para medir contraste salían con el copy
  todavía visible.** Ocultarlo con `visibility` y capturar en la misma tanda no alcanza —
  el compositor no repintó todavía. **Hay que esperar un frame (400ms) entre ocultar y
  capturar**, si no se mide el texto en vez del fondo. Y ojo con la heurística inversa:
  una captura de 834x1112 contiene 424px de la sección CLARA de abajo, así que "hay
  mucho blanco" no significa que el copy no se haya ocultado.

**2026-08-19 — EL CONTORNO DEL HERO DE CIUDAD CRECE ~50 % EN TELÉFONO Y ~75 % EN
TABLET** (cliente: "in both tablet and mobile, make the map image bigger"). Un solo
valor en `css/page-city.css`, y con eso las 10 páginas.

- **`max-height: clamp(6.5rem, 16vw, 12rem)` → `clamp(9.5rem, 28vw, 18rem)`.** A/B
  medido sobre `/sicherheitsdienst-wuerzburg/`, viejo → nuevo:

  | | mapa | CTA termina en | fold |
  |---|---|---|---|
  | 390 teléfono | 71x104 → **104x152** (+46 %) | 753 → **801** | 844 |
  | 768 tablet | 84x123 → **147x215** (+75 %) | 642 → **734** | 1024 |
  | 834 tablet | 91x133 → **160x234** (+76 %) | 656 → **756** | 1112 |

- ⚠️⚠️ **EL TECHO NO ES ESTÉTICO, ES EL CTA: cada píxel de mapa empuja el H1 y el
  botón el mismo píxel hacia abajo**, porque el contorno va ARRIBA del copy en una
  columna. **Quedan 43px de fold en teléfono**, y la nota del valor anterior ya
  señalaba los ~150px como el punto donde el H1 sale del alcance cómodo — 152 está
  justo ahí. **No volver a subirlo sin re-medir el CTA a 390.** Se probaron tres
  valores y se descartó `clamp(10rem, 30vw, 20rem)` porque dejaba sólo 35px.
- ⚠️ **DOS COSTOS MEDIDOS Y ACEPTADOS, los dos en la trust band y los dos en anchos
  que ya estaban al límite**: a 600x900 termina en 998 (antes 890 de un fold de 900)
  y a 1023x900 en 1078 (antes 895). Ninguno tenía más de 10px de aire antes, y en
  teléfono esa banda ya caía abajo del fold.
- ✅ **Achicó el salto del breakpoint en vez de agrandarlo**: a 1024 el mapa pasa a
  458px, así que la discontinuidad es **286 → 458** en vez de 164 → 458.
- **Medido en las 10 ciudades a 320 / 390 / 768 / 834 / 1023**: **el ALTO es idéntico
  en las diez** (152 / 215 / 234 / 286) — que es el punto de dimensionar por alto y no
  por ancho — el ancho varía por la forma real de cada ciudad (104px Würzburg a 223px
  Coburg en teléfono), **todos entran en el container y sin scroll horizontal**.
- ⚠️⚠️ **HALLAZGO PRE-EXISTENTE, ENCONTRADO MIDIENDO Y **NO** ARREGLADO (es otro
  defecto y otro pedido): a 320px la COLUMNA DE COPY del hero mide 389px dentro de un
  viewport de 320, y en Coburg eso CORTA 44px del H1.** No lo causa este cambio —
  verificado volviendo al tamaño viejo: los mismos 389px. Y es invisible para las
  sondas de siempre: `.service-hero` es `overflow: hidden`, así que **la página no
  scrollea de costado, CLIPEA**, y `hScroll: 0` da "todo bien". La causa es la que
  este archivo ya documenta cinco veces — `.btn` es `white-space: nowrap` y el
  min-content de "Unverbindliches Angebot einholen" (~325px + padding) fija el ancho
  de la columna. **El arreglo es el mismo de siempre, `white-space: normal` +
  `max-width: 100%` en el bloque de teléfono, y toca las 10 páginas.**

**2026-08-19 — LAS 10 PÁGINAS DE CIUDAD: EL EINSATZFELDER PIERDE SU EYEBROW Y PASA A
HEADER CENTRADO, Y EL REVIEW DE GOOGLE DE BAMBERG QUEDA CENTRADO** (cliente: "centra
el review de google" + "saca el eyebrow de esta sección … y centrá el título y el
texto debajo", después "todas estas secciones de las ciudades").

- **Los 10 eyebrows se BORRARON, no se ocultaron** — "Vor Ort im Einsatz" en nueve y
  "Heimmarkt" en Bamberg. ✅ **Verificado contra los `.docx` antes de tocarlos: NINGUNO
  es copy del cliente.** "Vor Ort im Einsatz" no aparece en ningún draft de ciudad, y
  "Heimmarkt" sólo sale en notas de producción (el título del documento, la nota de
  "Struktur-Variante", el encabezado "7 — Trust (Heimmarkt-Ausbau)") y dentro de una
  frase de prosa que sigue en la página. **Nada de lo que escribió Chris salió.**
  ⚠️ `.section-eyebrow` NO se borró: la sigue usando el callout de Brandwache y otros
  tipos de página. Y si alguna vez vuelve acá **necesita `justify-content: center`**,
  porque es `display: flex` y el centrado del padre no mueve un hijo flex — la misma
  trampa que la plantilla de servicio ya documentó al borrar los suyos.
- **El centrado son DOS selectores que YA EXISTÍAN, no reglas nuevas**: `.city-fields`
  se sumó a `.city-why, .city-services`, que ya centraban su header en este archivo. O
  sea el bloque pasa a la composición que el resto de la página ya usaba, y el comentario
  de esa regla —que decía "sólo dos siguen rangeadas a la izquierda, el Einsatzfelder y
  Kosten"— quedó actualizado. **Kosten es la única que queda, y no se puede centrar:**
  su intro vive en la columna izquierda de una grilla de dos.
- ⚠️ **Los ITEMS se quedan a la izquierda a propósito** (`text-align: start`, medido en
  las 10): header centrado sobre contenido rangeado a la izquierda es el par que esta
  página ya usa en todos lados, y centrar cuatro bloques de prosa a 2 columnas le saca
  al ojo el borde por el que baja leyendo.
- **El lede entró a la lista de `hyphens: none`** — base.css pone `hyphens: auto` en
  todo `<p>`, y una línea centrada ya tiene dos bordes irregulares: un compuesto alemán
  partido al medio ahí se lee como falla de render. Misma decisión que el resto del
  archivo.
  ⚠️ **Sólo 3 de las 10 tienen lede en esta sección** (Würzburg, Bamberg, Erlangen); las
  otras seis van H2 + items directo, así que ahí no hay nada que centrar debajo del
  título. No es un bug de la sonda: está en el propio dato.
- ✅ **BUG REAL EN MI PRIMER INTENTO DE CENTRAR LA CARD, y el síntoma era el opuesto de
  lo buscado: la achicó en vez de moverla.** Puse
  `width: calc((100% - var(--space-6)) / 2)` en el `.testimonial:only-child` — **el
  porcentaje de un grid item resuelve contra su PROPIA ÁREA DE GRILLA, no contra la
  grilla**, así que ese 100% era UNA columna y el calc la volvió a partir al medio:
  **medido 284px contra los 601 que debía tener.** `grid-column: 1 / -1` primero hace
  que el área sea toda la grilla y recién ahí el calc devuelve exactamente el ancho de
  una columna. Medido después a 900 / 1024 / 1100 / 1280 / 1440 / 1920: **card = media
  grilla exacta y desvío 0 en los seis**, o sea la card se MOVIÓ y no cambió de tamaño.
- ⚠️ **`:only-child` en vez de una clase modificadora, a propósito:** la regla sigue al
  CONTENIDO, así que **los dos testimonios de Nürnberg quedan intactos** (verificado:
  601px cada uno, sin desvío) y el día que Bamberg sume una segunda cita se
  des-centra sola, sin markup que nadie tenga que acordarse de cambiar.
- **El generador quedó en sincro**: el eyebrow se sacó de `r_fields` y sus 9 claves
  `"eyebrow"` se borraron del dato en vez de quedar sin leer, así que **re-correr
  `city-pages.py` ya no lo devuelve**. Verificado en dos pasos: el diff generador ↔
  páginas era **exactamente la línea del eyebrow y nada más** en las 9, y después de
  adoptar la salida vuelve a dar 9/9 idénticas. Nürnberg se editó a mano porque es la
  única que no sale del generador.
- **Medido en las 10 a 320 / 390 / 768 / 1024 / 1440**, con un `Range` sobre los NODOS
  DE TEXTO (el rect del elemento miente cuando la caja está capada): **H2 y lede a 0px
  del eje del container en los 5 anchos de las 10 páginas**, cero eyebrows, items a la
  izquierda, y **sin scroll horizontal en ninguna**. Capturas revisadas de Coburg
  (header sin eyebrow) y del bloque de Bamberg con la card centrada.
- ⚠️ **La trampa de medición del Chrome degradado volvió a aparecer y otra vez casi
  reporto un bug inexistente**: una corrida dijo que `.city-trust__quotes` **no existía**
  en Bamberg a 1024 y 900. Medida de a una, la sección está en los cuatro anchos. Es el
  mismo caso ya documentado hoy — **una instancia de Chrome se degrada en una corrida
  larga y devuelve datos de otra página; chequear `location.pathname` NO alcanza.**

**2026-08-19 — `/referenzen/`: EL WIDGET DE GOOGLE SALE DEL HERO Y LA FOTO DEL EQUIPO
CRECE EXACTAMENTE LO QUE ÉL OCUPABA** (cliente: "saca el google rating de la hero,
dejalo nomás más abajo, y por lo tanto como se va el google rating agrandá la imagen
de las tres personas"). Un bloque de markup menos y **un solo número** de CSS.

- ⚠️⚠️ **REVIERTE UNA RESTAURACIÓN DE HACE DOS DÍAS, y las dos mitades están anotadas
  en el código.** El widget volvió al hero el 2026-08-17 porque el Webtext 27 (línea
  12) y el feedback 3.6.1 lo piden ahí; esta instrucción es POSTERIOR y gana, igual
  que G9 ganó sobre las remociones de badge. **El par de CTA se queda** — el pedido
  nombra sólo el rating.
- ⚠️ **NO SE PERDIÓ NINGÚN DATO: la misma `.review-card--sm` sigue renderizando en la
  sección de Kundenstimmen** (agregada el 2026-08-17), que es la mitad "dejalo nomás
  más abajo". **Verificado sobre el markup servido: exactamente 1 widget en toda la
  página**, 1 "4,7", 1 "Bewertungen", cero tokens sin resolver. El `aggregateRating`
  del JSON-LD no se tocó — sigue publicando 4.7/97 una vez.
- ⚠️⚠️ **LAS DOS EDICIONES SON UNA SOLA COSA, y separarlas rompe la página en una
  dirección o en la otra.** `.ref-hero__media` no tiene ancho: tiene un **presupuesto
  de ALTO** (`width: min(100%, 62rem, calc((100svh - Xrem) * 1.648))`), donde X es
  "todo lo que hay en la primera pantalla que NO es la foto". Sacar el widget liberó
  **80px** — 48 de la card más los 32 de su propio `margin-top`
  (`.service-hero__trust`, page-service.css) — así que X baja **35.25 → 30.25rem** y
  esos 80px se los come la foto. Revertir una sin la otra deja el CTA abajo del fold o
  la foto chica sin motivo.
- **Medido A/B con dos builds en paralelo (8177 nuevo / 8178 viejo), no estimado.**
  La foto gana **+132px de ancho en TODOS los anchos de escritorio**:
  554 → **686** a 1440 y 1512 (+24 %), 389 → **521** a 1280 (+34 %), 336 → **468** a
  1024 (+39 %), 850 → **982** a 1920 (+16 %).
  ✅ **La confirmación de que los 5rem son el número exacto: el CTA ahora termina en
  898 / 794 / 752 / 1078 — los MISMOS píxeles donde terminaba el widget antes.** O sea
  el último bloque sobre el fold quedó donde estaba y todo el espacio liberado fue a la
  foto.
- **En teléfono no cambia nada y es correcto**: a 390 la foto mide 350px porque manda
  el `100%` de la columna, no el presupuesto — el cap de alto sólo ata en escritorio.
- ✅ **Ganancia lateral en un caso degenerado: a 320x568 la foto medía 7px de ancho**
  (el presupuesto de 35.25rem = 564px se comía casi los 568 del viewport). Ahora mide
  **138**. ⚠️ A ese tamaño los CTA caen abajo del fold (665/568) — **pre-existente**,
  antes también (585/568), y es inherente a un viewport de 568px de alto.
- **`.ref-hero__trust` se BORRÓ del selector de centrado, no se dejó como regla
  muerta** — una regla que nada puede matchear es una regla que el próximo tiene que
  demostrar que no se usa. Queda anotado que si el widget vuelve al hero necesita ese
  `justify-content: center` o renderiza pegado a la izquierda bajo un título centrado.
- **`js/hero-reveal.js` no necesitó una línea**: arma su cascada con `.filter(Boolean)`,
  así que un `.hero__trust` ausente es un paso menos. **Verificado con motion PRENDIDO**
  (Chrome aparte, sin `--force-prefers-reduced-motion`) empujando el timeline a mano
  (`gsap.globalTimeline.time(8)`): las 5 palabras del H1 en opacidad 1, lede y CTA en
  transform identidad, y **0 elementos del hero por debajo de opacidad 1**.
- **Medido a 320 / 390 / 1024 / 1280 / 1440 / 1512 / 1920**: sin scroll horizontal en
  ninguno. Capturas revisadas a 1440 (hero), 390 (teléfono) y del bloque de
  Kundenstimmen con el rating en su lugar nuevo.
- **Dos comentarios obsoletos corregidos de paso en `page-referenzen.css`**: la
  cabecera de `.ref-hero` (afirmaba el estado del 08-17) y el bloque de teléfono, que
  todavía decía "este hero es foto + dos líneas de texto centrado" — dejó de ser cierto
  cuando volvieron los CTA hace dos días.
- ⚠️⚠️ **TRAMPA DE ENTORNO QUE COSTÓ ~20 MINUTOS Y VA A VOLVER: un `rsync` del repo al
  scratchpad NO TERMINA.** El proyecto vive en el Desktop, que está en iCloud, así que
  rsync se queda copiando `assets/` (y `.git`, que nadie excluye) durante minutos y
  cualquier comando en primer plano se muere en el timeout de 2 min. **Lo que funciona
  es `cp -R` de las carpetas de fuente** (build.js, pages, partials, css, js, content)
  **más un SYMLINK por subcarpeta de `assets/` dentro de `dist/assets/`** — build en
  0,15s.
  ⚠️ Dos detalles: `ln -sfn origen dir` **cuando `dir` YA EXISTE crea el link ADENTRO**
  (`dist/assets/assets`), así que hay que linkear `images`/`icons`/`fonts`/`js`/
  `documents` uno por uno; y **`node build.js` borra `dist/` y se lleva los symlinks
  puestos a mano** — hay que rehacerlos después de cada build (una captura salió con
  todos los PNG rotos por eso).
- ⚠️ **Nota de medición: `Runtime.evaluate` con `returnByValue` sobre
  `gsap.globalTimeline.time(8)` explota con "Object reference chain is too long"** —
  devuelve el timeline. Hay que envolverlo y devolver un escalar.

**2026-08-19 — `/angebot/`: LA SECCIÓN "Was nach dem Absenden passiert" VA CENTRADA
ENTERA** (cliente: "hace esta seccion centrada"). Cuatro reglas en
`css/page-angebot.css`, cero markup. **Ni una palabra de copy cambió.**

- **Centrado el HEADER Y EL CONTENIDO**, no el split header-centrado /
  contenido-a-la-izquierda que usa la mayoría de las secciones del sitio. La razón es
  la misma que ya documentó `.city-proof` de `/sicherheitsdienst-nuernberg/`: son
  **tres items cortos con numeral**, no citas de cuatro líneas ni bloques de
  beneficios que necesiten un borde izquierdo al que el ojo vuelva. Precedente
  directo: los tres pasos de postulación de `/jobs/`, que son este mismo bloque.
- ⚠️ **EL NUMERAL PASÓ DE AL LADO A ARRIBA, y no es cosmético:** con la badge
  pinneada a la izquierda, el texto centrado se lee como un item alineado a la
  izquierda que casualmente está centrado. `flex-direction: column` +
  `align-items: center`.
- **Medida capada a 22rem** — el valor que ya usan los pasos centrados de `/jobs/`.
  Texto centrado quiere una columna más angosta que el mismo copy rangeado: dos
  bordes irregulares hacen más difícil seguir una línea larga. **Debajo del corte de
  3 columnas el cap es inerte** (la columna es más angosta), así que no hizo falta
  meterlo en una media query.
- ⚠️ **`hyphens: none`, y acá se VEÍA:** base.css pone `hyphens: auto` en todo `<p>`
  y esta sección venía renderizando **"mel-det" y "kosten-freies"** — con el texto
  centrado eso duplica la irregularidad y se lee como falla de render. Misma decisión
  que ya toman el copy centrado de `/referenzen/` y el bloque de keyword de
  `/leistungen/`. **Chequeado que no desborda**: la palabra más larga es
  "Sicherheitsexperte" (18 caracteres) y a 320px la columna tiene 280.
- **Medido a 320 / 390 / 600 / 768 / 1024 / 1440 / 1920:** H2, numeral, título y
  párrafo **a 0px del eje de su propia columna en los 7 anchos**, link de cierre a
  **0px del eje del container** (antes caía bajo la primera columna), los tres steps
  con **alto idéntico** en cada ancho, `hyphens: none` aplicado y sin scroll
  horizontal salvo el caso pre-existente de abajo. Capturas revisadas a 1440, 768 y
  390.
- ⚠️ **COSTO MEDIDO Y ESPERABLE: la sección crece.** 742 → **790px a 1440** (+48) y
  1011 → **1107px a 390** (+96) — es el numeral ocupando su propio renglón en vez de
  compartirlo con el título. Si alguna vez molesta, la palanca es el `gap` del step
  (hoy `--space-3`), no el cap de medida.
- ⚠️ **NO tocado, pre-existente y ya anotado en este archivo: `/angebot/` sigue con
  28px de scroll horizontal a 320px** (`.ag-metric__sym`). Es de otra sección y el
  pedido era el centrado.
- ⚠️⚠️ **TRAMPA DE ENTORNO QUE COSTÓ UNA RONDA ENTERA DE MEDICIÓN, y va a volver: el
  `localhost:8123` que estaba mirando el cliente NO sirve `dist/` de este repo.**
  Lo sirve otra sesión desde su propio scratch
  (`/private/tmp/.../<otra-sesión>/scratchpad/build/dist`), o sea un snapshot
  congelado — mi primera pasada midió `flex-direction: row` y `hyphens: auto`
  **después** de haber aplicado el cambio y buildeado, y parecía que el CSS no había
  aplicado. **Se detecta con `lsof -a -p <pid> -d cwd` + `ps -o command=` sobre el
  proceso del puerto**, no leyendo el CSS. Para medir hay que levantar un server
  propio contra el `dist/` propio (usé 8124). **Y el cliente sigue viendo el árbol
  viejo hasta que se rebuildee ese preview o cambie de puerto.**
- ⚠️ **Nota de medición: `getClientRects().length` NO cuenta líneas acá.** El `<p>`
  del step es hijo de un `display: flex`, así que se blockifica y devuelve un rect
  siempre (reportó 1 línea para párrafos de 3). Es la misma trampa ya documentada
  para las etiquetas de los marcos del Ratgeber; para contar líneas hay que leer el
  ALTO o usar un `Range`.

**2026-08-14 — EL RETRATO DE ALEXANDER JÄGER LLEGÓ Y ENTRÓ EN `/werkschutz/`**
(cliente: **`Alex.png`** en el Desktop). Cierra el último 🔴 de la sección
Ansprechpartner, que arrastraba un marco reservado desde el 2026-08-03. Toca
`pages/werkschutz.html` y `css/page-service.css`, o sea el CHASIS — las otras 11
páginas de servicio heredan el tratamiento cuando se construyan.

⚠️ **HUBO DOS ARCHIVOS EL MISMO DÍA Y EL SEGUNDO ES EL QUE VALE.** Primero llegó
`alex.jpg` (2828x4242, fondo gris claro de estudio); después el cliente rehizo la
foto él mismo como **`Alex.png` (1122x1402, ya exactamente 4:5 y ya iluminada
contra negro)**. La versión del cliente es mejor por una razón concreta y medible:
**incluye LAS DOS MANOS**, que en un origen 2:3 era imposible — no existe ninguna
ventana 4:5 lo bastante alta, así que ese recorte tenía que cortar en el cinturón.
Todo lo que sigue describe el estado con `Alex.png`; la historia del archivo gris
quedó en el script de design-sources porque su método sirve para la próxima foto
que llegue sobre fondo claro.

- **El fondo se NORMALIZA a `#010101` exacto, no se recorta con alpha.** El fondo
  medido va de 0 a 6, o sea a lo sumo **5 niveles de 255 (1,96 %)** del color de la
  sección; forzar esos píxeles a exactamente 1 no mueve nada más de 4 niveles y
  **deja el sujeto byte-idéntico** (verificado). Con eso el borde de la foto **ES**
  el color de la página. **Medido muestreando píxeles de dispositivo cruzando la
  costura a 1440 y 390: página 1, foto 1, delta 0,00.**
- ⚠️⚠️ **EL ALPHA SE PROBÓ Y SE DESCARTÓ CON EVIDENCIA, y es la trampa más linda de
  todo esto.** El pedido del cliente fue "sacale el fondo negro así si el negro es
  un poco distinto no se nota", que suena a recorte con transparencia. Pero **el
  pelo oscuro comparte luminancia con un fondo negro**, así que cualquier key se lo
  come — y **compuesto sobre negro eso es INVISIBLE**, porque pelo negro sobre negro
  se lee igual de las dos formas. O sea el mapa de alpha queda roto y la página no
  te lo puede mostrar. **Se detecta componiendo sobre MAGENTA**: el pelo salió lleno
  de agujeros. Conclusión: el alpha no compra robustez, mueve la falla a un lugar
  peor. **Si vuelve a pedirse, mostrar el test de magenta antes de discutir.**
- **Umbrales medidos, para no re-derivarlos:** el fondo alcanzable desde el borde a
  `lum <= 2` es el 56,55 % de la imagen; con `lum <= 4` la filtración al cuerpo
  sigue **abajo del 1 %**, y **a `lum <= 6` salta al 5,3 %** porque la mediana del
  saco es 13,3 y sus pliegues más oscuros llegan a 0. **La conectividad desde el
  borde es lo que protege la silueta, no el umbral.**
- **El fondo plano sobrevive la compresión, verificado en los tres archivos**
  (incluido el JPEG): `min 1, max 1, std 0,00`. O sea cero bandeo.
- **13,6 / 37,2KB WebP y 63,7KB el JPEG** — más liviano que la versión anterior, y
  sin necesidad de un PNG con alpha (que habría costado ~1MB de fallback).

**2026-08-14, MISMO DÍA — LOS DOS RETRATOS QUEDARON IGUALES: 30rem Y FONDO
NORMALIZADO** (cliente: "hacé la imagen un poco más grande de Alex, y la imagen de
Steffen sacale el fondo negro"). Ahora son una sola decisión en dos páginas.

- **Alex: 26rem → 30rem**, o sea **416 → 480px a 1440** (+15 %). La columna de la
  foto mide **493px a 1440**, así que entra con 13px de sobra; de 1280 para abajo
  **manda la COLUMNA y no el cap**, así que ahí no cambió nada (437 a 1280 — subió
  porque el cap ya no la topa —, 392 a 1152, 348 a 1024, 305 a 900). 960w sigue
  cubriendo DPR 2 exacto (480 × 2), así que no hizo falta re-exportar.
  ⚠️ **COSTO MEDIDO Y ACEPTADO:** a 480x600 la foto pasa a ser **lo más alto de la
  sección** — 600px contra 505 del texto al lado. Es exactamente la preocupación que
  la nota de esa regla ya planteaba y la razón por la que el cap arrancó en 26rem.
  **30rem es el techo de ese argumento**; más allá la sección se lee como un póster
  con epígrafe.
- ⚠️⚠️ **STEFFEN TENÍA UN BUG QUE ESTE ARCHIVO AFIRMABA COMO CORRECTO.** La nota del
  2026-08-10 decía que su fondo era "0,0,0 … matching `--color-bg` exactly". **La
  primera mitad era cierta y la conclusión NO**: `--color-bg` es `#010101`, o sea 1,
  así que la foto estaba **un nivel por debajo** de la página que supuestamente
  igualaba — y el degradado inferior de `.uu-lead__photo` rampeaba hacia un color al
  que la foto nunca llegaba. Corregido normalizando su fondo a 1 (medido: venía de
  0 a 4, o sea **3 niveles** de corrección máxima).
  **Lección: "es negro" y "es EL negro de la página" no son lo mismo, y la
  diferencia no se ve — hay que medirla.**
- **`Walde.png` (Desktop) es el origen de ese asset, confirmado y no asumido**:
  re-exportarlo da un diff medio de **0,52** contra el archivo vivo, o sea mismo
  encuadre y sólo ruido de compresión. Es 1122x1402 como `Alex.png` — el cliente
  exportó los dos igual.
- **El script pasó a manejar los DOS retratos** en una corrida
  (`docs/design-sources/portrait-key-backdrop.py`), así que el próximo que llegue es
  una línea en su lista.
- ⚠️ **La "filtración al cuerpo" de Steffen mide 9,4 % y NO es filtración**, que es
  una lectura que casi reporto mal: es **plana de T=1 a T=8** (9,40 → 9,68 %),
  mientras la de Alex sí crecía (0,23 → 5,32 %). O sea mi ventana de muestreo
  incluía fondo real. **Una filtración de verdad CRECE con el umbral; si no crece,
  es fondo.**
- **Medido después en las dos páginas**: `ratio` 1,25 exacto, sin scroll horizontal
  a 320 / 390 / 900 / 1024 / 1152 / 1280 / 1440 / 1600 / 1920, y **la costura a
  delta 0,00** en las dos (página 1, fondo de la foto 1). Los dos assets bajaron de
  peso: Steffen 27,4 → 31,2KB WebP (subió por el q90) y Alex quedó en 37,2KB.

- ✅ **Reservar el 4:5 real pagó exactamente como estaba previsto:** un `<p>` por un
  `<picture>` y **el layout no se movió** — medido, marco 416x520 a 1440 igual que
  antes, ratio 1,25 exacto, `hScroll` 0 en 320 / 390 / 768 / 899 / 900 / 1024 /
  1151 / 1152 / 1280 / 1440 / 1920. Cero CLS.
- **`Alex.png` ya viene 4:5 exacto** (1122/1402 = 0,8003), o sea el cliente lo recortó
  para este marco y **no hubo que recortar nada acá** — `cover` no descarta un píxel.
  Se exporta a 480 y 960 de ancho; el marco mide 416px a 1440, así que 960 cubre DPR 2
  sin escalar hacia arriba (el origen tiene 1122).
- ⚠️ **TODO EL MÉTODO DEL ARCHIVO GRIS QUEDÓ DOCUMENTADO EN EL SCRIPT, no acá.** Ese
  primer intento pedía matting de verdad (`a = (B − C) / (B − F)` con B y F estimados
  por píxel), plegar los huecos del pelo por distancia, y descubrió que **un halo de
  pelo es invisible al tamaño de página y obvio al 1:1**. Nada de eso hace falta con
  `Alex.png`, pero sirve tal cual para la próxima foto que llegue sobre fondo claro:
  está en `docs/design-sources/portrait-key-backdrop.py` como CASO B, con los tres
  umbrales medidos y por qué cada uno.
- ⚠️⚠️ **CONSECUENCIA: estos archivos están soldados a una superficie OSCURA.** Si
  Ansprechpartner alguna vez pasa a `.section--light`, hay que **re-correr el script
  con otro color de destino** — no se arregla con CSS.
- ⚠️ **EL MARCO SE FUE ENTERO, no sólo el padding.** Con el fondo negro no queda nada
  que enmarcar: un radio redondearía negro sobre negro y un borde dibujaría una caja
  alrededor de nada. `padding`, `border`, `border-radius`, `overflow` y el
  `display: grid` + `place-items: center` (que sólo centraban la etiqueta) están todos
  ausentes a propósito — **el `aspect-ratio` es el único trabajo que queda**, y es el
  que reserva el espacio. Mismo tratamiento y misma razón que `.uu-lead__photo`.
- ⚠️ **El placeholder es `--color-bg`**, o sea invisible antes de que cargue la imagen
  lazy. Es el principio de las cards de `/jobs/`: **el placeholder sigue a la IMAGEN**.
- ⚠️⚠️ **BUG PRE-EXISTENTE ARREGLADO DE PASO, y sólo se veía por ser un marco vacío:
  el cap de `9rem` vivía en el bloque `max-width: 1151.98px` mientras el layout de
  dos columnas arranca en 900px** — o sea de 900 a 1151 la foto medía **144px en una
  columna de ~380**, una miniatura al lado de un canal vacío. El cap pasó a un
  `@media (max-width: 899.98px)` propio con `min(48vw, 14rem)`. Medido después:
  **154px a 320, 187 a 390, 224 a 768–899, y 305 / 348 / 391 a 900 / 1024 / 1151**
  (antes 144 en todos). El `9rem` estaba dimensionado para "una caja vacía y
  etiquetada no puede ocupar media pantalla" — ese razonamiento murió con la foto.
- **`.service-contact__portrait-note` se borró entero** (markup + sus dos reglas +
  su entrada en la lista de `hyphens: none`, que existía porque `hyphens: auto`
  partía la etiqueta en "[Portrait Alex-ander Jäger folgt]"). **Verificado que sacar
  un selector del medio de esa lista no rompió la regla**: `.service-contact__body`
  y `.service-contact__certs-list li` siguen computando `hyphens: none`.
- **El `sizes` declara los caps reales medidos** (`(min-width: 900px) 26rem,
  min(48vw, 14rem)`), no una aproximación — a DPR 2 el navegador elige el 960w,
  verificado leyendo `currentSrc`.
- ⚠️ **`/sicherheitskonzept/` NO recibió la foto, y no es un olvido: esa página no
  tiene bloque de contacto.** Nombra a Jäger dentro de una FRASE de prosa, con su
  teléfono y su e-mail enlazados. Meter el retrato ahí es construirle la sección
  entera, que es una decisión de alcance del cliente, no un asset que falte. Los
  archivos ya están si se decide hacerlo.
- **`Alex.png` (y el `alex.jpg` que superseded) se dejaron INTACTOS en el Desktop**,
  fuera de `assets/` — son los originales de trabajo, y `build.js` publica `assets/`
  entero, así que un original ahí se serviría por URL. Y no se borró ninguno: es la
  regla que este archivo ya pagó dos veces con archivos del cliente.

**2026-08-14 — Q3, HEROES DE CIUDAD: EL CONTORNO PASA A AZUL, A 4× DE DETALLE Y SE
TRAZA COMO EL MAPA DE `/einsatzgebiete/`** (cliente: "los hero de ciudad quiero que
sean como el hero de /einsatzgebiete/, o sea mapa con forma azul y no tan rectas las
líneas sino un poco más detalladas… y que se vaya trazando como lo hace el mapa de la
página que te mandé"). Toca **`/sicherheitsdienst-nuernberg/` y
`/brandwache-nuernberg/`, las dos únicas páginas que cargan `page-city.css`** — el
razonamiento completo está en [docs/page-conventions.md §10.3](docs/page-conventions.md).

- ⚠️ **`/einsatzgebiete/` NO SE TOCÓ: su hero ya era esto.** El pedido era llevar
  ESE lenguaje a las páginas de ciudad, y ahí las tres cosas faltaban.
- **"Muy rectas las líneas" tenía una causa concreta y era un presupuesto de puntos.**
  `city-outline.py` simplificaba a `MAX_POINTS = 220` "para que el path pese 2,6KB",
  lo que dejaba tramos rectos de cientos de metros. Ahora el control es
  **`TOLERANCE_UNITS`: el error máximo en unidades del viewBox**, que se traduce
  directo a píxeles (`px = unidades × ancho renderizado / 1000`). A 1.0 el peor
  vértice cae a **0,34px** con el mapa a ~335px — sub-píxel incluso en retina.
  Nürnberg: **200 → 833 puntos, 2,6 → 11KB**. Chequeadas las 14 ciudades: 289–833
  puntos, ninguna pasa el tope, o sea la próxima página de ciudad es un comando.
- ⚠️⚠️ **SE FUE EL NÚMERO MÁGICO: `stroke-dasharray` era `7381`, el perímetro de
  Nürnberg.** Eso volvía la regla secretamente de-una-sola-ciudad (cada una tiene
  otro perímetro: muy bajo deja un hueco que nunca cierra, muy alto gasta el arranque
  en nada) y quedó obsoleta el instante en que cambió el detalle.
  **`pathLength="1"` en el path** renormaliza el perímetro a 1, así que `1` es una
  vuelta exacta para cualquier ciudad a cualquier tamaño — el mismo truco que ya usa
  `.service-contrast__frame`. **Un path pegado sin ese atributo no dibuja nada**, así
  que el generador lo emite. Medido: dashoffset 1 / 0,75 / 0,5 / 0,25 / 0 tinta
  0 / 25,2 / 49,9 / 74,5 / 100 %.
  ⚠️ **`vector-effect: non-scaling-stroke` parece el arreglo prolijo y ROMPE el
  dibujado** — reinterpreta el dash en espacio de pantalla. Testeado, no deducido:
  con eso dashoffset 0 tinta MENOS que 0,5. No intentarlo de nuevo.
- ⚠️ **El `stroke-width` se RE-DERIVÓ, no se copió de `/einsatzgebiete/`, y copiarlo
  habría estado mal.** Está en unidades del viewBox, así que este mapa —capado por
  ALTO a 30rem, o sea ~335px de ancho contra los ~540–708 de aquél— **necesita un
  número MÁS GRANDE para el mismo peso óptico**: 2.5 = 0,84px acá contra 1.6 = 0,88px
  allá; a 1.6 sería un fantasma de 0,54px. Es la misma inversión que documentan los
  tiers de labels de esa página.
  ✅ **Encontrado midiendo: `/brandwache-nuernberg/` necesitaba su propia regla.** Su
  grilla angosta el contorno a **242px en la banda 1024–1151**, así que el mismo 2.5
  medía **0,61px** ahí — la misma línea, un tercio más pálida, en una página y una
  banda. 3.3 unidades lo devuelve a 0,80. El comentario de esa banda decía "el
  contorno es decorativo y no pierde nada": era cierto con un hairline blanco y dejó
  de serlo con una línea dibujada.
- **La curva es `--easing-standard`, NO `--easing-premium`**, y es la lección que ya
  pagó el marco de Vorteile: expo-out traza ~65 % del perímetro en 80ms y después se
  arrastra, y acá el RECORRIDO es el efecto. 1,6s + 350ms de delay son los valores del
  hero de `/einsatzgebiete/`. Medido con frames reales: **0 % → 18,9 % → 49,7 % a
  mitad de duración → 100 %**, simétrico, y el relleno entra en la cola del trazado.
- **El relleno queda en 0,16, elegido comparando renders** a 0,06 / 0,10 / 0,16 / 0,24:
  0,06 es invisible y 0,24 empieza a competir con el copy. ⚠️ **No es el 0,55 de las
  city shapes de `/einsatzgebiete/`** — ésas son polígonos chicos sobre un mapa grande;
  acá la forma llena un hero, y un blob de 335×480 al 0,55 es exactamente lo que el
  cliente rechazó en esa página ("que en ningún momento se fill todo de celeste").
- ⚠️ **Sigue SIN pin y SIN label, a propósito**, aunque el mapa de einsatzgebiete los
  tenga: un pin único se lee como sucursal, que es justo lo que la regla UWG de este
  tipo de página prohíbe.
- ✅ **Cerrado un footgun por página: las guías punteadas van en PORCENTAJES.** Eran
  `x1="500" … y2="1432"`, la mitad y el total del viewBox **de Nürnberg**, y el alto
  cambia por ciudad (medido: 683 en Coburg, 1494 en Kulmbach) — un contorno pegado
  habría dibujado sus guías fuera de la forma **sin que nada falle en voz alta**.
  `50%` / `100%` resuelven contra el viewport; verificado en dos proporciones.
- **Medido en las dos páginas a 1024 / 1152 / 1280 / 1440 / 1920:** trazo
  **0,78–0,84px** en todas (era 0,61 en el peor punto), guías resolviendo correcto en
  las 10 combinaciones, el mapa tintando 42k–80k px, **sin scroll horizontal**. A
  320 / 390 / 600 / 768 / 900 / 1023 con iframe de ancho fijo: sin scroll horizontal,
  el mapa en `display: none` como antes, un solo `<h1>`, y lo único fuera de pantalla
  es el honeypot en `left:-9999`. Con `prefers-reduced-motion` el estado de reposo es
  el mapa COMPLETO (`dasharray: none`, fill 0,16, cero animaciones).
- ⚠️⚠️ **TRAMPA DE MEDICIÓN NUEVA, y me hizo perseguir un bug que no existía:
  `Page.captureScreenshot` con `clip` + `captureBeyondViewport: true` devolvió un
  frame COMPLETAMENTE NEGRO** de una zona que sí estaba pintada. Reporté "el mapa no
  renderiza" con el DOM diciendo lo contrario (dashoffset 0, fill 0,16, caja 335×480).
  Probado lado a lado sobre la misma página: viewport plano **173.809px** de tinta,
  clip sin `captureBeyondViewport` **80.313**, clip CON él **0**. Este archivo ya
  documentaba que el `clip` va en coordenadas de PÁGINA; agregar `captureBeyondViewport`
  encima lo rompe. **Capturar el viewport y recortar después.**

**2026-08-14 — FEEDBACK 3.4 `/sicherheitskonzept/`, PUNTO 1 ("Hero is missing"): NO
SE CONSTRUYÓ NADA, YA ESTABA. El cliente estaba viendo un preview viejo** — su
captura es exactamente el estado PRE-Q3/Q4 de esta misma fecha (tres líneas de tics
sin icono, sin widget de Google, sin sellos, sin maqueta, y el CTA con la etiqueta
anterior a G3). **Verificado midiendo el DOM renderizado a 1440, no leyendo este
archivo**: badge 463x24, H1, subline, los dos CTA en 48px, los **3 tics con su check
azul de 18px a 6,76:1** (`fill: none; stroke: currentColor`, o sea el bug de los
checks negros invisibles está arreglado), la píldora de Google con 4,7 / 97, los 2
sellos DEKRA cargados y la maqueta del documento (SVG de 40 formas, 352x456) —
`hScroll` 0. Captura guardada en el scratchpad de la sesión.
⚠️ **Si vuelve a reportarse, pedirle un refresh del deploy antes de tocar código.**
⚠️ **Lo único que difiere de su documento es la ETIQUETA del CTA** — el doc pide
"Kostenfreies Sicherheitskonzept anfordern" y la página dice "Unverbindliches Angebot
einholen": eso lo fijó **G3** (una etiqueta que promete un concepto no puede apuntar a
un formulario, y mandarla a esta misma página sería un enlace a sí misma), decidido
por el propio cliente. No "corregirlo" hacia el doc.

**2026-08-14 — FEEDBACK 3.6 `/referenzen/`, PUNTOS 2 y 3.** Dos ediciones de
markup en `pages/referenzen.html`, ni una línea de CSS.

- **Punto 2 — la fila de links del cierre queda con DOS hubs**: "Alle Leistungen im
  Überblick" (`/leistungen/`) y **"Alle Einsatzgebiete im Überblick"**
  (`/einsatzgebiete/`). Se fueron los dos links de ciudad
  (`/sicherheitsdienst-bamberg/`, `/sicherheitsdienst-coburg/`) que estaban ahí
  porque el roster es mayormente Bamberg y Coburg.
  - ✅ **Ganancia lateral: cerró dos 404 planificados.** Ninguna de las dos páginas
    de ciudad está construida (Bloque 5) y los dos hubs sí, así que la fila ahora
    resuelve **completa** — verificado sirviendo el build: `/leistungen/` 200 y
    `/einsatzgebiete/` 200.
  - ⚠️ **Bamberg y Coburg siguen enlazados desde el nav y el footer**, que son
    chrome compartido de las 21 páginas. El pedido es sobre las tejas del cierre de
    ESTA página; no se tocó el chrome.
- **Punto 3 — las dos membresías van enlazadas**, sin cambiar una palabra de la
  frase ("Mitglied im Wirtschaftsclub Bamberg und im Deutschen Mittelstands-Bund.").
  - ⚠️⚠️ **EL DOCUMENTO DE FEEDBACK DICE "same URLs as 3.5.4" Y ESAS URLS NO ESTÁN
    EN EL REPO** — no hay ningún archivo de feedback acá, y `/ueber-uns/` (que es
    donde vive la otra copia de esta frase) todavía la tiene sin enlazar, o sea 3.5.4
    tampoco está aplicado. **Así que las dos URLs se verificaron contra los sitios
    vivos antes de publicarlas, no se dedujeron del nombre**:
    `wirtschaftsclub-bamberg.de` devuelve "Wirtschaftsclub Bamberg e.V." y
    `www.mittelstandsbund.de` devuelve "Deutscher Mittelstands-Bund (DMB) e.V.".
    Vale que Chris las confirme igual contra las de 3.5.4.
  - ⚠️ **`dmb.de` es OTRA organización** (el Mieterbund — chequeado, redirige a
    `mieterbund.de`). No "acortar" la segunda URL a eso.
  - **La primera va SIN `www.`** porque su host `www` hace 301 al dominio pelado;
    enlazar el destino ahorra un salto.
  - `target="_blank" rel="noopener"` + un `.visually-hidden` "(öffnet in einem neuen
    Tab)" por link, que es el patrón que este sitio ya usa para un link externo
    dentro de prosa (`/kontakt/`, "Route in Google Maps öffnen").
  - **Contraste medido, no deducido**: la sección es oscura, así que el
    `--color-link` (blue-light) mide **6,72:1 sobre `rgb(1,1,1)`** y va subrayado —
    ninguno de los dos arreglos de §7 hacía falta acá (esos existen para blue-light
    sobre superficie CLARA, donde da 3,11:1).
  - **Áreas táctiles**: son links inline dentro de una frase (16–17px de alto), que
    es la excepción explícita de WCAG 2.5.8 para targets limitados por el
    line-height — el mismo criterio ya documentado para los 8 links de FAQ de la
    página de ciudad. No se les puso padding.
- **Medido a 390 / 600 / 768 / 1440**: sin scroll horizontal en ninguno, la fila de
  links centrada al eje (0px de desvío) y en **una sola fila hasta 600**, dos a 390
  con **51px de alto** cada link (≥44), el párrafo en 1 línea hasta 600 y 2 a 390, y
  **cada link entero en una sola línea** (`getClientRects()` = 1) en los cuatro
  anchos, o sea ninguno se parte al medio.
  ⚠️ **Nota de medición, mía:** el `<pre>` que inyecté para volcar los resultados
  reportó **1.575px de scroll horizontal inexistente** — un `<pre>` no envuelve, así
  que mis propias líneas largas ensancharon el documento. Re-medido sobre la página
  sin inyectar nada: `scrollWidth` = 390 exacto, y lo único fuera de pantalla es el
  honeypot del formulario en `left: -9999`. **No medir overflow en una página donde
  metiste un `<pre>`.**
- ⚠️ **Punto 1 (el hero) NO se tocó, es una pregunta y no una corrección**: el
  **badge YA ESTÁ** (lo puso la pasada de G9 el mismo día, verbatim del Webtext 27);
  lo que sigue faltando contra el documento es el par de CTA y el widget de Google.
- ⚠️ **PENDIENTE, es una línea: `/ueber-uns/` publica la MISMA frase de membresías
  sin enlazar** (`.trust-certs__memberships`, línea 394). Hoy el sitio la tiene
  enlazada en un lado y pelada en el otro. No se aplicó porque el pedido decía
  "referenzen"; es copiar el mismo `<p>`.

**2026-08-14 — LAS DOS MEMBRESÍAS AHORA SON LINKS TAMBIÉN EN `/ueber-uns/`**
(feedback, punto 4). `/referenzen/` ya los tenía de una pasada anterior del mismo día;
esta cierra la otra página que publica la frase. **`/sicherheitsdienst-nuernberg/` NO
entra**: reusa la misma clase (`.trust-certs__memberships`) para otra frase, con un
`.service-link` a `/referenzen/`.

- **URLs re-verificadas antes de publicarlas en una segunda página**, no copiadas a
  ciegas: las dos dan **HTTP 200** y los `<title>` son "Wirtschaftsclub Bamberg e.V." y
  "Deutscher Mittelstands-Bund (DMB) e.V.". Dominio pelado para el Wirtschaftsclub (su
  host `www` hace 301 al pelado) y `www.` para el DMB. ⚠️ **`dmb.de` es OTRA
  organización** (el Mieterbund) — nunca "acortar" el segundo link a eso.
- ⚠️ **UN LINK NUEVO ACÁ NO ERA GRATIS, y es la trampa de siempre:** `.section--light`
  re-declara `--color-accent` pero **NO `--color-link`** (verificado, 0 ocurrencias),
  así que sobre blanco el link heredaba blue-light = **3,11:1** con texto de 15px.
  Regla nueva en `page-service.css` con la mezcla profunda documentada = **4,90:1**.
  **Scopeada a `.section--light` a propósito**: en `/referenzen/` la misma frase vive
  sobre la sección OSCURA `.ref-clients`, donde blue-light ya mide 6,72:1 y está bien
  — esa página queda intacta. Y lleva `:not(.service-link)` para no pisar dos veces el
  link de la página de Nürnberg.
- Cada link declara en texto sólo-para-lectores que abre pestaña nueva, con
  `target="_blank" rel="noopener"` — valores copiados de `/referenzen/` para que las
  dos páginas sean una decisión y no dos parecidas. **Ni una palabra de la frase
  cambió**, y esta página conserva su falta de punto final.
- ⚠️ **Nota de medición, mía otra vez:** mi sonda de contraste reportó **20,95:1** para
  esos links. Es el falso positivo que este archivo ya documenta — `color-mix()`
  computa como `color(srgb 0.27 0.45 0.67)` y un parser que lee esos decimales como
  0–255 ve un casi-negro. **Calcular a mano cuando el color computado no es `rgb()`.**

**2026-08-14 — EL SUBMIT DEL FORMULARIO SE SALÍA DE SU PROPIA CARD** (feedback,
tablet punto 2: "make sure the hero CTA stays visible/inside the layout", con captura
de `/angebot/`). **Un arreglo de dos declaraciones en `css/lead-form.css`, o sea en las
12 páginas que usan el formulario compartido.**

- ⚠️ **CUARTA VEZ que la misma omisión causa el mismo bug en este repo**, y esta vez
  del lado del submit: `.btn` es `white-space: nowrap`, así que con
  `justify-self: start` el min-content del botón **es toda su etiqueta** — no puede
  achicarse, y en una columna angosta simplemente se sale.
- **La banda rota es 900–1090px, medida**: `.ag-hero__grid` parte en dos columnas
  desde 900px y ahí el interior de la card queda en **287px contra los 361px del
  botón**, o sea **75px afuera de la card blanca** (+50 a 960, +33 a 1000, +23 a
  1024, y recién entra solo desde ~1100). **Por debajo de 900 nunca se vio** porque
  la grilla es de una columna y la card mide 620px — por eso el bug sobrevivió.
- **El arreglo es `white-space: normal` + `max-width: 100%`**: con la etiqueta
  envolviendo, el min-content pasa a ser la palabra más larga, así que `fit-content`
  resuelve al espacio realmente disponible. Medido después: **285px a 900, 310 a 960,
  337 a 1024 — todos dentro** — y **361px de 1100 en adelante, o sea sin ningún cambio
  donde hay lugar** (verificado a 1280 y 1440 en las 6 páginas con formulario).
- ✅ **ARREGLÓ DE PASO UN BUG EN TELÉFONO QUE NADIE HABÍA VISTO, y está probado, no
  deducido**: a 390px el bloque de teléfono da `width: 100%`, pero con `nowrap` la
  etiqueta **desbordaba el propio botón**. Medido en el homepage inyectando el valor
  viejo: caja **308x48 con 331px de contenido, +23px afuera**; con `normal`, caja
  **308x60 y contenido 304, sin desborde**. Pasa en 4 páginas (homepage,
  `/werkschutz/`, `/referenzen/`, `/sicherheitskonzept/`), que ahora muestran el
  submit en dos líneas dentro de la píldora. **Los 60px de alto NO son una regresión,
  son el arreglo.**
- ⚠️ **VISTO MIDIENDO Y NO TOCADO, es del cliente decidirlo:** en `/angebot/`, entre
  900 y 1100px el H1 rompe en **5 líneas** ("Ihr / unverbindliches / Angebot, in /
  einem Werktag / auf dem Tisch"). Subir el corte de dos columnas de 900 a ~1100
  arreglaría eso **y** el botón de una sola vez (apilado, la card mide 620 y el H1 dos
  líneas), **pero rompe un requisito aprobado**: el split existe a 900 para que pitch
  y formulario entren en la primera pantalla — el "kein Scrollen nötig" del draft,
  anotado en `page-angebot.css`. Por eso se arregló el BOTÓN y no el breakpoint.

**2026-08-14 — FEEDBACK, PUNTOS 2, 3 y 14 (y una regresión propia del mismo día).**

- **Punto 2 — `/einsatzgebiete/`, el párrafo "Ihr Standort ist nicht dabei?"**: la lista
  pasa a **"auch Hof, Kulmbach, Lichtenfels, Kronach, Kitzingen, Haßfurt, Schwabach oder
  Schwandorf"** — entra Schwandorf y el orden es el del cliente (Kronach sube al cuarto
  lugar), no el que tenía la página.
- **Punto 3 — la FAQ "Gibt es Leistungen, die nicht überall verfügbar sind?"** ahora dice
  que el **Interventionsdienst** también es sólo Raum Bamberg, junto al Revier- und
  Schließdienst (y por eso "läuft" pasa a **"laufen"**). ⚠️ Editada en **las dos copias**
  —visible y `FAQPage`— con un reemplazo que **aborta si no encuentra exactamente 2**
  apariciones; verificado después sobre el build: **3/3 byte-idénticas**.
  ✅ **Chequeado que la afirmación nueva no contradiga nada**: Interventionsdienst sólo
  aparece en listados de servicios (nav, footer, `/leistungen/`, homepage, tabla de
  precios del Ratgeber) y en **ninguna** página de ciudad, así que no había ninguna
  promesa de cobertura que ahora quede falsa.
- **Punto 14 — los aspectos ya no se repiten dentro del dibujo de 3 pasos.** Debajo de
  1024px `js/konzept-seq.js` construía chips con **punto + línea + TEXTO** sobre el cubo,
  y ese texto era el mismo de la `<ul>` de abajo. Ahora el chip es **sólo punto + línea**
  (lo que el cliente pidió animar) y las palabras viven una sola vez, en la lista. El
  gris→blanco se conserva: lo maneja el mismo índice, que marca `is-active` en el chip y
  en el `<li>` a la vez. `.kz-mtip__body/__name/__sub` se **borraron** (markup y CSS).
  ⚠️ La línea pasó de 14 a **28px**: sin caja al final, la línea ES la llamada, y a 14px
  se leía como un pelito pegado al punto. **En escritorio no se tocó nada** — ahí la
  lista está en `display: none` y no había duplicación.
- ⚠️⚠️ **REGRESIÓN PROPIA, encontrada midiendo el DOM renderizado: 12 chips donde iban
  13.** La causa es la pasada de copy de más arriba: al partir "Brandmeldeanlage (BMA)"
  en dos `<text class="kz-tip__label">`, el emparejamiento chip↔lista —que es **por
  texto**— se rompió, porque leía el label con `querySelector` y obtenía sólo
  "Brandmeldeanlage". Ese tip perdía su chip **en silencio** (el propio código dice que
  un término sin tip "se saltea en vez de emparejar mal"). Arreglado uniendo TODAS las
  líneas del label con un espacio. **Lección: en esta sección el label vive dos veces Y
  ADEMÁS se usa como clave de emparejamiento — cambiar cómo se parte un label es
  cambiar una clave.**
- **Verificado sobre el DOM ya construido** (768px homepage, 390px einsatzgebiete): 13
  chips, **0 con texto**, 13 con punto+línea, las 3 listas con `is-synced`, y los dos
  textos nuevos presentes.
  ⚠️ **Nota de entorno, costó tiempo:** ese día Chrome **hacía el trabajo pero no
  cerraba** (escribía el DOM completo y el proceso quedaba vivo), así que cualquier
  `chrome … | sed` devolvía VACÍO y parecía que Chrome no arrancaba. El workaround es
  volcar a un ARCHIVO, esperar, y matar el proceso. Y `timeout` **no existe en macOS**
  (es `gtimeout`), así que dos corridas "fallidas" en realidad nunca ejecutaron Chrome.

**2026-08-14 — COPY NUEVO EN EL GRÁFICO DE 3 PASOS DEL HOMEPAGE** (feedback del
cliente, punto 11: "content fix — only the label was updated so far"). Es la sección
`.konzept-seq`, y **sólo existe en el homepage** — `/werkschutz/` tiene su propio
bloque compacto `.service-konzept*` con otro copy, no se toca. Nada de layout cambió;
lo único estructural es la línea del label más largo (abajo).

- **Paso 1 cambió título Y descripción**: "Rundgang vor Ort" → **"Ortsbegehung"**,
  y "Wir verstehen Ihr Objekt und Ihre Abläufe." → **"Wir erfassen Objekt, Umfeld und
  Abläufe vor Ort."** Pasos 2 y 3 conservan su título ("Risikoanalyse",
  "Sicherheitskonzept") y cambian sólo la descripción.
- ⚠️ **INTERPRETACIÓN A CONFIRMAR CON CHRIS:** para el paso 3 el cliente escribió una
  sola frase, "Maßnahmenkonzept aus Personal, Technik und Organisation.", sin decir si
  es título o descripción. Se aplicó como **descripción**: los tres títulos son
  sustantivos de una palabra (Ortsbegehung · Risikoanalyse · Sicherheitskonzept) y esa
  frase son 56 caracteres con punto final. Si era el título, es mover una línea.
- ⚠️ **LOS 7 CHIPS VIVEN DOS VECES, y hay que editar LAS DOS** — misma clase de trampa
  que el texto del FAQ: los `<text class="kz-tip__label">` del SVG (lo que se ve de
  1024px arriba) y la `<ul class="konzept-seq__terms">` (lo que se ve por debajo, y lo
  que crawlea Google, porque el SVG entero es `aria-hidden`). Renombrados: Kameras →
  **Videoüberwachung / Lückenlose Abdeckung**, Außenpatrouille → **Streifendienst /
  Optimierte Routen**, **Zutrittskontrolle / Pforte & Schrankenanlage**, **Alarmanlage
  / Einbruch- & Überfallmeldung**, Brandmelder → **Brandmeldeanlage (BMA)**;
  Wachpersonal y Sensoren quedan igual.
- ⚠️ **CADA RENAME SE QUEDÓ EN SU PROPIA ANCLA DEL DIBUJO, no se reordenaron los tips.**
  Cada uno es una leader line que apunta a un objeto concreto del isométrico (la cámara,
  la ruta, la barrera), así que el orden del SVG lo fija el dibujo, no el copy. **La
  lista HTML sí** toma el orden del cliente (Personal primero, después Technik), que es
  justo lo que nombra la descripción nueva del paso — y ahí es gratis porque es una
  lista, no un diagrama.
- ⚠️⚠️ **"Brandmeldeanlage (BMA)" EN UNA LÍNEA SE SALÍA DE LA PANTALLA, medido:** el tip
  arranca en el borde derecho del cubo (viewBox x=1050) y hacia afuera, así que a una
  línea medía 230px a 1440 y quedaba **42px PASADO el viewport** (25 a 1024, 34 a 1280;
  1920 era el único ancho donde entraba) — o sea cortado, porque ahí nada scrollea
  horizontal. Partido en dos líneas de label, la línea más ancha pasa a
  "Brandmeldeanlage": **170px a 1440 con 18px de margen, 118px a 1024 con 16px.** Es el
  mismo stack multilínea que los otros tips ya usan para sus subs y **no cambia una
  palabra**. Los offsets 39/80 lo dejan dentro del 0..1110 del SVG (termina en 918) y a
  132 unidades de Wachpersonal — el aire que fijó la pasada del 2026-08-04.
- **Medido a 1024 / 1152 / 1280 / 1366 / 1440 / 1600 / 1920 en modo enhanced real** (sin
  forzar reduced motion, si no el layout de dos columnas ni existe): **cero labels
  pasados del viewport, cero fuera de pantalla, sin scroll horizontal**. Los tres labels
  nuevos del lado izquierdo miden 174 / 171 / 154px contra los 171 del "Kritischer
  Bereich" que ya estaba, o sea entran en el sobre que la sección ya tenía. En mobile
  (320 → 900) los 7 chips sin desbordar, en 3 filas.
- ⚠️ **Encontrado midiendo y NO arreglado (es otra decisión, pre-existente):** en
  **escritorio con `prefers-reduced-motion`** la sección cae al layout apilado — ahí el
  SVG vuelve a `overflow: hidden` y recorta sus propios labels a dos o tres letras
  ("...ereich", "Kontrol..."), pero la `<ul>` de reemplazo está en `display: none`
  porque esa regla es sólo por ANCHO (`min-width: 1024px`), no por modo. O sea ese
  visitante no ve las anotaciones por ningún lado. El arreglo es condicionar esas dos
  reglas a `--enhanced` en vez de al ancho; no se tocó porque el pedido era el copy.

**2026-08-14 — FEEDBACK CONSOLIDADO DEL CLIENTE (review del 2026-08-13), SECCIÓN 1:
LAS RESPUESTAS A LAS PREGUNTAS ABIERTAS (Q1–Q8).** Es el documento que reemplaza
todos los change-requests anteriores. Acá va sólo lo aplicado en esta pasada; el
feedback página por página viene en secciones siguientes.

- **Q8 — NO HAY VERSIÓN EN INGLÉS. La página se BORRÓ, no se ocultó** ("take the
  outdated English homepage down before anything gets indexed"). Se fueron
  `pages/en/index.html`, `partials/header-en.html` y **los dos partials ingleses
  `header.html` y `footer.html`** (los cuatro estaban trackeados; git los tiene).
  - **Borrar el archivo es la mitad del trabajo.** También salieron el
    `hreflang="en"` del homepage, **la entrada `/en/` del sitemap** (un sitemap que
    sigue anunciando una URL borrada es exactamente cómo se indexa igual) y se
    agregó un **301 `/en/*` → `/` en `vercel.json`**, que es la forma correcta de
    "bajar" una página que pudo haberse enlazado.
  - ✅ **Ganancia lateral, un bug real de SEO que estaba en vivo:** `/kontakt/`
    publicaba `hreflang="en"` apuntando a **`/en/kontakt/`, una página que nunca
    existió** — un hreflang a un 404, en vivo desde julio.
  - **La urgencia era menor de lo que parecía y conviene saberlo:** `vercel.json`
    ya manda `X-Robots-Tag: noindex, nofollow` en `*.vercel.app`, así que el
    preview nunca fue indexable. El borrado igual corresponde.
  - **El `hreflang="de"` + `x-default` autorreferenciales se QUEDAN** en las 21
    páginas: son válidos en un sitio monolingüe y sólo declaran el idioma. Sacarlos
    sería churn en 21 archivos sin ganancia.
  - ✅ **Se cerró de paso el riesgo "dos footers" que este archivo documentaba**:
    ya no hay dos partials que mantener en sincro, hay uno.

- **Q1 — `/impressum/` y `/datenschutz/` CONSTRUIDAS. Eran los dos 404 más
  enlazados del sitio** (footer de las 21 páginas), y `/datenschutz/` además es
  **el único enlace roto con consecuencia legal**: el checkbox de consentimiento
  del formulario compartido pide confirmar que se leyó un documento que no abría.
  - **El Impressum se trajo de la página VIVA, no del paste**, porque el paste
    había aplanado la jerarquía de headings. ⚠️ **Única desviación, y es
    estructural: la página viva salta h1 → h3 → h4.** Acá es h1 → h2 → h3 — "1:1"
    es una instrucción sobre el TEXTO, no una licencia para reproducir un defecto
    de accesibilidad que las reglas propias de este archivo prohíben.
  - ⚠️ **DOS COSAS PARA EL ABOGADO, publicadas verbatim y NO corregidas:** el
    enlace ODR es `http://` y **la plataforma ODR de la UE se dio de baja en
    2025**, así que la frase entera puede estar obsoleta; y "finden **sie**" va en
    minúscula donde corresponde el "Sie" formal. Son texto legal del cliente.
  - **`/datenschutz/` es una SHELL y no inventa una sola línea de texto legal.**
    Publica sólo el Verantwortlicher (verificable desde el Impressum) y un aviso
    interino. ⚠️ **Cuando llegue el scanner automático, el CSP lo va a bloquear**:
    `script-src 'self'` sin terceros, así que un scanner servido como `<script>`
    externo se bloquea en silencio y la página queda vacía — hay que agregar su
    host. Y hay que **sacar el `noindex`**, que está puesto a propósito mientras el
    texto sea placeholder (por eso tampoco está en el sitemap).
  - ⚠️ **`css/page-legal.css` es la TERCERA copia de la columna de prosa de 44rem
    con el H2 escalonado** (`.cs-article`, `.rg-article`, y ahora `.legal-doc`), o
    sea que la promoción a una clase compartida **ya está vencida** por la regla
    propia del proyecto. NO se hizo en esta pasada a propósito: implica editar seis
    páginas vivas y ya revisadas por el cliente en plena ronda de feedback. Los
    valores se copiaron literales para que las ocho páginas sigan siendo un diseño
    y no tres parecidos; la migración está escrita en la cabecera de ese archivo.
  - ⚠️ **NO es una quinta excepción a §2.** §2 habla del título de SECCIÓN de una
    página compuesta; el heading de capítulo de un documento es otra cosa, y el
    código ya traza esa línea dos veces. Lo que corresponde es que §2 nombre la
    distinción, no que se sume una excepción más.
  - ⚠️ **BUG DE 50px A 320px, y es una trampa que este repo ya pagó una vez:
    `hyphens: none` SUPRIME TAMBIÉN LOS SOFT HYPHENS.** El `&shy;` del cliente
    dentro de "Bewachungsunternehmen&shy;identifikationsnummer" (42 caracteres)
    quedó completamente inerte y esa palabra fijaba un min-content de 350px en una
    columna de 280. **`hyphens: manual`** es el valor que significa lo que se
    quería: honrar el `&shy;` del autor y no adivinar nada más.
  - **Las dos páginas NO cargan `text-reveal.js` ni `title-reveal.js`, y es una
    decisión medida:** con ellos, **95 elementos de texto** quedaban en
    `opacity: 0` esperando el scroll. Correcto en una página de marketing y
    equivocado en un documento de referencia — a un Impressum se llega a buscar un
    dato con Ctrl+F o a imprimirlo, y ninguna de las dos cosas encuentra texto
    oculto. No cargarlos es mejor que cargarlos y optar por salir: lo que no
    esconde nada no puede quedarse escondido.

- **Q7 — Brose Bamberg y Bodo Freimuth Tiefbau VUELVEN a `/referenzen/`.** Cierra
  la duda que este archivo dejó abierta el 2026-08-05 (el draft del 04.08 los
  seguía listando después de que se quitaran): era una pregunta de Freigabe y la
  respuesta es que se quedan. Cada uno en **la posición del draft**, no apendeados:
  Freimuth tercero en Baustellenbewachung, Brose primero en Veranstaltungsschutz.
  - ⚠️ **Los dos van como NOMBRE, no como logo, porque no existe archivo de logo
    para ninguno** — buscado en todo el repo, no sólo en `client-logos/`. Eso ES
    "as before": el set de logos nunca los tuvo. Dos `<span>` → dos `<img>` el día
    que llegue el arte; vale pedírselo a Chris.
  - ⚠️⚠️ **AGREGAR UN ITEM A UN MARQUEE LE CAMBIA LA VELOCIDAD, y hay que
    re-derivar la duración.** Una duración no es una velocidad: sumar una empresa a
    un grupo de 4 alarga el track un 25 % con la duración fija, así que la fila se
    acelera un 25 %. Medido: Baustellenbewachung saltó a **14,52 px/s** (escritorio)
    y **15,23** (teléfono) contra los ~11,5 de sus hermanas — una fila visiblemente
    corriendo más que las otras dos. Corregido desde el half-track medido, no
    estimado: **180 → 227s** y **115 → 152s**. Re-medido: **11,51 y 11,52 px/s**.
    Veranstaltungsschutz ganó a Brose y **no necesitó cambio** — 10 items contra 9
    la movió de 10,4 a 11,5, o sea hacia el objetivo y no lejos de él.
  - **Verificado**: 35 empresas (30 logos + 5 nombres), grupos pares en las tres
    filas y slack positivo en todas, o sea los tres loops siguen sin costura.
  - ⚠️ **El draft tiene 35 empresas, no 36** — el número viejo de este archivo
    estaba mal; contado sobre el docx (20 + 5 + 10).

- **Q3 + Q4 — `/sicherheitskonzept/`: hero de dos columnas con maqueta del
  documento, y el PDF de muestra PUBLICADO.**
  - **El hero pasó a ser el estándar del homepage** (badge, H1, subline, doble CTA,
    tics, **widget de Google** + los dos sellos DEKRA) **más una maqueta dibujada
    del documento** como visual, en vez de foto. Eso **supersede el pedido del
    draft de una "Begehungs-Situation (Echtfoto)"** — no hay que seguir buscando esa
    foto.
  - **La maqueta es SVG inline en `partials/sk-doc.html`, un partial y no dos
    copias**, porque se usa dos veces (hero y preview de la sección 6b) y tiene que
    ser el mismo dibujo. Dibujada y no una captura del PDF: nítida a cualquier DPR,
    **cero requests en el critical path** (esta página no tiene elemento LCP de
    imagen) y sus colores salen de custom properties, así que la misma pieza
    funciona sobre el hero negro y sobre la sección blanca.
    **El contenido es el del documento real**, no inventado: el chip "ANONYMISIERTE
    MUSTERVERSION", "Muster GmbH · Werksgelände" y "Seite 1 von 18".
    ⚠️ **SIN COLORES DE SEMÁFORO**: la página 7 real gradúa 16 riesgos en
    Grün/Gelb/Rot (5/7/4), y reproducirlo literal metería tres tonos nuevos en una
    paleta de cinco por un gráfico decorativo. La matriz va en **cuatro tintes del
    celeste de marca**.
  - ⚠️⚠️ **UN COMENTARIO HTML NO PUEDE CONTENER `-->`, y me costó dos pasadas.**
    Escribí el marcador de include completo dentro del comentario del partial: eso
    **cerró el comentario antes de tiempo y volcó el resto como texto visible en la
    página**, al lado de la card. Lo peor es que la frase que explicaba el bug
    volvió a contener la secuencia y lo reprodujo. Se detecta en captura, no en el
    build — `build.js` no tiene por qué quejarse. **Referirse al marcador por
    nombre, nunca escribirlo con sus delimitadores.**
  - ⚠️ **LA ANONIMIZACIÓN DEL PDF SE VERIFICÓ ANTES DE PUBLICAR, no se dio por
    buena** — el archivo va a una URL pública. Se extrajo el texto de las 18 páginas
    (sin librerías: streams FlateDecode + los CMaps ToUnicode) y se buscó cada
    nombre de cliente real que el sitio conoce: **cero coincidencias**. Queda dato
    ficticio en todo el documento ("Muster GmbH", "Max Mustermann",
    "KD-MUSTER-000001", teléfono "0000 – 000000") bajo una portada que lo declara.
    Los únicos datos reales son los de FRANKONIA, que es la autora. **Re-correr ese
    chequeo con cualquier archivo de reemplazo.**
  - **El archivo se movió a `assets/documents/frankonia-sicherheitskonzept-muster.pdf`**
    (venía como `SecurityConcept.PDF`, con la extensión en mayúscula). ⚠️ Se copió,
    se comparó **SHA-256** y recién ahí se borró el original — el nombre destino
    difiere en más que mayúsculas, pero la regla de este repo es no hacer
    escribir-después-borrar sobre archivos del cliente.
  - **La sección 6b dejó de ser un frame reservado**: ahora la maqueta ES el
    preview y toda la hoja es el enlace al PDF. ⚠️ Se le sacó el
    `aspect-ratio: 1/1.414` que tenía el placeholder: existía para reservar espacio
    A4 de un preview que no existía, y el preview trae su propio ratio — dejar los
    dos deja aire muerto debajo de la hoja, que es justo como se veía la primera
    versión de esta card.
  - ✅ **DOS BUGS PRE-EXISTENTES ENCONTRADOS MIDIENDO, los dos en vivo desde que la
    página se construyó:**
    1. **Los tres tics del hero eran invisibles.** Llevaban `.hero__reassurance-item`
       y un `<svg class="icon">` pelado — **nombres de clase del HOMEPAGE, y
       `page-home.css` no se carga en esta página**, así que no los estilaba nada:
       medido `fill: rgb(0,0,0); stroke: none`, o sea tres checks NEGROS sobre un
       hero negro, y el `<li>` nunca se volvía fila flex (43px de alto cada uno, sin
       icono). Arreglado con los nombres del chasis que la página sí carga
       (`.service-hero__point` / `.service-hero__point-icon`). ⚠️ `.hero__reassurance`
       se queda en el `<ul>`: es el hook que anima `js/hero-reveal.js`.
    2. **25px de scroll horizontal a 320px.** El bloque de teléfono ponía
       `width: 100%` en los CTA pero **le faltaba `white-space: normal`, que es la
       mitad que carga el peso** — `.btn` es `nowrap` y el ancho no reduce el
       min-content de la etiqueta (~325px contra 296 disponibles), así que el botón
       empujaba h2, párrafo y todo. Es la **tercera** vez que esta misma omisión
       causa el mismo bug (page-service.css y page-city.css ya la documentan).
  - ⚠️ **PENDIENTE, encontrado y NO arreglado: `/angebot/` tiene el mismo bug de
    320px** (28px). Es otra página y su feedback viene en una sección posterior.

- **Q2 — la sección de Alexander Jäger SE QUEDA, siempre**, en todas las páginas
  donde los documentos la piden. Verificado que sigue en `/werkschutz/` y
  `/sicherheitskonzept/`. Cierra la pregunta abierta que las dos páginas
  arrastraban. **Su retrato sigue faltando.**

- **Q3 (resto) — los heroes de mapa YA ESTABAN.** El cliente aprobó la animación
  del contorno para `/einsatzgebiete/`, las páginas de ciudad y las combo: las tres
  ya la tienen (`/einsatzgebiete/` desde el 2026-08-10, `/sicherheitsdienst-nuernberg/`
  y `/brandwache-nuernberg/` desde antes). No hubo nada que construir.

- **Medido después de todo, las 21 páginas a 1440 y las tocadas a
  320/390/768/1024/1440/1920:** sin scroll horizontal en ninguna, un solo `<h1>`,
  sin saltos de nivel de heading, 0 placeholders sin resolver, y los seams
  construyen tiles en todas. Sin JS y con `prefers-reduced-motion` las páginas
  nuevas rinden completas con **0 elementos ocultos y 0 tiles**. Los enlaces
  internos rotos que quedan son **exactamente los planificados de siempre**
  (servicios y ciudades sin construir): **`/impressum/` y `/datenschutz/` salieron
  de esa lista**, que era el objetivo.
  ⚠️ **Dos avisos de contraste que aparecen en las mediciones y NO son nuevos ni
  reales:** el 3,11:1 del botón primario es el caveat sitewide ya aceptado, y el
  "1:1" de la píldora de Google es **un falso positivo de mi propia sonda** — al
  subir por ancestros buscando un fondo opaco se pasa de largo la card. Muestreado
  como corresponde: **9,24:1 y 5,25:1**. El 1,84:1 de las estrellas ★★★★★ de los
  testimonios es pre-existente y está igual en el homepage.

**2026-08-14 — REGLA GLOBAL G1: UN SOLO DISEÑO DE SECONDARY CTA EN TODO EL SITIO**
(cliente: "definí UN diseño fijo para el secondary CTA y usalo en todas las páginas
… y que el border sea un poquito más fino", con una foto del botón de Instagram del
homepage como referencia). Toca `components.css` y **16 CTAs en 14 páginas**.

- ⚠️ **HABÍA CUATRO PÍLDORAS DE CONTORNO CASI IGUALES, y ése era el problema real —
  no el estilo de ninguna de ellas.** Medido antes de tocar nada: `.hero__phone`
  (borde blanco 35 %, texto 85 %), `.service-hero__phone` (**los mismos valores,
  copiados literalmente en otro archivo**), `.btn--secondary` (borde
  `--color-border-strong`, 42 %) y `.social__cta .btn--secondary` (override local a
  blanco pleno). Las cuatro resuelven ahora en **una sola regla**; las otras tres
  se BORRARON, no se sobreescribieron.
- **La que gana es la del cliente**: el pill de Instagram — borde blanco SÓLIDO, sin
  relleno, texto blanco. O sea el override local del homepage **se promovió a base**,
  que es la única de las cuatro deleciones que es una promoción y no una remoción.
- ⚠️ **GANANCIA DE CONTRASTE QUE NO SE BUSCÓ, y era una falla real:** el borde al
  35 % medía **~2,6:1 sobre negro**, por debajo del 3:1 que pide WCAG 1.4.11 para el
  límite de un componente de interfaz. Blanco sólido mide **21:1**. Unificar hacia
  arriba arregla eso de paso.
- ⚠️⚠️ **`1.5px` NO EXISTE: CHROME REDONDEA `border-width` A PÍXELES CSS ENTEROS.**
  Se escribió 1.5px primero y **computa `1px`, medido a deviceScaleFactor 1 Y 2** —
  o sea una pantalla retina tampoco lo salva. Es la misma trampa que `page-service.css`
  ya documenta para el marco de 0.5px de `/werkschutz/`. **1px es el piso**; más fino
  sólo se consigue con un trazo SVG (`.service-contrast__frame`). No devolverle un
  valor fraccionario pensando que renderiza.
- ⚠️ **El `padding-block` de `.btn--secondary` lleva +1px, y NO es decoración:** un
  borde se come la caja por LOS DOS lados, así que bajar 2px → 1px dejó la píldora en
  **46px contra los 48 del primario**. Medido. La decisión del cliente de 2026-07-22
  ("los dos botones del mismo tamaño") sigue vigente, así que los 2px se devuelven
  como padding. **Si cambia el padding o el borde de `.btn`, re-medir esto.**
- **Sobre sección clara el diseño es el mismo con los dos colores invertidos**
  (`.section--light .btn--secondary`, negro sobre blanco). Sin eso sería blanco sobre
  blanco; el único consumidor hoy es el cierre de `/ratgeber/`.
- **`.btn__icon` nuevo en components.css: UNA regla reemplaza CUATRO copias**
  page-scoped del mismo fix de `#icon-phone` (`.hero__phone .icon`,
  `.service-hero__phone .icon`, `.city-callout__call .icon`, `.combo-hero__call .icon`).
  ⚠️ Deliberadamente **no** se aplicó a todo `.icon` dentro de `.btn`: `.btn__arrow`
  es un icono de trazo y un `fill` general lo borraría.
- **Páginas que GANARON un secondary CTA** (no tenían ninguno): `/einsatzgebiete/`,
  `/jobs/`, las **3 case studies** y los **3 artículos del Ratgeber**.
  - ⚠️ **`/jobs/` CONTRADICE SU PROPIO DRAFT APROBADO**: el Webtext 29 dice textual
    "kein Telefon-CTA: Bewerbungen laufen über die Seite". Se le planteó el conflicto
    al cliente y eligió G1. **Es el único lugar del sitio donde una regla global
    posterior pisa el draft de una página**; queda anotado en el markup con la línea
    exacta a borrar si Recruiting lo quiere de vuelta.
  - **Las case studies perdieron el `.btn--lg` del primario** en la misma edición: un
    primario grande al lado de un secundario de tamaño base es un par desparejo, que
    es justo lo que el hero del homepage arregló en la otra dirección.
- ⚠️ **`/ratgeber/` (hub): los dos CTAs INTERCAMBIARON ROLES.** Era la única página
  donde el teléfono era el botón azul; ahora "Schreiben Sie uns" es el primario y el
  teléfono la píldora de contorno, como en las otras nueve. **Ningún destino cambió.**
  **A confirmar con Chris**: el draft cierra con "rufen Sie an oder schreiben Sie
  uns", así que si el teléfono tiene que seguir siendo la acción más fuerte ahí, se
  intercambian las dos clases y esa página pasa a ser la excepción documentada.
- **`/referenzen/`, `/kontakt/` y `/angebot/` NO se tocaron**, por decisión del
  cliente: no tienen fila de CTA en absoluto (su único `.btn--primary` es el submit
  del formulario), así que agregarles un secundario habría significado inventarles
  una composición nueva.
- **Medido en las 19 páginas construidas, a 1440 y 390**: **exactamente DOS firmas**
  de secundario en todo el sitio — `(1px, blanco, blanco, transparente)` en oscuro y
  `(1px, #010101, #010101, transparente)` en claro — primario y secundario **los dos
  en 48px** en las 16 filas, sin scroll horizontal en ningún ancho, y el glifo del
  teléfono `fill: currentColor; stroke: none` en los 14 que lo llevan. Hover
  verificado **con puntero real** en las dos superficies: el wash entra
  (`rgba(255,255,255,0.08)` / `rgba(1,1,1,0.06)`) y **borde y texto no se mueven** —
  el salto a azul que hacía la variante vieja se fue.
- ⚠️ **LA ÚNICA DIVERGENCIA QUE QUEDA, y es de TAMAÑO, no de diseño:** en teléfono el
  pill del hero del homepage mide **44px** contra los 48 del resto, porque
  `.hero__phone` conserva su compactación móvil pedida explícitamente por el cliente
  ("no lo hagas otro botón grande a todo el ancho… reducí el ancho para que envuelva
  al contenido"). Borde, relleno y color son idénticos. **No revertir esa
  compactación sin preguntar** — es una instrucción del cliente, no un descuido.
- **Comentario obsoleto corregido de paso** en `page-city.css`: decía que el teléfono
  del `.city-callout` es `.btn--secondary` "secundario y no primario"; el markup dice
  `btn--primary` desde hace tiempo. Ese botón **no** entró en G1 a propósito — es un
  callout de mitad de página, no la fila de CTA, y la página ya tiene su píldora en el
  hero; convertirlo pondría el mismo número dos veces en el mismo tratamiento.
- ⚠️ **Dos lecciones de medición, mías:** (1) **hoverear el CONTENEDOR de la fila y
  leer SU computed style no dice nada del botón** — una primera pasada reportó "el
  hover no aplica" en las cuatro páginas por eso; hay que apuntar el puntero al
  `.btn--secondary` mismo. (2) **el `clip` de `Page.captureScreenshot` está en
  coordenadas de PÁGINA, no de viewport** — sin sumarle `scrollX/scrollY` las capturas
  salen de una zona equivocada y parecen un bug de layout.

**2026-08-14, MISMO DÍA — REGLAS GLOBALES G10 (los precios se editan en UN lugar) y
G11 (verificar el checkbox de consentimiento). G11 era una VERIFICACIÓN y pasó;
G10 era mitad hecho y mitad no.**

- **G10 — el rango 26-32 ya estaba centralizado, TODO LO DEMÁS no.** Auditadas las
  21 páginas: **28 valores hardcodeados en 7 páginas**. `content/values.json` tenía
  `price.range`, pero la prosa escribía el número a mano ("zwischen 26 und 32 Euro")
  porque el token es `26-32` con guion y la frase alemana necesita las dos mitades
  sueltas. De ahí salieron `price.min` y `price.max`.
  - **Lo que faltaba centralizar, y ahora está**: los recargos del Lohntarifvertrag
    (**23 % noche / 26 % domingo / 100 % feriado**, más la ventana "20–6 Uhr"), los
    **tres ejemplos calculados** del Ratgeber de costos (5.500–6.800 €/mes,
    1.550–1.900 €, 1.850–2.300 €, y las 60 y 72 horas), y **el año del `<title>`**
    de esa misma página ("Preise & Faktoren 2026").
  - ⚠️ **`min`/`max` y `range` son el mismo número en dos formatos** (prosa contra
    píldora). No hay derivación: al actualizar hay que mover los tres.
  - ⚠️ **Los `example.*` son DERIVADOS de la tarifa y los recargos y NO se
    recalculan solos.** Centralizarlos los pone en un lugar; recomputarlos sigue
    siendo manual. Está dicho en el propio `_comment` de la clave.
  - ⚠️ **El texto de cada FAQ existe DOS veces** (visible y `FAQPage`), así que las
    dos copias tienen que llevar el MISMO token o el precio que ve Google se separa
    del que ve el visitante. **Verificado después: 59/59 byte-idénticas.**
  - ✅ **Probado de punta a punta, no deducido:** en un árbol aparte se simuló la
    actualización anual (**26-32 → 29-35**, noche 23 → 25 %, domingo 26 → 28 %, año
    2026 → 2027), se buildeó y **todas las páginas siguieron el cambio con CERO
    valores viejos en la salida**. Eso es literalmente el "5-minute content edit"
    que pide la regla.
  - **`price.general` NO era una clave muerta** — la consume `/angebot/`. Se
    chequeó antes de tocarla, después del caso de `whatsapp` en G12.
- **G11 — la frase renderiza bien en las 12 páginas con formulario, y el markup
  nunca fue el problema.** "Ich habe die Datenschutzerklärung gelesen und stimme
  zu." sale de UN solo lugar (`partials/lead-form.html`; `/kontakt/` tiene su propio
  form con la misma frase). Medido a 390 y 1440: la palabra presente, el link
  visible, **4,90:1** y subrayado en las 12.
  - **Confirmado con PÍXELES y mirando la captura, no con `getComputedStyle`**: el
    recorte 5× del link da 235 colores con tinta `#4673AB` sobre blanco a **4,88:1**,
    y la línea completa se lee "☐ Ich habe die Datenschutzerklärung gelesen und
    stimme zu. *". Es la lección de `/angebot/` aplicada por defecto.
  - ⚠️ **Por qué el cliente vio "falta la palabra": era el CONTRASTE, no el HTML.**
    El link heredaba blue-light (3,11:1 sobre la tarjeta blanca) y se lavaba hasta
    parecer ausente. **Si alguien vuelve a reportarlo, mirar el color antes que el
    markup.**
  - ⚠️ **SÓLO SE PROBÓ EN CHROMIUM** — es el único motor disponible acá, así que
    "en todos los navegadores" no está verificado empíricamente. Lo que sí se hizo
    es descartar las causas que divergen entre motores: no hay `overflow` que
    recorte, ni `position: absolute`, ni pseudo-elemento encima, ni override
    page-scoped que esconda el link; y el `display: inline-block` que algunos
    motores necesitan para no recortar la caja padded ya está puesto. Vale una
    mirada real en Safari y Firefox.

**2026-08-14, MISMO DÍA — REGLA GLOBAL G9: EL BADGE DEL HERO LO DEFINE EL
DOCUMENTO. Faltaba en 6 páginas, y 4 de esas 6 se habían sacado por pedido
explícito del propio cliente.**

- **La lista salió de auditar los 52 `.docx` contra las 21 páginas, no de leer este
  archivo.** Resultado: **15 documentos especifican un `Badge:`**, 8 ya lo
  renderizaban bien y **6 no lo tenían** — `/werkschutz/`, `/einsatzgebiete/`,
  `/kontakt/`, `/referenzen/`, `/jobs/` y `/brandwache-nuernberg/` (el cliente
  nombró dos de esos seis; los otros cuatro los encontró la auditoría).
  **Las 4 páginas del Ratgeber no especifican badge**, así que su ausencia es
  correcta y se dejaron como están.
- ⚠️⚠️ **CUATRO DE LAS SEIS SE HABÍAN QUITADO POR INSTRUCCIÓN DEL CLIENTE**, cada
  una con su razón anotada: `/werkschutz/` y `/jobs/` el 2026-08-03 (el chip repetía
  lo que ya dicen los dos sellos DEKRA del mismo hero), `/brandwache-nuernberg/` el
  08-10 ("sacá la pill") y `/kontakt/` el 08-06 (la página decía 24/7 dos veces).
  **G9 es posterior y gana**, igual que G6 sobre la píldora compacta del homepage.
  **Cada una lleva en su markup un comentario con las dos mitades de la historia —
  por qué se sacó y por qué volvió — para que nadie la borre otra vez "limpiando".**
- ✅ **El argumento que justificaba sacar el de `/werkschutz/` ya estaba superado por
  la práctica, y eso se verificó midiendo**: `/leistungen/`, `/ueber-uns/` y
  `/sicherheitskonzept/` **ya publican chip Y sellos DEKRA en el mismo hero**. O sea
  restaurarlo es lo consistente, no una regresión.
- ⚠️ **`/kontakt/` vuelve a decir "24/7 erreichbar" DOS VECES** (badge +
  Highlight-Box), que es exactamente la duplicación que el cliente resolvió en
  agosto quedándose con la de abajo. **No se borró el badge de nuevo** — eso es lo
  que G9 pide. Queda anotado en la página y avisado al cliente: si molesta, se saca
  de uno de los dos lados, y es decisión suya cuál.
- **Se promovió `.hero-badge` a components.css en vez de escribir seis copias.**
  `.lh-hero__badge` y `.ag-hero__badge` eran **byte-idénticos**, así que los dos se
  borraron y sus 4 páginas usan el compartido — **cero cambio visual**, verificado.
  ⚠️ **Sobreviven dos tratamientos de FAMILIA a propósito**: `.city-hero__badge`
  (píldora, ciudad y combo) y `.cs-hero__badge` (label en mayúsculas, las 3 case
  studies). G9 pide que el badge ESTÉ, no que los tres estilos se fusionen — si
  alguna vez hay que unificarlos es una decisión aparte. Por eso
  `/brandwache-nuernberg/` recibió la **píldora de su familia**, la misma que ya
  tiene `/sicherheitsdienst-nuernberg/`, y no un cuarto estilo nuevo.
  ⚠️ **`.hero__badge` de page-home.css NO es este componente** — dimensiona la
  IMAGEN de un sello DEKRA. Nombre casi igual, cosa distinta. No fusionarlas.
- **Medido a 390 y 1440 en las 11 páginas con badge**: los 11 renderizan, contraste
  **19,30–20,87:1**, icono visible en todos, **sin scroll horizontal**, y el aire
  hasta el H1 es 16px (24px en las dos píldoras de ciudad, que es el valor de esa
  familia). Tres envuelven a dos líneas a 390 — texto largo en una columna angosta,
  esperable. **Verificado también que los 14 textos son verbatim del `.docx`.**
- ⚠️ **Falsa alarma que casi reporto como bug:** una sonda contó **2 `<h1>` en el
  homepage**. El segundo estaba **dentro de un comentario HTML** ("hero-reveal.js
  handles the hero `<h1>` only"). Sacando comentarios primero: **21 páginas, 1 `<h1>`
  cada una**. Contar tags sin descartar comentarios da falsos positivos.

**2026-08-14, MISMO DÍA — REGLAS GLOBALES G6 (una sola medida en el hero móvil) y
G7 (se va la transición formulario → footer, en las 21 páginas).**

- **G6 — el defecto sólo existe en un teléfono GRANDE, y por eso había sobrevivido.**
  Medido antes de tocar nada, a 390 / 430 / 600 / 767: a 390 y 430 casi todo ya
  coincidía; el problema aparece de 600 para arriba, donde los CTAs llenan la
  columna y el subline se queda en su tope de 32rem. **Spread de 48px a 600 y de
  192–208px a 767**, en las 8 páginas interiores. Hay que medir a 767, no a 390.
  - **El homepage era un caso aparte y peor**: su píldora de teléfono medía
    **175px contra un primario de 358** (spread 183px a 390, **514px a 767**),
    porque conservaba su compactación móvil.
  - ⚠️⚠️ **ESO REVIERTE UNA INSTRUCCIÓN EXPLÍCITA DEL PROPIO CLIENTE** ("no lo
    hagas otro botón grande a todo el ancho… reducí el ancho para que envuelva al
    contenido"), que este archivo marcaba como **"no revertir sin preguntar"**. Se
    preguntó, con los números; eligió G6. **La píldora del homepage ahora es
    full-width y 3rem de alto como el resto. No volver a compactarla sin preguntar
    de nuevo.**
  - **Cuatro topes borrados, todos sólo bajo 767.98px**: `max-width: 31ch` del
    lede del homepage, `32rem` de `.service-hero__lead`, `38rem` de `.jobs-hero h1`
    y el `width: auto` de `.hero__phone`. En escritorio los cuatro siguen — un lede
    de 512px al lado de una foto es una columna legible, no un defecto.
  - ⚠️ **La regla del chasis necesita DOS clases**: `.jobs-hero h1` y los topes por
    página son (0,1,1) y sus hojas cargan DESPUÉS de `page-service.css`, así que un
    selector de una clase empata y **pierde por orden**.
    `.service-hero .service-hero__content h1` es (0,2,1) y gana.
  - **Medido después, las 9 páginas a 390 / 430 / 600 / 767: spread 0px en las 36
    combinaciones.** H1, subline, primario y secundario exactamente iguales.
  - ⚠️ **El badge de Google sube un paso de padding pero NO al valor de escritorio
    en teléfono**, y la razón está medida: comparte una fila de 358px con los dos
    sellos DEKRA, y a 12/16px la fila desbordaba. Queda **8/12px en teléfono y
    12/16px de 768 para arriba** — badge 257 + sellos 59 = 316 sobre 358
    disponibles, y a 320px la fila envuelve como ya lo hacía.
- **G7 — el seam entre el formulario y el footer se fue de las 21 páginas.** El
  cliente tiene razón sobre por qué no aportaba nada: la última sección casi
  siempre es oscura (la del formulario) y el footer también, **así que ese borde no
  separaba dos colores y no había nada que disolver**. Los **88 seams de mitad de
  página se quedan intactos** — un seam existe donde hay un cambio de color real.
  - ⚠️ **Borrar el `<div>` es la mitad del trabajo.** El footer reservaba la altura
    de la banda con `.pixel-seam + .site-footer` en **cinco hojas**
    (page-home, page-service, page-contact, page-jobs, page-city). Al ser selectores
    de hermano adyacente ya no pueden matchear, así que no dejan hueco muerto — pero
    quedaban como reglas que nadie puede disparar, y se borraron. **Verificado: el
    `padding-top` del footer vuelve a 96px (`--space-9`).**
  - ⚠️ **La auto-detección de "pulse" quedó INALCANZABLE y se dejó a propósito, con
    nota.** Sólo se dispara cuando el hermano siguiente del seam es el footer, que
    es justo el borde que se eliminó. Sigue siendo correcta el día que alguien
    ponga un seam ahí, y `data-pixel-seam-mode="pulse"` explícito sigue andando
    (hoy no lo usa ninguna página).
  - ✅ **El bug de resize que el cliente marcó como "arreglar sólo si es barato"
    está ARREGLADO, y era real:** `js/pixel-transition.js` medía la banda **una
    sola vez** y derivaba de ahí la cantidad de columnas, sin ningún listener de
    resize. Achicando y volviendo a agrandar, el seam se quedaba con la grilla
    chica. Ahora la construcción de tiles es una función que se vuelve a correr en
    el `refresh` de ScrollTrigger, **sólo si el ancho cambió de verdad** — sin ese
    guard cada refresh re-randomizaría los umbrales y la disolución se rebarajaría
    a mitad de scroll. **Medido: 1440 → 36 columnas / 180 tiles → 390 → 10 / 30 →
    de vuelta a 1440 → 36 / 180.** Antes se quedaba en 10.
- **Barrido final en 17 páginas a 390 / 767 / 1440**: sin scroll horizontal en
  ninguna, **cero seams antes del footer**, los 88 de mitad de página presentes, y
  un solo `<h1>` por página.

**2026-08-14, MISMO DÍA — REGLAS GLOBALES G4 (todo teléfono es un `tel:`) y G5
(el rating siempre "4,7", y de una sola fuente). Encontró UN BUG EN VIVO que no
tenía nada que ver con lo pedido: en `/angebot/` la línea "Lieber direkt sprechen?"
era BLANCO SOBRE BLANCO, o sea invisible.**

- **G4 — seis números pasaron a link, y la lista salió de medir, no de leer.** Una
  sonda buscó todo número de teléfono que NO estuviera dentro de un `<a href="tel:">`:
  `/angebot/` (la mini-FAQ, la que nombró el cliente), el artículo de Brandwache (la
  otra que nombró), **más cuatro que no estaban en el pedido** — las dos respuestas
  de FAQ del homepage, el cierre de `/einsatzgebiete/` y el lede de `/ratgeber/`.
  - ⚠️ **Los DOS números del Impressum se dejaron a propósito: son FAX** (`-90`, no
    `-0`). Un `tel:` sobre un fax es un enlace que no sirve para nada.
  - ⚠️ **NO se tocó el JSON-LD, y ésa es la parte delicada.** El texto de cada FAQ
    existe dos veces —visible y dentro del `FAQPage`— y tienen que quedar
    byte-idénticas. Envolver el número en un `<a>` cambia el MARKUP y no el TEXTO,
    así que la copia del schema se queda igual. **Verificado sobre el build: 59 de
    59 respuestas byte-idénticas en las 12 páginas con FAQ.**
- ⚠️ **UN LINK NUEVO EN PROSA NO ES GRATIS: hereda `--color-link` (blue-light), que
  mide 3,11:1 sobre blanco y 2,87:1 sobre el relleno de una card de FAQ — los dos
  por debajo del 4,5:1 que pide un link de 16px dentro de una frase.** Y como
  `inline` mide 18px de alto, tampoco llega a los 44 de área táctil. O sea: cumplir
  G4 sin tocar CSS habría publicado seis fallos de accesibilidad.
  - **La regla se PROMOVIÓ a components.css** (`.faq-item a:not(.btn)` +
    `.section--light p a[href^="tel:"]:not(.btn)`), y con eso se borraron **tres
    copias page-scoped** que ya decían lo mismo: `page-city.css`, `page-ratgeber.css`
    y una copia sólo-móvil en `page-jobs.css`.
  - ⚠️ **`.faq-item a`, NO `.faq-item__answer a`, y esto lo descubrió la medición:
    el markup de las respuestas NO es uniforme.** Casi todas envuelven en
    `.faq-item__answer`, pero **`/angebot/` mete un `<p>` pelado dentro del
    `<details>`**, así que el selector angosto se salteaba esa página en silencio —
    medido, seguía en 2,87:1 y `display: inline` después de "arreglarlo". Verificado
    que ningún `<summary>` del sitio contiene un `<a>`, así que no puede filtrarse a
    la fila de la pregunta.
  - **El segundo selector existe porque un teléfono en prosa no está en ninguna FAQ**
    (`/einsatzgebiete/` y `/ratgeber/`). Los dos excluyen `.btn`: el CTA secundario
    también es un `tel:` y ya tiene su color y sus 48px (G1).
- ⚠️⚠️ **EL BUG QUE APARECIÓ DE PASO, y estaba EN PRODUCCIÓN:** `.ag-hero__alt` en
  `/angebot/` —la línea "Lieber direkt sprechen? … 24/7 erreichbar"— usaba
  `--color-text` / `--color-text-muted`, o sea los tokens del tema OSCURO (blancos),
  **pero vive DENTRO de `.conversion__form-wrap`, la card BLANCA del formulario**.
  Esa card no es `.section--light`, así que nunca re-declara esos tokens.
  **Confirmado muestreando píxeles, no leyendo el CSS: un recorte 4× de la caja del
  link daba UN solo color, `rgb(255,255,255)`, 64.496 píxeles.** Después del
  arreglo: 307 colores y el link en `#4673AB` a **4,88:1**.
  Es el espejo exacto de la regla que page-service.css ya documenta para la card de
  precio oscura: **un panel que se pinta su propia superficie tiene que pintarse
  también su propio color de texto.** Los valores se copiaron de
  `.conversion__form-alt` (lead-form.css), que es LA MISMA línea bajo el formulario
  compartido — dos tratamientos parecidos serían el problema, no la solución.
- **G5 — el defecto real era UNO y estaba en el homepage: `4.7` con PUNTO.** Los
  otros seis badges ya decían `4,7`. O sea el sitio publicaba su única cifra
  confirmada en dos formatos, y justo en la página más vista.
  - **"Pull the value dynamically": `content/values.json` ya tenía el objeto
    `rating`** (`value: "4,7"`, `count: "97"`) y cuatro páginas ya lo consumían. Las
    otras cuatro (homepage, `/jobs/`, `/ueber-uns/`, `/werkschutz/`) lo tenían
    hardcodeado y ahora usan los tokens. **Actualizar el rating es una línea en un
    archivo y se propaga a las ocho.** Un pull EN VIVO desde Google es otra cosa —
    necesita la Places API con key, facturación y su gate de consentimiento, o sea
    no entra en las restricciones actuales del proyecto. Decisión del cliente.
  - ⚠️ **El `ratingValue` del JSON-LD se queda con PUNTO (`4.7`) en las 5 páginas
    que lo publican, y NO es una inconsistencia: schema.org exige el punto como
    separador decimal.** Es el mismo número en dos formatos a propósito. No
    "unificarlo" con la coma.
  - **Las estrellas ya estaban**: los 7 `.review-card` traen su
    `.review-card__stars` con el fill al 94 % (= 4,7/5), así que el nice-to-have
    opcional de G5 ya estaba cubierto. El único rating sin estrellas es el
    `.ag-metric` de `/angebot/`, que es una teja de métrica y no un badge.
- **Medido sobre un build propio, en las 15 páginas**: los **13 links inline**
  (nuevos y viejos) pasan los dos umbrales — **≥44px de alto y ≥4,5:1** — y **cero
  scroll horizontal** a 1440. Incluye las cuatro páginas cuyas reglas page-scoped se
  borraron, así que la promoción no rompió nada.
  - ⚠️ **Los dos links del FAQ del homepage miden 0px hasta que se despliega la
    lista**: `.faq__list` arranca con `is-clamped` (el "ver más"). Sacando esa clase
    miden **48,1px**. No es un defecto; es el estado plegado.
- ⚠️⚠️ **DOS TRAMPAS DE ENTORNO QUE COSTARON TIEMPO Y VAN A VOLVER:**
  1. **`dist/` NO es confiable como objetivo de verificación en este repo.** Hay otra
     sesión buildeando en paralelo y iCloud creando copias de conflicto
     (`css 2`, `angebot 2`, `assets 3`…). Una primera pasada de paridad de FAQ
     reportó **42 mismatches** — todos falsos, incluidas páginas que no había tocado:
     estaba leyendo un `dist/` a medio escribir. **Buildear a un árbol propio**
     (`rsync` a un scratch + `node build.js` ahí) y medir eso.
  2. **`build.js` ahora MINIFICA el CSS y lo bundlea en `css/app.css`.** Buscar un
     comentario propio en la salida devuelve 0 y parece que la regla no se aplicó —
     el minificador borra comentarios. **Grepear la DECLARACIÓN, no el comentario.**

**2026-08-14, MISMO DÍA — REGLAS GLOBALES G2 (orden de los CTA del hero) y G3
(destino según la ETIQUETA).** Auditados los **43 botones** del sitio, no sólo las
páginas que el cliente nombró. La plantilla quedó escrita en
[docs/page-conventions.md §3](docs/page-conventions.md) (el par de CTA) y **§11.3 /
§11.3b** (orden y destinos).

- **G2 — el orden ya estaba bien en 8 de los 9 heroes**, así que lo que hizo falta no
  fue reordenar nada sino dejar la excepción POR ESCRITO. Default: primario
  "Unverbindliches Angebot einholen", secundario el teléfono. ⚠️ **La inversión
  (teléfono primario) queda ACOTADA A BRANDWACHE** — `/brandwache-nuernberg/` hoy y
  `/brandwache/` cuando exista. El cliente lo subrayó explícitamente; **no
  extenderla a las otras tres combos de Nürnberg**, que lideran con el formulario por
  sus propios drafts.
  - ⚠️ **`/brandwache/` TODAVÍA NO EXISTE** — es uno de los 404 planificados que ya
    enlazan el nav y el footer. Decisión del cliente: anotar la excepción para cuando
    se construya, no construir la página ahora. Está en §11.3.
  - **`/jobs/` queda fuera de G2 a propósito**: su primario es "Jetzt unverbindlich
    bewerben", que no es el par oferta/teléfono del que habla la regla — es una
    página de reclutamiento y su acción es postularse. Ya tiene el secundario de
    teléfono desde G1.
  - **Los CTA de CIERRE del Ratgeber tampoco entran**: G2 dice "hero", y esas cuatro
    páginas no tienen CTA en el hero.
- **G3 — el defecto que nombró el cliente era real y ya estaba PREVISTO en este
  archivo.** Las 3 case studies mandaban "Kostenfreies Sicherheitskonzept anfordern"
  a `/#sicherheitsanalyse`. Era deliberado en su momento — `/sicherheitskonzept/` no
  existía y publicar el botón de conversión PRIMARIO como 404 era peor — y la entrada
  del 2026-08-05 lo dejó anotado textual: *"Cuando se construya `/sicherheitskonzept/`
  es una línea por página."* **Esta es esa línea, tres veces.**
- ⚠️⚠️ **EL COROLARIO QUE NO ERA OBVIO: G3 VUELVE ESA ETIQUETA INUTILIZABLE EN SU
  PROPIA PÁGINA DESTINO.** `/sicherheitskonzept/` tenía **cuatro** CTAs con ese texto
  apuntando a su propio `#anfrage`. Las dos reglas la aprietan desde los dos lados —
  G2 fija la etiqueta del primario del hero, y G3 dice que sólo "Unverbindliches
  Angebot einholen" puede llevar a un formulario — y mandarlas a
  `/sicherheitskonzept/` sería un enlace a sí misma. O sea **lo que tenía que cambiar
  era la ETIQUETA, no el destino**: las cuatro pasaron a "Unverbindliches Angebot
  einholen" → `#anfrage`.
  - **Las cuatro y no sólo la del hero, y fue decisión del cliente** (se le preguntó
    con las tres salidas): con una etiqueta en el hero y otra en los tres CTAs de más
    abajo, la página usaría dos palabras distintas para un mismo destino.
  - ⚠️ **El H2 sobre el formulario sigue diciendo "Jetzt kostenfreies
    Sicherheitskonzept anfordern", y está bien: es un ENCABEZADO, no un CTA.**
    Ninguna de las dos reglas lo toca, y es lo que mantiene la promesa de la página en
    sus propias palabras. No "corregirlo" por consistencia con los botones.
- **Verificado por auditoría automática de los 43 botones** (etiqueta ↔ destino, sobre
  el markup fuente y descartando comentarios): **cero violaciones de G3**, orden de
  hero correcto en los 9, y Brandwache invertida como corresponde. Links internos de
  `dist/` re-chequeados: `/sicherheitskonzept/` resuelve, así que los tres CTAs nuevos
  no son 404 (los ~18 rotos por página que reporta la sonda son los planificados de
  siempre, del nav y el footer compartidos — `/objektschutz/`, las 9 ciudades,
  `/brandwache/`…).
- ⚠️ **Redundancia menor que dejó la corrección, NO tocada:** dos de las tres case
  studies ya tenían un `.cs-related__link` a `/sicherheitskonzept/` en su bloque
  "Weiterführend", así que ahora el CTA primario y un link de más abajo van al mismo
  lado. Es borrar un `<li>` en dos archivos, pero es contenido y no se sacó sin
  pedido.

**2026-08-14 — `/kontakt/`: VUELVE LA FRASE 24/7 DEL TELÉFONO, VUELVEN LOS SELLOS
DEKRA, Y EL CAMPO TELÉFONO PASA A OBLIGATORIO** (cliente, Kontakt 2/3/4).

- ⚠️⚠️ **DOS DE LOS TRES REVIERTEN DECISIONES DEL PROPIO CLIENTE QUE ESTE ARCHIVO
  MARCABA COMO "NO REPONER".** La entrada del 2026-08-05 decía textual, sobre los
  fragmentos que faltaban en esta página: *"NO son un olvido, son decisiones del
  cliente, reconfirmadas… **No reponerlos 'para completar el doc'**"*. El cliente
  ahora pidió dos de ellos por escrito, así que **la instrucción posterior gana** y
  esa nota queda superseded para esas dos líneas.
  **El tercer fragmento — el "bei Angebotsanfragen inklusive kostenfreier
  Erstberatung" del e-mail — NO se pidió y sigue afuera.** No reponerlo de arriba.
- **La frase del teléfono va COMPLETA** ("Rund um die Uhr erreichbar, an 365 Tagen
  im Jahr.") y **se conserva la segunda oración** (el gancho de Brandwache), que es
  lo único que no dice ninguna otra parte de la página. ⚠️ Con esto la página
  vuelve a afirmar 24/7 **dos veces** (acá y en la Highlight-Box) — que es
  exactamente lo que el cliente había resuelto en agosto quedándose con la de
  abajo. Es su decisión; si vuelve a molestar, la que se edita es la Highlight-Box,
  que es el bloque agregado después.
- **Los sellos DEKRA vuelven con el bloque EXACTO que se había borrado**
  (`.contact-cert*`, markup y CSS recuperados de git), no con un diseño nuevo — así
  esta página vuelve a lo ya aprobado en vez de estrenar una tercera variante.
  Van **después de la Highlight-Box**, que no existía cuando se quitaron: leen como
  el cierre de la columna y no como un cuarto item compitiendo con las tres tejas.
  ✅ Cierra de paso algo que este archivo había marcado como pérdida real: la
  afirmación de certificación había desaparecido **por completo** de `/kontakt/`.
  - ⚠️ **UNA desviación del restore, y es de legibilidad: 2.25rem → 2.75rem.** Al
    tamaño original renderizan **24x44 px** y el wordmark DEKRA adentro de un sello
    399x600 no se lee — un símbolo de certificación que nadie puede identificar no
    hace el trabajo que se pidió. 2,75rem es **el más chico que el sello tiene en
    todo el sitio** (las trust bands de hero), así que sigue siendo discreto.
    Medido: **29x44 y ratio 0,665 = 399/600 exacto**, o sea sin deformar (la regla
    del proyecto: los sellos se escalan, nunca se recortan ni distorsionan).
- **El campo Telefon es `required`, y el label lleva el " *"**: `required` solo lo
  anuncia el lector de pantalla, y quien ve la página se entera recién cuando el
  formulario se niega a enviarse. ⚠️ Ahora el form pide e-mail **y** teléfono —
  es lo que especifica el Webtext 25 y el cliente lo pidió dos veces; si alguna vez
  se ve como caída de envíos, revertirlo es decisión suya, no un bug.
- **Medido a 320 / 390 / 768 / 1024 / 1440:** sin scroll horizontal, los 5 campos
  obligatorios correctos (`name, email, phone, message, privacy`), los dos sellos
  a 29x44 sin deformar, y la fila de sellos envuelve sola en teléfono (101px de
  alto a 320, 44 en escritorio).

**2026-08-14 — UNA SOLA FUENTE DE DATOS PARA LOS EINSATZGEBIETE, Y LOS 5 SIN
PÁGINA ENTRAN AL MAPA DE `/einsatzgebiete/`** (cliente, Einsatzgebiete 1: "add the
missing locations (Hof, Kronach, Kulmbach, Lichtenfels, Schwandorf — no links) and
build it so the map/pill list updates automatically … single data source").

- ⚠️ **LA MISMA LISTA ESTABA ESCRITA A MANO EN CINCO LUGARES Y YA HABÍA
  DIVERGIDO** — `partials/coverage-chips.html`, la segunda fila de chips dentro de
  `pages/index.html`, `partials/footer-de.html`, la tabla `CITIES` de
  `docs/design-sources/franken-map.py` y el objeto `coverageLocations` de
  `js/coverage-map.js`. Esa divergencia es el 404 de Hof que el footer publicó en
  TODAS las páginas hasta el 2026-08-05. Ahora la lista es **`content/coverage.json`**
  y esos cinco la consumen.
- **`build.js` gana UN mecanismo, no un lenguaje de plantillas:** marcadores
  `<!-- coverage: chips|mentions|footer row="N" -->` que emiten exactamente el
  markup que antes se escribía a mano. **Sigue siendo HTML estático** — y eso es
  justamente por qué se resuelve en build y no en el browser: estos pills son
  enlaces internos crawleables y no pueden depender de JS.
  ⚠️ El `row` es un campo del DATO, no un slice del markup — la división 6+4 que
  espeja al footer sobrevive sin lógica en la plantilla.
- **`href: null` es lo que hace cumplir "no links"**: el renderer de `mentions`
  emite `<button>` y el de `footer`/`chips` sólo acepta entradas CON href. O sea
  una ubicación sin página **no puede** volver a aparecer como link en el footer.
  El día que exista `/sicherheitsdienst-hof/`, se le pone la URL y sube sola.
- **El mapa Leaflet del homepage ahora hace `fetch` de esa misma lista**
  (`/assets/data/coverage-locations.json`, que genera el build). Es un request de
  ~1,5KB en un mapa que ya baja un geojson por ciudad y que sólo carga al entrar
  en viewport. Si falla, el mapa no se construye — es enhancement, y los links de
  al lado funcionan igual.
- ⚠️ **EL SVG DEL HERO DE `/einsatzgebiete/` NO ES AUTOMÁTICO, a propósito**: es
  arte vectorial inline, generado una vez en desarrollo
  (`python3 docs/design-sources/franken-map.py`, que ahora lee el JSON) y pegado.
  Agregar una ciudad = una entrada + su geojson + `npm run build`; el hero además
  pide re-correr y pegar. Está escrito en el `_comment` del propio JSON.
- ✅ **Probado de punta a punta, no deducido:** se agregó una ubicación de prueba
  ("Testhausen"), se buildeó, y apareció **sola en los chips del homepage, en el
  footer de todas las páginas y en los datos del mapa**; después se revirtió y
  desapareció de las tres. Es el mismo tipo de prueba que cerró G10.
- ⚠️⚠️ **LAS ETIQUETAS DEL MAPA CHOCABAN EN TELÉFONO, y la causa no es obvia: el
  `font-size` de esas labels está en UNIDADES DEL viewBox** (28 en escritorio, 46
  en teléfono) para compensar que el SVG se dibuja más chico. Con 5 labels más,
  a 46 unidades había **tres pares superpuestos a 390** (Schweinfurt×Lichtenfels,
  Ansbach×Schwandorf, Hof×Kronach) y **cero en todos los anchos mayores** — la caja
  crece mientras la geometría del mapa no. Arreglado con dos palancas: **el `side`
  de Schweinfurt y Ansbach** (que no cuesta legibilidad) y **46 → 40 unidades sólo
  en el tier de teléfono** (~14px en pantalla). Medido después: **cero
  superposiciones y nada fuera del marco a 320 / 390 / 430 / 599 / 600 / 768 /
  1024 / 1280 / 1440 / 1920**.
- ⚠️ **Schwandorf cae FUERA del contorno de Franconia** (Oberpfalz) pero **dentro
  del viewBox** — verificado contra el bbox de las tres regiones antes de dibujar,
  porque si hubiera caído afuera habría que reproyectar el mapa entero. Se ve como
  un pin al sudeste del contorno, que es lo correcto y lo mismo que hace el mapa
  del homepage.
- ⚠️ **Bug latente arreglado de paso en `js/eg-hero-map.js`: el stagger de las
  labels era POR ELEMENTO (`0.08`), así que cada ubicación nueva alargaba la
  animación del hero.** Con 15 el timeline pasaba de 3,67s a **4,07s — medido, no
  estimado** (se corrió el archivo viejo y el nuevo y se leyó `totalDuration()`).
  Ahora es `{ amount: 0.72 }`, el spread TOTAL que tenían las 10 labels: mismo
  barrido hoy y **no crece nunca más**. Es la convención que el resto del repo ya
  usa (`js/svg-draw.js`, `js/steps-sequence.js`).
- ⚠️ **Nota de medición, para no volver a perseguirlo:** bajo
  `--virtual-time-budget` el ticker de GSAP (rAF) avanza de forma inconsistente —
  dos corridas idénticas dieron "termina a los 5s" y "no termina nunca". El estado
  final se verifica **llevando el timeline a `progress(1)` y leyendo**: 15 pins,
  15 labels y 15 shapes en opacidad 1, dash de las 3 regiones limpiado y la clase
  `--live` retirada. Con `prefers-reduced-motion` el mapa se dibuja completo sin
  que el script toque nada.
- ⚠️ **PARA CHRIS:** el `eg-note` de esa página dice "Ihr Standort ist nicht dabei?
  … auch Hof, Kulmbach, Lichtenfels, Kitzingen, Haßfurt, Kronach oder Schwabach" —
  cuatro de esos ahora SÍ están en el mapa, así que la frase quedó a contramano de
  lo que se ve. Es copy del draft y no se tocó.

**2026-08-14 — LA SECCIÓN DE FILOSOFÍA (SEO) DEJA DE SER 2-UP EN TABLET: TRES
CARDS APILADAS Y ANCHAS** (cliente, Change Request 18: "¿es el layout actual el
mejor? considerá centrar la card de abajo" → después, viéndolo: "mejor una abajo de
la otra y que sean más horizontales, con un width coherente para tablet").

- ⚠️ **EL PROBLEMA ES QUE SON TRES CARDS EN DOS COLUMNAS**, así que la tercera
  quedaba sola en su propia fila debajo de la izquierda — una L, que es la captura
  que mandó el cliente. De un huérfano se sale centrándolo o dejando de tener filas;
  el cliente eligió lo segundo. **Revierte la banda `768–1199.98` que era
  `repeat(2, …)`.**
- **El cap de 44rem es lo que hace que apilar funcione, y no es un número redondo:**
  a 1199 una card a todo el container mide ~1100px y estos párrafos son de ~500
  caracteres, o sea **~140 caracteres por línea**. 44rem es la medida que el proyecto
  ya usa para prosa de artículo (`.cs-article`, `.rg-article`) y deja la card en
  **704px con ~88 caracteres por línea**: ancha y horizontal, todavía legible. La
  sección existe para ser LEÍDA (es el bloque de SEO/GEO de la página).
- ✅ **Ganancia lateral:** el título de la card 1 pasó de tres líneas (y cortado en
  la captura del cliente) a **una sola**.
- ⚠️ **COSTO MEDIDO, y crece con el ancho:** la sección va de 1466 → **1392px a 768**
  (o sea más CORTA en tablet, que es donde se pidió), pero 1298 → **1426 a 1024** y
  1288 → **1506 a 1199**. Apilado a ancho fijo no se acorta cuando crece el viewport;
  2-up sí. Si esos ~200px del extremo alto molestan, la palanca es subir el cap en
  esa banda, y se paga en largo de línea.
- **De 1200 para arriba no cambió nada** (las 3 columnas siguen igual) y en teléfono
  tampoco (el cap es inerte, el container es más angosto).
- **Medido a 390 / 767 / 768 / 834 / 900 / 1024 / 1100 / 1199 / 1200 / 1440:** tres
  filas en toda la banda, card centrada al eje (0px de desvío), sin scroll horizontal,
  y los marcos dibujados por `js/philosophy-cards.js` se re-miden solos al tamaño
  nuevo (703x239 dentro de una card de 704x240, o sea el medio trazo de inset).

**2026-08-14 — "25.000 €" PARTÍA EL € A OTRA LÍNEA EN LAS KACHELN DE RESULTADOS**
(cliente, Change Request 17: "esto no puede pasar… hacé los números un poco más
chicos o usá 25K €"). Toca las TRES páginas que publican ese bloque: homepage,
`/referenzen/` y `/sicherheitskonzept/`.

- ⚠️ **LA CAUSA ES QUE LA CIFRA SE DIMENSIONA CON EL VIEWPORT Y LA COLUMNA MIDE UN
  TERCIO DE ÉL.** A 768 las Kacheln pasan a 3-up **de un paso**: la columna cae de
  ~670px a ~180 mientras el clamp sigue subiendo con `vw`. Medido: "25.000 €" pedía
  **204px en una columna de 182** (homepage) y **de 150** en las otras dos, cuyo
  `<li>` lleva además 24px de padding a cada lado para el divisor.
- **Se eligió la primera opción del cliente (números más chicos), NO "25K €"**, por
  dos razones concretas: una cifra alemana conserva su notación, y `initStatCountUp()`
  anima los dígitos — "25K" o deja de contar o cuenta hasta 25.
- **El arreglo son DOS mitades y hacen falta las dos:** un `&nbsp;` entre cifra y
  unidad (que es además la regla tipográfica, DIN 5008) **prohíbe** el corte, y el
  tamaño garantiza que no tenga que haberlo. **El NBSP sobrevive al count-up**: esa
  función recompone `prefijo + número + sufijo` y el sufijo se captura tal cual —
  verificado con la animación corriendo (`"25.000 €"`, una línea).
- **La banda es 768–1199.98**, no 768–1023: en `/referenzen/` y `/sicherheitskonzept/`
  seguía partiendo hasta ~1200, que es donde la columna finalmente alcanza a la
  tipografía. Abajo de 768 (una Kachel por fila) y de 1200 para arriba **nada cambió**.
- **Un solo valor para las tres copias** (`clamp(2.25rem, 6.7vw - 0.9rem, 4.15rem)`),
  calibrado contra la MÁS ANGOSTA de las tres. Da 37 / 41 / 46 / 54 / 66px a 768 / 834
  / 900 / 1023 / 1199, siempre con ~8–20 % de aire, y **empalma con el clamp base a
  1200** (66 → 68px). ⚠️ Son tres copias del mismo componente en tres hojas — el
  razonamiento completo está en `page-home.css`; **mantener las tres en sincro**.
- **Medido en las 3 páginas a 320 / 375 / 390 / 640 / 767 / 768 / 834 / 900 / 1000 /
  1023 / 1024 / 1100 / 1199 / 1200 / 1280 / 1440 / 1920:** las 9 cifras en **UNA línea
  en todos los anchos**, sin scroll horizontal, y capturas en teléfono, tablet y
  escritorio para verlo y no deducirlo.

**2026-08-14 — EL CONFIGURADOR DE OUTFITS: LAS PASTILLAS AHORA LLEGAN HASTA 1024,
NO HASTA 768** (cliente, Change Request 16: "on tablet use pills (like suggested
for mobile) instead of the current selector — otherwise you can't click through the
outfits and see the model fully at the same time"). Es **un solo número**: la query
del bloque de `page-home.css` pasó de `max-width: 767.98px` a `max-width: 1023.98px`.

- ⚠️ **LA BANDA 768–1023 NUNCA TUVO TRATAMIENTO PROPIO, y ése era el bug.** El
  bloque de teléfono cortaba en 767.98 y el split de escritorio arranca en 1024, así
  que la tablet caía en el layout BASE: las siete filas rayadas a todo el ancho
  apiladas ARRIBA del visor, que es exactamente la captura que mandó el cliente.
- **La queja se midió, no se interpretó.** De la primera pastilla al pie de la foto
  había **1227px a 768x1024 y 1238 a 1023x900**, o sea el control y su resultado no
  entraban juntos en ninguna pantalla de tablet. Ahora **836px en los dos**, que sí
  entra — y las 7 pastillas caen **en UNA sola fila** (en teléfono son 2). La sección
  baja de 1768 a **1489px** a 768.
- **La lista rayada no está mal: está mal EN UNA COLUMNA.** Sigue siendo el
  tratamiento de ≥1024, donde el picker vive en su propia columna AL LADO del modelo
  y las dos cosas se ven a la vez. Apilada no puede.
- **El razonamiento del `:hover` ya era cierto para tablet**: una tablet es táctil, y
  en táctil el hover queda latcheado después de un tap — la fila recién tocada se veía
  seleccionada al lado de la selección real. Sólo la query estaba equivocada.
- ⚠️ **Se hereda el centrado del teléfono** (H2, lede y fila de pastillas), o sea la
  tablet pasa de título rangeado a la izquierda a composición centrada. Es lo que pide
  "usá el tratamiento de mobile", y es coherente con el modelo, que en una columna ya
  estaba centrado. Si el cliente lo quiere a la izquierda en tablet, son dos reglas.
- **Medido a 390 / 768 / 834 / 1023 / 1024:** teléfono **idéntico** al build anterior
  (669px de span, 2 filas de pastillas) y **1024 idéntico también** (lista, dos
  columnas, 482px) — el cambio sólo toca la banda intermedia. Objetivo táctil mínimo
  **44px**, sin scroll horizontal en ninguno. Click real en tablet: la pastilla cambia
  la foto (`polo-front` → `winterjacke-front`), queda **exactamente una** con
  `aria-pressed="true"`, y el toggle de pose sigue funcionando (`winterjacke-angled`).
- **`js/outfits.js` no se tocó** — no sabe nada de anchos, y no tuvo que saberlo.

**2026-08-14 — LOS 5 EINSATZGEBIETE SIN PÁGINA PASAN A PASTILLAS Y AL MAPA**
(cliente, Change Request 8: "must not just be listed as plain text below — render
them as pills AND mark them on the map… they get no own city pages (render without
links), but they must be visible"). Hof, Kronach, Kulmbach, Lichtenfels, Schwandorf.

- ⚠️ **REVIERTE la nota del 2026-08-05 que decía "Kept a plain `<p>`, not pills: a
  pill reads as tappable, and none of these are".** La objeción no se ignoró, se
  resolvió: **ahora SÍ son tappables** — cada una es un `<button>` que lleva el mapa
  a su propio contorno, exactamente el precedente del toggle "Alle", que es la
  pastilla sin página que este sitio ya tenía. **Lo que ninguna es, es un link.**
  Si alguna vez una consigue página, sube a la lista enlazada de
  `partials/coverage-chips.html` y se lleva su entrada del footer.
- **El lead-in se queda como frase** ("Außerdem im Einsatz in:"), así el texto
  crawleable sigue leyéndose como prosa y no como cinco sustantivos sueltos.
  `.coverage__mentions` ahora estiliza SÓLO esa línea.
- **Los 4 contornos que faltaban se bajaron una vez de Nominatim**, mismo proceso
  verificado que los diez: polígono de CIUDAD, nunca el "Landkreis" homónimo
  (los cuatro tienen uno), confirmado comprobando que el polígono **contiene** las
  coordenadas del pueblo — es el chequeo que el incidente de Fürth dejó como regla.
  Hof ya tenía el suyo desde julio.
  ⚠️ **A diferencia de los diez, estos cuatro van SIMPLIFICADOS** (Douglas-Peucker,
  10 m — menos de un píxel de pantalla al zoom 13, que es el tope al que se dibuja
  una ciudad sola): **266 KB crudos → 60 KB**, y la vista "Alle" los baja todos de
  entrada. Re-bajarlos a full detail sólo si el mapa alguna vez pasa de zoom 13.
- ⚠️ **Schwandorf es el único fuera de Franconia** (Oberpfalz), así que su polígono
  cae afuera del wash de `franken.geojson`. Es correcto — el H2 dice "in Franken und
  ganz Bayern" — y **no costó zoom**: medido contra el build anterior, la vista
  "Alle" queda en **tileZoom 8 y la distancia Bamberg↔Nürnberg en 128px, idénticas**,
  porque el anillo de la región ya fijaba los bounds.
- **Medido a 1440 / 768 / 390:** 15 marcadores y **15/15 dentro del viewport del
  mapa**, 16 pastillas (10 `<a>` + 6 `<button>`), click en una mention actualiza el
  overlay, deja `aria-pressed="true"` y **exactamente una** pastilla activa, sin
  scroll horizontal. En teléfono el desplegable de `js/coverage-select.js` los toma
  solo (11 → **16 entradas**, mínimo 44px de target) — no necesitó una línea de JS.
- **Ni una regla de CSS nueva**: las pastillas nuevas consumen `.coverage__pill` tal
  cual, que es lo que hace que se lean como el mismo sistema.

**2026-08-10, MISMO DÍA — LA BANDA NAVY: MÁS ALTA Y CON EL CELESTE PEGADO A LOS
BORDES** (cliente: "me gustaría que el azul navy tenga más height y que el celeste
esté más contra los bordes, o sea que esté bien en los límites").

- ⚠️ **EL DIAGNÓSTICO ERA ARITMÉTICO, y explica por qué la banda se veía celeste en
  vez de navy:** la sección medía 780px con una rampa de **340px desde LOS DOS
  extremos**, así que los dos degradados casi se tocaban — quedaban ~100px, el 13 %,
  de navy sin iluminar. La banda entera leía azul.
- **Rampa comprimida a 190px** (knee 80, era 150/340) y **+128px de alto**
  (`--space-8` arriba y abajo). Medido con un perfil de luminancia bajando la banda:
  borde `rgb(23,64,99)` → decae → **plano `rgb(0,9,31)` de y=200 a y=720**, o sea
  **528px de núcleo navy puro (58 %)** contra los 100px de antes, y vuelve a subir al
  borde inferior. El celeste queda confinado a los ~190px exteriores de cada lado.
- ⚠️ **ES LA ÚNICA DESVIACIÓN DE LOS VALORES LITERALES DE `.service-risk`**, y el
  primer stop NO se puede tocar: **`0.38` en el borde tiene que quedarse en 0.38**
  porque el tile de `.pixel-seam--navy` es un #00091F + celeste 0.38 plano, o sea está
  casado con el borde ILUMINADO de esta banda. El knee y el final se mueven libres.
  Verificado al píxel: borde inferior de la banda `rgb(23,64,99)` y el tile compone
  exactamente `rgb(23,64,99)`.
  ⚠️ **Nota de medición, mía:** una primera sonda leyó `rgb(17,50,81)` en el borde y
  parecía un desajuste — estaba muestreando ~30px arriba por redondeo de la posición
  de scroll, no 2px. Con la rampa ahora comprimida esos 30px valen mucho más que
  antes. **Medir el borde a 1px, y con los tiles del seam ocultos.**
- **El padding superior necesita DOS clases**: `.pixel-seam + .section` de
  page-service.css también es (0,2,0), así que `.uu-inno` sola empataba y perdía. Los
  200px de banda no son opcionales; sólo el extra es de esta sección.
- **Ganancia lateral: el contraste de los iconos MEJORÓ.** Ahora caen sobre el navy
  profundo `rgb(0,9,31)` en vez del `rgb(8,28,55)` iluminado → el celeste del CTA mide
  **6,39:1** (era 5,47) y los labels blancos **19,83:1**.
- ⚠️ **Costo, dicho en números:** la tinta de la sección baja de 53 % a **45 %** (mismo
  contenido en una caja más alta) y la página pasa de 8.297 a **8.425px** a 1440. Es
  exactamente lo que se pidió; si algún día molesta, la palanca es el
  `padding-bottom`, no la rampa.
- **Medido a 320 → 1920:** sin scroll horizontal, los 8 seams con sus tiles, un solo
  `<h1>`. El núcleo navy nunca baja de 505px (a 1200, el ancho donde la tira pasa a 5
  columnas y la sección es más compacta). Sin JS y con `prefers-reduced-motion` la
  banda mide lo mismo y los 8 seams construyen 0 tiles.

**2026-08-10, MISMO DÍA — EL BORDE FÜHRUNG → VERSPRECHEN ES UN GLOW SEAM, NO PÍXELES**
(cliente, después de ver el pulso: "no me gustaron los píxeles […] quiero algo smooth").
Se le pasaron cuatro opciones por texto y eligió ésta.

- ⚠️ **POR QUÉ EL PULSO NO ERA LA HERRAMIENTA ACÁ.** Un dissolve de píxeles pixela un
  color para revelar OTRO, y los dos lados de este borde son el mismo negro, así que el
  tile coincide con ambos. `--pulse` lo esquiva haciendo los tiles BLANCOS, que es
  justamente por qué se leía como parpadeo y no como disolución. Sigue siendo correcto
  en el borde del footer (una despedida breve al final); es equivocado a mitad de página.
- **La solución NO tiene elemento: son dos gradientes de fondo en los bordes que se
  miran** (`.uu-lead` con `to top`, `.uu-promises` con `to bottom`), que juntos arman un
  solo lift suave centrado en la línea. **Es la misma idea de luz-en-los-bordes que la
  banda navy una sección más abajo**, así que la página tiene UN vocabulario de borde en
  vez de dos compitiendo.
- **Tres cosas que gana por ser background y no un overlay posicionado:**
  · **cuesta 0px de layout** — un gradiente tenue va bien detrás de texto, al contrario
    que una banda de tiles, así que se fueron los 200px que reservaba
    `.pixel-seam + .section`: `.uu-promises` volvió de 296 a 96 de padding-top y la
    página bajó de 8.425 a **8.225px**;
  · un background pinta DETRÁS del contenido solo, sin juegos de z-index y sin riesgo de
    teñir el H2 (verificado: sigue en `rgb(255,255,255)`);
  · **nada anima**, así que no hay estado intermedio que se congele y sin JS / con
    `prefers-reduced-motion` es idéntico, sin tratamiento especial.
- ⚠️ **Los dos primeros stops tienen que ser IGUALES** — son las dos mitades de un mismo
  glow. Verificado con un perfil de píxeles cruzando el borde: sube simétrico
  `rgb(1,1,1)` → `rgb(9,22,30)` y baja igual, y **a −2px y +2px mide 9,22,30 contra
  9,21,29**, o sea sin escalón donde justamente tiene que ser invisible.
- **El 0.14 del borde se ELIGIÓ COMPARANDO, no a ojo:** renderizado a 0.09 / 0.14 / 0.20
  sobre este borde exacto y mirado. 0.09 pica en `rgb(6,14,19)` y no se lee — o sea no es
  mejor que borrar el seam; 0.20 (`rgb(12,31,42)`) empieza a leerse como BANDA de color y
  no como costura. 0.14 pica en `rgb(9,22,30)`: inequívocamente una transición, y
  contenida.
- **Seams 8 → 7.** El pulso del footer sigue auto-detectándose y no se tocó.
- **Medido a 320 → 1920:** sin scroll horizontal, glow presente en los dos lados en
  todos los anchos, un solo `<h1>`. Sin JS y con reduced motion: glow presente, 0 tiles
  en los 7 seams y los 6 marcadores intactos.

**2026-08-10, MISMO DÍA — [SUPERSEDIDO EL MISMO DÍA, ver arriba] SEAM DE PULSO ENTRE FÜHRUNG Y VERSPRECHEN: DOS SECCIONES
NEGRAS AHORA SÍ TIENEN TRANSICIÓN** (cliente: "hacéme una transición de píxeles
blancos como hicimos cuando tenemos dos secciones negras").

- ⚠️ **ESTO SUPERSEDE page-conventions §9.2 PARA ESTE BORDE.** Esa regla dice que dos
  secciones del mismo color no llevan seam, y el motivo era correcto: un tile de wipe
  ahí es del mismo color que los dos lados, así que termine como termine no se ve
  nada. `--pulse` es la respuesta que el sitio ya encontró para exactamente ese caso —
  tiles blancos que suben y vuelven a bajar mientras la ventana de scroll los pasa, en
  vez de quedar latcheados. **La regla vieja no está mal, está incompleta: sin seam
  cuando NO hay modo pulso disponible.**
- ⚠️ **HACEN FALTA LAS DOS COSAS, y cada una sola no sirve:**
  · **la CLASE `pixel-seam--pulse`** es lo que la CSS mira para el tile blanco, su
    `opacity: 0` por defecto y la transición;
  · **el ATRIBUTO `data-pixel-seam-mode="pulse"`** es lo que cambia el TIMING del
    script. `js/pixel-transition.js` **auto-detecta este caso sólo en el ÚLTIMO seam**
    (main → footer), donde los dos lados pintan su propio fondo opaco y la comparación
    es exacta; en cualquier otro borde hay que declararlo, que es justo para lo que
    ese atributo existe. Un seam con la clase pero sin el atributo correría el wipe
    normal — tiles blancos latcheando entre dos negros, o sea el bug al revés.
- **Verificado que el pulso realmente sube y baja** (el riesgo era dejar tiles
  congelados encendidos en un extremo): recorriendo su rango, tiles encendidos
  **0 → 0 → 40 → 73 → 73 → 72 → 35 → 3**, y capturado en el pico. El seam del footer
  sigue auto-detectando su propio pulso: **8 seams, 2 de pulso**.
- **Costo: la sección siguiente reserva la banda** (`.pixel-seam + .section` →
  `--space-9 + 200px`, medido 296px), así que la página pasa de 8.097 a **8.297px** a
  1440. Es el precio obligatorio: sin la reserva los tiles caerían sobre contenido real.
- **Ritmo de color, 8 seams:** hero ▪ · Geschichte ▫ · Führung ▪ · **pulso** ·
  Versprechen ▪ · Zertifikate ▫ · Innovation ▰ · Team ▫ · Formular ▪ · pulso → footer.
- **Medido a 320 → 1920:** sin scroll horizontal, los 8 seams construyen tiles en
  todos, un solo `<h1>`. Sin JS y con `prefers-reduced-motion`: **0 tiles en los 8**,
  que es el contrato — el div va vacío en el markup y el script no construye nada.

**2026-08-10, MISMO DÍA — INNOVATION PASA A BANDA NAVY Y LOS CINCO SISTEMAS SALEN DE
LA FRASE CORRIDA; EL HERO GANA SU TRUST BAND.** Salió de una revisión pedida por el
cliente ("qué te parece esta sección, agregarías alguna imagen, o algo que veas
flaqueando"), medida en vez de opinada: la sección de Innovation era la más vacía de
la página con **37 % de tinta** y el hero el único del sitio sin foto NI trust band.

- **Innovation: banda NAVY** (cliente: "estaría bueno que esté el navy blue porque eso
  lo asociamos a innovación"). Valores **literales** de la banda Konzept del homepage
  y de la Risiko de `/werkschutz/` — #00091F iluminado por el celeste al
  0,38 → 0,16 → 0 en los primeros y últimos 340px — copiados, no re-derivados, así que
  las tres son UNA superficie. **Es la tercera superficie de la página** (negro /
  blanco / navy), que es lo que la saca de ser una alternancia de dos colores a lo
  largo de 10 pantallas.
  - ⚠️ **El seam de abajo pasó a `.pixel-seam--navy`** — ni negro ni un navy plano: los
    últimos 340px de la banda están iluminados, así que un tile plano se lee como "dos
    navies". Es el bug que `/werkschutz/` ya pagó una vez; el modificador ya existía.
  - ⚠️ **Sin `data-nav-theme="light"`**: navy es superficie oscura, el header conserva
    su nav blanco.
- **Los cinco sistemas son cinco items, no una frase.** El draft los escribe en una
  sola línea corrida, que es lo que dejaba la sección vacía y enterraba cinco productos
  nombrados a mitad de oración (pérdida real de GEO: un motor de respuestas extrae
  mucho mejor cinco items que una enumeración interna).
  ⚠️ **ES UNA EDICIÓN DE COPY Y NECESITA EL OK DE CHRIS.** Verificado reensamblando
  los cinco labels + el lede y diffeando contra el docx: **las únicas diferencias son
  las tres que se anotaron** — `cloud-basierte` → `Cloud-basierte`, `monatliche` →
  `Monatliche`, y `ein direkter` → `Direkter` (cae el artículo para que los cinco se
  lean como labels paralelos), más el `und` y la raya que unían la enumeración. **Cero
  palabras agregadas, ninguna otra cambiada.** El `[ERGÄNZEN: ggf. Screenshots/Namen
  der Systeme nach Freigabe]` del propio draft sigue abierto y ESTA es su sección.
  - **Iconos: cuatro ya estaban y uno se dibujó.** `#icon-route` es literalmente una
    ruta con un marcador por checkpoint, `#icon-calendar` carga el "monatlich",
    `#icon-document-check` el Wachbuch y `#icon-agree` el canal de feedback.
    **`#icon-cloud` es nuevo**, y a propósito es una nube PELADA: con flecha diría
    "subir", que es otra afirmación. Dimensionado para abarcar y ≈ 5→18 y no el medio
    de la caja — dibujado más chico renderizaba visiblemente más liviano que sus
    hermanos de la misma fila; comparado renderizado a 24 / 40 / 56px contra
    `#icon-calendar` antes de elegirlo, no juzgado por el path.
  - ⚠️⚠️ **LOS CINCO ICONOS SALIERON COMO MANCHAS NEGRAS EN EL PRIMER RENDER**, y es la
    trampa del `<use>` que este archivo ya documenta tres veces: el
    `fill: none; stroke: currentColor` del sprite vive en su `<g id="icon-defs">` y NO
    sobrevive al `<use>`. Hay que restatearlo en CSS, siempre.
    Y el trazo va en **1.05, no 1.5**: `stroke-width` está en unidades de usuario sobre
    un viewBox de 24, así que a 40px un 1.5 renderiza 2,5px — 1,75 × 24 / 40 = 1,05 da
    el peso óptico de 1,75px que usa el resto de los iconos de 40px del sitio.
  - ⚠️ **CINCO ITEMS NO ENTRAN EN NINGUNA GRILLA**: 3 columnas deja dos huérfanos, 2
    deja uno — el mismo bug de fila abandonada que tenían las seis promesas en cuatro
    columnas. El último item **abarca la fila completa** por debajo del corte de
    5-en-línea, que es el arreglo que ya usa la tira de cinco de la página de ciudad.
    **5 en línea sólo desde 1200px, y es medido**: "Wächterkontrollsystem" son 21
    caracteres y por debajo de ese ancho un quinto de la columna no lo sostiene sin
    apoyarse en hyphenación en todos los labels.
  - **Contraste muestreando el píxel real del render** (no razonando sobre el token):
    el backdrop donde caen los iconos es `rgb(8,28,55)` → el celeste del CTA mide
    **5,47:1**, y en el peor caso (el tope iluminado de la banda, `rgb(23,64,99)`)
    **3,46:1** — son gráficos, piden 3:1. H2 y lede **10,75:1**, labels **8,41:1**.
  - **Tinta 37 % → 53 %**, sección 724 → 780px. Honesto: cinco labels de tres palabras
    no llenan una pantalla. El resto sale de las screenshots del `[ERGÄNZEN]` cuando
    lleguen, o de aceptar que esta sección no tiene que medir una pantalla.
- **El hero gana la TRUST BAND, sin un archivo nuevo.** Era el único hero del sitio sin
  foto ni banda de confianza, en la página cuyo tema es justamente si confiar en la
  empresa. Es el bloque de `/jobs/` con sus assets ya presentes: la píldora de Google
  con **4,7 / 97** (la única cifra confirmada por el cliente) y los dos sellos DEKRA
  reales, que esta página ya renderiza más abajo. **Tinta 52 % → 63 % y el hero NO
  creció** (685px, la banda entró en el aire que ya tenía).
  - ⚠️ **PRIMERO LO ESCRIBÍ CON LAS CLASES DEL HOMEPAGE Y EXPLOTÓ.** `.hero__badges` /
    `.hero__badge` viven en **page-home.css, que esta página no carga**, así que los dos
    sellos salieron a su tamaño intrínseco de 399x600 y **el hero pasó de 685 a
    1687px**. Los nombres del chasis son `.service-hero__badges` / `.service-hero__seal`.
    El wrapper conserva **las dos** clases a propósito: `.hero__trust` es la que anima
    `js/hero-reveal.js`, `.service-hero__trust` la que la estiliza.
  - Va DESPUÉS de las acciones, que es el orden documentado del homepage
    (H1 → lede → CTA → trust) y el orden en que ese script anima los cuatro bloques.
- ✅ **Se cerró el pendiente del seam del footer que quedó anotado la pasada anterior**,
  y no acá: otra sesión hizo que `js/pixel-transition.js` **detecte** el caso
  negro-sobre-negro en el último seam y agregue `--pulse` solo. Esta página lo hereda
  gratis — verificado, el séptimo seam computa `pixel-seam--pulse`.
- **Ritmo de color final, 7 seams, cada uno con el tile correcto:** hero ▪ · Geschichte
  ▫ · Führung ▪ · Versprechen ▪ · Zertifikate ▫ · **Innovation ▰ (navy)** · Team ▫ ·
  Formular ▪ → footer (pulse).
- **Medido a 320 / 390 / 640 / 768 / 900 / 1024 / 1200 / 1440 / 1600 / 1920:** sin
  scroll horizontal en ninguno, un solo `<h1>`, sin saltos de nivel, los 7 seams
  construyen tiles en todos, sellos del hero a 44px (32 en teléfono, el valor del
  chasis), y los cinco iconos con `fill: none` y trazo celeste. Sin JS y con
  `prefers-reduced-motion`: los cinco items en opacidad 1, los seis marcadores al
  100 % y los iconos correctos.
- ⚠️ **LO QUE SIGUE ABIERTO Y ES DEL CLIENTE:** la sección Team (46 % de tinta) habla
  de personas y no tiene ninguna — el draft ya pide un Team-Foto y **no existe** en el
  proyecto (todas las landscape son el hero de otra página). Hay que pedirle a Chris
  una **foto grupal horizontal, ≥1600px de ancho**. Deliberadamente **no** se puso un
  frame reservado con label entre corchetes: la sección hoy se ve intencional y un
  placeholder la haría ver inacabada — distinto del retrato de Steffen, cuya sección
  ERA sobre una persona y sin él quedaba un párrafo pelado.

**2026-08-10, MISMO DÍA — BUG PROPIO EN LOS MARCADORES DE LAS SEIS PROMESAS: LA
SEGUNDA FILA QUEDABA CONGELADA A MITAD DE PALABRA.** Encontrado midiendo al revisar
la sección, no razonando.

- ⚠️ **UN TRIGGER POR ITEM ES CORRECTO EN UNA LISTA VERTICAL Y ES UN BUG EN UNA
  GRILLA QUE ENTRA EN UNA PANTALLA.** Salió copiando el patrón de
  `js/lh-card-marks.js` (`start: "top 88%"` → `end: "top 55%"` por card), que en
  `/leistungen/` funciona porque sus once cards se aproximan y se pasan de a una.
  Acá son seis en dos filas que se ven juntas, y la fila 2 está ~330px más abajo que
  la 1: **medido en las dos posiciones donde un lector realmente para** — borde
  superior de la sección en el tope del viewport, y sección centrada — los tres
  marcadores de la fila 2 quedaban en **56 % y 43 %**, o sea resaltados cortados a
  mitad de palabra ("Erreich|barkeit", "Nachweisba|re", "100 % Ver|antwortung"). Se
  lee como falla de render, no como efecto.
- **Arreglado estructuralmente, no moviendo números: UN trigger sobre la LISTA con
  stagger de 0,12 entre los seis** (`start: "top 85%"` → `end: "top 45%"`). El rango
  termina cuando el tope de la LISTA pasa el 45 % del viewport, que ocurre bastante
  antes de que la sección se asiente — así que **cualquier posición de reposo tiene
  los seis al 100 %**, verificado en cinco posiciones. Y el stagger conserva la
  secuencia 01 → 06.
- **Verificado que sigue barriendo de verdad** (el riesgo del arreglo era que
  completara antes de ser visible): muestreando el rango, `0/0/0/0/0/0` → `47/23/0…`
  → `96/72/48/24/0` → `100/100/97/73/49/25` → los seis, con la lista visible en
  pantalla todo el tiempo. Sin JS y con `prefers-reduced-motion` siguen los seis al
  100 % y sin la clase `--live`.
- ⚠️ **La lección general, anotada en el propio archivo:** en este sitio un marcador
  scrubbeado tiene que estar COMPLETO cuando su sección queda quieta. Si el bloque
  entra entero en una pantalla, el trigger va en el contenedor con stagger; si es una
  lista que se recorre, va por item. `js/lh-card-marks.js` no se tocó — su caso es el
  segundo.

**2026-08-10, MISMO DÍA — INNOVATION PASA A NEGRA Y TEAM A BLANCA: LA PÁGINA AHORA
ALTERNA HASTA ABAJO, CON 7 SEAMS** (cliente: "haceme el fondo de esta sección negra"
sobre Innovation, "y el fondo de esta sección blanca" sobre Team). El copy no cambió.

- ⚠️ **UN CAMBIO DE COLOR CUESTA UN SEAM, y este pedido cuesta TRES ediciones de
  seam, no dos de clase.** Es la regla sobre la que está construido el ritmo de todo
  el sitio, y acá salió así:
  1. **Seam NUEVO entre Zertifikate y Innovation** — antes compartían la superficie
    blanca y el comentario del markup decía explícitamente que por eso no había
    seam. Tiles **blancos** (claro arriba).
  2. **El seam que ya existía entre Innovation y Team cambió de dirección**:
    `pixel-seam--white` → `pixel-seam`, o sea tiles **negros** (oscuro arriba).
  3. **Seam NUEVO entre Team y el formulario** — el formulario siempre es oscuro, así
    que Team en blanco crea un borde de color que antes no existía. Tiles
    **blancos**.
  El chasis ya reservaba la banda en los tres casos (`.pixel-seam + .section` da
  `--space-9 + 200px`, y **`.pixel-seam + .conversion` da 200px** — esa regla ya
  estaba en page-service.css, así que el seam nuevo antes del formulario no necesitó
  CSS). **Seams 4 → 7 dentro de la página** (6 en `<main>` más el del footer).
- **Ni Innovation ni Team necesitaron una sola regla de color propia**, y eso es la
  prueba de que el chasis funciona: Innovation sólo consume tokens, así que sacarle
  `.section--light` le devuelve todos a su valor oscuro; y Team los recibe al
  ganarla. **El `.service-link` de "Offene Stellen ansehen" tomó solo la mezcla
  profunda de azul sobre claro** — medido `color(srgb 0.273 0.45 0.67)` = **4,90:1**,
  que es exactamente el arreglo compartido que este archivo documenta después de
  haber estado roto en vivo en `/referenzen/`.
- **`data-nav-theme="light"` se movió con las superficies**: sale de Innovation,
  entra en Team. Ahora las tres claras son `.uu-story`, `.uu-zert` y `.uu-team`.
- ✅ **EL SWITCH CLARO/OSCURO DEL HEADER ESTÁ VERIFICADO EN ESTA PÁGINA, y eso cierra
  el caveat que este archivo arrastra desde julio** ("necesita eventos de scroll
  reales, `npm run dev`"). Medido con scroll real de Lenis, parando el header dentro
  de cada sección: sobre blanco (`story` / `zert` / `team`) el header toma
  `site-header--dark` con el nav en `rgb(59, 73, 86)`; sobre negro (`lead` /
  `promises` / `inno` / `conversion`) vuelve al nav blanco. **7 de 7 correctas.**
- **Ritmo final: hero ▪ · Geschichte ▫ · Führung ▪ · Versprechen ▪ · Zertifikate ▫ ·
  Innovation ▪ · Team ▫ · Formular ▪ → footer.** Führung y Versprechen siguen
  compartiendo superficie sin seam entre ellas (§9.2, dos negros no se disuelven).
- **Medido a 320 / 390 / 768 / 900 / 1024 / 1280 / 1440 / 1600 / 1920:** sin scroll
  horizontal en ninguno, los 7 seams construyen sus tiles (39 en teléfono → 240 a
  1920) **con el color correcto según la dirección en los 7**, un solo `<h1>`, sin
  saltos de nivel de heading. Contraste sobre las dos superficies nuevas: H2 y
  párrafo de Innovation **20,87:1** sobre negro; H2 de Team 20,87:1, su párrafo
  **6,03:1**, la línea de cierre **4,60:1** y el link **4,90:1** sobre blanco.
  Sin JS y con `prefers-reduced-motion`: 0 tiles en los 7 seams (son decoración) y
  las dos superficies correctas igual.
- ⚠️ **PENDIENTE PRE-EXISTENTE, encontrado midiendo y NO tocado porque es otra
  decisión:** el seam del footer tiene tiles **negros** entre el formulario (negro) y
  el footer (negro), o sea es invisible. Es exactamente el caso para el que existe
  `.pixel-seam--pulse`, que ya tienen `/referenzen/` y `/einsatzgebiete/` — y
  page-service.css dice que **un TERCER consumidor debería volverlo el default en vez
  de optar a mano una tercera vez**. Esta página es ese tercero. Decidirlo antes de
  tocarlo; no lo cambié porque el pedido era otro borde.

**2026-08-10, MISMO DÍA — LA SECCIÓN "MENSCHEN, DIE BLEIBEN" SE CENTRÓ ENTERA**
(cliente: "esto centrame", sobre el título, el párrafo y la línea de cierre "Sie
wollen Teil davon werden? Offene Stellen ansehen"). Mismo tratamiento que ya
llevan `.uu-story`, `.uu-zert` y `.uu-inno` en esta misma página.

- **Dos clases, no una** — la misma trampa de especificidad que documentan las
  otras tres: `page-service.css` estiliza `.section__intro` genérico y una sola
  clase pierde por orden de aparición. `text-align` centra el TEXTO,
  `margin-inline: auto` centra la CAJA.
- **La línea de cierre es hermana de `.section__intro`, no hija** — su propia
  regla, `justify-content: center`: como fila flex a nivel de bloque ya ocupa
  todo el ancho del container, así que lo que había que centrar era su
  CONTENIDO, no la caja.
- **Medido con un `Range` sobre los nodos de texto reales** (el rect del elemento
  miente acá, porque el h2 lleva `max-width`): título, párrafo y línea de cierre
  a **0px del eje** a 390 / 768 / 1024 / 1280 / 1440 / 1600 / 1920, sin scroll
  horizontal en ninguno.

**2026-08-10, MISMO DÍA — "SECHS VERSPRECHEN" DEJÓ DE SER `.lh-why*` Y PASÓ A SER
`.uu-promises*`: 3×2, numeradas y con el mismo subrayado de fondo que ya usa el
resto del sitio** (cliente: "esto me gustaría hacerlo más lindo, más dinámico
también, subrayá lo importante con el subrayado que se repite en la web, de
subrayar el fondo… dividirlo en 3 y 3 o una lista de items, no sé, vos sé
creativo"). Ni una palabra de copy cambió — mismos seis títulos, mismas seis
frases.

- **`.lh-why*` era la causa real del problema, no sólo el estilo.** Ese bloque es
  de `/leistungen/` y está armado para SUS cuatro columnas; con seis promesas
  dentro de una grilla de 4, la última fila quedaba con dos items sueltos bajo dos
  columnas vacías — exactamente lo que se veía en la captura del cliente. La
  solución no era ajustar el grid: era que esta página deje de pedir prestado un
  bloque ajustado a otro contenido y tenga el suyo propio, **`.uu-promises*`**, en
  `css/page-ueber-uns.css`. `page-leistungen.css` se queda cargada igual —
  `.lh-hero__badge` del hero de esta misma página todavía lo usa.
- **3 arriba y 3 abajo, literal** (el "3 y 3" que pidió el cliente): `<ol>` a tres
  columnas desde 900px, dos desde 640, una en el teléfono. Es un `<ol>` y no un
  `<ul>` porque ahora los seis llevan un numeral 01–06 visible — mismo criterio
  que ya aplica en el resto del sitio (el numeral visible es lo que obliga al
  `<ol>`, no al revés).
- **El subrayado ES el mismo mecanismo de `.lh-card__mark`**, valores copiados y
  no re-derivados: un `background-image` recortado a las palabras del título, que
  crece de 0 a 100% de ancho con el scroll. Nuevo `js/uu-promise-marks.js`, una
  segunda copia de `js/lh-card-marks.js` en vez de un módulo compartido —
  siguiendo la convención del proyecto de no generalizar hasta el tercer
  consumidor, anotado en el propio archivo para cuando llegue ese tercero.
  ⚠️ **Mismo contrato sin JS que todo el resto del sitio: el fill nace LLENO**
  (`background-size: 100% 100%`) y sólo el script lo pone en 0 y lo maneja por
  `--mark`, agregando `.uu-promises--live`. Verificado en los tres estados: carga
  normal arranca en `0% 100%` y crece con el scroll real; con
  `prefers-reduced-motion` y sin JS los seis quedan **ya marcados**, `100% 100%`,
  sin la clase `--live` en ninguno de los dos.
- **Relleno: la misma mezcla profunda que `.lh-card__mark`** (`color-mix` de
  blue-dark al 85% con `--color-logo-black`, texto blanco encima) — verificado
  renderizado, ~`#4673AB`, el mismo 4,88:1 ya documentado en el resto del sitio
  para blanco sobre esa mezcla.
- **Ya no son cards.** La sección no tenía otra grilla de cards con la que
  competir (a diferencia de `/leistungen/`, donde el "ruled, not carded" existe
  justamente por eso), así que en vez de pedir prestado un tratamiento de tarjeta
  de otra página se armó una grilla de líneas: hairline vertical entre columnas
  (`:not(:nth-child(3n))`) y hairline horizontal entre las dos filas
  (`:nth-child(n + 4)`), sólo desde 900px. Se lee como una tabla editorial de
  hechos, no como seis cajas.
- **El numeral es ritmo, no información**: `aria-hidden`, tabular-nums, peso 300,
  el mismo celeste — el `<ol>` ya los cuenta para tecnología asistiva y el nombre
  de la promesa es lo que carga el significado.
- ⚠️ **No se agregó ningún hover-lift a los items.** `data-item-reveal` apunta al
  propio `<li>` (`.uu-promises__item`), y GSAP escribe `translate/rotate/scale:
  none` inline sobre lo que anima — la trampa que ya dejó muerto el hover de
  `.city-why__item` en dos páginas y que este archivo documenta varias veces. Un
  hover con `transform` acá habría caído en la misma trampa; se dejó afuera en vez
  de repetir el bug.
- **Medido a 320 / 360 / 390 / 430 / 640 / 768 / 900 / 1024 / 1152 / 1280 / 1440 /
  1600 / 1920:** sin scroll horizontal en ninguno, tres columnas ya activas a 900,
  las seis frases idénticas a las del `.lh-why*` que reemplaza.

**2026-08-10 — LA TIMELINE DE `/ueber-uns/`: RIEL A TODO EL ANCHO, SALTOS
PROPORCIONALES A LOS AÑOS, EL CELESTE DEL CTA Y UN ARO QUE SE EXPANDE EN CADA PUNTO**
(cliente: "los puntos tienen que ir a lo largo de la screen horizontalmente… esos
textos menos width… tiene que espaciar más las distancias, porque ahora están todos a
la misma distancia y no tiene sentido, ya que además no llega a completar el width que
podría, la línea" + "usá el celeste del CTA" + "cuando vamos llegando a los puntos que
se haga un aro alrededor del bullet como lo hay en la homepage, que titila"). Ni una
palabra de copy cambió.

- **El último punto se sienta EN el borde de contenido, y eso es lo que hace que el
  riel llegue:** su track mide 0, así que el segmento del cuarto item que llega a
  `right` aterriza exactamente encima, y el item escapa de ese track
  (`justify-self: end` + un `width` explícito) con año y label alineados a la derecha
  debajo del punto. Medido: el riel termina a 4,5px del borde (el radio del punto) a
  1100 / 1152 / 1280 / 1440 / 1512 / 1600 / 1920 — antes se quedaba **241px corto**.
- ⚠️ **EL CUARTO TRACK TIENE PISO, y ése es el trade-off entero del bloque.** Todos los
  demás sólo tienen que albergar su propio label; el salto 2023 → 2024 tiene que
  albergar **el label de 2023 Y el de 2024 alineado a la derecha**, y encima es el
  span más corto. Medido: 105px (2023 envuelto) + 19 de aire + 132 (2024) = **256px =
  16rem**. Estrictamente proporcional serían 1/8 del ancho — 154px a 1440 — y **los dos
  labels se pisarían**. Así que va fijo en 16rem y el resto se reparte 2:2:3.
  **Medido a 1440: 279 / 279 / 419 / 247px** — los dos saltos de 2 años iguales, el de
  3 años claramente el más largo y el de 1 año el más corto, que es el pedido.
  ⚠️ **Sólo lee bien desde ~1300px.** Entre 1100 y 1280 el piso empata o pasa a los
  saltos de 2 años (a 1152: 207/207/310/247), y por debajo de 1100 los invertiría —
  por eso **este layout arranca en 1100 y la banda 768–1099 conserva las cinco columnas
  iguales**, con el riel quedándose corto ahí. Subir cualquier `max-width` de label
  sube ese piso; son valores medidos, no redondos.
- ⚠️ **EL CAP DE LOS LABELS ES LO QUE HACE SEGURO APAGAR LA HYPHENACIÓN, y hacía falta
  apagarla.** base.css pone `hyphens: auto` en todo `li` — correcto para prosa,
  equivocado para cinco labels de cuatro palabras: **renderizaba "größter Sicher- /
  heitsdienst" y "prak- / tisch von null wie- / der aufgebaut"**, o sea partía el
  keyword propio de la página y se leía como falla de render. Con los cortes sólo en
  espacios ningún label desborda **porque su palabra más larga entra en el cap**:
  8.25rem = 132px es el cap más angosto que todavía deja "Sicherheitsdienst" (130px
  medidos) en una línea. En la banda 768–1099 una columna mide 115px y esa palabra NO
  entra, así que ahí la hyphenación **se queda prendida** a propósito.
- **El año pasó a `1.5rem` FIJO, y es contraste, no gusto:** #3D9AD3 mide **3,11:1**
  sobre blanco — alcanza el 3:1 de texto GRANDE (WCAG: 24px a cualquier peso) y falla
  el 4,5:1 de texto normal. `--font-size-lg` es un clamp de 21 → 25px, o sea abajo de
  1440 caía a 21px, donde ese 3,11 sería una falla real. Misma salida que
  `.combo-steps__title`. **No devolverle el clamp sin cambiar el color.**
  ⚠️ El azul se escribe `--color-blue-light` literal: la sección es `.section--light`,
  donde `--color-accent` re-resuelve a blue-dark (#5287C9). Verificado renderizado:
  punto, riel, aro y año los cuatro en `rgb(61, 154, 211)`.
- **El aro ES el del homepage** (`.pain-hook__node::after`), curva y timing copiados en
  vez de re-derivados; 2.25rem alrededor de un punto de 9px (4×, donde el homepage usa
  6× su nodo de 0.4rem). Una sola pasada de 0,9s, que es la decisión que el propio
  cliente ya había tomado ahí ("un halo que aparece una vez, explícitamente NO un pulso
  infinito").
- ⚠️ **HIZO FALTA UN HOOK NUEVO EN `js/steps-sequence.js`, y la razón es estructural:
  un timeline SCRUBBEADO no tiene "un momento" al que atar un `@keyframes`.** Ahora el
  script pone **`.is-arrived`** en el paso cuando su marcador termina de aterrizar y la
  **saca** al volver para arriba — eso último es lo que permite que el aro se repita la
  próxima vez que bajás. Está documentado en page-conventions §4.7 junto a los otros
  tres hooks. **Siempre se agrega, no es opt-in**, y es inofensivo: ninguna hoja de
  `/jobs/`, `/werkschutz/` ni `/brandwache-nuernberg/` nombra esa clase — verificado por
  grep y midiendo las tres (rieles en `--step-line: 1`, los 3 marks de brandwache en
  `100% 100%`, sin scroll horizontal).
- **El punto pasó de pseudo-elemento a elemento real** (`.uu-mile__dot` +
  `data-steps-marker`), porque el `<li>` ya gastaba su `::before` en el punto y su
  `::after` en el segmento del riel: el aro necesitaba una tercera caja.
- **Medido a 390 / 768 / 900 / 1024 / 1099 / 1100 / 1152 / 1280 / 1440 / 1512 / 1600 /
  1920:** sin scroll horizontal en ninguno, y de 1100 para arriba el aire entre labels
  vecinos **pintados** nunca baja de 48px (el cálculo del piso de arriba es de CAJAS, y
  la caja del último label llega al borde aunque su línea más larga mida 101). Sin JS y
  con `prefers-reduced-motion`: los 5 puntos en
  opacidad 1 sin transform, los 4 segmentos en `scaleX(1)`, **cero `.is-arrived` y cero
  animaciones de aro**. Con motion prendido, verificado por scroll real: los puntos
  llegan de a uno (`.....` → `A....` → `AA...` → `AAA..` → `AAAA.`), el aro corre en
  los cuatro con **183–341ms de desfase entre ellos** (o sea escalonado, no todos
  juntos), y volviendo para arriba las clases se retiran y al bajar de nuevo se
  reproduce.
- ⚠️ **Detalle visible y asumido:** "100 Mitarbeitende" (2023) envuelve a dos líneas
  mientras "50 Mitarbeitende" (2020) queda en una, porque ese label lleva un cap un paso
  más angosto (6.75rem) — son los 27px que el piso del cuarto track necesita. Es el
  precio de que el salto de 1 año sea el más corto.

**2026-08-10 — `/leistungen/` REDISEÑADA ENTERA (brief del cliente).** El pedido fue
explícito: "do not just cosmetically improve the current cards" — el hero se sentía
vacío, las 11 cards tenían todas el mismo peso, "Mehr erfahren" se repetía once
veces y nada ayudaba a entender QUÉ tipo de servicio necesita el visitante. La meta
de IA que fija el brief: la página deja de decir "acá hay 11 servicios" y pasa a
decir "primero entendé qué problema tenés, después elegí". **Ni un servicio salió y
ninguna descripción se reescribió.**

- **La estructura nueva es hero → orientación → 3 capítulos → CTA**, con el hero y
  la capa de orientación sobre el MISMO negro y sin seam entre ellos, así que se
  leen como una sola composición (y de paso la página ya no abre contra un muro
  blanco de cards). Ritmo: hero ▪ · Orientierung ▪ · Kapitel ▫ · Keyword ▪ ·
  Warum ▪ · FAQ ▫ · Formular ▪ → footer. **5 seams, los mismos de antes.**
- ⚠️ **`.hub-*` NO SE TOCÓ, y es la decisión más importante del rediseño.** Ese
  bloque vive en el chasis y **`/einsatzgebiete/` monta TODO su journey de mapa
  encima** (`.eg-journey__panel` extiende `.hub-tile`). Restilar `.hub-tile` habría
  rediseñado la página de ciudades en silencio. Las cards nuevas son `.lh-card`,
  page-scoped.
- **El hero pasa de una pantalla a ~70svh.** Primero se armó a dos columnas (copy
  izquierda, las tres familias en escenas isométricas a la derecha); **ese layout
  duró unas horas** — ver la pasada del hero con foto más abajo, que es el estado
  actual. Las escenas siguen en la página, ahora dentro de los selectores de
  orientación. La geometría se **genera**, no se escribe a mano —
  `docs/design-sources/leistungen-families.py`, proyección dimétrica 2:1 de
  coordenadas 3D reales con viewBox ajustado a lo dibujado, misma receta que las
  escenas del Risiko.
  - Las tres comparten escala de coordenadas (~21 unidades) **a propósito**: es lo
    que permite que un solo `stroke-width` en unidades de usuario les dé el mismo
    peso óptico. Una escena nueva a otra escala necesita su propio valor.
  - 01 es un edificio permanente con un anillo de ronda CERRADO que le pasa por
    detrás (oclusión real, con caras rellenas del color del hero); 02 son paneles
    de valla sueltos con una ruta **ABIERTA y con topes** — abierto contra cerrado
    es lo único que separa "permanente" de "temporal" en un dibujo; 03 es el plano
    con la cámara y su cono de visión.
- ⚠️ **UN SOFT HYPHEN, y el arreglo obvio no funcionaba.** "Sicherheitsdienst-
  leistungen" mide **611px** al H1 de 52px, y la columna de copy quedaba en 597 →
  el H1 partía **dentro de la palabra**, sin guion ("Sicherheitsdienstleistunge /
  n"). Se corrigió el split a 1.1fr y el gap a 64px (643px, entra a 1440+) y se
  metió un `&shy;` para los anchos menores. **El `&shy;` era completamente inerte:
  base.css pone `hyphens: none` en todos los headings y `none` suprime también los
  soft hyphens.** Hace falta `hyphens: manual` en ese h1 — restaura exactamente un
  comportamiento (cortar donde el autor puso el `&shy;`) sin habilitar
  hyphenación automática. Verificado renderizado: a 1280 corta como
  "Sicherheits- / dienstleistungen / im Überblick".
- ⚠️⚠️ **HALLAZGO SITEWIDE QUE INVALIDA UNA NOTA "VERIFICADA" DE ESTE ARCHIVO:
  GSAP escribe `translate: none; rotate: none; scale: none;` INLINE**, no sólo
  `transform`. Así que el workaround documentado el 2026-08-09 ("usá `translate` en
  vez de `transform` para el hover") **tampoco funciona** — el inline gana en las
  dos. La prueba vieja pasó porque puso el transform inline a mano en vez de
  dejárselo a GSAP. **El hover de las cards de Warum de `/sicherheitsdienst-
  nuernberg/` y `/brandwache-nuernberg/` está muerto hoy** (medido con puntero
  real: el borde cambia, la card no se mueve). Ver la corrección anotada en esa
  entrada. **La solución que sí funciona, y la que usa esta página: que
  `data-item-reveal` apunte al `<li>` envolvente**, no a la card — GSAP anima el
  wrapper y la card conserva sus propias propiedades de transform. Verificado con
  `Input.dispatchMouseEvent` real: la card sube de 236 a 232px, la flecha se
  desplaza 5/-5, la sombra crece, y todo vuelve al salir.
- **Tres pesos de card, una sola familia**: `--featured` (Objektschutz y
  Werkschutz, los dos estratégicos), base, y `--compact` para el capítulo de tres.
  Difieren **sólo** en padding, escala tipográfica y tamaño de icono — mismo borde,
  radio, sombra, hover y estructura. Medido a 1440: títulos **30 / 26 / 23px**,
  alturas 360 / 284 / 281. ⚠️ El tier compact **no usa `--font-size-lg`**: ese token
  da 25px contra los 26 del base, o sea un tier que cuesta una regla y se lee como
  un accidente de render.
- **"Mehr erfahren" desapareció de las once cards.** La card entera es el link y la
  flecha azul de 28–32px dice lo mismo sin repetir tres palabras once veces.
- **Los 11 iconos existen ahora**, lo que cierra el 🔴 que esta página arrastraba
  desde ayer: **7 símbolos nuevos en el sprite** (key, flame, crane, crowd, bag,
  camera, plan) más los 4 que ya servían. Tres se rehicieron después de mirarlos
  renderizados a 60px: la grúa se leía como una **horca** hasta que se le pusieron
  los tensores del ápice, la multitud eran tres puntos flotando hasta que ganó la
  valla, y la cámara tenía una base que la hacía parecer un trípode de fotografía.
- ⚠️ **El único copy nuevo de la página son las tres frases de la orientación**, y
  cada sustantivo sale de las descripciones que ya están abajo (Bestreifung,
  Pforte, Verschlussrunden / Heißarbeiten, Baufortschritt, Veranstaltungen /
  Videoüberwachung, Alarmverfolgung, Maßnahmenplan). **Y un cambio de H2 en el
  cierre:** era "Welche Leistung brauchen Sie? Wir beraten Sie kostenfrei", que tras
  el rediseño era la tercera vez que la página hacía la misma pregunta — ahora es
  "Sie sind nicht sicher, welche Leistung passt?", que es la **propia frase
  siguiente del draft**, promovida desde el lede que va justo debajo. Las dos cosas
  anotadas para Chris en la checklist.
- **La sección de servicios reserva menos aire tras el seam**: el chasis pone
  `--space-9 + 200px` = 296px y **200 de eso es la banda de disolución**, que no
  puede achicarse (los tiles pintan ahí). Lo que se fue son los 96px de ritmo
  apilados encima → **232px**. Page-scoped; el resto del sitio mantiene el valor
  del chasis.
- **Medido a 320 / 390 / 768 / 900 / 1024 / 1280 / 1440 / 1600:** sin scroll
  horizontal en ninguno, un solo `<h1>`, sin saltos de nivel, 5 seams, FAQ visible
  ↔ `FAQPage` **3/3 byte-idénticas**, y **cero fallos de contraste fuera del caveat
  sitewide del azul del CTA** (3,11:1, el mismo de todo botón primario). Ningún
  elemento nuevo baja de 44px: dentro de `<main>` los 11 targets chicos son los
  compartidos de siempre (breadcrumb, `<summary>` en escritorio, inputs, honeypot,
  checkbox de consentimiento, link de privacidad).
- **Sin JS: 4.118 caracteres de texto real en `<main>`** (antes 3.659), 30
  headings, 18 links, las 11 cards presentes, 0 elementos ocultos, 0 tiles.
- **Navegación por ancla verificada con click real**: el selector 02 lleva a
  `#leistungen-temporaer` y el capítulo aterriza a 192px del tope, o sea despejado
  del header sticky de 80. Doble mecanismo a propósito — `data-scroll-offset="-96"`
  para el camino con Lenis y `scroll-margin-top` para scroll nativo (sin JS /
  reduced motion).
- **Pasada completa de scroll (abajo, arriba y abajo otra vez) con motion prendido:**
  ningún elemento de contenido queda en opacidad <1 ni con blur en pantalla, y **0
  elementos con `will-change` en reposo**. Lo único por debajo de 1 son tiles de
  seam a mitad de disolución, que es el efecto funcionando.
- ⚠️ **Costo medido en teléfono: 9.538 → 11.300px a 390px.** El aumento es la capa
  de orientación (982px), que es justamente lo que el brief pide. Se compensó lo
  que se podía sin recortar copy — padding y ritmo de las cards, 285 → **249px**
  cada una, o sea 512px menos en la sección de servicios. **La orientación quedó
  apilada y no como tira que se desliza** (el brief admite las dos): su trabajo es
  que se vean las tres opciones a la vez, y un carrusel esconde dos detrás de un
  swipe. Si la longitud molesta, ésa es la palanca y son ~590px.
- **Lo que sigue sin verificar**, mismo caveat de siempre: el switch claro/oscuro
  del header sobre las secciones blancas necesita eventos de scroll reales
  (`npm run dev`).

**2026-08-10, MISMO DÍA — EL HERO DE `/leistungen/` LLEVA FOTO** (cliente, viendo el
rediseño: "no me gusta que no haya un hero definido"). Tenía razón y la causa era
una decisión mía: hero y capa de orientación compartían el mismo negro plano y no
había seam entre ellos, así que **el hero no terminaba en ningún lado** — seguía de
largo. Se le preguntó al cliente entre tres salidas (foto de fondo · separar las dos
superficies · seam + orientación en claro) y eligió la foto.

- **Las tres escenas isométricas BAJARON a los selectores de orientación**, y eso
  arregla algo que ya estaba mal: decían las mismas tres cosas que los selectores,
  a una pantalla de distancia. Ahora cada selector es dibujo + numeral + título +
  frase + flecha, que es lo que lo convierte de bloque de texto en algo que merece
  llamarse selector de capítulo. El hero se queda con una sola columna de copy.
- ⚠️ **`.lh-hero__bg` VA COMO HIJO DIRECTO DE LA SECCIÓN, nunca del
  `.service-hero__grid`.** El chasis pone `position: relative` en ese grid, así que
  un `inset: 0` adentro resuelve contra la caja del GRID, no de la sección — la
  primera versión salió como **una banda a media altura CON EL COPY DETRÁS**, porque
  un absoluto también pinta por encima del contenido no posicionado de sus
  hermanos. Los dos síntomas, un solo error.
- ⚠️ **TODO va scopeado a `.lh-hero--photo`, y no es prolijidad:** otra sesión hizo
  que **`/einsatzgebiete/` cargue `page-leistungen.css` y su hero lleve `.lh-hero`**
  (`service-hero lh-hero eg-hero`). Cualquier cosa puesta en la clase pelada
  restilaría esa página también. Ojo con esto en cualquier edición futura de este
  archivo.
- ⚠️ **FOTO INTERINA, y hay que pedirle una al cliente.** No existe una foto de hub
  de servicios en el proyecto: **todas las landscape ya son el hero de alguna
  página** (herofinal = homepage, HeroWerkschutz = /werkschutz/, ReferenzenHero,
  KarriereHero). Se usó el apretón de manos de la system-story del homepage, que al
  menos no es el hero de nadie, y su tercio izquierdo es genuinamente oscuro
  (**luminancia medida 57 contra 117 a la derecha**) — que es lo que permite que el
  wash quede liviano y las dos personas y la entrada con la marca sigan leyéndose.
  **El origen mide 1.280px de ancho, así que a 1440+ escala hacia arriba.** Cambiarla
  es un `<picture>` y tres archivos.
- **Dos washes, y el de arriba es el que hace el trabajo menos obvio:** la rampa
  horizontal deja el copy sobre oscuro y el lado derecho de la foto visible; la
  vertical arranca en 0,97 porque **la foto empieza justo debajo del breadcrumb y un
  corte horizontal duro ahí se lee como un error** — la rampa hace que la imagen
  emerja del negro de la página.
- **Contraste sobre la foto, muestreando píxeles reales del render con el texto en
  `visibility: hidden`** (no razonando sobre el CSS): a 1440 badge **8,49:1**, H1
  **18,64:1**, lede **13,13:1**, teléfono **6,40:1**; a 390, 8,40 / 18,24 / 12,88 /
  6,52.
- ⚠️ **Bug de alineación que encontró la medición en la orientación:** los tres
  viewBox tienen proporciones distintas (1,71 / 1,74 / 1,32), así que a ancho
  compartido daban tres alturas distintas y los numerales caían en tres líneas
  distintas (388 / 379 / 401). **Se dimensionan por ALTO**, y el ancho distinto no
  lo ve nadie. Y un segundo desfase de 9px salía de `align-content` en su valor por
  defecto (stretch): la columna cuyo título rompe en dos líneas tenía menos holgura
  y sus filas subían. Con `start`, los tres numerales, títulos y flechas quedan en
  **la misma y exacta**.
- Re-medido después de la foto: sin scroll horizontal a 320→1600, 5 seams, FAQ 3/3,
  cero fallos de contraste fuera del azul del CTA, sin JS **4.015 caracteres** en
  `<main>` con las 11 cards y 0 ocultos, y el `<picture>` elige bien (768w a 390,
  1280w a 1440).

**2026-08-10, MISMO DÍA — LA PÁGINA ALTERNA CLARO/OSCURO EN CADA SECCIÓN, con seam
en cada cambio** (cliente: la orientación blanca, "y que entre la hero y esta que
estén los píxeles de siempre", después Kapitel negra y Keyword blanca). Es la
consecuencia lógica de la pasada de la foto: si el hero tiene superficie propia, la
capa de orientación no puede seguir compartiéndola.

- **Orden final: hero ▪ (foto) · Orientierung ▫ · Kapitel ▪ · Keyword ▫ · Warum ▪ ·
  FAQ ▫ · Formular ▪ → footer. 7 seams**, de 5. Cada cambio de color paga su banda
  de disolución, así que la página crece ~450px a 1440 (8.098 → **8.546**) y ~290 a
  390 (11.236 → **11.524**). Verificado con la sonda: los 7 seams con **180 tiles**
  cada uno y **el color de tile correcto según la dirección** (negros bajando a
  claro, blancos bajando a oscuro), más dos capturas a mitad de disolución para
  verlo, no deducirlo.
- ⚠️ **LAS CARDS PASAN A SER EL GEMELO OSCURO, y no es gusto:** sobre negro una
  sombra casi no trabaja y **un panel blanco encandila** — es exactamente lo que ya
  había encontrado la sección de Leistungen del hub de ciudades. Ahora son relleno
  de blanco al **4,5 %** más hairline, sin sombra (no una sombra que no pinta nada).
  **La versión de panel blanco se conservó, scopeada a `.section--light`**, porque
  el mismo componente está a un flip de volver a una sección clara. El hover también
  se partió: sobre oscuro lo cargan el relleno y el borde, no la sombra.
- ⚠️ **HABÍA QUE BORRAR EL `padding-top` DE `.lh-orient`, no ajustarlo.** Esa regla
  existía porque la sección iba pegada al hero; ahora sigue a un seam, y el chasis
  reserva `--space-9 + 200px` para la banda. Las dos son (0,1,0) y esta hoja carga
  después, así que dejarla habría **tirado 200px de tiles encima del título**.
- ⚠️ **Las tres escenas isométricas tenían blanco cableado y se rompían en claro.**
  El trazo `rgb(255 255 255 / 0.9)` es **invisible sobre blanco**, y las caras de
  oclusión rellenaban con `--color-bg` — o sea **tres losas negras** en medio del
  dibujo. Ahora el trazo es `currentColor` (sigue a la sección que sea) y sólo las
  guías y las caras llevan valor por superficie. ⚠️ **`.section--light` NO
  re-declara `--color-bg`** (sólo texto, bordes y acentos), así que el relleno de
  las caras hay que nombrarlo explícitamente o se queda negro.
- ⚠️ **Los dos numerales cambian de azul según la superficie, y por contraste de
  TEXTO:** sobre oscuro `--color-accent` es blue-light (6,8:1, pasa); sobre claro
  ese mismo token es blue-dark (**3,71:1**, alcanza para gráfico pero no para los
  4,5:1 de texto), así que ahí va la mezcla profunda documentada (4,9:1). Mismo
  cuidado con `.lh-keyword__text`, que tenía blanco cableado de cuando la sección
  era oscura y ahora usa el token.
- Re-medido entero: sin scroll horizontal a 320 / 390 / 768 / 900 / 1024 / 1280 /
  1440 / 1600, un solo `<h1>`, sin saltos de nivel, FAQ 3/3, **cero fallos de
  contraste fuera del azul del CTA**, y sin JS 11 cards, **4.062 caracteres** en
  `<main>`, 0 tiles y 0 elementos ocultos.

**2026-08-10, MISMO DÍA — LOS TÍTULOS DE LAS 11 CARDS SE MARCAN CON EL SCROLL, y se
fueron los tiers de tamaño** (cliente: "que cuando vayamos escroleando se vayan
subrayando los títulos de los servicios, no subrayando línea sino el fondo como
hemos hecho en otras secciones" + "no quiero que le hagas otro tamaño a Objektschutz
y Werkschutz, mismo tamaño todas").

- **Es el MISMO marcador de `/werkschutz/`** (`.service-contrast__mark`, el que el
  cliente señaló en su captura): un fondo pintado detrás de las palabras que crece
  de 0 a 100 % de ancho, no un borde. `js/lh-card-marks.js` (nuevo, page-specific)
  anima sólo `--mark`; el relleno vive en CSS como
  `background-size: calc(var(--mark, 0) * 100%) 100%`.
- ⚠️ **El marcador está LLENO por defecto y sólo arranca en cero cuando el script
  agrega `.lh-services--live`.** Ese orden ES el contrato sin JS: sin JS, para un
  crawler o con `prefers-reduced-motion`, los once títulos aparecen ya marcados y
  nunca sin marcar. Es exactamente el bug con el que salió `.service-contrast__mark`
  la primera vez (medía `mark=0%` con reduced motion, o sea el resaltado
  desaparecía). **Verificado en los dos estados: 11 de 11 al 100 % sin JS y con
  reduced motion, y la clase `--live` ausente en ambos.**
- ⚠️ **El marcador va en un `<span>` DENTRO del h4, nunca en el h4.** Un fondo sobre
  el bloque pintaría una barra del ancho de la card en vez de abrazar las palabras.
  `box-decoration-break: clone` es lo que lo mantiene abrazándolas cuando el título
  parte en dos líneas. En "Revier- & Schließdienst" el marcador envuelve **sólo el
  nombre**: el `(Raum Bamberg)` es un `<span>` `display: block` y meterlo adentro del
  inline rompería el marcador.
- **El relleno es la mezcla profunda documentada, `#4673AB`, y con texto blanco mide
  4,89:1** — calculado a mano, porque `getComputedStyle` devuelve un
  `color(srgb 0.27 0.45 0.67)` y una sonda con regex de `rgb()` lo lee como
  casi-negro y reporta 20,95:1 (la misma trampa que este archivo ya documenta). Ese
  4,89 es lo que permite que el título siga legible incluso donde el clamp baja a
  21px, por debajo de los 24px que harían aplicable el 3:1.
- **Disparado por la CARD, no por el marcador**, que está ~200px adentro: si no, el
  barrido arrancaría bastante después de que la card ya llegó. Medido por scroll
  real: 0 % → 32 % → 91 % → 100 % por card, y las 11 al 100 % al final de la página.
- ⚠️ **SE FUERON LOS DOS TIERS DE TAMAÑO** (`--featured` y `--compact`), markup
  incluido, no dejados como modificadores muertos. **Esto revierte el punto 5 del
  brief original del propio cliente** (dar más peso a Objektschutz y Werkschutz);
  la decisión posterior manda. Medido después: las 11 cards con **un solo valor** de
  título (26px), padding (32px), icono (28px) y flecha (28px). Los capítulos se
  distinguen por cantidad de columnas, nunca por tamaño de card. **No reintroducir un
  tier sin preguntar.**

**2026-08-10, MISMO DÍA — LOS TRES ICONOS DE LA ORIENTACIÓN SON ARTE DEL CLIENTE**
(mandó `Dauerhafter Schutz.png`, `Zeitlich begrenzter shutz.png` y `Technik und
konzept.png` al Desktop). Reemplazan las tres escenas isométricas generadas acá, en
el mismo lenguaje isométrico, así que la sección no cambia de idioma visual.

- **Esta vez los nombres SÍ coincidían con el dibujo, pero igual se verificó
  abriéndolos** — es la cuarta vez que llega un lote donde podrían no coincidir, y
  ya hubo tres incidentes (`Bayernwerk.png` era Stadt Coburg, `Bayerishe.png` era la
  Landessiedlung, `FemalePointing.png` era la card de "Ein Arbeitgeber"). Mapear por
  el dibujo, siempre.
- **Van como `<img>`, no inlineados**, y por la razón que este archivo ya pagó una
  vez: los archivos traen sus propios rellenos blancos haciendo oclusión de línea
  oculta, y **ningún CSS nuestro entra en un `<img>`**, así que no hay forma de
  romperlos con una regla de color (el desastre de la card 03 del Risiko, 2026-08-05).
- **De 2,1MB cada uno a 12/14/20KB**, y el recorte importa tanto como la compresión:
  el arte sólido ocupa ~5 % del lienzo de 1536x1024 y el resto es un glow de alfa
  bajísimo, así que **hay que recortar al bbox del arte SÓLIDO, no al bbox de alfa
  distinto de cero** — ése abarca casi todo el lienzo. Después, **cuantizado a
  paleta**, que es el tratamiento que este proyecto ya usa para gráficos de color
  plano (los sellos DEKRA, 105KB → 18KB). Verificado contra el RGBA original a 112px
  y a 336px: idénticos, sin bandeo en el glow.
- ⚠️ **Caja fija con `object-fit: contain`, NO una altura compartida.** Los tres
  tienen proporciones distintas (1,52 / 1,19 / 0,96 — el de la cámara es casi
  cuadrado porque el engranaje va arriba), así que compartir sólo la altura habría
  hecho al primero una vez y media más ancho que al tercero y achicado la base del
  tercero para que entrara su torre. `object-position: left bottom` es el detalle
  que hace que la fila lea como un juego: **los tres son plintos isométricos, así que
  alinear sus BASES los para a todos en la misma línea de piso**. Medido: caja
  144x101 a 1440, los tres con el mismo bottom (406) y los numerales en una línea.
- **Se borraron `.lh-iso*` y todo `.lh-hero__family*`**, que quedaron sin markup
  (las escenas generadas y la lista de familias del hero respectivamente). El
  generador `docs/design-sources/leistungen-families.py` queda con una nota de que
  está fuera de uso: documenta el método y regenera las escenas si se las quiere de
  vuelta.

**2026-08-10, MISMO DÍA — EL CTA DE CIERRE DE `/leistungen/` NO LLEVA PANEL: NEGRO
PLENO** (cliente: "tiene un fondo que no es del todo negro, es raro el color… tiene
que ser negro"). Le había puesto un `.lh-cta`: panel con inset, radio de 24px y
**#0B0D10**, "un paso fuera del negro de la página para que el cierre lea como un
objeto". Tenía razón el cliente: **un casi-negro al lado del negro real no se lee
como elevación, se lee como una falla de render** — y la página ya tiene siete seams
haciendo la separación entre secciones, así que el panel resolvía un problema que no
existía. **Se borró el bloque entero, no sólo el relleno:** sin fill, el radio y el
inset no pintaban nada, y una regla que no se puede ver es una regla cuyo propósito
alguien tiene que adivinar después. La sección queda en `--color-bg` desde
`.conversion` (lead-form.css, intacto). Medido: `rgb(1, 1, 1)` computado y muestreado
en tres puntos del render. **No reintroducir el panel.**

**2026-08-10, MISMO DÍA — LAS TRES ESCENAS ISOMÉTRICAS REDIBUJADAS, y el H2 de Warum
centrado** (cliente: "este título centralo… y mejora el icono de la foto").

- **Las escenas 02 y 03 se redibujaron en una segunda pasada** (cliente: "mejorame
  estos iconos"), y en las dos el problema era el mismo: el dibujo no nombraba su
  idea a 58px.
  - **02 era dos rieles sobre postes y se leía como dos mesitas.** Ahora es una
    **corrida de vallas móviles con cruces de arriostramiento** — el equipo que
    todo el mundo reconoce como "temporal, y después se va" — y **la X es lo que
    sobrevive a tamaño de icono**, donde un riel liso no. Tres paneles en fila, no
    un cerco: la escena 01 es la cerrada, y el contraste entre las dos es
    justamente el par.
  - **03 era una cámara chica sobre un mástil y un plano vacío**, o sea casi todo
    cono. Ahora el plano lleva **el objeto para el que se escribe el concepto** y el
    cono aterriza sobre él, que es la idea real de esta familia: técnica planificada
    contra un sitio, no técnica sola.
    ⚠️ El objeto es un **volumen bajo, no una huella plana**: la huella compartía
    dos esquinas con el cono, las dos formas se fundían y la escena se leía como
    una lámpara sobre un plato vacío. Un sólido además **ocluye el cono por
    detrás**, que es lo que pone la cámara delante del objeto y no adentro. El cono
    ahora aterriza más ancho que el objeto de los dos lados, así que nunca comparten
    arista.
- ⚠️ **SE FUE EL PLANO PUNTEADO DE LAS ESCENAS 01 Y 02, y la razón es el tamaño real
  al que se ven.** Estos dibujos renderizan a **58px de alto** en los selectores de
  orientación, y a ese tamaño un rombo punteado es moiré, no información — además
  encajonaba al sujeto, así que el edificio se quedaba con la mitad del cuadro. El
  recorrido azul ya dice "esto es un sitio delimitado"; el plano lo decía otra vez y
  peor. La grilla de la escena 03 bajó de cinco líneas a **una cruz** por lo mismo.
- **La escena 01 ahora se lee como instalación, no como caja:** dos volúmenes (nave
  principal + anexo bajo), una **entrada** en la cara frontal y dos líneas de planta
  en la lateral. Dos masas leen "instalaciones"; un cubo solo lee "cajón".
- ⚠️ **EL ORDEN DE CAPAS ES EL ALGORITMO DE LÍNEA OCULTA, no una decisión estética,
  y me mordió al primer intento.** El renderer pinta guías → recorrido → líneas →
  **caras (que van RELLENAS)**, así que todo lo que va sobre una cara tiene que
  dibujarse DESPUÉS: la puerta y las líneas de planta quedaron invisibles bajo el
  relleno hasta que se agregó una capa `detail` posterior a `face`. Si agregás
  detalle sobre una superficie, va en `detail`, no en `line`.
- **El H2 de Warum va centrado, el contenido a la izquierda** — el mismo reparto que
  ya usan la sección Vertrauen del hub de ciudades y el FAQ de esta página. ⚠️
  `margin-inline: auto` en el **H2 mismo**, no en `.section__intro`: el chasis deja
  ese wrapper en `max-width: none`, o sea ya es de ancho completo y las auto-márgenes
  ahí no hacen nada. Es la misma trampa que la sección de keyword dos ediciones
  antes. Medido con un `Range` sobre el texto real: **0px del eje a 1440 / 1024 /
  390**, dos líneas balanceadas.

**2026-08-10, MISMO DÍA — LA SECCIÓN "WARUM FRANKONIA" DE `/leistungen/` ESTUVO SIN
NINGÚN ESTILO EN VIVO, y la causa fue OTRA SESIÓN borrando CSS compartido.** El
cliente lo vio y lo describió exacto: "me cambiaste tipografía y no usaste ningún
estilo que ya estamos usando en la web".

- ⚠️ **QUÉ PASÓ, porque es la trampa multi-sesión de este repo en su forma más
  cara.** Otra sesión migró el bloque `.lh-why*` a `/einsatzgebiete/` como
  `.eg-why*` y **borró las reglas de `page-leistungen.css` con la nota "Nothing on
  THIS page used it"** — pero `pages/leistungen.html` tiene **12 referencias** a
  `.lh-why*` en su sección 4. Sin CSS, la sección cayó al render por defecto:
  `<h3>` en peso 800 con el tracking de −1px que base.css reserva para display,
  sin grilla, sin acento. **Las dos páginas comparten `page-leistungen.css`
  (einsatzgebiete lo carga), así que antes de podar cualquier `.lh-*` hay que
  grepear LAS DOS.** Queda anotado en el propio bloque del CSS.
- **No se restauró: se rediseñó en el lenguaje de la página.** Cuatro bloques
  rayados, cada uno abriendo con **la misma regla azul corta de 3rem que usa la
  sección de keyword**, así la página tiene UN vocabulario de acento en vez de una
  invención por sección. **Rayado, no en cards**: las once cards de arriba son el
  momento "card" de la página y una segunda grilla de cards de cuatro competiría
  con ellas.
- 4 columnas desde **1100px** (el ancho que este proyecto ya midió para una fila de
  cuatro — Anwendungsfälle de `/werkschutz/` y el Warum del hub de ciudades), 2
  desde 640, una abajo. Medido a 1440: 4 columnas, los cuatro items arrancando en
  **la misma y (395)**, título 20px en **peso 400 y tracking normal** (la regla de
  design-system §2: un heading tipografiado como cuerpo toma métricas de cuerpo —
  justo lo que el fallback crudo perdía), y la regla en `rgb(61,154,211)`.

**2026-08-10, MISMO DÍA — LA SECCIÓN DE KEYWORD (Wachdienst/Wachschutz) VA CENTRADA**
(cliente: "esta sección está muy tirada ahí nomás, ¿cómo le damos un poco más de
amor? la centraría"). Era un H2 a lo ancho de un campo blanco con un párrafo pegado a
la izquierda y nada que uniera las dos cosas.

- **El párrafo se partió en DOS, y no cambió una palabra.** El corte cae en el primer
  punto del propio draft, así que la respuesta directa — los términos significan lo
  mismo, bewachung nach § 34a GewO — queda como línea grande y el resto sigue como
  prosa corrida. **Es ganancia de GEO, no sólo de layout:** esta sección existe para
  que la extraigan por "wachdienst" (880/mo) y "wachschutz" (480/mo), y los motores
  de respuesta toman la primera frase bajo el heading. **Verificado uniendo los dos
  `<p>` del build y comparando contra el docx: idéntico.**
- ⚠️ **CADA HIJO NECESITA SU `margin-inline: auto`, y me volvió a morder la misma
  trampa que documenta §6** — una caja con `max-width` dentro de un padre centrado
  centra su TEXTO y se queda pegada a la izquierda. Puse la regla para los hijos
  directos y **el H2 igual salió 219px fuera del eje**, porque va envuelto en
  `.section__intro`: es nieto, no hijo, y el chasis deja ese wrapper en
  `max-width: none`, así que las auto-márgenes en él no hacen nada. **Medido con un
  `Range` sobre los nodos de texto reales** — el rect del elemento no lo habría
  mostrado, porque lo que estaba corrido era la CAJA, no el texto adentro.
- ⚠️ **Sin hyphenación en este bloque.** base.css pone `hyphens: auto` en todo `<p>`,
  que acá es lo equivocado: una línea centrada ya tiene dos bordes irregulares, y los
  compuestos alemanes rompían como "Kontrollgän-ge" y "Kom-bination" en líneas
  centradas consecutivas — se lee como falla de render, no como tipografía. Misma
  decisión que ya toma `/referenzen/` con su copy centrado.
- El H2 se topa en **34ch** (dos líneas balanceadas a 1440 y 1024, tres a 390) y la
  respuesta lleva `text-wrap: balance` para que "nach § 34a GewO." no quede sola en
  una tercera línea. Único adorno: una regla azul de 3rem centrada arriba — es un
  gráfico, y `--color-accent` en `.section--light` da 3,71:1, que pasa el 3:1.
- Medido: H2, respuesta y párrafo **a 0px del eje** a 1440 / 1024 / 390, sin scroll
  horizontal, y el resto de la página sin cambios (7 seams, FAQ 3/3, sin JS 4.063
  caracteres y los 11 marcadores llenos).

**2026-08-09 — LOS DOS HUBS DE NIVEL NAV: `/leistungen/` y `/einsatzgebiete/`.
Es el Bloque 7 de [docs/build-checklist.md](docs/build-checklist.md), menos
`/ratgeber/`.** Copy de los `Webtext 23 Hub Leistungen` y `24 Hub Einsatzgebiete`
(Stand 04.08.2026), verbatim, alemán. **Cierran los dos 404 más enlazados del
sitio**: `/leistungen/` está en el nav de las 9 páginas más el "Alle Leistungen"
del submenú, y `/einsatzgebiete/` en el footer de las 9.

- **Puro ensamblado, otra vez, y es la prueba de que el chasis funciona:**
  `page-leistungen.css` sólo agrega el grid de tiles; todo lo demás
  (`--content-inset`, el `main h2`, el chevrón del breadcrumb, `.section--light`,
  `.service-hero*`, el bloque `.pixel-seam`) sale de `page-service.css` (§9.1) y
  el formulario de `lead-form.css`.
- **Las 11 leistungen van en TRES grupos, no como 11 iguales** (dauerhafter Schutz ·
  anlassbezogener Schutz · Technik und Konzept). Es la agrupación que el propio
  draft escribe; el markup sólo la hace visible, no reordena nada.
- ⚠️ **Los 11 tiles NO llevan icono, y es deliberado:** el sprite tiene 18 símbolos
  y sólo 5 de las 11 leistungen tienen uno que las signifique de verdad. Es la
  misma decisión que ya documenta el caso vest / "flexible scheduling": un icono
  equivocado es peor que ninguno. Queda anotado para el cliente.
- ⚠️ **TRAMPA DE MEDICIÓN NUEVA, y me hizo reportar un bug que no existía.** Mi
  sonda de contraste sube por los ancestros hasta el primer fondo opaco — eso
  MIENTE cuando el elemento es `position: absolute` sobre algo que no es su
  ancestro. En `/einsatzgebiete/` los paneles de ciudad dieron **2,94:1** (y los
  títulos **1,0:1**, o sea "texto invisible") porque componía el panel
  `rgb(1 1 1 / 0.72)` sobre la sección blanca. El backdrop REAL, muestreado del
  screenshot con el texto en `visibility: hidden`, es `rgb(7 10 12)` → **6,39:1**.
  **Para un panel translúcido, samplear píxeles; el CSS no alcanza.**
- **Medido a 320 / 390 / 768 / 900 / 1024 / 1280 / 1440 / 1600** en las dos: sin
  scroll horizontal en ninguno, un solo `<h1>`, sin saltos de nivel, 5 seams cada
  una, FAQ visible ↔ `FAQPage` **3/3 byte-idénticas**, y **cero fallos de
  contraste fuera del caveat sitewide del azul del CTA** (3,11:1, el mismo que
  publica cada botón primario). Sin JS: **3.659 caracteres de texto real en
  `<main>`** en `/leistungen/` y 2.706 en `/einsatzgebiete/`, 0 elementos ocultos,
  0 tiles. Alturas 7.252 / 9.353px a 1440.
- **Las dos entraron a `sitemap.xml` con priority 0.9**, por encima de las páginas
  de servicio y ciudad que indexan: son las únicas dos páginas que están en el
  chrome de todas las demás.
- ⚠️ **A confirmar con Chris:** el draft 23 escribe las comillas alemanas como
  `„Wachdienst"` — apertura tipográfica U+201E y cierre con comilla RECTA, no `“`.
  Se publicó verbatim (regla del proyecto); si es un typo del docx son 3
  apariciones en la sección de keyword.
- **Lo que sigue sin verificar**, mismo caveat de siempre: el switch claro/oscuro
  del header sobre las secciones blancas necesita eventos de scroll reales
  (`npm run dev`).

**2026-08-09 — PRIMERA PÁGINA COMBO: `/brandwache-nuernberg/` (servicio × ciudad).
Es el Bloque 6 de [docs/build-checklist.md](docs/build-checklist.md) y la plantilla
de las 15 restantes.** Copy del `Webtext 34 Kombi Brandwache Nuernberg` (Stand
25.07.2026), verbatim, alemán. Décima página terminada, y **cierra un 404 que la
página de ciudad enlaza TRES veces** (filas de servicio, callout de Brandwache y
FAQ). La plantilla completa está en
[docs/page-conventions.md §11](docs/page-conventions.md#11-página-combo-servicio--ciudad);
acá va sólo lo que no se deduce de ahí.

- **"Puro ensamblado" resultó literalmente cierto: `css/page-combo.css` son CUATRO
  reglas.** La razón es que esta página carga **tres capas**: `page-service.css` de
  chasis (§9.1), **`page-city.css` de capa geo** (el badge de Einsatzgebiet, la
  grilla del hero a dos columnas, el contorno de la ciudad, los tics en columna,
  los bloques numerados, las cards de Warum, las filas de servicio) y encima lo
  poco que agrega este tipo. El `<body>` lleva `class="page-city page-combo"` y
  **`page-city` no es una etiqueta**: el bloque de teléfono de esa hoja (banda de
  seam de 80px con sus reservas, padding reducido, CTAs a todo el ancho) está
  scopeado ahí.
  ⚠️ **Significa que un cambio en `page-city.css` cae en 26 páginas, no en 10.** Es
  deliberado (el badge y las cards tienen que ser UN diseño en los dos tipos), pero
  hay que medir los dos tipos después de tocarla. Ya pasó en esta misma sesión: otra
  sesión convirtió las cards de Warum de bloques con hairline a **paneles blancos
  elevados**, y esta página las hereda.
- **Por qué Brandwache Nürnberg y no otra.** Las dos fuentes coinciden otra vez: la
  checklist nombra esta URL como el combo de prueba, y el draft se titula
  **"stärkste Kombi"** (20/mo, la más alta de las 16) y es la LP de Ads de K2/K5. Y
  **es la única de las cuatro con hero Notfall**, así que construirla primero obliga
  a la plantilla a resolver el caso raro en vez de descubrirlo en la página 14.
- ⚠️ **EL TELÉFONO ES EL CTA PRIMARIO Y EL FORMULARIO EL SECUNDARIO**, lo que
  invierte todas las demás páginas del sitio. Es instrucción explícita del draft
  ("CTA primär: Jetzt anrufen … · CTA sekundär: Unverbindliches Angebot einholen") y
  es lo correcto para el único servicio al que se llega en medio de un incidente.
  **No "corregirlo" por consistencia: los otros tres combos de Nürnberg SÍ lideran
  con el formulario**, y esa diferencia también está en sus drafts.
  - `#icon-phone` es el **único símbolo relleno del sprite que no declara su propia
    pintura**, así que dentro de un botón azul sale como mancha negra sin
    `fill: currentColor; stroke: none`. La regla de `.service-hero__phone .icon` no
    sirve: trae además la píldora de contorno, que es justo lo que este botón no es.
  - **2026-08-10 — la etiqueta del botón es EL NÚMERO SOLO** (cliente: "sacá el
    Jetzt anrufen de adelante del número"), y eso es lo que además puso **los dos
    botones en una fila** (mismo pedido). Medido: con el prefijo el par pedía
    **662px** (313 + 325 + 24 de gap) contra los 634–640 de la columna de copy, o sea
    se apilaba en todo el escritorio; sin él el primario baja a **211px** y entran
    con aire. La acción sigue siendo inequívoca: icono de teléfono, `tel:`, azul.
    ⚠️ **La banda 1024–1151 necesitó su propia regla, y es aritmética:** page-city
    parte el hero en dos columnas a 1024 (1fr / 0.62fr) y ahí la columna de copy
    queda en **506px**, 54 cortos. Darle `0.42fr` al contorno en esa banda le compra
    ~570px, y el contorno no pierde nada porque está dimensionado por ALTO
    (`width: auto` + `max-height`). Verificado en una fila a 768 / 900 / 1024 / 1100
    / 1151 / 1152 / 1280 / 1440 / 1600 / 1920.
  - **2026-08-10 — SE SACÓ EL BADGE DE EINSATZGEBIET del hero** (cliente: "sacá la
    pill"). ⚠️ **Ningún dato se perdió**: la Einsatzleitung 24/7 está en la FAQ 1, en
    el paso 03 del Ablauf y en el CTA de cierre. Y el encuadre UWG no depende de él
    acá — el requisito de "kein Scheinstandort" es del draft de CIUDAD (Webtext 13),
    no del de esta combo (Webtext 34), y lo que lo sostiene sigue en su lugar (el
    `LocalBusiness` lleva el NAP real de Bamberg con `areaServed` y la página no
    reclama oficina en Nürnberg). **La página de ciudad conserva el suyo.** Igual
    vale una línea a Chris: era la única declaración en palabras que hacía la
    primera pantalla.
- **2026-08-10 — LA SECCIÓN DE KOSTEN ESTÁ INVERTIDA: fondo negro, card BLANCA**
  (cliente: "en esta sección de brandwache-nuernberg, si podés alterná los colores,
  el fondo negro y la card la podés hacer blanca o platinum, sólo en esta sección").
  Es el inverso de las otras 26 páginas que publican ese bloque, y está scopeado a
  `.combo-price` — nada fuera de esta sección cambia.
  - **Y arregló algo con lo que la página había salido.** La card del chasis es
    negra brillosa, o sea obliga a que su sección sea clara; `.service-konzept*`
    (los 3 pasos) tiene el texto blanco escrito a mano y sólo funciona en oscuro;
    los paneles de `.city-why*` son cards blancas y sólo funcionan en claro. Esas
    tres restricciones juntas dejaban **Warum + Kosten + FAQ como un solo capítulo
    claro de tres secciones sin ningún cambio de color adentro**, y así se
    documentó (como inevitable). Con la card blanca la página **alterna hasta
    abajo**: hero ▪ · Einsatzlagen ▫ · Ablauf ▪ · Warum ▫ · **Kosten ▪** · FAQ ▫ ·
    Formular ▪ · Weiterführend ▫ → footer, **8 seams**, cada tile con el color de
    la sección de arriba (verificado sección por sección en el DOM).
    ⚠️ **Si vuelve la card negra, vuelve el bloque de tres y hay que borrar los dos
    seams que rodean a Kosten.**
  - **Blanca, no un gris "platinum" nuevo:** el formulario dos secciones más abajo
    ya es una card blanca sobre el negro de esta misma página, así que `.combo-price`
    toma los valores de `.conversion__form-wrap` (mismo hairline, `--radius-lg`,
    `--shadow-lg`). Dos cards blancas en una página tienen que ser una decisión.
  - Se van dos cosas que sobre blanco no pintan nada en vez de quedar como
    declaraciones muertas: el degradado diagonal del relleno y **el sweep de
    `btn-shine`** (`content: none`, o sea también deja de correr una animación
    infinita que no se veía).
  - ⚠️ **Los alfas NO son los de la card negra espejados.** Su label va a 0.6 blanco
    sobre negro, y 0.6 de `--color-gray` sobre blanco mide ~3,2:1 y falla. El piso
    en blanco es 0.75; acá van a 0.8. **Medido: label/unit/note 5,25:1, la cifra
    20,87:1, las filas de tics 9,24:1.** Y el tick azul lleva la mezcla profunda de
    §5, **no** `--color-accent` — esta sección ya no es `.section--light`, así que
    ese token resuelve a blue-light (3,11:1 sobre blanco).
  - **El texto de la izquierda se centra verticalmente** (cliente, mismo día:
    "hacéme el texto no alineado arriba pero al centro de la sección"). En una
    página de servicio esa columna es título → respuesta → factores → Hinweis y
    alinear arriba es lo correcto; acá no hay factores ni Hinweis (el draft los mete
    dentro de su propia frase), así que eran dos párrafos contra una card de ~530px
    y se leía como texto caído al tope de una columna vacía.
    ⚠️ **Hacen falta las DOS declaraciones:** `grid-row: 1 / -1`, porque el chasis
    pone el intro en la FILA 1 de una grilla de tres mientras la card abarca las
    tres — centrar dentro de la fila 1 sería centrar dentro de una caja del alto del
    propio texto, o sea un no-op — y recién ahí `align-self: center`. Medido a 900 /
    1024 / 1280 / 1440 / 1600: **0px** entre el centro del texto y el de la card.
    Sólo ≥900px.
  - Re-medido después: sin scroll horizontal a 320–1920, los 8 seams construyen sus
    180 tiles cada uno, nada queda en opacidad <1 ni con blur tras una pasada
    completa de scroll, y **0 elementos con `will-change` en reposo**.
- **2026-08-10 — FAMILIA DE ICONOS EN TRES SECCIONES** (brief del cliente:
  Einsatzlagen y Ablauf sin anclas visuales, y los iconos de las cards de Warum
  "too small and visually timid", con la condición de que las tres se lean como UN
  sistema). La plantilla está en
  [docs/page-conventions.md §11.5](docs/page-conventions.md#115-la-familia-de-iconos-un-peso-de-línea-tres-tamaños).
  - **Sin librería nueva y con UN solo símbolo nuevo.** Los 9 glifos restantes ya
    estaban en el sprite del proyecto — varios los había agregado otra sesión el
    mismo día para `/leistungen/` — y por eso son familia gratis: una grilla de
    24x24, una misma mano, `fill: none; stroke: currentColor` heredado de
    `<g id="icon-defs">`.
  - ⚠️ **EL TRAZO SE FIJA POR TAMAÑO, y es lo único no obvio de todo esto.**
    `stroke-width` de SVG está en UNIDADES DE USUARIO: un símbolo dibujado a 1.5
    sobre 24 renderiza 1,75px a 28px y **2,5px a 40px**. Sin corregirlo, tres
    tamaños dan tres pesos de línea, que es exactamente el "same stroke weight" que
    el brief prohíbe. Fórmula: `stroke-width = 1.75 x 24 / <px>` → **1.5 a 28px
    (Einsatzlagen), 1.31 a 32px (Ablauf), 1.05 a 40px (cards)**. Verificado: los 10
    iconos a **1,75px efectivos exactos**.
    **1,75 se midió dos veces**: 1,6 empataba pero a 40px se leía *timid* — la
    palabra del propio brief — porque un glifo más grande al mismo peso absoluto se
    ve más liviano. 1,75 sigue abajo de 2px y deja el tamaño de 28px en el 1.5
    nativo del sprite.
  - **Colocación, tres decisiones que no son cosméticas:** en Einsatzlagen el icono
    va en la fila del NUMERAL (un renglón más serían cuatro cosas que leer antes de
    la frase, que es lo que vuelve card a una lista editorial); en el Ablauf va
    DEBAJO del numeral, porque el nodo del riel y su 01/02/03 son lo que hace que
    se lea como línea de tiempo — y como es un hijo elemento más del step,
    `js/steps-sequence.js` ya lo entra con su título y su frase, sin hook extra; y
    en Warum **sólo cambia el tratamiento, no los glifos** (28 → 40px, gap del icono
    24 → 32, título→texto 12 → 16), scopeado a `.combo-why` para que las diez
    ciudades conserven sus 28px.
  - ⚠️ **`#icon-radio` es nuevo a propósito**: `#icon-shield-check` era el glifo más
    cercano para "Wache steht", pero ya es la tercera card de Warum en la MISMA
    página, y un glifo haciendo dos trabajos a una sección de distancia se lee como
    error y no como sistema.
  - **2026-08-10, misma sesión — los iconos de Einsatzlagen: 40px, SIN numeral, y
    se DIBUJAN con el scroll** (cliente: "más grandes y sacá el número… quiero que
    se formen cuando escrolee, o sea que la línea se vaya trazando"). Quedan **dos
    tiers, no tres**: 40px donde el icono es el ancla del bloque (Einsatzlagen y las
    cards) y 32px en el riel de tres pasos, donde la estructura dominante es la
    línea de tiempo.
    ⚠️ **La lista pasó a `<ul>`**: era `<ol>` sólo porque existían esos numerales.
    Sin ellos los cuatro son un CONJUNTO paralelo de situaciones, no una secuencia,
    y un `<ol>` le seguiría contando a la tecnología asistiva un orden que la página
    ya no muestra.
  - ⚠️ **UN `<use>` NO SE PUEDE DIBUJAR, y ése fue el único trabajo real.** Un icono
    escrito como `<svg><use href="#icon-flame"></svg>` renderiza el símbolo del
    sprite a través de un shadow tree que el documento **no alcanza**:
    `querySelectorAll` no encuentra un solo path, así que no hay nada que medir ni
    dashear. **`js/svg-draw.js` ahora clona los hijos del símbolo y descarta el
    `<use>`, en runtime**, dentro de la función que ya salía temprano con reduced
    motion, sin JS o sin GSAP — o sea el sprite sigue siendo la única fuente de la
    geometría (no se pegó una segunda copia en la página) y en esos tres casos el
    markup conserva su `<use>` y el icono renderiza como siempre. Dos detalles
    obligatorios: **el `viewBox` tiene que viajar** (un `<use>` toma su sistema de
    coordenadas del símbolo; un `<svg>` pelado no tiene uno, así que 24 unidades
    renderizarían a 24px en la esquina de una caja de 40), y **el filtro de trazos
    pasó a mirar el valor COMPUTADO** además del atributo, porque un símbolo del
    sprite no trae `stroke` propio — su pintura vive en `<g id="icon-defs">`.
    Los rellenos siguen excluidos igual (el default de SVG es `stroke: none`), que
    es lo que mantiene pintando la oclusión de línea oculta de la card 03 de
    `/werkschutz/` — **re-verificado: 72 trazos sin dibujar → 0 y sus 5 rellenos
    intactos**, o sea el cambio no tocó al consumidor original.
    Medido bajando la sección: **15/15 sin dibujar antes de entrar → 13 → 9 → 0**, y
    el último termina con el item a 109px del borde superior, entero a la vista.
  - **2026-08-10, tercer pedido — los iconos del Ablauf a 40px con aire arriba, y
    los TÍTULOS SE HIGHLIGHTEAN con el scroll** ("un poco más grandes y aireados
    arriba" + "que los títulos sean highlighteados con fondo celeste mientras
    escroleo, como hacemos en otras secciones"). Con eso la familia queda en **UN
    SOLO TAMAÑO, 40px / stroke 1.05**, en las tres secciones — más fácil de sostener
    en las otras quince páginas que dos tiers. El `margin-top` del icono pasó de
    NEGATIVO (pegado al numeral) a +12px, o sea 24px de aire contando el gap del
    flex.
  - **El highlight es el marcador que el sitio ya tiene** (Vorteile de
    `/werkschutz/`, pain hook del homepage), pero manejado por **el propio timeline
    de `js/steps-sequence.js`** vía un hook nuevo, `data-steps-mark="<selector>"`,
    así el relleno barre como parte de la ÚNICA llegada del paso y no como un
    segundo efecto que aterriza cerca. Opt-in igual que `data-steps-draw`
    (verificado: `/werkschutz/` y `/jobs/` con 0 marks, sin cambios).
    ⚠️ **El `<span>` no es decoración**: `.combo-steps__title` es un FLEX ITEM del
    step y un flex item se blockifica, así que `display: inline` en el h3 computaría
    `block` y el marcador barrería toda la columna en vez de abrazar las palabras.
    ⚠️ **El relleno es la MEZCLA PROFUNDA (#4673AB), NO el celeste del CTA, y es
    contraste, no gusto.** El título es 20px a peso 500, o sea NO es texto grande
    (eso pide 24px, o 18,66 y bold) → aplica 4,5:1. Y el texto tiene que quedarse
    blanco porque a mitad del barrido la mitad sigue sobre el negro de la sección:
    blanco sobre #3D9AD3 mide **3,11:1** y falla, sobre #4673AB mide **4,80:1** en
    el relleno y 21:1 sobre el negro que todavía no alcanzó. Pasar el texto a oscuro
    —lo que sí hace el Leistungsumfang sobre su sección clara— acá lo volvería
    invisible a mitad del barrido.
    ⚠️ **El fallback es `var(--mark, 1)`, no 0.** Es el bug exacto que
    `.service-contrast__mark` publicó una vez (medido en 0 % con reduced motion, o
    sea los highlights desaparecían). **Verificado sin JS y con reduced motion: los
    tres a `100% 100%` y `--mark` sin setear.**
  - **2026-08-10, cuarto pedido — iconos a 44px, los del Ablauf BLANCOS, y UN SOLO
    CELESTE en toda la página** ("los iconos los quiero un poco más grandes, y
    blancos" + "encargate que sea todo el mismo celeste, que es el celeste del
    CTA"). Los iconos quedan en **44px con stroke 0.95** (el mismo 1,75px óptico).
    - **Blancos SÓLO en el Ablauf**, y no es una interpretación libre: es la única
      de las tres secciones que está sobre el negro de la página. En las otras dos
      los iconos van sobre cards blancas, donde un glifo blanco es invisible. No le
      cuesta color de marca a la sección: riel, nodos, numerales y el highlight del
      título son todos el celeste del CTA.
    - ⚠️ **La causa del "segundo azul" era `--color-accent`**, que es dependiente de
      la sección: dentro de una `.section--light` resuelve a blue-DARK (#5287C9).
      Por eso los iconos de Einsatzlagen y de las cards salían en un azul casi
      idéntico pero distinto del de los botones. Ahora todos escriben
      `--color-blue-light` literal. Es seguro en las dos superficies porque **un
      icono es un GRÁFICO** → mínimo 3:1, y #3D9AD3 mide 3,11:1 sobre blanco.
    - ⚠️ **El highlight del título pasó al celeste del CTA, y EL TAMAÑO DEL TÍTULO
      ES LO QUE LO HACE LEGAL.** El texto tiene que quedarse blanco (a mitad del
      barrido la mitad sigue sobre el negro, así que oscuro sería invisible), y
      blanco sobre #3D9AD3 es 3,11:1 → falla el 4,5:1 de texto normal. El título
      pasó a **1.5rem (24px) fijo**, que es el umbral de "texto grande" de WCAG a
      cualquier peso: ahí aplica 3:1 y el 3,11 pasa. **No devolverlo a
      `--font-size-md` sin cambiar el relleno** — a 20px esto era una falla real, y
      es por eso que el relleno había sido la mezcla profunda.
    - **Lo único que NO es el celeste del CTA son CUATRO `<a>`**: los 3 links dentro
      de respuestas del FAQ y el de la Datenschutzerklärung del formulario. Son
      texto de cuerpo de 15–16px sobre superficie casi blanca, donde #3D9AD3 mide
      **2,87:1** contra un piso de 4,5:1 — y no hay umbral que los salve (un link
      dentro de una frase no puede ir a 24px). Quedan en la mezcla profunda a 4,80:1.
      **Verificado computando el color de cada elemento de `<main>`: todo lo demás
      es #3D9AD3.**
  - **2026-08-10 — `#icon-factory` REDIBUJADO** (cliente: "el icono este puede y
    debe mejorar"). Es un símbolo **compartido**, así que mejora tres páginas:
    `/brandwache-nuernberg/`, la comparación de `/werkschutz/` y la card de
    Werkschutz de `/leistungen/`.
    - Los tres defectos del viejo: la **chimenea** era `M18 5V3h2v2`, un corchete
      abierto flotando separado del edificio, que a cualquier tamaño real se lee
      como bandera o antena; la nave y la torre eran **un solo path**, así que el
      techo entraba directo en un bloque alto y el conjunto se leía como una línea
      de gráfico quebrada; y los dientes de sierra medían 3 unidades contra un
      dibujo de 18 de ancho, o sea **lo que dice "fábrica" era el detalle más chico
      del icono**.
    - Ahora es **nave → casa de máquinas → chimenea**, en ese orden. Dos borradores
      descartados, y la razón importa más que las coordenadas: nave + bloque alto
      pelado se lee como depósito con torre, y nave + tubo alto con tapa se lee como
      caño o termómetro. **La chimenea tiene que apoyarse sobre algo** para que el
      bloque se convierta en edificio.
    - ⚠️ **Dimensionado para su uso MÁS CHICO, no el más grande.** Renderiza a
      **18px en `/werkschutz/`**, 28 en `/leistungen/` y 44 acá — los tres medidos.
      La chimenea tiene 3,1 unidades de ancho porque a 2,4 sus dos verticales se
      funden en una mancha a 18px. Los cuatro candidatos se renderizaron a los tres
      tamaños antes de elegir.
  - **2026-08-10 — los glifos de los pasos 02 y 03 REEMPLAZADOS** (cliente: "no me
    gustan, mejoralos"). En ninguno de los dos el problema era color ni tamaño:
    **no se leían.**
    - `#icon-plan` (hoja de plano con barra lateral) salía como una caja recargada,
      y **es compartido con `/leistungen/`** — así que esta página tomó glifo propio
      en vez de redibujar aquél: **`#icon-agree`**, un globo de diálogo con check,
      o sea una conversación que RESOLVIÓ algo, que es lo que significa abstimmen.
      Elegido sobre un portapapeles con check: un portapapeles dice "checklist", y
      este paso no es una lista sino un acuerdo con un tercero.
    - `#icon-radio` renderizaba como una tarjeta con renglones. Se probaron cuatro
      variantes más (cuerpo angosto, rejilla vertical, perilla, micrófono de pie) y
      la mejor **seguía necesitando un segundo para decodificarse** — que es la
      falla exacta que esta pasada vino a arreglar. Queda **`#icon-guard`**: una
      persona dentro del escudo, el puesto CUBIERTO.
      ⚠️ El contorno del escudo es **el de `#icon-shield-check`, copiado exacto**:
      los dos están en esta página a dos secciones de distancia, así que tienen que
      leerse como UN escudo con dos cosas adentro y no como dos escudos parecidos.
    - **Método, y vale para el próximo icono:** los candidatos se RENDERIZARON a los
      tamaños reales y se compararon en una captura, en vez de juzgarse por el path.
      Es lo que descartó tres borradores de fábrica y cinco de radio.
  - Medido a 320 / 390 / 700 / 768 / 1024 / 1440 / 1920: sin scroll horizontal, y
    `/leistungen/` sigue con su `#icon-plan` intacto. Sin JS y con reduced motion:
    los 4 `<use>` de Einsatzlagen intactos, cero dash inline escrito, iconos a 44px
    y opacidad 1, y los 3 marcadores a `100% 100%`. El dibujado sigue andando
    (13 paths, 13 → 3 → 0 sin dibujar, terminando con la card entera a la vista). El barrido de los marcadores, medido bajando:
    `0/0/0 → 1/0/0 → 1/1/0 → 1/1/1`, o sea en orden con sus pasos.
    ⚠️ **Nota de medición, para no volver a perseguirlo:** una sonda que hace
    `setDeviceMetricsOverride` de 1440 a 390 y mide enseguida puede reportar cientos
    de px de scroll horizontal que **no existen** — es ScrollTrigger todavía
    refrescando. Se confirmó con tres corridas en tres páginas: 0 en todas.
- ⚠️ **BUG DE CONTRASTE ENCONTRADO MIDIENDO, Y ESTABA EN VIVO EN LA PÁGINA DE
  CIUDAD:** los links dentro de una respuesta del FAQ heredaban `--color-link` =
  blue-light, que sobre el relleno casi blanco de la card mide **2,87:1** — falla
  clara del 4,5:1 de texto de 16px. `.city-faq .faq-item__answer a` (page-city.css)
  ahora fija la mezcla profunda de §5, **4,88:1**, así que el arreglo cae en las dos
  páginas. **`.section--light` no lo resuelve solo: re-declara `--color-accent`, no
  `--color-link`.**
- **Arreglado de paso, y era un resto de la migración de precio del 2026-08-05:**
  el `Service.offers` del JSON-LD de `/werkschutz/` seguía publicando **28–40**
  mientras la página visible dice 26–32 en sus tres lugares. Ahora 26–32.
- **Dos cosas del chasis que hubo que ajustar, las dos medidas:** la lista de pasos
  trae `margin-bottom: --space-8` porque en `/werkschutz/` la siguen dos bloques más
  (la prueba del 30 % y las acciones) — acá no la sigue nada, o sea 64px de espacio
  muerto; y el Weiterführend corre como **una lista a todo el ancho** en vez de las
  dos columnas de `/werkschutz/`, porque dos links no hacen dos grupos y en la
  grilla quedaba en la mitad izquierda bajo un H2 a todo el ancho.
- **La sección de Kosten NO lleva `.service-price__factors`**, y es seguir el copy:
  este draft mete los tres factores dentro de su propia frase. La grilla coloca sus
  hijos por columna explícitamente, así que la lista ausente sólo deja su fila vacía.
- **Medido a 320 / 360 / 390 / 430 / 768 / 900 / 1024 / 1100 / 1280 / 1440 / 1600 /
  1920:** sin scroll horizontal en ninguno, un solo `<h1>` sin saltos de nivel, 6
  seams con el color de tile correcto, FAQ visible ↔ `FAQPage` **6/6 byte-idénticas**,
  `<title>` 60 y meta 145 exactos. Alto 7.679px a 1440 y 9.684 a 390. Con los
  scripts desactivados de verdad: **3.394 caracteres de texto real en `<main>`**, 24
  headings, 13 links, 0 tiles, 0 elementos ocultos, y los nodos del Ablauf en su
  estado terminado por CSS. Pasada de scroll completa (abajo, arriba y abajo otra
  vez) con motion prendido: nada queda en opacidad <1 ni con blur, **0 elementos con
  `will-change` en reposo**, y los 6 seams con sus 180 tiles.
  Los únicos targets bajo 44px son los compartidos ya documentados (breadcrumb,
  honeypot, checkbox de consentimiento, y en escritorio el `<summary>` del FAQ y los
  inputs del formulario) — **ninguno de los elementos nuevos falla**.
- ⚠️ **Pendiente sitewide, encontrado midiendo y NO arreglado acá porque toca 6
  páginas:** `.faq__list--cards .faq-item__answer` es `rgb(59 73 86 / 0.75)` sobre el
  relleno del 5 %, o sea **4,39:1** — apenas abajo del 4,5:1. Está igual en el
  homepage, `/werkschutz/`, `/jobs/`, la página de ciudad y ésta. El arreglo es un
  solo valor en `components.css` (0.75 → 0.8 da ~4,9:1); decidirlo antes de tocarlo.
- ⚠️ **A confirmar con Chris:** el texto de anclaje del link al Ratgeber ("Wann eine
  Brandwache vorgeschrieben ist") está **escrito para el build** — el draft ahí sólo
  pone la URL suelta. Es el nombre de la página destino en sus propias palabras,
  misma convención que usó la página de ciudad.
- **Lo que sigue sin verificar**, mismo caveat de siempre: el switch claro/oscuro del
  header sobre las 4 secciones blancas necesita eventos de scroll reales
  (`npm run dev`).

**2026-08-10 — la card "Behördenfest dokumentiert" de `/brandwache-nuernberg/`
cambió su icono, sin símbolo nuevo.** Era `#icon-badge` (una medalla, cliente: "no
me gusta, mejoralo"). Pasó a **`#icon-document-check`**, que ya existía en el
sprite para la claim IDÉNTICA en el Erreichbarkeit-tile de
`/sicherheitsdienst-nuernberg/` ("Dokumentation für Behörde und Versicherung
inklusive") — una medalla se lee como premio, no como papeleo que sobrevive una
auditoría del Bauordnungsamt o el Versicherer, que es de lo que habla esta card.
Es el segundo consumidor de ese símbolo, y renderiza a **44px** contra los ~22px
para los que se había dibujado — sigue leyéndose limpio porque el símbolo evita
arcos a propósito. Verificado: sin scroll horizontal de 320 a 1920, y la página
de ciudad sigue con su propio `#icon-document-check` intacto.

**2026-08-10 — dos cambios en `/sicherheitsdienst-nuernberg/`, los dos a pedido del
cliente y los dos con una trampa que vale la pena anotar.**

- **Las certificaciones son SU PROPIA SECCIÓN BLANCA** ("una sección blanca literal
  — la transición de píxeles a sección blanca y después a la negra de abajo, como
  pasa en toda la web"). El bloque de DEKRA salió de la sección de Vertrauen a una
  sección propia con **un pixel seam de cada lado**. Los dos testimonios se quedan
  atrás sobre el negro, con su H2. Seams **9 → 11**.
  - ⚠️ **Un primer intento lo hizo una CARD BLANCA dentro de la sección oscura y
    estaba mal** — no por cómo se veía, sino porque era un cambio de color **sin
    seam**, que es lo único sobre lo que está construido el ritmo de esta página.
    Y la card encima necesitaba su propio flip de tokens y un arreglo de contraste
    para el link. Como `.section--light` de verdad **no necesita ninguna de las
    dos**: esa clase ya re-declara todos los tokens que `.trust-certs` consume, y
    page-service.css ya le da a `.service-link` en sección clara el azul profundo de
    4,88:1. Quedaron cuatro líneas en `page-city.css` que sacan margen, padding y
    hairline superiores — existían para separarlo de los testimonios cuando
    compartían sección.
  - **Medido**: estándar 20,87:1, descripciones y línea de referencias 4,60:1, link
    4,90:1; los 12 seams con sus 180 tiles; nada sin asentar tras una pasada
    completa de scroll; sin scroll horizontal de 320 a 1920. La sección **no lleva
    H2 propio** a propósito — el de Vertrauen dos bloques arriba es su encabezado.
  - ⚠️ **El par oscuro 7+8 dejó de existir**: Vertrauen y Erreichbarkeit ya no son
    adyacentes, así que ese borde es ahora un cambio de color real y lleva tiles
    `--white`. Si las certificaciones vuelven arriba, ese seam se va con ellas.
- **El tile del Wachbuch pasó a `#icon-route`** (ruta con marcadores en cada
  checkpoint), nuevo en el sprite.
  ⚠️ **`#icon-badge` NO se redibujó, porque no está mal**: es una medalla, y dos
  secciones más arriba significa "Kräfte mit § 34a GewO und
  Brandschutzhelfer-Qualifikation" — exactamente para lo que sirve una medalla.
  Estaba mal sólo en el tile del Wachbuch. Y tampoco se reusó
  `#icon-document-check`, que es la metáfora de papel obvia: ese símbolo YA está en
  esta página una sección arriba ("Dokumentation für Behörde und Versicherung"), y
  dos hojas-con-check en una página se leen como repetición. Una ruta con
  checkpoints es el único glifo del set que carga el "je RUNDE".

**2026-08-09 — PRIMERA PÁGINA DE CIUDAD: `/sicherheitsdienst-nuernberg/`. Es el
Bloque 4 de [docs/build-checklist.md](docs/build-checklist.md) y la plantilla de
las 9 restantes.** Copy del `Webtext 13 Stadt Nuernberg` (Stand 24.07.2026),
verbatim, alemán. Novena página terminada y **cierra un 404 que estaba en vivo en
el footer de TODAS las páginas y en los chips de Coverage del homepage**.
La plantilla completa está en
[docs/page-conventions.md §10](docs/page-conventions.md#10-página-de-ciudad); acá
va sólo lo que no se deduce de ahí.

- **Por qué Nürnberg y no Bamberg** (el pedido fue "la que sea más estratégica
  para empezar"). Las dos fuentes coinciden: el draft mismo se titula
  **"WICHTIGSTE STADTSEITE"** y combina ~1.240 búsquedas/mes (720 sólo en
  "sicherheitsdienst nürnberg"), y el Bloque 4 de la checklist nombra esta URL.
  Bamberg es el "Heimmarkt, Easy Win" pero su draft es una **Struktur-Variante
  explícita** (Zuhause-Story en vez de las 4 tarjetas de Warum, dirección real en
  vez de Einsatzgebiets-Framing), así que no habría dado una plantilla reusable —
  y de paso Nürnberg es de donde cuelgan las 4 páginas combo.
- ⚠️ **LA REGLA QUE DOMINA ESTE TIPO DE PÁGINA ES LEGAL, NO DE DISEÑO: UWG,
  "kein Scheinstandort".** FRANKONIA tiene UNA dirección y está en Bamberg. El
  draft lo pide como requisito y aterriza en cuatro cosas concretas: el badge del
  hero dice **"Einsatzgebiet Nürnberg"** y nunca "Standort"; el JSON-LD lleva
  `LocalBusiness` con el **NAP real de Bamberg** más `areaServed: City` y **nunca**
  una dirección en la ciudad de la página; la primera pregunta del FAQ es "¿Tienen
  sede en Nürnberg?" y se contesta con la verdad; y el Abbinder de Erreichbarkeit
  **no promete tiempos de respuesta ni distancias** (Prüfkatalog F10). **No
  "mejorar" ninguna de las cuatro.**
- **EL HERO NO LLEVA FOTO, y no es un parche: el draft no pide una.** Su
  Hero-Aufbau enumera badge, H1, subline, 3 tics, doble CTA y el widget de Google,
  y nada más (el de Bamberg sí pide "Bild"). Eso resuelve el 🔴 de la checklist
  ("no hay ni una foto de ciudad") sin inventar nada, y sale gratis: **esta página
  no tiene elemento LCP de imagen** — cero preload, cero decodificación.
  - Lo que ocupa la columna derecha es **el contorno administrativo REAL de
    Nürnberg**, un `<path>` inline de 2,6KB. Se genera una vez, en desarrollo, con
    **`docs/design-sources/city-outline.py <slug>`** (nuevo) desde los geojson que
    ya estaban en el repo desde julio — 3.566 puntos simplificados a 200 con
    Douglas-Peucker. **Las 10 ciudades ya tienen su geojson, así que las otras 9
    son un comando.**
  - Es la opción honesta para un Einsatzgebiet: **un área, no una dirección**. Un
    pin único se leería como sucursal, que es exactamente lo que la regla de
    arriba prohíbe. Y a diferencia de los mapas Leaflet de `/` y `/kontakt/`, no
    hace ninguna request ni llama a un tercero (los tiles de CARTO sí, y todavía
    no hay banner de consentimiento).
  - **Se dibuja al cargar, no con el scroll**, y el `stroke-dasharray` es el largo
    **medido** del path (7381 unidades), no un número al voleo. Arriba del fold un
    reveal scrubbeado es el bug que ya pagó el hero de `/referenzen/`.
- **La sección de Kosten se reusó ENTERA sin tocar CSS** — es exactamente para lo
  que `.service-price*` se construyó genérico en `/werkschutz/` (la checklist lo
  cuenta en 27 páginas), y la Preis-Box es un partial. Lo único nuevo ahí es
  `.city-rates`, las cuatro filas servicio → tarifa que una página de servicio no
  tiene. ⚠️ **No reusa `.service-price__factors`**: ese bloque dibuja un `+` azul
  por fila y un `+` delante de "Objektschutz · 26-32 €/Std." se lee como lista de
  extras. Pero **sí tiene que repetir su `grid-column: 1`**, o cae en la segunda
  columna, debajo de la card de precio.
- **`.ref-certs*` promovido a `.trust-certs*` en `page-service.css`.** Esta página
  era el TERCER consumidor de esa composición, que es literalmente el disparador
  que este archivo y `page-service.css` ya habían anotado ("un TERCERO tiene que
  promoverlo en vez de una tercera copia"). `/referenzen/` migrado en el mismo
  commit y **re-medido: sello 70×106 a 1440 y 53×80 a 390, ratio 0,665 = 399/600
  exacto, 3 columnas desde 700px — idéntico a antes del cambio.** ⚠️ Quedan DOS
  copias a propósito: `/werkschutz/` tiene su propia `.service-contact__certs*`
  soldada a las grid-areas de esa sección, así que convertirla es un cambio de
  layout en una página terminada, no un rename. Es lo próximo a plegar.
- **`content/values.json`: `price.werkschutz` → `price.range`.** Los Webtexte
  publican el mismo 26-32 para todos los servicios y todas las ciudades, así que un
  nombre por servicio invitaba a una segunda copia del mismo número — que es
  justo lo que ese archivo existe para evitar.
- ⚠️ **DOS ERRORES MÍOS QUE ENCONTRÓ LA MEDICIÓN, no el razonamiento:**
  1. **Escribí `fill: currentColor; stroke: none` para tres iconos "rellenos" del
     sprite.** Está mal: **TODOS los símbolos del sprite viven dentro de
     `<g id="icon-defs">` con `fill: none; stroke: currentColor`, así que son
     TODOS de trazo.** El único relleno es `#icon-star`, que declara su propia
     pintura. (De paso: la regla de `page-service.css` que llama "FILLED" a
     `#icon-phone` es la excepción del sitio, no el patrón a copiar.) Grepear el
     sprite antes de escribir una de estas reglas, no deducirlo del nombre.
  2. **Áreas táctiles: `min-height`, no `padding-block`.** Los dos `.service-link`
     sueltos medían 29 y 27px. Padear los dos con el MISMO valor quedó corto en
     los dos y **por distinto margen** (43 y 41px), porque están a tamaños de
     tipografía distintos. `min-height: 44px` da 44 siempre y `.service-link` ya es
     `inline-flex; align-items: center`.
  Y un tercero que la medición atrapó antes de publicarse: el paréntesis de la
  fila de tarifas estaba en `--color-gray` al 0.7 = **4,04:1**, abajo del 4,5:1.
  La escala quedó anotada en §10.4 para no volver a elegirla a ojo (0.75, que es
  lo que da `--color-text-muted` en sección clara, apenas pasa con 4,60).
- **Los 8 links del FAQ que el draft pide, NO se renderizaron como links**, y las
  dos razones están medidas: ocho anchors en una frase miden 18px cada uno, y
  aplicar el arreglo de §7 ocho veces en un párrafo destroza el renglón (WCAG
  2.5.8 tiene una excepción explícita para targets limitados por el line-height de
  una frase); y sobre todo **los ocho ya son filas completas dos secciones
  arriba**, o sea serían los mismos ocho destinos por segunda vez en la misma
  página. El link que sí queda es el de Brandwache, con `padding-block` sobre
  `inline-block`.
**2026-08-10 — NUEVO ÍTEM DE NAV "EINSATZGEBIETE" CON SUBMENÚ DE LAS 10 CIUDADES,
igual que Leistungen. Y arregló un bug que estaba EN VIVO desde julio.** Pedido
del cliente ("en el nav agregame areas o coverage areas, tiene que ser igual que
Leistungen, que se abre con la flechita para abajo y se ven las distintas
ciudades"). Toca `partials/header-de.html`, `partials/header-en.html`,
`js/main.js` y `css/site-chrome.css`, o sea **las 13 páginas**.

- **El CSS del submenú no necesitó UNA línea.** Ya era genérico:
  `.site-nav__item--has-submenu` es `position: relative` y el panel es
  `position: absolute` adentro, así que un segundo instancia funciona sola.
  Medido a 1400 / 1440 / 1600: panel de 416px, 2 columnas, sin desbordar el
  borde derecho (975 / 995 / 1075 contra el viewport).
- ⚠️ **`js/main.js` SÍ necesitó cambio, y era un bloqueo real.**
  `initMobileSubmenu()` usaba `document.querySelector` **singular**, escrito
  cuando Leistungen era el único submenú. Con un segundo, el nuevo se habría
  quedado **sin toggle**: permanentemente expandido en mobile, empujando el resto
  del nav y el CTA del header fuera del drawer — que es exactamente el bug que esa
  función existe para arreglar. Ahora es `querySelectorAll` + `forEach`.
  - **El id de fallback ahora es indexado** (`site-nav-submenu-1/-2`). Era un
    `"site-nav-submenu"` pelado, así que con dos paneles los dos habrían tenido el
    MISMO id y el `aria-controls` del segundo botón habría apuntado al panel del
    primero.
  - **Se comporta como acordeón**: abrir uno cierra el otro. Con dos submenús de
    diez links, dejar los dos abiertos mete 20 links más 5 ítems de primer nivel
    en el drawer, o sea más de una pantalla otra vez.
  - Verificado en mobile a 390: **2 toggles creados** (antes habría sido 1), ids
    únicos, los dos colapsados al arrancar, los links padre siguen siendo links
    reales (`/leistungen/`, `/einsatzgebiete/`), y el acordeón cierra el hermano.
    Drawer abierto: nav de 405px y el CTA terminando en 456px sobre 844 de
    viewport — entra con holgura.
- ⚠️⚠️ **BUG QUE ESTABA EN VIVO, encontrado midiendo el panel nuevo y después
  chequeando el viejo: "Alle Leistungen →" era BLANCO SOBRE BLANCO.**
  `.site-nav__submenu-all` vive dentro de `.site-nav__list`, así que la regla
  compartida `.site-nav__list a` — (0,1,1), una clase más un elemento — le ganaba
  a la clase pelada (0,1,0) e imponía su `color: var(--color-text)` (blanco) y
  `display: inline-block`. Medido: `rgb(255, 255, 255)` sobre el panel blanco, o
  sea **invisible desde que ese panel se volvió claro el 2026-07-22**. Los links
  de ciudad/servicio nunca tuvieron el problema porque
  `.site-nav__submenu-list a` también es (0,1,1) y gana por orden de aparición.
  Arreglado con `a.site-nav__submenu-all`; medido después en `/`, `/werkschutz/`
  y la página de ciudad: `rgb(1, 1, 1)` y `display: block` en las tres.
- **LABEL: "Einsatzgebiete", no "Coverage Areas".** El cliente lo nombró en
  inglés pero este nav es todo alemán (Leistungen · Referenzen · Karriere ·
  Kontakt), y Einsatzgebiete es la palabra que ya usan el link "Alle
  Einsatzgebiete" del footer, el breadcrumb de las páginas de ciudad y la URL
  `/einsatzgebiete/`. `header-en.html` lleva "Coverage Areas" por la razón
  inversa, y se mantuvo en sincro para que los dos headers no divergan
  estructuralmente — que es la razón por la que ese archivo existe.
- **Posición: justo después de Leistungen.** Qué hace FRANKONIA, después dónde lo
  hace — y deja los dos ítems con caret juntos en vez de partidos por Referenzen.
- **El nav pasó de 4 a 5 ítems y sigue entrando**, que era el riesgo real (el
  breakpoint ya se movió tres veces por esto: 1024 → 1200 → 1320 → 1400). Medido
  a 1400 / 1440 / 1512 / 1600 / 1920: **una sola línea en todos**, con ~200px
  libres entre el logo y el nav y otros ~200 entre el nav y el CTA, sin scroll
  horizontal y con la hamburguesa en `display: none`.
- **Ganancia gratis que no busqué:** `initActiveNavLink()` ya propagaba el
  `aria-current="page"` de un link de submenú a su ítem padre, así que **cada
  página de ciudad ahora marca "Einsatzgebiete" en el nav** con el subrayado azul,
  igual que `/werkschutz/` marca Leistungen.
- ⚠️ **Agregar o sacar una ciudad ahora son CUATRO ediciones, no tres**:
  `header-de.html`, `header-en.html`, `footer-de.html`, `footer.html`. Las diez
  son la lista y el orden del footer (Bamberg primero, después por región).
  **Hof no está**: no está en el set de páginas del cliente y salió de todo el
  sitio el 2026-08-05, reemplazado por Forchheim.
- **Nota de medición:** `:focus-within` sí responde a un `.focus()` por script (al
  contrario que `:hover`), pero **sólo si el iframe tiene el foco del documento** —
  una corrida dio `focusWithin: true` y la siguiente no, con el mismo código. Y
  bajo `--virtual-time-budget` las transiciones se congelan, así que `opacity`
  quedó en 0 mientras `visibility` sí cambiaba (su transición es de 0s). Las dos
  cosas leídas juntas confunden; el estado abierto se verificó al final con un
  screenshot forzando el panel con las mismas declaraciones de la regla real.

- **2026-08-09, mismo día — LOS 5 EINSATZFELDER LOCALES CIERRAN CADA UNO CON UN
  LINK A SU SERVICIO, y se cerró un hueco visual real.** Pedido abierto ("cómo se
  puede mostrar de la mejor forma posible, son 5 puntos"), y el hallazgo fue que
  los 5 no son color local suelto: cada uno describe, casi textual, un servicio
  puntual de FRANKONIA — y la sección no enlazaba a ninguno, justo debajo de la
  sección de Leistungen que existe para eso.
  - Los 5 pares (01 Objektschutz-Nürnberg · 02 Revier- & Schließdienst · 03
    Veranstaltungsschutz · 04 Kaufhausdetektei · 05 Baustellenbewachung-Nürnberg):
    3 de 5 nombran el servicio en la propia frase ("Zivile Kaufhausdetektive",
    "Baustellenbewachung mit…", "Veranstaltungen"); los otros 2 usan casi las
    mismas palabras que la Sección 3 usa para describir ESE servicio
    ("Bestreifung, Zufahrtskontrolle" = Objektschutz; "Kontrollgänge zu
    variierenden Zeiten" = el rasgo que define Revier- & Schließdienst en el draft
    de Bamberg). **Revier- & Schließdienst no está en la lista de 8 de la Sección
    3** — este es el único lugar de la página donde consigue un link.
  - ⚠️ **El emparejamiento NO viene del draft** (el docx sólo anota "→ URL" en la
    Sección 3), así que es una inferencia mía y vale confirmarla con Chris —
    aunque de bajo riesgo, dado que 3 de 5 nombran el servicio directamente.
    **No repite el error que Sektion 12 del homepage evitó a propósito**
    (linkear algunos términos mencionados mientras sus hermanos daban 404): ahí
    la alcanzabilidad era mixta (1 viva, el resto no); acá los 8 destinos de la
    Sección 3 YA están linkeados pese a no existir ninguno — es la práctica
    propia de esta página (§8.3), no una excepción a ella.
  - **Bug real de hueco, medido, no supuesto:** con 5 ítems en una grilla 2-up, el
    5 quedaba solo en la fila 3 — un hueco visible de 752 a 1337px a 1440 (482 a
    833 a 900). Arreglado con `grid-column: 1 / -1` en el último ítem desde
    900px, con su propio contenido capado a 34rem para que no se lea como un
    párrafo estirado sino como un cierre deliberado.
  - ⚠️⚠️ **UN BUG DE CONTRASTE PRE-EXISTENTE, encontrado midiendo mi propio
    agregado — y no era mío, ya estaba en vivo.** `.service-link` dentro de
    `.section--light` da **3,71:1** (blue-dark a 16px/500, que es texto normal y
    necesita 4,5:1, no 3:1). Medido en `/referenzen/`, que usa el mismo componente
    en sus 3 links de "Case Study lesen" desde el 05/08: **3,71:1, en vivo, sin
    detectar hasta ahora.** Arreglado UNA vez en la fuente compartida
    (`page-service.css`, `.section--light .service-link`) con la mezcla profunda
    ya documentada (`color-mix(in srgb, var(--color-blue-dark) 85%, black)` =
    **4,9:1**, el mismo valor que ya usa `.city-fields__num`), así que el cambio
    corrigió mi link nuevo **y** los 3 de `/referenzen/` de una sola vez.
    Verificado: `#4673AB` en las dos páginas, 4,9:1 medido matemáticamente sobre
    el valor `color(srgb …)` que Chrome reporta para un `color-mix()` computado
    (mi sonda con regex `rgb()` no lo leía; el cálculo a mano sí).
  - **Un archivo mío quedó renombrado a `.hold` por otra sesión concurrente en
    el mismo repo mientras trabajaba** — el contenido era el mío, intacto,
    simplemente con el nombre cambiado. Se restauró con un `mv`. Vale saberlo:
    en este repo hay más de una sesión escribiendo al mismo tiempo, así que un
    build que de golpe no encuentra la página propia no es necesariamente un
    error propio — antes de investigar más, chequear si el archivo fuente sigue
    ahí con otro nombre.
  - Medido a 320/390/768/900/1024/1440/1600: sin scroll horizontal en ninguno,
    los 5 links presentes y resolviendo al destino correcto en todos, sin romper
    `/referenzen/` (7.219px, sin scroll) ni `/werkschutz/` (19.387px, sin scroll).
- **2026-08-09, mismo día — LA SECCIÓN DE LEISTUNGEN VA EN DOS GRUPOS, no como 8
  iguales.** El cliente pidió leerla a nivel UX antes de tocarla, y la medición
  encontró que los ocho no son ocho cosas equivalentes: **4 tienen su propia
  página `/…-nuernberg/`** (cargan el volumen local — brandwache nürnberg mide
  20/mes contra los 10 del resto — y un clic mantiene al visitante en el camino de
  ciudad) y **4 apuntan a la página de servicio genérica**, que no va a contener la
  palabra Nürnberg. Como pares iguales, el label de esos cuatro **prometía una
  página local que no existe**, o sea la misma clase de afirmación implícita que la
  regla UWG del hero existe para evitar.
  - Grupo 1 → **cards**, 4 en una fila. Grupo 2 → **filas**, bajo la etiqueta
    "Ebenfalls verfügbar".
  - ⚠️ **EL SPLIT NO REORDENA NADA**: el draft ya los lista 1–4 ciudad / 5–8
    genéricos, así que esto sólo hace visible una agrupación que Chris ya escribió.
    Verificado en el markup antes de moverlos.
  - **Los 8 conservan su descripción** (cliente: "no me gusta que los chips
    pierdan su descripción"). El grupo 2 son **filas y no chips** justamente por
    eso: sobreviven los ~760 caracteres de copy concreto y crawleable. Lo
    secundario lo marca la posición y la superficie, no menos información. Lo único
    de texto nuevo son las dos palabras de la etiqueta.
  - ⚠️ **Las cards NO pueden ser idénticas a las de "Warum", y el motivo es
    estructural, no de gusto.** Esas viven en `.section--light` y son paneles
    BLANCOS; esta sección es oscura, y un panel blanco acá encandila. Voltear la
    sección a clara **no está disponible**: dejaría tres claras seguidas y
    cascadearía hasta Kosten, cuya caja de precio está construida como panel oscuro
    DENTRO de una sección clara. Así que es el **gemelo oscuro**, y lo que le da
    borde es una **diferencia de relleno** (blanco al 4,5 %) más una hairline, no la
    sombra — sobre oscuro la sombra casi no trabaja, la misma conclusión a la que
    llegaron las risk cards sobre su banda navy. **Medido a 320 → 1600: radio,
    padding y tamaño de nombre idénticos a la card de Warum en todos los anchos.**
  - ⚠️ **Cuando existan los otros siete destinos, NO promover una fila a card
    porque su página salió.** La agrupación es por si el destino es
    CIUDAD-específico, no por si existe. `/empfangsdienst/` va a existir y seguirá
    sin ser sobre Nürnberg.
  - ⚠️ **Pendiente para Chris, y por eso la etiqueta dice sólo "Ebenfalls
    verfügbar":** sacar " in Nürnberg" de los 8 labels los llevaría de 22–32 a
    10–20 caracteres y duplicaría la velocidad de escaneo, pero es la
    "einheitliche Benennung" del draft y son 8 instancias del keyword principal.
    **No se hizo.** Con los labels intactos, una etiqueta que nombrara la ciudad la
    repetía tres veces en dos líneas.
- **2026-08-09, mismo día — las 4 cards de "Warum" son PANELES BLANCOS ELEVADOS,
  las mismas que los Anwendungsfälle de `/werkschutz/`** (cliente: "iguales a las
  cards de werkschutz en donde hay 4 cards en una fila, que tengan drop shadow […]
  solo que en este caso sin la ilustración grande"). Cada valor está **copiado** de
  `.service-cases__card`, no re-derivado — borde `rgb(1 1 1 / 0.07)`, radio 1.5rem,
  sombra de dos capas, padding por breakpoint, los mismos clamps de `h3` — así que
  son un diseño en dos archivos y no dos parecidos. **Medido a 900 / 1100 / 1440 /
  1600: las dos páginas dan IDÉNTICO** en radio, borde, fondo, sombra, padding,
  ancho de card (216 / 290 / 326px) y tipografía; sin ancestro que recorte la
  sombra y sin scroll horizontal.
  ⚠️ **Revierte el "ruled, not carded" de §8.2 para este bloque** — decisión del
  cliente, con el precedente de que los Anwendungsfälle hicieron el mismo camino.
  4 en una fila desde **1100px** (el número de werkschutz, no el 1200 de `/jobs/`,
  que venía de una card con FOTO).
  ⚠️⚠️ **EL HOVER USA `translate` Y NO `transform`, y no es estilo: es obligatorio.**
  Estos items llevan `data-item-reveal`, y `js/item-reveal.js` anima `y`/`scale` con
  GSAP, que escribe un `transform` **inline** — y un inline le gana a cualquier
  regla de hoja, así que un `transform: translateY(-5px)` en el hover **nunca se
  aplicaría** después del reveal. `translate` es otra propiedad y se compone con
  `transform`. **Verificado en aislamiento, no razonado:** un elemento con
  `transform: matrix(1,0,0,1,0,24)` inline **y** `translate: 0 -5px` de hoja
  reporta las dos computadas y aterriza en `layout + 24 − 5`. Es el mismo problema
  que `page-service.css` resuelve componiendo desde `--card-y`/`--card-s`, pero eso
  necesita un script propio y esta página usa el primitivo genérico. **Por lo mismo
  no se copió el offset alterno de 28px de las pares** (es un `transform` en
  reposo, ahí GSAP gana; en el 4-up werkschutz lo cancela igual).
  > 🔴 **CORRECCIÓN 2026-08-10 — ESTE ARREGLO NO FUNCIONA, y el hover de estas
  > cards está MUERTO en producción.** El "verificado en aislamiento" de arriba es
  > justamente el agujero: la prueba puso el `transform` inline **a mano**, no con
  > GSAP. GSAP no escribe sólo `transform` — escribe
  > **`translate: none; rotate: none; scale: none;` inline** en todo elemento cuyo
  > transform anima, precisamente para que las propiedades individuales no le
  > peleen. O sea que el inline también gana en `translate`, y la hoja no puede
  > tocar ninguna de las dos.
  > **Medido con puntero real sobre `/sicherheitsdienst-nuernberg/`:** al hoverear
  > una `.city-why__item`, el `border-color` SÍ cambia (esa propiedad no la toca
  > GSAP) pero `translate` sigue en `none` y el top de la card no se mueve —
  > 276px antes y después. Los 5px de elevación no ocurren nunca.
  > **Afecta a `.city-why__item` en `/sicherheitsdienst-nuernberg/` y
  > `/brandwache-nuernberg/`** (las dos cargan `page-city.css`). **No se arregló
  > acá** porque el pedido del cliente era el rediseño de `/leistungen/` y decía
  > explícitamente no tocar secciones ajenas.
  > **El arreglo es de una palabra en el markup:** que `data-item-reveal` apunte al
  > `<li>` envolvente en vez de a la card
  > (`data-item-reveal=".city-why__item"` → `data-item-reveal="li"`). GSAP anima el
  > wrapper, la card conserva sus propias propiedades de transform, y el hover
  > vuelve a existir. Es exactamente lo que hace `/leistungen/` desde el rediseño,
  > y ahí está **verificado con puntero real**: la card sube de 236 a 232px.
  Tampoco se copiaron la ilustración grande (la excepción que pidió el cliente), el
  numeral 01–04 (esas cards son un `<ol>` de casos; estas cuatro son razones, y
  numerarlas sería inventar un orden que el copy no tiene) ni el header centrado.
- **2026-08-09, mismo día — el header de la sección Vertrauen va CENTRADO**
  (cliente: "hacemelo centrado"). H2 y lede sobre el eje del container; el
  contenido de las cards de testimonio queda **a la izquierda** y el bloque de
  certificaciones ya se centraba solo, así que la sección entera se lee centrada
  con dos reglas. Es el tratamiento que ya tienen el FAQ de esta página, el de
  `/werkschutz/` y `.ref-intro--center` de `/referenzen/`, o sea una decisión ya
  tomada, no una nueva.
  ⚠️ **`margin-inline: auto` en el lede no es opcional** y es la misma trampa de
  especificidad que documenta §6: el chasis pone
  `.section__intro > p { max-width: 42rem }`, así que `text-align: center` por sí
  solo centra el TEXTO dentro de una caja de 672px que sigue pegada al borde
  izquierdo — se ve como título centrado con párrafo alineado a la izquierda. Al
  H2 se le suma `max-width: 36ch` (en `ch`, para que sirva a las otras nueve
  ciudades) y rompe en "Nürnberger / Auftraggeber".
  **Verificado con un `Range` sobre los nodos de texto reales, no con el rect del
  elemento** — que acá miente, porque la caja del párrafo está capada a 42rem:
  H2 y lede a **0px del eje** a 390 / 768 / 1024 / 1440 / 1600.
- **2026-08-10 — CASI TODOS LOS HEADERS DE LA PÁGINA TERMINARON CENTRADOS, pedidos
  de a uno.** Los dos últimos son **Warum** ("Warum Nürnberger Unternehmen auf
  FRANKONIA setzen") y **Leistungen** ("Unsere Sicherheitsdienstleistungen in
  Nürnberg"), que se suman a Vertrauen, Brandwache, Erreichbarkeit y Umgebung, más
  el FAQ (lo centra el chasis) y el formulario (lo centra `lead-form.css`).
  **Sólo quedan dos rangeados a la izquierda:** el strip de Einsatzfelder, y Kosten,
  cuyo intro vive en la columna izquierda de un grid de dos columnas y no se puede
  centrar sin romper esa maqueta. **La próxima ciudad conviene arrancarla con los
  headers centrados** — está escrito en page-conventions §10 como el default de una
  página de ciudad, y ahorra seis idas y vueltas.
  ⚠️⚠️ **LA MISMA TRAMPA DE ESPECIFICIDAD APARECIÓ CINCO VECES EN UNA SOLA PÁGINA**
  (Vertrauen, Brandwache, Umgebung, Warum, Leistungen), así que ahora está escrita
  como regla general en page-conventions y no repetida por bloque: cuando un
  `.section__intro` lleva H2 **y** párrafo, hacen falta **dos** cosas — un selector
  de **dos clases** (el chasis pone `.section__intro > p { max-width: 42rem }` a
  (0,1,1), así que una sola clase empata y pierde por orden) y `margin-inline: auto`
  (el `text-align` centra el texto, los márgenes automáticos centran la CAJA).
  Con una sola de las dos se ve título centrado con párrafo pegado a la izquierda,
  que es peor que no centrar nada.
  🔧 Seis reglas casi idénticas en `page-city.css` quieren ser un modificador
  `.city-centred` cuando se construya la segunda ciudad; hoy no se consolidaron
  porque cuatro cargan sus propios `max-width` medidos y sería refactor de reglas
  que funcionan.
  Medido con `Range` sobre los nodos de texto reales a 390 / 768 / 1024 / 1440 /
  1600: los cuatro elementos (H2 + párrafo de las dos secciones) a **0px del eje**
  del container, sin scroll horizontal, y las 4 cards de Warum y las 8 filas/cards
  de servicios siguen alineadas a la izquierda dentro de su propia columna.
- **2026-08-10 — LA SECCIÓN DE ERREICHBARKEIT (`.city-proof`) SE CENTRÓ ENTERA, no
  sólo su título** (cliente: "esto centrámelo todo", sobre una captura de la sección
  completa). ⚠️ **Revierte la nota de la pasada anterior de ese mismo bloque**, que
  decía que la tira de tres se quedaba rangeada a la izquierda para seguir el par
  "header centrado / contenido a la izquierda" de Vertrauen y Brandwache. Es
  **la única sección de la página que centra también su contenido**, y es coherente
  en vez de excepción: son tres frases de una línea con un icono arriba, mientras
  aquéllas llevan citas de cuatro líneas y bloques de beneficios que necesitan un
  borde izquierdo al que el ojo vuelva. **No "restaurar" la alineación izquierda por
  consistencia.**
  - ⚠️ **HUBO QUE BORRAR UNA REGLA, no alcanzaba con agregar `text-align`.** El
    primer item tenía `padding-left: 0` para que su texto arrancara en el borde de
    contenido de la página — correcto mientras la tira iba a la izquierda, y
    **activamente equivocado ahora**: un padding asimétrico corre la caja de
    contenido de esa columna, así que centrar adentro dejaba icono y frase ~16px a la
    izquierda del centro real de la columna mientras las otras dos caían en el suyo.
    Tres columnas centradas comparten un padding. Medido antes de borrar:
    `32px 32px 24px 0px` contra `32px 32px 24px 32px` en las otras dos.
    **El costo, asumido:** la primera columna ya no arranca en el borde de contenido
    (page-conventions §1). Con texto centrado el ancla visual es el centro de la
    columna, no el borde del container — la misma decisión que ya toma el bloque de
    keyword centrado de `/leistungen/`.
  - ⚠️ **`justify-self: center` para el icono, y ni `text-align` ni un auto-margin lo
    habrían movido:** el item es un GRID, así que el icono es un grid item, y un
    `<svg>` con ancho definido no responde al `text-align` del padre.
  - ⚠️ **El Abbinder necesita `margin-inline: auto`** — la misma trampa que los cinco
    headers de esta página, en su forma más simple: una caja con `max-width` dentro de
    un padre centrado centra su TEXTO y se queda pegada a la izquierda. Su cap de
    52rem además deja la hairline de arriba como una regla centrada de 832px en vez de
    una que cruza el container, o sea se lee como el cierre de la tira y no como un
    divisor de sección.
  - **`text-wrap: balance` entró con el centrado y no es adorno:** una frase centrada
    tiene dos bordes irregulares, así que un corte desparejo se ve dos veces. Medido:
    a 1024 las líneas pasaron de **[3,4,3] a [3,3,2]**. El `hyphens: none` que estas
    frases ya tenían pesa más ahora por lo mismo.
  - Medido a 320 / 390 / 768 / 1024 / 1280 / 1440 / 1600: **texto e icono de las tres
    columnas a 0–1px del centro de SU propia columna** (el resto es redondeo
    sub-píxel), H2 y Abbinder a **0px del eje** del container, padding **32/32 en las
    tres**, sin scroll horizontal, y la sección sigue en **761px** a 1440 — el
    centrado no costó alto.
- **Medido, no a ojo, a 320 / 390 / 768 / 900 / 1024 / 1200 / 1440 / 1600:** sin
  scroll horizontal en ninguno, **cero fallos de contraste**, y los 8 bloques de
  contenido con **el texto exactamente en la misma línea izquierda** (20 / 63 / 68
  / 77 / 90 / 103 / 112px — medido con un `Range` sobre el nodo de texto real, no
  con el rect del contenedor, que en un `.container` no dice nada). Un solo `<h1>`,
  sin saltos de nivel, 9 seams con el color de tile correcto en cada borde. Alto
  12.151px a 1440 y 15.922 a 390. FAQ visible ↔ `FAQPage` **6/6 byte-idénticas**
  (y re-verificadas también en el homepage 11/11 y `/werkschutz/` 5/5, que no se
  rompieron).
- **Sin JS, verificado sacando los 10 `<script src>`**: nada oculto, 0 tiles de
  seam, 26 headings, 21 links y **9.532 caracteres de texto real en `<main>`** —
  el contrato de §4.5, que acá además es requisito de GEO.
- **Lo que sigue sin verificar**, mismo caveat de siempre: el switch claro/oscuro
  del header sobre las 4 secciones blancas necesita eventos de scroll reales
  (`npm run dev`), y la secuencia de reveals con movimiento activado sólo se
  comprobó por medición del estado final, no mirándola.
- ⚠️ **Tres cosas para confirmar con Chris**, todas anotadas también en la
  checklist: los 2 testimonios van **completos** y no "gekürzt wie Demo" (acortar
  la cita de un cliente real con nombre es editarle las palabras a una persona, y
  no hay versión corta en ningún documento); **"Bayernhafen Nürnberg"** aparece en
  el Einsatzfeld 01 — es el puerto público como descripción geográfica, no el
  cliente de Bamberg cuya Freigabe nunca llegó, pero el nombre tiene historia acá;
  y el H2 de Umgebung es la **CUARTA excepción** a la escala de §2 (el draft lo
  pide con esas palabras, "H2 (klein)"), así que **la próxima tiene que replantear
  §2 en vez de sumarse a la lista**.

**2026-08-08 — EL SCROLL SE TRABABA EN EL HOMEPAGE Y NO ERA EL MAPA. Bug de
compositing sitewide: 447 `will-change` permanentes + 116 filtros gastados.**
Cliente: "cuando estoy en la homepage de desktop pasando por el mapa, al final, se
tranca un poco, creo que es porque carga en el momento". El diagnóstico del cliente
era razonable — el mapa YA es lazy (`js/coverage-lazy.js` desde 2026-07-27) y carga
justo ahí — **pero medido, no era eso**, y arrancar por "optimizar el mapa" habría
sido tiempo tirado. Toca `js/title-reveal.js`, `js/item-reveal.js`, `js/main.js` y
`css/motion.css`, así que **afecta a las 9 páginas**.

- **Cómo se descartó el mapa, que es la parte que vale la pena repetir.** A/B parado
  en distintos puntos del scroll, 4x de CPU throttle: **arriba del mapa 8ms de frame
  y 0 de blocking; a la altura del mapa 109ms; pasando el mapa 83ms; y volviendo a
  subir, 8ms otra vez con Leaflet ya cargado.** O sea no era la carga (subir después
  es limpio) ni Leaflet. Y `#coverage-map { display: none }` **no cambiaba nada**.
  El `backdrop-filter: blur(8px)` del overlay del mapa tampoco: 0 de diferencia
  medida. Dos sospechosos plausibles descartados por medición.
- **La respuesta la dio un TRACE, no el CPU profile.** El profile de JS daba 144ms de
  leaflet y 2ms de coverage-map sobre una ventana de 5s — o sea el JS no era nada, el
  99 % estaba en `(program)`. Un `Tracing` con las categorías de timeline lo nombró:
  **2678ms de `Layerize` sobre 3000ms de traza**, con Paint 76ms y Layout 37ms al
  lado. Layerize es el compositor recalculando el árbol de capas. La página tenía
  **425–479 capas**.
- ⚠️ **CAUSA 1 — `js/title-reveal.js` ponía `will-change` en CADA CARÁCTER de cada
  `h2`, para siempre.** El script parte cada heading en un `<span>` por letra:
  **437 spans hinteados** desde el load hasta el final de la visita. `will-change` es
  un hint CON COSTO — le pide al compositor que mantenga una capa lista — así que
  hintear cientos de elementos que no van a animar en horas es peor que no hintear.
  Ahora se enciende cuando el heading entra en su propio rango de scroll y se apaga
  al salir (`onToggle` para el scrubbeado, `onStart`/`onComplete` para el que juega
  una sola vez), así que como mucho lo llevan uno o dos headings a la vez.
  **447 → 10 elementos con `will-change`.**
- ⚠️ **CAUSA 2, misma clase de bug en dos lugares más — un `filter` gastado no se
  retira.** `filter` distinto de `none` deja al elemento en su propia capa **aunque
  sea `blur(0px)`**: sigue rasterizándose, sin desenfocar nada. Dos fuentes:
  `js/item-reveal.js` (termina en `blur(0px)` y ahí queda) y `.u-reveal.is-visible`
  de `css/motion.css` (idem). **116 elementos** con un filtro cumplido, y el peor de
  todos era **`.coverage__map-wrap`: una caja de 835k píxeles envolviendo el mapa
  Leaflet vivo, sostenida en su propia capa por un desenfoque de cero** — que es por
  qué el problema se sentía "en el mapa" sin ser el mapa.
  - item-reveal limpia con `clearProps` **sólo en `onLeave`**, y ese borde es
    deliberado: es el final del rango, donde el item ya está en opacidad 1 / blur 0 /
    sin offset, o sea idéntico al estado de reposo del CSS. Hacerlo en `onLeaveBack`
    borraría un estado inicial que es `opacity: 0` y **haría aparecer de golpe
    contenido sin revelar**. Volver a entrar desde abajo es seguro: el scrub
    re-renderiza el tween y reescribe las propiedades.
  - `.u-reveal` gana `.is-settled { filter: none }`, que `js/main.js` agrega recién
    con el `transitionend` del `filter` (con un timeout de 2s de red de seguridad,
    para cuando el evento no llega). `none` y `blur(0)` se ven idénticos, así que el
    cambio es invisible. **No plegarlo dentro de `.is-visible`** — mataría el blur
    antes de que juegue.
- **Medido antes → después** (mismo harness, parado 3s, headless con rasterizado por
  software; el 4x exagera los absolutos pero el A/B es el punto):

  | | frame @4x | blocking @4x | frame @1x |
  |---|---|---|---|
  | a la altura del mapa | 109 → **58ms** | 1405 → **353ms** | 24 → **16ms** |
  | pasando el mapa (FAQ) | 83 → **40ms** | 1320 → **0ms** | 9 → **8ms** |

  Capas 479/425/429 → **372/292/249**, y los cambios del árbol de capas en 2s de
  30/8/6 → **0/5/0**. A velocidad real las dos zonas quedan en 60fps.
- **Verificado que no se rompió ningún reveal**, que es el riesgo real de tocar esto:
  scroll completo de la página hacia abajo, hacia arriba y de nuevo hacia abajo, en
  **las 5 páginas** (homepage, `/werkschutz/`, `/jobs/`, `/referenzen/`,
  `/kontakt/`) → **0 elementos quedan en opacidad <1 o con blur**, 0 spans con
  `will-change` al final, y todos los `[data-reveal]` llegan a `.is-settled`.
  Reduced motion y no-JS no cambian: los tres scripts siguen saliendo temprano y el
  estado por defecto sigue siendo el contenido visible.
- **Lo que NO se tocó, a propósito:** los 552KB de GeoJSON de las 10 ciudades sin
  simplificar (`assets/data/coverage-boundaries/`, 30–102KB cada uno). Se midió y
  **no aparece**: 154KB transferidos en 15ms y el parseo no figura en el profile,
  porque Leaflet recorta al viewport (868 puntos de path en total). Sigue siendo
  peso de red evitable — el archivo de la región ya está simplificado a 8KB y
  documentado — pero no es esto, y cambiarlo no habría arreglado nada.

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
- **2026-08-05 — the "Weiterlesen" group titles and arrows** (client: "que el letter
  spacing de los títulos no sea tan salado, un poco menos", "que el celeste sea el
  celeste del CTA", "las flechas más grandes"). All three in `page-service.css`, so
  **/werkschutz/ gets them too** — it is the same shared block, and "use the CTA
  blue" reads as a brand rule rather than a Karriere-only preference. (/referenzen/
  has no `.service-related__title`.)
  - Tracking 0.08em → **0.05em**, arrows 1.5rem → **1.75rem (28px)**.
  - **The blue is now `--color-blue-light` (#3D9AD3), the CTA's own** — for the title
    text, for the 2px rule above it AND for the row arrows. The rule and the arrows
    were `--color-accent` (blue-dark, #5287C9) while the text was a deeper mix: three
    blues within a few percent of each other in one block, which reads as a mistake
    rather than a hierarchy. One blue now.
  - ⚠️ **The title's font-size is a flat `1.25rem` and that is a CONTRAST decision,
    not a size preference.** #3D9AD3 measures **3,11:1 on white**: fine for the 3:1
    that applies to large text and to graphics, short of the 4,5:1 for normal text.
    WCAG's large-text threshold is 18.66px **bold**, and `--font-size-md` is a
    1.125→1.25rem clamp — so at 1440 it was already 20px and passed, but at narrower
    viewports it fell to 18px, where the 4,5:1 would have applied and it would have
    failed. Pinning it at 20px keeps 3:1 the applicable threshold at every width.
    This is the documented cheap way out for exactly this case (page-conventions §3),
    used here instead of overriding the client's colour. **Do not put the clamp back
    without revisiting the colour.**
  - Measured after, on both pages: title 20px/800, 1px tracking, #3D9AD3 at 3,11:1
    and `isLargeText: true`; arrow 28px, same blue, 3,11:1 as a graphic; row still
    81px tall; no horizontal overflow.
- **2026-08-05 — the "Weiterlesen" rows hover like the homepage's outfit list**
  (client: "cuando hoveree, que sea igual que la lista de outfits de la home, que el
  fondo se ponga negro y que la flecha rote"). In `page-service.css`, so
  **/werkschutz/ gets it too** — same shared block, and the ask is explicitly parity
  with a homepage component.
  - Row fills `--color-logo-black` with `--color-white` text on hover/focus, the same
    two tokens `.outfits__name-btn` uses, and the arrow **rotates 45°** into a
    straight right arrow instead of the 3px translate it had. Both REVERSE the
    2026-08-03 brief that asked for "flat and lightweight" (a pale blue wash + a
    nudge) — the client's later call. White on black is 21:1, so it is also the
    stronger state of the two.
  - ⚠️ **The cascade trap that would have made it look broken:**
    `.section--light .service-related__link:hover` is (0,2,1) against the base
    hover's (0,1,1), so it wins — and it was still setting `color: black` from the
    "darken on hover" brief, which on a black fill is a black label on black. It sets
    white now. Both directions of this collision are annotated at the rules.
  - **Verified with a REAL pointer over CDP**, not by reading the rules:
    `Input.dispatchMouseEvent` at the row's centre, then computed styles —
    `bg rgb(1,1,1)`, `label rgb(255,255,255)`, arrow white with
    `matrix(0.707…)` = 45°. `:hover` does not respond to a synthetic
    `dispatchEvent` from page script, so a "hover test" written that way proves
    nothing (the harness is in the scratchpad note below).
- **2026-08-05 — the CV upload shows only its button** (client: "sacame lo de no
  file chosen, solo que quede el botón de Choose File").
  - The browser paints that text itself, inside the control's own shadow content,
    and `::file-selector-button` reaches the BUTTON and nothing else — so
    `color: transparent` on the input is the only lever CSS has. It hides the empty
    state and the chosen file's name alike; the button is unaffected because it sets
    its own colour. The value stays in the accessibility tree either way (it is the
    input's value), so a screen reader still hears which file is attached.
  - **New `js/jobs-file-name.js` echoes the chosen name back** under the button,
    because hiding the text alone would mean attaching a CV changes nothing visible
    on a form whose point is attaching a CV. Generic hook
    (`data-file-name-target="#id"`), enhancement only: the echo element is empty in
    the markup and `aria-hidden` (the input already announces the file), so with no
    JS the field is exactly the button on its own — the state the client asked for.
  - ⚠️ **A REAL SPECIFICITY BUG surfaced here, and it had been silently live for two
    days.** The input carries `.form-field__input` too, and lead-form.css styles
    `.conversion__form .form-field__input` — (0,2,0). Every single-class
    `.jobs-form__file` rule in page-jobs.css is (0,1,0) and **loses to it regardless
    of file order**. It went unnoticed because lead-form's values for the shared
    properties are identical (same underline, same transparent fill), so the field
    looked exactly as intended while half the rule did nothing — and it only surfaced
    when a property lead-form ALSO sets had to differ here: `color: transparent`
    measured back as `rgb(59,73,86)`, i.e. ignored. All of them are
    `.jobs-form .jobs-form__file` (0,2,0) now, base + hover + focus + the phone
    block. **The lesson for the next form: a field that carries a shared component
    class needs two-level selectors, and "it looks right" is not evidence the rule
    applied.**
  - Verified over CDP with a real file attached via `DOM.setFileInputFiles`: empty
    state renders the button alone (`input color: rgba(0,0,0,0)`, echo empty), and
    after selecting, the echo reads `Lebenslauf_Max_Mustermann.pdf` with the native
    text still hidden.
- **2026-08-07 — the hero is TWO COLUMNS again: copy left, photo right** (client:
  "poné de imagen de hero la imagen KarriereHero.png y ponela a la derecha del hero,
  el contenido a la izquierda"). Third shape this hero has had, each one a client
  call: the service template's copy | portrait split → the full-bleed street photo
  (2026-08-03) → this.
  - **`KarriereHero.png`** (1536×1024, from `assets/images/`) is a studio shot of four
    staff in Dienstkleidung **on a black background**, which is what makes this layout
    easy: the photo blends into the section's own black, so the frame carries **no
    radius, no border and no placeholder tint** — a radius would round nothing but
    black and a light placeholder would flash before the image lands. The frame's only
    job is `aspect-ratio: 3 / 2`, matching the source exactly, so the space is
    reserved (no CLS) and `cover` never crops anything.
  - Exported over the old `jobs-hero-*` names (**the street-photo variants were
    deleted**, not left stale — git has the bytes): 640/960/1280w WebP + a 1280 JPEG,
    20/39/59KB WebP, 95KB JPEG. Far lighter than the street photo it replaces
    (193KB at its largest) because a black studio backdrop compresses well. Still
    preloaded + eager + fetchpriority with `imagesrcset`/`imagesizes` mirroring the
    `<picture>`.
  - **Both readability washes are GONE with the background**, along with
    `.jobs-hero__bg` and the `object-position` crop. That is the real win of a
    side-by-side layout: the copy sits on flat black, so nothing is ever fighting a
    photograph for contrast, and there is no gradient to re-tune the next time the
    copy column changes width.
  - Columns are `1.1fr / 0.9fr` from 1024px, not an even split: the copy side carries
    the H1, lede, CTA, three tick lines and the trust band, and at 50/50 the H1 broke
    to three lines. Below 1024px it is one column and the DOM order (copy, then photo)
    is the stacking order — the H1 opens the page, the photo closes the hero.
  - ⚠️ **A leftover from the previous version would have silently cancelled this
    one:** the full-bleed pass had its own
    `@media (min-width: 1024px) { .jobs-hero__grid { grid-template-columns: minmax(0,1fr) } }`
    further down the file. Same specificity as the new two-column rule and LATER, so
    the hero would have stayed single-column with the photo underneath at every width.
    Deleted, with a note at the spot. When a layout is replaced, grep the whole file
    for the old block — not just the part you are rewriting.
  - **Made BIGGER the same day** (client: "la imagen tiene que ser bastante más
    grande, está muy chica") — 512×341 → **688×529 at 1440**, and the four people
    themselves roughly **twice** the size they were. It took two independent moves,
    because neither was enough alone:
    1. **Layout**: even columns instead of 1.1fr / 0.9fr, the gap 96 → 64px, and the
       photo **bleeding through the container's right inset to the viewport edge**
       (~120px of width at 1440 on its own). The negative margin is tied to the same
       two tokens the inset is built from, never a fixed number — the trap that gave
       the homepage's bleeding rows real horizontal scroll.
    2. **The export was re-cropped to the GROUP.** The four people spanned only 78 %
       of the original frame's width, the rest empty backdrop, so ~50px of air around
       a measured subject box (x 168–1361, y 72–1018 of 1536×1024, found with a
       98th-percentile luminance scan per column and row rather than by eye) came off.
       Same layout box, subjects ~37 % larger, nothing lost because what was cropped
       was black. New crop is 1300×1000, so the frame is `aspect-ratio: 13 / 10` and
       `cover` still crops nothing; variants re-exported at 640/960/1300w.
    ⚠️ **What does NOT work, and why:** making the frame tall enough to fill the
    hero's 772px. `cover` would then crop horizontally, and at this column width the
    visible slice is the middle ~43 % of the frame — it cuts the outer two people in
    half. Width is the only lever that enlarges them without losing anyone.
    ⚠️ **Measured trade-off:** the copy column is 585px now and the H1 breaks to
    THREE lines instead of two ("Dein Job bei" / "FRANKONIA:" / "Sicherheit, auch für
    dich"). Two lines need ~620px at the 52px clamp, so a photo this big and the
    two-line break cannot both fit at 1440. Three lines balances the taller photo;
    if the break matters more, the lever is the column split (1.09fr / 0.91fr buys
    the copy ~620px and costs the photo ~50px), not the H1's max-width, which is not
    the constraint.
  - **Nudged left and up a notch, same day** (client: "movela un poco a la izquierda y
    agrandala un pelín"): the split goes 1fr/1fr → **0.95fr / 1.05fr** and the gap
    64 → 48px, both of which take width off the copy side, so the photo grows
    LEFTWARDS while its right edge stays pinned to the bleed. At 1440: 688×529 →
    **726×558**, left edge 752 → 714.
  - ⚠️ **The two-column hero now starts at 1280px, not 1024 — and the H1 is why.**
    Measured: two columns leave the copy column at 464px (1024) and 526px (1152)
    whichever way the split is tuned, and the H1's longest line needs **~595px**
    (measured off a real 1512px render, not estimated), so the heading broke to FOUR
    lines in that whole band. No split fixes it; the container does not have 595px
    plus a photo at those widths. 1024–1279 therefore keeps the stacked layout it
    already used below 1024: full-width copy (H1 back to two lines) and a **full-width
    photo — 870→1090px wide there, bigger than any two-column version of it**. The
    hero is taller in that band (~1215px at 1024), which is exactly what it already
    did at 768 (1204px). The bleed moved to 1280 with the grid, or it would have
    pushed the full-width photo past the viewport edge.
    Line counts, for whoever moves these numbers next: 1024 → 2 (stacked) · 1280 → 3 ·
    1439 → 2 · 1440 → 3 · 1600 → 2.
  - **THE BLEED IS GONE (client, asked and answered 2026-08-07: "despegarla del borde
    derecho").** The photo used to pull through the container's right inset to the
    viewport edge — 107px of extra width at 1512 — and that is precisely why "move it
    left" did not read as movement: its right edge was pinned to the screen, so the
    39px it gained came off its LEFT edge and it looked like the same photo, slightly
    bigger. Asked directly with the four options and their measured costs; the client
    picked alignment over size. It now ends on the page's own content edge, the same
    line every section below it ends on (page-conventions §1), with a real margin to
    its right: **656×505 at 1512** (from 763×587, i.e. the ~14 % that was known and
    accepted when choosing).
    That also buys the heading back: the copy column keeps 594px, so **the H1 is two
    lines again at 1512 and 1600**. It is still three at 1280–1440, where the column
    falls under the ~595px the longest line needs — inherent to a fixed 52px H1 beside
    a photo at those widths, and the reason the two-column layout starts at 1280 at all.
  - **Bigger once more, 2026-08-10** ("podés agrandarla un poco más la imagen de la
    derecha del hero"): gap 48 → 32px and the split 0.95/1.05 → 0.9/1.1, so the growth
    comes off the left while the right edge stays on the content line. At 1512:
    **656×505 → 696×535**, left edge 749 → 709.
    **The number that governs this whole hero, finally measured instead of estimated:
    "Dein Job bei FRANKONIA:" renders at exactly 594px at the H1's 52px.** The copy
    column was 594px — dead on the threshold — so every pixel the photo gains costs
    the heading its two-line break. It is three lines at 1280–1550 now and two from
    ~1570px. The full range at 1512 is 665px of photo with two lines vs 696px with
    three; there is nothing else to win without shrinking the container inset (breaks
    page-conventions §1 sitewide) or the H1 clamp (breaks §2).
  - ⚠️ **Lesson worth keeping about "move it left":** with a right-pinned element,
    changing the column split does not MOVE it, it RESIZES it. The two reads of the
    request ("shift the block" vs "grow it leftwards") produce visibly different
    results, and the numbers — 39px of left edge, 0px of right edge — are what made the
    difference obvious enough to ask instead of guessing again.
  - ✅ **2026-08-10, same day — EL H1 DE TRES LÍNEAS SE RESOLVIÓ, y no con ninguna de
    las dos palancas que este archivo venía anotando como únicas** (encoger la foto o
    encoger el inset). El cliente propuso la tercera: *"no sean tres líneas el título,
    podríamos mover un poco la imagen a la derecha así entra"* — y tenía razón porque
    **la foto no estaba pegada a nada**: medidos **103px (1440) a 112px (1600) de página
    vacía** entre su borde derecho y el viewport, o sea el inset del container que el
    2026-08-07 se le devolvió al sacar el bleed. Ese sobrante es el presupuesto.
    - **`--jobs-hero-shift`, y hay que leer las dos declaraciones juntas.** El grid le
      da el shift a la columna de copy (split 0.9/1.1 → **1fr/1fr** desde 1440, y
      1.15/0.85 → **1.2/0.8** en la banda de 1280) y `.jobs-hero__media` se lo devuelve
      con un `margin-inline-end` negativo del MISMO valor. Resultado medido a 1440:
      copy **540,7 → 600,8px** (pasa los 593,4 del H1) y la foto **660,9 → 660,8px**, o
      sea **su ancho no cambió** — sólo se movió 60px a la derecha (borde 1336,8 →
      1396,8, con 43px todavía libres). El split solo, sin el margen, la habría encogido
      9 %.
    - ⚠️ **NO es un bleed y no tiene que volver a serlo.** El del 2026-08-07 llegaba al
      borde del viewport y el cliente lo pidió afuera ("despegarla del borde derecho");
      esto conserva margen real, sólo gasta parte del inset. **Un valor más grande hay
      que re-medirlo contra el sobrante, no estimarlo.**
    - **El shift es distinto por banda porque el déficit lo era:** 60px desde 1440
      (faltaban 53px a 1440 y 24 a 1512) y **26px** en 1280–1439, donde a 1280 la
      columna medía 590,6 contra 593,4 — **tres píxeles**, y por eso rompía a tres
      líneas sólo en el extremo inferior de la banda.
    - ⚠️ **El H1 real mide 593,4px, no 594** (la entrada de arriba redondeaba). Y **1440
      es el peor caso** de su banda: la columna crece con el viewport, así que si 1440
      pasa, todo lo de arriba pasa. Medir 1440 primero.
    - Medido a **320 / 390 / 768 / 1024 / 1279 / 1280 / 1400 / 1439 / 1440 / 1512 /
      1600 / 1920**: **dos líneas en todos los anchos de dos columnas** (antes: 3 a
      1280, 1440 y 1512), sin scroll horizontal en ninguno, la trust band dentro de la
      primera pantalla (780 de 900) y el sobrante derecho nunca por debajo de 43px. A
      320 y 390 el H1 sigue en 4 y 3 líneas — es el layout apilado con una columna de
      280/350px, inherente y previo a este cambio.
    - ⚠️ **Quedó una discontinuidad para decidir, NO tocada:** con el H1 ya resuelto, la
      razón por la que la banda 1280–1439 lleva un split a favor del copy desapareció —
      ahí la columna tiene 616–701px contra 594 de necesidad, o sea **22 a 107px que
      podrían ir a la foto**. Hoy la foto mide **480px a 1400 y 661px a 1440**, un salto
      del 38 % en 40px de viewport. Unificar las dos bandas lo cerraría, pero cambia el
      tamaño de la foto en anchos que el cliente no mencionó, así que se deja anotado y
      no aplicado.
  - Measured at 320 / 390 / 768 / 1024 / 1280 / 1440 / 1600: no horizontal overflow at
    any width despite the bleed (`overflow: hidden` on the section is what contains
    it), two columns from 1024 up, stacked below it with the photo after the copy, and
    the right `<picture>` candidate at each width.
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
    path: `--radius-md`, no gradient or overlay on the photos, no text over them, and
    padding `--space-5` (24px), inside the brief's 24–28px and a real token.
  - **SHADOW ONLY, no outline, since 2026-08-05** — two client instructions in
    sequence: "hacele drop shadow a estas cards", then "y sacales el border, o sea
    que sea solo el drop shadow". Both reverse the original brief's "very subtle 1px
    border… avoid heavy shadows", so they are the client's later call, not drift.
    `--shadow-md` (0 4px 12px / 0.10), not `--shadow-lg`: lg is the site's "lifted
    panel" value (the white form card), and this one only needs to sit slightly off
    the page. With the border gone the shadow is the ONLY thing defining the card's
    edge, which is why it does not get any smaller than this.
    The card gained an explicit `background-color: var(--color-white)` in the same
    edit — a box-shadow on a transparent element still paints, but "a shadow under
    nothing" is a bug waiting for the day this block lands on a section that is not
    white. No visual change today.
    **The hairline UNDER EACH PHOTO stays**: it is not the card's outline, it
    separates the two zones inside it, and with the outline gone it is the only thing
    keeping the photo from bleeding into the copy.
    ⚠️ The mobile swipe strip needed `padding-block: 4px 16px` for the shadow: the
    strip is `overflow-y: hidden` (a horizontal scroller must not scroll vertically),
    which clips anything outside its content box — including a shadow reaching ~16px
    below the card. Two-level selector, because swipe-carousel.css loads last and
    sets `padding` as a shorthand.
  - **Photos: REPLACED 2026-08-07 with dark-backdrop versions** (client: "actualicé
    las imágenes de estas 4 cards y las guardé como los títulos"). Same four shots,
    re-lit on a dark navy backdrop instead of white, dropped into
    `assets/images/` named after the card titles — three by title
    (`Bezahlung, die ankommt.png`, `Dienstplan mit Ansage.png`,
    `Feste Objekte statt Springer-Chaos.png`) and **the fourth as
    `FemalePointing.png`**, which is the "Ein Arbeitgeber, den du erreichst" card
    (identified by looking at it, not by the filename — third time a supplied file's
    name has not matched its slot on this project).
    Re-exported over the SAME asset names, so no markup changed:
    `jobs-why-{bezahlung,dienstplan,erreichbar,objekte}` at 640/960w WebP + a 960
    JPEG (11–31KB WebP, 37–57KB JPEG, q85 — one notch up from the white originals'
    q82, because a large navy gradient bands before a white one does).
    Two of the four arrive already 4:3 and are **not cropped at all**; the two 3:2
    ones take a centred 85px-per-side crop, checked frame by frame: every face, both
    clipboards, the radio, the pointing hand and the raised finger survive it.
  - **REPLACED AGAIN 2026-08-10, this time on PURE BLACK** (client: "hay que cambiar
    las imágenes de esta sección… las dejé todas en Desktop con los nombres de las
    cards"). Same four shots once more, same slots, and this round **all four
    filenames match their card title**, so nothing had to be identified by eye:
    `Bezahlung, die ankommt.png` · `Dienstplan mit Ansage.png` ·
    `Ein Arbeitgeber, den du erreichst.png` · `Feste Objekte statt Springer-Chaos.png`
    — on the **Desktop, not in `assets/`**, which is the right place for a working
    original (see the 6,5MB warning below) and means nothing new got published.
    Re-exported over the same asset names again, so **no markup changed and the four
    `alt` strings still describe their photo exactly** (verified one by one against
    the new files: three men in suits with blue ties / woman with clipboard and a
    colleague / woman on the radio pointing / two men in blue helmets with a
    clipboard). 640 + 960w WebP q88 plus a 960 JPEG q85, 11–58KB.
    ⚠️ **Two of them report mode RGBA and it is a red herring** — measured
    `alpha min == max == 255`, i.e. zero transparent pixels, so they are opaque
    black-backdrop photos, not cutouts. That mattered before exporting: a real cutout
    dropped on the white card would have shown the card through the people while the
    other two sat on black, and the four cards would no longer have read as a set.
    They are simply `.convert('RGB')`-ed on the way out.
    The crop is derived from each file's own measured subject bbox rather than from
    the image centre: the two 3:2 files are cropped to 4:3 **around the subject**
    (dienstplan left 72, objekte left 42, not the naive 85), with an assertion that
    the window still contains the full bbox. The mobile strip's 3:2 frame then takes
    ~4,2 % off the top and bottom of the 4:3 export — the smallest top margin in the
    set is 6,6 %, so no head is cut on a phone either. Verified in a real render at
    1440 (four cards, equal height, correct mapping) and 390.
  - **The frame's placeholder colour followed the photos**: `--color-bg` (near-black)
    instead of the 4%-grey `--color-bg-subtle` it had. With dark images a light
    placeholder flashes light-then-dark as each lazy image arrives. The navy itself is
    not a project colour and a placeholder is not worth inventing a hex for;
    `.section--light` does not re-declare `--color-bg`, so it stays black inside the
    white section.
  - ⚠️ **The four source PNGs are 6,5MB and they are PUBLISHED.** `build.js` copies
    `assets/` verbatim, so every raw source dropped in there ships and is reachable
    by URL — the same thing that made the unapproved bayernhafen logo public. The
    exports actually used total 370KB. They are working originals, so they were left
    where the client put them rather than moved unilaterally, but they belong in
    `~/Desktop/FRANKONIA-assets-archive/` (or anywhere outside `assets/`) before the
    next deploy. Same goes for `HeroWerkschutz.png`, `ReferenzenHero.png` and the six
    `N. …png` Leistungsumfang sources already sitting there.
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
  - **2026-08-05 — LA SECCIÓN ES AHORA UNA BANDA NAVY** (client: "hacéme esta sección
    con el fondo navy que tenemos en la sección de los tres stages en la home, y que
    tenga el degradado azul arriba y abajo… las cards también de ese color, los textos
    blancos"). Es el tratamiento de `.konzept` del homepage, **valores copiados
    literales** (#00091F + `--color-blue-light` 0.38 → 0.16 → 0 en los primeros y
    últimos 340px) para que las dos bandas sean la misma superficie y no dos navies
    parecidos. Ojo: **es el TEMPLATE**, así que las otras 11 páginas de servicio también
    tendrán el Risiko en navy.
    - **Sacar `.section--light` es lo que hizo casi todo el trabajo**: texto, texto
      muted, bordes y `--color-accent` (blue-dark sobre blanco → blue-light sobre
      oscuro) volvieron solos a los tokens oscuros, sin un solo override de color por
      regla. Las tres escenas isométricas también: `.rz-line` es `currentColor` y
      `.rz-guide` es `--color-border-strong`. `data-nav-theme="light"` salió en la
      misma edición — si no, el header pasaba a texto oscuro sobre navy.
    - ⚠️ **Las cards NO son exactamente #00091F, y no puede serlo.** Una sombra casi no
      trabaja sobre una superficie oscura, así que sin borde y sin diferencia tonal no
      queda nada con qué leer el borde: la card desaparecía en el medio de la banda.
      Son **#0D152A** (ese navy con blanco al 5 % ya compuesto) y **opacas a propósito**.
    - ⚠️ **La ilustración del cliente de la card 03 hubo que RECOLOREARLA** — es un
      `<img>`, así que ningún CSS nuestro la alcanza, y traía negro y blanco fijos: 39
      trazos negros (invisibles sobre navy) y 18 rellenos blancos (manchas brillantes).
      Ahora `black` → `#FFFFFF`, `white` → **`#0D152A`, el fill de la CARD, no el de la
      sección** (esos paths ocluyen líneas detrás de las cajas, así que tienen que
      igualar lo que está justo atrás del dibujo), y las guías `#C5C8CC` → `#4A5164`.
      El azul de marca no se tocó, ni la geometría, ni el ROL de ningún fill/stroke.
      **Si cambiás el fill de la card, hay que cambiar esos 18 fills también.** El
      original sobre fondo claro está en git.
    - **El seam de salida pasó de `--white` a un `--navy` nuevo.** Tiles blancos eran
      correctos mientras el Risiko era blanco y ahora destellarían saliendo de una
      banda navy. Mismo fix que `.pixel-seam--konzept`: al tile se le da el stack de
      dos capas de la propia sección (#00091F + blue 0.38) en vez del hex compuesto,
      porque el borde inferior está iluminado por el degradado y un navy plano se
      leería como "dos navies". El seam de ENTRADA queda con tiles negros sin tocar: el
      degradado superior levanta los primeros 340px, que es justo lo que le da contraste
      (el mismo cálculo que documenta `.konzept`).
    - Medido a 390 / 768 / 1024 / 1440, sin scroll horizontal: h2 y lede **19,83:1**,
      título de card **18,14:1**, texto **8,07:1**, el número azul **5,84:1**. Los 180
      tiles del seam de salida verificados con motion prendido.
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
- **2026-08-07 — el duty activo del Leistungsumfang ya NO se rellena: lleva una FLECHA
  adelante y el título SUBRAYADO en celeste** (client: "en vez de tener fill celeste
  quiero que haya una flecha adelante, de las flechas que usamos en todos lados de la
  web, esas que rotan […] y que se subraye el título con una línea celeste, el celeste
  del CTA"). ⚠️ **Tercer tratamiento del mismo estado** — raya azul a la izquierda
  (2026-08-03) → fill azul entero (2026-08-05) → esto. Los tres son decisiones del
  cliente; **no "restaurar" el fill**. La entrada de abajo queda como historia.
  - Es el `#icon-arrow-diagonal` del sprite, con la MISMA rotación de 45° que
    `.services__item-arrow` y `.service-related__arrow`: en reposo apunta arriba-derecha
    y al activarse gira a flecha recta hacia el título. Lleva el mismo fix ya
    documentado tres veces en este archivo — `fill: none; stroke: currentColor`, porque
    el fill/stroke del sprite vive en `<g id="icon-defs">` y no sobrevive a `<use>`.
  - **La flecha está SIEMPRE renderizada, a `opacity: 0`**, así llegar a un duty cuesta
    sólo opacidad y transform: cero layout, la misma regla por la que el padding va en
    TODOS los steps y no sólo en el activo.
  - **Arranca en el borde izquierdo del bloque** — la misma línea desde la que ya
    arrancan el H2 de la sección y la hairline de cada step (client, apenas salió la
    primera versión: "la flecha tiene que estar alineada con el título, o sea partir
    desde el mismo punto"; se preguntó con las tres lecturas medidas y eligió ésta).
    Está **fuera de flujo** (`position: absolute`), y eso es lo que le permite sentarse
    ahí sin arrastrar el título: los seis títulos y sus párrafos conservan su propio
    borde de texto, a `--flow-arrow-lead` del contenido del step, sin moverse cuando
    llega la flecha. El `left` es el padding inline del step NEGADO, porque el bloque
    contenedor es el h3, cuya padding box empieza un `--space-4` adentro de ese borde.
    Medido a 1152 / 1280 / 1440 / 1920: la caja de la flecha cae **exactamente** sobre el
    borde del bloque en los cuatro (98,2 + 5 de la bbox rotada = 103,2 a 1440), y los
    seis títulos siguen en la misma x que antes del cambio.
    ⚠️ La primera versión la tenía **en flujo**, en una ranura reservada dentro del h3
    flex; eso metía el texto 32px adentro y dejaba la flecha suelta en un margen propio,
    que es justo lo que el cliente marcó.
  - ⚠️ **El `-50%` de `translate` es el centrado vertical, y HAY QUE REPETIRLO en el
    estado activo**: `transform` es una sola propiedad, así que una regla activa que
    escribiera sólo la rotación tiraría el centrado y dejaría la flecha media glifo
    abajo. Medido: centro de la flecha 231,5 contra 231,4 del centro del texto del
    título (medido con un `Range` sobre el nodo de texto, no con el rect del `<span>`).
  - **El subrayado se DIBUJA**: `background-image` de 2px que crece de `0` a `100%`, no
    un `border-bottom` que aparece. El `padding-bottom: 2px` que lo despega de las
    descendentes se devuelve con un `margin-bottom: -2px` — **son 12px sobre los seis
    títulos, y ésa es exactamente la diferencia entre que la lista quede quieta a
    1440x900 y que el script tenga que deslizarla**. Medido: track 578 / viewport 572,
    idéntico al estado previo al cambio.
  - ⚠️ **EL CAVEAT DE CONTRASTE DE ESTE BLOQUE SE CERRÓ, y es una ganancia real.** El
    fill obligaba a texto blanco sobre `#3D9AD3` (**3,11:1**, por debajo del 4,5:1 que
    pide la descripción de 14px). Ahora título y descripción vuelven a los colores
    propios de la sección (negro sobre blanco y el gris muted) y el azul es sólo
    **gráfico** — la flecha y la regla de 2px — donde la barra es 3:1 y 3,11 la pasa. El
    estado sigue sin depender del color: el activo es el único a opacidad 1 (los otros
    0,72 y 0,18) y el único con flecha, que es una forma.
  - ⚠️ `--color-blue-light`, **no** `--color-accent`: la sección es `.section--light` y
    ahí ese token es blue-dark (#5287C9), no el azul del CTA.
  - Medido por scroll real (CDP + Lenis, no `window.scrollTo`) a 1440x900: `is-active`
    avanza 0→2→4→5 y en cada posición **exactamente un** duty tiene flecha a opacidad 1
    con `matrix(0.707…)` = 45° y subrayado `100% 2px`; el resto en 0 / `0px 2px`, y
    ningún step con `background-color`. Barrido 320–1920: sin scroll horizontal, la
    flecha en `display: none` por debajo de 1152 y con `prefers-reduced-motion` forzado
    (ahí no existe el layout stepped y los seis duties se leen enteros).
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
- ⚠️⚠️ **2026-08-10 — BORRÉ UN ARCHIVO DEL CLIENTE, por segunda vez con la misma causa.**
  `assets/icons/Betriebsunterbrechung.svg` (la ilustración de la card 01 del Risiko) se
  perdió: escribí la versión recoloreada en `betriebsunterbrechung.svg` y después borré
  `Betriebsunterbrechung.svg` — **en macOS son el mismo archivo**. No estaba trackeado en
  git ni había llegado a `dist/`, así que no se pudo recuperar y hubo que pedírselo de
  nuevo al cliente.
  **Es exactamente la trampa que este archivo ya documentaba** para `know-how-Abfluss.svg`
  el 2026-08-07, y para `bayernwerk.png` antes de eso. Documentarla no alcanzó.
  **REGLA, no consejo:** cuando el destino difiere del origen sólo en mayúsculas,
  **nunca** escribir-después-borrar. Las dos formas seguras son `git mv` (que hace el
  rename por un temporal) o —mejor para un archivo del cliente— **escribir la salida con un
  nombre claramente distinto y no borrar nunca el original**. Un `os.remove`/`rm` sobre un
  nombre que difiere sólo en el case es un borrado a ciegas.
- **2026-08-10 — el Leistungsumfang ya no tiene estado :hover** (client: "queda seleccionada
  la de arriba, voy moviendo para abajo y funciona, pero la de arriba queda con el efecto de
  selección").
  - **No era el script.** `js/service-flow.js` hace
    `classList.toggle("is-active", i === index)`, o sea marca exactamente una. Lo que había
    era que el `:hover` recibía el tratamiento completo del estado activo, así que un
    puntero apoyado en cualquier parte de la lista dejaba **dos cards con cara de actual** —
    la del scroll y la apuntada.
  - **Se sacó el hover del look de selección** (borde dibujado, marcador, opacidad y
    sombra), en vez de atenuarlo. Es lo correcto por sus propios méritos: son `<article>`
    sin link y sin nada que clickear, así que un hover que dice "seleccionada" afirma una
    interactividad que no existe. Exactamente una card es la actual, y la decide el scroll.
  - Verificado por scroll real, con `A` = `is-active` y `#` = borde dibujado:
    `A# .- .- .- .- .-` → `.- A# .- .- .- .-` → `.- .- A# .- .- .-`, y **forzando hover en
    la card 1 mientras la 3 es la activa, la 3 sigue siendo la única marcada**.
- **2026-08-10 — el marcador del título pasa al CELESTE DEL CTA con la letra BLANCA, y el
  título quedó fijo en 24px** (cliente: "no me gusta el subrayado de estas cards, quiero
  que sea celeste y con la letra blanca"). ⚠️ **Revierte el tint del 22 % con texto oscuro
  de ayer** — la decisión posterior manda; la entrada de abajo queda como historia.
  - ⚠️ **EL TAMAÑO DEL TÍTULO ES LO QUE HACE LEGAL ESTO, no es una preferencia.** Blanco
    sobre #3D9AD3 mide **3,11:1** — alcanza el 3:1 de texto GRANDE y falla el 4,5:1 de
    texto normal. El umbral de WCAG es 24px a cualquier peso, y el clamp que tenía
    (`clamp(1.15rem, 0.5rem + 0.9vw, 1.5rem)`) **recién llegaba a 24px pasando los
    ~1778px de viewport** — computaba 21px a 1440. O sea que en todos los anchos donde
    este proyecto mide, blanco sobre celeste habría sido una falla real. Ahora es
    `font-size: 1.5rem` plano. Mismo arreglo y misma razón que `.combo-steps__title` de
    `/brandwache-nuernberg/`. **No devolverle el clamp sin cambiar el relleno.**
  - ⚠️⚠️ **EL DELAY DEL CAMBIO DE COLOR ES ESTRUCTURAL, y es la única diferencia real con
    los títulos del Ablauf de `/brandwache-nuernberg/`: acá la card es BLANCA.** Allá la
    sección es negra, así que el blanco se lee sobre las dos superficies; acá, si el color
    y el relleno cambian juntos, la primera mitad del barrido es **blanco sobre blanco** y
    la palabra desaparece. El color va con `transition-delay: 150ms` contra un barrido de
    250ms.
    **Medido muestreando frame por frame una activación real:** la tipografía se queda
    casi-negra (6,72:1 contra el relleno) hasta que el relleno está al **98,4 %**, y
    cruza a blanco mientras está entre 99,7 % y 100 %. **Ningún frame tiene letras
    visibles sobre blanco pelado.** Que 150ms caiga tan tarde en el barrido es por
    `--easing-premium`: expo-out llega a su valor muy temprano.
  - **El crossfade es corto a propósito, 60ms y no los 120 con los que salió:** a mitad
    del fade la tipografía es un gris medio sobre celeste, y a 120ms ese estado de bajo
    contraste duraba **~80ms contra ~30 ahora**. Alargarlo reabre esa ventana.
  - **Y el delay es asimétrico**: la regla base lo deja en `0s`, así que al DESactivarse
    el texto vuelve a oscuro de inmediato — que es justo cuando el relleno se está yendo.
  - ⚠️ `--color-blue-light` literal, **no** `--color-accent`: la sección es
    `.section--light`, donde ese token resuelve a blue-dark (#5287C9) — el "segundo
    celeste" que este archivo ya pagó una vez.
  - **Medido**: relleno `rgb(61, 154, 211)` exacto (o sea el del CTA, muestreado del
    render), blanco encima **3,11:1**, título inactivo casi-negro sobre blanco
    **20,87:1**. La lista **sigue entrando en una pantalla** pese a los ~23px que costó
    el título más grande: **667px a 1152x800, 658 a 1440x900, 683 a 1920x1080**, con
    `shift: none` a 1440x900 / 1512x900 / 1280x800 / 1920x1080. Sin scroll horizontal a
    390 / 768 / 1024 / 1151 / 1152 / 1440 / 1920, y por debajo de 1152 **nada cambió**
    (título 16px, sin marcador — todas estas reglas viven dentro de
    `.service-flow--stepped`).
  - **Sin JS y con `prefers-reduced-motion`: cero títulos blancos**, los seis en
    `rgb(1, 1, 1)` y sin layout stepped. Eso es lo que cierra el riesgo de
    blanco-sobre-blanco: `color: var(--color-white)` sólo existe bajo
    `.service-flow--stepped … .is-active`, dos clases que en esos estados no existen.
- **2026-08-09 — la card activa: marcador claro y borde parejo** (client: "está feísima como
  quedó esta card seleccionada, y además tiene que hacer el contraste suficiente para que se
  lea el texto por tema accesibilidad… más linda, más clean y más pro, y que el borde sea
  del mismo grosor en los cuatro lados").
  - **El marcador pasó de bloque saturado a resaltador claro.** Era #3D9AD3 sólido detrás de
    texto casi negro: lo más ruidoso de la columna, y el título medía **6,72:1**. Ahora es
    `rgb(61 154 211 / 0.22)`, que compuesto sobre blanco da `rgb(212 233 245)` y deja el
    título en **16,67:1**. La pregunta de accesibilidad desaparece en vez de discutirse.
    ⚠️ **NO se usó `--color-accent-subtle`**: la sección es `.section--light`, que
    re-declara ese token a 8 % de blue-DARK — como resaltador es casi invisible.
  - ⚠️ **EL BORDE DESPAREJO ERAN DOS CAUSAS, y las dos hacían falta.** Medido sobre el render
    a 2x, arrancó en 2,0px arriba y a la izquierda contra 1,5 abajo.
    1. **El `scale(1.02)`** dejaba el alto de la card en 97,92px — fraccionario — así que el
       trazo caía en medio píxel. `vector-effect: non-scaling-stroke` **NO lo arregla**: el
       defecto es la POSICIÓN fraccionaria, no el ancho escalado. Se sacó el scale.
    2. Con el scale afuera seguía dando 1,0 / 1,5 porque **el trazo de 1,5 no combina con un
       inset de 1px**: un stroke SVG se centra en su path, así que un inset de 1 necesita un
       trazo de 2 para ir de 0 a 2 y caer en píxeles enteros; con 1,5 iba de 0,25 a 1,75.
    **Los dos números van juntos** — si se cambia el inset hay que cambiar el trazo, o el
    borde deja de ser parejo. Medido después: **2,0px en los cuatro lados**.
  - ⚠️ **El "un poquitín más grande" del mensaje anterior se fue con el scale.** Es la
    contrapartida del borde parejo, y era 11px sobre una card de 553px — bastante menos
    visible que el borde y el marcador, que son los que ahora cargan el estado. La card
    activa sigue sin depender del tono: es la única en opacidad plena, la única con borde
    dibujado y la única con el título marcado.
- **2026-08-09 — la card activa del Leistungsumfang además DIBUJA su borde celeste**
  (client: "cuando esté seleccionada también que tenga el borde celeste, y que el borde se
  forme como que la línea celeste va completando el borde"). O sea no es un cambio de color
  de borde: la línea recorre la card.
  - **Un `<rect>` SVG con `pathLength="1"`**, y ese atributo es lo que hace que esto no
    necesite JS: renormaliza el perímetro a 1, así `stroke-dasharray: 1` más un
    `stroke-dashoffset` de 1 a 0 dibuja exactamente una vuelta **a cualquier tamaño de
    card**. Una longitud medida habría necesitado `getTotalLength()` y re-medir en cada
    resize — que es exactamente para lo que existe `js/svg-draw.js` en las ilustraciones;
    acá el atributo lo resuelve gratis.
  - La geometría del rect (`x`, `y`, `width`, `height`, `rx`) va **en CSS**, no como
    atributos, así el inset y el radio siguen los valores de la card en vez de duplicarlos.
    Inset de la mitad del trazo, o el svg le corta la línea al medio.
  - ⚠️ **La curva NO es `--easing-premium`, y es una medición.** Con expo-out el **65 % del
    perímetro se traza en los primeros 80ms** (1.000 → 0.652): se leía como un chasquido con
    una cola lenta. Con `--easing-standard` la progresión medida es 1.000 → 0.986 → 0.806 →
    0.300 → 0.048 → 0.000 sobre 800ms, o sea la línea recorre de verdad. **Es el único lugar
    de esta página donde la curva premium es la equivocada** — acá el efecto es el
    RECORRIDO, no la llegada.
  - Verificado: 6 outlines, la activa en `stroke-dashoffset: 0` y las demás en 1, color
    `rgb(61, 154, 211)`, 2px, radio 8px. Hover y estado activo comparten la regla.
- **2026-08-09 — el Leistungsumfang deja de ser una lista con flecha: son CARDS con sombra
  y el título se marca con FONDO** (client: "en vez de ser así la lista quiero que sean
  cards horizontales con drop shadow y el texto dentro… sacás las flechas… cuando estamos
  arriba de una es un poquitín más grande y se subraya el fondo del título, como se subraya
  en la sección de 'So läuft es bei FRANKONIA'").
  - **Las flechas se fueron del markup (6) y del CSS**, incluida la regla base que las
    ocultaba en el layout móvil — ya no hay nada que ocultar. También se fue la columna
    reservada que el h3 y el párrafo indentaban (`--flow-arrow-lead`).
  - **La marca del título pasó de una raya de 2px a un FILL de fondo**, con el mecanismo de
    `.service-contrast__mark`: gradiente pintado como background y crecido de 0 a 100 %,
    `box-decoration-break: clone` para que sobreviva un salto de línea, y padding inline +
    radio para que lea como marcador y no como bloque.
    ⚠️ **El texto del título SIGUE OSCURO**, no pasa a blanco como las marcas del Vorteile,
    y es una decisión de contraste: aquéllas están a 22px+, donde el blanco sobre la mezcla
    profunda funciona; éste es de ~21px REGULAR, o sea bajo el umbral de 24px de "texto
    grande", así que necesita 4,5:1 y blanco sobre #3D9AD3 daría **3,11:1**. Casi-negro
    sobre #3D9AD3 mide **6,72:1** — mantener el título oscuro es justamente lo que permite
    usar el azul del CTA acá.
  - **El h3 pasó a `display: block`** (era flex por la flecha): con flex o block-level el
    fondo se pintaría a lo ancho de toda la card en vez de abrazar las palabras.
  - ⚠️ **El riesgo real era el ALTO, y está medido.** Estas seis viven en una columna sticky
    que tiene que entrar en una pantalla; convertirlas en cards agrega padding y gaps. Con
    padding ajustado y `gap: --space-3` la lista mide **635px en una columna de 650** — sigue
    entrando, así que el script no tiene que deslizarla. Cualquier px que se agregue acá son
    6px de lista.
  - **Activo y hover comparten tratamiento**: `scale(1.02)` con `transform-origin: left`
    (un transform no le cuesta layout a la lista, que es lo que permite agrandarla sin
    romper el encaje), sombra más fuerte y la marca al 100 %. Medido: la activa en
    `matrix(1.02…)` con marca `100% 100%`, las inactivas en `0px 100%`.
  - Sólo en el layout de escritorio (`.service-flow--stepped`). En teléfono la sección es
    otra composición —texto y fotos intercalados— y ahí siguen siendo bloques de texto;
    verificado que no quedaron flechas ni scroll horizontal.
- **2026-08-09 — los numerales de las cards al azul del CTA** (client: "los números tienen
  que ser del celeste del CTA"). Verificado renderizado: `rgb(61, 154, 211)`.
  - ⚠️ Escrito `--color-blue-light`, **no** `--color-accent`: la sección es
    `.section--light` y ese scope re-declara el token a blue-dark (#5287C9).
  - ⚠️ **CAVEAT DE CONTRASTE ACEPTADO, y este es real.** Texto de 14px sobre blanco
    necesita 4,5:1; **#3D9AD3 sobre blanco mide 3,11:1**. Medidas para quien lo revise:

    | | sobre blanco |
    |---|---|
    | #3D9AD3 (el fill del CTA, lo que se usa) | **3,11:1** |
    | #5287C9 (`--color-accent` acá) | 3,71:1 |
    | blue-dark 85 % + negro #4673AB (lo que reemplazó) | 4,88:1 |

    El cliente eligió el azul del CTA sobre la mezcla segura **tres veces en esta página**
    (el fill de las cards de casos, el fill del Leistungsumfang, esto), así que queda
    registrado y no revertido. Dos cosas achican el costo: el numeral es `aria-hidden`,
    o sea decoración — el `<h3>` al lado carga el significado — y repite la posición que
    el propio `<ol>` ya numera.
    **Si alguna vez se revisa, la palanca es el TAMAÑO, no el tono**: a 18,66px bold o
    24px regular el numeral cuenta como texto grande, donde aplica 3:1 y #3D9AD3 pasa.
- **2026-08-09 — las cuatro cards en UNA fila** (client: "hacéme las cuatro cards en una
  misma fila, con el mismo estilo que tienen ahora pero más angostas así entran las 4").
  Mismo panel — mismo borde, radio, sombra y hover; lo que cambia es el ancho y todo lo que
  estaba calibrado para una card de 569px.
  - **A partir de 1100px, no de 900**: cuatro cards más tres gaps necesitan lugar. Entre 900
    y 1099 sigue aplicando el 2x2, o sea degrada al diseño anterior y no a cuatro columnas
    ilegibles. Abajo de 900, una sola columna.
  - ⚠️ **El offset alternado de 28px se CANCELA a cuatro por fila.** En un 2x2 daba ritmo;
    en una sola fila de cuatro se lee como desalineación. Hay que restatear los DOS
    transforms (reposo y hover) o las pares se quedan con sus 28px — el mismo cuidado que
    ya pide la composición desde custom properties.
  - **La ilustración quedó un punto más grande de lo que daría un escalado directo**
    (`clamp(7.5rem, 11vw, 11rem)`): el cliente venía justo de pedir ilustraciones más
    grandes cuando cambió de idea hacia una fila, así que la escena conserva toda la
    presencia que permite una card de ~290px.
  - Medido: a **1440** son 4 columnas, cards de **290px** y **416px** de alto todas iguales,
    arte 158px = **38 %**, título 18px, y la sección baja de **1812 a 1158px**. A **1100**
    siguen las 4 columnas pero la card cae a 216px y el arte al 27 % — es el límite útil de
    este layout, y es exactamente por qué el corte está ahí y no más abajo. A **1024** vuelve
    al 2x2 (cards de 419px) y a **390** a una columna. Sin scroll horizontal en ninguno.
- **2026-08-08 — Anwendungsfälle REDISEÑADA: cuatro paneles editoriales blancos** (brief
  del cliente: "convert the 4 use cases into full self-contained cards… high-end B2B /
  premium SaaS / editorial, not generic cards"). Copy, ilustraciones y orden intactos.
  - **Se fue, por instrucción**: el spine azul vertical, los rectángulos azules de texto y
    la separación entre ilustración y copy. Cada caso es UN panel blanco ahora, con la
    ilustración arriba y número → título → descripción abajo. `js/case-timeline.js`
    (que existía para dibujar el spine) fue reemplazado por **`js/case-cards.js`**; todo
    está en git.
  - **La card**: blanco sobre sección blanca, así que la separación tiene que venir del
    borde y la sombra — no hay relleno que contraste. Borde `rgb(1 1 1 / 0.07)`, radio
    **1.5rem** y sombra de **dos capas** (`0 18px 48px / 0.07` + `0 2px 6px / 0.04`).
    ⚠️ No `--shadow-lg`: ese token es una sola capa al 0.14 calibrada para el submenú del
    nav, y a este tamaño lee como sombra caída, no como elevación. Y el radio es **el mismo
    literal 24px que ya usa la price card** en vez de un segundo valor fuera de escala — el
    brief pide 24–32px y ningún token cae ahí, así que el sitio mantiene UN solo valor
    fuera de la escala, no dos.
  - **La ilustración lleva alto FIJO, no aspect-ratio.** El alto de la card sale de su
    copy, y un ratio cuadrado sobre una card de ~560px la dejaba en 70 % de ella. Con
    `clamp(9rem, 14vw, 13rem)` mide **45 % de la card a 1440**, justo en el 40–45 % del
    brief. El `<svg>` inline tiene viewBox, así que `meet` centra el dibujo cuadrado sin
    deformarlo.
  - ⚠️ **EL TRANSFORM DE LA CARD SE COMPONE DESDE CUSTOM PROPERTIES.** Tres cosas quieren
    moverla: el offset de reposo de la columna par (28px), el hover, y la entrada — y la
    última es de GSAP. Si GSAP escribiera `transform` borraría las otras dos la primera vez
    que corre. El script escribe `--card-y` / `--card-s` y **cada** regla de transform
    suma su propio offset. Verificado con `CSS.forcePseudoState`: en reposo la impar está
    en y=34 y la par en 62 (28 + 34 de la entrada); con hover forzado dan **29 y 57**, o
    sea las dos suben 5px y **la par conserva sus 28**.
  - **La entrada es del brief**: opacity 0 → 1, `--card-y` 34px → 0, `--card-s` 0.98 → 1,
    0.7s, `expo.out`, stagger de 0.08s por card. **No scrubbeada** — el brief especifica
    una duración, que es una afirmación sobre tiempo y no sobre distancia de scroll, así
    que cada card se reproduce una vez al entrar y no se rearma si volvés a subir.
  - **El dibujado de las ilustraciones se conservó** aunque el brief no lo menciona: lo
    pidió el cliente el 2026-08-07 y es una firma de esta página. Arranca a 0.35 de la
    entrada, superponiéndose a su cola (la card está visualmente asentada mucho antes de
    que termine su 0.7s, porque `expo.out` llega temprano a su valor final). **Si con el
    rediseño lo quiere afuera, es borrar un bloque.**
  - **El título sigue CENTRADO**, contra el "do not center unless already consistent with
    the page system" del brief: lo pidió el cliente explícitamente el 2026-08-08 y hay otras
    dos secciones centradas en esta página (Abgrenzung y FAQ), así que sí es consistente.
  - Medido a 1440: cards **451–484px** (el brief pide no ser excesivamente alta), sección
    **2114 → 1725px**, offset de la columna par 28px, título **26px** (era 20), número en la
    mezcla profunda de §5 (4,88:1 — ⚠️ NO `--color-accent`, que en `.section--light` es
    blue-dark a 3,71:1 y es texto chico), cuerpo en gris oscuro. Con
    `prefers-reduced-motion` las cuatro cards en opacidad 1 y los cuatro dibujos completos.
    Sin scroll horizontal a 390 / 768 / 1440.
  - ⚠️ **DISCREPANCIA DE COPY, no aplicada:** el brief transcribe "Pf**ö**rtendienst" y el
    draft aprobado (`Webtext 03`) dice "Pfortendienst". Como el mismo brief pide no
    reescribir el copy, quedó el del draft. Vale confirmarlo con Chris.
  - En teléfono la ilustración queda en 35 % de la card (el clamp toca su piso de 9rem
    mientras la card crece con el texto). El 40–45 % era una especificación de escritorio.
- **2026-08-08 — vuelve el zigzag, pero ESCALONADO y junto** (client: "al final las quiero
  un poco más intercaladas, primero una a la izquierda, después a la derecha, después a la
  izquierda de vuelta y derecha, pero no tanta distancia, bastante juntas pero
  escalonadas"). Reemplaza las dos por fila; eso está en git.
  - Vuelve el ancho al 50 % con auto-margin en las pares y `gap: 0` + `margin-top` negativo.
    Un grid de dos columnas no sirve acá: pondría los casos consecutivos en la MISMA fila,
    que es justo el layout que esto reemplaza.
  - ⚠️ **El solape tiene un techo duro, y conviene saber de dónde sale.** Los casos n y n+2
    comparten columna, así que chocan salvo que el PASO (alto del item menos el solape) sea
    al menos medio item. Los items miden 503–535px, o sea el paso no puede bajar de ~268px.
    Con 15rem el aire entre los casos 1 y 3 quedaba en **23px** (son los dos más bajos, así
    que ese par es el ajustado); con **14rem** da **55px** ahí y 87 entre el 2 y el 4 —
    junto sin leerse como que casi se tocan. **Si el marco de ilustración crece, este valor
    tiene que bajar con él.**
  - Medido a 1440: pasos **280 / 279 / 310px**, lados izq/der/izq/der, lista 1372px y
    sección 2114. Y como el desktop ya no declara `grid-template-columns`, el script lee 1
    columna y **vuelve a revelar de a uno**, que es la secuencia pedida.
  - El nodo vuelve a los dos lados (mientras dos casos compartían fila caían sobre los
    mismos 8px de línea y uno sobraba). Sin scroll horizontal a 390 ni 1440.
- **2026-08-08 — el dibujado de las ilustraciones ahora se VE** (client: "quiero que las
  ilustraciones también se formen con las líneas que se van trazando con el scroll").
  - **Ya estaba corriendo** — medido antes de tocar nada: 99/86/84/66 trazos sin dibujar
    antes de entrar, 30/99 y 29/86 a mitad de camino, 0 al final. Lo que fallaba era que
    **casi todo pasaba detrás del fade de su propia card**: el item anima `opacity: 0 → 1`
    en 0.26 y el dibujo arrancaba en el MISMO instante y duraba 0.54, así que su primera
    mitad ocurría mientras la card todavía era transparente. Sólo se veía la cola.
  - **Arranca en `at + 0.1`, después de que la card llega**, y dura más (0.34/0.2 →
    **0.42/0.3**). ⚠️ 0.1 y no los 0.26 completos del fade: `power3.out` alcanza su valor
    final muy temprano dentro de su propia duración, así que la card *parece* asentada
    mucho antes de que el tween termine — esperar el número dejaba **~400px de scroll con
    la card arriba y la escena en blanco** (medido). Con 0.1 empieza cuando la card
    visualmente aterriza.
  - **Medido después, muestreando cada 100px de scroll**: la card sube de 0 → 1 entre −800
    y −600, y el dibujo corre de ≈−250 a +50 con la card **en opacidad 1 todo el tiempo**
    — 72/99 → 39/99 → 4/99 → 0. O sea el trazado entero ocurre a la vista.
  - Con `prefers-reduced-motion` las cuatro escenas siguen completas en toda posición.
- **2026-08-07 — el timeline pasa a DOS CASOS POR FILA y las cards vuelven a ser azules
  glossy** (client: "en vez de que aparezcan de a uno que aparezcan de a dos… 01 y 02 en la
  misma fila y después los últimos dos en la misma" + "que las cards sean celestes con el
  efecto del CTA").
  - **Dos columnas de grid reales**, así 01|02 comparten la fila 1 y 03|04 la fila 2 por
    auto-placement — sin un `grid-row` por item, lo que además deja el bloque correcto si
    alguna página de servicio tiene tres o seis casos. Reemplaza el zigzag de a uno con el
    interleave por margen negativo; está en git, y ese interleave existía sólo para
    recuperar la columna muerta que deja un zigzag de a uno — con dos por fila no hay
    ninguna.
  - **Los pares llegan juntos, y cuántos son sale de MEDIR el grid**: la cantidad de tracks
    del `grid-template-columns` computado (2 en desktop, y `none` resuelve a 1 en teléfono),
    no de un breakpoint copiado dentro del script. Una sola cosa decide el layout y es la
    hoja de estilos. Verificado: a 1440 los tops son 947/947 y 1547/1547, y las opacidades
    van `0,0,0,0` → **`1,1,0,0`** → `1,1,1,1`; a 390 el script lee 1 columna y los revela de
    a uno, que es lo correcto apilados.
    ⚠️ Se lee una vez al construir: una ventana redimensionada cruzando los 900px mantiene
    el agrupamiento con el que arrancó hasta recargar. Mismo caveat que cualquier
    `gsap.matchMedia` de esta página, y el costo visible es sólo qué casos comparten beat.
  - **El azul volvió con los valores EXACTOS que tenía**, recuperados de git y no
    re-derivados, así que es la misma superficie que el cliente aprobó el 2026-08-03 y no un
    segundo azul parecido: fill `--color-blue-light` plano, `--shadow-md` + un highlight
    interno de 1px arriba, y el sweep **reutilizando `@keyframes btn-shine`** con delay
    escalonado por card. Medido: `rgb(61, 154, 211)`, texto y numeral blancos, animación
    `btn-shine`.
  - ⚠️ **VUELVE EL CAVEAT DE CONTRASTE con el fill**: blanco sobre #3D9AD3 es **3,11:1** —
    alcanza el 3:1 de componente de interfaz y texto grande, no el 4,5:1 de cuerpo de texto,
    y cada card lleva un párrafo. Es el azul de marca aprobado y el mismo número que ya
    publica cada botón primario, así que queda registrado, no "arreglado" unilateralmente.
    Todo lo mitigable sin cambiar el color está hecho: todos los textos en blanco SÓLIDO (un
    tier de alfa dejaría el párrafo abajo de 3:1) y la jerarquía por tamaño y peso. El
    numeral también pasó a blanco — en la card blanca era azul, y azul sobre azul no se ve.
  - ⚠️ **Un nodo por fila, no dos.** Medido: con nodo en las dos cards de una fila los dos
    caen sobre los MISMOS 8px de línea (716–724 en ambos casos, spine en 720), o sea dos
    cuadrados pintados uno encima del otro. El de la card par se saca con `content: none` en
    vez de dejarlo redundante — dos elementos ocupando los mismos píxeles es cómo un cambio
    posterior termina peleándose consigo mismo.
  - El anillo del nodo es el blanco de la SECCIÓN, no el de la card: el nodo vive afuera de
    la card, sobre la sección. Sin scroll horizontal a 390 ni 1440.
- **2026-08-07 — las 4 ilustraciones del cliente entraron en el timeline y SE DIBUJAN con
  el scroll** (client: "en icons guardé estas 4 ilustraciones para poner en esa sección,
  con los nombres del título y en svg… aplicá el efecto de que se van formando las líneas
  mientras escroleamos"). Reemplazan los frames reservados; ésos están en git.
  `assets/icons/case-{produktion,chemie,mittelstand,logistik}.svg`.
  - ⚠️ **Mapeadas POR NOMBRE, no por posición.** El orden de la captura del cliente es
    Produktion · Chemie · **Logistik** · **Mittelstand**, y el de las cards es 01 Produktion
    · 02 Chemie · **03 Mittelstand** · **04 Logistik** — las dos últimas están cruzadas.
    Verificado en el HTML compilado: cada escena quedó en su card.
  - **Un solo cambio dentro de los archivos: `stroke="white"` → `currentColor`** (99/86/84/66
    paths). Es seguro acá por una razón concreta y chequeada: **los cuatro tienen CERO
    rellenos**, así que no hay oclusión de línea oculta que destruir — que es exactamente lo
    que un remap de color rompió en la card 03 de riesgo. Con `currentColor` las escenas
    siguen el color de texto de la sección donde están, así que sirven igual sobre claro
    (esta sección) que sobre oscuro, sin un segundo archivo.
  - **El dibujado vive DENTRO de `js/case-timeline.js`**, no en `svg-draw.js`: así cada
    escena se forma en el mismo beat que su card, en el mismo timeline scrubbeado — la línea,
    la card y el dibujo son un movimiento, no tres que coinciden. Mismas reglas que los otros
    dos: valores por función para que cada path se dashee con su propia
    `getTotalLength()`, stagger de spread TOTAL (`amount: 0.2`) para que una escena de 99
    trazos no tarde 1,5x más que una de 66, y el dash inline limpiado al terminar. El guard
    que saltea paths con `stroke-dasharray` propio está igual, aunque ninguno de estos cuatro
    tenga uno.
  - **Medido por scroll real a 1440**: `99/86/84/66` sin dibujar antes de entrar → al 30 %
    la escena 1 va en 66/99 y el resto intacto → al 70 % las dos primeras en 0 y la tercera
    en 45/84 → al final los cuatro en 0. O sea **una por una, con su card**. Con
    `prefers-reduced-motion` las cuatro están completas en toda posición.
  - ⚠️ **LO ÚNICO RESTYLEADO DENTRO DE UN DIBUJO DEL CLIENTE EN ESTA PÁGINA**, y la razón es
    específica: los archivos traen `stroke-width="2"` sobre un viewBox de 1180, que al marco
    de 352px renderiza **0,60px efectivos** — un hairline sub-píxel que funciona como blanco
    sobre el fondo oscuro contra el que el cliente diseñó y casi desaparece como oscuro sobre
    blanco. `stroke-width: 4` por CSS da **1,19px**, que es donde vive el resto del line art
    del sitio (escenas de riesgo 0,7–1,06px, iconos del Konzept 1,22px).
    Es seguro porque **los 66–99 paths de cada archivo comparten UN solo width y ninguno
    tiene `stroke-dasharray`** — las dos cosas que hicieron que este tipo de override
    destruyera los cajones de la card 03. No toca fill ni color, y `getTotalLength()` no se
    altera, así que el dibujado queda igual.
  - El marco pasó de 16:9 a **1:1**, porque los cuatro archivos son cuadrados (viewBox
    1180x1180) — un solo ratio mantiene las cuatro escenas a la misma escala óptica. Tinta
    real 984x922 dentro del viewBox, o sea traen su propio margen. Caja 352px a 1440 y 326 a
    390. Color `rgb(1 1 1 / 0.82)`, no negro pleno: a contraste total 80 y pico de hairlines
    le ganan al título de su propia card.
- **2026-08-07 — el spine y los nodos al azul del CTA, y TODO el texto a la derecha**
  (client: "me gustaría que la línea sea azul como el CTA y los puntos también, y que los
  textos estén todos alineados a la derecha").
  - ⚠️ **Escrito `--color-blue-light`, NO `--color-accent`**, y esa distinción es la que
    importa acá: la sección es `.section--light`, y ese scope RE-DECLARA `--color-accent` a
    blue-dark (#5287C9). El token habría dado el azul equivocado. Misma trampa que ya
    documenta el fill del Leistungsumfang. Medido: spine y nodos en `rgb(61, 154, 211)`.
  - **El NUMERAL se queda en `--color-accent` a propósito**: es TEXTO, y #3D9AD3 sobre
    blanco mide 3,11:1. La línea y los nodos son gráficos y les alcanza el mínimo de 3:1;
    un numeral no. Blue-dark le da 3,71:1.
  - **La alineación terminó a la IZQUIERDA**, en los cuatro casos y a todo ancho. Pasó por
    la derecha en el medio (pedido y revertido en dos mensajes seguidos el mismo día), y el
    estado final no declara nada: izquierda es la dirección base, así que las cuatro cards
    usan la misma estructura numeral-después-texto que ya usaba el layout de teléfono.
    **Las dos columnas NO se espejan** — una alineación y una estructura de card, de los dos
    lados. Verificado: `text-align: start` en los cuatro items y en los cuatro `h3`, a 390 y
    a 1440.
  - ⚠️ Si alguna vez hay que correr algo de lado en este bloque, **no usar `justify-items`**:
    vuelve content-sized a todo hijo y colapsa el frame de ilustración al ancho de su
    etiqueta (medido 130px contra 352 cuando los items impares lo usaban). Va un auto-margin
    en el frame.
  - Sin scroll horizontal a 390 ni 1440.
- **2026-08-07 — Anwendungsfälle rehecha como TIMELINE VERTICAL con spine central**
  (client: "aparece el título y luego escroleo y aparece una línea vertical en el centro de
  la web que empieza a formarse para abajo mientras voy escroleando, y van saliendo las
  distintas cards en orden, la primera para la izquierda, la segunda para la derecha,
  tercera izquierda de vuelta y la cuarta derecha"). Era una grilla 4-up de cards azules
  glossy. **Mismos cuatro casos, mismo copy, mismo orden.**
  - **`js/case-timeline.js`**, nuevo, page-specific. **UN solo timeline scrubbeado maneja
    las dos mitades**, que es el punto: la línea y las cards no son dos efectos que se
    superponen, son un movimiento. El spine es un `scaleY` alimentado por `--spine` (un
    pseudo-elemento no puede ser target de GSAP, así que el valor va en la lista) y cada
    caso se coloca en SU punto de ese mismo timeline, así una card aterriza justo cuando
    la línea la pasa.
  - **La dirección horizontal sale del índice en el DOM, no de un atributo por item**:
    impares a la izquierda del spine y entran desde la izquierda, pares al espejo. El CSS
    alterna con `:nth-child` también — una sola regla sobre el orden, en dos lugares que no
    pueden discrepar.
  - **Medido por scroll real a 1440**: spine 0 → 0,29 → 0,69 → 1, y las opacidades van
    `0,0,0,0` → `1;0,74;0,0` → `1,1,1;0,49` → `1,1,1,1`. O sea **en orden, a medida que la
    línea baja**. Lados: izquierda/derecha/izquierda/derecha. Con
    `prefers-reduced-motion` los cuatro casos están en opacidad 1 en toda posición y el
    spine nunca se escribe (queda en su `scaleY(1)` por defecto).
  - ⚠️ **INTERLEAVED en desktop, y no es cosmético.** Cada caso ocupa media columna, así que
    apilados dejaban la columna opuesta vacía a lo alto de cada caso: **1436px de espacio
    muerto y una sección de 2466px**, contra ~700px de la grilla que reemplaza.
    `gap: 0` + `margin-top: -9rem` en los siguientes → sección **1746px**. En teléfono no
    se aplica: ahí todo es full width y no hay hueco que recuperar.
  - ⚠️ **Bug real que encontró la medición:** los frames de ilustración salían de tamaños
    distintos — **130px en los items impares contra 352 en los pares**. Causa:
    `justify-items: end` (que usaba para arrimar la columna izquierda al spine) hace que
    TODO hijo sea content-sized, y el frame colapsaba al ancho de su etiqueta. Se arrimó
    con un auto-margin propio del frame y `width: 100%` + `max-width`. Los cuatro miden
    **352x198 a 1440 y 326x183 a 390**, idénticos.
  - **Las ilustraciones son FRAMES RESERVADOS** hasta que lleguen los SVG del cliente
    (dijo que los manda). Reservan el espacio real, así que no hay CLS cuando entren —
    mismo patrón que el retrato reservado de Jäger. **Ratio 16:9, 352x198 a 1440**: conviene
    exportarlas cerca de eso.
  - ⚠️ **Las cards azules glossy se fueron con la grilla**, y eso REVIERTE la decisión del
    cliente del 2026-08-03 ("que tengan el mismo estilo que el CTA, azules y brillosas").
    Razón: se eligieron para cuatro cards iguales paradas solas, y un panel azul glossy
    debajo de una ilustración de línea sobre sección blanca pelea con ella. Está todo en
    git y volver es una regla. **Con eso también se retira el caveat de contraste de
    3,11:1** que ese bloque cargaba: el copy ahora es oscuro sobre blanco.
  - El canal del spine es `--cases-gutter`, chico en teléfono (a `--space-9` la card se
    quedaba en 254px de 390) y grande en desktop, donde es el espacio ENTRE las dos
    columnas. Sin scroll horizontal a 390 ni 1440.
- **2026-08-07 (séptima y última pasada del hero) — el alto es EL PUNTO MEDIO LITERAL de
  los dos extremos** (client: "pasaste de un extremo a otro, esto es muy corto de height y
  lo otro era mucho, ¿no podés hacer algo intermedio? literal en el medio").
  - Los dos extremos están **nombrados** y el `min-height` es su promedio, para que la
    expresión se lea como lo que es:
    `--service-hero-screen-h` (una pantalla) y `--service-hero-tall-h` (el alto natural de
    la foto a 100vw más la banda). `min-height: calc((screen + tall) / 2)`.
  - **Salió mejor que un compromiso**: al punto medio la caja sigue siendo más ALTA de
    proporción que la foto a 1440 (1,37 contra 1,45), así que `cover` escala por alto y se
    ve el **100 % del alto igual**; el recorte se va al ancho, que el cliente dijo que no
    importa.

    | | corto | **medio** | alto |
    |---|---|---|---|
    | hero @1440 | 916 | **1055** | 1193 |
    | hero @2000 | 1106 | **1343** | 1579 |
    | alto de imagen @1440 | 92 % | **100 %** | 100 % |
    | alto de imagen @2000 | 80 % | **97 %** | 100 % |

  - ⚠️ **El copy se centra en LA PRIMERA PANTALLA, no en todo el hero**, y ese es el ajuste
    que hace que las tres cosas convivan. El hero al punto medio es más alto que una
    pantalla, así que centrar en él bajaba el H1 a 348 (medido) — 165px debajo del homepage,
    deshaciendo el "a la misma altura que el homepage" de la pasada anterior. Centrando
    dentro de una pantalla de caja el H1 queda en **298 a 1440 y 393 a 2000**, contra 183 y
    361 del homepage: **32px a la resolución del cliente**. El alto extra del hero queda
    como más fotografía bajo el fold.
  - ⚠️ **Las tres restricciones no son simultáneamente satisfacibles y conviene saberlo antes
    de la próxima vuelta**: "hero al punto medio" + "copy centrado" + "H1 exactamente a la
    altura del homepage". El homepage centra su copy sobre TODA su caja porque no tiene
    breadcrumb, y su bloque mide ~500px contra los ~443 de acá. Lo más cerca que se llega
    centrando es esto; exacto sólo sale alineando arriba, que el cliente ya rechazó.
  - Trust band dentro de la primera pantalla en los tres anchos (740 de 900, 835 de 1090,
    713 de 844). Sin scroll horizontal.
- **2026-08-07 (sexta pasada del hero) — vuelve a UNA PANTALLA y el copy vuelve a
  CENTRARSE** (client: "tiene mucha height la hero, hacela más chica" + "el contenido de
  texto tiene que estar centrado a nivel altura, ahora está alineado arriba, a la misma
  altura de como está el texto en la homepage").
  - ⚠️ **ESTO REVIERTE dos pasadas de hoy, y el conflicto es geométrico, no de gusto.**
    Con `cover`, el alto completo de una foto de proporción 1,45 sólo se ve cuando la caja
    mide al menos `ancho / 1,45` — **993px a 1440, 1379px a 2000**. Un hero de una pantalla
    es más bajo que eso, así que el recorte vuelve a caer en el alto: **92 % visible a
    1440, 80 % a 2000** (medido). Pedir hero más chico Y alto completo no se puede
    satisfacer en un viewport ancho; el cliente eligió el hero más chico. La versión
    `max(una pantalla, 100vw * 1118 / 1621) + banda` está en git.
  - Con el hero de vuelta en una pantalla, la foto vuelve a llenar la sección (`inset: 0`)
    y **la banda de disolución vuelve a superponerse a sus últimos 200px**, que es para lo
    que `.pixel-seam--photo` se construyó. El borde inferior volvió al fade suave (era
    negro pleno): ya no hay un "acá se cortó la imagen" que tapar, y un negro abajo pelearía
    con la banda que ahora va encima.
  - **`align-self: center`** otra vez en el copy. El `start` de dos pasadas atrás tenía una
    razón buena — el hero medía 1193px y centrar ahí ponía el H1 en 436 — y esa razón
    desapareció con el hero más bajo.
  - **El top padding del modificador pasó a `--space-3 + overlap` (los 112px que usa el
    homepage) en vez de `--space-7`**: sube el breadcrumb pegado al nav, y eso levanta el
    copy centrado en la fila de abajo. Midió H1 297 → **279** a 1440 y 392 → **374** a 2000.
  - **Comparación medida contra el homepage** (H1 top):

    | viewport | homepage | werkschutz | dif |
    |---|---|---|---|
    | 2000x1090 | 361 | **374** | 13px |
    | 1440x900 | 183 | 279 | 96px |
    | 390x844 | 216 | 163 | −53px |

    A la resolución del cliente son 13px. ⚠️ Los 96px que quedan a 1440 son
    estructurales y no se cierran sin dejar de centrar: el homepage centra su copy sobre
    TODA su caja (no tiene breadcrumb) y su bloque de copy es ~500px de alto contra los
    ~443 de acá, así que centrar dos bloques distintos en dos cajas distintas no da la
    misma y. "Centrado" y "a la misma altura que el homepage" son compatibles sólo por
    aproximación.
  - Trust band dentro de la primera pantalla en todos los anchos medidos (722 de 900 a
    1440, 817 de 1090 a 2000, 713 de 844 a 390). Sin scroll horizontal.
- **2026-08-07 — el bloque de certificaciones del Ansprechpartner adopta el LAYOUT de
  `/referenzen/`, no sólo el tamaño de los sellos** (client, con las dos capturas al lado:
  "los badges en la página de werkschutz están como la primera foto y quiero que estén
  como la segunda foto, referenzen"). Mi primera lectura fue que era sólo el tamaño; era
  la composición entera.
  - Era **sellos a la izquierda / tres líneas a la derecha**; ahora es **sellos centrados
    arriba y los tres estándares como tres columnas centradas** debajo, cada una con el
    nombre del estándar en blanco arriba y el texto de apoyo muted abajo, con su propia
    regla superior. Valores tomados de `.ref-certs*`: `text-align: center`,
    `justify-content: center` en los sellos, la lista a `repeat(3, minmax(0, 1fr))` desde
    **700px** con `max-width: 56rem`. Mismo breakpoint que `/referenzen/` a propósito, para
    que los dos rompan al mismo ancho y no a dos parecidos.
  - **La asignación de grid-areas del bloque de escritorio se BORRÓ** (`"seals lines"`).
    Dejarla habría seguido forzando las dos columnas que este cambio viene a sacar.
  - **Copy y wording intactos** — sólo cambió el arreglo. Y `/werkschutz/` sigue **sin** la
    línea "Mitglied im Wirtschaftsclub Bamberg und im Deutschen Mittelstands-Bund" que
    `/referenzen/` tiene debajo de sus columnas: eso es copy del draft de esa página, no se
    pidió acá y no se inventó. Es un `<p>` si se quiere.
  - Verificado en las dos páginas a la vez: a **1440** ambas centradas, 3 columnas, los 3
    ítems en UNA fila, sellos centrados respecto del bloque; a **390** ambas en 1 columna
    con los 3 ítems apilados. Sin scroll horizontal.
    Una diferencia esperada: la lista mide 811px acá contra 896 en `/referenzen/` — el
    `max-width: 56rem` no se alcanza porque este bloque vive dentro del `--content-inset`
    de la página. El ancho disponible es la restricción, no el cap.
  - ⚠️ **Segunda copia de esa composición, en un segundo archivo page-scoped.** Un tercer
    consumidor tiene que promover `.ref-certs*` a `page-service.css` (que `/referenzen/` ya
    carga como chasis) en vez de una tercera copia. Mantener las dos en sincro hasta
    entonces.
- **2026-08-07 — los sellos DEKRA del Ansprechpartner al tamaño de los de `/referenzen/`**
  (client: "en la parte que aparecen los iconos de DEKRA quiero que aparezcan así como
  aparecen en la otra sección"). `8.5rem` fijo (136px) → **`clamp(5rem, 3rem + 4vw, 7rem)`**,
  o sea 80–112px.
  - **Se preguntó antes de hacerlo, y valió la pena**: "aparecer" acá podía ser el tamaño
    o la animación de entrada, y los sellos existen en TRES tamaños en el sitio (hero de
    esta página 44px, este bloque 136px, `/referenzen/` 80–112px). Elegir mal significaba
    rehacerlo. El cliente eligió el de `/referenzen/`.
  - El clamp es **el valor literal de `.ref-certs__seal`, copiado a propósito** en vez de
    re-derivado, así los dos bloques miden lo mismo a cada ancho en lugar de ser dos
    tamaños parecidos. Verificado en las dos páginas a la vez: **106x70 a 1440 y 80x53 a
    390**, ratio **0,665 = 399/600 exacto** en ambas, o sea las proporciones oficiales de
    DEKRA intactas (se pueden escalar, nunca recortar ni distorsionar).
  - ⚠️ **Dos consumidores en dos archivos page-scoped.** Un TERCERO tiene que promover esto
    a una clase compartida en `page-service.css` (que es el chasis de `/referenzen/`, así
    que la alcanza) en vez de una tercera copia. Los sellos de 2.75rem del hero NO son este
    caso: son un chip compacto de trust row, otro trabajo.
- **2026-08-07 (quinta pasada) — el copy del hero a la MISMA altura que el del homepage, y
  la disolución arranca antes** (client: "¿podés hacer que el scroll afecte antes a los
  píxeles? porque como es al revés el efecto demora mucho en pasar" + "este contenido tiene
  que estar a la misma altura que el contenido de la izquierda de la homepage, no sé por
  qué en werkschutz está muchísimo más abajo").
  - **La altura del copy: medido, el H1 del homepage arranca en 183 y este estaba en 436**
    — 253px más abajo. La causa: el copy se centraba (`align-self: center`) dentro de la
    fila 1fr, y esa fila se volvió mucho más alta cuando el hero creció para contener la
    foto MÁS la banda. Con `align-self: start` el copy se apoya directamente bajo el
    breadcrumb: **H1 en 185 contra 183, o sea 2px**. La diferencia que queda es el
    breadcrumb, que el homepage no tiene — no hay forma de tener un breadcrumb sobre el H1
    y el H1 exactamente en la y del homepage.
  - **El timing: el rango del seam se adelantó, y el diagnóstico importa.** Los defaults
    (`top 80%` → `top 20%`) asumen que la banda está en el TOPE de la sección siguiente,
    o sea justo en el borde que el visitante percibe. `.pixel-seam--photo` rompe eso: su
    banda mide 200px y vive al fondo del hero, así que el elemento del seam queda una
    banda entera POR DEBAJO de donde la disolución empieza visualmente, y todo el rango
    llegaba con ese retraso. Medido antes: recién alcanzaba el 100 % a scrollY ~1013, con
    la banda en viewport −20 → 180, o sea **terminaba mientras se iba por arriba**.
  - **`data-seam-start` / `data-seam-end`, overrides opcionales por seam** en
    `js/pixel-transition.js` (los defaults no cambiaron, así que ningún otro seam se
    movió). Este usa `top 95%` → `top 45%`. Medido después:

    | scrollY | banda en viewport | tiles navy |
    |---|---|---|
    | 250 | 727 → 927 | 0 % |
    | 350 | 627 → 827 | 17 % |
    | 550 | 427 → 627 | 53 % |
    | 750 | 227 → 427 | 87 % |
    | 850 | 127 → 327 | **100 %** |

    O sea empieza en cuanto la banda entra en pantalla y **termina con la banda todavía a
    127px del borde superior**, ~163px de scroll antes que antes y, sobre todo, a la vista.
  - `align-self: start` va sólo en el bloque de escritorio, así que el teléfono (donde el
    hero no es grid y el copy ya iba arriba) no cambió.
- **2026-08-07 (cuarta pasada) — la banda ya no le come alto al hero: la foto tiene su
  propia caja y la disolución vive DEBAJO** (client: "como quedó, para arriba me roba
  height del hero y no me gusta mucho, quiero que haya un poco más aire; si se termina la
  imagen, nomás degradala a negro").
  - **El problema era real y medible:** la banda se superponía a los últimos 200px de la
    foto, así que 200px de fotografía quedaban permanentemente bajo tiles navy y el hero
    se veía 200px más corto de lo que era.
  - **Ahora `--service-hero-photo-h` es la caja de la FOTO y el hero es esa altura MÁS la
    banda.** La foto deja de estirarse a toda la sección (`bottom: auto` la libera del
    `inset: 0` de la regla base) y la banda ocupa espacio que es negro propio del hero.
    Medido: a 1440 hero **1193 = 993 de foto + 200 de banda**, a 2000 **1579 = 1379 +
    200**, a 390 **980 = 860 + 120**, y en los tres
    **la banda arranca exactamente donde termina la foto** (borde a borde, 0px de
    diferencia). 100 % del alto de la imagen visible y nada de eso bajo los tiles.
  - **El borde inferior de la foto ahora va a NEGRO PLENO** (era 0,4), instrucción textual
    del cliente: debajo de ese borde el hero es su propio negro, así que cualquier valor
    menor que 1 dejaba una línea visible donde la fotografía se corta.
  - ⚠️ **`--service-hero-band-h` lo declara EL HERO, no la banda**, y es la corrección de
    un bug real: el hero tiene que sumar el MISMO número que mide la banda para que ésta
    empiece donde termina la foto. La primera versión sumaba 200px fijos y en teléfono la
    banda mide 120 → **80px de negro muerto** entre la foto y la disolución (medido). La
    banda es descendiente del hero, así que hereda la variable y no pueden discrepar.
    ⚠️ Igual queda expresada dos veces (200/120 acá y en `.pixel-seam__band`) porque los
    otros seams de la página no están dentro de su hero. Mantenerlas en sincro.
  - ⚠️ **TERCERA VEZ de la misma trampa de especificidad** y por eso quedó anotada en el
    código: la regla compartida `.service-hero` del bloque de escritorio pone
    `min-height: calc(100svh - 8rem)` y es (0,1,0) igual que `.service-hero--bleed`;
    dentro del mismo bloque va ANTES, así que ganaba por orden y **el hero colapsaba a
    772px con su caja de foto en 993** (medido). El modificador tiene que RESTATEAR su
    min-height ahí, no heredarlo.
  - La trust band sigue dentro de la primera pantalla, ahora más justo: **878 de 900** a
    1440 y 1072 de 1090 a 2000. Si el copy crece, es lo primero que se cae del fold.
  - Sin scroll horizontal a 390 / 1440 / 2000.
- **2026-08-07 (tercera pasada) — los tiles del seam llevan el DEGRADADO de la sección
  de abajo, no un navy plano** (client: "no respeta el degradado que hay en la sección de
  abajo, que en realidad está funcionando con un degradado el fondo").
  - **Tenía razón otra vez, y es el bug de "dos navies" que este archivo ya documenta.**
    `.service-risk` arranca en #00091F iluminado por `--color-blue-light` al 0,38, que
    decae a 0 en sus primeros 340px. Un tile de #00091F plano se lee como un navy más
    oscuro saliendo hacia una sección más clara — exactamente lo que
    `.pixel-seam--konzept` del homepage existe para evitar.
  - **La solución es un fondo A LO ANCHO DE LA BANDA reconstruido ENTRE los tiles**: cada
    uno recibe el degradado completo de la banda vía `background-size` y después se
    desplaza a su propia fila con `background-position`. La rampa va de **0,38 en el
    BORDE INFERIOR de la banda** (donde toca el tope de la sección, así los dos son
    continuos) a 0 en el superior, espejando el decaimiento de la sección — o sea el
    seam y la sección se leen como una sola banda iluminada.
  - **`js/pixel-transition.js` ahora expone `--pixel-row` y `--pixel-col` en cada tile.**
    Dos líneas, genérico, sin cambio de comportamiento para ningún seam que las ignore —
    y es lo que permite que un seam pinte un fondo de banda completa entre sus tiles.
    Medido a 1440: 5 filas, `background-size: 100% 200px` y posiciones
    **0 / −40 / −80 / −120 / −160px**, o sea cada tile muestra su propia franja de 40px
    del degradado de 200px. 180/180 opacos al final.
  - **El alto de la banda se hoisteó a `--pixel-band-h`** (200px, 120px en teléfono) porque
    el `height` y el `background-size` tienen que usar el MISMO valor; dos copias
    derivarían.
  - ⚠️ Mantener el 0,38 en sincro con el primer stop de `.service-risk` y el literal navy
    con su `background-color`. Son tres lugares que describen una sola superficie.
  - Verificado a 390 / 768 / 1440: 100 % del alto de la foto visible, la banda entera
    dentro del hero (el `overflow: hidden` no la recorta), tiles transparentes en reposo y
    sin scroll horizontal.
- **2026-08-07 (segunda pasada del mismo hero) — SE VE EL ALTO COMPLETO DE LA FOTO, y la
  disolución de píxeles ahora trabaja SOBRE la foto** (client: "¿estás seguro que se está
  usando todo el height de la imagen? … mi idea es que se muestre todo el height, el width
  no importa" + "¿ves que hay una línea negra? … quiero que sea transparente y se vea la
  imagen de fondo").
  - **Tenía razón, y era aritmética.** Medido antes de tocar: a 2000px de ancho se veía el
    **79 % del alto** de la imagen y a 1440 el **92 %**. `cover` recorta el eje que
    sobra, y un hero de una pantalla de alto es más ANCHO de proporción (1440/916 = 1,57)
    que la foto (1621/1118 = **1,45**), así que el recorte caía siempre en el alto.
  - **`min-height: max(<una pantalla>, calc(100vw * 1118 / 1621))`.** El segundo término
    es el alto al que la proporción del contenedor IGUALA la de la foto, o sea donde
    `cover` no tiene nada que recortar verticalmente. Gana el mayor de los dos:
    arriba de ~1328px de ancho el hero crece hasta el alto de la foto (y se pasa un poco
    de una pantalla, exactamente lo que hace el hero del homepage); abajo gana el piso de
    una pantalla, y ahí el contenedor ya es más ALTO de proporción que la foto, así que el
    alto completo ya se veía y el recorte cae en el ancho.
    **Medido a 320 / 390 / 768 / 1024 / 1440 / 1600 / 2000: 100 % del alto visible en
    TODOS**, y de 1440 para arriba también 100 % del ancho, o sea sin recorte alguno.
    ⚠️ El `1118 / 1621` tiene que seguir a la foto exportada. Otra proporción reintroduce
    el recorte en silencio.
    **La trust band sigue dentro de la primera pantalla** (778 de 900 a 1440), que era la
    restricción del 2026-08-03 — el copy se centra en la fila 1fr, así que el hero creció
    hacia abajo sin arrastrarlo.
  - **La línea negra era real y el modelo normal del seam no podía funcionar acá.** Los
    tiles de un seam son el color de la sección de ARRIBA pintados sobre la de abajo, así
    que a progreso 0 la banda es una losa sólida de ese color: invisible cuando la sección
    de arriba es negro plano, una **barra negra de 200px sobre la foto** cuando es una
    fotografía.
  - **`.pixel-seam--photo` invierte el modelo entero**, y el script no se tocó — sólo
    cambia en CSS qué SIGNIFICAN sus dos estados:
      · la banda vive **DENTRO del hero**, sobre la foto, en vez de en el padding
        reservado de la sección siguiente (`inset: auto 0 0` + la banda anclada a su
        `bottom`, así el `overflow: hidden` del hero no la recorta);
      · los tiles son el navy de la sección de ABAJO (#00091F, el mismo literal que
        `.service-risk` — mantener los dos en sincro);
      · y van de `opacity: 0` a `1`, o sea **píxeles navy que se van comiendo la foto**
        en vez de píxeles negros que se despejan de encima.
    Verificado por scroll real: 124/180 tiles navy a mitad de camino, 180/180 al final, y
    en la captura se ve el asfalto y la rueda del auto por los tiles que faltan.
  - **Al mover el seam adentro del hero deja de ser hermano previo de la sección Risiko**,
    así que esa sección deja de reservar los 200px de banda automáticamente — medido:
    su `padding-top` volvió a 96px, que es lo correcto porque la banda ya no está en ella.
  - Sin scroll horizontal en ninguno de los siete anchos.
- **2026-08-07 — el hero de `/werkschutz/` es FULL-BLEED: la foto llega al tope de la
  página y baja hasta donde empieza la sección siguiente** (client: "la imagen está
  cortada arriba y abajo, la idea es que sea como la homepage… es como que tiene un width
  limitado y la idea es que sea el background de toda la sección").
  - ⚠️ **ESTO REVIERTE la decisión del 2026-08-03** anotada en `page-service.css` y la
    equivalente de `/jobs/`: "la foto deliberadamente NO sangra bajo el header, porque en
    una página interior el breadcrumb va entre los dos". La decisión del cliente manda, y
    el problema del breadcrumb se resolvió de otra forma: **se movió DENTRO del hero** y
    ahora va sobre la foto en vez de arriba de ella.
  - **`--service-hero-overlap: 6rem`**, el mismo valor de `--hero-header-overlap` del
    homepage y por la misma razón: una constante generosa a propósito, no una altura de
    header medida. Margen negativo para meterse bajo el header sticky y el mismo valor
    devuelto como padding.
    ⚠️ **`.site-header` es `position: sticky`, así que ocupa flow real**: el hero arranca
    en (alto del header − overlap), o sea **−16px a 1440**, NO en −96. Es exactamente lo
    que ya documenta `.hero` del homepage.
  - **Alto: la suma de tres términos del homepage**, `100svh + overlap − headerH`. El
    primer intento usó `100svh + overlap` y se pasaba de la pantalla por un header
    completo (medido: bottom en 980 con viewport de 900), lo que dejaba la trust band bajo
    el fold — justo lo que la nota del 2026-08-03 existía para evitar. Ahora **bottom
    exactamente en 900 = donde empieza la sección siguiente**, y la trust band adentro de
    la primera pantalla en todos los anchos.
  - **Dos filas, no un bloque centrado.** Con una sola pista centrada el breadcrumb se
    fue a 232px y leía como parte del copy (medido). `grid-template-rows: auto 1fr` +
    `align-content: stretch` (que **cancela el `center` de la regla compartida**) y el copy
    centrado dentro de la fila 1fr. Todo sigue en flow, así que un viewport corto no puede
    superponerlos — que es lo que habría arriesgado posicionar el breadcrumb en absolute.
  - **Banda oscura arriba para el nav**, sólo en la variante bleed, con el stop en una
    LONGITUD FIJA (no un porcentaje): tiene que cubrir el header, no una fracción de lo
    alto que resulte el hero. Se redeclara todo el stack porque `background-image` es una
    sola propiedad y no se le puede agregar una capa.
  - ⚠️⚠️ **DOS REGRESIONES QUE ME COMÍ EN EL CAMINO, las dos encontradas midiendo:**
    1. **`.service-hero` es la sección del hero en SEIS páginas** — `/werkschutz/`,
       `/jobs/`, `/referenzen/` y las tres case studies. Puse las declaraciones en la regla
       base y metí las seis bajo el header; las cinco que conservan su breadcrumb ARRIBA
       del hero quedaron con el hero trepándose encima, exactamente el solapamiento que
       este cambio venía a arreglar. **Por eso es un modificador `.service-hero--bleed`, y
       optar por él son dos cosas juntas: la clase Y mover el breadcrumb adentro.**
    2. Al renombrar la regla de escritorio a `--bleed` les saqué `min-height`,
       `padding-block`, `display: grid` y `align-content: center` a esas cinco páginas.
       La compartida está restaurada y el modificador sólo declara lo que cambia.
       Verificado después: `/jobs/`, `/referenzen/` y una case study vuelven a
       `heroTop: 137` con `align-content: center`, sin solapamiento.
  - ⚠️ **Y una trampa de especificidad que encontró el barrido:** el bloque de teléfono
    tiene `.service-hero { padding-block: … }`, que es (0,1,0) igual que
    `.service-hero--bleed`, **así que en teléfono ganaba por orden de aparición** y sacaba
    el overlap del padding — el breadcrumb quedaba bajo el header a 320 y 390. El
    modificador redeclara su propio padding de teléfono. Cualquier
    `.service-hero { padding-block: … }` en un breakpoint nuevo necesita su regla
    compañera.
  - **Contraste sobre la foto, fondo puro con el header y el copy ocultos y muestreando el
    rect real de cada elemento:** logo **20,63:1**, nav **20,34:1**, breadcrumb
    **17,78:1**, H1 **17,14:1**, trust **18,61:1** a 1440; a 390, 20,55 / 20,23 / 17,12 /
    18,27. La banda del nav hace su trabajo.
  - Barrido a 320 / 390 / 430 / 768 / 1024 / 1440 / 1600: la foto arranca en −16/−20 en
    todos, el bottom del hero coincide con el inicio de la sección siguiente en todos, la
    trust band entra en la primera pantalla en todos, sin solapamiento y sin scroll
    horizontal.
- **2026-08-07 — el panel FRANKONIA del Vorteile es una CAJA con borde celeste, y ese
  borde SE DIBUJA con el scroll** (client: "las boxes que hoy solo tienen una linea
  celeste en el borde izquierdo quiero que sean boxes con un borde celeste y que el
  borde celeste se vaya creando cuando escroleo, como hemos hecho con las flechas").
  Era `border-left: 2px` nomás; ahora es un contorno completo de 2px que
  `js/service-contrast.js` traza con `stroke-dashoffset`, el mismo mecanismo que la
  flecha de al lado. **Es el TEMPLATE**, así que las otras 11 páginas de servicio lo
  heredan.
  - **2px → 1px → 0,5px, dos pedidos del cliente el mismo día** ("que tenga menos
    weight la linea, está muy gruesa, hay que hacerla finita y delicada", después "más
    fina aún"). El primer paso fue una línea; **el segundo obligó a partir la variable
    en dos, y es lo importante de esta entrada.**
  - ⚠️ **CHROME REDONDEA `border-width` A PÍXELES ENTEROS: `border: 0.5px` computa
    `1px`** — medido a DPR 1 **y** a DPR 2. Un `stroke-width` de SVG no tiene ese piso.
    O sea que una sola variable describía dos cosas distintas: la caja que crea el
    borde y la línea que dibuja el marco. Medido con una sola a 0,5px: el trazo caía
    ~0,75px adentro del anillo del borde y la caja del SVG salía 1px más corta que el
    panel. Ahora son dos, cada una con un solo significado:
    **`--contrast-frame-box` (1px)** = el término de LAYOUT, o sea lo que el borde
    realmente renderiza — lo consumen el `border-width` del panel y el padding de la
    head cell; **`--contrast-frame-w` (0,5px)** = el grosor del trazo dibujado,
    sub-píxel permitido.
  - **Qué se ve realmente a 0,5px, medido pixel por pixel sobre el render** (tira de
    píxeles cruzando el borde izquierdo, comparando trazos de 2 / 1 / 0,75 / 0,5px):
    en pantalla **2x es UN píxel de dispositivo a color pleno** `rgb(61,154,211)`, o
    sea literalmente la mitad de la versión de 1px; en pantalla **1x es un píxel al
    ~53 % de fuerza** (`rgb(34,81,109)` contra `rgb(61,154,211)`), o sea más fina por
    ser más pálida, porque 1px es el piso de esa pantalla. El borde CSS estático de
    atrás — el estado sin JS y con reduced motion — queda en **1px**, que es lo más
    fino que puede ser un borde.
  - **La caja del marco la setea el SCRIPT en píxeles, no un `calc()` del CSS**, y con
    `getBoundingClientRect`, **no** `offsetWidth/offsetHeight`: esos redondean a entero
    y el panel mide 699,53x154,83, así que el par redondeado dejaba el marco hasta medio
    píxel fuera de su propia caja — a 0,5px de trazo eso es la diferencia entre una
    hairline y una mancha. Verificado a 320 / 390 / 768 / 899 / 900 / 1024 / 1280 /
    1440 / 1600: **la caja del SVG iguala exacto la border box del panel en los nueve**,
    sin scroll horizontal, y el Δ del heading sigue en **0px**.
  - **El layout no se movió en ninguno de los tres pesos** (el término de caja siguió
    en 1px desde el segundo): panel **699,53x154,83** en live, en reduced motion y sin
    JS.
  - **El borde CSS sigue declarado y es la pieza clave**: en el estado live sólo se le
    pone `border-color: transparent`, no se saca. El SVG es `position: absolute` y no
    ocupa espacio, así que sacar el borde movería el texto un píxel arriba y a la
    izquierda en el momento exacto en que arranca el script. Medido: la caja mide
    **699,53x154,83 en los dos estados**. Y es también el estado sin JS / con
    `prefers-reduced-motion`: un marco azul entero, que es donde termina el dibujado
    (verificado con ejecución de scripts desactivada: 0 SVGs creados, `borderTopColor`
    = #3D9AD3, misma caja). ⚠️ Con el marco ya en 0,5px ese fallback es **1px**, no
    0,5 — ver la nota del redondeo de Chrome arriba; es medio píxel en un marco
    decorativo y sólo lo ve quien no ejecuta JS o tiene reduced motion.
  - **El `<rect>` NO tiene viewBox, a propósito.** El panel mide lo que su copy y su
    columna le den y cambia en cada reflow; sin viewBox una unidad de usuario es un
    píxel CSS, así que el rect se setea directo desde `offsetWidth/offsetHeight` y ni
    el radio de esquina ni el grosor mienten a ningún ancho. Un viewBox fijo estirado
    ovalaría las esquinas y afinaría el trazo en los lados largos.
    El rect se mete **medio trazo hacia adentro** (`x = y = w/2`,
    `width = offsetWidth - w`) porque un stroke se pinta a caballo de su path: así la
    banda pintada cae exactamente sobre el anillo que ocupaba el borde CSS, sea cual
    sea el grosor. Verificado a 320 / 390 / 768 / 899 /
    900 / 1024 / 1280 / 1440 / 1600: la caja del SVG **iguala la border box del panel en
    los nueve anchos**, sin scroll horizontal en ninguno.
  - ⚠️ **`max-width: none` en `.service-contrast__frame` es OBLIGATORIO, y no es
    defensivo.** `reset.css` pone `svg { max-width: 100% }` en todo el sitio, y ese 100 %
    es el bloque contenedor — la **padding box** del panel, o sea exactamente el ancho
    que este elemento intenta desbordar de cada lado. Medido sin la regla, cuando el
    marco era de 2px: daba **695,5px de ancho dentro de un panel de 699,5**, así que el
    trazo derecho quedaba fuera del borde que viene a reemplazar. El ALTO no se veía
    afectado (`max-height` no existe en el reset), que es justo por qué parecía correcto.
  - ⚠️ **El dibujado va por un OBJETO PROXY, no tweeneando `strokeDashoffset` directo
    como la flecha.** GSAP graba los valores de inicio y fin de un tween una sola vez, y
    acá el valor de inicio es el perímetro — que cambia con cada reflow del panel. Un
    largo horneado animaría hacia un número viejo después de un resize. Se tweenea 0→1 y
    el offset se deriva en `onUpdate`, así el largo se lee vivo y el handler de `refresh`
    sólo tiene que re-medir.
  - **Ranura en el timeline: 0,12 → 1,0** (el mismo timeline por módulo que ya maneja la
    flecha y el marcador, duración total 1, así que no se movió ningún timing existente).
    Arranca apenas después de la flecha y aterriza con el marcador: la línea llega al
    panel y el panel se cierra alrededor de ella. Medido por scroll real a 1440x900, tres
    paneles: 0/0/0 → **52/0/0 → 99/22/0 → 100/67/0 → 100/100/56 → 100/100/100**, y cada
    uno completa con su top todavía a 278–556px del borde superior, o sea bien a la vista.
  - El trazo empieza en la esquina superior izquierda y va en sentido horario (es donde
    arranca el path de un `<rect>`), así que el borde izquierdo — donde vivía la regla
    vieja — es el último en cerrarse. Radio 4 → **8px** (`--radius-md`): una caja de
    cuatro esquinas a 4px se lee como un rectángulo con las puntas mordidas.
  - Padding derecho 8px → `--contrast-panel-lead` y block 14 → 16px: con sólo una regla a
    la izquierda no había nada a la derecha contra lo que el texto se apretara (la medida
    de 56ch lo topa igual), y con un borde real sí lo hay.
  - **`--contrast-frame-w` se declara en `.service-contrast`, no en el panel**, porque
    tiene TRES consumidores: el `border` del panel, el `stroke-width` del SVG y el
    `padding-left` de la head cell de escritorio, que tiene que salvar el marco para caer
    sobre el texto. Verificado con un `Range` sobre los nodos de texto reales:
    **Δ = 0px** entre "So läuft es bei FRANKONIA" y el h3 del panel.
- **2026-08-07 — los dos títulos de columna del Vorteile entran con máscara y son más
  grandes** (client: "quiero que aparezcan de forma smooth y que su aparición sea
  importante, tienen que ser un poco más grandes, y después aparecerá la lista debajo").
  Copy intacto.
  - **25px a 1440, de 20** (`clamp(1.25rem, 1rem + 0.62vw, 1.5625rem)`). Ahora quedan
    claramente por encima de los 19px de la etiqueta de tema y de la línea de problema,
    o sea leen como los títulos de columna de la sección y no como parte de la primera
    fila.
  - **La entrada es un slide-up con máscara**, el mismo lenguaje que `js/title-reveal.js`
    usa para los headings del sitio: el texto arranca completamente debajo de su propia
    caja recortada y sube. Eso es lo que hace que la llegada se lea como deliberada en
    vez de como un fade. `ease: "expo.out"`, 0,9s, stagger 0,14 entre los dos.
  - **El orden pedido está verificado, no asumido.** Medido por scroll real: **justo antes
    del start los dos títulos están a `translateY(37px)` (fuera de su caja) y los TRES
    módulos en opacidad 0**; a +120ms el primero va en 15px y el segundo todavía en 37
    (el stagger); a +260ms 5 y 14; a +420ms los dos en 0. O sea los títulos llegan y
    después la lista.
  - **La máscara la pone el SCRIPT y la saca al terminar.** `overflow: hidden` vive en
    `.service-contrast__head--masked`, una clase que sólo agrega
    `js/service-contrast.js` justo antes de animar, y que el `onComplete` vuelve a
    quitar. Dos razones: sin JS / con `prefers-reduced-motion` no hay recorte y los
    títulos son texto normal completamente visible (verificado: `enmascarado: false`,
    0 wrappers creados), y un `overflow: hidden` permanente sobre un heading es cómo un
    cambio futuro — una palabra más larga, un wrap a dos líneas en algún ancho — se
    recorta en silencio.
  - ⚠️ **Desktop only, y chequeado POR MEDICIÓN, no con una media query en el script**:
    el head es `display: none` bajo 900px, y un ScrollTrigger sobre un elemento oculto
    de altura cero resuelve su start contra nada. `head.offsetParent !== null` es el test
    honesto de "esto está realmente maquetado". Verificado a 390: `display: none`, 0
    wrappers creados.
  - Sin scroll horizontal a 390 ni 1440.
  - **Nota de medición:** el tween es `once` y dura 0,9s, así que muestrear cada 1600ms lo
    agarra siempre terminado — mi primera sonda reportó `translateY 0` en todas las
    posiciones y parecía que no animaba. Para verificar una animación NO scrubbeada hay
    que cruzar el trigger y muestrear a 120/260/420ms.
- **2026-08-07 — HERO NUEVO: el cliente reemplazó `HeroWerkschutz.png`.** Otra toma
  nocturna del mismo escenario, mejor compuesta: el guardia camina hacia la portería y el
  vehículo con la marca FRANKONIA queda a la derecha, legible. Re-exportado a **los mismos
  nombres y tamaños**, así que el markup casi no cambió.
  - Origen 1621x1118 (**ratio 1,450**, contra 1,50 de los exports viejos), RGBA con alfa
    sin usar (min 243) → aplanado a RGB antes de codificar. Nuevo alto de export **1059**,
    así que el `height` intrínseco del `<img>` pasó de 1024 a **1059**; es el único cambio
    de markup.
  - **Pesa menos que el anterior**: 24 / 61 / 83KB WebP (antes 38 / 93 / 130) y 209KB el
    JPEG de fallback. El `srcset` elige bien — verificado: 768w hasta 768px, 1280w a 1024,
    1536w a 1440 y 1600.
  - **El filtro de brillo SE QUEDA, y está medido:** la foto nueva es igual de oscura que
    la vieja (mediana de luminancia **0,0093** contra 0,0100; p98 0,173 contra 0,19), así
    que `brightness(1.34) contrast(0.96) saturate(1.06)` sigue haciendo falta. No es un
    resto del archivo anterior.
  - **Ni el `object-position` ni los dos washes se tocaron**, y eso se confirmó midiendo,
    no asumiendo: probé crops a 62 / 48 / 40 % y stops de wash a 0,60 / 0,68 / 0,74 / 0,80
    y ninguno movía el número de forma útil. **Fondo puro detrás de cada elemento del hero,
    con el texto oculto y muestreando el rect real de cada uno:**

    | | 1440 | 390 |
    |---|---|---|
    | H1 | 16,59:1 | 20,0:1 |
    | lede | 18,28:1 | 15,97:1 |
    | zona del CTA | 12,62:1 | 15,15:1 |
    | tics | 17,67:1 | 19,09:1 |
    | trust | 18,42:1 | 19,49:1 |

  - ⚠️ **LECCIÓN DE MEDICIÓN, mía otra vez.** Mi primera pasada reportó "el lede a 4,63:1 a
    390px" y me llevó a probar crops y washes que no cambiaban nada — porque la caja de
    píxeles que había elegido a mano (`20,410 → 370,500`) no caía sobre el lede sino sobre
    **el botón azul del CTA**. De ahí el número y de ahí que fuera insensible a todo. **No
    elegir cajas de píxeles a mano: pedir el `getBoundingClientRect()` del elemento,
    ocultar el texto con `visibility:hidden` y muestrear ESE rect.** Es lo que dio la tabla
    de arriba, y con eso el hero nuevo no necesitaba ningún ajuste.
  - Sin scroll horizontal a 320 / 390 / 768 / 1024 / 1440 / 1600. Los exports viejos están
    en git si hay que volver.
- **2026-08-07 — card 03 encuadrada como las otras, y EL BUG DE LOS PUNTEADOS ERA MÍO**
  (client: "la ilustración de 3 tiene que estar más chica en el cuadrado, más como la de
  la derecha que tiene más aire… y fijate cómo podemos hacer que funcionen las líneas
  punteadas, si no hay forma hagámoslas sólidas"). Las dos cosas se arreglaron; **no hizo
  falta pasarlas a sólidas.**
  - ⚠️ **EL DIBUJADO Y UN PUNTEADO DE DISEÑO NO PUEDEN COMPARTIR UN PATH, y es la causa
    exacta de lo que reportó el cliente.** Dibujar funciona escribiendo
    `stroke-dasharray`/`-dashoffset`; un path que YA usa `stroke-dasharray` para su
    aspecto (los cajones fantasma azules, las guías grises del piso) queda con su patrón
    **pisado durante todo el scrub** y sólo vuelve a su ritmo en el `onComplete`. O sea:
    el punteado "no funcionaba" porque este efecto lo rompía. Medido: **9 de los 51
    trazos de la card 03** están en ese grupo, más 2 en la 02 y 4 en la 04.
  - **La solución: `js/svg-draw.js` ahora SEPARA los trazos en dos grupos.** Sin patrón
    propio → se dibujan (42 en la card 03). Con patrón propio → **entran por opacidad**,
    mismo rango y mismo stagger, así que llegan como parte del mismo dibujo y su
    `dasharray` nunca se toca. Verificado a cinco posiciones de scroll incluyendo media
    animación: **0 dasharrays inline sobre los punteados** y los patrones del diseñador
    (`16px, 16px` y `18px, 12px`) renderizando en TODAS las posiciones, con los punteados
    subiendo 0 → 0,02 → 0,2 → 0,58 → 0,89 → 1.
    Los tres iconos del Konzept no tienen `stroke-dasharray`, así que
    `js/steps-sequence.js` no necesitaba el mismo split (chequeado, 0 en los tres).
  - **El aire: la causa era el ARTBOARD, no el marco.** La tinta de este archivo llena
    987 de sus 989 unidades de viewBox, así que renderizaba al **86 % del ancho del
    marco**, mientras 01/02/04 se quedan en **63–64 %** porque sus artboards traen su
    propio margen. `.rz-art--supplied--inset { transform: scale(0.74) }` la baja a
    **63 %/66 %** — medido, ahora las cuatro están en 63–64 %.
    Va **en CSS y no en el SVG a propósito**: cómo se encuadra un dibujo es una decisión
    nuestra, no del archivo del cliente.
    ⚠️ Un transform escala también los trazos, así que el peso de línea de la 03 pasa de
    1,06px a **0,78px**. **Acá eso es una ventaja**: las cards 02 y 04 renderizan a
    0,71px, así que este cambio es lo que finalmente hace que las cuatro se lean como una
    familia (el desajuste que quedó pendiente ayer). Si el cliente quiere las cuatro más
    firmes, es subir `stroke-width` en los cuatro archivos, no tocar esta regla.
  - Sin scroll horizontal a 1440 ni 390; con `prefers-reduced-motion` las 12 lecturas de
    dasharray inline siguen en 0.
- **2026-08-07 — las cards llegan ANTES y el dibujado arranca con la card** (client: "que
  aparezcan un poco antes las cards y que ni bien aparezca la card empiece esta animación,
  porque si no escroleo y terminan apareciendo muy tarde"). Medido primero, porque el
  "muy tarde" tenía una causa estructural, no un valor mal elegido.
  - **El diagnóstico:** el reveal usa UN timeline cuyo rango abarca todo el GRUPO
    (`top 85%` → `bottom 60%`), y la grilla mide ~1150px, así que la segunda fila recién
    aparecía cerca del final del rango. Medido a 1440x900, posición del borde superior de
    cada card en el momento en que termina: **la card 3 terminaba de dibujarse con su top
    122px ARRIBA del viewport** (−14 % vh) y la card 1 recién llegaba a opacidad 1 con su
    top al 8 % de la pantalla. O sea: terminaban fuera de vista.
  - **`data-item-reveal-each`, nuevo modo opt-in de `js/item-reveal.js`**: un
    ScrollTrigger POR ITEM, disparado por el item mismo, con los mismos valores del preset
    y sin stagger (un trigger por item ES el stagger). Es lo que arregla el problema de
    fondo: una card llega siempre en el mismo punto de SU propia aproximación,
    independientemente de en qué fila esté. **El camino por defecto no cambió** — mismos
    `top 85%` / `bottom 60%` / stagger — y está verificado en `/jobs/`
    (`.jobs-why__grid` va de `[0,0,0,0]` a `[1,1,1,1]`), porque `data-item-reveal-strong`
    vive en 5 páginas y no se toca.
  - **`data-item-reveal-start`**, la palanca simétrica del `data-item-reveal-end` que
    existía desde 2026-07-28 por exactamente el mismo problema en la otra dirección.
    La grilla del Risiko usa `top 92%` → `top 52%`.
  - **`data-svg-draw-trigger="<selector>"`** en `js/svg-draw.js`: dispara el dibujado desde
    un ANCESTRO (`closest`) en vez del `<svg>`. Hace falta porque el dibujo está ~220px
    adentro de la card, y "cuando llega la card" y "cuando llega el dibujo" son dos
    posiciones de scroll distintas separadas por la altura de todo lo que tiene encima.
  - ⚠️ **REVERTIDO a propósito**: el default del dibujado era `top 62%` sobre el `<svg>`,
    elegido para que no se dibujara detrás del blur del reveal de la card. Medido, eso
    costaba mucho más de lo que compraba. Ahora `top 88%` → `top 34%` sobre la card. El
    blur es breve y scrubbeado; un dibujo que termina fuera de pantalla no lo ve nadie.
  - **Después, medido igual que antes** (top de cada card en % del viewport):

    | card | visible antes | visible ahora | dibujada antes | dibujada ahora |
    |---|---|---|---|---|
    | 01 | 8 % | **57 %** | — | — |
    | 02 | 48 % | **57 %** | −14 % | **20 %** |
    | 03 | 23 % | **48 %** | −14 % | **23 %** |
    | 04 | — | **48 %** | — | **23 %** |

    Ningún número negativo: cada dibujo termina con la card entera en pantalla, ~330px de
    scroll antes que antes. (La card 01 no dibuja — su escena es la generada acá y no lleva
    atributos `stroke`, así que la sonda la marca "dibujada" en cuanto es visible.)
  - Con `prefers-reduced-motion`: las 4 cards en opacidad 1 en toda posición y **cero
    dasharrays** escritos (12 lecturas en 0).
- **2026-08-07 — las cards 02 y 04 también son ilustraciones DEL CLIENTE y también se
  dibujan** (client: "en icons guardé Haftung & Auflagen.svg y know-how-Abfluss.svg,
  ponelas en la ilustración correspondiente como pusiste la de Diebstahl y hacé el mismo
  efecto"). Renombradas a `assets/icons/{haftung-auflagen,know-how-abfluss}.svg`,
  recoloreadas para la banda navy, inlineadas verbatim con `data-svg-draw`. **Las tres
  escenas generadas acá para las cards 02, 03 y 04 ya no existen en la página; git las
  tiene.** La card 01 siguió con la escena dibujada acá hasta que el cliente mandó la
  cuarta el mismo día — ver la entrada de Betriebsunterbrechung abajo.
  - Recoloreo idéntico al de la card 03, una sola regla de sustitución: `black` →
    `#FFFFFF` (28 y 39 trazos), `white` → **`#0D152A`** (1) y `#C5C8CC` → `#4A5164` (3 y
    1). Los azules del cliente no se tocan — ojo que **know-how-abfluss trae DOS azules**,
    `#3D9AD3` y `#55A7D9`; el segundo no es un token nuestro y queda como está.
  - ⚠️ **El `fill="white"` de haftung-auflagen NO era una oclusión: era
    `<rect width="1124" height="835">`, un fondo a canvas completo.** Sobre la card navy
    hubiera sido un bloque blanco tapando todo el arte. Pasarlo al color de la card lo
    vuelve invisible, que es lo correcto — pero es otra razón para mirar QUÉ es cada fill
    antes de sustituirlo, no sólo contarlos.
  - ⚠️ **haftung-auflagen traía un PNG base64 de 33KB adentro**, un patrón de Figma con el
    símbolo de Gefahrstoffe (calavera) sobre el bidón. Dos problemas reales: era **negro
    sobre transparente**, o sea invisible sobre navy, y un ráster **no se puede dibujar**
    con dash. Recoloreado invirtiendo el RGB y conservando el alfa (los píxeles son gris
    neutro con antialiasing, así que la inversión es exacta) y **bajado de 360x360 a
    96x96**: renderiza a ~18px en pantalla, así que 360 era puro peso. **33.200 → 5.632
    bytes de base64.** El archivo pasó de 43,8KB a 16,7KB.
  - **Medido, no razonado**: 52 / 51 / 38 trazos dasheados antes de entrar y los tres en 0
    después; **cero `stroke="black"` y cero `fill="white"` en las tres**; la card 01 no
    recibía un dash todavía (ese día su escena era la generada acá). Con
    `prefers-reduced-motion` forzado no se escribe un solo dash en
    ninguna posición (12 lecturas en 0). Sin scroll horizontal a 1440 / 1024 / 390.
  - ⚠️ **PENDIENTE DE DECISIÓN DEL CLIENTE — el peso de línea de las cuatro no coincide.**
    Las dos nuevas tienen viewBox 1124x835 con `stroke-width` 2, y entran al marco de
    473x296 escaladas por ALTO (0,354), así que el trazo efectivo es **0,71px**. La card 03
    es 989x634 con 2.22337 y escala 0,478 → **1,06px**. O sea las nuevas se ven más finas
    que la 03 dentro de la misma fila. Es su export, no algo que hicimos: se arregla
    subiéndoles el `stroke-width` en el archivo o re-exportando, y no se tocó sin pedido.
  - ⚠️ **ERROR MÍO QUE VALE LA PENA NO REPETIR:** escribí el archivo recoloreado en
    `know-how-abfluss.svg` y después borré el original con `rm "know-how-Abfluss.svg"` —
    **macOS es case-insensitive, así que ese `rm` borró el archivo que acababa de
    escribir**, original incluido. Se recuperó con `git checkout` porque otra sesión lo
    había commiteado; si no hubiera estado trackeado, se perdía. **Es la misma trampa que
    este archivo ya documenta para `bayernwerk.png`.** La forma correcta es `git mv` al
    nombre final PRIMERO y recolorear en su lugar — nunca escribir-y-después-borrar cuando
    los dos nombres difieren sólo en mayúsculas.
- **2026-08-06 (misma sesión) — la card 01 también es del cliente: las CUATRO escenas
  del Risiko son suyas y ninguna generada acá sobrevive en la página** (client:
  "acabo de guardar en assets/icons la ilustración de Betriebsunterbrechung para la
  primer card"). Una nave con dos cintas transportadoras rotas, cajas caídas y un
  triángulo de alerta azul — el mismo lenguaje isométrico que las otras tres.
  Recoloreada desde `Betriebsunterbrechung1.svg` a
  `assets/icons/betriebsunterbrechung.svg` e inlineada con
  `data-svg-draw data-svg-draw-trigger=".service-risk__item"`, sin `--inset`
  (su viewBox es 1124x835, como las cards 02 y 04, que tampoco lo necesitaron).
  - **El original del cliente NO se borró, y esta vez el nombre difiere en más que
    mayúsculas a propósito.** Es la respuesta directa a las dos pérdidas
    documentadas arriba: en `know-how-abfluss` el `rm` case-insensitive se comió el
    archivo recién escrito, y la primera copia de ESTA ilustración se perdió del
    todo porque no estaba trackeada y el `os.remove` apuntaba al mismo inodo. Con
    `Betriebsunterbrechung1.svg` intacto al lado, el peor caso es un archivo de
    más.
  - Sustitución idéntica a las otras tres, y otra vez conviene mirar qué es cada
    fill antes de tocarlo: **5 rellenos `#09152D`** (oclusiones reales, las caras
    de las cajas y la nave) pasan al `#0D152A` de la card, los **70 trazos blancos
    se quedan blancos** (este export ya venía claro, al revés que los anteriores),
    los 4 `#4A5167` son las guías del piso y los 3 `#3D9AD3` son la alerta.
  - **4 `stroke-dasharray` de diseño**, que es exactamente para lo que
    `js/svg-draw.js` separa trazos: 77 elementos con `stroke`, **73 reciben dash de
    dibujado y esos 4 quedan fuera** — el rombo punteado del piso conserva su ritmo
    en vez de convertirse en línea llena.
  - **Medido en las cuatro a la vez**: 72 / 49 / 41 / 33 trazos sin dibujar antes de
    entrar y **los cuatro en 0 al terminar**; cero `stroke="black"` y cero
    `fill="white"` en las cuatro; sin scroll horizontal.
- **2026-08-06 — la ilustración de la card 03 también se DIBUJA con el scroll, y sólo
  esa de las cuatro** (client: "aplicame el mismo efecto al diagrama de Diebstahl im und
  um den Betrieb, solo a ese de los 4, que vaya formando las líneas"). Nuevo primitivo
  `js/svg-draw.js`, opt-in por `data-svg-draw`, con su propio `<script defer>`.
  - **La ilustración pasó de `<img>` a INLINE**, verbatim otra vez: sólo se sacaron
    `width`/`height` del root. Verificado después del cambio: los 51 trazos siguen con su
    `stroke` y `stroke-width` originales y los 19 rellenos siguen en `#0D152A`.
    `.rz-art--file` se renombró a **`.rz-art--supplied`** porque "--file" dejó de ser
    cierto, y perdió el `object-fit`: un `<svg>` inline escala por
    `preserveAspectRatio`, y el `meet` por defecto hace exactamente lo que hacía
    `contain`.
  - ⚠️ **Los 19 rellenos NO se animan, y es la decisión que hace que esto funcione.** Un
    `stroke-dashoffset` sobre un fill no hace nada, y acá los fills son oclusión de línea
    oculta (esconden los bordes detrás de los cajones y de la caja del camión), así que
    tienen que pintar desde el primer frame o el dibujo se transparenta a sí mismo
    mientras se forma. El script filtra por `stroke` presente; medido: 51 con dash, **0
    rellenos tocados**.
  - **El stagger es un spread TOTAL (`amount: 0.9`), no un delay por elemento.** Este
    dibujo tiene 51 trazos contra los ~10 de un icono chico: con un delay fijo por
    elemento el mismo efecto duraría cinco veces más acá. Un valor, cualquier cantidad de
    paths.
  - **Arranca DESPUÉS del reveal de la card**, a propósito (`start: "top 62%"`): el grid
    usa `data-item-reveal-strong`, que scrubea un blur de 10px y una escala hasta que el
    bottom de la card llega al 60 % del viewport — dibujar debajo de eso gastaría el
    efecto detrás de un blur.
  - **El dash se limpia en `onComplete`**, así que una ilustración terminada no queda con
    ningún estilo inline nuestro. Medido: al final `conDash: 0`.
  - **Verificado por scroll real**: 50 de 51 sin dibujar antes de entrar, 36 a mitad, 0 al
    final; **las otras tres cards nunca reciben un dash** (`otrasConDash: 0`), que era la
    parte "sólo ese de los 4". Con `prefers-reduced-motion` forzado no se escribe un solo
    dash en ninguna posición y el dibujo está completo siempre.
  - Costo: la página compilada queda en 140KB (**42KB gzip**) y se ahorran 4 requests de
    SVG entre esto y los tres iconos. El archivo sigue en `assets/images/` como fuente de
    verdad — si el cliente lo re-manda, se re-inlinea desde ahí.
  - ⚠️ **Nota de orden de dibujo:** el orden es el del documento (paleta → cajones →
    guías → flecha → camión), así que a mitad del scrub el camión todavía se está
    formando. Se lee bien como dibujo en proceso. Cambiar el orden sería reordenar
    elementos dentro del archivo del cliente, o sea cirugía de artwork, y no se hizo sin
    pedido.
- **2026-08-06 — los iconos del Konzept SE DIBUJAN con el scroll, y pasaron a 5rem**
  (client: "hacelos un poco más grandes, y si podés, como son SVG, hacerles un efecto
  como que se va formando la línea… si no, no hagas nada"). Sí se podía, y la condición
  que lo hizo posible es medible: los tres archivos son **línea pura — 32 elementos con
  stroke y CERO rellenos distintos de `none`**, así que un `stroke-dashoffset` los dibuja
  enteros.
  - **Los SVG están INLINEADOS ahora, no como `<img>`** — es la única forma, porque
    ningún CSS ni JS nuestro entra en un `<img>`. ⚠️ **Y esto NO contradice la lección de
    la card 03: lo que destruyó ese dibujo no fue inlinearlo, fue MAPEARLO sobre las
    clases `.rz-*`.** Acá se inlinea verbatim — cada `fill` y cada `stroke` es el del
    cliente, lo único que se agregó es la clase y `aria-hidden`; sólo se sacaron `width`
    y `height` del root para que el CSS dimensione. Verificado después: los 32 elementos
    siguen con `stroke="white"` y `stroke-width="5"` intactos. **Nada en el CSS de este
    bloque toca fill, stroke ni stroke-width. Que siga así.**
  - **El dibujado es una capacidad OPT-IN de `js/steps-sequence.js`**, vía
    `data-steps-draw="<selector>"` en la lista. Sin ese atributo el script se comporta
    exactamente como antes, así que `/jobs/` (que además usa `js/jobs-steps.js`, otro
    archivo) no se toca. Un solo tween por paso sobre todos sus trazos, con **valores por
    función** para que cada path se dashee con su PROPIA `getTotalLength()` — nunca una
    constante compartida, la misma regla que sigue `js/service-contrast.js` con su
    flecha — más `stagger: 0.035`, que es lo que hace que se lea como una pluma y no como
    32 trazos apareciendo juntos.
  - **El icono sale del stagger de la copia a propósito.** El dibujado ES su llegada, y
    hacerle un fade de opacidad mientras se dibuja esconde el efecto detrás de una rampa.
    Se inserta en posición `"<"` (el inicio del tween anterior), o sea arranca junto con
    su caption y dura un poco más, así el dibujo sigue cuando el texto ya se asentó.
  - **Verificado por scroll real, no por razonamiento**: arriba de la sección los 32
    trazos tienen dash con offset > 0 (sin dibujar); a mitad de la secuencia los iconos 01
    y 02 están en offset 0 y el 03 sigue con sus 10 trazos sin dibujar; al final los 32 en
    0. O sea **dibujan de a uno, en orden, con el riel**. Con `prefers-reduced-motion`
    forzado **nunca se escribe un solo dasharray** y los tres están completos en cualquier
    posición de scroll — el contrato de "JS sólo mejora" se sostiene.
  - **5rem, de 4** (el otro pedido). Efecto secundario que conviene saber: el trazo
    efectivo pasa de 0,98px a **1,22px**, que cae justo en los ~1,25px del sprite
    compartido — así que agrandarlos también alineó el peso de línea con el resto del
    sitio.
  - Los tres `.svg` quedan en `assets/icons/` aunque el markup ya no los pida: son la
    fuente del cliente. `build.js` copia `assets/` entero, así que se publican sin usarse
    — inofensivo acá, pero es la misma clase de huérfano que ya se documentó.
- **2026-08-06 — los nodos del conector son CUADRADOS** (client: "los bulletitas
  hacelos cuadraditos en vez de círculos"). `border-radius: 50%` → `0` en
  `.service-konzept__step::before`, y de paso encaja mejor con el lenguaje de plano
  técnico de la sección que un punto.
  **9px → 8px, y no es capricho:** un cuadrado del mismo tamaño nominal tiene ~27 % más
  de área y pesaba más sobre la hairline. 8px además pone el centro del nodo en
  exactamente 4px, que es donde ya estaba el `top` del segmento del conector, así que
  ahora el riel lo encuentra al centro en vez de medio píxel arriba. El `left:
  calc(50% + 12px)` del conector sigue despejado (4px de mitad + 5px de anillo = 9px).
  Verificado a 1440 y 390: los tres nodos 8x8 con radio 0, segmentos a `top: 4px`, el
  riel vertical del teléfono sigue igual, sin scroll horizontal.
- **2026-08-06 — los 3 iconos del Sicherheitskonzept son los del CLIENTE, hechos en
  Figma** ("ya hice los iconos de esta sección yo en Figma… buscalos y ponelos ahí").
  `assets/icons/{standortanalyse,sicherheitskonzept,angebot-24h}.svg`, renombrados desde
  los nombres de Figma (`Standortanalyse.svg`, `Sicherheitskonzept.svg`, `Angebot in
  24h.svg`) a la convención del proyecto — minúsculas, con guiones, sin espacios que
  haya que codificar en una URL. Reemplazan las tres escenas dibujadas acá; git las
  tiene.
  - **Van como `<img>`, NO inline**, y esta vez la decisión fue directa por lo que ya
    costó una vez: `Standortanalyse.svg` trae tres `<mask>` de Figma con ids propios
    (`path-7-inside-1_556_70`) y los tres tienen `stroke="white"` fijo. Inlinearlos y
    mapearlos sobre `.rz-line`/`.rz-accent` es exactamente lo que destruyó la
    ilustración de la card 03. Dentro de un `<img>` no entra ningún CSS nuestro.
  - Los tres son 354x328 (ratio 1.079, **no cuadrados**), así que la caja de 4rem
    necesita `object-fit: contain` o los achata. `display: block` saca el hueco de
    baseline que un `<img>` inline mete debajo del icono. Con `width`/`height` reales en
    el markup no hay CLS.
  - **El trazo efectivo es 0,98px**, contra los **2,4px** de las escenas que reemplazan
    (yo las había dibujado a 1.5 sobre un viewBox de 40 unidades a 64px). Los iconos del
    sprite compartido dan ~1,25px (1.5 sobre 24 unidades a 20px), así que **los nuevos
    están más cerca del lenguaje de línea del sitio que los que salieron** — la fila lee
    más delicada, y eso es lo correcto, no una regresión. Si el cliente la quiere más
    firme, se sube la caja (una línea) o re-exporta con más trazo; no se toca el archivo.
  - **Ninguno de los tres trae acento azul**, y las tres escenas anteriores tenían uno
    cada una (el marcador, la llave, el check). La sección conserva el azul en los
    numerales 01–03 y en los nodos del conector, así que no queda sin él — pero el icono
    ya no aporta color. Es como los exportó el cliente.
  - ⚠️ **`.service-konzept__art` sólo funciona sobre sección OSCURA ahora**: el blanco
    está dentro de los archivos. El bloque es genérico (11 páginas lo necesitan según
    docs/build-checklist.md) y acá la sección es oscura, pero una variante para sección
    clara necesita un export nuevo del cliente, no un `filter`.
  - Verificado: los tres cargan (`naturalWidth` 354), caja 64x64, sin scroll horizontal.
- **2026-08-05, FIFTH pass on Vorteile — el título de la solución es una ETIQUETA
  azul, no un headline** (client: "que los títulos de la derecha sean del mismo estilo
  que los de la izquierda, tamaño y todo, pero que sean azules"). Copy intacto.
  `.service-contrast__side--new h3` toma los valores de tipo de
  `.service-contrast__topic-label` — mismo clamp, mismo 500, uppercase, 0.06em — y sólo
  cambia el color a `--color-accent`, el mismo token que ya usan los numerales 01–03 y
  el encabezado "So läuft es bei FRANKONIA", así que todo el lado FRANKONIA lee como un
  sistema. Verificado a 1440 / 1024 / 390: los dos títulos dan **idénticos** en
  `font-size`, `font-weight`, `text-transform` y `letter-spacing`, y la única diferencia
  es el color (blue-light contra blanco 0.95).
  ⚠️ **Esto REVIERTE las pasadas del 2026-08-04/05**, que llevaron este título de 18 → 26
  → 30px justamente para que pesara más que la línea de problema de enfrente. La decisión
  del cliente manda, pero significa que **el peso del módulo ahora vive en el párrafo de
  19px, no en el título** — no "restaurar" el tamaño grande argumentando que el claim
  necesita énfasis.
  Dos valores se movieron con el cambio y no son cosméticos: el `margin-bottom` fue
  0.375rem → **0.75rem** (0.375 era el hueco bajo un headline de 30px; a tamaño de
  etiqueta el párrafo necesita separación real o los dos se leen como un bloque), y el
  `max-width` 34ch → **56ch**, el del propio párrafo — 34ch estaba ajustado al título
  grande y a tamaño de etiqueta son ~320px en una columna de 690, lo que partía el título
  largo en tres líneas sin motivo. Medido: 1 / 2 / 1 líneas a 1440 y 1024, módulos
  226/263/226 → **218/240/218px**, sin scroll horizontal a 1440 / 1024 / 390.
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

**2026-08-17 — LAS 15 PÁGINAS COMBO QUE FALTABAN ESTÁN CONSTRUIDAS. Con eso las 16
Kombiseiten están completas y NO QUEDA UN SOLO LINK INTERNO ROTO DENTRO DE `<main>`
EN TODO EL SITIO** (cliente: "hagamos ahora las páginas de las ciudad + servicio").
Webtexte 35–49 (Stand 25.07.2026), verbatim, alemán: Objektschutz · Werkschutz ·
Baustellenbewachung × Nürnberg, y las cuatro leistungen × Würzburg · Erlangen ·
Fürth. La plantilla corregida está en
[docs/page-conventions.md §11.6 y §11.7](docs/page-conventions.md); acá va lo que no
se deduce de ahí.

- ⚠️⚠️ **"COPIAR /brandwache-nuernberg/ Y CAMBIAR EL COPY" ERA LA MITAD DE LA
  VERDAD, y es la TERCERA vez que este proyecto se lleva la misma sorpresa** (ya
  pasó con las 9 ciudades y con las 9 de servicio). §11 decía eso y los BLOQUES sí
  estaban todos construidos — `page-combo.css` necesitó **una sola regla nueva** en
  las 15. Lo que no se transfiere es la ESTRUCTURA: los 15 drafts traen la suya a
  propósito y lo dicen en su propia cabecera (*"Struktur variiert ggü.
  Brandwache-Kombi"*, *"Struktur-Variation: Prozess früh"*, *"Q&A-lastig"*). Van de
  **6 a 9 secciones en cuatro familias de forma**. §11 está corregido.
- ⚠️ **CONSECUENCIA: LA LISTA DE SEAMS NO SE PUEDE COPIAR.** Los tiles son del color
  de la sección de ARRIBA y dos del mismo color no llevan seam (§9.2), así que con
  otro orden cambia entera. Las 16 van de **5 a 7 seams**. Se **deriva** de la
  secuencia de superficies, no se escribe.
- ⚠️⚠️ **Y LA PARIDAD DE SUPERFICIE ES ARITMÉTICA, no gusto.** El hero es oscuro y
  Kosten también (es la variante invertida de este tipo — card blanca sobre sección
  negra, decisión del cliente del 2026-08-10), así que **una página alterna perfecto
  sólo si la cantidad de secciones ENTRE los dos es IMPAR**. Once de las quince
  tienen impar y alternan hasta abajo; las otras cuatro toman una o dos adyacencias
  sin seam, puestas donde las dos secciones se leen como un capítulo — de
  preferencia en **prosa → Kosten**, porque ahí la card blanca ya aporta el cambio
  de superficie y el seam es lo que menos compra. `/objektschutz-wuerzburg/` es la
  única con DOS, y está forzada: su draft pone el proceso de 3 pasos en la sección 2,
  `steps` sólo puede ir en oscuro (`.service-konzept*` cablea texto blanco) y
  `fields` sólo en claro (su azul es la mezcla profunda que sólo pasa contraste sobre
  blanco), así que ninguna asignación evita las dos.
- **Por eso se generaron con un script**, `docs/design-sources/combo-pages.py` +
  `combo_pages_data.py` + `combo_drafts.py`, **de una sola pasada y en desarrollo**,
  igual que `city-pages.py` y `service-pages.py`. No corre en `npm run build`.
  Existe por las tres cosas que se rompen a mano y **no se ven en una captura**: la
  paridad FAQ ↔ JSON-LD (**96 pares**), el color de cada seam, y los precios como
  token (G10). Después son páginas normales, editables a mano; **no re-correrlo sobre
  una página ya editada**. ⚠️ **`/brandwache-nuernberg/` NO está en el script** — se
  construyó a mano el 2026-08-09 y el cliente la revisó varias veces desde entonces,
  así que correrlo no puede tocarla.
- ⚠️ **Y por una cuarta razón que apareció construyendo: NINGUNA PALABRA SE TIPEÓ.**
  Son ~24.000 palabras de alemán, y un error de transcripción en copy aprobado no lo
  caza ninguna medición. `combo_drafts.py` sale a máquina de los `.docx` — que **no
  están en git**, así que ese archivo es la única copia versionada de estos 15
  drafts.
- ⚠️ **El split "párrafo de intro" ↔ "items de lista" se DECLARA (`prose: N`), no se
  adivina** — es la corrección que `service_drafts.py` ya pagó: la prosa alemana está
  llena de dos puntos, así que *"Ob die Nachtkontrolle wirklich lief, sehen Sie bei
  FRANKONIA nicht erst nach dem Einbruch: Checkpoints belegen jede Runde …"* parsea
  exactamente igual que una fila `Label: text`. **No volver a heurística.**
- **`dotsplit`, un mecanismo nuevo y chico:** dos drafts (los Bausteine de
  Objektschutz) escriben sus cuatro items **en UNA línea unida por " · "**. Se parte
  por eso y por nada más, declarado por sección, y el generador aborta si esa sección
  no tiene exactamente una línea.
- ✅ **DEFECTO REAL ENCONTRADO MIDIENDO, y el síntoma es el peligroso: la página NO
  scrolleaba de costado, CLIPEABA.** `.service-hero` es `overflow: hidden`, así que
  el H1 de las 4 páginas de Baustellenbewachung se cortaba en silencio a 320px —
  `documentElement.scrollWidth === innerWidth` decía "está bien" mientras una palabra
  perdía sus últimas letras. Causa: base.css pone `hyphens: none` en headings y
  **`overflow-wrap: break-word` no reduce el min-content**, así que
  "Baustellenbewachung" (19 caracteres) fijaba **303px contra 280 disponibles**.
  ⚠️ **LECCIÓN GENERAL: chequear cajas pintadas fuera del viewport, no sólo scroll
  horizontal.** `hScroll: 0` puede significar "está bien" o "algo está cortando
  texto", y sólo la lista de cajas fuera del viewport distingue las dos.
  ⚠️ **El breakpoint es 360px y NO los 400 que usa `.service-hero--split`, y el
  número está medido**: la palabra entra desde 344px, así que a 400 la regla
  hyphenaría un H1 que sí tiene lugar — y un teléfono de 390 rompería
  "Baustellenbewa-chung" **al medio en vez de en el espacio**, peor tipografía sin
  ninguna ganancia. Verificado: `hyphens: auto` a 320 y 344, `none` a 360 y 390, sin
  clipear en ninguno. Es la única regla que estas 15 páginas agregaron al CSS.
- ✅ **GANANCIA LATERAL GRANDE: estas 15 cerraron los 4 404 planificados que
  arrastraban las páginas de servicio** (`/objektschutz-nuernberg/`,
  `/brandwache-wuerzburg/`, `/brandwache-erlangen/`, `/brandwache-fuerth/`).
  **Verificado sobre el build entero: en las 54 páginas, CERO links internos rotos
  dentro de `<main>`.**
- ⚠️ **Los teléfonos de las respuestas de FAQ van como `tel:` y como token** (G4 y
  G10), lo que **corrige por defecto un defecto de las 9 páginas de servicio**, que
  los dejaron como texto literal. La paridad con el JSON-LD se sostiene porque
  envolver en un `<a>` cambia el MARKUP y no el TEXTO — verificado, 96/96
  byte-idénticas. ⚠️ **NO se arreglaron las 9 de servicio**: implica regenerarlas y
  el cliente ya empezó a revisarlas de a una; queda anotado en la checklist.
- **Medido: 16 páginas × 8 anchos** (320 / 344 / 360 / 390 / 768 / 1024 / 1440 /
  1920) = **128 corridas, CERO problemas** — sin scroll horizontal, nada fuera del
  viewport, un solo `<h1>`, sin saltos de nivel de heading, cero imágenes rotas.
  **Contraste: 954 elementos**, y el único fallo es el caveat sitewide del azul del
  CTA (**3,11:1**, blanco sobre #3D9AD3, el mismo que publica cada botón primario).
  El markup servido —que ES lo que recibe un crawler que no ejecuta JS— trae
  **3.414–4.718 caracteres** de texto real en `<main>`, 16–27 headings, 10–13 links,
  **0 tiles y 0 elementos ocultos**. Con motion prendido los seams construyen sus
  **180 tiles** cada uno y el dibujado de los iconos queda armado; con
  `prefers-reduced-motion`, **0 tiles, los marcadores de título en `100% 100%`** (el
  fallback `var(--mark, 1)`, no vacíos) y el riel completo.
- **Las 15 entraron a `sitemap.xml`** con priority 0.8, agrupadas por ciudad: 53
  URLs, XML válido, todas únicas. `/datenschutz/` sigue afuera a propósito (noindex
  mientras su texto sea placeholder).
- ⚠️⚠️ **PARA CHRIS — CONTRADICCIÓN DE PRECIO DENTRO DEL PROPIO DRAFT.** El Webtext
  45 (Baustellenbewachung Erlangen) dice en su párrafo de Kosten "zwischen **25 und
  35** Euro" mientras **la Preis-Box de la misma página** renderiza 26-32, y las
  otras 15 combos dicen 26–32. Se publicó el token: **una página que se contradice
  sobre su propio precio es peor que cualquiera de las dos lecturas**, y es el mismo
  defecto que ya tenían 3 páginas de servicio.
- ⚠️ **PARA CHRIS — dos ejemplos calculados con cifra propia, publicados VERBATIM y
  NO tokenizados**: el Webtext 41 §6 dice "1.500 und 2.100 Euro" contra el
  `example.weekendTotal` = 1.550–1.900, y el Webtext 43 §6 "4.000 und 6.000 Euro"
  contra `example.nightPostMonthly` = 5.500–6.800. Tokenizar habría cambiado en
  silencio el número del cliente, y **ninguno se contradice con nada en su propia
  página** (la Preis-Box sólo afirma el precio por hora). Si confirma que son
  redondeos sueltos, son dos filas más en la tabla del generador.
  ⚠️ Dos que SÍ se tokenizaron **normalizan "bis" al guion del token**
  ("1.550 bis 1.900" → "1.550–1.900"): misma cifra, y la alternativa era dejar un
  precio cableado que la actualización anual se pierde.
- ⚠️ **PARA CHRIS — la ÚNICA edición de puntuación de las 15 páginas.** El Webtext 47
  §4 mete su notación de link a mitad de frase: "… samt Preisrahmen **— →
  /sicherheitskonzept/,** und binnen eines Werktages …". La flecha es una instrucción
  al builder y no copy, y cualquier forma de sacarla deja "— ," o pierde la raya. Se
  perdió la raya (lee bien en alemán) y el destino sobrevive como `.service-link`
  real. Está declarado como un find/replace literal que el generador **aborta** si no
  matchea exactamente una línea, así que no puede fallar en silencio.
- ⚠️ **Las 4 páginas de Brandwache INVIERTEN los CTA** (el teléfono es el primario),
  que es la excepción aprobada a G2 y está en cada uno de sus drafts. **No
  normalizarlas** contra las otras doce, que lideran con el formulario por sus
  propios drafts.
- **Ni un icono nuevo**: los 55 glifos de las secciones de Einsatzlagen, Warum y
  Ablauf salen del sprite que ya existía, y **dentro de una página ninguno se repite**
  — un icono repetido a dos secciones de distancia se lee como error, no como sistema.
- ⚠️⚠️ **MISMO DÍA, CORRECCIÓN DEL CLIENTE: EL BLOQUE DE PROSA SE ESCAPABA DE UN
  CONTRATO QUE EL CHASIS YA TENÍA** ("no puede quedar esto así tan largo, tiene que
  tener dos renglones el título y el texto tener menos width", sobre
  `/objektschutz-nuernberg/`). Eran **21 secciones en 15 de las 16 páginas**.
  - **El defecto era de MARKUP, no de CSS.** Mi generador ponía los párrafos en un
    `.service-prose__body` inventado, cuando las 9 páginas de servicio ya renderizan
    este mismo bloque poniendo su párrafo en un **SEGUNDO `.section__intro`**. De eso
    cuelgan **tres reglas que ya existían** en page-service.css:
    `.service-prose .section__intro` → `text-align: center`; `.section__intro > p` →
    `max-width: 42rem` **y** `hyphens: none`; y
    `.service-prose .section__intro > p` → `margin-inline: auto`.
  - **Mi wrapper se escapaba de las tres a la vez, y se veían las tres**: el párrafo
    corría todo el container (**96–152 caracteres por línea** medidos, contra los
    60–80 cómodos), quedaba alineado a la izquierda debajo de un H2 centrado —
    **216px de desfase** entre el texto del uno y el del otro — y conservaba el
    `hyphens: auto` de base.css, o sea partía compuestos alemanes al medio
    ("un-kontrollierten", "Nach-weis") **dentro de texto centrado**, que es
    exactamente lo que la convención de `/referenzen/` prohíbe.
  - **Arreglado moviendo el markup: CERO reglas nuevas para el ancho.** Lo único que
    quedó en `page-combo.css` es el cap del H2, porque eso el chasis no lo da (deja
    el `.section__intro` en `max-width: none`, así que un título de 45 caracteres
    corría **una sola línea de 1234px a 1440 y 1360 a 1920**).
  - **`max-width: 30ch` + `margin-inline: auto` + `text-wrap: balance`.** 30ch es el
    cap de H2 dominante del proyecto (page-city dos veces, page-service,
    page-sicherheitskonzept), y va en `ch` porque el H2 es un clamp tipográfico y el
    largo del título cambia por ciudad (33 a 68 caracteres en las 21 secciones).
    ⚠️ **`margin-inline: auto` no es opcional** — es la trampa que este archivo ya
    documenta SIETE veces: sin él, `max-width` centra el TEXTO dentro de una caja de
    995px que sigue pegada a la izquierda.
  - ⚠️ **NINGÚN CAP DA "EXACTAMENTE DOS LÍNEAS" PARA LOS 21, y no es alcanzable**: van
    de 33 a 68 caracteres, así que lo que parte el más corto en dos deja el más largo
    en tres. Lo que 30ch garantiza es que ninguno corre una línea gigante, que es el
    defecto reportado. **Medido: 17 de 21 en dos líneas, 1 en tres, 3 en una** — y esos
    tres son los más cortos (33, 34, 35 caracteres), donde una línea es lo correcto.
  - **Medido después, las 21 secciones a 1440 y 1920:** H2 y párrafo **a 0px del eje
    del container** (el desfase se fue), párrafo en **672px** centrado con
    `hyphens: none`, y re-verificado todo lo demás tras regenerar las 15 páginas —
    **128 corridas sin un problema**, 954 elementos de contraste con el único caveat
    del azul del CTA, **FAQ 96/96 byte-idénticas**, 0 literales de precio en la
    fuente, y cero links internos rotos en el sitio.
  - ⚠️ **CORRECCIÓN A MI PROPIA AFIRMACIÓN DE HOY: dije que `.service-prose` no tenía
    CSS en ningún archivo, y eso NUNCA SE VERIFICÓ** — el grep venía en una cadena
    `&&` que cortó antes de llegar a él, porque un `grep -c` previo devolvió 0. Sí
    tiene regla, en page-service.css. **Un comando que no corrió no es evidencia de
    nada; si un chequeo importa, hay que verlo devolver salida.**

- ⚠️ **Dos trampas de medición, mías, que valen para la próxima sonda:**
  1. **`<(h1|h2|h3|p)[^>]*>` TAMBIÉN MATCHEA `<path>`.** Mi diff de copy reportó
     frases larguísimas que "no estaban en el draft" y eran el `<path>` del contorno
     de la ciudad arrastrando medio documento hasta el siguiente `</p>`. Va
     `<(h1|h2|h3|p)(?=[\s>])`.
  2. **Verificar precios contra el BUILD da falsos positivos garantizados**: ahí el
     token ya se resolvió, así que "26 bis 32" aparece como literal aunque la fuente
     tenga `{{price.min}}`. Los literales se chequean en `pages/`, no en `dist/`.
  Y una de entorno: **el proyecto tiene cero dependencias, así que no hay `ws`** — el
  arnés de CDP usa un cliente WebSocket propio de ~40 líneas
  (`scratchpad/cdp.js`), y un lote de 16 páginas en una sola evaluación devolvió
  vacío, así que el contraste se midió en tandas de 4.

**2026-08-17 — EL HEADER DE ORIENTIERUNG DE `/leistungen/` VA CENTRADO** (cliente:
"este título ponelo centrado", sobre "Welche Sicherheitsleistung brauchen Sie?" y su
lede). Header centrado sobre los tres selectores alineados a la izquierda — **la misma
composición que `.lh-why` y el FAQ de esta misma página ya usan**, o sea una decisión
que la página ya había tomado, no una nueva.

- ⚠️ **SÉPTIMA VEZ DE LA MISMA TRAMPA, y hacen falta las TRES cosas:** (1)
  `text-align` centra el TEXTO y los auto-margins centran la CAJA — una caja capada sin
  ellos se queda pegada a la izquierda, o sea título centrado sobre párrafo hugging
  left, que es **peor que no centrar nada**; (2) el auto-margin va en el `<p>` MISMO,
  no en `.section__intro`, porque el chasis deja ese wrapper en `max-width: none` (ya
  es de ancho completo, y ahí las auto-márgenes no hacen nada); (3) el selector necesita
  **DOS clases**, porque `.section__intro > p` del chasis es (0,1,1) y una sola clase
  empata y pierde por orden aunque esta hoja cargue después.
- **Sin hyphenación**, por lo que ya documenta la sección de keyword de esta misma
  página: base.css pone `hyphens: auto` en todo `<p>`, y una línea centrada ya tiene
  dos bordes irregulares, así que un compuesto alemán partido a mitad se lee como falla
  de render.
- **`text-wrap: balance` en el lede, y no es adorno**: sin él la primera línea corre
  hasta el cap de 42rem y la segunda queda corta — centrado eso se ve como un error.
  Medido: el lede queda en **dos líneas parejas de 379px** de 600px para arriba.
- **Medido con un `Range` sobre los NODOS DE TEXTO reales** (el rect del elemento
  miente acá, porque las cajas están capadas), a 320 / 390 / 600 / 768 / 900 / 1024 /
  1280 / 1440 / 1920: **H2 y lede a 0px del eje del container en los NUEVE**, H2 en 1
  línea de 600 arriba (3 en teléfono, inherente a 40 caracteres en una columna de 350),
  `hyphens: none` aplicado, **los tres selectores siguen en `text-align: start`** (o sea
  el split header-centrado / contenido-izquierda es real) y sin scroll horizontal.
  Capturas revisadas a 1440 y 390.
- ⚠️ **El H2 NO lleva `max-width` en `ch`**, al contrario que `.lh-why`: ahí el cap
  existe para forzar un corte lindo en un heading largo, y acá el título entra en una
  línea de 600px para arriba — un cap lo partiría en dos sin que nadie lo pidiera.

**2026-08-17 — EL SEAM DEL HERO DE `/leistungen/` DISOLVÍA EN NAVY HACIA UNA SECCIÓN
BLANCA. La causa: `.pixel-seam--photo` tenía el color de la sección de destino
CABLEADO, y ese destino es el de `/werkschutz/`** (cliente: "en la sección de
Leistungen el degradado está mal, tiene que ser blanco, ¿ves que está azul?").

- **Tenía razón y era un bug real, no una preferencia.** `.pixel-seam--photo` invierte
  el modelo normal del seam: los tiles son el color de la sección de ABAJO y aparecen
  encima de la foto. Pero ese color estaba escrito como literal — **`#00091F` más el
  glow celeste al 0,38**, o sea la banda navy del Risiko **de `/werkschutz/`**, que es
  la única página que tenía este variante. Cuando `/leistungen/` adoptó el hero a
  sangre el mismo día, heredó ese navy mientras su sección siguiente es **blanca**: la
  foto se rompía hacia un azul que **no existe en ninguna otra parte de esa página**.
- ⚠️ **Es LA MISMA lección que este archivo ya pagó tres veces** (`.ag-hero__alt`,
  `.city-callout__lede`, y el `.review-card` sobre sección clara de la pasada anterior
  del mismo día): **un bloque que cablea una superficie se rompe en el momento en que
  su vecina cambia de color.** La diferencia acá es que el color cableado no era el
  suyo sino el **del vecino**, que es todavía más fácil de heredar sin notarlo.
- **El arreglo no toca los valores de werkschutz: los hoistea a dos custom properties
  con esos mismos literales como DEFAULT** (`--pixel-photo-fill` /
  `--pixel-photo-glow`), y agrega un modificador `.pixel-seam--photo-light` para
  destino claro. Así `/werkschutz/` es byte-idéntico y una tercera superficie es un
  modificador más, no una edición de los defaults.
- ⚠️ **El glow va a `none`, NO a un gradiente más pálido**, y la razón es la que
  documenta el propio bloque: esa rampa existe para empalmar con el **borde superior
  ILUMINADO** de la banda navy — un `.section--light` no tiene ningún borde iluminado
  con el que ser continuo. Y el relleno es `--color-white` exacto, por lo mismo que ya
  usa `.pixel-seam--white`: **#FAFAFA se leería como una banda grisácea entrando a una
  sección blanca.**
- **Verificado midiendo los DOS lados, no sólo el arreglado:** `/leistungen/` da ahora
  tiles `rgb(255,255,255)` con `glow: none` contra una sección siguiente de
  `rgb(255,255,255)` — **iguales**; `/werkschutz/` sigue en `rgb(0,9,31)` con su
  gradiente contra una sección de `rgb(0,9,31)`. **180 tiles en las dos.** Captura del
  seam a mitad de disolución revisada: píxeles blancos rompiendo la foto, cero navy.
- **Cero impacto de layout** — sólo cambia `background-color` / `background-image` de
  los tiles.
- ⚠️ **PARA LA PRÓXIMA PÁGINA QUE USE UN HERO A SANGRE:** `--photo` ya no asume nada.
  Hay que **declarar hacia qué superficie disuelve** — sin modificador es navy. Está
  anotado en el markup de las dos páginas.

**2026-08-17 — `/referenzen/`: EL RATING GENERAL DE GOOGLE ENTRA EN LA SECCIÓN DE
TESTIMONIOS, CON EL MISMO WIDGET DE SIEMPRE Y SÓLO LA SUPERFICIE CAMBIADA** (cliente:
"agregame el rating general, el widget que vemos en todas las otras secciones, pero
ponelo que quede bien en la sección"). Toca `pages/referenzen.html` y
`css/page-referenzen.css`; **ni un componente compartido se modificó.**

- **Es el MISMO `.review-card review-card--sm` que llevan los heroes**, markup
  idéntico, para que el sitio siga teniendo UNA marca de rating y no una segunda
  parecida. Lo único que se overridea es la SUPERFICIE, y hacía falta: ese componente
  está diseñado para fondo negro (`--color-white` + `--shadow-md`), y esta sección es
  blanca.
- **Va DEBAJO del H2, dentro del `.section__intro`**, y el orden es el argumento: las
  tres citas son EJEMPLOS de cinco estrellas y el agregado es la afirmación que las
  respalda, así que se lee "puntaje general, y acá tres de las reseñas". **El centrado
  sale gratis** — `.ref-intro--center` ya es `text-align: center` y el pill es
  `inline-flex`, así que no hizo falta ni una regla de centrado.
- ⚠️ **EL RELLENO ES EL DE `.testimonial` (rgb(59 73 86 / 0.04)), COPIADO Y NO
  RE-DERIVADO, Y LA SOMBRA SE FUE.** Sobre blanco, un pill blanco con `--shadow-md`
  se lee como un objeto ELEVADO 24px arriba de tres cards INSET — dos materiales para
  una sola idea, y el relleno blanco además no hace ningún trabajo. Plano y tintado
  vuelve al pill y a las cards una decisión. (Blanco+sombra sobre blanco **sí** es un
  patrón válido de este sitio —`.service-cases__card`— pero no justo arriba de paneles
  planos.)
- ⚠️ **El RADIO se queda en `--radius-lg` mientras las cards usan `--radius-md`, a
  propósito:** a ~48px de alto, 16px es lo que hace que esto se lea como el PILL que es
  en los siete heroes; 8px lo convertiría en una cajita, o sea un cuarto material.
  **La superficie sigue a la sección, la forma sigue al componente.**
- ⚠️⚠️ **SI ESTA SECCIÓN ALGÚN DÍA PASA A OSCURA, HAY QUE BORRAR EL OVERRIDE ENTERO,
  NO INVERTIRLO.** El blanco+sombra de la base ya es correcto sobre oscuro, y un tinte
  de blanco al 4 % sobre negro es invisible. Es la regla que este proyecto ya pagó dos
  veces (`.ag-hero__alt`, `.city-callout__lede`).
- ✅ **DEFECTO REAL ENCONTRADO MIDIENDO, a 320px: el pill medía 288px dentro de una
  columna de 280 y NO SE PUEDE CENTRAR.** Un `inline-flex` más ancho que su line box
  no lo centra `text-align`: arranca en el borde izquierdo y desborda a la derecha, así
  que quedaba **4,1px fuera del eje con 8px de sí mismo metido en el padding del
  container**. ⚠️ **La página nunca scrolleó de costado, y por eso es fácil que pase
  desapercibido** — `hScroll: 0` no significa "está bien". Arreglado bajando gap y
  padding un paso abajo de 400px, que son **los mismos 8/12px que este badge ya usa en
  teléfono dentro de los heroes** (G6), o sea no es un tamaño nuevo: **272px y 0px de
  desvío**, y sigue en una fila.
- **Los valores salen de `content/values.json`** (`{{rating.value}}` /
  `{{rating.count}}`), nunca tipeados — G10/G5. El fill de 94 % es el modificador
  compartido (4,7/5). **Verificado en el build: 2 pills en la página, las dos con
  "4,7" y "97 Bewertungen", y cero tokens sin resolver.**
- ⚠️ **NO se agregó un segundo `aggregateRating` al JSON-LD**: el grafo ya publica
  4.7/97 una vez, y esto es la misma cifra mostrada dos veces, no una nueva. (De paso:
  eso es justo lo que Google pide — que el rating del schema sea visible en la página.)
- **Medido a 320 / 390 / 600 / 768 / 1024 / 1440 / 1920:** pill **272→297x48, UNA fila
  en todos** y **0px de desvío del eje**, `box-shadow: none`, el tinte componiendo a
  `rgb(247,248,248)`, la cifra a **8,68:1** y "97 Bewertungen" a **5,04:1** (los dos
  sobre el piso de 4,5:1), **sin scroll horizontal**. Aire 24px al H2 y 64px a la
  grilla — asimétrico a propósito, el pill pertenece al grupo del encabezado. Capturas
  revisadas a 1440 y 390.
  ⚠️ Las estrellas doradas siguen a 1,84:1: es el estado **pre-existente y ya
  documentado** de este componente en las 8 páginas que lo llevan (son un gráfico con
  la cifra al lado), no algo que introdujo esta pasada.
- ⚠️ **Chequeado antes de tocar: `.ref-quotes` tiene un `padding-top` real** y el
  comentario de esa regla advierte que con `padding-top: 0` volvería la banda negra de
  margin-collapse. El wrapper nuevo es el SEGUNDO hijo (el h2 es el primero), así que
  su `margin-top` no puede escapar de la sección igual. Verificado en captura: sin
  banda.
- ⚠️ **TRAMPA DE ENTORNO QUE COSTÓ UNA CORRIDA: el server de `dist/` en el puerto 8099
  NO era mío** (estaba levantado al empezar la sesión) **y se murió a mitad del
  trabajo.** El `--dump-dom` devolvió 187KB de la **página de error de Chrome** y la
  sonda reportó "NONE", que parece un bug de la sonda. Se detecta con
  `curl -o /dev/null -w "%{http_code}"` → **000**. Levantar un server propio en un
  puerto propio antes de medir, y no heredar el de otra sesión.

**2026-08-17 — LOS 3 MARCOS DE TITELBILD DE LOS ARTÍCULOS DEL RATGEBER, RESERVADOS
ANTES DE QUE EXISTAN LAS FOTOS. Y ARREGLÓ UNA DESALINEACIÓN PRE-EXISTENTE DE 33,5px
QUE EL PROPIO COMENTARIO DE LA REGLA CREÍA ESTAR EVITANDO** (feedback 3.11, "add a
title image (hero)" en los tres artículos).

- **Qué es y por qué ahora:** las fotos no existen, así que cada hero lleva un marco
  16/9 vacío con etiqueta entre corchetes. Es el patrón que este repo ya midió dos
  veces (`.cs-figure` de las case studies, el retrato reservado de Jäger): **el marco
  toma el espacio real hoy, así que meter el `<picture>` después no mueve nada** — con
  Jäger la medición fue 416x520 antes y después, CLS 0. Y reservar es lo que **fija la
  proporción ANTES de que el cliente exporte**, en vez de recibir tres fotos con tres
  ratios y recortarlas.
- ⚠️⚠️ **EL HALLAZGO GRANDE, y era un bug en vivo en 2 de las 3 páginas: la columna
  del hero NO estaba alineada con el cuerpo del artículo.** `.rg-hero
  .service-hero__content` es un grid item con `max-width: 44rem` + `margin-inline:
  auto`, y **un auto margin CANCELA `justify-self: stretch`**, lo que la vuelve
  content-sized: su ancho salía del renglón más largo de adentro, o sea **del largo
  del byline de cada página**. Medido a 1440: `paragraph-34a-erklaert` daba 704px
  (su byline lleva "(Geschäftsführender Gesellschafter)" y llegaba al cap) pero
  `kosten` y `brandwache` **637px auto-centrados, borde izquierdo 401,5 contra los
  368 de `.rg-article`**. O sea **33,5px** — casi exactamente los 32px que el
  comentario de esa misma regla predecía que "se leerían como una falla de render",
  llegando por otra puerta. Es la misma trampa que `page-service.css` documenta para
  la price card. `width: 100%` lo cierra: **`h1 == marco == artículo` en los 27
  anchos medidos.**
  ✅ **Y de-riesga el marco:** un `<img>` tiene ancho intrínseco, así que dentro de
  una caja content-sized habría ensanchado la columna al cargar — un layout shift
  causado por el elemento agregado para evitar uno.
- **El `--empty` está separado a propósito, y es lo que hace el swap gratis:** el
  `aspect-ratio`, el radio y el `overflow` viven en `.rg-hero__frame` (lo que necesita
  una imagen REAL) y sólo la piel de placeholder —borde punteado, relleno, centrado—
  en `.rg-hero__frame--empty`. Así el día que lleguen las fotos son **dos ediciones de
  markup y CERO CSS**: borrar esa clase y cambiar el `<span>` por un `<picture>`.
- ⚠️ **El borde es `--color-border-strong`, NO el `--color-border` que usa el marco
  idéntico de las case studies, y es una diferencia de SUPERFICIE, no de gusto:** el
  de ellas vive dentro de `.section--light`, que re-declara ese token a un valor
  oscuro. Acá el hero es negro, donde `--color-border` es blanco al 0,12 — punteado en
  eso es casi invisible, y **un marco reservado que el cliente no puede ver en el
  preview falla en lo único que tiene que hacer**. 0,42 mide ~3,7:1 sobre este negro.
- ⚠️ **Las 3 etiquetas son INFERIDAS del tema de cada artículo, y eso es una
  diferencia real con las case studies:** los tres `.docx` del Ratgeber **no mencionan
  imágenes** (los tres chequeados a máquina), mientras los de las case studies nombran
  su motivo ("Begehungssituation am Werkstor"). Van marcadas como pregunta para Chris
  en los tres markups, no como dirección aprobada.
- **Export spec para el cliente: 16:9, mínimo 1600x900.** El marco mide **704px de
  ancho como máximo** (el cap de 44rem, verificado como tope en todos los viewports),
  así que 1408 cubre DPR 2 exacto y 1600 deja margen.
- **`.hero__trust` en el `<figure>` es el HOOK de `js/hero-reveal.js`, no un estilo** —
  verificado que no tiene ni una regla en estas páginas (sólo menciones en
  comentarios). Es el patrón de dos clases que ya usa la trust band de `/ueber-uns/`, y
  hace que la imagen llegue como tercer beat de la cascada del hero. **Seguro por
  contrato:** ese script pone el estado oculto con `gsap.set` y sólo en JS, así que sin
  JS y con `prefers-reduced-motion` el marco está visible (medido `opacity: 1`,
  `transform: none`).
- **Medido en los 3 × 9 anchos (320 / 390 / 600 / 768 / 1023 / 1024 / 1280 / 1440 /
  1920):** ratio **1,7778 exacto** en las 27, marco 704x396 a 1440, **`hScroll` 0 y
  cero elementos fuera del viewport**, etiqueta a **8,47:1** y `hyphens: manual` (o sea
  no puede partirse a mitad de palabra — la trampa que el `<p>` de la nota de Jäger sí
  pagó; un `<span>` la evita estructuralmente). Capturas revisadas a 1440 y 390.
- ⚠️ **Costo medido y aceptado: +428px de hero** en las tres (1440: 427→855, 403→831,
  348→776), que es exactamente el marco (396) más su margen (32). **A 1440x900 sigue
  entrando en la primera pantalla.**
- ✅ **El hub se verificó por A/B real, no por razonamiento** (la regla que cambió es
  compartida con `.rg-hero--hub`): se buildeó con y sin `width: 100%` y se midieron los
  9 anchos. **De 9 filas cambió UNA**: a 320px la columna pasa de 288 a **280px** —
  o sea deja de desbordar 8px su propio container— con **alto y borde izquierdo
  idénticos** y sin nada recortado. De 1024 arriba **no cambia nada** porque ahí el hub
  ya pone `margin-inline: 0`, así que el stretch nunca estuvo cancelado.
- ⚠️⚠️ **TRES TRAMPAS DE MEDICIÓN, y dos casi me hacen reportar bugs que no existían:**
  1. **Con motion PRENDIDO el marco mide `opacity: 0` y NO es un bug.** Bajo
     `--virtual-time-budget` el ticker rAF de GSAP no avanza: medido
     **`gsap.globalTimeline.time()` = 0,03s después de 5 segundos**, y el **byline y
     las palabras del H1 —que están en vivo desde hace semanas— también daban 0**. Eso
     es lo que lo distingue de un bug real: si los hermanos ya aprobados están
     congelados, el congelado es el harness. **El estado final se verifica empujando el
     timeline a mano** (`gsap.globalTimeline.time(6)`) → los tres pasan a `opacity: 1`
     y transform identidad. **Y las capturas hay que sacarlas con reduced motion**, si
     no el hero sale vacío.
  2. **`getClientRects().length` NO cuenta líneas en un flex item.** Reportó `1` para
     una etiqueta que a 320px claramente envuelve — porque el `<span>` es hijo de un
     `display: flex` y se **blockifica**, así que devuelve un rect siempre. El wrap
     real se lee en el ALTO: 67px (3 líneas) a 320, 45 (2) a 390, 24 (1) de 768 arriba.
  3. **Un `<textarea>` con `value` puesto por JS no serializa en `--dump-dom`** —
     `.value` no cambia el nodo de texto hijo. La primera corrida entera devolvió
     vacío por eso. Usar `textContent` en un `<div>`.
- ⚠️ **Visto midiendo y NO tocado (es pre-existente y cosmético):** el byline queda muy
  pegado a la última línea del H1 en los tres artículos. No entraba en el pedido.
- ⚠️ **Feedback 3.10.2 pide además Titelbilder en las CARDS del hub** — otro marco,
  otra proporción, **no reservado en esta pasada**. La misma foto puede alimentar los
  dos, pero el recorte de la card es una decisión aparte.

**2026-08-17 — "VERWANDTE LEISTUNGEN UND EINSATZGEBIETE" REDISEÑADA: DE DOS CARDS A
UN ÍNDICE EDITORIAL. Toca las 13 páginas que cargan el bloque** (cliente: "se siente
genérico, pesado y tipo card de SaaS… quiero que se sienta premium, editorial, mínimo
e intencional"). Todo en `.service-related*` de `page-service.css` más un `<span>` por
fila en el markup. **Ni un link ni una palabra de copy cambió.**

- ⚠️⚠️ **ESTO REVIERTE CUATRO DECISIONES DEL PROPIO CLIENTE SOBRE ESTE MISMO BLOQUE,
  y por eso están listadas en el CSS**: la **línea azul de 2px** sobre cada título
  (03-08, al celeste del CTA el 05-08, bleedeada a los bordes de la card el 16-08); el
  **tratamiento de card** copiado de `.service-cases__card` (16-08: borde + radio +
  fill blanco + sombra de dos capas); las **columnas de igual alto**; y el **fill
  NEGRO con texto blanco + rotación de 45°** del hover (05-08, paridad con la lista de
  outfits del homepage). La instrucción posterior gana. **No "restaurar" ninguna.**
- ⚠️⚠️ **ACHICAR EL TÍTULO OBLIGÓ A CAMBIAR EL AZUL, y las dos cosas no se pueden
  separar.** El tamaño viejo (20px bold plano) NO era gusto: `--color-blue-light` mide
  **3,11:1 sobre blanco**, o sea pasa **sólo como texto grande**, y el umbral de WCAG
  es 18,66px bold — el flat 1.25rem/700 existía exactamente para quedar arriba. A 13px
  aplica el 4,5:1 de texto normal y **los dos azules de marca fallan** (3,11 y 3,71).
  El color pasa a la mezcla profunda que el sitio ya usa para azul chico sobre claro,
  `color-mix(blue-dark 85%, black)` = **#4673AB**. **Medido sobre el render, no
  deducido: 4,59:1** — ojo que es contra la superficie tintada (#F8F8F8), no contra
  blanco puro, así que da un pelo menos que el 4,88 que se cita en otras páginas.
  **No devolverlo a un token de marca ni achicarlo más: a 13px ya es texto normal.**
- **La card pasa a SUPERFICIE:** `--color-bg-subtle` (4 % de la tinta de la sección),
  **sin borde y sin sombra**. Radio **1.5rem, deliberadamente el off-scale que el
  sitio YA tiene** (compartido con la price card y las cards de Anwendungsfälle) — el
  brief pedía 20–24px y ningún token cae ahí, así que reusar la excepción existente es
  justo lo que evita inventar una segunda.
- ⚠️ **"Sin espacio vacío abajo" fue UNA declaración, y no la que parecía:** el panel
  es un grid item, así que su alto venía **de la pista, no de su contenido**.
  `align-items: start` en `.service-related__cols` es todo el arreglo. Medido a 1440:
  las dos columnas de `/objektschutz/` miden **239 y 294px** en vez de 294 y 294.
- **Medida controlada: `max-width: 60rem` centrado** (dos columnas de 464px), contra
  los ~1300px del container. Es lo que más ayudó a que dejara de leerse como
  dashboard: un nombre y su flecha estaban a medio metro de distancia. Empalma con las
  44rem que el H2 de arriba ya usa, así heading y listas comparten eje. El gap de
  columnas baja del clamp de 64–128px a **32px**, y el aire bajo el heading de 48 a 32.
- **Filas más ajustadas**: padding block 24 → **14px** y label de `--font-size-md`
  (18–20px) a **16px**. Alto medido **53,6px**, o sea sigue pasando los 44 táctiles por
  sí solo. Los separadores pasan a `li + li`, así que existen **sólo ENTRE filas** —
  ✅ **y eso BORRÓ un caso especial en vez de necesitar otro**: la regla
  `:first-child { border-top: 0 }` existía porque en `/brandwache-nuernberg/` (lista
  única SIN título) la primera fila dibujaba un divisor bajo un título inexistente.
- ⚠️ **EL LABEL TIENE QUE SER UN `<span>` REAL, y son 74 filas en 13 páginas.** El
  brief pide que el TEXTO se mueva 4px, la flecha se mueva en diagonal y el tinte se
  quede quieto — tres movimientos sobre lo que era un nodo de texto pelado más un
  `<svg>` en la misma fila flex. Transformar el `<a>` arrastra su propio fondo (se
  desliza la fila, no el texto) y animar el padding sería una propiedad de LAYOUT por
  frame. **Envolver las palabras es la única forma de mover sólo las palabras.**
  ⚠️ **Seguro contra GSAP**: `data-item-reveal="li"` anima el `<li>` y GSAP escribe
  `translate/rotate/scale: none` inline sobre lo que anima — la trampa que dejó muerto
  el hover de `.city-why__item`. Este transform va en un NIETO, que es exactamente el
  patrón que aquella corrección prescribe. **Verificado con puntero real** (no con
  `dispatchEvent`, que no dispara `:hover`): tinte `rgba(82,135,201,0.08)`, texto a
  `rgb(1,1,1)`, label `translateX(4px)`, flecha `translate(3px,-3px)` y azul, **y la
  fila no se movió 0,0px**.
- **La flecha ahora es NEUTRA en reposo** (`--color-text-muted`) y azul sólo en hover,
  y baja de 28 → **18px**: cada fila estaba dibujando un chevron #3D9AD3 saturado, así
  que una lista de cuatro se leía como cuatro acentos.
- ⚠️ **La regla `.section--light .service-related__link:hover` es (0,2,1) y le GANA a
  la base — ya se contradijeron dos veces.** Decía negro cuando el fill era negro, y
  después blanco; con el tinte pálido, blanco sería invisible. Ahora oscurece a tinta
  plena. **Si vuelve a cambiar el fill, ESA es la regla que decide el color del texto.**
- ✅ **ARREGLADO DE PASO UN DEFECTO REAL QUE ESTE ARCHIVO YA DOCUMENTABA:
  `/sicherheitskonzept/` usaba `.service-related__grid`, una clase SIN NINGUNA REGLA
  en todo el proyecto**, así que sus dos grupos caían a layout de bloque y se apilaban
  a todo ancho mientras las otras 12 páginas los ponían al lado. Pasó a `__cols` /
  `__col`; verificado, ahora son dos columnas de 464px. Los 9 comentarios de markup que
  advertían sobre esa variante quedaron actualizados.
- **Medido en las 13 páginas** a 320 / 390 / 600 / 767 / 768 / 900 / 1024 / 1152 / 1440
  / 1920: **sin scroll horizontal y cero elementos fuera del viewport en ninguna**,
  dos columnas exactamente iguales y con el mismo top desde 768, una sola columna
  debajo con Leistungen primero, y la fila mínima en 53,6px en todas. **Contraste
  muestreado del render**: label 4,59:1, texto de fila 8,68:1, flecha en reposo 4,43:1,
  y en hover texto 18,17:1 y flecha 3,23:1 (las dos flechas son gráficos, piso 3:1).
  Con `prefers-reduced-motion`: **0 filas ocultas, 0 con transform**, y el markup
  servido —lo que recibe un crawler— trae los 74 labels como texto real.

**2026-08-17 — `/leistungen/`: FOTO NUEVA Y EL HERO PASA A FULL-BLEED COMO EL DE
`/werkschutz/`** (cliente: "guardé en la carpeta de images una imagen que se llama
Heroleistungen y quiero que la sustituyas por la que hay ahora en el hero, y que no
haya gradientes arriba y abajo como hay ahora, que sea como la de werkschutz, que
está ocupando todo el background del inicio").

- ✅ **CIERRA EL "INTERIM PHOTO" QUE ESTA PÁGINA ARRASTRABA DESDE EL 2026-08-10.**
  El hub usaba el apretón de manos de la system-story del homepage porque **todas
  las landscape del proyecto ya eran el hero de otra página**. `Heroleistungen.png`
  es de FRANKONIA: dos personas de uniforme con portapapeles en el lobby de un
  edificio, 1578x989 — o sea una apaisada de verdad, y `cover` casi no recorta.
  Exportada a 768/1280/1578 WebP (46/93/132KB) + JPEG de 1578 (208KB).
  ⚠️ **Se borró `leistungen-hero-1280.jpg`**, el fallback de la foto anterior: el
  nuevo es el de 1578 y dejar el viejo era un archivo huérfano que `build.js`
  publica igual.
- ⚠️⚠️ **LOS "GRADIENTES ARRIBA Y ABAJO" TENÍAN UNA CAUSA CONCRETA: la foto
  empezaba en el borde de la SECCIÓN, no arriba de la página.** Este hero abría con
  `rgb(1 1 1 / 0.97)` justamente para que la imagen "emergiera" del negro debajo del
  breadcrumb, y cerraba con 0.94. **Con el bleed no hay corte horizontal que tapar,
  así que las dos bandas que lo tapaban son exactamente las que el cliente pidió
  sacar.** Se fueron las dos.
- **Se usa el `.service-hero--bleed` DEL CHASIS, no una segunda copia.** Con eso
  `/leistungen/` y `/werkschutz/` son **un** hero con dos fotos, en vez de dos
  heroes de foto casi iguales en dos hojas que pueden divergir. Se borraron
  `.lh-hero--photo`, `.lh-hero__bg` y sus dos washes (~2.700 caracteres), más dos
  reglas que repetían lo que el chasis ya dice (el `z-index` del grid y la columna
  única a ≥1024).
- ⚠️ **OPTAR POR EL BLEED SON DOS COSAS JUNTAS**, como ya documenta page-service.css:
  la clase **y** mover el breadcrumb ADENTRO de la sección con
  `.service-hero__crumbs`. Con el breadcrumb afuera, la foto se le trepa encima.
- ⚠️ **EL SEAM DE ABAJO PASÓ A `--photo` Y ADENTRO DEL HERO.** Un seam normal pinta
  tiles del color de la sección de ARRIBA — sobre una fotografía eso es una barra
  negra plana, o sea **la banda inferior que el cliente pidió sacar, sólo que
  animada**. `--photo` invierte el modelo (tiles del color de la sección de abajo,
  que aparecen). Al dejar de ser hermano previo, la sección de Orientierung deja de
  reservar los 200px, que es lo correcto: la banda ya no está en ella.
- ⚠️⚠️ **DOS COSAS DEL CHASIS ESTÁN CALIBRADAS PARA LA FOTO DE WERKSCHUTZ Y HAY QUE
  NEUTRALIZARLAS.** `.service-hero__bg img` lleva
  `filter: brightness(1.34) contrast(0.96) saturate(1.06)` — **medido para una toma
  NOCTURNA cuya luminancia mediana propia es 0,010**. Esta foto es un lobby a plena
  luz: el mismo lift quema la pared vidriada del fondo y aplana el cuadro. Va
  `filter: none` y su propio `object-position`. **Cualquier página que adopte el
  bleed con una foto diurna tiene que hacer lo mismo.**
- ⚠️ **`.lh-hero` ES TAMBIÉN EL HERO DE `/einsatzgebiete/`** (`service-hero lh-hero
  eg-hero`), así que su regla de `min-height: 70svh` lleva ahora
  `:not(.service-hero--bleed)`. Sin eso empataba en especificidad con el
  modificador y ganaba por orden de carga, colapsando la caja de la foto.
  **Verificado midiendo las dos: `/einsatzgebiete/` sigue en 630px y arranca en
  top 137; `/leistungen/` arranca en top −16, igual que `/werkschutz/`.**
- ⚠️ **COSTO MEDIDO Y ASUMIDO: el hero pasó de 630 a 953px a 1440x900**, o sea la
  capa de Orientierung ya no asoma en la primera pantalla. Ese 70svh era una
  decisión medida del 2026-08-10 con ese objetivo — **pero era para un hero que NO
  era una foto a sangre**, y una foto de fondo de 630px se recorta demasiado. Se
  conserva el 70svh como PISO (`min-height: 70svh + banda` = 830px), así que en
  pantallas altas este hero sigue siendo bastante más corto que el de werkschutz
  (1055px); a 1440x900 no ata porque el contenido pide 953. Si molesta, la palanca
  es el padding del bleed, no el min-height.
- **Contraste medido sobre la foto REAL** (ocultando el texto y muestreando el rect
  de cada elemento, no razonando sobre el CSS): a 1440 badge **13,12:1**, H1
  **11,51:1**, lede **12,41:1**, CTA **14,30:1**, breadcrumb **19,10:1**; a 390,
  15,42 / 14,55 / 12,69 / 15,44 / 13,35. Muy por encima del 4,5:1.
- **En teléfono el wash va VERTICAL**, porque ahí el copy ocupa todo el ancho y una
  rampa de izquierda a derecha no le compra nada — el lede y los CTA caen sobre la
  pared vidriada y las dos personas, que es lo más claro del cuadro. Misma decisión
  que toman el homepage y `/werkschutz/` en ese breakpoint.
- **Medido a 320 / 390 / 768 / 1024 / 1440 / 1920** en `/leistungen/` y
  `/einsatzgebiete/`: sin scroll horizontal, nada fuera del viewport, cero fallos de
  contraste, un solo `<h1>`, 6 y 4 seams respectivamente.
- ⚠️ **`assets/images/Heroleistungen.png` (1,7MB) SE PUBLICA.** `build.js` copia
  `assets/` entero, así que el original crudo se sirve por URL — el mismo caso que
  las 4 fotos de `/jobs/` en 2026-08-04. **No se movió** (es el archivo del cliente,
  y este archivo ya documenta dos veces lo que cuesta tocar uno), pero antes del
  próximo deploy va a `~/Desktop/FRANKONIA-assets-archive/`. Los exports pesan 479KB
  contra 1,7MB del original.
- ⚠️ **Nota de medición, otra vez la misma:** una captura a `--window-size=390` sale
  RECORTADA a la derecha porque Chrome fuerza un viewport de layout de ~500px. La
  primera captura de teléfono parecía tener el H1 cortado y no era la página: hay
  que renderizar en un iframe de ancho fijo dentro de una ventana ≥500px. Y
  `npm run build` **borra los archivos de sonda que uno deja en `dist/`**, así que
  una captura después de un build devuelve el 404 del servidor.

**2026-08-17 — EMPIEZA LA REVISIÓN PÁGINA POR PÁGINA DE LOS SERVICIOS. `/objektschutz/`:
DOS SECCIONES CENTRADAS Y UN DEFECTO REAL DE LAYOUT EN LA LISTA DE TICS**
(cliente: "vamos a ir corrigiendo página por página… esto tiene que ir centrado" +
"esa sección además está rara, hay mucho espacio en blanco entre los items").

- ⚠️⚠️ **EL "MUCHO ESPACIO EN BLANCO" ERA UN BUG, NO EL ESPACIADO.** La sección
  Sicherheitskonzept tiene cuatro líneas de proceso y **exactamente una lleva dos
  puntos** — "Schriftliches Konzept: Personal, Zeiten, Technik-Empfehlung". El
  renderer parte en `Label: text` cualquier línea con dos puntos, así que esa
  salió con **título en negrita + segunda línea** y sus tres hermanas como una
  sola línea. En una grilla de dos columnas eso hace que la fila 1 mida el doble
  que la fila 2 y se abra un hueco entre las dos. **Lo que se veía como un
  problema de spacing era una lista con una sola card de otra forma.**
  Arreglado declarando la sección `titleless`: las cuatro renderizan igual, con
  los dos puntos incluidos, exactamente como los escribe el draft.
  **Auditadas las 9 páginas: es la única lista con formas mezcladas.**
- **Centrado opt-in por SECCIÓN, no por bloque** (`.service-section--centred`):
  el cliente está revisando estas nueve de a una y lo pide donde se lee mejor, así
  que tiene que declararse al lado de la sección. Es la composición que el sitio ya
  usa en varios lados — **header centrado, contenido a la izquierda**: centrar
  también los items les saca el borde izquierdo común contra el que el ojo compara.
  ⚠️ **La trampa de especificidad de siempre, y van OCHO veces**: hace falta un
  selector de DOS clases (el chasis pone `.section__intro > p { max-width: 42rem }`
  a (0,1,1), así que una clase sola empata y pierde por orden) **y**
  `margin-inline: auto` además del `text-align` (uno centra el TEXTO, el otro la
  CAJA). Con una sola de las dos queda título centrado sobre párrafo pegado a la
  izquierda, que es peor que no centrar nada.
- **El bloque de la lista se capa a 62rem y se centra** — si no, cuatro líneas
  cortas se estiran por los 1600px del container y se leen como cuatro fragmentos
  sueltos. ⚠️ Ese ancho está medido para DOS columnas de tics y para TRES cards;
  una lista centrada de 5 o 6 quedaría apretada.
- **`row-gap` de `.service-scope__list` a `--space-5`** (era el `gap` de 32px en
  los dos ejes). Con items uniformes 24px es el ritmo correcto y las columnas
  conservan su aire horizontal.
- **Medido después a 320 / 390 / 768 / 1024 / 1440 / 1920** en `/objektschutz/` más
  `/brandwache/` y `/interventionsdienst/` (que heredan el cambio de `row-gap`):
  sin scroll horizontal, nada fuera del viewport, cero fallos de contraste, un solo
  `<h1>`.

**2026-08-16 — LAS 9 PÁGINAS DE SERVICIO QUE FALTABAN ESTÁN CONSTRUIDAS. Con eso
las 12 Leistungsseiten están completas y no queda un solo link de servicio roto en
el nav, el footer ni `/leistungen/`** (cliente: "ahora haceme las paginas de los
servicios"). Objektschutz · Sicherheitstechnik · Brandwache · Kaufhausdetektei ·
Veranstaltungsschutz · Baustellenbewachung · Revier- & Schließdienst ·
Empfangsdienst · Interventionsdienst, de los Webtexte 02/04/05/06/07/09/10/11/12
(Stand 04.08.2026), verbatim, alemán. La plantilla actualizada está en
[docs/page-conventions.md §8.1 y §8.4–8.6](docs/page-conventions.md); acá va lo
que no se deduce de ahí.

- ⚠️⚠️ **"COPIAR WERKSCHUTZ Y CAMBIAR EL COPY" ERA LA MITAD DE LA VERDAD, y es la
  misma sorpresa que dieron las ciudades.** §8.1 decía que los 12 drafts usan la
  misma 9-Punkte-Struktur — cierto con los de julio, **falso con el copy v2**.
  Seis de los nueve lo escriben en su propia cabecera: *"Struktur bewusst
  variiert"*, *"Struktur-Variante 'Notfall-Leistung'"*, *"Variation statt
  Risiko-Karten"*, *"Struktur-Variante 'Wirtschaftlichkeit'"*. Van de **8 a 11
  secciones** y la mitad tiene una sección que ninguna otra tiene (Türsteher,
  Anzug oder Montur, la Alarmkette, el Modell-Vergleich, "Wann ist eine Brandwache
  Pflicht?"). §8.1 está corregido.
- ⚠️ **CONSECUENCIA: LA LISTA DE SEAMS NO SE PUEDE COPIAR.** Los tiles son del
  color de la sección de ARRIBA y dos del mismo color no llevan seam (§9.2), así
  que con otro orden cambia entera. Las nueve van de **7 a 11 seams**. Se
  **deriva** de la secuencia de superficies, no se escribe.
- **Por eso se generaron con un script**, `docs/design-sources/service-pages.py` +
  `service_pages_data.py` + `service_drafts.py`, de **una sola pasada y en
  desarrollo**, igual que `city-pages.py`. No corre en `npm run build`. Existe por
  las dos cosas que se rompen a mano y **no se ven en una captura**: la paridad
  FAQ ↔ JSON-LD (**46 pares**) y el color de cada seam. Después son páginas
  normales, editables a mano; **no re-correrlo sobre una página ya editada.**
- ⚠️ **Y por una tercera razón que apareció construyendo: NINGUNA PALABRA SE
  TIPEÓ.** Son ~19.000 palabras de alemán, y un error de transcripción en copy
  aprobado no lo caza ninguna medición. `service_drafts.py` sale a máquina de los
  `.docx` — que **no están en git**, así que ese archivo es la única copia
  versionada de estos nueve drafts.
- ⚠️⚠️ **EL SPLIT "párrafo de intro" ↔ "items de lista" NO SE PUEDE ADIVINAR, y
  el primer intento lo adivinó mal en seis de los nueve.** La prosa alemana está
  llena de dos puntos: *"Der Empfang prägt den ersten Eindruck von Ihrem
  Unternehmen: Wer hier unfreundlich behandelt wird…"* parsea exactamente igual
  que una fila `Label: text`, y también el intro del Risiko que abre con una cita.
  Se probaron largo, cantidad de palabras y mayúscula inicial — **cada heurística
  pasaba en unos drafts y se tragaba un párrafo de intro dentro de una card en
  otros**. Ahora el `body` de cada sección queda **en orden de origen** y el corte
  se DECLARA (`prose: N`) en el data file, donde es un número visible que el
  generador verifica. **No volver a heurística.**
- **Lo que hubo que agregar a `css/page-service.css` — cinco bloques, todos
  `.service-*` genéricos, cada uno forzado por un asset o una estructura de copy
  que Werkschutz no tiene**, no por gusto:
  - **`.service-hero--split`** — las 9 fotos de servicio son **verticales**
    (820x~1220). ⚠️ **Es una RESTAURACIÓN, no un invento**: §8.2 siempre prescribió
    el hero de dos columnas para una foto vertical, y las reglas se habían borrado
    el 2026-08-03 al pasar Werkschutz a foto apaisada. Conserva TODA la tipografía
    del hero compartido; lo único que cambia es que hay segunda columna.
    ⚠️ **El `aspect-ratio` se declara por página con la altura REAL del archivo**:
    cinco de las nueve miden 1217–1225 y no 1227, y un ratio compartido deja una
    franja del fondo del marco asomando — el defecto que el cliente reportó como
    "some service images show a grey bar" en el preview del homepage.
  - **`.service-points*`** — N bloques rayados. Es la forma más repetida de los
    nueve drafts. **SEXTO consumidor de esta forma** (`.lh-why*` es la misma idea y
    la checklist ya decía que debería estar en el chasis; no se fusionaron porque
    ese bloque está vivo en dos páginas aprobadas). ⚠️ **Se eligió sobre
    `.service-cases`** —las cards azules glossy— a propósito: ésas cargan el caveat
    documentado de **3,11:1** con un párrafo dentro de cada card, y reusarlas
    habría republicado ese caveat unas cuarenta veces para secciones que el draft
    nunca pidió como cards.
  - **`.service-scope*`** — el Leistungsumfang como lista de tics. ⚠️ **NO se usó
    `.service-flow`**: ese bloque necesita **SEIS fotos por servicio** y sólo
    Werkschutz las tiene. Los drafts piden literalmente "H2 + Häkchenliste".
    `.service-scope__tick` ya estaba estilado desde el 2026-08-03 y llevaba dos
    semanas sin markup que estilar.
  - **`.service-konzept__steps--4 / --5`** — el riel está cableado a `repeat(3)`.
    ⚠️ **No wrappean a dos filas a propósito**: el conector se dibuja como segmento
    HORIZONTAL de un nodo al siguiente calculando "mi borde derecho + el gap + media
    columna", y al saltar de fila el último paso de la fila 1 dibujaría un segmento
    hacia la nada. Cada conteo tiene UN breakpoint donde entra en una línea, y
    debajo usa el riel vertical del layout móvil.
  - **`.service-price__box--text`** — tres servicios **no se cobran por hora** y su
    draft lo dice. La caja está construida para "26-32" con `white-space: nowrap` a
    60px: "Bereitschaft + Einsatz" se salía **51px** de la card a 1440 (medido).
    Esos tres además **no emiten `offers`** en su JSON-LD — un precio en el schema
    que la página deliberadamente no afirma sería una afirmación inventada.
- **`partials/price-box.html` se parametrizó** (tics, CTA, unidad, label,
  modificador) con defaults en `content/values.json` — misma mecánica y misma razón
  que `nameRequired`: un parámetro de include es una clave plana y no puede pisar
  una anidada. **Las 11 páginas que ya la incluían no cambiaron una línea**,
  verificado. Existe porque cada Webtext especifica sus propias líneas de caja, y
  porque `/brandwache/` pide ahí el CTA de **teléfono**.
- ⚠️ **`/brandwache/` INVIERTE LOS CTA, y es la única página del sitio que puede.**
  Es la instrucción del propio draft ("CTA primär: Jetzt anrufen") y la excepción
  aprobada a G2 — correcto para el único servicio al que se llega en medio de un
  incidente. **No normalizarla contra las otras ocho.**
- ⚠️ **El retrato de Alexander Jäger va en las 4 páginas cuyo Trust lo NOMBRA**
  (Objektschutz, Sicherheitstechnik, Brandwache, Baustellenbewachung); las otras 5
  llevan la franja `.trust-certs` sin retrato. Es la **Q2 del cliente aplicada tal
  cual** ("stays on every page where the documents specify it"), no un olvido —
  meterle un contacto nombrado a una página cuyo documento no lo pide es inventar
  una persona en la página. ⚠️ Sólo el draft de Objektschutz repite su teléfono y
  su mail; en los otros tres se incluyen igual (son datos reales ya publicados en
  `/werkschutz/` y en `values.json`) porque un bloque de contacto sin forma de
  contactar es peor. **Vale confirmarlo con Chris.**
- ⚠️⚠️ **CONTRADICCIÓN DE PRECIO DENTRO DEL PROPIO DRAFT, en 3 de los 9.** El
  párrafo de Kosten de Veranstaltungsschutz y Empfangsdienst dice **"zwischen 25 und
  38 Euro"** y el de Baustellenbewachung **"zwischen 25 und 35"**, mientras **la
  Preis-Box y la FAQ del MISMO documento dicen 26–32**. Se publicó **26–32 en los
  tres**: es el valor que dicen dos de las tres apariciones y además es el token
  sitewide de G10, y publicar una página que se contradice a sí misma sobre el
  precio es peor que cualquiera de las dos lecturas. **Confirmar con Chris.**
- ⚠️⚠️ **LAS FOTOS DE 4 DE LAS 9 NO MUESTRAN LO QUE PIDE SU DRAFT, y los `alt`
  salieron mal la primera vez porque los escribí del BRIEF y no del archivo.**
  Encontrado mirando las nueve en una hoja de contactos — **tercera vez en este
  proyecto que un asset no coincide con lo que su nombre o su brief sugería**
  (`Bayernwerk.png` era Stadt Coburg, `FemalePointing.png` era otra card).
  · objektschutz: el draft pide un Kontrollgang, el archivo es una **sala de
  monitoreo** · sicherheitstechnik: pide Leitstand, es **una cámara en fachada** ·
  brandwache: pide una brandwache con extintor, es **un briefing del equipo** ·
  kaufhausdetektei: pide superficie de venta discreta, es **un agente de traje en
  una entrada**. Los `alt` describen el archivo. **Vale pedirle a Chris al menos
  las dos últimas.** Regla, otra vez: **mapear por la imagen, nunca por el nombre
  ni por el brief.**
- ✅ **DOS DEFECTOS REALES DE 320px, encontrados midiendo:**
  1. **58px de scroll horizontal en `/revier-schliessdienst/`** —
     `.service-panel__cta`. Es la **QUINTA** vez que la misma omisión causa el mismo
     bug acá: `.btn` es `white-space: nowrap`, y **`width: 100%` solo nunca alcanza**
     porque un ancho no reduce el min-content. Hace falta `white-space: normal`.
  2. **El H1 se RECORTABA** en Brandwache, Baustellenbewachung y Empfangsdienst:
     base.css pone `hyphens: none` en headings y `overflow-wrap: break-word` **no
     reduce el min-content**, así que "Brandsicherheitswache" (21 caracteres) fijaba
     un track de ~340px en un viewport de 320. ⚠️ **La página NO scrolleaba de
     costado — clipeaba, que es peor**: `hScroll: 0` puede significar "está bien" o
     "algo está cortando texto", y sólo la lista de cajas fuera del viewport
     distingue las dos. `hyphens: auto` sólo abajo de 400px, que con `lang="de"`
     corta por sílabas reales.
- ✅ **DOS FALLOS DE CONTRASTE QUE NUNCA SE HABÍAN EJERCITADO.**
  `.service-compare` está documentado como "either surface" y sus overrides claros
  existen desde el 2026-08-03, pero **ninguna página lo había puesto sobre blanco**
  hasta `/revier-schliessdienst/`: ahí los términos daban **3,17:1 a 11px** y el
  label del panel primario **3,71:1 a 12px**, los dos texto chico con piso de
  4,5:1. Arreglados con los mismos valores que la lista de factores de precio ya
  usa una sección más allá. **Lección: "either surface" significa "las reglas
  existen", no "alguien lo vio".**
- **Medido a 320 / 390 / 768 / 1024 / 1440 / 1920 en las 9** (54 corridas):
  **sin scroll horizontal en ninguna**, nada fuera del viewport, un solo `<h1>`,
  sin saltos de nivel, **cero fallos de contraste** fuera del caveat sitewide del
  azul del CTA (3,11:1), y **FAQ visible ↔ `FAQPage` 46/46 byte-idénticas**.
  El markup servido —que ES lo que recibe un crawler que no ejecuta JS— trae
  **6.205–10.647 caracteres** de texto real en `<main>`, 28–43 headings, **0 tiles
  y 0 elementos ocultos**. **Re-medidas las 9 páginas que comparten el chasis**
  (`/werkschutz/`, `/referenzen/`, `/jobs/`, `/sicherheitskonzept/`, ciudad, combo,
  `/leistungen/`, `/angebot/`, homepage) a 390 y 1440: **sin regresiones**.
- ⚠️ **Nota de medición, útil y nueva:** para capturar una sección de estas páginas,
  el iframe tiene que quedarse en **altura de viewport normal** y scrollearse por
  dentro — una altura enorme infla cada caja de `100svh`. Y el scroll nativo
  funciona **sólo porque `--force-prefers-reduced-motion` hace que
  `smooth-scroll.js` salga temprano** y Lenis nunca tome el scroll. Con motion
  prendido no hay forma de asentar la posición bajo `--virtual-time-budget`.
- ⚠️ **PENDIENTE, encontrado midiendo y NO arreglado en las páginas viejas:
  `.service-link` mide 29px de alto** contra el mínimo táctil de 44. Se arregló
  **scopeado** a los bloques nuevos; `/werkschutz/`, `/referenzen/`, `/jobs/` y las
  3 case studies siguen con 29px. Promoverlo al selector compartido es lo correcto
  y es una línea, pero mueve el layout de seis páginas ya revisadas por el cliente
  — merece su propia pasada, medida en esas seis.
- ⚠️ **4 links a combos que todavía no existen** (`/objektschutz-nuernberg/`,
  `/brandwache-wuerzburg/`, `/brandwache-erlangen/`, `/brandwache-fuerth/`). Son
  las URLs confirmadas de la guía §2.2 — la misma convención que ya siguen
  `/werkschutz/` y las ciudades. Bloque 6.

**2026-08-16 — LAS 9 CIUDADES QUE FALTABAN ESTÁN CONSTRUIDAS. Con eso el Bloque 5
está completo y no queda un solo link de ciudad roto en el sitio** (cliente: "llegó
el momento de hacer todas las páginas de las ciudades, las que faltan hacer").
Würzburg · Bamberg · Erlangen · Fürth · Bayreuth · Schweinfurt · Coburg ·
Forchheim · Ansbach, de los Webtexte 14–22 (Stand 04.08.2026), verbatim, alemán.
La plantilla actualizada está en
[docs/page-conventions.md §10.5](docs/page-conventions.md); acá va lo que no se
deduce de ahí.

- ⚠️⚠️ **"COPIAR NÜRNBERG Y CAMBIAR EL COPY" ERA LA MITAD DE LA VERDAD, y era la
  instrucción que este archivo y §10.5 daban.** Los nueve drafts traen **su propia
  estructura a propósito** — lo dicen ellos mismos, "Struktur bewusst variiert ggü.
  Nürnberg". Würzburg entra por los Einsatzfelder y argumenta el Warum después;
  **Erlangen no tiene sección Warum** y suma una de Veranstaltungen; Schweinfurt es
  Werkschutz-first; **Coburg cambia la sección de Brandwache por una de
  Sicherheitskonzept**; Ansbach tiene el Warum en prosa, sin tarjetas; Fürth,
  Forchheim y Ansbach son variantes compactas. **8 a 11 secciones por página.**
- ⚠️ **CONSECUENCIA QUE NO ES OBVIA: LA LISTA DE SEAMS NO SE PUEDE COPIAR.** Los
  tiles son del color de la sección de ARRIBA, y dos secciones del mismo color no
  llevan seam (§9.2) — con otro orden cambia entera. Las diez páginas van de **5 a
  11 seams**. Se **deriva** de la secuencia de superficies, no se escribe.
- **Por eso se generaron con un script**, `docs/design-sources/city-pages.py` +
  `city_pages_data.py`, de **una sola pasada y en desarrollo**, como
  `city-outline.py` y `franken-map.py`. No corre en `npm run build`. Existe por las
  dos cosas que se rompen a mano y **no se ven en una captura**: la paridad
  FAQ ↔ JSON-LD (**50 pares**) y el color de cada seam. Después son páginas
  normales, editables a mano; **no re-correrlo sobre una página ya editada.**
- ⚠️⚠️ **BUG REAL, ENCONTRADO MIDIENDO: `.city-callout__lede` SALÍA BLANCO SOBRE
  BLANCO, ratio 1:1**, en las tres páginas que ponen un callout de PROSA sobre
  sección clara (Bamberg, Erlangen, Ansbach). El color estaba cableado en blanco
  porque en Nürnberg ese bloque es siempre la sección de Brandwache, que es siempre
  oscura. Es el mismo modo de falla que este archivo ya documenta tres veces
  (`.ag-hero__alt`, los tics de la caja de precio, `.testimonial` sobre oscuro):
  **un bloque que cablea un color deja de funcionar cuando su superficie cambia.**
  - ⚠️ **Y MI PRIMER ARREGLO NO HIZO ABSOLUTAMENTE NADA.** Escribí
    `.section--light .city-callout .city-callout__lede` — pero **las dos clases
    están en el MISMO elemento** (`<section class="section section--light
    city-callout">`), así que el descendiente no matchea nunca. La regla se
    compiló, apareció en el CSS de `dist/`, y el párrafo siguió midiendo 1:1.
    Va `.city-callout.section--light`. **Un selector que no puede matchear falla
    igual que uno ausente**, y por eso esto se detecta midiendo el color
    RENDERIZADO y no leyendo la hoja ni grepeando el build.
- **2026-08-16, mismo día — EL HEADER DE LA SECCIÓN DE ZERTIFIZIERUNGEN VA
  CENTRADO** (cliente, sobre Erlangen: "esto centralo"). **Sólo afecta a Würzburg
  y Erlangen**, y la razón es estructural: son las dos únicas ciudades **sin
  sección de Vertrauen**, así que su copy de Trust es el H2 + lede de ESTA
  sección. En Nürnberg y Bamberg ese bloque no lleva header propio — lo encabeza
  el H2 de Vertrauen dos secciones arriba — así que no tienen nada que centrar.
  - **Lo que se veía**: un H2 y un párrafo rangeados a la izquierda sobre un
    `.trust-certs` que **ya se centra solo**. O sea el header y su propio
    contenido tiraban para lados distintos.
  - Es además el default de este tipo de página: Vertrauen, Brandwache,
    Erreichbarkeit, Umgebung, Warum, Leistungen y el FAQ ya van centrados (§10.4).
  - ⚠️ **SEXTA VEZ DE LA MISMA TRAMPA DE ESPECIFICIDAD, y hacen falta las tres
    partes**: el chasis pone `.section__intro > p { max-width: 42rem }` a (0,1,1),
    así que `text-align: center` solo centra el TEXTO dentro de una caja de 672px
    que sigue pegada a la izquierda — título centrado sobre párrafo a la
    izquierda, que es peor que no centrar. Van **selector de dos clases** +
    **`margin-inline: auto`** en el `<p>`, más un cap en `ch` (no en px) en el H2,
    porque es la misma frase con otro nombre de ciudad.
  - **Medido con un `Range` sobre los nodos de texto reales, no con el rect del
    elemento** (que acá miente, justo porque la caja está capada a 42rem): H2 y
    lede a **0px del eje** a 390 / 768 / 1024 / 1440 / 1920 en las dos páginas.
    Re-medido todo después: sin scroll horizontal, contraste sin fallos, y las
    otras ocho páginas sin un solo cambio de alto.
- **`css/page-city.css` SÍ se tocó, cuatro veces**, contra lo que decía §10.5:
  1. el arreglo de contraste de arriba;
  2. **`.city-why__grid--3`** — cinco de los nueve drafts dan **tres** tarjetas de
     Warum y la grilla es `repeat(4, …)`, o sea dejaban la cuarta columna vacía. Es
     el mismo hueco que `--wide` cierra para un quinto Einsatzfeld impar. Necesita
     **dos bandas**: 3 columnas desde 1100 y el tercer item abarcando las dos
     columnas entre 640 y 1099. **Nürnberg no se movió**, medido antes y después;
  3. **dos áreas táctiles**: `.city-fields__link` (**29px, y ya fallaba en
     Nürnberg** — el comentario de esa regla describía dos links y el selector sólo
     alcanzaba a uno) y el link inline del Abbinder de Erreichbarkeit (23px, nuevo
     acá, en Würzburg/Erlangen/Schweinfurt). ⚠️ Los **dos** links de membresía de
     Bamberg quedan sin padear **a propósito**: dos links en una frase son la
     excepción de line-height de WCAG 2.5.8, igual que ya shipean `/referenzen/` y
     `/ueber-uns/`. Uno solo sí se padea.
- ⚠️ **BAMBERG ES LA EXCEPCIÓN Y SU PÁGINA INVIERTE LA REGLA QUE GOBIERNA LAS OTRAS
  NUEVE.** Es el único sitio con dirección real, así que el badge nombra el Sitz
  ("Unser Zuhause: Sitz in Bamberg, Neuerbstraße 19") y **el primer FAQ da la
  calle** — que en cualquier otra ciudad sería exactamente la afirmación que la
  regla UWG prohíbe. Además es la única que puede listar **10 servicios**: Revier- &
  Schließdienst e Interventionsdienst son Raum-Bamberg (lo dice el FAQ de
  `/einsatzgebiete/`). **No copiar esa lista a otra ciudad.** Prioridad 0.9 en el
  sitemap; las otras nueve 0.8.
- **Cards de servicio SÓLO donde el destino es una página de ciudad.** Sólo
  Würzburg, Erlangen y Fürth tienen combos en esta fase, así que sólo ellas llevan
  el grupo de 4 cards + 4 filas. Las otras seis van **todas como filas**: destacar
  cuatro genéricas como cards prometería una página local que no existe, que es la
  misma afirmación implícita que §10.1 existe para evitar.
- ⚠️ **LAS TARIFAS SON LAS DE CADA DRAFT, Y NO SIEMPRE SON CUATRO** — dos en
  Schweinfurt y Forchheim, tres en Fürth, Bayreuth, Coburg y Ansbach, cuatro en
  Würzburg, Bamberg y Erlangen. **Salieron las cuatro en todas al principio**, o sea
  servicios en una tabla de precios que el cliente no tarifó ahí. Lo encontró el
  diff automático página↔docx, no la vista.
- **Los links de los Einsatzfelder van SÓLO donde el draft pone un "→ /url/".**
  Nürnberg los infirió del copy y esa inferencia **tuvo que corregirse** después
  (enlazaba Revier- & Schließdienst, un servicio Raum-Bamberg, desde Nürnberg).
  Seguir el draft literal no necesita confirmación de nadie.
- ⚠️ **`icon-lock` e `icon-tie-person` NO son símbolos del sprite** — son archivos
  `<img>` en `assets/icons/` (iconos de Figma del cliente con fill fijo). Se
  eligieron primero por nombre y no habrían renderizado. **Grepear el sprite antes
  de usar un id**, no deducirlo.
- **Medido a 320 / 390 / 768 / 1024 / 1440 / 1920 en las 10 páginas** (60 corridas):
  **sin scroll horizontal en ninguna**, **cero fallos de contraste** fuera del
  caveat sitewide del azul del CTA (3,11:1), un solo `<h1>`, sin saltos de nivel,
  nada fuera del viewport, y **FAQ visible ↔ `FAQPage` 50/50 byte-idénticas**.
  Sin JS el markup servido trae **5.114–11.156 caracteres** de texto real en
  `<main>`, **0 tiles y 0 elementos ocultos**; con `prefers-reduced-motion`, 0
  tiles y 0 elementos en opacidad <1. Capturas revisadas del hero, del callout
  claro arreglado, de la grilla de 3 tarjetas, de la lista de 8 filas y de teléfono.
- ⚠️ **TRAMPA DE ENTORNO NUEVA Y CARA: `--dump-dom` NO SIRVE PARA PROBAR SIN JS.**
  `--disable-javascript` **se ignora en `--headless=new`** (medí 1.980 tiles, o sea
  el JS había corrido), y con `--blink-settings=scriptEnabled=false` el dump sale
  **vacío**, porque `--dump-dom` evalúa JS para serializar el DOM. El contrato se
  verifica de otras dos formas: leyendo el **markup servido** (que ES lo que recibe
  un crawler que no ejecuta) y renderizando con `prefers-reduced-motion`.
- ⚠️ **Y dos más del mismo entorno:** `python3 -m http.server` **no arranca en esta
  máquina** — el hostname tiene un byte que no es UTF-8 y `socket.getfqdn` explota;
  hay que servir con Node. Y Chrome **escribe el DOM y no termina**, así que hay que
  volcar a archivo, esperar y matarlo (`timeout` no existe en macOS). Las dos ya
  estaban documentadas en parte; la del hostname es nueva.
- ⚠️ **Para confirmar con Chris** — todo lo demás es verbatim: el H2 y el lede de
  **Umgebung** en las 7 ciudades cuyo draft sólo lista "Nachbarorte: X · Y" (el H2
  usa el patrón del propio draft de Bamberg, el lede es el de Nürnberg con los
  nombres cambiados); el **"(Widget)"** que se sacó de la frase de Trust de Würzburg
  (es una instrucción de producción, no copy — el widget está en el hero); los **3
  módulos de Brandwache de Bamberg**, que parten UNA frase del draft en sus tres
  mitades como ya hace Nürnberg; y los **lede de la sección de Leistungen**, que son
  de este build porque el draft da los servicios pero no una frase de entrada.

**2026-08-16 — LA BANDA NEGRA DE `/ratgeber/` ERA UNA COLISIÓN DE NOMBRES DE CLASE,
y de paso se llevó tres hairlines de más** (cliente: "esta línea negra sacala y hacé
esta sección centrada"). Una línea de markup y una regla de CSS.

- ⚠️⚠️ **`.rg-list` EXISTÍA DOS VECES PARA DOS COSAS DISTINTAS, EN LA MISMA HOJA:** el
  `<ul>` de prosa de los artículos (`brandwache-…`, `kosten-…`) y —por accidente— la
  `<section>` del hub. Las 4 reglas de `page-ratgeber.css` están escritas para el
  `<ul>`, así que la sección se comía `padding: 0`, `margin: 24px 0 16px`,
  `display: grid` y `list-style: none` sin que nadie lo hubiera pedido.
- **El margen es lo que se veía.** Un margen va POR FUERA del fondo, así que en una
  sección blanca sobre página negra son **16px de banda negra a todo el ancho** debajo
  de las cards (y 24 arriba, que el seam tapaba). Medido antes: sección 560→1300 con
  el seam siguiente en 1316. **Es el mismo modo de falla que la banda de
  margin-collapse de `/referenzen/`** (2026-08-03): sobre superficie clara y página
  oscura, **cualquier margen vertical suelto es una raya negra**.
- ✅ **GANANCIA LATERAL QUE NO SE BUSCÓ: `.rg-list li { border-top }` le estaba
  dibujando una hairline a cada card.** Son las tres líneas grises que se ven sobre
  las cards en la captura del cliente, más ancho que la card porque el borde es del
  `<li>` y no de la card. Medido: **3 bordes parásitos → 0**, y el `padding-block` de
  16px del `<li>` de prosa también se fue.
- **Se RENOMBRÓ (`.rg-list` → `.rg-articles`), no se sobreescribió**, y esa es la
  decisión: un override habría dejado la colisión viva para la próxima regla que
  agregue cualquiera de los dos lados. No hizo falta mover ni una regla — las cards
  siempre fueron `.rg-cards`, así que **nada apuntaba a la sección**. La lista de
  prosa se queda con el nombre que sí la describe.
- **El centrado necesitó UNA declaración, no dos**, y conviene decir por qué no
  aplica la trampa que este archivo documenta cinco veces: ese `.section__intro`
  tiene H2 y **no** lede, y `page-service.css` ya le da `max-width: none`, así que la
  caja es de ancho completo y no hay ninguna caja capada que centrar con
  `margin-inline: auto`. **Medido con un `Range` sobre el nodo de texto real: 0px de
  desvío del eje.**
- **Verificado después**: márgenes de la sección en **0**, `padding-bottom` de vuelta
  al 96px del chasis, `display: block`, gap al seam **0**, sin scroll horizontal a
  1440 ni 390. Y **los dos artículos conservan su lista intacta** (borde 1px, padding
  16px, márgenes 24/16, `list-style: none`) — que era el riesgo real de renombrar.

**2026-08-16 — TANDA 3.10–3.14: LO QUE SE PODÍA HACER SIN MATERIAL NUEVO.** Auditados
los cinco bloques del feedback contra el código; **la mayor parte ya estaba** (el CTA
secundario G1 en las 7 páginas, G3 en las 3 case studies, el `tel:` de la FAQ de
brandwache, y los H1 de las case studies ya rompen en 3 líneas a 1440 y 1024). Esto es
lo que faltaba y no dependía de nadie.

- **`26-32` → `26 bis 32` en `/ratgeber/brandwache…/`**, y **NO escrito a mano**:
  `{{price.range}}` → **`{{price.min}} bis {{price.max}}`**. G10 prohíbe re-tipear un
  precio en una página, y min/max existen exactamente para esto — `range` une el par
  con guion para la píldora de precio, la prosa alemana necesita las dos mitades
  sueltas. Verificado antes de tocar: **una sola aparición y no está en el JSON-LD**,
  así que no hay copia de FAQ que se pueda desincronizar.
- **`/referenzen/case-study-sicherheitstechnik/` gana el link "Weiterführend" a
  `/sicherheitskonzept/`.** Era **la única de las tres** que no lo tenía; la etiqueta se
  copió verbatim de las otras dos en vez de inventarla, así que las tres cierran igual.
- **EL HERO DEL HUB `/ratgeber/` REDISEÑADO: dos columnas + trust band + un dibujo.**
  Era H1 + lede en una columna centrada de 44rem sobre negro — medido, 399px y el hero
  más plano del sitio.
  - ⚠️ **TODO va scopeado a `.rg-hero--hub`, y eso es load-bearing, no prolijidad:**
    las reglas de `.rg-hero` son COMPARTIDAS con los 3 heroes de artículo, cuyo tope de
    44rem está deliberadamente atado a la medida de `.rg-article` para que el H1 y el
    cuerpo compartan UNA línea izquierda a lo largo de la página. Ensanchar `.rg-hero`
    habría roto esa alineación en tres páginas para arreglar una.
  - **El visual es un DIBUJO inline, no una foto, y por eso el hero queda terminado
    hoy**: releyendo el documento, las title images de 3.10.2 son para **las CARDS** y
    para los heroes de ARTÍCULO (3.11) — al hub nunca se le prometió una. Es la
    gramática exacta de `partials/sk-doc.html` (hojas abanicadas translúcidas, hoja
    blanca, marcas azules, esqueleto de texto en el slate del sitio, chip azul), con
    **los valores copiados y no re-derivados**, así el sitio tiene UNA forma de dibujar
    un documento y no dos parecidas. **Tres filas porque el hub lista tres artículos.**
  - ⚠️ **SIN BADGE, y es deliberado:** G9 dice que el badge lo define el DOCUMENTO, y
    **ninguno de los 4 Webtexte del Ratgeber declara uno** (los cuatro chequeados, no
    asumido). Un chip acá sería copy inventado.
  - ⚠️ **SIN par de CTA en el hero:** G2 gobierna el ORDEN del par donde un hero lo
    tiene, no obliga a que todo hero tenga uno. La acción de esta página es "hacenos tu
    pregunta" y ya vive en el cierre (`Ihre Frage ist nicht dabei?` → `/kontakt/` +
    teléfono); un CTA de presupuesto arriba de tres artículos compite con lo único que
    esta página existe para hacer.
  - **La trust band sí entra**, mismo precedente que `/ueber-uns/`: la pregunta que un
    Ratgeber tiene que contestar es si el consejo es creíble, que es lo mismo que dicen
    las bylines "geprüft von Steffen Walde" de los artículos.
  - ⚠️ **Bug propio encontrado midiendo:** le puse `margin-top` al dibujo y **la grilla
    del hero ya trae `row-gap: 64px`**, así que se sumaban a **112px de negro vacío**
    entre la trust band y el dibujo en teléfono. Borrado: el gap de la grilla es lo
    único que separa esas dos filas.
  - **Medido a 320 / 390 / 768 / 1024 / 1440**: sin scroll horizontal, dos columnas
    desde 1024 (668/494 a 1440), dibujo 416x462 a 1440 y 240x267 a 390, los 2 sellos
    cargados, hero 622px a 1440.
- ✅ **LOS 4 LINKS DE BRANDWACHE — APLICADOS EL 2026-08-17.** Quedaron escritos y no
  aplicados en su momento, cada uno con su comentario 🔴 en el punto exacto del
  markup, porque `/brandwache/`, `/veranstaltungsschutz/` y `/baustellenbewachung/`
  **eran 404** y uno de los cuatro es el **CTA primario de conversión** de la página —
  la misma decisión que ya se había tomado con las case studies mientras
  `/sicherheitskonzept/` no existía. **Esas tres páginas salieron el 2026-08-16 con las
  nueve de servicio, así que la condición que la pasada anterior había puesto ("once
  their target pages are available") se cumplió** — y nadie volvió a aplicarlos hasta
  que el cliente lo preguntó. Los cuatro, en
  `pages/ratgeber/brandwache-wann-vorgeschrieben.html`:
  1. Fall 3 → link directo a `/veranstaltungsschutz/` (el del hub `/leistungen/` se
     queda: era la ruta interina Y carga la mitad "und die übrigen Leistungen").
  2. Tercer bullet de "Weitere Fälle" → `/baustellenbewachung/`.
  3. `.rg-source` de Kosten: "Konkretes Angebot" pasa de `/angebot/` a `/brandwache/`,
     que es lo que finalmente hace que el artículo ALIMENTE su página de servicio.
  4. El CTA de cierre "Brandwache anfragen" pasa a `/brandwache/`.
  - **Verificado 200 en los tres destinos ANTES de editar**, no asumido, y los 4
    comentarios 🔴 se reemplazaron por notas de aplicado que conservan el por qué
    esperaron. `🔴 PENDING` restantes en el archivo: **0**. Los **31 links** de la
    página resuelven.
  - ⚠️ **Los 3 links inline nuevos miden 23px de alto y ESO ESTÁ BIEN**: es la
    excepción explícita de WCAG 2.5.8 para un target limitado por el line-height de
    una frase, y **son idénticos a los 2 links inline que la página ya tenía** (23px,
    sin padding, `display: inline`) — o sea el tratamiento que el cliente ya revisó,
    sin regresión. Contraste **4,88:1** (`#4673AB`, la mezcla profunda) calculado a
    mano, porque `color-mix()` computa como `color(srgb …)` y la sonda genérica lo
    saltea. El único link padeado de la página sigue siendo el teléfono (12px/12px,
    `inline-block`, 57px — la regla G4).
  - ⚠️ **TRAMPA DE MEDICIÓN NUEVA, y casi me hace inventar una inconsistencia:**
    `getBoundingClientRect().height` sobre un link inline que ENVUELVE devuelve la
    UNIÓN de sus cajas de línea. "alle Sicherheitsdienstleistungen im Überblick" medía
    **56px** y parecía un target padeado al lado de mis 23px sin padding, en el mismo
    párrafo — son **3 cajas de 23px** y padding 0. **Para un inline hay que leer
    `getClientRects()` caja por caja, no el rect del elemento.**
  - ⚠️ **PARA CHRIS, dos cosas anotadas en el markup y no decididas unilateralmente:**
    el punto 1 deja la palabra "Veranstaltungsschutz" dos veces en una línea corta (una
    como texto, una dentro del anchor nuevo) — la versión ajustada es enlazar la palabra
    que ya estaba, pero eso cambia el anchor text que la nota de 3.11 especificó; y el
    punto 3 deja una tensión con G3 ("el destino lo fija la ETIQUETA"): el anchor
    promete una acción de formulario ("kostenfreie Begehung anfordern") y aterriza en
    una página de SERVICIO. Es defendible — `/brandwache/` tiene su propio CTA de
    begehung y su propio `#anfrage` — pero si querés paridad estricta, la etiqueta pasa
    a "Alles zur Brandwache" y el formulario vuelve a `/angebot/`.
  - ✅ **`/sicherheitstechnik/`, que este archivo marcaba como 404 en el mismo párrafo,
    también existe desde el 2026-08-16**, así que el link del "Weiterführend" de esa
    case study tampoco está roto. Medido: **cero links internos rotos dentro de `<main>`
    en las 54 páginas.**
- **Barrido final**: 7 páginas × 4 anchos, sin scroll horizontal, un solo `<h1>`, cero
  imágenes rotas, cero tokens sin resolver.

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
**Bold (700)** for headings, no longer backed by a self-hosted file.
⚠️ **`--font-weight-bold` was 800 until 2026-08-14 and that was a real
rendering bug, not just an unreachable ideal.** The CI spec says "Extra Bold
800", which was honest while the site was set in self-hosted Open Sans (a
variable font with a genuine 800). This stack has no 800 at normal width:
HelveticaNeue.ttc tops out at Bold 700, and its ONLY faces ≥800 are
*Condensed Bold* and *Condensed Black (900)* — both condensed. So a request
for 800 has no normal-width face to match: Chrome clamps to 700, WebKit
substitutes **Helvetica Neue Condensed Black**, and the client saw exactly
that ("one section headline appears to use a different font"). 700 is a real
face in every fallback, so it now renders identically everywhere — and it is
still "bold" for WCAG's large-text threshold, which several contrast
decisions depend on (see `.service-related__title`). Real Helvetica can't legally be
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
