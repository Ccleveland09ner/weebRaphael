import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, user } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: any;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      checkAuth();
    }
  }, []);

  const checkAuth = async () => {
    try {
      const userProfile = await user.getProfile();
      setUserData(userProfile);
      setIsAuthenticated(true);
      setIsAdmin(userProfile.is_admin);
    } catch (error) {
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { access_token, refresh_token } = await auth.login(email, password);
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      await checkAuth();
      navigate('/');
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      await auth.register(userData);
      await login(userData.email, userData.password);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserData(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        user: userData,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 