
import { BlogPost } from "@/types/blog";

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "vector-databases-similarity-search",
    title: "Vector Databases: Understanding the Magic of Similarity Search",
    excerpt: "How vector databases enable efficient similarity search for recommendation systems, image search, and more.",
    date: "March 5, 2025",
    tags: ["AI", "Machine Learning", "Databases", "Vectors"],
    readingTime: 8,
    content: `
# Vector Databases: Understanding the Magic of Similarity Search

Have you ever wondered how Spotify knows exactly what music to recommend? Or how Google can find images similar to yours? The secret lies in vector databases – a fascinating technology that's revolutionizing how we handle and search through data.

## The Core Concept

At its heart, a vector database transforms everything – images, text, sound, or any other type of data – into a list of numbers. Think of it as creating a digital fingerprint for each piece of information. When you upload an image of a cat, the database doesn't see whiskers and fur; it sees a unique pattern of numbers that captures the essence of that image.

## How It Actually Works

![Vector Database Process](public/lovable-uploads/9dd8c316-db03-4cf6-a185-7e47d12ffbec.png)

The magic happens in three main steps:

1. **Transformation**
   Your data gets converted into vectors – those special number patterns we talked about. Each vector might have hundreds or thousands of dimensions, each capturing different aspects of your data.

2. **Organization**
   The database creates a sophisticated map of all these number patterns. Similar items end up closer together in this mathematical space, like books of the same genre being shelved together in a library.

3. **Search**
   When you search for something, it too gets converted into a vector, and the database finds the closest matches in its mathematical map. It's like asking, "Find me everything that looks like this."

## Real-World Magic

Let's see how this plays out in everyday applications:

### Netflix's Recommendation System

When you watch a show, Netflix converts your viewing history into vectors and finds shows with similar patterns. This is why it can suggest shows you might like, even if they're in different genres.

### Google Photos Search

When you search for "beach photos," the system isn't just looking for tags. It understands the visual patterns that make up a beach scene – sand, water, sky – all represented as vectors.

### Spotify's Discovery Feature

Each song gets converted into a vector capturing its musical essence – tempo, rhythm, harmony. This lets Spotify find songs with similar musical patterns, leading to those surprisingly good recommendations.

## Technical Considerations

While the concept is elegant, making it work requires some clever engineering:

Key Challenges:
- Managing the "curse of dimensionality" (data becomes sparse in high dimensions)
- Balancing speed vs. accuracy
- Scaling to handle millions or billions of vectors

Solutions typically involve:
- Smart indexing strategies
- Approximate nearest neighbor algorithms
- Clever dimension reduction techniques

## The Future of Search

Vector databases represent a fundamental shift in how we interact with data. Traditional keyword search is like looking for a book by its title alone, while vector search understands the content and context.

As these technologies continue to evolve, we can expect even more intuitive and powerful search experiences – ones that truly understand what we're looking for, even when we don't have the words to express it precisely.

`,
  },
  {
    id: "2",
    slug: "llm-fine-tuning-techniques",
    title: "Fine-tuning LLMs: Techniques for Specialized Applications",
    excerpt: "Exploring various techniques for fine-tuning large language models for domain-specific applications.",
    date: "February 20, 2025",
    tags: ["LLM", "Fine-tuning", "NLP", "AI"],
    readingTime: 10,
    content: "Full markdown content for LLM fine-tuning blog post...",
  },
  {
    id: "3",
    slug: "neural-networks-explained",
    title: "Neural Networks Explained: Beyond the Black Box",
    excerpt: "A deep dive into how neural networks actually work and make decisions.",
    date: "January 15, 2025",
    tags: ["Neural Networks", "Deep Learning", "AI"],
    coverImage: "/lovable-uploads/38d5efd1-774c-4895-92a4-a3a22e640245.png",
    readingTime: 12,
    content: "Full markdown content for neural networks blog post...",
  },
  {
    id: "4",
    slug: "transformer-architecture",
    title: "Understanding Transformer Architecture",
    excerpt: "Breaking down the architecture that powers modern language models like GPT and BERT.",
    date: "December 5, 2024",
    tags: ["Transformers", "NLP", "Deep Learning"],
    readingTime: 15,
    content: "Full markdown content for transformer architecture blog post...",
  },
  {
    id: "5",
    slug: "reinforcement-learning-from-human-feedback",
    title: "RLHF: Aligning AI Systems with Human Values",
    excerpt: "How Reinforcement Learning from Human Feedback is used to align AI systems with human preferences.",
    date: "November 18, 2024",
    tags: ["RLHF", "AI Alignment", "Reinforcement Learning"],
    coverImage: "/lovable-uploads/08fccf80-81d4-46a4-ada4-326119159ad8.png",
    readingTime: 9,
    content: "Full markdown content for RLHF blog post...",
  },
  {
    id: "6",
    slug: "embeddings-in-ai",
    title: "The Power of Embeddings in Modern AI",
    excerpt: "How vector embeddings enable machines to understand semantics and relationships.",
    date: "October 30, 2024",
    tags: ["Embeddings", "NLP", "Vectors", "Semantic Search"],
    readingTime: 7,
    content: "Full markdown content for embeddings blog post...",
  },
  {
    id: "7",
    slug: "multimodal-ai",
    title: "Multimodal AI: Combining Vision and Language",
    excerpt: "Exploring how AI models can process and understand multiple types of data simultaneously.",
    date: "September 25, 2024",
    tags: ["Multimodal AI", "Computer Vision", "NLP"],
    readingTime: 11,
    content: "Full markdown content for multimodal AI blog post...",
  },
  {
    id: "8",
    slug: "ai-compute-efficiency",
    title: "The Quest for AI Compute Efficiency",
    excerpt: "How researchers are making AI models more efficient while maintaining performance.",
    date: "August 14, 2024",
    tags: ["AI Efficiency", "Quantization", "Model Optimization"],
    readingTime: 8,
    content: "Full markdown content for AI compute efficiency blog post...",
  },
];

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};

export const getAllBlogPosts = (): BlogPost[] => {
  return [...blogPosts].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

export const getRelatedPosts = (currentPostId: string, limit = 3): BlogPost[] => {
  const otherPosts = blogPosts.filter(post => post.id !== currentPostId);
  return otherPosts.slice(0, limit);
};
