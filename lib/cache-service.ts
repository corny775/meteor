/**
 * API Cache Service
 * In-memory caching layer for external API responses
 * Reduces redundant calls to USGS, Nominatim, and other services
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class CacheService {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly DEFAULT_TTL = 1000 * 60 * 60; // 1 hour

  /**
   * Get cached data if available and not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    const age = now - entry.timestamp;

    if (age > entry.ttl) {
      // Expired, remove from cache
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set cached data with optional TTL
   */
  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl ?? this.DEFAULT_TTL,
    });
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Clear specific cache entry
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clear expired entries
   */
  clearExpired(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    this.cache.forEach((entry, key) => {
      const age = now - entry.timestamp;
      if (age > entry.ttl) {
        expiredKeys.push(key);
      }
    });

    expiredKeys.forEach(key => this.cache.delete(key));
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    entries: { key: string; age: number; ttl: number }[];
  } {
    const now = Date.now();
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      age: now - entry.timestamp,
      ttl: entry.ttl,
    }));

    return {
      size: this.cache.size,
      entries,
    };
  }

  /**
   * Generate cache key from parameters
   */
  generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${JSON.stringify(params[key])}`)
      .join('&');
    
    return `${prefix}:${sortedParams}`;
  }
}

// Global cache instance
export const apiCache = new CacheService();

// Periodic cleanup of expired entries (every 10 minutes)
if (typeof window !== 'undefined') {
  setInterval(() => {
    apiCache.clearExpired();
  }, 1000 * 60 * 10);
}

/**
 * Wrapper function for cached API calls
 */
export async function cachedFetch<T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Check cache first
  const cached = apiCache.get<T>(cacheKey);
  if (cached !== null) {
    console.log(`[Cache HIT] ${cacheKey}`);
    return cached;
  }

  // Cache miss, fetch data
  console.log(`[Cache MISS] ${cacheKey}`);
  const data = await fetcher();
  
  // Store in cache
  apiCache.set(cacheKey, data, ttl);
  
  return data;
}

/**
 * Specialized cache helpers
 */

// USGS Elevation cache (24 hour TTL - terrain doesn't change often)
export async function cachedUSGSElevation(
  lat: number,
  lng: number,
  fetcher: () => Promise<number>
): Promise<number> {
  const key = apiCache.generateKey('usgs:elevation', { lat, lng });
  return cachedFetch(key, fetcher, 1000 * 60 * 60 * 24);
}

// Nominatim Geocoding cache (7 day TTL - city locations are static)
export async function cachedNominatimGeocode(
  lat: number,
  lng: number,
  fetcher: () => Promise<any>
): Promise<any> {
  const roundedLat = Math.round(lat * 100) / 100; // Round to 2 decimals
  const roundedLng = Math.round(lng * 100) / 100;
  const key = apiCache.generateKey('nominatim:reverse', { lat: roundedLat, lng: roundedLng });
  return cachedFetch(key, fetcher, 1000 * 60 * 60 * 24 * 7);
}

// NASA NEO API cache (1 hour TTL - updated regularly)
export async function cachedNASANeoData(
  startDate: string,
  endDate: string,
  fetcher: () => Promise<any>
): Promise<any> {
  const key = apiCache.generateKey('nasa:neo', { startDate, endDate });
  return cachedFetch(key, fetcher, 1000 * 60 * 60);
}
