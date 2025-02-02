<!-- src/components/organisms/CharacterGrid.vue -->
<script setup lang="ts">
import CharacterCard from '../molecules/CharacterCard.vue';
import CharacterCardSkeleton from '../molecules/CharacterCardSkeleton.vue';
import type { Character } from '@/types'

const props = defineProps<{
    characters: Character[];
    loading?: boolean;
    error?: boolean;
}>();

const emit = defineEmits<{
    (e: 'card-click', characterId: number): void;
    (e: 'retry'): void;
}>();

const SKELETON_COUNT = 12;
</script>

<template>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        <template v-if="loading">
            <CharacterCardSkeleton 
                v-for="n in SKELETON_COUNT" 
                :key="'skeleton-' + n" 
            />
        </template>
        
        <template v-else-if="error">
            <div class="col-span-full text-center p-8">
                <div class="text-red-500 text-lg">Une erreur est survenue lors du chargement des personnages.</div>
                <button 
                    class="mt-4 px-4 py-2 bg-red-500/20 text-white rounded-lg hover:bg-red-500/30 transition-all"
                    @click="emit('retry')"
                >
                    Réessayer
                </button>
            </div>
        </template>

        <template v-else>
            <CharacterCard
                v-for="character in characters"
                :key="character.id"
                :character="character"
                @click="emit('card-click', character.id)"
            />
        </template>
    </div>
</template>