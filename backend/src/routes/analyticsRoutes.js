const express = require('express');
const router = express.Router();
const {
  getDashboardSummary,
  getDailyStats,
  getUserRegistrations,
  getBookings,
  getAffiliateStats,
  getItineraryStats,
  trackPageView,
  trackAffiliateClick
} = require('../controllers/analyticsController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// Public tracking endpoints (no auth required)
router.post('/track/page-view', trackPageView);
router.post('/track/affiliate-click', trackAffiliateClick);

// Admin-only analytics endpoints
router.get('/dashboard/summary', requireAuth, requireAdmin, getDashboardSummary);
router.get('/dashboard/daily-stats', requireAuth, requireAdmin, getDailyStats);
router.get('/users/registrations', requireAuth, requireAdmin, getUserRegistrations);
router.get('/bookings', requireAuth, requireAdmin, getBookings);
router.get('/affiliate/stats', requireAuth, requireAdmin, getAffiliateStats);
router.get('/itineraries/stats', requireAuth, requireAdmin, getItineraryStats);

module.exports = router;
