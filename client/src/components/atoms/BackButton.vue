<script setup lang="ts">
import { useRouter } from 'vue-router';

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
    <button @click="handleBack" class="flex items-center gap-2 px-4 py-2 rounded-lg text-white/80 hover:text-white 
                   bg-red-950/20 hover:bg-red-900/30 transition-all duration-300 backdrop-blur-sm">
        <span class="material-icons">arrow_back</span>
        <span class="font-medium">Back</span>
    </button>
</template>