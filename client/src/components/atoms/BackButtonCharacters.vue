<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleBack = () => {
  router.back()
}
</script>

<template>
  <button @click="handleBack" class="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
    ← Back
  </button>
</template>