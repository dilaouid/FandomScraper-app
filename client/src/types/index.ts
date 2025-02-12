import type { FunctionalComponent } from 'vue'
import type { LucideProps } from 'lucide-vue-next'

export type ArrayFields = 'affiliation' | 'occupations' | 'episode' | 'relatives' | 'images'

export type IconComponent = FunctionalComponent<LucideProps>

export interface Wiki {
    id: string
    name: string
    imageUrl: string
}

export interface Character {
    id: number
    name: string
    url: string
    data?: {
        name?: string;
        kanji?: string;
        quote?: string[];
        romaji?: string;
        status?: string;
        species?: string;
        gender?: string;
        images?: string[];
        episode?: string;
        manga?: string;
        age?: string;
        affiliation?: string;
        hairColor?: string;
        eyeColor?: string;
        occupations?: string;
        seiyu?: string;
        voiceActor?: string;
        relatives?: string;
        birthday?: string;
        zodiac?: string;
        height?: string;
        weight?: string;
        nationality?: string;
        bloodType?: string;
    }
}

export interface ApiResponse<T> {
    data: T
    error?: string
}

export interface QueryParams {
    limit?: number
    offset?: number
    fields?: string[]
    arrayFields?: ArrayFields[]
}

export interface CharactersResponse {
    data: Character[];
    total: number;
}

export interface CharacterQueryParams {
    limit?: number;
    offset?: number;
    fields?: string[];
    arrayFields?: string[];
    withId?: boolean;
    recursive?: boolean;
    ignore?: string[];
}