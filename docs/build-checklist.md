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

De 52 páginas hay 8 terminadas (homepage, Kontakt, Werkschutz, Referenzen, Jobs
y las **3 case studies**) — Werkschutz espera aprobación como plantilla y Jobs
espera la lista real de vacantes para poder emitir el schema `JobPosting`.

**El total pasó de 49 a 52 páginas el 2026-08-05**: el copy v2
(`NewVersionCopiesFrankonia/`) agrega los Webtexte 50–52, las tres case studies
anonimizadas. Ya están construidas, así que el `[ERGÄNZEN]` que Referenzen
arrastraba desde el 2026-08-03 **está cerrado**.

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
- [ ] 🔴 **Retrato de Alexander Jäger** — la sección Ansprechpartner tiene el marco
      4:5 reservado y etiquetado; entra cambiando un `<p>` por un `<picture>`.
      Decisión del cliente: marco vacío antes que la foto de otra persona al lado
      de su nombre.
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

### Bloque 2 — Segundo servicio de prueba (1 página)
- [ ] `/objektschutz/` — armarla **sin diseñar nada nuevo**

*Si sale sin tocar CSS, la plantilla sirve. Si no, se arregla ahora y no 9 veces.*

### Bloque 3 — Los 9 servicios restantes
- [ ] Sicherheitstechnik · Brandwache · Kaufhausdetektei · Veranstaltungsschutz ·
      Sicherheitskonzept · Baustellenbewachung · Revier-Schliessdienst ·
      Empfangsdienst · Interventionsdienst

*Las 10 fotos de servicio ya están. Esto es ensamblado.*

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

### Bloque 5 — Las 9 ciudades restantes
- [ ] Würzburg · **Bamberg** · Erlangen · Fürth · Bayreuth · Schweinfurt ·
      Coburg · Forchheim · Ansbach
- [ ] Cada una: copiar la página de Nürnberg, cambiar copy + meta + JSON-LD
      (`areaServed`), correr `city-outline.py <slug>` para el contorno, cambiar
      las vecinas y el `prefix` del formulario. **`page-city.css` no se toca.**
- [ ] ⚠️ **Bamberg es la única con estructura distinta**: es el único sitio con
      dirección real, así que va con NAP completo + geo, badge "Unser Zuhause:
      Sitz in Bamberg" y una Zuhause-Story en vez de las 4 tarjetas de "Warum".
      Su draft lo marca como "Struktur-Variante Heimmarkt". Es una sección
      distinta, no una hoja de estilos distinta.

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
- [ ] Los otros 15 — copiar la página, cambiar copy + meta + JSON-LD + contorno +
      `prefix` del formulario. **`page-combo.css` no se toca.** Ojo: las otras tres
      de Nürnberg varían su sección 2 a propósito (Objekt-Typen / Industrie-Fokus /
      Bauphasen) y **su hero lidera con el formulario, no con el teléfono**.

*Es el tipo de página más corto y el más repetitivo. Puro ensamblado.*

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
  - [ ] 🔴 **Falta el texto de las 3 case studies** — el draft lo marca
        `[ERGÄNZEN ... siehe Prüfkatalog F13]`: los resultados de 25.000 € /
        30 % / 20 % escritos como Ausgangslage → Konzept → Ergebnis. No se
        inventaron: la sección publica las 2 Kundenstories que el draft sí da.
  - [ ] 🔴 **Freigaben de los logos (F11 del Prüfkatalog)** — **31 de los 34**
        clientes ya tienen logo (20 exportados desde `assets/logos/`);
        los otros 12 van con el nombre en tipografía, en la misma fila. Si una
        Freigabe vuelve negativa, ese `<img>` vuelve a ser un `<span>`.
  - [ ] 🔴 **Faltan logos de 3 clientes:** Norma · Schöner Leben · nacht arena.
  - [ ] 🔴 **Brose Bamberg y Bodo Freimuth Tiefbau se sacaron de las listas**
        (cliente, 2026-08-04) aunque están en el roster del draft 27 — confirmar que
        fue una decisión de Freigabe y no un olvido, porque el texto del cliente
        todavía los nombra.
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
- [ ] 🔴 `/impressum/` y `/datenschutz/` — **son las 2 únicas páginas sin texto**

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
- [ ] Traducir al alemán las páginas que falten (Werkschutz ✅ 2026-08-03)
- [ ] Arreglar enlaces rotos que ya están online: el índice de servicios y las
      10 ciudades se enlazan pero no existen
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
| 🔴 ¿Forchheim o Hof? | frena las páginas de ciudad |
| 🔴 ¿El sitio en inglés se completa? | son 49 páginas o casi 100 |
