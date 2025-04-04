
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllBlogPosts } from '@/data/blogData';
import BlogCard from '@/components/blog/BlogCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Blog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const allPosts = getAllBlogPosts();
  
  const filteredPosts = allPosts.filter(post => {
    const searchContent = `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLowerCase();
    return searchContent.includes(searchQuery.toLowerCase());
  });

  useEffect(() => {
    // Simulate loading to add a smooth entrance effect
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-terminal-bg overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto flex flex-col h-screen px-4"
      >
        <Header />
        
        <main className="flex-grow flex flex-col mt-4 mb-8 overflow-hidden">
          <div className="mb-4">
            <div className="text-terminal-text text-lg sm:text-xl md:text-2xl">
              sudharsan@portfolio:~/blog
            </div>
          </div>
          
          <div className="terminal-window flex-grow overflow-auto">
            <div className="p-6">
              <div className="mb-6">
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
                <div className="p-6 text-center">
                  <p className="text-terminal-text">No posts found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </main>
        
        <Footer />
      </motion.div>
      
      {/* Background effects */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black to-terminal-navy/40 opacity-80" />
    </div>
  );
};

export default Blog;
