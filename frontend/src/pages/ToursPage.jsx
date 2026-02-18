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

const ToursPage = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const urlDestination = searchParams.get('destination');
  
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const fetchTours = async (appliedFilters = filters) => {
    setLoading(true);
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
    } catch (error) {
      console.error('Error fetching tours:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load tours. Please try again.'
      });
    } finally {
      setLoading(false);
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
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Amazing Tours & Activities
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Book experiences from top providers worldwide
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl bg-white rounded-lg p-2 flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-3">
                <Search className="w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search destination..."
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
                Search
              </Button>
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
                Show Filters
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
                    Found <span className="font-semibold">{tours.length}</span> tours
                  </span>
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
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : tours.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                  No tours found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters or search for a different destination
                </p>
                <Button onClick={handleClearFilters} variant="outline">
                  Clear All Filters
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
    </>
  );
};

export default ToursPage;
