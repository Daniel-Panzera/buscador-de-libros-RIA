# Prompt 04 — Legibilidad, alineación y tema visual oscuro

**Fecha:** 2026-05-31
**Herramienta:** Claude Code (claude-opus-4-8)
**Etapa:** Corrección visual y rediseño del tema de color

---

## Prompt del usuario (resumen)

El usuario reportó problemas de legibilidad y alineación en varios componentes, y solicitó
mejorar la apariencia general de la app:

- Navbar: texto e ícono poco legibles en estado hover/activo; contador de lista solapando el texto
- Buscador: ítems del desplegable con texto ilegible al seleccionarlos; barra de scroll visible
- Lista de lectura: barra de scroll horizontal visible en los ítems

---

## Decisiones tomadas durante la interacción

### Tema: migración a modo oscuro cálido ("library")

Se reemplazó el tema claro azul por un tema oscuro con paleta de biblioteca antigua:

| Token | Valor | Uso |
|-------|-------|-----|
| `background` | `#12100C` | Fondo general |
| `surface` | `#1E1A14` | Cards, sheets |
| `primary` | `#C8962A` | Dorado — acciones principales |
| `secondary` | `#8D6E47` | Madera — acciones secundarias |
| `on-background` | `#EDE0CA` | Texto general (crema) |
| `on-primary` | `#12100C` | Texto sobre dorado |

El tema se definió en `src/plugins/vuetify.ts` con `dark: true` para que Vuetify genere
automáticamente los colores derivados correctos.

### Navbar (`AppNavbar.vue`)

Problemas encontrados y soluciones:

- **Ícono invisible:** `color="primary"` explícito en el ícono para que tome el dorado.
- **Contador solapando texto:** se eliminó `v-badge` y se reemplazó por un `<span class="count-box">`
  posicionado a la izquierda dentro del botón. El botón tiene `min-width: 132px` para que entre
  cómodo.
- **Hover/activo ilegible:** CSS scoped que aplica `background-color: #C8962A` en estado activo y
  un overlay crema translúcido (`opacity: 0.12`) en hover. En estado activo se invierte el recuadro
  del contador (fondo oscuro, número dorado).

### Buscador (`SearchBar.vue`)

- **Labels flotantes → labels fijos:** se eliminó el prop `label` de `v-select` y `v-text-field`,
  reemplazado por `<label class="field-label">` encima de cada campo. Esto evita el conflicto
  de colores al hacer focus.
- **Inputs "glass":** clase `glass-field` con `background: rgba(255,255,255,0.08)` y
  `backdrop-filter: blur(6px)` para integrar los campos sobre el hero con imagen de fondo.
- **Desplegable ilegible:** el menú de `v-select` se teletransporta al `<body>` (fuera del scope),
  por eso se usó un bloque `<style>` global acotado con la clase `search-type-menu` vía
  `:menu-props="{ contentClass: 'search-type-menu' }"`.
- **Barra de scroll oculta:** `scrollbar-width: none` + `::-webkit-scrollbar { display: none }`.
- **Botón limpiar:** oculto cuando el campo está vacío con
  `:deep(.v-field:not(.v-field--dirty) .v-field__clearable) { display: none }`.

### Lista de lectura (`ReadingListView.vue`)

- Clase `reading-list` con `overflow-x: hidden` y ocultado de scrollbar en Firefox/WebKit.

### Otros ajustes

- `BookCard.vue`: imagen con `aspect-ratio="2/3"` (proporciones reales de tapa); placeholder
  reemplazado de colores grises a tokens del tema (`bg-surface-variant`, `color="secondary"`).
- `HomeView.vue`: hero con imagen de fondo + overlay degradado oscuro; grid CSS nativo (5 columnas)
  en lugar de `v-row/v-col` para mejor control del layout.
- `BookDetailView.vue`: colores de texto migrados a tokens del tema oscuro.

---

## Resultado

Todos los problemas de legibilidad resueltos. La app adoptó un tema oscuro cálido consistente
en todos los componentes, sin regresiones en los tests existentes.
