
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameStateUIProps {
  gameState: 'start' | 'playing' | 'paused' | 'gameOver';
  onStartGame: () => void;
  progress: number;
}

const GameStateUI: React.FC<GameStateUIProps> = ({ gameState, onStartGame, progress }) => {
  if (gameState === 'playing' || gameState === 'paused') {
    return null;
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-terminal-navy/80 z-20 backdrop-blur-sm">
      {gameState === 'start' && (
        <>
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
          <Button
            onClick={onStartGame}
            className="px-4 py-2 bg-terminal-accent1 text-black rounded-md hover:bg-terminal-accent1/80"
          >
            Start Game
          </Button>
        </>
      )}
      
      {gameState === 'gameOver' && (
        <>
          <div className="text-xl text-terminal-accent1 mb-4">Level Complete!</div>
          <div className="text-terminal-text mb-4">You've explored {Math.round(progress)}% of my resume</div>
          <Button
            onClick={onStartGame}
            className="px-4 py-2 bg-terminal-accent1 text-black rounded-md hover:bg-terminal-accent1/80"
          >
            Play Again
          </Button>
        </>
      )}
    </div>
  );
};

export default GameStateUI;
