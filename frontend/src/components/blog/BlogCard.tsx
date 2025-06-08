import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import BlogTags from './BlogTags';
import { useIsMobile } from '@/hooks/use-mobile';

interface BlogCardProps {
  post: BlogPost;
  viewMode: 'grid' | 'list';
  isSelected?: boolean;
  onClick?: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, viewMode, isSelected = false, onClick }) => {
  const isMobile = useIsMobile();
  
  const cardClassName = `terminal-window hover:border-terminal-accent1 transition-colors duration-300 cursor-pointer ${
    isSelected ? 'bg-terminal-navy border border-terminal-accent1' : 'bg-terminal-navy/60 hover:bg-terminal-navy'
  }`;

  if (isMobile) {
    // Mobile-optimized card
    return (
      <Card className={cardClassName} onClick={onClick}>
        <div className="flex flex-col">
          {post.coverImage && (
            <div className="h-[120px] w-full">
              <img 
                src={post.coverImage} 
                alt={post.title}
                className="h-full w-full object-cover rounded-t-lg"
              />
            </div>
          )}
          <CardHeader className={`py-3 px-4 ${post.coverImage ? 'pt-2' : ''}`}>
            <h2 className="text-md font-bold tracking-tight text-terminal-accent1">
              {isSelected && <span className="text-terminal-accent2">{'> '}</span>}{post.title}
            </h2>
          </CardHeader>
          
          <CardContent className="py-1 px-4 flex-grow">
            <p className="text-terminal-text/90 text-sm mb-2 line-clamp-2">
              {post.excerpt.length > 80 ? `${post.excerpt.substring(0, 80)}...` : post.excerpt}
            </p>
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 2).map((tag, idx) => (
                <span key={idx} className="text-xs px-2 py-0.5 rounded bg-terminal-text/10 text-terminal-text">
                  {tag}
                </span>
              ))}
              {post.tags.length > 2 && (
                <span className="text-xs px-2 py-0.5 rounded bg-terminal-text/10 text-terminal-text">
                  +{post.tags.length - 2}
                </span>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="py-2 px-4 border-t border-terminal-text/20 flex justify-between">
            <div className="flex items-center gap-1 text-xs text-terminal-text/70">
              <Calendar size={12} />
              <span>{post.date}</span>
            </div>
            
            {post.readingTime && (
              <div className="flex items-center gap-1 text-xs text-terminal-text/70">
                <Clock size={12} />
                <span>{post.readingTime} min</span>
              </div>
            )}
          </CardFooter>
        </div>
      </Card>
    );
  }

  if (viewMode === 'list') {
    return (
      <Card className={cardClassName} onClick={onClick}>
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
              <h2 className="text-xl font-bold tracking-tight text-terminal-accent1 hover:text-terminal-accent1">
                {isSelected && <span className="text-terminal-accent2">{'> '}</span>}{post.title}
              </h2>
            </CardHeader>
            
            <CardContent className="py-2 flex-grow">
              <p className="text-terminal-text/90 mb-3">{post.excerpt}</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 rounded bg-terminal-text/10 text-terminal-text">
                    {tag}
                  </span>
                ))}
              </div>
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
    <Card className={`${cardClassName} h-full flex flex-col`} onClick={onClick}>
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
        <h2 className="text-xl font-bold tracking-tight text-terminal-accent1 hover:text-terminal-accent1">
          {isSelected && <span className="text-terminal-accent2">{'> '}</span>}{post.title}
        </h2>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        <p className="text-terminal-text/90 mb-3">{post.excerpt}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="text-xs px-2 py-1 rounded bg-terminal-text/10 text-terminal-text">
              {tag}
            </span>
          ))}
        </div>
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
