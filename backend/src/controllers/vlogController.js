const { supabase } = require('../config/supabase');
const { fetchTravelVlogs } = require('../services/youtubeService');
const logger = require('../utils/logger');

/**
 * GET /api/vlogs
 * Public — returns latest 15 vlogs from the database.
 */
async function getVlogs(req, res) {
  try {
    const limit = Math.min(30, parseInt(req.query.limit) || 15);
    const { data, error } = await supabase
      .from('travel_vlogs')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return res.json({ vlogs: data || [] });
  } catch (err) {
    logger.error('getVlogs error:', err);
    return res.status(500).json({ error: 'Failed to fetch vlogs' });
  }
}

/**
 * POST /api/jobs/fetch-vlogs
 * Protected cron job — fetches 15 fresh YouTube travel vlogs and upserts into DB.
 */
async function fetchAndStoreVlogs(req, res) {
  const secret = req.headers['x-cron-secret'] || req.query.secret;
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorised' });
  }

  try {
    const vlogs = await fetchTravelVlogs(15);

    if (vlogs.length === 0) {
      return res.json({ inserted: 0, skipped: 0, message: 'No vlogs fetched' });
    }

    const { data, error } = await supabase
      .from('travel_vlogs')
      .upsert(vlogs, { onConflict: 'video_id', ignoreDuplicates: true })
      .select('id');

    if (error) throw error;

    const inserted = data?.length || 0;
    const skipped = vlogs.length - inserted;
    logger.info(`Vlog fetch job: ${inserted} inserted, ${skipped} skipped duplicates`);
    return res.json({ inserted, skipped, total_fetched: vlogs.length });
  } catch (err) {
    logger.error('fetchAndStoreVlogs error:', err);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { getVlogs, fetchAndStoreVlogs };
