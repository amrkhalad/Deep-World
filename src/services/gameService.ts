import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize AI clients
const openai = process.env.OPENAI_API_KEY && 
  process.env.OPENAI_API_KEY !== 'your_api_key_here' && 
  process.env.OPENAI_API_KEY.length > 0
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    }) 
  : null;

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

interface Game {
  id: string;
  title: string;
  description: string;
  developer: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: string;
  price: number;
  rating: number;
  players: number;
  imageUrl: string;
  aiSummary?: string;
  aiFeatures?: string[];
  aiTips?: string[];
  views?: number;
  likes?: number;
  plays?: number;
  relatedGames?: string[];
}

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let gameCache: {
  games: Game[];
  timestamp: number;
} | null = null;

// Sample games data
const sampleGames: Game[] = [
  {
    id: '1',
    title: "AI Strategy Challenge",
    description: "Test your strategic thinking against AI opponents in this engaging strategy game.",
    developer: "GameTech Studios",
    category: "Strategy",
    difficulty: "Medium",
    duration: "30-45 minutes",
    price: 19.99,
    rating: 4.8,
    players: 1000,
    imageUrl: "/images/games/strategy.svg",
    views: 0,
    likes: 0,
    plays: 0,
    relatedGames: []
  },
  {
    id: '2',
    title: "Code Quest",
    description: "Learn programming concepts through an exciting adventure game.",
    developer: "EduGames Inc",
    category: "Educational",
    difficulty: "Easy",
    duration: "20-30 minutes",
    price: 14.99,
    rating: 4.6,
    players: 800,
    imageUrl: "/images/games/code-quest.svg",
    views: 0,
    likes: 0,
    plays: 0,
    relatedGames: []
  },
  {
    id: '3',
    title: "Data Detective",
    description: "Solve mysteries using data analysis and critical thinking skills.",
    developer: "BrainGames",
    category: "Puzzle",
    difficulty: "Hard",
    duration: "45-60 minutes",
    price: 24.99,
    rating: 4.7,
    players: 600,
    imageUrl: "/images/games/data-detective.svg",
    views: 0,
    likes: 0,
    plays: 0,
    relatedGames: []
  }
];

export async function fetchAndAnalyzeGames(): Promise<Game[]> {
  // Check cache first
  if (gameCache && Date.now() - gameCache.timestamp < CACHE_DURATION) {
    return gameCache.games;
  }

  // Try to enhance games with AI analysis
  try {
    const enhancedGames = await Promise.all(
      sampleGames.map(async (game) => {
        // Try OpenAI first
        if (openai) {
          const openaiAnalysis = await analyzeWithOpenAI(game);
          if (openaiAnalysis) return { ...game, ...openaiAnalysis };
        }
        
        // Fallback to Gemini
        if (genAI) {
          const geminiAnalysis = await analyzeWithGemini(game);
          if (geminiAnalysis) return { ...game, ...geminiAnalysis };
        }
        
        return game;
      })
    );

    // Update cache
    gameCache = {
      games: enhancedGames,
      timestamp: Date.now()
    };

    return enhancedGames;
  } catch (error) {
    console.error('Error enhancing games with AI:', error);
    return sampleGames;
  }
}

// Track user engagement
export async function trackEngagement(gameId: string, action: 'view' | 'like' | 'play') {
  try {
    if (gameCache) {
      const game = gameCache.games.find(g => g.id === gameId);
      if (game) {
        switch (action) {
          case 'view':
            game.views = (game.views || 0) + 1;
            break;
          case 'like':
            game.likes = (game.likes || 0) + 1;
            break;
          case 'play':
            game.plays = (game.plays || 0) + 1;
            break;
        }
      }
    }
  } catch (error) {
    console.error('Error tracking engagement:', error);
  }
}

// Get personalized recommendations
export async function getPersonalizedRecommendations(userId: string): Promise<Game[]> {
  if (!gameCache) return [];
  
  return [...gameCache.games]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 3);
}

async function analyzeWithOpenAI(game: Game) {
  if (!openai) return null;

  const prompt = `
    Analyze the following game and provide:
    1. A concise summary of the gameplay experience
    2. Key features (3 bullet points)
    3. Tips for success (3 bullet points)
    
    Title: ${game.title}
    Description: ${game.description}
    Category: ${game.category}
    Difficulty: ${game.difficulty}
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional game analyst providing concise, accurate analysis of educational games."
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

async function analyzeWithGemini(game: Game) {
  if (!genAI) return null;

  const prompt = `
    Analyze the following game and provide:
    1. A concise summary of the gameplay experience
    2. Key features (3 bullet points)
    3. Tips for success (3 bullet points)
    
    Title: ${game.title}
    Description: ${game.description}
    Category: ${game.category}
    Difficulty: ${game.difficulty}
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

function parseAIResponse(response: string) {
  const [summary, features, tips] = response.split('\n\n');
  
  return {
    aiSummary: summary.replace('Summary:', '').trim(),
    aiFeatures: features
      .replace('Key Features:', '')
      .trim()
      .split('\n')
      .map(feature => feature.replace(/^[-•*]\s*/, '')),
    aiTips: tips
      .replace('Tips for Success:', '')
      .trim()
      .split('\n')
      .map(tip => tip.replace(/^[-•*]\s*/, ''))
  };
} 