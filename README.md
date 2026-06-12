# BookFinder — Buscador de Libros

Aplicación web SPA para buscar libros usando la API pública de [OpenLibrary](https://openlibrary.org).
Permite buscar por título, autor o ISBN, ver el detalle de cada libro y gestionar una lista de lecturas pendientes.

> Proyecto académico — Lab 2 (Rich Internet Applications)

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
- **Resultados** en grilla responsive (móvil/desktop) con **paginación**
- **Detalle** de libro: portada, autor, año, páginas, ISBN, descripción, temas
- **Lista de pendientes**: agregar/quitar libros, persistida en LocalStorage
- **Skeleton loaders** durante la carga y **estado vacío** cuando no hay resultados

---

## Arquitectura y diseño

SPA con **Vue 3 (Composition API) + Pinia + Vue Router**. Sin lógica de servidor: consume
OpenLibrary y persiste únicamente en LocalStorage.

**Rutas (3):**

| Ruta | Vista | Descripción |
|------|-------|-------------|
| `/` | HomeView | Búsqueda + grilla de resultados con paginación |
| `/book/:id` | BookDetailView | Detalle del libro |
| `/reading-list` | ReadingListView | Lista de pendientes (LocalStorage) |

**Estado (Pinia):**
- `readingList` — libros guardados, persistido en LocalStorage.
- `selectedBook` — libro seleccionado para navegar al detalle sin una llamada extra a la API.

**Componentes reutilizables:** `AppNavbar`, `SearchBar`, `BookCard`, `EmptyState`.

**Flujo de navegación:** Home → (click en una card) → Detalle; desde Home/Detalle se accede a
la Lista de lectura (navbar / botón agregar). Los **mockups de UI (móvil + desktop)** y los
diagramas de componentes y de navegación están en [`mockups/`](./mockups/).

---

## Instalación y ejecución local

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (http://localhost:5173)
npm run dev

# Build de producción
npm run build

# Preview del build de producción (http://localhost:4173)
npm run preview
```

---

## Tests

Suite con **Vitest**: tests unitarios (stores, componentes y servicio con axios mockeado) e
integración real con la API de OpenLibrary.

```bash
npm run test           # modo watch
npm run test:run       # una sola corrida
npm run test:coverage  # genera el reporte de cobertura en coverage/
```

**Resultado: 30 tests en verde** (5 archivos — unitarios + integración).

| Métrica | Cobertura |
|---------|-----------|
| Statements | 96.4% |
| Branches | 96.4% |
| Functions | 94.4% |
| Lines | 95.7% |

El reporte navegable se genera en `coverage/index.html` al correr `npm run test:coverage`.

---

## Performance (Lighthouse)

Medición sobre el **build de producción** (`npm run preview`, puerto 4173), Lighthouse en modo
**Mobile** y ventana de incógnito:

| Categoría | Mobile |
|-----------|--------|
| Performance | 97 |
| Accessibility | 94 |
| Best Practices | 100 |
| SEO | 100 |

Optimizaciones aplicadas: imagen del hero en **WebP** + `preload`, fuente de íconos con carga
asíncrona, **gzip** y cache de assets en Nginx, y sin recursos de terceros que seteen cookies.

---

## Seguridad

- **Sin backend ni base de datos:** toda la lógica es client-side; la única persistencia es
  `localStorage`. La lista de lectura nunca sale del dispositivo del usuario.
- **Sin credenciales ni secretos:** la API de OpenLibrary es pública y no requiere
  autenticación, así que no hay API keys ni archivos `.env` en el repositorio.
- **Sin cookies de terceros ni trackers:** todos los recursos (incluida la imagen de fondo) se
  sirven desde el propio origen.
- **Dependencias:** instaladas desde el registro oficial de npm.
- **Headers de seguridad (Nginx):** `X-Frame-Options: SAMEORIGIN`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`
  (ver [`docker/nginx.conf`](./docker/nginx.conf)).

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
├── public/             # robots.txt, hero-library.webp (assets estáticos)
├── src/
│   ├── components/      # SearchBar, BookCard, AppNavbar, EmptyState
│   ├── views/           # HomeView, BookDetailView, ReadingListView
│   ├── services/        # openLibrary.ts — llamadas a la API
│   ├── stores/          # readingList.ts, selectedBook.ts (Pinia)
│   ├── types/           # book.ts — interfaces TypeScript
│   ├── plugins/         # vuetify.ts — configuración y tema
│   └── router/          # index.ts — 3 rutas
├── tests/
│   ├── unit/            # stores, componentes y servicio (mockeado)
│   └── integration/     # servicio (llamada real a la API)
├── mockups/             # mockups de UI (móvil + desktop) y diagramas
├── docker/              # Dockerfile + nginx.conf
├── prompts/             # historial de interacciones con IA
├── 00-memory-bank.md    # contexto del proyecto para herramientas de IA
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
| **Claude Code** (modelos `claude-opus-4-8` y `claude-sonnet-4-6`) | Planificación de arquitectura, scaffolding, implementación de componentes/vistas/tests, configuración de Docker, optimización de Lighthouse y documentación |

- Cada sesión de trabajo está registrada en [`prompts/`](./prompts/).
- El contexto del proyecto para las herramientas de IA vive en [`00-memory-bank.md`](./00-memory-bank.md).

---

## Integrantes

- Daniel Panzera
- Gastón Iriarte
- Bruno Cruz
