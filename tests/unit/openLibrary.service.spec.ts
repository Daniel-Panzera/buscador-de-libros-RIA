import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { SearchType } from '@/types/book'

// Mock de la instancia de axios usada por el servicio.
// vi.hoisted garantiza que mockGet exista antes de que el servicio
// llame a axios.create() al importarse.
const { mockGet } = vi.hoisted(() => ({ mockGet: vi.fn() }))
vi.mock('axios', () => ({
  default: {
    create: () => ({ get: mockGet })
  }
}))

import { searchBooks, getWorkDetails } from '@/services/openLibrary'

describe('openLibrary service — unit (axios mockeado)', () => {
  beforeEach(() => {
    mockGet.mockReset()
  })

  it('searchBooks usa "q" como tipo por defecto', async () => {
    mockGet.mockResolvedValue({ data: { numFound: 0, docs: [] } })

    await searchBooks('dune')

    const [url, config] = mockGet.mock.calls[0]
    expect(url).toBe('/search.json')
    expect(config.params.q).toBe('dune')
  })

  it.each<SearchType>(['q', 'title', 'author', 'isbn'])(
    'searchBooks arma el parámetro correcto para el tipo "%s"',
    async (type) => {
      mockGet.mockResolvedValue({ data: { numFound: 0, docs: [] } })

      await searchBooks('tolkien', type)

      const [, config] = mockGet.mock.calls[0]
      expect(config.params[type]).toBe('tolkien')
    }
  )

  it('searchBooks pasa limit y page a la request', async () => {
    mockGet.mockResolvedValue({ data: { numFound: 0, docs: [] } })

    await searchBooks('algo', 'title', 48, 3)

    const [, config] = mockGet.mock.calls[0]
    expect(config.params.limit).toBe(48)
    expect(config.params.page).toBe(3)
  })

  it('searchBooks devuelve los datos de la respuesta', async () => {
    const fake = { numFound: 2, docs: [{ key: '/works/OL1W', title: 'A' }] }
    mockGet.mockResolvedValue({ data: fake })

    const result = await searchBooks('x', 'title')

    expect(result).toEqual(fake)
  })

  it('getWorkDetails pide la URL correcta y devuelve los datos', async () => {
    const fake = { key: '/works/OL45804W', title: 'Fantastic Mr Fox' }
    mockGet.mockResolvedValue({ data: fake })

    const result = await getWorkDetails('OL45804W')

    expect(mockGet).toHaveBeenCalledWith('/works/OL45804W.json')
    expect(result).toEqual(fake)
  })
})
