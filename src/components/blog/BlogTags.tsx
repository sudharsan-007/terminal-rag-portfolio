
import React from 'react';
import { Tag } from 'lucide-react';

interface BlogTagsProps {
  tags: string[];
}

const BlogTags: React.FC<BlogTagsProps> = ({ tags }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <div 
          key={tag} 
          className="flex items-center gap-1 py-1 px-2 rounded-md bg-terminal-navy border border-terminal-text/30 text-terminal-text text-xs"
        >
          <Tag size={12} />
          <span>{tag}</span>
        </div>
      ))}
    </div>
  );
};

export default BlogTags;
