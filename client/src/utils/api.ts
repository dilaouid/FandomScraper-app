import { API_BASE_URL } from '@/config/api'

export const api = {
    async getAvailableWikis() {
        const response = await fetch(`${API_BASE_URL}/available-wikis`)
        if (!response.ok) throw new Error('Failed to fetch wikis')
            
        return response.json()
    }
}