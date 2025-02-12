import { computed, Ref, watch } from 'vue'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { useFiltersStore } from '@/stores/useFiltersStore'
import { useRoute, useRouter } from 'vue-router'
import { useWikiMetadata } from '@/composables/useWikiMetadata'
import { WikiMetadata } from '@/stores/useWikiStore'

const apiUrl = import.meta.env.VITE_API_URL
const PER_PAGE = 12

export function useCharacters(wikiName: string) {
    const route = useRoute()
    const router = useRouter()
    const filtersStore = useFiltersStore()
    const queryClient = useQueryClient()
    const { data: metadata } = useWikiMetadata(wikiName) as { data: Ref<WikiMetadata | undefined> }
    const lang = computed(() => route.query.lang?.toString() || 'en')

    const selectedFields = computed({
        get: () => filtersStore.getSelectedFields(wikiName),
        set: (value) => {
            filtersStore.setSelectedFields(wikiName, value)
        }
    })

    const currentPage = computed({
        get: () => Number(route.query.page) || 1,
        set: (value) => {
            router.push({
                query: {
                    ...route.query,
                    page: value.toString()
                }
            })
        }
    })

    const searchTerm = computed({
        get: () => route.query.search?.toString() || '',
        set: (value) => {
            router.push({
                query: {
                    ...route.query,
                    search: value || undefined,
                    page: '1'
                }
            })
        }
    })

    // Query pour le count total
    const totalCount = computed(() => metadata.value?.count || 0)

    // Query pour les personnages avec pagination
    const charactersQuery = useQuery({
        queryKey: ['characters', wikiName, currentPage, searchTerm, selectedFields, lang.value],
        queryFn: async () => {
            const fields = ['images', ...selectedFields.value]
            const uniqueFields = Array.from(new Set(fields))
            const params = new URLSearchParams({
                recursive: 'true',
                limit: PER_PAGE.toString(),
                offset: ((currentPage.value - 1) * PER_PAGE).toString(),
                fields: uniqueFields.join(','),
                withId: 'true',
                lang: lang.value
            })
            if (searchTerm.value) {
                params.append('search', searchTerm.value)
            }
            const response = await fetch(`${apiUrl}/${wikiName}/characters?${params}`)
            const data = await response.json()
            return data
        },
        gcTime: Infinity,
        staleTime: 50000,
        structuralSharing: true
    })

    const isCharactersLoading = computed(() => charactersQuery.isLoading || charactersQuery.isFetching)

    watch([searchTerm], () => {
        currentPage.value = 1
    })


    const setPage = (page: number) => {
        currentPage.value = page
    }

    const setSearch = (term: string) => {
        searchTerm.value = term
    }

    const setFields = (fields: string[]) => {
        filtersStore.setSelectedFields(wikiName, fields)
        router.push({
            query: {
                ...route.query
            }
        })
        queryClient.invalidateQueries({
            queryKey: ['characters', wikiName]
        })
    }

    const totalPages = computed(() => {
        if (!totalCount.value) return 0
        return Math.ceil(totalCount.value / PER_PAGE)
    })

    return {
        characters: charactersQuery.data,
        isLoading: isCharactersLoading,
        isError: charactersQuery.isError,
        error: charactersQuery.error,
        currentPage,
        totalPages,
        setPage,
        searchTerm,
        setSearch,
        selectedFields,
        setFields,
        totalCount
    }
}