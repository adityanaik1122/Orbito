const { getGenerativeModel } = require('../config/gemini');

async function suggestActivities(req, res) {
  try {
    const { prompt: userPrompt, destination, startDate, endDate, currentItinerary } = req.body;

    const aiInstructions = `User wants: "${userPrompt}" for a trip to ${destination}.
Return ONLY JSON: { "suggestions": [{"dayIndex": 0, "name": "Activity", "type": "attraction", "location": "Loc", "time": "10:00", "estTime": "1h", "cost": "£0", "notes": "tip"}], "message": "Feedback" }`;

    const modelNames = ['gemini-2.5-flash', 'gemini-2.5-pro'];
    let responseText;

    for (const name of modelNames) {
      try {
        console.log(`🤖 Suggest: Trying ${name}`);
        const model = getGenerativeModel(name);
        const result = await model.generateContent(aiInstructions);
        responseText = result.response.text();
        break;
      } catch (e) {
        console.warn(`❌ ${name} failed`, e.message);
      }
    }

    if (!responseText) {
      return res.status(500).json({ error: 'Failed to get suggestions' });
    }

    const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    res.json(parsed);
  } catch (error) {
    console.error('Error in suggestActivities:', error);
    res.status(500).json({ error: 'Failed', details: error.message });
  }
}

module.exports = {
  suggestActivities,
};
