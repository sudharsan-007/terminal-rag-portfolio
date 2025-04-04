
import React, { RefObject } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
  return (
    <div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-terminal-text/50" size={18} />
        <Input
          ref={searchInputRef}
          type="text"
          placeholder="Search by title, content, or tags... (Press '/' to focus)"
          className="terminal-input pl-10 border border-terminal-text/30 rounded-md w-full bg-terminal-navy/30"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="text-sm text-terminal-text/70 mt-2">
        <span>{filteredPostsCount} {filteredPostsCount === 1 ? 'post' : 'posts'} found</span>
      </div>
    </div>
  );
};

export default BlogSearch;
