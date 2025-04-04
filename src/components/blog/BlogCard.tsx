
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag } from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <Card className="terminal-window h-full flex flex-col hover:border-terminal-accent1 transition-colors duration-300">
      <CardHeader className="pb-2">
        <Link to={`/blog/${post.slug}`} className="text-terminal-text hover:text-terminal-accent1">
          <h2 className="text-xl font-bold tracking-tight">{post.title}</h2>
        </Link>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <p className="text-terminal-text/90">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 text-xs text-terminal-text/70 pt-2 border-t border-terminal-text/20">
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
        <div className="flex items-center gap-1 ml-auto">
          <Tag size={14} />
          <span>{post.tags.slice(0, 2).join(', ')}{post.tags.length > 2 ? '...' : ''}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
