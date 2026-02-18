
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import PlanTourPage from '@/pages/PlanTourPage';
import MyAccountPage from '@/pages/MyAccountPage';
import ItineraryDetailPage from '@/pages/ItineraryDetailPage';
import ShareableItineraryPage from '@/pages/ShareableItineraryPage';
import AuthPage from '@/pages/AuthPage';
import DestinationsPage from '@/pages/DestinationsPage';
import ItinerariesPage from '@/pages/ItinerariesPage';
import AttractionsPage from '@/pages/AttractionsPage';
import AttractionDetailPage from '@/pages/AttractionDetailPage';
import ResourcesPage from '@/pages/ResourcesPage';
import ResourceDetailPage from '@/pages/ResourceDetailPage';
import ToursPage from '@/pages/ToursPage';
import TourDetailPage from '@/pages/TourDetailPage';
import BookingsPage from '@/pages/BookingsPage';
import OperatorDashboardPage from '@/pages/OperatorDashboardPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import CommissionDashboardPage from '@/pages/CommissionDashboardPage';
import AboutUsPage from '@/pages/AboutUsPage';
import CareersPage from '@/pages/CareersPage';
import BlogPage from '@/pages/BlogPage';
import HelpCenterPage from '@/pages/HelpCenterPage';
import ContactUsPage from '@/pages/ContactUsPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import WhyAIPage from '@/pages/WhyAIPage';
import RequireRole from '@/components/RequireRole';
import RequireAuth from '@/components/RequireAuth';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster />
        <Routes>
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/login" element={<AuthPage />} />
          
          <Route path="/plan" element={<Layout><PlanTourPage /></Layout>} />
          <Route path="/my-account" element={
            <RequireAuth>
              <Layout><MyAccountPage /></Layout>
            </RequireAuth>
          } />
          <Route path="/itinerary/:id" element={
            <RequireAuth>
              <Layout><ItineraryDetailPage /></Layout>
            </RequireAuth>
          } />
          <Route path="/itinerary/share/:shareId" element={<ShareableItineraryPage />} />
          
          <Route path="/destinations" element={<Layout><DestinationsPage /></Layout>} />
          <Route path="/itineraries" element={<Layout><ItinerariesPage /></Layout>} />
          <Route path="/attractions" element={<Layout><AttractionsPage /></Layout>} />
          <Route path="/attractions/:id" element={<Layout><AttractionDetailPage /></Layout>} />
          
          <Route path="/tours" element={<Layout><ToursPage /></Layout>} />
          <Route path="/tours/:slug" element={<Layout><TourDetailPage /></Layout>} />
          <Route path="/bookings" element={
            <RequireAuth>
              <Layout><BookingsPage /></Layout>
            </RequireAuth>
          } />
          
          <Route path="/resources" element={<Layout><ResourcesPage /></Layout>} />
          <Route path="/resources/:id" element={<Layout><ResourceDetailPage /></Layout>} />

          {/* Company pages */}
          <Route path="/about" element={<Layout><AboutUsPage /></Layout>} />
          <Route path="/careers" element={<Layout><CareersPage /></Layout>} />
          <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
          <Route path="/why-ai" element={<Layout><WhyAIPage /></Layout>} />

          {/* Support pages */}
          <Route path="/help" element={<Layout><HelpCenterPage /></Layout>} />
          <Route path="/contact" element={<Layout><ContactUsPage /></Layout>} />
          <Route path="/privacy" element={<Layout><PrivacyPolicyPage /></Layout>} />
          <Route path="/terms" element={<Layout><TermsOfServicePage /></Layout>} />

          {/* Operator & Admin dashboards */}
          <Route
            path="/operator/dashboard"
            element={
              <RequireRole role="operator">
                <Layout><OperatorDashboardPage /></Layout>
              </RequireRole>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireRole role="admin">
                <Layout><AdminDashboardPage /></Layout>
              </RequireRole>
            }
          />
          <Route
            path="/admin/commissions"
            element={
              <RequireRole role="admin">
                <Layout><CommissionDashboardPage /></Layout>
              </RequireRole>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
