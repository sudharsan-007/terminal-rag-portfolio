
import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllBlogPosts } from '@/data/blogData';
import BlogList from '@/components/blog/BlogList';
import BlogSearch from '@/components/blog/BlogSearch';
import ViewModeToggle from '@/components/blog/ViewModeToggle';
import KeyboardNavHelp from '@/components/blog/KeyboardNavHelp';

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
                <BlogSearch 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  searchInputRef={searchInputRef}
                  filteredPostsCount={filteredPosts.length}
                />
                
                <div className="flex justify-end mb-6">
                  <ViewModeToggle 
                    viewMode={viewMode} 
                    setViewMode={setViewMode}
                  />
                </div>
              </div>

              <BlogList 
                posts={filteredPosts}
                viewMode={viewMode}
                selectedPostIndex={selectedPostIndex}
                setSelectedPostIndex={setSelectedPostIndex}
              />
            </div>
          </div>
        </main>
        
        <Footer />
      </motion.div>
      
      {/* Background effects */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black to-terminal-navy/40 opacity-80" />
      
      {/* Keyboard navigation helper */}
      <KeyboardNavHelp />
    </div>
  );
};

export default Blog;
