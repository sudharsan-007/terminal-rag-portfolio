
import React, { useState, useRef, useCallback, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { skillsData } from '@/data/skillsData';
import { SkillNode, SkillLink } from '@/types/skill';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

const SkillsNetwork: React.FC = () => {
  const graphRef = useRef<any>();
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [status, setStatus] = useState<string>("Hover over nodes to see skills");

  // Group colors mapping
  const groupColors: Record<string, string> = {
    'Languages': '#4aff91',
    'Libraries': '#9b87f5',
    'Tools': '#33C3F0',
    'Hardware': '#F97316',
    'Protocols': '#D946EF',
    'SoftSkills': '#FEC6A1',
    'Interests': '#D3E4FD'
  };

  const resetView = useCallback(() => {
    setSelectedNode(null);
    setStatus("Hover over nodes to see skills");
    graphRef.current?.zoomToFit(400, 50);
  }, []);

  // Handle background click to exit selected view
  const handleBackgroundClick = useCallback((event: React.MouseEvent) => {
    // Only reset if clicking directly on the graph container (not on nodes or UI elements)
    if (event.target === graphContainerRef.current) {
      resetView();
    }
  }, [resetView]);

  // Add keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Reset view on Escape key
      if (event.key === 'Escape') {
        resetView();
      }
      
      // Reset view on Ctrl+R
      if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault(); // Prevent browser refresh
        resetView();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [resetView]);

  const handleNodeClick = useCallback((node: SkillNode) => {
    if (selectedNode?.id === node.id) {
      resetView();
      return;
    }

    setSelectedNode(node);
    setStatus(`Selected: ${node.name}`);
    
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
  }, [selectedNode, resetView]);

  const getNodeColor = useCallback((node: SkillNode) => {
    if (selectedNode) {
      // If a node is selected, highlight it and connected nodes
      if (selectedNode.id === node.id) return '#ffffff';
      
      // Check if this node is connected to the selected node
      const isConnected = skillsData.links.some(link => 
        (link.source === selectedNode.id && link.target === node.id) || 
        (link.source === node.id && link.target === selectedNode.id)
      );
      
      if (isConnected) return node.color || getGroupColor(node.group);
      return '#8E9196'; // Gray out unrelated nodes
    }
    
    return node.color || getGroupColor(node.group);
  }, [selectedNode]);
  
  const getGroupColor = (group: string) => {
    return groupColors[group] || '#8E9196';
  };

  const getNodeRadius = useCallback((node: SkillNode) => {
    const baseSize = isMobile ? 4 : 6;
    // Make selected node bigger
    if (selectedNode?.id === node.id) {
      return (node.radius || (baseSize + node.level)) * 1.5;
    }
    return node.radius || (baseSize + node.level);
  }, [isMobile, selectedNode]);

  const getLinkColor = useCallback((link: SkillLink) => {
    if (!selectedNode) return '#666';
    
    // Handle the case when source or target might be objects instead of strings
    const sourceId = typeof link.source === 'object' 
      ? (link.source?.id ?? '') 
      : (link.source ?? '');
    
    const targetId = typeof link.target === 'object' 
      ? (link.target?.id ?? '') 
      : (link.target ?? '');
    
    if (sourceId === selectedNode.id || targetId === selectedNode.id) {
      return '#ffffff';
    }
    return '#666';
  }, [selectedNode]);

  const getLinkWidth = useCallback((link: SkillLink) => {
    if (!selectedNode) return 1;
    
    // Handle the case when source or target might be objects instead of strings
    const sourceId = typeof link.source === 'object' 
      ? (link.source?.id ?? '') 
      : (link.source ?? '');
    
    const targetId = typeof link.target === 'object' 
      ? (link.target?.id ?? '') 
      : (link.target ?? '');
    
    if (sourceId === selectedNode.id || targetId === selectedNode.id) {
      return 2;
    }
    return 0.5; // Thinner lines for unrelated connections
  }, [selectedNode]);

  return (
    <div 
      ref={graphContainerRef}
      className="w-full h-full relative" 
      onClick={handleBackgroundClick}
    >
      {/* Status header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-terminal-navy/90 p-2 flex justify-between items-center">
        <div className="text-terminal-text text-sm">{status}</div>
        <div className="flex items-center space-x-2 text-xs text-terminal-text">
          <span>Press <kbd className="px-1 py-0.5 bg-terminal-text/20 rounded">Esc</kbd> or <kbd className="px-1 py-0.5 bg-terminal-text/20 rounded">Ctrl+R</kbd> to reset</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetView} 
            className="text-xs"
          >
            Reset View
          </Button>
        </div>
      </div>
      
      {/* Group labels/legend */}
      <div className="absolute top-12 right-4 z-10 bg-terminal-navy/80 p-2 rounded border border-terminal-text">
        <div className="text-xs font-bold mb-1 text-terminal-text">Skill Groups</div>
        {Object.entries(groupColors).map(([group, color]) => (
          <div key={group} className="flex items-center mb-1 last:mb-0">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: color }}
            ></div>
            <span className="text-terminal-text text-xs">{group}</span>
          </div>
        ))}
      </div>

      <ForceGraph2D
        ref={graphRef}
        graphData={skillsData}
        nodeRelSize={1}
        nodeVal={(node: SkillNode) => getNodeRadius(node)}
        nodeColor={(node: SkillNode) => getNodeColor(node)}
        nodeLabel={(node: SkillNode) => `${node.name} (${node.group})`}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={1.5}
        linkWidth={getLinkWidth}
        linkColor={getLinkColor}
        onNodeClick={handleNodeClick}
        cooldownTicks={100}
        onEngineStop={() => graphRef.current?.zoomToFit(400, 50)}
        linkDirectionalParticleSpeed={0.01}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 12/globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

          // Draw node
          ctx.beginPath();
          ctx.fillStyle = getNodeColor(node as SkillNode);
          ctx.arc(node.x || 0, node.y || 0, getNodeRadius(node as SkillNode), 0, 2 * Math.PI);
          ctx.fill();
          
          // Draw text only if we're zoomed in enough or if it's the selected node
          if (globalScale > 0.8 || selectedNode?.id === node.id) {
            // Text background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(
              (node.x || 0) - bckgDimensions[0] / 2,
              (node.y || 0) + getNodeRadius(node as SkillNode) + 2,
              bckgDimensions[0],
              bckgDimensions[1]
            );
            
            // Text
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = selectedNode?.id === node.id ? '#ffffff' : '#efefef';
            ctx.fillText(
              label,
              node.x || 0,
              (node.y || 0) + getNodeRadius(node as SkillNode) + fontSize/2 + 4
            );
          }
        }}
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
