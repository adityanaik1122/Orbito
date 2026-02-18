/**
 * FREE Recommendation Engine
 * No API costs - runs locally!
 */

class FreeRecommendationEngine {
  /**
   * Get personalized tour recommendations
   */
  getPersonalizedTours(userId, tours, userHistory) {
    const scored = tours.map(tour => ({
      tour,
      score: this.calculateScore(tour, userHistory)
    }));
    
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 10).map(s => s.tour);
  }

  calculateScore(tour, history) {
    let score = tour.rating * 10;
    
    if (history.preferredCategories?.includes(tour.category)) score += 30;
    
    const avgPrice = history.avgSpend || 50;
    if (tour.price_adult <= avgPrice * 1.3 && tour.price_adult >= avgPrice * 0.5) {
      score += 20;
    }
    
    if (history.preferredDuration && tour.duration?.includes(history.preferredDuration)) {
      score += 15;
    }
    
    score += Math.log(tour.review_count + 1) * 2;
    
    if (history.visitedDestinations?.includes(tour.destination)) score += 10;
    
    return score;
  }

  findSimilarTours(targetTour, allTours, limit = 5) {
    const similarities = allTours
      .filter(t => t.id !== targetTour.id)
      .map(tour => ({
        tour,
        similarity: this.calculateSimilarity(targetTour, tour)
      }));
    
    similarities.sort((a, b) => b.similarity - a.similarity);
    return similarities.slice(0, limit).map(s => s.tour);
  }

  calculateSimilarity(tour1, tour2) {
    let similarity = 0;
    if (tour1.category === tour2.category) similarity += 40;
    if (tour1.destination === tour2.destination) similarity += 30;
    
    const priceDiff = Math.abs(tour1.price_adult - tour2.price_adult);
    similarity += Math.max(0, 20 - priceDiff / 5);
    
    const ratingDiff = Math.abs(tour1.rating - tour2.rating);
    similarity += Math.max(0, 10 - ratingDiff * 2);
    
    return similarity;
  }

  getTrendingTours(tours, recentBookings) {
    const bookingCounts = new Map();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    recentBookings
      .filter(b => new Date(b.created_at) > weekAgo)
      .forEach(booking => {
        const count = bookingCounts.get(booking.tour_id) || 0;
        bookingCounts.set(booking.tour_id, count + 1);
      });
    
    const scored = tours.map(tour => ({
      tour,
      bookings: bookingCounts.get(tour.id) || 0,
      score: (bookingCounts.get(tour.id) || 0) * 10 + tour.rating * 5
    }));
    
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 10).map(s => s.tour);
  }
}

module.exports = FreeRecommendationEngine;
