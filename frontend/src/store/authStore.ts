import { create } from 'zustand';
import { User } from '../types/auth';
import { auth } from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  login: async (email, password) => {
    const response = await auth.login({ email, password });
    localStorage.setItem('token', response.token);
    set({ user: response.user, isAuthenticated: true });
  },
  
  logout: () => {
    auth.logout();
    set({ user: null, isAuthenticated: false });
  },
  
  initialize: async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const user = await auth.getProfile();
        set({ user, isAuthenticated: true });
      }
    } catch (error) {
      auth.logout();
      set({ user: null, isAuthenticated: false });
    }
  }
}));