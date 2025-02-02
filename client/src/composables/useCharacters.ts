import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref, computed, watch } from 'vue'
import { useFiltersStore } from '@/stores/useFiltersStore'
import { useRoute, useRouter } from 'vue-router'

const PER_PAGE = 12

export function useCharacters(wikiName: string) {
    const route = useRoute()
    const router = useRouter()

    const filtersStore = useFiltersStore()
    const selectedFields = computed({
        get: () => filtersStore.getSelectedFields(wikiName),
        set: (value) => {
            filtersStore.setSelectedFields(wikiName, value)
        }
    })

    const queryClient = useQueryClient()

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
    const totalCountQuery = useQuery({
        queryKey: ['characters-count', wikiName],
        queryFn: async () => {
            const response = await fetch(`http://localhost:3000/${wikiName}/count`)
            const data = await response.json()
            return data.count
        }
    })

    // Query pour les personnages avec pagination
    const charactersQuery = useQuery({
        queryKey: ['characters', wikiName, currentPage, searchTerm, selectedFields],
        queryFn: async () => {
            const fields = ['images', ...selectedFields.value]
            const uniqueFields = Array.from(new Set(fields))

            const params = new URLSearchParams({
                recursive: 'true',
                limit: PER_PAGE.toString(),
                offset: ((currentPage.value - 1) * PER_PAGE).toString(),
                fields: uniqueFields.join(','),
                withId: 'true'
            })

            if (searchTerm.value) {
                params.append('search', searchTerm.value)
            }

            const response = await fetch(`http://localhost:3000/${wikiName}/characters?${params}`)
            const data = await response.json()            
            
            return data
        },
        staleTime: Infinity
    })

    // Préchargement de la page suivante
    const prefetchNextPage = async () => {
        if (currentPage.value * PER_PAGE < (totalCountQuery.data?.value || 0)) {
            const nextPage = currentPage.value + 1
            await queryClient.prefetchQuery({
                queryKey: ['characters', wikiName, nextPage, searchTerm],
                queryFn: async () => {
                    const params = new URLSearchParams({
                        recursive: 'true',
                        limit: PER_PAGE.toString(),
                        offset: ((nextPage - 1) * PER_PAGE).toString(),
                        fields: 'images,status,gender,kanji',
                        withId: 'true'
                    })

                    if (searchTerm.value) {
                        params.append('search', searchTerm.value)
                    }

                    const response = await fetch(`http://localhost:3000/${wikiName}/characters?${params}`)
                    return response.json()
                }
            })
        }
    }
    
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
        queryClient.invalidateQueries({
            queryKey: ['characters', wikiName]
        })
    }


    const totalPages = computed(() => {
        if (!totalCountQuery.data?.value) return 0
        return Math.ceil(totalCountQuery.data.value / PER_PAGE)
    })

    return {
        characters: charactersQuery.data,
        isLoading: charactersQuery.isLoading,
        isError: charactersQuery.isError,
        error: charactersQuery.error,
        currentPage,
        totalPages,
        setPage,
        searchTerm,
        setSearch,
        selectedFields,
        setFields,
        totalCount: totalCountQuery.data
    }
}