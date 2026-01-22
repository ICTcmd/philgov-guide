type CacheEntry<T> = {
  data: T;
  expiry: number;
};

const cache = new Map<string, CacheEntry<unknown>>();
const DEFAULT_TTL_MS = (() => {
  const raw = process.env.CACHE_TTL_MS;
  if (!raw) return 60 * 60 * 1000;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return 60 * 60 * 1000;
  return parsed;
})();

export const cacheService = {
  get: <T>(key: string): T | null => {
    const entry = cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      cache.delete(key);
      return null;
    }

    return entry.data as T;
  },

  set: <T>(key: string, data: T, ttl: number = DEFAULT_TTL_MS): void => {
    // Basic eviction strategy: if cache gets too big, clear it (simple for starter)
    if (cache.size > 1000) {
      const keysToDelete = Array.from(cache.keys()).slice(0, 200);
      keysToDelete.forEach(k => cache.delete(k));
    }

    cache.set(key, { data, expiry: Date.now() + ttl });
  },

  generateKey: (...args: (string | number | undefined | null)[]): string => {
    return args.filter(Boolean).join('|').toLowerCase().trim();
  }
};
