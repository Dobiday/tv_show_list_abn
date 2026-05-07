import { computed, toRef, type MaybeRef } from 'vue'
import { useFetch } from './useFetch'

type FactoryOptions<P, T> = {
  key: (params: P) => string | null
  fetcher: (params: P, signal: AbortSignal) => Promise<T>
}

export function createQueryFactory(baseOptions = {}) {
  return function createQuery<P, T>(options: FactoryOptions<P, T>) {
    return function useQuery(params: MaybeRef<P>) {
      const paramsRef = toRef(params)
      const key = computed(() => options.key(paramsRef.value))

      return useFetch<T>(
        key,
        async (_, signal) => {
          return options.fetcher(paramsRef.value, signal)
        },
        baseOptions
      )
    }
  }
}