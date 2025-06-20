import { create } from 'zustand';
import { User } from '../types/auth';
import { auth } from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    isAdmin: user?.is_admin || false
  }),
  
  login: async (email, password) => {
    try {
      const response = await auth.login({ email, password });
      if (response?.token && response?.user) {
        localStorage.setItem('token', response.token);
        set({ 
          user: response.user, 
          isAuthenticated: true,
          isAdmin: response.user.is_admin
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  logout: () => {
    auth.logout();
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false, isAdmin: false });
  },
  
  initialize: async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const user = await auth.getProfile();
        if (user) {
          set({ 
            user, 
            isAuthenticated: true,
            isAdmin: user.is_admin
          });
        } else {
          throw new Error('No user data received');
        }
      }
    } catch (error) {
      console.error('Initialization error:', error);
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false, isAdmin: false });
    }
  }
}));