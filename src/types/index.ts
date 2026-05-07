export interface Country {
    name: string;
    code: string;
    timezone: string;
}

export interface Network {
    id: number;
    name: string;
    country: Country | null;
    officialSite: string | null;
}

export interface Image {
    medium: string;
    original: string;
}

export interface Externals {
    tvrage: number | null;
    thetvdb: number | null;
    imdb: string | null;
}

export interface Rating {
    average: number | null;
}

export interface Schedule {
    time: string;
    days: string[];
}

export interface Link {
    href: string;
    name?: string;
}

export interface Links {
    self: Link;
    previousepisode?: Link;
}

export interface Show {
    averageRuntime: number | null;
    dvdCountry: string | null;
    ended: string | null;
    externals: Externals;
    genres: string[];
    id: number;
    image: Image | null;
    language: string;
    name: string;
    network: Network | null;
    officialSite: string | null;
    premiered: string | null;
    rating: Rating;
    runtime: number | null;
    schedule: Schedule;
    status: string;
    summary: string | null;
    type: string;
    updated: number;
    url: string;
    webChannel: Network | null;
    weight: number;
    _links: Links;
}

export interface SearchResult {
    score: number;
    show: Show;
}