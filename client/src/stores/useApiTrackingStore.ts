import { defineStore } from 'pinia'
import { ref } from 'vue'

interface APICall {
    url: string
    params: {
        fields: string[]
        arrayFields: string[]
        lang: string
    }
}

export const useApiTrackingStore = defineStore('api-tracking', () => {
    const lastApiCall = ref<APICall | null>(null)

    const trackApiCall = (url: string, params: APICall['params']) => {
        lastApiCall.value = { url, params }
    }

    return {
        lastApiCall,
        trackApiCall
    }
})