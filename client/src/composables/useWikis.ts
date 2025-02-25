import { useQuery } from '@tanstack/vue-query'
import type { Wiki } from '@/types'

const apiUrl = import.meta.env.VITE_API_URL

interface WikisResponse {
    wikis: { name: string, lang: 'en' | 'fr' }[]
}

export function useWikis() {
    return useQuery<WikisResponse, Error, Wiki[]>({
        queryKey: ['wikis'],
        queryFn: async () => {
            const response = await fetch(`${apiUrl}/available-wikis`)
            if (!response.ok) {
                throw new Error('Failed to fetch wikis')
            }
            return response.json()
        },
        select: (data) =>
            data.wikis.map((wiki): Wiki => ({
                id: wiki.name,
                name: wiki.name
                    .split('-')
                    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(' '),
                imageUrl: `/images/wikis/${wiki.name}.jpg`
            }))
    })
}
