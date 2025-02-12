<!-- molecules/CharacterImageGallery.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
    images: string[]
}>()

const currentIndex = ref(0)

const next = () => currentIndex.value = (currentIndex.value + 1) % props.images.length
const prev = () => currentIndex.value = currentIndex.value === 0 ? props.images.length - 1 : currentIndex.value - 1
</script>

<template>
    <div class="relative rounded-2xl overflow-hidden bg-gradient-to-b from-red-950/20 to-black/40">
        <!-- Main Image -->
        <div class="relative aspect-square lg:aspect-[4/3] overflow-hidden">
            <transition
                enter-active-class="transition-opacity duration-300 ease-out"
                leave-active-class="transition-opacity duration-300 ease-in"
                enter-from-class="opacity-0"
                leave-to-class="opacity-0"
                mode="out-in"
            >
                <img 
                    :key="currentIndex"
                    :src="images[currentIndex]" 
                    :alt="`Character image ${currentIndex + 1}`"
                    class="w-full h-full object-contain bg-gradient-to-b from-transparent to-black/20" 
                />
            </transition>

            <!-- Thumbnails -->
            <div v-if="images.length > 1"
                class="absolute bottom-0 inset-x-0 p-6 flex justify-center gap-3 
                       bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                <button 
                    v-for="(img, index) in images" 
                    :key="index"
                    @click="currentIndex = index"
                    class="relative group overflow-hidden"
                >
                    <div class="w-14 h-14 rounded-lg overflow-hidden 
                              ring-2 transition-all duration-300
                              shadow-lg shadow-black/50"
                         :class="[
                            index === currentIndex 
                                ? 'ring-red-500/70 scale-110' 
                                : 'ring-white/20 group-hover:ring-white/40'
                         ]">
                        <img :src="img" 
                             class="w-full h-full object-cover 
                                    transition-transform duration-300
                                    group-hover:scale-110" />
                    </div>
                </button>
            </div>
        </div>

        <!-- Navigation buttons -->
        <template v-if="images.length > 1">
            <button @click="prev"
                class="absolute left-4 top-1/2 -translate-y-1/2 p-3 
                       rounded-full bg-black/40 backdrop-blur-sm 
                       hover:bg-black/60 transition-all duration-300
                       group shadow-lg shadow-black/50">
                <ChevronLeft class="w-5 h-5 text-white 
                                   transition-transform duration-300
                                   group-hover:-translate-x-0.5" />
            </button>

            <button @click="next"
                class="absolute right-4 top-1/2 -translate-y-1/2 p-3 
                       rounded-full bg-black/40 backdrop-blur-sm 
                       hover:bg-black/60 transition-all duration-300
                       group shadow-lg shadow-black/50">
                <ChevronRight class="w-5 h-5 text-white 
                                    transition-transform duration-300
                                    group-hover:translate-x-0.5" />
            </button>
        </template>
    </div>
</template>