<script setup lang="ts">
const props = defineProps<{
    modelValue: string[]
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string[]): void
}>()

const options = [
    { id: 'status', label: 'Status', icon: '🎯' },
    { id: 'gender', label: 'Genre', icon: '👤' },
    { id: 'kanji', label: 'Kanji', icon: '漢' }
]

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
        <button v-for="option in options" :key="option.id" @click="toggleOption(option.id)"
            class="px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2" :class="[
                modelValue.includes(option.id)
                    ? 'bg-red-500/30 text-white ring-2 ring-red-500/50'
                    : 'bg-red-950/20 text-white/70 hover:bg-red-900/30 hover:text-white'
            ]">
            <span class="text-lg">{{ option.icon }}</span>
            {{ option.label }}
        </button>
    </div>
</template>
