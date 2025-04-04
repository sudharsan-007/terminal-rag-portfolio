
import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface ViewModeToggleProps {
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ viewMode, setViewMode }) => {
  return (
    <div className="h-10 px-4 border border-terminal-text text-terminal-text rounded hover:bg-terminal-text/10 flex items-center gap-2 whitespace-nowrap">
      <span>{viewMode === 'grid' ? 'Grid' : 'List'} View</span>
      <span className="font-mono">(V)</span>
      
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
