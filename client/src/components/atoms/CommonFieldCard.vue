<!-- atoms/CommonFieldCard.vue -->
<script setup lang="ts">
import type { IconComponent } from '@/types'
import { Eye, List } from 'lucide-vue-next'

const props = defineProps<{
  fieldName: string,
  fieldValue: any,
  inFields: boolean,
  inArrayFields: boolean,
  getIcon: (field: string) => IconComponent,
  getFieldColor: (field: string) => string,
  formatFieldName: (field: string) => string,
  requestedButEmpty: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-view'): void
  (e: 'toggle-array'): void
}>()
</script>

<template>
  <div v-if="!requestedButEmpty" 
       class="h-full group relative rounded-lg border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm 
              hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300">
    <div class="p-4">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <component :is="getIcon(fieldName)" 
                    class="w-4 h-4 text-white/40 group-hover:text-red-400/80" />
          <span class="text-sm font-medium text-white/60 group-hover:text-white/80">
            {{ formatFieldName(fieldName) }}
          </span>
        </div>

        <div class="flex items-center gap-1">
          <button class="p-1.5 rounded-md hover:bg-white/5 transition-colors"
                  :class="{ 'text-red-400': inFields }" 
                  @click="$emit('toggle-view')">
            <Eye class="w-3.5 h-3.5" />
          </button>
          <button class="p-1.5 rounded-md hover:bg-white/5 transition-colors"
                  :class="{ 'text-red-400': inArrayFields }" 
                  @click="$emit('toggle-array')">
            <List class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="mt-3">
        <template v-if="inFields || inArrayFields">
          <div :class="{ 'space-y-1.5': inArrayFields }">
            <template v-if="Array.isArray(fieldValue)">
              <template v-if="!inArrayFields">
                <span class="text-white/90">{{ fieldValue[0] }}</span>
              </template>
              <template v-else>
                <div v-for="(item, idx) in fieldValue" 
                     :key="idx" 
                     class="px-3 py-2 rounded-md bg-black/20 text-sm text-white/80
                            border border-white/[0.06] hover:border-white/[0.1]
                            transition-all duration-200 hover:translate-x-1">
                  {{ item }}
                </div>
              </template>
            </template>
            <template v-else>
              <span class="text-white/90">{{ fieldValue }}</span>
            </template>
          </div>
        </template>
        <template v-else>
          <div class="flex items-center gap-2 text-white/40">
            <Eye class="w-3.5 h-3.5" />
            <span class="text-sm">Hidden</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>