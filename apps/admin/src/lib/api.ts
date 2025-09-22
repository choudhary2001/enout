import { z } from 'zod';

/**
 * API client configuration
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
const DEFAULT_TIMEOUT = 10000; // 10 seconds

/**
 * API error class
 */
export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Fetch options with timeout
 */
interface FetchOptions extends RequestInit {
  timeout?: number;
}

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(url: string, options: FetchOptions = {}): Promise<Response> {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(
        `API request failed: ${response.status} ${response.statusText} - ${errorText}`,
        response.status
      );
    }
    
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(`Request timed out after ${timeout}ms`, 408);
    }
    
    throw new ApiError(`Request failed: ${(error as Error).message}`, 500);
  } finally {
    clearTimeout(id);
  }
}

/**
 * API client
 */
export const api = {
  /**
   * Make a GET request to the API
   * @param path API path
   * @param schema Zod schema to validate the response
   * @param options Fetch options
   * @returns Validated response data
   */
  async get<T>(path: string, schema: z.ZodType<T>, options: FetchOptions = {}): Promise<T> {
    const url = `${API_BASE_URL}${path}`;
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    
    const data = await response.json();
    return schema.parse(data);
  },
  
  /**
   * Make a POST request to the API
   * @param path API path
   * @param body Request body
   * @param schema Zod schema to validate the response
   * @param options Fetch options
   * @returns Validated response data
   */
  async post<T>(path: string, body: unknown, schema: z.ZodType<T>, options: FetchOptions = {}): Promise<T> {
    const url = `${API_BASE_URL}${path}`;
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      ...options,
    });
    
    const data = await response.json();
    return schema.parse(data);
  },
};
