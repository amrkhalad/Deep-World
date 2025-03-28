import { Game, Course, Training, NewsArticle, ContentType } from '../types/content';

class DatabaseService {
  private games: Game[] = [];
  private courses: Course[] = [];
  private trainings: Training[] = [];
  private news: NewsArticle[] = [];

  async saveContent(content: any[], type: ContentType): Promise<void> {
    switch (type) {
      case 'game':
        this.games = [...this.games, ...content];
        break;
      case 'course':
        this.courses = [...this.courses, ...content];
        break;
      case 'training':
        this.trainings = [...this.trainings, ...content];
        break;
      case 'news':
        this.news = [...this.news, ...content];
        break;
    }
    console.log(`Saved ${content.length} ${type}s to database`);
  }

  async getGames(): Promise<Game[]> {
    return this.games;
  }

  async getCourses(): Promise<Course[]> {
    return this.courses;
  }

  async getTrainings(): Promise<Training[]> {
    return this.trainings;
  }

  async getNews(): Promise<NewsArticle[]> {
    return this.news;
  }
}

export const databaseService = new DatabaseService(); 