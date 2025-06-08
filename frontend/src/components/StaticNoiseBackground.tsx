import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

// Configuration for the CRT static noise effect
// All parameters can be easily modified here
const STATIC_NOISE_CONFIG = {
  // Number of dots on screen at once
  MAX_DOTS: 100,
  
  // Dot appearance
  DOT_COLOR: 0x4AFF91, // Terminal green color
  MIN_DOT_SIZE: 2,     // Minimum dot size in pixels
  MAX_DOT_SIZE: 4,     // Maximum dot size in pixels
  MIN_OPACITY: 0.3,    // Minimum opacity
  MAX_OPACITY: 0.7,    // Maximum opacity
  
  // Dot behavior
  MIN_LIFETIME: 5,     // Minimum frames a dot stays visible
  MAX_LIFETIME: 10,    // Maximum frames a dot stays visible
  FLICKER_PROBABILITY: 0.2, // Chance of flicker per update
  
  // Performance settings
  UPDATE_INTERVAL: 3, // Update every N frames (higher = better performance)
  MAX_RESOLUTION: 2,  // Maximum resolution multiplier (1-2)
};

const StaticNoiseBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pixiAppRef = useRef<PIXI.Application | null>(null);
  
  useEffect(() => {
    if (!containerRef.current || pixiAppRef.current) return;
    
    // Create a new PIXI application with transparent background
    const app = new PIXI.Application({
      resizeTo: window,
      backgroundAlpha: 0,
      antialias: false,
      resolution: Math.min(STATIC_NOISE_CONFIG.MAX_RESOLUTION, window.devicePixelRatio),
      autoDensity: true
    });
    
    // Add the canvas to the DOM
    containerRef.current.appendChild(app.view as HTMLCanvasElement);
    pixiAppRef.current = app;
    
    // Create a container for our static dots
    const dotsContainer = new PIXI.Container();
    app.stage.addChild(dotsContainer);
    
    // Create dots array to track our dots
    const dots: {
      sprite: PIXI.Graphics;
      life: number;
      maxLife: number;
    }[] = [];
    
    let frameCount = 0;
    
    // Main update function
    const update = () => {
      frameCount++;
      
      // Only update static on specific frames for performance
      if (frameCount % STATIC_NOISE_CONFIG.UPDATE_INTERVAL === 0) {
        // Remove expired dots
        for (let i = dots.length - 1; i >= 0; i--) {
          const dot = dots[i];
          dot.life--;
          
          if (dot.life <= 0) {
            dotsContainer.removeChild(dot.sprite);
            dots.splice(i, 1);
          } else {
            // Random flicker
            if (Math.random() < STATIC_NOISE_CONFIG.FLICKER_PROBABILITY) {
              dot.sprite.alpha = STATIC_NOISE_CONFIG.MIN_OPACITY + 
                Math.random() * (STATIC_NOISE_CONFIG.MAX_OPACITY - STATIC_NOISE_CONFIG.MIN_OPACITY);
            }
          }
        }
        
        // Add new dots if needed
        while (dots.length < STATIC_NOISE_CONFIG.MAX_DOTS) {
          // Create a new dot with random size
          const dot = new PIXI.Graphics();
          const dotSize = STATIC_NOISE_CONFIG.MIN_DOT_SIZE + 
            Math.random() * (STATIC_NOISE_CONFIG.MAX_DOT_SIZE - STATIC_NOISE_CONFIG.MIN_DOT_SIZE);
          
          dot.beginFill(STATIC_NOISE_CONFIG.DOT_COLOR);
          dot.drawRect(0, 0, dotSize, dotSize);
          dot.endFill();
          
          // Position randomly on screen
          dot.x = Math.random() * app.screen.width;
          dot.y = Math.random() * app.screen.height;
          
          // Set initial opacity
          dot.alpha = STATIC_NOISE_CONFIG.MIN_OPACITY + 
            Math.random() * (STATIC_NOISE_CONFIG.MAX_OPACITY - STATIC_NOISE_CONFIG.MIN_OPACITY);
          
          // Add to container
          dotsContainer.addChild(dot);
          
          // Track the dot
          const lifetime = Math.floor(STATIC_NOISE_CONFIG.MIN_LIFETIME + 
            Math.random() * (STATIC_NOISE_CONFIG.MAX_LIFETIME - STATIC_NOISE_CONFIG.MIN_LIFETIME));
          
          dots.push({
            sprite: dot,
            life: lifetime,
            maxLife: lifetime
          });
        }
      }
    };
    
    // Add the update function to the ticker
    app.ticker.add(update);
    
    // Handle window resize
    const handleResize = () => {
      if (pixiAppRef.current) {
        pixiAppRef.current.renderer.resize(window.innerWidth, window.innerHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (pixiAppRef.current) {
        pixiAppRef.current.ticker.remove(update);
        pixiAppRef.current.destroy(true);
        pixiAppRef.current = null;
      }
    };
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default StaticNoiseBackground; 