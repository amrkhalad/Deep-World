import { BaseAPIClient, APIError } from './baseClient';
import { NewsArticle, APIConfig } from '../../../types/content';

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export class NewsAPIClient extends BaseAPIClient {
  private readonly baseUrl = 'https://newsapi.org/v2';

  constructor(config: APIConfig) {
    super(config);
  }

  async getTopHeadlines(country: string = 'us'): Promise<NewsArticle[]> {
    try {
      const response = await this.get<NewsAPIResponse>(`${this.baseUrl}/top-headlines`, {
        country,
        apiKey: this.config.newsApiKey
      });

      if (response.status !== 'ok') {
        throw new APIError('News API returned an error status');
      }

      return response.articles;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('Failed to fetch top headlines');
    }
  }

  async searchNews(query: string): Promise<NewsArticle[]> {
    try {
      const response = await this.get<NewsAPIResponse>(`${this.baseUrl}/everything`, {
        q: query,
        apiKey: this.config.newsApiKey
      });

      if (response.status !== 'ok') {
        throw new APIError('News API returned an error status');
      }

      return response.articles;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('Failed to search news');
    }
  }
} 