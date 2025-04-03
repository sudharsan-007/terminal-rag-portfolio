
import React, { useState, useRef, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { skillsData } from '@/data/skillsData';
import { SkillNode } from '@/types/skill';
import { useIsMobile } from '@/hooks/use-mobile';

const SkillsNetwork: React.FC = () => {
  const graphRef = useRef<any>();
  const isMobile = useIsMobile();
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);

  const handleNodeClick = useCallback((node: SkillNode) => {
    setSelectedNode(prevNode => prevNode?.id === node.id ? null : node);
    
    // Aim at node from outside
    const distance = 200;
    const distRatio = 1 + distance/Math.hypot(node.x || 0, node.y || 0);

    if (graphRef.current) {
      graphRef.current.centerAt(
        (node.x || 0) * distRatio, 
        (node.y || 0) * distRatio, 
        1000
      );
      graphRef.current.zoom(2, 1000);
    }
  }, []);

  const getNodeColor = useCallback((node: SkillNode) => {
    if (selectedNode?.id === node.id) return '#ffffff';
    return node.color || getGroupColor(node.group);
  }, [selectedNode]);
  
  const getGroupColor = (group: string) => {
    switch(group) {
      case 'Languages': return '#4aff91';
      case 'Libraries': return '#9b87f5';
      case 'Tools': return '#33C3F0';
      case 'Hardware': return '#F97316';
      case 'Protocols': return '#D946EF';
      case 'SoftSkills': return '#FEC6A1';
      case 'Interests': return '#D3E4FD';
      default: return '#8E9196';
    }
  };

  const getNodeRadius = useCallback((node: SkillNode) => {
    const baseSize = isMobile ? 4 : 6;
    return node.radius || (baseSize + node.level);
  }, [isMobile]);

  return (
    <div className="w-full h-full relative">
      <ForceGraph2D
        ref={graphRef}
        graphData={skillsData}
        nodeRelSize={1}
        nodeVal={(node: SkillNode) => getNodeRadius(node)}
        nodeColor={(node: SkillNode) => getNodeColor(node)}
        nodeLabel={(node: SkillNode) => node.name}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={1.5}
        linkWidth={(link) => (link.source === selectedNode?.id || link.target === selectedNode?.id) ? 2 : 1}
        linkColor={(link) => (link.source === selectedNode?.id || link.target === selectedNode?.id) ? '#ffffff' : '#666'}
        onNodeClick={handleNodeClick}
        cooldownTicks={100}
        onEngineStop={() => graphRef.current?.zoomToFit(400, 50)}
        linkDirectionalParticleSpeed={0.01}
      />

      {selectedNode && (
        <div className="absolute bottom-4 left-4 right-4 md:w-1/3 md:left-4 md:right-auto bg-terminal-navy/90 border border-terminal-text p-4 rounded-lg backdrop-blur-sm shadow-lg">
          <h2 className="text-lg text-terminal-accent1 font-bold mb-2">
            {selectedNode.name}
          </h2>
          <div className="flex items-center mb-2">
            <span className="text-xs text-terminal-text mr-2">Group:</span>
            <span 
              className="text-xs px-2 py-1 rounded-full" 
              style={{ backgroundColor: getGroupColor(selectedNode.group) }}
            >
              {selectedNode.group}
            </span>
          </div>
          <div className="mb-2">
            <div className="text-xs text-terminal-text mb-1">Proficiency:</div>
            <div className="w-full bg-terminal-text/20 rounded-full h-2">
              <div 
                className="bg-terminal-accent1 h-2 rounded-full" 
                style={{ width: `${(selectedNode.level / 10) * 100}%` }}
              ></div>
            </div>
          </div>
          <p className="text-sm text-terminal-text">{selectedNode.description}</p>
          
          <button 
            onClick={() => setSelectedNode(null)} 
            className="absolute top-2 right-2 text-terminal-text hover:text-terminal-accent1"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default SkillsNetwork;
