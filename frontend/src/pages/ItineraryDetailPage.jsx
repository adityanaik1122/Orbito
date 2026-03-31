import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import MapView from '@/components/MapView';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2, Edit, Calendar, MapPin, Clock, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getItineraryById, FALLBACK_IMAGE } from '@/data/itineraries';

const ItineraryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [itinerary, setItinerary] = useState(null);

  useEffect(() => {
    const found = getItineraryById(id);
    setItinerary(found || null);
  }, [id]);

  const handleShare = () => {
    toast({
      title: "Link Copied to Clipboard!",
      description: "Share this trip with your friends."
    });
  };

  if (!itinerary) {
    return (
      <div className="container mx-auto px-4 pt-24 text-center">
        <p className="text-gray-600">Itinerary not found</p>
        <Button onClick={() => navigate('/itineraries')} className="mt-4 bg-[#0B3D91] hover:bg-[#092C6B] text-white">
          Back to Itineraries
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{itinerary.title || 'Itinerary'} - AI Itinerary Creator</title>
        <meta name="description" content={`View your ${itinerary.destination} travel itinerary with interactive map and detailed schedule.`} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/itineraries')}
            className="mb-6 text-gray-600 hover:bg-gray-100 hover:text-[#0B3D91]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Itineraries
          </Button>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6 shadow-sm">
            <div className="h-72 bg-gray-200 relative overflow-hidden">
              <img
                src={itinerary.heroImage || FALLBACK_IMAGE}
                alt={itinerary.title}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
            </div>
            
            <div className="p-8">
              <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2 text-[#0B3D91]">{itinerary.title}</h1>
                  <p className="text-xl text-gray-600 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#0B3D91]" />
                    {itinerary.city}, {itinerary.country}
                  </p>
                  <p className="text-gray-600 mt-2 max-w-2xl">{itinerary.summary}</p>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="text-[#0B3D91] border-blue-200 hover:bg-blue-50"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    onClick={() => navigate('/plan', { state: { destination: itinerary.city, prefillItinerary: itinerary } })}
                    className="bg-[#0B3D91] hover:bg-[#092C6B] text-white"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Use This Itinerary
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600 mb-2">
                <Calendar className="w-5 h-5 text-[#0B3D91]" />
                <span>{itinerary.duration}</span>
              </div>
              {itinerary.highlights && itinerary.highlights.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {itinerary.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="px-3 py-1 bg-blue-50 text-[#0B3D91] text-xs font-semibold rounded-full"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-[#0B3D91]">Day-by-day plan</h2>
                <div className="space-y-6">
                  {itinerary.days.map((day) => (
                    <div key={day.day} className="border border-gray-100 rounded-2xl p-5">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#0B3D91] text-white font-semibold">
                          {day.day}
                        </span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{day.title}</h3>
                          <p className="text-sm text-gray-500">{day.theme}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {day.items.map((item, index) => (
                          <div key={`${day.day}-${index}`} className="flex items-start gap-4 bg-gray-50 rounded-xl p-4">
                            <div className="text-sm font-semibold text-[#0B3D91] w-14 flex-shrink-0">
                              {item.time}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">{item.name}</span>
                                {item.duration && (
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {item.duration}
                                  </span>
                                )}
                              </div>
                              {item.note && <p className="text-sm text-gray-600 mt-1">{item.note}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <MapView destination={itinerary.city} activities={[]} />
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI itinerary notes</h3>
                <p className="text-sm text-gray-600">
                  This plan is AI-generated based on popular routes, pacing, and neighborhood clusters.
                  You can customize it further in the planner.
                </p>
                <Button
                  onClick={() => navigate('/plan', { state: { destination: itinerary.city, prefillItinerary: itinerary } })}
                  className="mt-4 w-full bg-[#0B3D91] hover:bg-[#092C6B] text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Customize in Planner
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ItineraryDetailPage;
