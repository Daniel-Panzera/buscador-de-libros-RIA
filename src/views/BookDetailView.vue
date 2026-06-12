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

// Línea de metadatos (año · páginas · ISBN), solo con lo disponible.
const metaLine = computed(() => {
  const b = book.value
  if (!b) return ''
  const parts: string[] = []
  if (b.first_publish_year) parts.push(`Primera edición: ${b.first_publish_year}`)
  if (b.number_of_pages_median) parts.push(`${b.number_of_pages_median} páginas`)
  if (b.isbn?.[0]) parts.push(`ISBN: ${b.isbn[0]}`)
  return parts.join('  ·  ')
})

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
      <v-alert type="info" variant="tonal" icon="mdi-information" class="mb-4" rounded="lg">
        Para ver el detalle de un libro, buscalo primero desde la pantalla principal.
      </v-alert>
      <v-btn prepend-icon="mdi-arrow-left" rounded="lg" @click="router.push({ name: 'home' })">
        Ir al buscador
      </v-btn>
    </template>

    <!-- Detalle del libro -->
    <template v-else>
      <v-btn
        variant="text"
        prepend-icon="mdi-arrow-left"
        class="mb-4 back-btn"
        @click="router.back()"
      >
        Volver a resultados
      </v-btn>

      <v-row>
        <!-- Portada -->
        <v-col cols="12" sm="4" md="3" class="text-center">
          <v-img
            v-if="coverUrl"
            :src="coverUrl"
            :alt="book.title"
            max-width="260"
            class="mx-auto detail-cover elevation-4"
          />
          <div v-else class="detail-cover cover-fallback">
            <v-icon icon="mdi-book-outline" size="80" color="secondary" />
          </div>

          <v-btn
            :color="inList ? 'error' : 'primary'"
            :prepend-icon="inList ? 'mdi-bookmark-remove' : 'mdi-bookmark-plus'"
            class="mt-5 add-btn"
            variant="flat"
            rounded="lg"
            block
            @click="toggleReadingList"
          >
            {{ inList ? 'Quitar de mi lista' : 'Agregar a mi lista' }}
          </v-btn>
        </v-col>

        <!-- Información -->
        <v-col cols="12" sm="8" md="9">
          <h1 class="text-h5 text-md-h4 font-weight-bold mb-1 detail-title">{{ book.title }}</h1>
          <p class="text-h6 mb-3 detail-author">por {{ authorDisplay }}</p>

          <p v-if="metaLine" class="text-body-2 meta-line mb-4">{{ metaLine }}</p>

          <v-divider class="mb-5 detail-divider" />

          <!-- Descripción -->
          <template v-if="loadingDetail">
            <v-skeleton-loader type="paragraph" class="mb-4" />
          </template>
          <template v-else-if="description">
            <h2 class="text-subtitle-1 font-weight-bold mb-2 section-title">Descripción</h2>
            <p class="text-body-2 mb-5 detail-description">
              {{ description }}
            </p>
          </template>

          <!-- Temas -->
          <template v-if="subjects.length > 0">
            <h2 class="text-subtitle-1 font-weight-bold mb-2 section-title">Temas</h2>
            <div class="subjects-list">
              <v-chip
                v-for="subject in subjects"
                :key="subject"
                size="small"
                variant="tonal"
                color="primary"
                rounded="lg"
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

<style scoped>
.back-btn {
  color: #C8962A;
}

/* Portada con el mismo redondeo que las cards de resultados */
.detail-cover {
  border-radius: 18px;
  overflow: hidden;
}

/* Placeholder de libro sin portada (centrado, con fondo) */
.cover-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 300px;
  margin: 0 auto;
  background-color: #2A2318;
}

.detail-title {
  color: #EDE0CA;
}

.detail-author {
  color: #C8962A;
}

.meta-line {
  color: #A89878;
}

.detail-divider {
  border-color: #2A2318;
  opacity: 1;
}

.section-title {
  color: #EDE0CA;
}

.detail-description {
  white-space: pre-line;
  color: #B8A990;
  line-height: 1.6;
}

/* Chips de temas en fila con saltos (sin depender de utilidades de Vuetify) */
.subjects-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
