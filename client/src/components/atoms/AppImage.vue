<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
    src: string
    alt: string
    width?: number
    height?: number
    class?: string | Record<string, boolean>
}>()

const isLoaded = ref(false)
const hasError = ref(false)
const imageRef = ref<HTMLImageElement | null>(null)

// native lazy loading for better performance
onMounted(() => {
    if (imageRef.value && 'loading' in HTMLImageElement.prototype) {
        imageRef.value.loading = 'lazy'
    }
})

const handleLoad = () => {
    isLoaded.value = true
}

const handleError = () => {
    hasError.value = true
}

// Calculate aspect ratio for placeholder
const aspectRatio = props.width && props.height
    ? (props.height / props.width) * 100
    : 150 // Default aspect ratio (3:2)
</script>

<template>
    <div 
        class="relative w-full overflow-hidden" 
        :style="{ paddingBottom: `${aspectRatio}%` }"
    >
        <!-- Placeholder/Skeleton -->
        <div 
            v-if="!isLoaded && !hasError" 
            class="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 animate-pulse"
        ></div>
        
        <!-- Fallback for error -->
        <div 
            v-if="hasError" 
            class="absolute inset-0 bg-zinc-900 flex items-center justify-center"
        >
            <div class="text-zinc-600 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Image error</span>
            </div>
        </div>
        
        <!-- Actual image -->
        <img
            ref="imageRef"
            :src="src"
            :alt="alt"
            :width="width"
            :height="height"
            @load="handleLoad"
            @error="handleError"
            class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
            :class="[isLoaded ? 'opacity-100' : 'opacity-0', props.class || '']"
        />
    </div>
</template>