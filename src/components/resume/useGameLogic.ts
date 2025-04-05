
import { useState, useEffect, useRef, useCallback } from 'react';
import resumeData from '@/data/resumeData';
import { useToast } from '@/hooks/use-toast';

interface GameObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'experience' | 'education' | 'awards';
  collected: boolean;
}

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'normal' | 'obstacle' | 'exit';
}

interface PlayerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isJumping: boolean;
  isDucking: boolean;
}

export type GameState = 'start' | 'playing' | 'paused' | 'gameOver';

interface UseGameLogicProps {
  onItemCollect: (type: 'experience' | 'education' | 'awards', id: string) => void;
}

export const useGameLogic = ({ onItemCollect }: UseGameLogicProps) => {
  // Game state
  const [gameState, setGameState] = useState<GameState>('start');
  const [gameProgress, setGameProgress] = useState(0);
  const [score, setScore] = useState(0);
  
  // Player state
  const [player, setPlayer] = useState<PlayerState>({
    x: 50,
    y: 10,
    vx: 0,
    vy: 0,
    width: 30,
    height: 30,
    isJumping: false,
    isDucking: false
  });

  // Game objects
  const [gameObjects, setGameObjects] = useState<GameObject[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);

  // Game loop refs
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const isPaused = useRef(false);
  
  const { toast } = useToast();

  // Game constants
  const gravity = 0.6;
  const jumpForce = -15;
  const moveSpeed = 5;
  const friction = 0.8;
  const gameWidth = 800;
  const gameHeight = 300;

  // Initialize game objects and platforms
  const initializeGame = useCallback(() => {
    // Reset player position
    setPlayer({
      x: 50,
      y: 10,
      vx: 0,
      vy: 0,
      width: 30,
      height: 30,
      isJumping: false,
      isDucking: false
    });

    // Define platforms for level 1
    const levelPlatforms: Platform[] = [
      // Ground
      { x: 0, y: 0, width: gameWidth, height: 10, type: 'normal' },
      // Steps to jump over
      { x: 150, y: 10, width: 100, height: 40, type: 'normal' },
      { x: 300, y: 10, width: 100, height: 80, type: 'normal' },
      // Lower obstacle to crouch under
      { x: 450, y: 70, width: 100, height: 20, type: 'obstacle' },
      // Exit platform
      { x: gameWidth - 100, y: 10, width: 100, height: 50, type: 'exit' }
    ];
    
    setPlatforms(levelPlatforms);

    // Create game objects for level 1 (just one briefcase)
    const levelObjects: GameObject[] = [
      {
        id: 'experience-0',
        x: 500,
        y: 30,
        width: 32,
        height: 32,
        type: 'experience',
        collected: false
      }
    ];
    
    setGameObjects(levelObjects);
    setScore(0);
    setGameProgress(0);
    setGameState('playing');
    isPaused.current = false;
  }, [gameWidth, gameHeight]);

  // Handle item collection
  const handleItemCollection = useCallback((obj: GameObject) => {
    // Pause the game
    isPaused.current = true;
    cancelAnimationFrame(requestRef.current);
    
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
    setGameState('paused');
    
    // Collect the item
    onItemCollect(obj.type, obj.id);
    setScore(prev => prev + 1);
    
    // Update game objects
    setGameObjects(prev => 
      prev.map(item => 
        item.id === obj.id ? { ...item, collected: true } : item
      )
    );
    
    // Show toast notification
    toast({
      title: "Item Collected!",
      description: `You've collected a ${obj.type} item.`,
      duration: 3000
    });
  }, [onItemCollect, toast]);

  // Handle dialog close
  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    isPaused.current = false;
    setGameState('playing');
    
    // Check if level is complete
    const allCollected = gameObjects.every(obj => obj.collected);
    if (allCollected) {
      setGameState('gameOver');
      setGameProgress(100);
    } else {
      // Resume game after dialog is closed
      lastTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameObjects]);

  // Handle key controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing' || isPaused.current) {
        // Handle dialog close with Enter key
        if (e.key === 'Enter' && dialogOpen) {
          handleDialogClose();
        }
        return;
      }
      
      if ((e.key === 'ArrowUp' || e.key === 'w' || e.code === 'Space') && !player.isJumping) {
        setPlayer(prev => ({ 
          ...prev, 
          vy: jumpForce, 
          isJumping: true 
        }));
      }
      
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setPlayer(prev => ({ ...prev, vx: -moveSpeed }));
      }
      
      if (e.key === 'ArrowRight' || e.key === 'd') {
        setPlayer(prev => ({ ...prev, vx: moveSpeed }));
      }
      
      if (e.key === 'ArrowDown' || e.key === 's') {
        setPlayer(prev => ({ ...prev, isDucking: true }));
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (gameState !== 'playing' || isPaused.current) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'ArrowRight' || e.key === 'd') {
        setPlayer(prev => ({ ...prev, vx: 0 }));
      }
      
      if (e.key === 'ArrowDown' || e.key === 's') {
        setPlayer(prev => ({ ...prev, isDucking: false }));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, player, dialogOpen, handleDialogClose]);

  // Game loop
  const gameLoop = useCallback((timestamp: number) => {
    if (isPaused.current) return;
    
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
    }
    
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    
    // Update player position
    setPlayer(prev => {
      // Apply friction
      let newVx = prev.vx * friction;
      if (Math.abs(newVx) < 0.1) newVx = 0;
      
      // Apply gravity
      let newVy = prev.vy + gravity;
      
      // Calculate new position
      let newX = prev.x + newVx;
      let newY = prev.y - newVy;
      
      // Get player dimensions (smaller when ducking)
      const width = prev.isDucking ? 20 : 30;
      const height = prev.isDucking ? 20 : 30;
      
      // Check platform collisions
      let onGround = false;
      let reachedExit = false;
      
      for (const platform of platforms) {
        // Check if player is on top of a platform
        if (
          newX + width > platform.x &&
          newX < platform.x + platform.width &&
          newY <= platform.y + platform.height &&
          prev.y > platform.y + platform.height - 5
        ) {
          newY = platform.y + platform.height;
          newVy = 0;
          onGround = true;
          
          if (platform.type === 'exit' && gameObjects.every(obj => obj.collected)) {
            reachedExit = true;
          }
        }
        
        // Check side collision (left/right)
        if (
          newY < platform.y + platform.height &&
          newY + height > platform.y &&
          ((newVx > 0 && newX + width > platform.x && prev.x + width <= platform.x) ||
          (newVx < 0 && newX < platform.x + platform.width && prev.x >= platform.x + platform.width))
        ) {
          newX = newVx > 0 ? platform.x - width : platform.x + platform.width;
          newVx = 0;
        }
        
        // Check head collision (jumping into platform)
        if (
          newX + width > platform.x &&
          newX < platform.x + platform.width &&
          newY + height > platform.y &&
          prev.y + height <= platform.y
        ) {
          newY = platform.y - height;
          newVy = 0;
        }
      }
      
      // Check game object collisions
      for (const obj of gameObjects) {
        if (
          !obj.collected &&
          newX + width > obj.x &&
          newX < obj.x + obj.width &&
          newY + height > obj.y &&
          newY < obj.y + obj.height
        ) {
          // Collect item in the next frame to avoid state updates during render
          setTimeout(() => handleItemCollection(obj), 0);
        }
      }
      
      // Boundary checks
      if (newX < 0) newX = 0;
      if (newX + width > gameWidth) newX = gameWidth - width;
      
      // Check if player fell off the screen
      if (newY < -50) {
        // Reset position
        newX = 50;
        newY = 10;
        newVx = 0;
        newVy = 0;
      }
      
      // Check if level is complete
      if (reachedExit) {
        setTimeout(() => {
          setGameState('gameOver');
          setGameProgress(100);
        }, 0);
      }
      
      // Update jumping state
      const isJumping = !onGround;
      
      return {
        x: newX,
        y: newY,
        vx: newVx,
        vy: newVy,
        width: width,
        height: height,
        isJumping,
        isDucking: prev.isDucking
      };
    });
    
    // Update game progress based on collected items
    setGameProgress(prev => {
      const totalItems = gameObjects.length;
      const collectedItems = gameObjects.filter(obj => obj.collected).length;
      return (collectedItems / totalItems) * 100;
    });
    
    // Continue animation loop if game is still active
    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  }, [platforms, gameObjects, handleItemCollection, gameState, gameWidth]);

  // Start/stop game loop based on game state
  useEffect(() => {
    if (gameState === 'playing' && !isPaused.current) {
      lastTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(gameLoop);
    } else {
      cancelAnimationFrame(requestRef.current);
    }
    
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, gameLoop]);

  return {
    gameState,
    setGameState,
    gameProgress,
    score,
    player,
    gameObjects,
    platforms,
    dialogOpen,
    currentItem,
    handleDialogClose,
    initializeGame
  };
};
