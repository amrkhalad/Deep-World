import { BaseAPIClient } from './baseClient';
import { RedditPost } from '@/types/content';

export class RedditAPIClient extends BaseAPIClient {
  private accessToken: string | null = null;

  constructor(clientId: string, clientSecret: string) {
    super('https://oauth.reddit.com', {
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    });
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) return this.accessToken;

    const response = await this.post<{ access_token: string }>('https://www.reddit.com/api/v1/access_token', {
      grant_type: 'client_credentials'
    });

    this.accessToken = response.access_token;
    return this.accessToken;
  }

  async getHotPosts(subreddit: string = 'programming'): Promise<RedditPost[]> {
    const token = await this.getAccessToken();
    const response = await this.get<any>(`/r/${subreddit}/hot`, {
      limit: 25
    });

    return response.data.children.map((post: any) => ({
      data: {
        title: post.data.title,
        selftext: post.data.selftext,
        permalink: `https://reddit.com${post.data.permalink}`,
        subreddit: post.data.subreddit,
        score: post.data.score
      }
    }));
  }

  async getTrendingPosts(subreddit: string = 'programming'): Promise<RedditPost[]> {
    const token = await this.getAccessToken();
    const response = await this.get<any>(`/r/${subreddit}/top`, {
      t: 'day',
      limit: 25
    });

    return response.data.children.map((post: any) => ({
      data: {
        title: post.data.title,
        selftext: post.data.selftext,
        permalink: `https://reddit.com${post.data.permalink}`,
        subreddit: post.data.subreddit,
        score: post.data.score
      }
    }));
  }
} 