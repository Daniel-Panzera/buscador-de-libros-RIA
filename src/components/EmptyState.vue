<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  description?: string
}>()
</script>

<template>
  <div class="d-flex flex-column align-center justify-center py-16 text-center">
    <v-icon :icon="icon" size="80" color="grey-lighten-1" class="mb-4" />
    <p class="text-h6 text-grey-darken-1 mb-2">{{ title }}</p>
    <p v-if="description" class="text-body-2 text-grey">{{ description }}</p>
    <slot />
  </div>
</template>
