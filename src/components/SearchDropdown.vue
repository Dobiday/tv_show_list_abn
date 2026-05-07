<script setup lang="ts">
    import type { SearchResult } from '../types';

    defineProps<{
        results: SearchResult[];
        loading: boolean;
    }>();

    defineEmits<{
        select: [result: SearchResult];
    }>();
</script>

<template>
    <div class="dropdown">
        <div v-if="loading" class="dropdown__status">Searching...</div>
        <ul v-else-if="results.length" class="dropdown__list">
            <li
                v-for="result in results"
                :key="result.show.id"
                class="dropdown__item"
                @mousedown.prevent="$emit('select', result)"
            >
                <img
                    v-if="result.show.image"
                    :src="result.show.image.medium"
                    :alt="result.show.name"
                    class="dropdown__image"
                />
                <div v-else class="dropdown__image-placeholder" />
                <div class="dropdown__info">
                    <span class="dropdown__name">{{ result.show.name }}</span>
                    <span v-if="result.show.rating.average" class="dropdown__rating">
                        ★ {{ result.show.rating.average }}
                    </span>
                </div>
            </li>
        </ul>
        <div v-else class="dropdown__status">No results found.</div>
    </div>
</template>

<style scoped>
    .dropdown {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        right: 0;
        background: #1a1a2e;
        border: 1px solid #444;
        border-radius: 8px;
        z-index: 100;
        max-height: min(360px, 50vh);
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    }

    .dropdown__status {
        padding: 1rem;
        color: #888;
        text-align: center;
        font-size: 0.9rem;
    }

    .dropdown__list {
        list-style: none;
        margin: 0;
        padding: 0.25rem 0;
    }

    .dropdown__item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem 0.75rem;
        cursor: pointer;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
        transition: background 0.15s;
    }

    .dropdown__item:hover {
        background: #2a2a3e;
    }

    .dropdown__image {
        width: 36px;
        height: 52px;
        object-fit: cover;
        border-radius: 4px;
        flex-shrink: 0;
    }

    .dropdown__image-placeholder {
        width: 36px;
        height: 52px;
        background: #2a2a3e;
        border-radius: 4px;
        flex-shrink: 0;
    }

    .dropdown__info {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
    }

    .dropdown__name {
        font-size: 0.9rem;
        color: #eee;
    }

    .dropdown__rating {
        font-size: 0.75rem;
        color: #f5c518;
    }
</style>
