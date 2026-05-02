const { supabase } = require('../config/supabase');
const logger = require('../utils/logger');

const PLATFORM_FEE_RATE = 0.15; // Orbito keeps 15%, operator earns 85%

// ── Operator Application ──────────────────────────────────────────────────────

async function applyAsOperator(req, res) {
  try {
    const userId = req.user.id;
    const {
      company_name,
      contact_name,
      contact_email,
      contact_phone,
      website,
      tour_types,
      operating_locations,
      years_in_business,
      description,
    } = req.body;

    if (!company_name || !contact_name || !contact_email) {
      return res.status(400).json({ error: 'company_name, contact_name and contact_email are required' });
    }

    // Check for existing application
    const { data: existing } = await supabase
      .from('operator_applications')
      .select('id, status')
      .eq('user_id', userId)
      .single();

    if (existing?.status === 'pending') {
      return res.status(409).json({ error: 'You already have a pending application' });
    }
    if (existing?.status === 'approved') {
      return res.status(409).json({ error: 'Your application has already been approved' });
    }

    const { data, error } = await supabase
      .from('operator_applications')
      .insert({
        user_id: userId,
        company_name,
        contact_name,
        contact_email,
        contact_phone,
        website,
        tour_types,
        operating_locations,
        years_in_business: years_in_business ? parseInt(years_in_business) : null,
        description,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    logger.success(`Operator application submitted by user ${userId}`);
    res.json({ success: true, application: data, message: "Application submitted! We'll review it within 48 hours." });
  } catch (err) {
    logger.error('applyAsOperator error:', err);
    res.status(500).json({ error: 'Failed to submit application' });
  }
}

async function getApplicationStatus(req, res) {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('operator_applications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code === 'PGRST116') {
      return res.json({ success: true, application: null });
    }
    if (error) throw error;

    res.json({ success: true, application: data });
  } catch (err) {
    logger.error('getApplicationStatus error:', err);
    res.status(500).json({ error: 'Failed to fetch application status' });
  }
}

// ── Tours ─────────────────────────────────────────────────────────────────────

async function getOperatorTours(req, res) {
  try {
    const operatorId = req.user.id;

    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .eq('operator_id', operatorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, tours: data || [] });
  } catch (err) {
    logger.error('getOperatorTours error:', err);
    res.status(500).json({ error: 'Failed to fetch tours' });
  }
}

async function createTour(req, res) {
  try {
    const operatorId = req.user.id;
    const {
      title, description, destination, city, country,
      category, duration_hours, price_adult, price_child,
      currency, meeting_point, highlights, price_includes,
      price_excludes, cancellation_policy, start_times,
      max_group_size, available_days, main_image,
    } = req.body;

    if (!title || !destination || !price_adult) {
      return res.status(400).json({ error: 'title, destination and price_adult are required' });
    }

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

    const { data, error } = await supabase
      .from('tours')
      .insert({
        operator_id: operatorId,
        title,
        slug,
        description,
        destination,
        city: city || destination,
        country,
        category,
        duration_hours: duration_hours ? parseFloat(duration_hours) : null,
        duration_minutes: duration_hours ? Math.round(parseFloat(duration_hours) * 60) : null,
        price_adult: parseFloat(price_adult),
        price_child: price_child ? parseFloat(price_child) : null,
        currency: currency || 'GBP',
        meeting_point,
        highlights: Array.isArray(highlights) ? highlights : [],
        price_includes: Array.isArray(price_includes) ? price_includes : [],
        price_excludes: Array.isArray(price_excludes) ? price_excludes : [],
        cancellation_policy,
        start_times: Array.isArray(start_times) ? start_times : [],
        max_group_size: max_group_size ? parseInt(max_group_size) : null,
        available_days: Array.isArray(available_days) ? available_days : [],
        main_image: main_image || null,
        listing_status: 'pending_review',
        is_active: false, // goes live only after admin approval
        source: 'operator',
      })
      .select()
      .single();

    if (error) throw error;

    logger.success(`Operator ${operatorId} created tour: ${data.id}`);
    res.json({ success: true, tour: data, message: 'Tour submitted for review. It will go live once approved.' });
  } catch (err) {
    logger.error('createTour error:', err);
    res.status(500).json({ error: err.message || 'Failed to create tour' });
  }
}

async function updateTour(req, res) {
  try {
    const { tourId } = req.params;
    const operatorId = req.user.id;

    const { data: existing, error: checkErr } = await supabase
      .from('tours')
      .select('operator_id, listing_status')
      .eq('id', tourId)
      .single();

    if (checkErr || !existing) return res.status(404).json({ error: 'Tour not found' });
    if (existing.operator_id !== operatorId) return res.status(403).json({ error: 'Unauthorized' });

    // If a live tour is edited, put it back into review
    const updatePayload = { ...req.body };
    if (existing.listing_status === 'live') {
      updatePayload.listing_status = 'pending_review';
      updatePayload.is_active = false;
    }

    const { data, error } = await supabase
      .from('tours')
      .update(updatePayload)
      .eq('id', tourId)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, tour: data });
  } catch (err) {
    logger.error('updateTour error:', err);
    res.status(500).json({ error: 'Failed to update tour' });
  }
}

async function deleteTour(req, res) {
  try {
    const { tourId } = req.params;
    const operatorId = req.user.id;

    const { data: existing, error: checkErr } = await supabase
      .from('tours')
      .select('operator_id')
      .eq('id', tourId)
      .single();

    if (checkErr || !existing) return res.status(404).json({ error: 'Tour not found' });
    if (existing.operator_id !== operatorId) return res.status(403).json({ error: 'Unauthorized' });

    const { error } = await supabase.from('tours').delete().eq('id', tourId);
    if (error) throw error;

    res.json({ success: true, message: 'Tour deleted' });
  } catch (err) {
    logger.error('deleteTour error:', err);
    res.status(500).json({ error: 'Failed to delete tour' });
  }
}

// ── Bookings ──────────────────────────────────────────────────────────────────

async function getOperatorBookings(req, res) {
  try {
    const operatorId = req.user.id;

    const { data, error } = await supabase
      .from('bookings')
      .select(`*, tours!inner(id, title, operator_id)`)
      .eq('tours.operator_id', operatorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, bookings: data || [] });
  } catch (err) {
    logger.error('getOperatorBookings error:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
}

// ── Earnings ──────────────────────────────────────────────────────────────────

async function getOperatorEarnings(req, res) {
  try {
    const operatorId = req.user.id;

    const { data: earnings, error } = await supabase
      .from('operator_earnings')
      .select('*')
      .eq('operator_id', operatorId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const rows = earnings || [];
    const totalEarned = rows.reduce((sum, r) => sum + Number(r.operator_payout || 0), 0);
    const pendingPayout = rows
      .filter((r) => r.booking_status === 'confirmed')
      .reduce((sum, r) => sum + Number(r.operator_payout || 0), 0);

    res.json({
      success: true,
      earnings: rows,
      summary: {
        totalEarned,
        pendingPayout,
        paidOut: totalEarned - pendingPayout,
        platformFeeRate: PLATFORM_FEE_RATE,
      },
    });
  } catch (err) {
    logger.error('getOperatorEarnings error:', err);
    res.status(500).json({ error: 'Failed to fetch earnings' });
  }
}

// ── Stats ─────────────────────────────────────────────────────────────────────

async function getOperatorStats(req, res) {
  try {
    const operatorId = req.user.id;

    const { data: tours } = await supabase
      .from('tours')
      .select('id, is_available, listing_status')
      .eq('operator_id', operatorId);

    const { data: earnings } = await supabase
      .from('operator_earnings')
      .select('operator_payout, booking_status')
      .eq('operator_id', operatorId);

    const rows = earnings || [];
    const totalRevenue = rows.reduce((sum, r) => sum + Number(r.operator_payout || 0), 0);
    const totalBookings = rows.length;
    const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

    res.json({
      success: true,
      totalRevenue,
      totalBookings,
      avgBookingValue,
      totalTours: (tours || []).length,
      liveTours: (tours || []).filter((t) => t.listing_status === 'live').length,
      pendingTours: (tours || []).filter((t) => t.listing_status === 'pending_review').length,
    });
  } catch (err) {
    logger.error('getOperatorStats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
}

module.exports = {
  applyAsOperator,
  getApplicationStatus,
  getOperatorTours,
  createTour,
  updateTour,
  deleteTour,
  getOperatorBookings,
  getOperatorEarnings,
  getOperatorStats,
};
