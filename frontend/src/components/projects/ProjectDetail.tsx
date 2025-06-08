import React from 'react';
import { Project } from '@/types/project';

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onClose }) => {
  return (
    <div className="terminal-window flex-grow flex flex-col overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-white text-2xl font-bold">
          {project.title}
        </h2>
        <button 
          onClick={onClose}
          className="px-4 py-2 border border-terminal-text text-terminal-text rounded hover:bg-terminal-text/10"
        >
          [ESC] Close
        </button>
      </div>
      
      <div className="text-terminal-text/80 mb-4">
        {project.date}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {project.technologies.map((tech, idx) => (
          <span key={idx} className="text-sm px-3 py-1 rounded bg-terminal-text/10 text-terminal-text">
            {tech}
          </span>
        ))}
      </div>
      
      <div className="text-terminal-text mb-8 text-lg">
        {project.description}
      </div>
      
      <div className="mb-6">
        <h3 className="text-terminal-text text-xl mb-3 pb-3 border-b border-terminal-text/30">
          Key Highlights
        </h3>
        <ul className="list-disc pl-6 space-y-2">
          {project.keyHighlights.map((highlight, idx) => (
            <li key={idx} className="text-terminal-text">
              {highlight}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProjectDetail;
