/**
 * Operator Controller
 * Handles tour operator dashboard endpoints
 */

const { supabase } = require('../config/supabase');

/**
 * Get operator's tours
 */
async function getOperatorTours(req, res) {
  try {
    const operatorId = req.user.id;

    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .eq('operator_id', operatorId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, tours: data });
  } catch (error) {
    console.error('Error fetching operator tours:', error);
    res.status(500).json({ error: 'Failed to fetch tours' });
  }
}

/**
 * Get operator's bookings
 */
async function getOperatorBookings(req, res) {
  try {
    const operatorId = req.user.id;

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        tours!inner (
          id,
          title,
          operator_id
        )
      `)
      .eq('tours.operator_id', operatorId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, bookings: data });
  } catch (error) {
    console.error('Error fetching operator bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
}

/**
 * Get operator statistics
 */
async function getOperatorStats(req, res) {
  try {
    const operatorId = req.user.id;

    // Get tours
    const { data: tours, error: toursError } = await supabase
      .from('tours')
      .select('*')
      .eq('operator_id', operatorId);

    if (toursError) throw toursError;

    // Get bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        *,
        tours!inner (operator_id)
      `)
      .eq('tours.operator_id', operatorId);

    if (bookingsError) throw bookingsError;

    // Calculate stats
    const totalRevenue = bookings
      .filter(b => b.booking_status === 'confirmed' || b.booking_status === 'completed')
      .reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0);

    const totalViews = tours.reduce((sum, t) => sum + (t.views_count || 0), 0);

    const avgRating = tours.length > 0
      ? tours.reduce((sum, t) => sum + (t.rating || 0), 0) / tours.length
      : 0;

    const totalReviews = tours.reduce((sum, t) => sum + (t.review_count || 0), 0);

    const conversionRate = totalViews > 0
      ? ((bookings.length / totalViews) * 100).toFixed(2)
      : 0;

    const avgBookingValue = bookings.length > 0
      ? totalRevenue / bookings.length
      : 0;

    res.json({
      success: true,
      totalRevenue,
      totalViews,
      avgRating,
      totalReviews,
      conversionRate,
      avgBookingValue
    });
  } catch (error) {
    console.error('Error fetching operator stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
}

/**
 * Create new tour
 */
async function createTour(req, res) {
  try {
    const operatorId = req.user.id;
    const tourData = {
      ...req.body,
      operator_id: operatorId,
      is_available: true
    };

    const { data, error } = await supabase
      .from('tours')
      .insert([tourData])
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, tour: data });
  } catch (error) {
    console.error('Error creating tour:', error);
    res.status(500).json({ error: 'Failed to create tour' });
  }
}

/**
 * Update tour
 */
async function updateTour(req, res) {
  try {
    const { tourId } = req.params;
    const operatorId = req.user.id;

    // Verify ownership
    const { data: tour, error: checkError } = await supabase
      .from('tours')
      .select('operator_id')
      .eq('id', tourId)
      .single();

    if (checkError) throw checkError;

    if (tour.operator_id !== operatorId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Update tour
    const { data, error } = await supabase
      .from('tours')
      .update(req.body)
      .eq('id', tourId)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, tour: data });
  } catch (error) {
    console.error('Error updating tour:', error);
    res.status(500).json({ error: 'Failed to update tour' });
  }
}

/**
 * Delete tour
 */
async function deleteTour(req, res) {
  try {
    const { tourId } = req.params;
    const operatorId = req.user.id;

    // Verify ownership
    const { data: tour, error: checkError } = await supabase
      .from('tours')
      .select('operator_id')
      .eq('id', tourId)
      .single();

    if (checkError) throw checkError;

    if (tour.operator_id !== operatorId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Delete tour
    const { error } = await supabase
      .from('tours')
      .delete()
      .eq('id', tourId);

    if (error) throw error;

    res.json({ success: true, message: 'Tour deleted successfully' });
  } catch (error) {
    console.error('Error deleting tour:', error);
    res.status(500).json({ error: 'Failed to delete tour' });
  }
}

/**
 * Update tour availability
 */
async function updateTourAvailability(req, res) {
  try {
    const { tourId } = req.params;
    const { is_available } = req.body;
    const operatorId = req.user.id;

    // Verify ownership
    const { data: tour, error: checkError } = await supabase
      .from('tours')
      .select('operator_id')
      .eq('id', tourId)
      .single();

    if (checkError) throw checkError;

    if (tour.operator_id !== operatorId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Update availability
    const { data, error } = await supabase
      .from('tours')
      .update({ is_available })
      .eq('id', tourId)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, tour: data });
  } catch (error) {
    console.error('Error updating tour availability:', error);
    res.status(500).json({ error: 'Failed to update availability' });
  }
}

/**
 * Update booking status
 */
async function updateBookingStatus(req, res) {
  try {
    const { bookingId } = req.params;
    const { booking_status } = req.body;
    const operatorId = req.user.id;

    // Verify ownership through tour
    const { data: booking, error: checkError } = await supabase
      .from('bookings')
      .select(`
        *,
        tours!inner (operator_id)
      `)
      .eq('id', bookingId)
      .single();

    if (checkError) throw checkError;

    if (booking.tours.operator_id !== operatorId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Update booking status
    const { data, error } = await supabase
      .from('bookings')
      .update({ booking_status })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, booking: data });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
}

module.exports = {
  getOperatorTours,
  getOperatorBookings,
  getOperatorStats,
  createTour,
  updateTour,
  deleteTour,
  updateTourAvailability,
  updateBookingStatus
};
