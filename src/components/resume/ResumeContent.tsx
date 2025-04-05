
import React from 'react';
import resumeData from '@/data/resumeData';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Briefcase, GraduationCap, Award, Star } from 'lucide-react';

interface ResumeContentProps {
  activeSection: string;
}

const ResumeContent: React.FC<ResumeContentProps> = ({ activeSection }) => {
  if (!activeSection) {
    return (
      <div className="text-terminal-text">
        <p className="mb-4">Scroll or start the game to explore my professional journey!</p>
        <p>Collect items to reveal details about my:</p>
        <ul className="list-disc pl-5 mt-2 space-y-2">
          <li className="flex items-center"><Briefcase className="w-4 h-4 mr-2 text-blue-500" /> Work Experience</li>
          <li className="flex items-center"><GraduationCap className="w-4 h-4 mr-2 text-green-500" /> Education</li>
          <li className="flex items-center"><Award className="w-4 h-4 mr-2 text-yellow-500" /> Awards & Achievements</li>
        </ul>
      </div>
    );
  }
  
  const [type, index] = activeSection.split('-');
  const numIndex = parseInt(index);
  
  if (type === 'experience' && numIndex < resumeData.experience.length) {
    const exp = resumeData.experience[numIndex];
    return (
      <div className="text-terminal-text">
        <h3 className="text-lg text-terminal-accent1 mb-2">{exp.role}</h3>
        <div className="flex items-center text-sm mb-1">
          <Briefcase className="w-4 h-4 mr-1" />
          <span>{exp.company}</span>
        </div>
        <div className="flex items-center text-sm mb-1">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{exp.location}</span>
        </div>
        <div className="flex items-center text-sm mb-3">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{exp.period}</span>
        </div>
        
        <div className="mt-4">
          <ul className="list-disc pl-5 space-y-2">
            {exp.achievements.map((achievement, i) => (
              <li key={i}>{achievement}</li>
            ))}
          </ul>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {exp.skills.map((skill, i) => (
            <Badge key={i} variant="secondary">{skill}</Badge>
          ))}
        </div>
      </div>
    );
  }
  
  if (type === 'education' && numIndex < resumeData.education.length) {
    const edu = resumeData.education[numIndex];
    return (
      <div className="text-terminal-text">
        <h3 className="text-lg text-terminal-accent1 mb-2">{edu.institution}</h3>
        <div className="flex items-center text-sm mb-1">
          <GraduationCap className="w-4 h-4 mr-1" />
          <span>{edu.degree}</span>
        </div>
        <div className="flex items-center text-sm mb-1">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{edu.location}</span>
        </div>
        <div className="flex items-center text-sm mb-3">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{edu.period}</span>
        </div>
        
        {edu.gpa && (
          <div className="mt-2 mb-3">
            <div className="font-medium">GPA/Score:</div>
            <div>{edu.gpa}</div>
          </div>
        )}
        
        {edu.coursework && (
          <div className="mt-2">
            <div className="font-medium mb-1">Relevant Coursework:</div>
            <div>{edu.coursework}</div>
          </div>
        )}
        
        {edu.achievements && edu.achievements.length > 0 && (
          <div className="mt-4">
            <div className="font-medium mb-1">Achievements:</div>
            <ul className="list-disc pl-5 space-y-1">
              {edu.achievements.map((achievement, i) => (
                <li key={i}>{achievement}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
  
  if (type === 'award' && numIndex < resumeData.awards.length) {
    const award = resumeData.awards[numIndex];
    return (
      <div className="text-terminal-text">
        <h3 className="text-lg text-terminal-accent1 mb-2">
          <div className="flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-500" />
            {award.title}
          </div>
        </h3>
        
        {award.organization && (
          <div className="text-sm mb-1">{award.organization}</div>
        )}
        
        {award.year && (
          <div className="flex items-center text-sm mb-3">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{award.year}</span>
          </div>
        )}
        
        {award.description && (
          <div className="mt-2">
            <p>{award.description}</p>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="text-terminal-text">
      <p className="text-center">Select an item to view details</p>
    </div>
  );
};

export default ResumeContent;
