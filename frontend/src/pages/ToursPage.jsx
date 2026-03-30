import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, SlidersHorizontal } from 'lucide-react';
import TourCard from '@/components/TourCard';
import FilterSidebar from '@/components/FilterSidebar';
import { apiService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { useLocale } from '@/contexts/LocaleContext';

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
            <div className="max-w-2xl bg-white rounded-lg p-2 flex gap-2">
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
              <div className="bg-white rounded-lg shadow p-4 mb-6">
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
                    {filters.destination && (
                      <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                        📍 {filters.destination}
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
              </div>

              {/* Results */}
              {apiError && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 mb-6">
                  Tours are coming soon. We’re finishing the provider integration, so search results may be empty for now.
                </div>
              )}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ToursPage;
