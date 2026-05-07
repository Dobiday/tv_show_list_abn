import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { mockShow } from '../../__fixtures__/show'

vi.mock('../../composables/queries', () => ({
  useShow: vi.fn(),
}))

import { useShow } from '../../composables/queries'
import ShowDetailPage from '../ShowDetailPage.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: { template: '<div/>' } },
    { path: '/show/:id', component: ShowDetailPage },
  ],
})

const mountDetail = () => mount(ShowDetailPage, { global: { plugins: [router] } })

beforeEach(() => {
  vi.clearAllMocks()
})

describe('ShowDetailPage', () => {
  it('shows loading state', () => {
    vi.mocked(useShow).mockReturnValue({
      data: ref(null), loading: ref(true), error: ref(null),
    } as any)
    const wrapper = mountDetail()
    expect(wrapper.find('.detail__status').text()).toBe('Loading...')
  })

  it('shows error state', () => {
    vi.mocked(useShow).mockReturnValue({
      data: ref(null), loading: ref(false), error: ref(new Error('not found')),
    } as any)
    const wrapper = mountDetail()
    expect(wrapper.find('.detail__status--error').exists()).toBe(true)
  })

  it('renders show name when data is loaded', () => {
    vi.mocked(useShow).mockReturnValue({
      data: ref(mockShow), loading: ref(false), error: ref(null),
    } as any)
    const wrapper = mountDetail()
    expect(wrapper.find('h1').text()).toBe('Under the Dome')
  })

  it('renders genre tags', () => {
    vi.mocked(useShow).mockReturnValue({
      data: ref(mockShow), loading: ref(false), error: ref(null),
    } as any)
    const wrapper = mountDetail()
    const tags = wrapper.findAll('.detail__tag').map(t => t.text())
    expect(tags).toContain('Drama')
    expect(tags).toContain('Science-Fiction')
  })

  it('renders the show summary', () => {
    vi.mocked(useShow).mockReturnValue({
      data: ref(mockShow), loading: ref(false), error: ref(null),
    } as any)
    const wrapper = mountDetail()
    expect(wrapper.find('.detail__summary').html()).toContain('dome')
  })

  it('renders poster image', () => {
    vi.mocked(useShow).mockReturnValue({
      data: ref(mockShow), loading: ref(false), error: ref(null),
    } as any)
    const wrapper = mountDetail()
    const img = wrapper.find('.detail__image')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe(mockShow.image!.original)
  })
})
