const BASE_URL = 'http://localhost:3000'

export const api = {
    async getAvailableWikis() {
        const response = await fetch(`${BASE_URL}/available-wikis`)
        if (!response.ok) throw new Error('Failed to fetch wikis')
            
        return response.json()
    }
}