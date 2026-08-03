# FRANKONIA — Baseline de una página

Lo que **toda** página nueva tiene que tener, ya resuelto, para no volver a
descubrirlo página por página. Nació el 2026-07-31 armando `/kontakt/`: varias
de estas cosas faltaron ahí y se agregaron después.

**Este documento crece.** Cada vez que se decide un efecto, un componente o una
regla que aplica a más de una página, se agrega acá en el mismo commit. Si algo
está en el código pero no acá, la próxima página se lo va a olvidar.

Esto es el "cómo se construye una página". El *qué* construir está en
[build-checklist.md](build-checklist.md), el *por qué* en
[roadmap.md](roadmap.md) y [project-strategy.md](project-strategy.md), y las
reglas del proyecto en [../CLAUDE.md](../CLAUDE.md). Si algo acá contradice a
CLAUDE.md, gana CLAUDE.md y hay que corregir este archivo.

Referencia viva: `pages/kontakt.html` + `css/page-contact.css` implementan todo
lo de abajo. `pages/index.html` es la fuente de la que sale casi todo.

---

## Índice

1. [Márgenes](#1-márgenes-el-inset-es-simétrico)
2. [Títulos](#2-títulos)
3. [Componentes fijos](#3-componentes-fijos)
4. [Efectos](#4-efectos)
5. [Página clara sobre un sitio oscuro](#5-página-clara-sobre-un-sitio-oscuro)
6. [Formularios](#6-formularios)
7. [Teléfono](#7-teléfono)
8. [Checklist de página nueva](#8-checklist-de-página-nueva)

---

## 1. Márgenes: el inset es simétrico

**Regla fija:** el contenido usa `--content-inset` (tokens.css) **en los dos
lados**, no solo a la izquierda.

```css
.mi-seccion__inner {
  padding-inline: var(--content-inset);   /* NO padding-inline-start solo */
}

@media (max-width: 767.98px) {
  .mi-seccion__inner {
    padding-inline: var(--space-2);       /* 48px es demasiado en un teléfono */
  }
}
```

- Va **encima** del padding de `.container`, no lo reemplaza.
- `box-sizing: border-box` (reset.css) lo mantiene dentro del `max-width`, así
  que nunca genera scroll horizontal.
- Se lo aplicás a **cada columna de contenido** de la página (breadcrumb, hero,
  grillas, formulario), no solo a los títulos: así todo arranca en la misma
  línea vertical.
- Nunca le pongas un `max-width` al elemento que también tiene `.container`:
  `.container` es `margin-inline: auto`, así que lo centrarías y quedaría
  desalineado del resto. El ancho de línea se limita en los hijos.

---

## 2. Títulos

Mismo tratamiento que la homepage (`main h2` en page-home.css). Como
`page-home.css` no se carga en otras páginas, se copia el valor:

| Caso | Tamaño | Peso |
|---|---|---|
| Título principal de página (H1) | `clamp(2.25rem, 0.4rem + 3.7vw, 3.75rem)` | `--font-weight-regular` |
| Título de sección (H2) | igual que arriba | regular |
| Título que **comparte fila con un formulario** | `clamp(2rem, 1.6rem + 1.5vw, 2.625rem)` | regular |
| Título de card de formulario (H3) | `clamp(2rem, 1.6rem + 1.5vw, 2.625rem)` | regular |

- El piso de 2.25rem es a propósito: el `main h2` de la homepage baja a
  1.375rem (22px) en teléfono, y ahí el título de la página termina siendo más
  chico que un título adentro de una card. De 768px para arriba es idéntico.
- La excepción de "comparte fila con un formulario" es de la propia homepage
  (`.conversion__headline`): los dos títulos se leen como un par en vez de que
  el de la izquierda aplaste al de la derecha.
- El nivel del heading lo decide la estructura del documento, nunca el tamaño
  visual. Un `<h1>` por página, sin saltarse niveles.

---

## 3. Componentes fijos

Piezas que se ven igual en todo el sitio. Si una página la necesita distinta,
primero preguntá — es más probable que sea un error que una excepción.

### Breadcrumbs

Trail con **chevrones**, no con barras (cliente 2026-07-31, imagen de
referencia): links en gris sin subrayado, chevrón fino más claro, página actual
en negro y bold.

```html
<nav class="breadcrumbs container" aria-label="Breadcrumb">
  <ol class="breadcrumbs__list">
    <li><a class="breadcrumbs__link" href="/">Home</a></li>
    <li class="breadcrumbs__sep" aria-hidden="true">
      <svg class="breadcrumbs__sep-icon" aria-hidden="true"><use href="#icon-chevron"></use></svg>
    </li>
    <li><span class="breadcrumbs__current" aria-current="page">Kontakt</span></li>
  </ol>
</nav>
```

- El `#icon-chevron` del sprite apunta a la izquierda; se espeja con
  `transform: scaleX(-1)` en vez de agregar un segundo símbolo.
- El separador es decoración (`aria-hidden`): el orden ya lo da el `<ol>`.
- La página actual es texto, no link, con `aria-current="page"`.
- Sin subrayado en reposo: acá los links están solos adentro de un `<nav>`, no
  metidos en una frase, así que no dependen del color para distinguirse del
  texto que los rodea (WCAG 1.4.1). El subrayado vuelve en hover/focus.
- Separación entre items: `--space-3`.

> 🔧 **Pendiente:** hoy esto vive en `css/page-contact.css` porque esa página no
> podía tocar los archivos compartidos. El lugar correcto es
> `css/components.css` (`.breadcrumbs__sep-icon` y los colores) y el markup de
> cada página. Mientras no se mueva, **cada página nueva repite el bloque**, y
> `components.css` sigue teniendo la versión con `/`.

### Navegación: la página actual

El item del nav que corresponde a la página abierta **no** lleva píldora
rellena: va **sin fondo, con subrayado azul** — el mismo `#3D9AD3` del botón
"Angebot einholen" (cliente 2026-07-31). O sea, la página actual se lee como
permanentemente en hover, porque el hover del nav ya usa ese mismo subrayado.

```css
a.site-nav__link[aria-current="page"] {
  padding: var(--space-1) 0;
  border-radius: 0;
  background-color: transparent;
  border-bottom-color: var(--color-accent-strong);  /* = --color-blue-light, el azul del CTA */
}
```

- `a.site-nav__link[...]`, no `.site-nav__link[...]`: la regla compartida usa
  ese mismo bump de especificidad, y con menos no gana.
- El `aria-current="page"` lo pone `initActiveNavLink()` (main.js) en runtime,
  nunca el markup — el header es el mismo archivo para todas las páginas.
- Sin relleno, el texto toma el color de sus hermanos: gris en un header claro,
  blanco adentro del cajón negro de mobile. No hace falta forzar ningún color.

> 🔧 **Pendiente:** igual que los breadcrumbs, hoy está scopeado a
> `.page-contact`. Va a `css/site-chrome.css`, reemplazando la píldora en
> `a.site-nav__link[aria-current="page"]`.

### Botones y CTA

Vienen de `css/components.css` y **no se re-estilan**: si una página necesita
algo distinto, es un modificador propio encima (`.contact-form__submit`), nunca
un override de `.btn`.

| | Cuándo | Cómo |
|---|---|---|
| `.btn .btn--primary` | la acción principal | fondo `--color-blue-light` (#3D9AD3), texto blanco, pill |
| `.btn .btn--secondary` | acción alternativa | transparente + borde `--color-border-strong` |
| `.btn--sm` / `.btn--lg` | solo padding | header / momentos de alto énfasis |

- **Hover del primario:** `--color-blue-dark` (#5287C9). El azul claro es el
  color en reposo de todo el sitio desde 2026-07-28; el oscuro quedó reservado
  para hover y para los azules sobre blanco.
- **Flecha:** es opt-in. `<svg class="btn__arrow icon"><use href="#icon-arrow-diagonal">`
  dibuja ↗ en reposo y rota 45° a → en hover/focus. Va en los CTA de verdad
  (el del header, el del hero), no en cada botón.
- **Brillo:** `.btn--primary` tiene una franja de luz que cruza sola cada 5s
  (3s en el header). Ya está, no hay que agregar nada — y motion.css la anula
  con `prefers-reduced-motion`.
- `.btn` es `white-space: nowrap`. Con etiquetas alemanas largas, chequeá el
  ancho antes de meterlo en una columna angosta.
- **Un solo primario por pantalla.** Si hay dos botones azules compitiendo, uno
  de los dos es secundario.

> ⚠️ **Contraste, medido:** blanco sobre #3D9AD3 da **3,1:1**, y sobre el hover
> #5287C9 da **3,7:1**. Pasa el mínimo de 3:1 de componentes de interfaz y de
> texto grande, pero **no** el 4,5:1 de texto normal. Es el botón de marca
> aprobado por el cliente y se usa así en todo el sitio — queda anotado como
> caveat conocido, no como algo a "arreglar" por cuenta propia. Si alguna vez
> se revisa, la salida barata es subir el tamaño/peso del texto del botón hasta
> el umbral de texto grande, no cambiar el azul.

### Tarjetas de acción

Para teléfono, mail, dirección, "descargar", "ver la ficha": **la tarjeta
entera es el link**, no un texto adentro de la tarjeta. Es la diferencia entre
un área tocable de 374×133 y una de 173×49.

```html
<li>
  <a class="contact-tile" href="tel:+499519643520">
    <span class="contact-tile__head">
      <svg class="contact-tile__icon" aria-hidden="true"><use href="#icon-phone"></use></svg>
      <span class="contact-tile__label">Telefon</span>
    </span>
    <span class="contact-tile__value">+49 951 964352-0<svg class="contact-tile__arrow" …></svg></span>
    <span class="contact-tile__text">Rund um die Uhr erreichbar …</span>
  </a>
</li>
```

Estructura, siempre la misma: **ícono + label en UNA fila** (apilarlos es lo
que hacía que estas tarjetas midieran el doble) → valor grande con la flecha
al final → texto de apoyo chico. Relleno `--space-4`, `gap: --space-2`,
`--radius-lg`, fondo `rgb(59 73 86 / 0.05)`.

Cuatro cosas que hay que respetar:

- **Nada de links anidados.** Si la tarjeta es un `<a>`, el número y el mail ya
  no pueden ser su propio `<a>`. Es HTML inválido y rompe la navegación por
  teclado.
- **`height: 100%`** en la tarjeta: con el grid en `stretch`, las de una misma
  fila quedan iguales aunque una tenga una línea más.
- **Borde transparente en todas.** El modificador de prioridad después lo
  colorea sin que nada cambie de tamaño — cero layout shift.
- **Foco visible sobre la tarjeta entera:** `outline: 2px solid` + `outline-offset: 3px`,
  para que se lea como anillo y no como un segundo borde.

**Prioridad sutil** (una sola tarjeta, cuando una vía es la más rápida): mismo
componente, un modificador — fondo `--color-accent-subtle` y borde
`color-mix(in srgb, var(--color-blue-dark) 30%, transparent)`. `color-mix`
mantiene el borde atado al token en vez de inventar un cuarto azul. **No** la
conviertas en otro componente.

Solo lleva línea de acción con texto la tarjeta cuyo destino no se deduce del
valor (una dirección → "Route in Google Maps öffnen"). Un teléfono y un mail ya
dicen a dónde van; agregarles una etiqueta es ruido.

### Franja de confianza

Un mensaje de confianza corto que acompaña a otra cosa (no es una sección):
una fila, no un panel. Título a la izquierda, frase de apoyo al lado, fondo
`--color-accent-subtle`, borde izquierdo de 3px en `--color-blue-dark`,
`padding: --space-3 --space-4`. En columna abajo de 900px.

Regla de fondo: **si el mensaje ya está en otro lado de la página** (un badge
del hero, una tarjeta), no merece el tamaño de una sección. En `/kontakt/` esto
pasó de 158px a 72px de alto sin perder una sola palabra del texto aprobado.

---

## 4. Efectos

El catálogo. Todo esto ya está construido y es genérico — se **carga**, no se
reescribe.

| Efecto | Qué hace | Cómo se activa |
|---|---|---|
| Scroll suave (Lenis) | el scroll de toda la página | cargar `smooth-scroll.js` |
| Títulos | cada `<h2>` aparece letra por letra | automático (`title-reveal.js`) |
| Listas y grillas | los items entran en cascada | `data-item-reveal=".selector"` |
| Texto | párrafos, `h3`/`h4`, `li` sueltos | automático (`text-reveal.js`) |
| Bloque completo | un bloque entra como una unidad | `data-reveal` |
| Hero | entrada al cargar, no al scrollear | CSS propio de la página |
| Pixel seam | disolución de píxeles antes del footer | `<div data-pixel-seam>` |

### 4.1 Qué se carga y en qué orden

En el `<head>`, todos `defer` — el orden del documento garantiza el orden de
carga:

```html
<link rel="stylesheet" href="/css/vendor/lenis.css">
<script src="/assets/js/vendor/gsap.min.js" defer></script>
<script src="/assets/js/vendor/ScrollTrigger.min.js" defer></script>
<script src="/assets/js/vendor/lenis.min.js" defer></script>
<script src="/js/smooth-scroll.js" defer></script>
<script src="/js/title-reveal.js" defer></script>
<script src="/js/item-reveal.js" defer></script>
<script src="/js/text-reveal.js" defer></script>
<script src="/js/pixel-transition.js" defer></script>
```

**No cargar** `js/hero-reveal.js` ni los scripts de secciones específicas de la
homepage (`sticky-story`, `pain-hook-journey`, `system-story`, `konzept-seq`,
`coverage-*`): están atados a markup de la homepage.

### 4.2 Aparición de texto — cuál usar en cada caso

- **Bloque con imágenes o campos de formulario** → `data-reveal` en el
  contenedor, para que entre como una unidad. `text-reveal.js` no toca `<img>`
  ni `<label>`, así que sin esto la leyenda entra sola y la imagen queda
  quieta.
- **Lista o grilla de tarjetas** → `data-item-reveal=".item"` en el `<ul>`.
- **Texto corrido suelto** → nada, `text-reveal.js` lo agarra.
- **Nunca los dos juntos:** `text-reveal.js` saltea todo lo que esté adentro de
  `[data-reveal]` o `[data-item-reveal]`. Poner `data-reveal` en un wrapper
  **apaga** el efecto por elemento de todo lo de adentro.
- **Escotillas:** `data-no-title-reveal` en un `<h2>` (por ejemplo uno
  `.visually-hidden`), `data-no-text-reveal` en cualquier subárbol.

### 4.3 Lo que está arriba del fold

Los reveals solo disparan con algo que **entra** al viewport. El hero ya está en
pantalla en el primer paint, así que necesita su propia entrada en CSS:

```css
@media (prefers-reduced-motion: no-preference) {
  .hero__inner > * { animation: hero-in var(--duration-slow) var(--easing-premium) backwards; }
  .hero__inner h1  { animation-delay: 140ms; }
}
@keyframes hero-in { from { opacity: 0; transform: translateY(14px); } }
```

Ojo con el `no-preference`: el override global de motion.css pone
`animation-duration: 0.01ms` pero **no** toca el `animation-delay`, así que con
`backwards` un visitante con movimiento reducido se quedaría mirando un título
invisible durante el delay. Gatear toda la cascada es la dirección segura, y
motion.css sigue siendo el único lugar que maneja `reduce`.

### 4.4 Pixel seam antes del footer — obligatorio

**Regla fija (cliente 2026-07-31): toda página termina con el efecto de píxeles
justo antes del footer.** Es el mismo mecanismo que usa la homepage entre
secciones, y es lo último que ve el visitante en cualquier página.

Un `<div>` vacío entre `</main>` y el footer:

```html
</main>
<div class="pixel-seam pixel-seam--white" data-pixel-seam aria-hidden="true"></div>
<!-- include: footer-de -->
```

Cómo funciona, en dos frases: el script mide el `div`, arma adentro una banda de
200px (120px en teléfono) llena de cuadraditos del tamaño exacto, y va apagando
cada uno a medida que la banda cruza el viewport, con un jitter por celda para
que el borde se vea rasposo y no una línea prolija. La banda vive **dentro de
la sección de abajo** (el footer) y los cuadraditos son del color de la sección
**de arriba** — así se lee como que la página se despixela hacia el footer.

Dos cosas que hay que acertar:

| | |
|---|---|
| **Color del tile** | El del fondo de la sección de arriba. Página blanca → `.pixel-seam--white`. Página negra → sin modificador (el default es `--color-bg`). Si la de arriba es `.section--subtle` va `.pixel-seam--subtle` (#090909): un negro apenas distinto se nota y se lee como "dos negros". |
| **Padding del footer** | El footer tiene que reservar la altura de la banda (`.pixel-seam + .site-footer { padding-top: calc(var(--space-9) + 200px) }`, 120px en teléfono) o los tiles tapan contenido real. |

El CSS del seam vive en `page-home.css`, que ninguna otra página carga, así que
hay que copiar el bloque a la hoja de la página (está en `page-contact.css`,
recortado a lo que hace falta). El JS **no** se toca: descubre solo todos los
`[data-pixel-seam]`.

`overflow: hidden` en la banda no es decorativo: el script tapa de más a
propósito (`Math.ceil`) para no dejar una franja pelada a la derecha, y sin ese
clip el sobrante le da scroll horizontal a toda la página.

### 4.5 El contrato que no se rompe nunca

JS **solo mejora**. El estado oculto (opacity 0, blur, split en letras, los
tiles del seam) lo aplica el script en runtime y nunca el CSS del markup. Sin
JS, con un error de script, con `prefers-reduced-motion`, o para un crawler que
no ejecuta JS: la página se ve completa. Esto no es solo accesibilidad — los
crawlers de búsqueda con IA en general no ejecutan JS, así que es un requisito
de GEO.

---

## 5. Página clara sobre un sitio oscuro

El sitio es oscuro por defecto. Si una página va en blanco (como `/kontakt/`),
hay que arreglar cinco cosas que dan por sentado el fondo negro:

1. **Dónde va el blanco:** en `<body class="page-x">`, no en `<main>`. El header
   es sticky y vive arriba de `<main>`; si pintás solo `<main>` queda una banda
   negra arriba. El footer trae su propio negro y no se toca.
2. **Header:** `data-nav-force-dark` en `<body>` deja el header en su estado
   claro (logo negro, nav gris, fondo esmerilado). Duplicá ese recoloreo en CSS
   para que se lea también sin JS. Dos trampas:
   - el item de nav actual (`aria-current="page"`) es una píldora oscura con
     texto blanco → hay que excluirlo del recoloreo o queda gris sobre gris;
   - abajo de 1400px el nav es un cajón con fondo **negro** → ahí los links
     vuelven a blanco.
3. **Foco:** `--color-focus-ring` es blanco, o sea invisible. Usá
   `--color-blue-dark` en toda la página (pasa 3:1 en blanco y en el negro del
   footer).
4. **Controles nativos:** `color-scheme: light` en la página, si no el checkbox
   sale como un cuadrado oscuro (tokens.css pone `color-scheme: dark` en
   `:root`).
5. **Skip-link:** es un chip blanco pensado para fondo negro → invertilo.

**Valores "sobre blanco"** — los mismos que ya usan las secciones claras de la
homepage, no inventes otros:

| Uso | Valor |
|---|---|
| Fondo | `var(--color-white)` |
| Texto principal | `var(--color-gray)` |
| Texto secundario | `rgb(59 73 86 / 0.75)` |
| Títulos | `var(--color-logo-black)` |
| Cualquier azul | `var(--color-blue-dark)` — `#3D9AD3` no pasa contraste en blanco |
| Bordes / divisores | `rgb(59 73 86 / 0.12)` … `0.25` |
| Card / tile | `rgb(59 73 86 / 0.05)`, `--radius-lg`, sin borde |
| Eyebrow | `var(--color-gray)` (el azul compartido es para fondo negro) |

---

## 6. Formularios

Todos los formularios del sitio se ven igual: el de la homepage
(`.conversion__form-wrap` / `.conversion__form`) es la referencia.

- Card blanca: `--radius-lg`, borde `1px rgb(1 1 1 / 0.06)`, `--shadow-lg`,
  padding `clamp(1.75rem, 1.2rem + 2vw, 3rem)`.
- Campos sin caja: fondo transparente, solo `border-bottom`, sin radius.
- Labels: `0.75rem`, mayúsculas, `letter-spacing: 0.08em`, en gris al 75%.
- Foco: subrayado azul de 2px (sin `outline`) — sobre blanco se ve; el anillo
  blanco compartido no.
- Botón: pill (`--radius-pill`), del ancho de su contenido en desktop
  (`justify-self: start`), 100% en teléfono.
- Grilla: 1 columna, 2 desde 640px; mensaje, consentimiento y botón ocupan
  `grid-column: 1 / -1`.
- **Campo de mensaje:** `rows="2"` + `min-height: 3.5rem` + `field-sizing:
  content` + `max-height` — arranca apenas más alto que un input de una línea y
  crece con lo que se escribe. El `rows` importa: un `min-height` en CSS solo
  puede agrandar la caja, nunca achicarla. `field-sizing` hoy es solo Chromium;
  en Safari/Firefox queda en su altura de reposo, que es la que queremos igual.
- **Overrides siempre scopeados** bajo la clase del formulario, para no tocar
  los componentes compartidos (`components.css`) que usan las demás páginas.

Campos mínimos: Name, Firma, E-Mail, Telefon, Nachricht, consentimiento DSGVO,
honeypot. El honeypot va fuera del layout (`position: absolute; left: -9999px`,
**no** `display: none`), fuera del tab (`tabindex="-1"`) y fuera del árbol de
accesibilidad (`aria-hidden` en el wrapper).

Hoy ningún formulario envía nada (`action="#"`) — ver el Paso 4 de la
checklist.

### Cómo se compone la sección del formulario

Dos columnas desde 1024px: izquierda el contexto, derecha el formulario (5fr /
7fr — el formulario es la columna ancha). Pero el **orden del DOM es
intro → formulario → material de apoyo**, que es el orden de lectura correcto
en un teléfono; en desktop las áreas del grid devuelven el apoyo abajo de la
intro:

```css
.form-section__grid {
  display: grid;
  grid-template-areas: "intro" "form" "aside";
}

@media (min-width: 1024px) {
  .form-section__grid {
    grid-template-columns: 5fr 7fr;
    grid-template-areas:
      "intro form"
      "aside form";
    grid-template-rows: auto 1fr;   /* ← ver abajo */
    align-items: start;
  }
}
```

`grid-template-rows: auto 1fr` no es opcional: el formulario ocupa las dos
filas, y con el `auto auto` por defecto toda la altura que le sobra se reparte
entre las dos filas de la izquierda y abre un hueco muerto entre la intro y el
apoyo.

Qué va en cada lado, y qué NO:

- Izquierda: eyebrow, H2, párrafo, y **el teléfono como única alternativa real
  al formulario** ("Lieber direkt sprechen? …"), después certificaciones.
- **Un solo link secundario**, y bajito. Un formulario rodeado de tres links es
  un formulario con tres salidas de emergencia.
- **Nunca** un link que haga lo mismo que el formulario que tiene al lado
  ("pedir presupuesto" al lado de un formulario de presupuesto).
- Nada abajo del botón de enviar: la card termina en el submit.

---

## 7. Teléfono

No es una fase aparte: cada bloque se construye responsive cuando se
construye. Mínimos, todos verificados con medición y no a ojo:

- **Cero scroll horizontal** en 360 / 390 / 430 / 768 / 1024 / 1440px:
  `documentElement.scrollWidth === innerWidth`.
- **44px** de área táctil en todo lo que se toca. Para links dentro de una
  frase, agrandá con `padding-block` sobre un `inline-block` — el texto no se
  mueve. Si el link es una tarjeta entera (§3), el problema no existe.
- **El contenido principal antes que el secundario**, y en el DOM, no con
  `order`: en teléfono el formulario va antes que certificaciones y links. Si
  lo hacés con `order`, el orden de tabulación queda al revés de lo que se ve,
  justo en la acción que importa.
- **16px exactos** en los inputs: menos que eso y Safari iOS hace zoom al
  enfocar y deja al visitante zoomeado y corrido de lado.
- **13px** de piso para texto chico.
- **22px** el checkbox de consentimiento, con la fila padeada.
- `hyphens: auto` viene de base.css para `p`, `li`, `blockquote`: está bien
  para texto corrido, mal para una línea de display ("keinen Fei-erabend"). En
  esos casos, `hyphens: none` puntual.
- Compuestos alemanes largos: `overflow-wrap: anywhere` + `min-width: 0` donde
  una palabra pueda fijar el ancho mínimo de una fila.

### Cómo medir (dos trampas que cuestan tiempo)

1. Chrome fuerza un viewport mínimo de ~500px. `--window-size=390` te da una
   **captura** de 390px de un **layout** de 500px. Meté la página en un
   `<iframe>` de ancho fijo dentro de una ventana ≥500px y medí ahí adentro.
2. Con `--virtual-time-budget` el scroll no se asienta: Lenis maneja la
   posición, ScrollTrigger necesita eventos reales y las transiciones se
   congelan a mitad de camino. Para una foto honesta, forzá
   `--force-prefers-reduced-motion`.

---

## 8. Checklist de página nueva

- [ ] `<title>` 50–60 y `<meta name="description">` 140–160, únicos
- [ ] canonical, Open Graph, Twitter, `robots`, `hreflang`, `<html lang>` real
- [ ] JSON-LD del tipo que corresponda + `BreadcrumbList` (todas menos la home)
- [ ] Un solo `<h1>`, sin saltos de nivel
- [ ] Breadcrumb con chevrones (§3), con la página actual como texto y
      `aria-current`
- [ ] `padding-inline: var(--content-inset)` **en los dos lados**, reducido en
      teléfono
- [ ] Títulos con la escala de la homepage
- [ ] Stack de efectos cargado + hooks (`data-reveal` / `data-item-reveal`)
      puestos, y entrada CSS para lo que está arriba del fold
- [ ] **Pixel seam antes del footer**, con el color de tile correcto y el
      `padding-top` del footer reservado
- [ ] Formulario con el estilo compartido, honeypot incluido, y la sección
      compuesta como en §6 (orden del DOM: intro → formulario → apoyo)
- [ ] Tarjetas de acción clickeables enteras, con foco visible (§3)
- [ ] Medida a 360/390/430/768/1024/1440 sin scroll horizontal, áreas
      táctiles ≥44px
- [ ] Sumada a `sitemap.xml`
- [ ] Marcada en [build-checklist.md](build-checklist.md), en el mismo commit
