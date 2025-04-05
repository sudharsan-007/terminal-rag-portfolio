import React, { useEffect, useRef, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { ArrowUp, ArrowDown, Briefcase } from 'lucide-react';
import resumeData from '@/data/resumeData';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import kaplay from 'kaplay';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResumeGameProps {
  onItemCollect: (type: 'experience' | 'education' | 'awards', id: string) => void;
  setShowGame: (show: boolean) => void;
}

interface GameSprite {
  pos: { x: number; y: number };
  width: number;
  height: number;
  color: string;
  hidden?: boolean;
  addComponent?: (component: any) => void;
}

const ResumeGame: React.FC<ResumeGameProps> = ({ onItemCollect, setShowGame }) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameInstance = useRef<ReturnType<typeof kaplay> | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameProgress, setGameProgress] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const isMobile = useIsMobile();
  
  const player = useRef<GameSprite>({
    pos: { x: 50, y: 200 },
    width: 30,
    height: 30,
    color: '#9C27B0'
  });
  
  const platform = useRef<GameSprite>({
    pos: { x: 0, y: 300 },
    width: 800,
    height: 20,
    color: '#4AFF91'
  });
  
  const briefcase = useRef<GameSprite>({
    pos: { x: 400, y: 270 },
    width: 25,
    height: 25,
    color: '#E53935',
    hidden: false
  });
  
  const exitGate = useRef<GameSprite>({
    pos: { x: 750, y: 250 },
    width: 40,
    height: 50,
    color: '#FFD700'
  });
  
  const animationFrameRef = useRef<number | null>(null);
  
  const { toast } = useToast();

  const checkCollision = (sprite1: GameSprite, sprite2: GameSprite) => {
    if (sprite2.hidden) return false;
    
    return (
      sprite1.pos.x < sprite2.pos.x + sprite2.width &&
      sprite1.pos.x + sprite1.width > sprite2.pos.x &&
      sprite1.pos.y < sprite2.pos.y + sprite2.height &&
      sprite1.pos.y + sprite1.height > sprite2.pos.y
    );
  };
  
  const updateGame = () => {
    if (!isGameActive) return;
    
    player.current.pos.y += 5;
    
    if (player.current.pos.y > 270) {
      player.current.pos.y = 270;
    }
    
    if (player.current.pos.y + player.current.height >= platform.current.pos.y) {
      player.current.pos.y = platform.current.pos.y - player.current.height;
    }
    
    if (!briefcase.current.hidden && checkCollision(player.current, briefcase.current)) {
      briefcase.current.hidden = true;
      setScore(prev => prev + 1);
      setGameProgress(50);
      
      setIsGameActive(false);
      
      const itemDetails = resumeData.experience[0];
      setCurrentItem({
        type: 'experience',
        id: 'experience-0',
        details: itemDetails
      });
      setDialogOpen(true);
      
      toast({
        title: "Item Collected!",
        description: "You've collected the OrbDoc experience.",
        duration: 3000
      });
      
      onItemCollect('experience', 'experience-0');
    }
    
    if (briefcase.current.hidden && checkCollision(player.current, exitGate.current)) {
      setGameOver(true);
      setIsGameActive(false);
      
      setGameProgress(100);
      
      toast({
        title: "Level Complete!",
        description: "You've completed the OrbDoc experience level.",
        duration: 5000
      });
    }
    
    renderGame();
    
    if (isGameActive) {
      animationFrameRef.current = requestAnimationFrame(updateGame);
    }
  };
  
  const renderGame = () => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#0a1929';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    ctx.fillStyle = platform.current.color;
    ctx.fillRect(
      platform.current.pos.x,
      platform.current.pos.y,
      platform.current.width,
      platform.current.height
    );
    
    ctx.fillStyle = player.current.color;
    ctx.fillRect(
      player.current.pos.x,
      player.current.pos.y,
      player.current.width,
      player.current.height
    );
    
    if (!briefcase.current.hidden) {
      ctx.fillStyle = briefcase.current.color;
      ctx.fillRect(
        briefcase.current.pos.x,
        briefcase.current.pos.y,
        briefcase.current.width,
        briefcase.current.height
      );
    }
    
    ctx.fillStyle = exitGate.current.color;
    ctx.fillRect(
      exitGate.current.pos.x,
      exitGate.current.pos.y,
      exitGate.current.width,
      exitGate.current.height
    );
  };
  
  const startGameLoop = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(updateGame);
  };
  
  const stopGameLoop = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  useEffect(() => {
    if (!canvasRef.current || !gameRef.current) return;
    
    const initGame = async () => {
      canvasRef.current!.width = gameRef.current!.clientWidth;
      canvasRef.current!.height = 300;
      
      platform.current.width = canvasRef.current!.width;
      exitGate.current.pos.x = canvasRef.current!.width - 50;
      
      gameInstance.current = kaplay();
      
      let isJumping = false;
      let isCrouching = false;
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (!isGameActive) return;
        
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          player.current.pos.x -= 5;
        }
        
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          player.current.pos.x += 5;
        }
        
        if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') && !isJumping) {
          isJumping = true;
          let jumpHeight = 0;
          
          const jumpInterval = setInterval(() => {
            player.current.pos.y -= 8;
            jumpHeight += 8;
            
            if (jumpHeight >= 100) {
              clearInterval(jumpInterval);
              isJumping = false;
            }
          }, 20);
        }
        
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          if (!isCrouching) {
            isCrouching = true;
            player.current.height = 15;
          }
        }
      };
      
      const handleKeyUp = (e: KeyboardEvent) => {
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          isCrouching = false;
          player.current.height = 30;
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
      
      renderGame();
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
      };
    };
    
    initGame();
    
    return () => {
      stopGameLoop();
    };
  }, []);
  
  useEffect(() => {
    if (isGameActive) {
      startGameLoop();
    } else {
      stopGameLoop();
    }
    
    return () => {
      stopGameLoop();
    };
  }, [isGameActive]);
  
  const handleDialogClose = () => {
    setDialogOpen(false);
    
    if (!gameOver) {
      setIsGameActive(true);
    }
  };
  
  const startGame = () => {
    player.current.pos = { x: 50, y: 200 };
    briefcase.current.hidden = false;
    
    setIsGameActive(true);
    setGameOver(false);
    setScore(0);
    setGameProgress(0);
  };
  
  return (
    <div className="relative h-[300px] border border-terminal-text/30 rounded-md">
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
          <div className="text-xl text-terminal-accent1 mb-4">Level Complete!</div>
          <div className="text-terminal-text mb-4">You've completed the OrbDoc experience level</div>
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
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
      </div>
      
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
