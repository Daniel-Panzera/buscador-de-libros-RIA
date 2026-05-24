import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BookDoc } from '@/types/book'

export const useSelectedBookStore = defineStore('selectedBook', () => {
  const book = ref<BookDoc | null>(null)

  function setBook(b: BookDoc): void {
    book.value = b
  }

  function clear(): void {
    book.value = null
  }

  return { book, setBook, clear }
})
