import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIsVisible } from '@/hooks/useIsVisible';
import { useEffectOnce } from '@/hooks/useEffectOnce';
import { useSuspendAnimations } from '@/hooks/useSuspendAnimations';
import { useAnimationFrameThrottle } from '@/hooks/useAnimationFrameThrottle';

type Position = {
  x: number;
  y: number;
};

type Direction = {
  x: number;
  y: number;
};

type Logo = {
  image: HTMLImageElement | null;
  position: Position;
  size: number;
  gridCells: Position[];
  aspectRatio: number;
};

type Grid = {
  width: number;
  height: number;
  cellSize: number;
  blockedCells: boolean[][];
};

type Snake = {
  body: Position[];
  direction: Direction;
  nextDirection: Direction;
  moveCounter: number;
  moveDelay: number;
};

const CommitHistory = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();
  const { ref: containerRef, isVisible } = useIsVisible(0.1);
  const shouldSuspendAnimations = useSuspendAnimations();
  
  const canvasHeight = isMobile ? 160 : 180;
  
  const [isAnimating, setIsAnimating] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [frameRate, setFrameRate] = useState(1);
  const animationRef = useRef<number | null>(null);
  const frameCounter = useRef(0);
  
  const canvasWidthRef = useRef<number>(0);
  const imageLoadPromises = useRef<Promise<any>[]>([]);
  const isMountedRef = useRef<boolean>(true);
  
  const cellSize = isMobile ? 22 : 25;
  
  const gridRef = useRef<Grid>({
    width: 0,
    height: 0,
    cellSize,
    blockedCells: []
  });
  
  const snakeRef = useRef<Snake>({
    body: [],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    moveCounter: 0,
    moveDelay: 7
  });
  
  const foodRef = useRef<Position | null>(null);
  
  const logosRef = useRef<{
    linkedin: Logo;
    gmail: Logo;
    github: Logo;
  }>({
    linkedin: { 
      image: null, 
      position: { x: 0, y: 0 },
      size: 0,
      gridCells: [],
      aspectRatio: 1
    },
    gmail: { 
      image: null, 
      position: { x: 0, y: 0 },
      size: 0,
      gridCells: [],
      aspectRatio: 1
    },
    github: { 
      image: null, 
      position: { x: 0, y: 0 },
      size: 0,
      gridCells: [],
      aspectRatio: 1
    }
  });
  
  const pathfindingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Track logo positions for clickable areas
  const [logoPositions, setLogoPositions] = useState({
    linkedin: { x: 0, y: 0, width: 0, height: 0 },
    gmail: { x: 0, y: 0, width: 0, height: 0 },
    github: { x: 0, y: 0, width: 0, height: 0 }
  });
  
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  };
  
  // Animation callback
  const animateCanvas = useCallback((timestamp: number) => {
    if (!isMountedRef.current || !isActive || !isVisible || shouldSuspendAnimations) {
      return;
    }
    
    const canvas = canvasRef.current;
    if (!canvas || !isAnimating) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    const grid = gridRef.current;
    
    // Reduce transparency operations which are expensive
    ctx.strokeStyle = 'rgba(74, 255, 145, 0.2)';
    ctx.lineWidth = 0.5;
    
    const cellSize = grid.cellSize;
    const evenFill = 'rgba(74, 255, 145, 0.05)';
    const oddFill = 'rgba(74, 255, 145, 0.02)';
    
    // Batch drawing operations for performance
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        if (grid.blockedCells[y][x]) continue;
        
        const xPos = x * cellSize;
        const yPos = y * cellSize;
        
        ctx.fillStyle = (x + y) % 2 === 0 ? evenFill : oddFill;
        ctx.fillRect(xPos, yPos, cellSize, cellSize);
        ctx.strokeRect(xPos, yPos, cellSize, cellSize);
      }
    }
    
    // Update snake
    updateSnake();
    
    // Draw snake
    const snake = snakeRef.current;
    
    snake.body.forEach((segment, index) => {
      if (index === 0) {
        ctx.fillStyle = '#9031aa';
      } else {
        ctx.fillStyle = '#4AFF91';
      }
      
      ctx.fillRect(
        segment.x * grid.cellSize, 
        segment.y * grid.cellSize, 
        grid.cellSize, 
        grid.cellSize
      );
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(
        segment.x * grid.cellSize, 
        segment.y * grid.cellSize, 
        grid.cellSize, 
        grid.cellSize
      );
    });
    
    // Draw food
    const food = foodRef.current;
    
    if (food) {
      ctx.fillStyle = '#E53935';
      
      ctx.shadowColor = '#E53935';
      ctx.shadowBlur = 10;
      
      ctx.fillRect(
        food.x * grid.cellSize,
        food.y * grid.cellSize,
        grid.cellSize,
        grid.cellSize
      );
      
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.strokeRect(
        food.x * grid.cellSize,
        food.y * grid.cellSize,
        grid.cellSize,
        grid.cellSize
      );
      
      ctx.shadowBlur = 0;
    }
    
    // Draw logos
    const logos = logosRef.current;
    
    Object.entries(logos).forEach(([key, logo]) => {
      if (logo.image) {
        const { position, size, aspectRatio } = logo;
        
        const width = aspectRatio > 1 ? size : size * aspectRatio;
        const height = aspectRatio < 1 ? size : size / aspectRatio;
        
        ctx.drawImage(
          logo.image,
          position.x,
          position.y,
          width,
          height
        );
      }
    });
  }, [isAnimating, isActive, isVisible, shouldSuspendAnimations]);
  
  // Use throttled animation frame
  const { cancelAnimation, restartAnimation } = useAnimationFrameThrottle(
    animateCanvas,
    frameRate,
    [isAnimating, isActive, isVisible, shouldSuspendAnimations, frameRate]
  );
  
  // Use useEffectOnce for one-time initialization
  useEffectOnce(() => {
    // Set mounted ref to true
    isMountedRef.current = true;
    
    // Determine frame rate based on device performance
    const determineFrameRate = () => {
      const performanceLevel = window.navigator.hardwareConcurrency || 4;
      // Reduce frame rate for lower-end devices
      if (performanceLevel <= 2) {
        setFrameRate(3); // Render every 3 frames
      } else if (performanceLevel <= 4) {
        setFrameRate(2); // Render every 2 frames
      } else {
        setFrameRate(1); // Render every frame
      }
    };
    
    determineFrameRate();
    
    return () => {
      isMountedRef.current = false;
    };
  });
  
  // Load images and set up
  useEffect(() => {
    // Load all images in parallel
    const loadImages = async () => {
      try {
        if (!isMountedRef.current) return;
        
        const [linkedinImg, gmailImg, githubImg] = await Promise.all([
          loadImage('/assets/social/linkedin-logo.png'),
          loadImage('/assets/social/gmail-logo.webp'),
          loadImage('/assets/social/github-logo.png')
        ]);
        
        if (!isMountedRef.current) return;
        
        logosRef.current.linkedin.image = linkedinImg;
        logosRef.current.linkedin.aspectRatio = linkedinImg.width / linkedinImg.height;
        
        logosRef.current.gmail.image = gmailImg;
        logosRef.current.gmail.aspectRatio = gmailImg.width / gmailImg.height;
        
        logosRef.current.github.image = githubImg;
        logosRef.current.github.aspectRatio = githubImg.width / githubImg.height;
        
        if (canvasRef.current && isMountedRef.current) {
          setupCanvas();
        }
      } catch (error) {
        console.error("Failed to load images:", error);
      }
    };
    
    loadImages();
    
    // Detect visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsActive(false);
        cancelAnimation();
      } else {
        setIsActive(true);
        restartAnimation();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup function
    return () => {
      if (pathfindingTimeoutRef.current) {
        clearTimeout(pathfindingTimeoutRef.current);
        pathfindingTimeoutRef.current = null;
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimation();
    };
  }, [cancelAnimation, restartAnimation]);

  // Update canvas on resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && isMountedRef.current) {
        setupCanvas();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [canvasHeight, isMobile, cellSize]);

  // Start/stop animation based on visibility
  useEffect(() => {
    if (isVisible && isMountedRef.current && !shouldSuspendAnimations) {
      setupCanvas();
      restartAnimation();
    } else {
      cancelAnimation();
    }
  }, [isVisible, shouldSuspendAnimations, canvasHeight, isMobile, cellSize, cancelAnimation, restartAnimation]);
  
  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = canvasHeight * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${canvasHeight}px`;
    
    canvasWidthRef.current = rect.width;
    
    const gridWidth = Math.floor(rect.width / cellSize);
    const gridHeight = Math.floor(canvasHeight / cellSize);
    
    const blockedCells = Array(gridHeight).fill(0).map(() => Array(gridWidth).fill(false));
    
    gridRef.current = {
      width: gridWidth,
      height: gridHeight,
      cellSize,
      blockedCells
    };
    
    positionLogos(rect.width, canvasHeight);
    
    markLogoAreasAsBlocked();
    
    initializeSnake(gridWidth, gridHeight);
    
    spawnFood();
  };
  
  const positionLogos = (canvasWidth: number, canvasHeight: number) => {
    const maxLogoSize = Math.min(isMobile ? 60 : 70, canvasWidth / 5);
    
    const padding = canvasWidth * 0.1;
    const availableWidth = canvasWidth - (2 * padding);
    const spaceBetween = availableWidth / 4;
    
    const centerY = canvasHeight / 2 - maxLogoSize / 2;
    
    // Updated LinkedIn position
    const linkedinPosition = { 
      x: padding + spaceBetween - maxLogoSize / 2, 
      y: centerY
    };
    
    // Updated Gmail position
    const gmailPosition = { 
      x: padding + (spaceBetween * 2) - maxLogoSize / 2, 
      y: centerY
    };
    
    // Updated GitHub position
    const githubPosition = { 
      x: padding + (spaceBetween * 3) - maxLogoSize / 2, 
      y: centerY
    };
    
    // Update refs for canvas rendering
    logosRef.current.linkedin = {
      ...logosRef.current.linkedin,
      position: linkedinPosition,
      size: maxLogoSize,
      gridCells: [],
      aspectRatio: logosRef.current.linkedin.aspectRatio || 1
    };
    
    logosRef.current.gmail = {
      ...logosRef.current.gmail,
      position: gmailPosition,
      size: maxLogoSize,
      gridCells: [],
      aspectRatio: logosRef.current.gmail.aspectRatio || 1
    };
    
    logosRef.current.github = {
      ...logosRef.current.github,
      position: githubPosition,
      size: maxLogoSize,
      gridCells: [],
      aspectRatio: logosRef.current.github.aspectRatio || 1
    };
    
    // Update state for clickable areas
    setLogoPositions({
      linkedin: {
        x: linkedinPosition.x,
        y: linkedinPosition.y,
        width: logosRef.current.linkedin.aspectRatio > 1 ? maxLogoSize : maxLogoSize * logosRef.current.linkedin.aspectRatio,
        height: logosRef.current.linkedin.aspectRatio < 1 ? maxLogoSize : maxLogoSize / logosRef.current.linkedin.aspectRatio
      },
      gmail: {
        x: gmailPosition.x,
        y: gmailPosition.y,
        width: logosRef.current.gmail.aspectRatio > 1 ? maxLogoSize : maxLogoSize * logosRef.current.gmail.aspectRatio,
        height: logosRef.current.gmail.aspectRatio < 1 ? maxLogoSize : maxLogoSize / logosRef.current.gmail.aspectRatio
      },
      github: {
        x: githubPosition.x,
        y: githubPosition.y,
        width: logosRef.current.github.aspectRatio > 1 ? maxLogoSize : maxLogoSize * logosRef.current.github.aspectRatio,
        height: logosRef.current.github.aspectRatio < 1 ? maxLogoSize : maxLogoSize / logosRef.current.github.aspectRatio
      }
    });
  };

  const markLogoAreasAsBlocked = () => {
    const grid = gridRef.current;
    const logos = logosRef.current;
    
    Object.values(logos).forEach(logo => {
      logo.gridCells = [];
    });
    
    const markCells = (logo: Logo) => {
      const { position, size, aspectRatio } = logo;
      
      const logoWidth = aspectRatio > 1 ? size : size * aspectRatio;
      const logoHeight = aspectRatio < 1 ? size : size / aspectRatio;
      
      const padding = cellSize;
      
      const startGridX = Math.floor((position.x - padding) / cellSize);
      const startGridY = Math.floor((position.y - padding) / cellSize);
      const endGridX = Math.ceil((position.x + logoWidth + padding) / cellSize);
      const endGridY = Math.ceil((position.y + logoHeight + padding) / cellSize);
      
      for (let y = startGridY; y < endGridY; y++) {
        for (let x = startGridX; x < endGridX; x++) {
          if (y >= 0 && y < grid.height && x >= 0 && x < grid.width) {
            grid.blockedCells[y][x] = true;
            logo.gridCells.push({ x, y });
          }
        }
      }
    };
    
    markCells(logos.linkedin);
    markCells(logos.gmail);
    markCells(logos.github);
  };

  const initializeSnake = (gridWidth: number, gridHeight: number) => {
    const startX = Math.floor(gridWidth / 2);
    const startY = Math.floor(gridHeight * 0.8);
    
    snakeRef.current = {
      body: [
        { x: startX, y: startY },
        { x: startX - 1, y: startY },
        { x: startX - 2, y: startY }
      ],
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      moveCounter: 0,
      moveDelay: 7
    };
  };

  const getAvailableCells = (): Position[] => {
    const grid = gridRef.current;
    const snake = snakeRef.current;
    
    const snakePositions = new Set(
      snake.body.map(pos => `${pos.x},${pos.y}`)
    );
    
    const availableCells: Position[] = [];
    
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        if (!grid.blockedCells[y][x] && !snakePositions.has(`${x},${y}`)) {
          availableCells.push({ x, y });
        }
      }
    }
    
    return availableCells;
  };

  const spawnFood = () => {
    const availableCells = getAvailableCells();
    
    if (availableCells.length === 0) {
      foodRef.current = null;
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * availableCells.length);
    foodRef.current = availableCells[randomIndex];
  };

  const updateSnake = () => {
    const snake = snakeRef.current;
    
    snake.moveCounter++;
    if (snake.moveCounter < snake.moveDelay) {
      return;
    }
    snake.moveCounter = 0;
    
    snake.direction = { ...snake.nextDirection };
    
    const head = snake.body[0];
    const newHead: Position = {
      x: head.x + snake.direction.x,
      y: head.y + snake.direction.y
    };
    
    const grid = gridRef.current;
    
    if (
      newHead.x < 0 || 
      newHead.x >= grid.width || 
      newHead.y < 0 || 
      newHead.y >= grid.height ||
      grid.blockedCells[newHead.y]?.[newHead.x]
    ) {
      const newDirection = findAlternativeDirection(head);
      
      if (newDirection) {
        snake.direction = newDirection;
        snake.nextDirection = newDirection;
        
        newHead.x = head.x + snake.direction.x;
        newHead.y = head.y + snake.direction.y;
      } else {
        const availableCells = getAvailableCells();
        if (availableCells.length > 0) {
          const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
          snake.body[0] = randomCell;
        }
        return;
      }
    }
    
    const food = foodRef.current;
    let ate = false;
    
    if (food && newHead.x === food.x && newHead.y === food.y) {
      ate = true;
      spawnFood();
    }
    
    snake.body.unshift(newHead);
    
    if (!ate) {
      snake.body.pop();
    }
    
    planNextMove();
  };

  const findAlternativeDirection = (position: Position): Direction | null => {
    const grid = gridRef.current;
    const snake = snakeRef.current;
    
    const directions: Direction[] = [
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 }
    ];
    
    const validDirections = directions.filter(dir => {
      if (dir.x === -snake.direction.x && dir.y === -snake.direction.y) {
        return false;
      }
      
      const newX = position.x + dir.x;
      const newY = position.y + dir.y;
      
      return (
        newX >= 0 && 
        newX < grid.width && 
        newY >= 0 && 
        newY < grid.height && 
        !grid.blockedCells[newY][newX]
      );
    });
    
    if (validDirections.length === 0) return null;
    
    if (foodRef.current) {
      const foodDirection = getBestDirectionTowardFood(position, validDirections);
      if (foodDirection) return foodDirection;
    }
    
    return validDirections[Math.floor(Math.random() * validDirections.length)];
  };

  const planNextMove = () => {
    const snake = snakeRef.current;
    const food = foodRef.current;
    
    if (!food) return;
    
    const head = snake.body[0];
    
    const directions: Direction[] = [
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 }
    ];
    
    const validDirections = directions.filter(dir => {
      if (dir.x === -snake.direction.x && dir.y === -snake.direction.y) {
        return false;
      }
      
      const newX = head.x + dir.x;
      const newY = head.y + dir.y;
      
      return isValidCell(newX, newY);
    });
    
    if (validDirections.length === 0) return;
    
    const bestDirection = getBestDirectionTowardFood(head, validDirections);
    
    if (bestDirection) {
      snake.nextDirection = bestDirection;
    }
  };

  const getBestDirectionTowardFood = (
    position: Position, 
    validDirections: Direction[]
  ): Direction | null => {
    const food = foodRef.current;
    if (!food || validDirections.length === 0) return null;
    
    const directionScores = validDirections.map(dir => {
      const newPos = { x: position.x + dir.x, y: position.y + dir.y };
      const distance = Math.abs(newPos.x - food.x) + Math.abs(newPos.y - food.y);
      return { dir, distance };
    });
    
    directionScores.sort((a, b) => a.distance - b.distance);
    
    return directionScores[0].dir;
  };

  const isValidCell = (x: number, y: number): boolean => {
    const grid = gridRef.current;
    
    return (
      x >= 0 && 
      x < grid.width && 
      y >= 0 && 
      y < grid.height && 
      !grid.blockedCells[y][x]
    );
  };

  return (
    <div className="w-full h-full" ref={containerRef as React.RefObject<HTMLDivElement>}>
      <div className="border border-terminal-text/30 rounded-md p-4 bg-terminal-navy/20">
        <h3 className="text-[#9031aa] text-lg mb-4">Socials - Say hi to me 👋</h3>
        <div className="relative">
          <canvas 
            ref={canvasRef} 
            className="w-full rounded-sm border border-terminal-text/30"
            style={{ height: `${canvasHeight}px` }}
          ></canvas>
          
          {/* Clickable areas for logos with hover effects */}
          <div className="absolute inset-0 flex justify-around items-center pointer-events-none">
            <div className="flex flex-col items-center pointer-events-auto">
              <a 
                href="https://www.linkedin.com/in/sudharsan-ananth/" 
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
                style={{
                  left: `${logoPositions.linkedin.x - 8}px`,
                  top: `${logoPositions.linkedin.y - 8}px`,
                  width: `${logoPositions.linkedin.width + 16}px`,
                  height: `${logoPositions.linkedin.height + 16}px`,
                  position: 'absolute'
                }}
                aria-label="LinkedIn Profile"
                title="Connect with me on LinkedIn"
              >
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-xs bg-terminal-navy/80 text-terminal-text px-2 py-1 rounded whitespace-nowrap">LinkedIn</span>
                </div>
              </a>
            </div>

            <div className="flex flex-col items-center pointer-events-auto">
              <a 
                href="mailto:sudharsan.ananth@gmail.com" 
                className="group relative p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
                style={{
                  left: `${logoPositions.gmail.x - 8}px`,
                  top: `${logoPositions.gmail.y - 8}px`,
                  width: `${logoPositions.gmail.width + 16}px`,
                  height: `${logoPositions.gmail.height + 16}px`,
                  position: 'absolute'
                }}
                aria-label="Email Me"
                title="Send me an email"
              >
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-xs bg-terminal-navy/80 text-terminal-text px-2 py-1 rounded whitespace-nowrap">Email</span>
                </div>
              </a>
            </div>

            <div className="flex flex-col items-center pointer-events-auto">
              <a 
                href="https://github.com/sudharsan-007" 
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
                style={{
                  left: `${logoPositions.github.x - 8}px`,
                  top: `${logoPositions.github.y - 8}px`,
                  width: `${logoPositions.github.width + 16}px`,
                  height: `${logoPositions.github.height + 16}px`,
                  position: 'absolute'
                }}
                aria-label="GitHub Profile"
                title="Check out my GitHub projects"
              >
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-xs bg-terminal-navy/80 text-terminal-text px-2 py-1 rounded whitespace-nowrap">GitHub</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CommitHistory);
