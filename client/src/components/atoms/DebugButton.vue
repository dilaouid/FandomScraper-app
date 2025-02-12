<script setup lang="ts">
import { ref } from 'vue'
import { Code2 } from 'lucide-vue-next'
import DebugModal from '../molecules/DebugModal.vue';

const isOpen = ref(false)
const toggleModal = () => isOpen.value = !isOpen.value
</script>

<template>
  <div>
    <button 
      @click="toggleModal"
      class="fixed bottom-4 left-4 z-50 p-3 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-red-500/20"
      title="Debug FandomScraper"
    >
      <Code2 class="w-5 h-5 text-red-200" />
    </button>

    <DebugModal
      v-model:open="isOpen" 
      :route="$route"
    />
  </div>
</template>