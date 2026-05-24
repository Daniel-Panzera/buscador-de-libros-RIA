import { describe, it, expect } from 'vitest'
import { getCoverUrl, getWorkDescription } from '@/services/openLibrary'
import type { WorkDetail } from '@/types/book'

describe('openLibrary service — funciones puras', () => {
  it('getCoverUrl genera la URL correcta con tamaño especificado', () => {
    const url = getCoverUrl(8739161, 'M')
    expect(url).toBe('https://covers.openlibrary.org/b/id/8739161-M.jpg')
  })

  it('getCoverUrl usa tamaño M por defecto', () => {
    const url = getCoverUrl(12345)
    expect(url).toContain('-M.jpg')
  })

  it('getCoverUrl soporta tamaños S y L', () => {
    expect(getCoverUrl(1, 'S')).toContain('-S.jpg')
    expect(getCoverUrl(1, 'L')).toContain('-L.jpg')
  })

  it('getWorkDescription extrae texto cuando description es string', () => {
    const detail: WorkDetail = {
      key: '/works/OL123W',
      title: 'Test',
      description: 'Una descripción directa'
    }
    expect(getWorkDescription(detail)).toBe('Una descripción directa')
  })

  it('getWorkDescription extrae texto cuando description es objeto', () => {
    const detail: WorkDetail = {
      key: '/works/OL123W',
      title: 'Test',
      description: { type: '/type/text', value: 'Descripción como objeto' }
    }
    expect(getWorkDescription(detail)).toBe('Descripción como objeto')
  })

  it('getWorkDescription retorna string vacío cuando no hay description', () => {
    const detail: WorkDetail = { key: '/works/OL123W', title: 'Test' }
    expect(getWorkDescription(detail)).toBe('')
  })
})

describe('searchBooks — integración con OpenLibrary API', () => {
  it('retorna resultados con estructura válida para búsqueda por título', async () => {
    const { searchBooks } = await import('@/services/openLibrary')
    const result = await searchBooks('Harry Potter', 'title', 5)

    expect(result.numFound).toBeGreaterThan(0)
    expect(Array.isArray(result.docs)).toBe(true)
    expect(result.docs.length).toBeGreaterThan(0)
    expect(result.docs[0]).toHaveProperty('key')
    expect(result.docs[0]).toHaveProperty('title')
  }, 15000)
})
