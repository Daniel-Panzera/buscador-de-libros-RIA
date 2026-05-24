<script setup lang="ts">
import { computed } from 'vue'
import { useReadingListStore } from '@/stores/readingList'

const readingListStore = useReadingListStore()
const count = computed(() => readingListStore.count)
</script>

<template>
  <v-app-bar elevation="2" color="primary">
    <template #prepend>
      <v-icon icon="mdi-book-open-variant" class="ml-3" size="28" />
    </template>

    <v-app-bar-title>
      <router-link to="/" class="text-white text-decoration-none font-weight-bold">
        BookFinder
      </router-link>
    </v-app-bar-title>

    <template #append>
      <v-btn :to="{ name: 'home' }" variant="text" prepend-icon="mdi-magnify" class="text-white">
        Buscar
      </v-btn>

      <v-btn :to="{ name: 'reading-list' }" variant="text" class="text-white">
        <v-badge
          :content="count"
          :model-value="count > 0"
          color="secondary"
          offset-x="-4"
          offset-y="-4"
        >
          <v-icon icon="mdi-bookshelf" />
        </v-badge>
        <span class="ml-2">Mi Lista</span>
      </v-btn>
    </template>
  </v-app-bar>
</template>
