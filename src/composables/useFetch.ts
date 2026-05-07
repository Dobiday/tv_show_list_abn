import { ref, watch, onUnmounted, getCurrentInstance, type Ref } from 'vue'

type FetchOptions<T> = {
  immediate?: boolean
  cacheTime?: number
  retry?: number
  retryDelay?: number
  transform?: (data: any) => T
}

type CacheEntry<T> = {
  data: T
  timestamp: number
  promise?: Promise<T>
}

const cache = new Map<string, CacheEntry<any>>()

export function useFetch<T = any>(
  key: Ref<string | null>,
  fetcher: (key: string, signal: AbortSignal) => Promise<any>,
  options: FetchOptions<T> = {}
) {
  const {
    immediate = true,
    cacheTime = 5_000,
    retry = 0,
    retryDelay = 500,
    transform
  } = options

  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<any>(null)

  let controller: AbortController | null = null

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

  const execute = async (k: string): Promise<T | null> => {
    if (controller) controller.abort();
    controller = new AbortController();

    const now = Date.now();
    const cached = cache.get(k);

    if (cached && now - cached.timestamp < cacheTime) {
      data.value = cached.data;
      return cached.data;
    }

    if (cached?.promise) {
      data.value = await cached.promise;
      return data.value;
    }

    loading.value = true;
    error.value = null;

    let attempts = 0;

    const run = async (): Promise<T> => {
      try {
        const result = await fetcher(k, controller!.signal)
        const finalData = transform ? transform(result) : result

        cache.set(k, {
          data: finalData,
          timestamp: Date.now()
        })

        return finalData
      } catch (e: any) {
        if (e.name === 'AbortError') throw e

        if (attempts < retry) {
          attempts++;
          await sleep(retryDelay);
          return run();
        }

        throw e;
      }
    }

    const promise = run();
    cache.set(k, {
      data: cached?.data,
      timestamp: now,
      promise
    });

    try {
      const result = await promise;
      data.value = result;
      return result;
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        error.value = e;
      }
      return null;
    } finally {
      loading.value = false;
      
      const entry = cache.get(k)
      if (entry) delete entry.promise
    }
  }

  const refetch = () => {
    if (key.value) return execute(key.value)
  }

  watch(
    key,
    (k, _, onCleanup) => {
      if (!k) return

      const localController = new AbortController()
      controller = localController

      execute(k)

      onCleanup(() => {
        localController.abort()
      })
    },
    { immediate }
  )

  if (getCurrentInstance()) {
    onUnmounted(() => {
      if (controller) controller.abort()
    })
  }

  return {
    data,
    loading,
    error,
    refetch
  }
}