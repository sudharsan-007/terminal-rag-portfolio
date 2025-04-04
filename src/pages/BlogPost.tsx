
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogTags from '@/components/blog/BlogTags';
import BlogCard from '@/components/blog/BlogCard';
import { getBlogPostBySlug, getRelatedPosts } from '@/data/blogData';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = getBlogPostBySlug(slug || '');
  const relatedPosts = post ? getRelatedPosts(post.id) : [];

  useEffect(() => {
    if (!post) {
      navigate('/blog');
    }
    // Scroll to top when post changes
    window.scrollTo(0, 0);
  }, [post, navigate]);

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
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeHighlight]}
            >
              {post.content}
            </ReactMarkdown>
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

      <Footer />
    </div>
  );
};

export default BlogPost;
