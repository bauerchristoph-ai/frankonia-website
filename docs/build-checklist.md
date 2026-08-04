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

De 49 páginas hay 5 terminadas (homepage, Kontakt, Werkschutz, Referenzen, Jobs) —
Werkschutz espera aprobación como plantilla, Referenzen espera el copy de las
tres case studies que su propio draft marca como `[ERGÄNZEN]`, y Jobs espera la
lista real de vacantes para poder emitir el schema `JobPosting`.

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
| ~~**Case studies**~~ | 1 | ✅ hecho en Referenzen (`.ref-case*`) — falta el texto de las 3 🔴 |

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
- [ ] 🔴 Cambiar las 6 fotos placeholder del Leistungsumfang por las reales
      (hoy son 4 reusadas de la home + 2 exportadas de fotos sin uso)
      *No hacen falta fotos de industria para Anwendungsfälle: esas 4 tarjetas
      son cards azules sin foto desde el 2026-08-03.*
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
- [ ] `/sicherheitsdienst-nuernberg/` — la más importante
- [ ] 🔴 **Conseguir fotos de ciudad: no hay ninguna**
- [ ] Reusar: índice de servicios · barra de confianza · pastillas · formulario
- [ ] Nuevo acá: casi nada, salvo el bloque de precios en versión corta

### Bloque 5 — Las 9 ciudades restantes
- [ ] Würzburg · Bamberg · Erlangen · Fürth · Bayreuth · Schweinfurt ·
      Coburg · Forchheim · Ansbach

### Bloque 6 — Primer combo + los 15 restantes
- [ ] `/brandwache-nuernberg/` de prueba (7 secciones, todas ya existentes)
- [ ] Los otros 15

*Es el tipo de página más corto y el más repetitivo. Puro ensamblado.*

### Bloque 7 — Los 3 índices
- [ ] `/leistungen/` ← **arregla un 404 que ya está online**
- [ ] `/einsatzgebiete/`
- [ ] `/ratgeber/`

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
