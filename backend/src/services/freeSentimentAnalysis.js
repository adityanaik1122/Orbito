/**
 * FREE Sentiment Analysis Service
 * Uses Natural NLP library - no API costs!
 * 
 * Installation: npm install natural
 */

const natural = require('natural');
const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
const tokenizer = new natural.WordTokenizer();

class FreeSentimentAnalyzer {
  /**
   * Analyze sentiment of a single review
   * @param {string} reviewText - Review text to analyze
   * @returns {Object} Sentiment analysis result
   */
  analyzeReview(reviewText) {
    // Tokenize
    const tokens = tokenizer.tokenize(reviewText.toLowerCase());
    
    // Analyze sentiment (-5 to +5 scale)
    const score = analyzer.getSentiment(tokens);
    
    // Convert to label and confidence
    let sentiment, confidence;
    if (score > 0.1) {
      sentiment = 'POSITIVE';
      confidence = Math.min(Math.abs(score), 1);
    } else if (score < -0.1) {
      sentiment = 'NEGATIVE';
      confidence = Math.min(Math.abs(score), 1);
    } else {
      sentiment = 'NEUTRAL';
      confidence = 0.5;
    }
    
    return {
      sentiment,
      score,
      confidence: Math.round(confidence * 100) / 100,
      text: reviewText
    };
  }

  /**
   * Analyze multiple reviews at once
   * @param {Array} reviews - Array of review objects with 'text' property
   * @returns {Object} Bulk analysis results with summary
   */
  analyzeBulk(reviews) {
    const results = reviews.map(review => 
      this.analyzeReview(review.text || review)
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
        positivePercentage: Math.round((positive / reviews.length) * 100),
        negativePercentage: Math.round((negative / reviews.length) * 100),
        averageScore: results.reduce((sum, r) => sum + r.score, 0) / results.length
      }
    };
  }

  /**
   * Get overall sentiment for a tour based on all reviews
   * @param {Array} reviews - All reviews for a tour
   * @returns {Object} Overall sentiment summary
   */
  getTourSentiment(reviews) {
    const analysis = this.analyzeBulk(reviews);
    
    let overallSentiment;
    if (analysis.summary.positivePercentage >= 60) {
      overallSentiment = 'HIGHLY_POSITIVE';
    } else if (analysis.summary.positivePercentage >= 40) {
      overallSentiment = 'POSITIVE';
    } else if (analysis.summary.negativePercentage >= 40) {
      overallSentiment = 'NEGATIVE';
    } else {
      overallSentiment = 'MIXED';
    }
    
    return {
      ...analysis.summary,
      overallSentiment,
      recommendation: overallSentiment.includes('POSITIVE') 
        ? 'Highly recommended by travelers' 
        : 'Mixed reviews - read carefully'
    };
  }
}

module.exports = FreeSentimentAnalyzer;
