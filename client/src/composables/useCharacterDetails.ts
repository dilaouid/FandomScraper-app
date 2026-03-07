import { ref } from "vue"

import { useQuery } from "@tanstack/vue-query"
import { useWikiStore } from "@/stores/useWikiStore"
import { useApiTrackingStore } from '@/stores/useApiTrackingStore'
import { API_BASE_URL } from '@/config/api'

export function useCharacterDetails(wikiName: string, characterId: number, initialFields: string[], initialArrayFields: string[]) {
    const { currentLanguage } = useWikiStore()
    const apiTrackingStore = useApiTrackingStore()
    
    const fields = ref(initialFields)
    const arrayFields = ref(initialArrayFields)

    const query = useQuery({
        queryKey: ['character', wikiName, characterId, fields.value, arrayFields.value, currentLanguage],
        queryFn: async () => {
            const paramsObject = {
                fields: ['images', ...fields.value],
                arrayFields: arrayFields.value,
                lang: currentLanguage
            }
            const params = new URLSearchParams({
                fields: paramsObject.fields.join(','),
                arrayFields: paramsObject.arrayFields.join(','),
                lang: paramsObject.lang
            })

            apiTrackingStore.trackApiCall(`${API_BASE_URL}/${wikiName}/characters/id/${characterId}`, paramsObject)

            const response = await fetch(`${API_BASE_URL}/${wikiName}/characters/id/${characterId}?${params}`)
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