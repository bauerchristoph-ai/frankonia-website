# FRANKONIA — Sistema visual

Los valores: color, tipografía, espaciado, radios, sombras, movimiento. **Qué
existe y cuándo se usa cada uno.**

**La fuente de verdad es [`css/tokens.css`](../css/tokens.css)**, no este
archivo. Acá está el mapa legible y el *porqué*; ahí están los valores que el
navegador realmente usa. Si los dos difieren, gana `tokens.css` y hay que
corregir esto.

Nunca escribas un hex de marca fuera de `tokens.css`. En un componente se
consume el alias semántico (`var(--color-accent)`), no el color crudo
(`var(--color-blue-light)`).

**Dónde está cada cosa:**

| Necesitás | Está en |
|---|---|
| El valor de un token | `css/tokens.css` |
| Qué token usar y por qué (este doc) | acá |
| Cómo se arma una página con esto | [page-conventions.md](page-conventions.md) |
| El componente ya construido | `css/components.css` |
| Reglas del proyecto y decisiones del cliente | [../CLAUDE.md](../CLAUDE.md) |

---

## Índice

1. [Color](#1-color)
2. [Tipografía](#2-tipografía)
3. [Espaciado y layout](#3-espaciado-y-layout)
4. [Radios, sombras, z-index](#4-radios-sombras-z-index)
5. [Movimiento](#5-movimiento)
6. [Botones y CTA](#6-botones-y-cta)
7. [Contraste: la tabla que hay que mirar antes de pintar algo](#7-contraste)

---

## 1. Color

### La paleta de marca — cinco colores, no se agregan tonos

| Token | Hex | Para qué |
|---|---|---|
| `--color-logo-black` | `#010101` | el fondo de la página |
| `--color-white` | `#FFFFFF` | texto sobre oscuro, superficies claras |
| `--color-gray` | `#3B4956` | superficie elevada (cards, footer) |
| `--color-blue-light` | `#3D9AD3` | **el azul de marca en reposo** |
| `--color-blue-dark` | `#5287C9` | hover del primario + azules sobre blanco |

Desde 2026-07-28 `#3D9AD3` es el azul en reposo de todo el sitio y `#5287C9`
quedó reservado a dos usos: el hover de los botones azules, y los azules que
caen sobre superficie blanca (donde el claro no llega al contraste).

### Alias semánticos — esto es lo que se usa en componentes

| Alias | Resuelve a | Cuándo |
|---|---|---|
| `--color-bg` | negro | fondo de página |
| `--color-bg-elevated` | gris `#3B4956` | lo que tiene que despegarse del fondo: cards, footer |
| `--color-bg-subtle` | blanco 3% | secciones apenas separadas del fondo |
| `--color-bg-inverse` | blanco | invertir contra el negro (hoy solo el skip-link) |
| `--color-text` | blanco | texto |
| `--color-text-muted` | blanco 65% | texto secundario, ledes, labels |
| `--color-accent` / `--color-accent-strong` | `#3D9AD3` | acentos, iconos, bordes |
| `--color-accent-subtle` | azul 16% | fondo de chips e iconos |
| `--color-border` | blanco 12% | hairlines, divisores |
| `--color-border-strong` | blanco 42% | borde de un control (input, botón secundario) |
| `--color-link` | acento | links |
| `--color-focus-ring` | **blanco** | el anillo de foco, en todo el sitio |

El anillo de foco es blanco a propósito: tiene que funcionar sobre negro, sobre
las cards grises y adentro del formulario sin saber en cuál va a caer. En
páginas claras se sobreescribe a `--color-blue-dark` (ver
[page-conventions §5](page-conventions.md#5-página-clara-sobre-un-sitio-oscuro)).

### Excepciones documentadas — no se extienden

Cada una tiene una razón y un alcance de un solo componente:

| Color | Dónde | Por qué |
|---|---|---|
| `--color-pain-red` `#C62828` | `.pain-hook__mark` | el rojo lee como "problema" |
| Rojo del cubo de riesgo | `konzept-seq.css`, capa 2 | mismo idioma: riesgo = rojo |
| Verde WhatsApp | `whatsapp-icon.png` | reconocimiento de un servicio de terceros |
| Dorado `#F5B400` | `.review-card`, Referenzen | la estrella de Google |
| `#FAFAFA` | sección Uniformes | es la sección clara del sitio oscuro |
| `--color-logo-tile` `#1E1E1E` | tiles de logos de clientes | superficie puntual pedida por el cliente |

Una excepción más, en sentido contrario: la estrella de la barra de confianza
de la home (`.sticky-story__metric-star`) es **azul**, no dorada — pedido del
cliente 2026-08-03. Las otras estrellas del sitio siguen doradas.

---

## 2. Tipografía

**Familia:** `"Helvetica Neue", Helvetica, Arial, sans-serif`. No hay archivo de
fuente: Helvetica real no se puede self-hostear sin licencia paga de Monotype,
así que en macOS/iOS sale Helvetica Neue y en el resto Arial, que es
métricamente compatible. Es la solución acordada con el cliente, no un
placeholder.

**Pesos:** `400` (regular) y `800` (extra bold). Existe `--font-weight-light`
(300) para el título de sección grande, pero contra este stack es un *pedido*,
no una garantía — ni Helvetica Neue ni Arial traen una Light en todos los
sistemas, así que muchos navegadores devuelven Regular. No lo uses en otro
lado.

**Escala fluida** — un solo ratio (1,25, tercera mayor) desde 16px en el
extremo desktop. Interpola entre 400px y 1440px de viewport:

| Token | Móvil | Desktop | Uso típico |
|---|---|---|---|
| `--font-size-sm` | 14px | 15px | labels, microcopy, eyebrows |
| `--font-size-base` | 16px | 16px | cuerpo (fijo, no escala) |
| `--font-size-md` | 18px | 20px | lede de sección |
| `--font-size-lg` | 21px | 25px | subtítulos |
| `--font-size-xl` | 25px | 31px | H3 |
| `--font-size-2xl` | 30px | 39px | — |
| `--font-size-3xl` | 36px | 49px | — |

`sm` es la excepción del ratio a propósito: 16/1,25 daría ~13px y a ese tamaño
la legibilidad pierde más de lo que gana la pureza de la escala.

**Los títulos de página y de sección NO salen de esta escala** — tienen su
propio clamp, con su tabla, en
[page-conventions §2](page-conventions.md#2-títulos). Resumen:
`clamp(2.25rem, 0.4rem + 3.7vw, 3.75rem)` en peso regular para H1 y H2, y un
clamp más chico para el título que comparte fila con un formulario.

**El `letter-spacing: -1px` de los títulos es para títulos GRANDES.** base.css lo
aplica a todo `h1–h6` (pedido del cliente 2026-07-20). A 48–60px es ≈-2% y se lee
como intención; a 16px el mismo -1px es **-6%** y las letras se chocan. Si un
elemento es un heading por semántica pero se ve como texto de cuerpo — la pregunta
de un FAQ es el caso — dale métricas de cuerpo: `letter-spacing: normal` y
`--line-height-base`. Ya está hecho en `.faq-item summary h3` (components.css), o
sea en **todos los FAQs del sitio**.

**Interlineado:** `--line-height-tight` 1,2 (títulos grandes) ·
`--line-height-heading` 1,25 · `--line-height-base` 1,6 (cuerpo).

**Alemán:** `overflow-wrap: break-word` es global; `hyphens: auto` está solo en
prosa (`p`, `li`, `blockquote`), nunca en títulos. En listas de etiquetas
(nombres de servicios, chips) hay que **apagar** la separación silábica y poner
`overflow-wrap: anywhere` + `min-width: 0`: un compuesto como
"Fremdfirmen-Koordination" fija el ancho mínimo de su columna y genera scroll
horizontal. Ya pasó dos veces.

---

## 3. Espaciado y layout

Escala de 4px. Se usa el token, nunca un `rem` suelto:

| | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| `--space-` | 4px | 8px | 12px | 16px | 24px | 32px | 48px | 64px | 96px | 128px |

**Contenedor:** `--container-max-width` 1600px ·
`--container-padding` `clamp(0.75rem, 2vw, 1.5rem)` (12→24px).

**`--content-inset`** `clamp(3rem, 5.5vw, 6rem)` (48→96px) es el margen
editorial de las columnas de contenido. Es **adicional** al padding del
contenedor y va **en los dos lados**. En teléfono baja a `--space-2`. Las
reglas completas de cómo aplicarlo están en
[page-conventions §1](page-conventions.md#1-márgenes-el-inset-es-simétrico) —
es el error que más veces se repitió.

**Breakpoints** (literales, no se pueden usar custom properties en `@media`;
mobile-first, `min-width` hacia arriba):
480 · 768 · 1024 · 1280 · 1440. El nav pasa a hamburguesa en **1400px**, que no
es de esta lista: ver el comentario de esa media query en `site-chrome.css`.

---

## 4. Radios, sombras, z-index

`--radius-sm` 4px · `--radius-md` 8px · `--radius-lg` 16px · `--radius-pill`
999px. La dirección del proyecto viene siendo *menos* redondeo, no más: varias
piezas bajaron de `lg` a `md` por pedido del cliente.

`--shadow-sm` / `--shadow-md` / `--shadow-lg`. Sobre fondo negro casi no se ven
— la sombra es una herramienta de las páginas claras (la card del formulario).
Para separar algo del fondo en el sitio oscuro, la respuesta es
`--color-bg-elevated` o un hairline, no una sombra.

`--z-sticky` 100 (header) · `--z-overlay` 200 (WhatsApp) · `--z-modal` 300 ·
`--z-toast` 400. Leaflet maneja sus propias capas internas hasta ~650.

---

## 5. Movimiento

`--duration-fast` 150ms · `--duration-base` 250ms · `--duration-slow` 400ms ·
`--duration-slower` 550ms (el cambio de tema del header).

Dos curvas, con roles distintos:

- `--easing-standard` `cubic-bezier(0.4, 0, 0.2, 1)` — hovers, toggles,
  cualquier cosa que responde a una acción.
- `--easing-premium` `cubic-bezier(0.16, 1, 0.3, 1)` — contenido que **entra en
  escena** (scroll reveals, títulos). Expo-out, sin rebote.

`prefers-reduced-motion` se maneja en **un solo lugar**, `css/motion.css`. No
agregues un segundo bloque. El contrato de que el JS solo mejora y nunca
esconde contenido está en
[page-conventions §4.5](page-conventions.md#45-el-contrato-que-no-se-rompe-nunca).

**Una excepción a "un solo lugar", y es a propósito:** cuando el LAYOUT (no la
animación) solo tiene sentido si la animación corre, la query de CSS que lo
activa lleva `and (prefers-reduced-motion: no-preference)`, y el JS usa la misma
condición con `gsap.matchMedia()`. Ejemplo: la pila de fotos del Leistungsumfang
(`.service-flow`, page-service.css) — apilarlas sin la animación que las despeja
dejaría cinco fotos escondidas detrás de la primera. `motion.css` sigue siendo
el único lugar que apaga duraciones; esto decide qué layout se usa, que es otra
cosa.

**Catálogo de motion ya construido** (se carga, no se reescribe — la lista con
los `<script>` en orden está en
[page-conventions §4](page-conventions.md#4-efectos)): scroll suave (Lenis),
títulos letra por letra, listas en cascada, texto general, bloque completo,
entrada del hero, disolución de píxeles entre secciones, e imagen fija con
máscara.

**Un solo Lenis por página.** Lo monta `js/smooth-scroll.js` y lo comparten
todos los efectos vía el ticker de GSAP. Si copiás un snippet de internet que
hace `new Lenis(...)`, borrá esa parte: dos instancias se pelean por el scroll.

---

## 6. Botones y CTA

Los valores y las reglas están en
[page-conventions §3](page-conventions.md#botones-y-cta) — no los duplico acá
para que no se desincronicen. Lo mínimo:

- **Primario** `.btn .btn--primary`: fondo `#3D9AD3`, texto blanco, pill, hover
  `#5287C9`. Trae solo un brillo que lo cruza cada 5s.
- **Secundario** `.btn .btn--secondary`: transparente + borde
  `--color-border-strong`.
- `--sm` / `--lg` solo cambian el padding.
- **Un solo primario por pantalla.** Si hay dos azules compitiendo, uno es
  secundario.
- La flecha diagonal es opt-in (`.btn__arrow`), para los CTA de verdad.
- **El brillo se reutiliza, no se redeclara.** Vive en `@keyframes btn-shine`
  (components.css) y es global: cualquier superficie que quiera el mismo reflejo
  lo referencia desde su propio `::after`. Ejemplo: `.service-cases__item`
  (page-service.css). Si lo aplicás sobre párrafos y no sobre una etiqueta de
  cuatro palabras, bajá la opacidad de la banda (0,28 en vez de 0,42) y ponelo
  **detrás** del contenido — arriba se lee como un reflejo molesto sobre el texto.
  Y si el fondo es azul relleno, leé §7 antes: el azul del CTA no sirve ahí.

---

## 7. Contraste

Los números están **medidos**, no estimados. El sitio es oscuro, así que un
número "sobre blanco" recordado de otro proyecto acá no sirve.

### Sobre negro (`--color-bg`) — todo bien

| | Ratio | |
|---|---|---|
| Blanco | 21:1 | ✅ |
| Blanco 65% (`--color-text-muted`) | >7:1 | ✅ |
| `#3D9AD3` | 6,8:1 | ✅ texto normal |
| `#5287C9` | 5,7:1 | ✅ texto normal |
| `--color-border-strong` | 3,7:1 | ✅ borde de control |

### Sobre gris elevado (`#3B4956`) — **acá se rompe**

| | Ratio | |
|---|---|---|
| `#3D9AD3` | 3,0:1 | ❌ no llega ni a 3:1 |
| `#5287C9` | 2,5:1 | ❌ |

**Ningún azul funciona sobre una card gris.** Todo acento azul que caiga sobre
`--color-bg-elevated` va en blanco. Ya está corregido en varios lugares
(`.pain-card .icon`, `.stat__value`, el borde de foco del formulario);
verificalo antes de agregar uno nuevo.

### Sobre blanco (páginas y secciones claras)

| | Ratio | |
|---|---|---|
| `#3D9AD3` | 3,1:1 | ⚠️ solo texto grande / objeto gráfico |
| `#5287C9` | 3,7:1 | ⚠️ solo texto grande / objeto gráfico |
| `--color-gray` `#3B4956` | 9,2:1 | ✅ es el color de texto de las páginas claras |

### Sobre azul de marca **relleno** (una card, no un botón)

| Fondo | Texto blanco | |
|---|---|---|
| `#3D9AD3` (el fill del CTA) | 3,11:1 | ⚠️ botón sí, párrafos no |
| `#5287C9` (su hover) | 3,71:1 | ⚠️ ídem |
| `color-mix(--color-blue-dark 85%, --color-logo-black)` `#4673AB` | 4,88:1 | ✅ texto normal |
| `color-mix(--color-blue-dark 70%, --color-logo-black)` `#3A5F8D` | 6,56:1 | ✅ texto normal |

**3:1 es la barra de un botón**, que es un componente de interfaz — y ese 3,11 es
un caveat aprobado por el cliente (ver tokens.css). Una **superficie rellena con
párrafos encima** es texto normal y la barra es 4,5:1.

**Decisión del cliente (2026-08-03): igual se usa `#3D9AD3` como fondo de card.**
Se le planteó el número y lo reafirmó — "tiene que ser el mismo azul del CTA". Así
que las 4 tarjetas de Anwendungsfälle de `/werkschutz/`
(`.service-cases__item`, page-service.css) van con el azul del CTA y texto
**blanco puro**, y queda anotado como el mismo tipo de caveat conocido que ya
carga el botón primario — no como algo a "arreglar" por cuenta propia.

Dos cosas que sí son regla:

- **Blanco puro, sin niveles de alpha.** Sobre `#3D9AD3` el blanco ya está en
  3,11:1; cualquier transparencia lo baja más. La jerarquía se hace con tamaño y
  peso, no con opacidad.
- **Si alguna vez se revisa**, la salida barata es un fondo más profundo con
  `color-mix` sobre el token (no un azul nuevo):

  ```css
  /* 4,88:1 y 6,56:1 con blanco */
  color-mix(in srgb, var(--color-blue-dark) 85%, var(--color-logo-black))
  color-mix(in srgb, var(--color-blue-dark) 70%, var(--color-logo-black))
  ```

### Superficie negra brillosa — la otra forma de resolver lo mismo

Si lo que querés es una card premium con brillo y **sin** el problema de
contraste: fondo `--color-logo-black`, un aclarado diagonal muy leve del relleno,
un highlight de 1px arriba, y el sweep del botón. Blanco encima da **20,9:1**
(contra 9,2:1 de la card gris `#3B4956` que reemplazó), y encima ahí sí podés usar
cualquier azul de marca, porque contra negro los dos pasan.

Ejemplo real: la card de precio de `/werkschutz/` (`.service-price__box`).

En los dos casos, cuando el brillo cruza una card **con párrafos**: banda al
0,22–0,28 en vez del 0,42 del botón, y **detrás** del contenido (`z-index: 1` en
los hijos). Encima del texto se lee como un destello sobre las palabras.

Ninguno de los dos azules llega a 4,5:1 sobre blanco, así que **ningún texto
chico azul sobre blanco**. Para texto grande (≥24px o ≥19px en negrita) y para
objetos gráficos el mínimo es 3:1 y los dos pasan. Casos reales que se apoyan
en esto: el "+" y la estrella de la barra de confianza (32–48px), los eyebrows
de sección clara usan `--color-gray` justamente porque son chicos.

### El caveat aceptado

Texto blanco sobre el botón azul da **3,1:1** (y 3,7:1 en hover): pasa el
mínimo de componente de interfaz y de texto grande, no el 4,5:1 de texto
normal. Es el botón de marca aprobado por el cliente y se usa así en todo el
sitio — queda anotado como limitación conocida, no como algo a "arreglar" por
cuenta propia. Si alguna vez se revisa, la salida barata es agrandar el texto
del botón hasta el umbral de texto grande, no cambiar el azul.
