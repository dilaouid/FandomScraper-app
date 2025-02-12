<!-- CharacterDetail.vue -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

import {
    Eye, List,
    User, Heart, Cake, MapPin,
    Briefcase, Users, Book, Film,
    Flag, Type, Quote, Sword,
    Globe, Calendar, Activity
} from 'lucide-vue-next'
import type { IconComponent } from '@/types';

interface Props {
    field: string
    value: any
    isArray: boolean
    isActive: boolean
    requestedButEmpty?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'toggle-visibility'): void
    (e: 'toggle-array'): void
}>()

const detailRef = ref<HTMLElement>()
const isVisible = ref(false)

const getIcon = (field: string): IconComponent => {
    const icons: Record<string, IconComponent> = {
        name: User,
        age: Cake,
        gender: Heart,
        status: Activity,
        affiliation: MapPin,
        occupations: Briefcase,
        relatives: Users,
        manga: Book,
        episode: Film,
        nationality: Flag,
        kanji: Type,
        quote: Quote,
        weapon: Sword,
        birthplace: Globe,
        birthday: Calendar,
    }
    return icons[field] || User
}

const formatFieldName = (field: string): string => {
    return field.replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
}

onMounted(() => {
    if (!detailRef.value) return

    const observer = new IntersectionObserver(
        ([entry]) => {
            isVisible.value = entry.isIntersecting
        },
        { threshold: 0.1 }
    )

    observer.observe(detailRef.value)
})

const isCompactField = computed(() => {
    const compactFields = ['birthday', 'height', 'weight', 'age', 'gender', 'nationality'];
    return compactFields.includes(props.field);
});

const cardSpan = computed(() => {
    if (!props.value) return 'col-span-1';
    if (isCompactField.value) return 'col-span-1';
    if (Array.isArray(props.value) && props.value.length > 2) return 'col-span-2';
    return 'col-span-1';
});
</script>
<template>
    <div v-if="!requestedButEmpty" ref="detailRef" :class="[
        cardSpan,
        'group transition-all duration-500 ease-in-out',
        {
            'opacity-75 hover:opacity-100': !isActive,
            'translate-x-0 opacity-100': isVisible,
            '-translate-x-4 opacity-0': !isVisible
        }
    ]">
        <div class="h-full relative rounded-lg bg-gradient-to-br from-red-950/20 to-black/40 
                  backdrop-blur-sm overflow-hidden border border-red-900/20 
                  hover:border-red-800/30 transition-all duration-300
                  group-hover:shadow-lg group-hover:shadow-red-900/10">
            <!-- Header -->
            <div class="p-4 flex items-center justify-between border-b border-red-900/10">
                <div class="flex items-center gap-3">
                    <div class="p-1.5 rounded-md bg-red-500/10 group-hover:bg-red-500/20 
                        transition-colors duration-300">
                        <component :is="getIcon(field)" class="w-4 h-4 text-red-300/80 group-hover:text-red-300 
                               transition-colors duration-300" />
                    </div>
                    <h3 class="text-sm font-medium text-white/80 group-hover:text-white/90">
                        {{ formatFieldName(field) }}
                    </h3>
                </div>

                <div class="flex items-center gap-1">
                    <button class="p-1.5 rounded-md hover:bg-red-500/20 transition-colors"
                        :class="{ 'bg-red-500/20 text-red-300': isActive }" @click="$emit('toggle-visibility')">
                        <Eye class="w-3.5 h-3.5 text-red-200/70" />
                    </button>
                    <button v-if="!isCompactField" class="p-1.5 rounded-md hover:bg-red-500/20 transition-colors"
                        :class="{ 'bg-red-500/20 text-red-300': isArray }" @click="$emit('toggle-array')">
                        <List class="w-3.5 h-3.5 text-red-200/70" />
                    </button>
                </div>
            </div>

            <!-- Content avec animation -->
            <div class="p-4" :class="{ 'space-y-2': Array.isArray(value) && value.length > 1 }">
                <template v-if="value && (isActive || isArray)">
                    <TransitionGroup v-if="Array.isArray(value) && !isCompactField" name="list" tag="div"
                        class="grid gap-2" :class="{
                            'grid-cols-2': value.length > 3,
                            'grid-cols-1': value.length <= 3
                        }">
                        <div v-for="(item, index) in value" :key="index" class="px-3 py-2 rounded-md bg-black/20 text-sm text-white/80
                          border border-red-900/10 hover:border-red-800/20
                          transition-all duration-300 hover:translate-x-1
                          hover:bg-black/30">
                            {{ item }}
                        </div>
                    </TransitionGroup>

                    <div v-else class="text-white/90">
                        {{ Array.isArray(value) ? value[0] : value }}
                    </div>
                </template>
                <div v-else class="flex items-center gap-2 text-white/40 text-sm">
                    <Eye class="w-3.5 h-3.5" />
                    <span>Hidden</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
    transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

.list-leave-active {
    position: absolute;
}
</style>