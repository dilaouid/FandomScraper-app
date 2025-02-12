<script setup lang="ts">
import Skeleton from '@/components/atoms/Skeleton.vue'
</script>

<template>
    <div class="group h-full rounded-lg bg-gradient-to-br from-red-950/20 to-black/40 
                border border-red-900/20 overflow-hidden backdrop-blur-sm">
        <!-- Header -->
        <div class="p-4 flex items-center justify-between border-b border-red-900/10">
            <div class="flex items-center gap-3">
                <Skeleton class="w-8 h-8 rounded-md" /> <!-- Icon skeleton -->
                <Skeleton class="w-24 h-4" /> <!-- Title skeleton -->
            </div>
            <div class="flex gap-2">
                <Skeleton class="w-8 h-8 rounded-md" /> <!-- Button skeleton -->
                <Skeleton class="w-8 h-8 rounded-md" /> <!-- Button skeleton -->
            </div>
        </div>

        <!-- Content -->
        <div class="p-4 space-y-2">
            <Skeleton class="w-full h-6" />
            <Skeleton class="w-3/4 h-6" />
            <Skeleton class="w-1/2 h-6" />
        </div>
    </div>
</template>
