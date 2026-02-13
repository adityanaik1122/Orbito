import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Briefcase, ArrowRight } from 'lucide-react';

const CareersPage = () => {
    const benefits = [
        'Competitive salary & equity',
        'Remote-first culture',
        'Unlimited PTO',
        'Health, dental & vision',
        'Annual travel stipend',
        'Learning & development budget'
    ];

    const openings = [
        {
            title: 'Senior Frontend Engineer',
            department: 'Engineering',
            location: 'Remote',
            type: 'Full-time'
        },
        {
            title: 'Backend Engineer',
            department: 'Engineering',
            location: 'Remote',
            type: 'Full-time'
        },
        {
            title: 'Product Designer',
            department: 'Design',
            location: 'Remote',
            type: 'Full-time'
        },
        {
            title: 'Machine Learning Engineer',
            department: 'AI/ML',
            location: 'Remote',
            type: 'Full-time'
        },
        {
            title: 'Content Marketing Manager',
            department: 'Marketing',
            location: 'Remote',
            type: 'Full-time'
        }
    ];

    return (
        <>
            <Helmet>
                <title>Careers - Orbito</title>
                <meta name="description" content="Join the Orbito team and help revolutionize travel planning. View our open positions." />
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

                <div>
                    <h2 className="text-3xl font-bold text-center text-[#0B3D91] mb-8">Open Positions</h2>
                    <div className="max-w-3xl mx-auto space-y-4">
                        {openings.map((job, index) => (
                            <motion.div
                                key={job.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#0B3D91]">{job.title}</h3>
                                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Briefcase className="w-4 h-4" />
                                                {job.department}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {job.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {job.type}
                                            </span>
                                        </div>
                                    </div>
                                    <Button className="bg-[#0B3D91] hover:bg-[#092C6B] text-white">
                                        Apply Now
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-center mt-16 p-8 bg-gray-50 rounded-2xl"
                >
                    <h3 className="text-xl font-bold text-[#0B3D91] mb-2">Don't see the right role?</h3>
                    <p className="text-gray-600 mb-4">
                        We're always looking for talented people. Send us your resume and we'll keep you in mind.
                    </p>
                    <Button variant="outline" className="border-[#0B3D91] text-[#0B3D91] hover:bg-[#0B3D91] hover:text-white">
                        Send General Application
                    </Button>
                </motion.div>
            </div>
        </>
    );
};

export default CareersPage;
