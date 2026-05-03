import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Sparkles } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

const POPULAR_DESTINATIONS = [
  { slug: 'london',    name: 'London',    flag: '🇬🇧', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=400&auto=format&fit=crop' },
  { slug: 'paris',     name: 'Paris',     flag: '🇫🇷', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=400&auto=format&fit=crop' },
  { slug: 'dubai',     name: 'Dubai',     flag: '🇦🇪', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=400&auto=format&fit=crop' },
  { slug: 'barcelona', name: 'Barcelona', flag: '🇪🇸', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=400&auto=format&fit=crop' },
  { slug: 'rome',      name: 'Rome',      flag: '🇮🇹', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=400&auto=format&fit=crop' },
  { slug: 'amsterdam', name: 'Amsterdam', flag: '🇳🇱', image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=400&auto=format&fit=crop' },
  { slug: 'tokyo',     name: 'Tokyo',     flag: '🇯🇵', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=400&auto=format&fit=crop' },
  { slug: 'bangkok',   name: 'Bangkok',   flag: '🇹🇭', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=400&auto=format&fit=crop' },
  { slug: 'singapore', name: 'Singapore', flag: '🇸🇬', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=400&auto=format&fit=crop' },
  { slug: 'new-york',  name: 'New York',  flag: '🇺🇸', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=400&auto=format&fit=crop' },
];

const VIATOR_WIDGET_SRC = 'https://www.viator.com/orion/partner/widget.js';

const ToursPage = () => {
  const navigate = useNavigate();
  const { t } = useLocale();
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Force re-initialization on every mount (SPA navigation fix)
    const existing = document.querySelector(`script[src="${VIATOR_WIDGET_SRC}"]`);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.src = VIATOR_WIDGET_SRC;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const s = document.querySelector(`script[src="${VIATOR_WIDGET_SRC}"]`);
      if (s) s.remove();
    };
  }, []);

  const handleSearch = () => {
    const slug = search.trim().toLowerCase().replace(/\s+/g, '-');
    if (slug) navigate(`/destinations/${slug}`);
  };

  return (
    <>
      <Helmet>
        <title>Tours & Activities | Orbito</title>
        <meta name="description" content="Browse and book amazing tours and activities worldwide. Discover experiences in London, Paris, Tokyo, Dubai and more." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-[#0B3D91] text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('tours_title')}
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              {t('tours_subtitle')}
            </p>

            <div className="max-w-2xl bg-white rounded-lg p-2 flex gap-2 shadow-lg shadow-blue-900/10">
              <div className="flex-1 flex items-center gap-2 px-3">
                <Search className="w-5 h-5 text-gray-400" />
                <Input
                  placeholder={t('tours_search_placeholder')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="border-0 focus-visible:ring-0 text-gray-900"
                />
              </div>
              <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90">
                {t('tours_search_button')}
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 mt-6 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Curated experiences
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-300" />
                Instant booking
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-300" />
                Transparent pricing
              </div>
            </div>
          </div>
        </div>

        {/* Popular Destinations Strip */}
        <div className="bg-white border-b py-5">
          <div className="container mx-auto px-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Popular Destinations</p>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
              {POPULAR_DESTINATIONS.map((dest) => (
                <Link
                  key={dest.slug}
                  to={`/destinations/${dest.slug}`}
                  className="flex-shrink-0 relative w-28 h-20 rounded-xl overflow-hidden group"
                >
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-1.5 left-0 right-0 text-center">
                    <span className="text-white text-xs font-bold drop-shadow">{dest.flag} {dest.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Viator Widget — Primary Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">Browse Experiences</h2>
              <span className="text-xs text-gray-400">Affiliate partner content · Viator</span>
            </div>
            <div
              data-vi-partner-id="P00281964"
              data-vi-widget-ref="W-e50d8b20-0e81-4083-a036-aad28f2f0562"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ToursPage;
