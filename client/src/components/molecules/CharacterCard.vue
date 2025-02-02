<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Character } from '@/types'

const props = defineProps<{
    character: Character
}>()

const setImageIndex = (index: number) => {
    currentImageIndex.value = index
}

const currentImageIndex = ref(0)
const hasMultipleImages = computed(() => (props.character.data?.images?.length || 0) > 1)

const displayImage = computed(() => {
    return props.character.data?.images?.[currentImageIndex.value] || ''
})

const nextImage = () => {
    if (!props.character.data?.images) return
    currentImageIndex.value = (currentImageIndex.value + 1) % props.character.data.images.length
}

const previousImage = () => {
    if (!props.character.data?.images) return
    currentImageIndex.value = currentImageIndex.value === 0
        ? props.character.data.images.length - 1
        : currentImageIndex.value - 1
}

// Status icon
const statusIcon = computed(() => {
    switch (props.character.data?.status?.toLowerCase()) {
        case 'deceased':
            return '💀'
        case 'alive':
        case 'active':
            return '❤️'
        default:
            return '❔'
    }
})

// Gender icon
const genderIcon = computed(() => {
    switch (props.character.data?.gender?.toLowerCase()) {
        case 'male':
            return '♂️'
        case 'female':
            return '♀️'
        default:
            return ''
    }
})
</script>
<template>
    <div class="relative cursor-pointer group">
        <!-- Card container avec effet glassmorphism -->
        <div class="relative rounded-xl overflow-hidden">
            <!-- Background avec effet glassmorphism rougeâtre -->
            <div class="absolute inset-0 bg-red-20 backdrop-blur-xl" />

            <!-- Image container avec aspect ratio fixe -->
            <div class="relative aspect-square w-full">
                <!-- Container de l'image avec gestion du PNG -->
                <div class="absolute inset-0 flex items-center justify-center">
                    <div class="absolute inset-0 bg-gradient-to-br from-red-900/40 to-red-950/20 backdrop-blur-sm" />
                    <div class="absolute inset-0" :style="{
                        backgroundImage: `url(${displayImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'top center',
                        backgroundRepeat: 'no-repeat',
                        transition: 'transform 0.3s ease',
                        transform: 'scale(1.05)'
                    }" />
                </div>

                <!-- Overlay au hover -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <!-- Status & Gender badges -->
                <div class="absolute top-2 right-2 flex gap-2 z-10">
                    <span class="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
                        {{ statusIcon }}
                    </span>
                    <span v-if="character.data?.gender" 
                          class="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
                        {{ genderIcon }}
                    </span>
                </div>

                <!-- Image navigation dots -->
                <div v-if="hasMultipleImages" class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    <button v-for="(_, index) in character.data?.images" 
                            :key="index"
                            class="w-2 h-2 rounded-full transition-all duration-300 bg-white/30 hover:bg-white/50 border border-white/10"
                            :class="{ 'bg-white shadow-lg': currentImageIndex === index }"
                            @click.stop="setImageIndex(index)" />
                </div>

                <!-- Informations -->
                <div class="absolute bottom-0 inset-x-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 class="text-white font-semibold truncate text-lg">
                        {{ character.name }}
                    </h3>
                    <p v-if="character.data?.kanji" 
                       class="text-white/80 text-sm mt-1 font-japanese truncate">
                        {{ character.data.kanji }}
                    </p>
                </div>
            </div>

            <!-- Effet glossy au hover -->
            <div class="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-all duration-300" />
        </div>
    </div>
</template>

<style scoped>
.font-japanese {
    font-family: "Noto Sans JP", sans-serif;
}
</style>