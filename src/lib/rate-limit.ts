/**
 * Simple in-memory rate limiter.
 *
 * Uses a sliding-window counter per key (typically userId).
 * Suitable for single-instance deployments (Vercel serverless functions
 * are ephemeral, so this provides best-effort protection — for stronger
 * guarantees, use Redis or Vercel KV).
 */

interface RateLimitEntry {
    count: number
    resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Periodically clean stale entries to prevent memory leaks
const CLEANUP_INTERVAL = 60_000
let lastCleanup = Date.now()

function cleanup() {
    const now = Date.now()
    if (now - lastCleanup < CLEANUP_INTERVAL) return
    lastCleanup = now
    for (const [key, entry] of store) {
        if (entry.resetAt < now) {
            store.delete(key)
        }
    }
}

export interface RateLimitResult {
    allowed: boolean
    remaining: number
    resetAt: number
}

/**
 * Check and consume one unit of rate limit for the given key.
 *
 * @param key - Unique identifier (e.g. userId or userId:route)
 * @param maxRequests - Maximum requests allowed in the window
 * @param windowMs - Window duration in milliseconds (default 60s)
 */
export function checkRateLimit(
    key: string,
    maxRequests: number,
    windowMs = 60_000
): RateLimitResult {
    cleanup()

    const now = Date.now()
    const entry = store.get(key)

    if (!entry || entry.resetAt < now) {
        store.set(key, { count: 1, resetAt: now + windowMs })
        return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs }
    }

    if (entry.count >= maxRequests) {
        return { allowed: false, remaining: 0, resetAt: entry.resetAt }
    }

    entry.count++
    return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt }
}
