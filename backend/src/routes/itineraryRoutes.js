const express = require('express');
const { generateItinerary, saveItineraryHandler, getUserItinerariesHandler } = require('../controllers/itineraryController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Public route - anyone can generate itineraries
router.post('/generate-itinerary', generateItinerary);

// Protected routes - require authentication
router.post('/save-itinerary', requireAuth, saveItineraryHandler);
router.get('/itineraries', requireAuth, getUserItinerariesHandler);

module.exports = router;
