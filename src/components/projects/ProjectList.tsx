
import React from 'react';
import { Project } from '@/types/project';
import ProjectCard from './ProjectCard';
import { ArrowUp, ArrowDown, Github } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  return (
    <div className="terminal-window flex-grow flex flex-col overflow-hidden">
      {/* Current selected project */}
      <div className="mb-6">
        <ProjectCard 
          project={projects[selectedIndex]} 
          isSelected={true}
          onClick={() => onViewDetails()}
        />
      </div>
      
      {/* List of other projects */}
      <ScrollArea className="flex-grow">
        <div className="space-y-4">
          {projects.map((project, index) => (
            selectedIndex !== index && (
              <ProjectCard 
                key={project.id}
                project={project} 
                isSelected={false}
                onClick={() => setSelectedIndex(index)}
                isCompact={true}
              />
            )
          ))}
        </div>
      </ScrollArea>
      
      {/* Navigation help */}
      <div className="border-t border-terminal-text/30 mt-4 pt-4 text-terminal-text/70 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>↑/↓: Navigate projects</p>
            <p>Enter: View project details</p>
          </div>
          <div>
            <p>G: Open GitHub repository</p>
            <p>ALT+[key]: Access menu items</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
