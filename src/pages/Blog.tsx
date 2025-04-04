
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllBlogPosts } from '@/data/blogData';
import BlogCard from '@/components/blog/BlogCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Blog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const allPosts = getAllBlogPosts();
  
  const filteredPosts = allPosts.filter(post => {
    const searchContent = `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLowerCase();
    return searchContent.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen flex flex-col bg-terminal-bg">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-terminal-text mb-4">
            <span className="text-terminal-accent1">./</span>
            blog
          </h1>
          <p className="text-terminal-text/80 mb-6">
            Exploring the frontiers of machine learning, AI, and beyond.
          </p>
          
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-terminal-text/50" size={18} />
            <Input
              type="text"
              placeholder="Search by title, content, or tags..."
              className="terminal-input pl-10 border border-terminal-text/30 rounded-md w-full bg-terminal-navy/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="terminal-window p-6 text-center">
            <p className="text-terminal-text">No posts found matching your search.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
