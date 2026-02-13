import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, MapPin, Phone, Clock, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ContactUsPage = () => {
    const { toast } = useToast();

    const handleSubmit = (e) => {
        e.preventDefault();
        toast({
            title: "Message sent! ✉️",
            description: "We'll get back to you as soon as possible.",
        });
        e.target.reset();
    };

    const contactInfo = [
        {
            icon: Mail,
            title: 'Email',
            value: 'support@orbito.com',
            description: 'We reply within 24 hours'
        },
        {
            icon: Phone,
            title: 'Phone',
            value: '+1 (555) 123-4567',
            description: 'Mon-Fri 9am-6pm EST'
        },
        {
            icon: MapPin,
            title: 'Office',
            value: 'San Francisco, CA',
            description: '123 Travel Street, Suite 100'
        },
        {
            icon: Clock,
            title: 'Hours',
            value: '24/7 Support',
            description: 'For urgent travel issues'
        }
    ];

    return (
        <>
            <Helmet>
                <title>Contact Us - Orbito</title>
                <meta name="description" content="Get in touch with the Orbito team. We're here to help with any questions." />
            </Helmet>
            <div className="container mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#0B3D91]">
                        Get in Touch
                    </h1>
                    <p className="text-lg text-gray-600">
                        Have a question or feedback? We'd love to hear from you. 
                        Send us a message and we'll respond as soon as possible.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="grid sm:grid-cols-2 gap-6 mb-8">
                            {contactInfo.map((info, index) => (
                                <div
                                    key={info.title}
                                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="w-10 h-10 bg-[#0B3D91]/10 rounded-lg flex items-center justify-center mb-3">
                                        <info.icon className="w-5 h-5 text-[#0B3D91]" />
                                    </div>
                                    <h3 className="font-bold text-gray-900">{info.title}</h3>
                                    <p className="text-[#0B3D91] font-medium">{info.value}</p>
                                    <p className="text-gray-500 text-sm">{info.description}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gradient-to-r from-[#0B3D91] to-[#1E5BA8] rounded-2xl p-8 text-white">
                            <h3 className="text-xl font-bold mb-4">Quick Tip</h3>
                            <p className="text-white/90">
                                For faster support, check our Help Center first. Many common questions 
                                are already answered there, and you might find what you need instantly!
                            </p>
                            <a
                                href="/help"
                                className="inline-block mt-4 text-white font-semibold underline hover:no-underline"
                            >
                                Visit Help Center →
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8">
                            <h2 className="text-2xl font-bold text-[#0B3D91] mb-6">Send us a message</h2>
                            
                            <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name
                                    </label>
                                    <Input
                                        type="text"
                                        name="firstName"
                                        placeholder="John"
                                        required
                                        className="h-11"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name
                                    </label>
                                    <Input
                                        type="text"
                                        name="lastName"
                                        placeholder="Doe"
                                        required
                                        className="h-11"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="john@example.com"
                                    required
                                    className="h-11"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject
                                </label>
                                <Input
                                    type="text"
                                    name="subject"
                                    placeholder="How can we help?"
                                    required
                                    className="h-11"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    rows={5}
                                    placeholder="Tell us more about your inquiry..."
                                    required
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent resize-none"
                                />
                            </div>

                            <Button type="submit" className="w-full h-12 bg-[#0B3D91] hover:bg-[#092C6B] text-white">
                                <Send className="w-4 h-4 mr-2" />
                                Send Message
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default ContactUsPage;
