<script setup lang="ts">
    import { computed } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { useShow } from '../composables/queries';

    const route = useRoute();
    const router = useRouter();

    const id = computed(() => route.params.id as string);
    const { data: show, loading, error } = useShow(id);
</script>

<template>
    <div class="detail">
        <button class="detail__back" @click="router.back()">← Back</button>

        <div v-if="loading" class="detail__status">Loading...</div>
        <div v-else-if="error" class="detail__status detail__status--error">{{ error }}</div>

        <template v-else-if="show">
            <div class="detail__header">
                <img
                    v-if="show.image"
                    :src="show.image.original"
                    :alt="show.name"
                    class="detail__image"
                />
                <div class="detail__meta">
                    <h1>{{ show.name }}</h1>

                    <div class="detail__tags">
                        <span v-for="genre in show.genres" :key="genre" class="detail__tag">
                            {{ genre }}
                        </span>
                    </div>

                    <table class="detail__table">
                        <tbody>
                            <tr v-if="show.rating.average">
                                <td>Rating</td>
                                <td>★ {{ show.rating.average }}</td>
                            </tr>
                            <tr>
                                <td>Status</td>
                                <td>{{ show.status }}</td>
                            </tr>
                            <tr>
                                <td>Type</td>
                                <td>{{ show.type }}</td>
                            </tr>
                            <tr>
                                <td>Language</td>
                                <td>{{ show.language }}</td>
                            </tr>
                            <tr v-if="show.network">
                                <td>Network</td>
                                <td>{{ show.network.name }}</td>
                            </tr>
                            <tr v-if="show.premiered">
                                <td>Premiered</td>
                                <td>{{ show.premiered }}</td>
                            </tr>
                            <tr v-if="show.ended">
                                <td>Ended</td>
                                <td>{{ show.ended }}</td>
                            </tr>
                            <tr v-if="show.runtime">
                                <td>Runtime</td>
                                <td>{{ show.runtime }} min</td>
                            </tr>
                            <tr v-if="show.schedule">
                                <td>Schedule</td>
                                <td>{{ show.schedule.days.join(', ') }} at {{ show.schedule.time }}</td>
                            </tr>
                            <tr v-if="show.officialSite">
                                <td>Official Site</td>
                                <td><a :href="show.officialSite" target="_blank" rel="noopener">Visit</a></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-if="show.summary" class="detail__summary" v-html="show.summary"></div>
        </template>
    </div>
</template>

<style scoped>
    .detail {
        max-width: 900px;
        margin: 0 auto;
        padding: 1rem;
    }

    @media (max-width: 480px) {
        .detail {
            padding: 0.75rem;
        }
    }

    .detail__back {
        background: none;
        border: 1px solid #555;
        color: #eee;
        padding: 0.4rem 0.8rem;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9rem;
        margin-bottom: 1rem;
    }

    .detail__back:hover {
        border-color: #646cff;
        color: #646cff;
    }

    .detail__status {
        text-align: center;
        padding: 2rem;
        color: #aaa;
    }

    .detail__status--error {
        color: #f44;
    }

    .detail__header {
        display: flex;
        gap: 2rem;
        align-items: flex-start;
    }

    .detail__image {
        width: 300px;
        border-radius: 8px;
        flex-shrink: 0;
    }

    .detail__meta h1 {
        margin: 0 0 0.5rem;
    }

    .detail__tags {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
    }

    .detail__tag {
        background: #646cff;
        color: #fff;
        padding: 0.2rem 0.6rem;
        border-radius: 12px;
        font-size: 0.8rem;
    }

    .detail__table {
        border-collapse: collapse;
    }

    .detail__table td {
        padding: 0.3rem 1rem 0.3rem 0;
        vertical-align: top;
    }

    .detail__table td:first-child {
        color: #999;
        white-space: nowrap;
    }

    .detail__table a {
        color: #646cff;
    }

    .detail__summary {
        margin-top: 1.5rem;
        line-height: 1.6;
        color: #ccc;
    }

    @media (max-width: 640px) {
        .detail__header {
            flex-direction: column;
        }

        .detail__image {
            width: 100%;
            max-width: 100%;
        }

        .detail__meta h1 {
            font-size: 1.4rem;
        }

        .detail__table td {
            font-size: 0.9rem;
        }
    }
</style>
