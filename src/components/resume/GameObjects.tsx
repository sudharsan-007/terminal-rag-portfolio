import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { Briefcase, GraduationCap, Star } from 'lucide-react';

// Define the interfaces directly to avoid import issues
interface GameObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  collected: boolean;
}

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
}

interface GameObjectsProps {
  gameObjects: GameObject[];
  platforms: Platform[];
  containerRef: React.RefObject<HTMLDivElement>;
  pixiApp: PIXI.Application | null;
}

const GameObjects: React.FC<GameObjectsProps> = ({ gameObjects, platforms, containerRef, pixiApp }) => {
  const objectsContainerRef = useRef<PIXI.Container | null>(null);
  const platformsContainerRef = useRef<PIXI.Container | null>(null);
  const isMountedRef = useRef<boolean>(true);
  
  // Set mounted ref on mount and cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Handle objects
  useEffect(() => {
    if (!pixiApp || !isMountedRef.current) return;

    // Create containers if they don't exist
    if (!objectsContainerRef.current) {
      const container = new PIXI.Container();
      objectsContainerRef.current = container;
      pixiApp.stage.addChild(container);
    }

    // Clear existing objects
    const container = objectsContainerRef.current;
    container.removeChildren();

    // Add game objects
    gameObjects.forEach(obj => {
      const sprite = new PIXI.Graphics();
      
      if (obj.type === 'obstacle') {
        sprite.beginFill(0xFF5252); // Red
        sprite.drawRect(0, 0, obj.width, obj.height);
      } else {
        sprite.beginFill(0x4AFF91); // Green
        sprite.drawCircle(obj.width / 2, obj.height / 2, obj.width / 2);
      }
      
      sprite.endFill();
      sprite.x = obj.x;
      sprite.y = pixiApp.screen.height - obj.y - obj.height;
      
      container.addChild(sprite);
    });

    return () => {
      if (objectsContainerRef.current && pixiApp && pixiApp.stage) {
        try {
          // Check if the stage is still valid before removing
          if (!pixiApp.stage.destroyed) {
            pixiApp.stage.removeChild(objectsContainerRef.current);
          }
        } catch (e) {
          console.warn('Could not remove objects container:', e);
        }
        objectsContainerRef.current = null;
      }
    };
  }, [gameObjects, pixiApp]);

  // Handle platforms
  useEffect(() => {
    if (!pixiApp || !isMountedRef.current) return;

    // Create container if it doesn't exist
    if (!platformsContainerRef.current) {
      const container = new PIXI.Container();
      platformsContainerRef.current = container;
      pixiApp.stage.addChild(container);
    }

    // Clear existing platforms
    const container = platformsContainerRef.current;
    container.removeChildren();

    // Add platforms
    platforms.forEach(platform => {
      const sprite = new PIXI.Graphics();
      sprite.beginFill(0x546E7A); // Blue-grey
      sprite.drawRect(0, 0, platform.width, platform.height);
      sprite.endFill();
      sprite.x = platform.x;
      sprite.y = pixiApp.screen.height - platform.y - platform.height;
      
      container.addChild(sprite);
    });

    return () => {
      if (platformsContainerRef.current && pixiApp && pixiApp.stage) {
        try {
          // Check if the stage is still valid before removing
          if (!pixiApp.stage.destroyed) {
            pixiApp.stage.removeChild(platformsContainerRef.current);
          }
        } catch (e) {
          console.warn('Could not remove platforms container:', e);
        }
        platformsContainerRef.current = null;
      }
    };
  }, [platforms, pixiApp]);

  return null;
};

export default GameObjects;
