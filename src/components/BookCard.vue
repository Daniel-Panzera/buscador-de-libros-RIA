<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { BookDoc } from '@/types/book'
import { getCoverUrl } from '@/services/openLibrary'
import { useReadingListStore } from '@/stores/readingList'
import { useSelectedBookStore } from '@/stores/selectedBook'

const props = defineProps<{
  book: BookDoc
}>()

const router = useRouter()
const readingListStore = useReadingListStore()
const selectedBookStore = useSelectedBookStore()

const coverUrl = computed(() =>
  props.book.cover_i ? getCoverUrl(props.book.cover_i, 'M') : null
)

const authorDisplay = computed(() =>
  props.book.author_name?.slice(0, 2).join(', ') ?? 'Autor desconocido'
)

// Línea de metadatos (año · páginas), solo con los datos disponibles.
const metaLine = computed(() => {
  const parts: string[] = []
  if (props.book.first_publish_year) parts.push(String(props.book.first_publish_year))
  if (props.book.number_of_pages_median) parts.push(`${props.book.number_of_pages_median} págs.`)
  return parts.join(' · ')
})

const inList = computed(() => readingListStore.isInList(props.book.key))

const workId = computed(() => props.book.key.replace('/works/', ''))

function navigateToDetail(): void {
  selectedBookStore.setBook(props.book)
  router.push({ name: 'book-detail', params: { id: workId.value } })
}

function toggleReadingList(): void {
  if (inList.value) {
    readingListStore.removeBook(props.book.key)
  } else {
    readingListStore.addBook({
      key: props.book.key,
      title: props.book.title,
      author: authorDisplay.value,
      cover_i: props.book.cover_i,
      addedAt: new Date().toISOString()
    })
  }
}
</script>

<template>
  <!-- La card completa navega al detalle (flujo del mockup: "click en card") -->
  <v-card
    class="book-card d-flex flex-column"
    elevation="3"
    role="button"
    :aria-label="`Ver detalle de ${book.title}`"
    @click="navigateToDetail"
  >
    <div class="cover-wrap">
      <v-img
        :src="coverUrl ?? undefined"
        :aspect-ratio="2 / 3"
        cover
        class="cover-img"
        :alt="book.title"
      >
        <template #error>
          <div class="cover-fallback">
            <v-icon icon="mdi-book-outline" size="48" color="secondary" />
          </div>
        </template>
        <template v-if="!coverUrl" #default>
          <div class="cover-fallback">
            <v-icon icon="mdi-book-outline" size="48" color="secondary" />
          </div>
        </template>
      </v-img>
    </div>

    <div class="card-body flex-grow-1">
      <h3 class="book-title">{{ book.title }}</h3>
      <p class="book-author">{{ authorDisplay }}</p>
      <p v-if="metaLine" class="book-meta">{{ metaLine }}</p>
    </div>

    <div class="card-actions">
      <v-btn
        block
        size="small"
        :color="inList ? 'error' : 'primary'"
        variant="flat"
        rounded="lg"
        class="add-btn"
        :prepend-icon="inList ? 'mdi-bookmark-remove' : 'mdi-bookmark-plus'"
        @click.stop="toggleReadingList"
      >
        {{ inList ? 'Quitar de mi lista' : 'Agregar a mi lista' }}
      </v-btn>
    </div>
  </v-card>
</template>

<style scoped>
.book-card {
  border-radius: 14px;
  background-color: #1E1A14;
  border: 1px solid #2A2318;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.book-card:hover {
  transform: translateY(-4px);
  border-color: rgba(200, 150, 42, 0.5);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.45);
}

/* Resaltado de Vuetify: apenas un tinte dorado, no tapa la portada */
.book-card :deep(.v-card__overlay) {
  background-color: #C8962A;
}

.book-card:hover :deep(.v-card__overlay) {
  opacity: 0.05 !important;
}

/* Portada con pequeño margen interno y esquinas redondeadas */
.cover-wrap {
  padding: 8px 8px 0;
}

.cover-img {
  border-radius: 10px;
  overflow: hidden;
}

/* Placeholder de libros sin portada (centrado y con fondo, sin utilidades) */
.cover-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #2A2318;
}

.card-body {
  padding: 8px 12px 2px;
}

.book-title {
  font-size: 0.82rem;
  font-weight: 700;
  line-height: 1.3;
  color: #EDE0CA;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.book-author {
  font-size: 0.74rem;
  color: #A89878;
  margin: 3px 0 0;
}

.book-meta {
  font-size: 0.7rem;
  color: #8D6E47;
  margin: 3px 0 0;
}

.card-actions {
  padding: 8px 10px 10px;
}

.add-btn {
  font-weight: 700;
  font-size: 0.72rem;
  letter-spacing: 0;
  text-transform: none;
}
</style>
