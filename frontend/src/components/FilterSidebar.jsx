import React, { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

const FilterSidebar = ({ filters, onFilterChange, onApply, onClear, isOpen, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const categories = [
    { value: 'Adventure', label: 'Adventure', icon: '🏔️' },
    { value: 'Food', label: 'Food & Dining', icon: '🍽️' },
    { value: 'Culture', label: 'Culture', icon: '🎭' },
    { value: 'Sightseeing', label: 'Sightseeing', icon: '🏛️' },
    { value: 'Entertainment', label: 'Entertainment', icon: '🎪' },
    { value: 'Historical Sites', label: 'Historical Sites', icon: '🏰' },
    { value: 'Attractions', label: 'Attractions', icon: '🎢' },
  ];

  const durations = [
    { value: 'half-day', label: 'Half Day (< 4 hours)', icon: '⏰' },
    { value: 'full-day', label: 'Full Day (4-8 hours)', icon: '☀️' },
    { value: 'multi-day', label: 'Multi-Day (> 8 hours)', icon: '📅' },
  ];

  const handleLocalChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCategoryToggle = (category) => {
    const current = localFilters.categories || [];
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    handleLocalChange('categories', updated);
  };

  const handleDurationToggle = (duration) => {
    const current = localFilters.durations || [];
    const updated = current.includes(duration)
      ? current.filter(d => d !== duration)
      : [...current, duration];
    handleLocalChange('durations', updated);
  };

  const handlePriceChange = (values) => {
    handleLocalChange('priceRange', values);
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onApply();
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleClear = () => {
    const cleared = {
      destination: '',
      categories: [],
      durations: [],
      priceRange: [0, 500],
      sortBy: 'rating'
    };
    setLocalFilters(cleared);
    onFilterChange(cleared);
    onClear();
  };

  const priceRange = localFilters.priceRange || [0, 500];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-screen lg:h-auto
        w-80 bg-white shadow-xl lg:shadow-none
        transform transition-transform duration-300 ease-in-out
        z-50 lg:z-0
        overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Filters</h2>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <Label className="text-base font-semibold mb-4 block">
              Price Range
            </Label>
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={handlePriceChange}
                max={500}
                step={10}
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>£{priceRange[0]}</span>
                <span>£{priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="mb-8">
            <Label className="text-base font-semibold mb-4 block">
              Duration
            </Label>
            <div className="space-y-3">
              {durations.map((duration) => (
                <div key={duration.value} className="flex items-center space-x-3">
                  <Checkbox
                    id={`duration-${duration.value}`}
                    checked={(localFilters.durations || []).includes(duration.value)}
                    onCheckedChange={() => handleDurationToggle(duration.value)}
                  />
                  <label
                    htmlFor={`duration-${duration.value}`}
                    className="flex items-center gap-2 text-sm font-medium cursor-pointer flex-1"
                  >
                    <span>{duration.icon}</span>
                    <span>{duration.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <Label className="text-base font-semibold mb-4 block">
              Categories
            </Label>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.value} className="flex items-center space-x-3">
                  <Checkbox
                    id={`category-${category.value}`}
                    checked={(localFilters.categories || []).includes(category.value)}
                    onCheckedChange={() => handleCategoryToggle(category.value)}
                  />
                  <label
                    htmlFor={`category-${category.value}`}
                    className="flex items-center gap-2 text-sm font-medium cursor-pointer flex-1"
                  >
                    <span>{category.icon}</span>
                    <span>{category.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t">
            <Button 
              onClick={handleApply}
              className="w-full"
            >
              Apply Filters
            </Button>
            <Button 
              onClick={handleClear}
              variant="outline"
              className="w-full"
            >
              Clear All
            </Button>
          </div>

          {/* Active Filters Count */}
          {(() => {
            const count = 
              (localFilters.categories?.length || 0) +
              (localFilters.durations?.length || 0) +
              (priceRange[0] > 0 || priceRange[1] < 500 ? 1 : 0);
            
            return count > 0 ? (
              <div className="mt-4 text-center text-sm text-gray-600">
                {count} filter{count !== 1 ? 's' : ''} active
              </div>
            ) : null;
          })()}
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
