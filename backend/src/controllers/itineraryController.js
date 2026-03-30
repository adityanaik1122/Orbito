const { generateContent, GROQ_MODELS } = require('../config/groq');
const { saveItinerary, getItinerariesByUser } = require('../models/itineraryModel');
const AITourMatchingService = require('../services/aiTourMatchingService');
const logger = require('../utils/logger');

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

    logger.info(`Generating itinerary with tours for ${destination}`);
    
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
    const { destination, startDate, endDate, preferences, variants } = req.body;
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
        logger.info(` Itinerary: Trying ${modelName}`);
        responseText = await generateContent(prompt, modelName);
        logger.success(` Successfully used ${modelName}`);
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
      
      // Fallback itinerary (keeps planner usable even if AI provider is down)
      const makeFallback = (variantIndex) => {
        const fallbackDays = [];
        for (let i = 0; i < daysCount; i++) {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          const isoDate = date.toISOString().slice(0, 10);
          fallbackDays.push({
            dayNumber: i + 1,
            date: isoDate,
            items: [
              {
                name: `Explore ${destination} highlights`,
                type: 'attraction',
                location: destination,
                time: '09:30',
                estTime: '2h',
                cost: 'Free',
                notes: 'Start with a walking route to get oriented.'
              },
              {
                name: `Local cuisine tasting`,
                type: 'food',
                location: destination,
                time: variantIndex % 2 === 0 ? '12:30' : '13:00',
                estTime: '1.5h',
                cost: '£25',
                notes: 'Pick a highly rated local spot.'
              },
              {
                name: `Neighborhood stroll & photo stops`,
                type: 'relax',
                location: destination,
                time: variantIndex % 2 === 0 ? '16:00' : '17:00',
                estTime: '2h',
                cost: 'Free',
                notes: 'Look for a scenic viewpoint or park.'
              }
            ]
          });
        }
        return { destination, days: fallbackDays };
      };

      const variantCount = Math.min(Math.max(parseInt(variants || 1, 10), 1), 5);
      const fallbackVariants = Array.from({ length: variantCount }, (_, i) => makeFallback(i));

      return res.status(200).json({
        success: true,
        itinerary: fallbackVariants[0],
        itineraries: fallbackVariants,
        meta: {
          fallback: true,
          message
        }
      });
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
    
    const variantCount = Math.min(Math.max(parseInt(variants || 1, 10), 1), 5);

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

    const itineraries = [itinerary];

    if (variantCount > 1) {
      const variantPrompt = `Create a DIFFERENT ${daysCount}-day itinerary for ${destination} starting from ${startDate}.
Preferences: ${preferences || 'none'}.

Return ONLY valid JSON matching:
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

      for (let i = 1; i < variantCount; i++) {
        try {
          const variantText = await generateContent(variantPrompt, modelNames[0]);
          let variantCleaned = variantText.trim().replace(/```json\s*/g, '').replace(/```\s*/g, '');
          const variantJsonMatch = variantCleaned.match(/\{[\s\S]*\}/);
          if (variantJsonMatch) variantCleaned = variantJsonMatch[0];
          const variantItinerary = JSON.parse(variantCleaned);
          if (!variantItinerary.destination || variantItinerary.destination === '${destination}') {
            variantItinerary.destination = destination;
          }
          itineraries.push(variantItinerary);
        } catch (variantError) {
          console.warn('Variant generation failed, skipping:', variantError.message || variantError);
        }
      }
    }

    res.json({ success: true, itinerary: itineraries[0], itineraries });
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

    logger.info('Saving itinerary for user:', userId);
    logger.debug('Received data:', { title, destination, startDate, endDate, daysCount: days?.length });

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

    logger.success('Itinerary saved successfully:', data);
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
