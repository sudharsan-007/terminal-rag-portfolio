
import React from 'react';
import SkillsNetwork from '@/components/skills/SkillsNetwork';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Skills = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-terminal-text mb-8">Skills Network</h1>
        <div className="terminal-window h-[70vh]">
          <SkillsNetwork />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Skills;
