export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  source: string;
  category: string;
  region: string;
  publishedAt: string;
  imageUrl: string;
  views?: number;
  likes?: number;
  comments?: number;
  relatedArticles?: string[];
  aiSummary?: string;
  aiInsights?: string[];
  aiSentiment?: 'positive' | 'negative' | 'neutral';
} 