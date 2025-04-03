
export interface Skill {
  name: string;
  level: number; // 0-100
  category: 'software' | 'library' | 'tool' | 'protocol' | 'personal';
}

export interface SkillCategory {
  name: string;
  description: string;
  skills: Skill[];
}

export interface InterestArea {
  name: string;
  description: string;
}

export const skillsData: SkillCategory[] = [
  {
    name: "Software & Languages",
    description: "Programming languages and software I've mastered throughout my career",
    skills: [
      { name: "Python", level: 95, category: "software" },
      { name: "C/C++", level: 85, category: "software" },
      { name: "Docker", level: 80, category: "software" },
      { name: "SQL", level: 75, category: "software" },
      { name: "HTML", level: 70, category: "software" },
      { name: "Bash", level: 80, category: "software" },
      { name: "MATLAB", level: 75, category: "software" },
      { name: "Simulink", level: 70, category: "software" },
      { name: "ROS", level: 85, category: "software" },
      { name: "RTOS", level: 75, category: "software" },
      { name: "AutoCAD", level: 65, category: "software" },
      { name: "SolidWorks", level: 60, category: "software" },
      { name: "Cura", level: 75, category: "software" },
    ]
  },
  {
    name: "Libraries & Frameworks",
    description: "Technical libraries and frameworks I use to build intelligent systems",
    skills: [
      { name: "PyTorch", level: 90, category: "library" },
      { name: "TensorFlow", level: 85, category: "library" },
      { name: "Pandas", level: 90, category: "library" },
      { name: "NumPy", level: 95, category: "library" },
      { name: "Matplotlib", level: 85, category: "library" },
      { name: "SciPy", level: 80, category: "library" },
      { name: "OpenCV", level: 90, category: "library" },
      { name: "Scikit-learn", level: 85, category: "library" },
      { name: "Seaborn", level: 75, category: "library" },
    ]
  },
  {
    name: "Tools & Platforms",
    description: "Development and deployment tools I leverage in my workflow",
    skills: [
      { name: "Git/GitHub", level: 90, category: "tool" },
      { name: "Linux", level: 90, category: "tool" },
      { name: "Excel", level: 75, category: "tool" },
      { name: "Tableau", level: 70, category: "tool" },
      { name: "Google Cloud Platform", level: 80, category: "tool" },
      { name: "Conda/Pip", level: 85, category: "tool" },
      { name: "Raspberry Pi", level: 90, category: "tool" },
      { name: "Arduino", level: 85, category: "tool" },
      { name: "React", level: 75, category: "tool" },
      { name: "Node.js/npm", level: 70, category: "tool" },
      { name: "Trello", level: 65, category: "tool" },
      { name: "Linode", level: 70, category: "tool" },
      { name: "VMware", level: 75, category: "tool" },
      { name: "Nginx", level: 70, category: "tool" },
      { name: "Cloudflare", level: 65, category: "tool" },
    ]
  },
  {
    name: "Protocols",
    description: "Communication protocols I've implemented in embedded systems",
    skills: [
      { name: "I2C", level: 80, category: "protocol" },
      { name: "SPI", level: 80, category: "protocol" },
      { name: "UART", level: 85, category: "protocol" },
    ]
  },
  {
    name: "Personal Skills",
    description: "Soft skills that complement my technical abilities",
    skills: [
      { name: "Problem Solving", level: 95, category: "personal" },
      { name: "Decision Making", level: 90, category: "personal" },
      { name: "Brainstorming", level: 85, category: "personal" },
      { name: "Teamwork", level: 90, category: "personal" },
      { name: "Adaptability", level: 95, category: "personal" },
      { name: "Self-Development", level: 90, category: "personal" },
    ]
  },
];

export const interestAreas: InterestArea[] = [
  {
    name: "Machine Learning",
    description: "Developing neural network architectures and ML algorithms for advanced prediction and classification tasks."
  },
  {
    name: "Computer Vision",
    description: "Creating systems that can interpret visual information, from image classification to complex scene understanding."
  },
  {
    name: "Autonomous Driving",
    description: "Building the technology that enables vehicles to sense their environment and navigate without human input."
  },
  {
    name: "Robotics",
    description: "Designing and programming intelligent machines that can interact with the physical world."
  },
  {
    name: "Automotive Electronics",
    description: "Developing electronic systems and software for next-generation vehicles with a focus on safety and efficiency."
  }
];

export const professionalSummary = `Visionary technology leader with expertise in AI, robotics, and healthcare innovation. 
Proven track record in developing cutting-edge solutions at the intersection of machine learning, 
computer vision, and embedded systems. Experience leading cross-functional teams to deliver 
scalable, high-impact technologies from conceptualization to implementation.`;
