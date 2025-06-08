import { BlogPost } from "@/types/blog";
import { parse } from 'yaml';

// We will fetch the YAML config from the public directory
let yamlConfig: any = { posts: [] };

// Initialize the blog data by fetching the config
const initBlogData = async () => {
  try {
    console.log("Fetching blog config from /assets/blogs/config.yaml");
    const response = await fetch('/assets/blogs/config.yaml');
    
    if (!response.ok) {
      console.error(`Failed to load blog config: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to load blog config: ${response.statusText}`);
    }
    
    const yamlText = await response.text();
    console.log(`Config loaded, length: ${yamlText.length} chars`);
    
    // Parse the YAML string
    yamlConfig = parse(yamlText);
    console.log("Parsed YAML config:", yamlConfig.posts?.length || 0, "posts");
  } catch (error) {
    console.error("Error initializing blog data:", error);
  }
};

// Call init function immediately
initBlogData();

// Process the blog posts from the YAML config
export const getBlogPosts = (): BlogPost[] => {
  try {
    if (!yamlConfig.posts || yamlConfig.posts.length === 0) {
      console.warn("Blog posts not loaded yet. The config may still be loading.");
      return [];
    }

    const posts = yamlConfig.posts.map((post: any) => {
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
  } catch (error) {
    console.error(`Error generating excerpt for ${contentFile}:`, error);
    return 'Explore the fascinating world of AI and machine learning...';
  }
};

// Get content for a specific blog post
export const getBlogContent = async (contentFile: string): Promise<string> => {
  try {
    console.log(`Fetching blog content: /assets/blogs/content/${contentFile}`);
    
    // Fetch the markdown file from the public directory
    const response = await fetch(`/assets/blogs/content/${contentFile}`);
    
    if (!response.ok) {
      console.error(`Failed to load blog content: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to load blog content: ${response.statusText}`);
    }
    
    const content = await response.text();
    console.log(`Content loaded, length: ${content.length} chars`);
    console.log(`Content preview: ${content.substring(0, 200)}...`);
    
    return content;
  } catch (error) {
    console.error(`Error loading blog content for ${contentFile}:`, error);
    return `# Error loading content\n\nSorry, there was an error loading this content.\n\nError details: ${error instanceof Error ? error.message : String(error)}`;
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
