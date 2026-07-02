import Redis from 'ioredis';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { trace } from '@opentelemetry/api';
dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: 6379
});

const localBuckets = new Map();

const decodeRateLimitSubject = (req) => {
  const cookieToken = req.cookies?.access_token || req.cookies?.token;
  const authHeader = req.headers?.authorization;
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const token = cookieToken || bearerToken;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded?.id !== undefined) {
        return `user:${decoded.id}`;
      }
    } catch (error) {
      // Fall back to network identity when token decoding fails.
    }
  }

  return `ip:${req.ip || req.connection.remoteAddress || 'unknown'}`;
};

const evaluateLocalTokenBucket = (key, capacity, refillRate, now) => {
  const existing = localBuckets.get(key) || { tokens: capacity, lastRefill: now };
  const elapsed = Math.max(0, now - existing.lastRefill);
  const refill = elapsed * refillRate;
  const tokens = Math.min(capacity, existing.tokens + refill);

  if (tokens < 1) {
    localBuckets.set(key, { tokens, lastRefill: now });
    return false;
  }

  localBuckets.set(key, { tokens: tokens - 1, lastRefill: now });
  return true;
};

// Atomic Token Bucket Lua Script
// KEYS[1]: bucket key
// ARGV[1]: max_tokens (capacity)
// ARGV[2]: refill_rate (tokens per second)
// ARGV[3]: current time (seconds)
const tokenBucketScript = `
  local key = KEYS[1]
  local max_tokens = tonumber(ARGV[1])
  local refill_rate = tonumber(ARGV[2])
  local now = tonumber(ARGV[3])
  local expire_time = tonumber(ARGV[4])
  
  local bucket = redis.call("HMGET", key, "tokens", "last_refill")
  local tokens = tonumber(bucket[1])
  local last_refill = tonumber(bucket[2])
  
  if not tokens then
    tokens = max_tokens
    last_refill = now
  else
    local elapsed = math.max(0, now - last_refill)
    local refill = elapsed * refill_rate
    tokens = math.min(max_tokens, tokens + refill)
    last_refill = now
  end
  
  if tokens >= 1 then
    tokens = tokens - 1
    redis.call("HMSET", key, "tokens", tokens, "last_refill", last_refill)
    redis.call("EXPIRE", key, expire_time)
    return 1
  else
    redis.call("HMSET", key, "tokens", tokens, "last_refill", last_refill)
    return 0
  end
`;

/**
 * Rate Limiter Middleware utilizing Upstash Redis
 * Guarantees zero race conditions via atomic Lua script execution.
 */
export const rateLimiter = (options = {}) => {
  const {
    capacity = 5,
    refillRate = 1, // 1 token per second
    keyPrefix = 'ratelimit:',
  } = options;

  return async (req, res, next) => {
    try {
      // Use IP as identifier if no user is authenticated
      const identifier = decodeRateLimitSubject(req);
      const key = `${keyPrefix}${identifier}`;
      const now = Math.floor(Date.now() / 1000);
      const expireTime = Math.ceil(capacity / refillRate);

      // Execute Lua script atomically
      const allowed = await redis.eval(
        tokenBucketScript,
        1,
        key,
        capacity,
        refillRate,
        now,
        expireTime
      );

      if (allowed === 1) {
        next();
      } else {
        const activeSpan = trace.getActiveSpan();
        if (activeSpan) {
          activeSpan.addEvent('rate_limit_rejected');
          activeSpan.setAttribute('rate_limit.rejected', true);
        }
        return res.status(429).json({
          success: false,
          error: "Too Many Requests. Please slow down.",
        });
      }
    } catch (error) {
      console.error("Rate Limiter Error:", error);
      const identifier = decodeRateLimitSubject(req);
      const key = `${keyPrefix}${identifier}`;
      const now = Math.floor(Date.now() / 1000);

      if (evaluateLocalTokenBucket(key, capacity, refillRate, now)) {
        const activeSpan = trace.getActiveSpan();
        if (activeSpan) {
          activeSpan.addEvent('rate_limit_local_fallback_allowed');
          activeSpan.setAttribute('rate_limit.fallback', 'memory');
        }
        next();
        return;
      }

      const activeSpan = trace.getActiveSpan();
      if (activeSpan) {
        activeSpan.addEvent('rate_limit_local_fallback_rejected');
        activeSpan.setAttribute('rate_limit.fallback', 'memory');
        activeSpan.setAttribute('rate_limit.rejected', true);
      }
      return res.status(429).json({
        success: false,
        error: "Too Many Requests. Please slow down.",
      });
    }
  };
};
