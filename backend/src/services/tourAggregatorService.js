/**
 * Tour Aggregator Service
 * 
 * Combines tours from multiple providers (Premium Tours, Viator, GetYourGuide, etc.)
 * and presents them in a unified format
 */

const PremiumToursService = require('./premiumToursService');
const ViatorService = require('./viatorService');
// Add more providers here as you integrate them
// const GetYourGuideService = require('./getYourGuideService');
// const KlookService = require('./klookService');

class TourAggregatorService {
  /**
   * Search tours across all providers
   * @param {Object} filters - Search filters
   * @returns {Promise<Array>} Combined tours from all providers
   */
  static async searchAllProviders(filters = {}) {
    const results = await Promise.allSettled([
      // Premium Tours
      PremiumToursService.getTours(filters).catch(err => {
        console.error('Premium Tours error:', err);
        return [];
      }),
      
      // Viator
      ViatorService.searchTours({
        destinationId: this._getViatorDestinationId(filters.destination),
        ...filters
      }).catch(err => {
        console.error('Viator error:', err);
        return [];
      }),
      
      // Add more providers here
      // GetYourGuideService.searchTours(filters),
      // KlookService.searchTours(filters),
    ]);

    // Combine all successful results
    const allTours = results
      .filter(result => result.status === 'fulfilled')
      .flatMap(result => result.value);

    // Sort by rating or price
    return this._sortTours(allTours, filters.sortBy);
  }

  /**
   * Get tour by ID from any provider
   * @param {string} tourId - Tour ID or slug
   * @param {string} provider - Provider name (optional)
   * @returns {Promise<Object>} Tour details
   */
  static async getTourById(tourId, provider = null) {
    // If provider is specified, go directly to that provider
    if (provider) {
      return this._getTourFromProvider(tourId, provider);
    }

    // Otherwise, try all providers until we find it
    const providers = [
      { name: 'premium-tours', service: PremiumToursService },
      { name: 'viator', service: ViatorService },
      // Add more providers
    ];

    for (const { name, service } of providers) {
      try {
        const tour = await service.getTourById(tourId);
        if (tour) {
          return { ...tour, provider: name };
        }
      } catch (error) {
        // Try next provider
        continue;
      }
    }

    throw new Error('Tour not found in any provider');
  }

  /**
   * Create booking with the appropriate provider
   * @param {Object} bookingData - Booking details
   * @param {string} provider - Provider name
   * @returns {Promise<Object>} Booking confirmation
   */
  static async createBooking(bookingData, provider) {
    switch (provider.toLowerCase()) {
      case 'premium-tours':
        return await PremiumToursService.createBooking(bookingData);
      
      case 'viator':
        return await ViatorService.createBooking(bookingData);
      
      // Add more providers
      // case 'getyourguide':
      //   return await GetYourGuideService.createBooking(bookingData);
      
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  /**
   * Check availability across provider
   * @param {string} tourId - Tour ID
   * @param {string} date - Date
   * @param {string} provider - Provider name
   * @returns {Promise<Object>} Availability
   */
  static async checkAvailability(tourId, date, provider) {
    switch (provider.toLowerCase()) {
      case 'premium-tours':
        return await PremiumToursService.checkAvailability(tourId, date);
      
      case 'viator':
        return await ViatorService.checkAvailability(tourId, date);
      
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  /**
   * Helper: Sort tours by various criteria
   */
  static _sortTours(tours, sortBy = 'rating') {
    switch (sortBy) {
      case 'price_low':
        return tours.sort((a, b) => a.price_adult - b.price_adult);
      
      case 'price_high':
        return tours.sort((a, b) => b.price_adult - a.price_adult);
      
      case 'rating':
        return tours.sort((a, b) => b.rating - a.rating);
      
      case 'popular':
        return tours.sort((a, b) => b.review_count - a.review_count);
      
      default:
        return tours;
    }
  }

  /**
   * Helper: Map destination names to Viator destination IDs
   * You'll need to build this mapping or use Viator's destination search API
   */
  static _getViatorDestinationId(destination) {
    const destinationMap = {
      'London': '684',
      'Paris': '479',
      'New York': '684',
      'Dubai': '24503',
      'Barcelona': '1130',
      'Rome': '1073',
      'Amsterdam': '1095',
      // Add more as needed
    };

    return destinationMap[destination] || null;
  }

  /**
   * Helper: Get tour from specific provider
   */
  static async _getTourFromProvider(tourId, provider) {
    switch (provider.toLowerCase()) {
      case 'premium-tours':
        return await PremiumToursService.getTourById(tourId);
      
      case 'viator':
        return await ViatorService.getProductDetails(tourId);
      
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  /**
   * Get provider statistics (for admin dashboard)
   * @returns {Promise<Object>} Provider stats
   */
  static async getProviderStats() {
    // This would query your database for actual stats
    return {
      providers: [
        {
          name: 'Premium Tours',
          tours_count: 150,
          bookings_count: 45,
          revenue: 12500.00,
          commission_rate: 12.5
        },
        {
          name: 'Viator',
          tours_count: 5000,
          bookings_count: 120,
          revenue: 34000.00,
          commission_rate: 8.0
        }
        // Add more providers
      ]
    };
  }
}

module.exports = TourAggregatorService;
