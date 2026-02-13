import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Users, Globe, Heart, Target } from 'lucide-react';

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

    const team = [
        { name: 'Alex Chen', role: 'CEO & Co-Founder', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face' },
        { name: 'Sarah Johnson', role: 'CTO & Co-Founder', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face' },
        { name: 'Michael Park', role: 'Head of Product', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face' },
        { name: 'Emma Williams', role: 'Head of Design', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face' }
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

                <div>
                    <h2 className="text-3xl font-bold text-center text-[#0B3D91] mb-12">Meet Our Team</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        {team.map((member, index) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="text-center"
                            >
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                                />
                                <h3 className="font-bold text-[#0B3D91]">{member.name}</h3>
                                <p className="text-gray-500 text-sm">{member.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AboutUsPage;
