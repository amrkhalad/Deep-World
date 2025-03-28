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

// Content management service for games, courses, and trainings
interface Game {
  id: string;
  title: string;
  description: string;
  developer: string;
  category: string;
  difficulty: string;
  duration: string;
  price: number;
  rating: number;
  players: string;
  imageUrl: string;
  features: string[];
  tips: string[];
  systemRequirements: {
    os: string;
    processor: string;
    memory: string;
    graphics: string;
    storage: string;
  };
  tags: string[];
  downloadLink: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  isFree: boolean;
  duration: string;
  level: string;
  enrollmentStatus: string;
  downloadLink: string;
  thumbnailUrl: string;
  prerequisites: string[];
  syllabus: string[];
  pros: string[];
  cons: string[];
  tags: string[];
  learningPath: string[];
}

interface Training {
  id: string;
  title: string;
  description: string;
  provider: string;
  price: number;
  isFree: boolean;
  duration: string;
  level: string;
  downloadLink: string;
  thumbnailUrl: string;
  pros: string[];
  cons: string[];
  tags: string[];
  objectives: string[];
  targetAudience: string[];
}

// Sample data
export const games: Game[] = [
  {
    id: '1',
    title: 'AI Strategy Challenge',
    description: 'A strategic game where players compete against advanced AI opponents in resource management and tactical warfare.',
    developer: 'Deep World Studios',
    category: 'Strategy',
    difficulty: 'Advanced',
    duration: '20-30 min per match',
    price: 29.99,
    rating: 4.8,
    players: '1-4',
    imageUrl: '/images/games/ai-strategy.jpg',
    features: [
      'Dynamic AI opponents that adapt to player strategies',
      'Real-time strategy elements with AI-powered unit behavior',
      'Advanced resource management with predictive AI',
      'AI-generated mission scenarios',
      'Machine learning-based difficulty scaling'
    ],
    tips: [
      'Focus on early resource gathering',
      'Build a balanced army composition',
      'Study AI patterns and adapt your strategy',
      'Use AI-generated insights for optimal resource allocation',
      'Leverage AI-powered unit formations for tactical advantage'
    ],
    systemRequirements: {
      os: 'Windows 10/11',
      processor: 'Intel i5 or equivalent',
      memory: '8 GB RAM',
      graphics: 'NVIDIA GTX 1660 or equivalent',
      storage: '10 GB available space'
    },
    tags: ['Strategy', 'AI', 'Multiplayer', 'Resource Management', 'Machine Learning'],
    downloadLink: '/downloads/games/ai-strategy-challenge'
  },
  {
    id: '2',
    title: 'Neural Network Puzzle',
    description: 'An educational puzzle game that teaches players about neural networks through interactive challenges.',
    developer: 'AI Learning Labs',
    category: 'Educational',
    difficulty: 'Intermediate',
    duration: '15-20 min per level',
    price: 19.99,
    rating: 4.6,
    players: '1',
    imageUrl: '/images/games/neural-puzzle.jpg',
    features: [
      'Real-time neural network visualization',
      'AI-powered puzzle generation',
      'Adaptive difficulty system',
      'Neural network training simulation',
      'Interactive node connection mechanics'
    ],
    tips: [
      'Start with simple network configurations',
      'Experiment with different layer arrangements',
      'Watch how the AI processes information',
      'Use the visualization tools to understand flow',
      'Learn from AI-generated solutions'
    ],
    systemRequirements: {
      os: 'Windows 10/11, macOS 10.15+',
      processor: 'Intel i3 or equivalent',
      memory: '4 GB RAM',
      graphics: 'Integrated graphics',
      storage: '5 GB available space'
    },
    tags: ['Educational', 'AI', 'Puzzle', 'Neural Networks', 'Learning'],
    downloadLink: '/downloads/games/neural-network-puzzle'
  }
];

export const courses: Course[] = [
  {
    id: '1',
    title: 'AI Development Fundamentals',
    description: 'Learn the basics of artificial intelligence development with practical examples and hands-on projects.',
    instructor: 'Dr. Sarah Chen',
    price: 99.99,
    isFree: false,
    duration: '12 weeks',
    level: 'Intermediate',
    enrollmentStatus: 'Open',
    downloadLink: '/courses/ai-fundamentals',
    thumbnailUrl: '/images/courses/ai-fundamentals.jpg',
    prerequisites: ['Basic Python knowledge', 'Understanding of algorithms'],
    syllabus: [
      'Introduction to AI and Machine Learning',
      'Python for AI Development',
      'Neural Networks Fundamentals',
      'Deep Learning Architectures',
      'Natural Language Processing Basics',
      'Computer Vision Introduction',
      'AI Model Deployment',
      'Ethics in AI Development'
    ],
    pros: [
      'Comprehensive curriculum',
      'Hands-on projects',
      'Industry-relevant content',
      'AI-powered learning assistant',
      'Real-world case studies',
      'Interactive coding exercises'
    ],
    cons: [
      'Requires prior programming knowledge',
      'Time-intensive coursework',
      'Complex mathematical concepts',
      'Regular updates needed for latest AI trends'
    ],
    tags: ['AI', 'Machine Learning', 'Python', 'Deep Learning', 'NLP', 'Computer Vision'],
    learningPath: [
      'Start with Python basics and algorithms',
      'Progress through machine learning fundamentals',
      'Advance to deep learning and neural networks',
      'Specialize in NLP and computer vision',
      'Learn deployment and ethics'
    ]
  },
  {
    id: '2',
    title: 'Advanced AI Applications',
    description: 'Master advanced AI concepts and build real-world applications using cutting-edge technologies.',
    instructor: 'Prof. James Wilson',
    price: 149.99,
    isFree: false,
    duration: '16 weeks',
    level: 'Advanced',
    enrollmentStatus: 'Open',
    downloadLink: '/courses/advanced-ai',
    thumbnailUrl: '/images/courses/advanced-ai.jpg',
    prerequisites: ['AI Development Fundamentals', 'Advanced Python', 'Linear Algebra'],
    syllabus: [
      'Advanced Neural Network Architectures',
      'Reinforcement Learning',
      'Generative AI Models',
      'Large Language Models',
      'AI Model Optimization',
      'Distributed AI Systems',
      'AI Security and Privacy',
      'Future of AI Technology'
    ],
    pros: [
      'Advanced-level content',
      'Industry expert instructors',
      'Latest AI technologies',
      'Research paper analysis',
      'Capstone project',
      'Career guidance'
    ],
    cons: [
      'High technical requirements',
      'Intensive workload',
      'Complex mathematical concepts',
      'Regular updates needed'
    ],
    tags: ['Advanced AI', 'Deep Learning', 'LLMs', 'Reinforcement Learning', 'AI Research'],
    learningPath: [
      'Review fundamental concepts',
      'Study advanced neural networks',
      'Explore reinforcement learning',
      'Master generative AI',
      'Learn about LLMs and their applications'
    ]
  }
];

export const trainings: Training[] = [
  {
    id: '1',
    title: 'AI Ethics Workshop',
    description: 'A comprehensive workshop on ethical considerations in AI development and deployment.',
    provider: 'Deep World Academy',
    price: 149.99,
    isFree: false,
    duration: '2 days',
    level: 'All Levels',
    downloadLink: '/trainings/ai-ethics',
    thumbnailUrl: '/images/trainings/ai-ethics.jpg',
    pros: [
      'Interactive sessions',
      'Real-world case studies',
      'Expert instructors',
      'AI ethics framework development',
      'Industry best practices',
      'Hands-on ethical decision making'
    ],
    cons: [
      'Limited hands-on coding',
      'Intensive schedule',
      'Complex ethical scenarios',
      'Regular updates needed'
    ],
    tags: ['AI Ethics', 'Professional Development', 'Workshop', 'Responsible AI'],
    objectives: [
      'Understand AI ethics principles',
      'Learn about bias and fairness',
      'Explore privacy and security concerns',
      'Develop ethical AI frameworks',
      'Practice ethical decision making'
    ],
    targetAudience: [
      'AI developers and engineers',
      'Project managers',
      'Business leaders',
      'Ethics professionals',
      'Policy makers'
    ]
  },
  {
    id: '2',
    title: 'AI Implementation Bootcamp',
    description: 'Intensive training on implementing AI solutions in enterprise environments.',
    provider: 'Tech Solutions Academy',
    price: 299.99,
    isFree: false,
    duration: '5 days',
    level: 'Intermediate',
    downloadLink: '/trainings/ai-implementation',
    thumbnailUrl: '/images/trainings/ai-implementation.jpg',
    pros: [
      'Practical implementation focus',
      'Enterprise case studies',
      'Industry expert guidance',
      'Hands-on workshops',
      'Best practices for deployment',
      'Performance optimization'
    ],
    cons: [
      'High technical requirements',
      'Intensive schedule',
      'Requires prior AI knowledge',
      'Enterprise-specific focus'
    ],
    tags: ['AI Implementation', 'Enterprise AI', 'Deployment', 'Best Practices'],
    objectives: [
      'Master AI deployment strategies',
      'Learn enterprise integration',
      'Understand scaling and optimization',
      'Develop monitoring systems',
      'Implement security measures'
    ],
    targetAudience: [
      'Enterprise developers',
      'IT professionals',
      'System architects',
      'DevOps engineers',
      'Technical project managers'
    ]
  }
];

// Function to enhance content with AI
export async function enhanceContentWithAI(content: string, type: 'game' | 'course' | 'training') {
  if (!openai && !genAI) return null;

  const prompt = `Analyze and enhance the following ${type} content with AI insights and recommendations:
${content}

Provide:
1. A concise AI summary
2. Key AI features or benefits
3. AI-powered tips or learning objectives
4. Target audience or prerequisites
5. Future AI trends and considerations`;

  try {
    if (openai) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert AI content analyst specializing in ${type}s.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return completion.choices[0].message.content;
    } else if (genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      return result.response.text();
    }
  } catch (error) {
    console.error('Error enhancing content with AI:', error);
    return null;
  }
} 