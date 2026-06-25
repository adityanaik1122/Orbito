const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// Use Redis store when REDIS_URL is set; otherwise fall back to in-memory.
// In-memory is fine for a single-instance deploy; set REDIS_URL for multi-instance.
function makeStore() {
  if (!process.env.REDIS_URL) return undefined; // express-rate-limit default = MemoryStore

  try {
    const { RedisStore } = require('rate-limit-redis');
    const Redis = require('ioredis');
    const client = new Redis(process.env.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 1 });
    client.on('error', (e) => logger.warn('Redis rate-limit store error:', e.message));
    logger.success('Rate limiter: using Redis store');
    return new RedisStore({ sendCommand: (...args) => client.call(...args) });
  } catch (e) {
    logger.warn('Rate limiter: Redis store init failed, falling back to memory:', e.message);
    return undefined;
  }
}

const store = makeStore();

const skip = (req) => process.env.NODE_ENV === 'test';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  store,
  skip,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests',
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  store,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    error: 'Too many login attempts',
    message: 'Too many login attempts from this IP, please try again after 15 minutes.',
    retryAfter: '15 minutes',
  },
});

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  store,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'AI rate limit exceeded',
    message: 'Too many AI requests. Please try again later.',
    retryAfter: '1 hour',
  },
});

const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  store,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Booking rate limit exceeded',
    message: 'Too many booking attempts. Please try again later.',
    retryAfter: '1 hour',
  },
});

// Analytics tracking endpoints are public — cap at 30/min per IP to deter DB spam
const trackingLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  store,
  skip,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many tracking requests',
    message: 'Slow down — too many tracking requests from this IP.',
    retryAfter: '1 minute',
  },
});

module.exports = { apiLimiter, authLimiter, aiLimiter, bookingLimiter, trackingLimiter };
