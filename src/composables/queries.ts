import { createQueryFactory } from './createQueryFactory'
import type { Show, SearchResult } from '../types'
import { fetchAllShows, fetchShowById, fetchSearch } from '../api/shows'

const createQuery = createQueryFactory({
  cacheTime: 10_000,
  retry: 1
})

export const useShows = createQuery<void, Show[]>({
  key: () => 'shows',
  fetcher: (_, signal) => fetchAllShows(signal)
});

export const useShow = createQuery<string | null, Show>({
  key: (id) => (id ? `show-${id}` : null),
  fetcher: (id, signal) => fetchShowById(Number(id), signal)
});

export const useSearchShow = createQuery<string | null, SearchResult[]>({
  key: (query) => (query ? `search-${query}` : null),
  fetcher: (query, signal) => fetchSearch(query!, signal)
});