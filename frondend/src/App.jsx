
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
import OperatorDashboardPage from '@/pages/OperatorDashboardPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import RequireRole from '@/components/RequireRole';
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
          <Route path="/my-account" element={<Layout><MyAccountPage /></Layout>} />
          <Route path="/itinerary/:id" element={<Layout><ItineraryDetailPage /></Layout>} />
          <Route path="/itinerary/share/:shareId" element={<ShareableItineraryPage />} />
          
          <Route path="/destinations" element={<Layout><DestinationsPage /></Layout>} />
          <Route path="/itineraries" element={<Layout><ItinerariesPage /></Layout>} />
          <Route path="/attractions" element={<Layout><AttractionsPage /></Layout>} />
          <Route path="/attractions/:id" element={<Layout><AttractionDetailPage /></Layout>} />
          
          <Route path="/resources" element={<Layout><ResourcesPage /></Layout>} />
          <Route path="/resources/:id" element={<Layout><ResourceDetailPage /></Layout>} />

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
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
