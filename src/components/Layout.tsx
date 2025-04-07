import React from 'react';
import Header from './Header';
import Footer from './Footer';
import StaticNoiseBackground from './StaticNoiseBackground';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative h-screen flex flex-col bg-terminal-bg text-terminal-text overflow-hidden">
      {/* Background effects layer */}
      <div className="fixed inset-0 z-0">
        {/* Base color */}
        <div className="absolute inset-0 bg-terminal-bg" />
        
        {/* Static noise effect */}
        <StaticNoiseBackground />
      </div>

      {/* Content layer */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col h-full">
        <Header />
        <main className="flex-grow overflow-hidden py-4">
          {children}
        </main>
        <Footer className="mt-auto py-4" />
      </div>
    </div>
  );
};

export default Layout;
