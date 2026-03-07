<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useWikiStore } from '@/stores/useWikiStore'

import { API_BASE_URL } from '@/config/api'
const store = useWikiStore()

const props = defineProps<{
    images: string[]
}>()

const currentIndex = ref(0)
const resolvedUrls = ref(new Map<string, string>())
const loading = ref(true)

/**
 * Résolution d'URL avec fallback proxy
 */
const resolveImageUrl = async (url: string): Promise<string> => {
    try {
        const response = await fetch(url, { method: 'HEAD' })
        if (response.status === 404) {
            const referer = store.getBaseUrl(url)
            return `${API_BASE_URL}/proxy?url=${encodeURIComponent(url)}${referer ? `&referer=${encodeURIComponent(referer)}` : ''}`
        }
        return url
    } catch (error) {
        const referer = store.getBaseUrl(url)
        return `${API_BASE_URL}/proxy?url=${encodeURIComponent(url)}${referer ? `&referer=${encodeURIComponent(referer)}` : ''}`
    }
}

/**
 * Résolution de toutes les images
 */
const resolveAllImages = async () => {
    loading.value = true
    try {
        await Promise.all(props.images.map(async (url) => {
            if (!resolvedUrls.value.has(url)) {
                const resolvedUrl = await resolveImageUrl(url)
                resolvedUrls.value.set(url, resolvedUrl)
            }
        }))
    } finally {
        loading.value = false
    }
}

/**
 * Images résolues pour l'affichage
 */
const displayImages = computed(() => 
    props.images.map(url => resolvedUrls.value.get(url) || url)
)

const next = () => currentIndex.value = (currentIndex.value + 1) % props.images.length
const prev = () => currentIndex.value = currentIndex.value === 0 ? props.images.length - 1 : currentIndex.value - 1

// Résolution initiale des images
onMounted(() => {
    resolveAllImages()
})
</script>


<template>
    <div class="glass-panel overflow-hidden p-3 sm:p-4">
        <div class="relative overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(0,0,0,0.3))] aspect-square lg:aspect-[4/3]">
            <div v-if="loading" 
                 class="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-20">
                <div class="h-8 w-8 rounded-full border-2 border-white/15 border-t-rose-300 animate-spin" />
            </div>
            <transition
                enter-active-class="transition-opacity duration-300 ease-out"
                leave-active-class="transition-opacity duration-300 ease-in"
                enter-from-class="opacity-0"
                leave-to-class="opacity-0"
                mode="out-in"
            >
                <img 
                    :key="currentIndex"
                    :src="displayImages[currentIndex]" 
                    :alt="`Character image ${currentIndex + 1}`"
                    class="w-full h-full object-contain bg-[radial-gradient(circle_at_top,rgba(251,113,133,0.18),transparent_34%)]" 
                />
            </transition>

            <div v-if="images.length > 1"
                class="absolute bottom-0 inset-x-0 flex justify-center gap-3 bg-gradient-to-t from-black/80 via-black/45 to-transparent p-6">
                <button 
                    v-for="(img, index) in displayImages" 
                    :key="index"
                    @click="currentIndex = index"
                    class="relative overflow-hidden rounded-2xl"
                >
                    <div class="h-14 w-14 overflow-hidden rounded-2xl border transition-all duration-300 shadow-lg shadow-black/50"
                         :class="[
                            index === currentIndex 
                                ? 'border-rose-300/70 scale-110' 
                                : 'border-white/10 hover:border-white/30'
                         ]">
                        <img :src="img" 
                             class="w-full h-full object-cover 
                                    transition-transform duration-300
                                    hover:scale-110" />
                    </div>
                </button>
            </div>
        </div>

        <template v-if="images.length > 1">
            <button @click="prev"
                class="absolute left-7 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/35 p-3 backdrop-blur-md transition-all duration-300 group shadow-lg shadow-black/50 hover:bg-black/60">
                <ChevronLeft class="w-5 h-5 text-white 
                                   transition-transform duration-300
                                   group-hover:-translate-x-0.5" />
            </button>

            <button @click="next"
                class="absolute right-7 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/35 p-3 backdrop-blur-md transition-all duration-300 group shadow-lg shadow-black/50 hover:bg-black/60">
                <ChevronRight class="w-5 h-5 text-white 
                                    transition-transform duration-300
                                    group-hover:translate-x-0.5" />
            </button>
        </template>
    </div>
</template>