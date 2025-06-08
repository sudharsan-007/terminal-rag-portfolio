import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import BlogTags from '@/components/blog/BlogTags';
import BlogCard from '@/components/blog/BlogCard';
import { getBlogPostBySlug, getRelatedPosts, loadFullBlogPost } from '@/data/blogData';
import { BlogPost as BlogPostType } from '@/types/blog';
import { useIsMobile } from '@/hooks/use-mobile';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState(getBlogPostBySlug(slug || ''));
  const [isLoading, setIsLoading] = useState(true);
  const relatedPosts = post ? getRelatedPosts(post.id) : [];
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!post) {
      navigate('/blog');
      return;
    }

    // Load the full post content when component mounts
    const loadContent = async () => {
      setIsLoading(true);
      try {
        const fullPost = await loadFullBlogPost(slug || '');
        if (fullPost) {
          setPost(fullPost);
        }
      } catch (error) {
        console.error("Error loading blog post content:", error);
      } finally {
        setIsLoading(false);
        setIsLoaded(true);
      }
    };

    loadContent();
    
    // Scroll to top when post changes
    window.scrollTo(0, 0);

    // Set up ESC key to navigate back to blog list
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate('/blog');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slug, navigate, post?.id]);

  if (!post) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full"
    >
      <div className="terminal-window flex-grow overflow-auto">
        <article className={`${isMobile ? 'p-4' : 'p-6 md:p-8'}`}>
          <header className={`${isMobile ? 'mb-4' : 'mb-8'}`}>
            <button
              onClick={() => navigate('/blog')}
              className="px-3 py-1.5 mb-4 border border-terminal-text/30 rounded text-sm text-terminal-text/70 hover:bg-terminal-text/10 hover:text-terminal-text transition-colors inline-flex items-center"
              aria-label="Press ESC to go back"
            >
              <ArrowLeft size={16} className="mr-1.5" /> Back to blogs
            </button>
            
            <h1 className={`${isMobile ? 'text-xl' : 'text-2xl md:text-3xl lg:text-4xl'} font-bold ${isMobile ? 'mb-2' : 'mb-4'} text-terminal-accent1`}>
              {post.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-terminal-text/70 mb-4">
              <div className="flex items-center gap-1">
                <Calendar size={isMobile ? 14 : 16} />
                <span className={isMobile ? 'text-xs' : 'text-sm'}>{post.date}</span>
              </div>
              {post.readingTime && (
                <div className="flex items-center gap-1">
                  <Clock size={isMobile ? 14 : 16} />
                  <span className={isMobile ? 'text-xs' : 'text-sm'}>{post.readingTime} min read</span>
                </div>
              )}
            </div>
            
            {post.tags.length > 0 && (
              <div className={`${isMobile ? 'mb-3' : 'mb-6'}`}>
                <BlogTags tags={post.tags} />
              </div>
            )}
          </header>
          
          <div className={`prose prose-invert ${isMobile ? 'prose-sm' : ''} prose-pre:bg-terminal-navy/80 prose-pre:border prose-pre:border-terminal-text/30 prose-pre:rounded-md prose-code:text-terminal-accent1 prose-headings:text-terminal-text prose-a:text-terminal-accent1 hover:prose-a:text-terminal-accent1/80 max-w-none`}>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-terminal-text/10 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-terminal-text/10 rounded w-5/6 mb-4"></div>
                <div className="h-4 bg-terminal-text/10 rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-terminal-text/10 rounded w-4/5 mb-8"></div>
                <div className="h-4 bg-terminal-text/10 rounded w-full mb-2"></div>
                <div className="h-4 bg-terminal-text/10 rounded w-full mb-2"></div>
                <div className="h-4 bg-terminal-text/10 rounded w-3/4 mb-4"></div>
              </div>
            ) : (
              <>
                {/* Debug info */}
                <div className="mb-4 p-2 bg-terminal-navy/50 rounded text-xs font-mono">
                  <p className="mb-1">Post slug: {slug}</p>
                  <p className="mb-1">Content length: {post.content?.length || 0} chars</p>
                  <p className="mb-1">Cover image: {post.coverImage}</p>
                </div>
                
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeHighlight]}
                  components={{
                    img: ({ node, src, alt, ...props }) => {
                      console.log("Image in markdown:", { src, alt });
                      return (
                        <div className="my-4">
                          <img 
                            src={src} 
                            alt={alt || "Blog image"} 
                            className="rounded-md max-w-full h-auto"
                            {...props}
                          />
                          <p className="text-xs text-terminal-text/60 mt-1">Image path: {src}</p>
                        </div>
                      );
                    }
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </>
            )}
          </div>
        </article>
        
        {relatedPosts.length > 0 && (
          <section className={`${isMobile ? 'px-4 pb-4' : 'px-6 md:px-8 pb-6'}`}>
            <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-terminal-text ${isMobile ? 'mb-3' : 'mb-6'}`}>Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.id} onClick={() => navigate(`/blog/${relatedPost.slug}`)}>
                  <BlogCard post={relatedPost} viewMode="grid" />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
};

export default BlogPost;
