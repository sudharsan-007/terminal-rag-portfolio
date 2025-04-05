
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { GameState } from './types';

interface GameStateUIProps {
  gameState: GameState;
  startGame: () => void;
}

const GameStateUI: React.FC<GameStateUIProps> = ({ gameState, startGame }) => {
  const { isGameActive, gameOver, score, gameProgress } = gameState;
  
  return (
    <>
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
          <div className="text-xl text-terminal-accent1 mb-4">Journey Complete!</div>
          <div className="text-terminal-text mb-4">You've explored my entire resume</div>
          <button
            onClick={startGame}
            className="px-4 py-2 bg-terminal-accent1 text-black rounded-md hover:bg-terminal-accent1/80"
          >
            Play Again
          </button>
        </div>
      )}
    </>
  );
};

export default GameStateUI;
