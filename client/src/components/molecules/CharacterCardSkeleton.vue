<script setup lang="ts">
import { computed } from 'vue'
import { useFiltersStore } from '@/stores/useFiltersStore'

const props = defineProps<{
    wikiName: string
}>()

const filtersStore = useFiltersStore()
const selectedFields = computed(() => filtersStore.getSelectedFields(props.wikiName))

const filters = [
    { id: 'status', label: 'Status', icon: '🎯' },
    { id: 'gender', label: 'Genre', icon: '👤' },
    { id: 'kanji', label: 'Kanji', icon: '漢' }
]

const selectedFilters = computed(() => 
    filters.filter(filter => selectedFields.value.includes(filter.id))
)

const showKanji = computed(() => selectedFields.value.includes('kanji'))
</script>

<template>
    <div class="group">
        <!-- Zone principale -->
        <div class="card-skeleton relative rounded-xl overflow-hidden backdrop-blur-sm">
            <!-- Fond avec motif japonais -->
            <div class="absolute inset-0">
                <div class="japanese-pattern absolute inset-0 opacity-20" />
            </div>

            <!-- Container image avec aspect ratio -->
            <div class="relative aspect-square w-full">
                <!-- Zone image avec shimmer -->
                <div class="absolute inset-0">
                    <div class="w-full h-full bg-gradient-to-br from-red-900/10 to-red-950/10">
                        <div class="shimmer absolute inset-0"></div>
                    </div>
                </div>

                <!-- Badges status/genre - uniquement pour les filtres sélectionnés -->
                <div class="absolute top-2 right-2 flex gap-2 z-10">
                    <div v-for="filter in selectedFilters" :key="filter.id"
                         class="character-badge bg-gradient-to-br from-red-900/20 to-red-950/10">
                        <div class="shimmer absolute inset-0"></div>
                    </div>
                </div>

                <!-- Zone texte -->
                <div class="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-red-950/30 via-black/5 to-transparent z-10">
                    <!-- Nom -->
                    <div class="h-6 w-2/3 rounded overflow-hidden bg-gradient-to-r from-red-900/20 to-red-950/10">
                        <div class="shimmer absolute inset-0"></div>
                    </div>
                    <!-- Kanji - uniquement si sélectionné -->
                    <div v-if="showKanji" 
                         class="h-4 w-1/2 rounded mt-2 overflow-hidden bg-gradient-to-r from-red-900/20 to-red-950/10">
                        <div class="shimmer absolute inset-0"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Zone miniatures -->
        <div class="mt-2 flex justify-center gap-2">
            <div v-for="n in 3" :key="n" 
                 class="w-12 h-12 rounded-md overflow-hidden relative bg-gradient-to-br from-red-900/20 to-red-950/10">
                <div class="shimmer absolute inset-0"></div>
            </div>
        </div>
    </div>
</template>


<style scoped>
.japanese-pattern {
    background-image: url('@/assets/images/background.jpg');
    transform: scale(1.5);
    filter: brightness(0.5) sepia(0.2) hue-rotate(-10deg);
}

.character-badge {
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
}

.card-skeleton {
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.shimmer {
    background: linear-gradient(90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%);
    animation: shimmer 2s infinite;
    transform: skewX(-15deg);
}

@keyframes shimmer {
    from {
        transform: translateX(-150%) skewX(-15deg);
    }

    to {
        transform: translateX(150%) skewX(-15deg);
    }
}
</style>
