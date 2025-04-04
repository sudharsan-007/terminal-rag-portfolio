
import React, { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const CommitHistory = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();
  const canvasHeight = isMobile ? 150 : 200; // Increased canvas height
  
  // Animation state
  const [isAnimating, setIsAnimating] = useState(true);
  const animationRef = useRef<number | null>(null);
  
  // Grid settings - increased cell size for better visibility
  const cellSize = 16; // Doubled from 8 to 16
  const gridRef = useRef<{
    width: number, 
    height: number, 
    cells: boolean[][],
    blockedCells: boolean[][]
  }>({
    width: 0,
    height: 0,
    cells: [],
    blockedCells: []
  });
  
  // Snake settings
  const snakeRef = useRef<{
    body: {x: number, y: number}[];
    direction: {x: number, y: number};
    nextDirection: {x: number, y: number};
    moveCounter: number;
    moveDelay: number;
  }>({
    body: [],
    direction: {x: 1, y: 0},
    nextDirection: {x: 1, y: 0},
    moveCounter: 0,
    moveDelay: 10
  });
  
  const foodRef = useRef<{x: number, y: number} | null>(null);
  
  // Logo images
  const logoImages = useRef<{
    github: HTMLImageElement | null,
    linkedin: HTMLImageElement | null,
    gmail: HTMLImageElement | null
  }>({
    github: null,
    linkedin: null,
    gmail: null
  });

  // Logo positions and dimensions
  const logoPositionsRef = useRef<{
    github: {x: number, y: number, width: number, height: number},
    linkedin: {x: number, y: number, width: number, height: number},
    gmail: {x: number, y: number, width: number, height: number}
  }>({
    github: {x: 0, y: 0, width: 0, height: 0},
    linkedin: {x: 0, y: 0, width: 0, height: 0},
    gmail: {x: 0, y: 0, width: 0, height: 0}
  });

  // Load images
  useEffect(() => {
    // Load GitHub image
    const githubImg = new Image();
    githubImg.src = '/lovable-uploads/ef227435-ba27-49bc-8103-120efe84e5b6.png';
    githubImg.onload = () => {
      logoImages.current.github = githubImg;
    };
    
    // Load LinkedIn image
    const linkedinImg = new Image();
    linkedinImg.src = '/lovable-uploads/1b304555-55ab-4a66-a403-264060b951f5.png';
    linkedinImg.onload = () => {
      logoImages.current.linkedin = linkedinImg;
    };
    
    // Load Gmail image
    const gmailImg = new Image();
    gmailImg.src = '/lovable-uploads/3b1b1717-de64-4a3c-88e6-e50aeb30361d.png';
    gmailImg.onload = () => {
      logoImages.current.gmail = gmailImg;
    };
  }, []);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions with device pixel ratio for sharpness
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = canvasHeight * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${canvasHeight}px`;
    
    // Initialize grid
    const gridWidth = Math.floor(rect.width / cellSize);
    const gridHeight = Math.floor(canvasHeight / cellSize);
    
    const cells = Array(gridHeight).fill(0).map(() => Array(gridWidth).fill(false));
    const blockedCells = Array(gridHeight).fill(0).map(() => Array(gridWidth).fill(false));
    
    gridRef.current = {
      width: gridWidth,
      height: gridHeight,
      cells: cells,
      blockedCells: blockedCells
    };
    
    // Calculate logo positions and dimensions
    const logoSize = Math.min(80, rect.width / 5);  // Fixed size for logos
    
    // Calculate positions to evenly space logos
    const totalWidth = rect.width;
    const logoSpacing = totalWidth / 4; // divide into 4 sections for 3 logos
    
    // LinkedIn position (left)
    const linkedinX = logoSpacing;
    const centerY = canvasHeight / 2;
    
    // Gmail position (center)
    const gmailX = logoSpacing * 2;
    
    // GitHub position (right)
    const githubX = logoSpacing * 3;
    
    // Store logo positions with proper sizing
    logoPositionsRef.current = {
      linkedin: {
        x: linkedinX - logoSize/2,
        y: centerY - logoSize/2,
        width: logoSize,
        height: logoSize
      },
      gmail: {
        x: gmailX - logoSize/2,
        y: centerY - logoSize/2,
        width: logoSize,
        height: logoSize
      },
      github: {
        x: githubX - logoSize/2,
        y: centerY - logoSize/2,
        width: logoSize,
        height: logoSize
      }
    };
    
    // Mark logo areas as blocked
    markLogoAreasAsBlocked();
    
    // Initialize snake position
    const startX = Math.floor(gridWidth / 2);
    const startY = Math.floor(gridHeight * 0.8);
    
    snakeRef.current = {
      body: [
        {x: startX, y: startY},
        {x: startX - 1, y: startY},
        {x: startX - 2, y: startY}
      ],
      direction: {x: 1, y: 0},
      nextDirection: {x: 1, y: 0},
      moveCounter: 0,
      moveDelay: 10
    };
    
    // Initialize food
    spawnFood();
    
    // Start animation
    startAnimation();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [canvasHeight, isMobile]);
  
  // Mark logo positions as blocked in the grid
  const markLogoAreasAsBlocked = () => {
    const grid = gridRef.current;
    const logoPositions = logoPositionsRef.current;
    
    const markArea = (x: number, y: number, width: number, height: number) => {
      const startGridX = Math.floor(x / cellSize);
      const startGridY = Math.floor(y / cellSize);
      const endGridX = Math.ceil((x + width) / cellSize);
      const endGridY = Math.ceil((y + height) / cellSize);
      
      for (let y = startGridY; y <= endGridY; y++) {
        for (let x = startGridX; x <= endGridX; x++) {
          if (
            y >= 0 && 
            y < grid.height && 
            x >= 0 && 
            x < grid.width
          ) {
            grid.blockedCells[y][x] = true;
          }
        }
      }
    };
    
    // Mark each logo area
    markArea(
      logoPositions.linkedin.x, 
      logoPositions.linkedin.y, 
      logoPositions.linkedin.width, 
      logoPositions.linkedin.height
    );
    
    markArea(
      logoPositions.gmail.x, 
      logoPositions.gmail.y, 
      logoPositions.gmail.width, 
      logoPositions.gmail.height
    );
    
    markArea(
      logoPositions.github.x, 
      logoPositions.github.y, 
      logoPositions.github.width, 
      logoPositions.github.height
    );
  };
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      // Reset animation on resize
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // Restart animation after short delay to prevent excessive recalculations
      setTimeout(() => {
        // Reinitialize canvas
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = canvasHeight * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${canvasHeight}px`;
        
        // Restart animation
        startAnimation();
      }, 200);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [canvasHeight]);

  // Function to spawn food at random position
  const spawnFood = () => {
    const grid = gridRef.current;
    
    // Find all available cells (not blocked and not occupied by snake)
    const availableCells = [];
    
    const snake = snakeRef.current;
    const snakePositions = new Set(
      snake.body.map(pos => `${pos.x},${pos.y}`)
    );
    
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        if (!grid.blockedCells[y][x] && !snakePositions.has(`${x},${y}`)) {
          availableCells.push({x, y});
        }
      }
    }
    
    if (availableCells.length === 0) return;
    
    // Choose random available cell
    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    foodRef.current = {
      x: randomCell.x,
      y: randomCell.y
    };
  };

  const startAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setIsAnimating(true);
    animationRef.current = requestAnimationFrame(animate);
  };
  
  // Animation function
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas || !isAnimating) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    drawGrid(ctx);
    
    // Draw logos
    drawLogos(ctx);
    
    // Update snake position
    updateSnake();
    
    // Draw snake
    drawSnake(ctx);
    
    // Draw food
    drawFood(ctx);
    
    // Continue animation
    animationRef.current = requestAnimationFrame(animate);
  };
  
  // Draw grid
  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    const grid = gridRef.current;
    
    ctx.strokeStyle = 'rgba(74, 255, 145, 0.2)';
    ctx.lineWidth = 0.5;
    
    // Draw grid cells
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        // Skip drawing grid cells where logos will be placed
        if (grid.blockedCells[y][x]) continue;
        
        // Alternate pattern for better visibility
        if ((x + y) % 2 === 0) {
          ctx.fillStyle = 'rgba(74, 255, 145, 0.05)';
        } else {
          ctx.fillStyle = 'rgba(74, 255, 145, 0.02)';
        }
        
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  };
  
  // Draw logo images
  const drawLogos = (ctx: CanvasRenderingContext2D) => {
    const logoPositions = logoPositionsRef.current;
    const logos = logoImages.current;
    
    // Draw LinkedIn logo
    if (logos.linkedin) {
      ctx.drawImage(
        logos.linkedin,
        logoPositions.linkedin.x,
        logoPositions.linkedin.y,
        logoPositions.linkedin.width,
        logoPositions.linkedin.height
      );
    }
    
    // Draw Gmail logo
    if (logos.gmail) {
      ctx.drawImage(
        logos.gmail,
        logoPositions.gmail.x,
        logoPositions.gmail.y,
        logoPositions.gmail.width,
        logoPositions.gmail.height
      );
    }
    
    // Draw GitHub logo
    if (logos.github) {
      ctx.drawImage(
        logos.github,
        logoPositions.github.x,
        logoPositions.github.y,
        logoPositions.github.width,
        logoPositions.github.height
      );
    }
  };
  
  // Update snake position
  const updateSnake = () => {
    const snake = snakeRef.current;
    
    // Only move snake when counter reaches moveDelay
    snake.moveCounter++;
    if (snake.moveCounter < snake.moveDelay) {
      return;
    }
    snake.moveCounter = 0;
    
    // Update direction from nextDirection
    snake.direction = {...snake.nextDirection};
    
    // Calculate new head position
    const head = snake.body[0];
    const newHead = {
      x: head.x + snake.direction.x,
      y: head.y + snake.direction.y
    };
    
    const grid = gridRef.current;
    
    // Check for collisions with walls or blocked areas
    if (
      newHead.x < 0 || 
      newHead.x >= grid.width || 
      newHead.y < 0 || 
      newHead.y >= grid.height ||
      grid.blockedCells[newHead.y][newHead.x]
    ) {
      // Find a valid direction to go
      const alternatives = [
        {x: 0, y: -1}, // up
        {x: 1, y: 0},  // right
        {x: 0, y: 1},  // down
        {x: -1, y: 0}  // left
      ];
      
      // Filter out the opposite of current direction and blocked cells
      const validAlternatives = alternatives.filter(dir => {
        // Skip opposite direction
        if (dir.x === -snake.direction.x && dir.y === -snake.direction.y) {
          return false;
        }
        
        const altX = head.x + dir.x;
        const altY = head.y + dir.y;
        
        // Check if the alternative direction is valid
        return (
          altX >= 0 && 
          altX < grid.width && 
          altY >= 0 && 
          altY < grid.height && 
          !grid.blockedCells[altY][altX]
        );
      });
      
      if (validAlternatives.length > 0) {
        // Choose random valid direction
        const randomIndex = Math.floor(Math.random() * validAlternatives.length);
        snake.direction = validAlternatives[randomIndex];
        snake.nextDirection = validAlternatives[randomIndex];
        
        // Recalculate new head
        newHead.x = head.x + snake.direction.x;
        newHead.y = head.y + snake.direction.y;
      } else {
        // No valid moves, try to continue in current direction
        return;
      }
    }
    
    // Check for collision with food
    const food = foodRef.current;
    let ate = false;
    
    if (food && newHead.x === food.x && newHead.y === food.y) {
      ate = true;
      spawnFood();
    }
    
    // Update snake body
    snake.body.unshift(newHead);
    
    // Remove tail if didn't eat
    if (!ate) {
      snake.body.pop();
    }
    
    // Update direction for next move based on food position
    updateSnakeDirection();
  };
  
  // Update snake direction based on food position
  const updateSnakeDirection = () => {
    const snake = snakeRef.current;
    const food = foodRef.current;
    
    if (!food) return;
    
    const head = snake.body[0];
    
    // Calculate direction to food
    const dx = food.x - head.x;
    const dy = food.y - head.y;
    
    // Determine best move (horizontal or vertical)
    let bestMove = {x: 0, y: 0};
    
    // Try to move horizontally or vertically toward food
    if (Math.abs(dx) > Math.abs(dy)) {
      // Try horizontal first
      bestMove = {x: dx > 0 ? 1 : dx < 0 ? -1 : 0, y: 0};
      
      // Check if the move is valid
      if (!isValidMove(head.x + bestMove.x, head.y + bestMove.y)) {
        // Try vertical instead
        bestMove = {x: 0, y: dy > 0 ? 1 : dy < 0 ? -1 : 0};
        
        // If vertical isn't valid either, find any valid move
        if (!isValidMove(head.x + bestMove.x, head.y + bestMove.y)) {
          findAnyValidMove();
        }
      }
    } else {
      // Try vertical first
      bestMove = {x: 0, y: dy > 0 ? 1 : dy < 0 ? -1 : 0};
      
      // Check if the move is valid
      if (!isValidMove(head.x + bestMove.x, head.y + bestMove.y)) {
        // Try horizontal instead
        bestMove = {x: dx > 0 ? 1 : dx < 0 ? -1 : 0, y: 0};
        
        // If horizontal isn't valid either, find any valid move
        if (!isValidMove(head.x + bestMove.x, head.y + bestMove.y)) {
          findAnyValidMove();
        }
      }
    }
    
    // Set the next direction if it's valid and not opposite of current direction
    if (
      isValidMove(head.x + bestMove.x, head.y + bestMove.y) && 
      !(bestMove.x === -snake.direction.x && bestMove.y === -snake.direction.y)
    ) {
      snake.nextDirection = bestMove;
    }
  };
  
  // Check if a move is valid
  const isValidMove = (x: number, y: number): boolean => {
    const grid = gridRef.current;
    
    // Check if out of bounds
    if (x < 0 || x >= grid.width || y < 0 || y >= grid.height) {
      return false;
    }
    
    // Check if blocked cell
    if (grid.blockedCells[y][x]) {
      return false;
    }
    
    return true;
  };
  
  // Find any valid move
  const findAnyValidMove = () => {
    const snake = snakeRef.current;
    const head = snake.body[0];
    
    const directions = [
      {x: 0, y: -1}, // up
      {x: 1, y: 0},  // right
      {x: 0, y: 1},  // down
      {x: -1, y: 0}  // left
    ];
    
    // Filter out the opposite of current direction and invalid moves
    const validDirections = directions.filter(dir => {
      // Skip opposite direction
      if (dir.x === -snake.direction.x && dir.y === -snake.direction.y) {
        return false;
      }
      
      return isValidMove(head.x + dir.x, head.y + dir.y);
    });
    
    if (validDirections.length > 0) {
      // Choose random valid direction
      const randomIndex = Math.floor(Math.random() * validDirections.length);
      snake.nextDirection = validDirections[randomIndex];
    }
  };
  
  // Draw snake
  const drawSnake = (ctx: CanvasRenderingContext2D) => {
    const snake = snakeRef.current;
    
    for (let i = 0; i < snake.body.length; i++) {
      const segment = snake.body[i];
      
      if (i === 0) {
        // Head
        ctx.fillStyle = '#9C27B0';
      } else {
        // Body
        ctx.fillStyle = '#4AFF91';
      }
      
      ctx.fillRect(
        segment.x * cellSize, 
        segment.y * cellSize, 
        cellSize, 
        cellSize
      );
      
      // Draw outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(
        segment.x * cellSize, 
        segment.y * cellSize, 
        cellSize, 
        cellSize
      );
    }
  };
  
  // Draw food
  const drawFood = (ctx: CanvasRenderingContext2D) => {
    const food = foodRef.current;
    if (!food) return;
    
    // Draw food as a red square
    ctx.fillStyle = '#E53935';
    ctx.fillRect(
      food.x * cellSize,
      food.y * cellSize,
      cellSize,
      cellSize
    );
    
    // Add glow effect
    ctx.shadowColor = '#E53935';
    ctx.shadowBlur = 5;
    ctx.strokeStyle = '#E53935';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      food.x * cellSize,
      food.y * cellSize,
      cellSize,
      cellSize
    );
    ctx.shadowBlur = 0;
  };

  return (
    <div className="w-full">
      <div className="border border-terminal-text/30 rounded bg-terminal-navy/40 p-2 mb-4">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full cursor-pointer"
          height={canvasHeight}
          onClick={() => setIsAnimating(!isAnimating)}
          aria-label="Interactive snake game with social media links"
          role="img"
        />
      </div>
    </div>
  );
};

export default CommitHistory;
