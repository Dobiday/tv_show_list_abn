<script setup lang="ts">
    import { ref, computed } from 'vue';
    import type { Show } from '../types';
    import { useShowsPaginated } from '../composables/useShowsPaginated';
    import SearchBar from '../components/SearchBar.vue';
    import ShowCard from '../components/ShowCard.vue';
    import ShowListItem from '../components/ShowListItem.vue';

    const { shows, loading, loadingMore, error, allPagesFetched, loadMore } = useShowsPaginated();

    type ViewMode = 'carousel' | 'grid' | 'list';
    const viewMode = ref<ViewMode>('carousel');

    const genreMap = computed(() => {
        const map = new Map<string, Show[]>();
        for (const show of shows.value) {
            for (const genre of show.genres) {
                if (!map.has(genre)) {
                    map.set(genre, []);
                }
                map.get(genre)!.push(show);
            }
        }
        for (const [, list] of map) {
            list.sort((a, b) => (b.rating.average ?? 0) - (a.rating.average ?? 0));
        }
        return new Map([...map.entries()].sort(([a], [b]) => a.localeCompare(b)));
    });
</script>

<template>
    <div class="home">
        <h1>TV Shows</h1>
        <SearchBar />

        <div class="home__toolbar">
            <button
                class="view-btn"
                :class="{ 'view-btn--active': viewMode === 'carousel' }"
                @click="viewMode = 'carousel'"
            >Carousel</button>
            <button
                class="view-btn"
                :class="{ 'view-btn--active': viewMode === 'grid' }"
                @click="viewMode = 'grid'"
            >Grid</button>
            <button
                class="view-btn"
                :class="{ 'view-btn--active': viewMode === 'list' }"
                @click="viewMode = 'list'"
            >List</button>
        </div>

        <div v-if="loading" class="home__status">Loading...</div>
        <div v-else-if="error" class="home__status home__status--error">{{ error }}</div>
        <div v-else-if="genreMap.size === 0" class="home__status">No shows found.</div>

        <section v-for="[genre, list] in genreMap" :key="genre" class="genre-section">
            <h2 class="genre-section__title">{{ genre }}</h2>
            <div v-if="viewMode === 'list'" class="genre-section__list">
                <ShowListItem v-for="show in list" :key="show.id" :show="show" />
            </div>
            <div v-else :class="viewMode === 'carousel' ? 'genre-section__row' : 'genre-section__grid'">
                <ShowCard v-for="show in list" :key="show.id" :show="show" />
            </div>
            <button
                v-if="!allPagesFetched"
                class="load-more-btn"
                :disabled="loadingMore"
                @click="loadMore"
            >
                {{ loadingMore ? 'Loading...' : 'Load More' }}
            </button>
        </section>
    </div>
</template>

<style scoped>
    .home {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1rem;
    }

    @media (max-width: 480px) {
        .home {
            padding: 0.75rem;
        }
    }

    .home__status {
        text-align: center;
        padding: 2rem;
        color: #aaa;
    }

    .home__status--error {
        color: #f44;
    }

    .genre-section {
        margin-bottom: 2rem;
    }

    .genre-section__title {
        font-size: 1.3rem;
        margin-bottom: 0.75rem;
        border-bottom: 2px solid #646cff;
        display: inline-block;
        padding-bottom: 0.2rem;
    }

    @media (max-width: 480px) {
        .genre-section__title {
            font-size: 1.1rem;
        }
    }

    .genre-section__row {
        display: flex;
        gap: 1rem;
        overflow-x: auto;
        padding-bottom: 0.5rem;
    }

    .genre-section__row::-webkit-scrollbar {
        height: 6px;
    }

    .genre-section__row::-webkit-scrollbar-thumb {
        background: #444;
        border-radius: 3px;
    }

    .genre-section__grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 1rem;
    }

    .home__toolbar {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .view-btn {
        background: none;
        border: 1px solid #444;
        color: #aaa;
        padding: 0.35rem 0.9rem;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.85rem;
        transition: border-color 0.2s, color 0.2s;
    }

    .view-btn:hover {
        border-color: #646cff;
        color: #eee;
    }

    .view-btn--active {
        border-color: #646cff;
        color: #646cff;
    }

    .genre-section__list {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
        border: 1px solid #222;
        border-radius: 8px;
        padding: 0.25rem;
        overflow: visible;
    }

    .load-more-btn {
        display: block;
        margin: 0.75rem auto 0;
        padding: 0.5rem 1.5rem;
        background: none;
        border: 1px solid #444;
        color: #aaa;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.85rem;
        transition: border-color 0.2s, color 0.2s;
    }

    .load-more-btn:hover:not(:disabled) {
        border-color: #646cff;
        color: #eee;
    }

    .load-more-btn:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
</style>
