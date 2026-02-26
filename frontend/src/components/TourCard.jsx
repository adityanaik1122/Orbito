import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Star } from 'lucide-react';

const TourCard = ({ tour }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/tours/${tour.slug || tour.external_id}`);
  };

  // Simple image URL with fallback
  const imageUrl = tour.main_image || tour.image || tour.images?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={handleViewDetails}>
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={imageUrl}
          alt={tour.title}
          className="w-full h-full object-cover"
        />
        
        {/* Provider Badge */}
        {tour.provider && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-blue-500 text-white">
              {tour.provider === 'premium-tours' ? 'Premium Tours' : tour.provider}
            </Badge>
          </div>
        )}

        {/* Featured Badge */}
        {tour.featured && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-yellow-500 text-black">
              ⭐ Featured
            </Badge>
          </div>
        )}

        {/* Rating */}
        {tour.rating > 0 && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">{tour.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-300">({tour.review_count})</span>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg line-clamp-2">{tour.title}</h3>
        </div>
        
        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
          <MapPin className="w-4 h-4" />
          <span>{tour.city || tour.destination}</span>
        </div>
      </CardHeader>

      <CardContent className="py-0">
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {tour.description}
        </p>

        {/* Details */}
        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
          {tour.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{tour.duration}</span>
            </div>
          )}
          
          {tour.category && (
            <Badge variant="outline" className="text-xs">
              {tour.category}
            </Badge>
          )}
        </div>

        {/* Highlights */}
        {tour.highlights && tour.highlights.length > 0 && (
          <div className="mt-3">
            <ul className="text-xs text-gray-600 space-y-1">
              {tour.highlights.slice(0, 2).map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className="line-clamp-1">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">From</div>
          <div className="text-2xl font-bold text-primary">
            {tour.currency === 'USD' ? '$' : 
             tour.currency === 'EUR' ? '€' : 
             tour.currency === 'GBP' ? '£' : ''}
            {tour.price_adult?.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">per person</div>
        </div>

        <Button onClick={handleViewDetails} className="bg-primary hover:bg-primary/90">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TourCard;
