<script setup lang="ts">
import FlagFR from '@/assets/icons/fr.svg'
import FlagEN from '@/assets/icons/gb.svg'

interface Props {
  currentLang: 'en' | 'fr'
  onClick?: () => void
}

defineProps<Props>()
</script>

<template>
  <button @click="onClick" class="badge rounded-full">
    <div class="flag-section" :class="{ active: currentLang === 'fr' }">
      <img :src="FlagFR" alt="FR" class="flag" />
    </div>
    <div class="flag-section" :class="{ active: currentLang === 'en' }">
      <img :src="FlagEN" alt="EN" class="flag" />
    </div>
  </button>
</template>
<style scoped>
.badge {
  display: flex;
  height: 24px; /* Réduit de 32px */
  border-radius: 12px; /* Ajusté pour le nouveau height */
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.flag-section {
  width: 32px; /* Réduit de 40px */
  height: 100%;
  position: relative;
  opacity: 0.5;
  transition: all 0.2s;
}

.flag-section.active {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
}

.flag {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.8);
}

.flag-section.active .flag {
  filter: saturate(1);
}
</style>
