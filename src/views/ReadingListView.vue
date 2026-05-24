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
  return item.cover_i ? getCoverUrl(item.cover_i, 'S') : null
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
      <h1 class="text-h5 font-weight-bold">Mi Lista de Lectura</h1>
      <v-chip v-if="items.length > 0" class="ml-3" color="primary" size="small">
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
        prepend-icon="mdi-magnify"
        class="mt-4"
        @click="router.push({ name: 'home' })"
      >
        Ir al buscador
      </v-btn>
    </EmptyState>

    <!-- Lista de libros -->
    <v-list v-else lines="two" class="pa-0">
      <v-list-item
        v-for="item in items"
        :key="item.key"
        class="mb-3 rounded-lg border"
        elevation="1"
      >
        <template #prepend>
          <v-avatar
            size="56"
            rounded="sm"
            class="mr-3"
          >
            <v-img v-if="coverUrl(item)" :src="coverUrl(item)!" :alt="item.title" cover />
            <v-icon v-else icon="mdi-book-outline" size="32" color="grey" />
          </v-avatar>
        </template>

        <v-list-item-title class="font-weight-bold">{{ item.title }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ item.author }} · Agregado el {{ formatDate(item.addedAt) }}
        </v-list-item-subtitle>

        <template #append>
          <v-btn
            variant="text"
            icon="mdi-eye"
            size="small"
            title="Ver detalle"
            class="mr-1"
            @click="viewDetail(item)"
          />
          <v-btn
            variant="text"
            icon="mdi-bookmark-remove"
            size="small"
            color="error"
            title="Quitar de la lista"
            @click="removeBook(item.key)"
          />
        </template>
      </v-list-item>
    </v-list>
  </v-container>
</template>
