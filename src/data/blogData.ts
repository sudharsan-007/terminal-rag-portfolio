
import { BlogPost } from "@/types/blog";
import yamlConfig from "./blog/config.yaml";
import fs from 'fs';
import path from 'path';

// Create a mocked fs function for client-side use
const readMarkdownFile = (fileName: string): string => {
  // In a real environment with SSR or API, we'd read directly from the filesystem
  // For client-side only, we'll use dynamic imports or fetch
  
  // This is a simplified mock implementation
  try {
    // In production, you'd use a strategy like dynamic imports or API calls
    // For simplicity in the demo, we'll return placeholder content
    if (fileName === 'vector-databases-similarity-search.md') {
      return require('./blog/content/vector-databases-similarity-search.md');
    }
    return "Content not available in client-side rendering. In a production app, this would be handled by API calls or SSR.";
  } catch (error) {
    console.error(`Error loading markdown file: ${fileName}`, error);
    return "# Error loading content";
  }
};

// Process the blog posts from the YAML config
export const getBlogPosts = (): BlogPost[] => {
  try {
    const posts = yamlConfig.posts.map((post: any) => {
      // In a real environment, we'd load content from files
      // Here we'll use the mock function
      // const content = readMarkdownFile(post.contentFile);
      
      const excerpt = post.excerpt || generateExcerptFromContent(post.contentFile);
      
      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: excerpt,
        content: "", // We'll load this on demand
        date: post.date,
        tags: post.tags || [],
        coverImage: post.coverImage,
        readingTime: post.readingTime,
        contentFile: post.contentFile
      };
    });
    
    return posts;
  } catch (error) {
    console.error("Error loading blog posts:", error);
    return [];
  }
};

// Function to generate excerpt from the first paragraph of content
const generateExcerptFromContent = (contentFile: string): string => {
  try {
    // For now, let's return placeholder excerpts based on the file name
    const excerpts: Record<string, string> = {
      'vector-databases-similarity-search.md': 'Have you ever wondered how Spotify knows exactly what music to recommend? Or how Goo...',
      'llm-fine-tuning-techniques.md': 'Large Language Models (LLMs) have revolutionized how we interact with technology, but th...',
      'neural-networks-explained.md': 'Neural networks have transformed AI, but they\'re often treated as mysterious black box...',
      'transformer-architecture.md': 'Transformer architecture has revolutionized natural language processing, enabling mod...',
      'reinforcement-learning-from-human-feedback.md': 'Reinforcement Learning from Human Feedback (RLHF) has emerged as a powerful technique...',
      'embeddings-in-ai.md': 'Vector embeddings are the foundation of modern AI systems, enabling machines to und...',
      'multimodal-ai.md': 'Multimodal AI systems can process and understand different types of data simultaneously...',
      'ai-compute-efficiency.md': 'As AI models continue to grow, researchers are focusing on making them more efficient...',
    };
    
    // Return the excerpt or a default excerpt if not found
    return excerpts[contentFile] || 
      'This article explores innovative aspects of artificial intelligence and machine learning...';
    
    // In a real implementation, we would:
    // 1. Read the markdown file
    // 2. Parse the first paragraph
    // 3. Truncate to around 100 characters
    // 4. Add ellipsis
  } catch (error) {
    console.error(`Error generating excerpt for ${contentFile}:`, error);
    return 'Explore the fascinating world of AI and machine learning...';
  }
};

// Get content for a specific blog post
export const getBlogContent = async (contentFile: string): Promise<string> => {
  // In a real app, this would fetch the markdown file
  // For this demo, we'll return mock content
  
  // Placeholder implementation
  try {
    // In production: return await fetch(`/api/blog/content/${contentFile}`).then(res => res.text());
    return "# Content would be loaded from " + contentFile + "\n\nIn a production environment, this content would be loaded from the markdown file.";
  } catch (error) {
    console.error(`Error loading blog content for ${contentFile}:`, error);
    return "# Error loading content";
  }
};

// Get all blog posts (sorted by date)
export const getAllBlogPosts = (): BlogPost[] => {
  const posts = getBlogPosts();
  
  // Sort by date (newest first)
  return [...posts].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

// Get a specific blog post by slug
export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  const posts = getBlogPosts();
  return posts.find(post => post.slug === slug);
};

// Get related posts (excluding the current post)
export const getRelatedPosts = (currentPostId: string, limit = 3): BlogPost[] => {
  const posts = getBlogPosts();
  const otherPosts = posts.filter(post => post.id !== currentPostId);
  return otherPosts.slice(0, limit);
};

// Load full blog post content (including markdown content)
export const loadFullBlogPost = async (slug: string): Promise<BlogPost | undefined> => {
  const post = getBlogPostBySlug(slug);
  
  if (!post) {
    return undefined;
  }
  
  try {
    // Load the content
    const content = await getBlogContent(post.contentFile);
    
    // Return the post with content
    return {
      ...post,
      content
    };
  } catch (error) {
    console.error(`Error loading full blog post for ${slug}:`, error);
    return post; // Return post without content
  }
};
