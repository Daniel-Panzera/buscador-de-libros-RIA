export interface BookDoc {
  key: string
  title: string
  author_name?: string[]
  first_publish_year?: number
  cover_i?: number
  isbn?: string[]
  subject?: string[]
  number_of_pages_median?: number
  language?: string[]
  publisher?: string[]
}

export interface SearchResponse {
  numFound: number
  start: number
  docs: BookDoc[]
}

export interface WorkDetail {
  key: string
  title: string
  description?: string | { type: string; value: string }
  covers?: number[]
  subjects?: string[]
  first_publish_date?: string
}

export interface ReadingListItem {
  key: string
  title: string
  author: string
  cover_i?: number
  addedAt: string
}

export type SearchType = 'q' | 'title' | 'author' | 'isbn'
