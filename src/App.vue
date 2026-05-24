<script setup lang="ts">
import AppNavbar from '@/components/AppNavbar.vue'
</script>

<template>
  <v-app>
    <AppNavbar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
