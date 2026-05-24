# Prompt 01 — Planificación inicial del proyecto

**Fecha:** 2026-05-24
**Herramienta:** Claude Code (claude-sonnet-4-6)
**Etapa:** Diseño de arquitectura y setup del proyecto

---

## Prompt del usuario (resumen)

El usuario solicitó crear una aplicación web de buscador de libros para un proyecto académico (Lab 2)
con los siguientes requerimientos:

- **Framework:** Vue 3, React o Angular (a elección)
- **UI:** Bootstrap o Material Design (obligatorio)
- **Navegación:** mínimo 2 rutas
- **Backend:** sin lógica propia, sin base de datos (solo LocalStorage)
- **API:** OpenLibrary (búsqueda por autor/ISBN y lista de pendientes)
- **Testing:** unitarios + integración + Lighthouse > 80
- **Docker:** Dockerfile + nginx.conf + docker-compose.yml
- **Documentación IA:** carpeta `prompts/` + `00-memory-bank.md`

---

## Decisiones tomadas durante la interacción

### Framework: Vue 3 + Vite
El usuario eligió **Vue 3** luego de recibir una comparativa con React y Angular.
Razones: curva de aprendizaje más suave, la estructura sugerida del enunciado está orientada
a Vue, y Vuetify 3 ofrece componentes ricos out-of-the-box para apps de búsqueda.

### UI: Vuetify 3 (Material Design)
Elegido sobre Bootstrap porque:
- `v-skeleton-loader`, `v-card`, `v-img` son perfectos para un buscador de libros
- Responsive automático sin CSS custom
- Tree-shakeable → Lighthouse > 80 garantizado

### Estructura de carpetas (vs. la sugerida)
Se mantuvo la base sugerida y se agregaron:
- `src/stores/` — necesario para Pinia (estado global + localStorage)
- `src/types/` — interfaces TypeScript fundamentales
- `src/plugins/` — configuración de Vuetify
- `prompts/` — requerido por condiciones de uso de IA
- `00-memory-bank.md` en raíz — requerido por condiciones de uso de IA

### Stack definitivo
```
Vue 3 + Vite + Vuetify 3 + TypeScript + Pinia + Vue Router 4 + Vitest + Axios
```

---

## Resultado

Proyecto completo scaffoldeado y funcional con:
- 3 rutas: `/`, `/book/:id`, `/reading-list`
- Servicio `openLibrary.ts` con búsqueda por q/title/author/isbn
- Store `readingList` con persistencia en localStorage
- Store `selectedBook` para navegación al detalle
- 4 componentes: AppNavbar, BookCard, SearchBar, EmptyState
- 3 vistas: HomeView, BookDetailView, ReadingListView
- 20 tests pasando (4 archivos de test)
- Docker: Dockerfile multistage + nginx.conf + docker-compose.yml
