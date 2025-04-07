import React, { useEffect, useRef } from 'react';

const StaticNoiseBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const scale = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * scale;
      canvas.height = window.innerHeight * scale;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(scale, scale);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create pixel positions for static
    const pixelSize = 3; // Size of each static dot
    const maxDots = 400; // Maximum number of dots at any time
    let dots: { x: number; y: number; life: number; intensity: number }[] = [];

    // Animation function
    const animate = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Remove dead dots
      dots = dots.filter(dot => dot.life > 0);

      // Add new dots if we're below max
      while (dots.length < maxDots) {
        dots.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          life: Math.random() * 10 + 5, // Random life between 5-15 frames
          intensity: Math.random() * 0.4 + 0.1 // Random intensity between 0.1-0.5
        });
      }

      // Draw and update dots
      ctx.fillStyle = '#4AFF91'; // Terminal green color
      dots.forEach(dot => {
        // Draw dot with its current intensity
        ctx.globalAlpha = dot.intensity;
        ctx.fillRect(dot.x, dot.y, pixelSize, pixelSize);
        
        // Decrease life and randomly adjust intensity
        dot.life--;
        if (Math.random() < 0.1) { // 10% chance to flicker
          dot.intensity = Math.random() * 0.4 + 0.1;
        }
      });

      // Reset global alpha
      ctx.globalAlpha = 1;

      requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 1,
        mixBlendMode: 'screen',
        opacity: 0.6
      }}
    />
  );
};

export default StaticNoiseBackground; 