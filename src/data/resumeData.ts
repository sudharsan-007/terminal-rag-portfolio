
// Resume data structure
interface Experience {
  company: string;
  role: string;
  location: string;
  period: string;
  achievements: string[];
  skills: string[];
}

interface Education {
  institution: string;
  degree: string;
  location: string;
  period: string;
  gpa?: string;
  coursework?: string;
  achievements?: string[];
}

interface Award {
  title: string;
  organization?: string;
  year?: string;
  description?: string;
  location?: string; // Added location property to the Award interface
}

interface ResumeData {
  experience: Experience[];
  education: Education[];
  awards: Award[];
  skills: string[];
}

const resumeData: ResumeData = {
  experience: [
    {
      company: "OrbDoc",
      role: "Chief Technology Officer",
      location: "New York, NY",
      period: "June 2024 - Present",
      achievements: [
        "Led a 7-member engineering team through product development lifecycle, implementing Agile methodologies and security protocols for healthcare data compliance, resulting in reduced development cycles from 4 weeks to 10 days",
        "Established enterprise security framework for HIPAA compliance, reducing vulnerability risks by 80% through implementation of encryption protocols, access controls, and audit logging systems for healthcare data protection",
        "Architected and implemented advanced AI features in OrbVoice using LangChain framework, reducing documentation time by 60% and achieving 95% accuracy in medical documentation through custom SOAP note generation",
        "Designed scalable microservices architecture and ML pipelines in GCP, achieving 99.9% uptime and 40% cost reduction through automated testing, optimized resource utilization, and robust validation methodologies"
      ],
      skills: ["Leadership", "AI", "Healthcare", "Security", "Microservices", "GCP", "LangChain"]
    },
    {
      company: "OrbDoc",
      role: "Senior Software Engineer",
      location: "New York, NY",
      period: "January 2024 - June 2024",
      achievements: [
        "Developed production-level code using Python and React, resulting in a 30% improvement in application performance through efficient algorithms and optimized database queries",
        "Implemented CI/CD pipelines and GitHub automation, reducing deployment time by 40% and increasing team productivity by 25% through Docker containerization and GitHub Actions",
        "Managed cross-functional teams using Agile methodologies, increasing on-time project deliveries by 20% through sprint planning and establishing development best practices",
        "Led the development of OrbVoice platform, reducing clinician documentation time by 50% and improving medical record accuracy through automated SOAP note generation"
      ],
      skills: ["Python", "React", "CI/CD", "Docker", "Agile", "GitHub Actions", "Team Management"]
    },
    {
      company: "OrbDoc",
      role: "Embedded Software Developer & Prototype Tester",
      location: "New York, NY",
      period: "July 2023 - January 2024",
      achievements: [
        "Engineered a portable handheld device for patient data access and vitals monitoring, achieving measurement accuracy rates of 97.11% for heart rate, 98.84% for oxygen saturation, and ±0.2°C for temperature",
        "Led product lifecycle management, resulting in a 40% cost reduction in PCB manufacturing and obtaining a provisional patent for innovative design through optimization of component selection",
        "Transitioned the system to Zephyr RTOS, enhancing system reliability by 30% and reducing software-related issues by 50% through improved resource management",
        "Integrated edge ML technologies for real-time disease prediction, achieving a 5x improvement in model performance and contributing to early sepsis detection through optimized models"
      ],
      skills: ["Embedded Systems", "RTOS", "PCB Design", "Edge ML", "IoT", "Hardware Prototyping"]
    },
    {
      company: "AI4CE Lab",
      role: "Research Assistant",
      location: "Downtown Brooklyn, NY",
      period: "April 2022 - January 2024",
      achievements: [
        "Developed a synthetic autonomous car dataset using the Carla simulator, enhancing Visual Place Recognition (VPR) studies accuracy by 35% through generation of 360-degree imagery, GPS, and IMU data",
        "Led the Mapping NYC project, achieving 95% accuracy in real-time mapping by integrating multi-sensor data (2 Lidars, 2 cameras, and GPS) using ROS and rviz visualization",
        "Improved VPR model performance by 25% and reduced false positives by 40% through rigorous testing and novel architecture modifications",
        "Created a benchmarking suite for evaluating VPR algorithms, implementing data augmentation techniques to improve model generalization and diversity"
      ],
      skills: ["Research", "Computer Vision", "ROS", "Lidar", "Data Generation", "Benchmarking"]
    },
    {
      company: "HOP (High on Program)",
      role: "Founder & CEO",
      location: "Chennai, India",
      period: "November 2020 - April 2021",
      achievements: [
        "Founded a startup focusing on empowering students and career switchers with software skills to meet industry requirements",
        "Participated in all aspects of business development from market research to operations, upholding the company's vision",
        "Generated revenue equivalent to initial investment in the first months of operation, outperforming 80% of similar regional startups",
        "Expanded the team from 7 to 20+ members, increasing course offerings by 150% through strategic hiring and training programs"
      ],
      skills: ["Entrepreneurship", "Leadership", "Business Development", "Education", "Team Building"]
    }
  ],
  education: [
    {
      institution: "New York University",
      degree: "Master of Science - Mechatronics, Robotics, and Automation Engineering",
      location: "New York, NY",
      period: "August 2021 - May 2023",
      coursework: "Deep Learning, Robot Perception, Reinforcement Learning and Optimal Control, Mechatronics, Algorithms"
    },
    {
      institution: "Sri Venkateswara College of Engineering",
      degree: "Bachelor of Engineering - Automobile Engineering",
      location: "Chennai, India",
      period: "July 2017 - May 2021",
      coursework: "Electric Vehicles, Battery Technologies, Vehicle Dynamics, Electric Vehicle Motors",
      achievements: [
        "1st place in SAE (regional level) Technical Paper Presentation",
        "SVCE INNOVATES 2019 winner",
        "National level Technical Symposium winner",
        "Designed super-capacitor prototype car with stabilized discharge voltage using buck boost converter",
        "Prototyped early detection and external bumper deployment technology in scaled RC car using Arduino and sensors"
      ]
    },
    {
      institution: "The Velammal International School",
      degree: "Higher Secondary Examination",
      location: "Chennai, India",
      period: "April 2015 - March 2017",
      gpa: "Score: 1005/1200 (83.75%)",
      achievements: [
        "PROJECT TRIKE (2016): Built ambitious 3-wheeled vehicle showcased at various expos"
      ]
    },
    {
      institution: "MES Indian School",
      degree: "Secondary School Examination",
      location: "Doha, Qatar",
      period: "March 2013 - March 2015",
      gpa: "CGPA: 7.8"
    }
  ],
  awards: [
    {
      title: "1st place, SAE Technical Paper Presentation",
      organization: "Society of Automotive Engineers",
      year: "2020",
      description: "Regional level recognition for technical innovation and presentation skills."
    },
    {
      title: "1st place, SVCE INNOVATES 2019",
      organization: "Sri Venkateswara College of Engineering",
      year: "2019",
      description: "Winner at Student's Research Day for innovative engineering solutions."
    },
    {
      title: "1st place, National level Technical Symposium",
      year: "2019"
    },
    {
      title: "3rd place, Technical Paper Presentation - Tier 3",
      organization: "SAE Southern Section",
      year: "2020"
    },
    {
      title: "1st place, Technical Paper Presentation - Tier 2",
      organization: "SAE Southern Section",
      year: "2020"
    },
    {
      title: "2nd place, KEC Young Inventors Award",
      location: "Doha, Qatar"
    },
    {
      title: "1st place, Science Fair",
      organization: "MES Indian School",
      location: "Doha, Qatar"
    },
    {
      title: "2nd place, Science Fair",
      organization: "MES Indian School",
      location: "Doha, Qatar"
    }
  ],
  skills: [
    "Python", "Docker", "SQL", "C", "C++", "HTML", "Bash", "MatLab", "Simulink", "ROS", "RTOS",
    "AutoCAD", "SolidWorks", "PyTorch", "TensorFlow", "Pandas", "OpenCV", "Scikit-learn",
    "GCP", "Git", "GitHub", "Linux", "Raspberry Pi", "Arduino", "React", "npm", "node",
    "Machine Learning", "Autonomous driving", "Computer Vision", "Robotics", "Automotive Electronics"
  ]
};

export default resumeData;
