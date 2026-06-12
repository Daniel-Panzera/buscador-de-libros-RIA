<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  description?: string
}>()
</script>

<template>
  <div class="empty-state d-flex flex-column align-center justify-center py-16 text-center">
    <div class="empty-icon mb-4">
      <v-icon :icon="icon" size="64" color="primary" />
    </div>
    <p class="text-h6 empty-title mb-2">{{ title }}</p>
    <p v-if="description" class="text-body-2 empty-desc">{{ description }}</p>
    <slot />
  </div>
</template>

<style scoped>
/* Ícono dentro de un círculo suave, coherente con el tema "library" */
.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background-color: rgba(200, 150, 42, 0.1);
  border: 1px solid rgba(200, 150, 42, 0.25);
}

.empty-title {
  color: #EDE0CA;
  font-weight: 700;
}

.empty-desc {
  color: #A89878;
  max-width: 380px;
}
</style>
