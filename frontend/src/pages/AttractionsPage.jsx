import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Heart, MapPin, Search } from 'lucide-react';
import { attractions } from '@/data/attractions';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const cityImages = {
    // Europe
    'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1000&auto=format&fit=crop',
    'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop',
    'Rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000&auto=format&fit=crop',
    'Barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=1000&auto=format&fit=crop',
    'Amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=1000&auto=format&fit=crop',
    'Prague': 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=1000&auto=format&fit=crop',
    'Lisbon': 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?q=80&w=1000&auto=format&fit=crop',
    'Athens': 'https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=1000&auto=format&fit=crop',
    // Americas
    'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1000&auto=format&fit=crop',
    'Los Angeles': 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?q=80&w=1000&auto=format&fit=crop',
    'Rio de Janeiro': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1000&auto=format&fit=crop',
    'Mexico City': 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?q=80&w=1000&auto=format&fit=crop',
    // Asia
    'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop',
    'Singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1000&auto=format&fit=crop',
    'Bangkok': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=1000&auto=format&fit=crop',
    'Bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop',
    'Seoul': 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=1000&auto=format&fit=crop',
    // India
    'Rishikesh': 'https://images.unsplash.com/photo-1592385432464-5e3d91040a90?q=80&w=1000&auto=format&fit=crop',
    'Kerala': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop',
    'Ladakh': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1000&auto=format&fit=crop',
    'Meghalaya': 'https://images.unsplash.com/photo-1625058502211-f1d92e5565a4?q=80&w=1000&auto=format&fit=crop',
    'Manali': 'https://images.unsplash.com/photo-1626621331169-5f34be280ed9?q=80&w=1000&auto=format&fit=crop',
    'Varanasi': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1000&auto=format&fit=crop',
    'Jaipur': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1000&auto=format&fit=crop',
    'Goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000&auto=format&fit=crop',
    // Middle East & Africa
    'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000&auto=format&fit=crop',
    'Istanbul': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1000&auto=format&fit=crop',
    'Cape Town': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=1000&auto=format&fit=crop',
    // Oceania
    'Sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1000&auto=format&fit=crop',
};

const AttractionsPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('All');
    const [selectedCity, setSelectedCity] = useState('London');

    const categories = ['All', 'History', 'Food', 'Culture', 'Museums', 'Views', 'Tour'];
    const cities = Object.keys(cityImages);

    const filteredAttractions = attractions.filter(a => {
        // Handle filter by Category/Tag
        const matchesCategory = activeTab === 'All' || a.tags.some(tag => tag === activeTab);
        // Handle filter by City (Default London if null)
        const matchesCity = selectedCity === 'All' || a.location === selectedCity;

        return matchesCategory && matchesCity;
    });

    return (
        <>
            <Helmet>
                <title>Popular Attractions - Orbito</title>
            </Helmet>

            <div className="container mx-auto px-4 lg:px-8 py-12">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="h-10 w-10 flex-shrink-0 rounded-full hover:bg-gray-100 border-gray-200">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-[#0B3D91]">Things to do wherever you're going</h1>
                        <p className="text-gray-600 mt-1">Find unforgettable experiences for your next trip.</p>
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

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                activeTab === cat 
                                ? 'bg-[#0B3D91] text-white shadow-md' 
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {filteredAttractions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredAttractions.map((attraction, index) => (
                            <motion.div
                                key={attraction.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                            >
                                <div className="relative h-48 bg-gray-200 overflow-hidden">
                                    <img 
                                        src={attraction.image} 
                                        alt={attraction.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                        loading="lazy"
                                        decoding="async"
                                        referrerPolicy="no-referrer"
                                        onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop"; }}
                                    />
                                    <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                                        <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
                                    </button>
                                    <div className="absolute bottom-3 left-3 px-2 py-1 bg-white/90 rounded-md text-xs font-semibold text-gray-800 flex items-center gap-1 shadow-sm backdrop-blur-sm">
                                        <MapPin className="w-3 h-3 text-[#0B3D91]" />
                                        {attraction.location}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex gap-2 mb-3">
                                        {attraction.tags.map(tag => (
                                            <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{tag}</span>
                                        ))}
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2 text-lg leading-tight line-clamp-2 h-12">{attraction.title}</h3>
                                    <div className="flex items-center gap-1 text-sm mb-4">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="font-bold">{attraction.rating}</span>
                                        <span className="text-gray-400">({attraction.reviews} reviews)</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <span className="font-bold text-gray-900">{attraction.price}</span>
                                        <button 
                                            onClick={() => navigate(`/attractions/${attraction.id}`)}
                                            className="text-sm font-semibold text-[#0B3D91] hover:underline"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900">No attractions found for {selectedCity}</h3>
                        <p className="text-gray-500">We're working on adding more experiences for this destination.</p>
                        <Button 
                            variant="link" 
                            onClick={() => { setActiveTab('All'); setSelectedCity('All'); }}
                            className="text-[#0B3D91] mt-2"
                        >
                            View All Destinations
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
};

export default AttractionsPage;