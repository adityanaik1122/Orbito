import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DestinationsPage = () => {
    const navigate = useNavigate();

    const popularDestinations = [
        // Europe
        { name: 'London', country: 'United Kingdom', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1000&auto=format&fit=crop', trips: '5,341' },
        { name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop', trips: '6,127' },
        { name: 'Rome', country: 'Italy', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000&auto=format&fit=crop', trips: '4,892' },
        { name: 'Barcelona', country: 'Spain', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=1000&auto=format&fit=crop', trips: '3,654' },
        { name: 'Amsterdam', country: 'Netherlands', image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=1000&auto=format&fit=crop', trips: '2,423' },
        { name: 'Prague', country: 'Czech Republic', image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=1000&auto=format&fit=crop', trips: '1,987' },
        { name: 'Vienna', country: 'Austria', image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?q=80&w=1000&auto=format&fit=crop', trips: '1,654' },
        { name: 'Lisbon', country: 'Portugal', image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?q=80&w=1000&auto=format&fit=crop', trips: '2,102' },
        { name: 'Athens', country: 'Greece', image: 'https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=1000&auto=format&fit=crop', trips: '1,845' },
        // Americas
        { name: 'New York', country: 'USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1000&auto=format&fit=crop', trips: '7,102' },
        { name: 'Los Angeles', country: 'USA', image: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?q=80&w=1000&auto=format&fit=crop', trips: '4,521' },
        { name: 'Miami', country: 'USA', image: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?q=80&w=1000&auto=format&fit=crop', trips: '3,210' },
        { name: 'Rio de Janeiro', country: 'Brazil', image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1000&auto=format&fit=crop', trips: '2,876' },
        { name: 'Mexico City', country: 'Mexico', image: 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?q=80&w=1000&auto=format&fit=crop', trips: '2,341' },
        { name: 'Buenos Aires', country: 'Argentina', image: 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?q=80&w=1000&auto=format&fit=crop', trips: '1,654' },
        // Asia
        { name: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop', trips: '5,890' },
        { name: 'Singapore', country: 'Singapore', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1000&auto=format&fit=crop', trips: '4,230' },
        { name: 'Bangkok', country: 'Thailand', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=1000&auto=format&fit=crop', trips: '3,987' },
        { name: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop', trips: '4,521' },
        { name: 'Seoul', country: 'South Korea', image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=1000&auto=format&fit=crop', trips: '3,102' },
        { name: 'Hong Kong', country: 'China', image: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?q=80&w=1000&auto=format&fit=crop', trips: '2,876' },
        // India
        { name: 'Rishikesh', country: 'India', image: 'https://images.unsplash.com/photo-1592385432464-5e3d91040a90?q=80&w=1000&auto=format&fit=crop', trips: '2,876' },
        { name: 'Kerala', country: 'India', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop', trips: '3,654' },
        { name: 'Ladakh', country: 'India', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1000&auto=format&fit=crop', trips: '2,341' },
        { name: 'Meghalaya', country: 'India', image: 'https://images.unsplash.com/photo-1625058502211-f1d92e5565a4?q=80&w=1000&auto=format&fit=crop', trips: '1,876' },
        { name: 'Manali', country: 'India', image: 'https://images.unsplash.com/photo-1626621331169-5f34be280ed9?q=80&w=1000&auto=format&fit=crop', trips: '3,102' },
        { name: 'Varanasi', country: 'India', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1000&auto=format&fit=crop', trips: '2,543' },
        { name: 'Jaipur', country: 'India', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1000&auto=format&fit=crop', trips: '3,987' },
        { name: 'Goa', country: 'India', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000&auto=format&fit=crop', trips: '4,521' },
        // Middle East & Africa
        { name: 'Dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000&auto=format&fit=crop', trips: '4,150' },
        { name: 'Istanbul', country: 'Turkey', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1000&auto=format&fit=crop', trips: '3,456' },
        { name: 'Marrakech', country: 'Morocco', image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?q=80&w=1000&auto=format&fit=crop', trips: '1,987' },
        { name: 'Cape Town', country: 'South Africa', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=1000&auto=format&fit=crop', trips: '2,341' },
        // Oceania
        { name: 'Sydney', country: 'Australia', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1000&auto=format&fit=crop', trips: '3,654' },
        { name: 'Melbourne', country: 'Australia', image: 'https://images.unsplash.com/photo-1514395462725-fb4566210144?q=80&w=1000&auto=format&fit=crop', trips: '2,876' },
        { name: 'Auckland', country: 'New Zealand', image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=1000&auto=format&fit=crop', trips: '1,543' },
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