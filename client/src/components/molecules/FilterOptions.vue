<script setup lang="ts">
import { useWikiStore } from '@/stores/useWikiStore';
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
    <div class="flex flex-wrap gap-2">
        <button v-for="filter in availableFilters" 
                :key="filter.id" 
                @click="toggleOption(filter.id)"
                class="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-300" 
                :class="[
                    modelValue.includes(filter.id)
                        ? 'border-rose-300/40 bg-rose-400/15 text-white shadow-[0_10px_30px_rgba(244,63,94,0.18)]'
                        : 'border-white/10 bg-white/[0.06] text-white/70 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.1] hover:text-white'
                ]">
            <span class="text-lg">{{ filter.icon }}</span>
            {{ filter.label }}
        </button>
    </div>
</template>
