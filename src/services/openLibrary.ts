import axios from 'axios'
import type { SearchResponse, WorkDetail, SearchType } from '@/types/book'

const api = axios.create({
  baseURL: 'https://openlibrary.org',
  timeout: 10000
})

const COVERS_BASE = 'https://covers.openlibrary.org/b/id'

export async function searchBooks(
  query: string,
  type: SearchType = 'q',
  limit = 20,
  page = 1
): Promise<SearchResponse> {
  const params: Record<string, string | number> = {
    limit,
    page,
    fields: 'key,title,author_name,first_publish_year,cover_i,isbn,subject,number_of_pages_median'
  }
  params[type] = query

  const { data } = await api.get<SearchResponse>('/search.json', { params })
  return data
}

export async function getWorkDetails(workId: string): Promise<WorkDetail> {
  const { data } = await api.get<WorkDetail>(`/works/${workId}.json`)
  return data
}

export function getCoverUrl(coverId: number, size: 'S' | 'M' | 'L' = 'M'): string {
  return `${COVERS_BASE}/${coverId}-${size}.jpg`
}

export function getWorkDescription(detail: WorkDetail): string {
  if (!detail.description) return ''
  if (typeof detail.description === 'string') return detail.description
  return detail.description.value
}
