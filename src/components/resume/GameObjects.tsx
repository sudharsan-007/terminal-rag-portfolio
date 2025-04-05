
import React from 'react';
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
}

const GameObjects: React.FC<GameObjectsProps> = ({ gameObjects, platforms }) => {
  // Render game objects (collectibles)
  const renderGameObject = (obj: GameObject) => {
    if (obj.collected) return null;
    
    const iconSize = 32;
    let icon;
    let colorClass = '';
    
    switch (obj.type) {
      case 'experience':
        icon = <Briefcase size={iconSize} />;
        colorClass = 'text-blue-500';
        break;
      case 'education':
        icon = <GraduationCap size={iconSize} />;
        colorClass = 'text-green-500';
        break;
      case 'awards':
        icon = <Star size={iconSize} />;
        colorClass = 'text-yellow-500';
        break;
    }
    
    return (
      <div 
        key={obj.id}
        className={`absolute ${colorClass}`}
        style={{
          transform: `translate(${obj.x}px, ${obj.y}px)`,
          width: `${obj.width}px`,
          height: `${obj.height}px`
        }}
      >
        {icon}
      </div>
    );
  };

  // Render platforms
  const renderPlatform = (platform: Platform, index: number) => {
    let bgColor = 'bg-terminal-text/50';
    if (platform.type === 'obstacle') {
      bgColor = 'bg-red-500/70';
    } else if (platform.type === 'exit') {
      bgColor = 'bg-green-500/70';
    }

    return (
      <div
        key={`platform-${index}`}
        className={`absolute ${bgColor}`}
        style={{
          left: `${platform.x}px`,
          bottom: `${platform.y}px`,
          width: `${platform.width}px`,
          height: `${platform.height}px`
        }}
      >
        {platform.type === 'exit' && (
          <div className="absolute inset-0 flex items-center justify-center text-black font-bold">
            EXIT
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {platforms.map((platform, index) => renderPlatform(platform, index))}
      {gameObjects.map(renderGameObject)}
    </>
  );
};

export default GameObjects;
