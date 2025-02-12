type CacheEntry<T> = {
    value: T;
    expiry: number; // timestamp (ms)
};