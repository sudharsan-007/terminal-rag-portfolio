
import React, { useEffect, useRef, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { ArrowUp, ArrowDown, Briefcase, GraduationCap, Award } from 'lucide-react';
import resumeData from '@/data/resumeData';

interface GameObject {
  x: number;
  y: number;
  type: 'experience' | 'education' | 'awards';
  id: string;
  collected: boolean;
  element?: HTMLDivElement | null;
}

interface ResumeGameProps {
  onItemCollect: (type: 'experience' | 'education' | 'awards', id: string) => void;
  setShowGame: (show: boolean) => void;
}

const ResumeGame: React.FC<ResumeGameProps> = ({ onItemCollect, setShowGame }) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [isJumping, setIsJumping] = useState(false);
  const [isDucking, setIsDucking] = useState(false);
  const [gameObjects, setGameObjects] = useState<GameObject[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [gameProgress, setGameProgress] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const gameSpeed = useRef(5);
  const gravity = useRef(1);
  const playerY = useRef(0);
  const playerVelocity = useRef(0);
  const initialObjects = useRef<GameObject[]>([]);
  const animationFrameId = useRef(0);
  const lastTimestamp = useRef(0);
  
  // Initialize game objects from resume data
  useEffect(() => {
    // Create game objects from resume data
    const objects: GameObject[] = [];
    
    // Add experience items
    resumeData.experience.forEach((exp, index) => {
      objects.push({
        x: 800 + (index * 500),
        y: 0,
        type: 'experience',
        id: `experience-${index}`,
        collected: false
      });
    });
    
    // Add education items
    resumeData.education.forEach((edu, index) => {
      objects.push({
        x: 1200 + (index * 600),
        y: 0,
        type: 'education',
        id: `education-${index}`,
        collected: false
      });
    });
    
    // Add awards items
    resumeData.awards.forEach((award, index) => {
      objects.push({
        x: 1600 + (index * 400),
        y: 0,
        type: 'awards',
        id: `award-${index}`,
        collected: false
      });
    });
    
    initialObjects.current = [...objects];
    setGameObjects(objects);
  }, []);
  
  // Setup keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGameActive) return;
      
      if (e.key === 'ArrowUp' || e.code === 'Space') {
        jump();
      }
      
      if (e.key === 'ArrowDown') {
        setIsDucking(true);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        setIsDucking(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isGameActive]);
  
  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (gameRef.current) {
        const newPosition = window.scrollY;
        if (newPosition > scrollPosition) {
          // Scrolling down - start or continue game
          if (!isGameActive) {
            setIsGameActive(true);
          }
        } else if (newPosition < scrollPosition) {
          // Scrolling up - can trigger different action if needed
        }
        setScrollPosition(newPosition);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollPosition, isGameActive]);
  
  // Game animation loop
  useEffect(() => {
    if (!isGameActive || gameOver) return;
    
    const gameLoop = (timestamp: number) => {
      if (!lastTimestamp.current) {
        lastTimestamp.current = timestamp;
      }
      
      const deltaTime = timestamp - lastTimestamp.current;
      lastTimestamp.current = timestamp;
      
      // Update game state
      updateGameState(deltaTime);
      
      // Continue animation loop
      animationFrameId.current = requestAnimationFrame(gameLoop);
    };
    
    animationFrameId.current = requestAnimationFrame(gameLoop);
    
    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [isGameActive, gameOver]);
  
  const updateGameState = (deltaTime: number) => {
    if (!playerRef.current || !gameRef.current) return;
    
    // Update player position
    if (isJumping) {
      playerVelocity.current += gravity.current;
      playerY.current += playerVelocity.current;
      
      // Check if player landed
      if (playerY.current >= 0) {
        playerY.current = 0;
        playerVelocity.current = 0;
        setIsJumping(false);
      }
      
      playerRef.current.style.transform = `translateY(${playerY.current}px)`;
    }
    
    // Move game objects
    const updatedObjects = gameObjects.map(obj => {
      const newX = obj.x - gameSpeed.current;
      
      // Check for collisions
      if (!obj.collected && 
          newX < 100 && 
          newX > 0 && 
          ((isJumping && playerY.current < -20) || !isJumping)) {
        // Collect the item
        onItemCollect(obj.type, obj.id);
        setScore(prev => prev + 1);
        return { ...obj, collected: true, x: newX };
      }
      
      return { ...obj, x: newX };
    });
    
    setGameObjects(updatedObjects);
    
    // Update progress
    const totalDistance = initialObjects.current.length * 500;
    const currentDistance = Math.min(score * 500, totalDistance);
    const progress = (currentDistance / totalDistance) * 100;
    setGameProgress(progress);
    
    // Check if game is complete
    if (progress >= 100) {
      setGameOver(true);
      setIsGameActive(false);
      setShowGame(false);
    }
  };
  
  const jump = () => {
    if (!isJumping) {
      setIsJumping(true);
      playerVelocity.current = -20;
    }
  };
  
  const startGame = () => {
    setIsGameActive(true);
    setGameOver(false);
    setScore(0);
    setGameProgress(0);
    
    // Reset game objects
    setGameObjects(initialObjects.current.map(obj => ({ ...obj, collected: false })));
  };
  
  // Render game objects based on their type
  const renderGameObject = (obj: GameObject) => {
    const iconSize = 32;
    
    if (obj.collected) return null;
    
    let icon;
    let colorClass = '';
    
    switch (obj.type) {
      case 'experience':
        icon = <Briefcase size={iconSize} />;
        colorClass = 'text-blue-500';
        break;
      case 'education':
        icon = <GraduationCap size={iconSize} />;
        colorClass = 'text-green-500';
        break;
      case 'awards':
        icon = <Award size={iconSize} />;
        colorClass = 'text-yellow-500';
        break;
    }
    
    return (
      <div 
        key={obj.id}
        className={`absolute ${colorClass}`}
        style={{
          transform: `translateX(${obj.x}px)`,
          bottom: '10px'
        }}
      >
        {icon}
      </div>
    );
  };
  
  return (
    <div className="relative h-[300px] border border-terminal-text/30 rounded-md">
      {/* Progress bar */}
      <div className="absolute top-2 left-2 right-2 z-10">
        <Progress value={gameProgress} className="h-2" />
      </div>
      
      <div className="absolute top-4 left-2 text-terminal-text z-10">
        Score: {score}
      </div>
      
      {!isGameActive && !gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-terminal-navy/80 z-20 backdrop-blur-sm">
          <div className="text-xl text-terminal-accent1 mb-4">Scroll to explore my journey</div>
          <div className="flex space-x-4 mb-4">
            <div className="flex flex-col items-center">
              <ArrowUp className="text-terminal-text" />
              <span className="text-terminal-text text-sm">Jump</span>
            </div>
            <div className="flex flex-col items-center">
              <ArrowDown className="text-terminal-text" />
              <span className="text-terminal-text text-sm">Duck</span>
            </div>
          </div>
          <button
            onClick={startGame}
            className="px-4 py-2 bg-terminal-accent1 text-black rounded-md hover:bg-terminal-accent1/80"
          >
            Start Game
          </button>
        </div>
      )}
      
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-terminal-navy/80 z-20 backdrop-blur-sm">
          <div className="text-xl text-terminal-accent1 mb-4">Journey Complete!</div>
          <div className="text-terminal-text mb-4">You've explored my entire resume</div>
          <button
            onClick={startGame}
            className="px-4 py-2 bg-terminal-accent1 text-black rounded-md hover:bg-terminal-accent1/80"
          >
            Play Again
          </button>
        </div>
      )}
      
      <div
        ref={gameRef}
        className="relative h-full overflow-hidden bg-terminal-navy/30"
      >
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-terminal-text/50"></div>
        
        {/* Player character (dinosaur) */}
        <div
          ref={playerRef}
          className={`absolute bottom-10 left-20 w-12 h-12 ${isDucking ? 'h-6' : 'h-12'}`}
        >
          <div className="h-full w-full rounded-full bg-terminal-accent1 flex items-center justify-center">
            <span className="text-black font-bold">S</span>
          </div>
        </div>
        
        {/* Render game objects */}
        {gameObjects.map(renderGameObject)}
      </div>
    </div>
  );
};

export default ResumeGame;
