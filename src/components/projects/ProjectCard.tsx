import React from 'react';
import { Project } from '@/types/project';
import { Github } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProjectCardProps {
  project: Project;
  isSelected: boolean;
  onClick: () => void;
  isCompact?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isSelected,
  onClick,
  isCompact = false,
}) => {
  const isMobile = useIsMobile();
  
  const handleGitHubClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.githubUrl) {
      window.open(project.githubUrl, '_blank');
    }
  };
  
  if (isCompact) {
    return (
      <div 
        onClick={onClick}
        className={`p-4 rounded-lg cursor-pointer transition-colors ${
          isSelected ? 'bg-terminal-navy border border-terminal-accent1' : 'bg-terminal-navy/60 hover:bg-terminal-navy'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-terminal-accent1 text-md font-semibold">
              {isSelected && '> '}{project.title}
            </h3>
          </div>
        </div>
        <p className="text-sm text-terminal-text mt-1 line-clamp-1">
          {project.shortDescription}
        </p>
      </div>
    );
  }
  
  const mobileDescription = isMobile 
    ? project.shortDescription.length > 100 
      ? `${project.shortDescription.substring(0, 100)}...` 
      : project.shortDescription
    : project.shortDescription;
  
  return (
    <div 
      onClick={onClick}
      className={`p-6 rounded-lg cursor-pointer transition-colors ${
        isSelected ? 'bg-terminal-navy border border-terminal-text' : 'bg-terminal-navy/60 hover:bg-terminal-navy'
      }`}
    >
      {isMobile ? (
        <>
          <h3 className="text-terminal-accent1 text-lg font-semibold mb-1">
            {project.title}
          </h3>
          
          <div className="text-terminal-text/70 text-xs mb-2">
            {project.date}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-2">
            {project.technologies.slice(0, 2).map((tech, idx) => (
              <span key={idx} className="text-xs px-2 py-1 rounded bg-terminal-text/10 text-terminal-text">
                {tech}
              </span>
            ))}
            {project.technologies.length > 2 && (
              <span className="text-xs px-2 py-1 rounded bg-terminal-text/10 text-terminal-text">
                +{project.technologies.length - 2} more
              </span>
            )}
          </div>
          
          <p className="text-terminal-text text-sm mb-3">
            {mobileDescription}
          </p>
          
          <div className="flex gap-2">
            <button 
              className="px-3 py-1 border border-terminal-text text-terminal-text text-sm rounded hover:bg-terminal-text/10"
              onClick={onClick}
            >
              Details
            </button>
            
            {project.githubUrl && (
              <button 
                className="px-3 py-1 border border-terminal-text text-terminal-text text-sm rounded hover:bg-terminal-text/10"
                onClick={handleGitHubClick}
              >
                GitHub
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-terminal-accent1 text-xl font-semibold">
              {project.title}
            </h3>
            <div className="text-terminal-text/70">
              {project.date}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 my-3">
            {project.technologies.map((tech, idx) => (
              <span key={idx} className="text-xs px-2 py-1 rounded bg-terminal-text/10 text-terminal-text">
                {tech}
              </span>
            ))}
          </div>
          
          <p className="text-terminal-text mb-4">
            {project.shortDescription}
          </p>
          
          <div className="flex gap-3">
            <button 
              className="px-4 py-2 border border-terminal-text text-terminal-text rounded hover:bg-terminal-text/10"
              onClick={onClick}
            >
              View Details (Enter)
            </button>
            
            {project.githubUrl && (
              <button 
                className="px-4 py-2 border border-terminal-text text-terminal-text rounded hover:bg-terminal-text/10"
                onClick={handleGitHubClick}
              >
                GitHub (G)
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectCard;
