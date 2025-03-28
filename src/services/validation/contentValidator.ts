import { z } from 'zod';
import {
  NewsArticle,
  RedditPost,
  GitHubRepo,
  TwitterTweet,
  LinkedInPost,
  StackOverflowQuestion,
  AutoContent,
  ContentType
} from '../../../types/content';

// Base content schema
const baseContentSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  url: z.string().url(),
  source: z.string().min(1),
  popularity: z.number().min(0).optional(),
  type: z.enum(['game', 'course', 'training', 'news'] as const).optional(),
});

// API response schemas
export const newsArticleSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  url: z.string().url(),
  source: z.object({
    name: z.string().min(1),
  }),
  publishedAt: z.string().datetime(),
});

export const redditPostSchema = z.object({
  data: z.object({
    title: z.string().min(1).max(300),
    selftext: z.string(),
    permalink: z.string(),
    subreddit: z.string(),
    score: z.number(),
  }),
});

export const githubRepoSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  html_url: z.string().url(),
  stargazers_count: z.number(),
});

export const twitterTweetSchema = z.object({
  id: z.string(),
  text: z.string(),
  public_metrics: z.object({
    retweet_count: z.number(),
  }).optional(),
});

export const linkedinPostSchema = z.object({
  specificContent: z.object({
    'com.linkedin.ugc.ShareContent': z.object({
      shareCommentary: z.object({
        text: z.string(),
      }),
    }),
  }),
  landingPage: z.object({
    landingPageUrl: z.string().url(),
  }).optional(),
  numLikes: z.number().optional(),
});

export const stackOverflowQuestionSchema = z.object({
  title: z.string().min(1),
  body: z.string(),
  link: z.string().url(),
  score: z.number(),
});

// Auto content schema
export const autoContentSchema = baseContentSchema.extend({
  id: z.string(),
  type: z.enum(['game', 'course', 'training', 'news'] as const),
  timestamp: z.date(),
  aiGenerated: z.boolean(),
  tags: z.array(z.string()).optional(),
  difficulty: z.string().optional(),
  targetAudience: z.array(z.string()).optional(),
  analytics: z.object({
    contentId: z.string(),
    views: z.number(),
    likes: z.number(),
    shares: z.number(),
    comments: z.number(),
    averageRating: z.number(),
    userEngagement: z.number(),
    lastUpdated: z.date(),
  }).optional(),
});

// Validation functions
export function validateNewsArticle(data: unknown): NewsArticle {
  return newsArticleSchema.parse(data);
}

export function validateRedditPost(data: unknown): RedditPost {
  return redditPostSchema.parse(data);
}

export function validateGitHubRepo(data: unknown): GitHubRepo {
  return githubRepoSchema.parse(data);
}

export function validateTwitterTweet(data: unknown): TwitterTweet {
  return twitterTweetSchema.parse(data);
}

export function validateLinkedInPost(data: unknown): LinkedInPost {
  return linkedinPostSchema.parse(data);
}

export function validateStackOverflowQuestion(data: unknown): StackOverflowQuestion {
  return stackOverflowQuestionSchema.parse(data);
}

export function validateAutoContent(data: unknown): AutoContent {
  return autoContentSchema.parse(data);
}

// Helper function to validate content type
export function isValidContentType(type: string): type is ContentType {
  return ['game', 'course', 'training', 'news'].includes(type);
}

// Helper function to validate content relevance
export function validateContentRelevance(content: AutoContent): boolean {
  if (!content.title || !content.description || !content.url) {
    return false;
  }

  if (content.popularity !== undefined && content.popularity < 0) {
    return false;
  }

  if (content.analytics) {
    const { views, likes, shares, comments, averageRating, userEngagement } = content.analytics;
    if (views < 0 || likes < 0 || shares < 0 || comments < 0 || averageRating < 0 || averageRating > 5 || userEngagement < 0) {
      return false;
    }
  }

  return true;
} 