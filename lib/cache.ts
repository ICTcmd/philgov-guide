type CacheEntry<T> = {
  data: T;
  expiry: number;
};

const cache = new Map<string, CacheEntry<any>>();

// Default TTL: 1 hour (since gov requirements don't change often)
const DEFAULT_TTL = 60 * 60 * 1000; 

export const cacheService = {
  get: <T>(key: string): T | null => {
    const entry = cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      cache.delete(key);
      return null;
    }

    return entry.data;
  },

  set: <T>(key: string, data: T, ttl: number = DEFAULT_TTL): void => {
    // Basic eviction strategy: if cache gets too big, clear it (simple for starter)
    if (cache.size > 1000) {
      const keysToDelete = Array.from(cache.keys()).slice(0, 200);
      keysToDelete.forEach(k => cache.delete(k));
    }

    cache.set(key, {
      data,
      expiry: Date.now() + ttl,
    });
  },

  generateKey: (...args: (string | number | undefined | null)[]): string => {
    return args.filter(Boolean).join('|').toLowerCase().trim();
  }
};
