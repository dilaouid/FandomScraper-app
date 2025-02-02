import { useQuery } from "@tanstack/vue-query"

export function useCharacterDetails(wikiName: string, characterId: number) {
    return useQuery({
        queryKey: ['character', wikiName, characterId],
        queryFn: async () => {
            const response = await fetch(`http://localhost:3000/${wikiName}/characters/${characterId}?fields=images,status,gender,kanji&withId=true&recursive=true`)
            return response.json()
        }
    })
}