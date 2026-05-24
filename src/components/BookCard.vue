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
  <v-card height="100%" class="d-flex flex-column" elevation="2">
    <v-img
      :src="coverUrl ?? undefined"
      height="220"
      cover
      :alt="book.title"
    >
      <template #error>
        <div class="d-flex align-center justify-center fill-height bg-grey-lighten-3">
          <v-icon icon="mdi-book-outline" size="64" color="grey-lighten-1" />
        </div>
      </template>
      <template v-if="!coverUrl" #default>
        <div class="d-flex align-center justify-center fill-height bg-grey-lighten-3">
          <v-icon icon="mdi-book-outline" size="64" color="grey-lighten-1" />
        </div>
      </template>
    </v-img>

    <v-card-title class="text-subtitle-1 font-weight-bold line-clamp-2 pb-0">
      {{ book.title }}
    </v-card-title>

    <v-card-subtitle class="pb-0">{{ authorDisplay }}</v-card-subtitle>

    <v-card-text class="flex-grow-1 pt-2">
      <v-chip
        v-if="book.first_publish_year"
        size="x-small"
        prepend-icon="mdi-calendar"
        class="mr-1"
      >
        {{ book.first_publish_year }}
      </v-chip>
      <v-chip
        v-if="book.number_of_pages_median"
        size="x-small"
        prepend-icon="mdi-file-document-outline"
      >
        {{ book.number_of_pages_median }} págs.
      </v-chip>
    </v-card-text>

    <v-card-actions>
      <v-btn
        variant="tonal"
        size="small"
        prepend-icon="mdi-eye"
        @click="navigateToDetail"
      >
        Detalle
      </v-btn>
      <v-spacer />
      <v-btn
        :color="inList ? 'error' : 'primary'"
        variant="tonal"
        size="small"
        :icon="inList ? 'mdi-bookmark-remove' : 'mdi-bookmark-plus'"
        :title="inList ? 'Quitar de mi lista' : 'Agregar a mi lista'"
        @click="toggleReadingList"
      />
    </v-card-actions>
  </v-card>
</template>
