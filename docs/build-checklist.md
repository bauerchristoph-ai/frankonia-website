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
