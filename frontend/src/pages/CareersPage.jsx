import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const CareersPage = () => {
    const benefits = [
        'Competitive salary & equity',
        'Remote-first culture',
        'Unlimited PTO',
        'Health, dental & vision',
        'Annual travel stipend',
        'Learning & development budget'
    ];

    return (
        <>
            <Helmet>
                <title>Careers - Orbito</title>
                <meta name="description" content="Join the Orbito team and help revolutionize travel planning." />
            </Helmet>
            <div className="container mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#0B3D91]">
                        Join Our Journey
                    </h1>
                    <p className="text-lg text-gray-600">
                        Help us build the future of travel. We're looking for passionate people
                        who want to make exploring the world easier for everyone.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-gradient-to-r from-[#0B3D91] to-[#1E5BA8] rounded-3xl p-8 md:p-12 text-white mb-16"
                >
                    <h2 className="text-2xl font-bold mb-6 text-center">Why Work at Orbito?</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-white rounded-full" />
                                <span className="text-white/90">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-center max-w-2xl mx-auto p-10 bg-gray-50 rounded-2xl border border-gray-100"
                >
                    <h2 className="text-2xl font-bold text-[#0B3D91] mb-3">No open positions right now</h2>
                    <p className="text-gray-600 mb-6">
                        We're not actively hiring at the moment, but we're always happy to hear from talented people.
                        Send us your details and we'll reach out when something opens up.
                    </p>
                    <Button
                        className="bg-[#0B3D91] hover:bg-[#092C6B] text-white"
                        onClick={() => window.location.href = 'mailto:TeamOrbito@protonmail.com?subject=General Application'}
                    >
                        Get in Touch
                    </Button>
                </motion.div>
            </div>
        </>
    );
};

export default CareersPage;
