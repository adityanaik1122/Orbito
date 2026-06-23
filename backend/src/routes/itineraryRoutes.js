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
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

// Issues a guest token — call once on first visit and store in localStorage
router.post('/guest-token', (req, res) => {
  const token = issueGuestToken();
  res.json({ token, limit: 2, message: 'You have 2 free itinerary generations.' });
});

// AI routes — authenticated users bypass the guest limit; guests get 2 free uses
router.post('/generate-itinerary', validate(schemas.generateItinerary), requireAuthOrGuestToken, generateItinerary);
router.post('/generate-with-tours', validate(schemas.generateItinerary), requireAuthOrGuestToken, generateItineraryWithTours);
router.post('/suggest-tours', requireAuthOrGuestToken, suggestToursForActivity);

// Protected routes - require authentication
router.post('/save-itinerary', requireAuth, saveItineraryHandler);
router.get('/itineraries', requireAuth, getUserItinerariesHandler);

module.exports = router;
