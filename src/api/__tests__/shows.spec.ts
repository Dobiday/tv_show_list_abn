import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchAllShows, fetchShowById, fetchSearch } from '../shows'

const mockFetch = (body: unknown, ok = true, status = 200) => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(body),
  }))
}

beforeEach(() => {
  vi.unstubAllGlobals()
})

const signal = new AbortController().signal

describe('fetchAllShows', () => {
  it('calls the correct URL with default page 0', async () => {
    const shows = [{ id: 1, name: 'Under the Dome' }]
    mockFetch(shows)

    const result = await fetchAllShows(signal)

    expect(fetch).toHaveBeenCalledWith('https://api.tvmaze.com/shows?page=0', { signal })
    expect(result).toEqual(shows)
  })

  it('calls the correct URL with given page', async () => {
    const shows = [{ id: 250, name: 'Show 250' }]
    mockFetch(shows)

    const result = await fetchAllShows(signal, 3)

    expect(fetch).toHaveBeenCalledWith('https://api.tvmaze.com/shows?page=3', { signal })
    expect(result).toEqual(shows)
  })

  it('returns empty array on 404 (no more pages)', async () => {
    mockFetch(null, false, 404)

    const result = await fetchAllShows(signal, 999)

    expect(result).toEqual([])
  })

  it('throws on other non-ok responses', async () => {
    mockFetch(null, false, 500)

    await expect(fetchAllShows(signal)).rejects.toThrow('HTTP 500')
  })
})

describe('fetchShowById', () => {
  it('calls the correct URL with the id', async () => {
    const show = { id: 42, name: 'Stargate SG-1' }
    mockFetch(show)

    const result = await fetchShowById(42, signal)

    expect(fetch).toHaveBeenCalledWith('https://api.tvmaze.com/shows/42', { signal })
    expect(result).toEqual(show)
  })

  it('throws on non-ok response', async () => {
    mockFetch(null, false, 404)

    await expect(fetchShowById(999, signal)).rejects.toThrow('HTTP 404')
  })
})

describe('fetchSearch', () => {
  it('encodes the query and calls the correct URL', async () => {
    const results = [{ score: 0.9, show: { id: 1, name: 'Under the Dome' } }]
    mockFetch(results)

    const result = await fetchSearch('under the dome', signal)

    expect(fetch).toHaveBeenCalledWith(
      'https://api.tvmaze.com/search/shows?q=under%20the%20dome',
      { signal }
    )
    expect(result).toEqual(results)
  })

  it('throws on non-ok response', async () => {
    mockFetch(null, false, 503)

    await expect(fetchSearch('test', signal)).rejects.toThrow('HTTP 503')
  })
})
