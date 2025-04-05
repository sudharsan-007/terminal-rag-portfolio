
import React, { useEffect, useRef, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { ArrowUp, ArrowDown, Briefcase, GraduationCap, Award, DownloadIcon } from 'lucide-react';
import resumeData from '@/data/resumeData';
import { Button } from '@/components/ui/button';

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
  const [highScore, setHighScore] = useState(0);
  const [gameMode, setGameMode] = useState<'experience' | 'education' | 'awards'>('experience');
  
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
    
    // Check for stored high score
    const storedHighScore = localStorage.getItem('resumeGameHighScore');
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore, 10));
    }
  }, []);
  
  // Setup keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGameActive) {
        if (e.code === 'Space') {
          startGame();
          return;
        }
      }
      
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        jump();
      } else if (e.code === 'ArrowDown' || e.key === 'ArrowDown') {
        setIsDucking(true);
      } else if (e.key === '1') {
        setGameMode('experience');
      } else if (e.key === '2') {
        setGameMode('education');
      } else if (e.key === '3') {
        setGameMode('awards');
      } else if (e.key === 'r' || e.key === 'R') {
        startGame();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown' || e.key === 'ArrowDown') {
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
  }, [isGameActive, gameOver, gameMode]);
  
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
      
      // Only check collisions for the current game mode
      if (!obj.collected && 
          obj.type === gameMode &&
          newX < 100 && 
          newX > 0 && 
          ((isJumping && playerY.current < -20) || !isJumping)) {
        // Collect the item
        onItemCollect(obj.type, obj.id);
        setScore(prev => prev + 100);
        return { ...obj, collected: true, x: newX };
      }
      
      return { ...obj, x: newX };
    });
    
    setGameObjects(updatedObjects);
    
    // Update progress based on current game mode
    const objectsOfCurrentType = initialObjects.current.filter(obj => obj.type === gameMode);
    const collectedOfCurrentType = updatedObjects.filter(obj => obj.type === gameMode && obj.collected).length;
    const progress = (collectedOfCurrentType / objectsOfCurrentType.length) * 100;
    setGameProgress(progress);
    
    // Check if game is complete
    if (progress >= 100) {
      setGameOver(true);
      setIsGameActive(false);
      
      // Update high score if needed
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('resumeGameHighScore', score.toString());
      }
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
  
  // Render game objects based on their type and game mode
  const renderGameObject = (obj: GameObject) => {
    const iconSize = 28;
    
    if (obj.collected || obj.type !== gameMode) return null;
    
    let icon;
    let colorClass = '';
    
    switch (obj.type) {
      case 'experience':
        icon = <Briefcase size={iconSize} />;
        colorClass = 'text-blue-400';
        break;
      case 'education':
        icon = <GraduationCap size={iconSize} />;
        colorClass = 'text-green-400';
        break;
      case 'awards':
        icon = <Award size={iconSize} />;
        colorClass = 'text-yellow-400';
        break;
    }
    
    return (
      <div 
        key={obj.id}
        className={`absolute ${colorClass} animate-pulse`}
        style={{
          transform: `translateX(${obj.x}px)`,
          bottom: '15px'
        }}
      >
        <div className="text-yellow-300 text-2xl">★</div>
      </div>
    );
  };
  
  const getModeName = (mode: 'experience' | 'education' | 'awards') => {
    switch (mode) {
      case 'experience': return 'Experience Run';
      case 'education': return 'Education Jump';
      case 'awards': return 'Fun Facts Dash';
    }
  };
  
  const getModeButtonClass = (mode: 'experience' | 'education' | 'awards') => {
    const baseClass = "px-4 py-2 rounded-md text-terminal-text";
    if (mode === gameMode) {
      switch (mode) {
        case 'experience': return `${baseClass} bg-purple-700`;
        case 'education': return `${baseClass} bg-terminal-accent1/30`;
        case 'awards': return `${baseClass} bg-terminal-accent1/30`;
      }
    }
    return `${baseClass} bg-terminal-accent1/30`;
  };
  
  return (
    <div className="space-y-4">
      {/* Game mode selector */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button 
            className={getModeButtonClass('experience')}
            onClick={() => setGameMode('experience')}
          >
            {getModeName('experience')}
          </button>
          <button 
            className={getModeButtonClass('education')}
            onClick={() => setGameMode('education')}
          >
            {getModeName('education')}
          </button>
          <button 
            className={getModeButtonClass('awards')}
            onClick={() => setGameMode('awards')}
          >
            {getModeName('awards')}
          </button>
        </div>
        
        <Button variant="default" className="bg-terminal-accent1 hover:bg-terminal-accent1/80">
          <DownloadIcon className="w-4 h-4 mr-2" /> Download Full Resume
        </Button>
      </div>
      
      <div className="relative h-[300px] border border-terminal-text/30 rounded-md overflow-hidden bg-terminal-navy/80">
        {/* Progress bar */}
        <div className="absolute top-2 left-2 right-2 z-10">
          <Progress value={gameProgress} className="h-2" />
        </div>
        
        <div className="absolute bottom-2 left-4 text-terminal-accent1 z-10 font-mono">
          SCORE: {score}
        </div>
        
        <div className="absolute bottom-2 right-4 text-terminal-accent1 z-10 font-mono">
          HI: {highScore}
        </div>
        
        {!isGameActive && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-terminal-navy/90 z-20">
            <div className="text-xl text-terminal-accent1 mb-4">Experience Timeline</div>
            <div className="text-sm text-terminal-text text-center mb-4 max-w-md">
              <p className="mb-2">Scroll to play or press SPACE to start</p>
              <p>Collect stars to discover my professional journey!</p>
            </div>
            <div className="flex space-x-8 mb-6">
              <div className="flex flex-col items-center">
                <div className="p-2 bg-terminal-accent1/20 rounded-md mb-2">
                  <ArrowUp className="text-terminal-text w-6 h-6" />
                </div>
                <span className="text-terminal-text text-sm">Jump</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-2 bg-terminal-accent1/20 rounded-md mb-2">
                  <ArrowDown className="text-terminal-text w-6 h-6" />
                </div>
                <span className="text-terminal-text text-sm">Duck</span>
              </div>
            </div>
            <button
              onClick={startGame}
              className="px-6 py-2 bg-terminal-accent1 text-black rounded-md hover:bg-terminal-accent1/80 font-medium"
            >
              Start Game
            </button>
          </div>
        )}
        
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-terminal-navy/90 z-20">
            <div className="text-xl text-terminal-accent1 mb-2">Game Over!</div>
            <div className="text-terminal-text mb-6">
              You collected {gameObjects.filter(obj => obj.collected && obj.type === gameMode).length} stars
            </div>
            <button
              onClick={startGame}
              className="px-6 py-2 bg-terminal-accent1 text-black rounded-md hover:bg-terminal-accent1/80 font-medium"
            >
              Try Again
            </button>
          </div>
        )}
        
        <div
          ref={gameRef}
          className="relative h-full"
        >
          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-terminal-text/60"></div>
          
          {/* Player character */}
          <div
            ref={playerRef}
            className={`absolute bottom-10 left-20 transition-transform`}
            style={{ height: isDucking ? '40px' : '60px' }}
          >
            <div className={`w-12 h-full bg-terminal-accent1 transition-all ${isDucking ? 'rounded-t-sm' : 'rounded-lg'}`}>
              {/* Add eyes to character */}
              <div className="relative w-full h-full flex items-center justify-center">
                {!isDucking && (
                  <div className="absolute top-2 left-0 right-0 flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                  </div>
                )}
                <span className="text-black font-bold">S</span>
              </div>
            </div>
          </div>
          
          {/* Render game objects */}
          {gameObjects.map(renderGameObject)}
        </div>
      </div>
      
      {/* Keyboard controls */}
      <div className="bg-terminal-navy/40 p-4 rounded-md border border-terminal-text/30">
        <h3 className="text-terminal-text mb-3">Keyboard Controls:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center">
            <div className="bg-terminal-text/20 px-2 py-1 rounded mr-2 text-sm">Space</div>
            <span className="text-terminal-text text-sm">Jump</span>
          </div>
          <div className="flex items-center">
            <div className="bg-terminal-text/20 px-2 py-1 rounded mr-2 text-sm">↓</div>
            <span className="text-terminal-text text-sm">Duck</span>
          </div>
          <div className="flex items-center">
            <div className="bg-terminal-text/20 px-2 py-1 rounded mr-2 text-sm">1</div>
            <span className="text-terminal-text text-sm">Experience mode</span>
          </div>
          <div className="flex items-center">
            <div className="bg-terminal-text/20 px-2 py-1 rounded mr-2 text-sm">2</div>
            <span className="text-terminal-text text-sm">Education mode</span>
          </div>
          <div className="flex items-center">
            <div className="bg-terminal-text/20 px-2 py-1 rounded mr-2 text-sm">3</div>
            <span className="text-terminal-text text-sm">Fun Facts mode</span>
          </div>
          <div className="flex items-center">
            <div className="bg-terminal-text/20 px-2 py-1 rounded mr-2 text-sm">R</div>
            <span className="text-terminal-text text-sm">Restart game</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeGame;
