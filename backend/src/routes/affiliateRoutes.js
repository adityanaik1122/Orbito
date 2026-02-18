/**
 * Affiliate Routes
 */

const express = require('express');
const router = express.Router();
const affiliateController = require('../controllers/affiliateController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/track/:trackingCode', affiliateController.trackClick);

// Protected routes (require authentication)
router.post('/generate-link', authenticateToken, affiliateController.generateLink);
router.post('/conversion', authenticateToken, affiliateController.recordConversion);

// Admin routes (require admin role)
router.put('/conversion/:conversionId/status', authenticateToken, requireAdmin, affiliateController.updateConversionStatus);
router.get('/dashboard', authenticateToken, requireAdmin, affiliateController.getCommissionDashboard);
router.get('/performance', authenticateToken, requireAdmin, affiliateController.getAffiliatePerformance);
router.get('/conversions', authenticateToken, requireAdmin, affiliateController.getConversions);
router.get('/stats', authenticateToken, requireAdmin, affiliateController.getSummaryStats);

module.exports = router;
