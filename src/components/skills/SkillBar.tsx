
import React from 'react';
import { motion } from 'framer-motion';

interface SkillBarProps {
  name: string;
  percentage: number;
}

const SkillBar: React.FC<SkillBarProps> = ({ name, percentage }) => {
  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-terminal-text">{name}</span>
        <span className="text-xs text-terminal-text/70">{percentage}%</span>
      </div>
      <div className="h-2 bg-terminal-navy rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-terminal-accent1"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>
    </div>
  );
};

export default SkillBar;
