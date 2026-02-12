// src/services/api.js
import { supabase } from '@/lib/customSupabaseClient';

// Use environment variable for production, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
  },

  // Tours
  getTours: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      
      const response = await fetch(`${API_BASE_URL}/tours?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tours');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  getTourDetail: async (slug) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tours/${slug}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tour details');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Tour Bookings
  createTourBooking: async (bookingData) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers,
        body: JSON.stringify(bookingData)
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to create bookings');
        }
        const error = await response.json();
        throw new Error(error.error || 'Failed to create booking');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  getUserBookings: async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        headers
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to view bookings');
        }
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch bookings');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  getBookingDetail: async (bookingId) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch booking details');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  cancelBooking: async (bookingId, reason) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ cancellationReason: reason })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to cancel booking');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};
