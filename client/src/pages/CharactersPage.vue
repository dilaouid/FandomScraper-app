<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQueryClient } from '@tanstack/vue-query'
import { useCharacters } from '@/composables/useCharacters'
import { useWikiStore } from '@/stores/useWikiStore'

import PageLayout from '@/components/templates/PageLayout.vue'
import CharacterGrid from '@/components/organisms/CharacterGrid.vue'
import FilterOptions from '@/components/molecules/FilterOptions.vue'
import Pagination from '@/components/molecules/Pagination.vue'
import BackButton from '@/components/atoms/BackButton.vue'
import WikiMetadata from '@/components/molecules/WikiMetadata.vue'
import { useWikiMetadata } from '@/composables/useWikiMetadata'

const route = useRoute()
const router = useRouter()
const wikiName = route.params.wiki as string
const queryClient = useQueryClient()

const {
  characters,
  isLoading,
  isRefreshing,
  isError,
  currentPage,
  totalPages,
  setPage,
  selectedFields,
  setFields,
  totalCount
} = useCharacters(wikiName)

const { isLoading: isMetadataLoading, data } = useWikiMetadata(wikiName)
const store = useWikiStore()

const isPageLoading = computed(() =>
  isLoading.value || (!characters.value && isMetadataLoading.value)
)

const activeFilterCount = computed(() => selectedFields.value.length)

const handleCardClick = (characterId: number) => {
    router.push(`/${wikiName}/characters/${characterId}`)
}

const handleFieldsChange = (fields: string[]) => {
    setFields(fields)
}

watch(() => data.value, (newData) => {
    if (newData) {
        const availableLanguages = newData.availableLanguages || []
        if (availableLanguages.includes('en')) {
            store.setLanguage('en')
        } else if (availableLanguages.includes('fr')) {
            store.setLanguage('fr')
        }
    }
}, { immediate: true })

</script>

<template>
    <PageLayout>
        <template #background>
            <div class="fixed inset-0 overflow-hidden bg-[#050507]">
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,113,133,0.18),transparent_24%),radial-gradient(circle_at_80%_10%,rgba(192,132,252,0.14),transparent_20%),linear-gradient(180deg,#14080b_0%,#060609_52%,#030304_100%)]"></div>
                <div class="cloud-container">
                    <div class="cloud cloud-1" />
                    <div class="cloud cloud-2" />
                    <div class="cloud cloud-3" />
                </div>
                <div class="absolute inset-0 bg-pattern opacity-[0.08]" />
                <div class="absolute left-[10%] top-20 h-56 w-56 rounded-full bg-red-500/10 blur-[120px]"></div>
                <div class="absolute right-[8%] top-1/3 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-[140px]"></div>
                <div class="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/60"></div>
                <div class="absolute inset-0 backdrop-blur-[90px]"></div>
            </div>
        </template>

        <section class="page-shell py-8 sm:py-10">
            <div class="glass-panel overflow-hidden">
                <div class="relative p-6 sm:p-8">
                    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent_56%)]"></div>
                    <div class="relative flex flex-col gap-8">
                        <div class="flex flex-wrap items-start justify-between gap-4">
                            <div class="flex items-start gap-4">
                                <BackButton to="/" />
                                <div>
                                    <div class="mb-3 flex flex-wrap items-center gap-3">
                                        <span class="info-pill">{{ totalCount }} result{{ totalCount > 1 ? 's' : '' }}</span>
                                        <span class="info-pill">{{ activeFilterCount }} filter{{ activeFilterCount > 1 ? 's' : '' }}</span>
                                    </div>
                                    <WikiMetadata :wiki-name="wikiName" :character-count="totalCount" />
                                </div>
                            </div>
                        </div>

                        <div class="rounded-[24px] border border-white/10 bg-black/[0.18] p-4 sm:p-5">
                            <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <p class="surface-label">Filters</p>
                                    <p class="mt-2 text-sm text-white/65">Toggle the fields shown in the grid.</p>
                                </div>
                                <FilterOptions v-model="selectedFields" :wiki-name="wikiName"
                                    @update:modelValue="handleFieldsChange" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="relative mt-8">
                <div v-if="isPageLoading"
                    class="absolute inset-0 z-50 flex items-center justify-center rounded-[28px] border border-white/10 bg-black/25 backdrop-blur-md">
                    <div class="glass-panel max-w-sm p-6 text-center">
                        <div class="mx-auto h-12 w-12 rounded-full border-4 border-white/15 border-t-rose-300 animate-spin"></div>
                        <p class="mt-4 text-base font-medium text-white">Loading characters...</p>
                        <p class="mt-2 text-sm text-white/60">Please wait...</p>
                    </div>
                </div>

                <div class="glass-panel p-4 sm:p-6">
                    <div v-if="isRefreshing" class="mb-4 flex items-center gap-2 text-sm text-white/55">
                        <div class="h-2 w-2 rounded-full bg-rose-300 animate-pulse"></div>
                        Updating...
                    </div>
                    <CharacterGrid :characters="characters || []" :loading="isLoading" :error="isError"
                        @card-click="handleCardClick" :wiki-name="wikiName"
                        @retry="() => queryClient.invalidateQueries({ queryKey: ['characters', wikiName] })" />
                </div>
            </div>

            <div class="glass-panel mt-8 p-4 sm:p-5">
                <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p class="surface-label">Pagination</p>
                        <p class="mt-1 text-white/70">Page {{ currentPage }} of {{ totalPages }}</p>
                    </div>
                    <Pagination v-if="!isPageLoading && !isError && totalPages > 0" :current-page="currentPage"
                        :total-pages="totalPages" @change="setPage" />
                </div>
            </div>
        </section>
    </PageLayout>
</template>

<style>
.cloud-container {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.cloud {
    position: absolute;
    width: 420px;
    height: 150px;
    background-image: url('@/assets/images/cloud.webp');
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.12;
    filter: blur(2px);
}

.cloud-1 {
    top: 8%;
    animation: cloudFloat 34s linear infinite;
}

.cloud-2 {
    top: 42%;
    animation: cloudFloat 44s linear infinite;
    animation-delay: -18s;
}

.cloud-3 {
    top: 76%;
    animation: cloudFloat 38s linear infinite;
    animation-delay: -12s;
}

@keyframes cloudFloat {
    0% {
        transform: translate3d(-140%, 0, 0);
    }

    100% {
        transform: translate3d(110vw, 0, 0);
    }
}

.bg-pattern {
    background-image:
        linear-gradient(45deg, rgba(255, 255, 255, 0.03) 25%, transparent 25%),
        linear-gradient(-45deg, rgba(255, 255, 255, 0.03) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.03) 75%),
        linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.03) 75%);
    background-size: 28px 28px;
    background-position: 0 0, 14px 0, 14px -14px, 0px 14px;
}
</style>