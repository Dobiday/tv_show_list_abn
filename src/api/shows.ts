import type { Show, SearchResult } from '../types';

const BASE_URL = 'https://api.tvmaze.com';

export async function fetchAllShows(signal: AbortSignal, page = 0): Promise<Show[]> {
    const response = await fetch(`${BASE_URL}/shows?page=${page}`, { signal });
    if (response.status === 404) {
        return [];
    }
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
}

export async function fetchShowById(id: number, signal: AbortSignal): Promise<Show> {
    const response = await fetch(`${BASE_URL}/shows/${id}`, { signal });
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
}

export async function fetchSearch(query: string, signal: AbortSignal): Promise<SearchResult[]> {
    const response = await fetch(`${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`, { signal });
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
}
