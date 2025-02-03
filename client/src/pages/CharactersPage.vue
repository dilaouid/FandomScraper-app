<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useQueryClient } from '@tanstack/vue-query'
import { useCharacters } from '@/composables/useCharacters'
import PageLayout from '@/components/templates/PageLayout.vue'

import CharacterGrid from '@/components/organisms/CharacterGrid.vue'
import SearchBar from '@/components/molecules/SearchBar.vue'
import FilterOptions from '@/components/molecules/FilterOptions.vue'
import Pagination from '@/components/molecules/Pagination.vue'
import BackButton from '@/components/atoms/BackButton.vue'
import WikiMetadata from '@/components/molecules/WikiMetadata.vue'

const route = useRoute()
const router = useRouter()
const wikiName = route.params.wiki as string
const queryClient = useQueryClient()

const {
    characters,
    isLoading,
    isError,
    currentPage,
    totalPages,
    setPage,
    searchTerm,
    setSearch,
    selectedFields,
    setFields,
    totalCount
} = useCharacters(wikiName)

const handleCardClick = (characterId: number) => {
    router.push(`/${wikiName}/characters/${characterId}`)
}

const handleFieldsChange = (fields: string[]) => {
    setFields(fields)
}
</script>

<template>
    <PageLayout>
        <template #background>
            <!-- Base background -->
            <div class="fixed inset-0 bg-gradient-to-br from-red-950 to-black overflow-hidden">
                <!-- Matrix rain effect -->
                <div class="matrix-rain" aria-hidden="true">
                    <div v-for="n in 60" :key="n" class="matrix-column"
                        :style="{ left: `${(n - 1) * 1.67}%`, animationDelay: `-${Math.random() * 10}s` }">
                        働 き す ぎ て 死 ぬ な 今 日 も 頑 張 ろ う
                    </div>
                </div>

                <!-- Animated clouds -->
                <div class="cloud-container">
                    <div class="cloud cloud-1" />
                    <div class="cloud cloud-2" />
                    <div class="cloud cloud-3" />
                </div>

                <!-- Pattern overlay -->
                <div class="absolute inset-0 bg-pattern opacity-10" />

                <!-- Gradient overlays -->
                <div class="absolute inset-0 bg-gradient-to-t from-[#1a0f0f] via-transparent to-[#1a0f0f]" />
                <div class="absolute inset-0 bg-gradient-to-r from-[#1a0f0f] via-transparent to-[#1a0f0f]" />

                <!-- Blur pattern -->
                <div
                    class="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,0,0,0.3),rgba(0,0,0,0.6))]">
                </div>
                <div class="absolute inset-0 backdrop-blur-[100px]"></div>
            </div>
        </template>

        <div class="container mx-auto px-4 py-8">
            <!-- Header Section with glass effect -->
            <div class="rounded-xl bg-black/30 backdrop-blur-md border border-white/10 p-6 mb-8 shadow-2xl">
                <div class="flex flex-wrap gap-4 items-center justify-between mb-6">
                    <div class="flex items-center gap-4">
                        <BackButton to="/" />
                        <WikiMetadata :wiki-name="wikiName" :character-count="totalCount" />
                    </div>
                </div>

                <!-- Search and Filters -->
                <div class="flex flex-wrap gap-4 items-center justify-between">
                    <SearchBar v-model="searchTerm" @search="setSearch" placeholder="Rechercher par nom ou ID..."
                        class="flex-1 min-w-[300px]" />
                    <FilterOptions v-model="selectedFields" :wiki-name="wikiName"
                        @update:modelValue="handleFieldsChange" />
                </div>
            </div>

            <!-- Content -->
            <div class="relative">
                <!-- Loading overlay -->
                <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div
                        class="p-6 max-w-sm w-full rounded-xl border border-white/20 bg-gradient-to-br from-white/20 to-white/10 shadow-xl backdrop-blur-lg relative overflow-hidden">
                        <div class="absolute inset-0 bg-white/5 pointer-events-none"></div>

                        <!-- Contenu centré -->
                        <div class="relative flex flex-col items-center justify-center space-y-4">
                            <!-- Spinner CSS -->
                            <div class="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin">
                            </div>
                            <p class="text-white text-center text-sm font-medium">
                                Chargement des personnages...
                            </p>
                        </div>
                    </div>
                </div>

                <CharacterGrid :characters="characters || []" :loading="isLoading" :error="isError"
                    @card-click="handleCardClick" :wiki-name="wikiName"
                    @retry="() => queryClient.invalidateQueries({ queryKey: ['characters', wikiName] })" />
            </div>

            <!-- Footer with Pagination -->
            <div class="mt-8 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 p-4">
                <div class="flex flex-wrap gap-4 items-center justify-between">
                    <div class="text-white/70">
                        Page {{ currentPage }} sur {{ totalPages }}
                    </div>
                    <Pagination v-if="!isLoading && !isError && totalPages > 0" :current-page="currentPage"
                        :total-pages="totalPages" @change="setPage" />
                </div>
            </div>
        </div>
    </PageLayout>
</template>

<style>
.matrix-rain {
    position: absolute;
    inset: 0;
    z-index: 1;
    overflow: hidden;
    opacity: 0.08;
    mask-image: linear-gradient(to bottom,
            transparent,
            black 15%,
            black 85%,
            transparent);
    -webkit-mask-image: linear-gradient(to bottom,
            transparent,
            black 15%,
            black 85%,
            transparent);
}

.cloud-container {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.cloud {
    position: absolute;
    width: 300px;
    height: 100px;
    background-image: url('@/assets/images/cloud.webp');
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.1;
}

.cloud-1 {
    top: 10%;
    animation: cloudFloat 30s linear infinite;
}

.cloud-2 {
    top: 50%;
    animation: cloudFloat 40s linear infinite;
    animation-delay: -20s;
}

.cloud-3 {
    top: 80%;
    animation: cloudFloat 35s linear infinite;
    animation-delay: -10s;
}

@keyframes cloudFloat {
    0% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(100vw);
    }
}

/* Loading spinner */
.loading-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid #ff000030;
    border-top: 3px solid #ff0000;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.bg-pattern {
    background-image:
        linear-gradient(45deg, #ff000015 25%, transparent 25%),
        linear-gradient(-45deg, #ff000015 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #ff000015 75%),
        linear-gradient(-45deg, transparent 75%, #ff000015 75%);
    background-size: 20px 20px;
    background-position: 0 0, 10px 0, 10px -10px, 0px 10px;
}
</style>