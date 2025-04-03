
import React, { useState, useRef, useCallback, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { skillsData } from '@/data/skillsData';
import { SkillNode, SkillLink, SkillGraph } from '@/types/skill';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

const SkillsNetwork: React.FC = () => {
  const graphRef = useRef<any>();
  const isMobile = useIsMobile();
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [graphData, setGraphData] = useState<SkillGraph>(skillsData);
  const [showingInfo, setShowingInfo] = useState<string | null>(null);

  // Reset the graph data when the component mounts
  useEffect(() => {
    resetView();
  }, []);

  const resetView = useCallback(() => {
    setSelectedNode(null);
    setGraphData({
      nodes: skillsData.nodes.map(node => ({ ...node, highlighted: false })),
      links: [...skillsData.links]
    });
    setShowingInfo(null);
    
    if (graphRef.current) {
      graphRef.current.zoomToFit(400, 50);
    }
  }, []);

  const handleNodeClick = useCallback((node: SkillNode) => {
    // Check if we're clicking on the same node - if so, reset the view
    if (selectedNode?.id === node.id) {
      resetView();
      return;
    }

    setSelectedNode(node);
    setShowingInfo(`${node.name} and connected skills`);
    
    // Find all connected nodes
    const connectedNodeIds = new Set<string>();
    connectedNodeIds.add(node.id);
    
    graphData.links.forEach(link => {
      if (link.source === node.id) connectedNodeIds.add(link.target as string);
      if (link.target === node.id) connectedNodeIds.add(link.source as string);
    });
    
    // Update node highlighting
    setGraphData({
      nodes: graphData.nodes.map(n => ({
        ...n,
        highlighted: connectedNodeIds.has(n.id)
      })),
      links: [...graphData.links]
    });
    
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
  }, [selectedNode, graphData, resetView]);

  const handleBackgroundClick = useCallback(() => {
    resetView();
  }, [resetView]);

  const getNodeColor = useCallback((node: SkillNode) => {
    if (selectedNode) {
      if (!node.highlighted) return '#444444';
      if (node.id === selectedNode.id) return '#ffffff';
    }
    return node.color || getGroupColor(node.group);
  }, [selectedNode]);
  
  const getGroupColor = (group: string) => {
    switch(group) {
      case 'Languages': return '#4aff91'; // Green
      case 'Libraries': return '#9b87f5'; // Purple
      case 'Tools': return '#F97316'; // Orange
      case 'Protocols': return '#33C3F0'; // Blue
      case 'SoftSkills': return '#FEC6A1'; // Yellow-ish
      case 'Interests': return '#D3E4FD'; // Light blue
      default: return '#8E9196'; // Gray
    }
  };

  const getNodeRadius = useCallback((node: SkillNode) => {
    const baseSize = isMobile ? 4 : 6;
    const size = node.radius || (baseSize + node.level);
    
    // Make selected node bigger
    if (selectedNode?.id === node.id) {
      return size * 1.5;
    }
    
    return size;
  }, [isMobile, selectedNode]);

  const getNodeLabel = useCallback((node: SkillNode) => {
    // Always return the node name to show labels for all nodes
    return node.name;
  }, []);

  const getLinkColor = useCallback((link: SkillLink) => {
    if (!selectedNode) return '#666';
    
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
    
    return (sourceId === selectedNode.id || targetId === selectedNode.id) ? '#ffffff' : '#444444';
  }, [selectedNode]);

  const getLinkWidth = useCallback((link: SkillLink) => {
    if (!selectedNode) return 1;
    
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
    
    return (sourceId === selectedNode.id || targetId === selectedNode.id) ? 2 : 0.5;
  }, [selectedNode]);

  return (
    <div className="w-full h-full relative">
      {/* Info header */}
      <div className="absolute top-2 left-4 right-4 z-10 text-terminal-text text-sm md:text-base flex justify-between items-center">
        <div>
          {showingInfo ? (
            <span>Showing: {showingInfo}. Click background to reset view.</span>
          ) : (
            <span>Click on a skill node to explore connections</span>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          onClick={resetView} 
          className="text-xs md:text-sm text-terminal-text hover:text-white"
          size="sm"
        >
          Reset
        </Button>
      </div>
      
      {/* Legend */}
      <div className="absolute top-10 left-4 z-10 bg-terminal-navy/70 p-2 rounded-md text-xs">
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center mr-3 my-1">
            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: getGroupColor('Languages') }}></div>
            <span>Programming</span>
          </div>
          <div className="flex items-center mr-3 my-1">
            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: getGroupColor('Libraries') }}></div>
            <span>Libraries</span>
          </div>
          <div className="flex items-center mr-3 my-1">
            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: getGroupColor('Tools') }}></div>
            <span>Tools</span>
          </div>
          <div className="flex items-center mr-3 my-1">
            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: getGroupColor('Protocols') }}></div>
            <span>Protocols</span>
          </div>
          <div className="flex items-center mr-3 my-1">
            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: getGroupColor('SoftSkills') }}></div>
            <span>Personal</span>
          </div>
          <div className="flex items-center mr-3 my-1">
            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: getGroupColor('Interests') }}></div>
            <span>Interests</span>
          </div>
        </div>
      </div>

      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeRelSize={1}
        nodeVal={(node: SkillNode) => getNodeRadius(node)}
        nodeColor={(node: SkillNode) => getNodeColor(node)}
        nodeLabel={getNodeLabel}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={1.5}
        linkWidth={getLinkWidth}
        linkColor={getLinkColor}
        onNodeClick={handleNodeClick}
        onBackgroundClick={handleBackgroundClick}
        cooldownTicks={100}
        onEngineStop={() => graphRef.current?.zoomToFit(400, 50)}
        linkDirectionalParticleSpeed={0.01}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.name;
          const fontSize = selectedNode?.id === node.id ? 14 : 12;
          const nodeR = getNodeRadius(node);
          
          // Draw circle for the node
          ctx.beginPath();
          ctx.arc(node.x || 0, node.y || 0, nodeR, 0, 2 * Math.PI, false);
          ctx.fillStyle = getNodeColor(node);
          ctx.fill();
          
          // Draw node label (skill name)
          if ((node.highlighted || !selectedNode) && label && globalScale >= 0.8) {
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = selectedNode?.id === node.id ? '#ffffff' : '#ffffff';
            ctx.fillText(label, node.x || 0, (node.y || 0) + nodeR * 2);
          }
        }}
      />

      {selectedNode && (
        <div className="absolute bottom-4 right-4 w-full md:w-1/3 bg-terminal-navy/90 border border-terminal-text p-4 rounded-lg backdrop-blur-sm shadow-lg">
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
            <div className="text-xs text-terminal-text mb-1">Level: {selectedNode.level}/10</div>
            <div className="w-full bg-terminal-text/20 rounded-full h-2">
              <div 
                className="bg-terminal-accent1 h-2 rounded-full" 
                style={{ width: `${(selectedNode.level / 10) * 100}%` }}
              ></div>
            </div>
          </div>
          <p className="text-sm text-terminal-text">{selectedNode.description}</p>
          
          <button 
            onClick={resetView} 
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
