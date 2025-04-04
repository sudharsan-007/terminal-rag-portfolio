
import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface ViewModeToggleProps {
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ viewMode, setViewMode }) => {
  return (
    <div className="flex items-center gap-2">
      {/* Text Label First */}
      <div className="bg-terminal-text/20 px-2 py-1 rounded text-xs flex items-center gap-1">
        <span>{viewMode === 'grid' ? 'Grid View' : 'List View'}</span>
        <span className="font-mono">(V)</span>
      </div>
      
      {/* Toggle Icons */}
      <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'grid' | 'list')}>
        <ToggleGroupItem value="grid" aria-label="Grid view">
          <LayoutGrid size={18} />
        </ToggleGroupItem>
        <ToggleGroupItem value="list" aria-label="List view">
          <List size={18} />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default ViewModeToggle;
