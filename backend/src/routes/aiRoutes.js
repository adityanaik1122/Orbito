const express = require('express');
const { suggestActivities } = require('../controllers/aiController');
const LangChainTravelAgent = require('../services/langchainAgent');
const SemanticSearch = require('../services/semanticSearch');
const SentimentAnalyzer = require('../services/sentimentAnalysis');
const SmartRecommendations = require('../services/smartRecommendations');

const router = express.Router();

// Initialize services
const agent = new LangChainTravelAgent();
const semanticSearch = new SemanticSearch();
const sentimentAnalyzer = new SentimentAnalyzer();
const recommendations = new SmartRecommendations();

// Existing route
router.post('/ai-suggest', suggestActivities);

// LangChain Chat Agent
router.post('/chat', async (req, res) => {
  try {
    const { userId, message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const response = await agent.chat(userId || 'anonymous', message);
    
    res.json({ 
      success: true,
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process message' 
    });
  }
});

// Clear chat memory
router.post('/chat/clear', (req, res) => {
  agent.clearMemory();
  res.json({ success: true, message: 'Memory cleared' });
});

// Get chat history
router.get('/chat/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const history = agent.getHistory(userId || 'anonymous');
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Semantic Search
router.post('/search', async (req, res) => {
  try {
    const { query, tours } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    // If tours not provided, fetch from database
    let tourList = tours;
    if (!tourList) {
      const { supabase } = require('../config/supabase');
      const { data } = await supabase.from('tours').select('*').limit(100);
      tourList = data || [];
    }
    
    const results = await semanticSearch.search(query, tourList);
    res.json({ success: true, tours: results, count: results.length });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Find Similar Tours
router.post('/similar', async (req, res) => {
  try {
    const { tourId, limit } = req.body;
    
    if (!tourId) {
      return res.status(400).json({ error: 'Tour ID is required' });
    }
    
    const { supabase } = require('../config/supabase');
    
    // Get reference tour
    const { data: tour } = await supabase
      .from('tours')
      .select('*')
      .eq('id', tourId)
      .single();
    
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    
    // Get all tours
    const { data: allTours } = await supabase.from('tours').select('*');
    
    const similar = semanticSearch.findSimilar(tour, allTours || [], limit || 5);
    res.json({ success: true, tours: similar });
  } catch (error) {
    console.error('Similar tours error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Sentiment Analysis
router.post('/sentiment', async (req, res) => {
  try {
    const { reviews } = req.body;
    
    if (!reviews || !Array.isArray(reviews)) {
      return res.status(400).json({ error: 'Reviews array is required' });
    }
    
    const analysis = await sentimentAnalyzer.analyzeBulk(reviews);
    res.json({ success: true, analysis });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Analyze single review
router.post('/sentiment/single', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Review text is required' });
    }
    
    const result = await sentimentAnalyzer.analyzeReview(text);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Personalized Recommendations
router.get('/recommendations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit } = req.query;
    
    const { supabase } = require('../config/supabase');
    const { data: tours } = await supabase.from('tours').select('*');
    
    const recommended = await recommendations.getPersonalized(userId, tours || []);
    const limited = limit ? recommended.slice(0, parseInt(limit)) : recommended;
    
    res.json({ success: true, tours: limited, count: limited.length });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Trending Tours
router.get('/trending', async (req, res) => {
  try {
    const { days } = req.query;
    
    const { supabase } = require('../config/supabase');
    const { data: tours } = await supabase.from('tours').select('*');
    
    const trending = await recommendations.getTrending(tours || [], parseInt(days) || 7);
    res.json({ success: true, tours: trending, count: trending.length });
  } catch (error) {
    console.error('Trending tours error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
