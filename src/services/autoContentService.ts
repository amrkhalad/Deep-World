import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import nodemailer from 'nodemailer';
import { config } from '../config/app';
import {
  AutoContent,
  UserPreferences,
  ContentAnalytics,
  NewsArticle,
  RedditPost,
  GitHubRepo,
  TwitterTweet,
  LinkedInPost,
  StackOverflowQuestion,
  AIContentAnalysis,
  AIContentGeneration,
  ContentType,
  APIConfig
} from '../types/content';
import { NewsAPIClient } from './api/clients/newsClient';
import { RedditAPIClient } from './api/clients/redditClient';
import { GitHubAPIClient } from './api/clients/githubClient';
import { TwitterAPIClient } from './api/clients/twitterClient';
import { LinkedInAPIClient } from './api/clients/linkedinClient';
import { StackOverflowAPIClient } from './api/clients/stackoverflowClient';
import { validateAutoContent } from './validation/contentValidator';
import { z } from 'zod';

// Initialize AI clients
const openai = config.ai.openaiApiKey ? new OpenAI({ apiKey: config.ai.openaiApiKey }) : null;
const genAI = config.ai.geminiApiKey ? new GoogleGenerativeAI(config.ai.geminiApiKey) : null;

// API Keys
const NEWS_API_KEY = config.api.newsApiKey || '';
const REDDIT_CLIENT_ID = config.api.redditClientId || '';
const REDDIT_CLIENT_SECRET = config.api.redditClientSecret || '';
const GITHUB_TOKEN = config.api.githubToken || '';
const TWITTER_API_KEY = config.api.twitterApiKey || '';
const LINKEDIN_API_KEY = config.api.linkedinApiKey || '';
const STACK_OVERFLOW_API_KEY = config.api.stackOverflowApiKey || '';

// Email service configuration
const EMAIL_SERVICE_USER = config.email.user || '';
const EMAIL_SERVICE_PASS = config.email.pass || '';

interface EnhancedAutoContent extends AutoContent {
  relevanceScore: number;
  qualityScore: number;
}

function getContentType(item: NewsArticle | RedditPost | GitHubRepo | TwitterTweet | LinkedInPost | StackOverflowQuestion): ContentType {
  if ('type' in item) {
    return item.type as ContentType;
  }
  if ('source' in item && typeof item.source === 'string' && item.source.toLowerCase().includes('news')) {
    return 'news';
  }
  // For all other types, we'll categorize them based on their content
  if ('answer_count' in item || 'html_url' in item) {
    return 'training';
  }
  if ('tweet' in item || 'ugcPost' in item) {
    return 'course';
  }
  return 'news';
}

function convertToAutoContent(item: NewsArticle | RedditPost | GitHubRepo | TwitterTweet | LinkedInPost | StackOverflowQuestion): AutoContent {
  let title = '';
  let description = '';
  let url = '#';
  let source = 'unknown';

  if ('title' in item && item.title) {
    title = item.title;
  } else if ('text' in item && item.text) {
    title = item.text;
  }

  if ('description' in item && item.description) {
    description = item.description;
  } else if ('body' in item && item.body) {
    description = item.body;
  }

  if ('url' in item && item.url) {
    url = item.url;
  } else if ('html_url' in item && item.html_url) {
    url = item.html_url;
  }

  if ('source' in item) {
    source = typeof item.source === 'string' ? item.source : 'unknown';
  }

  const baseContent: AutoContent = {
    id: `auto-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    description,
    type: getContentType(item),
    source,
    url,
    aiGenerated: false,
    timestamp: new Date(),
    tags: [],
    popularity: 0
  };

  return baseContent;
}

export class AutoContentService {
  private newsClient: NewsAPIClient;
  private redditClient: RedditAPIClient;
  private githubClient: GitHubAPIClient;
  private twitterClient: TwitterAPIClient;
  private linkedinClient: LinkedInAPIClient;
  private stackoverflowClient: StackOverflowAPIClient;

  constructor(config: APIConfig) {
    this.newsClient = new NewsAPIClient(config);
    this.redditClient = new RedditAPIClient(config.redditClientId, config.redditClientSecret);
    this.githubClient = new GitHubAPIClient(config.githubToken);
    this.twitterClient = new TwitterAPIClient(config);
    this.linkedinClient = new LinkedInAPIClient(config);
    this.stackoverflowClient = new StackOverflowAPIClient(config.stackOverflowApiKey);
  }

  async discoverTrendingTopics(): Promise<AutoContent[]> {
    try {
      const [
        newsArticles,
        redditPosts,
        githubRepos,
        tweets,
        linkedinPosts,
        stackoverflowQuestions
      ] = await Promise.all([
        this.newsClient.getTopHeadlines(),
        this.redditClient.getHotPosts(),
        this.githubClient.getTrendingRepos(),
        this.twitterClient.getTrendingTweets(),
        this.linkedinClient.getTrendingPosts(),
        this.stackoverflowClient.getTrendingQuestions()
      ]);

      const allContent = [
        ...newsArticles,
        ...redditPosts,
        ...githubRepos,
        ...tweets,
        ...linkedinPosts,
        ...stackoverflowQuestions
      ].map(convertToAutoContent);

      return this.analyzeContent(allContent);
    } catch (error) {
      console.error('Error discovering trending topics:', error);
      throw error;
    }
  }

  private async analyzeContent(content: AutoContent[]): Promise<EnhancedAutoContent[]> {
    const analyzedContent = await Promise.all(
      content.map(async (item) => {
        try {
          validateAutoContent(item);
          const relevanceScore = await this.calculateRelevanceScore(item);
          const qualityScore = await this.calculateQualityScore(item);

          return {
            ...item,
            relevanceScore,
            qualityScore
          } as EnhancedAutoContent;
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors);
            return null;
          }
          throw error;
        }
      })
    );

    return analyzedContent.filter((item): item is EnhancedAutoContent => item !== null);
  }

  private async calculateRelevanceScore(content: AutoContent): Promise<number> {
    // Implement relevance scoring logic based on content analysis
    // This could use AI to analyze content relevance to your domain
    return 0.8; // Placeholder
  }

  private async calculateQualityScore(content: AutoContent): Promise<number> {
    // Implement quality scoring logic based on various factors
    // This could consider engagement metrics, source credibility, etc.
    return 0.7; // Placeholder
  }

  async autoDiscoverContent(): Promise<void> {
    try {
      const trendingTopics = await this.discoverTrendingTopics();
      const enhancedTopics = await this.analyzeContent(trendingTopics);
      
      // Filter and sort content by relevance and quality
      const relevantContent = enhancedTopics
        .filter(content => content.relevanceScore > 0.7 && content.qualityScore > 0.6)
        .sort((a, b) => b.relevanceScore - a.relevanceScore);

      // Save relevant content to database
      await this.saveContent(relevantContent);
    } catch (error) {
      console.error('Error in auto content discovery:', error);
      throw error;
    }
  }

  private async saveContent(content: EnhancedAutoContent[]): Promise<void> {
    // Implement database saving logic
    console.log('Saving content:', content);
  }
}

// Function to generate AI content suggestions
async function generateAIContentSuggestions() {
  const prompt = `Generate 5 trending topics in technology, AI, and programming that would be valuable for our platform.
For each topic, provide:
1. Title
2. Description
3. Suggested content type (game/course/training/news)
4. Target audience
Format as JSON array.`;

  try {
    if (openai) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a content discovery assistant that identifies valuable topics for technology education and entertainment."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error('No content received from OpenAI');
      }
      const suggestions = JSON.parse(content);
      return suggestions.map((suggestion: any) => ({
        title: suggestion.title,
        description: suggestion.description,
        url: `ai-suggestion-${Date.now()}`,
        source: 'ai-suggestion',
        popularity: 100,
        type: suggestion.contentType
      }));
    }
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
  }
  return [];
}

// Function to analyze content relevance
async function analyzeContentRelevance(content: any) {
  const prompt = `Analyze this content and determine if it's relevant for our platform:
Title: ${content.title}
Description: ${content.description}
Source: ${content.source}
Popularity: ${content.popularity}

Please provide:
1. Relevance score (0-100)
2. Content type (game/course/training/news)
3. Key topics
4. Target audience
5. Quality assessment (1-10)
Format as JSON.`;

  try {
    if (openai) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a content analysis assistant that determines content relevance and categorization."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
      });

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error('No content received from OpenAI');
      }
      return JSON.parse(content);
    } else if (genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const content = result.response.text();
      if (!content) {
        throw new Error('No content received from Gemini');
      }
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Error analyzing content:', error);
    return null;
  }
}

// Function to generate additional content
async function generateAdditionalContent(content: any, type: string) {
  const prompt = `Generate detailed content for a ${type} with the following details:
Title: ${content.title}
Description: ${content.description}
Source: ${content.source}

Please provide:
1. Key features or points (5-7)
2. Target audience
3. Prerequisites or requirements
4. Pros and cons
5. Related topics or tags
6. Learning objectives (if applicable)
7. Difficulty level (if applicable)
Format as JSON.`;

  try {
    if (openai) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a content generation assistant that creates detailed content."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error('No content received from OpenAI');
      }
      return JSON.parse(content);
    } else if (genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const content = result.response.text();
      if (!content) {
        throw new Error('No content received from Gemini');
      }
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Error generating additional content:', error);
    return null;
  }
}

// Function to filter content based on user preferences
async function filterContentByPreferences(content: AutoContent, userPreferences: UserPreferences[]): Promise<boolean> {
  // Check if any user's preferences match the content
  return userPreferences.some(preferences => {
    // Check if content type matches user preferences
    if (!preferences.contentTypes.includes(content.type)) {
      return false;
    }

    // Check if source is preferred
    if (!preferences.preferredSources.includes(content.source.split('-')[0])) {
      return false;
    }

    // Check if difficulty level matches
    if (content.difficulty && !preferences.difficultyLevels.includes(content.difficulty)) {
      return false;
    }

    // Check if interests match
    if (content.tags) {
      const hasMatchingInterest = content.tags.some(tag => 
        preferences.interests.some(interest => 
          tag.toLowerCase().includes(interest.toLowerCase())
        )
      );
      if (!hasMatchingInterest) {
        return false;
      }
    }

    return true;
  });
}

// Function to update content analytics
async function updateContentAnalytics(contentId: string, analytics: Partial<ContentAnalytics>) {
  try {
    // Here you would implement the database update logic
    console.log(`Updating analytics for content ${contentId}:`, analytics);
    return { success: true };
  } catch (error) {
    console.error('Error updating content analytics:', error);
    return { success: false, error };
  }
}

// Function to send email notifications
async function sendEmailNotifications(users: UserPreferences[], newContent: AutoContent[]) {
  const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.email.user,
      pass: config.email.pass
    }
  });

  for (const user of users) {
    if (!user.emailNotifications) continue;

    const emailContent = `
      <h2>New Content Available!</h2>
      <p>Here are the latest items that match your interests:</p>
      <ul>
        ${newContent.map(content => `
          <li>
            <strong>${content.title}</strong>
            <p>${content.description}</p>
            <a href="${content.url}">View More</a>
          </li>
        `).join('')}
      </ul>
    `;

    try {
      await emailTransporter.sendMail({
        from: config.email.user,
        to: user.userId,
        subject: 'New Content Available',
        html: emailContent
      });
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  }
}

// Function to fetch user preferences
async function fetchUserPreferences(): Promise<UserPreferences[]> {
  try {
    // Here you would implement the database fetch logic
    console.log('Fetching user preferences');
    return [];
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return [];
  }
}

// Start automatic content discovery
const startAutoDiscovery = async () => {
  const service = new AutoContentService(config.api);
  await service.autoDiscoverContent();
}; 