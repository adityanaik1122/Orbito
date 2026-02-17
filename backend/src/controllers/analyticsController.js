const { supabase } = require('../config/supabase');

/**
 * Get dashboard summary stats
 */
async function getDashboardSummary(req, res) {
  try {
    const { data, error } = await supabase
      .from('dashboard_summary')
      .select('*')
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * Get daily stats for date range
 */
async function getDailyStats(req, res) {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    const { data, error } = await supabase
      .rpc('get_daily_stats', {
        start_date: startDate,
        end_date: endDate
      });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching daily stats:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * Get user registrations with pagination
 */
async function getUserRegistrations(req, res) {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('user_registrations')
      .select('*', { count: 'exact' })
      .order('registered_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user registrations:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * Get all bookings with filters
 */
async function getBookings(req, res) {
  try {
    const { page = 1, limit = 50, status, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('bookings')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('booking_status', status);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * Get affiliate clicks stats
 */
async function getAffiliateStats(req, res) {
  try {
    const { startDate, endDate } = req.query;

    let query = supabase
      .from('affiliate_clicks')
      .select('*')
      .order('clicked_at', { ascending: false });

    if (startDate) {
      query = query.gte('clicked_at', startDate);
    }

    if (endDate) {
      query = query.lte('clicked_at', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Calculate stats
    const stats = {
      total_clicks: data.length,
      total_conversions: data.filter(c => c.converted).length,
      conversion_rate: data.length > 0 
        ? ((data.filter(c => c.converted).length / data.length) * 100).toFixed(2)
        : 0,
      total_commission: data
        .filter(c => c.converted)
        .reduce((sum, c) => sum + parseFloat(c.commission_amount || 0), 0),
      by_provider: {}
    };

    // Group by provider
    data.forEach(click => {
      const provider = click.affiliate_provider || 'unknown';
      if (!stats.by_provider[provider]) {
        stats.by_provider[provider] = {
          clicks: 0,
          conversions: 0,
          commission: 0
        };
      }
      stats.by_provider[provider].clicks++;
      if (click.converted) {
        stats.by_provider[provider].conversions++;
        stats.by_provider[provider].commission += parseFloat(click.commission_amount || 0);
      }
    });

    res.json({ success: true, stats, clicks: data });
  } catch (error) {
    console.error('Error fetching affiliate stats:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * Get itinerary stats
 */
async function getItineraryStats(req, res) {
  try {
    const { data, error } = await supabase
      .from('itinerary_stats')
      .select('*')
      .order('date', { ascending: false })
      .limit(30);

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching itinerary stats:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * Track page view
 */
async function trackPageView(req, res) {
  try {
    const { pagePath, pageTitle, referrer } = req.body;
    const userId = req.user?.id || null;
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.headers['x-forwarded-for'];

    const { error } = await supabase
      .from('page_views')
      .insert({
        user_id: userId,
        page_path: pagePath,
        page_title: pageTitle,
        referrer: referrer,
        user_agent: userAgent,
        ip_address: ipAddress
      });

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking page view:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * Track affiliate click
 */
async function trackAffiliateClick(req, res) {
  try {
    const { tourId, tourTitle, affiliateProvider, affiliateLink } = req.body;
    const userId = req.user?.id || null;

    const { error } = await supabase
      .from('affiliate_clicks')
      .insert({
        user_id: userId,
        tour_id: tourId,
        tour_title: tourTitle,
        affiliate_provider: affiliateProvider,
        affiliate_link: affiliateLink
      });

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking affiliate click:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getDashboardSummary,
  getDailyStats,
  getUserRegistrations,
  getBookings,
  getAffiliateStats,
  getItineraryStats,
  trackPageView,
  trackAffiliateClick
};
