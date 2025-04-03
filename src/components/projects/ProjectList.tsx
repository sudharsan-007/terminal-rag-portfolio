
import React, { useRef, useEffect } from 'react';
import { Project } from '@/types/project';
import ProjectCard from './ProjectCard';
import { ArrowUp, ArrowDown, Github } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Calculate scroll position when selected project changes
  useEffect(() => {
    if (scrollAreaRef.current && selectedIndex > 0) {
      const projectElements = document.querySelectorAll('.project-card');
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
    setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
  };

  const handleScrollDown = () => {
    setSelectedIndex(prev => (prev < projects.length - 1 ? prev + 1 : projects.length - 1));
  };

  // Calculate the slider value based on selected index
  const sliderValue = [(selectedIndex / (projects.length - 1)) * 100];
  
  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    const newIndex = Math.round((value[0] / 100) * (projects.length - 1));
    setSelectedIndex(newIndex);
  };

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
      
      {/* Projects list with custom scrollbar */}
      <div className="flex-grow flex gap-4 overflow-hidden">
        {/* List of other projects */}
        <ScrollArea ref={scrollAreaRef} className="flex-grow">
          <div className="space-y-4 pr-4">
            {projects.map((project, index) => (
              <div key={project.id} className="project-card">
                {selectedIndex !== index && (
                  <ProjectCard 
                    project={project} 
                    isSelected={false}
                    onClick={() => setSelectedIndex(index)}
                    isCompact={true}
                  />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {/* Custom scrollbar with arrows */}
        <div className="flex flex-col items-center">
          <button 
            className="p-2 rounded-full bg-terminal-navy hover:bg-terminal-text/10 mb-2"
            onClick={handleScrollUp}
            aria-label="Scroll up"
          >
            <ArrowUp className="text-terminal-text w-5 h-5" />
          </button>
          
          <div className="flex-grow h-full relative flex items-center">
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-1 rounded-full bg-terminal-text/20 h-full relative">
                <Slider
                  orientation="vertical"
                  value={sliderValue}
                  onValueChange={handleSliderChange}
                  min={0}
                  max={100}
                  step={1}
                  className="h-full absolute inset-0"
                />
              </div>
            </div>
          </div>
          
          <button 
            className="p-2 rounded-full bg-terminal-navy hover:bg-terminal-text/10 mt-2"
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
