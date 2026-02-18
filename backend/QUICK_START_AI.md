# Quick Start: AI/ML Integration

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
cd backend

# LangChain for AI agents
npm install langchain @langchain/groq @langchain/core

# Hugging Face for ML models
npm install @huggingface/inference

# Optional: For advanced features
npm install @langchain/community faiss-node
```

### Step 2: Add API Keys

Add to `backend/.env`:

```env
# Already have this
GROQ_API_KEY=your_groq_key

# Add this (get free key from huggingface.co)
HUGGINGFACE_API_KEY=hf_your_key_here
```

### Step 3: Test LangChain Agent

Create `backend/test-langchain.js`:

```javascript
const LangChainTravelAgent = require('./src/services/langchainAgent');

async function test() {
  const agent = new LangChainTravelAgent();
  
  console.log('🤖 Testing LangChain Agent...\n');
  
  // Test conversation with memory
  const response1 = await agent.chat('user-123', 'I want to visit London for 3 days');
  console.log('User: I want to visit London for 3 days');
  console.log('Agent:', response1, '\n');
  
  const response2 = await agent.chat('user-123', 'What are the must-see attractions?');
  console.log('User: What are the must-see attractions?');
  console.log('Agent:', response2, '\n');
  
  const response3 = await agent.chat('user-123', 'How much should I budget?');
  console.log('User: How much should I budget?');
  console.log('Agent:', response3);
}

test().catch(console.error);
```

Run it:
```bash
node test-langchain.js
```

### Step 4: Add API Endpoint

Update `backend/src/routes/aiRoutes.js`:

```javascript
const express = require('express');
const router = express.Router();
const LangChainTravelAgent = require('../services/langchainAgent');

// Create agent instance
const agent = new LangChainTravelAgent();

// Chat endpoint
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

// Clear memory endpoint
router.post('/chat/clear', (req, res) => {
  agent.clearMemory();
  res.json({ success: true, message: 'Memory cleared' });
});

module.exports = router;
```

Register in `backend/src/routes/index.js`:

```javascript
const aiRoutes = require('./aiRoutes');
router.use('/ai', aiRoutes);
```

### Step 5: Test API

```bash
# Start server
npm start

# Test in another terminal
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"userId": "test-user", "message": "Plan a 3-day trip to Paris"}'
```

---

## 🎯 Quick Wins

### 1. Semantic Search (15 minutes)

```javascript
// backend/src/services/semanticSearch.js
const { HfInference } = require('@huggingface/inference');

class SemanticSearch {
  constructor() {
    this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
  }

  async search(query, tours) {
    // Generate query embedding
    const queryEmbed = await this.hf.featureExtraction({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      inputs: query,
    });

    // Simple text matching for now (upgrade to embeddings later)
    const results = tours.filter(tour => 
      tour.title.toLowerCase().includes(query.toLowerCase()) ||
      tour.description?.toLowerCase().includes(query.toLowerCase())
    );

    return results.slice(0, 10);
  }
}

module.exports = SemanticSearch;
```

### 2. Sentiment Analysis (10 minutes)

```javascript
// backend/src/services/sentimentAnalysis.js
const { HfInference } = require('@huggingface/inference');

class SentimentAnalyzer {
  constructor() {
    this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
  }

  async analyzeReview(reviewText) {
    const result = await this.hf.textClassification({
      model: 'distilbert-base-uncased-finetuned-sst-2-english',
      inputs: reviewText,
    });

    return {
      sentiment: result[0].label, // POSITIVE or NEGATIVE
      confidence: result[0].score,
    };
  }
}

module.exports = SentimentAnalyzer;
```

### 3. Smart Recommendations (20 minutes)

```javascript
// backend/src/services/smartRecommendations.js

class SmartRecommendations {
  async getPersonalized(userId, tours) {
    // Get user history
    const history = await this.getUserHistory(userId);
    
    // Score tours
    const scored = tours.map(tour => ({
      tour,
      score: this.calculateScore(tour, history),
    }));

    // Sort and return top 10
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 10).map(s => s.tour);
  }

  calculateScore(tour, history) {
    let score = tour.rating * 10;
    
    // Boost if matches user preferences
    if (history.preferredCategories?.includes(tour.category)) {
      score += 20;
    }
    
    // Boost if in price range
    if (tour.price_adult <= history.avgSpend * 1.2) {
      score += 15;
    }
    
    return score;
  }

  async getUserHistory(userId) {
    // Query from database
    return {
      preferredCategories: ['Cultural', 'Attractions'],
      avgSpend: 50,
    };
  }
}

module.exports = SmartRecommendations;
```

---

## 📊 What You Get

### With LangChain:
✅ Conversational AI with memory  
✅ Context-aware responses  
✅ Easy to extend with tools  
✅ Better than simple prompts  

### With Hugging Face:
✅ Sentiment analysis on reviews  
✅ Semantic search (better than keyword)  
✅ Image classification  
✅ Text summarization  

### With ML Features:
✅ Personalized recommendations  
✅ Price predictions  
✅ User segmentation  
✅ Demand forecasting  

---

## 🎓 Learning Path

**Week 1: Basics**
- [ ] Set up LangChain agent
- [ ] Test conversational AI
- [ ] Add to frontend

**Week 2: Enhancements**
- [ ] Add semantic search
- [ ] Implement sentiment analysis
- [ ] Build recommendation engine

**Week 3: Advanced**
- [ ] Multi-agent system
- [ ] RAG for tour knowledge
- [ ] Price prediction model

**Week 4: Production**
- [ ] Optimize performance
- [ ] Add caching
- [ ] Monitor metrics

---

## 💡 Pro Tips

1. **Start with LangChain** - Easiest to implement, biggest impact
2. **Cache Everything** - AI calls are expensive, cache aggressively
3. **Fallback Strategy** - Always have a non-AI fallback
4. **Monitor Costs** - Track API usage from day 1
5. **User Feedback** - Collect feedback to improve models

---

## 🆘 Troubleshooting

**Error: Module not found**
```bash
npm install langchain @langchain/groq @langchain/core
```

**Error: Invalid API key**
- Check GROQ_API_KEY in .env
- Get new key from console.groq.com

**Slow responses**
- Add caching layer
- Use smaller models for simple tasks
- Implement request queuing

---

## 📚 Resources

- Full guide: `docs/AI_ML_INTEGRATION_GUIDE.md`
- LangChain docs: https://js.langchain.com/docs/
- Hugging Face: https://huggingface.co/docs
- Groq: https://console.groq.com/docs

---

**Ready to build?** Start with the LangChain agent - it's the easiest and most impactful!
