const { getGenerativeModel } = require('../config/gemini');
const { saveItinerary, getItinerariesByUser } = require('../models/itineraryModel');

async function generateItinerary(req, res) {
  try {
    const { destination, startDate, endDate, preferences } = req.body;
    if (!destination || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const daysCount =
      Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;

    const prompt = `Create a ${daysCount}-day itinerary for ${destination}.
Preferences: ${preferences || 'none'}.
Return ONLY valid JSON: { "destination": "${destination}", "days": [{"dayNumber": 1, "date": "YYYY-MM-DD", "items": [{"name": "Activity", "type": "attraction", "location": "Address", "time": "09:00", "estTime": "2h", "cost": "Free", "notes": "tip"}]}] }`;

    const modelNames = ['gemini-2.5-flash', 'gemini-2.5-pro'];
    let responseText;
    let lastError;

    for (const name of modelNames) {
      try {
        console.log(`🤖 Itinerary: Trying ${name}`);
        const model = getGenerativeModel(name);
        const result = await model.generateContent(prompt);
        responseText = result.response.text();
        break;
      } catch (e) {
        lastError = e;
        console.warn(`❌ ${name} failed`, e.message || e);
      }
    }

    if (!responseText) {
      // Surface a useful error message back to the frontend
      const message =
        (lastError && (lastError.message || lastError.toString())) ||
        'Failed to generate itinerary';
      return res.status(500).json({ error: message });
    }

    const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const itinerary = JSON.parse(cleaned);

    res.json({ success: true, itinerary });
  } catch (error) {
    console.error('Error in generateItinerary:', error);
    res.status(500).json({ error: error.message || 'Failed to generate itinerary' });
  }
}

async function saveItineraryHandler(req, res) {
  try {
    const { title, destination, startDate, endDate, days, activities } = req.body;
    
    // Use authenticated user ID from middleware instead of request body
    const userId = req.user.id;

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
      throw error;
    }

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
  saveItineraryHandler,
  getUserItinerariesHandler,
};
