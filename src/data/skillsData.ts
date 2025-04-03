
import { SkillGraph } from '@/types/skill';

// Helper function to generate a color based on group
const getColorByGroup = (group: string): string => {
  const colorMap: Record<string, string> = {
    'Programming': '#4AFF91', // Terminal green
    'Libraries': '#9C27B0', // Terminal purple
    'Tools': '#E53935', // Terminal red
    'Protocols': '#2196F3', // Blue
    'Personal': '#FFEB3B', // Yellow
    'Interests': '#FF9800', // Orange
  };
  
  return colorMap[group] || '#4AFF91'; // Default to terminal green
};

// Generate the skills graph data
const generateSkillsData = (): SkillGraph => {
  // Define skill groups and their members
  const skillGroups = {
    'Programming': [
      { name: 'Python', level: 5, description: 'Primary programming language for ML and data science projects' },
      { name: 'Docker', level: 4, description: 'Container platform for deploying applications' },
      { name: 'SQL', level: 4, description: 'Database query language' },
      { name: 'C', level: 3, description: 'System programming language' },
      { name: 'C++', level: 3, description: 'Object-oriented programming language' },
      { name: 'HTML', level: 3, description: 'Web markup language' },
      { name: 'Bash', level: 4, description: 'Shell scripting language' },
      { name: 'MatLab', level: 4, description: 'Technical computing language' },
      { name: 'Simulink', level: 3, description: 'Block diagram environment for simulation' },
      { name: 'ROS', level: 4, description: 'Robot Operating System' },
      { name: 'RTOS', level: 3, description: 'Real-Time Operating System' }
    ],
    'Libraries': [
      { name: 'PyTorch', level: 5, description: 'Deep learning framework' },
      { name: 'TensorFlow', level: 4, description: 'Machine learning framework' },
      { name: 'Pandas', level: 5, description: 'Data manipulation library' },
      { name: 'Matplotlib', level: 4, description: 'Data visualization library' },
      { name: 'NumPy', level: 5, description: 'Scientific computing library' },
      { name: 'SciPy', level: 4, description: 'Scientific and technical computing' },
      { name: 'OpenCV', level: 5, description: 'Computer vision library' },
      { name: 'Scikit-learn', level: 5, description: 'Machine learning library' },
      { name: 'Seaborn', level: 4, description: 'Statistical data visualization' }
    ],
    'Tools': [
      { name: 'Excel', level: 4, description: 'Spreadsheet software' },
      { name: 'Tableau', level: 3, description: 'Data visualization tool' },
      { name: 'Google Cloud Platform', level: 4, description: 'Cloud computing services' },
      { name: 'Git', level: 5, description: 'Version control system' },
      { name: 'GitHub', level: 5, description: 'Git repository hosting' },
      { name: 'Conda', level: 4, description: 'Package management system' },
      { name: 'Pip', level: 4, description: 'Package installer for Python' },
      { name: 'Linux', level: 5, description: 'Operating system' },
      { name: 'Raspberry Pi', level: 5, description: 'Single-board computer' },
      { name: 'Arduino', level: 4, description: 'Microcontroller platform' },
      { name: 'Virtual Environments', level: 4, description: 'Isolated Python environments' },
      { name: 'React', level: 3, description: 'JavaScript library for UIs' },
      { name: 'npm', level: 3, description: 'Node package manager' },
      { name: 'node', level: 3, description: 'JavaScript runtime' },
      { name: 'Trello', level: 3, description: 'Project management tool' },
      { name: 'Linode', level: 3, description: 'Cloud hosting platform' },
      { name: 'Oracle VMware', level: 4, description: 'Virtualization platform' },
      { name: 'Nginx Proxy Manager', level: 3, description: 'Web server' },
      { name: 'Cloudflare', level: 3, description: 'Web infrastructure and security' },
      { name: 'AutoCAD', level: 4, description: 'Computer-aided design software' },
      { name: 'SolidWorks', level: 4, description: '3D CAD software' },
      { name: 'Cura', level: 3, description: '3D printing slicer' }
    ],
    'Protocols': [
      { name: 'I2C', level: 4, description: 'Inter-Integrated Circuit communication protocol' },
      { name: 'SPI', level: 4, description: 'Serial Peripheral Interface' },
      { name: 'UART', level: 4, description: 'Universal Asynchronous Receiver-Transmitter' }
    ],
    'Personal': [
      { name: 'Problem Solving', level: 5, description: 'Analytical approach to challenges' },
      { name: 'Decision-making', level: 5, description: 'Making timely and effective choices' },
      { name: 'Brainstorming', level: 5, description: 'Creative idea generation' },
      { name: 'Team work', level: 5, description: 'Collaborative working style' },
      { name: 'Adaptability', level: 5, description: 'Flexibility in changing environments' },
      { name: 'Self-Development', level: 5, description: 'Continuous learning and improvement' }
    ],
    'Interests': [
      { name: 'Machine Learning', level: 5, description: 'AI systems that can learn from data' },
      { name: 'Autonomous driving', level: 5, description: 'Self-driving vehicle technology' },
      { name: 'Computer Vision', level: 5, description: 'Systems that can understand visual data' },
      { name: 'Robotics', level: 5, description: 'Design and operation of robots' },
      { name: 'Automotive Electronics', level: 4, description: 'Electronic systems in vehicles' }
    ]
  };

  // Create nodes from skill groups
  const nodes: SkillNode[] = [];
  let nodeId = 0;
  
  Object.entries(skillGroups).forEach(([group, skills]) => {
    skills.forEach((skill) => {
      nodes.push({
        id: nodeId.toString(),
        name: skill.name,
        group,
        level: skill.level,
        description: skill.description,
        radius: 5 + skill.level * 2, // Size based on skill level
        color: getColorByGroup(group)
      });
      nodeId++;
    });
  });
  
  // Create links between related skills
  const links: SkillLink[] = [];
  
  // Function to find node ID by name
  const findNodeIdByName = (name: string): string | undefined => {
    const node = nodes.find(n => n.name === name);
    return node?.id;
  };
  
  // Define relationships between skills
  const relationships = [
    // Python with libraries
    { source: 'Python', targets: ['PyTorch', 'TensorFlow', 'Pandas', 'Matplotlib', 'NumPy', 'SciPy', 'OpenCV', 'Scikit-learn', 'Seaborn'] },
    // ML frameworks
    { source: 'PyTorch', targets: ['TensorFlow', 'NumPy', 'Machine Learning'] },
    { source: 'TensorFlow', targets: ['Machine Learning', 'Computer Vision'] },
    // Data science tools
    { source: 'Pandas', targets: ['NumPy', 'Matplotlib', 'Seaborn'] },
    { source: 'Matplotlib', targets: ['Seaborn', 'NumPy'] },
    // CV and ML
    { source: 'OpenCV', targets: ['Computer Vision', 'NumPy', 'Robotics'] },
    { source: 'Scikit-learn', targets: ['Machine Learning', 'NumPy'] },
    // DevOps
    { source: 'Docker', targets: ['Linux', 'Git'] },
    { source: 'Git', targets: ['GitHub'] },
    // Package management
    { source: 'Conda', targets: ['Pip', 'Python', 'Virtual Environments'] },
    // Web development
    { source: 'React', targets: ['npm', 'node', 'HTML'] },
    // Cloud and infrastructure
    { source: 'Google Cloud Platform', targets: ['Docker', 'Linux'] },
    { source: 'Nginx Proxy Manager', targets: ['Linux', 'Cloudflare'] },
    // Hardware
    { source: 'Raspberry Pi', targets: ['Linux', 'Arduino', 'I2C', 'SPI', 'UART'] },
    { source: 'Arduino', targets: ['C++', 'I2C', 'SPI', 'UART'] },
    // Protocols
    { source: 'I2C', targets: ['SPI', 'UART'] },
    // Robotics
    { source: 'ROS', targets: ['Robotics', 'Python', 'C++'] },
    { source: 'RTOS', targets: ['Embedded Systems', 'C', 'C++'] },
    // CAD and 3D printing
    { source: 'AutoCAD', targets: ['SolidWorks'] },
    { source: 'SolidWorks', targets: ['Cura'] },
    // Areas of interest
    { source: 'Machine Learning', targets: ['Autonomous driving', 'Computer Vision'] },
    { source: 'Computer Vision', targets: ['Robotics', 'Autonomous driving'] },
    { source: 'Robotics', targets: ['RTOS', 'Automotive Electronics'] },
    // Personal skills - connect to everything
    { source: 'Problem Solving', targets: ['Decision-making', 'Brainstorming'] },
    { source: 'Team work', targets: ['Adaptability', 'Self-Development'] },
  ];
  
  // Create links based on defined relationships
  relationships.forEach(rel => {
    const sourceId = findNodeIdByName(rel.source);
    if (sourceId) {
      rel.targets.forEach(targetName => {
        const targetId = findNodeIdByName(targetName);
        if (targetId && sourceId !== targetId) {
          links.push({
            source: sourceId,
            target: targetId,
            strength: 0.5 + Math.random() * 0.5, // Random strength between 0.5 and 1
          });
        }
      });
    }
  });
  
  // Add some random links to make the graph more connected
  for (let i = 0; i < nodes.length / 3; i++) {
    const sourceId = Math.floor(Math.random() * nodes.length).toString();
    const targetId = Math.floor(Math.random() * nodes.length).toString();
    
    if (sourceId !== targetId && !links.some(link => link.source === sourceId && link.target === targetId)) {
      links.push({
        source: sourceId,
        target: targetId,
        strength: 0.3 + Math.random() * 0.2, // Weaker random links
      });
    }
  }
  
  return { nodes, links };
};

export const skillsData: SkillGraph = generateSkillsData();
