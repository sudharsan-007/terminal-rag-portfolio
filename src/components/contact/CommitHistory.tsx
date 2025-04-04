
import React, { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const CommitHistory = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();
  const canvasHeight = isMobile ? 100 : 150;
  const [isAnimating, setIsAnimating] = useState(true);
  
  // Animation state
  const animationRef = useRef<number | null>(null);
  
  // Grid settings
  const cellSize = 8;
  const gridRef = useRef<{
    width: number, 
    height: number, 
    cells: {x: number, y: number, intensity: number}[],
    occupied: boolean[][]
  }>({
    width: 0,
    height: 0,
    cells: [],
    occupied: []
  });
  
  // Snake settings
  const snakeRef = useRef<{
    positions: {x: number, y: number}[];
    direction: {x: number, y: number};
    speed: number;
    length: number;
    nextDirection: {x: number, y: number};
    moveCounter: number;
    moveDelay: number;
  }>({
    positions: [],
    direction: {x: 1, y: 0},
    speed: 1,
    length: 10,
    nextDirection: {x: 1, y: 0}, // Buffer next direction for grid-based movement
    moveCounter: 0,
    moveDelay: 10 // Controls snake speed (higher = slower)
  });
  
  const foodRef = useRef<{x: number, y: number} | null>(null);
  
  // Logo ASCII representations with green color
  const linkedInAscii = [
    "██████ █    █ █    █ █  █ ███ ██████ █ █    █",
    "█      ██   █ █    █ █ █   █  █    █ █ ██   █",
    "█      █ █  █ █    █ ██    █  █    █ █ █ █  █",
    "█      █  █ █ █    █ █ █   █  █    █ █ █  █ █",
    "██████ █   ██ ██████ █  █ ███ ██████ █ █   ██"
  ];
  
  const gmailAscii = [
    "██████ █   █    ███    █ █      ",
    "█      ██  █   █   █   █ █      ",
    "█  ██  █ █ █  █████████ █      ",
    "█   █  █  ██  █       █ █      ",
    "██████ █   █  █       █ ███████"
  ];
  
  const githubAscii = [
    "██████ █ ████ █  █ █  █ ██████ ",
    "█      █   █  █  █ █  █ █    █ ",
    "█  ███ █   █  ████ █  █ ██████ ",
    "█    █ █   █  █  █ █  █ █    █ ",
    "██████ █   █  █  █ ████ ██████ "
  ];

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
    
    const occupied = Array(gridHeight).fill(0).map(() => Array(gridWidth).fill(false));
    const grid = {
      width: gridWidth,
      height: gridHeight,
      cells: [],
      occupied: occupied
    };
    
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const intensity = Math.random() * 0.5;
        grid.cells.push({x: x * cellSize, y: y * cellSize, intensity});
      }
    }
    
    gridRef.current = grid;
    
    // Set up logo obstacles
    const canvasWidth = rect.width;
    
    // Define logo positions based on grid
    const gridX1 = Math.floor(gridWidth * 0.15);
    const gridX2 = Math.floor(gridWidth * 0.45);
    const gridX3 = Math.floor(gridWidth * 0.75);
    const gridY = Math.floor(gridHeight * 0.3);
    
    // Mark logo areas as occupied
    markLogoAsOccupied(linkedInAscii, gridX1, gridY, occupied);
    markLogoAsOccupied(gmailAscii, gridX2, gridY, occupied);
    markLogoAsOccupied(githubAscii, gridX3, gridY, occupied);
    
    // Initialize snake in a valid position
    const startX = Math.floor(gridWidth / 2);
    const startY = Math.floor(gridHeight * 0.7);
    
    snakeRef.current = {
      positions: Array(10).fill(0).map((_, i) => ({
        x: (startX - i) * cellSize, 
        y: startY * cellSize
      })),
      direction: {x: 1, y: 0},
      nextDirection: {x: 1, y: 0},
      speed: 1,
      length: 10,
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
  
  // Mark logo positions as occupied in the grid
  const markLogoAsOccupied = (
    ascii: string[], 
    startGridX: number, 
    startGridY: number, 
    occupied: boolean[][]
  ) => {
    for (let y = 0; y < ascii.length; y++) {
      const row = ascii[y];
      for (let x = 0; x < row.length; x++) {
        if (row[x] === '█') {
          const gridY = startGridY + y;
          const gridX = startGridX + x;
          
          if (
            gridY >= 0 && 
            gridY < occupied.length && 
            gridX >= 0 && 
            gridX < occupied[0].length
          ) {
            occupied[gridY][gridX] = true;
          }
        }
      }
    }
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
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const grid = gridRef.current;
    const occupied = grid.occupied;
    
    // Find all unoccupied cells
    const availableCells = [];
    
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        if (!occupied[y][x]) {
          availableCells.push({x, y});
        }
      }
    }
    
    if (availableCells.length === 0) return;
    
    // Choose random unoccupied cell
    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    foodRef.current = {
      x: randomCell.x * cellSize + cellSize/2,
      y: randomCell.y * cellSize + cellSize/2
    };
  };

  // Animation function
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas || !isAnimating) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, canvasHeight);
    
    // Draw grid
    drawCommitGrid(ctx);
    
    // Draw ASCII logos
    drawAsciiLogos(ctx);
    
    // Update snake position (grid-based)
    updateSnake();
    
    // Check for collisions
    checkCollisions();
    
    // Draw snake
    drawSnake(ctx);
    
    // Draw food
    drawFood(ctx);
    
    // Continue animation
    animationRef.current = requestAnimationFrame(animate);
  };
  
  const startAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setIsAnimating(true);
    animationRef.current = requestAnimationFrame(animate);
  };
  
  // Draw commit grid
  const drawCommitGrid = (ctx: CanvasRenderingContext2D) => {
    const grid = gridRef.current;
    
    ctx.fillStyle = 'rgba(74, 255, 145, 0.1)';
    ctx.strokeStyle = 'rgba(74, 255, 145, 0.2)';
    ctx.lineWidth = 0.5;
    
    for (const cell of grid.cells) {
      ctx.globalAlpha = cell.intensity;
      ctx.fillRect(cell.x, cell.y, 6, 6);
      ctx.globalAlpha = 1;
      ctx.strokeRect(cell.x, cell.y, 6, 6);
    }
  };
  
  // Draw ASCII art logos
  const drawAsciiLogos = (ctx: CanvasRenderingContext2D) => {
    ctx.font = '6px monospace';
    ctx.fillStyle = 'rgba(74, 255, 145, 0.8)'; // Brighter green color
    
    const canvasWidth = ctx.canvas.width / window.devicePixelRatio;
    const gridWidth = Math.floor(canvasWidth / cellSize);
    
    // Calculate positions
    const gridX1 = Math.floor(gridWidth * 0.15);
    const gridX2 = Math.floor(gridWidth * 0.45);
    const gridX3 = Math.floor(gridWidth * 0.75);
    const gridY = Math.floor((canvasHeight / cellSize) * 0.3);
    
    // Draw LinkedIn
    for (let i = 0; i < linkedInAscii.length; i++) {
      ctx.fillText(linkedInAscii[i], gridX1 * cellSize, gridY * cellSize + i * 8);
    }
    
    // Draw Gmail
    for (let i = 0; i < gmailAscii.length; i++) {
      ctx.fillText(gmailAscii[i], gridX2 * cellSize, gridY * cellSize + i * 8);
    }
    
    // Draw GitHub
    for (let i = 0; i < githubAscii.length; i++) {
      ctx.fillText(githubAscii[i], gridX3 * cellSize, gridY * cellSize + i * 8);
    }
  };
  
  // Update snake position with grid-based movement
  const updateSnake = () => {
    const snake = snakeRef.current;
    const food = foodRef.current;
    
    if (!food) return;
    
    // Only move snake when counter reaches moveDelay
    snake.moveCounter++;
    if (snake.moveCounter < snake.moveDelay) {
      return;
    }
    snake.moveCounter = 0;
    
    // Update direction from nextDirection
    snake.direction = {...snake.nextDirection};
    
    // Get head position in grid coordinates
    const head = snake.positions[0];
    const gridX = Math.floor(head.x / cellSize);
    const gridY = Math.floor(head.y / cellSize);
    
    // Calculate new head position in grid coordinates
    const newGridX = gridX + snake.direction.x;
    const newGridY = gridY + snake.direction.y;
    
    // Check for boundary collisions or obstacles
    const grid = gridRef.current;
    if (
      newGridX < 0 || 
      newGridX >= grid.width || 
      newGridY < 0 || 
      newGridY >= grid.height ||
      (grid.occupied[newGridY] && grid.occupied[newGridY][newGridX])
    ) {
      // Check for alternative directions
      const alternatives = [
        {x: 0, y: -1}, // up
        {x: 1, y: 0},  // right
        {x: 0, y: 1},  // down
        {x: -1, y: 0}  // left
      ];
      
      // Filter out the opposite of current direction and occupied cells
      const validAlternatives = alternatives.filter(dir => {
        // Skip opposite direction
        if (dir.x === -snake.direction.x && dir.y === -snake.direction.y) {
          return false;
        }
        
        const altX = gridX + dir.x;
        const altY = gridY + dir.y;
        
        // Check if the alternative direction is valid
        return (
          altX >= 0 && 
          altX < grid.width && 
          altY >= 0 && 
          altY < grid.height && 
          !(grid.occupied[altY] && grid.occupied[altY][altX])
        );
      });
      
      if (validAlternatives.length > 0) {
        // Choose closest direction to food
        const foodGridX = Math.floor(food.x / cellSize);
        const foodGridY = Math.floor(food.y / cellSize);
        
        validAlternatives.sort((a, b) => {
          const distA = Math.abs(foodGridX - (gridX + a.x)) + Math.abs(foodGridY - (gridY + a.y));
          const distB = Math.abs(foodGridX - (gridX + b.x)) + Math.abs(foodGridY - (gridY + b.y));
          return distA - distB;
        });
        
        // Update direction to the best alternative
        snake.direction = validAlternatives[0];
        snake.nextDirection = validAlternatives[0];
      } else {
        // No valid moves, try to continue in current direction
        // This could happen if snake gets trapped
        return;
      }
    }
    
    // Calculate new head position
    const newHead = {
      x: (gridX + snake.direction.x) * cellSize,
      y: (gridY + snake.direction.y) * cellSize
    };
    
    // Update snake positions
    snake.positions.unshift(newHead);
    
    // Limit snake length
    while (snake.positions.length > snake.length) {
      snake.positions.pop();
    }
    
    // Update AI for next move
    updateSnakeAI();
  };
  
  // Update AI for next snake move
  const updateSnakeAI = () => {
    const snake = snakeRef.current;
    const food = foodRef.current;
    const grid = gridRef.current;
    
    if (!food) return;
    
    // Get head position in grid coordinates
    const head = snake.positions[0];
    const gridX = Math.floor(head.x / cellSize);
    const gridY = Math.floor(head.y / cellSize);
    
    // Get food position in grid coordinates
    const foodGridX = Math.floor(food.x / cellSize);
    const foodGridY = Math.floor(food.y / cellSize);
    
    // Calculate direction to food
    const dx = foodGridX - gridX;
    const dy = foodGridY - gridY;
    
    // Determine best move (horizontal or vertical)
    let bestMove = {x: 0, y: 0};
    
    if (Math.abs(dx) > Math.abs(dy)) {
      // Try horizontal first
      bestMove = {x: dx > 0 ? 1 : -1, y: 0};
      
      // Check if horizontal move is valid
      const newX = gridX + bestMove.x;
      const newY = gridY + bestMove.y;
      
      if (
        newX < 0 || 
        newX >= grid.width || 
        newY < 0 || 
        newY >= grid.height || 
        (grid.occupied[newY] && grid.occupied[newY][newX])
      ) {
        // Try vertical instead
        bestMove = {x: 0, y: dy > 0 ? 1 : -1};
      }
    } else {
      // Try vertical first
      bestMove = {x: 0, y: dy > 0 ? 1 : -1};
      
      // Check if vertical move is valid
      const newX = gridX + bestMove.x;
      const newY = gridY + bestMove.y;
      
      if (
        newX < 0 || 
        newX >= grid.width || 
        newY < 0 || 
        newY >= grid.height || 
        (grid.occupied[newY] && grid.occupied[newY][newX])
      ) {
        // Try horizontal instead
        bestMove = {x: dx > 0 ? 1 : -1, y: 0};
      }
    }
    
    // Final check if the best move is valid
    const newX = gridX + bestMove.x;
    const newY = gridY + bestMove.y;
    
    if (
      newX >= 0 && 
      newX < grid.width && 
      newY >= 0 && 
      newY < grid.height && 
      !(grid.occupied[newY] && grid.occupied[newY][newX])
    ) {
      snake.nextDirection = bestMove;
    } else {
      // Try to find any valid move
      const alternatives = [
        {x: 0, y: -1}, // up
        {x: 1, y: 0},  // right
        {x: 0, y: 1},  // down
        {x: -1, y: 0}  // left
      ];
      
      // Filter out the opposite of current direction and occupied cells
      const validAlternatives = alternatives.filter(dir => {
        // Skip opposite direction
        if (dir.x === -snake.direction.x && dir.y === -snake.direction.y) {
          return false;
        }
        
        const altX = gridX + dir.x;
        const altY = gridY + dir.y;
        
        // Check if the alternative direction is valid
        return (
          altX >= 0 && 
          altX < grid.width && 
          altY >= 0 && 
          altY < grid.height && 
          !(grid.occupied[altY] && grid.occupied[altY][altX])
        );
      });
      
      if (validAlternatives.length > 0) {
        // Choose random valid direction
        const randomIndex = Math.floor(Math.random() * validAlternatives.length);
        snake.nextDirection = validAlternatives[randomIndex];
      }
    }
  };
  
  // Check for collisions
  const checkCollisions = () => {
    const snake = snakeRef.current;
    const food = foodRef.current;
    
    if (!food) return;
    
    // Get head position in grid coordinates
    const head = snake.positions[0];
    const gridX = Math.floor(head.x / cellSize);
    const gridY = Math.floor(head.y / cellSize);
    
    // Get food position in grid coordinates
    const foodGridX = Math.floor(food.x / cellSize);
    const foodGridY = Math.floor(food.y / cellSize);
    
    // Check food collision
    if (gridX === foodGridX && gridY === foodGridY) {
      // Grow snake
      snake.length += 1;
      
      // Spawn new food
      spawnFood();
    }
  };
  
  // Draw snake
  const drawSnake = (ctx: CanvasRenderingContext2D) => {
    const snake = snakeRef.current;
    
    // Draw snake segments as cells
    ctx.fillStyle = '#4AFF91';
    
    for (let i = 0; i < snake.positions.length; i++) {
      const p = snake.positions[i];
      
      if (i === 0) {
        // Head
        ctx.fillStyle = '#9C27B0';
      } else {
        // Body
        ctx.fillStyle = '#4AFF91';
      }
      
      ctx.fillRect(p.x, p.y, cellSize, cellSize);
    }
  };
  
  // Draw food
  const drawFood = (ctx: CanvasRenderingContext2D) => {
    const food = foodRef.current;
    if (!food) return;
    
    ctx.fillStyle = '#E53935';
    ctx.beginPath();
    ctx.arc(food.x, food.y, cellSize/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Add glow effect
    const glowSize = 3 + Math.sin(Date.now() * 0.01) * 2;
    ctx.shadowColor = '#E53935';
    ctx.shadowBlur = glowSize;
    ctx.beginPath();
    ctx.arc(food.x, food.y, cellSize/2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  // Toggle animation
  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
    if (!isAnimating) {
      startAnimation();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  return (
    <div className="w-full">
      <div className="border border-terminal-text/30 rounded bg-terminal-navy/40 p-2 mb-4">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full cursor-pointer"
          height={canvasHeight}
          onClick={toggleAnimation}
          aria-label="Interactive snake game with social media links"
          role="img"
        />
      </div>
      <div className="flex justify-between items-center text-xs text-terminal-text/70">
        <div>LinkedIn</div>
        <div>Gmail</div>  
        <div>GitHub</div>
      </div>
      <div className="mt-2 text-center text-xs text-terminal-text/50">
        Click the animation to {isAnimating ? 'pause' : 'resume'}
      </div>
    </div>
  );
};

export default CommitHistory;
