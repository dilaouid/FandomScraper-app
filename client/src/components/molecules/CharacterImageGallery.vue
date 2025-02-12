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
    <div class="relative rounded-xl overflow-hidden">
        <div class="relative overflow-hidden">
            <img :src="images[currentIndex]" :alt="`Character image ${currentIndex + 1}`"
                class="w-full max-h-[600px] object-contain bg-black/40" />

            <!-- Miniatures en bas -->
            <div v-if="images.length > 1"
                class="absolute bottom-0 inset-x-0 p-4 flex justify-center gap-2 bg-gradient-to-t from-black/60 to-transparent">
                <button v-for="(img, index) in images" :key="index" @click="currentIndex = index"
                    class="w-12 h-12 rounded overflow-hidden transition-transform hover:scale-110"
                    :class="index === currentIndex ? 'ring-2 ring-white' : 'opacity-70'">
                    <img :src="img" class="w-full h-full object-cover" />
                </button>
            </div>
        </div>

        <!-- Navigation buttons -->
        <button v-if="images.length > 1" @click="prev"
            class="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors">
            <ChevronLeft class="w-6 h-6 text-white" />
        </button>

        <button v-if="images.length > 1" @click="next"
            class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors">
            <ChevronRight class="w-6 h-6 text-white" />
        </button>
    </div>
</template>