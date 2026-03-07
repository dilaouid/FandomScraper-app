<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import WikiGrid from '../components/organisms/WikiGrid.vue'
import PageLayout from '../components/templates/PageLayout.vue'
import LoadingSpinner from '../components/molecules/LoadingSpinner.vue'
import { useWikis } from '../composables/useWikis'
import type { Wiki } from '../types'

const router = useRouter()

const {
    data: wikis,
    isLoading,
    isError,
    error
} = useWikis()

const wikiCount = computed(() => wikis.value?.length ?? 0)

const statusMessage = computed(() => {
    if (isLoading.value) return 'Loading wikis...'
    if (isError.value) return 'Connection failed'
    return 'Select a wiki to explore characters'
})

const statusDotClass = computed(() => {
    if (isLoading.value) return 'bg-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.85)]'
    if (isError.value) return 'bg-red-400 shadow-[0_0_16px_rgba(248,113,113,0.85)]'
    return 'bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.85)]'
})

const handleWikiSelect = (wiki: Wiki) => {
    router.push(`/${wiki.id}/characters`)
}
</script>

<template>
    <PageLayout>
        <template #background>
            <div class="fixed inset-0 overflow-hidden bg-[#040406]">
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,63,94,0.24),transparent_26%),radial-gradient(circle_at_80%_18%,rgba(168,85,247,0.16),transparent_22%),linear-gradient(180deg,#15090c_0%,#060608_56%,#030304_100%)]"></div>
                <div class="noise-overlay absolute inset-0 opacity-[0.08] mix-blend-soft-light"></div>

                <div class="accent-line-container">
                    <div class="accent-line line-1"></div>
                    <div class="accent-line line-2"></div>
                    <div class="accent-line line-3"></div>
                </div>

                <div class="absolute left-[8%] top-24 h-56 w-56 rounded-full bg-red-500/10 blur-[120px]"></div>
                <div class="absolute right-[10%] top-[18%] h-64 w-64 rounded-full bg-fuchsia-500/10 blur-[120px]"></div>
                <div class="absolute bottom-[-4rem] left-1/3 h-72 w-72 rounded-full bg-rose-500/10 blur-[140px]"></div>

                <div class="emblem-container">
                    <div v-for="n in 6" :key="`emblem-${n}`" class="floating-emblem" :style="`--index: ${n}; --total: 6;`">
                        <svg width="42" height="42" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 2L24.5 13.5L36 20L24.5 26.5L20 38L15.5 26.5L4 20L15.5 13.5L20 2Z"
                                fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="1" />
                        </svg>
                    </div>
                </div>

                <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.45)_100%)]"></div>
            </div>
        </template>

        <section class="page-shell pt-10 pb-16 sm:pt-16">
            <div class="glass-panel overflow-hidden">
                <div class="relative p-6 sm:p-8 lg:p-10">
                    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_52%)]"></div>
                    <div class="relative">

                        <div class="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
                            <div class="text-center lg:text-left">
                                <h1 class="hero-title">
                                    <span class="hero-highlight">Fandom</span>Scraper
                                </h1>
                                <p class="hero-subtitle mt-5">
                                    Browse available wikis and open their character libraries.
                                </p>
                            </div>

                            <div class="glass-panel-soft p-5 sm:p-6">
                                <p class="surface-label">Status</p>
                                <div class="mt-3 flex items-start gap-3">
                                    <span class="mt-1 h-2.5 w-2.5 rounded-full transition-colors duration-300" :class="statusDotClass"></span>
                                    <div>
                                        <p class="text-base font-medium text-white">{{ statusMessage }}</p>
                                        <p class="mt-1 text-sm leading-6 text-white/60">Choose a wiki to continue.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="border-t border-white/10 bg-black/15 px-6 py-4 sm:px-8 lg:px-10">
                    <div class="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p class="surface-label">Selection</p>
                            <p class="mt-1 text-white/75">Pick a wiki to open its character library.</p>
                        </div>
                        <div class="text-sm text-white/50">{{ wikiCount }} available</div>
                    </div>
                </div>
            </div>

            <main class="mt-8">
                <div v-if="isError" class="glass-panel mx-auto max-w-2xl p-8 text-center">
                    <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-red-400/20 bg-red-500/10">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 class="mt-5 text-2xl font-semibold text-white">Unable to load the library</h2>
                    <p class="mt-2 text-white/65">
                        The connection to the wiki source failed. Try again in a moment.
                    </p>
                    <p v-if="error" class="mt-5 rounded-2xl border border-red-400/15 bg-red-500/8 px-4 py-3 font-mono text-sm text-red-100/80">
                        {{ error.message }}
                    </p>
                </div>

                <div v-else-if="isLoading" class="glass-panel flex flex-col items-center justify-center py-16">
                    <LoadingSpinner />
                    <p class="mt-5 text-sm uppercase tracking-[0.28em] text-white/50">Loading wikis</p>
                    <p class="mt-2 text-white/70">Please wait...</p>
                </div>

                <div v-else class="glass-panel p-4 sm:p-6">
                    <WikiGrid :wikis="wikis || []" @select="handleWikiSelect" />
                </div>
            </main>
        </section>
    </PageLayout>
</template>

<style scoped>
.accent-line-container {
    position: absolute;
    inset: 0;
    overflow: hidden;
    opacity: 0.2;
}

.accent-line {
    position: absolute;
    height: 1px;
    width: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.55), transparent);
}

.line-1 {
    top: 24%;
    animation: floatLine 16s ease-in-out infinite;
}

.line-2 {
    top: 53%;
    animation: floatLine 18s ease-in-out infinite reverse;
    animation-delay: -6s;
}

.line-3 {
    top: 78%;
    animation: floatLine 21s ease-in-out infinite;
    animation-delay: -11s;
}

.emblem-container {
    position: absolute;
    inset: 0;
    overflow: hidden;
}

.floating-emblem {
    position: absolute;
    top: calc(14% + (var(--index) * 12%));
    left: calc(6% + (var(--index) * 14%));
    opacity: 0.38;
    animation: floatEmblem 24s linear infinite;
    animation-delay: calc(var(--index) * -4s);
}

@keyframes floatLine {
    0%,
    100% {
        opacity: 0.12;
        transform: scaleX(0.75) translateX(-10%);
    }

    50% {
        opacity: 0.55;
        transform: scaleX(1.15) translateX(8%);
    }
}

@keyframes floatEmblem {
    0% {
        transform: translate3d(0, 0, 0) rotate(0deg);
    }

    50% {
        transform: translate3d(0, -28px, 0) rotate(180deg);
    }

    100% {
        transform: translate3d(0, 0, 0) rotate(360deg);
    }
}
</style>