
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign, Calendar, Printer, Download, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const ShareableItineraryPage = () => {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSharedItinerary();
  }, [shareId]);

  const fetchSharedItinerary = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .eq('share_id', shareId)
        .eq('is_public', true)
        .single();

      if (error) throw error;
      
      if (!data) {
        setError('Itinerary not found or no longer shared');
        return;
      }

      setItinerary(data);
    } catch (err) {
      console.error('Error fetching shared itinerary:', err);
      setError('Failed to load itinerary');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    toast({
      title: "🚧 PDF Download Coming Soon",
      description: "This feature will be available in a future update."
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#0B3D91] mx-auto mb-4" />
          <p className="text-gray-600">Loading itinerary...</p>
        </div>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Itinerary Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'This itinerary may have been deleted or is no longer shared.'}</p>
          <Button onClick={() => navigate('/')} className="bg-[#0B3D91] hover:bg-[#092C6B]">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const days = itinerary.days || [];
  const totalActivities = days.reduce((acc, day) => acc + (day.items?.length || 0), 0);
  const totalCost = days.reduce((acc, day) => {
    const dayCost = (day.items || []).reduce((sum, item) => {
      const cost = typeof item.cost === 'string' ? parseFloat(item.cost.replace(/[^0-9.]/g, '')) || 0 : item.cost || 0;
      return sum + cost;
    }, 0);
    return acc + dayCost;
  }, 0);

  return (
    <>
      <Helmet>
        <title>{itinerary.title} - Shared Itinerary</title>
        <meta name="description" content={`Explore this ${itinerary.destination} itinerary`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header - Hidden on Print */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40 print:hidden">
          <div className="container mx-auto px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </Button>
                <Button size="sm" onClick={handlePrint} className="bg-[#0B3D91] hover:bg-[#092C6B]">
                  <Printer className="w-4 h-4 mr-2" /> Print
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Printable Content */}
        <div className="container mx-auto px-4 lg:px-8 py-8 max-w-4xl">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 print:shadow-none print:border-0">
            
            {/* Header Section */}
            <div className="border-b border-gray-200 pb-6 mb-8">
              <h1 className="text-4xl font-bold text-[#0B3D91] mb-3">{itinerary.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#0B3D91]" />
                  <span className="font-semibold">{itinerary.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#0B3D91]" />
                  <span>
                    {format(new Date(itinerary.start_date), 'MMM d, yyyy')} - {format(new Date(itinerary.end_date), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600 mb-1">Duration</p>
                  <p className="text-2xl font-bold text-[#0B3D91]">{days.length}</p>
                  <p className="text-xs text-gray-500">days</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600 mb-1">Activities</p>
                  <p className="text-2xl font-bold text-[#0B3D91]">{totalActivities}</p>
                  <p className="text-xs text-gray-500">planned</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600 mb-1">Est. Cost</p>
                  <p className="text-2xl font-bold text-[#0B3D91]">£{totalCost.toFixed(0)}</p>
                  <p className="text-xs text-gray-500">total</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600 mb-1">Shared</p>
                  <p className="text-2xl font-bold text-[#0B3D91]">✓</p>
                  <p className="text-xs text-gray-500">public</p>
                </div>
              </div>
            </div>

            {/* Daily Itinerary */}
            <div className="space-y-8">
              {days.map((day, index) => (
                <div key={day.id || index} className="page-break-inside-avoid">
                  <div className="bg-[#0B3D91] text-white rounded-t-xl px-6 py-3">
                    <h2 className="text-xl font-bold">Day {index + 1}</h2>
                    <p className="text-blue-100 text-sm">{format(new Date(day.date), 'EEEE, MMMM do, yyyy')}</p>
                  </div>
                  
                  <div className="border-x border-b border-gray-200 rounded-b-xl p-6 space-y-4 bg-white">
                    {day.items && day.items.length > 0 ? (
                      day.items.map((item, itemIndex) => (
                        <div key={item.id || itemIndex} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                          <div className="flex-shrink-0 w-12 text-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0B3D91] flex items-center justify-center font-bold text-sm">
                              {itemIndex + 1}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                              {item.time && (
                                <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                                  <Clock className="w-4 h-4" />
                                  {item.time}
                                </div>
                              )}
                            </div>
                            
                            {item.location && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span>{item.location}</span>
                              </div>
                            )}
                            
                            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                              {item.estTime && (
                                <span className="bg-gray-50 px-2 py-1 rounded">Duration: {item.estTime}</span>
                              )}
                              {item.cost && (
                                <span className="bg-gray-50 px-2 py-1 rounded flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" /> {item.cost}
                                </span>
                              )}
                              {item.openingHours && (
                                <span className="bg-gray-50 px-2 py-1 rounded">Hours: {item.openingHours}</span>
                              )}
                            </div>
                            
                            {item.notes && (
                              <p className="text-sm text-gray-700 mt-2 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                                <strong>Note:</strong> {item.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-center py-4 italic">No activities planned for this day</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500 print:mt-12">
              <p>Created with Orbito Trip Planner</p>
              <p className="mt-1">Shared on {format(new Date(itinerary.shared_at || itinerary.created_at), 'PPP')}</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            background: white !important;
          }
          .page-break-inside-avoid {
            page-break-inside: avoid;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </>
  );
};

export default ShareableItineraryPage;
