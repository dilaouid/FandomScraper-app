<script setup lang="ts">
import { useRouter } from 'vue-router'
import { AlertCircle } from 'lucide-vue-next'

const router = useRouter()

defineProps<{
    characterId: string | number
    wikiName: string
}>()
const handleBack = () => {
    router.back()
}
</script>


<template>
    <div class="min-h-[80vh] flex items-center justify-center px-4">
        <div class="max-w-2xl w-full space-y-8">
            <div class="border-red-500/50 bg-red-950/50 backdrop-blur-xl p-4 rounded-lg flex gap-3">
                <AlertCircle class="h-5 w-5 text-red-400 shrink-0 mt-1" />
                <div>
                    <h3 class="text-xl font-semibold mb-2 text-red-50">Character not found</h3>
                    <p class="text-base text-red-200">
                        Sorry, we couldn't find the character with ID <b>{{ characterId }}</b> in the {{ wikiName }} wiki.
                    </p>
                </div>
            </div>

            <div class="text-center space-y-6">
                <div class="p-8 rounded-xl bg-black/30 border border-white/10 backdrop-blur-xl">
                    <h2 class="text-2xl font-bold mb-4 text-white">What you can try:</h2>
                    <ul class="space-y-3 text-left text-gray-200">
                        <li class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <span class="text-blue-200">1</span>
                            </div>
                            <span>Check if the character ID is correct</span>
                        </li>
                        <li class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <span class="text-blue-200">2</span>
                            </div>
                            <span>Return to the character list and try searching again</span>
                        </li>
                    </ul>
                </div>

                <div class="flex flex-col gap-4">
                    <button @click="handleBack"
                        class="px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors duration-200 text-gray-200">
                        ← Go back
                    </button>
                    <router-link :to="`/${wikiName}/characters`"
                        class="px-6 py-3 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-500/20 transition-colors duration-200">
                        Characters list
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>