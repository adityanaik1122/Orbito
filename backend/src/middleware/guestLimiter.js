const crypto = require('crypto');
const { supabase } = require('../config/supabase');
const logger = require('../utils/logger');

const guestSessions = new Map(); // token -> { count, expiresAt }
const GUEST_LIMIT = 2;
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Purge expired sessions periodically to prevent memory growth
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of guestSessions) {
    if (now > session.expiresAt) guestSessions.delete(token);
  }
}, 60 * 60 * 1000); // every hour

/**
 * Issues a new guest token and stores it server-side.
 * Call this from the /guest-token route handler.
 */
function issueGuestToken() {
  const token = crypto.randomUUID();
  guestSessions.set(token, { count: 0, expiresAt: Date.now() + SESSION_TTL_MS });
  return token;
}

/**
 * Middleware for AI endpoints that allows:
 *   - Authenticated users (Bearer JWT)  → validated, req.user attached, no limit
 *   - Guest users (X-Guest-Token header) → allowed up to GUEST_LIMIT times
 *   - No credentials at all             → 401 with requiresToken: true
 */
async function requireAuthOrGuestToken(req, res, next) {
  const authHeader = req.headers.authorization;

  // ── Authenticated path ──────────────────────────────────────────────────────
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

  // ── Guest path ──────────────────────────────────────────────────────────────
  const guestToken = req.headers['x-guest-token'];

  if (!guestToken) {
    return res.status(401).json({
      error: 'AUTH_REQUIRED',
      message: 'Request a guest token at POST /api/guest-token, or sign in.',
      requiresToken: true,
    });
  }

  const session = guestSessions.get(guestToken);

  if (!session || Date.now() > session.expiresAt) {
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

  session.count++;
  res.setHeader('X-Guest-Uses-Remaining', String(GUEST_LIMIT - session.count));
  logger.info(`Guest token used (${session.count}/${GUEST_LIMIT})`);
  next();
}

module.exports = { requireAuthOrGuestToken, issueGuestToken };
