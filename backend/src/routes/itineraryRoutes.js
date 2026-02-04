const express = require('express');
const { generateItinerary, saveItineraryHandler } = require('../controllers/itineraryController');

const router = express.Router();

router.post('/generate-itinerary', generateItinerary);
router.post('/save-itinerary', saveItineraryHandler);

module.exports = router;
