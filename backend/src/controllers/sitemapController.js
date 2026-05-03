const { supabase } = require('../config/supabase');

const BASE_URL = 'https://orbitotrip.com';

const STATIC_PAGES = [
  { path: '/',                  changefreq: 'daily',   priority: '1.0' },
  { path: '/tours',             changefreq: 'daily',   priority: '0.9' },
  { path: '/itineraries',       changefreq: 'weekly',  priority: '0.8' },
  { path: '/plan',              changefreq: 'weekly',  priority: '0.8' },
  { path: '/attractions',       changefreq: 'weekly',  priority: '0.7' },
  { path: '/why-ai',            changefreq: 'monthly', priority: '0.7' },
  { path: '/blog',              changefreq: 'weekly',  priority: '0.7' },
  { path: '/about',             changefreq: 'monthly', priority: '0.6' },
  { path: '/operator/apply',    changefreq: 'monthly', priority: '0.6' },
  { path: '/help',              changefreq: 'monthly', priority: '0.5' },
  { path: '/contact',           changefreq: 'monthly', priority: '0.5' },
  { path: '/careers',           changefreq: 'monthly', priority: '0.5' },
  { path: '/privacy',           changefreq: 'yearly',  priority: '0.3' },
  { path: '/terms',             changefreq: 'yearly',  priority: '0.3' },
  { path: '/refunds',           changefreq: 'yearly',  priority: '0.3' },
  { path: '/supplier-terms',    changefreq: 'yearly',  priority: '0.3' },
];

const DESTINATIONS = [
  'london', 'paris', 'amsterdam', 'dubai', 'rome',
  'barcelona', 'new-york', 'tokyo', 'istanbul', 'bangkok',
  'singapore', 'bali',
];

function urlEntry(loc, changefreq, priority, lastmod) {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].filter(Boolean).join('\n');
}

async function serveSitemap(req, res) {
  try {
    // Fetch all live tours that have a slug
    const { data: tours } = await supabase
      .from('tours')
      .select('slug, updated_at')
      .or('listing_status.eq.live,is_active.eq.true')
      .not('slug', 'is', null)
      .order('updated_at', { ascending: false });

    const today = new Date().toISOString().slice(0, 10);

    const entries = [];

    // Static pages
    for (const page of STATIC_PAGES) {
      entries.push(urlEntry(`${BASE_URL}${page.path}`, page.changefreq, page.priority, today));
    }

    // Destination pages
    for (const city of DESTINATIONS) {
      entries.push(urlEntry(`${BASE_URL}/destinations/${city}`, 'weekly', '0.9', today));
    }

    // Live tour pages
    for (const tour of tours || []) {
      const lastmod = tour.updated_at ? tour.updated_at.slice(0, 10) : today;
      entries.push(urlEntry(`${BASE_URL}/tours/${tour.slug}`, 'weekly', '0.8', lastmod));
    }

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...entries,
      '</urlset>',
    ].join('\n');

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // cache 1 hour
    res.send(xml);
  } catch (err) {
    res.status(500).send('<?xml version="1.0"?><error>Sitemap generation failed</error>');
  }
}

module.exports = { serveSitemap };
