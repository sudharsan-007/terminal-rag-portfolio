
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

const ResumeProgressBar: React.FC<ResumeProgressBarProps> = ({ collectedItems, totalItems }) => {
  const experienceProgress = (collectedItems.experience / totalItems.experience) * 100;
  const educationProgress = (collectedItems.education / totalItems.education) * 100;
  const awardsProgress = (collectedItems.awards / totalItems.awards) * 100;
  
  const totalProgress = 
    (collectedItems.experience + collectedItems.education + collectedItems.awards) / 
    (totalItems.experience + totalItems.education + totalItems.awards) * 100;
  
  return (
    <div className="bg-terminal-navy/40 p-4 rounded-lg border border-terminal-text/30 mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="text-terminal-accent1 text-lg">Resume Explorer</div>
        <div className="text-terminal-text">
          <span className="text-yellow-300 mr-1">★</span> 
          {collectedItems.experience + collectedItems.education + collectedItems.awards} collected
        </div>
      </div>
      
      <Progress value={totalProgress} className="h-2 mb-4" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="flex items-center mb-1">
            <Briefcase className="w-4 h-4 mr-2 text-blue-400" />
            <span className="text-blue-300 text-sm">Experience: {collectedItems.experience}/{totalItems.experience}</span>
          </div>
          <Progress value={experienceProgress} className="h-1.5" />
        </div>
        
        <div>
          <div className="flex items-center mb-1">
            <GraduationCap className="w-4 h-4 mr-2 text-green-400" />
            <span className="text-green-300 text-sm">Education: {collectedItems.education}/{totalItems.education}</span>
          </div>
          <Progress value={educationProgress} className="h-1.5" />
        </div>
        
        <div>
          <div className="flex items-center mb-1">
            <Award className="w-4 h-4 mr-2 text-yellow-400" />
            <span className="text-yellow-300 text-sm">Awards: {collectedItems.awards}/{totalItems.awards}</span>
          </div>
          <Progress value={awardsProgress} className="h-1.5" />
        </div>
      </div>
    </div>
  );
};

export default ResumeProgressBar;
