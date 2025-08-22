const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Movie {
  _id: string;
  title: string;
  description?: string;
  releaseDate?: string;
  posterUrl?: string;
  trailerUrl?: string;
  downloadLinks: {
    quality: string;
    size: string;
    url: string;
  }[];
  categories: string[];
  genres: string[];
  language: string;
  views: number;
  rating: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface MoviesResponse {
  movies: Movie[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalMovies: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface Category {
  name: string;
  count: number;
}

export interface Genre {
  name: string;
  count: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Movies API
  async getMovies(params?: {
    page?: number;
    limit?: number;
    category?: string;
    genre?: string;
    language?: string;
    search?: string;
    sortBy?: string;
  }): Promise<ApiResponse<MoviesResponse>> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = `/movies${queryString ? `?${queryString}` : ''}`;
    
    return this.request<MoviesResponse>(endpoint);
  }

  async getMovieById(id: string): Promise<ApiResponse<Movie>> {
    return this.request<Movie>(`/movies/${id}`);
  }

  async getFeaturedMovies(limit?: number): Promise<ApiResponse<Movie[]>> {
    const endpoint = `/movies/featured${limit ? `?limit=${limit}` : ''}`;
    return this.request<Movie[]>(endpoint);
  }

  async searchMovies(query: string): Promise<ApiResponse<Movie[]>> {
    return this.request<Movie[]>(`/movies/search?q=${encodeURIComponent(query)}`);
  }

  // Categories API
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request<Category[]>('/categories');
  }

  // Genres API
  async getGenres(): Promise<ApiResponse<Genre[]>> {
    return this.request<Genre[]>('/genres');
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ message: string; timestamp: string }>> {
    return this.request<{ message: string; timestamp: string }>('/health');
  }
}

export const apiClient = new ApiClient();
export default apiClient;

