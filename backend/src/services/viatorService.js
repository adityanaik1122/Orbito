/**
 * Viator API Service
 * 
 * Viator Partner API integration for reselling tours
 * Documentation: https://docs.viator.com/partner-api/
 * 
 * To get started with Viator:
 * 1. Sign up for Viator Affiliate Program: https://www.viator.com/affiliates
 * 2. Get API credentials from Viator Partner Portal
 * 3. Add credentials to .env file
 */

const logger = require('../utils/logger');
const VIATOR_API_URL = process.env.VIATOR_API_URL || 'https://api.viator.com/partner';
const VIATOR_API_KEY = process.env.VIATOR_API_KEY || null;
const VIATOR_AFFILIATE_ID = process.env.VIATOR_AFFILIATE_ID || null;
const IS_SANDBOX = VIATOR_API_URL.includes('sandbox');

class ViatorService {
  /**
   * Search Viator tours by destination
   * @param {Object} params - Search parameters
   * @returns {Promise<Array>} List of tours
   */
  static async searchTours(params = {}) {
    if (!VIATOR_API_KEY) {
      console.warn('Viator API key not configured. Using mock data.');
      return this._getMockTours(params);
    }

    try {
      logger.info(`[Viator${IS_SANDBOX ? ' Sandbox' : ''}] Searching tours for destination:`, params.destinationId);
      
      const response = await fetch(`${VIATOR_API_URL}/products/search`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json;version=2.0',
          'Accept-Language': 'en-US',
          'Content-Type': 'application/json',
          'exp-api-key': VIATOR_API_KEY
        },
        body: JSON.stringify({
          destId: params.destinationId,
          topX: '1-20',
          sortOrder: params.sortOrder || 'REVIEW_AVG_RATING_D',
          currency: 'GBP'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Viator API error (${response.status}):`, errorText);
        throw new Error(`Viator API error: ${response.statusText}`);
      }

      const data = await response.json();
      logger.info(`[Viator${IS_SANDBOX ? ' Sandbox' : ''}] Found ${data.data?.length || 0} tours`);
      return this._transformViatorProducts(data.data);
    } catch (error) {
      console.error('Viator API Error:', error);
      throw error;
    }
  }

  /**
   * Get product details from Viator
   * @param {string} productCode - Viator product code
   * @returns {Promise<Object>} Product details
   */
  static async getProductDetails(productCode) {
    if (!VIATOR_API_KEY) {
      return this._getMockTourDetails(productCode);
    }

    try {
      const response = await fetch(`${VIATOR_API_URL}/products/${productCode}`, {
        headers: {
          'Accept': 'application/json;version=2.0',
          'Accept-Language': 'en-US',
          'exp-api-key': VIATOR_API_KEY
        }
      });

      const data = await response.json();
      return this._transformViatorProduct(data.data);
    } catch (error) {
      console.error('Viator Product Details Error:', error);
      throw error;
    }
  }

  /**
   * Check availability for a product
   * @param {string} productCode - Viator product code
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<Object>} Availability data
   */
  static async checkAvailability(productCode, date) {
    if (!VIATOR_API_KEY) {
      return { available: true, spots: 10 };
    }

    try {
      const response = await fetch(`${VIATOR_API_URL}/availability/check`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json;version=2.0',
          'Accept-Language': 'en-US',
          'Content-Type': 'application/json',
          'exp-api-key': VIATOR_API_KEY
        },
        body: JSON.stringify({
          productCode,
          travelDate: date
        })
      });

      const data = await response.json();
      return {
        available: data.data.available,
        spots: data.data.vacancies
      };
    } catch (error) {
      console.error('Viator Availability Error:', error);
      throw error;
    }
  }

  /**
   * Create a booking with Viator
   * @param {Object} bookingData - Booking details
   * @returns {Promise<Object>} Booking confirmation
   */
  static async createBooking(bookingData) {
    if (!VIATOR_API_KEY) {
      return {
        success: true,
        viatorBookingId: `VIA-${Date.now()}`,
        status: 'PENDING',
        message: 'Mock booking created'
      };
    }

    try {
      const response = await fetch(`${VIATOR_API_URL}/bookings/book`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json;version=2.0',
          'Accept-Language': 'en-US',
          'Content-Type': 'application/json',
          'exp-api-key': VIATOR_API_KEY
        },
        body: JSON.stringify({
          productCode: bookingData.productCode,
          travelDate: bookingData.date,
          booker: {
            firstname: bookingData.firstName,
            surname: bookingData.lastName,
            email: bookingData.email,
            phone: bookingData.phone
          },
          travelers: bookingData.travelers,
          currencyCode: 'GBP'
        })
      });

      const data = await response.json();
      return {
        success: true,
        viatorBookingId: data.data.itemId,
        status: data.data.status,
        confirmationCode: data.data.voucherKey
      };
    } catch (error) {
      console.error('Viator Booking Error:', error);
      throw error;
    }
  }

  /**
   * Transform Viator products to our schema
   */
  static _transformViatorProducts(products) {
    return products.map(product => this._transformViatorProduct(product));
  }

  /**
   * Transform single Viator product to our schema
   */
  static _transformViatorProduct(product) {
    return {
      external_id: product.productCode,
      title: product.title,
      slug: product.productCode.toLowerCase(),
      description: product.description,
      highlights: product.highlights || [],
      destination: product.destination?.name,
      city: product.destination?.city,
      country: product.destination?.country,
      meeting_point: product.logistics?.start?.[0]?.description,
      coordinates: {
        lat: product.location?.latitude,
        lng: product.location?.longitude
      },
      duration: product.duration?.fixedDurationInMinutes 
        ? `${Math.floor(product.duration.fixedDurationInMinutes / 60)} hours`
        : product.duration?.variableDurationFromMinutes
        ? `${Math.floor(product.duration.variableDurationFromMinutes / 60)}-${Math.floor(product.duration.variableDurationToMinutes / 60)} hours`
        : 'Flexible',
      duration_hours: product.duration?.fixedDurationInMinutes 
        ? product.duration.fixedDurationInMinutes / 60
        : null,
      category: product.productCategories?.[0]?.name || 'General',
      subcategory: product.productCategories?.[1]?.name,
      price_adult: product.pricing?.summary?.fromPrice || 0,
      currency: product.pricing?.currency || 'GBP',
      price_includes: product.inclusions?.map(i => i.description) || [],
      price_excludes: product.exclusions?.map(e => e.description) || [],
      main_image: product.images?.[0]?.variants?.[0]?.url,
      images: product.images?.map(img => img.variants?.[0]?.url) || [],
      is_available: true,
      instant_confirmation: product.bookingConfirmationSettings?.confirmationType === 'INSTANT',
      cancellation_policy: product.cancellationPolicy?.description,
      rating: product.reviews?.combinedAverageRating || 0,
      review_count: product.reviews?.totalReviews || 0,
      provider: 'viator',
      booking_url: this._buildAffiliateUrl(product.productUrl, product.productCode)
    };
  }

  /**
   * Build affiliate URL for Viator
   */
  static _buildAffiliateUrl(productUrl, productCode) {
    const baseUrl = `https://www.viator.com${productUrl}`;
    
    if (VIATOR_AFFILIATE_ID) {
      return `${baseUrl}?pid=${VIATOR_AFFILIATE_ID}&mcid=via-${productCode}&medium=link&campaign=orbito`;
    }
    
    return baseUrl;
  }

  /**
   * Mock data for development
   */
  static _getMockTours(params) {
    // Return empty for now, or add mock Viator tours
    return [];
  }

  static _getMockTourDetails(productCode) {
    return {
      external_id: productCode,
      title: 'Mock Viator Tour',
      description: 'This is a mock tour for testing',
      price_adult: 50.00,
      provider: 'viator'
    };
  }
}

module.exports = ViatorService;
