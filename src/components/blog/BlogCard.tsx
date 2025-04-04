
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import BlogTags from './BlogTags';

interface BlogCardProps {
  post: BlogPost;
  viewMode: 'grid' | 'list';
}

const BlogCard: React.FC<BlogCardProps> = ({ post, viewMode }) => {
  if (viewMode === 'list') {
    return (
      <Card className="terminal-window hover:border-terminal-accent1 transition-colors duration-300">
        <div className="flex flex-col md:flex-row">
          {post.coverImage && (
            <div className="md:w-1/4 h-[180px] md:h-full">
              <img 
                src={post.coverImage} 
                alt={post.title}
                className="h-full w-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
              />
            </div>
          )}
          
          <div className={`flex flex-col ${post.coverImage ? 'md:w-3/4' : 'w-full'}`}>
            <CardHeader className="pb-2">
              <Link to={`/blog/${post.slug}`} className="text-terminal-text hover:text-terminal-accent1">
                <h2 className="text-xl font-bold tracking-tight">{post.title}</h2>
              </Link>
            </CardHeader>
            
            <CardContent className="py-2 flex-grow">
              <p className="text-terminal-text/90 mb-3">{post.excerpt}</p>
              <BlogTags tags={post.tags.slice(0, 3)} />
            </CardContent>
            
            <CardFooter className="py-2 border-t border-terminal-text/20 flex justify-between">
              <div className="flex items-center gap-1 text-xs text-terminal-text/70">
                <Calendar size={14} />
                <span>{post.date}</span>
              </div>
              
              {post.readingTime && (
                <div className="flex items-center gap-1 text-xs text-terminal-text/70">
                  <Clock size={14} />
                  <span>{post.readingTime} min read</span>
                </div>
              )}
            </CardFooter>
          </div>
        </div>
      </Card>
    );
  }
  
  // Grid view
  return (
    <Card className="terminal-window h-full flex flex-col hover:border-terminal-accent1 transition-colors duration-300">
      {post.coverImage && (
        <div className="h-40 w-full">
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="h-full w-full object-cover rounded-t-lg"
          />
        </div>
      )}
      
      <CardHeader className="pb-2">
        <Link to={`/blog/${post.slug}`} className="text-terminal-text hover:text-terminal-accent1">
          <h2 className="text-xl font-bold tracking-tight">{post.title}</h2>
        </Link>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        <p className="text-terminal-text/90 mb-3">{post.excerpt}</p>
        <BlogTags tags={post.tags.slice(0, 3)} />
      </CardContent>
      
      <CardFooter className="flex justify-between text-xs text-terminal-text/70 pt-2 border-t border-terminal-text/20">
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          <span>{post.date}</span>
        </div>
        
        {post.readingTime && (
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{post.readingTime} min read</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
