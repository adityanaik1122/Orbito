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
      const { data, error } = await supabase
        .from('affiliate_links')
        .upsert({
          provider,
          tour_id: tourId,
          tour_title: tourTitle,
          destination,
          affiliate_url: affiliateUrl,
          tracking_code: trackingCode
        }, {
          onConflict: 'tracking_code'
        })
        .select()
        .single();

      if (error) throw error;

      return {
        trackingCode,
        affiliateUrl,
        shortUrl: `/track/${trackingCode}` // Your internal tracking URL
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
  static async trackClick({ trackingCode, userId, sessionId, ipAddress, userAgent, referrer }) {
    try {
      // Get affiliate link details
      const { data: linkData, error: linkError } = await supabase
        .from('affiliate_links')
        .select('*')
        .eq('tracking_code', trackingCode)
        .single();

      if (linkError) throw linkError;

      // Record the click
      const { data, error } = await supabase
        .from('affiliate_clicks')
        .insert({
          tracking_code: trackingCode,
          provider: linkData.provider,
          tour_id: linkData.tour_id,
          user_id: userId,
          session_id: sessionId,
          ip_address: ipAddress,
          user_agent: userAgent,
          referrer: referrer
        })
        .select()
        .single();

      if (error) throw error;

      return {
        clickId: data.id,
        redirectUrl: linkData.affiliate_url
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
    trackingCode,
    clickId,
    provider,
    tourId,
    userId,
    bookingReference,
    bookingDate,
    travelDate,
    bookingAmount,
    currency = 'GBP'
  }) {
    try {
      const commissionRate = this.COMMISSION_RATES[provider.toLowerCase()] || 8.0;
      const commissionAmount = (bookingAmount * commissionRate) / 100;

      const { data, error } = await supabase
        .from('affiliate_conversions')
        .insert({
          tracking_code: trackingCode,
          click_id: clickId,
          provider,
          tour_id: tourId,
          user_id: userId,
          booking_reference: bookingReference,
          booking_date: bookingDate,
          travel_date: travelDate,
          booking_amount: bookingAmount,
          currency,
          commission_rate: commissionRate,
          commission_amount: commissionAmount,
          status: 'pending'
        })
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

      const { data, error } = await supabase
        .from('affiliate_conversions')
        .update(updateData)
        .eq('id', conversionId)
        .select()
        .single();

      if (error) throw error;

      return data;
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
      let query = supabase
        .from('commission_dashboard')
        .select('*');

      if (startDate) {
        query = query.gte('month', startDate);
      }
      if (endDate) {
        query = query.lte('month', endDate);
      }
      if (provider) {
        query = query.eq('provider', provider);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data;
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
      let query = supabase
        .from('affiliate_performance')
        .select('*')
        .order('total_clicks', { ascending: false })
        .limit(limit);

      if (provider) {
        query = query.eq('provider', provider);
      }
      if (destination) {
        query = query.eq('destination', destination);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data;
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
      let query = supabase
        .from('affiliate_conversions')
        .select('*')
        .order('created_at', { ascending: false });

      if (startDate) {
        query = query.gte('created_at', startDate);
      }
      if (endDate) {
        query = query.lte('created_at', endDate);
      }
      if (provider) {
        query = query.eq('provider', provider);
      }
      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data;
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
      const { data: conversions, error } = await supabase
        .from('affiliate_conversions')
        .select('provider, status, booking_amount, commission_amount');

      if (error) throw error;

      const stats = {
        totalConversions: conversions.length,
        totalRevenue: conversions.reduce((sum, c) => sum + parseFloat(c.booking_amount || 0), 0),
        totalCommission: conversions.reduce((sum, c) => sum + parseFloat(c.commission_amount || 0), 0),
        pendingCommission: conversions
          .filter(c => c.status === 'pending' || c.status === 'confirmed')
          .reduce((sum, c) => sum + parseFloat(c.commission_amount || 0), 0),
        paidCommission: conversions
          .filter(c => c.status === 'paid')
          .reduce((sum, c) => sum + parseFloat(c.commission_amount || 0), 0),
        byProvider: {}
      };

      // Group by provider
      conversions.forEach(c => {
        if (!stats.byProvider[c.provider]) {
          stats.byProvider[c.provider] = {
            conversions: 0,
            revenue: 0,
            commission: 0
          };
        }
        stats.byProvider[c.provider].conversions++;
        stats.byProvider[c.provider].revenue += parseFloat(c.booking_amount || 0);
        stats.byProvider[c.provider].commission += parseFloat(c.commission_amount || 0);
      });

      return stats;
    } catch (error) {
      console.error('Error fetching summary stats:', error);
      throw error;
    }
  }
}

module.exports = AffiliateTrackingService;
