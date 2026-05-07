import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHashHistory } from 'vue-router'

vi.mock('../../composables/queries', () => ({
  useSearchShow: vi.fn(() => ({ data: ref(null), loading: ref(false), error: ref(null) })),
}))

import { ref } from 'vue'
import SearchBar from '../SearchBar.vue'
import { useSearchShow } from '../../composables/queries'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: { template: '<div/>' } },
    { path: '/show/:id', component: { template: '<div/>' } },
  ],
})

const mountBar = () => mount(SearchBar, { global: { plugins: [router] } })

beforeEach(() => {
  vi.clearAllMocks()
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('SearchBar', () => {
  it('renders the input', () => {
    const wrapper = mountBar()
    expect(wrapper.find('.search-input').exists()).toBe(true)
  })

  it('does not open dropdown when input is empty', async () => {
    const wrapper = mountBar()
    await wrapper.find('.search-input').setValue('')
    expect(wrapper.find('.dropdown').exists()).toBe(false)
  })

  it('opens dropdown after debounce when query is typed', async () => {
    vi.mocked(useSearchShow).mockReturnValue({
      data: ref([{ score: 0.9, show: { id: 1, name: 'Test Show', image: null, rating: { average: null } } as any }]),
      loading: ref(false),
      error: ref(null),
    })

    const wrapper = mountBar()
    await wrapper.find('.search-input').setValue('test')
    expect(wrapper.find('.dropdown').exists()).toBe(false) // before debounce

    vi.advanceTimersByTime(500)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.dropdown').exists()).toBe(true)
  })

  it('passes debounced query to useSearchShow', async () => {
    mountBar()
    // Initial render passes null
    expect(useSearchShow).toHaveBeenCalledWith(expect.objectContaining({ value: null }))
  })
})
