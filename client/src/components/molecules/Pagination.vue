<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    currentPage: number;
    totalPages: number;
}>();

const emit = defineEmits<{
    (e: 'change', page: number): void;
}>();

const pages = computed(() => {
    const range = [];
    const showPages = 5;
    const start = Math.max(1, props.currentPage - Math.floor(showPages / 2));
    const end = Math.min(props.totalPages, start + showPages - 1);

    for (let i = start; i <= end; i++) {
        range.push(i);
    }
    
    return range;
});

const showPrevious = computed(() => props.currentPage > 1);
const showNext = computed(() => props.currentPage < props.totalPages);
</script>

<template>
    <div class="flex gap-2 items-center">
        <!-- Previous button -->
        <button
            v-if="showPrevious"
            @click="emit('change', currentPage - 1)"
            class="p-2 rounded-lg bg-red-950/20 text-white/80 hover:text-white hover:bg-red-900/30
                   transition-all duration-300 backdrop-blur-sm"
        >
            <span class="material-icons">chevron_left</span>
        </button>

        <!-- Page numbers -->
        <div class="flex gap-2">
            <button
                v-for="page in pages"
                :key="page"
                @click="emit('change', page)"
                :class="[
                    'px-4 py-2 rounded-lg transition-all duration-300 backdrop-blur-sm',
                    page === currentPage
                        ? 'bg-red-500/20 text-white'
                        : 'bg-red-950/20 text-white/80 hover:text-white hover:bg-red-900/30'
                ]"
            >
                {{ page }}
            </button>
        </div>

        <!-- Next button -->
        <button
            v-if="showNext"
            @click="emit('change', currentPage + 1)"
            class="p-2 rounded-lg bg-red-950/20 text-white/80 hover:text-white hover:bg-red-900/30
                   transition-all duration-300 backdrop-blur-sm"
        >
            <span class="material-icons">chevron_right</span>
        </button>
    </div>
</template>