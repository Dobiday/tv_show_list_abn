import { ref, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import type { Show } from '../types'
import { fetchAllShows } from '../api/shows'

export function useShowsPaginated() {
    const shows = ref<Show[]>([])
    const loading = ref(false)
    const loadingMore = ref(false)
    const error = ref<any>(null)
    const allPagesFetched = ref(false)

    let page = 0
    let controller: AbortController | null = null

    async function fetchPage(isInitial: boolean) {
        if (allPagesFetched.value) return

        if (controller) controller.abort()
        controller = new AbortController()

        if (isInitial) {
            loading.value = true
        } else {
            loadingMore.value = true
        }
        error.value = null

        try {
            const result = await fetchAllShows(controller.signal, page)

            if (result.length === 0) {
                allPagesFetched.value = true
            } else {
                shows.value = [...shows.value, ...result]
            }
        } catch (e: any) {
            if (e.name !== 'AbortError') {
                error.value = e
            }
        } finally {
            loading.value = false
            loadingMore.value = false
        }
    }

    function loadMore() {
        if (loadingMore.value || allPagesFetched.value) return
        page++
        return fetchPage(false)
    }

    onMounted(() => fetchPage(true))

    if (getCurrentInstance()) {
        onUnmounted(() => {
            if (controller) controller.abort()
        })
    }

    return {
        shows,
        loading,
        loadingMore,
        error,
        allPagesFetched,
        loadMore,
    }
}
