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

const availableFields = computed(() =>
    store.getWikiMetadata(wikiName)?.attributes?.filter(f => f !== 'images') || []
)

const baseFields = computed(() =>
    ['name', 'kanji', 'gender', 'status'].filter(f => availableFields.value.includes(f))
)
const baseArrayFields = ['images', 'quote', 'relatives', 'occupations', 'affiliation', 'age']

const commonFields = ['age', 'gender', 'status', 'species']
const additionalFields = computed(() =>
    availableFields.value.filter(field => !commonFields.includes(field))
)
const emptyRequestedFields = ref<string[]>([])
const loadingFields = ref<Set<string>>(new Set())


const { data: character, isLoading, isFetching, updateField, fields, arrayFields, isError } = useCharacterDetails(
    wikiName,
    Number(route.params.id),
    baseFields.value,
    baseArrayFields
)

const isPageLoading = computed(() =>
    !character.value && (isLoading.value || metaLoading.value)
)

const isPageRefreshing = computed(() =>
    !!character.value && (isFetching.value || store.isLanguageSwitching)
)

const primaryQuote = computed(() => {
    const quote = character.value?.data?.quote
    return Array.isArray(quote) ? quote[0] : quote
})

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
    loadingFields.value.add(field)
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
        loadingFields.value.delete(field)
    }
}

async function handleToggleArray(field: string) {
    loadingFields.value.add(field)
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
        loadingFields.value.delete(field)
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
        <template #background>
            <div class="fixed inset-0 overflow-hidden bg-[#050507]">
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,113,133,0.16),transparent_24%),radial-gradient(circle_at_78%_12%,rgba(192,132,252,0.12),transparent_18%),linear-gradient(180deg,#13070a_0%,#060608_54%,#030304_100%)]"></div>
                <div class="cloud-container">
                    <div class="cloud cloud-1"></div>
                    <div class="cloud cloud-2"></div>
                    <div class="cloud cloud-3"></div>
                </div>
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.04),transparent_30%)]"></div>
                <div class="absolute inset-0 backdrop-blur-[95px]"></div>
            </div>
        </template>

        <section class="page-shell py-8 sm:py-10">
            <template v-if="isError">
                <CharacterNotFound :character-id="id" :wiki-name="wikiName" />
            </template>

            <template v-else>
                <header class="glass-panel mb-8 overflow-hidden">
                    <div class="relative p-6 sm:p-8">
                        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_55%)]"></div>
                        <div class="relative">
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
                        <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                            <div class="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                                <BackButton />
                            <div class="flex-1">
                                <div v-if="isPageRefreshing" class="mb-3 flex items-center gap-2 text-sm text-white/55">
                                    <div class="h-2 w-2 rounded-full bg-rose-300 animate-pulse"></div>
                                    Updating...
                                </div>
                                <div class="flex flex-col items-start gap-3">
                                    <div class="flex flex-wrap items-center gap-2">
                                        <h1 class="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                                        {{ character?.name || '...' }}
                                    </h1>
                                        <Badge variant="outline" class="border-white/10 bg-white/5 text-white/70">
                                        ID: {{ id }}
                                    </Badge>
                                    <Badge v-if="character?.data?.status"
                                            class="border-0"
                                        :class="getStatusColor(character.data.status)">
                                        {{ character.data.status }}
                                    </Badge>
                                    </div>
                                </div>
                                <p v-if="character?.data?.kanji" class="text-white/60 mt-2 font-japanese">
                                    {{ character.data.kanji }}
                                </p>

                                <div v-if="primaryQuote" class="mt-5 max-w-2xl rounded-[24px] border border-white/10 bg-black/[0.18] p-4 sm:p-5">
                                    <div class="flex items-start gap-3">
                                        <Quote class="mt-1.5 h-4 w-4 shrink-0 text-rose-300/70" />
                                        <p class="text-sm italic leading-7 text-white/70">
                                            {{ primaryQuote }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            </div>

                            <div class="flex items-start justify-between gap-3 lg:flex-col lg:items-end">
                                <div class="glass-panel-soft flex flex-wrap gap-2 p-3">
                                    <span v-if="character?.data?.gender" class="info-pill">{{ character.data.gender }}</span>
                                    <span v-if="character?.data?.species" class="info-pill">{{ character.data.species }}</span>
                                </div>
                                <a v-if="character?.url" :href="character.url" target="_blank"
                                    class="premium-button"
                                    title="View on Wiki">
                                    <ExternalLink class="mr-2 h-4 w-4" />
                                    Open wiki
                                </a>
                            </div>
                        </div>
                    </template>
                        </div>
                    </div>
                </header>

                <div class="grid grid-cols-1 gap-8 lg:grid-cols-[400px,1fr]">
                    <div class="space-y-6">
                        <template v-if="isPageLoading">
                            <Skeleton class="w-full aspect-[4/3] rounded-xl" />
                            <div class="grid grid-cols-2 gap-4">
                                <CharacterDetailSkeleton v-for="i in 4" :key="`common-${i}`" class="h-32" />
                            </div>
                        </template>
                        <template v-else>
                            <CharacterImageGallery v-if="character?.data?.images?.length"
                                :images="character.data.images" class="shadow-lg" />
                            <div class="glass-panel p-4 sm:p-5">
                                <div class="grid grid-cols-2 gap-4">
                                <CommonFieldCard v-for="fieldName in commonFields" :key="fieldName"
                                    v-bind="getCommonFieldProps(fieldName)"
                                    @toggle-view="() => handleToggleView(fieldName)"
                                    @toggle-array="() => handleToggleArray(fieldName)" />
                                </div>
                            </div>
                        </template>
                    </div>

                    <template v-if="isPageLoading">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <CharacterDetailSkeleton v-for="i in 6" :key="`detail-${i}`" />
                        </div>
                    </template>
                    <template v-else>
                        <div class="glass-panel p-4 sm:p-5">
                            <div class="mb-5 flex items-center justify-between gap-3">
                                <p class="surface-label">Details</p>
                                <p class="text-sm text-white/45">{{ displayedAdditionalFields.length }}</p>
                            </div>
                            <TransitionGroup name="card" tag="div" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <CharacterDetail v-for="field in displayedAdditionalFields" :key="field"
                                    v-bind="getDetailProps(field)" @toggle-visibility="handleToggleView(field)"
                                    @toggle-array="handleToggleArray(field)" />
                            </TransitionGroup>
                        </div>
                    </template>
                </div>
            </template>
        </section>
    </PageLayout>
</template>

<style scoped>
.font-japanese {
    font-family: "Noto Sans JP", sans-serif;
}

.cloud-container {
    position: absolute;
    inset: 0;
}

.cloud {
    position: absolute;
    width: 420px;
    height: 150px;
    background-image: url('@/assets/images/cloud.webp');
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.11;
    filter: blur(2px);
}

.cloud-1 {
    top: 12%;
    animation: cloudFloat 34s linear infinite;
}

.cloud-2 {
    top: 44%;
    animation: cloudFloat 42s linear infinite;
    animation-delay: -18s;
}

.cloud-3 {
    top: 78%;
    animation: cloudFloat 38s linear infinite;
    animation-delay: -9s;
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

@keyframes cloudFloat {
    0% {
        transform: translate3d(-140%, 0, 0);
    }

    100% {
        transform: translate3d(110vw, 0, 0);
    }
}
</style>