import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Heart, Star, Search, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const cityImages = {
    'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1000&auto=format&fit=crop',
    'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop',
    'Amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=1000&auto=format&fit=crop',
    'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1000&auto=format&fit=crop',
    'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop',
    'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea936a79483?q=80&w=1000&auto=format&fit=crop',
    'Rome': 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?q=80&w=1000&auto=format&fit=crop',
    'Barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=1000&auto=format&fit=crop',
    'Prague': 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=1000&auto=format&fit=crop',
    'Edinburgh': 'https://images.unsplash.com/photo-1506377295352-e3154d43ea9e?q=80&w=1000&auto=format&fit=crop',
};

const ItinerariesPage = () => {
    const navigate = useNavigate();
    const [selectedCity, setSelectedCity] = useState('London');
    const cities = Object.keys(cityImages);

    const featuredItineraries = [
        { id: 1, title: "Royal London & Palaces", city: 'London', duration: '3 Days', rating: 4.8, reviews: 234, price: 'Free', image: 'https://images.unsplash.com/photo-1552458470-d7a072a1620c?q=80&w=1000&auto=format&fit=crop', tags: ['History', 'Royal', 'Sightseeing'] },
        { id: 2, title: 'Harry Potter Film Locations', city: 'London', duration: '2 Days', rating: 4.9, reviews: 412, price: 'Free', image: 'https://images.unsplash.com/photo-1595867874140-588837637581?q=80&w=1000&auto=format&fit=crop', tags: ['Movies', 'Magic', 'Walking'] },
        { id: 3, title: 'Historic Greenwich & Maritime', city: 'London', duration: '1 Day', rating: 4.7, reviews: 189, price: 'Free', image: 'https://images.unsplash.com/photo-1561457636-4c705888a501?q=80&w=1000&auto=format&fit=crop', tags: ['History', 'Maritime', 'River'] },
        { id: 4, title: 'Romantic Paris Gateway', city: 'Paris', duration: '3 Days', rating: 4.9, reviews: 520, price: '€50', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop', tags: ['Romance', 'Views', 'Food'] },
        { id: 5, title: 'Art & Culture in Paris', city: 'Paris', duration: '4 Days', rating: 4.8, reviews: 310, price: '€80', image: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?q=80&w=1000&auto=format&fit=crop', tags: ['Art', 'History', 'Culture'] },
        { id: 6, title: 'Ancient Rome Exploration', city: 'Rome', duration: '3 Days', rating: 4.9, reviews: 650, price: '€60', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000&auto=format&fit=crop', tags: ['History', 'Ancient', 'Walking'] },
        { id: 7, title: 'Rome Food & Wine Tour', city: 'Rome', duration: '2 Days', rating: 4.8, reviews: 420, price: '€120', image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba30c6?q=80&w=1000&auto=format&fit=crop', tags: ['Food', 'Wine', 'Culture'] },
        { id: 8, title: 'NYC Highlights', city: 'New York', duration: '4 Days', rating: 4.9, reviews: 350, price: '$50', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1000&auto=format&fit=crop', tags: ['City', 'Views', 'Culture'] },
        { id: 9, title: 'Tokyo Traditional & Modern', city: 'Tokyo', duration: '5 Days', rating: 4.9, reviews: 560, price: '¥5000', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop', tags: ['History', 'Technology', 'Food'] },
    ];
    
    const filteredItineraries = selectedCity === 'All' 
        ? featuredItineraries 
        : featuredItineraries.filter(item => item.city === selectedCity);

    return (
        <>
            <Helmet>
                <title>Featured Itineraries - Orbito</title>
                <meta name="description" content="Browse curated itineraries for top destinations worldwide." />
            </Helmet>

            <div className="container mx-auto px-4 lg:px-8 py-12">
                 <div className="flex flex-col gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="h-10 w-10 flex-shrink-0 rounded-full hover:bg-gray-100 border-gray-200">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-[#0B3D91]">Featured Itineraries</h1>
                            <p className="text-gray-600 mt-1">Discover the best trips curated by experts.</p>
                        </div>
                    </div>
                </div>

                {/* City Filter - Card Style */}
                <div className="mb-8">
                    <ScrollArea className="w-full whitespace-nowrap pb-4">
                        <div className="flex space-x-6"> {/* Increased space-x from 4 to 6 */}
                            {cities.map((city) => (
                                <button
                                    key={city}
                                    onClick={() => setSelectedCity(city)}
                                    className={cn(
                                        "relative group flex-shrink-0 w-[180px] h-[220px] rounded-lg overflow-hidden transition-all duration-300 focus:outline-none ring-offset-2 focus:ring-2 ring-[#0B3D91]", // Increased width and height
                                        selectedCity === city ? "ring-2 scale-[1.02] shadow-xl" : "opacity-90 hover:opacity-100 hover:scale-[1.02] hover:shadow-lg"
                                    )}
                                >
                                    <img 
                                        src={cityImages[city]} 
                                        alt={city} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                    />
                                    {/* City Label Badge */}
                                    <div className="absolute top-3 left-3 bg-[#1B263B] text-white text-base font-bold px-4 py-2 rounded-md shadow-md z-10"> {/* Adjusted text size and padding */}
                                        {city}
                                    </div>
                                    {/* Overlay for inactive */}
                                    {selectedCity !== city && (
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                    )}
                                </button>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
                
                {filteredItineraries.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredItineraries.map((itinerary, index) => (
                            <motion.div
                                key={itinerary.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group border border-gray-100"
                                whileHover={{ y: -4 }}
                            >
                                <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                                    <img 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                        alt={itinerary.title} 
                                        src={itinerary.image}
                                        loading="lazy"
                                        decoding="async"
                                        referrerPolicy="no-referrer"
                                        onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1200&auto=format&fit=crop"; }}
                                    />
                                    <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md text-gray-400 hover:text-[#0B3D91] transition-colors">
                                        <Heart className="w-4 h-4" />
                                    </button>
                                    <div className="absolute bottom-3 left-3 px-2 py-1 bg-white/90 rounded-md text-xs font-semibold text-gray-800 flex items-center gap-1 shadow-sm backdrop-blur-sm">
                                        <MapPin className="w-3 h-3 text-[#0B3D91]" />
                                        {itinerary.city}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                                        {itinerary.tags.map(tag => (
                                            <span key={tag} className="px-2 py-0.5 bg-blue-50 text-[#0B3D91] text-[10px] font-bold rounded-full uppercase tracking-wide">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#0B3D91] transition-colors">{itinerary.title}</h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4" />
                                            {itinerary.duration}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Star className="w-4 h-4 fill-[#0B3D91] text-[#0B3D91]" />
                                            <span className="font-semibold text-gray-900">{itinerary.rating}</span> 
                                            <span className="text-gray-400">({itinerary.reviews})</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <span className="text-base font-bold text-gray-900">{itinerary.price}</span>
                                        <Button size="sm" className="bg-[#0B3D91] hover:bg-[#092C6B] text-white h-9">
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900">No itineraries found for {selectedCity}</h3>
                        <p className="text-gray-500">Try selecting a different city or view all.</p>
                        <Button 
                            variant="link" 
                            onClick={() => setSelectedCity('All')}
                            className="text-[#0B3D91] mt-2"
                        >
                            View All Cities
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
};

export default ItinerariesPage;