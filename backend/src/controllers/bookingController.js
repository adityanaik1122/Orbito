const { supabase } = require('../config/supabase');
const logger = require('../utils/logger');

/**
 * POST /api/bookings
 *
 * Creates a pending booking record for an internal (premium) tour.
 * For external tours (Viator/GYG), the frontend redirects to bookingUrl directly —
 * no server-side record is needed there.
 *
 * After this call, the frontend should POST /api/payments/create-intent
 * with the returned bookingId to start the Stripe payment flow.
 */
async function createBooking(req, res) {
  const userId = req.user.id;
  const { tourId, travelDate, travelers = 1, totalAmount, currency, itineraryId } = req.body;

  if (!tourId || !travelDate || !totalAmount) {
    return res.status(400).json({ error: 'tourId, travelDate, and totalAmount are required' });
  }

  if (totalAmount <= 0) {
    return res.status(400).json({ error: 'totalAmount must be greater than 0' });
  }

  // Verify tour exists and is active
  const { data: tour, error: tourError } = await supabase
    .from('tours')
    .select('id, title, price_adult, price_currency, is_active')
    .eq('id', tourId)
    .single();

  if (tourError || !tour) {
    return res.status(404).json({ error: 'Tour not found' });
  }

  if (!tour.is_active) {
    return res.status(400).json({ error: 'This tour is no longer available for booking' });
  }

  const bookingReference = `ORB-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert([{
      user_id: userId,
      tour_id: tourId,
      itinerary_id: itineraryId || null,
      travel_date: travelDate,
      travelers,
      total_amount: totalAmount,
      currency: currency || tour.price_currency || 'GBP',
      booking_reference: bookingReference,
      payment_status: 'pending',
      booking_status: 'pending',
    }])
    .select()
    .single();

  if (error) {
    logger.error('Error creating booking:', error);
    return res.status(500).json({ error: 'Failed to create booking' });
  }

  logger.info(`Booking created: ${bookingReference} for user ${userId}`);

  res.status(201).json({
    success: true,
    bookingId: booking.id,
    bookingReference: booking.booking_reference,
    nextStep: 'POST /api/payments/create-intent',
  });
}

/**
 * GET /api/bookings
 * Returns all bookings for the authenticated user.
 */
async function getUserBookings(req, res) {
  const userId = req.user.id;

  const { data, error } = await supabase
    .from('bookings')
    .select('*, tours(id, title, main_image, destination)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('Error fetching bookings:', error);
    return res.status(500).json({ error: 'Failed to fetch bookings' });
  }

  res.json({ success: true, bookings: data });
}

/**
 * GET /api/bookings/:id
 * Returns a single booking (must belong to the authenticated user).
 */
async function getBooking(req, res) {
  const userId = req.user.id;
  const { id } = req.params;

  const { data: booking, error } = await supabase
    .from('bookings')
    .select('*, tours(id, title, main_image, destination, duration_minutes, highlights)')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error || !booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  res.json({ success: true, booking });
}

module.exports = { createBooking, getUserBookings, getBooking };
