
import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

interface PlayerProps {
  x: number;
  y: number;
  isDucking: boolean;
  isJumping: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  pixiApp: PIXI.Application | null;
}

const Player: React.FC<PlayerProps> = ({ x, y, isDucking, isJumping, containerRef, pixiApp }) => {
  const playerRef = useRef<PIXI.Graphics | null>(null);
  const isMountedRef = useRef<boolean>(true);
  
  // Set mounted ref on mount and cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  useEffect(() => {
    if (!pixiApp || !isMountedRef.current) return;
    
    // Create player if it doesn't exist
    if (!playerRef.current) {
      const player = new PIXI.Graphics();
      playerRef.current = player;
      pixiApp.stage.addChild(player);
    }
    
    // Update player appearance
    const playerSize = isDucking ? 20 : 30;
    const playerScaleX = isJumping ? 1.2 : 1;
    const playerScaleY = isDucking ? 0.6 : isJumping ? 0.9 : 1;
    
    const player = playerRef.current;
    player.clear();
    player.beginFill(0x9C27B0); // Purple color
    player.drawCircle(0, 0, playerSize / 2);
    player.endFill();
    
    // Draw letter 'S' in the center
    const text = new PIXI.Text('S', {
      fontFamily: 'Arial',
      fontSize: 14,
      fill: 0x000000,
      align: 'center',
    });
    text.anchor.set(0.5);
    
    // Update position and scale
    player.x = x + playerSize / 2;
    player.y = pixiApp.screen.height - y - playerSize / 2;
    player.scale.set(playerScaleX, playerScaleY);
    
    return () => {
      // Add safety checks to prevent errors when unmounting
      if (playerRef.current && pixiApp && pixiApp.stage) {
        try {
          // Check if the application is still valid
          if (!pixiApp.stage.destroyed) {
            pixiApp.stage.removeChild(playerRef.current);
          }
        } catch (e) {
          console.warn('Could not remove player from stage:', e);
        }
        playerRef.current = null;
      }
    };
  }, [x, y, isDucking, isJumping, pixiApp]);
  
  // This component no longer renders visible DOM elements
  return null;
};

export default Player;
