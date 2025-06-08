
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  tags: string[];
  coverImage?: string;
  readingTime?: number;
  contentFile?: string;
}

// For type-safe YAML config
export interface BlogConfig {
  posts: Array<{
    id: string;
    slug: string;
    title: string;
    date: string;
    tags: string[];
    readingTime?: number;
    coverImage?: string;
    contentFile: string;
    excerpt?: string;
  }>;
}
