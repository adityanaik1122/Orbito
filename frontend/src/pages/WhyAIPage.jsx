import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
    Sparkles, Clock, Brain, Target, Zap, Globe, 
    MessageSquare, RefreshCw, Shield, TrendingUp,
    CheckCircle2, ArrowRight, Star
} from 'lucide-react';

const WhyAIPage = () => {
    const benefits = [
        {
            icon: Clock,
            title: 'Save Hours of Research',
            description: 'What used to take days of planning now takes seconds. Our AI analyzes thousands of options to create your perfect itinerary instantly.',
            stat: '10+ hours',
            statLabel: 'saved per trip'
        },
        {
            icon: Target,
            title: 'Personalized Just for You',
            description: 'No generic tourist traps. Our AI learns your preferences, budget, and travel style to recommend experiences you\'ll actually love.',
            stat: '95%',
            statLabel: 'satisfaction rate'
        },
        {
            icon: Brain,
            title: 'Smart Recommendations',
            description: 'Powered by advanced machine learning that considers real reviews, local insights, and travel patterns to suggest hidden gems.',
            stat: '50,000+',
            statLabel: 'data points analyzed'
        },
        {
            icon: Zap,
            title: 'Instant Adjustments',
            description: 'Plans change? Our AI instantly adapts your itinerary based on weather, closures, or your mood. Real-time flexibility at your fingertips.',
            stat: 'Real-time',
            statLabel: 'updates'
        },
        {
            icon: Globe,
            title: 'Local Expertise, Everywhere',
            description: 'Access insider knowledge for any destination worldwide. Our AI is trained on local insights from every corner of the globe.',
            stat: '500+',
            statLabel: 'destinations covered'
        },
        {
            icon: MessageSquare,
            title: 'Natural Conversations',
            description: 'Just tell us what you want in plain English. "I want a romantic weekend in Paris with great food" — we\'ll handle the rest.',
            stat: 'Any language',
            statLabel: 'supported'
        }
    ];

    const comparisons = [
        { feature: 'Trip planning time', traditional: '10-20 hours', orbito: '< 2 minutes' },
        { feature: 'Personalization', traditional: 'Generic templates', orbito: 'AI-tailored for you' },
        { feature: 'Local insights', traditional: 'Outdated guidebooks', orbito: 'Real-time data' },
        { feature: 'Itinerary changes', traditional: 'Start over', orbito: 'Instant adjustments' },
        { feature: 'Hidden gems', traditional: 'Tourist traps', orbito: 'Curated discoveries' },
        { feature: 'Cost', traditional: '$50-200/itinerary', orbito: 'Free to start' },
    ];

    const testimonials = [
        {
            quote: "Orbito planned a better trip in 2 minutes than I could in 2 weeks. The AI somehow knew exactly what I'd love!",
            author: "Sarah M.",
            location: "New York",
            rating: 5
        },
        {
            quote: "As a solo traveler, having an AI that understands my preferences is like having a personal travel agent 24/7.",
            author: "James L.",
            location: "London",
            rating: 5
        },
        {
            quote: "The hidden gem recommendations were incredible. We found places we never would have discovered on our own.",
            author: "Maria & Carlos",
            location: "Barcelona",
            rating: 5
        }
    ];

    return (
        <>
            <Helmet>
                <title>Why AI-Powered Travel Planning - Orbito</title>
                <meta name="description" content="Discover how Orbito's AI transforms travel planning. Save time, get personalized recommendations, and discover hidden gems." />
            </Helmet>

            {/* Hero */}
            <section className="relative bg-gradient-to-br from-[#0B3D91] via-[#1E5BA8] to-[#0B3D91] text-white py-24 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
                </div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-medium">The Future of Travel Planning</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Why AI Changes <br />
                            <span className="text-[#60A5FA]">Everything</span>
                        </h1>
                        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                            Traditional travel planning is broken. Endless tabs, conflicting reviews, 
                            and hours of research. Our AI fixes all of that.
                        </p>
                        <Link to="/plan">
                            <Button className="bg-white text-[#0B3D91] hover:bg-gray-100 px-8 py-6 text-lg font-bold rounded-full">
                                <Sparkles className="w-5 h-5 mr-2" />
                                Try AI Planning Free
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#0B3D91] mb-4">
                            What Makes AI Different
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Our AI doesn't just search — it understands, learns, and creates 
                            travel experiences tailored specifically to you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={benefit.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1"
                            >
                                <div className="w-14 h-14 bg-[#0B3D91]/10 rounded-2xl flex items-center justify-center mb-6">
                                    <benefit.icon className="w-7 h-7 text-[#0B3D91]" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                                <p className="text-gray-600 mb-6">{benefit.description}</p>
                                <div className="pt-4 border-t border-gray-100">
                                    <span className="text-2xl font-bold text-[#0B3D91]">{benefit.stat}</span>
                                    <span className="text-gray-500 text-sm ml-2">{benefit.statLabel}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#0B3D91] mb-4">
                            Traditional vs. AI Planning
                        </h2>
                        <p className="text-gray-600 text-lg">
                            See the difference for yourself
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="grid grid-cols-3 bg-gray-50 p-4 font-bold text-sm">
                            <div className="text-gray-600">Feature</div>
                            <div className="text-center text-gray-600">Traditional Planning</div>
                            <div className="text-center text-[#0B3D91]">Orbito AI</div>
                        </div>
                        {comparisons.map((row, index) => (
                            <motion.div
                                key={row.feature}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="grid grid-cols-3 p-4 border-t border-gray-100 items-center"
                            >
                                <div className="font-medium text-gray-900">{row.feature}</div>
                                <div className="text-center text-gray-500">{row.traditional}</div>
                                <div className="text-center">
                                    <span className="inline-flex items-center gap-1 text-[#0B3D91] font-semibold">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        {row.orbito}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#0B3D91] mb-4">
                            How It Works
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Three simple steps to your perfect trip
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            { step: '01', title: 'Tell Us Your Dream', desc: 'Share your destination, interests, budget, and travel style in plain English.' },
                            { step: '02', title: 'AI Creates Your Plan', desc: 'Our AI analyzes millions of data points to craft a personalized itinerary in seconds.' },
                            { step: '03', title: 'Customize & Go', desc: 'Fine-tune your plan, book with partners, and enjoy a trip that\'s uniquely yours.' }
                        ].map((item, index) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="text-center relative"
                            >
                                <div className="text-6xl font-bold text-[#0B3D91]/10 mb-4">{item.step}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-600">{item.desc}</p>
                                {index < 2 && (
                                    <ArrowRight className="hidden md:block absolute top-8 -right-4 w-8 h-8 text-gray-300" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-gradient-to-br from-[#0B3D91] to-[#1E5BA8] text-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Loved by Travelers Worldwide
                        </h2>
                        <p className="text-white/80 text-lg">
                            Join 50,000+ happy travelers who plan smarter
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.author}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
                            >
                                <div className="flex mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-white/90 mb-6 italic">"{testimonial.quote}"</p>
                                <div>
                                    <p className="font-bold">{testimonial.author}</p>
                                    <p className="text-white/60 text-sm">{testimonial.location}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-[#0B3D91] mb-4">
                            Ready to Plan Smarter?
                        </h2>
                        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                            Join thousands of travelers who've discovered the joy of AI-powered trip planning. 
                            It's free to get started.
                        </p>
                        <Link to="/plan">
                            <Button className="bg-[#0B3D91] hover:bg-[#092C6B] text-white px-8 py-6 text-lg font-bold rounded-full">
                                <Sparkles className="w-5 h-5 mr-2" />
                                Start Planning with AI
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default WhyAIPage;
