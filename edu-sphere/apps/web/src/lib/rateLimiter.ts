/**
 * Rate Limiter
 * 
 * API хүсэлтийн хурдыг хязгаарлах
 */

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};

  /**
   * Check if request is allowed
   */
  async check(
    identifier: string,
    config: RateLimitConfig
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const now = Date.now();
    const entry = this.store[identifier];

    // Initialize or reset if window expired
    if (!entry || now > entry.resetTime) {
      this.store[identifier] = {
        count: 1,
        resetTime: now + config.windowMs,
      };

      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime: now + config.windowMs,
      };
    }

    // Increment count
    entry.count++;

    // Check if limit exceeded
    if (entry.count > config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    return {
      allowed: true,
      remaining: config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  /**
   * Reset rate limit for identifier
   */
  reset(identifier: string): void {
    delete this.store[identifier];
  }

  /**
   * Clean up expired entries (call periodically)
   */
  cleanup(): void {
    const now = Date.now();
    Object.keys(this.store).forEach((key) => {
      if (now > this.store[key].resetTime) {
        delete this.store[key];
      }
    });
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

/**
 * Rate limit configurations
 */
export const RATE_LIMITS = {
  // Default API rate limit
  API_DEFAULT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  },

  // Authentication endpoints
  AUTH_LOGIN: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
  },

  // File upload
  FILE_UPLOAD: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
  },

  // Email sending
  EMAIL_SEND: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 20,
  },

  // AI API calls
  AI_API: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 50,
  },
} as const;

/**
 * Rate limit middleware
 */
export async function rateLimit(
  identifier: string,
  config: RateLimitConfig = RATE_LIMITS.API_DEFAULT
): Promise<void> {
  const result = await rateLimiter.check(identifier, config);

  if (!result.allowed) {
    const resetDate = new Date(result.resetTime).toISOString();
    throw new Error(
      `Rate limit exceeded. Try again at ${resetDate}`
    );
  }
}

/**
 * Get identifier from request
 */
export function getRateLimitIdentifier(
  ip?: string,
  userId?: string
): string {
  return userId || ip || 'anonymous';
}

// Cleanup expired entries every hour
if (typeof window === 'undefined') {
  setInterval(() => {
    rateLimiter.cleanup();
  }, 60 * 60 * 1000);
}
