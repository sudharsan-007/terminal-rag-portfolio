
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useGameLogic } from './useGameLogic';
import Player from './Player';
import GameObjects from './GameObjects';
import GameStateUI from './GameStateUI';
import GameDialog from './GameDialog';

interface ResumeGameProps {
  onItemCollect: (type: 'experience' | 'education' | 'awards', id: string) => void;
  setShowGame: (show: boolean) => void;
}

const ResumeGame: React.FC<ResumeGameProps> = ({ onItemCollect, setShowGame }) => {
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
    initializeGame
  } = useGameLogic({ onItemCollect });

  return (
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
      <div className="relative h-full overflow-hidden bg-terminal-navy/30">
        {/* Player */}
        <Player 
          x={player.x} 
          y={player.y} 
          isDucking={player.isDucking} 
          isJumping={player.isJumping} 
        />
        
        {/* Game objects (platforms and collectibles) */}
        <GameObjects 
          gameObjects={gameObjects}
          platforms={platforms}
        />
      </div>
      
      {/* Dialog for showing item details */}
      <GameDialog 
        open={dialogOpen} 
        onClose={handleDialogClose} 
        currentItem={currentItem} 
      />
    </div>
  );
};

export default ResumeGame;
