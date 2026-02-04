import React from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OperatorDashboardPage = () => {
  const { profile } = useAuth();

  return (
    <>
      <Helmet>
        <title>Operator Dashboard - Orbito</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4 max-w-5xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-[#0B3D91] mb-1">Operator Dashboard</h1>
            <p className="text-gray-600 text-sm">
              Welcome {profile?.name || profile?.email || 'Operator'} – this is where you will manage your tours and bookings.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500">Coming soon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm">
                  Here you will be able to create and update your tours for cities like London and across the UK.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500">Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm">
                  In the next step, this area will show upcoming bookings and your commission earnings.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500">Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm">
                  Your operator profile and company details will live here so customers know who they are booking with.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default OperatorDashboardPage;
