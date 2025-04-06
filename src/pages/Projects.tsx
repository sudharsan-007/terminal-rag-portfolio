import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProjectList from '@/components/projects/ProjectList';
import ProjectDetail from '@/components/projects/ProjectDetail';
import { Project } from '@/types/project';
import { useIsMobile } from '@/hooks/use-mobile';

const Projects: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const [showDetailView, setShowDetailView] = useState(false);
  const isMobile = useIsMobile();
  
  // Updated projects data from resume
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
    },
    {
      id: "awesome-devterminal",
      title: "Awesome-DevTerminal: The Developer's Comprehensive CLI Arsenal",
      shortDescription: "A curated collection of 166+ powerful command-line tools organized into intuitive categories to enhance developer productivity.",
      description: "A curated collection of 166+ powerful command-line tools organized into intuitive categories to enhance developer productivity. The project includes detailed documentation and practical descriptions for each tool, focusing on developer workflows and practical applications.",
      date: "January 2025 - March 2025",
      technologies: ["Technical Documentation", "CLI", "Open Source Contribution"],
      keyHighlights: [
        "Curated 166+ powerful command-line tools in intuitive categories",
        "Created detailed documentation for each tool",
        "Maintained high curation standards while expanding the collection",
        "Working toward a community goal of 500+ quality tools",
        "Focused on enhancing developer productivity and workflow"
      ],
      githubUrl: "https://github.com/yourname/awesome-devterminal"
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
      id: "ar-cube",
      title: "Live Webcam Augmented Reality - 3D Cube on April Tags",
      shortDescription: "A real-time augmented reality application that overlays a realistic 3D cube on top of AprilTag markers detected in a webcam feed.",
      description: "A real-time augmented reality application that overlays a realistic 3D cube on top of AprilTag markers detected in a webcam feed. The system implements camera calibration, perspective transformation, and 3D projection techniques to ensure proper cube placement and orientation relative to the marker.",
      date: "February 2023 - March 2023",
      technologies: ["OpenCV", "Computer Vision", "Augmented Reality (AR)", "Python", "Camera Calibration"],
      keyHighlights: [
        "Developed real-time AR application for webcam feed",
        "Implemented camera calibration and 3D projection techniques",
        "Created robust tracking system for marker detection",
        "Maintained virtual object positioning during camera movement",
        "Handled varying lighting conditions for reliable performance"
      ],
      githubUrl: "https://github.com/yourname/ar-cube"
    },
    {
      id: "mpc-simulation",
      title: "Self-Hosted MPC Simulation Playground for Autonomous Parking",
      shortDescription: "An interactive web application for Model Predictive Controller (MPC) simulation for vehicle parking using Streamlit, Python, and Docker.",
      description: "An interactive web application for Model Predictive Controller (MPC) simulation for vehicle parking using Streamlit, Python, and Docker on a home server. The system is configured with Nginx Proxy Manager and Cloudflare for secure, optimized traffic management, ensuring SSL encryption and DDoS protection.",
      date: "January 2023 - March 2023",
      technologies: ["Docker", "Python", "Cloud Infrastructure", "Model Predictive Control", "Web Development"],
      keyHighlights: [
        "Deployed interactive MPC simulation web application",
        "Configured secure infrastructure with Nginx and Cloudflare",
        "Developed multi-page interface for parameter experimentation",
        "Enabled real-time visualization of parking scenarios",
        "Optimized for accessibility to non-technical users"
      ],
      githubUrl: "https://github.com/yourname/mpc-simulation"
    },
    {
      id: "lane-detection",
      title: "OpenCV Lane Detection with Curvature and Offset Estimation",
      shortDescription: "A computer vision system for autonomous driving using advanced image processing to extract lane markings from video frames.",
      description: "A computer vision system for autonomous driving using Gaussian blur, Canny edge detection, and image processing to extract lane markings from video frames. The system implements a perspective transformation algorithm to calculate road curvature and vehicle offset from lane center.",
      date: "December 2022 - February 2023",
      technologies: ["OpenCV", "Python", "Computer Vision", "Image Processing", "Real-time Systems"],
      keyHighlights: [
        "Developed advanced lane detection system for autonomous driving",
        "Implemented perspective transformation for curvature calculation",
        "Created interactive interface with parameter sliders",
        "Added capability to process live webcam input",
        "Optimized for real-time performance on resource-constrained systems"
      ],
      githubUrl: "https://github.com/yourname/lane-detection"
    },
    {
      id: "tpsnet",
      title: "TPSNet: An Efficient Memory ResNet for Image Classification",
      shortDescription: "A mobile deep neural network architecture to classify the CIFAR-10 dataset with 95% accuracy.",
      description: "A mobile deep neural network architecture to classify the CIFAR-10 dataset with 95% accuracy. The model was trained using random search method over 1200 models for 20 epochs on NYU-Greene Supercomputer to optimize hyperparameters.",
      date: "February 2022 - April 2022",
      technologies: ["PyTorch", "Weights & Biases", "TensorBoard", "Deep Learning", "Image Classification"],
      keyHighlights: [
        "Developed efficient mobile-friendly neural network architecture",
        "Trained over 1200 models to optimize hyperparameters",
        "Achieved 95% accuracy on CIFAR-10 dataset",
        "Used NYU-Greene Supercomputer for training",
        "Implemented cosine annealing for optimal convergence"
      ],
      githubUrl: "https://github.com/yourname/tpsnet"
    },
    {
      id: "drlevn",
      title: "DRLEVN: Deep Reinforcement Learning Embodied Visual Navigation",
      shortDescription: "An end-to-end Deep Q reinforcement learning agent to find a target location by perceiving visual inputs.",
      description: "An end-to-end Deep Q reinforcement learning agent to find a target location by perceiving visual inputs. The system achieved a success rate of 85% in the Gibson environment for applications such as indoor robots searching for objects in a house.",
      date: "February 2022 - June 2022",
      technologies: ["Python", "Reinforcement Learning", "Deep Learning", "Computer Vision"],
      keyHighlights: [
        "Proposed end-to-end Deep Q reinforcement learning agent",
        "Achieved 85% success rate in Gibson environment",
        "Enabled visual-based navigation for indoor robots",
        "Implemented efficient training methodology",
        "Optimized for real-time decision making"
      ],
      githubUrl: "https://github.com/yourname/drlevn"
    },
    {
      id: "data-clustering",
      title: "Data Clustering and Visualization using Encoder-Decoder Deep CNN",
      shortDescription: "An encoder-decoder CNN trained on MNIST and Fashion MNIST datasets to extract feature vectors from unlabeled images.",
      description: "An encoder-decoder CNN trained on MNIST and Fashion MNIST datasets (60,000+ images) to extract feature vectors from unlabeled images. The system applies t-distributed Stochastic Neighbor Embedding (t-SNE) to reduce features to two dimensions, creating intuitive visual representations.",
      date: "February 2022",
      technologies: ["TensorFlow", "Dimensionality Reduction", "Data Visualization", "Deep Learning", "Unsupervised Learning"],
      keyHighlights: [
        "Trained encoder-decoder CNN on 60,000+ images",
        "Applied t-SNE for dimensionality reduction",
        "Generated interactive data visualizations",
        "Enabled pattern discovery in unlabeled datasets",
        "Created embedded image scatter plots for intuitive analysis"
      ],
      githubUrl: "https://github.com/yourname/data-clustering"
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full"
    >
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
    </motion.div>
  );
};

export default Projects;
