const OpenAI = require('openai');
const { Game, Course, Training, NewsArticle } = require('../types/content');

interface AIGeneratedContent {
  games: Game[];
  news: NewsArticle[];
  courses: Course[];
  trainings: Training[];
}

class ContentGeneratorService {
  private openai: any;
  private contentInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.openai = process.env.OPENAI_API_KEY ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    }) : null;
  }

  private async generateGames(count: number): Promise<Game[]> {
    const prompt = `Generate ${count} educational games related to technology, programming, and AI.
For each game, provide:
1. Title
2. Description
3. Genre
4. Rating (1-5)
5. Download link (placeholder)
6. Thumbnail URL (placeholder)
7. System requirements
8. Tags
Format as JSON array.`;

    try {
      if (this.openai) {
        const completion = await this.openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a game design assistant that creates educational games."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error('No content generated');
        return JSON.parse(content);
      }
    } catch (error) {
      console.error('Error generating games:', error);
    }
    return [];
  }

  private async generateNews(count: number): Promise<NewsArticle[]> {
    // Use NewsAPI to get real news articles
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${process.env.NEWS_API_KEY}`
      );
      const data = await response.json();
      return data.articles.slice(0, count).map((article: any) => ({
        id: article.url,
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        imageUrl: article.urlToImage,
        publishedAt: new Date(article.publishedAt),
        source: article.source.name,
        author: article.author
      }));
    } catch (error) {
      console.error('Error generating news:', error);
    }
    return [];
  }

  private async generateCourses(count: number): Promise<Course[]> {
    const prompt = `Generate ${count} courses related to technology, programming, and AI.
For each course, provide:
1. Title
2. Description
3. Instructor
4. Price (half should be free)
5. Duration
6. Level (beginner/intermediate/advanced)
7. Download link (placeholder)
8. Thumbnail URL (placeholder)
9. Pros
10. Cons
11. Tags
Format as JSON array.`;

    try {
      if (this.openai) {
        const completion = await this.openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a course creation assistant that designs educational courses."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error('No content generated');
        return JSON.parse(content);
      }
    } catch (error) {
      console.error('Error generating courses:', error);
    }
    return [];
  }

  private async generateTrainings(count: number): Promise<Training[]> {
    const prompt = `Generate ${count} training programs related to technology, programming, and AI.
For each training, provide:
1. Title
2. Description
3. Provider
4. Price (half should be free)
5. Duration
6. Level (beginner/intermediate/advanced)
7. Download link (placeholder)
8. Thumbnail URL (placeholder)
9. Pros
10. Cons
11. Tags
Format as JSON array.`;

    try {
      if (this.openai) {
        const completion = await this.openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a training program assistant that creates professional training programs."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error('No content generated');
        return JSON.parse(content);
      }
    } catch (error) {
      console.error('Error generating trainings:', error);
    }
    return [];
  }

  async generateInitialContent(): Promise<AIGeneratedContent> {
    try {
      const [games, news, courses, trainings] = await Promise.all([
        this.generateGames(20),
        this.generateNews(20),
        this.generateCourses(20),
        this.generateTrainings(20)
      ]);

      return {
        games,
        news,
        courses,
        trainings
      };
    } catch (error) {
      console.error('Error generating initial content:', error);
      throw error;
    }
  }

  async generateHourlyContent(): Promise<AIGeneratedContent> {
    try {
      const [game, news, course, training] = await Promise.all([
        this.generateGames(1),
        this.generateNews(1),
        this.generateCourses(1),
        this.generateTrainings(1)
      ]);

      return {
        games: game,
        news: news,
        courses: course,
        trainings: training
      };
    } catch (error) {
      console.error('Error generating hourly content:', error);
      throw error;
    }
  }

  startHourlyContentGeneration(): void {
    // Generate initial content
    this.generateInitialContent().catch(console.error);

    // Set up hourly interval
    this.contentInterval = setInterval(() => {
      this.generateHourlyContent().catch(console.error);
    }, 3600000); // 1 hour in milliseconds
  }

  stopHourlyContentGeneration(): void {
    if (this.contentInterval) {
      clearInterval(this.contentInterval);
      this.contentInterval = null;
    }
  }
}

module.exports = { ContentGeneratorService }; 