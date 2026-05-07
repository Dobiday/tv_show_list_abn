# TV Show List

ABN AMRO test assignment - A Vue 3 application that displays TV shows from the [TVmaze API](https://api.tvmaze.com), grouped by genre with search functionality and paginated loading.

## Tech Stack

- **Vue 3** — Composition API with `<script setup lang="ts">`
- **TypeScript**
- **Vite** — dev server and build tool
- **Vue Router** — client-side routing
- **Vitest** — unit testing with happy-dom

## Project Setup

```sh
npm install
```

### Development

```sh
npm run dev
```

### Build

```sh
npm run build
```

### Run Tests

```sh
npm test
```

### Watch Mode

```sh
npm run test:watch
```

### Coverage

```sh
npm run test:coverage
```

## Project Structure

```
src/
├── api/            # API service functions (TVmaze)
├── composables/    # Reusable composables (useFetch, useShowsPaginated, queries)
├── components/     # UI components (ShowCard, ShowListItem, SearchBar, SearchDropdown)
├── views/          # Page components (HomePage, ShowDetailPage)
├── router/         # Vue Router configuration
├── types/          # TypeScript interfaces
└── __fixtures__/   # Test fixtures
```
