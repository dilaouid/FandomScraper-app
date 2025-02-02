<!-- FilterOptions.vue -->
<script setup lang="ts">
import { useWikiStore } from '@/stores/useWikIStore';
import { computed } from 'vue'

interface Props {
    modelValue: string[];
    wikiName: string;
}

const props = defineProps<Props>()
const store = useWikiStore()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string[]): void;
}>()

const availableFilters = computed(() => store.getWikiFilters(props.wikiName))

const toggleOption = (optionId: string) => {
    const newValue = [...props.modelValue]
    const index = newValue.indexOf(optionId)

    if (index === -1) {
        newValue.push(optionId)
    } else {
        newValue.splice(index, 1)
    }

    emit('update:modelValue', newValue)
}
</script>


<template>
    <div class="flex gap-3">
        <button v-for="filter in availableFilters" 
                :key="filter.id" 
                @click="toggleOption(filter.id)"
                class="px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2" 
                :class="[
                    modelValue.includes(filter.id)
                        ? 'bg-red-500/30 text-white ring-2 ring-red-500/50'
                        : 'bg-red-950/20 text-white/70 hover:bg-red-900/30 hover:text-white'
                ]">
            <span class="text-lg">{{ filter.icon }}</span>
            {{ filter.label }}
        </button>
    </div>
</template>
