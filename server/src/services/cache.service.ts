// 15 minutes in ms
const TTL = 15 * 60 * 1000;

class MemoryCache {
    private store: Map<string, CacheEntry<any>> = new Map();

    constructor(private defaultTTL: number = 900000) { }

    set<T>(key: string, value: T, ttl: number = this.defaultTTL) {
        const expiry = Date.now() + ttl;
        this.store.set(key, { value, expiry });
    }

    get<T>(key: string): T | undefined {
        const entry = this.store.get(key);
        if (!entry) return undefined;
        if (Date.now() > entry.expiry) {
            this.store.delete(key);
            return undefined;
        }
        return entry.value;
    }

    createCacheKey(path: string, query: Record<string, string | string[] | undefined>): string {
        const sortedKeys = Object.keys(query).sort();
        
        const queryString = sortedKeys
          .map(key => {
            const value = query[key];
            if (Array.isArray(value)) {
              return `${key}=${value.sort().join(',')}`;
            }
            return `${key}=${value}`;
          })
          .join('&');
        
        return `${path}?${queryString}`;
      }
      
}

export const cache = new MemoryCache(TTL);