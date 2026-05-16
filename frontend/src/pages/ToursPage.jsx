import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Sparkles, Clock, MapPin, ExternalLink, Loader2 } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { supabase } from '@/lib/customSupabaseClient';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80';

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

const AffiliateCard = ({ tour }) => {
  const price = tour.price_from != null
    ? `From ${tour.currency || 'USD'} ${Number(tour.price_from).toFixed(0)}`
    : null;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col border border-gray-100">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={tour.image_url || FALLBACK_IMG}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {tour.category && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#0B3D91] text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-sm">
            {tour.category}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start gap-1 text-xs text-gray-500 mb-2">
          <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#0B3D91]" />
          <span>{tour.destination_city}, {tour.country}</span>
        </div>

        <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 mb-2 group-hover:text-[#0B3D91] transition-colors">
          {tour.title}
        </h3>

        {tour.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{tour.description}</p>
        )}

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          {tour.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {tour.duration}
            </span>
          )}
          {price && (
            <span className="font-semibold text-gray-800">{price}</span>
          )}
        </div>

        <div className="mt-auto">
          <a
            href={tour.viator_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#0B3D91] hover:bg-[#092C6B] text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> Book on Viator
          </a>
        </div>
      </div>
    </div>
  );
};

const ToursPage = () => {
  const navigate = useNavigate();
  const { t } = useLocale();
  const [search, setSearch] = useState('');
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('All');

  useEffect(() => {
    supabase
      .from('affiliate_tours')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error) setTours(data || []);
        setLoading(false);
      });
  }, []);

  const countries = ['All', ...new Set(tours.map((t) => t.country).filter(Boolean))].sort((a, b) => a === 'All' ? -1 : a.localeCompare(b));

  const filtered = tours.filter((t) => {
    const matchCountry = selectedCountry === 'All' || t.country === selectedCountry;
    const q = search.trim().toLowerCase();
    const matchSearch = !q || t.title?.toLowerCase().includes(q) || t.destination_city?.toLowerCase().includes(q) || t.country?.toLowerCase().includes(q);
    return matchCountry && matchSearch;
  });

  const handleSearch = () => {
    const slug = search.trim().toLowerCase().replace(/\s+/g, '-');
    if (slug) navigate(`/destinations/${slug}`);
  };

  return (
    <>
      <Helmet>
        <title>Tours & Activities | Orbito</title>
        <meta name="description" content="Browse and book amazing tours and activities worldwide. Discover experiences in London, Paris, Tokyo, Dubai and more." />
        <link rel="canonical" href="https://orbitotrip.com/tours" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Tours & Activities | Orbito" />
        <meta property="og:description" content="Browse and book amazing tours and activities worldwide. Discover experiences in London, Paris, Tokyo, Dubai and more." />
        <meta property="og:url" content="https://orbitotrip.com/tours" />
        <meta property="og:image" content="https://orbitotrip.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
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

        {/* Main content */}
        <div className="container mx-auto px-4 py-8">
          {/* Country filter */}
          {countries.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {countries.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCountry(c)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                    selectedCountry === c
                      ? 'bg-[#0B3D91] text-white border-[#0B3D91]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#0B3D91] hover:text-[#0B3D91]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-[#0B3D91]" />
            </div>
          ) : filtered.length > 0 ? (
            <>
              <p className="text-sm text-gray-500 mb-5">{filtered.length} experience{filtered.length !== 1 ? 's' : ''} found</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((tour) => (
                  <AffiliateCard key={tour.id} tour={tour} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
              <p className="text-4xl mb-4">🗺️</p>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {tours.length === 0 ? 'Tours coming soon' : `No tours in ${selectedCountry} yet`}
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                {tours.length === 0
                  ? "We're curating the best experiences. Check back soon!"
                  : 'Try a different country or browse all destinations.'}
              </p>
              {selectedCountry !== 'All' && (
                <Button variant="outline" onClick={() => setSelectedCountry('All')}>Show all tours</Button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ToursPage;
