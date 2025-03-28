class DatabaseService {
  constructor() {
    this.games = [];
    this.courses = [];
    this.trainings = [];
    this.news = [];
  }

  async saveContent(content, type) {
    switch (type) {
      case 'game':
        this.games = [...this.games, ...content];
        console.log(`Saved ${content.length} games. Total games: ${this.games.length}`);
        break;
      case 'course':
        this.courses = [...this.courses, ...content];
        console.log(`Saved ${content.length} courses. Total courses: ${this.courses.length}`);
        break;
      case 'training':
        this.trainings = [...this.trainings, ...content];
        console.log(`Saved ${content.length} trainings. Total trainings: ${this.trainings.length}`);
        break;
      case 'news':
        this.news = [...this.news, ...content];
        console.log(`Saved ${content.length} news articles. Total news: ${this.news.length}`);
        break;
      default:
        throw new Error(`Unknown content type: ${type}`);
    }
  }

  async getGames() {
    return this.games;
  }

  async getCourses() {
    return this.courses;
  }

  async getTrainings() {
    return this.trainings;
  }

  async getNews() {
    return this.news;
  }
}

export const databaseService = new DatabaseService(); 