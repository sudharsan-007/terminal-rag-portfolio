import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllBlogPosts } from '@/data/blogData';
import BlogList from '@/components/blog/BlogList';
import BlogSearch from '@/components/blog/BlogSearch';
import ViewModeToggle from '@/components/blog/ViewModeToggle';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';

type ViewMode = 'grid' | 'list';

const Blog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedPostIndex, setSelectedPostIndex] = useState(-1);
  const allPosts = getAllBlogPosts();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (isMobile) {
      setViewMode('list');
    }
  }, [isMobile]);
  
  const filteredPosts = allPosts.filter(post => {
    const searchContent = `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLowerCase();
    return searchContent.includes(searchQuery.toLowerCase());
  });

  const postsPerRow = viewMode === 'grid' ? 3 : 1;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedPostIndex >= filteredPosts.length) {
      setSelectedPostIndex(filteredPosts.length > 0 ? 0 : -1);
    }
    
    if (isMobile) return;
    
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
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
            return;
          }
          toggleViewMode();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredPosts, selectedPostIndex, viewMode, navigate, isMobile]);

  const navigatePost = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (filteredPosts.length === 0) return;
    
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
    
    const element = document.getElementById(`blog-post-${newIndex}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full"
    >
      <div className="terminal-window flex-grow flex flex-col overflow-hidden">
        <div className={`${isMobile ? 'p-3 pb-2' : 'p-6 pb-3'}`}>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-4/5">
              <BlogSearch 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchInputRef={searchInputRef}
                filteredPostsCount={filteredPosts.length}
              />
            </div>
            
            {!isMobile && (
              <div className="w-full sm:w-1/5 flex justify-end items-center">
                <ViewModeToggle 
                  viewMode={viewMode} 
                  setViewMode={setViewMode}
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-grow overflow-hidden">
          <ScrollArea className={`h-full ${isMobile ? 'px-3' : 'px-6'}`}>
            <div className={`${isMobile ? 'pr-2' : 'pr-4'}`}>
              <BlogList 
                posts={filteredPosts}
                viewMode={viewMode}
                selectedPostIndex={selectedPostIndex}
                setSelectedPostIndex={setSelectedPostIndex}
                isMobile={isMobile}
              />
            </div>
          </ScrollArea>
        </div>
      </div>
    </motion.div>
  );
};

export default Blog;
