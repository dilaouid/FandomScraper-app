<script setup lang="ts">
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

const handleWikiSelect = (wiki: Wiki) => {
    router.push(`/${wiki.id}/characters`)
}
</script>

<template>
    <PageLayout>
        <template #background>
            <div class="fixed inset-0 bg-black overflow-hidden">
                <!-- Dark gradient base -->
                <div class="absolute inset-0 bg-gradient-radial from-zinc-800/30 to-black"></div>
                
                <div class="absolute inset-0 noise-texture opacity-10"></div>
                
                <!-- Accent lines -->
                <div class="accent-line-container">
                    <div class="accent-line line-1"></div>
                    <div class="accent-line line-2"></div>
                    <div class="accent-line line-3"></div>
                </div>
                
                <!-- Floating emblems -->
                <div class="emblem-container">
                    <div v-for="n in 5" :key="`emblem-${n}`" 
                         class="floating-emblem"
                         :style="`--index: ${n}; --total: 5;`">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 2L24.5 13.5L36 20L24.5 26.5L20 38L15.5 26.5L4 20L15.5 13.5L20 2Z" 
                                  fill="none" 
                                  stroke="rgba(255,30,30,0.15)" 
                                  stroke-width="1" />
                        </svg>
                    </div>
                </div>
                
                <!-- Subtle vignette for depth -->
                <div class="absolute inset-0 vignette-overlay"></div>
            </div>
        </template>

        <!-- Header -->
        <div class="relative z-10 text-center pt-12 pb-8 select-none">
            <div class="mb-6 inline-block">
                <div class="mb-1 text-red-600/30 text-sm uppercase tracking-widest font-mono">FandomScraper Library</div>
                <h1 class="text-5xl md:text-6xl font-bold text-white header-shadow">
                    <span class="bg-clip-text text-transparent neo-gradient">Fandom</span>
                    <span class="text-white">Scraper</span>
                </h1>
                <div class="h-px w-48 mx-auto bg-gradient-to-r from-transparent via-red-500 to-transparent mt-4"></div>
            </div>
            
            <div class="max-w-2xl mx-auto px-4 h-10 overflow-hidden mb-8">
                <p class="text-red-500 font-mono text-sm md:text-base neo-terminal">
                    <span class="neo-prompt">></span> 
                    <span class="neo-text">{{ isLoading ? 'Initializing database connection...' : !isError ? 'Select a wiki to explore characters' : 'Error: Connection failed' }}</span>
                </p>
            </div>
        </div>

        <!-- Main Content -->
        <main class="relative z-10 container mx-auto px-4 pb-12">
            <div v-if="isError" class="error-container text-center mx-auto max-w-lg">
                <div class="bg-red-950/30 backdrop-blur-sm border border-red-800/50 rounded-lg p-6 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                    <div class="flex items-center justify-center mb-4">
                        <div class="w-12 h-12 rounded-full bg-red-900/50 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>
                    <h2 class="text-red-500 text-xl font-bold mb-2">Error 500: Server Malfunction</h2>
                    <p class="text-red-300">An error occurred while connecting to the database. Please try again later.</p>
                    <p v-if="error" class="text-red-400/80 text-sm mt-4 p-2 bg-red-950/50 rounded font-mono">{{ error.message }}</p>
                </div>
            </div>

            <div v-else-if="isLoading" class="loading-container flex flex-col items-center justify-center py-12">
                <LoadingSpinner />
                <div class="matrix-text font-mono text-red-500/80 mt-4 text-sm">
                    <span class="inline-block">Scanning wikis database</span>
                    <span class="loading-dots"></span>
                </div>
            </div>

            <div v-else>
                <WikiGrid :wikis="wikis || []" @select="handleWikiSelect" />
            </div>
        </main>
    </PageLayout>
</template>

<style>
/* Modern header styling */
.header-shadow {
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.neo-gradient {
    background-image: linear-gradient(135deg, #ff3a3a, #ff6b6b);
}

/* Sleek terminal */
.neo-terminal {
    display: flex;
    align-items: center;
}

.neo-prompt {
    color: #ff3a3a;
    margin-right: 8px;
}

.neo-text {
    position: relative;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    animation: neoType 2s steps(30) forwards;
    width: 0;
    color: rgba(255, 255, 255, 0.8);
}

@keyframes neoType {
    to { width: 100%; }
}

/* Background styling */
.bg-gradient-radial {
    background: radial-gradient(circle at center, var(--tw-gradient-from), var(--tw-gradient-to));
}

/* Noise texture */
.noise-texture {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 200px 200px;
    mix-blend-mode: overlay;
}

/* Accent lines  */
.accent-line-container {
    position: absolute;
    inset: 0;
    overflow: hidden;
    opacity: 0.15;
}

.accent-line {
    position: absolute;
    height: 1px;
    width: 100%;
    background: linear-gradient(90deg, transparent, #ff3030, transparent);
    transform: translateZ(0);
}

.line-1 {
    top: 25%;
    animation: floatLine 15s ease-in-out infinite;
}

.line-2 {
    top: 50%;
    animation: floatLine 18s ease-in-out infinite reverse;
    animation-delay: -5s;
}

.line-3 {
    top: 75%;
    animation: floatLine 20s ease-in-out infinite;
    animation-delay: -10s;
}

@keyframes floatLine {
    0%, 100% {
        opacity: 0.3;
        transform: scaleX(0.8) translateX(-10%);
    }
    50% {
        opacity: 0.7;
        transform: scaleX(1.2) translateX(10%);
    }
}

/* Floating emblems */
.emblem-container {
    position: absolute;
    inset: 0;
    overflow: hidden;
}

.floating-emblem {
    --angle: calc(360deg / var(--total) * var(--index));
    position: absolute;
    opacity: 0.5;
    transform: translateZ(0); 
    top: calc(20% + (var(--index) * 15%));
    left: calc(10% + (var(--index) * 20%));
    animation: floatEmblem 25s linear infinite;
    animation-delay: calc(var(--index) * -5s);
}

@keyframes floatEmblem {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 0.3;
    }
    25% {
        opacity: 0.6;
    }
    50% {
        transform: translateY(-40px) rotate(180deg);
        opacity: 0.3;
    }
    75% {
        opacity: 0.6;
    }
    100% {
        transform: translateY(0) rotate(360deg);
        opacity: 0.3;
    }
}

/* Subtle vignette overlay */
.vignette-overlay {
    background: radial-gradient(
        circle at center,
        transparent 40%,
        rgba(0, 0, 0, 0.4) 100%
    );
}

/* Loading animation */
.loading-dots:after {
    content: '.';
    animation: dots 1.5s steps(5, end) infinite;
    display: inline-block;
    width: 24px;
    text-align: left;
}

@keyframes dots {
    0%, 20% { content: '.'; }
    40% { content: '..'; }
    60% { content: '...'; }
    80%, 100% { content: ''; }
}
</style>