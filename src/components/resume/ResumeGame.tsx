
import React, { useEffect, useRef, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { ArrowUp, ArrowDown, Briefcase, GraduationCap, Award, Star } from 'lucide-react';
import resumeData from '@/data/resumeData';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  
  const { toast } = useToast();
  
  // Game mechanics references
  const gameSpeed = useRef(3); // Reduced speed for better control
  const gravity = useRef(1);
  const playerY = useRef(0);
  const playerVelocity = useRef(0);
  const playerX = useRef(50); // Fixed X position for player
  const initialObjects = useRef<GameObject[]>([]);
  const animationFrameId = useRef(0);
  const lastTimestamp = useRef(0);
  const isPaused = useRef(false);
  
  // Initialize game objects from resume data
  useEffect(() => {
    // Create game objects from resume data
    const objects: GameObject[] = [];
    
    // Add experience items - using only the first 5 experiences
    resumeData.experience.slice(0, 5).forEach((exp, index) => {
      objects.push({
        x: 800 + (index * 600), // Increased spacing
        y: 0,
        type: 'experience',
        id: `experience-${index}`,
        collected: false
      });
    });
    
    // Add education items - using only 2 education items
    resumeData.education.slice(0, 2).forEach((edu, index) => {
      objects.push({
        x: 1200 + (index * 700), // Increased spacing
        y: 0,
        type: 'education',
        id: `education-${index}`,
        collected: false
      });
    });
    
    // Add awards items - using only 3 awards
    resumeData.awards.slice(0, 3).forEach((award, index) => {
      objects.push({
        x: 2600 + (index * 500), // Increased spacing and starting further
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
      if (!isGameActive || isPaused.current) return;
      
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
  
  // Handle dialog close
  const handleDialogClose = () => {
    setDialogOpen(false);
    isPaused.current = false;
    
    // Resume game after dialog is closed
    if (isGameActive && !gameOver) {
      lastTimestamp.current = performance.now();
      animationFrameId.current = requestAnimationFrame(gameLoop);
    }
  };
  
  // Game animation loop
  useEffect(() => {
    if (!isGameActive || gameOver) return;
    
    const startGame = () => {
      lastTimestamp.current = performance.now();
      animationFrameId.current = requestAnimationFrame(gameLoop);
    };
    
    startGame();
    
    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [isGameActive, gameOver]);
  
  const gameLoop = (timestamp: number) => {
    if (isPaused.current) return;
    
    if (!lastTimestamp.current) {
      lastTimestamp.current = timestamp;
    }
    
    const deltaTime = timestamp - lastTimestamp.current;
    lastTimestamp.current = timestamp;
    
    // Update game state
    updateGameState(deltaTime);
    
    // Continue animation loop if game is still active
    if (isGameActive && !gameOver && !isPaused.current) {
      animationFrameId.current = requestAnimationFrame(gameLoop);
    }
  };
  
  const updateGameState = (deltaTime: number) => {
    if (!playerRef.current || !gameRef.current || isPaused.current) return;
    
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
      
      // Check for collisions with better collision detection
      if (!obj.collected && 
          newX < playerX.current + 40 && // Right edge of player
          newX > playerX.current - 40 && // Left edge of player
          ((isJumping && playerY.current < -20) || !isJumping)) {
        
        // Pause the game
        isPaused.current = true;
        cancelAnimationFrame(animationFrameId.current);
        
        // Get item details
        let itemDetails;
        if (obj.type === 'experience') {
          const index = parseInt(obj.id.split('-')[1]);
          itemDetails = resumeData.experience[index];
        } else if (obj.type === 'education') {
          const index = parseInt(obj.id.split('-')[1]);
          itemDetails = resumeData.education[index];
        } else if (obj.type === 'awards') {
          const index = parseInt(obj.id.split('-')[1]);
          itemDetails = resumeData.awards[index];
        }
        
        // Set current item for dialog
        setCurrentItem({
          type: obj.type,
          id: obj.id,
          details: itemDetails
        });
        
        // Show dialog
        setDialogOpen(true);
        
        // Collect the item
        onItemCollect(obj.type, obj.id);
        setScore(prev => prev + 1);
        
        // Show toast notification
        toast({
          title: "Item Collected!",
          description: `You've collected a ${obj.type} item.`,
          duration: 3000
        });
        
        return { ...obj, collected: true, x: newX };
      }
      
      return { ...obj, x: newX };
    });
    
    setGameObjects(updatedObjects);
    
    // Update progress
    const totalItems = initialObjects.current.length;
    const collectedItems = updatedObjects.filter(obj => obj.collected).length;
    const progress = (collectedItems / totalItems) * 100;
    setGameProgress(progress);
    
    // Check if game is complete
    if (progress >= 100) {
      setGameOver(true);
      setIsGameActive(false);
      toast({
        title: "Journey Complete!",
        description: "You've explored the entire resume.",
        duration: 5000
      });
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
    isPaused.current = false;
    
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
        icon = <Star size={iconSize} />;
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
          <div className="text-xl text-terminal-accent1 mb-4">Collect items to explore my journey</div>
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
        
        {/* Player character */}
        <div
          ref={playerRef}
          className={`absolute bottom-10 left-[${playerX.current}px] w-12 ${isDucking ? 'h-6' : 'h-12'}`}
          style={{ left: `${playerX.current}px` }}
        >
          <div className="h-full w-full rounded-full bg-terminal-accent1 flex items-center justify-center">
            <span className="text-black font-bold">S</span>
          </div>
        </div>
        
        {/* Render game objects */}
        {gameObjects.map(renderGameObject)}
      </div>
      
      {/* Dialog for showing item details */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        if (!open) handleDialogClose();
      }}>
        <DialogContent className="bg-terminal-navy border-terminal-text text-terminal-text">
          <DialogHeader>
            <DialogTitle className="text-terminal-accent1">
              {currentItem?.type === 'experience' ? 'Experience Details' : 
               currentItem?.type === 'education' ? 'Education Details' : 'Fun Fact'}
            </DialogTitle>
          </DialogHeader>
          
          <DialogDescription className="text-terminal-text">
            {currentItem?.details && (
              <div className="space-y-2">
                {currentItem.type === 'experience' && (
                  <>
                    <h3 className="text-terminal-accent1 font-bold">{currentItem.details.role} at {currentItem.details.company}</h3>
                    <p>{currentItem.details.period} | {currentItem.details.location}</p>
                    <div className="mt-2">
                      <h4 className="text-terminal-accent1">Key Achievements:</h4>
                      <ul className="list-disc pl-5 space-y-1 mt-1">
                        {currentItem.details.achievements.slice(0, 2).map((achievement: string, i: number) => (
                          <li key={i}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
                
                {currentItem.type === 'education' && (
                  <>
                    <h3 className="text-terminal-accent1 font-bold">{currentItem.details.degree}</h3>
                    <p>{currentItem.details.institution}</p>
                    <p>{currentItem.details.period} | {currentItem.details.location}</p>
                    {currentItem.details.coursework && (
                      <div className="mt-2">
                        <h4 className="text-terminal-accent1">Key Coursework:</h4>
                        <p>{currentItem.details.coursework}</p>
                      </div>
                    )}
                  </>
                )}
                
                {currentItem.type === 'awards' && (
                  <>
                    <h3 className="text-terminal-accent1 font-bold">{currentItem.details.title}</h3>
                    <p>{currentItem.details.description}</p>
                  </>
                )}
              </div>
            )}
          </DialogDescription>
          
          <div className="flex justify-end mt-4">
            <button 
              onClick={handleDialogClose}
              className="px-4 py-2 bg-terminal-accent1 text-black rounded-md hover:bg-terminal-accent1/80"
            >
              Continue
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResumeGame;
