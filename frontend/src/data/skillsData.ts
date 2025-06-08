
import { SkillGraph, SkillNode, SkillLink } from '@/types/skill';

// Helper function to create nodes with default values
const createNode = (
  id: string,
  name: string,
  group: string,
  level: number,
  description: string
): SkillNode => ({
  id,
  name,
  group,
  level,
  description,
});

// Create nodes for each skill group
const languageNodes = [
  createNode("python", "Python", "Languages", 9, "Expert-level proficiency with Python for data science, machine learning, and automation"),
  createNode("c", "C", "Languages", 7, "Solid understanding of C for embedded systems and low-level programming"),
  createNode("cpp", "C++", "Languages", 7, "Experience with C++ for system-level programming and performance-critical applications"),
  createNode("sql", "SQL", "Languages", 8, "Proficient in database querying and management"),
  createNode("html", "HTML", "Languages", 8, "Strong foundation in HTML for web development"),
  createNode("bash", "Bash", "Languages", 8, "Extensive experience with shell scripting for automation and system administration")
];

const libraryNodes = [
  createNode("pytorch", "PyTorch", "Libraries", 9, "Expert in PyTorch for deep learning and neural networks"),
  createNode("tensorflow", "TensorFlow", "Libraries", 8, "Proficient in TensorFlow for machine learning model development"),
  createNode("pandas", "Pandas", "Libraries", 9, "Expert in data manipulation and analysis with Pandas"),
  createNode("matplotlib", "Matplotlib", "Libraries", 8, "Skilled in data visualization using Matplotlib"),
  createNode("numpy", "NumPy", "Libraries", 9, "Advanced numerical computing with NumPy"),
  createNode("scipy", "SciPy", "Libraries", 8, "Experience with scientific computing and algorithms"),
  createNode("opencv", "OpenCV", "Libraries", 9, "Expert in computer vision applications and image processing"),
  createNode("scikit", "Scikit-learn", "Libraries", 8, "Proficient in machine learning algorithms and techniques"),
  createNode("seaborn", "Seaborn", "Libraries", 7, "Advanced data visualization and statistical graphics")
];

const toolNodes = [
  createNode("docker", "Docker", "Tools", 8, "Container orchestration and deployment"),
  createNode("git", "Git", "Tools", 9, "Version control and collaborative development"),
  createNode("github", "GitHub", "Tools", 9, "Code hosting and project management"),
  createNode("conda", "Conda", "Tools", 8, "Environment and package management"),
  createNode("linux", "Linux", "Tools", 9, "Operating system administration and usage"),
  createNode("react", "React", "Tools", 7, "Frontend development with React"),
  createNode("gcp", "Google Cloud", "Tools", 6, "Cloud infrastructure and services"),
  createNode("nginx", "Nginx", "Tools", 7, "Web server configuration and proxy management"),
  createNode("cloudflare", "Cloudflare", "Tools", 7, "Web security and performance optimization")
];

const hardwareNodes = [
  createNode("raspi", "Raspberry Pi", "Hardware", 9, "Single-board computer for IoT and embedded projects"),
  createNode("arduino", "Arduino", "Hardware", 8, "Microcontroller platform for electronics prototyping"),
  createNode("i2c", "I2C", "Protocols", 7, "Inter-Integrated Circuit communication protocol"),
  createNode("spi", "SPI", "Protocols", 7, "Serial Peripheral Interface protocol"),
  createNode("uart", "UART", "Protocols", 7, "Universal Asynchronous Receiver-Transmitter protocol")
];

const softSkillNodes = [
  createNode("problemsolving", "Problem Solving", "SoftSkills", 9, "Analytical thinking and creative solutions"),
  createNode("decisionmaking", "Decision-making", "SoftSkills", 9, "Evaluating options and making effective choices"),
  createNode("teamwork", "Teamwork", "SoftSkills", 8, "Collaboration and group productivity"),
  createNode("adaptability", "Adaptability", "SoftSkills", 9, "Flexibility and openness to change"),
  createNode("selfdevelopment", "Self-Development", "SoftSkills", 9, "Continuous learning and improvement")
];

const interestNodes = [
  createNode("ml", "Machine Learning", "Interests", 10, "Deep interest in AI and machine learning applications"),
  createNode("autonomousdriving", "Autonomous Driving", "Interests", 10, "Passion for self-driving vehicle technology"),
  createNode("cv", "Computer Vision", "Interests", 10, "Enthusiasm for image recognition and visual computing"),
  createNode("robotics", "Robotics", "Interests", 9, "Interest in autonomous systems and robot design"),
  createNode("automotive", "Automotive Electronics", "Interests", 8, "Focus on electronic systems in vehicles")
];

// Combine all nodes
const nodes: SkillNode[] = [
  ...languageNodes,
  ...libraryNodes,
  ...toolNodes,
  ...hardwareNodes,
  ...softSkillNodes,
  ...interestNodes
];

// Create links between related skills
const links: SkillLink[] = [
  // Python connections
  { source: "python", target: "pytorch", strength: 9 },
  { source: "python", target: "tensorflow", strength: 9 },
  { source: "python", target: "pandas", strength: 9 },
  { source: "python", target: "numpy", strength: 9 },
  { source: "python", target: "opencv", strength: 9 },
  { source: "python", target: "scikit", strength: 9 },
  { source: "python", target: "ml", strength: 9 },
  { source: "python", target: "cv", strength: 9 },
  
  // C/C++ connections
  { source: "c", target: "cpp", strength: 8 },
  { source: "c", target: "arduino", strength: 8 },
  { source: "c", target: "raspi", strength: 7 },
  { source: "cpp", target: "raspi", strength: 7 },
  { source: "cpp", target: "opencv", strength: 7 },
  { source: "cpp", target: "robotics", strength: 8 },
  
  // Tools connections
  { source: "docker", target: "gcp", strength: 7 },
  { source: "git", target: "github", strength: 9 },
  { source: "nginx", target: "cloudflare", strength: 8 },
  
  // Hardware connections
  { source: "arduino", target: "i2c", strength: 7 },
  { source: "arduino", target: "spi", strength: 7 },
  { source: "arduino", target: "uart", strength: 7 },
  { source: "raspi", target: "i2c", strength: 7 },
  { source: "raspi", target: "spi", strength: 7 },
  { source: "raspi", target: "uart", strength: 7 },
  
  // Machine learning ecosystem
  { source: "ml", target: "pytorch", strength: 9 },
  { source: "ml", target: "tensorflow", strength: 9 },
  { source: "ml", target: "scikit", strength: 8 },
  { source: "ml", target: "cv", strength: 8 },
  { source: "ml", target: "autonomousdriving", strength: 8 },
  
  // Computer vision
  { source: "cv", target: "opencv", strength: 9 },
  { source: "cv", target: "autonomousdriving", strength: 9 },
  { source: "cv", target: "robotics", strength: 8 },
  
  // Data science stack
  { source: "pandas", target: "numpy", strength: 9 },
  { source: "pandas", target: "matplotlib", strength: 8 },
  { source: "matplotlib", target: "seaborn", strength: 8 },
  { source: "numpy", target: "scipy", strength: 8 },
  
  // Soft skills
  { source: "problemsolving", target: "decisionmaking", strength: 8 },
  { source: "problemsolving", target: "adaptability", strength: 7 },
  { source: "teamwork", target: "decisionmaking", strength: 7 },
  { source: "adaptability", target: "selfdevelopment", strength: 8 },
  
  // Interest connections
  { source: "autonomousdriving", target: "robotics", strength: 8 },
  { source: "autonomousdriving", target: "automotive", strength: 8 }
];

export const skillsData: SkillGraph = { nodes, links };
