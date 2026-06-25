const { supabase } = require('../config/supabase');
const { groqClient } = require('../config/groq');
const logger = require('../utils/logger');

/**
 * Enhanced health check endpoint
 * Checks API status, database connectivity, and service availability
 */
async function getHealth(req, res) {
  // Internal view (server-side only, never sent to client)
  const internal = { groq: 'unknown', supabase: 'unknown' };

  internal.groq = groqClient ? 'operational' : 'unavailable';

  if (supabase) {
    try {
      const { error } = await supabase.from('profiles').select('count').limit(1).single();
      internal.supabase = error ? 'degraded' : 'operational';
    } catch {
      internal.supabase = 'unavailable';
    }
  } else {
    internal.supabase = 'unavailable';
  }

  const criticalHealthy = internal.groq === 'operational' && internal.supabase === 'operational';

  // Log details server-side only — never include sensitive info in response
  logger.debug('Health check (internal)', {
    ...internal,
    uptime: process.uptime(),
    env: process.env.NODE_ENV,
  });

  // Public response: only top-level status + per-service status (no URLs, keys, config details)
  const publicResponse = {
    status: criticalHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    services: {
      database: internal.supabase,
      ai: internal.groq,
      email: process.env.RESEND_API_KEY ? 'operational' : 'not-configured',
    },
  };

  if (!criticalHealthy) {
    res.status(503);
  }

  res.json(publicResponse);
}

/**
 * Simple readiness check (for load balancers)
 */
function getReadiness(req, res) {
  res.status(200).send('OK');
}

/**
 * Simple liveness check (for container orchestration)
 */
function getLiveness(req, res) {
  res.status(200).send('OK');
}

module.exports = {
  getHealth,
  getReadiness,
  getLiveness
};
