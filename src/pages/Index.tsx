
import React, { useEffect, useState } from 'react';
import AsciiLogo from '@/components/AsciiLogo';
import Terminal from '@/components/Terminal';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading to add a smooth entrance effect
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-terminal-bg overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto flex flex-col h-screen px-4"
      >
        <Header />
        
        <main className="flex-grow flex flex-col mt-4 mb-8 overflow-hidden">
          <div className="mb-4">
            <div className="text-terminal-text text-lg sm:text-xl md:text-2xl">
              sudharsan@portfolio:~
            </div>
          </div>
          
          <AsciiLogo />
          
          <Terminal className="flex-grow overflow-hidden" />
        </main>
        
        <Footer />
      </motion.div>
      
      {/* Background effects */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black to-terminal-navy/40 opacity-80" />
    </div>
  );
};

export default Index;
