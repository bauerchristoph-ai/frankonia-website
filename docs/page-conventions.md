# FRANKONIA — Baseline de una página

Lo que **toda** página nueva tiene que tener, ya resuelto, para no volver a
descubrirlo página por página. Nació el 2026-07-31 armando `/kontakt/`: varias
de estas cosas faltaron ahí y se agregaron después.

**Este documento crece.** Cada vez que se decide un efecto, un componente o una
regla que aplica a más de una página, se agrega acá en el mismo commit. Si algo
está en el código pero no acá, la próxima página se lo va a olvidar.

Esto es el "cómo se construye una página". Los **valores** que usa (paleta,
escala tipográfica, espaciado, sombras, contraste medido) están en
[design-system.md](design-system.md). El *qué* construir está en
[build-checklist.md](build-checklist.md), el *por qué* en
[roadmap.md](roadmap.md) y [project-strategy.md](project-strategy.md), y las
reglas del proyecto en [../CLAUDE.md](../CLAUDE.md). Si algo acá contradice a
CLAUDE.md, gana CLAUDE.md y hay que corregir este archivo.

Referencias vivas: `pages/werkschutz.html` + `css/page-service.css` (plantilla de
**servicio**, la que se repite 12 veces) y `pages/kontakt.html` +
`css/page-contact.css` (página **clara**). `pages/index.html` es la fuente de la
que sale casi todo.

> **2026-08-03:** armando `/werkschutz/` se salteó la mitad de este documento y
> hubo que volver atrás (márgenes, breadcrumb con chevrones, pixel seam,
> honeypot). **Leelo antes de escribir markup, no después.** Lo que se aprendió
> ahí está incorporado abajo, y la sección 9 es nueva: la plantilla de servicio.

---

## Índice

1. [Márgenes](#1-márgenes-el-inset-es-simétrico)
2. [Títulos](#2-títulos)
3. [Componentes fijos](#3-componentes-fijos)
4. [Efectos](#4-efectos)
5. [Página clara sobre un sitio oscuro](#5-página-clara-sobre-un-sitio-oscuro)
6. [Formularios](#6-formularios)
7. [Teléfono](#7-teléfono)
8. [Página de servicio](#8-página-de-servicio)
9. [Página de empresa: reusar el chasis](#9-página-de-empresa-reusar-el-chasis)
10. [Checklist de página nueva](#10-checklist-de-página-nueva)

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

**Si el elemento ES el `.container`** (`<div class="container mi-grid">`), la
regla cae sobre la misma propiedad y **reemplaza** el padding del container en
vez de sumarse — el bloque termina 12px más a la izquierda que el resto. Se
suman a mano:

```css
padding-inline: calc(var(--container-padding) + var(--content-inset));
```

Esa es la forma que usa la plantilla de servicio, y de una sola regla alcanza
para toda la página:

```css
main > .breadcrumbs,
main > section > .container {
  padding-inline: calc(var(--container-padding) + var(--content-inset));
}
@media (max-width: 767.98px) {          /* 48px es demasiado en un teléfono */
  main > .breadcrumbs,
  main > section > .container {
    padding-inline: calc(var(--container-padding) + var(--space-2));
  }
}
```

La sección del formulario queda **afuera** a propósito: es una card centrada en
un panel full-bleed, igual que en la homepage.

> Este es el error más fácil de cometer y el más visible: sin el inset la página
> arranca contra el borde y se lee como otro sitio. Fue exactamente el pedido
> del cliente el 2026-08-03 sobre `/werkschutz/`.

---

## 2. Títulos

Mismo tratamiento que la homepage (`main h2` en page-home.css). Como
`page-home.css` no se carga en otras páginas, **cada hoja de página copia el
valor** (hoy: `page-contact.css` y `page-service.css`). Si el clamp cambia,
cambia en todas — es una decisión escrita en varios archivos, no varias
decisiones.

| Caso | Tamaño | Peso |
|---|---|---|
| **H1 de hero** (comparte fila con una foto) | `clamp(2rem, 1.6rem + 2.2vw, 3.25rem)` → 52px a 1440 | `--font-weight-regular` |
| Título principal de página sin hero (H1) | `clamp(2.25rem, 0.4rem + 3.7vw, 3.75rem)` | regular |
| Título de sección (H2) | igual que la fila de arriba | regular |
| Título que **comparte fila con un formulario** | `clamp(2rem, 1.6rem + 1.5vw, 2.625rem)` | regular |
| Título de card de formulario (H3) | `clamp(2rem, 1.6rem + 1.5vw, 2.625rem)` | regular |

La primera fila es la de la homepage (`.hero__content h1`) y es obligatoria para
cualquier hero (cliente 2026-08-03: "la hero tiene que ser igual a la de la
homepage en tamaño"). El H1 de `/werkschutz/` usó la escala de sección un rato y
salía 60px contra los 52px de la home — se veía distinto al lado.

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
"Angebot einholen" (cliente 2026-07-31, confirmado para todo el sitio el
2026-08-03: "este fill horrible... solo underlined con el azul del CTA"). O sea,
la página actual se lee como permanentemente en hover, porque el hover del nav ya
usa ese mismo subrayado.

**Ya es el default compartido** (`css/site-chrome.css`) — no hay que hacer nada
por página, y la copia scopeada que tenía `/kontakt/` se borró:

```css
a.site-nav__link[aria-current="page"] {
  border-bottom-color: var(--color-accent-strong);   /* el azul del CTA */
}
/* Header claro (frosted): #3D9AD3 sobre blanco da ≈2,6:1, abajo del mínimo
   de 3:1 para un borde de interfaz. */
.site-header--dark a.site-nav__link[aria-current="page"] {
  border-bottom-color: var(--color-blue-dark);
}
```

- `a.site-nav__link[...]`, no `.site-nav__link[...]`: empata en especificidad con
  `.site-nav__list a` y perdería según el orden del archivo.
- El `aria-current="page"` lo pone `initActiveNavLink()` (main.js) en runtime,
  nunca el markup — el header es el mismo archivo para todas las páginas.
- **Sin padding ni fondo**, y no es solo estético: la píldora hacía al item
  activo más ancho que sus hermanos, así que el ancho total de la fila cambiaba
  de página en página, justo en el nav que ya entra apretado a 1400px. Sin
  relleno el texto además toma el color de sus hermanos solo — gris en el header
  claro, blanco en el cajón negro de mobile — sin una regla de color por estado.

### FAQ: hay dos looks, y el de la homepage es el que pide el cliente

El acordeón (`.faq__list` / `.faq-item`, `components.css`) es un `<details>`
nativo: cero JS, operable por teclado, legible con el CSS apagado. Lo que cambia
por página es la **presentación**, y hoy hay dos:

| | Cómo se ve | Dónde |
|---|---|---|
| Compartido (`components.css`) | una columna, items con borde, "+" a la derecha | `/werkschutz/` (fondo oscuro) |
| **El de la homepage** | título centrado, **dos columnas** desde 768px, píldoras rellenas sin borde (`--radius-lg`, `rgb(59 73 86 / 0.05)`), **"+" a la izquierda** de la pregunta | `pages/index.html`, `/jobs/` |

El segundo es el que el cliente pidió dos veces (imagen de referencia
2026-07-20 para la home, y 2026-08-03 "que tenga el mismo diseño que la sección
de FAQs en la homepage" para `/jobs/`). **Preferilo en cualquier página clara
nueva.** Detalles que no son obvios:

- El "+" se mueve con `order: -1` sobre el `::after`, **no** reordenando el
  markup: el DOM y el orden de lectura quedan igual para lector de pantalla y
  teclado, solo cambia la posición visual.
- El glifo va en `--color-gray`, no en azul: a ese tamaño fluido el blue-dark
  sobre blanco pasa el 3:1 de texto grande pero no el 4,5:1 de texto normal, y
  es ambiguo cuál aplica.
- `justify-content: flex-start` + `gap` en el `summary` — el default compartido
  es `space-between`, que es justo lo que manda el "+" al otro extremo.
- El eyebrow es `display: flex`, así que el `text-align: center` del padre no lo
  centra: necesita su propio `justify-content: center`. (La home no tiene eyebrow
  en esta sección; `/jobs/` sí, en todas.)
- ⚠️ **Vive en dos hojas de página** (`page-home.css` `.faq` y `page-jobs.css`
  `.jobs-faq`) porque `page-home.css` no se carga en otras páginas — es una
  decisión escrita dos veces, como el clamp de `main h2` (§2). **Si una tercera
  página lo pide, promovelo a un modificador `.faq--cards` en `components.css`**
  en vez de copiarlo de nuevo.

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
| Hero | entrada al cargar, no al scrollear | `data-hero-reveal` (ver 4.1) o CSS propio |
| Pixel seam | disolución de píxeles entre secciones y antes del footer | `<div data-pixel-seam>` |
| Imagen fija con máscara | columna de fotos que se queda quieta y cada una se despeja para dejar ver la siguiente | `data-service-flow` + `service-flow.js` |

### 4.1 Qué se carga y en qué orden

En el `<head>`, todos `defer` — el orden del documento garantiza el orden de
carga:

```html
<link rel="stylesheet" href="/css/vendor/lenis.css">
<script src="/assets/js/vendor/gsap.min.js" defer></script>
<script src="/assets/js/vendor/ScrollTrigger.min.js" defer></script>
<script src="/assets/js/vendor/lenis.min.js" defer></script>
<script src="/js/smooth-scroll.js" defer></script>
<script src="/js/hero-reveal.js" defer></script>   <!-- solo si el hero opta (ver abajo) -->
<script src="/js/title-reveal.js" defer></script>
<script src="/js/item-reveal.js" defer></script>
<script src="/js/text-reveal.js" defer></script>
<script src="/js/pixel-transition.js" defer></script>
```

**`js/hero-reveal.js` ya es genérico** (2026-08-03): además de `.hero` de la
homepage, agarra cualquier hero con `data-hero-reveal`, y anima en orden
`.hero__lead` → `.hero__actions` → `.hero__reassurance` → `.hero__trust`. Para
usarlo, el hero de la página lleva ese atributo y **esos mismos nombres de clase
en los cuatro bloques** — así no hace falta ni una línea de JS por página, y el
hero no necesita la entrada CSS de §4.3. Si el hero no usa esas clases, no lo
cargues: cargalo y escribí la entrada en CSS, una de las dos.

**No cargar** los scripts de secciones específicas de la homepage
(`sticky-story`, `pain-hook-journey`, `system-story`, `system-carousel`,
`konzept-seq`, `coverage-*`, `outfits`, `social-carousel`,
`conversion-visual`): están atados a markup de la homepage. Sus hojas de estilo
propias (`sticky-story.css`, `system-story.css`, `konzept-seq.css`) tampoco se
cargan — no están en `head-common`, las linkea solo `pages/index.html`.

**Mapa por si dudás de si un script es reutilizable:** los siete de la tabla de
arriba, más `main.js` (que va en `head-common`, o sea en todas), son los
genéricos. Todo lo demás es de una sección. Las dos excepciones que sí se
reusan pero no son "efectos" están abajo: el mapa (§4.6) y el formulario (§6).

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
motion.css sigue siendo el único lugar que maneja `reduce`. La otra forma válida
es dejar la animación sin gatear y cerrar con un bloque
`@media (prefers-reduced-motion: reduce) { … { animation: none } }` — es lo que
hace el header (abajo), porque su cascada vive en dos media queries y anidar
`no-preference` en las dos era peor de leer. Cualquiera de las dos sirve; lo que
no se puede es dejar el `animation-delay` sin resolver.

**El header entra también, y es CSS, no GSAP** (cliente 2026-08-04: el hero
aparecía suave y el nav quedaba estático). Vive en `site-chrome.css`, o sea que
aplica a **todas** las páginas. Logo y hamburguesa en el bloque base; la lista de
nav y el CTA solo desde 1400px. Tres cosas que conviene no re-descubrir:

- **CSS y no GSAP** porque GSAP se carga *por página*, después del include de
  `head-common`, así que un script compartido con `defer` correría antes de que
  GSAP exista. Y porque el header es la navegación del sitio: no puede depender
  de un script para volverse visible.
- **Nunca animar `transform` sobre `.site-nav__list`.** Desde 1400px está
  centrada con `translate(-50%, -50%)` y un keyframe se la come. Se animan los
  `<li>`; el CTA se anima por su wrapper `.site-nav__actions`.
- **La lista y el CTA se limitan a ≥1400px a propósito.** Abajo de eso viven
  dentro del drawer cerrado, que es `[hidden]` → `display: none`, así que su
  animación no corre al cargar: corre la primera vez que se **abre** el menú. Con
  los delays puestos, tocar la hamburguesa hacía que el último ítem y el CTA
  tardaran ~0,9 s en terminar de aparecer. Medido, no supuesto.

### 4.4 Pixel seam antes del footer — obligatorio

**Regla fija (cliente 2026-07-31): toda página termina con el efecto de píxeles
justo antes del footer.** Es el mismo mecanismo que usa la homepage entre
secciones, y es lo último que ve el visitante en cualquier página.

**Ampliado (cliente 2026-08-03):** en las páginas cuyas secciones alternan de
color, va un seam en **cada** borde, no solo antes del footer — ver §8.2. El
mecanismo es idéntico, solo cambia cuántos hay y de qué color son los tiles.

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
| **Padding del que sigue** | Lo que va **después** del seam tiene que reservar la altura de la banda o los tiles tapan contenido real: `.pixel-seam + .site-footer`, y en una página que alterna también `.pixel-seam + .section` y `.pixel-seam + .conversion` (la sección del formulario no es `.section` y su padding vive en el panel interno). `calc(var(--space-9) + 200px)`, 120px en teléfono. |

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

### 4.6 Mapa de ubicación

`js/contact-map.js` + `.contact-location*` (hoy en `page-contact.css`). Leaflet
sobre el basemap claro de CARTO, sin API key, sin cuenta y **sin iframe de
Google**: un embed carga un frame de terceros y pone cookies apenas entrás, y
todavía no hay banner de consentimiento. El link "Route in Google Maps öffnen"
al lado del mapa es un `<a>` común, o sea consentimiento de dos clics.

```html
<div id="contact-map" class="contact-location__map"
     data-lat="49.9019037" data-lng="10.9067377" data-label="FRANKONIA Sicherheitsdienst">
  <p class="contact-location__fallback">…dirección real + link a Maps…</p>
</div>
```

- **El `<div>` no va vacío.** Trae la dirección y el link adentro; el script
  recién los borra cuando Leaflet cargó de verdad. Sin JS queda un bloque de
  dirección legible, no un hueco.
- **Se carga en diferido solo.** El script trae la CSS y el JS de Leaflet
  (~41K gzip) cuando el mapa se acerca al viewport. No hay que agregar tags de
  vendor al `<head>`, solo `<script src="/js/contact-map.js" defer>`.
- **Las coordenadas salen del elemento**, así que para las 10 páginas de ciudad
  se cambian esos dos números y nada más. Tienen que coincidir con el bloque
  `geo` del JSON-LD de la página.
- Geocodificar (Nominatim) se hace **una vez, en desarrollo**, nunca en
  runtime — misma regla que los polígonos del mapa de la home.
- El basemap claro (`light_all`) es para páginas blancas; la home usa el oscuro
  (`dark_all`). Los tiles de CARTO igual son una request a un tercero: si algún
  día hay banner de cookies, este mapa entra en la lista.

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

Todos los formularios del sitio se ven igual, y desde el 2026-08-03 **hay una
sola implementación**: `css/lead-form.css` (`.conversion*`), sacada de
`page-home.css` cuando `/werkschutz/` la necesitó igual. No se vuelve a copiar
el CSS del formulario a la hoja de cada página.

```html
<!-- en el <head>, después del include de head-common y ANTES de la hoja propia
     de la página, para que la página pueda pisar algo si hace falta -->
<link rel="stylesheet" href="/css/lead-form.css">
<link rel="stylesheet" href="/css/page-service.css">
```

El markup se copia (título/lede propios y los `id` de los campos únicos por
página, prefijo corto tipo `wk-`), el CSS no. Valores, para referencia:

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

⚠️ **Trampa de especificidad, medida (cliente 2026-08-03: "tiene que estar todo
centrado").** El bloque de la intro del formulario (`.conversion__intro` +
`.conversion__intro-lede`) lleva **también** `.section__intro`, y el chasis
(`page-service.css`) estiliza eso en genérico:

```css
.section__intro     { max-width: none; }     /* mata el cap de 46rem del form */
.section__intro > p { max-width: 42rem; }    /* (0,1,1): le gana a la clase del lede */
```

Como la hoja de la página se carga **después** de `lead-form.css`, esas dos
reglas ganan y el lede queda en una caja de 672px sin márgenes automáticos,
pegado al borde **izquierdo** de una intro tan ancha como su propio título: 360px
fuera de centro en `/referenzen/` (título largo) y 14px en `/werkschutz/`, donde
el título es corto y no se notó. La defensa está ya en `lead-form.css`, con
selectores `(0,2,0)` (`.conversion .conversion__intro`,
`.conversion .conversion__intro-lede`) — no hay que hacer nada por página. Regla
general: **si un componente compartido tiene que sobrevivir al chasis, sus
selectores necesitan más especificidad que `.section__intro > p`.**

Campos mínimos: Name, Firma, E-Mail, Telefon, Nachricht, consentimiento DSGVO,
honeypot. El honeypot va fuera del layout (`position: absolute; left: -9999px`,
**no** `display: none`), fuera del tab (`tabindex="-1"`) y fuera del árbol de
accesibilidad (`aria-hidden` en el wrapper). La regla ya está en
`lead-form.css` como `.conversion__hp` — solo hay que poner el div:

```html
<div class="conversion__hp" aria-hidden="true">
  <label for="wk-website">Website</label>
  <input type="text" id="wk-website" name="website" tabindex="-1" autocomplete="off">
</div>
```

Hoy ningún formulario envía nada (`action="#"`) — ver el Paso 4 de la
checklist. **El formulario de la homepage todavía no tiene el div del honeypot**
(la regla CSS ya le llega); está anotado en la checklist, no lo agregues de
paso sin decirlo.

Esos campos mínimos son los del formulario **B2B**. Un formulario con otro
propósito cambia la lista, no el estilo: el de postulación de `/jobs/` no lleva
Firma (es una persona, no una empresa) y sí lleva Telefon obligatorio, un
`<select>` de cualificación y un upload opcional. Si cambiás la lista, seguí el
draft del copy, no esta línea.

### `<select>` y `<input type="file">` (2026-08-03, `/jobs/`)

`lead-form.css` solo re-estila `input` y `textarea`, y `components.css` estiliza
`.form-field__select` como un control relleno para las superficies **oscuras**
del sitio — o sea que un `<select>` dentro de la card blanca sale como una caja
oscura. Los dos controles nuevos llevan el **mismo** subrayado que los campos de
texto (ver `css/page-jobs.css`, bloque 6), scopeado bajo la clase del formulario
de la página. Cuatro cosas que hay que acertar:

- **`color-scheme: light` en el `<form>`.** `tokens.css` pone `dark` en `:root`,
  así que la lista desplegable del select y el botón del file input saldrían
  oscuros dentro de una card blanca. Es la misma corrección que usa una página
  clara entera (§5, punto 4), pero acotada al formulario.
- **No le saques el `appearance` al select.** Reemplazar el caret nativo obliga a
  meter un chevron como data-URI, o sea un color hardcodeado fuera de
  `tokens.css` que además no puede seguir a `currentColor`. Con
  `color-scheme: light` el caret de la plataforma ya es gris sobre blanco.
- **La primera opción va vacía** (`<option value="">Bitte auswählen`): sin ella
  el navegador preselecciona la primera real y alguien que no toca el campo queda
  registrado como si la hubiera elegido.
- **El botón del file input es lo único que no puede ser un subrayado** — tiene
  que verse apretable: chip de contorno vía `::file-selector-button`, en teléfono
  `display: block` + `min-height: 44px` (el nombre del archivo no cabe al lado en
  390px). La **etiqueta** del botón la escribe el navegador en su propio idioma;
  no es texto que se pueda traducir desde el markup.
- Un upload necesita `enctype="multipart/form-data"` en el `<form>`, aunque hoy
  `action="#"` no mande nada.

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
  para texto corrido, mal para una línea de display ("keinen Fei-erabend") y mal
  para **texto en columnas angostas**, que es casi todo lo que no es un párrafo
  suelto. En una grilla de 4 columnas dispara en casi todos los renglones
  ("einfa-cher", "lau-fender", "Fremd-firmen") y se lee como texto roto. Regla
  práctica: `hyphens: none` en ledes, items de lista, celdas y cards; se deja
  `auto` solo en prosa de verdad en medida ancha (las respuestas del FAQ).
- Compuestos alemanes largos: `overflow-wrap: anywhere` + `min-width: 0` donde
  una palabra pueda fijar el ancho mínimo de una fila. Ojo con el detalle:
  `overflow-wrap: break-word` (el que pone base.css) **no** reduce el
  min-content de un elemento, así que en flex/grid una sola palabra
  ("Fremdfirmen-Koordination") sigue estirando la columna. Solo `anywhere` lo
  reduce. Medido: 25px de scroll horizontal a 360px por esto.
- **Sangrías negativas** (una fila cuyo fondo se derrama más allá del texto en
  hover): atalas a `--container-padding`, no a un `--space-*` fijo. Un `-1rem`
  contra un padding de container que a 390px son 12px da 4px de scroll
  horizontal. Medido también.

### Cómo medir (dos trampas que cuestan tiempo)

1. Chrome fuerza un viewport mínimo de ~500px. `--window-size=390` te da una
   **captura** de 390px de un **layout** de 500px. Meté la página en un
   `<iframe>` de ancho fijo dentro de una ventana ≥500px y medí ahí adentro.
2. Con `--virtual-time-budget` el scroll no se asienta: Lenis maneja la
   posición, ScrollTrigger necesita eventos reales y las transiciones se
   congelan a mitad de camino. Para una foto honesta, forzá
   `--force-prefers-reduced-motion`.

---

## 8. Página de servicio

Referencia: `pages/werkschutz.html` + `css/page-service.css` (2026-08-03). Las 12
páginas de servicio salen de acá, y las de ciudad y las combo reusan varios de
estos bloques. **Nada de esto hay que volver a decidirlo.**

### 8.1 La estructura ya está dada por el copy

Los 12 drafts de `content-de/` usan la misma **9-Punkte-Struktur**, así que las
secciones se mapean 1:1 y lo único que cambia es el texto:

| # | Sección | Bloque |
|---|---|---|
| 1 | Hero | `.service-hero*` |
| 2 | Riesgo | `.service-risk*` |
| 3 | Ventajas (gancho de dolor) | `.service-contrast*` |
| 4 | Alcance + caja destacada | `.service-scope*` · `.service-highlight*` |
| 5 | Delimitación (A o B) | `.service-compare*` |
| 6 | Casos de uso + referencias | `.service-cases*` |
| 7 | Sicherheitskonzept compacto | `.service-konzept*` |
| 8 | Costos + caja de precio | `.service-price*` |
| 9 | Confianza / persona de contacto | `.service-contact*` |
| 10 | FAQ | `.faq__list` compartido |
| 11 | CTA final | `css/lead-form.css` |
| 12 | Páginas relacionadas | `.service-related*` |

Las secciones 5, 7 y 8 son genéricas a propósito porque
[build-checklist.md](build-checklist.md) las cuenta fuera de servicios: precios
27 páginas, Konzept 11, tabla comparativa 4.

### 8.2 Decisiones fijas de este tipo de página

- **Los colores alternan negro / blanco sección por sección**, arrancando con el
  hero en negro, y en **cada** borde hay una transición de píxeles (cliente
  2026-08-03, mismo ritmo que la home). En `/werkschutz/`: hero ▪ Riesgo ▫
  Ventajas ▪ Alcance ▫ Abgrenzung ▪ Casos ▫ Konzept ▪ Costos ▫ Ansprechpartner ▪
  FAQ ▫ Formulario ▪ Relacionadas ▫ → footer. Son 12 seams contando el del
  footer, y **suman ~2.200px de alto en desktop** (200px reservados por seam):
  es el costo del efecto, no un bug.

  El lado claro se hace **re-declarando los tokens** en `.section--light`, no
  reescribiendo colores en cada bloque:

  ```css
  .section--light {
    background-color: var(--color-white);
    color: rgb(59 73 86 / 0.85);        /* la mayoría hereda de <body> */
    --color-text: var(--color-logo-black);
    --color-text-muted: rgb(59 73 86 / 0.75);
    --color-border: rgb(59 73 86 / 0.14);
    --color-accent: var(--color-blue-dark);   /* #3D9AD3 no pasa en blanco */
    --color-accent-strong: var(--color-blue-dark);
    --color-focus-ring: var(--color-blue-dark);
  }
  ```

  Funciona porque las custom properties heredan: cualquier bloque nuevo que
  consuma tokens (y no hardcodee un color) ya sale bien en las dos variantes.
  Los cuatro casos que los tokens no alcanzan están anotados en
  `page-service.css`: el hairline de `.service-link`, el borde de la caja
  destacada, los **logos de cliente** (son siluetas blancas → `filter:
  invert(1)` sobre blanco) y el hover de las filas de links, que invierte al
  revés.

  ⚠️ **Trampa medida:** una superficie oscura dentro de una sección clara
  (la caja de precios) **tiene que declarar su propio `color`**. Heredaba el gris
  oscuro de la sección y las dos líneas con tick quedaron invisibles — gris
  oscuro sobre gris oscuro. Misma regla que la card blanca del formulario, que
  también declara el suyo. Si agregás un panel de un color, dale su color de
  texto en la misma regla.
- **El Leistungsumfang es "imagen fija con máscara"** (cliente 2026-08-03,
  referencia: un pen de GSAP "pinned image mask reveal on scroll"). Izquierda:
  las seis tareas, una por pantalla. Derecha: una pila de seis fotos que se
  queda quieta mientras el texto scrollea, y cada foto se despeja de abajo hacia
  arriba (`clip-path: inset`) dejando ver la siguiente, atada al scroll.
  `js/service-flow.js` + `.service-flow*`. Cuatro cosas que NO se copian del
  pen, a propósito:
  - la columna se fija con `position: sticky`, **no** con el `pin` de
    ScrollTrigger — es el patrón de todas las secciones fijas de este sitio;
  - **no** se crea un Lenis nuevo: usa el único que monta
    `js/smooth-scroll.js`. Dos instancias de Lenis pelean por el scroll;
  - **no** anima el fondo de la página (acá el color lo maneja la alternancia
    de secciones, §8.2);
  - **no** lleva un link por paso. La sección tiene un solo link, el de la caja
    destacada. Seis CTA son seis salidas de la página.

  **El título queda fijo arriba** (cliente 2026-08-03: "quedamos ahí pausados con
  el título fixed y mientras escroleamos solo cambia el texto y la imagen"). El
  `.section__intro` vive **adentro** del `.service-flow`, no arriba de él: así se
  fija justo para el scroll de esta sección y se suelta al final, en vez de
  quedar pegado sobre la caja destacada que sigue. Tres detalles que no son
  decoración:
  - el título necesita **fondo opaco** (`--flow-intro-bg`, que sigue el color de
    la sección) porque el texto de los pasos sube y pasaría por encima;
  - la columna de fotos se fija **debajo** del título
    (`top: var(--flow-top) + var(--flow-title-h)`). Sin eso la foto tapa el
    título — fue exactamente el bug de la primera versión;
  - `--flow-title-h` arranca con una constante segura en CSS y `service-flow.js`
    la reemplaza con la altura **medida** del título (cambia con el viewport: el
    tamaño es un clamp y en desktops angostos el título pasa a dos líneas).

  El texto de cada paso se alinea con el **centro de la foto**, no con el del
  viewport (el título pinneado corre la foto hacia abajo, así que no son lo
  mismo). La cuenta está en el CSS: `padding = 2 × offset-superior +
  alto-de-foto − viewport`.

  **Las perillas para mover la foto** (cliente 2026-08-03: "bajame un poco la
  imagen y un poco más para la izquierda"), las dos en `.service-flow`:
  - **abajo/arriba** → `--flow-media-drop` (hoy `2.5rem`). Es una variable propia
    y no un número sumado en cada lugar porque tres reglas usan el mismo valor:
    el `top` de la foto, su altura, y el padding que alinea el texto. Si se
    desincronizan, el texto deja de estar centrado con la foto;
  - **izquierda/derecha** → la proporción de columnas (hoy `0.9fr / 1.1fr`), no
    un margen negativo ni un `translateX`. Con la proporción es imposible que la
    foto se meta sobre la columna de texto a 1024px, donde el texto ya ocupa toda
    su mitad.

  Tres layouts, y **el fallback es el de base** — ese orden es todo el contrato:
  1. base (teléfono, sin JS, `prefers-reduced-motion`): una columna, seis pares
     texto + foto en flujo normal, todo visible;
  2. ≥1024px **y** movimiento permitido: dos columnas, la de fotos sticky y
     apilada con `z-index` por `nth-child`;
  3. la máscara, que el JS agrega arriba de (2).

  O sea: la query de CSS que apila las fotos lleva
  `and (prefers-reduced-motion: no-preference)`, y `gsap.matchMedia()` usa la
  **misma** condición. Si se apilaran sin esa condición, un visitante con
  movimiento reducido vería una sola foto y cinco escondidas detrás.
- **El hero tiene que leerse igual que el de la homepage** (cliente 2026-08-03:
  "mismos tamaños y demás"). Los valores, todos medidos contra la home a 1440px
  y todos ya en `page-service.css`:

  | | Valor |
  |---|---|
  | H1 | `clamp(2rem, 1.6rem + 2.2vw, 3.25rem)` → 52px |
  | Lede | `--font-size-md`, `rgb(255 255 255 / 0.82)`, `max-width: 32rem`, `line-height: 1.5` |
  | Tics azules | **18px fijos** (`1.125rem`, no un `em`), `stroke-width: 2.25`, `--color-blue-light` |
  | Fila de acciones | `gap: --space-5`, `margin-top: --space-6` |
  | Franja de confianza | rating + 2 sellos DEKRA, `gap: --space-4 --space-5`, `margin-top: --space-6`, **sin hairline en desktop** (en teléfono sí: hairline + sellos a `2rem`) |
  | Sellos DEKRA | `height: 2.75rem` |

  **"Del mismo tamaño" no es "de la misma altura en píxeles".** El hero de la home
  mide 912px y llena la pantalla porque su header es transparente sobre la foto y
  no tiene breadcrumb. En una página interior el header sólido (80px) más el
  breadcrumb (~48px) se comen 8rem antes de que el hero empiece, así que copiar
  912px dejaría la franja de confianza abajo del fold — exactamente lo contrario
  de lo que hace la home. La regla es **llenar la primera pantalla**:
  `min-height: calc(100svh - 8rem)` y la foto dimensionada por ALTURA
  (`height: min(42rem, calc(100svh - 14rem))`, donde 14rem = ese chrome + el
  padding del hero), no por ancho.

  ⚠️ **Dos trampas medidas al hacerlo:**
  - dimensionar la foto con `width: auto` + `height` hace que el ancho salga del
    aspect-ratio e **ignore la columna del grid**: 43px de scroll horizontal a
    1024px. Va `width: 100%` + `max-width` + `height`, y `aspect-ratio: auto`
    para dejar claro que manda la altura;
  - `<picture>` es **inline**, así que un `<img>` con `height: 100%` adentro se
    mide contra la caja shrink-to-fit del picture, no contra el marco: la foto
    quedó 497px en un marco de 676px, con una franja oscura debajo. Cualquier
    componente que meta el `<img>` en un `<picture>` (por el WebP) necesita
    `picture { display: block; width: 100%; height: 100% }`.
- **Hero: dos variantes, según la foto que exista.** Con una foto **apaisada**
  (3:2) va full-bleed como la home: `.service-hero__bg` absoluto detrás de una
  capa de contenido con `z-index: 1`, grid de una columna y el copy capado en
  44rem. Con una foto **vertical** va a dos columnas (copy | foto), que es lo que
  tuvo `/werkschutz/` hasta el 2026-08-03 y sigue en git. La razón es concreta:
  las 10 fotos de servicio son verticales 820×1227 y de fondo se recortan a una
  banda.
  - El lavado de legibilidad **no es el mismo en desktop y en teléfono**. En
    desktop es un gradiente de izquierda a derecha (el copy está en la mitad
    izquierda). En teléfono el copy ocupa todo el ancho, así que ahí va un lavado
    **vertical** — si dejás el horizontal, el lede cae sobre la parte más clara de
    la foto. Medido: luminancia promedio 37/255 detrás del lede después del
    cambio. Es la misma jugada que hace el hero de la home.
  - `object-position` se ajusta por breakpoint: una foto 3:2 en un hero alto de
    teléfono conserva solo una franja vertical angosta, y el centro por defecto
    suele quedarse con el fondo vacío en vez del sujeto.
  - El `<link rel="preload">` del hero lleva `imagesrcset` + `imagesizes`, si no
    el preload baja una variante distinta de la que después usa el `<picture>`.
- **Hero a dos columnas** (copy | foto) cuando la foto es vertical: las 10 fotos
  de servicio son verticales (820×1227) y no hay original más grande, así que un
  hero de fondo las recortaría a una banda. Orden del hero: badge de
  certificación → H1 → subline → 3 pruebas con tick → CTA + teléfono → rating +
  sellos DEKRA. En teléfono los dos CTA van full-width y apilados, y la foto
  cierra el hero (el H1 tiene que abrir la página).
- **Un solo primario por pantalla**, y en esta plantilla hay **dos CTA azules en
  toda la página**: el del hero y el de la caja de precios. Cualquier otro link
  es `.service-link` (texto + flecha, con hairline), nunca un tercer botón.
- **Nada de cards con fondo**, salvo la caja de precios: el resto son bloques
  sobre hairlines (`border-top: 1px solid var(--color-border)`). Es el mismo
  lenguaje "ruled, not carded" de la home.
- **La caja de precios es la única superficie elevada** (`--color-bg-elevated`).
  Por eso adentro **no va ningún azul** de texto, ícono ni borde: azul sobre ese
  gris da ≈3,0:1 (ver el caveat de tokens.css). Ticks y label en blanco-alpha; el
  único azul es el relleno del botón, que lleva texto blanco encima.
- **Las tarjetas de riesgo llevan ilustración isométrica** (cliente 2026-08-03,
  imagen de referencia: ficha de dibujo técnico). Cada una es: número en caja →
  título en mayúsculas chico → escena isométrica entre dos filetes → descripción.
  Dos por fila en desktop, no cuatro: a 4 columnas la tarjeta mide ~290px y la
  escena no se lee.
  - **Las ilustraciones se dibujan acá, no se piden como imagen.** Son SVG inline:
    cero requests, cero archivos que optimizar, y las líneas siguen los colores de
    la sección — `.rz-line` es `currentColor`, `.rz-accent` el azul de marca,
    `.rz-guide` las guías punteadas. Por eso las mismas cuatro escenas funcionan en
    una sección negra o blanca sin un segundo set de archivos.
  - **La geometría se genera, no se escribe a mano.** Hay un script que proyecta
    coordenadas 3D reales (una sola proyección isométrica, cuboides/planos/discos
    en unidades de mundo) y recorta el `viewBox` a lo dibujado. Escribir path data
    isométrico a mano es exactamente donde estos dibujos salen torcidos.
  - Las cuatro comparten una caja de arte 4:3 (`aspect-ratio` + el
    `preserveAspectRatio` por defecto). Sin eso cada `viewBox` recortado tiene su
    propia proporción (1,33 a 1,60), las alturas de arte quedan distintas y los
    pies de tarjeta dejan de alinearse en la fila.
  - `aria-hidden` en cada SVG: la escena solo repite el texto que tiene al lado.
  - Si la tarjeta ya tiene ilustración, **no lleva además ícono de sprite**: son
    dos íconos para una sola idea.
- **Las tarjetas de Anwendungsfälle son cards azules con el reflejo del CTA**
  (cliente 2026-08-03: "el mismo estilo que el CTA, azules y brillosas, con el
  reflejo"). Gradiente azul + highlight de 1px arriba + sombra suave, y el sweep
  del botón.
  - **El fill es el `#3D9AD3` del CTA**, plano, igual que `.btn--primary`
    (decisión del cliente, reafirmada después de plantearle el contraste). Blanco
    sobre ese azul da **3,11:1**: pasa el 3:1 de componentes de interfaz y texto
    grande, no el 4,5:1 de texto normal, y cada card lleva un párrafo. Queda como
    caveat conocido — el mismo que ya carga el botón primario. Todo el texto de la
    card va en **blanco puro, sin alpha** (cualquier transparencia lo empeora), y
    la jerarquía se hace con tamaño y peso. Los cuatro números medidos y la salida
    si algún día se revisa están en
    [design-system §7](design-system.md#7-contraste).
  - **El brillo se reutiliza**: `@keyframes btn-shine` (components.css), con
    `animation-delay` escalonado por card para que no titilen todas juntas. Va
    **detrás** del contenido (`z-index: 1` en los hijos) y con la banda al 0,28 en
    vez del 0,42 del botón: sobre párrafos, arriba y más fuerte, se lee como
    reflejo molesto encima del texto.
  - **Uno solo por página.** Es un momento, no un estilo de card: cuatro
    superficies azules ya son bastante presencia al lado de los 2 CTAs. Y no se lo
    pongas a un grupo que ya tenga ilustración — las escenas isométricas usan
    `currentColor` y guías punteadas, y sobre azul dejan de leerse como dibujo
    técnico.
  - ⚠️ **Trampa medida:** en una `.section--light`, `.section--light h3` es (0,2,0)
    y le gana a `.service-cases__item h3` (0,1,1) → el título sale casi negro
    sobre el azul. Se iguala la especificidad; no hace falta `!important`.
- **El bloque de precios es una grilla de dos columnas, 55/45** (cliente
  2026-08-03). Izquierda: eyebrow → H2 → intro → factores. Derecha: la card de
  precio, con el **borde superior alineado al del intro** (`align-self: start`,
  no `stretch`). Gap 64–80px en desktop, menos en tablet.
  - **Una sola grilla para toda la sección**, con `grid-template-areas`. Si el
    intro va a lo ancho y abajo una fila de dos, la card arranca muy por debajo
    del título — que fue exactamente el problema.
  - **La card va entre el intro y los factores EN EL DOM.** En teléfono el precio
    y el CTA tienen que aparecer antes que la lista, y eso se resuelve con el
    orden del markup, no con `order` (§7: si lo hacés con `order`, el orden de
    tabulación queda al revés de lo que se ve). En desktop las áreas la mandan a
    la columna derecha y se lee igual de bien: título → intro → precio → qué lo
    mueve.
  - Los factores son **filas con filete y un `+` azul de `::before`**, no cards
    ni una tabla. Texto en `--color-gray` **sólido** (9,24:1 sobre blanco), no en
    `--color-text-muted`, que en sección clara es 0,75 de alpha y da 4,56:1.
  - ⚠️ El CTA de la card: `.btn` es `white-space: nowrap`, así que en teléfono su
    min-content se pasa del ancho interno de la card (medido: 9px de scroll
    horizontal a 360px). Necesita `width: 100%` + `white-space: normal`. Y ojo con
    `align-self: stretch` — la card es un contenedor de bloque, ahí no hace nada y
    el botón se sale del padding derecho.
- **La comparación A-o-B son dos paneles, no una tabla** (cliente 2026-08-03:
  la tabla de criterios "feels flat... does not guide them clearly toward a
  decision"). Un panel por servicio, misma estructura en los dos —
  label de contexto → título → una línea de explicación → tres criterios →
  acción — y **el servicio de la página propia lleva la prioridad visual**:
  filete azul arriba, relleno apenas más claro, borde azul tenue. El otro va
  neutro. Nada de glow ni sombras.
  - Los criterios siguen siendo pares término/valor: un `<dl>` por panel, con
    cada par envuelto (`<div><dt><dd></div>`) para poder maquetarlos como filas.
    Se agrupan **por servicio**, no por criterio, que es como lee alguien que
    está eligiendo.
  - **Por qué se abandonó el `<table>` y no se reestiló:** las semánticas de
    fila/columna son justo lo que la hacía leerse como planilla, y una tabla
    simétrica no puede expresar que un lado pese más que el otro.
  - **Abajo va una tira de decisión** ("¿No sabe cuál le corresponde?" + CTA a
    la conversión). Es lo que hace que la sección termine en una acción en vez
    de en una comparación. Los links secundarios (el del otro servicio, el del
    Ratgeber) viven **dentro** del panel o de la tira, nunca como una fila de
    links suelta debajo.
  - El azul **nunca es lo único** que distingue los dos servicios (WCAG 1.4.1):
    el label de contexto, el título, la explicación y el ícono lo dicen igual.
  - En teléfono: apilados, el de la página primero, todos los criterios visibles,
    la tira inmediatamente después. Ojo con `min-width: 0` en los hijos del grid
    de la tira — sin eso, la palabra más larga le da scroll horizontal a la
    página (16px medidos a 360px).
  - Un solo ícono de línea por servicio, del tamaño del label, no un badge
    decorativo por fila. `#icon-factory` / `#icon-building` se agregaron al
    sprite para esto (partials/icon-sprite.html) — al sprite, no inline.
  - **La sección va centrada** (cliente 2026-08-03): eyebrow, H2, la línea de
    intro, el bloque de paneles y la tira, todos sobre un mismo eje
    (`margin-inline: auto` + `text-align: center` en el header). El
    `.section-eyebrow` necesita `justify-content: center` aparte porque es un
    flex row — el `text-align` del padre no lo mueve. **Adentro de los paneles el
    texto queda a la izquierda**: son pares label/valor y centrarlos les saca el
    borde izquierdo común contra el que el ojo compara. Header centrado + contenido
    de card a la izquierda es el mismo patrón de las secciones centradas de la home.
  - La línea de intro va **en tamaño de texto normal** (hereda el body, 16px), no
    en `--font-size-lg`: a 21–25px se leía como un segundo título y competía con
    el H2. Lo que le da peso es la posición, no el tamaño.
  - **Cada bloque de texto tiene que aportar algo nuevo** (cliente 2026-08-03:
    "es mucho texto el título más el subtítulo más el texto"). En la primera
    versión la sección decía lo mismo tres veces: el párrafo largo repetía los
    criterios de los paneles, y la línea de explicación de cada panel repetía su
    propio label más la fila "Typisches Objekt". Quedó: **una** línea de intro
    debajo del H2, y en cada panel label → título → tres criterios → acción. Si
    hay que elegir qué recortar, se queda el contenido aprobado original (los
    criterios del draft) y se va el que se escribió para el rediseño.
- **Referencias: solo lo que el cliente dio.** Si el draft dice "Referenzen auf
  Anfrage", la sección dice eso y muestra los logos que nombra, sin inventar un
  testimonio. Los logos de cliente son siluetas blancas sobre transparente en
  `assets/images/client-logos/`, mismo tratamiento que la home.
- **Persona de contacto:** nombre, cargo, teléfono directo y mail del draft. Si no
  hay foto, el bloque va sin foto (está armado para aceptarla como columna) —
  nunca una foto de stock.
- El **FAQ visible y el `FAQPage` del JSON-LD tienen que coincidir 1:1**. Es
  fácil de verificar y fácil de romper cuando se edita una respuesta.
- Sección clara / oscura: esta plantilla es **toda oscura**, alternando
  `.section` y `.section--subtle`. No hay secciones blancas, así que tampoco hay
  `data-nav-theme` en ninguna.

### 8.3 SEO y GEO que ya está resuelto

- `<title>` y `<meta description>` salen tal cual del draft (ya vienen con el
  largo contado).
- JSON-LD: `Organization` + `LocalBusiness` + `Service` + `BreadcrumbList` +
  `FAQPage`. En `Service` va `areaServed` con las 10 ciudades y, si el copy
  publica un rango de precio, un `offers` con `UnitPriceSpecification`
  (`minPrice`/`maxPrice`/`unitCode: "HUR"`).
- Los H2 con forma de pregunta ("Was kostet Werkschutz?", "Werkschutz oder
  Objektschutz?") con la respuesta en la primera frase: es la regla GEO de
  CLAUDE.md y los drafts ya están escritos así. No la "arregles" a un título
  corto de keyword.
- Los links internos apuntan a las URLs confirmadas de la guía §2.2 aunque la
  página todavía no exista. Son links reales, no placeholders.

### 8.4 Para armar la siguiente

Copiar `pages/werkschutz.html`, abrir el draft del servicio, y cambiar: meta y
JSON-LD, H1 y todo el copy, la foto del hero
(`assets/images/<slug>.webp/.jpg`, ya están las 10), el rango de precio, los
factores de la sección de costos, la tabla comparativa si ese servicio se
delimita contra otro, los `id` del formulario y las listas de links. **No tocar
`page-service.css`, `lead-form.css` ni `components.css`**: si el contenido no
entra (8 items de alcance en vez de 6), son más `<li>`, no CSS nuevo.

---

## 9. Página de empresa: reusar el chasis

Referencia: `pages/referenzen.html` + `css/page-referenzen.css` (2026-08-03). Es
la primera página que **no** es servicio ni contacto, y lo que dejó claro es
esto:

### 9.1 `css/page-service.css` es el chasis, no "la hoja de Werkschutz"

Casi todo lo que este documento pide para **toda** página vive ahí, solo porque
Werkschutz fue la primera que lo necesitó:

| Pieza | Sección de este doc |
|---|---|
| `--content-inset` en los dos lados | §1 |
| `main h2` grande y regular | §2 |
| Chevrón del breadcrumb | §3 |
| Todo el bloque `.pixel-seam*` + el padding que reserva lo que sigue | §4.4 |
| `.section--light` (re-declara los tokens para una sección blanca) | §5 / §8.2 |
| `.service-hero*` y `.service-link` | §8 |

Así que una página nueva **linkea `page-service.css` como chasis** y su propia
hoja queda chica (Referenzen: ~300 líneas). Orden en el `<head>`:
`head-common` → `lead-form.css` → `testimonials.css` (si lleva testimonios) →
`page-service.css` → la hoja de la página. No copies esos bloques a mano.

Si el hero no lleva foto, es `.service-hero` con una columna: hay que pisar
`grid-template-columns` y el `min-height: calc(100svh - 8rem)` que la plantilla
de servicio fuerza a ≥1024px (ese min-height existe por la foto vertical; sin
foto deja una pantalla de negro vacío abajo del CTA). Los cuatro bloques de
adentro conservan los nombres `.hero__lead` / `__actions` / `__reassurance` /
`__trust` y `js/hero-reveal.js` funciona sin una línea de JS por página — y
tolera que falte alguno de los cuatro.

### 9.2 Dos secciones del mismo color, sin seam

Si dos secciones seguidas son blancas (un número y la cita del cliente que está
detrás, por ejemplo), **no va seam entre ellas**: los tiles serían blancos sobre
blanco, o sea nada. Se leen como una sola área clara — es lo que hace la propia
homepage con resultados + testimonios dentro de una sola `.references`.

⚠️ **Trampa medida:** para pegarlas, `padding-top: 0` en la segunda **no** sirve.
Sin padding ni borde, el margen superior del primer hijo (el `.section-eyebrow`,
16px) **colapsa hacia afuera** de la sección y aparece como una franja del fondo
negro de la página entre las dos blancas. Se vio en una captura, 16px a 1440px.
La solución es un `padding-top` chico (`--space-4`): contiene el colapso y el
hueco visible no cambia, solo pasa a ser blanco.

### 9.3 Logos de cliente: una fila que pasa, por grupo

Cliente 2026-08-03: **"quiero una linea para cada uno y que vayan pasando como en
la homepage"**. O sea: por cada grupo de clientes, una fila que se desplaza sola.
Reemplazó dos cosas en `/referenzen/`: las píldoras con los nombres y una fila
estática de logos arriba de ellas (con las filas por grupo, esa fila mostraba las
mismas marcas dos veces).

**Mecanismo** (el mismo de la homepage, copiado a `page-referenzen.css` porque
`page-home.css` no se carga en otras páginas — mantené los dos en sincronía): la
fila recorta y enmascara los bordes, el track anima `translateX(-50%)`, y el track
tiene N grupos **idénticos**; cada grupo lleva su gap final como `padding-right`
para que el salto caiga exacto. Todo CSS, sin JS.

⚠️ **Cuántos grupos — dos reglas.**
1. `-50%` desplaza **la mitad del track**, así que el loop es prolijo solo mientras
   esa mitad siga llenando la fila. Con 21 items un grupo ya sobra → **2 grupos**;
   con 9 items → **4**; con 4 items → **6**. Si te equivocás, un hueco vacío cruza
   la fila (medido: al sacar dos clientes, una fila quedó 38px corta y otra 15px).
2. **El número tiene que ser PAR.** La mitad de un número impar de grupos es medio
   grupo, así que el desplazamiento no cae en un borde de grupo y la fila salta. 3
   grupos nunca; 4 o 6.

Y ojo: **sacar o agregar un solo cliente puede invalidar las dos reglas.** Volvé a
medir después de cualquier cambio en la lista, y volvé a derivar las duraciones.

⚠️ **La duración no es una velocidad.** Cubre media pista, y media pista mide
~3.300px en la fila de 21 contra ~1.800px en las cortas. Con una duración
compartida la fila larga se arrastra. Se calcula al revés: elegí px/s (acá ~10, el
paso real de la homepage) y derivá la duración de cada fila. En teléfono los grupos
son más angostos, así que las tres duraciones bajan otra vez.

⚠️ **`minmax(0, 1fr)` + `min-width: 0`, medido.** El mínimo automático de un item
de grid es su contenido, y el track son 4.600–6.600px de max-content: con una
columna implícita `auto` la fila creció hasta el ancho de su propio track y se
llevó la página con ella — **5.290px de scroll horizontal a 1440px**, y de paso
todos los loops roto (la fila más ancha que media pista). El `overflow: hidden` de
la fila no alcanza: hay que clampear la columna **y** el item.

**Peso óptico.** Dimensionar solo por `height` desbalancea: los wordmarks anchos
(DB NETZE, Mücke, GNC TCS) dominan y las marcas compactas (MORELO, Stadt Bamberg,
Landkreis Coburg) quedan ilegibles. Los anchos se capean por **ancho**
(`max-width` en un elemento reemplazado recalcula el alto, así que no deforma) y
los compactos reciben **más alto**, por `[src*="…"]`. Ojo: ese selector de atributo
le gana a la clase sola, así que el bloque de teléfono tiene que repetir los dos
grupos.

**Clientes sin logo.** No se los saca de la lista: van en la misma fila con el
**nombre en tipografía**, un paso más apagado que una marca real (medido en
captura: a 0.72 de blanco el nombre se leía más fuerte que los logos, lo que
invierte la jerarquía; 0.62 lo arregla). Además es lo que mantiene con suficientes
items a una fila corta. Cuando llega el logo es un `<span>` → un `<img>`.

**Movimiento reducido:** la fila se convierte en un bloque estático que envuelve,
con **todos** los clientes visibles; los grupos duplicados se ocultan. `flex-shrink`
del grupo tiene que volver a 1 ahí, o el grupo mantiene su max-content dentro de una
fila más angosta y el `overflow: hidden` lo recorta (bug que la homepage tuvo un
tiempo: 3 de 8 logos visibles a 390px).

Y el resto de la lista sigue siendo **texto HTML real**: el `alt` de un logo lleva
el nombre de la empresa, y eso es lo que leen un crawler y un motor de respuestas.

### 9.4 Contenido que el cliente no dio

Si el draft trae un `[ERGÄNZEN: …]`, la sección se construye con lo que sí hay y
el hueco queda anotado en el HTML y en la checklist. No se escriben tres case
studies sobre empresas reales con nombre y apellido para llenar una grilla. Mismo
criterio que §8.2 ("Referenzen: solo lo que el cliente dio").

---

## 10. Checklist de página nueva

- [ ] `<title>` 50–60 y `<meta name="description">` 140–160, únicos
- [ ] canonical, Open Graph, Twitter, `robots`, `hreflang`, `<html lang>` real
- [ ] JSON-LD del tipo que corresponda + `BreadcrumbList` (todas menos la home)
- [ ] Un solo `<h1>`, sin saltos de nivel
- [ ] Breadcrumb con chevrones (§3), con la página actual como texto y
      `aria-current`
- [ ] `padding-inline: var(--content-inset)` **en los dos lados**, reducido en
      teléfono — y sumado al padding del container si cae sobre el mismo
      elemento (§1)
- [ ] Títulos con la escala de la homepage (§2), incluido el H1
- [ ] `hyphens: none` en ledes, listas, celdas y cards (§7)
- [ ] Stack de efectos cargado + hooks (`data-reveal` / `data-item-reveal`)
      puestos, y entrada CSS para lo que está arriba del fold
- [ ] **Pixel seam antes del footer**, con el color de tile correcto y el
      `padding-top` del footer reservado
- [ ] Formulario: `css/lead-form.css` linkeado (no copiar el CSS), honeypot
      incluido, `id` de campos únicos, y la sección compuesta como en §6
- [ ] Si es página de servicio: los 12 bloques y las decisiones fijas de §8
- [ ] Si no lo es: `page-service.css` como chasis (§9.1), y nada de re-copiar
      inset / `main h2` / breadcrumb / seam / `.section--light`
- [ ] Tarjetas de acción clickeables enteras, con foco visible (§3)
- [ ] Medida a 360/390/430/768/1024/1440 sin scroll horizontal, áreas
      táctiles ≥44px
- [ ] Sumada a `sitemap.xml`
- [ ] Marcada en [build-checklist.md](build-checklist.md), en el mismo commit
