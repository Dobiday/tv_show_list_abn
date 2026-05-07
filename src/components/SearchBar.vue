<script setup lang="ts">
    import { ref, watch } from 'vue';
    import { useRouter } from 'vue-router';
    import type { SearchResult } from '../types';
    import { useSearchShow } from '../composables/queries';
    import SearchDropdown from './SearchDropdown.vue';

    const router = useRouter();

    const inputValue = ref('');
    const debouncedQuery = ref<string | null>(null);
    const isOpen = ref(false);

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    watch(inputValue, (val) => {
        if (debounceTimer) clearTimeout(debounceTimer);
        const trimmed = val.trim();
        if (!trimmed) {
            debouncedQuery.value = null;
            isOpen.value = false;
            return;
        }
        debounceTimer = setTimeout(() => {
            debouncedQuery.value = trimmed;
            isOpen.value = true;
        }, 500);
    });

    const { data: results, loading } = useSearchShow(debouncedQuery);

    function onSelect(result: SearchResult) {
        inputValue.value = '';
        debouncedQuery.value = null;
        isOpen.value = false;
        router.push(`/show/${result.show.id}`);
    }

    function onFocus() {
        if (debouncedQuery.value) isOpen.value = true;
    }

    function onBlur() {
        setTimeout(() => { isOpen.value = false; }, 150);
    }
</script>

<template>
    <div class="search-bar">
        <div class="search-bar__wrapper" @focusin="onFocus" @focusout="onBlur">
            <input
                type="text"
                v-model="inputValue"
                placeholder="Search shows..."
                class="search-input"
                autocomplete="off"
            />
            <SearchDropdown
                v-if="isOpen"
                :results="results ?? []"
                :loading="loading"
                @select="onSelect"
            />
        </div>
    </div>
</template>

<style scoped>
    .search-bar {
        padding: 1rem 0;
        display: flex;
        justify-content: center;
    }

    .search-bar__wrapper {
        position: relative;
        width: 100%;
        max-width: 400px;
    }

    @media (max-width: 480px) {
        .search-bar {
            padding: 0.75rem 0;
        }

        .search-bar__wrapper {
            max-width: 100%;
        }
    }

    .search-input {
        width: 100%;
        padding: 0.6rem 1rem;
        font-size: 1rem;
        border: 1px solid #444;
        border-radius: 8px;
        background: #1a1a2e;
        color: #eee;
        outline: none;
        transition: border-color 0.2s;
    }

    .search-input::placeholder {
        color: #888;
    }

    .search-input:focus {
        border-color: #646cff;
    }
</style>

