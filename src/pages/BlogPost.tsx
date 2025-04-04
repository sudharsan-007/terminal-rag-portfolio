
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogTags from '@/components/blog/BlogTags';
import BlogCard from '@/components/blog/BlogCard';
import { getBlogPostBySlug, getRelatedPosts, loadFullBlogPost } from '@/data/blogData';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState(getBlogPostBySlug(slug || ''));
  const [isLoading, setIsLoading] = useState(true);
  const relatedPosts = post ? getRelatedPosts(post.id) : [];

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
    <div className="min-h-screen flex flex-col bg-terminal-bg">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Link to="/blog" className="inline-flex items-center text-terminal-text hover:text-terminal-accent1 mb-6">
          <ArrowLeft size={20} className="mr-2" />
          Back to all posts
        </Link>
        
        <article className="terminal-window overflow-visible p-6 md:p-8">
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-terminal-text">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-terminal-text/70 mb-4">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{post.date}</span>
              </div>
              {post.readingTime && (
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{post.readingTime} min read</span>
                </div>
              )}
            </div>
            
            {post.tags.length > 0 && (
              <div className="mb-6">
                <BlogTags tags={post.tags} />
              </div>
            )}
            
            {post.coverImage && (
              <div className="mb-6">
                <img 
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-auto rounded-md object-cover"
                />
              </div>
            )}
          </header>
          
          <div className="prose prose-invert prose-pre:bg-terminal-navy/80 prose-pre:border prose-pre:border-terminal-text/30 prose-pre:rounded-md prose-code:text-terminal-accent1 prose-headings:text-terminal-text prose-a:text-terminal-accent1 hover:prose-a:text-terminal-accent1/80 max-w-none">
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
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
              >
                {post.content}
              </ReactMarkdown>
            )}
          </div>
        </article>
        
        {relatedPosts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-terminal-text mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} viewMode="grid" />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Keyboard navigation helper */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-terminal-navy/80 border border-terminal-text/30 rounded-lg px-4 py-2 text-xs text-terminal-text/70 flex gap-3">
        <div className="flex items-center gap-1">
          <span className="bg-terminal-text/20 px-1 rounded">ESC</span>
          <span>Return to blog list</span>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogPost;
