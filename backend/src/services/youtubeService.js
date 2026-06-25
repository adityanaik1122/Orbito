const logger = require('../utils/logger');

const YT_API = 'https://www.googleapis.com/youtube/v3';
const API_KEY = process.env.YOUTUBE_API_KEY;

// Each category fetches 5 videos = 15 total
const CATEGORIES = [
  {
    label: 'Trending Now',
    queries: ['best travel vlog 2024', 'travel vlog trending', 'travel destinations 2024'],
  },
  {
    label: 'Hidden Gems',
    queries: ['hidden gems travel vlog', 'underrated destinations travel', 'off the beaten path travel'],
  },
  {
    label: 'Solo Travel',
    queries: ['solo travel vlog', 'solo female travel', 'solo backpacking adventure'],
  },
];

// Rotate query within a category based on day of year so content stays fresh
function todaysQuery(queries) {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return queries[dayOfYear % queries.length];
}

function parseDuration(iso) {
  if (!iso) return null;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return null;
  const h = match[1] ? `${match[1]}h ` : '';
  const m = match[2] ? `${match[2]}m` : '';
  return (h + m).trim() || null;
}

async function fetchCategory(category, maxResults = 5) {
  const query = todaysQuery(category.queries);
  logger.info(`[youtubeService] "${category.label}" → query: "${query}"`);

  const searchParams = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video',
    videoCategoryId: '19',
    maxResults: String(maxResults),
    order: 'viewCount',
    relevanceLanguage: 'en',
    safeSearch: 'strict',
    key: API_KEY,
  });

  const searchRes = await fetch(`${YT_API}/search?${searchParams}`);
  if (!searchRes.ok) {
    const err = await searchRes.json();
    throw new Error(err.error?.message || `YouTube search failed: ${searchRes.status}`);
  }

  const searchData = await searchRes.json();
  const items = searchData.items || [];
  if (items.length === 0) return [];

  const videoIds = items.map((i) => i.id.videoId).join(',');

  const detailParams = new URLSearchParams({
    part: 'contentDetails,statistics',
    id: videoIds,
    key: API_KEY,
  });

  const detailRes = await fetch(`${YT_API}/videos?${detailParams}`);
  const detailData = detailRes.ok ? await detailRes.json() : { items: [] };
  const detailMap = {};
  (detailData.items || []).forEach((v) => {
    detailMap[v.id] = {
      duration: parseDuration(v.contentDetails?.duration),
      viewCount: parseInt(v.statistics?.viewCount || '0', 10),
    };
  });

  return items.map((item) => {
    const videoId = item.id.videoId;
    const snippet = item.snippet;
    const detail = detailMap[videoId] || {};
    return {
      video_id: videoId,
      title: snippet.title,
      channel_name: snippet.channelTitle,
      thumbnail_url: snippet.thumbnails?.maxres?.url
        || snippet.thumbnails?.high?.url
        || snippet.thumbnails?.medium?.url
        || '',
      video_url: `https://www.youtube.com/watch?v=${videoId}`,
      published_at: snippet.publishedAt || new Date().toISOString(),
      view_count: detail.viewCount || 0,
      duration: detail.duration || null,
      category: category.label,
    };
  });
}

async function fetchTravelVlogs(perCategory = 5) {
  if (!API_KEY) throw new Error('YOUTUBE_API_KEY is not set');

  const results = await Promise.all(CATEGORIES.map((c) => fetchCategory(c, perCategory)));
  const all = results.flat();

  const seen = new Set();
  const unique = all.filter((v) => {
    if (seen.has(v.video_id)) return false;
    seen.add(v.video_id);
    return true;
  });

  logger.info(`[youtubeService] ${unique.length} unique vlogs fetched across ${CATEGORIES.length} categories`);
  return unique;
}

module.exports = { fetchTravelVlogs };
