
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BlogCard from './BlogCard';
import { BlogPost } from '@/types/blog';

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
      <div className="p-6 text-center">
        <p className="text-terminal-text">No posts found matching your search.</p>
      </div>
    );
  }

  // If on mobile, we disable the selected highlighting and let users tap directly
  const handleCardSelect = (index: number) => {
    if (isMobile) {
      // On mobile, clicking directly navigates to the post
      handleBlogClick(posts[index].slug);
    } else {
      // On desktop, clicking selects the post
      setSelectedPostIndex(index);
    }
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
            >
              <BlogCard 
                post={post} 
                viewMode="grid" 
                isSelected={!isMobile && selectedPostIndex === index}
                onClick={() => isMobile ? handleBlogClick(post.slug) : undefined}
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
              onClick={() => handleCardSelect(index)}
            >
              <BlogCard 
                post={post} 
                viewMode="list" 
                isSelected={!isMobile && selectedPostIndex === index}
                onClick={() => isMobile ? handleBlogClick(post.slug) : undefined}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default BlogList;
