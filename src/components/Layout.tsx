import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen flex flex-col bg-terminal-bg text-terminal-text overflow-hidden relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col h-full relative z-10">
        <Header />
        <main className="flex-grow overflow-hidden py-4">
          {children}
        </main>
        <Footer className="mt-auto py-4" />
      </div>
      
      {/* Background effects */}
      <div className="fixed inset-0 -z-0 bg-gradient-to-b from-black to-terminal-navy/40 opacity-80" />
    </div>
  );
};

export default Layout;
