import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, SlidersHorizontal } from 'lucide-react';
import TourCard from '@/components/TourCard';
import { apiService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

const ToursPage = () => {
  const { toast } = useToast();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    destination: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'rating'
  });
  const [showFilters, setShowFilters] = useState(false);

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

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async (appliedFilters = filters) => {
    setLoading(true);
    try {
      const filterParams = {
        ...appliedFilters,
        category: appliedFilters.category === 'All' ? '' : appliedFilters.category
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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    fetchTours(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      destination: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'rating'
    };
    setFilters(clearedFilters);
    fetchTours(clearedFilters);
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
                  onChange={(e) => handleFilterChange('destination', e.target.value)}
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

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Filters Bar */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Filters</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 ${showFilters ? 'block' : 'hidden lg:grid'}`}>
              {/* Category */}
              <Select
                value={filters.category || 'All'}
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Min Price */}
              <Input
                type="number"
                placeholder="Min Price (£)"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />

              {/* Max Price */}
              <Input
                type="number"
                placeholder="Max Price (£)"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />

              {/* Sort By */}
              <Select
                value={filters.sortBy}
                onValueChange={(value) => handleFilterChange('sortBy', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>

              {/* Apply/Clear Buttons */}
              <div className="flex gap-2">
                <Button onClick={handleApplyFilters} className="flex-1">
                  Apply
                </Button>
                <Button onClick={handleClearFilters} variant="outline">
                  Clear
                </Button>
              </div>
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
              <p className="text-gray-500">
                Try adjusting your filters or search for a different destination
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-gray-600">
                Found <span className="font-semibold">{tours.length}</span> tours
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tours.map((tour) => (
                  <TourCard key={tour.external_id || tour.id} tour={tour} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ToursPage;
