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
        <div class="flex flex-wrap items-center gap-3">
            <h1 class="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {{ formatWikiName(wikiName) }}
            </h1>

            <a v-if="metadata" :href="`${metadata.url}`" target="_blank"
                class="premium-button h-10 px-3 py-0 text-white/80 hover:text-white" title="Visit Wiki">
                <Link class="w-5 h-5" />
            </a>

            <LanguageBadge v-if="(metadata?.availableLanguages?.length) as number > 1"
                :current-lang="store.currentLanguage as 'en' | 'fr'" @click="handleLanguageChange" />
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
            <span v-if="metadata?.count" class="info-pill">
                {{ metadata.count }} available character{{ metadata.count > 1 ? 's' : '' }}
            </span>
            <span v-if="(metadata?.availableLanguages?.length ?? 0) > 1" class="info-pill">
                {{ metadata?.availableLanguages?.length ?? 0 }} available
                language{{ (metadata?.availableLanguages?.length ?? 0) > 1 ? 's' : '' }}
            </span>
        </div>
    </div>
</template>
