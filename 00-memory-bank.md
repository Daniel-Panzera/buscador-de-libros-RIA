# Memory Bank — BookFinder

> Archivo de contexto del proyecto para herramientas de IA.
> Generado con Claude Code (claude-sonnet-4-6). Ver `prompts/` para el historial de interacciones.

---

## Descripción del proyecto

**BookFinder** es una aplicación web SPA (Single Page Application) que permite buscar libros
mediante la API pública de OpenLibrary. Los usuarios pueden buscar por título, autor o ISBN,
ver el detalle de cada libro y gestionar una lista de lecturas pendientes persistida en LocalStorage.

Proyecto académico — Lab 2, evaluación con criterios formales.

---

## Stack tecnológico

| Herramienta | Versión | Propósito |
|-------------|---------|-----------|
| Vue 3 | ^3.5 | Framework principal, Composition API |
| Vite | ^8.0 | Build tool y dev server |
| Vuetify 3 | ^3.8 | UI components (Material Design) |
| TypeScript | ~6.0 | Tipado estático |
| Pinia | ^3.0 | Estado global (readingList, selectedBook) |
| Vue Router | ^4.6 | Navegación SPA (3 rutas) |
| Axios | ^1.16 | Cliente HTTP para OpenLibrary |
| Vitest | ^4.1 | Testing unitario e integración |
| @vue/test-utils | ^2.4 | Mounting de componentes en tests |

---

## Estructura del proyecto

```
src/
├── components/
│   ├── AppNavbar.vue     # Barra de navegación con badge de lista
│   ├── BookCard.vue      # Tarjeta de libro (portada, info, acciones)
│   ├── SearchBar.vue     # Formulario de búsqueda con selector de tipo
│   └── EmptyState.vue    # Estado vacío reutilizable
├── views/
│   ├── HomeView.vue      # Búsqueda + grilla de resultados
│   ├── BookDetailView.vue # Detalle de libro + add to list
│   └── ReadingListView.vue # Lista de pendientes
├── services/
│   └── openLibrary.ts    # searchBooks, getWorkDetails, getCoverUrl
├── stores/
│   ├── readingList.ts    # Pinia store + persistencia localStorage
│   └── selectedBook.ts  # Libro seleccionado para navegación
├── types/
│   └── book.ts           # BookDoc, SearchResponse, WorkDetail, ReadingListItem
├── plugins/
│   └── vuetify.ts        # Configuración de Vuetify + tema
└── router/
    └── index.ts          # 3 rutas: /, /book/:id, /reading-list
```

---

## API — OpenLibrary

**Base URL:** `https://openlibrary.org`

| Endpoint | Descripción |
|----------|-------------|
| `GET /search.json?q={query}&limit=20` | Búsqueda general |
| `GET /search.json?title={title}` | Búsqueda por título |
| `GET /search.json?author={author}` | Búsqueda por autor |
| `GET /search.json?isbn={isbn}` | Búsqueda por ISBN |
| `GET /works/{id}.json` | Detalle de obra (descripción, temas) |
| `https://covers.openlibrary.org/b/id/{id}-{S\|M\|L}.jpg` | Portada |

No requiere API key. Rate limit: uso razonable.

---

## Rutas

| Ruta | Vista | Descripción |
|------|-------|-------------|
| `/` | HomeView | Búsqueda y resultados |
| `/book/:id` | BookDetailView | Detalle de libro (id = work ID sin `/works/`) |
| `/reading-list` | ReadingListView | Lista de pendientes (localStorage) |

---

## Estado global (Pinia)

### `readingList` store
- `items: ReadingListItem[]` — libros guardados (persiste en `localStorage`)
- `count: number` — computed, total de libros
- `isInList(key)` — verifica si un libro está en la lista
- `addBook(book)` — agrega (idempotente)
- `removeBook(key)` — elimina

### `selectedBook` store
- `book: BookDoc | null` — libro seleccionado para navegar al detalle
- `setBook(book)` — guarda el libro antes de navegar
- `clear()` — limpia

---

## Tests

```
tests/
├── setup.ts                              # Vuetify + Pinia global setup
├── unit/
│   ├── readingList.store.spec.ts         # 7 tests: CRUD, localStorage, duplicados
│   ├── SearchBar.spec.ts                 # 3 tests: render, disabled, emit
│   └── EmptyState.spec.ts               # 4 tests: props, slot
└── integration/
    └── openLibrary.service.spec.ts       # 6 tests: URLs, descripción, mock axios
```

**Ejecutar:** `npm run test:run`
**Con cobertura:** `npm run test:coverage`

---

## Decisiones de diseño

- **Sin backend propio:** toda la lógica es cliente-side, usando únicamente OpenLibrary y localStorage.
- **selectedBook store** (en vez de query params): para pasar datos del libro al detalle sin una API call extra. Si el usuario accede directo por URL, ve un mensaje informativo.
- **autoImport de Vuetify:** los componentes Vuetify se importan automáticamente en build vía `vite-plugin-vuetify`. En tests se importan explícitamente en `setup.ts`.
- **TypeScript strict:** `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly` activados.

---

## Herramientas de IA utilizadas

- **Claude Code** (claude-sonnet-4-6) — planificación, scaffolding, implementación completa
- Ver carpeta `prompts/` para el historial detallado de interacciones
