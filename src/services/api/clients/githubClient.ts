import { BaseAPIClient } from './baseClient';
import { GitHubRepo } from '@/types/content';

export class GitHubAPIClient extends BaseAPIClient {
  constructor(token: string) {
    super('https://api.github.com', {
      'Authorization': `token ${token}`
    });
  }

  async getTrendingRepos(): Promise<GitHubRepo[]> {
    const response = await this.get<any>('/search/repositories', {
      q: 'stars:>1000 language:typescript language:javascript',
      sort: 'stars',
      order: 'desc',
      per_page: 25
    });

    return response.items.map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      stargazers_count: repo.stargazers_count
    }));
  }

  async searchRepos(query: string): Promise<GitHubRepo[]> {
    const response = await this.get<any>('/search/repositories', {
      q: query,
      sort: 'stars',
      order: 'desc',
      per_page: 25
    });

    return response.items.map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      stargazers_count: repo.stargazers_count
    }));
  }
} 