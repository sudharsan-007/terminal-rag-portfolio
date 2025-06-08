import React from 'react';
import { useNavigate } from 'react-router-dom';
import BlogCard from './BlogCard';
import { BlogPost } from '@/types/blog';
import { useIsMobile } from '@/hooks/use-mobile';

interface BlogListProps {
  posts: BlogPost[];
  viewMode: 'grid' | 'list';
  selectedPostIndex: number;
  setSelectedPostIndex: (index: number) => void;
  isMobile?: boolean;
}

const BlogList: React.FC<BlogListProps> = ({ 
  posts, 
  viewMode, 
  selectedPostIndex, 
  setSelectedPostIndex,
  isMobile = false
}) => {
  const navigate = useNavigate();

  const handleBlogClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  if (posts.length === 0) {
    return (
      <div className={`${isMobile ? 'p-3' : 'p-6'} text-center`}>
        <p className={`${isMobile ? 'text-sm' : 'text-base'} text-terminal-text`}>No posts found matching your search.</p>
      </div>
    );
  }

  // Handle card selection and navigation
  const handleCardSelect = (index: number) => {
    setSelectedPostIndex(index);
    // Navigate to blog post when clicked
    handleBlogClick(posts[index].slug);
  };

  return (
    <>
      {viewMode === 'grid' && !isMobile ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <div 
              key={post.id} 
              id={`blog-post-${index}`}
              onClick={() => handleCardSelect(index)}
              className="cursor-pointer"
            >
              <BlogCard 
                post={post} 
                viewMode="grid" 
                isSelected={selectedPostIndex === index}
                onClick={() => handleCardSelect(index)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className={`flex flex-col ${isMobile ? 'gap-2' : 'gap-4'}`}>
          {posts.map((post, index) => (
            <div 
              key={post.id} 
              id={`blog-post-${index}`}
              onClick={() => handleCardSelect(index)}
              className="cursor-pointer"
            >
              <BlogCard 
                post={post} 
                viewMode="list" 
                isSelected={selectedPostIndex === index}
                onClick={() => handleCardSelect(index)}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default BlogList;
