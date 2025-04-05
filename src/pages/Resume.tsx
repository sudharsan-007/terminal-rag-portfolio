
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import ResumeGame from '@/components/resume/ResumeGame';
import ResumeContent from '@/components/resume/ResumeContent';
import { Briefcase, GraduationCap, Star, Download } from 'lucide-react';
import resumeData from '@/data/resumeData';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

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
  
  const handleDownloadResume = () => {
    // This would typically download a PDF resume
    alert('Resume download functionality would be implemented here');
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4">
          <div className="text-terminal-text text-lg sm:text-xl md:text-2xl">
            sudharsan@portfolio:~/resume
          </div>
        </div>
        
        <div className="terminal-window p-4 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="flex flex-col sm:flex-row gap-6 mb-4">
                <div className="flex-1">
                  <h3 className="text-terminal-text mb-2">EXP</h3>
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
                
                <div className="flex-1">
                  <h3 className="text-terminal-text mb-2">EDU</h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.education.slice(0, 2).map((_, index) => (
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
                
                <div className="flex-1">
                  <h3 className="text-terminal-text mb-2">FACTS</h3>
                  <div className="flex flex-wrap gap-2">
                    {/* Only show 3 items for facts */}
                    {[0, 1, 2].map((index) => (
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
            </div>
            
            <div className="flex items-center justify-center">
              <Button 
                variant="outline" 
                className="border-terminal-text text-terminal-text hover:bg-terminal-text/10"
                onClick={handleDownloadResume}
              >
                <Download className="mr-2" size={16} />
                Download PDF
              </Button>
            </div>
          </div>
          
          <Separator className="my-4 bg-terminal-text/20" />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 overflow-y-auto" style={{ maxHeight: '250px' }}>
              <ResumeContent activeSection={activeSection} />
            </div>
            
            <div className="text-terminal-text">
              {activeSection && activeSection.startsWith('experience-') && (
                <div>
                  <h3 className="text-terminal-accent1 mb-2">Experience Details</h3>
                  <p className="text-sm">
                    {resumeData.experience[parseInt(activeSection.split('-')[1])].period}
                  </p>
                  <p className="text-sm mt-2">
                    {resumeData.experience[parseInt(activeSection.split('-')[1])].location}
                  </p>
                </div>
              )}
              
              {activeSection && activeSection.startsWith('education-') && (
                <div>
                  <h3 className="text-terminal-accent1 mb-2">Education Details</h3>
                  <p className="text-sm">
                    {resumeData.education[parseInt(activeSection.split('-')[1])].period}
                  </p>
                  <p className="text-sm mt-2">
                    {resumeData.education[parseInt(activeSection.split('-')[1])].location}
                  </p>
                </div>
              )}
              
              {activeSection && activeSection.startsWith('award-') && (
                <div>
                  <h3 className="text-terminal-accent1 mb-2">Fun Fact Details</h3>
                  {resumeData.awards[parseInt(activeSection.split('-')[1])].year && (
                    <p className="text-sm">
                      {resumeData.awards[parseInt(activeSection.split('-')[1])].year}
                    </p>
                  )}
                  {resumeData.awards[parseInt(activeSection.split('-')[1])].location && (
                    <p className="text-sm mt-2">
                      {resumeData.awards[parseInt(activeSection.split('-')[1])].location}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="terminal-window p-4">
          <h2 className="text-xl text-terminal-accent1 mb-4 border-b border-terminal-text/30 pb-2">
            <span className="terminal-prompt">Collect items to explore my journey</span>
          </h2>
          {showGame && (
            <ResumeGame 
              onItemCollect={handleItemCollected} 
              setShowGame={setShowGame}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Resume;
