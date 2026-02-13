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

  // How it works steps
  const steps = [
    { icon: MessageSquare, title: 'Tell Us Your Dream', description: 'Describe your ideal trip in plain English' },
    { icon: Sparkles, title: 'AI Creates Your Plan', description: 'Get a personalized itinerary in seconds' },
    { icon: CreditCard, title: 'Book & Save', description: 'Book verified tours with instant confirmation' },
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
        <title>Orbito | AI Travel Planner - Plan Your Trip in Seconds</title>
        <meta name="description" content="Plan your perfect trip in seconds with AI. Get personalized itineraries, book verified tours instantly, and save up to 20% on experiences. Trusted by 50,000+ travelers." />
        <meta name="keywords" content="AI travel planner, trip planner, travel itinerary, book tours, travel planning app" />
        <link rel="canonical" href="https://orbitotrip.com" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Orbito | AI Travel Planner - Plan Your Trip in Seconds" />
        <meta property="og:description" content="Tell our AI where you want to go and get a personalized itinerary instantly. Book verified tours with best price guarantee." />
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
        
        {/* HERO: Conversion-Focused with Natural Language Input */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2000&auto=format&fit=crop" 
              alt="Travel destination"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
          </div>

          <div className="relative z-10 container mx-auto px-4 text-center py-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              {/* Urgency/Value Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 px-4 py-2 rounded-full mb-6">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-white text-sm font-medium">Save up to 20% on tours when you book through AI planning</span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Just Tell Us What You Want.
                <br />
                <span className="bg-gradient-to-r from-[#60A5FA] to-[#34D399] bg-clip-text text-transparent">
                  AI Does the Rest.
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                Describe your dream trip in plain English. Our AI creates a personalized itinerary 
                with bookable tours, real prices, and instant confirmation.
              </p>

              {/* Natural Language AI Input */}
              <form onSubmit={handleAISubmit} className="max-w-3xl mx-auto mb-8">
                <div className="bg-white rounded-2xl shadow-2xl p-3">
                  <div className="relative">
                    <Sparkles className="absolute left-4 top-4 text-[#0B3D91] w-5 h-5" />
                    <textarea
                      placeholder={placeholderExamples[placeholderIndex]}
                      className="w-full h-24 md:h-20 pl-12 pr-4 pt-3 rounded-xl text-base md:text-lg border-0 focus:ring-0 outline-none text-gray-800 placeholder:text-gray-400 resize-none"
                      value={naturalQuery}
                      onChange={(e) => setNaturalQuery(e.target.value)}
                      onFocus={() => setIsTyping(true)}
                      onBlur={() => setIsTyping(false)}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-2 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Free to plan
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        Instant results
                      </span>
                    </div>
                    <Button 
                      type="submit" 
                      className="h-12 bg-gradient-to-r from-[#0B3D91] to-[#1E5BA8] hover:from-[#092C6B] hover:to-[#0B3D91] text-white rounded-xl px-8 text-base font-bold shadow-lg transition-all hover:scale-[1.02]"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create My Itinerary
                    </Button>
                  </div>
                </div>
              </form>

              {/* Trust Bar */}
              <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {['photo-1494790108377-be9c29b29330', 'photo-1507003211169-0a1dd7228f2d', 'photo-1472099645785-5658abf4ff4e', 'photo-1438761681033-6461ffad8d80'].map((id, i) => (
                      <img key={i} src={`https://images.unsplash.com/${id}?w=32&h=32&fit=crop&crop=face`} className="w-8 h-8 rounded-full border-2 border-white" alt="" />
                    ))}
                  </div>
                  <span className="text-white text-sm"><strong>50,000+</strong> trips planned</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  <span className="text-white text-sm ml-1"><strong>4.9/5</strong> (2,400+ reviews)</span>
                </div>
                <div className="hidden md:flex items-center gap-2 text-white">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Verified Operators</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
              <div className="w-1 h-2 bg-white/70 rounded-full"></div>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF STATS BAR */}
        <section className="py-8 bg-gray-50 border-y border-gray-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#0B3D91]">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BOOKABLE TOURS - Clear Monetization */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <BadgeCheck className="w-4 h-4" />
                Verified Tour Operators
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Book Tours Directly — Best Price Guaranteed
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Skip the middleman. Book verified experiences with instant confirmation 
                and real-time availability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {bookableTours.map((tour, index) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all group"
                >
                  <div className="relative h-48">
                    <img src={tour.image} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {tour.badge && (
                      <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {tour.badge}
                      </span>
                    )}
                    {tour.instantConfirmation && (
                      <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Instant
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{tour.location}</p>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 h-12 leading-tight">{tour.title}</h3>
                    <div className="flex items-center gap-1 text-sm mb-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{tour.rating}</span>
                      <span className="text-gray-400">({tour.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div>
                        <span className="text-xs text-gray-500">From</span>
                        <p className="text-lg font-bold text-gray-900">${tour.price}</p>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-[#0B3D91] hover:bg-[#092C6B] text-white"
                        onClick={() => navigate(`/tours/${tour.id}`)}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link 
                to="/tours" 
                className="inline-flex items-center gap-2 text-[#0B3D91] font-bold hover:underline text-lg"
              >
                Browse All Tours <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS - Clear Process */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Plan Your Trip in 3 Simple Steps
              </h2>
              <p className="text-lg text-gray-600 max-w-xl mx-auto">
                From idea to itinerary in under 2 minutes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="text-center relative"
                >
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] border-t-2 border-dashed border-gray-300" />
                  )}
                  <div className="w-24 h-24 bg-gradient-to-br from-[#0B3D91] to-[#1E5BA8] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-sm font-bold text-[#0B3D91] mb-2">STEP {i + 1}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
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

        {/* FINAL CTA - Strong Conversion */}
        <section className="py-24 bg-gradient-to-br from-[#0B3D91] via-[#1E5BA8] to-[#0B3D91] text-white text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">No credit card required</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Plan Your Dream Trip?
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Join 50,000+ travelers who've discovered smarter travel planning. 
                Create your AI-powered itinerary in seconds — completely free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/plan')}
                  className="bg-white text-[#0B3D91] hover:bg-gray-100 font-bold px-10 py-6 text-lg rounded-full shadow-lg transition-transform hover:scale-105"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Planning for Free
                </Button>
                <Button 
                  onClick={() => navigate('/tours')}
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 font-bold px-10 py-6 text-lg rounded-full"
                >
                  Browse Tours
                </Button>
              </div>
              <p className="text-blue-200 text-sm mt-6 flex items-center justify-center gap-4">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Free forever</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> No signup needed</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Instant results</span>
              </p>
            </motion.div>
          </div>
        </section>

        {/* Removed duplicate Footer from here. It is handled by the Layout component. */}
      </div>
    </>
  );
};

export default HomePage;