import React, { RefObject } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';

interface BlogSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchInputRef: RefObject<HTMLInputElement>;
  filteredPostsCount: number;
}

const BlogSearch: React.FC<BlogSearchProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  searchInputRef,
  filteredPostsCount
}) => {
  const isMobile = useIsMobile();

  return (
    <div>
      <div className="relative">
        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-terminal-text/50" 
          size={isMobile ? 14 : 18} 
        />
        <Input
          ref={searchInputRef}
          type="text"
          placeholder={isMobile ? "Search posts..." : "Search by title, content, or tags... (Press '/' to focus)"}
          className={`terminal-input ${isMobile ? 'h-8 text-sm pl-8' : 'h-10 pl-10'} border border-terminal-text/30 rounded-md w-full bg-terminal-navy/30`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-terminal-text/70 mt-1`}>
        <span>{filteredPostsCount} {filteredPostsCount === 1 ? 'post' : 'posts'} found</span>
      </div>
    </div>
  );
};

export default BlogSearch;
