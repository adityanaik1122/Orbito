// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

export const apiService = {
  // Generate AI Itinerary
  generateItinerary: async (tripData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/generate-itinerary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: tripData.destination,
          startDate: tripData.startDate,
          endDate: tripData.endDate,
          preferences: tripData.preferences || ''
        }),
      });

      if (!response.ok) {
        let errorBody = {};
        try {
          errorBody = await response.json();
        } catch {/* ignore JSON parse errors */}
        const message =
          errorBody.details ||
          errorBody.error ||
          `Failed to generate itinerary (status ${response.status})`;
        throw new Error(message);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Save Itinerary
  saveItinerary: async (userId, itineraryData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/save-itinerary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...itineraryData
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save itinerary');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Get User's Itineraries
  getUserItineraries: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/itineraries/${userId}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch itineraries');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Health Check
  healthCheck: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'error' };
    }
  }
};