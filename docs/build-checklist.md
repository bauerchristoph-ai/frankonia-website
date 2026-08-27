# FRANKONIA — Checklist

Lista única de qué está hecho y qué falta. El detalle de por qué está en
[roadmap.md](roadmap.md).

**Regla:** cuando termines algo, marcalo acá en el mismo commit que el cambio.
Ya pasó dos veces que las notas del proyecto decían algo distinto del código.

`[x]` hecho · `[~]` en curso · `[ ]` falta · 🔴 depende del cliente

---

## Dónde estamos

La homepage está lista en desktop y mobile. Falta verla en un teléfono de
verdad (todo se probó con un navegador automatizado, no con la mano).

**2026-08-17 — LAS 52 PÁGINAS ESTÁN CONSTRUIDAS.** `npm run build` compila **54**
(las 52 del set de copy más `/impressum/` y `/datenschutz/`). Con las 15 combos de
hoy se cerró el último bloque, y **no queda un solo link interno roto dentro de
`<main>` en todo el sitio** — verificado sobre el build entero, cero 404.

Lo que sigue abierto no es "construir páginas": es Jobs esperando la lista real de
vacantes para poder emitir `JobPosting`, `/datenschutz/` esperando su texto legal
(por eso lleva `noindex` y no está en el sitemap), el formulario que todavía no
envía a ningún lado (Paso 4), las fotos que faltan, y el feedback del cliente
página por página.

**El total pasó de 49 a 52 páginas el 2026-08-05**: el copy v2
(`NewVersionCopiesFrankonia/`) agrega los Webtexte 50–52, las tres case studies
anonimizadas. Ya están construidas, así que el `[ERGÄNZEN]` que Referenzen
arrastraba desde el 2026-08-03 **está cerrado**.


**2026-08-27, SÉPTIMA RONDA — LA TARJETA VAN WEY SECURITY SE ELIMINA, LA „-2" SALE DE
DOS URLS DE PERSONA, NUEVE REDIRECTS. Y EL GENERADOR ESTABA MÁS DESACTUALIZADO QUE LAS
PÁGINAS** (cliente, sobre la lista de personas del protocolo). Toca
`docs/design-sources/person-pages.js`, `docs/design-sources/redirect-test.js`,
`vercel.json`, tres páginas y tres vCards.

- **Lo que cambia:** `/bryan-van-wey-security/` se elimina y redirige a
  `/bryan-van-wey-werkschutz/`; `/christoph-bauer-sicherheitsdienst-2/` →
  `/christoph-bauer-sicherheitsdienst/`; `/morelo-werkschutz-team-2/` →
  `/morelo-werkschutz-team/`. **Nueve redirects 301**: dos por dirección (con y sin
  barra final, porque `trailingSlash` se aplica DESPUÉS de evaluar los redirects) y uno
  por cada ruta de vCard — el botón „Kontakt speichern" entrega esa URL, así que puede
  estar en un historial o en un mensaje reenviado.
  ⚠️ La „-2" venía de WordPress, que agrega un número a un slug ocupado; en la web no
  significaba nada. Pero está en tarjetas impresas, de ahí el redirect y no el apagado.

- ⚠️⚠️ **LA TARJETA VAN WEY SECURITY NO ERA UNA COPIA, y eso es lo que hay que saber:**
  su e-mail estaba en **`frankonia-security.de`**, una TERCERA marca junto a
  `-sicherheit.de` y `-werkschutz.de`, y su vCard decía **„FRANKONIA Security GmbH & Co.
  KG"** — la única aparición de esa razón social en todo el proyecto; en el Impressum no
  figura. Ya estaba anotado en el generador desde el 26.08.
  **Consecuencia, dicha explícitamente:** quien escanee el QR viejo recibe ahora la
  tarjeta de Werkschutz con `b.vanwey@frankonia-werkschutz.de`.
  ⚠️ **La vCard se borró también**: `build.js` copia `assets/` completo, así que una
  vCard huérfana seguiría siendo descargable — con la razón social que debía
  desaparecer. Su ruta vieja redirige a la de Werkschutz.

- ⚠️⚠️ **EL GENERADOR HABRÍA BORRADO TRABAJO EN SILENCIO.** Las páginas de persona salen
  de `person-pages.js`, y el generador NO tenía tres cosas que las páginas sí:
  `gtm-noscript`, `person-trust` (la banda de ayer) y el „Jobs" del linktree (de esta
  mañana). **Un solo `node person-pages.js` habría quitado la banda de confianza y el
  noscript de GTM de once páginas, sin un mensaje de error.**
  Por eso: primero sincronizar, después cambiar, después diffear.
  ✅ **Verificado corriendo el generador a un directorio temporal:** las ocho páginas de
  persona existentes más `/linktree/` y `/sicherheitscheck-walde/` salen **byte a byte
  idénticas**; los dos slugs nuevos son la única diferencia. Antes eran 3 líneas de
  divergencia por página.
  ⚠️ **Una línea en blanco costó una iteración, y no es un detalle:** el primer intento
  producía un salto extra antes de `</main>` porque `FOOT` empieza con un `\n` y la línea
  del include terminaba con otro. La identidad byte a byte es el único criterio con el que
  se puede comparar un generador contra su salida — con „se ve igual" la divergencia pasa
  y el próximo diff ya no vale nada.
  ⚠️ **La entrada eliminada queda como NOTA en el generador**, no sólo en git: lo que se
  pierde con esa tarjeta (tercera marca, razón social, vCard) no es obvio, y el próximo
  no debería tener que reconstruirlo de un diff.

- ✅ **`node docs/design-sources/redirect-test.js`: 0 problemas.** Las tres direcciones
  entraron en la tabla de valores esperados: cada una toca exactamente una regla, su
  destino existe en el build, y **ningún destino es a su vez origen** (comprobación de
  cadenas). De las 41 direcciones del sitio viejo, **ninguna queda huérfana**.
  ⚠️ La nota del inventario decía „SEIS siguen como página real" y quedó falsa — corregida
  a TRES/CINCO/DOS. Un número en un comentario que nadie actualiza es la fuente del
  próximo error.

- **Medido:** **69 páginas** en lugar de 70, los tres directorios viejos fuera, los dos
  nuevos dentro, **0 referencias** a las rutas viejas en las 69 páginas, las dos vCards
  renombradas presentes, la banda de confianza en **8** páginas de persona (antes nueve,
  una se fue), **64/64 tests**. Captura de una de las renombradas revisada.
  ⚠️ **Los redirects están comprobados estáticamente, no en vivo:** `npm run dev` no lee
  `vercel.json`. En local las tres direcciones viejas dan 404 — **es lo esperado**. Tras
  el deploy, `node docs/design-sources/redirect-test.js https://…`.

- ⚠️ **Sitemap sin tocar:** las páginas de persona no están ahí y no deben estarlo — son
  `noindex,follow` porque son delgadas y personales, e indexadas competirían con las
  páginas de servicio reales.

**2026-08-26/27, SEXTA RONDA — LA ROLE „(Potenzieller) Kunde" SE ESCRIBE, EL OBJETO
EMPRESA SE APAGA, EL CAMPO DE MENSAJE PIDE LAS CUATRO COSAS QUE HACEN FALTA PARA
COTIZAR, Y „Karriere" VUELVE A LLAMARSE „Jobs"** (cliente, cuatro instrucciones tras
mirar el contacto de prueba). Toca `api/_lib/hubspot.js`, `scripts/setup-hubspot.mjs`,
`partials/lead-form.html`, `css/lead-form.css`, los dos partials de chrome,
`pages/jobs.html`, `pages/linktree.html` y los tests.

- ⚠️⚠️ **`bewerber_oder_kunde_` = „(Potenzieller) Kunde", Y LA CAUSA QUE EL CLIENTE
  SUPONÍA NO ERA LA REAL.** Este código **nunca** había escrito esa propiedad. El
  valor „Bewerber / Mitarbeiter" no venía del formulario: el contacto **ya existía**
  (`createdate` 31.03.2025, una tarea de diciembre 2025, correos del 10.08.2026) y el
  formulario sólo lo actualizó. Lo que faltaba no era corregir un valor, era
  escribirlo.
  - ⚠️⚠️ **LOS VALORES INTERNOS NO SON LAS ETIQUETAS, y acá menos que nunca** — leídos
    del portal el 26.08, no adivinados: `(Potenzieller) Kunde` y
    **`Bewerber Sicherheitsdienst`** (cuya etiqueta es „Bewerber / Mitarbeiter"). Un
    „potenzieller Kunde" en minúscula y sin paréntesis habría sido **400 para TODA la
    llamada**, nombre y e-mail incluidos.
  - ⚠️ **Va en las propiedades PROPIAS, no en las estándar**, y ése es el modo de
    fallo: si la opción se renombra en el portal, el primer intento cae con 400 y el
    segundo escribe sólo los campos estándar — falta la rol, **pero el lead está**. En
    las estándar, un renombrado en el portal sería un fallo total del formulario.
  - ⚠️ **Tabla propia, NO `EIGEN_MAP`**: es una propiedad que el cliente construyó, y
    `setup-hubspot.mjs` CREA todo lo que está en `EIGEN_MAP`. Ésta sólo se **verifica**,
    y un paso más profundo que las demás: no basta que exista, el valor que escribimos
    tiene que ser una opción real.
  - ⚠️ **Por tipo de formulario, no global.** Hoy sólo `customer_inquiry` llega a este
    endpoint: medido, **44 formularios** en el sitio, todos con ese tipo, y `/jobs/`
    **no tiene ningún `<form>`** — su formulario de postulación es un **embed de
    HubSpot** (`partials/hubspot-jobs-form.html`). O sea la separación que pidió el
    cliente hoy es estructural, no configurada.
  - ⚠️ **Sobreescribe un valor existente.** En un select simple alguien pierde, y el
    formulario es la evidencia más reciente. **El caso límite:** quien primero se
    postula y después pide un presupuesto pasa a cliente, y un `bewerber_status`
    quedaría sin rol acorde. En el contacto de prueba estaba vacío.

- ✅ **EL OBJETO EMPRESA QUEDA APAGADO** (`HUBSPOT_FIRMA_ANLEGEN=1` lo reactiva).
  Cliente: *„Firma anlegen würde ich vielleicht gar nicht mal machen"*. Razón: „Firma"
  es texto libre, y de „Frankonia" / „FRANKONIA GmbH" / „frankonia sicherheit" salen
  tres objetos que alguien fusiona a mano después.
  ⚠️ **No se pierde ningún dato, y eso es lo que permite apagarlo:** el nombre queda en
  la propiedad estándar `company` **del contacto** y en el texto de la nota. Medido:
  `company = FRANKONIA Testeintrag`, y **0 empresas creadas** en la corrida de prueba.

- **Hint en el campo de mensaje, en los 44 formularios:** „Für ein Angebot ohne
  Rückfragen: wann, wo, wie viele Sicherheitskräfte und welche Aufgaben."
  - ⚠️ **En el partial compartido y NO en `messageLabel`**: ese label es distinto por
    página (medido, **22 variantes**) y es copy aprobado. Como parámetro de include
    serían 44 oportunidades de que uno divergiera.
  - ⚠️ **Línea propia, no `placeholder`**: un placeholder desaparece al primer tecleo,
    que es justo cuando una lista de cuatro puntos sigue haciendo falta. Con
    `aria-describedby`, o para un lector de pantalla no existiría.
  - ⚠️⚠️ **UN VALOR DE CONTRASTE QUE ESCRIBÍ EN VEZ DE CALCULAR, Y ESTABA MAL.** Salió
    con `0.72` y el comentario „misst 5,4:1"; calculado son **4,25:1**, o sea **por
    debajo** del 4,5:1 que aplica a 13px (el umbral de texto grande empieza en 18,66px
    bold). Ahora 0,8 = **5,25:1**, medido contra la superficie real en cuatro páginas.
    **Regla: un ratio que no se calcula está adivinado.**
  - Medido a 320 / 390 / 768 / 1440: sin scroll horizontal, la textarea conserva su
    `min-height` (88/72px), 1 línea desde 768, 2 a 390, 3 a 320. Captura revisada.

- ✅ **„Karriere" → „Jobs", y LA URL YA ERA `/jobs/`** — sitemap, `<title>` („Security
  Jobs Bamberg & Umland") y H1 („Dein Job bei FRANKONIA") también. Era sólo la
  etiqueta: nav, footer, linktree, breadcrumb visible **y el `BreadcrumbList` del
  JSON-LD** (los dos últimos van juntos, si no Google muestra otro camino que la
  página). Medido sobre las 70 páginas: „Karriere" ya no aparece como etiqueta.
  ⚠️ **Quedan „Karriereformular" y „Karriereseite" en `/datenschutz/`**, a propósito:
  es texto legal, y ahí la palabra es descriptiva, no el nombre de la página.

- **La selección de servicio SE QUEDA** (el cliente preguntó, no ordenó). Tres razones
  medidas: ya es **opcional** („Bitte auswählen (optional)", y el servidor no la
  exige); son los nombres de sus propias leistungen, o sea reconocer y no recordar, con
  „Etwas anderes" como salida; y el valor trabaja en **tres** lugares —
  `website_service`, `SERVICE` en Brevo y **el asunto del aviso interno**. Quitarla
  sería técnicamente inofensivo (la plantilla ya maneja `SERVICE` vacío), sólo cuesta
  estructura.

- **64/64 tests.** Dos aserciones existentes hubo que ampliarlas, y ése es el detalle
  que importa: exigían que **todo** campo propio empiece con `website_` y sea creado
  por el script. La rol es el primer caso que no cumple ninguna de las dos. Está
  exenta **por nombre y no por patrón**, así que un segundo campo ajeno al portal sigue
  rompiendo los tests. Más un test nuevo: un `form_type` desconocido **no** recibe rol.

- ✅ **Nachweis en vivo** (`a8f9e7e4-…`): rol correcta, fase 5522034896, `company` en el
  contacto, **0 empresas nuevas**, y el endpoint registró „abgeschlossen" y no
  „teilerfolg" — o sea también los dos mails y Brevo. `--verify` da 0 problemas.

**2026-08-26, QUINTA RONDA — EL RATGEBER BAJA AL FINAL DEL DRAWER, LAS 9 PÁGINAS DE
PERSONA GANAN UNA BANDA DE CONFIANZA, Y „Sonstiges" / „Kein Interesse" AHORA SE
SOBREESCRIBEN** (cliente, tres instrucciones). Toca `partials/header-de.html`, un
partial nuevo, `css/page-person.css`, las 9 páginas de persona y
`api/_lib/hubspot.js`.

- **El Ratgeber va al FINAL del drawer, bajo Kontakt** ("im Mobile- und Tabletmenu
  möchte ich den ganz unten unter Kontakt haben, nicht als Zweites"). Es una
  reubicación de líneas; conserva `site-nav__item--drawer-only`, o sea sigue oculto
  desde 1400px, donde la fila del nav ya no tiene lugar para un sexto ítem. La razón
  quedó en el markup: es un hub de contenido, no parte de la navegación principal —
  en segundo lugar pesaba más que "Leistungen".

- ✅ **`partials/person-trust.html` NUEVO, en las 9 páginas de persona** (cliente:
  "kannst Du unten drunter noch ein paar Trustelemente machen. So was wie das sagen
  unsere Kunden, Google Bewertung"). Contenido: la afirmación aprobada de las 300
  empresas (verbatim del hero de `/referenzen/`), la píldora de Google enlazada al
  perfil real, los 2 sellos DEKRA y un link a `/referenzen/`.
  - **Un partial y no nueve copias** — es la misma afirmación en nueve páginas, y
    nueve copias son nueve oportunidades de que una quede vieja. Las cifras salen de
    `content/values.json`, así que una nota nueva de Google es **una línea**.
  - ⚠️⚠️ **SIN CITA COMPLETA DE CLIENTE, Y ESO ES DELIBERADO.** Las tres citas del
    sitio miden **332–376 caracteres** y CLAUDE.md prohíbe acortarlas (recortarle
    palabras a una persona nombrada es ponerle otras en la boca). Tres serían >1.000
    caracteres en una página que se abre desde un QR con el teléfono en la mano — y
    elegir UNA convierte a un cliente en la cara de cada tarjeta de visita. Es una
    decisión del cliente; el motivo quedó escrito en el partial para que nadie lo
    "complete" después.
  - ⚠️ **SIN pixel-seam antes**: la card y la banda están las dos sobre el negro de
    la página, y dos superficies iguales no llevan seam (§9.2).
  - ⚠️ **`/linktree/` y `/sicherheitscheck-walde/` quedan fuera**: llevan el mismo
    layout de card pero no son páginas de persona (una es una lista de links, la otra
    una página de reserva con tres links de HubSpot Meetings).
  - **Medido a 320 / 390 / 419 / 420 / 768 / 1440**: sin scroll horizontal, nada
    fuera del viewport, **ratio DEKRA 0,665 = 399/600 exacto** (o sea sin deformar —
    en esas grafías sólo se permite escalar proporcionalmente), sellos 38/44px, link
    **44px** de alto, todo a **0px** del eje central, y la banda pasa a una columna
    por debajo de 420px.
  - ⚠️⚠️ **EL ÚNICO DEFECTO REAL SÓLO SE VIO EN LA CAPTURA, NO EN LOS NÚMEROS: el
    icono de la afirmación quedaba a 117px del texto.** `.person-trust__claim` era un
    flexbox, y el nodo de texto que envuelve se **blockifica** dentro: sus líneas
    quedan centradas y el icono se pega al borde de ESE bloque, no a las letras.
    Todas las mediciones daban bien. Ahora es `inline-block` con
    `vertical-align: -0.18em`. **Lección: una medición dice si algo está donde debe;
    no dice si la composición se lee. Para lo segundo hace falta mirar.**
  - ✅ **La píldora de Google mide 24×247 y NO es un defecto** — es el mismo valor
    que en `/ueber-uns/`. Mi recuerdo de "deberían ser 48px" estaba mal; dos tamaños
    para el mismo componente sí habrían sido el defecto.

- ⚠️⚠️ **HUBSPOT: „Sonstiges" y „Kein Interesse" PASAN AL FRENTE DE
  `LIFECYCLE_REIHENFOLGE`, o sea una anfrage nueva los SOBREESCRIBE** (cliente: "auf
  jeden Fall überschreiben in dem Moment, wo jemand ein Angebot angefragt hat").
  Cierra la pregunta abierta del 2026-08-26 cuarta ronda. "Kunde", "Fürsprecher" y
  "Upsell" siguen detrás del objetivo — un formulario no puede degradar a nadie.
  - **CONSECUENCIA QUE NO ES OBVIA: esa lista deja de ser un espejo del orden del
    portal y pasa a ser una jerarquía propia.** `setup-hubspot.mjs --verify` comparaba
    elemento por elemento y **habría gritado en cada corrida** sin que nada estuviera
    roto — o sea la clase de aviso que a la tercera vez nadie mira. Ahora compara la
    **MENGE**: una fase que existe en el portal y no en el código se trata como
    desconocida, el contacto no se mueve, y **nadie se enteraría**. Ése es el caso que
    tiene que sonar.
  - El test fija las dos cosas: `darfPhaseSetzen("other", ziel) === true` y la
    jerarquía completa como `deepEqual` (el ORDEN se verifica ahí, porque decide quién
    se sobreescribe). **63/63 tests en verde.**

- ⚠️⚠️ **CORRECCIÓN A UNA AFIRMACIÓN PROPIA: el strip de cards SÍ funciona a ancho de
  tablet.** Había reportado que necesitaba mouse a 914px. Era un **artefacto de mi
  sonda**, que forzaba `prefers-reduced-motion` — justamente lo que apaga el scrubber.
  Medido con motion real (`CDP_MOTION=1`): a **768 / 914 / 1023** el strip avanza
  lateralmente al scrollear hacia abajo, el stage queda `sticky`, y el track mide
  **4432 / 5082 / 5567px**. Lo que difiere es el LOOK (plano contra peek-stack), no el
  mecanismo. Probado que el peek-stack corre desde 900px (`enhanced`, cards 248–282px)
  pero necesita dos arreglos más: la sección colapsa a **1096px** (sin distancia de
  scroll) y la barra de swipe queda encendida. **Es una pregunta al cliente, no un
  cambio.**
  ⚠️ **Regla para la próxima medición de cualquier efecto scroll-driven: una sonda con
  reduced motion forzado no puede decir nada sobre él** — mide el estado de reposo y lo
  reporta como defecto.

**2026-08-26 — `/datenschutz/` REESCRITA POR INSTRUCCIÓN DEL CLIENTE, Y EL HALLAZGO
GRANDE NO FUE UN ERROR DE TEXTO: LA PÁGINA TERMINABA A MITAD DE CONTENIDO Y SE
SERVÍA SIN FOOTER DESDE EL BLOQUE J.** Toca `pages/datenschutz.html` y
`docs/datenschutz-drittanbieter.md`. **Cero CSS, ninguna otra página.**

- **El cliente levantó la regla, y sólo para esta página** ("Datenschutz —
  optimiere es einfach selbst so dass es am sinnvollsten ist und am besten
  passt"). Queda anotado en el propio markup por qué acá sí: **en una
  Datenschutzerklärung una afirmación falsa no es gusto de redacción, es una
  información obligatoria falsa del Art. 13 DSGVO.**
- ⚠️⚠️ **EL DEFECTO ESTRUCTURAL: faltaban `</main>`, dos `</div>`, `</section>`,
  el FOOTER, el botón de WhatsApp y `</body></html>`.** Un browser cierra los tags
  abiertos solo, así que **la página SE VEÍA normal** — pero no tenía footer, o sea
  **ni link al Impressum ni forma de navegar afuera**, justo en la única página que
  enlazan el checkbox de consentimiento de los 40 formularios y el footer de las
  otras 68.
  ⚠️ **LO ENCONTRÓ LA MEDICIÓN, NO LA VISTA, y el tell es específico:** mi sonda
  quiso recortar `<main>…</main>` y recibió un string VACÍO. Una captura no lo
  muestra. **Barridas las 69 páginas: era la única**, y la prueba de balance de tags
  (`main`/`body`/`html`/`footer`/`header`/`section`) quedó como herramienta.
- **Cinco correcciones, cada una verificable:**
  · **§ 83 StBerG** (Steuerberatungsgesetz) en el 5.1 — un bloque de plantilla de
    estudio contable que **RESTRINGÍA el derecho de acceso del visitante** invocando
    una norma que no aplica a un prestador de seguridad. La frase se ACORTÓ, no se
    borró: el segundo motivo (interés preponderante de un tercero) sí aplica.
  · segundo "2.1 Aufruf der Webseite" → **"2.2 Kontaktformular"**.
  · Stand **18.05.2018** → 26.08.2026.
  · la domain con **"www."** → sin www (el sitio corre en la desnuda).
  · ⚠️⚠️ **EL ABSCHNITT 4 DESCRIBÍA COOKIES QUE NO EXISTEN** — de sesión,
    temporales y "zu statistischen Zwecken". Medido en todo el JS propio: **cero
    `document.cookie`, cero `localStorage`, cero `sessionStorage`, ningún
    analizador**. O sea declaraba una verificación que no ocurre, y encima
    describía justo cookies de análisis, **que serían einwilligungspflichtig**. Eso
    no es un excedente inofensivo: afirma un tratamiento para el que al cliente le
    falta el banner.
- **Cuatro secciones AGREGADAS, y las cuatro salen de medir el proyecto, no de una
  plantilla:** `2.3` bewerbungen con **upload de CV** (`/jobs/` toma name, email,
  phone, qualification, message, cv `.pdf/.doc/.docx`), `3.1` Hosting (Art. 13 Abs.
  1 lit. e pide los destinatarios y el bloque de logfiles sólo decía "der Server
  dieser Webseite"), `3.2` Kartendarstellung (**los tiles de CARTO transfieren la IP
  a un tercero, en `/`, `/einsatzgebiete/` y `/kontakt/`** — y el texto dice que la
  carga es lazy, porque quien no llega a esa parte no abre conexión), y `3.3`
  servicios enlazados.
  ⚠️ **El 3.3 existe justamente para marcar la diferencia que importa: son LINKS,
  no embeds.** Antes del clic no sale un solo dato — decirlo es lo que separa este
  caso de un iframe de Instagram.
- ⚠️⚠️ **DOS COSAS QUE NO SE AFIRMARON, A PROPÓSITO, y están marcadas como pregunta
  EN el markup:** si existe el **Auftragsverarbeitungsvertrag** del Art. 28 con el
  hoster (el texto dice que ese contrato **es necesario** —eso es la ley— y NO que
  se firmó), y la **duración de conservación** de las postulaciones. **Una
  afirmación contractual inventada es peor que un hueco.**
- ⚠️ **Las direcciones postales de Vercel y CARTO se SACARON del borrador antes de
  publicar**: las tenía de memoria y no las puedo verificar. Quedan la razón social
  y el país, que es lo que el Art. 13 necesita como destinatario.
- **`docs/datenschutz-drittanbieter.md` ganó una advertencia nueva y necesaria:
  cuando lleguen GA4 y reCAPTCHA, el Abschnitt 4 se REEMPLAZA, no se amplía.** Hoy
  dice "keine Cookies"; dejarlo y poner un bloque de cookies al lado es una
  contradicción dentro de un mismo documento, y de las dos la peor, porque el
  visitante lee primero el "keine".
- ✅ **Cross-link "Zum Impressum"** agregado al cierre — el espejo del "Zur
  Datenschutzerklärung" que el Impressum ya tenía, con su misma clase y su mismo
  comentario. Con el footer ausente ese link era la única salida; ahora es
  redundancia útil.
- **Medido: jerarquía h1 → h2 → h3 → h4 sin un solo salto** (22 headings), los
  cinco errores en 0 apariciones, **h3 20px/500 sobre h4 16px/600** (o sea la
  inversión de tamaños de Bloque J sigue arreglada), footer en y=9371, botón de
  WhatsApp presente, listas con viñetas, cero tokens sin resolver, sin scroll
  horizontal, **69/69 páginas con tags balanceados**. Capturas a 1440 y 390.
- ⚠️ **Trampa de medición propia, y la peor de hoy: mi primera prueba de balance de
  tags reportó 235 problemas INEXISTENTES.** Escrita como `node -e '...'`, la clase
  `[\\s>]` perdió un nivel de backslash y llegó como `[s>]`, así que `<main[s>]` no
  matchea `<main id="main">` y contó 0 tags de apertura en TODAS las páginas. **Una
  sonda que reporta que todo está roto casi siempre está rota ella.** Pasada a
  archivo con el Write tool — tercera vez hoy con la misma causa.

**2026-08-26, CUARTA RONDA — LA LIFECYCLE-PHASE LA ELIGIÓ EL CLIENTE („Angebot
erstellt“), Y LA VARIABLE SOLA CASI NO HABÍA HECHO NADA.** Más el secret de
Turnstile (estaba, comentado) y una auditoría de CTAs sobre las 70 páginas.
**63 tests verdes.**

- ⚠⚠ **`HUBSPOT_LIFECYCLE_STAGE=5522034896` NO ALCANZABA, y el motivo es la
  trampa de fondo de este portal: sus fases son PROPIAS, con IDs numéricas.** La
  comprobación „¿puedo escribir esta fase?“ necesita un ORDEN — si no, una consulta
  podría retroceder a un cliente. En el código estaba la lista estándar de HubSpot
  (`subscriber`, `lead`, `customer`…), donde una ID numérica no encaja: fase
  desconocida → no tocar → **la fase se habría escrito SOLO en contactos nuevos.**
  Con **2.767 contactos en „Kaltakquise“** eso era el caso normal.
  - Ahora `LIFECYCLE_REIHENFOLGE` es **el orden de ESTE portal**, leído de la API
    el 26.08.2026, con las etiquetas al lado en comentario — un nombre interno
    solo no dice nada (`lead` = „Termin vereinbart“ aquí).
  - ⚠️ **„Sonstiges“ y „Kein Interesse“ quedan DETRÁS del objetivo a propósito**:
    son un juicio humano, y una consulta nueva no debe pisarlo. Moverlos delante
    es una decisión sobre el proceso comercial, no sobre código — anotado, no
    hecho.
  - ⚠️ **La constante se vuelve obsoleta si reordenan el portal, y el efecto
    sería SILENCIOSO** (fase desconocida = no se toca). `setup-hubspot.mjs
    --verify` compara código y portal y **sale con código 2** si difieren; un test
    fija la lista además.
  - ✅ **Probado contra el CRM real:** el contacto de prueba estaba en `4000505062`
    (Kaltakquise) y quedó en `5522034896` (Angebot erstellt).

- **El secret de Turnstile YA ESTABA en `.env.local` — comentado, y DOS VECES** con
  el mismo valor (una en un bloque „Später, noch nicht nötig“). Activada una línea,
  la otra marcada como duplicado.
  - ✅ **Y es válido, no sólo presente:** probado contra Cloudflare con un token
    falso. La respuesta fue `invalid-input-response` y **no**
    `invalid-input-secret` — esa distinción ES la prueba. Un segundo tiro por el
    endpoint real: **400 `spamschutz`, y ni HubSpot ni Brevo se tocaron.**

- **Auditoría de CTAs sobre el build entero** (respuesta a „¿tenemos algún CTA que
  no sea pedir presupuesto?“): **un solo `form_type` en las 44 páginas**
  (`customer_inquiry`), o sea no hay una segunda clase de consulta que pidiera otra
  fase. Cinco rótulos distintos llevan al mismo formulario.
  ⚠⚠ **HALLAZGO: `/sicherheitscheck-walde/` tiene TRES enlaces de HubSpot
  Meetings.** Quien reserva ahí **no pasa por este endpoint**: HubSpot crea el
  contacto con su propia lógica, sin „Angebot erstellt“ y sin ningún campo
  `website_*`. Es, junto con `/jobs/`, la única entrada al CRM que no controlamos.

- ⚠️ **Trampa propia, en mi cargador de `.env.local`: sobreescribía una variable
  ya presente en el entorno.** Un `TURNSTILE_SECRET_KEY=<clave de prueba>` inline
  fue reemplazado por el real del archivo, el endpoint devolvió 400 y parecía un
  fallo del código. La precedencia correcta es la de dotenv: **lo que ya está en el
  entorno gana.**

**2026-08-26, TERCERA RONDA — EL PRIMER DURCHLAUF CONTRA LAS APIs REALES. Funciona de
punta a punta, y encontró CUATRO defectos que ninguna prueba con `fetch` simulado
podía encontrar.** Toca `api/_lib/{hubspot,log,http}.js`, los dos scripts de setup,
`.env.example` y los tests. **62 tests verdes** (eran 59).

- ⚠️⚠️ **EL PEOR: `lifecyclestage: "lead"` HABRÍA CLASIFICADO MAL CADA CONSULTA.** En
  HubSpot el nombre interno y la ETIQUETA son dos cosas distintas, y la etiqueta se
  renombra por portal. En este portal `lead` **no** se llama "Lead" sino **"Termin
  vereinbart"** — o sea varias etapas más adelante en el embudo. Un formulario habría
  entrado como "cita agendada". No se ve el día de la consulta, se ve semanas después
  en el reporting: la misma clase de degradación silenciosa contra la que ya protegía
  el guard de "no bajar de etapa", sólo desde el otro lado.
  - Ahora la etapa sale de **`HUBSPOT_LIFECYCLE_STAGE`**, y **sin la variable NO se
    escribe la etapa** — HubSpot pone su propio default. Es el único valor que no
    puede estar mal en ningún portal.
  - `darfAufLeadSetzen()` → `darfPhaseSetzen(aktuell, ziel)`. ⚠️ **Con una etapa
    PROPIA del portal (ID numérica) no hay orden determinable**, así que sólo se
    escribe en contactos NUEVOS. Ése es exactamente el caso de este portal.
  - `setup-hubspot.mjs --verify` imprime ahora la lista de etapas del portal con su
    nombre interno. La decisión es del cliente; el dato para tomarla estaba oculto.

- ⚠️ **"ALREADY SUBSCRIBED" ERA TRATADO COMO FALLO.** HubSpot responde **400** cuando
  el contacto ya está inscripto en el tipo de suscripción — pero el estado deseado ya
  está. Como fallo, cada interesado que vuelve y marca la casilla generaba un warning,
  y en el log parecía que la einwilligung no se había registrado.
  - Ahora cuenta como éxito, **pero sólo tras verificar**: el texto inglés es el
    DISPARADOR, la prueba es el endpoint de estado. Si HubSpot cambia el texto, vuelve
    a ser warning — el modo de fallo es el lado seguro.
  - ⚠️ **NO se sobreescribe una legalBasis existente.** El contacto de prueba tenía
    `LEGITIMATE_INTEREST_PQL` de un proceso anterior del cliente; una einwilligung
    fresca sería base más fuerte, pero el endpoint subscribe no puede cambiarla y
    pisar un registro ajeno vía la API v4 no es una decisión que se tome de paso.

- ⚠️⚠️ **LA PROPIA MÁSCARA DE LOGS HIZO IMPOSIBLE EL DIAGNÓSTICO, y eso costó la mitad
  de la ronda.** `message` está en la lista de borrado porque es el campo de mensaje
  del formulario — **y es también la clave estándar con la que HubSpot y Brevo
  devuelven su frase de error.** El log decía literalmente:
      hubspot.einwilligung: 400 endgueltig {"message":"<entfernt>"}
  El motivo real era "is already subscribed", o sea ni un error. Ahora hay un segundo
  juego (`FREITEXT_FREMD`) que **enmascara** en vez de borrar, y `log.warn` acepta un
  cuarto parámetro `fremd` que sólo pone `api/_lib/http.js`. Para datos propios se
  sigue borrando: en el mensaje de un interesado el CONTENIDO es el dato personal.

- ⚠️ **EL PATRÓN DE TELÉFONO CORTABA IDENTIFICADORES.** Un correlationId
  `01a03e48-4ab9-…` salía como `4ab<tel>b36` — inservible, y es justo lo que se
  necesita para hablar con el soporte. Ahora lleva límites de palabra: un teléfono
  nunca está pegado a una letra, un identificador sí.

- **LO QUE QUEDÓ CONFIGURADO** (todo leído de las cuentas, nada supuesto): las **diez
  propiedades propias creadas** en el grupo `website_integration` y verificadas por
  tipo; la lista de Brevo **"Website – Marketing-Einwilligung" (id 7)** creada y
  movida al folder `marketing_automation` (⚠️ se crea por defecto en
  "Conversations-Kontakte", el folder del chat, donde una lista de marketing no va);
  la plantilla **5** comprobada — activa, remitente correcto, reply-to
  `info@frankonia-sicherheit.de`, y contiene los dos placeholders que el código envía;
  y **los dos** tipos de suscripción, decisión del cliente ("einfach beides setzen").

- ✅ **MEDIDO CONTRA LAS CUENTAS REALES, tres corridas:** contacto con **15 campos**
  poblados, empresa creada y asociada, nota con mensaje/servicio/página/campaña,
  contacto de Brevo con **11 atributos** + `OPT_IN` + lista 7, y **las dos mailes
  ENTREGADAS** (confirmación al remitente — incluso abierta — y aviso interno a
  `info@`). La corrida sin el tic no dispara ninguna einwilligung ni lista y no emite
  un solo warning.
  ⚠️ **Turnstile corrió con la clave de PRUEBA oficial de Cloudflare**
  (`1x0000000000000000000000000000000AA`): el secret real sólo existe en el dashboard
  del cliente. Es el único eslabón sin probar de verdad, y la clave **no** se escribió
  en `.env.local` — ahí sería un antispam desactivado.

- ⚠️ **Trampa de entorno: `.env.local` NO la lee nada de este proyecto** (cero
  dependencias, o sea no hay dotenv; `build.js` lee `process.env`). Para correr algo
  con esos valores hace falta un cargador propio — hay uno de ~40 líneas en el
  scratchpad de esta sesión que además **nunca imprime un valor**, sólo nombre y
  longitud. Lo único que hace funcionar el sitio en vivo son las Environment
  Variables de Vercel.

**2026-08-26, MISMA SESIÓN — SIETE PUNTOS DEL CLIENTE SOBRE LA INTEGRACIÓN: TELEFON
OBLIGATORIO, LAS PROPIEDADES DE HUBSPOT VERIFICABLES, LA EINWILLIGUNG DE MARKETING, Y
LA SEMÁFORO DE DOBLE CLIC. Más dos overflows, uno de ellos MÍO.** Toca `api/_lib/`
(guard, hubspot, brevo, validate), `api/forms/submit.js`, `partials/lead-form.html`,
`css/{lead-form,testimonials,page-home}.css`, dos scripts de setup y los tests.
**58 tests verdes** (eran 48).

- ⚠️⚠️ **TELEFON ES OBLIGATORIO OTRA VEZ, Y ESO REVIERTE MI PROPIA RECOMENDACIÓN DEL
  MISMO DÍA** (cliente: "kannst du telefon trotzdem überall pflicht machen"). Queda
  anotado en los dos sitios porque **la obligatoriedad vive en DOS lugares y tiene
  que vivir en los dos**: el `required` del markup es comodidad (el navegador avisa
  al instante) y `FORM_TYPES.customer_inquiry.pflicht` de `validate.js` es la
  verdadera — un script que postea directo al endpoint nunca ve el markup. El costo
  está dicho en el protocolo: un campo obligatorio más baja la tasa de envío. Si las
  consultas caen después del lanzamiento, ése es el primer interruptor.

- **LA ZUORDNUNG DE HUBSPOT PASÓ DE CÓDIGO DISPERSO A UNA TABLA DECLARATIVA**
  (`STANDARD_MAP` / `EIGEN_MAP` / `EIGEN_SERVER` en `api/_lib/hubspot.js`), y
  `scripts/setup-hubspot.mjs` **la lee de ahí con `createRequire`** en vez de tener su
  propia copia. Eso es el punto entero: una segunda lista mantenida a mano es
  exactamente el lugar donde el código y el CRM se separan sin que nadie lo note.
  - ⚠️ **HUBSPOT RECHAZA LA LLAMADA COMPLETA CON 400 SI UNA SOLA PROPIEDAD NO
    EXISTE.** Un typo en uno de quince nombres no cuesta un campo, cuesta el
    contacto. Y lo que cuenta es el **nombre interno, no la etiqueta**: es
    `firstname`, no `first_name`, `firstName` ni "Vorname".
  - ✅ **Y AHORA UN 400 NO PIERDE EL LEAD:** `kontaktUpsert()` reintenta
    automáticamente **sólo con los cinco campos estándar** y registra el comando de
    verificación. El contacto entra sin los extras en vez de no entrar. Un test
    fuerza ese camino exacto.
  - `--verify` no escribe nada y comprueba **existencia Y tipo**; sin la bandera crea
    las diez propias en el grupo `website_integration`. Nunca toca una existente.
  - Un test comprueba que las grafías equivocadas **no** aparecen en la llamada.

- **MARKETING-EINWILLIGUNG, sólo con el tic.** HubSpot:
  `/communication-preferences/v3/subscribe` sobre el tipo "One to One" con
  `legalBasis: CONSENT_WITH_NOTICE` y el texto de qué checkbox, en qué página, cuándo
  — eso es la diferencia entre un tic y un **nachweis**. Brevo: la lista de marketing,
  porque **en Brevo la LISTA carga la einwilligung** (sin lista no hay campaña
  posible).
  - ⚠️ **SIN LAS DOS VARIABLES NUEVAS NO SE ADIVINA NADA.**
    `HUBSPOT_SUBSCRIPTION_ID_ONE_TO_ONE` y `BREVO_MARKETING_LIST_ID`: si faltan, se
    protocoliza y la anfrage pasa igual. **Una ID inventada es peor que una ausente**
    — metería a alguien en un verteiler ajeno.
  - **La eingangsbestätigung sigue saliendo sin tic**: es transaccional, es la
    respuesta a una acción del propio destinatario.

- **`scripts/setup-brevo.mjs` (nuevo) NO ESCRIBE NADA, y existe por un modo de fallo
  silencioso: BREVO DESCARTA UN ATRIBUTO DESCONOCIDO SIN AVISAR.** El contacto se
  crea, la respuesta es 201, y el nombre simplemente no está. El script compara los
  atributos que el código **realmente envía** (llamando a `kontaktAttribute()` con
  datos de ejemplo, no una lista aparte) contra la cuenta, revisa absender y listas, y
  de la plantilla transaccional dice si está **activa** y si contiene los
  placeholders — una plantilla sin `params.VORNAME` manda un correo anónimo,
  técnicamente exitoso y materialmente equivocado.

- ⚠️⚠️ **DEFECTO REAL EN LA IDEMPOTENCIA: LA SEMÁFORO DE DOBLE CLIC NO CUBRÍA EL
  DOBLE CLIC.** `idempotenzTreffer()` preguntaba "¿ya hay una respuesta?", y con dos
  clics separados por milisegundos **ninguno la encontraba**: los dos trabajaban
  completo y creaban **dos contactos, dos notas y dos mails de confirmación**. La
  semáforo sólo actuaba cuando la primera petición ya había TERMINADO, o sea
  justamente cuando no hay doble clic.
  - Ahora el schlüssel se **reserva de entrada**. El segundo espera el resultado del
    primero y devuelve la misma respuesta — incluida la misma ablehnung.
  - ⚠️ **SÓLO SE CONSERVAN LOS ÉXITOS, las ablehnungen no**, y eso no es un detalle:
    el schlüssel pertenece **al formulario, no al clic** (se genera una vez por
    formulario construido, en `js/lead-form.js`). Conservar un rechazo dejaría al
    visitante sin poder reenviar nunca ese formulario — el campo olvidado, el token
    de Turnstile caducado y el envío demasiado rápido serían definitivos.
  - **Un wachhund de 30s libera una reserva que nunca se cierra** (una excepción
    inesperada), con `unref()` para no mantener vivo ni el proceso ni un test. Sin él
    el schlüssel quedaría bloqueado diez minutos.
  - **La respuesta se ESPEJA según la petición que repite, no según la primera:** se
    guarda sólo la nutzlast JSON, y si el repetidor no acepta JSON obtiene la
    redirección a `/danke/` o una página HTML. Un visitante sin JavaScript no puede
    terminar viendo JSON crudo.
  - ✅ **DOS DE LOS CUATRO TESTS NUEVOS FALLAN SIN EL CAMBIO** — comprobado quitando
    la reserva y volviéndola a poner. Un test que pasaría igual sin el arreglo no
    prueba nada.
  - ⚠️ Límite honesto, sin cambio: el estado vive en la memoria de la instancia. Dos
    instancias → dos contactos (HubSpot y Brevo los unen por e-mail; se duplicarían
    la nota y el correo). Una garantía real necesita almacenamiento compartido, o sea
    la primera dependencia de runtime del proyecto: decisión del cliente.

- ⚠️⚠️ **DOS OVERFLOWS, Y EL PRIMERO ERA MÍO — de esta misma sesión.** El informe
  anterior decía "47px a 768, preexistente, verificado por A/B, otro pase". Medido de
  verdad, eran **dos defectos superpuestos**:
  1. **EL FORMULARIO, en las 40 páginas que lo llevan:** a 320px la pista del grid
     medía **300px dentro de un formulario de 223px**. La trampa que este archivo ya
     documenta varias veces — la mínima automática de un ítem de grid es
     content-based y un `<input>` trae su propio ancho deseado — y yo le había dado
     `min-width: 0` **sólo a los dos campos `--half`**. **Un solo campo sin la
     propiedad estira la pista entera.** Ahora es `minmax(0, 1fr)` + una regla para
     TODOS los hijos, y la regla suelta de `.lead-form__half` se borró en vez de
     quedar como segundo mecanismo para la misma decisión.
  2. **LAS TARJETAS DE KUNDENSTIMMEN, banda 768–833:** hasta **62px**, o sea el ancho
     exacto de un iPad en vertical. La cadena medida: tarjeta 249 = padding 48 +
     cabecera 201, y 201 = avatar 44 + palabra más larga del bloque de nombre 109 +
     el glifo de Google 20 con sus gaps. Tres por 249 más gaps piden 795px y el
     container da 722 a 768. **A 834 entra solo**, y por eso el defecto vivía en una
     banda de 66px invisible en los anchos habituales de medición.
     - ⚠️ **MI PRIMER ARREGLO FUE UNA REGRESIÓN Y LA CAZÓ LA MEDICIÓN:** dejar que la
       cabecera envuelva mandó el glifo de Google a una segunda línea **en TODOS los
       anchos**, también a 1440. La causa es que el bloque de nombre tiene el ancho
       max-content de nombre + rol; con **`flex: 1 1 0`** crece hacia el espacio libre
       en lugar de reclamarlo, y sólo envuelve cuando falta de verdad.
     - **A/B con dos builds: a 900 / 1024 / 1440 / 1920 TODOS los valores idénticos**
       (ancho y alto de tarjeta, alto de sección, alto de página). A 834 la tarjeta
       pierde 4px; a 768 el overflow desaparece. La banda ya revisada por el cliente
       no se movió.
  - ⚠️ **LO QUE QUEDA A 320 ES PREEXISTENTE Y NO SE TOCÓ:** el hero del homepage,
    36px a 320 y 9px a 360, **idéntico en los dos builds del A/B**. Es el límite que
    CLAUDE.md documenta desde julio como deliberadamente no perseguido. Tocar el hero
    es un cambio de diseño en el elemento que el cliente más ha revisado.
    ⚠️ **De paso corrige una afirmación de CLAUDE.md**: dice "sin scroll horizontal a
    360"; hoy son 9px. A 390 y por encima está limpio.

- ⚠️ **Trampas de entorno de esta pasada, todas van a volver:**
  - **`cd` PERSISTE ENTRE LLAMADAS DE BASH.** Después de arrancar un servidor con
    `cd dist`, leí `css/testimonials.css` **del build minificado** y saqué de ahí los
    anchors del parche — que no existen en la fuente. No se aplicó nada por suerte.
    **Comprobar `pwd` antes de derivar un anchor.**
  - **`npm run build` falla con EPERM si un proceso tiene su cwd dentro de `dist/`.**
    El servidor de medición tiene que arrancarse desde fuera y recibir la raíz como
    argumento.
  - **`netstat` en alemán imprime `ABHÖREN`, no `LISTENING`**, así que un
    `grep LISTENING` para matar el servidor no encuentra nada y falla en silencio.
  - **Un backtick dentro de un template literal rompe el script de parche** — cuarta
    vez. Los parches con prosa alemana se escriben con el Write tool.
  - **`--window-size` no da un viewport real** (mínimo de layout ~500px): hace falta
    `Emulation.setDeviceMetricsOverride`, y con `mobile: true` el viewport de layout
    **se ensancha solo** cuando hay overflow — a 768 medí `innerWidth` 815 y eso ERA
    el defecto, no un error de la sonda. Para medir un overflow hay que usar
    `mobile: false` y `documentElement.clientWidth`.

**2026-08-26 — FORMULAR-INTEGRATION: LOS 45 FORMULARIOS DEJAN DE SER `action="#"`.
Endpoint propio en Vercel, HubSpot + Brevo + Turnstile, Consent + GTM en las 70
páginas, `/danke/`, y el formulario compartido reconstruido en 44 páginas.** Cuatro
commits: `e9a7ec1` (consent/CSP/danke), `19e4cbc` (endpoint + 42 tests), `c9fc7ba`
(frontend), y el de docs. Cierra **el punto más importante de todo el protocolo**.

- ⚠️⚠️ **EL BRIEFING ASUMÍA NEXT.JS Y TYPESCRIPT, Y ESTE PROYECTO NO ES NINGUNO DE
  LOS DOS.** Pedía rutas API, `NEXT_PUBLIC_`, `public/images/` y un framework de
  test. Mapeo, y cada pieza respeta la restricción de CERO dependencias:
  · endpoint → **Vercel Serverless Function en `api/`** (Vercel las reconoce también
    en un build estático); `fetch`, `AbortController` y `crypto.randomUUID` vienen
    en Node.
  · `NEXT_PUBLIC_` → los 3 valores públicos entran al HTML por el `{{token}}` que
    `build.js` ya tenía (nuevo `PUBLIC_ENV`, con fallback documentado).
  · tests → **`node:test`**, integrado en Node.
  ⚠️ **Los módulos compartidos van en `api/_lib/`** porque Vercel NO convierte en
  ruta lo que empieza con `_`. Con otro nombre serían cinco endpoints públicos.
- ⚠️⚠️ **DOS CONTRADICCIONES EN EL PROPIO BRIEFING, y las dos las encontró un test
  o el razonamiento, no la suerte:**
  1. **"Turnstile como primerísimo paso" + "idempotencia contra doble clic" no
     pueden coexistir en ese orden.** Un token de Turnstile vale **exactamente una
     vez**: con la verificación primero, el segundo clic recibe
     `timeout-or-duplicate` y el visitante ve un error aunque su consulta ya
     entró. **El test de idempotencia lo cazó** — contó una llamada externa de
     más, y esa una era Cloudflare. Ahora las cuatro comprobaciones locales
     (idempotencia, honeypot, tiempo mínimo, rate-limit) van antes: son accesos a
     un Map en memoria, **cuestan cero**, y Turnstile sigue estando antes de todo
     lo que cuesta cuota o dinero.
  2. **`submission_id` no puede ser a la vez generada en el servidor Y la clave de
     idempotencia**: dos clics generan dos IDs y la comprobación nunca dispara.
     Ahora son dos valores — `submission_id` del servidor para CRM y logs,
     `idempotency_key` del cliente, uno por formulario construido.
- ⚠️⚠️ **LA CSP TUVO QUE ABRIRSE, INCLUIDO `'unsafe-inline'` EN `script-src`, y es
  la única concesión real de esta tanda.** Antes decía `script-src 'self'`.
  Con GTM no se sostiene: **el contenedor inyecta el código de cada tag en
  runtime**, así que una lista de hashes se rompería en el segundo en que Christoph
  cree un tag — **en silencio**, porque un script bloqueado no produce error
  visible. Nonces serían lo correcto y necesitan un servidor que renderice el
  `<head>`; este sitio es estático.
  · **Queda la restricción de HOST**: 26 hosts nombrados, ni uno más.
  · **Los 26 con su razón viven en `docs/design-sources/csp-build.js`**, porque
    JSON no admite comentarios y una CSP sin justificación es exactamente la
    configuración que la siguiente persona abre de más o deja de menos.
  · **`frame-src` NO EXISTÍA** y caía a `default-src 'self'` → sin él, el iframe de
    Turnstile y el del formulario de HubSpot quedaban bloqueados.
- **El orden en el `<head>` no es negociable**: Cookiebot → Consent Mode v2
  ("denied") → GTM. **Verificado en las 70: Cookiebot es el primer script
  ejecutable de cada página**, y el bloque va arriba de `head-common` porque ahí
  todavía no hay ningún `<script>` (comprobado, no supuesto).
  ⚠️ **El bloque de Consent Mode no concede NADA.** Subirlo lo hace Cookiebot, y
  sólo si en su cuenta está activada la integración. Si está apagada, todo queda
  en "denied" para siempre **sin mensaje de error** — anotado como punto abierto.
- ⚠️ **`data-cookieconsent="ignore"` en el script de Turnstile es el punto que
  falla en silencio.** Cookiebot corre con `data-blockingmode="auto"` y bloquea
  todo lo que considera tercero — Turnstile incluido. Entonces el antispam cargaría
  sólo tras el consentimiento, o sea **no protege a quien ignora el banner**, que
  es la mitad de los visitantes.
- ⚠️ **`trailingSlash: true` habría convertido el endpoint en un 404.** Vercel
  normaliza `/api/forms/submit` a la variante con barra por 308, y ahí el sistema
  de archivos no encuentra la función. El cliente postea **directo a la variante
  con barra** y una regla de rewrite la devuelve a la función: cero saltos.
  **Hay que verificarlo en vivo después del deploy** — es lo único de este endpoint
  que depende del hosting y no del código.
- **El camino SIN JavaScript funciona completo**, y eso obligó a dos cosas que no
  estaban en el briefing: el endpoint lee también `urlencoded`, y responde a un
  navegador con **303 a `/danke/`** en vez de JSON (`Accept` decide). Para errores
  hay una página HTML mínima **sin hoja de estilos** — aparece sólo si no hay JS Y
  falla el envío, o sea una ruta que nadie va a mantener; que dependa de
  `/css/app.css` sería una cosa más que puede estar rota. **5 de los 47 tests
  cubren este camino.**
- ⚠️ **`/kontakt/` PERDIÓ SU FORMULARIO PROPIO y eso deroga page-conventions §6**,
  que lo fijaba expresamente. La instrucción posterior gana; la convención quedó
  actualizada en el mismo commit. Su `<h2>` sigue asociada vía un `<section
  aria-labelledby>` alrededor del include — el partial no puede llevarlo porque no
  conoce el `id`, y parametrizarlo sería un parámetro que 43 páginas nunca usan.
- ⚠️ **`/angebot/` perdió su excepción de campos** (`nameRequired=""`). Registrado
  con su compensación medida: dos campos de nombre obligatorios en lugar de uno
  opcional, **pero Telefon deja de ser obligatorio** — o sea una barrera menos, no
  más.
- ⚠️ **Telefon pasó de OBLIGATORIO a opcional en los 44 formularios.** Era Pflicht
  en todos, incluido `/kontakt/`. En una consulta B2B un teléfono es una barrera y
  el correo alcanza para responder.
- **La leistung es un `<select>` PRESELECCIONADO en 27 páginas**, derivado del slug
  vía el parámetro del include. En las 17 hub/ciudad/home queda abierta, porque ahí
  no se refiere a una leistung concreta. ⚠️ El valor se compara contra las
  `<option>`; **si no coincide queda vacío en lugar de inventar una entrada** — el
  modo de fallo deliberado.
- ⚠️ **`data-cta` en los 389 links de teléfono, mail y WhatsApp SE PONE EN EL
  BUILD, no en runtime.** Un atributo que agrega JS no está en el HTML servido:
  falta para cualquier clic anterior al script propio y no se ve al revisar el
  código fuente. Gegenprobe: **0 links de contacto sin atributo, 0 con atributo
  doble**. ⚠️ `data-cta="primary"` NO se pone así — "primario" es una afirmación
  sobre el ROL de un botón en su página, y eso una sustitución de texto no lo puede
  decidir.
- ⚠️ **HALLAZGO DE LA CAPTURA, NO DEL CÓDIGO: el widget de Turnstile salía en tema
  oscuro dentro de la tarjeta BLANCA del formulario.** Un cuadro negro en medio del
  formulario. Pasó a `theme: "light"`. En el código no se ve; en la imagen, al
  instante.
- ⚠️ **`.gitignore` NO EXCLUÍA `.env*`** (sólo `.DS_Store`, `.vercel`, `*.log`,
  `dist/`). Corregido, con `!.env.example` y **verificado con `git check-ignore`**,
  no asumido.
- **Ausdrücklich NO hecho, cada uno por su razón:** ningún Deal en HubSpot (hay una
  sola pipeline y es del comercial); ninguna Marketing-Einwilligung en HubSpot
  (falta decidir el Subscription Type — el script lo LEE y lo imprime, nunca lo
  crea); ninguna `listIds` en Brevo (una consulta no es un alta de newsletter);
  ningún GA4 en el código; y **nunca bajar de categoría a un cliente existente a
  "Lead"** — eso no se nota el día de la consulta sino semanas después en el
  reporting.
- ⚠️ **`api/_lib/log.js` existe porque las respuestas de error de HubSpot y Brevo
  DEVUELVEN los valores enviados.** Un `console.error(err)` normal pondría la
  dirección de correo del interesado en los logs de Vercel. Enmascara por PATRÓN
  (no por lista de nombres de campo: eso sólo protege lo que ya conocés) y hay un
  test que lo prueba con una respuesta que contiene la dirección.
- ⚠️ **Límite honesto del rate-limit y de la idempotencia: viven en la memoria de
  la instancia.** Un doble clic real se caza siempre (mismos milisegundos, misma
  instancia caliente); un ataque distribuido no — contra eso está Turnstile. Algo
  vinculante necesitaría almacenamiento compartido, o sea la **primera dependencia
  de runtime** del proyecto, y eso es decisión del cliente.
- ⚠️ **`ALARM forms` es la palabra a grepear en los logs de Vercel.** Marca los
  casos en que una consulta PUDO perderse. Un `ERROR` genérico se pierde entre el
  ruido del framework.
- **Los 4 Titelbilder del Ratgeber entraron** (§5d) y con eso los **siete**
  artículos tienen imagen. ⚠️ `art-tariflohn` lleva **calidad propia (68/72)**: a la
  común daba 117KB WebP y es el motivo más detallado del set (contraste de bordes
  8,54 contra 4,84–8,04) — y es el elemento LCP de su artículo. Precedente del
  proyecto: dos de las diez fotos de servicio ya van a WebP 62 en lugar de 72.
  ⚠️ Los `alt` describen **lo que se ve**, leído de una hoja de contactos, no el
  tema del artículo — y donde una persona no es identificable no se adivina.
- **Medido:** 47 tests en verde · 44 páginas con formulario, 0 problemas · 70
  páginas con el stack de consent, 0 problemas · 389 `data-cta` con contraprueba ·
  7 artículos con imagen y archivo presente · 70/70 páginas con tags balanceados ·
  redirect-test 0 problemas · vistas a 390/768/1440 en siete páginas.
- ⚠️ **DEFECTO ENCONTRADO Y NO TOCADO, con A/B para probar que no es mío:** la
  home scrollea **47px a la derecha exactamente a 768px**, por la tira deslizable
  de "Unser System" en la banda 768–1023 que no tiene adaptación propia. Dos builds
  en paralelo (estado previo al primer commit vs. ahora): **47px en ambos**, y
  **ningún elemento desbordado está dentro del formulario**.
- ⚠️ **La misma trampa de entorno CINCO veces en una sesión: un backtick dentro de
  un template literal** rompe el script de parcheo con un mensaje que no lo nombra
  (`… is not a function`, `missing ) after argument list`). Y dos veces la de
  siempre: **un heredoc de bash se come un nivel de backslash**, dejando `[\s\S]`
  como `[sS]`. Para contenido con comillas, regex o apóstrofos tipográficos: el
  Write tool, nunca `node -e` ni heredoc.
- ⚠️ **Y una propia que vale como regla: mi sonda de consent reportó 69 fallos
  inexistentes** porque mi propio comentario contenía la palabra `<script>` como
  literal. **Una sonda que dice que TODO está roto casi siempre está rota ella** —
  y los comentarios HTML se tildan antes de contar tags, tercera vez que este
  archivo lo anota.

**2026-08-26 — LAS SEIS VISITENKARTENSEITEN QUE EL CLIENTE DECIDIÓ CONSERVAR, DOS
REDIRECTS Y DOS 404 DELIBERADOS. Con eso los diez hallazgos del 25.08 quedan
cerrados y la prueba de completitud pasa de 2 huérfanas a CERO.** Toca
`docs/design-sources/person-pages.js`, `redirects-build.js`, `redirect-test.js`,
`vercel.json`, 6 páginas nuevas, 3 retratos y 6 vCards. **Cero CSS.**

- **Decisión del cliente, línea por línea** ("walde behalten, windisch auf jäger
  weiterleiten, bauer behalten, wettengel behalten, van wey behalten, morelo
  werkschutz team behalten, testformular auf 404 und homepage 2 auch auf 404"):
  seis páginas reconstruidas bajo su URL vieja, dos redirects a Jäger, dos 404.
  ⚠️ **Se desvió del plan que yo había propuesto en dos puntos y así se aplicó**:
  la pforte de MORELO NO va a `/referenzen/` (tiene su propio teléfono, impreso en
  la pforte) y la Security-Karte de Van Wey tampoco va a su Werkschutz-Karte.
- ⚠️⚠️ **HALLAZGO PROPIO, y era una pérdida real en 3 páginas ya construidas: LAS
  NUEVE LIVEKARTEN LLEVAN UN LEDE Y CUATRO LINKS DE SERVICIO, y el port del 23.08
  se comió los de tres.** El encabezado de ese generador afirmaba "every visible
  string was read off the live page … verbatim" y eso NO era cierto: Jäger
  Sicherheitsdienst perdió las dos cosas, Jäger Werkschutz conservó **1 de 4**
  links y Van Wey Werkschutz perdió los links. Restaurados de las páginas vivas.
  **Se arregló acá y no en otra pasada porque si no esta ronda dejaba seis
  completas al lado de tres incompletas** — o sea la inconsistencia se habría leído
  como una decisión.
- **Los dos ledes y los dos juegos de links viven en CUATRO constantes**
  (`LEDE_SD`/`LEDE_WS`, `LINKS_SD`/`LINKS_WS`), no repetidos nueve veces: cada
  página es o el lado Sicherheitsdienst o el lado Werkschutz, y las vivas usan
  exactamente un par de cada uno. Una décima tarjeta no puede estrenar una tercera
  redacción casi igual.
- ✅ **UN LINK ROTO DE LA VIEJA NO SE PORTÓ: las nueve enlazan
  `/frankonia-baustellenbewachung`, que responde 404 en vivo** (medido — sus siete
  hermanas responden 301). Apuntar a `/baustellenbewachung/` lo arregla en vez de
  arrastrarlo. Anotado en el generador para que no parezca un descuido de mapeo.
- ⚠️⚠️ **`/bryan-van-wey-security/` NO es la Werkschutz-Karte con otro texto: su
  mail está en `frankonia-security.de` y su vCard firma "FRANKONIA Security GmbH &
  Co. KG"** — una TERCERA marca junto a `-sicherheit.de` y `-werkschutz.de`, que
  **no aparece ni una vez más en todo el proyecto** y tampoco en el Impressum.
  Publicado verbatim (es la Livekarte) y anotado como pregunta para el cliente, no
  reescrito por mi cuenta.
- ⚠️ **EL RETRATO DE VAN WEY ES EL NUEVO A PROPÓSITO, y la diferencia está medida.**
  Su Security-Karte usa `uploads/2023/12/Bryan-Van-Wey-Web_V2.png` y la
  Werkschutz-Karte `uploads/2025/12/Bryan-Van-Wey-Werkschutz-Web.png`: **desviación
  media 65,9 de 255**, o sea dos tomas distintas de la misma persona con dos años
  de diferencia. Las dos páginas llevan la de 2025 — dos fotos del mismo hombre en
  dos páginas del mismo sitio se lee como error, no como fidelidad.
- ⚠️ **LA TARJETA DE MORELO NO ES UNA PERSONA, ES UN PUESTO**, y eso costó dos
  campos opcionales en el template (`portrait` y `tel`), no una variante nueva:
  la Livekarte no tiene retrato (su única imagen es un bild de empresa en el
  JSON-LD, o sea ninguna visible), tiene sólo móvil y no tiene cred.
  ✅ **Sin retrato el layout no necesitó una regla**: `.person__inner` es una
  columna flex, así que el `<h1>` sube y no queda hueco. Verificado en captura, no
  deducido.
- **Los 3 retratos y las 6 vCards son archivos DEL CLIENTE sin editar** — las
  vCards con dirección, fax, URL de trabajo y foto embebida; generarlas acá habría
  perdido campos. ⚠️ **Chequeado el caso del typo de Jäger: en las seis, la
  `TITLE` de la vCard coincide con la función que muestra su página.** Los retratos
  se re-codificaron con el mismo perfil que los existentes (**49KB PNG / 11KB
  WebP**, contra 49/12 de los tres viejos) y ya venían 350x350, así que no se
  escaló ni se recortó nada.
- ⚠️ **`BEWUSST_404` es una LISTA PROPIA en `redirect-test.js`, no se derivó de
  `NICHT_UMLEITEN`.** Ahí conviven dos clases de URL (404 deliberados y direcciones
  que existen en las dos versiones del sitio), y una prueba que adivina la
  intención de esa mezcla deja pasar el próximo caso real. Lleva además
  contra-prueba: si una de esas dos vuelve a ser alcanzable, lo reporta.
- **Medido: `redirect-test.js` en 0 problemas** — 31 URLs fuente, 18 que no deben
  redirigirse (0 falsamente capturadas), y **41 direcciones de la vieja: 22
  redirigidas, 17 presentes sin cambio, 2 gewollt 404, 0 huérfanas** (antes 2).
  Las 11 páginas de persona/puntero: **1 `<h1>` cada una, sin saltos de nivel,
  `noindex,follow` en las 11, ninguna en el sitemap, cero JS de motion, cada archivo
  enlazado presente, CERO links internos muertos**, títulos ≤57 y descripciones
  ≤124 caracteres. Capturas revisadas a 1440 y 390 (Walde y MORELO).
- ⚠️ **Trampa de medición, mía: la sonda contó "2 mailto" en las nueve y no era
  nada** — el footer tiene el suyo. Los contadores de la tarjeta hay que medirlos
  **dentro de `<main>`**; el `tel:` ya estaba tratado así y el `mailto:` no.
- ⚠️ **Trampa de entorno, la de siempre y dos veces hoy: un backtick dentro de un
  template literal** rompió el script de parcheo con un mensaje que no lo nombra
  (`... is not a function`), y **un heredoc de bash se comió un nivel de
  backslash**, dejando `[\s\S]` como `[sS]` → "Invalid regular expression flags".
  Para contenido con comillas y regex, el Write tool en vez del heredoc.

**2026-08-25 — KUNDENRUNDE: DAS GOOGLE-BADGE IST EIN LINK (42 Seiten), DIE DREI
LETZTEN NAMEN IM KUNDENBAND HABEN EIN LOGO, UND DER vCARD-TIPPFEHLER IST WEG.**

- [x] **Badge → Link auf allen 42 Seiten**, nicht nur der Startseite: es war überall
      dasselbe Bauteil. `.review-card` war schon `inline-flex`, also verhält sich ein
      `<a>` identisch — Form und Maße unverändert, EINE neue Regel für Zeiger und
      Tastatur. ⚠️ **Kein Unterstrich und keine Farbänderung**: Ziffern und Sterne
      sind die Marke Google. Der Zustand läuft über Deckkraft (funktioniert auf
      beiden Untergründen, weil er keine Farbe voraussetzt), der globale Fokusring
      bleibt der nicht-farbliche Hinweis.
      ⚠️ **Nur die `--sm`-Variante.** Das große `.review-card` in den Kundenstimmen
      bleibt ein `<div>` — dort ist die Karte ein Zitat, kein Verweis.
      ⚠️ **URL ist der Kurzlink des Kunden**; die Knowledge-Graph-ID dahinter steht
      als Ausweichlösung im Kommentar, falls Google solche Kurzlinks austauscht.
- [x] ⚠️⚠️ **DIE TINTENMESSUNG IST PRO LOGO VERSCHIEDEN, und das ist der Kern von
      `docs/design-sources/client-logos.js`.** Alle Logos im Band sind weiße
      Silhouetten (nachgemessen an den bestehenden: reines Weiß mit Alpha, 160px
      hoch) — anders geht es nicht, weil die Sektion dunkel ist und die Lichtvariante
      `filter: invert(1)` benutzt, was nur bei einfarbigen Zeichen funktioniert.
      · **Norma** ist ein WEISSER Schriftzug in einem roten Kasten → Alpha =
        Weißheit, der Kasten fällt weg. Eine Silhouette des Kastens mit
        ausgestanzten Buchstaben wäre das Gegenteil der Marke.
      · **Schöner Leben / nacht arena** sind dunkel auf weiß → Alpha = Farbdeckung,
        `255 - min(R,G,B)`. ⚠️ **NICHT `255 - Helligkeit`**: der orange Schriftzug
        unter dem Wortzeichen hat mittlere Helligkeit und wäre danach halb
        durchsichtig, also blasser als der Rest DESSELBEN Logos.
- [x] ⚠️⚠️ **ZWEI FEHLER, DIE ERST DIE MESSUNG GEZEIGT HAT:**
      1. **Flachlegen auf Weiß ruinierte Norma.** Die Quelle ist ein PNG mit
         Transparenz, und flachgelegt wird der transparente Rand zu Weiß — also zu
         Tinte, weil bei diesem Fall Weiß die Tinte IST. Der Zuschnitt umfasste
         danach das ganze Bild statt des Schriftzugs (2000x750 statt 1895x410).
         Flachlegen passiert jetzt nur im dunklen Fall.
      2. **Auf den Höchstwert normalisieren brachte fast nichts.** Bei Schöner Leben
         liegt die Masse des Wortzeichens bei Deckung 169, ein paar JPEG-Artefakte
         aber bei 186 — Faktor 1,37, die Marke blieb bei 232 statt 255, gemessen
         **55 volldeckende Pixel in einem 646x160-Logo**. Bezug ist jetzt das **90.
         Perzentil** der Tintenpixel, also der Flächenton der Marke. Im Kontaktblatt
         gegen die bestehenden Logos verglichen, nicht nur gerechnet.
- [x] ⚠️⚠️ **DIE BANDGESCHWINDIGKEIT MUSSTE NACHGERECHNET WERDEN, und das ist die
      Falle, die dieses Archiv schon zweimal dokumentiert: eine Dauer ist keine
      Geschwindigkeit.** Ein Logo ist breiter als ein getippter Name, also wuchs die
      Strecke pro Umlauf — bei gleicher Dauer heißt das schneller. Gemessen nach der
      Umstellung: **10,08 / 11,49 / 11,93 px/s**. Die Baustellenreihe hat sich nicht
      geändert, also war ihre 11,49 der Maßstab. Neu: **objektschutz 270→237s,
      veranstaltung 228→237s** (beide Halbstrecken sind jetzt identisch 2721px),
      mobil **190→162s** und **164→167s**.
      **Nachgemessen bei 1440 und 390: 11,48–11,61 px/s in allen sechs Fällen**,
      Überhang überall positiv (also kein Sprung im Umlauf) und die Gruppenzahl je
      Reihe weiter GERADE (2 / 6 / 4) — die halbe Strecke muss auf eine
      Gruppengrenze fallen.
- [x] **`.ref-marquee__name` GELÖSCHT statt als toter Selektor stehen gelassen** (die
      Regel und ihre zwei Nebenvorkommen). Sie beschrieb einen Zustand, den es nicht
      mehr gibt; die Git-Historie hat sie, falls wieder eine Firma ohne Logo dazukommt.
- [x] **Verifiziert**: 42 Badges als Link, 0 als `div`, kein verschachtelter Link,
      Hinweistext auf allen 42, `norma`/`schoener-leben`/`nacht-arena` je 2/2/4 Bilder
      im Markup, 0 verbleibende Namensfelder. Kontaktblatt und Live-Ausschnitt
      angesehen.
- [x] **vCards: Tippfehler in der Berufsbezeichnung** in beiden Dateien behoben, nach
      Bestätigung des Kunden. Die Seiten sagten es schon richtig.

- [ ] 🟡 **Nebenbefund, nicht angefasst: im Band 768–1023px laufen alle drei Reihen
      langsamer** (7,9–9,5 px/s), weil dort die Mobil-Dauern noch nicht greifen, die
      Strecken aber schon schmaler sind. Vorbestehend, unabhängig von dieser Runde,
      und mit einem dritten Dauern-Satz zu lösen.


**2026-08-23 — BLOQUE K: LA ESTRUCTURA DE VACANTES EXISTE Y NO RENDERIZA NADA.**
`content/vacancies.json` (vacío), un renderer en `build.js`, dos marcadores en
`pages/jobs.html` y el CSS de `.jobs-openings*`. **`/jobs/` no cambió ni un byte.**

- [x] **Sin `JobPosting`, y eso es el punto**: no hay vacante real, y datos de
      JobPosting sin una vacante real violan las Rich-Results-Richtlinien de Google
      — una anuncio caducado o inventado no se ignora sin más, le cuesta al dominio
      su credibilidad para TODAS las futuras. Con el array vacío el renderer devuelve
      **cadena vacía**: ni sección, ni encabezado, ni schema.
- [x] ⚠️ **Es `content/vacancies.json`, no `data/vacancies.ts` como pedía el
      briefing**, y la razón es la misma que ya se aclaró para el stack entero: este
      proyecto es HTML estático sin dependencias, no hay TypeScript ni bundler. El
      patrón equivalente ya existe y se copió literal — `content/coverage.json` + un
      renderer con marcador de include en `build.js`.
- [x] ⚠️⚠️ **LA LISTA VA DENTRO DE UNA SECCIÓN EXISTENTE, NO EN UNA PROPIA, y eso es
      una decisión estructural.** Cada cambio de color de este sitio paga su banda de
      pixel-seam, y la sección siguiente reserva ese alto con un selector de hermano
      adyacente. Un renderer que emitiera una `<section>` nueva **desplazaría esa
      alternancia el día que entre la primera vacante** — una regresión de layout
      disparada por una edición de datos, sin nadie mirando. Dentro de una sección un
      array vacío es un no-op de verdad. Va en "Wen wir suchen", arriba de la
      escalera: primero lo que está abierto AHORA, después a quién se busca en
      general.
- [x] **El schema es un `<script>` aparte, no un nodo dentro del `@graph` de la
      página**: anexar significaría parsear y re-serializar ese JSON escrito a mano
      en cada build, y dos bloques son equivalentes para cualquier consumidor.
- [x] **El loader valida en voz alta y aborta el build**: los cinco campos
      obligatorios, `employmentType` contra la lista de schema.org, y las fechas
      contra `AAAA-MM-TT`. El riesgo entero de esta función es que una vacante a
      medio llenar llegue a Google. `validThrough` es opcional (lo es en el schema)
      pero está documentado como muy recomendable: sin él la oferta queda
      indefinidamente abierta a ojos de Google.
- [x] ✅ **PROBADO DE PUNTA A PUNTA, no deducido.** Con dos vacantes de prueba:
      **2 items en el markup, 2 nodos `JobPosting`, los dos bloques JSON-LD válidos**,
      `validThrough` omitido donde no existe, `summary` sólo donde existe, los labels
      alemanes correctos (`Bamberg · Vollzeit`, `Raum Nürnberg · Teilzeit`), anclas
      `#stelle-…` reales y `hiringOrganization` apuntando al nodo Organization que ya
      tenía la página. Captura revisada. Después se revirtió a vacío y **el
      `/jobs/` construido volvió a ser idéntico** al de antes del bloque
      (normalizando espacios).
      ⚠️ La única diferencia real que queda es **una línea con 8 espacios de sangría**
      donde estaba el marcador: el stripper de comentarios se lleva el comentario y
      deja la indentación de su línea. 9 bytes, cero efecto de render — se dejó
      así porque hacer que el regex del marcador se coma los saltos de línea es más
      riesgoso que eso.
- [x] ⚠️ **Bug propio encontrado midiendo: el título de cada vacante salía como `h3`,
      igual que el `h3` "Aktuell offene Stellen" que las agrupa** — o sea la
      agrupación era invisible para un lector de pantalla. Pasó a `h4`. Verificado en
      las 65 páginas: **cero saltos de nivel de heading**.
- [x] **El CSS de `.jobs-openings*` existe aunque hoy no lo use ningún markup**, y es
      deliberado: el pedido dice "dann ist die erste echte Stelle ein
      Ein-Zeilen-Commit". Sin CSS el primer anuncio saldría sin estilo y de una línea
      pasarían a ser dos commits. El lenguaje formal es el de la escalera de abajo
      (hairline entre items, no cards): dos formas de lista distintas en una sección
      se leen como dos secciones.
- [x] **Regresión del build medida en las 65 páginas** (el cambio toca `build.js`, o
      sea todas): 0 tokens sin resolver, 0 textos ajenos en el `<head>`, un solo
      `<h1>` por página, sin saltos de heading, sitemap con 58 URLs todas existentes,
      y el test de redirects sigue en 0 problemas.

- [ ] 🟡 **La primera vacante real es un objeto en `content/vacancies.json`.** El
      formato completo, campo por campo, está en el `_comment` del propio archivo.


**2026-08-23 — BLOQUE J: `/datenschutz/` DEJA DE SER UNA SHELL. Entra la
Übergangsfassung de la página viva, sale el `noindex`, y la URL entra al sitemap.**
`pages/datenschutz.html` + 4 reglas nuevas en `css/page-legal.css` + `sitemap.xml`.

- [x] **El texto es el de la página viva, palabra por palabra, y NO se transcribió a
      mano**: se extrajo por script del HTML servido (encabezados, párrafos y listas
      en orden de documento, con la agrupación `<ul>` conservada). En un texto legal
      un typo es un cambio de contenido.
- [x] **Dos ajustes estructurales, ninguno de texto**: los niveles h4/h5 pasan a
      h3/h4 porque la página ya tiene h1 y h2 y un salto de nivel va contra las
      reglas del proyecto (la misma desviación que `/impressum/` hace respecto de la
      página viva), y las direcciones de e-mail y el teléfono quedan enlazados.
- [x] ⚠️⚠️ **NO SE PUBLICARON LOS DOS ÚLTIMOS APARTADOS: "Google Analytics" y
      "reCAPTCHA".** Esta web no usa ninguno de los dos — no hay analytics, ni tag
      manager, ni reCAPTCHA, y la CSP de `vercel.json` es `script-src 'self'` sin un
      solo tercero. Publicarlos declararía un tratamiento que **no ocurre**: eso no es
      una cuestión de redacción sino una afirmación falsa en un documento
      jurídicamente vinculante. Vuelven cuando los servicios existan de verdad, junto
      con el banner de consentimiento y la declaración de Cookiebot.
- [x] ✅ **El bloque de Verantwortlicher ganó lo que la shell no tenía: el
      DATENSCHUTZBEAUFTRAGTE** (Michael Lang, con su e-mail), que el Art. 13 Abs. 1
      Buchst. b) DSGVO exige en cuanto hay uno nombrado. Y el responsable con nombre
      y su propia extensión.
      ⚠️ **La dirección postal se queda aunque el Impressum esté enlazado**, y no por
      simetría: el apartado 5.6 del texto remite a "unsere zu Beginn dieser
      Datenschutzerklärung aufgeführte Postadresse" — sin ese bloque la remisión
      apunta al vacío. **El bloque de contacto genérico anterior SALIÓ**: con el
      responsable y su extensión ahí, dos vías de contacto en paralelo dejan sin
      saber cuál vale para una solicitud de datos.
- [x] **`noindex` fuera y la URL en el sitemap** (priority 0.1, como el Impressum).
      El comentario del sitemap que decía "deliberately not listed" quedó actualizado
      en la misma edición, no colgando.
- [x] ✅ **DOS DEFECTOS DE ESTILO QUE APARECIERON AL IMPORTAR, arreglados en
      `css/page-legal.css` y medidos, no supuestos:**
      1. ⚠️⚠️ **LA JERARQUÍA ESTABA INVERTIDA: la h4 renderizaba 25px/700 y su propia
         h3 madre 20px/500** — o sea el subapartado se leía más importante que el
         apartado. La página nunca había tenido h4, así que caía a la regla base de
         headings, que además le daba el tracking de −1px reservado para tamaños
         display. Ahora 16px/600 con tracking normal.
      2. **Las listas no tenían viñeta ni sangría**: `reset.css` pone
         `list-style: none` en todo el sitio — correcto para navegación y grillas de
         cards, que es de lo que esta página constaba. Acá hay enumeraciones reales
         (qué datos se guardan, cuándo se ceden, qué derechos hay) y sin viñeta se
         leen como frases cortadas en fila. En un texto legal eso es pérdida de
         comprensión, no un detalle estético.
      **Verificado que `/impressum/` no se movió** (comparte `.legal-doc`): su `<dl>`
      de datos registrales renderiza igual y no apareció ninguna viñeta.
- [x] **Medido: 0 tokens sin resolver, un solo `<h1>`, sin saltos de nivel, sin
      scroll horizontal, columna de 704px.** Y en las 65 páginas: 58 indexables, 7
      con `noindex` (las de persona del Bloque E), **cero páginas noindex en el
      sitemap y cero indexables fuera de él**.

- [ ] ⚠️⚠️ **TRES ERRORES EN EL TEXTO DEL CLIENTE, NO CORREGIDOS por instrucción
      explícita** ("Ändere keine bestehenden Webtexte inhaltlich… notiere ihn im
      Bericht"). Los tres están en el prüfprotokoll:
      1. El apartado 5.1 invoca **"die Verschwiegenheitspflicht gem. § 83 StBerG"** —
         el Steuerberatungsgesetz. Es un módulo de una plantilla para asesores
         fiscales; para un prestador de seguridad la norma no aplica.
      2. El segundo subtítulo del apartado 2 dice **"2.1 Aufruf der Webseite"** otra
         vez, aunque debajo se describe el formulario de contacto. Debería ser
         "2.2 Kontaktformular".
      3. El apartado 6 declara como Stand el **18.05.2018**.
- [ ] ⚠️ **LO QUE EL TEXTO NO CUBRE y el definitivo necesita**: las teselas de mapa
      de **CARTO** en `/` y `/kontakt/` (una llamada a un tercero que transmite la IP
      del visitante), los **datos de candidatura incluido el upload de CV** en
      `/jobs/`, y la **reserva de citas de HubSpot** enlazada desde
      `/sicherheitscheck-walde/`. Los tres los va a encontrar el scanner.
- [ ] ⚠️ **Cuando llegue el scanner sigue vigente el aviso viejo: la CSP lo va a
      bloquear.** `script-src 'self'` sin terceros, así que un scanner servido como
      `<script>` externo se bloquea en silencio. Hay que agregar su host, y
      `connect-src` si además baja su texto en runtime.


**2026-08-23 — BLOQUE G: 58 REDIRECTS EN `vercel.json`, Y NINGUNA DE LAS 31 URLS
VIEJAS QUEDA HUÉRFANA.** `vercel.json` + dos scripts nuevos en
`docs/design-sources/` (`redirects-build.js`, `redirect-test.js`). **Cero cambios de
markup y cero CSS.**

- [x] **58 reglas = 27 URLs de origen × 2 variantes + las 4 de `/en`.**
- [x] ⚠️⚠️ **CADA URL NECESITA DOS REGLAS, con y sin barra final, y eso es lo único
      que impide una CADENA.** Con `trailingSlash: true` Vercel manda `/foo` a
      `/foo/` con su propio 308 y **después** entra la regla propia: dos saltos. Y
      "las cadenas son el problema más habitual de esta migración" es literalmente
      el punto G6 del pedido. Es la misma razón por la que las 4 reglas de `/en`
      están así desde el 2026-08-14.
- [x] **Por eso hay generador**: `docs/design-sources/redirects-build.js` tiene UNA
      tabla y emite las dos variantes. Mantener 54 entradas a mano es garantizar que
      un día divergen. ⚠️ Corre en desarrollo, **no** en `npm run build`, y
      **sobreescribe la lista `redirects` entera** — una edición a mano ahí se pierde.
- [x] ⚠️ **La URL del § va en TRES escrituras**: `%c2%a7` (como la publica la sitemap
      viva), `%C2%A7` (otros clientes codifican en mayúscula, y una regla literal
      sólo matchea su propia escritura) y el `§` decodificado, porque no está
      garantizado si Vercel matchea el path crudo o el decodificado. Las tres apuntan
      al mismo destino, así que cualquiera de los tres caminos funciona.
- [x] **G3 refleja la decisión del Bloque F, no el fallback del pedido**: los 4
      portados van a su propia versión nueva y los 4 no portados al artículo
      existente que cubre su tema. ⚠️ En particular `tariflohn-2026` va a
      `/ratgeber/tariflohn-sicherheitsdienst/` y **no** a `kosten-sicherheitsdienst`
      como decía el fallback — ese artículo es del lado CLIENTE y el viejo es del
      lado bewerber.
- [x] ⚠️⚠️ **`/wp-content/*` NO se redirige, y es una decisión, no un olvido.** El
      pedido lo dejaba condicional ("410 o `/`, sólo si ya no se necesitan assets").
      Redirigir la URL de una imagen a una página HTML es un soft-404: Google lo
      trata peor que un 404 limpio y no recupera nada de tráfico. Y un 410 real no se
      puede emitir desde `redirects` de `vercel.json`. **404 es la respuesta
      correcta y es lo que ya hace el hosting sin ninguna regla.** Los assets nuevos
      viven todos bajo `/assets/`, así que no hay nada que rescatar de ahí.
- [x] ⚠️ **`/wp-admin/` y `/wp-login.php` sin regla, por instrucción explícita.**
      **Verificado que ninguna de las 58 reglas los captura** — el test lo comprueba,
      porque un wildcard mal puesto los habría tragado en silencio.
- [x] ⚠️ **G5 no está en el código a propósito**: www → dominio pelado va en la
      configuración de dominios de Vercel (en código recién actuaría después de que
      la petición llegue a la función). HTTP → HTTPS lo hace Vercel solo.
      `trailingSlash: true` ya estaba.
- [x] ✅ **`/comments/feed` está declarado explícitamente aunque el wildcard
      `/:path*/feed` ya lo cubre** — el pedido lo nombra aparte y una regla de más es
      inofensiva (gana la primera que matchea). El wildcard es lo que atrapa los
      `/cualquier-cosa/feed/` que WordPress servía por página y por categoría.
- [x] **Los wildcards van DESPUÉS de todas las reglas exactas**, porque gana la
      primera coincidencia.

- [x] ✅ **EL RESULTADO QUE IMPORTA, medido: de las 31 direcciones de la sitemap
      vieja, 18 se redirigen, 13 existen con el MISMO path en la nueva, y CERO
      quedan huérfanas.** Las 13 son la home, baustellenbewachung,
      veranstaltungsschutz, jobs, angebot, referenzen, linktree y las 6 páginas de
      persona — o sea lo que el Bloque E reconstruyó a propósito bajo su URL original.
      **La lista del cliente estaba completa**; lo único que faltaba contar era el
      Bloque E.
- [x] **`docs/design-sources/redirect-test.js`, y prueba cuatro cosas distintas:**
      que cada URL vieja pega en exactamente una regla y con el destino esperado (con
      y sin barra), que **ningún destino es a su vez origen** (cadenas), que cada
      destino **existe en `dist/`** (redirect a un 404), y que las URLs que deben
      quedarse quietas no las captura nadie. **27 URLs, 16 intocables, 31 de la
      sitemap vieja: 0 problemas.**
      ⚠️ **Su lista de expectativas está escrita aparte y NO sale de `vercel.json`** —
      un test que deriva su expectativa del objeto que prueba no prueba nada.
- [x] ⚠️⚠️ **NO SE PUEDE PROBAR EN VIVO ANTES DEL DEPLOY, y no es pereza: `npm run
      dev` sirve `dist/` y no lee `vercel.json` en absoluto.** Los redirects son
      configuración de hosting. El test acepta una URL base
      (`node docs/design-sources/redirect-test.js https://…`) y entonces sí verifica
      **exactamente un 301 por URL** siguiendo la cadena real y que `/wp-admin/` da
      404. **Hay que correrlo una vez contra el preview.**
- [x] ⚠️ **El matcher del test es una reimplementación MÍNIMA de path-to-regexp**
      (sólo literales y `:name*`, que es todo lo que estas reglas usan). Demuestra que
      las reglas pegan y que no pegan donde no deben; **no** demuestra que Vercel
      compile la misma regex. Para eso está la pasada en vivo.

- [ ] ⚠️ **PARA EL CLIENTE, decisión suya y NO aplicada:** los permalinks viejos de
      WordPress con query (`/?p=123`) no están cubiertos. Vercel puede matchear query
      con `has`, pero el pedido no los menciona y no hay lista de ids. Si aparecen en
      Search Console después del cambio, son unas reglas más.
- [ ] 🟡 **`/kundenstory-kunde-1/` va a `/referenzen/` como pedía el pedido**, aunque
      su contenido (técnica como complemento del personal) tiene vecino temático en
      `/referenzen/case-study-sicherheitstechnik/`. Se dejó el hub: la historia vieja
      es anónima y la case study es de un cliente concreto, o sea el lector aterrizaría
      en otra historia. Cambiarlo es una línea.


**2026-08-23 — BLOQUE F: DE LOS 8 ARTÍCULOS DEL BLOG VIEJO SE PORTARON 4, LOS OTROS
4 SON SÓLO UN 301.** `pages/ratgeber/{bewerbung,tariflohn,voraussetzungen,
qualifikationen}-sicherheitsdienst.html`, más 4 cards en el hub, 4 URLs en el
sitemap y **una sola regla nueva de CSS** (`.rg-table--four`).

- [x] **Los 8 se bajaron de la página viva y se leyeron enteros.** La sitemap viva
      confirma que son exactamente esos 8 posts, no hay un noveno.
- [x] ⚠️⚠️ **LA DECISIÓN DEL BLOQUE ES NO PORTAR 5 DE LOS 8, y sale de una matriz de
      afirmaciones, no de los títulos.** Cinco de los ocho tratan el mismo cluster
      —Unterrichtung / Sachkunde / GSSK— desde cinco ángulos, y **tres de esos
      ángulos ya están literalmente en `paragraph-34a-erklaert`**: los 400–500 €, las
      40 horas, "sin examen", Türsteher/Ladendetektiv y el formato de la
      Sachkundeprüfung. Portar los cinco habría dejado **seis páginas peleando por un
      keyword**. Los que se quedan fuera: jobchancen, einsatzmoeglichkeiten,
      so-schwierig (→ 34a) y fortbildung (→ el artículo nuevo de qualifikationen).
      **Su sustancia no se perdió**: el formato de examen de la GSSK y la horquilla de
      precios de los cursos se incorporaron al artículo portado.
- [x] ⚠️ **ABGRENZUNG QUE HAY QUE MANTENER:** `paragraph-34a-erklaert` es dueño de
      "qué es el § 34a y qué me PERMITE"; `qualifikationen-sicherheitsdienst` de
      "cuánto dura, cuánto cuesta, qué tan difícil, y GSSK". Está anotado en la
      cabecera de la página nueva — **quien agregue ahí Einsatzbereiche construye
      canibalización**.
- [x] **Ansprache "du" en los cuatro**, como todo tema de carrera (`/jobs/` y el
      artículo del 34a). Los textos viejos eran impersonales, así que había que
      elegir un lado.
- [x] **Re-datados al día del build** (2026-08-23), en el byline visible, en
      `datePublished`/`dateModified`, en la card del hub y en el sitemap — cuatro
      lugares por artículo, hay que moverlos juntos si el livegang se corre.

- [x] ⚠️⚠️ **DOS ERRORES DE HECHO DEL TEXTO VIEJO, CORREGIDOS CON FUENTE:**
      1. **"cinco años de experiencia, en buena parte en el sector"** → la
         Rechtsvorschrift pide **mínimo TRES años en la Sicherheitswirtschaft** de
         esos cinco. "Buena parte" es indeterminado y se lee generoso: en una
         pregunta de admisión eso le cuesta a alguien la inscripción.
      2. **La Sachkunde oral no dura "unos 20 minutos" sino ~15** — que es además lo
         que ya dice `paragraph-34a-erklaert`, o sea las dos páginas se habrían
         contradicho. Verificado también el escrito: **120 minutos**.
      **Verificados y confirmados**: GSSK 24 años, 2 años tras Ausbildung,
      Erste-Hilfe ≤ 24 meses, 3 Handlungsbereiche, oral 30–40 min, Ergänzungsprüfung
      ≤ 20 min.
- [x] ⚠️ **NO VERIFICABLE, y por eso va marcado como Richtwert en la página**: la
      tasa de examen de la GSSK (Schwerin publica 405 €, el texto viejo decía ~450),
      los cursos de 1.600–4.000 €, los 200–240 UE / 5–7 meses, y los 150–180 min por
      parte escrita — **la vorschrift dice ≥2h por tarea y ≤5h en total**, así que en
      la página está la norma y no la práctica de los proveedores.
- [x] ⚠️ **Las horquillas de Unterrichtung (400–500 €) y Sachkunde (160–200 €) son
      LAS DEL ARTÍCULO EXISTENTE, no los valores sueltos del blog (450 / 160):** dos
      ratgeber con precios distintos para el mismo examen es peor que una horquilla
      imprecisa.
- [x] ⚠️⚠️ **`tariflohn-2026` NO TENÍA UNA SOLA CIFRA DE SUELDO** pese al título y a
      su meta description ("So viel verdienst du 2026"). **El año salió del slug y
      del título** y la description dice lo que el artículo realmente entrega. **No
      se inventó ninguna cifra.** Las únicas cifras del artículo son los **recargos
      tarifarios, y salen de `content/values.json`** (regla G10) — mismos valores,
      misma fuente (BDSW) y misma formulación que `kosten-sicherheitsdienst`, así
      que el lado cliente y el lado bewerber no pueden divergir.
      ⚠️ **Los tokens van en las DOS copias de la FAQ, también dentro del JSON-LD** —
      el build los resuelve ahí igual (lo hace ya `kosten-sicherheitsdienst`), así que
      el par sigue idéntico solo tras un acuerdo tarifario nuevo. Escribir la cifra a
      mano rompería la paridad en silencio.

- [x] ✅ **LA TABLA DE 4 COLUMNAS NO NECESITÓ CSS NUEVO PARA FUNCIONAR — pero sí para
      funcionar BIEN, y eso lo dijo la medición.** Las dos reglas de ancho existentes
      (`tbody th: 26%` y `td:first-of-type: 22%`) están calibradas para una tabla de
      DOS columnas de datos; con tres, la columna de etiquetas se queda 26 % para
      palabras como "Dauer" mientras la celda más larga va apretada a 194px.
      `.rg-table--four` baja la etiqueta a 20 % y **resetea el 22 % a `auto`** (esa
      regla existe para proteger una columna de PRECIO, que esta tabla no tiene).
      **Medido a 1440: 183/155/172/194 y 607px de alto → 141/159/187/217 y 559px.**
      El layout apilado de teléfono no necesitó nada: cada celda anuncia su propio
      `data-label`.
      **Verificado que la tabla del 34a quedó byte-idéntica** (183/170/351, 487px).
- [x] **Medido en los 4 artículos + el hub a 320 / 390 / 640 / 768 / 900 / 1024 /
      1440 / 1920** (48 corridas): **sin scroll horizontal, nada fuera del viewport,
      un solo `<h1>`, sin saltos de nivel de heading**, el marco reservado en
      **ratio 1,778 exacto** en todos los anchos, y **el hero y la columna del
      artículo con el MISMO ancho y el MISMO borde izquierdo** (704@361 a 1440) — que
      es el invariante que la cabecera de `.rg-hero` exige.
- [x] **Contraste medido sobre el render, no deducido** (con `color-mix` parseado
      como `color(srgb …)`, la trampa que este archivo ya documenta): lo más bajo es
      **4,60:1** (quelle, hinweis y respuestas de FAQ), links de prosa **4,90:1**,
      cuerpo 6,03, H2 y lede 20,87. **Cero por debajo de 4,5:1.**
- [x] **Con `prefers-reduced-motion`: 0 elementos ocultos y 0 tiles** en los cuatro.
      Con motion: 2 seams × 180 tiles y el estado pre-scroll normal — **medido
      también en los dos artículos existentes y da el mismo patrón** (282 y 336), o
      sea no hay regresión.
- [x] **FAQ visible ↔ `FAQPage`: 4/4 byte-idénticas en los 7 artículos.** Sitemap 57
      URLs. Hub con 7 cards. **Fremdtext en el `<head>`: 0 de 65 páginas** (el guard
      del defecto del 21-08 sigue verde).

- [ ] ⚠️ **HACEN FALTA 4 FOTOS, y por eso hay 4 marcos RESERVADOS** (no imágenes
      placeholder — es el patrón documentado, y los tres artículos existentes
      salieron así el 17-08 y el cliente mandó las fotos después). 16:9, mínimo
      1600x900: **Bewerbungsgespräch · Dienstplan/Abrechnung · Anmeldeunterlagen ·
      Lernsituation im Kurs**. Sacar los cuatro marcos son 2 líneas de markup por
      página y cero CSS.
- [ ] 🟡 **El hub queda con 7 cards, o sea 3+3+1 y una card sola en la última fila.**
      Se dejó a propósito: el arreglo de "fila huérfana" que este proyecto usa dos
      veces es para bloques de cantidad FIJA y semántica (5 Einsatzfelder, 6
      promesas); una lista de artículos crece, y cualquier regla que centre la
      huérfana optimiza para exactamente 7. Revisado en captura: se lee como índice
      de artículos.
- [ ] 🟡 **El byline sigue muy pegado a la última línea del H1**, ahora en 7
      artículos en vez de 3. Es el pendiente cosmético que este archivo ya anotaba el
      17-08, no una regresión de esta pasada.
- [ ] 🟡 **Pendientes compartidos que estas 4 páginas heredan** (idénticos a los
      artículos existentes, medidos): el `<summary>` de la FAQ mide 34–40px y
      `.service-link` 29px contra el mínimo táctil de 44.

- [ ] ⚠️ **PARA EL BLOQUE G — los 4 redirects que sustituyen a los artículos no
      portados**, más los 4 portados: jobchancen / einsatzmoeglichkeiten /
      so-schwierig → `/ratgeber/paragraph-34a-erklaert/`, fortbildung →
      `/ratgeber/qualifikationen-sicherheitsdienst/`. ⚠️ **La URL de so-schwierig
      lleva `%c2%a7` (el §) codificado** — hay que probarla codificada y sin codificar.
- [ ] ⚠️ **HALLAZGO PARA EL BLOQUE G, de la sitemap viva: hay 4 páginas viejas que no
      están en la lista de redirects** — `/sicherheitsanalyse/`,
      `/kundenstory-kunde-1/`, `/kundenstory-kunde-2/` (las tres devuelven 200) y
      `/veranstaltungsschutz/`, que **ya coincide con el slug nuevo** y por eso no
      necesita regla.

- ⚠️ **Dos trampas de entorno de esta máquina, las dos nuevas:**
  1. **`npm run build` falla con `EPERM` sobre `dist/` si un server de prueba tiene
     ahí su cwd.** `rmSync` no puede borrar un directorio que otro proceso tiene
     abierto. El server hay que levantarlo **desde afuera** y pasarle la raíz como
     argumento.
  2. **El scratchpad de la sesión se vació a mitad del trabajo** y se llevó los
     scripts de medición. Los resultados ya estaban en el hilo, pero conviene volver
     a escribir la sonda en vez de asumir que sigue ahí.


**2026-08-23 — BLOQUE E: LAS 7 PÁGINAS DE PERSONA / PUNTERO, EN SUS URLS
ORIGINALES.** Reconstruidas, no redirigidas: están impresas en tarjetas y códigos QR.
Generador `docs/design-sources/person-pages.js` + `css/page-person.css`.

- [x] **Copy verbatim de la página viva** (leída el 2026-08-23, URL por URL):
      nombres, funciones, los DOS teléfonos de cada persona, las líneas de
      cualificación IHK y el claim de Bryan Van Wey. **Sólo se reescribieron los
      DESTINOS**: las URLs viejas llevaban prefijo `frankonia-`. Se escriben
      directas a las nuevas — un link interno no debe gastar un salto.
- [x] ⚠️ **EL CTA PRINCIPAL ES UN vCard, no un formulario**, y eso hace que estas
      páginas queden FUERA de la regla G2 a propósito: G2 ordena el par
      oferta/teléfono de un hero de SERVICIO. En una tarjeta de visita la acción
      primaria es guardar el contacto.
      Las 5 vCards se **re-hostean tal cual**: son los registros del cliente, con
      dirección, fax, URL de trabajo y (en 4 de 5) foto embebida. Generarlas de
      nuevo habría perdido campos en silencio.
- [x] ⚠️ **`vercel.json` necesitó una regla de Content-Type para `.vcf`.** Sin
      declararlo se sirve como `application/octet-stream` y iOS ofrece "descargar
      archivo" en vez de "añadir contacto" — que es justamente para lo que existe
      el QR en una tarjeta impresa.
- [x] ⚠️ **LOS RETRATOS SALEN DE LA PÁGINA VIVA, NO DE LOS SHOOTINGS.** Los
      carpetas de estudio sólo tienen previews numeradas, o sea había que adivinar;
      la página viva tiene exactamente la cara que está impresa en la tarjeta, y
      las tres son el MISMO recorte circular del mismo shooting, así que las tres
      fichas se leen como un juego. `Alexander-Jaeger.png` y `-1.png` son
      byte-idénticas (md5), así que un archivo sirve a sus dos páginas.
      Van como **WebP + PNG, no JPEG**: el círculo es blanco opaco con esquinas
      TRANSPARENTES, y un fallback JPEG no lleva alfa — sin él las esquinas
      saldrían cuadradas y blancas sobre esta página oscura.
- [x] ⚠️ **SIN JAVASCRIPT DE MOVIMIENTO en las 7**: ni GSAP, ni ScrollTrigger, ni
      Lenis, ni hero-reveal. Toda otra página carga ese stack; acá serían ~50KB de
      JS de terceros delante de un número de teléfono, para alguien parado en un
      estacionamiento con una tarjeta en la mano. El chrome sólo necesita
      `js/main.js`, que sigue llegando por head-common.
- [x] **`noindex, follow` en las 7 y NINGUNA en el sitemap** (verificado sobre el
      build). Son delgadas y personales: indexadas competirían con las páginas de
      servicio reales. Siguen alcanzables, que es el punto del QR.
- [x] **Medido sobre el build: 0 problemas** — un solo `<h1>` por página, canonical
      correcto, cero tokens sin resolver, **cero destinos o assets faltantes** entre
      todos los links de las 7, las 5 vCards parsean, y la regla de `.vcf` está en
      `vercel.json`.

- [ ] ⚠️ **TIPO EN LAS vCARDS DEL CLIENTE, no corregido:** las dos de Jäger dicen
      `TITLE:Vetriebsleiter` (falta una "r"). Eso entra así en la agenda de todos
      los que escaneen la tarjeta. En la PÁGINA dice bien "Vertriebsleiter" — es
      sólo el archivo. Son dos líneas.
- [x] ⚠️⚠️ **CORRECCIÓN A MI PROPIA NOTA DEL BLOQUE E, hecha al abrir el Bloque G: el
      link de Baustellenbewachung NO necesita redirect y mi nota anterior estaba
      EQUIVOCADA.** Escribí que la página viva de Marco Bayer enlazaba
      `/frankonia-baustellenbewachung` y que esa URL faltaba en la lista de G1.
      Medido contra la fuente viva: el `href` real es **`/baustellenbewachung/`, sin
      prefijo**, y `/frankonia-baustellenbewachung/` **devuelve 404** en la página
      viva, o sea nunca existió. `/baustellenbewachung/` es además exactamente el
      slug que ya tiene la página nueva, así que la URL vieja **sigue funcionando
      sola** y un redirect ahí sería una regla que no puede disparar.
      ⚠️ **Es la misma lección de siempre en otra forma: no deduje esa URL del
      `href`, la deduje del PATRÓN de las otras siete.** Baustellenbewachung y
      Veranstaltungsschutz son las dos únicas páginas de servicio viejas que nunca
      llevaron el prefijo — el `page-sitemap.xml` vivo lo confirma, y las dos ya
      coinciden con el slug nuevo.
- [ ] 🟡 **No enlazados a propósito**: la vacante de Büromanagement en la subdomain
      jobs (el cliente la confirmó vencida el 22-08) y el ancla
      `/#dienstleistungen`, que apuntaba a un id de sección que no existe en el
      homepage nuevo.
- [ ] 🟡 `/kontakt/` escribe "Home" en su breadcrumb y todas las demás
      "Startseite". Copy existente, sólo anotado.

**2026-08-23 — ⚠️⚠️ DEFECTO PROPIO QUE ESTUVO VIVO EN LAS 61 PÁGINAS DOS DÍAS, Y LA
LECCIÓN DE MEDICIÓN QUE LO PERMITIÓ.**

- [x] **En la pasada de social-share del 21-08 escribí, DENTRO de un comentario HTML
      de `partials/head-common.html`, el marcador de include CON sus delimitadores.**
      El `-->` que contiene cierra el comentario antes de tiempo, así que el resto
      de la nota se imprimió como TEXTO VISIBLE arriba de todo, en las 61 páginas.
      ⚠️ **Este archivo ya documentaba exactamente esta trampa** (2026-08-14,
      `partials/sk-doc.html`, con la instrucción literal "referirse al marcador por
      nombre, nunca escribirlo con sus delimitadores"). Documentarla no alcanzó.
- [x] ⚠️⚠️ **POR QUÉ SOBREVIVIÓ TRES COMMITS: TODAS MIS VERIFICACIONES LEÍAN LOS
      META TAGS Y MIS CAPTURAS EMPEZABAN DEBAJO DEL HEADER.** El texto salía ARRIBA
      de la página, y ningún recorte lo incluía. Apareció recién al renderizar una
      página nueva completa.
      **Regla que queda: después de tocar `head-common.html` o cualquier partial
      compartido, mirar el BORDE SUPERIOR de una página renderizada.**
- [x] **Arreglado y verificado: 0 de 61 páginas con texto ajeno en el `<head>`.** Hay
      ahora una sonda que caza las dos formas del defecto — un `<!--` anidado en las
      fuentes y prosa suelta en el `<head>` del build.
      ⚠️ **La primera versión de esa sonda reportó 61 de 61 y era un falso positivo:
      contaba el contenido de `<title>`,** que es texto legítimo dentro de `<head>`.
- [x] ✅ **Hallazgo lateral, arreglado como corresponde:** el chevrón del breadcrumb
      era invisible en las páginas nuevas porque su regla vivía en
      `page-service.css`, que ellas no cargan — y sin pintar, además, conservaba un
      ancho por defecto que abría un hueco entre los dos crumbs. La regla ya existía
      **DOS veces byte-idéntica** (page-service y page-contact), o sea la promoción
      estaba vencida por la propia regla del proyecto. Ahora está **una vez en
      `components.css`** y las dos copias se borraron. Breadcrumbs contrastados en
      los cuatro tipos de página.


**2026-08-23 — BLOQUE D: NAV, BADGE DE GOOGLE Y FOOTER.** Tres cosas
independientes, y la primera destapó un defecto real de layout.

- [x] **D1 — la Startseite entra al nav como PRIMER ítem**, en las 54 páginas.
      `initActiveNavLink()` no necesitó una línea: compara `link.pathname` con la
      ruta actual, y para `href="/"` eso es cierto en el homepage y falso en toda
      página interior. El drawer móvil renderiza la misma lista, así que viene
      gratis.
- [x] ⚠️⚠️ **EL SÉPTIMO ÍTEM ROMPIÓ EL NAV Y LA CAUSA NO SE VE MIRANDO LA FILA:**
      a 1418px "Über uns" pasaba a DOS líneas (36x61 en vez de 65x36, medido).
      No era falta de lugar en el header — sobraban ~120px a cada lado. Es que
      `.site-nav__list` es `position: absolute; left: 50%`, así que su ancho
      shrink-to-fit está capado por **la mitad** del header (709px a 1418) aunque
      el `translate(-50%)` después lo centre. Siete ítems más seis gaps de 32px
      miden 731. Al ser `flex-wrap: nowrap` la fila no podía envolver, así que el
      ítem más comprimible absorbió la diferencia partiéndose.
      **Arreglado con `width: max-content`.** Medido a viewport 1400 / 1418 / 1490
      / 1578 / 1898: **una sola línea en los cinco**, y en el más angosto quedan
      95px de aire al logo y 99 al CTA. **Un OCTAVO ítem tiene que re-medir eso.**
- [x] **D2 — el badge de Google pierde la pastilla**: sin relleno, sin radio, sin
      sombra, sin padding. Está en **42 páginas** y como card blanca elevada se
      leía como un BOTÓN al lado del CTA primario.
- [x] ⚠️⚠️ **Y POR ESO LOS COLORES PASARON A TOKEN, no a blanco literal como pedía
      el brief.** Mientras era una pastilla blanca podía cablear sus valores "on
      white" cayera en la sección que fuera. Sin relleno hereda la sección, y la
      sección **no siempre es oscura**: 41 de los 42 están en un hero oscuro, pero
      el de `/referenzen/` (Kundenstimmen) vive dentro de un `.section--light`.
      Ese scope re-declara `--color-text` y `--color-text-muted`, así que con token
      las dos superficies salen bien sin una segunda regla — mientras que el blanco
      literal habría sido **invisible** en ese 42.º. Es el mismo modo de falla que
      este archivo ya pagó con `.ag-hero__alt` y `.city-callout__lede`.
- [x] **Se borraron DOS overrides page-scoped que sólo existían por la pastilla:**
      el relleno tintado de `/referenzen/` (habría quedado como la ÚNICA pastilla
      del sitio, o sea lo contrario del cambio) y el bloque de teléfono del
      homepage, cuyos valores existían para recomprar el ancho que costaba el
      padding. **La regla G6 (más padding en el badge) queda superseded**: no hay
      esquina que proteger, así que es moot, no revertida.
- [x] ⚠️ **NO HAY LINK AL PERFIL DE GOOGLE, y nunca lo hubo.** El brief dice "die
      Verlinkung bleibt", pero el badge **no está enlazado en ninguna página**
      (verificado en las 42). Las únicas URLs de Google del proyecto son links de
      RUTA a Maps en `/kontakt/`. No se inventó una: hace falta la dirección del
      perfil.
- [x] **D3 — los 5 Einsatzgebiete sin página propia entran al footer**, después de
      Forchheim y antes de "Alle Einsatzgebiete". Verificado sobre el build: el
      orden es 10 links, 5 spans, el hub al final, **en las 54 páginas**.
      El renderer de `footer` en build.js ahora emite `<a>` o `<span>` según haya
      href, y su filtro pasó de "sólo con href" a "todos". `chips` y `mentions` no
      se tocan.
- [x] ⚠️ **EL HOVER TUVO QUE ESCOPARSE A `a.footer-pill`**, y esto es lo único
      delicado de D3: un `<span>` SÍ matchea `:hover`, así que la regla sin
      escopar les habría dado estado de link — exactamente el "parece un link, se
      siente como un link y no hace nada" que el cliente pidió evitar. Foco y tab
      stop no necesitan guarda: un `<span>` no es focuseable.
      El día que uno consiga página, alcanza con darle href en `coverage.json`.

- [x] ⚠️⚠️ **TRAMPA DE MEDICIÓN QUE CASI PUBLICÓ UNA REGRESIÓN INEXISTENTE, y es
      nueva en este archivo: UNA PÁGINA-PROBE AISLADA NO TIENE EL SPRITE.** Extraje
      la sección de `/referenzen/` a una página propia con sus stylesheets para
      medirla, y las cinco estrellas doradas del badge **no se dibujaban** — el
      logo G (que es un `<img>`) y el texto sí. Reporté eso como regresión propia.
      No lo era: sin `<!-- include: icon-sprite -->` un `<use href="#icon-star">`
      no resuelve nada. **Se descartó con un A/B controlado** — el mismo markup y
      los mismos stylesheets sobre blanco puro, sobre `.section--light` y sobre
      negro, con el sprite incluido: en los tres las estrellas salen doradas y en
      `.section--light` el texto sale oscuro, que es justo el caso de
      `/referenzen/`.
      ⚠️ **Y el escaneo de píxeles casi confirmó el bug falso:** contó 372 píxeles
      "dorados" en la página aislada, que agrupados por fila resultaron ser
      **antialiasing de texto repartido en 37 formas** a lo ancho de dos
      encabezados. Sólo 36 caían en la fila del badge, o sea el logo G. **Un
      conteo de color sin agrupar por región no dice nada.**


**2026-08-23 — BLOQUE C: LOS CINCO MEILENSTEINE DE `/ueber-uns/` SON OTROS, Y ESO
INVALIDÓ LA MATEMÁTICA DE LA ZEITLEISTE.** Copy del cliente, verbatim.

- [x] 2016 Bischberg · 2021 Umzug Bamberg · 2022 50 Mitarbeiterinnen und
      Mitarbeiter · 2023 Gründung Werkschutz KG · 2024 100 Mitarbeiterinnen und
      Mitarbeiter. **Cero años inventados, cero prosa agregada, y FRANKONIA
      Security NO aparece** (verificado sobre el build: 0 apariciones).
- [x] ⚠️⚠️ **LOS SALTOS DE AÑO PASARON DE 2,2,3,1 A 5,1,1,1, así que la
      repartición proporcional vieja no quedó imprecisa: quedó INVERTIDA.** Medido
      con el `2fr 2fr 3fr` todavía puesto, a 1440: el salto de CINCO años recibía
      **54px por año** y los de UN año 269, 404 y 247 — o sea el tramo más largo
      renderizaba como el paso más corto. Es exactamente el defecto que esta
      sección existe para no tener.
- [x] **Ahora `5fr 1fr 1fr 1fr` con pisos medidos**, no elegidos: las pistas 2 y 3
      sostienen UNA etiqueta (132px de cap + 16 de aire = **9.5rem**) y la 4
      sostiene DOS, la suya y la última alineada a la derecha (108 + 16 + 132 =
      **16rem**). Medido a 1440: **639 / 152 / 152 / 256**, y a 1920 sale
      **exactamente proporcional** (158px por año en los tres primeros saltos).
- [x] ⚠️ **QUEDA UNA INCONSISTENCIA Y ES ESTRUCTURAL, no un olvido:** el último
      salto es más ancho que los otros dos de un año, porque es el único que tiene
      que sostener dos etiquetas (el último punto va sobre el borde de contenido).
      La alternativa es darles a los tres saltos de un año esos 256px, y entonces
      al de cinco años le quedan 431 — **1,7× un salto de un año**, o sea el lector
      deja de verle los cinco años. Se prioriza que el tramo largo se lea.
- [x] **El cap de 132px se RE-VERIFICÓ contra el copy nuevo** en vez de darse por
      bueno: la palabra más larga pasó a ser "Mitarbeiterinnen" (16 caracteres,
      más angosta que el "Sicherheitsdienst" para el que se había medido), así que
      sigue entrando en una línea y el `hyphens: none` sigue siendo seguro.
- [x] **Medido a 1100 / 1130 / 1280 / 1440 / 1920**: sin scroll horizontal, sin
      etiquetas superpuestas (huecos de 16–26px), y la banda proporcional entra a
      1100 como corresponde. **Por debajo de 1100 las columnas siguen iguales**,
      que es la decisión ya documentada: ahí los pisos suman más de lo que el ancho
      puede ceder y el salto de cinco años dejaría de leerse como el largo.
      Teléfono verificado a 390 real (iframe): riel vertical, 5 puntos, etiquetas
      de 1–2 líneas, sin desborde.
      ⚠️ **Nota de medición: mi sonda reportó "kollision=JA" a 768 y es un falso
      positivo** — ahí el layout es VERTICAL y estaba midiendo huecos horizontales.

- [x] ✅ **RESUELTO 2026-08-23, sin cambiar nada** (cliente: "Bischberg gehört zu
      Bamberg deswegen passt das so wie es ist"). Bischberg está en el Landkreis
      Bamberg, o sea el lede habla de la región y el Meilenstein del municipio —
      dos niveles de precisión de la misma afirmación, no una contradicción. Queda
      registrado porque la próxima persona que lea las dos líneas va a volver a
      tropezar con ellas. Lo que se había observado era:
      el lede de esa misma sección dice "2016 in Bamberg gegründet" y el
      Meilenstein nuevo dice "Gründung in Bischberg".** Están a ~100px de
      distancia en la misma pantalla y no pueden ser los dos ciertos; el
      Meilenstein viejo decía "Gründung in Bamberg" y sí concordaba. Es la ÚNICA
      afirmación de lugar de fundación en todo el proyecto (los otros hits de
      "2016" son el año de la ISO 9001). **Decisión del cliente:** o el lede pasa
      a Bischberg, o el Meilenstein vuelve a Bamberg.


**2026-08-22 — BLOQUE B: BANDA DE MITGLIEDSCHAFTEN UND PARTNER EN EL HOMEPAGE.**
Sección nueva `.partners` (page-home.css) más los tres logos en
`assets/images/partner/`. **Cero seams nuevos y cero cambios en otras páginas.**

- [x] **Va DESPUÉS de la sección FAQ** (decisión del cliente, 2026-08-22). El brief
      pedía "debajo del FAQ, encima del CTA de cierre" y **ese lugar no existe**:
      el FAQ es la última sección del homepage y el CTA de cierre vive DENTRO de
      ella, al final. Se le ofrecieron las tres salidas y eligió sección propia
      después del FAQ, sin tocar la estructura aprobada.
- [x] **BLANCA, y eso es lo que la hace barata:** el FAQ de arriba ya es blanco,
      así que dos secciones claras se encuentran y **no necesitan seam entre
      ellas** (§9.2), y el borde blanco → footer oscuro es el que la página ya
      tenía. Cero trabajo de seams. Por eso también el badge de bauerchristoph usa
      su archivo NORMAL (oscuro); `partner-bauerchristoph-white.svg` queda en el
      repo para una superficie oscura.
- [x] **Título pequeño, y es una excepción DECLARADA a §2** (un tamaño por título
      de sección). §2 existe para que los títulos no compitan entre sí; acá el
      punto es justamente que esta banda no compita con nada. Un
      "Mitgliedschaften und Partner" a 60px sobre tres logos chicos convertiría al
      bloque más silencioso de la página en su heading más fuerte. Sigue siendo un
      `<h2>` real, así que el outline no se rompe.
- [x] ⚠️ **NORMALIZADO POR ALTURA ÓPTICA, NO POR ANCHO, y el logo ancho necesita
      su propio cap para que eso signifique algo.** Los tres ratios son **4,47**
      (DMB), **1,52** (Wirtschaftsclub) y **1,05** (bauerchristoph), o sea una
      altura compartida dejaría al DMB **más de cuatro veces más ancho** que los
      otros dos y se quedaría con la fila. Se lo capa por ANCHO, que en un elemento
      reemplazado recalcula su altura y no deforma nada — el mismo arreglo que la
      fila de logos de `/referenzen/` ya usa. Medido: DMB **208x47**,
      Wirtschaftsclub **67x44**, bauerchristoph **46x44**.
- [x] **Medido a 1200 / 700 / 599 / 390 / 320:** `hScroll = 0` en todos, los tres
      logos cargados y visibles en todos, título en UNA línea en todos, y los
      targets táctiles en **52–63px** (mínimo 44). **Una fila a 390, dos filas a
      320**, que es el wrap que pedía el brief.
      ⚠️ **Las dos primeras lecturas de 390px eran FALSAS y casi reporto dos bugs
      inexistentes** ("falta el tercer logo", "el título se sale"): `--window-size=390`
      da un viewport de layout de **512px**, la trampa que este proyecto ya
      documenta. La medición real necesita un iframe de ancho fijo dentro de una
      ventana ≥500px.

- [x] ⚠️⚠️ **LA URL DEL DMB DEL BRIEF ESTÁ MAL Y NO SE USÓ.** El brief dice
      `mittelstands-bund.de` (con guion) y **ese host sirve un certificado
      autofirmado**, o sea no es el DMB. La verificada es
      **`www.mittelstandsbund.de`** ("Deutscher Mittelstands-Bund (DMB) e.V."), que
      además es la que `/referenzen/` y `/ueber-uns/` ya enlazan.
      ⚠️ `dmb.de` es OTRA organización (el Mieterbund) — nunca "acortar" a eso.
- [x] **El logo del Wirtschaftsclub se DERIVÓ en blanco para el marquee**
      (decisión del cliente): el archivo nuevo es una kachel azul opaca y el
      marquee de `/referenzen/` corre ~30 siluetas blancas.
      ⚠️ **La derivación por COLOR sola no alcanza, y falló dos veces antes de
      salir:** la esquina inferior derecha de la kachel es un chaflán **blanco
      opaco** (elemento de diseño, no defecto — verificado renderizándolo), así que
      cuenta como CONTENIDO; y por eso un flood del FONDO desde el borde tampoco
      podía pasarlo. Lo que funciona es la conectividad **del lado del contenido**:
      se marca contenido (la W roja, el wordmark blanco), se floodea desde el borde
      sobre contenido y ese componente se descarta. La W y el wordmark son
      interiores y sobreviven; el chaflán y el contorno antialiaseado del borde se
      van. **Es la misma lección que los retratos ya dejaron escrita: un umbral no
      separa esto, sólo la alcanzabilidad.**
- [x] **El marquee se re-midió después del cambio, porque el logo nuevo es más
      angosto** (240x160 contra 320x160) y este componente es sensible al largo del
      track: **las 3 filas con grupos pares y slack de 1229–1383px**, 102 logos,
      **0 roto**. Ninguna duración necesitó re-derivarse. El tier de tamaño sigue
      aplicando porque el nombre de archivo no cambió.
- [ ] 🟡 Las menciones en TEXTO de las dos membresías en `/referenzen/`,
      `/ueber-uns/` y la página de Nürnberg **se quedan donde están** — la sección
      las complementa, no las reemplaza (instrucción del brief).


**2026-08-21 — BLOQUE A: LAS 12 FOTOS DEL CLIENTE ESTÁN DENTRO.** Los 7 marcos
reservados que el proyecto arrastraba están todos llenos y **no queda un solo
`[Bild folgt: …]` en el build** (verificado, 0 apariciones):

- [x] `/objektschutz/` — foto REEMPLAZADA. La vieja era una leitstelle, el draft
      pedía un Kontrollgang en el exterior del edificio; la nueva lo muestra.
      Exportada a **820x1227 exactos**, o sea las medidas que el markup ya
      declaraba, así que fue un swap puro sin tocar layout.
      ⚠️ Arrastró TRES derivados, y ninguno se ve en la página que cambió:
      el thumbnail de la lista del homepage (`services-thumb/`, recortado de
      nuevo — los valores viejos eran de la foto de leitstelle), el share image
      (`og/`) y **los dos `alt`**, que describían la leitstelle.
- [x] 3 títulos del Ratgeber (`art-34a`, `art-kosten`, `art-brandwache`) en los
      `.rg-hero__frame`. Ese bloque ya estaba construido para el swap, así que
      costó **cero CSS**, tal como su propio comentario prometía.
- [x] 4 fotos en las case studies (`cs-werkstor`, `cs-schranke`, `cs-software`,
      `cs-schichtuebergabe`).
      ⚠️ **`.cs-figure__frame` NO estaba partido para el swap** (borde punteado,
      padding y tinte de placeholder estaban en la clase base), así que se partió
      en base + `--empty` copiando la línea que `.rg-hero__frame` ya usaba.
      ⚠️ **`cs-werkstor` fue al marco de la case study, NO al hero del hub**
      (decisión del cliente, 2026-08-21): el marco vacío tenía literalmente esa
      bildunterschrift, y `/referenzen/` ya tiene su hero del equipo aprobado.
- [x] `/kontakt/` — sección de fotos nueva, entre el seam y "So finden Sie uns".
      ⚠️ **LA RESERVA DEL SEAM TUVO QUE MUDARSE**: `page-contact.css` reservaba
      la banda de 200px con `.pixel-seam + .contact-location`, un selector de
      hermano adyacente. Insertar una sección en medio lo deja sin matchear, y
      200px de tiles habrían pintado encima de las fotos nuevas.
- [x] 4 logos de partner en `assets/images/partner/` (para el bloque B).
- [x] **Share images regenerados/ampliados**, que es la regla que fijó el cliente
      el 2026-08-21: foto nueva = share image nuevo. 7 páginas dejaron de caer al
      hero del homepage y tienen la suya. Reparto ahora: **33 en el fallback, 21
      propias**.

- [ ] 🔴 **FALTA LA FOTO DEL HERO DEL HOMEPAGE.** El cliente la manda después; el
      placeholder actual (`herofinal-*`) se queda mientras tanto.
      ⚠️ **Cuando llegue son CUATRO cosas, no una**: la foto en sus 3 tamaños, el
      `alt`, **`og/herofinal.jpg` regenerado** (es el fallback de 33 páginas, así
      que una foto nueva ahí cambia la tarjeta social de más de la mitad del
      sitio) y su `ogimagealt` en `content/values.json`.
      El generador es `docs/design-sources/og-images.ps1`.
- [x] `kontakt-tuerschild` **SÍ se publicó** (cliente 2026-08-22: "veröffentlichen
      wenn sinnvoll"). Sí lo es, y no como decoración: el Impressum nombra DOS
      sociedades en esta única dirección, y esta foto es la que muestra los dos
      carteles en la puerta. Va **en vertical y sin recortar** — verificado
      renderizando el crop: un 16:9 centrado **parte los dos carteles por la
      mitad**, o sea elimina justamente aquello para lo que sirve la foto.
      ⚠️ **La proporción de la fila es aritmética, no gusto:** un 16:9 de ancho a
      mide 0,5625a de alto y un 3:4 de ancho b mide 1,333b, así que a = 2,37b
      iguala las dos alturas. De ahí el `2.35fr 1fr`: la fila se nivela sola a
      cualquier ancho en vez de necesitar una altura fija. Medido: 400 contra
      405px. Debajo de 900px se apila, porque más angosto los carteles no se leen.
- [x] El H2 **"Unser Büro in Bamberg"** de esa sección está **aprobado** por el
      cliente (2026-08-22). Era copy escrito para el build — el brief dio las
      fotos y su ubicación pero ningún título, y una sección necesita uno para el
      outline del documento.
- [ ] 🟡 `cs-schranke-1408.webp` pesa **176KB**, el más pesado del lote (escena
      nocturna con mucho detalle). Va lazy y bajo el fold, así que se aceptó en
      vez de degradarla; es el mismo trade-off que este archivo ya documenta para
      baustellenbewachung y revier-schliessdienst.

- [ ] Ver la homepage en un teléfono real
- [ ] 🔴 Subir `content-de/` a git — son los 49 textos y **no están guardados**

---

## Qué se reusa y qué hay que diseñar

Cruzando lo que piden los 49 textos contra lo que ya está construido:

### Se reusa de la homepage (funciona, hay que sacarlo de `page-home.css`)
| Sección de la home | Se vuelve a usar en |
|---|---|
| Índice de servicios | hub Leistungen · 10 ciudades |
| Resultados + testimonios | Referenzen ✅ *card compartida: `css/testimonials.css`* · servicios · ciudades |
| Barra de confianza (números + logos) | ciudades · servicios |
| Pastillas de ciudades | Einsatzgebiete · ciudades · cierres |
| Formulario de cierre | **las 49 páginas** ✅ *ya compartido: `css/lead-form.css`* |
| FAQ | 36 páginas ✅ *ya compartido* — el diseño de cards de la home es `.faq__list--cards` (components.css) desde 2026-08-03; se opta con la clase |

### Se reusa de Werkschutz (ya existe y está generalizado)
`css/page-service.css` — hero de servicio · tarjetas de riesgo ·
contraposición "así suele ser / así es en FRANKONIA" · alcance del servicio con
imagen fija y máscara · caja destacada · comparación A-o-B en dos paneles + tira
de decisión · casos de uso en cards azules con reflejo · Sicherheitskonzept
compacto · caja de precios · bloque de confianza con persona de contacto ·
enlaces relacionados. Todas las clases son `.service-*`, ninguna
`.werkschutz-*`.

### Se reusa de Referenzen (2026-08-03)
`css/testimonials.css` — la card de testimonio (`.testimonial*`), sacada de
`page-home.css` cuando Referenzen la necesitó igual, misma jugada que
`lead-form.css`. Y `css/page-service.css` demostró que no es "la hoja de
Werkschutz": Referenzen la carga como **chasis** (inset, `main h2`, chevrón del
breadcrumb, `.section--light`, `.service-hero*`, `.service-link`, todo el bloque
`.pixel-seam`) y solo agrega 300 líneas propias. Las ciudades y las combo pueden
hacer lo mismo.

### Se reusa de Jobs (2026-08-03)
Nada nuevo compartido, y eso es el punto: `/jobs/` cargó el mismo chasis que
Referenzen y agregó ~430 líneas propias (`css/page-jobs.css`) para sus cuatro
bloques. Lo que sí queda documentado para todos: el `<select>` y el
`<input type="file">` sobre la card blanca del formulario
([page-conventions.md](page-conventions.md) §6), y un bug compartido que se
arregló de paso — las flechas de `.service-link` y `.service-related` salían
`fill: black; stroke: none`, o sea invisibles sobre negro (afectaba también a
Werkschutz y Referenzen).

**Candidato a compartir:** las tarjetas editoriales de "Warum FRANKONIA"
(`.jobs-why*`) — foto 4:3 arriba, ícono azul chico, título, texto, cuatro iguales
con borde de 1px y sin sombra. Es el patrón que piden varias páginas de ciudad y
el hub de Leistungen. Hoy es page-scoped; si una segunda página lo necesita, se
saca a un archivo compartido como se hizo con `lead-form.css` y
`testimonials.css`. Los dos breakpoints están **medidos** (la fila de 4 arranca a
1200px, no a 1024) — leé el comentario en `css/page-jobs.css` antes de moverlos.
En teléfono esas 4 cards **no se apilan**: son la tira compartida
(`data-swipe-carousel`, [page-conventions.md](page-conventions.md) §7.1), igual
que las 6 cards de la home. Cualquier fila de N tarjetas nueva debería hacer lo
mismo.

**Pasada de mobile de `/jobs/` (2026-08-04):** 11.287px → 9.146px a 390px
(13,4 → 10,8 pantallas) sin recortar una palabra. De dónde salió: la tira que se
desliza en Arbeitgeber (2.462 → 981px), el ritmo de seams/padding propio de la
página (§7.2), los 3 pasos como riel vertical y el ajuste de la escalera y los
links. El detalle está en CLAUDE.md.

### Se reusa de Kontakt
`js/contact-map.js` + `.contact-location*` (page-contact.css) — mapa de
ubicación con Leaflet sobre el basemap claro de CARTO, sin API key y **sin
iframe de Google** (un embed pondría cookies de terceros antes de que exista el
banner de consentimiento). Se carga en diferido y el `<div>` trae la dirección
real adentro como fallback sin JS. Las coordenadas salen de los `data-lat`/
`data-lng` del elemento, así que sirve tal cual para las 10 páginas de ciudad
cambiando solo esos dos números.

### Hay que diseñar de cero
| | Usos | Dónde aparece |
|---|---|---|
| ~~**Precios**~~ | **27** | ✅ hecho en Werkschutz (`.service-price*`) |
| ~~**Sicherheitskonzept compacto**~~ | 11 | ✅ hecho (`.service-konzept*`) |
| ~~**Tabla comparativa**~~ | 4 | ✅ hecho (`.service-compare*`) |
| **Layout de artículo** | 4 | blog |
| ~~**Formulario de postulación**~~ | 1 | ✅ hecho en Jobs (`.jobs-form`, selector de cualificación + subir CV) |
| ~~**Case studies**~~ | 1 | ✅ hecho en Referenzen (`.ref-case*`) · **las 3 páginas están construidas** (2026-08-05, Webtexte 50–52, `css/page-case-study.css`) — solo faltan las fotos |

**Sobre mobile:** no es una fase aparte. La homepage costó porque cada sección
era única. Si cada bloque se construye responsive **cuando se construye**, las
48 páginas restantes ya nacen andando en teléfono. Solo hay que revisar las
plantillas nuevas, no las 49 páginas.

---

## El orden concreto

### Bloque 1 — Terminar Werkschutz de verdad (1 página) — 2026-08-03
Es la plantilla de servicio. Reconstruida entera: texto real del cliente, en
alemán, con los estilos y efectos de la home (títulos grandes, CTAs azules,
reveals de scroll, Lenis).
- [x] Cargarle el texto real (draft 03) — verbatim, en alemán
- [x] **Construir el bloque de Precios** ← el que más se repite (27 páginas)
- [x] Construir el Sicherheitskonzept compacto
- [x] Tabla comparativa Werkschutz/Objektschutz (bonus: 4 páginas la usan)
- [x] Traducir al alemán
- [~] Revisar en teléfono — medido sin scroll horizontal en 320/360/390/430/
      768/1024/1440, pero con navegador automatizado, no con la mano
- [ ] 🔴 Aprobar como plantilla
- [x] Foto de portería/Werkstor para el hero ✅ (HeroWerkschutz.png, 2026-08-03)
- [x] **Retrato de Alexander Jäger** ✅ (**`Alex.png`**, cliente, 2026-08-14) — el
      marco 4:5 reservado se llenó exactamente como estaba previsto: un `<p>` por un
      `<picture>`, sin cambio de layout y sin CLS. Exportado a 480/960w WebP + JPEG.
      ⚠️ **Hubo dos archivos ese día**: primero `alex.jpg` (fondo gris de estudio) y
      después la versión del propio cliente sobre negro, que es la que quedó — es
      mejor porque **incluye las dos manos**, imposible en un 4:5 desde el 2:3 anterior.
      Su fondo se **normaliza a #010101 exacto** (no es un recorte con alpha: el pelo
      oscuro comparte luminancia con el negro y cualquier key se lo come). Medido en
      la costura: página 1, foto 1, **delta 0,00**. Receta y umbrales en
      `docs/design-sources/portrait-key-backdrop.py`.
      ⚠️ **Quedan soldados a una superficie OSCURA**: para una sección clara hay que
      re-correr el script con otro color de destino, no arreglarlo por CSS.
- [ ] 🔴 Faltan **2 de las 6 fotos** del Leistungsumfang: "2. Zugangs- &
      Torkontrolle" y "6. Notfall-Erstmaßnahmen" (hoy placeholders; las otras 4
      son las que mandó el cliente). Marcadas inline en el HTML.
      *No hacen falta fotos de industria para Anwendungsfälle: esas 4 tarjetas
      son cards azules sin foto desde el 2026-08-03.*
- [ ] 🟡 **Pedir esas fotos más grandes que las anteriores.** Desde el rediseño
      del 2026-08-04 esa sección es un panel de media pantalla: 720x820 px a
      1440, o sea ~1440x1640 en una pantalla Retina. Los archivos actuales miden
      751-1200 px de ancho, así que en Retina hay upscaling. Sirve igual a DPR 1
      y no vale re-exportar lo que ya está (no hay original más grande), pero
      cualquier foto nueva conviene pedirla de **1600 px de ancho o más**.
- [ ] 🔴 Confirmar publicar 28–40 €/h y el "30 % ahorro en personal"
- [ ] Revisar las 3 líneas de "So läuft es oft" (las escribimos nosotros: el
      draft pide la contraposición pero solo da el lado FRANKONIA)

**Diff copy draft ↔ página, hecho a máquina el 2026-08-04** (pedido del cliente:
"que no me agregues nada"). Todo el copy del draft está en la página palabra por
palabra — H1, subline, los 5 H2 de contenido, las 4 tarjetas de riesgo, los 3
Vorteile, los 6 bloques del Leistungsumfang + Highlight-Box, la tabla de
comparación, los 4 Anwendungsfälle, el Sicherheitskonzept, los 5 factores de
costo + Hinweis + caja de precio, y las 5 FAQ. Lo que **no** coincide, y hay que
revisar con Chris:
- [x] H2 de cierre estaba cortado ("Jetzt Werkschutz anfragen") → restaurado al
      texto del draft, "… — Angebot innerhalb eines Werktages" (2026-08-04).
- [ ] Párrafo de la sección 5 (Abgrenzung, 308 caracteres) **borrado** por pedido
      del cliente ("es mucho texto") y reemplazado por una frase nuestra:
      "Werkschutz schützt laufende industrielle Prozesse. Objektschutz schützt
      Gebäude und Gelände." — es una compresión, no copy del draft.
- [ ] Párrafo de Ansprechpartner reescrito según el brief del cliente; se perdió
      "Ihr Werkschutz-Konzept erstellen erfahrene Sicherheitsexperten" (la idea
      sigue dicha en la sección Sicherheitskonzept).
- [ ] Los 3 tics del hero están recortados a chips de una línea (pedido del
      cliente): son substrings literales, no la frase completa del draft.
- [ ] Copy nuestro que el draft no trae: los 10 eyebrows de sección, las etiquetas
      de los paneles ("Für laufende Betriebe" / "Für Gebäude und Gelände"), la
      franja de decisión (3 líneas), el título de la franja de certificaciones
      ("Dahinter steht ein zertifiziertes System"), y los labels de botón
      "Werkschutz anfragen" / "Zur Sicherheitstechnik".
- [ ] El "Formulartitel: Ihre Werkschutz-Anfrage" del draft no se renderiza: el H2
      de la sección ya lo dice (ver el comentario en pages/werkschutz.html).
- [ ] 🟡 **2026-08-04, `/kontakt/`: dos cosas salieron de la columna izquierda**
      (pedido del cliente, para que no compita con el formulario).
      - **DEKRA ya no aparece en `/kontakt/`**: se quitaron los dos sellos y
        "DEKRA-zertifiziert nach DIN 77200-1 und ISO 9001", y no estaban en ningún
        otro lugar de esa página. Sigue en `/werkschutz/`, `/referenzen/`, `/jobs/`
        y la homepage, y el mínimo de la guía §5 es sobre la homepage — así que no
        se rompe ninguna regla, pero es un elemento de confianza que sale de una
        página. Los archivos de los sellos siguen en uso, no se borraron.
      - **Ningún link interno sale de `/kontakt/` ahora.** La línea "Interne Links"
        del draft pide `/leistungen/`, `/angebot/` y `/sicherheitskonzept/` desde
        esta página; los tres estaban ya reducidos a uno y ese uno también se fue.
- [ ] 🟡 **2026-08-05, se quitó la Highlight-Box del Leistungsumfang** (pedido del
      cliente). Era la caja del draft "Werkschutz + Technik aus einem Konzept", con
      su párrafo y su link `Zur Sicherheitstechnik`. **Es copy aprobado que sale de
      la página** y es el único lugar donde el argumento estaba desarrollado: que la
      técnica puede reemplazar horas de personal y por eso baja el costo corriente.
      Lo que queda es más flaco — "Technik-geschulte Kräfte" en el hero, la duty 05,
      "Technik-Empfehlung" en el Sicherheitskonzept, y un factor de cinco palabras en
      Kosten ("Technik-Kombination, die Personalstunden ersetzt"). **Confirmar con
      Chris.** No se pierde navegación: `/sicherheitstechnik/` sigue enlazado desde
      "Verwandte Leistungen" al cierre.
- [ ] 🟡 **2026-08-04, tres palabras nuevas en la sección Vorteile:** los tópicos
      "Erreichbarkeit", "Stammpersonal" y "Nachweisbarkeit" salen del brief de
      rediseño del cliente, **no** del draft de Chris. Son etiquetas de categoría
      (nombran el contraste que la copy aprobada ya hace), no afirmaciones nuevas —
      pero son texto nuevo en la página. **Confirmar con Chris.**
- [ ] **2026-08-04, pedido del cliente:** en el Leistungsumfang se quitaron las
      dos etiquetas de grupo del draft como label por item ("Im laufenden Betrieb"
      / "Nachts, am Wochenende, an Feiertagen"): cada duty es solo título + texto.
      Es copy aprobado que sale de la sección — **confirmar con Chris**. Ningún
      dato se pierde de la página: la cobertura de noche / fin de semana /
      feriados sigue dicha en la FAQ, en los factores de Kosten y en
      Anwendungsfälle (verificado antes de borrar).

*Al terminar esto quedaron resueltos los 3 bloques nuevos más usados + el
formulario compartido.*

### Bloque 2 + Bloque 3 — LAS 9 PÁGINAS DE SERVICIO QUE FALTABAN — 2026-08-16
- [x] `/objektschutz/` · `/sicherheitstechnik/` · `/brandwache/` ·
      `/kaufhausdetektei/` · `/veranstaltungsschutz/` · `/baustellenbewachung/` ·
      `/revier-schliessdienst/` · `/empfangsdienst/` · `/interventionsdienst/`
      — Webtexte 02/04/05/06/07/09/10/11/12, verbatim, alemán.
      **Con esto las 12 páginas de servicio están y no queda un solo link de
      servicio roto en el nav, el footer ni `/leistungen/`.**

⚠️ **"SIN DISEÑAR NADA NUEVO" NO SE PUDO CUMPLIR DEL TODO, y la razón vale
saberla: los drafts v2 varían la estructura A PROPÓSITO.** Seis de los nueve lo
dicen en su propia cabecera ("Struktur bewusst variiert", "Struktur-Variante
'Notfall-Leistung'", "Variation statt Risiko-Karten"). Van de 8 a 11 secciones y
la mitad tiene una sección que ninguna otra página tiene (Türsteher, Anzug oder
Montur, Alarmkette, Modell-Vergleich, "Wann ist eine Brandwache Pflicht?").
O sea que [page-conventions §8.1](page-conventions.md) —"los 12 drafts usan la
misma 9-Punkte-Struktur"— era cierto con los drafts de julio y **ya no lo es**.
Está corregido ahí.

**Lo que hubo que agregar a `css/page-service.css`, y sólo esto** (todo genérico,
todo `.service-*`):
- `.service-hero--split` — hero de dos columnas con foto VERTICAL. **No es un
  invento: §8.2 siempre lo prescribió** para una foto vertical, y las reglas se
  habían borrado el 2026-08-03 cuando el hero de Werkschutz pasó a foto apaisada.
  Las 9 fotos de servicio son 820x~1220, o sea exactamente ese caso.
- `.service-points*` — N bloques rayados (regla azul → título → texto). Es la
  forma más repetida de los nueve drafts (Risiko, Vorteile, Leistungsbereiche,
  Anwendungsfälle, típicos Einsätze…). **SEXTO consumidor de esta forma**;
  `.lh-why*` es la misma idea y esta lista ya decía que debería estar en el
  chasis — no se fusionaron todavía porque ese bloque está vivo en `/leistungen/`
  y `/sicherheitskonzept/`.
- `.service-scope*` — el Leistungsumfang como lista de tics a dos columnas.
  **No se usó `.service-flow`** (el scrollytelling 50/50 de Werkschutz): ese
  bloque necesita SEIS fotos por servicio y sólo Werkschutz las tiene.
- `.service-konzept__steps--4 / --5` — el riel de pasos a otros conteos (5 drafts
  dan 4 pasos, uno da 5). Con conteo par el conector horizontal se rompería al
  saltar de fila, así que cada uno tiene UN breakpoint donde entra en una línea.
- `.service-price__box--text` — caja de precio con palabras en vez de cifra.

**Y `partials/price-box.html` se parametrizó** (tics, CTA, unidad, label, con
defaults en `content/values.json`, misma jugada que `nameRequired`): cada Webtext
especifica sus propias líneas de caja, y `/brandwache/` además pide ahí el CTA de
teléfono. **Las 11 páginas que ya incluían la caja no cambiaron** (verificado).

- [x] **Generadas con `docs/design-sources/service-pages.py`**, de una sola
      pasada, igual que las de ciudad — por las mismas dos fallas invisibles en
      una captura: la paridad FAQ ↔ JSON-LD (**46 pares**) y el color de cada
      seam, que se DERIVA de la secuencia de superficies porque cada draft ordena
      distinto. El copy vive en `service_drafts.py`, **extraído a máquina de los
      `.docx`, sin tipear una palabra** — son ~19.000 palabras de alemán y un
      error de transcripción en copy aprobado no lo caza ninguna medición.
      ⚠️ Después de generarlas son páginas normales editables a mano; **no
      re-correr el script encima**.
- [x] **Medido a 320 / 390 / 768 / 1024 / 1440 / 1920 en las 9** (54 corridas):
      **sin scroll horizontal en ninguna**, un solo `<h1>`, sin saltos de nivel,
      nada fuera del viewport, **cero fallos de contraste** fuera del caveat
      sitewide del azul del CTA (3,11:1), y **FAQ visible ↔ `FAQPage` 46/46
      byte-idénticas**. Sin JS el markup servido trae **6.205–10.647 caracteres**
      de texto real en `<main>`, 0 tiles y 0 elementos ocultos.
      **Re-medidas también las 9 páginas que comparten el chasis**
      (`/werkschutz/`, `/referenzen/`, `/jobs/`, `/sicherheitskonzept/`, ciudad,
      combo, `/leistungen/`, `/angebot/`, homepage): sin regresiones.
- [x] Las 9 en `sitemap.xml`, priority 0.8 (igual que Werkschutz).

**Dos defectos reales encontrados midiendo y arreglados:**
1. **58px de scroll horizontal a 320 en `/revier-schliessdienst/`** —
   `.service-panel__cta`. Es la **QUINTA** vez que la misma omisión causa el mismo
   bug acá: `.btn` es `white-space: nowrap` y `width: 100%` **solo** no alcanza,
   porque un ancho no reduce el min-content. Hace falta `white-space: normal`.
2. **El H1 se recortaba a 320** en Brandwache, Baustellenbewachung y
   Empfangsdienst: `hyphens: none` en headings + `overflow-wrap: break-word` (que
   **no** reduce el min-content) dejaba "Brandsicherheitswache" pidiendo ~340px.
   `hyphens: auto` sólo abajo de 400px, que con `lang="de"` corta por sílabas.
   ⚠️ La página **no** scrolleaba de costado — clipeaba, que es peor.

**Y dos de contraste que nunca se habían ejercitado:** `.service-compare` está
documentado como "either surface" pero **ninguna página lo había puesto sobre
blanco** hasta `/revier-schliessdienst/`. Ahí los términos daban **3,17:1 a 11px**
y el label del panel primario **3,71:1 a 12px**. Arreglados con los mismos valores
que la lista de factores de precio ya usa para ese caso.

- [ ] 🔴 **Las FOTOS de 4 de las 9 no muestran lo que pide su draft.** Los `alt`
      describen **el archivo**, no el brief — se corrigieron después de mirar las
      nueve en una hoja de contactos, que es la **tercera** vez en este proyecto
      que un asset no coincide con lo que su nombre o su brief sugería.
      | página | el draft pide | el archivo es |
      |---|---|---|
      | objektschutz | Kontrollgang am Gebäude | sala de monitoreo |
      | sicherheitstechnik | Leitstand / montaje de cámara | una cámara en fachada |
      | brandwache | Brandwache con extintor | un briefing del equipo |
      | kaufhausdetektei | superficie de venta, discreto | agente de traje en una entrada |
      **Vale pedirle a Chris al menos las dos últimas**: una brandwache real y una
      foto de superficie de venta fotografían el servicio mucho mejor.
- [ ] 🔴 **Contradicción de precio DENTRO del propio draft, en 3 de los 9.** El
      párrafo de Kosten de Veranstaltungsschutz y Empfangsdienst dice "zwischen 25
      und 38 Euro" y el de Baustellenbewachung "zwischen 25 und 35", **mientras la
      Preis-Box y la FAQ del mismo documento dicen 26–32**. Se publicó **26–32 en
      los tres** (o sea el valor de la caja y de la FAQ, que además es el token
      sitewide de G10) para no publicar una página que se contradice a sí misma.
      **Confirmar con Chris cuál es el bueno.**
- [ ] 🔴 **Los detalles de contacto de Alexander Jäger** aparecen en las 4 páginas
      cuyo Trust lo nombra (Objektschutz, Sicherheitstechnik, Brandwache,
      Baustellenbewachung). Sólo el draft de Objektschutz repite su teléfono y su
      mail; en los otros tres se incluyen igual porque un bloque de contacto sin
      forma de contactar es peor. Las otras 5 páginas llevan la franja de
      certificaciones, sin retrato — **es la Q2 del cliente aplicada tal cual**
      ("stays on every page where the documents specify it"), no un olvido.
- [ ] 🟡 4 links a páginas combo que todavía no existen (`/objektschutz-nuernberg/`,
      `/brandwache-wuerzburg/`, `/brandwache-erlangen/`, `/brandwache-fuerth/`).
      Son las URLs confirmadas de la guía §2.2 — Bloque 6.
- [ ] 🟡 **`.service-link` mide 29px de alto** y el mínimo táctil es 44. Se arregló
      **scopeado** a los bloques nuevos; `/werkschutz/`, `/referenzen/`, `/jobs/`
      y las 3 case studies siguen con 29px. Promoverlo al selector compartido es
      lo correcto, pero como su propia pasada, medida en esas seis.

- [x] `/sicherheitskonzept/` — **2026-08-10**, Webtext 08 verbatim, alemán, 11
      secciones, 10 seams. **Era el 404 más enlazado del sitio después de las
      legales: seis páginas apuntaban acá** (homepage, `/leistungen/`,
      `/angebot/`, `/werkschutz/` y dos case studies).
      ⚠️ **NO es una réplica de la plantilla de servicio** aunque el draft la
      llame "Leistungsseite": es una página HÍBRIDA y el propio draft lo dice —
      las secciones 2 y 3 existen para capturar la consulta informativa
      ("sicherheitskonzept", 880/mes) con la respuesta en las dos primeras frases
      bajo un H2 escrito como pregunta, y de ahí en adelante convierte.
      Reutiliza casi todo: chasis `page-service.css`, las 4 cards de Anlass son
      `.lh-why__*` (**quinto consumidor** — ese bloque ya tendría que estar en el
      chasis), la cita es `.testimonial`, los sellos `.trust-certs*`, el FAQ
      `.faq__list--cards`, el formulario el partial, y los 5 pasos los mueve
      `js/steps-sequence.js`. `page-sicherheitskonzept.css` sólo agrega la lista
      de tics, el riel de 5 pasos, las kacheln de resultado y los dos bloques CTA.
      Medida a 520/768/900/1100/1440: **sin scroll horizontal**, un solo `<h1>`,
      sin saltos de nivel, FAQ visible ↔ `FAQPage` **5/5 byte-idénticas**, 0
      placeholders sin resolver, y **cero 404 dentro de `<main>`** salvo
      `/datenschutz/` (el link de consentimiento del formulario, pendiente en las
      13 páginas que lo llevan). Sin JS: **8.700 caracteres** de texto real y 27
      headings en `<main>`.
  - [ ] ⚠️ **SIN FOTO DE HERO.** El draft pide una "Begehungs-Situation,
        Sicherheitsexperte mit Kunde am Objekt (Echtfoto)" y no existe en el
        proyecto: **todas las landscape ya son el hero de otra página**, y reusar
        el apretón de manos interino de `/leistungen/` haría que dos páginas se
        vean iguales. Va con hero de sólo copy, la misma forma que `/ratgeber/` y
        `/einsatzgebiete/`. **Se suma a la pregunta de heros que ya va a Chris.**
  - [ ] ⚠️ **La sección 6b va como MARCO RESERVADO.** El propio `[UMSETZUNG]` del
        draft dice que el PDF de muestra existe pero hay que **anonimizarlo
        entero antes de publicar** (Auftraggeber, direcciones, contactos, número
        de cliente — Prüfkatalog O4). La ESTRUCTURA de 18 páginas sí se publica,
        porque es copy aprobado; la vista previa es un placeholder etiquetado.
        **No publicar ese PDF hasta que Chris confirme la anonimización.**
  - [ ] ⚠️ **El bloque de Alexander Jäger (sección 8): la pregunta abierta ESTÁ
        CERRADA — se queda, siempre** (cliente 2026-08-13, Q2), y **su retrato ya
        existe desde el 2026-08-14** (ver `/werkschutz/`, arriba).
        ⚠️ **Pero acá NO hay bloque de contacto: sólo una frase de prosa** que lo
        nombra con su teléfono y su e-mail enlazados. O sea la foto no tiene dónde
        entrar en esta página sin construirle la sección — decisión de alcance, no
        un asset que falte. Los assets están: `wk-contact-alexander-jaeger-*`.
        Su teléfono y su e-mail ahora salen de `content/values.json`
        (`phoneJaeger` + **`emailJaeger`, agregado en esta pasada**);
        ⚠️ `pages/werkschutz.html` todavía tiene el e-mail escrito a mano — pasarlo
        al token cuando esa página deje de estar en movimiento.
  - [ ] ⚠️ **Cinco links de servicio y dos de ciudad del draft no existen todavía**
        (`/objektschutz/`, `/brandwache/`, `/sicherheitstechnik/`,
        `/revier-schliessdienst/`, `/veranstaltungsschutz/`, Bamberg, Würzburg).
        Ninguno sale como 404: los de servicio resuelven a `/leistungen/` y los de
        ciudad a `/einsatzgebiete/`. Un `href` cada uno cuando salgan.
  - [x] **Bug de contraste propio, encontrado midiendo y arreglado:** la etiqueta
        del marco de muestra usaba `--color-text-muted` (`rgb(59 73 86 / 0.75)`),
        que da **4,60:1 sobre blanco puro** pero **4,39:1 sobre el relleno del 5 %**
        del propio marco — bajo el mínimo. A 0.88 mide **6,16:1**.
        ⚠️ **La lección general, medida:** el muted al 0.75 es seguro sobre blanco
        y NO lo es sobre un relleno translúcido del mismo tono.

### Bloque 4 — Primera ciudad (1 página)
- [x] `/sicherheitsdienst-nuernberg/` — **2026-08-09**, la más importante (su
      propio draft se titula "WICHTIGSTE STADTSEITE", ~1.240 búsquedas/mes
      combinadas). Texto real del Webtext 13, alemán, 11 secciones, 9 seams.
      **Arregla un 404 que estaba en vivo en el footer de todas las páginas y en
      los chips de Coverage del homepage.** Es la plantilla de las 9 restantes:
      `css/page-city.css` (~600 líneas) sobre `page-service.css` de chasis.
      Medida a 320/390/768/900/1024/1200/1440/1600: **sin scroll horizontal**,
      **cero fallos de contraste**, los 8 bloques de contenido con el texto en la
      misma línea izquierda, un solo `<h1>` y sin saltos de nivel, FAQ visible ↔
      `FAQPage` **6/6 idénticas**. Sin JS: nada oculto, 9.532 caracteres de texto
      real y 21 links en `<main>`.
      Documentada en [page-conventions.md §10](page-conventions.md#10-página-de-ciudad).
  - [x] **Sección de Leistungen rehecha en DOS GRUPOS** (2026-08-09, después de
        leerla a nivel UX): los 4 con página de ciudad como **cards** (4 en una
        fila, el gemelo oscuro de las cards de Warum) y los 4 con página genérica
        como **filas** bajo la etiqueta "Ebenfalls verfügbar". Los 8 conservan su
        descripción — el grupo 2 son filas y no chips justamente por eso, así que
        no se perdió ni un carácter de los ~760 de copy. **El split no reordena
        nada:** el draft ya los lista 1–4 ciudad / 5–8 genéricos.
        Medido a 320 → 1600: radio, padding y tamaño de nombre **idénticos** a la
        card de Warum en todos los anchos, contraste sin fallos, cero targets bajo
        44px, sin scroll horizontal. La sección pasó de 1.207 a 1.302px a 1440.
  - [ ] 🔴 **Pregunta abierta para Chris: sacar " in Nürnberg" de los labels de
        servicio.** Los 8 miden 22–32 caracteres y comparten el sufijo; sin él
        quedarían en 10–20 y la lista se escanearía al doble de velocidad. **No se
        hizo**: es la "einheitliche Benennung" del draft y son 8 instancias del
        keyword principal. Por eso la etiqueta del grupo 2 dice "Ebenfalls
        verfügbar" y no "Ebenfalls im Großraum Nürnberg verfügbar" — con los
        labels intactos, nombrar la ciudad también ahí la repetía tres veces en dos
        líneas.
  - [ ] 🟡 **Fotos por servicio en las 4 cards** — las 10 fotos existen
        (`assets/images/<service>.webp`) pero son verticales 820×1227 y harían
        falta exports 4:3 nuevos para un tope de card de ~290px. Se dejó afuera de
        esta pasada; es la mejora obvia si la página se siente muy tipográfica.
  - [x] **Los 5 Lokale Einsatzfelder cierran cada uno con un link a su servicio**
        (2026-08-09, mismo pedido abierto de UX). Los 5 describen, casi textual,
        un servicio puntual; la sección no enlazaba a ninguno. 3 de 5 lo nombran
        directo en la frase, los otros 2 usan casi las mismas palabras que la
        Sección 3 usa para ese servicio. **Revier- & Schließdienst consigue acá su
        único link de toda la página** — no está en la lista de 8 de arriba.
        ⚠️ El emparejamiento es inferencia mía, no del draft — vale confirmarlo con
        Chris, aunque de bajo riesgo (3 de 5 nombran el servicio directo).
        De paso se cerró un hueco real: con 5 en una grilla 2-up el ítem 5 quedaba
        solo, con un hueco medido de 752 a 1337px a 1440. Ahora ocupa las dos
        columnas desde 900px.
  - [x] 🐛 **Bug de contraste pre-existente encontrado y arreglado en la fuente**:
        `.service-link` dentro de `.section--light` daba 3,71:1 (falla 4,5:1 de
        texto normal) — **ya estaba en vivo en `/referenzen/`** (sus 3 links de
        "Case Study lesen"), sin detectar. Un solo fix en `page-service.css` lo
        corrigió en las dos páginas: **4,9:1** con la mezcla profunda ya
        documentada. Re-medido: `/referenzen/` y `/werkschutz/` sin cambios de
        layout, sin scroll horizontal.
  - [x] 🔴→✅ **Fotos de ciudad: ya no bloquean.** El hero **no lleva foto**,
        y no es un parche: el Hero-Aufbau del draft de Nürnberg no pide imagen
        (el de Bamberg sí). En su lugar va **el contorno administrativo real de
        la ciudad** como `<path>` inline, generado una vez con
        `docs/design-sources/city-outline.py` desde los geojson que ya estaban en
        el repo. Cero requests, cero terceros, **ningún elemento LCP de imagen en
        la página**, y honesto para un Einsatzgebiet (un área, no una dirección).
        Correr el script con el slug de cada ciudad; las 10 ya tienen geojson.
  - [x] Reusado sin tocar nada: la sección de Kosten entera (`.service-price*` +
        `include: price-box`), el formulario (`partials/lead-form.html`), el FAQ
        (`.faq__list--cards`), la card de testimonio (`css/testimonials.css`) y
        todo el chasis (inset, `main h2`, breadcrumb, seams, `.section--light`).
  - [x] **`.ref-certs*` promovido a `.trust-certs*` en `page-service.css`** —
        esta página era el tercer consumidor, que es justo el disparador que
        CLAUDE.md había anotado. `/referenzen/` migrado en el mismo commit y
        **re-medido: sello 70×106 a 1440 y 53×80 a 390, ratio 0,665 = 399/600
        exacto, 3 columnas desde 700px — idéntico a antes.**
  - [x] `content/values.json`: `price.werkschutz` → **`price.range`**. Los
        Webtexte publican el mismo 26-32 para todos los servicios y ciudades, así
        que un nombre por servicio invitaba a una segunda copia del mismo número.
  - [ ] ⚠️ **Confirmar con Chris:** (1) los 2 testimonios van **completos**, no
        "gekürzt wie Demo" como pide el draft — acortar la cita de un cliente real
        con nombre es editarle las palabras a una persona, y no hay versión corta
        en ningún documento; (2) **"Bayernhafen Nürnberg"** aparece en el
        Einsatzfeld 01 (es el puerto público como descripción geográfica, no el
        cliente de Bamberg cuya Freigabe nunca llegó, pero el nombre tiene
        historia en este proyecto); (3) el H2 de Umgebung es la **cuarta
        excepción** a la escala de títulos de §2 — la próxima tiene que replantear
        §2 en vez de sumarse.
  - [ ] La página enlaza **15 URLs confirmadas que todavía no existen** (7
        servicios, las 4 combo de Nürnberg, 2 ciudades vecinas, `/einsatzgebiete/`,
        `/leistungen/`). Es la convención del proyecto (§8.3), no placeholders —
        y el CTA primario sí apunta al formulario vivo de la propia página.

### Bloque 5 — Las 9 ciudades restantes ✅ **COMPLETO 2026-08-16**
- [x] Würzburg · **Bamberg** · Erlangen · Fürth · Bayreuth · Schweinfurt ·
      Coburg · Forchheim · Ansbach — texto real de los Webtexte 14–22
      (Stand 04.08.2026), alemán, verbatim. **Con esto las 10 páginas de ciudad
      están, y no queda ni un link de ciudad roto en el sitio**: los 10 hrefs de
      `content/coverage.json` resuelven, o sea el footer de las 30 páginas y los
      chips de Coverage del homepage.
- [x] ⚠️ **CADA DRAFT TIENE OTRA ESTRUCTURA, y es deliberado — no son nueve
      copias de Nürnberg.** Los propios documentos lo dicen ("Struktur bewusst
      variiert ggü. Nürnberg"), así que el ORDEN de secciones sale de cada draft:
      Würzburg entra por los Einsatzfelder y después argumenta el Warum; Erlangen
      no tiene sección Warum y suma una de Veranstaltungen; Schweinfurt es
      Werkschutz-first; Coburg cambia la sección de Brandwache por una de
      Sicherheitskonzept; Ansbach tiene el Warum en prosa, sin tarjetas; Fürth,
      Forchheim y Ansbach son variantes compactas sin sección de Trust.
      **Secciones por página: 8 a 11. Seams: 5 a 9.**
- [x] ⚠️ **POR ESO EL SEAM NO SE PUEDE COPIAR DE NÜRNBERG.** El color de los tiles
      es el de la sección de ARRIBA y dos secciones del mismo color no llevan
      seam (§9.2) — con otro orden, la lista cambia entera. Se **deriva** de la
      secuencia de superficies de cada página, no se escribe a mano.
- [x] **Bamberg, la excepción**: único sitio con dirección real → NAP completo con
      geo, badge "Unser Zuhause: Sitz in Bamberg, Neuerbstraße 19", Zuhause-Story
      en vez de las 4 tarjetas, y **10 servicios en vez de 8** — es la única
      ciudad que puede listar Revier- & Schließdienst e Interventionsdienst,
      porque son Raum-Bamberg. Prioridad 0.9 en el sitemap (las otras 0.8).
      Su primer FAQ da la calle, que en cualquier otra ciudad sería la afirmación
      que la regla UWG prohíbe.
- [x] **Cards de servicio sólo donde hay página de ciudad.** Sólo Würzburg,
      Erlangen y Fürth tienen combos en esta fase, así que sólo ellas llevan el
      grupo de 4 cards + 4 filas; las otras seis van **todas como filas**, porque
      todos sus destinos son la página genérica y destacarlos como cards
      prometería una página local que no existe (§10.1).
- [x] **Las tarifas son las del draft de cada ciudad, no siempre cuatro**: dos en
      Schweinfurt y Forchheim, tres en Fürth, Bayreuth, Coburg y Ansbach, cuatro
      en Würzburg, Bamberg y Erlangen. 🐛 Salieron las cuatro en todas al
      principio — o sea servicios en una tabla de precios que el cliente no
      tarifó ahí. Lo encontró el diff automático página↔docx.
- [x] 🐛 **BUG REAL ENCONTRADO MIDIENDO: `.city-callout__lede` era BLANCO SOBRE
      BLANCO**, ratio **1:1**, en las tres páginas que ponen un callout de prosa
      sobre sección clara (Bamberg, Erlangen, Ansbach). El color estaba cableado
      en blanco porque en Nürnberg ese bloque es siempre la sección de Brandwache,
      que es siempre oscura. Arreglado con el token.
      ⚠️ **Y el primer arreglo NO HIZO NADA**: escribí
      `.section--light .city-callout …`, pero las dos clases están en el MISMO
      elemento, así que el descendiente no matchea. Un selector que no puede
      matchear falla igual que uno ausente — por eso se detecta midiendo el color
      renderizado, no leyendo la hoja.
- [x] **`.city-why__grid--3`, una regla nueva y necesaria**: cinco de los nueve
      drafts dan **tres** tarjetas de Warum y la grilla es `repeat(4, …)`, así que
      dejaban la cuarta columna vacía. Es el mismo hueco que `--wide` cierra para
      un quinto Einsatzfeld impar. **Nürnberg no se movió** (medido antes y
      después).
- [x] **Header de Zertifizierungen CENTRADO** (cliente, sobre Erlangen: "esto
      centralo"). Sólo toca **Würzburg y Erlangen**: son las dos únicas sin sección
      de Vertrauen, así que su copy de Trust es el H2 + lede de esa sección, y
      quedaba rangeado a la izquierda sobre un bloque que ya se centra solo. Sexta
      aparición de la trampa de §10.4 — `text-align` no alcanza, van dos clases +
      `margin-inline: auto`. Medido con `Range` sobre el texto real: **0px del eje**
      a 390/768/1024/1440/1920.
- [x] **Áreas táctiles**: `.city-fields__link` (29px — **ya fallaba en Nürnberg**,
      la regla describía dos links y sólo alcanzaba a uno) y el link inline del
      Abbinder de Erreichbarkeit (23px, nuevo acá). Los dos links de membresía de
      Bamberg quedan sin padear a propósito: dos links en una frase son la
      excepción de line-height de WCAG 2.5.8, igual que en `/referenzen/` y
      `/ueber-uns/`.
- [x] **Generadas por `docs/design-sources/city-pages.py`** (+ `city_pages_data.py`),
      un script de desarrollo de una sola pasada, como `city-outline.py` y
      `franken-map.py`. Existe por las dos cosas que se rompen a mano y no se ven:
      la paridad FAQ ↔ JSON-LD (50 pares) y el color de los seams. **No es parte
      de `npm run build` y no se re-corre sobre páginas ya editadas a mano.**
- [x] **Medido a 320 / 390 / 768 / 1024 / 1440 / 1920 en las 10 páginas**: sin
      scroll horizontal en ninguna, **cero fallos de contraste** fuera del caveat
      sitewide del azul del CTA (3,11:1), un solo `<h1>`, sin saltos de nivel,
      FAQ visible ↔ `FAQPage` **50/50 byte-idénticas**, y nada fuera del viewport.
      Sin JS el markup servido trae **5.114–11.156 caracteres** de texto real en
      `<main>`, 0 tiles y 0 elementos ocultos; con `prefers-reduced-motion`, 0
      tiles y 0 elementos en opacidad <1.
- [ ] ⚠️ **Para confirmar con Chris** (todo lo demás es verbatim del draft):
  - [ ] el H2 y el lede de la sección **Umgebung** en las 7 ciudades cuyo draft
        sólo lista "Nachbarorte: X · Y" — el H2 usa el patrón del propio draft de
        Bamberg ("Sicherheitsdienst rund um <Stadt>") y el lede es el de Nürnberg
        con los nombres cambiados;
  - [ ] en Würzburg se quitó **"(Widget)"** de la frase de Trust: es una
        instrucción de producción, no copy (el widget está en el hero);
  - [ ] los **3 módulos de Brandwache de Bamberg** parten UNA frase del draft en
        sus tres mitades, igual que Nürnberg;
  - [ ] los **lede de la sección de Leistungen** de las 9 páginas son de este
        build (el draft da los 8–10 servicios pero no una frase de entrada).

### Bloque 6 — Primer combo + los 15 restantes
- [x] `/brandwache-nuernberg/` — **2026-08-09**, texto real del Webtext 34
      (Stand 25.07.2026), alemán, 8 secciones. Cierra un 404 que ya estaba en vivo:
      la página de ciudad lo enlaza **tres veces** (filas de servicio, callout de
      Brandwache y FAQ). "Puro ensamblado" resultó cierto: **`css/page-combo.css`
      son cuatro reglas**, porque la página carga `page-service.css` de chasis
      **y `page-city.css` de capa geo** (badge, contorno, tics en columna, bloques
      numerados, cards de Warum, filas de servicio, ritmo de teléfono). La
      plantilla completa está en
      [page-conventions.md §11](page-conventions.md#11-página-combo-servicio--ciudad).
  - [x] Por qué ésta primero: el draft se llama "stärkste Kombi" (20/mo, la más
        alta de las 16) y es la LP de Ads de K2/K5 — y es la única de las cuatro
        con hero **Notfall**, así que construirla primero obliga a la plantilla a
        resolver el caso raro (**el teléfono como CTA primario**) en vez de
        descubrirlo en la página 14.
  - [x] Medida a 320 / 360 / 390 / 430 / 768 / 900 / 1024 / 1100 / 1280 / 1440 /
        1600 / 1920: **sin scroll horizontal en ninguno**, un solo `<h1>`, sin
        saltos de nivel, 6 seams con el color de tile correcto, FAQ visible ↔
        `FAQPage` **6/6 byte-idénticas**, `<title>` 60 y meta 145. Sin JS
        (scripts desactivados de verdad): 3.394 caracteres de texto real en
        `<main>`, 24 headings, 0 tiles, 0 elementos ocultos. Pasada de scroll
        completa con motion prendido: nada queda en opacidad <1 ni con blur, y
        **0 elementos con `will-change` en reposo**.
  - [x] **2026-08-10 — la sección de Kosten quedó INVERTIDA** (cliente: fondo negro,
        card blanca, sólo en esta sección). Scopeado a `.combo-price`: las otras 26
        páginas que publican ese bloque siguen con la card negra. **De paso arregló
        el ritmo de color**: la card negra obligaba a que su sección fuera clara, lo
        que dejaba Warum + Kosten + FAQ como un solo capítulo claro de tres
        secciones; ahora la página **alterna hasta abajo, 8 seams**. Card blanca con
        los valores de la del formulario (misma página), y medida: label/unit/note
        5,25:1, la cifra 20,87:1, los tics 9,24:1.
  - [x] **Bug de contraste encontrado midiendo y arreglado en las DOS páginas:**
        los links dentro de una respuesta del FAQ heredaban blue-light, que sobre
        el relleno de la card mide **2,87:1**. `.city-faq .faq-item__answer a`
        (page-city.css) ahora usa la mezcla profunda de §5, **4,88:1** — o sea
        también arregla `/sicherheitsdienst-nuernberg/`, donde estaba en vivo.
  - [ ] ⚠️ **Confirmar con Chris:** el texto de anclaje del link al Ratgeber
        ("Wann eine Brandwache vorgeschrieben ist") está **escrito para el build** —
        el draft ahí sólo pone la URL suelta. Es el nombre de la página destino en
        sus propias palabras, misma convención que usó la página de ciudad.
  - [ ] La página enlaza 3 URLs confirmadas que todavía no existen (`/brandwache/`,
        `/ratgeber/brandwache-wann-vorgeschrieben/`, `/einsatzgebiete/`). Es la
        convención del proyecto (§8.3) — y el CTA primario sí es el teléfono real
        y el secundario el formulario vivo de la propia página.
- [x] **Los otros 15 — 2026-08-17.** Webtexte 35–49 (Stand 25.07.2026), verbatim,
      alemán. Con esto **el Bloque 6 está cerrado y no queda un solo link interno
      roto dentro de `<main>` en todo el sitio** (verificado sobre el build: las 54
      páginas, cero 404 — estas 15 cerraron de paso los 4 que arrastraban las
      páginas de servicio).
  - [x] ⚠️ **"Copiar la página y cambiar el copy" era la mitad de la verdad**, igual
        que con las ciudades y los servicios. Los 15 drafts traen **su propia
        estructura a propósito** y lo dicen en su cabecera ("Struktur variiert
        ggü. Brandwache-Kombi", "Struktur-Variation: Prozess früh", "Q&A-lastig"):
        van de **6 a 9 secciones en cuatro formas distintas**. Los BLOQUES sí
        estaban todos construidos. §11 corregido.
  - [x] **Consecuencia: la lista de seams no se puede copiar.** Los tiles son del
        color de la sección de ARRIBA y dos del mismo color no llevan seam (§9.2),
        así que con otro orden cambia entera. Las 16 páginas van de **5 a 7 seams**.
        Se **deriva** de la secuencia de superficies, no se escribe.
  - [x] Por eso se generaron con un script, **de una sola pasada y en desarrollo**
        (`docs/design-sources/combo-pages.py` + `combo_pages_data.py` +
        `combo_drafts.py`), como `city-pages.py` y `service-pages.py`. No corre en
        `npm run build`. Existe por las tres cosas que se rompen a mano y **no se
        ven en una captura**: la paridad FAQ ↔ JSON-LD (**96 pares**), el color de
        cada seam, y los precios como token. Después son páginas normales,
        editables a mano; **no re-correrlo sobre una página ya editada**, y
        `/brandwache-nuernberg/` no está en el script porque el cliente ya la
        revisó varias veces.
  - [x] **Ni una palabra se tipeó**: son ~24.000 palabras de alemán y un error de
        transcripción en copy aprobado no lo caza ninguna medición.
        `combo_drafts.py` sale a máquina de los `.docx` — que **no están en git**,
        así que ese archivo es la única copia versionada de estos 15 drafts.
  - [x] **`css/page-combo.css` se tocó UNA vez**, y por un defecto real de 320px
        (abajo). El chasis, `page-city.css` y los bloques del generador
        (`.city-fields*`, `.city-why--3`, `.service-konzept--4`, `.service-points*`,
        `.service-scope*`, `.service-price` invertida) alcanzaron para las 15.
  - [x] ✅ **DEFECTO REAL ENCONTRADO MIDIENDO, y el síntoma es el peligroso: la
        página no scrolleaba de costado, CLIPEABA.** `.service-hero` es
        `overflow: hidden`, así que el H1 de los 4 Baustellenbewachung se cortaba en
        silencio a 320px — `documentElement.scrollWidth === innerWidth` decía "está
        bien" mientras una palabra perdía sus últimas letras. Causa: base.css pone
        `hyphens: none` en headings y `overflow-wrap: break-word` **no reduce el
        min-content**, así que "Baustellenbewachung" (19 caracteres) fijaba **303px
        contra 280 disponibles**. Arreglado con `hyphens: auto` **abajo de 360px**
        (número medido: entra desde 344; a 400 partiría un H1 que sí tiene lugar y
        un teléfono de 390 rompería "Baustellenbewa-chung" al medio en vez de en el
        espacio). **Lección: chequear cajas pintadas fuera del viewport, no sólo
        scroll horizontal.**
  - [x] **Medido: 16 páginas × 8 anchos** (320 / 344 / 360 / 390 / 768 / 1024 /
        1440 / 1920) = **128 corridas, cero problemas** — sin scroll horizontal,
        nada fuera del viewport, un solo `<h1>`, sin saltos de nivel, cero imágenes
        rotas. Contraste: **954 elementos**, y el único fallo es el caveat sitewide
        del azul del CTA (3,11:1). FAQ ↔ `FAQPage` **96/96 byte-idénticas**.
        El markup servido —lo que recibe un crawler— trae **3.414–4.718 caracteres**
        de texto real en `<main>`, 16–27 headings, **0 tiles y 0 elementos ocultos**.
        Con motion prendido los seams construyen sus 180 tiles cada uno; con
        `prefers-reduced-motion` **0 tiles, los marcadores de título en `100% 100%`**
        (el fallback, no vacíos) y el riel completo.
  - [x] Las 15 entraron a `sitemap.xml` con priority 0.8, agrupadas por ciudad.
        53 URLs, XML válido, todas únicas (`/datenschutz/` sigue afuera a propósito).
  - [ ] ⚠️ **PARA CHRIS — contradicción de precio DENTRO del propio draft.** El
        Webtext 45 (Baustellenbewachung Erlangen) dice en su párrafo de Kosten
        "zwischen **25 und 35** Euro" mientras **la Preis-Box de la misma página**
        renderiza 26-32, y las otras 15 combos dicen 26–32. Se publicó el token
        (26–32): una página que se contradice sobre su propio precio es peor que
        cualquiera de las dos lecturas. Es el mismo defecto que ya tenían 3 páginas
        de servicio.
  - [ ] ⚠️ **PARA CHRIS — dos ejemplos calculados con cifra propia**, publicados
        verbatim y NO tokenizados (tokenizar habría cambiado en silencio el número
        del cliente, y ninguno se contradice con nada en su propia página):
        Webtext 41 §6 dice "1.500 und 2.100 Euro" contra el
        `example.weekendTotal` = 1.550–1.900, y Webtext 43 §6 dice "4.000 und
        6.000 Euro" contra `example.nightPostMonthly` = 5.500–6.800. Si confirma
        que son redondeos sueltos, son dos filas más en la tabla del generador.
  - [ ] ⚠️ **PARA CHRIS — la única edición de puntuación de las 15 páginas.** El
        Webtext 47 §4 mete su notación de link a mitad de frase: "… samt
        Preisrahmen **— → /sicherheitskonzept/,** und binnen eines Werktages …".
        La flecha es una instrucción al builder, no copy, y cualquier forma de
        sacarla deja "— ," o pierde la raya. Se perdió la raya (lee bien en
        alemán) y el destino sobrevive como `.service-link` real.
  - [ ] ⚠️ **`/brandwache/` INVIERTE los CTA en las 4 páginas de Brandwache** (el
        teléfono es el primario), que es la excepción aprobada a G2 y está en cada
        draft. **No normalizarla** contra las otras doce.
  - [ ] 🟡 **Defecto pre-existente encontrado de paso, NO arreglado:** las 9
        páginas de servicio dejan los teléfonos de sus respuestas de FAQ como
        texto literal, sin `tel:` y sin token — o sea contra G4 y G10. Estas 15
        los emiten como link y token (la paridad con el JSON-LD se sostiene porque
        cambia el markup y no el texto). Arreglarlo en las 9 significa
        regenerarlas, y el cliente ya empezó a revisarlas de a una — merece su
        propia pasada.

*Es el tipo de página más corto, pero **no** el más repetitivo: cuatro familias
de estructura, no una.*

### Bloque 7 — Los 3 índices
- [x] `/leistungen/` — **2026-08-09**, copy verbatim del draft 23, alemán.
      **Arregla el 404 más enlazado del sitio**: está en el nav de las 9 páginas
      y en el "Alle Leistungen" del submenú. 6 secciones (hero · grid de 11
      leistungen en 3 grupos · sección de keyword Wachdienst/Wachschutz · warum ·
      FAQ · formulario), 5 seams. Chasis `page-service.css` (§9.1); lo único
      propio es `page-leistungen.css` con el tile grid.
      Medido a 320/390/768/900/1024/1280/1440/1600: sin scroll horizontal, un
      solo `<h1>`, sin saltos de nivel, FAQ visible ↔ `FAQPage` **3/3
      byte-idénticas**, cero fallos de contraste fuera del caveat sitewide del
      azul del CTA (3,11:1), y sin JS **3.659 caracteres de texto real en
      `<main>`** con 0 elementos ocultos. Alto 7.252px a 1440 y 9.538 a 390.
  - [x] **REDISEÑO COMPLETO — 2026-08-10, brief del cliente.** "No mejoren las
        cards cosméticamente": hero a ~70svh con las 3 familias en escenas
        isométricas, capa de **orientación** nueva (3 selectores de capítulo), los
        3 grupos como **capítulos** (numeral azul + título grande + regla), y un
        sistema de cards de **tres pesos** (`--featured` para Objektschutz y
        Werkschutz · base · `--compact`). Se fue "Mehr erfahren" de las 11 cards:
        la card entera es el link. `.hub-*` **no se tocó** — lo usa el journey de
        `/einsatzgebiete/`. Medido a 320→1600: sin scroll horizontal, 5 seams, FAQ
        3/3, cero fallos de contraste fuera del azul del CTA, sin JS 4.118
        caracteres en `<main>`. Detalle en CLAUDE.md.
  - [x] **Los 11 tiles YA llevan icono** — 7 símbolos nuevos en el sprite (key,
        flame, crane, crowd, bag, camera, plan) + los 4 que ya servían. Cierra el
        🔴 de ayer.
  - [x] **"Warum FRANKONIA" rediseñada** (2026-08-10) — cuatro bloques rayados con
        la misma regla azul corta de la sección de keyword, 4-up desde 1100px.
        ⚠️ **Estuvo sin ningún estilo en vivo**: otra sesión borró `.lh-why*` de
        `page-leistungen.css` creyendo que sólo lo usaba `/einsatzgebiete/`, y esta
        página tiene 12 referencias. **Las dos páginas comparten esa hoja — grepear
        las dos antes de podar cualquier `.lh-*`.**
  - [x] **Los 3 iconos de la orientación son arte del cliente** (2026-08-10) —
        `assets/icons/family-*.png`, recortados al arte sólido y cuantizados:
        2,1MB → 12/14/20KB. Van como `<img>` (ningún CSS nuestro entra ahí, así que
        sus rellenos de oclusión no se pueden romper) en una caja fija con
        `object-fit: contain` y `object-position: left bottom`, que es lo que para
        los tres plintos en la misma línea de piso.
  - [x] **La sección de keyword (Wachdienst/Wachschutz) va centrada** (2026-08-10,
        cliente: "está muy tirada ahí nomás… la centraría"). El párrafo se partió en
        dos en el primer punto del draft para promover la respuesta directa —
        **ninguna palabra cambió, verificado uniendo los dos `<p>` contra el docx** —
        y es además ganancia de GEO, porque los motores toman la primera frase bajo
        el heading. Sin hyphenación: en líneas centradas rompía "Kontrollgän-ge".
  - [x] **Los títulos de las 11 cards se marcan con el scroll** (2026-08-10,
        cliente) — el mismo marcador de fondo de `/werkschutz/`
        (`.service-contrast__mark`), no un subrayado. `js/lh-card-marks.js` anima
        `--mark`; relleno `#4673AB`, **4,89:1** con texto blanco. Lleno por defecto
        sin JS y con reduced motion (11/11 verificados), que es el contrato.
  - [x] **Un solo tamaño de card** (2026-08-10, cliente: "mismo tamaño todas") —
        se borraron los tiers `--featured` y `--compact`. ⚠️ **Revierte el punto 5
        del brief original**, que pedía dar más peso a Objektschutz y Werkschutz.
        Medido: 26px de título, 32 de padding, 28 de icono y flecha en las 11.
  - [x] **La página alterna claro/oscuro con seam en cada cambio** (2026-08-10,
        cliente). Orden: hero ▪ foto · Orientierung ▫ · Kapitel ▪ · Keyword ▫ ·
        Warum ▪ · FAQ ▫ · Formular ▪. **7 seams**, de 5 — cuesta ~450px a 1440 y
        ~290 a 390, que es lo que valen dos bandas de disolución más. Las 11 cards
        pasaron al gemelo oscuro (blanco al 4,5 % + hairline, sin sombra): sobre
        negro la sombra no trabaja y un panel blanco encandila, lo mismo que ya
        había encontrado el hub de ciudades. La versión blanca quedó scopeada a
        `.section--light` por si vuelve a hacer falta.
  - [x] **El hero lleva FOTO** (2026-08-10, misma sesión, cliente: "no me gusta que
        no haya un hero definido"). Hero y orientación compartían el mismo negro sin
        seam, así que el hero no terminaba en ningún lado. Las tres escenas
        isométricas bajaron a los selectores de orientación, donde además dejan de
        duplicar lo que esos selectores ya dicen. Contraste medido sobre la foto:
        H1 18,64:1 · lede 13,13:1 · badge 8,49:1 · teléfono 6,40:1.
  - [ ] 🔴 **FALTA UNA FOTO DE HUB DE SERVICIOS.** Ninguna de las landscape del
        proyecto está libre: todas son el hero de alguna página. La que está puesta
        es el apretón de manos de la system-story del homepage, elegida porque no es
        el hero de nadie y su tercio izquierdo es oscuro (57 contra 117 de
        luminancia), pero **mide 1.280px y escala hacia arriba a 1440+**. Pedirle al
        cliente una foto propia, ≥1.920px, con el lado izquierdo tranquilo.
  - [ ] 🔴 **Confirmar con Chris las 3 frases de la orientación** — es el único
        copy nuevo de la página. Cada sustantivo sale de las descripciones que ya
        están abajo, así que no afirma nada que el draft no afirme.
  - [ ] 🔴 **Confirmar con Chris el H2 del cierre.** Era "Welche Leistung brauchen
        Sie? Wir beraten Sie kostenfrei"; con la orientación arriba ésa era la
        tercera vez que la página hacía la misma pregunta. Ahora dice "Sie sind
        nicht sicher, welche Leistung passt?", que es la frase siguiente del propio
        draft, promovida desde el lede que va debajo.
  - [ ] 🟡 **A 390px la página mide 11.300px** (antes 9.538). El aumento es la capa
        de orientación, que es lo que el brief pide; las cards ya se compactaron
        285 → 249px. Si molesta, la palanca es convertir la orientación en tira
        deslizable (`data-swipe-carousel`, ~590px) — no se hizo porque su trabajo
        es que se vean las tres opciones a la vez.
  - [ ] Los 11 destinos son URLs confirmadas que todavía no existen (sólo
        `/werkschutz/` está viva). Es la convención del proyecto (§8.3).
  - [ ] ⚠️ **A confirmar con Chris:** el draft escribe las comillas alemanas
        como `„Wachdienst"` (apertura tipográfica + comilla recta de cierre, no
        `“`). Se publicó **verbatim**; si es un typo del docx, se corrige en las
        3 apariciones de la sección de keyword.
- [x] `/einsatzgebiete/` — **2026-08-09**, copy verbatim del draft 24, alemán.
      Cierra el segundo 404 de nivel nav: está en el footer de las 9 páginas.
      Medido a los mismos 8 anchos: sin scroll horizontal, un `<h1>`, sin saltos
      de nivel, FAQ 3/3 byte-idénticas, sin JS 2.706 caracteres en `<main>` y 0
      ocultos. **Los paneles de ciudad sobre el mapa miden 6,39:1** (verificado
      muestreando píxeles reales, no la cadena de ancestros — ver abajo).
  - [ ] ⚠️ **UWG:** la página no promete tiempos de respuesta ni distancias
        fuera del contexto Bamberg, y dice explícitamente que no hay sucursales.
        No "mejorar" ese copy con claims de velocidad.
  - [ ] ⚠️ **Los números de arriba son de las 11:0x del 2026-08-10 y ya envejecieron:
        otra sesión estaba editando esta página en paralelo** (entró un hero con
        foto y cambió `page-einsatzgebiete.css` a las 11:25–11:29), y el alto a 1440
        pasó de 9.353 a 8.994px por eso, no por el rediseño de `/leistungen/`.
        Re-medir después de que esa sesión cierre. Es el escenario multi-sesión que
        CLAUDE.md ya documenta para este repo.
- [x] `/ratgeber/` + **los 3 artículos** — **2026-08-10**, drafts 30/31/32/33
      verbatim, alemán. Cierra el hub (2 páginas lo enlazaban) y los 2 artículos
      que ya estaban enlazados por nombre desde `/jobs/` y
      `/brandwache-nuernberg/`. Una sola hoja, `css/page-ratgeber.css`, para las
      cuatro: el hub y los artículos son una familia y los tres artículos tienen
      la MISMA forma (H1 · byline · respuesta en 2 frases · 5–6 H2 · FAQ · CTA),
      así que el artículo cuatro es copy, no CSS. Chasis `page-service.css`.
      Medido a 520/768/1440: sin scroll horizontal, un solo `<h1>`, sin saltos de
      nivel, FAQ visible ↔ `FAQPage` **4/4 byte-idénticas en los tres**, 0
      placeholders sin resolver, y **cero 404 dentro de `<main>`**.
  - [x] **Los 3 marcos de Titelbild RESERVADOS — 2026-08-17** (feedback 3.11, "add
        a title image (hero)"). Las fotos no existen todavía, así que cada hero
        lleva un marco 16/9 con etiqueta entre corchetes, el patrón de `.cs-figure`
        y del retrato reservado de Jäger: **el espacio ya está tomado, así que meter
        el `<picture>` después no mueve nada**. Medido en los 3 × 9 anchos
        (320→1920): ratio **1,7778 exacto**, marco **704x396 a 1440**, `hScroll` 0,
        nada fuera del viewport, etiqueta a **8,47:1**. El swap (2 ediciones de
        markup, cero CSS) y el spec de export están en `css/page-ratgeber.css` §1c.
        ✅ **Arregló un bug PRE-EXISTENTE de alineación en 2 de las 3 páginas**: la
        columna del hero es un grid item con `margin-inline: auto`, que **cancela
        `justify-self: stretch`** y la volvía content-sized — su ancho salía del
        largo del byline, así que `kosten` y `brandwache` median 637px auto-centrados
        (borde izquierdo 401,5) contra los 368 de `.rg-article`. **33,5px de
        desalineación**, justo el defecto que el comentario de esa regla decía estar
        evitando. `width: 100%` lo cierra: los 3 ahora dan `h1 == frame == artículo`
        en los 27 anchos medidos. Es la misma trampa que `page-service.css` ya
        documenta para la price card.
        ⚠️ **Costo medido y aceptado: +428px de hero** en las tres (a 1440: 427→855,
        403→831, 348→776). A 1440x900 sigue entrando en la primera pantalla.
  - [ ] ⚠️ **Las 3 etiquetas de esos marcos son INFERIDAS del tema de cada artículo,
        NO del cliente** — los 3 `.docx` del Ratgeber no mencionan imágenes (los tres
        chequeados), al contrario que las 3 case studies, cuyos documentos nombran su
        motivo. **Confirmar con Chris** los tres motivos y pedirle el export:
        **16:9, mínimo 1600x900** (el marco mide 704px de ancho como máximo, así que
        1408 cubre DPR 2 y 1600 deja margen).
  - [ ] ⚠️ **Feedback 3.10.2 pide además Titelbilder en las CARDS del hub** — eso es
        otro marco, con otra proporción, y **no se reservó en esta pasada**. La misma
        foto puede alimentar los dos, pero el recorte de la card es una decisión
        aparte.
  - [ ] ⚠️ **`/ratgeber/kosten-sicherheitsdienst/` perdió la columna "Details" de
        su tabla de precios**, y es una decisión de 404: el draft manda cada una de
        las 9 filas a su página de servicio y **8 de las 9 no existen**. Esa columna
        no cargaba información, sólo links, así que sacarla no le quita nada a la
        página; abajo de la tabla queda una línea a `/leistungen/`. **Cuando salgan
        las páginas de servicio, la columna vuelve como un `href` por fila.**
  - [ ] ⚠️ **Mismo criterio en los otros dos:** `/brandwache/`,
        `/veranstaltungsschutz/`, `/baustellenbewachung/`, `/sicherheitskonzept/` y
        `/sicherheitstechnik/` resuelven hoy a `/leistungen/`, y los CTA de
        conversión a `/angebot/` — que es literalmente lo que el copy promete
        ("kostenfreie Begehung, Angebot in einem Werktag"). Un `href` por link
        cuando existan.
  - [ ] ⚠️ **Confirmar con Chris — 3 huecos del propio draft:** los dos `[PRÜFEN]`
        del artículo 34a (tarifas actuales de la IHK antes de salir a producción, y
        si FRANKONIA cubre el costo del 34a-Schein) y la **fecha**: los tres drafts
        escriben `Stand: [Datum]` y se publicó la fecha de build (2026-08-10) en el
        byline visible y en `datePublished`.
  - [ ] ⚠️ **El artículo 34a habla de "du", los otros dos de "Sie".** Es la
        decisión de los propios drafts (ese apunta a reclutamiento y alimenta
        `/jobs/`, la otra única página del sitio que tutea). **No unificar.**
  - [ ] ⚠️ **Las comillas van `„X"`** — apertura tipográfica U+201E, cierre RECTO
        U+0022, verbatim del docx, igual que en `/leistungen/`. Si es un typo del
        cliente son 4 apariciones entre el hub y el artículo 34a.
  - [ ] 🔧 **`.rg-article` es la SEGUNDA copia del cuerpo de artículo** (`.cs-article`
        en `page-case-study.css` es la primera), con los valores copiados a
        propósito para que las 6 páginas de artículo sean un diseño y no dos
        parecidos. Ese archivo ya pedía replantear §2 en vez de sumar una cuarta
        excepción: la consolidación es un `.article-body` compartido en el chasis
        más un cambio de clase en 3 case studies terminadas. **No se hizo en esta
        pasada porque otra sesión estaba editando `page-service.css`.** Hacerlo
        antes del artículo cuatro.

> ⚠️ **Trampa de medición encontrada acá, vale para cualquier panel translúcido:**
> una sonda de contraste que sube por los ancestros buscando el primer fondo opaco
> da un número FALSO cuando el panel es `position: absolute` sobre algo que no es
> su ancestro. En `/einsatzgebiete/` reportó 2,94:1 (y hasta 1,0:1) para los tiles
> de ciudad, porque componía el panel `rgb(1 1 1 / 0.72)` sobre la sección blanca;
> el backdrop REAL renderizado es `rgb(7 10 12)` y da **6,39:1**. Muestrear los
> píxeles del screenshot con el texto en `visibility: hidden`, no razonar sobre el
> CSS.

### Bloque 8 — Páginas de empresa
- [ ] `/angebot/` — solo formulario, rápida
- [x] `/referenzen/` — **2026-08-03**, texto real del draft 27, alemán, 6 secciones
      (hero · Ergebnis-Kacheln · Kundenstimmen · Kundenlisten · Case Studies ·
      Trust + formulario). Arregla un 404 que ya estaba linkeado desde el header
      y el footer de todas las páginas. Medida sin scroll horizontal en
      320/360/390/430/768/1024/1440.
  - [x] **El rating general de Google entró en la sección de Kundenstimmen —
        2026-08-17** (cliente: "el widget que vemos en todas las otras secciones,
        pero que quede bien en la sección"). Es el MISMO `.review-card--sm` de los
        heroes, markup idéntico; **sólo se overridea la superficie** — relleno
        `rgb(59 73 86 / 0.04)` (el valor exacto de `.testimonial`, copiado) y sin
        sombra, porque un pill blanco con `--shadow-md` sobre una sección blanca se
        lee como objeto elevado arriba de tres cards planas. Va debajo del H2: las
        3 citas son ejemplos, el agregado es la afirmación que respalda.
        Medido a 320→1920: **272→297x48, una fila y 0px de desvío del eje**, cifra
        **8,68:1** y "97 Bewertungen" **5,04:1**, sin scroll horizontal. Valores
        desde `values.json` (G10/G5), y **sin segundo `aggregateRating`** en el
        JSON-LD — es la misma cifra mostrada dos veces.
        ✅ Arregló de paso un defecto a 320px: el pill medía 288 en una columna de
        280 y un `inline-flex` más ancho que su line box **no se centra**, así que
        quedaba 4,1px fuera del eje (sin scroll horizontal, o sea invisible a esa
        sonda). Gap y padding un paso abajo de 400px, los mismos 8/12px que ya usa
        en los heroes.
  - [ ] 🔴 **Falta el texto de las 3 case studies** — el draft lo marca
        `[ERGÄNZEN ... siehe Prüfkatalog F13]`: los resultados de 25.000 € /
        30 % / 20 % escritos como Ausgangslage → Konzept → Ergebnis. No se
        inventaron: la sección publica las 2 Kundenstories que el draft sí da.
  - [ ] 🔴 **Freigaben de los logos (F11 del Prüfkatalog)** — **32 de los 35**
        clientes ya tienen logo (20 exportados desde `assets/logos/`);
        los otros van con el nombre en tipografía, en la misma fila. Si una
        Freigabe vuelve negativa, ese `<img>` vuelve a ser un `<span>`.
  - [ ] 🔴 **Faltan logos de 3 clientes:** Norma · Schöner Leben · nacht arena.
  - [x] ✅ **Brose Bamberg y Bodo Freimuth Tiefbau VOLVIERON** (cliente, Q7 del
        feedback consolidado): nombres restaurados el 2026-08-14 en la posición del
        draft, y sus **logos el mismo día** — Freimuth 3º en Baustellenbewachung,
        el escudo del club 1º en Veranstaltungsschutz.
  - [ ] 🔴 **PARA CHRIS — el logo de "Brose Bamberg" dice "BAMBERG BASKETS".**
        `BroseBamberg.png` es el escudo actual del club de básquet (Brose lo
        auspició hasta 2023; hoy se llama Bamberg Baskets). Encaja con la fila
        —Veranstaltungsschutz, al lado de BBC Coburg y HEITEC Volleys— pero como el
        logo REEMPLAZA al texto, **la cadena "Brose Bamberg" ya no aparece en ninguna
        parte de la página**. Mismo caso que Heltec/HEITEC más abajo: el `alt` sigue
        al arte ("Bamberg Baskets Logo"). Si Chris quería la empresa **Brose
        Fahrzeugteile**, es otro logo y hay que pedirlo.
        ⚠️ **Archivos mal nombrados en el lote del cliente** — se mapean por el
        dibujo, no por el nombre: `Coburg.png` es **Landkreis Coburg**, `Bayerishe.png`
        es **Bayerische Landessiedlung** (no la Bereitschaftspolizei), y el primer
        `Bayernwerk.png` era **Stadt Coburg** (después se reemplazó por el bayernwerk
        de verdad; macOS es case-insensitive, así que la carpeta ya no tiene el
        original de Stadt Coburg — el export en `client-logos/` sí).
  - [ ] 🔴 El draft escribe "Heltec Volley" y el logo dice "HEITEC VOLLEYS" (la
        empresa real es HEITEC). Como ahora va el logo, el nombre mal escrito ya no
        aparece como texto en la página — confirmar la grafía para el resto del sitio.
  - [ ] Las 2 subpáginas de las stories
        (`/referenzen/fall-fehlende-sicherheitsmassnahmen/`,
        `/referenzen/fall-preiswert-zuverlaessig/`) — linkeadas, no construidas.
  - [ ] Con `npm run dev`: el cambio claro/oscuro del header sobre las 3
        secciones blancas (depende de eventos de scroll reales).
- [ ] `/ueber-uns/`
- [x] `/jobs/` — **2026-08-03**, texto real del draft 29, alemán, **con Du-Ansprache**
      (única página del sitio que no dice "Sie" — el draft lo pide explícito), 7
      secciones (hero · Arbeitgeber 4-up · escalera de 5 cualificaciones · 3 pasos
      de postulación · FAQ · formulario de postulación · Weiterlesen). Arregla un
      404 que ya estaba linkeado desde el footer de todas las páginas, y el ítem
      "Karriere" del nav dejó de ser `href="#"`.
  - [ ] 🔴 **Falta el schema `JobPosting`** — el draft lo pide "je offener Stelle,
        gepflegt!" y no hay lista de vacantes: sin título, `datePosted`,
        `validThrough` ni `jobLocation` por puesto no se puede emitir sin
        inventarlo. La página sale con Organization + LocalBusiness + FAQPage +
        BreadcrumbList. Cuando haya vacantes reales, es un nodo más por puesto.
  - [ ] 🔴 **El formulario de postulación no envía nada** (igual que el resto,
        Paso 4) — y acá eso incluye el **upload del Lebenslauf**: el campo existe
        y valida, el archivo no va a ninguna parte hasta que haya backend.
  - [ ] Con `npm run dev`: el cambio claro/oscuro del header sobre las 4 secciones
        blancas, y el `<select>` + el botón del file input en un navegador real
        (la etiqueta del botón la pone el navegador, en su idioma).

### Bloque 9 — Blog
- [ ] Layout de artículo (nuevo)
- [ ] 3 artículos: § 34a · Costos · Brandwache

### Bloque 10 — Legales
- [x] ✅ **`/impressum/` — CONSTRUIDA 2026-08-14** (feedback del cliente 2026-08-13,
      Q1: "take it 1:1 from the current live site"). Texto traído de la página
      viva, **verbatim**, no del paste (que había aplanado la jerarquía de
      headings). Las dos sociedades (Sicherheitsdienst KG y Werkschutz KG) más el
      Haftungsausschluss completo.
      **Única desviación, estructural y no textual:** la página viva salta
      h1 → h3 → h4; acá es h1 → h2 → h3, porque "1:1" es sobre el TEXTO y no una
      licencia para reproducir un defecto de accesibilidad.
      ⚠️ **DOS COSAS PARA EL ABOGADO DE CHRIS, publicadas tal cual:** el enlace ODR
      es `http://` (no https) y la plataforma ODR de la UE se dio de baja en 2025,
      así que esa frase puede estar obsoleta entera; y "finden **sie**" va en
      minúscula donde corresponde el "Sie" formal. Ninguna de las dos es nuestra
      para cambiar.
- [x] ✅ **`/datenschutz/` — SHELL CONSTRUIDA 2026-08-14** (Q1: "we will integrate
      an automatic privacy-policy scanner… Plan the page as a shell for now").
      **Cierra el único enlace roto del sitio con consecuencia legal**: el checkbox
      de consentimiento del formulario compartido decía "Ich habe die
      Datenschutzerklärung gelesen und stimme zu" y ese enlace daba 404 en las 13
      páginas que llevan el formulario.
      **Nada del `<main>` es texto legal inventado**: sólo el Verantwortlicher
      (verificable desde el Impressum) y un aviso interino que dice que el
      documento se está finalizando y a dónde escribir mientras tanto.
      ⚠️ **DOS PENDIENTES CUANDO LLEGUE EL SCANNER:** (1) **el CSP lo va a
      bloquear** — `vercel.json` publica `script-src 'self'` sin terceros, así que
      un scanner servido como `<script>` externo (eRecht24, Usercentrics y todos)
      se bloquea en silencio y la página queda vacía; hay que agregar su host a
      `script-src` y a `connect-src`. (2) **sacar el `noindex`**, que está puesto a
      propósito mientras el texto sea un placeholder. El destino de la inyección es
      `#datenschutz-inhalt`.
      ⚠️ Por el `noindex`, `/datenschutz/` **NO está en sitemap.xml** — agregarla el
      mismo día que se saque.

---

## Paso 4 — Que el sitio funcione de verdad 🔴

Esto no depende de programar, depende de decisiones y accesos. **Conviene
empezarlo ya, en paralelo con el Paso 1**, porque es lo que suele frenar los
lanzamientos con todo lo demás listo.

- [ ] **El formulario no envía nada.** Hay que decidir a dónde van los mensajes.
      Es el objetivo principal del sitio.
- [ ] **Banner de cookies** — elegir la herramienta
- [ ] **Google Analytics y Ads** — hacen falta los accesos
- [ ] **Anti-spam** en los formularios. El honeypot ya está en
      `css/lead-form.css` + en el markup de `/werkschutz/` y `/kontakt/`;
      **falta el div en el formulario de la homepage**
- [ ] **Sistema para cargar referencias** sin tocar código — sin decidir
- [ ] **Número real de WhatsApp** — hoy hay uno falso en todas las páginas

---

## Paso 5 — Publicar

- [ ] **Redirigir las URLs viejas de WordPress** 🔴 falta la lista.
      Sin esto se pierde el posicionamiento que ya tienen en Google.
- [x] Traducir al alemán las páginas que falten — **cerrado 2026-08-17**: las 52
      están en alemán, `lang="de"` y `og:locale="de_DE"`. Ya no queda nada en
      inglés en el sitio (la homepage inglesa se borró el 2026-08-14, Q8).
- [x] Arreglar enlaces rotos que ya están online — **cerrado 2026-08-17** con las
      15 combos. Verificado sobre el build entero: en las 54 páginas, **cero links
      internos rotos dentro de `<main>`**. El índice de servicios, las 10 ciudades
      y las 16 combos existen todos.
      ⚠️ Lo único que queda "roto" a propósito es `/datenschutz/`, que existe pero
      lleva `noindex` mientras su texto sea placeholder.
- [ ] Confirmar los números "300+", "1.000.000+" y "10+" con el cliente
- [ ] Revisar velocidad y accesibilidad de cada página
      *Caveat conocido que va a aparecer en la auditoría:* el blanco sobre el azul
      de marca `#3D9AD3` da 3,11:1. Pasa para botones y texto grande, no para
      texto normal — y está usado como fondo con párrafos en las 4 tarjetas de
      Anwendungsfälle de `/werkschutz/` (decisión del cliente 2026-08-03). La
      salida, si se decide cambiarlo, está en
      [design-system §7](design-system.md#7-contraste).
- [ ] Dar de alta en Google Search Console

---

## Tres decisiones pendientes

| | Por qué importa |
|---|---|
| 🔴 ¿Vamos con el sistema de textos del Paso 2? | define si son 49 páginas a mano o generadas |
| ✅ ¿Forchheim o Hof? | **Resuelto por el cliente, Change Request 8 (2026-08-14):** Forchheim es ciudad enlazada (tiene página); Hof, Kronach, Kulmbach, Lichtenfels y Schwandorf son Einsatzgebiete **sin** página propia — van como pastillas sin link y marcados en el mapa del homepage. Son 10 páginas de ciudad, no 11 |
| 🔴 ¿El sitio en inglés se completa? | son 49 páginas o casi 100 |
