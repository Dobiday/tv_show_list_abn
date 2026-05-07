import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { mockShow } from '../../__fixtures__/show'

vi.mock('../../composables/useShowsPaginated', () => ({
  useShowsPaginated: vi.fn(),
}))
// SearchBar uses useSearchShow — stub it to avoid side effects
vi.mock('../../components/SearchBar.vue', () => ({
  default: { template: '<div class="search-bar-stub"/>' },
}))

import { useShowsPaginated } from '../../composables/useShowsPaginated'
import HomePage from '../HomePage.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/show/:id', component: { template: '<div/>' } },
  ],
})

const mockPaginated = (overrides: Partial<ReturnType<typeof useShowsPaginated>> = {}) => {
  const defaults = {
    shows: ref([]),
    loading: ref(false),
    loadingMore: ref(false),
    error: ref(null),
    allPagesFetched: ref(false),
    loadMore: vi.fn(),
  }
  vi.mocked(useShowsPaginated).mockReturnValue({ ...defaults, ...overrides } as any)
}

const mountHome = () => mount(HomePage, { global: { plugins: [router] } })

beforeEach(() => {
  vi.clearAllMocks()
})

describe('HomePage', () => {
  it('shows loading state', () => {
    mockPaginated({ loading: ref(true) })
    const wrapper = mountHome()
    expect(wrapper.find('.home__status').text()).toBe('Loading...')
  })

  it('shows error state', () => {
    mockPaginated({ error: ref(new Error('fail')) })
    const wrapper = mountHome()
    expect(wrapper.find('.home__status--error').exists()).toBe(true)
  })

  it('shows "No shows found" when list is empty', () => {
    mockPaginated()
    const wrapper = mountHome()
    expect(wrapper.find('.home__status').text()).toBe('No shows found.')
  })

  it('renders genre sections from shows', () => {
    mockPaginated({ shows: ref([mockShow]) })
    const wrapper = mountHome()
    const titles = wrapper.findAll('.genre-section__title').map(e => e.text())
    expect(titles).toContain('Drama')
    expect(titles).toContain('Science-Fiction')
  })

  it('switches to grid view on Grid button click', async () => {
    mockPaginated({ shows: ref([mockShow]) })
    const wrapper = mountHome()
    const gridBtn = wrapper.findAll('.view-btn').find(b => b.text() === 'Grid')!
    await gridBtn.trigger('click')
    expect(wrapper.find('.genre-section__grid').exists()).toBe(true)
  })

  it('switches to list view on List button click', async () => {
    mockPaginated({ shows: ref([mockShow]) })
    const wrapper = mountHome()
    const listBtn = wrapper.findAll('.view-btn').find(b => b.text() === 'List')!
    await listBtn.trigger('click')
    expect(wrapper.find('.genre-section__list').exists()).toBe(true)
  })

  it('shows Load More button when not all pages fetched', () => {
    mockPaginated({ shows: ref([mockShow]) })
    const wrapper = mountHome()
    expect(wrapper.find('.load-more-btn').exists()).toBe(true)
  })

  it('hides Load More button when all pages fetched', () => {
    mockPaginated({ shows: ref([mockShow]), allPagesFetched: ref(true) })
    const wrapper = mountHome()
    expect(wrapper.find('.load-more-btn').exists()).toBe(false)
  })

  it('calls loadMore on button click', async () => {
    const loadMore = vi.fn()
    mockPaginated({ shows: ref([mockShow]), loadMore })
    const wrapper = mountHome()
    await wrapper.find('.load-more-btn').trigger('click')
    expect(loadMore).toHaveBeenCalled()
  })
})
