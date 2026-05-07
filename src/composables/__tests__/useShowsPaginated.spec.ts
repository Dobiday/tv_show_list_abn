import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { useShowsPaginated } from '../useShowsPaginated'

vi.mock('../../api/shows', () => ({
  fetchAllShows: vi.fn(),
}))

import { fetchAllShows } from '../../api/shows'

// Helper: mount the composable inside a real component so onMounted fires
function mountComposable() {
  let result: ReturnType<typeof useShowsPaginated>

  const Comp = defineComponent({
    setup() {
      result = useShowsPaginated()
      return () => null
    },
  })

  const wrapper = mount(Comp)
  return { result: result!, wrapper }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useShowsPaginated', () => {
  it('fetches page 0 on mount', async () => {
    vi.mocked(fetchAllShows).mockResolvedValue([{ id: 1, name: 'A' } as any])
    const { result } = mountComposable()

    await nextTick()
    await nextTick()

    expect(fetchAllShows).toHaveBeenCalledWith(expect.any(AbortSignal), 0)
    expect(result.shows.value).toHaveLength(1)
    expect(result.loading.value).toBe(false)
  })

  it('appends shows on loadMore', async () => {
    vi.mocked(fetchAllShows)
      .mockResolvedValueOnce([{ id: 1, name: 'A' } as any])
      .mockResolvedValueOnce([{ id: 2, name: 'B' } as any])

    const { result } = mountComposable()

    await nextTick()
    await nextTick()

    await result.loadMore()

    expect(fetchAllShows).toHaveBeenCalledTimes(2)
    expect(fetchAllShows).toHaveBeenLastCalledWith(expect.any(AbortSignal), 1)
    expect(result.shows.value).toHaveLength(2)
  })

  it('sets allPagesFetched when API returns empty array', async () => {
    vi.mocked(fetchAllShows)
      .mockResolvedValueOnce([{ id: 1, name: 'A' } as any])
      .mockResolvedValueOnce([])

    const { result } = mountComposable()

    await nextTick()
    await nextTick()

    await result.loadMore()

    expect(result.allPagesFetched.value).toBe(true)
    expect(result.shows.value).toHaveLength(1) // didn't add empty
  })

  it('does nothing on loadMore if already loading', async () => {
    vi.mocked(fetchAllShows).mockResolvedValue([{ id: 1 } as any])

    const { result } = mountComposable()

    await nextTick()
    await nextTick()

    // Simulate loadingMore by calling before previous finishes
    let resolve: Function
    vi.mocked(fetchAllShows).mockReturnValue(new Promise(r => { resolve = r }))

    result.loadMore()
    result.loadMore() // should be ignored

    expect(fetchAllShows).toHaveBeenCalledTimes(2) // initial + one loadMore
  })

  it('does nothing on loadMore if allPagesFetched', async () => {
    vi.mocked(fetchAllShows)
      .mockResolvedValueOnce([{ id: 1 } as any])
      .mockResolvedValueOnce([])

    const { result } = mountComposable()

    await nextTick()
    await nextTick()

    await result.loadMore() // sets allPagesFetched

    vi.mocked(fetchAllShows).mockClear()
    result.loadMore() // should be ignored

    expect(fetchAllShows).not.toHaveBeenCalled()
  })

  it('sets error on fetch failure', async () => {
    vi.mocked(fetchAllShows).mockRejectedValue(new Error('Network error'))

    const { result } = mountComposable()

    await nextTick()
    await nextTick()

    expect(result.error.value).toBeInstanceOf(Error)
    expect(result.loading.value).toBe(false)
  })
})
