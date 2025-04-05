
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import ResumeGame from '@/components/resume/ResumeGame';
import ResumeContent from '@/components/resume/ResumeContent';
import { Briefcase, GraduationCap, Star } from 'lucide-react';
import resumeData from '@/data/resumeData';

const Resume = () => {
  const [activeSection, setActiveSection] = useState('');
  const [showGame, setShowGame] = useState(true);
  const [collectedItems, setCollectedItems] = useState({
    experience: 0,
    education: 0,
    awards: 0
  });
  
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="terminal-window p-4 h-full overflow-y-auto max-h-[70vh]"
            >
              <h2 className="text-xl text-terminal-accent1 mb-4 border-b border-terminal-text/30 pb-2">
                <span className="terminal-prompt">Resume Details</span>
              </h2>
              
              {/* Collection Status */}
              <div className="mb-6">
                <div className="mb-4">
                  <h3 className="text-terminal-text mb-2">Experience</h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.experience.map((_, index) => (
                      <div 
                        key={`exp-${index}`}
                        className={`p-2 rounded-md ${activeSection === `experience-${index}` || index < collectedItems.experience 
                          ? 'text-blue-500' 
                          : 'text-terminal-text/30'}`}
                      >
                        <Briefcase size={20} />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-terminal-text mb-2">Education</h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.education.map((_, index) => (
                      <div 
                        key={`edu-${index}`}
                        className={`p-2 rounded-md ${activeSection === `education-${index}` || index < collectedItems.education 
                          ? 'text-green-500' 
                          : 'text-terminal-text/30'}`}
                      >
                        <GraduationCap size={20} />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-terminal-text mb-2">Fun Facts</h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.awards.map((_, index) => (
                      <div 
                        key={`award-${index}`}
                        className={`p-2 rounded-md ${activeSection === `award-${index}` || index < collectedItems.awards 
                          ? 'text-yellow-500' 
                          : 'text-terminal-text/30'}`}
                      >
                        <Star size={20} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Selected Item Content */}
              <ResumeContent activeSection={activeSection} />
            </motion.div>
          </div>
          
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="terminal-window p-4 h-full"
            >
              <h2 className="text-xl text-terminal-accent1 mb-4 border-b border-terminal-text/30 pb-2">
                <span className="terminal-prompt">Collect items to explore my journey</span>
              </h2>
              {showGame && (
                <ResumeGame 
                  onItemCollect={handleItemCollected} 
                  setShowGame={setShowGame}
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Resume;
