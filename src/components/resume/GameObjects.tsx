
import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { Briefcase, GraduationCap, Star } from 'lucide-react';

interface GameObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'experience' | 'education' | 'awards';
  collected: boolean;
}

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'normal' | 'obstacle' | 'exit';
}

interface GameObjectsProps {
  gameObjects: GameObject[];
  platforms: Platform[];
  containerRef: React.RefObject<HTMLDivElement>;
  pixiApp: PIXI.Application | null;
}

const GameObjects: React.FC<GameObjectsProps> = ({ gameObjects, platforms, containerRef, pixiApp }) => {
  const platformsRef = useRef<PIXI.Graphics[]>([]);
  const objectsRef = useRef<PIXI.Graphics[]>([]);
  
  // Create and update platforms
  useEffect(() => {
    if (!pixiApp) return;
    
    // Clear previous platforms
    platformsRef.current.forEach(platform => {
      pixiApp.stage.removeChild(platform);
    });
    platformsRef.current = [];
    
    // Create new platforms
    platforms.forEach((platform, index) => {
      const graphics = new PIXI.Graphics();
      
      let fillColor = 0x808080; // Default gray
      if (platform.type === 'obstacle') {
        fillColor = 0xF44336; // Red
      } else if (platform.type === 'exit') {
        fillColor = 0x4CAF50; // Green
      }
      
      graphics.beginFill(fillColor);
      graphics.drawRect(0, 0, platform.width, platform.height);
      graphics.endFill();
      
      if (platform.type === 'exit') {
        const text = new PIXI.Text('EXIT', {
          fontFamily: 'Arial',
          fontSize: 12,
          fill: 0xFFFFFF,
          align: 'center',
        });
        text.anchor.set(0.5);
        text.x = platform.width / 2;
        text.y = platform.height / 2;
        graphics.addChild(text);
      }
      
      graphics.x = platform.x;
      graphics.y = pixiApp.screen.height - platform.y - platform.height;
      
      pixiApp.stage.addChild(graphics);
      platformsRef.current.push(graphics);
    });
    
    return () => {
      if (pixiApp) {
        platformsRef.current.forEach(platform => {
          pixiApp.stage.removeChild(platform);
        });
        platformsRef.current = [];
      }
    };
  }, [platforms, pixiApp]);
  
  // Create and update game objects
  useEffect(() => {
    if (!pixiApp) return;
    
    // Clear previous objects
    objectsRef.current.forEach(obj => {
      pixiApp.stage.removeChild(obj);
    });
    objectsRef.current = [];
    
    // Create new objects
    gameObjects.forEach(obj => {
      if (obj.collected) return;
      
      const graphics = new PIXI.Graphics();
      
      let fillColor;
      switch (obj.type) {
        case 'experience':
          fillColor = 0x2196F3; // Blue
          break;
        case 'education':
          fillColor = 0x4CAF50; // Green
          break;
        case 'awards':
          fillColor = 0xFFC107; // Yellow
          break;
        default:
          fillColor = 0x9C27B0; // Purple
      }
      
      graphics.beginFill(fillColor, 0.7);
      graphics.drawRect(0, 0, obj.width, obj.height);
      graphics.endFill();
      
      // Add icon
      let iconText = '?';
      switch (obj.type) {
        case 'experience':
          iconText = '💼';
          break;
        case 'education':
          iconText = '🎓';
          break;
        case 'awards':
          iconText = '⭐';
          break;
      }
      
      const text = new PIXI.Text(iconText, {
        fontFamily: 'Arial',
        fontSize: 16,
        fill: 0xFFFFFF,
        align: 'center',
      });
      text.anchor.set(0.5);
      text.x = obj.width / 2;
      text.y = obj.height / 2;
      graphics.addChild(text);
      
      graphics.x = obj.x;
      graphics.y = pixiApp.screen.height - obj.y - obj.height;
      
      pixiApp.stage.addChild(graphics);
      objectsRef.current.push(graphics);
    });
    
    return () => {
      if (pixiApp) {
        objectsRef.current.forEach(obj => {
          pixiApp.stage.removeChild(obj);
        });
        objectsRef.current = [];
      }
    };
  }, [gameObjects, pixiApp]);
  
  // This component no longer renders visible DOM elements
  return null;
};

export default GameObjects;
