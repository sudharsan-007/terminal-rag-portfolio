
import React from 'react';

interface PlayerProps {
  x: number;
  y: number;
  isDucking: boolean;
  isJumping: boolean;
}

const Player: React.FC<PlayerProps> = ({ x, y, isDucking, isJumping }) => {
  const playerSize = isDucking ? 20 : 30;
  const playerScaleX = isJumping ? 1.2 : 1;
  const playerScaleY = isDucking ? 0.6 : isJumping ? 0.9 : 1;

  return (
    <div
      className="absolute rounded-full bg-terminal-accent1 flex items-center justify-center"
      style={{
        left: `${x}px`,
        bottom: `${y}px`,
        width: `${playerSize}px`,
        height: `${playerSize}px`,
        transform: `scale(${playerScaleX}, ${playerScaleY})`,
        transition: 'transform 0.1s ease-out'
      }}
    >
      <span className="text-black font-bold text-xs">S</span>
    </div>
  );
};

export default Player;
