import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, Mail, ExternalLink } from 'lucide-react';

const PressPage = () => {
    const pressReleases = [
        {
            date: 'Feb 5, 2025',
            title: 'Orbito Launches AI-Powered Travel Planning Platform',
            excerpt: 'Revolutionary platform uses artificial intelligence to create personalized travel itineraries in minutes.'
        },
        {
            date: 'Jan 15, 2025',
            title: 'Orbito Raises $10M Series A to Expand Global Operations',
            excerpt: 'Funding will be used to enhance AI capabilities and expand into new markets.'
        },
        {
            date: 'Dec 10, 2024',
            title: 'Orbito Partners with Major Airlines for Real-Time Integration',
            excerpt: 'New partnerships bring live flight data and booking capabilities to the platform.'
        }
    ];

    const mediaFeatures = [
        { outlet: 'TechCrunch', logo: 'TC', quote: 'The future of travel planning is here.' },
        { outlet: 'Forbes', logo: 'F', quote: 'Orbito is revolutionizing how we explore the world.' },
        { outlet: 'Wired', logo: 'W', quote: 'AI meets wanderlust in the best possible way.' },
        { outlet: 'The Verge', logo: 'TV', quote: 'A game-changer for travel enthusiasts.' }
    ];

    return (
        <>
            <Helmet>
                <title>Press - Orbito</title>
                <meta name="description" content="Orbito press releases, media kit, and company news." />
            </Helmet>
            <div className="container mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#0B3D91]">
                        Press & Media
                    </h1>
                    <p className="text-lg text-gray-600">
                        Get the latest news about Orbito, download our media kit, or get in touch with our press team.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid md:grid-cols-2 gap-6 mb-16"
                >
                    <div className="bg-gradient-to-r from-[#0B3D91] to-[#1E5BA8] rounded-2xl p-8 text-white">
                        <h2 className="text-2xl font-bold mb-4">Media Kit</h2>
                        <p className="text-white/90 mb-6">
                            Download our brand assets, logos, and company information for press coverage.
                        </p>
                        <Button className="bg-white text-[#0B3D91] hover:bg-gray-100">
                            <Download className="w-4 h-4 mr-2" />
                            Download Media Kit
                        </Button>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-[#0B3D91] mb-4">Press Contact</h2>
                        <p className="text-gray-600 mb-6">
                            For media inquiries, interviews, or press opportunities, please reach out to our team.
                        </p>
                        <Button className="bg-[#0B3D91] hover:bg-[#092C6B] text-white">
                            <Mail className="w-4 h-4 mr-2" />
                            press@orbito.com
                        </Button>
                    </div>
                </motion.div>

                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center text-[#0B3D91] mb-8">In the News</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {mediaFeatures.map((feature, index) => (
                            <motion.div
                                key={feature.outlet}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-md transition-shadow"
                            >
                                <div className="w-16 h-16 bg-[#0B3D91]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-xl font-bold text-[#0B3D91]">{feature.logo}</span>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">{feature.outlet}</h3>
                                <p className="text-gray-500 text-sm italic">"{feature.quote}"</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-3xl font-bold text-center text-[#0B3D91] mb-8">Press Releases</h2>
                    <div className="max-w-3xl mx-auto space-y-4">
                        {pressReleases.map((release, index) => (
                            <motion.div
                                key={release.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <span className="text-sm text-gray-500">{release.date}</span>
                                <h3 className="text-xl font-bold text-[#0B3D91] mt-1 mb-2">{release.title}</h3>
                                <p className="text-gray-600 mb-4">{release.excerpt}</p>
                                <a href="#" className="inline-flex items-center gap-2 text-[#0B3D91] font-semibold hover:gap-3 transition-all">
                                    Read More
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PressPage;
