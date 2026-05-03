import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import TourCard from '@/components/TourCard';
import FilterSidebar from '@/components/FilterSidebar';
import { apiService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
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
];

const ToursPage = () => {
  const { toast } = useToast();
  const { t } = useLocale();
  const [searchParams] = useSearchParams();
  const urlDestination = searchParams.get('destination');
  
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filters, setFilters] = useState({
    destination: urlDestination || '',
    country: '',
    categories: [],
    durations: [],
    priceRange: [0, 500],
    sortBy: 'rating'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('all');

  const TourSkeleton = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="flex items-center justify-between pt-4">
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-16" />
            <div className="h-6 bg-gray-200 rounded w-20" />
          </div>
          <div className="h-8 bg-gray-200 rounded w-24" />
        </div>
      </div>
    </div>
  );

  const categories = [
    'All',
    'Attractions',
    'Cultural',
    'Sightseeing',
    'Entertainment',
    'Dining',
    'Adventure',
    'Historical Sites'
  ];

  const popularCountries = [
    { name: 'All', code: 'all', flag: '🌍' },
    { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', cities: ['London', 'Edinburgh', 'Manchester'] },
    { name: 'France', code: 'FR', flag: '🇫🇷', cities: ['Paris', 'Nice', 'Lyon'] },
    { name: 'Italy', code: 'IT', flag: '🇮🇹', cities: ['Rome', 'Venice', 'Florence'] },
    { name: 'Spain', code: 'ES', flag: '🇪🇸', cities: ['Barcelona', 'Madrid', 'Seville'] },
    { name: 'United States', code: 'US', flag: '🇺🇸', cities: ['New York', 'Los Angeles', 'Las Vegas'] },
    { name: 'UAE', code: 'AE', flag: '🇦🇪', cities: ['Dubai', 'Abu Dhabi'] },
    { name: 'Netherlands', code: 'NL', flag: '🇳🇱', cities: ['Amsterdam', 'Rotterdam'] },
  ];

  useEffect(() => {
    fetchTours();
  }, []);

  useEffect(() => {
    const widgetSrc = 'https://www.viator.com/orion/partner/widget.js';
    const existing = document.querySelector(`script[src="${widgetSrc}"]`);
    if (!existing) {
      const script = document.createElement('script');
      script.src = widgetSrc;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTours(filters, true);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.destination, filters.country, filters.sortBy]);

  const fetchTours = async (appliedFilters = filters, silent = false) => {
    if (silent) {
      setIsFiltering(true);
    } else {
      setLoading(true);
    }
    try {
      const filterParams = {
        destination: appliedFilters.destination,
        country: appliedFilters.country,
        categories: appliedFilters.categories?.join(',') || '',
        durations: appliedFilters.durations?.join(',') || '',
        minPrice: appliedFilters.priceRange?.[0] || 0,
        maxPrice: appliedFilters.priceRange?.[1] || 500,
        sortBy: appliedFilters.sortBy
      };
      
      const response = await apiService.getTours(filterParams);
      setTours(response.tours || []);
      setApiError(false);
    } catch (error) {
      console.error('Error fetching tours:', error);
      setTours([]);
      setApiError(true);
    } finally {
      setLoading(false);
      setIsFiltering(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    fetchTours(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      destination: '',
      country: '',
      categories: [],
      durations: [],
      priceRange: [0, 500],
      sortBy: 'rating'
    };
    setFilters(clearedFilters);
    setSelectedCountry('all');
    fetchTours(clearedFilters);
  };

  const handleCountrySelect = (countryCode) => {
    setSelectedCountry(countryCode);
    const newFilters = {
      ...filters,
      country: countryCode === 'all' ? '' : countryCode
    };
    setFilters(newFilters);
    fetchTours(newFilters);
  };

  const toggleCategory = (category) => {
    const normalized = category === 'All' ? [] : [category];
    const next = {
      ...filters,
      categories: normalized,
    };
    setFilters(next);
    fetchTours(next, true);
  };

  return (
    <>
      <Helmet>
        <title>Tours & Activities | Orbito</title>
        <meta name="description" content="Browse and book amazing tours and activities from multiple providers including Premium Tours and Viator." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-[#0B3D91] text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('tours_title')}
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              {t('tours_subtitle')}
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl bg-white rounded-lg p-2 flex gap-2 shadow-lg shadow-blue-900/10">
              <div className="flex-1 flex items-center gap-2 px-3">
                <Search className="w-5 h-5 text-gray-400" />
                <Input
                  placeholder={t('tours_search_placeholder')}
                  value={filters.destination}
                  onChange={(e) => setFilters(prev => ({ ...prev, destination: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
                  className="border-0 focus-visible:ring-0 text-gray-900"
                />
              </div>
              <Button 
                onClick={handleApplyFilters}
                className="bg-primary hover:bg-primary/90"
              >
                {t('tours_search_button')}
              </Button>
            </div>

            <div className="flex flex-wrap gap-3 mt-5">
              {['All', 'Adventure', 'Cultural', 'Food', 'Sightseeing'].map((category) => (
                <Button
                  key={category}
                  size="sm"
                  variant={filters.categories?.[0] === category || (category === 'All' && (!filters.categories || filters.categories.length === 0)) ? 'default' : 'outline'}
                  onClick={() => toggleCategory(category)}
                  className={category === 'All' ? 'bg-white/15 text-white border-white/20 hover:bg-white/25' : 'border-white/20 text-white hover:bg-white/15'}
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mt-6 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Curated experiences
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-300" />
                Instant booking on partner sites
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-300" />
                Transparent pricing
              </div>
            </div>
          </div>
        </div>

        {/* Country Navigation */}
        <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
              {popularCountries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => handleCountrySelect(country.code)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    selectedCountry === country.code
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <span className="text-xl">{country.flag}</span>
                  <span className="font-medium">{country.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Destinations Strip */}
        {!filters.destination && !filters.country && (
          <div className="bg-gray-50 border-b py-6">
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
        )}

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-6">
            {/* Filter Sidebar */}
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
              isOpen={showFilters}
              onClose={() => setShowFilters(false)}
            />

            {/* Main Content */}
            <div className="flex-1">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <Button
                  onClick={() => setShowFilters(true)}
                  variant="outline"
                  className="w-full"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  {t('tours_filters_button')}
                  {(() => {
                    const count = 
                      (filters.categories?.length || 0) +
                      (filters.durations?.length || 0) +
                      (filters.priceRange?.[0] > 0 || filters.priceRange?.[1] < 500 ? 1 : 0);
                    return count > 0 ? ` (${count})` : '';
                  })()}
                </Button>
              </div>

              {/* Sort and View Options */}
              <div className="bg-white rounded-lg shadow p-4 mb-6 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600">
                      {t('tours_found')} <span className="font-semibold">{tours.length}</span> {t('tours_label')}
                    </span>
                    {isFiltering && (
                      <span className="text-xs text-gray-400 flex items-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Updating…
                      </span>
                    )}
                  </div>

                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => {
                      const newFilters = { ...filters, sortBy: value };
                      setFilters(newFilters);
                      fetchTours(newFilters);
                    }}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">{t('tours_sort_rating')}</SelectItem>
                      <SelectItem value="price_low">{t('tours_sort_low')}</SelectItem>
                      <SelectItem value="price_high">{t('tours_sort_high')}</SelectItem>
                      <SelectItem value="popular">{t('tours_sort_popular')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {filters.destination && (
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold">
                      Destination: {filters.destination}
                    </span>
                  )}
                  {filters.country && (
                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full font-semibold">
                      Country: {filters.country}
                    </span>
                  )}
                  {(filters.categories || []).map((cat) => (
                    <span key={cat} className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">
                      {cat}
                    </span>
                  ))}
                  {(filters.durations || []).map((dur) => (
                    <span key={dur} className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-semibold">
                      {dur}
                    </span>
                  ))}
                  {(filters.priceRange?.[0] > 0 || filters.priceRange?.[1] < 500) && (
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-semibold">
                      Price: {filters.priceRange[0]} - {filters.priceRange[1]}
                    </span>
                  )}
                </div>
              </div>

              {/* Results */}
              {apiError && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 mb-6">
                  Tours are coming soon. We’re finishing the provider integration, so search results may be empty for now.
                </div>
              )}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <TourSkeleton key={`tour-skeleton-${idx}`} />
                  ))}
                </div>
              ) : tours.length === 0 ? (
                <div className="text-center py-20">
                  <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                    {t('tours_no_results_title')}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {t('tours_no_results_desc')}
                  </p>
                  <Button onClick={handleClearFilters} variant="outline">
                    {t('tours_clear_filters')}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {tours.map((tour) => (
                    <TourCard key={tour.external_id || tour.id} tour={tour} />
                  ))}
                </div>
              )}

              {/* Viator Widget */}
              <div className="bg-white rounded-lg shadow p-6 mt-10">
                <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                  <h3 className="text-lg font-bold text-gray-900">More experiences from Viator</h3>
                  <span className="text-xs text-gray-500">Affiliate partner content</span>
                </div>
                <div data-vi-partner-id="P00281964" data-vi-widget-ref="W-e50d8b20-0e81-4083-a036-aad28f2f0562"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ToursPage;
