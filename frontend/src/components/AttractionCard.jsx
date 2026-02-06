import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const AttractionCard = ({ attraction, index = 0 }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFavorite = (e, item) => {
    e.stopPropagation();
    toast({
      title: "Saved to Favorites",
      description: `${item.title || item.name} has been added to your collection.`
    });
  };

  const handleViewDetails = (e, attractionId) => {
    e.stopPropagation();
    navigate(`/attractions/${attractionId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300 shadow-sm cursor-pointer"
      onClick={(e) => handleViewDetails(e, attraction.id)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
          alt={attraction.title} 
          src={attraction.image || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop"}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
        
        <Button
            size="icon"
            onClick={(e) => handleFavorite(e, attraction)}
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-rose-50 hover:text-rose-600 text-gray-600 transition-all shadow-sm border-none"
        >
          <Heart className="w-4 h-4" />
        </Button>

        {/* Price Tag */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-sm text-xs font-bold text-gray-900 shadow-sm">
            {attraction.price}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {attraction.tags.map(tag => (
            <span key={tag} className="text-[10px] uppercase tracking-wider font-bold text-[#0B3D91] bg-blue-50 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-[#0B3D91] transition-colors">
            {attraction.title}
        </h3>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
             <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold text-gray-900">{attraction.rating}</span>
                <span className="text-xs text-gray-500">({attraction.reviews})</span>
            </div>
            <span className="flex items-center text-xs font-bold text-[#0B3D91] uppercase tracking-wide group-hover:underline">
                Details <ArrowUpRight className="w-3 h-3 ml-1" />
            </span>
        </div>
      </div>
    </motion.div>
  );
};

export default AttractionCard;