<script setup lang="ts">
import { ref } from 'vue'
import type { SearchType } from '@/types/book'

const emit = defineEmits<{
  search: [{ query: string; type: SearchType }]
}>()

const query = ref('')
const searchType = ref<SearchType>('q')

const searchOptions = [
  { title: 'Cualquier campo', value: 'q' },
  { title: 'Título', value: 'title' },
  { title: 'Autor', value: 'author' },
  { title: 'ISBN', value: 'isbn' }
] as const

function handleSubmit(): void {
  // El clearable de Vuetify puede dejar query en null; normalizamos antes de usar
  const trimmed = (query.value ?? '').trim()
  if (!trimmed) return
  emit('search', { query: trimmed, type: searchType.value })
}
</script>

<template>
  <v-form @submit.prevent="handleSubmit">
    <!-- Una sola fila: selector + campo + botón alineados a la misma línea -->
    <div class="search-bar">
      <div class="field-col field-type">
        <label class="field-label">Buscar por</label>
        <v-select
          v-model="searchType"
          :items="searchOptions"
          item-title="title"
          item-value="value"
          variant="outlined"
          density="comfortable"
          hide-details
          class="glass-field"
          :menu-props="{ contentClass: 'search-type-menu' }"
        />
      </div>

      <div class="field-col field-term">
        <label class="field-label">Término de búsqueda</label>
        <v-text-field
          v-model="query"
          placeholder="Ingresá el término de búsqueda..."
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
          class="glass-field"
          @keyup.enter="handleSubmit"
        />
      </div>

      <div class="field-col field-action">
        <!-- Label fantasma: alinea el botón con los campos sin texto visible -->
        <span class="field-label field-label--spacer" aria-hidden="true">&nbsp;</span>
        <v-btn
          type="submit"
          size="large"
          :disabled="!query?.trim()"
          class="search-btn"
        >
          Buscar
        </v-btn>
      </div>
    </div>
  </v-form>
</template>

<style scoped>
/* Fila única: selector | campo (crece) | botón. Las columnas se estiran
   a la misma altura (stretch); el botón se adapta a la de los campos. */
.search-bar {
  display: flex;
  align-items: stretch;
  gap: 12px;
}

.field-col {
  display: flex;
  flex-direction: column;
}

.field-type {
  flex: 0 0 220px;
}

.field-term {
  flex: 1 1 auto;
  min-width: 0;
}

.field-action {
  flex: 0 0 auto;
}

/* En celular se apila en columna, cada elemento a lo ancho */
@media (max-width: 599px) {
  .search-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .field-type {
    flex: 1 1 auto;
  }

  .field-label--spacer {
    display: none;
  }

  .search-btn {
    width: 100%;
  }
}

.field-label {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  color: #EDE0CA;
  margin-bottom: 4px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* Label fantasma del botón: ocupa el mismo alto que un label real */
.field-label--spacer {
  visibility: hidden;
}

.search-btn {
  /* Se estira para ocupar la altura natural del campo (debajo del label) */
  flex: 1 1 auto;
  height: auto !important;
  min-height: 0;
  min-width: 120px;
  background-color: #C8962A !important;
  color: #12100C !important;
  font-weight: 700 !important;
  letter-spacing: 0.06em;
}

.search-btn:disabled {
  background-color: rgba(200, 150, 42, 0.35) !important;
  color: rgba(18, 16, 12, 0.5) !important;
}

:deep(.glass-field .v-field) {
  background-color: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(6px);
}

:deep(.glass-field .v-field--focused .v-field__outline) {
  color: #C8962A !important;
}

:deep(.glass-field .v-field__outline) {
  --v-field-border-opacity: 0.5;
  color: rgba(237, 224, 202, 0.4) !important;
}

:deep(.glass-field input),
:deep(.glass-field .v-select__selection-text) {
  color: #EDE0CA !important;
}

:deep(.glass-field .v-field__input::placeholder) {
  color: rgba(237, 224, 202, 0.5) !important;
}

:deep(.glass-field .v-select__menu-icon) {
  color: #EDE0CA !important;
}

/* Oculta el botón de borrado cuando el campo está vacío */
:deep(.glass-field .v-field:not(.v-field--dirty) .v-field__clearable) {
  display: none !important;
}

/* Centra verticalmente la cruz y la corre hacia la derecha (estaba pegada a la izquierda) */
:deep(.glass-field .v-field__clearable) {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-inline-end: 0;
  margin-inline-end: -8px;
}

/* Texto oscuro en el botón al hacer hover/click */
.search-btn:hover,
.search-btn:active,
.search-btn:focus {
  color: #12100C !important;
}

:deep(.search-btn .v-btn__overlay) {
  background-color: rgba(18, 16, 12, 0.1) !important;
}
</style>

<!--
  El menú del v-select se teletransporta al <body>, fuera del alcance del
  CSS scoped. Por eso el ítem activo se estiliza con un bloque global,
  acotado mediante la clase del contenido del menú (search-type-menu).
-->
<style>
.search-type-menu .v-list-item--active {
  background-color: #C8962A !important;
}

.search-type-menu .v-list-item--active .v-list-item-title {
  color: #12100C !important;
  font-weight: 600;
}

/* Neutraliza el overlay translúcido para que el crema quede limpio */
.search-type-menu .v-list-item--active .v-list-item__overlay {
  opacity: 0 !important;
}

/* Hover sobre ítems NO seleccionados: crema translúcido para no tapar el texto */
.search-type-menu .v-list-item:not(.v-list-item--active):hover .v-list-item__overlay {
  background-color: #C8962A !important;
  opacity: 0.12 !important;
}

/* Oculta la barra de desplazamiento del menú (Firefox / WebKit) */
.search-type-menu,
.search-type-menu .v-list {
  scrollbar-width: none;
}

.search-type-menu::-webkit-scrollbar,
.search-type-menu .v-list::-webkit-scrollbar {
  display: none;
}
</style>
