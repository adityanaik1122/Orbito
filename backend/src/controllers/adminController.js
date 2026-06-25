const { supabase } = require('../config/supabase');
const { sendNotification } = require('../services/emailService');
const logger = require('../utils/logger');

// ── Operator Applications ─────────────────────────────────────────────────────

async function getApplications(req, res) {
  try {
    const { status } = req.query; // optional filter: pending | approved | rejected

    let query = supabase
      .from('operator_applications')
      .select('*, profiles:user_id(email, full_name)')
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;

    res.json({ success: true, applications: data });
  } catch (err) {
    logger.error('getApplications error:', err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
}

async function approveApplication(req, res) {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    // Fetch application to get user_id and email
    const { data: app, error: fetchErr } = await supabase
      .from('operator_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !app) return res.status(404).json({ error: 'Application not found' });
    if (app.status !== 'pending') return res.status(400).json({ error: 'Application already reviewed' });

    // Promote user to operator role
    const { error: roleErr } = await supabase
      .from('profiles')
      .update({ role: 'operator' })
      .eq('id', app.user_id);

    if (roleErr) throw roleErr;

    // Mark application approved
    const { error: appErr } = await supabase
      .from('operator_applications')
      .update({ status: 'approved', reviewed_by: adminId, reviewed_at: new Date().toISOString() })
      .eq('id', id);

    if (appErr) throw appErr;

    // Send approval email
    sendNotification(
      app.contact_email,
      'Welcome to Orbito — Your Operator Account is Approved!',
      `<p>Hi ${app.contact_name},</p>
       <p>Your application to list experiences on Orbito has been approved!</p>
       <p>You can now log in and start creating your tours from your <strong>Operator Dashboard</strong>.</p>
       <p>Welcome aboard!<br><strong>The Orbito Team</strong></p>`
    ).catch((e) => logger.error('Approval email failed:', e));

    logger.success(`Operator application ${id} approved — user ${app.user_id} promoted`);
    res.json({ success: true, message: 'Application approved' });
  } catch (err) {
    logger.error('approveApplication error:', err);
    res.status(500).json({ error: 'Failed to approve application' });
  }
}

async function rejectApplication(req, res) {
  try {
    const { id } = req.params;
    const adminId = req.user.id;
    const { reason } = req.body;

    const { data: app, error: fetchErr } = await supabase
      .from('operator_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !app) return res.status(404).json({ error: 'Application not found' });

    const { error } = await supabase
      .from('operator_applications')
      .update({
        status: 'rejected',
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
        rejection_reason: reason || null,
      })
      .eq('id', id);

    if (error) throw error;

    sendNotification(
      app.contact_email,
      'Update on your Orbito operator application',
      `<p>Hi ${app.contact_name},</p>
       <p>Thank you for applying to list experiences on Orbito.</p>
       <p>After reviewing your application, we're unable to approve it at this time.</p>
       ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
       <p>You're welcome to re-apply in the future.<br><strong>The Orbito Team</strong></p>`
    ).catch((e) => logger.error('Rejection email failed:', e));

    res.json({ success: true, message: 'Application rejected' });
  } catch (err) {
    logger.error('rejectApplication error:', err);
    res.status(500).json({ error: 'Failed to reject application' });
  }
}

// ── Tour Listing Approval ─────────────────────────────────────────────────────

async function getPendingTours(req, res) {
  try {
    const { data, error } = await supabase
      .from('tours')
      .select('*, profiles:operator_id(email, full_name)')
      .eq('listing_status', 'pending_review')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, tours: data });
  } catch (err) {
    logger.error('getPendingTours error:', err);
    res.status(500).json({ error: 'Failed to fetch pending tours' });
  }
}

async function approveTour(req, res) {
  try {
    const { id } = req.params;

    const { data: tour, error: fetchErr } = await supabase
      .from('tours')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !tour) return res.status(404).json({ error: 'Tour not found' });

    const { error } = await supabase
      .from('tours')
      .update({ listing_status: 'live', is_active: true })
      .eq('id', id);

    if (error) throw error;

    logger.success(`Tour ${id} approved and set to live`);
    res.json({ success: true, message: 'Tour approved and now live' });
  } catch (err) {
    logger.error('approveTour error:', err);
    res.status(500).json({ error: 'Failed to approve tour' });
  }
}

async function rejectTour(req, res) {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const { error } = await supabase
      .from('tours')
      .update({ listing_status: 'rejected' })
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true, message: 'Tour rejected' });
  } catch (err) {
    logger.error('rejectTour error:', err);
    res.status(500).json({ error: 'Failed to reject tour' });
  }
}

// ── Tour Meta Scraper ─────────────────────────────────────────────────────────

// Parse city and country from a Viator URL slug
// e.g. /tours/London/... → city=London, country=United Kingdom
const CITY_COUNTRY_MAP = {
  london: { city: 'London', country: 'United Kingdom' },
  paris: { city: 'Paris', country: 'France' },
  rome: { city: 'Rome', country: 'Italy' },
  barcelona: { city: 'Barcelona', country: 'Spain' },
  amsterdam: { city: 'Amsterdam', country: 'Netherlands' },
  dubai: { city: 'Dubai', country: 'UAE' },
  newyork: { city: 'New York', country: 'United States' },
  'new-york': { city: 'New York', country: 'United States' },
  tokyo: { city: 'Tokyo', country: 'Japan' },
  sydney: { city: 'Sydney', country: 'Australia' },
  istanbul: { city: 'Istanbul', country: 'Turkey' },
  prague: { city: 'Prague', country: 'Czech Republic' },
  vienna: { city: 'Vienna', country: 'Austria' },
  lisbon: { city: 'Lisbon', country: 'Portugal' },
  madrid: { city: 'Madrid', country: 'Spain' },
  berlin: { city: 'Berlin', country: 'Germany' },
  athens: { city: 'Athens', country: 'Greece' },
  bangkok: { city: 'Bangkok', country: 'Thailand' },
  singapore: { city: 'Singapore', country: 'Singapore' },
  bali: { city: 'Bali', country: 'Indonesia' },
};

function parseCityFromUrl(url) {
  try {
    const match = url.match(/viator\.com\/tours\/([^/]+)/i);
    if (!match) return { city: '', country: '' };
    const slug = match[1].toLowerCase().replace(/-/g, '');
    // Try exact slug match first, then without hyphens
    const key = match[1].toLowerCase();
    return CITY_COUNTRY_MAP[key] || CITY_COUNTRY_MAP[slug] || { city: match[1].replace(/-/g, ' '), country: '' };
  } catch {
    return { city: '', country: '' };
  }
}

async function fetchTourMeta(req, res) {
  const { url } = req.query;
  if (!url || !url.includes('viator.com')) {
    return res.status(400).json({ error: 'A Viator URL is required' });
  }

  try {
    // Fetch with browser-like headers so Viator serves the OG meta tags
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-GB,en;q=0.9',
        'Cache-Control': 'no-cache',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return res.status(502).json({ error: `Viator returned ${response.status}` });
    }

    const html = await response.text();

    const getMeta = (property) => {
      const match = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i'))
        || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`, 'i'));
      return match ? match[1].trim() : '';
    };

    const title = getMeta('og:title') || getMeta('twitter:title') || '';
    const description = getMeta('og:description') || getMeta('description') || '';
    const image_url = getMeta('og:image') || getMeta('twitter:image') || '';
    const { city, country } = parseCityFromUrl(url);

    // Strip " | Viator" suffix from title if present
    const cleanTitle = title.replace(/\s*\|.*$/, '').trim();

    logger.info(`fetchTourMeta: scraped "${cleanTitle}" from ${url}`);
    return res.json({ title: cleanTitle, description, image_url, city, country });
  } catch (err) {
    logger.error('fetchTourMeta error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch tour metadata' });
  }
}

module.exports = {
  getApplications,
  approveApplication,
  rejectApplication,
  getPendingTours,
  approveTour,
  rejectTour,
  fetchTourMeta,
};
