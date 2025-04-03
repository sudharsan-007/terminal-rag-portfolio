
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { skillsData, interestAreas, professionalSummary } from '@/data/skills';
import SkillBar from '@/components/skills/SkillBar';
import SkillCategory from '@/components/skills/SkillCategory';
import InterestCard from '@/components/skills/InterestCard';
import { useIsMobile } from '@/hooks/use-mobile';

const Skills = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");
  const isMobile = useIsMobile();

  React.useEffect(() => {
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
              sudharsan@portfolio:~/skills
            </div>
          </div>
          
          <div className="terminal-window flex-grow overflow-hidden flex flex-col">
            <Tabs 
              defaultValue="summary" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full h-full flex flex-col"
            >
              <div className="flex justify-center mb-4">
                <TabsList className="bg-terminal-navy">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="technical">Technical Skills</TabsTrigger>
                  <TabsTrigger value="soft">Soft Skills</TabsTrigger>
                  <TabsTrigger value="interests">Areas of Interest</TabsTrigger>
                </TabsList>
              </div>
              
              <div className="flex-grow overflow-hidden">
                <TabsContent value="summary" className="h-full overflow-auto m-0 p-2">
                  <div className="space-y-6 p-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-terminal-accent1">Professional Summary</h1>
                    <p className="text-lg text-terminal-text leading-relaxed">{professionalSummary}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      <div className="terminal-window p-6">
                        <h2 className="text-xl font-semibold text-terminal-accent2 mb-4">Technical Expertise</h2>
                        <ul className="list-disc list-inside text-terminal-text space-y-2">
                          <li>AI & Machine Learning Systems</li>
                          <li>Computer Vision Applications</li>
                          <li>Robotics & Embedded Systems</li>
                          <li>Healthcare Technology Solutions</li>
                          <li>Full-stack Development</li>
                        </ul>
                      </div>
                      <div className="terminal-window p-6">
                        <h2 className="text-xl font-semibold text-terminal-accent2 mb-4">Leadership & Approach</h2>
                        <ul className="list-disc list-inside text-terminal-text space-y-2">
                          <li>Cross-functional Team Leadership</li>
                          <li>End-to-end Project Management</li>
                          <li>Innovation-driven Problem Solving</li>
                          <li>Data-informed Decision Making</li>
                          <li>Collaborative Development</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="technical" className="h-full overflow-auto m-0 p-2">
                  <div className="space-y-8">
                    {skillsData.slice(0, 4).map((category) => (
                      <SkillCategory 
                        key={category.name}
                        name={category.name}
                        description={category.description}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {category.skills.map((skill) => (
                            <SkillBar 
                              key={skill.name}
                              name={skill.name}
                              percentage={skill.level}
                            />
                          ))}
                        </div>
                      </SkillCategory>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="soft" className="h-full overflow-auto m-0 p-2">
                  <SkillCategory 
                    name="Personal & Soft Skills"
                    description="Qualities that enhance my technical capabilities and enable effective collaboration"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {skillsData[4].skills.map((skill) => (
                        <SkillBar 
                          key={skill.name}
                          name={skill.name}
                          percentage={skill.level}
                        />
                      ))}
                    </div>
                  </SkillCategory>
                </TabsContent>
                
                <TabsContent value="interests" className="h-full overflow-auto m-0 p-2">
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-terminal-accent1 mb-4">Areas of Interest & Research</h2>
                    <div className={`grid grid-cols-1 ${isMobile ? "" : "md:grid-cols-2 lg:grid-cols-3"} gap-6`}>
                      {interestAreas.map((interest) => (
                        <InterestCard 
                          key={interest.name}
                          name={interest.name}
                          description={interest.description}
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </motion.div>
      
      {/* Background effects */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black to-terminal-navy/40 opacity-80" />
    </div>
  );
};

export default Skills;
