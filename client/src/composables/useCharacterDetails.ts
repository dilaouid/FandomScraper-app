import { computed, ref } from "vue"
import { useRoute } from "vue-router"

import { useQuery } from "@tanstack/vue-query"
const apiUrl = import.meta.env.VITE_API_URL

export function useCharacterDetails(wikiName: string, characterId: number, initialFields: string[], initialArrayFields: string[]) {
    const route = useRoute()
    const lang = computed(() => route.query.lang?.toString() || 'en')

    const fields = ref(initialFields)
    const arrayFields = ref(initialArrayFields)

    const query = useQuery({
        queryKey: ['character', wikiName, characterId, fields.value, arrayFields.value, lang.value],
        queryFn: async () => {
            const params = new URLSearchParams({
                fields: ['images', ...fields.value].join(','),
                arrayFields: arrayFields.value.join(','),
                lang: lang.value
            })
            const response = await fetch(`${apiUrl}/${wikiName}/characters/id/${characterId}?${params}`)
            if (!response.ok)
                throw new Error(response.status === 404 ? 'Character not found' : 'An error occurred')

            return response.json()
        },
        enabled: !!wikiName && !!characterId
    })

    const updateField = async (field: string, isArray: boolean = false) => {
        if (isArray) {
            fields.value = fields.value.filter(f => f !== field)
            if (!arrayFields.value.includes(field)) {
                arrayFields.value = [...arrayFields.value, field]
            }
        } else {
            arrayFields.value = arrayFields.value.filter(f => f !== field)
            if (!fields.value.includes(field)) {
                fields.value = [...fields.value, field]
            }
        }
        await query.refetch()
    }

    return {
        ...query,
        updateField,
        fields,
        arrayFields
    }
}