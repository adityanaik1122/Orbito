import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const MyItinerariesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [itineraries, setItineraries] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('itineraries') || '[]');
    setItineraries(saved);
  }, []);

  const handleDelete = (id) => {
    const updated = itineraries.filter(item => item.id !== id);
    setItineraries(updated);
    localStorage.setItem('itineraries', JSON.stringify(updated));
    
    toast({
      title: "Itinerary Deleted",
      description: "Your itinerary has been removed"
    });
  };

  return (
    <>
      <Helmet>
        <title>My Itineraries - AI Itinerary Creator</title>
        <meta name="description" content="View and manage all your saved travel itineraries in one place." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-[#0B3D91]">
                My Itineraries
              </h1>
              <p className="text-gray-600 text-lg">
                Manage and view all your saved trips
              </p>
            </div>
            
            <Button
              onClick={() => navigate('/plan')}
              className="bg-[#0B3D91] hover:bg-[#092C6B] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Itinerary
            </Button>
          </div>

          {itineraries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm"
            >
              <div className="w-24 h-24 bg-[#0B3D91]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-12 h-12 text-[#0B3D91]" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-[#0B3D91]">No Itineraries Yet</h2>
              <p className="text-gray-500 mb-6">Start planning your first adventure!</p>
              <Button
                onClick={() => navigate('/plan')}
                className="bg-[#0B3D91] hover:bg-[#092C6B] text-white"
              >
                Create Your First Trip
              </Button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {itineraries.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.03 }}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => navigate(`/itinerary/${item.id}`)}
                >
                  <div className="h-48 bg-gradient-to-br from-[#0B3D91]/10 to-[#0B3D91]/30 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MapPin className="w-16 h-16 text-[#0B3D91]/40" />
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-[#0B3D91]">{item.title || 'Untitled Trip'}</h3>
                    <p className="text-gray-600 mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {item.destination || 'No destination'}
                    </p>
                    
                    {item.startDate && item.endDate && (
                      <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                      </p>
                    )}
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">
                        {item.activities?.length || 0} activities
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default MyItinerariesPage;