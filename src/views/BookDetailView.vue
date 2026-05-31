<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSelectedBookStore } from '@/stores/selectedBook'
import { useReadingListStore } from '@/stores/readingList'
import { getWorkDetails, getCoverUrl, getWorkDescription } from '@/services/openLibrary'
import type { WorkDetail } from '@/types/book'

const route = useRoute()
const router = useRouter()
const selectedBookStore = useSelectedBookStore()
const readingListStore = useReadingListStore()

const workId = computed(() => route.params.id as string)
const book = computed(() => selectedBookStore.book)
const workDetail = ref<WorkDetail | null>(null)
const loadingDetail = ref(false)

const coverUrl = computed(() =>
  book.value?.cover_i ? getCoverUrl(book.value.cover_i, 'L') : null
)

const authorDisplay = computed(() =>
  book.value?.author_name?.join(', ') ?? 'Autor desconocido'
)

const description = computed(() =>
  workDetail.value ? getWorkDescription(workDetail.value) : ''
)

const subjects = computed(() =>
  workDetail.value?.subjects?.slice(0, 8) ?? book.value?.subject?.slice(0, 8) ?? []
)

const inList = computed(() =>
  book.value ? readingListStore.isInList(book.value.key) : false
)

function toggleReadingList(): void {
  if (!book.value) return
  if (inList.value) {
    readingListStore.removeBook(book.value.key)
  } else {
    readingListStore.addBook({
      key: book.value.key,
      title: book.value.title,
      author: authorDisplay.value,
      cover_i: book.value.cover_i,
      addedAt: new Date().toISOString()
    })
  }
}

onMounted(async () => {
  if (!book.value) return

  loadingDetail.value = true
  try {
    workDetail.value = await getWorkDetails(workId.value)
  } catch {
    // Silently fail — tenemos la info básica del store
  } finally {
    loadingDetail.value = false
  }
})
</script>

<template>
  <v-container class="py-6">
    <!-- Libro no encontrado (acceso directo por URL) -->
    <template v-if="!book">
      <v-alert type="info" variant="tonal" icon="mdi-information" class="mb-4">
        Para ver el detalle de un libro, buscalo primero desde la pantalla principal.
      </v-alert>
      <v-btn prepend-icon="mdi-arrow-left" @click="router.push({ name: 'home' })">
        Ir al buscador
      </v-btn>
    </template>

    <!-- Detalle del libro -->
    <template v-else>
      <v-btn
        variant="text"
        prepend-icon="mdi-arrow-left"
        class="mb-4"
        @click="router.back()"
      >
        Volver
      </v-btn>

      <v-row>
        <!-- Portada -->
        <v-col cols="12" sm="4" md="3" class="text-center">
          <v-img
            v-if="coverUrl"
            :src="coverUrl"
            :alt="book.title"
            max-width="260"
            class="mx-auto rounded-lg elevation-4"
          />
          <div
            v-else
            class="d-flex align-center justify-center bg-surface-variant rounded-lg mx-auto"
            style="width: 200px; height: 300px"
          >
            <v-icon icon="mdi-book-outline" size="80" color="secondary" />
          </div>

          <v-btn
            :color="inList ? 'error' : 'primary'"
            :prepend-icon="inList ? 'mdi-bookmark-remove' : 'mdi-bookmark-plus'"
            class="mt-4"
            block
            @click="toggleReadingList"
          >
            {{ inList ? 'Quitar de mi lista' : 'Agregar a mi lista' }}
          </v-btn>
        </v-col>

        <!-- Información -->
        <v-col cols="12" sm="8" md="9">
          <h1 class="text-h5 text-md-h4 font-weight-bold mb-1">{{ book.title }}</h1>
          <p class="text-h6 mb-4" style="color: #C8962A;">{{ authorDisplay }}</p>

          <v-row class="mb-4">
            <v-col v-if="book.first_publish_year" cols="auto">
              <v-chip prepend-icon="mdi-calendar" size="small">
                Primera edición: {{ book.first_publish_year }}
              </v-chip>
            </v-col>
            <v-col v-if="book.number_of_pages_median" cols="auto">
              <v-chip prepend-icon="mdi-file-document-outline" size="small">
                {{ book.number_of_pages_median }} páginas
              </v-chip>
            </v-col>
            <v-col v-if="book.isbn?.[0]" cols="auto">
              <v-chip prepend-icon="mdi-barcode" size="small">
                ISBN: {{ book.isbn[0] }}
              </v-chip>
            </v-col>
          </v-row>

          <!-- Descripción -->
          <template v-if="loadingDetail">
            <v-skeleton-loader type="paragraph" class="mb-4" />
          </template>
          <template v-else-if="description">
            <h2 class="text-subtitle-1 font-weight-bold mb-2">Descripción</h2>
            <p class="text-body-2 mb-4" style="white-space: pre-line; color: #B8A990;">
              {{ description }}
            </p>
          </template>

          <!-- Temas -->
          <template v-if="subjects.length > 0">
            <h2 class="text-subtitle-1 font-weight-bold mb-2">Temas</h2>
            <div class="d-flex flex-wrap gap-2">
              <v-chip
                v-for="subject in subjects"
                :key="subject"
                size="small"
                variant="tonal"
                color="primary"
              >
                {{ subject }}
              </v-chip>
            </div>
          </template>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>
