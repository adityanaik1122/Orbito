const express = require('express');
const {
  generateItinerary,
  generateItineraryWithTours,
  suggestToursForActivity,
  saveItineraryHandler,
  getUserItinerariesHandler
} = require('../controllers/itineraryController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireAuthOrGuestToken, issueGuestToken } = require('../middleware/guestLimiter');
const { aiLimiter } = require('../middleware/rateLimiter');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

// Issues a guest token — call once on first visit and store in localStorage
router.post('/guest-token', async (req, res) => {
  const token = await issueGuestToken();
  res.json({ token, limit: 2, message: 'You have 2 free itinerary generations.' });
});

// AI routes — IP rate limit → guest/auth gate → handler
router.post('/generate-itinerary', aiLimiter, validate(schemas.generateItinerary), requireAuthOrGuestToken, generateItinerary);
router.post('/generate-with-tours', aiLimiter, validate(schemas.generateItinerary), requireAuthOrGuestToken, generateItineraryWithTours);
router.post('/suggest-tours', aiLimiter, requireAuthOrGuestToken, suggestToursForActivity);

// Protected routes - require authentication
router.post('/save-itinerary', requireAuth, saveItineraryHandler);
router.get('/itineraries', requireAuth, getUserItinerariesHandler);

module.exports = router;
