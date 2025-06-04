import axios from 'axios';
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../types/auth';
import { Anime, FavoriteAnime, WatchedAnime, AnimeRecommendation, AnimeStats, AnimeFilter } from '../types/anime';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', credentials);
      return data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },
  
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', credentials);
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  getProfile: async (): Promise<User> => {
    try {
      const { data } = await api.get<User>('/auth/profile');
      return data;
    } catch (error) {
      console.error('Get profile API error:', error);
      throw error;
    }
  },
  
  updateProfile: async (updates: Partial<RegisterCredentials>): Promise<User> => {
    const { data } = await api.put<User>('/auth/profile', updates);
    return data;
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/refresh');
    return data;
  }
};

export const animeService = {
  getFavorites: async (): Promise<FavoriteAnime[]> => {
    const { data } = await api.get('/anime/favorites');
    return data;
  },
  
  addFavorite: async (animeId: number): Promise<void> => {
    await api.post('/anime/favorites', { animeId });
  },
  
  removeFavorite: async (animeId: number): Promise<void> => {
    await api.delete(`/anime/favorites/${animeId}`);
  },
  
  getWatched: async (): Promise<WatchedAnime[]> => {
    const { data } = await api.get('/anime/watched');
    return data;
  },
  
  addWatched: async (animeId: number, rating?: number, review?: string): Promise<void> => {
    await api.post('/anime/watched', { animeId, rating, review });
  },
  
  removeWatched: async (animeId: number): Promise<void> => {
    await api.delete(`/anime/watched/${animeId}`);
  },
  
  updateWatchedRating: async (animeId: number, rating: number): Promise<void> => {
    await api.put(`/anime/watched/${animeId}/rating`, { rating });
  },
  
  getRecommendations: async (query?: string, filters?: AnimeFilter): Promise<AnimeRecommendation[]> => {
    const { data } = await api.get('/anime/recommendations', {
      params: { query, ...filters }
    });
    return Array.isArray(data) ? data : [];
  },
  
  getStats: async (): Promise<AnimeStats> => {
    const { data } = await api.get('/anime/stats');
    return data;
  },

  searchAnime: async (query: string, filters?: AnimeFilter): Promise<Anime[]> => {
    const { data } = await api.get('/anime/search', {
      params: { query, ...filters }
    });
    return data;
  },

  getAnimeDetails: async (id: number): Promise<Anime> => {
    const { data } = await api.get(`/anime/${id}`);
    return data;
  },

  getPopularAnime: async (filters?: AnimeFilter): Promise<Anime[]> => {
    const { data } = await api.get('/anime/popular', {
      params: filters
    });
    return data;
  },

  getTopRatedAnime: async (filters?: AnimeFilter): Promise<Anime[]> => {
    const { data } = await api.get('/anime/top-rated', {
      params: filters
    });
    return data;
  }
};