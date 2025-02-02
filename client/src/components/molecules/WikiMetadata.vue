<script setup lang="ts">
import { Link } from 'lucide-vue-next'
import { useWikiMetadata } from '@/composables/useWikiMetadata'
import { computed, watch } from 'vue';
import { useWikiStore } from '@/stores/useWikIStore';
interface Props {
    wikiName: string;
    characterCount?: number;
}

const props = defineProps<Props>()
const store = useWikiStore()
const { data: metadata } = useWikiMetadata(props.wikiName)

const formatWikiName = (name: string) => {
    return name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

const getLanguageFlag = (lang: string) => {
    const flags: Record<string, string> = {
        'fr': '🇫🇷',
        'en': '🇬🇧'
    }
    return flags[lang] || lang.toUpperCase()
}

// Mise à jour du store quand les métadonnées changent
watch(() => metadata.value, (newMetadata) => {
    if (newMetadata) {        
        store.setWikiMetadata(props.wikiName, newMetadata)
    }
}, { immediate: true })
const storeMetadata = computed(() => store.getWikiMetadata(props.wikiName))

</script>

<template>
    <div>
        <div class="flex items-center gap-4">
            <h1 class="text-3xl font-bold text-white">
                {{ formatWikiName(wikiName) }}
            </h1>

            <a v-if="metadata" :href="`https://${metadata.language}.wikipedia.org/wiki/${wikiName}`" target="_blank"
                class="text-white/70 hover:text-white transition-colors" title="Visit Wiki">
                <Link class="w-5 h-5" />
            </a>

            <div v-if="metadata?.availableLanguages?.length"
                class="flex items-center gap-2 px-4 py-1 bg-white/5 rounded-full">
                <button v-for="lang in metadata.availableLanguages" :key="lang"
                    class="text-xl opacity-70 hover:opacity-100 transition-opacity hover:scale-110 transform duration-200"
                    :class="{ 'opacity-100': lang === metadata.language }" :title="`Switch to ${lang.toUpperCase()}`">
                    {{ getLanguageFlag(lang) }}
                </button>
            </div>
        </div>

        <div class="text-white/70 mt-1 flex gap-4">
            <p v-if="characterCount !== undefined">
                {{ characterCount }} personnages disponibles
            </p>
            <template v-if="metadata?.availableLanguages?.length">
                <span v-if="characterCount !== undefined">•</span>
                <p>
                    {{ metadata.availableLanguages.length }} langue{{ metadata.availableLanguages.length > 1 ? 's' : ''
                    }} disponible{{ metadata.availableLanguages.length > 1 ? 's' : '' }}
                </p>
            </template>
        </div>
    </div>
</template>
