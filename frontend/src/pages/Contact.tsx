import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ContactForm from '@/components/contact/ContactForm';
import QrCodeDisplay from '@/components/contact/QrCodeDisplay';
import CommitHistory from '@/components/contact/CommitHistory';

const Contact = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    // Set mounted flag
    isMounted.current = true;
    
    const timer = setTimeout(() => {
      if (isMounted.current) {
        setIsLoaded(true);
      }
    }, 200);
    
    // Cleanup
    return () => {
      clearTimeout(timer);
      isMounted.current = false;
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full"
    >
      <div className="terminal-window flex-grow flex flex-col overflow-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="h-full"
          >
            <ContactForm />
          </motion.div>
          
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="h-full"
          >
            <QrCodeDisplay />
          </motion.div>
        </div>
        
        {isLoaded && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="mb-4 flex-shrink-0"
          >
            <CommitHistory />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Contact;
