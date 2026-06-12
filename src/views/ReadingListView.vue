<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useReadingListStore } from '@/stores/readingList'
import { useSelectedBookStore } from '@/stores/selectedBook'
import { getCoverUrl } from '@/services/openLibrary'
import EmptyState from '@/components/EmptyState.vue'
import type { ReadingListItem } from '@/types/book'

const router = useRouter()
const readingListStore = useReadingListStore()
const selectedBookStore = useSelectedBookStore()

const items = computed(() => readingListStore.items)

function coverUrl(item: ReadingListItem): string | null {
  return item.cover_i ? getCoverUrl(item.cover_i, 'M') : null
}

function removeBook(key: string): void {
  readingListStore.removeBook(key)
}

function viewDetail(item: ReadingListItem): void {
  selectedBookStore.setBook({
    key: item.key,
    title: item.title,
    author_name: item.author ? [item.author] : [],
    cover_i: item.cover_i
  })
  const workId = item.key.replace('/works/', '')
  router.push({ name: 'book-detail', params: { id: workId } })
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium' }).format(new Date(iso))
}
</script>

<template>
  <v-container class="py-6">
    <div class="d-flex align-center mb-6">
      <v-icon icon="mdi-bookshelf" size="32" color="primary" class="mr-3" />
      <h1 class="text-h5 font-weight-bold list-heading">Mi Lista de Lectura</h1>
      <v-chip v-if="items.length > 0" class="ml-3" color="primary" size="small" rounded="lg">
        {{ items.length }} {{ items.length === 1 ? 'libro' : 'libros' }}
      </v-chip>
    </div>

    <!-- Lista vacía -->
    <EmptyState
      v-if="items.length === 0"
      icon="mdi-bookshelf"
      title="Tu lista está vacía"
      description="Buscá libros y agregálos a tu lista para leerlos después."
    >
      <v-btn
        color="primary"
        variant="flat"
        rounded="lg"
        prepend-icon="mdi-magnify"
        class="mt-5"
        @click="router.push({ name: 'home' })"
      >
        Ir al buscador
      </v-btn>
    </EmptyState>

    <!-- Lista de libros: una tarjeta redondeada por ítem (click → detalle) -->
    <div v-else class="reading-list">
      <v-card
        v-for="item in items"
        :key="item.key"
        class="list-row"
        elevation="2"
        role="button"
        :aria-label="`Ver detalle de ${item.title}`"
        @click="viewDetail(item)"
      >
        <div class="row-inner">
          <v-avatar size="64" rounded="lg" class="list-cover">
            <v-img v-if="coverUrl(item)" :src="coverUrl(item)!" :alt="item.title" cover />
            <v-icon v-else icon="mdi-book-outline" size="32" color="secondary" />
          </v-avatar>

          <div class="list-body">
            <p class="list-title">{{ item.title }}</p>
            <p class="list-sub">{{ item.author }}</p>
            <p class="list-meta">Agregado el {{ formatDate(item.addedAt) }}</p>
          </div>

          <v-btn
            variant="outlined"
            size="small"
            color="error"
            class="remove-btn"
            prepend-icon="mdi-bookmark-remove"
            rounded="lg"
            @click.stop="removeBook(item.key)"
          >
            Quitar
          </v-btn>
        </div>
      </v-card>
    </div>
  </v-container>
</template>

<style scoped>
.list-heading {
  color: #EDE0CA;
}

/* Columna de ítems con separación (sin depender de utilidades de Vuetify) */
.reading-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Fila interna: portada | datos (crece) | botón, con aire interno */
.row-inner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
}

.list-cover {
  flex-shrink: 0;
  border-radius: 12px;
}

.list-body {
  flex: 1 1 auto;
  min-width: 0;
}

.remove-btn {
  flex-shrink: 0;
}

/* Tarjeta de ítem con el mismo redondeo y feedback que las cards de resultados */
.list-row {
  border-radius: 18px;
  background-color: #1E1A14;
  border: 1px solid #2A2318;
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}

.list-row:hover {
  transform: translateY(-2px);
  border-color: rgba(200, 150, 42, 0.5);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.4);
}

/* Resaltado apenas perceptible, no tapa la portada */
.list-row :deep(.v-card__overlay) {
  background-color: #C8962A;
}

.list-row:hover :deep(.v-card__overlay) {
  opacity: 0.05 !important;
}

.list-title {
  font-weight: 700;
  color: #EDE0CA;
  font-size: 1rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.list-sub {
  color: #A89878;
  font-size: 0.85rem;
  margin: 2px 0 0;
}

.list-meta {
  color: #8D6E47;
  font-size: 0.78rem;
  margin: 2px 0 0;
}
</style>
