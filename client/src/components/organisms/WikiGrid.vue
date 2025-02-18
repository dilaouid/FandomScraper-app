<script setup lang="ts">
import WikiCard from '../molecules/WikiCard.vue'
import type { Wiki } from '@/types'

interface Props {
    wikis: Wiki[]
}

defineProps<Props>()

defineEmits<{
    (e: 'select', wiki: Wiki): void
}>()
</script>

<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 px-2">
        <WikiCard 
            v-for="(wiki, index) in wikis" 
            :key="wiki.id" 
            :wiki="wiki"
            :delay="index * 0.1"
            @select="$emit('select', wiki)" 
        />
    </div>
</template>