import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

// Mock the API module so queries don't hit the network
vi.mock('../../api/shows', () => ({
  fetchAllShows: vi.fn().mockResolvedValue([]),
  fetchShowById: vi.fn().mockResolvedValue({ id: 1 }),
  fetchSearch: vi.fn().mockResolvedValue([]),
}))

import { fetchAllShows, fetchShowById, fetchSearch } from '../../api/shows'
import { useShows, useShow, useSearchShow } from '../queries'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useShows', () => {
  it('calls fetchAllShows with signal', async () => {
    useShows(undefined)
    await Promise.resolve()
    expect(fetchAllShows).toHaveBeenCalledWith(expect.any(AbortSignal))
  })
})

describe('useShow', () => {
  it('calls fetchShowById with numeric id', async () => {
    useShow(ref('42'))
    await Promise.resolve()
    expect(fetchShowById).toHaveBeenCalledWith(42, expect.any(AbortSignal))
  })

  it('does not fetch when id is null', async () => {
    useShow(ref(null))
    await Promise.resolve()
    expect(fetchShowById).not.toHaveBeenCalled()
  })
})

describe('useSearchShow', () => {
  it('calls fetchSearch with the query', async () => {
    useSearchShow(ref('stargate'))
    await Promise.resolve()
    expect(fetchSearch).toHaveBeenCalledWith('stargate', expect.any(AbortSignal))
  })

  it('does not fetch when query is null', async () => {
    useSearchShow(ref(null))
    await Promise.resolve()
    expect(fetchSearch).not.toHaveBeenCalled()
  })
})
