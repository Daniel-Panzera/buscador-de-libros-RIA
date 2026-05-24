import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ReadingListItem } from '@/types/book'

const STORAGE_KEY = 'bookfinder-reading-list'

function loadFromStorage(): ReadingListItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ReadingListItem[]) : []
  } catch {
    return []
  }
}

function persist(items: ReadingListItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export const useReadingListStore = defineStore('readingList', () => {
  const items = ref<ReadingListItem[]>(loadFromStorage())

  const count = computed(() => items.value.length)

  function isInList(key: string): boolean {
    return items.value.some(item => item.key === key)
  }

  function addBook(book: ReadingListItem): void {
    if (isInList(book.key)) return
    items.value.push({ ...book, addedAt: new Date().toISOString() })
    persist(items.value)
  }

  function removeBook(key: string): void {
    items.value = items.value.filter(item => item.key !== key)
    persist(items.value)
  }

  return { items, count, isInList, addBook, removeBook }
})
