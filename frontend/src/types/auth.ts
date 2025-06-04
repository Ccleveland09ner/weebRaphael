export interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  isAdmin: boolean;
  isActive: boolean;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  favoriteGenres?: string[];
  emailNotifications?: boolean;
  theme?: 'light' | 'dark';
  language?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  age: number;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface PasswordReset {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileUpdate {
  name?: string;
  email?: string;
  age?: number;
  currentPassword?: string;
  newPassword?: string;
  preferences?: Partial<UserPreferences>;
}