import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Eye, 
  MousePointerClick,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  Download,
  RefreshCw
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

const AdminDashboardPage = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState(null);
  const [dailyStats, setDailyStats] = useState([]);
  const [affiliateStats, setAffiliateStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get auth token
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch all data in parallel
      const [summaryRes, dailyRes, affiliateRes, usersRes, bookingsRes] = await Promise.all([
        fetch('http://localhost:5000/api/analytics/dashboard/summary', { headers }),
        fetch(`http://localhost:5000/api/analytics/dashboard/daily-stats?startDate=${format(subDays(new Date(), 30), 'yyyy-MM-dd')}&endDate=${format(new Date(), 'yyyy-MM-dd')}`, { headers }),
        fetch('http://localhost:5000/api/analytics/affiliate/stats', { headers }),
        fetch('http://localhost:5000/api/analytics/users/registrations?limit=10', { headers }),
        fetch('http://localhost:5000/api/analytics/bookings?limit=10', { headers })
      ]);

      const summaryData = await summaryRes.json();
      const dailyData = await dailyRes.json();
      const affiliateData = await affiliateRes.json();
      const usersData = await usersRes.json();
      const bookingsData = await bookingsRes.json();

      setSummary(summaryData.data);
      setDailyStats(dailyData.data || []);
      setAffiliateStats(affiliateData.stats);
      setRecentUsers(usersData.data || []);
      setRecentBookings(bookingsData.data || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load dashboard data'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const exportData = () => {
    toast({
      title: 'Export Started',
      description: 'Your data export will download shortly'
    });
    // TODO: Implement CSV export
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0B3D91]" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Orbito</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl space-y-6">
          
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#0B3D91] mb-1">Admin Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, {profile?.name || profile?.email || 'Admin'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={exportData}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                <Users className="w-4 h-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#0B3D91]">{summary?.total_users || 0}</div>
                <p className="text-xs text-gray-500 mt-1">
                  +{summary?.users_today || 0} today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
                <Calendar className="w-4 h-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#0B3D91]">{summary?.total_bookings || 0}</div>
                <p className="text-xs text-gray-500 mt-1">
                  +{summary?.bookings_today || 0} today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                <DollarSign className="w-4 h-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  £{parseFloat(summary?.total_revenue || 0).toFixed(2)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  £{parseFloat(summary?.revenue_this_month || 0).toFixed(2)} this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Affiliate Clicks</CardTitle>
                <MousePointerClick className="w-4 h-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#0B3D91]">
                  {summary?.total_affiliate_clicks || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {summary?.total_conversions || 0} conversions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="affiliate">Affiliate</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Itineraries Created</span>
                      <span className="font-bold">{summary?.total_itineraries || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Confirmed Bookings</span>
                      <span className="font-bold text-green-600">{summary?.confirmed_bookings || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Conversion Rate</span>
                      <span className="font-bold">
                        {affiliateStats?.conversion_rate || 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Commission</span>
                      <span className="font-bold text-green-600">
                        £{parseFloat(summary?.total_commission || 0).toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Growth This Week</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">New Users</span>
                      <span className="font-bold text-[#0B3D91]">
                        +{summary?.users_this_week || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">New Itineraries</span>
                      <span className="font-bold text-[#0B3D91]">
                        +{summary?.itineraries_today || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Affiliate Clicks Today</span>
                      <span className="font-bold text-[#0B3D91]">
                        +{summary?.affiliate_clicks_today || 0}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Daily Stats Chart Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>Last 30 Days Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                      <p>Chart visualization coming soon</p>
                      <p className="text-sm">Install recharts for graphs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Registrations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentUsers.length > 0 ? (
                      recentUsers.map((user) => (
                        <div key={user.id} className="flex justify-between items-center py-2 border-b last:border-0">
                          <div>
                            <p className="font-medium">{user.email}</p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(user.registered_at), 'PPp')}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            user.status === 'active' ? 'bg-green-100 text-green-700' :
                            user.status === 'pending_verification' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {user.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-8">No users yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentBookings.length > 0 ? (
                      recentBookings.map((booking) => (
                        <div key={booking.id} className="flex justify-between items-start py-3 border-b last:border-0">
                          <div className="flex-1">
                            <p className="font-medium">{booking.tour_title}</p>
                            <p className="text-sm text-gray-600">{booking.customer_name}</p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(booking.created_at), 'PPp')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">£{parseFloat(booking.total_amount).toFixed(2)}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              booking.booking_status === 'confirmed' ? 'bg-green-100 text-green-700' :
                              booking.booking_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {booking.booking_status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-8">No bookings yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Affiliate Tab */}
            <TabsContent value="affiliate" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Total Clicks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-[#0B3D91]">
                      {affiliateStats?.total_clicks || 0}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Conversions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600">
                      {affiliateStats?.total_conversions || 0}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Commission Earned</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600">
                      £{parseFloat(affiliateStats?.total_commission || 0).toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>By Provider</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {affiliateStats?.by_provider && Object.keys(affiliateStats.by_provider).length > 0 ? (
                      Object.entries(affiliateStats.by_provider).map(([provider, stats]) => (
                        <div key={provider} className="flex justify-between items-center py-2 border-b last:border-0">
                          <span className="font-medium capitalize">{provider}</span>
                          <div className="text-right text-sm">
                            <p>{stats.clicks} clicks • {stats.conversions} conversions</p>
                            <p className="text-green-600 font-bold">£{stats.commission.toFixed(2)}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-8">No affiliate data yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
