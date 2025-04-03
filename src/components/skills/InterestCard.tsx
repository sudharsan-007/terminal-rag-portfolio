
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface InterestCardProps {
  name: string;
  description: string;
}

const InterestCard: React.FC<InterestCardProps> = ({ name, description }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Card className="h-full border-terminal-text/30 bg-terminal-navy/60 backdrop-blur-sm hover:border-terminal-accent1 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-terminal-accent2">{name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-terminal-text/80">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InterestCard;
