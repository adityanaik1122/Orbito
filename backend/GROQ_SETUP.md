# Groq AI Setup Guide

## Why Groq?

We've switched from Google Gemini to Groq for the following reasons:

✅ **Free & Generous**: 14,400 requests/day (vs Gemini's limited free tier)  
✅ **Extremely Fast**: 10x faster inference than other providers  
✅ **High Quality**: Uses Llama 3.1 70B - one of the best open-source models  
✅ **Easy Integration**: Simple API similar to OpenAI  
✅ **No Credit Card**: Free tier doesn't require payment info  

## Setup Instructions

### Step 1: Get Your Groq API Key

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up for a free account (no credit card required)
3. Navigate to [API Keys](https://console.groq.com/keys)
4. Click "Create API Key"
5. Copy your API key

### Step 2: Install Dependencies

```bash
cd backend
npm install
```

This will install the `groq-sdk` package.

### Step 3: Update Your .env File

Open `backend/.env` and add your Groq API key:

```env
GROQ_API_KEY=gsk_your_api_key_here
```

You can remove the old `GEMINI_API_KEY` line if you had one.

### Step 4: Restart Your Backend Server

```bash
cd backend
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

## Available Models

The system will automatically try these models in order:

1. **llama-3.1-70b-versatile** (Primary) - Best quality, great for complex itineraries
2. **llama-3.1-8b-instant** (Fallback) - Faster, good for simple requests
3. **mixtral-8x7b-32768** (Backup) - Alternative high-quality model

## Rate Limits

**Free Tier:**
- 14,400 requests per day
- 30 requests per minute
- More than enough for development and small production apps

**If you need more:**
- Groq offers paid plans with higher limits
- Or you can add multiple API keys and rotate them

## Testing

After setup, test the AI features:

1. Go to the Plan Trip page
2. Enter a destination and dates
3. Click "Ask AI" or let it auto-generate
4. You should see an itinerary generated within 2-3 seconds

## Troubleshooting

### Error: "Groq AI is not initialized"
- Make sure `GROQ_API_KEY` is set in your `.env` file
- Restart your backend server after adding the key

### Error: "Rate limit exceeded"
- You've hit the 30 requests/minute limit
- Wait a minute and try again
- Consider implementing request caching

### Error: "Invalid API key"
- Double-check your API key from the Groq console
- Make sure there are no extra spaces in the `.env` file

## API Documentation

For more details, visit:
- [Groq Documentation](https://console.groq.com/docs)
- [Groq API Reference](https://console.groq.com/docs/api-reference)

## Migration Notes

All Gemini-related code has been replaced with Groq:
- ✅ `backend/src/config/groq.js` - New Groq configuration
- ✅ `backend/src/controllers/aiController.js` - Updated
- ✅ `backend/src/controllers/itineraryController.js` - Updated
- ✅ `backend/src/services/aiTourMatchingService.js` - Updated
- ✅ `backend/package.json` - Dependencies updated
- ✅ `backend/.env.example` - Updated with Groq key

The old `backend/src/config/gemini.js` file can be safely deleted.
