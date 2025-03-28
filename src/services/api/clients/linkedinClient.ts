import { BaseAPIClient, APIError } from './baseClient';
import { LinkedInPost, APIConfig } from '../../../types/content';

interface LinkedInAPIResponse {
  elements: LinkedInPost[];
  paging: {
    count: number;
    start: number;
    total: number;
  };
}

export class LinkedInAPIClient extends BaseAPIClient {
  private readonly baseUrl = 'https://api.linkedin.com/v2';

  constructor(config: APIConfig) {
    super(config);
  }

  private getAuthHeader(): string {
    return `Bearer ${this.config.linkedinApiKey}`;
  }

  async searchPosts(query: string): Promise<LinkedInPost[]> {
    try {
      const response = await this.get<LinkedInAPIResponse>(
        `${this.baseUrl}/ugcPosts`,
        {
          q: query,
          count: 100
        },
        {
          headers: {
            'Authorization': this.getAuthHeader()
          }
        }
      );

      return response.elements;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('Failed to search LinkedIn posts');
    }
  }

  async getTrendingPosts(): Promise<LinkedInPost[]> {
    try {
      const response = await this.get<LinkedInAPIResponse>(
        `${this.baseUrl}/ugcPosts`,
        {
          q: 'technology OR programming OR AI',
          count: 100
        },
        {
          headers: {
            'Authorization': this.getAuthHeader()
          }
        }
      );

      return response.elements;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('Failed to fetch trending LinkedIn posts');
    }
  }
} 