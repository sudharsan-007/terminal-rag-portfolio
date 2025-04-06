import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SkillsNetwork from '@/components/skills/SkillsNetwork';
import { useIsMobile } from '@/hooks/use-mobile';

const Skills: React.FC = () => {
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
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full"
    >
      <div className="terminal-window flex-grow flex flex-col overflow-hidden">
        <div className="flex-grow overflow-hidden relative">
          <SkillsNetwork />
        </div>
      </div>
    </motion.div>
  );
};

export default Skills;
