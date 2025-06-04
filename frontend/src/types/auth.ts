export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserUpdate {
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}