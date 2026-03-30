import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Phone, Mail, MapPin } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

const Footer = () => {
  const { t } = useLocale();
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
            
            {/* Contact Information */}
            <div className="space-y-3 mb-8">
              <a href="tel:+447566215425" className="flex items-center gap-3 text-gray-600 hover:text-[#0B3D91] transition-colors">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+44 7566 215425</span>
              </a>
              <a href="mailto:TeamOrbito@protonmail.com" className="flex items-center gap-3 text-gray-600 hover:text-[#0B3D91] transition-colors">
                <Mail className="w-4 h-4" />
                <span className="text-sm">TeamOrbito@protonmail.com</span>
              </a>
              <div className="flex items-start gap-3 text-gray-600">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm">30, Curzon Road, BH1 4PN<br />Bournemouth, United Kingdom</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-[#0B3D91] transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-[#0B3D91] transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-[#0B3D91] transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-[#0B3D91] transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-6">{t('footer_company')}</h3>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-gray-500 hover:text-[#0B3D91]">{t('footer_about')}</Link></li>
              <li><Link to="/careers" className="text-gray-500 hover:text-[#0B3D91]">{t('footer_careers')}</Link></li>
              <li><Link to="/blog" className="text-gray-500 hover:text-[#0B3D91]">{t('footer_blog')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-6">{t('footer_support')}</h3>
            <ul className="space-y-4">
              <li><Link to="/help" className="text-gray-500 hover:text-[#0B3D91]">{t('footer_help')}</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-[#0B3D91]">{t('footer_contact')}</Link></li>
              <li><Link to="/privacy" className="text-gray-500 hover:text-[#0B3D91]">{t('footer_privacy')}</Link></li>
              <li><Link to="/terms" className="text-gray-500 hover:text-[#0B3D91]">{t('footer_terms')}</Link></li>
              <li><Link to="/refunds" className="text-gray-500 hover:text-[#0B3D91]">{t('footer_refunds')}</Link></li>
              <li><Link to="/supplier-terms" className="text-gray-500 hover:text-[#0B3D91]">{t('footer_supplier_terms')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-6">{t('footer_discover')}</h3>
            <ul className="space-y-4">
              <li><Link to="/destinations" className="text-gray-500 hover:text-[#0B3D91]">{t('footer_destinations')}</Link></li>
              <li><Link to="/itineraries" className="text-gray-500 hover:text-[#0B3D91]">{t('footer_itineraries')}</Link></li>
              <li><Link to="/resources" className="text-gray-500 hover:text-[#0B3D91]">{t('footer_guides')}</Link></li>
              <li><Link to="/resources" className="text-gray-500 hover:text-[#0B3D91]">{t('footer_articles')}</Link></li>
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
              {t('footer_secure')}
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span className="w-4 h-4 border border-gray-300 rounded-full flex items-center justify-center text-[10px]">✓</span>
              {t('footer_reviews')}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
