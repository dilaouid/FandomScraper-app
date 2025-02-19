import {
    User, Heart, Cake, MapPin,
    Briefcase, Users, Book, Film,
    Flag, Type, Quote, Sword,
    Activity
} from 'lucide-vue-next'
import type { IconComponent } from '@/types'

export function useFieldUtils() {
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

    return {
        getIcon,
        getFieldColor,
        formatFieldName
    }
}
