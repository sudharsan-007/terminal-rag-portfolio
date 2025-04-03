
export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  date: string;
  technologies: string[];
  keyHighlights: string[];
  githubUrl?: string;
}
