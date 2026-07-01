import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379
});

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
      const identifier = req.cookies?.token ? 'authenticated_user' : (req.ip || req.connection.remoteAddress || 'unknown');
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
        return res.status(429).json({
          success: false,
          error: "Too Many Requests. Please slow down.",
        });
      }
    } catch (error) {
      console.error("Rate Limiter Error:", error);
      // Fail-open: If Redis is down, allow request through
      next();
    }
  };
};
