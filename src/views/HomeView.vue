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
    <v-sheet color="primary" class="py-10 px-4">
      <v-container>
        <h1 class="text-h4 text-md-h3 font-weight-bold text-white mb-2">
          Buscador de Libros
        </h1>
        <p class="text-body-1 text-white mb-6 opacity-80">
          Explorá millones de títulos con OpenLibrary. Buscá por título, autor o ISBN.
        </p>
        <!-- v-theme-provider resetea el contexto de color para que los inputs tengan texto oscuro -->
        <v-theme-provider theme="light">
          <SearchBar @search="handleSearch" />
        </v-theme-provider>
      </v-container>
    </v-sheet>

    <!-- Results section -->
    <v-container class="py-6">
      <!-- Loading skeletons -->
      <v-row v-if="loading">
        <v-col v-for="i in 8" :key="i" cols="12" sm="6" md="4" lg="3">
          <v-skeleton-loader type="card" />
        </v-col>
      </v-row>

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
        <v-row>
          <v-col
            v-for="book in books"
            :key="book.key"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <BookCard :book="book" />
          </v-col>
        </v-row>
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
    </v-container>
  </div>
</template>
