
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BlogCard from './BlogCard';
import { BlogPost } from '@/types/blog';

interface BlogListProps {
  posts: BlogPost[];
  viewMode: 'grid' | 'list';
  selectedPostIndex: number;
  setSelectedPostIndex: (index: number) => void;
}

const BlogList: React.FC<BlogListProps> = ({ 
  posts, 
  viewMode, 
  selectedPostIndex, 
  setSelectedPostIndex 
}) => {
  const navigate = useNavigate();

  const handleBlogClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  if (posts.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-terminal-text">No posts found matching your search.</p>
      </div>
    );
  }

  return (
    <>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <div 
              key={post.id} 
              id={`blog-post-${index}`}
              onClick={() => setSelectedPostIndex(index)}
            >
              <BlogCard 
                post={post} 
                viewMode="grid" 
                isSelected={selectedPostIndex === index}
                onClick={() => handleBlogClick(post.slug)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post, index) => (
            <div 
              key={post.id} 
              id={`blog-post-${index}`}
              onClick={() => setSelectedPostIndex(index)}
            >
              <BlogCard 
                post={post} 
                viewMode="list" 
                isSelected={selectedPostIndex === index}
                onClick={() => handleBlogClick(post.slug)}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default BlogList;
