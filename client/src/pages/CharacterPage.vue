<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useWikiStore } from '@/stores/useWikiStore'
import { useWikiMetadata } from '@/composables/useWikiMetadata'
import { useCharacterDetails } from '@/composables/useCharacterDetails'

import PageLayout from '@/components/templates/PageLayout.vue'
import CharacterImageGallery from '@/components/molecules/CharacterImageGallery.vue'
import CharacterDetail from '@/components/molecules/CharacterDetail.vue'
import BackButton from '@/components/atoms/BackButton.vue'
import Badge from '@/components/ui/badge/Badge.vue'
import CommonFieldCard from '@/components/atoms/CommonFieldCard.vue'
import CharacterNotFound from '@/components/molecules/CharacterNotFound.vue'

import { ExternalLink, User, Heart, Cake, MapPin, Briefcase, Users, Book, Film, Flag, Type, Quote, Sword, Activity } from 'lucide-vue-next'
import type { IconComponent } from '@/types'

const route = useRoute()
const wikiName = route.params.wiki as string
const store = useWikiStore()

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
const hiddenFields = ref<string[]>([])

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

async function handleToggleArray(field: string) {
    fields.value = fields.value.filter(f => f !== field)
    arrayFields.value = arrayFields.value.includes(field)
        ? arrayFields.value.filter(f => f !== field)
        : [...arrayFields.value, field]

    // Force la valeur en array même si c'est une string
    if (!Array.isArray(character.value?.data?.[field])) {
        character.value.data[field] = [character.value.data[field]]
    }

    await updateField(field, true)
}

async function toggleFieldVisibility(field: string) {
    if (hiddenFields.value.includes(field)) {
        hiddenFields.value = hiddenFields.value.filter(f => f !== field)
    } else {
        hiddenFields.value.push(field)
    }
}

async function handleToggleView(field: string) {
    arrayFields.value = arrayFields.value.filter(f => f !== field)
    fields.value = [...fields.value, field]

    await updateField(field, false)

    if (!character.value?.data?.[field]) {
        emptyRequestedFields.value.push(field)
        fields.value = fields.value.filter(f => f !== field)
    }
}


const getStatusColor = (status?: string) => {
    if (!status) return 'bg-gray-500/20'
    switch (status.toLowerCase()) {
        case 'alive': return 'bg-green-500/20 text-green-200'
        case 'deceased': return 'bg-red-500/20 text-red-200'
        case 'unknown': return 'bg-yellow-500/20 text-yellow-200'
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
                <header
                    class="mb-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 backdrop-blur-lg bg-black/30 p-6 rounded-xl border border-white/10 shadow-lg">
                    <BackButton />
                    <div class="flex-1">
                        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <h1 class="text-4xl font-bold text-white">
                                {{ character?.name || '...' }}
                            </h1>
                            <Badge variant="outline" class="text-white/60">
                                ID: {{ id }}
                            </Badge>
                            <Badge v-if="character?.data?.status" :class="getStatusColor(character.data.status)">
                                {{ character.data.status }}
                            </Badge>
                        </div>
                        <p v-if="character?.data?.kanji" class="text-white/60 mt-2 font-japanese">
                            {{ character.data.kanji }}
                        </p>
                    </div>
                    <a v-if="character?.url" :href="character.url" target="_blank"
                        class="p-2 rounded-lg hover:bg-white/5 transition-colors text-white/60 hover:text-white"
                        title="View on Wiki">
                        <ExternalLink class="w-5 h-5" />
                    </a>
                </header>

                <!-- Section Quote -->
                <section class="mb-8 relative py-12" v-if="character?.data?.quote">
                    <blockquote class="relative z-10 max-w-4xl mx-auto px-12">
                        <div class="absolute top-0 left-0 text-8xl text-red-500/10 font-serif leading-none"
                            style="transform: translate(-25%, -25%)">"</div>
                        <p
                            class="text-3xl font-japanese bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
                            {{ Array.isArray(character.data.quote) ? character.data.quote[0] : character.data.quote }}
                        </p>
                        <div class="absolute bottom-0 right-0 text-8xl text-red-500/10 font-serif leading-none"
                            style="transform: translate(25%, 25%)">"</div>
                    </blockquote>
                </section>

                <!-- Loading state -->
                <div v-if="isPageLoading" class="flex items-center justify-center min-h-[400px]">
                    <div class="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin" />
                </div>

                <!-- Content -->
                <div v-else class="grid grid-cols-1 lg:grid-cols-[400px,1fr] gap-8">

                    <!-- Left Column -->
                    <div class="space-y-6">
                        <CharacterImageGallery v-if="character?.data?.images?.length" :images="character.data.images"
                            class="rounded-xl overflow-hidden border border-white/10 shadow-lg" />
                        <!-- Common Fields Grid -->
                        <div class="grid grid-cols-2 gap-4">
                            <CommonFieldCard v-for="fieldName in commonFields" :key="fieldName" :fieldName="fieldName"
                                :fieldValue="character?.data?.[fieldName]" :inFields="fields.includes(fieldName)"
                                :inArrayFields="arrayFields.includes(fieldName)"
                                :requestedButEmpty="emptyRequestedFields.includes(fieldName)" :getIcon="getIcon"
                                :getFieldColor="getFieldColor" :formatFieldName="formatFieldName"
                                @toggle-view="() => handleToggleView(fieldName)"
                                @toggle-array="() => handleToggleArray(fieldName)" />

                        </div>
                    </div>

                    <!-- Right Column -->
                    <div class="grid gap-4">
                        <CharacterDetail v-for="field in additionalFields" :key="field" :field="field"
                            :value="character?.data?.[field]" :is-array="arrayFields.includes(field)"
                            :is-active="fields.includes(field)" :requested-but-empty="emptyRequestedFields.includes(field)"
                            @toggle-visibility="handleToggleView(field)" @toggle-array="handleToggleArray(field)" />
                    </div>
                </div>
            </template>
        </div>
    </PageLayout>
</template>

<style scoped>
.font-japanese {
    font-family: "Noto Sans JP", sans-serif;
}
</style>
