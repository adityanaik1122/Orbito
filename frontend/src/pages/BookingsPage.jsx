import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, MapPin, Users, Clock } from 'lucide-react';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

const BookingsPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchBookings();
      } else {
        navigate('/login');
      }
    }
  }, [user, authLoading]);

  const fetchBookings = async () => {
    try {
      const response = await apiService.getUserBookings();
      setBookings(response.bookings || []);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load bookings'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Bookings | Orbito</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
            <p className="text-blue-100">View and manage your tour bookings</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {bookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-20">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                  No bookings yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Start booking amazing tours and activities!
                </p>
                <Button onClick={() => navigate('/tours')}>
                  Browse Tours
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-48 h-48 md:h-auto">
                      <img
                        src={booking.tours?.main_image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400'}
                        alt={booking.tours?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold">{booking.tours?.title}</h3>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={getStatusColor(booking.booking_status)}>
                                {booking.booking_status.toUpperCase()}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                Ref: {booking.booking_reference}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{format(new Date(booking.tour_date), 'PPP')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>{booking.num_adults} Adults{booking.num_children > 0 ? `, ${booking.num_children} Children` : ''}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{booking.tours?.destination}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t flex items-center justify-between">
                          <div>
                            <div className="text-sm text-gray-500">Total Amount</div>
                            <div className="text-2xl font-bold text-primary">
                              £{booking.total_amount?.toFixed(2)}
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            onClick={() => navigate(`/tours/${booking.tours?.slug}`)}
                          >
                            View Tour
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BookingsPage;
