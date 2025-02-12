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
    const currentLanguage = ref<string>('en')
    const isLanguageSwitching = ref(false)

    const setWikiMetadata = (wikiName: string, metadata: WikiMetadata) => {
        wikisMetadata.value[wikiName] = metadata
    }

    const getWikiMetadata = (wikiName: string) => {
        return wikisMetadata.value[wikiName]
    }

    const setLanguage = (lang: string) => {
        currentLanguage.value = lang
    }

    const setLanguageSwitching = (value: boolean) => {
        isLanguageSwitching.value = value
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

    const getBaseUrl = (url: string): string => {
        const match = url.match(/^https?:\/\/[^\/]+/)
        return match ? match[0] : ''
    }
 

    return {
        wikisMetadata,
        currentLanguage,
        isLanguageSwitching,
        setWikiMetadata,
        getWikiMetadata,
        setLanguage,
        setLanguageSwitching,
        getWikiFilters,
        getBaseUrl
    }
})
