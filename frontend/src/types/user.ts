export interface UserSearchResponse {
  users: User[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
  is_active: boolean;
}

export interface UserStats {
  total_users: number;
  active_users: number;
  average_age: number;
  new_users_24h: number;
}