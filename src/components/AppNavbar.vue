<script setup lang="ts">
import { computed } from 'vue'
import { useReadingListStore } from '@/stores/readingList'

const readingListStore = useReadingListStore()
const count = computed(() => readingListStore.count)
</script>

<template>
  <v-app-bar elevation="0" style="border-bottom: 1px solid #3D3020;">
    <template #prepend>
      <v-icon icon="mdi-book-open-variant" class="ml-3" size="28" color="primary" />
    </template>

    <v-app-bar-title>
      <router-link to="/" class="app-title font-weight-bold" style="color: #C8962A; letter-spacing: 0.05em;">
        BookFinder
      </router-link>
    </v-app-bar-title>

    <template #append>
      <v-btn :to="{ name: 'reading-list' }" variant="text" class="nav-btn">
        <span v-if="count > 0" class="count-box">{{ count }}</span>
        <v-icon icon="mdi-bookshelf" />
        <span class="nav-label ml-2">Mi Lista</span>
      </v-btn>
    </template>
  </v-app-bar>
</template>

<style scoped>
/* Título principal: sin subrayado y con más presencia */
.app-title {
  font-size: 1.75rem;
  text-decoration: none !important;
}

.app-title:hover,
.app-title:focus {
  text-decoration: none !important;
}

/* Botón más ancho para que el contador entre cómodo sin solapar el contenido */
.nav-btn {
  min-width: 132px;
  padding-inline: 16px !important;
}

/* Garantiza que número, ícono y texto queden centrados verticalmente */
.nav-btn :deep(.v-btn__content) {
  align-items: center;
}

.nav-label {
  line-height: 1;
}

/* Recuadro del contador, a la izquierda dentro del botón */
.count-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  /* Corre el número hacia la izquierda y le da aire antes del ícono */
  margin: 0 10px 0 -6px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 700;
  line-height: 1;
  background-color: #C8962A;
  color: #12100C;
}

/* En estado seleccionado (fondo crema) se invierte para seguir resaltando */
.nav-btn.v-btn--active .count-box,
.nav-btn.router-link-active .count-box {
  background-color: #12100C;
  color: #C8962A;
}

/* Estado seleccionado (estás en esa página): crema sólido + texto negro */
.nav-btn.v-btn--active,
.nav-btn.router-link-active {
  background-color: #C8962A !important;
}

.nav-btn.v-btn--active .nav-label,
.nav-btn.router-link-active .nav-label,
.nav-btn.v-btn--active :deep(.v-icon),
.nav-btn.router-link-active :deep(.v-icon) {
  color: #12100C !important;
}

/* En seleccionado el crema ya es sólido: anula el overlay para que quede limpio */
.nav-btn.v-btn--active :deep(.v-btn__overlay),
.nav-btn.router-link-active :deep(.v-btn__overlay) {
  opacity: 0 !important;
}

/* No seleccionado: hover/focus/click con crema translúcido, sin tocar el texto */
.nav-btn:not(.v-btn--active):not(.router-link-active) :deep(.v-btn__overlay) {
  background-color: #C8962A !important;
}

.nav-btn:not(.v-btn--active):not(.router-link-active):hover :deep(.v-btn__overlay),
.nav-btn:not(.v-btn--active):not(.router-link-active):focus-visible :deep(.v-btn__overlay),
.nav-btn:not(.v-btn--active):not(.router-link-active):active :deep(.v-btn__overlay) {
  opacity: 0.12 !important;
}

/* Suaviza el flash del ripple al hacer clic */
.nav-btn :deep(.v-ripple__animation) {
  color: #C8962A !important;
  opacity: 0.1 !important;
}
</style>
