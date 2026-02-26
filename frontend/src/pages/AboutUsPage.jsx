import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Users, Globe, Heart, Target, Phone, Mail, MapPin } from 'lucide-react';

const AboutUsPage = () => {
    const values = [
        {
            icon: Globe,
            title: 'Global Discovery',
            description: 'We believe everyone deserves to explore the world. Our AI-powered tools make travel planning accessible to all.'
        },
        {
            icon: Heart,
            title: 'Passion for Travel',
            description: 'Built by travelers, for travelers. We understand the joy of discovering new places and cultures.'
        },
        {
            icon: Users,
            title: 'Community First',
            description: 'Our community of travelers shares experiences, tips, and inspiration to help each other explore better.'
        },
        {
            icon: Target,
            title: 'Smart Planning',
            description: 'We leverage cutting-edge AI to create personalized itineraries that match your unique travel style.'
        }
    ];



    return (
        <>
            <Helmet>
                <title>About Us - Orbito</title>
                <meta name="description" content="Learn about Orbito's mission to revolutionize travel planning with AI-powered itineraries." />
            </Helmet>
            <div className="container mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#0B3D91]">
                        About Orbito
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        We're on a mission to transform how people plan and experience travel. 
                        Using artificial intelligence, we create personalized itineraries that turn 
                        dream trips into reality.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-gradient-to-r from-[#0B3D91] to-[#1E5BA8] rounded-3xl p-8 md:p-12 text-white mb-20"
                >
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-4">Our Story</h2>
                        <p className="text-white/90 leading-relaxed">
                            Founded in 2024, Orbito was born from a simple frustration: planning the perfect 
                            trip shouldn't take hours of research. Our founders, avid travelers themselves, 
                            envisioned a platform that could understand your preferences and create tailored 
                            itineraries in minutes. Today, we've helped thousands of travelers discover 
                            amazing destinations and create unforgettable memories.
                        </p>
                    </div>
                </motion.div>

                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-center text-[#0B3D91] mb-12">Our Values</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="w-12 h-12 bg-[#0B3D91]/10 rounded-xl flex items-center justify-center mb-4">
                                    <value.icon className="w-6 h-6 text-[#0B3D91]" />
                                </div>
                                <h3 className="text-xl font-bold text-[#0B3D91] mb-2">{value.title}</h3>
                                <p className="text-gray-600">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Contact Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm"
                >
                    <h2 className="text-3xl font-bold text-center text-[#0B3D91] mb-8">Get in Touch</h2>
                    <div className="max-w-2xl mx-auto">
                        <p className="text-center text-gray-600 mb-8">
                            Have questions or need assistance? We're here to help make your travel dreams come true.
                        </p>
                        <div className="grid md:grid-cols-3 gap-6">
                            <a 
                                href="tel:+447566215425" 
                                className="flex flex-col items-center p-6 rounded-xl border border-gray-200 hover:border-[#0B3D91] hover:shadow-md transition-all group"
                            >
                                <div className="w-12 h-12 bg-[#0B3D91]/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-[#0B3D91] transition-colors">
                                    <Phone className="w-6 h-6 text-[#0B3D91] group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                                <p className="text-sm text-gray-600 text-center">+44 7566 215425</p>
                            </a>
                            
                            <a 
                                href="mailto:TeamOrbito@protonmail.com" 
                                className="flex flex-col items-center p-6 rounded-xl border border-gray-200 hover:border-[#0B3D91] hover:shadow-md transition-all group"
                            >
                                <div className="w-12 h-12 bg-[#0B3D91]/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-[#0B3D91] transition-colors">
                                    <Mail className="w-6 h-6 text-[#0B3D91] group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                                <p className="text-sm text-gray-600 text-center break-all">TeamOrbito@protonmail.com</p>
                            </a>
                            
                            <div className="flex flex-col items-center p-6 rounded-xl border border-gray-200">
                                <div className="w-12 h-12 bg-[#0B3D91]/10 rounded-full flex items-center justify-center mb-3">
                                    <MapPin className="w-6 h-6 text-[#0B3D91]" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">Office</h3>
                                <p className="text-sm text-gray-600 text-center">
                                    30, Curzon Road<br />
                                    BH1 4PN, Bournemouth<br />
                                    United Kingdom
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </>
    );
};

export default AboutUsPage;
