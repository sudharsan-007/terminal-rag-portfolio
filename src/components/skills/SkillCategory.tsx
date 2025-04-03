
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface SkillCategoryProps {
  name: string;
  description: string;
  children: React.ReactNode;
}

const SkillCategory: React.FC<SkillCategoryProps> = ({ name, description, children }) => {
  return (
    <Card className="border-terminal-text/30 bg-terminal-navy/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-terminal-accent1">{name}</CardTitle>
        <CardDescription className="text-terminal-text/70">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default SkillCategory;
