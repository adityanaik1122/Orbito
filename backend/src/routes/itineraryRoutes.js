const express = require('express');
const { 
  generateItinerary, 
  generateItineraryWithTours,
  suggestToursForActivity,
  saveItineraryHandler, 
  getUserItinerariesHandler 
} = require('../controllers/itineraryController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes - anyone can generate itineraries
router.post('/generate-itinerary', generateItinerary);

// Enhanced itinerary generation with real bookable tours
router.post('/generate-with-tours', generateItineraryWithTours);

// Get tour suggestions for an activity
router.post('/suggest-tours', suggestToursForActivity);

// Protected routes - require authentication
router.post('/save-itinerary', requireAuth, saveItineraryHandler);
router.get('/itineraries', requireAuth, getUserItinerariesHandler);

module.exports = router;
