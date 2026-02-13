import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Search, ChevronDown, ChevronUp, BookOpen, CreditCard, Map, Settings, MessageCircle } from 'lucide-react';

const HelpCenterPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [openFaq, setOpenFaq] = useState(null);

    const categories = [
        { icon: BookOpen, title: 'Getting Started', description: 'Learn the basics of using Orbito', count: 8 },
        { icon: Map, title: 'Trip Planning', description: 'Create and manage your itineraries', count: 12 },
        { icon: CreditCard, title: 'Billing & Payments', description: 'Subscription and payment questions', count: 6 },
        { icon: Settings, title: 'Account Settings', description: 'Manage your profile and preferences', count: 5 },
        { icon: MessageCircle, title: 'Contact Support', description: 'Get help from our team', count: 3 }
    ];

    const faqs = [
        {
            question: 'How does Orbito create personalized itineraries?',
            answer: 'Orbito uses advanced AI to analyze your preferences, travel style, budget, and interests. It then creates customized day-by-day itineraries with activities, restaurants, and attractions that match your unique needs.'
        },
        {
            question: 'Can I edit my itinerary after it\'s generated?',
            answer: 'Absolutely! You can fully customize any AI-generated itinerary. Add, remove, or rearrange activities, change timings, and add your own notes. Your itinerary is completely flexible.'
        },
        {
            question: 'Is my travel data secure?',
            answer: 'Yes, we take security seriously. All your data is encrypted and stored securely. We never share your personal information with third parties without your consent. Read our Privacy Policy for more details.'
        },
        {
            question: 'How do I share my itinerary with friends?',
            answer: 'You can share your itinerary by clicking the "Share" button on any saved itinerary. You can generate a shareable link, invite collaborators via email, or export to PDF.'
        },
        {
            question: 'What\'s included in the free plan?',
            answer: 'The free plan includes 2 AI-generated itineraries per month, standard AI suggestions, the ability to share itineraries, and save up to 3 itineraries. Upgrade for more features!'
        },
        {
            question: 'Can I use Orbito offline?',
            answer: 'You can export your itineraries to PDF for offline access. We\'re also working on an offline mode for the mobile app that will be available soon.'
        }
    ];

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <>
            <Helmet>
                <title>Help Center - Orbito</title>
                <meta name="description" content="Get help with Orbito. Browse FAQs, guides, and contact our support team." />
            </Helmet>
            <div className="container mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#0B3D91]">
                        How can we help?
                    </h1>
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search for help articles..."
                            className="h-14 pl-12 pr-4 text-lg border-gray-200"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div className="w-12 h-12 bg-[#0B3D91]/10 rounded-xl flex items-center justify-center mb-4">
                                <category.icon className="w-6 h-6 text-[#0B3D91]" />
                            </div>
                            <h3 className="text-lg font-bold text-[#0B3D91] mb-1">{category.title}</h3>
                            <p className="text-gray-500 text-sm mb-2">{category.description}</p>
                            <span className="text-xs text-[#0B3D91] font-medium">{category.count} articles</span>
                        </motion.div>
                    ))}
                </div>

                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-[#0B3D91] mb-8 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-semibold text-gray-900">{faq.question}</span>
                                    {openFaq === index ? (
                                        <ChevronUp className="w-5 h-5 text-[#0B3D91] flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                    )}
                                </button>
                                {openFaq === index && (
                                    <div className="px-6 pb-4">
                                        <p className="text-gray-600">{faq.answer}</p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-center mt-16 p-8 bg-gradient-to-r from-[#0B3D91] to-[#1E5BA8] rounded-2xl text-white"
                >
                    <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
                    <p className="text-white/90 mb-6">
                        Our support team is here for you. Reach out and we'll get back to you as soon as possible.
                    </p>
                    <a
                        href="/contact"
                        className="inline-block bg-white text-[#0B3D91] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Contact Support
                    </a>
                </motion.div>
            </div>
        </>
    );
};

export default HelpCenterPage;
