/**
 * Operator Routes
 * Routes for tour operators to manage their tours and bookings
 */

const express = require('express');
const router = express.Router();
const operatorController = require('../controllers/operatorController');
const { requireAuth, requireOperator } = require('../middleware/authMiddleware');

// All routes require operator authentication
router.use(requireAuth);
router.use(requireOperator);

// Tours management
router.get('/tours', operatorController.getOperatorTours);
router.post('/tours', operatorController.createTour);
router.put('/tours/:tourId', operatorController.updateTour);
router.delete('/tours/:tourId', operatorController.deleteTour);
router.patch('/tours/:tourId/availability', operatorController.updateTourAvailability);

// Bookings management
router.get('/bookings', operatorController.getOperatorBookings);
router.patch('/bookings/:bookingId/status', operatorController.updateBookingStatus);

// Statistics
router.get('/stats', operatorController.getOperatorStats);

module.exports = router;
