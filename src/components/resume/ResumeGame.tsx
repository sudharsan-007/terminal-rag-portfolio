
import React from 'react';
import GameDialog from './game/GameDialog';
import GameObjects from './game/GameObjects';
import GameStateUI from './game/GameStateUI';
import Player from './game/Player';
import { useGameLogic } from './game/useGameLogic';

interface ResumeGameProps {
  onItemCollect: (type: 'experience' | 'education' | 'awards', id: string) => void;
  setShowGame: (show: boolean) => void;
}

const ResumeGame: React.FC<ResumeGameProps> = ({ onItemCollect, setShowGame }) => {
  const {
    gameObjects,
    gameState,
    playerX,
    playerY,
    isDucking,
    dialogOpen,
    currentItem,
    playerRef,
    gameRef,
    startGame,
    handleDialogClose
  } = useGameLogic({ onItemCollect });

  return (
    <div className="relative h-[300px] border border-terminal-text/30 rounded-md">
      <GameStateUI gameState={gameState} startGame={startGame} />
      
      <div
        ref={gameRef}
        className="relative h-full overflow-hidden bg-terminal-navy/30"
      >
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-terminal-text/50"></div>
        
        {/* Player character */}
        <Player 
          playerX={playerX} 
          playerY={playerY} 
          isDucking={isDucking} 
          playerRef={playerRef} 
        />
        
        {/* Render game objects */}
        <GameObjects gameObjects={gameObjects} />
      </div>
      
      {/* Dialog for showing item details */}
      <GameDialog 
        dialogOpen={dialogOpen} 
        currentItem={currentItem} 
        handleDialogClose={handleDialogClose} 
      />
    </div>
  );
};

export default ResumeGame;
