# AI/ML Integration Guide for Orbito

## Overview
This guide shows how to integrate advanced AI/ML technologies into your Orbito travel platform:
- **LangChain**: For building sophisticated AI chains and agents
- **Agentic AI**: For autonomous travel planning agents
- **Hugging Face**: For custom ML models (sentiment analysis, embeddings, recommendations)
- **ML Features**: Personalization, price prediction, demand forecasting

## Current AI Stack
- ✅ Groq AI (LLaMA 70B, LLaMA 8B, Mixtral)
- ✅ AI Itinerary Generation
- ✅ Tour Matching Service
- ✅ Activity Suggestions

## Table of Contents
1. [LangChain Integration](#langchain-integration)
2. [Agentic AI System](#agentic-ai-system)
3. [Hugging Face Models](#hugging-face-models)
4. [ML Features](#ml-features)
5. [Implementation Roadmap](#implementation-roadmap)

---

## 1. LangChain Integration

### Why LangChain?
- Chain multiple AI operations together
- Memory management for conversations
- Tool integration (search, booking, weather APIs)
- Better prompt engineering
- RAG (Retrieval Augmented Generation) for tour knowledge base

### Installation

```bash
cd backend
npm install langchain @langchain/groq @langchain/community
npm install @langchain/openai  # Optional: for embeddings
npm install faiss-node  # For vector storage
```


### Use Case 1: Conversational Travel Agent with Memory

Create `backend/src/services/langchainTravelAgent.js`:

```javascript
const { ChatGroq } = require('@langchain/groq');
const { BufferMemory } = require('langchain/memory');
const { ConversationChain } = require('langchain/chains');
const { PromptTemplate } = require('@langchain/core/prompts');

class LangChainTravelAgent {
  constructor() {
    this.model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      modelName: 'llama-3.1-70b-versatile',
      temperature: 0.7,
    });

    this.memory = new BufferMemory({
      returnMessages: true,
      memoryKey: 'chat_history',
    });

    this.prompt = PromptTemplate.fromTemplate(`
You are an expert travel advisor for Orbito. Help users plan their trips.

Current conversation:
{chat_history}

User: {input}
Assistant:`);

    this.chain = new ConversationChain({
      llm: this.model,
      memory: this.memory,
      prompt: this.prompt,
    });
  }

  async chat(userId, message) {
    const response = await this.chain.call({ input: message });
    return response.response;
  }

  clearMemory() {
    this.memory.clear();
  }
}

module.exports = LangChainTravelAgent;
```


### Use Case 2: RAG for Tour Knowledge Base

```javascript
const { ChatGroq } = require('@langchain/groq');
const { MemoryVectorStore } = require('langchain/vectorstores/memory');
const { OpenAIEmbeddings } = require('@langchain/openai');
const { RetrievalQAChain } = require('langchain/chains');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');

class TourKnowledgeBase {
  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    this.vectorStore = null;
  }

  async indexTours(tours) {
    // Convert tours to documents
    const documents = tours.map(tour => ({
      pageContent: `${tour.title}. ${tour.description}. 
        Location: ${tour.destination}. 
        Price: ${tour.price_adult}. 
        Rating: ${tour.rating}/5. 
        Duration: ${tour.duration}. 
        Highlights: ${tour.highlights?.join(', ')}`,
      metadata: { 
        tourId: tour.external_id, 
        provider: tour.provider,
        category: tour.category 
      },
    }));

    // Split into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });
    const splitDocs = await splitter.splitDocuments(documents);

    // Create vector store
    this.vectorStore = await MemoryVectorStore.fromDocuments(
      splitDocs,
      this.embeddings
    );

    console.log(`✅ Indexed ${tours.length} tours into knowledge base`);
  }

  async searchSimilarTours(query, k = 5) {
    if (!this.vectorStore) {
      throw new Error('Knowledge base not initialized');
    }

    const results = await this.vectorStore.similaritySearch(query, k);
    return results.map(doc => doc.metadata.tourId);
  }

  async answerQuestion(question) {
    const model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      modelName: 'llama-3.1-70b-versatile',
    });

    const chain = RetrievalQAChain.fromLLM(
      model,
      this.vectorStore.asRetriever()
    );

    const response = await chain.call({ query: question });
    return response.text;
  }
}

module.exports = TourKnowledgeBase;
```


### Use Case 3: Multi-Step Agent with Tools

```javascript
const { ChatGroq } = require('@langchain/groq');
const { initializeAgentExecutorWithOptions } = require('langchain/agents');
const { DynamicTool } = require('@langchain/core/tools');
const TourAggregatorService = require('./tourAggregatorService');

class TravelPlanningAgent {
  constructor() {
    this.model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      modelName: 'llama-3.1-70b-versatile',
      temperature: 0,
    });

    this.tools = [
      new DynamicTool({
        name: 'search_tours',
        description: 'Search for tours in a destination. Input: destination name',
        func: async (destination) => {
          const tours = await TourAggregatorService.searchAllProviders({
            destination,
            sortBy: 'rating',
          });
          return JSON.stringify(tours.slice(0, 5).map(t => ({
            title: t.title,
            price: t.price_adult,
            rating: t.rating,
          })));
        },
      }),

      new DynamicTool({
        name: 'get_weather',
        description: 'Get weather forecast for a destination. Input: city name',
        func: async (city) => {
          // Integrate with weather API
          return `Weather in ${city}: Sunny, 22°C`;
        },
      }),

      new DynamicTool({
        name: 'calculate_budget',
        description: 'Calculate trip budget. Input: JSON with days, activities, accommodation',
        func: async (input) => {
          const data = JSON.parse(input);
          const total = (data.days * 100) + (data.activities * 50);
          return `Estimated budget: £${total}`;
        },
      }),
    ];
  }

  async execute(task) {
    const executor = await initializeAgentExecutorWithOptions(
      this.tools,
      this.model,
      {
        agentType: 'zero-shot-react-description',
        verbose: true,
      }
    );

    const result = await executor.call({ input: task });
    return result.output;
  }
}

module.exports = TravelPlanningAgent;
```

---

## 2. Agentic AI System

### Multi-Agent Architecture

Create specialized agents for different tasks:


```javascript
// backend/src/services/agenticAI/AgentOrchestrator.js

const { ChatGroq } = require('@langchain/groq');

class AgentOrchestrator {
  constructor() {
    this.agents = {
      planner: new ItineraryPlannerAgent(),
      researcher: new DestinationResearchAgent(),
      optimizer: new RouteOptimizerAgent(),
      budget: new BudgetAnalystAgent(),
      booking: new BookingAgent(),
    };
  }

  async planTrip(userRequest) {
    console.log('🤖 Starting multi-agent trip planning...');

    // Step 1: Research destination
    const research = await this.agents.researcher.research(userRequest.destination);

    // Step 2: Create initial itinerary
    const itinerary = await this.agents.planner.createItinerary({
      ...userRequest,
      research,
    });

    // Step 3: Optimize routes
    const optimized = await this.agents.optimizer.optimize(itinerary);

    // Step 4: Budget analysis
    const budgetAnalysis = await this.agents.budget.analyze(optimized, userRequest.budget);

    // Step 5: Find bookable tours
    const withBookings = await this.agents.booking.findBookings(optimized);

    return {
      itinerary: withBookings,
      budgetAnalysis,
      recommendations: research.recommendations,
    };
  }
}

// Individual Agent: Itinerary Planner
class ItineraryPlannerAgent {
  constructor() {
    this.model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      modelName: 'llama-3.1-70b-versatile',
    });
  }

  async createItinerary(params) {
    const prompt = `You are an expert itinerary planner. Create a ${params.days}-day itinerary for ${params.destination}.
    
Research context: ${JSON.stringify(params.research)}
User preferences: ${params.preferences}
Budget: ${params.budget}

Focus on: logical flow, time management, local experiences, hidden gems.
Return detailed JSON itinerary.`;

    const response = await this.model.call([{ role: 'user', content: prompt }]);
    return JSON.parse(response.content);
  }
}

// Individual Agent: Destination Researcher
class DestinationResearchAgent {
  async research(destination) {
    // Use web search, Wikipedia API, travel blogs
    return {
      bestTimeToVisit: 'April-October',
      mustSee: ['Attraction 1', 'Attraction 2'],
      localTips: ['Tip 1', 'Tip 2'],
      transportation: 'Tube, buses, walking',
      recommendations: [],
    };
  }
}

// Individual Agent: Route Optimizer
class RouteOptimizerAgent {
  async optimize(itinerary) {
    // Use ML to optimize travel routes
    // Minimize travel time between locations
    // Consider opening hours, peak times
    return itinerary; // Optimized version
  }
}

// Individual Agent: Budget Analyst
class BudgetAnalystAgent {
  async analyze(itinerary, maxBudget) {
    let total = 0;
    const breakdown = { tours: 0, food: 0, transport: 0, other: 0 };

    itinerary.days.forEach(day => {
      day.items.forEach(item => {
        const cost = parseFloat(item.cost?.replace(/[£$€]/g, '') || 0);
        total += cost;
        breakdown[item.type] = (breakdown[item.type] || 0) + cost;
      });
    });

    return {
      total,
      breakdown,
      withinBudget: total <= maxBudget,
      suggestions: total > maxBudget ? ['Consider free alternatives', 'Book in advance'] : [],
    };
  }
}

// Individual Agent: Booking Agent
class BookingAgent {
  async findBookings(itinerary) {
    // Match activities with bookable tours
    // Already implemented in aiTourMatchingService.js
    return itinerary;
  }
}

module.exports = AgentOrchestrator;
```


---

## 3. Hugging Face Models

### Installation

```bash
cd backend
npm install @huggingface/inference
npm install @xenova/transformers  # For running models locally
```

### Use Case 1: Sentiment Analysis on Reviews

```javascript
// backend/src/services/huggingface/sentimentAnalysis.js

const { HfInference } = require('@huggingface/inference');

class SentimentAnalyzer {
  constructor() {
    this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
  }

  async analyzeTourReviews(reviews) {
    const sentiments = await Promise.all(
      reviews.map(async (review) => {
        const result = await this.hf.textClassification({
          model: 'distilbert-base-uncased-finetuned-sst-2-english',
          inputs: review.text,
        });

        return {
          reviewId: review.id,
          sentiment: result[0].label, // POSITIVE or NEGATIVE
          score: result[0].score,
          text: review.text,
        };
      })
    );

    // Calculate overall sentiment
    const positive = sentiments.filter(s => s.sentiment === 'POSITIVE').length;
    const negative = sentiments.filter(s => s.sentiment === 'NEGATIVE').length;

    return {
      sentiments,
      summary: {
        positive,
        negative,
        positivePercentage: (positive / sentiments.length) * 100,
      },
    };
  }

  async detectReviewIssues(review) {
    // Detect specific issues: cleanliness, service, value
    const result = await this.hf.zeroShotClassification({
      model: 'facebook/bart-large-mnli',
      inputs: review,
      parameters: {
        candidate_labels: ['poor service', 'dirty', 'overpriced', 'unsafe', 'excellent'],
      },
    });

    return result;
  }
}

module.exports = SentimentAnalyzer;
```


### Use Case 2: Semantic Search with Embeddings

```javascript
// backend/src/services/huggingface/semanticSearch.js

const { HfInference } = require('@huggingface/inference');
const { cosineSimilarity } = require('../utils/vectorMath');

class SemanticTourSearch {
  constructor() {
    this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
    this.tourEmbeddings = new Map(); // Cache embeddings
  }

  async generateEmbedding(text) {
    const result = await this.hf.featureExtraction({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      inputs: text,
    });
    return result;
  }

  async indexTours(tours) {
    console.log(`🔍 Generating embeddings for ${tours.length} tours...`);

    for (const tour of tours) {
      const text = `${tour.title}. ${tour.description}. ${tour.highlights?.join('. ')}`;
      const embedding = await this.generateEmbedding(text);
      this.tourEmbeddings.set(tour.external_id, {
        tour,
        embedding,
      });
    }

    console.log('✅ Tour embeddings indexed');
  }

  async semanticSearch(query, topK = 10) {
    const queryEmbedding = await this.generateEmbedding(query);

    const results = [];
    for (const [tourId, data] of this.tourEmbeddings) {
      const similarity = cosineSimilarity(queryEmbedding, data.embedding);
      results.push({
        tour: data.tour,
        similarity,
      });
    }

    // Sort by similarity
    results.sort((a, b) => b.similarity - a.similarity);

    return results.slice(0, topK).map(r => r.tour);
  }
}

// Utility: Cosine Similarity
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

module.exports = SemanticTourSearch;
```


### Use Case 3: Image Analysis for Tour Photos

```javascript
// backend/src/services/huggingface/imageAnalysis.js

const { HfInference } = require('@huggingface/inference');

class TourImageAnalyzer {
  constructor() {
    this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
  }

  async analyzeImage(imageUrl) {
    // Image classification
    const classification = await this.hf.imageClassification({
      model: 'google/vit-base-patch16-224',
      data: await this.fetchImageBuffer(imageUrl),
    });

    return {
      labels: classification.map(c => ({ label: c.label, score: c.score })),
      primaryCategory: classification[0].label,
    };
  }

  async generateImageCaption(imageUrl) {
    const caption = await this.hf.imageToText({
      model: 'Salesforce/blip-image-captioning-base',
      data: await this.fetchImageBuffer(imageUrl),
    });

    return caption.generated_text;
  }

  async detectLandmarks(imageUrl) {
    // Detect famous landmarks in images
    const result = await this.hf.imageClassification({
      model: 'google/vit-base-patch16-224',
      data: await this.fetchImageBuffer(imageUrl),
    });

    return result;
  }

  async fetchImageBuffer(url) {
    const response = await fetch(url);
    return await response.arrayBuffer();
  }
}

module.exports = TourImageAnalyzer;
```

### Use Case 4: Text Summarization for Long Descriptions

```javascript
const { HfInference } = require('@huggingface/inference');

class TextSummarizer {
  constructor() {
    this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
  }

  async summarizeTourDescription(longDescription) {
    const summary = await this.hf.summarization({
      model: 'facebook/bart-large-cnn',
      inputs: longDescription,
      parameters: {
        max_length: 100,
        min_length: 30,
      },
    });

    return summary.summary_text;
  }

  async extractKeyPoints(text) {
    // Extract bullet points from long text
    const summary = await this.hf.summarization({
      model: 't5-base',
      inputs: `summarize: ${text}`,
    });

    return summary.summary_text.split('.').filter(s => s.trim());
  }
}

module.exports = TextSummarizer;
```

---

## 4. ML Features

### Feature 1: Personalized Tour Recommendations

```javascript
// backend/src/services/ml/recommendationEngine.js

class TourRecommendationEngine {
  constructor() {
    this.userProfiles = new Map();
  }

  // Collaborative Filtering
  async getRecommendations(userId, tours) {
    const userProfile = await this.getUserProfile(userId);
    
    const scored = tours.map(tour => ({
      tour,
      score: this.calculateScore(tour, userProfile),
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 10).map(s => s.tour);
  }

  calculateScore(tour, profile) {
    let score = 0;

    // Category preference
    if (profile.preferredCategories.includes(tour.category)) {
      score += 30;
    }

    // Price range
    if (tour.price_adult >= profile.minPrice && tour.price_adult <= profile.maxPrice) {
      score += 20;
    }

    // Duration preference
    if (this.matchesDuration(tour.duration, profile.preferredDuration)) {
      score += 15;
    }

    // Rating weight
    score += tour.rating * 5;

    // Popularity
    score += Math.log(tour.review_count + 1) * 2;

    return score;
  }

  async getUserProfile(userId) {
    // Build profile from user history
    if (this.userProfiles.has(userId)) {
      return this.userProfiles.get(userId);
    }

    // Default profile
    return {
      preferredCategories: ['Attractions', 'Cultural'],
      minPrice: 0,
      maxPrice: 200,
      preferredDuration: 'half-day',
    };
  }

  matchesDuration(tourDuration, preferred) {
    // Logic to match duration strings
    return true;
  }
}

module.exports = TourRecommendationEngine;
```


### Feature 2: Dynamic Price Prediction

```javascript
// backend/src/services/ml/pricePrediction.js

class PricePredictionModel {
  async predictOptimalPrice(tour, date) {
    // Features for prediction
    const features = {
      dayOfWeek: new Date(date).getDay(),
      month: new Date(date).getMonth(),
      isWeekend: [0, 6].includes(new Date(date).getDay()),
      seasonality: this.getSeason(date),
      historicalDemand: await this.getHistoricalDemand(tour.id, date),
      competitorPrices: await this.getCompetitorPrices(tour.destination),
      tourRating: tour.rating,
      reviewCount: tour.review_count,
    };

    // Simple linear model (replace with trained ML model)
    let predictedPrice = tour.price_adult;

    if (features.isWeekend) predictedPrice *= 1.15;
    if (features.seasonality === 'peak') predictedPrice *= 1.25;
    if (features.historicalDemand > 0.8) predictedPrice *= 1.10;

    return {
      currentPrice: tour.price_adult,
      predictedPrice: Math.round(predictedPrice * 100) / 100,
      confidence: 0.75,
      recommendation: predictedPrice > tour.price_adult ? 'Book now' : 'Wait for better price',
    };
  }

  getSeason(date) {
    const month = new Date(date).getMonth();
    if ([5, 6, 7, 8].includes(month)) return 'peak';
    if ([11, 0, 1].includes(month)) return 'low';
    return 'shoulder';
  }

  async getHistoricalDemand(tourId, date) {
    // Query booking history
    return 0.6; // Mock: 60% capacity
  }

  async getCompetitorPrices(destination) {
    // Scrape or API call to competitors
    return [];
  }
}

module.exports = PricePredictionModel;
```

### Feature 3: Demand Forecasting

```javascript
// backend/src/services/ml/demandForecasting.js

class DemandForecaster {
  async forecastDemand(tourId, nextDays = 30) {
    // Time series forecasting
    const historicalData = await this.getHistoricalBookings(tourId);
    
    // Simple moving average (replace with ARIMA, Prophet, or LSTM)
    const forecast = [];
    const windowSize = 7;

    for (let i = 0; i < nextDays; i++) {
      const recentData = historicalData.slice(-windowSize);
      const avg = recentData.reduce((sum, val) => sum + val, 0) / windowSize;
      forecast.push(Math.round(avg));
    }

    return {
      forecast,
      trend: this.calculateTrend(forecast),
      peakDays: this.identifyPeakDays(forecast),
    };
  }

  async getHistoricalBookings(tourId) {
    // Query from database
    return [10, 12, 15, 18, 20, 22, 25, 28, 30]; // Mock data
  }

  calculateTrend(data) {
    const first = data.slice(0, 5).reduce((a, b) => a + b) / 5;
    const last = data.slice(-5).reduce((a, b) => a + b) / 5;
    return last > first ? 'increasing' : 'decreasing';
  }

  identifyPeakDays(forecast) {
    const avg = forecast.reduce((a, b) => a + b) / forecast.length;
    return forecast
      .map((val, idx) => ({ day: idx, demand: val }))
      .filter(d => d.demand > avg * 1.2)
      .map(d => d.day);
  }
}

module.exports = DemandForecaster;
```


### Feature 4: User Behavior Clustering

```javascript
// backend/src/services/ml/userClustering.js

class UserClusteringService {
  async clusterUsers(users) {
    // K-means clustering based on behavior
    const features = users.map(user => [
      user.avgBookingValue,
      user.bookingsPerMonth,
      user.preferredPriceRange,
      user.adventureScore, // 0-1
      user.luxuryScore, // 0-1
    ]);

    // Simple clustering (replace with proper ML library)
    const clusters = this.kMeans(features, 5);

    return {
      clusters,
      segments: [
        { name: 'Budget Travelers', characteristics: 'Low spend, frequent bookings' },
        { name: 'Luxury Seekers', characteristics: 'High spend, quality focused' },
        { name: 'Adventure Enthusiasts', characteristics: 'Active tours, outdoor activities' },
        { name: 'Cultural Explorers', characteristics: 'Museums, historical sites' },
        { name: 'Family Travelers', characteristics: 'Kid-friendly, group bookings' },
      ],
    };
  }

  kMeans(data, k) {
    // Simplified k-means implementation
    // Use a proper library like ml-kmeans in production
    return Array(k).fill(0).map((_, i) => ({
      clusterId: i,
      users: [],
    }));
  }
}

module.exports = UserClusteringService;
```

---

## 5. Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Install LangChain and dependencies
- [ ] Set up Hugging Face API key
- [ ] Create basic conversational agent
- [ ] Implement sentiment analysis for reviews

### Phase 2: Advanced Features (Week 3-4)
- [ ] Build RAG system for tour knowledge base
- [ ] Implement semantic search
- [ ] Create multi-agent orchestrator
- [ ] Add personalized recommendations

### Phase 3: ML Models (Week 5-6)
- [ ] Train price prediction model
- [ ] Implement demand forecasting
- [ ] User clustering and segmentation
- [ ] A/B testing framework

### Phase 4: Production (Week 7-8)
- [ ] Optimize performance
- [ ] Add caching layer
- [ ] Monitor model accuracy
- [ ] Deploy to production

---

## Environment Variables

Add to `backend/.env`:

```env
# Existing
GROQ_API_KEY=your_groq_key

# New for AI/ML
HUGGINGFACE_API_KEY=hf_your_key_here
OPENAI_API_KEY=sk-your_key_here  # For embeddings (optional)

# Model Configuration
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your_langsmith_key  # For debugging
```

---

## API Endpoints

### New AI Endpoints

```javascript
// backend/src/routes/aiRoutes.js

router.post('/ai/chat', async (req, res) => {
  const { userId, message } = req.body;
  const agent = new LangChainTravelAgent();
  const response = await agent.chat(userId, message);
  res.json({ response });
});

router.post('/ai/semantic-search', async (req, res) => {
  const { query } = req.body;
  const search = new SemanticTourSearch();
  const results = await search.semanticSearch(query);
  res.json({ tours: results });
});

router.post('/ai/analyze-sentiment', async (req, res) => {
  const { reviews } = req.body;
  const analyzer = new SentimentAnalyzer();
  const analysis = await analyzer.analyzeTourReviews(reviews);
  res.json(analysis);
});

router.get('/ai/recommendations/:userId', async (req, res) => {
  const { userId } = req.params;
  const engine = new TourRecommendationEngine();
  const tours = await getTours(); // Your existing function
  const recommended = await engine.getRecommendations(userId, tours);
  res.json({ tours: recommended });
});

router.post('/ai/predict-price', async (req, res) => {
  const { tourId, date } = req.body;
  const predictor = new PricePredictionModel();
  const tour = await getTourById(tourId);
  const prediction = await predictor.predictOptimalPrice(tour, date);
  res.json(prediction);
});
```


---

## Frontend Integration

### Chat Interface with Memory

```jsx
// frontend/src/components/AIChatAssistant.jsx

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send } from 'lucide-react';

export default function AIChatAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user-123',
          message: input,
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl">
      <div className="p-4 bg-primary text-white rounded-t-lg flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        <span className="font-semibold">AI Travel Assistant</span>
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg ${
              msg.role === 'user'
                ? 'bg-blue-100 ml-8'
                : 'bg-gray-100 mr-8'
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div className="text-gray-500">Thinking...</div>}
      </div>

      <div className="p-4 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask me anything..."
        />
        <Button onClick={sendMessage} disabled={loading}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
```

### Semantic Search Component

```jsx
// frontend/src/components/SemanticSearch.jsx

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import TourCard from './TourCard';

export default function SemanticSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/semantic-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      setResults(data.tours);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && search()}
          placeholder="Describe what you're looking for..."
          className="flex-1"
        />
        <Button onClick={search} disabled={loading}>
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {results.map(tour => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  );
}
```

---

## Cost Estimation

### API Costs (Monthly)

**Groq (Current)**
- Free tier: 14,400 requests/day
- Cost: $0 (sufficient for MVP)

**Hugging Face**
- Free tier: 30,000 requests/month
- Pro: $9/month for 300,000 requests
- Enterprise: Custom pricing

**OpenAI (for embeddings)**
- text-embedding-3-small: $0.02 per 1M tokens
- 10,000 tours indexed: ~$0.20
- Monthly cost: ~$5-10

**LangSmith (debugging)**
- Free: 5,000 traces/month
- Plus: $39/month for 100,000 traces

**Total Estimated Cost**
- MVP: $0-20/month
- Production (10k users): $50-100/month
- Scale (100k users): $500-1000/month

---

## Performance Optimization

### Caching Strategy

```javascript
// backend/src/services/cache/aiCache.js

const NodeCache = require('node-cache');

class AICache {
  constructor() {
    this.cache = new NodeCache({ stdTTL: 3600 }); // 1 hour
  }

  async getOrCompute(key, computeFn) {
    const cached = this.cache.get(key);
    if (cached) {
      console.log(`✅ Cache hit: ${key}`);
      return cached;
    }

    console.log(`❌ Cache miss: ${key}`);
    const result = await computeFn();
    this.cache.set(key, result);
    return result;
  }

  invalidate(key) {
    this.cache.del(key);
  }
}

module.exports = new AICache();
```

### Usage

```javascript
const aiCache = require('./cache/aiCache');

// Cache embeddings
const embedding = await aiCache.getOrCompute(
  `embedding:${tourId}`,
  () => semanticSearch.generateEmbedding(tour.description)
);

// Cache recommendations
const recommendations = await aiCache.getOrCompute(
  `recommendations:${userId}`,
  () => recommendationEngine.getRecommendations(userId, tours)
);
```

---

## Monitoring & Analytics

### Track AI Performance

```javascript
// backend/src/services/monitoring/aiMetrics.js

class AIMetrics {
  constructor() {
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      avgResponseTime: 0,
      modelUsage: {},
    };
  }

  trackRequest(model, duration, success) {
    this.metrics.totalRequests++;
    if (success) {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.failedRequests++;
    }

    this.metrics.modelUsage[model] = (this.metrics.modelUsage[model] || 0) + 1;
    
    // Update average response time
    this.metrics.avgResponseTime = 
      (this.metrics.avgResponseTime * (this.metrics.totalRequests - 1) + duration) / 
      this.metrics.totalRequests;
  }

  getMetrics() {
    return {
      ...this.metrics,
      successRate: (this.metrics.successfulRequests / this.metrics.totalRequests) * 100,
    };
  }
}

module.exports = new AIMetrics();
```

---

## Next Steps

1. **Start Small**: Implement LangChain conversational agent first
2. **Add Value**: Focus on features that directly improve user experience
3. **Measure Impact**: Track conversion rates, user engagement
4. **Iterate**: Continuously improve based on user feedback
5. **Scale**: Add more sophisticated ML models as you grow

## Resources

- [LangChain Docs](https://js.langchain.com/docs/)
- [Hugging Face Models](https://huggingface.co/models)
- [Groq Documentation](https://console.groq.com/docs)
- [ML Best Practices](https://developers.google.com/machine-learning/guides)

---

**Ready to implement?** Start with the conversational agent and semantic search - they provide immediate value with minimal complexity!
