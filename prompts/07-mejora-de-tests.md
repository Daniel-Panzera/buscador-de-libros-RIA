# Prompt 07 — Mejora de los tests (cobertura > 80% y aserciones reales)

**Fecha:** 2026-06-11
**Herramienta:** Claude Code (claude-opus-4-8)
**Etapa:** Refuerzo de la suite de tests para cumplir el criterio de la consigna

---

## Prompt del usuario (resumen)

El usuario pidió evaluar si los tests existentes eran buenos usando el criterio de la
consigna: **unitarios, integración y Lighthouse deben superar el 80%**. Tras la evaluación,
pidió corregir lo que no llegaba.

---

## Evaluación inicial

Midiendo la cobertura contra el umbral del 80%:

| Métrica | Antes | ¿> 80%? |
|---------|-------|---------|
| Statements | 83.63% | ✅ |
| Branches | 89.28% | ✅ |
| **Functions** | **77.77%** | ❌ |
| Lines | 82.97% | ✅ |

**Dos problemas detectados:**

1. **`Functions` (77.77%) no llegaba al 80%.** Faltaban cubrir funciones: `getWorkDetails`
   del servicio y `handleSubmit` de `SearchBar`.
2. **`SearchBar.spec` tenía "falsos verdes":** todas las aserciones clave estaban dentro de
   `if (...)`, así que si el elemento no existía el test pasaba sin verificar nada. El peor
   caso: el test de emisión de `search` solo asertaba *si* el evento ya había ocurrido, con lo
   cual una regresión no lo habría hecho fallar.

---

## Cambios realizados

### Nuevo: `tests/unit/openLibrary.service.spec.ts` (8 tests, axios mockeado)

- Mock de la instancia de axios con `vi.hoisted()` + `vi.mock('axios', ...)`, para que el
  mock exista antes de que el servicio llame a `axios.create()` al importarse (evita el error
  de TDZ "Cannot access 'mockGet' before initialization").
- Cubre la construcción del parámetro de `searchBooks` por cada tipo (`q`/`title`/`author`/`isbn`),
  el paso de `limit`/`page`, el retorno de datos, y `getWorkDetails` (URL correcta + datos).
- Determinista, sin red (a diferencia del test de integración real, que se mantiene aparte).

### Reescrito: `tests/unit/SearchBar.spec.ts` (4 tests con aserciones reales)

- Se eliminaron los `if` que generaban falsos verdes.
- Ahora ejercita `handleSubmit` de verdad: valida el render, el estado disabled→enabled del
  botón, que **no** emite con el campo vacío o con solo espacios, y que emite `search` con el
  `query` y `type` correctos.

---

## Resultado

| Métrica | Antes | Después |
|---------|-------|---------|
| Statements | 83.63% | **96.36%** |
| Branches | 89.28% | **96.42%** |
| Functions | 77.77% | **94.44%** |
| Lines | 82.97% | **95.74%** |

**Total: 30 tests en verde** (antes 20). Las cuatro métricas superan el 80%, cumpliendo el
criterio. Se actualizaron `00-memory-bank.md` y el mapa de navegación con la nueva suite.

> Nota de entorno: Vitest a veces lanza un error transitorio `failed to find the runner` en la
> primera corrida; reintentando una vez, la suite corre normal.
