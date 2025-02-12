<script setup lang="ts">
import { useRouter } from 'vue-router'
import { AlertCircle } from 'lucide-vue-next'

const router = useRouter()

defineProps<{
    characterId: string | number
    wikiName: string
}>()

const handleBack = () => router.back()
</script>

<template>
    <div class="min-h-[80vh] flex items-center justify-center px-4">
        <div class="max-w-2xl w-full space-y-8">
            <!-- Alert -->
            <div class="border border-red-500/30 bg-gradient-to-br 
                        from-red-950/50 to-red-900/30 backdrop-blur-xl 
                        p-6 rounded-xl flex gap-4 shadow-lg">
                <AlertCircle class="h-6 w-6 text-red-400 shrink-0 mt-1" />
                <div>
                    <h3 class="text-xl font-semibold mb-2 text-red-50">
                        Character not found
                    </h3>
                    <p class="text-base text-red-200/90 leading-relaxed">
                        Sorry, we couldn't find the character with ID 
                        <span class="font-semibold text-red-100">{{ characterId }}</span> 
                        in the 
                        <span class="font-semibold text-red-100">{{ wikiName }}</span> wiki.
                    </p>
                </div>
            </div>

            <!-- Help Section -->
            <div class="text-center space-y-8">
                <div class="p-8 rounded-xl bg-gradient-to-br 
                           from-black/40 to-black/20 border border-white/10 
                           backdrop-blur-xl shadow-lg">
                    <h2 class="text-2xl font-bold mb-6 text-white">
                        What you can try:
                    </h2>
                    <ul class="space-y-4 text-left text-gray-200">
                        <li class="flex items-center gap-4">
                            <div class="w-9 h-9 rounded-full bg-red-500/20 
                                      flex items-center justify-center 
                                      border border-red-500/30">
                                <span class="text-red-200 font-medium">1</span>
                            </div>
                            <span class="text-white/90">
                                Check if the character ID is correct
                            </span>
                        </li>
                        <li class="flex items-center gap-4">
                            <div class="w-9 h-9 rounded-full bg-red-500/20 
                                      flex items-center justify-center 
                                      border border-red-500/30">
                                <span class="text-red-200 font-medium">2</span>
                            </div>
                            <span class="text-white/90">
                                Return to the character list and try searching again
                            </span>
                        </li>
                    </ul>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col gap-4">
                    <button @click="handleBack"
                        class="px-6 py-3 rounded-lg bg-gradient-to-r 
                               from-white/10 to-white/5 hover:from-white/15 
                               hover:to-white/10 border border-white/10 
                               transition-all duration-300 text-white 
                               shadow-lg group">
                        <span class="flex items-center justify-center gap-2">
                            <ArrowLeft class="w-4 h-4 transition-transform 
                                            group-hover:-translate-x-1" />
                            Go back
                        </span>
                    </button>
                    
                    <router-link :to="`/${wikiName}/characters`"
                        class="px-6 py-3 rounded-lg bg-gradient-to-r 
                               from-red-500/20 to-red-600/20 
                               hover:from-red-500/30 hover:to-red-600/30 
                               text-red-200 border border-red-500/30 
                               transition-all duration-300 shadow-lg 
                               hover:shadow-red-950/20">
                        Characters list
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>