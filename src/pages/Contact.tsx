
import React from 'react';
import { Layout } from '@/components/Layout';
import ContactForm from '@/components/contact/ContactForm';
import QrCodeDisplay from '@/components/contact/QrCodeDisplay';
import CommitHistory from '@/components/contact/CommitHistory';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4">
          <div className="text-terminal-text text-lg sm:text-xl md:text-2xl">
            sudharsan@portfolio:~/contact
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="terminal-window p-4 h-full"
          >
            <h2 className="text-xl text-terminal-accent1 mb-4 border-b border-terminal-text/30 pb-2">
              <span className="terminal-prompt">Send Message</span>
            </h2>
            <ContactForm />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="terminal-window p-4 h-full"
          >
            <h2 className="text-xl text-terminal-accent1 mb-4 border-b border-terminal-text/30 pb-2">
              <span className="terminal-prompt">Connect on LinkedIn</span>
            </h2>
            <QrCodeDisplay />
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="terminal-window p-4"
        >
          <h2 className="text-xl text-terminal-accent1 mb-4 border-b border-terminal-text/30 pb-2">
            <span className="terminal-prompt">Connect with me</span>
          </h2>
          <CommitHistory />
        </motion.div>
      </div>
    </Layout>
  );
};

export default Contact;
