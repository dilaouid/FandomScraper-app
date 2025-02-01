<script setup lang="ts">
import WikiCard from '../molecules/WikiCard.vue'
import type { Wiki } from '@/types'

interface Props {
    wikis: Wiki[]
    selectedWikiId: string | null
}

defineProps<Props>()

defineEmits<{
    (e: 'select', wiki: Wiki): void
}>()
</script>

<template>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
        <WikiCard v-for="wiki in wikis" :key="wiki.id" :wiki="wiki"
            :is-selected="selectedWikiId && selectedWikiId !== wiki.id" @select="$emit('select', wiki)" />
    </div>
</template>
