import { AppConfig, APIConfig, EmailConfig, AIConfig } from '../types/content';

// Validate required environment variables
function validateEnvVar(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// API Configuration
const apiConfig: APIConfig = {
  newsApiKey: process.env.NEWS_API_KEY || '',
  redditClientId: process.env.REDDIT_CLIENT_ID || '',
  redditClientSecret: process.env.REDDIT_CLIENT_SECRET || '',
  githubToken: process.env.GITHUB_TOKEN || '',
  twitterApiKey: process.env.TWITTER_API_KEY || '',
  linkedinApiKey: process.env.LINKEDIN_API_KEY || '',
  stackOverflowApiKey: process.env.STACK_OVERFLOW_API_KEY || ''
};

// Email Configuration
const emailConfig: EmailConfig = {
  user: process.env.EMAIL_SERVICE_USER || '',
  pass: process.env.EMAIL_SERVICE_PASS || ''
};

// AI Configuration
const aiConfig: AIConfig = {
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  geminiApiKey: process.env.GEMINI_API_KEY || ''
};

// Main App Configuration
export const config: AppConfig = {
  api: apiConfig,
  email: emailConfig,
  ai: aiConfig,
};

// Export individual configs for direct access
export { apiConfig, emailConfig, aiConfig }; 