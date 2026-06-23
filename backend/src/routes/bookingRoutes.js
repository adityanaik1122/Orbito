const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const { createBooking, getUserBookings, getBooking } = require('../controllers/bookingController');
const { bookingLimiter } = require('../middleware/rateLimiter');

router.post('/', requireAuth, bookingLimiter, createBooking);
router.get('/', requireAuth, getUserBookings);
router.get('/:id', requireAuth, getBooking);

module.exports = router;
