import React, { useRef, useEffect, useState, Component, ErrorInfo, ReactNode } from 'react';
import { Progress } from '@/components/ui/progress';
import * as PIXI from 'pixi.js';
import * as Matter from 'matter-js';
import { useGameLogic } from './useGameLogic';
import Player from './Player';
import GameObjects from './GameObjects';
import GameStateUI from './GameStateUI';
import GameDialog from './GameDialog';

// Add an error boundary component to catch and handle errors
class ErrorBoundary extends Component<
  { children: ReactNode, fallback?: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode, fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Resume game component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="h-[300px] border border-terminal-text/30 rounded-md bg-terminal-navy/20 flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-terminal-accent1 mb-2">Game engine unavailable</p>
            <p className="text-terminal-text text-sm">Please try again later or view resume content below</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface ResumeGameProps {
  onItemCollect: (type: 'experience' | 'education' | 'awards', id: string) => void;
  setShowGame: (show: boolean) => void;
}

const ResumeGame: React.FC<ResumeGameProps> = ({ onItemCollect, setShowGame }) => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const pixiAppRef = useRef<PIXI.Application | null>(null);
  const [pixiApp, setPixiApp] = useState<PIXI.Application | null>(null);
  
  const {
    gameState,
    gameProgress,
    score,
    player,
    gameObjects,
    platforms,
    dialogOpen,
    currentItem,
    handleDialogClose,
    initializeGame,
    physicsEngine
  } = useGameLogic({ onItemCollect, containerRef: gameContainerRef, pixiApp });

  // Initialize PixiJS
  useEffect(() => {
    if (gameContainerRef.current && !pixiAppRef.current) {
      const app = new PIXI.Application({
        width: 800,
        height: 300,
        backgroundColor: 0x0A1929,
        antialias: true,
      });
      
      gameContainerRef.current.appendChild(app.view as HTMLCanvasElement);
      pixiAppRef.current = app;
      setPixiApp(app);
      
      return () => {
        if (pixiAppRef.current) {
          pixiAppRef.current.destroy();
          pixiAppRef.current = null;
          setPixiApp(null);
        }
      };
    }
  }, []);

  return (
    <ErrorBoundary>
      <div className="relative h-[300px] border border-terminal-text/30 rounded-md">
        {/* Progress bar */}
        <div className="absolute top-2 left-2 right-2 z-10">
          <Progress value={gameProgress} className="h-2" />
        </div>
        
        <div className="absolute top-4 left-2 text-terminal-text z-10">
          Score: {score}
        </div>

        {/* Game state UI (start screen, game over) */}
        <GameStateUI 
          gameState={gameState} 
          onStartGame={initializeGame} 
          progress={gameProgress} 
        />
        
        {/* Game area */}
        <div 
          ref={gameContainerRef} 
          className="relative h-full overflow-hidden bg-terminal-navy/30"
        >
          {/* Player and GameObjects are now rendered via PixiJS */}
          <Player 
            x={player.x} 
            y={player.y} 
            isDucking={player.isDucking} 
            isJumping={player.isJumping}
            containerRef={gameContainerRef}
            pixiApp={pixiApp}
          />
          
          <GameObjects 
            gameObjects={gameObjects}
            platforms={platforms}
            containerRef={gameContainerRef}
            pixiApp={pixiApp}
          />
        </div>
        
        {/* Dialog for showing item details */}
        <GameDialog 
          open={dialogOpen} 
          onClose={handleDialogClose} 
          currentItem={currentItem} 
        />
      </div>
    </ErrorBoundary>
  );
};

export default ResumeGame;
