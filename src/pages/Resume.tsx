
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import ResumeGame from '@/components/resume/ResumeGame';
import ResumeContent from '@/components/resume/ResumeContent';
import ResumeProgressBar from '@/components/resume/ResumeProgressBar';

const Resume = () => {
  const [activeSection, setActiveSection] = useState('');
  const [showGame, setShowGame] = useState(true);
  const [collectedItems, setCollectedItems] = useState({
    experience: 0,
    education: 0,
    awards: 0
  });
  
  const totalItems = {
    experience: 5, // Total number of work experiences
    education: 4, // Total number of educational achievements
    awards: 8 // Total number of awards
  };
  
  const handleItemCollected = (type: 'experience' | 'education' | 'awards', id: string) => {
    setCollectedItems(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
    setActiveSection(id);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4">
          <div className="text-terminal-text text-lg sm:text-xl md:text-2xl">
            sudharsan@portfolio:~/resume
          </div>
        </div>
        
        <ResumeProgressBar 
          collectedItems={collectedItems} 
          totalItems={totalItems} 
        />
        
        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* Game Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="terminal-window p-4"
          >
            {showGame && (
              <ResumeGame 
                onItemCollect={handleItemCollected} 
                setShowGame={setShowGame}
              />
            )}
          </motion.div>
          
          {/* Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="terminal-window p-4"
              >
                <h2 className="text-xl text-terminal-accent1 mb-4 border-b border-terminal-text/30 pb-2">
                  <span className="terminal-prompt">⭐ Collected Resume Items</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {activeSection ? (
                    <div className="col-span-full">
                      <ResumeContent activeSection={activeSection} />
                    </div>
                  ) : (
                    <div className="col-span-full text-center py-10">
                      <p className="text-terminal-text">Collect stars in the game to reveal my resume details!</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Resume;
