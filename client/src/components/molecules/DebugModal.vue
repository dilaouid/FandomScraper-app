<script setup lang="ts">
import { computed, Teleport } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useWikiStore } from '@/stores/useWikiStore'
import { useFiltersStore } from '@/stores/useFiltersStore'
import { useApiTrackingStore } from '@/stores/useApiTrackingStore'
import { Terminal, XIcon } from 'lucide-vue-next'

const props = defineProps<{
    open: boolean
    route: RouteLocationNormalizedLoaded
}>()

const emit = defineEmits<{
    'update:open': [value: boolean]
}>()

const apiTrackingStore = useApiTrackingStore()
const wikiStore = useWikiStore()
const filtersStore = useFiltersStore()


const getExampleCode = computed(() => {
    const routeName = props.route.name as string
    const currentWiki = props.route.params.wiki as string
    const lang = wikiStore.currentLanguage


    const selectedFields = [...new Set(['images', ...filtersStore.getSelectedFields(currentWiki)])]
    const page = Number(props.route.query.page || 1)
    const perPage = 12
    const offset = (page - 1) * perPage
    const searchTerm = props.route.query.search?.toString()

    const colorize = (code: string) => {
        return code
            .replace(/(const|let|await|new)/g, '<span class="text-purple-400">$1</span>')
            .replace(/(\w+)\(/g, '<span class="text-blue-400">$1</span>(')
            .replace(/(\'[^\']*\')/g, '<span class="text-orange-400">$1</span>')
            .replace(/(\{|\})/g, '<span class="text-yellow-400">$1</span>')
            .replace(/(\/\/ .*)/g, '<span class="text-green-400">$1</span>')
    }

    switch (routeName) {
        case 'home':
            return colorize(`
// Get the list of available wikis for the API
const scraper = new FandomScraper();
const availableWikis = scraper.getAvailableWikis();`)

        case 'characters':
            return colorize(`
// Initialize scraper for ${currentWiki} wiki
const scraper = new FandomScraper('${currentWiki}', { lang: '${lang}' });

// Get characters list with current filters
const characters = await scraper
  .findAll({ 
    base64: false, 
    withId: true,
    recursive: true 
  })
  .limit(${perPage})
  .offset(${offset})
  .attr('${selectedFields.join(' ')}')\
${searchTerm ? `\n  .search('${searchTerm}')` : ''}
  .exec();`)

        case 'character':
            const lastCall = apiTrackingStore.lastApiCall
            if (!lastCall) return '// Loading...'

            const characterId = props.route.params.id

            return colorize(`// Initialize scraper for ${currentWiki} wiki
const scraper = new FandomScraper('${currentWiki}', { lang: '${lastCall.params.lang}' });

// Get character with ID ${characterId}
const character = await scraper
  .findById(${characterId})
  .attr('${lastCall.params.fields.join(' ')}')\
${lastCall.params.arrayFields.length ? `\n  .attrToArray('${lastCall.params.arrayFields.join(' ')}')` : ''}
  .exec();`)

        default:
            return '// No FandomScraper example available for this route'
    }
})

</script>
<template>
    <Teleport to="body">
        <Dialog :open="open" @update:open="(val) => emit('update:open', val)">
            <DialogContent
                            class="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] sm:max-w-2xl bg-black/60 backdrop-blur-md border border-white/20 shadow-xl rounded-lg overflow-visible glow-container "
                            aria-describedby="dialog-description">
                <DialogHeader class="flex items-center justify-between">
                    <DialogTitle class="flex items-center gap-2 text-white font-mono">
                        <Terminal class="w-5 h-5" />
                        FandomScraper Code
                    </DialogTitle>
                    <p id="dialog-description" class="sr-only">
                        View the FandomScraper code example for the current page
                    </p>
                    <button @click="emit('update:open', false)"
                        class="absolute -right-3 -top-3 rounded-full p-1.5 bg-black/60 hover:bg-white/20 transition-colors border border-white/20 group">
                        <XIcon class="w-4 h-4 text-white group-hover:text-blue-400 transition-colors" />
                    </button>
                </DialogHeader>

                <div class="mt-4 p-1 rounded-lg bg-white/5 backdrop-blur-sm">
                    <pre
                        class="rounded-lg bg-black/60 p-4 overflow-x-auto font-mono text-sm text-white/90 max-h-[60vh] whitespace-pre-wrap break-words">
            <code v-html="getExampleCode"></code>
          </pre>
                </div>
            </DialogContent>
        </Dialog>
    </Teleport>
</template>


<style scoped>
.glow-container {
    position: relative;
    overflow: visible;
}

.glow-container::before {
    content: '';
    position: absolute;
    top: -8px;
    left: -8px;
    right: -8px;
    bottom: -8px;
    border-radius: inherit;
    background: linear-gradient(45deg, rgba(16, 185, 129, 0.5), transparent, rgba(16, 185, 129, 0.5));
    filter: blur(12px);
    z-index: -1;
    opacity: 0.7;
    animation: rotate 4s linear infinite;
    pointer-events: none;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

pre {
    max-width: calc(100vw - 4rem);
}

code {
    display: block;
    line-height: 1.6;
    white-space: pre-wrap;
    word-wrap: break-word;
}
</style>