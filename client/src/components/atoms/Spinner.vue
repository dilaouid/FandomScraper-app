<script setup lang="ts">
defineProps<{
    size?: 'sm' | 'md' | 'lg'
    className?: string
}>()
</script>

<template>
    <div :class="[
        'relative flex items-center justify-center',
        className
    ]">
        <div class="absolute inset-0 border-2 rounded-full border-red-500/20"
             :class="{
                 'w-4 h-4': size === 'sm',
                 'w-6 h-6': size === 'md',
                 'w-8 h-8': size === 'lg'
             }" />
        <div class="animate-spin rounded-full border-2 border-red-500 border-t-transparent"
             :class="{
                 'w-4 h-4': size === 'sm',
                 'w-6 h-6': size === 'md',
                 'w-8 h-8': size === 'lg'
             }" />
    </div>
</template>

