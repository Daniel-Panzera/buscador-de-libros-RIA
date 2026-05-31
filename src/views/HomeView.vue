<script setup lang="ts">
import { ref } from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import BookCard from '@/components/BookCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { searchBooks } from '@/services/openLibrary'
import type { BookDoc, SearchType } from '@/types/book'

const books = ref<BookDoc[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searched = ref(false)
const totalFound = ref(0)

async function handleSearch({ query, type }: { query: string; type: SearchType }): Promise<void> {
  loading.value = true
  error.value = null
  searched.value = true

  try {
    const result = await searchBooks(query, type)
    books.value = result.docs
    totalFound.value = result.numFound
  } catch {
    error.value = 'No se pudo conectar con OpenLibrary. Verificá tu conexión e intentá de nuevo.'
    books.value = []
    totalFound.value = 0
  } finally {
    loading.value = false
  }
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
</style>
