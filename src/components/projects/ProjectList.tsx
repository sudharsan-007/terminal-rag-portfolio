
import React, { useRef, useEffect } from 'react';
import { Project } from '@/types/project';
import ProjectCard from './ProjectCard';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProjectListProps {
  projects: Project[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  onViewDetails: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  selectedIndex,
  setSelectedIndex,
  onViewDetails,
}) => {
  const projectsContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Calculate scroll position when selected project changes
  useEffect(() => {
    if (projectsContainerRef.current) {
      const projectElements = projectsContainerRef.current.querySelectorAll('.project-card');
      if (projectElements[selectedIndex]) {
        // Scroll the element into view
        projectElements[selectedIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [selectedIndex]);

  // Handle scroll navigation with arrow buttons
  const handleScrollUp = () => {
    setSelectedIndex(prev => {
      const newIndex = prev > 0 ? prev - 1 : projects.length - 1;
      return newIndex;
    });
  };

  const handleScrollDown = () => {
    setSelectedIndex(prev => {
      const newIndex = prev < projects.length - 1 ? prev + 1 : 0;
      return newIndex;
    });
  };

  return (
    <div className="terminal-window flex-grow flex flex-col overflow-hidden">
      {/* Current selected project */}
      <div className={`${isMobile ? 'mb-3' : 'mb-6'}`}>
        <ProjectCard 
          project={projects[selectedIndex]} 
          isSelected={true}
          onClick={() => onViewDetails()}
        />
      </div>
      
      {/* Projects list with custom scrollbar */}
      <div className="flex-grow flex gap-4 overflow-hidden">
        {/* List of other projects with integrated scrollbar */}
        <div className="flex-grow h-full relative">
          <ScrollArea className="h-full">
            <div ref={projectsContainerRef} className="space-y-4 pr-4">
              {projects.map((project, index) => (
                <div key={project.id} className="project-card">
                  <ProjectCard 
                    project={project} 
                    isSelected={selectedIndex === index}
                    onClick={() => setSelectedIndex(index)}
                    isCompact={true}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        {/* Navigation arrows */}
        <div className="flex flex-col items-center justify-between my-2">
          <button 
            className="p-2 rounded-full bg-terminal-navy hover:bg-terminal-text/10"
            onClick={handleScrollUp}
            aria-label="Scroll up"
          >
            <ArrowUp className="text-terminal-text w-5 h-5" />
          </button>
          
          <div className="w-1 h-28 bg-terminal-text/20 rounded-full my-4 relative">
            <div 
              className="w-1.5 h-3 bg-terminal-text absolute rounded-full transform -translate-x-1/4"
              style={{ 
                top: `${(selectedIndex / (projects.length - 1)) * 100}%`,
              }}
            ></div>
          </div>
          
          <button 
            className="p-2 rounded-full bg-terminal-navy hover:bg-terminal-text/10"
            onClick={handleScrollDown}
            aria-label="Scroll down"
          >
            <ArrowDown className="text-terminal-text w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Navigation help */}
      <div className="border-t border-terminal-text/30 mt-4 pt-4 text-terminal-text/70 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>↑/↓: Navigate projects</p>
            <p>Enter: View project details</p>
          </div>
          <div>
            <p>G: Open GitHub repository</p>
            <p>ESC: Return from details view</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
