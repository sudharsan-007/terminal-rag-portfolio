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
import { init, Game, Sprite, Vec2 } from 'kaplay';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResumeGameProps {
  onItemCollect: (type: 'experience' | 'education' | 'awards', id: string) => void;
  setShowGame: (show: boolean) => void;
}

const ResumeGame: React.FC<ResumeGameProps> = ({ onItemCollect, setShowGame }) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameInstance = useRef<Game | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameProgress, setGameProgress] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const isMobile = useIsMobile();
  
  const { toast } = useToast();

  useEffect(() => {
    if (!canvasRef.current || !gameRef.current) return;
    
    const initGame = async () => {
      // Initialize Kaplay
      const game = init({
        canvas: canvasRef.current!,
        width: gameRef.current!.clientWidth,
        height: 300,
        background: '#0a1929'
      });
      
      gameInstance.current = game;
      
      // Create player sprite
      const player = new Sprite({
        pos: new Vec2(50, 200),
        width: 30,
        height: 30,
        color: '#9C27B0',
      });
      
      // Add gravity
      player.addComponent({
        name: 'gravity',
        update: (sprite) => {
          sprite.pos.y += 5;
          // Keep player within bounds
          if (sprite.pos.y > 270) {
            sprite.pos.y = 270;
          }
        }
      });
      
      // Add controls
      let isJumping = false;
      let isCrouching = false;
      
      document.addEventListener('keydown', (e) => {
        if (!isGameActive) return;
        
        // Move left
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          player.pos.x -= 5;
        }
        
        // Move right
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          player.pos.x += 5;
        }
        
        // Jump
        if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') && !isJumping) {
          isJumping = true;
          let jumpHeight = 0;
          
          const jumpInterval = setInterval(() => {
            player.pos.y -= 8;
            jumpHeight += 8;
            
            if (jumpHeight >= 100) {
              clearInterval(jumpInterval);
              isJumping = false;
            }
          }, 20);
        }
        
        // Crouch
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          if (!isCrouching) {
            isCrouching = true;
            player.height = 15;
          }
        }
      });
      
      document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          isCrouching = false;
          player.height = 30;
        }
      });
      
      // Create platform
      const platform = new Sprite({
        pos: new Vec2(0, 300),
        width: gameRef.current!.clientWidth,
        height: 20,
        color: '#4AFF91',
      });
      
      // Create collectible (briefcase)
      const briefcase = new Sprite({
        pos: new Vec2(400, 270),
        width: 25,
        height: 25,
        color: '#E53935',
      });
      
      // Create exit gate
      const exitGate = new Sprite({
        pos: new Vec2(gameRef.current!.clientWidth - 50, 250),
        width: 40,
        height: 50,
        color: '#FFD700',
      });
      
      // Add sprites to game
      game.addSprite(platform);
      game.addSprite(player);
      game.addSprite(briefcase);
      game.addSprite(exitGate);
      
      // Collision detection function
      const checkCollision = (sprite1: Sprite, sprite2: Sprite) => {
        return (
          sprite1.pos.x < sprite2.pos.x + sprite2.width &&
          sprite1.pos.x + sprite1.width > sprite2.pos.x &&
          sprite1.pos.y < sprite2.pos.y + sprite2.height &&
          sprite1.pos.y + sprite1.height > sprite2.pos.y
        );
      };
      
      // Update game loop
      game.onUpdate(() => {
        if (!isGameActive) return;
        
        // Check for briefcase collection
        if (!briefcase.hidden && checkCollision(player, briefcase)) {
          briefcase.hidden = true;
          setScore(prev => prev + 1);
          setGameProgress(50);
          
          // Pause game and show dialog
          isGameActive && setIsGameActive(false);
          game.pause();
          
          // Show collected item dialog
          const itemDetails = resumeData.experience[0]; // OrbDoc experience
          setCurrentItem({
            type: 'experience',
            id: 'experience-0',
            details: itemDetails
          });
          setDialogOpen(true);
          
          // Notify with toast
          toast({
            title: "Item Collected!",
            description: "You've collected the OrbDoc experience.",
            duration: 3000
          });
          
          // Update parent component
          onItemCollect('experience', 'experience-0');
        }
        
        // Check for exit gate (level complete)
        if (briefcase.hidden && checkCollision(player, exitGate)) {
          setGameOver(true);
          setIsGameActive(false);
          game.pause();
          
          setGameProgress(100);
          
          toast({
            title: "Level Complete!",
            description: "You've completed the OrbDoc experience level.",
            duration: 5000
          });
        }
        
        // Simple platform collision (prevent falling through)
        if (player.pos.y + player.height >= platform.pos.y) {
          player.pos.y = platform.pos.y - player.height;
        }
      });
      
      // Start rendering loop
      game.start();
    };
    
    initGame();
    
    return () => {
      // Cleanup
      if (gameInstance.current) {
        gameInstance.current.stop();
      }
    };
  }, [onItemCollect, toast]);
  
  const handleDialogClose = () => {
    setDialogOpen(false);
    
    // Resume game after dialog is closed
    if (gameInstance.current && !gameOver) {
      setIsGameActive(true);
      gameInstance.current.resume();
    }
  };
  
  const startGame = () => {
    setIsGameActive(true);
    setGameOver(false);
    setScore(0);
    setGameProgress(0);
    
    if (gameInstance.current) {
      gameInstance.current.resume();
    }
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
