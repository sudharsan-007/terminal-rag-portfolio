
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

  // Handle keyboard navigation (this remains as it's for keyboard accessibility)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        setSelectedIndex(prev => {
          const newIndex = prev > 0 ? prev - 1 : projects.length - 1;
          return newIndex;
        });
      } else if (e.key === 'ArrowDown') {
        setSelectedIndex(prev => {
          const newIndex = prev < projects.length - 1 ? prev + 1 : 0;
          return newIndex;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedIndex, projects.length]);

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
      
      {/* Projects list with custom scrollbar - now just a single ScrollArea */}
      <div className="flex-grow h-full">
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
