# Prompt 08 — Re-medición de Lighthouse tras el rediseño

**Fecha:** 2026-06-11
**Herramienta:** Claude Code (claude-opus-4-8)
**Etapa:** Re-correr Lighthouse sobre el build de producción y recuperar el score

---

## Prompt del usuario (resumen)

Tras el reajuste visual, el usuario pidió volver a medir Lighthouse, ya que el score previo
(sesión 02) había quedado desactualizado. Se midió sobre el build de producción
(`npm run build` + `npm run preview` en `localhost:4173`) con Lighthouse en modo Mobile.

---

## Diagnóstico

El score había bajado respecto de la sesión 02:

| Categoría | Sesión 02 | Tras el rediseño |
|-----------|-----------|------------------|
| Performance | 98 | 93 |
| Accessibility | 96 | 94 |
| **Best Practices** | 100 | **77** ❌ |
| SEO | 82 | 82 |

**Problemas encontrados:**

1. **Best Practices 77:** un recurso externo del hero seteaba una cookie de terceros
   (`__cf_bm`, de Cloudflare), lo que disparaba además un *issue* en el panel de Chrome.
2. **SEO 82:** faltaba `meta description` y el `robots.txt` no era válido (el fallback SPA
   devolvía el `index.html` para `/robots.txt`).

---

## Cambios realizados

### Best Practices (77 → 100)

- El recurso de fondo del hero se **sirve localmente** (`public/`) en lugar de cargarse desde
  un dominio externo, eliminando la cookie de terceros y el issue asociado.

### Performance (86 → 97)

- El fondo del hero se sirve en **WebP** (más liviano) y se **precarga** con
  `<link rel="preload" as="image">` en el `index.html`. Como un `background-image` de CSS se
  descubre tarde, el preload adelanta su descarga y baja el LCP (4.1s → 2.5s).

### SEO (82 → 100)

- Se agregó `<meta name="description">` en el `index.html`.
- Se agregó un `public/robots.txt` válido (`User-agent: * / Allow: /`).

---

## Resultado (Lighthouse Mobile, build de producción)

| Categoría | Sesión 02 | Final |
|-----------|-----------|-------|
| Performance | 98 | **97** |
| Accessibility | 96 | **94** |
| Best Practices | 100 | **100** |
| SEO | 82 | **100** |

Las cuatro categorías superan el 80% (criterio de la consigna), con SEO mejorado respecto del
estado original. La captura oficial se tomó desde Chrome (DevTools → Lighthouse → Mobile) en
una ventana de incógnito sobre `localhost:4173`.

> Nota: la medición se hace siempre sobre el **build de producción** (`preview`, puerto 4173),
> no sobre el dev server (5173), y en incógnito para que las extensiones no alteren el score.
