import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, Plus, Star, Bookmark, ExternalLink, ChevronDown, Clock, MapPin, Tag } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AttractionSuggestions = ({ itinerary, setItinerary }) => {
  const { toast } = useToast();
  const [suggestions] = useState([
    { id: 'sg1', name: 'The British Museum', type: 'Museum', rating: 4.8, openingHours: '10:00 - 17:30', price: 'Free', location: 'Great Russell St', info: 'Home to a vast collection of world art and artifacts.', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1000&auto=format&fit=crop' },
    { id: 'sg2', name: 'Tower of London', type: 'Historic Site', rating: 4.7, openingHours: '09:00 - 17:30', price: '£29.90', location: 'St Katharine\'s & Wapping', info: 'Historic castle housing the Crown Jewels.', image: 'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?q=80&w=1000&auto=format&fit=crop' },
    { id: 'sg3', name: 'The London Eye', type: 'Landmark', rating: 4.6, openingHours: '11:00 - 18:00', price: '£32.50', location: 'South Bank', info: 'A giant Ferris wheel offering panoramic views.', image: 'https://images.unsplash.com/photo-1528336163200-92d20d5a385f?q=80&w=1000&auto=format&fit=crop' },
    { id: 'sg4', name: 'Buckingham Palace', type: 'Royal Palace', rating: 4.5, openingHours: 'Varies', price: 'Tour-dependent', location: 'Westminster', info: 'The Queen\'s official London residence.', image: 'https://images.unsplash.com/photo-1506268478002-a27e776e553b?q=80&w=1000&auto=format&fit=crop' },
    { id: 'sg5', name: 'Borough Market', type: 'Food Market', rating: 4.7, openingHours: '10:00 - 17:00', price: 'Varies', location: 'Southwark', info: 'A bustling market with gourmet food.', image: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?q=80&w=1000&auto=format&fit=crop' }
  ]);
  const [favorites, setFavorites] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favoriteSpots') || '[]');
    setFavorites(savedFavorites);
  }, []);

  const toggleFavorite = (attraction) => {
    const isFavorite = favorites.some(fav => fav.id === attraction.id);
    let updatedFavorites;
    if (isFavorite) {
      updatedFavorites = favorites.filter(fav => fav.id !== attraction.id);
      toast({ title: "Removed from Favorites!" });
    } else {
      updatedFavorites = [...favorites, attraction];
      toast({ title: "Added to Favorites! ⭐" });
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteSpots', JSON.stringify(updatedFavorites));
  };

  const addToItinerary = (attraction) => {
    const newActivity = {
      id: Date.now(),
      name: attraction.name,
      time: '',
      location: attraction.location,
      cost: attraction.price.includes('£') ? attraction.price.replace('£','') : '0',
      notes: ''
    };
    
    setItinerary(prev => ({
      ...prev,
      activities: [...(prev.activities || []), newActivity]
    }));

    toast({
      title: "Added to Itinerary! ✨",
      description: `${attraction.name} has been added to your trip`
    });
  };

  const handleGenerateSuggestions = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };
  
  const handleFindOutMore = () => {
    toast({
      title: "🚧 This is a placeholder link!",
      description: "You can request to make this a real, dynamic link in your next prompt."
    });
  };
  
  // Orbito Dark Blue Theme Colors (#0B3D91)
  const themeColors = {
    bgLight: 'bg-[#F0F4FA]',   // Very light blue background for sections/badges
    bgHover: 'bg-[#E1EAF8]',   // Hover state for light backgrounds
    primary: 'bg-[#0B3D91]',   // Main buttons, active states
    primaryHover: 'bg-[#092C6B]', // Hover for main buttons
    text: 'text-[#0B3D91]',    // Headings, icons, strong text
    textSecondary: 'text-[#1E5BA8]', // Less emphasized blue text
    border: 'border-[#E1EAF8]', // Light blue borders
    ring: 'ring-[#0B3D91]'      // Focus rings
  };

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">London Suggestions</h2>
        <Button
          onClick={handleGenerateSuggestions}
          size="sm"
          className={`${themeColors.primary} text-white hover:${themeColors.primaryHover}`}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          AI Suggest
        </Button>
      </div>

      <div className="space-y-4">
        {suggestions.map((attraction) => {
          const isFavorite = favorites.some(fav => fav.id === attraction.id);
          const isExpanded = expandedId === attraction.id;
          return (
            <motion.div
              key={attraction.id}
              layout
              className="bg-gray-50 rounded-xl border overflow-hidden"
            >
              <div className="p-4">
                <motion.div layout="position" className="flex items-start gap-4">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img className="w-full h-full object-cover rounded-lg" alt={attraction.name} src={attraction.image} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1 text-gray-900 truncate">{attraction.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{attraction.type}</p>
                    <div className="flex items-center gap-1 text-yellow-500 mt-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-semibold text-gray-800">{attraction.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <Button size="icon" variant="outline" onClick={() => addToItinerary(attraction)} className={`${themeColors.bgLight} ${themeColors.text} hover:${themeColors.bgHover} h-9 w-9`}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </motion.div>
                     <Button size="icon" variant="ghost" onClick={() => setExpandedId(isExpanded ? null : attraction.id)} className="text-gray-500 h-9 w-9">
                      <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}><ChevronDown className="w-5 h-5" /></motion.div>
                    </Button>
                  </div>
                </motion.div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-4 border-t pt-4">
                       <p className="text-sm text-gray-700">{attraction.info}</p>
                       <div className="grid grid-cols-2 gap-3 text-sm border-t pt-3">
                           <div className="flex items-center gap-2 text-gray-600"><Clock className={`w-4 h-4 ${themeColors.textSecondary}`}/> {attraction.openingHours}</div>
                           <div className="flex items-center gap-2 text-gray-600"><Tag className={`w-4 h-4 ${themeColors.text}`}/> {attraction.price}</div>
                           <div className="col-span-2 flex items-center gap-2 text-gray-600"><MapPin className="w-4 h-4 text-gray-500"/> {attraction.location}</div>
                       </div>
                       <div className="flex gap-2">
                           <Button size="sm" variant="outline" className="flex-1" onClick={() => toggleFavorite(attraction)}>
                               <Bookmark className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`}/> {isFavorite ? 'Favorited' : 'Favorite'}
                           </Button>
                           <Button size="sm" variant="outline" className="flex-1" onClick={handleFindOutMore}>
                               <ExternalLink className="w-4 h-4 mr-2"/> Find out more
                           </Button>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  );
};

export default React.memo(AttractionSuggestions);