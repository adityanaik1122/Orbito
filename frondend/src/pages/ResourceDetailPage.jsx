import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, User, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { resources } from '@/data/resources';
import { useToast } from '@/components/ui/use-toast';

const ResourceDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    
    const resource = resources.find(r => r.id === id);

    if (!resource) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-[#0B3D91] mb-4">Resource Not Found</h2>
                    <Button onClick={() => navigate('/resources')} className="bg-[#0B3D91] text-white">Back to Resources</Button>
                </div>
            </div>
        );
    }

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast({
            title: "Link Copied!",
            description: "Share this resource with your friends."
        });
    };

    return (
        <>
            <Helmet>
                <title>{resource.title} - Orbito</title>
                <meta name="description" content={resource.description} />
            </Helmet>

            <div className="bg-white min-h-screen pb-20">
                {/* Hero */}
                <div className="relative h-[60vh] w-full">
                    <img 
                        src={resource.image} 
                        alt={resource.title} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D91]/90 via-black/20 to-transparent"></div>
                    <div className="absolute top-24 left-4 lg:left-8">
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border-none"
                            onClick={() => navigate('/resources')}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Resources
                        </Button>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-6 lg:p-12 text-white">
                        <div className="container mx-auto max-w-4xl">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-[#0B3D91] border border-white/20 rounded-full text-xs font-bold uppercase tracking-wide">
                                    {resource.category}
                                </span>
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wide">
                                    {resource.type}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                                {resource.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-white/80">
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    {resource.author}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    {resource.date}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    {resource.readTime}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 lg:px-6 py-12 max-w-4xl">
                    <div className="grid md:grid-cols-12 gap-12">
                        <div className="md:col-span-8 lg:col-span-9">
                             {resource.type === 'Video' && resource.videoUrl && (
                                <div className="aspect-video w-full mb-8 rounded-xl overflow-hidden shadow-lg bg-black">
                                    <iframe 
                                        src={resource.videoUrl} 
                                        title={resource.title}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            )}
                            
                            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                                <p className="text-xl text-gray-500 font-medium mb-8 leading-relaxed border-l-4 border-[#0B3D91] pl-4 italic">
                                    {resource.description}
                                </p>
                                <div dangerouslySetInnerHTML={{ __html: resource.content }} />
                            </div>

                             {/* Affiliate Section within Content */}
                            <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between flex-wrap gap-4">
                                <div>
                                    <h3 className="font-bold text-[#0B3D91] text-lg">Ready to book your trip?</h3>
                                    <p className="text-[#0B3D91]/80 text-sm">Get the best deals on hotels and flights for your next adventure.</p>
                                </div>
                                <Button className="bg-[#0B3D91] hover:bg-[#092C6B] text-white" onClick={() => window.open('https://www.booking.com', '_blank')}>
                                    Check Rates
                                </Button>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="md:col-span-4 lg:col-span-3 space-y-8">
                            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
                                <h3 className="font-bold text-gray-900 mb-4">Share this</h3>
                                <div className="flex gap-2 mb-6">
                                    <Button size="icon" variant="outline" className="rounded-full hover:text-[#0B3D91] hover:border-[#0B3D91]" onClick={handleShare}>
                                        <Facebook className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="outline" className="rounded-full hover:text-[#0B3D91] hover:border-[#0B3D91]" onClick={handleShare}>
                                        <Twitter className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="outline" className="rounded-full hover:text-[#0B3D91] hover:border-[#0B3D91]" onClick={handleShare}>
                                        <Linkedin className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="outline" className="rounded-full hover:text-[#0B3D91] hover:border-[#0B3D91]" onClick={handleShare}>
                                        <Share2 className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="border-t pt-6">
                                    <h3 className="font-bold text-gray-900 mb-2">Related Topics</h3>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md hover:bg-[#0B3D91] hover:text-white cursor-pointer transition-colors">Travel Tips</span>
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md hover:bg-[#0B3D91] hover:text-white cursor-pointer transition-colors">Budgeting</span>
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md hover:bg-[#0B3D91] hover:text-white cursor-pointer transition-colors">Solo Travel</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResourceDetailPage;