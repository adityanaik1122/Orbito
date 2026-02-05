const { supabase } = require('../config/supabase');

class SupabaseService {
  /**
   * Check availability for a product on specific dates
   * @param {string} productId - The product/tour ID
   * @param {string} localDateStart - Start date (YYYY-MM-DD)
   * @param {string} localDateEnd - End date (YYYY-MM-DD)
   * @param {number} units - Number of units/participants requested
   * @returns {Promise<Array>} Available slots
   */
  async checkAvailability(productId, localDateStart, localDateEnd, units = 1) {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabase
      .from('availability')
      .select('*')
      .eq('product_id', productId)
      .gte('local_date', localDateStart)
      .lte('local_date', localDateEnd)
      .gte('vacancies', units)
      .eq('status', 'AVAILABLE');

    if (error) {
      throw new Error(`Availability check failed: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get product details by ID
   * @param {string} productId
   * @returns {Promise<Object|null>}
   */
  async getProduct(productId) {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Product fetch failed: ${error.message}`);
    }

    return data;
  }

  /**
   * Create a new booking (ON_HOLD status)
   * @param {Object} bookingData
   * @returns {Promise<Object>} Created booking
   */
  async createBooking(bookingData) {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const booking = {
      ...bookingData,
      status: 'ON_HOLD',
      created_at: new Date().toISOString(),
      uuid: this.generateUUID(),
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
    await this.decrementAvailability(
      bookingData.product_id,
      bookingData.local_date,
      bookingData.units
    );

    return data;
  }

  /**
   * Get booking by UUID
   * @param {string} uuid
   * @returns {Promise<Object|null>}
   */
  async getBooking(uuid) {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('uuid', uuid)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Booking fetch failed: ${error.message}`);
    }

    return data;
  }

  /**
   * Confirm a booking (change status to CONFIRMED)
   * @param {string} uuid - Booking UUID
   * @returns {Promise<Object>} Updated booking
   */
  async confirmBooking(uuid) {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({
        status: 'CONFIRMED',
        confirmed_at: new Date().toISOString(),
      })
      .eq('uuid', uuid)
      .eq('status', 'ON_HOLD')
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
   * Decrement availability vacancies
   * @param {string} productId
   * @param {string} localDate
   * @param {number} units
   */
  async decrementAvailability(productId, localDate, units) {
    const { error } = await supabase.rpc('decrement_availability', {
      p_product_id: productId,
      p_local_date: localDate,
      p_units: units,
    });

    if (error) {
      console.error('Failed to decrement availability:', error.message);
    }
  }

  /**
   * Generate a UUID v4
   * @returns {string}
   */
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

module.exports = new SupabaseService();
