
import React from 'react';
import { Tag } from 'lucide-react';

interface BlogTagsProps {
  tags: string[];
}

const BlogTags: React.FC<BlogTagsProps> = ({ tags }) => {
  if (!tags.length) return null;
  
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <div 
          key={tag} 
          className="flex items-center gap-1 py-0.5 px-2 rounded-md bg-terminal-navy border border-terminal-text/30 text-terminal-text text-xs"
        >
          <Tag size={10} />
          <span>{tag}</span>
        </div>
      ))}
    </div>
  );
};

export default BlogTags;
