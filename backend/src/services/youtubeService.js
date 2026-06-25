const logger = require('../utils/logger');

const YT_API = 'https://www.googleapis.com/youtube/v3';
const API_KEY = process.env.YOUTUBE_API_KEY;

// Search terms rotated daily so content stays fresh
const SEARCH_QUERIES = [
  'travel vlog 2024',
  'best travel destinations vlog',
  'solo travel vlog',
  'Europe travel vlog',
  'Asia travel vlog',
  'budget travel vlog',
  'luxury travel vlog',
];

function todaysQuery() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return SEARCH_QUERIES[dayOfYear % SEARCH_QUERIES.length];
}

// Parse ISO 8601 duration (PT1H2M3S) → "1h 2m"
function parseDuration(iso) {
  if (!iso) return null;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return null;
  const h = match[1] ? `${match[1]}h ` : '';
  const m = match[2] ? `${match[2]}m` : '';
  return (h + m).trim() || null;
}

async function fetchTravelVlogs(maxResults = 15) {
  if (!API_KEY) throw new Error('YOUTUBE_API_KEY is not set');

  const query = todaysQuery();
  logger.info(`[youtubeService] Fetching "${query}" — up to ${maxResults} videos`);

  // Step 1: search for videos
  const searchParams = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video',
    videoCategoryId: '19', // Travel & Events category
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

  // Step 2: get video details (duration + view count)
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
    };
  });
}

module.exports = { fetchTravelVlogs };
