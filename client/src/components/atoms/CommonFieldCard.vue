<script setup lang="ts">
import type { IconComponent } from '@/types'
import { Eye, List } from 'lucide-vue-next'

const props = defineProps<{
  fieldName: string,
  fieldValue: any,
  inFields: boolean,  // Si le champ est dans fields[]
  inArrayFields: boolean,  // Si le champ est dans arrayFields[]
  getIcon: (field: string) => IconComponent,
  getFieldColor: (field: string) => string,
  formatFieldName: (field: string) => string,
  requestedButEmpty: boolean // Si le champ a été demandé mais n'existe pas
}>()

const emit = defineEmits<{
  (e: 'toggle-view'): void
  (e: 'toggle-array'): void
}>()
</script>

<template>
  <div v-if="!requestedButEmpty"
       :class="[
         getFieldColor(fieldName),
         'p-4 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 relative transition-all duration-300'
       ]"
  >
    <div class="flex items-center gap-2 mb-2">
      <component :is="getIcon(fieldName)" class="w-4 h-4 opacity-60" />
      <span class="text-sm text-white/60">{{ formatFieldName(fieldName) }}</span>
      <button 
        class="ml-auto p-1 rounded hover:bg-white/10 transition-colors"
        @click="$emit('toggle-view')"
        :class="{'text-red-400': inFields}"
      >
        <Eye class="w-4 h-4" />
      </button>
      <button 
        class="p-1 rounded hover:bg-white/10 transition-colors"
        @click="$emit('toggle-array')"
        :class="{'text-red-400': inArrayFields}"
      >
        <List class="w-4 h-4" />
      </button>
    </div>

    <div v-if="inFields || inArrayFields" class="text-lg font-medium text-white">
      <template v-if="Array.isArray(fieldValue)">
        <template v-if="!inArrayFields">{{ fieldValue[0] }}</template>
        <template v-else>
          <ul class="list-disc list-inside">
            <li v-for="(item, idx) in fieldValue" :key="idx">{{ item }}</li>
          </ul>
        </template>
      </template>
      <template v-else>{{ fieldValue }}</template>
    </div>
  </div>
</template>