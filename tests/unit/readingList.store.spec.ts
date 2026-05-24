import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useReadingListStore } from '@/stores/readingList'
import type { ReadingListItem } from '@/types/book'

const sampleBook: ReadingListItem = {
  key: '/works/OL45804W',
  title: 'Fantastic Mr Fox',
  author: 'Roald Dahl',
  cover_i: 8739161,
  addedAt: '2024-01-01T00:00:00.000Z'
}

describe('useReadingListStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('comienza vacío', () => {
    const store = useReadingListStore()
    expect(store.items).toHaveLength(0)
    expect(store.count).toBe(0)
  })

  it('agrega un libro correctamente', () => {
    const store = useReadingListStore()
    store.addBook(sampleBook)

    expect(store.items).toHaveLength(1)
    expect(store.items[0].title).toBe('Fantastic Mr Fox')
    expect(store.count).toBe(1)
  })

  it('no agrega duplicados', () => {
    const store = useReadingListStore()
    store.addBook(sampleBook)
    store.addBook(sampleBook)

    expect(store.items).toHaveLength(1)
  })

  it('detecta si un libro está en la lista', () => {
    const store = useReadingListStore()
    expect(store.isInList(sampleBook.key)).toBe(false)

    store.addBook(sampleBook)
    expect(store.isInList(sampleBook.key)).toBe(true)
  })

  it('elimina un libro correctamente', () => {
    const store = useReadingListStore()
    store.addBook(sampleBook)
    store.removeBook(sampleBook.key)

    expect(store.items).toHaveLength(0)
    expect(store.isInList(sampleBook.key)).toBe(false)
  })

  it('persiste en localStorage al agregar', () => {
    const store = useReadingListStore()
    store.addBook(sampleBook)

    const stored = JSON.parse(localStorage.getItem('bookfinder-reading-list') ?? '[]')
    expect(stored).toHaveLength(1)
    expect(stored[0].key).toBe(sampleBook.key)
  })

  it('persiste en localStorage al eliminar', () => {
    const store = useReadingListStore()
    store.addBook(sampleBook)
    store.removeBook(sampleBook.key)

    const stored = JSON.parse(localStorage.getItem('bookfinder-reading-list') ?? '[]')
    expect(stored).toHaveLength(0)
  })
})
