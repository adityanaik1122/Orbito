const express = require('express');
const { getTours, getTourDetail, createBooking, getUserBookings, getBookingDetail, cancelBooking } = require('../controllers/tourController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/tours', getTours); // Browse all tours
router.get('/tours/:identifier', getTourDetail); // View tour details (by ID or slug)

// Protected routes - require authentication
router.post('/bookings', requireAuth, createBooking); // Create a booking
router.get('/bookings', requireAuth, getUserBookings); // Get user's bookings
router.get('/bookings/:identifier', requireAuth, getBookingDetail); // Get booking details
router.post('/bookings/:id/cancel', requireAuth, cancelBooking); // Cancel a booking

module.exports = router;
