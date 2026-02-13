import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, signOut, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const navItems = [
    { name: 'Tours', path: '/tours' },
    { name: 'Itineraries', path: '/itineraries' },
    { name: 'Why AI', path: '/why-ai', highlight: true },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm h-20">
      <nav className="container mx-auto px-4 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0">
          <span className="text-2xl font-bold text-[#0B3D91] tracking-tight uppercase">ORBITO</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-[14px] font-medium transition-colors hover:text-[#0B3D91] flex items-center gap-1.5 ${
                item.highlight 
                  ? 'text-[#0B3D91] bg-[#0B3D91]/5 px-3 py-1.5 rounded-full' 
                  : location.pathname === item.path ? 'text-[#0B3D91]' : 'text-gray-600'
              }`}
            >
              {item.highlight && <Sparkles className="w-3.5 h-3.5" />}
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {loading ? (
             <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          ) : !user ? (
            <Link to="/login">
              <Button 
                className="bg-[#0B3D91] hover:bg-[#092C6B] text-white font-bold px-8 rounded-full h-10 text-[14px] shadow-md"
              >
                Login
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/my-account">
                <Button 
                  variant="ghost"
                  className="text-gray-600 hover:text-[#0B3D91] font-medium"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Button 
                onClick={handleLogout}
                variant="ghost"
                className="text-gray-600 hover:text-[#0B3D91] font-medium"
              >
                Log Out
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2 text-gray-600 hover:text-[#0B3D91]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg py-4 px-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="py-3 px-4 text-gray-600 hover:bg-gray-50 hover:text-[#0B3D91] rounded-lg font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="h-px bg-gray-100 my-2" />
          {loading ? (
            <div className="py-2 text-center text-gray-400"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
          ) : !user ? (
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full bg-[#0B3D91] text-white">Login</Button>
            </Link>
          ) : (
            <>
              <Link to="/my-account" onClick={() => setIsMobileMenuOpen(false)}>
                 <Button variant="outline" className="w-full justify-start mb-2">
                   <User className="w-4 h-4 mr-2" /> Profile
                 </Button>
              </Link>
              <Button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} variant="outline" className="w-full">
                Log Out
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navigation;