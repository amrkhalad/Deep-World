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

interface Training {
  id: string;
  title: string;
  description: string;
  trainer: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  price: number;
  rating: number;
  maxParticipants: number;
  currentParticipants: number;
  startDate: string;
  endDate: string;
  location: string;
  imageUrl: string;
  aiSummary?: string;
  aiPrerequisites?: string[];
  aiLearningOutcomes?: string[];
  views?: number;
  likes?: number;
  registrations?: number;
  relatedTrainings?: string[];
}

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let trainingCache: {
  trainings: Training[];
  timestamp: number;
} | null = null;

// Sample training data
const sampleTrainings: Training[] = [
  {
    id: '1',
    title: "Leadership Development Workshop",
    description: "Intensive workshop on leadership skills, team management, and strategic thinking.",
    trainer: "Dr. Michael Brown",
    category: "Leadership",
    level: "Intermediate",
    duration: "2 days",
    price: 299.99,
    rating: 4.9,
    maxParticipants: 20,
    currentParticipants: 15,
    startDate: "2024-04-15",
    endDate: "2024-04-16",
    location: "Virtual",
    imageUrl: "/images/trainings/leadership.svg",
    views: 0,
    likes: 0,
    registrations: 0,
    relatedTrainings: []
  },
  {
    id: '2',
    title: "Project Management Certification",
    description: "Comprehensive project management training covering PMP methodology and best practices.",
    trainer: "Sarah Johnson",
    category: "Project Management",
    level: "Advanced",
    duration: "5 days",
    price: 499.99,
    rating: 4.7,
    maxParticipants: 25,
    currentParticipants: 18,
    startDate: "2024-05-01",
    endDate: "2024-05-05",
    location: "Hybrid",
    imageUrl: "/images/trainings/project-management.svg",
    views: 0,
    likes: 0,
    registrations: 0,
    relatedTrainings: []
  },
  {
    id: '3',
    title: "Data Analytics Bootcamp",
    description: "Intensive training on data analysis, visualization, and business intelligence tools.",
    trainer: "Alex Chen",
    category: "Data Science",
    level: "Beginner",
    duration: "3 days",
    price: 399.99,
    rating: 4.8,
    maxParticipants: 30,
    currentParticipants: 22,
    startDate: "2024-04-20",
    endDate: "2024-04-22",
    location: "In-person",
    imageUrl: "/images/trainings/data-analytics.svg",
    views: 0,
    likes: 0,
    registrations: 0,
    relatedTrainings: []
  }
];

export async function fetchAndAnalyzeTrainings(): Promise<Training[]> {
  // Check cache first
  if (trainingCache && Date.now() - trainingCache.timestamp < CACHE_DURATION) {
    return trainingCache.trainings;
  }

  // Try to enhance trainings with AI analysis
  try {
    const enhancedTrainings = await Promise.all(
      sampleTrainings.map(async (training) => {
        // Try OpenAI first
        if (openai) {
          const openaiAnalysis = await analyzeWithOpenAI(training);
          if (openaiAnalysis) return { ...training, ...openaiAnalysis };
        }
        
        // Fallback to Gemini
        if (genAI) {
          const geminiAnalysis = await analyzeWithGemini(training);
          if (geminiAnalysis) return { ...training, ...geminiAnalysis };
        }
        
        return training;
      })
    );

    // Update cache
    trainingCache = {
      trainings: enhancedTrainings,
      timestamp: Date.now()
    };

    return enhancedTrainings;
  } catch (error) {
    console.error('Error enhancing trainings with AI:', error);
    return sampleTrainings;
  }
}

// Track user engagement
export async function trackEngagement(trainingId: string, action: 'view' | 'like' | 'register') {
  try {
    if (trainingCache) {
      const training = trainingCache.trainings.find(t => t.id === trainingId);
      if (training) {
        switch (action) {
          case 'view':
            training.views = (training.views || 0) + 1;
            break;
          case 'like':
            training.likes = (training.likes || 0) + 1;
            break;
          case 'register':
            training.registrations = (training.registrations || 0) + 1;
            break;
        }
      }
    }
  } catch (error) {
    console.error('Error tracking engagement:', error);
  }
}

// Get personalized recommendations
export async function getPersonalizedRecommendations(userId: string): Promise<Training[]> {
  if (!trainingCache) return [];
  
  return [...trainingCache.trainings]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 3);
}

async function analyzeWithOpenAI(training: Training) {
  if (!openai) return null;

  const prompt = `
    Analyze the following training session and provide:
    1. A concise summary of what participants will learn
    2. Prerequisites (3 bullet points)
    3. Learning outcomes (3 bullet points)
    
    Title: ${training.title}
    Description: ${training.description}
    Category: ${training.category}
    Level: ${training.level}
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional training analyst providing concise, accurate analysis of training sessions."
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

async function analyzeWithGemini(training: Training) {
  if (!genAI) return null;

  const prompt = `
    Analyze the following training session and provide:
    1. A concise summary of what participants will learn
    2. Prerequisites (3 bullet points)
    3. Learning outcomes (3 bullet points)
    
    Title: ${training.title}
    Description: ${training.description}
    Category: ${training.category}
    Level: ${training.level}
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
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
  const [summary, prerequisites, outcomes] = response.split('\n\n');
  
  return {
    aiSummary: summary.replace('Summary:', '').trim(),
    aiPrerequisites: prerequisites
      .replace('Prerequisites:', '')
      .trim()
      .split('\n')
      .map(prereq => prereq.replace(/^[-•*]\s*/, '')),
    aiLearningOutcomes: outcomes
      .replace('Learning Outcomes:', '')
      .trim()
      .split('\n')
      .map(outcome => outcome.replace(/^[-•*]\s*/, ''))
  };
} 