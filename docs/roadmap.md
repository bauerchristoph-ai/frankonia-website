# FRANKONIA — Roadmap: todo lo que queda después de la homepage

**Fecha:** 2026-07-31 · **Reescrito** tras aparecer `content-de/` (49 drafts) y el
*Section Component Catalog* del cliente (2026-07-29).

**Corrección respecto de la versión anterior de este documento:** decía que solo
existía el copy de la homepage. **Era falso.** Los 49 textos están en
`content-de/`; la búsqueda anterior filtró solo `.md/.html/.txt` y no vio los
`.docx`. El contenido **no es el bloqueo**.

---

## Estado real

| | |
|---|---|
| Páginas planeadas | **49** (no 40 — el alcance creció) |
| Secciones totales | **~345** (el catálogo dice 359) |
| Construidas | **3** (`/`, `/werkschutz/`, `/kontakt/`) + `/en/` |
| Copy disponible | **49 / 49** ✅ en `content-de/` |
| Copy con Title + Meta + H1 | **49 / 49** ✅ |
| Drafts que declaran su estructura (`Aufbau:`) | 23 / 49 |

### 🔴 Riesgo inmediato
`content-de/` tiene **0 archivos trackeados en git**. El activo más valioso del
proyecto no está versionado. Commitear antes que nada.

---

## Alcance según los drafts (difiere de las guidelines §2.2)

| Grupo | N | Detalle |
|---|---|---|
| Homepage | 1 | ✅ construida |
| Servicios | **11** | los 10 conocidos **+ `/sicherheitskonzept/`** (página nueva, no está en §2.2) |
| Ciudades | 10 | Nürnberg, Würzburg, Bamberg, Erlangen, Fürth, Bayreuth, Schweinfurt, Coburg, **Forchheim**, Ansbach |
| Combos servicio × ciudad | **16** | 4 servicios × 4 ciudades (§2.2 decía 3) |
| Hubs | 3 | Leistungen, Einsatzgebiete, Ratgeber |
| Ratgeber artículos | 3 | 34a, Kosten, Brandwache (§8 decía 6) |
| Otras | 5 | Kontakt ✅, Angebot-LP, Referenzen, Über uns, Jobs |

### 🔴 Discrepancia a resolver
Los drafts traen **Forchheim**; la homepage y el footer enlazan **Hof**.
Uno de los dos está mal. Hay que decidir antes de generar las páginas de ciudad.

---

## Catálogo de componentes — construido vs. faltante

| | Componente | Usos | Estado en el repo |
|---|---|---|---|
| K1 | Hero | 43 | ⚠️ **dos implementaciones rivales**: `.hero` (home) y `.service-hero` (werkschutz) → unificar en 1 con 3 variantes (estándar / emergencia / compacta) |
| K2 | Text section | ~75 | ⚠️ parcial: `.service-intro`, `.konzept__grid` |
| K3 | Card grid | ~90 | ⚠️ **5 one-offs**: `.pillar-card`, `.service-scope`, `.service-pillars`, `.services__list`, cards de system-story → unificar en 1 con 3 variantes |
| K4 | Checklist | ~15 | ⚠️ one-offs: `.pain-hook`, `.service-problems` |
| K5 | **Kosten / Pricing** | **27** | ❌ **no existe** |
| K6 | FAQ accordion | ~36 | ✅ ya compartido en `components.css` |
| K7 | Results + testimonios | ~6 | ✅ construido, encerrado en `page-home.css` |
| K8 | Trust bar | reusable | ✅ construido, encerrado |
| K9 | Tabla comparativa | ~4 | ❌ no existe |
| K10 | Link tiles | ~15 | ✅ construido (`.coverage` pills), encerrado |
| K11 | CTA de cierre + form | 38 | ✅ construido — pero **el formulario no envía** (`action="#"`) |
| K12 | Article layout | 3 | ❌ no existe |

**Resumen: 4 listos · 5 existen como one-offs · 3 no existen.**

> El catálogo estimaba K5 en ~12 usos. En los drafts reales aparece **27 veces** —
> es el componente faltante de mayor impacto, no un caso de borde.

---

## FASE A — Terminar homepage
- [ ] Pulido mobile (en curso)
- [ ] Revisión en dispositivo real (nada se verificó fuera de Chrome headless)
- [ ] **Commitear `content-de/`**

---

## FASE B — Los 12 componentes

No se construyen desde cero: 4 ya están y 5 existen como variantes sueltas.

- [ ] Fijar el **esquema de campos** por componente (paso 1 del catálogo)
- [ ] Unificar **K1** (2 heros → 1 con 3 variantes)
- [ ] Unificar **K3** (5 grids → 1 con 3 variantes)
- [ ] Generalizar **K2, K4** desde los one-offs existentes
- [ ] Sacar **K7, K8, K10, K11** de `page-home.css` a `css/sections.css`
- [ ] Construir **K5 (Kosten)** ← máxima prioridad, 27 usos
- [ ] Construir **K9 (tabla)** y **K12 (artículo)**

---

## FASE C — Modelo de contenido

**Esto requiere aprobación explícita**: CLAUDE.md prohíbe expandir `build.js`
más allá del marcador `<!-- include: -->` *"salvo que haya un requerimiento del
proyecto claramente justificado, y se discuta primero"*. 49 páginas × 345
secciones es exactamente ese caso. Esta es la discusión.

**No rompe la restricción de sitio estático**: la salida sigue siendo HTML
estático idéntico; cambia *cómo se genera*, no qué se sirve. Y no hace falta
ninguna dependencia nueva — `JSON.parse` es parte de Node.

- [ ] Extender `build.js`: leer `content/<slug>.json` → render de secciones
- [ ] **FAQPage JSON-LD generado desde los mismos datos del FAQ** (nunca dos veces)
- [ ] Meta/title/schema desde el frontmatter de cada página
- [ ] Convertir 1 página piloto a mano para validar el esquema
- [ ] Convertir los 49 `.docx` → JSON (automatizable: los 49 traen Title/Meta/H1)

---

## FASE D — Generar las 49 páginas
- [ ] Build automatizado + una pasada de revisión conjunta
- [ ] Sitemap final (hoy 4 URLs)

---

## FASE E — Infraestructura y lanzamiento

Nada de esto lo destraba el código; depende de decisiones y accesos del cliente.
**Conviene arrancarlo en paralelo con la Fase B, no después.**

- [ ] **Formulario → CRM** 🔴 hoy `action="#"`: no llega nada
- [ ] **Consent Mode v2 + banner** 🔴 falta elegir herramienta
- [ ] **GTM → GA4 → conversiones Ads** 🔴 accesos
- [ ] **reCAPTCHA v3** + captura UTM/gclid
- [ ] **CMS de referencias** 🔴 sin decidir (Sanity / Directus / JSON)
- [ ] **Redirects 301 desde WordPress** 🔴 falta el listado de URLs viejas
- [ ] **Número real de WhatsApp** (hoy `491234567890`, falso, en todas las páginas)
- [ ] **2 enlaces `href="#"`** en el nav
- [ ] Search Console + Bing · Lighthouse por página · quitar `noindex` de previews

---

## Pendientes verificados en el repo

| | Estado |
|---|---|
| `/leistungen/` enlazado 2× desde el nav, no existe | 🔴 **404 en vivo** |
| 10 ciudades enlazadas desde footer + Coverage | 🟡 **1 de 10 existe** — Nürnberg construida 2026-08-09; las otras 9 siguen 404 en vivo |
| `/werkschutz/` en `lang="en"` + 8 placeholders | pendiente |
| Métricas `300+`, `1.000.000+`, `10+` | 🔴 sin confirmar |
| `4.7★ / 97`, 3 testimonios reales, JSON-LD | ✅ |

---

## Decisión de alcance pendiente

`/en/` existe con `hreflang` de/en/x-default, pero hay **1 página en inglés
contra 49 en alemán**. O se completa (≈98 páginas) o `/en/` queda como landing
suelta y se corrige el `hreflang`. Decidir **antes** de generar los lotes.
