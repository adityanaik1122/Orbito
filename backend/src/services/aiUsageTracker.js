const { supabase } = require('../config/supabase');
const logger = require('../utils/logger');

const FREE_DAILY_LIMIT = 10;

async function getDailyUsage(userId) {
  if (!supabase || !userId) return 0;
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  try {
    const { count, error } = await supabase
      .from('ai_usage')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', todayStart.toISOString());
    if (error) throw error;
    return count || 0;
  } catch (e) {
    logger.warn('ai_usage getDailyUsage failed (table may not exist yet):', e.message);
    return 0;
  }
}

async function recordUsage(userId, endpoint) {
  if (!supabase || !userId) return;
  try {
    await supabase.from('ai_usage').insert([{ user_id: userId, endpoint }]);
  } catch (e) {
    logger.warn('ai_usage recordUsage failed:', e.message);
  }
}

/**
 * Check if the user is within their daily limit, then record the usage.
 * Returns { allowed: true } or { allowed: false, used, limit }.
 * Gracefully allows through if the table doesn't exist yet.
 */
async function checkAndRecord(userId, endpoint) {
  if (!userId) return { allowed: true };

  const used = await getDailyUsage(userId);
  if (used >= FREE_DAILY_LIMIT) {
    return { allowed: false, used, limit: FREE_DAILY_LIMIT };
  }

  await recordUsage(userId, endpoint);
  return { allowed: true, used: used + 1, limit: FREE_DAILY_LIMIT };
}

module.exports = { checkAndRecord, FREE_DAILY_LIMIT };
