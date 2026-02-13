import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const BlogPage = () => {
    const featuredPost = {
        title: 'The Future of AI-Powered Travel Planning',
        excerpt: 'Discover how artificial intelligence is revolutionizing the way we plan and experience our travels, making personalized itineraries accessible to everyone.',
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop',
        date: 'Feb 10, 2025',
        readTime: '8 min read',
        category: 'Technology'
    };

    const posts = [
        {
            title: '10 Hidden Gems in Southeast Asia',
            excerpt: 'Escape the tourist crowds and discover these incredible off-the-beaten-path destinations.',
            image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=250&fit=crop',
            date: 'Feb 8, 2025',
            readTime: '6 min read',
            category: 'Destinations'
        },
        {
            title: 'How to Pack Like a Pro',
            excerpt: 'Master the art of efficient packing with our comprehensive guide to traveling light.',
            image: 'https://images.unsplash.com/photo-1553913861-c0a602e5feb7?w=400&h=250&fit=crop',
            date: 'Feb 5, 2025',
            readTime: '5 min read',
            category: 'Tips'
        },
        {
            title: 'Best Budget-Friendly European Cities',
            excerpt: 'Experience Europe without breaking the bank. These cities offer amazing value for travelers.',
            image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=250&fit=crop',
            date: 'Feb 1, 2025',
            readTime: '7 min read',
            category: 'Budget Travel'
        },
        {
            title: 'Solo Travel: A Complete Guide',
            excerpt: 'Everything you need to know about traveling alone, from safety tips to making friends on the road.',
            image: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=400&h=250&fit=crop',
            date: 'Jan 28, 2025',
            readTime: '10 min read',
            category: 'Guides'
        },
        {
            title: 'Sustainable Travel in 2025',
            excerpt: 'How to reduce your carbon footprint while still exploring the world you love.',
            image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop',
            date: 'Jan 25, 2025',
            readTime: '6 min read',
            category: 'Sustainability'
        },
        {
            title: 'Photography Tips for Travelers',
            excerpt: 'Capture stunning travel photos with these professional tips and techniques.',
            image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=250&fit=crop',
            date: 'Jan 20, 2025',
            readTime: '8 min read',
            category: 'Photography'
        }
    ];

    return (
        <>
            <Helmet>
                <title>Blog - Orbito</title>
                <meta name="description" content="Travel tips, destination guides, and insights from the Orbito team." />
            </Helmet>
            <div className="container mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#0B3D91]">
                        Orbito Blog
                    </h1>
                    <p className="text-lg text-gray-600">
                        Travel inspiration, tips, and insights to help you plan your perfect adventure.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-16"
                >
                    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                        <div className="grid md:grid-cols-2">
                            <img
                                src={featuredPost.image}
                                alt={featuredPost.title}
                                className="w-full h-64 md:h-full object-cover"
                            />
                            <div className="p-8 flex flex-col justify-center">
                                <span className="text-sm font-medium text-[#0B3D91] mb-2">{featuredPost.category}</span>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#0B3D91] mb-4">
                                    {featuredPost.title}
                                </h2>
                                <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {featuredPost.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {featuredPost.readTime}
                                    </span>
                                </div>
                                <Link
                                    to="#"
                                    className="inline-flex items-center gap-2 text-[#0B3D91] font-semibold hover:gap-3 transition-all"
                                >
                                    Read Article
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <motion.article
                            key={post.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <span className="text-xs font-medium text-[#0B3D91] bg-[#0B3D91]/10 px-2 py-1 rounded">
                                    {post.category}
                                </span>
                                <h3 className="text-xl font-bold text-[#0B3D91] mt-3 mb-2">
                                    {post.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {post.date}
                                    </span>
                                    <span>{post.readTime}</span>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </>
    );
};

export default BlogPage;
