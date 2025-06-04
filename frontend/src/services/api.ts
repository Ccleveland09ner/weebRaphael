import axios from 'axios';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth';
import { Anime, FavoriteAnime, WatchedAnime, AnimeRecommendation, AnimeStats } from '../types/anime';

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

export const auth = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },
  
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', credentials);
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  getProfile: async () => {
    const { data } = await api.get('/auth/profile');
    return data;
  },
  
  updateProfile: async (updates: Partial<RegisterCredentials>) => {
    const { data } = await api.put('/auth/profile', updates);
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
  
  addWatched: async (animeId: number, rating?: number): Promise<void> => {
    await api.post('/anime/watched', { animeId, rating });
  },
  
  removeWatched: async (animeId: number): Promise<void> => {
    await api.delete(`/anime/watched/${animeId}`);
  },
  
  getRecommendations: async (query?: string): Promise<AnimeRecommendation[]> => {
    const { data } = await api.get('/anime/recommendations', {
      params: { query }
    });
    return data;
  },
  
  getStats: async (): Promise<AnimeStats> => {
    const { data } = await api.get('/anime/stats');
    return data;
  }
};