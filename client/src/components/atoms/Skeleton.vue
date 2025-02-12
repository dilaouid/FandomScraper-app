<script setup lang="ts">
defineProps<{
    className?: string
}>()
</script>

<template>
    <div :class="[
        'animate-pulse bg-gradient-to-r from-red-950/40 to-red-900/20 rounded-lg',
        className
    ]">
        <div class="w-full h-full bg-white/5" />
    </div>
</template>
