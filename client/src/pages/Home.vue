<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import WikiGrid from '../components/organisms/WikiGrid.vue'
import PageLayout from '../components/templates/PageLayout.vue'
import LoadingSpinner from '../components/molecules/LoadingSpinner.vue'
import { useWikis } from '../composables/useWikis'
import type { Wiki } from '../types'

const router = useRouter()
const selectedWikiId = ref<string | null>(null)

const {
    data: wikis,
    isLoading,
    isError,
    error
} = useWikis()

const handleWikiSelect = (wiki: Wiki) => {
    selectedWikiId.value = wiki.id
    setTimeout(() => {
        router.push(`/${wiki.id}/characters`)
    }, 500)
}
</script>

<template>
    <PageLayout>
        <template #background>
            <!-- Fond de base -->
            <div class="fixed inset-0 bg-[#1a0f0f] overflow-hidden">
                <div class="matrix-rain" aria-hidden="true">
                    <div v-for="n in 60" :key="n" class="matrix-column" :style="{
                        left: `${(n - 1) * 1.67}%`,
                        animationDelay: `-${Math.random() * 10}s`
                    }">
                        働 き す ぎ て 死 ぬ な 今 日 も 頑 張 ろ う 運 命 を 変 え る
                    </div>
                </div>
                <!-- Animated clouds -->
                <div class="cloud-container">
                    <div class="cloud cloud-1" />
                    <div class="cloud cloud-2" />
                    <div class="cloud cloud-3" />
                </div>

                <!-- Japanese pattern overlay -->
                <div class="absolute inset-0 bg-pattern opacity-10" />

                <!-- Gradient overlays -->
                <div class="absolute inset-0 bg-gradient-to-t from-[#1a0f0f] via-transparent to-[#1a0f0f]" />
                <div class="absolute inset-0 bg-gradient-to-r from-[#1a0f0f] via-transparent to-[#1a0f0f]" />
            </div>
        </template>

        <!-- Header -->
        <div class="relative z-10 text-center py-8 select-none">
            <div class="glitch-container mb-4">
                <h1 class="text-4xl md:text-5xl font-bold text-white glitch" data-text="FandomScraper">
                    FandomScraper
                </h1>
            </div>
            <div class="terminal-text max-w-2xl mx-auto px-4">
                <p class="text-green-500 font-mono text-sm md:text-base typing-effect">
                    > Initializing database connection...
                </p>
                <p v-if="!isError && !isLoading" class="text-green-500 font-mono text-sm md:text-base typing-effect delay-1">
                    > Select a wiki to explore characters
                </p>
            </div>
        </div>

        <!-- Main Content -->
        <main class="relative z-10">
            <div v-if="isError" class="error-container text-center py-8 mx-auto max-w-lg">
                <div class="bg-red-900/20 border border-red-500/50 rounded-lg p-6">
                    <h2 class="text-red-500 text-xl mb-2">Error 500: Server Malfunction</h2>
                    <p class="text-red-400">Une erreur est survenue lors du chargement des wikis.</p>
                    <p v-if="error" class="text-red-400/80 text-sm mt-2 font-mono">{{ error.message }}</p>
                </div>
            </div>

            <div v-else-if="isLoading" class="loading-container flex items-center justify-center py-8">
                <LoadingSpinner />
                <div class="matrix-text font-mono text-green-500/80 ml-4 text-sm">
                    Scanning wikis...
                </div>
            </div>

            <div v-else class="container mx-auto px-4">
                <WikiGrid :wikis="wikis || []" :selected-wiki-id="selectedWikiId" @select="handleWikiSelect" />
            </div>
        </main>
    </PageLayout>
</template>

<style>
.matrix-rain {
    position: absolute;
    inset: 0;
    z-index: 1;
    overflow: hidden;
    opacity: 0.08;
}

.matrix-column {
    position: absolute;
    top: -150%;
    color: #22c55e;
    font-size: 14px;
    writing-mode: vertical-rl;
    white-space: pre;
    user-select: none;
    text-align: center;
    line-height: 1;
    animation: matrix-fall 8s linear infinite;
    text-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
    font-family: "MS Mincho", "Yu Mincho", serif;
    will-change: transform;
}

.matrix-column:nth-child(2n) {
    color: #11a34b;
    font-size: 12px;
    animation-duration: 10s;
}

.matrix-column:nth-child(3n) {
    color: #dc2626;
    font-size: 16px;
    text-shadow: 0 0 8px rgba(220, 38, 38, 0.6);
    animation-duration: 12s;
}

.matrix-column:nth-child(5n) {
    animation-duration: 9s;
    font-size: 18px;
}

.matrix-column:nth-child(7n) {
    animation-duration: 11s;
    opacity: 0.9;
}

@keyframes matrix-fall {
    from {
        transform: translateY(-100%);
    }

    to {
        transform: translateY(300vh);
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

.scale-out {
    transform: scale(0.8);
    opacity: 0.5;
    filter: blur(2px);
    transition: all 0.5s ease-in-out;
}
</style>

<style scoped>
.glitch-container {
    position: relative;
    overflow: hidden; /* Empêche le débordement */
    padding: 0.1em; /* Un peu de padding pour éviter que le glitch soit coupé */
}

.glitch {
    position: relative;
    text-shadow: 0.05em 0 0 #ff0000, -0.025em -0.05em 0 #0000ff;
    animation: glitch 725ms infinite;
    display: inline-block; /* Pour contenir l'effet */
}

.glitch::before,
.glitch::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); /* Clip path complet */
}

.glitch::before {
    animation: glitch 500ms infinite;
    clip-path: polygon(30% 0, 70% 0, 70% 65%, 30% 65%);
    text-shadow: -0.05em 0 #ff0000;
    transform-origin: center;
}

.glitch::after {
    animation: glitch 375ms infinite;
    clip-path: polygon(15% 0, 85% 0, 85% 65%, 15% 65%);
    text-shadow: 0.05em 0 #0000ff;
    transform-origin: center;
}

@keyframes glitch {
    0% {
        transform: translateX(0) skewX(0deg);
    }
    5% {
        transform: translateX(2px) skewX(2deg);
    }
    10% {
        transform: translateX(-2px) skewX(-2deg);
    }
    15% {
        transform: translateX(0) skewX(0deg);
    }
    100% {
        transform: translateX(0) skewX(0deg);
    }
}

.typing-effect {
    opacity: 0;
    transform: translateY(1rem);
    animation: typeIn 0.5s ease forwards;
}

.delay-1 {
    animation-delay: 0.8s;
}

@keyframes typeIn {
    from {
        opacity: 0;
        transform: translateY(1rem);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
