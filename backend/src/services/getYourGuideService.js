/**
 * GetYourGuide API Service
 * 
 * GetYourGuide Partner API integration
 * Documentation: https://partner.getyourguide.com/
 * 
 * To get started:
 * 1. Apply for GetYourGuide Partner Program: https://partner.getyourguide.com/
 * 2. Get API credentials after approval
 * 3. Add credentials to .env file
 * 
 * Note: GetYourGuide requires partner approval which can take 1-2 weeks
 */

const GYG_API_URL = process.env.GYG_API_URL || 'https://api.getyourguide.com/1';
const GYG_API_KEY = process.env.GYG_API_KEY || null;
const GYG_AFFILIATE_ID = process.env.GYG_AFFILIATE_ID || null;

// Destination ID mapping for GetYourGuide
const DESTINATION_IDS = {
  'London': '45',
  'Paris': '60',
  'Rome': '46',
  'Barcelona': '42',
  'Amsterdam': '47',
  'Dubai': '2323',
  'New York': '121',
  'Tokyo': '127',
  'Singapore': '122',
  'Bangkok': '82',
  // Add more as needed
};

class GetYourGuideService {
  /**
   * Search tours by destination
   * @param {Object} params - Search parameters
   * @returns {Promise<Array>} List of tours
   */
  static async searchTours(params = {}) {
    if (!GYG_API_KEY) {
      console.warn('GetYourGuide API key not configured. Returning empty.');
      return [];
    }

    try {
      const destId = DESTINATION_IDS[params.destination] || params.destinationId;
      if (!destId) {
        console.warn(`No GYG destination ID for: ${params.destination}`);
        return [];
      }

      const queryParams = new URLSearchParams({
        dest_id: destId,
        date: params.date || new Date().toISOString().split('T')[0],
        cnt_language: 'en',
        currency: params.currency || 'GBP',
        limit: params.limit || 20,
        offset: params.offset || 0,
        sortfield: params.sortBy || 'popularity',
        sortorder: 'desc'
      });

      const response = await fetch(`${GYG_API_URL}/tours?${queryParams}`, {
        headers: {
          'Accept': 'application/json',
          'X-Access-Token': GYG_API_KEY
        }
      });

      if (!response.ok) {
        throw new Error(`GYG API error: ${response.statusText}`);
      }

      const data = await response.json();
      return this._transformProducts(data.data?.tours || []);
    } catch (error) {
      console.error('GetYourGuide API Error:', error);
      return [];
    }
  }

  /**
   * Get tour details
   * @param {string} tourId - GYG tour ID
   * @returns {Promise<Object>} Tour details
   */
  static async getTourDetails(tourId) {
    if (!GYG_API_KEY) {
      return null;
    }

    try {
      const response = await fetch(`${GYG_API_URL}/tours/${tourId}`, {
        headers: {
          'Accept': 'application/json',
          'X-Access-Token': GYG_API_KEY
        }
      });

      if (!response.ok) {
        throw new Error(`GYG API error: ${response.statusText}`);
      }

      const data = await response.json();
      return this._transformProduct(data.data?.tour);
    } catch (error) {
      console.error('GetYourGuide Tour Details Error:', error);
      return null;
    }
  }

  /**
   * Check availability
   * @param {string} tourId - Tour ID
   * @param {string} date - Date (YYYY-MM-DD)
   * @returns {Promise<Object>} Availability info
   */
  static async checkAvailability(tourId, date) {
    if (!GYG_API_KEY) {
      return { available: true, options: [] };
    }

    try {
      const response = await fetch(
        `${GYG_API_URL}/tours/${tourId}/availabilities?date=${date}`,
        {
          headers: {
            'Accept': 'application/json',
            'X-Access-Token': GYG_API_KEY
          }
        }
      );

      const data = await response.json();
      return {
        available: data.data?.availabilities?.length > 0,
        options: data.data?.availabilities || []
      };
    } catch (error) {
      console.error('GetYourGuide Availability Error:', error);
      return { available: false, options: [] };
    }
  }

  /**
   * Create a booking
   * @param {Object} bookingData - Booking details
   * @returns {Promise<Object>} Booking confirmation
   */
  static async createBooking(bookingData) {
    if (!GYG_API_KEY) {
      return {
        success: false,
        error: 'GetYourGuide API not configured'
      };
    }

    try {
      const response = await fetch(`${GYG_API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Access-Token': GYG_API_KEY
        },
        body: JSON.stringify({
          tour_id: bookingData.tourId,
          datetime: bookingData.datetime,
          categories: bookingData.travelers,
          traveler: {
            salutation: bookingData.salutation || 'MR',
            first_name: bookingData.firstName,
            last_name: bookingData.lastName,
            email: bookingData.email,
            phone_number: bookingData.phone
          }
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error?.message || 'Booking failed'
        };
      }

      return {
        success: true,
        gygBookingId: data.data?.booking_id,
        status: data.data?.status,
        voucherUrl: data.data?.voucher_url
      };
    } catch (error) {
      console.error('GetYourGuide Booking Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Transform GYG products to our schema
   */
  static _transformProducts(products) {
    return products.map(p => this._transformProduct(p));
  }

  /**
   * Transform single GYG product
   */
  static _transformProduct(product) {
    if (!product) return null;

    return {
      external_id: `gyg-${product.tour_id}`,
      title: product.title,
      description: product.abstract || product.description,
      city: product.locations?.[0]?.city,
      country_code: product.locations?.[0]?.country,
      duration_minutes: product.duration?.value ? Math.round(product.duration.value * 60) : null,
      price_amount: product.price?.values?.adult || product.price?.startingPrice,
      price_currency: product.price?.currency || 'GBP',
      is_active: product.is_available !== false,
      source: 'getyourguide',
      booking_url: this._buildAffiliateUrl(product.url, product.tour_id),
      images: product.pictures?.map(p => p.url) || [],
      highlights: product.highlights || []
    };
  }

  /**
   * Build affiliate URL for GetYourGuide
   */
  static _buildAffiliateUrl(productUrl, tourId) {
    const baseUrl = `https://www.getyourguide.com${productUrl}`;
    
    if (GYG_AFFILIATE_ID) {
      return `${baseUrl}?partner_id=${GYG_AFFILIATE_ID}&utm_medium=affiliate&utm_source=orbito&cmp=gyg-${tourId}`;
    }
    
    return baseUrl;
  }
}

module.exports = GetYourGuideService;
