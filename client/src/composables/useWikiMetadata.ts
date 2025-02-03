import { useWikiStore, WikiMetadata } from '@/stores/useWikiStore'
import { useQuery } from '@tanstack/vue-query'

export function useWikiMetadata(wikiName: string) {
    const store = useWikiStore()

    return useQuery<WikiMetadata>({
        queryKey: ['wiki-metadata', wikiName],
        queryFn: async () => {
            const response = await fetch(`http://localhost:3000/${wikiName}/metadata?withCount=true`)
            if (!response.ok) {
                throw new Error('Failed to fetch wiki metadata')
            }
            const data = await response.json()
            
            store.setWikiMetadata(wikiName, data)
            return data
        },
        staleTime: Infinity
    })
}