
export interface Article {
  id: string;
  title: string;
  author: string;
  publishDate: string;
  excerpt: string;
  content: string; // Markdown content
  imageUrl: string;
  tags: string[];
  isSecret?: boolean;
}