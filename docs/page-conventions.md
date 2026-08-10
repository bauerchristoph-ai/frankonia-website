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
10. [Página de ciudad](#10-página-de-ciudad)
11. [Página combo: servicio × ciudad](#11-página-combo-servicio--ciudad)
12. [Checklist de página nueva](#12-checklist-de-página-nueva)

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
| Tira que se desliza (solo teléfono) | una card a la vez con la siguiente asomando, en vez de N apiladas | `data-swipe-carousel` + `swipe-carousel.css/js` (ver §7.1) |

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

⚠️ **Cuando arriba y abajo son el mismo negro, el tile no se ve** — y eso pasa en
toda página cuya última sección es oscura (la del formulario, típicamente). Ahí el
seam del footer no hace un barrido sino un **pulso**: los cuadraditos suben a blanco
sólido y bajan a medida que la ventana de scroll los cruza.

**No hay que declararlo.** Desde 2026-08-10 `js/pixel-transition.js` mide la
condición en el borde `main → footer` — la superficie de arriba, el footer y el
propio tile resolviendo al mismo color — y agrega `.pixel-seam--pulse` solo. Si esa
última sección pasa a ser clara, vuelve solo a ser un barrido. Hoy da pulso en
`/referenzen/`, `/einsatzgebiete/`, `/leistungen/` y `/ueber-uns/`.

⚠️ **La detección está acotada a ESE borde a propósito.** Una primera versión
comparaba las superficies de todos los seams y se equivocó en el homepage: el fondo
propio de una sección suele ser transparente, así que hero → trust band midió
"negro contra negro" cuando el blanco sobre el que disuelve vive en un HIJO de la
sección siguiente. En el borde del footer no hay nada que adivinar: los dos lados
pintan su propio fondo opaco. Para un seam a mitad de página que quiera este look
queda `data-pixel-seam-mode="pulse"` como escotilla.


| | |
|---|---|
| **Color del tile** | El del fondo de la sección de arriba. Página blanca → `.pixel-seam--white`. Página negra → sin modificador (el default es `--color-bg`). Si la de arriba es `.section--subtle` va `.pixel-seam--subtle` (#090909): un negro apenas distinto se nota y se lee como "dos negros". **Si la de arriba tiene un degradado en su borde inferior, el tile tiene que llevar el mismo stack, no el color plano** — `.pixel-seam--konzept` (home) y `.pixel-seam--navy` (`/werkschutz/`, banda navy del Risiko) le dan al tile el `#00091F` + `--color-blue-light` a 0.38 de la propia sección, en vez de hardcodear el hex compuesto. Mantené el 0.38 en sincro con el primer stop de la sección. |
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

### 4.7 Secuencia de pasos: los hooks de `js/steps-sequence.js`

Un timeline de pasos scrubbeado (el marcador aterriza → su copy sube → recién
entonces el riel dibuja hacia el siguiente). Cuatro páginas lo usan hoy —
`/jobs/`, `/werkschutz/` (Konzept), `/brandwache-nuernberg/` (Ablauf) y
`/ueber-uns/` (Meilensteine) — y **todo lo que agrega es opt-in**, así que sumar
un consumidor no toca a los otros:

| hook | qué hace |
|---|---|
| `data-steps-sequence` | en la lista. Los hijos elemento son los pasos |
| `data-steps-marker="<sel>"` | el marcador es un elemento REAL; sin él se asume pseudo-elemento y se maneja por `--step-node` |
| `data-steps-draw="<sel>"` | el line art inline de ese paso se dibuja en vez de aparecer |
| `data-steps-mark="<sel>"` | el resaltado de ese título barre con la llegada del paso |
| `.is-arrived` (sin atributo) | **la clase que el script pone en el paso** cuando su marcador terminó de aterrizar, y saca al volver para arriba |

Los dos que se olvidan y cuestan una vuelta:

- **`data-no-text-reveal` es obligatorio en la lista, y `data-item-reveal` no
  puede estar.** Dos timelines sobre el mismo elemento es lo que hace que un
  reveal se vea roto.
- **Todo valor que el CSS consuma tiene que caer en el estado TERMINADO cuando la
  propiedad no existe** — `var(--step-line, 1)`, `var(--mark, 1)`. Ese default ES
  el contrato sin JS / con `prefers-reduced-motion`: el script sale temprano en
  los dos casos y nunca escribe nada. Un fallback en 0 publica una sección vacía,
  que es el bug con el que `.service-contrast__mark` salió una vez.

**`.is-arrived` existe para animaciones de UNA sola pasada**, que un timeline
scrubbeado no puede expresar: no hay "un momento" al que atar un `@keyframes`,
y el scrub no tiene dirección propia. El único consumidor hoy es el aro que se
expande alrededor de los puntos de `/ueber-uns/` — el mismo
`.pain-hook__node::after` del homepage, valores copiados y no re-derivados, así
que los dos se leen como un sistema. Que el script la SAQUE al volver para arriba
es lo que permite que la animación se repita la próxima vez que bajás.
⚠️ Sólo la agrega JS, así que sin JS y con reduced motion el aro simplemente no
existe — correcto, es decoración, no contenido.

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

### 6.0 El formulario de cierre es un partial — se incluye, no se copia

Desde 2026-08-06 el formulario de conversión vive en `partials/lead-form.html`.
No lo copies a una página nueva:

```html
<!-- include: lead-form prefix="ob" messageLabel="Ihr Objekt und Ihre Anforderung" -->
```

| Parámetro | Qué es |
|---|---|
| `prefix` | prefija **todos** los `id`/`for` del formulario. **Único por página**: dos formularios con los mismos id en un documento rompen cada `<label for>`. En uso: `cf` (home), `wk` (werkschutz), `rf` (referenzen). |
| `messageLabel` | el único label que cambia por página. El resto es idéntico a propósito. |

`build.js` sustituye valores y nada más — **no tiene condicionales y no va a
tenerlos**. Si una página necesita otros campos, no es este partial.

**Dos páginas NO lo usan, y está bien:** `/kontakt/` tiene otros campos
obligatorios (Firma y Telefon opcionales, Nachricht requerido) y `/jobs/` es otro
formulario (select de Qualifikation, subida de CV, sin Firma). Meterlos acá
pediría condicionales, y son dos casos únicos, no el que se repite 44 veces.

**El honeypot es parte del partial.** La copia a mano del homepage no lo tenía;
la extracción cerró ese hueco solo. Es el argumento entero a favor de compartir:
el bug existía porque había cinco copias.

**Valores compartidos:** `content/values.json` guarda precio, teléfono,
dirección, rating y contadores. Se usan como `{{phone.display}}` en cualquier
página o partial. **Si el marcador no existe, el build falla** — nunca se publica
un `{{...}}` literal. Antes de esto, cambiar el precio eran 54 ediciones a mano
(27 páginas × visible + JSON-LD), que es justo donde el FAQ visible y su JSON-LD
se desincronizan sin que nadie lo note.


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
construye. Pero "responsive" no alcanza: una fila de tarjetas apilada **entra**
en un teléfono y aun así puede ser mala. Antes de dar una página por lista,
medí cuántas pantallas mide y de dónde salen (§7.2).

Mínimos, todos verificados con medición y no a ojo:

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

### 7.1 Una fila de tarjetas en un teléfono: la tira que se desliza

**No la apiles: es la tira compartida.** `css/swipe-carousel.css` +
`js/swipe-carousel.js` (extraídas el 2026-08-04 de las 6 cards de "Unser
System", hoy también en el reel de Social, los testimonios de Referenzen y las
4 cards de Arbeitgeber de `/jobs/`): una card a la vez con el borde de la
siguiente asomando, scroll-snap nativo, abajo de 768px y nada más.

```html
<ul class="mi-grid" data-swipe-carousel
    data-swipe-label="Cuatro razones …, horizontal scrollbar">
```

- Los **hijos directos** son las cards. El contrato es ese atributo, nada más.
- **La tira es CSS puro** (overflow-x + scroll-snap): desliza sin JS. El script
  solo agrega el contador "01 / 04", la línea de progreso y las flechas del
  teclado.
- Las perillas van en la **sección**, no en la tira (el contador y la línea son
  *hermanos* de la tira y las custom properties heredan hacia abajo):
  `--swipe-card` (86vw), `--swipe-edge` (4vw), `--swipe-gap` (3vw) y
  `--swipe-bleed`. Ese último es el que hay que acertar: si la tira vive dentro
  de un `.container` con padding **y** el `--content-inset` de §1, tiene que
  escapar de los dos —
  `calc(-1 * (var(--container-padding) + var(--space-2)))` — o la primera card
  arranca 32px adentro y la última nunca llega a su posición de snap.
- **Cargá la hoja última**, después de la hoja de la página, y acordate de que
  entonces cualquier override propio tiene que ser de **dos niveles**
  (`.jobs-why .jobs-why__grid`, no `.jobs-why__grid`).
- ⚠️ **Trampa medida:** si tus cards usan `height: 100%` para igualarse en el
  grid de desktop, en la tira eso las **rompe** (medido: 448/426/426/426). Un
  alto porcentual contra un contenedor flex de alto automático se resuelve antes
  de que `align-items: stretch` pueda actuar. En la tira: `height: auto` +
  `align-items: stretch` de dos niveles.
- El scroll horizontal queda **contenido** en la tira; el documento nunca
  scrollea de lado. Verificalo con `strip.scrollWidth > strip.clientWidth` y
  `documentElement.scrollWidth === innerWidth` en la misma medición.

### 7.2 El ritmo de la página también es responsive

Los seams de píxeles y el padding de sección son valores de desktop. En
`/jobs/`, medido a 390px: **1.560px de padding vacío** — cada sección después de
un seam reserva `--space-9 + 120px` (216px) arriba más 96px abajo, y eso cinco
veces es un cuarto de pantalla en blanco antes de cada título, cinco veces.

Se ajusta con una clase en el `<body>` (`.page-jobs`, igual que `/kontakt/`),
porque las reglas que se pisan viven en `page-service.css` y las cargan todas
las páginas:

```css
@media (max-width: 767.98px) {
  .page-jobs .pixel-seam__band        { height: 80px; }
  .page-jobs .section                 { padding-block: var(--space-8); }
  .page-jobs .pixel-seam + .section   { padding-top: calc(var(--space-8) + 80px); }
  .page-jobs .pixel-seam + .conversion{ padding-top: 80px; }
  .page-jobs .pixel-seam + .site-footer { padding-top: calc(var(--space-8) + 80px); }
}
```

⚠️ **El alto de la banda y la reserva tienen que ser iguales.**
`js/pixel-transition.js` mide la banda que le dan y la llena de tiles: si la
reserva es menor que la banda, los tiles tapan contenido real. 80px todavía da
~3 filas de tiles de 24px, que es lo que tiene la home en teléfono.

Resultado en `/jobs/`: 11.287px → 9.146px a 390px (13,4 → 10,8 pantallas), sin
tocar una palabra de copy.

### 7.3 Cómo medir (dos trampas que cuestan tiempo)

1. Chrome fuerza un viewport mínimo de ~500px. `--window-size=390` te da una
   **captura** de 390px de un **layout** de 500px. Meté la página en un
   `<iframe>` de ancho fijo dentro de una ventana ≥500px y medí ahí adentro.
2. Con `--virtual-time-budget` el scroll no se asienta: Lenis maneja la
   posición, ScrollTrigger necesita eventos reales y las transiciones se
   congelan a mitad de camino. Para una foto honesta, forzá
   `--force-prefers-reduced-motion`. Sin ese flag las capturas salen con el
   contenido a `opacity: 0` (los reveals no dispararon) y los seams a medio
   disolver.
3. **Para verificar una animación atada al scroll, no la mires: leela.**
   `window.scrollTo()` no hace nada acá — Lenis es el dueño de la posición, así
   que hay que moverla por donde la mueve un wheel de verdad, y después leer el
   progreso que el trigger mapeó:

   ```js
   w.__lenis.scrollTo(px, { immediate: true });   // no window.scrollTo
   w.ScrollTrigger.update();                       // lo que hace el handler de Lenis
   var st = w.ScrollTrigger.getAll().find(s => s.trigger === miElemento);
   st.progress;            // 0..1 mapeado desde el scroll
   st.animation.progress(st.progress).pause();     // el scrub es temporal: seekealo
   ```

   Con eso se puede tabular el estado a 0 / 25 / 50 / 75 / 100 % del rango y ver
   si la secuencia pasa en el orden que se pidió, en vez de deducirlo de una
   captura. Así se encontró que el círculo azul de `/jobs/` estaba blanco: el
   estilo computado lo decía, la captura (con la animación sin disparar) no.

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

- **Sin eyebrows** (cliente 2026-08-04). `/werkschutz/` tenía uno arriba de cada
  una de sus 10 secciones — Risiko, Vorteile, Leistungsumfang, Abgrenzung,
  Anwendungsfälle, Sicherheitskonzept, Kosten, Ansprechpartner, FAQ, Weiterlesen —
  y salieron todos. **Era mobiliario de UI que agregó este build, no copy de
  ningún draft**, así que no se perdió nada aprobado. Una página de servicio nueva
  arranca sin ellos: el H2 es el primer elemento de cada sección.
  El componente `.section-eyebrow` y su variante `.section--light` siguen en
  `page-service.css` porque `/referenzen/` y `/jobs/` cargan esa hoja como chasis
  y las dos todavía los usan — no las borres desde una página de servicio.
  ⚠️ Las dos reglas que le daban `justify-content: center` al eyebrow en las
  secciones centradas (`.service-faq`, `.service-compare`) se fueron con ellos.
  Si un eyebrow vuelve a una sección centrada, **esa regla tiene que volver
  también**: es un flex row y el `text-align` del padre no lo mueve (§ más abajo).

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

### 8.3b El Leistungsumfang es scrollytelling 50/50 (2026-08-04)

Pedido del cliente, **solo desktop y tablet grande**; el móvil queda como estaba.
Mitad izquierda: el título más las 6 duties, que se revelan una por paso de
scroll y **se acumulan** (la que ya pasó sigue legible). Mitad derecha: un panel
sticky de imagen a sangre contra el borde del viewport, que hace crossfade a la
foto de la duty activa. `js/service-flow.js` + el bloque
`@media (min-width: 1152px)` de `page-service.css`.

Seis cosas que se midieron y que la próxima página de servicio no debería
re-descubrir:

1. **Para que el panel sea la mitad exacta del viewport, el bloque tiene que
   salir de `.container`.** Es hijo directo del `<section>` y re-crea la geometría
   del container como padding propio (`--flow-page-lead`: centrado + padding +
   `--content-inset`). Medido: el borde izquierdo del texto coincide al píxel con
   el de las otras secciones en 320 / 360 / 390 / 430 / 768 / 1024 / 1151.
   ⚠️ Un porcentaje dentro de una custom property se resuelve contra el elemento
   que la **usa**, así que `--flow-page-lead` solo puede consumirla `.service-flow`
   (cuyo ancho es el de la sección). En el desktop se usa como **track de grid**,
   no como padding: con padding, el `50%` de la columna de la foto pasa a ser
   "la mitad de lo que sobra".
2. **Una columna sticky solo aguanta mientras su borde inferior está dentro del
   contenedor**, así que la distancia de scroll útil es `alto − banda`, no `alto`.
   Sin ese término las 6 duties se repartían 3068px en 1440x900 (511px = 57vh,
   abajo del piso del brief) y el panel se iba mientras la duty 06 seguía activa.
   `min-height: calc(6 * --flow-step-scroll + --flow-h)` → 635px por duty, 71vh.
3. **Las dos columnas necesitan el mismo alto** (`--flow-h`) o se liberan en
   momentos distintos: la más corta se va scrolleando hacia arriba mientras la
   foto sigue pinneada.
4. **La lista se maqueta una sola vez y solo cambia `opacity`/`transform`.** Las
   duties futuras siguen ocupando su lugar, así que la lista tiene su alto final
   desde el primer frame: cero layout shift y nada que re-medir. Revelar con
   `display`/`height` haría saltar la lista en cada paso.
5. **Cuánto entra en una pantalla es el límite de todo el diseño, y se mide.**
   Cada línea de texto que le agregás a un item se multiplica por 6. Con el copy
   aprobado, título + 6 duties necesitan 533–621px según el ancho, y entran
   completas desde **1440x900**; abajo de eso se ven 4–5 de 6 y
   `js/service-flow.js` desplaza la lista lo justo para que la duty **activa**
   esté siempre entera, con el borde superior difuminado. Dos números que muestran
   la escala del efecto: el `max-width: 42ch` de la descripción costaba ~330px de
   lista, y la etiqueta de categoría por item costaba 138px. Por eso el breakpoint
   es **1152px y no los 1024 de siempre**.
6. **Todo el split va detrás de `.service-flow--stepped`, que solo agrega el JS.**
   No es cosmético: la lista vive en una columna recortada de alto de viewport, así
   que sin script la duty 06 quedaba cortada. Con la clase, sin JS / con
   `prefers-reduced-motion` / abajo de 1152px cae al layout base — 6 pares de
   texto + foto en flujo normal, todo visible. Verificado con la ejecución de
   scripts desactivada: 6 duties y 6 fotos en `opacity: 1`.

Una excepción declarada: el H2 de esa sección **no** usa el clamp compartido de
§2 (llega a 40px, no a 60). Es el único título del sitio que tiene que compartir
pantalla con todo el contenido de su propia sección; a 60px solo el título se iba
a tres líneas y el bloque pedía 1260px contra los 820px de un 1440x900. En móvil
mantiene el clamp compartido.

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

## 10. Página de ciudad

Referencia: `pages/sicherheitsdienst-nuernberg.html` + `css/page-city.css`
(2026-08-09). Son **10 páginas** y las 16 combo reusan varios de estos bloques.
Se construyó Nürnberg primero porque su propio draft se titula "WICHTIGSTE
STADTSEITE" (~1.240 búsquedas/mes combinadas, 720 solo en "sicherheitsdienst
nürnberg"), porque `build-checklist.md` Bloque 4 la nombra, y porque su
estructura es la **plantilla** de las otras nueve.

### 10.1 La regla que domina este tipo de página: UWG, "kein Scheinstandort"

FRANKONIA tiene **una** dirección real, en Bamberg. Una página de ciudad no
puede insinuar una sucursal. El draft lo pone como requisito
("Einsatzgebiets-Framing, kein Scheinstandort") y aterriza en cuatro
decisiones concretas:

1. El badge del hero dice **"Einsatzgebiet <Stadt>"**, nunca "Standort".
2. El JSON-LD lleva `LocalBusiness` con el **NAP real de Bamberg** más
   `areaServed: { City }`. **Nunca** una dirección en la ciudad de la página.
3. La primera pregunta del FAQ es "¿Tienen sede en <Stadt>?" y se responde con
   la verdad: coordinación central, esta ciudad es un Einsatzgebiet fijo.
4. El Abbinder de la sección de Erreichbarkeit **no promete tiempos de
   respuesta ni distancias** (Prüfkatalog F10). No agregarlos.

⚠️ **Bamberg es la excepción y su draft es otra estructura**: es el único sitio
con dirección real, así que ahí sí va el NAP completo con geo, el badge dice
"Unser Zuhause: Sitz in Bamberg" y la sección 2 es una Zuhause-Story en vez de
las 4 tarjetas de "Warum". Es una sección distinta, no una hoja distinta.

### 10.2 Las 11 secciones, y de dónde sale cada una

| # | Sección | De dónde |
|---|---|---|
| 1 | Hero (badge · H1 · subline · 3 tics · CTA doble · Google) | `.service-hero*` del chasis + `.city-hero*` |
| 2 | Warum FRANKONIA in \<Stadt\> (4 bloques) | `.city-why*` |
| 3 | Leistungen in \<Stadt\> (8 filas con link) | `.city-services*` |
| 4 | Lokale Einsatzfelder (5 bloques, **el contenido local de verdad**) | `.city-fields*` |
| 5 | Brandwache \<Stadt\> (Pflichtabschnitt) | `.city-callout*` |
| 6 | Kosten in \<Stadt\> | **el bloque del chasis tal cual** (`.service-price*` + `include: price-box`) + `.city-rates` |
| 7 | Vertrauen (2 testimonios + sellos) | `css/testimonials.css` + `.trust-certs*` del chasis |
| 8 | Erreichbarkeit & digitale Nachweise (3 kacheln + Abbinder) | `.city-proof*` |
| 9 | FAQ (6 preguntas ortoespecíficas) | `.faq__list--cards` compartido |
| 10 | Umgebung (vecinas) | `.city-nearby*` |
| 11 | Abschluss-CTA | `partials/lead-form.html` |

Colores: hero ▪ Warum ▫ Leistungen ▪ Einsatzfelder ▫ Brandwache ▪ Kosten ▫
Vertrauen ▪ Erreichbarkeit ▪ FAQ ▫ **Formular ▪ Umgebung ▫** → footer ▪.
**10 seams**: el único par del mismo color es Vertrauen+Erreichbarkeit, y ahí no
va seam (§9.2 — tiles negros sobre negro son nada).

⚠️ **EL FORMULARIO VA ANTES DE UMGEBUNG, al revés que el draft** (cliente
2026-08-10, después de pedir que le explicaran qué eran las dos secciones:
"diferenciámelas… no entiendo"). Se construyó al revés primero y **el resultado
era ilegible, y es medible**: las dos secciones eran el MISMO negro, se tocaban a
**0px** sin nada en medio, y una era izquierda con H2 de 28px mientras la otra era
centrada con uno de 60px. Nada le decía al ojo que una había terminado.
- La causa de que no hubiera separador es correcta y sigue vigente: dos secciones
  seguidas del mismo color no llevan seam. La regla estaba bien; el **orden** no.
- **El draft las trata como UNA sección** — su punto 10 se titula "Umgebung +
  Abschluss-CTA" — que es exactamente por qué se construyeron pegadas. Pero
  funcionalmente tiran para lados opuestos: **un bloque de salidas justo encima de
  la conversión primaria de la página.**
- **La plantilla de servicio ya lo resuelve al revés**: `/werkschutz/` pone su
  bloque equivalente ("Verwandte Seiten") DESPUÉS del formulario, como sección
  clara, con seam a los dos lados — y su propio draft termina "… FAQ → CTA →
  verwandte Seiten". Hay precedente interno para este orden, y **las otras nueve
  ciudades deberían seguirlo.** Ninguna palabra de copy cambió.
- Arregla tres cosas de una: separación real (cambio de color + seam), el
  formulario deja de tener salidas encima, y la página cierra como la plantilla.
- **Umgebung pasa a `.section--light` + `data-nav-theme="light"`**, y ⚠️ **su hover
  era un lavado BLANCO** (`rgb(255 255 255 / 0.06)`), invisible sobre blanco — la
  misma clase de bug que las filas de servicios, en la otra dirección. Ahora usa
  `--color-accent-subtle`, el lavado celeste que la sección clara ya redeclara.
  Medido en claro: título y nombre **20,87:1**, mención 4,6:1, pin en blue-dark.
- **Y va CENTRADA** (misma instrucción): estaba a la izquierda, con las tres pills
  en el tercio izquierdo de una fila de 1234px y el resto vacío. Medido: H2 y
  párrafo a **0px del eje** en los seis anchos, pills centradas desde 768.
  ⚠️ El `<p>` necesitó `margin-inline: auto` y selector de dos clases — **tercera
  vez que aparece la misma trampa en esta página** (el header de Vertrauen y el
  lede de Brandwache necesitaron lo mismo): `.section__intro > p` del chasis es
  (0,1,1) y capa el párrafo en 672px pegados a la izquierda.
- **Costo:** un seam más = **+200px** de reserva; la página pasó de 12.896 a
  13.096px a 1440.
- **Dos cosas de esa captura que NO eran bugs**, y conviene no volver a
  investigarlas: el H2 gris y cortado a mitad es `title-reveal.js`, el reveal por
  carácter atado al scroll que tienen todos los `<h2>` del sitio, congelado en una
  captura estática; y el thumbnail de abajo a la derecha no es de la página — el
  único elemento `position: fixed` del documento es el botón de WhatsApp.

### 10.3 Sin foto, y no es un parche

**No hay ni una foto de ciudad en el proyecto**, y el draft de Nürnberg
**tampoco pide una**: su Hero-Aufbau enumera badge, H1, subline, tics, doble CTA
y el widget de Google, y nada más. (El de Bamberg sí pide una.) Así que el hero
no lleva fotografía, lo cual además le sale gratis: **esta página no tiene
elemento LCP de imagen** — cero preload, cero decodificación.

Lo que ocupa la columna derecha es **el contorno administrativo real de la
ciudad**, como un `<path>` inline:

- se genera **una vez, en desarrollo**, con
  `docs/design-sources/city-outline.py <slug>`, desde los geojson que ya están
  en el repo (`assets/data/coverage-boundaries/`, bajados de OSM/Nominatim en
  julio). 3.566 puntos → 200, ~2,6KB de path;
- es **honesto para un Einsatzgebiet**: un área, no una dirección. Un pin único
  se leería como sucursal, que es justo lo que §10.1 prohíbe;
- **cero requests y cero terceros**, al contrario que los mapas Leaflet de `/` y
  `/kontakt/` (los tiles de CARTO son una llamada a un tercero y todavía no hay
  banner de consentimiento);
- se **dibuja al cargar**, no con el scroll: está arriba del fold, y un reveal
  scrubbeado ahí es el bug que ya pagó el hero de `/referenzen/` (el título
  quedaba a medio revelar hasta que scrolleabas). El `stroke-dasharray` es el
  **largo medido** del path (7381 unidades para Nürnberg), no un número al
  voleo — y el bloque entero va dentro de
  `@media (prefers-reduced-motion: no-preference)` por §4.3;
- **`display: none` abajo de 1024px**: apilado agregaría ~380px de scroll a la
  primera pantalla por algo puramente decorativo. Es seguro justamente porque es
  decorativo (`aria-hidden`, sin texto propio).

### 10.4 Cosas medidas que la próxima ciudad no debería re-descubrir

- **Los tics del hero van en COLUMNA, no en fila.** Los del draft son frases
  enteras ("Feste Teams für laufende Aufträge, direkt vor Ort im Objekt"), y en
  fila piden ~1000px contra los ~640 que tiene la columna de copy. Es la misma
  medición que hizo `/jobs/`, donde el cliente eligió la lista. `.city-hero__points`
  necesita **`align-items: flex-start`**: la regla compartida centra sus items
  para el layout de fila, y en columna eso los centra horizontalmente.
- **Las 4 cards de "Warum" son PANELES BLANCOS ELEVADOS, las mismas que los
  Anwendungsfälle de `/werkschutz/`** (cliente 2026-08-09: "iguales a las cards de
  werkschutz en donde hay 4 cards en una fila, que tengan drop shadow […] solo que
  en este caso sin la ilustración grande"). Cada valor está **copiado** de
  `.service-cases__card`, no re-derivado: borde `rgb(1 1 1 / 0.07)`, radio
  **1.5rem**, sombra de dos capas (`0 18px 48px / 0.07` + `0 2px 6px / 0.04`),
  padding `--space-6 / --space-7 / --space-5` por breakpoint, el mismo clamp de
  `h3` en cada banda, y el mismo hover (−5px, borde a `rgb(61 154 211 / 0.35)`,
  sombra más abierta). Medido a 900 / 1100 / 1440 / 1600: **las dos páginas dan
  idéntico** en radio, borde, fondo, sombra, padding, ancho de card (216 / 290 /
  326px) y tipografía. Son un diseño en dos archivos, no dos parecidos — si cambia
  uno, cambia el otro.
  - ⚠️ **Esto REVIERTE el "ruled, not carded" de §8.2 para este bloque.** Es
    decisión del cliente y tiene precedente: los Anwendungsfälle de
    `/werkschutz/` hicieron el mismo camino. No "restaurar" los filetes.
  - **4 en una fila desde 1100px**, el número de `.service-cases__grid` y por su
    razón (4 cards + 3 gaps necesitan el espacio; entre 900 y 1099 el 2x2 es mejor
    que cuatro columnas ilegibles). El 1200 anterior venía de las cards de
    `/jobs/`, que llevan FOTO — ahí el ancho de columna manda sobre el alto, que
    no es este caso. La única diferencia deliberada con werkschutz: acá el 2-up
    arranca a 640 y no a 900, porque sin ilustración la card mide la mitad.
  - ⚠️⚠️ **EL HOVER USA `translate`, NO `transform`, Y ESO ES OBLIGATORIO.** Estos
    items llevan `data-item-reveal`, y `js/item-reveal.js` anima `y` y `scale` con
    GSAP — que escribe un `transform` **inline**, y un estilo inline le gana a
    cualquier regla de hoja. Un `transform: translateY(-5px)` en el hover
    simplemente **nunca se aplicaría** una vez que corrió el reveal. `translate` es
    una propiedad aparte que se compone con `transform` (las propiedades
    individuales se aplican antes), así que GSAP se queda con `transform` y el
    hover con `translate`.
    **Verificado en aislamiento, no razonado:** un elemento con
    `transform: matrix(1,0,0,1,0,24)` inline **y** `translate: 0 -5px` de hoja
    reporta las dos en el estilo computado y aterriza en `layout + 24 − 5`. Las dos
    se aplican; ninguna borra a la otra.
    Es el mismo problema que `page-service.css` resuelve componiendo desde
    `--card-y`/`--card-s`, pero ese camino necesita un script propio que escriba
    esas variables y esta página usa el primitivo genérico.
    **Por la misma razón NO se copió el offset alterno de 28px** de las cards
    pares del 2x2: es un `transform` en reposo, y ahí GSAP gana. En el 4-up
    werkschutz lo cancela igual.
  - No se copiaron tampoco: la ilustración grande (la excepción que pidió el
    cliente), el numeral 01–04 (esas cards son un `<ol>` de casos numerados; estas
    cuatro son razones, y numerarlas sería inventar un orden que el copy no tiene)
    ni el header centrado de esa sección.
- **Los 8 servicios van en DOS GRUPOS, no como 8 iguales** (cliente 2026-08-09,
  después de leer la sección a nivel UX). Los ocho no son ocho cosas
  equivalentes, y presentarlos como una lista plana escondía una distinción que
  los datos hacen sola:

  | | Cuáles | Destino | Cómo se muestra |
  |---|---|---|---|
  | Grupo 1 | Werkschutz · Objektschutz · Baustellenbewachung · Brandwache | su propia página `/…-<stadt>/` | **cards**, 4 en una fila |
  | Grupo 2 | Empfangsdienst · Veranstaltungsschutz · Kaufhausdetektei · Sicherheitstechnik | la página de servicio **genérica** | **filas**, bajo una etiqueta |

  Las razones, en orden: el grupo 1 carga el volumen local (brandwache <stadt>
  solo mide 20/mes contra los 10 del resto) y un clic mantiene al visitante en el
  camino de ciudad; y el grupo 2, como par igual, **prometía con su label una
  página local que no existe** — la misma clase de afirmación implícita que la
  regla UWG de §10.1 existe para evitar.
  - ⚠️ **EL SPLIT NO REORDENA NADA.** El draft ya los lista exactamente en ese
    orden (1–4 ciudad, 5–8 genéricos), así que esto sólo hace visible una
    agrupación que Chris ya había escrito. Verificado en el markup.
  - **Los 8 conservan su descripción**, y es la restricción que definió la forma
    (cliente: "no me gusta que los chips pierdan su descripción"). El grupo 2 son
    **filas y no chips** justamente para que sobrevivan ~760 caracteres de copy
    concreto y crawleable. Lo secundario lo marca la POSICIÓN y la superficie, no
    una reducción de información.
  - Lo único de texto nuevo son las dos palabras de la etiqueta del grupo 2
    ("Ebenfalls verfügbar"), de la misma categoría que un eyebrow. **No es un
    `<h3>`**: etiqueta un set de links, no abre una subsección, y un tercer nivel
    de heading metería en el outline un escalón que el contenido no tiene.
  - ⚠️ **Las cards NO pueden ser idénticas a las de "Warum", y el motivo es
    estructural.** Esas viven en una `.section--light` y son paneles BLANCOS; esta
    sección es oscura. Un panel blanco acá es una plancha que encandila, y voltear
    la sección a clara no está disponible: dejaría tres secciones claras seguidas y
    cascadearía hasta Kosten, cuya caja de precio está construida como panel
    oscuro DENTRO de una sección clara. Así que es el **gemelo oscuro**: mismo
    radio de 1.5rem, mismo padding en cada breakpoint, misma escala de tipografía,
    mismo lift de 5px, mismo borde que se calienta a azul. **Medido a 320 → 1600:
    radio, padding y tamaño de nombre dan idénticos a la card de Warum en todos.**
  - ⚠️ **En una superficie oscura la sombra casi no trabaja**, así que lo que le da
    borde a la card es una **diferencia de relleno** (blanco al 4,5 %) más una
    hairline un punto más clara; la sombra queda sólo como capa de contacto. Es la
    misma conclusión a la que llegaron las risk cards de `/werkschutz/` sobre su
    banda navy.
  - El hover usa **`translate`**, por la misma razón medida que las cards de
    "Warum" (GSAP escribe `transform` inline vía `item-reveal.js`). La rotación de
    la flecha sí puede ser `transform`: GSAP nunca toca la flecha, sólo la card.
- ⚠️ **El hover de las filas es un lavado, no el relleno negro** de
  `.service-related__link`. Esta sección es oscura, y rellenar
  `--color-logo-black` sobre negro es una fila que no hace nada al hover. Si
  alguna vez este bloque cae en una `.section--light`, hay que darle el relleno
  negro **y** pasar la etiqueta a blanco (la trampa que documenta
  `page-service.css` en `.section--light .service-related__link:hover`).
- ⚠️ **La lista de tarifas NO reusa `.service-price__factors`.** Ese bloque
  dibuja un `+` azul por fila, y un `+` delante de "Objektschutz · 26-32 €/Std."
  se lee como lista de extras. Pero **sí tiene que repetir el
  `grid-column: 1`** de la grilla compartida de Kosten, o cae en la segunda
  columna, debajo de la card de precio.
- ⚠️ **Contraste, medido y fallado la primera vez**: el paréntesis de la fila de
  tarifas estaba en `--color-gray` al 0.7 = **4,04:1**, abajo del 4,5:1 de texto
  normal. La escala, para no volver a elegirlo a ojo: 0.7 → 4,04 · **0.75 →
  4,60** (que es lo que da `--color-text-muted` en sección clara, o sea que
  apenas pasa) · 0.8 → 5,25 · 0.82 → 5,55.
- ⚠️ **El numeral de los Einsatzfelder NO usa `--color-accent`**: en
  `.section--light` ese token es blue-dark (3,71:1), y esto es texto chico. Va la
  mezcla profunda de §5, medida en **4,88:1**.
- ⚠️ **Áreas táctiles: `min-height`, no `padding-block`.** Los dos
  `.service-link` sueltos de la página miden 29px y 27px. Padear los dos con el
  mismo valor **quedó corto en los dos y por distinto margen** (43px y 41px),
  porque están a tamaños de tipografía distintos. `min-height: 44px` da 44
  siempre, y `.service-link` ya es `inline-flex; align-items: center`.
- ⚠️ **Los links dentro de una respuesta del FAQ son otra cosa.** El draft anota
  los 8 servicios de una respuesta como links; **no se renderizan así**. Ocho
  anchors en una frase miden 18px cada uno, y aplicar el arreglo de §7 ocho veces
  en un párrafo destroza el renglón — WCAG 2.5.8 tiene una excepción explícita
  para targets limitados por el line-height de una frase. Y sobre todo no
  aportan: los 8 ya son filas completas dos secciones arriba. Un link **solo** en
  una frase sí lleva el `padding-block` sobre `inline-block`.
- **El bloque de Brandwache va CENTRADO en una columna, no en dos** (cliente
  2026-08-10: "está muy fea y desbalanceada… tiene que ser clean y balanceada").
  Era un 50/50 — H2 + respuesta a la izquierda, un panel con filete arriba, los 3
  hechos y el link a la derecha, corrido 48px hacia abajo. **Por qué se veía
  roto, medido a 1440 antes de tocarlo:** la columna izquierda medía **367px** y
  la derecha **253px** (114 menos) y además arrancaba 48px más abajo, así que
  terminaba 66px más arriba y dejaba un hueco en el cuadrante inferior derecho;
  el H2 se iba a **3 líneas / 224px** y dominaba; el filete del panel no tenía
  nada a la izquierda con qué alinearse; y de los 3 hechos el primero envolvía a
  dos líneas y los otros a una, o sea una lista despareja 2+1+1.
  La solución es **simetría, no mejores offsets**: header centrado, los 3 hechos
  como fila de 3 debajo, y una fila de acciones centrada. Nada puede quedar
  desbalanceado porque nada está al lado de nada.
  - **No es un patrón nuevo en la página**: el header de Vertrauen y el FAQ ya
    están centrados, así que es la tercera instancia de una decisión ya tomada.
  - `.city-callout__panel` **se borró**, markup y CSS, no quedó como regla muerta.
  - Los 3 hechos son **3 columnas desde 768px** (50–60 caracteres cada uno = una
    línea por columna) y apilados abajo, donde 3 columnas darían ~110px.
  - Cada hecho queda **alineado a la izquierda dentro de su columna**; lo que se
    centra es la fila. Centrar tres frases de largos distintos les saca el borde
    izquierdo común, que es la misma decisión que toma §8.2 para el contenido de
    los paneles de comparación.
  - ⚠️ **En teléfono NO va centrado.** El centrado equilibra dos columnas de
    espacio en desktop; en 350px un H2 de 3 líneas centrado sobre un párrafo de
    8 centrado se lee peor que el mismo copy alineado a la izquierda, y pierde el
    borde que comparte el resto de la página. Misma decisión que tomó `/jobs/`
    con su sección de pasos centrada.
  - ⚠️ **El párrafo necesita DOS clases** (`.city-callout .city-callout__intro > p`):
    el chasis pone `.section__intro > p { max-width: 42rem }` a (0,1,1), así que
    una regla de una sola clase sólo empata y dejaría el párrafo en una caja de
    672px pegada a la izquierda — título centrado sobre párrafo alineado a la
    izquierda. Es la misma trampa de §6 y el mismo arreglo que el header de
    Vertrauen.
  - ⚠️ **SEGUNDA PASADA, el mismo día — la fila de 3 duró unas horas.** Un brief
    detallado la reemplazó por **tres módulos apilados**, y agregó eyebrow,
    heading más chico y el teléfono como acción primaria. Lo que sigue vigente de
    arriba: el centrado, el borrado de `.city-callout__panel`, y que el copy no se
    toca. Lo que cambió está abajo.

  **Composición final (brief 2026-08-10):** eyebrow → heading → lede → 3 módulos
  apilados → fila de CTA, todo centrado y con anchos controlados.
  - **Eyebrow** (`.section-eyebrow`, compartido): el componente ya trae el
    cuadradito azul de 6px que pedía el brief, así que no necesitó estilo nuevo —
    sólo `justify-content: center` (es flex, el `text-align` del padre no lo mueve).
    ⚠️ **No es copy del draft**: es mobiliario de UI, la misma categoría que los
    eyebrows que se sacaron de `/werkschutz/`, y repite las palabras del propio H2.
  - **Heading a 52px**, no a los 60 del clamp compartido. **52 no es un número
    nuevo: es el clamp del H1 de hero del propio sitio** (§2, primera fila).
    ⚠️ **Las cifras del brief se contradicen con su instrucción y NO se siguieron**:
    pedía "64–78px", que es MÁS grande que lo que ya renderizaba (60px a 1440) y
    más grande que cualquier cosa del sitio, mientras la frase de arriba pedía
    reducir. Ganó la instrucción.
    ⚠️ **Es la QUINTA excepción declarada a §2** (Vorteile 48 · Leistungsumfang 40 ·
    case studies 34 · city-nearby 28 · ésta 52). Y ahora se ve un **patrón** que
    vale más que la sexta excepción: **todas son headings CENTRADOS o que comparten
    pantalla con el contenido de su propia sección.** §2 podría decir eso una vez
    en vez de listar cinco casos.
  - **Módulos**: paneles horizontales de 697px × 88px, radio `--radius-lg`, gap
    16px, con contenedor circular de 44px azul al 12 % y el icono a 22px.
    ⚠️ **La superficie es la MISMA de `.city-services__card`** (blanco al 4,5 % +
    hairline al 9 %), copiada a propósito: una tercera superficie oscura distinta en
    la misma página se leería como tres materiales.
    ⚠️ **El radio es 16px y no los 18–22 del brief**: nada del scale de tokens cae
    ahí, y el sitio ya carga **un solo** radio fuera de escala (los 24px). 16 está en
    escala, a un paso del rango pedido, y mantiene ese contador en uno.
  - **Iconos**: `#icon-clock` y `#icon-badge` ya existían y mapean exacto. El
    tercero no tenía glifo, así que se **agregó `#icon-document-check` al sprite**
    (página con esquina doblada + check) — `#icon-shield-check` era el más cercano y
    un escudo se lee como protección, no como papeleo. Al sprite, nunca inline.
  - **El teléfono es `.btn--primary`** (brief). ⚠️ Eso **revierte** la decisión de
    unas horas antes, cuando se puso `--secondary` para mantener la página en los
    dos primarios azules de §8.2. La página tiene **tres** ahora — nunca dos en la
    misma pantalla, que es lo que esa regla realmente gobierna.
  - **Ritmo vertical, medido**: 16 / 32 / 64 / 48px entre bloques (el brief pedía
    20 / 30–36 / 55–70 / 40–48).
    ⚠️ **Y acá hubo un bug medido que vale saber**: con un `gap` en el grid del
    layout, **cada hueco era la suma de TRES espaciados** — el gap, el `margin-top`
    del bloque, y el `margin-bottom: var(--space-8)` que `.section__intro` trae de
    `components.css`. Medido: 192px donde el brief pedía 55–70, y 112 donde pedía
    40–48. La solución es `gap: 0` + márgenes explícitos + anular el
    `margin-bottom` del intro: **una sola fuente de espaciado por hueco.**
  - ⚠️ **El lede necesita clase propia (`.city-callout__lede`), y no tenerla fue un
    bug medido**: la regla era `.city-callout__intro > p`, y **el eyebrow también es
    un `<p>` hijo directo de ese intro** — así que heredaba el `font-size` del lede
    y renderizaba a **20px en mayúsculas** en vez de sus 12px, más el color y el
    margen del lede.
  - ⚠️ **El eyebrow necesita `max-width: fit-content` + `margin-inline: auto`**, y
    también salió de medir: al ser un `<p>` del intro, el chasis le da
    `max-width: 42rem`; una caja de 672px sin márgenes automáticos se pega a la
    izquierda, y `justify-content: center` centra la etiqueta dentro de ESA caja.
    Se iba **−92px a 1024, −274 a 1440 y −345 a 1600** mientras el H2 de abajo
    estaba en el eje exacto.
  - **En teléfono queda CENTRADO** (brief), lo que revierte el "no centrado en
    teléfono" de la pasada anterior — y ahora cierra, porque el heading pasó de
    35px a 30px a 390 y el wrap centrado es una forma más corta.
  - **Costo honesto, y es el único punto del brief que NO se cumple:** el brief pide
    "reduce the total height" y la sección **creció**. A 1440: 824px (original) →
    1021 (fila de 3) → **1221px** (módulos apilados). Es aritmética, no descuido:
    tres módulos de 88px con 16 de gap son **296px** contra los 96 de una fila de 3.
    Las dos peticiones del brief — apilar los módulos y bajar la altura — no son
    simultáneamente satisfacibles. La palanca, si la altura importa más, es volver
    a la fila de 3 (está en git) o bajar los módulos a ~64px.
  - **EL TELÉFONO ES NUEVO ACÁ, y es la mitad estratégica del rediseño.** Es la
    ÚNICA sección de la página sobre una emergencia — un BMA-Ausfall es un
    problema de hoy — y su propio copy aprobado termina en "Die Einsatzleitung ist
    rund um die Uhr erreichbar", una promesa sin forma de accionarla. La acción
    primaria de la página es el formulario, que es un proceso de un día hábil y la
    acción EQUIVOCADA para alguien con la central de incendios caída ahora.
    No es inventado: el propio FAQ de esta página ya publica el número para este
    caso exacto, y `/brandwache-nuernberg/` hace de "Jetzt anrufen" la acción
    **primaria** de su hero. Se reusa el mismo wording para que las dos se lean
    como un solo camino.
    ⚠️ Pero acá va **secundario**, con `.btn--secondary` (el outline compartido,
    token-driven, ya correcto sobre oscuro): en esa página Brandwache es todo el
    propósito, en ésta es una sección de once, y §8.2 mantiene la página en dos
    primarios azules (hero y caja de precio).
  - ⚠️ **`white-space: normal` en el botón de teléfono es obligatorio en teléfono**,
    y omitirlo costó **13px de scroll horizontal real a 320px** (medido). `.btn` es
    `white-space: nowrap`, así que "Jetzt anrufen: +49 951 964352-0" más el ícono y
    el padding fija un min-content más ancho que los 280px disponibles — y
    `width: 100%` no puede encoger una caja cuyo contenido no envuelve. Misma
    trampa que ya documenta el CTA de la caja de precios.
- **El header de Vertrauen va CENTRADO** (cliente 2026-08-09: "hacemelo
  centrado"): H2 y lede sobre el eje del container. Es el mismo tratamiento que
  ya tienen el FAQ de esta página y de `/werkschutz/`, y `.ref-intro--center` en
  `/referenzen/`. El resto de la sección no se toca: **el contenido de las cards
  queda a la izquierda** (centrar una cita de cuatro líneas le saca el borde
  izquierdo por el que baja el ojo) y el bloque de certificaciones ya se centra
  solo, así que la sección entera se lee centrada con dos reglas.
  ⚠️ **`margin-inline: auto` en el lede NO es opcional**, y es la misma trampa de
  §6: el chasis pone `.section__intro > p { max-width: 42rem }`, así que
  `text-align: center` solo centra el TEXTO dentro de una caja de 672px que sigue
  pegada al borde izquierdo — se lee como título centrado con párrafo alineado a
  la izquierda. Al H2 se le da además `max-width: 36ch` para que una línea de
  60px centrada rompa en un lugar razonable en vez de cruzar los 1234px del
  container; en `ch` y no en px, porque tiene que servir para las otras nueve
  ciudades (es la misma frase con otro nombre de ciudad).
  **Verificado midiendo con un `Range` sobre los nodos de texto reales, no con el
  rect del elemento** (que miente, justamente porque la caja del párrafo está
  capada a 42rem): H2 y lede a **0px del eje** del container a 390 / 768 / 1024 /
  1440 / 1600.
- ⚠️ **CASI TODOS LOS HEADERS DE ESTA PÁGINA VAN CENTRADOS, y conviene tratarlo
  como el default de una página de ciudad en vez de como seis pedidos suelto.** El
  cliente los fue pidiendo de a uno a lo largo del 2026-08-09/10 — Vertrauen,
  Brandwache, Erreichbarkeit, Umgebung, **Warum** y **Leistungen** — más el FAQ
  (que ya lo centra el chasis) y el formulario (que lo centra `lead-form.css`).
  **Quedan dos rangeados a la izquierda**: el strip de Einsatzfelder, y Kosten,
  cuyo intro vive en la columna izquierda de un grid de dos columnas y no se puede
  centrar sin romper esa maqueta. Empezar la próxima ciudad con los headers
  centrados ahorra seis idas y vueltas.
  ⚠️⚠️ **LA MISMA TRAMPA DE ESPECIFICIDAD APARECIÓ CINCO VECES EN UNA SOLA PÁGINA**,
  así que la regla general está acá y no repetida por bloque: cuando un
  `.section__intro` lleva H2 **y** párrafo, `text-align: center` NO alcanza — el
  chasis pone `.section__intro > p { max-width: 42rem }` a **(0,1,1)**, así que una
  regla de una sola clase empata y pierde por orden, y el párrafo se queda centrado
  DENTRO de una caja de 672px todavía pegada al borde izquierdo. Se lee como título
  centrado con párrafo a la izquierda, que es peor que no centrar nada. Hacen falta
  las dos cosas: **selector de dos clases** (`.city-why .section__intro > p`, que es
  (0,2,1)) y **`margin-inline: auto`** — el `text-align` centra el texto, los
  márgenes automáticos centran la caja.
  🔧 Seis reglas casi idénticas en `page-city.css` quieren ser **un modificador
  `.city-centred`** sobre el intro cuando se construya la segunda ciudad; hoy no se
  consolidaron porque cuatro de ellas cargan sus propios `max-width` medidos.
  **Una sola sección centra además su CONTENIDO: Erreichbarkeit** (la tira de tres
  hechos con icono). Se centra bien porque son frases de una línea; las demás llevan
  citas o bloques de varias líneas, que necesitan un borde izquierdo al que el ojo
  vuelva. Centrar el contenido de una tira así son **cuatro cosas, y una es un
  borrado**: `text-align` en el item, `justify-self: center` en el icono (un grid item
  ignora el `text-align` del padre, y un `<svg>` con ancho definido también),
  `margin-inline: auto` en el párrafo de cierre capado — y hay que **BORRAR** el
  `padding-left: 0` que la primera columna tenga para alinearse con el borde de
  contenido: un padding asimétrico corre la caja, así que su contenido cae ~16px
  fuera del centro de su propia columna mientras las otras caen en el suyo. Tres
  columnas centradas comparten un padding, y a cambio la primera deja de arrancar en
  el borde de §1 — con texto centrado el ancla es el centro de la columna.
  Y `text-wrap: balance` en las frases: un texto centrado tiene dos bordes
  irregulares, así que un corte desparejo se ve dos veces (medido: [3,4,3] → [3,3,2]
  líneas a 1024).
- **Las certificaciones son SU PROPIA SECCIÓN BLANCA** (cliente 2026-08-10: "una
  sección blanca literal — la transición de píxeles a sección blanca y después a la
  negra de abajo, como pasa en toda la web"). El bloque de DEKRA salió de la sección
  de Vertrauen a una sección propia con **un pixel seam de cada lado**, igual que
  cualquier otro cambio de color de la página. Los dos testimonios se quedan atrás,
  sobre el negro, con su H2. Los seams pasaron de **9 a 11**.
  ⚠️ **Un primer intento lo hizo una CARD BLANCA dentro de la sección oscura, y
  estaba mal** — no por cómo se veía, sino porque era un cambio de color **sin
  seam**, que es lo único sobre lo que está construido el ritmo de esta página
  ([§4.4](#44-pixel-seam-antes-del-footer--obligatorio)). Además la card necesitaba
  su propio flip de tokens y un arreglo de contraste para el link. Como
  `.section--light` de verdad **no necesita ninguna de las dos cosas**: esa clase ya
  re-declara todos los tokens que `.trust-certs` consume, y `page-service.css` ya le
  da a `.service-link` dentro de una sección clara el azul profundo de 4,88:1. Lo
  único que quedó en `page-city.css` son cuatro líneas que sacan el margen, el
  padding y la hairline superiores — existían para separarlo de los testimonios
  cuando compartían sección, y en una sección propia eso lo hace el padding de
  `.section`.
  **Medido dentro de la sección blanca**: nombre del estándar 20,87:1, descripciones
  y línea de referencias 4,60:1, link 4,90:1. Los 12 seams construyen sus 180 tiles.
  ⚠️ La sección **no lleva H2 propio**, a propósito: el H2 de Vertrauen dos bloques
  arriba es el encabezado de este contenido, y repetirlo sería decirlo dos veces.
  ⚠️ **El par oscuro 7+8 dejó de existir**: Vertrauen y Erreichbarkeit ya no son
  adyacentes, así que ese borde ahora es un cambio de color real y lleva tiles
  `--white`. Si las certificaciones vuelven arriba, ese seam se va con ellas.
- **El tile del Wachbuch usa `#icon-route`, no `#icon-badge`** (cliente 2026-08-10).
  ⚠️ `#icon-badge` **no se redibujó, porque no está mal**: es una medalla, y dos
  secciones más arriba significa "Kräfte mit § 34a GewO und
  Brandschutzhelfer-Qualifikation", que es exactamente para lo que sirve una medalla.
  Estaba mal sólo en el tile del Wachbuch. Y tampoco es `#icon-document-check`, que es
  la metáfora de papel obvia: ese símbolo YA está en esta página una sección arriba
  ("Dokumentation für Behörde und Versicherung"), y dos hojas-con-check en una página
  se leen como repetición. Una ruta con checkpoints es el único glifo del set que
  carga el "je RUNDE".
- **El H2 de Umgebung es chico, y es la CUARTA excepción declarada a §2.** El
  draft lo pide con esas palabras ("H2 (klein)") y la sección es un pie de
  navegación pegado al H2 de conversión. **La próxima excepción tiene que
  replantear §2, no sumarse a la lista.**
- Una vecina que el draft nombra **sin página propia** (Schwabach) va como
  mención sin link, con el borde punteado y **sin flecha**, así que "esta va a
  algún lado" nunca lo dice solo el color. Es lo mismo que hizo el homepage con
  Hof y Kronach.

### 10.5 Para armar la siguiente ciudad

Copiar `pages/sicherheitsdienst-nuernberg.html` y cambiar: meta y JSON-LD
(incluido `areaServed`), todo el copy del draft de esa ciudad, el `<path>` del
contorno (`python3 docs/design-sources/city-outline.py <slug>`), las vecinas de
la sección 10, el `note` de la Preis-Box, y el `prefix` del formulario (único por
página). **`css/page-city.css` no se toca** — si el copy no entra, son más `<li>`.

---

## 11. Página combo: servicio × ciudad

Referencia: `pages/brandwache-nuernberg.html` + `css/page-combo.css`
(2026-08-09). Son **16 páginas** — 4 servicios (Brandwache · Objektschutz ·
Werkschutz · Baustellenbewachung) × 4 ciudades (Nürnberg · Würzburg · Erlangen ·
Fürth). [build-checklist.md](build-checklist.md) las llama "puro ensamblado" y
tiene razón: **`css/page-combo.css` son cuatro reglas**.

### 11.1 Tres capas de CSS, y la del medio es la de ciudad

```
css/page-service.css   el CHASIS (§9.1): inset, `main h2`, breadcrumb, seams,
                       .section--light, .service-hero*, .service-konzept* (los
                       3 pasos del Ablauf), todo el bloque de Kosten,
                       .service-related*, .service-link
css/page-city.css      la capa GEO: el badge de Einsatzgebiet, la grilla del
                       hero a dos columnas, el contorno de la ciudad, la columna
                       de tics, los bloques numerados (.city-fields*), las cards
                       de Warum (.city-why*), las filas de servicio y el ritmo de
                       teléfono de `body.page-city`
css/page-combo.css     lo poco que agrega este tipo de página
```

⚠️ **El `<body>` lleva `class="page-city page-combo"`, y `page-city` no es una
etiqueta**: el bloque de teléfono de `page-city.css` (banda de seam de 80px con
sus reservas, padding de sección reducido, CTAs del hero a todo el ancho) está
scopeado ahí y esta página lo quiere entero.

⚠️ **Y significa que un cambio en `page-city.css` cae en 26 páginas, no en 10.**
Es deliberado — el badge, las cards de Warum y las filas tienen que ser UN diseño
en los dos tipos de página, no dos parecidos — pero hay que medir los dos tipos
después de tocarla.

### 11.2 Las 8 secciones y el ritmo de color

| # | Sección | De dónde |
|---|---|---|
| 1 | Hero (H1 · subline · 3 tics · **teléfono como CTA primario**, sin badge) | `.service-hero.city-hero` + `.combo-hero` |
| 2 | Einsatzlagen / Objekt-Typen / Bauphasen (N bloques) | `.city-fields*` |
| 3 | Ablauf kompakt (3 pasos) | `.service-konzept*` del chasis + `js/steps-sequence.js` |
| 4 | Warum FRANKONIA (3 cards) | `.city-why*` + `.combo-why` |
| 5 | Kosten | el bloque del chasis + `include: price-box`, **invertido** (`.combo-price`) |
| 6 | FAQ (6 preguntas) | `.faq__list--cards` compartido |
| 7 | Abschluss-CTA | `partials/lead-form.html` |
| 8 | Weiterführend | `.service-related*` del chasis + `.combo-related` |

Colores: hero ▪ · Einsatzlagen ▫ · Ablauf ▪ · Warum ▫ · **Kosten ▪** · FAQ ▫ ·
Formular ▪ · Weiterführend ▫ → footer. **Alterna hasta abajo, 8 seams**, y el tile
siempre lleva el color de la sección de ARRIBA (sin modificador = tiles negros en
un borde oscuro → claro, `.pixel-seam--white` en uno claro → oscuro).

⚠️ **Alterna SÓLO porque la card de Kosten es blanca (cliente 2026-08-10:
"el fondo negro y la card blanca o platinum, sólo en esta sección"), y conviene
saberlo antes de revertirlo.** La card del chasis es negra brillosa, o sea obliga a
que su sección sea clara; `.service-konzept*` (los 3 pasos) tiene el texto blanco
escrito a mano y sólo funciona en oscuro; los paneles de `.city-why*` son cards
blancas y sólo funcionan en claro. Con el hero y el formulario fijos en oscuro,
esas tres restricciones juntas dejaban a **Warum + Kosten + FAQ como un único
capítulo claro de tres secciones sin ningún cambio de color adentro** — y la única
salida era inventar una segunda versión de alguno de los tres bloques. Invertir
esta sección es lo que la evitó. **Si vuelve la card negra, vuelve ese bloque de
tres y hay que borrar los dos seams que rodean a Kosten.**

**La card blanca no es una superficie nueva**: es la misma relación que el
formulario dos secciones más abajo (card blanca sobre la sección negra), así que
`.combo-price` toma los valores de `.conversion__form-wrap` — mismo hairline, mismo
`--radius-lg`, misma `--shadow-lg`. Dos cards blancas en una página tienen que ser
una decisión, no dos parecidas. Lo que sí hay que reescribir son los colores de
adentro, y **los alfas NO son los de la card negra espejados**: su label está a 0.6
blanco sobre negro, y 0.6 de `--color-gray` sobre blanco mide ~3,2:1 y falla. El
piso en blanco es 0.75 (4,60:1); acá van a 0.8. Medido: label/unit/note **5,25:1**,
la cifra **20,87:1**, las filas de tics **9,24:1**.
⚠️ Y el tick azul va con la mezcla profunda de §5, **no** `--color-accent`: esta
sección ya no es `.section--light`, así que ese token resuelve a blue-light
(3,11:1 sobre blanco).

### 11.3 El hero de Notfall: el teléfono es el CTA primario

En `/brandwache-nuernberg/` el botón azul es el **teléfono** y el formulario es el
secundario (`.btn--secondary`, que components.css ya declara token-driven y
correcto sobre oscuro). **Es instrucción del draft, no criterio local** — y es
correcto para el único servicio al que se llega en medio de un incidente: un
formulario que promete oferta en un día hábil es la acción equivocada cuando el
Bauordnungsamt pide una Brandwache hoy. **Los otros tres combos de Nürnberg SÍ
lideran con el formulario**, y esa diferencia también está en sus drafts.

Dos cosas medidas alrededor de eso:

- ⚠️ **`#icon-phone` es el único símbolo RELLENO del sprite que no declara su
  propia pintura**, así que dentro de un botón azul sale como una mancha negra sin
  `fill: currentColor; stroke: none`. La regla de `.service-hero__phone .icon` no
  se puede reusar: trae además el tratamiento de píldora de contorno, que es justo
  lo que este botón no es.
- **La etiqueta del botón es EL NÚMERO SOLO, sin el "Jetzt anrufen:" del draft**
  (cliente 2026-08-10), y eso es también lo que pone los dos botones en una fila.
  Medido: con el prefijo el par pedía **662px** (313 + 325 + 24 de gap) contra los
  **634–640** de la columna de copy, o sea se apilaba en TODO el escritorio; sin él
  el primario baja a **211px** y el par entra con aire. La acción sigue siendo
  inequívoca: icono de teléfono, `href="tel:"`, relleno azul.
- ⚠️ **La banda 1024–1151 necesita su propia regla, y es aritmética.** `page-city.css`
  parte el hero en dos columnas a 1024px (1fr / 0.62fr), lo que deja la columna de
  copy en **506px** ahí — 54px cortos para el par. Darle menos share al contorno en
  esa banda (`0.42fr`) le compra ~570px. El contorno es decorativo y está
  dimensionado por ALTO (`width: auto` + `max-height`), así que una columna más
  angosta sólo le capa el ancho y no se pierde nada. Verificado en una fila a
  768 / 900 / 1024 / 1100 / 1151 / 1152 / 1280 / 1440 / 1600 / 1920; abajo de 768
  `page-city.css` los apila a todo el ancho a propósito.
- ⚠️ **Este hero NO lleva el badge de Einsatzgebiet** (cliente 2026-08-10), a
  diferencia del de la página de ciudad. **Ningún dato se perdió** — la
  Einsatzleitung 24/7 está en la FAQ 1, en el paso 03 del Ablauf y en el CTA de
  cierre — y el encuadre UWG no depende de él acá: el requisito de "kein
  Scheinstandort" es del draft de CIUDAD (Webtext 13), no del de esta combo
  (Webtext 34), y lo que lo sostiene sigue en su lugar (el `LocalBusiness` lleva el
  NAP real de Bamberg con `areaServed`, y la página no reclama oficina en la
  ciudad). **La página de ciudad conserva el suyo.**

### 11.4 Cosas medidas que la próxima combo no debería re-descubrir

- **`.city-why__grid` es `repeat(4, …)` desde 1100px** porque una página de ciudad
  tiene cuatro bloques de Warum; **todos los drafts de combo tienen TRES**. Sin el
  override la tercera card queda en una fila de cuatro con un cuarto vacío.
  A 1100px tres columnas dan una card de ~355px, entre las dos bandas de ese
  bloque, así que el padding y la tipografía compactados del 4-up se quedan — sólo
  cambian la cuenta y el gap.
- **La lista de pasos del chasis trae `margin-bottom: --space-8`** porque en
  `/werkschutz/` la siguen dos bloques dentro de la misma sección (la prueba del
  30 % y la fila de acciones). Acá no la sigue nada: son 64px de espacio muerto
  medidos, y hay que ponerla en 0.
- **El Ablauf NO lleva `data-steps-draw`.** Ese hook es para el line art inline de
  `/werkschutz/`, y estos tres pasos no tienen ilustración en el draft. Sin él el
  script hace lo documentado: aterriza el nodo y sube su copy. Lo que sí es
  obligatorio es `data-no-text-reveal` **y** la ausencia de `data-item-reveal`.
- **La sección de Kosten no lleva `.service-price__factors`**, y eso es seguir el
  copy: el draft mete los tres factores dentro de su propia frase, y partir una
  frase aprobada en bullets es reescribirla. La grilla coloca sus hijos por columna
  explícitamente, así que una lista ausente sólo deja su fila vacía.
  **Consecuencia: la columna de texto se centra verticalmente** (cliente
  2026-08-10). En una página de servicio la izquierda es título → respuesta →
  factores → Hinweis y alinear arriba es lo correcto; acá son dos párrafos contra
  una card de ~530px, y arriba se leía como texto caído al tope de una columna
  vacía. ⚠️ Hacen falta **las dos** declaraciones: `grid-row: 1 / -1` (el chasis
  pone el intro en la FILA 1 de una grilla de tres mientras la card las abarca las
  tres, así que centrar dentro de la fila 1 es un no-op) y `align-self: center`.
  Medido a 900 / 1024 / 1280 / 1440 / 1600: **0px** entre el centro del texto y el
  de la card. Sólo ≥900px; abajo la columna es una sola y el orden del DOM es el de
  lectura.
- **El Weiterführend corre como UNA lista a todo el ancho**, no como las dos
  columnas de `/werkschutz/`: dos links no hacen dos grupos, y en la grilla de dos
  columnas quedaba en la mitad izquierda debajo de un H2 a todo el ancho.
- ⚠️ **BUG DE CONTRASTE ENCONTRADO ACÁ Y ARREGLADO EN LA PÁGINA DE CIUDAD TAMBIÉN:**
  los links dentro de una respuesta del FAQ heredaban `--color-link` = blue-light,
  que sobre el relleno casi blanco de la card mide **2,87:1**. La regla
  `.city-faq .faq-item__answer a` (page-city.css) ahora fija la mezcla profunda de
  §5, **4,88:1**. ⚠️ `.section--light` no lo resuelve solo: re-declara
  `--color-accent`, no `--color-link`.
- **El texto de anclaje de un link que el draft escribe como URL suelta** (acá
  "→ /ratgeber/brandwache-wann-vorgeschrieben/") se escribe con el nombre de la
  página destino en sus propias palabras, y se marca como escrito para el build.
  Misma convención que usó la página de ciudad.
- **El contorno de la ciudad se reusa tal cual del `/sicherheitsdienst-<stadt>/`
  correspondiente** — mismo `<path>`, mismo `stroke-dasharray` medido. Para las
  otras tres ciudades: `python3 docs/design-sources/city-outline.py <slug>`.

### 11.5 La familia de iconos: un peso de línea, tres tamaños

Brief del cliente 2026-08-10 — tres secciones necesitaban anclas visuales
(Einsatzlagen y Ablauf no tenían ninguna, y los iconos de las cards de Warum eran
"too small and visually timid"), **con la condición de que las tres se lean como
UN sistema**: mismo peso de trazo, misma lógica de tamaño, mismo azul, sin volver
la página ilustrada.

**Sin librería nueva y con UN solo símbolo nuevo.** Todos los glifos menos
`#icon-radio` ya estaban en `partials/icon-sprite.html` — el sistema de iconos del
proyecto — y por eso pertenecen a una familia gratis: una grilla de 24x24, una
misma mano, `fill: none; stroke: currentColor` heredado de `<g id="icon-defs">`.

| Sección | Glifos |
|---|---|
| Einsatzlagen | `alert` · `flame` · `crowd` · `factory` — **y se dibujan con el scroll** |
| Ablauf | `phone` · `agree` · `guard` — **y el título se highlightea con el scroll** |
| Warum (cards) | `contact` · `badge` · `shield-check` |

**Un solo tamaño: 44px (2.75rem) con `stroke-width: 0.95`.** Subió 28 → 40 → 44 en
tres pasadas del cliente el mismo día; un tamaño es más fácil de sostener en las
otras quince páginas que los tiers con los que arrancó.

**Color: `--color-blue-light` — el celeste del CTA — y NO `--color-accent`**
(cliente 2026-08-10: "encargate que sea todo el mismo celeste, que es el celeste del
CTA"). ⚠️ Ese token es dependiente de la sección: dentro de una `.section--light`
resuelve a blue-DARK (#5287C9), que es lo que tenía a los iconos de Einsatzlagen y
de las cards en un segundo azul casi idéntico mientras todos los botones usaban el
del CTA. Un literal, un azul. Es seguro en las dos superficies porque **un icono es
un GRÁFICO**, o sea el mínimo aplicable es 3:1 y no 4,5: #3D9AD3 mide **3,11:1**
sobre blanco y 6,8:1 sobre el negro de esta página.

⚠️ **Los del Ablauf son BLANCOS**, y sólo ésos: es la única de las tres secciones
que está sobre el negro de la página, así que el blanco existe como opción — en las
otras dos los iconos van sobre cards blancas. No le cuesta color de marca a la
sección: el riel, sus tres nodos, los numerales y el highlight del título son todos
el celeste del CTA.

⚠️ **EL TRAZO SE FIJA POR TAMAÑO, y ése es el punto entero del bloque.** Un
`stroke-width` de SVG está en UNIDADES DE USUARIO, así que un símbolo dibujado a
1.5 sobre una grilla de 24 renderiza más grueso cuanto más grande se dibuja: 1,75px
a 28 y **2,5px a 40**. Sin corregirlo, tres secciones a tres tamaños dan tres
pesos de línea distintos — justo lo que el brief prohíbe. La fórmula:

```
stroke-width = 1.75 x 24 / <px renderizados>
```

**1,75px es el valor de la familia, y se midió dos veces:** 1,6px empataba en los
tres tamaños pero a 40px se leía *timid*, que es literalmente la palabra que el
brief usa para lo que las cards tenían que dejar de ser — un glifo más grande al
mismo peso absoluto se ve más liviano. 1,75 sigue cómodo abajo de 2px (donde una
línea empieza a leerse como marca rellena) y deja el tamaño de 28px en el 1.5
nativo del sprite. **Verificado: los 10 iconos renderizan a 1,75px efectivos
exactos.**

Tres decisiones de colocación que no son cosméticas:

- **Einsatzlagen: EL ICONO ES EL MARCADOR DEL ITEM** (cliente 2026-08-10: iconos
  más grandes y sin numeral). El item pasó de hairline → 01 → Titel → párrafo a
  hairline → icono → Titel → párrafo, así que el icono dejó de ser una marca al
  lado de un índice y pasó a ser el ancla — y por eso sube al tier de 40px. La
  grilla de dos columnas y los divisores no se tocan.
  ⚠️ **La lista pasó a `<ul>`**: era `<ol>` sólo porque existían esos numerales.
  Sin ellos, los cuatro son un CONJUNTO paralelo de situaciones, no una secuencia,
  y un `<ol>` le seguiría contando a la tecnología asistiva un orden que la página
  ya no muestra ni quiere decir.
- **Ablauf: el icono va DEBAJO del numeral.** El nodo del riel y su 01/02/03 son lo
  que hace que esto se lea como línea de tiempo; meter un glifo entre los dos la
  rompe. Y como es un hijo elemento más del step, `js/steps-sequence.js` ya lo trata
  como copy de ese paso y lo entra con su título y su frase — una sola llegada por
  paso, sin hook extra.
- **Ablauf: el icono va DEBAJO del numeral.** El nodo del riel y su 01/02/03 son lo
  que hace que esto se lea como línea de tiempo; meter un glifo entre los dos la
  rompe. Y como es un hijo elemento más del step, `js/steps-sequence.js` ya lo trata
  como copy de ese paso y lo entra con su título y su frase — una sola llegada por
  paso, sin hook extra. Desde el 2026-08-10 va con `margin-top` POSITIVO (antes era
  negativo, pegado al numeral): 24px de aire arriba, pedido del cliente.
- **Warum: sólo cambia el tratamiento, no los glifos** (el brief pide mejorar, no
  reemplazar): 28 → 40px, `margin-bottom` 24 → 32px y título→texto 12 → 16px. Sin
  círculo detrás, sin relleno. Scopeado a `.combo-why`, así que las diez páginas de
  ciudad conservan sus 28px.

#### Los títulos del Ablauf se HIGHLIGHTEAN con el scroll

Cliente 2026-08-10: "que los títulos sean highlighteados con fondo celeste mientras
escroleo, como hacemos en otras secciones". Es el mismo marcador que ya usan el
Vorteile de `/werkschutz/` y el pain hook del homepage — con la diferencia de que
acá lo maneja **el propio timeline de `js/steps-sequence.js`**, vía el hook nuevo
`data-steps-mark="<selector>"`, así el relleno barre como parte de la ÚNICA llegada
del paso en vez de ser un segundo efecto que aterriza cerca. Es opt-in igual que
`data-steps-draw`, así que `/werkschutz/` y `/jobs/` no se tocan (verificado: 0
marks en las dos).

⚠️ **El `<span>` no es decoración.** `.combo-steps__title` es un FLEX ITEM del step,
y un flex item se blockifica — `display: inline` en el h3 computa a `block` y el
marcador barrería toda la columna en vez de abrazar las palabras.

⚠️ **El relleno es el celeste del CTA, y EL TAMAÑO DEL TÍTULO ES LO QUE LO HACE
LEGAL.** El texto tiene que quedarse BLANCO, porque a mitad del barrido la mitad
todavía está sobre el negro de la sección — pasarlo a oscuro (lo que sí hace el
Leistungsumfang de `/werkschutz/` sobre su sección clara) lo volvería invisible
durante todo el barrido. Y blanco sobre #3D9AD3 mide **3,11:1**, que falla el 4,5:1
de texto normal. Por eso el título pasó a un **1.5rem (24px) fijo**: ése es el
umbral de "texto grande" de WCAG a cualquier peso, donde el mínimo aplicable es 3:1
y el 3,11 pasa. Es la salida barata documentada para exactamente este caso
([§3](#3-componentes-fijos)), usada en vez de pisar el color que pidió el cliente, y
la misma jugada que ya hace `.service-related__title`.
⚠️ **O sea el tamaño es load-bearing: no devolverlo a `--font-size-md`** (un clamp
de 18→20px) sin cambiar también el relleno. Abajo de 24px esto pasa a ser una falla
de contraste real — y a 20px lo era, que es por qué este relleno fue primero la
mezcla profunda `color-mix(blue-dark 85%, black)` (4,80:1).

⚠️ **El fallback es 1, no 0**: `calc(var(--mark, 1) * 100%)` es lo que reciben sin
JS, un crawler y `prefers-reduced-motion` — el highlight terminado. Un
`var(--mark, 0)` es exactamente el bug que `.service-contrast__mark` publicó una
vez: medido en 0 % con reduced motion forzado, o sea los highlights desaparecían.
GSAP escribe el estado inicial 0 en runtime y sólo para un paso que está por barrer.
**Verificado con reduced motion y sin JS: los tres marcadores a `100% 100%` y
`--mark` sin setear.**

⚠️ **Los glifos de los pasos 02 y 03 se reemplazaron el 2026-08-10** (cliente: "no
me gustan, mejoralos"), y en ninguno de los dos el problema era color ni tamaño:
**no se LEÍAN**.
- `#icon-plan` (una hoja de plano con barra lateral) salía como una caja recargada,
  y **es compartido con `/leistungen/`**, así que esta página tomó un glifo propio en
  vez de redibujar aquél: **`#icon-agree`**, un globo de diálogo con un check, o sea
  una conversación que RESOLVIÓ algo — que es lo que significa abstimmen. Se eligió
  sobre un portapapeles con check, que es la alternativa obvia: un portapapeles dice
  "checklist", y este paso no es una lista sino un acuerdo con un tercero.
- `#icon-radio` renderizaba como una tarjeta con renglones, no como una radio. Se
  probaron cuatro variantes más (cuerpo más angosto, rejilla vertical, perilla de
  canal, micrófono de pie) y la mejor **seguía necesitando un segundo para
  decodificarse** — que es exactamente la falla que esta pasada de iconos vino a
  arreglar. El paso 03 es **`#icon-guard`**: una persona dentro del escudo, o sea el
  puesto CUBIERTO, que es toda la afirmación de ese paso.
  ⚠️ El contorno del escudo es **el de `#icon-shield-check`, copiado exacto** y no
  redibujado: los dos aparecen en esta página a dos secciones de distancia, así que
  tienen que leerse como UN escudo con dos cosas distintas adentro (una persona acá,
  un check allá) y no como dos escudos parecidos.

El color es `--color-accent` en los tres casos y resuelve por sección: blue-dark en
`.section--light` (3,71:1 sobre blanco) y blue-light sobre el Ablauf oscuro
(6,8:1). Un icono es un gráfico, así que el mínimo aplicable es 3:1.

#### Los iconos de Einsatzlagen se DIBUJAN con el scroll

Cliente 2026-08-10: "quiero que se formen cuando escrolee, o sea que la línea se
vaya trazando, como en otras ilustraciones". Es **el mismo primitivo**,
`js/svg-draw.js` — el de la ilustración de riesgo de `/werkschutz/` — no una
segunda implementación.

⚠️ **Un `<use>` NO SE PUEDE DIBUJAR, y ése es el único trabajo real que hubo acá.**
Un icono escrito como `<svg><use href="#icon-flame"></svg>` renderiza el símbolo del
sprite a través de un shadow tree que el documento **no puede alcanzar**:
`querySelectorAll` no encuentra ningún path, así que no hay nada que medir ni
dashear. La solución mantiene el sprite como **única fuente de la geometría** en vez
de pegarla una segunda vez en la página: el script **clona los hijos del símbolo y
descarta el `<use>`, en runtime**, dentro de la función que ya había salido temprano
con reduced motion, sin JS o sin GSAP. En cualquiera de esos casos el markup
conserva su `<use>` y el icono renderiza como siempre.
Dos detalles que hacen falta:

- **el `viewBox` tiene que viajar también.** Un `<use>` toma su sistema de
  coordenadas del símbolo; un `<svg>` pelado no tiene uno, así que la geometría de
  24 unidades renderizaría a 24px en la esquina de una caja de 40;
- **el filtro de trazos pasó a mirar el valor COMPUTADO** además del atributo. Una
  ilustración provista trae `stroke="…"` en cada path, pero un símbolo del sprite no
  trae ninguno: la pintura del sprite entero vive en su `<g id="icon-defs">` y el
  call site la restatea por CSS. Leer sólo el atributo encontraba cero trazos en un
  símbolo clonado. **Los rellenos siguen excluidos igual**, porque el default de SVG
  es `stroke: none` — que es justo lo que mantiene pintando desde el primer frame la
  oclusión de línea oculta de la card 03 de `/werkschutz/` (re-verificado: 72 trazos
  sin dibujar → 0, y sus 5 rellenos intactos).

Rango `top 84%` → `top 44%`, por icono. **Medido bajando la sección:** 15/15 sin
dibujar antes de entrar → 13 → 9 → **0**, y el último termina con el item a 109px
del borde superior, o sea entero a la vista.

#### Lo único de la página que NO es el celeste del CTA

**Cuatro `<a>` a `#4673AB`**: los tres links dentro de respuestas del FAQ y el de la
Datenschutzerklärung del formulario. Son **texto de cuerpo de 15–16px sobre una
superficie casi blanca**, donde #3D9AD3 mide **2,87:1** contra el piso de 4,5:1 — no
hay umbral que los salve (no se puede poner un link dentro de una frase a 24px), así
que ahí queda la mezcla profunda a 4,80:1. Todo el resto de la página —botones,
iconos, tics del hero, tics de la caja de precio, numerales, riel, nodos, flechas,
highlights y el teléfono del cierre— **es #3D9AD3, verificado computando el color de
cada elemento de `<main>`**.

### 11.6 Para armar la siguiente combo

Copiar `pages/brandwache-nuernberg.html` y cambiar: meta y JSON-LD (incluido
`areaServed`, el `Service` y el `FAQPage`), todo el copy del draft de esa
combinación, el contorno si cambia la ciudad, el `note` de la Preis-Box, los links
de Weiterführend y el `prefix` del formulario (único por página). **`page-combo.css`
no se toca** — si el copy no entra, son más `<li>`. Ojo con dos cosas: las otras
tres varían su sección 2 a propósito (Objekt-Typen / Industrie-Fokus / Bauphasen,
todas "N bloques de título + párrafo", o sea el mismo `.city-fields*`), y **su hero
lidera con el formulario**, no con el teléfono.

---

## 12. Checklist de página nueva

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
