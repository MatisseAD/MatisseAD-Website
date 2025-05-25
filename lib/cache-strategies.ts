interface CacheConfig {
  ttl: number // Time to live in seconds
  staleWhileRevalidate?: number
  tags?: string[]
}

export const CACHE_CONFIGS = {
  github: {
    ttl: 300, // 5 minutes
    staleWhileRevalidate: 600, // 10 minutes
    tags: ["github", "api"],
  },
  modrinth: {
    ttl: 300, // 5 minutes
    staleWhileRevalidate: 600, // 10 minutes
    tags: ["modrinth", "api"],
  },
  static: {
    ttl: 86400, // 24 hours
    staleWhileRevalidate: 172800, // 48 hours
    tags: ["static"],
  },
} as const

export function getCacheHeaders(config: CacheConfig): Record<string, string> {
  const headers: Record<string, string> = {
    "Cache-Control": `public, max-age=${config.ttl}`,
  }

  if (config.staleWhileRevalidate) {
    headers["Cache-Control"] += `, stale-while-revalidate=${config.staleWhileRevalidate}`
  }

  if (config.tags) {
    headers["Cache-Tag"] = config.tags.join(",")
  }

  return headers
}

export async function withCache<T>(key: string, fetcher: () => Promise<T>, config: CacheConfig): Promise<T> {
  try {
    // In a real implementation, you'd use Redis or Vercel KV
    // For now, we'll use a simple in-memory cache
    const cached = memoryCache.get(key)
    if (cached && Date.now() - cached.timestamp < config.ttl * 1000) {
      return cached.data
    }

    const data = await fetcher()
    memoryCache.set(key, { data, timestamp: Date.now() })
    return data
  } catch (error) {
    // Return stale data if available
    const stale = memoryCache.get(key)
    if (stale) {
      console.warn("Returning stale data due to error:", error)
      return stale.data
    }
    throw error
  }
}

// Simple in-memory cache (replace with Redis/KV in production)
const memoryCache = new Map<string, { data: any; timestamp: number }>()
