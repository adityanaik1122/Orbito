/**
 * Sentiment Analysis Service
 * Analyzes review sentiment using Hugging Face or local NLP
 */

const { HfInference } = require('@huggingface/inference');

class SentimentAnalyzer {
  constructor() {
    this.hf = process.env.HUGGINGFACE_API_KEY 
      ? new HfInference(process.env.HUGGINGFACE_API_KEY)
      : null;
    
    if (!this.hf) {
      console.warn('⚠️  Hugging Face API key not set. Using local sentiment analysis.');
    }
  }

  /**
   * Analyze sentiment of a review
   * @param {string} reviewText - Review text to analyze
   * @returns {Promise<Object>} Sentiment result
   */
  async analyzeReview(reviewText) {
    if (!this.hf) {
      return this.localSentimentAnalysis(reviewText);
    }

    try {
      const result = await this.hf.textClassification({
        model: 'distilbert-base-uncased-finetuned-sst-2-english',
        inputs: reviewText,
      });

      return {
        sentiment: result[0].label, // POSITIVE or NEGATIVE
        confidence: result[0].score,
        text: reviewText
      };
    } catch (error) {
      console.error('Hugging Face sentiment analysis error:', error);
      return this.localSentimentAnalysis(reviewText);
    }
  }

  /**
   * Analyze multiple reviews
   * @param {Array} reviews - Array of review objects with 'text' property
   * @returns {Promise<Object>} Aggregated sentiment analysis
   */
  async analyzeBulk(reviews) {
    const results = await Promise.all(
      reviews.map(review => this.analyzeReview(review.text || review))
    );

    const positive = results.filter(r => r.sentiment === 'POSITIVE').length;
    const negative = results.filter(r => r.sentiment === 'NEGATIVE').length;
    const neutral = results.filter(r => r.sentiment === 'NEUTRAL').length;

    return {
      results,
      summary: {
        positive,
        negative,
        neutral,
        total: reviews.length,
        positivePercentage: (positive / reviews.length) * 100,
        averageConfidence: results.reduce((sum, r) => sum + r.confidence, 0) / results.length
      }
    };
  }

  /**
   * Local sentiment analysis using keyword matching
   * Fallback when Hugging Face is not available
   */
  localSentimentAnalysis(text) {
    const textLower = text.toLowerCase();

    // Positive keywords
    const positiveWords = [
      'amazing', 'excellent', 'great', 'wonderful', 'fantastic', 'awesome',
      'love', 'loved', 'perfect', 'best', 'beautiful', 'incredible',
      'highly recommend', 'must see', 'worth it', 'enjoyed', 'fun'
    ];

    // Negative keywords
    const negativeWords = [
      'terrible', 'awful', 'bad', 'worst', 'horrible', 'disappointing',
      'waste', 'poor', 'not worth', 'avoid', 'overpriced', 'crowded',
      'boring', 'disappointing', 'regret'
    ];

    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach(word => {
      if (textLower.includes(word)) positiveCount++;
    });

    negativeWords.forEach(word => {
      if (textLower.includes(word)) negativeCount++;
    });

    let sentiment, confidence;

    if (positiveCount > negativeCount) {
      sentiment = 'POSITIVE';
      confidence = Math.min(0.6 + (positiveCount * 0.1), 0.95);
    } else if (negativeCount > positiveCount) {
      sentiment = 'NEGATIVE';
      confidence = Math.min(0.6 + (negativeCount * 0.1), 0.95);
    } else {
      sentiment = 'NEUTRAL';
      confidence = 0.5;
    }

    return {
      sentiment,
      confidence,
      text,
      method: 'local'
    };
  }

  /**
   * Get sentiment summary for a tour based on reviews
   */
  async getTourSentiment(tourId, reviews) {
    const analysis = await this.analyzeBulk(reviews);
    
    return {
      tourId,
      overallSentiment: analysis.summary.positivePercentage > 60 ? 'POSITIVE' : 
                       analysis.summary.positivePercentage < 40 ? 'NEGATIVE' : 'NEUTRAL',
      ...analysis.summary
    };
  }
}

module.exports = SentimentAnalyzer;
