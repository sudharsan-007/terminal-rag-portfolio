import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ContactForm from '@/components/contact/ContactForm';
import QrCodeDisplay from '@/components/contact/QrCodeDisplay';
import CommitHistory from '@/components/contact/CommitHistory';

const Contact = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
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
          sudharsan@portfolio:~/contact
        </div>
      </div>
      
      <div className="terminal-window flex-grow flex flex-col overflow-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="h-full"
          >
            <ContactForm />
          </motion.div>
          
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="h-full"
          >
            <QrCodeDisplay />
          </motion.div>
        </div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-4 flex-shrink-0"
        >
          <CommitHistory />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Contact;
