
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectList from '@/components/projects/ProjectList';
import ProjectDetail from '@/components/projects/ProjectDetail';
import { Project } from '@/types/project';
import { ArrowUp, ArrowDown, GitHub } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Projects: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const [showDetailView, setShowDetailView] = useState(false);
  const isMobile = useIsMobile();
  
  // Sample projects data
  const projects: Project[] = [
    {
      id: "keyvault-ssh",
      title: "KeyVault SSH: SSH Key Management System",
      shortDescription: "A robust SSH key management system for cloud infrastructure that simplifies the creation, organization, and management of SSH keys.",
      description: "A robust SSH key management system for cloud infrastructure that simplifies the creation, organization, and management of SSH keys. The system implements structured naming conventions, automated SSH config generation, and comprehensive workflows for secure key rotation and access management.",
      date: "March 2025 - Present",
      technologies: ["Infrastructure Security", "Secure Shell (SSH)", "Linux System Administration"],
      keyHighlights: [
        "Developed an SSH key management system for cloud infrastructure teams",
        "Implemented secure key rotation and access control workflows",
        "Automated SSH config generation and structured naming conventions",
        "Reduced key management overhead by 65% for teams of 50+ engineers",
        "Built with security best practices and audit logging capabilities"
      ],
      githubUrl: "https://github.com/yourname/keyvault-ssh"
    },
    {
      id: "jetrat",
      title: "JetRat: Adaptable Imitation Learning Model for Autonomous Vehicles",
      shortDescription: "An end-to-end Deep Learning self-driving architecture that gets trained spontaneously by human input without needing to capture data.",
      description: "An end-to-end Deep Learning self-driving architecture that gets trained spontaneously by human input without needing to capture data. The model captured over 250,000 real-world image data points, refining transitions across varying environmental conditions and achieving 91.7% autonomy rate with a model efficient for low-powered devices.",
      date: "September 2022 - December 2022",
      technologies: ["PyTorch", "NVIDIA Jetson Nano", "OpenCV", "Matplotlib", "Computer Vision", "Deep Learning"],
      keyHighlights: [
        "Developed end-to-end imitation learning for autonomous driving",
        "Captured 250,000+ real-world image data points",
        "Achieved 91.7% autonomy rate in testing",
        "Reduced storage needs by up to 95% when deployed at scale",
        "Integrated multiple controller support (Xbox, PlayStation)"
      ],
      githubUrl: "https://github.com/yourname/jetrat"
    },
    {
      id: "servercozy",
      title: "ServerCozy: Cloud Server Environment Automation",
      shortDescription: "A bash-based automation toolkit that transforms bare cloud servers into comfortable, productive workspaces in minutes.",
      description: "A bash-based automation toolkit that transforms bare cloud servers into comfortable, productive workspaces in minutes. The system implements automated installation and configuration of development tools, security hardening, and personalized environment setup based on developer preferences.",
      date: "February 2025 - Present",
      technologies: ["Bash Scripting", "DevOps", "Cloud Infrastructure", "Linux", "Server Administration"],
      keyHighlights: [
        "Created a toolkit for rapid server environment setup",
        "Reduced new environment setup time from hours to minutes",
        "Implemented security hardening best practices by default",
        "Supports multiple cloud providers (AWS, GCP, Azure, DigitalOcean)",
        "Built-in customization for developer-specific preferences"
      ],
      githubUrl: "https://github.com/yourname/servercozy"
    }
  ];

  useEffect(() => {
    // Simulate loading to add a smooth entrance effect
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 200);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showDetailView) {
        if (e.key === 'Escape') {
          setShowDetailView(false);
        }
        return;
      }
      
      switch (e.key) {
        case 'ArrowUp':
          setSelectedProjectIndex(prev => 
            prev > 0 ? prev - 1 : projects.length - 1
          );
          break;
        case 'ArrowDown':
          setSelectedProjectIndex(prev => 
            prev < projects.length - 1 ? prev + 1 : 0
          );
          break;
        case 'Enter':
          setShowDetailView(true);
          break;
        case 'g':
        case 'G':
          if (projects[selectedProjectIndex].githubUrl) {
            window.open(projects[selectedProjectIndex].githubUrl, '_blank');
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProjectIndex, showDetailView, projects]);

  return (
    <div className="h-screen flex flex-col bg-terminal-bg overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto flex flex-col h-screen px-4"
      >
        <Header />
        
        <main className="flex-grow flex flex-col mt-4 mb-8 overflow-hidden">
          <div className="mb-4">
            <div className="text-terminal-text text-lg sm:text-xl md:text-2xl">
              sudharsan@portfolio:~/projects
            </div>
          </div>
          
          {showDetailView ? (
            <ProjectDetail 
              project={projects[selectedProjectIndex]} 
              onClose={() => setShowDetailView(false)}
            />
          ) : (
            <ProjectList 
              projects={projects} 
              selectedIndex={selectedProjectIndex} 
              setSelectedIndex={setSelectedProjectIndex}
              onViewDetails={() => setShowDetailView(true)}
            />
          )}
        </main>
        
        <Footer />
      </motion.div>
      
      {/* Background effects */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black to-terminal-navy/40 opacity-80" />
    </div>
  );
};

export default Projects;
