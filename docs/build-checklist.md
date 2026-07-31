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

De 49 páginas hay 2 terminadas y 1 a medias.

- [ ] Ver la homepage en un teléfono real
- [ ] 🔴 Subir `content-de/` a git — son los 49 textos y **no están guardados**

---

## Qué se reusa y qué hay que diseñar

Cruzando lo que piden los 49 textos contra lo que ya está construido:

### Se reusa de la homepage (funciona, hay que sacarlo de `page-home.css`)
| Sección de la home | Se vuelve a usar en |
|---|---|
| Índice de servicios | hub Leistungen · 10 ciudades |
| Resultados + testimonios | Referenzen · servicios · ciudades |
| Barra de confianza (números + logos) | ciudades · servicios |
| Pastillas de ciudades | Einsatzgebiete · ciudades · cierres |
| Formulario de cierre | **las 49 páginas** |
| FAQ | 36 páginas ✅ *ya compartido* |

### Se reusa de Werkschutz (ya existe, hay que generalizar)
Hero de servicio · tarjetas de riesgo · alcance del servicio · casos de uso ·
pasos concretos · bloque de confianza con persona de contacto

### Hay que diseñar de cero
| | Usos | Dónde aparece |
|---|---|---|
| **Precios** | **27** | casi toda página de servicio, ciudad y combo |
| **Sicherheitskonzept compacto** | 11 | servicios (la home tiene la versión grande de 3 cubos) |
| **Layout de artículo** | 4 | blog |
| **Tabla comparativa** | 4 | servicios · guía de precios |
| **Formulario de postulación** | 1 | Jobs (con selector de puesto + subir CV) |
| **Case studies** | 1 | Referenzen |

**Sobre mobile:** no es una fase aparte. La homepage costó porque cada sección
era única. Si cada bloque se construye responsive **cuando se construye**, las
48 páginas restantes ya nacen andando en teléfono. Solo hay que revisar las
plantillas nuevas, no las 49 páginas.

---

## El orden concreto

### Bloque 1 — Terminar Werkschutz de verdad (1 página)
Es la plantilla de servicio. Hoy está con relleno y en inglés.
- [ ] Cargarle el texto real (draft 03)
- [ ] **Construir el bloque de Precios** ← lo necesita, y es el que más se repite
- [ ] Construir el Sicherheitskonzept compacto
- [ ] Traducir al alemán
- [ ] Revisar en teléfono
- [ ] Aprobar como plantilla

*Al terminar esto quedan resueltos los 2 bloques nuevos más usados.*

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
- [ ] `/referenzen/` — necesita el bloque de case studies
- [ ] `/ueber-uns/`
- [ ] `/jobs/` — necesita el formulario de postulación

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
- [ ] **Anti-spam** en los formularios
- [ ] **Sistema para cargar referencias** sin tocar código — sin decidir
- [ ] **Número real de WhatsApp** — hoy hay uno falso en todas las páginas

---

## Paso 5 — Publicar

- [ ] **Redirigir las URLs viejas de WordPress** 🔴 falta la lista.
      Sin esto se pierde el posicionamiento que ya tienen en Google.
- [ ] Traducir al alemán las páginas que falten (Werkschutz debe la suya)
- [ ] Arreglar enlaces rotos que ya están online: el índice de servicios y las
      10 ciudades se enlazan pero no existen
- [ ] Confirmar los números "300+", "1.000.000+" y "10+" con el cliente
- [ ] Revisar velocidad y accesibilidad de cada página
- [ ] Dar de alta en Google Search Console

---

## Tres decisiones pendientes

| | Por qué importa |
|---|---|
| 🔴 ¿Vamos con el sistema de textos del Paso 2? | define si son 49 páginas a mano o generadas |
| 🔴 ¿Forchheim o Hof? | frena las páginas de ciudad |
| 🔴 ¿El sitio en inglés se completa? | son 49 páginas o casi 100 |
