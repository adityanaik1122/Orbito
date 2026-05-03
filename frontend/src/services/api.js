// src/services/api.js
import { supabase } from '@/lib/customSupabaseClient';

// Use environment variable for production, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to get the current auth token
 */
async function getAuthToken() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) return session.access_token;

  // Attempt a refresh if session is missing/stale
  try {
    const { data: refreshed } = await supabase.auth.refreshSession();
    return refreshed?.session?.access_token || null;
  } catch {
    return null;
  }
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

  // Generate AI Itinerary with real bookable tours matched to activities
  generateItineraryWithTours: async (tripData) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/generate-with-tours`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          destination: tripData.destination,
          startDate: tripData.startDate,
          endDate: tripData.endDate,
          preferences: tripData.preferences || '',
          budget: tripData.budget || ''
        }),
      });

      if (!response.ok) {
        let errorBody = {};
        try { errorBody = await response.json(); } catch { }
        if (response.status === 401) throw new Error('Please log in to generate itineraries');
        throw new Error(errorBody.error || `Failed to generate itinerary (status ${response.status})`);
      }

      return await response.json();
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

  // ── Operator ──────────────────────────────────────────────────────────────
  applyAsOperator: async (applicationData) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/operator/apply`, { method: 'POST', headers, body: JSON.stringify(applicationData) });
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed to submit application'); }
    return res.json();
  },

  getApplicationStatus: async () => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/operator/application-status`, { headers });
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed to fetch application status'); }
    return res.json();
  },

  getOperatorTours: async () => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/operator/tours`, { headers });
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed to fetch tours'); }
    return res.json();
  },

  createOperatorTour: async (tourData) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/operator/tours`, { method: 'POST', headers, body: JSON.stringify(tourData) });
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed to create tour'); }
    return res.json();
  },

  updateOperatorTour: async (tourId, tourData) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/operator/tours/${tourId}`, { method: 'PUT', headers, body: JSON.stringify(tourData) });
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed to update tour'); }
    return res.json();
  },

  deleteOperatorTour: async (tourId) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/operator/tours/${tourId}`, { method: 'DELETE', headers });
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed to delete tour'); }
    return res.json();
  },

  getOperatorBookings: async () => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/operator/bookings`, { headers });
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed to fetch bookings'); }
    return res.json();
  },

  getOperatorEarnings: async () => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/operator/earnings`, { headers });
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed to fetch earnings'); }
    return res.json();
  },

  getOperatorStats: async () => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/operator/stats`, { headers });
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed to fetch stats'); }
    return res.json();
  },

  // ── Admin ─────────────────────────────────────────────────────────────────
  getAdminApplications: async () => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/admin/applications`, { headers });
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed to fetch applications'); }
    return res.json();
  },

  approveApplication: async (id) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/admin/applications/${id}/approve`, { method: 'POST', headers });
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed to approve'); }
    return res.json();
  },

  rejectApplication: async (id, reason) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/admin/applications/${id}/reject`, { method: 'POST', headers, body: JSON.stringify({ reason }) });
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed to reject'); }
    return res.json();
  },

  getAdminPendingTours: async () => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/admin/pending-tours`, { headers });
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed to fetch pending tours'); }
    return res.json();
  },

  approveTour: async (tourId) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/admin/tours/${tourId}/approve`, { method: 'POST', headers });
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed to approve tour'); }
    return res.json();
  },

  rejectTour: async (tourId) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/admin/tours/${tourId}/reject`, { method: 'POST', headers });
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed to reject tour'); }
    return res.json();
  },

  // ── Payments ──────────────────────────────────────────────────────────────
  createPaymentIntent: async (bookingId) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/payments/create-intent`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ bookingId })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to set up payment');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // ── Reviews ──────────────────────────────────────────────────────────────
  getTourReviews: async (tourId, page = 1) => {
    const res = await fetch(`${API_BASE_URL}/tours/${tourId}/reviews?page=${page}&limit=20`);
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed to fetch reviews'); }
    return res.json();
  },

  createReview: async (reviewData) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/reviews`, { method: 'POST', headers, body: JSON.stringify(reviewData) });
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed to submit review'); }
    return res.json();
  },

  getMyReviews: async () => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/my-reviews`, { headers });
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed to fetch reviews'); }
    return res.json();
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
