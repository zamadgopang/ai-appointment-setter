import { env } from './env';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (use Redis in production for distributed systems)
const store = new Map<string, RateLimitStore>();

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Simple in-memory rate limiter
 * For production with multiple instances, use Redis or a dedicated rate limiting service
 * @param identifier - Unique identifier (e.g., user ID, IP address, tenant ID)
 * @param limit - Maximum number of requests allowed
 * @param windowMs - Time window in milliseconds
 */
export function rateLimit(
  identifier: string,
  limit: number = env.RATE_LIMIT_MAX_REQUESTS,
  windowMs: number = env.RATE_LIMIT_WINDOW_MS
): RateLimitResult {
  const now = Date.now();
  const record = store.get(identifier);

  // Clean up expired entries
  if (record && now > record.resetTime) {
    store.delete(identifier);
  }

  const currentRecord = store.get(identifier);

  if (!currentRecord) {
    // First request in the window
    store.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: now + windowMs,
    };
  }

  if (currentRecord.count >= limit) {
    // Rate limit exceeded
    return {
      success: false,
      limit,
      remaining: 0,
      reset: currentRecord.resetTime,
    };
  }

  // Increment count
  currentRecord.count++;
  store.set(identifier, currentRecord);

  return {
    success: true,
    limit,
    remaining: limit - currentRecord.count,
    reset: currentRecord.resetTime,
  };
}

/**
 * Reset rate limit for a specific identifier
 */
export function resetRateLimit(identifier: string): void {
  store.delete(identifier);
}

/**
 * Clean up expired entries (call periodically)
 */
export function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (now > value.resetTime) {
      store.delete(key);
    }
  }
}

// Clean up every 5 minutes
setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
