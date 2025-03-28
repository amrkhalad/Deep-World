import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import { firebaseService } from './firebaseService.js';

export class ContentGenerationService {
  constructor() {
    this.openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
    this.genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
    this.deepseekApiKey = process.env.DEEPSEEK_API_KEY || null;
    this.hourlyUpdateInterval = null;
  }

  async generateInitialContent() {
    try {
      // Generate 20 games
      const games = await this.generateGames(20);
      await this.saveContent(games, 'games');

      // Generate 20 news articles
      const news = await this.generateNews(20);
      await this.saveContent(news, 'news');

      // Generate 20 courses (10 free, 10 paid)
      const courses = await this.generateCourses(20);
      await this.saveContent(courses, 'courses');

      // Generate 20 training programs
      const trainings = await this.generateTrainings(20);
      await this.saveContent(trainings, 'trainings');

      console.log('Initial content generation completed successfully');
    } catch (error) {
      console.error('Error generating initial content:', error);
      throw error;
    }
  }

  async generateGames(count) {
    const prompt = `Generate ${count} unique and engaging educational games related to technology, programming, and AI.
For each game, provide:
1. Title
2. Description
3. Genre
4. System requirements
5. Download link (placeholder)
6. Thumbnail URL (placeholder)
7. Tags
8. Difficulty level
9. Learning objectives
10. Target audience
Format as JSON array.`;

    const games = await this.generateContentWithAI(prompt, count);
    return games.map((game) => ({
      ...game,
      rating: 0,
      downloadLink: `https://example.com/games/${game.title.toLowerCase().replace(/\s+/g, '-')}`,
      thumbnailUrl: `https://example.com/images/games/${game.title.toLowerCase().replace(/\s+/g, '-')}.jpg`,
      systemRequirements: game.systemRequirements || 'Not specified',
      difficulty: game.difficulty || 'intermediate',
      learningObjectives: game.learningObjectives || [],
      targetAudience: game.targetAudience || 'General'
    }));
  }

  async generateNews(count) {
    const prompt = `Generate ${count} latest technology news articles.
For each article, provide:
1. Title
2. Description
3. Content
4. URL (placeholder)
5. Image URL (placeholder)
6. Source
7. Author
8. Category
9. Tags
10. Reading time
Format as JSON array.`;

    const news = await this.generateContentWithAI(prompt, count);
    return news.map((article) => ({
      ...article,
      url: `https://example.com/news/${article.title.toLowerCase().replace(/\s+/g, '-')}`,
      imageUrl: `https://example.com/images/news/${article.title.toLowerCase().replace(/\s+/g, '-')}.jpg`,
      publishedAt: new Date(),
      category: article.category || 'Technology',
      readingTime: article.readingTime || '5 min'
    }));
  }

  async generateCourses(count) {
    const prompt = `Generate ${count} educational courses (${count/2} free, ${count/2} paid).
For each course, provide:
1. Title
2. Description
3. Instructor
4. Price (0 for free courses)
5. Duration
6. Level (beginner/intermediate/advanced)
7. Download link (placeholder)
8. Thumbnail URL (placeholder)
9. Pros
10. Cons
11. Tags
12. Prerequisites
13. Learning objectives
14. Course outline
Format as JSON array.`;

    const courses = await this.generateContentWithAI(prompt, count);
    return courses.map((course) => ({
      ...course,
      downloadLink: `https://example.com/courses/${course.title.toLowerCase().replace(/\s+/g, '-')}`,
      thumbnailUrl: `https://example.com/images/courses/${course.title.toLowerCase().replace(/\s+/g, '-')}.jpg`,
      prerequisites: course.prerequisites || [],
      learningObjectives: course.learningObjectives || [],
      courseOutline: course.courseOutline || []
    }));
  }

  async generateTrainings(count) {
    const prompt = `Generate ${count} professional training programs.
For each training, provide:
1. Title
2. Description
3. Provider
4. Price
5. Duration
6. Level (beginner/intermediate/advanced)
7. Download link (placeholder)
8. Thumbnail URL (placeholder)
9. Pros
10. Cons
11. Tags
12. Prerequisites
13. Learning objectives
14. Training outline
15. Certification details
Format as JSON array.`;

    const trainings = await this.generateContentWithAI(prompt, count);
    return trainings.map((training) => ({
      ...training,
      downloadLink: `https://example.com/trainings/${training.title.toLowerCase().replace(/\s+/g, '-')}`,
      thumbnailUrl: `https://example.com/images/trainings/${training.title.toLowerCase().replace(/\s+/g, '-')}.jpg`,
      prerequisites: training.prerequisites || [],
      learningObjectives: training.learningObjectives || [],
      trainingOutline: training.trainingOutline || [],
      certificationDetails: training.certificationDetails || 'No certification provided'
    }));
  }

  async generateContentWithAI(prompt, count) {
    try {
      // Try OpenAI first
      if (this.openai) {
        const completion = await this.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a content generation assistant that creates high-quality educational content."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4000,
        });

        const content = completion.choices[0].message.content;
        if (!content) {
          throw new Error('No content received from OpenAI');
        }
        return JSON.parse(content);
      }

      // Try Gemini if OpenAI fails
      if (this.genAI) {
        const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const content = result.response.text();
        if (!content) {
          throw new Error('No content received from Gemini');
        }
        return JSON.parse(content);
      }

      // Try DeepSeek if both OpenAI and Gemini fail
      if (this.deepseekApiKey) {
        const response = await axios.post(
          'https://api.deepseek.com/v1/chat/completions',
          {
            model: "deepseek-chat",
            messages: [
              {
                role: "system",
                content: "You are a content generation assistant that creates high-quality educational content."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 4000,
          },
          {
            headers: {
              'Authorization': `Bearer ${this.deepseekApiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const content = response.data.choices[0].message.content;
        if (!content) {
          throw new Error('No content received from DeepSeek');
        }
        return JSON.parse(content);
      }

      throw new Error('No AI service available');
    } catch (error) {
      console.error('Error generating content with AI:', error);
      throw error;
    }
  }

  async saveContent(content, type) {
    await firebaseService.saveContent(content, type);
  }

  startHourlyUpdates() {
    // Stop any existing interval
    if (this.hourlyUpdateInterval) {
      clearInterval(this.hourlyUpdateInterval);
    }

    // Start new interval
    this.hourlyUpdateInterval = setInterval(async () => {
      try {
        // Generate one of each content type
        const [game, news, course, training] = await Promise.all([
          this.generateGames(1),
          this.generateNews(1),
          this.generateCourses(1),
          this.generateTrainings(1)
        ]);

        // Save the new content
        await Promise.all([
          this.saveContent(game, 'games'),
          this.saveContent(news, 'news'),
          this.saveContent(course, 'courses'),
          this.saveContent(training, 'trainings')
        ]);

        console.log('Hourly content update completed successfully');
      } catch (error) {
        console.error('Error in hourly content update:', error);
      }
    }, 60 * 60 * 1000); // Run every hour
  }

  stopHourlyUpdates() {
    if (this.hourlyUpdateInterval) {
      clearInterval(this.hourlyUpdateInterval);
      this.hourlyUpdateInterval = null;
    }
  }
} 