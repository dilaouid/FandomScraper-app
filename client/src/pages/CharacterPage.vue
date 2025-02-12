<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useWikiStore } from '@/stores/useWikiStore'
import { useWikiMetadata } from '@/composables/useWikiMetadata'
import { useCharacterDetails } from '@/composables/useCharacterDetails'
import { useCustomToast } from '@/composables/useCustomToast'

import PageLayout from '@/components/templates/PageLayout.vue'
import CharacterImageGallery from '@/components/molecules/CharacterImageGallery.vue'
import CharacterDetail from '@/components/molecules/CharacterDetail.vue'
import BackButton from '@/components/atoms/BackButton.vue'
import Badge from '@/components/ui/badge/Badge.vue'
import CommonFieldCard from '@/components/atoms/CommonFieldCard.vue'
import CharacterNotFound from '@/components/molecules/CharacterNotFound.vue'
import Skeleton from '@/components/atoms/Skeleton.vue'
import CharacterDetailSkeleton from '@/components/molecules/CharacterDetailSkeleton.vue'
import { TransitionGroup } from 'vue'

import {
    ExternalLink, User, Heart, Cake, MapPin,
    Briefcase, Users, Book, Film, Flag,
    Type, Quote, Sword, Activity
} from 'lucide-vue-next'
import type { IconComponent } from '@/types'

const route = useRoute()
const store = useWikiStore()
const { toast } = useCustomToast()

const wikiName = route.params.wiki as string
const { id } = route.params as { id: string }

const { isLoading: metaLoading } = useWikiMetadata(wikiName)

// Liste des champs disponibles hors images
const availableFields = computed(() =>
    store.getWikiMetadata(wikiName)?.attributes?.filter(f => f !== 'images') || []
)

// Champs par défaut pour le détail et la query
const baseFields = computed(() =>
    ['name', 'kanji', 'gender', 'status'].filter(f => availableFields.value.includes(f))
)
const baseArrayFields = ['images', 'quote', 'relatives', 'occupations', 'affiliation', 'age']

// Champs à afficher dans la Common Fields Grid
const commonFields = ['age', 'gender', 'status', 'species']
// Champs additionnels pour CharacterDetail
const additionalFields = computed(() =>
    availableFields.value.filter(field => !commonFields.includes(field))
)
const emptyRequestedFields = ref<string[]>([])
const loadingFields = ref<Set<string>>(new Set())


const { data: character, isLoading, updateField, fields, arrayFields, isError } = useCharacterDetails(
    wikiName,
    Number(route.params.id),
    baseFields.value,
    baseArrayFields
)

// Loading global
const isPageLoading = computed(() =>
    store.isLanguageSwitching || isLoading.value || metaLoading.value
)

const getDetailProps = (field: string) => ({
    field,
    value: character.value?.data?.[field],
    isArray: arrayFields.value.includes(field),
    isActive: fields.value.includes(field),
    requestedButEmpty: emptyRequestedFields.value.includes(field),
    isLoading: loadingFields.value.has(field)
})

const getCommonFieldProps = (fieldName: string) => ({
    fieldName,
    fieldValue: character.value?.data?.[fieldName],
    inFields: fields.value.includes(fieldName),
    inArrayFields: arrayFields.value.includes(fieldName),
    requestedButEmpty: emptyRequestedFields.value.includes(fieldName),
    isLoading: loadingFields.value.has(fieldName),
    getIcon,
    getFieldColor,
    formatFieldName
})

async function handleToggleView(field: string) {
    loadingFields.value.add(field) // Ajout du champ en loading
    try {
        arrayFields.value = arrayFields.value.filter(f => f !== field)
        fields.value = [...fields.value, field]
        await updateField(field, false)

        if (!character.value?.data?.[field]) {
            emptyRequestedFields.value.push(field)
            fields.value = fields.value.filter(f => f !== field)

            toast.error(`No data available for ${formatFieldName(field)}`, {
                description: 'The field will remain hidden.',
                action: {
                    label: 'Got it',
                    onClick: () => { }
                }
            })
        }
    } finally {
        loadingFields.value.delete(field) // Retrait du champ du loading
    }
}

async function handleToggleArray(field: string) {
    loadingFields.value.add(field) // Ajout du champ en loading
    try {
        fields.value = fields.value.filter(f => f !== field)
        arrayFields.value = arrayFields.value.includes(field)
            ? arrayFields.value.filter(f => f !== field)
            : [...arrayFields.value, field]

        if (!Array.isArray(character.value?.data?.[field])) {
            character.value.data[field] = [character.value.data[field]]
        }

        await updateField(field, true)
    } finally {
        loadingFields.value.delete(field) // Retrait du champ du loading
    }
}


const getStatusColor = (status?: string | string[]) => {
    if (Array.isArray(status)) status = status[0]
    if (!status) return 'bg-gray-500/20'
    switch (status.toLowerCase()) {
        case 'alive':
        case 'vivant':
        case 'vivante':
            return 'bg-green-500/20 text-green-200'
        case 'décédé':
        case 'décédée':
        case 'deceased':
            return 'bg-red-500/20 text-red-200'
        case 'unknown':
        case 'inconnu':
            return 'bg-yellow-500/20 text-yellow-200'
        default: return 'bg-gray-500/20'
    }
}

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
        species: Sword
    }
    return icons[field] || User
}

const getFieldColor = (field: string): string => {
    const colors: Record<string, string> = {
        name: 'bg-blue-500/20 text-blue-200',
        age: 'bg-green-500/20 text-green-200',
        gender: 'bg-pink-500/20 text-pink-200',
        status: 'bg-purple-500/20 text-purple-200',
        affiliation: 'bg-yellow-500/20 text-yellow-200',
        occupations: 'bg-orange-500/20 text-orange-200',
        relatives: 'bg-indigo-500/20 text-indigo-200',
        species: 'bg-emerald-500/20 text-emerald-200',
        kanji: 'bg-violet-500/20 text-violet-200'
    }
    return colors[field] || 'bg-gray-500/20 text-gray-200'
}

const displayedAdditionalFields = computed(() =>
    additionalFields.value.filter(field => !emptyRequestedFields.value.includes(field))
)

const formatFieldName = (field: string): string =>
    field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
</script>

<template>
    <PageLayout>
        <div class="container mx-auto px-4 py-8">
            <template v-if="isError">
                <CharacterNotFound :character-id="id" :wiki-name="wikiName" />
            </template>

            <template v-else>
                <!-- Header -->
                <header class="mb-8 backdrop-blur-lg bg-black/30 p-6 rounded-xl border border-white/10 shadow-lg">
                    <template v-if="isPageLoading">
                        <div class="flex items-center gap-4">
                            <Skeleton class="w-24 h-10" />
                            <div class="flex-1 space-y-3">
                                <div class="flex items-center gap-2">
                                    <Skeleton class="w-64 h-10" />
                                    <Skeleton class="w-20 h-6" />
                                    <Skeleton class="w-24 h-6" />
                                </div>
                                <Skeleton class="w-48 h-4" />
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                            <BackButton />
                            <div class="flex-1">
                                <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                    <h1 class="text-4xl font-bold text-white">
                                        {{ character?.name || '...' }}
                                    </h1>
                                    <Badge variant="outline" class="text-white/60">
                                        ID: {{ id }}
                                    </Badge>
                                    <Badge v-if="character?.data?.status"
                                        :class="getStatusColor(character.data.status)">
                                        {{ character.data.status }}
                                    </Badge>
                                </div>
                                <p v-if="character?.data?.kanji" class="text-white/60 mt-2 font-japanese">
                                    {{ character.data.kanji }}
                                </p>

                                <!-- Quote section -->
                                <div v-if="character?.data?.quote" class="mt-4 relative">
                                    <div class="flex items-start gap-3 max-w-2xl">
                                        <Quote class="w-4 h-4 text-red-400/60 mt-1.5 shrink-0" />
                                        <p class="text-white/60 italic text-sm leading-relaxed">
                                            {{ Array.isArray(character.data.quote) ? character.data.quote[0] :
                                                character.data.quote }}
                                        </p>
                                    </div>
                                    <div
                                        class="absolute left-7 -bottom-2 h-px w-24 bg-gradient-to-r from-red-500/20 to-transparent" />
                                </div>

                            </div>
                            <a v-if="character?.url" :href="character.url" target="_blank"
                                class="p-2 rounded-lg hover:bg-white/5 transition-colors text-white/60 hover:text-white"
                                title="View on Wiki">
                                <ExternalLink class="w-5 h-5" />
                            </a>
                        </div>
                    </template>
                </header>

                <!-- Main Content -->
                <div class="grid grid-cols-1 lg:grid-cols-[400px,1fr] gap-8">
                    <!-- Left Column -->
                    <div class="space-y-6">
                        <template v-if="isPageLoading">
                            <Skeleton class="w-full aspect-[4/3] rounded-xl" />
                            <div class="grid grid-cols-2 gap-4">
                                <CharacterDetailSkeleton v-for="i in 4" :key="`common-${i}`" class="h-32" />
                            </div>
                        </template>
                        <template v-else>
                            <CharacterImageGallery v-if="character?.data?.images?.length"
                                :images="character.data.images" class="rounded-xl overflow-hidden shadow-lg" />
                            <div class="grid grid-cols-2 gap-4">
                                <CommonFieldCard v-for="fieldName in commonFields" :key="fieldName"
                                    v-bind="getCommonFieldProps(fieldName)"
                                    @toggle-view="() => handleToggleView(fieldName)"
                                    @toggle-array="() => handleToggleArray(fieldName)" />
                            </div>
                        </template>
                    </div>

                    <!-- Right Column -->
                    <template v-if="isPageLoading">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <CharacterDetailSkeleton v-for="i in 6" :key="`detail-${i}`" />
                        </div>
                    </template>
                    <template v-else>
                        <TransitionGroup name="card" tag="div" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <CharacterDetail v-for="field in displayedAdditionalFields" :key="field"
                                v-bind="getDetailProps(field)" @toggle-visibility="handleToggleView(field)"
                                @toggle-array="handleToggleArray(field)" />
                        </TransitionGroup>

                    </template>
                </div>
            </template>
        </div>
    </PageLayout>
</template>

<style scoped>
.font-japanese {
    font-family: "Noto Sans JP", sans-serif;
}

.card-move,
.card-enter-active,
.card-leave-active {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-enter-from,
.card-leave-to {
    opacity: 0;
    transform: scale(0.5);
}

.card-leave-active {
    position: absolute;
    pointer-events: none;
}
</style>