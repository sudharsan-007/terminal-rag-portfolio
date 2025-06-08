
import { useState, useEffect, useRef, useCallback } from 'react';
import * as Matter from 'matter-js';
import * as PIXI from 'pixi.js';
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
  containerRef: React.RefObject<HTMLDivElement>;
  pixiApp: PIXI.Application | null;
}

export const useGameLogic = ({ onItemCollect, containerRef, pixiApp }: UseGameLogicProps) => {
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

  // Physics refs
  const engineRef = useRef<Matter.Engine | null>(null);
  const playerBodyRef = useRef<Matter.Body | null>(null);
  const platformBodiesRef = useRef<Matter.Body[]>([]);
  const objectBodiesRef = useRef<Matter.Body[]>([]);
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

  // Initialize Matter.js engine
  const initializePhysics = useCallback(() => {
    if (!containerRef.current) return;
    
    // Clean up previous engine
    if (engineRef.current) {
      Matter.Engine.clear(engineRef.current);
    }
    
    // Create engine
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 1 }
    });
    engineRef.current = engine;
    
    // Create player body
    const playerBody = Matter.Bodies.circle(
      player.x + player.width / 2,
      gameHeight - player.y - player.height / 2,
      player.width / 2,
      {
        restitution: 0,
        friction: 0.1,
        label: 'player',
        collisionFilter: {
          category: 0x0001,
          mask: 0x0002 | 0x0004
        }
      }
    );
    playerBodyRef.current = playerBody;
    
    // Add player to world
    Matter.Composite.add(engine.world, [playerBody]);
    
    return engine;
  }, [player, gameHeight]);
  
  // Create platform bodies
  const createPlatformBodies = useCallback((newPlatforms: Platform[]) => {
    if (!engineRef.current) return;
    
    // Remove old platform bodies
    if (platformBodiesRef.current.length > 0) {
      Matter.Composite.remove(engineRef.current.world, platformBodiesRef.current);
      platformBodiesRef.current = [];
    }
    
    // Create new platform bodies
    const platformBodies = newPlatforms.map((platform) => {
      const body = Matter.Bodies.rectangle(
        platform.x + platform.width / 2,
        gameHeight - platform.y - platform.height / 2,
        platform.width,
        platform.height,
        {
          isStatic: true,
          label: `platform-${platform.type}`,
          collisionFilter: {
            category: 0x0002,
            mask: 0x0001
          }
        }
      );
      return body;
    });
    
    platformBodiesRef.current = platformBodies;
    Matter.Composite.add(engineRef.current.world, platformBodies);
    
    return platformBodies;
  }, [gameHeight]);
  
  // Create game object bodies
  const createObjectBodies = useCallback((newObjects: GameObject[]) => {
    if (!engineRef.current) return;
    
    // Remove old object bodies
    if (objectBodiesRef.current.length > 0) {
      Matter.Composite.remove(engineRef.current.world, objectBodiesRef.current);
      objectBodiesRef.current = [];
    }
    
    // Create new object bodies
    const objectBodies = newObjects
      .filter(obj => !obj.collected)
      .map((obj) => {
        const body = Matter.Bodies.rectangle(
          obj.x + obj.width / 2,
          gameHeight - obj.y - obj.height / 2,
          obj.width,
          obj.height,
          {
            isSensor: true,
            isStatic: true,
            label: `object-${obj.id}`,
            collisionFilter: {
              category: 0x0004,
              mask: 0x0001
            }
          }
        );
        return body;
      });
    
    objectBodiesRef.current = objectBodies;
    Matter.Composite.add(engineRef.current.world, objectBodies);
    
    return objectBodies;
  }, [gameHeight]);

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
    
    // Initialize physics engine
    const engine = initializePhysics();
    if (engine) {
      createPlatformBodies(levelPlatforms);
      createObjectBodies(levelObjects);
    }
    
    // Start game loop
    lastTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [gameWidth, initializePhysics, createPlatformBodies, createObjectBodies]);

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
    
    // Update physics bodies
    const updatedObjects = gameObjects.map(item => 
      item.id === obj.id ? { ...item, collected: true } : item
    );
    createObjectBodies(updatedObjects);
    
    // Show toast notification
    toast({
      title: "Item Collected!",
      description: `You've collected a ${obj.type} item.`,
      duration: 3000
    });
  }, [onItemCollect, toast, gameObjects, createObjectBodies]);

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
      
      const playerBody = playerBodyRef.current;
      if (!playerBody) return;
      
      if ((e.key === 'ArrowUp' || e.key === 'w' || e.code === 'Space') && !player.isJumping) {
        // Apply jump force
        Matter.Body.applyForce(playerBody, playerBody.position, { x: 0, y: -0.1 });
        setPlayer(prev => ({ ...prev, isJumping: true }));
      }
      
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        // Move left
        Matter.Body.setVelocity(playerBody, { x: -moveSpeed, y: playerBody.velocity.y });
      }
      
      if (e.key === 'ArrowRight' || e.key === 'd') {
        // Move right
        Matter.Body.setVelocity(playerBody, { x: moveSpeed, y: playerBody.velocity.y });
      }
      
      if (e.key === 'ArrowDown' || e.key === 's') {
        // Duck
        setPlayer(prev => ({ ...prev, isDucking: true }));
        if (playerBody) {
          const duckScale = 0.6;
          Matter.Body.scale(playerBody, 1, duckScale);
        }
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (gameState !== 'playing' || isPaused.current) return;
      
      const playerBody = playerBodyRef.current;
      if (!playerBody) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'ArrowRight' || e.key === 'd') {
        // Apply friction to slow down
        Matter.Body.setVelocity(playerBody, { 
          x: playerBody.velocity.x * friction, 
          y: playerBody.velocity.y 
        });
      }
      
      if (e.key === 'ArrowDown' || e.key === 's') {
        // Stand up from ducking
        setPlayer(prev => ({ ...prev, isDucking: false }));
        if (playerBody) {
          const unduckScale = 1 / 0.6;
          Matter.Body.scale(playerBody, 1, unduckScale);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, player, dialogOpen, handleDialogClose, moveSpeed, friction]);

  // Game loop
  const gameLoop = useCallback((timestamp: number) => {
    if (isPaused.current || !engineRef.current || !playerBodyRef.current) return;
    
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
    }
    
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    
    // Update physics engine
    Matter.Engine.update(engineRef.current, deltaTime);
    
    // Update player state from physics
    const playerBody = playerBodyRef.current;
    
    setPlayer(prev => {
      const isJumping = playerBody.velocity.y < -0.1 || playerBody.velocity.y > 0.1;
      
      return {
        ...prev,
        x: playerBody.position.x - prev.width / 2,
        y: gameHeight - playerBody.position.y - prev.height / 2,
        vx: playerBody.velocity.x,
        vy: -playerBody.velocity.y,
        isJumping: isJumping
      };
    });
    
    // Check for collisions with objects
    for (const objBody of objectBodiesRef.current) {
      const pairs = Matter.Query.collides(playerBody, [objBody]);
      
      if (pairs.length > 0) {
        const objId = objBody.label.replace('object-', '');
        const obj = gameObjects.find(o => o.id === objId);
        
        if (obj && !obj.collected) {
          // Collect item in the next frame to avoid state updates during render
          setTimeout(() => handleItemCollection(obj), 0);
        }
      }
    }
    
    // Check if player has reached the exit
    const exitPlatform = platformBodiesRef.current.find(p => p.label === 'platform-exit');
    if (exitPlatform) {
      const isOnExit = Matter.Collision.collides(playerBody, exitPlatform, null);
      
      if (isOnExit && gameObjects.every(obj => obj.collected)) {
        setTimeout(() => {
          setGameState('gameOver');
          setGameProgress(100);
        }, 0);
      }
    }
    
    // Check if player fell off the screen
    if (playerBody.position.y > gameHeight + 100) {
      // Reset position
      Matter.Body.setPosition(playerBody, { x: 50 + player.width / 2, y: gameHeight - 10 - player.height / 2 });
      Matter.Body.setVelocity(playerBody, { x: 0, y: 0 });
    }
    
    // Update game progress based on collected items
    setGameProgress(prev => {
      const totalItems = gameObjects.length;
      const collectedItems = gameObjects.filter(obj => obj.collected).length;
      return totalItems > 0 ? (collectedItems / totalItems) * 100 : 0;
    });
    
    // Continue animation loop if game is still active
    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameObjects, handleItemCollection, gameState, gameHeight]);

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

  // Create/update physics bodies when platforms or objects change
  useEffect(() => {
    if (gameState === 'playing' && engineRef.current) {
      createPlatformBodies(platforms);
    }
  }, [platforms, gameState, createPlatformBodies]);

  useEffect(() => {
    if (gameState === 'playing' && engineRef.current) {
      createObjectBodies(gameObjects);
    }
  }, [gameObjects, gameState, createObjectBodies]);

  // Clean up physics engine on unmount
  useEffect(() => {
    return () => {
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
        engineRef.current = null;
      }
      
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

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
    initializeGame,
    physicsEngine: engineRef.current
  };
};
