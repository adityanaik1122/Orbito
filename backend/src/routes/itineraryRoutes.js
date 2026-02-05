const express = require('express');
const { generateItinerary, saveItineraryHandler, getUserItinerariesHandler } = require('../controllers/itineraryController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes - require authentication
router.post('/generate-itinerary', requireAuth, generateItinerary);
router.post('/save-itinerary', requireAuth, saveItineraryHandler);
router.get('/itineraries', requireAuth, getUserItinerariesHandler);

module.exports = router;
