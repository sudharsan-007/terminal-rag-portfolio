import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

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
      resolution: Math.min(2, window.devicePixelRatio), // Cap at 2x for performance
      autoDensity: true
    });
    
    // Add the canvas to the DOM
    containerRef.current.appendChild(app.view as HTMLCanvasElement);
    pixiAppRef.current = app;
    
    // Create a container for our static dots
    const dotsContainer = new PIXI.Container();
    app.stage.addChild(dotsContainer);
    
    // Configuration for the static effect
    const config = {
      maxDots: 100, // Reduced from 300 for better performance
      dotColor: 0x4AFF91, // Terminal green color
      maxOpacity: 0.7,
      minOpacity: 0.3,
      maxLifetime: 15,
      minLifetime: 5,
      flickerProbability: 0.1, // 10% chance to flicker each update
      updateInterval: 2 // Update every 2 frames for performance
    };
    
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
      if (frameCount % config.updateInterval === 0) {
        // Remove expired dots
        for (let i = dots.length - 1; i >= 0; i--) {
          const dot = dots[i];
          dot.life--;
          
          if (dot.life <= 0) {
            dotsContainer.removeChild(dot.sprite);
            dots.splice(i, 1);
          } else {
            // Random flicker
            if (Math.random() < config.flickerProbability) {
              dot.sprite.alpha = config.minOpacity + Math.random() * (config.maxOpacity - config.minOpacity);
            }
          }
        }
        
        // Add new dots if needed
        while (dots.length < config.maxDots) {
          // Create a new dot
          const dot = new PIXI.Graphics();
          dot.beginFill(config.dotColor);
          dot.drawRect(0, 0, 1, 1); // Single pixel
          dot.endFill();
          
          // Position randomly on screen
          dot.x = Math.random() * app.screen.width;
          dot.y = Math.random() * app.screen.height;
          
          // Set initial opacity
          dot.alpha = config.minOpacity + Math.random() * (config.maxOpacity - config.minOpacity);
          
          // Add to container
          dotsContainer.addChild(dot);
          
          // Track the dot
          const lifetime = Math.floor(config.minLifetime + Math.random() * (config.maxLifetime - config.minLifetime));
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