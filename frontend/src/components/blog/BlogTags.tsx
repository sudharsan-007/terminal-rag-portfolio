
import React from 'react';

interface BlogTagsProps {
  tags: string[];
}

const BlogTags: React.FC<BlogTagsProps> = ({ tags }) => {
  if (!tags.length) return null;
  
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span 
          key={tag} 
          className="text-xs px-2 py-1 rounded bg-terminal-text/10 text-terminal-text"
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

export default BlogTags;
