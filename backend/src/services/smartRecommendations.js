/**
 * Smart Recommendations Service
 * Provides personalized tour recommendations using ML algorithms
 */

const { supabase } = require('../config/supabase');

class SmartRecommendations {
  /**
   * Get personalized tour recommendations for a user
   * @param {string} userId - User ID
   * @param {Array} tours - Available tours
   * @returns {Promise<Array>} Recommended tours
   */
  async getPersonalized(userId, tours) {
    try {
      // Get user history
      const history = await this.getUserHistory(userId);
      
      // Score each tour
      const scored = tours.map(tour => ({
        tour,
        score: this.calculateScore(tour, history)
      }));

      // Sort by score and return top 10
      scored.sort((a, b) => b.score - a.score);
      return scored.slice(0, 10).map(s => s.tour);
    } catch (error) {
      console.error('Recommendation error:', error);
      // Fallback to popular tours
      return this.getPopularTours(tours);
    }
  }

  /**
   * Calculate recommendation score for a tour
   */
  calculateScore(tour, history) {
    let score = 0;

    // Base score from rating
    score += (tour.rating || 0) * 10;

    // Category preference
    if (history.preferredCategories?.includes(tour.category)) {
      score += 30;
    }

    // Price range match
    const avgPrice = history.avgSpend || 50;
    if (tour.price_adult <= avgPrice * 1.3 && tour.price_adult >= avgPrice * 0.5) {
      score += 20;
    }

    // Duration preference
    if (history.preferredDuration && tour.duration?.includes(history.preferredDuration)) {
      score += 15;
    }

    // Popularity boost
    score += Math.log((tour.review_count || 0) + 1) * 2;

    // Destination match
    if (history.visitedDestinations?.includes(tour.destination)) {
      score += 10;
    }

    // Recency boost for new tours
    if (tour.created_at) {
      const daysSinceCreated = (Date.now() - new Date(tour.created_at)) / (1000 * 60 * 60 * 24);
      if (daysSinceCreated < 30) {
        score += 5;
      }
    }

    return score;
  }

  /**
   * Get user history and preferences
   */
  async getUserHistory(userId) {
    try {
      // Get user's bookings
      const { data: bookings } = await supabase
        .from('bookings')
        .select('*, tours(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!bookings || bookings.length === 0) {
        return this.getDefaultPreferences();
      }

      // Extract preferences
      const categories = bookings.map(b => b.tours?.category).filter(Boolean);
      const prices = bookings.map(b => b.tours?.price_adult).filter(Boolean);
      const destinations = bookings.map(b => b.tours?.destination).filter(Boolean);

      return {
        preferredCategories: [...new Set(categories)],
        avgSpend: prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 50,
        visitedDestinations: [...new Set(destinations)],
        totalBookings: bookings.length,
        preferredDuration: this.extractPreferredDuration(bookings)
      };
    } catch (error) {
      console.error('Error fetching user history:', error);
      return this.getDefaultPreferences();
    }
  }

  /**
   * Extract preferred duration from booking history
   */
  extractPreferredDuration(bookings) {
    const durations = bookings
      .map(b => b.tours?.duration_hours)
      .filter(Boolean);

    if (durations.length === 0) return null;

    const avg = durations.reduce((a, b) => a + b, 0) / durations.length;

    if (avg < 3) return 'short';
    if (avg < 6) return 'medium';
    return 'long';
  }

  /**
   * Default preferences for new users
   */
  getDefaultPreferences() {
    return {
      preferredCategories: [],
      avgSpend: 50,
      visitedDestinations: [],
      totalBookings: 0,
      preferredDuration: null
    };
  }

  /**
   * Get popular tours (fallback)
   */
  getPopularTours(tours) {
    return tours
      .sort((a, b) => {
        const scoreA = (a.rating || 0) * (a.review_count || 0);
        const scoreB = (b.rating || 0) * (b.review_count || 0);
        return scoreB - scoreA;
      })
      .slice(0, 10);
  }

  /**
   * Find similar tours based on content
   */
  findSimilar(targetTour, allTours, limit = 5) {
    const similarities = allTours
      .filter(t => t.id !== targetTour.id)
      .map(tour => ({
        tour,
        similarity: this.calculateSimilarity(targetTour, tour)
      }));

    similarities.sort((a, b) => b.similarity - a.similarity);
    return similarities.slice(0, limit).map(s => s.tour);
  }

  /**
   * Calculate similarity between two tours
   */
  calculateSimilarity(tour1, tour2) {
    let similarity = 0;

    // Category match
    if (tour1.category === tour2.category) similarity += 40;

    // Destination match
    if (tour1.destination === tour2.destination) similarity += 30;

    // Price similarity
    const priceDiff = Math.abs((tour1.price_adult || 0) - (tour2.price_adult || 0));
    similarity += Math.max(0, 20 - priceDiff / 5);

    // Rating similarity
    const ratingDiff = Math.abs((tour1.rating || 0) - (tour2.rating || 0));
    similarity += Math.max(0, 10 - ratingDiff * 2);

    return similarity;
  }

  /**
   * Get trending tours based on recent bookings
   */
  async getTrending(tours, days = 7) {
    try {
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - days);

      const { data: recentBookings } = await supabase
        .from('bookings')
        .select('tour_id')
        .gte('created_at', dateThreshold.toISOString());

      // Count bookings per tour
      const bookingCounts = new Map();
      recentBookings?.forEach(booking => {
        const count = bookingCounts.get(booking.tour_id) || 0;
        bookingCounts.set(booking.tour_id, count + 1);
      });

      // Score tours
      const scored = tours.map(tour => ({
        tour,
        score: (bookingCounts.get(tour.id) || 0) * 10 + (tour.rating || 0) * 5
      }));

      scored.sort((a, b) => b.score - a.score);
      return scored.slice(0, 10).map(s => s.tour);
    } catch (error) {
      console.error('Error getting trending tours:', error);
      return this.getPopularTours(tours);
    }
  }
}

module.exports = SmartRecommendations;
