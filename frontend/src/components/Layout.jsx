import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Home, MapPin, Sparkles, User } from 'lucide-react';

const Layout = ({ children, isLoggedIn }) => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#0B3D91] selection:text-white flex flex-col">
      <Navigation isLoggedIn={isLoggedIn} />
      <main className="flex-grow pt-20 pb-20 lg:pb-0">
        {children}
      </main>
      <Footer />
      
      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 safe-area-inset-bottom">
        <div className="grid grid-cols-4 h-16">
          <Link 
            to="/" 
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              isActive('/') ? 'text-[#0B3D91]' : 'text-gray-600'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Home</span>
          </Link>
          
          <Link 
            to="/tours" 
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              isActive('/tours') ? 'text-[#0B3D91]' : 'text-gray-600'
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span className="text-xs font-medium">Tours</span>
          </Link>
          
          <Link 
            to="/plan" 
            className="flex flex-col items-center justify-center gap-1 text-[#0B3D91] relative"
          >
            <div className="absolute -top-6 bg-[#0B3D91] rounded-full p-3 shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium mt-6">Plan</span>
          </Link>
          
          <Link 
            to="/my-account" 
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              isActive('/my-account') ? 'text-[#0B3D91]' : 'text-gray-600'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs font-medium">Account</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Layout;