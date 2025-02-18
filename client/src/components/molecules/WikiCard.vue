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
            class="wiki-card relative rounded-lg overflow-hidden bg-zinc-900 shadow-lg transition-all duration-300"
            :class="{ 
                'is-hovered': isHovered
            }"
        >
            <div 
                class="border-glow absolute -inset-px rounded-lg z-30 pointer-events-none overflow-hidden"
                :class="{ 'border-glow-active': isHovered }"
            >
                <div class="border-line top"></div>
                <div class="border-line right"></div>
                <div class="border-line bottom"></div>
                <div class="border-line left"></div>
                
                <!-- Pulsing glow frame -->
                <div class="pulse-frame"></div>
            </div>
            
            <!-- Card interior -->
            <div class="card-inner relative aspect-[2/3] overflow-hidden">
                <!-- Image with optimization -->
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
                
                <!-- Always visible wiki name with gradient background -->
                <div class="wiki-name-container absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent py-3 px-3">
                    <div class="wiki-name text-white text-center font-medium truncate">
                        {{ wiki.name }}
                    </div>
                </div>
                
                <!-- Hover overlay -->
                <div 
                    class="absolute inset-0 bg-black/70 opacity-0 transition-opacity duration-300 z-10"
                    :class="{ 'opacity-100': isHovered }"
                >
                    <!-- Interactive particles on hover -->
                    <div v-if="isHovered" class="interactive-particles absolute inset-0 pointer-events-none overflow-hidden">
                        <div v-for="n in 15" :key="`particle-${n}`" 
                             class="reactive-particle"
                             :style="`--index: ${n}; --total: 15;`">
                        </div>
                    </div>
                    
                    <!-- Centered content on hover -->
                    <div class="absolute inset-0 flex flex-col items-center justify-center p-4">
                        <h2 class="text-xl sm:text-2xl font-bold text-white mb-4 text-center transform opacity-0 scale-90 transition-all duration-300"
                            :class="{ 'opacity-100 scale-100': isHovered }">
                            {{ wiki.name }}
                        </h2>
                        
                        <div class="explore-button bg-red-600/20 border border-red-500/50 rounded-md py-2 px-4 flex items-center transition-all duration-300 transform opacity-0 scale-90 group"
                            :class="{ 'opacity-100 scale-100': isHovered }">
                            <span class="text-white group-hover:text-red-200 transition-colors">Explore the characters</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 text-red-500 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
/*  card styling */
.wiki-card {
    transform: translateZ(0);
    will-change: transform;
    backface-visibility: hidden;
    filter: brightness(0.8) saturate(0.7);
    transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    cursor: pointer;
}

/* Card hover state */
.wiki-card.is-hovered {
    filter: brightness(1.1) saturate(1.2);
    box-shadow: 0 15px 25px -5px rgba(0, 0, 0, 0.5);
    transform: translateY(-6px) scale(1.02);
    z-index: 10;
}

/* Always visible wiki name */
.wiki-name-container {
    z-index: 5;
    transition: all 0.3s ease;
}

.wiki-card.is-hovered .wiki-name-container {
    opacity: 0;
    transform: translateY(20px);
}

/* Entrance animation */
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

/*  glow effect */
.border-glow {
    opacity: 0;
    transition: opacity 0.3s ease;
}

.border-glow-active {
    opacity: 1;
}

.border-line {
    position: absolute;
    background: linear-gradient(90deg, transparent, #ff3030, transparent);
    box-shadow: 0 0 15px 3px rgba(255, 0, 0, 0.7);
}

.top, .bottom {
    height: 3px;
    left: 0;
    width: 100%;
}

.left, .right {
    width: 3px;
    top: 0;
    height: 100%;
}

.top {
    top: 0;
    animation: moveX 3s infinite;
}

.right {
    right: 0;
    background: linear-gradient(180deg, transparent, #ff3030, transparent);
    animation: moveY 3s infinite;
    animation-delay: 0.75s;
}

.bottom {
    bottom: 0;
    animation: moveXReverse 3s infinite;
    animation-delay: 1.5s;
}

.left {
    left: 0;
    background: linear-gradient(180deg, transparent, #ff3030, transparent);
    animation: moveYReverse 3s infinite;
    animation-delay: 2.25s;
}

@keyframes moveX {
    0%, 100% {
        transform: translateX(-100%);
        opacity: 0;
    }
    40%, 60% {
        opacity: 1;
    }
    100% {
        transform: translateX(100%);
        opacity: 0;
    }
}

@keyframes moveXReverse {
    0%, 100% {
        transform: translateX(100%);
        opacity: 0;
    }
    40%, 60% {
        opacity: 1;
    }
    100% {
        transform: translateX(-100%);
        opacity: 0;
    }
}

@keyframes moveY {
    0%, 100% {
        transform: translateY(-100%);
        opacity: 0;
    }
    40%, 60% {
        opacity: 1;
    }
    100% {
        transform: translateY(100%);
        opacity: 0;
    }
}

@keyframes moveYReverse {
    0%, 100% {
        transform: translateY(100%);
        opacity: 0;
    }
    40%, 60% {
        opacity: 1;
    }
    100% {
        transform: translateY(-100%);
        opacity: 0;
    }
}

/* Pulsing glow frame */
.pulse-frame {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    border: 1px solid rgba(255, 48, 48, 0.3);
    box-shadow: 
        inset 0 0 15px 2px rgba(255, 48, 48, 0.15),
        0 0 15px 2px rgba(255, 48, 48, 0.15);
    animation: pulseBorder 3s infinite;
}

@keyframes pulseBorder {
    0%, 100% {
        opacity: 0.3;
    }
    50% {
        opacity: 0.7;
    }
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
    background: #ff5252;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    opacity: 0;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px 2px rgba(255, 48, 48, 0.6);
    
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
    background-color: rgba(239, 68, 68, 0.3);
    box-shadow: 0 0 15px 2px rgba(239, 68, 68, 0.2);
}
</style>