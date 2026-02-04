import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, PlayCircle, FileText, ArrowRight, Clock } from 'lucide-react';
import { resources } from '@/data/resources';

const ResourcesPage = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');

    const filteredResources = resources.filter(resource => {
        const matchesFilter = filter === 'All' || resource.type === filter;
        const matchesSearch = resource.title.toLowerCase().includes(search.toLowerCase()) || 
                              resource.category.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <>
            <Helmet>
                <title>Travel Resources - Orbito</title>
                <meta name="description" content="Expert guides and tips for your next adventure." />
            </Helmet>

            <div className="min-h-screen bg-gray-50 pb-20">
                {/* Dark Header Section */}
                <div className="bg-[#0B1D35] text-white py-20">
                    <div className="container mx-auto px-4 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">Travel Resources Hub</h1>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                                Expert guides, insider tips, and inspiring videos to help you travel smarter.
                            </p>

                            <div className="max-w-xl mx-auto relative">
                                <Input 
                                    className="h-12 pl-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-full focus:bg-white/20 transition-colors"
                                    placeholder="Search guides, tips, videos..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="bg-white border-b border-gray-200">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="flex items-center gap-4 py-4 overflow-x-auto">
                            {['All Resources', 'Guides', 'Videos'].map((type) => {
                                const value = type === 'All Resources' ? 'All' : type.slice(0, -1); // 'Guides' -> 'Guide'
                                return (
                                    <button
                                        key={type}
                                        onClick={() => setFilter(value)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                                            filter === value 
                                            ? 'bg-[#0B1D35] text-white' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="container mx-auto px-4 lg:px-8 py-12">
                    {filteredResources.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredResources.map((resource, index) => (
                                <motion.div
                                    key={resource.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group cursor-pointer border border-gray-100 flex flex-col h-full"
                                    onClick={() => navigate(`/resources/${resource.id}`)}
                                >
                                    <div className="relative aspect-video overflow-hidden">
                                        <img 
                                            src={resource.image} 
                                            alt={resource.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${resource.type === 'Video' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>
                                                {resource.type}
                                            </span>
                                        </div>
                                        {resource.type === 'Video' && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                                                <PlayCircle className="w-12 h-12 text-white opacity-90 group-hover:scale-110 transition-transform" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                            <span className="font-medium text-blue-600">{resource.category}</span>
                                            <span>•</span>
                                            <span>{resource.date}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                            {resource.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2 flex-grow">
                                            {resource.description}
                                        </p>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                {resource.readTime}
                                            </div>
                                            <span className="text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform flex items-center">
                                                Read More <ArrowRight className="w-4 h-4 ml-1" />
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900">No resources found</h3>
                            <p className="text-gray-500">Try adjusting your search terms or filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ResourcesPage;