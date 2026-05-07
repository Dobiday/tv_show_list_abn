import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useFetch } from '../useFetch'

// useFetch uses a module-level cache — clear it between tests by resetting the module
beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

const makeKey = (k: string | null) => ref(k)

describe('useFetch', () => {
  it('calls fetcher and sets data on success', async () => {
    const fetcher = vi.fn().mockResolvedValue({ id: 1 })
    const key = makeKey('test-key')
    const { data, loading, error } = useFetch(key, fetcher)

    await nextTick()
    await nextTick()

    expect(fetcher).toHaveBeenCalledWith('test-key', expect.any(AbortSignal))
    expect(data.value).toEqual({ id: 1 })
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('sets error when fetcher throws', async () => {
    const err = new Error('network error')
    const fetcher = vi.fn().mockRejectedValue(err)
    const key = makeKey('error-key')
    const { data, loading, error } = useFetch(key, fetcher)

    await nextTick()
    await nextTick()

    expect(data.value).toBeNull()
    expect(error.value).toBe(err)
    expect(loading.value).toBe(false)
  })

  it('does not fetch when key is null', async () => {
    const fetcher = vi.fn()
    const key = makeKey(null)
    useFetch(key, fetcher)

    await nextTick()

    expect(fetcher).not.toHaveBeenCalled()
  })

  it('retries the specified number of times on failure', async () => {
    const err = new Error('fail')
    const fetcher = vi.fn().mockRejectedValue(err)
    const key = makeKey('retry-key')

    useFetch(key, fetcher, { retry: 2, retryDelay: 100, cacheTime: 0 })

    await nextTick()
    // advance timers for retries
    await vi.runAllTimersAsync()

    // initial call + 2 retries = 3
    expect(fetcher).toHaveBeenCalledTimes(3)
  })

  it('applies transform to result', async () => {
    const fetcher = vi.fn().mockResolvedValue([1, 2, 3])
    const key = makeKey('transform-key')
    const { data } = useFetch(key, fetcher, {
      transform: (d) => d.length,
      cacheTime: 0,
    })

    await nextTick()
    await nextTick()

    expect(data.value).toBe(3)
  })
})
