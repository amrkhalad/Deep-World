import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize AI clients
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

interface ContentGenerationRequest {
  title: string;
  description: string;
  type: 'game' | 'course' | 'training' | 'news';
}

interface GeneratedContent {
  features?: string[];
  tips?: string[];
  prerequisites?: string[];
  objectives?: string[];
  targetAudience?: string[];
  systemRequirements?: {
    os: string;
    processor: string;
    memory: string;
    graphics: string;
    storage: string;
  };
  learningPath?: string[];
  pros?: string[];
  cons?: string[];
  tags?: string[];
}

export async function generateContent(request: ContentGenerationRequest): Promise<GeneratedContent> {
  const prompt = generatePrompt(request);
  
  try {
    if (openai) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a content generation assistant that creates detailed content for games, courses, trainings, and news."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const response = completion.choices[0].message.content;
      return parseAIResponse(response, request.type);
    } else if (genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      return parseAIResponse(response, request.type);
    } else {
      throw new Error('No AI service configured');
    }
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

function generatePrompt(request: ContentGenerationRequest): string {
  const { title, description, type } = request;
  
  switch (type) {
    case 'game':
      return `Generate detailed content for a game with the following details:
Title: ${title}
Description: ${description}

Please provide:
1. Key features (5-7 points)
2. Pro tips for players (5 points)
3. System requirements (OS, processor, memory, graphics, storage)
4. Relevant tags (5-7 tags)
Format the response as JSON.`;
    
    case 'course':
      return `Generate detailed content for a course with the following details:
Title: ${title}
Description: ${description}

Please provide:
1. Prerequisites (5-7 points)
2. Learning path (5 steps)
3. Pros and cons (5 each)
4. Relevant tags (5-7 tags)
Format the response as JSON.`;
    
    case 'training':
      return `Generate detailed content for a training program with the following details:
Title: ${title}
Description: ${description}

Please provide:
1. Objectives (5-7 points)
2. Target audience (5-7 points)
3. Pros and cons (5 each)
4. Relevant tags (5-7 tags)
Format the response as JSON.`;
    
    case 'news':
      return `Generate detailed content for a news article with the following details:
Title: ${title}
Description: ${description}

Please provide:
1. Key points (5-7 points)
2. Impact analysis (3-5 points)
3. Future implications (3-5 points)
4. Relevant tags (5-7 tags)
Format the response as JSON.`;
    
    default:
      throw new Error('Invalid content type');
  }
}

function parseAIResponse(response: string, type: string): GeneratedContent {
  try {
    const parsed = JSON.parse(response);
    
    switch (type) {
      case 'game':
        return {
          features: parsed.features,
          tips: parsed.tips,
          systemRequirements: parsed.systemRequirements,
          tags: parsed.tags
        };
      
      case 'course':
        return {
          prerequisites: parsed.prerequisites,
          learningPath: parsed.learningPath,
          pros: parsed.pros,
          cons: parsed.cons,
          tags: parsed.tags
        };
      
      case 'training':
        return {
          objectives: parsed.objectives,
          targetAudience: parsed.targetAudience,
          pros: parsed.pros,
          cons: parsed.cons,
          tags: parsed.tags
        };
      
      case 'news':
        return {
          keyPoints: parsed.keyPoints,
          impactAnalysis: parsed.impactAnalysis,
          futureImplications: parsed.futureImplications,
          tags: parsed.tags
        };
      
      default:
        throw new Error('Invalid content type');
    }
  } catch (error) {
    console.error('Error parsing AI response:', error);
    throw error;
  }
}

// Function to save content to the database
export async function saveContent(content: any, type: string) {
  // Here you would implement the database save logic
  console.log(`Saving ${type} content:`, content);
  return { success: true, id: 'generated-id' };
}

// Function to fetch existing content
export async function fetchContent(type: string) {
  // Here you would implement the database fetch logic
  console.log(`Fetching ${type} content`);
  return [];
} 