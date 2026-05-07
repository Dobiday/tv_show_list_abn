import type { Show } from '../../types'

export const mockShow: Show = {
  id: 1,
  name: 'Under the Dome',
  url: 'https://www.tvmaze.com/shows/1/under-the-dome',
  type: 'Scripted',
  language: 'English',
  genres: ['Drama', 'Science-Fiction'],
  status: 'Ended',
  runtime: 60,
  averageRuntime: 60,
  premiered: '2013-06-24',
  ended: '2015-09-10',
  officialSite: 'http://www.cbs.com/shows/under-the-dome/',
  schedule: { time: '22:00', days: ['Thursday'] },
  rating: { average: 6.6 },
  weight: 99,
  network: {
    id: 2,
    name: 'CBS',
    country: { name: 'United States', code: 'US', timezone: 'America/New_York' },
    officialSite: null,
  },
  webChannel: null,
  dvdCountry: null,
  externals: { tvrage: 25988, thetvdb: 264492, imdb: 'tt1553656' },
  image: {
    medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/610/1525272.jpg',
    original: 'https://static.tvmaze.com/uploads/images/original_untouched/610/1525272.jpg',
  },
  summary: '<p>Small town sealed off by a dome.</p>',
  updated: 1769177765,
  _links: {
    self: { href: 'https://api.tvmaze.com/shows/1' },
    previousepisode: { href: 'https://api.tvmaze.com/episodes/185054', name: 'The Enemy Within' },
  },
}
