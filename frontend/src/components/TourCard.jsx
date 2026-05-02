import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Star } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

const TourCard = ({ tour }) => {
  const navigate = useNavigate();
  const { formatMoney, t } = useLocale();

  const handleViewDetails = () => {
    navigate(`/tours/${tour.id || tour.external_id}`);
  };

  // Simple image URL with fallback
  const imageUrl = tour.main_image || tour.image || tour.images?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80';
  const ratingValue = typeof tour.rating === 'number' ? tour.rating : parseFloat(tour.rating || 0);
  const reviewCount = tour.review_count || tour.reviews || 0;
  const priceAmount = typeof tour.price_amount === 'number' ? tour.price_amount : parseFloat(tour.price_amount || 0);

  let manualBadges = tour.badge_overrides || tour.badges || {};
  if (typeof manualBadges === 'string') {
    try {
      manualBadges = JSON.parse(manualBadges);
    } catch {
      manualBadges = {};
    }
  }

  const badges = [];
  const featuredFlag = manualBadges.featured ?? tour.featured;
  const topRatedFlag = manualBadges.top_rated ?? (ratingValue >= 4.7 && reviewCount >= 50);
  const bestSellerFlag = manualBadges.best_seller ?? (reviewCount >= 500);
  const freeCancelFlag = manualBadges.free_cancellation ?? tour.free_cancellation;
  const instantFlag = manualBadges.instant_confirmation ?? tour.instant_confirmation;
  const greatValueFlag = manualBadges.great_value ?? (priceAmount > 0 && priceAmount <= 40);

  if (featuredFlag) badges.push({ label: 'Featured', tone: 'bg-amber-500 text-white' });
  if (topRatedFlag) badges.push({ label: 'Top rated', tone: 'bg-emerald-500 text-white' });
  if (bestSellerFlag) badges.push({ label: 'Best seller', tone: 'bg-indigo-500 text-white' });
  if (freeCancelFlag) badges.push({ label: 'Free cancellation', tone: 'bg-blue-500 text-white' });
  if (instantFlag) badges.push({ label: 'Instant confirm', tone: 'bg-slate-900 text-white' });
  if (greatValueFlag) badges.push({ label: 'Great value', tone: 'bg-green-600 text-white' });

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={handleViewDetails}>
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={imageUrl}
          alt={tour.title}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80'; }}
        />
        
        <div className="absolute top-2 left-2 flex flex-wrap gap-2">
          {tour.source && (
            <Badge className="bg-blue-600 text-white">
              {tour.source === 'premium-tours' ? 'Premium Tours' : tour.source}
            </Badge>
          )}
          {badges.slice(0, 2).map((badge) => (
            <Badge key={badge.label} className={badge.tone}>
              {badge.label}
            </Badge>
          ))}
        </div>

        {/* Rating */}
        {ratingValue > 0 && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">{ratingValue.toFixed(1)}</span>
            {reviewCount ? <span className="text-xs text-gray-300">({reviewCount})</span> : null}
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
          <span>{tour.city || tour.destination_city}</span>
        </div>
      </CardHeader>

      <CardContent className="py-0">
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {tour.description}
        </p>

        {/* Details */}
        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
          {tour.duration_minutes && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{Math.round(tour.duration_minutes / 60)} hrs</span>
            </div>
          )}
          
          {tour.category && (
            <Badge variant="outline" className="text-xs">
              {tour.category}
            </Badge>
          )}
        </div>

        {badges.length > 2 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {badges.slice(2).map((badge) => (
              <span key={badge.label} className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded-full bg-gray-100 text-gray-600">
                {badge.label}
              </span>
            ))}
          </div>
        )}

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
          <div className="text-sm text-gray-500">{t('tours_from')}</div>
          <div className="text-2xl font-bold text-primary">
            {formatMoney(tour.price_amount, tour.price_currency || 'USD')}
          </div>
          <div className="text-xs text-gray-500">{t('tours_per_person')}</div>
        </div>

        <Button onClick={handleViewDetails} className="bg-primary hover:bg-primary/90">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TourCard;

