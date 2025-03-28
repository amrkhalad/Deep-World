import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NewsArticle } from '../types/news';

// Initialize AI clients
const openai = process.env.OPENAI_API_KEY && 
  process.env.OPENAI_API_KEY !== 'your_api_key_here' && 
  process.env.OPENAI_API_KEY.length > 0
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    }) 
  : null;

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let newsCache: {
  articles: NewsArticle[];
  timestamp: number;
} | null = null;

// Fetch real news from NewsAPI
async function fetchRealNews(): Promise<NewsArticle[]> {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`
    );
    const data = await response.json();

    return data.articles.map((article: any, index: number) => ({
      id: `real-${index}`,
      title: article.title,
      description: article.description || article.title,
      source: article.source.name,
      category: article.category || 'General',
      region: article.country || 'Global',
      publishedAt: article.publishedAt,
      imageUrl: article.urlToImage || '/images/news/tech-summit.svg',
      views: 0,
      likes: 0,
      comments: 0,
      relatedArticles: []
    }));
  } catch (error) {
    console.error('Error fetching real news:', error);
    return [];
  }
}

export async function fetchAndAnalyzeNews(): Promise<NewsArticle[]> {
  // Check cache first
  if (newsCache && Date.now() - newsCache.timestamp < CACHE_DURATION) {
    return newsCache.articles;
  }

  // Fetch real news
  const realNews = await fetchRealNews();
  
  // Combine with sample news for variety
  const allNews: NewsArticle[] = [...realNews];

  // Try to enhance news with AI analysis using available providers
  try {
    const enhancedNews = await Promise.all(
      allNews.map(async (article) => {
        // Try OpenAI first
        if (openai) {
          const openaiAnalysis = await analyzeWithOpenAI(article);
          if (openaiAnalysis) return { ...article, ...openaiAnalysis };
        }
        
        // Fallback to Gemini
        if (genAI) {
          const geminiAnalysis = await analyzeWithGemini(article);
          if (geminiAnalysis) return { ...article, ...geminiAnalysis };
        }
        
        return article;
      })
    );

    // Update cache
    newsCache = {
      articles: enhancedNews,
      timestamp: Date.now()
    };

    return enhancedNews.map(article => ({
      ...article,
      aiSummary: article.aiSummary || '',
      aiInsights: article.aiInsights || [],
      aiSentiment: (article.aiSentiment as 'positive' | 'negative' | 'neutral') || 'neutral'
    }));
  } catch (error) {
    console.error('Error enhancing news with AI:', error);
    return allNews;
  }
}

// Track user engagement
export async function trackEngagement(articleId: string, action: 'view' | 'like' | 'comment') {
  try {
    // In a real application, this would update a database
    // For now, we'll just update the cache
    if (newsCache) {
      const article = newsCache.articles.find(a => a.id === articleId);
      if (article) {
        switch (action) {
          case 'view':
            article.views = (article.views || 0) + 1;
            break;
          case 'like':
            article.likes = (article.likes || 0) + 1;
            break;
          case 'comment':
            article.comments = (article.comments || 0) + 1;
            break;
        }
      }
    }
  } catch (error) {
    console.error('Error tracking engagement:', error);
  }
}

// Get personalized recommendations
export async function getPersonalizedRecommendations(userId: string): Promise<NewsArticle[]> {
  // In a real application, this would use user preferences and viewing history
  // For now, we'll return trending articles based on views
  if (!newsCache) return [];
  
  return [...newsCache.articles]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);
}

async function analyzeWithOpenAI(article: NewsArticle) {
  if (!openai) return null;

  const prompt = `
    Analyze the following news article and provide:
    1. A concise summary
    2. Key insights (3 bullet points)
    3. Sentiment analysis (positive, neutral, or negative)
    
    Title: ${article.title}
    Description: ${article.description}
    Category: ${article.category}
    Region: ${article.region}
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional news analyst providing concise, accurate analysis of news articles."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content;
    if (!response) return null;
    
    return parseAIResponse(response);
  } catch (error) {
    console.error('Error analyzing with OpenAI:', error);
    return null;
  }
}

async function analyzeWithGemini(article: NewsArticle) {
  if (!genAI) return null;

  const prompt = `
    Analyze the following news article and provide:
    1. A concise summary
    2. Key insights (3 bullet points)
    3. Sentiment analysis (positive, neutral, or negative)
    
    Title: ${article.title}
    Description: ${article.description}
    Category: ${article.category}
    Region: ${article.region}
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    if (!response) return null;
    
    return parseAIResponse(response);
  } catch (error) {
    console.error('Error analyzing with Gemini:', error);
    return null;
  }
}

function parseAIResponse(response: string): {
  aiSummary: string;
  aiInsights: string[];
  aiSentiment: 'positive' | 'negative' | 'neutral';
} {
  const [summary, insights, sentiment] = response.split('\n\n');
  
  let parsedSentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  const sentimentText = sentiment.replace('Sentiment:', '').trim().toLowerCase();
  if (sentimentText.includes('positive')) {
    parsedSentiment = 'positive';
  } else if (sentimentText.includes('negative')) {
    parsedSentiment = 'negative';
  }
  
  return {
    aiSummary: summary.replace('Summary:', '').trim(),
    aiInsights: insights
      .replace('Key Insights:', '')
      .trim()
      .split('\n')
      .map(insight => insight.replace(/^[-•*]\s*/, '')),
    aiSentiment: parsedSentiment
  };
} 