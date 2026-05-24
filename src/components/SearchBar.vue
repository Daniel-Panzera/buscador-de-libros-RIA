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
  const trimmed = query.value.trim()
  if (!trimmed) return
  emit('search', { query: trimmed, type: searchType.value })
}
</script>

<template>
  <v-form @submit.prevent="handleSubmit">
    <v-row align="center" dense>
      <v-col cols="12" sm="3">
        <v-select
          v-model="searchType"
          :items="searchOptions"
          item-title="title"
          item-value="value"
          label="Buscar por"
          variant="outlined"
          density="comfortable"
          hide-details
          bg-color="surface"
        />
      </v-col>

      <v-col cols="12" sm="6">
        <v-text-field
          v-model="query"
          label="Ingresá el término de búsqueda..."
          variant="outlined"
          density="comfortable"
          hide-details
          bg-color="surface"
          clearable
          @keyup.enter="handleSubmit"
        />
      </v-col>

      <v-col cols="12" sm="3">
        <v-btn
          type="submit"
          color="primary"
          size="large"
          block
          :disabled="!query.trim()"
        >
          Buscar
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
