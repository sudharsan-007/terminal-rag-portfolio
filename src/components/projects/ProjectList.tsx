import React, { useRef, useEffect } from 'react';
import { Project } from '@/types/project';
import ProjectCard from './ProjectCard';
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
      
      {/* Projects list with scrollbar */}
      <div className="flex-grow overflow-hidden">
        {/* List of other projects */}
        <ScrollArea className="h-full pr-2">
          <div ref={projectsContainerRef} className="space-y-4">
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
    </div>
  );
};

export default ProjectList;
