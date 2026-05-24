# Prompt 02 — Lighthouse, optimización de performance y fixes de UI

**Fecha:** 2026-05-24
**Herramienta:** Claude Code (claude-sonnet-4-6)
**Etapa:** Testing de performance + corrección de bugs visuales

---

## Lighthouse

Se ejecutó Lighthouse CLI contra el build de producción (`npm run preview`).

### Resultado inicial
| Categoría | Mobile | Desktop |
|-----------|--------|---------|
| Performance | 77 | 99 |
| Accessibility | 96 | 96 |
| Best Practices | 100 | 100 |
| SEO | 82 | 82 |

**Problema:** mobile Performance en 77, debajo del criterio > 80.
**Causa:** CSS de Vuetify y fuente MDI incluidas en el bundle principal bloqueaban el render.

### Optimizaciones aplicadas

1. **SASS tree-shaking de Vuetify** — instalado `sass`, configurado `vite-plugin-vuetify` con
   `styles: { configFile: 'src/styles/settings.scss' }` y `$color-pack: false`.
   Resultado: CSS bajó de 684KB → 438KB (gzip: 98KB → 70KB).

2. **MDI font async desde CDN** — eliminado `import '@mdi/font/css/materialdesignicons.css'`
   del bundle. Cargado desde `jsdelivr.net` con `media="print" onload="this.media='all'"`.
   Resultado: CSS bajó de 438KB → 114KB (gzip: 70KB → 16KB).

3. **Preconnect** a OpenLibrary, Covers y jsDelivr en `index.html`.

### Resultado final
| Categoría | Mobile | Desktop |
|-----------|--------|---------|
| Performance | **98** | **99** |
| Accessibility | **96** | **96** |
| Best Practices | **100** | **100** |
| SEO | **82** | **82** |

---

## Fixes de UI (sesión posterior)

### Problema 1: texto invisible en el buscador
**Causa:** `v-sheet color="primary"` hereda `color: white` a todos sus hijos en Vuetify.
Los inputs tenían `bg-color="white"` (fondo blanco) pero el texto y labels seguían blancos → invisibles.

**Fix:** `<v-theme-provider theme="light">` envolviendo `<SearchBar>` en HomeView.
Esto resetea el contexto de color de Vuetify para que los inputs usen colores del tema claro.

### Problema 2: botón "Buscar" desalineado/angosto
**Causa:** columnas `sm="3" / sm="7" / sm="2"` — la última columna (2/12) era muy angosta
para el texto "Buscar".

**Fix:** redistribuir a `sm="3" / sm="6" / sm="3"` y eliminar `prepend-icon` del botón.
