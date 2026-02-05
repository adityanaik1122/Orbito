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
    const { productId, localDateStart, localDateEnd, units } = req.body;

    if (!productId || !localDateStart || !localDateEnd) {
      return res.status(400).json({
        error: 'INVALID_REQUEST',
        errorMessage: 'productId, localDateStart, and localDateEnd are required',
      });
    }

    const availability = await SupabaseService.checkAvailability(
      productId,
      localDateStart,
      localDateEnd,
      units || 1
    );

    // Format response per OCTo standard
    const response = availability.map((slot) => ({
      id: slot.id,
      localDate: slot.local_date,
      status: slot.status,
      vacancies: slot.vacancies,
      available: slot.vacancies > 0,
      productId: slot.product_id,
      localDateTimeStart: slot.start_time,
      localDateTimeEnd: slot.end_time,
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
      availabilityId,
      localDate,
      units,
      contact,
      notes,
    } = req.body;

    if (!productId || !availabilityId || !localDate) {
      return res.status(400).json({
        error: 'INVALID_REQUEST',
        errorMessage: 'productId, availabilityId, and localDate are required',
      });
    }

    // Verify product exists
    const product = await SupabaseService.getProduct(productId);
    if (!product) {
      return res.status(404).json({
        error: 'INVALID_PRODUCT_ID',
        errorMessage: 'Product not found',
      });
    }

    // Create booking
    const booking = await SupabaseService.createBooking({
      product_id: productId,
      availability_id: availabilityId,
      local_date: localDate,
      units: units || 1,
      contact: contact || {},
      notes: notes || '',
    });

    // Format response per OCTo standard
    res.status(201).json({
      uuid: booking.uuid,
      status: booking.status,
      productId: booking.product_id,
      availabilityId: booking.availability_id,
      localDate: booking.local_date,
      units: booking.units,
      contact: booking.contact,
      notes: booking.notes,
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
    const { uuid } = req.body;

    if (!uuid) {
      return res.status(400).json({
        error: 'INVALID_REQUEST',
        errorMessage: 'uuid is required',
      });
    }

    // Verify booking exists
    const existingBooking = await SupabaseService.getBooking(uuid);
    if (!existingBooking) {
      return res.status(404).json({
        error: 'INVALID_BOOKING_UUID',
        errorMessage: 'Booking not found',
      });
    }

    if (existingBooking.status !== 'ON_HOLD') {
      return res.status(400).json({
        error: 'INVALID_BOOKING_STATUS',
        errorMessage: `Cannot confirm booking with status: ${existingBooking.status}`,
      });
    }

    // Confirm booking
    const confirmedBooking = await SupabaseService.confirmBooking(uuid);

    // Format response per OCTo standard
    res.json({
      uuid: confirmedBooking.uuid,
      status: confirmedBooking.status,
      productId: confirmedBooking.product_id,
      availabilityId: confirmedBooking.availability_id,
      localDate: confirmedBooking.local_date,
      units: confirmedBooking.units,
      contact: confirmedBooking.contact,
      notes: confirmedBooking.notes,
      createdAt: confirmedBooking.created_at,
      confirmedAt: confirmedBooking.confirmed_at,
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
