import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Search, MapPin, ArrowRight, TrendingUp, Star, Calendar, Heart } from 'lucide-react';
// Removed duplicate import for Footer. It is already included in Layout.

const HomePage = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/plan', { state: { destination: searchQuery } });
    }
  };

  const trendingDestinations = [
    { name: 'London', country: 'United Kingdom', trips: '5,341', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Edinburgh', country: 'Scotland', trips: '2,127', image: 'https://images.unsplash.com/photo-1535448033526-c0e85c9e6968?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Paris', country: 'France', trips: '3,127', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Rome', country: 'Italy', trips: '1,892', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Barcelona', country: 'Spain', trips: '1,654', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Amsterdam', country: 'Netherlands', trips: '1,423', image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=1000&auto=format&fit=crop' },
  ];

  const topAttractions = [
    { title: 'Eiffel Tower, Paris', reviews: '8520', rating: 4.9, price: '€26', image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?q=80&w=1000&auto=format&fit=crop', tags: ['Landmark', 'Views'] },
    { title: 'Colosseum, Rome', reviews: '6240', rating: 4.8, price: '€18', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000&auto=format&fit=crop', tags: ['History', 'Ancient'] },
    { title: 'Sagrada Familia, Barcelona', reviews: '5090', rating: 4.9, price: '€26', image: 'https://images.unsplash.com/photo-1583779457711-3fd09c653ece?q=80&w=1000&auto=format&fit=crop', tags: ['Architecture', 'Religious'] },
    { title: 'Big Ben, London', reviews: '4520', rating: 4.7, price: 'Free', image: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?q=80&w=1000&auto=format&fit=crop', tags: ['Landmark', 'History'] },
  ];

  const featuredItineraries = [
      { id: 1, title: "Romantic Paris Getaway", duration: '4 Days', rating: 4.9, reviews: 534, price: 'Free', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1000&auto=format&fit=crop', tags: ['Romance', 'Culture'], location: 'Paris' },
      { id: 2, title: 'Ancient Rome Explorer', duration: '3 Days', rating: 4.8, reviews: 412, price: 'Free', image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?q=80&w=1000&auto=format&fit=crop', tags: ['History', 'Ancient'], location: 'Rome' },
      { id: 3, title: 'Tokyo Adventure', duration: '5 Days', rating: 4.9, reviews: 389, price: 'Free', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1000&auto=format&fit=crop', tags: ['Culture', 'Food'], location: 'Tokyo' },
  ];

  return (
    <>
      <Helmet>
        <title>Orbito | Your Next Adventure Awaits</title>
        <meta name="description" content="Discover iconic landmarks and hidden gems with personalized itineraries." />
      </Helmet>

      <div className="bg-white min-h-screen flex flex-col">
        
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
             <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2000&auto=format&fit=crop" 
                alt="Beautiful Mountain Landscape"
                className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70"></div>
          </div>

          <div className="relative z-10 container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
                Your next adventure <br/> awaits
              </h1>
              <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                Discover iconic landmarks and hidden gems worldwide with AI-powered personalized itineraries.
              </p>
              
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative flex items-center">
                <div className="relative w-full group">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-[#0B3D91] w-5 h-5 z-10" />
                    <input 
                        type="text" 
                        placeholder="Where do you want to go?"
                        className="w-full h-16 pl-14 pr-36 rounded-full text-lg border-none shadow-2xl focus:ring-2 focus:ring-[#0B3D91] outline-none text-gray-800 placeholder:text-gray-400 bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button 
                        type="submit" 
                        className="absolute right-2 top-2 bottom-2 bg-[#0B3D91] hover:bg-[#092C6B] text-white rounded-full px-8 text-base font-bold h-auto shadow-lg transition-all hover:scale-105"
                    >
                        <Search className="w-4 h-4 mr-2" />
                        Search
                    </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Trending Destinations */}
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <div className="flex items-center gap-2 text-[#0B3D91] font-bold text-3xl mb-2">
                            <h2>Trending destinations</h2>
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <p className="text-gray-500 text-lg">Most loved cities by travelers</p>
                    </div>
                    <Link to="/destinations" className="text-[#0B3D91] font-bold hover:underline flex items-center gap-1">
                        See More <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {trendingDestinations.map((dest, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group cursor-pointer"
                            onClick={() => navigate(`/tours?destination=${dest.name}`)}
                        >
                            <div className="relative h-64 rounded-2xl overflow-hidden mb-4 shadow-md group-hover:shadow-xl transition-all">
                                <img 
                                    src={dest.image} 
                                    alt={dest.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                                <div className="absolute bottom-5 left-5 text-white">
                                    <h3 className="text-2xl font-bold">{dest.name}</h3>
                                    <p className="text-white/90 font-medium text-sm">{dest.country}</p>
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm font-medium pl-1">{dest.trips} trips planned</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* Top Attractions */}
        <section className="py-16 bg-gray-50/50">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-[#0B3D91] font-bold text-3xl mb-2">Top attractions</h2>
                        <p className="text-gray-500 text-lg">Must-visit landmarks around the world</p>
                    </div>
                    <Link to="/attractions" className="text-[#0B3D91] font-bold hover:underline flex items-center gap-1">
                        See More <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {topAttractions.map((attraction, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        >
                            <div className="relative h-48 bg-gray-200">
                                <img src={attraction.image} alt={attraction.title} className="w-full h-full object-cover" />
                                <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                                    <Heart className="w-4 h-4 text-gray-400" />
                                </button>
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
                                    <button className="text-sm font-semibold text-[#0B3D91] hover:underline">View Details</button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* Featured Itineraries */}
        <section className="py-20 bg-white">
             <div className="container mx-auto px-4 lg:px-8">
                 <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-[#0B3D91] font-bold text-3xl mb-2">Featured Itineraries</h2>
                        <p className="text-gray-500 text-lg">Handpicked trips created by our community</p>
                    </div>
                    <Link to="/itineraries" className="text-[#0B3D91] font-bold hover:underline flex items-center gap-1">
                        See More <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featuredItineraries.map((itinerary, index) => (
                         <motion.div
                            key={itinerary.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group border border-gray-100"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                                <img 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    alt={itinerary.title} 
                                    src={itinerary.image} 
                                />
                                <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md text-gray-400 hover:text-[#0B3D91] transition-colors">
                                    <Heart className="w-4 h-4" />
                                </button>
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
             </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-[#0B3D91] text-white text-center">
            <div className="container mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to start planning?</h2>
                    <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                        Create your perfect itinerary in minutes with our smart AI-powered suggestions.
                    </p>
                    <Button 
                        onClick={() => navigate('/plan')}
                        className="bg-white text-[#0B3D91] hover:bg-gray-100 font-bold px-8 py-6 text-lg rounded-full shadow-lg transition-transform hover:scale-105"
                    >
                        Start Planning Now
                    </Button>
                </motion.div>
            </div>
        </section>

        {/* Removed duplicate Footer from here. It is handled by the Layout component. */}
      </div>
    </>
  );
};

export default HomePage;