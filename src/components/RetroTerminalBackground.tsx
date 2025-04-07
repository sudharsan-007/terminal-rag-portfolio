
import React, { useState, useEffect } from 'react';

const RetroTerminalBackground: React.FC = () => {
  const [staticNoise, setStaticNoise] = useState<Array<{
    id: number;
    left: string;
    top: string;
    size: string;
    opacity: number;
    flickerSpeed: string;
  }>>([]);
  const [glitchActive, setGlitchActive] = useState(false);
  const [tvStaticLines, setTvStaticLines] = useState<Array<{
    id: number;
    top: string;
    height: string;
    opacity: number;
    speed: number;
  }>>([]);

  // Generate static noise effect
  useEffect(() => {
    const generateStaticNoise = () => {
      const noise = [];
      const noiseCount = 150; // Number of static dots
      
      for (let i = 0; i < noiseCount; i++) {
        const flickerSpeed = Math.random() > 0.7 ? 'fast' : Math.random() > 0.5 ? 'medium' : 'slow';
        
        noise.push({
          id: i,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          size: `${Math.random() * 2 + 0.5}px`,
          opacity: Math.random() * 0.3,
          flickerSpeed
        });
      }
      
      setStaticNoise(noise);
    };

    // Initial generation
    generateStaticNoise();
    
    // Different intervals for different flicker speeds
    const fastNoiseInterval = setInterval(() => {
      setStaticNoise(prevNoise => {
        return prevNoise.map(dot => {
          if (dot.flickerSpeed === 'fast') {
            return {
              ...dot,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3
            };
          }
          return dot;
        });
      });
    }, 80);
    
    const mediumNoiseInterval = setInterval(() => {
      setStaticNoise(prevNoise => {
        return prevNoise.map(dot => {
          if (dot.flickerSpeed === 'medium') {
            return {
              ...dot,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3
            };
          }
          return dot;
        });
      });
    }, 150);
    
    const slowNoiseInterval = setInterval(() => {
      setStaticNoise(prevNoise => {
        return prevNoise.map(dot => {
          if (dot.flickerSpeed === 'slow') {
            return {
              ...dot,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3
            };
          }
          return dot;
        });
      });
    }, 300);
    
    // Occasional screen glitch effect
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 5000);
    
    // Generate TV static lines
    const generateTvStaticLines = () => {
      const lines = [];
      const lineCount = Math.floor(Math.random() * 4) + 2;
      
      for (let i = 0; i < lineCount; i++) {
        lines.push({
          id: i,
          top: `${Math.random() * 100}%`,
          height: `${Math.random() * 4 + 1}px`,
          opacity: Math.random() * 0.5 + 0.2,
          speed: Math.random() * 150 + 100
        });
      }
      
      setTvStaticLines(lines);
    };
    
    // Generate TV static lines occasionally
    const tvStaticInterval = setInterval(() => {
      generateTvStaticLines();
      
      setTimeout(() => {
        setTvStaticLines([]);
      }, 200);
    }, 2000);
    
    return () => {
      clearInterval(fastNoiseInterval);
      clearInterval(mediumNoiseInterval);
      clearInterval(slowNoiseInterval);
      clearInterval(glitchInterval);
      clearInterval(tvStaticInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden" style={{ zIndex: -10 }}>
      {/* Static noise overlay */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: -9 }}>
        {staticNoise.map(noise => (
          <div 
            key={noise.id}
            className="absolute bg-terminal-text rounded-full"
            style={{
              left: noise.left,
              top: noise.top,
              width: noise.size,
              height: noise.size,
              opacity: noise.opacity
            }}
          />
        ))}
      </div>
      
      {/* Scan lines effect */}
      <div 
        className="absolute inset-0" 
        style={{ 
          backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.05) 50%)', 
          backgroundSize: '100% 4px',
          opacity: 0.2,
          zIndex: -8
        }} 
      />
      
      {/* Random TV static lines */}
      {tvStaticLines.map(line => (
        <div 
          key={line.id}
          className="absolute left-0 right-0 bg-terminal-text"
          style={{
            top: line.top,
            height: line.height,
            opacity: line.opacity,
            zIndex: -7,
            animation: `moveStaticLine ${line.speed}ms linear`
          }}
        />
      ))}
      
      {/* Screen glow */}
      <div 
        className={`absolute inset-0 bg-terminal-text opacity-[0.02] ${glitchActive ? 'translate-x-1' : ''}`} 
        style={{ zIndex: -6 }} 
      />
      
      {/* Animation styling */}
      <style>
        {`
          @keyframes moveStaticLine {
            from { transform: translateX(-100%); }
            to { transform: translateX(100%); }
          }
        `}
      </style>
    </div>
  );
};

export default RetroTerminalBackground;
