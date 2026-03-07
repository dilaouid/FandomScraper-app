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
        class="group inline-flex items-center gap-3 rounded-full border border-white/10
               bg-white/[0.07] px-4 py-2.5 text-white/85 backdrop-blur-xl
               transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20
               hover:bg-white/[0.12] hover:text-white">
        <ArrowLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span class="font-medium tracking-wide">Back</span>
    </button>
</template>