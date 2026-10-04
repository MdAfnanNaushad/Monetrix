import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50 dark:bg-[#070b12] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Header />
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-8 max-w-[1700px] mx-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
