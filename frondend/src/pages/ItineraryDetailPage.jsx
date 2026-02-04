import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import MapView from '@/components/MapView';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2, Edit, Calendar, MapPin, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ItineraryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [itinerary, setItinerary] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('itineraries') || '[]');
    const found = saved.find(item => item.id === id);
    setItinerary(found);
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
            <div className="h-64 bg-gradient-to-br from-[#0B3D91] to-[#1E5BA8] relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="w-24 h-24 text-white opacity-20" />
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2 text-[#0B3D91]">{itinerary.title}</h1>
                  <p className="text-xl text-gray-600 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#0B3D91]" />
                    {itinerary.destination}
                  </p>
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
                    onClick={() => navigate('/plan')}
                    className="bg-[#0B3D91] hover:bg-[#092C6B] text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>

              {itinerary.startDate && itinerary.endDate && (
                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <Calendar className="w-5 h-5 text-[#0B3D91]" />
                  <span>
                    {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 text-[#0B3D91]">Activities</h2>
              
              {itinerary.activities && itinerary.activities.length > 0 ? (
                <div className="space-y-4">
                  {itinerary.activities.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#0B3D91] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1 text-[#0B3D91]">{activity.name || 'Activity'}</h3>
                          {activity.time && (
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {activity.time}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No activities added yet</p>
              )}
            </div>

            <MapView destination={itinerary.destination} activities={itinerary.activities} />
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ItineraryDetailPage;