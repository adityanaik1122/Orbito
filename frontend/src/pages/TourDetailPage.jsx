import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, MapPin, Star, Users, Check, X, Loader2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

const TourDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  
  const [bookingData, setBookingData] = useState({
    date: undefined,
    numAdults: 1,
    numChildren: 0,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    specialRequirements: ''
  });

  useEffect(() => {
    fetchTourDetail();
  }, [slug]);

  const fetchTourDetail = async () => {
    try {
      const response = await apiService.getTourDetail(slug);
      setTour(response.tour);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load tour details'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!tour) return 0;
    const adultTotal = (tour.price_adult || 0) * bookingData.numAdults;
    const childTotal = (tour.price_child || 0) * bookingData.numChildren;
    return adultTotal + childTotal;
  };

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to book tours',
        variant: 'destructive'
      });
      navigate('/login');
      return;
    }

    if (!bookingData.date) {
      toast({
        variant: 'destructive',
        title: 'Date Required',
        description: 'Please select a tour date'
      });
      return;
    }

    if (!bookingData.customerName || !bookingData.customerEmail) {
      toast({
        variant: 'destructive',
        title: 'Information Required',
        description: 'Please fill in your contact details'
      });
      return;
    }

    setBooking(true);
    try {
      const response = await apiService.createTourBooking({
        tourId: tour.id || tour.external_id,
        tourDate: format(bookingData.date, 'yyyy-MM-dd'),
        numAdults: bookingData.numAdults,
        numChildren: bookingData.numChildren,
        customerName: bookingData.customerName,
        customerEmail: bookingData.customerEmail,
        customerPhone: bookingData.customerPhone,
        specialRequirements: bookingData.specialRequirements,
        totalAmount: calculateTotal()
      });

      toast({
        title: 'Booking Created! 🎉',
        description: `Booking reference: ${response.booking.booking_reference}`
      });

      navigate('/bookings');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Booking Failed',
        description: error.message
      });
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Tour Not Found</h1>
        <Button onClick={() => navigate('/tours')}>Browse Tours</Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{tour.title} | Orbito</title>
        <meta name="description" content={tour.description} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/tours')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tours
          </Button>
        </div>

        {/* Hero Image */}
        <div className="relative h-96 overflow-hidden">
          <img
            src={tour.main_image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200'}
            alt={tour.title}
            className="w-full h-full object-cover"
          />
          {tour.provider && (
            <Badge className="absolute top-4 left-4 bg-blue-500 text-white">
              {tour.provider === 'premium-tours' ? 'Premium Tours' : tour.provider}
            </Badge>
          )}
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title & Rating */}
              <div>
                <h1 className="text-3xl font-bold mb-2">{tour.title}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                  {tour.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{tour.rating.toFixed(1)}</span>
                      <span>({tour.review_count} reviews)</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <MapPin className="w-5 h-5" />
                    <span>{tour.city || tour.destination}</span>
                  </div>
                  {tour.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-5 h-5" />
                      <span>{tour.duration}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-3">About This Tour</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{tour.description}</p>
              </div>

              {/* Highlights */}
              {tour.highlights && tour.highlights.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold mb-3">Highlights</h2>
                  <ul className="space-y-2">
                    {tour.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Includes/Excludes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tour.price_includes && tour.price_includes.length > 0 && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-bold mb-3 text-green-600">✓ Included</h3>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {tour.price_includes.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {tour.price_excludes && tour.price_excludes.length > 0 && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-bold mb-3 text-red-600">✗ Not Included</h3>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {tour.price_excludes.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Cancellation Policy */}
              {tour.cancellation_policy && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold mb-3">Cancellation Policy</h2>
                  <p className="text-gray-700">{tour.cancellation_policy}</p>
                </div>
              )}
            </div>

            {/* Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                <div className="mb-4">
                  <div className="text-sm text-gray-500">From</div>
                  <div className="text-3xl font-bold text-primary">
                    £{tour.price_adult?.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">per adult</div>
                </div>

                <div className="space-y-4">
                  {/* Date */}
                  <div>
                    <Label>Select Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn("w-full justify-start text-left font-normal", !bookingData.date && "text-muted-foreground")}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {bookingData.date ? format(bookingData.date, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={bookingData.date}
                          onSelect={(date) => setBookingData({...bookingData, date})}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Participants */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Adults</Label>
                      <Input
                        type="number"
                        min="1"
                        value={bookingData.numAdults}
                        onChange={(e) => setBookingData({...bookingData, numAdults: parseInt(e.target.value) || 1})}
                      />
                    </div>
                    <div>
                      <Label>Children</Label>
                      <Input
                        type="number"
                        min="0"
                        value={bookingData.numChildren}
                        onChange={(e) => setBookingData({...bookingData, numChildren: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      value={bookingData.customerName}
                      onChange={(e) => setBookingData({...bookingData, customerName: e.target.value})}
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={bookingData.customerEmail}
                      onChange={(e) => setBookingData({...bookingData, customerEmail: e.target.value})}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <Label>Phone (Optional)</Label>
                    <Input
                      value={bookingData.customerPhone}
                      onChange={(e) => setBookingData({...bookingData, customerPhone: e.target.value})}
                      placeholder="+44 123 456 7890"
                    />
                  </div>

                  <div>
                    <Label>Special Requirements (Optional)</Label>
                    <Textarea
                      value={bookingData.specialRequirements}
                      onChange={(e) => setBookingData({...bookingData, specialRequirements: e.target.value})}
                      placeholder="Any special requirements..."
                      rows={3}
                    />
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        £{calculateTotal().toFixed(2)}
                      </span>
                    </div>

                    <Button
                      className="w-full"
                      onClick={handleBooking}
                      disabled={booking}
                    >
                      {booking ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Booking...
                        </>
                      ) : (
                        'Book Now'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TourDetailPage;
