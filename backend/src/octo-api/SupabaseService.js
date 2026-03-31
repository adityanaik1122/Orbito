const { supabase } = require('../config/supabase');

class SupabaseService {
  /**
   * Check availability for a tour on specific dates
   * @param {string} tourId - The tour ID
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @param {number} units - Number of units/participants requested
   * @returns {Promise<Array>} Available slots
   */
  async checkAvailability(tourId, startDate, endDate, units = 1) {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabase
      .from('tour_availability')
      .select('*')
      .eq('tour_id', tourId)
      .gte('start_time', `${startDate}T00:00:00Z`)
      .lte('start_time', `${endDate}T23:59:59Z`)
      .gte('remaining', units);

    if (error) {
      throw new Error(`Availability check failed: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get tour details by ID
   * @param {string} tourId
   * @returns {Promise<Object|null>}
   */
  async getTour(tourId) {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .eq('id', tourId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Product fetch failed: ${error.message}`);
    }

    return data;
  }

  /**
   * Create a new booking (pending status)
   * @param {Object} bookingData
   * @returns {Promise<Object>} Created booking
   */
  async createBooking(bookingData) {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const booking = {
      ...bookingData,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single();

    if (error) {
      throw new Error(`Booking creation failed: ${error.message}`);
    }

    // Decrement availability
    if (bookingData.availability_id && bookingData.units) {
      await this.decrementAvailability(
        bookingData.availability_id,
        bookingData.units
      );
    }

    return data;
  }

  /**
   * Get booking by ID
   * @param {string} bookingId
   * @returns {Promise<Object|null>}
   */
  async getBooking(bookingId) {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Booking fetch failed: ${error.message}`);
    }

    return data;
  }

  /**
   * Confirm a booking (change status to confirmed)
   * @param {string} bookingId - Booking ID
   * @returns {Promise<Object>} Updated booking
   */
  async confirmBooking(bookingId) {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .eq('status', 'pending')
      .select()
      .single();

    if (error) {
      throw new Error(`Booking confirmation failed: ${error.message}`);
    }

    if (!data) {
      throw new Error('Booking not found or already confirmed/cancelled');
    }

    return data;
  }

  /**
   * Decrement availability remaining
   * @param {string} availabilityId
   * @param {number} units
   */
  async decrementAvailability(availabilityId, units) {
    const { data, error } = await supabase
      .from('tour_availability')
      .select('remaining')
      .eq('id', availabilityId)
      .single();

    if (error) {
      console.error('Failed to fetch availability:', error.message);
      return;
    }

    const nextRemaining = Math.max((data?.remaining || 0) - units, 0);
    const { error: updateError } = await supabase
      .from('tour_availability')
      .update({ remaining: nextRemaining })
      .eq('id', availabilityId);

    if (updateError) {
      console.error('Failed to decrement availability:', updateError.message);
    }
  }
}

module.exports = new SupabaseService();
