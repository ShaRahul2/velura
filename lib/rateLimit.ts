interface RateLimitEntry {
  count: number
  resetAt: number
}

// Per-process fallback. Only meaningful on a long-lived server; on serverless
// each instance keeps its own map, which is why Upstash is preferred in prod.
const buckets = new Map<string, RateLimitEntry>()

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0]?.trim() || 'unknown'
  return req.headers.get('x-real-ip') ?? 'unknown'
}

function memoryAllow(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = buckets.get(key)
  if (!entry || entry.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= limit) return false
  entry.count += 1
  return true
}

async function upstashAllow(key: string, limit: number, windowMs: number): Promise<boolean> {
  const windowSec = Math.max(1, Math.ceil(windowMs / 1000))
  const redisKey = `rl:${key}`
  try {
    const res = await fetch(`${UPSTASH_URL}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      // Create the counter with a TTL only on first hit, then increment.
      body: JSON.stringify([
        ['SET', redisKey, '0', 'EX', String(windowSec), 'NX'],
        ['INCR', redisKey],
      ]),
      cache: 'no-store',
    })
    if (!res.ok) return true // fail-open: never block real users on limiter error
    const data = (await res.json()) as Array<{ result?: unknown }>
    const count = Number(data?.[1]?.result ?? 0)
    return count <= limit
  } catch {
    return true // fail-open on transport/timeout errors
  }
}

/**
 * Fixed-window rate limiter. Returns true when the request is allowed.
 *
 * Uses Upstash Redis when UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are
 * set — this survives serverless cold starts and is shared across instances.
 * Falls back to a per-process map otherwise. Disabled in development.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs = 3_600_000,
): Promise<boolean> {
  if (process.env.NODE_ENV === 'development') return true
  if (UPSTASH_URL && UPSTASH_TOKEN) return upstashAllow(key, limit, windowMs)
  return memoryAllow(key, limit, windowMs)
}
