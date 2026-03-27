// Simple in-memory rate limiter using a sliding window counter.
// Suitable for single-process deployments (Next.js server).

const rateMap = new Map<string, { count: number; resetAt: number }>();

// Periodic cleanup to prevent memory leaks (every 60s)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateMap) {
    if (now > entry.resetAt) rateMap.delete(key);
  }
}, 60_000);

/**
 * Check if a request is within the rate limit.
 * Returns true if allowed, false if rate-limited.
 */
export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = rateMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) return false;

  entry.count++;
  return true;
}
