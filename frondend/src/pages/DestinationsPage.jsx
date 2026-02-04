import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DestinationsPage = () => {
    const navigate = useNavigate();

    const popularDestinations = [
        { name: 'London', country: 'United Kingdom', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1000&auto=format&fit=crop', trips: '2,341' },
        { name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop', trips: '3,127' },
        { name: 'Rome', country: 'Italy', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000&auto=format&fit=crop', trips: '1,892' },
        { name: 'Barcelona', country: 'Spain', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=1000&auto=format&fit=crop', trips: '1,654' },
        { name: 'Amsterdam', country: 'Netherlands', image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=1000&auto=format&fit=crop', trips: '1,423' },
        { name: 'Prague', country: 'Czech Republic', image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=1000&auto=format&fit=crop', trips: '987' },
        { name: 'New York', country: 'USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1000&auto=format&fit=crop', trips: '4,102' },
        { name: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop', trips: '3,890' },
        { name: 'Dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1547483861-1c39ac98d6c4?q=80&w=1000&auto=format&fit=crop', trips: '2,150' }, // Updated image URL
    ];

    return (
        <>
            <Helmet>
                <title>Popular Destinations - Orbito</title>
                <meta name="description" content="Explore the most popular travel destinations around the world with Orbito." />
            </Helmet>

            <div className="container mx-auto px-4 lg:px-8 py-12">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="h-10 w-10 flex-shrink-0 rounded-full hover:bg-gray-100">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-[#0B3D91]">Popular Destinations</h1>
                        <p className="text-gray-600 mt-1">Discover top-rated cities loved by travelers worldwide.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {popularDestinations.map((dest, index) => (
                        <motion.div
                            key={dest.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -4 }}
                            onClick={() => navigate('/plan', { state: { destination: dest.name } })}
                            className="cursor-pointer group"
                        >
                            <div className="relative rounded-xl overflow-hidden aspect-[4/3] mb-3 shadow-sm group-hover:shadow-lg transition-all duration-300">
                                <img 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                    alt={dest.name} 
                                    src={dest.image} 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-5">
                                    <h3 className="text-white font-bold text-xl mb-0.5">{dest.name}</h3>
                                    <p className="text-white/80 text-xs font-bold uppercase tracking-wider">{dest.country}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 px-1">{dest.trips} trips planned</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default DestinationsPage;