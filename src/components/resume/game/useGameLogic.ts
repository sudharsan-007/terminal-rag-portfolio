
import { useState, useRef, useEffect } from 'react';
import { GameObject, GameState } from './types';
import resumeData from '@/data/resumeData';
import { useToast } from "@/hooks/use-toast";

interface UseGameLogicProps {
  onItemCollect: (type: 'experience' | 'education' | 'awards', id: string) => void;
}

export const useGameLogic = ({ onItemCollect }: UseGameLogicProps) => {
  const [gameObjects, setGameObjects] = useState<GameObject[]>([]);
  const [isJumping, setIsJumping] = useState(false);
  const [isDucking, setIsDucking] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    isGameActive: false,
    isPaused: false,
    gameOver: false,
    score: 0,
    gameProgress: 0
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  
  const { toast } = useToast();
  
  // Game mechanics references
  const gameRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
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
      if (!gameState.isGameActive || isPaused.current) return;
      
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
  }, [gameState.isGameActive]);
  
  // Game animation loop
  useEffect(() => {
    if (!gameState.isGameActive || gameState.gameOver) return;
    
    const startGame = () => {
      lastTimestamp.current = performance.now();
      animationFrameId.current = requestAnimationFrame(gameLoop);
    };
    
    startGame();
    
    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [gameState.isGameActive, gameState.gameOver]);
  
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
    if (gameState.isGameActive && !gameState.gameOver && !isPaused.current) {
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
        setGameState(prev => ({...prev, score: prev.score + 1}));
        
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
    setGameState(prev => ({...prev, gameProgress: progress}));
    
    // Check if game is complete
    if (progress >= 100) {
      setGameState(prev => ({...prev, gameOver: true, isGameActive: false}));
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
    setGameState({
      isGameActive: true,
      isPaused: false,
      gameOver: false,
      score: 0,
      gameProgress: 0
    });
    isPaused.current = false;
    
    // Reset game objects
    setGameObjects(initialObjects.current.map(obj => ({ ...obj, collected: false })));
  };
  
  const handleDialogClose = () => {
    setDialogOpen(false);
    isPaused.current = false;
    
    // Resume game after dialog is closed
    if (gameState.isGameActive && !gameState.gameOver) {
      lastTimestamp.current = performance.now();
      animationFrameId.current = requestAnimationFrame(gameLoop);
    }
  };
  
  return {
    gameObjects,
    gameState,
    playerX: playerX.current,
    playerY: playerY.current,
    isDucking,
    isJumping,
    dialogOpen,
    currentItem,
    playerRef,
    gameRef,
    startGame,
    handleDialogClose
  };
};
