import { BaseAPIClient } from './baseClient';
import { StackOverflowQuestion, APIConfig } from '../../../types/content';

export class StackOverflowAPIClient extends BaseAPIClient {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    super('https://api.stackexchange.com/2.3');
    this.apiKey = apiKey;
  }

  async getHotQuestions(): Promise<StackOverflowQuestion[]> {
    try {
      const response = await this.get<{ items: StackOverflowQuestion[] }>('/questions/hot', {
        params: {
          site: 'stackoverflow',
          key: this.apiKey
        }
      });

      return response.items.map(item => ({
        ...item,
        type: 'training' as const
      }));
    } catch (error) {
      console.error('Error fetching hot questions:', error);
      throw error;
    }
  }

  async getTrendingQuestions(): Promise<StackOverflowQuestion[]> {
    try {
      const response = await this.get<{ items: StackOverflowQuestion[] }>('/questions/featured', {
        params: {
          site: 'stackoverflow',
          key: this.apiKey,
          sort: 'hot',
          order: 'desc'
        }
      });

      return response.items.map(item => ({
        ...item,
        type: 'training' as const
      }));
    } catch (error) {
      console.error('Error fetching trending questions:', error);
      throw error;
    }
  }

  async searchQuestions(query: string): Promise<StackOverflowQuestion[]> {
    const response = await this.get<any>('/search/advanced', {
      site: 'stackoverflow',
      q: query,
      sort: 'votes',
      order: 'desc',
      filter: 'withbody'
    });

    return response.items.map((question: any) => ({
      title: question.title,
      body: question.body,
      link: question.link,
      score: question.score
    }));
  }
} 