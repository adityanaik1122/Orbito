/**
 * Semantic Search Service
 * Provides intelligent tour search using embeddings and similarity
 */

const { HfInference } = require('@huggingface/inference');

class SemanticSearch {
  constructor() {
    this.hf = process.env.HUGGINGFACE_API_KEY 
      ? new HfInference(process.env.HUGGINGFACE_API_KEY)
      : null;
    
    if (!this.hf) {
      console.warn('⚠️  Hugging Face API key not set. Using fallback text search.');
    }
  }

  /**
   * Search tours using semantic similarity
   * @param {string} query - Search query
   * @param {Array} tours - Array of tour objects
   * @returns {Promise<Array>} Ranked search results
   */
  async search(query, tours) {
    if (!this.hf) {
      return this.fallbackSearch(query, tours);
    }

    try {
      // For now, use enhanced text matching
      // TODO: Implement full embedding-based search when needed
      return this.enhancedTextSearch(query, tours);
    } catch (error) {
      console.error('Semantic search error:', error);
      return this.fallbackSearch(query, tours);
    }
  }

  /**
   * Enhanced text search with scoring
   */
  enhancedTextSearch(query, tours) {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/);

    const scored = tours.map(tour => {
      let score = 0;
      const tourText = `${tour.title} ${tour.description || ''} ${tour.category || ''}`.toLowerCase();

      // Exact phrase match
      if (tourText.includes(queryLower)) {
        score += 50;
      }

      // Word matches
      queryWords.forEach(word => {
        if (tourText.includes(word)) {
          score += 10;
        }
      });

      // Title match bonus
      if (tour.title.toLowerCase().includes(queryLower)) {
        score += 30;
      }

      // Category match
      if (tour.category?.toLowerCase().includes(queryLower)) {
        score += 20;
      }

      // Rating boost
      score += (tour.rating || 0) * 2;

      // Review count boost
      score += Math.log(tour.review_count + 1);

      return { tour, score };
    });

    // Filter and sort
    const results = scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map(item => item.tour);

    return results;
  }

  /**
   * Fallback to simple text search
   */
  fallbackSearch(query, tours) {
    const queryLower = query.toLowerCase();
    
    return tours.filter(tour => 
      tour.title?.toLowerCase().includes(queryLower) ||
      tour.description?.toLowerCase().includes(queryLower) ||
      tour.category?.toLowerCase().includes(queryLower)
    ).slice(0, 20);
  }

  /**
   * Find similar tours based on a reference tour
   */
  findSimilar(referenceTour, allTours, limit = 5) {
    const scored = allTours
      .filter(t => t.id !== referenceTour.id)
      .map(tour => ({
        tour,
        score: this.calculateSimilarity(referenceTour, tour)
      }));

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.tour);
  }

  /**
   * Calculate similarity score between two tours
   */
  calculateSimilarity(tour1, tour2) {
    let score = 0;

    // Category match
    if (tour1.category === tour2.category) score += 40;

    // Destination match
    if (tour1.destination === tour2.destination) score += 30;

    // Price similarity
    const priceDiff = Math.abs((tour1.price_adult || 0) - (tour2.price_adult || 0));
    score += Math.max(0, 20 - priceDiff / 5);

    // Rating similarity
    const ratingDiff = Math.abs((tour1.rating || 0) - (tour2.rating || 0));
    score += Math.max(0, 10 - ratingDiff * 2);

    return score;
  }
}

module.exports = SemanticSearch;
