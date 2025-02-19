import { ref } from 'vue'
import { useWikiStore } from '@/stores/useWikiStore'

export function useImageResolver() {
    const apiUrl = import.meta.env.VITE_API_URL
    const store = useWikiStore()

    const resolvedUrls = ref<string[]>([])
    const loading = ref(true)

    const resolveImageUrl = async (url: string): Promise<string> => {
        try {
            const response = await fetch(url, { method: 'HEAD' })
            if (response.status === 404) {
                const referer = store.getBaseUrl(url)
                return `${apiUrl}/proxy?url=${encodeURIComponent(url)}${referer ? `&referer=${encodeURIComponent(referer)}` : ''}`
            }
            return url
        } catch (error) {
            const referer = store.getBaseUrl(url)
            return `${apiUrl}/proxy?url=${encodeURIComponent(url)}${referer ? `&referer=${encodeURIComponent(referer)}` : ''}`
        }
    }

    const resolveAllImages = async (images: string[]) => {
        loading.value = true
        try {
            const resolved = await Promise.all(
                images.map(url => resolveImageUrl(url))
            )
            resolvedUrls.value = resolved
        } finally {
            loading.value = false
        }
    }

    return {
        resolvedUrls,
        loading,
        resolveAllImages
    }
}