<script setup lang="ts">
import { ref, watch } from 'vue'
import debounce from 'lodash/debounce'

const props = defineProps<{
    modelValue: string;
    placeholder?: string;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'search', value: string): void;
}>();

const searchInput = ref(props.modelValue);

const debouncedSearch = debounce((value: string) => {
    emit('search', value);
}, 300);

watch(searchInput, (newValue) => {
    emit('update:modelValue', newValue);
    debouncedSearch(newValue);
});
</script>

<template>
    <div class="relative w-full max-w-md">
        <input v-model="searchInput" type="text" :placeholder="placeholder" class="w-full px-4 py-2 pl-10 bg-red-950/20 border border-red-900/30 rounded-lg
                   text-white placeholder:text-white/50 focus:outline-none focus:ring-2
                   focus:ring-red-500/50 transition-all duration-300 backdrop-blur-sm" />
        <span class="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
            search
        </span>
    </div>
</template>