import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFiltersStore = defineStore('filters', () => {
    const selectedFields = ref<Record<string, string[]>>({})

    const setSelectedFields = (wikiName: string, fields: string[]) => {
        selectedFields.value[wikiName] = fields
    }

    const getSelectedFields = (wikiName: string) => {
        return selectedFields.value[wikiName] || ['images']
    }

    return {
        selectedFields,
        setSelectedFields,
        getSelectedFields
    }
})