import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { useWikiStore, WikiMetadata } from '@/stores/useWikiStore'

const apiUrl = import.meta.env.VITE_API_URL

export function useWikiMetadata(wikiName: string) {
    const store = useWikiStore()
    const route = useRoute()
    const lang = computed(() => route.query.lang?.toString() || 'en')

    return useQuery<WikiMetadata>({
        queryKey: ['wiki-metadata', wikiName, lang.value],
        queryFn: async () => {
            const response = await fetch(`${apiUrl}/${wikiName}/metadata?withCount=true&lang=${lang.value}`)
            if (!response.ok) {
                throw new Error('Failed to fetch wiki metadata')
            }
            const data = await response.json()

            store.setWikiMetadata(wikiName, data)
            console.log(store.getWikiMetadata(wikiName).attributes);
            
            return data
        },
        placeholderData: () => store.getWikiMetadata(wikiName),
        staleTime: 50000,
        gcTime: Infinity,
        enabled: !store.getWikiMetadata(wikiName)
    })
};