<script setup lang="ts">
import { ref, computed } from 'vue'
import AppImage from '../atoms/AppImage.vue'
import type { Wiki } from '@/types'

interface Props {
    wiki: Wiki
    delay?: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
    (e: 'select', wiki: Wiki): void
}>()

const isHovered = ref(false)
const isVisible = ref(false)

// Animation delay style for card entry
const animationStyle = computed(() => ({
    '--animation-delay': `${props.delay || 0}s`,
}))

// Handle interactions
const handleMouseEnter = () => {
    isHovered.value = true
}

const handleMouseLeave = () => {
    isHovered.value = false
}

// Mount animation with IntersectionObserver for performance
import { onMounted } from 'vue'

onMounted(() => {
    // For browsers that support IntersectionObserver
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(() => {
                        isVisible.value = true
                    })
                    observer.unobserve(entry.target)
                }
            })
        }, { threshold: 0.1 })
        
        const element = document.getElementById(`wiki-card-${props.wiki.id}`)
        if (element) observer.observe(element)
    } else {
        // Fallback for browsers without IntersectionObserver
        isVisible.value = true
    }
})
</script>

<template>
    <div 
        :id="`wiki-card-${wiki.id}`"
        class="wiki-card-container transform-gpu"
        :class="{ 'card-visible': isVisible }" 
        :style="animationStyle"
        @mouseenter="handleMouseEnter" 
        @mouseleave="handleMouseLeave"
        @click="$emit('select', wiki)"
    >
        <div 
            class="wiki-card relative overflow-hidden transition-all duration-300"
            :class="{ 
                'is-hovered': isHovered
            }"
        >
            <div 
                class="border-glow absolute -inset-px rounded-[29px] z-30 pointer-events-none"
                :class="{ 'border-glow-active': isHovered }"
            ></div>
            
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.05),transparent_24%,rgba(0,0,0,0.38)_100%)] z-[1]"></div>

            <div class="card-inner relative aspect-[2/3] overflow-hidden rounded-[28px]">
                <div class="absolute inset-0 w-full h-full">
                    <AppImage 
                        :src="wiki.imageUrl" 
                        :alt="wiki.name" 
                        :width="500" 
                        :height="750" 
                        class="w-full h-full object-cover transition-transform duration-700 ease-out"
                        :class="{ 'scale-110': isHovered }"
                    />
                </div>
                
                <div class="wiki-name-container absolute bottom-0 left-0 right-0 z-10 p-4 sm:p-5">
                    <div class="wiki-name rounded-[18px] bg-gradient-to-t from-black/88 via-black/54 to-transparent p-1 text-lg font-semibold tracking-tight text-white sm:text-xl">
                        {{ wiki.name }}
                    </div>
                </div>

                <div 
                    class="wiki-hover-overlay absolute inset-0 z-10 opacity-0 transition-all duration-300"
                    :class="{ 'opacity-100': isHovered }"
                >
                    <div class="hover-shine"></div>
                    <div v-if="isHovered" class="interactive-particles absolute inset-0 pointer-events-none overflow-hidden">
                        <div v-for="n in 15" :key="`particle-${n}`" 
                             class="reactive-particle"
                             :style="`--index: ${n}; --total: 15;`">
                        </div>
                    </div>
                    <div class="absolute inset-0 flex flex-col items-center justify-center p-4">
                        <h2 class="mb-4 text-center text-2xl font-semibold tracking-tight text-white transform opacity-0 scale-90 transition-all duration-300"
                            :class="{ 'opacity-100 scale-100': isHovered }">
                            {{ wiki.name }}
                        </h2>
                        
                        <div class="explore-button flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2.5 transition-all duration-300 transform opacity-0 scale-90 group"
                            :class="{ 'opacity-100 scale-100': isHovered }">
                            <span class="text-white transition-colors group-hover:text-rose-100">Open</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-5 w-5 text-rose-300 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.wiki-card {
    transform: translateZ(0);
    will-change: transform;
    backface-visibility: hidden;
    border-radius: 28px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
    box-shadow:
        0 24px 70px rgba(0, 0, 0, 0.36),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    filter: brightness(0.84) saturate(0.8);
    transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    cursor: pointer;
    backdrop-filter: blur(20px);
}

.wiki-card.is-hovered {
    filter: brightness(1.04) saturate(1.05);
    box-shadow:
        0 34px 90px rgba(0, 0, 0, 0.44),
        0 0 40px rgba(251, 113, 133, 0.18),
        0 0 0 1px rgba(251, 113, 133, 0.14);
    transform: translateY(-8px) scale(1.02);
    z-index: 10;
}

.wiki-name-container {
    z-index: 5;
    transition: all 0.3s ease;
}

.wiki-card.is-hovered .wiki-name-container {
    opacity: 0;
    transform: translateY(22px);
}

.wiki-card.is-hovered .card-inner img {
    transform: scale(1.14);
    filter: saturate(1.08);
}

.wiki-hover-overlay {
    background:
        radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.18), transparent 24%),
        radial-gradient(circle at 80% 10%, rgba(251, 113, 133, 0.22), transparent 26%),
        linear-gradient(180deg, rgba(6, 6, 8, 0.24), rgba(6, 6, 8, 0.76));
}

.hover-shine {
    position: absolute;
    inset: -20%;
    background: linear-gradient(115deg, transparent 34%, rgba(255, 255, 255, 0.18) 50%, transparent 66%);
    transform: translateX(-120%) rotate(8deg);
    transition: transform 0.65s ease;
}

.wiki-card.is-hovered .hover-shine {
    transform: translateX(120%) rotate(8deg);
}

.wiki-card-container {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.4s ease, transform 0.4s ease;
    transition-delay: var(--animation-delay);
}

.card-visible {
    opacity: 1;
    transform: translateY(0);
}

@property --glow-angle {
    syntax: '<angle>';
    initial-value: 0turn;
    inherits: false;
}

.border-glow {
    padding: 1.5px;
    background: conic-gradient(
        from var(--glow-angle),
        transparent 60%,
        rgba(251, 113, 133, 0.18) 70%,
        rgba(251, 113, 133, 0.65) 80%,
        rgba(255, 200, 210, 0.95) 86%,
        rgba(255, 255, 255, 1) 88%,
        rgba(255, 200, 210, 0.95) 90%,
        rgba(251, 113, 133, 0.65) 96%,
        rgba(251, 113, 133, 0.18) 99%,
        transparent
    );
    -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
    mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.35s ease;
}

.border-glow-active {
    opacity: 1;
    animation: glow-spin 2.8s linear infinite;
}

@keyframes glow-spin {
    to { --glow-angle: 1turn; }
}

.interactive-particles {
    border-radius: inherit;
    z-index: 0;
}

.reactive-particle {
    --angle: calc(360deg / var(--total) * var(--index));
    --duration: calc(0.5s + (var(--index) / var(--total)) * 1.5s);
    --delay: calc(var(--index) * 0.1s);
    
    position: absolute;
    width: 4px;
    height: 4px;
    background: #fb7185;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    opacity: 0;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px 2px rgba(251, 113, 133, 0.45);
    
    animation: particleExpand var(--duration) ease-out infinite;
    animation-delay: var(--delay);
}

@keyframes particleExpand {
    0% {
        opacity: 0.8;
        transform: 
            translate(-50%, -50%) 
            rotate(var(--angle)) 
            translateY(0px);
    }
    100% {
        opacity: 0;
        transform: 
            translate(-50%, -50%) 
            rotate(var(--angle)) 
            translateY(calc(50% + 20px));
    }
}

.explore-button {
    transition: all 0.2s ease;
}

.explore-button:hover {
    background-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 15px 2px rgba(251, 113, 133, 0.12);
}
</style>