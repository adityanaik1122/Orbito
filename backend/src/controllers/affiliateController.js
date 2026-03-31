/**
 * Affiliate Controller
 * Handles affiliate tracking endpoints
 */

const AffiliateTrackingService = require('../services/affiliateTrackingService');

/**
 * Track affiliate click and redirect
 */
async function trackClick(req, res) {
  try {
    const { userId } = req.user || {};
    const { provider, tourId, url } = req.query;

    await AffiliateTrackingService.trackClick({
      provider,
      tourId,
      affiliateUrl: url,
      userId
    });

    if (url) {
      return res.redirect(url);
    }

    return res.status(204).end();
  } catch (error) {
    console.error('Track click error:', error);
    res.status(500).json({ error: 'Failed to track click' });
  }
}

/**
 * Generate affiliate link
 */
async function generateLink(req, res) {
  try {
    const { provider, tourId, tourTitle, destination, baseUrl } = req.body;

    if (!provider || !tourId || !baseUrl) {
      return res.status(400).json({ 
        error: 'Missing required fields: provider, tourId, baseUrl' 
      });
    }

    const result = await AffiliateTrackingService.generateAffiliateLink({
      provider,
      tourId,
      tourTitle,
      destination,
      baseUrl
    });

    res.json(result);
  } catch (error) {
    console.error('Generate link error:', error);
    res.status(500).json({ error: 'Failed to generate affiliate link' });
  }
}

/**
 * Record conversion (booking)
 */
async function recordConversion(req, res) {
  try {
    const {
      clickId,
      bookingAmount
    } = req.body;

    if (!clickId || !bookingAmount) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    const result = await AffiliateTrackingService.recordConversion({
      clickId,
      bookingAmount
    });

    res.json(result);
  } catch (error) {
    console.error('Record conversion error:', error);
    res.status(500).json({ error: 'Failed to record conversion' });
  }
}

/**
 * Update conversion status
 */
async function updateConversionStatus(req, res) {
  try {
    const { conversionId } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'paid', 'cancelled'].includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be: pending, confirmed, paid, or cancelled' 
      });
    }

    const result = await AffiliateTrackingService.updateConversionStatus(
      conversionId,
      status
    );

    res.json(result);
  } catch (error) {
    console.error('Update conversion status error:', error);
    res.status(500).json({ error: 'Failed to update conversion status' });
  }
}

/**
 * Get commission dashboard data
 */
async function getCommissionDashboard(req, res) {
  try {
    const { startDate, endDate, provider } = req.query;

    const data = await AffiliateTrackingService.getCommissionDashboard({
      startDate,
      endDate,
      provider
    });

    res.json(data);
  } catch (error) {
    console.error('Get commission dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch commission dashboard' });
  }
}

/**
 * Get affiliate performance metrics
 */
async function getAffiliatePerformance(req, res) {
  try {
    const { provider, destination, limit } = req.query;

    const data = await AffiliateTrackingService.getAffiliatePerformance({
      provider,
      destination,
      limit: limit ? parseInt(limit) : 50
    });

    res.json(data);
  } catch (error) {
    console.error('Get affiliate performance error:', error);
    res.status(500).json({ error: 'Failed to fetch affiliate performance' });
  }
}

/**
 * Get conversions
 */
async function getConversions(req, res) {
  try {
    const { startDate, endDate, provider, status } = req.query;

    const data = await AffiliateTrackingService.getConversions({
      startDate,
      endDate,
      provider,
      status
    });

    res.json(data);
  } catch (error) {
    console.error('Get conversions error:', error);
    res.status(500).json({ error: 'Failed to fetch conversions' });
  }
}

/**
 * Get summary statistics
 */
async function getSummaryStats(req, res) {
  try {
    const stats = await AffiliateTrackingService.getSummaryStats();
    res.json(stats);
  } catch (error) {
    console.error('Get summary stats error:', error);
    res.status(500).json({ error: 'Failed to fetch summary stats' });
  }
}

module.exports = {
  trackClick,
  generateLink,
  recordConversion,
  updateConversionStatus,
  getCommissionDashboard,
  getAffiliatePerformance,
  getConversions,
  getSummaryStats
};
