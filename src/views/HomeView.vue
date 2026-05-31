<script setup lang="ts">
import { ref, computed } from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import BookCard from '@/components/BookCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { searchBooks } from '@/services/openLibrary'
import type { BookDoc, SearchType } from '@/types/book'

const PAGE_SIZE = 20
// OpenLibrary no permite paginar indefinidamente; acotamos a un máximo razonable.
const MAX_PAGES = 100

const books = ref<BookDoc[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searched = ref(false)
const totalFound = ref(0)
const currentPage = ref(1)

// Última búsqueda activa, para poder recargar al cambiar de página.
const lastQuery = ref('')
const lastType = ref<SearchType>('q')

const pageCount = computed(() => {
  const pages = Math.ceil(totalFound.value / PAGE_SIZE)
  return Math.min(pages, MAX_PAGES)
})

async function fetchPage(page: number): Promise<void> {
  loading.value = true
  error.value = null
  searched.value = true

  try {
    const result = await searchBooks(lastQuery.value, lastType.value, PAGE_SIZE, page)
    books.value = result.docs
    totalFound.value = result.numFound
    currentPage.value = page
  } catch {
    error.value = 'No se pudo conectar con OpenLibrary. Verificá tu conexión e intentá de nuevo.'
    books.value = []
    totalFound.value = 0
  } finally {
    loading.value = false
  }
}

function handleSearch({ query, type }: { query: string; type: SearchType }): void {
  lastQuery.value = query
  lastType.value = type
  fetchPage(1)
}

function goToPage(page: number): void {
  if (page === currentPage.value) return
  fetchPage(page)
  // Vuelve al inicio de los resultados al cambiar de página.
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div>
    <!-- Hero section -->
    <div
      class="hero-section"
      :style="{
        backgroundImage: 'url(https://static.vecteezy.com/system/resources/thumbnails/048/330/323/small_2x/elegant-home-library-featuring-traditional-wooden-bookshelves-photo.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
    >
      <v-container>
        <h1 class="text-h4 text-md-h3 font-weight-bold text-white mb-2">
          Buscador de Libros
        </h1>
        <p class="text-body-1 text-white mb-6 opacity-80">
          Explorá millones de títulos con OpenLibrary. Buscá por título, autor o ISBN.
        </p>
        <SearchBar @search="handleSearch" />
      </v-container>
    </div>

    <!-- Results section -->
    <div class="results-section">
      <!-- Loading skeletons -->
      <div v-if="loading" class="books-grid">
        <v-skeleton-loader v-for="i in 10" :key="i" type="card" />
      </div>

      <!-- Error state -->
      <v-alert
        v-else-if="error"
        type="error"
        variant="tonal"
        icon="mdi-alert-circle"
        class="my-4"
      >
        {{ error }}
      </v-alert>

      <!-- Results -->
      <template v-else-if="books.length > 0">
        <p class="text-body-2 text-grey mb-4">
          {{ totalFound.toLocaleString('es-AR') }} resultados encontrados
        </p>
        <div class="books-grid">
          <BookCard v-for="book in books" :key="book.key" :book="book" />
        </div>

        <!-- Paginación -->
        <v-pagination
          v-if="pageCount > 1"
          :model-value="currentPage"
          :length="pageCount"
          :total-visible="7"
          :disabled="loading"
          show-first-last-page
          rounded="circle"
          color="primary"
          class="mt-8"
          @update:model-value="goToPage"
        />
      </template>

      <!-- No results after search -->
      <EmptyState
        v-else-if="searched && !loading"
        icon="mdi-book-search-outline"
        title="Sin resultados"
        description="Probá con otros términos de búsqueda o cambiá el tipo de búsqueda."
      />

      <!-- Initial state -->
      <EmptyState
        v-else
        icon="mdi-magnify"
        title="¡Empezá a buscar!"
        description="Ingresá el título, autor o ISBN de un libro para encontrarlo."
      />
    </div>
  </div>
</template>

<style scoped>
.hero-section {
  position: relative;
  padding: 60px 16px 50px;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(10, 7, 4, 0.62), rgba(18, 13, 8, 0.50));
  pointer-events: none;
}

.hero-section > * {
  position: relative;
  z-index: 1;
}

.results-section {
  width: 100%;
  box-sizing: border-box;
  padding: 28px;
  background-color: #12100C;
  min-height: 100vh;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 18px;
}

@media (max-width: 1280px) {
  .books-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

@media (max-width: 960px) {
  .books-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (max-width: 600px) {
  .books-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

/* El "..." del paginador es un botón deshabilitado y queda atenuado.
   Dentro de la lista, el único ítem deshabilitado es el "..." (los flechas
   van fuera de .v-pagination__item), así que lo igualo al color de los números. */
.results-section :deep(.v-pagination__list .v-pagination__item .v-btn[ellipsis]),
.results-section :deep(.v-pagination__list .v-pagination__item .v-btn--disabled) {
  color: #C8962A !important;
  opacity: 1 !important;
}
</style>
