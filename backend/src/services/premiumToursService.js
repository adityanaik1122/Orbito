/**
 * Premium Tours API Service
 * 
 * This service abstracts Premium Tours API calls.
 * Currently uses mock data, but structured to easily swap with real API.
 * 
 * When Premium Tours provides API:
 * 1. Update BASE_URL with their endpoint
 * 2. Add API authentication
 * 3. Map their response format to our schema
 */

const PREMIUM_TOURS_API_URL = process.env.PREMIUM_TOURS_API_URL || null;
const PREMIUM_TOURS_API_KEY = process.env.PREMIUM_TOURS_API_KEY || null;

// Mock data for development (remove when real API is available)
const MOCK_TOURS = [
  {
    external_id: 'PT-001',
    title: 'London Eye Fast Track Tickets',
    slug: 'london-eye-fast-track',
    description: 'Skip the queues and enjoy breathtaking views of London from the iconic London Eye. Your 30-minute rotation offers stunning 360-degree views of the city\'s most famous landmarks.',
    highlights: [
      'Skip-the-line access',
      'Spectacular 360-degree views',
      '30-minute experience',
      'See up to 40km on clear days'
    ],
    destination: 'London',
    city: 'London',
    country: 'United Kingdom',
    meeting_point: 'London Eye, Westminster Bridge Road, London SE1 7PB',
    coordinates: { lat: 51.5033, lng: -0.1195 },
    duration: '30 minutes',
    duration_hours: 0.5,
    category: 'Attractions',
    subcategory: 'Landmarks',
    price_adult: 36.50,
    price_child: 31.00,
    price_infant: 0,
    currency: 'GBP',
    price_includes: ['Fast-track entry', 'One rotation (30 minutes)', 'All taxes'],
    price_excludes: ['Hotel pickup/drop-off', 'Food and drinks'],
    main_image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
    images: [
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
      'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=800'
    ],
    is_available: true,
    available_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    start_times: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
    instant_confirmation: true,
    cancellation_policy: 'Free cancellation up to 24 hours before the experience starts',
    rating: 4.7,
    review_count: 12543,
    featured: true
  },
  {
    external_id: 'PT-002',
    title: 'Tower of London and Crown Jewels Tour',
    slug: 'tower-of-london-crown-jewels',
    description: 'Explore 1,000 years of history at the Tower of London. Marvel at the Crown Jewels, meet the famous Yeoman Warders, and hear captivating stories of the tower\'s past.',
    highlights: [
      'See the Crown Jewels collection',
      'Meet the Yeoman Warders (Beefeaters)',
      'Explore the White Tower',
      'Visit the medieval palace'
    ],
    destination: 'London',
    city: 'London',
    country: 'United Kingdom',
    meeting_point: 'Tower of London, Tower Hill, London EC3N 4AB',
    coordinates: { lat: 51.5081, lng: -0.0759 },
    duration: '3 hours',
    duration_hours: 3,
    category: 'Cultural',
    subcategory: 'Historical Sites',
    price_adult: 34.80,
    price_child: 17.40,
    currency: 'GBP',
    price_includes: ['Entrance ticket', 'Access to Crown Jewels', 'Yeoman Warder tour'],
    price_excludes: ['Audio guide', 'Hotel pickup', 'Food and drinks'],
    main_image: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=800',
    images: [
      'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=800'
    ],
    is_available: true,
    available_days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    start_times: ['09:00', '10:00', '11:00', '12:00'],
    instant_confirmation: true,
    cancellation_policy: 'Non-refundable',
    rating: 4.8,
    review_count: 8921,
    featured: true
  },
  {
    external_id: 'PT-003',
    title: 'Hop-On Hop-Off Bus Tour - 24 Hours',
    slug: 'london-hop-on-hop-off-bus',
    description: 'Discover London at your own pace with a 24-hour hop-on hop-off bus ticket. See all the major sights with live commentary and unlimited rides on three routes.',
    highlights: [
      'Valid for 24 hours',
      'Three different routes',
      'Live English commentary',
      'Free walking tours included',
      'Free river cruise'
    ],
    destination: 'London',
    city: 'London',
    country: 'United Kingdom',
    meeting_point: 'Multiple pickup points across London',
    duration: '24 hours',
    duration_hours: 24,
    category: 'Sightseeing',
    subcategory: 'Bus Tours',
    price_adult: 39.00,
    price_child: 22.00,
    currency: 'GBP',
    price_includes: ['24-hour ticket', 'Three bus routes', 'Live commentary', 'Walking tours', 'River cruise'],
    price_excludes: ['Hotel pickup', 'Entrance fees to attractions'],
    main_image: 'https://images.unsplash.com/photo-1581367590464-cfac581eb56a?w=800',
    is_available: true,
    available_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    start_times: ['09:00'],
    instant_confirmation: true,
    cancellation_policy: 'Free cancellation up to 24 hours before',
    rating: 4.5,
    review_count: 15234,
    featured: false
  },
  {
    external_id: 'PT-004',
    title: 'Warner Bros. Studio Tour - The Making of Harry Potter',
    slug: 'harry-potter-studio-tour',
    description: 'Step into the magical world of Harry Potter at Warner Bros. Studio Tour London. Explore authentic sets, see original costumes and props, and discover filmmaking secrets.',
    highlights: [
      'Explore Hogwarts Great Hall',
      'Walk through Diagon Alley',
      'See the original Hogwarts Express',
      'Discover filmmaking secrets',
      'Includes return transport from London'
    ],
    destination: 'London',
    city: 'Watford',
    country: 'United Kingdom',
    meeting_point: 'Golden Tours Visitor Centre, London Victoria',
    coordinates: { lat: 51.5154, lng: -0.1755 },
    duration: '7 hours',
    duration_hours: 7,
    category: 'Entertainment',
    subcategory: 'Studio Tours',
    price_adult: 95.00,
    price_child: 89.00,
    currency: 'GBP',
    price_includes: ['Return coach transport', 'Studio entrance', 'All exhibitions', 'Audio guide'],
    price_excludes: ['Food and drinks', 'Souvenir photos'],
    main_image: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=800',
    is_available: true,
    available_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    start_times: ['08:00', '10:00', '12:00'],
    instant_confirmation: true,
    cancellation_policy: 'Free cancellation up to 48 hours before',
    rating: 4.9,
    review_count: 24567,
    featured: true
  },
  {
    external_id: 'PT-005',
    title: 'Thames River Dinner Cruise',
    slug: 'thames-dinner-cruise',
    description: 'Enjoy a magical evening on the Thames with a 3-course dinner, live music, and stunning views of London\'s illuminated landmarks including Tower Bridge and the Houses of Parliament.',
    highlights: [
      '3-course dinner menu',
      'Live music and entertainment',
      'Views of illuminated landmarks',
      '2.5-hour cruise',
      'Welcome drink included'
    ],
    destination: 'London',
    city: 'London',
    country: 'United Kingdom',
    meeting_point: 'Tower Pier, Lower Thames Street, London EC3N 4DT',
    coordinates: { lat: 51.5090, lng: -0.0763 },
    duration: '2.5 hours',
    duration_hours: 2.5,
    category: 'Dining',
    subcategory: 'Dinner Cruises',
    price_adult: 85.00,
    currency: 'GBP',
    price_includes: ['2.5-hour cruise', '3-course dinner', 'Live music', 'Welcome drink'],
    price_excludes: ['Additional drinks', 'Gratuities', 'Hotel pickup'],
    main_image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
    is_available: true,
    available_days: ['Wednesday', 'Thursday', 'Friday', 'Saturday'],
    start_times: ['19:00'],
    instant_confirmation: false,
    cancellation_policy: 'Free cancellation up to 72 hours before',
    rating: 4.6,
    review_count: 3421,
    featured: false
  }
];

class PremiumToursService {
  /**
   * Fetch tours from Premium Tours API (or mock data)
   * @param {Object} filters - { destination, category, minPrice, maxPrice }
   * @returns {Promise<Array>} List of tours
   */
  static async getTours(filters = {}) {
    // TODO: When API is available, replace with real API call
    if (PREMIUM_TOURS_API_URL) {
      return await this._fetchFromAPI('/tours', filters);
    }

    // Mock data filtering
    let tours = [...MOCK_TOURS];

    if (filters.destination) {
      tours = tours.filter(t => 
        t.destination.toLowerCase().includes(filters.destination.toLowerCase())
      );
    }

    if (filters.category) {
      tours = tours.filter(t => t.category === filters.category);
    }

    if (filters.minPrice) {
      tours = tours.filter(t => t.price_adult >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      tours = tours.filter(t => t.price_adult <= parseFloat(filters.maxPrice));
    }

    return tours;
  }

  /**
   * Get a single tour by ID
   * @param {string} tourId - Tour external ID or slug
   * @returns {Promise<Object>} Tour details
   */
  static async getTourById(tourId) {
    // TODO: When API is available, replace with real API call
    if (PREMIUM_TOURS_API_URL) {
      return await this._fetchFromAPI(`/tours/${tourId}`);
    }

    // Mock data
    const tour = MOCK_TOURS.find(t => 
      t.external_id === tourId || t.slug === tourId
    );

    if (!tour) {
      throw new Error('Tour not found');
    }

    return tour;
  }

  /**
   * Create a booking with Premium Tours
   * @param {Object} bookingData - Booking details
   * @returns {Promise<Object>} Booking confirmation
   */
  static async createBooking(bookingData) {
    // TODO: When API is available, replace with real API call
    if (PREMIUM_TOURS_API_URL) {
      return await this._fetchFromAPI('/bookings', {
        method: 'POST',
        body: bookingData
      });
    }

    // Mock booking creation
    return {
      success: true,
      external_booking_id: `PT-BK-${Date.now()}`,
      confirmation_code: `CONF-${Math.random().toString(36).substring(7).toUpperCase()}`,
      booking_status: 'confirmed',
      message: 'Booking created successfully (MOCK)',
      ...bookingData
    };
  }

  /**
   * Check availability for a tour on specific date/time
   * @param {string} tourId - Tour ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {string} time - Time in HH:MM format
   * @returns {Promise<Object>} Availability status
   */
  static async checkAvailability(tourId, date, time) {
    // TODO: When API is available, replace with real API call
    if (PREMIUM_TOURS_API_URL) {
      return await this._fetchFromAPI(`/tours/${tourId}/availability`, {
        params: { date, time }
      });
    }

    // Mock availability check
    const tour = await this.getTourById(tourId);
    const requestedDay = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    
    const isAvailable = 
      tour.available_days.includes(requestedDay) &&
      tour.start_times.includes(time);

    return {
      available: isAvailable,
      remaining_spots: isAvailable ? 15 : 0
    };
  }

  /**
   * Private method to make actual API calls (when API is ready)
   */
  static async _fetchFromAPI(endpoint, options = {}) {
    const url = `${PREMIUM_TOURS_API_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${PREMIUM_TOURS_API_KEY}`,
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined
      });

      if (!response.ok) {
        throw new Error(`Premium Tours API Error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // TODO: Transform Premium Tours response to our schema
      return this._transformAPIResponse(data);
    } catch (error) {
      console.error('Premium Tours API Error:', error);
      throw error;
    }
  }

  /**
   * Transform Premium Tours API response to our schema
   * This will need to be updated based on their actual API structure
   */
  static _transformAPIResponse(apiData) {
    // TODO: Map their field names to our schema
    // Example transformation:
    return {
      external_id: apiData.id,
      title: apiData.name || apiData.title,
      description: apiData.description,
      price_adult: apiData.price || apiData.adult_price,
      // ... map other fields
    };
  }
}

module.exports = PremiumToursService;
