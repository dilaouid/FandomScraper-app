<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ArrowLeft } from 'lucide-vue-next';

const props = defineProps<{
    to?: string;
}>();

const router = useRouter()

const handleBack = () => {
    if (props.to) {
        router.push(props.to)
    } else {
        router.back()
    }
}
</script>

<template>
    <button @click="handleBack" 
        class="group flex items-center gap-3 px-4 py-2.5 rounded-lg 
               text-white/90 hover:text-white
               bg-gradient-to-br from-red-950/40 to-red-900/20 
               hover:from-red-900/50 hover:to-red-800/30
               border border-red-900/20 hover:border-red-800/30
               transition-all duration-300 backdrop-blur-sm
               shadow-lg shadow-red-950/20">
        <ArrowLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span class="font-medium tracking-wide">Back</span>
    </button>
</template>