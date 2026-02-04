import React from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboardPage = () => {
  const { profile } = useAuth();

  return (
    <>
      <Helmet>
        <title>Admin - Orbito</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4 max-w-5xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-[#0B3D91] mb-1">Admin Panel</h1>
            <p className="text-gray-600 text-sm">
              Hello {profile?.name || profile?.email || 'Admin'} – this is where you will manage operators, tours and bookings.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500">Operators</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm">
                  In a future step, you will review and approve tour operators here.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500">Tours</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm">
                  Overview and moderation of all tours listed on Orbito.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500">Bookings & Commission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm">
                  Later this area will show bookings across operators and your commission totals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
