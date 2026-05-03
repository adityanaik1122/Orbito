/**
 * newsService.js
 * Fetches articles from popular travel blog RSS feeds.
 * Uses rss2json.com to convert RSS → JSON (no npm install needed, free tier).
 *
 * To add a new blog: add an entry to TRAVEL_FEEDS below.
 * To use more items per feed: add RSSJON_API_KEY to your .env (free at rss2json.com).
 */

const logger = require('../utils/logger');

const RSS2JSON = 'https://api.rss2json.com/v1/api.json';
const API_KEY = process.env.RSS2JSON_API_KEY || ''; // optional — increases limits
const ITEMS_PER_FEED = 10;
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80';

// ── Travel blog RSS feeds ─────────────────────────────────────────────────────
// Add or remove feeds here. name and category are used for display.
const TRAVEL_FEEDS = [
  {
    name: 'Nomadic Matt',
    url: 'https://www.nomadicmatt.com/feed/',
    category: 'Budget Travel',
  },
  {
    name: 'The Points Guy',
    url: 'https://thepointsguy.com/feed/',
    category: 'Travel Tips',
  },
  {
    name: 'Atlas Obscura',
    url: 'https://www.atlasobscura.com/feeds/latest',
    category: 'Hidden Gems',
  },
  {
    name: 'Adventurous Kate',
    url: 'https://www.adventurouskate.com/feed/',
    category: 'Solo Travel',
  },
  {
    name: 'Travel + Leisure',
    url: 'https://www.travelandleisure.com/thmb/latest.rss',
    category: 'Luxury Travel',
  },
  {
    name: 'Condé Nast Traveler',
    url: 'https://www.cntraveler.com/feed/rss',
    category: 'Travel',
  },
  {
    name: 'The Blonde Abroad',
    url: 'https://theblondeabroad.com/feed/',
    category: 'Destinations',
  },
  {
    name: 'TravelAwaits',
    url: 'https://www.travelawaits.com/feed/',
    category: 'Travel News',
  },
];

// ── helpers ───────────────────────────────────────────────────────────────────

function stripHtml(str) {
  if (!str) return '';
  return str.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim();
}

function firstImageFromHtml(html) {
  if (!html) return null;
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

function estimateReadTime(text) {
  const words = (text || '').split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

async function fetchFeed(feed) {
  try {
    const params = new URLSearchParams({
      rss_url: feed.url,
      count: String(ITEMS_PER_FEED),
      ...(API_KEY ? { api_key: API_KEY } : {}),
    });

    const res = await fetch(`${RSS2JSON}?${params}`);
    if (!res.ok) {
      logger.error(`[newsService] ${feed.name}: HTTP ${res.status}`);
      return [];
    }

    const data = await res.json();
    if (data.status !== 'ok' || !data.items) {
      logger.error(`[newsService] ${feed.name}: bad response`, data.message);
      return [];
    }

    return data.items
      .filter((item) => item.link && item.title)
      .map((item) => {
        const summary = stripHtml(item.description || item.content || '');
        const image =
          item.thumbnail ||
          item.enclosure?.link ||
          firstImageFromHtml(item.content || item.description) ||
          FALLBACK_IMAGE;

        return {
          title: stripHtml(item.title),
          summary: summary.slice(0, 400) + (summary.length > 400 ? '…' : ''),
          image_url: image,
          source_name: feed.name,
          source_url: item.link,
          category: feed.category,
          published_at: item.pubDate
            ? new Date(item.pubDate).toISOString()
            : new Date().toISOString(),
          read_time: estimateReadTime(summary),
        };
      });
  } catch (err) {
    logger.error(`[newsService] ${feed.name} error:`, err.message);
    return [];
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Fetch articles from all configured travel blog feeds.
 * Returns a deduplicated array normalised to the blog_posts schema.
 */
async function fetchAllSources() {
  // Fetch all feeds concurrently
  const results = await Promise.all(TRAVEL_FEEDS.map(fetchFeed));
  const all = results.flat();

  // Deduplicate by source_url
  const seen = new Set();
  const unique = all.filter((a) => {
    if (seen.has(a.source_url)) return false;
    seen.add(a.source_url);
    return true;
  });

  const counts = TRAVEL_FEEDS.map((f, i) => `${f.name}:${results[i].length}`).join(' | ');
  logger.info(`[newsService] ${unique.length} unique articles — ${counts}`);
  return unique;
}

module.exports = { fetchAllSources };
