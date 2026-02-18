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
    .eq('is_available', true);

  // Apply filters
  if (filters.destination) {
    query = query.ilike('destination', `%${filters.destination}%`);
  }

  if (filters.country) {
    query = query.ilike('country', `%${filters.country}%`);
  }

  // Multiple categories filter
  if (filters.categories) {
    const categoriesArray = Array.isArray(filters.categories) 
      ? filters.categories 
      : filters.categories.split(',').filter(Boolean);
    
    if (categoriesArray.length > 0) {
      query = query.in('category', categoriesArray);
    }
  }

  // Price range filter
  if (filters.minPrice !== undefined && filters.minPrice !== '') {
    query = query.gte('price_adult', parseFloat(filters.minPrice));
  }

  if (filters.maxPrice !== undefined && filters.maxPrice !== '') {
    query = query.lte('price_adult', parseFloat(filters.maxPrice));
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
            return 'duration_hours.lt.4';
          case 'full-day':
            return 'duration_hours.gte.4,duration_hours.lte.8';
          case 'multi-day':
            return 'duration_hours.gt.8';
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

  if (filters.featured === 'true' || filters.featured === true) {
    query = query.eq('featured', true);
  }

  // Sorting
  let sortBy = filters.sortBy || 'created_at';
  let sortOrder = 'desc';

  switch (sortBy) {
    case 'price_low':
      sortBy = 'price_adult';
      sortOrder = 'asc';
      break;
    case 'price_high':
      sortBy = 'price_adult';
      sortOrder = 'desc';
      break;
    case 'rating':
      sortBy = 'rating';
      sortOrder = 'desc';
      break;
    case 'popular':
      sortBy = 'views_count';
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
    // Not found by ID, try slug
    const result = await supabase
      .from('tours')
      .select('*')
      .eq('slug', identifier)
      .single();
    
    data = result.data;
    error = result.error;
  }

  // Increment view count
  if (data && !error) {
    await supabase
      .from('tours')
      .update({ views_count: (data.views_count || 0) + 1 })
      .eq('id', data.id);
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

  // Generate unique booking reference
  const { data: refData } = await supabase.rpc('generate_booking_reference');
  const bookingReference = refData || `ORB-${Date.now()}`;

  const { data, error } = await supabase
    .from('bookings')
    .insert([{
      ...bookingData,
      booking_reference: bookingReference
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
        title,
        slug,
        main_image,
        destination,
        duration,
        category
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

  // Try ID first, then booking_reference
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
  
  if (isUUID) {
    query = query.eq('id', identifier);
  } else {
    query = query.eq('booking_reference', identifier);
  }

  const { data, error } = await query.single();

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
      booking_status: status,
      ...additionalData,
      updated_at: new Date().toISOString()
    })
    .eq('id', bookingId)
    .select();

  return { data, error };
}

/**
 * Get commission stats for admin
 */
async function getCommissionStats() {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  const { data, error } = await supabase
    .from('commissions')
    .select(`
      *,
      bookings (
        booking_reference,
        tour_date,
        customer_name
      ),
      tour_providers (
        name
      )
    `)
    .order('created_at', { ascending: false });

  return { data, error };
}

module.exports = {
  getTours,
  getTourById,
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  getCommissionStats
};
