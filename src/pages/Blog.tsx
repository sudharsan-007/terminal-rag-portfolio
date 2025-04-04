
import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllBlogPosts } from '@/data/blogData';
import BlogCard from '@/components/blog/BlogCard';
import { Input } from '@/components/ui/input';
import { Search, LayoutGrid, List } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type ViewMode = 'grid' | 'list';

const Blog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedPostIndex, setSelectedPostIndex] = useState(-1);
  const allPosts = getAllBlogPosts();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const filteredPosts = allPosts.filter(post => {
    const searchContent = `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLowerCase();
    return searchContent.includes(searchQuery.toLowerCase());
  });

  // Calculate grid columns based on view mode
  const postsPerRow = viewMode === 'grid' ? 3 : 1;

  useEffect(() => {
    // Simulate loading to add a smooth entrance effect
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Reset selected post index when filtered posts change
    if (selectedPostIndex >= filteredPosts.length) {
      setSelectedPostIndex(filteredPosts.length > 0 ? 0 : -1);
    }
    
    // Set up global keyboard event listener
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      // Skip if focused on input
      if (document.activeElement?.tagName === 'INPUT') {
        if (e.key === 'Escape') {
          searchInputRef.current?.blur();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          navigatePost('down');
          break;
        case 'ArrowUp':
          e.preventDefault();
          navigatePost('up');
          break;
        case 'ArrowRight':
          e.preventDefault();
          navigatePost('right');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          navigatePost('left');
          break;
        case 'Enter':
          if (selectedPostIndex >= 0 && selectedPostIndex < filteredPosts.length) {
            navigate(`/blog/${filteredPosts[selectedPostIndex].slug}`);
          }
          break;
        case '/':
          e.preventDefault();
          searchInputRef.current?.focus();
          break;
        case 'v':
          if (e.ctrlKey || e.metaKey) {
            // Do not switch view mode on paste
            return;
          }
          toggleViewMode();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredPosts, selectedPostIndex, viewMode, navigate]);

  const navigatePost = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (filteredPosts.length === 0) return;
    
    // If nothing is selected, select the first item
    if (selectedPostIndex === -1) {
      setSelectedPostIndex(0);
      return;
    }

    let newIndex = selectedPostIndex;
    
    if (viewMode === 'grid') {
      switch (direction) {
        case 'up':
          newIndex = Math.max(0, selectedPostIndex - postsPerRow);
          break;
        case 'down':
          newIndex = Math.min(filteredPosts.length - 1, selectedPostIndex + postsPerRow);
          break;
        case 'left':
          if (selectedPostIndex % postsPerRow !== 0) {
            newIndex = Math.max(0, selectedPostIndex - 1);
          }
          break;
        case 'right':
          if ((selectedPostIndex + 1) % postsPerRow !== 0 && selectedPostIndex < filteredPosts.length - 1) {
            newIndex = selectedPostIndex + 1;
          }
          break;
      }
    } else {
      // List view - only up and down work
      switch (direction) {
        case 'up':
        case 'left':
          newIndex = Math.max(0, selectedPostIndex - 1);
          break;
        case 'down':
        case 'right':
          newIndex = Math.min(filteredPosts.length - 1, selectedPostIndex + 1);
          break;
      }
    }
    
    setSelectedPostIndex(newIndex);
    
    // Ensure the element is visible by scrolling to it if needed
    const element = document.getElementById(`blog-post-${newIndex}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  const handleBlogClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

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
              sudharsan@portfolio:~/blogs
            </div>
          </div>
          
          <div className="terminal-window flex-grow overflow-auto">
            <div className="p-6">
              <div className="mb-6">
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-terminal-text/50" size={18} />
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search by title, content, or tags... (Press '/' to focus)"
                    className="terminal-input pl-10 border border-terminal-text/30 rounded-md w-full bg-terminal-navy/30"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-between items-center mb-6">
                  <div className="text-sm text-terminal-text/70">
                    <span>{filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as ViewMode)}>
                      <ToggleGroupItem value="grid" aria-label="Grid view">
                        <LayoutGrid size={18} />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="list" aria-label="List view">
                        <List size={18} />
                      </ToggleGroupItem>
                    </ToggleGroup>

                    <div className="bg-terminal-text/20 px-2 py-1 rounded text-xs flex items-center gap-1">
                      <span className="font-mono">V</span>
                      <span>{viewMode === 'grid' ? 'Grid View' : 'List View'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {filteredPosts.length > 0 ? (
                viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.map((post, index) => (
                      <div 
                        key={post.id} 
                        id={`blog-post-${index}`}
                        className={`${selectedPostIndex === index ? 'ring-2 ring-terminal-accent1 border border-terminal-accent1' : ''}`}
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
                    {filteredPosts.map((post, index) => (
                      <div 
                        key={post.id} 
                        id={`blog-post-${index}`}
                        className={`${selectedPostIndex === index ? 'ring-2 ring-terminal-accent1 border border-terminal-accent1' : ''}`}
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
                )
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
      
      {/* Keyboard navigation helper - Styled similarly to Projects page */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-terminal-navy/80 border border-terminal-text/30 rounded-lg px-4 py-2 text-xs text-terminal-text/70">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="mb-1">↑/↓/←/→: Navigate posts</p>
            <p>Enter: Open post</p>
          </div>
          <div>
            <p className="mb-1">V: Toggle view mode</p>
            <p>/: Focus search</p>
          </div>
          <div className="md:col-span-2">
            <p className="mb-1">ESC: Return from search / details</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
