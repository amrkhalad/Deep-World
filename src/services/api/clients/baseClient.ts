import axios, { AxiosInstance, AxiosError } from 'axios';
import { APIConfig } from '../../../types/content';

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export abstract class BaseAPIClient {
  protected client: AxiosInstance;
  protected config: APIConfig;

  constructor(config: APIConfig) {
    this.config = config;
    this.client = axios.create({
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          const errorMessage = typeof error.response.data === 'object' && error.response.data !== null
            ? (error.response.data as { message?: string }).message || 'API request failed'
            : 'API request failed';
          
          throw new APIError(
            errorMessage,
            error.response.status,
            error.response.data
          );
        }
        if (error.request) {
          throw new APIError('No response received from API');
        }
        throw new APIError('Error setting up API request');
      }
    );
  }

  protected async get<T>(
    url: string,
    params?: Record<string, any>,
    config?: { headers?: Record<string, string> }
  ): Promise<T> {
    try {
      const response = await this.client.get<T>(url, { params, ...config });
      return response.data;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('Unexpected error during API request');
    }
  }

  protected async post<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data);
      return response.data;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('Unexpected error during API request');
    }
  }
} 