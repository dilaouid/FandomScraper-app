import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface WikiMetadata {
    name: string;
    attributes: string[];
    language: string;
    availableLanguages: string[];
    count: number;
    url: string;
}

export const useWikiStore = defineStore('wiki', () => {
    const wikisMetadata = ref<Record<string, WikiMetadata>>({})
    const currentLanguage = ref<string>('fr')

    const setWikiMetadata = (wikiName: string, metadata: WikiMetadata) => {
        wikisMetadata.value[wikiName] = metadata
    }


    const getWikiMetadata = (wikiName: string) => {
        const metadata = wikisMetadata.value[wikiName]
        return metadata
    }


    const setLanguage = (lang: string) => {
        currentLanguage.value = lang
    }

    const getWikiFilters = computed(() => (wikiName: string) => {
        const metadata = wikisMetadata.value[wikiName]
        if (!metadata?.attributes) {
            return []
        }

        const filters = [
            { id: 'status', label: 'Status', icon: '🎯' },
            { id: 'gender', label: 'Genre', icon: '👤' },
            { id: 'kanji', label: 'Kanji', icon: '漢' }
        ]

        const available = filters.filter(filter => metadata.attributes.includes(filter.id))
        return available
    })


    return {
        wikisMetadata,
        currentLanguage,
        setWikiMetadata,
        getWikiMetadata,
        setLanguage,
        getWikiFilters
    }
})