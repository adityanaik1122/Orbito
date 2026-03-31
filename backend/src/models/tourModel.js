const { supabase } = require('../config/supabase');

/**
 * Get all tours with optional filters
 */
async function getTours(filters = {}) {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  let query = supabase
    .from('tours')
    .select('*')
    .eq('is_active', true);

  // Apply filters
  if (filters.destination) {
    query = query.ilike('city', `%${filters.destination}%`);
  }

  if (filters.country) {
    query = query.ilike('country_code', `%${filters.country}%`);
  }

  // Categories are not part of v2 schema (ignore if provided)

  // Price range filter
  if (filters.minPrice !== undefined && filters.minPrice !== '') {
    query = query.gte('price_amount', parseFloat(filters.minPrice));
  }

  if (filters.maxPrice !== undefined && filters.maxPrice !== '') {
    query = query.lte('price_amount', parseFloat(filters.maxPrice));
  }

  // Duration filter (half-day, full-day, multi-day)
  if (filters.durations) {
    const durationsArray = Array.isArray(filters.durations)
      ? filters.durations
      : filters.durations.split(',').filter(Boolean);
    
    if (durationsArray.length > 0) {
      // Build duration conditions
      const durationConditions = durationsArray.map(duration => {
        switch (duration) {
          case 'half-day':
            return 'duration_minutes.lt.240';
          case 'full-day':
            return 'duration_minutes.gte.240,duration_minutes.lte.480';
          case 'multi-day':
            return 'duration_minutes.gt.480';
          default:
            return null;
        }
      }).filter(Boolean);

      // Apply OR logic for durations
      if (durationConditions.length > 0) {
        query = query.or(durationConditions.join(','));
      }
    }
  }

  // Featured is not part of v2 schema (ignore if provided)

  // Sorting
  let sortBy = filters.sortBy || 'created_at';
  let sortOrder = 'desc';

  switch (sortBy) {
    case 'price_low':
      sortBy = 'price_amount';
      sortOrder = 'asc';
      break;
    case 'price_high':
      sortBy = 'price_amount';
      sortOrder = 'desc';
      break;
    default:
      sortBy = 'created_at';
      sortOrder = 'desc';
  }

  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  const { data, error } = await query;

  return { data, error };
}

/**
 * Get a single tour by ID or slug
 */
async function getTourById(identifier) {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  // Try to find by ID first, then by slug
  let { data, error } = await supabase
    .from('tours')
    .select('*')
    .eq('id', identifier)
    .single();

  if (error && error.code === 'PGRST116') {
    const result = await supabase
      .from('tours')
      .select('*')
      .eq('external_id', identifier)
      .single();
    
    data = result.data;
    error = result.error;
  }

  return { data, error };
}

/**
 * Create a booking
 */
async function createBooking(bookingData) {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert([{
      ...bookingData
    }])
    .select();

  return { data, error };
}

/**
 * Get user's bookings
 */
async function getUserBookings(userId) {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      tours (
        id,
        title,
        city,
        country_code,
        duration_minutes,
        price_amount,
        price_currency
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
}

/**
 * Get a single booking by ID or reference
 */
async function getBookingById(identifier, userId) {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  let query = supabase
    .from('bookings')
    .select(`
      *,
      tours (*)
    `)
    .eq('user_id', userId);

  const { data, error } = await query.eq('id', identifier).single();

  return { data, error };
}

/**
 * Update booking status
 */
async function updateBookingStatus(bookingId, status, additionalData = {}) {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  const { data, error } = await supabase
    .from('bookings')
    .update({
      status: status,
      ...additionalData,
      updated_at: new Date().toISOString()
    })
    .eq('id', bookingId)
    .select();

  return { data, error };
}

module.exports = {
  getTours,
  getTourById,
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus
};
