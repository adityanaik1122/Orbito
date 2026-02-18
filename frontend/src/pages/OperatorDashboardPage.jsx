import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  MapPin,
  Clock,
  Star,
  RefreshCw,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function OperatorDashboardPage() {
  const { profile } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch operator's tours
      const toursRes = await fetch(`${API_URL}/operator/tours`, {
        headers: {
          'Authorization': `Bearer ${profile?.access_token}`
        }
      });
      if (toursRes.ok) {
        const toursData = await toursRes.json();
        setTours(toursData.tours || []);
      }

      // Fetch operator's bookings
      const bookingsRes = await fetch(`${API_URL}/operator/bookings`, {
        headers: {
          'Authorization': `Bearer ${profile?.access_token}`
        }
      });
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData.bookings || []);
      }

      // Fetch operator stats
      const statsRes = await fetch(`${API_URL}/operator/stats`, {
        headers: {
          'Authorization': `Bearer ${profile?.access_token}`
        }
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load dashboard data'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (tourId, currentStatus) => {
    try {
      const res = await fetch(`${API_URL}/operator/tours/${tourId}/availability`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${profile?.access_token}`
        },
        body: JSON.stringify({ is_available: !currentStatus })
      });

      if (res.ok) {
        toast({
          title: 'Success',
          description: `Tour ${!currentStatus ? 'enabled' : 'disabled'}`
        });
        fetchDashboardData();
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update availability'
      });
    }
  };

  const handleDeleteTour = async (tourId) => {
    if (!confirm('Are you sure you want to delete this tour?')) return;

    try {
      const res = await fetch(`${API_URL}/operator/tours/${tourId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${profile?.access_token}`
        }
      });

      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Tour deleted successfully'
        });
        fetchDashboardData();
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete tour'
      });
    }
  };

  const getBookingStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Operator Dashboard - Orbito</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Operator Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  Welcome {profile?.name || profile?.email || 'Operator'}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={fetchDashboardData}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tour
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Tours
                </CardTitle>
                <MapPin className="w-5 h-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {tours.length}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {tours.filter(t => t.is_available).length} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Bookings
                </CardTitle>
                <Calendar className="w-5 h-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {bookings.length}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {bookings.filter(b => b.booking_status === 'confirmed').length} confirmed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Revenue
                </CardTitle>
                <DollarSign className="w-5 h-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  £{stats?.totalRevenue?.toFixed(2) || '0.00'}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  This month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Avg Rating
                </CardTitle>
                <Star className="w-5 h-5 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stats?.avgRating?.toFixed(1) || '0.0'}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  From {stats?.totalReviews || 0} reviews
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="tours" className="space-y-6">
            <TabsList>
              <TabsTrigger value="tours">My Tours</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Tours Tab */}
            <TabsContent value="tours">
              <Card>
                <CardHeader>
                  <CardTitle>My Tours</CardTitle>
                </CardHeader>
                <CardContent>
                  {tours.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No tours yet</p>
                      <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Tour
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {tours.map((tour) => (
                        <div
                          key={tour.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{tour.title}</h3>
                              <Badge className={tour.is_available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                {tour.is_available ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {tour.destination}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {tour.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                £{tour.price_adult}
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500" />
                                {tour.rating || 'N/A'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleAvailability(tour.id, tour.is_available)}
                            >
                              {tour.is_available ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedTour(tour);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteTour(tour.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {bookings.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No bookings yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Booking Ref</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Tour</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map((booking) => (
                            <tr key={booking.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4 text-sm font-medium">
                                {booking.booking_reference}
                              </td>
                              <td className="py-3 px-4 text-sm">
                                {booking.tour?.title || 'N/A'}
                              </td>
                              <td className="py-3 px-4 text-sm">
                                {booking.customer_name}
                              </td>
                              <td className="py-3 px-4 text-sm">
                                {format(new Date(booking.tour_date), 'MMM dd, yyyy')}
                              </td>
                              <td className="py-3 px-4 text-right text-sm font-medium">
                                £{parseFloat(booking.total_amount).toFixed(2)}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <Badge className={getBookingStatusColor(booking.booking_status)}>
                                  {booking.booking_status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600">Total Views</p>
                          <p className="text-2xl font-bold">{stats?.totalViews || 0}</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600">Conversion Rate</p>
                          <p className="text-2xl font-bold">{stats?.conversionRate || 0}%</p>
                        </div>
                        <Users className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600">Avg Booking Value</p>
                          <p className="text-2xl font-bold">£{stats?.avgBookingValue?.toFixed(2) || '0.00'}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Tours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tours.length === 0 ? (
                      <p className="text-gray-600 text-center py-8">No data available</p>
                    ) : (
                      <div className="space-y-3">
                        {tours.slice(0, 5).map((tour, index) => (
                          <div key={tour.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                              <div>
                                <p className="font-medium">{tour.title}</p>
                                <p className="text-sm text-gray-600">{tour.views_count || 0} views</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">£{tour.price_adult}</p>
                              <p className="text-sm text-gray-600">{tour.rating || 'N/A'} ⭐</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Create/Edit Tour Dialog - Placeholder */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Tour</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Tour creation form coming soon. This will allow you to add new tours with all details including:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Title and description</li>
              <li>Destination and meeting point</li>
              <li>Duration and schedule</li>
              <li>Pricing (adult, child, infant)</li>
              <li>Images and highlights</li>
              <li>Availability and capacity</li>
            </ul>
            <Button onClick={() => setIsCreateDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
