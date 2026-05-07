import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHashHistory } from 'vue-router'
import ShowCard from '../ShowCard.vue'
import { mockShow } from '../../__fixtures__/show'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div/>' } }],
})

const mountCard = (show = mockShow) =>
  mount(ShowCard, { props: { show }, global: { plugins: [router] } })

describe('ShowCard', () => {
  it('renders the show name', () => {
    const wrapper = mountCard()
    expect(wrapper.find('.show-card__title').text()).toBe('Under the Dome')
  })

  it('renders rating when present', () => {
    const wrapper = mountCard()
    expect(wrapper.find('.show-card__rating').text()).toContain('6.6')
  })

  it('does not render rating when null', () => {
    const wrapper = mountCard({ ...mockShow, rating: { average: null } })
    expect(wrapper.find('.show-card__rating').exists()).toBe(false)
  })

  it('renders poster image when available', () => {
    const wrapper = mountCard()
    const img = wrapper.find('.show-card__image')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe(mockShow.image!.medium)
  })

  it('renders placeholder when image is null', () => {
    const wrapper = mountCard({ ...mockShow, image: null })
    expect(wrapper.find('.show-card__placeholder').exists()).toBe(true)
  })

  it('links to the correct show route', () => {
    const wrapper = mountCard()
    expect(wrapper.find('a').attributes('href')).toContain('/show/1')
  })
})
