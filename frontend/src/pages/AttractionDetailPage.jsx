import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { attractions } from '@/data/attractions';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, MapPin, Clock, Globe, Ticket, ExternalLink, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const AttractionDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const attraction = attractions.find(att => att.id === id);

    if (!attraction) {
        return (
            <div className="container mx-auto px-4 lg:px-6 py-12 text-center">
                <h1 className="text-3xl font-bold text-[#0B3D91]">Attraction not found</h1>
                <Button onClick={() => navigate('/attractions')} className="mt-4 bg-[#0B3D91] hover:bg-[#092C6B]">Back to Attractions</Button>
            </div>
        );
    }
    
    const handleAddToItinerary = () => {
        toast({
            title: "Added to Itinerary! ✨",
            description: `${attraction.title} has been added to your current trip.`
        });
    };

    const handleBookTicket = () => {
        toast({
            title: "Redirecting to Partner Site... 🎟️",
            description: "Finding the best ticket prices for you."
        });
        // window.open(...)
    };

    return (
        <>
            <Helmet>
                <title>{attraction.title} - Orbito</title>
                <meta name="description" content={attraction.description} />
            </Helmet>

            <div className="container mx-auto px-4 lg:px-6 py-12">
                <div className="mb-8">
                    <Button variant="outline" onClick={() => navigate(-1)} className="text-gray-700 rounded-full hover:bg-gray-100 border-gray-200">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                </div>

                <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="md:col-span-3"
                    >
                        <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 shadow-lg bg-gray-100">
                           <img 
                                className="w-full h-full object-cover" 
                                alt={attraction.title} 
                                src={attraction.image}
                                onError={(e) => {e.target.src = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop"}}
                           />
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            {attraction.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-blue-50 text-[#0B3D91] text-xs font-bold uppercase tracking-wide rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-[#0B3D91] mb-4 tracking-tight">{attraction.title}</h1>
                        <p className="text-lg text-gray-600 leading-relaxed mb-8">{attraction.description}</p>
                        
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex gap-4">
                            <div className="shrink-0">
                                <Info className="w-6 h-6 text-[#0B3D91]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#0B3D91] text-lg mb-1">Insider Tip</h3>
                                <p className="text-blue-900/80 leading-relaxed">Book tickets at least 2 weeks in advance to skip the lines, especially during summer months to ensure you get the best time slot.</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="md:col-span-2"
                    >
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50 p-6 space-y-6 sticky top-28">
                            <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Visitor Info</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Star className="w-5 h-5 fill-[#0B3D91] text-[#0B3D91]" />
                                        <span className="font-bold text-lg text-gray-900">{attraction.rating}</span>
                                        <span className="text-gray-500 text-sm">({attraction.reviews} reviews)</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-bold text-[#0B3D91] block">{attraction.price}</span>
                                    <span className="text-xs text-gray-500 font-medium">per person</span>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="flex items-start gap-3 text-gray-700">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                                        <MapPin className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <span className="block font-bold text-gray-900 text-sm mb-0.5">Address</span>
                                        <span className="text-sm text-gray-600 leading-snug block">{attraction.address || `${attraction.location}`}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                                        <Clock className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <span className="block font-bold text-gray-900 text-sm mb-0.5">Opening Hours</span>
                                        <span className="text-sm text-gray-600">{attraction.openingHours || 'Contact for hours'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                                        <Clock className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <span className="block font-bold text-gray-900 text-sm mb-0.5">Estimated Time</span>
                                        <span className="text-sm text-gray-600">{attraction.estTime || '1-2 hours'}</span>
                                    </div>
                                </div>
                                {attraction.website && (
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                                            <Globe className="w-5 h-5 text-gray-500" />
                                        </div>
                                        <div>
                                            <span className="block font-bold text-gray-900 text-sm mb-0.5">Website</span>
                                            <a href={attraction.website} target="_blank" rel="noopener noreferrer" className="text-sm text-[#0B3D91] font-medium hover:text-[#092C6B] hover:underline flex items-center gap-1">
                                                Visit Official Site <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                <Button onClick={handleBookTicket} size="lg" className="w-full bg-[#0B3D91] hover:bg-[#092C6B] text-white shadow-md shadow-blue-200 font-bold h-12 rounded-xl transition-all hover:-translate-y-0.5">
                                    <Ticket className="w-4 h-4 mr-2" />
                                    Book Tickets Now
                                </Button>
                                <Button onClick={handleAddToItinerary} size="lg" variant="outline" className="w-full border-blue-200 text-[#0B3D91] hover:bg-blue-50 hover:text-[#092C6B] font-semibold h-12 rounded-xl">
                                    Add to Itinerary Plan
                                </Button>
                            </div>
                            
                            <p className="text-xs text-center text-gray-400">
                                *Prices may vary based on season and availability.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default AttractionDetailPage;