import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { useWikiStore, WikiMetadata } from '@/stores/useWikiStore'

export function useWikiMetadata(wikiName: string) {
    const store = useWikiStore()
    const route = useRoute()
    const lang = computed(() => route.query.lang?.toString() || 'en')

    return useQuery<WikiMetadata>({
        queryKey: ['wiki-metadata', wikiName, lang.value],
        queryFn: async () => {
            const response = await fetch(`http://localhost:3000/${wikiName}/metadata?withCount=true&lang=${lang.value}`)
            if (!response.ok) {
                throw new Error('Failed to fetch wiki metadata')
            }
            const data = await response.json()

            store.setWikiMetadata(wikiName, data)
            return data
        },
        staleTime: 50000,
        gcTime: Infinity
    })
};