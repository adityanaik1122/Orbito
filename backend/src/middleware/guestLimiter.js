const crypto = require('crypto');
const { supabase } = require('../config/supabase');
const logger = require('../utils/logger');

const GUEST_LIMIT = 2;
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Local Map acts as a fast read-through cache.
// Supabase is the source of truth — survives restarts and multiple instances.
const localCache = new Map(); // token -> { count, expiresAt }

setInterval(() => {
  const now = Date.now();
  for (const [token, s] of localCache) {
    if (now > s.expiresAt) localCache.delete(token);
  }
}, 60 * 60 * 1000);

/**
 * Issues a guest token, persisting it to Supabase so it survives restarts.
 * Route handler must await this.
 */
async function issueGuestToken() {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  if (supabase) {
    try {
      await supabase
        .from('guest_sessions')
        .insert([{ token, count: 0, expires_at: expiresAt.toISOString() }]);
    } catch (e) {
      logger.warn('guest_sessions: Supabase insert failed, token is memory-only:', e.message);
    }
  }

  localCache.set(token, { count: 0, expiresAt: expiresAt.getTime() });
  return token;
}

async function getSession(token) {
  // Fast path: local cache
  const local = localCache.get(token);
  if (local) {
    if (Date.now() > local.expiresAt) {
      localCache.delete(token);
      return null;
    }
    return local;
  }

  // Slow path: Supabase (after restart or on a different instance)
  if (!supabase) return null;
  try {
    const { data } = await supabase
      .from('guest_sessions')
      .select('count, expires_at')
      .eq('token', token)
      .single();

    if (!data) return null;
    const expiresAt = new Date(data.expires_at).getTime();
    if (Date.now() > expiresAt) return null;

    const session = { count: data.count, expiresAt };
    localCache.set(token, session);
    return session;
  } catch (e) {
    logger.warn('guest_sessions: lookup failed:', e.message);
    return null;
  }
}

function incrementSession(token, session) {
  session.count++;
  localCache.set(token, session);

  // Fire-and-forget persist: local cache is already updated, Supabase trails slightly
  if (supabase) {
    supabase
      .from('guest_sessions')
      .update({ count: session.count })
      .eq('token', token)
      .then(({ error }) => {
        if (error) logger.warn('guest_sessions: failed to persist count increment:', error.message);
      });
  }
}

/**
 * Middleware that allows:
 *   - Authenticated users (Bearer JWT)  → validates token, attaches req.user
 *   - Guest users (X-Guest-Token header) → checks Supabase-backed limit
 *   - No credentials                    → 401 with requiresToken: true
 */
async function requireAuthOrGuestToken(req, res, next) {
  const authHeader = req.headers.authorization;

  // Authenticated path
  if (authHeader?.startsWith('Bearer ')) {
    if (!supabase) {
      return res.status(500).json({ error: 'Authentication service unavailable' });
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    return next();
  }

  // Guest path
  const guestToken = req.headers['x-guest-token'];

  if (!guestToken) {
    return res.status(401).json({
      error: 'AUTH_REQUIRED',
      message: 'Request a guest token at POST /api/guest-token, or sign in.',
      requiresToken: true,
    });
  }

  const session = await getSession(guestToken);

  if (!session) {
    return res.status(401).json({
      error: 'INVALID_GUEST_TOKEN',
      message: 'Guest session expired or invalid. Request a new one.',
      requiresToken: true,
    });
  }

  if (session.count >= GUEST_LIMIT) {
    logger.info(`Guest token exhausted after ${GUEST_LIMIT} uses`);
    return res.status(429).json({
      error: 'GUEST_LIMIT_REACHED',
      message: `You've used your ${GUEST_LIMIT} free itinerary generations. Sign up to continue.`,
      requiresAuth: true,
      used: session.count,
      limit: GUEST_LIMIT,
    });
  }

  incrementSession(guestToken, session);
  res.setHeader('X-Guest-Uses-Remaining', String(GUEST_LIMIT - session.count));
  logger.info(`Guest token used (${session.count}/${GUEST_LIMIT})`);
  next();
}

module.exports = { requireAuthOrGuestToken, issueGuestToken };
