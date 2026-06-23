const crypto = require('crypto');
const logger = require('../utils/logger');

const cache = new Map(); // key -> { data, expiresAt }
const TTL_MS = 60 * 60 * 1000; // 1 hour

setInterval(() => {
  const now = Date.now();
  for (const [k, v] of cache) {
    if (now > v.expiresAt) cache.delete(k);
  }
}, TTL_MS);

function makeKey(params) {
  const sorted = JSON.stringify(params, Object.keys(params).sort());
  return crypto.createHash('md5').update(sorted).digest('hex');
}

function get(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function set(key, data, ttlMs = TTL_MS) {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
  logger.info(`AI cache: stored key ${key.slice(0, 8)}… (${cache.size} entries)`);
}

function size() {
  return cache.size;
}

module.exports = { makeKey, get, set, size };
