import { BaseAPIClient, APIError } from './baseClient';
import { TwitterTweet, APIConfig } from '../../../types/content';

interface TwitterAPIResponse {
  data: TwitterTweet[];
  meta?: {
    newest_id?: string;
    oldest_id?: string;
    result_count: number;
  };
}

export class TwitterAPIClient extends BaseAPIClient {
  private readonly baseUrl = 'https://api.twitter.com/2';

  constructor(config: APIConfig) {
    super(config);
  }

  private getAuthHeader(): string {
    return `Bearer ${this.config.twitterApiKey}`;
  }

  async searchTweets(query: string): Promise<TwitterTweet[]> {
    try {
      const response = await this.get<TwitterAPIResponse>(
        `${this.baseUrl}/tweets/search/recent`,
        {
          query,
          'tweet.fields': 'public_metrics',
          max_results: 100
        },
        {
          headers: {
            'Authorization': this.getAuthHeader()
          }
        }
      );

      return response.data;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('Failed to search Twitter tweets');
    }
  }

  async getTrendingTweets(): Promise<TwitterTweet[]> {
    try {
      const response = await this.get<TwitterAPIResponse>(
        `${this.baseUrl}/tweets/search/recent`,
        {
          query: 'technology OR programming OR AI',
          'tweet.fields': 'public_metrics',
          max_results: 100
        },
        {
          headers: {
            'Authorization': this.getAuthHeader()
          }
        }
      );

      return response.data;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('Failed to fetch trending tweets');
    }
  }
} 