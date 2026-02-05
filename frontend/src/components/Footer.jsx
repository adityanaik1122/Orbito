import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link to="/" className="text-2xl font-bold text-[#0B3D91] tracking-tight mb-6 block">
              ORBITO
            </Link>
            <p className="text-gray-500 leading-relaxed mb-8 max-w-sm">
              Plan your perfect trip with AI-powered itineraries. Discover the world smarter, not harder.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-[#0B3D91] transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-[#0B3D91] transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-[#0B3D91] transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-[#0B3D91] transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-6">Company</h3>
            <ul className="space-y-4">
              <li><Link to="#" className="text-gray-500 hover:text-[#0B3D91]">About Us</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-[#0B3D91]">Careers</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-[#0B3D91]">Blog</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-[#0B3D91]">Press</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-6">Support</h3>
            <ul className="space-y-4">
              <li><Link to="#" className="text-gray-500 hover:text-[#0B3D91]">Help Center</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-[#0B3D91]">Contact Us</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-[#0B3D91]">Privacy Policy</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-[#0B3D91]">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-6">Discover</h3>
            <ul className="space-y-4">
              <li><Link to="/destinations" className="text-gray-500 hover:text-[#0B3D91]">Popular Destinations</Link></li>
              <li><Link to="/itineraries" className="text-gray-500 hover:text-[#0B3D91]">Featured Itineraries</Link></li>
              <li><Link to="/resources" className="text-gray-500 hover:text-[#0B3D91]">Travel Guides</Link></li>
              <li><Link to="/resources" className="text-gray-500 hover:text-[#0B3D91]">Travel Articles</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 ORBITO. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span className="w-4 h-4 border border-gray-300 rounded-full flex items-center justify-center text-[10px]">✓</span>
              Secure Payments
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span className="w-4 h-4 border border-gray-300 rounded-full flex items-center justify-center text-[10px]">✓</span>
              Verified Reviews
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;