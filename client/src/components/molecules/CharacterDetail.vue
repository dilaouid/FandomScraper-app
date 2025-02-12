<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
    Eye, EyeOff, ListPlus, List,
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

const getColor = (field: string): string => {
    const colors: Record<string, string> = {
        name: 'bg-blue-500/20 text-blue-200',
        age: 'bg-green-500/20 text-green-200',
        gender: 'bg-pink-500/20 text-pink-200',
        status: 'bg-purple-500/20 text-purple-200',
        affiliation: 'bg-yellow-500/20 text-yellow-200',
        occupations: 'bg-orange-500/20 text-orange-200',
        relatives: 'bg-indigo-500/20 text-indigo-200',
        manga: 'bg-red-500/20 text-red-200',
        episode: 'bg-cyan-500/20 text-cyan-200',
        nationality: 'bg-emerald-500/20 text-emerald-200',
        kanji: 'bg-violet-500/20 text-violet-200',
        quote: 'bg-rose-500/20 text-rose-200',
        weapon: 'bg-amber-500/20 text-amber-200',
        birthplace: 'bg-teal-500/20 text-teal-200',
        birthday: 'bg-lime-500/20 text-lime-200'
    }
    return colors[field] || 'bg-gray-500/20 text-gray-200'
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
</script>

<template>
    <div v-if="!requestedButEmpty" ref="detailRef" class="relative group rounded-lg transition-all duration-500 transform" :class="[
        getColor(field),
        {
            'opacity-75 hover:opacity-100': !isActive,
            'translate-x-0 opacity-100': isVisible,
            '-translate-x-4 opacity-0': !isVisible
        }
    ]">
        <!-- Glow effect -->
        <div
            class="absolute inset-0 rounded-lg bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div class="relative p-5 backdrop-blur-sm">
            <!-- Header -->
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                    <component :is="getIcon(field)" class="w-5 h-5 transition-transform group-hover:scale-110" />
                    <h3 class="font-medium tracking-wide">{{ formatFieldName(field) }}</h3>
                </div>

                <!-- Controls -->
                <div class="flex items-center gap-2">
                    <button class="p-2 rounded hover:bg-white/10 transition-colors" @click="$emit('toggle-visibility')"
                        :class="{ 'text-red-400': isActive }">
                        <Eye class="w-4 h-4" />
                    </button>
                    <button class="p-2 rounded hover:bg-white/10 transition-colors" @click="$emit('toggle-array')"
                        :class="{ 'text-red-400': isArray }">
                        <List class="w-4 h-4" />
                    </button>
                </div>
            </div>

            <!-- Content -->
            <div v-if="value" :class="{ 'pl-8': isArray }" class="space-y-2">
                <template v-if="Array.isArray(value)">
                    <div v-for="(item, index) in value" :key="index"
                        class="p-2 rounded bg-black/20 backdrop-blur-sm border border-white/5 transform transition-all hover:translate-x-1">
                        {{ item }}
                    </div>
                </template>
                <template v-else>
                    <div class="p-2 rounded bg-black/20 backdrop-blur-sm border border-white/5">
                        {{ value }}
                    </div>
                </template>
            </div>
            <div v-else class="text-white/40 italic pl-8">
                No data available
            </div>
        </div>
    </div>
</template>
