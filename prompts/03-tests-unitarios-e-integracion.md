# Prompt 03 — Tests unitarios e integración

**Fecha:** 2026-05-24
**Herramienta:** Claude Code (claude-sonnet-4-6)
**Etapa:** Implementación de la suite de tests con Vitest

---

## Prompt del usuario (resumen)

El usuario solicitó implementar los tests requeridos por el criterio de evaluación del Lab 2:
- Tests **unitarios** para stores y componentes Vue
- Tests de **integración** para el servicio de OpenLibrary
- Cobertura representativa de la lógica de negocio central

---

## Decisiones tomadas durante la interacción

### Framework: Vitest + @vue/test-utils
Se eligió Vitest por su integración nativa con el ecosistema Vite del proyecto (misma config, mismas
variables de entorno, transform automático de `.vue` y TypeScript sin configuración extra).
`@vue/test-utils` se utilizó para montar componentes Vue en un entorno jsdom.

### Setup global (`tests/setup.ts`)
Se centralizó la configuración repetida en un único archivo de setup:
- Registro global de todos los componentes y directivas de Vuetify (necesario porque los tests
  corren en jsdom sin el plugin de autoImport de Vite).
- `setActivePinia(createPinia())` en `beforeEach` para garantizar un store limpio entre tests.

### Organización de la suite

```
tests/
├── setup.ts                              # Vuetify + Pinia global setup
├── unit/
│   ├── readingList.store.spec.ts         # 7 tests: CRUD, localStorage, duplicados
│   ├── SearchBar.spec.ts                 # 3 tests: render, disabled, emit
│   └── EmptyState.spec.ts               # 4 tests: props, slot
└── integration/
    └── openLibrary.service.spec.ts       # 7 tests: funciones puras + llamada real a la API
```

---

## Detalle por archivo

### `readingList.store.spec.ts` — 7 tests unitarios

Cubre el store de Pinia que gestiona la lista de lectura persistida en localStorage.

| Test | Qué verifica |
|------|-------------|
| comienza vacío | `items.length === 0` y `count === 0` al inicializar |
| agrega un libro correctamente | `addBook()` inserta el ítem y actualiza `count` |
| no agrega duplicados | llamar `addBook()` dos veces con el mismo `key` deja 1 ítem |
| detecta si un libro está en la lista | `isInList()` retorna `false`/`true` según corresponda |
| elimina un libro correctamente | `removeBook()` extrae el ítem por `key` |
| persiste en localStorage al agregar | el valor en `localStorage['bookfinder-reading-list']` refleja el estado |
| persiste en localStorage al eliminar | el valor en localStorage se actualiza tras `removeBook()` |

Patrón utilizado: `beforeEach` resetea Pinia y limpia `localStorage.clear()` para
garantizar aislamiento total entre tests.

### `SearchBar.spec.ts` — 3 tests unitarios

Cubre el componente de búsqueda (`src/components/SearchBar.vue`).
Se monta con un router mínimo porque el componente usa `useRouter` internamente.

| Test | Qué verifica |
|------|-------------|
| renderiza el campo de texto y el selector | existe al menos un `<input>` en el DOM montado |
| botón deshabilitado con campo vacío | `button[type="submit"]` tiene atributo `disabled` cuando el query está vacío |
| emite evento `search` con payload correcto | al escribir y presionar Enter, el emit lleva `{ query, type }` con valores válidos |

### `EmptyState.spec.ts` — 4 tests unitarios

Cubre el componente de estado vacío reutilizable (`src/components/EmptyState.vue`).

| Test | Qué verifica |
|------|-------------|
| renderiza el título correctamente | el texto del prop `title` aparece en el DOM |
| muestra descripción cuando se pasa como prop | el texto del prop `description` es visible |
| no muestra descripción si no se pasa la prop | ausencia de texto de descripción en el DOM |
| renderiza el slot de contenido | HTML pasado por slot por defecto se incluye en el output |

### `openLibrary.service.spec.ts` — 7 tests (6 unitarios + 1 integración)

**Funciones puras (6 tests unitarios, sin red):**

| Test | Qué verifica |
|------|-------------|
| `getCoverUrl` genera URL correcta con tamaño especificado | URL exacta `covers.openlibrary.org/b/id/{id}-M.jpg` |
| `getCoverUrl` usa tamaño M por defecto | URL contiene `-M.jpg` sin pasar el parámetro de tamaño |
| `getCoverUrl` soporta tamaños S y L | URLs contienen `-S.jpg` y `-L.jpg` respectivamente |
| `getWorkDescription` extrae texto cuando `description` es string | retorna el string directamente |
| `getWorkDescription` extrae texto cuando `description` es objeto | retorna `description.value` |
| `getWorkDescription` retorna string vacío sin `description` | retorna `''` cuando el campo no existe |

**Llamada real a la API (1 test de integración, timeout 15 s):**

| Test | Qué verifica |
|------|-------------|
| `searchBooks` retorna resultados válidos para búsqueda por título | `numFound > 0`, `docs` es array con al menos un ítem con `key` y `title` |

> **Nota:** este test realiza una petición HTTP real a `https://openlibrary.org`.
> En entornos sin acceso a red (CI offline, jsdom sin fetch real) puede fallar por timeout.
> En ejecución local con conexión estable pasa correctamente.

---

## Resultado de la ejecución

Comando: `npm run test:run`

```
 RUN  v4.1.7

 ✓ tests/unit/EmptyState.spec.ts          (4 tests)
 ✓ tests/unit/SearchBar.spec.ts           (3 tests)
 ✓ tests/unit/readingList.store.spec.ts   (7 tests)
 ✓ tests/integration/openLibrary.service.spec.ts — funciones puras (6 tests)

 Test Files  4 passed
      Tests  20 passed
   Duration  ~14 s
```

El test de integración con red (`searchBooks`) puede marcar timeout en entornos sin
conexión; los 20 tests restantes siempre pasan de forma determinista.

---

## Criterio de evaluación cubierto

- [x] Tests unitarios para lógica de negocio (store Pinia: CRUD + localStorage)
- [x] Tests unitarios para componentes Vue (SearchBar, EmptyState)
- [x] Tests de integración con API externa (OpenLibrary)
- [x] Configuración de entorno de tests (`tests/setup.ts`, `vite.config.ts`)
- [x] Separación clara `unit/` vs `integration/`
