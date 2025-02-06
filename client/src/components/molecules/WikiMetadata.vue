<script setup lang="ts">
import { Link } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { useQueryClient } from '@tanstack/vue-query'
import { useWikiMetadata } from '@/composables/useWikiMetadata'
import { useWikiStore } from '@/stores/useWikiStore'
import LanguageBadge from '../atoms/LanguageBadge.vue'

interface Props {
    wikiName: string;
}

const props = defineProps<Props>()
const store = useWikiStore()
const queryClient = useQueryClient()
const route = useRoute()
const router = useRouter()

const { data: metadata } = useWikiMetadata(props.wikiName)

const formatWikiName = (name: string) =>
    name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

const handleLanguageChange = async () => {
    store.setLanguageSwitching(true)
    const newLang = store.currentLanguage === 'fr' ? 'en' : 'fr'
    store.setLanguage(newLang)
    
    await router.push({
        query: {
            ...route.query,
            lang: newLang,
        }
    })
    
    await queryClient.invalidateQueries({ queryKey: ['wiki-metadata', props.wikiName] })
    await queryClient.invalidateQueries({ queryKey: ['characters', props.wikiName] })
    
    store.setLanguageSwitching(false)
}
</script>

<template>
    <div>
        <div class="flex items-center gap-4">
            <h1 class="text-3xl font-bold text-white">
                {{ formatWikiName(wikiName) }}
            </h1>

            <a v-if="metadata" :href="`${metadata.url}`" target="_blank"
                class="text-white/70 hover:text-white transition-colors" title="Visit Wiki">
                <Link class="w-5 h-5" />
            </a>

            <LanguageBadge v-if="(metadata?.availableLanguages?.length) as number > 1"
                :current-lang="store.currentLanguage as 'en' | 'fr'" @click="handleLanguageChange" />
        </div>

        <div class="text-white/70 mt-1 flex gap-4">
            <p v-if="metadata?.count">
                {{ metadata.count }} personnages disponibles
            </p>
            <template v-if="(metadata?.availableLanguages?.length ?? 0) > 1">
                <span v-if="metadata?.count && metadata">•</span>
                <p>
                    {{ metadata?.availableLanguages?.length ?? 0 }} langue{{ (metadata?.availableLanguages?.length ?? 0) > 1 ? 's' : ''
                    }} disponible{{ (metadata?.availableLanguages?.length ?? 0) > 1 ? 's' : '' }}
                </p>
            </template>
        </div>
    </div>
</template>
