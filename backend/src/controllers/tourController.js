const { getTours: getToursFromDB, getTourById: getTourByIdFromDB, createBooking: createBookingInDB, getUserBookings: getUserBookingsFromDB, getBookingById: getBookingByIdFromDB } = require('../models/tourModel');
const PremiumToursService = require('../services/premiumToursService');
const { sendBookingCancellation } = require('../services/emailService');
const logger = require('../utils/logger');

/**
 * Get all tours
 * Can fetch from database or Premium Tours API
 */
async function getTours(req, res) {
  try {
    const filters = {
      destination: req.query.destination,
      country: req.query.country,
      categories: req.query.categories, // comma-separated string
      durations: req.query.durations, // comma-separated: half-day, full-day, multi-day
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      featured: req.query.featured,
      sortBy: req.query.sortBy
    };

    // Try to get from database first
    let data, error;
    try {
      const result = await getToursFromDB(filters);
      data = result.data;
      error = result.error;
    } catch (dbError) {
      // Database not set up yet, use mock data
      logger.warn('Database not available, using mock data:', dbError.message);
      error = dbError;
    }

    // If database has error or is empty, fall back to Premium Tours API/mock data
    if (error || !data || data.length === 0) {
      logger.info('No tours in database, fetching from Premium Tours service...');
      const apiTours = await PremiumToursService.getTours(filters);
      const normalizedTours = apiTours.map((tour) => ({
        ...tour,
        price_amount: tour.price_amount ?? tour.price_adult ?? 0,
        price_currency: tour.price_currency ?? tour.currency ?? 'USD',
        duration_minutes: tour.duration_minutes ?? (tour.duration_hours ? Math.round(tour.duration_hours * 60) : null),
        city: tour.city || tour.destination_city || tour.destination,
        country_code: tour.country_code || tour.country,
        is_active: tour.is_active ?? tour.is_available ?? true,
        source: tour.source || tour.provider || 'premium-tours'
      }));
      
      // Apply client-side filtering for Premium Tours data
      let filteredTours = normalizedTours;
      
      // Filter by categories
      if (filters.categories) {
        const categoriesArray = filters.categories.split(',').filter(Boolean);
        if (categoriesArray.length > 0) {
          filteredTours = filteredTours.filter(tour => 
            categoriesArray.includes(tour.category)
          );
        }
      }
      
      // Filter by duration
      if (filters.durations) {
        const durationsArray = filters.durations.split(',').filter(Boolean);
        if (durationsArray.length > 0) {
          filteredTours = filteredTours.filter(tour => {
            const hours = tour.duration_minutes ? tour.duration_minutes / 60 : (tour.duration_hours || 0);
            return durationsArray.some(duration => {
              if (duration === 'half-day') return hours < 4;
              if (duration === 'full-day') return hours >= 4 && hours <= 8;
              if (duration === 'multi-day') return hours > 8;
              return false;
            });
          });
        }
      }
      
      // Filter by price range
      if (filters.minPrice) {
        filteredTours = filteredTours.filter(tour => 
          tour.price_amount >= parseFloat(filters.minPrice)
        );
      }
      if (filters.maxPrice) {
        filteredTours = filteredTours.filter(tour => 
          tour.price_amount <= parseFloat(filters.maxPrice)
        );
      }
      
      // Sort
      if (filters.sortBy) {
        filteredTours.sort((a, b) => {
          switch (filters.sortBy) {
            case 'price_low':
              return a.price_amount - b.price_amount;
            case 'price_high':
              return b.price_amount - a.price_amount;
            case 'rating':
              return (b.rating || 0) - (a.rating || 0);
            case 'popular':
              return (b.views_count || 0) - (a.views_count || 0);
            default:
              return 0;
          }
        });
      }
      
      return res.json({ success: true, tours: filteredTours });
    }

    res.json({ success: true, tours: data });
  } catch (error) {
    console.error('Error in getTours:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch tours' });
  }
}

/**
 * Get single tour by ID or slug
 */
async function getTourDetail(req, res) {
  try {
    const { identifier } = req.params;

    // Try database first
    let data, error;
    try {
      const result = await getTourByIdFromDB(identifier);
      data = result.data;
      error = result.error;
    } catch (dbError) {
      logger.warn('Database not available, using mock data');
      error = dbError;
    }

    // If not in database, try Premium Tours service
    if (error || !data) {
      logger.info(`Tour ${identifier} not in database, fetching from Premium Tours service...`);
      try {
        const raw = await PremiumToursService.getTourById(identifier);
        data = {
          ...raw,
          price_amount: raw.price_amount ?? raw.price_adult ?? 0,
          price_currency: raw.price_currency ?? raw.currency ?? 'USD',
          duration_minutes: raw.duration_minutes ?? (raw.duration_hours ? Math.round(raw.duration_hours * 60) : null),
          city: raw.city || raw.destination_city || raw.destination,
          country_code: raw.country_code || raw.country,
          is_active: raw.is_active ?? raw.is_available ?? true,
          source: raw.source || raw.provider || 'premium-tours'
        };
      } catch (serviceError) {
        return res.status(404).json({ error: 'Tour not found' });
      }
    }

    res.json({ success: true, tour: data });
  } catch (error) {
    console.error('Error in getTourDetail:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch tour details' });
  }
}

/**
 * Create a booking
 */
async function createBooking(req, res) {
  try {
    const { tourId, numPeople, totalAmount, currency, customerContact, specialRequests } = req.body;
    
    const userId = req.user.id;

    // Validate required fields
    if (!tourId || !totalAmount || !customerContact?.name || !customerContact?.email) {
      return res.status(400).json({ error: 'Missing required booking information' });
    }

    const bookingData = {
      user_id: userId,
      tour_id: tourId,
      num_people: numPeople || 1,
      total_amount: totalAmount,
      currency: currency || 'USD',
      customer_contact: customerContact,
      special_requests: specialRequests,
      status: 'pending'
    };

    // Create booking in our database
    const { data, error } = await createBookingInDB(bookingData);

    if (error) {
      throw error;
    }

    // TODO: When Premium Tours API is available, create booking with them too
    // const premiumToursResult = await PremiumToursService.createBooking(bookingData);
    // Update our booking with their external_booking_id

    logger.success('Booking created successfully:', data[0]);

    res.json({
      success: true,
      booking: data[0],
      message: 'Booking created successfully. Please proceed with payment.'
    });
  } catch (error) {
    console.error('Error in createBooking:', error);
    res.status(500).json({ error: error.message || 'Failed to create booking' });
  }
}

/**
 * Get user's bookings
 */
async function getUserBookings(req, res) {
  try {
    const userId = req.user.id;

    const { data, error } = await getUserBookingsFromDB(userId);

    if (error) {
      throw error;
    }

    res.json({ success: true, bookings: data });
  } catch (error) {
    console.error('Error in getUserBookings:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch bookings' });
  }
}

/**
 * Get booking details
 */
async function getBookingDetail(req, res) {
  try {
    const { identifier } = req.params;
    const userId = req.user.id;

    const { data, error } = await getBookingByIdFromDB(identifier, userId);

    if (error || !data) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ success: true, booking: data });
  } catch (error) {
    console.error('Error in getBookingDetail:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch booking details' });
  }
}

/**
 * Cancel a booking
 */
async function cancelBooking(req, res) {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;
    const userId = req.user.id;

    // First, verify the booking belongs to this user
    const { data: booking, error: fetchError } = await getBookingByIdFromDB(id, userId);

    if (fetchError || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    // TODO: When Premium Tours API is available, cancel with them too
    // await PremiumToursService.cancelBooking(booking.external_booking_id);

    // Update booking status
    const { updateBookingStatus } = require('../models/tourModel');
    const logger = require('../utils/logger');
    const { data, error } = await updateBookingStatus(id, 'cancelled', {
      cancelled_at: new Date().toISOString(),
      cancellation_reason: cancellationReason
    });

    if (error) {
      throw error;
    }

    const cancelledBooking = data[0];

    // Fire-and-forget cancellation email
    sendBookingCancellation(
      cancelledBooking,
      { title: 'Your tour' },
      { name: cancelledBooking.customer_name, email: cancelledBooking.customer_email }
    ).catch((err) => logger.error('Failed to send cancellation email:', err));

    res.json({
      success: true,
      booking: cancelledBooking,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Error in cancelBooking:', error);
    res.status(500).json({ error: error.message || 'Failed to cancel booking' });
  }
}

module.exports = {
  getTours,
  getTourDetail,
  createBooking,
  getUserBookings,
  getBookingDetail,
  cancelBooking
};
