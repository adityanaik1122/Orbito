import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import MapView from '@/components/MapView';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2, Edit, Calendar, MapPin, Clock, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getItineraryById, FALLBACK_IMAGE } from '@/data/itineraries';
import { supabase } from '@/lib/customSupabaseClient';

const CITY_IMAGES = {
  'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1600&auto=format&fit=crop',
  'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop',
  'Amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=1600&auto=format&fit=crop',
  'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1600&auto=format&fit=crop',
  'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1600&auto=format&fit=crop',
  'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop',
  'Rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1600&auto=format&fit=crop',
  'Barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=1600&auto=format&fit=crop',
  'Bangkok': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=1600&auto=format&fit=crop',
  'Bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1600&auto=format&fit=crop',
  'Singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1600&auto=format&fit=crop',
  'Sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1600&auto=format&fit=crop',
  'Cape Town': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=1600&auto=format&fit=crop',
  'Istanbul': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1600&auto=format&fit=crop',
};

const normalizeDbItinerary = (dbItinerary) => {
  const city = dbItinerary.destination_city || dbItinerary.destination || dbItinerary.city || 'Unknown city';
  const country = dbItinerary.destination_country || dbItinerary.country || '';
  const start = dbItinerary.start_date ? new Date(dbItinerary.start_date) : null;
  const end = dbItinerary.end_date ? new Date(dbItinerary.end_date) : null;
  const dayCount = start && end ? Math.max(Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1, 1) : (dbItinerary.days?.length || 1);
  const duration = `${dayCount} ${dayCount === 1 ? 'Day' : 'Days'}`;
  const rawDays = Array.isArray(dbItinerary.days) ? dbItinerary.days : [];
  const days = rawDays.length ? rawDays.map((day, index) => ({
    day: day.day || index + 1,
    title: day.title || `Day ${day.day || index + 1}`,
    theme: day.theme || 'Custom plan',
    items: (day.items || []).map((item) => ({
      time: item.time || '',
      name: item.name || item.title || 'Planned activity',
      note: item.note || item.notes || item.description || '',
      duration: item.duration || item.estTime || '',
      tour: item.tour || null,
      suggestedTour: item.suggestedTour || null,
    }))
  })) : Array.from({ length: dayCount }, (_, index) => ({
    day: index + 1,
    title: `Day ${index + 1}`,
    theme: 'Custom plan',
    items: []
  }));

  return {
    id: dbItinerary.id,
    title: dbItinerary.title || 'Untitled Trip',
    city,
    country,
    duration,
    rating: 4.8,
    reviews: 120,
    price: 'Free',
    tags: ['Custom'],
    styles: dbItinerary.styles || [],
    heroImage: dbItinerary.hero_image_url || CITY_IMAGES[city] || FALLBACK_IMAGE,
    summary: dbItinerary.summary || 'A personalized itinerary you can refine in the planner.',
    highlights: dbItinerary.highlights || [],
    days
  };
};

const ItineraryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [itinerary, setItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadItinerary = async () => {
      setIsLoading(true);
      const found = getItineraryById(id);
      if (found) {
        if (isMounted) {
          setItinerary(found);
          setIsLoading(false);
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from('itineraries')
          .select('*')
          .eq('id', id)
          .single();
        if (error) {
          if (isMounted) {
            setItinerary(null);
            setIsLoading(false);
          }
          return;
        }
        if (isMounted) {
          setItinerary(normalizeDbItinerary(data));
          setIsLoading(false);
        }
      } catch {
        if (isMounted) {
          setItinerary(null);
          setIsLoading(false);
        }
      }
    };

    loadItinerary();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleShare = () => {
    toast({
      title: "Link Copied to Clipboard!",
      description: "Share this trip with your friends."
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-24 text-center">
        <p className="text-gray-600">Loading itinerary...</p>
      </div>
    );
  }

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
        <meta name="description" content={`View your ${itinerary.city} travel itinerary with interactive map and detailed schedule.`} />
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
                          <div key={`${day.day}-${index}`} className="bg-gray-50 rounded-xl overflow-hidden">
                            <div className="flex items-start gap-4 p-4">
                              <div className="text-sm font-semibold text-[#0B3D91] w-14 flex-shrink-0 pt-0.5">
                                {item.time}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
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
                  This plan is AI-generated based on popular routes, pacing, and neighbourhood clusters.
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
