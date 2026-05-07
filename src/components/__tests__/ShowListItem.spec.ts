import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHashHistory } from 'vue-router'
import ShowListItem from '../ShowListItem.vue'
import { mockShow } from '../../__fixtures__/show'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div/>' } }],
})

const mountItem = (show = mockShow) =>
  mount(ShowListItem, { props: { show }, global: { plugins: [router] } })

describe('ShowListItem', () => {
  it('renders the show name', () => {
    const wrapper = mountItem()
    expect(wrapper.find('.list-item__name').text()).toBe('Under the Dome')
  })

  it('renders up to 2 genres joined by ·', () => {
    const wrapper = mountItem()
    expect(wrapper.find('.list-item__genres').text()).toBe('Drama · Science-Fiction')
  })

  it('renders — when genres are empty', () => {
    const wrapper = mountItem({ ...mockShow, genres: [] })
    expect(wrapper.find('.list-item__genres').text()).toBe('—')
  })

  it('renders the status', () => {
    const wrapper = mountItem()
    expect(wrapper.find('.list-item__status').text()).toBe('Ended')
  })

  it('renders rating when present', () => {
    const wrapper = mountItem()
    expect(wrapper.find('.list-item__rating').text()).toContain('6.6')
  })

  it('renders N/A when rating is null', () => {
    const wrapper = mountItem({ ...mockShow, rating: { average: null } })
    expect(wrapper.find('.list-item__rating').text()).toBe('N/A')
  })

  it('links to the correct show route', () => {
    const wrapper = mountItem()
    expect(wrapper.find('a').attributes('href')).toContain('/show/1')
  })
})
