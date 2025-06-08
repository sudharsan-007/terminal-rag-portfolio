
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Briefcase, GraduationCap, Award } from 'lucide-react';

interface ResumeProgressBarProps {
  collectedItems: {
    experience: number;
    education: number;
    awards: number;
  };
  totalItems: {
    experience: number;
    education: number;
    awards: number;
  };
}

const ResumeProgressBar: React.FC<ResumeProgressBarProps> = ({ 
  collectedItems, 
  totalItems 
}) => {
  const calculateProgress = (collected: number, total: number) => {
    return (collected / total) * 100;
  };
  
  const getOverallProgress = () => {
    const totalCollected = collectedItems.experience + collectedItems.education + collectedItems.awards;
    const total = totalItems.experience + totalItems.education + totalItems.awards;
    return (totalCollected / total) * 100;
  };
  
  return (
    <div className="mb-8 terminal-window p-4">
      <h3 className="text-xl text-terminal-accent1 mb-4 border-b border-terminal-text/30 pb-2">
        <span className="terminal-prompt">Resume Progress</span>
      </h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-terminal-text">
            <div className="flex items-center">
              <span className="mr-2">Overall Progress</span>
            </div>
            <div>{Math.round(getOverallProgress())}%</div>
          </div>
          <Progress value={getOverallProgress()} className="h-2" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-terminal-text">
              <div className="flex items-center">
                <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
                <span>Experience</span>
              </div>
              <div>{collectedItems.experience}/{totalItems.experience}</div>
            </div>
            <Progress value={calculateProgress(collectedItems.experience, totalItems.experience)} className="h-2 bg-blue-500/20" 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-terminal-text">
              <div className="flex items-center">
                <GraduationCap className="w-4 h-4 mr-2 text-green-500" />
                <span>Education</span>
              </div>
              <div>{collectedItems.education}/{totalItems.education}</div>
            </div>
            <Progress value={calculateProgress(collectedItems.education, totalItems.education)} className="h-2 bg-green-500/20" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-terminal-text">
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-2 text-yellow-500" />
                <span>Awards</span>
              </div>
              <div>{collectedItems.awards}/{totalItems.awards}</div>
            </div>
            <Progress value={calculateProgress(collectedItems.awards, totalItems.awards)} className="h-2 bg-yellow-500/20" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeProgressBar;
