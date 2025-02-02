<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = defineProps<{
    to?: string;
}>();

const router = useRouter();

const handleClick = () => {
    if (props.to) {
        router.push(props.to);
    } else {
        router.back();
    }
};
</script>

<template>
    <button @click="handleClick" class="flex items-center gap-2 px-4 py-2 rounded-lg text-white/80 hover:text-white 
                   bg-red-950/20 hover:bg-red-900/30 transition-all duration-300 backdrop-blur-sm">
        <span class="material-icons">arrow_back</span>
        <span class="font-medium">Retour</span>
    </button>
</template>