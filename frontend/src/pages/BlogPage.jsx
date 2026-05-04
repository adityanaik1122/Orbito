import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calendar, Clock, ExternalLink, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiService } from '@/services/api';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const LIMIT = 21;

  useEffect(() => {
    apiService.getBlogCategories()
      .then((res) => setCategories(res.categories || ['All']))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchPosts(1, activeCategory, true);
  }, [activeCategory]);

  const fetchPosts = async (p, cat, reset = false) => {
    setLoading(true);
    try {
      const res = await apiService.getBlogPosts({ page: p, limit: LIMIT, category: cat });
      setPosts((prev) => reset ? (res.posts || []) : [...prev, ...(res.posts || [])]);
      setTotal(res.total || 0);
      setPage(p);
    } catch {
      // silently fail — show empty state
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => fetchPosts(page + 1, activeCategory, false);

  const featured = posts[0] || null;
  const rest = posts.slice(1);
  const hasMore = posts.length < total;

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <>
      <Helmet>
        <title>Travel Blog | Orbito</title>
        <meta name="description" content="Latest travel news, guides, tips and destination inspiration curated from the world's best travel blogs." />
        <link rel="canonical" href="https://orbitotrip.com/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Travel Blog | Orbito" />
        <meta property="og:description" content="Latest travel news, guides, tips and destination inspiration curated from the world's best travel blogs." />
        <meta property="og:url" content="https://orbitotrip.com/blog" />
        <meta property="og:image" content="https://orbitotrip.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Orbito Travel Blog",
          "description": "Latest travel news, guides, tips and destination inspiration.",
          "url": "https://orbitotrip.com/blog",
          "publisher": {
            "@type": "Organization",
            "name": "Orbito",
            "url": "https://orbitotrip.com"
          }
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-[#0B3D91] text-white py-14">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Travel Blog</h1>
              <p className="text-blue-100 text-lg max-w-xl mx-auto">
                Fresh inspiration every day — curated from the world's best travel blogs.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Category filter */}
        <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-[#0B3D91] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">

          {loading && posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-[#0B3D91]" />
              <p className="text-gray-500">Loading articles…</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-32">
              <p className="text-gray-500 text-lg mb-2">No articles yet.</p>
              <p className="text-gray-400 text-sm">Articles will appear here once the daily fetch job runs.</p>
            </div>
          ) : (
            <>
              {/* Featured post */}
              {featured && (
                <motion.a
                  href={featured.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="block mb-10 bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow group"
                >
                  <div className="grid md:grid-cols-2">
                    <div className="relative h-64 md:h-full overflow-hidden">
                      <img
                        src={featured.image_url || FALLBACK_IMAGE}
                        alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                      />
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <span className="text-xs font-bold text-[#0B3D91] uppercase tracking-widest mb-2">
                        {featured.category}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:text-[#0B3D91] transition-colors line-clamp-3">
                        {featured.title}
                      </h2>
                      <p className="text-gray-500 mb-5 line-clamp-3 leading-relaxed">{featured.summary}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-5">
                        <span className="font-medium text-gray-600">{featured.source_name}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {formatDate(featured.published_at)}
                        </span>
                        {featured.read_time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {featured.read_time}
                          </span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-2 text-[#0B3D91] font-semibold text-sm group-hover:gap-3 transition-all">
                        Read Article <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </motion.a>
              )}

              {/* Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((post, i) => (
                  <motion.a
                    key={post.id}
                    href={post.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: (i % 6) * 0.06 }}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col"
                  >
                    <div className="relative h-48 overflow-hidden flex-shrink-0">
                      <img
                        src={post.image_url || FALLBACK_IMAGE}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm text-[#0B3D91] text-xs font-bold px-2.5 py-1 rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#0B3D91] transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed flex-1">
                        {post.summary}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-600">{post.source_name}</span>
                          <span>·</span>
                          <span>{formatDate(post.published_at)}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#0B3D91]" />
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Load more */}
              {hasMore && (
                <div className="text-center mt-10">
                  <Button
                    variant="outline"
                    onClick={loadMore}
                    disabled={loading}
                    className="px-8 border-[#0B3D91] text-[#0B3D91] hover:bg-blue-50"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading…</>
                    ) : (
                      `Load more (${total - posts.length} remaining)`
                    )}
                  </Button>
                </div>
              )}

              {/* Attribution footer */}
              <p className="text-center text-xs text-gray-400 mt-12">
                Articles sourced from Nomadic Matt, The Points Guy, Atlas Obscura, Adventurous Kate, Travel + Leisure, Condé Nast Traveler, The Blonde Abroad, and TravelAwaits. All rights belong to original publishers.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogPage;
