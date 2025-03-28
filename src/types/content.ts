export interface SystemRequirements {
  os: string;
  processor: string;
  memory: string;
  graphics: string;
  storage: string;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  genre: string;
  rating: number;
  downloadLink: string;
  thumbnailUrl: string;
  systemRequirements: string;
  tags: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  downloadLink: string;
  thumbnailUrl: string;
  pros: string[];
  cons: string[];
  tags: string[];
}

export interface Training {
  id: string;
  title: string;
  description: string;
  provider: string;
  price: number;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  downloadLink: string;
  thumbnailUrl: string;
  pros: string[];
  cons: string[];
  tags: string[];
}

// Content Types
export type ContentType = 'game' | 'course' | 'training' | 'news';

export interface BaseContent {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  source: string;
  url: string;
  timestamp: Date;
  popularity?: number;
  tags?: string[];
  difficulty?: string;
  targetAudience?: string[];
}

export interface AutoContent extends BaseContent {
  aiGenerated: boolean;
  analytics?: ContentAnalytics;
}

export interface ContentAnalytics {
  contentId: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  averageRating: number;
  userEngagement: number;
  lastUpdated: Date;
}

// User Types
export interface UserPreferences {
  userId: string;
  emailNotifications: boolean;
  emailFrequency: 'daily' | 'weekly' | 'monthly';
  interests: string[];
  contentTypes: ContentType[];
  preferredSources: string[];
  difficultyLevels: string[];
}

// API Response Types
export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  imageUrl: string;
  publishedAt: Date;
  source: string;
  author: string | null;
}

export interface RedditPost {
  data: {
    title: string;
    selftext: string;
    permalink: string;
    subreddit: string;
    score: number;
  };
}

export interface GitHubRepo {
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
}

export interface TwitterTweet {
  id: string;
  text: string;
  public_metrics?: {
    retweet_count: number;
  };
}

export interface LinkedInPost {
  specificContent: {
    'com.linkedin.ugc.ShareContent': {
      shareCommentary: {
        text: string;
      };
    };
  };
  landingPage?: {
    landingPageUrl: string;
  };
  numLikes?: number;
}

export interface StackOverflowQuestion {
  title: string;
  body: string;
  link: string;
  score: number;
}

// AI Response Types
export interface AIContentAnalysis {
  relevanceScore: number;
  contentType: ContentType;
  keyTopics: string[];
  targetAudience: string[];
  qualityAssessment: number;
}

export interface AIContentGeneration {
  features: string[];
  targetAudience: string[];
  prerequisites: string[];
  pros: string[];
  cons: string[];
  tags: string[];
  learningObjectives?: string[];
  difficultyLevel?: string;
}

// Configuration Types
export interface APIConfig {
  newsApiKey: string;
  redditClientId: string;
  redditClientSecret: string;
  githubToken: string;
  twitterApiKey: string;
  linkedinApiKey: string;
  stackOverflowApiKey: string;
}

export interface EmailConfig {
  user: string;
  pass: string;
}

export interface AIConfig {
  openaiApiKey: string;
  geminiApiKey: string;
  deepseekApiKey: string;
}

export interface AppConfig {
  api: APIConfig;
  email: EmailConfig;
  ai: AIConfig;
} 