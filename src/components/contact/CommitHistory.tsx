
import React, { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const CommitHistory = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();
  const canvasHeight = isMobile ? 100 : 150;
  const [isAnimating, setIsAnimating] = useState(true);
  
  // Animation state
  const animationRef = useRef<number | null>(null);
  const snakeRef = useRef<{
    positions: {x: number, y: number}[];
    direction: {x: number, y: number};
    speed: number;
    length: number;
  }>({
    positions: Array(10).fill(0).map((_, i) => ({x: 50 - i * 10, y: canvasHeight / 2})),
    direction: {x: 1, y: 0},
    speed: 2,
    length: 10
  });
  
  const foodRef = useRef<{x: number, y: number} | null>(null);
  const gridRef = useRef<{width: number, height: number, cells: {x: number, y: number, intensity: number}[]}>({
    width: 0,
    height: 0,
    cells: []
  });
  
  const logoObstaclesRef = useRef<{x: number, y: number, width: number, height: number, type: string}[]>([]);

  // ASCII representations (simplified for this example)
  const linkedInAscii = [
    "██  ██ █   █ █  █ █████ ██  ██ ████ █   █",
    "██  ██ ██  █ █ █  █     ██  ██ █  █ ██  █",
    "██  ██ █ █ █ ██   ████  ██  ██ █  █ █ █ █",
    "██  ██ █  ██ █ █  █     ██  ██ █  █ █  ██",
    "█████  █   █ █  █ █████ █████  ████ █   █"
  ];
  
  const gmailAscii = [
    "█████ █   █   ██   ████ █    ",
    "█     ██ ██  █  █  █  █ █    ",
    "█ ██  █ █ █ ██████ █  █ █    ",
    "█  █  █   █ █    █ █  █ █    ",
    "█████ █   █ █    █ ████ █████"
  ];
  
  const githubAscii = [
    "█████ ████ █████ █  █ █  █ ████  ",
    "█     █      █   █  █ █  █ █   █ ",
    "█ ██  ███    █   ████ ██ █ ████  ",
    "█  █  █      █   █  █ █ ██ █   █ ",
    "█████ █      █   █  █ █  █ ████  "
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
    const cellSize = 8;
    const gridWidth = Math.floor(rect.width / cellSize);
    const gridHeight = Math.floor(canvasHeight / cellSize);
    
    const grid = {
      width: gridWidth,
      height: gridHeight,
      cells: []
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
    // Define logo positions
    const linkedInX = canvasWidth * 0.1;
    const gmailX = canvasWidth * 0.4;
    const githubX = canvasWidth * 0.7;
    
    // Set up obstacles (simplified for this example)
    logoObstaclesRef.current = [
      {x: linkedInX, y: 20, width: 200, height: 50, type: 'linkedin'},
      {x: gmailX, y: 20, width: 150, height: 50, type: 'gmail'},
      {x: githubX, y: 20, width: 150, height: 50, type: 'github'}
    ];
    
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
    
    const rect = canvas.getBoundingClientRect();
    
    // Ensure food doesn't spawn inside obstacles
    let valid = false;
    let x = 0, y = 0;
    
    while (!valid) {
      x = Math.floor(Math.random() * (rect.width - 10)) + 5;
      y = Math.floor(Math.random() * (canvasHeight - 10)) + 5;
      
      valid = true;
      // Check against obstacles
      for (const obstacle of logoObstaclesRef.current) {
        if (
          x > obstacle.x && 
          x < obstacle.x + obstacle.width && 
          y > obstacle.y && 
          y < obstacle.y + obstacle.height
        ) {
          valid = false;
          break;
        }
      }
    }
    
    foodRef.current = {x, y};
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
    
    // Update snake position
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
    ctx.fillStyle = 'rgba(74, 255, 145, 0.6)';
    
    for (const obstacle of logoObstaclesRef.current) {
      let asciiArt: string[] = [];
      
      switch (obstacle.type) {
        case 'linkedin':
          asciiArt = linkedInAscii;
          break;
        case 'gmail':
          asciiArt = gmailAscii;
          break;
        case 'github':
          asciiArt = githubAscii;
          break;
      }
      
      for (let i = 0; i < asciiArt.length; i++) {
        ctx.fillText(asciiArt[i], obstacle.x, obstacle.y + i * 8);
      }
    }
  };
  
  // Update snake position
  const updateSnake = () => {
    const snake = snakeRef.current;
    const food = foodRef.current;
    
    if (!food) return;
    
    // Simple AI: Move towards food
    const head = snake.positions[0];
    
    // Calculate direction to food
    let dx = food.x - head.x;
    let dy = food.y - head.y;
    
    // Normalize
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length > 0) {
      dx = dx / length;
      dy = dy / length;
    }
    
    // Update direction with some smoothing
    snake.direction.x = 0.9 * snake.direction.x + 0.1 * dx;
    snake.direction.y = 0.9 * snake.direction.y + 0.1 * dy;
    
    // Normalize direction
    const dirLength = Math.sqrt(snake.direction.x * snake.direction.x + snake.direction.y * snake.direction.y);
    if (dirLength > 0) {
      snake.direction.x = snake.direction.x / dirLength;
      snake.direction.y = snake.direction.y / dirLength;
    }
    
    // Update head position
    const newHead = {
      x: head.x + snake.direction.x * snake.speed,
      y: head.y + snake.direction.y * snake.speed
    };
    
    // Check for canvas bounds
    const canvas = canvasRef.current;
    if (canvas) {
      if (newHead.x < 0) newHead.x = canvas.width;
      if (newHead.x > canvas.width) newHead.x = 0;
      if (newHead.y < 0) newHead.y = canvasHeight;
      if (newHead.y > canvasHeight) newHead.y = 0;
    }
    
    // Update snake positions
    snake.positions.unshift(newHead);
    
    // Limit snake length
    while (snake.positions.length > snake.length) {
      snake.positions.pop();
    }
  };
  
  // Check for collisions
  const checkCollisions = () => {
    const snake = snakeRef.current;
    const food = foodRef.current;
    
    if (!food) return;
    
    const head = snake.positions[0];
    
    // Check food collision
    const dx = head.x - food.x;
    const dy = head.y - food.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 10) {
      // Grow snake
      snake.length += 1;
      
      // Spawn new food
      spawnFood();
    }
    
    // Simple obstacle avoidance
    for (const obstacle of logoObstaclesRef.current) {
      if (
        head.x > obstacle.x - 10 && 
        head.x < obstacle.x + obstacle.width + 10 && 
        head.y > obstacle.y - 10 && 
        head.y < obstacle.y + obstacle.height + 10
      ) {
        // Determine avoidance direction
        const centerX = obstacle.x + obstacle.width / 2;
        const centerY = obstacle.y + obstacle.height / 2;
        
        const avoidX = head.x - centerX;
        const avoidY = head.y - centerY;
        
        const avoidLength = Math.sqrt(avoidX * avoidX + avoidY * avoidY);
        
        if (avoidLength > 0) {
          // Add avoidance vector to direction
          snake.direction.x += (avoidX / avoidLength) * 0.5;
          snake.direction.y += (avoidY / avoidLength) * 0.5;
          
          // Normalize
          const dirLength = Math.sqrt(snake.direction.x * snake.direction.x + snake.direction.y * snake.direction.y);
          if (dirLength > 0) {
            snake.direction.x = snake.direction.x / dirLength;
            snake.direction.y = snake.direction.y / dirLength;
          }
        }
      }
    }
  };
  
  // Draw snake
  const drawSnake = (ctx: CanvasRenderingContext2D) => {
    const snake = snakeRef.current;
    
    // Draw snake body
    ctx.strokeStyle = '#4AFF91';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(snake.positions[0].x, snake.positions[0].y);
    
    for (let i = 1; i < snake.positions.length; i++) {
      const p = snake.positions[i];
      ctx.lineTo(p.x, p.y);
    }
    
    ctx.stroke();
    
    // Draw snake head
    ctx.fillStyle = '#9C27B0';
    ctx.beginPath();
    ctx.arc(snake.positions[0].x, snake.positions[0].y, 4, 0, Math.PI * 2);
    ctx.fill();
  };
  
  // Draw food
  const drawFood = (ctx: CanvasRenderingContext2D) => {
    const food = foodRef.current;
    if (!food) return;
    
    ctx.fillStyle = '#E53935';
    ctx.beginPath();
    ctx.arc(food.x, food.y, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Add glow effect
    const glowSize = 3 + Math.sin(Date.now() * 0.01) * 2;
    ctx.shadowColor = '#E53935';
    ctx.shadowBlur = glowSize;
    ctx.beginPath();
    ctx.arc(food.x, food.y, 5, 0, Math.PI * 2);
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
          aria-label="Interactive commit history with snake animation"
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
