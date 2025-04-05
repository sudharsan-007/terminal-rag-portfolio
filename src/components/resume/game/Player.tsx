
import React, { useRef } from 'react';

interface PlayerProps {
  playerX: number;
  playerY: number;
  isDucking: boolean;
  playerRef: React.RefObject<HTMLDivElement>;
}

const Player: React.FC<PlayerProps> = ({ playerX, playerY, isDucking, playerRef }) => {
  return (
    <div
      ref={playerRef}
      className={`absolute bottom-10 w-12 ${isDucking ? 'h-6' : 'h-12'}`}
      style={{ 
        left: `${playerX}px`,
        transform: `translateY(${playerY}px)`
      }}
    >
      <div className="h-full w-full rounded-full bg-terminal-accent1 flex items-center justify-center">
        <span className="text-black font-bold">S</span>
      </div>
    </div>
  );
};

export default Player;
