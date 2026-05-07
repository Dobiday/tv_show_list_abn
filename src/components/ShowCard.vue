<script setup lang="ts">
    import type { Show } from '../types';

    defineProps<{
        show: Show;
    }>();
</script>

<template>
    <router-link :to="`/show/${show.id}`" class="show-card">
        <img
            v-if="show.image"
            :src="show.image.medium"
            :alt="show.name"
            class="show-card__image"
        />
        <div v-else class="show-card__placeholder">No Image</div>
        <div class="show-card__info">
            <h3 class="show-card__title">{{ show.name }}</h3>
            <span v-if="show.rating.average" class="show-card__rating">
                ★ {{ show.rating.average }}
            </span>
        </div>
    </router-link>
</template>

<style scoped>
    .show-card {
        display: flex;
        flex-direction: column;
        min-width: 140px;
        border-radius: 8px;
        overflow: hidden;
        background: #1a1a2e;
        text-decoration: none;
        color: inherit;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    :global(.genre-section__grid) .show-card {
        width: 100%;
        min-width: unset;
    }

    .show-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    }

    .show-card__image {
        width: 100%;
        height: 230px;
        object-fit: cover;
    }

    .show-card__placeholder {
        width: 100%;
        height: 230px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #2a2a3e;
        color: #666;
        font-size: 0.85rem;
    }

    .show-card__info {
        padding: 0.5rem;
    }

    .show-card__title {
        font-size: 0.85rem;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .show-card__rating {
        font-size: 0.75rem;
        color: #f5c518;
    }
</style>
