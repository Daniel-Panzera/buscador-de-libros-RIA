import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/book/:id',
      name: 'book-detail',
      component: () => import('@/views/BookDetailView.vue')
    },
    {
      path: '/reading-list',
      name: 'reading-list',
      component: () => import('@/views/ReadingListView.vue')
    }
  ],
  scrollBehavior: () => ({ top: 0 })
})

export default router
