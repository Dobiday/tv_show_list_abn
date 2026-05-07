<script setup lang="ts">
    import type { Show } from '../types';
    import ShowCard from './ShowCard.vue';

    defineProps<{ show: Show }>();
</script>

<template>
    <div class="list-item">
        <router-link :to="`/show/${show.id}`" class="list-item__row">
            <span class="list-item__name">{{ show.name }}</span>
            <span class="list-item__genres">{{ show.genres.slice(0, 2).join(' · ') || '—' }}</span>
            <span class="list-item__status" :data-status="show.status">{{ show.status }}</span>
            <span v-if="show.rating.average" class="list-item__rating">★ {{ show.rating.average }}</span>
            <span v-else class="list-item__rating list-item__rating--none">N/A</span>
        </router-link>
        <div class="list-item__preview">
            <ShowCard :show="show" />
        </div>
    </div>
</template>

<style scoped>
    .list-item {
        position: relative;
    }

    .list-item__row {
        display: grid;
        grid-template-columns: 1fr 1fr auto auto;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem 0.75rem;
        border-radius: 6px;
        text-decoration: none;
        color: #eee;
        transition: background 0.15s;
    }

    .list-item__row:hover {
        background: #1a1a2e;
    }

    .list-item__name {
        font-size: 0.9rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 500;
    }

    .list-item__genres {
        font-size: 0.8rem;
        color: #888;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .list-item__status {
        font-size: 0.75rem;
        padding: 0.15rem 0.5rem;
        border-radius: 10px;
        background: #2a2a3e;
        color: #aaa;
        white-space: nowrap;
    }

    .list-item__status[data-status="Ended"] {
        color: #f87171;
        background: rgba(248, 113, 113, 0.1);
    }

    .list-item__status[data-status="Running"] {
        color: #4ade80;
        background: rgba(74, 222, 128, 0.1);
    }

    .list-item__rating {
        font-size: 0.8rem;
        color: #f5c518;
        min-width: 3rem;
        text-align: right;
    }

    .list-item__rating--none {
        color: #555;
    }

    .list-item__preview {
        display: none;
        position: absolute;
        bottom: calc(100% + 6px);
        left: 50%;
        transform: translateX(-50%);
        z-index: 200;
        pointer-events: none;
        filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.7));
    }

    .list-item:hover .list-item__preview {
        display: block;
    }

    @media (hover: none) {
        .list-item__preview {
            display: none !important;
        }
    }

    @media (max-width: 480px) {
        .list-item__row {
            grid-template-columns: 1fr auto;
        }

        .list-item__genres,
        .list-item__status {
            display: none;
        }
    }
</style>
