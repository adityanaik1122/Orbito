const express = require('express');
const router = express.Router();
const SupabaseService = require('./SupabaseService');

/**
 * POST /availability
 * Check if a tour/product is available for given dates
 * OCTo Standard: https://docs.octo.travel/docs/octo/availability
 */
router.post('/availability', async (req, res) => {
  try {
    const { productId, tourId, localDateStart, localDateEnd, units } = req.body;

    const resolvedTourId = tourId || productId;

    if (!resolvedTourId || !localDateStart || !localDateEnd) {
      return res.status(400).json({
        error: 'INVALID_REQUEST',
        errorMessage: 'tourId (or productId), localDateStart, and localDateEnd are required',
      });
    }

    const availability = await SupabaseService.checkAvailability(
      resolvedTourId,
      localDateStart,
      localDateEnd,
      units || 1
    );

    // Format response per OCTo standard
    const response = availability.map((slot) => ({
      id: slot.id,
      localDate: slot.start_time ? new Date(slot.start_time).toISOString().slice(0, 10) : null,
      status: slot.remaining > 0 ? 'AVAILABLE' : 'SOLD_OUT',
      vacancies: slot.remaining,
      available: slot.remaining > 0,
      productId: slot.tour_id,
      localDateTimeStart: slot.start_time,
      localDateTimeEnd: null,
    }));

    res.json(response);
  } catch (error) {
    console.error('Availability check error:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      errorMessage: error.message,
    });
  }
});

/**
 * POST /bookings
 * Create a new booking (reservation)
 * OCTo Standard: https://docs.octo.travel/docs/octo/booking-reservation
 */
router.post('/bookings', async (req, res) => {
  try {
    const {
      productId,
      tourId,
      availabilityId,
      units,
      contact,
      notes,
    } = req.body;

    const resolvedTourId = tourId || productId;

    if (!resolvedTourId || !availabilityId) {
      return res.status(400).json({
        error: 'INVALID_REQUEST',
        errorMessage: 'tourId (or productId) and availabilityId are required',
      });
    }

    // Verify product exists
    const tour = await SupabaseService.getTour(resolvedTourId);
    if (!tour) {
      return res.status(404).json({
        error: 'INVALID_TOUR_ID',
        errorMessage: 'Tour not found',
      });
    }

    // Create booking
    const booking = await SupabaseService.createBooking({
      tour_id: resolvedTourId,
      availability_id: availabilityId,
      num_people: units || 1,
      customer_contact: contact || {},
      special_requests: notes || '',
    });

    // Format response per OCTo standard
    res.status(201).json({
      id: booking.id,
      status: booking.status,
      productId: booking.tour_id,
      availabilityId: booking.availability_id,
      localDate: booking.customer_contact?.preferred_date || null,
      units: booking.num_people,
      contact: booking.customer_contact,
      notes: booking.special_requests,
      createdAt: booking.created_at,
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      errorMessage: error.message,
    });
  }
});

/**
 * POST /bookings/confirm
 * Confirm a pending booking (commit the transaction)
 * OCTo Standard: https://docs.octo.travel/docs/octo/booking-confirmation
 */
router.post('/bookings/confirm', async (req, res) => {
  try {
    const { bookingId, uuid } = req.body;

    const resolvedId = bookingId || uuid;

    if (!resolvedId) {
      return res.status(400).json({
        error: 'INVALID_REQUEST',
        errorMessage: 'bookingId (or uuid) is required',
      });
    }

    // Verify booking exists
    const existingBooking = await SupabaseService.getBooking(resolvedId);
    if (!existingBooking) {
      return res.status(404).json({
        error: 'INVALID_BOOKING_ID',
        errorMessage: 'Booking not found',
      });
    }

    if (existingBooking.status !== 'pending') {
      return res.status(400).json({
        error: 'INVALID_BOOKING_STATUS',
        errorMessage: `Cannot confirm booking with status: ${existingBooking.status}`,
      });
    }

    // Confirm booking
    const confirmedBooking = await SupabaseService.confirmBooking(resolvedId);

    // Format response per OCTo standard
    res.json({
      id: confirmedBooking.id,
      status: confirmedBooking.status,
      productId: confirmedBooking.tour_id,
      availabilityId: confirmedBooking.availability_id,
      localDate: confirmedBooking.customer_contact?.preferred_date || null,
      units: confirmedBooking.num_people,
      contact: confirmedBooking.customer_contact,
      notes: confirmedBooking.special_requests,
      createdAt: confirmedBooking.created_at,
      confirmedAt: confirmedBooking.updated_at,
    });
  } catch (error) {
    console.error('Booking confirmation error:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      errorMessage: error.message,
    });
  }
});

module.exports = router;
