import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plane, Hotel, Car, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const BookingExtras = () => {
  const { toast } = useToast();

  const handleBooking = (type, partner) => {
    toast({
      title: `Redirecting to ${partner}... ✈️`,
      description: `Searching for best ${type} deals for you.`,
    });
    // Simulation of opening external link
  };

  // Orbito Dark Blue Theme Colors (#0B3D91)
  const themeColors = {
    bgLight: 'bg-[#F0F4FA]',   // Very light blue background for sections/badges
    bgHover: 'bg-[#E1EAF8]',   // Hover state for light backgrounds
    primary: 'bg-[#0B3D91]',   // Main buttons, active states
    text: 'text-[#0B3D91]',    // Headings, icons, strong text
    borderHover: 'hover:border-[#E1EAF8]'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
    >
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Book Your Trip</h2>
      <p className="text-gray-500 mb-6 text-sm">We partner with top providers to get you the best rates.</p>
      
      <div className="grid gap-4">
        <Button 
          onClick={() => handleBooking('flights', 'Skyscanner')} 
          variant="outline"
          className={`h-auto py-4 flex justify-between items-center group ${themeColors.borderHover} ${themeColors.bgHover}/50 hover:bg-[#F0F4FA]`}
        >
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${themeColors.bgLight} flex items-center justify-center ${themeColors.text} group-hover:scale-110 transition-transform`}>
                    <Plane className="w-5 h-5" />
                </div>
                <div className="text-left">
                    <span className="block font-bold text-gray-900">Book Flights</span>
                    <span className="block text-xs text-gray-500">via Skyscanner</span>
                </div>
            </div>
            <ExternalLink className={`w-4 h-4 text-gray-400 group-hover:${themeColors.text}`} />
        </Button>

        <Button 
          onClick={() => handleBooking('hotels', 'Booking.com')} 
          variant="outline"
          className={`h-auto py-4 flex justify-between items-center group ${themeColors.borderHover} ${themeColors.bgHover}/50 hover:bg-[#F0F4FA]`}
        >
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${themeColors.bgLight} flex items-center justify-center ${themeColors.text} group-hover:scale-110 transition-transform`}>
                    <Hotel className="w-5 h-5" />
                </div>
                <div className="text-left">
                    <span className="block font-bold text-gray-900">Find Hotels</span>
                    <span className="block text-xs text-gray-500">via Booking.com</span>
                </div>
            </div>
            <ExternalLink className={`w-4 h-4 text-gray-400 group-hover:${themeColors.text}`} />
        </Button>

        <Button 
          onClick={() => handleBooking('transfers', 'Uber')} 
          variant="outline"
          className={`h-auto py-4 flex justify-between items-center group ${themeColors.borderHover} ${themeColors.bgHover}/50 hover:bg-[#F0F4FA]`}
        >
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${themeColors.bgLight} flex items-center justify-center ${themeColors.text} group-hover:scale-110 transition-transform`}>
                    <Car className="w-5 h-5" />
                </div>
                <div className="text-left">
                    <span className="block font-bold text-gray-900">Airport Transfers</span>
                    <span className="block text-xs text-gray-500">via Uber</span>
                </div>
            </div>
            <ExternalLink className={`w-4 h-4 text-gray-400 group-hover:${themeColors.text}`} />
        </Button>
      </div>
    </motion.div>
  );
};

export default BookingExtras;