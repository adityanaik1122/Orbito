import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, MapPin, ArrowRight, TrendingUp, Star, Calendar, Heart, 
  Users, Clock, Shield, ChevronRight, CheckCircle2, CreditCard,
  Zap, Globe, MessageSquare, Play, BadgeCheck, Lock, Award
} from 'lucide-react';

const HomePage = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [naturalQuery, setNaturalQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [trendingDestinations, setTrendingDestinations] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);


  // Natural language examples for placeholder rotation
  const placeholderExamples = [
    "Plan a romantic week in Paris with wine tastings...",
    "Family trip to Tokyo, kid-friendly activities...",
    "Adventure trip to Bali, budget £2000...",
    "Weekend city break in Barcelona, foodie focus...",
    "Solo backpacking through Italy, 2 weeks..."
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  React.useEffect(() => {
  const interval = setInterval(() => {
    setPlaceholderIndex((i) => (i + 1) % placeholderExamples.length);
  }, 3000);
  return () => clearInterval(interval);
}, []);

  React.useEffect(() => {
  const mockTrending = [
    {
      name: "Paris",
      country: "France",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800",
      trips: "12,500+"
    },
    {
      name: "Bali",
      country: "Indonesia",
      image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=800",
      trips: "9,800+"
    },
    {
      name: "Tokyo",
      country: "Japan",
      image: "https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=800",
      trips: "11,200+"
    }
  ];

  setTrendingDestinations(mockTrending);
  setLoadingTrending(false);
}, []);



  const handleAISubmit = (e) => {
    e.preventDefault();
    if (naturalQuery.trim()) {
      navigate('/plan', { state: { naturalLanguageQuery: naturalQuery } });
    }
  };

  // Bookable tours with real pricing
  const bookableTours = [
    { 
      id: 'PT-001', 
      title: 'London Eye Fast Track + Thames Cruise', 
      location: 'London, UK',
      price: 52, 
      rating: 4.9, 
      reviews: 12543, 
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=600',
      badge: 'Best Seller',
      instantConfirmation: true
    },
    { 
      id: 'PT-004', 
      title: 'Harry Potter Studio Tour with Transport', 
      location: 'London, UK',
      price: 95, 
      rating: 4.9, 
      reviews: 24567, 
      image: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?q=80&w=600',
      badge: 'Top Rated',
      instantConfirmation: true
    },
    { 
      id: 'PT-008', 
      title: 'Paris Day Trip with Eiffel Tower Lunch', 
      location: 'Paris, France',
      price: 375, 
      rating: 4.9, 
      reviews: 12891, 
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600',
      badge: 'Premium',
      instantConfirmation: true
    },
    { 
      id: 'PT-006', 
      title: 'Stonehenge, Bath & Cotswolds Day Trip', 
      location: 'Wiltshire, UK',
      price: 95, 
      rating: 4.9, 
      reviews: 8234, 
      image: 'https://images.unsplash.com/photo-1599833975787-5d9f111d0e7a?q=80&w=600',
      badge: 'Includes Lunch',
      instantConfirmation: true
    },
  ];

  // Social proof stats
  const stats = [
    { value: '50,000+', label: 'Trips Planned' },
    { value: '£2.5M+', label: 'Tours Booked' },
    { value: '4.9/5', label: 'Average Rating' },
    { value: '500+', label: 'Destinations' },
  ];

  // How it works steps - Simple and clear
  const steps = [
    { 
      icon: MessageSquare, 
      title: 'Describe Your Trip', 
      description: 'Tell us where you want to go and what you like'
    },
    { 
      icon: Sparkles, 
      title: 'Get AI Itinerary', 
      description: 'Receive a personalized day-by-day plan in seconds'
    },
    { 
      icon: CreditCard, 
      title: 'Book Tours', 
      description: 'Instantly book activities with verified providers'
    },
  ];

  // Trust badges
  const trustBadges = [
    { icon: Lock, text: 'Secure Payments', color: 'text-green-600' },
    { icon: BadgeCheck, text: 'Verified Operators', color: 'text-blue-600' },
    { icon: Shield, text: 'Best Price Guarantee', color: 'text-[#0B3D91]' },
    { icon: Award, text: 'Award Winning', color: 'text-yellow-600' },
  ];

  return (
    <>
      <Helmet>
        <title>Orbito | AI Trip Planner + Book Real Tours Instantly</title>
        <meta name="description" content="Describe your trip, get an AI-powered itinerary, and book real tours from verified providers. Free trip planning with instant tour bookings and best price guarantee." />
        <meta name="keywords" content="AI travel planner, book tours, trip itinerary, travel booking, tour packages, AI trip planning" />
        <link rel="canonical" href="https://orbitotrip.com" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Orbito | AI Trip Planner + Book Real Tours" />
        <meta property="og:description" content="Get AI-powered trip itineraries with real bookable tours from verified providers. Free planning, instant booking, best prices." />
        <meta property="og:type" content="website" />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Orbito",
            "description": "AI-powered travel planning platform",
            "applicationCategory": "TravelApplication",
            "operatingSystem": "Web",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "2400"
            }
          }
        `}</script>
      </Helmet>

      <div className="bg-white min-h-screen flex flex-col">
        
        {/* HERO: Premium Apple/Google-inspired Design */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
          {/* Background with subtle overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2000&auto=format&fit=crop" 
              alt="Travel destination"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>
          </div>

          <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="max-w-5xl mx-auto space-y-8"
            >
              {/* Premium Typography - Mobile Optimized */}
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-tight leading-none">
                Travel
                <br />
                <span className="font-semibold">reimagined</span>
              </h1>
              
              {/* Subtle Description */}
              <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
                AI-powered itineraries tailored to you.
                <br className="hidden md:block" />
                Plan smarter. Travel better.
              </p>

              {/* Premium Search Interface */}
              <div className="pt-8">
                <div className="max-w-3xl mx-auto space-y-6">
                  {/* Search Bar */}
                  <form onSubmit={handleAISubmit}>
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                      <div className="relative flex items-center bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl">
                        <input
                          type="text"
                          placeholder="Where would you like to go?"
                          className="flex-1 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg min-h-[56px] bg-transparent border-0 focus:outline-none text-gray-900 placeholder:text-gray-400 font-light"
                          value={naturalQuery}
                          onChange={(e) => setNaturalQuery(e.target.value)}
                        />
                      </div>
                    </div>
                  </form>

                  {/* Try AI Planning Button - Centered */}
                  <div className="flex justify-center">
                    <Button 
                      onClick={() => navigate('/plan')}
                      className="bg-[#0B3D91] hover:bg-[#092C6B] text-white text-base font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 group"
                    >
                      <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      Try AI Planning
                    </Button>
                  </div>
                </div>
                
                {/* Minimal Info */}
                <p className="text-sm text-gray-400 mt-6 font-light">
                  Free to use • No account needed
                </p>
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
            >
              <div className="w-1 h-2 bg-white/50 rounded-full"></div>
            </motion.div>
          </div>
        </section>

        {/* FEATURED TOURS - Premium Grid */}
        <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-20"
            >
              <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight">
                Curated experiences
              </h2>
              <p className="text-xl text-gray-500 font-light">
                Handpicked tours from verified providers
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {bookableTours.map((tour, index) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/tours/${tour.id}`)}
                >
                  <div className="bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={tour.image} 
                        alt={tour.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-6 space-y-3">
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">{tour.location}</p>
                      <h3 className="font-medium text-gray-900 line-clamp-2 leading-snug">{tour.title}</h3>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                          <span className="font-medium text-gray-900">{tour.rating}</span>
                        </div>
                        <p className="text-lg font-medium text-gray-900">${tour.price}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-16">
              <Button 
                onClick={() => navigate('/tours')}
                variant="outline"
                className="px-8 py-3 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white rounded-full font-medium transition-all duration-300"
              >
                Explore all tours
              </Button>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS - Premium Apple Style */}
        <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-24"
            >
              <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight">
                Simple. Intelligent. Yours.
              </h2>
              <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto">
                Three steps to your perfect journey
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2, duration: 0.8 }}
                  className="text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#0B3D91] to-[#1E5BA8] rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <step.icon className="w-8 h-8 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-medium text-gray-900">{step.title}</h3>
                    <p className="text-gray-500 font-light leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST BADGES */}
        <section className="py-12 bg-white border-y border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              {trustBadges.map((badge, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-600">
                  <badge.icon className={`w-6 h-6 ${badge.color}`} />
                  <span className="font-medium">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Destinations - Secondary */}
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-[#0B3D91] font-bold text-3xl mb-2">Trending Destinations</h2>
                        <p className="text-gray-500 text-lg">Popular places to explore</p>
                    </div>
                    <Link to="/destinations" className="text-[#0B3D91] font-bold hover:underline flex items-center gap-1">
                        See All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {!loadingTrending && trendingDestinations.length > 0 && trendingDestinations.map((dest, index) => (

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
                {!loadingTrending && trendingDestinations.length === 0 && (
                  <p className="text-center text-gray-500 mt-6">
                    Trending destinations will appear here soon.
                  </p>
                )}

            </div>
        </section>

        {/* FINAL CTA - Premium Minimal */}
        <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-black text-white">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center space-y-8"
            >
              <h2 className="text-5xl md:text-7xl font-light tracking-tight">
                Ready to explore?
              </h2>
              <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
                Start planning your next adventure with AI
              </p>
              <Button 
                onClick={() => navigate('/plan')}
                className="mt-8 bg-[#0B3D91] text-white hover:bg-[#092C6B] font-medium px-12 py-6 text-lg rounded-full transition-all duration-300"
              >
                Get started
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