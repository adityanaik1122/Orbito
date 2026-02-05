// src/services/api.js
import { supabase } from '@/lib/customSupabaseClient';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Helper to get the current auth token
 */
async function getAuthToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

/**
 * Helper to create headers with auth token
 */
async function getAuthHeaders() {
  const token = await getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const apiService = {
  // Generate AI Itinerary
  generateItinerary: async (tripData) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/generate-itinerary`, {
        method: 'POST',
        headers,
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
        
        // Handle auth errors specifically
        if (response.status === 401) {
          throw new Error('Please log in to generate itineraries');
        }
        
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
  saveItinerary: async (itineraryData) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/save-itinerary`, {
        method: 'POST',
        headers,
        body: JSON.stringify(itineraryData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to save itineraries');
        }
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
  getUserItineraries: async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/itineraries`, {
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to view itineraries');
        }
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
