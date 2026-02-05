import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Layout = ({ children, isLoggedIn }) => {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#0B3D91] selection:text-white flex flex-col">
      <Navigation isLoggedIn={isLoggedIn} />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;