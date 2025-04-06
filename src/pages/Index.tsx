import React, { useEffect, useState } from 'react';
import AsciiLogo from '@/components/AsciiLogo';
import Terminal from '@/components/Terminal';
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full"
    >
      <div className="mb-4">
        <div className="text-terminal-text text-lg sm:text-xl md:text-2xl">
          sudharsan@portfolio:~
        </div>
      </div>
      
      <AsciiLogo className="mb-4 flex-shrink-0" />
      
      <div className="flex-grow overflow-hidden flex flex-col">
        <Terminal className="flex-grow" />
      </div>
    </motion.div>
  );
};

export default Index;
