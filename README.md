# BookFinder — Buscador de Libros

Aplicación web SPA para buscar libros usando la API pública de [OpenLibrary](https://openlibrary.org).
Permite buscar por título, autor o ISBN, ver el detalle de cada libro y gestionar una lista de lecturas pendientes.

> Proyecto académico — Lab 2

---

## Tecnologías

| Herramienta | Propósito |
|-------------|-----------|
| Vue 3 + Vite | Framework y build tool |
| Vuetify 3 | UI (Material Design) |
| TypeScript | Tipado estático |
| Pinia | Estado global |
| Vue Router 4 | Navegación |
| Axios | Cliente HTTP |
| Vitest | Testing |
| Docker + Nginx | Despliegue |

---

## Funcionalidades

- **Búsqueda** por cualquier campo, título, autor o ISBN
- **Resultados** en grilla responsive (móvil/desktop)
- **Detalle** de libro: portada, autor, año, páginas, ISBN, descripción, temas
- **Lista de pendientes**: agregar/quitar libros, persistida en LocalStorage
- **Skeleton loaders** durante la carga
- **Estado vacío** cuando no hay resultados

---

## Instalación y ejecución local

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (http://localhost:5173)
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

---

## Tests

```bash
# Ejecutar tests (modo watch)
npm run test

# Ejecutar tests una vez
npm run test:run

# Reporte de cobertura
npm run test:coverage
```

**Cobertura:** 20 tests — 4 archivos (unit + integración)

---

## Despliegue con Docker

```bash
# Construir imagen y levantar
docker compose up -d --build

# La app queda disponible en http://localhost:8080
```

---

## Estructura del proyecto

```
├── src/
│   ├── components/      # SearchBar, BookCard, AppNavbar, EmptyState
│   ├── views/           # HomeView, BookDetailView, ReadingListView
│   ├── services/        # openLibrary.ts — llamadas a la API
│   ├── stores/          # readingList.ts, selectedBook.ts (Pinia)
│   ├── types/           # book.ts — interfaces TypeScript
│   ├── plugins/         # vuetify.ts — configuración
│   └── router/          # index.ts — 3 rutas
├── tests/
│   ├── unit/            # Tests de componentes y stores
│   └── integration/     # Tests de servicios
├── docker/
│   ├── Dockerfile
│   └── nginx.conf
├── prompts/             # Historial de interacciones con IA
├── 00-memory-bank.md    # Contexto del proyecto para herramientas de IA
└── docker-compose.yml
```

---

## API — OpenLibrary

Toda la información proviene de [OpenLibrary](https://openlibrary.org/developers/api).
La API es gratuita y no requiere autenticación.

| Endpoint | Uso |
|----------|-----|
| `/search.json?q=...` | Búsqueda general |
| `/search.json?author=...` | Búsqueda por autor |
| `/search.json?isbn=...` | Búsqueda por ISBN |
| `/works/{id}.json` | Detalle de obra |
| `covers.openlibrary.org/b/id/{id}-M.jpg` | Portadas |

---

## Herramientas de IA utilizadas

| Herramienta | Uso |
|-------------|-----|
| **Claude Code** (claude-sonnet-4-6) | Planificación de arquitectura, scaffolding, implementación completa de componentes, vistas, tests y configuración Docker |

Todas las interacciones relevantes están documentadas en la carpeta [`prompts/`](./prompts/).

---

## Integrantes

<!-- Completar con los nombres del grupo -->
- ...
- ...
