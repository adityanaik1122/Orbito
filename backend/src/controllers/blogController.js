const { supabase } = require('../config/supabase');
const { fetchAllSources } = require('../services/newsService');
const logger = require('../utils/logger');

/**
 * GET /api/blog
 * Public endpoint — returns the latest blog posts from the database.
 */
async function getBlogPosts(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 24);
    const category = req.query.category || null;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return res.json({
      posts: data || [],
      total: count || 0,
      page,
      limit,
    });
  } catch (err) {
    logger.error('getBlogPosts error:', err);
    return res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
}

/**
 * POST /api/jobs/fetch-blog
 * Protected job endpoint — fetches fresh articles from all RSS feeds
 * and upserts them into the blog_posts table (skip duplicates by source_url).
 *
 * Protect with CRON_SECRET env var. Call daily via any cron service.
 */
async function fetchAndStoreBlogPosts(req, res) {
  const secret = req.headers['x-cron-secret'] || req.query.secret;
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorised' });
  }

  try {
    const articles = await fetchAllSources();

    if (articles.length === 0) {
      return res.json({ inserted: 0, skipped: 0, message: 'No articles fetched' });
    }

    // Upsert — on conflict (source_url) do nothing so we don't overwrite existing posts
    const { data, error } = await supabase
      .from('blog_posts')
      .upsert(articles, {
        onConflict: 'source_url',
        ignoreDuplicates: true,
      })
      .select('id');

    if (error) throw error;

    const inserted = data?.length || 0;
    const skipped = articles.length - inserted;

    logger.info(`Blog fetch job: ${inserted} inserted, ${skipped} skipped duplicates`);
    return res.json({ inserted, skipped, total_fetched: articles.length });
  } catch (err) {
    logger.error('fetchAndStoreBlogPosts error:', err);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * GET /api/blog/categories
 * Returns distinct categories present in the database.
 */
async function getBlogCategories(req, res) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('category')
      .order('category');

    if (error) throw error;

    const categories = ['All', ...new Set((data || []).map((r) => r.category).filter(Boolean))];
    return res.json({ categories });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch categories' });
  }
}

module.exports = { getBlogPosts, fetchAndStoreBlogPosts, getBlogCategories };
