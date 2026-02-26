const { supabase } = require('../config/supabase');
const { groqClient } = require('../config/groq');
const logger = require('../utils/logger');

/**
 * Enhanced health check endpoint
 * Checks API status, database connectivity, and service availability
 */
async function getHealth(req, res) {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    services: {}
  };

  // Check Groq AI
  health.services.groq = {
    configured: !!process.env.GROQ_API_KEY,
    available: !!groqClient,
    status: groqClient ? 'operational' : 'unavailable'
  };

  // Check Supabase
  health.services.supabase = {
    configured: !!process.env.SUPABASE_URL,
    status: 'unknown'
  };

  // Test Supabase connection
  if (supabase) {
    try {
      const { error } = await supabase.from('profiles').select('count').limit(1).single();
      health.services.supabase.status = error ? 'degraded' : 'operational';
      health.services.supabase.connected = !error;
    } catch (err) {
      health.services.supabase.status = 'unavailable';
      health.services.supabase.connected = false;
      health.services.supabase.error = err.message;
    }
  } else {
    health.services.supabase.status = 'unavailable';
    health.services.supabase.connected = false;
  }

  // Check HuggingFace (optional)
  health.services.huggingface = {
    configured: !!process.env.HUGGINGFACE_API_KEY,
    status: process.env.HUGGINGFACE_API_KEY ? 'operational' : 'not-configured'
  };

  // Check Resend Email (optional)
  health.services.email = {
    configured: !!process.env.RESEND_API_KEY,
    status: process.env.RESEND_API_KEY ? 'operational' : 'not-configured'
  };

  // Determine overall status
  const criticalServices = ['groq', 'supabase'];
  const allCriticalHealthy = criticalServices.every(
    service => health.services[service].status === 'operational'
  );

  if (!allCriticalHealthy) {
    health.status = 'degraded';
    res.status(503); // Service Unavailable
  }

  // Log health check in development
  if (process.env.NODE_ENV !== 'production') {
    logger.debug('Health check', health);
  }

  res.json(health);
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
