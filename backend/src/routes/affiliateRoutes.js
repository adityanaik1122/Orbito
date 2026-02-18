/**
 * Affiliate Routes
 */

const express = require('express');
const router = express.Router();
const affiliateController = require('../controllers/affiliateController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/track/:trackingCode', affiliateController.trackClick);

// Protected routes (require authentication)
router.post('/generate-link', requireAuth, affiliateController.generateLink);
router.post('/conversion', requireAuth, affiliateController.recordConversion);

// Admin routes (require admin role)
router.put('/conversion/:conversionId/status', requireAuth, requireAdmin, affiliateController.updateConversionStatus);
router.get('/dashboard', requireAuth, requireAdmin, affiliateController.getCommissionDashboard);
router.get('/performance', requireAuth, requireAdmin, affiliateController.getAffiliatePerformance);
router.get('/conversions', requireAuth, requireAdmin, affiliateController.getConversions);
router.get('/stats', requireAuth, requireAdmin, affiliateController.getSummaryStats);

module.exports = router;
