import { Context } from 'hono'
import { cache } from '../services/cache.service'

export const proxyController = {
    // GET /proxy
    proxy: async (c: Context) => {
        const url = c.req.query('url')
        const referer = c.req.query('referer')

        if (!url) return c.notFound()
        const getContentType = (url: string) => {
            const extension = url.split('.').pop()?.toLowerCase()
            switch (extension) {
                case 'webp': return 'image/webp'
                case 'png': return 'image/png'
                case 'jpg':
                case 'jpeg': return 'image/jpeg'
                case 'gif': return 'image/gif'
                case 'svg': return 'image/svg+xml'
                default: return 'application/octet-stream'
            }
        }

        const lang = c.req.query('lang') || 'fr'
        const fullUrl = `${url}/revision/latest/thumbnail/width/360/height/360?cb=${Date.now()}&path-prefix=${lang}`
        const contentType = getContentType(url)

        const cacheKey = cache.createCacheKey('image-proxy', { url: fullUrl })
        const cachedImage = cache.get<Buffer>(cacheKey)

        if (cachedImage) {
            return new Response(cachedImage, {
                headers: {
                    'Content-Type': contentType,
                    'Cache-Control': 'public, max-age=31536000',
                }
            })
        }

        try {
            const response = await fetch(fullUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
                    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                    'Accept-Language': 'fr-FR,fr;q=0.9,en-FR;q=0.8,en;q=0.7,en-US;q=0.6',
                    'Referer': referer || 'https://www.fandom.com/',
                    'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
                    'sec-ch-ua-mobile': '?1',
                    'sec-ch-ua-platform': '"Android"',
                    'sec-fetch-dest': 'image',
                    'sec-fetch-mode': 'no-cors',
                    'sec-fetch-site': 'cross-site'
                }
            })

            if (!response.ok) return c.notFound()

            const arrayBuffer = await response.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)

            cache.set(cacheKey, buffer, 86400000) // 24h

            return new Response(buffer, {
                headers: {
                    'Content-Type': contentType,
                    'Cache-Control': 'public, max-age=31536000',
                }
            })
        } catch (error) {
            console.error('Error proxying image:', error)
            return c.notFound()
        }
    }
}
