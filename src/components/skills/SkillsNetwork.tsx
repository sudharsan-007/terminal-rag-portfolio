
import React, { useRef, useState, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { skillsData } from '@/data/skillsData';
import { SkillNode } from '@/types/skill';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

const SkillsNetwork: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const [width, setWidth] = useState(1000);
  const [height, setHeight] = useState(600);
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const isMobile = useIsMobile();

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.clientWidth);
        setHeight(containerRef.current.clientHeight);
      }
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter to display only nodes from selectedNode's group when a node is selected
  const handleNodeClick = (node: SkillNode) => {
    setSelectedNode(node);
    if (graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 1000);
      graphRef.current.zoom(3, 1000);
    }
  };

  // Reset view when clicking background
  const handleBackgroundClick = () => {
    setSelectedNode(null);
    if (graphRef.current) {
      graphRef.current.zoomToFit(1000);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full flex flex-col"
    >
      {/* Skill info card shown when a node is clicked */}
      {selectedNode && (
        <div className="absolute right-8 top-8 z-10 w-64 animate-fade-in">
          <Card className="border-terminal-text">
            <CardHeader className="pb-2">
              <CardTitle className="text-terminal-text">{selectedNode.name}</CardTitle>
              <CardDescription>
                {selectedNode.group} • Level: {selectedNode.level}/5
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-terminal-secondary">{selectedNode.description}</p>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Info text */}
      <div className="mb-2 text-terminal-text/70">
        {selectedNode ? (
          <p>Showing: {selectedNode.name} and connected skills. Click background to reset view.</p>
        ) : (
          <p>Click on a skill node to see details and focus on connected skills.</p>
        )}
      </div>
      
      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-4">
        {['Programming', 'Libraries', 'Tools', 'Protocols', 'Personal', 'Interests'].map((group) => {
          const node = skillsData.nodes.find(n => n.group === group);
          return (
            <div key={group} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: node?.color || '#4AFF91' }}
              />
              <span className="text-xs text-terminal-secondary">{group}</span>
            </div>
          );
        })}
      </div>
      
      {/* Force Graph */}
      <div className="flex-grow overflow-hidden">
        <ForceGraph2D
          ref={graphRef}
          width={width}
          height={height - 60} // Adjust for legend and info text
          graphData={skillsData}
          nodeId="id"
          nodeLabel="name"
          nodeColor="color"
          nodeVal="radius"
          linkWidth={(link) => (link.source === selectedNode?.id || link.target === selectedNode?.id) ? 2 : 1}
          linkColor={() => "rgba(74, 255, 145, 0.3)"}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const { x, y, name, color, radius } = node as any;
            const fontSize = 12 / globalScale;
            const isSelected = selectedNode?.id === node.id;
            const isHighlighted = !selectedNode || 
                                 selectedNode.id === node.id || 
                                 skillsData.links.some(
                                   link => 
                                     (link.source === selectedNode.id && link.target === node.id) || 
                                     (link.target === selectedNode.id && link.source === node.id)
                                 );
            
            // Node circle
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = isHighlighted ? color : 'rgba(128, 128, 128, 0.2)';
            ctx.fill();
            
            if (isSelected) {
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 2 / globalScale;
              ctx.stroke();
            }
            
            // Node label (only for highlighted nodes or when zoomed in)
            if (isHighlighted || globalScale > 0.7) {
              ctx.font = `${fontSize}px JetBrains Mono`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = isSelected ? '#ffffff' : '#d0d0d0';
              ctx.fillText(name, x, y + radius + fontSize);
            }
          }}
          onNodeClick={handleNodeClick}
          onBackgroundClick={handleBackgroundClick}
          cooldownTicks={100}
          d3VelocityDecay={0.1}
          warmupTicks={50}
          enableZoomInteraction={true}
        />
      </div>
    </div>
  );
};

export default SkillsNetwork;
