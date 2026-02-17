/**
 * AI Tour Matching Service
 * 
 * Combines Groq AI with real tour provider data to:
 * 1. Generate personalized itineraries with AI
 * 2. Match AI suggestions with real bookable tours
 * 3. Enrich itineraries with booking links and real-time pricing
 */

const { generateContent, GROQ_MODELS } = require('../config/groq');
const TourAggregatorService = require('./tourAggregatorService');

class AITourMatchingService {
  /**
   * Generate itinerary with real bookable tours
   * @param {Object} params - Generation parameters
   * @returns {Promise<Object>} Itinerary with matched tours
   */
  static async generateItineraryWithTours(params) {
    const { destination, startDate, endDate, preferences, budget } = params;
    
    const daysCount = Math.ceil(
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
    ) + 1;

    // Step 1: Fetch available tours for the destination
    console.log(`🔍 Fetching tours for ${destination}...`);
    const availableTours = await this._fetchDestinationTours(destination);
    console.log(`📦 Found ${availableTours.length} tours`);

    // Step 2: Generate AI itinerary with tour context
    console.log(`🤖 Generating AI itinerary...`);
    const aiItinerary = await this._generateAIItinerary({
      destination,
      daysCount,
      startDate,
      preferences,
      budget,
      availableTours: this._summarizeTours(availableTours)
    });

    // Step 3: Match AI suggestions with real tours
    console.log(`🔗 Matching activities with bookable tours...`);
    const enrichedItinerary = await this._matchToursToActivities(
      aiItinerary,
      availableTours
    );

    return enrichedItinerary;
  }

  /**
   * Suggest tours for a specific activity
   * @param {Object} activity - Activity details
   * @param {string} destination - Destination
   * @returns {Promise<Array>} Matching tours
   */
  static async suggestToursForActivity(activity, destination) {
    const tours = await TourAggregatorService.searchAllProviders({
      destination,
      category: this._mapActivityTypeToCategory(activity.type)
    });

    // Use AI to rank tours by relevance
    const rankedTours = await this._rankToursByRelevance(activity, tours);
    
    return rankedTours.slice(0, 3); // Return top 3 matches
  }

  /**
   * Fetch tours from all providers for a destination
   */
  static async _fetchDestinationTours(destination) {
    try {
      const tours = await TourAggregatorService.searchAllProviders({
        destination,
        sortBy: 'rating'
      });
      return tours;
    } catch (error) {
      console.error('Error fetching tours:', error);
      return [];
    }
  }

  /**
   * Create a summary of available tours for AI context
   */
  static _summarizeTours(tours) {
    if (!tours.length) return 'No pre-booked tours available.';

    const summary = tours.slice(0, 20).map(t => ({
      id: t.external_id,
      name: t.title,
      category: t.category,
      price: `${t.currency || '£'}${t.price_adult}`,
      duration: t.duration,
      rating: t.rating,
      highlights: t.highlights?.slice(0, 2) || []
    }));

    return JSON.stringify(summary, null, 2);
  }

  /**
   * Generate AI itinerary with tour context
   */
  static async _generateAIItinerary(params) {
    const { destination, daysCount, startDate, preferences, budget, availableTours } = params;

    const prompt = `You are a travel planning AI. Create a detailed ${daysCount}-day itinerary for ${destination} starting from ${startDate}.

USER PREFERENCES: ${preferences || 'General sightseeing'}
BUDGET: ${budget || 'Moderate'}

AVAILABLE BOOKABLE TOURS (prioritize these when relevant):
${availableTours}

IMPORTANT RULES:
1. Mix free activities with bookable tours
2. Include realistic local prices in appropriate currency
3. For activities matching available tours, use the exact tour name and ID
4. Include a mix of: attractions, dining, culture, leisure
5. Consider logical routing between locations
6. Include morning, afternoon, and evening activities

Return ONLY valid JSON in this exact format:
{
  "destination": "${destination}",
  "summary": "Brief trip summary",
  "totalEstimatedCost": "£XXX-£XXX",
  "days": [
    {
      "dayNumber": 1,
      "date": "YYYY-MM-DD",
      "theme": "Day theme",
      "items": [
        {
          "name": "Activity Name",
          "type": "attraction|tour|restaurant|transport|leisure",
          "location": "Address/Area",
          "time": "09:00",
          "endTime": "11:00",
          "duration": "2h",
          "cost": "£25",
          "matchedTourId": "PT-001 or null if not a bookable tour",
          "bookable": true/false,
          "notes": "Helpful tip",
          "coordinates": [lat, lng] or null
        }
      ]
    }
  ],
  "tips": ["Travel tip 1", "Travel tip 2"]
}`;

    const modelNames = [GROQ_MODELS.LLAMA_70B, GROQ_MODELS.LLAMA_8B, GROQ_MODELS.MIXTRAL];
    let responseText;

    for (const modelName of modelNames) {
      try {
        console.log(`🤖 Trying ${modelName}...`);
        responseText = await generateContent(prompt, modelName);
        console.log(`✅ Successfully used ${modelName}`);
        break;
      } catch (e) {
        console.warn(`❌ ${modelName} failed:`, e.message);
      }
    }

    if (!responseText) {
      throw new Error('Failed to generate itinerary with AI');
    }

    // Clean and parse JSON
    const cleaned = responseText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.log('Raw response:', cleaned.substring(0, 500));
      throw new Error('Failed to parse AI response');
    }
  }

  /**
   * Match AI-generated activities with real bookable tours
   */
  static async _matchToursToActivities(itinerary, availableTours) {
    const tourMap = new Map(
      availableTours.map(t => [t.external_id, t])
    );

    // Enrich each day's activities
    const enrichedDays = itinerary.days.map(day => ({
      ...day,
      items: day.items.map(item => {
        // If AI matched a tour ID, add full tour details
        if (item.matchedTourId && tourMap.has(item.matchedTourId)) {
          const tour = tourMap.get(item.matchedTourId);
          return {
            ...item,
            bookable: true,
            tour: {
              id: tour.external_id,
              title: tour.title,
              provider: tour.provider || 'premium-tours',
              price: tour.price_adult,
              currency: tour.currency || 'GBP',
              rating: tour.rating,
              reviewCount: tour.review_count,
              image: tour.main_image,
              duration: tour.duration,
              instantConfirmation: tour.instant_confirmation,
              cancellationPolicy: tour.cancellation_policy,
              highlights: tour.highlights?.slice(0, 3),
              bookingUrl: this._generateBookingUrl(tour)
            }
          };
        }

        // Try to find a matching tour by name similarity
        if (!item.bookable && item.type !== 'restaurant' && item.type !== 'transport') {
          const matchedTour = this._findSimilarTour(item.name, availableTours);
          if (matchedTour) {
            return {
              ...item,
              bookable: true,
              suggestedTour: {
                id: matchedTour.external_id,
                title: matchedTour.title,
                provider: matchedTour.provider || 'premium-tours',
                price: matchedTour.price_adult,
                currency: matchedTour.currency || 'GBP',
                rating: matchedTour.rating,
                image: matchedTour.main_image,
                bookingUrl: this._generateBookingUrl(matchedTour)
              }
            };
          }
        }

        return item;
      })
    }));

    return {
      ...itinerary,
      days: enrichedDays,
      bookableTourCount: this._countBookableTours(enrichedDays),
      totalSavingsWithBooking: this._calculatePotentialSavings(enrichedDays)
    };
  }

  /**
   * Find a tour with similar name
   */
  static _findSimilarTour(activityName, tours) {
    const normalized = activityName.toLowerCase();
    
    // Keywords to match
    const keywords = normalized.split(/\s+/).filter(w => w.length > 3);
    
    let bestMatch = null;
    let bestScore = 0;

    for (const tour of tours) {
      const tourName = tour.title.toLowerCase();
      let score = 0;

      // Check keyword matches
      for (const keyword of keywords) {
        if (tourName.includes(keyword)) {
          score += 2;
        }
      }

      // Bonus for destination match
      if (tour.destination && normalized.includes(tour.destination.toLowerCase())) {
        score += 1;
      }

      // Bonus for category match
      if (normalized.includes('eye') && tourName.includes('eye')) score += 3;
      if (normalized.includes('tower') && tourName.includes('tower')) score += 3;
      if (normalized.includes('cruise') && tourName.includes('cruise')) score += 3;
      if (normalized.includes('harry potter') && tourName.includes('harry potter')) score += 5;
      if (normalized.includes('stonehenge') && tourName.includes('stonehenge')) score += 5;

      if (score > bestScore && score >= 2) {
        bestScore = score;
        bestMatch = tour;
      }
    }

    return bestMatch;
  }

  /**
   * Rank tours by relevance to an activity using AI
   */
  static async _rankToursByRelevance(activity, tours) {
    if (!tours.length) return [];

    // Simple relevance scoring without AI call
    return tours.sort((a, b) => {
      let scoreA = a.rating * 10 + (a.review_count / 100);
      let scoreB = b.rating * 10 + (b.review_count / 100);

      // Boost if title matches activity
      if (a.title.toLowerCase().includes(activity.name.toLowerCase())) scoreA += 50;
      if (b.title.toLowerCase().includes(activity.name.toLowerCase())) scoreB += 50;

      return scoreB - scoreA;
    });
  }

  /**
   * Map activity type to tour category
   */
  static _mapActivityTypeToCategory(type) {
    const mapping = {
      'attraction': 'Attractions',
      'tour': 'Sightseeing',
      'museum': 'Cultural',
      'show': 'Entertainment',
      'food': 'Dining',
      'adventure': 'Adventure',
      'nature': 'Nature'
    };
    return mapping[type] || null;
  }

  /**
   * Generate booking URL for a tour
   */
  static _generateBookingUrl(tour) {
    const provider = tour.provider || 'premium-tours';
    
    switch (provider) {
      case 'viator':
        return `https://www.viator.com/tours/${tour.external_id}`;
      case 'getyourguide':
        return `https://www.getyourguide.com/activity/${tour.external_id}`;
      default:
        // Internal booking
        return `/tours/${tour.slug || tour.external_id}`;
    }
  }

  /**
   * Count bookable tours in itinerary
   */
  static _countBookableTours(days) {
    return days.reduce((count, day) => {
      return count + day.items.filter(item => item.bookable || item.tour || item.suggestedTour).length;
    }, 0);
  }

  /**
   * Calculate potential savings with bundled booking
   */
  static _calculatePotentialSavings(days) {
    // Mock calculation - in reality, compare individual vs bundle prices
    const bookableItems = days.flatMap(d => d.items).filter(i => i.tour || i.suggestedTour);
    if (bookableItems.length >= 3) {
      return '10-15%';
    }
    return null;
  }

  /**
   * Get personalized tour recommendations based on user history
   */
  static async getPersonalizedRecommendations(userId, destination) {
    // TODO: Implement user preference learning
    // For now, return top-rated tours
    const tours = await TourAggregatorService.searchAllProviders({
      destination,
      sortBy: 'rating'
    });

    return tours.slice(0, 6);
  }
}

module.exports = AITourMatchingService;
