/**
 * Comprehensive AI Features Test
 * Tests all AI/ML services
 * Run: node test-ai-features.js
 */

require('dotenv').config();

const LangChainTravelAgent = require('./src/services/langchainAgent');
const SemanticSearch = require('./src/services/semanticSearch');
const SentimentAnalyzer = require('./src/services/sentimentAnalysis');
const SmartRecommendations = require('./src/services/smartRecommendations');

// Mock tour data for testing
const mockTours = [
  {
    id: '1',
    title: 'London Eye Fast Track',
    description: 'Skip the line and enjoy panoramic views of London',
    category: 'Attractions',
    destination: 'London',
    price_adult: 35,
    rating: 4.5,
    review_count: 1250,
    duration_hours: 1
  },
  {
    id: '2',
    title: 'Tower of London Tour',
    description: 'Explore the historic Tower and see the Crown Jewels',
    category: 'Cultural',
    destination: 'London',
    price_adult: 34,
    rating: 4.7,
    review_count: 2100,
    duration_hours: 3
  },
  {
    id: '3',
    title: 'Harry Potter Studio Tour',
    description: 'Behind the scenes of Harry Potter films',
    category: 'Entertainment',
    destination: 'London',
    price_adult: 95,
    rating: 4.9,
    review_count: 5000,
    duration_hours: 4
  }
];

const mockReviews = [
  { text: 'Amazing experience! Highly recommend this tour.' },
  { text: 'Terrible waste of money. Very disappointing.' },
  { text: 'It was okay, nothing special but not bad either.' },
  { text: 'Absolutely loved it! Best tour ever!' },
  { text: 'Not worth the price. Overrated and crowded.' }
];

async function testLangChainAgent() {
  console.log('\n🤖 Testing LangChain Agent...\n');
  
  try {
    const agent = new LangChainTravelAgent();
    
    const response = await agent.chat('test-user', 'I want to visit Paris for 3 days');
    console.log('✅ LangChain Agent Response:');
    console.log(response.substring(0, 200) + '...\n');
    
    return true;
  } catch (error) {
    console.error('❌ LangChain Agent Failed:', error.message);
    return false;
  }
}

async function testSemanticSearch() {
  console.log('\n🔍 Testing Semantic Search...\n');
  
  try {
    const search = new SemanticSearch();
    
    const results = await search.search('historic attractions', mockTours);
    console.log('✅ Search Results:', results.length, 'tours found');
    console.log('Top result:', results[0]?.title);
    
    const similar = search.findSimilar(mockTours[0], mockTours, 2);
    console.log('✅ Similar Tours:', similar.length, 'found');
    console.log('Similar to:', mockTours[0].title);
    console.log('Results:', similar.map(t => t.title).join(', '));
    
    return true;
  } catch (error) {
    console.error('❌ Semantic Search Failed:', error.message);
    return false;
  }
}

async function testSentimentAnalysis() {
  console.log('\n😊 Testing Sentiment Analysis...\n');
  
  try {
    const analyzer = new SentimentAnalyzer();
    
    const analysis = await analyzer.analyzeBulk(mockReviews);
    console.log('✅ Sentiment Analysis Complete');
    console.log('Summary:', {
      positive: analysis.summary.positive,
      negative: analysis.summary.negative,
      neutral: analysis.summary.neutral,
      positivePercentage: analysis.summary.positivePercentage.toFixed(1) + '%'
    });
    
    return true;
  } catch (error) {
    console.error('❌ Sentiment Analysis Failed:', error.message);
    return false;
  }
}

async function testSmartRecommendations() {
  console.log('\n⭐ Testing Smart Recommendations...\n');
  
  try {
    const recommender = new SmartRecommendations();
    
    // Test with mock user history
    const mockHistory = {
      preferredCategories: ['Cultural', 'Attractions'],
      avgSpend: 50,
      visitedDestinations: ['London'],
      totalBookings: 5,
      preferredDuration: 'medium'
    };
    
    const scored = mockTours.map(tour => ({
      tour: tour.title,
      score: recommender.calculateScore(tour, mockHistory)
    }));
    
    console.log('✅ Recommendation Scores:');
    scored.forEach(item => {
      console.log(`  ${item.tour}: ${item.score.toFixed(1)} points`);
    });
    
    const similar = recommender.findSimilar(mockTours[0], mockTours, 2);
    console.log('\n✅ Similar Tours Found:', similar.length);
    
    return true;
  } catch (error) {
    console.error('❌ Smart Recommendations Failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting AI/ML Features Test Suite\n');
  console.log('='.repeat(60));
  
  const results = {
    langchain: await testLangChainAgent(),
    search: await testSemanticSearch(),
    sentiment: await testSentimentAnalysis(),
    recommendations: await testSmartRecommendations()
  };
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Test Results Summary:\n');
  
  Object.entries(results).forEach(([test, passed]) => {
    const icon = passed ? '✅' : '❌';
    console.log(`${icon} ${test.charAt(0).toUpperCase() + test.slice(1)}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  const allPassed = Object.values(results).every(r => r);
  
  console.log('\n' + '='.repeat(60));
  console.log(allPassed ? '\n🎉 All tests passed!' : '\n⚠️  Some tests failed');
  console.log('\n💡 Next steps:');
  console.log('  1. Add HUGGINGFACE_API_KEY to .env for enhanced features');
  console.log('  2. Test API endpoints: node backend/server.js');
  console.log('  3. Try: curl -X POST http://localhost:5000/api/ai/chat \\');
  console.log('          -H "Content-Type: application/json" \\');
  console.log('          -d \'{"message": "Plan a trip to London"}\'');
  
  process.exit(allPassed ? 0 : 1);
}

runAllTests();
