const { generateContent, GROQ_MODELS } = require('../config/groq');
const { saveItinerary, getItinerariesByUser } = require('../models/itineraryModel');
const AITourMatchingService = require('../services/aiTourMatchingService');

/**
 * Generate itinerary with real bookable tours
 * This enhanced version fetches real tours and matches them to AI suggestions
 */
async function generateItineraryWithTours(req, res) {
  try {
    const { destination, startDate, endDate, preferences, budget } = req.body;
    
    if (!destination || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields: destination, startDate, endDate' });
    }

    console.log(`🚀 Generating itinerary with tours for ${destination}`);
    
    const itinerary = await AITourMatchingService.generateItineraryWithTours({
      destination,
      startDate,
      endDate,
      preferences,
      budget
    });

    res.json({ 
      success: true, 
      itinerary,
      meta: {
        bookableTours: itinerary.bookableTourCount || 0,
        potentialSavings: itinerary.totalSavingsWithBooking
      }
    });
  } catch (error) {
    console.error('Error in generateItineraryWithTours:', error);
    res.status(500).json({ error: error.message || 'Failed to generate itinerary' });
  }
}

/**
 * Legacy itinerary generation (without tour matching)
 * Kept for backward compatibility
 */
async function generateItinerary(req, res) {
  try {
    const { destination, startDate, endDate, preferences } = req.body;
    if (!destination || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const daysCount =
      Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;

    const prompt = `Create a ${daysCount}-day itinerary for ${destination} starting from ${startDate}.
Preferences: ${preferences || 'none'}.

IMPORTANT RULES FOR COSTS:
- Use realistic local prices in GBP (£) for UK, EUR (€) for Europe, USD ($) for US, etc.
- Most attractions cost £0-50, restaurants £10-40 per person, transport £2-20
- Use "Free" for free attractions like parks, museums with free entry, walking tours
- Never generate costs above £200 for a single activity unless it's something exceptional

Return this JSON structure:
{
  "destination": "${destination}",
  "days": [
    {
      "dayNumber": 1,
      "date": "YYYY-MM-DD",
      "items": [
        {
          "name": "Activity Name",
          "type": "attraction",
          "location": "Specific Address",
          "time": "09:00",
          "estTime": "2h",
          "cost": "£25",
          "notes": "Brief tip or description"
        }
      ]
    }
  ]
}`;

    const modelNames = [GROQ_MODELS.LLAMA_70B, GROQ_MODELS.LLAMA_8B, GROQ_MODELS.MIXTRAL];
    let responseText;
    let lastError;

    for (const modelName of modelNames) {
      try {
        console.log(`🤖 Itinerary: Trying ${modelName}`);
        responseText = await generateContent(prompt, modelName);
        console.log(`✅ Successfully used ${modelName}`);
        break;
      } catch (e) {
        lastError = e;
        console.warn(`❌ ${modelName} failed:`, e.message || e);
      }
    }

    if (!responseText) {
      const message =
        (lastError && (lastError.message || lastError.toString())) ||
        'Failed to generate itinerary';
      return res.status(500).json({ error: message });
    }

    // Clean the response - remove markdown, extra text, and extract JSON
    let cleaned = responseText.trim();
    
    // Remove markdown code blocks
    cleaned = cleaned.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Try to extract JSON if there's extra text
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }
    
    // Parse and validate
    let itinerary;
    try {
      itinerary = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('JSON parse error. Raw response:', responseText.substring(0, 500));
      throw new Error('AI returned invalid JSON format');
    }
    
    // Ensure destination is set correctly
    if (!itinerary.destination || itinerary.destination === '${destination}') {
      itinerary.destination = destination;
    }

    res.json({ success: true, itinerary });
  } catch (error) {
    console.error('Error in generateItinerary:', error);
    res.status(500).json({ error: error.message || 'Failed to generate itinerary' });
  }
}

/**
 * Get tour suggestions for a specific activity
 */
async function suggestToursForActivity(req, res) {
  try {
    const { activity, destination } = req.body;
    
    if (!activity || !destination) {
      return res.status(400).json({ error: 'Missing activity or destination' });
    }

    const suggestions = await AITourMatchingService.suggestToursForActivity(
      activity,
      destination
    );

    res.json({ success: true, suggestions });
  } catch (error) {
    console.error('Error in suggestToursForActivity:', error);
    res.status(500).json({ error: error.message });
  }
}

async function saveItineraryHandler(req, res) {
  try {
    const { title, destination, startDate, endDate, days, activities } = req.body;
    
    // Use authenticated user ID from middleware instead of request body
    const userId = req.user.id;

    console.log('Saving itinerary for user:', userId);
    console.log('Received data:', { title, destination, startDate, endDate, daysCount: days?.length });

    const { data, error } = await saveItinerary({
      userId,
      title,
      destination,
      startDate,
      endDate,
      days,
      activities,
    });

    if (error) {
      console.error('Database save error:', error);
      throw error;
    }

    console.log('Itinerary saved successfully:', data);
    res.json({ success: true, itinerary: data[0] });
  } catch (error) {
    console.error('Error in saveItineraryHandler:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getUserItinerariesHandler(req, res) {
  try {
    const userId = req.user.id;

    const { data, error } = await getItinerariesByUser(userId);

    if (error) {
      throw error;
    }

    res.json({ success: true, itineraries: data });
  } catch (error) {
    console.error('Error in getUserItinerariesHandler:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  generateItinerary,
  generateItineraryWithTours,
  suggestToursForActivity,
  saveItineraryHandler,
  getUserItinerariesHandler,
};
