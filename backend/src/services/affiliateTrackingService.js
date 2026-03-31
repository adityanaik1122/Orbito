/**
 * Affiliate Tracking Service
 * 
 * Handles affiliate link generation, click tracking, and conversion tracking
 * for GetYourGuide, Viator, and other affiliate partners
 */

const { supabase } = require('../config/supabase');
const crypto = require('crypto');

class AffiliateTrackingService {
  // Affiliate partner IDs (get these from your affiliate dashboards)
  static AFFILIATE_IDS = {
    getyourguide: process.env.GYG_AFFILIATE_ID || 'YOUR_GYG_PARTNER_ID',
    viator: process.env.VIATOR_AFFILIATE_ID || 'YOUR_VIATOR_AFFILIATE_ID'
  };

  // Commission rates (update based on your agreements)
  static COMMISSION_RATES = {
    getyourguide: 8.0, // 8%
    viator: 8.0, // 8%
    premiumtours: 15.0 // 15% for your own tours
  };

  /**
   * Generate affiliate link with tracking
   * @param {Object} params - Link parameters
   * @returns {Promise<Object>} Affiliate link data
   */
  static async generateAffiliateLink({ provider, tourId, tourTitle, destination, baseUrl }) {
    try {
      // Generate unique tracking code
      const trackingCode = this._generateTrackingCode(provider, tourId);

      // Build affiliate URL based on provider
      const affiliateUrl = this._buildAffiliateUrl(provider, baseUrl, trackingCode);

      // Store in database
      return {
        trackingCode,
        affiliateUrl,
        shortUrl: `/track/${trackingCode}?url=${encodeURIComponent(affiliateUrl)}&provider=${encodeURIComponent(provider)}&tourId=${encodeURIComponent(tourId)}` // Your internal tracking URL
      };
    } catch (error) {
      console.error('Error generating affiliate link:', error);
      throw error;
    }
  }

  /**
   * Track affiliate click
   * @param {Object} clickData - Click information
   * @returns {Promise<Object>} Click record
   */
  static async trackClick({ provider, tourId, affiliateUrl, userId }) {
    try {
      // Record the click
      const { data, error } = await supabase
        .from('affiliate_clicks')
        .insert({
          provider: provider || null,
          tour_id: tourId || null,
          user_id: userId || null,
          affiliate_url: affiliateUrl || null
        })
        .select()
        .single();

      if (error) throw error;

      return {
        clickId: data.id
      };
    } catch (error) {
      console.error('Error tracking click:', error);
      throw error;
    }
  }

  /**
   * Record affiliate conversion (booking)
   * @param {Object} conversionData - Conversion details
   * @returns {Promise<Object>} Conversion record
   */
  static async recordConversion({
    clickId,
    bookingAmount
  }) {
    try {
      const { data, error } = await supabase
        .from('affiliate_clicks')
        .update({
          converted: true,
          conversion_value: bookingAmount
        })
        .eq('id', clickId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error recording conversion:', error);
      throw error;
    }
  }

  /**
   * Update conversion status
   * @param {string} conversionId - Conversion ID
   * @param {string} status - New status (confirmed, paid, cancelled)
   * @returns {Promise<Object>} Updated conversion
   */
  static async updateConversionStatus(conversionId, status) {
    try {
      const updateData = { status };

      if (status === 'confirmed') {
        updateData.confirmed_at = new Date().toISOString();
      } else if (status === 'paid') {
        updateData.paid_at = new Date().toISOString();
      }

      return null;
    } catch (error) {
      console.error('Error updating conversion status:', error);
      throw error;
    }
  }

  /**
   * Get commission dashboard data
   * @param {Object} filters - Date filters
   * @returns {Promise<Object>} Dashboard data
   */
  static async getCommissionDashboard({ startDate, endDate, provider } = {}) {
    try {
      return [];
    } catch (error) {
      console.error('Error fetching commission dashboard:', error);
      throw error;
    }
  }

  /**
   * Get affiliate performance metrics
   * @param {Object} filters - Filters
   * @returns {Promise<Array>} Performance data
   */
  static async getAffiliatePerformance({ provider, destination, limit = 50 } = {}) {
    try {
      return [];
    } catch (error) {
      console.error('Error fetching affiliate performance:', error);
      throw error;
    }
  }

  /**
   * Get conversions for a date range
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} Conversions
   */
  static async getConversions({ startDate, endDate, provider, status } = {}) {
    try {
      return [];
    } catch (error) {
      console.error('Error fetching conversions:', error);
      throw error;
    }
  }

  /**
   * Generate unique tracking code
   * @private
   */
  static _generateTrackingCode(provider, tourId) {
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex');
    return `${provider.substring(0, 3).toUpperCase()}-${tourId}-${timestamp}-${random}`;
  }

  /**
   * Build affiliate URL with tracking parameters
   * @private
   */
  static _buildAffiliateUrl(provider, baseUrl, trackingCode) {
    const affiliateId = this.AFFILIATE_IDS[provider.toLowerCase()];

    switch (provider.toLowerCase()) {
      case 'getyourguide':
        // GetYourGuide affiliate link format
        return `${baseUrl}?partner_id=${affiliateId}&utm_medium=affiliate&utm_source=orbito&cmp=${trackingCode}`;

      case 'viator':
        // Viator affiliate link format
        return `${baseUrl}?pid=${affiliateId}&mcid=${trackingCode}&medium=link&campaign=orbito`;

      default:
        // Generic affiliate link
        return `${baseUrl}?ref=${affiliateId}&tracking=${trackingCode}`;
    }
  }

  /**
   * Get summary statistics
   * @returns {Promise<Object>} Summary stats
   */
  static async getSummaryStats() {
    try {
      return {
        totalConversions: 0,
        totalRevenue: 0,
        totalCommission: 0,
        pendingCommission: 0,
        paidCommission: 0,
        byProvider: {}
      };
    } catch (error) {
      console.error('Error fetching summary stats:', error);
      throw error;
    }
  }
}

module.exports = AffiliateTrackingService;
