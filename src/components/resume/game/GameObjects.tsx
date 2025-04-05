
import React from 'react';
import { Briefcase, GraduationCap, Star } from 'lucide-react';
import { GameObject } from './types';

interface GameObjectsProps {
  gameObjects: GameObject[];
}

const GameObjects: React.FC<GameObjectsProps> = ({ gameObjects }) => {
  // Render game objects based on their type
  const renderGameObject = (obj: GameObject) => {
    const iconSize = 32;
    
    if (obj.collected) return null;
    
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
          transform: `translateX(${obj.x}px)`,
          bottom: '10px'
        }}
      >
        {icon}
      </div>
    );
  };

  return (
    <>
      {gameObjects.map(renderGameObject)}
    </>
  );
};

export default GameObjects;
