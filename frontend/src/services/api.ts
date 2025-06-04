import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_URL}/refresh`, { refresh_token: refreshToken });
        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (error) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/token', { username: email, password });
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
};

export const user = {
  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await api.put('/users/me', data);
    return response.data;
  },
  deleteAccount: async () => {
    await api.delete('/users/me');
  },
};

export const anime = {
  getFavorites: async () => {
    const response = await api.get('/anime/favorites');
    return response.data;
  },
  addFavorite: async (animeData: any) => {
    const response = await api.post('/anime/favorites', animeData);
    return response.data;
  },
  getWatched: async () => {
    const response = await api.get('/anime/watched');
    return response.data;
  },
  addWatched: async (animeData: any) => {
    const response = await api.post('/anime/watched', animeData);
    return response.data;
  },
  getRecommendations: async () => {
    const response = await api.get('/anime/recommendations');
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/anime/stats');
    return response.data;
  },
};

export const admin = {
  searchUsers: async (query: string, page: number = 1, pageSize: number = 10) => {
    const response = await api.get(`/admin/users?query=${query}&page=${page}&page_size=${pageSize}`);
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
};

export default api; 