# AI/ML API Reference

Quick reference for all AI endpoints.

## Base URL
```
http://localhost:5000/api/ai
```

---

## 🤖 LangChain Chat Agent

### Chat with AI
```http
POST /api/ai/chat
Content-Type: application/json

{
  "userId": "user-123",
  "message": "Plan a 3-day trip to London"
}
```

**Response:**
```json
{
  "success": true,
  "response": "I'd be happy to help you plan a 3-day trip to London! Here's a suggested itinerary...",
  "timestamp": "2026-02-21T13:00:00.000Z"
}
```

### Get Chat History
```http
GET /api/ai/chat/history/:userId
```

### Clear Chat Memory
```http
POST /api/ai/chat/clear
```

---

## 🔍 Semantic Search

### Search Tours
```http
POST /api/ai/search
Content-Type: application/json

{
  "query": "historic attractions in London",
  "tours": [] // optional, will fetch from DB if not provided
}
```

**Response:**
```json
{
  "success": true,
  "tours": [...],
  "count": 10
}
```

### Find Similar Tours
```http
POST /api/ai/similar
Content-Type: application/json

{
  "tourId": "tour-123",
  "limit": 5
}
```

---

## 😊 Sentiment Analysis

### Analyze Multiple Reviews
```http
POST /api/ai/sentiment
Content-Type: application/json

{
  "reviews": [
    { "text": "Amazing tour! Highly recommend." },
    { "text": "Terrible experience, waste of money." },
    { "text": "It was okay, nothing special." }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "results": [
      {
        "sentiment": "POSITIVE",
        "confidence": 0.85,
        "text": "Amazing tour! Highly recommend."
      }
    ],
    "summary": {
      "positive": 1,
      "negative": 1,
      "neutral": 1,
      "total": 3,
      "positivePercentage": 33.33,
      "averageConfidence": 0.75
    }
  }
}
```

### Analyze Single Review
```http
POST /api/ai/sentiment/single
Content-Type: application/json

{
  "text": "This tour was absolutely amazing!"
}
```

---

## ⭐ Smart Recommendations

### Get Personalized Recommendations
```http
GET /api/ai/recommendations/:userId?limit=10
```

**Response:**
```json
{
  "success": true,
  "tours": [...],
  "count": 10
}
```

### Get Trending Tours
```http
GET /api/ai/trending?days=7
```

**Query Parameters:**
- `days` (optional): Number of days to look back (default: 7)

---

## 📝 Examples

### Example 1: Complete Chat Flow
```bash
# Start conversation
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-123", "message": "I want to visit Paris"}'

# Follow-up question (remembers context)
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-123", "message": "What are the must-see attractions?"}'

# Get history
curl http://localhost:5000/api/ai/chat/history/user-123
```

### Example 2: Search and Recommendations
```bash
# Search for tours
curl -X POST http://localhost:5000/api/ai/search \
  -H "Content-Type: application/json" \
  -d '{"query": "food tours"}'

# Get personalized recommendations
curl http://localhost:5000/api/ai/recommendations/user-123?limit=5

# Get trending tours
curl http://localhost:5000/api/ai/trending?days=7
```

### Example 3: Sentiment Analysis
```bash
# Analyze reviews
curl -X POST http://localhost:5000/api/ai/sentiment \
  -H "Content-Type: application/json" \
  -d '{
    "reviews": [
      {"text": "Best tour ever!"},
      {"text": "Not worth the money"},
      {"text": "It was okay"}
    ]
  }'
```

---

## 🔒 Authentication

Most endpoints don't require authentication, but recommendations work better with authenticated users.

To use with authentication:
```http
Authorization: Bearer <your-jwt-token>
```

---

## ⚡ Rate Limits

- Groq (Chat): 14,400 requests/day (FREE tier)
- Hugging Face: 30,000 requests/month (FREE tier)
- Local services: No limits

---

## 🐛 Error Handling

All endpoints return errors in this format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

Common errors:
- `400`: Missing required parameters
- `404`: Resource not found
- `500`: Server error

---

## 💡 Tips

1. **Chat Context**: The chat agent remembers the last 10 exchanges per user
2. **Search**: Provide tours array for faster results, or let it fetch from DB
3. **Sentiment**: Works offline with local analysis, better with Hugging Face API
4. **Recommendations**: Improve over time as users book more tours

---

## 🧪 Testing

Run the test suite:
```bash
cd backend
node test-ai-features.js
```

Test individual features:
```bash
node test-langchain.js
```

---

## 📚 More Info

- Full implementation guide: `AI_FEATURES_IMPLEMENTATION_SUMMARY.md`
- Quick start: `QUICK_START_AI.md`
- Service documentation: Check inline comments in service files
